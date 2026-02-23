import AddJobForm from "@/AddFormComponents/AddJobForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import axios from "axios";
import { Plus } from "lucide-react";
import React, { useEffect, useState } from "react";

const Jobs = () => {
    const [showForm, setShowForm] = useState(false);
    const [allJobs, setAllJobs] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingJob, setEditingJob] = useState(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await axios.get(route("ourjob.index"));
                // Laravel paginate wraps results in response.data.data.data
                setAllJobs(response.data.data.data);
            } catch (error) {
                console.error("fetching error ", error);
            }
        };
        fetchJob();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(
                route("ourjob.destroy", { id: id })
            );
            console.log(response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setShowForm(true); // ← was missing
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourjob.update", { id }),
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            setReloadTrigger((prev) => !prev);
            return response.data;
        } catch (error) {
            console.log("Error updating job", error);
            throw error;
        }
    };

    return (
        <AdminWrapper>
            <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Jobs page
                    </h1>
                    <button
                        onClick={() => {
                            setEditingJob(null); // reset edit state for new job
                            setShowForm(true);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                {/* Jobs list */}
                <div className="grid gap-4">
                    {allJobs.map((job) => (
                        <div
                            key={job.id}
                            className="border rounded-lg p-4 flex justify-between items-start bg-white shadow-sm"
                        >
                            <div>
                                <h2 className="font-semibold text-lg">{job.title}</h2>
                                <p className="text-gray-500 text-sm">{job.short_description}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(job)}
                                    className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded-full hover:bg-yellow-200 transition"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(job.id)}
                                    className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showForm && (
                    <AddJobForm
                        setShowForm={setShowForm}
                        editingJob={editingJob}
                        setEditingJob={setEditingJob} // ← was missing
                        handleUpdate={handleUpdate}
                        setReloadTrigger={setReloadTrigger}
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default Jobs;