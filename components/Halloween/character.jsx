"use client";
import { useEffect, useMemo, useRef, useState } from "react";

export default function CharacterWindow({
  name = "ALICIA",
  width = 520,
  soundSrc = "/sounds/click.mp3",
  evolveSoundSrc = "/sounds/annoyed.mp3",
  volume = 1.0,
  allowOverlap = false,
}) {
  const [pressed, setPressed] = useState(false);
  const [shake, setShake]     = useState(false);
  const [current, setCurrent] = useState(1);
  const [pressCount, setPressCount] = useState(0);
  const [evolved, setEvolved] = useState(false);

  const [fullLine, setFullLine] = useState("");
  const [line, setLine]         = useState("");
  const typerRef = useRef(null);
  const lastIdxRef = useRef(-1);

  const audioRefMain   = useRef(null);
  const audioRefEvolve = useRef(null);
  const unlockedRef    = useRef(false);

  useEffect(() => {
    const a = new Audio(soundSrc);
    const b = new Audio(evolveSoundSrc);
    a.preload = b.preload = "auto";
    a.volume = b.volume = Math.min(Math.max(volume, 0), 1);
    audioRefMain.current = a;
    audioRefEvolve.current = b;

    return () => {
      [a, b].forEach(x => { try { x.pause(); } catch {} });
      audioRefMain.current = null;
      audioRefEvolve.current = null;
    };
  }, [soundSrc, evolveSoundSrc, volume]);

  const play = (which) => {
    const ref = which === "evolve" ? audioRefEvolve : audioRefMain;
    const src = which === "evolve" ? evolveSoundSrc : soundSrc;

    if (allowOverlap) {
      const a = new Audio(src);
      a.volume = Math.min(Math.max(volume, 0), 1);
      a.play().catch(() => {});
      a.addEventListener("ended", () => { try { a.src = ""; } catch {} });
      return;
    }

    const a = ref.current;
    if (!a) return;
    try {
      if (!unlockedRef.current) {
        a.muted = false;
        unlockedRef.current = true;
      }
      a.pause();
      a.currentTime = 0;
      a.play().catch(() => {});
    } catch {}
  };

  const LINES_NORMAL = useMemo(
    () => [
      "Hello!",
      "I'm Alicia, your friendly neighborhood developer!",
      "I'm studying Software Engineering @ SJSU!",
      "I love building things for people to showcase their ideas :)",
      "In my free time, I enjoy drawing and crocheting!",
      "Are you enjoying the site?",
      "Happy early Halloween!",
    ],
    []
  );

  const LINES_ANGRY = useMemo(
    () => [
      "Hey! That’s enough!",
      "Stop poking me!",
      "...",
      "Okay, you can stop poking me now...",
      "I think I need a break...",
    ],
    []
  );

  const pickRandomLine = (angry = false) => {
    const arr = angry ? LINES_ANGRY : LINES_NORMAL;
    if (!arr.length) return "";
    let i = Math.floor(Math.random() * arr.length);
    if (arr.length > 1 && i === lastIdxRef.current) i = (i + 1) % arr.length;
    lastIdxRef.current = i;
    return arr[i];
  };

  const startTypewriter = (text) => {
    if (typerRef.current) clearInterval(typerRef.current);
    setLine("");
    let i = 0;
    typerRef.current = setInterval(() => {
      i++;
      setLine(text.slice(0, i));
      if (i >= text.length) clearInterval(typerRef.current);
    }, 18);
  };

  useEffect(() => {
    const first = pickRandomLine(false);
    setFullLine(first);
    startTypewriter(first);
  }, []);

  // --- pointer events (FIXED flow) ---
  const onDown = () => {
    if (evolved) {
      setPressed(true);
      setShake(true);
      setCurrent(3);
      play("evolve");
      setTimeout(() => setShake(false), 250);
      return;
    }
    setPressed(true);
    setCurrent(2);
    play("main");
  };

  const onUp = () => {
    if (evolved) {
      setPressed(false);
      setCurrent(3);
      const nextAngry = pickRandomLine(true);
      setFullLine(nextAngry);
      startTypewriter(nextAngry);
      return;
    }

    setPressed(false);
    const nextCount = pressCount + 1;

    if (nextCount >= 8) {
      setPressCount(nextCount);
      setEvolved(true);
      setCurrent(3);
      play("evolve");

      const angryIntro = "I think that's enough...";
      setFullLine(angryIntro);
      startTypewriter(angryIntro);
      return;
    }

    setPressCount(nextCount);
    setCurrent(1);
    const nextFriendly = pickRandomLine(false);
    setFullLine(nextFriendly);
    startTypewriter(nextFriendly);
  };

  return (
    <section className="window">
      <div className="title">
        <span>Say Hello!</span>
        <div className="win-btns"><i className="win-btn"/><i className="win-btn"/><i className="win-btn"/></div>
      </div>

      <div className="content" style={{ padding: 8 }}>
        <div
          style={{
            position: "relative",
            width: `min(${width}px, 92vw)`,
            margin: "8px auto 0",
            userSelect: "none",
          }}
        >
          <img
            src={`/character${current}.png`}
            alt="character"
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerLeave={onUp}
            onPointerCancel={onUp}
            draggable={false}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              imageRendering: "pixelated",
              cursor: "pointer",
              transform:
                evolved && shake
                  ? "translateX(0)"
                  : pressed
                  ? "scaleX(0.98) scaleY(0.92)"
                  : "scale(1)",
              transition: evolved ? "none" : "transform 120ms ease",
              animation: evolved && shake ? "shakeX 250ms ease both" : "none",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "8px",
              transform: "translateX(-50%)",
              width: "96%",
              border: "3px solid #fff",
              background: "#0D0D0D",
              boxShadow: "0 0 0 2px #000 inset, 0 0 0 2px #000",
              color: "#EDEDED",
              fontSize: 16,
              lineHeight: 1.6,
              padding: "18px 22px 22px 22px",
              textShadow: "0 1px 0 #000",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-24px",
                left: "10px",
                background: "#0D0D0D",
                color: "#FFFFFF",
                border: "2px solid #FFFFFF",
                boxShadow: "0 0 0 2px #000 inset, 0 0 0 2px #000",
                padding: "4px 8px",
                fontWeight: 700,
                letterSpacing: "0.5px",
              }}
            >
              {name}
            </div>

            <div style={{ whiteSpace: "pre-wrap", minHeight: "2.4em" }}>
              {line}
            </div>

            <div
              style={{
                position: "absolute",
                right: 10,
                bottom: 6,
                fontSize: 18,
                color: evolved ? "#FF4444" : "#FF6DAA",
                animation: "omoriBlink 1s steps(2,end) infinite",
              }}
            >
              ▶
            </div>
          </div>
        </div>
      </div>

      <div className="status"><i/><i/><i/></div>

      <style>{`
        @keyframes omoriBlink {
          0% { opacity: 0; }
          50% { opacity: 0; }
          51% { opacity: 1; }
          100% { opacity: 1; }
        }
        @keyframes shakeX {
          0%   { transform: translateX(0); }
          15%  { transform: translateX(-6px); }
          30%  { transform: translateX(6px); }
          45%  { transform: translateX(-4px); }
          60%  { transform: translateX(4px); }
          75%  { transform: translateX(-2px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
