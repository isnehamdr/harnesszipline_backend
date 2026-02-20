import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddPdfForm = ({
    editingPdf,
    setShowForm,
    handleUpdate,
    setReloadTrigger,
    setEditingPdf,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [pdfForm, setPdfForm] = useState({
        title: "",
        description: "",
        pdf: null,
    });

    useEffect(() => {
        if (editingPdf) {
            setPdfForm({
                title: editingPdf.title || "",
                description: editingPdf.description || "",
                pdf: null,
            });
        } else {
            setPdfForm({ title: "", description: "", pdf: null });
        }
        setErrors({});
    }, [editingPdf]);

    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(route("ourpdfs.store"), formData, {
                headers: { 
                    "Content-Type": "multipart/form-data",
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
            });
            setReloadTrigger((prev) => !prev);
            alert("PDF uploaded successfully!");
            return response.data;
        } catch (error) {
            console.error("Create error details:", error.response?.data);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        // Validate form
        const validationErrors = {};
        if (!pdfForm.title.trim()) {
            validationErrors.title = "Title is required";
        }
        if (!editingPdf && !pdfForm.pdf) {
            validationErrors.pdf = "PDF file is required";
        }
        if (pdfForm.pdf && pdfForm.pdf.size > 5 * 1024 * 1024) {
            validationErrors.pdf = "File size must be less than 5MB";
        }
        
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const formData = new FormData();
        formData.append('title', pdfForm.title.trim());
        
        if (pdfForm.description?.trim()) {
            formData.append('description', pdfForm.description.trim());
        }

        if (pdfForm.pdf) {
            formData.append('pdf', pdfForm.pdf);
        }

        try {
            setSubmitting(true);
            if (editingPdf) {
                await handleUpdate(formData, editingPdf.id);
            } else {
                await handleCreate(formData);
            }
            setShowForm(false);
            setEditingPdf(null);
        } catch (error) {
            console.error("Error saving PDF:", error);
            
            // Handle validation errors from server
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Failed to save PDF. Please check the form and try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setPdfForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingPdf(null);
        setErrors({});
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingPdf ? "Edit PDF Item" : "Add New PDF Item"}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={pdfForm.title}
                            onChange={handleChange}
                            placeholder="Enter PDF title"
                            className={`w-full border ${
                                errors.title ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={pdfForm.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Enter a short description (optional)"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                        />
                    </div>

                    {/* PDF File */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            PDF File{" "}
                            {!editingPdf && <span className="text-red-500">*</span>}
                            {editingPdf && (
                                <span className="text-gray-400 font-normal ml-1">
                                    (leave empty to keep existing file)
                                </span>
                            )}
                        </label>
                        <input
                            type="file"
                            name="pdf"
                            accept=".pdf"
                            onChange={handleChange}
                            className={`w-full border ${
                                errors.pdf ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100`}
                        />
                        {errors.pdf && (
                            <p className="mt-1 text-sm text-red-600">{errors.pdf}</p>
                        )}
                        {pdfForm.pdf && (
                            <p className="mt-1 text-sm text-gray-500">
                                Selected file: {pdfForm.pdf.name} ({(pdfForm.pdf.size / 1024).toFixed(2)} KB)
                            </p>
                        )}
                        {editingPdf && !pdfForm.pdf && (
                            <p className="mt-1 text-sm text-gray-500">
                                Current file: {editingPdf.pdf}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {submitting
                                ? "Saving..."
                                : editingPdf
                                ? "Update PDF"
                                : "Upload PDF"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddPdfForm;