// import { X } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AddGalleryForm = ({
//     editingGallery,
//     setShowForm,
//     handleUpdate,
//     setReloadTrigger,
//     setEditingGallery,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [galleryForm, setGalleryForm] = useState({
//         name: "",
//         images: [],
//         is_archived: false,
//         is_featured: false,
//     });
//     const [imagePreviews, setImagePreviews] = useState([]);

//     useEffect(() => {
//         if (editingGallery) {
//             setGalleryForm({
//                 name: editingGallery.name || "",
//                 images: [],
//                 is_archived: Boolean(editingGallery.is_archived),
//                 is_featured: Boolean(editingGallery.is_featured),
//             });
            
//             if (editingGallery.images && editingGallery.images.length > 0) {
//                 const previews = editingGallery.images.map(img => ({
//                     id: img.id,
//                     url: `/storage/${img.path}`,
//                     isExisting: true
//                 }));
//                 setImagePreviews(previews);
//             }
//         } else {
//             resetForm();
//         }
//     }, [editingGallery]);

//     const resetForm = () => {
//         setGalleryForm({
//             name: "",
//             images: [],
//             is_archived: false,
//             is_featured: false,
//         });
//         setImagePreviews([]);
//         setErrors({});
//     };

//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(route("ourgallery.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error creating gallery:", error);
//             if (error.response?.status === 422) {
//                 setErrors(error.response.data.errors || {});
//                 throw new Error('Validation failed');
//             }
//             throw error;
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});
        
//         if (!galleryForm.name.trim()) {
//             setErrors({ name: ['Gallery name is required'] });
//             return;
//         }

//         // For new galleries, require at least one image
//         if (!editingGallery && galleryForm.images.length === 0) {
//             setErrors({ images: ['Please select at least one image'] });
//             return;
//         }

//         const formData = new FormData();
        
//         // Append basic fields
//         formData.append("name", galleryForm.name.trim());
//         formData.append("is_archived", galleryForm.is_archived ? "1" : "0");
//         formData.append("is_featured", galleryForm.is_featured ? "1" : "0");

//         // Append images - IMPORTANT: Use 'images[]' for multiple files
//         if (galleryForm.images && galleryForm.images.length > 0) {
//             galleryForm.images.forEach((image, index) => {
//                 formData.append(`images[]`, image);
//                 formData.append(`alt_text[${index}]`, galleryForm.name);
//             });
//         }

//         // Log form data for debugging
//         console.log('Submitting form data:');
//         for (let pair of formData.entries()) {
//             console.log(pair[0], pair[1]);
//         }

//         try {
//             setSubmitting(true);

//             if (editingGallery) {
//                 // For update, add method spoofing
//                 formData.append('_method', 'PUT');
//                 await handleUpdate(formData, editingGallery.id);
//             } else {
//                 await handleCreate(formData);
//             }

//             // Success - close form and reset
//             resetForm();
//             setShowForm(false);
//             setEditingGallery(null);
            
//         } catch (error) {
//             console.error("Error saving data:", error);
            
//             if (error.response) {
//                 // The request was made and the server responded with a status code
//                 console.error('Error response:', error.response.data);
                
//                 if (error.response.status === 422) {
//                     setErrors(error.response.data.errors || {});
//                     alert('Please check the form for errors.');
//                 } else {
//                     alert(`Server error: ${error.response.data.message || 'Please try again.'}`);
//                 }
//             } else if (error.request) {
//                 // The request was made but no response was received
//                 alert('No response from server. Please check your connection.');
//             } else {
//                 // Something happened in setting up the request
//                 alert('Error: ' + error.message);
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
        
//         // Validate file types and sizes
//         const validFiles = files.filter(file => {
//             const isValidType = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type);
//             const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB
            
//             if (!isValidType) {
//                 alert(`File ${file.name} is not a valid image type. Please use JPG, PNG, or WEBP.`);
//             }
//             if (!isValidSize) {
//                 alert(`File ${file.name} exceeds 2MB limit.`);
//             }
            
//             return isValidType && isValidSize;
//         });

//         if (validFiles.length === 0) return;

//         setGalleryForm((prev) => ({
//             ...prev,
//             images: [...prev.images, ...validFiles],
//         }));

//         // Create preview URLs
//         const newPreviews = validFiles.map((file) => ({
//             url: URL.createObjectURL(file),
//             isExisting: false,
//             file: file
//         }));
//         setImagePreviews((prev) => [...prev, ...newPreviews]);
        
//         // Clear images error if any
//         if (errors.images) {
//             setErrors(prev => ({ ...prev, images: null }));
//         }
//     };

//     const removeImage = (index) => {
//         // Revoke object URL to avoid memory leaks
//         if (imagePreviews[index]?.url && !imagePreviews[index].isExisting) {
//             URL.revokeObjectURL(imagePreviews[index].url);
//         }
        
//         setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//         setGalleryForm((prev) => ({
//             ...prev,
//             images: prev.images.filter((_, i) => i !== index),
//         }));
//     };

//     const handleClose = () => {
//         // Clean up preview URLs
//         imagePreviews.forEach(preview => {
//             if (!preview.isExisting && preview.url) {
//                 URL.revokeObjectURL(preview.url);
//             }
//         });
//         resetForm();
//         setShowForm(false);
//         setEditingGallery(null);
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
//                     <h2 className="text-2xl font-bold">
//                         {editingGallery
//                             ? "Edit Gallery Item"
//                             : "Add New Gallery Item"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Name Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Gallery Name *
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={galleryForm.name}
//                             onChange={(e) => {
//                                 setGalleryForm((prev) => ({
//                                     ...prev,
//                                     name: e.target.value,
//                                 }));
//                                 if (errors.name) {
//                                     setErrors(prev => ({ ...prev, name: null }));
//                                 }
//                             }}
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                                 errors.name ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                             placeholder="Enter gallery name"
//                             required
//                         />
//                         {errors.name && (
//                             <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
//                         )}
//                     </div>

//                     {/* Image Upload */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             {editingGallery ? "Add More Images" : "Images *"}
//                         </label>
//                         <input
//                             type="file"
//                             name="images[]"
//                             onChange={handleImageChange}
//                             accept="image/jpeg,image/png,image/webp,image/jpg"
//                             multiple
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                                 errors.images ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                             Allowed: JPG, JPEG, PNG, WEBP. Max size: 2MB per image
//                         </p>
//                         {errors.images && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {Array.isArray(errors.images) ? errors.images[0] : errors.images}
//                             </p>
//                         )}
//                     </div>

//                     {/* Image Previews */}
//                     {imagePreviews.length > 0 && (
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                 Image Previews
//                             </label>
//                             <div className="grid grid-cols-3 gap-4">
//                                 {imagePreviews.map((preview, index) => (
//                                     <div key={index} className="relative group">
//                                         <img
//                                             src={preview.url}
//                                             alt={`Preview ${index + 1}`}
//                                             className="w-full h-24 object-cover rounded-md border border-gray-200"
//                                         />
//                                         {!preview.isExisting && (
//                                             <button
//                                                 type="button"
//                                                 onClick={() => removeImage(index)}
//                                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition shadow-lg"
//                                                 title="Remove image"
//                                             >
//                                                 <X size={14} />
//                                             </button>
//                                         )}
//                                         {preview.isExisting && (
//                                             <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
//                                                 Existing
//                                             </span>
//                                         )}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* Checkboxes */}
//                     <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
//                         <div className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name="is_featured"
//                                 id="is_featured"
//                                 checked={galleryForm.is_featured}
//                                 onChange={(e) => {
//                                     setGalleryForm((prev) => ({
//                                         ...prev,
//                                         is_featured: e.target.checked,
//                                     }));
//                                 }}
//                                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                             />
//                             <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
//                                 Featured Gallery
//                             </label>
//                         </div>

//                         <div className="flex items-center">
//                             <input
//                                 type="checkbox"
//                                 name="is_archived"
//                                 id="is_archived"
//                                 checked={galleryForm.is_archived}
//                                 onChange={(e) => {
//                                     setGalleryForm((prev) => ({
//                                         ...prev,
//                                         is_archived: e.target.checked,
//                                     }));
//                                 }}
//                                 className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                             />
//                             <label htmlFor="is_archived" className="ml-2 block text-sm text-gray-700">
//                                 Archive Gallery
//                             </label>
//                         </div>
//                     </div>

//                     {/* Submit Buttons */}
//                     <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-white pb-2">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
//                             disabled={submitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
//                         >
//                             {submitting ? (
//                                 <span className="flex items-center justify-center">
//                                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Saving...
//                                 </span>
//                             ) : (
//                                 editingGallery ? "Update Gallery" : "Create Gallery"
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddGalleryForm;


// import { X, Star, Archive, Upload, Image as ImageIcon } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const AddGalleryForm = ({
//     editingGallery,
//     setShowForm,
//     handleUpdate,
//     setReloadTrigger,
//     setEditingGallery,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [galleryForm, setGalleryForm] = useState({
//         name: "",
//         images: [],
//         is_archived: false,
//         is_featured: false,
//     });
//     const [imagePreviews, setImagePreviews] = useState([]);

//     // File size limits in bytes - 2MB max
//     const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

//     useEffect(() => {
//         if (editingGallery) {
//             setGalleryForm({
//                 name: editingGallery.name || "",
//                 images: [],
//                 is_archived: Boolean(editingGallery.is_archived),
//                 is_featured: Boolean(editingGallery.is_featured),
//             });
            
//             if (editingGallery.images && editingGallery.images.length > 0) {
//                 const previews = editingGallery.images.map(img => ({
//                     id: img.id,
//                     url: `/storage/${img.path}`,
//                     isExisting: true
//                 }));
//                 setImagePreviews(previews);
//             }
//         } else {
//             resetForm();
//         }
//     }, [editingGallery]);

//     const resetForm = () => {
//         setGalleryForm({
//             name: "",
//             images: [],
//             is_archived: false,
//             is_featured: false,
//         });
//         setImagePreviews([]);
//         setErrors({});
//     };

//     const handleCreate = async (formData) => {
//         try {
//             const response = await axios.post(route("ourgallery.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.error("Error creating gallery:", error);
//             if (error.response?.status === 422) {
//                 setErrors(error.response.data.errors || {});
//                 throw new Error('Validation failed');
//             }
//             throw error;
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});
        
//         if (!galleryForm.name.trim()) {
//             setErrors({ name: ['Gallery name is required'] });
//             return;
//         }

//         // For new galleries, require at least one image
//         if (!editingGallery && galleryForm.images.length === 0) {
//             setErrors({ images: ['Please select at least one image'] });
//             return;
//         }

//         const formData = new FormData();
        
//         // Append basic fields
//         formData.append("name", galleryForm.name.trim());
//         formData.append("is_archived", galleryForm.is_archived ? "1" : "0");
//         formData.append("is_featured", galleryForm.is_featured ? "1" : "0");

//         // Append images - Use 'images[]' for multiple files
//         if (galleryForm.images && galleryForm.images.length > 0) {
//             galleryForm.images.forEach((image, index) => {
//                 formData.append(`images[]`, image);
//                 formData.append(`alt_text[${index}]`, galleryForm.name);
//             });
//         }

//         // If editing, add method spoofing
//         if (editingGallery) {
//             formData.append('_method', 'PUT');
//         }

//         try {
//             setSubmitting(true);

//             if (editingGallery) {
//                 await handleUpdate(formData, editingGallery.id);
//             } else {
//                 await handleCreate(formData);
//             }

//             // Success - close form and reset
//             resetForm();
//             setShowForm(false);
//             setEditingGallery(null);
            
//         } catch (error) {
//             console.error("Error saving data:", error);
            
//             if (error.response) {
//                 if (error.response.status === 422) {
//                     setErrors(error.response.data.errors || {});
//                     alert('Please check the form for errors.');
//                 } else {
//                     alert(`Server error: ${error.response.data.message || 'Please try again.'}`);
//                 }
//             } else if (error.request) {
//                 alert('No response from server. Please check your connection.');
//             } else {
//                 alert('Error: ' + error.message);
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     const handleImageChange = (e) => {
//         const files = Array.from(e.target.files);
        
//         // Filter valid image files
//         let imageFiles = files.filter(file => {
//             const isValidType = file.type.startsWith('image/');
//             if (!isValidType) {
//                 alert(`File ${file.name} is not a valid image type`);
//             }
//             return isValidType;
//         });

//         if (imageFiles.length === 0) return;

//         // Validate file sizes - 2MB max
//         const oversizedFiles = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
//         if (oversizedFiles.length > 0) {
//             alert(`${oversizedFiles.length} image(s) exceed 2MB limit and were ignored`);
//             imageFiles = imageFiles.filter(file => file.size <= MAX_IMAGE_SIZE);
//         }

//         if (imageFiles.length === 0) return;

//         setGalleryForm((prev) => ({
//             ...prev,
//             images: [...prev.images, ...imageFiles],
//         }));

//         // Create preview URLs
//         imageFiles.forEach((file) => {
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreviews((prev) => [...prev, {
//                     url: reader.result,
//                     isExisting: false,
//                     file: file
//                 }]);
//             };
//             reader.readAsDataURL(file);
//         });
        
//         // Clear images error if any
//         if (errors.images) {
//             setErrors(prev => ({ ...prev, images: null }));
//         }
//     };

//     const removeImage = (index) => {
//         setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//         setGalleryForm((prev) => ({
//             ...prev,
//             images: prev.images.filter((_, i) => i !== index),
//         }));
//     };

//     const removeExistingImage = (index) => {
//         // For existing images, you might want to mark them for deletion
//         // This would require additional logic in your backend
//         setImagePreviews((prev) => prev.filter((_, i) => i !== index));
//     };

//     const handleClose = () => {
//         resetForm();
//         setShowForm(false);
//         setEditingGallery(null);
//     };

//     // Toggle handlers
//     const toggleFeatured = () => {
//         setGalleryForm((prev) => ({
//             ...prev,
//             is_featured: !prev.is_featured,
//         }));
//     };

//     const toggleArchived = () => {
//         setGalleryForm((prev) => ({
//             ...prev,
//             is_archived: !prev.is_archived,
//         }));
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
//                     <h2 className="text-2xl font-bold">
//                         {editingGallery
//                             ? "Edit Gallery Item"
//                             : "Add New Gallery Item"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Name Field */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Gallery Name *
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={galleryForm.name}
//                             onChange={(e) => {
//                                 setGalleryForm((prev) => ({
//                                     ...prev,
//                                     name: e.target.value,
//                                 }));
//                                 if (errors.name) {
//                                     setErrors(prev => ({ ...prev, name: null }));
//                                 }
//                             }}
//                             className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                                 errors.name ? 'border-red-500' : 'border-gray-300'
//                             }`}
//                             placeholder="Enter gallery name"
//                             required
//                         />
//                         {errors.name && (
//                             <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
//                         )}
//                     </div>

//                     {/* Image Upload - New UI matching ActivityForm */}
//                     <div className="space-y-2">
//                         <label className="flex items-center text-lg font-semibold text-gray-700">
//                             <ImageIcon className="mr-3 text-gray-600" size={22} />
//                             Gallery Images {!editingGallery && '*'}
//                         </label>
//                         <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
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
//                                                     onClick={() => preview.isExisting ? removeExistingImage(index) : removeImage(index)}
//                                                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                                                 >
//                                                     <X size={14} />
//                                                 </button>
//                                                 {preview.isExisting && (
//                                                     <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded opacity-75">
//                                                         Existing
//                                                     </span>
//                                                 )}
//                                             </div>
//                                         ))}
//                                     </div>
//                                     <div className="space-y-2">
//                                         <p className="text-sm text-gray-600">
//                                             {imagePreviews.length} image(s) total
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
//                                         Click to upload gallery images
//                                     </p>
//                                     <p className="text-sm text-gray-500">
//                                         Hold Ctrl/Cmd to select multiple files | Max: 2MB per file
//                                     </p>
//                                 </div>
//                             )}
//                             <input
//                                 type="file"
//                                 name="images[]"
//                                 accept="image/jpeg,image/png,image/jpg,image/webp"
//                                 multiple
//                                 onChange={handleImageChange}
//                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                             />
//                         </div>
                        
//                         {(errors.images || errors["images.0"] || errors["images.*"]) && (
//                             <p className="text-sm text-red-600">
//                                 {errors.images?.[0] || errors["images.0"]?.[0] || errors["images.*"]?.[0]}
//                             </p>
//                         )}
//                     </div>

//                     {/* Toggle Switches for Featured and Archived */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
//                         {/* Featured Toggle */}
//                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                             <div className="flex items-center space-x-3">
//                                 <Star className="text-gray-600" size={20} />
//                                 <span className="text-sm font-medium text-gray-700">
//                                     Featured Gallery
//                                 </span>
//                             </div>
//                             <button
//                                 type="button"
//                                 onClick={toggleFeatured}
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
//                                     galleryForm.is_featured
//                                         ? "bg-indigo-600"
//                                         : "bg-gray-300"
//                                 }`}
//                             >
//                                 <span
//                                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                                         galleryForm.is_featured
//                                             ? "translate-x-6"
//                                             : "translate-x-1"
//                                     }`}
//                                 />
//                             </button>
//                         </div>

//                         {/* Archived Toggle */}
//                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                             <div className="flex items-center space-x-3">
//                                 <Archive className="text-gray-600" size={20} />
//                                 <span className="text-sm font-medium text-gray-700">
//                                     Archive Gallery
//                                 </span>
//                             </div>
//                             <button
//                                 type="button"
//                                 onClick={toggleArchived}
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
//                                     galleryForm.is_archived
//                                         ? "bg-indigo-600"
//                                         : "bg-gray-300"
//                                 }`}
//                             >
//                                 <span
//                                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                                         galleryForm.is_archived
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
//                         value={galleryForm.is_featured ? "1" : "0"}
//                     />
//                     <input
//                         type="hidden"
//                         name="is_archived"
//                         value={galleryForm.is_archived ? "1" : "0"}
//                     />

//                     {/* Submit Buttons */}
//                     <div className="flex justify-end gap-3 pt-4 border-t">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition"
//                             disabled={submitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
//                         >
//                             {submitting ? (
//                                 <span className="flex items-center justify-center">
//                                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                                     </svg>
//                                     Saving...
//                                 </span>
//                             ) : (
//                                 editingGallery ? "Update Gallery" : "Create Gallery"
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddGalleryForm;



import { X, Star, Archive, Upload, Image as ImageIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const AddGalleryForm = ({ setShowForm, setReloadTrigger }) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [galleryForm, setGalleryForm] = useState({
        name: "",
        images: [],
        is_archived: false,
        is_featured: false,
    });
    const [imagePreviews, setImagePreviews] = useState([]);

    // File size limits in bytes - 2MB max
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

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

    const resetForm = () => {
        setGalleryForm({
            name: "",
            images: [],
            is_archived: false,
            is_featured: false,
        });
        setImagePreviews([]);
        setErrors({});
    };

    const handleCreate = async (formData) => {
        try {
            const response = await axios.post(route("ourgallery.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data;
        } catch (error) {
            console.error("Error creating gallery:", error);
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
                throw new Error('Validation failed');
            }
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        
        if (!galleryForm.name.trim()) {
            setErrors({ name: ['Gallery name is required'] });
            return;
        }

        if (galleryForm.images.length === 0) {
            setErrors({ images: ['Please select at least one image'] });
            return;
        }

        const formData = new FormData();
        
        formData.append("name", galleryForm.name.trim());
        formData.append("is_archived", galleryForm.is_archived ? "1" : "0");
        formData.append("is_featured", galleryForm.is_featured ? "1" : "0");

        if (galleryForm.images && galleryForm.images.length > 0) {
            galleryForm.images.forEach((image, index) => {
                formData.append(`images[]`, image);
                formData.append(`alt_text[${index}]`, galleryForm.name);
            });
        }

        try {
            setSubmitting(true);
            await handleCreate(formData);

            resetForm();
            setReloadTrigger((prev) => !prev);
            setShowForm(false);
            
        } catch (error) {
            console.error("Error saving data:", error);
            
            if (error.response) {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors || {});
                    alert('Please check the form for errors.');
                } else {
                    alert(`Server error: ${error.response.data.message || 'Please try again.'}`);
                }
            } else if (error.request) {
                alert('No response from server. Please check your connection.');
            } else {
                alert('Error: ' + error.message);
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        let imageFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            if (!isValidType) {
                alert(`File ${file.name} is not a valid image type`);
            }
            return isValidType;
        });

        if (imageFiles.length === 0) return;

        const oversizedFiles = imageFiles.filter(file => file.size > MAX_IMAGE_SIZE);
        if (oversizedFiles.length > 0) {
            alert(`${oversizedFiles.length} image(s) exceed 2MB limit and were ignored`);
            imageFiles = imageFiles.filter(file => file.size <= MAX_IMAGE_SIZE);
        }

        if (imageFiles.length === 0) return;

        setGalleryForm((prev) => ({
            ...prev,
            images: [...prev.images, ...imageFiles],
        }));

        imageFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, {
                    url: reader.result,
                    isExisting: false,
                    file: file
                }]);
            };
            reader.readAsDataURL(file);
        });
        
        if (errors.images) {
            setErrors(prev => ({ ...prev, images: null }));
        }
    };

    const removeImage = (index) => {
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        setGalleryForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleClose = () => {
        resetForm();
        setShowForm(false);
    };

    const toggleFeatured = () => {
        setGalleryForm((prev) => ({
            ...prev,
            is_featured: !prev.is_featured,
        }));
    };

    const toggleArchived = () => {
        setGalleryForm((prev) => ({
            ...prev,
            is_archived: !prev.is_archived,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        Add New Gallery Item
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gallery Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={galleryForm.name}
                            onChange={(e) => {
                                setGalleryForm((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }));
                                if (errors.name) {
                                    setErrors(prev => ({ ...prev, name: null }));
                                }
                            }}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                errors.name ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Enter gallery name"
                            required
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="flex items-center text-lg font-semibold text-gray-700">
                            <ImageIcon className="mr-3 text-gray-600" size={22} />
                            Gallery Images *
                        </label>
                        <div className="border-2 border-dashed border-gray-400 rounded-xl p-6 text-center hover:border-gray-600 transition-all duration-300 relative bg-white">
                            {imagePreviews.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-24 w-full object-cover rounded-lg shadow bg-white"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
                                        Click to upload gallery images
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Hold Ctrl/Cmd to select multiple files | Max: 2MB per file
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="images[]"
                                accept="image/jpeg,image/png,image/jpg,image/webp"
                                multiple
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        
                        {(errors.images || errors["images.0"] || errors["images.*"]) && (
                            <p className="text-sm text-red-600">
                                {errors.images?.[0] || errors["images.0"]?.[0] || errors["images.*"]?.[0]}
                            </p>
                        )}
                    </div>

                    {/* Toggle Switches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {/* Featured Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Star className="text-gray-600" size={20} />
                                <span className="text-sm font-medium text-gray-700">
                                    Featured Gallery
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleFeatured}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    galleryForm.is_featured
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        galleryForm.is_featured
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Archived Toggle */}
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <Archive className="text-gray-600" size={20} />
                                <span className="text-sm font-medium text-gray-700">
                                    Archive Gallery
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleArchived}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    galleryForm.is_archived
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        galleryForm.is_archived
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
                        value={galleryForm.is_featured ? "1" : "0"}
                    />
                    <input
                        type="hidden"
                        name="is_archived"
                        value={galleryForm.is_archived ? "1" : "0"}
                    />

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                "Create Gallery"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddGalleryForm;