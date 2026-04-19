// src/pages/PaymentPage.jsx
// ─────────────────────────────────────────────────────────────────
//  Shown when user clicks "Enroll Now" on a paid course.
//  1. Shows order summary
//  2. Calls createPaymentOrder → opens Razorpay checkout
//  3. On success → verifyPayment → redirect to player
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, CreditCard, ArrowRight, Lock, Loader } from 'lucide-react';
import { getCourseBySlug, createPaymentOrder, openRazorpayCheckout } from '../services/lmsApi';
import { getUser } from '../services/api';

export default function PaymentPage() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const user       = getUser();

  const [course,  setCourse]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying,  setPaying]  = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    getCourseBySlug(slug)
      .then(data => {
        // If already enrolled, skip to player
        if (data.is_enrolled) {
          navigate(`/learn/${slug}`);
          return;
        }
        setCourse(data);
      })
      .catch((err) => {
        console.log("ERROR:", err);
      })
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  const handlePay = async () => {
    if (!course) return;
    setPaying(true);
    setError('');
    try {
      const order = await createPaymentOrder(course.id);
      openRazorpayCheckout(
        order,
        user,
        () => {
          // Payment verified → go to player
          navigate(`/learn/${slug}`, { state: { justEnrolled: true } });
        },
        (err) => {
          setError(err?.message || 'Payment failed. Please try again.');
          setPaying(false);
        },
      );
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create payment order. Try again.');
      setPaying(false);
    }
  };

  const fmt = (paise) => `₹${(paise / 100).toLocaleString('en-IN')}`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <Loader className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-6 pt-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-purple-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-700 to-purple-900 px-8 py-7">
            <p className="text-purple-200 text-xs font-bold tracking-widest uppercase mb-1">Secure Checkout</p>
            <h1 className="text-white text-2xl font-black leading-tight">{course?.title}</h1>
            <p className="text-purple-200 text-sm mt-1">{course?.subtitle}</p>
          </div>

          <div className="p-8">
            {/* Course info pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[course?.level, course?.duration_hrs && `${course.duration_hrs}h content`, course?.language].filter(Boolean).map((tag) => (
                <span key={tag} className="bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            {/* Included features */}
            <div className="space-y-2.5 mb-7">
              {[
                'Lifetime access to all lessons',
                'Certificate of completion',
                'Quiz & progress tracking',
                'Expert mentor support',
                '100% placement assistance',
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <CheckCircle size={15} className="text-green-500 shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="flex items-center justify-between bg-purple-50 rounded-2xl px-5 py-4 mb-6">
              <div>
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Total Amount</p>
                <p className="text-3xl font-black text-purple-700 mt-0.5">
                  {course?.price === 0 ? 'Free' : fmt(course?.price || 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs line-through">₹19,999</p>
                <p className="text-green-600 text-xs font-bold">75% OFF</p>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-white text-base transition-all disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 60%, #A78BFA 100%)',
                boxShadow: '0 6px 24px rgba(124,58,237,0.4)',
              }}
            >
              {paying ? (
                <><Loader size={18} className="animate-spin" /> Processing...</>
              ) : (
                <><CreditCard size={18} /> {course?.price === 0 ? 'Enroll Free' : `Pay ${fmt(course?.price || 0)}`} <ArrowRight size={16} /></>
              )}
            </button>

            {/* Trust badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-400 text-xs">
              <Shield size={13} />
              Secured by Razorpay · 256-bit SSL encryption
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-4">
          By enrolling you agree to our <a href="#" className="text-purple-600 hover:underline">Terms of Service</a>
        </p>
      </motion.div>
    </div>
  );
}
