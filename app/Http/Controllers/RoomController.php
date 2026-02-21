<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\RoomImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RoomController extends Controller
{
    /**
     * ===============================
     *  INDEX - List All Rooms
     * ===============================
     */
    public function index()
    {
        $rooms = Room::with(['roomType', 'images'])
            ->orderBy('order', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $rooms
        ]);
    }


    /**
     * ===============================
     *  STORE - Create Room
     * ===============================
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'order' => 'nullable|integer',
            'no_of_room' => 'required|integer',
            'no_of_children' => 'required|integer',
            'no_of_adult' => 'required|integer',
            'price' => 'required|numeric',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'room_type_id' => 'required|exists:room_types,id',
            'meta_data' => 'nullable|json',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'display_image_index' => 'nullable|integer',
            'is_archived' => 'boolean',
            'is_featured' => 'boolean',
            'refrence_id' => 'nullable|string|max:255'
        ]);

        DB::beginTransaction();

        try {
            // Parse meta_data if it's a JSON string
            $data = $request->except('meta_data');
            if ($request->has('meta_data') && is_string($request->meta_data)) {
                $data['meta_data'] = json_decode($request->meta_data, true);
            }

            $room = Room::create($data);

            // Handle Images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('rooms', 'public');

                    RoomImage::create([
                        'room_id' => $room->id,
                        'image' => $path,
                        'is_display_image' => $request->display_image_index == $index
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Room created successfully',
                'data' => $room->load('images', 'roomType')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * ===============================
     *  UPDATE - Update Room
     * ===============================
     */
    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'order' => 'nullable|integer',
            'no_of_room' => 'nullable|integer',
            'no_of_children' => 'nullable|integer',
            'no_of_adult' => 'nullable|integer',
            'price' => 'nullable|numeric',
            'short_description' => 'nullable|string',
            'long_description' => 'nullable|string',
            'room_type_id' => 'nullable|exists:room_types,id',
            'meta_data' => 'nullable|json',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'display_image_index' => 'nullable|integer',
            'is_archived' => 'boolean',
            'is_featured' => 'boolean',
            'refrence_id' => 'nullable|string|max:255'
        ]);

        DB::beginTransaction();

        try {
            // Parse meta_data if it's a JSON string
            $data = $request->except('meta_data');
            if ($request->has('meta_data') && is_string($request->meta_data)) {
                $data['meta_data'] = json_decode($request->meta_data, true);
            }

            $room->update($data);

            // Add new images (optional)
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('rooms', 'public');

                    RoomImage::create([
                        'room_id' => $room->id,
                        'image' => $path,
                        'is_display_image' => $request->display_image_index == $index
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Room updated successfully',
                'data' => $room->load('images', 'roomType')
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * ===============================
     *  DELETE - Delete Room
     * ===============================
     */
    public function destroy($id)
    {
        $room = Room::with('images')->findOrFail($id);

        DB::beginTransaction();

        try {
            // Delete images from storage
            foreach ($room->images as $image) {
                Storage::disk('public')->delete($image->image);
                $image->delete();
            }

            $room->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Room deleted successfully'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}