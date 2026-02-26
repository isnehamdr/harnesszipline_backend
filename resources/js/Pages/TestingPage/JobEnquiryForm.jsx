import React, { useState, useEffect } from "react";
import { router, usePage, useForm as useInertiaForm } from "@inertiajs/react";
import axios from "axios";
import {
    Briefcase,
    MapPin,
    Clock,
    Calendar,
    DollarSign,
    Users,
    Building2,
    Mail,
    Phone,
    User,
    FileText,
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    Send,
} from "lucide-react";

const JobEnquiryForm = () => {
    const { slug } = usePage().props; // Get slug from props instead of useParams
    const { props } = usePage();
    const [job, setJob] = useState(props.job || null); // Check if job is passed as prop
    const [loading, setLoading] = useState(!props.job); // Set loading based on whether job exists
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        job_id: props.job?.id || "",
        full_name: "",
        email: "",
        phone_number: "",
        description: "",
        cv: null,
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const [fileName, setFileName] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    // Fetch job details by slug if not provided via props
    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!slug) return;

            try {
                setLoading(true);
                // Use the full URL or make sure your proxy is set up correctly
                const response = await axios.get(`/job/${slug}`);

                console.log("Job details response:", response);

                if (response.data && response.data.data) {
                    setJob(response.data.data);
                    setFormData((prev) => ({
                        ...prev,
                        job_id: response.data.data.id,
                    }));
                }
                setError(null);
            } catch (err) {
                console.error("Error fetching job details:", err);
                setError("Failed to load job details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (slug && !props.job) {
            fetchJobDetails();
        }
    }, [slug, props.job]);

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    };

    // Handle file upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const validTypes = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            ];
            if (!validTypes.includes(file.type)) {
                setErrors((prev) => ({
                    ...prev,
                    cv: "Please upload only PDF, DOC, or DOCX files",
                }));
                return;
            }

            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    cv: "File size must be less than 2MB",
                }));
                return;
            }

            setFormData((prev) => ({
                ...prev,
                cv: file,
            }));
            setFileName(file.name);
            setErrors((prev) => ({
                ...prev,
                cv: null,
            }));
        }
    };

    // Remove uploaded file
    // const removeFile = () => {
    //     setFormData(prev => ({
    //         ...prev,
    //         cv: null
    //     }));
    //     setFileName('');
    //     document.getElementById('cv-upload').value = '';
    // };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = "Full name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.phone_number.trim()) {
            newErrors.phone_number = "Phone number is required";
        } else if (
            !/^[\d\s\-+()]{10,}$/.test(formData.phone_number.replace(/\s/g, ""))
        ) {
            newErrors.phone_number = "Please enter a valid phone number";
        }

        if (!formData.cv) {
            newErrors.cv = "CV is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission with Axios
    // Handle form submission with Axios
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus(null);
        setUploadProgress(0);

        // Create FormData object for file upload
        const submitData = new FormData();
        submitData.append("job_id", formData.job_id);
        submitData.append("full_name", formData.full_name);
        submitData.append("email", formData.email);
        submitData.append("phone_number", formData.phone_number);
        submitData.append("description", formData.description || "");
        submitData.append("cv", formData.cv);

        try {
            // Using Axios for form submission
            const response = await axios.post("/ourjobenquiry", submitData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total,
                        );
                        setUploadProgress(percentCompleted);
                    }
                },
            });

            // Handle successful submission
            setSubmitStatus({
                type: "success",
                message: "Your application has been submitted successfully!",
            });

            // Reset form
            setFormData((prev) => ({
                job_id: job?.id || "",
                full_name: "",
                email: "",
                phone_number: "",
                description: "",
                cv: null,
            }));
            setFileName("");

            // Safely reset file input - check if element exists first
            const fileInput = document.getElementById("cv-upload");
            if (fileInput) {
                fileInput.value = "";
            }

            // Optionally redirect using Inertia after success
            setTimeout(() => {
                router.visit("/jobs", {
                    only: ["flash"],
                    data: { message: "Application submitted successfully!" },
                });
            }, 3000);
        } catch (error) {
            console.error("Submission error:", error);

            if (error.response) {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors || {});
                    setSubmitStatus({
                        type: "error",
                        message:
                            "Please check the form for errors and try again.",
                    });
                } else {
                    setSubmitStatus({
                        type: "error",
                        message:
                            error.response.data?.message ||
                            "Server error. Please try again later.",
                    });
                }
            } else if (error.request) {
                setSubmitStatus({
                    type: "error",
                    message:
                        "Network error. Please check your connection and try again.",
                });
            } else {
                setSubmitStatus({
                    type: "error",
                    message: "An unexpected error occurred. Please try again.",
                });
            }
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    // Remove uploaded file - with null check
    const removeFile = () => {
        setFormData((prev) => ({
            ...prev,
            cv: null,
        }));
        setFileName("");

        // Safely reset file input - check if element exists first
        const fileInput = document.getElementById("cv-upload");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    // Handle back button using Inertia
    const handleBack = () => {
        router.visit("/jobs");
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading job details...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-md max-w-md">
                    <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Job Not Found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        {error ||
                            "The job you're looking for doesn't exist or has been removed."}
                    </p>
                    <button
                        onClick={handleBack}
                        className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
                    >
                        Browse Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with back button */}
                <div className="mb-6">
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Jobs
                    </button>
                </div>

                {/* Rest of your JSX remains exactly the same */}
                {/* ... */}

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Job Details */}
                    <div className="space-y-6">
                        {/* Job Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Job Image/Placeholder */}
                            <div className="w-full h-64 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                {job.images && job.images.length > 0 ? (
                                    <img
                                        src={`${imgurl}/${job.images[0].path}`}
                                        alt={job.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Briefcase className="h-24 w-24 text-indigo-300" />
                                )}
                            </div>

                            {/* Job Content */}
                            <div className="p-6">
                                {/* Title */}
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                                    {job.title}
                                </h1>

                                {/* Short Description */}
                                {job.short_description && (
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        {job.short_description}
                                    </p>
                                )}

                                {/* Job Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                    {/* Location */}
                                    {job.location && (
                                        <div className="flex items-start">
                                            <MapPin className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Location
                                                </p>
                                                <p className="text-gray-900 font-medium">
                                                    {job.location}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Job Type */}
                                    {job.job_type && (
                                        <div className="flex items-start">
                                            <Clock className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Job Type
                                                </p>
                                                <p className="text-gray-900 font-medium capitalize">
                                                    {job.job_type}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Salary Range (if available) */}
                                    {job.salary_range && (
                                        <div className="flex items-start">
                                            <DollarSign className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Salary Range
                                                </p>
                                                <p className="text-gray-900 font-medium">
                                                    {job.salary_range}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Experience Level (if available) */}
                                    {job.experience_level && (
                                        <div className="flex items-start">
                                            <Users className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Experience
                                                </p>
                                                <p className="text-gray-900 font-medium capitalize">
                                                    {job.experience_level}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Department (if available) */}
                                    {job.department && (
                                        <div className="flex items-start">
                                            <Building2 className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Department
                                                </p>
                                                <p className="text-gray-900 font-medium">
                                                    {job.department}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Posted Date */}
                                    <div className="flex items-start">
                                        <Calendar className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Posted Date
                                            </p>
                                            <p className="text-gray-900 font-medium">
                                                {formatDate(job.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Full Description */}
                                {job.content && (
                                    <div className="border-t border-gray-200 pt-6">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                            Job Description
                                        </h2>
                                        <div
                                            className="prose prose-indigo max-w-none text-gray-600"
                                            dangerouslySetInnerHTML={{
                                                __html: job.content,
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Enquiry Form */}
                    <div className="lg:sticky lg:top-8 h-fit">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-indigo-600 px-6 py-4">
                                <h2 className="text-xl font-semibold text-white flex items-center">
                                    <Mail className="h-5 w-5 mr-2" />
                                    Apply for this Position
                                </h2>
                            </div>

                            <div className="p-6">
                                {/* Upload Progress Bar */}
                                {isSubmitting && uploadProgress > 0 && (
                                    <div className="mb-6">
                                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                                            <span>Uploading...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${uploadProgress}%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}

                                {/* Success/Error Messages */}
                                {submitStatus && (
                                    <div
                                        className={`mb-6 p-4 rounded-lg ${
                                            submitStatus.type === "success"
                                                ? "bg-green-50 border border-green-200"
                                                : "bg-red-50 border border-red-200"
                                        }`}
                                    >
                                        <div className="flex">
                                            {submitStatus.type === "success" ? (
                                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                                            )}
                                            <p
                                                className={`text-sm ${
                                                    submitStatus.type ===
                                                    "success"
                                                        ? "text-green-700"
                                                        : "text-red-700"
                                                }`}
                                            >
                                                {submitStatus.message}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* Job ID (hidden) */}
                                    <input
                                        type="hidden"
                                        name="job_id"
                                        value={formData.job_id}
                                    />

                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                name="full_name"
                                                value={formData.full_name}
                                                onChange={handleInputChange}
                                                className={`block w-full pl-10 pr-3 py-2 border ${
                                                    errors.full_name
                                                        ? "border-red-300"
                                                        : "border-gray-300"
                                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        {errors.full_name && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.full_name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`block w-full pl-10 pr-3 py-2 border ${
                                                    errors.email
                                                        ? "border-red-300"
                                                        : "border-gray-300"
                                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Phone Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone_number"
                                                value={formData.phone_number}
                                                onChange={handleInputChange}
                                                className={`block w-full pl-10 pr-3 py-2 border ${
                                                    errors.phone_number
                                                        ? "border-red-300"
                                                        : "border-gray-300"
                                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                                                placeholder="+1 234 567 8900"
                                            />
                                        </div>
                                        {errors.phone_number && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.phone_number}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description/Cover Letter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cover Letter / Additional
                                            Information
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-3 pointer-events-none">
                                                <FileText className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                rows="4"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                placeholder="Tell us why you're interested in this position..."
                                            />
                                        </div>
                                    </div>

                                    {/* CV Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload CV{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                            <span className="text-xs text-gray-500 ml-2">
                                                (PDF, DOC, DOCX - Max 2MB)
                                            </span>
                                        </label>

                                        {!formData.cv ? (
                                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 transition">
                                                <div className="space-y-1 text-center">
                                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                    <div className="flex text-sm text-gray-600">
                                                        <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                            <span>
                                                                Upload a file
                                                            </span>
                                                            <input
                                                                id="cv-upload"
                                                                type="file"
                                                                className="sr-only"
                                                                onChange={
                                                                    handleFileChange
                                                                }
                                                                accept=".pdf,.doc,.docx"
                                                            />
                                                        </label>
                                                        <p className="pl-1">
                                                            or drag and drop
                                                        </p>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        PDF, DOC, DOCX up to 2MB
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center">
                                                    <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                                                    <span className="text-sm text-gray-700 truncate max-w-xs">
                                                        {fileName}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={removeFile}
                                                    className="text-gray-400 hover:text-red-500 transition"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        )}

                                        {errors.cv && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.cv}
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    ></circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    ></path>
                                                </svg>
                                                Submitting...{" "}
                                                {uploadProgress > 0 &&
                                                    `(${uploadProgress}%)`}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="h-5 w-5 mr-2" />
                                                Submit Application
                                            </>
                                        )}
                                    </button>

                                    {/* Note */}
                                    <p className="text-xs text-gray-500 text-center">
                                        By submitting this form, you agree to
                                        our
                                        <a
                                            href="/privacy-policy"
                                            className="text-indigo-600 hover:text-indigo-700 ml-1"
                                        >
                                            Privacy Policy
                                        </a>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobEnquiryForm;
