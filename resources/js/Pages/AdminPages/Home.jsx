// import AddHomeForm from "@/AddFormComponents/AddHomeForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Edit, Plus, Trash2, Image as ImageIcon, Video, X, Star } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Home = () => {
//     const [allHome, setAllHome] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingHome, setEditingHome] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [selectedVideo, setSelectedVideo] = useState(null); // For video popup

//     // For fetching the home data
//     useEffect(() => {
//         const fetchHome = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourhome.index"));
//                 console.log("API Response:", response.data);

//                 // Handle different response structures
//                 if (response.data && response.data.data) {
//                     // Check if data is paginated (has data property)
//                     if (response.data.data.data) {
//                         setAllHome(response.data.data.data || []);
//                     } else {
//                         setAllHome(response.data.data || []);
//                     }
//                 } else if (Array.isArray(response.data)) {
//                     setAllHome(response.data);
//                 } else {
//                     setAllHome([]);
//                 }
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 setAllHome([]);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchHome();
//     }, [reloadTrigger]);

//     // For delete the home
//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this item?")) {
//             return;
//         }

//         try {
//             const response = await axios.delete(
//                 route("ourhome.destroy", { id: id })
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handle edit
//     const handleEdit = (home) => {
//         setEditingHome(home);
//         setShowForm(true);
//     };

//     // Handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourhome.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 }
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating home", error);
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

//     // Get video URL
//     const getVideoUrl = (videoPath) => {
//         if (!videoPath) return null;
//         // Check if it's already a full URL
//         if (videoPath.startsWith('http')) {
//             return videoPath;
//         }
//         return `/storage/${videoPath}`;
//     };

//     // Check if video is YouTube URL
//     const isYouTubeUrl = (url) => {
//         return url && (url.includes('youtube.com') || url.includes('youtu.be'));
//     };

//     // Extract YouTube video ID
//     const getYouTubeEmbedUrl = (url) => {
//         if (!url) return null;
        
//         // Handle different YouTube URL formats
//         let videoId = '';
//         if (url.includes('youtube.com/watch?v=')) {
//             videoId = url.split('v=')[1]?.split('&')[0];
//         } else if (url.includes('youtu.be/')) {
//             videoId = url.split('youtu.be/')[1]?.split('?')[0];
//         } else if (url.includes('youtube.com/embed/')) {
//             videoId = url.split('embed/')[1]?.split('?')[0];
//         }
        
//         return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
//     };

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="p-6">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                             Home Page
//                         </h1>
//                         <button
//                             onClick={() => {
//                                 setEditingHome(null);
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

//                     {/* Home Items Grid */}
//                     {!loading && (
//                         <>
//                             {allHome.length > 0 ? (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                     {allHome.map((home) => (
//                                         <div
//                                             key={home.id}
//                                             className="bg-[#fdf8ee] rounded-2xl overflow-hidden shadow-sm border border-[#f0e8d0] relative"
//                                         >
//                                             {/* Featured Ribbon - Left Side (if you have featured field) */}
//                                             {home.is_featured === 1 && (
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

//                                             {/* Action Buttons - Top right */}
//                                             <div className="absolute top-2 right-2 flex gap-2 z-20">
//                                                 <button
//                                                     onClick={() => handleEdit(home)}
//                                                     className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
//                                                     title="Edit"
//                                                 >
//                                                     <Edit size={16} />
//                                                 </button>
//                                                 <button
//                                                     onClick={() => handleDelete(home.id)}
//                                                     className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
//                                                     title="Delete"
//                                                 >
//                                                     <Trash2 size={16} />
//                                                 </button>
//                                             </div>

//                                             {/* Image Section */}
//                                             <div className="w-full h-52 overflow-hidden relative">
//                                                 {home.image ? (
//                                                     <img
//                                                         src={`/storage/${home.image}`}
//                                                         alt="Home"
//                                                         className="w-full h-full object-cover"
//                                                         onError={(e) => {
//                                                             e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
//                                                         }}
//                                                     />
//                                                 ) : (
//                                                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                                                         <ImageIcon className="w-12 h-12 text-gray-400" />
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             {/* Content */}
//                                             <div className="p-4">
//                                                 {/* Date */}
//                                                 <p className="text-sm text-gray-500 mb-2">
//                                                     {formatDate(home.created_at)}
//                                                 </p>

//                                                 {/* Title/Name if you have one */}
//                                                 {home.title && (
//                                                     <h3 className="text-lg font-extrabold uppercase text-[#c9882a] leading-snug mb-2 tracking-wide">
//                                                         {home.title}
//                                                     </h3>
//                                                 )}

//                                                 {/* Description if you have one */}
//                                                 {home.description && (
//                                                     <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
//                                                         {home.description}
//                                                     </p>
//                                                 )}

//                                                 {/* Video Section */}
//                                                 <div className="mb-3">
//                                                     {home.video ? (
//                                                         <button
//                                                             onClick={() => setSelectedVideo(home.video)}
//                                                             className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
//                                                         >
//                                                             <Video size={18} />
//                                                             <span className="text-sm font-medium">Watch Video</span>
//                                                         </button>
//                                                     ) : (
//                                                         <div className="flex items-center gap-2 text-gray-400">
//                                                             <Video size={18} />
//                                                             <span className="text-sm">No video</span>
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 {/* Archived Badge - only shows if archived */}
//                                                 {home.is_archived === 1 && (
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
//                                         No home items found
//                                     </p>
//                                     <p className="text-gray-400 mt-2">
//                                         Click the "Create" button to add your first home item
//                                     </p>
//                                 </div>
//                             )}
//                         </>
//                     )}

//                     {/* Pagination - if your API returns paginated data */}
//                     {allHome?.links && (
//                         <div className="mt-6 flex justify-center">
//                             <div className="flex gap-2">
//                                 {allHome.links.map((link, index) => (
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

//                     {/* Video Popup Modal - Fixed version */}
//                     {selectedVideo && (
//                         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                             <div className="relative bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
//                                 {/* Header with title and close button */}
//                                 <div className="flex justify-between items-center p-4 border-b">
//                                     <h3 className="text-lg font-semibold text-gray-900">Video Player</h3>
//                                     <button
//                                         onClick={() => setSelectedVideo(null)}
//                                         className="text-gray-500 hover:text-gray-700 transition-colors"
//                                     >
//                                         <X size={24} />
//                                     </button>
//                                 </div>

//                                 {/* Video Player */}
//                                 <div className="p-4">
//                                     {isYouTubeUrl(selectedVideo) ? (
//                                         <div className="relative pb-[56.25%] h-0">
//                                             <iframe
//                                                 src={getYouTubeEmbedUrl(selectedVideo)}
//                                                 title="Video Player"
//                                                 className="absolute top-0 left-0 w-full h-full rounded-lg"
//                                                 frameBorder="0"
//                                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                                                 allowFullScreen
//                                             ></iframe>
//                                         </div>
//                                     ) : (
//                                         <video
//                                             src={getVideoUrl(selectedVideo)}
//                                             controls
//                                             className="w-full max-h-[70vh] rounded-lg"
//                                             autoPlay
//                                         >
//                                             Your browser does not support the video tag.
//                                         </video>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Form Modal */}
//                     {showForm && (
//                         <AddHomeForm
//                             editingHome={editingHome}
//                             setEditingHome={setEditingHome}
//                             setShowForm={setShowForm}
//                             handleUpdate={handleUpdate}
//                             setReloadTrigger={setReloadTrigger}
//                         />
//                     )}
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default Home;



import AddHomeForm from "@/AddFormComponents/AddHomeForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditHomeForm from "@/EditFormComponents/EditHomeForm";
import axios from "axios";
import { Edit, Plus, Trash2, Image as ImageIcon, Video, X, Star } from "lucide-react";
import React, { useEffect, useState } from "react";

const Home = () => {
    const [allHome, setAllHome] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingHome, setEditingHome] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null); // For video popup
    const imgurl = import.meta.env.VITE_IMAGE_PATH;


    // For fetching the home data
    useEffect(() => {
        const fetchHome = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourhome.index"));
                console.log("API Response:", response.data);

                // Handle different response structures
                if (response.data && response.data.data) {
                    // Check if data is paginated (has data property)
                    if (response.data.data.data) {
                        setAllHome(response.data.data.data || []);
                    } else {
                        setAllHome(response.data.data || []);
                    }
                } else if (Array.isArray(response.data)) {
                    setAllHome(response.data);
                } else {
                    setAllHome([]);
                }
            } catch (error) {
                console.error("fetching error ", error);
                setAllHome([]);
            } finally {
                setLoading(false);
            }
        };

        fetchHome();
    }, [reloadTrigger]);

    // For delete the home
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) {
            return;
        }

        try {
            const response = await axios.delete(
                route("ourhome.destroy", { id: id })
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handle edit
    const handleEdit = (home) => {
        setEditingHome(home);
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

    // Get video URL
    const getVideoUrl = (videoPath) => {
        if (!videoPath) return null;
        // Check if it's already a full URL
        if (videoPath.startsWith('http')) {
            return videoPath;
        }
        return `${imgurl}/${videoPath}`;
    };

    // Check if video is YouTube URL
    const isYouTubeUrl = (url) => {
        return url && (url.includes('youtube.com') || url.includes('youtu.be'));
    };

    // Extract YouTube video ID
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        
        // Handle different YouTube URL formats
        let videoId = '';
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('v=')[1]?.split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1]?.split('?')[0];
        }
        
        return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    };

    return (
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Home Page
                        </h1>
                        <button
                            onClick={() => {
                                setEditingHome(null);
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

                    {/* Home Items Grid */}
                    {!loading && (
                        <>
                            {allHome.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {allHome.map((home) => (
                                        <div
                                            key={home.id}
                                            className="bg-[#fdf8ee] rounded-2xl overflow-hidden shadow-sm border border-[#f0e8d0] relative"
                                        >
                                            {/* Featured Ribbon - Left Side (if you have featured field) */}
                                            {home.is_featured === 1 && (
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
                                                    onClick={() => handleEdit(home)}
                                                    className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(home.id)}
                                                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>

                                            {/* Image Section */}
                                            <div className="w-full h-52 overflow-hidden relative">
                                                {home.image ? (
                                                    <img
                                                        src={`${imgurl}/${home.image}`}
                                                        alt="Home"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                        <ImageIcon className="w-12 h-12 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-4">
                                                {/* Date */}
                                                <p className="text-sm text-gray-500 mb-2">
                                                    {formatDate(home.created_at)}
                                                </p>

                                                {/* Title/Name if you have one */}
                                                {home.title && (
                                                    <h3 className="text-lg font-extrabold uppercase text-[#c9882a] leading-snug mb-2 tracking-wide">
                                                        {home.title}
                                                    </h3>
                                                )}

                                                {/* Description if you have one */}
                                                {home.description && (
                                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-3">
                                                        {home.description}
                                                    </p>
                                                )}

                                                {/* Video Section */}
                                                <div className="mb-3">
                                                    {home.video ? (
                                                        <button
                                                            onClick={() => setSelectedVideo(home.video)}
                                                            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                                                        >
                                                            <Video size={18} />
                                                            <span className="text-sm font-medium">Watch Video</span>
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-gray-400">
                                                            <Video size={18} />
                                                            <span className="text-sm">No video</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Archived Badge - only shows if archived */}
                                                {home.is_archived === 1 && (
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
                                        No home items found
                                    </p>
                                    <p className="text-gray-400 mt-2">
                                        Click the "Create" button to add your first home item
                                    </p>
                                </div>
                            )}
                        </>
                    )}

                    {/* Pagination - if your API returns paginated data */}
                    {allHome?.links && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex gap-2">
                                {allHome.links.map((link, index) => (
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

                    {/* Video Popup Modal */}
                    {selectedVideo && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                            <div className="relative bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
                                {/* Header with title and close button */}
                                <div className="flex justify-between items-center p-4 border-b">
                                    <h3 className="text-lg font-semibold text-gray-900">Video Player</h3>
                                    <button
                                        onClick={() => setSelectedVideo(null)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Video Player */}
                                <div className="p-4">
                                    {isYouTubeUrl(selectedVideo) ? (
                                        <div className="relative pb-[56.25%] h-0">
                                            <iframe
                                                src={getYouTubeEmbedUrl(selectedVideo)}
                                                title="Video Player"
                                                className="absolute top-0 left-0 w-full h-full rounded-lg"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    ) : (
                                        <video
                                            src={getVideoUrl(selectedVideo)}
                                            controls
                                            className="w-full max-h-[70vh] rounded-lg"
                                            autoPlay
                                        >
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Form */}
                    {showAddForm && (
                        <AddHomeForm
                            setShowForm={setShowAddForm}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}

                    {/* Edit Form */}
                    {showEditForm && (
                        <EditHomeForm
                            editingHome={editingHome}
                            setEditingHome={setEditingHome}
                            setShowForm={setShowEditForm}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default Home;