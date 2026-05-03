import { useEffect, useRef, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const API = "http://127.0.0.1:8001";

function getYouTubeId(url) {
  if (!url) return null;
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

function fmt(s) {
  if (!s || isNaN(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ── Load the YT IFrame API once, globally ──────────────────────────────────────
// Returns a promise that resolves when window.YT.Player is ready
let ytReady = null;
function loadYT() {
  if (ytReady) return ytReady;
  ytReady = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT);
      return;
    }
    // YouTube calls this when the API is ready
    window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    const s = document.createElement("script");
    s.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(s);
  });
  return ytReady;
}

export default function LearnPage() {
  const { slug } = useParams();
  const token = localStorage.getItem("access_token");

  const [modules, setModules]     = useState([]);
  const [lesson, setLesson]       = useState(null);
  const [phase, setPhase]         = useState("video"); // "video" | "quiz" | "passed"
  const [quiz, setQuiz]           = useState(null);
  const [answer, setAnswer]       = useState("");
  const [quizError, setQuizError] = useState("");
  const [duration, setDuration]   = useState(0);
  const [watched, setWatched]     = useState(0);
  const [current, setCurrent]     = useState(0);
  const [playing, setPlaying]     = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  const playerRef   = useRef(null);
  const pollRef     = useRef(null);
  const furthestRef = useRef(0);
  const endedRef    = useRef(false);
  const lessonRef   = useRef(null);

  // ── Load content ─────────────────────────────────────────────────────────────
  const loadContent = useCallback(async () => {
    const res = await fetch(`${API}/api/lms/courses/${slug}/content`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (Array.isArray(data)) setModules(data);
  }, [slug, token]);

  useEffect(() => { loadContent(); }, [loadContent]);

  // Auto-select first unlocked lesson once modules load
  useEffect(() => {
    if (modules.length > 0 && !lesson) {
      const firstLesson = modules[0]?.lessons?.[0];
      if (firstLesson) doSelectLesson(firstLesson);
    }
  }, [modules]);

  // ── Select lesson ─────────────────────────────────────────────────────────────
  const doSelectLesson = (l) => {
    if (!l.unlocked) return;
    clearInterval(pollRef.current);
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch (_) {}
      playerRef.current = null;
    }
    lessonRef.current = l;
    setLesson(l);
    setPhase("video");
    setQuiz(null);
    setAnswer("");
    setQuizError("");
    setDuration(0);
    setWatched(0);
    setCurrent(0);
    setPlaying(false);
    setPlayerReady(false);
    furthestRef.current = 0;
    endedRef.current = false;
  };

  // ── Build YouTube player when lesson changes ───────────────────────────────────
  useEffect(() => {
    if (!lesson || phase !== "video") return;

    const videoId = getYouTubeId(lesson.video_url);
    if (!videoId) {
      console.error("❌ Could not extract YouTube ID from:", lesson.video_url);
      return;
    }

    let cancelled = false;

    // Reset the mount target
    const wrap = document.getElementById("yt-wrap");
    if (wrap) {
      wrap.innerHTML = '<div id="yt-player"></div>';
    }

    loadYT().then((YT) => {
      if (cancelled) return;

      playerRef.current = new YT.Player("yt-player", {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          controls: 0,          // hide native controls
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          fs: 0,
          playsinline: 1,
          // ✅ DO NOT set `origin` — it breaks localhost
        },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            const dur = e.target.getDuration();
            setDuration(dur);
            setPlayerReady(true);
            startPolling();
            console.log("✅ Player ready, duration:", dur, "videoId:", videoId);
          },
          onError: (e) => {
            console.error("❌ YouTube player error code:", e.data);
            // Error codes: 2=bad param, 5=HTML5 error, 100=not found, 101/150=embed not allowed
          },
          onStateChange: (e) => {
            if (cancelled) return;
            const S = YT.PlayerState;
            if (e.data === S.PLAYING) setPlaying(true);
            if (e.data === S.PAUSED)  setPlaying(false);
            if (e.data === S.ENDED && !endedRef.current) {
              endedRef.current = true;
              setPlaying(false);
              clearInterval(pollRef.current);
              handleVideoEnd();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      clearInterval(pollRef.current);
    };
  }, [lesson?.id, phase]);

  // ── Poll: track position + block forward seek ──────────────────────────────────
  const startPolling = () => {
    clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      const p = playerRef.current;
      if (!p || typeof p.getCurrentTime !== "function") return;

      let cur, dur, state;
      try {
        cur   = p.getCurrentTime();
        dur   = p.getDuration();
        state = p.getPlayerState();
      } catch (_) { return; }

      setCurrent(cur);
      if (dur && !isNaN(dur) && dur > 0) setDuration(dur);

      if (state === window.YT?.PlayerState?.PLAYING) {
        if (cur > furthestRef.current) {
          furthestRef.current = cur;
          setWatched(cur);
        } else if (cur < furthestRef.current - 2) {
          // Student jumped ahead of furthest watched → snap back
          p.seekTo(furthestRef.current, true);
        }
      }
    }, 500);
  };

  // ── Play / Pause toggle ────────────────────────────────────────────────────────
  const togglePlay = () => {
    const p = playerRef.current;
    if (!p || typeof p.getPlayerState !== "function") return;
    try {
      const s = p.getPlayerState();
      if (s === window.YT.PlayerState.PLAYING) p.pauseVideo();
      else p.playVideo();
    } catch (_) {}
  };

  // ── Seek bar — only allows seeking within watched range ────────────────────────
  const handleSeekClick = (e) => {
    if (!duration || !playerRef.current) return;
    const rect   = e.currentTarget.getBoundingClientRect();
    const ratio  = (e.clientX - rect.left) / rect.width;
    const target = ratio * duration;
    if (target > furthestRef.current + 1) return; // block forward seek
    try {
      playerRef.current.seekTo(target, true);
      setCurrent(target);
    } catch (_) {}
  };

  // ── Video ended → save progress → load quiz ───────────────────────────────────
  const handleVideoEnd = async () => {
    const l = lessonRef.current;
    if (!l) return;

    await fetch(`${API}/api/progress/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ lesson_id: l.id, progress: 100, completed: true }),
    });

    const res  = await fetch(`${API}/api/quiz/lesson/${l.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();

    if (data.no_quiz) {
      await loadContent();
      setPhase("passed");
      return;
    }

    setQuiz(data);
    setPhase("quiz");
  };

  // ── Submit quiz ────────────────────────────────────────────────────────────────
  const submitQuiz = async () => {
    setQuizError("");
    const res  = await fetch(`${API}/api/quiz/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ lesson_id: lessonRef.current.id, answer }),
    });
    const data = await res.json();

    if (data.passed) {
      await loadContent();
      setPhase("passed");
    } else {
      setQuizError("❌ Wrong answer — try again!");
      setAnswer("");
    }
  };

  const watchedPct = duration ? Math.min((watched  / duration) * 100, 100) : 0;
  const currentPct = duration ? Math.min((current  / duration) * 100, 100) : 0;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: "#0a0f1e" }}>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      <div style={{
        width: "280px", flexShrink: 0,
        background: "#0d1526",
        borderRight: "1px solid #1e2d4a",
        overflowY: "auto",
        padding: "24px 16px",
      }}>
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: "#38bdf8", marginBottom: "20px" }}>
          COURSE CONTENT
        </div>

        {modules.length === 0 && (
          <p style={{ color: "#475569", fontSize: "13px" }}>No content. Please enroll.</p>
        )}

        {modules.map((mod, mi) => (
          <div key={mi} style={{ marginBottom: "24px" }}>
            <div style={{ fontSize: "11px", color: "#64748b", fontWeight: 600, letterSpacing: "0.1em", marginBottom: "8px", textTransform: "uppercase" }}>
              {mod.module_title}
            </div>
            {mod.lessons.map((l) => {
              const isActive = lesson?.id === l.id;
              const locked   = !l.unlocked;
              return (
                <div
                  key={l.id}
                  onClick={() => doSelectLesson(l)}
                  style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    padding: "10px 12px", borderRadius: "8px", marginBottom: "4px",
                    cursor: locked ? "not-allowed" : "pointer",
                    background: isActive ? "rgba(56,189,248,0.12)" : "transparent",
                    border: isActive ? "1px solid rgba(56,189,248,0.3)" : "1px solid transparent",
                    opacity: locked ? 0.4 : 1,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: "14px" }}>
                    {locked ? "🔒" : l.completed ? "✅" : isActive ? "▶️" : "○"}
                  </span>
                  <span style={{ fontSize: "13px", color: isActive ? "#38bdf8" : "#94a3b8", fontWeight: isActive ? 600 : 400 }}>
                    {l.title}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* ══ MAIN ═════════════════════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {!lesson ? (
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#334155", fontSize: "16px" }}>
            👈 Select a lesson to begin
          </div>
        ) : (
          <>
            {/* Title bar */}
            <div style={{ padding: "18px 28px", borderBottom: "1px solid #1e2d4a", background: "#0d1526", flexShrink: 0 }}>
              <div style={{ fontSize: "10px", color: "#38bdf8", letterSpacing: "0.12em", marginBottom: "3px", fontWeight: 700 }}>NOW WATCHING</div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#f1f5f9" }}>{lesson.title}</div>
            </div>

            {/* ── VIDEO ──────────────────────────────────────────────────── */}
            {phase === "video" && (
              <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px", display: "flex", flexDirection: "column", gap: "16px" }}>

                {/* 16:9 player shell */}
                <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#000", borderRadius: "12px", overflow: "hidden" }}>
                  <div id="yt-wrap" style={{ position: "absolute", inset: 0 }}>
                    <div id="yt-player" />
                  </div>

                  {/* Loading overlay — shown until player is ready */}
                  {!playerReady && (
                    <div style={{
                      position: "absolute", inset: 0, zIndex: 5,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "#000", color: "#475569", fontSize: "14px",
                      flexDirection: "column", gap: "12px",
                    }}>
                      <div style={{ fontSize: "32px" }}>⏳</div>
                      <div>Loading video...</div>
                    </div>
                  )}

                  {/* Transparent overlay — blocks native YouTube controls & seek */}
                  <div
                    onClick={togglePlay}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                      position: "absolute", inset: 0,
                      zIndex: 10,
                      cursor: "pointer",
                      background: "transparent",
                    }}
                  />
                </div>

                {/* Custom controls */}
                <div style={{ background: "#0d1526", borderRadius: "12px", padding: "18px 20px", border: "1px solid #1e2d4a" }}>

                  {/* Time labels */}
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#475569", marginBottom: "8px" }}>
                    <span style={{ color: "#94a3b8" }}>{fmt(current)}</span>
                    <span style={{ color: "#22c55e", fontWeight: 600 }}>✅ {fmt(watched)} watched</span>
                    <span style={{ color: "#94a3b8" }}>{fmt(duration)}</span>
                  </div>

                  {/* Progress bar */}
                  <div
                    onClick={handleSeekClick}
                    style={{ position: "relative", height: "8px", background: "#1e2d4a", borderRadius: "99px", cursor: "pointer", marginBottom: "8px" }}
                  >
                    {/* Green: watched range */}
                    <div style={{
                      position: "absolute", left: 0, top: 0, height: "100%",
                      width: `${watchedPct}%`,
                      background: "#22c55e", borderRadius: "99px",
                      transition: "width 0.5s linear",
                    }} />
                    {/* White dot: current position */}
                    <div style={{
                      position: "absolute", top: "50%",
                      transform: "translate(-50%, -50%)",
                      left: `${currentPct}%`,
                      width: "14px", height: "14px",
                      background: "#fff", borderRadius: "50%",
                      boxShadow: "0 0 6px rgba(0,0,0,0.6)",
                      transition: "left 0.5s linear",
                      pointerEvents: "none",
                    }} />
                  </div>

                  <div style={{ fontSize: "11px", color: "#334155", marginBottom: "14px" }}>
                    🚫 Forward skipping is disabled — you must watch every second
                  </div>

                  {/* Play / Pause */}
                  <button
                    onClick={togglePlay}
                    disabled={!playerReady}
                    style={{
                      padding: "10px 28px",
                      background: !playerReady ? "#1e2d4a" : playing ? "#334155" : "#38bdf8",
                      border: "none", borderRadius: "8px",
                      color: "#fff", fontWeight: 700, fontSize: "14px",
                      cursor: playerReady ? "pointer" : "not-allowed",
                      transition: "background 0.2s",
                    }}
                  >
                    {!playerReady ? "⏳ Loading..." : playing ? "⏸ Pause" : "▶ Play"}
                  </button>
                </div>
              </div>
            )}

            {/* ── QUIZ ───────────────────────────────────────────────────── */}
            {phase === "quiz" && quiz && (
              <div style={{ flex: 1, overflowY: "auto", padding: "32px 28px" }}>
                <div style={{
                  maxWidth: "680px",
                  background: "#0d1526",
                  border: "2px solid #38bdf8",
                  borderRadius: "16px",
                  padding: "32px",
                }}>
                  <div style={{ fontSize: "11px", color: "#fbbf24", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "6px" }}>
                    LESSON QUIZ
                  </div>
                  <div style={{ fontSize: "13px", color: "#475569", marginBottom: "24px" }}>
                    Answer correctly to unlock the next lesson.
                  </div>

                  <div style={{ fontSize: "17px", color: "#f1f5f9", fontWeight: 600, lineHeight: 1.6, marginBottom: "24px" }}>
                    {quiz.question}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                    {quiz.options.map((opt, i) => (
                      <label key={i} style={{
                        display: "flex", alignItems: "center", gap: "14px",
                        padding: "14px 18px",
                        background: answer === opt ? "rgba(56,189,248,0.15)" : "#111827",
                        border: answer === opt ? "1.5px solid #38bdf8" : "1.5px solid #1e2d4a",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "all 0.15s",
                        color: answer === opt ? "#f1f5f9" : "#94a3b8",
                        fontSize: "14px",
                      }}>
                        <input
                          type="radio"
                          name="quiz"
                          value={opt}
                          checked={answer === opt}
                          onChange={(e) => { setAnswer(e.target.value); setQuizError(""); }}
                          style={{ accentColor: "#38bdf8", width: "16px", height: "16px" }}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>

                  {quizError && (
                    <div style={{ color: "#f87171", fontSize: "14px", marginBottom: "16px", fontWeight: 600 }}>
                      {quizError}
                    </div>
                  )}

                  <button
                    onClick={submitQuiz}
                    disabled={!answer}
                    style={{
                      padding: "13px 32px",
                      background: answer ? "#22c55e" : "#1e2d4a",
                      border: "none", borderRadius: "10px",
                      color: answer ? "#fff" : "#475569",
                      fontSize: "15px", fontWeight: 700,
                      cursor: answer ? "pointer" : "not-allowed",
                      transition: "all 0.2s",
                    }}
                  >
                    Submit Answer →
                  </button>
                </div>
              </div>
            )}

            {/* ── PASSED ─────────────────────────────────────────────────── */}
            {phase === "passed" && (
              <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
                <div style={{ fontSize: "60px" }}>🎉</div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#22c55e" }}>Quiz Passed!</div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  The next lesson is now unlocked. Select it from the sidebar.
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
