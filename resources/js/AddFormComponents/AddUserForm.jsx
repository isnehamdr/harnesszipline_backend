// import axios from "axios";
// import { X, Eye, EyeOff } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddUserForm = ({
//     editingUser,
//     setEditingUser,
//     handleUpdate,
//     setReloadTrigger,
//     setShowForm
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [userForm, setUserForm] = useState({
//         name: "",
//         email: "",
//         image: null,
//         phone_number: "",
//         password: "",
//         password_confirmation: "",
//         role: "",
//     });
//     const [imagePreview, setImagePreview] = useState(null);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [passwordError, setPasswordError] = useState("");

//     // Use Effect
//     useEffect(() => {
//         if (editingUser) {
//             setUserForm({
//                 name: editingUser.name || "",
//                 email: editingUser.email || "",
//                 image: null,
//                 phone_number: editingUser.phone_number || "",
//                 password: "", // Don't populate password for security
//                 password_confirmation: "", // Don't populate confirmation
//                 role: editingUser.role || "",
//             });
//             // Set image preview if exists
//             if (editingUser.image) {
//                 setImagePreview(`/storage/${editingUser.image}`);
//             }
//         } else {
//             setUserForm({
//                 name: "",
//                 email: "",
//                 image: null,
//                 phone_number: "",
//                 password: "",
//                 password_confirmation: "",
//                 role: "",
//             });
//             setImagePreview(null);
//         }
//         // Reset password visibility and errors when editing user changes
//         setShowPassword(false);
//         setShowConfirmPassword(false);
//         setPasswordError("");
//     }, [editingUser]);

//     // Handle Create User
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourusers.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating user", error);
//             throw error;
//         }
//     };

//     // Validate passwords
//     const validatePasswords = () => {
//         if (userForm.password || userForm.password_confirmation) {
//             if (userForm.password !== userForm.password_confirmation) {
//                 setPasswordError("Passwords do not match");
//                 return false;
//             }
//             if (userForm.password.length < 8) {
//                 setPasswordError("Password must be at least 8 characters long");
//                 return false;
//             }
//         } else if (!editingUser && !userForm.password) {
//             setPasswordError("Password is required for new users");
//             return false;
//         }
//         setPasswordError("");
//         return true;
//     };

//     // Handle Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Validate required fields
//         if (!userForm.name || !userForm.email) {
//             alert("Name and Email are required");
//             return;
//         }

//         // Validate passwords
//         if (!validatePasswords()) {
//             return;
//         }

//         const formData = new FormData();
        
//         // Append all form data
//         Object.keys(userForm).forEach(key => {
//             if (userForm[key] !== null && userForm[key] !== "") {
//                 formData.append(key, userForm[key]);
//             }
//         });

//         // Remove password_confirmation from form data as it might not be needed in backend
//         formData.delete('password_confirmation');

//         try {
//             setSubmitting(true);

//             if (editingUser) {
//                 // Editing existing user
//                 await handleUpdate(formData, editingUser.id);
//             } else {
//                 // Creating new user
//                 await handleCreate(formData);
//             }

//             // Reset form
//             setUserForm({
//                 name: "",
//                 email: "",
//                 image: null,
//                 phone_number: "",
//                 password: "",
//                 password_confirmation: "",
//                 role: "",
//             });
//             setImagePreview(null);
//             setShowForm(false);
//             setEditingUser(null);
//             setShowPassword(false);
//             setShowConfirmPassword(false);
//         } catch (error) {
//             console.log("Error saving data", error);
//             alert("Error saving user. Please try again.");
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle change for image and other fields
//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
        
//         if (type === "file") {
//             const file = files[0];
//             setUserForm((prev) => ({
//                 ...prev,
//                 [name]: file,
//             }));
            
//             // Create preview URL
//             if (file) {
//                 const reader = new FileReader();
//                 reader.onloadend = () => {
//                     setImagePreview(reader.result);
//                 };
//                 reader.readAsDataURL(file);
//             }
//         } else {
//             setUserForm((prev) => ({
//                 ...prev,
//                 [name]: value,
//             }));
//         }
        
//         // Clear password error when user types in password fields
//         if (name === "password" || name === "password_confirmation") {
//             setPasswordError("");
//         }
//     };

//     const handleClose = () => {
//         setShowForm(false);
//         setEditingUser(null);
//         setImagePreview(null);
//         setShowPassword(false);
//         setShowConfirmPassword(false);
//         setPasswordError("");
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const toggleConfirmPasswordVisibility = () => {
//         setShowConfirmPassword(!showConfirmPassword);
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
//                     <h2 className="text-2xl font-bold">
//                         {editingUser ? "Edit User" : "Add New User"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition"
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     {/* Image Upload */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                             Profile Image
//                         </label>
//                         <div className="flex items-center space-x-4">
//                             {imagePreview && (
//                                 <img
//                                     src={imagePreview}
//                                     alt="Preview"
//                                     className="h-16 w-16 rounded-full object-cover"
//                                 />
//                             )}
//                             <input
//                                 type="file"
//                                 name="image"
//                                 accept="image/*"
//                                 onChange={handleChange}
//                                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                             />
//                         </div>
//                     </div>

//                     {/* Name */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Name *
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={userForm.name}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     {/* Email */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Email *
//                         </label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={userForm.email}
//                             onChange={handleChange}
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     {/* Phone Number */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Phone Number
//                         </label>
//                         <input
//                             type="tel"
//                             name="phone_number"
//                             value={userForm.phone_number}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         />
//                     </div>

//                     {/* Password with Eye Button */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Password {!editingUser && '*'}
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 name="password"
//                                 value={userForm.password}
//                                 onChange={handleChange}
//                                 required={!editingUser}
//                                 placeholder={editingUser ? "Leave blank to keep current password" : "Enter password"}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={togglePasswordVisibility}
//                                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
//                             >
//                                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                             </button>
//                         </div>
//                     </div>

//                     {/* Confirm Password with Eye Button */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Confirm Password {!editingUser && '*'}
//                         </label>
//                         <div className="relative">
//                             <input
//                                 type={showConfirmPassword ? "text" : "password"}
//                                 name="password_confirmation"
//                                 value={userForm.password_confirmation}
//                                 onChange={handleChange}
//                                 required={!editingUser}
//                                 placeholder="Confirm password"
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={toggleConfirmPasswordVisibility}
//                                 className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
//                             >
//                                 {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                             </button>
//                         </div>
//                         {/* Password Error Message */}
//                         {passwordError && (
//                             <p className="mt-1 text-sm text-red-600">
//                                 {passwordError}
//                             </p>
//                         )}
//                     </div>

//                     {/* Role */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Role
//                         </label>
//                         <select
//                             name="role"
//                             value={userForm.role}
//                             onChange={handleChange}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                         >
//                             <option value="">Select Role</option>
//                             <option value="admin">Admin</option>
//                             <option value="user">User</option>
//                             <option value="manager">Manager</option>
//                         </select>
//                     </div>

//                     {/* Submit Buttons */}
//                     <div className="flex justify-end space-x-3 pt-4 border-t">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             disabled={submitting}
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
//                         >
//                             {submitting ? "Saving..." : (editingUser ? "Update User" : "Create User")}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddUserForm;


// import axios from "axios";
// import { X, Eye, EyeOff, Camera } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const AddUserForm = ({
//     editingUser,
//     setEditingUser,
//     handleUpdate,
//     setReloadTrigger,
//     setShowForm
// }) => {
//     const [submitting, setSubmitting] = useState(false);
//     const [userForm, setUserForm] = useState({
//         name: "",
//         email: "",
//         image: null,
//         phone_number: "",
//         password: "",
//         password_confirmation: "",
//         role: "",
//     });
//     const [imagePreview, setImagePreview] = useState(null);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [passwordError, setPasswordError] = useState("");

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
            
//             // Clean up object URLs to prevent memory leaks
//             if (imagePreview && imagePreview.startsWith("blob:")) {
//                 URL.revokeObjectURL(imagePreview);
//             }
//         };
//     }, []);

//     // Clean up object URLs when imagePreview changes
//     useEffect(() => {
//         return () => {
//             if (imagePreview && imagePreview.startsWith("blob:")) {
//                 URL.revokeObjectURL(imagePreview);
//             }
//         };
//     }, [imagePreview]);

//     // Use Effect
//     useEffect(() => {
//         if (editingUser) {
//             setUserForm({
//                 name: editingUser.name || "",
//                 email: editingUser.email || "",
//                 image: null,
//                 phone_number: editingUser.phone_number || "",
//                 password: "", // Don't populate password for security
//                 password_confirmation: "", // Don't populate confirmation
//                 role: editingUser.role || "",
//             });
//             // Set image preview if exists
//             if (editingUser.image) {
//                 setImagePreview(`/storage/${editingUser.image}`);
//             }
//         } else {
//             setUserForm({
//                 name: "",
//                 email: "",
//                 image: null,
//                 phone_number: "",
//                 password: "",
//                 password_confirmation: "",
//                 role: "",
//             });
//             setImagePreview(null);
//         }
//         // Reset password visibility and errors when editing user changes
//         setShowPassword(false);
//         setShowConfirmPassword(false);
//         setPasswordError("");
//     }, [editingUser]);

//     // Handle Create User
//     const handleCreate = async (formData) => {
//         try {
//             await axios.post(route("ourusers.store"), formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log("Error creating user", error);
//             throw error;
//         }
//     };

//     // Validate passwords
//     const validatePasswords = () => {
//         if (userForm.password || userForm.password_confirmation) {
//             if (userForm.password !== userForm.password_confirmation) {
//                 setPasswordError("Passwords do not match");
//                 return false;
//             }
//             if (userForm.password.length < 6) {
//                 setPasswordError("Password must be at least 6 characters long");
//                 return false;
//             }
//         } else if (!editingUser && !userForm.password) {
//             setPasswordError("Password is required for new users");
//             return false;
//         }
//         setPasswordError("");
//         return true;
//     };

//     // Handle Submit
//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         // Validate required fields
//         if (!userForm.name.trim() || !userForm.email.trim()) {
//             alert("Name and Email are required");
//             return;
//         }

//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(userForm.email)) {
//             alert("Please enter a valid email address");
//             return;
//         }

//         // Validate passwords
//         if (!validatePasswords()) {
//             return;
//         }

//         const formData = new FormData();
        
//         // Append all form data
//         Object.keys(userForm).forEach(key => {
//             if (userForm[key] !== null && userForm[key] !== "") {
//                 formData.append(key, userForm[key]);
//             }
//         });

//         // Remove password_confirmation from form data as it might not be needed in backend
//         formData.delete('password_confirmation');

//         try {
//             setSubmitting(true);

//             if (editingUser) {
//                 // Add method spoofing for PUT request if needed
//                 formData.append('_method', 'PUT');
//                 await handleUpdate(formData, editingUser.id);
//             } else {
//                 // Creating new user
//                 await handleCreate(formData);
//             }

//             // Reset form
//             setUserForm({
//                 name: "",
//                 email: "",
//                 image: null,
//                 phone_number: "",
//                 password: "",
//                 password_confirmation: "",
//                 role: "",
//             });
//             setImagePreview(null);
//             setShowForm(false);
//             setEditingUser(null);
//             setShowPassword(false);
//             setShowConfirmPassword(false);
//         } catch (error) {
//             console.log("Error saving data", error);
            
//             let errorMessage = 'Error saving user. Please try again.';
//             if (error.response) {
//                 if (error.response.data && error.response.data.message) {
//                     errorMessage = error.response.data.message;
//                 } else if (error.response.status === 422) {
//                     errorMessage = 'Validation error. Please check your input.';
//                 } else if (error.response.status === 500) {
//                     errorMessage = 'Server error. Please try again later.';
//                 }
//             }
//             alert(errorMessage);
//         } finally {
//             setSubmitting(false);
//         }
//     };

//     // Handle change for text fields
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setUserForm((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
        
//         // Clear password error when user types in password fields
//         if (name === "password" || name === "password_confirmation") {
//             setPasswordError("");
//         }
//     };

//     // Handle image selection
//     const handleImageChange = (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             // Clean up previous object URL if it exists
//             if (imagePreview && imagePreview.startsWith("blob:")) {
//                 URL.revokeObjectURL(imagePreview);
//             }

//             setUserForm((prev) => ({
//                 ...prev,
//                 image: file,
//             }));
            
//             const previewUrl = URL.createObjectURL(file);
//             setImagePreview(previewUrl);
//         }
//     };

//     const handleClose = () => {
//         // Clean up image preview URL
//         if (imagePreview && imagePreview.startsWith("blob:")) {
//             URL.revokeObjectURL(imagePreview);
//         }
        
//         setShowForm(false);
//         setEditingUser(null);
//         setImagePreview(null);
//         setShowPassword(false);
//         setShowConfirmPassword(false);
//         setPasswordError("");
//     };

//     const togglePasswordVisibility = () => {
//         setShowPassword(!showPassword);
//     };

//     const toggleConfirmPasswordVisibility = () => {
//         setShowConfirmPassword(!showConfirmPassword);
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//             <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
//                 <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
//                     <h2 className="text-2xl font-bold">
//                         {editingUser ? "Edit User" : "Add New User"}
//                     </h2>
//                     <button
//                         type="button"
//                         onClick={handleClose}
//                         className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//                         disabled={submitting}
//                     >
//                         <X size={24} />
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Profile Image Upload - Updated to match second component */}
//                     <div className="flex flex-col items-center">
//                         <div className="relative mb-4">
//                             <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
//                                 {imagePreview ? (
//                                     <img
//                                         src={imagePreview}
//                                         alt="Profile"
//                                         className="w-full h-full object-cover"
//                                     />
//                                 ) : (
//                                     <div className="w-full h-full flex items-center justify-center bg-gray-100">
//                                         <div className="text-gray-400 text-center">
//                                             <Camera className="w-12 h-12 mx-auto mb-2" />
//                                             <span className="text-xs block">Add Photo</span>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                             <label
//                                 htmlFor="image-upload"
//                                 className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-lg"
//                             >
//                                 <Camera className="w-5 h-5" />
//                             </label>
//                             <input
//                                 id="image-upload"
//                                 type="file"
//                                 name="image"
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="hidden"
//                                 disabled={submitting}
//                             />
//                         </div>
//                         <p className="text-sm text-gray-500">
//                             Click the camera icon to upload a profile picture
//                         </p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         {/* Name */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Name <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="text"
//                                 name="name"
//                                 value={userForm.name}
//                                 onChange={handleChange}
//                                 required
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 disabled={submitting}
//                             />
//                         </div>

//                         {/* Email */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Email <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                                 type="email"
//                                 name="email"
//                                 value={userForm.email}
//                                 onChange={handleChange}
//                                 required
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 disabled={submitting}
//                             />
//                         </div>

//                         {/* Phone Number */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Phone Number
//                             </label>
//                             <input
//                                 type="tel"
//                                 name="phone_number"
//                                 value={userForm.phone_number}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 disabled={submitting}
//                             />
//                         </div>

//                         {/* Role */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Role <span className="text-red-500">*</span>
//                             </label>
//                             <select
//                                 name="role"
//                                 value={userForm.role}
//                                 onChange={handleChange}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                 disabled={submitting}
//                                 required
//                             >
//                                 <option value="">Select Role</option>
//                                 <option value="admin">Admin</option>
//                                 <option value="user">User</option>
//                                 <option value="manager">Manager</option>
//                             </select>
//                         </div>

//                         {/* Password with Eye Button */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Password {!editingUser && <span className="text-red-500">*</span>}
//                                 {editingUser && <span className="text-xs text-gray-500 ml-1">(Leave blank to keep current)</span>}
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     name="password"
//                                     value={userForm.password}
//                                     onChange={handleChange}
//                                     required={!editingUser}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
//                                     disabled={submitting}
//                                     autoComplete="new-password"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={togglePasswordVisibility}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                                     disabled={submitting}
//                                 >
//                                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Confirm Password with Eye Button */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                                 Confirm Password {!editingUser && <span className="text-red-500">*</span>}
//                             </label>
//                             <div className="relative">
//                                 <input
//                                     type={showConfirmPassword ? "text" : "password"}
//                                     name="password_confirmation"
//                                     value={userForm.password_confirmation}
//                                     onChange={handleChange}
//                                     required={!editingUser}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
//                                     disabled={submitting}
//                                     autoComplete="new-password"
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={toggleConfirmPasswordVisibility}
//                                     className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
//                                     disabled={submitting}
//                                 >
//                                     {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                                 </button>
//                             </div>
//                             {/* Password Error Message */}
//                             {passwordError && (
//                                 <p className="mt-1 text-sm text-red-600">
//                                     {passwordError}
//                                 </p>
//                             )}
//                         </div>
//                     </div>

//                     {/* Form Actions - Updated to match second component style */}
//                     <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//                         <button
//                             type="button"
//                             onClick={handleClose}
//                             className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                             disabled={submitting}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                             disabled={submitting}
//                         >
//                             {submitting ? (
//                                 <span className="flex items-center">
//                                     <svg
//                                         className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                     >
//                                         <circle
//                                             className="opacity-25"
//                                             cx="12"
//                                             cy="12"
//                                             r="10"
//                                             stroke="currentColor"
//                                             strokeWidth="4"
//                                         />
//                                         <path
//                                             className="opacity-75"
//                                             fill="currentColor"
//                                             d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
//                                         />
//                                     </svg>
//                                     {editingUser ? "Updating..." : "Creating..."}
//                                 </span>
//                             ) : (
//                                 <span>{editingUser ? "Update User" : "Create User"}</span>
//                             )}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddUserForm;


import axios from "axios";
import { X, Eye, EyeOff, Camera } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddUserForm = ({ setReloadTrigger, setShowForm }) => {
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

    // Lock body scroll when form mounts
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
            
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, []);

    // Clean up object URLs when imagePreview changes
    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    // Validate passwords
    const validatePasswords = () => {
        if (userForm.password !== userForm.password_confirmation) {
            setPasswordError("Passwords do not match");
            return false;
        }
        if (userForm.password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            return false;
        }
        setPasswordError("");
        return true;
    };

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

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!userForm.name.trim() || !userForm.email.trim()) {
            alert("Name and Email are required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userForm.email)) {
            alert("Please enter a valid email address");
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

        // Remove password_confirmation from form data
        formData.delete('password_confirmation');

        try {
            setSubmitting(true);
            await handleCreate(formData);

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
            setShowPassword(false);
            setShowConfirmPassword(false);
        } catch (error) {
            console.log("Error saving data", error);
            
            let errorMessage = 'Error creating user. Please try again.';
            if (error.response) {
                if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.status === 422) {
                    errorMessage = 'Validation error. Please check your input.';
                }
            }
            alert(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Handle change for text fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserForm((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        if (name === "password" || name === "password_confirmation") {
            setPasswordError("");
        }
    };

    // Handle image selection
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (imagePreview && imagePreview.startsWith("blob:")) {
                URL.revokeObjectURL(imagePreview);
            }

            setUserForm((prev) => ({
                ...prev,
                image: file,
            }));
            
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleClose = () => {
        if (imagePreview && imagePreview.startsWith("blob:")) {
            URL.revokeObjectURL(imagePreview);
        }
        
        setShowForm(false);
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
                    <h2 className="text-2xl font-bold">Add New User</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        disabled={submitting}
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Image Upload */}
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex items-center justify-center">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <div className="text-gray-400 text-center">
                                            <Camera className="w-12 h-12 mx-auto mb-2" />
                                            <span className="text-xs block">Add Photo</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <label
                                htmlFor="image-upload"
                                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 cursor-pointer transition-colors shadow-lg"
                            >
                                <Camera className="w-5 h-5" />
                            </label>
                            <input
                                id="image-upload"
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={submitting}
                            />
                        </div>
                        <p className="text-sm text-gray-500">
                            Click the camera icon to upload a profile picture
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={userForm.name}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={submitting}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={userForm.email}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={submitting}
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={submitting}
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="role"
                                value={userForm.role}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={submitting}
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>

                        {/* Password with Eye Button */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={userForm.password}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                    disabled={submitting}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    disabled={submitting}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password with Eye Button */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    value={userForm.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                                    disabled={submitting}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                                    disabled={submitting}
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
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <span className="flex items-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                <span>Create User</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddUserForm;