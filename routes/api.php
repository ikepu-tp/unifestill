<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CheckController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\PaymentController;
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

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::prefix("project")->group(function () {
        Route::apiResource("member", MemberController::class)->names("member")->except(["destroy",]);
        Route::apiResource("report", ReportController::class)->names("report")->only("index");
        Route::apiResource("payment", PaymentController::class)->names("payment")->except(["destroy",]);
        Route::apiResource("category", CategoryController::class)->names("category")->except(["destroy",]);
        Route::apiResource("item", ItemController::class)->names("item")->except(["destroy",]);
        Route::apiResource("account", AccountController::class)->names("account")->except(["update"]);
        Route::apiResource("check", CheckController::class)->names("check")->except(["destroy", "update"]);
        Route::apiResource("", ProjectController::class)->names("project")->parameters(["" => "project"]);
    });
});