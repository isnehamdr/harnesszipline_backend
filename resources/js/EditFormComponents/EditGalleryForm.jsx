import { X, Star, Archive, Upload, Image as ImageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const EditGalleryForm = ({ editingGallery, setShowForm, setReloadTrigger, setEditingGallery }) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [galleryForm, setGalleryForm] = useState({
        name: "",
        images: [],
        is_archived: false,
        is_featured: false,
    });
    const [imagePreviews, setImagePreviews] = useState([]);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    // File size limits in bytes - 2MB max
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

    // Lock body scroll when form mounts
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
        };
    }, []);

    // Load data when editing
    useEffect(() => {
        if (editingGallery) {
            setGalleryForm({
                name: editingGallery.name || "",
                images: [],
                is_archived: Boolean(editingGallery.is_archived),
                is_featured: Boolean(editingGallery.is_featured),
            });
            
            if (editingGallery.images && editingGallery.images.length > 0) {
                const previews = editingGallery.images.map(img => ({
                    id: img.id,
                    url: `${imgurl}/${img.path}`,
                    isExisting: true
                }));
                setImagePreviews(previews);
            }
        }
    }, [editingGallery]);

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourgallery.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            return response.data;
        } catch (error) {
            console.log("Error updating gallery item", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        if (!galleryForm.name.trim()) {
            setErrors({ name: ['Gallery name is required'] });
            return;
        }

        const formData = new FormData();
        
        formData.append("name", galleryForm.name.trim());
        formData.append("is_archived", galleryForm.is_archived ? "1" : "0");
        formData.append("is_featured", galleryForm.is_featured ? "1" : "0");

        // Append new images
        if (galleryForm.images && galleryForm.images.length > 0) {
            galleryForm.images.forEach((image, index) => {
                formData.append(`images[]`, image);
                formData.append(`alt_text[${index}]`, galleryForm.name);
            });
        }

        try {
            setSubmitting(true);
            await handleUpdate(formData, editingGallery.id);

            setReloadTrigger((prev) => !prev);
            setShowForm(false);
            setEditingGallery(null);
            
        } catch (error) {
            console.error("Error updating data:", error);
            
            if (error.response) {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors || {});
                    alert('Please check the form for errors.');
                } else {
                    alert(`Server error: ${error.response.data.message || 'Please try again.'}`);
                }
            } else if (error.request) {
                alert('No response from server. Please check your connection.');
            } else {
                alert('Error: ' + error.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        let imageFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            if (!isValidType) {
                alert(`File ${file.name} is not a valid image type`);
            }
            return isValidType;
        });

        if (imageFiles.length === 0) return;

        const oversizedFiles = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
        if (oversizedFiles.length > 0) {
            alert(`${oversizedFiles.length} image(s) exceed 2MB limit and were ignored`);
            imageFiles = imageFiles.filter(file => file.size <= MAX_IMAGE_SIZE);
        }

        if (imageFiles.length === 0) return;

        setGalleryForm((prev) => ({
            ...prev,
            images: [...prev.images, ...imageFiles],
        }));

        imageFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, {
                    url: reader.result,
                    isExisting: false,
                    file: file
                }]);
            };
            reader.readAsDataURL(file);
        });
        
        if (errors.images) {
            setErrors(prev => ({ ...prev, images: null }));
        }
    };

    const removeImage = (index) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setGalleryForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const removeExistingImage = (index) => {
        // For existing images, you might want to mark them for deletion
        // This would require additional logic in your backend
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingGallery(null);
    };

    const toggleFeatured = () => {
        setGalleryForm((prev) => ({
            ...prev,
            is_featured: !prev.is_featured,
        }));
    };

    const toggleArchived = () => {
        setGalleryForm((prev) => ({
            ...prev,
            is_archived: !prev.is_archived,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        Edit Gallery Item
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gallery Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={galleryForm.name}
                            onChange={(e) => {
                                setGalleryForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }));
                                if (errors.name) {
                                    setErrors(prev => ({ ...prev, name: null }));
                                }
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter gallery name"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="flex items-center text-lg font-semibold text-gray-700">
                            <ImageIcon className="mr-3 text-gray-600" size={22} />
                            Gallery Images
                        </label>
                        <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
                            {imagePreviews.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-24 w-full object-cover rounded-lg shadow bg-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => preview.isExisting ? removeExistingImage(index) : removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X size={14} />
                                                </button>
                                                {preview.isExisting && (
                                                    <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded opacity-75">
                                                        Existing
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            {imagePreviews.length} image(s) total
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Click to add more images
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-lg text-gray-700">
                                        Click to upload gallery images
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Hold Ctrl/Cmd to select multiple files | Max: 2MB per file
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="images[]"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                multiple
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        
                        {(errors.images || errors["images.0"] || errors["images.*"]) && (
                            <p className="text-sm text-red-600">
                                {errors.images?.[0] || errors["images.0"]?.[0] || errors["images.*"]?.[0]}
                            </p>
                        )}
                    </div>

                    {/* Toggle Switches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Featured Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Star className="text-gray-600" size={20} />
                                <span className="text-sm font-medium text-gray-700">
                                    Featured Gallery
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleFeatured}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    galleryForm.is_featured
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        galleryForm.is_featured
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Archived Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Archive className="text-gray-600" size={20} />
                                <span className="text-sm font-medium text-gray-700">
                                    Archive Gallery
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleArchived}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    galleryForm.is_archived
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        galleryForm.is_archived
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Hidden inputs */}
                    <input
                        type="hidden"
                        name="is_featured"
                        value={galleryForm.is_featured ? "1" : "0"}
                    />
                    <input
                        type="hidden"
                        name="is_archived"
                        value={galleryForm.is_archived ? "1" : "0"}
                    />

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Updating...
                                </span>
                            ) : (
                                "Update Gallery"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditGalleryForm;