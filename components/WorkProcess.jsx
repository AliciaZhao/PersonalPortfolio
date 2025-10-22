// RecentProjects.jsx
"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SectionHeader from "./SectionHeader";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function PreviewPortal({ rect, localY, src, dims, gap, show }) {
  if (!show || !rect) return null;

  const { w: PREV_W, h: PREV_H } = dims;

  // Desired top = cardTop + clamped localY
  let top = rect.top + localY;

  // Try left dock first
  let left = rect.left - gap - PREV_W;

  // Clamp vertical within viewport
  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  top = clamp(top, 8, vh - PREV_H - 8);

  // If no room on the left, flip to the right
  if (left < 8) left = rect.right + gap;

  // Clamp horizontal, too
  const vw = typeof window !== "undefined" ? window.innerWidth : 0;
  left = clamp(left, 8, vw - PREV_W - 8);

  const style = {
    position: "fixed",
    left,
    top,
    width: PREV_W,
    height: PREV_H,
    backgroundImage: `url(${src})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.55)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.15)",
    backdropFilter: "blur(2px)",
    opacity: 0.98,
    transform: "translateZ(0)",
    transition: "opacity 120ms ease, transform 120ms ease",
    pointerEvents: "none",
    zIndex: 2147483647, // max out; beats pesky overlays
  };

  return createPortal(<div style={style} />, document.body);
}

function Project({ n, title, desc, tech = [], live, code, preview }) {
  const rowRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [rect, setRect] = useState(null);
  const [localY, setLocalY] = useState(0);

  const PREV_DIMS = { w: 360, h: 220 };
  const GAP = 16;

  const updateRect = () => {
    const el = rowRef.current;
    if (!el) return;
    setRect(el.getBoundingClientRect());
  };

  const onEnter = () => {
    updateRect();
    setShowPrev(true);
  };
  const onLeave = () => setShowPrev(false);

  const onMove = (e) => {
    const el = rowRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // center preview around cursor Y within this card
    const y = e.clientY - r.top - PREV_DIMS.h / 2;
    const clampedY = clamp(y, 0, Math.max(0, r.height - PREV_DIMS.h));
    setLocalY(clampedY);
  };

  // Keep position accurate during scroll/resize/layout shifts while visible
  useEffect(() => {
    if (!showPrev) return;
    const handler = () => updateRect();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler, true);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler, true);
    };
  }, [showPrev]);

  return (
    <>
      <div
        ref={rowRef}
        className="stepRow rp-row"
        style={{ width: "100%", minWidth: 0 }}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onMouseMove={onMove}
      >
        <div className="stepBody" style={{ flex: 1, minWidth: 0 }}>
          <div className="stepTitle truncate">{title}</div>
          <div className="stepDesc">{desc}</div>

          {tech.length > 0 && (
            <div className="rp-tags">
              {tech.map((t) => (
                <span key={t} className="badge" style={{ borderStyle: "dotted" }}>
                  {t}
                </span>
              ))}
            </div>
          )}
          <br />

          {(live || code) && (
            <div className="rp-actions">
              {live && (
                <a className="btn right" href={live} target="_blank" rel="noreferrer">
                  Live
                </a>
              )}
              {code && (
                <a className="btn right" href={code} target="_blank" rel="noreferrer">
                  Code
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Render preview into body so it isn't clipped by containers */}
      {preview && (
        <PreviewPortal
          rect={rect}
          localY={localY}
          src={preview}
          dims={PREV_DIMS}
          gap={GAP}
          show={showPrev}
        />
      )}
    </>
  );
}

export default function RecentProjects() {
  const projects = [
    {
      n: 1,
      title: "PotteryShop — E-commerce Platform",
      desc: "React + Express + MongoDB + Stripe with admin dashboard and analytics widgets.",
      tech: ["React", "Express", "MongoDB", "Stripe"],
      live: "#",
      code: "#",
      preview: "/images/previews/potteryshop.png",
    },
    {
      n: 2,
      title: "Ember Alert — Wildfire Evacuation App",
      desc: "React Native client, FastAPI scheduler, Google Maps overlays, PostgreSQL backend.",
      tech: ["React Native", "FastAPI", "PostgreSQL", "Maps API"],
      live: "#",
      code: "#",
      preview: "/images/previews/ember-alert.png",
    },
    {
      n: 3,
      title: "AI Admin Query Builder",
      desc: "Read-only MongoDB widgets with Monaco editor preview and safety checks.",
      tech: ["Monaco", "MongoDB", "Node", "Docker"],
      live: "#",
      code: "#",
      preview: "/images/previews/ai-admin.png",
    },
    {
      n: 4,
      title: "Portfolio — Nalkaloun",
      desc: "Personalized portfolio website for artist Nalkaloun, built with React and Tailwind CSS.",
      tech: ["React", "CSS", "UX"],
      live: "#",
      code: "#",
      preview: "/images/previews/nalkaloun.png",
    },
  ];

  return (
    <section className="window recent-projects">
      <div className="title">
        <span>recent projects</span>
        <div className="win-btns">
          <i className="win-btn" />
          <i className="win-btn" />
          <i className="win-btn" />
        </div>
      </div>

      <div className="content" style={{ padding: "8px 10px" }}>
        <SectionHeader subtitle="A few things I’ve built and shipped lately" />
        <div className="stack" style={{ minWidth: 0 }}>
          {projects.map((p) => (
            <Project key={p.n} {...p} />
          ))}
        </div>
      </div>

      <div className="status">
        <i></i><i></i><i></i>
      </div>
    </section>
  );
}
