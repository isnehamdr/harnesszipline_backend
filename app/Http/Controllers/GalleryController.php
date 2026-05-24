<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use App\Models\Gallery;
use App\Models\GalleryImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GalleryController extends Controller
{
    public function index()
    {
        try {
            $galleries = Gallery::with('images')
                ->latest()
                ->get();

            return response()->json($galleries);
        } catch (\Exception $e) {
            Log::error('Gallery index error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch galleries'], 500);
        }
    }

    public function indexShow()
{
    try {
        $galleries = Gallery::with(['images' => function ($query) {
                $query->orderBy('order', 'asc');
            }])
            ->latest()
            ->get()
            ->map(function ($gallery) {

                $firstImage = $gallery->images->first();

                return [
                    'id' => $gallery->id,
                    'name' => $gallery->name,
                    'meta_data' => $gallery->meta_data,
                    'is_archived' => $gallery->is_archived,
                    'is_featured' => $gallery->is_featured,
                    'first_image' => $firstImage
                        ? asset('storage/' . $firstImage->path)
                        : null,
                ];
            });

        return response()->json($galleries);

    } catch (\Exception $e) {

        Log::error('Gallery indexShow error: ' . $e->getMessage());

        return response()->json([
            'message' => 'Failed to fetch gallery data',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function store(Request $request)
    {
        try {
            // Log the request data for debugging
            Log::info('Store request data:', [
                'all' => $request->all(),
                'files' => $request->allFiles(),
                'has_images' => $request->hasFile('images'),
            ]);

            // Validate the request
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'is_archived' => 'nullable|boolean',
                'is_featured' => 'nullable|boolean',
            ]);

            // Create gallery
            $gallery = Gallery::create([
                'name' => $request->name,
                'is_archived' => $request->boolean('is_archived', false),
                'is_featured' => $request->boolean('is_featured', false),
            ]);

            // Save images if present
            if ($request->hasFile('images')) {
                $images = $request->file('images');
                
                // If it's a single image, make it an array
                if (!is_array($images)) {
                    $images = [$images];
                }

                foreach ($images as $index => $file) {
                    if ($file && $file->isValid()) {
                        // Store the image
                        $path = $file->store('galleries', 'public');
                        
                        // Create gallery image record
                        GalleryImage::create([
                            'gallery_id' => $gallery->id,
                            'path' => $path,
                            'alt_text' => $request->input('alt_text.' . $index, $gallery->name),
                            'order' => $index,
                            'is_cover' => $index === 0,
                        ]);
                    }
                }
            }

            $this->logActivity("Created gallery: {$gallery->name}");

            return response()->json([
                'message' => 'Gallery created successfully',
                'data' => $gallery->load('images'),
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Gallery store error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Failed to create gallery',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            Log::info('Update request data:', [
                'id' => $id,
                'all' => $request->all(),
                'files' => $request->allFiles(),
                'method' => $request->method(),
            ]);

            $gallery = Gallery::findOrFail($id);

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'images.*' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
                'is_archived' => 'nullable|boolean',
                'is_featured' => 'nullable|boolean',
            ]);

            // Update gallery info
            $gallery->update([
                'name' => $request->name,
                'is_archived' => $request->boolean('is_archived', false),
                'is_featured' => $request->boolean('is_featured', false),
            ]);

            // Upload new images if present
            if ($request->hasFile('images')) {
                $images = $request->file('images');
                
                if (!is_array($images)) {
                    $images = [$images];
                }

                foreach ($images as $index => $file) {
                    if ($file && $file->isValid()) {
                        $path = $file->store('galleries', 'public');

                        GalleryImage::create([
                            'gallery_id' => $gallery->id,
                            'path' => $path,
                            'alt_text' => $request->input('alt_text.' . $index, $gallery->name),
                            'order' => $gallery->images()->count() + $index,
                            'is_cover' => $gallery->images()->count() === 0 && $index === 0,
                        ]);
                    }
                }
            }

            $this->logActivity("Updated gallery: {$gallery->name}");

            return response()->json([
                'message' => 'Gallery updated successfully',
                'data' => $gallery->load('images'),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Gallery update error: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'message' => 'Failed to update gallery',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $gallery = Gallery::with('images')->findOrFail($id);

            // Delete images from storage
            foreach ($gallery->images as $image) {
                if (Storage::disk('public')->exists($image->path)) {
                    Storage::disk('public')->delete($image->path);
                }
                $image->delete();
            }

            $gallery->delete();

            $this->logActivity("Deleted gallery: {$gallery->name}");

            return response()->json([
                'message' => 'Gallery deleted successfully',
            ]);

        } catch (\Exception $e) {
            Log::error('Gallery delete error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete gallery',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
