<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\GalleryController;
use App\Http\Controllers\TestimonialController;
use App\Http\Controllers\ServiceController; 
use App\Http\Controllers\PdfController;
use App\Http\Controllers\ActivityController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoomTypeController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\JobTableController;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');


    // *************************************************************************
    // Admin Routes - these routes are only accessible to authenticated users
    // *************************************************************************

Route::middleware('auth')->group(function () {

    // ********************************************************************************************************
    // These routes are for rendering the admin pages, they do not handle any logic, just rendering the pages
    // ********************************************************************************************************

    // -------------------------
    // Dashboard Page Route
    // -------------------------

    Route::get('/dashboard', function(){
        return Inertia::render('AdminPages/Dashboard');
    });

    // -------------------------
    // Home Page Route
    // -------------------------


    Route::get('/home', function(){
        return Inertia::render('AdminPages/Home');
    });

    // -------------------------
    // Gallery Page Route
    // -------------------------

    Route::get('/gallery', function(){
        return Inertia::render('AdminPages/Gallery');
    });

    // -------------------------
    // Testimonial Page Route
    // -------------------------


    Route::get('/testimonials', function(){
        return Inertia::render('AdminPages/Testimonial');
    });

    // -------------------------
    // Service Page Route
    // -------------------------

    Route::get('/services', function(){
        return Inertia::render('AdminPages/Services');
    });

    // -------------------------
    // Activity Page Route
    // -------------------------

    Route::get('/activity', function(){
        return Inertia::render('AdminPages/Activity');
    });

    // -------------------------
    // Blog Page Route
    // -------------------------


    Route::get('/blog', function(){
        return Inertia::render('AdminPages/Blog');
    });

    // -------------------------
    // User Management Page Route
    // -------------------------

    Route::get('/user-management', function(){
        return Inertia::render('AdminPages/UserManagement');
    });

    // -------------------------
    // Room Type Page Route
    // -------------------------

    Route::get('/room-types', function(){
        return Inertia::render('AdminPages/RoomType');
    });

    // -------------------------
    // Room Page Route
    // -------------------------


    Route::get('/rooms', function(){
        return Inertia::render('AdminPages/Room');
    });

    // -------------------------
    // Job Page Route
    // -------------------------

    Route::get('/jobs', function(){
        return Inertia::render('AdminPages/Jobs');
    });

    // -------------------------
    // Job Enquiry Page Route
    // -------------------------

    Route::get('/job-enquiry', function(){
        return Inertia::render('AdminPages/JobEnquiry');
    });



    // ************************************************************************************************ */
    // These routes are for handling the CRUD operations for each section, they are called from the admin pages
    // ************************************************************************************************ */


    // -------------------------
    // Home Page CRUD Routes
    // -------------------------

    Route::get('/ourhome', [HomeController::class, 'index'])->name('ourhome.index');
    Route::post('/ourhome', [HomeController::class, 'store'])->name('ourhome.store');
    Route::put('/ourhome/{id}', [HomeController::class, 'update'])->name('ourhome.update');
    Route::delete('/ourhome/{id}', [HomeController::class, 'destroy'])->name('ourhome.destroy');


    // -------------------------
    // Gallery Page CRUD Routes
    // -------------------------

    Route::get('/ourgallery', [GalleryController::class, 'index'])->name('ourgallery.index');
    Route::post('/ourgallery', [GalleryController::class, 'store'])->name('ourgallery.store');
    Route::put('/ourgallery/{id}', [GalleryController::class, 'update'])->name('ourgallery.update');
    Route::delete('/ourgallery/{id}', [GalleryController::class, 'destroy'])->name('ourgallery.destroy');

    // -------------------------
    // Home Page CRUD Routes
    // -------------------------


    Route::get('/ourtestimonials', [TestimonialController::class, 'index'])->name('ourtestimonials.index');
    Route::post('/ourtestimonials', [TestimonialController::class, 'store'])->name('ourtestimonials.store');
    Route::put('/ourtestimonials/{id}', [TestimonialController::class, 'update'])->name('ourtestimonials.update');
    Route::delete('/ourtestimonials/{id}', [TestimonialController::class, 'destroy'])->name('ourtestimonials.destroy');

    // -------------------------
    // Home Page CRUD Routes
    // -------------------------

    Route::get('/ourservices', [ServiceController::class, 'index'])->name('ourservices.index');
    Route::post('/ourservices', [ServiceController::class, 'store'])->name('ourservices.store');
    Route::put('/ourservices/{id}', [ServiceController::class, 'update'])->name('ourservices.update');
    Route::delete('/ourservices/{id}', [ServiceController::class, 'destroy'])->name('ourservices.destroy');

    
    // -------------------------
    // Home Page CRUD Routes
    // -------------------------

    Route::get('/ouractivity', [ActivityController::class, 'index'])->name('ouractivity.index');
    Route::post('/ouractivity', [ActivityController::class, 'store'])->name('ouractivity.store');
    Route::put('/ouractivity/{id}', [ActivityController::class, 'update'])->name('ouractivity.update');
    Route::delete('/ouractivity/{id}', [ActivityController::class, 'destroy'])->name('ouractivity.destroy');

    // -------------------------
    // Home Page CRUD Routes
    // -------------------------

    Route::get('/ourblog', [BlogController::class, 'index'])->name('ourblog.index');
    Route::post('/ourblog', [BlogController::class, 'store'])->name('ourblog.store');
    Route::put('/ourblog/{id}', [BlogController::class, 'update'])->name('ourblog.update');
    Route::delete('/ourblog/{id}', [BlogController::class, 'destroy'])->name('ourblog.destroy');

    // -------------------------
    // Home Page CRUD Routes
    // -------------------------

    Route::get('/ourusers', [UserController::class, 'index'])->name('ourusers.index');
    Route::post('/ourusers', [UserController::class, 'store'])->name('ourusers.store');
    Route::put('/ourusers/{id}', [UserController::class, 'update'])->name('ourusers.update');
    Route::delete('/ourusers/{id}', [UserController::class, 'destroy'])->name('ourusers.destroy');


    // -------------------------
    // Home Page CRUD Routes
    // -------------------------

    Route::get('/ourroomtype', [RoomTypeController::class, 'index'])->name('ourroomtype.index');
    Route::post('/ourroomtype', [RoomTypeController::class, 'store'])->name('ourroomtype.store');
    Route::put('/ourroomtype/{id}', [RoomTypeController::class, 'update'])->name('ourroomtype.update');
    Route::delete('/ourroomtype/{id}', [RoomTypeController::class, 'destroy'])->name('ourroomtype.destroy');

    // -------------------------
    // Home Page CRUD Routes
    // -------------------------

    Route::get('ourroom', [RoomController::class, 'index'])->name('ourroom.index');
    Route::post('ourroom', [RoomController::class, 'store'])->name('ourroom.store');
    Route::put('ourroom/{id}', [RoomController::class, 'update'])->name('ourroom.update');
    Route::delete('ourroom/{id}', [RoomController::class, 'destroy'])->name('ourroom.destroy');

    // -------------------------
    // Home Page CRUD Routes
    // -------------------------

    Route::get('/ourjob', [JobTableController::class, 'index'])->name('ourjob.index');
    Route::post('/ourjob', [JobTableController::class, 'store'])->name('ourjob.store');
    Route::put('/ourjob/{id}', [JobTableController::class, 'update'])->name('ourjob.update');
    Route::delete('/ourjob/{id}', [JobTableController::class, 'destroy'])->name('ourjob.destroy');

   
});


    Route::get('/ourpdfs', [PdfController::class, 'index'])->name('ourpdfs.index');
    Route::post('/ourpdfs', [PdfController::class, 'store'])->name('ourpdfs.store');
    Route::put('/ourpdfs/{id}', [PdfController::class, 'update'])->name('ourpdfs.update');
    Route::delete('/ourpdfs/{id}', [PdfController::class, 'destroy'])->name('ourpdfs.destroy');
 

    Route::get('/pdf', function(){
        return Inertia::render('PdfReader/ReactPdfViewer');
    });

    // Route::get('/enroute-story', function(){
    //     return Inertia::render('AdminPages/EnrouteStory');
    // });
    
    // Route::get('/hero', function(){
    //     return Inertia::render('AdminPages/Hero');
    // });

    // This route is for testing the PDF viewer component, you can remove it later


    // Route::get('/pdf-viewer', function(){
    //     return Inertia::render('AdminPages/ReactPdfViewer');
    // });


    // Route::get('/ourroom', [RoomController::class, 'index'])->name('ourroom.index');
    // Route::post('/ourroom', [RoomController::class, 'store'])->name('ourroom.store');
    // Route::put('/ourroom/{id}', [RoomController::class, 'update'])->name('ourroom.update');
    // Route::delete('/ourroom/{id}', [RoomController::class, 'destroy'])->name('ourroom.destroy');

    
require __DIR__.'/auth.php';