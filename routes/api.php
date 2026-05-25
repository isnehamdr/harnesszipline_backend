<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\JobEnquiryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// ****************************************************************
// This Api route is used to get all activities in details Page
// ****************************************************************
// Route::get('/activities', [ActivityController::class, 'index']);

// ****************************************************************
// This Api route is used to get all activities in Activity Page
// ****************************************************************

Route::get('/activities', [ActivityController::class, 'indexShow']);

Route::get('/activities/{slug}', [ActivityController::class, 'indexShowActivitySlug']);

Route::get('/blogs', [BlogController::class, 'indexShow']);

Route::get('/blogs/{slug}', [BlogController::class, 'indexShowBlogSlug']);

Route::get('/galleries', [GalleryController::class, 'index']);

Route::get('/ourrooms', [RoomController::class, 'indexShow']);
Route::get('/ourrooms/{slug}', [RoomController::class, 'indexShowRoomSlug']);

Route::get('/ourroomtypes', [RoomTypeController::class, 'indexShow']);
Route::get('/ourroomtypes/{slug}', [RoomTypeController::class, 'indexShowRoomTypeSlug']);

Route::get('/ourservice', [ServiceController::class, 'indexShow']);
Route::get('/ourservice/{slug}', [ServiceController::class, 'indexShowServiceSlug']);

Route::get('/hero', [HomeController::class, 'index']);

Route::post('/jobenquiries', [JobEnquiryController::class, 'store']);


Route::get('/jobs', [JobTableController::class, 'index']);
