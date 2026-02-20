<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Database\QueryException;

class TestimonialController extends Controller
{
    /**
     * Display all testimonials
     */
    public function index()
    {
        try {
            $testimonials = Testimonial::latest()->get();

            return response()->json([
                'status' => true,
                'data' => $testimonials
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching testimonials: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store new testimonial
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'fullname' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'short_description' => 'nullable|string',
                'long_description' => 'nullable|string',
                'is_featured' => 'nullable|in:0,1,true,false',
                'is_archived' => 'nullable|in:0,1,true,false',
            ]);

            // Log the incoming request data for debugging
            \Log::info('Store testimonial request:', $request->all());

            // Convert string booleans to actual boolean values
            $isFeatured = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);
            $isArchived = filter_var($request->is_archived, FILTER_VALIDATE_BOOLEAN);

            $testimonial = Testimonial::create([
                'fullname' => $request->fullname,
                'address' => $request->address,
                'short_description' => $request->short_description,
                'long_description' => $request->long_description,
                'is_featured' => $isFeatured,
                'is_archived' => $isArchived,
            ]);

            \Log::info('Testimonial created successfully:', $testimonial->toArray());

            return response()->json([
                'status' => true,
                'message' => 'Testimonial created successfully',
                'data' => $testimonial
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (QueryException $e) {
            \Log::error('Database error in store: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            \Log::error('Error in store: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update testimonial
     */
    public function update(Request $request, $id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);

            $request->validate([
                'fullname' => 'required|string|max:255',
                'address' => 'nullable|string|max:255',
                'short_description' => 'nullable|string',
                'long_description' => 'nullable|string',
                'is_featured' => 'nullable|in:0,1,true,false',
                'is_archived' => 'nullable|in:0,1,true,false',
            ]);

            // Log the incoming request data for debugging
            \Log::info('Update testimonial request for ID ' . $id . ':', $request->all());

            // Convert string booleans to actual boolean values
            $isFeatured = $request->has('is_featured') ? filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN) : $testimonial->is_featured;
            $isArchived = $request->has('is_archived') ? filter_var($request->is_archived, FILTER_VALIDATE_BOOLEAN) : $testimonial->is_archived;

            $testimonial->update([
                'fullname' => $request->fullname,
                'address' => $request->address,
                'short_description' => $request->short_description,
                'long_description' => $request->long_description,
                'is_featured' => $isFeatured,
                'is_archived' => $isArchived,
            ]);

            \Log::info('Testimonial updated successfully:', $testimonial->toArray());

            return response()->json([
                'status' => true,
                'message' => 'Testimonial updated successfully',
                'data' => $testimonial
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (QueryException $e) {
            \Log::error('Database error in update: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Database error: ' . $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            \Log::error('Error in update: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete testimonial
     */
    public function destroy($id)
    {
        try {
            $testimonial = Testimonial::findOrFail($id);
            $testimonial->delete();

            return response()->json([
                'status' => true,
                'message' => 'Testimonial deleted successfully'
            ]);
        } catch (\Exception $e) {
            \Log::error('Error in destroy: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }
}