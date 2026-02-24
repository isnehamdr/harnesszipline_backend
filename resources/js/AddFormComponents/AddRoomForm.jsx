// // AddRoomForm.jsx
// import axios from "axios";
// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddRoomForm = ({
//     editingRoom,
//     setShowForm,
//     handleUpdate,
//     setReloadTrigger,
//     setEditingRoom,
//     reloadTrigger
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [allRoomTypes, setAllRoomTypes] = useState([]);
//     const [validationErrors, setValidationErrors] = useState({});
//     const [roomForm, setRoomForm] = useState({
//         name: "",
//         order: "",
//         no_of_room: 0,           // Changed to 0
//         no_of_children: 0,        // Changed to 0
//         no_of_adult: 0,           // Changed to 0
//         price: "",
//         refrence_id: "",
//         short_description: "",
//         long_description: "",
//         meta_data: "",
//         is_archived: false,
//         is_featured: false,
//         room_type_id: "",
//         images: [],
//         display_image_index: 0
//     });

//     // Use Effect for editing
//     useEffect(() => {
//         if (editingRoom) {
//             setRoomForm({
//                 name: editingRoom.name || "",
//                 order: editingRoom.order || "",
//                 no_of_room: editingRoom.no_of_room || 0,           // Default to 0 if not set
//                 no_of_children: editingRoom.no_of_children || 0,    // Default to 0 if not set
//                 no_of_adult: editingRoom.no_of_adult || 0,          // Default to 0 if not set
//                 price: editingRoom.price || "",
//                 refrence_id: editingRoom.refrence_id || "",
//                 short_description: editingRoom.short_description || "",
//                 long_description: editingRoom.long_description || "",
//                 meta_data: editingRoom.meta_data || "",
//                 is_archived: editingRoom.is_archived || false,
//                 is_featured: editingRoom.is_featured || false,
//                 room_type_id: editingRoom.room_type_id || "",
//                 images: [], // Reset images for new uploads
//                 display_image_index: editingRoom.display_image_index || 0
//             });
//         }
//     }, [editingRoom]);

//     // For fetching the room type data - ONLY NON-ARCHIVED
//     useEffect(() => {
//         const fetchRoomTypes = async () => {
//             try {
//                 const response = await axios.get(route("ourroomtype.index"), {
//                     params: {
//                         is_archived: false
//                     }
//                 });
                
//                 const responseData = response.data;
//                 let roomTypes = [];
                
//                 if (responseData.data && Array.isArray(responseData.data)) {
//                     roomTypes = responseData.data;
//                 } else if (Array.isArray(responseData)) {
//                     roomTypes = responseData;
//                 }
                
//                 const filteredRoomTypes = roomTypes.filter(type => !type.is_archived);
//                 setAllRoomTypes(filteredRoomTypes);
//                 setValidationErrors({}); // Clear errors when room types load
                
//             } catch (error) {
//                 console.error("Error fetching room types:", error);
//                 setAllRoomTypes([]);
//             }
//         };

//         fetchRoomTypes();
//     }, [reloadTrigger]);

//     // Handle Create Room
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourroom.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             if (error.response && error.response.status === 422) {
//                 // Validation errors
//                 setValidationErrors(error.response.data.errors || {});
//                 throw error;
//             }
//             console.log("Error creating room", error);
//             throw error;
//         }
//     };

//     // Handle Update Room
//     const defaultHandleUpdate = async (formData, id) => {
//         try {
//             // For Laravel, use POST with _method=PUT
//             formData.append('_method', 'PUT');
//             await axios.post(route("ourroom.update", id), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             if (error.response && error.response.status === 422) {
//                 // Validation errors
//                 setValidationErrors(error.response.data.errors || {});
//                 throw error;
//             }
//             console.log("Error updating room", error);
//             throw error;
//         }
//     };

//     // Handle Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setValidationErrors({}); // Clear previous errors
        
//         const formData = new FormData();
        
//         // Append all form data - ensure all required fields are sent
//         const requiredFields = ['name', 'no_of_room', 'no_of_adult', 'no_of_children', 'price', 'room_type_id'];
        
//         // Check if all required fields are filled (allow 0 as valid value)
//         for (const field of requiredFields) {
//             if (roomForm[field] === undefined || roomForm[field] === null || roomForm[field] === '') {
//                 setValidationErrors(prev => ({
//                     ...prev,
//                     [field]: [`The ${field.replace(/_/g, ' ')} field is required.`]
//                 }));
//                 return;
//             }
//         }
        
//         // Append all fields
//         Object.keys(roomForm).forEach(key => {
//             if (key === 'images') {
//                 // Handle multiple image uploads
//                 if (roomForm.images && roomForm.images.length > 0) {
//                     const files = roomForm.images instanceof FileList 
//                         ? Array.from(roomForm.images) 
//                         : roomForm.images;
                    
//                     files.forEach((file, index) => {
//                         if (file instanceof File) {
//                             formData.append(`images[${index}]`, file);
//                         }
//                     });
//                 }
//             } else if (roomForm[key] !== null && roomForm[key] !== undefined) {
//                 // Handle empty strings for numeric fields
//                 if (roomForm[key] === '' && ['no_of_room', 'no_of_children', 'no_of_adult'].includes(key)) {
//                     formData.append(key, '0');
//                 }
//                 // Convert boolean values to strings for FormData
//                 else if (typeof roomForm[key] === 'boolean') {
//                     formData.append(key, roomForm[key] ? '1' : '0');
//                 }
//                 else {
//                     formData.append(key, String(roomForm[key]));
//                 }
//             }
//         });

//         // Add display_image_index if not set
//         if (!formData.has('display_image_index')) {
//             formData.append('display_image_index', '0');
//         }

//         try {
//             setSubmitting(true);

//             if (editingRoom) {
//                 if (handleUpdate) {
//                     await handleUpdate(formData, editingRoom.id);
//                 } else {
//                     await defaultHandleUpdate(formData, editingRoom.id);
//                 }
//             } else {
//                 await handleCreate(formData);
//             }
            
//             // Reset form and close - with 0 as default for numeric fields
//             setRoomForm({
//                 name: "",
//                 order: "",
//                 no_of_room: 0,           // Changed to 0
//                 no_of_children: 0,        // Changed to 0
//                 no_of_adult: 0,           // Changed to 0
//                 price: "",
//                 refrence_id: "",
//                 short_description: "",
//                 long_description: "",
//                 meta_data: "",
//                 is_archived: false,
//                 is_featured: false,
//                 room_type_id: "",
//                 images: [],
//                 display_image_index: 0
//             });

//             setShowForm(false);
//             setEditingRoom(null);
//         } catch (error) {
//             console.log("Error saving data", error);
            
//             // Show user-friendly error message
//             if (error.response && error.response.status === 422) {
//                 // Validation errors are already set
//                 console.log("Validation errors:", error.response.data.errors);
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle change for inputs
//     const handleChange = (e) => {
//         const { name, value, type, checked, files } = e.target;
        
//         // Clear validation error for this field when user starts typing
//         if (validationErrors[name]) {
//             setValidationErrors(prev => {
//                 const newErrors = { ...prev };
//                 delete newErrors[name];
//                 return newErrors;
//             });
//         }
        
//         if (type === "file") {
//             setRoomForm((prev) => ({
//                 ...prev,
//                 [name]: files
//             }));
//         } else if (type === "checkbox") {
//             setRoomForm((prev) => ({
//                 ...prev,
//                 [name]: checked
//             }));
//         } else {
//             // For number inputs, convert empty string to 0
//             if ((name === 'no_of_room' || name === 'no_of_children' || name === 'no_of_adult') && value === '') {
//                 setRoomForm((prev) => ({
//                     ...prev,
//                     [name]: 0
//                 }));
//             } else {
//                 setRoomForm((prev) => ({
//                     ...prev,
//                     [name]: value
//                 }));
//             }
//         }
//     };

//     // Toggle switch component
//     const ToggleSwitch = ({ name, checked, onChange, label }) => (
//         <div className="flex items-center justify-between">
//             <span className="text-sm font-medium text-gray-700">{label}</span>
//             <button
//                 type="button"
//                 onClick={() => {
//                     onChange({
//                         target: {
//                             name,
//                             type: 'checkbox',
//                             checked: !checked
//                         }
//                     });
//                 }}
//                 className={`${
//                     checked ? 'bg-indigo-600' : 'bg-gray-200'
//                 } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
//             >
//                 <span
//                     className={`${
//                         checked ? 'translate-x-6' : 'translate-x-1'
//                     } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
//                 />
//             </button>
//         </div>
//     );

//     // Helper function to get field error
//     const getFieldError = (fieldName) => {
//         return validationErrors[fieldName] ? (
//             <p className="text-xs text-red-500 mt-1">{validationErrors[fieldName][0]}</p>
//         ) : null;
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
//                     <h2 className="text-2xl font-bold">
//                         {editingRoom ? "Edit Room" : "Add New Room"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={() => {
//                             setShowForm(false);
//                             setEditingRoom(null);
//                         }}
//                         className="p-2 hover:bg-gray-100 rounded-full transition"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Show validation summary if there are errors */}
//                 {Object.keys(validationErrors).length > 0 && (
//                     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//                         <p className="text-sm font-medium text-red-800">Please fix the following errors:</p>
//                         <ul className="mt-1 text-xs text-red-600 list-disc list-inside">
//                             {Object.entries(validationErrors).map(([field, errors]) => (
//                                 <li key={field}>{errors[0]}</li>
//                             ))}
//                         </ul>
//                     </div>
//                 )}

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Basic Information */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Room Name *
//                             </label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={roomForm.name}
//                                 onChange={handleChange}
//                                 required
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.name ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                             />
//                             {getFieldError('name')}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Room Type *
//                             </label>
//                             <select
//                                 name="room_type_id"
//                                 value={roomForm.room_type_id}
//                                 onChange={handleChange}
//                                 required
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.room_type_id ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                             >
//                                 <option value="">Select Room Type</option>
//                                 {allRoomTypes.length > 0 ? (
//                                     allRoomTypes.map((type) => (
//                                         <option key={type.id} value={type.id}>
//                                             {type.name}
//                                         </option>
//                                     ))
//                                 ) : (
//                                     <option value="" disabled>No room types available</option>
//                                 )}
//                             </select>
//                             {getFieldError('room_type_id')}
//                             {allRoomTypes.length === 0 && (
//                                 <p className="text-xs text-amber-600 mt-1">
//                                     No active room types found. Please create a room type first.
//                                 </p>
//                             )}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Order
//                             </label>
//                             <input
//                                 type="number"
//                                 name="order"
//                                 value={roomForm.order}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Reference ID
//                             </label>
//                             <input
//                                 type="text"
//                                 name="refrence_id"
//                                 value={roomForm.refrence_id}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                             />
//                         </div>
//                     </div>

//                     {/* Capacity & Pricing */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Number of Rooms *
//                             </label>
//                             <input
//                                 type="number"
//                                 name="no_of_room"
//                                 value={roomForm.no_of_room}
//                                 onChange={handleChange}
//                                 required
//                                 min="0"
//                                 step="1"
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.no_of_room ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                             />
//                             {getFieldError('no_of_room')}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Adults *
//                             </label>
//                             <input
//                                 type="number"
//                                 name="no_of_adult"
//                                 value={roomForm.no_of_adult}
//                                 onChange={handleChange}
//                                 required
//                                 min="0"
//                                 step="1"
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.no_of_adult ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                             />
//                             {getFieldError('no_of_adult')}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Children *
//                             </label>
//                             <input
//                                 type="number"
//                                 name="no_of_children"
//                                 value={roomForm.no_of_children}
//                                 onChange={handleChange}
//                                 required
//                                 min="0"
//                                 step="1"
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.no_of_children ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                             />
//                             {getFieldError('no_of_children')}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Price ($) *
//                             </label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 name="price"
//                                 value={roomForm.price}
//                                 onChange={handleChange}
//                                 required
//                                 min="0"
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.price ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
//                             />
//                             {getFieldError('price')}
//                         </div>
//                     </div>

//                     {/* Descriptions */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Short Description
//                         </label>
//                         <textarea
//                             name="short_description"
//                             value={roomForm.short_description}
//                             onChange={handleChange}
//                             rows="2"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Long Description
//                         </label>
//                         <textarea
//                             name="long_description"
//                             value={roomForm.long_description}
//                             onChange={handleChange}
//                             rows="4"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     {/* Images */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Room Images
//                         </label>
//                         <input
//                             type="file"
//                             name="images"
//                             onChange={handleChange}
//                             multiple
//                             accept="image/*"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                             You can select multiple images. Max size: 2MB per image
//                         </p>
//                         {editingRoom && editingRoom.images && editingRoom.images.length > 0 && (
//                             <p className="text-xs text-blue-500 mt-1">
//                                 Existing images: {editingRoom.images.length} image(s) available. 
//                                 Select new images to add more.
//                             </p>
//                         )}
//                     </div>

//                     {/* Toggle Switches */}
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
//                         <ToggleSwitch
//                             name="is_featured"
//                             checked={roomForm.is_featured}
//                             onChange={handleChange}
//                             label="Featured Room"
//                         />
                        
//                         <ToggleSwitch
//                             name="is_archived"
//                             checked={roomForm.is_archived}
//                             onChange={handleChange}
//                             label="Archived"
//                         />
//                     </div>

//                     {/* Meta Data */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Meta Data (JSON)
//                         </label>
//                         <textarea
//                             name="meta_data"
//                             value={roomForm.meta_data}
//                             onChange={handleChange}
//                             rows="3"
//                             placeholder='{"key": "value"}'
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
//                         />
//                     </div>

//                     {/* Form Actions */}
//                     <div className="flex justify-end gap-3 pt-4 border-t">
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setShowForm(false);
//                                 setEditingRoom(null);
//                             }}
//                             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting || allRoomTypes.length === 0}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
//                         >
//                             {submitting ? "Saving..." : (editingRoom ? "Update Room" : "Create Room")}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddRoomForm;



// AddRoomForm.jsx
// import axios from "axios";
// import { X, Star, Archive, Upload, Image as ImageIcon } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// const AddRoomForm = ({
//     editingRoom,
//     setShowForm,
//     handleUpdate,
//     setReloadTrigger,
//     setEditingRoom,
//     reloadTrigger
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [allRoomTypes, setAllRoomTypes] = useState([]);
//     const [validationErrors, setValidationErrors] = useState({});
//     const [imagePreviews, setImagePreviews] = useState([]);
//     const [imageFiles, setImageFiles] = useState([]);
//     const [roomForm, setRoomForm] = useState({
//         name: "",
//         order: "",
//         no_of_room: 0,
//         no_of_children: 0,
//         no_of_adult: 0,
//         price: "",
//         refrence_id: "",
//         short_description: "",
//         long_description: "",
//         meta_data: "",
//         is_archived: false,
//         is_featured: false,
//         room_type_id: "",
//         images: [],
//         display_image_index: 0
//     });

//     // Lock body scroll when form mounts
//     useEffect(() => {
//         document.body.style.overflow = 'hidden';
//         document.body.style.position = 'fixed';
//         document.body.style.width = '100%';
        
//         return () => {
//             document.body.style.overflow = 'unset';
//             document.body.style.position = 'static';
//             document.body.style.width = 'auto';
//         };
//     }, []);

//     // File size limits in bytes - 2MB max
//     const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

//     // Quill modules configuration
//     const quillModules = {
//         toolbar: [
//             [{ header: [1, 2, 3, 4, 5, 6, false] }],
//             ["bold", "italic", "underline", "strike"],
//             [{ list: "ordered" }, { list: "bullet" }],
//             [{ indent: "-1" }, { indent: "+1" }],
//             [{ align: [] }],
//             ["link", "image"],
//             ["clean"],
//         ],
//     };

//     const quillFormats = [
//         "header",
//         "bold",
//         "italic",
//         "underline",
//         "strike",
//         "list",
//         "bullet",
//         "indent",
//         "align",
//         "link",
//         "image",
//     ];

//     // Use Effect for editing
//     useEffect(() => {
//         if (editingRoom) {
//             setRoomForm({
//                 name: editingRoom.name || "",
//                 order: editingRoom.order || "",
//                 no_of_room: editingRoom.no_of_room || 0,
//                 no_of_children: editingRoom.no_of_children || 0,
//                 no_of_adult: editingRoom.no_of_adult || 0,
//                 price: editingRoom.price || "",
//                 refrence_id: editingRoom.refrence_id || "",
//                 short_description: editingRoom.short_description || "",
//                 long_description: editingRoom.long_description || "",
//                 meta_data: editingRoom.meta_data || "",
//                 is_archived: editingRoom.is_archived || false,
//                 is_featured: editingRoom.is_featured || false,
//                 room_type_id: editingRoom.room_type_id || "",
//                 images: [],
//                 display_image_index: editingRoom.display_image_index || 0
//             });
            
//             // Reset image previews
//             setImagePreviews([]);
//             setImageFiles([]);
//         } else {
//             resetForm();
//         }
//     }, [editingRoom]);

//     // Reset form function
//     const resetForm = () => {
//         setRoomForm({
//             name: "",
//             order: "",
//             no_of_room: 0,
//             no_of_children: 0,
//             no_of_adult: 0,
//             price: "",
//             refrence_id: "",
//             short_description: "",
//             long_description: "",
//             meta_data: "",
//             is_archived: false,
//             is_featured: false,
//             room_type_id: "",
//             images: [],
//             display_image_index: 0
//         });
//         setImagePreviews([]);
//         setImageFiles([]);
//         setValidationErrors({});
//     };

//     // For fetching the room type data - ONLY NON-ARCHIVED
//     useEffect(() => {
//         const fetchRoomTypes = async () => {
//             try {
//                 const response = await axios.get(route("ourroomtype.index"), {
//                     params: {
//                         is_archived: false
//                     }
//                 });
                
//                 const responseData = response.data;
//                 let roomTypes = [];
                
//                 if (responseData.data && Array.isArray(responseData.data)) {
//                     roomTypes = responseData.data;
//                 } else if (Array.isArray(responseData)) {
//                     roomTypes = responseData;
//                 }
                
//                 const filteredRoomTypes = roomTypes.filter(type => !type.is_archived);
//                 setAllRoomTypes(filteredRoomTypes);
//                 setValidationErrors({}); // Clear errors when room types load
                
//             } catch (error) {
//                 console.error("Error fetching room types:", error);
//                 setAllRoomTypes([]);
//             }
//         };

//         fetchRoomTypes();
//     }, [reloadTrigger]);

//     // Handle Create Room
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourroom.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             if (error.response && error.response.status === 422) {
//                 // Validation errors
//                 setValidationErrors(error.response.data.errors || {});
//                 throw error;
//             }
//             console.log("Error creating room", error);
//             throw error;
//         }
//     };

//     // Handle Update Room
//     const defaultHandleUpdate = async (formData, id) => {
//         try {
//             // For Laravel, use POST with _method=PUT
//             formData.append('_method', 'PUT');
//             await axios.post(route("ourroom.update", id), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             if (error.response && error.response.status === 422) {
//                 // Validation errors
//                 setValidationErrors(error.response.data.errors || {});
//                 throw error;
//             }
//             console.log("Error updating room", error);
//             throw error;
//         }
//     };

//     // Handle Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setValidationErrors({}); // Clear previous errors

//         // Validate image sizes before submission
//         if (imageFiles.length > 0) {
//             const oversizedImages = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
//             if (oversizedImages.length > 0) {
//                 alert(`${oversizedImages.length} image(s) exceed 2MB limit. Please remove them.`);
//                 return;
//             }
//         }
        
//         const formData = new FormData();
        
//         // Check if all required fields are filled (allow 0 as valid value)
//         const requiredFields = ['name', 'no_of_room', 'no_of_adult', 'no_of_children', 'price', 'room_type_id'];
//         for (const field of requiredFields) {
//             if (roomForm[field] === undefined || roomForm[field] === null || roomForm[field] === '') {
//                 setValidationErrors(prev => ({
//                     ...prev,
//                     [field]: [`The ${field.replace(/_/g, ' ')} field is required.`]
//                 }));
//                 return;
//             }
//         }
        
//         // Append all fields
//         Object.keys(roomForm).forEach(key => {
//             if (key === 'images') {
//                 // Handle multiple image uploads
//                 if (imageFiles.length > 0) {
//                     imageFiles.forEach((file, index) => {
//                         formData.append(`images[${index}]`, file);
//                     });
//                 }
//             } else if (key !== 'images') {
//                 if (roomForm[key] !== null && roomForm[key] !== undefined) {
//                     // Handle empty strings for numeric fields
//                     if (roomForm[key] === '' && ['no_of_room', 'no_of_children', 'no_of_adult'].includes(key)) {
//                         formData.append(key, '0');
//                     }
//                     // Convert boolean values to strings for FormData
//                     else if (typeof roomForm[key] === 'boolean') {
//                         formData.append(key, roomForm[key] ? '1' : '0');
//                     }
//                     else {
//                         formData.append(key, String(roomForm[key]));
//                     }
//                 }
//             }
//         });

//         // Add display_image_index if not set
//         if (!formData.has('display_image_index')) {
//             formData.append('display_image_index', '0');
//         }

//         try {
//             setSubmitting(true);

//             if (editingRoom) {
//                 if (handleUpdate) {
//                     await handleUpdate(formData, editingRoom.id);
//                 } else {
//                     await defaultHandleUpdate(formData, editingRoom.id);
//                 }
//             } else {
//                 await handleCreate(formData);
//             }
            
//             // Reset form and close
//             resetForm();
//             setShowForm(false);
//             setEditingRoom(null);
//         } catch (error) {
//             console.log("Error saving data", error);
            
//             // Show user-friendly error message
//             if (error.response && error.response.status === 422) {
//                 console.log("Validation errors:", error.response.data.errors);
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle multiple images change
//     const handleImagesChange = (e) => {
//         const files = Array.from(e.target.files);
        
//         if (files.length > 0) {
//             // Filter only image files
//             let imageFiles = files.filter(file => file.type.startsWith('image/'));
            
//             if (imageFiles.length !== files.length) {
//                 alert("Some files are not images and were ignored");
//             }
            
//             if (imageFiles.length > 0) {
//                 // Validate each file size - 2MB max
//                 const oversizedFiles = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
//                 if (oversizedFiles.length > 0) {
//                     alert(`${oversizedFiles.length} image(s) exceed 2MB limit and were ignored`);
//                     imageFiles = imageFiles.filter(file => file.size <= MAX_IMAGE_SIZE);
//                 }
                
//                 setImageFiles(prev => [...prev, ...imageFiles]);
                
//                 // Create previews for new files
//                 imageFiles.forEach((file) => {
//                     const reader = new FileReader();
//                     reader.onloadend = () => {
//                         setImagePreviews(prev => [...prev, {
//                             url: reader.result,
//                             file: file,
//                             isExisting: false
//                         }]);
//                     };
//                     reader.readAsDataURL(file);
//                 });
                
//                 // Clear image errors when new files are selected
//                 setValidationErrors(prev => ({
//                     ...prev,
//                     "images.0": undefined,
//                     "images.*": undefined,
//                     "images": undefined
//                 }));
//             }
//         }
//     };

//     // Remove image
//     const removeImage = (index) => {
//         setImageFiles(prev => prev.filter((_, i) => i !== index));
//         setImagePreviews(prev => prev.filter((_, i) => i !== index));
//     };

//     // Handle change for regular inputs
//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
        
//         // Clear validation error for this field when user starts typing
//         if (validationErrors[name]) {
//             setValidationErrors(prev => {
//                 const newErrors = { ...prev };
//                 delete newErrors[name];
//                 return newErrors;
//             });
//         }
        
//         if (type === "checkbox") {
//             setRoomForm((prev) => ({
//                 ...prev,
//                 [name]: checked
//             }));
//         } else {
//             // For number inputs, convert empty string to 0
//             if ((name === 'no_of_room' || name === 'no_of_children' || name === 'no_of_adult') && value === '') {
//                 setRoomForm((prev) => ({
//                     ...prev,
//                     [name]: 0
//                 }));
//             } else {
//                 setRoomForm((prev) => ({
//                     ...prev,
//                     [name]: value
//                 }));
//             }
//         }
//     };

//     // Handle Quill change
//     const handleQuillChange = (content) => {
//         setRoomForm((prev) => ({
//             ...prev,
//             long_description: content
//         }));
//     };

//     // Toggle handlers
//     const toggleFeatured = () => {
//         setRoomForm(prev => ({
//             ...prev,
//             is_featured: !prev.is_featured
//         }));
//     };

//     const toggleArchived = () => {
//         setRoomForm(prev => ({
//             ...prev,
//             is_archived: !prev.is_archived
//         }));
//     };

//     // Helper function to get field error - FIXED: Safely check if error exists and is an array
//     const getFieldError = (fieldName) => {
//         const error = validationErrors[fieldName];
//         // Check if error exists, is an array, and has at least one element
//         if (error && Array.isArray(error) && error.length > 0) {
//             return <p className="text-xs text-red-500 mt-1">{error[0]}</p>;
//         }
//         return null;
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
//                 {/* Header - Matching AddCustomerForm */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingRoom ? "Edit Room" : "Add New Room"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={() => {
//                             setShowForm(false);
//                             setEditingRoom(null);
//                         }}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Show validation summary if there are errors - FIXED: Safely check for errors */}
//                 {Object.keys(validationErrors).length > 0 && (
//                     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//                         <p className="text-sm font-medium text-red-800">Please fix the following errors:</p>
//                         <ul className="mt-1 text-xs text-red-600 list-disc list-inside">
//                             {Object.entries(validationErrors).map(([field, errors]) => {
//                                 // Safely get the error message
//                                 const errorMessage = errors && Array.isArray(errors) && errors.length > 0 
//                                     ? errors[0] 
//                                     : typeof errors === 'string' 
//                                         ? errors 
//                                         : 'Invalid value';
//                                 return <li key={field}>{errorMessage}</li>;
//                             })}
//                         </ul>
//                     </div>
//                 )}

//                 {/* Form - Matching AddCustomerForm layout */}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Basic Information - First Row */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Room Name<span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={roomForm.name}
//                                 onChange={handleChange}
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.name ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
//                                 placeholder="Enter room name"
//                                 required
//                                 disabled={submitting}
//                             />
//                             {getFieldError('name')}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Room Type<span className="text-red-500">*</span>
//                             </label>
//                             <select
//                                 name="room_type_id"
//                                 value={roomForm.room_type_id}
//                                 onChange={handleChange}
//                                 required
//                                 disabled={submitting || allRoomTypes.length === 0}
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.room_type_id ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
//                             >
//                                 <option value="">Select Room Type</option>
//                                 {allRoomTypes.length > 0 ? (
//                                     allRoomTypes.map((type) => (
//                                         <option key={type.id} value={type.id}>
//                                             {type.name}
//                                         </option>
//                                     ))
//                                 ) : (
//                                     <option value="" disabled>No room types available</option>
//                                 )}
//                             </select>
//                             {getFieldError('room_type_id')}
//                             {allRoomTypes.length === 0 && (
//                                 <p className="text-xs text-amber-600 mt-1">
//                                     No active room types found. Please create a room type first.
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     {/* Second Row */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Order
//                             </label>
//                             <input
//                                 type="number"
//                                 name="order"
//                                 value={roomForm.order}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                 placeholder="Enter display order"
//                                 disabled={submitting}
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Reference ID
//                             </label>
//                             <input
//                                 type="text"
//                                 name="refrence_id"
//                                 value={roomForm.refrence_id}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                                 placeholder="Enter reference ID"
//                                 disabled={submitting}
//                             />
//                         </div>
//                     </div>

//                     {/* Capacity & Pricing - All in one row */}
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Rooms<span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="number"
//                                 name="no_of_room"
//                                 value={roomForm.no_of_room}
//                                 onChange={handleChange}
//                                 required
//                                 min="0"
//                                 step="1"
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.no_of_room ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
//                                 placeholder="No. of rooms"
//                                 disabled={submitting}
//                             />
//                             {getFieldError('no_of_room')}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Adults<span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="number"
//                                 name="no_of_adult"
//                                 value={roomForm.no_of_adult}
//                                 onChange={handleChange}
//                                 required
//                                 min="0"
//                                 step="1"
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.no_of_adult ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
//                                 placeholder="Max adults"
//                                 disabled={submitting}
//                             />
//                             {getFieldError('no_of_adult')}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Children<span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="number"
//                                 name="no_of_children"
//                                 value={roomForm.no_of_children}
//                                 onChange={handleChange}
//                                 required
//                                 min="0"
//                                 step="1"
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.no_of_children ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
//                                 placeholder="Max children"
//                                 disabled={submitting}
//                             />
//                             {getFieldError('no_of_children')}
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Price ($)<span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="number"
//                                 step="0.01"
//                                 name="price"
//                                 value={roomForm.price}
//                                 onChange={handleChange}
//                                 required
//                                 min="0"
//                                 className={`w-full px-3 py-2 border ${
//                                     validationErrors.price ? 'border-red-500' : 'border-gray-300'
//                                 } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
//                                 placeholder="Enter price"
//                                 disabled={submitting}
//                             />
//                             {getFieldError('price')}
//                         </div>
//                     </div>

//                     {/* Short Description */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Short Description
//                         </label>
//                         <textarea
//                             name="short_description"
//                             value={roomForm.short_description}
//                             onChange={handleChange}
//                             rows="2"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
//                             placeholder="Enter short description"
//                             disabled={submitting}
//                         />
//                     </div>

//                     {/* Long Description with React Quill */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Long Description
//                         </label>
//                         <div className={`quill-wrapper ${validationErrors.long_description ? "quill-error" : ""}`}>
//                             <ReactQuill
//                                 theme="snow"
//                                 value={roomForm.long_description || ""}
//                                 onChange={handleQuillChange}
//                                 modules={quillModules}
//                                 formats={quillFormats}
//                                 className="bg-white"
//                                 style={{ height: "200px", marginBottom: "40px" }}
//                                 readOnly={submitting}
//                             />
//                         </div>
//                         {getFieldError('long_description')}
//                         <style jsx>{`
//                             .quill-wrapper :global(.ql-container) {
//                                 border-bottom-left-radius: 0.5rem;
//                                 border-bottom-right-radius: 0.5rem;
//                                 min-height: 150px;
//                                 font-size: 0.875rem;
//                                 border-color: #e5e7eb;
//                             }
//                             .quill-wrapper :global(.ql-toolbar) {
//                                 border-top-left-radius: 0.5rem;
//                                 border-top-right-radius: 0.5rem;
//                                 background-color: #f9fafb;
//                                 border-color: #e5e7eb;
//                             }
//                             .quill-error :global(.ql-container),
//                             .quill-error :global(.ql-toolbar) {
//                                 border-color: #ef4444;
//                             }
//                         `}</style>
//                     </div>

//                     {/* Images Section */}
//                     <div className="space-y-2">
//                         <label className="flex items-center text-sm font-medium text-gray-700">
//                             <ImageIcon className="mr-2 text-gray-600" size={18} />
//                             Room Images
//                         </label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all duration-300 relative bg-gray-50">
//                             {imagePreviews.length > 0 ? (
//                                 <div className="space-y-4">
//                                     <div className="grid grid-cols-3 gap-4">
//                                         {imagePreviews.map((preview, index) => (
//                                             <div key={index} className="relative group">
//                                                 <img
//                                                     src={preview.url}
//                                                     alt={`Preview ${index + 1}`}
//                                                     className="h-24 w-full object-cover rounded-lg shadow bg-white"
//                                                 />
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeImage(index)}
//                                                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                                                     disabled={submitting}
//                                                 >
//                                                     <X size={14} />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                     <div className="space-y-2">
//                                         <p className="text-sm text-gray-600">
//                                             {imagePreviews.length} image(s) selected
//                                         </p>
//                                         <p className="text-sm text-gray-500">
//                                             Click to add more images
//                                         </p>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-4">
//                                     <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                     <p className="text-lg text-gray-700">
//                                         Click to upload room images
//                                     </p>
//                                     <p className="text-sm text-gray-500">
//                                         Hold Ctrl/Cmd to select multiple files | Max: 2MB per file
//                                     </p>
//                                 </div>
//                             )}
//                             <input
//                                 type="file"
//                                 name="images"
//                                 accept="image/jpeg,image/png,image/jpg,image/webp"
//                                 multiple
//                                 onChange={handleImagesChange}
//                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                 disabled={submitting}
//                             />
//                         </div>
                        
//                         {(validationErrors.images || validationErrors["images.0"] || validationErrors["images.*"]) && (
//                             <p className="text-sm text-red-600">
//                                 {validationErrors.images?.[0] || validationErrors["images.0"]?.[0] || validationErrors["images.*"]?.[0]}
//                             </p>
//                         )}

//                         {editingRoom && editingRoom.images && editingRoom.images.length > 0 && (
//                             <div className="mt-4">
//                                 <p className="text-sm text-gray-500 mb-2">Existing images:</p>
//                                 <div className="flex gap-2 flex-wrap">
//                                     {editingRoom.images.map((img, idx) => (
//                                         <div key={idx} className="relative">
//                                             <img
//                                                 src={`/storage/${img.path}`}
//                                                 alt={img.alt_text || 'Room image'}
//                                                 className="w-16 h-16 object-cover rounded"
//                                                 onError={(e) => {
//                                                     e.target.src = "https://via.placeholder.com/64?text=No+Image";
//                                                 }}
//                                             />
//                                         </div>
//                                     ))}
//                                 </div>
//                                 <p className="text-xs text-blue-500 mt-1">
//                                     Select new images to add more
//                                 </p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Toggle Switches for Featured and Archived */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
//                         {/* Featured Toggle */}
//                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                             <div className="flex items-center space-x-3">
//                                 <Star className="text-gray-600" size={18} />
//                                 <span className="text-sm font-medium text-gray-700">
//                                     Featured Room
//                                 </span>
//                             </div>
//                             <button
//                                 type="button"
//                                 onClick={toggleFeatured}
//                                 disabled={submitting}
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
//                                     roomForm.is_featured
//                                         ? "bg-indigo-600"
//                                         : "bg-gray-300"
//                                 }`}
//                             >
//                                 <span
//                                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                                         roomForm.is_featured
//                                             ? "translate-x-6"
//                                             : "translate-x-1"
//                                     }`}
//                                 />
//                             </button>
//                         </div>

//                         {/* Archived Toggle */}
//                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                             <div className="flex items-center space-x-3">
//                                 <Archive className="text-gray-600" size={18} />
//                                 <span className="text-sm font-medium text-gray-700">
//                                     Archive Room
//                                 </span>
//                             </div>
//                             <button
//                                 type="button"
//                                 onClick={toggleArchived}
//                                 disabled={submitting}
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
//                                     roomForm.is_archived
//                                         ? "bg-indigo-600"
//                                         : "bg-gray-300"
//                                 }`}
//                             >
//                                 <span
//                                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                                         roomForm.is_archived
//                                             ? "translate-x-6"
//                                             : "translate-x-1"
//                                     }`}
//                                 />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Hidden inputs to keep the values in form submission */}
//                     <input
//                         type="hidden"
//                         name="is_featured"
//                         value={roomForm.is_featured ? "1" : "0"}
//                     />
//                     <input
//                         type="hidden"
//                         name="is_archived"
//                         value={roomForm.is_archived ? "1" : "0"}
//                     />

//                     {/* Meta Data */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Meta Data (JSON)
//                         </label>
//                         <textarea
//                             name="meta_data"
//                             value={roomForm.meta_data}
//                             onChange={handleChange}
//                             rows="3"
//                             placeholder='{"key": "value"}'
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
//                             disabled={submitting}
//                         />
//                         <p className="mt-1 text-xs text-gray-500">
//                             Enter valid JSON or leave empty
//                         </p>
//                     </div>

//                     {/* Form Actions - Matching AddCustomerForm */}
//                     <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                         <button
//                             type="button"
//                             onClick={() => {
//                                 setShowForm(false);
//                                 setEditingRoom(null);
//                             }}
//                             className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
//                             disabled={submitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting || allRoomTypes.length === 0}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
//                         >
//                             {submitting ? (
//                                 <>
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                     {editingRoom ? "Updating..." : "Saving..."}
//                                 </>
//                             ) : (
//                                 editingRoom ? "Update Room" : "Add Room"
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddRoomForm;



import axios from "axios";
import { X, Star, Archive, Upload, Image as ImageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
    const [imagePreviews, setImagePreviews] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
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

    // Use Effect for editing - FIXED: Load existing images into previews
    useEffect(() => {
        if (editingRoom) {
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
                meta_data: editingRoom.meta_data || "",
                is_archived: editingRoom.is_archived || false,
                is_featured: editingRoom.is_featured || false,
                room_type_id: editingRoom.room_type_id || "",
                images: [],
                display_image_index: editingRoom.display_image_index || 0
            });
            
            // Load existing images into previews
            if (editingRoom.images && editingRoom.images.length > 0) {
                const existingPreviews = editingRoom.images.map(img => ({
                    url: `/storage/${img.image}`, // Use the correct path with /storage/ prefix
                    isExisting: true,
                    id: img.id,
                    imagePath: img.image // Store the original path for reference
                }));
                setImagePreviews(existingPreviews);
            } else {
                setImagePreviews([]);
            }
            
            setImageFiles([]); // Clear any selected files
        } else {
            resetForm();
        }
    }, [editingRoom]);

    // Reset form function
    const resetForm = () => {
        setRoomForm({
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
        setImagePreviews([]);
        setImageFiles([]);
        setValidationErrors({});
    };

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

        // Validate image sizes before submission
        if (imageFiles.length > 0) {
            const oversizedImages = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
            if (oversizedImages.length > 0) {
                alert(`${oversizedImages.length} image(s) exceed 2MB limit. Please remove them.`);
                return;
            }
        }
        
        const formData = new FormData();
        
        // Check if all required fields are filled (allow 0 as valid value)
        const requiredFields = ['name', 'no_of_room', 'no_of_adult', 'no_of_children', 'price', 'room_type_id'];
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
                if (imageFiles.length > 0) {
                    imageFiles.forEach((file, index) => {
                        formData.append(`images[${index}]`, file);
                    });
                }
            } else if (key !== 'images') {
                if (roomForm[key] !== null && roomForm[key] !== undefined) {
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
            
            // Reset form and close
            resetForm();
            setShowForm(false);
            setEditingRoom(null);
        } catch (error) {
            console.log("Error saving data", error);
            
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

    // Remove image - MODIFIED to handle both new and existing images
    const removeImage = (index) => {
        const previewToRemove = imagePreviews[index];
        
        if (previewToRemove.isExisting) {
            // This is an existing image from the database
            // You might want to add functionality to delete it from the server
            // For now, we'll just remove it from preview
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

    // Handle change for regular inputs
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

    // Helper function to get field error - FIXED: Safely check if error exists and is an array
    const getFieldError = (fieldName) => {
        const error = validationErrors[fieldName];
        // Check if error exists, is an array, and has at least one element
        if (error && Array.isArray(error) && error.length > 0) {
            return <p className="text-xs text-red-500 mt-1">{error[0]}</p>;
        }
        return null;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Header - Matching AddCustomerForm */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingRoom ? "Edit Room" : "Add New Room"}
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

                {/* Show validation summary if there are errors - FIXED: Safely check for errors */}
                {Object.keys(validationErrors).length > 0 && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm font-medium text-red-800">Please fix the following errors:</p>
                        <ul className="mt-1 text-xs text-red-600 list-disc list-inside">
                            {Object.entries(validationErrors).map(([field, errors]) => {
                                // Safely get the error message
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

                {/* Form - Matching AddCustomerForm layout */}
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

                    {/* Images Section - MODIFIED to show both existing and new images */}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
                            disabled={submitting}
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Enter valid JSON or leave empty
                        </p>
                    </div>

                    {/* Form Actions - Matching AddCustomerForm */}
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
                            disabled={submitting || allRoomTypes.length === 0}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    {editingRoom ? "Updating..." : "Saving..."}
                                </>
                            ) : (
                                editingRoom ? "Update Room" : "Add Room"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRoomForm;