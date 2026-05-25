<?php

namespace App\Http\Controllers;

use App\Models\JobTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class JobTableController extends Controller
{
    /**
     * ===============================
     * INDEX - List All Jobs
     * ===============================
     */




    
    public function index()
    {
        try {
            $jobs = JobTable::latest()->get();

            return response()->json([
                'status' => true,
                'message' => 'Job list retrieved successfully.',
                'data' => $jobs,
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching jobs: '.$e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Error fetching jobs',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ===============================
     * SHOW - Display Single Job by Slug
     * ===============================
     */
    public function show($slug)
    {
        try {
            Log::info('Attempting to find job with slug: '.$slug);

            $job = JobTable::where('slug', $slug)
                ->with('enquiries')
                ->firstOrFail();

            Log::info('Job found: '.$job->id);

            return Inertia::render('TestingPage/JobEnquiryForm', [
                'status' => true,
                'message' => 'Job retrieved successfully.',
                'job' => $job,
            ]);

        } catch (\Exception $e) {
            Log::error('Error fetching job: '.$e->getMessage());
            Log::error('Slug attempted: '.$slug);

            return Inertia::render('Errors/NotFound', [
                'status' => false,
                'message' => 'Job not found',
            ]);
        }
    }

    /**
     * ===============================
     * STORE - Create Job
     * ===============================
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'short_description' => 'nullable|string',
                'content' => 'nullable|string',
                'meta_data' => 'nullable|json', // Change to json validation
                'is_archived' => 'required|boolean',
            ]);

            // Handle meta_data - decode JSON string to array
            if (isset($validated['meta_data']) && is_string($validated['meta_data'])) {
                $validated['meta_data'] = json_decode($validated['meta_data'], true);
            }

            $job = JobTable::create($validated);

            return response()->json([
                'status' => true,
                'message' => 'Job created successfully.',
                'data' => $job,
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error creating job: '.$e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Error creating job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ===============================
     * UPDATE - Update Job
     * ===============================
     */
    public function update(Request $request, $id)
    {
        try {
            $job = JobTable::findOrFail($id);

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'short_description' => 'nullable|string',
                'content' => 'nullable|string',
                'meta_data' => 'nullable|json', // Change to json validation
                'is_archived' => 'sometimes|boolean',
            ]);

            // Handle meta_data - decode JSON string to array
            if (isset($validated['meta_data']) && is_string($validated['meta_data'])) {
                $validated['meta_data'] = json_decode($validated['meta_data'], true);
            }

            $job->update($validated);

            return response()->json([
                'status' => true,
                'message' => 'Job updated successfully.',
                'data' => $job,
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error updating job: '.$e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Error updating job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * ===============================
     * DESTROY - Delete Job
     * ===============================
     */
    public function destroy($id)
    {
        try {
            $job = JobTable::findOrFail($id);
            $job->delete();

            return response()->json([
                'status' => true,
                'message' => 'Job deleted successfully.',
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting job: '.$e->getMessage());

            return response()->json([
                'status' => false,
                'message' => 'Error deleting job',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
