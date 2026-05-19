<?php

namespace App\Http\Controllers;

use App\Models\RoomType;
use Illuminate\Http\Request;

class RoomTypeController extends Controller
{
    /**
     * Display a listing of the room types.
     */
    public function index(Request $request)
    {
        $query = RoomType::query();

        // Optional filter for archived
        if ($request->has('is_archived')) {
            $query->where('is_archived', $request->is_archived);
        }

        $roomTypes = $query->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Room types fetched successfully.',
            'data' => $roomTypes
        ]);
    }

    /**
     * Store a newly created room type.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:room_types,name',
            'is_archived' => 'nullable|boolean',
        ]);

        $roomType = RoomType::create([
            'name' => $validated['name'],
            'is_archived' => $validated['is_archived'] ?? false,
        ]);

        $this->logActivity("Created room type: {$roomType->name}");

        return response()->json([
            'success' => true,
            'message' => 'Room type created successfully.',
            'data' => $roomType
        ], 201);
    }

    /**
     * Update the specified room type.
     */
    public function update(Request $request, $id)
    {
        $roomType = RoomType::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:room_types,name,' . $roomType->id,
            'is_archived' => 'nullable|boolean',
        ]);

        $roomType->update([
            'name' => $validated['name'],
            'is_archived' => $validated['is_archived'] ?? $roomType->is_archived,
        ]);

        $this->logActivity("Updated room type: {$roomType->name}");

        return response()->json([
            'success' => true,
            'message' => 'Room type updated successfully.',
            'data' => $roomType
        ]);
    }

    /**
     * Remove the specified room type.
     */
    public function destroy($id)
    {
        $roomType = RoomType::findOrFail($id);

        $roomType->delete();

        $this->logActivity("Deleted room type: {$roomType->name}");

        return response()->json([
            'success' => true,
            'message' => 'Room type deleted successfully.'
        ]);
    }
}
