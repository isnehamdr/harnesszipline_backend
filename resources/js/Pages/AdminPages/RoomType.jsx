// import AddRoomTypeForm from "@/AddFormComponents/AddRoomTypeForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "@/MyTable/MyTable";
// import axios from "axios";
// import { Edit, Plus, Trash2, Archive, CheckCircle } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";

// const RoomType = () => {
//     const [showForm, setShowForm] = useState(false);
//     const [allRoomTypes, setAllRoomTypes] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingRoomType, setEditingRoomType] = useState(null);

//     // For fetching the room type data
//     useEffect(() => {
//         const fetchRoomTypes = async () => {
//             try {
//                 const response = await axios.get(route("ourroomtype.index"));
//                 // Handle both response structures
//                 const roomTypes = response.data.data || response.data;
//                 setAllRoomTypes(Array.isArray(roomTypes) ? roomTypes : []);
//             } catch (error) {
//                 console.error("fetching error ", error);
//                 setAllRoomTypes([]);
//             }
//         };

//         fetchRoomTypes();
//     }, [reloadTrigger]);

//     // For delete the room type
//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this room type?")) {
//             try {
//                 await axios.delete(route("ourroomtype.destroy", { id: id }));
//                 setReloadTrigger((prev) => !prev);
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//     };

//     // handle edit
//     const handleEdit = (roomType) => {
//         setEditingRoomType(roomType);
//         setShowForm(true);
//     };

//     // Handle update after the edit
//     // handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             // Add method spoofing for PUT request
//             formData.append("_method", "PUT");

//             const response = await axios.post(
//                 route("ourroomtype.update", { id }),
//                 formData,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );
//             setReloadTrigger((prev) => !prev);
//             return response.data;
//         } catch (error) {
//             console.log("Error updating room type", error);
//             throw error;
//         }
//     };

//     // Define table columns
//     const columns = useMemo(
//         () => [
//              {
//                 Header: "SN",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//             },
//             {
//                 Header: "Status",
//                 accessor: "is_archived",
//                 Cell: ({ value }) =>
//                     value ? (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                             Archived
//                         </span>
//                     ) : (
//                         <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                             Active
//                         </span>
//                     ),
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
//                             title="Edit"
//                         >
//                             <Edit size={18} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
//                             title="Delete"
//                         >
//                             <Trash2 size={18} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [],
//     );

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="p-6">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                             Room Type
//                         </h1>
//                         <button
//                             onClick={() => {
//                                 setEditingRoomType(null);
//                                 setShowForm(true);
//                             }}
//                             className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
//                         >
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>

//                     {/* Room Types Table */}
//                     <MyTable columns={columns} data={allRoomTypes} />

//                     {showForm && (
//                         <AddRoomTypeForm
//                             editingRoomType={editingRoomType}
//                             setShowForm={setShowForm}
//                             handleUpdate={handleUpdate}
//                             setReloadTrigger={setReloadTrigger}
//                             setEditingRoomType={setEditingRoomType}
//                         />
//                     )}
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default RoomType;



import AddRoomTypeForm from "@/AddFormComponents/AddRoomTypeForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditRoomTypeForm from "@/EditFormComponents/EditRoomTypeForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Edit, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

const RoomType = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [allRoomTypes, setAllRoomTypes] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingRoomType, setEditingRoomType] = useState(null);

    // For fetching the room type data
    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                const response = await axios.get(route("ourroomtype.index"));
                // Handle both response structures
                const roomTypes = response.data.data || response.data;
                setAllRoomTypes(Array.isArray(roomTypes) ? roomTypes : []);
            } catch (error) {
                console.error("fetching error ", error);
                setAllRoomTypes([]);
            }
        };

        fetchRoomTypes();
    }, [reloadTrigger]);

    // For delete the room type
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this room type?")) {
            try {
                await axios.delete(route("ourroomtype.destroy", { id: id }));
                setReloadTrigger((prev) => !prev);
            } catch (error) {
                console.log(error);
            }
        }
    };

    // handle edit
    const handleEdit = (roomType) => {
        setEditingRoomType(roomType);
        setShowEditForm(true);
    };

    // Define table columns
    const columns = useMemo(
        () => [
            {
                Header: "SN",
                accessor: (row, i) => i + 1,
                id: "rowIndex",
                width: 60,
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Status",
                accessor: "is_archived",
                Cell: ({ value }) =>
                    value ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            Archived
                        </span>
                    ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                        </span>
                    ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50 transition-colors"
                            title="Edit"
                        >
                            <Edit size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                            Room Type
                        </h1>
                        <button
                            onClick={() => {
                                setEditingRoomType(null);
                                setShowAddForm(true);
                            }}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>

                    {/* Room Types Table */}
                    <MyTable columns={columns} data={allRoomTypes} />

                    {/* Add Form Modal */}
                    {showAddForm && (
                        <AddRoomTypeForm
                            setShowForm={setShowAddForm}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}

                    {/* Edit Form Modal */}
                    {showEditForm && (
                        <EditRoomTypeForm
                            editingRoomType={editingRoomType}
                            setShowForm={setShowEditForm}
                            setReloadTrigger={setReloadTrigger}
                            setEditingRoomType={setEditingRoomType}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default RoomType;
