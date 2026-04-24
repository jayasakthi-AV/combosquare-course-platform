# models/lms.py
# ─────────────────────────────────────────────────────────────────
#  Full LMS data models: Course → Module → Lesson → Quiz
#  Payment, Progress, Certificate all live here.
# ─────────────────────────────────────────────────────────────────

from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime,
    Float, ForeignKey, JSON, Enum as SAEnum
)
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base
import enum


# ── Enums ──────────────────────────────────────────────────────

class PaymentStatus(str, enum.Enum):
    pending   = "pending"
    paid      = "paid"
    failed    = "failed"
    refunded  = "refunded"

class LessonType(str, enum.Enum):
    video = "video"
    text  = "text"
    pdf   = "pdf"

class EnrollmentStatus(str, enum.Enum):
    active    = "active"
    completed = "completed"
    dropped   = "dropped"


# ── Course ─────────────────────────────────────────────────────

class Course(Base):
    """
    Top-level product a student buys.
    A Course has many Modules.
    """
    __tablename__ = "courses"

    id           = Column(Integer, primary_key=True, index=True)
    slug         = Column(String(120), unique=True, index=True, nullable=False)
    program_id   = Column(Integer, ForeignKey("programs.id"), nullable=True)  # links to existing Program table
    title        = Column(String(255), nullable=False)
    subtitle     = Column(Text, nullable=True)
    description  = Column(Text, nullable=True)
    thumbnail    = Column(String(500), nullable=True)
    preview_video= Column(String(500), nullable=True)   # free preview URL
    price        = Column(Integer, default=0)            # INR paise  (e.g. 499900 = ₹4999)
    level        = Column(String(60), default="Beginner")
    language     = Column(String(60), default="English")
    duration_hrs = Column(Float, default=0)
    is_published = Column(Boolean, default=False)
    instructor   = Column(String(200), nullable=True)
    passing_score= Column(Integer, default=70)           # % needed to pass quizzes
    created_at   = Column(DateTime, default=datetime.utcnow)
    updated_at   = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    modules      = relationship("Module", back_populates="course",
                                order_by="Module.order", cascade="all, delete-orphan")
    enrollments  = relationship("CourseEnrollment", back_populates="course")

    def __repr__(self):
        return f"<Course {self.title}>"


# ── Module (Section) ────────────────────────────────────────────

class Module(Base):
    """
    A Chapter / Section inside a Course.
    A Module has many Lessons.
    """
    __tablename__ = "modules"

    id          = Column(Integer, primary_key=True, index=True)
    course_id   = Column(Integer, ForeignKey("courses.id"), nullable=False)
    title       = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    order       = Column(Integer, default=0)   # display order inside course
    created_at  = Column(DateTime, default=datetime.utcnow)

    course      = relationship("Course", back_populates="modules")
    lessons     = relationship("Lesson", back_populates="module",
                               order_by="Lesson.order", cascade="all, delete-orphan")
    quiz        = relationship("Quiz", back_populates="module",
                               uselist=False, cascade="all, delete-orphan")


# ── Lesson ──────────────────────────────────────────────────────

class Lesson(Base):
    """
    A single piece of content inside a Module.
    Has a video URL + optional quiz after it.
    """
    __tablename__ = "lessons"

    id           = Column(Integer, primary_key=True, index=True)
    module_id    = Column(Integer, ForeignKey("modules.id"), nullable=False)
    title        = Column(String(255), nullable=False)
    description  = Column(Text, nullable=True)
    lesson_type  = Column(SAEnum(LessonType), default=LessonType.video)
    video_url    = Column(String(500), nullable=True)   # HLS / MP4 / YouTube embed
    video_duration_secs = Column(Integer, default=0)   # total seconds
    text_content = Column(Text, nullable=True)          # for text lessons
    pdf_url      = Column(String(500), nullable=True)
    order        = Column(Integer, default=0)
    is_free      = Column(Boolean, default=False)       # free preview lesson
    created_at   = Column(DateTime, default=datetime.utcnow)

    module       = relationship("Module", back_populates="lessons")
    quiz         = relationship("Quiz", back_populates="lesson",
                                uselist=False, cascade="all, delete-orphan")
    progress     = relationship("LessonProgress", back_populates="lesson",
                                cascade="all, delete-orphan")


# ── Quiz ────────────────────────────────────────────────────────

class Quiz(Base):
    """
    Belongs to either a Lesson or a Module (not both).
    Contains a list of QuizQuestions.
    """
    __tablename__ = "quizzes"

    id          = Column(Integer, primary_key=True, index=True)
    lesson_id   = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    module_id   = Column(Integer, ForeignKey("modules.id"), nullable=True)
    title       = Column(String(255), default="Quiz")
    passing_score = Column(Integer, default=70)  # override course default if set
    created_at  = Column(DateTime, default=datetime.utcnow)

    lesson      = relationship("Lesson", back_populates="quiz")
    module      = relationship("Module", back_populates="quiz")
    questions   = relationship("QuizQuestion", back_populates="quiz",
                               order_by="QuizQuestion.order", cascade="all, delete-orphan")
    attempts    = relationship("QuizAttempt", back_populates="quiz",
                               cascade="all, delete-orphan")


