"use client";
import { useEffect, useRef, useState } from "react";

const DEFAULT_PLAYLIST =
  "https://youtube.com/playlist?list=PL8zpqoBijZMKqeOKglDyHEmz61fMTjHMH&si=nY99Ybcr1vXM7W_2";

const ICN = {
  PREV:  "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_prev.png",
  PLAY:  "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_play.png",
  PAUSE: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_pause.png",
  LOAD:  "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_load.gif",
  NEXT:  "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_next.png",
  VOL100:"https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_100.png",
  VOL50: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_50.png",
  VOL20: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_20.png",
  MUTE:  "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_mute.png",
};

const fmt = (t) => {
  t = Math.max(0, Math.floor(t || 0));
  const m = Math.floor(t / 60), s = t % 60;
  return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
};

const extractListId = (input) => {
  if (!input) return null;
  if (/^(PL|OLAK)/i.test(input)) return input.trim();
  try {
    const u = new URL(input, typeof window !== "undefined" ? window.location.href : "http://x");
    const v = u.searchParams.get("list");
    if (v) return v.trim();
  } catch {}
  return null;
};

export default function MusicCard() {
  const [mode, setMode]     = useState("player");          // "player" | "setup"
  const [url, setUrl]       = useState(DEFAULT_PLAYLIST);
  const [listId, setListId] = useState(null);

  const [title, setTitle]       = useState("—");
  const [uploader, setUploader] = useState("—");
  const [cover, setCover]       = useState("");
  const [playing, setPlaying]   = useState(false);
  const [timeText, setTimeText] = useState("00:00 / 00:00");
  const [volIcon, setVolIcon]   = useState(ICN.VOL100);

  const playerRef     = useRef(null);
  const playerDivRef  = useRef(null);
  const playBtnRef    = useRef(null);
  const logoLinkRef   = useRef(null);

  const barRef        = useRef(null);
  const fillRef       = useRef(null);
  const handleRef     = useRef(null);

  const volBarRef     = useRef(null);
  const volFillRef    = useRef(null);

  const seekingRef    = useRef(false);
  const tickerRef     = useRef(null);

  /* load YT API once */
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.YT?.Player) return;
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  }, []);

  /* default playlist */
  useEffect(() => {
    const id = extractListId(DEFAULT_PLAYLIST);
    if (id) setListId(id);
  }, []);

  /* (re)build player when list changes */
  useEffect(() => {
    if (!listId) return;
    const make = () => {
      if (!window.YT?.Player || !playerDivRef.current) return false;

      if (playerRef.current) {
        try { playerRef.current.loadPlaylist({ list:listId, index:0 }); playerRef.current.playVideo(); }
        catch {}
        return true;
      }

      playerRef.current = new window.YT.Player(playerDivRef.current, {
        height: "200",
        width:  "300",
        playerVars: { playsinline:1, disablekb:1, controls:0, loop:1, list:listId, index:0, autoplay:1 },
        events: {
          onReady: (ev) => { try { ev.target.setVolume(50); } catch{}; updateInfo(); startTicker(); },
          onStateChange: (ev) => {
            const s = ev.data;
            if (s === window.YT.PlayerState.PLAYING) {
              setPlaying(true); startTicker(); if (playBtnRef.current) playBtnRef.current.src = ICN.PAUSE;
            }
            if (s === window.YT.PlayerState.PAUSED) {
              setPlaying(false); stopTicker(); if (playBtnRef.current) playBtnRef.current.src = ICN.PLAY;
            }
            if (s === window.YT.PlayerState.BUFFERING || s === window.YT.PlayerState.CUED) {
              if (playBtnRef.current) playBtnRef.current.src = ICN.LOAD;
            }
            updateInfo();
          }
        }
      });
      return true;
    };
    if (!make()) {
      const id = setInterval(() => { if (make()) clearInterval(id); }, 120);
      return () => clearInterval(id);
    }
  }, [listId]);

  function startTicker() {
    stopTicker();
    tickerRef.current = setInterval(() => {
      const p = playerRef.current; if (!p || seekingRef.current) return;
      const ct = p.getCurrentTime?.() || 0, dur = Math.max(1, p.getDuration?.() || 1);
      setTimeText(`${fmt(ct)} / ${fmt(dur)}`);
      const ratio = ct / dur;
      if (fillRef.current)   fillRef.current.style.width = `${ratio*100}%`;
      if (handleRef.current) handleRef.current.style.left = `calc(${ratio*100}% - 4px)`; // center 8px handle
    }, 500);
  }
  function stopTicker() {
    if (tickerRef.current) { clearInterval(tickerRef.current); tickerRef.current = null; }
  }

  function updateInfo() {
    const p = playerRef.current; if (!p?.getVideoData) return;
    const d = p.getVideoData();
    setTitle(d?.title || "—");
    setUploader(d?.author ? `Uploaded by ${d.author}` : "—");
    if (d?.video_id) {
      setCover(`https://img.youtube.com/vi/${d.video_id}/mqdefault.jpg`);
      if (logoLinkRef.current) logoLinkRef.current.href = p.getVideoUrl?.() || "#";
    }
  }

  function onSeek(e) {
    const p = playerRef.current; if (!p?.getDuration || !barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const r = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seekingRef.current = true;
    try { p.seekTo(r * p.getDuration(), true); } catch {}
    if (fillRef.current)   fillRef.current.style.width = `${r*100}%`;
    if (handleRef.current) handleRef.current.style.left = `calc(${r*100}% - 4px)`;
    seekingRef.current = false;
  }

  function onVolume(e) {
    const p = playerRef.current; if (!p || !volBarRef.current) return;
    const rect = volBarRef.current.getBoundingClientRect();
    const r = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const vol = Math.round(r * 100);
    try { p.unMute(); p.setVolume(vol); } catch {}
    if (volFillRef.current) volFillRef.current.style.width = `${vol}%`;
    setVolIcon(vol===0?ICN.MUTE:vol<20?ICN.VOL20:vol<50?ICN.VOL50:ICN.VOL100);
  }

  function togglePlay(){
    const p = playerRef.current; if(!p) return;
    const s = p.getPlayerState?.();
    (s===window.YT.PlayerState.PLAYING) ? p.pauseVideo() : p.playVideo();
  }

  function startSetup(){ setMode("setup"); }
  function createFromInput(){
    const id = extractListId(url);
    if (!id) return;
    setListId(id);
    setMode("player");
  }

  /* === High-contrast bar colors (works in both themes) === */
  const barVars = {
    "--bar-track": "#decbe6", // track darker than panel
    "--bar-edge":  "#8a6bb8", // crisp outline
    "--bar-fill":  "#2f20c9", // deep purple fill
  };

  /* ---------- RENDER ---------- */

  if (mode === "setup") {
    return (
      <section className="window" style={barVars}>
        <div className="title">
          <span>music player</span>
          <div className="win-btns">
            <i className="win-btn" onClick={()=>setMode("player")} style={{cursor:"pointer"}} />
          </div>
        </div>

        <div className="content" style={{ padding: "8px 10px" }}>
          <div style={{ display:"flex", gap:8 }}>
            <input
              value={url}
              onChange={(e)=>setUrl(e.target.value)}
              placeholder="Put playlist link here!"
              style={{
                flex:1, padding:"10px",
                background:"var(--window-inner)", color:"var(--window-text)",
                border:"var(--px) solid var(--window-border)",
                fontFamily:'"pixelmplus12","Determination",monospace', fontSize:18
              }}
            />
            <button
              type="button"
              onClick={createFromInput}
              className="btn"
              style={{ padding:"10px 16px", border:"var(--px) solid var(--window-border)" }}
            >
              Create
            </button>
          </div>
        </div>

        <div className="status"><i/><i/><i/></div>
      </section>
    );
  }

  /* default: PLAYER view */
  return (
    <section className="window" style={barVars}>
      <div className="title">
        <span>music</span>
        <div className="win-btns">
          <i className="win-btn" onClick={startSetup} style={{cursor:"pointer"}} />
          <i className="win-btn" />
          <i className="win-btn" />
        </div>
      </div>

      <div className="content" style={{ padding: "8px 10px" }}>
        <div style={{ display:"flex", gap:10, alignItems:"center", minWidth:0 }}>
          <a ref={logoLinkRef} href="#" target="_blank" aria-label="open on YouTube">
            <img
              src={cover || ""}
              alt="cover"
              style={{
                width:56, height:56, objectFit:"cover", imageRendering:"pixelated",
                outline:"var(--px) solid var(--window-border)", display:"block"
              }}
            />
          </a>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {title}
            </div>
            <div style={{ fontSize:12, opacity:.75 }}>{uploader}</div>

            {/* PLAYBACK BAR */}
            <div
              ref={barRef}
              onMouseDown={(e)=>{ onSeek(e);
                const move=(ev)=>onSeek(ev), up=()=>{document.removeEventListener("mousemove",move);document.removeEventListener("mouseup",up);};
                document.addEventListener("mousemove",move); document.addEventListener("mouseup",up);
              }}
              style={{
                position:"relative",
                height:10,
                background:"var(--bar-track)",
                border:"1px solid var(--bar-edge)",
                borderRadius:3,
                overflow:"hidden",
                outline:"var(--px) solid var(--window-border)",
                margin:"6px 0",
                cursor:"pointer",
                boxShadow:"inset 0 0 0 .5px rgba(255,255,255,.35)",
                maxWidth:"100%"
              }}
            >
              <div
                ref={fillRef}
                style={{
                  height:"100%",
                  width:"0%",
                  background:"var(--btnright)",
                  boxShadow:"inset 0 0 0 1px rgba(255,255,255,.25)"
                }}
              />
              {/* visible playhead handle */}
              <div
                ref={handleRef}
                style={{
                  position:"absolute",
                  top:"-2px",
                  left:"-4px",
                  width:8,
                  height:14,
                  background:"color-mix(in oklab, var(--bar-fill) 80%, black)",
                  border:"1px solid var(--bar-edge)",
                  borderRadius:2,
                  boxShadow:"0 0 0 2px color-mix(in oklab, var(--bar-track) 70%, transparent)"
                }}
              />
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:10, minWidth:0 }}>
              <img onClick={()=>playerRef.current?.previousVideo?.()} src={ICN.PREV}  alt="prev"  width={20} height={20} style={{cursor:"pointer"}} />
              <img ref={playBtnRef} onClick={togglePlay} src={playing?ICN.PAUSE:ICN.PLAY} alt="play" width={20} height={20} style={{cursor:"pointer"}} />
              <img onClick={()=>playerRef.current?.nextVideo?.()}     src={ICN.NEXT}  alt="next"  width={20} height={20} style={{cursor:"pointer"}} />

              <img src={volIcon} alt="vol" width={18} height={18} style={{ marginLeft:8 }} />

              {/* VOLUME BAR */}
              <div
                ref={volBarRef}
                onMouseDown={(e)=>{ onVolume(e);
                  const move=(ev)=>onVolume(ev), up=()=>{document.removeEventListener("mousemove",move);document.removeEventListener("mouseup",up);};
                  document.addEventListener("mousemove",move); document.addEventListener("mouseup",up);
                }}
                style={{
                  width:90,
                  height:10,
                  background:"var(--bar-track)",
                  border:"1px solid var(--bar-edge)",
                  borderRadius:3,
                  overflow:"hidden",
                  outline:"var(--px) solid var(--window-border)",
                  cursor:"pointer",
                  boxShadow:"inset 0 0 0 .5px rgba(255,255,255,.35)",
                  maxWidth:"100%"
                }}
              >
                <div
                  ref={volFillRef}
                  style={{
                    height:"100%",
                    width:"50%",
                    background:"var(--btnright)",
                    boxShadow:"inset 0 0 0 1px rgba(255,255,255,.25)"
                  }}
                />
              </div>

              <div style={{ fontSize:12, opacity:.8, marginLeft:"auto" }}>{timeText}</div>
            </div>
          </div>
        </div>

        {/* hidden YT target */}
        <div ref={playerDivRef} style={{ display:"none" }} />
      </div>

      <div className="status"><i/><i/><i/></div>
    </section>
  );
}
