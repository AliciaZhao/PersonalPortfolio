/* ====== vanilla music controller (fixed) ====== */

/* 0) DOM refs (guard if missing) */
const $ = (id) => document.getElementById(id);
const nodes = {
  playButton:   $("music-toggle"),
  previousButton:$("music-prev"),
  nextButton:   $("music-next"),
  logoImg:      $("music-logo"),
  titleText:    $("song-name"),
  authorText:   $("song-uploader"),
  playbackBar:  $("playback-bar"),
  playbackFill: $("playback-fill"),
  volumeArea:   $("volume-area"),
  volumeIcon:   $("volume-icon"),
  volumeBar:    $("volume-bar"),
  volumeFill:   $("volume-fill"),
  timeText:     $("playtime"),
  // optional input/button for adding playlist (Option B)
  playlistInput:$("music-playlist-input"),
  loadBtn:      $("music-load-btn"),
  // anchor for logo click
  logoLink:     $("music-logo")?.parentNode
};

const params = new URLSearchParams(window.location.search);
const list  = params.get("list");
const style = params.get("style");

/* 1) optional override stylesheet param */
if (style) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = style;
  document.head.appendChild(link);
}

/* 2) responsive visibility */
function updateVisibility() {
  if (nodes.volumeArea) nodes.volumeArea.style.display = "flex";
  if (nodes.timeText)   nodes.timeText.style.display   = "initial";
  const w = document.body.getBoundingClientRect().width;
  if (w < 360 && nodes.volumeArea) nodes.volumeArea.style.display = "none";
  if (w < 300 && nodes.timeText)   nodes.timeText.style.display   = "none";
}
addEventListener("load",  updateVisibility);
addEventListener("resize",updateVisibility);

/* 3) assets */
const imgUrlPlay = {
  play:    "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_play.png",
  pause:   "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_pause.png",
  loading: "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_load.gif"
};
const imgUrlVolume = {
  normal:"https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_100.png",
  low:   "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_50.png",
  lowest:"https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_20.png",
  mute:  "https://lilithdev.neocities.org/shrine/vg/nso/sprites/music_volume_mute.png"
};

/* 4) helpers */
function formatTime(s) {
  s = Math.max(0, Math.floor(s||0));
  return s >= 3600
    ? new Date(s*1000).toISOString().slice(11,19)
    : new Date(s*1000).toISOString().slice(14,19);
}
function extractPlaylistId(str) {
  if (!str) return null;
  if (/^(PL|OLAK)/i.test(str)) return str.trim();
  try {
    const u = new URL(str, window.location.href);
    const id = u.searchParams.get("list");
    if (id) return id.trim();
  } catch (_) {}
  return null;
}

/* 5) mute toggle */
let cachedIcon = imgUrlVolume.normal;
if (nodes.volumeIcon) {
  nodes.volumeIcon.addEventListener("click", () => {
    if (!player) return;
    if (player.isMuted()) {
      nodes.volumeIcon.src = cachedIcon;
      player.unMute();
    } else {
      cachedIcon = nodes.volumeIcon.src;
      nodes.volumeIcon.src = imgUrlVolume.mute;
      player.mute();
    }
  });
}

/* 6) seek + volume bars (drag) */
let seeking = false;

