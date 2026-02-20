import React, { useState, useEffect } from "react";
import axios from "axios";
import { X } from "lucide-react";

const AddServiceForm = ({
    editingService,
    setShowForm,
    setEditingService,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [serviceForm, setServiceForm] = useState({
        name: "",
        short_description: "",
        long_description: "",
        image: null,
        is_featured: false,
        meta_data: "",
        is_archived: false,
    });

    // Use Effect for editing
    useEffect(() => {
        if (editingService) {
            setServiceForm({
                name: editingService.name || "",
                short_description: editingService.short_description || "",
                long_description: editingService.long_description || "",
                image: null,
                is_featured: editingService.is_featured || false,
                meta_data: editingService.meta_data || "",
                is_archived: editingService.is_archived || false,
            });
        } else {
            setServiceForm({
                name: "",
                short_description: "",
                long_description: "",
                image: null,
                is_featured: false,
                meta_data: "",
                is_archived: false,
            });
        }
    }, [editingService]);

    // Handle Create Service
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourservices.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating service", error);
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Append all form data
        for (const key in serviceForm) {
            if (serviceForm[key] !== null && serviceForm[key] !== "") {
                if (key === 'is_featured' || key === 'is_archived') {
                    formData.append(key, serviceForm[key] ? '1' : '0');
                } else {
                    formData.append(key, serviceForm[key]);
                }
            }
        }

        try {
            setSubmitting(true);

            if (editingService) {
                // Editing existing service
                await handleUpdate(formData, editingService.id);
            } else {
                // Creating new service
                await handleCreate(formData);
            }

            // Reset form
            setServiceForm({
                name: "",
                short_description: "",
                long_description: "",
                image: null,
                is_featured: false,
                meta_data: "",
                is_archived: false,
            });

            setShowForm(false);
            setEditingService(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for image and the others
    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;
        
        if (type === "file") {
            setServiceForm((prev) => ({
                ...prev,
                [name]: files[0],
            }));
        } else if (type === "checkbox") {
            setServiceForm((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setServiceForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        {editingService ? "Edit Service" : "Add New Service"}
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditingService(null);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={serviceForm.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <textarea
                            name="short_description"
                            value={serviceForm.short_description}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Long Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Long Description
                        </label>
                        <textarea
                            name="long_description"
                            value={serviceForm.long_description}
                            onChange={handleChange}
                            rows="5"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Image
                        </label>
                        {editingService && editingService.image && (
                            <div className="mb-2">
                                <img 
                                    src={`/storage/${editingService.image}`} 
                                    alt="Current"
                                    className="w-32 h-32 object-cover rounded"
                                />
                                <p className="text-xs text-gray-500 mt-1">Current Image</p>
                            </div>
                        )}
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
                    </div>

                    {/* Meta Data */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Data (JSON)
                        </label>
                        <textarea
                            name="meta_data"
                            value={serviceForm.meta_data}
                            onChange={handleChange}
                            rows="3"
                            placeholder='{"key": "value"}'
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Checkboxes */}
                    <div className="flex gap-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={serviceForm.is_featured}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Featured</span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_archived"
                                checked={serviceForm.is_archived}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Archived</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Saving..." : (editingService ? "Update Service" : "Create Service")}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingService(null);
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddServiceForm;