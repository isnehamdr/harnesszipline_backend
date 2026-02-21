// AddRoomForm.jsx
import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddRoomForm = ({
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
    const [roomForm, setRoomForm] = useState({
        name: "",
        order: "",
        no_of_room: 0,           // Changed to 0
        no_of_children: 0,        // Changed to 0
        no_of_adult: 0,           // Changed to 0
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

    // Use Effect for editing
    useEffect(() => {
        if (editingRoom) {
            setRoomForm({
                name: editingRoom.name || "",
                order: editingRoom.order || "",
                no_of_room: editingRoom.no_of_room || 0,           // Default to 0 if not set
                no_of_children: editingRoom.no_of_children || 0,    // Default to 0 if not set
                no_of_adult: editingRoom.no_of_adult || 0,          // Default to 0 if not set
                price: editingRoom.price || "",
                refrence_id: editingRoom.refrence_id || "",
                short_description: editingRoom.short_description || "",
                long_description: editingRoom.long_description || "",
                meta_data: editingRoom.meta_data || "",
                is_archived: editingRoom.is_archived || false,
                is_featured: editingRoom.is_featured || false,
                room_type_id: editingRoom.room_type_id || "",
                images: [], // Reset images for new uploads
                display_image_index: editingRoom.display_image_index || 0
            });
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

    // Handle Create Room
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourroom.store"), formData, {
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
            console.log("Error creating room", error);
            throw error;
        }
    };

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
        
        const formData = new FormData();
        
        // Append all form data - ensure all required fields are sent
        const requiredFields = ['name', 'no_of_room', 'no_of_adult', 'no_of_children', 'price', 'room_type_id'];
        
        // Check if all required fields are filled (allow 0 as valid value)
        for (const field of requiredFields) {
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
                if (roomForm.images && roomForm.images.length > 0) {
                    const files = roomForm.images instanceof FileList 
                        ? Array.from(roomForm.images) 
                        : roomForm.images;
                    
                    files.forEach((file, index) => {
                        if (file instanceof File) {
                            formData.append(`images[${index}]`, file);
                        }
                    });
                }
            } else if (roomForm[key] !== null && roomForm[key] !== undefined) {
                // Handle empty strings for numeric fields
                if (roomForm[key] === '' && ['no_of_room', 'no_of_children', 'no_of_adult'].includes(key)) {
                    formData.append(key, '0');
                }
                // Convert boolean values to strings for FormData
                else if (typeof roomForm[key] === 'boolean') {
                    formData.append(key, roomForm[key] ? '1' : '0');
                }
                else {
                    formData.append(key, String(roomForm[key]));
                }
            }
        });

        // Add display_image_index if not set
        if (!formData.has('display_image_index')) {
            formData.append('display_image_index', '0');
        }

        try {
            setSubmitting(true);

            if (editingRoom) {
                if (handleUpdate) {
                    await handleUpdate(formData, editingRoom.id);
                } else {
                    await defaultHandleUpdate(formData, editingRoom.id);
                }
            } else {
                await handleCreate(formData);
            }
            
            // Reset form and close - with 0 as default for numeric fields
            setRoomForm({
                name: "",
                order: "",
                no_of_room: 0,           // Changed to 0
                no_of_children: 0,        // Changed to 0
                no_of_adult: 0,           // Changed to 0
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

            setShowForm(false);
            setEditingRoom(null);
        } catch (error) {
            console.log("Error saving data", error);
            
            // Show user-friendly error message
            if (error.response && error.response.status === 422) {
                // Validation errors are already set
                console.log("Validation errors:", error.response.data.errors);
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for inputs
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        
        // Clear validation error for this field when user starts typing
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
        
        if (type === "file") {
            setRoomForm((prev) => ({
                ...prev,
                [name]: files
            }));
        } else if (type === "checkbox") {
            setRoomForm((prev) => ({
                ...prev,
                [name]: checked
            }));
        } else {
            // For number inputs, convert empty string to 0
            if ((name === 'no_of_room' || name === 'no_of_children' || name === 'no_of_adult') && value === '') {
                setRoomForm((prev) => ({
                    ...prev,
                    [name]: 0
                }));
            } else {
                setRoomForm((prev) => ({
                    ...prev,
                    [name]: value
                }));
            }
        }
    };

    // Toggle switch component
    const ToggleSwitch = ({ name, checked, onChange, label }) => (
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <button
                type="button"
                onClick={() => {
                    onChange({
                        target: {
                            name,
                            type: 'checkbox',
                            checked: !checked
                        }
                    });
                }}
                className={`${
                    checked ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
            >
                <span
                    className={`${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
            </button>
        </div>
    );

    // Helper function to get field error
    const getFieldError = (fieldName) => {
        return validationErrors[fieldName] ? (
            <p className="text-xs text-red-500 mt-1">{validationErrors[fieldName][0]}</p>
        ) : null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingRoom ? "Edit Room" : "Add New Room"}
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditingRoom(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Show validation summary if there are errors */}
                {Object.keys(validationErrors).length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm font-medium text-red-800">Please fix the following errors:</p>
                        <ul className="mt-1 text-xs text-red-600 list-disc list-inside">
                            {Object.entries(validationErrors).map(([field, errors]) => (
                                <li key={field}>{errors[0]}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Room Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={roomForm.name}
                                onChange={handleChange}
                                required
                                className={`w-full px-3 py-2 border ${
                                    validationErrors.name ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {getFieldError('name')}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Room Type *
                            </label>
                            <select
                                name="room_type_id"
                                value={roomForm.room_type_id}
                                onChange={handleChange}
                                required
                                className={`w-full px-3 py-2 border ${
                                    validationErrors.room_type_id ? 'border-red-500' : 'border-gray-300'
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order
                            </label>
                            <input
                                type="number"
                                name="order"
                                value={roomForm.order}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Capacity & Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Number of Rooms *
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
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {getFieldError('no_of_room')}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Adults *
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
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {getFieldError('no_of_adult')}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Children *
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
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {getFieldError('no_of_children')}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price ($) *
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
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            />
                            {getFieldError('price')}
                        </div>
                    </div>

                    {/* Descriptions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <textarea
                            name="short_description"
                            value={roomForm.short_description}
                            onChange={handleChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Long Description
                        </label>
                        <textarea
                            name="long_description"
                            value={roomForm.long_description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Room Images
                        </label>
                        <input
                            type="file"
                            name="images"
                            onChange={handleChange}
                            multiple
                            accept="image/*"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            You can select multiple images. Max size: 2MB per image
                        </p>
                        {editingRoom && editingRoom.images && editingRoom.images.length > 0 && (
                            <p className="text-xs text-blue-500 mt-1">
                                Existing images: {editingRoom.images.length} image(s) available. 
                                Select new images to add more.
                            </p>
                        )}
                    </div>

                    {/* Toggle Switches */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <ToggleSwitch
                            name="is_featured"
                            checked={roomForm.is_featured}
                            onChange={handleChange}
                            label="Featured Room"
                        />
                        
                        <ToggleSwitch
                            name="is_archived"
                            checked={roomForm.is_archived}
                            onChange={handleChange}
                            label="Archived"
                        />
                    </div>

                    {/* Meta Data */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Data (JSON)
                        </label>
                        <textarea
                            name="meta_data"
                            value={roomForm.meta_data}
                            onChange={handleChange}
                            rows="3"
                            placeholder='{"key": "value"}'
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                        />
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingRoom(null);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || allRoomTypes.length === 0}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : (editingRoom ? "Update Room" : "Create Room")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoomForm;