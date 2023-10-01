<?php

namespace App\Http\Controllers;

use App\Exceptions\Error\DeleteFailedException;
use App\Exceptions\Error\NotExistRecordException;
use App\Exceptions\Error\SaveFailedException;
use App\Models\Account;
use App\Http\Requests\AccountRequest;
use App\Http\Resources\AccountResource;
use App\Http\Resources\Resource;
use App\Models\Account_item;
use App\Models\Account_payment;
use App\Models\Item;
use App\Models\Member;
use App\Models\Payment;
use App\Models\Project;
use App\Services\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     * @todo フィルターの作成
     */
    public function index(AccountRequest $request, Project $project)
    {
        $account = $project->accounts();

        Service::searchKeyword($account, "account_id", $request->query("keyword"));

        $except = $request->query("except");
        if ($except) $account = $account->whereNotIn(
            "accountId",
            explode(",", str_replace(" ", ",", Service::convertFullSpaceToHalfSpace($except)))
        );

        $order_status = $request->query("order_status");
        if ($order_status) $account = $account->where("order_status", $order_status);

        if (Service::convertQueryToBoolean($request->query("sse"))) return $this->indexSSE($request, $account);

        return Resource::pagination($account, AccountResource::class);
    }

    public function indexSSE(Request $request, mixed $account)
    {
        $response = new StreamedResponse(function () use ($account, $request) {
            $last_event_id = $request->header("Last-Event-Id", 0);
            $account = $account->orderBy("id");
            $max = config("unifestill.sse_sec");
            for ($i = 0; $i < $max; ++$i) {
                $model = clone $account;
                $model = $model->where("id", ">", $last_event_id);
                if ($model->count() === 0) {
                    echo "event: ping\n";
                    echo "data: " . $i . "\n";
                    echo "\n";
                }
                $model = $model->get();
                foreach ($model as $resource) {
                    if (!$resource) continue;
                    $last_event_id = $resource->id;
                    echo "event: message\n";
                    echo "data: " . json_encode((new AccountResource($resource))->createArray()) . "\n";
                    echo "id: " . $resource->id . "\n";
                    echo "\n";
                }
                ob_flush();
                flush();

                if (connection_aborted()) break;

                sleep(1);
            }
        });
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('X-Accel-Buffering', 'no');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set("Connection", "keep-alive");
        return $response;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AccountRequest $request, Project $project)
    {
        $account = new Account();
        $account->fill([
            "accountId" => Str::uuid(),
            "project_id" => $project->id,
        ]);

        $account->fill($request->safe(["price"]));
        if (!$member = Member::where("memberId", $request->validated("member_id"))->first()) throw new NotExistRecordException();
        $account->fill(["member_id" => $member->id,]);
        if (!$account->save()) throw new SaveFailedException();

        //payments
        foreach ($request->validated("payments") as $payment) {
            if (!$pay = Payment::where("paymentId", $payment["payment_id"])->first()) {
                $this->fail_save($account);
                throw new NotExistRecordException();
            }
            $account_payment = new Account_payment();
            $account_payment->fill([
                "accountPaymentId" => Str::uuid(),
                "account_id" => $account->id,
                "payment_id" => $pay->id,
                "price" => $payment["price"],
            ]);
            if (!$account_payment->save()) {
                $this->fail_save($account);
                throw new SaveFailedException();
            }
        }

        //items
        foreach ($request->validated("items") as $item) {
            if (!$ite = Item::where("itemId", $item["item_id"])->first()) {
                $this->fail_save($account);
                throw new NotExistRecordException();
            }
            $account_item = new Account_item();
            $account_item->fill([
                "accountItemId" => Str::uuid(),
                "account_id" => $account->id,
                "item_id" => $ite->id,
                "price" => $item["price"],
                "quantity" => $item["quantity"],
            ]);
            if (!$account_item->save()) {
                $this->fail_save($account);
                throw new SaveFailedException();
            }
            //children
            foreach ($item["children"] as $child) {
                if (!$ite = Item::where("itemId", $child["item_id"])->first()) {
                    $this->fail_save($account);
                    throw new NotExistRecordException();
                }
                $account_item_child = new Account_item();
                $account_item_child->fill([
                    "accountItemId" => Str::uuid(),
                    "account_id" => $account->id,
                    "item_id" => $ite->id,
                    "price" => $child["price"],
                    "quantity" => $child["quantity"],
                    "parent_id" => $account_item->id,
                ]);
                if (!$account_item_child->save()) {
                    $this->fail_save($account);
                    throw new SaveFailedException();
                }
            }
        }
        return Resource::create(new AccountResource($account));
    }

    /**
     * 会計子テーブル登録失敗時
     *
     * @param Account $account
     * @return void
     */
    public function fail_save(Account $account)
    {
        $account->refresh();
        $account->delete();
        if ($account->account_payments()->count()) $account->account_payments()->delete();
        if ($account->account_items()->count()) $account->account_items()->delete();
    }

    /**
     * Display the specified resource.
     */
    public function show(AccountRequest $request, Project $project, Account $account)
    {
        return Resource::success(new AccountResource($account));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AccountRequest $request, Project $project, Account $account)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AccountRequest $request, Project $project, Account $account)
    {
        if (!$account->delete()) throw new DeleteFailedException();
        return Resource::NoContent();
    }
}
