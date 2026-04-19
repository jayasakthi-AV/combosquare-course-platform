// src/pages/StudentDashboard.jsx — LMS-aware version
// ─────────────────────────────────────────────────────────────────
//  Replace old dashboard with full LMS course cards:
//  • Locked / In Progress / Completed states
//  • Resume button  → /learn/:slug
//  • Certificate download
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, CheckCircle, Clock, Award, Play, Lock,
  Trophy, LayoutDashboard, User, Search, LogOut,
  BarChart2, ArrowRight,
} from 'lucide-react';
import { getLMSDashboard } from '../services/lmsApi';
import { logout, getUser } from '../services/api';

const TABS = [
  { id: 'overview', label: 'Overview',        icon: LayoutDashboard },
  { id: 'courses',  label: 'My Courses',       icon: BookOpen        },
  { id: 'profile',  label: 'My Profile',       icon: User            },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const user     = getUser();

  const [tab,      setTab]      = useState('overview');
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');

  useEffect(() => {
    getLMSDashboard()
      .then(setData)
      .catch(() => setError('Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p className="text-red-500">{error}</p>
    </div>
  );

  const profile  = data?.profile  || {};
  const stats    = data?.stats    || {};
  const courses  = data?.enrolled_courses || [];

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── SIDEBAR ── */}
      <aside className="w-64 bg-white shadow-sm fixed h-full z-10 flex flex-col border-r border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">Student Portal</p>
        </div>

        <div className="p-4">
          {/* Avatar */}
          <div className="bg-purple-50 rounded-2xl p-4 mb-5 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center text-white font-black text-lg mx-auto mb-2">
              {profile.full_name?.charAt(0).toUpperCase()}
            </div>
            <p className="font-bold text-gray-900 text-sm">{profile.full_name}</p>
            <p className="text-gray-400 text-xs truncate">{profile.email}</p>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  tab === id
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-200'
                    : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <Icon size={16} /> {label}
              </button>
            ))}

            {/* Browse — goes to /programs */}
            <button onClick={() => navigate('/programs')}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-purple-700 transition-all text-left"
            >
              <Search size={16} /> Browse Programs
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-gray-100">
          <button onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="ml-64 flex-1 p-8">

        {/* ── OVERVIEW TAB ── */}
        {tab === 'overview' && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-1">
              Welcome back, {profile.full_name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-500 mb-8 text-sm">Here's your learning progress at a glance.</p>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { label: 'Total Enrolled',  value: stats.total_enrolled,    icon: BookOpen,   color: 'bg-purple-100 text-purple-700' },
                { label: 'Completed',       value: stats.completed,         icon: CheckCircle,color: 'bg-green-100 text-green-700'   },
                { label: 'In Progress',     value: stats.in_progress,       icon: Clock,      color: 'bg-blue-100 text-blue-700'     },
                { label: 'Avg Progress',    value: `${stats.average_progress}%`, icon: BarChart2, color: 'bg-orange-100 text-orange-700' },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                    <s.icon size={18} />
                  </div>
                  <p className="text-2xl font-black text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Continue Learning */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Continue Learning</h2>
            {courses.length === 0 ? (
              <EmptyState onBrowse={() => navigate('/programs')} />
            ) : (
              <div className="grid md:grid-cols-2 gap-5">
                {courses.slice(0, 4).map((c) => (
                  <CourseCard key={c.enrollment_id} course={c} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── MY COURSES TAB ── */}
        {tab === 'courses' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black text-gray-900">My Courses</h1>
              <button onClick={() => navigate('/programs')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-sm font-semibold transition-all shadow-md shadow-purple-200"
              >
                Browse More <ArrowRight size={14} />
              </button>
            </div>

            {courses.length === 0
              ? <EmptyState onBrowse={() => navigate('/programs')} />
              : (
                <div className="grid md:grid-cols-2 gap-5">
                  {courses.map((c) => <CourseCard key={c.enrollment_id} course={c} />)}
                </div>
              )
            }
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === 'profile' && (
          <div>
            <h1 className="text-2xl font-black text-gray-900 mb-6">My Profile</h1>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-900 rounded-full flex items-center justify-center text-white font-black text-3xl mx-auto mb-5">
                {profile.full_name?.charAt(0).toUpperCase()}
              </div>
              {[
                { label: 'Full Name',    value: profile.full_name  },
                { label: 'Email',        value: profile.email      },
                { label: 'Mobile',       value: profile.mobile || 'Not provided' },
                { label: 'Role',         value: profile.role       },
                { label: 'Member Since', value: profile.member_since
                    ? new Date(profile.member_since).toLocaleDateString('en-IN', { year:'numeric',month:'long',day:'numeric' })
                    : '—'
                },
              ].map(({ label, value }) => (
                <div key={label} className="mb-4">
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-gray-900 font-semibold text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}


// ── Course Card ──────────────────────────────────────────────────

function CourseCard({ course }) {
  const navigate = useNavigate();
  const isComplete  = course.status === 'completed';
  const hasStarted  = course.overall_progress > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden"
    >
      {/* Thumbnail */}
      {course.thumbnail && (
        <div className="relative h-36 bg-purple-100 overflow-hidden">
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          {isComplete && (
            <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle size={11} /> Completed
            </span>
          )}
        </div>
      )}

      <div className="p-5">
        <h3 className="font-bold text-gray-900 mb-1 text-sm">{course.title}</h3>
        <p className="text-gray-400 text-xs mb-3">
          {course.completed_lessons}/{course.total_lessons} lessons completed
        </p>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-gray-400">Progress</span>
            <span className="text-purple-700 font-bold">{course.overall_progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-green-500' : 'bg-purple-600'}`}
              style={{ width: `${course.overall_progress}%` }}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {isComplete ? (
            <>
              <button
                onClick={() => navigate(`/learn/${course.slug}`)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition-all"
              >
                <Play size={12} /> Review
              </button>
              {course.certificate_url ? (
                <a
                  href={`http://localhost:8001${course.certificate_url}`}
                  target="_blank" rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-all"
                >
                  <Trophy size={12} /> Certificate
                </a>
              ) : (
                <button
                  onClick={() => navigate(`/learn/${course.slug}`)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-semibold transition-all"
                >
                  <Award size={12} /> Get Cert
                </button>
              )}
            </>
          ) : (
            <button
              onClick={() => navigate(`/learn/${course.slug}`)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition-all shadow-md shadow-purple-100"
            >
              {hasStarted
                ? <><Play size={13} fill="white" /> Resume Learning</>
                : <><Play size={13} fill="white" /> Start Learning</>
              }
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}


function EmptyState({ onBrowse }) {
  return (
    <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
      <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <BookOpen size={28} className="text-purple-600" />
      </div>
      <h3 className="text-gray-900 font-bold text-lg mb-2">No courses yet</h3>
      <p className="text-gray-500 text-sm mb-6">Enroll in a program to start your learning journey.</p>
      <button onClick={onBrowse}
        className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm transition-all shadow-md shadow-purple-200"
      >
        Browse Programs <ArrowRight size={15} />
      </button>
    </div>
  );
}
