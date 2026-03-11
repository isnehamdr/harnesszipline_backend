// import React, { useEffect, useState } from "react";
// import { Link, usePage, Head } from "@inertiajs/react";
// import axios from "axios";
// import {
//     BedDouble,
//     Bath,
//     Maximize2,
//     Car,
//     Shield,
//     Wifi,
//     Coffee,
//     Tv,
//     Wind,
//     Share2,
//     MoreHorizontal,
//     ChevronLeft,
//     ChevronRight,
//     X,
//     Users,
//     ChevronDown,
//     Clock,
//     Bookmark,
//     Flag,
// } from "lucide-react";

// // ─── Amenity icon map ──────────────────────────────────────────────────────────
// const amenityIcons = {
//     wifi: Wifi,
//     coffee: Coffee,
//     tv: Tv,
//     ac: Wind,
//     safe: Shield,
//     bed: BedDouble,
//     bath: Bath,
//     maximize: Maximize2,
// };

// // ─── Helpers ───────────────────────────────────────────────────────────────────
// function numberToWord(n) {
//     const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
//     return words[n] ?? n;
// }

// function getDateLabel(dateStr) {
//     if (!dateStr) return null;
//     return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
// }

// // ─── Component ────────────────────────────────────────────────────────────────
// const RoomDetails = ({ room: initialRoom }) => {
//     const { props } = usePage();
//     const imgurl = import.meta.env.VITE_IMAGE_PATH;

//     const getImageUrl = (imagePath) => {
//         if (!imagePath) return "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
//         if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
//         return `${imgurl}/${imagePath}`;
//     };

//     const getCanonicalUrl = () => (typeof window !== "undefined" ? window.location.href : "");

//     const generateDefaultSeo = (roomData) => ({
//         title:
//             (roomData?.name || "Room Details") +
//             " - " +
//             (typeof window !== "undefined" ? window.appName || "Your Hotel" : "Your Hotel"),
//         description:
//             roomData?.short_description || `Experience luxury and comfort in our ${roomData?.name || "room"}.`,
//         keywords: `${roomData?.name || "room"}, hotel room, accommodation, ${roomData?.roomType?.name || ""}`,
//         og_image: roomData?.images?.[0]?.image ? getImageUrl(roomData.images[0].image) : null,
//         canonical: getCanonicalUrl(),
//         meta_robots: "index, follow",
//     });

//     const normalizeRoom = (roomData) => {
//         if (!roomData) return null;
//         const normalized = { ...roomData };
//         if (normalized.meta_data && typeof normalized.meta_data === "string") {
//             try {
//                 normalized.meta_data = JSON.parse(normalized.meta_data);
//             } catch (err) {
//                 console.error("Error parsing meta_data:", err);
//             }
//         }
//         if (normalized.meta_data && typeof normalized.meta_data === "object") {
//             normalized.meta_data = { ...normalized.meta_data };
//         }
//         if (!normalized.meta_data) normalized.meta_data = {};
//         if (!normalized.meta_data.seo) {
//             normalized.meta_data.seo = generateDefaultSeo(normalized);
//         }
//         return normalized;
//     };

//     const [room, setRoom] = useState(() => normalizeRoom(initialRoom));
//     const [loading, setLoading] = useState(!initialRoom);
//     const [showLightbox, setShowLightbox] = useState(false);
//     const [lightboxIndex, setLightboxIndex] = useState(0);
//     const [checkIn, setCheckIn] = useState("");
//     const [checkOut, setCheckOut] = useState("");
//     const [guests, setGuests] = useState(1);
//     const [similarRooms, setSimilarRooms] = useState([]);
//     const [isSaved, setIsSaved] = useState(false);
//     const [showDescription, setShowDescription] = useState(false);
//     const [cancellationOption, setCancellationOption] = useState("non-refundable");

//     const slug = initialRoom?.slug || props.slug;

//     useEffect(() => {
//         if (!initialRoom && slug) fetchRoomDetails();
//     }, [slug]);

//     useEffect(() => {
//         if (room) fetchSimilarRooms();
//     }, [room]);

//     const fetchRoomDetails = async () => {
//         setLoading(true);
//         try {
//             const response = await axios.get(`/room/${slug}`);
//             const roomData = normalizeRoom(response.data.data || response.data);
//             setRoom(roomData);
//         } catch (err) {
//             console.error("Error fetching room details:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchSimilarRooms = async () => {
//         try {
//             const response = await axios.get(route("ourroom.index"));
//             const roomsData = response.data.data || response.data;
//             setSimilarRooms(
//                 roomsData
//                     .filter((r) => r.room_type_id === room.room_type_id && r.id !== room.id && !r.is_archived)
//                     .slice(0, 3)
//             );
//         } catch (err) {
//             console.error("Error fetching similar rooms:", err);
//         }
//     };

//     const calculateTotalPrice = () => {
//         if (!checkIn || !checkOut || !room) return null;
//         const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
//         if (nights < 1) return null;
//         return { nights, total: nights * parseFloat(room.price) };
//     };

//     const openLightbox = (index) => {
//         setLightboxIndex(index);
//         setShowLightbox(true);
//         document.body.style.overflow = "hidden";
//     };

//     const closeLightbox = () => {
//         setShowLightbox(false);
//         document.body.style.overflow = "unset";
//     };

//     const navigateLightbox = (dir) => {
//         setLightboxIndex((prev) =>
//             dir === "next"
//                 ? prev === images.length - 1 ? 0 : prev + 1
//                 : prev === 0 ? images.length - 1 : prev - 1
//         );
//     };

//     // ── Extract SEO metadata from room.meta_data.seo ─────────────────────────────────
//     const getSEOMetadata = (roomData) => {
//         const safeRoom = roomData || null;
//         const canonical = getCanonicalUrl();
//         const firstImage = safeRoom?.images?.[0]?.image;

//         const defaultSEO = {
//             title: safeRoom?.name || "Room Details",
//             description: safeRoom?.short_description || "Experience luxury and comfort in our thoughtfully designed room.",
//             keywords: "hotel room, accommodation, luxury stay, hotel booking",
//             ogImage: firstImage ? getImageUrl(firstImage) : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
//             ogType: "product",
//             twitterCard: "summary_large_image",
//             canonical,
//             metaRobots: "index, follow",
//         };

//         if (safeRoom?.meta_data?.seo) {
//             const seo = safeRoom.meta_data.seo;
//             return {
//                 ...defaultSEO,
//                 title: seo.title || defaultSEO.title,
//                 description: seo.description || defaultSEO.description,
//                 keywords: seo.keywords || defaultSEO.keywords,
//                 ogImage: seo.og_image || defaultSEO.ogImage,
//                 ogType: seo.og_type || defaultSEO.ogType,
//                 twitterCard: seo.twitter_card || defaultSEO.twitterCard,
//                 canonical: seo.canonical || defaultSEO.canonical,
//                 metaRobots: seo.meta_robots || defaultSEO.metaRobots,
//             };
//         }

//         return defaultSEO;
//     };

//     // ── Generate structured data for rich snippets ───────────────────────────────
//     const generateStructuredData = (roomData) => {
//         if (!roomData) return null;

//         const seo = getSEOMetadata(roomData);
//         const images_list = (roomData.images || []).map((img) => getImageUrl(img.image)).filter(Boolean);

//         return {
//             "@context": "https://schema.org",
//             "@type": "Product",
//             "name": roomData.name,
//             "description": seo.description,
//             "image": images_list,
//             "sku": roomData.refrence_id || roomData.id,
//             "brand": {
//                 "@type": "Brand",
//                 "name": roomData.roomType?.name || "Hotel Room"
//             },
//             "offers": {
//                 "@type": "Offer",
//                 "price": roomData.price,
//                 "priceCurrency": "NPR",
//                 "availability": "https://schema.org/InStock",
//                 "url": seo.canonical,
//                 "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
//             },
//             "aggregateRating": roomData.meta_data?.seo?.aggregateRating || {
//                 "@type": "AggregateRating",
//                 "ratingValue": "4.5",
//                 "reviewCount": "120"
//             }
//         };
//     };

//     const images = room?.images?.length ? room.images : [{ image: null }];
//     const roomTypeName = room?.roomType?.name || room?.room_type?.name || "Hotel Room";
//     const seoMetadata = getSEOMetadata(room);
//     const structuredData = generateStructuredData(room);

//     // ── Loading ────────────────────────────────────────────────────────────────
//     if (loading) {
//         return (
//             <>
//                 <Head>
//                     <title>{seoMetadata.title}</title>
//                     <meta name="description" content={seoMetadata.description} />
//                     <meta name="keywords" content={seoMetadata.keywords} />
//                     <meta name="robots" content={seoMetadata.metaRobots} />
//                     <link rel="canonical" href={seoMetadata.canonical} />
//                 </Head>
//                 <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
//                     <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
//                     <p className="text-sm text-gray-500 font-medium">Loading property...</p>
//                 </div>
//             </>
//         );
//     }

//     // ── Not Found ──────────────────────────────────────────────────────────────
//     if (!room) {
//         return (
//             <>
//                 <Head>
//                     <title>{seoMetadata.title}</title>
//                     <meta name="description" content={seoMetadata.description} />
//                     <meta name="keywords" content={seoMetadata.keywords} />
//                     <meta name="robots" content={seoMetadata.metaRobots} />
//                     <link rel="canonical" href={seoMetadata.canonical} />
//                 </Head>
//                 <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
//                     <BedDouble size={48} className="text-gray-300" />
//                     <h3 className="text-xl font-semibold text-gray-800">Room Not Found</h3>
//                     <Link
//                         href="/rooms"
//                         className="mt-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
//                     >
//                         Browse Rooms
//                     </Link>
//                 </div>
//             </>
//         );
//     }

//     const priceInfo = calculateTotalPrice();

//     // ─── Stat items for the grid ───────────────────────────────────────────────
//     const stats = [
//         { label: "Adults",       value: numberToWord(room.no_of_adult),                              icon: Users     },
//         { label: "Children",     value: room.no_of_children > 0 ? numberToWord(room.no_of_children) : "None", icon: Users },
//         { label: "No. of Rooms", value: numberToWord(room.no_of_room),                               icon: BedDouble },
//         { label: "Room Type",    value: roomTypeName,                                                 icon: Maximize2, small: true },
//     ];

//     return (
//         <>
//             <Head>
//                 {/* Basic Meta Tags */}
//                 <title>{seoMetadata.title}</title>
//                 <meta name="description" content={seoMetadata.description} />
//                 <meta name="keywords" content={seoMetadata.keywords} />
//                 <meta name="robots" content={seoMetadata.metaRobots} />
//                 <link rel="canonical" href={seoMetadata.canonical} />

//                 {/* Open Graph Meta Tags */}
//                 <meta property="og:title" content={seoMetadata.title} />
//                 <meta property="og:description" content={seoMetadata.description} />
//                 <meta property="og:image" content={seoMetadata.ogImage} />
//                 <meta property="og:url" content={seoMetadata.canonical} />
//                 <meta property="og:type" content={seoMetadata.ogType || "product"} />
//                 <meta property="og:site_name" content={roomTypeName} />
//                 <meta property="product:price:amount" content={room.price} />
//                 <meta property="product:price:currency" content="NPR" />

//                 {/* Twitter Card Meta Tags */}
//                 <meta name="twitter:card" content={seoMetadata.twitterCard || "summary_large_image"} />
//                 <meta name="twitter:title" content={seoMetadata.title} />
//                 <meta name="twitter:description" content={seoMetadata.description} />
//                 <meta name="twitter:image" content={seoMetadata.ogImage} />

//                 {/* Structured data */}
//                 {structuredData && (
//                     <script
//                         type="application/ld+json"
//                         dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
//                     />
//                 )}
//             </Head>

//             <div className="min-h-screen bg-[#f8f7f4]">
//                 {/* Lightbox */}
//                 {showLightbox && (
//                     <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
//                         <button
//                             onClick={closeLightbox}
//                             className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
//                         >
//                             <X size={20} />
//                         </button>
//                         <button
//                             onClick={() => navigateLightbox("prev")}
//                             className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
//                         >
//                             <ChevronLeft size={24} />
//                         </button>
//                         <img
//                             src={getImageUrl(images[lightboxIndex]?.image)}
//                             alt={`${room.name} - View ${lightboxIndex + 1}`}
//                             className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
//                         />
//                         <button
//                             onClick={() => navigateLightbox("next")}
//                             className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
//                         >
//                             <ChevronRight size={24} />
//                         </button>
//                         <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-4 py-1.5 rounded-full">
//                             {lightboxIndex + 1} / {images.length}
//                         </div>
//                     </div>
//                 )}

//                 {/* Page Body */}
//                 <div className="max-w-[1200px] mx-auto px-6 py-8">

//                     {/* Image Gallery Grid */}
//                     <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[480px] rounded-2xl overflow-hidden">
//                         {/* Main image — spans 2 rows */}
//                         <div
//                             className="row-span-2 relative cursor-pointer overflow-hidden group"
//                             onClick={() => openLightbox(0)}
//                         >
//                             <img
//                                 src={getImageUrl(images[0]?.image)}
//                                 alt={room.name}
//                                 className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                                 onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"; }}
//                             />
//                         </div>
//                         {/* 4 smaller thumbnails */}
//                         {[1, 2, 3, 4].map((i) => (
//                             <div
//                                 key={i}
//                                 className="relative cursor-pointer overflow-hidden group"
//                                 onClick={() => openLightbox(Math.min(i, images.length - 1))}
//                             >
//                                 <img
//                                     src={getImageUrl(images[Math.min(i, images.length - 1)]?.image)}
//                                     alt={`${room.name} view ${i + 1}`}
//                                     className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                                     onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80"; }}
//                                 />
//                             </div>
//                         ))}
//                     </div>

//                     {/* Two-Column Layout */}
//                     <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

//                         {/* LEFT COLUMN */}
//                         <div>
//                             {/* Title Row */}
//                             <div className="flex items-start justify-between mb-6">
//                                 <div>
//                                     <h1 className="text-3xl font-semibold text-gray-900 tracking-tight leading-tight">
//                                         {room.name}
//                                     </h1>
//                                     <p className="mt-1.5 text-sm text-gray-400">
//                                         {roomTypeName}
//                                         {room.refrence_id && (
//                                             <span className="ml-2 text-gray-300">· Ref #{room.refrence_id}</span>
//                                         )}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* Stats Grid */}
//                             <div className="grid grid-cols-4 border border-gray-200 rounded-xl overflow-hidden mb-8">
//                                 {stats.map((stat, i) => {
//                                     const Icon = stat.icon;
//                                     return (
//                                         <div
//                                             key={i}
//                                             className={`flex flex-col gap-2 px-4 py-4 ${i < stats.length - 1 ? "border-r border-gray-200" : ""}`}
//                                         >
//                                             <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
//                                                 {stat.label}
//                                             </span>
//                                             <span className={`flex items-center gap-1.5 font-semibold text-gray-800 ${stat.small ? "text-xs" : "text-sm"}`}>
//                                                 <Icon size={14} className="text-gray-400" />
//                                                 {stat.value}
//                                             </span>
//                                         </div>
//                                     );
//                                 })}
//                             </div>

//                             {/* Description */}
//                             <div className="border-t border-gray-100 pt-7 mb-7">
//                                 <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
//                                 <p className="text-sm text-gray-500 leading-relaxed">
//                                     {room.short_description && <span>{room.short_description} </span>}
//                                     {showDescription && room.long_description && (
//                                         <span>{room.long_description}</span>
//                                     )}
//                                     {!room.short_description && !room.long_description &&
//                                         `Experience unparalleled comfort in our meticulously designed ${room.name}. Perfect for ${room.no_of_adult} ${room.no_of_adult === 1 ? "adult" : "adults"}${room.no_of_children > 0 ? ` and ${room.no_of_children} ${room.no_of_children === 1 ? "child" : "children"}` : ""}, this room offers a perfect sanctuary for both business and leisure travelers.`
//                                     }
//                                 </p>
//                                 {room.long_description && (
//                                     <button
//                                         onClick={() => setShowDescription(!showDescription)}
//                                         className="mt-2.5 text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors"
//                                     >
//                                         {showDescription ? "Show Less" : "Show More"}
//                                     </button>
//                                 )}
//                             </div>

//                             {/* Amenities */}
//                             {room.meta_data?.amenities?.length > 0 && (
//                                 <div className="border-t border-gray-100 pt-7 mb-7">
//                                     <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Services</h2>
//                                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
//                                         {room.meta_data.amenities.slice(0, 9).map((amenity, i) => {
//                                             const Icon = amenityIcons[amenity.icon] || BedDouble;
//                                             return (
//                                                 <div
//                                                     key={i}
//                                                     className="flex items-center gap-2.5 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 font-medium"
//                                                 >
//                                                     <Icon size={15} className="text-gray-400 flex-shrink-0" />
//                                                     {amenity.name}
//                                                 </div>
//                                             );
//                                         })}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Similar Rooms */}
//                             {similarRooms.length > 0 && (
//                                 <div className="border-t border-gray-100 pt-7">
//                                     <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                                         Properties available in the same area
//                                     </h2>
//                                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                                         {similarRooms.map((r) => (
//                                             <Link
//                                                 key={r.id}
//                                                 href={`/room/${r.slug}`}
//                                                 className="block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
//                                             >
//                                                 <div className="h-44 overflow-hidden">
//                                                     <img
//                                                         src={getImageUrl(r.images?.[0]?.image)}
//                                                         alt={r.name}
//                                                         className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
//                                                         onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80"; }}
//                                                     />
//                                                 </div>
//                                                 <div className="p-4">
//                                                     <p className="text-sm font-semibold text-gray-900 mb-1 truncate">{r.name}</p>
//                                                     <p className="text-xs text-gray-400 mb-3">{r.roomType?.name || r.room_type?.name}</p>
//                                                     <p className="text-base font-bold text-gray-900">
//                                                         NPR {parseFloat(r.price).toLocaleString()}
//                                                         <span className="text-xs font-normal text-gray-400 ml-1">/night</span>
//                                                     </p>
//                                                 </div>
//                                             </Link>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         {/* RIGHT COLUMN - Booking Card */}
//                         <div>
//                             <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

//                                 {/* Room Identity */}
//                                 <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
//                                     {roomTypeName}
//                                     {room.is_featured && (
//                                         <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
//                                             ★ Featured
//                                         </span>
//                                     )}
//                                 </p>

//                                 <h2 className="text-[22px] font-semibold text-gray-900 mb-2 leading-snug">
//                                     {room.name}
//                                 </h2>

//                                 {/* Capacity badges */}
//                                 <div className="flex items-center gap-0 flex-wrap mb-5">
//                                     {[
//                                         `${room.no_of_adult} ${room.no_of_adult === 1 ? "Adult" : "Adults"}`,
//                                         `${room.no_of_children} ${room.no_of_children === 1 ? "Child" : "Children"}`,
//                                         `${room.no_of_room} ${room.no_of_room === 1 ? "Room" : "Rooms"}`,
//                                     ].map((badge, i, arr) => (
//                                         <span key={i} className="text-xs text-gray-400">
//                                             {badge}
//                                             {i < arr.length - 1 && <span className="mx-1.5 text-gray-300">·</span>}
//                                         </span>
//                                     ))}
//                                 </div>

//                                 {/* Price per night */}
//                                 <div className="mb-5">
//                                     <span className="text-[30px] font-bold text-gray-900 leading-none">
//                                         NPR {parseFloat(room.price).toLocaleString()}
//                                     </span>
//                                     <span className="text-sm text-gray-400 ml-1.5">Night</span>
//                                 </div>

//                                 {/* Check In / Out */}
//                                 <div className="grid grid-cols-2 border border-gray-200 rounded-xl overflow-hidden mb-3">
//                                     <div className="px-4 py-3 border-r border-gray-200">
//                                         <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
//                                             Check In
//                                         </p>
//                                         <input
//                                             type="date"
//                                             value={checkIn}
//                                             onChange={(e) => setCheckIn(e.target.value)}
//                                             min={new Date().toISOString().split("T")[0]}
//                                             className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none"
//                                         />
//                                     </div>
//                                     <div className="px-4 py-3">
//                                         <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
//                                             Check Out
//                                         </p>
//                                         <input
//                                             type="date"
//                                             value={checkOut}
//                                             onChange={(e) => setCheckOut(e.target.value)}
//                                             min={checkIn || new Date().toISOString().split("T")[0]}
//                                             className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Guests */}
//                                 <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 mb-5">
//                                     <div className="flex-1">
//                                         <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
//                                             Guests
//                                         </p>
//                                         <select
//                                             value={guests}
//                                             onChange={(e) => setGuests(parseInt(e.target.value))}
//                                             className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer"
//                                         >
//                                             {[...Array((room.no_of_adult + room.no_of_children) + 1)].map((_, i) => (
//                                                 <option key={i} value={i}>
//                                                     {i} {i === 1 ? "Guest" : "Guests"}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                     </div>
//                                     <ChevronDown size={17} className="text-gray-400 flex-shrink-0" />
//                                 </div>

//                                 {/* Cancellation Policies */}
//                                 <p className="text-sm font-semibold text-gray-900 mb-3">Cancellation Policies</p>

//                                 {/* Non-Refundable option */}
//                                 <div
//                                     onClick={() => setCancellationOption("non-refundable")}
//                                     className={`border rounded-xl p-4 mb-2.5 cursor-pointer transition-all ${
//                                         cancellationOption === "non-refundable"
//                                             ? "border-gray-900 bg-gray-50"
//                                             : "border-gray-200 hover:border-gray-300"
//                                     }`}
//                                 >
//                                     <div className="flex items-center justify-between">
//                                         <span className="text-sm font-medium text-red-500">Non-Refundable</span>
//                                         <span className="text-sm font-bold text-gray-900">
//                                             NPR {(priceInfo ? priceInfo.total : parseFloat(room.price)).toLocaleString()} Total
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Refundable option */}
//                                 <div
//                                     onClick={() => setCancellationOption("refundable")}
//                                     className={`border rounded-xl p-4 mb-5 cursor-pointer transition-all ${
//                                         cancellationOption === "refundable"
//                                             ? "border-gray-900 bg-gray-50"
//                                             : "border-gray-200 hover:border-gray-300"
//                                     }`}
//                                 >
//                                     <div className="flex items-center justify-between mb-1.5">
//                                         <span className="text-sm font-medium text-gray-800">Refundable</span>
//                                         <span className="text-sm font-bold text-gray-900">
//                                             NPR {Math.round(
//                                                 (priceInfo ? priceInfo.total : parseFloat(room.price)) * 1.09
//                                             ).toLocaleString()} Total
//                                         </span>
//                                     </div>
//                                     <p className="text-xs text-gray-400 leading-relaxed">
//                                         Free cancellation before{" "}
//                                         {getDateLabel(checkIn) ?? "your check-in date"}, after that, the reservation is non-refundable.
//                                     </p>
//                                 </div>

//                                 {/* Price Summary */}
//                                 <div className="border-t border-gray-100 pt-4 space-y-2">
//                                     {priceInfo && (
//                                         <>
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-sm text-gray-500">
//                                                     NPR {parseFloat(room.price).toLocaleString()} × {priceInfo.nights}{" "}
//                                                     {priceInfo.nights === 1 ? "night" : "nights"}
//                                                 </span>
//                                                 <span className="text-sm font-medium text-gray-800">
//                                                     NPR {priceInfo.total.toLocaleString()}
//                                                 </span>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <span className="text-sm text-gray-500">Taxes & fees</span>
//                                                 <span className="text-sm text-gray-500">Included</span>
//                                             </div>
//                                         </>
//                                     )}
//                                     <div className="flex items-center justify-between pt-2 border-t border-gray-100">
//                                         <span className="text-sm font-semibold text-gray-900">Total Before Taxes:</span>
//                                         <span className="text-base font-bold text-gray-900">
//                                             NPR {(priceInfo ? priceInfo.total : parseFloat(room.price)).toLocaleString()}
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Reserve Button */}
//                                 <Link
//                                     href={`/booking/create?room=${room.id}`}
//                                     className="block w-full text-center mt-5 py-4 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors"
//                                 >
//                                     Reserve
//                                 </Link>

//                                 {/* Urgency Banner */}
//                                 <div className="flex items-start gap-2.5 mt-4 border border-gray-200 rounded-xl px-4 py-3">
//                                     <Clock size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
//                                     <p className="text-xs text-gray-500 leading-relaxed">
//                                         <span className="font-semibold text-gray-800">Only 6 hours left to book.</span>{" "}
//                                         the host will stop accepting bookings for your dates soon.
//                                     </p>
//                                 </div>

//                                 {/* Report Link */}
//                                 <a
//                                     href="#"
//                                     className="flex items-center gap-1.5 mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
//                                 >
//                                     <Flag size={13} />
//                                     Report this listing
//                                 </a>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default RoomDetails;

import React, { useEffect, useState, useCallback } from "react";
import { Link, usePage, Head } from "@inertiajs/react";
import axios from "axios";
import {
    BedDouble,
    Bath,
    Maximize2,
    Shield,
    Wifi,
    Coffee,
    Tv,
    Wind,
    ChevronLeft,
    ChevronRight,
    X,
    Users,
    ChevronDown,
    Clock,
    Flag,
} from "lucide-react";

// ─── Amenity icon map ──────────────────────────────────────────────────────────
const amenityIcons = {
    wifi: Wifi,
    coffee: Coffee,
    tv: Tv,
    ac: Wind,
    safe: Shield,
    bed: BedDouble,
    bath: Bath,
    maximize: Maximize2,
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
function numberToWord(n) {
    const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
    return words[n] ?? n;
}

function getDateLabel(dateStr) {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Component ────────────────────────────────────────────────────────────────
const RoomDetails = ({ room: initialRoom }) => {
    const { props } = usePage();
    const imgurl = import.meta.env.VITE_IMAGE_PATH;

    // ── Image URL helper ────────────────────────────────────────────────────────
    const getImageUrl = useCallback((imagePath) => {
        if (!imagePath) return "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80";
        if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) return imagePath;
        return `${imgurl}/${imagePath}`;
    }, [imgurl]);

    // ── State ────────────────────────────────────────────────────────────────────
    const [room, setRoom] = useState(initialRoom ?? null);
    const [loading, setLoading] = useState(!initialRoom);
    const [showLightbox, setShowLightbox] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(1);
    const [similarRooms, setSimilarRooms] = useState([]);
    const [showDescription, setShowDescription] = useState(false);
    const [cancellationOption, setCancellationOption] = useState("non-refundable");

    const slug = initialRoom?.slug || props.slug;

    // ── Fetch room (fallback when no SSR prop) ─────────────────────────────────
    useEffect(() => {
        if (!initialRoom && slug) fetchRoomDetails();
    }, [slug]);

    useEffect(() => {
        if (room) fetchSimilarRooms();
    }, [room?.id]);

    const fetchRoomDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/room/${slug}`);
            setRoom(response.data.data || response.data);
        } catch (err) {
            console.error("Error fetching room details:", err);
            setRoom(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarRooms = async () => {
        try {
            const response = await axios.get(route("ourroom.index"));
            const roomsData = response.data.data || response.data;
            setSimilarRooms(
                roomsData
                    .filter((r) => r.room_type_id === room.room_type_id && r.id !== room.id && !r.is_archived)
                    .slice(0, 3)
            );
        } catch (err) {
            console.error("Error fetching similar rooms:", err);
        }
    };

    // ── Price calculation ────────────────────────────────────────────────────────
    const calculateTotalPrice = () => {
        if (!checkIn || !checkOut || !room) return null;
        const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
        if (nights < 1) return null;
        return { nights, total: nights * parseFloat(room.price) };
    };

    // ── Lightbox ─────────────────────────────────────────────────────────────────
    const openLightbox = (index) => {
        setLightboxIndex(index);
        setShowLightbox(true);
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setShowLightbox(false);
        document.body.style.overflow = "unset";
    };

    const navigateLightbox = (dir) => {
        setLightboxIndex((prev) =>
            dir === "next"
                ? prev === images.length - 1 ? 0 : prev + 1
                : prev === 0 ? images.length - 1 : prev - 1
        );
    };

    // ── SEO ──────────────────────────────────────────────────────────────────────
    // Structure in DB:
    // meta_data = {
    //   title: "...",           ← page title
    //   description: "...",     ← page description
    //   keywords: [...],        ← keywords array
    //   seo: {                  ← OG / social data
    //     url, image, title, description, type, site_name
    //   }
    // }
    const getSEOMetadata = () => {
        const meta = room?.meta_data ?? {};
       const og = meta.og ?? meta.seo ?? {};

        const fallbackTitle = room?.name ? `${room.name} - Hotel` : "Room Details";
        const fallbackDesc  = room?.short_description || "Experience luxury and comfort.";
        const fallbackImage = room?.images?.[0]?.image
            ? getImageUrl(room.images[0].image)
            : "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80";
        const fallbackUrl   = typeof window !== "undefined" ? window.location.href : "";

        return {
            // Primary meta — root level of meta_data
            title:         meta.title                || fallbackTitle,
            description:   meta.description          || fallbackDesc,
            keywords:      Array.isArray(meta.keywords)
                               ? meta.keywords.join(", ")
                               : (meta.keywords      || room?.name || ""),
            metaRobots:    meta.meta_robots           || "index, follow",
            canonical:     meta.canonical             || og.url || fallbackUrl,

            // OG — lives inside meta_data.seo
            ogTitle:       og.title                  || meta.title       || fallbackTitle,
            ogDescription: og.description            || meta.description || fallbackDesc,
            ogImage:       og.image                  || fallbackImage,
            ogUrl:         og.url                    || fallbackUrl,
            ogType:        og.type                   || "website",
            ogSiteName:    og.site_name              || "",

            // Twitter
            twitterCard:   meta.twitter_card         || "summary_large_image",
        };
    };

    console.log("SEO getMetadata:", getSEOMetadata());

    // ── Structured data ──────────────────────────────────────────────────────────
    const generateStructuredData = () => {
        if (!room) return null;
        const seo = getSEOMetadata();
        const imagesList = (room.images ?? []).map((img) => getImageUrl(img.image)).filter(Boolean);
        const priceValidUntil = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
            .toISOString().split("T")[0];

        return {
            "@context": "https://schema.org",
            "@type": "Product",
            name: room.name,
            description: seo.description,
            image: imagesList,
            sku: room.refrence_id || String(room.id),
            brand: {
                "@type": "Brand",
                name: room.roomType?.name || room.room_type?.name || "Hotel Room",
            },
            offers: {
                "@type": "Offer",
                price: room.price,
                priceCurrency: "NPR",
                availability: "https://schema.org/InStock",
                url: seo.canonical,
                priceValidUntil,
            },
        };
    };

    // ── Derived data ──────────────────────────────────────────────────────────────
    const images        = room?.images?.length ? room.images : [{ image: null }];
    const roomTypeName  = room?.roomType?.name || room?.room_type?.name || "Hotel Room";
    const seoMetadata   = getSEOMetadata();
    const structuredData = generateStructuredData();
    const priceInfo     = calculateTotalPrice();

    // ── Loading state ─────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <>
                <Head>
                    <title>Loading... - Hotel</title>
                    <meta name="robots" content="noindex" />
                </Head>
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500 font-medium">Loading property...</p>
                </div>
            </>
        );
    }

    // ── Not found state ───────────────────────────────────────────────────────────
    if (!room) {
        return (
            <>
                <Head>
                    <title>Room Not Found</title>
                    <meta name="robots" content="noindex" />
                </Head>
                <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                    <BedDouble size={48} className="text-gray-300" />
                    <h3 className="text-xl font-semibold text-gray-800">Room Not Found</h3>
                    <Link
                        href="/rooms"
                        className="mt-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
                    >
                        Browse Rooms
                    </Link>
                </div>
            </>
        );
    }

    // ── Stats grid items ──────────────────────────────────────────────────────────
    const stats = [
        { label: "Adults",       value: numberToWord(room.no_of_adult),                                         icon: Users     },
        { label: "Children",     value: room.no_of_children > 0 ? numberToWord(room.no_of_children) : "None",  icon: Users     },
        { label: "No. of Rooms", value: numberToWord(room.no_of_room),                                          icon: BedDouble },
        { label: "Room Type",    value: roomTypeName,                                                            icon: Maximize2, small: true },
    ];


    console.log("SEO Metadata:", seoMetadata);

    return (
        <>
            <Head>
                {/* ── Primary meta ── */}
                <title>{seoMetadata.title}</title>
                <meta name="description" content={seoMetadata.description} />
                <meta name="keywords"    content={seoMetadata.keywords} />
                <meta name="robots"      content={seoMetadata.metaRobots} />
                <link rel="canonical"    href={seoMetadata.canonical} />

                {/* ── Open Graph ── */}
                <meta property="og:title"                content={seoMetadata.ogTitle} />
                <meta property="og:description"          content={seoMetadata.ogDescription} />
                <meta property="og:image"                content={seoMetadata.ogImage} />
                <meta property="og:url"                  content={seoMetadata.ogUrl} />
                <meta property="og:type"                 content={seoMetadata.ogType} />
                <meta property="og:site_name"            content={seoMetadata.ogSiteName} />
                <meta property="product:price:amount"    content={String(room.price)} />
                <meta property="product:price:currency"  content="NPR" />

                {/* ── Twitter Card ── */}
                <meta name="twitter:card"        content={seoMetadata.twitterCard} />
                <meta name="twitter:title"       content={seoMetadata.ogTitle} />
                <meta name="twitter:description" content={seoMetadata.ogDescription} />
                <meta name="twitter:image"       content={seoMetadata.ogImage} />

                {/* ── Structured data (JSON-LD) ── */}
                {structuredData && (
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                    />
                )}
            </Head>

            <div className="min-h-screen bg-[#f8f7f4]">

                {/* ── Lightbox ───────────────────────────────────────────────────── */}
                {showLightbox && (
                    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
                        <button
                            onClick={closeLightbox}
                            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={() => navigateLightbox("prev")}
                            className="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <img
                            src={getImageUrl(images[lightboxIndex]?.image)}
                            alt={`${room.name} - View ${lightboxIndex + 1}`}
                            className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl"
                        />
                        <button
                            onClick={() => navigateLightbox("next")}
                            className="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                        >
                            <ChevronRight size={24} />
                        </button>
                        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-4 py-1.5 rounded-full">
                            {lightboxIndex + 1} / {images.length}
                        </div>
                    </div>
                )}

                {/* ── Page Body ──────────────────────────────────────────────────── */}
                <div className="max-w-[1200px] mx-auto px-6 py-8">

                    {/* Image Gallery Grid */}
                    <div className="grid grid-cols-2 grid-rows-2 gap-2 h-[480px] rounded-2xl overflow-hidden">
                        <div
                            className="row-span-2 relative cursor-pointer overflow-hidden group"
                            onClick={() => openLightbox(0)}
                        >
                            <img
                                src={getImageUrl(images[0]?.image)}
                                alt={room.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"; }}
                            />
                        </div>
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="relative cursor-pointer overflow-hidden group"
                                onClick={() => openLightbox(Math.min(i, images.length - 1))}
                            >
                                <img
                                    src={getImageUrl(images[Math.min(i, images.length - 1)]?.image)}
                                    alt={`${room.name} view ${i + 1}`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80"; }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Two-Column Layout */}
                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">

                        {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
                        <div>
                            {/* Title Row */}
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <h1 className="text-3xl font-semibold text-gray-900 tracking-tight leading-tight">
                                        {room.name}
                                    </h1>
                                    <p className="mt-1.5 text-sm text-gray-400">
                                        {roomTypeName}
                                        {room.refrence_id && (
                                            <span className="ml-2 text-gray-300">· Ref #{room.refrence_id}</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-4 border border-gray-200 rounded-xl overflow-hidden mb-8">
                                {stats.map((stat, i) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div
                                            key={i}
                                            className={`flex flex-col gap-2 px-4 py-4 ${i < stats.length - 1 ? "border-r border-gray-200" : ""}`}
                                        >
                                            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                                                {stat.label}
                                            </span>
                                            <span className={`flex items-center gap-1.5 font-semibold text-gray-800 ${stat.small ? "text-xs" : "text-sm"}`}>
                                                <Icon size={14} className="text-gray-400" />
                                                {stat.value}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Description */}
                            <div className="border-t border-gray-100 pt-7 mb-7">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {room.short_description && <span>{room.short_description} </span>}
                                    {showDescription && room.long_description && (
                                        <span>{room.long_description}</span>
                                    )}
                                    {!room.short_description && !room.long_description &&
                                        `Experience unparalleled comfort in our meticulously designed ${room.name}. Perfect for ${room.no_of_adult} ${room.no_of_adult === 1 ? "adult" : "adults"}${room.no_of_children > 0 ? ` and ${room.no_of_children} ${room.no_of_children === 1 ? "child" : "children"}` : ""}, this room offers a perfect sanctuary for both business and leisure travelers.`
                                    }
                                </p>
                                {room.long_description && (
                                    <button
                                        onClick={() => setShowDescription(!showDescription)}
                                        className="mt-2.5 text-sm font-semibold text-gray-900 underline underline-offset-2 hover:text-gray-600 transition-colors"
                                    >
                                        {showDescription ? "Show Less" : "Show More"}
                                    </button>
                                )}
                            </div>

                            {/* Amenities */}
                            {room.meta_data?.amenities?.length > 0 && (
                                <div className="border-t border-gray-100 pt-7 mb-7">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities & Services</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {room.meta_data.amenities.slice(0, 9).map((amenity, i) => {
                                            const Icon = amenityIcons[amenity.icon] || BedDouble;
                                            return (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-2.5 px-4 py-3 bg-gray-50 rounded-xl text-sm text-gray-700 font-medium"
                                                >
                                                    <Icon size={15} className="text-gray-400 flex-shrink-0" />
                                                    {amenity.name}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Similar Rooms */}
                            {similarRooms.length > 0 && (
                                <div className="border-t border-gray-100 pt-7">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                        Properties available in the same area
                                    </h2>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {similarRooms.map((r) => (
                                            <Link
                                                key={r.id}
                                                href={`/room/${r.slug}`}
                                                className="block bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow group"
                                            >
                                                <div className="h-44 overflow-hidden">
                                                    <img
                                                        src={getImageUrl(r.images?.[0]?.image)}
                                                        alt={r.name}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80"; }}
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-sm font-semibold text-gray-900 mb-1 truncate">{r.name}</p>
                                                    <p className="text-xs text-gray-400 mb-3">{r.roomType?.name || r.room_type?.name}</p>
                                                    <p className="text-base font-bold text-gray-900">
                                                        NPR {parseFloat(r.price).toLocaleString()}
                                                        <span className="text-xs font-normal text-gray-400 ml-1">/night</span>
                                                    </p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ── RIGHT COLUMN - Booking Card ──────────────────────────── */}
                        <div>
                            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

                                {/* Room Identity */}
                                <p className="text-sm text-gray-400 mb-1 flex items-center gap-2">
                                    {roomTypeName}
                                    {room.is_featured && (
                                        <span className="bg-amber-100 text-amber-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                            ★ Featured
                                        </span>
                                    )}
                                </p>

                                <h2 className="text-[22px] font-semibold text-gray-900 mb-2 leading-snug">
                                    {room.name}
                                </h2>

                                {/* Capacity badges */}
                                <div className="flex items-center flex-wrap mb-5">
                                    {[
                                        `${room.no_of_adult} ${room.no_of_adult === 1 ? "Adult" : "Adults"}`,
                                        `${room.no_of_children} ${room.no_of_children === 1 ? "Child" : "Children"}`,
                                        `${room.no_of_room} ${room.no_of_room === 1 ? "Room" : "Rooms"}`,
                                    ].map((badge, i, arr) => (
                                        <span key={i} className="text-xs text-gray-400">
                                            {badge}
                                            {i < arr.length - 1 && <span className="mx-1.5 text-gray-300">·</span>}
                                        </span>
                                    ))}
                                </div>

                                {/* Price per night */}
                                <div className="mb-5">
                                    <span className="text-[30px] font-bold text-gray-900 leading-none">
                                        NPR {parseFloat(room.price).toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-400 ml-1.5">/ Night</span>
                                </div>

                                {/* Check In / Out */}
                                <div className="grid grid-cols-2 border border-gray-200 rounded-xl overflow-hidden mb-3">
                                    <div className="px-4 py-3 border-r border-gray-200">
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                                            Check In
                                        </p>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            min={new Date().toISOString().split("T")[0]}
                                            className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none"
                                        />
                                    </div>
                                    <div className="px-4 py-3">
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                                            Check Out
                                        </p>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            min={checkIn || new Date().toISOString().split("T")[0]}
                                            className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Guests */}
                                <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4 py-3 mb-5">
                                    <div className="flex-1">
                                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                                            Guests
                                        </p>
                                        <select
                                            value={guests}
                                            onChange={(e) => setGuests(parseInt(e.target.value))}
                                            className="w-full text-sm font-medium text-gray-800 bg-transparent border-none outline-none cursor-pointer"
                                        >
                                            {[...Array(room.no_of_adult + room.no_of_children + 1)].map((_, i) => (
                                                <option key={i} value={i}>
                                                    {i} {i === 1 ? "Guest" : "Guests"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <ChevronDown size={17} className="text-gray-400 flex-shrink-0" />
                                </div>

                                {/* Cancellation Policies */}
                                <p className="text-sm font-semibold text-gray-900 mb-3">Cancellation Policies</p>

                                {/* Non-Refundable */}
                                <div
                                    onClick={() => setCancellationOption("non-refundable")}
                                    className={`border rounded-xl p-4 mb-2.5 cursor-pointer transition-all ${
                                        cancellationOption === "non-refundable"
                                            ? "border-gray-900 bg-gray-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-red-500">Non-Refundable</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            NPR {(priceInfo ? priceInfo.total : parseFloat(room.price)).toLocaleString()} Total
                                        </span>
                                    </div>
                                </div>

                                {/* Refundable */}
                                <div
                                    onClick={() => setCancellationOption("refundable")}
                                    className={`border rounded-xl p-4 mb-5 cursor-pointer transition-all ${
                                        cancellationOption === "refundable"
                                            ? "border-gray-900 bg-gray-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-medium text-gray-800">Refundable</span>
                                        <span className="text-sm font-bold text-gray-900">
                                            NPR {Math.round(
                                                (priceInfo ? priceInfo.total : parseFloat(room.price)) * 1.09
                                            ).toLocaleString()} Total
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Free cancellation before{" "}
                                        {getDateLabel(checkIn) ?? "your check-in date"}, after that the reservation is non-refundable.
                                    </p>
                                </div>

                                {/* Price Summary */}
                                <div className="border-t border-gray-100 pt-4 space-y-2">
                                    {priceInfo && (
                                        <>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    NPR {parseFloat(room.price).toLocaleString()} × {priceInfo.nights}{" "}
                                                    {priceInfo.nights === 1 ? "night" : "nights"}
                                                </span>
                                                <span className="text-sm font-medium text-gray-800">
                                                    NPR {priceInfo.total.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">Taxes & fees</span>
                                                <span className="text-sm text-gray-500">Included</span>
                                            </div>
                                        </>
                                    )}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <span className="text-sm font-semibold text-gray-900">Total Before Taxes:</span>
                                        <span className="text-base font-bold text-gray-900">
                                            NPR {(priceInfo ? priceInfo.total : parseFloat(room.price)).toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Reserve Button */}
                                <Link
                                    href={`/booking/create?room=${room.id}`}
                                    className="block w-full text-center mt-5 py-4 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-700 transition-colors"
                                >
                                    Reserve
                                </Link>

                                {/* Urgency Banner */}
                                <div className="flex items-start gap-2.5 mt-4 border border-gray-200 rounded-xl px-4 py-3">
                                    <Clock size={15} className="text-gray-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        <span className="font-semibold text-gray-800">Only 6 hours left to book.</span>{" "}
                                        The host will stop accepting bookings for your dates soon.
                                    </p>
                                </div>

                                {/* Report Link */}
                                <a
                                    href="#"
                                    className="flex items-center gap-1.5 mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <Flag size={13} />
                                    Report this listing
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default RoomDetails;
