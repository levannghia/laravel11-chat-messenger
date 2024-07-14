<?php

use App\Http\Controllers\GroupController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified', 'active'])->group(function(){
    Route::get('/', [HomeController::class, 'home'])->name('dashboard');
    Route::get('/user/{user}' , [MessageController::class, 'byUser'])->name('chat.user');
    Route::get('/group/{group}' , [MessageController::class, 'byGroup'])->name('chat.group');

    Route::prefix('message')->name('message.')->group(function(){
        Route::post('/', [MessageController::class, 'store'])->name('store');
        Route::delete('/{message}', [MessageController::class, 'destroy'])->name('destroy');
        Route::get('/older/{message}', [MessageController::class, 'loadOlder'])->name('loadOlder');
    });

    Route::prefix('group')->name('group.')->group(function(){
        Route::post('/', [GroupController::class, 'store'])->name('store');
        Route::put('/{group}', [GroupController::class, 'update'])->name('update');
        Route::delete('/{group}', [GroupController::class, 'destroy'])->name('destroy');
    });

    Route::middleware(['admin'])->prefix('user')->name('user.')->group(function () {
        Route::post('/change-role/{user}', [UserController::class, 'changeRole'])->name('changeRole');
        Route::post('/block-unblock/{user}', [UserController::class, 'blockUnblock'])->name('blockUnblock');
    });

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
