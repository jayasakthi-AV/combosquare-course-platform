// src/pages/CoursePlayer.jsx
// ─────────────────────────────────────────────────────────────────
//  Full LMS course player:
//  Left sidebar: module/lesson tree with lock icons
//  Main area: VideoPlayer → Quiz popup → Next lesson
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock, CheckCircle, PlayCircle, ChevronDown, ChevronRight,
  BookOpen, Trophy, ArrowLeft, ArrowRight, FileText,
} from 'lucide-react';
import VideoPlayer     from '../components/lms/VideoPlayer';
import QuizModal       from '../components/lms/QuizModal';
import { getCourseBySlug, getQuiz, generateCertificate } from '../services/lmsApi';

export default function CoursePlayer() {
  const { slug }       = useParams();
  const navigate       = useNavigate();

  const [course,        setCourse]        = useState(null);
  const [activeLesson,  setActiveLesson]  = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [expandedMods,  setExpandedMods]  = useState({});
  const [quizData,      setQuizData]      = useState(null);   // open quiz
  const [showQuiz,      setShowQuiz]      = useState(false);
  const [certUrl,       setCertUrl]       = useState(null);
  const [certLoading,   setCertLoading]   = useState(false);
  const [progressMap,   setProgressMap]   = useState({});     // lessonId → watch%

  // ── Load course ───────────────────────────────────────────────
  const loadCourse = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCourseBySlug(slug);
      setCourse(data);
      setCertUrl(data.certificate_url);

      // Auto-expand first module
      if (data.modules?.length > 0) {
        setExpandedMods({ [data.modules[0].id]: true });
      }

      // Resume last lesson or start first unlocked
      const allLessons = data.modules?.flatMap(m => m.lessons) || [];
      const lastLesson = allLessons.find(l => l.last_position > 0) || allLessons.find(l => l.is_unlocked);
      if (lastLesson) setActiveLesson(lastLesson);

    } catch {
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  }, [slug, navigate]);

  useEffect(() => { loadCourse(); }, [loadCourse]);


  // ── Show quiz after video completes ──────────────────────────
  const handleLessonComplete = useCallback(async () => {
    if (!activeLesson?.has_quiz) {
      await loadCourse();   // refresh to update lock states
      return;
    }
    // Load quiz data
    try {
      const quiz = await getQuiz(activeLesson.quiz_id || activeLesson.id);
      setQuizData(quiz);
      setShowQuiz(true);
    } catch { /* no quiz or already passed */ }
  }, [activeLesson, loadCourse]);


  const handleQuizPass = async () => {
    setShowQuiz(false);
    setQuizData(null);
    await loadCourse();  // refresh unlock states
    // Auto-advance to next lesson
    goToNextLesson();
  };


  const goToNextLesson = () => {
    if (!course) return;
    const all = course.modules.flatMap(m => m.lessons);
    const idx = all.findIndex(l => l.id === activeLesson?.id);
    if (idx !== -1 && idx < all.length - 1) {
      const next = all[idx + 1];
      if (next.is_unlocked) setActiveLesson(next);
    }
  };


  const handleProgressUpdate = (pct, pos) => {
    setProgressMap(prev => ({ ...prev, [activeLesson?.id]: pct }));
  };


  const handleGetCertificate = async () => {
    setCertLoading(true);
    try {
      const res = await generateCertificate(course.enrollment_id);
      setCertUrl(res.certificate_url);
      window.open(`http://localhost:8001${res.certificate_url}`, '_blank');
    } catch (err) {
      alert(err.response?.data?.detail || 'Certificate generation failed.');
    } finally {
      setCertLoading(false);
    }
  };


  // ── Sidebar item ──────────────────────────────────────────────
  const LessonItem = ({ lesson }) => {
    const isActive    = activeLesson?.id === lesson.id;
    const localPct    = progressMap[lesson.id] ?? lesson.watch_percent ?? 0;

    return (
      <button
        onClick={() => lesson.is_unlocked && setActiveLesson(lesson)}
        disabled={!lesson.is_unlocked}
        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-all rounded-xl
          ${isActive
            ? 'bg-purple-700 text-white'
            : lesson.is_unlocked
              ? 'hover:bg-purple-50 text-gray-700'
              : 'text-gray-400 cursor-not-allowed opacity-60'
          }`}
      >
        {/* State icon */}
        <span className="mt-0.5 shrink-0">
          {lesson.is_completed
            ? <CheckCircle size={16} className={isActive ? 'text-green-300' : 'text-green-500'} />
            : !lesson.is_unlocked
              ? <Lock size={15} />
              : <PlayCircle size={16} className={isActive ? 'text-purple-200' : 'text-purple-500'} />
          }
        </span>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
            {lesson.title}
          </p>
          {/* Mini progress bar */}
          {lesson.is_unlocked && !lesson.is_completed && localPct > 0 && (
            <div className="mt-1 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${isActive ? 'bg-purple-200' : 'bg-purple-400'}`}
                style={{ width: `${localPct}%` }}
              />
            </div>
          )}
          {lesson.has_quiz && (
            <span className={`text-[10px] mt-0.5 block ${isActive ? 'text-purple-200' : 'text-purple-500'}`}>
              Includes quiz
            </span>
          )}
        </div>
      </button>
    );
  };


  // ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course?.is_enrolled) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white text-center p-6">
        <div>
          <Lock size={48} className="text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-400 mb-6">Purchase this course to access the content.</p>
          <Link to={`/program/${slug}`}
            className="px-8 py-3 bg-purple-700 hover:bg-purple-600 text-white font-semibold rounded-xl transition-all"
          >
            Enroll Now
          </Link>
        </div>
      </div>
    );
  }

  const allLessons  = course.modules?.flatMap(m => m.lessons) || [];
  const activeIdx   = allLessons.findIndex(l => l.id === activeLesson?.id);
  const prevLesson  = activeIdx > 0 ? allLessons[activeIdx - 1] : null;
  const nextLesson  = activeIdx < allLessons.length - 1 ? allLessons[activeIdx + 1] : null;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">

      {/* ── SIDEBAR ── */}
      <div className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto">

        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <Link to="/dashboard" className="flex items-center gap-2 text-purple-700 text-sm font-semibold mb-3 hover:text-purple-900 transition-colors">
            <ArrowLeft size={15} /> Back to Dashboard
          </Link>
          <h2 className="font-bold text-gray-900 text-sm leading-snug">{course.title}</h2>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${course.overall_progress}%` }}
              />
            </div>
            <span className="text-xs text-purple-700 font-bold shrink-0">
              {course.overall_progress}%
            </span>
          </div>
        </div>

        {/* Modules tree */}
        <div className="flex-1 overflow-y-auto py-3">
          {course.modules?.map((mod) => (
            <div key={mod.id} className="mb-1">
              <button
                onClick={() => setExpandedMods(prev => ({ ...prev, [mod.id]: !prev[mod.id] }))}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 text-sm">{mod.title}</span>
                {expandedMods[mod.id]
                  ? <ChevronDown size={14} className="text-gray-400" />
                  : <ChevronRight size={14} className="text-gray-400" />
                }
              </button>

              <AnimatePresence>
                {expandedMods[mod.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden px-2"
                  >
                    {mod.lessons.map(l => <LessonItem key={l.id} lesson={l} />)}
                    {mod.has_quiz && (
                      <div className={`flex items-center gap-2 px-4 py-2 text-xs font-medium ${
                        mod.module_quiz_passed ? 'text-green-600' : 'text-purple-600'
                      }`}>
                        <BookOpen size={13} />
                        Module Quiz {mod.module_quiz_passed ? '✓ Passed' : '(Complete all lessons)'}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Certificate */}
        {course.overall_progress >= 100 && (
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleGetCertificate}
              disabled={certLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-700 to-purple-900 text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-purple-200 disabled:opacity-60"
            >
              <Trophy size={16} />
              {certLoading ? 'Generating...' : certUrl ? 'Download Certificate' : 'Get Certificate'}
            </button>
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 overflow-y-auto">
        {activeLesson ? (
          <div className="max-w-4xl mx-auto p-6">

            {/* Lesson title */}
            <div className="mb-4">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">
                {course.modules?.find(m => m.lessons.some(l => l.id === activeLesson.id))?.title}
              </p>
              <h1 className="text-white text-xl md:text-2xl font-bold">{activeLesson.title}</h1>
            </div>

            {/* Video */}
            {activeLesson.video_url && (
              <VideoPlayer
                courseId         = {course.id}
                lesson           = {activeLesson}
                initialPosition  = {activeLesson.last_position || 0}
                onComplete       = {handleLessonComplete}
                onProgressUpdate = {handleProgressUpdate}
              />
            )}

            {/* Text lesson */}
            {activeLesson.lesson_type === 'text' && activeLesson.text_content && (
              <div className="bg-white rounded-2xl p-8 prose max-w-none mt-4">
                <div dangerouslySetInnerHTML={{ __html: activeLesson.text_content }} />
              </div>
            )}

            {/* PDF */}
            {activeLesson.pdf_url && (
              <div className="mt-4 bg-gray-900 rounded-xl p-4 flex items-center gap-3">
                <FileText size={20} className="text-purple-400" />
                <a
                  href={activeLesson.pdf_url} target="_blank" rel="noreferrer"
                  className="text-purple-400 hover:text-purple-300 font-medium text-sm underline underline-offset-2"
                >
                  Open PDF Resource
                </a>
              </div>
            )}

            {/* Lesson description */}
            {activeLesson.description && (
              <div className="mt-5 bg-gray-900 rounded-xl p-5">
                <p className="text-gray-300 text-sm leading-relaxed">{activeLesson.description}</p>
              </div>
            )}

            {/* Prev / Next navigation */}
            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => prevLesson && setActiveLesson(prevLesson)}
                disabled={!prevLesson}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 transition-all disabled:opacity-30"
              >
                <ArrowLeft size={15} /> Previous
              </button>

              {nextLesson && (
                <button
                  onClick={() => nextLesson.is_unlocked && setActiveLesson(nextLesson)}
                  disabled={!nextLesson.is_unlocked}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-sm font-semibold transition-all disabled:opacity-40"
                >
                  Next <ArrowRight size={15} />
                  {!nextLesson.is_unlocked && <Lock size={13} className="ml-1" />}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <PlayCircle size={48} className="mx-auto mb-4 text-purple-600" />
              <p className="text-white font-semibold">Select a lesson to start learning</p>
            </div>
          </div>
        )}
      </div>

      {/* ── QUIZ MODAL ── */}
      <AnimatePresence>
        {showQuiz && quizData && (
          <QuizModal
            quiz    = {quizData}
            onPass  = {handleQuizPass}
            onClose = {() => setShowQuiz(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
