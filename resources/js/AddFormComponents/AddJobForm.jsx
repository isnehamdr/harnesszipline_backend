import axios from "axios";
import { X, Archive, Code } from "lucide-react";
import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Import Ace Editor components
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

const AddJobForm = ({
    setShowForm,
    editingJob,
    setEditingJob,
    setReloadTrigger,
    handleUpdate,
}) => {
    const [submitting, setSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [metaDataValid, setMetaDataValid] = useState(true);
    const [metaDataError, setMetaDataError] = useState("");
    const [jobForm, setJobForm] = useState({
        title: "",
        short_description: "",
        content: "",
        meta_data: "",
        is_archived: false,
    });

    // Add useEffect to lock body scroll when form mounts
    useEffect(() => {
        // Lock body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.width = '100%';
        
        // Cleanup function to restore scroll when component unmounts
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
        };
    }, []);

    // Quill modules configuration
    const quillModules = {
        toolbar: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "list",
        "bullet",
        "indent",
        "align",
        "link",
        "image",
    ];

    // Validate JSON
    const validateJSON = (jsonString) => {
        if (!jsonString || jsonString.trim() === "") {
            setMetaDataValid(true);
            setMetaDataError("");
            return true;
        }
        
        try {
            JSON.parse(jsonString);
            setMetaDataValid(true);
            setMetaDataError("");
            return true;
        } catch (e) {
            setMetaDataValid(false);
            setMetaDataError(e.message);
            return false;
        }
    };

    // Handle Ace Editor change
    const handleMetaDataChange = (value) => {
        setJobForm(prev => ({
            ...prev,
            meta_data: value
        }));
        validateJSON(value);
        
        if (validationErrors.meta_data) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.meta_data;
                return newErrors;
            });
        }
    };

    // Clear meta data
    const clearMetaData = () => {
        setJobForm(prev => ({
            ...prev,
            meta_data: ""
        }));
        setMetaDataValid(true);
        setMetaDataError("");
    };

    useEffect(() => {
        if (editingJob) {
            const metaDataValue = editingJob.meta_data 
                ? (typeof editingJob.meta_data === 'object' 
                    ? JSON.stringify(editingJob.meta_data, null, 2)
                    : editingJob.meta_data)
                : "";
                
            setJobForm({
                title: editingJob.title || "",
                short_description: editingJob.short_description || "",
                content: editingJob.content || "",
                meta_data: metaDataValue,
                is_archived: editingJob.is_archived || false,
            });
            
            // Validate existing meta_data
            if (editingJob.meta_data) {
                const metaStr = typeof editingJob.meta_data === 'object'
                    ? JSON.stringify(editingJob.meta_data)
                    : editingJob.meta_data;
                validateJSON(metaStr);
            }
        } else {
            setJobForm({
                title: "",
                short_description: "",
                content: "",
                meta_data: "",
                is_archived: false,
            });
            setMetaDataValid(true);
            setMetaDataError("");
        }
        setValidationErrors({});
    }, [editingJob]);

    const handleCreate = async (formData) => {
        try {
            // Log FormData contents for debugging
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            const response = await axios.post(route("ourjob.store"), formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log("Create response:", response.data);
            setReloadTrigger((prev) => !prev);
        } catch (error) {
            console.log("Error creating job - Full error:", error);
            console.log("Error response:", error.response);
            console.log("Error data:", error.response?.data);
            
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors || {});
            }
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});

        // Validate JSON before submission
        if (jobForm.meta_data && jobForm.meta_data.trim() !== "") {
            if (!validateJSON(jobForm.meta_data)) {
                alert("Please fix the JSON format in Meta Data field");
                return;
            }
        }
        
        const formData = new FormData();
        
        // Add fields one by one with proper handling
        formData.append("title", jobForm.title || "");
        
        if (jobForm.short_description) {
            formData.append("short_description", jobForm.short_description);
        }
        
        if (jobForm.content) {
            formData.append("content", jobForm.content);
        }
        
        // Handle meta_data - send as JSON string
        if (jobForm.meta_data && jobForm.meta_data.trim() !== "") {
            try {
                // Parse to validate, then stringify to ensure proper format
                const parsed = JSON.parse(jobForm.meta_data);
                formData.append("meta_data", JSON.stringify(parsed));
            } catch (e) {
                // If not valid JSON, create a simple JSON object
                const simpleMeta = { description: jobForm.meta_data };
                formData.append("meta_data", JSON.stringify(simpleMeta));
            }
        } else {
            formData.append("meta_data", JSON.stringify(null));
        }
        
        // Handle boolean - send as string '1' or '0'
        formData.append("is_archived", jobForm.is_archived ? "1" : "0");

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
            setEditingJob(null);
        } catch (error) {
            console.log("Error saving data", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setJobForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Handle Quill change
    const handleQuillChange = (content) => {
        setJobForm((prev) => ({
            ...prev,
            content: content,
        }));
        
        if (validationErrors.content) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors.content;
                return newErrors;
            });
        }
    };

    // Toggle archived
    const toggleArchived = () => {
        setJobForm((prev) => ({
            ...prev,
            is_archived: !prev.is_archived,
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="relative px-6 py-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
                <div className="flex justify-between items-center mb-6 bg-white pb-4 border-b">
                    <h2 className="text-2xl font-bold">
                        {editingJob ? "Edit Job" : "Add New Job"}
                    </h2>
                    <button
                        type="button"
                        onClick={() => {
                            setShowForm(false);
                            setEditingJob(null);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {/* Title */}
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
                            className={`w-full border ${validationErrors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            disabled={submitting}
                        />
                        {validationErrors.title && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.title[0]}</p>
                        )}
                    </div>

                    {/* Short Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Short Description
                        </label>
                        <input
                            type="text"
                            name="short_description"
                            value={jobForm.short_description}
                            onChange={handleChange}
                            className={`w-full border ${validationErrors.short_description ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                            disabled={submitting}
                        />
                        {validationErrors.short_description && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.short_description[0]}</p>
                        )}
                    </div>

                    {/* Content with React Quill */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <div className={`quill-wrapper ${validationErrors.content ? "quill-error" : ""}`}>
                            <ReactQuill
                                theme="snow"
                                value={jobForm.content || ""}
                                onChange={handleQuillChange}
                                modules={quillModules}
                                formats={quillFormats}
                                className="bg-white"
                                style={{ height: "200px", marginBottom: "40px" }}
                                readOnly={submitting}
                            />
                        </div>
                        {validationErrors.content && (
                            <p className="mt-1 text-sm text-red-600">
                                {validationErrors.content[0]}
                            </p>
                        )}
                        <style jsx>{`
                            .quill-wrapper :global(.ql-container) {
                                border-bottom-left-radius: 0.5rem;
                                border-bottom-right-radius: 0.5rem;
                                min-height: 150px;
                                font-size: 0.875rem;
                                border-color: #d1d5db;
                            }
                            .quill-wrapper :global(.ql-toolbar) {
                                border-top-left-radius: 0.5rem;
                                border-top-right-radius: 0.5rem;
                                background-color: #f9fafb;
                                border-color: #d1d5db;
                            }
                            .quill-wrapper :global(.ql-container:focus-within),
                            .quill-wrapper :global(.ql-toolbar:focus-within) {
                                border-color: #6366f1;
                                box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
                            }
                            .quill-error :global(.ql-container),
                            .quill-error :global(.ql-toolbar) {
                                border-color: #ef4444;
                            }
                        `}</style>
                    </div>

                    {/* Enhanced Meta Data with Ace Editor */}
                    <div className="space-y-3">
                        {/* Header with improved design */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="p-1.5 bg-indigo-50 rounded-lg">
                                    <Code className="text-indigo-600" size={18} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">
                                        Meta Data (JSON)
                                    </label>
                                    <p className="text-xs text-gray-500">
                                        Additional data for SEO, settings, etc.
                                    </p>
                                </div>
                            </div>
                            
                            {/* Editor Controls - Only Clear button */}
                            <div className="flex items-center space-x-2">
                                {/* Clear Button */}
                                {jobForm.meta_data && (
                                    <button
                                        type="button"
                                        onClick={clearMetaData}
                                        className="text-xs bg-red-50 text-red-600 px-2 py-1.5 rounded-md hover:bg-red-100 transition-colors"
                                        disabled={submitting}
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        </div>
                        
                        {/* Ace Editor */}
                        <div className={`border rounded-lg overflow-hidden transition-all ${
                            !metaDataValid 
                                ? 'border-red-500 shadow-sm shadow-red-100' 
                                : jobForm.meta_data 
                                    ? 'border-green-500 shadow-sm shadow-green-100' 
                                    : 'border-gray-300 hover:border-indigo-300'
                        }`}>
                            <AceEditor
                                mode="json"
                                theme="github"
                                onChange={handleMetaDataChange}
                                value={jobForm.meta_data}
                                name="meta_data_editor"
                                editorProps={{ $blockScrolling: true }}
                                setOptions={{
                                    enableBasicAutocompletion: true,
                                    enableLiveAutocompletion: true,
                                    enableSnippets: true,
                                    showLineNumbers: true,
                                    showGutter: true,
                                    highlightActiveLine: true,
                                    tabSize: 2,
                                    useWorker: false,
                                }}
                                fontSize={14}
                                width="100%"
                                height="220px"
                                readOnly={submitting}
                                className="rounded-lg"
                            />
                        </div>
                        
                        {/* Status Bar */}
                        <div className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2">
                            <div className="flex items-center space-x-3">
                                {/* Validation Status */}
                                {jobForm.meta_data && jobForm.meta_data.trim() !== "" ? (
                                    <>
                                        {metaDataValid ? (
                                            <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs font-medium">Valid JSON</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-1 bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs font-medium">Invalid JSON</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex items-center space-x-1 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                        <span className="text-xs font-medium">Empty</span>
                                    </div>
                                )}
                                
                                {/* Character/Line Count */}
                                {jobForm.meta_data && (
                                    <span className="text-xs text-gray-500">
                                        {jobForm.meta_data.split('\n').length} lines • {jobForm.meta_data.length} chars
                                    </span>
                                )}
                            </div>
                            
                            {/* Error Message */}
                            {!metaDataValid && metaDataError && (
                                <span className="text-xs text-red-600 truncate max-w-xs" title={metaDataError}>
                                    Error: {metaDataError}
                                </span>
                            )}
                        </div>
                        
                        {validationErrors.meta_data && (
                            <p className="text-sm text-red-600">
                                {validationErrors.meta_data[0]}
                            </p>
                        )}
                    </div>

                    {/* Toggle Switch for Archived */}
                    <div className="pt-2">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                                <Archive className="text-gray-600" size={20} />
                                <span className="text-sm font-medium text-gray-700">
                                    Archive Job
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={toggleArchived}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                                    jobForm.is_archived
                                        ? "bg-indigo-600"
                                        : "bg-gray-300"
                                }`}
                                disabled={submitting}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        jobForm.is_archived
                                            ? "translate-x-6"
                                            : "translate-x-1"
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Hidden input to keep the value in form submission */}
                    <input
                        type="hidden"
                        name="is_archived"
                        value={jobForm.is_archived ? "1" : "0"}
                    />

                    {/* Form Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingJob(null);
                            }}
                            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 transition text-sm"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !metaDataValid}
                            className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition text-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    {editingJob ? "Updating..." : "Saving..."}
                                </>
                            ) : (
                                editingJob ? "Update Job" : "Create Job"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddJobForm;