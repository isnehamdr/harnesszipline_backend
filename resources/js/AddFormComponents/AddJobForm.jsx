import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddJobForm = ({
    setShowForm,
    editingJob,
    setEditingJob,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [jobForm, setJobForm] = useState({
        title: "",
        short_description: "",
        content: "",
        meta_data: "",
        is_archived: false,
    });

    useEffect(() => {
        if (editingJob) {
            const metaDataValue = editingJob.meta_data 
                ? (typeof editingJob.meta_data === 'object' 
                    ? JSON.stringify(editingJob.meta_data, null, 2)
                    : editingJob.meta_data)
                : "";
                
            setJobForm({
                title: editingJob.title || "",
                short_description: editingJob.short_description || "",
                content: editingJob.content || "",
                meta_data: metaDataValue,
                is_archived: editingJob.is_archived || false,
            });
        } else {
            setJobForm({
                title: "",
                short_description: "",
                content: "",
                meta_data: "",
                is_archived: false,
            });
        }
        setValidationErrors({});
    }, [editingJob]);

    const handleCreate = async (formData) => {
        try {
            // Log FormData contents for debugging
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            const response = await axios.post(route("ourjob.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Create response:", response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating job - Full error:", error);
            console.log("Error response:", error.response);
            console.log("Error data:", error.response?.data);
            
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors || {});
            }
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});
        
        const formData = new FormData();
        
        // Add fields one by one with proper handling
        formData.append("title", jobForm.title || "");
        
        if (jobForm.short_description) {
            formData.append("short_description", jobForm.short_description);
        }
        
        if (jobForm.content) {
            formData.append("content", jobForm.content);
        }
        
        // Handle meta_data
        if (jobForm.meta_data && jobForm.meta_data.trim() !== "") {
            try {
                // Test if it's valid JSON
                JSON.parse(jobForm.meta_data);
                formData.append("meta_data", jobForm.meta_data);
            } catch (error) {
                // If not valid JSON, send as a simple object
                formData.append("meta_data", JSON.stringify({ value: jobForm.meta_data }));
            }
        } else {
            formData.append("meta_data", JSON.stringify(null));
        }
        
        // Handle boolean - send as string '1' or '0'
        formData.append("is_archived", jobForm.is_archived ? "1" : "0");

        try {
            setSubmitting(true);
            if (editingJob) {
                await handleUpdate(formData, editingJob.id);
            } else {
                await handleCreate(formData);
            }
            
            setJobForm({
                title: "",
                short_description: "",
                content: "",
                meta_data: "",
                is_archived: false,
            });
            setShowForm(false);
            setEditingJob(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setJobForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingJob ? "Edit Job" : "Add New Job"}
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditingJob(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={jobForm.title}
                            onChange={handleChange}
                            required
                            className={`w-full border ${validationErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <input
                            type="text"
                            name="short_description"
                            value={jobForm.short_description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <textarea
                            name="content"
                            value={jobForm.content}
                            onChange={handleChange}
                            rows={5}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Data (JSON format)
                        </label>
                        <textarea
                            name="meta_data"
                            value={jobForm.meta_data}
                            onChange={handleChange}
                            rows={4}
                            placeholder='{"key": "value"} or ["item1", "item2"]'
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter as JSON object or array</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="is_archived"
                            id="is_archived"
                            checked={jobForm.is_archived}
                            onChange={handleChange}
                            className="w-4 h-4 accent-indigo-600"
                        />
                        <label htmlFor="is_archived" className="text-sm text-gray-700">
                            Archived
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingJob(null);
                            }}
                            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm disabled:opacity-50"
                        >
                            {submitting
                                ? "Saving..."
                                : editingJob
                                ? "Update Job"
                                : "Create Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddJobForm;