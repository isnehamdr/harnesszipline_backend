// import AddUserForm from "@/AddFormComponents/AddUserForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "@/MyTable/MyTable";
// import axios from "axios";
// import { Plus, Pencil, Trash2 } from "lucide-react";
// import React, { useEffect, useState, useMemo } from "react";

// const UserManagement = () => {
//     const [allUser, setAllUser] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingUser, setEditingUser] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the user data
//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const response = await axios.get(route("ourusers.index"));
//                 setAllUser(response.data.data || response.data); // Handle paginated response
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchUser();
//     }, [reloadTrigger]);

//     // For delete the user
//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this user?")) {
//             try {
//                 await axios.delete(route("ourusers.destroy", { id: id }));
//                 setReloadTrigger((prev) => !prev);
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//     };

//     // handle edit
//     const handleEdit = (user) => {
//         setEditingUser(user);
//         setShowForm(true);
//     };

//     // Handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourusers.update", { id }),
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
//             console.log("Error updating user", error);
//             throw error;
//         }
//     };

//     // Define table columns
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "SN",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//             {
//                 Header: "Image",
//                 accessor: "image",
//                 Cell: ({ row }) =>
//                     row.original.image ? (
//                         <img
//                             src={`/storage/${row.original.image}`}
//                             alt={row.original.name}
//                             className="h-10 w-10 rounded-full object-cover"
//                         />
//                     ) : (
//                         <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                             <span className="text-gray-500 text-sm">
//                                 {row.original.name?.charAt(0)}
//                             </span>
//                         </div>
//                     ),
//             },
//             {
//                 Header: "Name",
//                 accessor: "name",
//             },
//             {
//                 Header: "Email",
//                 accessor: "email",
//             },
//             {
//                 Header: "Phone",
//                 accessor: "phone_number",
//                 Cell: ({ value }) => value || "-",
//             },
//             {
//                 Header: "Role",
//                 accessor: "role",
//                 Cell: ({ value }) => (
//                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                         {value || "user"}
//                     </span>
//                 ),
//             },
//             {
//                 Header: "Actions",
//                 accessor: "actions",
//                 Cell: ({ row }) => (
//                     <div className="text-sm font-medium">
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="text-indigo-600 hover:text-indigo-900 mr-3"
//                         >
//                             <Pencil size={18} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="text-red-600 hover:text-red-900"
//                         >
//                             <Trash2 size={18} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         [],
//     ); // Empty dependency array since handleEdit and handleDelete are stable

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="p-6">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                             User Management
//                         </h1>
//                         <button
//                             onClick={() => {
//                                 setEditingUser(null);
//                                 setShowForm(true);
//                             }}
//                             className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
//                         >
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>

//                     {/* Use MyTable component */}
//                     <MyTable columns={columns} data={allUser.data || allUser} />

//                     {showForm && (
//                         <AddUserForm
//                             editingUser={editingUser}
//                             setEditingUser={setEditingUser}
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

// export default UserManagement;


import AddUserForm from "@/AddFormComponents/AddUserForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditUserForm from "@/EditFormComponents/EditUserForm";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
const imgurl = import.meta.env.VITE_IMAGE_PATH;

const UserManagement = () => {
    const [allUser, setAllUser] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    // For fetching the user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(route("ourusers.index"));
                setAllUser(response.data.data || response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchUser();
    }, [reloadTrigger]);

    // For delete the user
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(route("ourusers.destroy", { id: id }));
                setReloadTrigger((prev) => !prev);
            } catch (error) {
                console.log(error);
            }
        }
    };

    // handle edit
    const handleEdit = (user) => {
        setEditingUser(user);
        setShowEditForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            const response = await axios.post(
                route("ourusers.update", { id }),
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
            console.log("Error updating user", error);
            throw error;
        }
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
                Header: "Image",
                accessor: "image",
                Cell: ({ row }) =>
                    row.original.image ? (
                        <img
                            src={`${imgurl}/${row.original.image}`}
                            alt={row.original.name}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">
                                {row.original.name?.charAt(0)}
                            </span>
                        </div>
                    ),
            },
            {
                Header: "Name",
                accessor: "name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Phone",
                accessor: "phone_number",
                Cell: ({ value }) => value || "-",
            },
            {
                Header: "Role",
                accessor: "role",
                Cell: ({ value }) => (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {value || "user"}
                    </span>
                ),
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="text-sm font-medium">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900"
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
                            User Management
                        </h1>
                        <button
                            onClick={() => {
                                setEditingUser(null);
                                setShowAddForm(true);
                            }}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>

                    {/* Use MyTable component */}
                    <MyTable columns={columns} data={allUser.data || allUser} />

                    {/* Add User Form */}
                    {showAddForm && (
                        <AddUserForm
                            setReloadTrigger={setReloadTrigger}
                            setShowForm={setShowAddForm}
                        />
                    )}

                    {/* Edit User Form */}
                    {showEditForm && (
                        <EditUserForm
                            editingUser={editingUser}
                            setEditingUser={setEditingUser}
                            handleUpdate={handleUpdate}
                            setReloadTrigger={setReloadTrigger}
                            setShowForm={setShowEditForm}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default UserManagement;
