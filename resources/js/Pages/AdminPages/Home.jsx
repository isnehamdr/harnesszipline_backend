import AddHomeForm from "@/AddFormComponents/AddHomeForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const Home = () => {
    const [allHome, setAllHome] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingHome, setEditingHome] = useState(null);
    const [showForm, setShowForm] = useState(false);

        // For fetching the home data
    useEffect(() => {
        const fetchHome = async () => {
            try {
                const response = await axios.get(route("homes.index"));
                setAllHome(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchHome();
    }, [reloadTrigger]);

    // For delete the home
    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("homes.destroy", { id: id })
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handleedit
    const handleEdit = (home) => {
        setEditingHome(home);
    };

    // Handlapdate after the  edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("homes.update", { id }),
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
            console.log("Error updating home", error);
            throw error;
        }
    };

    return (
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Home
                        </h1>
                        <button
                        onClick={() => setShowForm(true)}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>
                    {/* Table */}
                    {showForm && (
                        <AddHomeForm
                            editingHome={editingHome}
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

export default Home;
