import AddPdfForm from "@/AddFormComponents/AddPdfForm";
import AdminWrapper from "@/AdminWrapper/AdminWrapper";
import MyTable from "@/MyTable/MyTable";
import axios from "axios";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { RPConfig, RPProvider, RPDefaultLayout, RPPages } from "@pdf-viewer/react";

const PdfViewer = () => {
    const [allPdf, setAllPdf] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingPdf, setEditingPdf] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchPdf = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourpdfs.index"));
                setAllPdf(response.data);
            } catch (error) {
                console.error("Fetching error:", error);
                alert("Failed to fetch PDFs. Please refresh the page.");
            } finally {
                setLoading(false);
            }
        };
        fetchPdf();
    }, [reloadTrigger]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this PDF?")) return;
        try {
            await axios.delete(route("ourpdfs.destroy", { id }));
            setReloadTrigger((prev) => !prev);
            if (selectedPdf?.id === id) {
                setSelectedPdf(null);
            }
            alert("PDF deleted successfully!");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete PDF. Please try again.");
        }
    };

    const handleEdit = (pdf) => {
        setEditingPdf(pdf);
        setShowForm(true);
        setSelectedPdf(null);
    };

    const handleUpdate = async (formData, id) => {
        try {
            formData.append("_method", "PUT");
            const response = await axios.post(
                route("ourpdfs.update", { id }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                    },
                }
            );
            setReloadTrigger((prev) => !prev);
            alert("PDF updated successfully!");
            return response.data;
        } catch (error) {
            console.error("Update error:", error);
            throw error;
        }
    };

    const handleViewPdf = (pdf) => {
        setSelectedPdf(pdf);
    };

    const closePdfViewer = () => {
        setSelectedPdf(null);
    };

    const columns = useMemo(
        () => [
            {
                Header: "#",
                accessor: (row, index) => index + 1,
                id: "serial",
            },
            {
                Header: "Title",
                accessor: "title",
                Cell: ({ value }) => (
                    <span className="font-medium text-gray-900">{value}</span>
                ),
            },
            {
                Header: "Description",
                accessor: "description",
                Cell: ({ value }) => (
                    <span className="text-gray-500 max-w-xs truncate block">
                        {value || "—"}
                    </span>
                ),
            },
            {
                Header: "File",
                accessor: "pdf",
                Cell: ({ row }) => (
                    <button
                        onClick={() => handleViewPdf(row.original)}
                        className="text-indigo-600 hover:underline focus:outline-none"
                    >
                        View PDF
                    </button>
                ),
            },
            {
                Header: "Actions",
                id: "actions",
                Cell: ({ row }) => (
                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                            title="Edit"
                        >
                            <Pencil size={16} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition"
                            title="Delete"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    return (
        <AdminWrapper>
            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                        PDF Viewer
                    </h1>
                    <button
                        onClick={() => {
                            setEditingPdf(null);
                            setShowForm(true);
                            setSelectedPdf(null);
                        }}
                        className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Create</span>
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
                        <p className="mt-2 text-gray-500">Loading PDFs...</p>
                    </div>
                )}

                {/* PDF Table */}
                {!loading && allPdf.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 border rounded-xl border-gray-200">
                        No PDFs found. Click "Create" to add one.
                    </div>
                ) : (
                    !loading && <MyTable columns={columns} data={allPdf} />
                )}

                {/* PDF Preview Section with @pdf-viewer/react */}
                {selectedPdf && (
                    <div className="mt-8 border rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {selectedPdf.title}
                                </h3>
                                {selectedPdf.description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {selectedPdf.description}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={closePdfViewer}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-200 transition"
                                title="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* @pdf-viewer/react usage */}
                        <RPConfig>
                            <RPProvider src={`/storage/${selectedPdf.pdf}`}>
                                <RPDefaultLayout style={{ height: "600px", width: "100%" }}>
                                    <RPPages />
                                </RPDefaultLayout>
                            </RPProvider>
                        </RPConfig>
                    </div>
                )}

                {/* Modal Form */}
                {showForm && (
                    <AddPdfForm
                        editingPdf={editingPdf}
                        setEditingPdf={setEditingPdf}
                        setShowForm={setShowForm}
                        handleUpdate={handleUpdate}
                        setReloadTrigger={setReloadTrigger}
                    />
                )}
            </div>
        </AdminWrapper>
    );
};

export default PdfViewer;