import AddJobForm from "@/AddFormComponents/AddJobForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

const Jobs = () => {
    const [showForm, setShowForm] = useState(false);
    const [allJobs, setAllJobs] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(route("ourjob.index"));
                setAllJobs(response.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchJob();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("ourjob.destroy", { id: id }),
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setShowForm(true);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourjob.update", { id }),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating job", error);
            throw error;
        }
    };

    // Define columns for the table
    const columns = useMemo(
        () => [
            {
                Header: "ID",
                accessor: "id",
            },
            {
                Header: "Title",
                accessor: "title",
            },
            {
                Header: "Short Description",
                accessor: "short_description",
                Cell: ({ value }) => (
                    <div className="max-w-md truncate">
                        {value || "No description"}
                    </div>
                ),
            },
            // {
            //     Header: "Location",
            //     accessor: "location",
            //     Cell: ({ value }) => value || "Not specified",
            // },

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
                Header: "Created At",
                accessor: "created_at",
                Cell: ({ value }) =>
                    value ? new Date(value).toLocaleDateString() : "N/A",
            },
            {
                Header: "Actions",
                accessor: "actions",
                Cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-1.5 text-yellow-600 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 rounded-full transition"
                            title="Edit"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-full transition"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <AdminWrapper>
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Jobs Management
                    </h1>
                    <button
                        onClick={() => {
                            setEditingJob(null);
                            setShowForm(true);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Create New Job</span>
                    </button>
                </div>

                {/* Jobs table */}
                {allJobs.length > 0 ? (
                    <MyTable columns={columns} data={allJobs} />
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-blue-100">
                        <p className="text-gray-500">No jobs found</p>
                        <button
                            onClick={() => {
                                setEditingJob(null);
                                setShowForm(true);
                            }}
                            className="mt-4 px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Create your first job
                        </button>
                    </div>
                )}

                {showForm && (
                    <AddJobForm
                        setShowForm={setShowForm}
                        editingJob={editingJob}
                        setEditingJob={setEditingJob}
                        handleUpdate={handleUpdate}
                        setReloadTrigger={setReloadTrigger}
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default Jobs;
