<?php

namespace App\Http\Controllers;

use App\Models\JobTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class JobTableController extends Controller
{
    /**
     * Display a listing of the jobs
     */
    public function index()
    {
        try {
            $jobs = JobTable::latest()->get();

            return response()->json([
                'status' => true,
                'message' => 'Job list retrieved successfully.',
                'data' => $jobs
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching jobs: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Error fetching jobs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created job
     */
    public function store(Request $request)
    {
        try {
            Log::info('Store request data:', $request->all());
            
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'short_description' => 'nullable|string',
                'content' => 'nullable|string',
                'meta_data' => 'nullable|json',
                'is_archived' => 'required|in:0,1'
            ]);

            Log::info('Validated data:', $validated);

            // Handle meta_data
            if (isset($validated['meta_data']) && $validated['meta_data'] !== 'null') {
                $decodedMeta = json_decode($validated['meta_data'], true);
                $validated['meta_data'] = $decodedMeta;
            } else {
                $validated['meta_data'] = null;
            }

            // Handle is_archived - convert string to boolean
            $validated['is_archived'] = $validated['is_archived'] === '1';

            $job = JobTable::create([
                'title' => $validated['title'],
                'short_description' => $validated['short_description'] ?? null,
                'content' => $validated['content'] ?? null,
                'meta_data' => $validated['meta_data'],
                'is_archived' => $validated['is_archived'],
            ]);

            Log::info('Job created:', $job->toArray());

            return response()->json([
                'status' => true,
                'message' => 'Job created successfully.',
                'data' => $job
            ], 201);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error:', $e->errors());
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error creating job: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Error creating job',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified job
     */
    public function update(Request $request, $id)
    {
        try {
            Log::info('Update request data for job ' . $id . ':', $request->all());
            
            $job = JobTable::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'short_description' => 'nullable|string',
                'content' => 'nullable|string',
                'meta_data' => 'nullable|json',
                'is_archived' => 'sometimes|in:0,1'
            ]);

            // Handle meta_data
            if (isset($validated['meta_data'])) {
                if ($validated['meta_data'] === 'null') {
                    $validated['meta_data'] = null;
                } else {
                    $decodedMeta = json_decode($validated['meta_data'], true);
                    $validated['meta_data'] = $decodedMeta;
                }
            }

            // Handle is_archived if present
            if (isset($validated['is_archived'])) {
                $validated['is_archived'] = $validated['is_archived'] === '1';
            }

            $job->update($validated);

            Log::info('Job updated:', $job->toArray());

            return response()->json([
                'status' => true,
                'message' => 'Job updated successfully.',
                'data' => $job
            ]);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation error on update:', $e->errors());
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error updating job: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => false,
                'message' => 'Error updating job',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified job
     */
    public function destroy($id)
    {
        try {
            $job = JobTable::findOrFail($id);
            $job->delete();

            return response()->json([
                'status' => true,
                'message' => 'Job deleted successfully.'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error deleting job: ' . $e->getMessage());
            return response()->json([
                'status' => false,
                'message' => 'Error deleting job',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}