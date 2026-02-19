<?php

namespace App\Http\Controllers;

use App\Models\Home;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HomeController extends Controller
{
    /**
     * Display all records
     */
    public function index()
    {
        $homes = Home::latest()->get();

        return response()->json([
            'status' => true,
            'data' => $homes
        ]);
    }

    /**
     * Store new record
     */
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'video' => 'nullable|mimetypes:video/mp4,video/avi,video/mpeg|max:20480',
            'is_archived' => 'nullable|boolean',
            'metadata_json' => 'nullable|json'
        ]);

        $data = [
            'is_archived' => $request->is_archived ?? false,
            'metadata_json' => $request->metadata_json
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('homes/images', 'public');
            $data['image'] = $imagePath;
        }

        // Handle video upload
        if ($request->hasFile('video')) {
            $videoPath = $request->file('video')->store('homes/videos', 'public');
            $data['video'] = $videoPath;
        }

        $home = Home::create($data);

        return response()->json([
            'status' => true,
            'message' => 'Home created successfully',
            'data' => $home
        ], 201);
    }

    /**
     * Update record
     */
    public function update(Request $request, $id)
    {
        $home = Home::findOrFail($id);

        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'video' => 'nullable|mimetypes:video/mp4,video/avi,video/mpeg|max:20480',
            'is_archived' => 'nullable|boolean',
            'metadata_json' => 'nullable|json'
        ]);

        $data = [
            'is_archived' => $request->is_archived ?? $home->is_archived,
            'metadata_json' => $request->metadata_json ?? $home->metadata_json
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image
            if ($home->image) {
                Storage::disk('public')->delete($home->image);
            }
            $imagePath = $request->file('image')->store('homes/images', 'public');
            $data['image'] = $imagePath;
        }

        // Handle video upload
        if ($request->hasFile('video')) {
            // Delete old video
            if ($home->video) {
                Storage::disk('public')->delete($home->video);
            }
            $videoPath = $request->file('video')->store('homes/videos', 'public');
            $data['video'] = $videoPath;
        }

        $home->update($data);

        return response()->json([
            'status' => true,
            'message' => 'Home updated successfully',
            'data' => $home
        ]);
    }

    /**
     * Delete record
     */
    public function destroy($id)
    {
        $home = Home::findOrFail($id);
        
        // Delete associated files
        if ($home->image) {
            Storage::disk('public')->delete($home->image);
        }
        if ($home->video) {
            Storage::disk('public')->delete($home->video);
        }
        
        $home->delete();

        return response()->json([
            'status' => true,
            'message' => 'Home deleted successfully'
        ]);
    }
}