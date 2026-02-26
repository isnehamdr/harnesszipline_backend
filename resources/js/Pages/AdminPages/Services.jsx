// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, Edit, Trash2, Star } from "lucide-react";
// import AddServiceForm from "@/AddFormComponents/AddServiceForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";

// const Services = () => {
//     const [allService, setAllService] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingService, setEditingService] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the service data
//     useEffect(() => {
//         const fetchService = async () => {
//             try {
//                 const response = await axios.get(route("ourservices.index"));
//                 setAllService(response.data.data || response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchService();
//     }, [reloadTrigger]);

//     // For delete the service
//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this service?")) {
//             try {
//                 await axios.delete(route("ourservices.destroy", { id: id }));
//                 setReloadTrigger((prev) => !prev);
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//     };

//     // handle edit
//     const handleEdit = (service) => {
//         setEditingService(service);
//         setShowForm(true);
//     };

//     // Handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourservices.update", { id }),
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
//             console.log("Error updating service", error);
//             throw error;
//         }
//     };

//     // Format date like "28 Jul 2025"
//     const formatDate = (dateString) => {
//         if (!dateString) return "";
//         const date = new Date(dateString);
//         return date.toLocaleDateString("en-GB", {
//             day: "2-digit",
//             month: "short",
//             year: "numeric",
//         });
//     };

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="p-6">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                             Services
//                         </h1>
//                         <button
//                             onClick={() => {
//                                 setEditingService(null);
//                                 setShowForm(true);
//                             }}
//                             className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
//                         >
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>

//                     {/* Services List */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {allService?.map((service) => (
//                             <div
//                                 key={service.id}
//                                 className="bg-[#fdf8ee] rounded-2xl overflow-hidden shadow-sm border border-[#f0e8d0] relative"
//                             >
//                                 {/* Featured Ribbon - Left Side */}
//                                 {service.is_featured === 1 && (
//                                     <>
//                                         {/* Desktop Ribbon */}
//                                         <div className="absolute top-0 left-0 z-10 hidden md:block">
//                                             <div className="relative">
//                                                 <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
//                                                     <div className="absolute transform -rotate-45 bg-yellow-400 text-yellow-900 text-center font-bold py-1 left-[-35px] top-[19px] w-[150px] shadow-md flex items-center justify-center gap-1">
//                                                         <Star size={14} className="fill-yellow-900" />
//                                                         <span className="text-xs">FEATURED</span>
//                                                         <Star size={14} className="fill-yellow-900" />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
                                        
//                                         {/* Mobile Badge */}
//                                         <div className="absolute top-2 left-2 z-10 md:hidden">
//                                             <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-md flex items-center gap-1">
//                                                 <Star size={12} className="fill-yellow-900" />
//                                                 Featured
//                                             </span>
//                                         </div>
//                                     </>
//                                 )}

//                                 {/* Action Buttons - Top right */}
//                                 <div className="absolute top-2 right-2 flex gap-2 z-20">
//                                     <button
//                                         onClick={() => handleEdit(service)}
//                                         className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
//                                         title="Edit"
//                                     >
//                                         <Edit size={16} />
//                                     </button>
//                                     <button
//                                         onClick={() => handleDelete(service.id)}
//                                         className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
//                                         title="Delete"
//                                     >
//                                         <Trash2 size={16} />
//                                     </button>
//                                 </div>

//                                 {/* Image */}
//                                 {service.image && (
//                                     <div className="w-full h-52 overflow-hidden">
//                                         <img
//                                             src={`/storage/${service.image}`}
//                                             alt={service.name}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </div>
//                                 )}

//                                 {/* Content */}
//                                 <div className="p-4">
//                                     {/* Date */}
//                                     <p className="text-sm text-gray-500 mb-2">
//                                         {formatDate(service.created_at)}
//                                     </p>

//                                     {/* Name/Title */}
//                                     <h3 className="text-lg font-extrabold uppercase text-[#c9882a] leading-snug mb-2 tracking-wide">
//                                         {service.name}
//                                     </h3>

//                                     {/* Short Description */}
//                                     <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
//                                         {service.short_description}
//                                     </p>

//                                     {/* Archived Badge - only shows if archived */}
//                                     {service.is_archived === 1 && (
//                                         <div className="mt-3">
//                                             <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
//                                                 Archived
//                                             </span>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Pagination */}
//                     {allService?.links && (
//                         <div className="mt-6 flex justify-center">
//                             <div className="flex gap-2">
//                                 {allService.links.map((link, index) => (
//                                     <button
//                                         key={index}
//                                         onClick={() => {
//                                             if (link.url && !link.active) {
//                                                 window.location.href = link.url;
//                                             }
//                                         }}
//                                         dangerouslySetInnerHTML={{ __html: link.label }}
//                                         className={`px-3 py-1 rounded ${
//                                             link.active
//                                                 ? "bg-indigo-600 text-white"
//                                                 : link.url
//                                                 ? "bg-gray-200 hover:bg-gray-300"
//                                                 : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                         }`}
//                                         disabled={!link.url}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {showForm && (
//                         <AddServiceForm
//                             editingService={editingService}
//                             setShowForm={setShowForm}
//                             setEditingService={setEditingService}
//                             setReloadTrigger={setReloadTrigger}
//                             handleUpdate={handleUpdate}
//                         />
//                     )}
//                 </div>
//             </AdminWrapper>
//         </>
//     );
// };

// export default Services;


import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Star } from "lucide-react";
import AddServiceForm from "@/AddFormComponents/AddServiceForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditServiceForm from "@/EditFormComponents/EditServiceForm";

const Services = () => {
    const [allService, setAllService] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

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
        setShowEditForm(true);
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

    // Format date like "28 Jul 2025"
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
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
                                setShowAddForm(true);
                            }}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>

                    {/* Services List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allService?.map((service) => (
                            <div
                                key={service.id}
                                className="bg-[#fdf8ee] rounded-2xl overflow-hidden shadow-sm border border-[#f0e8d0] relative"
                            >
                                {/* Featured Ribbon - Left Side */}
                                {service.is_featured === 1 && (
                                    <>
                                        {/* Desktop Ribbon */}
                                        <div className="absolute top-0 left-0 z-10 hidden md:block">
                                            <div className="relative">
                                                <div className="absolute top-0 left-0 w-24 h-24 overflow-hidden">
                                                    <div className="absolute transform -rotate-45 bg-yellow-400 text-yellow-900 text-center font-bold py-1 left-[-35px] top-[19px] w-[150px] shadow-md flex items-center justify-center gap-1">
                                                        <Star size={14} className="fill-yellow-900" />
                                                        <span className="text-xs">FEATURED</span>
                                                        <Star size={14} className="fill-yellow-900" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Mobile Badge */}
                                        <div className="absolute top-2 left-2 z-10 md:hidden">
                                            <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full shadow-md flex items-center gap-1">
                                                <Star size={12} className="fill-yellow-900" />
                                                Featured
                                            </span>
                                        </div>
                                    </>
                                )}

                                {/* Action Buttons - Top right */}
                                <div className="absolute top-2 right-2 flex gap-2 z-20">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Image */}
                                {service.image && (
                                    <div className="w-full h-52 overflow-hidden">
                                        <img
                                            src={`${imgurl}/${service.image}`}
                                            alt={service.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-4">
                                    {/* Date */}
                                    <p className="text-sm text-gray-500 mb-2">
                                        {formatDate(service.created_at)}
                                    </p>

                                    {/* Name/Title */}
                                    <h3 className="text-lg font-extrabold uppercase text-[#c9882a] leading-snug mb-2 tracking-wide">
                                        {service.name}
                                    </h3>

                                    {/* Short Description */}
                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                        {service.short_description}
                                    </p>

                                    {/* Archived Badge - only shows if archived */}
                                    {service.is_archived === 1 && (
                                        <div className="mt-3">
                                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                                Archived
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {allService?.links && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex gap-2">
                                {allService.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (link.url && !link.active) {
                                                window.location.href = link.url;
                                            }
                                        }}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded ${
                                            link.active
                                                ? "bg-indigo-600 text-white"
                                                : link.url
                                                ? "bg-gray-200 hover:bg-gray-300"
                                                : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                        disabled={!link.url}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add Form */}
                    {showAddForm && (
                        <AddServiceForm
                            setShowForm={setShowAddForm}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}

                    {/* Edit Form */}
                    {showEditForm && editingService && (
                        <EditServiceForm
                            editingService={editingService}
                            setShowForm={setShowEditForm}
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