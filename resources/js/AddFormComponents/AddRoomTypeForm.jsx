import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddRoomTypeForm = ({
    editingRoomType,
    setShowForm,
    handleUpdate,
    setReloadTrigger,
    setEditingRoomType,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [roomTypeForm, setRoomTypeForm] = useState({
        name: "",
        is_archived: true, // Use boolean instead of string
    });

    // Use Effect - Load data when editing
    useEffect(() => {
        if (editingRoomType) {
            setRoomTypeForm({
                name: editingRoomType.name || "",
                is_archived:
                    editingRoomType.is_archived === 1 ||
                    editingRoomType.is_archived === true,
            });
        } else {
            setRoomTypeForm({
                name: "",
                is_archived: false, // Default to active (false)
            });
        }
    }, [editingRoomType]);

    // Handle Create Room Type
    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(
                route("ourroomtype.store"),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error creating room type", error);
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append form data
        formData.append("name", roomTypeForm.name);
        formData.append("is_archived", roomTypeForm.is_archived ? "1" : "0");

        try {
            setSubmitting(true);

            if (editingRoomType) {
                // Editing existing room type
                await handleUpdate(formData, editingRoomType.id);
            } else {
                // Creating new room type
                await handleCreate(formData);
            }

            // Reset form and close modal
            setRoomTypeForm({
                name: "",
                is_archived: false,
            });
            setShowForm(false);
            setEditingRoomType(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomTypeForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle toggle change
    const handleToggleChange = () => {
        setRoomTypeForm((prev) => ({
            ...prev,
            is_archived: !prev.is_archived,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingRoomType
                            ? "Edit Room Type"
                            : "Add New Room Type"}
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditingRoomType(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Room Type Name{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={roomTypeForm.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter room type name"
                        />
                    </div>

                    {/* Status Toggle Switch */}
                    {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={handleToggleChange}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    roomTypeForm.is_archived ? "bg-green-600" : "bg-red-600"
                                }`}
                                role="switch"
                                aria-checked={roomTypeForm.is_archived}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        roomTypeForm.is_archived ? "translate-x-1" : "translate-x-6"
                                    }`}
                                />
                            </button>
                            <span className="text-sm text-gray-700">
                                {roomTypeForm.is_archived ? "Active" : "Archived"}
                            </span>
                        </div>
                    </div> */}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                        </label>
                        <div className="flex items-center space-x-3">
                            <button
                                type="button"
                                onClick={handleToggleChange}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    roomTypeForm.is_archived
                                        ? "bg-gray-300"
                                        : "bg-green-600"
                                }`}
                                role="switch"
                                aria-checked={!roomTypeForm.is_archived}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        roomTypeForm.is_archived
                                            ? "translate-x-1"
                                            : "translate-x-6"
                                    }`}
                                />
                            </button>
                            <span className="text-sm text-gray-700">
                                {roomTypeForm.is_archived
                                    ? "Archived"
                                    : "Active"}
                            </span>
                        </div>
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingRoomType(null);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {submitting
                                ? "Saving..."
                                : editingRoomType
                                  ? "Update"
                                  : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoomTypeForm;
