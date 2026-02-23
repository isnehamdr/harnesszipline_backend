// import { X } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AddBlogForm = ({ 
//     editingBlog, 
//     setShowForm, 
//     handleUpdate, 
//     setReloadTrigger 
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [blogForm, setBlogForm] = useState({
//         title: "",
//         short_description: "",
//         long_description: "",
//         image: null,
//         meta_data: "",
//         is_archived: false,
//     });

//     // Use Effect for editing
//     useEffect(() => {
//         if (editingBlog) {
//             setBlogForm({
//                 title: editingBlog.title || "",
//                 short_description: editingBlog.short_description || "",
//                 long_description: editingBlog.long_description || "",
//                 image: null, // Don't set the image here as it's a file input
//                 meta_data: typeof editingBlog.meta_data === 'object' 
//                     ? JSON.stringify(editingBlog.meta_data) 
//                     : editingBlog.meta_data || "",
//                 is_archived: editingBlog.is_archived || false,
//             });
//         } else {
//             setBlogForm({
//                 title: "",
//                 short_description: "",
//                 long_description: "",
//                 image: null,
//                 meta_data: "",
//                 is_archived: false,
//             });
//         }
//         setErrors({});
//     }, [editingBlog]);

//     // Handle Close
//     const handleClose = () => {
//         setShowForm(false);
//         setBlogForm({
//             title: "",
//             short_description: "",
//             long_description: "",
//             image: null,
//             meta_data: "",
//             is_archived: false,
//         });
//         setErrors({});
//     };

//     // Handle Create Blog
//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(route("ourblog.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error creating blog", error);
//             if (error.response) {
//                 if (error.response.status === 422) {
//                     // Validation errors
//                     setErrors(error.response.data.errors || {});
//                 }
//                 throw error;
//             }
//         }
//     };

//     // Handle Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
        
//         // Append all form data
//         Object.keys(blogForm).forEach(key => {
//             if (blogForm[key] !== null && blogForm[key] !== "") {
//                 formData.append(key, blogForm[key]);
//             }
//         });

//         // Ensure is_archived is sent as boolean
//         formData.set('is_archived', blogForm.is_archived ? '1' : '0');
        
//         try {
//             setSubmitting(true);
//             setErrors({});

//             if (editingBlog) {
//                 // Editing existing blog
//                 await handleUpdate(formData, editingBlog.id);
//             } else {
//                 // Creating new blog
//                 await handleCreate(formData);
//             }
            
//             handleClose();
//         } catch (error) {
//             console.log("Error saving data", error);
//             if (error.response?.data?.message) {
//                 alert(error.response.data.message);
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle change for image and the others
//     const handleChange = (e) => {
//         const { name, value, type, files, checked } = e.target;
//         setBlogForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] 
//                     : type === "checkbox" ? checked 
//                     : value,
//         }));
//         // Clear error for this field when user starts typing
//         if (errors[name]) {
//             setErrors(prev => ({ ...prev, [name]: null }));
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
//                     <h2 className="text-2xl font-bold">
//                         {editingBlog ? "Edit Blog Item" : "Add New Blog Item"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Title */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Title *
//                         </label>
//                         <input
//                             type="text"
//                             name="title"
//                             value={blogForm.title}
//                             onChange={handleChange}
//                             required
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                                 errors.title ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         />
//                         {errors.title && (
//                             <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
//                         )}
//                     </div>

//                     {/* Short Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Short Description *
//                         </label>
//                         <textarea
//                             name="short_description"
//                             value={blogForm.short_description}
//                             onChange={handleChange}
//                             required
//                             rows="3"
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                                 errors.short_description ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         />
//                         {errors.short_description && (
//                             <p className="mt-1 text-sm text-red-600">{errors.short_description[0]}</p>
//                         )}
//                     </div>

//                     {/* Long Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Long Description *
//                         </label>
//                         <textarea
//                             name="long_description"
//                             value={blogForm.long_description}
//                             onChange={handleChange}
//                             required
//                             rows="6"
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                                 errors.long_description ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         />
//                         {errors.long_description && (
//                             <p className="mt-1 text-sm text-red-600">{errors.long_description[0]}</p>
//                         )}
//                     </div>

//                     {/* Image Upload */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Image {!editingBlog && '*'}
//                         </label>
//                         <input
//                             type="file"
//                             name="image"
//                             onChange={handleChange}
//                             accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                                 errors.image ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         />
//                         {errors.image && (
//                             <p className="mt-1 text-sm text-red-600">{errors.image[0]}</p>
//                         )}
//                         {editingBlog && editingBlog.image && (
//                             <div className="mt-2">
//                                 <p className="text-sm text-gray-500">Current Image:</p>
//                                 <img 
//                                     src={`/storage/${editingBlog.image}`} 
//                                     alt="Current" 
//                                     className="w-20 h-20 object-cover rounded mt-1"
//                                 />
//                             </div>
//                         )}
//                         {editingBlog && (
//                             <p className="text-sm text-gray-500 mt-1">
//                                 Leave empty to keep current image
//                             </p>
//                         )}
//                     </div>

//                     {/* Meta Data */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Meta Data (JSON format)
//                         </label>
//                         <input
//                             type="text"
//                             name="meta_data"
//                             value={blogForm.meta_data}
//                             onChange={handleChange}
//                             placeholder='{"key": "value"}'
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                                 errors.meta_data ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         />
//                         {errors.meta_data && (
//                             <p className="mt-1 text-sm text-red-600">{errors.meta_data[0]}</p>
//                         )}
//                     </div>

//                     {/* Is Archived */}
//                     <div className="flex items-center">
//                         <input
//                             type="checkbox"
//                             name="is_archived"
//                             checked={blogForm.is_archived}
//                             onChange={handleChange}
//                             className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                         />
//                         <label className="ml-2 block text-sm text-gray-700">
//                             Is Archived
//                         </label>
//                     </div>

//                     {/* Submit Buttons */}
//                     <div className="flex justify-end gap-3 pt-4 border-t">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
//                         >
//                             {submitting ? "Saving..." : (editingBlog ? "Update" : "Create")}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddBlogForm;

import { X, Archive, Upload, Image as ImageIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddBlogForm = ({ 
    editingBlog, 
    setShowForm, 
    handleUpdate, 
    setReloadTrigger 
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [blogForm, setBlogForm] = useState({
        title: "",
        short_description: "",
        long_description: "",
        image: null,
        meta_data: "",
        is_archived: false,
    });

    // Add useEffect to lock body scroll when form mounts
    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
        };
    }, []); // Empty dependency array means this runs once on mount

    // File size limits in bytes - 2MB max
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

    // Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "indent",
        "align",
        "link",
        "image",
    ];

    // Use Effect for editing
    useEffect(() => {
        if (editingBlog) {
            setBlogForm({
                title: editingBlog.title || "",
                short_description: editingBlog.short_description || "",
                long_description: editingBlog.long_description || "",
                image: null,
                meta_data: typeof editingBlog.meta_data === 'object' 
                    ? JSON.stringify(editingBlog.meta_data, null, 2) 
                    : editingBlog.meta_data || "",
                is_archived: editingBlog.is_archived || false,
            });
            
            // Reset image preview
            setImagePreview(null);
            setImageFile(null);
        } else {
            setBlogForm({
                title: "",
                short_description: "",
                long_description: "",
                image: null,
                meta_data: "",
                is_archived: false,
            });
            setImagePreview(null);
            setImageFile(null);
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
        setImagePreview(null);
        setImageFile(null);
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
        setErrors({});

        // Validate image size if a new image is selected
        if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
            alert("Image exceeds 2MB limit. Please choose a smaller image.");
            return;
        }

        const formData = new FormData();
        
        // Append all form data
        Object.keys(blogForm).forEach(key => {
            if (key === 'image') {
                if (imageFile) {
                    formData.append(key, imageFile);
                }
            } else if (blogForm[key] !== null && blogForm[key] !== "") {
                formData.append(key, blogForm[key]);
            }
        });

        // Ensure is_archived is sent as boolean
        formData.set('is_archived', blogForm.is_archived ? '1' : '0');
        
        // If editing, add _method field for PUT
        if (editingBlog) {
            formData.append("_method", "PUT");
        }
        
        try {
            setSubmitting(true);

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

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if it's an image
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file");
                return;
            }

            // Check file size - 2MB max
            if (file.size > MAX_IMAGE_SIZE) {
                alert("Image exceeds 2MB limit. Please choose a smaller image.");
                return;
            }

            setImageFile(file);
            setBlogForm(prev => ({
                ...prev,
                image: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear image errors
            setErrors(prev => ({ ...prev, image: null }));
        }
    };

    // Remove image
    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setBlogForm(prev => ({
            ...prev,
            image: null
        }));
    };

    // Handle change for other fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBlogForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    // Handle Quill change
    const handleQuillChange = (content) => {
        setBlogForm((prev) => ({
            ...prev,
            long_description: content,
        }));
    };

    // Toggle archived
    const toggleArchived = () => {
        setBlogForm((prev) => ({
            ...prev,
            is_archived: !prev.is_archived,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Header - Matching AddCustomerForm */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingBlog ? "Edit Blog Item" : "Add New Blog Item"}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form - Matching AddCustomerForm layout */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={blogForm.title}
                            onChange={handleChange}
                            required
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                errors.title ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter blog title"
                            disabled={submitting}
                        />
                        {errors.title && (
                            <p className="mt-1 text-sm text-red-600">{errors.title[0]}</p>
                        )}
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="short_description"
                            value={blogForm.short_description}
                            onChange={handleChange}
                            required
                            rows="3"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                errors.short_description ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter a brief description of the blog"
                            disabled={submitting}
                        />
                        {errors.short_description && (
                            <p className="mt-1 text-sm text-red-600">{errors.short_description[0]}</p>
                        )}
                    </div>

                    {/* Long Description with React Quill */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Long Description <span className="text-red-500">*</span>
                        </label>
                        <div className={`quill-wrapper ${errors.long_description ? "quill-error" : ""}`}>
                            <ReactQuill
                                theme="snow"
                                value={blogForm.long_description || ""}
                                onChange={handleQuillChange}
                                modules={quillModules}
                                formats={quillFormats}
                                className="bg-white"
                                style={{ height: "200px", marginBottom: "40px" }}
                                readOnly={submitting}
                            />
                        </div>
                        {errors.long_description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.long_description[0]}
                            </p>
                        )}
                        <style jsx>{`
                            .quill-wrapper :global(.ql-container) {
                                border-bottom-left-radius: 0.5rem;
                                border-bottom-right-radius: 0.5rem;
                                min-height: 150px;
                                font-size: 0.875rem;
                                border-color: #d1d5db;
                            }
                            .quill-wrapper :global(.ql-toolbar) {
                                border-top-left-radius: 0.5rem;
                                border-top-right-radius: 0.5rem;
                                background-color: #f9fafb;
                                border-color: #d1d5db;
                            }
                            .quill-wrapper :global(.ql-container:focus-within),
                            .quill-wrapper :global(.ql-toolbar:focus-within) {
                                border-color: #6366f1;
                                box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
                            }
                            .quill-error :global(.ql-container),
                            .quill-error :global(.ql-toolbar) {
                                border-color: #ef4444;
                            }
                        `}</style>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <ImageIcon className="mr-2 text-gray-600" size={18} />
                            Featured Image {!editingBlog && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all duration-300 relative bg-gray-50">
                            {imagePreview ? (
                                <div className="space-y-4">
                                    <div className="relative group inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-48 w-full object-cover rounded-lg shadow bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            disabled={submitting}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            1 image selected
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Click to change image
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-lg text-gray-700">
                                        Click to upload featured image
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Max: 2MB (JPEG, PNG, JPG, GIF, WEBP)
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="image"
                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={submitting}
                            />
                        </div>
                        
                        {errors.image && (
                            <p className="text-sm text-red-600">{errors.image[0]}</p>
                        )}

                        {editingBlog && editingBlog.image && !imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Current image:</p>
                                <img 
                                    src={`/storage/${editingBlog.image}`} 
                                    alt="Current" 
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/80?text=No+Image";
                                    }}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Upload a new image to replace
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Meta Data */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Data (JSON format)
                        </label>
                        <textarea
                            name="meta_data"
                            value={blogForm.meta_data}
                            onChange={handleChange}
                            rows="3"
                            placeholder='{"key": "value"}'
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm ${
                                errors.meta_data ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={submitting}
                        />
                        {errors.meta_data && (
                            <p className="mt-1 text-sm text-red-600">{errors.meta_data[0]}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Enter valid JSON or leave empty
                        </p>
                    </div>

                    {/* Toggle Switch for Archived */}
                    <div className="pt-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Archive className="text-gray-600" size={20} />
                                <span className="text-sm font-medium text-gray-700">
                                    Archive Blog
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleArchived}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    blogForm.is_archived
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                                disabled={submitting}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        blogForm.is_archived
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Hidden input to keep the value in form submission */}
                    <input
                        type="hidden"
                        name="is_archived"
                        value={blogForm.is_archived ? "1" : "0"}
                    />

                    {/* Form Actions - Matching AddCustomerForm */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    {editingBlog ? "Updating..." : "Saving..."}
                                </>
                            ) : (
                                editingBlog ? "Update Blog" : "Add Blog"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBlogForm;