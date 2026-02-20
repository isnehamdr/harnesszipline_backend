import AdminWrapper from '@/AdminWrapper/AdminWrapper';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, Star, Plus } from 'lucide-react';
import AddTestimonialForm from '@/AddFormComponents/AddTestimonialForm';
import MyTable from '@/MyTable/MyTable';


const Testimonial = () => {
    const [showForm, setShowForm] = useState(false);
    const [allTestimonials, setAllTestimonials] = useState([]);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [loading, setLoading] = useState(true);

    // For fetching the testimonial data
    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourtestimonials.index"));
                setAllTestimonials(response.data.data || []);
            } catch (error) {
                console.error("fetching error ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTestimonials();
    }, [reloadTrigger]);

    // For delete the testimonial
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            try {
                const response = await axios.delete(
                    route("ourtestimonials.destroy", { id: id })
                );
                console.log(response.data);
                setReloadTrigger((prev) => !prev);
            } catch (error) {
                console.log(error);
            }
        }
    };

    // handle edit
    const handleEdit = (testimonial) => {
        setEditingTestimonial(testimonial);
        setShowForm(true);
    };

    // Handle add new
    const handleAddNew = () => {
        setEditingTestimonial(null);
        setShowForm(true);
    };

    // Define columns for the table
    const columns = React.useMemo(
        () => [
            {
                Header: 'S.No',
                accessor: (row, index) => index + 1,
                id: 'serialNo',
            },
            {
                Header: 'Full Name',
                accessor: 'fullname',
            },
            {
                Header: 'Address',
                accessor: 'address',
                Cell: ({ value }) => value || '-',
            },
            {
                Header: 'Short Description',
                accessor: 'short_description',
                Cell: ({ value }) => (
                    <div className="max-w-xs truncate">
                        {value || '-'}
                    </div>
                ),
            },
            {
                Header: 'Status',
                accessor: 'is_archived',
                Cell: ({ value }) => (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        value 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-green-100 text-green-800'
                    }`}>
                        {value ? 'Archived' : 'Active'}
                    </span>
                ),
            },
            {
                Header: 'Featured',
                accessor: 'is_featured',
                Cell: ({ value }) => (
                    value ? (
                        <Star className="text-yellow-500 fill-current" size={20} />
                    ) : (
                        <Star className="text-gray-300" size={20} />
                    )
                ),
            },
            {
                Header: 'Actions',
                accessor: 'id',
                Cell: ({ row }) => (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => handleEdit(row.original)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit"
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        [] // Empty dependency array since handleEdit and handleDelete are stable
    );

    if (loading) {
        return (
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-gray-500">Loading testimonials...</div>
                    </div>
                </div>
            </AdminWrapper>
        );
    }

    return (
        <>
            <AdminWrapper>
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Testimonials</h1>
                        <button
                            onClick={handleAddNew}
                            className="px-4 py-2 flex items-center gap-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                        >
                            <Plus size={20} />
                            Create
                        </button>
                    </div>

                    {/* Use MyTable component */}
                    <MyTable
                        columns={columns} 
                        data={allTestimonials} 
                    />

                    {/* Form Modal */}
                    {showForm && (
                        <AddTestimonialForm
                            setShowForm={setShowForm}
                            editingTestimonial={editingTestimonial}
                            setEditingTestimonial={setEditingTestimonial}
                            setReloadTrigger={setReloadTrigger}
                        />
                    )}
                </div>
            </AdminWrapper>
        </>
    );
};

export default Testimonial;