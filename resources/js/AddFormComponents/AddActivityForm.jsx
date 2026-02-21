import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";

const AddActivityForm = ({
    editingActivity,
    setShowForm,
    setEditingActivity,
    handleUpdate,
    setReloadTrigger,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [activityForm, setActivityForm] = useState({
        name: "",
        short_description: "",
        long_description: "",
        base_price: "",
        images: [],
        meta_data: "",
        is_featured: false,
        is_archived: false,
    });

    // Use Effect
    useEffect(() => {
        if (editingActivity) {
            setActivityForm({
                name: editingActivity.name || "",
                short_description: editingActivity.short_description || "",
                long_description: editingActivity.long_description || "",
                base_price: editingActivity.base_price || "",
                images: [],
                meta_data: editingActivity.meta_data ? 
                    (typeof editingActivity.meta_data === 'object' 
                        ? JSON.stringify(editingActivity.meta_data, null, 2)
                        : editingActivity.meta_data) 
                    : "",
                is_featured: editingActivity.is_featured || false,
                is_archived: editingActivity.is_archived || false,
            });
        } else {
            setActivityForm({
                name: "",
                short_description: "",
                long_description: "",
                base_price: "",
                images: [],
                meta_data: "",
                is_featured: false,
                is_archived: false,
            });
        }
        setErrors({});
    }, [editingActivity]);

    // Handle Close
    const handleClose = () => {
        setShowForm(false);
        setEditingActivity(null);
        setErrors({});
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        const formData = new FormData();
        
        // Append basic fields
        formData.append('name', activityForm.name);
        formData.append('base_price', activityForm.base_price);
        
        // Append optional fields if they have values
        if (activityForm.short_description) {
            formData.append('short_description', activityForm.short_description);
        }
        
        if (activityForm.long_description) {
            formData.append('long_description', activityForm.long_description);
        }
        
        // Handle meta_data - send as JSON string
        if (activityForm.meta_data) {
            try {
                // Try to parse if it's a valid JSON, otherwise send as string
                JSON.parse(activityForm.meta_data);
                formData.append('meta_data', activityForm.meta_data);
            } catch (e) {
                // If not valid JSON, create a simple JSON object
                const simpleMeta = { description: activityForm.meta_data };
                formData.append('meta_data', JSON.stringify(simpleMeta));
            }
        }
        
        // Handle boolean fields - send as 0/1 strings
        formData.append('is_featured', activityForm.is_featured ? '1' : '0');
        formData.append('is_archived', activityForm.is_archived ? '1' : '0');
        
        // Handle images
        if (activityForm.images && activityForm.images.length > 0) {
            activityForm.images.forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });
        }

        try {
            setSubmitting(true);

            if (editingActivity) {
                // For update - IMPORTANT: Use POST with _method field
                // Your route only accepts POST, so we need to use POST and let Laravel handle the method spoofing
                formData.append('_method', 'PUT');
                
                // Using POST as defined in your web.php
                const response = await axios.post(
                    route("ouractivity.update", { id: editingActivity.id }), 
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                console.log('Update response:', response.data);
            } else {
                // Create new activity
                const response = await axios.post(
                    route("ouractivity.store"), 
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                console.log('Create response:', response.data);
            }
            
            setReloadTrigger((prev) => !prev);
            handleClose();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                console.log("Validation errors:", error.response.data.errors);
            } else if (error.response?.status === 405) {
                console.error("Method not allowed. Check your route configuration.");
                alert("Error: Method not allowed. Please check your route configuration.");
            } else {
                console.log("Error saving data", error);
                alert(`Error: ${error.response?.data?.message || error.message}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for images and other fields
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        if (type === "file") {
            // Handle multiple file selection
            const fileArray = Array.from(files);
            setActivityForm((prev) => ({
                ...prev,
                [name]: fileArray,
            }));
            // Clear image errors when new files are selected
            setErrors((prev) => ({ ...prev, 'images.0': undefined, 'images.*': undefined }));
        } else if (type === "checkbox") {
            setActivityForm((prev) => ({
                ...prev,
                [name]: checked,
            }));
        } else {
            setActivityForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingActivity
                            ? "Edit Activity Item"
                            : "Add New Activity Item"}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={activityForm.name}
                            onChange={handleChange}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                        )}
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <textarea
                            name="short_description"
                            value={activityForm.short_description}
                            onChange={handleChange}
                            rows="3"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.short_description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.short_description && (
                            <p className="mt-1 text-sm text-red-600">{errors.short_description[0]}</p>
                        )}
                    </div>

                    {/* Long Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Long Description
                        </label>
                        <textarea
                            name="long_description"
                            value={activityForm.long_description}
                            onChange={handleChange}
                            rows="5"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.long_description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.long_description && (
                            <p className="mt-1 text-sm text-red-600">{errors.long_description[0]}</p>
                        )}
                    </div>

                    {/* Base Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Base Price *
                        </label>
                        <input
                            type="number"
                            name="base_price"
                            value={activityForm.base_price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.base_price ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.base_price && (
                            <p className="mt-1 text-sm text-red-600">{errors.base_price[0]}</p>
                        )}
                    </div>

                    {/* Image Upload - Multiple */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Images (You can select multiple)
                        </label>
                        <input
                            type="file"
                            name="images"
                            onChange={handleChange}
                            accept="image/jpeg,image/png,image/jpg,image/webp"
                            multiple
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors['images.0'] || errors['images.*'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {activityForm.images.length > 0 && (
                            <p className="mt-1 text-sm text-gray-500">
                                {activityForm.images.length} file(s) selected
                            </p>
                        )}
                        {(errors['images.0'] || errors['images.*']) && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors['images.0']?.[0] || errors['images.*']?.[0]}
                            </p>
                        )}
                        
                        {editingActivity && editingActivity.images && editingActivity.images.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500 mb-1">Current images:</p>
                                <div className="flex gap-2 flex-wrap">
                                    {editingActivity.images.map((img, idx) => (
                                        <div key={idx} className="relative">
                                            <img 
                                                src={`/storage/${img.path}`} 
                                                alt={img.alt_text}
                                                className="w-16 h-16 object-cover rounded"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/64?text=No+Image';
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Meta Data */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Data (JSON)
                        </label>
                        <textarea
                            name="meta_data"
                            value={activityForm.meta_data}
                            onChange={handleChange}
                            rows="3"
                            placeholder='{"key": "value"}'
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm ${
                                errors.meta_data ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.meta_data && (
                            <p className="mt-1 text-sm text-red-600">{errors.meta_data[0]}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Enter valid JSON or leave empty
                        </p>
                    </div>

                    {/* Checkboxes */}
                    <div className="flex items-center space-x-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_featured"
                                checked={activityForm.is_featured}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Featured</span>
                        </label>

                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_archived"
                                checked={activityForm.is_archived}
                                onChange={handleChange}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Archived</span>
                        </label>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting}
                        >
                            {submitting ? "Saving..." : (editingActivity ? "Update" : "Create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddActivityForm;