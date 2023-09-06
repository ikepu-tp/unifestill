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
use Illuminate\Support\Str;

class AccountController extends Controller
{
    /**
     * Display a listing of the resource.
     * @todo フィルターの作成
     */
    public function index(AccountRequest $request, Project $project)
    {
        $account = $project->accounts();

        return Resource::pagination($account, AccountResource::class);
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

            return Resource::create(new AccountResource($account));
        }
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