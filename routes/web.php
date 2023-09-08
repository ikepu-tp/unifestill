<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::middleware('auth:web,associations')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';


Route::middleware(['auth:web,associations', 'verified'])->group(function () {
    Route::resource("logs", \ikepu_tp\AccessLogger\app\Http\Controllers\LogController::class)->names("accessLogger")->only(["index",]);
    Route::get("activity-log", [\ikepu_tp\ActivityLog\app\Http\Controllers\ActivityLogController::class, "index"])->middleware(["auth:" . config("activity-log.guard")])->name("activity-log.index");
    Route::get('/react', function () {
        return view('react');
    })->name('react');
    Route::fallback(function () {
        return view("app.app");
    });
});
