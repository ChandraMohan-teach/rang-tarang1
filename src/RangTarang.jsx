import g1 from './assets/gallery/g1.jpeg';
import g2 from './assets/gallery/g2.jpeg';
import g3 from './assets/gallery/g3.jpeg';
import g4 from './assets/gallery/g4.jpeg';
import g5 from './assets/gallery/g5.jpeg';
import g6 from './assets/gallery/g6.jpeg';
import g7 from './assets/gallery/g7.jpeg';
import React, { useState, useEffect, useRef } from "react";
import emailjs from "@emailjs/browser";

/* ─── PALETTE ───────────────────────────────────────────────────
   #0B0909  Midnight (darkest bg / dark ink)
   #2E4540  Forest (mid-dark surface / accent)
   #408175  Jade (primary accent / teal)
   #B5B9F0  Lavender (light accent / highlights)
──────────────────────────────────────────────────────────────── */

const COURSES = [
  { name: "Sketching", tag: "Foundation", icon: "pencil", desc: "Pencil control, shading, portraiture & still life — where every artist begins." },
  { name: "Painting", tag: "Colour", icon: "brush", desc: "Composition, colour theory and brushwork across acrylic and mixed media." },
  { name: "Water Colour", tag: "Transparency", icon: "drop", desc: "Wash techniques, wet-on-wet blending, building light through layers." },
  { name: "Oil Colour", tag: "Depth", icon: "palette", desc: "Layering, glazing and texture — for students ready to work slow and rich." },
  { name: "Sculpture", tag: "Form", icon: "hand", desc: "Three-dimensional thinking: clay modelling and basic relief work." },
  { name: "NIFT Entrance Prep", tag: "Entrance", icon: "star", desc: "Focused preparation for NIFT entrance exams — creative ability, observation & design thinking." },
  { name: "NID Entrance Prep", tag: "Entrance", icon: "star", desc: "Comprehensive training for NID entrance — design aptitude, creativity, and studio test preparation." },
  { name: "Pearl / AIEED Prep", tag: "Entrance", icon: "star", desc: "Targeted preparation for Pearl Academy & AIEED — portfolio building, situational tests & design fundamentals." },
  { name: "BFA Preparation", tag: "Certification", icon: "award", desc: "Bachelor of Fine Arts entrance coaching — covering all major Indian art colleges and university entrance exams." },
  { name: "MFA Preparation", tag: "Certification", icon: "award", desc: "Master of Fine Arts entrance coaching — advanced portfolio development and specialised studio practice." },
];

// Turns raw SVG markup into a CSS-ready data URI background
const svgBg = (svg) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

// One colourful, hand-drawn illustration per course — used as each card's cover image
const COURSE_ART = [
  // Sketching — graphite pencil on cream paper
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
    <rect width='300' height='200' fill='#EFE6D3'/>
    <g transform='rotate(-18 150 90)'>
      <rect x='20' y='78' width='230' height='26' fill='#3A3A3A'/>
      <rect x='20' y='78' width='230' height='8' fill='#5A5A5A'/>
      <rect x='250' y='78' width='30' height='26' fill='#E8B93F'/>
      <polygon points='280,78 300,91 280,104' fill='#3A3A3A'/>
      <rect x='0' y='78' width='20' height='26' fill='#F3A6A6'/>
    </g>
    <path d='M30 150 L80 128 M60 165 L120 138 M100 178 L160 150' stroke='#3A3A3A' stroke-width='4' opacity='.35' stroke-linecap='round'/>
  </svg>`,
  // Painting — bright paint blobs and a brush stroke
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
    <rect width='300' height='200' fill='#FFF6E0'/>
    <circle cx='70' cy='60' r='30' fill='#FF6B6B'/>
    <circle cx='140' cy='45' r='24' fill='#FFD93D'/>
    <circle cx='205' cy='80' r='28' fill='#4D96FF'/>
    <circle cx='105' cy='110' r='22' fill='#6BCB77'/>
    <circle cx='185' cy='140' r='26' fill='#B980F0'/>
    <path d='M10 175 Q80 140 150 175 T290 165' stroke='#3A3A3A' stroke-width='6' fill='none' opacity='.28' stroke-linecap='round'/>
  </svg>`,
  // Water Colour — soft overlapping washes
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
    <defs><filter id='b1'><feGaussianBlur stdDeviation='12'/></filter></defs>
    <rect width='300' height='200' fill='#EAF6F6'/>
    <ellipse cx='90' cy='70' rx='90' ry='55' fill='#2EC4B6' opacity='.6' filter='url(#b1)'/>
    <ellipse cx='210' cy='110' rx='85' ry='55' fill='#5C6BC0' opacity='.55' filter='url(#b1)'/>
    <ellipse cx='150' cy='150' rx='75' ry='40' fill='#8ED1C6' opacity='.55' filter='url(#b1)'/>
  </svg>`,
  // Oil Colour — thick warm impasto strokes
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
    <rect width='300' height='200' fill='#3A1F16'/>
    <path d='M0 50 Q80 15 160 50 T300 40 L300 95 Q220 60 140 95 T0 85 Z' fill='#E2711D'/>
    <path d='M0 110 Q90 145 180 110 T300 120 L300 175 Q210 200 120 175 T0 185 Z' fill='#8B2635'/>
    <circle cx='240' cy='55' r='16' fill='#F0B429'/>
    <circle cx='55' cy='150' r='12' fill='#F0B429' opacity='.85'/>
  </svg>`,
  // Sculpture — terracotta vase form
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
    <rect width='300' height='200' fill='#F1DDBB'/>
    <path d='M150 22 C112 22 102 55 112 82 C93 100 93 145 112 172 C122 194 178 194 188 172 C207 145 207 100 188 82 C198 55 188 22 150 22 Z' fill='#C1440E'/>
    <ellipse cx='150' cy='30' rx='38' ry='10' fill='#8A2F0B'/>
  </svg>`,
  // NIFT Entrance Prep — fashion triangles + star
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
    <rect width='300' height='200' fill='#2B0F2E'/>
    <polygon points='150,10 235,190 65,190' fill='#D6336C' opacity='.9'/>
    <polygon points='150,55 195,190 105,190' fill='#7048E8' opacity='.8'/>
    <polygon points='150,0 163,34 199,34 170,55 181,90 150,69 119,90 130,55 101,34 137,34' fill='#F0B429'/>
  </svg>`,
  // NID Entrance Prep — blueprint grid + compass
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
    <rect width='300' height='200' fill='#12406B'/>
    <g stroke='#4FA8DA' stroke-width='1' opacity='.4'>
      <line x1='0' y1='30' x2='300' y2='30'/><line x1='0' y1='60' x2='300' y2='60'/><line x1='0' y1='90' x2='300' y2='90'/><line x1='0' y1='120' x2='300' y2='120'/><line x1='0' y1='150' x2='300' y2='150'/><line x1='0' y1='180' x2='300' y2='180'/>
      <line x1='30' y1='0' x2='30' y2='200'/><line x1='60' y1='0' x2='60' y2='200'/><line x1='90' y1='0' x2='90' y2='200'/><line x1='120' y1='0' x2='120' y2='200'/><line x1='150' y1='0' x2='150' y2='200'/><line x1='180' y1='0' x2='180' y2='200'/><line x1='210' y1='0' x2='210' y2='200'/><line x1='240' y1='0' x2='240' y2='200'/><line x1='270' y1='0' x2='270' y2='200'/>
    </g>
    <circle cx='195' cy='95' r='48' fill='none' stroke='#0CA678' stroke-width='4'/>
    <line x1='195' y1='47' x2='195' y2='143' stroke='#F0B429' stroke-width='4'/>
    <line x1='147' y1='95' x2='243' y2='95' stroke='#F0B429' stroke-width='4'/>
  </svg>`,
  // Pearl / AIEED Prep — scattered portfolio photo frames
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
    <rect width='300' height='200' fill='#2A1A12'/>
    <rect x='20' y='24' width='100' height='80' rx='4' fill='#fff' opacity='.92'/>
    <rect x='30' y='34' width='80' height='54' fill='#F76707'/>
    <rect x='150' y='55' width='100' height='80' rx='4' fill='#fff' opacity='.92' transform='rotate(7 200 95)'/>
    <rect x='160' y='65' width='80' height='54' fill='#E64980' transform='rotate(7 200 95)'/>
    <rect x='70' y='110' width='100' height='80' rx='4' fill='#fff' opacity='.92' transform='rotate(-5 120 150)'/>
    <rect x='80' y='120' width='80' height='54' fill='#4D96FF' transform='rotate(-5 120 150)'/>
  </svg>`,
  // BFA Preparation — laurel wreath medal
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
    <rect width='300' height='200' fill='#0D2818'/>
    <circle cx='150' cy='100' r='62' fill='none' stroke='#F0B429' stroke-width='6'/>
    <g fill='#2F9E44'>
      <ellipse cx='96' cy='55' rx='9' ry='18' transform='rotate(-30 96 55)'/>
      <ellipse cx='80' cy='82' rx='9' ry='18' transform='rotate(-15 80 82)'/>
      <ellipse cx='74' cy='108' rx='9' ry='18'/>
      <ellipse cx='204' cy='55' rx='9' ry='18' transform='rotate(30 204 55)'/>
      <ellipse cx='220' cy='82' rx='9' ry='18' transform='rotate(15 220 82)'/>
      <ellipse cx='226' cy='108' rx='9' ry='18'/>
    </g>
    <circle cx='150' cy='100' r='32' fill='#F0B429'/>
  </svg>`,
  // MFA Preparation — diploma scroll seal
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 200'>
    <rect width='300' height='200' fill='#241344'/>
    <rect x='60' y='24' width='180' height='104' rx='10' fill='#F5F0FF'/>
    <line x1='80' y1='48' x2='220' y2='48' stroke='#5F3DC4' stroke-width='4'/>
    <line x1='80' y1='68' x2='200' y2='68' stroke='#5F3DC4' stroke-width='4' opacity='.7'/>
    <line x1='80' y1='88' x2='210' y2='88' stroke='#5F3DC4' stroke-width='4' opacity='.7'/>
    <line x1='80' y1='108' x2='180' y2='108' stroke='#5F3DC4' stroke-width='4' opacity='.7'/>
    <circle cx='150' cy='150' r='26' fill='#F0B429'/>
    <polygon points='150,168 137,196 150,184 163,196' fill='#5F3DC4'/>
  </svg>`,
];

const GALLERY = [
  { label:"Achievements", sub:"Awards", image:g1 },
  { label:"Student Artwork", sub:"Painting", image:g2 },
  { label:"Competition Winners", sub:"Certificates", image:g3 },
  { label:"Pencil Portrait", sub:"Sketch", image:g4 },
  { label:"Sculpture Work", sub:"Statue Painting", image:g5 },
  { label:"Watercolour", sub:"Student Art", image:g6 },
  { label:"Clay Sculpture", sub:"Craftsmanship", image:g7 },
];

/* ─── HOOKS ─────────────────────────────────────────────────── */
function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold });
    obs.observe(el); return () => obs.disconnect();
  }, []);
  return [ref, vis];
}

// Hook that tracks scroll progress (0→1) while element is in view
function useScrollProgress() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      // 0 when element enters bottom, 1 when it reaches top 30%
      const p = Math.min(1, Math.max(0, (winH - rect.top) / (winH * 0.8)));
      setProgress(p);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);
  return [ref, progress];
}

function useCounter(target, active, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const prog = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - prog, 3);
      setVal(Math.round(ease * target));
      if (prog < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

/* ─── FADE UP ──────────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = "" }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} className={className} style={{
      transition: `opacity 0.9s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.9s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(40px)",
    }}>{children}</div>
  );
}

/* ─── FADE IN (opacity 0→100%, no transform) ─────────────────── */
function FadeIn({ children, delay = 0, className = "", duration = 1000 }) {
  const [ref, vis] = useReveal(0.05);
  return (
    <div ref={ref} className={className} style={{
      transition: `opacity ${duration}ms cubic-bezier(.4,0,.2,1) ${delay}ms`,
      opacity: vis ? 1 : 0,
      willChange: "opacity",
    }}>{children}</div>
  );
}

/* ─── SLIDE IN FROM LEFT ─────────────────────────────────────── */
function SlideInLeft({ children, delay = 0, className = "" }) {
  const [ref, vis] = useReveal(0.1);
  return (
    <div ref={ref} className={className} style={{
      transition: `opacity 0.85s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.85s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      opacity: vis ? 1 : 0,
      transform: vis ? "translateX(0)" : "translateX(-56px)",
      willChange: "opacity, transform",
    }}>{children}</div>
  );
}

/* ─── SLIDE IN FROM RIGHT ────────────────────────────────────── */
function SlideInRight({ children, delay = 0, className = "" }) {
  const [ref, vis] = useReveal(0.1);
  return (
    <div ref={ref} className={className} style={{
      transition: `opacity 0.85s cubic-bezier(.16,1,.3,1) ${delay}ms, transform 0.85s cubic-bezier(.16,1,.3,1) ${delay}ms`,
      opacity: vis ? 1 : 0,
      transform: vis ? "translateX(0)" : "translateX(56px)",
      willChange: "opacity, transform",
    }}>{children}</div>
  );
}

/* ─── SCALE IN ───────────────────────────────────────────────── */
function ScaleIn({ children, delay = 0, className = "" }) {
  const [ref, vis] = useReveal(0.1);
  return (
    <div ref={ref} className={className} style={{
      transition: `opacity 0.7s cubic-bezier(.34,1.56,.64,1) ${delay}ms, transform 0.7s cubic-bezier(.34,1.56,.64,1) ${delay}ms`,
      opacity: vis ? 1 : 0,
      transform: vis ? "scale(1)" : "scale(0.82)",
      willChange: "opacity, transform",
    }}>{children}</div>
  );
}

/* ─── PARALLAX FADE (smooth opacity linked to scroll progress) ── */
function ParallaxFade({ children, className = "" }) {
  const [ref, progress] = useScrollProgress();
  const opacity = Math.min(1, progress * 1.8);
  const translateY = (1 - progress) * 50;
  return (
    <div ref={ref} className={className} style={{
      opacity,
      transform: `translateY(${translateY}px)`,
      willChange: "opacity, transform",
    }}>{children}</div>
  );
}

/* ─── SVG PAINTINGS ──────────────────────────────────────────
   All use only the brand palette:
   #0B0909  #2E4540  #408175  #B5B9F0
──────────────────────────────────────────────────────────────── */

// Painting 1: Still Life — vase with flowers, bowl of fruit
function PaintingStillLife({ w = 280, h = 220, dark }) {
  const bg = dark ? "#0B0909" : "#f0ede8";
  return (
    <svg width={w} height={h} viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* canvas background */}
      <rect width={280} height={220} fill={bg} rx={4}/>
      {/* table surface */}
      <rect x={0} y={160} width={280} height={60} fill="#2E4540" opacity={0.35}/>
      <line x1={0} y1={160} x2={280} y2={160} stroke="#408175" strokeWidth={1} opacity={0.5}/>
      {/* vase body */}
      <path d="M118 160 C110 145 105 130 108 115 C110 105 130 98 140 98 C150 98 170 105 172 115 C175 130 170 145 162 160Z" fill="#2E4540"/>
      <path d="M118 160 C110 145 105 130 108 115 C110 105 130 98 140 98 C150 98 170 105 172 115 C175 130 170 145 162 160Z" fill="#408175" opacity={0.45}/>
      {/* vase neck */}
      <path d="M126 98 C126 92 128 88 140 88 C152 88 154 92 154 98Z" fill="#2E4540"/>
      <path d="M126 98 C126 92 128 88 140 88 C152 88 154 92 154 98Z" fill="#408175" opacity={0.6}/>
      {/* vase highlight */}
      <ellipse cx={128} cy={130} rx={5} ry={14} fill="#B5B9F0" opacity={0.2}/>
      {/* stems */}
      <line x1={140} y1={88} x2={110} y2={55} stroke="#2E4540" strokeWidth={2}/>
      <line x1={140} y1={88} x2={140} y2={40} stroke="#2E4540" strokeWidth={2}/>
      <line x1={140} y1={88} x2={168} y2={50} stroke="#2E4540" strokeWidth={2}/>
      <line x1={140} y1={88} x2={125} y2={38} stroke="#2E4540" strokeWidth={1.5}/>
      <line x1={140} y1={88} x2={158} y2={42} stroke="#2E4540" strokeWidth={1.5}/>
      {/* flowers */}
      {/* center flower - lavender */}
      <circle cx={140} cy={36} r={14} fill="#B5B9F0" opacity={0.9}/>
      <circle cx={140} cy={36} r={6} fill="#2E4540"/>
      <circle cx={140} cy={36} r={3} fill="#B5B9F0" opacity={0.5}/>
      {/* left flower - teal */}
      <circle cx={108} cy={52} r={11} fill="#408175" opacity={0.9}/>
      <circle cx={108} cy={52} r={5} fill="#0B0909" opacity={0.6}/>
      {/* right flower - forest */}
      <circle cx={170} cy={46} r={11} fill="#2E4540" opacity={0.95}/>
      <ellipse cx={170} cy={46} rx={11} ry={11} fill="none" stroke="#408175" strokeWidth={1.5}/>
      <circle cx={170} cy={46} r={4} fill="#408175" opacity={0.7}/>
      {/* small blooms */}
      <circle cx={123} cy={35} r={7} fill="#B5B9F0" opacity={0.6}/>
      <circle cx={123} cy={35} r={3} fill="#2E4540"/>
      <circle cx={160} cy={39} r={7} fill="#408175" opacity={0.7}/>
      <circle cx={160} cy={39} r={3} fill="#2E4540" opacity={0.8}/>
      {/* leaves */}
      <path d="M130 65 Q118 58 112 65 Q120 72 130 65Z" fill="#408175" opacity={0.6}/>
      <path d="M152 60 Q162 52 168 60 Q160 68 152 60Z" fill="#2E4540" opacity={0.8}/>
      {/* fruit bowl */}
      <ellipse cx={85} cy={161} rx={28} ry={8} fill="#2E4540" opacity={0.5}/>
      <path d="M57 161 Q57 148 85 148 Q113 148 113 161Z" fill="#2E4540" opacity={0.4}/>
      {/* fruits */}
      <circle cx={78} cy={150} r={9} fill="#408175" opacity={0.85}/>
      <circle cx={94} cy={148} r={10} fill="#B5B9F0" opacity={0.8}/>
      <circle cx={85} cy={152} r={8} fill="#2E4540" opacity={0.9}/>
      <circle cx={78} cy={150} r={3} fill="#B5B9F0" opacity={0.3}/>
      {/* shadow under vase */}
      <ellipse cx={140} cy={161} rx={26} ry={5} fill="#0B0909" opacity={0.25}/>
      {/* background wash strokes */}
      <path d="M0 80 Q70 60 140 80 Q210 100 280 70" stroke="#408175" strokeWidth={30} strokeLinecap="round" fill="none" opacity={0.05}/>
      <path d="M0 120 Q80 140 160 120 Q220 105 280 125" stroke="#2E4540" strokeWidth={20} fill="none" opacity={0.08}/>
    </svg>
  );
}

// Painting 2: Portrait sketch — elegant face in charcoal style
function PaintingPortrait({ w = 280, h = 220, dark }) {
  const bg = dark ? "#0f0d0d" : "#f5f0e8";
  return (
    <svg width={w} height={h} viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width={280} height={220} fill={bg} rx={4}/>
      {/* hatching bg texture */}
      {[0,8,16,24,32,40,48,56,64,72,80].map(i=>(
        <line key={i} x1={i*3} y1={0} x2={0} y2={i*3} stroke="#2E4540" strokeWidth={0.4} opacity={0.15}/>
      ))}
      {/* neck & shoulders */}
      <path d="M100 200 L100 160 Q140 175 180 160 L180 200Z" fill="#B5B9F0" opacity={0.25}/>
      <path d="M108 160 Q140 170 172 160 L175 148 Q140 158 105 148Z" fill="#B5B9F0" opacity={0.2}/>
      {/* head shape */}
      <ellipse cx={140} cy={105} rx={50} ry={62} fill="#B5B9F0" opacity={0.22}/>
      <ellipse cx={140} cy={105} rx={48} ry={60} stroke="#2E4540" strokeWidth={1.5} fill="none" opacity={0.7}/>
      {/* hair */}
      <path d="M92 95 Q90 65 100 52 Q118 38 140 36 Q162 38 180 52 Q190 65 188 95" fill="#2E4540" opacity={0.85}/>
      <path d="M92 95 Q88 105 90 115" stroke="#2E4540" strokeWidth={2} fill="none" opacity={0.6}/>
      <path d="M188 95 Q192 108 188 118" stroke="#2E4540" strokeWidth={2} fill="none" opacity={0.5}/>
      {/* ear */}
      <path d="M90 110 Q82 108 82 118 Q82 128 90 126" stroke="#2E4540" strokeWidth={1.2} fill="none" opacity={0.5}/>
      <path d="M190 110 Q198 108 198 118 Q198 128 190 126" stroke="#2E4540" strokeWidth={1.2} fill="none" opacity={0.5}/>
      {/* eyebrows */}
      <path d="M112 92 Q124 86 136 88" stroke="#2E4540" strokeWidth={2} strokeLinecap="round" fill="none"/>
      <path d="M144 88 Q156 86 168 92" stroke="#2E4540" strokeWidth={2} strokeLinecap="round" fill="none"/>
      {/* eyes */}
      <ellipse cx={124} cy={102} rx={10} ry={6} fill="#2E4540" opacity={0.15}/>
      <ellipse cx={124} cy={102} rx={10} ry={6} stroke="#2E4540" strokeWidth={1.5} fill="none"/>
      <circle cx={124} cy={102} r={4} fill="#2E4540" opacity={0.7}/>
      <circle cx={124} cy={102} r={2} fill="#0B0909"/>
      <circle cx={126} cy={100} r={1.5} fill="#B5B9F0" opacity={0.8}/>
      <ellipse cx={156} cy={102} rx={10} ry={6} fill="#2E4540" opacity={0.15}/>
      <ellipse cx={156} cy={102} rx={10} ry={6} stroke="#2E4540" strokeWidth={1.5} fill="none"/>
      <circle cx={156} cy={102} r={4} fill="#2E4540" opacity={0.7}/>
      <circle cx={156} cy={102} r={2} fill="#0B0909"/>
      <circle cx={158} cy={100} r={1.5} fill="#B5B9F0" opacity={0.8}/>
      {/* nose */}
      <path d="M140 108 L134 125 Q140 128 146 125 L140 108Z" stroke="#2E4540" strokeWidth={1} fill="none" opacity={0.5}/>
      <path d="M134 125 Q140 130 146 125" stroke="#2E4540" strokeWidth={1.2} strokeLinecap="round" fill="none" opacity={0.6}/>
      {/* lips */}
      <path d="M128 140 Q140 136 152 140" stroke="#2E4540" strokeWidth={1.5} strokeLinecap="round" fill="none"/>
      <path d="M128 140 Q140 148 152 140" stroke="#2E4540" strokeWidth={1} strokeLinecap="round" fill="none" opacity={0.6}/>
      <path d="M133 140 Q140 137 147 140" fill="#408175" opacity={0.3}/>
      {/* cheek blush */}
      <ellipse cx={108} cy={120} rx={12} ry={7} fill="#408175" opacity={0.1}/>
      <ellipse cx={172} cy={120} rx={12} ry={7} fill="#408175" opacity={0.1}/>
      {/* hatching shadows */}
      {[0,4,8].map(i=>(
        <line key={i} x1={92+i} y1={120+i*2} x2={88+i} y2={145+i} stroke="#2E4540" strokeWidth={0.7} opacity={0.25}/>
      ))}
      {/* pencil signature mark */}
      <path d="M240 195 L250 185 L255 190 L245 200Z" fill="#408175" opacity={0.5}/>
      <line x1={240} y1={195} x2={225} y2={210} stroke="#2E4540" strokeWidth={1.5} opacity={0.4}/>
    </svg>
  );
}

// Painting 3: Landscape watercolour — mountains, lake reflection
function PaintingLandscape({ w = 280, h = 220, dark }) {
  const sky = dark ? "#0B0909" : "#e8eef5";
  return (
    <svg width={w} height={h} viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width={280} height={220} fill={sky} rx={4}/>
      {/* sky wash */}
      <rect width={280} height={130} fill="#B5B9F0" opacity={dark ? 0.08 : 0.25} rx={4}/>
      {/* sun/moon glow */}
      <circle cx={220} cy={45} r={22} fill="#B5B9F0" opacity={0.3}/>
      <circle cx={220} cy={45} r={14} fill="#B5B9F0" opacity={0.5}/>
      <circle cx={220} cy={45} r={8} fill="#B5B9F0" opacity={0.8}/>
      {/* distant mountains */}
      <path d="M0 130 L40 65 L80 100 L120 50 L165 90 L200 55 L240 85 L280 60 L280 130Z" fill="#2E4540" opacity={0.5}/>
      <path d="M0 130 L40 65 L80 100 L120 50 L165 90 L200 55 L240 85 L280 60 L280 130Z" fill="#408175" opacity={0.15}/>
      {/* snow caps */}
      <path d="M120 50 L110 70 L130 70Z" fill="#B5B9F0" opacity={0.6}/>
      <path d="M200 55 L192 72 L208 72Z" fill="#B5B9F0" opacity={0.5}/>
      {/* foreground hills */}
      <path d="M0 155 Q60 120 120 140 Q180 160 280 130 L280 220 L0 220Z" fill="#2E4540" opacity={0.75}/>
      {/* lake / water */}
      <path d="M30 158 Q140 148 250 158 L250 220 L30 220Z" fill="#408175" opacity={0.3}/>
      <path d="M30 158 Q140 148 250 158 L250 220 L30 220Z" fill="#B5B9F0" opacity={0.07}/>
      {/* water ripples */}
      <ellipse cx={140} cy={185} rx={60} ry={4} stroke="#B5B9F0" strokeWidth={0.8} fill="none" opacity={0.35}/>
      <ellipse cx={140} cy={195} rx={80} ry={4} stroke="#B5B9F0" strokeWidth={0.6} fill="none" opacity={0.25}/>
      <ellipse cx={140} cy={205} rx={95} ry={4} stroke="#B5B9F0" strokeWidth={0.5} fill="none" opacity={0.2}/>
      {/* mountain reflection */}
      <path d="M60 158 L80 185 L100 168 L120 185 L140 165 L140 220 L60 220Z" fill="#2E4540" opacity={0.2}/>
      {/* foreground trees */}
      <rect x={45} y={130} width={4} height={30} fill="#0B0909" opacity={0.7}/>
      <path d="M47 130 L30 155 L64 155Z" fill="#2E4540" opacity={0.9}/>
      <path d="M47 118 L34 140 L60 140Z" fill="#408175" opacity={0.8}/>
      <rect x={230} y={125} width={4} height={35} fill="#0B0909" opacity={0.7}/>
      <path d="M232 125 L215 150 L249 150Z" fill="#2E4540" opacity={0.9}/>
      <path d="M232 113 L218 135 L246 135Z" fill="#408175" opacity={0.8}/>
      {/* birds */}
      <path d="M145 38 Q148 35 151 38" stroke="#2E4540" strokeWidth={1} fill="none" opacity={0.5}/>
      <path d="M160 28 Q163 25 166 28" stroke="#2E4540" strokeWidth={1} fill="none" opacity={0.4}/>
      <path d="M130 32 Q133 29 136 32" stroke="#2E4540" strokeWidth={1} fill="none" opacity={0.3}/>
      {/* watercolour bleed marks */}
      <ellipse cx={80} cy={100} rx={25} ry={15} fill="#408175" opacity={0.06}/>
      <ellipse cx={200} cy={80} rx={20} ry={12} fill="#B5B9F0" opacity={0.08}/>
    </svg>
  );
}

// Painting 4: Abstract acrylic — dynamic strokes, bold composition
function PaintingAbstract({ w = 280, h = 220, dark }) {
  return (
    <svg width={w} height={h} viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width={280} height={220} fill={dark ? "#0B0909" : "#f8f5f0"} rx={4}/>
      {/* large background shape */}
      <ellipse cx={200} cy={80} rx={120} ry={90} fill="#2E4540" opacity={0.4} transform="rotate(-20 200 80)"/>
      {/* sweeping arc strokes */}
      <path d="M-10 180 Q80 60 200 40 Q260 30 290 80" stroke="#408175" strokeWidth={28} strokeLinecap="round" fill="none" opacity={0.5}/>
      <path d="M-10 200 Q90 100 180 80 Q240 65 290 100" stroke="#B5B9F0" strokeWidth={18} strokeLinecap="round" fill="none" opacity={0.35}/>
      {/* diagonal slabs */}
      <path d="M60 0 L140 0 L80 220 L0 220Z" fill="#2E4540" opacity={0.25}/>
      <path d="M160 0 L220 0 L280 110 L210 110Z" fill="#408175" opacity={0.2}/>
      {/* bold organic blobs */}
      <circle cx={85} cy={85} r={45} fill="#408175" opacity={0.5}/>
      <circle cx={85} cy={85} r={30} fill="#2E4540" opacity={0.6}/>
      <circle cx={85} cy={85} r={15} fill="#B5B9F0" opacity={0.5}/>
      {/* texture dashes */}
      {[0,12,24,36,48].map(i=>(
        <rect key={i} x={180+i*4} y={150+i} width={14} height={4} rx={2} fill="#B5B9F0" opacity={0.25} transform={`rotate(${i*3} ${187+i*4} ${152+i})`}/>
      ))}
      {/* splatter dots */}
      {[[40,170,4],[55,195,3],[65,178,2],[35,182,3],[50,208,2],[200,170,5],[215,185,3],[225,175,4]].map(([x,y,r],i)=>(
        <circle key={i} cx={x} cy={y} r={r} fill="#B5B9F0" opacity={0.4}/>
      ))}
      {/* impasto ridges */}
      <path d="M150 30 Q200 50 230 30" stroke="#B5B9F0" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.4}/>
      <path d="M160 45 Q210 65 240 45" stroke="#B5B9F0" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.25}/>
      {/* contrast block */}
      <rect x={0} y={0} width={50} height={50} fill="#0B0909" opacity={0.5}/>
      <line x1={0} y1={0} x2={50} y2={50} stroke="#408175" strokeWidth={2} opacity={0.6}/>
    </svg>
  );
}

// Painting 5: Sculpture — Greek bust, dramatic lighting
function PaintingSculpture({ w = 280, h = 220, dark }) {
  const bg = dark ? "#0B0909" : "#f2ede8";
  return (
    <svg width={w} height={h} viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width={280} height={220} fill={bg} rx={4}/>
      {/* pedestal */}
      <rect x={90} y={175} width={100} height={14} rx={3} fill="#2E4540" opacity={0.7}/>
      <rect x={80} y={185} width={120} height={10} rx={3} fill="#2E4540" opacity={0.55}/>
      <rect x={70} y={193} width={140} height={8} rx={3} fill="#2E4540" opacity={0.4}/>
      {/* shoulders/chest */}
      <path d="M80 175 L80 148 Q100 138 140 136 Q180 138 200 148 L200 175Z" fill="#B5B9F0" opacity={0.3}/>
      <path d="M80 175 L80 148 Q100 138 140 136 Q180 138 200 148 L200 175Z" stroke="#2E4540" strokeWidth={1} fill="none" opacity={0.4}/>
      {/* drape/toga fold lines */}
      <path d="M80 160 Q110 155 140 158" stroke="#2E4540" strokeWidth={0.8} fill="none" opacity={0.35}/>
      <path d="M200 155 Q170 150 150 154" stroke="#2E4540" strokeWidth={0.8} fill="none" opacity={0.35}/>
      {/* neck */}
      <rect x={126} y={120} width={28} height={20} rx={8} fill="#B5B9F0" opacity={0.3}/>
      <rect x={126} y={120} width={28} height={20} rx={8} stroke="#2E4540" strokeWidth={1} fill="none" opacity={0.35}/>
      {/* head */}
      <ellipse cx={140} cy={95} rx={44} ry={52} fill="#B5B9F0" opacity={0.28}/>
      <ellipse cx={140} cy={95} rx={44} ry={52} stroke="#2E4540" strokeWidth={1.5} fill="none" opacity={0.55}/>
      {/* hair / crown */}
      <path d="M96 80 Q98 50 115 38 Q128 30 140 29 Q152 30 165 38 Q182 50 184 80" fill="#2E4540" opacity={0.55}/>
      {/* laurel hints */}
      <path d="M96 78 Q94 72 100 68 Q106 72 104 78Z" fill="#408175" opacity={0.6}/>
      <path d="M184 78 Q186 72 180 68 Q174 72 176 78Z" fill="#408175" opacity={0.6}/>
      {/* brow ridge */}
      <path d="M108 78 Q124 72 140 74 Q156 72 172 78" stroke="#2E4540" strokeWidth={2} fill="none" opacity={0.5}/>
      {/* eyes (sculptural — no iris fill) */}
      <ellipse cx={124} cy={88} rx={10} ry={6} stroke="#2E4540" strokeWidth={1.5} fill="none" opacity={0.6}/>
      <ellipse cx={124} cy={88} rx={5} ry={3} fill="#2E4540" opacity={0.2}/>
      <ellipse cx={156} cy={88} rx={10} ry={6} stroke="#2E4540" strokeWidth={1.5} fill="none" opacity={0.6}/>
      <ellipse cx={156} cy={88} rx={5} ry={3} fill="#2E4540" opacity={0.2}/>
      {/* nose bridge */}
      <path d="M140 84 L136 105 Q140 108 144 105 L140 84Z" stroke="#2E4540" strokeWidth={1} fill="none" opacity={0.45}/>
      {/* lips */}
      <path d="M128 118 Q140 114 152 118 Q140 126 128 118Z" stroke="#2E4540" strokeWidth={1} fill="none" opacity={0.45}/>
      {/* chin */}
      <path d="M120 125 Q140 138 160 125" stroke="#2E4540" strokeWidth={1} fill="none" opacity={0.4}/>
      {/* chisel shadow marks */}
      <path d="M96 95 Q100 90 98 100" stroke="#2E4540" strokeWidth={0.8} fill="none" opacity={0.3}/>
      {/* dramatic side lighting */}
      <rect x={0} y={0} width={70} height={220} fill="#0B0909" opacity={0.15} rx={4}/>
      <rect x={220} y={0} width={60} height={220} fill="#2E4540" opacity={0.1} rx={4}/>
      {/* highlight */}
      <ellipse cx={155} cy={75} rx={8} ry={15} fill="#B5B9F0" opacity={0.18} transform="rotate(-10 155 75)"/>
    </svg>
  );
}

// Painting 6: Ink Art — calligraphic line drawing, lotus/crane
function PaintingInkArt({ w = 280, h = 220, dark }) {
  return (
    <svg width={w} height={h} viewBox="0 0 280 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width={280} height={220} fill={dark ? "#0B0909" : "#f8f4ec"} rx={4}/>
      {/* ink wash bleed background */}
      <ellipse cx={140} cy={110} rx={110} ry={80} fill="#2E4540" opacity={0.07}/>
      <ellipse cx={140} cy={140} rx={90} ry={50} fill="#408175" opacity={0.06}/>
      {/* lotus leaves */}
      <ellipse cx={70} cy={185} rx={50} ry={16} fill="#2E4540" opacity={0.5} transform="rotate(-10 70 185)"/>
      <ellipse cx={200} cy={188} rx={45} ry={13} fill="#2E4540" opacity={0.4} transform="rotate(8 200 188)"/>
      <ellipse cx={140} cy={190} rx={55} ry={14} fill="#408175" opacity={0.4}/>
      {/* water line */}
      <path d="M0 185 Q70 178 140 183 Q210 188 280 180" stroke="#408175" strokeWidth={1.5} fill="none" opacity={0.4}/>
      {/* lotus stem */}
      <path d="M140 183 Q138 160 140 130" stroke="#2E4540" strokeWidth={2} strokeLinecap="round" fill="none" opacity={0.7}/>
      {/* lotus flower petals */}
      <path d="M140 130 Q128 110 130 95 Q140 105 140 130Z" fill="#B5B9F0" opacity={0.6}/>
      <path d="M140 130 Q152 110 150 95 Q140 105 140 130Z" fill="#B5B9F0" opacity={0.6}/>
      <path d="M140 130 Q120 115 118 100 Q132 108 140 130Z" fill="#B5B9F0" opacity={0.45}/>
      <path d="M140 130 Q160 115 162 100 Q148 108 140 130Z" fill="#B5B9F0" opacity={0.45}/>
      <path d="M140 130 Q118 125 115 112 Q128 118 140 130Z" fill="#408175" opacity={0.4}/>
      <path d="M140 130 Q162 125 165 112 Q152 118 140 130Z" fill="#408175" opacity={0.4}/>
      {/* lotus center */}
      <circle cx={140} cy={118} r={8} fill="#2E4540" opacity={0.6}/>
      <circle cx={140} cy={118} r={4} fill="#408175" opacity={0.7}/>
      <circle cx={140} cy={118} r={2} fill="#B5B9F0" opacity={0.8}/>
      {/* crane bird */}
      <path d="M190 65 Q205 55 215 60 Q210 70 195 72Z" fill="#2E4540" opacity={0.7}/>
      <path d="M185 72 Q195 60 215 60 Q205 75 185 72Z" fill="#2E4540" opacity={0.5}/>
      {/* body */}
      <ellipse cx={195} cy={78} rx={12} ry={8} fill="#B5B9F0" opacity={0.7} transform="rotate(-15 195 78)"/>
      {/* neck + head */}
      <path d="M190 72 Q186 60 188 52" stroke="#2E4540" strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.7}/>
      <ellipse cx={188} cy={49} rx={5} ry={4} fill="#2E4540" opacity={0.65}/>
      <line x1={190} y1={48} x2={198} y2={44} stroke="#2E4540" strokeWidth={1.5} strokeLinecap="round" opacity={0.7}/>
      {/* legs */}
      <line x1={195} y1={84} x2={193} y2={110} stroke="#2E4540" strokeWidth={1.2} opacity={0.5}/>
      <line x1={200} y1={84} x2={202} y2={110} stroke="#2E4540" strokeWidth={1.2} opacity={0.5}/>
      {/* feet */}
      <path d="M193 110 L188 115 M193 110 L193 116 M193 110 L198 115" stroke="#2E4540" strokeWidth={1} opacity={0.4}/>
      <path d="M202 110 L197 115 M202 110 L202 116 M202 110 L207 115" stroke="#2E4540" strokeWidth={1} opacity={0.4}/>
      {/* calligraphy brushstroke accents */}
      <path d="M30 50 Q50 30 60 55" stroke="#2E4540" strokeWidth={3} strokeLinecap="round" fill="none" opacity={0.35}/>
      <path d="M32 55 Q55 65 58 50" stroke="#2E4540" strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.2}/>
      <path d="M245 160 Q255 145 260 165" stroke="#408175" strokeWidth={2.5} strokeLinecap="round" fill="none" opacity={0.4}/>
      {/* ink dots */}
      {[[45,80,2.5],[248,130,2],[55,150,1.5],[255,95,2],[240,200,3]].map(([x,y,r],i)=>(
        <circle key={i} cx={x} cy={y} r={r} fill="#2E4540" opacity={0.4}/>
      ))}
    </svg>
  );
}

// Hero painting — large decorative canvas for hero section
function HeroPainting({ dark }) {
  const bg = dark ? "#0d0b0b" : "#f5f0ea";
  return (
    <svg width="100%" height="100%" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* outer frame */}
      <rect x={12} y={12} width={396} height={396} rx={8} fill={bg}/>
      <rect x={12} y={12} width={396} height={396} rx={8} stroke="#408175" strokeWidth={1} opacity={0.3}/>
      <rect x={22} y={22} width={376} height={376} rx={6} stroke="#2E4540" strokeWidth={0.5} fill="none" opacity={0.4}/>

      {/* background wash - sky */}
      <rect x={22} y={22} width={376} height={200} fill="#B5B9F0" opacity={dark ? 0.06 : 0.18} rx={6}/>
      {/* ground */}
      <rect x={22} y={222} width={376} height={176} fill="#2E4540" opacity={0.15} rx={6}/>

      {/* sun glow */}
      <circle cx={340} cy={80} r={35} fill="#B5B9F0" opacity={0.2}/>
      <circle cx={340} cy={80} r={22} fill="#B5B9F0" opacity={0.35}/>
      <circle cx={340} cy={80} r={12} fill="#B5B9F0" opacity={0.6}/>

      {/* distant mountains */}
      <path d="M22 230 L80 130 L135 175 L195 100 L255 155 L310 105 L370 140 L398 115 L398 230Z" fill="#2E4540" opacity={0.55}/>
      <path d="M22 230 L80 130 L135 175 L195 100 L255 155 L310 105 L370 140 L398 115 L398 230Z" fill="#408175" opacity={0.15}/>

      {/* snow peaks */}
      <path d="M195 100 L183 128 L207 128Z" fill="#B5B9F0" opacity={0.7}/>
      <path d="M310 105 L299 130 L321 130Z" fill="#B5B9F0" opacity={0.55}/>

      {/* lake/river */}
      <path d="M22 295 Q140 270 210 282 Q290 294 398 270 L398 398 L22 398Z" fill="#408175" opacity={0.22}/>
      <path d="M22 295 Q140 270 210 282 Q290 294 398 270 L398 398 L22 398Z" fill="#B5B9F0" opacity={0.06}/>

      {/* water shimmer */}
      {[310, 325, 340, 355].map((y, i) => (
        <path key={i} d={`M60 ${y} Q210 ${y-8} 360 ${y}`} stroke="#B5B9F0" strokeWidth={0.7} fill="none" opacity={0.2}/>
      ))}

      {/* foreground grass/hills */}
      <path d="M22 340 Q100 310 180 330 Q260 350 340 320 Q370 310 398 325 L398 398 L22 398Z" fill="#2E4540" opacity={0.65}/>

      {/* large tree left */}
      <rect x={68} y={240} width={6} height={100} fill="#0B0909" opacity={0.7}/>
      <path d="M71 240 L40 290 L102 290Z" fill="#2E4540" opacity={0.9}/>
      <path d="M71 218 L44 262 L98 262Z" fill="#408175" opacity={0.8}/>
      <path d="M71 202 L50 240 L92 240Z" fill="#2E4540" opacity={0.7}/>

      {/* tree right */}
      <rect x={342} y={248} width={6} height={90} fill="#0B0909" opacity={0.7}/>
      <path d="M345 248 L315 295 L375 295Z" fill="#2E4540" opacity={0.85}/>
      <path d="M345 228 L320 268 L370 268Z" fill="#408175" opacity={0.75}/>

      {/* small foreground wildflowers */}
      {[[100,355,8],[130,362,6],[160,350,7],[240,360,6],[270,355,8],[300,365,5]].map(([x,y,r],i)=>(
        <g key={i}>
          <line x1={x} y1={y} x2={x} y2={y-r*2} stroke="#408175" strokeWidth={1} opacity={0.5}/>
          <circle cx={x} cy={y-r*2-2} r={r/2+1} fill={i%2===0?"#B5B9F0":"#408175"} opacity={0.7}/>
        </g>
      ))}

      {/* birds */}
      {[[180,60],[200,52],[165,68],[220,65]].map(([x,y],i)=>(
        <path key={i} d={`M${x} ${y} Q${x+5} ${y-5} ${x+10} ${y}`} stroke="#2E4540" strokeWidth={1} fill="none" opacity={0.35}/>
      ))}

      {/* foreground lotus on lake */}
      <path d="M210 285 Q200 268 202 255 Q210 264 210 285Z" fill="#B5B9F0" opacity={0.5}/>
      <path d="M210 285 Q220 268 218 255 Q210 264 210 285Z" fill="#B5B9F0" opacity={0.5}/>
      <path d="M210 285 Q195 272 193 260 Q204 267 210 285Z" fill="#408175" opacity={0.4}/>
      <path d="M210 285 Q225 272 227 260 Q216 267 210 285Z" fill="#408175" opacity={0.4}/>
      <circle cx={210} cy={268} r={6} fill="#2E4540" opacity={0.5}/>
      <circle cx={210} cy={268} r={3} fill="#B5B9F0" opacity={0.7}/>
      <line x1={210} y1={285} x2={210} y2={300} stroke="#2E4540" strokeWidth={1.5} opacity={0.5}/>

      {/* corner decorative elements */}
      <path d="M22 22 L42 22 L22 42Z" fill="#408175" opacity={0.2}/>
      <path d="M398 22 L378 22 L398 42Z" fill="#408175" opacity={0.2}/>
      <path d="M22 398 L22 378 L42 398Z" fill="#408175" opacity={0.2}/>
      <path d="M398 398 L398 378 L378 398Z" fill="#408175" opacity={0.2}/>
    </svg>
  );
}

/* ─── HERO ILLUSTRATION — sunlit studio with easel & painting ── */
function HeroIllustration({ dark }) {
  const bg1 = dark ? "#101513" : "#f4f7f5";
  const bg2 = dark ? "#16201d" : "#e8f1ed";
  const wall = dark ? "#17201e" : "#f3f1ed";
  const floor = dark ? "#101412" : "#d8e4df";
  const shadow = dark ? "rgba(0,0,0,0.55)" : "rgba(120,80,40,0.13)";
  return (
    <svg width="100%" height="100%" viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
      <defs>
        <radialGradient id="winGlow" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor={dark?"#263b35":"#ffffff"} stopOpacity="1"/>
          <stop offset="58%" stopColor={dark?"#1d2d29":"#eef5f2"} stopOpacity="1"/>
          <stop offset="100%" stopColor={bg1} stopOpacity="1"/>
        </radialGradient>
        <radialGradient id="canvasGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#d4edff" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#b8d8f0" stopOpacity="0.7"/>
        </radialGradient>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={dark?"#1a2421":"#dce8e3"}/>
          <stop offset="100%" stopColor={dark?"#101513":"#c5d8d1"}/>
        </linearGradient>
        <linearGradient id="easelWood" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a4e28"/>
          <stop offset="100%" stopColor="#9c6535"/>
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>

      {/* ── BACKGROUND — warm sunlit room ── */}
      <rect width={420} height={420} fill="url(#winGlow)" rx={34}/>
      {/* Wall */}
      <rect x={0} y={0} width={420} height={290} fill={wall} opacity={0.48} rx={34}/>
      {/* Floor */}
      <rect x={0} y={290} width={420} height={130} fill="url(#floorGrad)" rx={4}/>
      {/* Floor highlight strip */}
      <rect x={0} y={290} width={420} height={6} fill={dark?"#2a2010":"#c9ae88"} opacity={0.5}/>
      {/* Baseboard */}
      <rect x={0} y={374} width={420} height={14} fill={dark?"#111":"#d4b88a"} opacity={0.6}/>

      {/* ── WINDOW — large, letting in golden light ── */}
      <rect x={245} y={18} width={155} height={200} rx={10} fill={dark?"#1a2030":"#c8e8ff"} opacity={dark?0.5:0.75}/>
      {/* Window frame */}
      <rect x={245} y={18} width={155} height={200} rx={10} fill="none" stroke={dark?"#3a3020":"#c8a870"} strokeWidth={5}/>
      {/* Window dividers */}
      <line x1={322} y1={18} x2={322} y2={218} stroke={dark?"#3a3020":"#c8a870"} strokeWidth={4}/>
      <line x1={245} y1={118} x2={400} y2={118} stroke={dark?"#3a3020":"#c8a870"} strokeWidth={4}/>
      {/* Window inner panes */}
      <rect x={250} y={23} width={67} height={90} rx={3} fill={dark?"#1a2838":"#d8f0ff"} opacity={dark?0.4:0.7}/>
      <rect x={327} y={23} width={68} height={90} rx={3} fill={dark?"#1a2838":"#e0f4ff"} opacity={dark?0.4:0.65}/>
      <rect x={250} y={123} width={67} height={90} rx={3} fill={dark?"#1a2838":"#d0ecff"} opacity={dark?0.35:0.6}/>
      <rect x={327} y={123} width={68} height={90} rx={3} fill={dark?"#1a2838":"#daf2ff"} opacity={dark?0.35:0.55}/>
      {/* Light rays from window */}
      <path d="M400 18 L420 0 L420 90 L400 218" fill={dark?"#2a2510":"#fff8e0"} opacity={dark?0.04:0.18}/>
      <path d="M320 18 L380 0 L420 0 L420 30 L320 218" fill={dark?"#2a2510":"#fffbe8"} opacity={dark?0.03:0.12}/>

      {/* ── POTTED PLANT — right window sill ── */}
      {/* Pot */}
      <path d="M356 208 Q346 208 343 218 L339 238 L381 238 L377 218 Q374 208 364 208Z" fill={dark?"#5a3a1a":"#c8855a"} opacity={0.9}/>
      <rect x={340} y={205} width={28} height={6} rx={3} fill={dark?"#6a4a2a":"#d4956a"}/>
      {/* Soil */}
      <ellipse cx={354} cy={208} rx={14} ry={4} fill={dark?"#2a1a08":"#6b3d1e"} opacity={0.8}/>
      {/* Stems */}
      <path d="M354 208 Q348 180 340 160" stroke={dark?"#2a4a22":"#4a8a3a"} strokeWidth={2.5} strokeLinecap="round" fill="none"/>
      <path d="M354 208 Q358 178 370 155" stroke={dark?"#2a4a22":"#4a8a3a"} strokeWidth={2.5} strokeLinecap="round" fill="none"/>
      <path d="M354 208 Q354 185 354 165" stroke={dark?"#2a4a22":"#3a7a2a"} strokeWidth={2} strokeLinecap="round" fill="none"/>
      {/* Leaves — lush monstera style */}
      <path d="M340 160 Q328 148 332 134 Q344 128 352 140 Q356 134 352 124 Q362 120 366 132 Q370 126 376 132 Q378 144 366 150 Q354 156 340 160Z" fill={dark?"#2a5a28":"#5aaa48"} opacity={0.9}/>
      <path d="M370 155 Q382 140 390 145 Q392 158 380 162 Q372 164 370 155Z" fill={dark?"#2a5a28":"#4a9a38"} opacity={0.85}/>
      {/* Leaf veins */}
      <path d="M344 154 Q340 142 346 134" stroke={dark?"#1a4a18":"#3a8a2a"} strokeWidth={0.8} fill="none" opacity={0.6}/>
      <path d="M358 152 Q360 140 358 130" stroke={dark?"#1a4a18":"#3a8a2a"} strokeWidth={0.8} fill="none" opacity={0.6}/>

      {/* ── LARGE POTTED PLANT — left corner ── */}
      {/* Big pot */}
      <path d="M22 310 Q12 310 10 325 L6 388 L76 388 L72 325 Q70 310 60 310Z" fill={dark?"#5a3018":"#b87040"} opacity={0.9}/>
      <rect x={6} y={306} width={70} height={8} rx={4} fill={dark?"#6a4020":"#c88050"}/>
      {/* Soil */}
      <ellipse cx={41} cy={310} rx={35} ry={6} fill={dark?"#1a0e04":"#5a2e0e"} opacity={0.85}/>
      {/* Main stems */}
      <path d="M41 310 Q30 270 15 230" stroke={dark?"#2a5020":"#408030"} strokeWidth={4} strokeLinecap="round" fill="none"/>
      <path d="M41 310 Q55 265 72 215" stroke={dark?"#2a5020":"#408030"} strokeWidth={4} strokeLinecap="round" fill="none"/>
      <path d="M41 310 Q38 258 28 200" stroke={dark?"#2a5020":"#357025"} strokeWidth={3} strokeLinecap="round" fill="none"/>
      <path d="M41 310 Q44 250 58 190" stroke={dark?"#2a5020":"#458030"} strokeWidth={3} strokeLinecap="round" fill="none"/>
      {/* Large leaves */}
      <path d="M15 230 Q-5 210 0 190 Q14 175 28 190 Q30 178 26 165 Q40 158 46 175 Q50 162 60 168 Q65 182 52 195 Q38 208 15 230Z" fill={dark?"#1e4a1a":"#50a040"} opacity={0.88}/>
      <path d="M72 215 Q90 195 92 178 Q82 160 66 170 Q64 158 72 148 Q86 148 90 162 Q96 152 104 162 Q108 178 96 190 Q84 202 72 215Z" fill={dark?"#224e1e":"#5aaa44"} opacity={0.85}/>
      <path d="M28 200 Q10 185 8 165 Q18 148 30 160 Q32 145 28 132 Q42 125 50 140 Q54 128 64 135 Q68 150 56 162 Q44 174 28 200Z" fill={dark?"#1e4a1a":"#48983a"} opacity={0.82}/>
      <path d="M58 190 Q80 175 86 155 Q76 138 60 148 Q58 135 66 122 Q80 122 82 138 Q88 125 98 132 Q100 148 88 160 Q74 172 58 190Z" fill={dark?"#224e1e":"#54a83e"} opacity={0.80}/>

      {/* ── EASEL — detailed wooden ── */}
      {/* Left leg */}
      <line x1={148} y1={88} x2={100} y2={340} stroke="url(#easelWood)" strokeWidth={9} strokeLinecap="round"/>
      {/* Right leg */}
      <line x1={208} y1={88} x2={248} y2={340} stroke="url(#easelWood)" strokeWidth={9} strokeLinecap="round"/>
      {/* Back support leg */}
      <line x1={180} y1={105} x2={172} y2={345} stroke="#9c6535" strokeWidth={6} strokeLinecap="round" opacity={0.55}/>
      {/* Cross bar */}
      <line x1={112} y1={265} x2={238} y2={265} stroke="#9c6535" strokeWidth={7} strokeLinecap="round"/>
      {/* Top rail */}
      <line x1={142} y1={94} x2={218} y2={94} stroke="#9c6535" strokeWidth={7} strokeLinecap="round"/>
      {/* Canvas ledge */}
      <rect x={138} y={258} width={88} height={10} rx={3} fill="#7a4e28" opacity={0.9}/>
      {/* Easel feet shadows */}
      <ellipse cx={100} cy={340} rx={8} ry={3} fill={shadow}/>
      <ellipse cx={248} cy={340} rx={8} ry={3} fill={shadow}/>
      <ellipse cx={172} cy={345} rx={6} ry={2.5} fill={shadow}/>

      {/* ── CANVAS — large painting of blossoming tree ── */}
      {/* Canvas outer frame */}
      <rect x={136} y={92} width={92} height={168} rx={5} fill={dark?"#2a1e10":"#f5e8ce"} stroke="#7a4e28" strokeWidth={4}/>
      {/* Canvas surface */}
      <rect x={141} y={97} width={82} height={158} rx={3} fill={dark?"#1a1208":"#fffdf5"}/>
      {/* Sky gradient on canvas */}
      <rect x={141} y={97} width={82} height={75} rx={2} fill="#a8d4f0" opacity={dark?0.5:0.85}/>
      <rect x={141} y={140} width={82} height={32} rx={0} fill="#c8eaff" opacity={dark?0.35:0.6}/>
      {/* Ground */}
      <path d="M141 172 Q160 165 182 168 Q200 165 223 170 L223 255 L141 255Z" fill={dark?"#1a3010":"#7abf55"} opacity={dark?0.7:0.85}/>
      {/* Path on ground */}
      <path d="M175 255 Q178 225 182 200" stroke={dark?"#2a4a18":"#c8a870"} strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.7}/>
      {/* Tree trunk */}
      <rect x={177} y={150} width={8} height={52} rx={3} fill={dark?"#4a2a0a":"#6b3d1e"} opacity={0.95}/>
      <path d="M177 175 Q168 170 162 165" stroke={dark?"#4a2a0a":"#6b3d1e"} strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.8}/>
      <path d="M185 168 Q194 162 200 156" stroke={dark?"#4a2a0a":"#6b3d1e"} strokeWidth={3.5} strokeLinecap="round" fill="none" opacity={0.8}/>
      {/* Blossoms — pink cherry clusters */}
      {[
        [182,138,22,"#f4a0b8",0.9],[165,130,16,"#f8c0d0",0.85],[200,128,15,"#f0b0c8",0.8],
        [175,120,13,"#f8c8d8",0.85],[192,118,12,"#f4a8c0",0.8],[182,112,14,"#fcd0e0",0.78],
        [158,140,12,"#f8b8cc",0.75],[208,138,11,"#f0a8c0",0.75],[170,108,10,"#fcc8d8",0.7],
        [197,106,10,"#f4b0c4",0.7],[162,150,10,"#f8c0d0",0.72],[204,148,9,"#f0b8cc",0.7]
      ].map(([cx,cy,r,fill,op],i)=>(
        <circle key={`bl${i}`} cx={cx} cy={cy} r={r} fill={fill} opacity={dark?op*0.5:op}/>
      ))}
      {/* Fallen petals on ground */}
      {[[150,240,4],[160,248,3.5],[170,244,3],[195,250,4],[210,242,3.5]].map(([cx,cy,r],i)=>(
        <ellipse key={`p${i}`} cx={cx} cy={cy} rx={r} ry={r*0.6} fill="#f8c0d0" opacity={dark?0.3:0.6} transform={`rotate(${i*25} ${cx} ${cy})`}/>
      ))}
      {/* Small house in background on canvas */}
      <rect x={155} y={182} width={12} height={10} rx={1} fill={dark?"#304825":"#ff8060"} opacity={0.75}/>
      <path d="M153 182 L161 174 L169 182Z" fill={dark?"#243818":"#e05040"} opacity={0.8}/>
      {/* Canvas texture lines */}
      {[100,120,140,160,180,200,220,240].map((y,i)=>(
        <line key={`ct${i}`} x1={141} y1={y} x2={223} y2={y} stroke={dark?"#2a2010":"#d4c0a0"} strokeWidth={0.3} opacity={0.3}/>
      ))}

      {/* ── PAINT BRUSH JAR — foreground left ── */}
      {/* Mug body */}
      <path d="M52 318 Q48 320 48 360 L48 375 Q48 382 56 382 L88 382 Q96 382 96 375 L96 360 Q96 320 92 318Z" fill={dark?"#2a2018":"#ffffff"} stroke={dark?"#4a3828":"#d4c0a0"} strokeWidth={2}/>
      {/* Mug handle */}
      <path d="M96 335 Q112 335 112 352 Q112 368 96 368" stroke={dark?"#4a3828":"#d4c0a0"} strokeWidth={3} fill="none" strokeLinecap="round"/>
      {/* Brushes in jar */}
      {[
        {x:58,c:"#8B5E3C",bc:"#FF6B6B",a:-8},
        {x:64,c:"#7a4e28",bc:"#FFD93D",a:2},
        {x:70,c:"#9c6535",bc:"#6BCB77",a:10},
        {x:76,c:"#8B5E3C",bc:"#4D96FF",a:-3},
        {x:82,c:"#7a4e28",bc:"#C77DFF",a:6},
      ].map(({x,c,bc,a},i)=>(
        <g key={`br${i}`} transform={`rotate(${a} ${x} 350)`}>
          <rect x={x-1.5} y={260} width={3} height={62} rx={1.5} fill={c}/>
          <rect x={x-2} y={256} width={4} height={7} rx={1} fill="#9a9a9a"/>
          <ellipse cx={x} cy={256} rx={3} ry={8} fill={bc} opacity={0.9}/>
        </g>
      ))}

      {/* ── WATERCOLOR PALETTE — foreground right ── */}
      {/* Palette body */}
      <rect x={270} y={338} width={120} height={64} rx={10} fill={dark?"#2a2018":"#f8f0e8"} stroke={dark?"#4a3828":"#c8a870"} strokeWidth={2}/>
      {/* Paint wells */}
      {[
        [283,350,"#FF6B6B"],[301,350,"#FF9F43"],[319,350,"#FFD93D"],[337,350,"#6BCB77"],
        [355,350,"#4D96FF"],[373,350,"#C77DFF"],[391,350,"#FF6B6B"],
        [283,368,"#2C3E50"],[301,368,"#F8C0D0"],[319,368,"#ffffff"],[337,368,"#8B5E3C"],
        [355,368,"#E74C3C"],[373,368,"#27AE60"],[391,368,"#2980B9"],
      ].map(([cx,cy,fill],i)=>(
        <circle key={`pw${i}`} cx={cx} cy={cy} r={7} fill={fill} stroke={dark?"#3a2a18":"#d4c0a0"} strokeWidth={1} opacity={dark?0.7:0.9}/>
      ))}
      {/* Palette thumb hole */}
      <ellipse cx={280} cy={390} rx={16} ry={9} fill={dark?"#1a1208":"#e8d8c0"} stroke={dark?"#4a3828":"#c8a870"} strokeWidth={1.5}/>

      {/* ── PAINT TUBES scattered ── */}
      {[
        {x:108,y:355,r:-15,w:14,h:50,col:"#FF6B6B",cap:"#C0392B"},
        {x:126,y:360,r:8,w:12,h:44,col:"#FFD93D",cap:"#F39C12"},
        {x:100,y:350,r:-28,w:12,h:46,col:"#4D96FF",cap:"#2980B9"},
      ].map(({x,y,r,w,h,col,cap},i)=>(
        <g key={`tb${i}`} transform={`rotate(${r} ${x} ${y})`}>
          <rect x={x-w/2} y={y-h} width={w} height={h} rx={5} fill={col} opacity={0.88}/>
          <rect x={x-w/2} y={y-h-8} width={w} height={10} rx={3} fill={cap}/>
          <rect x={x-w/2+2} y={y-h+4} width={w-4} height={6} rx={2} fill="rgba(255,255,255,0.25)"/>
        </g>
      ))}

      {/* ── DECORATIVE WALL ELEMENTS ── */}
      {/* Framed mini artwork top-left */}
      <rect x={18} y={28} width={62} height={50} rx={5} fill={dark?"#1a1208":"#f5e8ce"} stroke={dark?"#6a4a2a":"#c8a870"} strokeWidth={3}/>
      <rect x={22} y={32} width={54} height={42} rx={2} fill={dark?"#0e0c08":"#fffdf5"}/>
      {/* Mini watercolor in frame — abstract blooms */}
      <ellipse cx={35} cy={48} rx={10} ry={8} fill="#FF6B6B" opacity={dark?0.5:0.7}/>
      <ellipse cx={52} cy={43} rx={8} ry={7} fill="#C77DFF" opacity={dark?0.45:0.65}/>
      <ellipse cx={65} cy={50} rx={7} ry={9} fill="#FFD93D" opacity={dark?0.45:0.65}/>
      <ellipse cx={46} cy={56} rx={9} ry={6} fill="#4D96FF" opacity={dark?0.4:0.55}/>
      {/* Shelf */}
      <rect x={14} y={80} width={90} height={7} rx={3} fill={dark?"#4a3020":"#b8926a"} opacity={0.9}/>

      {/* ── PAINT SPLASH ACCENT — top right ── */}
      <circle cx={395} cy={42} r={22} fill={dark?"#4a3010":"#FFD93D"} opacity={dark?0.18:0.4}/>
      <circle cx={393} cy={40} r={14} fill={dark?"#5a1a10":"#FF6B6B"} opacity={dark?0.15:0.35}/>
      {[[378,28,4],[408,30,3],[415,50,5],[400,58,3],[382,55,3.5]].map(([x,y,r],i)=>(
        <circle key={`sp2${i}`} cx={x} cy={y} r={r} fill={["#FFD93D","#FF6B6B","#C77DFF"][i%3]} opacity={dark?0.25:0.55}/>
      ))}

      {/* ── FLOOR REFLECTION ── */}
      <ellipse cx={178} cy={348} rx={65} ry={12} fill={dark?"rgba(0,0,0,0.3)":"rgba(120,80,40,0.1)"}/>

      {/* ── QUOTE ── */}
      <text x={210} y={410} textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize={12} fontStyle="italic" fill={dark?"#408175":"#408175"} opacity={0.75}>where creativity blooms</text>
    </svg>
  );
}


function DecoCircle({ size = 80, color = "#408175", opacity = 0.15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" style={{ opacity }}>
      <circle cx="40" cy="40" r="36" stroke={color} strokeWidth="1.5" fill="none"/>
      <circle cx="40" cy="40" r="28" stroke={color} strokeWidth="0.8" fill="none"/>
      <circle cx="40" cy="40" r="20" stroke={color} strokeWidth="0.4" fill="none"/>
    </svg>
  );
}

function DecoLeaf({ size = 40, color = "#408175", opacity = 0.3 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" style={{ opacity }}>
      <path d="M20 4 C30 4 36 12 36 22 C36 32 28 36 20 36 C20 36 20 20 4 20 C4 12 10 4 20 4Z" fill={color}/>
      <path d="M20 4 L20 36" stroke={color} strokeWidth="0.8" fill="none" opacity={0.5}/>
    </svg>
  );
}

function DecoBrush({ size = 60, color = "#B5B9F0", opacity = 0.2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none" style={{ opacity }}>
      <rect x={27} y={4} width={6} height={36} rx={3} fill={color}/>
      <ellipse cx={30} cy={44} rx={8} ry={10} fill={color}/>
      <path d={`M26 54 Q30 60 34 54`} fill={color} opacity={0.6}/>
    </svg>
  );
}

function DecoStar({ size = 24, color = "#B5B9F0", opacity = 1 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <path d="M12 2L13.5 9.5L21 8L15 13L18 21L12 16.5L6 21L9 13L3 8L10.5 9.5L12 2Z" fill={color}/>
    </svg>
  );
}

/* ─── STAT CARD ──────────────────────────────────────────────── */
function StatCard({ value, suffix = "", label, active, C }) {
  const num = useCounter(parseInt(value), active);
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(30px,4vw,46px)", fontWeight: 700, color: C.jade, lineHeight: 1 }}>
        {num}{suffix}
      </div>
      <div style={{ fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: "1.2px", marginTop: 6 }}>{label}</div>
    </div>
  );
}

const paintingMap = {
  stillLife: PaintingStillLife,
  portrait: PaintingPortrait,
  landscape: PaintingLandscape,
  abstract: PaintingAbstract,
  sculpture: PaintingSculpture,
  inkArt: PaintingInkArt,
};

/* ─── ILLUSTRATION: ARTIST AT EASEL ─────────────────────────── */
function IllustrationArtist({ dark }) {
  const bg = dark ? "#0d0b0b" : "#fff9f0";
  const card = dark ? "#1a1212" : "#fffef8";
  return (
    <svg width="100%" height="100%" viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
      {/* Warm bright background */}
      <rect width={420} height={380} fill={bg} rx={20}/>

      {/* Big color wash blobs */}
      <ellipse cx={55} cy={60} rx={90} ry={70} fill="#FF6B6B" opacity={dark?0.15:0.22}/>
      <ellipse cx={375} cy={55} rx={75} ry={60} fill="#FFD93D" opacity={dark?0.15:0.28}/>
      <ellipse cx={370} cy={320} rx={85} ry={60} fill="#4D96FF" opacity={dark?0.12:0.22}/>
      <ellipse cx={45} cy={320} rx={70} ry={55} fill="#6BCB77" opacity={dark?0.12:0.20}/>

      {/* Paint splash dots */}
      {[
        [18,130,"#FF6B6B",5],[10,185,"#FFD93D",4],[30,240,"#6BCB77",5],
        [402,120,"#4D96FF",6],[410,200,"#C77DFF",4],[395,270,"#FF9F43",5],
        [185,8,"#C77DFF",4],[265,5,"#FF6B6B",3]
      ].map(([x,y,c,r],i)=>(
        <circle key={`sp${i}`} cx={x} cy={y} r={r} fill={c} opacity={dark?0.45:0.7}/>
      ))}

      {/* ── LARGE EASEL (warm wood) ── */}
      <line x1={155} y1={95} x2={105} y2={345} stroke="#8B5E3C" strokeWidth={9} strokeLinecap="round"/>
      <line x1={265} y1={95} x2={315} y2={345} stroke="#8B5E3C" strokeWidth={9} strokeLinecap="round"/>
      <line x1={210} y1={115} x2={210} y2={350} stroke="#8B5E3C" strokeWidth={6} strokeLinecap="round" opacity={0.5}/>
      <line x1={118} y1={265} x2={302} y2={265} stroke="#8B5E3C" strokeWidth={7} strokeLinecap="round"/>
      <line x1={148} y1={104} x2={272} y2={104} stroke="#8B5E3C" strokeWidth={7} strokeLinecap="round"/>
      <line x1={105} y1={345} x2={92} y2={362} stroke="#8B5E3C" strokeWidth={7} strokeLinecap="round"/>
      <line x1={315} y1={345} x2={328} y2={362} stroke="#8B5E3C" strokeWidth={7} strokeLinecap="round"/>

      {/* ── CANVAS — vivid landscape painting ── */}
      <rect x={152} y={104} width={116} height={152} rx={6} fill={card} stroke="#8B5E3C" strokeWidth={4}/>
      <rect x={158} y={110} width={104} height={140} rx={3} fill={dark?"#0d0b0b":"#fffef0"} opacity={0.95}/>
      {/* Sky — vivid gradient-style */}
      <rect x={159} y={111} width={102} height={55} fill="#87CEEB" opacity={0.85} rx={2}/>
      <ellipse cx={238} cy={125} rx={18} ry={15} fill="#FFF9C4" opacity={0.5}/>
      {/* Sun */}
      <circle cx={245} cy={122} r={12} fill="#FFD93D" opacity={0.95}/>
      <circle cx={245} cy={122} r={7} fill="#FF9F43" opacity={0.9}/>
      {/* Sun rays */}
      {[0,45,90,135,180,225,270,315].map((a,i)=>(
        <line key={`ray${i}`} x1={245+Math.cos(a*Math.PI/180)*14} y1={122+Math.sin(a*Math.PI/180)*14} x2={245+Math.cos(a*Math.PI/180)*20} y2={122+Math.sin(a*Math.PI/180)*20} stroke="#FFD93D" strokeWidth={1.5} opacity={0.7}/>
      ))}
      {/* Rolling hills */}
      <path d="M159 166 Q172 148 192 156 Q208 140 230 150 Q248 138 261 148 L261 166Z" fill="#6BCB77" opacity={0.85}/>
      <path d="M159 166 Q175 155 195 162 Q212 150 232 158 Q248 145 261 155 L261 251 L159 251Z" fill="#4D7C2F" opacity={0.6}/>
      {/* River */}
      <path d="M180 200 Q205 192 230 200 Q215 240 192 248 Q175 240 180 200Z" fill="#4D96FF" opacity={0.6}/>
      {/* Tree */}
      <rect x={172} y={185} width={4} height={26} fill="#8B5E3C" opacity={0.9}/>
      <circle cx={174} cy={180} r={10} fill="#27AE60" opacity={0.9}/>
      <circle cx={174} cy={174} r={7} fill="#2ECC71" opacity={0.8}/>
      {/* Farmhouse */}
      <rect x={232} y={168} width={18} height={16} fill="#FF6B6B" opacity={0.85}/>
      <path d="M229 168 L241 160 L253 168Z" fill="#C0392B" opacity={0.9}/>
      {/* Artist signature */}
      <path d="M220 244 Q230 241 242 244" stroke="#408175" strokeWidth={1.5} strokeLinecap="round" fill="none" opacity={0.7}/>

      {/* ── PALETTE (big, colorful) ── */}
      <ellipse cx={88} cy={228} rx={56} ry={44} fill={card} stroke="#8B5E3C" strokeWidth={3}/>
      <ellipse cx={72} cy={214} rx={10} ry={14} fill={bg} stroke="#8B5E3C" strokeWidth={2}/>
      <circle cx={112} cy={212} r={9.5} fill="#FF6B6B" opacity={0.95}/>
      <circle cx={128} cy={228} r={8.5} fill="#FFD93D" opacity={0.95}/>
      <circle cx={118} cy={246} r={8} fill="#6BCB77" opacity={0.95}/>
      <circle cx={100} cy={256} r={7} fill="#4D96FF" opacity={0.95}/>
      <circle cx={82} cy={252} r={6.5} fill="#C77DFF" opacity={0.95}/>
      {/* Mixing smear */}
      <path d="M105 222 Q118 228 124 240" stroke="#FF9F43" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.4}/>

      {/* ── BRUSH 1 (held toward canvas) ── */}
      <rect x={126} y={172} width={7} height={58} rx={3.5} fill="#8B5E3C" transform="rotate(-28 129 201)"/>
      <rect x={124} y={165} width={9} height={10} rx={2.5} fill="#C0392B" transform="rotate(-28 128 170)"/>
      <ellipse cx={119} cy={158} rx={5.5} ry={11} fill="#FF6B6B" opacity={1} transform="rotate(-28 119 158)"/>
      <circle cx={115} cy={152} r={4.5} fill="#FFD93D" opacity={0.9}/>

      {/* ── BRUSH 2 ── */}
      <rect x={320} y={188} width={6} height={66} rx={3} fill="#8B5E3C" transform="rotate(22 323 221)"/>
      <rect x={318} y={182} width={8} height={9} rx={2} fill="#27AE60" transform="rotate(22 322 186)"/>
      <ellipse cx={325} cy={176} rx={4.5} ry={9} fill="#6BCB77" opacity={0.95} transform="rotate(22 325 176)"/>
      <circle cx={328} cy={170} r={3.5} fill="#4D96FF" opacity={0.85}/>

      {/* ── PAINT TUBES (rainbow) ── */}
      <rect x={316} y={288} width={24} height={56} rx={7} fill="#FF6B6B" opacity={0.95}/>
      <rect x={320} y={281} width={16} height={11} rx={3} fill="#C0392B"/>
      <rect x={344} y={295} width={22} height={50} rx={7} fill="#FFD93D" opacity={0.95}/>
      <rect x={348} y={288} width={14} height={10} rx={3} fill="#F39C12"/>
      <rect x={370} y={300} width={22} height={46} rx={7} fill="#6BCB77" opacity={0.95}/>
      <rect x={374} y={293} width={14} height={10} rx={3} fill="#27AE60"/>

      {/* ── BIG SPLATTER clusters ── */}
      {[[42,168,4],[28,178,3],[48,190,3.5],[35,194,2.5],[22,172,2]].map(([x,y,r],i)=>(
        <circle key={`sa${i}`} cx={x} cy={y} r={r} fill={["#FF6B6B","#FFD93D","#4D96FF"][i%3]} opacity={dark?0.4:0.7}/>
      ))}
      {[[378,160,3.5],[366,172,2.5],[385,178,3],[371,185,2]].map(([x,y,r],i)=>(
        <circle key={`sb${i}`} cx={x} cy={y} r={r} fill={["#C77DFF","#6BCB77","#FFD93D"][i%3]} opacity={dark?0.4:0.7}/>
      ))}

      {/* ── COLOR SWATCHES STRIP ── */}
      {["#FF6B6B","#FF9F43","#FFD93D","#6BCB77","#4D96FF","#C77DFF"].map((c,i)=>(
        <rect key={`csw${i}`} x={55+i*52} y={363} width={42} height={12} rx={5} fill={c} opacity={dark?0.5:0.85}/>
      ))}

      {/* Stars */}
      {[[40,44,"#FFD93D"],[380,42,"#FF6B6B"],[380,340,"#6BCB77"],[40,340,"#4D96FF"]].map(([x,y,c],i)=>(
        <g key={`star${i}`}>
          <line x1={x} y1={y-7} x2={x} y2={y+7} stroke={c} strokeWidth={2}/>
          <line x1={x-7} y1={y} x2={x+7} y2={y} stroke={c} strokeWidth={2}/>
          <line x1={x-4} y1={y-4} x2={x+4} y2={y+4} stroke={c} strokeWidth={1.2}/>
          <line x1={x+4} y1={y-4} x2={x-4} y2={y+4} stroke={c} strokeWidth={1.2}/>
        </g>
      ))}

      {/* Label */}
      <text x={210} y={358} textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize={13} fontStyle="italic" fill="#408175" opacity={0.85}>where art comes alive</text>
    </svg>
  );
}

/* ─── CONTACT ACCENT ILLUSTRATION — vibrant art supplies ──────── */
function ContactAccentIllustration({ dark }) {
  const bg = dark ? "#0d0b0b" : "#fff8f2";
  return (
    <svg width="100%" height="160" viewBox="0 0 380 160" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
      {/* Background */}
      <rect width={380} height={160} fill={bg} rx={16}/>

      {/* Big paint wash blobs */}
      <ellipse cx={50} cy={40} rx={80} ry={55} fill="#FF6B6B" opacity={dark?0.15:0.25}/>
      <ellipse cx={330} cy={50} rx={70} ry={50} fill="#FFD93D" opacity={dark?0.15:0.28}/>
      <ellipse cx={195} cy={130} rx={100} ry={45} fill="#4D96FF" opacity={dark?0.10:0.18}/>
      <ellipse cx={310} cy={130} rx={60} ry={40} fill="#6BCB77" opacity={dark?0.10:0.18}/>

      {/* ── BRUSH COLLECTION (left) ── */}
      {/* brush 1 — red */}
      <rect x={38} y={18} width={8} height={80} rx={4} fill="#8B5E3C" transform="rotate(8 42 58)"/>
      <rect x={36} y={13} width={10} height={11} rx={3} fill="#C0392B" transform="rotate(8 41 18)"/>
      <ellipse cx={35} cy={8} rx={6} ry={12} fill="#FF6B6B" opacity={1} transform="rotate(8 35 8)"/>
      {/* brush 2 — yellow */}
      <rect x={58} y={12} width={7} height={85} rx={3.5} fill="#8B5E3C" transform="rotate(-4 61 54)"/>
      <rect x={56} y={7} width={9} height={10} rx={2.5} fill="#F39C12" transform="rotate(-4 60 12)"/>
      <ellipse cx={57} cy={2} rx={5} ry={10} fill="#FFD93D" opacity={1} transform="rotate(-4 57 2)"/>
      {/* brush 3 — blue */}
      <rect x={78} y={20} width={7} height={78} rx={3.5} fill="#8B5E3C" transform="rotate(12 81 59)"/>
      <rect x={76} y={14} width={9} height={10} rx={2.5} fill="#2980B9" transform="rotate(12 80 19)"/>
      <ellipse cx={74} cy={8} rx={5} ry={10} fill="#4D96FF" opacity={1} transform="rotate(12 74 8)"/>
      {/* brush 4 — purple */}
      <rect x={98} y={15} width={7} height={82} rx={3.5} fill="#8B5E3C" transform="rotate(-6 101 56)"/>
      <rect x={96} y={10} width={9} height={10} rx={2.5} fill="#8E44AD" transform="rotate(-6 100 15)"/>
      <ellipse cx={97} cy={4} rx={5} ry={10} fill="#C77DFF" opacity={1} transform="rotate(-6 97 4)"/>
      {/* brush 5 — green */}
      <rect x={118} y={22} width={6} height={75} rx={3} fill="#8B5E3C" transform="rotate(15 121 59)"/>
      <rect x={116} y={16} width={8} height={9} rx={2} fill="#27AE60" transform="rotate(15 120 20)"/>
      <ellipse cx={114} cy={10} rx={4.5} ry={9} fill="#6BCB77" opacity={1} transform="rotate(15 114 10)"/>

      {/* ── PAINT TUBES (center) ── */}
      <rect x={155} y={38} width={26} height={68} rx={8} fill="#FF6B6B" opacity={0.95}/>
      <rect x={160} y={30} width={16} height={12} rx={4} fill="#C0392B"/>
      <ellipse cx={168} cy={108} rx={7} ry={4} fill="#C0392B" opacity={0.6}/>
      <rect x={185} y={45} width={24} height={60} rx={8} fill="#6BCB77" opacity={0.95}/>
      <rect x={190} y={37} width={14} height={11} rx={4} fill="#27AE60"/>
      <ellipse cx={197} cy={107} rx={6} ry={3.5} fill="#27AE60" opacity={0.6}/>
      <rect x={213} y={40} width={24} height={64} rx={8} fill="#4D96FF" opacity={0.95}/>
      <rect x={218} y={32} width={14} height={11} rx={4} fill="#2980B9"/>
      <ellipse cx={225} cy={106} rx={6} ry={3.5} fill="#2980B9" opacity={0.6}/>
      <rect x={241} y={48} width={22} height={56} rx={8} fill="#FFD93D" opacity={0.95}/>
      <rect x={246} y={40} width={12} height={10} rx={3} fill="#F39C12"/>
      <rect x={267} y={44} width={22} height={60} rx={8} fill="#C77DFF" opacity={0.95}/>
      <rect x={272} y={36} width={12} height={11} rx={3} fill="#8E44AD"/>

      {/* ── PALETTE (right) ── */}
      <ellipse cx={340} cy={85} rx={34} ry={55} fill={dark?"#1a1212":"#fffef0"} stroke="#8B5E3C" strokeWidth={3} transform="rotate(20 340 85)"/>
      <ellipse cx={328} cy={64} rx={8} ry={11} fill={bg} stroke="#8B5E3C" strokeWidth={2} transform="rotate(20 328 64)"/>
      <circle cx={348} cy={64} r={7} fill="#FF6B6B" opacity={0.95}/>
      <circle cx={362} cy={78} r={6.5} fill="#FFD93D" opacity={0.95}/>
      <circle cx={360} cy={95} r={6} fill="#6BCB77" opacity={0.95}/>
      <circle cx={350} cy={108} r={5.5} fill="#4D96FF" opacity={0.95}/>
      <circle cx={335} cy={112} r={5} fill="#C77DFF" opacity={0.95}/>

      {/* ── PAINT SPLATTER DOTS ── */}
      {[
        [20,110,"#FF6B6B",4],[12,130,"#FFD93D",3],[28,142,"#6BCB77",3.5],
        [360,140,"#4D96FF",4],[372,125,"#C77DFF",3],[365,150,"#FF9F43",3],
        [140,125,"#FF6B6B",4],[148,142,"#FFD93D",3],[130,148,"#6BCB77",3]
      ].map(([x,y,c,r],i)=>(
        <circle key={`pd${i}`} cx={x} cy={y} r={r} fill={c} opacity={dark?0.5:0.8}/>
      ))}

      {/* Stars */}
      {[[18,22,"#FFD93D"],[362,18,"#FF6B6B"],[18,148,"#6BCB77"],[362,148,"#4D96FF"]].map(([x,y,c],i)=>(
        <g key={`cst${i}`}>
          <line x1={x} y1={y-5} x2={x} y2={y+5} stroke={c} strokeWidth={1.5}/>
          <line x1={x-5} y1={y} x2={x+5} y2={y} stroke={c} strokeWidth={1.5}/>
        </g>
      ))}

      {/* Label */}
      <text x={190} y={152} textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize={11} fontStyle="italic" fill="#408175" opacity={0.75}>pick up a brush · start your journey</text>
    </svg>
  );
}

/* ─── ILLUSTRATION: PALETTE & TOOLS ─────────────────────────── */
function IllustrationPalette({ dark }) {
  const card = dark ? "#161414" : "#FDFCFA";
  const bg2 = dark ? "#111010" : "#F4F1ED";
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display:"block" }}>
      <rect width={320} height={260} fill={bg2} rx={16}/>
      {/* soft wash bg */}
      <ellipse cx={160} cy={260} rx={150} ry={50} fill="#2E4540" opacity={0.07}/>
      {/* big palette */}
      <ellipse cx={160} cy={140} rx={110} ry={85} fill={card} stroke="#2E4540" strokeWidth={2.5}/>
      <ellipse cx={160} cy={140} rx={110} ry={85} fill="#B5B9F0" opacity={0.04}/>
      {/* thumb hole */}
      <ellipse cx={128} cy={108} rx={16} ry={20} fill={bg2} stroke="#2E4540" strokeWidth={2}/>
      {/* highlight */}
      <ellipse cx={148} cy={118} rx={30} ry={14} fill="#fff" opacity={0.05}/>

      {/* large color blobs */}
      <circle cx={200} cy={100} r={18} fill="#408175" opacity={0.9}/>
      <circle cx={230} cy={125} r={15} fill="#2E4540" opacity={0.85}/>
      <circle cx={225} cy={158} r={17} fill="#B5B9F0" opacity={0.9}/>
      <circle cx={200} cy={180} r={14} fill="#408175" opacity={0.6}/>
      <circle cx={170} cy={195} r={13} fill="#2E4540" opacity={0.5}/>
      <circle cx={145} cy={192} r={11} fill="#B5B9F0" opacity={0.55}/>

      {/* mixing smears */}
      <path d="M190 110 Q215 115 222 130" stroke="#408175" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.3}/>
      <path d="M215 140 Q220 160 208 170" stroke="#B5B9F0" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.3}/>
      <path d="M180 185 Q165 192 158 188" stroke="#2E4540" strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.35}/>

      {/* brush 1 */}
      <rect x={58} y={32} width={7} height={70} rx={3.5} fill="#2E4540" transform="rotate(15 61 67)"/>
      <rect x={57} y={27} width={9} height={10} rx={2} fill="#408175" transform="rotate(15 61 32)"/>
      <ellipse cx={55} cy={23} rx={5} ry={11} fill="#B5B9F0" opacity={0.9} transform="rotate(15 55 23)"/>
      <circle cx={53} cy={17} r={3} fill="#408175" opacity={0.5}/>

      {/* brush 2 */}
      <rect x={240} y={22} width={6} height={75} rx={3} fill="#2E4540" transform="rotate(-12 243 59)"/>
      <rect x={239} y={17} width={8} height={9} rx={2} fill="#408175" transform="rotate(-12 243 21)"/>
      <ellipse cx={244} cy={13} rx={4.5} ry={10} fill="#2E4540" opacity={0.85} transform="rotate(-12 244 13)"/>
      <circle cx={246} cy={7} r={2.5} fill="#2E4540" opacity={0.4}/>

      {/* pencil */}
      <rect x={88} y={38} width={5} height={65} rx={2} fill="#B5B9F0" opacity={0.8} transform="rotate(25 90 70)"/>
      <path d="M82 20 L90 22 L88 38 L80 36Z" fill="#408175" opacity={0.7} transform="rotate(25 85 29)"/>
      <path d="M82 20 L86 14 L90 22Z" fill="#2E4540" opacity={0.8} transform="rotate(25 86 18)"/>

      {/* ink dots */}
      {[[262,220,4],[275,210,3],[285,225,2.5],[255,230,2],[268,235,3]].map(([x,y,r],i)=>(
        <circle key={i} cx={x} cy={y} r={r} fill="#408175" opacity={0.4}/>
      ))}
      {[[40,210,3],[50,220,2.5],[35,225,2]].map(([x,y,r],i)=>(
        <circle key={`l${i}`} cx={x} cy={y} r={r} fill="#B5B9F0" opacity={0.35}/>
      ))}

      {/* star deco */}
      <path d="M290 85 L292 91 L298 91 L293 95 L295 101 L290 97 L285 101 L287 95 L282 91 L288 91Z" fill="#B5B9F0" opacity={0.4}/>
      <path d="M30 170 L32 175 L37 175 L33 178 L35 183 L30 180 L25 183 L27 178 L23 175 L28 175Z" fill="#408175" opacity={0.35}/>
    </svg>
  );
}

/* ─── GALLERY CAROUSEL ───────────────────────────────────────── */
function GalleryCarousel({ gallery, paintingMap, dark, C }) {
  const n = gallery.length;
  const [center, setCenter] = useState(0);
  const [animDir, setAnimDir] = useState(null); // 'left' | 'right'
  const [isAnimating, setIsAnimating] = useState(false);

  const getIdx = (offset) => (center + offset + n) % n;

  const navigate = (dir) => {
    if (isAnimating) return;
    setAnimDir(dir);
    setIsAnimating(true);
    setTimeout(() => {
      setCenter(prev => (prev + (dir === 'right' ? 1 : -1) + n) % n);
      setAnimDir(null);
      setIsAnimating(false);
    }, 240);
  };

  const slides = [
    { idx: getIdx(-1), pos: 'left' },
    { idx: getIdx(0),  pos: 'center' },
    { idx: getIdx(1),  pos: 'right' },
  ];

  // Compute per-position styles
  const posStyles = (pos) => {
    // Base values
    const cfg = {
      left:   { translateX: '-58%', scale: 0.72, zIndex: 1, opacity: 0.7, width: '55%' },
      center: { translateX: '0%',   scale: 1,    zIndex: 3, opacity: 1,   width: '100%' },
      right:  { translateX: '58%',  scale: 0.72, zIndex: 1, opacity: 0.7, width: '55%' },
    };
    return cfg[pos];
  };

  // Transition offsets during animation
  const getTransform = (pos) => {
    const { translateX, scale } = posStyles(pos);
    let extraX = 0;
    if (animDir === 'right') {
      if (pos === 'center') extraX = -12;
      if (pos === 'right')  extraX = -12;
      if (pos === 'left')   extraX = -12;
    } else if (animDir === 'left') {
      if (pos === 'center') extraX = 12;
      if (pos === 'left')   extraX = 12;
      if (pos === 'right')  extraX = 12;
    }
    return `translateX(calc(${translateX} + ${extraX}px)) scale(${scale})`;
  };

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Carousel viewport */}
      <div style={{ position: 'relative', width: '100%', height: 'clamp(260px,40vw,460px)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {slides.map(({ idx, pos }) => {
          const g = gallery[idx];
          
          const { zIndex, opacity } = posStyles(pos);
          return (
            <div
              key={`${pos}-${idx}`}
              style={{
                position: 'absolute',
                width: 'clamp(200px,38%,380px)',
                transform: getTransform(pos),
                zIndex,
                opacity: animDir ? opacity * 0.85 : opacity,
                transition: 'transform 0.24s cubic-bezier(.25,1,.3,1), opacity 0.24s cubic-bezier(.25,1,.3,1), box-shadow 0.24s',
                cursor: pos !== 'center' ? 'pointer' : 'default',
                borderRadius: 20,
                overflow: 'hidden',
                background: C.card,
                border: `1px solid ${pos === 'center' ? C.jade + '55' : C.border}`,
                boxShadow: pos === 'center'
                  ? `0 24px 72px rgba(64,129,117,.22), 0 8px 24px rgba(0,0,0,.12)`
                  : `0 8px 24px rgba(0,0,0,.08)`,
              }}
              onClick={() => {
                if (pos === 'left') navigate('left');
                if (pos === 'right') navigate('right');
              }}
            >
              <div style={{ aspectRatio: '4/3', overflow: 'hidden', pointerEvents: 'none' }}>
                <img src={g.image} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
              </div>
              <div style={{
                padding: pos === 'center' ? '18px 20px' : '12px 14px',
                borderTop: `1px solid ${C.divider}`,
                transition: 'padding 0.24s cubic-bezier(.25,1,.3,1)',
              }}>
                <p style={{ fontSize: pos === 'center' ? 15 : 12, fontWeight: 600, color: C.ink, fontFamily: "'Playfair Display',serif", transition: 'font-size 0.24s' }}>{g.label}</p>
                <p style={{ fontSize: pos === 'center' ? 11 : 10, color: C.jade, marginTop: 4, letterSpacing: '.5px', textTransform: 'uppercase', fontWeight: 500 }}>{g.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Nav buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 32 }}>
        <button
          onClick={() => navigate('left')}
          disabled={isAnimating}
          style={{ width: 48, height: 48, borderRadius: '50%', border: `1.5px solid ${C.border}`, background: C.card, color: C.ink, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isAnimating ? 'default' : 'pointer', transition: 'all .25s', opacity: isAnimating ? 0.5 : 1 }}
          aria-label="Previous"
        >←</button>
        {/* Dots */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {gallery.map((_, i) => (
            <div key={i} style={{ width: i === center ? 20 : 6, height: 6, borderRadius: 3, background: i === center ? C.jade : C.border, transition: 'all .35s cubic-bezier(.16,1,.3,1)' }}/>
          ))}
        </div>
        <button
          onClick={() => navigate('right')}
          disabled={isAnimating}
          style={{ width: 48, height: 48, borderRadius: '50%', border: `1.5px solid ${C.border}`, background: C.card, color: C.ink, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isAnimating ? 'default' : 'pointer', transition: 'all .25s', opacity: isAnimating ? 0.5 : 1 }}
          aria-label="Next"
        >→</button>
      </div>
    </div>
  );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function RangTarang() {
  const [navOpen, setNavOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", course: ["Sketching"], mode: "In-studio", message: "" });
  const [statsRef, statsVis] = useReveal();

  /* ── Send enrollment straight to your inbox, via EmailJS ─────────────
     Browsers can't send real email on their own — EmailJS is a small
     free service that lets a website email someone directly with no
     backend server needed. Here's the one-time setup (takes ~5 min):

     1. Go to https://www.emailjs.com and sign up (free, no card needed).
     2. "Email Services" → "Add New Service" → connect Gmail → sign in
        as acm16082005@gmail.com. Copy the SERVICE ID it gives you.
     3. "Email Templates" → "Create New Template". In the template body,
        write the email however you like, using these variables:
        {{name}}  {{phone}}  {{course}}  {{mode}}  {{message}}
        Set the "To email" field of the template to acm16082005@gmail.com.
        Copy the TEMPLATE ID it gives you.
     4. "Account" → "General" → copy your PUBLIC KEY.
     5. Paste those 3 values into the 3 lines below.

     That's it — no toggle to remember to turn on, no Sheet to check.
     Every submission emails acm16082005@gmail.com directly.
  ------------------------------------------------------------------------ */
  const EMAILJS_SERVICE_ID  = "service_izjvdiu";
  const EMAILJS_TEMPLATE_ID = "template_qpy5gqm";
  const EMAILJS_PUBLIC_KEY  = "HeNYhBt8JLcN7rtn6";

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          phone: form.phone,
          course: Array.isArray(form.course) ? form.course.join(", ") : form.course,
          mode: form.mode,
          message: form.message || "No additional message.",
        },
        { publicKey: EMAILJS_PUBLIC_KEY }
      );
      setSubmitted(true);
    } catch (err) {
      setSubmitError("Something went wrong sending your enrollment. Please call us directly at 9905030035.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── COLOUR TOKENS (only the 4 brand colours + derived) ── */
  const C = dark ? {
    bg:        "#0B0909",
    paper:     "#111010",
    card:      "#161414",
    ink:       "#EEECf5",
    muted:     "#7E8490",
    jade:      "#408175",
    forest:    "#2E4540",
    lavender:  "#B5B9F0",
    midnight:  "#0B0909",
    border:    "#2A2828",
    divider:   "#1E1C1C",
    nav:       "rgba(11,9,9,.94)",
    jadeLight: "#0e1f1d",
    lavLight:  "#16152a",
    accent:    "#408175",
  } : {
    bg:        "#F4F1ED",
    paper:     "#FDFCFA",
    card:      "#FDFCFA",
    ink:       "#0B0909",
    muted:     "#4A5560",
    jade:      "#408175",
    forest:    "#2E4540",
    lavender:  "#B5B9F0",
    midnight:  "#0B0909",
    border:    "#DDD9D4",
    divider:   "#E8E4DF",
    nav:       "rgba(244,241,237,.94)",
    jadeLight: "#e8f2f0",
    lavLight:  "#eeeeff",
    accent:    "#2E4540",
  };

  const NAV = ["home", "about", "classes", "gallery", "contact"];
  const scrollTo = (id) => { setNavOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };

  return (
    <div style={{ background: C.bg, color: C.ink, fontFamily: "'DM Sans', sans-serif", minHeight: "100vh", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,400;1,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:${C.jade}33}
        input,select,textarea,button{font-family:'DM Sans',sans-serif;cursor:pointer}
        a{color:inherit;text-decoration:none}
        .n-link{transition:color .25s;border:none;background:none;}
        .n-link:hover{color:${C.jade}!important}
        .card-lift{transition:transform .45s cubic-bezier(.16,1,.3,1),box-shadow .45s}
        .card-lift:hover{transform:translateY(-8px);box-shadow:0 24px 60px rgba(0,0,0,.12)}
        .pill{transition:opacity .15s,transform .15s;border:none;cursor:pointer;}
        .pill:hover{opacity:.88;transform:scale(1.03)}
        input:focus,textarea:focus,select:focus{outline:2px solid ${C.jade};outline-offset:2px}
        /* ── SECTION REVEAL ANIMATIONS ── */
        @keyframes fadeInUp{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeInLeft{from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeInRight{from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}}
        @keyframes fadeInScale{from{opacity:0;transform:scale(0.85)}to{opacity:1;transform:scale(1)}}
        @keyframes fadeInOnly{from{opacity:0}to{opacity:1}}
        /* ── FLOAT ── */
        .float-anim{animation:floatY 5s ease-in-out infinite}
        .float-anim-slow{animation:floatDrift 11s ease-in-out infinite 1.5s}
        .float-anim-med{animation:floatRotate 8s ease-in-out infinite 0.8s}
        @keyframes floatY{0%,100%{transform:translateY(0) rotate(0deg)}30%{transform:translateY(-18px) rotate(4deg)}70%{transform:translateY(-8px) rotate(-3deg)}}
        @keyframes floatDrift{0%,100%{transform:translateY(0) translateX(0) rotate(0deg)}25%{transform:translateY(-20px) translateX(8px) rotate(6deg)}50%{transform:translateY(-10px) translateX(-6px) rotate(-4deg)}75%{transform:translateY(-24px) translateX(4px) rotate(3deg)}}
        @keyframes floatRotate{0%,100%{transform:translateY(0) rotate(0deg) scale(1)}40%{transform:translateY(-16px) rotate(12deg) scale(1.05)}70%{transform:translateY(-6px) rotate(-6deg) scale(.97)}}
        /* ── SPIN ── */
        .spin-slow{animation:spinSlow 30s linear infinite}
        .spin-rev{animation:spinRev 20s linear infinite}
        @keyframes spinSlow{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes spinRev{from{transform:rotate(360deg)}to{transform:rotate(0deg)}}
        /* ── SHIMMER / PULSE ── */
        .shimmer{animation:shimmer 2.5s ease-in-out infinite}
        @keyframes shimmer{0%,100%{opacity:.55;transform:scale(1)}50%{opacity:1;transform:scale(1.03)}}
        /* ── HERO PAINTING GLOW ── */
        .painting-glow{animation:paintingGlow 4s ease-in-out infinite}
        @keyframes paintingGlow{0%,100%{box-shadow:0 32px 80px #40817522,0 0 0 1px #2E454033}50%{box-shadow:0 40px 100px #40817544,0 0 60px #B5B9F022,0 0 0 1px #40817544}}
        /* ── BADGE POP ── */
        .badge-pop{animation:badgePop 6s ease-in-out infinite}
        .badge-pop-2{animation:badgePop 6s ease-in-out infinite 2s}
        /* ── TICKER BANNER ── */
        @keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .ticker-wrap{overflow:hidden;white-space:nowrap;width:100%;border-radius:100px;padding:7px 0;margin-bottom:16px}
        .ticker-inner{display:inline-block;animation:tickerScroll 20s linear infinite}
        .ticker-inner:hover{animation-play-state:paused}
        .badge-pop-3{animation:badgePop 6s ease-in-out infinite 4s}
        @keyframes badgePop{0%,100%{transform:translateY(0) scale(1)}40%{transform:translateY(-10px) scale(1.04)}70%{transform:translateY(-5px) scale(1.01)}}
        /* ── CARD HOVER ── */
        .card-lift{transition:transform .45s cubic-bezier(.16,1,.3,1),box-shadow .45s}
        .card-lift:hover{transform:translateY(-10px) rotate(-.5deg);box-shadow:0 28px 70px rgba(64,129,117,.18)}
        /* ── DRAW LINE ── */
        .brush-draw{stroke-dasharray:600;stroke-dashoffset:600;animation:drawLine 2.5s cubic-bezier(.4,0,.2,1) forwards .5s}
        @keyframes drawLine{to{stroke-dashoffset:0}}
        /* ── PAINT SPLASH (hero bg particles) ── */
        .particle{position:absolute;border-radius:50%;pointer-events:none}
        .p1{animation:particleOrbit1 14s linear infinite}
        .p2{animation:particleOrbit2 18s linear infinite 3s}
        .p3{animation:particleOrbit3 11s linear infinite 6s}
        .p4{animation:particleOrbit1 22s linear infinite 1s}
        .p5{animation:particleOrbit2 16s linear infinite 8s}
        @keyframes particleOrbit1{0%{transform:translate(0,0) scale(1)}25%{transform:translate(30px,-40px) scale(1.3)}50%{transform:translate(60px,10px) scale(.8)}75%{transform:translate(20px,50px) scale(1.2)}100%{transform:translate(0,0) scale(1)}}
        @keyframes particleOrbit2{0%{transform:translate(0,0) rotate(0deg)}33%{transform:translate(-40px,30px) rotate(120deg)}66%{transform:translate(20px,-35px) rotate(240deg)}100%{transform:translate(0,0) rotate(360deg)}}
        @keyframes particleOrbit3{0%,100%{transform:translate(0,0) scale(1) rotate(0deg)}20%{transform:translate(15px,-25px) scale(1.5) rotate(72deg)}40%{transform:translate(-20px,-10px) scale(.7) rotate(144deg)}60%{transform:translate(-10px,30px) scale(1.3) rotate(216deg)}80%{transform:translate(25px,15px) scale(.9) rotate(288deg)}}
        /* ── MORPH BLOB ── */
        .morph-blob{animation:morphBlob 8s ease-in-out infinite}
        @keyframes morphBlob{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}50%{border-radius:50% 60% 30% 40%/40% 70% 60% 50%}75%{border-radius:40% 30% 60% 70%/70% 40% 50% 60%}}
        /* ── STAT NUMBER REVEAL ── */
        .stat-num{animation:statReveal .6s cubic-bezier(.34,1.56,.64,1) both}
        @keyframes statReveal{from{transform:scale(.5) translateY(20px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
        /* ── SECTION UNDERLINE DRAW ── */
        .heading-underline{position:relative;display:inline-block}
        .heading-underline::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:2px;background:linear-gradient(90deg,#408175,#B5B9F0);border-radius:2px;transition:width 1.2s cubic-bezier(.16,1,.3,1)}
        .heading-underline.vis::after{width:100%}
        /* ── PAINT WIPE REVEAL ── */
        @keyframes paintWipe{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0% 0 0)}}
        .paint-wipe{animation:paintWipe 1.2s cubic-bezier(.16,1,.3,1) forwards}
        /* ── PILL ── */
        .pill{transition:opacity .15s,transform .2s cubic-bezier(.34,1.56,.64,1);border:none;cursor:pointer;}
        .pill:hover{opacity:.92;transform:scale(1.06) translateY(-2px)}
        /* ── GALLERY CARD HOVER ── */
        .gallery-card{transition:transform .5s cubic-bezier(.16,1,.3,1),box-shadow .5s,filter .5s}
        .gallery-card:hover{transform:translateY(-12px) scale(1.03) rotate(.3deg);box-shadow:0 32px 80px rgba(64,129,117,.2);filter:brightness(1.05)}
        /* ── NAV LINK UNDERLINE ── */
        .n-link{position:relative;transition:color .25s;border:none;background:none;}
        .n-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:#408175;transition:width .3s}
        .n-link:hover{color:#408175!important}
        .n-link:hover::after{width:100%}
        /* ── CONTACT GRID OVERFLOW FIX ── */
        /* Without this, a fixed-pixel-width child (like the ink-art accent below)
           can force its grid column wider than the viewport on phones, which in
           turn squeezes/clips the enroll form sitting in the same grid. */
        .contact-grid > div{min-width:0}
        .ink-accent svg{width:100%!important;height:auto!important;display:block}
        /* ── RESPONSIVE ── */
        @media(max-width:768px){
          .hide-mob{display:none!important}
          .two-col{grid-template-columns:1fr!important}
          .three-col{grid-template-columns:1fr!important}
          .five-col{grid-template-columns:1fr 1fr!important}
          .courses-row{grid-template-columns:1fr!important}
          .hero-grid{grid-template-columns:1fr!important;gap:32px!important}
          .hero-text-col{text-align:center}
          .hero-sub{margin-left:auto!important;margin-right:auto!important;text-align:center!important}
          .hero-pill-sub{text-align:center!important;width:100%;display:flex;justify-content:center}
          .hero-btns{justify-content:center!important}
          .hero-quote{text-align:center}
          #contact .contact-grid{grid-template-columns:1fr!important;gap:40px!important}
        }
        @media(min-width:480px) and (max-width:768px){
          .courses-row{grid-template-columns:1fr 1fr!important}
        }
        @media(min-width:769px){.hide-desk{display:none!important}}
      `}</style>

      {/* ── NAV ── */}
      <header style={{ position:"sticky", top:0, zIndex:100, background:C.nav, backdropFilter:"blur(20px)", borderBottom:`1px solid ${C.divider}` }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"0 24px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <a href="#home" onClick={e => { e.preventDefault(); scrollTo("home"); }} style={{ display:"flex", alignItems:"center", gap:10, background:"none", border:"none" }}>
            <div style={{ width:44, height:44, borderRadius:"50%", background:"#000", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <img src="data:image/png;base64,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" alt="Rang Tarang" style={{ width:38, height:38, objectFit:"contain", filter: dark ? "brightness(1.2) drop-shadow(0 0 4px #40817566)" : "drop-shadow(0 1px 3px #2E454033)" }}/>
            </div>
            <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:900, color:C.jade }}>Rang</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:21, fontWeight:400, fontStyle:"italic", color:C.ink }}>Tarang</span>
            </div>
          </a>
          <nav className="hide-mob" style={{ display:"flex", gap:36, alignItems:"center" }}>
            {NAV.map(l => (
              <a key={l} href={`#${l}`} onClick={e => { e.preventDefault(); scrollTo(l); }} className="n-link"
                style={{ fontSize:13, fontWeight:400, textTransform:"capitalize", letterSpacing:".5px", color:C.muted }}>
                {l}
              </a>
            ))}
          </nav>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button onClick={() => setDark(d=>!d)}
              style={{ width:36, height:36, borderRadius:"50%", border:`1px solid ${C.border}`, display:"flex", alignItems:"center", justifyContent:"center", color:C.muted, fontSize:15, background:"none", transition:"all .3s" }}>
              {dark ? "☀" : "☽"}
            </button>
            <button onClick={() => scrollTo("enroll")} className="pill hide-mob"
              style={{ padding:"9px 22px", borderRadius:100, background:C.jade, color:"#fff", fontSize:13, fontWeight:500 }}>
              Enroll now
            </button>
            <button className="hide-desk" onClick={() => setNavOpen(o=>!o)}
              style={{ fontSize:22, color:C.ink, padding:4, background:"none", border:"none" }}>☰</button>
          </div>
        </div>
        {navOpen && (
          <div style={{ background:C.bg, padding:"12px 24px 24px", borderTop:`1px solid ${C.divider}` }}>
            {NAV.map(l => (
              <a key={l} href={`#${l}`} onClick={e => { e.preventDefault(); scrollTo(l); }}
                style={{ display:"block", padding:"11px 0", fontSize:15, color:C.muted, textTransform:"capitalize", width:"100%", textAlign:"left", background:"none", border:"none" }}>{l}</a>
            ))}
            <button onClick={() => { setNavOpen(false); scrollTo("enroll"); }}
              style={{ marginTop:12, padding:"11px 22px", borderRadius:100, background:C.jade, color:"#fff", fontSize:13, fontWeight:500, border:"none" }}>
              Enroll now
            </button>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="home" style={{ position:"relative", maxWidth:1160, margin:"0 auto", padding:"100px 24px 80px", overflow:"hidden" }}>
        {/* Morphing ambient blobs */}
        <div className="morph-blob" style={{ position:"absolute", top:-80, right:-100, width:500, height:500, background:`radial-gradient(ellipse at 40% 40%, ${C.jade}12, ${C.forest}08, transparent 70%)`, pointerEvents:"none", zIndex:0 }}/>
        <div className="morph-blob" style={{ position:"absolute", bottom:-60, left:-80, width:380, height:380, background:`radial-gradient(ellipse at 60% 60%, ${C.lavender}0a, ${C.jade}06, transparent 70%)`, pointerEvents:"none", zIndex:0, animationDelay:"4s" }}/>
        {/* Paint-splash particles */}
        <div className="particle p1" style={{ width:10, height:10, background:C.jade, top:80, right:200, opacity:.3, zIndex:1 }}/>
        <div className="particle p2" style={{ width:6, height:6, background:C.lavender, top:150, right:350, opacity:.4, zIndex:1 }}/>
        <div className="particle p3" style={{ width:14, height:14, background:C.forest, top:250, right:120, opacity:.25, zIndex:1 }}/>
        <div className="particle p4" style={{ width:8, height:8, background:C.jade, top:300, left:100, opacity:.2, zIndex:1 }}/>
        <div className="particle p5" style={{ width:5, height:5, background:C.lavender, top:180, left:50, opacity:.35, zIndex:1 }}/>
        <div className="particle p1" style={{ width:12, height:12, background:C.jade, top:400, right:300, opacity:.18, zIndex:1 }}/>
        <div className="particle p3" style={{ width:7, height:7, background:C.lavender, top:60, left:200, opacity:.28, zIndex:1 }}/>
        {/* ambient deco */}
        <div style={{ position:"absolute", top:40, right:40, opacity:.2, zIndex:1 }} className="spin-slow"><DecoCircle size={160} color={C.jade}/></div>
        <div style={{ position:"absolute", top:120, right:120, opacity:.15, zIndex:1 }} className="spin-rev"><DecoCircle size={80} color={C.lavender}/></div>
        <div style={{ position:"absolute", bottom:120, left:20, zIndex:1 }} className="float-anim-slow"><DecoLeaf size={44} color={C.jade} opacity={.2}/></div>
        <div style={{ position:"absolute", top:80, left:80, zIndex:1 }} className="float-anim"><DecoStar size={16} color={C.lavender} opacity={.4}/></div>
        <div style={{ position:"absolute", bottom:80, right:120, zIndex:1 }}><DecoStar size={12} color={C.jade} opacity={.3}/></div>
        <div style={{ position:"absolute", top:200, left:180, zIndex:1 }} className="float-anim-med"><DecoBrush size={44} color={C.lavender} opacity={.15}/></div>

        <div style={{ position:"relative", zIndex:2 }}>
        <FadeUp>
          {/* Running ticker banner */}
          <div className="ticker-wrap" style={{ background:`linear-gradient(90deg,${C.forest},${C.jade})` }}>
            <div className="ticker-inner">
              {[...Array(4)].map((_,i) => (
                <span key={i} style={{ fontSize:12, fontWeight:600, color:"#fff", letterSpacing:"1.5px", textTransform:"uppercase", padding:"0 32px" }}>
                  ✦ Special Classes for NIFT &nbsp;•&nbsp; NID &nbsp;•&nbsp; Pearl &nbsp;•&nbsp; AIEED &nbsp;•&nbsp; BFA &nbsp;•&nbsp; MFA
                </span>
              ))}
            </div>
          </div>
        </FadeUp>
        <FadeUp>
          <div className="hero-pill-sub">
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:100, background:C.jadeLight, marginBottom:28, border:`1px solid ${C.jade}33` }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:C.jade, display:"inline-block" }}/>
            <span style={{ fontSize:12, fontWeight:500, color:C.jade, letterSpacing:"1px", textTransform:"uppercase" }}>Drawing Classes for All Ages | Online &amp; Offline</span>
          </div>
          </div>
        </FadeUp>

        <div className="hero-grid" style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:64, alignItems:"center" }}>
          <div className="hero-text-col">
            <FadeUp delay={50}>
              <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(44px,6.5vw,82px)", fontWeight:900, lineHeight:1.02, letterSpacing:"-2.5px", color:C.ink }}>
                Where every<br/>
                <span style={{ color:C.jade, fontStyle:"italic" }}>brushstroke</span><br/>
                <span style={{ color:C.lavender }}>becomes</span> art
              </h1>
            </FadeUp>
            <FadeUp delay={120}>
              <p className="hero-sub" style={{ fontSize:16, color:C.muted, lineHeight:1.85, marginTop:24, maxWidth:460 }}>
                Sketching, painting, watercolour, oil colour & sculpture — taught hands-on by <strong style={{ color:C.ink, fontWeight:600 }}>Chandra Mohan</strong>, for every age and skill level.
              </p>
            </FadeUp>
            <FadeUp delay={180}>
              <div className="hero-btns" style={{ display:"flex", flexWrap:"wrap", gap:12, marginTop:36 }}>
                <button onClick={() => scrollTo("enroll")} className="pill"
                  style={{ padding:"14px 32px", borderRadius:100, background:`linear-gradient(135deg,${C.forest},${C.jade})`, color:"#fff", fontSize:14, fontWeight:500, boxShadow:`0 8px 24px ${C.jade}44` }}>
                  Enroll now
                </button>
                <button onClick={() => scrollTo("classes")} className="pill"
                  style={{ padding:"14px 28px", borderRadius:100, border:`1.5px solid ${C.border}`, color:C.muted, fontSize:14, background:"none" }}>
                  Explore classes →
                </button>
              </div>
            </FadeUp>
            <FadeUp delay={240}>
              <p className="hero-quote" style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontStyle:"italic", color:C.muted, marginTop:28, opacity:.75 }}>
                "Every line you draw, builds your future."
              </p>
            </FadeUp>
            <FadeUp delay={260}>
              <p className="hero-sub" style={{ fontSize:14, color:C.muted, lineHeight:1.85, marginTop:24, maxWidth:460 }}>
                Rang Tarang is a premier drawing and fine arts academy in Bhagalpur, offering sketching, painting, water colour, oil colour and creative art classes for children and adults.
              </p>
            </FadeUp>
          </div>

          {/* Hero Illustration */}
          <FadeUp delay={80} className="hide-mob">
            <div style={{ position:"relative" }}>
              {/* main illustration frame */}
              <div className="float-anim painting-glow" style={{ borderRadius:36, overflow:"hidden", width:"100%", aspectRatio:"1", background:"transparent", boxShadow:`0 28px 80px ${C.jade}22`, WebkitMaskImage:"radial-gradient(ellipse 96% 94% at 50% 48%, #000 70%, transparent 100%)", maskImage:"radial-gradient(ellipse 96% 94% at 50% 48%, #000 70%, transparent 100%)" }}>
                <HeroIllustration dark={dark}/>
              </div>
              {/* soft ambient edge glow blends the artwork into the hero */}
              <div style={{ position:"absolute", inset:-18, borderRadius:46, background:`radial-gradient(ellipse at center, transparent 62%, ${C.jade}10 82%, transparent 100%)`, filter:"blur(12px)", pointerEvents:"none"}}/>

              {/* floating badge — Certified */}
              <div className="badge-pop" style={{ position:"absolute", top:20, left:-18, background:C.paper, borderRadius:14, padding:"10px 16px", boxShadow:`0 8px 32px rgba(0,0,0,.12)`, border:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <DecoStar size={14} color={C.jade} opacity={1}/>
                  <span style={{ fontSize:12, fontWeight:600, color:C.ink }}>Certified Instructor</span>
                </div>
              </div>

              {/* floating badge — Rating */}
              <div className="badge-pop-2" style={{ position:"absolute", bottom:28, right:-22, background:C.paper, borderRadius:14, padding:"10px 16px", boxShadow:`0 8px 32px rgba(0,0,0,.12)`, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11, color:C.muted, marginBottom:2 }}>Happy students</div>
                <div style={{ display:"flex", gap:3 }}>{"★★★★★".split("").map((s,i)=><span key={i} style={{ color:C.jade, fontSize:14 }}>{s}</span>)}</div>
              </div>

              {/* floating badge — Gold Medalist */}
              <div className="badge-pop-3 shimmer" style={{ position:"absolute", bottom:100, left:-22, background:C.lavLight, borderRadius:14, padding:"10px 16px", boxShadow:`0 8px 32px rgba(0,0,0,.1)`, border:`1px solid ${C.lavender}44` }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:16 }}>🏅</span>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, color:C.lavender }}>Gold Medalist</div>
                    <div style={{ fontSize:10, color:C.muted }}>Fine Arts, National</div>
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Stats strip */}
        <div ref={statsRef}>
          <FadeUp delay={280}>
            <div style={{ marginTop:72, display:"flex", flexWrap:"wrap", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"28px 0" }}>
              {[["6","+","courses offered"],["25","+","years experience"],["5","★","student rating"],["10000","+","students taught"]].map(([v,s,l],i) => (
                <div key={l} style={{ flex:"1 1 120px", textAlign:"center", padding:"0 16px", borderLeft:i>0?`1px solid ${C.border}`:"none" }}>
                  <StatCard value={parseInt(v)} suffix={s} label={l} active={statsVis} C={C}/>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background:dark?"#0e0c0c":C.forest+"18", padding:"100px 24px", position:"relative", overflow:"hidden" }}>
        {/* animated bg deco */}
        <div style={{ position:"absolute", top:40, right:60, opacity:.06 }}><DecoCircle size={240} color={C.lavender} opacity={1}/></div>
        <div style={{ position:"absolute", bottom:60, left:40 }} className="float-anim-slow"><DecoLeaf size={64} color={C.jade} opacity={.12}/></div>
        {/* extra ambient blob */}
        <div className="morph-blob" style={{ position:"absolute", top:-40, left:-60, width:320, height:320, background:`radial-gradient(ellipse at 50% 50%, ${C.jade}0a, transparent 70%)`, pointerEvents:"none" }}/>

        <div className="two-col" style={{ maxWidth:1160, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:72, alignItems:"center" }}>
          {/* LEFT: instructor card with slide-in-left */}
          <SlideInLeft>
            <div style={{ position:"relative" }}>
              <div style={{ background:C.paper, borderRadius:28, padding:"44px 36px", textAlign:"center", boxShadow:`0 4px 48px rgba(0,0,0,.08)`, border:`1px solid ${C.border}`, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${C.forest},${C.jade},${C.lavender})` }}/>
                {/* avatar */}
                <ScaleIn delay={200}>
                  <div style={{ position:"relative", width:88, height:88, margin:"12px auto 20px" }}>
                    <img src="data:image/jpeg;base64,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" alt="Chandra Mohan" style={{ width:88, height:88, borderRadius:"50%", objectFit:"cover", display:"block", boxShadow:"0 2px 12px rgba(0,0,0,.15)" }}/>
                    <div style={{ position:"absolute", inset:-4, borderRadius:"50%", border:`2px solid ${C.jade}44` }}/>
                  </div>
                </ScaleIn>
                <FadeIn delay={300}>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:C.ink }}>Chandra Mohan</h3>
                  <p style={{ fontSize:12, color:C.jade, fontWeight:600, marginTop:6, letterSpacing:".6px", textTransform:"uppercase" }}>Founder & Lead Instructor</p>
                  <div style={{ width:40, height:2, background:`linear-gradient(90deg,${C.jade},${C.lavender})`, margin:"16px auto" }}/>
                  <p style={{ fontSize:14, color:C.muted, lineHeight:1.8 }}>Guiding students of every age through sketching, painting and sculpture with patience and a hands-on creative teaching style.</p>
                </FadeIn>
                {/* gold medal block */}
                <FadeIn delay={450}>
                  <div className="shimmer" style={{ marginTop:24, padding:"14px 18px", borderRadius:14, background:C.jadeLight, border:`1.5px solid ${C.jade}44`, display:"flex", alignItems:"center", gap:12, textAlign:"left" }}>
                    <span style={{ fontSize:26, flexShrink:0 }}>🏅</span>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:C.jade }}>Gold Medalist</p>
                      <p style={{ fontSize:12, color:C.muted, lineHeight:1.5, marginTop:2 }}>Awarded for excellence in Fine Arts — nationally recognised.</p>
                    </div>
                  </div>
                </FadeIn>
              </div>
              <div style={{ position:"absolute", top:-16, right:-16 }}><DecoStar size={28} color={C.lavender} opacity={.5}/></div>
              <div style={{ position:"absolute", bottom:-10, left:-10 }}><DecoStar size={18} color={C.jade} opacity={.35}/></div>
            </div>
          </SlideInLeft>

          {/* RIGHT: text + illustration with slide-in-right & fade */}
          <div>
            <SlideInRight>
              <FadeIn delay={50}>
                <p style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.jade, marginBottom:16 }}>About Rang Tarang</p>
              </FadeIn>
              <FadeIn delay={120}>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(32px,4vw,54px)", fontWeight:700, lineHeight:1.1, letterSpacing:"-1.5px", color:C.ink, marginBottom:24 }}>
                  Where every stroke<br/><em style={{ color:C.jade }}>tells a story</em>
                </h2>
              </FadeIn>
              <FadeIn delay={200}>
                <p style={{ fontSize:15, color:C.muted, lineHeight:1.9, marginBottom:16 }}>
                  Rang Tarang Drawing Classes is built on a simple belief — that creativity can be taught, nurtured and turned into a lifelong skill. Under the guidance of <strong style={{ color:C.ink, fontWeight:600 }}>Chandra Mohan</strong>, a nationally recognised <strong style={{ color:C.jade }}>Gold Medalist in Fine Arts</strong>, students learn through practical, hands-on sessions with individual attention for every learner.
                </p>
              </FadeIn>
              <FadeIn delay={280}>
                <p style={{ fontSize:15, color:C.muted, lineHeight:1.9, marginBottom:28 }}>
                  From a first pencil sketch to confident oil paintings, our courses build technique step by step while keeping the joy of making art at the centre of every class.
                </p>
              </FadeIn>
            </SlideInRight>

            {/* Illustration — Artist at Easel */}
            <ParallaxFade>
              <div style={{ borderRadius:20, overflow:"hidden", border:`1px solid ${C.border}`, marginBottom:24, boxShadow:`0 8px 32px rgba(0,0,0,.07)`, aspectRatio:"11/8" }}>
                <IllustrationArtist dark={dark}/>
              </div>
            </ParallaxFade>

            {/* Affiliation card */}
            <FadeIn delay={320}>
              <div className="card-lift" style={{ background:C.jadeLight, borderRadius:16, padding:"20px 18px", border:`1.5px solid ${C.jade}55`, marginBottom:12, display:"flex", alignItems:"flex-start", gap:14 }}>
                <span style={{ fontSize:22, flexShrink:0, lineHeight:1.3 }}>🏛️</span>
                <div>
                  <p style={{ fontSize:13, fontWeight:700, color:C.jade, marginBottom:4 }}>Affiliated Institution</p>
                  <p style={{ fontSize:13, color:C.ink, fontWeight:500, lineHeight:1.6 }}>Rang Tarang is affiliated with <strong>Prachin Kala Kendra, Chandigarh</strong> — one of India's most respected cultural institutions for visual arts education.</p>
                </div>
              </div>
            </FadeIn>

            {/* Feature card — only All Ages */}
            <div style={{ display:"flex", justifyContent:"center" }}>
              <FadeIn delay={420}>
                <div className="card-lift" style={{ background:C.card, borderRadius:16, padding:"20px 24px", border:`1px solid ${C.border}`, maxWidth:280, width:"100%", textAlign:"center" }}>
                  <span style={{ fontSize:14, color:C.jade }}>✦</span>
                  <p style={{ fontSize:13, fontWeight:600, color:C.ink, marginTop:8, marginBottom:4 }}>All Ages</p>
                  <p style={{ fontSize:12, color:C.muted, lineHeight:1.6 }}>Kids, teens &amp; adults welcome</p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLASSES ── */}
      <section id="classes" style={{ padding:"clamp(60px,8vw,100px) clamp(12px,4vw,24px)", position:"relative" }}>
        <div style={{ position:"absolute", top:80, left:32 }} className="float-anim"><DecoLeaf size={32} color={C.lavender} opacity={.12}/></div>
        <div style={{ position:"absolute", bottom:100, right:40 }} className="float-anim-slow"><DecoBrush size={56} color={C.jade} opacity={.1}/></div>

        <div style={{ maxWidth:1160, margin:"0 auto" }}>
          {/* Section header with palette illustration side by side */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:48, alignItems:"center", marginBottom:60 }}>
            <FadeUp>
              <div>
                <p style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.jade, marginBottom:12 }}>Courses Offered</p>
                <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,50px)", fontWeight:700, letterSpacing:"-1px", color:C.ink }}>Find your medium</h2>
                <button onClick={() => scrollTo("enroll")} className="pill hide-mob"
                  style={{ marginTop:20, padding:"11px 24px", borderRadius:100, border:`1.5px solid ${C.border}`, color:C.muted, fontSize:13, background:"none" }}>
                  Join a class →
                </button>
              </div>
            </FadeUp>
            <ParallaxFade className="hide-mob">
              <div style={{ width:220, height:160, borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}`, opacity:.9 }}>
                <IllustrationPalette dark={dark}/>
              </div>
            </ParallaxFade>
          </div>

          {/* Courses grid — all 10 courses, each with a colourful related cover illustration */}
          {(() => {
            const icons = ["✏️","🖌️","💧","🎨","🏺","🎓","🎯","💎","🖼️","🏆"];
            const isSpecial = (idx) => idx >= 5;
            return (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16, marginBottom:48 }}>
                {COURSES.map((c, i) => {
                  const special = isSpecial(i);
                  const cardBg = activeCard===i ? C.jadeLight : C.card;
                  return (
                    <FadeUp key={c.name} delay={i*50}>
                      <div className="card-lift" onClick={() => setActiveCard(activeCard===i?null:i)}
                        style={{ background:cardBg, borderRadius:20, border:`1.5px solid ${special?C.lavender+"66":(activeCard===i?C.jade:C.border)}`, height:"100%", cursor:"pointer", transition:"all .3s cubic-bezier(.16,1,.3,1)", position:"relative", overflow:"hidden" }}>
                        {/* Colourful cover illustration, related to the course */}
                        <div style={{ height:112, backgroundImage:svgBg(COURSE_ART[i]), backgroundSize:"cover", backgroundPosition:"center", position:"relative" }}>
                          <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.18) 100%)" }}/>
                        </div>
                        {special && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${C.lavender},${C.jade},${C.lavender})`, zIndex:2 }}/>}
                        {!special && activeCard===i && <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${C.jade},${C.lavender})`, zIndex:2 }}/>}
                        {special && <div style={{ position:"absolute", top:10, right:12, fontSize:10, fontWeight:700, color:"#fff", letterSpacing:"1px", opacity:.9, textShadow:"0 1px 4px rgba(0,0,0,.45)", zIndex:2 }}>★ FEATURED</div>}
                        <div style={{ position:"relative", padding:"0 22px 28px" }}>
                          <div style={{ width:52, height:52, borderRadius:14, marginTop:-26, marginBottom:16, background:special?`${C.lavender}22`:(activeCard===i?`${C.jade}22`:C.forest+"18"), display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, border:`3px solid ${cardBg}`, boxShadow:"0 3px 10px rgba(0,0,0,.15)" }}>{icons[i]}</div>
                          <span style={{ display:"inline-block", padding:"4px 10px", borderRadius:100, background:special?`${C.lavender}22`:(activeCard===i?`${C.jade}22`:C.jadeLight), color:special?C.lavender:C.jade, fontSize:11, fontWeight:600, letterSpacing:".4px", textTransform:"uppercase", marginBottom:12, border:`1px solid ${special?C.lavender+"44":C.jade+"33"}` }}>{c.tag}</span>
                          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700, color:special?C.lavender:C.ink, marginBottom:10 }}>{c.name}</h3>
                          <p style={{ fontSize:13, color:C.muted, lineHeight:1.8 }}>{c.desc}</p>
                          {activeCard===i && <button onClick={e=>{e.stopPropagation();scrollTo("enroll");}} className="pill" style={{ marginTop:18, padding:"9px 18px", borderRadius:100, background:special?C.lavender:C.jade, color:special?C.midnight:"#fff", fontSize:12, fontWeight:500 }}>Enroll in {c.name} →</button>}
                        </div>
                      </div>
                    </FadeUp>
                  );
                })}
              </div>
            );
          })()}

          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            <FadeUp>
              <div style={{ background:C.card, borderRadius:20, padding:"30px 26px", border:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
                  <div style={{ width:32, height:32, borderRadius:8, background:C.jadeLight, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <DecoCircle size={20} color={C.jade} opacity={0.8}/>
                  </div>
                  <h3 style={{ fontSize:16, fontWeight:600, color:C.ink }}>Regular Schedule</h3>
                </div>
                {[["Saturday","1.5 hrs per session"],["Sunday","1.5 hrs per session"]].map(([d,t]) => (
                  <div key={d} style={{ display:"flex", justifyContent:"space-between", padding:"13px 0", borderTop:`1px solid ${C.divider}` }}>
                    <span style={{ fontSize:14, color:C.muted }}>{d}</span>
                    <span style={{ fontSize:14, fontWeight:500, color:C.ink }}>{t}</span>
                  </div>
                ))}
                <p style={{ fontSize:12, color:C.jade, marginTop:14, fontStyle:"italic" }}>Exact timing shared on enrollment.</p>
              </div>
            </FadeUp>
            <FadeUp delay={80}>
              <div style={{ background:C.card, borderRadius:20, padding:"30px 26px", border:`1px solid ${C.border}` }}>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
                  <DecoStar size={20} color={C.lavender} opacity={.8}/>
                  <h3 style={{ fontSize:16, fontWeight:600, color:C.ink }}>Also Available</h3>
                </div>
                {[["Special Classes","Focused short-term sessions for specific techniques"],["Home Tuitions","One-on-one at your home, on your schedule"],["Online Classes","Live guided sessions from anywhere"]].map(([t,d]) => (
                  <div key={t} style={{ display:"flex", gap:12, padding:"11px 0", borderTop:`1px solid ${C.divider}` }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:C.jade, marginTop:7, flexShrink:0 }}/>
                    <div>
                      <p style={{ fontSize:14, fontWeight:500, color:C.ink }}>{t}</p>
                      <p style={{ fontSize:12, color:C.muted, marginTop:3, lineHeight:1.5 }}>{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="gallery" style={{ background:dark?"#0e0c0c":C.forest+"10", padding:"100px 24px", position:"relative" }}>
        <div style={{ position:"absolute", top:60, right:60, opacity:.08 }} className="spin-slow"><DecoCircle size={200} color={C.lavender} opacity={1}/></div>
        <div style={{ position:"absolute", bottom:80, left:40, opacity:.06 }} className="spin-rev"><DecoCircle size={140} color={C.jade} opacity={1}/></div>

        <div style={{ maxWidth:1160, margin:"0 auto" }}>
          <FadeUp>
            <div style={{ textAlign:"center", marginBottom:64 }}>
              <p style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.jade, marginBottom:12 }}>Student & Studio Work</p>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,50px)", fontWeight:700, letterSpacing:"-1px", color:C.ink }}>Gallery</h2>
              <p style={{ fontSize:15, color:C.muted, marginTop:14, maxWidth:440, margin:"14px auto 0" }}>Works spanning every medium taught at Rang Tarang</p>
            </div>
          </FadeUp>

          <GalleryCarousel gallery={GALLERY} paintingMap={paintingMap} dark={dark} C={C}/>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding:"clamp(60px,8vw,100px) clamp(12px,4vw,24px)", position:"relative" }}>
        <div style={{ position:"absolute", bottom:80, left:40 }} className="float-anim"><DecoLeaf size={44} color={C.lavender} opacity={.1}/></div>
        <div style={{ position:"absolute", top:80, right:60 }} className="float-anim-med"><DecoStar size={20} color={C.jade} opacity={.2}/></div>

        <div className="contact-grid" style={{ maxWidth:1160, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:64, alignItems:"start" }}>
          <FadeUp>
            <p style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.jade, marginBottom:16 }}>Get In Touch</p>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:700, letterSpacing:"-1px", color:C.ink, marginBottom:32 }}>Visit or call us</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:22, marginBottom:36 }}>
              {[["📍","Ramsar Chowk, Urdu Bazar, Bhagalpur, Bihar 812002",null],["📞","9905030035","tel:9905030035"],["🕐","Saturday & Sunday · 1.5 hrs per session",null]].map(([icon,text,href],i) => (
                <div key={i} style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <span style={{ fontSize:18, lineHeight:1.4 }}>{icon}</span>
                  {href
                    ? <a href={href} style={{ fontSize:15, color:C.jade, fontWeight:500 }}>{text}</a>
                    : <p style={{ fontSize:15, color:C.muted, lineHeight:1.6 }}>{text}</p>}
                </div>
              ))}
            </div>
            {/* colorful art supplies accent */}
            <div className="ink-accent" style={{ marginBottom:24, borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}`, width:"100%" }}>
              <ContactAccentIllustration dark={dark}/>
            </div>
            {/* Map card — opens Google Maps in new tab */}
            <a href="https://maps.app.goo.gl/CmSJ9dMaK9oam12D6" target="_blank" rel="noopener noreferrer"
              style={{ display:"block", borderRadius:16, overflow:"hidden", border:`1px solid ${C.border}`, textDecoration:"none", cursor:"pointer" }}>
              <div style={{ position:"relative", height:220, background:dark?"#111010":"#e8f0ec", overflow:"hidden" }}>
                {/* SVG illustrated map */}
                <svg width="100%" height="220" viewBox="0 0 400 220" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* grid lines */}
                  {[0,40,80,120,160,200].map(y=><line key={`h${y}`} x1={0} y1={y} x2={400} y2={y} stroke={dark?"#2E4540":"#c8ddd8"} strokeWidth={0.7} opacity={0.5}/>)}
                  {[0,50,100,150,200,250,300,350,400].map(x=><line key={`v${x}`} x1={x} y1={0} x2={x} y2={220} stroke={dark?"#2E4540":"#c8ddd8"} strokeWidth={0.7} opacity={0.5}/>)}
                  {/* roads */}
                  <path d="M0 110 Q100 100 200 110 Q300 120 400 105" stroke={dark?"#2E4540":"#b0c8c0"} strokeWidth={10} fill="none"/>
                  <path d="M0 110 Q100 100 200 110 Q300 120 400 105" stroke={dark?"#0B0909":"#e8f0ec"} strokeWidth={7} fill="none"/>
                  <path d="M200 0 Q195 55 200 110 Q205 165 200 220" stroke={dark?"#2E4540":"#b0c8c0"} strokeWidth={8} fill="none"/>
                  <path d="M200 0 Q195 55 200 110 Q205 165 200 220" stroke={dark?"#0B0909":"#e8f0ec"} strokeWidth={5} fill="none"/>
                  <path d="M50 0 Q70 60 80 110 Q90 160 85 220" stroke={dark?"#2E4540":"#c8ddd8"} strokeWidth={5} fill="none" opacity={0.6}/>
                  <path d="M320 0 Q310 80 315 110 Q318 150 325 220" stroke={dark?"#2E4540":"#c8ddd8"} strokeWidth={5} fill="none" opacity={0.6}/>
                  <path d="M0 170 Q120 162 200 168 Q300 175 400 165" stroke={dark?"#2E4540":"#c8ddd8"} strokeWidth={5} fill="none" opacity={0.6}/>
                  <path d="M0 55 Q130 50 200 55 Q280 60 400 50" stroke={dark?"#2E4540":"#c8ddd8"} strokeWidth={4} fill="none" opacity={0.5}/>
                  {/* blocks */}
                  {[[15,15,60,35],[90,20,55,30],[170,20,40,28],[260,20,70,32],[345,18,45,35],[15,75,50,28],[85,72,65,30],[170,68,35,26],[255,70,70,30],[345,72,45,30],[15,135,55,28],[85,132,60,30],[175,136,30,25],[258,133,68,28],[350,135,40,28]].map(([x,y,w,h],i)=>(
                    <rect key={i} x={x} y={y} width={w} height={h} rx={3} fill={dark?"#2E4540":"#c8ddd8"} opacity={0.4}/>
                  ))}
                  {/* water body */}
                  <ellipse cx={330} cy={170} rx={50} ry={28} fill="#408175" opacity={0.25}/>
                  <ellipse cx={330} cy={170} rx={38} ry={18} fill="#408175" opacity={0.2}/>
                  {/* park */}
                  <ellipse cx={70} cy={180} rx={40} ry={22} fill="#2E4540" opacity={0.3}/>
                  {/* pin — Ramsar Chowk, Urdu Bazar */}
                  <circle cx={152} cy={118} r={22} fill="#408175" opacity={0.18}/>
                  <circle cx={152} cy={118} r={14} fill="#408175" opacity={0.3}/>
                  <circle cx={152} cy={112} r={9} fill="#408175"/>
                  <circle cx={152} cy={112} r={4} fill="#B5B9F0"/>
                  <path d="M152 121 L148 130 L152 138 L156 130Z" fill="#408175"/>
                  {/* label */}
                  <rect x={162} y={104} width={92} height={20} rx={4} fill="#408175" opacity={0.9}/>
                  <text x={208} y={118} textAnchor="middle" fontFamily="sans-serif" fontSize={9} fill="#fff" fontWeight="600">Rang Tarang Classes</text>
                </svg>
                {/* overlay label */}
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"10px 14px", background:dark?"rgba(11,9,9,.75)":"rgba(255,255,255,.82)", backdropFilter:"blur(6px)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <p style={{ fontSize:12, fontWeight:600, color:C.ink }}>Ramsar Chowk, Urdu Bazar, Bhagalpur</p>
                    <p style={{ fontSize:11, color:C.muted }}>Bihar 812002</p>
                  </div>
                  <span style={{ fontSize:12, color:C.jade, fontWeight:500 }}>Open Maps →</span>
                </div>
              </div>
            </a>
          </FadeUp>

          {/* FORM */}
          <FadeUp delay={100}>
            <div id="enroll" style={{ background:C.card, borderRadius:28, padding:"clamp(24px,5vw,48px) clamp(16px,5vw,40px)", border:`1px solid ${C.border}`, boxShadow:`0 12px 56px rgba(0,0,0,.07)`, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${C.forest},${C.jade},${C.lavender})` }}/>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color:C.ink, marginBottom:8 }}>Enroll now</h3>
              <p style={{ fontSize:14, color:C.muted, marginBottom:30, lineHeight:1.7 }}>Fill in your details and we'll call you back to confirm your batch.</p>

              {submitted ? (
                <div style={{ textAlign:"center", padding:"48px 20px", background:C.jadeLight, borderRadius:16 }}>
                  <div style={{ fontSize:48, marginBottom:16 }}>🎨</div>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:700, color:C.jade, marginBottom:10 }}>
                    Thank you, {form.name || "friend"}!
                  </p>
                  <p style={{ fontSize:14, color:C.muted, lineHeight:1.7 }}>
                    We've received your enrollment request.<br/>
                    We'll call you at <strong style={{ color:C.ink }}>{form.phone}</strong> shortly to confirm your batch.
                  </p>
                  <button
                    onClick={() => {
                      setForm({ name:"", phone:"", course:["Sketching"], mode:"In-studio", message:"" });
                      setSubmitted(false);
                      setSubmitError(null);
                    }}
                    style={{ marginTop:24, fontSize:13, color:C.jade, fontWeight:600, textDecoration:"underline", background:"none", border:"none", cursor:"pointer" }}>
                    Submit another response
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnroll} style={{ display:"flex", flexDirection:"column", gap:18 }}>
                  {/* Name */}
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:".8px" }}>Full Name *</label>
                    <input
                      type="text" name="Name" required
                      value={form.name} onChange={e => setForm({...form, name:e.target.value})}
                      placeholder="Your name"
                      style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:`1px solid ${C.border}`, background:C.bg, color:C.ink, fontSize:14 }}/>
                  </div>

                  {/* Phone */}
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:".8px" }}>Phone Number *</label>
                    <input
                      type="tel" name="Phone" required
                      value={form.phone} onChange={e => setForm({...form, phone:e.target.value})}
                      placeholder="10-digit number" pattern="[0-9]{10}"
                      style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:`1px solid ${C.border}`, background:C.bg, color:C.ink, fontSize:14 }}/>
                  </div>

                  {/* Courses multi-select + Mode */}
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:".8px" }}>Course(s) — select all that apply</label>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:8, padding:"14px 16px", borderRadius:12, border:`1px solid ${C.border}`, background:C.bg }}>
                      {COURSES.map(c => {
                        const checked = form.course.includes(c.name);
                        return (
                          <label key={c.name} style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer", userSelect:"none" }}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                const next = checked
                                  ? form.course.filter(x => x !== c.name)
                                  : [...form.course, c.name];
                                setForm({...form, course: next.length ? next : [c.name]});
                              }}
                              style={{ accentColor:C.jade, width:15, height:15, cursor:"pointer" }}
                            />
                            <span style={{ fontSize:13, color:checked?C.jade:C.muted, fontWeight:checked?600:400, transition:"color .2s" }}>{c.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  {/* Mode */}
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:".8px" }}>Mode</label>
                    <select name="Mode" value={form.mode} onChange={e => setForm({...form, mode:e.target.value})}
                      style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:`1px solid ${C.border}`, background:C.bg, color:C.ink, fontSize:14 }}>
                      {["In-studio","Home Tuition","Online"].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label style={{ fontSize:11, fontWeight:600, color:C.muted, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:".8px" }}>Message (optional)</label>
                    <textarea
                      rows={3} name="Message"
                      value={form.message} onChange={e => setForm({...form, message:e.target.value})}
                      placeholder="Tell us about your interest or preferred timing"
                      style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:`1px solid ${C.border}`, background:C.bg, color:C.ink, fontSize:14, resize:"none" }}/>
                  </div>

                  {/* Submission error, if the request failed */}
                  {submitError && (
                    <div style={{ padding:"12px 16px", borderRadius:12, background:"#fee2e2", border:"1px solid #fca5a5", fontSize:13, color:"#991b1b" }}>
                      {submitError}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting || !form.name.trim() || !form.phone.trim()}
                    className="pill"
                    style={{ width:"100%", padding:"15px", borderRadius:100, background: submitting ? C.forest : `linear-gradient(90deg,${C.forest},${C.jade})`, color:"#fff", fontSize:14, fontWeight:600, opacity:(!form.name.trim() || !form.phone.trim()) ? 0.5 : 1, cursor:(!form.name.trim() || !form.phone.trim() || submitting) ? "not-allowed" : "pointer", transition:"all .3s", display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
                    {submitting ? (
                      <>
                        <span style={{ width:16, height:16, border:"2px solid #ffffff44", borderTop:"2px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.8s linear infinite" }}/>
                        Sending…
                      </>
                    ) : "Submit enrollment"}
                  </button>
                </form>
              )}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background:C.midnight, padding:"48px 24px" }}>
        <div style={{ maxWidth:1160, margin:"0 auto" }}>
          <div style={{ display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:20, marginBottom:24 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <img src="data:image/png;base64,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" alt="Rang Tarang" style={{ width:34, height:34, objectFit:"contain", filter:"brightness(1.2) drop-shadow(0 0 6px #40817555)" }}/>
              <div style={{ display:"flex", alignItems:"baseline", gap:3 }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:900, color:C.jade }}>Rang</span>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:400, fontStyle:"italic", color:"#CCC8C8" }}>Tarang</span>
              </div>
            </div>
            <div style={{ display:"flex", gap:28 }}>
              {NAV.map(l => (
                <a key={l} href={`#${l}`} onClick={e => { e.preventDefault(); scrollTo(l); }} className="n-link"
                  style={{ fontSize:13, color:"#6B7180", textTransform:"capitalize" }}>
                  {l}
                </a>
              ))}
            </div>
          </div>
          {/* palette strip */}
          <div style={{ display:"flex", gap:6, marginBottom:20 }}>
            {["#0B0909","#2E4540","#408175","#B5B9F0"].map(hex => (
              <div key={hex} style={{ height:3, flex:1, background:hex, borderRadius:2, opacity:.6 }}/>
            ))}
          </div>
          <div style={{ borderTop:"1px solid #1E1C1C", paddingTop:20, display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:12 }}>
            <p style={{ fontSize:13, color:"#4A5060", fontStyle:"italic" }}>Discover yourself, through art.</p>
            <p style={{ fontSize:12, color:"#3A4050" }}>© {new Date().getFullYear()} Rang Tarang · Taught by Chandra Mohan, Gold Medalist in Fine Arts</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
