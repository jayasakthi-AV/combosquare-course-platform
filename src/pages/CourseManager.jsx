import { useState } from "react";
import api from "../services/api";

export default function CourseManager() {
  const [courseTitle, setCourseTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [courseId, setCourseId] = useState("");
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [lessonTitle, setLessonTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");
  const [lessonId, setLessonId] = useState("");
  // 🔹 CREATE COURSE
  const createCourse = async () => {
    await api.post("/admin/course", {
      title: courseTitle,
      slug: slug,
      price: 1000, // 🔥 REQUIRED
    });
    alert("Course created!");
  };

  // 🔹 CREATE MODULE
  const createModule = async () => {
    const res = await api.post("/admin/module", {
      title: moduleTitle,
      course_id: Number(courseId),
    });
  
    alert("Module created!");
    setModuleId(res.data.id);
  };

  // 🔹 CREATE LESSON
  const createLesson = async () => {
    const res = await api.post("/admin/lesson", {
      title: lessonTitle,
      module_id: Number(moduleId),
      video_url: videoUrl,
    });
  
    alert("Lesson created!");
    setLessonId(res.data.id); // 🔥 IMPORTANT
  };
  // 🔹 CREATE QUIZ
  const createQuiz = async () => {
    await api.post("/admin/quiz", {
      lesson_id: Number(lessonId), // ✅ FIXED
      question: quizQuestion,
      option1: options[0],
      option2: options[1],
      option3: options[2],
      option4: options[3],
      answer: answer,
    });
  
    alert("Quiz created!");
  };

  return (
    <div className="p-6 space-y-6">

      {/* COURSE */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Create Course</h2>
        <input placeholder="Title" onChange={(e)=>setCourseTitle(e.target.value)} className="border p-2 mr-2"/>
        <input placeholder="Slug" onChange={(e)=>setSlug(e.target.value)} className="border p-2 mr-2"/>
        <button onClick={createCourse} className="bg-purple-600 text-white px-4 py-2">Create</button>
      </div>

      {/* MODULE */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Create Module</h2>
        <input placeholder="Course ID" onChange={(e)=>setCourseId(e.target.value)} className="border p-2 mr-2"/>
        <input placeholder="Module Title" onChange={(e)=>setModuleTitle(e.target.value)} className="border p-2 mr-2"/>
        <button onClick={createModule} className="bg-purple-600 text-white px-4 py-2">Create</button>
      </div>

      {/* LESSON */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Create Lesson</h2>
        <input placeholder="Module ID" onChange={(e)=>setModuleId(e.target.value)} className="border p-2 mr-2"/>
        <input placeholder="Lesson Title" onChange={(e)=>setLessonTitle(e.target.value)} className="border p-2 mr-2"/>
        <input placeholder="Video URL" onChange={(e)=>setVideoUrl(e.target.value)} className="border p-2 mr-2"/>
        <button onClick={createLesson} className="bg-purple-600 text-white px-4 py-2">Create</button>
      </div>

      {/* QUIZ */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Create Quiz</h2>
        <input placeholder="Lesson ID" onChange={(e)=>setLessonId(e.target.value)} className="border p-2 mr-2"/> 
        <input placeholder="Question" onChange={(e)=>setQuizQuestion(e.target.value)} className="border p-2 mr-2"/>

        {options.map((opt, i) => (
          <input
            key={i}
            placeholder={`Option ${i+1}`}
            onChange={(e)=>{
              const newOpts = [...options];
              newOpts[i] = e.target.value;
              setOptions(newOpts);
            }}
            className="border p-2 mr-2 mt-2"
          />
        ))}

        <input placeholder="Correct Answer" onChange={(e)=>setAnswer(e.target.value)} className="border p-2 mr-2 mt-2"/>

        <button onClick={createQuiz} className="bg-purple-600 text-white px-4 py-2 mt-2">Create</button>
      </div>

    </div>
  );
}