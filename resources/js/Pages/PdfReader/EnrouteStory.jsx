import { useEffect, useState } from "react";

const cityImg = "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80";
const treeImg = "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80";
const roadImg = "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=80";

function HexClip({ id, points }) {
  return (
    <defs>
      <clipPath id={id} clipPathUnits="objectBoundingBox">
        <polygon points={points} />
      </clipPath>
    </defs>
  );
}

// Hexagon as a positioned div with clip-path
function Hex({ style, imgSrc, className = "" }) {
  const hexPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
  return (
    <div
      className={`absolute overflow-hidden ${className}`}
      style={{
        clipPath: hexPath,
        WebkitClipPath: hexPath,
        border: "none",
        ...style,
      }}
    >
      <img
        src={imgSrc}
        alt=""
        className="w-full h-full object-cover"
        style={{ transform: "scale(1.1)" }}
      />
      {/* white border overlay via inset hex */}
      <div
        className="absolute inset-0"
        style={{
          clipPath: hexPath,
          WebkitClipPath: hexPath,
          boxShadow: "inset 0 0 0 3px white",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export default function EnrouteStory() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  return (
    <div
      className="relative bg-white overflow-hidden flex flex-col"
      style={{
        width: "390px",
        minHeight: "844px",
        fontFamily: "'Arial', sans-serif",
        margin: "0 auto",
      }}
    >
      {/* Vertical decorative lines left */}
      <div className="absolute left-8 top-0 bottom-0 flex gap-2 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="w-px bg-gray-300" style={{ height: "60%", marginTop: "10%" }} />
        <div className="w-px bg-gray-300" style={{ height: "50%", marginTop: "20%" }} />
      </div>

      {/* Vertical decorative lines right */}
      <div className="absolute right-8 top-0 bottom-0 flex gap-2 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="w-px bg-gray-300" style={{ height: "45%", marginTop: "5%" }} />
        <div className="w-px bg-gray-300" style={{ height: "55%", marginTop: "15%" }} />
      </div>

      {/* Date */}
      <div className="relative z-10 pt-8 pl-10">
        <p className="text-gray-700 text-sm font-medium tracking-wide">
          jan,13<sup className="text-xs">th</sup> 2023
        </p>
      </div>

      {/* Hexagon grid */}
      <div className="relative z-10" style={{ height: "540px", marginTop: "10px" }}>
        {/* Honeycomb: 3 hexagons arranged like the image */}
        {/* Top-left hex (building) */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: "195px",
            height: "220px",
            top: "0px",
            left: "50px",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            WebkitClipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            outline: "3px solid white",
          }}
        >
          <img src={cityImg} alt="building" className="w-full h-full object-cover" style={{ transform: "scale(1.15)" }} />
          <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 0 4px white" }} />
        </div>

        {/* Top-right hex (building partial) */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: "195px",
            height: "220px",
            top: "0px",
            left: "215px",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            WebkitClipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <img src={cityImg} alt="building" className="w-full h-full object-cover" style={{ objectPosition: "right center", transform: "scale(1.15)" }} />
          <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 0 4px white" }} />
        </div>

        {/* Middle center hex (trees) */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: "195px",
            height: "220px",
            top: "165px",
            left: "130px",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            WebkitClipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <img src={treeImg} alt="trees" className="w-full h-full object-cover" style={{ transform: "scale(1.15)" }} />
          <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 0 4px white" }} />
        </div>

        {/* Middle right hex (trees) */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: "195px",
            height: "220px",
            top: "165px",
            left: "300px",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            WebkitClipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <img src={treeImg} alt="trees" className="w-full h-full object-cover" style={{ objectPosition: "right", transform: "scale(1.15)" }} />
          <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 0 4px white" }} />
        </div>

        {/* Bottom center hex (road) */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: "195px",
            height: "220px",
            top: "330px",
            left: "215px",
            clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            WebkitClipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
          }}
        >
          <img src={roadImg} alt="road" className="w-full h-full object-cover" style={{ transform: "scale(1.15)" }} />
          <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 0 4px white" }} />
        </div>
      </div>

      {/* Bottom section */}
      <div className="relative z-10 flex flex-1" style={{ marginTop: "-60px" }}>
        {/* ENROUTE text stacked vertically on left */}
        <div className="relative" style={{ width: "110px", flexShrink: 0 }}>
          {/* Background ghost text */}
          <div
            className="absolute bottom-20 left-0"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              fontSize: "62px",
              fontWeight: "900",
              color: "#ccc",
              letterSpacing: "-2px",
              lineHeight: 1,
              userSelect: "none",
              opacity: 0.5,
            }}
          >
            ENROUTE
          </div>
          {/* Foreground bold text */}
          <div
            className="absolute bottom-20 left-0"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg) translateX(20px)",
              fontSize: "62px",
              fontWeight: "900",
              color: "#1a1a1a",
              letterSpacing: "-2px",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            ENROUTE
          </div>
        </div>

        {/* Right content */}
        <div className="flex flex-col justify-start pt-4 pl-4 pr-8 flex-1">
          {/* Social icons */}
          <div className="flex items-center gap-6 mb-6">
            {/* Instagram */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1" fill="#1a1a1a" stroke="none"/>
            </svg>
            {/* Pinterest */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.04-2.83.18-.77 1.22-5.17 1.22-5.17s-.31-.63-.31-1.56c0-1.46.85-2.55 1.9-2.55.9 0 1.33.67 1.33 1.48 0 .9-.58 2.26-.87 3.51-.25 1.05.52 1.9 1.55 1.9 1.86 0 3.3-1.96 3.3-4.79 0-2.5-1.8-4.25-4.37-4.25-2.98 0-4.73 2.23-4.73 4.54 0 .9.35 1.86.78 2.39.09.1.1.19.07.3-.08.32-.26 1.05-.29 1.19-.05.19-.17.23-.38.14-1.39-.65-2.26-2.68-2.26-4.32 0-3.51 2.55-6.74 7.35-6.74 3.86 0 6.86 2.75 6.86 6.42 0 3.83-2.41 6.91-5.76 6.91-1.12 0-2.18-.58-2.55-1.27l-.69 2.58c-.25.96-.93 2.17-1.39 2.9.05.02.1.03.15.03C17.52 22 22 17.52 22 12S17.52 2 12 2z"/>
            </svg>
            {/* WhatsApp */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
            </svg>
          </div>

          {/* Quote */}
          <p className="text-gray-700 text-sm leading-relaxed" style={{ fontWeight: "600", fontStyle: "italic" }}>
            life is a journey without end,<br />
            whatever will be at the end of your journey<br />
            is a result what you have done in your life.
          </p>
        </div>
      </div>

      {/* Instastory by signature */}
      <div className="relative z-10 text-center pb-6 pt-2">
        <p className="text-gray-500 text-xs tracking-wide" style={{ fontFamily: "serif" }}>
          instastory by{" "}
          <span
            style={{
              fontFamily: "'Dancing Script', 'Brush Script MT', cursive",
              fontSize: "16px",
              color: "#555",
            }}
          >
            Jesar Maulaa
          </span>
        </p>
      </div>
    </div>
  );
}