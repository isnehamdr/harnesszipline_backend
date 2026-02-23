// import AddGalleryForm from "@/AddFormComponents/AddGalleryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Gallery = () => {
//     const [allGallery, setAllGallery] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingGallery, setEditingGallery] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//         // For fetching the gallery data
//     useEffect(() => {
//         const fetchGallery = async () => {
//             try {
//                 const response = await axios.get(route("gallery.index"));
//                 setAllGallery(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchGallery();
//     }, [reloadTrigger]);

//     // For delete the gallery item
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("gallery.destroy", { id: id })
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (galleryItem) => {
//         setEditingGallery(galleryItem);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("gallery.update", { id }),
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
//             console.log("Error updating gallery item", error);
//             throw error;
//         }
//     };
//     return (
//         <>
//             <AdminWrapper>
// <div className="p-6">
//     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//             Gallery page
//         </h1>
//         <button
//         onClick={() => setShowForm(true)}
//         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm">
//             <Plus size={18} />
//             <span>Create</span>
//         </button>
//     </div>
//     {showForm && (
//         <AddGalleryForm
//             editingGallery={editingGallery}
//             setShowForm={setShowForm}
//             handleUpdate={handleUpdate}
//             setReloadTrigger={setReloadTrigger}
//         />
//     )}
// </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default Gallery;

// import AddGalleryForm from "@/AddFormComponents/AddGalleryForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import { Plus, Pencil, Trash2, X } from "lucide-react";
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Gallery = () => {
//     const [allGallery, setAllGallery] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingGallery, setEditingGallery] = useState(null);
//     const [showForm, setShowForm] = useState(false);
//     const [selectedImage, setSelectedImage] = useState(null);

//     useEffect(() => {
//         const fetchGallery = async () => {
//             try {
//                 const response = await axios.get(route("ourgallery.index"));
//                 setAllGallery(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };
//         fetchGallery();
//     }, [reloadTrigger]);

//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this gallery?")) {
//             try {
//                 await axios.delete(route("ourgallery.destroy", { id: id }));
//                 setReloadTrigger((prev) => !prev);
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//     };

//     const handleEdit = (galleryItem) => {
//         setEditingGallery(galleryItem);
//         setShowForm(true);
//         // Scroll to form smoothly
//         setTimeout(() => {
//             document
//                 .getElementById("gallery-form")
//                 ?.scrollIntoView({ behavior: "smooth", block: "start" });
//         }, 100);
//     };

//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourgallery.update", { id }),
//                 formData,
//                 { headers: { "Content-Type": "multipart/form-data" } },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating gallery item", error);
//             throw error;
//         }
//     };

//     const rotations = [
//         "-rotate-2",
//         "rotate-1",
//         "-rotate-1",
//         "rotate-2",
//         "rotate-0",
//         "-rotate-3",
//     ];

//     return (
//         <AdminWrapper>
//             <div className="p-6 md:p-10">
//                 {/* Header */}
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//                     <div>
//                         <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
//                             Gallery
//                         </h1>
//                         {/* <p className="text-sm text-stone-500 mt-1">
//                             Manage and organize your gallery images
//                         </p> */}
//                     </div>
//                     <button
//                         onClick={() => {
//                             setEditingGallery(null);
//                             setShowForm(true);
//                             setTimeout(() => {
//                                 document
//                                     .getElementById("gallery-form")
//                                     ?.scrollIntoView({
//                                         behavior: "smooth",
//                                         block: "start",
//                                     });
//                             }, 100);
//                         }}
//                         className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
//                     >
//                         <Plus size={18} />
//                         Create
//                     </button>
//                 </div>

//                 {/* Form */}
//                 {showForm && (
//                     <div
//                         id="gallery-form"
//                         className="mb-12 bg-stone-50 p-6 rounded-2xl border border-stone-200"
//                     >
//                         {/* <div className="flex justify-between items-center mb-4">
//                             <h2 className="text-xl font-semibold text-stone-800">
//                                 {editingGallery
//                                     ? "Edit Gallery Item"
//                                     : "Create New Gallery Item"}
//                             </h2>
//                             <button
//                                 onClick={() => setShowForm(false)}
//                                 className="p-2 hover:bg-stone-200 rounded-full transition-colors"
//                             >
//                                 <X size={20} />
//                             </button>
//                         </div> */}
//                         <AddGalleryForm
//                             editingGallery={editingGallery}
//                             setShowForm={setShowForm}
//                             handleUpdate={handleUpdate}
//                             setReloadTrigger={setReloadTrigger}
//                             setEditingGallery={setEditingGallery}
//                         />
//                     </div>
//                 )}

//                 {/* Gallery Stats */}
//                 {/* {allGallery.length > 0 && (
//                     <div className="mb-6 text-sm text-stone-500">
//                         Showing {allGallery.length}{" "}
//                         {allGallery.length === 1 ? "item" : "items"}
//                     </div>
//                 )} */}

//                 {/* Expanded View Grid */}
//                 <div className="grid gap-8 transition-all duration-300 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//                     {allGallery.map((gallery, index) => (
//                         <div
//                             key={gallery.id}
//                             className={`group relative bg-white p-4 pb-14 shadow-lg cursor-pointer ${rotations[index % rotations.length]}`}
//                         >
//                             {/* Action buttons — visible on hover */}
//                             <div className="absolute top-3 right-3 flex gap-2 transition-opacity duration-200 z-20">
//                                 <button
//                                     onClick={() => handleEdit(gallery)}
//                                     className="w-8 h-8 flex items-center justify-center bg-white/95 text-blue-600 rounded-full shadow-md hover:bg-blue-50 hover:scale-110 transition-all duration-200"
//                                     title="Edit gallery item"
//                                 >
//                                     <Pencil size={14} />
//                                 </button>
//                                 <button
//                                     onClick={() => handleDelete(gallery.id)}
//                                     className="w-8 h-8 flex items-center justify-center bg-white/95 text-red-600 rounded-full shadow-md hover:bg-red-50 hover:scale-110 transition-all duration-200"
//                                     title="Delete gallery item"
//                                 >
//                                     <Trash2 size={14} />
//                                 </button>
//                             </div>

//                             {/* Badges */}
//                             {/* {(gallery.is_featured || gallery.is_archived) && (
//                                 <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-20">
//                                     {gallery.is_featured && (
//                                         <span className="text-xs px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full font-semibold shadow-sm flex items-center gap-1">
//                                             <span>★</span> Featured
//                                         </span>
//                                     )}
//                                     {gallery.is_archived && (
//                                         <span className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full font-semibold shadow-sm flex items-center gap-1">
//                                             <span>◻</span> Archived
//                                         </span>
//                                     )}
//                                 </div>
//                             )} */}

//                             {/* Image - Expanded view with aspect-video */}
//                             {gallery.images && gallery.images.length > 0 ? (
//                                 <div
//                                     className="w-full overflow-hidden"
//                                     onClick={() =>
//                                         setSelectedImage(
//                                             `/storage/${gallery.images[0].path}`,
//                                         )
//                                     }
//                                 >
//                                     <img
//                                         src={`/storage/${gallery.images[0].path}`}
//                                         alt={gallery.name}
//                                         className="w-full object-cover aspect-video transition-transform duration-300 group-hover:scale-110"
//                                     />
//                                 </div>
//                             ) : (
//                                 <div className="w-full bg-stone-100 flex items-center justify-center text-stone-400 text-sm tracking-widest uppercase aspect-video">
//                                     No Image
//                                 </div>
//                             )}

//                             {/* Title - Enhanced */}
//                             <div className="absolute bottom-3 left-0 right-0 text-center">
//                                 <p className="text-sm font-semibold tracking-widest uppercase text-stone-700 px-3 truncate">
//                                     {gallery.name}
//                                 </p>
//                                 {gallery.description && (
//                                     <p className="text-xs text-stone-500 mt-1 px-3 truncate">
//                                         {gallery.description}
//                                     </p>
//                                 )}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Empty state - Enhanced */}
//                 {allGallery.length === 0 && (
//                     <div className="flex flex-col items-center justify-center py-32 text-stone-400">
//                         <div className="w-24 h-28 bg-white shadow-lg p-3 mb-6 rotate-3 flex flex-col">
//                             <div className="flex-1 bg-stone-100" />
//                             <div className="h-6 mt-2" />
//                         </div>
//                         <p className="text-lg tracking-widest uppercase mb-2">
//                             No gallery items yet
//                         </p>
//                         <p className="text-sm text-stone-500">
//                             Click the Create button to add your first gallery
//                             item
//                         </p>
//                     </div>
//                 )}

//                 {/* Image Modal */}
//                 {selectedImage && (
//                     <div
//                         className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
//                         onClick={() => setSelectedImage(null)}
//                     >
//                         <button
//                             className="absolute top-6 right-6 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 transition-all duration-200"
//                             onClick={() => setSelectedImage(null)}
//                         >
//                             <X size={24} />
//                         </button>
//                         <img
//                             src={selectedImage}
//                             alt="Gallery preview"
//                             className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
//                             onClick={(e) => e.stopPropagation()}
//                         />
//                     </div>
//                 )}
//             </div>
//         </AdminWrapper>
//     );
// };

// export default Gallery;


import AddGalleryForm from "@/AddFormComponents/AddGalleryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Plus, Pencil, Trash2, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Gallery = () => {
    const [allGallery, setAllGallery] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingGallery, setEditingGallery] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedGalleryIndex, setSelectedGalleryIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(true);

    useEffect(() => {
        // Simulate page load
        const timer = setTimeout(() => {
            setIsPageLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchGallery = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(route("ourgallery.index"));
                setAllGallery(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGallery();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this gallery?")) {
            try {
                await axios.delete(route("ourgallery.destroy", { id: id }));
                setReloadTrigger((prev) => !prev);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleEdit = (galleryItem) => {
        setEditingGallery(galleryItem);
        setShowForm(true);
        // Scroll to form smoothly
        setTimeout(() => {
            document
                .getElementById("gallery-form")
                ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourgallery.update", { id }),
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating gallery item", error);
            throw error;
        }
    };

    const rotations = [
        "-rotate-2",
        "rotate-1",
        "-rotate-1",
        "rotate-2",
        "rotate-0",
        "-rotate-3",
    ];

    // Gallery image navigation functions
    const openGalleryModal = (gallery, index) => {
        setSelectedGalleryIndex(index);
        setSelectedImage(`/storage/${gallery.images[index].path}`);
    };

    const nextImage = (e) => {
        e.stopPropagation();
        const gallery = allGallery.find(g => 
            g.images.some(img => `/storage/${img.path}` === selectedImage)
        );
        
        if (gallery && selectedGalleryIndex < gallery.images.length - 1) {
            const newIndex = selectedGalleryIndex + 1;
            setSelectedGalleryIndex(newIndex);
            setSelectedImage(`/storage/${gallery.images[newIndex].path}`);
        }
    };

    const prevImage = (e) => {
        e.stopPropagation();
        const gallery = allGallery.find(g => 
            g.images.some(img => `/storage/${img.path}` === selectedImage)
        );
        
        if (gallery && selectedGalleryIndex > 0) {
            const newIndex = selectedGalleryIndex - 1;
            setSelectedGalleryIndex(newIndex);
            setSelectedImage(`/storage/${gallery.images[newIndex].path}`);
        }
    };

    // Page loading state
    if (isPageLoading) {
        return (
            <AdminWrapper>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                        <p className="text-stone-500 text-sm tracking-widest uppercase">Loading Gallery...</p>
                    </div>
                </div>
            </AdminWrapper>
        );
    }

    return (
        <AdminWrapper>
            <div className="p-6 md:p-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold tracking-widest text-stone-800 uppercase">
                            Gallery
                        </h1>
                    </div>
                    <button
                        onClick={() => {
                            setEditingGallery(null);
                            setShowForm(true);
                            setTimeout(() => {
                                document
                                    .getElementById("gallery-form")
                                    ?.scrollIntoView({
                                        behavior: "smooth",
                                        block: "start",
                                    });
                            }, 100);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-amber-50 px-6 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        <Plus size={18} />
                        Create
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div
                        id="gallery-form"
                        className="mb-12 bg-stone-50 p-6 rounded-2xl border border-stone-200"
                    >
                        <AddGalleryForm
                            editingGallery={editingGallery}
                            setShowForm={setShowForm}
                            handleUpdate={handleUpdate}
                            setReloadTrigger={setReloadTrigger}
                            setEditingGallery={setEditingGallery}
                        />
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
                        <p className="text-stone-400 text-sm tracking-widest uppercase">
                            Loading gallery items...
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Gallery Grid */}
                        <div className="grid gap-8 transition-all duration-300 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                            {allGallery.map((gallery, index) => (
                                <div
                                    key={gallery.id}
                                    className={`group relative bg-white p-4 pb-14 shadow-lg ${rotations[index % rotations.length]}`}
                                >
                                    {/* Action buttons — visible on hover */}
                                    <div className="absolute top-3 right-3 flex gap-2 transition-opacity duration-200 z-20">
                                        <button
                                            onClick={() => handleEdit(gallery)}
                                            className="w-8 h-8 flex items-center justify-center bg-white/95 text-blue-600 rounded-full shadow-md hover:bg-blue-50 hover:scale-110 transition-all duration-200"
                                            title="Edit gallery item"
                                        >
                                            <Pencil size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(gallery.id)}
                                            className="w-8 h-8 flex items-center justify-center bg-white/95 text-red-600 rounded-full shadow-md hover:bg-red-50 hover:scale-110 transition-all duration-200"
                                            title="Delete gallery item"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    {/* Multiple Images Display */}
                                    {gallery.images && gallery.images.length > 0 ? (
                                        <div className="space-y-2">
                                            {/* Main Image */}
                                            <div 
                                                className="w-full overflow-hidden cursor-pointer relative"
                                                onClick={() => openGalleryModal(gallery, 0)}
                                            >
                                                <img
                                                    src={`/storage/${gallery.images[0].path}`}
                                                    alt={gallery.name}
                                                    className="w-full object-cover aspect-video transition-transform duration-300 group-hover:scale-110"
                                                />
                                                
                                                {/* Image Count Badge */}
                                                {/* {gallery.images.length > 1 && (
                                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                        <span>📷</span>
                                                        {gallery.images.length}
                                                    </div>
                                                )} */}
                                            </div>

                                            {/* Thumbnail Strip for Multiple Images */}
                                            {/* {gallery.images.length > 1 && (
                                                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-stone-300">
                                                    {gallery.images.slice(1, 5).map((image, imgIndex) => (
                                                        <div
                                                            key={imgIndex}
                                                            className="w-16 h-16 flex-shrink-0 cursor-pointer border-2 border-transparent hover:border-indigo-500 rounded-md overflow-hidden transition-all duration-200"
                                                            onClick={() => openGalleryModal(gallery, imgIndex + 1)}
                                                        >
                                                            <img
                                                                src={`/storage/${image.path}`}
                                                                alt={`${gallery.name} ${imgIndex + 2}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                    
                                                
                                                    {gallery.images.length > 5 && (
                                                        <div 
                                                            className="w-16 h-16 flex-shrink-0 bg-stone-100 flex items-center justify-center text-xs font-medium text-stone-600 rounded-md cursor-pointer border-2 border-transparent hover:border-indigo-500"
                                                            onClick={() => openGalleryModal(gallery, 4)}
                                                        >
                                                            +{gallery.images.length - 5}
                                                        </div>
                                                    )}
                                                </div>
                                            )} */}
                                        </div>
                                    ) : (
                                        <div className="w-full bg-stone-100 flex items-center justify-center text-stone-400 text-sm tracking-widest uppercase aspect-video">
                                            No Image
                                        </div>
                                    )}

                                    {/* Title - Enhanced */}
                                    <div className="absolute bottom-3 left-0 right-0 text-center">
                                        <p className="text-sm font-semibold tracking-widest uppercase text-stone-700 px-3 truncate">
                                            {gallery.name}
                                        </p>
                                        {gallery.description && (
                                            <p className="text-xs text-stone-500 mt-1 px-3 truncate">
                                                {gallery.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Empty state */}
                        {allGallery.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-32 text-stone-400">
                                <div className="w-24 h-28 bg-white shadow-lg p-3 mb-6 rotate-3 flex flex-col">
                                    <div className="flex-1 bg-stone-100" />
                                    <div className="h-6 mt-2" />
                                </div>
                                <p className="text-lg tracking-widest uppercase mb-2">
                                    No gallery items yet
                                </p>
                                <p className="text-sm text-stone-500">
                                    Click the Create button to add your first gallery item
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Image Modal with Navigation */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close button */}
                        <button
                            className="absolute top-6 right-6 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 transition-all duration-200 z-50"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={24} />
                        </button>

                        {/* Navigation arrows - only show if there are multiple images */}
                        {(() => {
                            const gallery = allGallery.find(g => 
                                g.images.some(img => `/storage/${img.path}` === selectedImage)
                            );
                            
                            if (gallery && gallery.images.length > 1) {
                                return (
                                    <>
                                        {selectedGalleryIndex > 0 && (
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 transition-all duration-200 z-50"
                                            >
                                                <ChevronLeft size={32} />
                                            </button>
                                        )}
                                        {selectedGalleryIndex < gallery.images.length - 1 && (
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 rounded-full p-3 transition-all duration-200 z-50"
                                            >
                                                <ChevronRight size={32} />
                                            </button>
                                        )}
                                    </>
                                );
                            }
                            return null;
                        })()}

                        {/* Image counter */}
                        {(() => {
                            const gallery = allGallery.find(g => 
                                g.images.some(img => `/storage/${img.path}` === selectedImage)
                            );
                            
                            if (gallery && gallery.images.length > 1) {
                                return (
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                                        {selectedGalleryIndex + 1} / {gallery.images.length}
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        <img
                            src={selectedImage}
                            alt="Gallery preview"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )}
            </div>
        </AdminWrapper>
    );
};

export default Gallery;
