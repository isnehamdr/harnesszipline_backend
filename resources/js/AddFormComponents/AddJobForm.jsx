import axios from "axios";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react"; // ← all missing imports added

const AddJobForm = ({
    setShowForm,
    editingJob,
    setEditingJob, // ← now received
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [jobForm, setJobForm] = useState({
        title: "",
        short_description: "",
        content: "",
        meta_data: "",
        is_archived: false,
    });

    useEffect(() => {
        if (editingJob) {
            setJobForm({
                ...editingJob,
                image: null,
            });
        } else {
            setJobForm({
                title: "",
                short_description: "",
                content: "",
                meta_data: "",
                is_archived: false,
            });
        }
    }, [editingJob]);

    const handleCreate = async (formData) => {
        try {
            await axios.post(route("ourjob.store"), formData, { // ← fixed route name
                headers: { "Content-Type": "multipart/form-data" },
            });
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating job", error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        for (const key in jobForm) {
            if (jobForm[key] !== null && jobForm[key] !== "") {
                formData.append(key, jobForm[key]);
            }
        }
        try {
            setSubmitting(true);
            if (editingJob) {
                await handleUpdate(formData, editingJob.id);
            } else {
                await handleCreate(formData);
            }
            setJobForm({
                title: "",
                short_description: "",
                content: "",
                meta_data: "",
                is_archived: false,
            });
            setShowForm(false);
            setEditingJob(null); // ← now works because prop is passed
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setJobForm((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingJob ? "Edit Job" : "Add New Job"}
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditingJob(null); // ← clean up on close too
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={jobForm.title}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <input
                            type="text"
                            name="short_description"
                            value={jobForm.short_description}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <textarea
                            name="content"
                            value={jobForm.content}
                            onChange={handleChange}
                            rows={5}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meta Data
                        </label>
                        <input
                            type="text"
                            name="meta_data"
                            value={jobForm.meta_data}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="is_archived"
                            id="is_archived"
                            checked={jobForm.is_archived}
                            onChange={(e) =>
                                setJobForm((prev) => ({
                                    ...prev,
                                    is_archived: e.target.checked,
                                }))
                            }
                            className="w-4 h-4 accent-indigo-600"
                        />
                        <label htmlFor="is_archived" className="text-sm text-gray-700">
                            Archived
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingJob(null);
                            }}
                            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm disabled:opacity-50"
                        >
                            {submitting
                                ? "Saving..."
                                : editingJob
                                ? "Update Job"
                                : "Create Job"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddJobForm;