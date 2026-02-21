import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import AddBlogForm from "@/AddFormComponents/AddBlogForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";

const Blog = () => {
    const [allBlog, setAllBlog] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [showForm, setShowForm] = useState(false);

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

    // handleedit
    const handleEdit = (blog) => {
        setEditingBlog(blog);
        setShowForm(true);
    };

    // Handle update after the edit
    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourblog.update", { id }),
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
            console.log("Error updating blog", error);
            throw error;
        }
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
                                setShowForm(true);
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
                            <div key={blog.id} className="bg-white rounded-lg shadow-md p-4">
                                {blog.image && (
                                    <img 
                                        src={`/storage/${blog.image}`} 
                                        alt={blog.title}
                                        className="w-full h-48 object-cover rounded-lg mb-4"
                                    />
                                )}
                                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                                <p className="text-gray-600 mb-2 line-clamp-2">{blog.short_description}</p>
                                <p className="text-sm text-gray-500 mb-4">Slug: {blog.slug}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(blog)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(blog.id)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
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
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded ${
                                            link.active 
                                                ? 'bg-indigo-600 text-white' 
                                                : link.url 
                                                    ? 'bg-gray-200 hover:bg-gray-300' 
                                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                        disabled={!link.url}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {showForm && (
                        <AddBlogForm
                            editingBlog={editingBlog}
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

export default Blog;