import React, { useEffect, useState } from "react";
import { Link, Head } from "@inertiajs/react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import {
    Star,
    Users,
    BedDouble,
    Wifi,
    Coffee,
    Tv,
    Shield,
    Wind,
} from "lucide-react";

// Amenities icons mapping
const amenityIcons = {
    wifi: Wifi,
    coffee: Coffee,
    tv: Tv,
    ac: Wind,
    safe: Shield,
};

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageSeo, setPageSeo] = useState({
        title: "Our Rooms & Suites - Luxury Accommodations",
        description: "Experience luxury and comfort in our thoughtfully designed rooms and suites, each offering a unique blend of elegance and modern amenities.",
        keywords: "hotel rooms, luxury suites, accommodation, hotel booking, rooms for rent",
        ogImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&w=1200",
        canonical: "https://yourwebsite.com/rooms",
    });

    // Fetch rooms
    useEffect(() => {
        const fetchRooms = async () => {
            setLoading(true);
            try {
                const response = await axios.get(route("ourroom.index"));
                const roomsData = response.data.data || response.data;
                
                // Parse meta_data for each room
                const parsedRooms = roomsData.map(room => {
                    if (room.meta_data && typeof room.meta_data === 'string') {
                        try {
                            room.meta_data = JSON.parse(room.meta_data);
                        } catch (e) {
                            console.error('Error parsing meta_data for room', room.id, e);
                        }
                    }
                    return room;
                });

                // Filter only active rooms
                const activeRooms = parsedRooms.filter(
                    (room) => !room.is_archived,
                );
                
                setRooms(activeRooms);

                // Check if any room has page-level SEO metadata
                const pageSEOFromRooms = activeRooms.find(room => room.meta_data?.seo?.page_title);
                if (pageSEOFromRooms) {
                    setPageSeo(prev => ({
                        ...prev,
                        title: pageSEOFromRooms.meta_data.seo.page_title || prev.title,
                        description: pageSEOFromRooms.meta_data.seo.page_description || prev.description,
                        keywords: pageSEOFromRooms.meta_data.seo.page_keywords || prev.keywords,
                        ogImage: pageSEOFromRooms.meta_data.seo.page_og_image || prev.ogImage,
                    }));
                }
            } catch (error) {
                console.error("Error fetching rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    // Helper function to get image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath)
            return "https://via.placeholder.com/800x600?text=No+Image";

        if (
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://")
        ) {
            return imagePath;
        }

        let cleanPath = imagePath.replace(/^\/+/, "");
        cleanPath = cleanPath.replace(/^storage\//, "");

        return `/storage/${cleanPath}`;
    };

    // Get display image for room
    const getDisplayImage = (room) => {
        if (!room.images || room.images.length === 0) {
            return "https://via.placeholder.com/800x600?text=No+Image";
        }

        const displayIndex = room.display_image_index || 0;
        if (room.images[displayIndex]) {
            return getImageUrl(room.images[displayIndex].image);
        }
        return getImageUrl(room.images[0].image);
    };

    // Generate structured data for the rooms listing page
    const generateStructuredData = () => {
        return {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": rooms.map((room, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `https://yourwebsite.com/room/${room.slug}`,
                "name": room.name,
                "image": getDisplayImage(room),
                "description": room.short_description || room.name,
                "offers": {
                    "@type": "Offer",
                    "price": room.price,
                    "priceCurrency": "NPR",
                    "availability": "https://schema.org/InStock"
                }
            })),
            "numberOfItems": rooms.length,
            "name": pageSeo.title,
            "description": pageSeo.description
        };
    };

    // Generate breadcrumb structured data
    const generateBreadcrumbData = () => {
        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://yourwebsite.com"
                },
                {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Rooms",
                    "item": "https://yourwebsite.com/rooms"
                }
            ]
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">
                        Loading amazing rooms...
                    </p>
                </div>
            </div>
        );
    }

    const structuredData = generateStructuredData();
    const breadcrumbData = generateBreadcrumbData();

    return (
        <>
            <Helmet>
                {/* Basic Meta Tags */}
                <title>{pageSeo.title}</title>
                <meta name="description" content={pageSeo.description} />
                <meta name="keywords" content={pageSeo.keywords} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href={pageSeo.canonical} />

                {/* Open Graph Meta Tags */}
                <meta property="og:title" content={pageSeo.title} />
                <meta property="og:description" content={pageSeo.description} />
                <meta property="og:image" content={pageSeo.ogImage} />
                <meta property="og:url" content={pageSeo.canonical} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Your Hotel Name" />
                
                {/* Twitter Card Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={pageSeo.title} />
                <meta name="twitter:description" content={pageSeo.description} />
                <meta name="twitter:image" content={pageSeo.ogImage} />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbData)}
                </script>
            </Helmet>

            <Head title={pageSeo.title}>
                <meta name="description" content={pageSeo.description} />
            </Head>

            <div className="min-h-screen bg-gray-50">
                {/* Hero Section */}
                <div className="relative bg-indigo-900 text-white py-20">
                    <div className="absolute inset-0 overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3"
                            alt="Hotel Interior"
                            className="w-full h-full object-cover opacity-20"
                        />
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Our Rooms & Suites
                        </h1>
                        <p className="text-xl text-indigo-200 max-w-3xl mx-auto">
                            {pageSeo.description}
                        </p>
                    </div>
                </div>

                {/* Rooms Grid */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {rooms.length === 0 ? (
                        <div className="text-center py-12">
                            <BedDouble className="mx-auto h-16 w-16 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">
                                No rooms found
                            </h3>
                            <p className="mt-2 text-gray-500">
                                Please check back later for available rooms.
                            </p>
                        </div>
                    ) : (
                        <>
                            <p className="text-gray-600 mb-6">
                                Showing {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {rooms.map((room) => (
                                    <div
                                        key={room.id}
                                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                                        itemScope
                                        itemType="https://schema.org/Product"
                                    >
                                        {/* Room Image */}
                                        <div className="relative h-64 overflow-hidden group">
                                            <img
                                                src={getDisplayImage(room)}
                                                alt={room.name}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                onError={(e) => {
                                                    e.target.src =
                                                        "https://via.placeholder.com/800x600?text=Room+Image";
                                                }}
                                                itemProp="image"
                                            />
                                            {room.is_featured && (
                                                <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                                    <Star size={16} />
                                                    Featured
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                                                    <meta itemProp="priceCurrency" content="NPR" />
                                                    <span itemProp="price">{room.price}</span>/night
                                                </span>
                                            </div>
                                        </div>

                                        {/* Room Details */}
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-gray-900" itemProp="name">
                                                    {room.name}
                                                </h3>
                                                <span className="text-sm text-indigo-600 font-medium" itemProp="category">
                                                    {room.room_type?.name}
                                                </span>
                                            </div>

                                            {/* Capacity Icons */}
                                            <div className="flex items-center gap-4 mb-4 text-gray-600">
                                                <div className="flex items-center gap-1">
                                                    <Users size={18} />
                                                    <span className="text-sm">
                                                        {room.no_of_adult} Adults
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Users size={18} />
                                                    <span className="text-sm">
                                                        {room.no_of_children}{" "}
                                                        Children
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Description */}
                                            <p className="text-gray-600 mb-4 line-clamp-2" itemProp="description">
                                                {room.short_description ||
                                                    "Experience comfort and luxury in our well-appointed room."}
                                            </p>

                                            {/* Amenities Preview */}
                                            {room.meta_data &&
                                                room.meta_data.amenities && (
                                                    <div className="flex flex-wrap gap-3 mb-4">
                                                        {room.meta_data.amenities
                                                            .slice(0, 4)
                                                            .map(
                                                                (
                                                                    amenity,
                                                                    index,
                                                                ) => {
                                                                    const IconComponent =
                                                                        amenityIcons[
                                                                            amenity
                                                                                .icon
                                                                        ] ||
                                                                        BedDouble;
                                                                    return (
                                                                        <div
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex items-center gap-1 text-gray-600"
                                                                        >
                                                                            <IconComponent
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                            <span className="text-xs">
                                                                                {
                                                                                    amenity.name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                },
                                                            )}
                                                        {room.meta_data.amenities
                                                            .length > 4 && (
                                                            <span className="text-xs text-gray-500">
                                                                +
                                                                {room.meta_data
                                                                    .amenities
                                                                    .length -
                                                                4}{" "}
                                                                more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                            {/* View Details Button */}
                                            <Link
                                                href={`/room/${room.slug}`}
                                                className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
                                                itemProp="url"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default Rooms;