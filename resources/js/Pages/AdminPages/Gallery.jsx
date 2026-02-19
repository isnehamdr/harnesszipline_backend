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
//                 <div className="p-6">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                             Gallery page
//                         </h1>
//                         <button
//                         onClick={() => setShowForm(true)} 
//                         className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm">
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>
//                     {showForm && (
//                         <AddGalleryForm
//                             editingGallery={editingGallery}
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

// export default Gallery;


import AddGalleryForm from "@/AddFormComponents/AddGalleryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Plus, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Gallery = () => {
    const [allGallery, setAllGallery] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingGallery, setEditingGallery] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // For fetching the gallery data
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await axios.get(route("ourgallery.index"));
                setAllGallery(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchGallery();
    }, [reloadTrigger]);

    // For delete the gallery item
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

    // Handle edit
    const handleEdit = (galleryItem) => {
        setEditingGallery(galleryItem);
        setShowForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourgallery.update", { id }),
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
            console.log("Error updating gallery item", error);
            throw error;
        }
    };

    return (
        <AdminWrapper>
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Gallery Page
                    </h1>
                    <button
                        onClick={() => {
                            setEditingGallery(null);
                            setShowForm(true);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Create New Gallery</span>
                    </button>
                </div>

                {showForm && (
                    <AddGalleryForm
                        editingGallery={editingGallery}
                        setShowForm={setShowForm}
                        handleUpdate={handleUpdate}
                        setReloadTrigger={setReloadTrigger}
                        setEditingGallery={setEditingGallery}
                    />
                )}

                {/* Gallery Display Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {allGallery.map((gallery) => (
                        <div
                            key={gallery.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden"
                        >
                            {gallery.images && gallery.images.length > 0 && (
                                <img
                                    src={`/storage/${gallery.images[0].path}`}
                                    alt={gallery.name}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    {gallery.name}
                                </h3>
                                <div className="flex gap-2 mb-2">
                                    {gallery.is_featured && (
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                                            Featured
                                        </span>
                                    )}
                                    {gallery.is_archived && (
                                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
                                            Archived
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    {gallery.images?.length || 0} images
                                </p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(gallery)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(gallery.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminWrapper>
    );
};

export default Gallery;
