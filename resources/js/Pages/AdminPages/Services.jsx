import React, { useState, useEffect } from "react";
import axios from "axios";
import AddServiceForm from "@/AddFormComponents/AddServiceForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import { Plus } from "lucide-react";

const Services = () => {
    const [allService, setAllService] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [showForm, setShowForm] = useState(false);

    // For fetching the service data
    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await axios.get(route("ourservices.index"));
                setAllService(response.data.data || response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchService();
    }, [reloadTrigger]);

    // For delete the service
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this service?")) {
            try {
                await axios.delete(route("ourservices.destroy", { id: id }));
                setReloadTrigger((prev) => !prev);
            } catch (error) {
                console.log(error);
            }
        }
    };

    // handle edit
    const handleEdit = (service) => {
        setEditingService(service);
        setShowForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourservices.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating service", error);
            throw error;
        }
    };

    return (
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Services
                        </h1>
                        <button
                            onClick={() => {
                                setEditingService(null);
                                setShowForm(true);
                            }}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>

                    {/* Services List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allService.map((service) => (
                            <div key={service.id} className="bg-white rounded-lg shadow-md p-4">
                                {service.image && (
                                    <img 
                                        src={`/storage/${service.image}`} 
                                        alt={service.name}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                                <p className="text-gray-600 mb-4">{service.short_description}</p>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {showForm && (
                        <AddServiceForm
                            editingService={editingService}
                            setShowForm={setShowForm}
                            setEditingService={setEditingService}
                            setReloadTrigger={setReloadTrigger}
                            handleUpdate={handleUpdate}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default Services;