if (nodes.playbackBar && nodes.playbackFill) {
  nodes.playbackBar.addEventListener("mousedown", (e) => {
    setPlaybackFromMouse(e.clientX, false);
    seeking = true;
    stopTicker();

    const move = (ev)=> setPlaybackFromMouse(ev.clientX, false);
    const up   = (ev)=> {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      seeking = false;
      setPlaybackFromMouse(ev.clientX, true);
      startTicker();
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}

function setPlaybackFromMouse(pointerX, allowSeekAhead) {
  if (!player || !nodes.playbackBar) return;
  const rect = nodes.playbackBar.getBoundingClientRect();
  let ratio = (pointerX - rect.left) / rect.width;
  ratio = Math.min(Math.max(ratio, 0), 1);
  const newTime = ratio * player.getDuration();

  nodes.playbackFill.style.width = (ratio * 100) + "%";
  try { player.seekTo(newTime, allowSeekAhead); } catch {}
  if (nodes.timeText) {
    nodes.timeText.textContent =
      `${formatTime(newTime)} / ${formatTime(player.getDuration())}`;
  }
}

if (nodes.volumeBar && nodes.volumeFill) {
  nodes.volumeBar.addEventListener("mousedown", (e) => {
    setVolumeFromMouse(e.clientX);

    const move = (ev)=> setVolumeFromMouse(ev.clientX);
    const up   = ()=> {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });
}

function setVolumeFromMouse(pointerX) {
  const rect = nodes.volumeBar.getBoundingClientRect();
  let vol = (pointerX - rect.left) / rect.width * 100;
  vol = Math.min(Math.max(vol, 0), 100);

  nodes.volumeFill.style.width = vol + "%";

  if (player) {
    player.unMute();
    player.setVolume(vol);
  }
  nodes.volumeIcon.src =
    vol === 0 ? imgUrlVolume.mute :
    vol < 20 ? imgUrlVolume.lowest :
    vol < 50 ? imgUrlVolume.low :
               imgUrlVolume.normal;
}

/* 7) YouTube player */
let player = null;
let tickerId = null; // <-- FIX: store interval id

function startTicker() {
  stopTicker();
  tickerId = setInterval(updateTime, 500);
}
function stopTicker() {
  if (tickerId) { clearInterval(tickerId); tickerId = null; }
}

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '200',
    width:  '200',
    playerVars: {
      playsinline: 1,
      disablekb:   1,
      controls:    0,
      list:        list || undefined,
      index:       params.get("index") || 0,
      autoplay:    params.get("autoplay") || 0,
      loop:        1
    },
    events: {
      onReady:       onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

let shufflePlayPrevent = false;

function onPlayerReady(ev) {
  try { ev.target.setVolume(10); } catch {}
  if (nodes.volumeFill) nodes.volumeFill.style.width = "10%";
  if (nodes.volumeIcon) nodes.volumeIcon.src = imgUrlVolume.lowest;

  if ((params.get("shuffle") || "0") !== "0") {
    player.setShuffle(true);
    player.playVideoAt(0);
    if ((params.get("autoplay") || "0") === "0") shufflePlayPrevent = true;
  } else {
    updateVideoInfo(ev.target.getVideoData());
  }

  if (nodes.playButton) nodes.playButton.addEventListener('click', togglePlay);
  if (nodes.previousButton) nodes.previousButton.addEventListener('click', () => player.previousVideo());
  if (nodes.nextButton)     nodes.nextButton.addEventListener('click', () => player.nextVideo());

  startTicker();
}

function onPlayerStateChange(event) {
  updateGraphics(event.data);

  if (event.data === YT.PlayerState.PLAYING) {
    startTicker();
  } else {
    // keep progress frozen when not playing
    stopTicker();
  }

  if (shufflePlayPrevent && event.data === YT.PlayerState.PLAYING) {
    shufflePlayPrevent = false;
    player.pauseVideo();
  }
}

function togglePlay() {
  if (!player) return;
  const st = player.getPlayerState();
  if (st === YT.PlayerState.PAUSED || st === YT.PlayerState.BUFFERING || st === YT.PlayerState.CUED) {
    player.playVideo();
  } else if (st === YT.PlayerState.PLAYING || st === YT.PlayerState.ENDED) {
    player.pauseVideo();
  }
}

function updateGraphics(state) {
  let newSrc;
  const data = player?.getVideoData?.();
  if (data && data.title !== undefined) updateVideoInfo(data);
  updateTime();

  if (state === YT.PlayerState.PLAYING)   newSrc = imgUrlPlay.pause;
  if (state === YT.PlayerState.PAUSED)    newSrc = imgUrlPlay.play;
  if (state === YT.PlayerState.BUFFERING || state === YT.PlayerState.CUED) newSrc = imgUrlPlay.loading;

  if (newSrc && nodes.playButton && newSrc !== nodes.playButton.src)
    nodes.playButton.src = newSrc;
}

function updateTime() {
  if (!player || seeking) return;
  const cur = player.getCurrentTime();
  const dur = player.getDuration() || 1;
  if (nodes.playbackFill) nodes.playbackFill.style.width = (cur / dur * 100) + "%";
  if (nodes.timeText) nodes.timeText.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
}

function updateVideoInfo(info) {
  if (nodes.titleText)  nodes.titleText.textContent  = info.title || "—";
  if (nodes.authorText) nodes.authorText.textContent = info.author ? `Uploaded by ${info.author}` : "—";
  if (nodes.logoImg) {
    // FIX: use https
    nodes.logoImg.src = `https://img.youtube.com/vi/${info.video_id}/mqdefault.jpg`;
  }
  if (nodes.logoLink && player?.getVideoUrl) {
    nodes.logoLink.href = player.getVideoUrl();
  }
}

/* 8) Public helper — load playlist without page reload */
let __playerReady = false;
let __pendingListId = null;

window.MUSIC_setPlaylist = function(input) {
  const listId = extractPlaylistId(input);
  if (!listId) { console.warn("No valid playlist found in:", input); return; }

  __pendingListId = listId;

  // If player exists and ready, load & play immediately
  if (player && __playerReady) {
    try { player.loadPlaylist({ list: listId, index: 0 }); player.playVideo(); return; }
    catch (e) { console.warn("loadPlaylist failed, will retry after ready.", e); }
  }
};

const oldOnReady = onPlayerReady;
onPlayerReady = function(ev) {
  __playerReady = true;
  // call original
  oldOnReady(ev);
  // if a playlist was queued before ready, load now
  if (__pendingListId) {
    try { player.loadPlaylist({ list: __pendingListId, index: 0 }); player.playVideo(); }
    catch (e) { console.warn("deferred loadPlaylist failed:", e); }
    __pendingListId = null;
  }
};

/* 9) Wire Option B: Add Playlist button inside the card */
if (nodes.loadBtn && nodes.playlistInput) {
  nodes.loadBtn.addEventListener("click", () => {
    const v = nodes.playlistInput.value.trim();
    if (!v) return;
    window.MUSIC_setPlaylist(v); // user gesture → autoplay allowed
  });
}

/* 10) message listener for dynamic CSS (kept) */
window.addEventListener("message", (e) => {
  if (e.data?.type === "style" && typeof e.data.css === "string") {
    const styleEl = document.createElement("style");
    styleEl.textContent = e.data.css;
    document.head.appendChild(styleEl);
  }
});

