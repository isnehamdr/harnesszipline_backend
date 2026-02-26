// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Plus, Edit, Trash2 } from "lucide-react";
// import AddBlogForm from "@/AddFormComponents/AddBlogForm";
// import AdminWrapper from "@/AdminWrapper/AdminWrapper";

// const Blog = () => {
//     const [allBlog, setAllBlog] = useState([]);
//     const [reloadTrigger, setReloadTrigger] = useState(false);
//     const [editingBlog, setEditingBlog] = useState(null);
//     const [showForm, setShowForm] = useState(false);

//     // For fetching the blog data
//     useEffect(() => {
//         const fetchBlog = async () => {
//             try {
//                 const response = await axios.get(route("ourblog.index"));
//                 setAllBlog(response.data);
//             } catch (error) {
//                 console.error("fetching error ", error);
//             }
//         };

//         fetchBlog();
//     }, [reloadTrigger]);

//     // For delete the blog
//     const handleDelete = async (id) => {
//         if (window.confirm("Are you sure you want to delete this blog?")) {
//             try {
//                 const response = await axios.delete(
//                     route("ourblog.destroy", { id: id }),
//                 );
//                 console.log(response.data);
//                 setReloadTrigger((prev) => !prev);
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//     };

//     // handleedit
//     const handleEdit = (blog) => {
//         setEditingBlog(blog);
//         setShowForm(true);
//     };

//     // Handle update after the edit
//     const handleUpdate = async (formData, id) => {
//         try {
//             formData.append("_method", "PUT");
//             const response = await axios.post(
//                 route("ourblog.update", { id }),
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
//             console.log("Error updating blog", error);
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
//                             Blog Page
//                         </h1>
//                         <button
//                             onClick={() => {
//                                 setEditingBlog(null);
//                                 setShowForm(true);
//                             }}
//                             className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
//                         >
//                             <Plus size={18} />
//                             <span>Create</span>
//                         </button>
//                     </div>

//                     {/* Blog List */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {allBlog?.data?.data?.map((blog) => (
//                             <div
//                                 key={blog.id}
//                                 className="bg-[#fdf8ee] rounded-2xl overflow-hidden shadow-sm border border-[#f0e8d0] relative"
//                             >
//                                 {/* Action Buttons - Top  */}
//                                 <div className="absolute top-2 right-2 flex gap-2 z-10">
//                                     <button
//                                         onClick={() => handleEdit(blog)}
//                                         className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
//                                         title="Edit"
//                                     >
//                                         <Edit size={16} />
//                                     </button>
//                                     <button
//                                         onClick={() => handleDelete(blog.id)}
//                                         className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
//                                         title="Delete"
//                                     >
//                                         <Trash2 size={16} />
//                                     </button>
//                                 </div>

//                                 {/* Image */}
//                                 {blog.image && (
//                                     <div className="w-full h-52 overflow-hidden">
//                                         <img
//                                             src={`/storage/${blog.image}`}
//                                             alt={blog.title}
//                                             className="w-full h-full object-cover"
//                                         />
//                                     </div>
//                                 )}

//                                 {/* Content */}
//                                 <div className="p-4">
//                                     {/* Date */}
//                                     <p className="text-sm text-gray-500 mb-2">
//                                         {formatDate(blog.created_at)}
//                                     </p>

//                                     {/* Title */}
//                                     <h3 className="text-lg font-extrabold uppercase text-[#c9882a] leading-snug mb-2 tracking-wide">
//                                         {blog.title}
//                                     </h3>

//                                     {/* Short Description */}
//                                     <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
//                                         {blog.short_description}
//                                     </p>
//                                     {blog.is_archived === true && (
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
//                     {allBlog?.links && (
//                         <div className="mt-6 flex justify-center">
//                             <div className="flex gap-2">
//                                 {allBlog.links.map((link, index) => (
//                                     <button
//                                         key={index}
//                                         onClick={() => {
//                                             if (link.url && !link.active) {
//                                                 window.location.href = link.url;
//                                             }
//                                         }}
//                                         dangerouslySetInnerHTML={{
//                                             __html: link.label,
//                                         }}
//                                         className={`px-3 py-1 rounded ${
//                                             link.active
//                                                 ? "bg-indigo-600 text-white"
//                                                 : link.url
//                                                   ? "bg-gray-200 hover:bg-gray-300"
//                                                   : "bg-gray-100 text-gray-400 cursor-not-allowed"
//                                         }`}
//                                         disabled={!link.url}
//                                     />
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {showForm && (
//                         <AddBlogForm
//                             editingBlog={editingBlog}
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

// export default Blog;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Edit, Trash2 } from "lucide-react";
import AddBlogForm from "@/AddFormComponents/AddBlogForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import EditBlogForm from "@/EditFormComponents/EditBlogForm";

const Blog = () => {
    const [allBlog, setAllBlog] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    // For fetching the blog data
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(route("ourblog.index"));
                setAllBlog(response.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };

        fetchBlog();
    }, [reloadTrigger]);

    // For delete the blog
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            try {
                const response = await axios.delete(
                    route("ourblog.destroy", { id: id }),
                );
                console.log(response.data);
                setReloadTrigger((prev) => !prev);
            } catch (error) {
                console.log(error);
            }
        }
    };

    // handle edit
    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setShowEditForm(true);
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
                            Blog Page
                        </h1>
                        <button
                            onClick={() => {
                                setEditingBlog(null);
                                setShowAddForm(true);
                            }}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={18} />
                            <span>Create</span>
                        </button>
                    </div>

                    {/* Blog List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {allBlog?.data?.data?.map((blog) => (
                            <div
                                key={blog.id}
                                className="bg-[#fdf8ee] rounded-2xl overflow-hidden shadow-sm border border-[#f0e8d0] relative"
                            >
                                {/* Action Buttons - Top  */}
                                <div className="absolute top-2 right-2 flex gap-2 z-10">
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition shadow-md"
                                        title="Edit"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>

                                {/* Image */}
                                {blog.image && (
                                    <div className="w-full h-52 overflow-hidden">
                                        <img
                                            src={`${imgurl}/${blog.image}`}
                                            alt={blog.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Content */}
                                <div className="p-4">
                                    {/* Date */}
                                    <p className="text-sm text-gray-500 mb-2">
                                        {formatDate(blog.created_at)}
                                    </p>

                                    {/* Title */}
                                    <h3 className="text-lg font-extrabold uppercase text-[#c9882a] leading-snug mb-2 tracking-wide">
                                        {blog.title}
                                    </h3>

                                    {/* Short Description */}
                                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                                        {blog.short_description}
                                    </p>
                                    {blog.is_archived === true && (
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
                    {allBlog?.links && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex gap-2">
                                {allBlog.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (link.url && !link.active) {
                                                window.location.href = link.url;
                                            }
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
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
                        <AddBlogForm
                            setShowForm={setShowAddForm}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}

                    {/* Edit Form */}
                    {showEditForm && (
                        <EditBlogForm
                            editingBlog={editingBlog}
                            setShowForm={setShowEditForm}
                            setEditingBlog={setEditingBlog}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default Blog;