import React, { useState, useEffect } from "react";
import { X, Star, Archive, Upload, Image } from "lucide-react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Import Ace Editor components
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const EditActivityForm = ({ 
    editingActivity, 
    setShowForm, 
    setEditingActivity, 
    setReloadTrigger 
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagesPreviews, setImagesPreviews] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [jsonError, setJsonError] = useState("");
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
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

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
    }, []);

    // File size limits in bytes
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

    // Validate JSON
    const validateJSON = (jsonString) => {
        if (!jsonString || jsonString.trim() === "") {
            setJsonError("");
            return true;
        }
        
        try {
            JSON.parse(jsonString);
            setJsonError("");
            return true;
        } catch (e) {
            setJsonError("Invalid JSON format");
            return false;
        }
    };

    // Handle Ace Editor change
    const handleMetaDataChange = (value) => {
        setActivityForm(prev => ({
            ...prev,
            meta_data: value
        }));
        validateJSON(value);
    };

    // Use Effect for editing - populate form with existing data
    useEffect(() => {
        if (editingActivity) {
            setActivityForm({
                name: editingActivity.name || "",
                short_description: editingActivity.short_description || "",
                long_description: editingActivity.long_description || "",
                base_price: editingActivity.base_price || "",
                images: [],
                meta_data: editingActivity.meta_data
                    ? typeof editingActivity.meta_data === "object"
                        ? JSON.stringify(editingActivity.meta_data, null, 2)
                        : editingActivity.meta_data
                    : "",
                is_featured: editingActivity.is_featured || false,
                is_archived: editingActivity.is_archived || false,
            });
            
            // Validate existing meta_data
            if (editingActivity.meta_data) {
                const metaStr = typeof editingActivity.meta_data === "object"
                    ? JSON.stringify(editingActivity.meta_data)
                    : editingActivity.meta_data;
                validateJSON(metaStr);
            }
            
            // Reset image previews
            setImagesPreviews([]);
            setImageFiles([]);
        }
        setErrors({});
    }, [editingActivity]);

    // Handle Close
    const handleClose = () => {
        setShowForm(false);
        setEditingActivity(null);
        setErrors({});
        setImagesPreviews([]);
        setImageFiles([]);
        setJsonError("");
    };

    // Handle Submit for updating activity
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validate JSON before submission
        if (!validateJSON(activityForm.meta_data)) {
            return;
        }

        // Validate all images size before submission
        if (imageFiles.length > 0) {
            const oversizedImages = imageFiles.filter(
                (file) => file.size > MAX_IMAGE_SIZE,
            );
            if (oversizedImages.length > 0) {
                alert(
                    `${oversizedImages.length} image(s) exceed 2MB limit. Please remove them.`
                );
                return;
            }
        }

        const formData = new FormData();

        // Append basic fields
        formData.append("name", activityForm.name);
        formData.append("base_price", activityForm.base_price);

        // Append optional fields if they have values
        if (activityForm.short_description) {
            formData.append(
                "short_description",
                activityForm.short_description,
            );
        }

        if (activityForm.long_description) {
            formData.append("long_description", activityForm.long_description);
        }

        // Handle meta_data - send as JSON string
        if (activityForm.meta_data && activityForm.meta_data.trim() !== "") {
            try {
                // Parse to validate, then stringify to ensure proper format
                const parsed = JSON.parse(activityForm.meta_data);
                formData.append("meta_data", JSON.stringify(parsed));
            } catch (e) {
                // If not valid JSON, create a simple JSON object
                const simpleMeta = { description: activityForm.meta_data };
                formData.append("meta_data", JSON.stringify(simpleMeta));
            }
        }

        // Handle boolean fields - send as 0/1 strings
        formData.append("is_featured", activityForm.is_featured ? "1" : "0");
        formData.append("is_archived", activityForm.is_archived ? "1" : "0");

        // Handle images
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach((image, index) => {
                formData.append(`images[${index}]`, image);
            });
        }

        try {
            setSubmitting(true);

            // For update - IMPORTANT: Use POST with _method field
            formData.append("_method", "PUT");

            const response = await axios.post(
                route("ouractivity.update", { id: editingActivity.id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            console.log("Update response:", response.data);

            setReloadTrigger((prev) => !prev);
            handleClose();
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                console.log("Validation errors:", error.response.data.errors);
            } else if (error.response?.status === 405) {
                console.error(
                    "Method not allowed. Check your route configuration.",
                );
                alert(
                    "Error: Method not allowed. Please check your route configuration.",
                );
            } else {
                console.log("Error saving data", error);
                alert(
                    `Error: ${error.response?.data?.message || error.message}`,
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Handle multiple images change
    const handleImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Filter only image files
            let imageFiles = files.filter((file) =>
                file.type.startsWith("image/"),
            );

            if (imageFiles.length !== files.length) {
                alert("Some files are not images and were ignored");
            }

            if (imageFiles.length > 0) {
                // Validate each file size - 2MB max
                const oversizedFiles = imageFiles.filter(
                    (file) => file.size > MAX_IMAGE_SIZE,
                );
                if (oversizedFiles.length > 0) {
                    alert(
                        `${oversizedFiles.length} image(s) exceed 2MB limit and were ignored`
                    );
                    imageFiles = imageFiles.filter(
                        (file) => file.size <= MAX_IMAGE_SIZE,
                    );
                }

                setImageFiles((prev) => [...prev, ...imageFiles]);

                // Update activityForm images
                setActivityForm((prev) => ({
                    ...prev,
                    images: [...prev.images, ...imageFiles],
                }));

                // Create previews for new files
                imageFiles.forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImagesPreviews((prev) => [...prev, reader.result]);
                    };
                    reader.readAsDataURL(file);
                });

                // Clear image errors when new files are selected
                setErrors((prev) => ({
                    ...prev,
                    "images.0": undefined,
                    "images.*": undefined,
                }));
            }
        }
    };

    // Remove image
    const removeImage = (index) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
        setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
        setActivityForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    // Handle change for other fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === "checkbox") {
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

    // Handle Quill change
    const handleQuillChange = (content) => {
        setActivityForm((prev) => ({
            ...prev,
            long_description: content,
        }));
    };

    // Toggle handlers for the switches
    const toggleFeatured = () => {
        setActivityForm((prev) => ({
            ...prev,
            is_featured: !prev.is_featured,
        }));
    };

    const toggleArchived = () => {
        setActivityForm((prev) => ({
            ...prev,
            is_archived: !prev.is_archived,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Edit Activity Item
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={activityForm.name}
                            onChange={handleChange}
                            required
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                errors.name
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="Enter activity name"
                            disabled={submitting}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.name[0]}
                            </p>
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
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                errors.short_description
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="Enter a brief description of the activity"
                            disabled={submitting}
                        />
                        {errors.short_description && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.short_description[0]}
                            </p>
                        )}
                    </div>

                    {/* Long Description with React Quill */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Long Description
                        </label>
                        <div className={`quill-wrapper ${errors.long_description ? "quill-error" : ""}`}>
                            <ReactQuill
                                theme="snow"
                                value={activityForm.long_description || ""}
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

                    {/* Base Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Base Price <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="base_price"
                            value={activityForm.base_price}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                errors.base_price
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            placeholder="Enter base price"
                            disabled={submitting}
                        />
                        {errors.base_price && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.base_price[0]}
                            </p>
                        )}
                    </div>

                    {/* Multiple Images */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <Image className="mr-2 text-gray-600" size={18} />
                            Images (Optional - add more images)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all duration-300 relative bg-gray-50">
                            {imagesPreviews.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        {imagesPreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-24 w-full object-cover rounded-lg shadow bg-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                    disabled={submitting}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            {imagesPreviews.length} new image(s) selected
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
                                        Click to upload additional images
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Hold Ctrl/Cmd to select multiple files | Max: 2MB per file
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="images"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                multiple
                                onChange={handleImagesChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={submitting}
                            />
                        </div>
                        
                        {(errors["images.0"] || errors["images.*"]) && (
                            <p className="text-sm text-red-600">
                                {errors["images.0"]?.[0] ||
                                    errors["images.*"]?.[0]}
                            </p>
                        )}

                        {/* Show existing images */}
                        {editingActivity &&
                            editingActivity.images &&
                            editingActivity.images.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-2">
                                        Current images (will be kept unless replaced):
                                    </p>
                                    <div className="flex gap-2 flex-wrap">
                                        {editingActivity.images.map(
                                            (img, idx) => (
                                                <div
                                                    key={idx}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={`${imgurl}/${img.path}`}
                                                        alt={img.alt_text}
                                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "https://via.placeholder.com/64?text=No+Image";
                                                        }}
                                                    />
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                    </div>

                    {/* Meta Data with Ace Editor */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Data (JSON)
                        </label>
                        <div className={`border rounded-lg overflow-hidden font-mono ${
                            jsonError ? 'border-red-500' : 'border-gray-300'
                        }`}>
                            <AceEditor
                                mode="json"
                                theme="github"
                                onChange={handleMetaDataChange}
                                value={activityForm.meta_data}
                                name="meta_data_editor"
                                editorProps={{ $blockScrolling: true }}
                                setOptions={{
                                    showLineNumbers: true,
                                    tabSize: 2,
                                    fontSize: 14,
                                    showGutter: true,
                                    highlightActiveLine: true,
                                    useWorker: false,
                                }}
                                width="100%"
                                height="200px"
                                className="rounded-lg"
                            />
                        </div>
                        {jsonError && (
                            <p className="mt-1 text-sm text-red-600">
                                {jsonError}
                            </p>
                        )}
                        {errors.meta_data && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.meta_data[0]}
                            </p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                            Enter valid JSON format. Example: {"{}"}
                        </p>
                    </div>

                    {/* Toggle Switches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Featured Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Star className="text-gray-600" size={20} />
                                <span className="text-sm font-medium text-gray-700">
                                    Featured Activity
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleFeatured}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    activityForm.is_featured
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                                disabled={submitting}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        activityForm.is_featured
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Archived Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Archive className="text-gray-600" size={20} />
                                <span className="text-sm font-medium text-gray-700">
                                    Archive Activity
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleArchived}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    activityForm.is_archived
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                                disabled={submitting}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        activityForm.is_archived
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
                        value={activityForm.is_featured ? "1" : "0"}
                    />
                    <input
                        type="hidden"
                        name="is_archived"
                        value={activityForm.is_archived ? "1" : "0"}
                    />

                    {/* Form Actions */}
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
                            disabled={submitting || jsonError !== ""}
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Updating...
                                </>
                            ) : (
                                "Update Activity"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditActivityForm;