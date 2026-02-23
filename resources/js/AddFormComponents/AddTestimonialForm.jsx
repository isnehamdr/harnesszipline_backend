// import { X } from "lucide-react";
// import React, { useState, useEffect } from "react";
// import axios from 'axios';

// const AddTestimonialForm = ({ setShowForm, editingTestimonial, setEditingTestimonial, setReloadTrigger }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [testimonialForm, setTestimonialForm] = useState({
//         fullname: "",
//         address: "",
//         short_description: "",
//         long_description: "",
//         is_featured: false,
//         is_archived: false,
//     });

//     // Use Effect for editing
//     useEffect(() => {
//         if (editingTestimonial) {
//             setTestimonialForm({
//                 fullname: editingTestimonial.fullname || "",
//                 address: editingTestimonial.address || "",
//                 short_description: editingTestimonial.short_description || "",
//                 long_description: editingTestimonial.long_description || "",
//                 is_featured: Boolean(editingTestimonial.is_featured),
//                 is_archived: Boolean(editingTestimonial.is_archived),
//             });
//         } else {
//             setTestimonialForm({
//                 fullname: "",
//                 address: "",
//                 short_description: "",
//                 long_description: "",
//                 is_featured: false,
//                 is_archived: false,
//             });
//         }
//         setErrors({});
//     }, [editingTestimonial]);

//     // Handle Create Testimonial
//     const handleCreate = async (formData) => {
//         try {
//             // Convert FormData to a plain object for debugging
//             const formDataObj = {};
//             for (let [key, value] of formData.entries()) {
//                 formDataObj[key] = value;
//             }
//             console.log('Submitting data:', formDataObj);

//             const response = await axios.post(route("ourtestimonials.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
            
//             console.log('Response:', response.data);
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error creating testimonial", error);
//             if (error.response && error.response.status === 422) {
//                 // Validation errors
//                 setErrors(error.response.data.errors || {});
//                 throw new Error('Validation failed');
//             }
//             throw error;
//         }
//     };

//     // Handle Update Testimonial
//     const handleUpdate = async (formData, id) => {
//         try {
//             // Convert FormData to a plain object for debugging
//             const formDataObj = {};
//             for (let [key, value] of formData.entries()) {
//                 formDataObj[key] = value;
//             }
//             console.log('Updating data:', formDataObj);

//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourtestimonials.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );
            
//             console.log('Response:', response.data);
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating testimonial", error);
//             if (error.response && error.response.status === 422) {
//                 // Validation errors
//                 setErrors(error.response.data.errors || {});
//                 throw new Error('Validation failed');
//             }
//             throw error;
//         }
//     };

//     // Handle Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});
        
//         const formData = new FormData();
        
//         // Append all form data with proper formatting
//         formData.append('fullname', testimonialForm.fullname.trim());
        
//         if (testimonialForm.address) {
//             formData.append('address', testimonialForm.address.trim());
//         }
        
//         if (testimonialForm.short_description) {
//             formData.append('short_description', testimonialForm.short_description.trim());
//         }
        
//         if (testimonialForm.long_description) {
//             formData.append('long_description', testimonialForm.long_description.trim());
//         }
        
//         // Convert boolean to string '1' or '0' for proper handling in PHP
//         formData.append('is_featured', testimonialForm.is_featured ? '1' : '0');
//         formData.append('is_archived', testimonialForm.is_archived ? '1' : '0');
        
//         try {
//             setSubmitting(true);

//             if (editingTestimonial) {
//                 // Editing existing testimonial
//                 await handleUpdate(formData, editingTestimonial.id);
//             } else {
//                 // Creating new testimonial
//                 await handleCreate(formData);
//             }
            
//             // Reset form and close modal
//             setTestimonialForm({
//                 fullname: "",
//                 address: "",
//                 short_description: "",
//                 long_description: "",
//                 is_featured: false,
//                 is_archived: false,
//             });

//             setShowForm(false);
//             setEditingTestimonial(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//             if (error.message !== 'Validation failed') {
//                 alert('An error occurred while saving. Please try again.');
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle change for inputs
//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setTestimonialForm((prev) => ({
//             ...prev,
//             [name]: type === "checkbox" ? checked : value,
//         }));
//         // Clear error for this field when user starts typing
//         if (errors[name]) {
//             setErrors((prev) => ({ ...prev, [name]: null }));
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex justify-between items-center mb-4 sticky top-0 bg-white py-2">
//                     <h2 className="text-2xl font-bold">
//                         {editingTestimonial
//                             ? "Edit Testimonial"
//                             : "Add New Testimonial"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={() => {
//                             setShowForm(false);
//                             setEditingTestimonial(null);
//                             setErrors({});
//                         }}
//                         className="p-1 hover:bg-gray-100 rounded-full"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {Object.keys(errors).length > 0 && (
//                     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//                         <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
//                         <ul className="list-disc list-inside text-sm text-red-600">
//                             {Object.entries(errors).map(([field, messages]) => (
//                                 <li key={field}>{Array.isArray(messages) ? messages[0] : messages}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Full Name */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Full Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             name="fullname"
//                             value={testimonialForm.fullname}
//                             onChange={handleChange}
//                             required
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                                 errors.fullname ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         />
//                         {errors.fullname && (
//                             <p className="mt-1 text-xs text-red-500">{errors.fullname[0]}</p>
//                         )}
//                     </div>

//                     {/* Address */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Address
//                         </label>
//                         <input
//                             type="text"
//                             name="address"
//                             value={testimonialForm.address}
//                             onChange={handleChange}
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                                 errors.address ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         />
//                         {errors.address && (
//                             <p className="mt-1 text-xs text-red-500">{errors.address[0]}</p>
//                         )}
//                     </div>

