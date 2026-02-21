<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ActivityController extends Controller
{
    /**
     * Display a listing of activities
     */
  public function index()
{
    $activities = Activity::with('images')
        ->latest()
        ->get(); // Use get() instead of paginate() for simpler response

    return response()->json([
        'status' => true,
        'message' => 'Activities fetched successfully',
        'data' => $activities
    ]);
}

    /**
     * Store a newly created activity
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'meta_data' => 'nullable|json',
            'is_archived' => 'boolean',
            'is_featured' => 'boolean',

            // Images
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'cover_index' => 'nullable|integer|min:0'
        ]);

        // Convert meta_data from JSON string to array if provided
        if (isset($validated['meta_data']) && is_string($validated['meta_data'])) {
            $validated['meta_data'] = json_decode($validated['meta_data'], true);
        }

        DB::beginTransaction();

        try {
            $activity = Activity::create($validated);

            // Handle Images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {

                    $path = $image->store('activities', 'public');

                    ActivityImage::create([
                        'activity_id' => $activity->id,
                        'path' => $path,
                        'alt_text' => $activity->name,
                        'order' => $index,
                        'is_cover' => $request->cover_index == $index,
                        'is_display_image' => true,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Activity created successfully',
                'data' => $activity->load('images')
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Failed to create activity',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified activity
     */
    public function update(Request $request, $id)
    {
        $activity = Activity::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'base_price' => 'sometimes|required|numeric|min:0',
            'meta_data' => 'nullable|json',
            'is_archived' => 'boolean',
            'is_featured' => 'boolean',

            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'cover_index' => 'nullable|integer|min:0'
        ]);

        // Convert meta_data from JSON string to array if provided
        if (isset($validated['meta_data']) && is_string($validated['meta_data'])) {
            $validated['meta_data'] = json_decode($validated['meta_data'], true);
        }

        DB::beginTransaction();

        try {
            $activity->update($validated);

            // Add new images (optional)
            if ($request->hasFile('images')) {

                $currentCount = $activity->images()->count();

                foreach ($request->file('images') as $index => $image) {

                    $path = $image->store('activities', 'public');

                    ActivityImage::create([
                        'activity_id' => $activity->id,
                        'path' => $path,
                        'alt_text' => $activity->name,
                        'order' => $currentCount + $index,
                        'is_cover' => $request->cover_index == ($currentCount + $index),
                        'is_display_image' => true,
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Activity updated successfully',
                'data' => $activity->load('images')
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Failed to update activity',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified activity
     */
    public function destroy($id)
    {
        $activity = Activity::with('images')->findOrFail($id);

        DB::beginTransaction();

        try {

            // Delete images from storage
            foreach ($activity->images as $image) {
                Storage::disk('public')->delete($image->path);
            }

            $activity->images()->delete();
            $activity->delete();

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Activity deleted successfully'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete activity',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}