import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, MapPin, Calendar, Clock, Eye, Send } from "lucide-react";
import { Link } from "@inertiajs/react";

const JobPage = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await axios.get(route("ourjob.index"));
                // Handle different response structures
                if (response.data && response.data.data) {
                    // Check if data is paginated (has data property)
                    if (response.data.data.data) {
                        setJobs(response.data.data.data || []);
                    } else {
                        setJobs(response.data.data || []);
                    }
                } else if (Array.isArray(response.data)) {
                    setJobs(response.data);
                } else {
                    setJobs([]);
                }
                setError(null);
            } catch (error) {
                console.error("fetching error ", error);
                setError("Failed to load jobs. Please try again later.");
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Format date like "28 Jul 2025"
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
                    <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-2xl shadow-md max-w-md">
                    <div className="text-red-600 mb-4">
                        <Briefcase className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-lg">{error}</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition shadow-sm"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <Briefcase className="h-8 w-8 text-indigo-600" />
                            Available Jobs
                        </h1>
                        <p className="mt-2 text-gray-600">
                            {jobs.length} {jobs.length === 1 ? "job" : "jobs"}{" "}
                            found
                        </p>
                    </div>
                </div>

                {/* Jobs Grid */}
                {jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-[#fdf8ee] rounded-2xl overflow-hidden shadow-sm border border-[#f0e8d0] relative"
                            >
                                {/* Display placeholder image since jobs might not have images */}
                                <div className="w-full h-52 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                                    <Briefcase className="h-20 w-20 text-indigo-300" />
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    {/* Date */}
                                    <p className="text-sm text-gray-500 mb-2">
                                        {formatDate(job.created_at)}
                                    </p>

                                    {/* Title */}
                                    <h3 className="text-lg font-extrabold uppercase text-[#c9882a] leading-snug mb-2 tracking-wide">
                                        {job.title}
                                    </h3>

                                    {/* Short Description */}
                                    {job.short_description && (
                                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-2">
                                            {job.short_description}
                                        </p>
                                    )}

                                    {/* Job Details */}
                                    <div className="space-y-2 mb-4 text-sm text-gray-500">
                                        {job.location && (
                                            <div className="flex items-center">
                                                <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                                <span className="truncate">
                                                    {job.location}
                                                </span>
                                            </div>
                                        )}

                                        {job.job_type && (
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
                                                <span>{job.job_type}</span>
                                            </div>
                                        )}

                                        {/* Posted date as additional info */}
                                        <div className="flex items-center text-gray-400 text-xs">
                                            <Calendar className="h-3 w-3 mr-2" />
                                            <span>
                                                Posted:{" "}
                                                {formatDate(job.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-4">
                                        <Link
                                            href={`/job/${job.slug}`}
                                            className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-700 transition shadow-sm flex items-center justify-center gap-1"
                                            
                                        >
                                            <Eye size={16} />
                                            <span>View Details</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-[#fdf8ee] rounded-2xl border border-[#f0e8d0]">
                        <Briefcase className="h-16 w-16 text-[#c9882a] mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            No jobs available
                        </h3>
                        <p className="text-gray-500">
                            Check back later for new opportunities.
                        </p>
                    </div>
                )}

                {/* Pagination - if your API returns paginated data */}
                {jobs?.links && (
                    <div className="mt-6 flex justify-center">
                        <div className="flex gap-2">
                            {jobs.links.map((link, index) => (
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
            </div>
        </div>
    );
};

export default JobPage;
