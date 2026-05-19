<?php

namespace App\Http\Controllers;

use App\Models\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PdfController extends Controller
{
    /**
     * Get all PDFs
     */
    public function index()
    {
        try {
            $pdfs = Pdf::latest()->get();
            return response()->json($pdfs);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch PDFs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store new PDF
     */
    public function store(Request $request)
    {
        try {
            // Log request for debugging
            \Log::info('PDF Store Request:', [
                'all' => $request->all(),
                'files' => $_FILES,
                'has_file' => $request->hasFile('pdf'),
                'file_info' => $request->hasFile('pdf') ? [
                    'name' => $request->file('pdf')->getClientOriginalName(),
                    'size' => $request->file('pdf')->getSize(),
                    'mime' => $request->file('pdf')->getMimeType()
                ] : null
            ]);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'pdf' => 'required|file|mimes:pdf|max:5120', // 5MB max
                'description' => 'nullable|string|max:1000',
            ]);

            // Check if file exists in request
            if (!$request->hasFile('pdf')) {
                return response()->json([
                    'message' => 'PDF file is required',
                    'errors' => ['pdf' => ['No file was uploaded']]
                ], 422);
            }

            $file = $request->file('pdf');
            
            // Check if file is valid
            if (!$file->isValid()) {
                return response()->json([
                    'message' => 'Invalid file upload',
                    'errors' => ['pdf' => ['The uploaded file is invalid']]
                ], 422);
            }

            // Upload file
            $filePath = $file->store('pdfs', 'public');

            if (!$filePath) {
                throw new \Exception('Failed to store file');
            }

            $pdf = Pdf::create([
                'title' => $request->title,
                'pdf' => $filePath,
                'description' => $request->description,
            ]);

            $this->logActivity("Created PDF: {$pdf->title}");

            return response()->json([
                'message' => 'PDF uploaded successfully',
                'data' => $pdf
            ], 201);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('PDF Store Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to upload PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update PDF
     */
    public function update(Request $request, $id)
    {
        try {
            \Log::info('PDF Update Request:', [
                'id' => $id,
                'all' => $request->all(),
                'files' => $_FILES,
                'has_file' => $request->hasFile('pdf')
            ]);

            $pdf = Pdf::findOrFail($id);

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'pdf' => 'nullable|file|mimes:pdf|max:5120',
                'description' => 'nullable|string|max:1000',
            ]);

            // If new file uploaded
            if ($request->hasFile('pdf')) {
                $file = $request->file('pdf');
                
                if (!$file->isValid()) {
                    return response()->json([
                        'message' => 'Invalid file upload',
                        'errors' => ['pdf' => ['The uploaded file is invalid']]
                    ], 422);
                }

                // Delete old file
                if ($pdf->pdf && Storage::disk('public')->exists($pdf->pdf)) {
                    Storage::disk('public')->delete($pdf->pdf);
                }

                // Store new file
                $filePath = $file->store('pdfs', 'public');
                $pdf->pdf = $filePath;
            }

            $pdf->title = $request->title;
            $pdf->description = $request->description;
            $pdf->save();

            $this->logActivity("Updated PDF: {$pdf->title}");

            return response()->json([
                'message' => 'PDF updated successfully',
                'data' => $pdf
            ]);
            
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Log::error('PDF Update Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to update PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete PDF
     */
    public function destroy($id)
    {
        try {
            $pdf = Pdf::findOrFail($id);
            
            // Delete file from storage
            if ($pdf->pdf && Storage::disk('public')->exists($pdf->pdf)) {
                Storage::disk('public')->delete($pdf->pdf);
            }
            
            $pdf->delete();

            $this->logActivity("Deleted PDF: {$pdf->title}");

            return response()->json([
                'message' => 'PDF deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            \Log::error('PDF Delete Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete PDF',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
