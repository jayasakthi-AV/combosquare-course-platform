import { useState, useEffect } from "react";
import api from "../services/api";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  const [view, setView] = useState("courses"); // courses | modules | lessons | quiz
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // ── Forms ────────────────────────────────────────────────────
  const [courseForm, setCourseForm] = useState({ title: "", slug: "", price: "", subtitle: "", level: "Beginner", duration: "" });
  const [moduleForm, setModuleForm] = useState({ title: "" });
  const [lessonForm, setLessonForm] = useState({ title: "", video_url: "" });
  const [quizForm, setQuizForm] = useState({ question: "", option1: "", option2: "", option3: "", option4: "", answer: "" });

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  // ── Fetch courses ─────────────────────────────────────────────
  const fetchCourses = async () => {
    try {
      const res = await api.get("/programs/");
      setCourses(res.data);
    } catch {}
  };

  useEffect(() => { fetchCourses(); }, []);

  // ── Fetch modules for a course ────────────────────────────────
  const fetchModules = async (courseId) => {
    try {
      const res = await api.get(`/admin/modules/${courseId}`);
      setModules(res.data);
    } catch { setModules([]); }
  };

  // ── Fetch lessons for a module ────────────────────────────────
  const fetchLessons = async (moduleId) => {
    try {
      const res = await api.get(`/admin/lessons/${moduleId}`);
      setLessons(res.data);
    } catch { setLessons([]); }
  };

  // ── Fetch quiz for a lesson ───────────────────────────────────
  const fetchQuiz = async (lessonId) => {
    try {
      const res = await api.get(`/admin/quiz/${lessonId}`);
      setQuizzes(res.data);
    } catch { setQuizzes([]); }
  };

  // ── Create course ─────────────────────────────────────────────
  const createCourse = async () => {
    if (!courseForm.title || !courseForm.slug) return alert("Title and slug required");
    setLoading(true);
    try {
      await api.post("/admin/course", {
        ...courseForm,
        price: parseInt(courseForm.price) || 0,
      });
      flash("✅ Course created!");
      setCourseForm({ title: "", slug: "", price: "", subtitle: "", level: "Beginner", duration: "" });
      fetchCourses();
    } catch (e) {
      flash("❌ " + (e.response?.data?.error || "Failed"));
    } finally { setLoading(false); }
  };

  // ── Create module ─────────────────────────────────────────────
  const createModule = async () => {
    if (!moduleForm.title) return alert("Module title required");
    setLoading(true);
    try {
      await api.post("/admin/module", { title: moduleForm.title, course_id: selectedCourse.id });
      flash("✅ Module created!");
      setModuleForm({ title: "" });
      fetchModules(selectedCourse.id);
    } catch { flash("❌ Failed"); } finally { setLoading(false); }
  };

  // ── Create lesson ─────────────────────────────────────────────
  const createLesson = async () => {
    if (!lessonForm.title || !lessonForm.video_url) return alert("Title and YouTube URL required");
    setLoading(true);
    try {
      await api.post("/admin/lesson", { ...lessonForm, module_id: selectedModule.id });
      flash("✅ Lesson created!");
      setLessonForm({ title: "", video_url: "" });
      fetchLessons(selectedModule.id);
    } catch { flash("❌ Failed"); } finally { setLoading(false); }
  };

  // ── Create quiz ───────────────────────────────────────────────
  const createQuiz = async () => {
    const { question, option1, option2, option3, option4, answer } = quizForm;
    if (!question || !option1 || !option2 || !option3 || !option4 || !answer) {
      return alert("All quiz fields required");
    }
    setLoading(true);
    try {
      await api.post("/admin/quiz", { ...quizForm, lesson_id: selectedLesson.id });
      flash("✅ Quiz created!");
      setQuizForm({ question: "", option1: "", option2: "", option3: "", option4: "", answer: "" });
      fetchQuiz(selectedLesson.id);
    } catch { flash("❌ Failed"); } finally { setLoading(false); }
  };

  return (
    <div style={styles.root}>
      {/* Flash message */}
      {msg && <div style={styles.flash}>{msg}</div>}

      {/* ── Breadcrumb ── */}
      <div style={styles.breadcrumb}>
        <button onClick={() => setView("courses")} style={view === "courses" ? styles.crumbActive : styles.crumb}>
          📚 Courses
        </button>
        {selectedCourse && (
          <>
            <span style={styles.crumbSep}>›</span>
            <button onClick={() => setView("modules")} style={view === "modules" ? styles.crumbActive : styles.crumb}>
              📂 {selectedCourse.title}
            </button>
          </>
        )}
        {selectedModule && (
          <>
            <span style={styles.crumbSep}>›</span>
            <button onClick={() => setView("lessons")} style={view === "lessons" ? styles.crumbActive : styles.crumb}>
              🎬 {selectedModule.title}
            </button>
          </>
        )}
        {selectedLesson && view === "quiz" && (
          <>
            <span style={styles.crumbSep}>›</span>
            <span style={styles.crumbActive}>❓ Quiz: {selectedLesson.title}</span>
          </>
        )}
      </div>

      {/* ─── COURSES VIEW ─── */}
      {view === "courses" && (
        <div style={styles.panel}>
          <h2 style={styles.panelTitle}>Create New Course</h2>
          <div style={styles.formGrid}>
            <input style={styles.input} placeholder="Course Title" value={courseForm.title}
              onChange={e => setCourseForm(p => ({ ...p, title: e.target.value }))} />
            <input style={styles.input} placeholder="Slug (e.g. react-bootcamp)" value={courseForm.slug}
              onChange={e => setCourseForm(p => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }))} />
            <input style={styles.input} placeholder="Subtitle (optional)" value={courseForm.subtitle}
              onChange={e => setCourseForm(p => ({ ...p, subtitle: e.target.value }))} />
            <input style={styles.input} placeholder="Price (₹)" type="number" value={courseForm.price}
              onChange={e => setCourseForm(p => ({ ...p, price: e.target.value }))} />
            <input style={styles.input} placeholder="Duration (e.g. 3 Months)" value={courseForm.duration}
              onChange={e => setCourseForm(p => ({ ...p, duration: e.target.value }))} />
            <select style={styles.input} value={courseForm.level}
              onChange={e => setCourseForm(p => ({ ...p, level: e.target.value }))}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <button onClick={createCourse} disabled={loading} style={styles.primaryBtn}>
            {loading ? "Creating..." : "＋ Create Course"}
          </button>

          <h2 style={{ ...styles.panelTitle, marginTop: 32 }}>All Courses ({courses.length})</h2>
          <div style={styles.cardGrid}>
            {courses.map(c => (
              <div key={c.id} style={styles.card} onClick={() => {
                setSelectedCourse(c);
                setSelectedModule(null);
                setSelectedLesson(null);
                setView("modules");
                fetchModules(c.id);
              }}>
                <div style={styles.cardTop}>
                  <span style={styles.courseIcon}>📚</span>
                  <span style={c.is_active ? styles.badgeActive : styles.badgeInactive}>
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <h3 style={styles.cardTitle}>{c.title}</h3>
                <p style={styles.cardMeta}>₹{c.price} · {c.level || "—"} · {c.duration || "—"}</p>
                <p style={styles.cardSlug}>{c.slug}</p>
                <div style={styles.cardFooter}>
                  <span style={styles.cardAction}>Manage Modules →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODULES VIEW ─── */}
      {view === "modules" && selectedCourse && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>Modules — {selectedCourse.title}</h2>
              <p style={styles.panelSub}>Create modules (chapters) for this course</p>
            </div>
          </div>

          <div style={styles.inlineForm}>
            <input style={{ ...styles.input, flex: 1 }} placeholder="Module Title (e.g. Introduction to React)"
              value={moduleForm.title} onChange={e => setModuleForm({ title: e.target.value })} />
            <button onClick={createModule} disabled={loading} style={styles.primaryBtn}>
              {loading ? "..." : "＋ Add Module"}
            </button>
          </div>

          <div style={styles.listContainer}>
            {modules.length === 0 ? (
              <div style={styles.empty}>No modules yet. Add your first module above.</div>
            ) : modules.map((mod, i) => (
              <div key={mod.id} style={styles.listItem} onClick={() => {
                setSelectedModule(mod);
                setView("lessons");
                fetchLessons(mod.id);
              }}>
                <div style={styles.listLeft}>
                  <span style={styles.listNum}>{i + 1}</span>
                  <div>
                    <p style={styles.listTitle}>{mod.title}</p>
                    <p style={styles.listSub}>Click to manage lessons</p>
                  </div>
                </div>
                <span style={styles.listArrow}>→</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── LESSONS VIEW ─── */}
      {view === "lessons" && selectedModule && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>Lessons — {selectedModule.title}</h2>
              <p style={styles.panelSub}>Add YouTube video lessons. Users must watch full video before quiz.</p>
            </div>
          </div>

          <div style={styles.formGrid}>
            <input style={styles.input} placeholder="Lesson Title"
              value={lessonForm.title} onChange={e => setLessonForm(p => ({ ...p, title: e.target.value }))} />
            <input style={styles.input} placeholder="YouTube URL (e.g. https://youtu.be/abc123)"
              value={lessonForm.video_url} onChange={e => setLessonForm(p => ({ ...p, video_url: e.target.value }))} />
          </div>
          <button onClick={createLesson} disabled={loading} style={styles.primaryBtn}>
            {loading ? "..." : "＋ Add Lesson"}
          </button>

          <div style={styles.listContainer}>
            {lessons.length === 0 ? (
              <div style={styles.empty}>No lessons yet. Add your first lesson above.</div>
            ) : lessons.map((lesson, i) => (
              <div key={lesson.id} style={styles.listItem}>
                <div style={styles.listLeft}>
                  <span style={styles.listNum}>{i + 1}</span>
                  <div>
                    <p style={styles.listTitle}>{lesson.title}</p>
                    <p style={{ ...styles.listSub, color: "#4ade80" }}>
                      🎬 {lesson.video_url?.substring(0, 50)}...
                    </p>
                  </div>
                </div>
                <button
                  style={styles.quizBtn}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setView("quiz");
                    fetchQuiz(lesson.id);
                  }}
                >
                  ❓ Quiz
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── QUIZ VIEW ─── */}
      {view === "quiz" && selectedLesson && (
        <div style={styles.panel}>
          <div style={styles.panelHeader}>
            <div>
              <h2 style={styles.panelTitle}>Quiz — {selectedLesson.title}</h2>
              <p style={styles.panelSub}>Add a quiz question. User must pass to unlock the next lesson.</p>
            </div>
          </div>

          {quizzes.length > 0 ? (
            <div style={styles.quizExisting}>
              <span style={styles.quizExistingIcon}>✅</span>
              <div>
                <p style={styles.listTitle}>Quiz already exists</p>
                <p style={styles.listSub}>{quizzes[0]?.question}</p>
              </div>
            </div>
          ) : (
            <>
              <div style={styles.formGrid}>
                <input style={{ ...styles.input, gridColumn: "1/-1" }} placeholder="Question"
                  value={quizForm.question} onChange={e => setQuizForm(p => ({ ...p, question: e.target.value }))} />
                <input style={styles.input} placeholder="Option A"
                  value={quizForm.option1} onChange={e => setQuizForm(p => ({ ...p, option1: e.target.value }))} />
                <input style={styles.input} placeholder="Option B"
                  value={quizForm.option2} onChange={e => setQuizForm(p => ({ ...p, option2: e.target.value }))} />
                <input style={styles.input} placeholder="Option C"
                  value={quizForm.option3} onChange={e => setQuizForm(p => ({ ...p, option3: e.target.value }))} />
                <input style={styles.input} placeholder="Option D"
                  value={quizForm.option4} onChange={e => setQuizForm(p => ({ ...p, option4: e.target.value }))} />
                <input style={{ ...styles.input, gridColumn: "1/-1", borderColor: "#7c3aed" }}
                  placeholder="Correct Answer (must exactly match one option)"
                  value={quizForm.answer} onChange={e => setQuizForm(p => ({ ...p, answer: e.target.value }))} />
              </div>
              <button onClick={createQuiz} disabled={loading} style={styles.primaryBtn}>
                {loading ? "..." : "＋ Create Quiz"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = {
  root: { fontFamily: "'DM Sans', sans-serif", maxWidth: 900 },
  flash: {
    position: "fixed", top: 20, right: 20, zIndex: 999,
    background: "#1e293b", border: "1px solid #7c3aed",
    color: "#e2e8f0", padding: "12px 20px", borderRadius: 10,
    fontSize: 14, fontWeight: 500,
  },
  breadcrumb: {
    display: "flex", alignItems: "center", gap: 6,
    marginBottom: 24, flexWrap: "wrap",
  },
  crumb: {
    background: "none", border: "none", color: "#64748b",
    cursor: "pointer", fontSize: 14, fontFamily: "inherit", padding: "4px 8px", borderRadius: 6,
  },
  crumbActive: {
    background: "#1e293b", border: "none", color: "#e2e8f0",
    cursor: "default", fontSize: 14, fontFamily: "inherit", padding: "4px 8px", borderRadius: 6, fontWeight: 600,
  },
  crumbSep: { color: "#334155", fontSize: 18 },
  panel: { background: "white", borderRadius: 16, padding: 28, boxShadow: "0 1px 3px #0001" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 },
  panelTitle: { fontSize: 18, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" },
  panelSub: { fontSize: 13, color: "#94a3b8", margin: 0 },
  formGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16,
  },
  inlineForm: { display: "flex", gap: 12, marginBottom: 20 },
  input: {
    padding: "10px 14px", borderRadius: 8, border: "1px solid #e2e8f0",
    fontSize: 14, fontFamily: "inherit", color: "#1e293b", outline: "none",
    transition: "border 0.15s",
    width: "100%", boxSizing: "border-box",
  },
  primaryBtn: {
    background: "#7c3aed", border: "none", color: "white",
    padding: "11px 22px", borderRadius: 8, cursor: "pointer",
    fontFamily: "inherit", fontWeight: 600, fontSize: 14,
    display: "inline-flex", alignItems: "center", gap: 6,
    whiteSpace: "nowrap",
  },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginTop: 16 },
  card: {
    background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12,
    padding: 18, cursor: "pointer", transition: "all 0.15s",
  },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  courseIcon: { fontSize: 24 },
  badgeActive: { background: "#dcfce7", color: "#15803d", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 },
  badgeInactive: { background: "#fee2e2", color: "#b91c1c", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: "#1e293b", margin: "0 0 4px" },
  cardMeta: { fontSize: 12, color: "#64748b", margin: "0 0 2px" },
  cardSlug: { fontSize: 11, color: "#94a3b8", fontFamily: "monospace", margin: 0 },
  cardFooter: { marginTop: 12, paddingTop: 10, borderTop: "1px solid #e2e8f0" },
  cardAction: { fontSize: 13, color: "#7c3aed", fontWeight: 600 },
  listContainer: { marginTop: 20, display: "flex", flexDirection: "column", gap: 8 },
  empty: { textAlign: "center", padding: 32, color: "#94a3b8", fontSize: 14, border: "1px dashed #e2e8f0", borderRadius: 10 },
  listItem: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 16px", background: "#f8fafc", borderRadius: 10,
    border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.15s",
  },
  listLeft: { display: "flex", alignItems: "center", gap: 14 },
  listNum: {
    width: 32, height: 32, background: "#7c3aed22", color: "#7c3aed",
    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 13, fontWeight: 700, flexShrink: 0,
  },
  listTitle: { margin: 0, fontWeight: 600, color: "#1e293b", fontSize: 14 },
  listSub: { margin: "2px 0 0", fontSize: 12, color: "#94a3b8" },
  listArrow: { color: "#7c3aed", fontSize: 18 },
  quizBtn: {
    background: "#f5f3ff", border: "1px solid #7c3aed33", color: "#7c3aed",
    padding: "6px 14px", borderRadius: 8, cursor: "pointer",
    fontFamily: "inherit", fontSize: 13, fontWeight: 600,
    whiteSpace: "nowrap",
  },
  quizExisting: {
    display: "flex", alignItems: "center", gap: 14,
    padding: 20, background: "#f0fdf4", borderRadius: 10, border: "1px solid #bbf7d0",
  },
  quizExistingIcon: { fontSize: 28 },
};
