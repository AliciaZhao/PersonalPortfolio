"use client";
import { useEffect, useMemo, useState } from "react";

const getStored = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ?? fallback; }
  catch { return fallback; }
};

export default function ThemeCard() {
  const [mode, setMode] = useState/** @type {"auto"|"dark"|"light"} */("auto");
  const [hue, setHue]   = useState(0);          // ✅ default hue = 0

  const prefersDark = useMemo(
    () => (typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : null),
    []
  );

  useEffect(() => {
    const savedMode = getStored("theme-mode", "auto");
    const savedHue  = Number(getStored("theme-hue", "0"));
    if (savedMode === "auto" || savedMode === "dark" || savedMode === "light") setMode(savedMode);
    if (!Number.isNaN(savedHue)) setHue(savedHue);
  }, []);

  useEffect(() => {
    if (!prefersDark) return;
    const onChange = () => { if (mode === "auto") applyTheme("auto", hue); };
    prefersDark.addEventListener?.("change", onChange);
    return () => prefersDark.removeEventListener?.("change", onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersDark, mode, hue]);

  useEffect(() => {
    applyTheme(mode, hue);
    try {
      localStorage.setItem("theme-mode", mode);
      localStorage.setItem("theme-hue", String(hue));
    } catch {}
  }, [mode, hue]);

  function applyTheme(m, h) {
    const root = document.documentElement;
    const actual =
      m === "auto"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : m;
    root.dataset.theme = actual;
    root.style.setProperty("--hue", String(h));
  }

  return (
    <section className="window">
      <div className="title">
        <span>theme</span>
        <div className="win-btns">
          <i className="win-btn" /><i className="win-btn" /><i className="win-btn" />
        </div>
      </div>

      <div className="content" style={{ padding: 8 }}>
        <div className="sectionTitle" style={{ marginBottom: 4 }}>Theme</div>
        <div className="sectionSub" style={{ marginBottom: 10 }}>
          Pick dark/light (or follow system) and tune the accent hue.
        </div>

        <div className="theme-row" style={{ marginBottom: 8 }}>
          <label className="radio">
            <input
              type="radio"
              name="theme-mode"
              value="auto"
              checked={mode === "auto"}
              onChange={() => setMode("auto")}
            />
            <span style={{ fontSize: 17 }}>Auto</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="theme-mode"
              value="dark"
              checked={mode === "dark"}
              onChange={() => setMode("dark")}
            />
            <span style={{ fontSize: 17 }}>Dark</span>
          </label>
          <label className="radio">
            <input
              type="radio"
              name="theme-mode"
              value="light"
              checked={mode === "light"}
              onChange={() => setMode("light")}
            />
            <span style={{ fontSize: 17 }}>Light</span>
          </label>
        </div>

        <div className="theme-row">
          <label htmlFor="hueRange" className="label">Hue</label>
          <input
            id="hueRange"
            type="range"
            min={0}
            max={360}
            step={1}
            value={hue}
            onChange={(e) => setHue(Number(e.target.value))}
            aria-label="Theme hue"
            style={{ flex: 1 }}
          />
          <span className="chip">{hue}°</span>
        </div>
      </div>

      <div className="status"><i/><i/><i/></div>
    </section>
  );
}
