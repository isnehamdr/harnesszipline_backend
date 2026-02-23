// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { X } from "lucide-react";

// const AddServiceForm = ({
//     editingService,
//     setShowForm,
//     setEditingService,
//     setReloadTrigger,
//     handleUpdate,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [serviceForm, setServiceForm] = useState({
//         name: "",
//         short_description: "",
//         long_description: "",
//         image: null,
//         is_featured: false,
//         meta_data: "",
//         is_archived: false,
//     });

//     // Use Effect for editing
//     useEffect(() => {
//         if (editingService) {
//             setServiceForm({
//                 name: editingService.name || "",
//                 short_description: editingService.short_description || "",
//                 long_description: editingService.long_description || "",
//                 image: null,
//                 is_featured: editingService.is_featured || false,
//                 meta_data: editingService.meta_data || "",
//                 is_archived: editingService.is_archived || false,
//             });
//         } else {
//             setServiceForm({
//                 name: "",
//                 short_description: "",
//                 long_description: "",
//                 image: null,
//                 is_featured: false,
//                 meta_data: "",
//                 is_archived: false,
//             });
//         }
//     }, [editingService]);

//     // Handle Create Service
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourservices.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating service", error);
//             throw error;
//         }
//     };

//     // Handle Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
        
//         // Append all form data
//         for (const key in serviceForm) {
//             if (serviceForm[key] !== null && serviceForm[key] !== "") {
//                 if (key === 'is_featured' || key === 'is_archived') {
//                     formData.append(key, serviceForm[key] ? '1' : '0');
//                 } else {
//                     formData.append(key, serviceForm[key]);
//                 }
//             }
//         }

//         try {
//             setSubmitting(true);

//             if (editingService) {
//                 // Editing existing service
//                 await handleUpdate(formData, editingService.id);
//             } else {
//                 // Creating new service
//                 await handleCreate(formData);
//             }

//             // Reset form
//             setServiceForm({
//                 name: "",
//                 short_description: "",
//                 long_description: "",
//                 image: null,
//                 is_featured: false,
//                 meta_data: "",
//                 is_archived: false,
//             });

//             setShowForm(false);
//             setEditingService(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle change for image and the others
//     const handleChange = (e) => {
//         const { name, value, type, files, checked } = e.target;
        
