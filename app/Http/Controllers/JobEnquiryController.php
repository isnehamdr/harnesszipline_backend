<?php

namespace App\Http\Controllers;

use App\Models\JobEnquiry;
use App\Models\JobTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JobEnquiryController extends Controller
{
    /**
     * Display a listing of job enquiries
     */
    public function index()
    {
        // Remove the where clause to show ALL enquiries including archived ones
        $enquiries = JobEnquiry::with('job')
            ->latest()
            ->paginate(10);

        return response()->json([
            'success' => true,
            'message' => 'Job enquiries fetched successfully',
            'data' => $enquiries
        ]);
    }

    /**
     * Store a newly created job enquiry
     */
    public function store(Request $request)
    {
        $request->validate([
            'job_id'       => 'required|exists:job_tables,id',
            'full_name'    => 'required|string|max:255',
            'email'        => 'required|email|max:255',
            'phone_number' => 'required|string|max:20',
            'description'  => 'nullable|string',
            'cv'           => 'required|file|mimes:pdf,doc,docx|max:2048',
        ]);

        // Upload CV
        $cvPath = null;
        if ($request->hasFile('cv')) {
            $cvPath = $request->file('cv')->store('job_enquiries/cv', 'public');
        }

        $enquiry = JobEnquiry::create([
            'job_id'       => $request->job_id,
            'full_name'    => $request->full_name,
            'email'        => $request->email,
            'phone_number' => $request->phone_number,
            'description'  => $request->description,
            'cv'           => $cvPath,
            'is_archived'  => false,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Job enquiry submitted successfully',
            'data'    => $enquiry
        ], 201);
    }

    /**
     * Update the specified job enquiry
     */
    public function update(Request $request, $id)
    {
        $enquiry = JobEnquiry::findOrFail($id);

        $request->validate([
            'job_id'       => 'required|exists:job_tables,id',
            'full_name'    => 'required|string|max:255',
            'email'        => 'required|email|max:255',
            'phone_number' => 'required|string|max:20',
            'description'  => 'nullable|string',
            'cv'           => 'nullable|file|mimes:pdf,doc,docx|max:2048',
            'is_archived'  => 'nullable|boolean',
        ]);

        $updateData = [
            'job_id'       => $request->job_id,
            'full_name'    => $request->full_name,
            'email'        => $request->email,
            'phone_number' => $request->phone_number,
            'description'  => $request->description,
        ];

        // Only update is_archived if it's provided in the request
        if ($request->has('is_archived')) {
            $updateData['is_archived'] = $request->is_archived;
        }

        // Update CV if new file uploaded
        if ($request->hasFile('cv')) {
            // Delete old file
            if ($enquiry->cv && Storage::disk('public')->exists($enquiry->cv)) {
                Storage::disk('public')->delete($enquiry->cv);
            }

            $updateData['cv'] = $request->file('cv')->store('job_enquiries/cv', 'public');
        }

        $enquiry->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Job enquiry updated successfully',
            'data'    => $enquiry
        ]);
    }

    /**
     * Remove the specified job enquiry
     */
    public function destroy($id)
    {
        $enquiry = JobEnquiry::findOrFail($id);

        // Delete CV file
        if ($enquiry->cv && Storage::disk('public')->exists($enquiry->cv)) {
            Storage::disk('public')->delete($enquiry->cv);
        }

        $enquiry->delete();

        return response()->json([
            'success' => true,
            'message' => 'Job enquiry deleted successfully'
        ]);
    }
}