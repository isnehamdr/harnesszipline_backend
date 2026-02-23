<?php

namespace App\Http\Controllers;

use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Job::query();

        // Optional filtering
        if ($request->has('is_archived')) {
            $query->where('is_archived', $request->is_archived);
        }

        $jobs = $query->latest()->paginate(10);

        return response()->json([
            'status' => true,
            'message' => 'Jobs retrieved successfully.',
            'data' => $jobs
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'content' => 'nullable|string',
            'meta_data' => 'nullable|array',
            'is_archived' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $job = Job::create([
            'title' => $request->title,
            'short_description' => $request->short_description,
            'content' => $request->content,
            'meta_data' => $request->meta_data,
            'is_archived' => $request->is_archived ?? false,
        ]);

        return response()->json([
            'status' => true,
            'message' => 'Job created successfully.',
            'data' => $job
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $job = Job::find($id);

        if (!$job) {
            return response()->json([
                'status' => false,
                'message' => 'Job not found.'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'short_description' => 'nullable|string',
            'content' => 'nullable|string',
            'meta_data' => 'nullable|array',
            'is_archived' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Validation error.',
                'errors' => $validator->errors()
            ], 422);
        }

        $job->update($request->only([
            'title',
            'short_description',
            'content',
            'meta_data',
            'is_archived'
        ]));

        return response()->json([
            'status' => true,
            'message' => 'Job updated successfully.',
            'data' => $job
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $job = Job::find($id);

        if (!$job) {
            return response()->json([
                'status' => false,
                'message' => 'Job not found.'
            ], 404);
        }

        $job->delete();

        return response()->json([
            'status' => true,
            'message' => 'Job deleted successfully.'
        ]);
    }
}