// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddGalleryForm = ({
//     editingGallery,
//     setShowForm,
//     handleUpdate,
//     setReloadTrigger,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [galleryForm, setGalleryForm] = useState({
//         name: "",
//         image: "",
//         is_archived: false,
//         is_featured: false,
//         is_display_image: false,
//     });

//     //  Use Effect
//     useEffect(() => {
//         if (editingGallery) {
//             setGalleryForm({
//                 ...editingGallery,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setGalleryForm({
//                 name: "",
//                 image: "",
//                 is_archived: false,
//                 is_featured: false,
//                 is_display_image: false,
//             });
//         }
//     }, [editingGallery]);

//     // Handle Create Home
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("gallery.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating gallery item", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in galleryForm) {
//             if (galleryForm[key] !== null && galleryForm[key] !== "") {
//                 formData.append(key, galleryForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingGallery) {
//                 // Editing existing gallery item
//                 await handleUpdate(formData, editingGallery.id);
//             } else {
//                 // Creating new gallery item
//                 await handleCreate(formData);
//             }
//             setGalleryForm({
//                 name: "",
//                 image: "",
//                 is_archived: false,
//                 is_featured: false,
//                 is_display_image: false,
//             });

//             setShowForm(false);
//             setEditingGallery(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setGalleryForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-lg h-[600px] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex flex-col gap-4">
//                     <h2 className="text-2xl font-bold mb-4">
//                         {editingGallery
//                             ? "Edit Gallery Item"
//                             : "Add New Gallery Item"}
//                     </h2>
//                     <button
//                         onClick={() => {
//                             setShowForm(false);
//                         }}
//                         className="absolute top-4 right-4"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddGalleryForm;



import { X } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AddGalleryForm = ({
    editingGallery,
    setShowForm,
    handleUpdate,
    setReloadTrigger,
    setEditingGallery,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [galleryForm, setGalleryForm] = useState({
        name: "",
        images: [],
        is_archived: false,
        is_featured: false,
    });
    const [imagePreviews, setImagePreviews] = useState([]);

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
                    url: `/storage/${img.path}`,
                    isExisting: true
                }));
                setImagePreviews(previews);
            }
        } else {
            resetForm();
        }
    }, [editingGallery]);

    const resetForm = () => {
        setGalleryForm({
            name: "",
            images: [],
            is_archived: false,
            is_featured: false,
        });
        setImagePreviews([]);
        setErrors({});
    };

    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(route("ourgallery.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.error("Error creating gallery:", error);
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                throw new Error('Validation failed');
            }
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

        // For new galleries, require at least one image
        if (!editingGallery && galleryForm.images.length === 0) {
            setErrors({ images: ['Please select at least one image'] });
            return;
        }

        const formData = new FormData();
        
        // Append basic fields
        formData.append("name", galleryForm.name.trim());
        formData.append("is_archived", galleryForm.is_archived ? "1" : "0");
        formData.append("is_featured", galleryForm.is_featured ? "1" : "0");

        // Append images - IMPORTANT: Use 'images[]' for multiple files
        if (galleryForm.images && galleryForm.images.length > 0) {
            galleryForm.images.forEach((image, index) => {
                formData.append(`images[]`, image);
                formData.append(`alt_text[${index}]`, galleryForm.name);
            });
        }

        // Log form data for debugging
        console.log('Submitting form data:');
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            setSubmitting(true);

            if (editingGallery) {
                // For update, add method spoofing
                formData.append('_method', 'PUT');
                await handleUpdate(formData, editingGallery.id);
            } else {
                await handleCreate(formData);
            }

            // Success - close form and reset
            resetForm();
            setShowForm(false);
            setEditingGallery(null);
            
        } catch (error) {
            console.error("Error saving data:", error);
            
            if (error.response) {
                // The request was made and the server responded with a status code
                console.error('Error response:', error.response.data);
                
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors || {});
                    alert('Please check the form for errors.');
                } else {
                    alert(`Server error: ${error.response.data.message || 'Please try again.'}`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                alert('No response from server. Please check your connection.');
            } else {
                // Something happened in setting up the request
                alert('Error: ' + error.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type);
            const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB
            
            if (!isValidType) {
                alert(`File ${file.name} is not a valid image type. Please use JPG, PNG, or WEBP.`);
            }
            if (!isValidSize) {
                alert(`File ${file.name} exceeds 2MB limit.`);
            }
            
            return isValidType && isValidSize;
        });

        if (validFiles.length === 0) return;

        setGalleryForm((prev) => ({
            ...prev,
            images: [...prev.images, ...validFiles],
        }));

        // Create preview URLs
        const newPreviews = validFiles.map((file) => ({
            url: URL.createObjectURL(file),
            isExisting: false,
            file: file
        }));
        setImagePreviews((prev) => [...prev, ...newPreviews]);
        
        // Clear images error if any
        if (errors.images) {
            setErrors(prev => ({ ...prev, images: null }));
        }
    };

    const removeImage = (index) => {
        // Revoke object URL to avoid memory leaks
        if (imagePreviews[index]?.url && !imagePreviews[index].isExisting) {
            URL.revokeObjectURL(imagePreviews[index].url);
        }
        
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setGalleryForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleClose = () => {
        // Clean up preview URLs
        imagePreviews.forEach(preview => {
            if (!preview.isExisting && preview.url) {
                URL.revokeObjectURL(preview.url);
            }
        });
        resetForm();
        setShowForm(false);
        setEditingGallery(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingGallery
                            ? "Edit Gallery Item"
                            : "Add New Gallery Item"}
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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {editingGallery ? "Add More Images" : "Images *"}
                        </label>
                        <input
                            type="file"
                            name="images[]"
                            onChange={handleImageChange}
                            accept="image/jpeg,image/png,image/webp,image/jpg"
                            multiple
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.images ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Allowed: JPG, JPEG, PNG, WEBP. Max size: 2MB per image
                        </p>
                        {errors.images && (
                            <p className="mt-1 text-sm text-red-600">
                                {Array.isArray(errors.images) ? errors.images[0] : errors.images}
                            </p>
                        )}
                    </div>

                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image Previews
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={preview.url}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-md border border-gray-200"
                                        />
                                        {!preview.isExisting && (
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition shadow-lg"
                                                title="Remove image"
                                            >
                                                <X size={14} />
                                            </button>
                                        )}
                                        {preview.isExisting && (
                                            <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                                Existing
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Checkboxes */}
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_featured"
                                id="is_featured"
                                checked={galleryForm.is_featured}
                                onChange={(e) => {
                                    setGalleryForm((prev) => ({
                                        ...prev,
                                        is_featured: e.target.checked,
                                    }));
                                }}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                                Featured Gallery
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_archived"
                                id="is_archived"
                                checked={galleryForm.is_archived}
                                onChange={(e) => {
                                    setGalleryForm((prev) => ({
                                        ...prev,
                                        is_archived: e.target.checked,
                                    }));
                                }}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_archived" className="ml-2 block text-sm text-gray-700">
                                Archive Gallery
                            </label>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white pb-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                editingGallery ? "Update Gallery" : "Create Gallery"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGalleryForm;