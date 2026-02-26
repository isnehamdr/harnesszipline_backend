import axios from "axios";
import { X, Star, Archive, Upload, Image as ImageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Import Ace Editor components
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const EditRoomForm = ({
    editingRoom,
    setShowForm,
    handleUpdate,
    setReloadTrigger,
    setEditingRoom,
    reloadTrigger
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [allRoomTypes, setAllRoomTypes] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [jsonError, setJsonError] = useState("");
    const [roomForm, setRoomForm] = useState({
        name: "",
        order: "",
        no_of_room: 0,
        no_of_children: 0,
        no_of_adult: 0,
        price: "",
        refrence_id: "",
        short_description: "",
        long_description: "",
        meta_data: "",
        is_archived: false,
        is_featured: false,
        room_type_id: "",
        images: [],
        display_image_index: 0
    });
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

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
        setRoomForm(prev => ({
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

    // Load editing room data
    useEffect(() => {
        if (editingRoom) {
            const metaDataValue = editingRoom.meta_data 
                ? (typeof editingRoom.meta_data === 'object' 
                    ? JSON.stringify(editingRoom.meta_data, null, 2)
                    : editingRoom.meta_data)
                : "";
                
            setRoomForm({
                name: editingRoom.name || "",
                order: editingRoom.order || "",
                no_of_room: editingRoom.no_of_room || 0,
                no_of_children: editingRoom.no_of_children || 0,
                no_of_adult: editingRoom.no_of_adult || 0,
                price: editingRoom.price || "",
                refrence_id: editingRoom.refrence_id || "",
                short_description: editingRoom.short_description || "",
                long_description: editingRoom.long_description || "",
                meta_data: metaDataValue,
                is_archived: editingRoom.is_archived || false,
                is_featured: editingRoom.is_featured || false,
                room_type_id: editingRoom.room_type_id || "",
                images: [],
                display_image_index: editingRoom.display_image_index || 0
            });
            
            // Validate existing meta_data
            if (editingRoom.meta_data) {
                const metaStr = typeof editingRoom.meta_data === 'object'
                    ? JSON.stringify(editingRoom.meta_data)
                    : editingRoom.meta_data;
                validateJSON(metaStr);
            }
            
            // Load existing images into previews
            if (editingRoom.images && editingRoom.images.length > 0) {
                const existingPreviews = editingRoom.images.map(img => ({
                    url: `${imgurl}/${img.image}`,
                    isExisting: true,
                    id: img.id,
                    imagePath: img.image
                }));
                setImagePreviews(existingPreviews);
            } else {
                setImagePreviews([]);
            }
            
            setImageFiles([]); // Clear any selected files
        }
    }, [editingRoom]);

    // For fetching the room type data - ONLY NON-ARCHIVED
    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const response = await axios.get(route("ourroomtype.index"), {
                    params: {
                        is_archived: false
                    }
                });
                
                const responseData = response.data;
                let roomTypes = [];
                
                if (responseData.data && Array.isArray(responseData.data)) {
                    roomTypes = responseData.data;
                } else if (Array.isArray(responseData)) {
                    roomTypes = responseData;
                }
                
                const filteredRoomTypes = roomTypes.filter(type => !type.is_archived);
                setAllRoomTypes(filteredRoomTypes);
                setValidationErrors({}); // Clear errors when room types load
                
            } catch (error) {
                console.error("Error fetching room types:", error);
                setAllRoomTypes([]);
            }
        };

        fetchRoomTypes();
    }, [reloadTrigger]);

    // Handle Update Room
    const defaultHandleUpdate = async (formData, id) => {
        try {
            // For Laravel, use POST with _method=PUT
            formData.append('_method', 'PUT');
            await axios.post(route("ourroom.update", id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Validation errors
                setValidationErrors(error.response.data.errors || {});
                throw error;
            }
            console.log("Error updating room", error);
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({}); // Clear previous errors

        // Validate JSON before submission
        if (!validateJSON(roomForm.meta_data)) {
            return;
        }

        // Validate image sizes before submission
        if (imageFiles.length > 0) {
            const oversizedImages = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
            if (oversizedImages.length > 0) {
                alert(`${oversizedImages.length} image(s) exceed 2MB limit. Please remove them.`);
                return;
            }
        }
        
        const formData = new FormData();
        
        // Check if all required fields are filled
        const requiredFields = ['name', 'no_of_room', 'no_of_adult', 'no_of_children', 'price', 'room_type_id'];
        for (const field of requiredFields) {
            // Check if value is undefined, null, or empty string (but allow 0)
            if (roomForm[field] === undefined || roomForm[field] === null || roomForm[field] === '') {
                setValidationErrors(prev => ({
                    ...prev,
                    [field]: [`The ${field.replace(/_/g, ' ')} field is required.`]
                }));
                return;
            }
        }
        
        // Append all fields
        Object.keys(roomForm).forEach(key => {
            if (key === 'images') {
                // Handle multiple image uploads
                if (imageFiles.length > 0) {
                    imageFiles.forEach((file, index) => {
                        formData.append(`images[${index}]`, file);
                    });
                }
            } else if (key === 'meta_data') {
                // Handle meta_data - send as JSON string
                if (roomForm.meta_data && roomForm.meta_data.trim() !== "") {
                    try {
                        // Parse to validate, then stringify to ensure proper format
                        const parsed = JSON.parse(roomForm.meta_data);
                        formData.append("meta_data", JSON.stringify(parsed));
                    } catch (e) {
                        // If not valid JSON, create a simple JSON object
                        const simpleMeta = { description: roomForm.meta_data };
                        formData.append("meta_data", JSON.stringify(simpleMeta));
                    }
                } else {
                    formData.append("meta_data", JSON.stringify(null));
                }
            } else if (key !== 'images') {
                if (roomForm[key] !== null && roomForm[key] !== undefined) {
                    // Handle boolean fields - send as actual booleans (1/0 for Laravel)
                    if (key === 'is_archived' || key === 'is_featured') {
                        // Send as integer 1 or 0 which Laravel will interpret as boolean
                        formData.append(key, roomForm[key] ? '1' : '0');
                    }
                    // Handle number fields that might be empty strings
                    else if (['no_of_room', 'no_of_children', 'no_of_adult', 'price'].includes(key)) {
                        // If value is empty string, send '0', otherwise send the value
                        formData.append(key, roomForm[key] === '' ? '0' : String(roomForm[key]));
                    }
                    else {
                        formData.append(key, String(roomForm[key]));
                    }
                }
            }
        });

        // Add display_image_index if not set
        if (!formData.has('display_image_index')) {
            formData.append('display_image_index', '0');
        }

        try {
            setSubmitting(true);

            if (handleUpdate) {
                await handleUpdate(formData, editingRoom.id);
            } else {
                await defaultHandleUpdate(formData, editingRoom.id);
            }
            
            // Reset form and close
            setShowForm(false);
            setEditingRoom(null);
        } catch (error) {
            console.log("Error updating data", error);
            
            // Show user-friendly error message
            if (error.response && error.response.status === 422) {
                console.log("Validation errors:", error.response.data.errors);
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
            let imageFiles = files.filter(file => file.type.startsWith('image/'));
            
            if (imageFiles.length !== files.length) {
                alert("Some files are not images and were ignored");
            }
            
            if (imageFiles.length > 0) {
                // Validate each file size - 2MB max
                const oversizedFiles = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
                if (oversizedFiles.length > 0) {
                    alert(`${oversizedFiles.length} image(s) exceed 2MB limit and were ignored`);
                    imageFiles = imageFiles.filter(file => file.size <= MAX_IMAGE_SIZE);
                }
                
                setImageFiles(prev => [...prev, ...imageFiles]);
                
                // Create previews for new files
                imageFiles.forEach((file) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        setImagePreviews(prev => [...prev, {
                            url: reader.result,
                            file: file,
                            isExisting: false
                        }]);
                    };
                    reader.readAsDataURL(file);
                });
                
                // Clear image errors when new files are selected
                setValidationErrors(prev => ({
                    ...prev,
                    "images.0": undefined,
                    "images.*": undefined,
                    "images": undefined
                }));
            }
        }
    };

    // Remove image - handles both new and existing images
    const removeImage = (index) => {
        const previewToRemove = imagePreviews[index];
        
        if (previewToRemove.isExisting) {
            // This is an existing image from the database
            if (window.confirm('Remove this image? This action cannot be undone.')) {
                // TODO: Add API call to delete the image if needed
                setImagePreviews(prev => prev.filter((_, i) => i !== index));
            }
        } else {
            // This is a newly uploaded image
            setImageFiles(prev => prev.filter((_, i) => i !== index));
            setImagePreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    // Handle change for regular inputs - Allow clearing number fields
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Clear validation error for this field when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        
        if (type === "checkbox") {
            setRoomForm((prev) => ({
                ...prev,
                [name]: checked
            }));
        } else {
            // For number inputs, allow empty string temporarily
            if (['no_of_room', 'no_of_children', 'no_of_adult', 'price'].includes(name)) {
                // If value is empty string, set as empty string (temporarily)
                setRoomForm((prev) => ({
                    ...prev,
                    [name]: value
                }));
            } else {
                setRoomForm((prev) => ({
                    ...prev,
                    [name]: value
                }));
            }
        }
    };

    // Handle Quill change
    const handleQuillChange = (content) => {
        setRoomForm((prev) => ({
            ...prev,
            long_description: content
        }));
    };

    // Toggle handlers
    const toggleFeatured = () => {
        setRoomForm(prev => ({
            ...prev,
            is_featured: !prev.is_featured
        }));
    };

    const toggleArchived = () => {
        setRoomForm(prev => ({
            ...prev,
            is_archived: !prev.is_archived
        }));
    };

    // Helper function to get field error
    const getFieldError = (fieldName) => {
        const error = validationErrors[fieldName];
        if (error && Array.isArray(error) && error.length > 0) {
            return <p className="text-xs text-red-500 mt-1">{error[0]}</p>;
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Edit Room
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditingRoom(null);
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
                    {/* Basic Information - First Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Room Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={roomForm.name}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 border ${
                                    validationErrors.name ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="Enter room name"
                                required
                                disabled={submitting}
                            />
                            {getFieldError('name')}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Room Type<span className="text-red-500">*</span>
                            </label>
                            <select
                                name="room_type_id"
                                value={roomForm.room_type_id}
                                onChange={handleChange}
                                required
                                disabled={submitting || allRoomTypes.length === 0}
                                className={`w-full px-3 py-2 border ${
                                    validationErrors.room_type_id ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                            >
                                <option value="">Select Room Type</option>
                                {allRoomTypes.length > 0 ? (
                                    allRoomTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No room types available</option>
                                )}
                            </select>
                            {getFieldError('room_type_id')}
                            {allRoomTypes.length === 0 && (
                                <p className="text-xs text-amber-600 mt-1">
                                    No active room types found. Please create a room type first.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Second Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={roomForm.order}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter display order"
                                disabled={submitting}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Reference ID
                            </label>
                            <input
                                type="text"
                                name="refrence_id"
                                value={roomForm.refrence_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Enter reference ID"
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    {/* Capacity & Pricing - All in one row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rooms<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="no_of_room"
                                value={roomForm.no_of_room}
                                onChange={handleChange}
                                required
                                min="0"
                                step="1"
                                className={`w-full px-3 py-2 border ${
                                    validationErrors.no_of_room ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="No. of rooms"
                                disabled={submitting}
                            />
                            {getFieldError('no_of_room')}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adults<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="no_of_adult"
                                value={roomForm.no_of_adult}
                                onChange={handleChange}
                                required
                                min="0"
                                step="1"
                                className={`w-full px-3 py-2 border ${
                                    validationErrors.no_of_adult ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="Max adults"
                                disabled={submitting}
                            />
                            {getFieldError('no_of_adult')}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Children<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="no_of_children"
                                value={roomForm.no_of_children}
                                onChange={handleChange}
                                required
                                min="0"
                                step="1"
                                className={`w-full px-3 py-2 border ${
                                    validationErrors.no_of_children ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="Max children"
                                disabled={submitting}
                            />
                            {getFieldError('no_of_children')}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($)<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                name="price"
                                value={roomForm.price}
                                onChange={handleChange}
                                required
                                min="0"
                                className={`w-full px-3 py-2 border ${
                                    validationErrors.price ? 'border-red-500' : 'border-gray-300'
                                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                placeholder="Enter price"
                                disabled={submitting}
                            />
                            {getFieldError('price')}
                        </div>
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <textarea
                            name="short_description"
                            value={roomForm.short_description}
                            onChange={handleChange}
                            rows="2"
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
                        <div className={`quill-wrapper ${validationErrors.long_description ? "quill-error" : ""}`}>
                            <ReactQuill
                                theme="snow"
                                value={roomForm.long_description || ""}
                                onChange={handleQuillChange}
                                modules={quillModules}
                                formats={quillFormats}
                                className="bg-white"
                                style={{ height: "200px", marginBottom: "40px" }}
                                readOnly={submitting}
                            />
                        </div>
                        {getFieldError('long_description')}
                        <style jsx>{`
                            .quill-wrapper :global(.ql-container) {
                                border-bottom-left-radius: 0.5rem;
                                border-bottom-right-radius: 0.5rem;
                                min-height: 150px;
                                font-size: 0.875rem;
                                border-color: #e5e7eb;
                            }
                            .quill-wrapper :global(.ql-toolbar) {
                                border-top-left-radius: 0.5rem;
                                border-top-right-radius: 0.5rem;
                                background-color: #f9fafb;
                                border-color: #e5e7eb;
                            }
                            .quill-error :global(.ql-container),
                            .quill-error :global(.ql-toolbar) {
                                border-color: #ef4444;
                            }
                        `}</style>
                    </div>

                    {/* Images Section */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                            <ImageIcon className="mr-2 text-gray-600" size={18} />
                            Room Images
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all duration-300 relative bg-gray-50">
                            {imagePreviews.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-24 w-full object-cover rounded-lg shadow bg-white"
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/96?text=Error";
                                                    }}
                                                />
                                                {preview.isExisting && (
                                                    <span className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                                                        Existing
                                                    </span>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    disabled={submitting}
                                                >
                                                    <X size={14} />
                                                </button>
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
                                        Click to upload room images
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
                        
                        {(validationErrors.images || validationErrors["images.0"] || validationErrors["images.*"]) && (
                            <p className="text-sm text-red-600">
                                {validationErrors.images?.[0] || validationErrors["images.0"]?.[0] || validationErrors["images.*"]?.[0]}
                            </p>
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
                                value={roomForm.meta_data}
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
                        {getFieldError('meta_data')}
                        <p className="mt-1 text-xs text-gray-500">
                            Enter valid JSON format. Example: {"{}"}
                        </p>
                    </div>

                    {/* Toggle Switches for Featured and Archived */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Featured Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Star className="text-gray-600" size={18} />
                                <span className="text-sm font-medium text-gray-700">
                                    Featured Room
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleFeatured}
                                disabled={submitting}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    roomForm.is_featured
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        roomForm.is_featured
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Archived Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Archive className="text-gray-600" size={18} />
                                <span className="text-sm font-medium text-gray-700">
                                    Archive Room
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleArchived}
                                disabled={submitting}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    roomForm.is_archived
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        roomForm.is_archived
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Hidden inputs to keep the values in form submission */}
                    <input
                        type="hidden"
                        name="is_featured"
                        value={roomForm.is_featured ? "1" : "0"}
                    />
                    <input
                        type="hidden"
                        name="is_archived"
                        value={roomForm.is_archived ? "1" : "0"}
                    />

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingRoom(null);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || jsonError !== "" || allRoomTypes.length === 0}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Updating...
                                </>
                            ) : (
                                "Update Room"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRoomForm;