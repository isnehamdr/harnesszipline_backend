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
import { X, Upload, Image, Star, Archive, Code } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Import Ace Editor components
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const AddServiceForm = ({
    editingService,
    setShowForm,
    setEditingService,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [metaDataValid, setMetaDataValid] = useState(true);
    const [metaDataError, setMetaDataError] = useState("");
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

    // Validate JSON
    const validateJSON = (jsonString) => {
        if (!jsonString || jsonString.trim() === "") {
            setMetaDataValid(true);
            setMetaDataError("");
            return true;
        }
        
        try {
            JSON.parse(jsonString);
            setMetaDataValid(true);
            setMetaDataError("");
            return true;
        } catch (e) {
            setMetaDataValid(false);
            setMetaDataError(e.message);
            return false;
        }
    };

    // Handle Ace Editor change
    const handleMetaDataChange = (value) => {
        setServiceForm(prev => ({
            ...prev,
            meta_data: value
        }));
        validateJSON(value);
        
        if (validationErrors.meta_data) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.meta_data;
                return newErrors;
            });
        }
    };

    // Clear meta data
    const clearMetaData = () => {
        setServiceForm(prev => ({
            ...prev,
            meta_data: ""
        }));
        setMetaDataValid(true);
        setMetaDataError("");
    };

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
            const metaDataValue = editingService.meta_data 
                ? (typeof editingService.meta_data === 'object' 
                    ? JSON.stringify(editingService.meta_data, null, 2)
                    : editingService.meta_data)
                : "";
                
            setServiceForm({
                name: editingService.name || "",
                short_description: editingService.short_description || "",
                long_description: editingService.long_description || "",
                image: null,
                is_featured: editingService.is_featured || false,
                meta_data: metaDataValue,
                is_archived: editingService.is_archived || false,
            });
            
            // Validate existing meta_data
            if (editingService.meta_data) {
                const metaStr = typeof editingService.meta_data === 'object'
                    ? JSON.stringify(editingService.meta_data)
                    : editingService.meta_data;
                validateJSON(metaStr);
            }
            
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
            setMetaDataValid(true);
            setMetaDataError("");
        }
        setValidationErrors({});
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
            if (error.response && error.response.status === 422) {
                setValidationErrors(error.response.data.errors || {});
            }
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});

        // Validate JSON before submission
        if (serviceForm.meta_data && serviceForm.meta_data.trim() !== "") {
            if (!validateJSON(serviceForm.meta_data)) {
                alert("Please fix the JSON format in Meta Data field");
                return;
            }
        }
        
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
        
        // Handle meta_data - send as JSON string
        if (serviceForm.meta_data && serviceForm.meta_data.trim() !== "") {
            try {
                // Parse to validate, then stringify to ensure proper format
                const parsed = JSON.parse(serviceForm.meta_data);
                formData.append("meta_data", JSON.stringify(parsed));
            } catch (e) {
                // If not valid JSON, create a simple JSON object
                const simpleMeta = { description: serviceForm.meta_data };
                formData.append("meta_data", JSON.stringify(simpleMeta));
            }
        } else {
            formData.append("meta_data", JSON.stringify(null));
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
        
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
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

                {/* Show validation summary if there are errors */}
                {Object.keys(validationErrors).length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm font-medium text-red-800">Please fix the following errors:</p>
                        <ul className="mt-1 text-xs text-red-600 list-disc list-inside">
                            {Object.entries(validationErrors).map(([field, errors]) => {
                                const errorMessage = errors && Array.isArray(errors) && errors.length > 0 
                                    ? errors[0] 
                                    : typeof errors === 'string' 
                                        ? errors 
                                        : 'Invalid value';
                                return <li key={field}>{errorMessage}</li>;
                            })}
                        </ul>
                    </div>
                )}

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
                            className={`w-full px-3 py-2 border ${
                                validationErrors.name ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            placeholder="Enter service name"
                            disabled={submitting}
                        />
                        {validationErrors.name && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.name[0]}</p>
                        )}
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
                            className={`w-full px-3 py-2 border ${
                                validationErrors.short_description ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none`}
                            placeholder="Enter short description"
                            disabled={submitting}
                        />
                        {validationErrors.short_description && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.short_description[0]}</p>
                        )}
                    </div>

                    {/* Long Description with React Quill */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Long Description
                        </label>
                        <div className={`quill-wrapper ${validationErrors.long_description ? "quill-error" : ""} border border-gray-300 rounded-lg overflow-hidden`}>
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
                        {validationErrors.long_description && (
                            <p className="mt-1 text-xs text-red-500">{validationErrors.long_description[0]}</p>
                        )}
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
                            .quill-error :global(.ql-container),
                            .quill-error :global(.ql-toolbar) {
                                border-color: #ef4444;
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

                    {/* Enhanced Meta Data with Ace Editor */}
                    <div className="space-y-3">
                        {/* Header with improved design */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="p-1.5 bg-indigo-50 rounded-lg">
                                    <Code className="text-indigo-600" size={18} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Meta Data (JSON)
                                    </label>
                                    <p className="text-xs text-gray-500">
                                        Additional data for SEO, settings, etc.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Editor Controls - Only Clear button */}
                            <div className="flex items-center space-x-2">
                                {/* Clear Button */}
                                {serviceForm.meta_data && (
                                    <button
                                        type="button"
                                        onClick={clearMetaData}
                                        className="text-xs bg-red-50 text-red-600 px-2 py-1.5 rounded-md hover:bg-red-100 transition-colors"
                                        disabled={submitting}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Ace Editor */}
                        <div className={`border rounded-lg overflow-hidden transition-all ${
                            !metaDataValid 
                                ? 'border-red-500 shadow-sm shadow-red-100' 
                                : serviceForm.meta_data 
                                    ? 'border-green-500 shadow-sm shadow-green-100' 
                                    : 'border-gray-300 hover:border-indigo-300'
                        }`}>
                            <AceEditor
                                mode="json"
                                theme="github"
                                onChange={handleMetaDataChange}
                                value={serviceForm.meta_data}
                                name="meta_data_editor"
                                editorProps={{ $blockScrolling: true }}
                                setOptions={{
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                    showLineNumbers: true,
                                    showGutter: true,
                                    highlightActiveLine: true,
                                    tabSize: 2,
                                    useWorker: false,
                                }}
                                fontSize={14}
                                width="100%"
                                height="220px"
                                readOnly={submitting}
                                className="rounded-lg"
                            />
                        </div>
                        
                        {/* Status Bar */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                            <div className="flex items-center space-x-3">
                                {/* Validation Status */}
                                {serviceForm.meta_data && serviceForm.meta_data.trim() !== "" ? (
                                    <>
                                        {metaDataValid ? (
                                            <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs font-medium">Valid JSON</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs font-medium">Invalid JSON</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                        <span className="text-xs font-medium">Empty</span>
                                    </div>
                                )}
                                
                                {/* Character/Line Count */}
                                {serviceForm.meta_data && (
                                    <span className="text-xs text-gray-500">
                                        {serviceForm.meta_data.split('\n').length} lines • {serviceForm.meta_data.length} chars
                                    </span>
                                )}
                            </div>
                            
                            {/* Error Message */}
                            {!metaDataValid && metaDataError && (
                                <span className="text-xs text-red-600 truncate max-w-xs" title={metaDataError}>
                                    Error: {metaDataError}
                                </span>
                            )}
                        </div>
                        
                        {validationErrors.meta_data && (
                            <p className="text-xs text-red-500 mt-1">{validationErrors.meta_data[0]}</p>
                        )}
                    </div>

                    {/* Toggle Switches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Star className="text-gray-600" size={18} />
                                <span className="text-sm font-medium text-gray-700">
                                    Featured Service
                                </span>
                            </div>
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
                            <div className="flex items-center space-x-3">
                                <Archive className="text-gray-600" size={18} />
                                <span className="text-sm font-medium text-gray-700">
                                    Archive Service
                                </span>
                            </div>
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
                            disabled={submitting || !metaDataValid}
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