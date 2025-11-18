"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SectionHeader from "./SectionHeader";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

function PreviewPortal({ rect, localY, src, dims, gap, show }) {
  if (!show || !rect) return null;

  const { w: PREV_W, h: PREV_H } = dims;

  let top = rect.top + localY;

  let left = rect.left - gap - PREV_W;

  const vh = typeof window !== "undefined" ? window.innerHeight : 0;
  top = clamp(top, 8, vh - PREV_H - 8);

  if (left < 8) left = rect.right + gap;

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
    zIndex: 2147483647, // on top
  };

  return createPortal(<div style={style} />, document.body);
}

function Project({ n, title, desc, tech = [], live, code, preview }) {
  const rowRef = useRef(null);
  const [showPrev, setShowPrev] = useState(false);
  const [rect, setRect] = useState(null);
  const [localY, setLocalY] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

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
              {live && live !== "#" ? (
                <a className="btn right" href={live} target="_blank" rel="noreferrer">
                  Live
                </a>
              ) : (
                <button
                  className="btn right"
                  onClick={() => setShowPopup(true)}
                >
                  Live
                </button>
              )}

              {code && (
                <a className="btn right" href={code} target="_blank" rel="noreferrer">
                  Code
                </a>
              )}

              {showPopup && (
                <div className="popup-overlay" onClick={() => setShowPopup(false)}>
                  <div
                    className="popup-box"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="popup-title">No Live Demo Yet</div>
                    <div className="popup-body">
                      This project currently doesn’t have a live version.
                      <br />
                      You can still check out the repository and use the README to run it locally.
                    </div>
                    <div className="popup-actions">
                      {code && (
                        <a
                          className="btn"
                          href={code}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View on GitHub
                        </a>
                      )}
                      <button className="btn" onClick={() => setShowPopup(false)}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

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
      live: "https://katherinezhao.studio",
      code: "https://github.com/orgs/KatPottery/repositories",
      preview: "preview/Katpottery.png",
    },
    {
      n: 2,
      title: "Ember Alert — Wildfire Evacuation App",
      desc: "React Native client, FastAPI scheduler, Google Maps overlays, PostgreSQL backend.",
      tech: ["React Native", "FastAPI", "PostgreSQL", "Maps API"],
      live: "#",
      code: "https://github.com/orgs/cmpe-195-capstone-project/repositories",
      preview: "preview/fires.png",
    },
    {
      n: 3,
      title: "Portfolio — Nalkaloun",
      desc: "Personalized portfolio website for artist Nalkaloun, built with React and Tailwind CSS.",
      tech: ["React", "CSS", "UX"],
      live: "https://nalkaloun.art",
      code: "https://github.com/AliciaZhao/Nalkaloun",
      preview: "preview/nalk.png",
    },
    {
      n: 4,
      title: "Drawing Timer",
      desc: "Drawing timer for multiple college artists to work on figure studies on each figure with configurable timer, tracking application and folder management.",
      tech: ["Rust", "eframe", "rodio"],
      live: "#",
      code: "https://github.com/AliciaZhao/timerdrawing",
      preview: "preview/timer.png",
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