class QuizQuestion(Base):
    """
    MCQ question with 4 options and one correct answer index.
    """
    __tablename__ = "quiz_questions"

    id            = Column(Integer, primary_key=True, index=True)
    quiz_id       = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    question_text = Column(Text, nullable=False)
    options       = Column(JSON, nullable=False)   # ["A", "B", "C", "D"]
    correct_index = Column(Integer, nullable=False) # 0-based index into options
    explanation   = Column(Text, nullable=True)    # shown after answer
    order         = Column(Integer, default=0)

    quiz          = relationship("Quiz", back_populates="questions")


# ── Enrollment (Course-level, replaces old program enrollment) ──

class CourseEnrollment(Base):
    """
    Created after a successful payment.
    Tracks overall course progress and certificate status.
    """
    __tablename__ = "course_enrollments"

    id              = Column(Integer, primary_key=True, index=True)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    course_id       = Column(Integer, ForeignKey("courses.id"), nullable=False)
    status          = Column(SAEnum(EnrollmentStatus), default=EnrollmentStatus.active)
    overall_progress= Column(Float, default=0.0)   # 0–100 %
    enrolled_at     = Column(DateTime, default=datetime.utcnow)
    completed_at    = Column(DateTime, nullable=True)
    certificate_url = Column(String(500), nullable=True)
    last_lesson_id  = Column(Integer, ForeignKey("lessons.id"), nullable=True)

    user            = relationship("User")
    course          = relationship("Course", back_populates="enrollments")
    payment         = relationship("Payment", back_populates="enrollment",
                                   uselist=False)
    lesson_progress = relationship("LessonProgress", back_populates="enrollment",
                                   cascade="all, delete-orphan")
    quiz_attempts   = relationship("QuizAttempt", back_populates="enrollment",
                                   cascade="all, delete-orphan")


# ── Payment ─────────────────────────────────────────────────────

class Payment(Base):
    """
    Records the Razorpay / Stripe transaction.
    Enrollment is only active if payment status == paid.
    """
    __tablename__ = "payments"

    id                  = Column(Integer, primary_key=True, index=True)
    enrollment_id       = Column(Integer, ForeignKey("course_enrollments.id"),
                                 nullable=False)
    user_id             = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount              = Column(Integer, nullable=False)          # INR paise
    currency            = Column(String(10), default="INR")
    status              = Column(SAEnum(PaymentStatus), default=PaymentStatus.pending)
    gateway             = Column(String(50), default="razorpay")   # razorpay | stripe
    gateway_order_id    = Column(String(200), nullable=True)       # Razorpay order_id
    gateway_payment_id  = Column(String(200), nullable=True)       # Razorpay payment_id
    gateway_signature   = Column(String(400), nullable=True)       # for verification
    created_at          = Column(DateTime, default=datetime.utcnow)
    paid_at             = Column(DateTime, nullable=True)

    enrollment          = relationship("CourseEnrollment", back_populates="payment")
    user                = relationship("User")


# ── Lesson Progress ─────────────────────────────────────────────

class LessonProgress(Base):
    """
    One row per (enrollment, lesson).
    Tracks watch percentage and quiz pass state.
    Lesson is "completed" when watch_percent == 100 AND quiz passed (if quiz exists).
    """
    __tablename__ = "lesson_progress"

    id              = Column(Integer, primary_key=True, index=True)
    enrollment_id   = Column(Integer, ForeignKey("course_enrollments.id"), nullable=False)
    lesson_id       = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    watch_percent   = Column(Float, default=0.0)       # 0–100
    last_position   = Column(Integer, default=0)       # seconds — resume from here
    is_completed    = Column(Boolean, default=False)
    completed_at    = Column(DateTime, nullable=True)
    updated_at      = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    enrollment      = relationship("CourseEnrollment", back_populates="lesson_progress")
    lesson          = relationship("Lesson", back_populates="progress")


# ── Quiz Attempt ────────────────────────────────────────────────

class QuizAttempt(Base):
    """
    Stores every quiz submission.
    is_passed = score >= quiz.passing_score
    """
    __tablename__ = "quiz_attempts"

    id            = Column(Integer, primary_key=True, index=True)
    enrollment_id = Column(Integer, ForeignKey("course_enrollments.id"), nullable=False)
    quiz_id       = Column(Integer, ForeignKey("quizzes.id"), nullable=False)
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=False)
    answers       = Column(JSON, nullable=False)   # {question_id: chosen_index}
    score         = Column(Float, nullable=False)  # 0–100
    is_passed     = Column(Boolean, default=False)
    attempt_number= Column(Integer, default=1)
    attempted_at  = Column(DateTime, default=datetime.utcnow)

    enrollment    = relationship("CourseEnrollment", back_populates="quiz_attempts")
    quiz          = relationship("Quiz", back_populates="attempts")
    user          = relationship("User")
