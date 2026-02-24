import React, { useEffect, useRef, useState } from "react";

const gsap = window.gsap;

const destinations = [
  {
    id: 1,
    region: "Sahara Desert - Morocco",
    name: "MARRAKECH MERZOUGA",
    bg: "https://images.unsplash.com/photo-1539020140153-e479b8f62b2a?w=300&q=80",
  },
  {
    id: 2,
    region: "Sierra Nevada - United States",
    name: "YOSEMITE NATIONAL PARK",
    bg: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=300&q=80",
  },
  {
    id: 3,
    region: "Tarifa - Spain",
    name: "LOS LANCES BEACH",
    bg: "https://images.unsplash.com/photo-1503525148566-ef5c2b9c93bd?w=300&q=80",
  },
  {
    id: 4,
    region: "Cappadocia - Turkey",
    name: "GÖREME VALLEY",
    bg: "https://images.unsplash.com/photo-1527838832700-5059252407fa?w=300&q=80",
  },
];

const HERO_BG =
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1400&q=80";

export default function Hero() {
  const navRef = useRef(null);
  const lineRef = useRef(null);   // ✅ separate ref
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const btnRef = useRef(null);
  const counterRef = useRef(null);
  const cardsRef = useRef([]);

  const [activeCard, setActiveCard] = useState(1);

  useEffect(() => {
    if (!gsap) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(navRef.current, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 })
      .fromTo(lineRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5 }, "-=0.4")
      .fromTo(subtitleRef.current, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, "-=0.3")
      .fromTo(titleRef.current, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, "-=0.3")
      .fromTo(descRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.2")
      .fromTo(btnRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
      .fromTo(
        cardsRef.current,
        { y: 80, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12 },
        "-=0.4"
      )
      .fromTo(counterRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5 }, "-=0.3");
  }, []);

  const handleCardHover = (index, isEnter) => {
    if (!gsap) return;
    gsap.to(cardsRef.current[index], {
      y: isEnter ? -12 : 0,
      scale: isEnter ? 1.04 : 1,
      duration: 0.35,
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      {/* Background */}
      <img src={HERO_BG} className="absolute inset-0 w-full h-full object-cover" />

      {/* Navbar */}
      <nav ref={navRef} className="relative z-10 flex justify-between px-8 py-5 text-white opacity-0">
        <h2 className="tracking-widest text-sm">GLOBE EXPRESS</h2>
      </nav>

      {/* Content */}
      <div className="relative z-10 flex items-end h-full pb-16 px-10">
        <div className="max-w-xs">
          {/* FIXED refs */}
          <div ref={lineRef} className="w-6 h-0.5 bg-yellow-400 mb-3 opacity-0" />
          <p ref={subtitleRef} className="text-white/80 text-sm opacity-0">Japan Alps</p>

          <h1 ref={titleRef} className="text-white text-6xl font-bold opacity-0">
            NAGANO<br />PREFECTURE
          </h1>

          <p ref={descRef} className="text-white/60 text-sm opacity-0">
            Mauris malesuada nisi sit amet augue accumsan tincidunt.
          </p>

          <button ref={btnRef} className="mt-4 px-6 py-2 bg-yellow-400 opacity-0">
            DISCOVER LOCATION
          </button>
        </div>

        {/* Cards */}
        <div className="flex gap-4 ml-auto">
          {destinations.map((d, i) => (
            <div
              key={d.id}
              ref={(el) => (cardsRef.current[i] = el)}
              onMouseEnter={() => handleCardHover(i, true)}
              onMouseLeave={() => handleCardHover(i, false)}
              onClick={() => setActiveCard(d.id)}
              className="relative w-36 h-52 rounded-xl overflow-hidden cursor-pointer opacity-0"
            >
              <img src={d.bg} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute bottom-2 left-2 text-white text-xs">
                {d.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Counter */}
      <div ref={counterRef} className="absolute bottom-6 right-10 text-white text-3xl opacity-0">
        02
      </div>
    </div>
  );
}
