<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProgressController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum,associations', 'verified'])->prefix("v1")->group(function () {
    Route::prefix("project/{project}")->scopeBindings()->group(function () {
        Route::apiResource("member", MemberController::class)->names("member")->except(["destroy",]);
        Route::apiResource("report", ReportController::class)->names("report")->only("index");
        Route::apiResource("payment", PaymentController::class)->names("payment")->except(["destroy",]);
        Route::apiResource("category", CategoryController::class)->names("category")->except(["destroy",]);
        Route::apiResource("item", ItemController::class)->names("item")->except(["destroy",]);
        Route::apiResource("account", AccountController::class)->names("account");
        Route::apiResource("progress", ProgressController::class)->names("progress");
        Route::apiResource("check", CheckController::class)->names("check")->except(["destroy", "update"]);
    });
    Route::apiResource("project", ProjectController::class)->names("project");
});
Route::get("v1/project/{project}/account", [AccountController::class, "index"])->name("account.index")->scopeBindings();
Route::put("v1/progress/{progress}", [ProgressController::class, "update"])->name("progress.guest.update");