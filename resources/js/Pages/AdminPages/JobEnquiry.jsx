import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Trash2, Archive, ArchiveRestore } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

const JobEnquiry = () => {
    const [allJobEnquiry, setAllJobEnquiry] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [loading, setLoading] = useState(true);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    // Define columns for the table
    const columns = useMemo(
        () => [
            {
                Header: "SN",
                accessor: (row, index) => index + 1,
                id: "serial",
                width: 60,
            },
            {
                Header: "Full Name",
                accessor: "full_name",
            },
            {
                Header: "Email",
                accessor: "email",
            },
            {
                Header: "Phone",
                accessor: "phone_number",
            },
            {
                Header: "Job Position", // Changed from "Job ID" to "Job Position" for clarity
                accessor: "job", // Access the entire job object
                Cell: ({ value }) => {
                    // Check if job exists and has a title/name
                    if (value && value.job_title) {
                        return <span>{value.job_title}</span>;
                    } else if (value && value.title) {
                        // Fallback if your column name is 'title' instead of 'job_title'
                        return <span>{value.title}</span>;
                    } else if (value && value.name) {
                        // Another fallback
                        return <span>{value.name}</span>;
                    } else {
                        // If no job data, show the job_id as fallback
                        return (
                            <span className="text-gray-400">
                                Job ID: {value?.id || "N/A"}
                            </span>
                        );
                    }
                },
            },
            {
                Header: "CV",
                accessor: "cv",
                Cell: ({ value }) =>
                    value ? (
                        <a
                            href={`${imgurl}/${value}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            View CV
                        </a>
                    ) : (
                        <span className="text-gray-400">N/A</span>
                    ),
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
                            onClick={() => handleToggleArchive(row.original)}
                            className={`p-1.5 rounded-lg transition ${
                                row.original.is_archived
                                    ? "text-green-600 hover:bg-green-50"
                                    : "text-gray-600 hover:bg-gray-50"
                            }`}
                            title={
                                row.original.is_archived
                                    ? "Restore from archive"
                                    : "Archive"
                            }
                        >
                            {row.original.is_archived ? (
                                <ArchiveRestore size={16} />
                            ) : (
                                <Archive size={16} />
                            )}
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
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

    // Fetch job enquiries
    useEffect(() => {
        const fetchJobEnquiries = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourjobenquiry.index"));

                // Handle different response structures
                let enquiries = [];
                if (response.data?.data?.data) {
                    // Laravel pagination with data wrapper
                    enquiries = response.data.data.data;
                } else if (response.data?.data) {
                    // Direct data array
                    enquiries = response.data.data;
                } else if (Array.isArray(response.data)) {
                    // Plain array
                    enquiries = response.data;
                }

                setAllJobEnquiry(Array.isArray(enquiries) ? enquiries : []);
            } catch (error) {
                console.error("Fetching error:", error);
                setAllJobEnquiry([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobEnquiries();
    }, [reloadTrigger]);

    // Delete job enquiry
    const handleDelete = async (id) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this enquiry? This action cannot be undone.",
            )
        )
            return;

        try {
            await axios.delete(route("ourjobenquiry.destroy", { id }));
            setReloadTrigger((prev) => !prev);
            alert("Enquiry deleted successfully!");
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete enquiry. Please try again.");
        }
    };

    // Toggle archive status
    const handleToggleArchive = async (jobEnquiry) => {
        const newArchiveStatus = !jobEnquiry.is_archived;
        const action = newArchiveStatus ? "archive" : "restore from archive";

        if (!window.confirm(`Are you sure you want to ${action} this enquiry?`))
            return;

        try {
            // For archive toggle, we only need to update the is_archived field
            // Using FormData for consistency
            const formData = new FormData();
            formData.append("_method", "PUT");
            formData.append("is_archived", newArchiveStatus ? "1" : "0");

            // Also include the required fields to pass validation
            formData.append("job_id", jobEnquiry.job_id);
            formData.append("full_name", jobEnquiry.full_name);
            formData.append("email", jobEnquiry.email);
            formData.append("phone_number", jobEnquiry.phone_number);
            if (jobEnquiry.description) {
                formData.append("description", jobEnquiry.description);
            }

            await axios.post(
                route("ourjobenquiry.update", { id: jobEnquiry.id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            setReloadTrigger((prev) => !prev);
            alert(`Enquiry ${action}d successfully!`);
        } catch (error) {
            console.error(`Error toggling archive status:`, error);

            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                let errorMessage =
                    "Unable to update status. Please try again.\n";
                if (validationErrors) {
                    errorMessage += "Errors: ";
                    for (const field in validationErrors) {
                        errorMessage += `\n- ${field}: ${validationErrors[field].join(", ")}`;
                    }
                }
                alert(errorMessage);
            } else {
                alert(`Failed to ${action} enquiry. Please try again.`);
            }
        }
    };

    return (
        <AdminWrapper>
            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        Job Enquiries
                    </h1>
                </div>

                {/* MyTable Component */}
                <div className="bg-white rounded-lg shadow">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
                            <p className="text-gray-500 mt-2">
                                Loading enquiries...
                            </p>
                        </div>
                    ) : (
                        <MyTable columns={columns} data={allJobEnquiry} />
                    )}
                </div>

                {/* Empty state */}
                {!loading && allJobEnquiry.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No job enquiries found</p>
                    </div>
                )}
            </div>
        </AdminWrapper>
    );
};

export default JobEnquiry;
