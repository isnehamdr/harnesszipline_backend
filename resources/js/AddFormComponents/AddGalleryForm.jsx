import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddGalleryForm = ({ editingGallery, setShowForm, handleUpdate, setReloadTrigger }) => {
     const [submitting, setSubmitting] = useState(false);
        const [galleryForm, setGalleryForm] = useState({
            name: "",
            image: "",
            
        });
    
        //  Use Effect
        useEffect(() => {
            if (editingGallery) {
                setGalleryForm({
                    ...editingGallery,
                    image: null,
                });
                setShowForm(true);
            } else {
                setGalleryForm({
                name: "",
                image: "",
                });
            }
        }, [editingGallery]);
    
        // Handle Create Home
        const handleCreate = async (formData) => {
            try {
                await axios.post(route("gallery.store"), formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                setReloadTrigger((prev) => !prev);
            } catch (error) {
                console.log("Error creating gallery item", error);
                throw error;
            }
        };
    
        // Handle Submit - now clearly separated paths
        const handleSubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData();
            // Append all form data except image if it's empty
            for (const key in galleryForm) {
                if (galleryForm[key] !== null && galleryForm[key] !== "") {
                    formData.append(key, galleryForm[key]);
                }
            }
            try {
                setSubmitting(true);
    
                if (editingGallery) {
                    // Editing existing gallery item
                    await handleUpdate(formData, editingGallery.id);
                } else {
                    // Creating new gallery item
                    await handleCreate(formData);
                }
                setGalleryForm({
                    name: "",
                    image: "",
                    
                });
    
                setShowForm(false);
                setEditingGallery(null);
            } catch (error) {
                console.log("Error saving data", error);
            } finally {
                setSubmitting(false);
            }
        };
    
        // handle  change for image and the others
    
        const handleChange = (e) => {
            const { name, value, type, files } = e.target;
            setGalleryForm((prev) => ({
                ...prev,
                [name]: type === "file" ? files[0] : value,
            }));
        };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-lg h-[600px] overflow-y-auto bg-white shadow-2xl">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold mb-4">
                        {editingGallery ? "Edit Gallery Item" : "Add New Gallery Item"}
                    </h2>
                    <button
                        onClick={() => {
                            setShowForm(false);
                        }}
                        className="absolute top-4 right-4"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddGalleryForm;
