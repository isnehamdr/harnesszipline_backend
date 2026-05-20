// import Checkbox from '@/Components/Checkbox';
// import InputError from '@/Components/InputError';
// import InputLabel from '@/Components/InputLabel';
// import PrimaryButton from '@/Components/PrimaryButton';
// import TextInput from '@/Components/TextInput';
// import GuestLayout from '@/Layouts/GuestLayout';
// import { Head, Link, useForm } from '@inertiajs/react';

// export default function Login({ status, canResetPassword }) {
//     const { data, setData, post, processing, errors, reset } = useForm({
//         email: '',
//         password: '',
//         remember: false,
//     });

//     const submit = (e) => {
//         e.preventDefault();

//         post(route('login'), {
//             onFinish: () => reset('password'),
//         });
//     };

//     return (
//         <GuestLayout>
//             <Head title="Log in" />

//             {status && (
//                 <div className="mb-4 text-sm font-medium text-green-600">
//                     {status}
//                 </div>
//             )}

//             <form onSubmit={submit}>
//                 <div>
//                     <InputLabel htmlFor="email" value="Email" />

//                     <TextInput
//                         id="email"
//                         type="email"
//                         name="email"
//                         value={data.email}
//                         className="mt-1 block w-full"
//                         autoComplete="username"
//                         isFocused={true}
//                         onChange={(e) => setData('email', e.target.value)}
//                     />

//                     <InputError message={errors.email} className="mt-2" />
//                 </div>

//                 <div className="mt-4">
//                     <InputLabel htmlFor="password" value="Password" />

//                     <TextInput
//                         id="password"
//                         type="password"
//                         name="password"
//                         value={data.password}
//                         className="mt-1 block w-full"
//                         autoComplete="current-password"
//                         onChange={(e) => setData('password', e.target.value)}
//                     />

//                     <InputError message={errors.password} className="mt-2" />
//                 </div>

//                 <div className="mt-4 block">
//                     <label className="flex items-center">
//                         <Checkbox
//                             name="remember"
//                             checked={data.remember}
//                             onChange={(e) =>
//                                 setData('remember', e.target.checked)
//                             }
//                         />
//                         <span className="ms-2 text-sm text-gray-600">
//                             Remember me
//                         </span>
//                     </label>
//                 </div>

//                 <div className="mt-4 flex items-center justify-end">
//                     {canResetPassword && (
//                         <Link
//                             href={route('password.request')}
//                             className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
//                         >
//                             Forgot your password?
//                         </Link>
//                     )}

//                     <PrimaryButton className="ms-4" disabled={processing}>
//                         Log in
//                     </PrimaryButton>
//                 </div>
//             </form>
//         </GuestLayout>
//     );
// }

import { useState, useEffect, useRef } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [loginSuccess, setLoginSuccess] = useState(false);
    const panelRef = useRef(null);

    useEffect(() => {
        setTimeout(() => setIsMounted(true), 100);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (panelRef.current) {
                const rect = panelRef.current.getBoundingClientRect();
                setMousePos({
                    x: ((e.clientX - rect.left) / rect.width) * 100,
                    y: ((e.clientY - rect.top) / rect.height) * 100,
                });
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onSuccess: () => {
                setLoginSuccess(true);
            },
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Log in" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@200;300;400;500;600&display=swap');
                
                * { box-sizing: border-box; }
                
                .sans { font-family: 'Outfit', sans-serif; }

                @keyframes float-slow {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    33% { transform: translateY(-14px) rotate(-1.5deg); }
                    66% { transform: translateY(8px) rotate(1deg); }
                }
                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes success-scale {
                    0% { transform: scale(0.8); opacity: 0; }
                    60% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes draw-circle {
                    from { stroke-dashoffset: 283; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes draw-check {
                    from { stroke-dashoffset: 50; }
                    to { stroke-dashoffset: 0; }
                }

                .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
                .animate-float-medium { animation: float-medium 11s ease-in-out infinite; }
                .animate-spin-slow { animation: spin-slow 20s linear infinite; }
                .animate-success { animation: success-scale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

                .shimmer-text {
                    background: linear-gradient(90deg, #c9a96e 0%, #f5e4b8 40%, #c9a96e 60%, #f5e4b8 100%);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    animation: shimmer 4s linear infinite;
                }

                .input-field {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: #f0ece4;
                    transition: all 0.3s ease;
                    font-family: 'Outfit', sans-serif;
                    font-weight: 300;
                    letter-spacing: 0.02em;
                }
                .input-field:focus {
                    outline: none;
                    background: rgba(201,169,110,0.05);
                    border-color: rgba(201,169,110,0.5);
                    box-shadow: 0 0 0 3px rgba(201,169,110,0.08), inset 0 1px 0 rgba(255,255,255,0.05);
                }
                .input-field::placeholder { color: rgba(255,255,255,0.2); }
                .input-field:disabled { opacity: 0.5; cursor: not-allowed; }

                .gold-btn {
                    background: linear-gradient(135deg, #c9a96e 0%, #e8d5a3 50%, #c9a96e 100%);
                    background-size: 200% auto;
                    color: #1a1208;
                    transition: all 0.4s ease;
                    font-family: 'Outfit', sans-serif;
                }
                .gold-btn:hover:not(:disabled) {
                    background-position: right center;
                    box-shadow: 0 8px 30px rgba(201,169,110,0.35);
                    transform: translateY(-1px);
                }
                .gold-btn:active:not(:disabled) { transform: translateY(0); }
                .gold-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .delay-0 { animation-delay: 0ms; }
                .delay-100 { animation-delay: 100ms; }
                .delay-200 { animation-delay: 200ms; }
                .delay-300 { animation-delay: 300ms; }

                .stagger { opacity: 0; }
                .stagger.mounted { animation: fade-up 0.7s ease forwards; }

                .circle-anim {
                    stroke-dasharray: 283;
                    stroke-dashoffset: 283;
                    animation: draw-circle 0.6s ease 0.2s forwards;
                }
                .check-anim {
                    stroke-dasharray: 50;
                    stroke-dashoffset: 50;
                    animation: draw-check 0.4s ease 0.7s forwards;
                }
            `}</style>

            <div
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="min-h-screen bg-[#0a0a0a] flex overflow-hidden"
            >
                {/* Left Panel - with Background Image */}
                <div
                    ref={panelRef}
                    className="hidden lg:flex lg:w-[50%] relative overflow-hidden"
                    style={{
                        background: "#0e0c09",
                        backgroundImage: `url('/images/login.png')`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundBlendMode: "overlay",
                    }}
                >
                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-black/40" />

                    {/* Dynamic gradient following mouse */}
                    <div
                        className="absolute inset-0 transition-all duration-700"
                        style={{
                            background: `radial-gradient(ellipse 60% 60% at ${mousePos.x}% ${mousePos.y}%, rgba(201,169,110,0.25) 0%, transparent 80%)`,
                        }}
                    />

                    {/* Geometric accents */}
                    <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-[rgba(201,169,110,0.3)] to-transparent" />

                    {/* Floating orbs */}
                    <div
                        className="animate-float-slow absolute top-[15%] right-[20%] w-64 h-64 rounded-full opacity-40"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(201,169,110,0.5) 0%, transparent 70%)",
                        }}
                    />
                    <div
                        className="animate-float-medium absolute bottom-[20%] left-[10%] w-48 h-48 rounded-full opacity-40"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(201,169,110,0.4) 0%, transparent 70%)",
                        }}
                    />

                    {/* Spinning ring decoration */}
                    <div className="animate-spin-slow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-20">
                        <svg
                            viewBox="0 0 200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="100"
                                cy="100"
                                r="95"
                                stroke="#c9a96e"
                                strokeWidth="0.5"
                                strokeDasharray="4 8"
                            />
                            <circle
                                cx="100"
                                cy="100"
                                r="75"
                                stroke="#c9a96e"
                                strokeWidth="0.3"
                                strokeDasharray="2 6"
                            />
                        </svg>
                    </div>

                    {/* Content */}
                    <div className="relative z-20 flex flex-col justify-between p-14 w-full">
                        {/* Logo */}
                        {/* <div className={`stagger ${isMounted ? "mounted delay-0" : ""} flex items-center gap-4`}>
                            <div className="relative">
                                <div className="w-9 h-9 border border-[rgba(201,169,110,0.6)] flex items-center justify-center bg-black/20 backdrop-blur-sm">
                                    <div className="w-3 h-3 bg-[#c9a96e]" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-[rgba(201,169,110,0.4)]" />
                            </div>
                            <span className="sans text-[#c9a96e] text-xs font-medium tracking-[0.35em] uppercase">Harness Zipline</span>
                        </div> */}
                        <div
                            className={`stagger ${isMounted ? "mounted delay-0" : ""} flex items-center gap-4`}
                        >
                            <img
                                src="/images/logo.webp"
                                alt="Harness Zipline"
                                className="h-[100px] w-auto object-contain"
                            />
                        </div>

                        {/* Main headline */}
                        <div>
                            <div
                                className={`stagger ${isMounted ? "mounted delay-100" : ""}`}
                            >
                                <p className="sans text-[rgba(201,169,110,0.7)] text-[10px] tracking-[0.5em] uppercase mb-8 font-light">
                                    Enterprise Intelligence
                                </p>
                            </div>

                            <div
                                className={`stagger ${isMounted ? "mounted delay-200" : ""}`}
                            >
                                <h1
                                    style={{
                                        fontSize: "clamp(2.5rem, 4vw, 4rem)",
                                        lineHeight: 1.05,
                                        fontWeight: 300,
                                        color: "#f0ece4",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Where vision
                                    <br />
                                    <em
                                        className="shimmer-text"
                                        style={{
                                            fontStyle: "italic",
                                            fontWeight: 400,
                                        }}
                                    >
                                        becomes action.
                                    </em>
                                </h1>
                            </div>

                            <div
                                className={`stagger ${isMounted ? "mounted delay-300" : ""} mt-8`}
                            >
                                <div className="w-8 h-px bg-[rgba(201,169,110,0.4)] mb-6" />
                                <p
                                    className="sans text-[rgba(255,255,255,0.6)] text-sm leading-relaxed font-light max-w-sm"
                                    style={{ letterSpacing: "0.01em" }}
                                >
                                    A unified command center for modern
                                    enterprises. Clarity at every level,
                                    decisions at every moment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div
                    className="flex-1 flex items-center justify-center relative overflow-hidden"
                    style={{ background: "#080808" }}
                >
                    {/* Subtle background detail */}
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage:
                                "radial-gradient(circle at 80% 20%, rgba(201,169,110,0.06) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(201,169,110,0.04) 0%, transparent 50%)",
                        }}
                    />

                    {/* Corner decorations */}
                    <div className="absolute top-8 right-8 w-16 h-16 border-t border-r border-[rgba(201,169,110,0.15)]" />
                    <div className="absolute bottom-8 left-8 w-16 h-16 border-b border-l border-[rgba(201,169,110,0.15)]" />

                    <div className="relative z-10 w-full max-w-[420px] px-8 py-12">
                        {/* Status message from Inertia */}
                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 text-center bg-green-50/10 p-3 rounded-sm">
                                {status}
                            </div>
                        )}

                        {/* Success State */}
                        {loginSuccess && (
                            <div className="animate-success text-center">
                                <div className="mb-6 inline-block">
                                    <svg
                                        width="80"
                                        height="80"
                                        viewBox="0 0 100 100"
                                    >
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            stroke="rgba(201,169,110,0.2)"
                                            strokeWidth="1.5"
                                            fill="none"
                                        />
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            stroke="#c9a96e"
                                            strokeWidth="1.5"
                                            fill="none"
                                            className="circle-anim"
                                        />
                                        <polyline
                                            points="30,50 44,64 70,36"
                                            stroke="#c9a96e"
                                            strokeWidth="2.5"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="check-anim"
                                        />
                                    </svg>
                                </div>
                                <h3
                                    style={{
                                        fontSize: "2rem",
                                        fontWeight: 300,
                                        color: "#f0ece4",
                                        letterSpacing: "-0.01em",
                                    }}
                                >
                                    Welcome back.
                                </h3>
                                <p className="sans text-[rgba(255,255,255,0.35)] text-sm mt-2 font-light">
                                    Redirecting you now...
                                </p>
                            </div>
                        )}

                        {!loginSuccess && (
                            <>
                                {/* Mobile Logo */}
                                <div
                                    className={`lg:hidden mb-10 stagger ${isMounted ? "mounted delay-0" : ""} flex items-center gap-3`}
                                >
                                    <div className="w-7 h-7 border border-[rgba(201,169,110,0.5)] flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 bg-[#c9a96e]" />
                                    </div>
                                    <span className="sans text-[#c9a96e] text-xs font-medium tracking-[0.35em] uppercase">
                                        Harness Zipline
                                    </span>
                                </div>

                                {/* Header */}
                                <div
                                    className={`stagger ${isMounted ? "mounted delay-100" : ""} mb-10`}
                                >
                                    <p className="sans text-[rgba(201,169,110,0.5)] text-[10px] tracking-[0.5em] uppercase font-light mb-3">
                                        Secure Access
                                    </p>
                                    <h2
                                        style={{
                                            fontSize:
                                                "clamp(2rem, 3.5vw, 2.75rem)",
                                            fontWeight: 300,
                                            color: "#f0ece4",
                                            lineHeight: 1.05,
                                            letterSpacing: "-0.01em",
                                        }}
                                    >
                                        Sign in to your
                                        <br />
                                        <em
                                            style={{
                                                fontStyle: "italic",
                                                color: "#c9a96e",
                                            }}
                                        >
                                            workspace.
                                        </em>
                                    </h2>
                                </div>

                                {/* Form */}
                                <form
                                    onSubmit={submit}
                                    className={`stagger ${isMounted ? "mounted delay-300" : ""} space-y-5`}
                                >
                                    {/* Email */}
                                    <div>
                                        <label className="sans block text-[rgba(255,255,255,0.4)] text-[10px] tracking-[0.3em] uppercase font-light mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <svg
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40"
                                                width="15"
                                                height="15"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                style={{ color: "#c9a96e" }}
                                            >
                                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                                <polyline points="22,6 12,13 2,6" />
                                            </svg>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        e.target.value,
                                                    )
                                                }
                                                onFocus={() =>
                                                    setFocusedField("email")
                                                }
                                                onBlur={() =>
                                                    setFocusedField(null)
                                                }
                                                placeholder="you@company.com"
                                                disabled={processing}
                                                autoComplete="username"
                                                className={`input-field w-full pl-10 pr-4 py-3.5 text-sm rounded-sm ${errors.email ? "border-[rgba(220,60,60,0.5)]" : ""}`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="sans text-[#e07070] text-xs mt-1.5 font-light">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="sans block text-[rgba(255,255,255,0.4)] text-[10px] tracking-[0.3em] uppercase font-light mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <svg
                                                className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40"
                                                width="15"
                                                height="15"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                style={{ color: "#c9a96e" }}
                                            >
                                                <rect
                                                    x="3"
                                                    y="11"
                                                    width="18"
                                                    height="11"
                                                    rx="2"
                                                    ry="2"
                                                />
                                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                            </svg>
                                            <input
                                                id="password"
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                name="password"
                                                value={data.password}
                                                onChange={(e) =>
                                                    setData(
                                                        "password",
                                                        e.target.value,
                                                    )
                                                }
                                                onFocus={() =>
                                                    setFocusedField("password")
                                                }
                                                onBlur={() =>
                                                    setFocusedField(null)
                                                }
                                                placeholder="Enter your password"
                                                disabled={processing}
                                                autoComplete="current-password"
                                                className={`input-field w-full pl-10 pr-12 py-3.5 text-sm rounded-sm ${errors.password ? "border-[rgba(220,60,60,0.5)]" : ""}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword,
                                                    )
                                                }
                                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.25)] hover:text-[rgba(201,169,110,0.7)] transition-colors"
                                                disabled={processing}
                                            >
                                                {showPassword ? (
                                                    <svg
                                                        width="15"
                                                        height="15"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                        <line
                                                            x1="1"
                                                            y1="1"
                                                            x2="23"
                                                            y2="23"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <svg
                                                        width="15"
                                                        height="15"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.5"
                                                    >
                                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="3"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="sans text-[#e07070] text-xs mt-1.5 font-light">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>

                                    {/* Remember / Forgot */}
                                    {/* <div className="flex items-center justify-between pt-1">
                                        <label className="flex items-center gap-2.5 cursor-pointer group">
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={data.remember}
                                                    onChange={(e) => setData('remember', e.target.checked)}
                                                    className="sr-only"
                                                    disabled={processing}
                                                />
                                                <div
                                                    className="w-4 h-4 rounded-none border flex items-center justify-center transition-all duration-200"
                                                    style={{
                                                        borderColor: data.remember ? "rgba(201,169,110,0.7)" : "rgba(255,255,255,0.15)",
                                                        background: data.remember ? "rgba(201,169,110,0.15)" : "transparent"
                                                    }}
                                                    onClick={() => setData('remember', !data.remember)}
                                                >
                                                    {data.remember && (
                                                        <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="#c9a96e" strokeWidth="2">
                                                            <polyline points="1.5,6 4.5,9 10.5,3"/>
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="sans text-[rgba(255,255,255,0.35)] text-xs font-light">Remember me</span>
                                        </label>
                                        
                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="sans text-[rgba(201,169,110,0.6)] hover:text-[#c9a96e] text-xs font-light transition-colors border-b border-[rgba(201,169,110,0.2)] hover:border-[rgba(201,169,110,0.5)] pb-px"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div> */}

                                    {/* Submit */}
                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="gold-btn w-full py-4 rounded-sm sans text-sm font-medium tracking-[0.2em] uppercase flex items-center justify-center gap-3"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg
                                                        className="animate-spin w-4 h-4"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <circle
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            strokeOpacity="0.25"
                                                        />
                                                        <path d="M12 2a10 10 0 0 1 10 10" />
                                                    </svg>
                                                    Authenticating
                                                </>
                                            ) : (
                                                <>
                                                    Sign In
                                                    <svg
                                                        width="14"
                                                        height="14"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                                    </svg>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
