<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::latest()->get();

        return response()->json([
            'status' => true,
            'data'   => $services,
        ]);
    }

   public function indexShow()
{
    try {
        $services = Service::latest()
            ->get()
            ->map(fn($s) => [
                'id'          => $s->id,
                'name'        => $s->name,
                'slug'        => $s->slug,
                'is_archived' => (bool) $s->is_archived,
                'is_featured' => (bool) $s->is_featured,
                'meta_data'   => $s->meta_data ? json_decode($s->meta_data, true) : null,
                'first_image' => $s->image ?: null,
            ]);

        return response()->json([
            'status'  => true,
            'message' => 'Service show data fetched successfully',
            'data'    => $services,
        ]);
    } catch (\Exception $e) {
        return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
    }
}

  public function indexShowServiceSlug($slug)
{
    try {
        $service = Service::where('slug', $slug)->first();

        if (!$service) {
            return response()->json(['status' => false, 'message' => 'Service not found'], 404);
        }

        return response()->json([
            'status'  => true,
            'message' => 'Service fetched successfully',
            'data'    => [
                'id'                => $service->id,
                'name'              => $service->name,
                'title'             => $service->name,
                'slug'              => $service->slug,
                'short_description' => $service->short_description,
                'long_description'  => $service->long_description,
                'image'             => $service->image ?: null,
                'meta_data'         => $service->meta_data ? json_decode($service->meta_data, true) : null,
                'is_archived'       => (bool) $service->is_archived,
                'is_featured'       => (bool) $service->is_featured,
                'created_at'        => $service->created_at,
            ],
        ]);
    } catch (\Exception $e) {
        Log::error('Service slug fetch error: ' . $e->getMessage());

        return response()->json([
            'status'  => false,
            'message' => 'Error fetching service',
            'error'   => $e->getMessage(),
        ], 500);
    }
}

    public function store(Request $request)
    {
        $request->validate([
            'name'              => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'long_description'  => 'nullable|string',
            'image'             => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_featured'       => 'nullable',
            'is_archived'       => 'nullable',
            'meta_data'         => 'nullable|string',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('services', 'public');
        }

        // meta_data arrives as a JSON string from the frontend — validate it and store as-is
        $metaData = null;
        if ($request->filled('meta_data')) {
            $raw = trim($request->input('meta_data'));
            // Reject if it decodes to null (i.e. the string "null")
            $decoded = json_decode($raw, true);
            if (json_last_error() === JSON_ERROR_NONE && $decoded !== null) {
                $metaData = $raw; // store the valid JSON string
            }
        }

        $service = Service::create([
            'name'              => $request->name,
            'slug'              => $this->generateUniqueSlug($request->name),
            'short_description' => $request->short_description,
            'long_description'  => $request->long_description,
            'image'             => $imagePath,
            'is_featured'       => $request->input('is_featured') === '1' || $request->input('is_featured') === true,
            'is_archived'       => $request->input('is_archived') === '1' || $request->input('is_archived') === true,
            'meta_data'         => $metaData,
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Service created successfully',
            'data'    => $service,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);

        $request->validate([
            'name'              => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'long_description'  => 'nullable|string',
            'image'             => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_featured'       => 'nullable',
            'is_archived'       => 'nullable',
            'meta_data'         => 'nullable|string',
        ]);

        if ($request->hasFile('image')) {
            if ($service->image) {
                Storage::disk('public')->delete($service->image);
            }
            $service->image = $request->file('image')->store('services', 'public');
        }

        $slug = $service->slug;
        if ($service->name !== $request->name) {
            $slug = $this->generateUniqueSlug($request->name, $service->id);
        }

        $metaData = $service->meta_data; // keep existing by default
        if ($request->has('meta_data')) {
            $raw = trim($request->input('meta_data'));
            $decoded = json_decode($raw, true);
            if (json_last_error() === JSON_ERROR_NONE && $decoded !== null) {
                $metaData = $raw;
            } else {
                $metaData = null;
            }
        }

        $service->update([
            'name'              => $request->name,
            'slug'              => $slug,
            'short_description' => $request->short_description,
            'long_description'  => $request->long_description,
            'is_featured'       => $request->input('is_featured') === '1' || $request->input('is_featured') === true,
            'is_archived'       => $request->input('is_archived') === '1' || $request->input('is_archived') === true,
            'meta_data'         => $metaData,
        ]);

        return response()->json([
            'status'  => true,
            'message' => 'Service updated successfully',
            'data'    => $service->fresh(),
        ]);
    }

    public function destroy($id)
    {
        $service = Service::findOrFail($id);

        if ($service->image) {
            Storage::disk('public')->delete($service->image);
        }

        $service->delete();

        return response()->json([
            'status'  => true,
            'message' => 'Service deleted successfully',
        ]);
    }

    private function generateUniqueSlug(string $name, ?int $excludeId = null): string
    {
        $base    = Str::slug($name);
        $slug    = $base;
        $counter = 1;

        while (
            Service::where('slug', $slug)
                ->when($excludeId, fn($q) => $q->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $base . '-' . $counter++;
        }

        return $slug;
    }
}