<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\ActivityImage;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ActivityController extends Controller
{
    /**
     * Helper to record an activity log entry.
     */
    private function log(Request $request, string $title): void
    {
        ActivityLog::create([
            'name' => $request->user()?->name ?? 'System',
            'ip_address' => $request->ip(),
            'title' => $title,
        ]);
    }

    /**
     * Display a listing of activities
     */
    public function index()
    {
        $activities = Activity::with('images')
            ->latest()
            ->get();

        return response()->json([
            'status' => true,
            'message' => 'Activities fetched successfully',
            'data' => $activities,
        ]);
    }

    /**
     * Display a brief listing of activities (first image, name, meta_data only)
     */
    public function indexShow()
    {
        $activities = Activity::with(['images' => function ($query) {
            $query->where('is_cover', true)
                ->orWhere('order', 0)
                ->orderByDesc('is_cover')
                ->limit(1);
        }])
            ->where('is_archived', false)
            ->latest()
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'name' => $activity->name,
                    'slug' => $activity->slug,
                'is_archived' => $activity->is_archived,
                'is_featured' => $activity->is_featured,
                    'meta_data' => $activity->meta_data,
                    'image' => $activity->images->first()?->path
                                        ? asset('storage/'.$activity->images->first()->path)
                                        : null,
                ];
            });

        return response()->json([
            'status' => true,
            'message' => 'Activities fetched successfully',
            'data' => $activities,
        ]);
    }

    public function indexShowActivitySlug($slug)
    {
        $activity = Activity::with('images')
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json([
            'status' => true,
            'message' => 'Activity fetched successfully',
            'data' => $activity,
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
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:2048',
            'cover_index' => 'nullable|integer|min:0',
        ]);

        if (isset($validated['meta_data']) && is_string($validated['meta_data'])) {
            $validated['meta_data'] = json_decode($validated['meta_data'], true);
        }

        DB::beginTransaction();

        try {
            $activity = Activity::create($validated);

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

            $this->log($request, "Created activity: {$activity->name} (ID: {$activity->id})");

            DB::commit();

            $this->logActivity("Created activity: {$activity->name}");

            return response()->json([
                'status' => true,
                'message' => 'Activity created successfully',
                'data' => $activity->load('images'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Failed to create activity',
                'error' => $e->getMessage(),
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
            'cover_index' => 'nullable|integer|min:0',
        ]);

        if (isset($validated['meta_data']) && is_string($validated['meta_data'])) {
            $validated['meta_data'] = json_decode($validated['meta_data'], true);
        }

        DB::beginTransaction();

        try {
            $activity->update($validated);

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

            $this->log($request, "Updated activity: {$activity->name} (ID: {$activity->id})");

            DB::commit();

            $this->logActivity("Updated activity: {$activity->name}");

            return response()->json([
                'status' => true,
                'message' => 'Activity updated successfully',
                'data' => $activity->load('images'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Failed to update activity',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified activity
     */
    public function destroy(Request $request, $id)
    {
        $activity = Activity::with('images')->findOrFail($id);

        DB::beginTransaction();

        try {
            foreach ($activity->images as $image) {
                Storage::disk('public')->delete($image->path);
            }

            $activity->images()->delete();

            $this->log($request, "Deleted activity: {$activity->name} (ID: {$activity->id})");

            $activity->delete();

            DB::commit();

            $this->logActivity("Deleted activity: {$activity->name}");

            return response()->json([
                'status' => true,
                'message' => 'Activity deleted successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Failed to delete activity',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