//                     {/* Short Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Short Description
//                         </label>
//                         <textarea
//                             name="short_description"
//                             value={testimonialForm.short_description}
//                             onChange={handleChange}
//                             rows="2"
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                                 errors.short_description ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         />
//                         {errors.short_description && (
//                             <p className="mt-1 text-xs text-red-500">{errors.short_description[0]}</p>
//                         )}
//                     </div>

//                     {/* Long Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Long Description
//                         </label>
//                         <textarea
//                             name="long_description"
//                             value={testimonialForm.long_description}
//                             onChange={handleChange}
//                             rows="3"
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
//                                 errors.long_description ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         />
//                         {errors.long_description && (
//                             <p className="mt-1 text-xs text-red-500">{errors.long_description[0]}</p>
//                         )}
//                     </div>

//                     {/* Checkboxes */}
//                     <div className="space-y-2">
//                         <div className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name="is_featured"
//                                 id="is_featured"
//                                 checked={testimonialForm.is_featured}
//                                 onChange={handleChange}
//                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
//                                 Featured Testimonial
//                             </label>
//                         </div>

//                         <div className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name="is_archived"
//                                 id="is_archived"
//                                 checked={testimonialForm.is_archived}
//                                 onChange={handleChange}
//                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                             />
//                             <label htmlFor="is_archived" className="ml-2 block text-sm text-gray-900">
//                                 Archive
//                             </label>
//                         </div>
//                     </div>

//                     {/* Submit Button */}
//                     <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-3 border-t">
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//                         >
//                             {submitting ? 'Saving...' : (editingTestimonial ? 'Update Testimonial' : 'Save Testimonial')}
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setShowForm(false);
//                                 setEditingTestimonial(null);
//                                 setErrors({});
//                             }}
//                             className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors"
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddTestimonialForm;


import { X, Star, Archive } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
            ["link"],
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
    ];

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
            const response = await axios.post(route("ourtestimonials.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error creating testimonial", error);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors || {});
                throw new Error('Validation failed');
            }
            throw error;
        }
    };

    // Handle Update Testimonial
    const handleUpdate = async (formData, id) => {
        try {
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
            
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating testimonial", error);
            if (error.response && error.response.status === 422) {
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
        
        formData.append('is_featured', testimonialForm.is_featured ? '1' : '0');
        formData.append('is_archived', testimonialForm.is_archived ? '1' : '0');
        
        try {
            setSubmitting(true);

            if (editingTestimonial) {
                await handleUpdate(formData, editingTestimonial.id);
            } else {
                await handleCreate(formData);
            }
            
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
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    // Handle Quill change
    const handleQuillChange = (content) => {
        setTestimonialForm((prev) => ({
            ...prev,
            long_description: content,
        }));
        if (errors.long_description) {
            setErrors((prev) => ({ ...prev, long_description: null }));
        }
    };

    // Toggle handlers
    const toggleFeatured = () => {
        setTestimonialForm((prev) => ({
            ...prev,
            is_featured: !prev.is_featured,
        }));
    };

    const toggleArchived = () => {
        setTestimonialForm((prev) => ({
            ...prev,
            is_archived: !prev.is_archived,
        }));
    };

    const handleClose = () => {
        setShowForm(false);
        setEditingTestimonial(null);
        setErrors({});
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Error Summary */}
                {Object.keys(errors).length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <h3 className="text-sm font-medium text-red-800 mb-2">Please fix the following errors:</h3>
                        <ul className="list-disc list-inside text-sm text-red-600">
                            {Object.entries(errors).map(([field, messages]) => (
                                <li key={field}>{Array.isArray(messages) ? messages[0] : messages}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name and Address - Same Line */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    errors.fullname ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter customer full name"
                                disabled={submitting}
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
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                    errors.address ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="Enter customer address"
                                disabled={submitting}
                            />
                            {errors.address && (
                                <p className="mt-1 text-xs text-red-500">{errors.address[0]}</p>
                            )}
                        </div>
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
                            rows="3"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none ${
                                errors.short_description ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter a brief description"
                            disabled={submitting}
                        />
                        {errors.short_description && (
                            <p className="mt-1 text-xs text-red-500">{errors.short_description[0]}</p>
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
                                value={testimonialForm.long_description || ""}
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

                    {/* Toggle Switches for Featured and Archived */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Featured Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Star className={`${testimonialForm.is_featured ? 'text-yellow-500' : 'text-gray-400'}`} size={20} />
                                <span className="text-sm font-medium text-gray-700">
                                    Featured Testimonial
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleFeatured}
                                disabled={submitting}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    testimonialForm.is_featured
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        testimonialForm.is_featured
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Archived Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Archive className={`${testimonialForm.is_archived ? 'text-gray-600' : 'text-gray-400'}`} size={20} />
                                <span className="text-sm font-medium text-gray-700">
                                    Archive Testimonial
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleArchived}
                                disabled={submitting}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    testimonialForm.is_archived
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        testimonialForm.is_archived
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
                        value={testimonialForm.is_featured ? "1" : "0"}
                    />
                    <input
                        type="hidden"
                        name="is_archived"
                        value={testimonialForm.is_archived ? "1" : "0"}
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
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    {editingTestimonial ? "Updating..." : "Saving..."}
                                </>
                            ) : editingTestimonial ? (
                                "Update Testimonial"
                            ) : (
                                "Add Testimonial"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTestimonialForm;