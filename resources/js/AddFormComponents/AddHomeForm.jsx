// import axios from "axios";
// import { X, Archive, Upload, Image as ImageIcon, Video } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import AceEditor from "react-ace";

// // Import ace editor modes and themes
// import "ace-builds/src-noconflict/mode-json";
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/ext-language_tools";

// const AddHomeForm = ({
//     editingHome,
//     setEditingHome,
//     setShowForm,
//     handleUpdate,
//     setReloadTrigger,
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [errors, setErrors] = useState({});
//     const [imagePreview, setImagePreview] = useState(null);
//     const [videoPreview, setVideoPreview] = useState(null);
//     const [imageFile, setImageFile] = useState(null);
//     const [videoFile, setVideoFile] = useState(null);
//     const [jsonError, setJsonError] = useState("");
//     const [homeForm, setHomeForm] = useState({
//         image: "",
//         video: "",
//         is_archived: false,
//         metadata_json: "",
//     });

//     // Add useEffect to lock body scroll when form mounts
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
//     }, []);

//     // File size limits in bytes - 2MB max for images, 10MB for videos
//     const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
//     const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

//     // Use Effect for editing
//     useEffect(() => {
//         if (editingHome) {
//             setHomeForm({
//                 image: null,
//                 video: editingHome.video || "",
//                 is_archived: editingHome.is_archived || false,
//                 metadata_json: editingHome.metadata_json || "",
//             });
            
//             // Reset file states
//             setImageFile(null);
//             setVideoFile(null);
            
//             // Set existing image preview
//             if (editingHome.image) {
//                 setImagePreview(`/storage/${editingHome.image}`);
//             }
//             if (editingHome.video) {
//                 setVideoPreview(`/storage/${editingHome.video}`);
//             }
//         } else {
//             setHomeForm({
//                 image: "",
//                 video: "",
//                 is_archived: false,
//                 metadata_json: "",
//             });
//             setImagePreview(null);
//             setVideoPreview(null);
//             setImageFile(null);
//             setVideoFile(null);
//         }
//         setErrors({});
//         setJsonError("");
//     }, [editingHome]);

//     // Handle Close
//     const handleClose = () => {
//         setShowForm(false);
//         setEditingHome(null);
//         setHomeForm({
//             image: "",
//             video: "",
//             is_archived: false,
//             metadata_json: "",
//         });
//         setImagePreview(null);
//         setVideoPreview(null);
//         setImageFile(null);
//         setVideoFile(null);
//         setErrors({});
//         setJsonError("");
//     };

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
//             if (error.response) {
//                 if (error.response.status === 422) {
//                     // Validation errors
//                     setErrors(error.response.data.errors || {});
//                 }
//                 throw error;
//             }
//         }
//     };

//     // Validate JSON
//     const validateJSON = (jsonString) => {
//         if (!jsonString || jsonString.trim() === "") {
//             setJsonError("");
//             return true;
//         }
        
//         try {
//             JSON.parse(jsonString);
//             setJsonError("");
//             return true;
//         } catch (error) {
//             setJsonError("Invalid JSON format");
//             return false;
//         }
//     };

//     // Handle JSON change from Ace Editor
//     const handleJsonChange = (value) => {
//         setHomeForm((prev) => ({
//             ...prev,
//             metadata_json: value,
//         }));
//         validateJSON(value);
//     };

//     // Handle Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setErrors({});

//         // Validate JSON before submission
//         if (!validateJSON(homeForm.metadata_json)) {
//             return;
//         }

//         // Validate image size if a new image is selected
//         if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
//             alert("Image exceeds 2MB limit. Please choose a smaller image.");
//             return;
//         }

//         // Validate video size if a new video is selected
//         if (videoFile && videoFile.size > MAX_VIDEO_SIZE) {
//             alert("Video exceeds 10MB limit. Please choose a smaller video.");
//             return;
//         }

//         const formData = new FormData();
        
//         // Append all form data
//         if (imageFile) {
//             formData.append("image", imageFile);
//         }
        
//         if (videoFile) {
//             formData.append("video", videoFile);
//         }
        
//         formData.append("is_archived", homeForm.is_archived ? "1" : "0");
        
//         if (homeForm.metadata_json) {
//             formData.append("metadata_json", homeForm.metadata_json);
//         }

//         // If editing, add _method field for PUT
//         if (editingHome) {
//             formData.append("_method", "PUT");
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
            
//             handleClose();
//         } catch (error) {
//             console.log("Error saving data", error);
//             if (error.response?.data?.message) {
//                 alert(error.response.data.message);
//             }
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle image change
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Check if it's an image
//             if (!file.type.startsWith("image/")) {
//                 alert("Please select an image file");
//                 return;
//             }

//             // Check file size - 2MB max
//             if (file.size > MAX_IMAGE_SIZE) {
//                 alert("Image exceeds 2MB limit. Please choose a smaller image.");
//                 return;
//             }

//             setImageFile(file);
//             setHomeForm(prev => ({
//                 ...prev,
//                 image: file
//             }));

//             // Create preview
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setImagePreview(reader.result);
//             };
//             reader.readAsDataURL(file);

//             // Clear image errors
//             setErrors(prev => ({ ...prev, image: null }));
//         }
//     };

//     // Remove image
//     const removeImage = () => {
//         setImageFile(null);
//         setImagePreview(null);
//         setHomeForm(prev => ({
//             ...prev,
//             image: null
//         }));
//     };

//     // Handle video change
//     const handleVideoChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Check if it's a video
//             if (!file.type.startsWith("video/")) {
//                 alert("Please select a video file");
//                 return;
//             }

//             // Check file size - 10MB max
//             if (file.size > MAX_VIDEO_SIZE) {
//                 alert("Video exceeds 10MB limit. Please choose a smaller video.");
//                 return;
//             }

//             setVideoFile(file);
//             setHomeForm(prev => ({
//                 ...prev,
//                 video: file
//             }));

//             // Create preview
//             const reader = new FileReader();
//             reader.onloadend = () => {
//                 setVideoPreview(reader.result);
//             };
//             reader.readAsDataURL(file);

//             // Clear video errors
//             setErrors(prev => ({ ...prev, video: null }));
//         }
//     };

//     // Remove video
//     const removeVideo = () => {
//         setVideoFile(null);
//         setVideoPreview(null);
//         setHomeForm(prev => ({
//             ...prev,
//             video: null
//         }));
//     };

//     // Toggle archived
//     const toggleArchived = () => {
//         setHomeForm((prev) => ({
//             ...prev,
//             is_archived: !prev.is_archived,
//         }));
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//             <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
//                 {/* Header - Matching AddBlogForm */}
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-gray-800">
//                         {editingHome ? "Edit Home Item" : "Add New Home Item"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 {/* Form - Matching AddBlogForm layout */}
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Image Upload */}
//                     <div className="space-y-2">
//                         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//                             <ImageIcon className="mr-2 text-gray-600" size={18} />
//                             Image {!editingHome && <span className="text-red-500 ml-1">*</span>}
//                         </label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all duration-300 relative bg-gray-50">
//                             {imagePreview ? (
//                                 <div className="space-y-4">
//                                     <div className="relative group inline-block">
//                                         <img
//                                             src={imagePreview}
//                                             alt="Preview"
//                                             className="h-48 w-full object-cover rounded-lg shadow bg-white"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={removeImage}
//                                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                                             disabled={submitting}
//                                         >
//                                             <X size={14} />
//                                         </button>
//                                     </div>
//                                     <div className="space-y-2">
//                                         <p className="text-sm text-gray-600">
//                                             1 image selected
//                                         </p>
//                                         <p className="text-sm text-gray-500">
//                                             Click to change image
//                                         </p>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-4">
//                                     <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                     <p className="text-lg text-gray-700">
//                                         Click to upload image
//                                     </p>
//                                     <p className="text-sm text-gray-500">
//                                         Max: 2MB (JPEG, PNG, JPG, GIF, WEBP)
//                                     </p>
//                                 </div>
//                             )}
//                             <input
//                                 type="file"
//                                 name="image"
//                                 accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
//                                 onChange={handleImageChange}
//                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                 disabled={submitting}
//                             />
//                         </div>
                        
//                         {errors.image && (
//                             <p className="text-sm text-red-600">{errors.image[0]}</p>
//                         )}

//                         {editingHome && editingHome.image && !imagePreview && (
//                             <div className="mt-4">
//                                 <p className="text-sm text-gray-500 mb-2">Current image:</p>
//                                 <img 
//                                     src={`/storage/${editingHome.image}`} 
//                                     alt="Current" 
//                                     className="w-20 h-20 object-cover rounded-lg border border-gray-200"
//                                     onError={(e) => {
//                                         e.target.src = "https://via.placeholder.com/80?text=No+Image";
//                                     }}
//                                 />
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     Upload a new image to replace
//                                 </p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Video Upload */}
//                     <div className="space-y-2">
//                         <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
//                             <Video className="mr-2 text-gray-600" size={18} />
//                             Video
//                         </label>
//                         <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all duration-300 relative bg-gray-50">
//                             {videoPreview ? (
//                                 <div className="space-y-4">
//                                     <div className="relative group">
//                                         <video 
//                                             src={videoPreview} 
//                                             controls 
//                                             className="h-48 w-full object-cover rounded-lg border bg-white"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={removeVideo}
//                                             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                                             disabled={submitting}
//                                         >
//                                             <X size={14} />
//                                         </button>
//                                     </div>
//                                     <div className="space-y-2">
//                                         <p className="text-sm text-gray-600">
//                                             1 video selected
//                                         </p>
//                                         <p className="text-sm text-gray-500">
//                                             Click to change video
//                                         </p>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-4">
//                                     <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                                     <p className="text-lg text-gray-700">
//                                         Click to upload video
//                                     </p>
//                                     <p className="text-sm text-gray-500">
//                                         Max: 10MB (MP4, MOV, AVI, WEBM)
//                                     </p>
//                                 </div>
//                             )}
//                             <input
//                                 type="file"
//                                 name="video"
//                                 accept="video/*"
//                                 onChange={handleVideoChange}
//                                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                 disabled={submitting}
//                             />
//                         </div>
                        
//                         {errors.video && (
//                             <p className="text-sm text-red-600">{errors.video[0]}</p>
//                         )}

//                         {editingHome && editingHome.video && !videoPreview && (
//                             <div className="mt-4">
//                                 <p className="text-sm text-gray-500 mb-2">Current video:</p>
//                                 <video 
//                                     src={`/storage/${editingHome.video}`} 
//                                     controls 
//                                     className="w-40 h-24 object-cover rounded-lg border border-gray-200"
//                                 />
//                                 <p className="text-sm text-gray-500 mt-1">
//                                     Upload a new video to replace
//                                 </p>
//                             </div>
//                         )}
//                     </div>

//                     {/* Metadata JSON with Ace Editor */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Metadata JSON
//                         </label>
//                         <div className={`border rounded-lg overflow-hidden font-mono ${
//                             jsonError ? 'border-red-500' : 'border-gray-300'
//                         }`}>
//                             <AceEditor
//                                 mode="json"
//                                 theme="github"
//                                 onChange={handleJsonChange}
//                                 value={homeForm.metadata_json}
//                                 name="metadata_json"
//                                 editorProps={{ $blockScrolling: true }}
//                                 setOptions={{
//                                     showLineNumbers: true,
//                                     tabSize: 2,
//                                     fontSize: 14,
//                                     showGutter: true,
//                                     highlightActiveLine: true,
//                                 }}
//                                 width="100%"
//                                 height="200px"
//                                 className="rounded-lg"
//                             />
//                         </div>
//                         {jsonError && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {jsonError}
//                             </p>
//                         )}
//                         {errors.metadata_json && (
//                             <p className="mt-1 text-sm text-red-600">{errors.metadata_json[0]}</p>
//                         )}
//                         <p className="mt-1 text-xs text-gray-500">
//                             Enter valid JSON format. Example: {"{}"}
//                         </p>
//                     </div>

//                     {/* Toggle Switch for Archived */}
//                     <div className="pt-2">
//                         <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
//                             <div className="flex items-center space-x-3">
//                                 <Archive className="text-gray-600" size={20} />
//                                 <span className="text-sm font-medium text-gray-700">
//                                     Archive Home
//                                 </span>
//                             </div>
//                             <button
//                                 type="button"
//                                 onClick={toggleArchived}
//                                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
//                                     homeForm.is_archived
//                                         ? "bg-indigo-600"
//                                         : "bg-gray-300"
//                                 }`}
//                                 disabled={submitting}
//                             >
//                                 <span
//                                     className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                                         homeForm.is_archived
//                                             ? "translate-x-6"
//                                             : "translate-x-1"
//                                     }`}
//                                 />
//                             </button>
//                         </div>
//                     </div>

//                     {/* Hidden input to keep the value in form submission */}
//                     <input
//                         type="hidden"
//                         name="is_archived"
//                         value={homeForm.is_archived ? "1" : "0"}
//                     />

//                     {/* Form Actions - Matching AddBlogForm */}
//                     <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
//                             disabled={submitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
//                             disabled={submitting || jsonError !== ""}
//                         >
//                             {submitting ? (
//                                 <>
//                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                                     {editingHome ? "Updating..." : "Saving..."}
//                                 </>
//                             ) : (
//                                 editingHome ? "Update Home" : "Add Home"
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddHomeForm;



import axios from "axios";
import { X, Archive, Upload, Image as ImageIcon, Video, Code, Loader } from "lucide-react";
import React, { useEffect, useState } from "react";
import AceEditor from "react-ace";

// Import ace editor modes and themes
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const AddHomeForm = ({
    editingHome,
    setEditingHome,
    setShowForm,
    handleUpdate,
    setReloadTrigger,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [jsonError, setJsonError] = useState("");
    const [metaDataValid, setMetaDataValid] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showProgress, setShowProgress] = useState(false);
    const [homeForm, setHomeForm] = useState({
        image: "",
        video: "",
        is_archived: false,
        metadata_json: "",
    });

    // Add useEffect to lock body scroll when form mounts
    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
        };
    }, []);

    // File size limits in bytes - 2MB max for images, 50MB for videos
    const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
    const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

    // Use Effect for editing
    useEffect(() => {
        if (editingHome) {
            setHomeForm({
                image: null,
                video: editingHome.video || "",
                is_archived: editingHome.is_archived || false,
                metadata_json: editingHome.metadata_json || "",
            });
            
            // Validate existing metadata_json
            if (editingHome.metadata_json) {
                validateJSON(editingHome.metadata_json);
            }
            
            // Reset file states
            setImageFile(null);
            setVideoFile(null);
            
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
            setImageFile(null);
            setVideoFile(null);
            setMetaDataValid(true);
        }
        setErrors({});
        setJsonError("");
        setUploadProgress(0);
        setShowProgress(false);
    }, [editingHome]);

    // Handle Close
    const handleClose = () => {
        setShowForm(false);
        setEditingHome(null);
        setHomeForm({
            image: "",
            video: "",
            is_archived: false,
            metadata_json: "",
        });
        setImagePreview(null);
        setVideoPreview(null);
        setImageFile(null);
        setVideoFile(null);
        setErrors({});
        setJsonError("");
        setMetaDataValid(true);
        setUploadProgress(0);
        setShowProgress(false);
    };

    // Handle Create Home
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourhome.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percentCompleted);
                    }
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating home", error);
            if (error.response) {
                if (error.response.status === 422) {
                    // Validation errors
                    setErrors(error.response.data.errors || {});
                }
                throw error;
            }
        }
    };

    // Validate JSON
    const validateJSON = (jsonString) => {
        if (!jsonString || jsonString.trim() === "") {
            setJsonError("");
            setMetaDataValid(true);
            return true;
        }
        
        try {
            JSON.parse(jsonString);
            setJsonError("");
            setMetaDataValid(true);
            return true;
        } catch (error) {
            setJsonError("Invalid JSON format");
            setMetaDataValid(false);
            return false;
        }
    };

    // Handle JSON change from Ace Editor
    const handleJsonChange = (value) => {
        setHomeForm((prev) => ({
            ...prev,
            metadata_json: value,
        }));
        validateJSON(value);
    };

    // Clear JSON
    const clearJson = () => {
        setHomeForm((prev) => ({
            ...prev,
            metadata_json: "",
        }));
        setJsonError("");
        setMetaDataValid(true);
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        // Validate JSON before submission
        if (!validateJSON(homeForm.metadata_json)) {
            alert("Please fix the JSON format in Metadata JSON field");
            return;
        }

        // Validate image size if a new image is selected
        if (imageFile && imageFile.size > MAX_IMAGE_SIZE) {
            alert("Image exceeds 2MB limit. Please choose a smaller image.");
            return;
        }

        // Validate video size if a new video is selected
        if (videoFile && videoFile.size > MAX_VIDEO_SIZE) {
            alert("Video exceeds 50MB limit. Please choose a smaller video.");
            return;
        }

        const formData = new FormData();
        
        // Append all form data
        if (imageFile) {
            formData.append("image", imageFile);
        }
        
        if (videoFile) {
            formData.append("video", videoFile);
        }
        
        formData.append("is_archived", homeForm.is_archived ? "1" : "0");
        
        if (homeForm.metadata_json) {
            formData.append("metadata_json", homeForm.metadata_json);
        }

        // If editing, add _method field for PUT
        if (editingHome) {
            formData.append("_method", "PUT");
        }

        try {
            setSubmitting(true);
            setShowProgress(true);
            setUploadProgress(0);

            if (editingHome) {
                // Editing existing home
                await handleUpdate(formData, editingHome.id);
            } else {
                // Creating new home
                await handleCreate(formData);
            }
            
            handleClose();
        } catch (error) {
            console.log("Error saving data", error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            }
        } finally {
            setSubmitting(false);
            setShowProgress(false);
            setUploadProgress(0);
        }
    };

    // Handle image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if it's an image
            if (!file.type.startsWith("image/")) {
                alert("Please select an image file");
                return;
            }

            // Check file size - 2MB max
            if (file.size > MAX_IMAGE_SIZE) {
                alert("Image exceeds 2MB limit. Please choose a smaller image.");
                return;
            }

            setImageFile(file);
            setHomeForm(prev => ({
                ...prev,
                image: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear image errors
            setErrors(prev => ({ ...prev, image: null }));
        }
    };

    // Remove image
    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setHomeForm(prev => ({
            ...prev,
            image: null
        }));
    };

    // Handle video change
    const handleVideoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check if it's a video
            if (!file.type.startsWith("video/")) {
                alert("Please select a video file");
                return;
            }

            // Check file size - 50MB max
            if (file.size > MAX_VIDEO_SIZE) {
                alert("Video exceeds 50MB limit. Please choose a smaller video.");
                return;
            }

            setVideoFile(file);
            setHomeForm(prev => ({
                ...prev,
                video: file
            }));

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setVideoPreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear video errors
            setErrors(prev => ({ ...prev, video: null }));
        }
    };

    // Remove video
    const removeVideo = () => {
        setVideoFile(null);
        setVideoPreview(null);
        setHomeForm(prev => ({
            ...prev,
            video: null
        }));
    };

    // Toggle archived
    const toggleArchived = () => {
        setHomeForm((prev) => ({
            ...prev,
            is_archived: !prev.is_archived,
        }));
    };

    // Circular progress component
    const CircularProgress = ({ progress, size = 40, strokeWidth = 3 }) => {
        const radius = (size - strokeWidth) / 2;
        const circumference = radius * 2 * Math.PI;
        const offset = circumference - (progress / 100) * circumference;

        return (
            <div className="relative inline-flex items-center justify-center">
                <svg width={size} height={size} className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth={strokeWidth}
                    />
                    {/* Progress circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className="transition-all duration-300 ease-out"
                    />
                </svg>
                <span className="absolute text-xs font-medium text-indigo-600">
                    {progress}%
                </span>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                {/* Header - Matching AddBlogForm */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {editingHome ? "Edit Home Item" : "Add New Home Item"}
                    </h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form - Matching AddBlogForm layout */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <ImageIcon className="mr-2 text-gray-600" size={18} />
                            Image {!editingHome && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all duration-300 relative bg-gray-50">
                            {imagePreview ? (
                                <div className="space-y-4">
                                    <div className="relative group inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-48 w-full object-cover rounded-lg shadow bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            disabled={submitting}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            1 image selected
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Click to change image
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-lg text-gray-700">
                                        Click to upload image
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Max: 2MB (JPEG, PNG, JPG, GIF, WEBP)
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="image"
                                accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                onChange={handleImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={submitting}
                            />
                        </div>
                        
                        {errors.image && (
                            <p className="text-sm text-red-600">{errors.image[0]}</p>
                        )}

                        {editingHome && editingHome.image && !imagePreview && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Current image:</p>
                                <img 
                                    src={`/storage/${editingHome.image}`} 
                                    alt="Current" 
                                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/80?text=No+Image";
                                    }}
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Upload a new image to replace
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Video Upload */}
                    <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                            <Video className="mr-2 text-gray-600" size={18} />
                            Video
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-all duration-300 relative bg-gray-50">
                            {videoPreview ? (
                                <div className="space-y-4">
                                    <div className="relative group">
                                        <video 
                                            src={videoPreview} 
                                            controls 
                                            className="h-48 w-full object-cover rounded-lg border bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={removeVideo}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            disabled={submitting}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            1 video selected
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Click to change video
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <p className="text-lg text-gray-700">
                                        Click to upload video
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Max: 50MB (MP4, MOV, AVI, WEBM)
                                    </p>
                                </div>
                            )}
                            <input
                                type="file"
                                name="video"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                disabled={submitting}
                            />
                        </div>
                        
                        {errors.video && (
                            <p className="text-sm text-red-600">{errors.video[0]}</p>
                        )}

                        {editingHome && editingHome.video && !videoPreview && (
                            <div className="mt-4">
                                <p className="text-sm text-gray-500 mb-2">Current video:</p>
                                <video 
                                    src={`/storage/${editingHome.video}`} 
                                    controls 
                                    className="w-40 h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Upload a new video to replace
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Enhanced Metadata JSON with Ace Editor - Updated to match AddActivityForm */}
                    <div className="space-y-3">
                        {/* Header with improved design */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="p-1.5 bg-indigo-50 rounded-lg">
                                    <Code className="text-indigo-600" size={18} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Metadata JSON
                                    </label>
                                    <p className="text-xs text-gray-500">
                                        Additional data for SEO, settings, etc.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Editor Controls - Only Clear button */}
                            <div className="flex items-center space-x-2">
                                {/* Clear Button */}
                                {homeForm.metadata_json && (
                                    <button
                                        type="button"
                                        onClick={clearJson}
                                        className="text-xs bg-red-50 text-red-600 px-2 py-1.5 rounded-md hover:bg-red-100 transition-colors"
                                        disabled={submitting}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Ace Editor */}
                        <div className={`border rounded-lg overflow-hidden transition-all ${
                            !metaDataValid 
                                ? 'border-red-500 shadow-sm shadow-red-100' 
                                : homeForm.metadata_json 
                                    ? 'border-green-500 shadow-sm shadow-green-100' 
                                    : 'border-gray-300 hover:border-indigo-300'
                        }`}>
                            <AceEditor
                                mode="json"
                                theme="github"
                                onChange={handleJsonChange}
                                value={homeForm.metadata_json}
                                name="metadata_json_editor"
                                editorProps={{ $blockScrolling: true }}
                                setOptions={{
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                    showLineNumbers: true,
                                    showGutter: true,
                                    highlightActiveLine: true,
                                    tabSize: 2,
                                    useWorker: false,
                                }}
                                fontSize={14}
                                width="100%"
                                height="220px"
                                readOnly={submitting}
                                className="rounded-lg"
                            />
                        </div>
                        
                        {/* Status Bar */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                            <div className="flex items-center space-x-3">
                                {/* Validation Status */}
                                {homeForm.metadata_json && homeForm.metadata_json.trim() !== "" ? (
                                    <>
                                        {metaDataValid ? (
                                            <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs font-medium">Valid JSON</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs font-medium">Invalid JSON</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                        <span className="text-xs font-medium">Empty</span>
                                    </div>
                                )}
                                
                                {/* Character/Line Count */}
                                {homeForm.metadata_json && (
                                    <span className="text-xs text-gray-500">
                                        {homeForm.metadata_json.split('\n').length} lines • {homeForm.metadata_json.length} chars
                                    </span>
                                )}
                            </div>
                            
                            {/* Error Message */}
                            {!metaDataValid && jsonError && (
                                <span className="text-xs text-red-600 truncate max-w-xs" title={jsonError}>
                                    Error: {jsonError}
                                </span>
                            )}
                        </div>
                        
                        {errors.metadata_json && (
                            <p className="text-sm text-red-600">
                                {errors.metadata_json[0]}
                            </p>
                        )}
                    </div>

                    {/* Toggle Switch for Archived */}
                    <div className="pt-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Archive className="text-gray-600" size={20} />
                                <span className="text-sm font-medium text-gray-700">
                                    Archive Home
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleArchived}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    homeForm.is_archived
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                                disabled={submitting}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        homeForm.is_archived
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Hidden input to keep the value in form submission */}
                    <input
                        type="hidden"
                        name="is_archived"
                        value={homeForm.is_archived ? "1" : "0"}
                    />

                    {/* Form Actions - Matching AddBlogForm */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        
                        {/* Circular Progress Indicator - Shown when uploading */}
                        {showProgress && (
                            <div className="flex items-center mr-2">
                                <CircularProgress progress={uploadProgress} size={36} strokeWidth={3} />
                            </div>
                        )}
                        
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            disabled={submitting || jsonError !== ""}
                        >
                            {submitting ? (
                                <>
                                    {!showProgress && (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    )}
                                    {editingHome ? "Updating..." : "Saving..."}
                                </>
                            ) : (
                                editingHome ? "Update Home" : "Add Home"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHomeForm;
