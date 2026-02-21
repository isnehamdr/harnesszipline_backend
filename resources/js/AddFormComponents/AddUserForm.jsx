import axios from "axios";
import { X, Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddUserForm = ({
    editingUser,
    setEditingUser,
    handleUpdate,
    setReloadTrigger,
    setShowForm
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        image: null,
        phone_number: "",
        password: "",
        password_confirmation: "",
        role: "",
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState("");

    // Use Effect
    useEffect(() => {
        if (editingUser) {
            setUserForm({
                name: editingUser.name || "",
                email: editingUser.email || "",
                image: null,
                phone_number: editingUser.phone_number || "",
                password: "", // Don't populate password for security
                password_confirmation: "", // Don't populate confirmation
                role: editingUser.role || "",
            });
            // Set image preview if exists
            if (editingUser.image) {
                setImagePreview(`/storage/${editingUser.image}`);
            }
        } else {
            setUserForm({
                name: "",
                email: "",
                image: null,
                phone_number: "",
                password: "",
                password_confirmation: "",
                role: "",
            });
            setImagePreview(null);
        }
        // Reset password visibility and errors when editing user changes
        setShowPassword(false);
        setShowConfirmPassword(false);
        setPasswordError("");
    }, [editingUser]);

    // Handle Create User
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourusers.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating user", error);
            throw error;
        }
    };

    // Validate passwords
    const validatePasswords = () => {
        if (userForm.password || userForm.password_confirmation) {
            if (userForm.password !== userForm.password_confirmation) {
                setPasswordError("Passwords do not match");
                return false;
            }
            if (userForm.password.length < 8) {
                setPasswordError("Password must be at least 8 characters long");
                return false;
            }
        } else if (!editingUser && !userForm.password) {
            setPasswordError("Password is required for new users");
            return false;
        }
        setPasswordError("");
        return true;
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!userForm.name || !userForm.email) {
            alert("Name and Email are required");
            return;
        }

        // Validate passwords
        if (!validatePasswords()) {
            return;
        }

        const formData = new FormData();
        
        // Append all form data
        Object.keys(userForm).forEach(key => {
            if (userForm[key] !== null && userForm[key] !== "") {
                formData.append(key, userForm[key]);
            }
        });

        // Remove password_confirmation from form data as it might not be needed in backend
        formData.delete('password_confirmation');

        try {
            setSubmitting(true);

            if (editingUser) {
                // Editing existing user
                await handleUpdate(formData, editingUser.id);
            } else {
                // Creating new user
                await handleCreate(formData);
            }

            // Reset form
            setUserForm({
                name: "",
                email: "",
                image: null,
                phone_number: "",
                password: "",
                password_confirmation: "",
                role: "",
            });
            setImagePreview(null);
            setShowForm(false);
            setEditingUser(null);
            setShowPassword(false);
            setShowConfirmPassword(false);
        } catch (error) {
            console.log("Error saving data", error);
            alert("Error saving user. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for image and other fields
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        if (type === "file") {
            const file = files[0];
            setUserForm((prev) => ({
                ...prev,
                [name]: file,
            }));
            
            // Create preview URL
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setUserForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
        
        // Clear password error when user types in password fields
        if (name === "password" || name === "password_confirmation") {
            setPasswordError("");
        }
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingUser(null);
        setImagePreview(null);
        setShowPassword(false);
        setShowConfirmPassword(false);
        setPasswordError("");
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingUser ? "Edit User" : "Add New User"}
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
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Profile Image
                        </label>
                        <div className="flex items-center space-x-4">
                            {imagePreview && (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-16 w-16 rounded-full object-cover"
                                />
                            )}
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={userForm.name}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={userForm.email}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phone_number"
                            value={userForm.phone_number}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Password with Eye Button */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password {!editingUser && '*'}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={userForm.password}
                                onChange={handleChange}
                                required={!editingUser}
                                placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password with Eye Button */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm Password {!editingUser && '*'}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={userForm.password_confirmation}
                                onChange={handleChange}
                                required={!editingUser}
                                placeholder="Confirm password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                        {/* Password Error Message */}
                        {passwordError && (
                            <p className="mt-1 text-sm text-red-600">
                                {passwordError}
                            </p>
                        )}
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Role
                        </label>
                        <select
                            name="role"
                            value={userForm.role}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="manager">Manager</option>
                        </select>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
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
                            {submitting ? "Saving..." : (editingUser ? "Update User" : "Create User")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserForm;