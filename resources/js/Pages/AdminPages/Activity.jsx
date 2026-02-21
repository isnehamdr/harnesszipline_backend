import React, { useState, useEffect } from "react";
import AddActivityForm from "@/AddFormComponents/AddActivityForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Plus } from "lucide-react";

const Activity = () => {
    const [allActivity, setAllActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [showForm, setShowForm] = useState(false);

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
        if (!window.confirm('Are you sure you want to delete this activity?')) {
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

    // handleedit
    const handleEdit = (activity) => {
        setEditingActivity(activity);
        setShowForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ouractivity.update", { id }),
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
            console.log("Error updating activity", error);
            throw error;
        }
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
                                setShowForm(true);
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
                                        <div key={activity.id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition">
                                            {/* Display first image if exists */}
                                            {activity.images && activity.images.length > 0 && (
                                                <div className="mb-3">
                                                    <img 
                                                        src={`/storage/${activity.images[0].path}`}
                                                        alt={activity.name}
                                                        className="w-full h-48 object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <h3 className="text-lg font-semibold">{activity.name}</h3>
                                            <p className="text-gray-600 mt-2 line-clamp-2">{activity.short_description}</p>
                                            <p className="text-indigo-600 font-bold mt-2">${activity.base_price}</p>
                                            
                                            {/* Status Badges */}
                                            <div className="flex gap-2 mt-2">
                                                {activity.is_featured && (
                                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Featured</span>
                                                )}
                                                {activity.is_archived && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Archived</span>
                                                )}
                                            </div>

                                            <div className="flex gap-2 mt-4">
                                                <button
                                                    onClick={() => handleEdit(activity)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(activity.id)}
                                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 text-lg">No activities found</p>
                                    <p className="text-gray-400 mt-2">Click the "Create" button to add your first activity</p>
                                </div>
                            )}
                        </>
                    )}

                    {showForm && (
                        <AddActivityForm
                            editingActivity={editingActivity}
                            setShowForm={setShowForm}
                            setEditingActivity={setEditingActivity}
                            handleUpdate={handleUpdate}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default Activity;