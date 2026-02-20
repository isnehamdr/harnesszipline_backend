import { X } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from 'axios';

const AddTestimonialForm = ({ setShowForm, editingTestimonial, setEditingTestimonial, setReloadTrigger }) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [testimonialForm, setTestimonialForm] = useState({
        fullname: "",
        address: "",
        short_description: "",
        long_description: "",
        is_featured: false,
        is_archived: false,
    });

    // Use Effect for editing
    useEffect(() => {
        if (editingTestimonial) {
            setTestimonialForm({
                fullname: editingTestimonial.fullname || "",
                address: editingTestimonial.address || "",
                short_description: editingTestimonial.short_description || "",
                long_description: editingTestimonial.long_description || "",
                is_featured: Boolean(editingTestimonial.is_featured),
                is_archived: Boolean(editingTestimonial.is_archived),
            });
        } else {
            setTestimonialForm({
                fullname: "",
                address: "",
                short_description: "",
                long_description: "",
                is_featured: false,
                is_archived: false,
            });
        }
        setErrors({});
    }, [editingTestimonial]);

    // Handle Create Testimonial
    const handleCreate = async (formData) => {
        try {
            // Convert FormData to a plain object for debugging
            const formDataObj = {};
            for (let [key, value] of formData.entries()) {
                formDataObj[key] = value;
            }
            console.log('Submitting data:', formDataObj);

            const response = await axios.post(route("ourtestimonials.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            
            console.log('Response:', response.data);
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error creating testimonial", error);
            if (error.response && error.response.status === 422) {
                // Validation errors
                setErrors(error.response.data.errors || {});
                throw new Error('Validation failed');
            }
            throw error;
        }
    };

    // Handle Update Testimonial
    const handleUpdate = async (formData, id) => {
        try {
            // Convert FormData to a plain object for debugging
            const formDataObj = {};
            for (let [key, value] of formData.entries()) {
                formDataObj[key] = value;
            }
            console.log('Updating data:', formDataObj);

            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourtestimonials.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            
            console.log('Response:', response.data);
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating testimonial", error);
            if (error.response && error.response.status === 422) {
                // Validation errors
                setErrors(error.response.data.errors || {});
                throw new Error('Validation failed');
            }
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        const formData = new FormData();
        
        // Append all form data with proper formatting
        formData.append('fullname', testimonialForm.fullname.trim());
        
        if (testimonialForm.address) {
            formData.append('address', testimonialForm.address.trim());
        }
        
        if (testimonialForm.short_description) {
            formData.append('short_description', testimonialForm.short_description.trim());
        }
        
        if (testimonialForm.long_description) {
            formData.append('long_description', testimonialForm.long_description.trim());
        }
        
        // Convert boolean to string '1' or '0' for proper handling in PHP
        formData.append('is_featured', testimonialForm.is_featured ? '1' : '0');
        formData.append('is_archived', testimonialForm.is_archived ? '1' : '0');
        
        try {
            setSubmitting(true);

            if (editingTestimonial) {
                // Editing existing testimonial
                await handleUpdate(formData, editingTestimonial.id);
            } else {
                // Creating new testimonial
                await handleCreate(formData);
            }
            
            // Reset form and close modal
            setTestimonialForm({
                fullname: "",
                address: "",
                short_description: "",
                long_description: "",
                is_featured: false,
                is_archived: false,
            });

            setShowForm(false);
            setEditingTestimonial(null);
        } catch (error) {
            console.log("Error saving data", error);
            if (error.message !== 'Validation failed') {
                alert('An error occurred while saving. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setTestimonialForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
                    <h2 className="text-2xl font-bold">
                        {editingTestimonial
                            ? "Edit Testimonial"
                            : "Add New Testimonial"}
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditingTestimonial(null);
                            setErrors({});
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                {Object.keys(errors).length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                        <ul className="list-disc list-inside text-sm text-red-600">
                            {Object.entries(errors).map(([field, messages]) => (
                                <li key={field}>{Array.isArray(messages) ? messages[0] : messages}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="fullname"
                            value={testimonialForm.fullname}
                            onChange={handleChange}
                            required
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.fullname ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.fullname && (
                            <p className="mt-1 text-xs text-red-500">{errors.fullname[0]}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={testimonialForm.address}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.address ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.address && (
                            <p className="mt-1 text-xs text-red-500">{errors.address[0]}</p>
                        )}
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <textarea
                            name="short_description"
                            value={testimonialForm.short_description}
                            onChange={handleChange}
                            rows="2"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.short_description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.short_description && (
                            <p className="mt-1 text-xs text-red-500">{errors.short_description[0]}</p>
                        )}
                    </div>

                    {/* Long Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Long Description
                        </label>
                        <textarea
                            name="long_description"
                            value={testimonialForm.long_description}
                            onChange={handleChange}
                            rows="3"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                errors.long_description ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.long_description && (
                            <p className="mt-1 text-xs text-red-500">{errors.long_description[0]}</p>
                        )}
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-2">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_featured"
                                id="is_featured"
                                checked={testimonialForm.is_featured}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                                Featured Testimonial
                            </label>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                name="is_archived"
                                id="is_archived"
                                checked={testimonialForm.is_archived}
                                onChange={handleChange}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_archived" className="ml-2 block text-sm text-gray-900">
                                Archive
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-3 border-t">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {submitting ? 'Saving...' : (editingTestimonial ? 'Update Testimonial' : 'Save Testimonial')}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingTestimonial(null);
                                setErrors({});
                            }}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTestimonialForm;