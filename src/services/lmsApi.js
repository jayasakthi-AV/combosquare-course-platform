// src/services/lmsApi.js
// ─────────────────────────────────────────────────────────────────
//  All LMS API calls — courses, progress, quizzes, payments, certs
// ─────────────────────────────────────────────────────────────────

import api from './api';   // existing axios instance with auth interceptor

const BASE = '/lms';


// ── Courses ─────────────────────────────────────────────────────

export const getCourses = () =>
  api.get(`${BASE}/courses`).then(r => r.data);

export const getCourseBySlug = (slug) =>
  api.get(`${BASE}/courses/${slug}`).then(r => r.data);


// ── Video Progress ───────────────────────────────────────────────

export const saveVideoProgress = (courseId, lessonId, watchPercent, lastPosition) =>
  api.post(`${BASE}/courses/${courseId}/lessons/${lessonId}/progress`, {
    watch_percent : watchPercent,
    last_position : lastPosition,
  }).then(r => r.data);


// ── Quiz ────────────────────────────────────────────────────────

export const getQuiz = (quizId) =>
  api.get(`${BASE}/quizzes/${quizId}`).then(r => r.data);

export const submitQuiz = (quizId, answers) =>
  api.post(`${BASE}/quizzes/${quizId}/submit`, { answers }).then(r => r.data);


// ── Payment ─────────────────────────────────────────────────────
export const createPaymentOrder = async (courseId) => {
  const token = localStorage.getItem("token");  // ← ADD THIS
  const res = await fetch("http://localhost:8001/api/payment/create-order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,        // ← ADD THIS
    },
    body: JSON.stringify({ course_id: Number(courseId) }),
  });
  return await res.json();
};

export const verifyPayment = (payload) =>
  api.post(`/payment/verify`, payload).then(r => r.data);

export const getPaymentStatus = (enrollmentId) =>
  api.get(`${BASE}/payment/${enrollmentId}/status`).then(r => r.data);


// ── Dashboard ────────────────────────────────────────────────────

export const getLMSDashboard = () =>
  api.get(`/dashboard/me`).then(r => r.data);


// ── Certificate ──────────────────────────────────────────────────

export const generateCertificate = (enrollmentId) =>
  api.post(`${BASE}/certificate/${enrollmentId}`).then(r => r.data);


// ── Razorpay helper ──────────────────────────────────────────────

/**
 * Opens the Razorpay checkout popup.
 * Call after createPaymentOrder() succeeds.
 *
 * @param {object} order   - response from createPaymentOrder()
 * @param {object} user    - { full_name, email, mobile }
 * @param {function} onSuccess - called with razorpay response after payment
 * @param {function} onFailure - called on dismiss / failure
 */
export const openRazorpayCheckout = (order, user, onSuccess, onFailure) => {
  const options = {
    key           : order.key_id,
    amount        : order.amount,
    currency      : order.currency,
    name          : 'ComboSquare',
    description   : 'Course Enrollment',
    order_id      : order.order_id,
    prefill: {
      name  : user.full_name,
      email : user.email,
      contact: user.mobile || '',
    },
    theme: { color: '#7C3AED' },
    handler: async (response) => {
      try {
        const result = await verifyPayment({
          program_id          : order.program_id,
          razorpay_order_id   : response.razorpay_order_id,
          razorpay_payment_id : response.razorpay_payment_id,
          razorpay_signature  : response.razorpay_signature,
        });
        onSuccess(result);   // passes {status, slug} to PaymentPage
      } catch (err) {
        onFailure(err);
      }
    },
    modal: {
      ondismiss: () => onFailure(new Error('Payment cancelled by user.')),
    },
  };

  // Razorpay checkout script must be loaded (add to index.html):
  // <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  const rzp = new window.Razorpay(options);
  rzp.on('payment.failed', (resp) => onFailure(resp.error));
  rzp.open();
};


