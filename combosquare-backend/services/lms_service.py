# services/lms_service.py
# ─────────────────────────────────────────────────────────────────
#  Business logic separated from routes.
#  Handles: enrollment checks, unlock logic, progress calculation,
#           quiz grading, certificate generation.
# ─────────────────────────────────────────────────────────────────

from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, Dict, Any, List
from datetime import datetime
from fastapi import HTTPException, status
import hmac, hashlib

from models.lms import (
    Course, Module, Lesson, Quiz, QuizQuestion, QuizAttempt,
    CourseEnrollment, LessonProgress, Payment,
    PaymentStatus, EnrollmentStatus
)
from config import settings


# ── Enrollment / Access ─────────────────────────────────────────

def get_active_enrollment(db: Session, user_id: int, course_id: int) -> Optional[CourseEnrollment]:
    return (
        db.query(CourseEnrollment)
        .filter(
            CourseEnrollment.user_id  == user_id,
            CourseEnrollment.course_id == course_id,
            CourseEnrollment.status   != EnrollmentStatus.dropped,
        )
        .first()
    )


def require_enrollment(db: Session, user_id: int, course_id: int) -> CourseEnrollment:
    enrollment = get_active_enrollment(db, user_id, course_id)
    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must be enrolled in this course to access content."
        )
    # Verify payment is complete
    if enrollment.payment and enrollment.payment.status != PaymentStatus.paid:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="Payment is required to access course content."
        )
    return enrollment


# ── Unlock Logic ────────────────────────────────────────────────

def is_lesson_unlocked(
    db          : Session,
    enrollment  : CourseEnrollment,
    lesson      : Lesson,
    all_lessons : List[Lesson],   # ordered list for the module
) -> bool:
    """
    A lesson is unlocked if:
    1. It is the first lesson of the first module, OR
    2. All previous lessons in the course are completed.
    Free preview lessons are always unlocked.
    """
    if lesson.is_free:
        return True

    # Find global lesson order across whole course
    lesson_ids = [l.id for l in all_lessons]
    try:
        idx = lesson_ids.index(lesson.id)
    except ValueError:
        return False

    if idx == 0:
        return True

    # All lessons before this one must be completed
    prev_lesson = all_lessons[idx - 1]
    prev_progress = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.enrollment_id == enrollment.id,
            LessonProgress.lesson_id     == prev_lesson.id,
        )
        .first()
    )
    return bool(prev_progress and prev_progress.is_completed)


def get_or_create_lesson_progress(
    db: Session, enrollment_id: int, lesson_id: int
) -> LessonProgress:
    lp = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.enrollment_id == enrollment_id,
            LessonProgress.lesson_id     == lesson_id,
        )
        .first()
    )
    if not lp:
        lp = LessonProgress(
            enrollment_id=enrollment_id,
            lesson_id=lesson_id,
        )
        db.add(lp)
        db.commit()
        db.refresh(lp)
    return lp


# ── Video Progress ───────────────────────────────────────────────

def update_video_progress(
    db           : Session,
    enrollment   : CourseEnrollment,
    lesson       : Lesson,
    watch_percent: float,
    last_position: int,
) -> LessonProgress:
    lp = get_or_create_lesson_progress(db, enrollment.id, lesson.id)

    # Only advance forward — never allow rewinding progress
    lp.watch_percent = max(lp.watch_percent, min(watch_percent, 100.0))
    lp.last_position = max(lp.last_position, last_position)

    # Mark complete when watched >= 95% (buffer for buffering issues)
    if lp.watch_percent >= 95.0 and not lesson.quiz:
        # No quiz — complete on video finish
        if not lp.is_completed:
            lp.is_completed  = True
            lp.completed_at  = datetime.utcnow()

    db.commit()
    db.refresh(lp)

    # Recalculate overall course progress
    _recalculate_progress(db, enrollment)
    return lp


# ── Quiz Grading ────────────────────────────────────────────────

def grade_quiz(
    db         : Session,
    enrollment : CourseEnrollment,
    quiz       : Quiz,
    answers    : Dict[int, int],   # {question_id: chosen_index}
) -> Dict[str, Any]:
    questions = quiz.questions
    if not questions:
        raise HTTPException(400, "This quiz has no questions.")

    correct = 0
    per_question = []

    for q in questions:
        chosen = answers.get(q.id)
        is_correct = (chosen == q.correct_index)
        if is_correct:
            correct += 1
        per_question.append({
            "question_id"   : q.id,
            "question_text" : q.question_text,
            "chosen_index"  : chosen,
            "correct_index" : q.correct_index,
            "is_correct"    : is_correct,
            "explanation"   : q.explanation,
        })

    score     = round((correct / len(questions)) * 100, 1)
    passing   = quiz.passing_score
    is_passed = score >= passing

    # Count previous attempts
    prev = (
        db.query(QuizAttempt)
        .filter(
            QuizAttempt.enrollment_id == enrollment.id,
            QuizAttempt.quiz_id       == quiz.id,
        )
        .count()
    )

    attempt = QuizAttempt(
        enrollment_id  = enrollment.id,
        quiz_id        = quiz.id,
        user_id        = enrollment.user_id,
        answers        = answers,
        score          = score,
        is_passed      = is_passed,
        attempt_number = prev + 1,
    )
    db.add(attempt)

    # If passed and quiz belongs to a lesson — mark lesson complete
    if is_passed and quiz.lesson_id:
        lp = get_or_create_lesson_progress(db, enrollment.id, quiz.lesson_id)
        if lp.watch_percent >= 95.0 and not lp.is_completed:
            lp.is_completed = True
            lp.completed_at = datetime.utcnow()

    db.commit()
    _recalculate_progress(db, enrollment)

    return {
        "quiz_id"        : quiz.id,
        "score"          : score,
        "is_passed"      : is_passed,
        "passing_score"  : passing,
        "attempt_number" : prev + 1,
        "correct_count"  : correct,
        "total_questions": len(questions),
        "results"        : per_question,
    }


def quiz_is_passed(db: Session, enrollment_id: int, quiz_id: int) -> bool:
    return bool(
        db.query(QuizAttempt)
        .filter(
            QuizAttempt.enrollment_id == enrollment_id,
            QuizAttempt.quiz_id       == quiz_id,
            QuizAttempt.is_passed     == True,
        )
        .first()
    )


# ── Progress Calculation ─────────────────────────────────────────

def _recalculate_progress(db: Session, enrollment: CourseEnrollment):
    """
    Recompute overall_progress as:
        completed_lessons / total_lessons * 100
    Then check if course is fully done → set status = completed.
    """
    course = enrollment.course

    # Collect all lesson ids for the course
    all_lesson_ids = []
    for module in course.modules:
        for lesson in module.lessons:
            all_lesson_ids.append(lesson.id)

    if not all_lesson_ids:
        return

    completed_count = (
        db.query(LessonProgress)
        .filter(
            LessonProgress.enrollment_id.in_([enrollment.id]),
            LessonProgress.lesson_id.in_(all_lesson_ids),
            LessonProgress.is_completed == True,
        )
        .count()
    )

    enrollment.overall_progress = round(
        (completed_count / len(all_lesson_ids)) * 100, 1
    )

    if enrollment.overall_progress >= 100.0:
        enrollment.status       = EnrollmentStatus.completed
        enrollment.completed_at = enrollment.completed_at or datetime.utcnow()

    db.commit()


# ── Payment / Razorpay ──────────────────────────────────────────

def create_razorpay_order(db: Session, user_id: int, course_id: int):
    """
    Creates a pending CourseEnrollment + Payment row,
    then calls Razorpay API to get an order_id.
    Returns (enrollment, razorpay_order).
    """
    import razorpay  # pip install razorpay

    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(404, "Course not found.")

    existing = get_active_enrollment(db, user_id, course_id)
    if existing and existing.payment and existing.payment.status == PaymentStatus.paid:
        raise HTTPException(400, "Already enrolled in this course.")

    # Create enrollment in pending state
    enrollment = CourseEnrollment(user_id=user_id, course_id=course_id)
    db.add(enrollment)
    db.flush()

    # Create pending payment row
    payment = Payment(
        enrollment_id=enrollment.id,
        user_id=user_id,
        amount=course.price,
        status=PaymentStatus.pending,
        gateway="razorpay",
    )
    db.add(payment)
    db.flush()

    # Call Razorpay
    client = razorpay.Client(
        auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
    )
    rp_order = client.order.create({
        "amount"  : course.price,
        "currency": "INR",
        "payment_capture": 1,
        "notes"   : {"enrollment_id": str(enrollment.id)},
    })

    payment.gateway_order_id = rp_order["id"]
    db.commit()

    return enrollment, rp_order


def verify_razorpay_payment(
    db              : Session,
    enrollment_id   : int,
    rp_order_id     : str,
    rp_payment_id   : str,
    rp_signature    : str,
) -> bool:
    """
    Verifies Razorpay HMAC signature.
    On success: marks payment as paid, enrollment as active.
    """
    # HMAC-SHA256 of "order_id|payment_id" using secret key
    msg       = f"{rp_order_id}|{rp_payment_id}".encode()
    expected  = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode(), msg, hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected, rp_signature):
        raise HTTPException(400, "Payment signature verification failed.")

    enrollment = db.query(CourseEnrollment).get(enrollment_id)
    if not enrollment:
        raise HTTPException(404, "Enrollment not found.")

    payment = enrollment.payment
    payment.status             = PaymentStatus.paid
    payment.gateway_payment_id = rp_payment_id
    payment.gateway_signature  = rp_signature
    payment.paid_at            = datetime.utcnow()

    db.commit()
    return True


# ── Certificate ─────────────────────────────────────────────────

def generate_certificate(db: Session, enrollment: CourseEnrollment) -> str:
    """
    Generates a PDF certificate using reportlab and returns a URL.
    Stores certificate_url in enrollment row.
    In production: upload to S3 / Cloudinary and store the CDN URL.
    """
    if enrollment.overall_progress < 100.0:
        raise HTTPException(400, "Course not yet completed.")

    from reportlab.pdfgen import canvas
    from reportlab.lib.pagesizes import A4, landscape
    from reportlab.lib import colors
    from io import BytesIO
    import os, uuid

    student   = enrollment.user.full_name
    course    = enrollment.course.title
    comp_date = (enrollment.completed_at or datetime.utcnow()).strftime("%d %B %Y")
    cert_id   = str(uuid.uuid4())[:8].upper()

    buffer = BytesIO()
    w, h   = landscape(A4)
    c      = canvas.Canvas(buffer, pagesize=landscape(A4))

    # Background
    c.setFillColor(colors.HexColor("#1a0533"))
    c.rect(0, 0, w, h, fill=True, stroke=False)

    # Purple border
    c.setStrokeColor(colors.HexColor("#7C3AED"))
    c.setLineWidth(6)
    c.rect(20, 20, w-40, h-40, fill=False, stroke=True)

    # Title
    c.setFillColor(colors.HexColor("#A78BFA"))
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(w/2, h-70, "COMBOSQUARE LEARNING PLATFORM")

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(w/2, h-130, "Certificate of Completion")

    # Body
    c.setFont("Helvetica", 16)
    c.setFillColor(colors.HexColor("#D8B4FE"))
    c.drawCentredString(w/2, h-185, "This is to certify that")

    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 28)
    c.drawCentredString(w/2, h-225, student)

    c.setFont("Helvetica", 16)
    c.setFillColor(colors.HexColor("#D8B4FE"))
    c.drawCentredString(w/2, h-265, "has successfully completed the course")

    c.setFillColor(colors.HexColor("#A78BFA"))
    c.setFont("Helvetica-Bold", 22)
    c.drawCentredString(w/2, h-305, course)

    c.setFont("Helvetica", 14)
    c.setFillColor(colors.HexColor("#D8B4FE"))
    c.drawCentredString(w/2, h-350, f"Completed on  {comp_date}    |    Certificate ID: {cert_id}")

    c.save()

    # Save locally (replace with S3 upload in production)
    cert_dir = os.path.join("static", "certificates")
    os.makedirs(cert_dir, exist_ok=True)
    filename = f"cert_{enrollment.id}_{cert_id}.pdf"
    filepath = os.path.join(cert_dir, filename)

    with open(filepath, "wb") as f:
        f.write(buffer.getvalue())

    cert_url = f"/static/certificates/{filename}"
    enrollment.certificate_url = cert_url
    db.commit()
    return cert_url
