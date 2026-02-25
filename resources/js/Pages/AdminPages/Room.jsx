


// Room.jsx
// Room.jsx
// import AddRoomForm from "@/AddFormComponents/AddRoomForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";
// import MyTable from "@/MyTable/MyTable";
// import axios from "axios";
// import { Plus, Pencil, Trash2, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';

// const Room = () => {
//     const [showForm, setShowForm] = useState(false);
//     const [allRoom, setAllRoom] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingRoom, setEditingRoom] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [showDetailsModal, setShowDetailsModal] = useState(false);
//     const [selectedRoom, setSelectedRoom] = useState(null);
//     const [activeImageIndex, setActiveImageIndex] = useState(0);
    
//     // Refs for custom navigation
//     const prevRef = useRef(null);
//     const nextRef = useRef(null);
//     const [swiperReady, setSwiperReady] = useState(false);

//     // For fetching the room data
//     useEffect(() => {
//         const fetchRoom = async () => {
//             setLoading(true);
//             try {
//                 const response = await axios.get(route("ourroom.index"));
//                 setAllRoom(response.data.data || response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchRoom();
//     }, [reloadTrigger]);

//     // For delete the room
//     const handleDelete = async (id) => {
//         if (!confirm("Are you sure you want to delete this room?")) return;
        
//         try {
//             await axios.delete(route("ourroom.destroy", { id: id }));
//             setReloadTrigger((prev) => !prev);
//         } catch (error) {
//             console.log(error);
//         }
//     };

//     // handle edit
//     const handleEdit = (room) => {
//         setEditingRoom(room);
//         setShowForm(true);
//     };

//     // handle view details
//     const handleViewDetails = (room) => {
//         setSelectedRoom(room);
//         setActiveImageIndex(0);
//         setShowDetailsModal(true);
//     };

//     // Handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourroom.update", { id }),
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
//             console.log("Error updating room", error);
//             throw error;
//         }
//     };

//     // Helper function to get image URL
//     const getImageUrl = (imagePath) => {
//         if (!imagePath) return null;
        
//         if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//             return imagePath;
//         }
        
//         let cleanPath = imagePath.replace(/^\/+/, '');
//         cleanPath = cleanPath.replace(/^storage\//, '');
        
//         return `/storage/${cleanPath}`;
//     };

//     // Define columns for the table
//     const columns = useMemo(
//         () => [
//             {
//                 Header: "SN",
//                 accessor: (row, i) => i + 1,
//                 id: "rowIndex",
//                 width: 60,
//             },
//             {
//                 Header: 'Name',
//                 accessor: 'name',
//             },
//             {
//                 Header: 'Room Type',
//                 accessor: (row) => row.room_type?.name || 'N/A',
//                 id: 'room_type',
//             },
//             {
//                 Header: 'Price',
//                 accessor: 'price',
//                 Cell: ({ value }) => `NPR ${value}`,
//             },
//             // {
//             //     Header: 'Featured',
//             //     accessor: 'is_featured',
//             //     Cell: ({ value }) => (
//             //         <span className={`px-2 py-1 text-xs rounded-full ${
//             //             value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//             //         }`}>
//             //             {value ? 'Featured' : 'Regular'}
//             //         </span>
//             //     ),
//             // },
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
//                 Header: 'Actions',
//                 accessor: 'id',
//                 Cell: ({ row }) => (
//                     <div className="flex gap-2">
//                         <button
//                             onClick={() => handleViewDetails(row.original)}
//                             className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition"
//                             title="View Details"
//                         >
//                             <Eye size={18} />
//                         </button>
//                         <button
//                             onClick={() => handleEdit(row.original)}
//                             className="text-indigo-600 hover:text-indigo-900 p-1 rounded-md hover:bg-indigo-50 transition"
//                             title="Edit"
//                         >
//                             <Pencil size={18} />
//                         </button>
//                         <button
//                             onClick={() => handleDelete(row.original.id)}
//                             className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition"
//                             title="Delete"
//                         >
//                             <Trash2 size={18} />
//                         </button>
//                     </div>
//                 ),
//             },
//         ],
//         []
//     );

//     return (
//         <>
//             <AdminWrapper>
//                 <div className="p-6">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//                         <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
//                             Rooms
//                         </h1>
//                         <button
//                             onClick={() => {
//                                 setEditingRoom(null);
//                                 setShowForm(true);
//                             }}
//                             className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
//                         >
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>

//                     {/* Rooms Table */}
//                     {loading ? (
//                         <div className="bg-white rounded-lg shadow p-8 text-center">
//                             <p className="text-gray-500">Loading rooms...</p>
//                         </div>
//                     ) : allRoom.length === 0 ? (
//                         <div className="bg-white rounded-lg shadow p-8 text-center">
//                             <p className="text-gray-500">No rooms found</p>
//                         </div>
//                     ) : (
//                         <MyTable
//                             columns={columns} 
//                             data={allRoom} 
//                         />
//                     )}

//                     {/* Details Modal with Custom Navigation */}
//                     {showDetailsModal && selectedRoom && (
//                         <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
//                             <div className="flex items-center justify-center min-h-screen px-4 py-8">
//                                 <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//                                     {/* Header */}
//                                     <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 bg-white border-b">
//                                         <h2 className="text-2xl font-bold text-gray-900">
//                                             {selectedRoom.name}
//                                         </h2>
//                                         <button
//                                             onClick={() => setShowDetailsModal(false)}
//                                             className="p-2 hover:bg-gray-100 rounded-full transition"
//                                         >
//                                             <X size={24} />
//                                         </button>
//                                     </div>

//                                     <div className="p-6">
//                                         {/* Main Image */}
//                                         <div className="relative mb-8">
//                                             {selectedRoom.images && selectedRoom.images.length > 0 ? (
//                                                 <div className="relative">
//                                                     <img
//                                                         src={getImageUrl(selectedRoom.images[activeImageIndex]?.image)}
//                                                         alt={`${selectedRoom.name} - Main View`}
//                                                         className="w-full h-96 object-cover rounded-lg shadow-lg"
//                                                         onError={(e) => {
//                                                             e.target.onerror = null;
//                                                             e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
//                                                         }}
//                                                     />
//                                                     <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
//                                                         {activeImageIndex + 1} / {selectedRoom.images.length}
//                                                     </div>
//                                                 </div>
//                                             ) : (
//                                                 <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
//                                                     <span className="text-gray-400">No Image Available</span>
//                                                 </div>
//                                             )}
//                                         </div>

//                                         {/* Thumbnail Slider with Custom Navigation */}
//                                         {selectedRoom.images && selectedRoom.images.length > 0 && (
//                                             <div className="relative px-8 group">
//                                                 {/* Custom Navigation Buttons */}
//                                                 <button
//                                                     ref={prevRef}
//                                                     className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-indigo-600 text-gray-800 hover:text-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
//                                                     aria-label="Previous slide"
//                                                 >
//                                                     <ChevronLeft size={24} />
//                                                 </button>
//                                                 <button
//                                                     ref={nextRef}
//                                                     className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-indigo-600 text-gray-800 hover:text-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
//                                                     aria-label="Next slide"
//                                                 >
//                                                     <ChevronRight size={24} />
//                                                 </button>

//                                                 {/* Swiper */}
//                                                 <Swiper
//                                                     modules={[Navigation]}
//                                                     navigation={{
//                                                         prevEl: prevRef.current,
//                                                         nextEl: nextRef.current,
//                                                     }}
//                                                     onBeforeInit={(swiper) => {
//                                                         // Initialize navigation refs
//                                                         if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
//                                                             swiper.params.navigation.prevEl = prevRef.current;
//                                                             swiper.params.navigation.nextEl = nextRef.current;
//                                                         }
//                                                         setSwiperReady(true);
//                                                     }}
//                                                     spaceBetween={16}
//                                                     slidesPerView={2}
//                                                     breakpoints={{
//                                                         640: { slidesPerView: 3 },
//                                                         768: { slidesPerView: 4 },
//                                                         1024: { slidesPerView: 5 },
//                                                     }}
//                                                     className="room-thumbnail-slider"
//                                                 >
//                                                     {selectedRoom.images.map((img, index) => (
//                                                         <SwiperSlide key={index}>
//                                                             <div className="cursor-pointer" onClick={() => setActiveImageIndex(index)}>
//                                                                 <img
//                                                                     src={getImageUrl(img.image)}
//                                                                     className={`w-full h-24 object-cover rounded-lg transition-all border-2 ${
//                                                                         activeImageIndex === index 
//                                                                             ? 'border-indigo-600 opacity-100' 
//                                                                             : 'border-transparent opacity-70 hover:opacity-100'
//                                                                     }`}
//                                                                     alt={`${selectedRoom.name} - ${index + 1}`}
//                                                                     onError={(e) => {
//                                                                         e.target.onerror = null;
//                                                                         e.target.src = "https://via.placeholder.com/200x150?text=No+Image";
//                                                                     }}
//                                                                 />
//                                                             </div>
//                                                         </SwiperSlide>
//                                                     ))}
//                                                 </Swiper>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {showForm && (
//                         <AddRoomForm
//                             editingRoom={editingRoom}
//                             setShowForm={setShowForm}
//                             handleUpdate={handleUpdate}
//                             setReloadTrigger={setReloadTrigger}
//                             setEditingRoom={setEditingRoom}
//                             reloadTrigger={reloadTrigger}
//                         />
//                     )}
//                 </div>
//             </AdminWrapper>

//             {/* Add custom styles for better navigation experience */}
//             {/* <style jsx>{`
//                 .room-thumbnail-slider {
//                     padding: 4px 0;
//                 }
//                 .room-thumbnail-slider .swiper-button-disabled {
//                     opacity: 0.3;
//                     cursor: not-allowed;
//                 }
//             `}</style> */}
//         </>
//     );
// };

// export default Room;



import AddRoomForm from "@/AddFormComponents/AddRoomForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus, Pencil, Trash2, Eye, X, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import EditRoomForm from "@/EditFormComponents/EditRoomForm";

const Room = () => {
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [allRoom, setAllRoom] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingRoom, setEditingRoom] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    
    // Refs for custom navigation
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const [swiperReady, setSwiperReady] = useState(false);

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
        setShowEditForm(true);
    };

    // handle view details
    const handleViewDetails = (room) => {
        setSelectedRoom(room);
        setActiveImageIndex(0);
        setShowDetailsModal(true);
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

    // Helper function to get image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }
        
        let cleanPath = imagePath.replace(/^\/+/, '');
        cleanPath = cleanPath.replace(/^storage\//, '');
        
        return `/storage/${cleanPath}`;
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
                Cell: ({ value }) => `NPR ${value}`,
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
                Header: 'Actions',
                accessor: 'id',
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleViewDetails(row.original)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition"
                            title="View Details"
                        >
                            <Eye size={18} />
                        </button>
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
                            <span>Create</span>
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

                    {/* Details Modal with Custom Navigation */}
                    {showDetailsModal && selectedRoom && (
                        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50">
                            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                                <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                    {/* Header */}
                                    <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 bg-white border-b">
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {selectedRoom.name}
                                        </h2>
                                        <button
                                            onClick={() => setShowDetailsModal(false)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition"
                                        >
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="p-6">
                                        {/* Main Image */}
                                        <div className="relative mb-8">
                                            {selectedRoom.images && selectedRoom.images.length > 0 ? (
                                                <div className="relative">
                                                    <img
                                                        src={getImageUrl(selectedRoom.images[activeImageIndex]?.image)}
                                                        alt={`${selectedRoom.name} - Main View`}
                                                        className="w-full h-96 object-cover rounded-lg shadow-lg"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = "https://via.placeholder.com/800x600?text=No+Image";
                                                        }}
                                                    />
                                                    <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                                                        {activeImageIndex + 1} / {selectedRoom.images.length}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-gray-400">No Image Available</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Thumbnail Slider with Custom Navigation */}
                                        {selectedRoom.images && selectedRoom.images.length > 0 && (
                                            <div className="relative px-8 group">
                                                {/* Custom Navigation Buttons */}
                                                <button
                                                    ref={prevRef}
                                                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-indigo-600 text-gray-800 hover:text-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    aria-label="Previous slide"
                                                >
                                                    <ChevronLeft size={24} />
                                                </button>
                                                <button
                                                    ref={nextRef}
                                                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-indigo-600 text-gray-800 hover:text-white p-2 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
                                                    aria-label="Next slide"
                                                >
                                                    <ChevronRight size={24} />
                                                </button>

                                                {/* Swiper */}
                                                <Swiper
                                                    modules={[Navigation]}
                                                    navigation={{
                                                        prevEl: prevRef.current,
                                                        nextEl: nextRef.current,
                                                    }}
                                                    onBeforeInit={(swiper) => {
                                                        // Initialize navigation refs
                                                        if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
                                                            swiper.params.navigation.prevEl = prevRef.current;
                                                            swiper.params.navigation.nextEl = nextRef.current;
                                                        }
                                                        setSwiperReady(true);
                                                    }}
                                                    spaceBetween={16}
                                                    slidesPerView={2}
                                                    breakpoints={{
                                                        640: { slidesPerView: 3 },
                                                        768: { slidesPerView: 4 },
                                                        1024: { slidesPerView: 5 },
                                                    }}
                                                    className="room-thumbnail-slider"
                                                >
                                                    {selectedRoom.images.map((img, index) => (
                                                        <SwiperSlide key={index}>
                                                            <div className="cursor-pointer" onClick={() => setActiveImageIndex(index)}>
                                                                <img
                                                                    src={getImageUrl(img.image)}
                                                                    className={`w-full h-24 object-cover rounded-lg transition-all border-2 ${
                                                                        activeImageIndex === index 
                                                                            ? 'border-indigo-600 opacity-100' 
                                                                            : 'border-transparent opacity-70 hover:opacity-100'
                                                                    }`}
                                                                    alt={`${selectedRoom.name} - ${index + 1}`}
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = "https://via.placeholder.com/200x150?text=No+Image";
                                                                    }}
                                                                />
                                                            </div>
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Form */}
                    {showForm && (
                        <AddRoomForm
                            setShowForm={setShowForm}
                            setReloadTrigger={setReloadTrigger}
                            reloadTrigger={reloadTrigger}
                        />
                    )}

                    {/* Edit Form */}
                    {showEditForm && editingRoom && (
                        <EditRoomForm
                            editingRoom={editingRoom}
                            setShowForm={setShowEditForm}
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