//         if (type === "file") {
//             setServiceForm((prev) => ({
//                 ...prev,
//                 [name]: files[0],
//             }));
//         } else if (type === "checkbox") {
//             setServiceForm((prev) => ({
//                 ...prev,
//                 [name]: checked,
//             }));
//         } else {
//             setServiceForm((prev) => ({
//                 ...prev,
//                 [name]: value,
//             }));
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-2xl font-bold">
//                         {editingService ? "Edit Service" : "Add New Service"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={() => {
//                             setShowForm(false);
//                             setEditingService(null);
//                         }}
//                         className="p-1 hover:bg-gray-100 rounded-full"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Name Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Service Name *
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={serviceForm.name}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     {/* Short Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Short Description
//                         </label>
//                         <textarea
//                             name="short_description"
//                             value={serviceForm.short_description}
//                             onChange={handleChange}
//                             rows="3"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     {/* Long Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Long Description
//                         </label>
//                         <textarea
//                             name="long_description"
//                             value={serviceForm.long_description}
//                             onChange={handleChange}
//                             rows="5"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     {/* Image Upload */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Service Image
//                         </label>
//                         {editingService && editingService.image && (
//                             <div className="mb-2">
//                                 <img 
//                                     src={`/storage/${editingService.image}`} 
//                                     alt="Current"
//                                     className="w-32 h-32 object-cover rounded"
//                                 />
//                                 <p className="text-xs text-gray-500 mt-1">Current Image</p>
//                             </div>
//                         )}
//                         <input
//                             type="file"
//                             name="image"
//                             onChange={handleChange}
//                             accept="image/jpeg,image/png,image/jpg,image/webp"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
//                     </div>

//                     {/* Meta Data */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Meta Data (JSON)
//                         </label>
//                         <textarea
//                             name="meta_data"
//                             value={serviceForm.meta_data}
//                             onChange={handleChange}
//                             rows="3"
//                             placeholder='{"key": "value"}'
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     {/* Checkboxes */}
//                     <div className="flex gap-6">
//                         <label className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name="is_featured"
//                                 checked={serviceForm.is_featured}
//                                 onChange={handleChange}
//                                 className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                             />
//                             <span className="ml-2 text-sm text-gray-700">Featured</span>
//                         </label>

//                         <label className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name="is_archived"
//                                 checked={serviceForm.is_archived}
//                                 onChange={handleChange}
//                                 className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
//                             />
//                             <span className="ml-2 text-sm text-gray-700">Archived</span>
//                         </label>
//                     </div>

//                     {/* Submit Button */}
//                     <div className="flex gap-3 pt-4">
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed"
//                         >
//                             {submitting ? "Saving..." : (editingService ? "Update Service" : "Create Service")}
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setShowForm(false);
//                                 setEditingService(null);
//                             }}
//                             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddServiceForm;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Upload, Image } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddServiceForm = ({
    editingService,
    setShowForm,
    setEditingService,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [serviceForm, setServiceForm] = useState({
        name: "",
        short_description: "",
        long_description: "",
        image: null,
        is_featured: false,
        meta_data: "",
        is_archived: false,
    });

    // File size limits
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

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

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
            setImagePreview(null);
            setImageFile(null);
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
            setImagePreview(null);
            setImageFile(null);
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
        
        if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
            alert(`Image exceeds 2MB limit. Current size: ${formatFileSize(imageFile.size)}`);
            return;
        }

        const formData = new FormData();
        
        formData.append("name", serviceForm.name);
        
        if (serviceForm.short_description) {
            formData.append("short_description", serviceForm.short_description);
        }
        
        if (serviceForm.long_description) {
            formData.append("long_description", serviceForm.long_description);
        }
        
        if (imageFile) {
            formData.append("image", imageFile);
        }
        
        if (serviceForm.meta_data) {
            try {
                JSON.parse(serviceForm.meta_data);
                formData.append("meta_data", serviceForm.meta_data);
            } catch (e) {
                const simpleMeta = { description: serviceForm.meta_data };
                formData.append("meta_data", JSON.stringify(simpleMeta));
            }
        }
        
        formData.append("is_featured", serviceForm.is_featured ? "1" : "0");
        formData.append("is_archived", serviceForm.is_archived ? "1" : "0");

        try {
            setSubmitting(true);

            if (editingService) {
                formData.append("_method", "PUT");
                await handleUpdate(formData, editingService.id);
            } else {
                await handleCreate(formData);
            }

            setServiceForm({
                name: "",
                short_description: "",
                long_description: "",
                image: null,
                is_featured: false,
                meta_data: "",
                is_archived: false,
            });
            setImagePreview(null);
            setImageFile(null);

            setShowForm(false);
            setEditingService(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for image
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file");
                return;
            }

            if (file.size > MAX_IMAGE_SIZE) {
                alert(`Image exceeds 2MB limit. Current size: ${formatFileSize(file.size)}`);
                return;
            }

            setImageFile(file);
            setServiceForm((prev) => ({
                ...prev,
                image: file,
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle change for other fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === "checkbox") {
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

    // Handle Quill change
    const handleQuillChange = (content) => {
        setServiceForm((prev) => ({
            ...prev,
            long_description: content,
        }));
    };

    // Toggle handlers
    const toggleFeatured = () => {
        setServiceForm((prev) => ({
            ...prev,
            is_featured: !prev.is_featured,
        }));
    };

    const toggleArchived = () => {
        setServiceForm((prev) => ({
            ...prev,
            is_archived: !prev.is_archived,
        }));
    };

    // Remove image
    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setServiceForm((prev) => ({
            ...prev,
            image: null,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingService ? "Edit Service" : "Add New Service"}
                    </h2>
                    <button
                        onClick={() => {
                            setShowForm(false);
                            setEditingService(null);
                            setImagePreview(null);
                            setImageFile(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Service Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Service Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={serviceForm.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter service name"
                            disabled={submitting}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            placeholder="Enter short description"
                            disabled={submitting}
                        />
                    </div>

                    {/* Long Description with React Quill */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Long Description
                        </label>
                        <div className="quill-wrapper border border-gray-300 rounded-lg overflow-hidden">
                            <ReactQuill
                                theme="snow"
                                value={serviceForm.long_description || ""}
                                onChange={handleQuillChange}
                                modules={quillModules}
                                formats={quillFormats}
                                className="bg-white"
                                style={{ height: "200px", marginBottom: "40px" }}
                                readOnly={submitting}
                            />
                        </div>
                        <style jsx>{`
                            .quill-wrapper :global(.ql-container) {
                                border: none;
                                min-height: 150px;
                                font-size: 0.875rem;
                            }
                            .quill-wrapper :global(.ql-toolbar) {
                                border: none;
                                border-bottom: 1px solid #e5e7eb;
                                background-color: #f9fafb;
                            }
                            .quill-wrapper :global(.ql-container.ql-snow) {
                                border: none;
                            }
                        `}</style>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <Image className="mr-2 text-gray-600" size={18} />
                            Service Image
                        </label>
                        
                        {editingService && editingService.image && !imagePreview && (
                            <div className="mb-2">
                                <p className="text-sm text-gray-500 mb-1">Current image:</p>
                                <img 
                                    src={`/storage/${editingService.image}`} 
                                    alt="Current"
                                    className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200"
                                />
                            </div>
                        )}

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors relative bg-gray-50">
                            {imagePreview ? (
                                <div className="space-y-2">
                                    <div className="relative group inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-32 w-auto max-w-full object-cover rounded-lg shadow mx-auto"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                        {imageFile?.name} ({formatFileSize(imageFile?.size)})
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                                    <p className="text-sm text-gray-600">
                                        Click to upload service image
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Max: 2MB (JPEG, PNG, JPG, WEBP)
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="image"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={submitting}
                            />
                        </div>
                        {editingService && (
                            <p className="text-xs text-gray-500">Leave empty to keep current image</p>
                        )}
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
                            rows="2"
                            placeholder='{"key": "value"}'
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm resize-none"
                            disabled={submitting}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Enter valid JSON or leave empty
                        </p>
                    </div>

                    {/* Toggle Switches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">
                                Featured Service
                            </span>
                            <button
                                type="button"
                                onClick={toggleFeatured}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    serviceForm.is_featured
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                                disabled={submitting}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        serviceForm.is_featured
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">
                                Archive Service
                            </span>
                            <button
                                type="button"
                                onClick={toggleArchived}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    serviceForm.is_archived
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                                disabled={submitting}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        serviceForm.is_archived
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
                        value={serviceForm.is_featured ? "1" : "0"}
                    />
                    <input
                        type="hidden"
                        name="is_archived"
                        value={serviceForm.is_archived ? "1" : "0"}
                    />

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingService(null);
                                setImagePreview(null);
                                setImageFile(null);
                            }}
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
                                    {editingService ? "Updating..." : "Saving..."}
                                </>
                            ) : (
                                editingService ? "Update Service" : "Add Service"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddServiceForm;