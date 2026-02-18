import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

const AddHomeForm = ({
    editingHome,
    setEditingHome,
    setShowForm,
    handleUpdate,
    setReloadTrigger,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [homeForm, setHomeForm] = useState({
        image: "",
        video: "",
        is_archived: false,
    });

    //  Use Effect
    useEffect(() => {
        if (editingHome) {
            setHomeForm({
                ...editingHome,
                image: null,
            });
            setShowForm(true);
        } else {
            setHomeForm({
                image: "",
                video: "",
                is_archived: false,
            });
        }
    }, [editingHome]);

    // Handle Create Home
    const handleCreate = async (formData) => {
        try {
            await axios.post(route("homes.store"), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating home", error);
            throw error;
        }
    };

    // Handle Submit - now clearly separated paths
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        // Append all form data except image if it's empty
        for (const key in homeForm) {
            if (homeForm[key] !== null && homeForm[key] !== "") {
                formData.append(key, homeForm[key]);
            }
        }
        try {
            setSubmitting(true);

            if (editingHome) {
                // Editing existing home
                await handleUpdate(formData, editingHome.id);
            } else {
                // Creating new home
                await handleCreate(formData);
            }
            setHomeForm({
                image: "",
                video: "",
                is_archived: false,
            });

            setShowForm(false);
            setEditingHome(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    // handle  change for image and the others

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setHomeForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-lg h-[600px] overflow-y-auto bg-white shadow-2xl">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold mb-4">
                        {editingHome ? "Edit Home" : "Add New Home"}
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

export default AddHomeForm;
