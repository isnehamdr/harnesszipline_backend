import AddGalleryForm from "@/AddFormComponents/AddGalleryForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const Gallery = () => {
    const [allGallery, setAllGallery] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingGallery, setEditingGallery] = useState(null);
    const [showForm, setShowForm] = useState(false);

        // For fetching the gallery data
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await axios.get(route("gallery.index"));
                setAllGallery(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchGallery();
    }, [reloadTrigger]);

    // For delete the gallery item
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("gallery.destroy", { id: id })
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (galleryItem) => {
        setEditingGallery(galleryItem);
    };

    // Handlapdate after the  edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("gallery.update", { id }),
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
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Gallery page
                        </h1>
                        <button
                        onClick={() => setShowForm(true)} 
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm">
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>
                    {showForm && (
                        <AddGalleryForm
                            editingGallery={editingGallery}
                            setShowForm={setShowForm}
                            handleUpdate={handleUpdate}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default Gallery;
