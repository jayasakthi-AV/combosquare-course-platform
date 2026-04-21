import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";

export default function LearnPage() {
  const { slug } = useParams();

  const [modules, setModules] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");

  const token = localStorage.getItem("token");

  // 📦 LOAD CONTENT
  const loadContent = async () => {
    const res = await fetch(
      `http://127.0.0.1:8001/api/lms/courses/${slug}/content`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = await res.json();
    console.log("CONTENT 👉", data);
    if (Array.isArray(data)) {
      setModules(data);
    } else {
      console.log("API ERROR 👉", data);
      setModules([]); // prevent crash
    }
  };

  useEffect(() => {
    loadContent();
  }, [slug]);

  // 🎯 AUTO SELECT FIRST LESSON
  useEffect(() => {
    if (modules.length > 0 && modules[0].lessons.length > 0) {
      setSelectedLesson(modules[0].lessons[0]);
    }
  }, [modules]);

  // 🎬 VIDEO END → SHOW QUIZ
  const handleVideoEnd = async () => {
    console.log("VIDEO ENDED");

    // mark completed
    await fetch("http://127.0.0.1:8001/api/progress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        lesson_id: selectedLesson.id,
        progress: 100,
      }),
    });

    // fetch quiz
    const res = await fetch(
      `http://127.0.0.1:8001/api/quiz/lesson/${selectedLesson.id}`
    );
    const data = await res.json();

    setQuiz(data);
  };

  // 📝 SUBMIT QUIZ
  const submitQuiz = async () => {
    const res = await fetch(
      `http://127.0.0.1:8001/api/quiz/submit?lesson_id=${selectedLesson.id}&answer=${selectedAnswer}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();

    if (data.passed) {
      alert("✅ Passed!");

      setQuiz(null);
      setSelectedAnswer("");

      // reload content → unlock next lesson
      loadContent();
    } else {
      alert("❌ Wrong answer");
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: "300px",
          background: "#0f172a",
          color: "#fff",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>📚 Course</h2>

        {Array.isArray(modules) && modules.length > 0 ? (
  modules.map((mod, mIndex) => (
    <div key={mIndex}>
      <h4 style={{ color: "#38bdf8" }}>{mod.module_title}</h4>

      {mod.lessons.map((lesson, lIndex) => (
        <div
          key={lesson.id}
          onClick={() => {
            if (!lesson.unlocked) return;

            setSelectedLesson(lesson);
            setQuiz(null);
          }}
          style={{
            padding: "10px",
            margin: "5px 0",
            cursor: lesson.unlocked ? "pointer" : "not-allowed",
            background:
              selectedLesson?.id === lesson.id
                ? "#1e293b"
                : "transparent",
            opacity: lesson.unlocked ? 1 : 0.5,
            borderRadius: "8px",
          }}
        >
          {lesson.unlocked ? "▶" : "🔒"} {lesson.title}
        </div>
      ))}
    </div>
  ))
) : (
  <p style={{ color: "white" }}>
    🚫 No content available / Please enroll
  </p>
)}
      </div>

      {/* RIGHT CONTENT */}
      <div style={{ flex: 1, padding: "20px" }}>
        {selectedLesson && (
          <>
            <h2>{selectedLesson.title}</h2>

            {/* 🎥 VIDEO */}
            <ReactPlayer
              url={selectedLesson.video_url}
              controls
              width="100%"
              height="500px"
              onEnded={handleVideoEnd}
              config={{
                youtube: {
                  playerVars: {
                    controls: 1,
                    disablekb: 1,
                    modestbranding: 1,
                  },
                },
              }}
            />

            {/* 📝 QUIZ */}
            {quiz && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "20px",
                  background: "#111",
                  color: "#fff",
                  borderRadius: "10px",
                }}
              >
                <h3>{quiz.question}</h3>

                {quiz.options.map((opt, i) => (
                  <div key={i}>
                    <input
                      type="radio"
                      name="quiz"
                      value={opt}
                      onChange={(e) =>
                        setSelectedAnswer(e.target.value)
                      }
                    />
                    <label style={{ marginLeft: "10px" }}>{opt}</label>
                  </div>
                ))}

                <button
                  onClick={submitQuiz}
                  style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    background: "#22c55e",
                    border: "none",
                    color: "#fff",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Submit Quiz
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}