import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

// ── Extract YouTube video ID ──────────────────────────────────────
function getYouTubeId(url) {
  if (!url) return null;
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export default function CoursePlayer() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progressPercent, setProgressPercent] = useState(0);

  const iframeRef = useRef(null);
  const progressInterval = useRef(null);
  const progressReported = useRef(0);

  // ── Fetch course content ──────────────────────────────────────
  const fetchContent = useCallback(async () => {
    try {
      const [courseRes, contentRes] = await Promise.all([
        api.get(`/lms/courses/${slug}`),
        api.get(`/lms/courses/${slug}/content`)
      ]);
      setCourse(courseRes.data);
      setModules(contentRes.data);

      // Auto-select first unlocked lesson that isn't completed
      const allLessons = contentRes.data.flatMap(m => m.lessons);
      const firstUnfinished = allLessons.find(l => l.unlocked && !l.quiz_passed);
      const firstUnlocked = allLessons.find(l => l.unlocked);
      selectLesson(firstUnfinished || firstUnlocked || allLessons[0], false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // ── Select a lesson ───────────────────────────────────────────
  const selectLesson = (lesson, refetch = true) => {
    if (!lesson) return;
    setActiveLesson(lesson);
    setVideoCompleted(lesson.completed || false);
    setProgressPercent(lesson.video_progress || 0);
    setShowQuiz(false);
    setQuizData(null);
    setQuizAnswer("");
    setQuizResult(null);
    progressReported.current = lesson.video_progress || 0;
    if (refetch) fetchContent();
  };

  // ── YouTube iframe API simulation via postMessage ─────────────
  // We use a simple approach: poll time via YouTube iframe API
  useEffect(() => {
    if (!activeLesson || videoCompleted) return;

    // Listen for YouTube player state messages
    const handleMessage = (event) => {
      if (event.origin !== "https://www.youtube.com") return;
      try {
        const data = JSON.parse(event.data);
        // YouTube iframe API events
        if (data.event === "onStateChange") {
          if (data.info === 0) {
            // Video ended
            handleVideoComplete();
          }
        }
        if (data.event === "infoDelivery" && data.info?.currentTime && data.info?.duration) {
          const pct = Math.floor((data.info.currentTime / data.info.duration) * 100);
          if (pct > progressReported.current) {
            progressReported.current = pct;
            setProgressPercent(pct);
            // Report progress every 5%
            if (pct % 5 === 0) {
              reportProgress(pct, false);
            }
          }
        }
      } catch {}
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [activeLesson, videoCompleted]);

  const reportProgress = async (pct, completed) => {
    if (!activeLesson) return;
    try {
      await api.post("/progress/", {
        lesson_id: activeLesson.id,
        progress: pct,
        completed
      });
    } catch {}
  };

  const handleVideoComplete = async () => {
    if (videoCompleted) return;
    setVideoCompleted(true);
    await reportProgress(100, true);
    setActiveLesson(prev => prev ? { ...prev, completed: true } : prev);
  };

  // ── Load quiz ─────────────────────────────────────────────────
  const loadQuiz = async () => {
    if (!activeLesson) return;
    setQuizLoading(true);
    setShowQuiz(true);
    try {
      const res = await api.get(`/quiz/lesson/${activeLesson.id}`);
      if (res.data.no_quiz) {
        setQuizData(null);
        await fetchContent();
      } else {
        setQuizData(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to load quiz";
      alert(msg);
      setShowQuiz(false);
    } finally {
      setQuizLoading(false);
    }
  };

  // ── Submit quiz ───────────────────────────────────────────────
  const submitQuiz = async () => {
    if (!quizAnswer) return alert("Please select an answer");
    try {
      const res = await api.post("/quiz/submit", {
        lesson_id: activeLesson.id,
        answer: quizAnswer
      });
      setQuizResult(res.data);
      if (res.data.passed) {
        await fetchContent();
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Quiz submission failed");
    }
  };

  // ── Calculate overall progress ────────────────────────────────
  const allLessons = modules.flatMap(m => m.lessons);
  const completedCount = allLessons.filter(l => l.quiz_passed).length;
  const overallProgress = allLessons.length > 0
    ? Math.round((completedCount / allLessons.length) * 100)
    : 0;

  const videoId = activeLesson ? getYouTubeId(activeLesson.video_url) : null;

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.spinner} />
        <p style={{ color: "#94a3b8", marginTop: 16, fontFamily: "'DM Sans', sans-serif" }}>
          Loading course...
        </p>
      </div>
    );
  }

  return (
    <div style={styles.root}>
      {/* ── Top Bar ── */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <button onClick={() => navigate("/dashboard")} style={styles.backBtn}>
            ← Back
          </button>
          <span style={styles.courseName}>{course?.title}</span>
        </div>
        <div style={styles.topRight}>
          <div style={styles.progressContainer}>
            <span style={styles.progressLabel}>{overallProgress}% complete</span>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill, width: `${overallProgress}%` }} />
            </div>
          </div>
          <button onClick={() => setSidebarOpen(o => !o)} style={styles.sidebarToggle}>
            {sidebarOpen ? "✕ Close" : "☰ Lessons"}
          </button>
        </div>
      </div>

      <div style={styles.body}>
        {/* ── Video Area ── */}
        <div style={{ ...styles.videoArea, marginRight: sidebarOpen ? 340 : 0 }}>
          {activeLesson ? (
            <>
              {/* Video */}
              <div style={styles.videoWrapper}>
                {videoId ? (
                  <iframe
                    ref={iframeRef}
                    style={styles.videoIframe}
                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div style={styles.noVideo}>
                    <span style={{ fontSize: 48 }}>🎬</span>
                    <p>Video not available</p>
                  </div>
                )}
              </div>

              {/* Lesson Info */}
              <div style={styles.lessonInfo}>
                <div style={styles.lessonMeta}>
                  <h2 style={styles.lessonTitle}>{activeLesson.title}</h2>
                  <div style={styles.badges}>
                    {activeLesson.completed && (
                      <span style={styles.badgeGreen}>✓ Watched</span>
                    )}
                    {activeLesson.quiz_passed && (
                      <span style={styles.badgePurple}>✓ Quiz Passed</span>
                    )}
                  </div>
                </div>

                {/* Video progress bar */}
                {!videoCompleted && (
                  <div style={styles.watchProgress}>
                    <div style={styles.watchProgressLabel}>
                      <span style={{ color: "#94a3b8", fontSize: 13 }}>Watch progress</span>
                      <span style={{ color: "#e2e8f0", fontSize: 13 }}>{progressPercent}%</span>
                    </div>
                    <div style={styles.watchTrack}>
                      <div style={{ ...styles.watchFill, width: `${progressPercent}%` }} />
                    </div>
                    <p style={styles.watchHint}>
                      You must watch the full video before taking the quiz
                    </p>
                  </div>
                )}

                {/* Manual complete button (fallback for YouTube API detection) */}
                {!videoCompleted && (
                  <button onClick={handleVideoComplete} style={styles.completeBtn}>
                    ✅ Mark Video as Watched
                  </button>
                )}

                {/* Quiz Section */}
                {videoCompleted && !activeLesson.quiz_passed && !showQuiz && (
                  <div style={styles.quizPrompt}>
                    <div style={styles.quizPromptInner}>
                      <span style={{ fontSize: 32 }}>🎯</span>
                      <div>
                        <p style={styles.quizPromptTitle}>Video complete!</p>
                        <p style={styles.quizPromptSub}>Take the quiz to unlock the next lesson</p>
                      </div>
                      <button onClick={loadQuiz} style={styles.startQuizBtn}>
                        Start Quiz →
                      </button>
                    </div>
                  </div>
                )}

                {/* Quiz */}
                {showQuiz && (
                  <div style={styles.quizBox}>
                    {quizLoading ? (
                      <div style={{ textAlign: "center", padding: 32, color: "#94a3b8" }}>
                        Loading quiz...
                      </div>
                    ) : quizData ? (
                      <>
                        <h3 style={styles.quizTitle}>📝 Quiz</h3>
                        <p style={styles.quizQuestion}>{quizData.question}</p>
                        <div style={styles.options}>
                          {quizData.options.map((opt, i) => {
                            const isSelected = quizAnswer === opt;
                            const isCorrect = quizResult?.passed && isSelected;
                            const isWrong = quizResult && !quizResult.passed && isSelected;
                            return (
                              <button
                                key={i}
                                onClick={() => !quizResult && setQuizAnswer(opt)}
                                style={{
                                  ...styles.optionBtn,
                                  ...(isSelected ? styles.optionSelected : {}),
                                  ...(isCorrect ? styles.optionCorrect : {}),
                                  ...(isWrong ? styles.optionWrong : {}),
                                }}
                              >
                                <span style={styles.optionLetter}>
                                  {String.fromCharCode(65 + i)}
                                </span>
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizResult ? (
                          <div style={quizResult.passed ? styles.resultPass : styles.resultFail}>
                            {quizResult.passed ? (
                              <>🎉 Correct! Next lesson is now unlocked.</>
                            ) : (
                              <>
                                ❌ {quizResult.message}
                                {quizResult.correct_answer && (
                                  <span> Correct: <strong>{quizResult.correct_answer}</strong></span>
                                )}
                                <button
                                  onClick={() => { setQuizAnswer(""); setQuizResult(null); }}
                                  style={styles.retryBtn}
                                >
                                  Try Again
                                </button>
                              </>
                            )}
                          </div>
                        ) : (
                          <button
                            onClick={submitQuiz}
                            disabled={!quizAnswer}
                            style={{ ...styles.submitQuizBtn, opacity: quizAnswer ? 1 : 0.5 }}
                          >
                            Submit Answer
                          </button>
                        )}
                      </>
                    ) : null}
                  </div>
                )}

                {/* Already passed */}
                {activeLesson.quiz_passed && (
                  <div style={styles.allDone}>
                    ✅ Lesson complete! Select the next lesson from the sidebar.
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={styles.noLesson}>
              <span style={{ fontSize: 64 }}>📚</span>
              <p>Select a lesson to begin</p>
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <span style={styles.sidebarTitle}>Course Content</span>
              <span style={styles.sidebarCount}>{completedCount}/{allLessons.length} done</span>
            </div>

            <div style={styles.moduleList}>
              {modules.map((mod, mi) => (
                <div key={mod.id} style={styles.moduleItem}>
                  <div style={styles.moduleTitle}>
                    <span style={styles.moduleNum}>Module {mi + 1}</span>
                    <span>{mod.module_title}</span>
                  </div>

                  {mod.lessons.map((lesson, li) => {
                    const isActive = activeLesson?.id === lesson.id;
                    const locked = !lesson.unlocked;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !locked && selectLesson(lesson)}
                        style={{
                          ...styles.lessonBtn,
                          ...(isActive ? styles.lessonActive : {}),
                          ...(locked ? styles.lessonLocked : {}),
                        }}
                        disabled={locked}
                        title={locked ? "Complete previous lesson first" : ""}
                      >
                        <span style={styles.lessonIcon}>
                          {locked ? "🔒" : lesson.quiz_passed ? "✅" : lesson.completed ? "👁" : "▶"}
                        </span>
                        <span style={styles.lessonBtnTitle}>{lesson.title}</span>
                        {lesson.quiz_passed && (
                          <span style={styles.lessonDone}>✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = {
  root: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "#e2e8f0",
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
  },
  loadingScreen: {
    minHeight: "100vh",
    background: "#0f172a",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    width: 40,
    height: 40,
    border: "3px solid #1e293b",
    borderTop: "3px solid #7c3aed",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  topBar: {
    background: "#1e293b",
    borderBottom: "1px solid #334155",
    padding: "12px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  topLeft: { display: "flex", alignItems: "center", gap: 16 },
  backBtn: {
    background: "none",
    border: "1px solid #334155",
    color: "#94a3b8",
    padding: "6px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
  },
  courseName: { fontSize: 15, fontWeight: 600, color: "#e2e8f0" },
  topRight: { display: "flex", alignItems: "center", gap: 20 },
  progressContainer: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 },
  progressLabel: { fontSize: 12, color: "#94a3b8" },
  progressTrack: { width: 120, height: 4, background: "#334155", borderRadius: 2 },
  progressFill: { height: "100%", background: "#7c3aed", borderRadius: 2, transition: "width 0.5s" },
  sidebarToggle: {
    background: "#7c3aed",
    border: "none",
    color: "white",
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    fontWeight: 500,
  },
  body: { display: "flex", flex: 1, position: "relative" },
  videoArea: {
    flex: 1,
    transition: "margin-right 0.3s",
    minHeight: "calc(100vh - 57px)",
  },
  videoWrapper: {
    position: "relative",
    paddingBottom: "56.25%",
    background: "#000",
  },
  videoIframe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: "none",
  },
  noVideo: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    gap: 12,
  },
  lessonInfo: {
    padding: "24px 32px",
    maxWidth: 800,
  },
  lessonMeta: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 },
  lessonTitle: { fontSize: 22, fontWeight: 700, margin: 0, color: "#f1f5f9" },
  badges: { display: "flex", gap: 8, flexShrink: 0, marginLeft: 16, marginTop: 4 },
  badgeGreen: { background: "#052e16", color: "#4ade80", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  badgePurple: { background: "#2e1065", color: "#a78bfa", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 },
  watchProgress: { marginBottom: 16 },
  watchProgressLabel: { display: "flex", justifyContent: "space-between", marginBottom: 6 },
  watchTrack: { height: 6, background: "#1e293b", borderRadius: 3 },
  watchFill: { height: "100%", background: "#f59e0b", borderRadius: 3, transition: "width 0.3s" },
  watchHint: { fontSize: 12, color: "#64748b", marginTop: 6 },
  completeBtn: {
    background: "#1e293b",
    border: "1px dashed #334155",
    color: "#94a3b8",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontFamily: "inherit",
    marginBottom: 16,
  },
  quizPrompt: {
    background: "#1e293b",
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    border: "1px solid #7c3aed44",
  },
  quizPromptInner: { display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" },
  quizPromptTitle: { margin: 0, fontWeight: 700, fontSize: 16, color: "#f1f5f9" },
  quizPromptSub: { margin: "4px 0 0", fontSize: 13, color: "#94a3b8" },
  startQuizBtn: {
    marginLeft: "auto",
    background: "#7c3aed",
    border: "none",
    color: "white",
    padding: "10px 20px",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: 14,
  },
  quizBox: {
    background: "#1e293b",
    borderRadius: 12,
    padding: 24,
    marginTop: 16,
    border: "1px solid #334155",
  },
  quizTitle: { margin: "0 0 8px", fontSize: 16, color: "#94a3b8", fontWeight: 600 },
  quizQuestion: { fontSize: 18, fontWeight: 600, color: "#f1f5f9", margin: "0 0 20px" },
  options: { display: "flex", flexDirection: "column", gap: 10 },
  optionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#0f172a",
    border: "1px solid #334155",
    color: "#cbd5e1",
    padding: "12px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 14,
    textAlign: "left",
    transition: "all 0.15s",
  },
  optionSelected: { border: "1px solid #7c3aed", background: "#2e1065", color: "#e2e8f0" },
  optionCorrect: { border: "1px solid #22c55e", background: "#052e16", color: "#4ade80" },
  optionWrong: { border: "1px solid #ef4444", background: "#450a0a", color: "#fca5a5" },
  optionLetter: {
    width: 28, height: 28, borderRadius: "50%",
    background: "#334155", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, flexShrink: 0,
  },
  submitQuizBtn: {
    marginTop: 20,
    background: "#7c3aed",
    border: "none",
    color: "white",
    padding: "12px 28px",
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: 15,
  },
  retryBtn: {
    marginLeft: 12,
    background: "none",
    border: "1px solid currentColor",
    color: "inherit",
    padding: "4px 12px",
    borderRadius: 6,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: 13,
  },
  resultPass: {
    marginTop: 16,
    background: "#052e16",
    border: "1px solid #22c55e",
    color: "#4ade80",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
  },
  resultFail: {
    marginTop: 16,
    background: "#450a0a",
    border: "1px solid #ef4444",
    color: "#fca5a5",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  allDone: {
    marginTop: 16,
    background: "#052e16",
    border: "1px solid #22c55e",
    color: "#4ade80",
    padding: "12px 16px",
    borderRadius: 8,
    fontSize: 14,
  },
  noLesson: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 400,
    color: "#475569",
    gap: 12,
  },
  sidebar: {
    width: 340,
    background: "#1e293b",
    borderLeft: "1px solid #334155",
    position: "fixed",
    right: 0,
    top: 57,
    bottom: 0,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #334155",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "sticky",
    top: 0,
    background: "#1e293b",
    zIndex: 1,
  },
  sidebarTitle: { fontWeight: 700, fontSize: 14, color: "#f1f5f9" },
  sidebarCount: { fontSize: 12, color: "#7c3aed", fontWeight: 600 },
  moduleList: { padding: "8px 0" },
  moduleItem: { marginBottom: 8 },
  moduleTitle: {
    padding: "10px 20px",
    background: "#0f172a",
    color: "#64748b",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    display: "flex",
    gap: 8,
  },
  moduleNum: { color: "#7c3aed" },
  lessonBtn: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 20px",
    background: "none",
    border: "none",
    color: "#94a3b8",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "inherit",
    fontSize: 13,
    borderLeft: "3px solid transparent",
    transition: "all 0.15s",
  },
  lessonActive: {
    background: "#0f172a",
    borderLeft: "3px solid #7c3aed",
    color: "#e2e8f0",
  },
  lessonLocked: { opacity: 0.45, cursor: "not-allowed" },
  lessonIcon: { fontSize: 14, flexShrink: 0 },
  lessonBtnTitle: { flex: 1, lineHeight: 1.3 },
  lessonDone: { color: "#4ade80", fontSize: 14, flexShrink: 0 },
};
