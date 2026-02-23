import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <img
                    id="background"
                    className="absolute -left-20 top-0 max-w-[877px]"
                    src="https://laravel.com/assets/img/welcome/background.svg"
                />
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-10 lg:grid-cols-3">
                            <div className="flex lg:col-start-2 lg:justify-center">
                                <svg
                                    className="h-12 w-auto text-white lg:h-16 lg:text-[#FF2D20]"
                                    viewBox="0 0 62 65"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M61.8548 14.6253C61.8778 14.7102 61.8895 14.7978 61.8897 14.8858V28.5615C61.8898 28.737 61.8434 28.9095 61.7554 29.0614C61.6675 29.2132 61.5409 29.3392 61.3887 29.4265L49.9104 36.0351V49.1337C49.9104 49.4902 49.7209 49.8192 49.4118 49.9987L25.4519 63.7916C25.3971 63.8227 25.3372 63.8427 25.2774 63.8639C25.255 63.8714 25.2338 63.8851 25.2101 63.8913C25.0426 63.9354 24.8666 63.9354 24.6991 63.8913C24.6716 63.8838 24.6467 63.8689 24.6205 63.8589C24.5657 63.8389 24.5084 63.8215 24.456 63.7916L0.501061 49.9987C0.348882 49.9113 0.222437 49.7853 0.134469 49.6334C0.0465019 49.4816 0.000120578 49.3092 0 49.1337L0 8.10652C0 8.01678 0.0124642 7.92953 0.0348998 7.84477C0.0423783 7.8161 0.0598282 7.78993 0.0697995 7.76126C0.0884958 7.70891 0.105946 7.65531 0.133367 7.6067C0.152063 7.5743 0.179485 7.54812 0.20192 7.51821C0.230588 7.47832 0.256763 7.43719 0.290416 7.40229C0.319084 7.37362 0.356476 7.35243 0.388883 7.32751C0.425029 7.29759 0.457436 7.26518 0.498568 7.2415L12.4779 0.345059C12.6296 0.257786 12.8015 0.211853 12.9765 0.211853C13.1515 0.211853 13.3234 0.257786 13.475 0.345059L25.4531 7.2415H25.4556C25.4955 7.26643 25.5292 7.29759 25.5653 7.32626C25.5977 7.35119 25.6339 7.37362 25.6625 7.40104C25.6974 7.43719 25.7224 7.47832 25.7523 7.51821C25.7735 7.54812 25.8021 7.5743 25.8196 7.6067C25.8483 7.65656 25.8645 7.70891 25.8844 7.76126C25.8944 7.78993 25.9118 7.8161 25.9193 7.84602C25.9423 7.93096 25.954 8.01853 25.9542 8.10652V33.7317L35.9355 27.9844V14.8846C35.9355 14.7973 35.948 14.7088 35.9704 14.6253C35.9792 14.5954 35.9954 14.5692 36.0053 14.5405C36.0253 14.4882 36.0427 14.4346 36.0702 14.386C36.0888 14.3536 36.1163 14.3274 36.1375 14.2975C36.1674 14.2576 36.1923 14.2165 36.2272 14.1816C36.2559 14.1529 36.292 14.1317 36.3244 14.1068C36.3618 14.0769 36.3942 14.0445 36.4341 14.0208L48.4147 7.12434C48.5663 7.03694 48.7383 6.99094 48.9133 6.99094C49.0883 6.99094 49.2602 7.03694 49.4118 7.12434L61.3899 14.0208C61.4323 14.0457 61.4647 14.0769 61.5021 14.1055C61.5333 14.1305 61.5694 14.1529 61.5981 14.1803C61.633 14.2165 61.6579 14.2576 61.6878 14.2975C61.7103 14.3274 61.7377 14.3536 61.7551 14.386C61.7838 14.4346 61.8 14.4882 61.8199 14.5405C61.8312 14.5692 61.8474 14.5954 61.8548 14.6253ZM59.893 27.9844V16.6121L55.7013 19.0252L49.9104 22.3593V33.7317L59.8942 27.9844H59.893ZM47.9149 48.5566V37.1768L42.2187 40.4299L25.953 49.7133V61.2003L47.9149 48.5566ZM1.99677 9.83281V48.5566L23.9562 61.199V49.7145L12.4841 43.2219L12.4804 43.2194L12.4754 43.2169C12.4368 43.1945 12.4044 43.1621 12.3682 43.1347C12.3371 43.1097 12.3009 43.0898 12.2735 43.0624L12.271 43.0586C12.2386 43.0275 12.2162 42.9888 12.1887 42.9539C12.1638 42.9203 12.1339 42.8916 12.114 42.8567L12.1127 42.853C12.0903 42.8156 12.0766 42.7707 12.0604 42.7283C12.0442 42.6909 12.023 42.656 12.013 42.6161C12.0005 42.5688 11.998 42.5177 11.9931 42.4691C11.9881 42.4317 11.9781 42.3943 11.9781 42.3569V15.5801L6.18848 12.2446L1.99677 9.83281ZM12.9777 2.36177L2.99764 8.10652L12.9752 13.8513L22.9541 8.10527L12.9752 2.36177H12.9777ZM18.1678 38.2138L23.9574 34.8809V9.83281L19.7657 12.2459L13.9749 15.5801V40.6281L18.1678 38.2138ZM48.9133 9.14105L38.9344 14.8858L48.9133 20.6305L58.8909 14.8846L48.9133 9.14105ZM47.9149 22.3593L42.124 19.0252L37.9323 16.6121V27.9844L43.7219 31.3174L47.9149 33.7317V22.3593ZM24.9533 47.987L39.59 39.631L46.9065 35.4555L36.9352 29.7145L25.4544 36.3242L14.9907 42.3482L24.9533 47.987Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                <a
                                    href="https://laravel.com/docs"
                                    id="docs-card"
                                    className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] md:row-span-3 lg:p-10 lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
                                >
                                    <div
                                        id="screenshot-container"
                                        className="relative flex w-full flex-1 items-stretch"
                                    >
                                        <img
                                            src="https://laravel.com/assets/img/welcome/docs-light.svg"
                                            alt="Laravel documentation screenshot"
                                            className="aspect-video h-full w-full flex-1 rounded-[10px] object-cover object-top drop-shadow-[0px_4px_34px_rgba(0,0,0,0.06)] dark:hidden"
                                            onError={handleImageError}
                                        />
                                        <img
                                            src="https://laravel.com/assets/img/welcome/docs-dark.svg"
                                            alt="Laravel documentation screenshot"
                                            className="hidden aspect-video h-full w-full flex-1 rounded-[10px] object-cover object-top drop-shadow-[0px_4px_34px_rgba(0,0,0,0.25)] dark:block"
                                        />
                                        <div className="absolute -bottom-16 -left-16 h-40 w-[calc(100%+8rem)] bg-gradient-to-b from-transparent via-white to-white dark:via-zinc-900 dark:to-zinc-900"></div>
                                    </div>

                                    <div className="relative flex items-center gap-6 lg:items-end">
                                        <div
                                            id="docs-card-content"
                                            className="flex items-start gap-6 lg:flex-col"
                                        >
                                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
                                                <svg
                                                    className="size-5 sm:size-6"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="#FF2D20"
                                                        d="M23 4a1 1 0 0 0-1.447-.894L12.224 7.77a.5.5 0 0 1-.448 0L2.447 3.106A1 1 0 0 0 1 4v13.382a1.99 1.99 0 0 0 1.105 1.79l9.448 4.728c.14.065.293.1.447.1.154-.005.306-.04.447-.105l9.453-4.724a1.99 1.99 0 0 0 1.1-1.789V4ZM3 6.023a.25.25 0 0 1 .362-.223l7.5 3.75a.251.251 0 0 1 .138.223v11.2a.25.25 0 0 1-.362.224l-7.5-3.75a.25.25 0 0 1-.138-.22V6.023Zm18 11.2a.25.25 0 0 1-.138.224l-7.5 3.75a.249.249 0 0 1-.329-.099.249.249 0 0 1-.033-.12V9.772a.251.251 0 0 1 .138-.224l7.5-3.75a.25.25 0 0 1 .362.224v11.2Z"
                                                    />
                                                    <path
                                                        fill="#FF2D20"
                                                        d="m3.55 1.893 8 4.048a1.008 1.008 0 0 0 .9 0l8-4.048a1 1 0 0 0-.9-1.785l-7.322 3.706a.506.506 0 0 1-.452 0L4.454.108a1 1 0 0 0-.9 1.785H3.55Z"
                                                    />
                                                </svg>
                                            </div>

                                            <div className="pt-3 sm:pt-5 lg:pt-0">
                                                <h2 className="text-xl font-semibold text-black dark:text-white">
                                                    Documentation
                                                </h2>

                                                <p className="mt-4 text-sm/relaxed">
                                                    Laravel has wonderful
                                                    documentation covering every
                                                    aspect of the framework.
                                                    Whether you are a newcomer
                                                    or have prior experience
                                                    with Laravel, we recommend
                                                    reading our documentation
                                                    from beginning to end.
                                                </p>
                                            </div>
                                        </div>

                                        <svg
                                            className="size-6 shrink-0 stroke-[#FF2D20]"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                            />
                                        </svg>
                                    </div>
                                </a>

                                <a
                                    href="https://laracasts.com"
                                    className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
                                >
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
                                        <svg
                                            className="size-5 sm:size-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <g fill="#FF2D20">
                                                <path d="M24 8.25a.5.5 0 0 0-.5-.5H.5a.5.5 0 0 0-.5.5v12a2.5 2.5 0 0 0 2.5 2.5h19a2.5 2.5 0 0 0 2.5-2.5v-12Zm-7.765 5.868a1.221 1.221 0 0 1 0 2.264l-6.626 2.776A1.153 1.153 0 0 1 8 18.123v-5.746a1.151 1.151 0 0 1 1.609-1.035l6.626 2.776ZM19.564 1.677a.25.25 0 0 0-.177-.427H15.6a.106.106 0 0 0-.072.03l-4.54 4.543a.25.25 0 0 0 .177.427h3.783c.027 0 .054-.01.073-.03l4.543-4.543ZM22.071 1.318a.047.047 0 0 0-.045.013l-4.492 4.492a.249.249 0 0 0 .038.385.25.25 0 0 0 .14.042h5.784a.5.5 0 0 0 .5-.5v-2a2.5 2.5 0 0 0-1.925-2.432ZM13.014 1.677a.25.25 0 0 0-.178-.427H9.101a.106.106 0 0 0-.073.03l-4.54 4.543a.25.25 0 0 0 .177.427H8.4a.106.106 0 0 0 .073-.03l4.54-4.543ZM6.513 1.677a.25.25 0 0 0-.177-.427H2.5A2.5 2.5 0 0 0 0 3.75v2a.5.5 0 0 0 .5.5h1.4a.106.106 0 0 0 .073-.03l4.54-4.543Z" />
                                            </g>
                                        </svg>
                                    </div>

                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-xl font-semibold text-black dark:text-white">
                                            Laracasts
                                        </h2>

                                        <p className="mt-4 text-sm/relaxed">
                                            Laracasts offers thousands of video
                                            tutorials on Laravel, PHP, and
                                            JavaScript development. Check them
                                            out, see for yourself, and massively
                                            level up your development skills in
                                            the process.
                                        </p>
                                    </div>

                                    <svg
                                        className="size-6 shrink-0 self-center stroke-[#FF2D20]"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                        />
                                    </svg>
                                </a>

                                <a
                                    href="https://laravel-news.com"
                                    className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[#FF2D20] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[#FF2D20]"
                                >
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
                                        <svg
                                            className="size-5 sm:size-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <g fill="#FF2D20">
                                                <path d="M8.75 4.5H5.5c-.69 0-1.25.56-1.25 1.25v4.75c0 .69.56 1.25 1.25 1.25h3.25c.69 0 1.25-.56 1.25-1.25V5.75c0-.69-.56-1.25-1.25-1.25Z" />
                                                <path d="M24 10a3 3 0 0 0-3-3h-2V2.5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2V20a3.5 3.5 0 0 0 3.5 3.5h17A3.5 3.5 0 0 0 24 20V10ZM3.5 21.5A1.5 1.5 0 0 1 2 20V3a.5.5 0 0 1 .5-.5h14a.5.5 0 0 1 .5.5v17c0 .295.037.588.11.874a.5.5 0 0 1-.484.625L3.5 21.5ZM22 20a1.5 1.5 0 1 1-3 0V9.5a.5.5 0 0 1 .5-.5H21a1 1 0 0 1 1 1v10Z" />
                                                <path d="M12.751 6.047h2a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-2A.75.75 0 0 1 12 7.3v-.5a.75.75 0 0 1 .751-.753ZM12.751 10.047h2a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-2A.75.75 0 0 1 12 11.3v-.5a.75.75 0 0 1 .751-.753ZM4.751 14.047h10a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-10A.75.75 0 0 1 4 15.3v-.5a.75.75 0 0 1 .751-.753ZM4.75 18.047h7.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-7.5A.75.75 0 0 1 4 19.3v-.5a.75.75 0 0 1 .75-.753Z" />
                                            </g>
                                        </svg>
                                    </div>

                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-xl font-semibold text-black dark:text-white">
                                            Laravel News
                                        </h2>

                                        <p className="mt-4 text-sm/relaxed">
                                            Laravel News is a community driven
                                            portal and newsletter aggregating
                                            all of the latest and most important
                                            news in the Laravel ecosystem,
                                            including new package releases and
                                            tutorials.
                                        </p>
                                    </div>

                                    <svg
                                        className="size-6 shrink-0 self-center stroke-[#FF2D20]"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                        />
                                    </svg>
                                </a>

                                <div className="flex items-start gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800">
                                    <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FF2D20]/10 sm:size-16">
                                        <svg
                                            className="size-5 sm:size-6"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <g fill="#FF2D20">
                                                <path d="M16.597 12.635a.247.247 0 0 0-.08-.237 2.234 2.234 0 0 1-.769-1.68c.001-.195.03-.39.084-.578a.25.25 0 0 0-.09-.267 8.8 8.8 0 0 0-4.826-1.66.25.25 0 0 0-.268.181 2.5 2.5 0 0 1-2.4 1.824.045.045 0 0 0-.045.037 12.255 12.255 0 0 0-.093 3.86.251.251 0 0 0 .208.214c2.22.366 4.367 1.08 6.362 2.118a.252.252 0 0 0 .32-.079 10.09 10.09 0 0 0 1.597-3.733ZM13.616 17.968a.25.25 0 0 0-.063-.407A19.697 19.697 0 0 0 8.91 15.98a.25.25 0 0 0-.287.325c.151.455.334.898.548 1.328.437.827.981 1.594 1.619 2.28a.249.249 0 0 0 .32.044 29.13 29.13 0 0 0 2.506-1.99ZM6.303 14.105a.25.25 0 0 0 .265-.274 13.048 13.048 0 0 1 .205-4.045.062.062 0 0 0-.022-.07 2.5 2.5 0 0 1-.777-.982.25.25 0 0 0-.271-.149 11 11 0 0 0-5.6 2.815.255.255 0 0 0-.075.163c-.008.135-.02.27-.02.406.002.8.084 1.598.246 2.381a.25.25 0 0 0 .303.193 19.924 19.924 0 0 1 5.746-.438ZM9.228 20.914a.25.25 0 0 0 .1-.393 11.53 11.53 0 0 1-1.5-2.22 12.238 12.238 0 0 1-.91-2.465.248.248 0 0 0-.22-.187 18.876 18.876 0 0 0-5.69.33.249.249 0 0 0-.179.336c.838 2.142 2.272 4 4.132 5.353a.254.254 0 0 0 .15.048c1.41-.01 2.807-.282 4.117-.802ZM18.93 12.957l-.005-.008a.25.25 0 0 0-.268-.082 2.21 2.21 0 0 1-.41.081.25.25 0 0 0-.217.2c-.582 2.66-2.127 5.35-5.75 7.843a.248.248 0 0 0-.09.299.25.25 0 0 0 .065.091 28.703 28.703 0 0 0 2.662 2.12.246.246 0 0 0 .209.037c2.579-.701 4.85-2.242 6.456-4.378a.25.25 0 0 0 .048-.189 13.51 13.51 0 0 0-2.7-6.014ZM5.702 7.058a.254.254 0 0 0 .2-.165A2.488 2.488 0 0 1 7.98 5.245a.093.093 0 0 0 .078-.062 19.734 19.734 0 0 1 3.055-4.74.25.25 0 0 0-.21-.41 12.009 12.009 0 0 0-10.4 8.558.25.25 0 0 0 .373.281 12.912 12.912 0 0 1 4.826-1.814ZM10.773 22.052a.25.25 0 0 0-.28-.046c-.758.356-1.55.635-2.365.833a.25.25 0 0 0-.022.48c1.252.43 2.568.65 3.893.65.1 0 .2 0 .3-.008a.25.25 0 0 0 .147-.444c-.526-.424-1.1-.917-1.673-1.465ZM18.744 8.436a.249.249 0 0 0 .15.228 2.246 2.246 0 0 1 1.352 2.054c0 .337-.08.67-.23.972a.25.25 0 0 0 .042.28l.007.009a15.016 15.016 0 0 1 2.52 4.6.25.25 0 0 0 .37.132.25.25 0 0 0 .096-.114c.623-1.464.944-3.039.945-4.63a12.005 12.005 0 0 0-5.78-10.258.25.25 0 0 0-.373.274c.547 2.109.85 4.274.901 6.453ZM9.61 5.38a.25.25 0 0 0 .08.31c.34.24.616.561.8.935a.25.25 0 0 0 .3.127.631.631 0 0 1 .206-.034c2.054.078 4.036.772 5.69 1.991a.251.251 0 0 0 .267.024c.046-.024.093-.047.141-.067a.25.25 0 0 0 .151-.23A29.98 29.98 0 0 0 15.957.764a.25.25 0 0 0-.16-.164 11.924 11.924 0 0 0-2.21-.518.252.252 0 0 0-.215.076A22.456 22.456 0 0 0 9.61 5.38Z" />
                                            </g>
                                        </svg>
                                    </div>

                                    <div className="pt-3 sm:pt-5">
                                        <h2 className="text-xl font-semibold text-black dark:text-white">
                                            Vibrant Ecosystem
                                        </h2>

                                        <p className="mt-4 text-sm/relaxed">
                                            Laravel's robust library of
                                            first-party tools and libraries,
                                            such as{' '}
                                            <a
                                                href="https://forge.laravel.com"
                                                className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white dark:focus-visible:ring-[#FF2D20]"
                                            >
                                                Forge
                                            </a>
                                            ,{' '}
                                            <a
                                                href="https://vapor.laravel.com"
                                                className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white"
                                            >
                                                Vapor
                                            </a>
                                            ,{' '}
                                            <a
                                                href="https://nova.laravel.com"
                                                className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white"
                                            >
                                                Nova
                                            </a>
                                            ,{' '}
                                            <a
                                                href="https://envoyer.io"
                                                className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white"
                                            >
                                                Envoyer
                                            </a>
                                            , and{' '}
                                            <a
                                                href="https://herd.laravel.com"
                                                className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white"
                                            >
                                                Herd
                                            </a>{' '}
                                            help you take your projects to the
                                            next level. Pair them with powerful
                                            open source libraries like{' '}
                                            <a
                                                href="https://laravel.com/docs/billing"
                                                className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white"
                                            >
                                                Cashier
                                            </a>
                                            ,{' '}
                                            <a
                                                href="https://laravel.com/docs/dusk"
                                                className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white"
                                            >
                                                Dusk
                                            </a>
                                            ,{' '}
                                            <a
                                                href="https://laravel.com/docs/broadcasting"
                                                className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white"
                                            >
                                                Echo
                                            </a>
                                            ,{' '}
                                            <a
                                                href="https://laravel.com/docs/horizon"
                                                className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white"
                                            >
                                                Horizon
                                            </a>
                                            ,{' '}
                                            <a
                                                href="https://laravel.com/docs/sanctum"
                                                className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white"
                                            >
                                                Sanctum
                                            </a>
                                            ,{' '}
                                            <a
                                                href="https://laravel.com/docs/telescope"
                                                className="rounded-sm underline hover:text-black focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF2D20] dark:hover:text-white"
                                            >
                                                Telescope
                                            </a>
                                            , and more.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </main>

                        <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}



// import React, { useState } from 'react';

// // ─── BRAND: Deep Maroon #8B0000 | Gold #c9a84c | Paper #fdfcfb | Ink #1c1711 ──

// // ─── REAL DATA — from shuchikhabar.com ───────────────────────────────────────
// const DATA = {
//   mainNews: [
//     {
//       id: 1,
//       title: '६७१ जना उम्मेदवारले बैंक तथा वित्तीय संस्थामा चुनावी खाता खोले',
//       category: 'मुख्य',
//       author: 'शुचि खबर संवाददाता',
//       image: 'https://shuchikhabar.com/public/uploads/6993fee614d7a.jpg',
//       time: '०४ फागुन २०८२, मंगलबार',
//       url: '/news/671-jana',
//     },
//     {
//       id: 2,
//       title: 'आचारसंहिता उल्लंघन गरेको भन्दै निर्वाचन आयोगद्वारा सञ्चार माध्यमलाई कारबाही गर्न निर्देशन',
//       category: 'मुख्य',
//       author: 'शुचि खबर',
//       image: 'https://shuchikhabar.com/public/uploads/6992e20a964b8.jpg',
//       time: '०३ फागुन २०८२, सोमबार',
//       url: '/news/aacharsanhita',
//     },
//     {
//       id: 3,
//       title: 'पशुपतिमा आएका नागा बाबासहित साधुसन्तलाई बिदाइ गरिँदै',
//       category: 'धार्मिक',
//       author: 'शुचि खबर',
//       image: 'https://shuchikhabar.com/public/uploads/6994008ef3755.jpg',
//       time: '०४ फागुन २०८२, मंगलबार',
//       url: '/news/pashupatinath-sadhu',
//     },
//     {
//       id: 4,
//       title: 'नेपाल र स्कटल्यान्डको खेल आज',
//       category: 'खेलकुद',
//       author: 'शुचि खबर',
//       image: 'https://shuchikhabar.com/public/uploads/6993fd86c9e54.jpg',
//       time: '०४ फागुन २०८२, मंगलबार',
//       url: '/news/nepal-scotland',
//     },
//     {
//       id: 5,
//       title: 'तारिक रहमान बंगलादेशका नयाँ प्रधानमन्त्री, अपराह्न शपथ ग्रहण',
//       category: 'अन्तर्राष्ट्रिय',
//       author: 'शुचि खबर',
//       image: 'https://shuchikhabar.com/public/uploads/699401175f89c.jpg',
//       time: '०४ फागुन २०८२, मंगलबार',
//       url: '/news/tariq-rahman',
//     },
//   ],
//   secondaryMainNews: [
//     {
//       id: 6,
//       title: 'दाङमा तोरीखेतीको क्षेत्रफल र उत्पादन बढ्दै',
//       category: 'कृषि',
//       image: 'https://shuchikhabar.com/public/uploads/6993fdd82157a.jpg',
//       time: '०४ फागुन २०८२',
//       url: '/news/dang-tori',
//     },
//     {
//       id: 7,
//       title: 'बंगलादेशका प्रधानमन्त्रीको सपथ समारोहमा परराष्ट्रमन्त्री शर्मा सहभागी हुने',
//       category: 'अन्तर्राष्ट्रिय',
//       image: 'https://shuchikhabar.com/public/uploads/6992e059aaa83.jpg',
//       time: '०३ फागुन २०८२',
//       url: '/news/sharma-bangladesh',
//     },
//   ],
//   mukhya: [
//     { id: 8,  title: 'निर्वाचन आयोगले मतदान केन्द्रको अन्तिम सूची सार्वजनिक गर्‍यो', image: 'https://shuchikhabar.com/public/uploads/6992e20a964b8.jpg', time: '०५ फागुन, बुधबार', category: 'मुख्य' },
//     { id: 9,  title: 'चुरे संरक्षणलाई चुनावी एजेण्डाको प्राथमिकतामा राख्न माग', image: 'https://shuchikhabar.com/public/uploads/69926f3089d64.jpg', time: '०३ फागुन, सोमबार', category: 'मुख्य' },
//     { id: 10, title: 'काठमाडौंमा यातायात व्यवस्थापनका लागि नयाँ प्रणाली लागू हुँदै', image: 'https://shuchikhabar.com/public/uploads/6993fee614d7a.jpg', time: '०२ फागुन, आइतबार', category: 'मुख्य' },
//   ],
//   samachar: [
//     { id: 11, title: 'तारिक रहमान बंगलादेशका नयाँ प्रधानमन्त्री, अपराह्न शपथ ग्रहण', image: 'https://shuchikhabar.com/public/uploads/699401175f89c.jpg', subcategory: 'अन्तर्राष्ट्रिय', time: '०४ फागुन' },
//     { id: 12, title: 'दाङमा तोरीखेतीको क्षेत्रफल र उत्पादन बढ्दै', image: 'https://shuchikhabar.com/public/uploads/6993fdd82157a.jpg', subcategory: 'कृषि', time: '०४ फागुन' },
//     { id: 13, title: 'बंगलादेशका प्रधानमन्त्रीको सपथ समारोहमा परराष्ट्रमन्त्री शर्मा सहभागी हुने', image: 'https://shuchikhabar.com/public/uploads/6992e059aaa83.jpg', subcategory: 'समाचार', time: '०३ फागुन' },
//     { id: 14, title: 'चुरे संरक्षणलाई चुनावी एजेण्डाको प्राथमिकतामा राख्न माग', image: 'https://shuchikhabar.com/public/uploads/69926f3089d64.jpg', subcategory: 'समाचार', time: '०३ फागुन' },
//   ],
//   arthatatwa: [
//     { id: 15, title: '९ अर्ब ३५ करोड रूपैयाँ लगानी गर्दै राष्ट्र बैंक', image: 'https://shuchikhabar.com/public/uploads/6992da9d953ff.jpg', time: '०३ फागुन', category: 'अर्थतन्त्र' },
//     { id: 16, title: 'घरजग्गा कारोबारबाट गत माघमा पाँच अर्ब राजस्व सङ्कलन', image: 'https://shuchikhabar.com/public/uploads/69926bed7c842.jpg', time: '०३ फागुन', category: 'अर्थतन्त्र' },
//     { id: 17, title: 'पेट्रोलियम पदार्थको मूल्य बढ्यो, आम उपभोक्तामा असर', image: 'https://shuchikhabar.com/public/uploads/69926c4923253.jpg', time: '०३ फागुन', category: 'अर्थतन्त्र' },
//     { id: 18, title: 'तोलामा १ सय घट्यो सुनको मूल्य', image: 'https://shuchikhabar.com/public/uploads/698d859b5c0fd.jpg', time: '२९ माघ', category: 'अर्थतन्त्र' },
//   ],
//   sports: [
//     { id: 19, title: 'नेपाल र स्कटल्यान्डको खेल आज', image: 'https://shuchikhabar.com/public/uploads/6993fd86c9e54.jpg', time: '०४ फागुन', category: 'खेलकुद' },
//     { id: 20, title: 'टी–२० विश्वकपः पाकिस्तानलाई ६१ रनले हराउँदै भारत सुपर ८ मा', image: 'https://shuchikhabar.com/public/uploads/69926e99ab47d.png', time: '०३ फागुन', category: 'खेलकुद' },
//     { id: 21, title: 'टी–२० विश्वकप: पहिलो जितको खोजीमा नेपाल र इटाली', image: 'https://shuchikhabar.com/public/uploads/698d83fda9373.jpg', time: '२९ माघ', category: 'खेलकुद' },
//     { id: 22, title: "'टाइगर कप भलिबल'को उपाधि गण्डकी प्रदेशलाई", image: 'https://shuchikhabar.com/public/uploads/697ebad575c9e.jpg', time: '२५ माघ', category: 'खेलकुद' },
//   ],
//   krishi: [
//     { id: 23, title: 'दाङमा तोरीखेतीको क्षेत्रफल र उत्पादन बढ्दै, किसान खुसी', image: 'https://shuchikhabar.com/public/uploads/6993fdd82157a.jpg', subcategory: 'कृषि', time: '०४ फागुन' },
//     { id: 24, title: 'जैविक मलको प्रयोग बढाउन सरकारको अनुदान कार्यक्रम सुरु', image: 'https://picsum.photos/seed/krishi2/200/140', subcategory: 'कृषि', time: '०३ फागुन' },
//     { id: 25, title: 'चिया उत्पादनमा इलाम अग्रणी, निर्यातमा उल्लेखनीय वृद्धि', image: 'https://picsum.photos/seed/krishi3/200/140', subcategory: 'कृषि', time: '०२ फागुन' },
//     { id: 26, title: 'धानको न्यूनतम समर्थन मूल्य बढाउने सरकारको निर्णय', image: 'https://picsum.photos/seed/krishi4/200/140', subcategory: 'कृषि', time: '०१ फागुन' },
//   ],
//   manoranjan: [
//     { id: 27, title: 'नेपाली चलचित्र "छक्का पञ्जा ५" को सुटिङ सुरु, चर्चामा', image: 'https://picsum.photos/seed/mn1s/400/267', time: 'आज', category: 'मनोरञ्जन' },
//     { id: 28, title: 'लोकप्रिय गायिका पुजा शर्माको नयाँ एल्बम रिलिज', image: 'https://picsum.photos/seed/mn2s/400/267', time: 'हिजो', category: 'मनोरञ्जन' },
//     { id: 29, title: 'काठमाडौंमा तीन दिने अन्तर्राष्ट्रिय संगीत महोत्सव', image: 'https://picsum.photos/seed/mn3s/400/267', time: 'हिजो', category: 'मनोरञ्जन' },
//   ],
//   dharmic: [
//     { id: 30, title: 'महाशिवरात्रिमा पशुपतिनाथ मन्दिरमा विशेष पूजाआजा', image: 'https://shuchikhabar.com/public/uploads/6994008ef3755.jpg', subcategory: 'धार्मिक', time: '०४ फागुन' },
//     { id: 31, title: 'लुम्बिनीमा बुद्ध जयन्तीको तयारी सुरु, विदेशी भक्तजन आउने', image: 'https://picsum.photos/seed/dh2s/200/140', subcategory: 'धार्मिक', time: '०३ फागुन' },
//     { id: 32, title: 'पशुपतिमा नागा बाबासहित साधुसन्त, हजारौं दर्शनार्थी', image: 'https://shuchikhabar.com/public/uploads/6994008ef3755.jpg', subcategory: 'धार्मिक', time: '०४ फागुन' },
//   ],
//   swastha: [
//     { id: 33, title: 'काठमाडौंको वायु प्रदूषणबाट बच्न विशेषज्ञको सुझाव', image: 'https://picsum.photos/seed/sw1s/200/140', subcategory: 'स्वास्थ्य', time: 'आज' },
//     { id: 34, title: 'डेंगी रोगको प्रकोप बढ्दो, ७ जिल्लामा अलर्ट जारी', image: 'https://picsum.photos/seed/sw2s/200/140', subcategory: 'स्वास्थ्य', time: 'हिजो' },
//     { id: 35, title: 'सरकारी अस्पतालमा निःशुल्क स्वास्थ्य शिविर आयोजना', image: 'https://picsum.photos/seed/sw3s/200/140', subcategory: 'स्वास्थ्य', time: 'हिजो' },
//   ],
//   antarrashtriya: [
//     { id: 36, title: 'तारिक रहमान बंगलादेशका प्रधानमन्त्री नियुक्त', image: 'https://shuchikhabar.com/public/uploads/699401175f89c.jpg', subcategory: 'अन्तर्राष्ट्रिय', time: '०४ फागुन' },
//     { id: 37, title: 'भारत–पाकिस्तान सम्बन्धमा नयाँ तनाव, सीमा सुरक्षा कडाइ', image: 'https://picsum.photos/seed/int2s/200/140', subcategory: 'अन्तर्राष्ट्रिय', time: '०३ फागुन' },
//     { id: 38, title: 'संयुक्त राष्ट्रसंघले जलवायु प्रतिवेदन सार्वजनिक गर्‍यो', image: 'https://picsum.photos/seed/int3s/200/140', subcategory: 'अन्तर्राष्ट्रिय', time: '०२ फागुन' },
//   ],
//   opinions: [
//     { id: 40, title: 'निर्वाचनी राजनीति र युवा पुस्ताको भूमिका', author: 'डा. टीकाराम भट्टराई', role: 'राजनीतिक विश्लेषक', avatar: 'https://picsum.photos/seed/op1s/80/80' },
//     { id: 41, title: 'कृषि क्षेत्रमा लगानी र खाद्य सुरक्षाको प्रश्न', author: 'प्रा. सरिता खनाल', role: 'अर्थशास्त्री', avatar: 'https://picsum.photos/seed/op2s/80/80' },
//     { id: 42, title: 'प्रेस स्वतन्त्रता र जवाफदेहिता: नेपालको सन्दर्भ', author: 'गणेश बहादुर थापा', role: 'वरिष्ठ पत्रकार', avatar: 'https://picsum.photos/seed/op3s/80/80' },
//   ],
//   mostRead: [
//     { id: 45, title: '६७१ जना उम्मेदवारले बैंक तथा वित्तीय संस्थामा चुनावी खाता खोले' },
//     { id: 46, title: 'नेपाल र स्कटल्यान्डको क्रिकेट खेलमा नेपाल विजयी' },
//     { id: 47, title: 'आचारसंहिता उल्लंघनमा सञ्चारमाध्यमलाई कारबाहीको निर्देशन' },
//     { id: 48, title: 'पशुपतिमा साधुसन्त बिदाइ समारोह, हजारौं भक्त सहभागी' },
//     { id: 49, title: 'दाङमा तोरीखेतीको क्षेत्रफल र उत्पादन बढ्दै' },
//   ],
// };

// const TICKER = [
//   '६७१ जना उम्मेदवारले बैंक तथा वित्तीय संस्थामा चुनावी खाता खोले',
//   'नेपाल र स्कटल्यान्डको क्रिकेट खेल आज हुँदैछ',
//   'आचारसंहिता उल्लंघनमा निर्वाचन आयोगको कारबाही',
//   'तारिक रहमान बंगलादेशका नयाँ प्रधानमन्त्री',
//   '९ अर्ब ३५ करोड रूपैयाँ लगानी गर्दै राष्ट्र बैंक',
//   'पेट्रोलियम पदार्थको मूल्य बढ्यो',
//   'टी–२० विश्वकपः भारत सुपर ८ मा',
// ];

// const NAV = ['मुख्य', 'समाचार', 'अर्थतन्त्र', 'अन्तर्राष्ट्रिय', 'खेलकुद', 'मनोरञ्जन', 'कृषि', 'स्वास्थ्य', 'धार्मिक', 'विचार'];

// // ─── HELPERS ──────────────────────────────────────────────────────────────────
// const FB = 'https://picsum.photos/seed/fb_suchi/400/267'; // fallback image

// const img = (src, seed = 'fb') => ({
//   src: src || `https://picsum.photos/seed/${seed}/400/267`,
//   onError: (e) => { e.currentTarget.src = `https://picsum.photos/seed/${seed}/400/267`; },
// });

// // ─── AD COMPONENTS ────────────────────────────────────────────────────────────

// // AD 1 — Leaderboard (Varun Beverages — real advertiser on site)
// const AdLeaderboard = () => (
//   <div className="w-full bg-[#fdfcfb] border-b border-[rgba(28,23,17,0.07)] py-2 flex justify-center px-4">
//     <a href="https://www.varunbeverages.com" target="_blank" rel="noopener noreferrer" className="no-underline w-full px-8">
//       <div className="relative h-[68px] overflow-hidden flex items-center justify-between px-5 bg-gradient-to-r from-[#00529b] to-[#003d73] cursor-pointer group">
//         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 80% 50%,#fff 0%,transparent 60%)' }} />
//         <div className="z-10">
//           <p className="text-[#93c5fd] text-[0.54rem] tracking-[0.18em] uppercase font-medium leading-none mb-0.5">Varun Beverages Nepal</p>
//           <p className="text-white font-['Playfair_Display'] text-[0.93rem] font-semibold leading-tight">पेप्सीको ताजा स्वाद — हरेक पलमा रिफ्रेसिङ</p>
//         </div>
//         <div className="flex items-center gap-3 z-10">
//           <span className="hidden sm:flex gap-1 text-lg">🥤🥤🥤</span>
//           <span className="bg-white text-[#00529b] text-[0.58rem] px-3 py-1.5 font-semibold tracking-wide uppercase group-hover:bg-[#daeeff] transition-colors whitespace-nowrap">थप जान्नुहोस्</span>
//         </div>
//         <span className="absolute top-0.5 right-1.5 text-[0.42rem] text-white/20 uppercase tracking-widest">विज्ञापन</span>
//       </div>
//     </a>
//   </div>
// );

// // AD 2 — Native In-Feed Card (SAIT — real advertiser)
// const AdNativeCard = () => (
//   <div className="cursor-pointer group relative border border-[#ede8e2] hover:border-[#8B0000]/40 transition-all duration-300 bg-[#fff8f2]">
//     <span className="absolute top-2 right-2 text-[0.42rem] tracking-[0.12em] uppercase text-[#a09488] bg-[#ede8e2] px-1.5 py-0.5 z-10 rounded-sm leading-none">Sponsored</span>
//     <div className="w-full aspect-[3/2] bg-[#e8f0ff] flex items-center justify-center overflow-hidden p-4">
//       <img {...img('https://shuchikhabar.com/images/sait.gif', 'sait_ad')} alt="SAIT Nepal" className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" />
//     </div>
//     <div className="p-3">
//       <div className="flex items-center gap-1.5 mb-1.5">
//         <div className="w-4 h-4 bg-[#8B0000] flex items-center justify-center flex-shrink-0 rounded-sm">
//           <span className="text-white text-[0.46rem] font-bold leading-none">S</span>
//         </div>
//         <span className="text-[0.56rem] text-[#a09488] font-medium">SAIT Nepal</span>
//       </div>
//       <p className="font-['Source_Serif_4'] text-[0.86rem] font-semibold leading-tight text-[#1c1711] group-hover:text-[#8B0000] transition-colors">
//         IT सेवाहरूका लागि नेपालको भरपर्दो साझेदार
//       </p>
//       <p className="text-[0.56rem] text-[#a09488] mt-1">Software · Hardware · Networking</p>
//     </div>
//   </div>
// );

// // AD 3 — Sidebar Skyscraper (NIC Asia Bank) — no inline min-height, pure CSS
// const AdSkyscraper = () => (
//   <div className="cursor-pointer group relative overflow-hidden">
//     <span className="absolute top-2 left-2 text-[0.42rem] text-white/45 uppercase tracking-widest z-10 bg-black/20 px-1.5 py-0.5">विज्ञापन</span>
//     <div className="w-full bg-gradient-to-b from-[#8B0000] via-[#9a0000] to-[#6b0000] flex flex-col items-center justify-between p-5 text-white gap-4" style={{ paddingTop: '2.5rem', paddingBottom: '1.5rem' }}>
//       <div className="text-center">
//         <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-3">
//           <span className="font-['Playfair_Display'] text-xl font-bold text-[#c9a84c]">N</span>
//         </div>
//         <p className="text-[0.54rem] tracking-[0.2em] uppercase text-red-200 mb-1">NIC Asia Bank</p>
//         <p className="font-['Playfair_Display'] text-lg font-bold leading-tight">बचत खाता खोल्नुहोस्</p>
//       </div>
//       <div className="w-full h-px bg-white/15" />
//       <div className="text-center w-full">
//         <p className="text-[0.68rem] text-white/65 leading-relaxed mb-3">७.५% सम्म व्याजदर<br />नेपालभरका शाखाहरूमा</p>
//         <div className="bg-[#c9a84c] text-[#1c1711] text-[0.62rem] px-4 py-2 font-semibold tracking-wide uppercase group-hover:bg-[#e0be6e] transition-colors w-full text-center cursor-pointer">
//           अहिले सम्पर्क गर्नुहोस्
//         </div>
//       </div>
//     </div>
//   </div>
// );

// // AD 4 — Mid-Content Strip (Buddha Air)
// const AdMidStrip = () => (
//   <div className="my-10 cursor-pointer group">
//     <div className="relative overflow-hidden h-[84px] bg-[#f7f3ed] border border-[#ddd4c4] flex items-center justify-between px-5 lg:px-8">
//       <span className="absolute top-1.5 right-2 text-[0.42rem] text-[#a09488] uppercase tracking-widest">Sponsored</span>
//       <div className="absolute right-0 top-0 bottom-0 w-36 opacity-5 pointer-events-none" style={{ background: 'repeating-linear-gradient(45deg,#8B0000,#8B0000 2px,transparent 2px,transparent 10px)' }} />
//       <div className="flex items-center gap-3">
//         <div className="w-10 h-10 bg-[#8B0000] flex items-center justify-center flex-shrink-0 rounded-sm">
//           <span className="text-white text-base leading-none">✈️</span>
//         </div>
//         <div>
//           <p className="text-[0.54rem] tracking-[0.14em] uppercase text-[#8B0000] font-medium leading-none mb-0.5">Buddha Air Nepal</p>
//           <p className="font-['Playfair_Display'] text-[0.92rem] font-semibold text-[#1c1711] leading-tight">काठमाडौं–पोखरा: रु. ३,९९९ देखि</p>
//         </div>
//       </div>
//       <div className="flex items-center gap-4">
//         <div className="text-center hidden sm:block">
//           <p className="text-[0.54rem] text-[#a09488] uppercase leading-none mb-0.5">दैनिक उडान</p>
//           <p className="text-[0.78rem] font-bold text-[#8B0000] leading-none">१२ वटा</p>
//         </div>
//         <div className="text-center hidden md:block">
//           <p className="text-[0.54rem] text-[#a09488] uppercase leading-none mb-0.5">सिट बाँकी</p>
//           <p className="text-[0.78rem] font-bold text-[#c9a84c] leading-none">८ मात्र</p>
//         </div>
//         <span className="bg-[#8B0000] text-white text-[0.58rem] px-3 sm:px-4 py-2 tracking-wide uppercase whitespace-nowrap group-hover:bg-[#6b0000] transition-colors">
//           बुक गर्नुहोस्
//         </span>
//       </div>
//     </div>
//   </div>
// );

// // AD 5 — Sports Inline Banner (DishHome) — fills 2 grid cols
// const AdSportsBanner = () => (
//   <div className="cursor-pointer group relative overflow-hidden aspect-[2/1]">
//     <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b2a] via-[#1a2a18] to-[#0e1a08]" />
//     <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(ellipse at 25% 50%,#c9a84c 0%,transparent 55%)' }} />
//     <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(0deg,transparent 24%,rgba(255,255,255,.06) 25%,rgba(255,255,255,.06) 26%,transparent 27%),linear-gradient(90deg,transparent 24%,rgba(255,255,255,.06) 25%,rgba(255,255,255,.06) 26%,transparent 27%)', backgroundSize: '28px 28px' }} />
//     <div className="relative h-full flex flex-col justify-center p-5">
//       <span className="text-[0.48rem] tracking-[0.2em] text-[#c9a84c] uppercase font-medium mb-2">Sponsored · DishHome Nepal</span>
//       <p className="font-['Playfair_Display'] text-xl font-bold text-white leading-tight mb-2">
//         खेलकुद च्यानल हेर्नुहोस्<br />
//         <span className="text-[#c9a84c]">DishHome</span> मा
//       </p>
//       <p className="text-white/40 text-[0.64rem] mb-3">२०० भन्दा बढी च्यानल — मासिक रु. ३९९</p>
//       <span className="inline-flex items-center gap-2 text-[#c9a84c] text-[0.58rem] uppercase tracking-wider group-hover:gap-3 transition-all font-medium">
//         अहिले जडान गर्नुहोस् →
//       </span>
//     </div>
//     <span className="absolute top-2 right-2 text-[0.4rem] text-white/15 uppercase tracking-widest">विज्ञापन</span>
//   </div>
// );

// // AD 6 — Pre-footer Strip (Ncell)
// const AdFooterStrip = () => (
//   <div className="cursor-pointer group bg-[#1c1711] border-t-2 border-[#8B0000]">
//     <div className=" px-4 sm:px-6 lg:px-12 h-[90px] flex items-center justify-center relative overflow-hidden">
//       <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(90deg,#8B0000 1px,transparent 1px),linear-gradient(#8B0000 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
//       <div className="flex items-center gap-5 sm:gap-10 lg:gap-14 z-10 flex-wrap justify-center">
//         <div className="text-center">
//           <p className="text-[#8B0000] text-[0.5rem] tracking-[0.16em] uppercase leading-none mb-0.5">Powered by</p>
//           <p className="text-white font-['Playfair_Display'] text-lg font-bold leading-none">Ncell</p>
//         </div>
//         <div className="h-8 w-px bg-white/10 hidden sm:block" />
//         <div className="text-center">
//           <p className="text-white/80 font-['Playfair_Display'] text-base font-semibold">नेपालभर सबैभन्दा तेज ४जी नेटवर्क</p>
//           <p className="text-white/30 text-[0.58rem] tracking-wide mt-0.5">Connect Nepal · ७५ जिल्लामा उपलब्ध</p>
//         </div>
//         <div className="h-8 w-px bg-white/10 hidden sm:block" />
//         <span className="border border-[#8B0000] text-[#c9a84c] text-[0.58rem] px-4 py-1.5 tracking-wide uppercase group-hover:bg-[#8B0000] group-hover:text-white transition-all whitespace-nowrap">
//           Plan हेर्नुहोस्
//         </span>
//       </div>
//       <span className="absolute bottom-1 right-3 text-[0.4rem] text-white/15 uppercase tracking-widest">विज्ञापन</span>
//     </div>
//   </div>
// );

// // AD 7 — Sidebar Box (WorldLink)
// const AdSidebarBox = () => (
//   <div className="cursor-pointer group relative">
//     <span className="absolute top-1.5 right-1.5 text-[0.4rem] tracking-[0.12em] uppercase text-[#a09488] z-10 leading-none">Ad</span>
//     <div className="border border-[#ede8e2] group-hover:border-[#1c1711]/20 transition-all duration-300 p-4 bg-white">
//       <div className="flex items-center gap-2 mb-3">
//         <div className="w-8 h-8 bg-[#1c1711] flex items-center justify-center flex-shrink-0 rounded-sm">
//           <span className="text-[#c9a84c] text-xs font-bold leading-none">W</span>
//         </div>
//         <div>
//           <p className="text-[0.56rem] font-semibold text-[#1c1711] leading-tight">WorldLink Nepal</p>
//           <p className="text-[0.46rem] text-[#a09488] leading-tight">Internet Service Provider</p>
//         </div>
//       </div>
//       <div className="bg-[#f7f3ed] p-3 mb-3 text-center">
//         <p className="font-['Playfair_Display'] text-base font-bold text-[#1c1711] leading-none">200 Mbps</p>
//         <p className="text-[0.54rem] text-[#a09488] uppercase tracking-wide mt-0.5">Fiber Broadband</p>
//         <p className="text-[#8B0000] font-bold text-sm mt-1.5 leading-none">रु. १,१९९/महिना</p>
//       </div>
//       <div className="flex flex-wrap gap-x-2 gap-y-1 text-[0.54rem] text-[#1c1711] font-medium mb-3">
//         <span>✓ Unlimited</span><span>✓ 24/7 Support</span><span>✓ Free Setup</span>
//       </div>
//       <button className="w-full bg-[#8B0000] text-white text-[0.58rem] py-2 tracking-wider uppercase group-hover:bg-[#6b0000] transition-colors cursor-pointer border-none font-medium">
//         अहिले जडान गर्नुहोस्
//       </button>
//     </div>
//   </div>
// );

// // ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

// const SectionHeader = ({ title, link = 'थप सामाग्री →', href = '#' }) => (
//   <div className="flex items-baseline gap-3 border-b-2 border-[#1c1711] pb-2 mb-4">
//     <h2 className="font-['Playfair_Display'] text-[1.05rem] font-bold tracking-tight text-[#1c1711] leading-none">{title}</h2>
//     <a href={href} className="ml-auto text-[0.66rem] text-[#8B0000] tracking-wider uppercase font-medium hover:underline whitespace-nowrap no-underline">{link}</a>
//   </div>
// );

// // Card with image on top, text below — image fills exactly aspect-[3/2], text natural height, zero gap
// const NewsCard = ({ item, seed = 'card' }) => (
//   <article className="cursor-pointer group">
//     <div className="overflow-hidden">
//       <img {...img(item?.image, seed)} alt={item?.title || ''} className="w-full aspect-[3/2] object-cover group-hover:scale-[1.04] transition-transform duration-500 block" />
//     </div>
//     <div className="pt-2">
//       <p className="text-[0.6rem] tracking-wider uppercase text-[#8B0000] font-medium leading-none mb-1">{item?.category || 'समाचार'}</p>
//       <p className="font-['Source_Serif_4'] text-[0.875rem] font-semibold leading-snug text-[#1c1711] group-hover:text-[#8B0000] transition-colors">{item?.title}</p>
//       <p className="text-[0.62rem] text-[#a09488] mt-1 leading-none">{item?.time}</p>
//     </div>
//   </article>
// );

// // List row — thumbnail + text, no bottom gap
// const ListCard = ({ item, seed = 'list' }) => (
//   <article className="flex gap-3 py-3 border-b border-[rgba(28,23,17,0.08)] last:border-b-0 cursor-pointer group">
//     <div className="flex-shrink-0 overflow-hidden">
//       <img {...img(item?.image, seed)} alt="" className="w-[86px] h-[60px] object-cover group-hover:scale-[1.04] transition-transform duration-500 block" />
//     </div>
//     <div className="min-w-0">
//       <p className="text-[0.56rem] tracking-wider uppercase text-[#8B0000] font-medium leading-none mb-0.5">{item?.subcategory || item?.category || 'समाचार'}</p>
//       <p className="font-['Source_Serif_4'] text-[0.84rem] font-semibold leading-snug group-hover:text-[#8B0000] transition-colors text-[#1c1711]">{item?.title}</p>
//       <p className="text-[0.59rem] text-[#a09488] mt-1 leading-none">{item?.time}</p>
//     </div>
//   </article>
// );

// // ─── SIDE STORY CARD — image grows to fill all empty space ────────────────────
// // Strategy: pure CSS — flex-col with image as flex-1, min-h-0; text shrinks to content.
// // The card itself is flex-1 so both cards split the sidebar height equally.
// // Image uses h-full within flex-1 container → always fills the gap.
// const SideStoryCard = ({ story, isLast }) => (
//   <article
//     className={`flex flex-col flex-1 cursor-pointer group overflow-hidden ${!isLast ? 'border-b border-[#ede8e2]' : ''}`}
//     style={{ minHeight: 0 }}
//   >
//     {/* Image wrapper — flex-1 means it takes ALL remaining space after text */}
//     <div className="flex-1 overflow-hidden min-h-0">
//       <img
//         {...img(story.image, `side_${story.id}`)}
//         alt={story.title}
//         className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 block"
//       />
//     </div>
//     {/* Text — fixed natural height, no flex, no growing */}
//     <div className="flex-shrink-0 p-3.5">
//       <span className="text-[0.56rem] tracking-wider uppercase text-[#8B0000] font-medium leading-none block mb-1">{story.category}</span>
//       <p className="font-['Source_Serif_4'] text-[0.86rem] font-semibold leading-snug text-[#1c1711] group-hover:text-[#8B0000] transition-colors">{story.title}</p>
//       <p className="text-[0.58rem] text-[#a09488] mt-1 leading-none">{story.time}</p>
//     </div>
//   </article>
// );

// // ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
// const Welcome = () => {
//   const [activeNav, setActiveNav] = useState(0);
//   const [tickerPause, setTickerPause] = useState(false);

//   return (
//     <div className="min-h-screen bg-[#fdfcfb]" >

//       {/* ── TICKER ──────────────────────────────────────────────── */}
//       <div
//         className="bg-[#1c1711] text-[#f0ece6] text-[0.67rem] tracking-wide overflow-hidden flex items-center select-none"
//         style={{ height: '30px' }}
//         onMouseEnter={() => setTickerPause(true)}
//         onMouseLeave={() => setTickerPause(false)}
//       >
//         <span className="bg-[#8B0000] text-white font-semibold px-3 h-full flex items-center whitespace-nowrap uppercase tracking-widest text-[0.6rem] flex-shrink-0">
//           ताजा
//         </span>
//         <div className="overflow-hidden flex-1 h-full flex items-center">
//           <div
//             className="flex gap-10 whitespace-nowrap"
//             style={{ animation: tickerPause ? 'none' : 'ticker 36s linear infinite' }}
//           >
//             {[...TICKER, ...TICKER].map((t, i) => (
//               <span key={i} className="hover:text-[#c9a84c] transition-colors cursor-default">• {t}</span>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── AD 1: LEADERBOARD ─────────────────────────────────────── */}
//       <AdLeaderboard />

//       {/* ── HEADER ────────────────────────────────────────────────── */}
//       <header className="sticky top-0 z-50 bg-white border-b border-[rgba(28,23,17,0.1)] shadow-sm">
//         <div className="flex items-center justify-between px-4 sm:px-6 lg:px-12  h-[60px] sm:h-[68px]">
//           {/* ── LOGO — always visible ── */}
//           <a href="/" className="flex items-center gap-2 no-underline flex-shrink-0">
//             <img
//               src="/images/logo.png"
//               alt="Shuchikhabar"
//               className="h-9 sm:h-10 w-auto object-contain"
//               onError={(e) => {
//                 // fallback to text logo if image not found in dev
//                 e.currentTarget.style.display = 'none';
//                 e.currentTarget.nextSibling.style.display = 'flex';
//               }}
//             />
//             {/* Text fallback — hidden by default, shown if logo.png 404s */}
//             <span className="flex-col leading-none hidden" aria-hidden>
//               <span className="font-['Playfair_Display'] text-[1.75rem] font-bold text-[#1c1711] tracking-tight leading-none">
//                 शुचि<span className="text-[#8B0000]">खबर</span>
//                 <span className="inline-block w-1.5 h-1.5 bg-[#c9a84c] rounded-full ml-0.5 align-middle -translate-y-0.5" />
//               </span>
//               <span className="text-[0.5rem] tracking-[0.2em] text-[#a09488] uppercase mt-0.5">Best Newsportal in Nepal</span>
//             </span>
//           </a>

//           <div className="flex flex-col items-end gap-0.5">
//             <span className="text-[0.66rem] text-[#a09488] tracking-wide hidden md:block leading-none">
//               ०९ फागुन २०८२, आइतबार &nbsp;|&nbsp; Sun, Feb 22, 2026
//             </span>
//             <div className="flex gap-2 items-center mt-0.5">
//               <button className="w-8 h-8 border border-[rgba(28,23,17,0.12)] hover:border-[#1c1711] transition-colors flex items-center justify-center bg-transparent cursor-pointer flex-shrink-0">
//                 <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                   <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
//                 </svg>
//               </button>
//               <button className="bg-[#8B0000] text-white px-3 sm:px-4 h-8 text-[0.64rem] sm:text-[0.68rem] tracking-wider font-medium hover:bg-[#6b0000] transition-colors border-none cursor-pointer whitespace-nowrap">
//                 सदस्यता
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* NAV with logo integrated */}
//         <nav className="border-t border-[rgba(28,23,17,0.08)] bg-white">
//           <div className="flex items-center  px-4 sm:px-6 lg:px-12 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
//             {/* Small logo in nav (mobile visible) */}
//             <div className="flex items-center mr-4 lg:hidden">
//               <img
//                 src="/images/logo.png"
//                 alt="Shuchikhabar"
//                 className="h-6 w-auto object-contain"
//                 onError={(e) => {
//                   e.currentTarget.style.display = 'none';
//                 }}
//               />
//             </div>
            
//             {NAV.map((item, i) => (
//               <button
//                 key={i}
//                 onClick={() => setActiveNav(i)}
//                 className={`px-3 sm:px-4 py-2.5 text-[0.7rem] sm:text-[0.74rem] font-medium tracking-wide whitespace-nowrap relative transition-colors border-none bg-transparent cursor-pointer flex-shrink-0 ${
//                   activeNav === i ? 'text-[#8B0000]' : 'text-[#1c1711] hover:text-[#8B0000]'
//                 }`}
//               >
//                 {item}
//                 {activeNav === i && (
//                   <span className="absolute bottom-0 left-3 sm:left-4 right-3 sm:right-4 h-[2px] bg-[#8B0000]" />
//                 )}
//               </button>
//             ))}
//           </div>
//         </nav>
//       </header>

//       {/* ── MAIN ──────────────────────────────────────────────────── */}
//       <main className=" px-4 sm:px-6 lg:px-12">

//         {/* ── HERO ──────────────────────────────────────────────── */}
//         <section className="pt-5">
//           {/* Outer wrapper — aspect drives the total height for both columns */}
//           <div className="grid lg:grid-cols-[1fr_300px] gap-0" style={{ background: '#ede8e2' }}>

//             {/* Hero main — aspect ratio locks the left column height */}
//             <div
//               className="relative overflow-hidden group cursor-pointer bg-[#1c1711]"
//               style={{ aspectRatio: '16/10' }}
//             >
//               <img
//                 {...img(DATA.mainNews[0]?.image, 'hero_main')}
//                 alt={DATA.mainNews[0]?.title}
//                 className="absolute inset-0 w-full h-full object-cover opacity-88 group-hover:scale-[1.03] group-hover:opacity-100 transition-all duration-700"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,8,4,0.92)] via-[rgba(12,8,4,0.1)] to-transparent" />
//               <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 lg:p-7 text-white">
//                 <span className="inline-block bg-[#8B0000] text-[0.58rem] tracking-widest uppercase px-2.5 py-1 font-medium mb-2 leading-none">
//                   {DATA.mainNews[0]?.category}
//                 </span>
//                 <h1 className="font-['Playfair_Display'] text-xl sm:text-2xl lg:text-[1.65rem] font-bold leading-tight mb-2 max-w-2xl">
//                   {DATA.mainNews[0]?.title}
//                 </h1>
//                 <p className="text-[0.64rem] text-white/50 leading-none">
//                   {DATA.mainNews[0]?.author} &nbsp;·&nbsp; {DATA.mainNews[0]?.time}
//                 </p>
//               </div>
//             </div>

//             {/* Side stories — match left column height exactly via lg:absolute trick */}
//             <div className="hidden lg:flex flex-col bg-[#fdfcfb] overflow-hidden" style={{ aspectRatio: '300/450' }}>
//               {DATA.secondaryMainNews.slice(0, 2).map((story, i, arr) => (
//                 <SideStoryCard key={story.id} story={story} isLast={i === arr.length - 1} />
//               ))}
//             </div>
//           </div>
//         </section>

//         {/* ── MUKHYA SAMACHAR + AD 2 (native) ──────────────────────── */}
//         <section className="mt-7">
//           <SectionHeader title="मुख्य समाचार" href="/category/mukhya" />
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {DATA.mainNews.slice(0, 3).map((n, i) => (
//               <NewsCard key={n.id} item={n} seed={`mn_${i}`} />
//             ))}
//             <AdNativeCard />
//           </div>
//         </section>

//         {/* ── AD 4: MID STRIP ─────────────────────────────────────── */}
//         <AdMidStrip />

//         {/* ── TWO-COLUMN: MAIN + SIDEBAR ────────────────────────── */}
//         <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 lg:gap-10">

//           {/* ── MAIN COLUMN ─────────────────────────────────────── */}
//           <div className="flex flex-col space-y-7 min-w-0">

//             {/* MUKHYA */}
//             <section>
//               <SectionHeader title="मुख्य" href="/category/mukhya" />
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {DATA.mukhya.map((item, i) => <NewsCard key={item.id} item={item} seed={`muk_${i}`} />)}
//               </div>
//             </section>

//             {/* SAMACHAR */}
//             <section>
//               <SectionHeader title="समाचार" href="/category/samachar" />
//               <div>
//                 {DATA.samachar.map((item, i) => <ListCard key={item.id} item={item} seed={`sm_${i}`} />)}
//               </div>
//             </section>

//             {/* ARTHATATWA */}
//             <section>
//               <SectionHeader title="अर्थतन्त्र" href="/category/arthatatwa" />
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                 {DATA.arthatatwa.map((item, i) => <NewsCard key={item.id} item={item} seed={`arth_${i}`} />)}
//               </div>
//             </section>

//             {/* KRISHI */}
//             <section>
//               <SectionHeader title="कृषि" href="/category/krishi" />
//               <div>
//                 {DATA.krishi.map((item, i) => <ListCard key={item.id} item={item} seed={`kr_${i}`} />)}
//               </div>
//             </section>

//             {/* VICHAR / OPINION */}
//             <section>
//               <SectionHeader title="विचार" href="/category/vichar" />
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                 {DATA.opinions.map((op, i) => (
//                   <article key={op.id} className="p-4 border border-[#ede8e2] cursor-pointer group hover:border-[#8B0000]/40 hover:-translate-y-0.5 transition-all">
//                     <div className="flex items-center gap-2.5 mb-2.5">
//                       <img {...img(op.avatar, `av_${i}`)} alt="" className="w-9 h-9 rounded-full object-cover border-2 border-[#ede8e2] flex-shrink-0" />
//                       <div>
//                         <p className="text-[0.66rem] font-medium text-[#1c1711] leading-tight">{op.author}</p>
//                         <p className="text-[0.54rem] text-[#a09488] leading-tight">{op.role}</p>
//                       </div>
//                     </div>
//                     <p className="font-['Playfair_Display'] text-[0.88rem] font-semibold leading-snug italic text-[#1c1711] group-hover:text-[#8B0000] transition-colors">
//                       {op.title}
//                     </p>
//                   </article>
//                 ))}
//               </div>
//             </section>

//             {/* MANORANJAN */}
//             <section>
//               <SectionHeader title="मनोरञ्जन" href="/category/manoranjan" />
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                 {DATA.manoranjan.map((item, i) => <NewsCard key={item.id} item={item} seed={`mr_${i}`} />)}
//               </div>
//             </section>
//           </div>

//           {/* ── SIDEBAR ─────────────────────────────────────────── */}
//           <aside className="lg:border-l lg:border-[rgba(28,23,17,0.07)] lg:pl-6 pt-0 flex flex-col space-y-6">

//             {/* WEATHER */}
//             <div>
//               <div className="bg-[#1c1711] text-[#fdfcfb] px-4 py-3.5 flex items-center justify-between">
//                 <div>
//                   <p className="text-[0.58rem] tracking-[0.16em] uppercase text-white/38 leading-none mb-1.5">काठमाडौं</p>
//                   <p className="font-['Playfair_Display'] text-4xl font-light leading-none">14°</p>
//                   <p className="text-[0.66rem] text-white/48 mt-1.5 leading-none">धुम्मिलो</p>
//                 </div>
//                 <div className="text-right">
//                   <span className="text-3xl">🌥</span>
//                   <p className="text-[0.52rem] text-white/28 mt-1 leading-none">AQI: 245</p>
//                 </div>
//               </div>
//               <div className="grid grid-cols-3 bg-[#110f0a] text-white">
//                 {[['बिहान','11°','☁️'],['दिउँसो','17°','⛅'],['बेलुका','13°','🌙']].map(([t,d,e], i) => (
//                   <div key={i} className={`text-center py-2 ${i < 2 ? 'border-r border-white/10' : ''}`}>
//                     <p className="text-[0.5rem] text-white/30 uppercase tracking-wide leading-none mb-1">{t}</p>
//                     <p className="text-sm leading-none mb-0.5">{e}</p>
//                     <p className="text-[0.62rem] font-semibold leading-none">{d}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* AD 7 — SIDEBAR BOX */}
//             <AdSidebarBox />

//             {/* MOST READ */}
//             <div>
//               <p className="font-['Playfair_Display'] text-[0.88rem] font-bold border-b-2 border-[#1c1711] pb-2 mb-3 leading-none">सर्वाधिक पढिएको</p>
//               {DATA.mostRead.map((item, i) => (
//                 <div key={item.id} className="flex items-start gap-3 py-2.5 border-b border-[rgba(28,23,17,0.07)] last:border-b-0 cursor-pointer group">
//                   <span className="font-['Playfair_Display'] text-[1.5rem] font-bold text-[#ddb8b8] leading-none w-5 flex-shrink-0 text-right mt-0.5">{i+1}</span>
//                   <p className="font-['Source_Serif_4'] text-[0.8rem] leading-snug font-semibold group-hover:text-[#8B0000] transition-colors text-[#1c1711]">
//                     {item.title}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* AD 3 — SKYSCRAPER */}
//             <AdSkyscraper />

//             {/* DHARMIC */}
//             <div>
//               <p className="font-['Playfair_Display'] text-[0.88rem] font-bold border-b-2 border-[#1c1711] pb-2 mb-3 leading-none">धार्मिक</p>
//               {DATA.dharmic.map((item, i) => (
//                 <div key={item.id} className="flex gap-2.5 py-2.5 border-b border-[rgba(28,23,17,0.07)] last:border-b-0 cursor-pointer group">
//                   <div className="flex-shrink-0 overflow-hidden">
//                     <img {...img(item.image, `dh_${i}`)} alt="" className="w-[76px] h-[54px] object-cover group-hover:scale-[1.04] transition-transform duration-500 block" />
//                   </div>
//                   <p className="font-['Source_Serif_4'] text-[0.77rem] font-semibold leading-snug group-hover:text-[#8B0000] transition-colors text-[#1c1711]">
//                     {item.title}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* VIDEO */}
//             <div>
//               <p className="font-['Playfair_Display'] text-[0.88rem] font-bold border-b-2 border-[#1c1711] pb-2 mb-3 leading-none">भिडियो</p>
//               <div className="relative aspect-video overflow-hidden cursor-pointer group bg-[#1c1711]">
//                 <img {...img('https://picsum.photos/seed/suchi_vid1/400/225', 'vid1')} alt="" className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity block" />
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <div className="w-10 h-10 bg-[#8B0000] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
//                     <svg width="11" height="11" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
//                   </div>
//                 </div>
//               </div>
//               <p className="font-['Source_Serif_4'] text-[0.82rem] font-semibold leading-snug cursor-pointer hover:text-[#8B0000] transition-colors text-[#1c1711] mt-2">
//                 महाशिवरात्रि: पशुपतिनाथमा विशेष पूजाको दृश्य
//               </p>
//               <p className="text-[0.58rem] text-[#a09488] mt-1 leading-none">२ घन्टा अगाडि · ०८:४५</p>
//             </div>
//           </aside>
//         </div>

//         {/* ── DIVIDER ─────────────────────────────────────────────── */}
//         <div className="h-px bg-[#ede8e2] my-7" />

//         {/* ── SPORTS ─────────────────────────────────────────────────
//              Layout (lg, 4-col grid):
//              Row 1: [sp_0] [sp_1] [Ad Banner ←2 cols→]   = 4 slots ✓
//              Row 2: [sp_2 ←2 cols→] [sp_3 ←2 cols→]       = 4 slots ✓
//              No orphan empty columns at any breakpoint.
//         ──── */}
//         <section className="mb-8">
//           <SectionHeader title="खेलकुद" href="/category/khelkud" />
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Row 1 — 2 news + ad banner (2-wide) */}
//             <NewsCard item={DATA.sports[0]} seed="sp_0" />
//             <NewsCard item={DATA.sports[1]} seed="sp_1" />
//             <div className="sm:col-span-2 lg:col-span-2">
//               <AdSportsBanner />
//             </div>
//             {/* Row 2 — each card spans 2 cols → fills all 4 columns */}
//             <div className="sm:col-span-1 lg:col-span-2">
//               <NewsCard item={DATA.sports[2]} seed="sp_2" />
//             </div>
//             <div className="sm:col-span-1 lg:col-span-2">
//               <NewsCard item={DATA.sports[3]} seed="sp_3" />
//             </div>
//           </div>
//         </section>

//         {/* ── HEALTH + INTERNATIONAL ──────────────────────────────── */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-8">
//           <section>
//             <SectionHeader title="स्वास्थ्य" href="/category/swasthya" />
//             <div>
//               {DATA.swastha.map((item, i) => <ListCard key={item.id} item={item} seed={`sw_${i}`} />)}
//             </div>
//           </section>
//           <section>
//             <SectionHeader title="अन्तर्राष्ट्रिय" href="/category/antarrashtriya" />
//             <div>
//               {DATA.antarrashtriya.map((item, i) => <ListCard key={item.id} item={item} seed={`int_${i}`} />)}
//             </div>
//           </section>
//         </div>

//         {/* ── PHOTO GALLERY ────────────────────────────────────────── */}
//         <section className="mb-8">
//           <SectionHeader title="फोटो ग्यालरी" />
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-0.5">
//             {[
//               { label: 'महाशिवरात्रि', seed: 'gal1s' },
//               { label: 'क्रिकेट',      seed: 'gal2s' },
//               { label: 'कृषि',         seed: 'gal3s' },
//               { label: 'राजनीति',      seed: 'gal4s' },
//               { label: 'पर्यटन',       seed: 'gal5s' },
//             ].map((g, i) => (
//               <div key={i} className="relative overflow-hidden cursor-pointer group" style={{ aspectRatio: '1/1' }}>
//                 <img src={`https://picsum.photos/seed/${g.seed}/300/300`} alt={g.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 block" />
//                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/22 transition-all" />
//                 <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <span className="text-white text-[0.5rem] tracking-wide uppercase bg-[#8B0000] px-1.5 py-0.5 leading-none">{g.label}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//       </main>

//       {/* ── AD 6: PRE-FOOTER ─────────────────────────────────────── */}
//       <AdFooterStrip />

//       {/* ── FOOTER ──────────────────────────────────────────────── */}
//       <footer className="bg-[#1c1711] text-[#c8bfb4]">
//         <div className=" px-4 sm:px-6 lg:px-12 py-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 border-b border-white/8">
//           <div>
//             {/* Footer logo */}
//             <img
//               src="/images/logo.png"
//               alt="Shuchikhabar"
//               className="h-9 w-auto object-contain mb-2 brightness-0 invert"
//               onError={(e) => {
//                 e.currentTarget.style.display = 'none';
//                 e.currentTarget.nextSibling.style.display = 'block';
//               }}
//             />
//             <p className="font-['Playfair_Display'] text-[1.1rem] text-[#fdfcfb] font-bold hidden mb-1">
//               शुचि<span className="text-[#8B0000]">खबर</span>
//             </p>
//             <p className="text-[0.54rem] tracking-[0.18em] text-[#a09488] uppercase mb-2.5">Best Newsportal in Nepal</p>
//             <p className="text-[0.71rem] leading-relaxed text-white/38 mb-4">
//               शुचि खबर — सत्य, तथ्य र निष्पक्ष समाचारको लागि नेपालको विश्वसनीय समाचार पोर्टल।
//             </p>
//             <div className="flex gap-2">
//               {['fb','tw','yt','in'].map((s, i) => (
//                 <div key={i} className="w-7 h-7 border border-white/12 flex items-center justify-center text-[0.52rem] text-white/36 cursor-pointer hover:border-[#8B0000] hover:text-white transition-all uppercase font-bold">{s}</div>
//               ))}
//             </div>
//           </div>
//           {[
//             { title: 'विभाग',   links: ['मुख्य','समाचार','अर्थतन्त्र','खेलकुद','मनोरञ्जन','कृषि'] },
//             { title: 'थप',     links: ['स्वास्थ्य','धार्मिक','विचार','अन्तर्राष्ट्रिय','फोटो','भिडियो'] },
//             { title: 'सम्पर्क', links: ['हाम्रोबारे','सम्पर्क गर्नुहोस्','विज्ञापन','गोपनीयता नीति','प्रयोग सर्त'] },
//           ].map(col => (
//             <div key={col.title}>
//               <p className="text-[0.58rem] tracking-[0.16em] uppercase text-[#fdfcfb] font-medium mb-3">{col.title}</p>
//               {col.links.map((l, i) => (
//                 <a key={i} href="#" className="block text-[0.74rem] mb-2 text-[#9e9188] hover:text-[#fdfcfb] transition-colors no-underline">{l}</a>
//               ))}
//             </div>
//           ))}
//         </div>
//         <div className=" px-4 sm:px-6 lg:px-12 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-2 text-[0.62rem] text-white/20">
//           <span>© २०८२ शुचि खबर। सर्वाधिकार सुरक्षित।</span>
//           <span>shuchikhabar.com — Best Newsportal in Nepal</span>
//         </div>
//       </footer>

//       {/* ── GLOBAL STYLES ─────────────────────────────────────────── */}
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }
//         body { margin: 0; background: #fdfcfb; }
//         ::-webkit-scrollbar { height: 0; width: 0; }
//         scrollbar-width: none;
//         img { display: block; }
//         a { text-decoration: none; }
//         @keyframes ticker {
//           from { transform: translateX(0); }
//           to   { transform: translateX(-50%); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Welcome;