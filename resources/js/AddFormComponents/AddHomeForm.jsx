// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddHomeForm = ({
//     editingHome,
//     setEditingHome,
//     setShowForm,
//     handleUpdate,
//     setReloadTrigger,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [homeForm, setHomeForm] = useState({
//         image: "",
//         video: "",
//         is_archived: false,
//     });

//     //  Use Effect
//     useEffect(() => {
//         if (editingHome) {
//             setHomeForm({
//                 ...editingHome,
//                 image: null,
//             });
//             setShowForm(true);
//         } else {
//             setHomeForm({
//                 image: "",
//                 video: "",
//                 is_archived: false,
//             });
//         }
//     }, [editingHome]);

//     // Handle Create Home
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourhome.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating home", error);
//             throw error;
//         }
//     };

//     // Handle Submit - now clearly separated paths
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();
//         // Append all form data except image if it's empty
//         for (const key in homeForm) {
//             if (homeForm[key] !== null && homeForm[key] !== "") {
//                 formData.append(key, homeForm[key]);
//             }
//         }
//         try {
//             setSubmitting(true);

//             if (editingHome) {
//                 // Editing existing home
//                 await handleUpdate(formData, editingHome.id);
//             } else {
//                 // Creating new home
//                 await handleCreate(formData);
//             }
//             setHomeForm({
//                 image: "",
//                 video: "",
//                 is_archived: false,
//             });

//             setShowForm(false);
//             setEditingHome(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // handle  change for image and the others

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         setHomeForm((prev) => ({
//             ...prev,
//             [name]: type === "file" ? files[0] : value,
//         }));
//     };
//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-lg h-[600px] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex flex-col gap-4">
//                     <h2 className="text-2xl font-bold mb-4">
//                         {editingHome ? "Edit Home" : "Add New Home"}
//                     </h2>
//                     <button
//                         onClick={() => {
//                             setShowForm(false);
//                         }}
//                         className="absolute top-4 right-4"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AddHomeForm;


import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddHomeForm = ({
    editingHome,
    setEditingHome,
    setShowForm,
    handleUpdate,
    setReloadTrigger,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [homeForm, setHomeForm] = useState({
        image: "",
        video: "",
        is_archived: false,
        metadata_json: "",
    });

    // Use Effect
    useEffect(() => {
        if (editingHome) {
            setHomeForm({
                image: null,
                video: editingHome.video || "",
                is_archived: editingHome.is_archived || false,
                metadata_json: editingHome.metadata_json || "",
            });
            // Set existing image preview
            if (editingHome.image) {
                setImagePreview(`/storage/${editingHome.image}`);
            }
            if (editingHome.video) {
                setVideoPreview(`/storage/${editingHome.video}`);
            }
        } else {
            setHomeForm({
                image: "",
                video: "",
                is_archived: false,
                metadata_json: "",
            });
            setImagePreview(null);
            setVideoPreview(null);
        }
    }, [editingHome]);

    // Handle Create Home
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourhome.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating home", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        
        // Append all form data
        if (homeForm.image && homeForm.image instanceof File) {
            formData.append("image", homeForm.image);
        }
        
        if (homeForm.video && homeForm.video instanceof File) {
            formData.append("video", homeForm.video);
        }
        
        formData.append("is_archived", homeForm.is_archived ? "1" : "0");
        
        if (homeForm.metadata_json) {
            formData.append("metadata_json", homeForm.metadata_json);
        }

        try {
            setSubmitting(true);

            if (editingHome) {
                // Editing existing home
                await handleUpdate(formData, editingHome.id);
            } else {
                // Creating new home
                await handleCreate(formData);
            }
            
            // Reset form
            setHomeForm({
                image: "",
                video: "",
                is_archived: false,
                metadata_json: "",
            });
            setImagePreview(null);
            setVideoPreview(null);
            setShowForm(false);
            setEditingHome(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle file change
    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];
        
        if (file) {
            setHomeForm((prev) => ({
                ...prev,
                [name]: file,
            }));

            // Create preview
            if (name === "image") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (name === "video") {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setVideoPreview(reader.result);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    // Handle change for other inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setHomeForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">
                        {editingHome ? "Edit Home" : "Add New Home"}
                    </h2>
                    <button
                        onClick={() => {
                            setShowForm(false);
                            setEditingHome(null);
                            setImagePreview(null);
                            setVideoPreview(null);
                        }}
                        className="p-1 hover:bg-gray-100 rounded-full"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image
                        </label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img 
                                    src={imagePreview} 
                                    alt="Preview" 
                                    className="h-32 w-32 object-cover rounded-lg border"
                                />
                            </div>
                        )}
                    </div>

                    {/* Video Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Video
                        </label>
                        <input
                            type="file"
                            name="video"
                            accept="video/*"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        {videoPreview && (
                            <div className="mt-2">
                                <video 
                                    src={videoPreview} 
                                    controls 
                                    className="h-32 w-full object-cover rounded-lg border"
                                />
                            </div>
                        )}
                    </div>

                    {/* Metadata JSON */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Metadata JSON
                        </label>
                        <textarea
                            name="metadata_json"
                            value={homeForm.metadata_json}
                            onChange={handleChange}
                            rows="4"
                            placeholder='{"key": "value"}'
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    {/* Archived Status */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="is_archived"
                            checked={homeForm.is_archived}
                            onChange={handleChange}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                            Archived
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingHome(null);
                                setImagePreview(null);
                                setVideoPreview(null);
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {submitting ? "Saving..." : (editingHome ? "Update" : "Create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHomeForm;
