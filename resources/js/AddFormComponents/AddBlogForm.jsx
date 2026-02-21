import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const AddBlogForm = ({ 
    editingBlog, 
    setShowForm, 
    handleUpdate, 
    setReloadTrigger 
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [blogForm, setBlogForm] = useState({
        title: "",
        short_description: "",
        long_description: "",
        image: null,
        meta_data: "",
        is_archived: false,
    });

    // Use Effect for editing
    useEffect(() => {
        if (editingBlog) {
            setBlogForm({
                title: editingBlog.title || "",
                short_description: editingBlog.short_description || "",
                long_description: editingBlog.long_description || "",
                image: null, // Don't set the image here as it's a file input
                meta_data: typeof editingBlog.meta_data === 'object' 
                    ? JSON.stringify(editingBlog.meta_data) 
                    : editingBlog.meta_data || "",
                is_archived: editingBlog.is_archived || false,
            });
        } else {
            setBlogForm({
                title: "",
                short_description: "",
                long_description: "",
                image: null,
                meta_data: "",
                is_archived: false,
            });
        }
        setErrors({});
    }, [editingBlog]);

    // Handle Close
    const handleClose = () => {
        setShowForm(false);
        setBlogForm({
            title: "",
            short_description: "",
            long_description: "",
            image: null,
            meta_data: "",
            is_archived: false,
        });
        setErrors({});
    };

    // Handle Create Blog
    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(route("ourblog.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error creating blog", error);
            if (error.response) {
                if (error.response.status === 422) {
                    // Validation errors
                    setErrors(error.response.data.errors || {});
                }
                throw error;
            }
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Append all form data
        Object.keys(blogForm).forEach(key => {
            if (blogForm[key] !== null && blogForm[key] !== "") {
                formData.append(key, blogForm[key]);
            }
        });

        // Ensure is_archived is sent as boolean
        formData.set('is_archived', blogForm.is_archived ? '1' : '0');
        
        try {
            setSubmitting(true);
            setErrors({});

            if (editingBlog) {
                // Editing existing blog
                await handleUpdate(formData, editingBlog.id);
            } else {
                // Creating new blog
                await handleCreate(formData);
            }
            
            handleClose();
        } catch (error) {
            console.log("Error saving data", error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // handle change for image and the others
    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;
        setBlogForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] 
                    : type === "checkbox" ? checked 
                    : value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingBlog ? "Edit Blog Item" : "Add New Blog Item"}
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
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={blogForm.title}
                            onChange={handleChange}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
                        )}
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description *
                        </label>
                        <textarea
                            name="short_description"
                            value={blogForm.short_description}
                            onChange={handleChange}
                            required
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
                            Long Description *
                        </label>
                        <textarea
                            name="long_description"
                            value={blogForm.long_description}
                            onChange={handleChange}
                            required
                            rows="6"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.long_description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.long_description && (
                            <p className="mt-1 text-sm text-red-600">{errors.long_description[0]}</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image {!editingBlog && '*'}
                        </label>
                        <input
                            type="file"
                            name="image"
                            onChange={handleChange}
                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.image ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.image && (
                            <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>
                        )}
                        {editingBlog && editingBlog.image && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">Current Image:</p>
                                <img 
                                    src={`/storage/${editingBlog.image}`} 
                                    alt="Current" 
                                    className="w-20 h-20 object-cover rounded mt-1"
                                />
                            </div>
                        )}
                        {editingBlog && (
                            <p className="text-sm text-gray-500 mt-1">
                                Leave empty to keep current image
                            </p>
                        )}
                    </div>

                    {/* Meta Data */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Data (JSON format)
                        </label>
                        <input
                            type="text"
                            name="meta_data"
                            value={blogForm.meta_data}
                            onChange={handleChange}
                            placeholder='{"key": "value"}'
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.meta_data ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.meta_data && (
                            <p className="mt-1 text-sm text-red-600">{errors.meta_data[0]}</p>
                        )}
                    </div>

                    {/* Is Archived */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_archived"
                            checked={blogForm.is_archived}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">
                            Is Archived
                        </label>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : (editingBlog ? "Update" : "Create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBlogForm;