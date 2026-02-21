// Room.jsx
import AddRoomForm from "@/AddFormComponents/AddRoomForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

const Room = () => {
    const [showForm, setShowForm] = useState(false);
    const [allRoom, setAllRoom] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [loading, setLoading] = useState(false);

    // For fetching the room data
    useEffect(() => {
        const fetchRoom = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourroom.index"));
                setAllRoom(response.data.data || response.data);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRoom();
    }, [reloadTrigger]);

    // For delete the room
    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this room?")) return;
        
        try {
            await axios.delete(route("ourroom.destroy", { id: id }));
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    // handle edit
    const handleEdit = (room) => {
        setEditingRoom(room);
        setShowForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourroom.update", { id }),
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
            console.log("Error updating room", error);
            throw error;
        }
    };

    // Define columns for the table
    const columns = useMemo(
        () => [
             {
                Header: "SN",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: 'Name',
                accessor: 'name',
            },
            {
                Header: 'Room Type',
                accessor: (row) => row.room_type?.name || 'N/A',
                id: 'room_type',
            },
            {
                Header: 'Price',
                accessor: 'price',
                Cell: ({ value }) => `Nrs ${value}`,
            },
            {
                Header: 'Featured',
                accessor: 'is_featured',
                Cell: ({ value }) => (
                    <span className={`px-2 py-1 text-xs rounded-full ${
                        value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                        {value ? 'Featured' : 'Regular'}
                    </span>
                ),
            },
            {
                Header: 'Actions',
                accessor: 'id',
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 transition"
                            title="Edit"
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Rooms
                        </h1>
                        <button
                            onClick={() => {
                                setEditingRoom(null);
                                setShowForm(true);
                            }}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={18} />
                            <span>Create Room</span>
                        </button>
                    </div>

                    {/* Rooms Table */}
                    {loading ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-500">Loading rooms...</p>
                        </div>
                    ) : allRoom.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-8 text-center">
                            <p className="text-gray-500">No rooms found</p>
                        </div>
                    ) : (
                        <MyTable
                            columns={columns} 
                            data={allRoom} 
                        />
                    )}

                    {showForm && (
                        <AddRoomForm
                            editingRoom={editingRoom}
                            setShowForm={setShowForm}
                            handleUpdate={handleUpdate}
                            setReloadTrigger={setReloadTrigger}
                            setEditingRoom={setEditingRoom}
                            reloadTrigger={reloadTrigger}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default Room;