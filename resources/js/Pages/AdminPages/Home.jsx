// import AddHomeForm from "@/AddFormComponents/AddHomeForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import axios from "axios";
// import { Plus } from "lucide-react";
// import React, { useEffect, useState } from "react";

// const Home = () => {
//     const [allHome, setAllHome] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingHome, setEditingHome] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//         // For fetching the home data
//     useEffect(() => {
//         const fetchHome = async () => {
//             try {
//                 const response = await axios.get(route("ourhome.index"));
//                 setAllHome(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchHome();
//     }, [reloadTrigger]);

//     // For delete the home
//     const handleDelete = async (id) => {
//         try {
//             const response = await axios.delete(
//                 route("ourhome.destroy", { id: id })
//             );
//             console.log(response.data);
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handleedit
//     const handleEdit = (home) => {
//         setEditingHome(home);
//     };

//     // Handlapdate after the  edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourhome.update", { id }),
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
//             console.log("Error updating home", error);
//             throw error;
//         }
//     };

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="p-6">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                             Home
//                         </h1>
//                         <button
//                         onClick={() => setShowForm(true)}
//                             className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
//                         >
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>
//                     {/* Table */}
//                     {showForm && (
//                         <AddHomeForm
//                             editingHome={editingHome}
//                             setShowForm={setShowForm}
//                             handleUpdate={handleUpdate}
//                             setReloadTrigger={setReloadTrigger}
//                     />
//                     )}
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default Home;



import AddHomeForm from "@/AddFormComponents/AddHomeForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Edit, Plus, Trash2, Image as ImageIcon, Video } from "lucide-react";
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
                const response = await axios.get(route("ourhome.index"));
                setAllHome(response.data.data || response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchHome();
    }, [reloadTrigger]);

    // For delete the home
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                const response = await axios.delete(
                    route("ourhome.destroy", { id: id })
                );
                console.log(response.data);
                setReloadTrigger((prev) => !prev);
            } catch (error) {
                console.log(error);
            }
        }
    };

    // handle edit
    const handleEdit = (home) => {
        setEditingHome(home);
        setShowForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourhome.update", { id }),
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
                            onClick={() => {
                                setEditingHome(null);
                                setShowForm(true);
                            }}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={18} />
                            <span>Create New</span>
                        </button>
                    </div>

                    {/* Cards Grid */}
                    {allHome.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow">
                            <p className="text-gray-500">No home items found. Create your first one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {allHome.map((home) => (
                                <div
                                    key={home.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                                >
                                    {/* Image Preview */}
                                    <div className="h-48 bg-gray-100 relative">
                                        {home.image ? (
                                            <img
                                                src={`/storage/${home.image}`}
                                                alt="Home"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ImageIcon className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                        
                                        {/* Status Badge */}
                                        <div className="absolute top-2 right-2">
                                            <span
                                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    home.is_archived
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-green-100 text-green-800"
                                                }`}
                                            >
                                                {home.is_archived ? "Archived" : "Active"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        {/* Video Link */}
                                        <div className="mb-4">
                                            {home.video ? (
                                                <a
                                                    href={`/storage/${home.video}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-900"
                                                >
                                                    <Video size={18} />
                                                    <span className="text-sm">View Video</span>
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Video size={18} />
                                                    <span className="text-sm">No video</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                                            <button
                                                onClick={() => handleEdit(home)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(home.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Form Modal */}
                    {showForm && (
                        <AddHomeForm
                            editingHome={editingHome}
                            setEditingHome={setEditingHome}
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