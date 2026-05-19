import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import {
    FiMenu,
    FiX,
    FiChevronDown,
    FiChevronRight,
    FiUsers,
    FiHome,
    FiImage,
    FiSettings,
    FiStar,
    FiFile,
    FiFileText,
} from "react-icons/fi";
import {
    LayoutDashboard,
    Activity,
    Briefcase,
    BluetoothSearching,
} from "lucide-react";

const AdminSideBar = ({
    isMobileOpen,
    onMobileToggle,
    isCollapsed,
    onToggleCollapse,
}) => {
    const { url } = usePage();
    const currentPath = url.split("/")[1];

    // Dropdown states
    const [isLeadManagementOpen, setIsLeadManagementOpen] = useState(false);
    const [isTaskManagementOpen, setIsTaskManagementOpen] = useState(false);

    // Hover states for collapsed dropdowns
    const [isLeadHovered, setIsLeadHovered] = useState(false);
    const [isTaskHovered, setIsTaskHovered] = useState(false);
    const [isClientHovered, setIsClientHovered] = useState(false);

    // Get authenticated user from auth prop
    const { auth } = usePage().props;
    const user = auth?.user;

    // Check The Role of the User
    const isAdmin = user?.role === "admin";
    const isUser = user?.role === "user";

    const isActive = (href) => {
        const path = href.replace("/", "");
        return currentPath === path || url.startsWith(href + "/");
    };

    // Check if any route in a group is active
    const isGroupActive = (routes) => {
        return routes.some((route) => {
            const routePath = route.replace("/", "");
            return currentPath === routePath || url.startsWith(route + "/");
        });
    };

    // Toggle functions for expanded view
    const toggleLeadManagement = () => {
        if (!isCollapsed) {
            setIsLeadManagementOpen(!isLeadManagementOpen);
        }
    };

    const toggleTaskManagement = () => {
        if (!isCollapsed) {
            setIsTaskManagementOpen(!isTaskManagementOpen);
        }
    };


    // Hover handlers for collapsed view
    const handleLeadMouseEnter = () => setIsLeadHovered(true);
    const handleLeadMouseLeave = () => setIsLeadHovered(false);
    const handleTaskMouseEnter = () => setIsTaskHovered(true);
    const handleTaskMouseLeave = () => setIsTaskHovered(false);
    const handleClientMouseEnter = () => setIsClientHovered(true);
    const handleClientMouseLeave = () => setIsClientHovered(false);

    // Common link styles
    const linkBaseClasses =
        "flex items-center rounded-lg transition-colors duration-200 group relative";
    const linkCollapsedClasses = isCollapsed ? "p-3 justify-center" : "p-3";
    const linkActiveClasses = (href) =>
        isActive(href)
            ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
            : "text-gray-600 hover:bg-blue-50 hover:text-blue-700";

    const dropdownButtonClasses = (isActive) => `
        flex items-center justify-between w-full p-3 rounded-lg transition-colors duration-200
        ${isActive ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
    `;

    // Icon style function
    const iconClasses = (isItemActive, customClass = "w-5 h-5") => `
        ${isCollapsed ? customClass : customClass}
        ${isItemActive ? "text-blue-600" : "text-gray-500 group-hover:text-blue-600"}
    `;

    // Tooltip for collapsed state
    const Tooltip = ({ children }) => (
        <div
            className="fixed left-12 ml-6 px-2 py-1 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50"
            style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                color: "#374151",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
        >
            {children}
        </div>
    );

    return (
        <>
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onMobileToggle}
                />
            )}

            <div
                className={`
                    fixed left-0 top-0 h-screen border-r z-50 transition-all duration-300
                    ${isCollapsed ? "w-16" : "w-64"}
                    ${
                        isMobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full lg:translate-x-0"
                    }
                `}
                style={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e5e7eb",
                }}
            >
                {/* Content Container */}
                <div className="relative z-10 h-full flex flex-col">
                    {/* Header */}
                    <div
                        className={`flex items-center justify-between p-4 border-b h-16 ${
                            isCollapsed ? "px-3" : ""
                        }`}
                        style={{ borderColor: "#e5e7eb" }}
                    >
                        {!isCollapsed && (
                            <Link
                                href="/dashboard"
                                className="text-xl font-bold text-gray-800 whitespace-nowrap"
                            >
                                <img
                                    src="/images/logo.webp"
                                    alt="Logo"
                                    className="h-10 w-auto"
                                />
                            </Link>
                        )}
                        <div className="flex items-center space-x-1">
                            {/* Collapse Toggle Button - Only show on desktop */}
                            <button
                                onClick={onToggleCollapse}
                                className="hidden lg:flex p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title={
                                    isCollapsed
                                        ? "Expand sidebar"
                                        : "Collapse sidebar"
                                }
                            >
                                <FiMenu className="w-4 h-4 text-gray-600" />
                            </button>

                            {/* Mobile Close Button */}
                            <button
                                onClick={onMobileToggle}
                                className="lg:hidden p-1.5 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                            >
                                <FiX className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div
                        className={`flex-1 overflow-y-auto ${isCollapsed ? "px-2" : "px-3"} py-2`}
                    >
                        <div className="space-y-1">
                            {/* Dashboard Link */}
                            <Link
                                href="/"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/")}
                                `}
                            >
                                <LayoutDashboard
                                    className={iconClasses(
                                        isActive("/"),
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Dashboard
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Dashboard</Tooltip>}
                            </Link>

                            {/* Section Header */}
                            {!isCollapsed && (
                                <div className="pt-4 px-3">
                                    <h1 className="font-medium text-gray-500 text-xs uppercase tracking-wider">
                                        Pages
                                    </h1>
                                </div>
                            )}

                            {/* Home Link */}
                            <Link
                                href="/home"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/home")}
                                `}
                            >
                                <FiHome
                                    className={iconClasses(isActive("/home"))}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Home
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Home</Tooltip>}
                            </Link>

                            {/* Activity Link */}
                            <Link
                                href="/activity"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/activity")}
                                `}
                            >
                                <Activity
                                    className={iconClasses(
                                        isActive("/activity"),
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Activity
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Activity</Tooltip>}
                            </Link>


                             {/* blog Link */}
                            <Link
                                href="/blog"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/blog")}
                                `}
                            >
                                <FiFileText
                                    className={iconClasses(
                                        isActive("/blog"),
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Blog
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Blog</Tooltip>}
                            </Link>

                            {/* Career Dropdown (formerly Lead Management) */}
                            {!isCollapsed ? (
                                // Expanded view
                                <div className="space-y-1">
                                    <button
                                        onClick={toggleLeadManagement}
                                        className={dropdownButtonClasses(
                                            isGroupActive([
                                                "/job-enquiry",
                                                "/jobs",
                                            ]),
                                        )}
                                    >
                                        <div className="flex items-center">
                                            <Briefcase
                                                className={iconClasses(
                                                    isGroupActive([
                                                        "/job-enquiry",
                                                        "/jobs",
                                                    ]),
                                                )}
                                            />
                                            <span className="ml-3 font-medium whitespace-nowrap">
                                                Career
                                            </span>
                                        </div>
                                        {isLeadManagementOpen ? (
                                            <FiChevronDown className="w-4 h-4 transition-transform duration-200" />
                                        ) : (
                                            <FiChevronRight className="w-4 h-4 transition-transform duration-200" />
                                        )}
                                    </button>

                                    {/* Dropdown Content - Using colored dots like before */}
                                    {isLeadManagementOpen && (
                                        <div className="ml-9 space-y-0.5">
                                            {/* Job Enquiries Link */}
                                            <Link
                                                href="/job-enquiry"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/job-enquiry") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Job Enquiries
                                                </span>
                                            </Link>

                                            {/* Jobs Link */}
                                            <Link
                                                href="/jobs"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/jobs") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Jobs
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Collapsed view with hover dropdown
                                <div
                                    className="relative"
                                    onMouseEnter={handleLeadMouseEnter}
                                    onMouseLeave={handleLeadMouseLeave}
                                >
                                    <button
                                        onClick={() => {
                                            if (isCollapsed) {
                                                setIsLeadHovered(
                                                    !isLeadHovered,
                                                );
                                            }
                                        }}
                                        className={`
                                            flex items-center justify-center w-full p-3 rounded-lg transition-colors duration-200 group
                                            ${isGroupActive(["/job-enquiry", "/jobs"]) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                        `}
                                    >
                                        <Briefcase
                                            className={iconClasses(
                                                isGroupActive([
                                                    "/job-enquiry",
                                                    "/jobs",
                                                ]),
                                            )}
                                        />
                                    </button>

                                    {/* Collapsed dropdown - appears on hover - Using colored dots like before */}
                                    {isLeadHovered && (
                                        <div
                                            className="fixed left-8 top-52 ml-6 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1"
                                            onMouseEnter={handleLeadMouseEnter}
                                            onMouseLeave={handleLeadMouseLeave}
                                        >
                                            <Link
                                                href="/job-enquiry"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/job-enquiry") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                {/* <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div> */}
                                                <span className="whitespace-nowrap">
                                                    Job Enquiries
                                                </span>
                                            </Link>
                                            <Link
                                                href="/jobs"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/jobs") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                {/* <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div> */}
                                                <span className="whitespace-nowrap">
                                                    Jobs
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Gallery Link */}
                            <Link
                                href="/gallery"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/gallery")}
                                `}
                            >
                                <FiImage
                                    className={iconClasses(
                                        isActive("/gallery"),
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Gallery
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Gallery</Tooltip>}
                            </Link>

                            {/* Room Dropdown (formerly Task Management) */}
                            {!isCollapsed ? (
                                // Expanded view
                                <div className="space-y-1">
                                    <button
                                        onClick={toggleTaskManagement}
                                        className={dropdownButtonClasses(
                                            isGroupActive([
                                                "/room-types",
                                                "/rooms",
                                            ]),
                                        )}
                                    >
                                        <div className="flex items-center">
                                            <FiHome
                                                className={iconClasses(
                                                    isGroupActive([
                                                        "/room-types",
                                                        "/rooms",
                                                    ]),
                                                )}
                                            />
                                            <span className="ml-3 font-medium whitespace-nowrap">
                                                Room
                                            </span>
                                        </div>
                                        {isTaskManagementOpen ? (
                                            <FiChevronDown className="w-4 h-4 transition-transform duration-200" />
                                        ) : (
                                            <FiChevronRight className="w-4 h-4 transition-transform duration-200" />
                                        )}
                                    </button>

                                    {/* Dropdown Content - Using colored dots like before */}
                                    {isTaskManagementOpen && (
                                        <div className="ml-9 space-y-0.5">
                                            {/* Room Types Link */}
                                            <Link
                                                href="/room-types"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/room-types") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Room Types
                                                </span>
                                            </Link>

                                            {/* Rooms Link */}
                                            <Link
                                                href="/rooms"
                                                className={`
                                                    flex items-center p-2.5 rounded-lg transition-colors duration-200
                                                    ${isActive("/rooms") ? "bg-blue-100 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div>
                                                <span className="text-sm whitespace-nowrap">
                                                    Rooms
                                                </span>
                                            </Link>                                   
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Collapsed view with hover dropdown
                                <div
                                    className="relative"
                                    onMouseEnter={handleTaskMouseEnter}
                                    onMouseLeave={handleTaskMouseLeave}
                                >
                                    <button
                                        onClick={() => {
                                            if (isCollapsed) {
                                                setIsTaskHovered(
                                                    !isTaskHovered,
                                                );
                                            }
                                        }}
                                        className={`
                                            flex items-center justify-center w-full p-3 rounded-lg transition-colors duration-200 group
                                            ${isGroupActive(["/room-types", "/rooms"]) ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                        `}
                                    >
                                        <FiHome
                                            className={iconClasses(
                                                isGroupActive([
                                                    "/room-types",
                                                    "/rooms",
                                                ]),
                                            )}
                                        />
                                    </button>

                                    {/* Collapsed dropdown - appears on hover - Using colored dots like before */}
                                    {isTaskHovered && (
                                        <div
                                            className="fixed left-8 top-80 ml-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px] py-1"
                                            onMouseEnter={handleTaskMouseEnter}
                                            onMouseLeave={handleTaskMouseLeave}
                                        >
                                            <Link
                                                href="/room-types"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/room-types") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                {/* <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div> */}
                                                <span className="whitespace-nowrap">
                                                    Room Types
                                                </span>
                                            </Link>
                                            <Link
                                                href="/rooms"
                                                className={`
                                                    flex items-center px-3 py-2.5 text-sm transition-colors duration-200
                                                    ${isActive("/rooms") ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"}
                                                `}
                                            >
                                                {/* <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-3"></div> */}
                                                <span className="whitespace-nowrap">
                                                    Rooms
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* User Management Link */}
                            <Link
                                href="/user-management"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/user-management")}
                                `}
                            >
                                <FiUsers
                                    className={iconClasses(
                                        isActive("/user-management"),
                                    )}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        User Management
                                    </span>
                                )}
                                {isCollapsed && (
                                    <Tooltip>User Management</Tooltip>
                                )}
                            </Link>

                            {/* Services Link */}
                            <Link
                                href="/services"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/services")}
                                `}
                            >
                                <FiSettings
                                    className={iconClasses(isActive("/services"))}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Services
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Services</Tooltip>}
                            </Link>

                            {/* Testimonials Link */}
                            <Link
                                href="/testimonials"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/testimonials")}
                                `}
                            >
                                <FiStar
                                    className={iconClasses(isActive("/testimonials"))}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Testimonials
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Testimonials</Tooltip>}
                            </Link>

                             <Link
                                href="/activity-logs"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/activity-logs")}
                                `}
                            >
                                <FiStar
                                    className={iconClasses(isActive("/activity-logs"))}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        Activity Logs
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>Activity Logs</Tooltip>}
                            </Link>

                            {/* PDF Viewer Link */}
                            {/* <Link
                                href="/pdf"
                                className={`
                                    ${linkBaseClasses} ${linkCollapsedClasses} ${linkActiveClasses("/pdf")}
                                `}
                            >
                                <FiFile
                                    className={iconClasses(isActive("/pdf"))}
                                />
                                {!isCollapsed && (
                                    <span className="ml-3 font-medium whitespace-nowrap">
                                        PDF Viewer
                                    </span>
                                )}
                                {isCollapsed && <Tooltip>PDF Viewer</Tooltip>}
                            </Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSideBar;
