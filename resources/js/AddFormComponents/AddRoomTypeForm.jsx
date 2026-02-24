// import axios from "axios";
// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddRoomTypeForm = ({
//     editingRoomType,
//     setShowForm,
//     handleUpdate,
//     setReloadTrigger,
//     setEditingRoomType,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [roomTypeForm, setRoomTypeForm] = useState({
//         name: "",
//         is_archived: true, // Use boolean instead of string
//     });

//     // Use Effect - Load data when editing
//     useEffect(() => {
//         if (editingRoomType) {
//             setRoomTypeForm({
//                 name: editingRoomType.name || "",
//                 is_archived:
//                     editingRoomType.is_archived === 1 ||
//                     editingRoomType.is_archived === true,
//             });
//         } else {
//             setRoomTypeForm({
//                 name: "",
//                 is_archived: false, // Default to active (false)
//             });
//         }
//     }, [editingRoomType]);

//     // Handle Create Room Type
//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(
//                 route("ourroomtype.store"),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );

//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error creating room type", error);
//             throw error;
//         }
//     };

//     // Handle Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();

//         // Append form data
//         formData.append("name", roomTypeForm.name);
//         formData.append("is_archived", roomTypeForm.is_archived ? "1" : "0");

//         try {
//             setSubmitting(true);

//             if (editingRoomType) {
//                 // Editing existing room type
//                 await handleUpdate(formData, editingRoomType.id);
//             } else {
//                 // Creating new room type
//                 await handleCreate(formData);
//             }

//             // Reset form and close modal
//             setRoomTypeForm({
//                 name: "",
//                 is_archived: false,
//             });
//             setShowForm(false);
//             setEditingRoomType(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle change for form fields
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setRoomTypeForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // Handle toggle change
//     const handleToggleChange = () => {
//         setRoomTypeForm((prev) => ({
//             ...prev,
//             is_archived: !prev.is_archived,
//         }));
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
//                     <h2 className="text-2xl font-bold">
//                         {editingRoomType
//                             ? "Edit Room Type"
//                             : "Add New Room Type"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={() => {
//                             setShowForm(false);
//                             setEditingRoomType(null);
//                         }}
//                         className="p-2 hover:bg-gray-100 rounded-full transition"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Name Field */}
//                     <div>
//                         <label
//                             htmlFor="name"
//                             className="block text-sm font-medium text-gray-700 mb-1"
//                         >
//                             Room Type Name{" "}
//                             <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             id="name"
//                             name="name"
//                             value={roomTypeForm.name}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             placeholder="Enter room type name"
//                         />
//                     </div>

//                     {/* Status Toggle Switch */}
//                     {/* <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Status
//                         </label>
//                         <div className="flex items-center space-x-3">
//                             <button
//                                 type="button"
//                                 onClick={handleToggleChange}
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
//                                     roomTypeForm.is_archived ? "bg-green-600" : "bg-red-600"
//                                 }`}
//                                 role="switch"
//                                 aria-checked={roomTypeForm.is_archived}
//                             >
//                                 <span
//                                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                                         roomTypeForm.is_archived ? "translate-x-1" : "translate-x-6"
//                                     }`}
//                                 />
//                             </button>
//                             <span className="text-sm text-gray-700">
//                                 {roomTypeForm.is_archived ? "Active" : "Archived"}
//                             </span>
//                         </div>
//                     </div> */}

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Status
//                         </label>
//                         <div className="flex items-center space-x-3">
//                             <button
//                                 type="button"
//                                 onClick={handleToggleChange}
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
//                                     roomTypeForm.is_archived
//                                         ? "bg-gray-300"
//                                         : "bg-green-600"
//                                 }`}
//                                 role="switch"
//                                 aria-checked={!roomTypeForm.is_archived}
//                             >
//                                 <span
//                                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                                         roomTypeForm.is_archived
//                                             ? "translate-x-1"
//                                             : "translate-x-6"
//                                     }`}
//                                 />
//                             </button>
//                             <span className="text-sm text-gray-700">
//                                 {roomTypeForm.is_archived
//                                     ? "Archived"
//                                     : "Active"}
//                             </span>
//                         </div>
//                     </div>

//                     {/* Form Buttons */}
//                     <div className="flex justify-end space-x-3 pt-4 border-t">
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setShowForm(false);
//                                 setEditingRoomType(null);
//                             }}
//                             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
//                         >
//                             {submitting
//                                 ? "Saving..."
//                                 : editingRoomType
//                                   ? "Update"
//                                   : "Save"}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddRoomTypeForm;


// import axios from "axios";
// import { X, Archive } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddRoomTypeForm = ({
//     editingRoomType,
//     setShowForm,
//     handleUpdate,
//     setReloadTrigger,
//     setEditingRoomType,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [roomTypeForm, setRoomTypeForm] = useState({
//         name: "",
//         is_archived: false, // Default to active (false)
//     });

//     // Add this useEffect to lock body scroll when form mounts
//     useEffect(() => {
//         // Lock body scroll
//         document.body.style.overflow = 'hidden';
//         document.body.style.position = 'fixed';
//         document.body.style.width = '100%';
        
//         // Cleanup function to restore scroll when component unmounts
//         return () => {
//             document.body.style.overflow = 'unset';
//             document.body.style.position = 'static';
//             document.body.style.width = 'auto';
//         };
//     }, []); // Empty dependency array means this runs once on mount

//     // Use Effect - Load data when editing
//     useEffect(() => {
//         if (editingRoomType) {
//             setRoomTypeForm({
//                 name: editingRoomType.name || "",
//                 is_archived:
//                     editingRoomType.is_archived === 1 ||
//                     editingRoomType.is_archived === true,
//             });
//         } else {
//             setRoomTypeForm({
//                 name: "",
//                 is_archived: false,
//             });
//         }
//     }, [editingRoomType]);

//     // Handle Create Room Type
//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(
//                 route("ourroomtype.store"),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );

//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error creating room type", error);
//             throw error;
//         }
//     };

//     // Handle Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         // Basic validation
//         if (!roomTypeForm.name.trim()) {
//             alert("Please fill in all required fields");
//             return;
//         }

//         const formData = new FormData();

//         // Append form data
//         formData.append("name", roomTypeForm.name);
//         formData.append("is_archived", roomTypeForm.is_archived ? "1" : "0");

//         // If editing, add method spoofing
//         if (editingRoomType) {
//             formData.append("_method", "PUT");
//         }

//         try {
//             setSubmitting(true);

//             if (editingRoomType) {
//                 // Editing existing room type
//                 await handleUpdate(formData, editingRoomType.id);
//             } else {
//                 // Creating new room type
//                 await handleCreate(formData);
//             }

//             // Reset form and close modal
//             setRoomTypeForm({
//                 name: "",
//                 is_archived: false,
//             });
//             setShowForm(false);
//             setEditingRoomType(null);
//         } catch (error) {
//             console.log("Error saving data", error);
//             alert(error.response?.data?.message || "Something went wrong!");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle change for form fields
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setRoomTypeForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // Toggle archived
//     const toggleArchived = () => {
//         setRoomTypeForm((prev) => ({
//             ...prev,
//             is_archived: !prev.is_archived,
//         }));
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
//                 {/* Header - Same style as AddCustomerForm */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingRoomType
//                             ? "Edit Room Type"
//                             : "Add New Room Type"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={() => {
//                             setShowForm(false);
//                             setEditingRoomType(null);
//                         }}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Form - Same layout as AddCustomerForm */}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Name Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Room Type Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={roomTypeForm.name}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                             placeholder="Enter room type name"
//                             required
//                             disabled={submitting}
//                         />
//                     </div>

//                     {/* Status Toggle Section - Redesigned to match form style */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Status
//                         </label>
//                         <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white">
//                             <div className="flex items-center space-x-3">
//                                 <Archive className="text-gray-500" size={20} />
//                                 <span className="text-sm text-gray-700">
//                                     Archive Room Type
//                                 </span>
//                             </div>
//                             <button
//                                 type="button"
//                                 onClick={toggleArchived}
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
//                                     roomTypeForm.is_archived
//                                         ? "bg-indigo-600"
//                                         : "bg-gray-300"
//                                 }`}
//                                 role="switch"
//                                 aria-checked={roomTypeForm.is_archived}
//                                 disabled={submitting}
//                             >
//                                 <span
//                                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                                         roomTypeForm.is_archived
//                                             ? "translate-x-6"
//                                             : "translate-x-1"
//                                     }`}
//                                 />
//                             </button>
//                         </div>
//                         <p className="mt-1 text-xs text-gray-500">
//                             {roomTypeForm.is_archived 
//                                 ? "Archived room types are hidden from public view" 
//                                 : "Active room types are visible and available for selection"}
//                         </p>
//                     </div>

//                     {/* Hidden input to keep the value in form submission */}
//                     <input
//                         type="hidden"
//                         name="is_archived"
//                         value={roomTypeForm.is_archived ? "1" : "0"}
//                     />

//                     {/* Form Actions - Same as AddCustomerForm */}
//                     <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setShowForm(false);
//                                 setEditingRoomType(null);
//                             }}
//                             className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
//                             disabled={submitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
//                             disabled={submitting}
//                         >
//                             {submitting ? (
//                                 <>
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                     {editingRoomType
//                                         ? "Updating..."
//                                         : "Saving..."}
//                                 </>
//                             ) : editingRoomType ? (
//                                 "Update Room Type"
//                             ) : (
//                                 "Add Room Type"
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddRoomTypeForm;



import axios from "axios";
import { X, Archive } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddRoomTypeForm = ({ setShowForm, setReloadTrigger }) => {
    const [submitting, setSubmitting] = useState(false);
    const [roomTypeForm, setRoomTypeForm] = useState({
        name: "",
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
            return response.data;
        } catch (error) {
            console.log("Error creating room type", error);
            throw error;
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!roomTypeForm.name.trim()) {
            alert("Please fill in all required fields");
            return;
        }

        const formData = new FormData();
        formData.append("name", roomTypeForm.name);
        formData.append("is_archived", roomTypeForm.is_archived ? "1" : "0");

        try {
            setSubmitting(true);
            await handleCreate(formData);
            
            setReloadTrigger((prev) => !prev);
            setRoomTypeForm({ name: "", is_archived: false });
            setShowForm(false);
        } catch (error) {
            console.log("Error saving data", error);
            alert(error.response?.data?.message || "Something went wrong!");
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomTypeForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const toggleArchived = () => {
        setRoomTypeForm((prev) => ({
            ...prev,
            is_archived: !prev.is_archived,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Add New Room Type
                    </h2>
                    <button
                        type="button"
                        onClick={() => setShowForm(false)}
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
                            Room Type Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={roomTypeForm.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter room type name"
                            required
                            disabled={submitting}
                        />
                    </div>

                    {/* Status Toggle Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white">
                            <div className="flex items-center space-x-3">
                                <Archive className="text-gray-500" size={20} />
                                <span className="text-sm text-gray-700">
                                    Archive Room Type
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleArchived}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    roomTypeForm.is_archived
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                                role="switch"
                                aria-checked={roomTypeForm.is_archived}
                                disabled={submitting}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        roomTypeForm.is_archived
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            {roomTypeForm.is_archived 
                                ? "Archived room types are hidden from public view" 
                                : "Active room types are visible and available for selection"}
                        </p>
                    </div>

                    {/* Hidden input */}
                    <input
                        type="hidden"
                        name="is_archived"
                        value={roomTypeForm.is_archived ? "1" : "0"}
                    />

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
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
                                    Saving...
                                </>
                            ) : (
                                "Add Room Type"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoomTypeForm;