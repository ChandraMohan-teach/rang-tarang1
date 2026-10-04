import g1 from './assets/gallery/g1.jpeg';
import g2 from './assets/gallery/g2.jpeg';
import g3 from './assets/gallery/g3.jpeg';
import g4 from './assets/gallery/g4.jpeg';
import g5 from './assets/gallery/g5.jpeg';
import g6 from './assets/gallery/g6.jpeg';
import g7 from './assets/gallery/g7.jpeg';
import logoImg from './assets/logo.png';
import teacherImg from './assets/teacher.jpg';
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
              <div style={{ aspectRatio: '4/3', overflow: 'hidden', pointerEvents: 'none', background: dark ? '#1a1a1a' : '#f5f5f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={g.image} alt={`${g.label} (${g.sub}) — student artwork from Rang Tarang Fine Arts Academy, Bhagalpur`} loading="lazy" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
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

  /* ── AI CHATBOT STATE ── */
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: "assistant", content: "Namaste! 🎨 I'm the Rang Tarang assistant. Ask me about our classes, or any drawing & painting question — shading, colours, perspective, NIFT/NID prep and more!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [showChatHint, setShowChatHint] = useState(false);

  /* Show a small "I can assist you" bubble next to the AI icon */
  useEffect(() => {
    const show = setTimeout(() => setShowChatHint(true), 2500);
    const hide = setTimeout(() => setShowChatHint(false), 20000);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, []);
  useEffect(() => { if (chatOpen) setShowChatHint(false); }, [chatOpen]);

  useEffect(() => {
    if (chatOpen && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, chatOpen]);

  const sendChatMessage = async () => {
    const text = chatInput.trim();
    if (!text || chatLoading) return;

    const userMsg = { role: "user", content: text };
    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput("");
    setChatLoading(true);

    try {
      const apiMessages = updatedMessages
        .filter((_, i) => i > 0)
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      const data = await response.json().catch(() => ({}));
      const reply = response.status === 429
        ? (data.error || "You're sending messages quite fast — please wait a few minutes, or call us at 9905030035!")
        : (data.reply || "Sorry, I couldn't get a response. Please call us at 9905030035!");
      setChatMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please call us at 9905030035 — we're happy to help!" }]);
    } finally {
      setChatLoading(false);
    }
  };

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
  const [phoneTouched, setPhoneTouched] = useState(false);
  const PHONE_RE = /^[6-9][0-9]{9}$/;
  const PHONE_ERROR = "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8 or 9).";

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    if (!PHONE_RE.test(form.phone.trim())) { setPhoneTouched(true); return; }

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
        /* ── AI CHATBOT ── */
        .chat-hint{animation:hintIn .5s cubic-bezier(.16,1,.3,1)}
        @keyframes hintIn{from{opacity:0;transform:translateX(-10px) scale(.95)}to{opacity:1;transform:translateX(0) scale(1)}}
        .chat-pulse{animation:chatPulse 2.4s ease-out infinite}
        @keyframes chatPulse{0%{box-shadow:0 0 0 0 rgba(64,129,117,.55)}70%{box-shadow:0 0 0 14px rgba(64,129,117,0)}100%{box-shadow:0 0 0 0 rgba(64,129,117,0)}}
        @media(max-width:480px){.chat-hint{font-size:12px!important;white-space:normal!important;width:170px}}
        .chat-bubble-btn{transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s}
        .chat-bubble-btn:hover{transform:scale(1.1);box-shadow:0 8px 32px rgba(64,129,117,.6)!important}
        .chat-window{animation:chatSlideUp .32s cubic-bezier(.16,1,.3,1)}
        @keyframes chatSlideUp{from{opacity:0;transform:translateY(24px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}
        .chat-msg-user{animation:msgIn .22s cubic-bezier(.16,1,.3,1)}
        .chat-msg-bot{animation:msgIn .22s cubic-bezier(.16,1,.3,1)}
        @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .chat-send-btn:hover{opacity:.88;transform:scale(1.08)}
        .chat-send-btn{transition:opacity .15s,transform .2s}
        .chat-input:focus{outline:none}
        .chat-dots span{display:inline-block;width:6px;height:6px;border-radius:50%;background:#408175;margin:0 2px;animation:dotBounce 1.2s ease-in-out infinite}
        .chat-dots span:nth-child(2){animation-delay:.2s}
        .chat-dots span:nth-child(3){animation-delay:.4s}
        @keyframes dotBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-8px)}}
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
              <img src={logoImg} alt="Rang Tarang Fine Arts Academy logo" style={{ width:38, height:38, objectFit:"contain", filter: dark ? "brightness(1.2) drop-shadow(0 0 4px #40817566)" : "drop-shadow(0 1px 3px #2E454033)" }}/>
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
      <section id="home" style={{ position:"relative", maxWidth:1160, margin:"0 auto", padding:"100px 24px 100px", overflow:"hidden" }}>
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

        <div className="hero-grid" style={{ display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:80, alignItems:"center" }}>
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
            <div style={{ marginTop:88, display:"flex", flexWrap:"wrap", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"36px 0" }}>
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
      <section id="about" style={{ background:dark?"#0e0c0c":C.forest+"18", padding:"120px 24px", position:"relative", overflow:"hidden" }}>
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
                    <img src={teacherImg} alt="Chandra Mohan, Gold Medalist teacher at Rang Tarang Fine Arts Academy, Bhagalpur" style={{ width:88, height:88, borderRadius:"50%", objectFit:"cover", display:"block", boxShadow:"0 2px 12px rgba(0,0,0,.15)" }}/>
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
      <section id="classes" style={{ padding:"clamp(80px,8vw,110px) clamp(16px,4vw,24px)", position:"relative" }}>
        <div style={{ position:"absolute", top:80, left:32 }} className="float-anim"><DecoLeaf size={32} color={C.lavender} opacity={.12}/></div>
        <div style={{ position:"absolute", bottom:100, right:40 }} className="float-anim-slow"><DecoBrush size={56} color={C.jade} opacity={.1}/></div>

        <div style={{ maxWidth:1160, margin:"0 auto" }}>
          {/* Section header with palette illustration side by side */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:48, alignItems:"center", marginBottom:72 }}>
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
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:24, marginBottom:64 }}>
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

          <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:24 }}>
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
      <section id="gallery" style={{ background:dark?"#0e0c0c":C.forest+"10", padding:"120px 24px", position:"relative" }}>
        <div style={{ position:"absolute", top:60, right:60, opacity:.08 }} className="spin-slow"><DecoCircle size={200} color={C.lavender} opacity={1}/></div>
        <div style={{ position:"absolute", bottom:80, left:40, opacity:.06 }} className="spin-rev"><DecoCircle size={140} color={C.jade} opacity={1}/></div>

        <div style={{ maxWidth:1160, margin:"0 auto" }}>
          <FadeUp>
            <div style={{ textAlign:"center", marginBottom:80 }}>
              <p style={{ fontSize:11, fontWeight:600, letterSpacing:"2px", textTransform:"uppercase", color:C.jade, marginBottom:12 }}>Student & Studio Work</p>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,4vw,50px)", fontWeight:700, letterSpacing:"-1px", color:C.ink }}>Gallery</h2>
              <p style={{ fontSize:15, color:C.muted, marginTop:14, maxWidth:440, margin:"14px auto 0" }}>Works spanning every medium taught at Rang Tarang</p>
            </div>
          </FadeUp>

          <GalleryCarousel gallery={GALLERY} paintingMap={paintingMap} dark={dark} C={C}/>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding:"clamp(80px,8vw,110px) clamp(16px,4vw,24px)", position:"relative" }}>
        <div style={{ position:"absolute", bottom:80, left:40 }} className="float-anim"><DecoLeaf size={44} color={C.lavender} opacity={.1}/></div>
        <div style={{ position:"absolute", top:80, right:60 }} className="float-anim-med"><DecoStar size={20} color={C.jade} opacity={.2}/></div>

        <div className="contact-grid" style={{ maxWidth:1160, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1.2fr", gap:80, alignItems:"start" }}>
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
                      type="tel" name="Phone" required inputMode="tel" autoComplete="tel-national" maxLength={10}
                      value={form.phone}
                      onChange={e => { e.target.setCustomValidity(""); setForm({...form, phone:e.target.value.replace(/\D/g, "")}); }}
                      onBlur={() => setPhoneTouched(true)}
                      onInvalid={e => { setPhoneTouched(true); e.target.setCustomValidity(PHONE_ERROR); }}
                      placeholder="10-digit number" pattern="[6-9][0-9]{9}" title={PHONE_ERROR}
                      aria-invalid={phoneTouched && form.phone !== "" && !PHONE_RE.test(form.phone)}
                      style={{ width:"100%", padding:"12px 16px", borderRadius:12, border:`1px solid ${phoneTouched && form.phone !== "" && !PHONE_RE.test(form.phone) ? "#D64545" : C.border}`, background:C.bg, color:C.ink, fontSize:14 }}/>
                    {phoneTouched && form.phone !== "" && !PHONE_RE.test(form.phone) && (
                      <p role="alert" style={{ color:"#D64545", fontSize:12, marginTop:6 }}>{PHONE_ERROR}</p>
                    )}
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
              <img src={logoImg} alt="Rang Tarang Fine Arts Academy logo" style={{ width:34, height:34, objectFit:"contain", filter:"brightness(1.2) drop-shadow(0 0 6px #40817555)" }}/>
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

      {/* ── AI CHATBOT ── */}
      <div style={{ position:"fixed", bottom:28, left:28, zIndex:9998, display:"flex", flexDirection:"column", alignItems:"flex-start", gap:12 }}>

        {/* Chat window */}
        {chatOpen && (
          <div className="chat-window" style={{
            width: "min(360px, calc(100vw - 56px))",
            height: 480,
            background: dark ? "#161414" : "#FDFCFA",
            borderRadius: 24,
            boxShadow: "0 24px 80px rgba(0,0,0,.22), 0 4px 16px rgba(0,0,0,.1)",
            border: `1px solid ${dark ? "#2A2828" : "#DDD9D4"}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #2E4540, #408175)", padding: "16px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🎨</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 15, fontWeight: 700, color: "#fff" }}>Rang Tarang Assistant</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", display: "flex", alignItems: "center", gap: 5, marginTop: 1 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6BCB77", display: "inline-block" }}/>
                  Online · Ask me anything
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} style={{ background: "rgba(255,255,255,.12)", border: "none", color: "#fff", width: 28, height: 28, borderRadius: "50%", fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "background .2s", flexShrink: 0 }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.25)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,.12)"}
              >✕</button>
            </div>

            {/* FAQ quick chips */}
            {chatMessages.length === 1 && (
              <div style={{ padding: "12px 16px 0", display: "flex", flexWrap: "wrap", gap: 7, flexShrink: 0 }}>
                {["What courses do you offer?", "How do I learn shading?", "How do I mix colours?", "How to prepare for NIFT/NID?", "How do I enroll?"].map(q => (
                  <button key={q} onClick={async () => {
                    if (chatLoading) return;
                    const userMsg = { role: "user", content: q };
                    const updatedMessages = [...chatMessages, userMsg];
                    setChatMessages(updatedMessages);
                    setChatLoading(true);
                    try {
                      const apiMessages = updatedMessages
                        .filter((_, i) => i > 0)
                        .map(m => ({ role: m.role, content: m.content }));
                      const response = await fetch("/api/chat", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ messages: apiMessages }),
                      });
                      const data = await response.json().catch(() => ({}));
                      const reply = response.status === 429
                        ? (data.error || "You're sending messages quite fast — please wait a few minutes, or call us at 9905030035!")
                        : (data.reply || "Please call us at 9905030035!");
                      setChatMessages(p => [...p, { role: "assistant", content: reply }]);
                    } catch {
                      setChatMessages(p => [...p, { role: "assistant", content: "Sorry, something went wrong. Please call us at 9905030035!" }]);
                    } finally {
                      setChatLoading(false);
                    }
                  }}
                    style={{ padding: "5px 11px", borderRadius: 100, border: `1px solid ${dark?"#2A2828":"#DDD9D4"}`, background: dark?"#1e1c1c":"#f0ede8", color: dark?"#B5B9F0":"#408175", fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap" }}
                    onMouseEnter={e=>{e.currentTarget.style.background=dark?"#2E4540":"#e0f0ec";e.currentTarget.style.borderColor="#408175"}}
                    onMouseLeave={e=>{e.currentTarget.style.background=dark?"#1e1c1c":"#f0ede8";e.currentTarget.style.borderColor=dark?"#2A2828":"#DDD9D4"}}
                  >{q}</button>
                ))}
              </div>
            )}

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
              {chatMessages.map((msg, i) => (
                <div key={i} className={msg.role === "user" ? "chat-msg-user" : "chat-msg-bot"}
                  style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                  {msg.role === "assistant" && (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg,#2E4540,#408175)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0, marginRight:8, marginTop:2 }}>🎨</div>
                  )}
                  <div style={{
                    maxWidth: "78%",
                    padding: "10px 14px",
                    borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: msg.role === "user"
                      ? "linear-gradient(135deg,#2E4540,#408175)"
                      : (dark ? "#1e1c1c" : "#F0EDE8"),
                    color: msg.role === "user" ? "#fff" : (dark ? "#EEECf5" : "#0B0909"),
                    fontSize: 13,
                    lineHeight: 1.6,
                    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
                  }}>{msg.content}</div>
                </div>
              ))}
              {chatLoading && (
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#2E4540,#408175)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, flexShrink:0 }}>🎨</div>
                  <div style={{ padding:"10px 14px", borderRadius:"18px 18px 18px 4px", background:dark?"#1e1c1c":"#F0EDE8" }}>
                    <div className="chat-dots"><span/><span/><span/></div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef}/>
            </div>

            {/* Input */}
            <div style={{ padding: "12px 16px", borderTop: `1px solid ${dark?"#1E1C1C":"#E8E4E0"}`, display: "flex", gap: 10, alignItems: "center", flexShrink: 0, background: dark?"#111010":"#fff" }}>
              <input
                className="chat-input"
                value={chatInput}
                maxLength={1000}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChatMessage()}
                placeholder="Ask about courses, timings…"
                style={{ flex:1, padding:"10px 14px", borderRadius:100, border:`1px solid ${dark?"#2A2828":"#DDD9D4"}`, background:dark?"#1e1c1c":"#F4F1ED", color:dark?"#EEECf5":"#0B0909", fontSize:13, fontFamily:"inherit" }}
              />
              <button className="chat-send-btn" onClick={sendChatMessage} disabled={chatLoading || !chatInput.trim()}
                style={{ width:40, height:40, borderRadius:"50%", background:chatInput.trim()?"linear-gradient(135deg,#2E4540,#408175)":"#ccc", border:"none", color:"#fff", fontSize:17, cursor:chatInput.trim()?"pointer":"default", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                ↑
              </button>
            </div>
          </div>
        )}

        {/* "I can assist you" hint bubble */}
        {!chatOpen && showChatHint && (
          <div className="chat-hint" role="status" style={{
            position:"absolute", left:70, bottom:10, background:"#fff", color:"#2E4540",
            padding:"9px 34px 9px 14px", borderRadius:"14px 14px 14px 4px",
            boxShadow:"0 6px 24px rgba(0,0,0,.22)", fontSize:13.5, fontWeight:600,
            fontFamily:"'DM Sans','Segoe UI',sans-serif", whiteSpace:"nowrap", cursor:"pointer",
            border:"1px solid rgba(64,129,117,.25)"
          }} onClick={() => setChatOpen(true)}>
            Hi! 👋 I can assist you with art &amp; classes
            <button type="button" aria-label="Close hint" title="Close"
              onClick={e => { e.stopPropagation(); setShowChatHint(false); }}
              style={{ position:"absolute", right:6, top:"50%", transform:"translateY(-50%)", width:20, height:20, borderRadius:"50%", border:"none", background:"rgba(0,0,0,.08)", color:"#444", fontSize:11, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", padding:0, lineHeight:1 }}>✕</button>
          </div>
        )}

        {/* Toggle button */}
        <button
          className="chat-bubble-btn chat-pulse"
          onClick={() => setChatOpen(o => !o)}
          aria-label="Open AI assistant"
          style={{
            width: 58,
            height: 58,
            borderRadius: "50%",
            background: chatOpen ? "#0B0909" : "linear-gradient(135deg, #2E4540, #408175)",
            border: "none",
            color: "#fff",
            fontSize: 24,
            cursor: "pointer",
            boxShadow: "0 4px 24px rgba(64,129,117,.45), 0 1px 6px rgba(0,0,0,.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background .3s, transform .25s cubic-bezier(.34,1.56,.64,1)",
          }}
        >
          {chatOpen ? "✕" : "✦"}
        </button>
      </div>

      {/* ── WHATSAPP FLOATING BUTTON ── */}
      <a
        href="https://wa.me/919905030035?text=Hi%2C%20I%20am%20interested%20in%20joining%20Rang%20Tarang%20Classes.%20Please%20share%20more%20details."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "linear-gradient(135deg, #2E4540, #408175)",
          borderRadius: 100,
          padding: "12px 20px 12px 14px",
          boxShadow: "0 4px 24px rgba(64,129,117,.45), 0 1px 6px rgba(0,0,0,.25)",
          textDecoration: "none",
          transition: "transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "scale(1.07)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(64,129,117,.6), 0 2px 10px rgba(0,0,0,.3)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 4px 24px rgba(64,129,117,.45), 0 1px 6px rgba(0,0,0,.25)";
        }}
      >
        {/* WhatsApp SVG icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          width="26"
          height="26"
          style={{ flexShrink: 0 }}
        >
          <circle cx="16" cy="16" r="16" fill="#25D366"/>
          <path
            fill="#fff"
            d="M23.5 8.5A10.45 10.45 0 0016 5.5C10.2 5.5 5.5 10.2 5.5 16c0 1.85.48 3.65 1.4 5.24L5.5 26.5l5.4-1.42A10.46 10.46 0 0016 26.5c5.8 0 10.5-4.7 10.5-10.5 0-2.8-1.09-5.44-3-7.5zm-7.5 16.15a8.68 8.68 0 01-4.43-1.22l-.32-.19-3.2.84.86-3.12-.21-.33A8.68 8.68 0 017.32 16C7.32 11.2 11.2 7.32 16 7.32S24.68 11.2 24.68 16 20.8 24.65 16 24.65zm4.77-6.5c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.58.13-.17.26-.66.85-.81 1.02-.15.17-.3.19-.56.06-.26-.13-1.1-.4-2.1-1.29-.78-.7-1.3-1.56-1.45-1.82-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.46.13-.16.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.8-1.91-.21-.5-.43-.43-.58-.44h-.5c-.17 0-.45.06-.69.32-.24.26-.91.89-.91 2.17s.93 2.52 1.06 2.69c.13.17 1.83 2.8 4.44 3.92.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.23-.17-.49-.3z"
          />
        </svg>
        <span style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 14,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: ".3px",
          whiteSpace: "nowrap",
        }}>
          Chat with us
        </span>
      </a>
    </div>
  );
}
