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
            'data' => $rooms,
        ]);
    }


    /**
 * ===============================
 *  INDEX SHOW - Room Card Data
 * ===============================
 */
public function indexShow()
{
    try {

        $rooms = Room::with('images')
            ->orderBy('order', 'asc')
            ->get()
            ->map(function ($room) {

                // Get display image first
                $displayImage = $room->images
                    ->firstWhere('is_display_image', true);

                // Fallback to first image
                if (!$displayImage) {
                    $displayImage = $room->images->first();
                }

                return [
                    'id' => $room->id,
                    'name' => $room->name,
                    'slug' => $room->slug,
                    'is_archived' => $room->is_archived,
                    'is_featured' => $room->is_featured,
                    'meta_data' => $room->meta_data,
                    'first_image' => $displayImage
                        ? asset('storage/' . $displayImage->image)
                        : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $rooms,
        ]);

    } catch (\Exception $e) {

        return response()->json([
            'success' => false,
            'message' => $e->getMessage(),
        ], 500);
    }
}

    /**
     * ===============================
     *  SHOW - Display Single Room by Slug
     * ===============================
     */
    // public function show($slug)
    // {
    //     $room = Room::where('slug', $slug)
    //         ->with(['images', 'roomType'])
    //         ->firstOrFail();

    //     return inertia('TestingPage/RoomDetails', [
    //         'room' => $room,
    //     ]);
    // }


    public function show($slug)
{
    $room = Room::where('slug', $slug)
        ->with(['images', 'roomType'])
        ->firstOrFail();

    // ── Pass to Inertia as-is — SEO comes entirely from meta_data.seo ─────
    return inertia('TestingPage/RoomDetails', [
        'room' => $room,
    ]);
}


    /**
     * ===============================
     *  SHOW - Display Single Room by Slug
     * ===============================
     *
     *
     *

     * Merges default SEO values into meta_data.seo before passing to Inertia.
     * Saved SEO values (set via admin) always win over the defaults.
     * The database record is NOT modified — this is view-only enrichment.
     */
    // public function show($slug)
    // {
    //     $room = Room::where('slug', $slug)
    //         ->with(['images', 'roomType'])
    //         ->firstOrFail();

    //     $displayImageUrl = $this->getDisplayImageUrl($room);
    //     $canonicalUrl = url('/room/'.$room->slug);
    //     $roomTypeName = optional($room->roomType)->name ?? 'Hotel Room';
    //     $appName = config('app.name', 'Hotel');

    //     // ── Default SEO matching the exact stored structure ────────────────────
    //     // Structure: meta_data.seo.{ title, description, keywords[], og.{} }
    //     $defaultSeo = [
    //         'title' => $room->name.' | '.$appName,
    //         'description' => $room->short_description
    //                             ?? 'Experience comfort in our '.$room->name.' at '.$appName.'.',
    //         'keywords' => array_filter([
    //             $room->name,
    //             'hotel room',
    //             'accommodation',
    //             $roomTypeName,
    //             $appName,
    //         ]),
    //         'og' => [
    //             'url' => $canonicalUrl,
    //             'image' => $displayImageUrl,
    //             'title' => $room->name.' | '.$appName,
    //             'description' => $room->short_description
    //                                 ?? 'Experience comfort in our '.$room->name.'.',
    //             'type' => 'website',
    //             'site_name' => $appName,
    //         ],
    //     ];

    //     // ── Merge saved SEO over defaults (saved values always win) ───────────
    //     $metaData = $room->meta_data ?? [];
    //     $savedSeo = $metaData['seo'] ?? [];

    //     $mergedSeo = array_merge($defaultSeo, $savedSeo);

    //     // Deep-merge the nested 'og' block separately so a partial saved og
    //     // doesn't wipe all the default og keys
    //     $mergedSeo['og'] = array_merge(
    //         $defaultSeo['og'],
    //         $savedSeo['og'] ?? []
    //     );

    //     // keywords: prefer saved array, else keep default array
    //     if (empty($mergedSeo['keywords'])) {
    //         $mergedSeo['keywords'] = $defaultSeo['keywords'];
    //     }

    //     $metaData['seo'] = $mergedSeo;

    //     // ── Pass to Inertia (DB record untouched) ─────────────────────────────
    //     return inertia('TestingPage/RoomDetails', [
    //         'room' => array_merge($room->toArray(), ['meta_data' => $metaData]),
    //     ]);
    // }

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
            'meta_data' => 'nullable|json',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'display_image_index' => 'nullable|integer',
            'is_archived' => 'boolean',
            'is_featured' => 'boolean',
            'refrence_id' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $data = $request->except('meta_data');
            if ($request->filled('meta_data')) {
                $data['meta_data'] = json_decode($request->meta_data, true);
            }

            $room = Room::create($data);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('rooms', 'public');
                    RoomImage::create([
                        'room_id' => $room->id,
                        'image' => $path,
                        'is_display_image' => $request->display_image_index == $index,
                    ]);
                }
            }

            DB::commit();

            $this->logActivity("Created room: {$room->name}");

            return response()->json([
                'success' => true,
                'message' => 'Room created successfully',
                'data' => $room->load('images', 'roomType'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
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
            'meta_data' => 'nullable|json',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'display_image_index' => 'nullable|integer',
            'is_archived' => 'boolean',
            'is_featured' => 'boolean',
            'refrence_id' => 'nullable|string|max:255',
        ]);

        DB::beginTransaction();

        try {
            $data = $request->except('meta_data');
            if ($request->filled('meta_data')) {
                $data['meta_data'] = json_decode($request->meta_data, true);
            }

            $room->update($data);

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('rooms', 'public');
                    RoomImage::create([
                        'room_id' => $room->id,
                        'image' => $path,
                        'is_display_image' => $request->display_image_index == $index,
                    ]);
                }
            }

            DB::commit();

            $this->logActivity("Updated room: {$room->name}");

            return response()->json([
                'success' => true,
                'message' => 'Room updated successfully',
                'data' => $room->load('images', 'roomType'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * ===============================
     *  DESTROY - Delete Room
     * ===============================
     */
    public function destroy($id)
    {
        $room = Room::with('images')->findOrFail($id);

        DB::beginTransaction();

        try {
            foreach ($room->images as $image) {
                Storage::disk('public')->delete($image->image);
                $image->delete();
            }

            $room->delete();

            DB::commit();

            $this->logActivity("Deleted room: {$room->name}");

            return response()->json(['success' => true, 'message' => 'Room deleted successfully']);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * ===============================
     *  HELPER - Get Display Image URL
     * ===============================
     */
    private function getDisplayImageUrl(Room $room): string
    {
        if (! $room->images || $room->images->isEmpty()) {
            return asset('images/logo.webp');
        }

        $displayImage = $room->images->firstWhere('is_display_image', true)
                        ?? $room->images->first();

        return asset('storage/'.$displayImage->image);
    }
}
