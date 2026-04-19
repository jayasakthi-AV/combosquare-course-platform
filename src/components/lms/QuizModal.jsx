// src/components/lms/QuizModal.jsx
// ─────────────────────────────────────────────────────────────────
//  Full quiz popup:
//  • Shows questions one at a time
//  • Submits to backend, shows per-question feedback
//  • Pass → "Next Lesson" enabled; Fail → "Retry" button
// ─────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitQuiz } from '../../services/lmsApi';
import { CheckCircle, XCircle, RotateCcw, ArrowRight, Trophy, X } from 'lucide-react';

export default function QuizModal({ quiz, onPass, onClose }) {
  const [step,    setStep]    = useState('quiz');   // 'quiz' | 'result'
  const [answers, setAnswers] = useState({});        // {question_id: chosen_index}
  const [result,  setResult]  = useState(null);
  const [current, setCurrent] = useState(0);        // current question index
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const questions = quiz.questions || [];
  const q         = questions[current];
  const answered  = answers[q?.id] !== undefined;
  const isLast    = current === questions.length - 1;

  const choose = (idx) => {
    if (answers[q.id] !== undefined) return;  // don't allow re-answering
    setAnswers(prev => ({ ...prev, [q.id]: idx }));
  };

  const next = () => {
    if (current < questions.length - 1) setCurrent(c => c + 1);
  };

  const submit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await submitQuiz(quiz.id, answers);
      setResult(res);
      setStep('result');
      if (res.is_passed) onPass?.(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Submission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const retry = () => {
    setAnswers({});
    setCurrent(0);
    setResult(null);
    setStep('quiz');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.22,1,0.36,1] }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-900 px-6 py-5 flex items-center justify-between">
          <div>
            <p className="text-purple-200 text-xs font-semibold uppercase tracking-widest mb-1">Quiz</p>
            <h2 className="text-white font-bold text-lg">{quiz.title}</h2>
          </div>
          <button onClick={onClose} className="text-purple-300 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        {/* Progress dots */}
        {step === 'quiz' && (
          <div className="px-6 pt-4 flex items-center gap-1.5">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1.5 rounded-full transition-all ${
                  i < current
                    ? 'bg-green-400'
                    : i === current
                      ? 'bg-purple-600'
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        )}

        <div className="p-6">
          <AnimatePresence mode="wait">

            {/* ── QUIZ STEP ── */}
            {step === 'quiz' && q && (
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-gray-400 text-sm mb-2">
                  Question {current + 1} of {questions.length}
                </p>
                <h3 className="text-gray-900 font-semibold text-base md:text-lg mb-5 leading-snug">
                  {q.question_text}
                </h3>

                <div className="space-y-2.5 mb-6">
                  {q.options.map((opt, idx) => {
                    const chosen = answers[q.id] === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => choose(idx)}
                        disabled={answers[q.id] !== undefined}
                        className={`w-full text-left px-5 py-3.5 rounded-xl border-2 font-medium text-sm transition-all ${
                          chosen
                            ? 'border-purple-600 bg-purple-50 text-purple-900'
                            : 'border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50/50 disabled:cursor-default'
                        }`}
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 mr-3 text-xs font-bold shrink-0
                          border-current"
                        >
                          {String.fromCharCode(65 + idx)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Passing score: {quiz.passing_score}%
                  </span>
                  {!isLast ? (
                    <button
                      onClick={next}
                      disabled={!answered}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      Next <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      onClick={submit}
                      disabled={!answered || loading}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm disabled:opacity-40 transition-all"
                    >
                      {loading ? 'Submitting...' : 'Submit Quiz'}
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── RESULT STEP ── */}
            {step === 'result' && result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                {/* Score ring */}
                <div className="flex flex-col items-center mb-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-3 ${
                    result.is_passed ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {result.is_passed
                      ? <Trophy size={40} className="text-green-600" />
                      : <XCircle size={40} className="text-red-500" />
                    }
                  </div>
                  <p className={`text-3xl font-black mb-1 ${result.is_passed ? 'text-green-600' : 'text-red-500'}`}>
                    {result.score}%
                  </p>
                  <p className="text-gray-600 font-semibold">
                    {result.is_passed ? '🎉 Passed!' : 'Not passed — try again'}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    {result.correct_count}/{result.total_questions} correct · Passing: {result.passing_score}%
                  </p>
                </div>

                {/* Per-question breakdown */}
                <div className="space-y-2 max-h-52 overflow-y-auto mb-5 pr-1">
                  {result.results.map((r, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${
                      r.is_correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      {r.is_correct
                        ? <CheckCircle size={16} className="text-green-600 mt-0.5 shrink-0" />
                        : <XCircle    size={16} className="text-red-500 mt-0.5 shrink-0" />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 line-clamp-2">{r.question_text}</p>
                        {!r.is_correct && r.explanation && (
                          <p className="text-xs text-gray-500 mt-0.5 italic">{r.explanation}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  {!result.is_passed && (
                    <button onClick={retry}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-purple-200 text-purple-700 font-semibold text-sm hover:bg-purple-50 transition-all"
                    >
                      <RotateCcw size={15} /> Retry Quiz
                    </button>
                  )}
                  {result.is_passed && (
                    <button onClick={onClose}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm transition-all"
                    >
                      Continue <ArrowRight size={15} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
