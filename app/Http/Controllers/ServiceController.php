<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    /**
     * Display a listing of services
     */
    public function index()
    {
        $services = Service::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $services
        ]);
    }


    /**
 * ======================================
 * INDEX SHOW - Service Card Data
 * ======================================
 */
public function indexShow()
{
    try {

        $services = Service::latest()
            ->get()
            ->map(function ($service) {

                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'slug' => $service->slug,
                    'is_archived' => $service->is_archived,
                    'is_featured' => $service->is_featured,
                    'meta_data' => $service->meta_data,

                    'first_image' => $service->image
                        ? asset('storage/' . $service->image)
                        : null,
                ];
            });

        return response()->json([
            'status' => true,
            'message' => 'Service show data fetched successfully',
            'data' => $services
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'status' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}
    /**
     * Store a newly created service
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp',
        ]);

        $imagePath = null;

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('services', 'public');
        }

        $service = Service::create([
            'name' => $request->name,
            'short_description' => $request->short_description,
            'long_description' => $request->long_description,
            'image' => $imagePath,
            'is_featured' => $request->is_featured ?? false,
            'meta_data' => $request->meta_data,
            'is_archived' => $request->is_archived ?? false,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Service created successfully',
            'data' => $service
        ]);
    }

    /**
     * Update the specified service
     */
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp',
        ]);

        // Handle image update
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('services', 'public');
            $service->image = $imagePath;
        }

        $service->update([
            'name' => $request->name,
            'short_description' => $request->short_description,
            'long_description' => $request->long_description,
            'is_featured' => $request->is_featured ?? false,
            'meta_data' => $request->meta_data,
            'is_archived' => $request->is_archived ?? false,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Service updated successfully',
            'data' => $service
        ]);
    }

    /**
     * Remove the specified service
     */
    public function destroy($id)
    {
        $service = Service::findOrFail($id);
        $service->delete();

        return response()->json([
            'status' => true,
            'message' => 'Service deleted successfully'
        ]);
    }
}
