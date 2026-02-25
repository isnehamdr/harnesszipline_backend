// import React, { useState, useEffect } from "react";
// import AddActivityForm from "@/AddFormComponents/AddActivityForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Plus, Edit, Trash2, Star } from "lucide-react";

// const Activity = () => {
//     const [allActivity, setAllActivity] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingActivity, setEditingActivity] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the activity data
//     useEffect(() => {
//         const fetchActivity = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ouractivity.index"));
//                 console.log("API Response:", response.data); // Debug log

//                 // Handle different response structures
//                 if (response.data && response.data.data) {
//                     // Check if data is paginated (has data property)
//                     if (response.data.data.data) {
//                         setAllActivity(response.data.data.data || []);
//                     } else {
//                         setAllActivity(response.data.data || []);
//                     }
//                 } else if (Array.isArray(response.data)) {
//                     setAllActivity(response.data);
//                 } else {
//                     setAllActivity([]);
//                 }
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 setAllActivity([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchActivity();
//     }, [reloadTrigger]);

//     // For delete the activity
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this activity?")) {
//             return;
//         }

//         try {
//             const response = await axios.delete(
//                 route("ouractivity.destroy", { id: id }),
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (activity) => {
//         setEditingActivity(activity);
//         setShowForm(true);
//     };

//     // Handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ouractivity.update", { id }),
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
//             console.log("Error updating activity", error);
//             throw error;
//         }
//     };

//     // Format date like "28 Jul 2025"
//     const formatDate = (dateString) => {
//         if (!dateString) return "";
//         const date = new Date(dateString);
//         return date.toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//         });
//     };

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="p-6">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                             Activities Page
//                         </h1>
//                         <button
//                             onClick={() => {
//                                 setEditingActivity(null);
//                                 setShowForm(true);
//                             }}
//                             className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
//                         >
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>

//                     {/* Loading State */}
//                     {loading && (
//                         <div className="flex justify-center items-center py-12">
//                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//                         </div>
//                     )}

//                     {/* Activity List */}
//                     {!loading && (
//                         <>
//                             {allActivity.length > 0 ? (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                     {allActivity.map((activity) => (
//                                         <div
//                                             key={activity.id}
//                                             className="bg-[#fdf8ee] rounded-2xl overflow-hidden shadow-sm border border-[#f0e8d0] relative"
//                                         >
//                                             {/* Featured Ribbon - Left Side */}
//                                             {activity.is_featured === 1 && (
//                                                 <>
//                                                     {/* Desktop Ribbon */}
//                                                     <div className="absolute top-0 left-0 z-10 hidden md:block">
//                                                         <div className="relative">
//                                                             <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
//                                                                 <div className="absolute transform -rotate-45 bg-yellow-400 text-yellow-900 text-center font-bold py-1 left-[-35px] top-[19px] w-[150px] shadow-md flex items-center justify-center gap-1">
//                                                                     <Star size={14} className="fill-yellow-900" />
//                                                                     <span className="text-xs">FEATURED</span>
//                                                                     <Star size={14} className="fill-yellow-900" />
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
                                                    
//                                                     {/* Mobile Badge */}
//                                                     <div className="absolute top-2 left-2 z-10 md:hidden">
//                                                         <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-md flex items-center gap-1">
//                                                             <Star size={12} className="fill-yellow-900" />
//                                                             Featured
//                                                         </span>
//                                                     </div>
//                                                 </>
//                                             )}

//                                             {/* Action Buttons - Top right (position unchanged) */}
//                                             <div className="absolute top-2 right-2 flex gap-2 z-20">
//                                                 <button
//                                                     onClick={() =>
//                                                         handleEdit(activity)
//                                                     }
//                                                     className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
//                                                     title="Edit"
//                                                 >
//                                                     <Edit size={16} />
//                                                 </button>
//                                                 <button
//                                                     onClick={() =>
//                                                         handleDelete(
//                                                             activity.id,
//                                                         )
//                                                     }
//                                                     className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
//                                                     title="Delete"
//                                                 >
//                                                     <Trash2 size={16} />
//                                                 </button>
//                                             </div>

//                                             {/* Display first image if exists */}
//                                             <div className="w-full h-52 overflow-hidden">
//                                                 {activity.images &&
//                                                 activity.images.length > 0 ? (
//                                                     <img
//                                                         src={`/storage/${activity.images[0].path}`}
//                                                         alt={activity.name}
//                                                         className="w-full h-full object-cover"
//                                                         onError={(e) => {
//                                                             e.target.src =
//                                                                 "https://via.placeholder.com/300x200?text=No+Image";
//                                                         }}
//                                                     />
//                                                 ) : (
//                                                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                                                         <span className="text-gray-400">
//                                                             No image
//                                                         </span>
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             {/* Content */}
//                                             <div className="p-4">
//                                                 {/* Date */}
//                                                 <p className="text-sm text-gray-500 mb-2">
//                                                     {formatDate(
//                                                         activity.created_at,
//                                                     )}
//                                                 </p>

//                                                 {/* Name */}
//                                                 <h3 className="text-lg font-extrabold uppercase text-[#c9882a] leading-snug mb-2 tracking-wide">
//                                                     {activity.name}
//                                                 </h3>

//                                                 {/* Short Description */}
//                                                 <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-2">
//                                                     {activity.short_description}
//                                                 </p>

//                                                 {/* Price */}
//                                                 <p className="text-indigo-600 font-bold text-lg">
//                                                     ${activity.base_price}
//                                                 </p>

//                                                 {/* Archived Badge - only shows if archived */}
//                                                 {activity.is_archived === 1 && (
//                                                     <div className="mt-2">
//                                                         <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
//                                                             Archived
//                                                         </span>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             ) : (
//                                 <div className="text-center py-12 bg-gray-50 rounded-lg">
//                                     <p className="text-gray-500 text-lg">
//                                         No activities found
//                                     </p>
//                                     <p className="text-gray-400 mt-2">
//                                         Click the "Create" button to add your
//                                         first activity
//                                     </p>
//                                 </div>
//                             )}
//                         </>
//                     )}

//                     {/* Pagination - if your API returns paginated data */}
//                     {allActivity?.links && (
//                         <div className="mt-6 flex justify-center">
//                             <div className="flex gap-2">
//                                 {allActivity.links.map((link, index) => (
//                                     <button
//                                         key={index}
//                                         onClick={() => {
//                                             if (link.url && !link.active) {
//                                                 window.location.href = link.url;
//                                             }
//                                         }}
//                                         dangerouslySetInnerHTML={{
//                                             __html: link.label,
//                                         }}
//                                         className={`px-3 py-1 rounded ${
//                                             link.active
//                                                 ? "bg-indigo-600 text-white"
//                                                 : link.url
//                                                   ? "bg-gray-200 hover:bg-gray-300"
//                                                   : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                         }`}
//                                         disabled={!link.url}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {showForm && (
//                         <AddActivityForm
//                             editingActivity={editingActivity}
//                             setShowForm={setShowForm}
//                             setEditingActivity={setEditingActivity}
//                             handleUpdate={handleUpdate}
//                             setReloadTrigger={setReloadTrigger}
//                         />
//                     )}
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default Activity;


import React, { useState, useEffect } from "react";
import AddActivityForm from "@/AddFormComponents/AddActivityForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import EditActivityForm from "@/EditFormComponents/EditActivityForm";

const Activity = () => {
    const [allActivity, setAllActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // For fetching the activity data
    useEffect(() => {
        const fetchActivity = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ouractivity.index"));
                console.log("API Response:", response.data); // Debug log

                // Handle different response structures
                if (response.data && response.data.data) {
                    // Check if data is paginated (has data property)
                    if (response.data.data.data) {
                        setAllActivity(response.data.data.data || []);
                    } else {
                        setAllActivity(response.data.data || []);
                    }
                } else if (Array.isArray(response.data)) {
                    setAllActivity(response.data);
                } else {
                    setAllActivity([]);
                }
            } catch (error) {
                console.error("fetching error ", error);
                setAllActivity([]);
            } finally {
                setLoading(false);
            }
        };

        fetchActivity();
    }, [reloadTrigger]);

    // For delete the activity
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this activity?")) {
            return;
        }

        try {
            const response = await axios.delete(
                route("ouractivity.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handle edit - open edit form
    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setShowEditForm(true);
    };

    // Format date like "28 Jul 2025"
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Activities Page
                        </h1>
                        <button
                            onClick={() => {
                                setEditingActivity(null);
                                setShowAddForm(true);
                            }}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    )}

                    {/* Activity List */}
                    {!loading && (
                        <>
                            {allActivity.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {allActivity.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="bg-[#fdf8ee] rounded-2xl overflow-hidden shadow-sm border border-[#f0e8d0] relative"
                                        >
                                            {/* Featured Ribbon - Left Side */}
                                            {activity.is_featured === 1 && (
                                                <>
                                                    {/* Desktop Ribbon */}
                                                    <div className="absolute top-0 left-0 z-10 hidden md:block">
                                                        <div className="relative">
                                                            <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
                                                                <div className="absolute transform -rotate-45 bg-yellow-400 text-yellow-900 text-center font-bold py-1 left-[-35px] top-[19px] w-[150px] shadow-md flex items-center justify-center gap-1">
                                                                    <Star size={14} className="fill-yellow-900" />
                                                                    <span className="text-xs">FEATURED</span>
                                                                    <Star size={14} className="fill-yellow-900" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Mobile Badge */}
                                                    <div className="absolute top-2 left-2 z-10 md:hidden">
                                                        <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                                                            <Star size={12} className="fill-yellow-900" />
                                                            Featured
                                                        </span>
                                                    </div>
                                                </>
                                            )}

                                            {/* Action Buttons - Top right */}
                                            <div className="absolute top-2 right-2 flex gap-2 z-20">
                                                <button
                                                    onClick={() =>
                                                        handleEdit(activity)
                                                    }
                                                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(
                                                            activity.id,
                                                        )
                                                    }
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Display first image if exists */}
                                            <div className="w-full h-52 overflow-hidden">
                                                {activity.images &&
                                                activity.images.length > 0 ? (
                                                    <img
                                                        src={`/storage/${activity.images[0].path}`}
                                                        alt={activity.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src =
                                                                "https://via.placeholder.com/300x200?text=No+Image";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <span className="text-gray-400">
                                                            No image
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                {/* Date */}
                                                <p className="text-sm text-gray-500 mb-2">
                                                    {formatDate(
                                                        activity.created_at,
                                                    )}
                                                </p>

                                                {/* Name */}
                                                <h3 className="text-lg font-extrabold uppercase text-[#c9882a] leading-snug mb-2 tracking-wide">
                                                    {activity.name}
                                                </h3>

                                                {/* Short Description */}
                                                <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-2">
                                                    {activity.short_description}
                                                </p>

                                                {/* Price */}
                                                <p className="text-indigo-600 font-bold text-lg">
                                                    ${activity.base_price}
                                                </p>

                                                {/* Archived Badge */}
                                                {activity.is_archived === 1 && (
                                                    <div className="mt-2">
                                                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                                            Archived
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 text-lg">
                                        No activities found
                                    </p>
                                    <p className="text-gray-400 mt-2">
                                        Click the "Create" button to add your
                                        first activity
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Pagination - if your API returns paginated data */}
                    {allActivity?.links && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex gap-2">
                                {allActivity.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (link.url && !link.active) {
                                                window.location.href = link.url;
                                            }
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? "bg-indigo-600 text-white"
                                                : link.url
                                                  ? "bg-gray-200 hover:bg-gray-300"
                                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                        disabled={!link.url}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add Form */}
                    {showAddForm && (
                        <AddActivityForm
                            setShowForm={setShowAddForm}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}

                    {/* Edit Form */}
                    {showEditForm && (
                        <EditActivityForm
                            editingActivity={editingActivity}
                            setShowForm={setShowEditForm}
                            setEditingActivity={setEditingActivity}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default Activity;