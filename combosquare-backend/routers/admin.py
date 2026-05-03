# routers/admin.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from pydantic import BaseModel
from database import get_db
from models.user import User
from models.program import Program
from models.enrollment import Enrollment
from models.contact import ContactSubmission
from models.module import Module
from models.lesson import Lesson
from models.quiz import Quiz
from schemas.user import UserResponse
from schemas.enrollment import EnrollmentResponse
from schemas.contact import ContactResponse
from core.dependencies import get_current_admin, get_current_user

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])


# ── Pydantic Models ───────────────────────────────────────────
class LessonCreate(BaseModel):
    title: str
    video_url: str
    module_id: int


class QuizCreate(BaseModel):
    lesson_id: int
    question: str
    option1: str
    option2: str
    option3: str
    option4: str
    answer: str


# ─── Dashboard Stats ──────────────────────────────────────────
@router.get("/stats")
def get_dashboard_stats(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    from datetime import datetime, timedelta
    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    total_users = db.query(func.count(User.id)).scalar()
    total_programs = db.query(func.count(Program.id)).filter(Program.is_active == True).scalar()
    total_enrollments = db.query(func.count(Enrollment.id)).scalar()
    total_contacts = db.query(func.count(ContactSubmission.id)).scalar()
    unread_contacts = db.query(func.count(ContactSubmission.id)).filter(ContactSubmission.is_read == False).scalar()
    new_users_this_week = db.query(func.count(User.id)).filter(User.created_at >= seven_days_ago).scalar()
    active_enrollments = db.query(func.count(Enrollment.id)).filter(Enrollment.status == "active").scalar()
    completed_enrollments = db.query(func.count(Enrollment.id)).filter(Enrollment.status == "completed").scalar()

    return {
        "total_users": total_users,
        "total_programs": total_programs,
        "total_enrollments": total_enrollments,
        "total_contacts": total_contacts,
        "unread_contacts": unread_contacts,
        "new_users_this_week": new_users_this_week,
        "active_enrollments": active_enrollments,
        "completed_enrollments": completed_enrollments
    }


# ─── All Users ────────────────────────────────────────────────
@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [UserResponse.model_validate(u) for u in users]


# ─── User Detail ──────────────────────────────────────────────
@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_detail(
    user_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse.model_validate(user)


# ─── User Enrollments ─────────────────────────────────────────
@router.get("/users/{user_id}/enrollments", response_model=List[EnrollmentResponse])
def get_user_enrollments(
    user_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    enrollments = db.query(Enrollment).filter(Enrollment.user_id == user_id).all()
    return [EnrollmentResponse.model_validate(e) for e in enrollments]


# ─── Toggle User Status ───────────────────────────────────────
@router.put("/users/{user_id}/toggle-status", response_model=UserResponse)
def toggle_user_status(
    user_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot deactivate your own account")
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)


# ─── All Enrollments ──────────────────────────────────────────
@router.get("/enrollments", response_model=List[EnrollmentResponse])
def get_all_enrollments(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    enrollments = db.query(Enrollment).order_by(Enrollment.enrolled_at.desc()).all()
    return [EnrollmentResponse.model_validate(e) for e in enrollments]


# ─── All Contact Submissions ──────────────────────────────────
@router.get("/contacts", response_model=List[ContactResponse])
def get_all_contacts(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    submissions = db.query(ContactSubmission).order_by(ContactSubmission.submitted_at.desc()).all()
    return [ContactResponse.model_validate(s) for s in submissions]


# ─── Promote User to Admin ────────────────────────────────────
@router.put("/users/{user_id}/make-admin", response_model=UserResponse)
def make_admin(
    user_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = "admin"
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)


# ─── Create Course ────────────────────────────────────────────
@router.post("/course")
def create_course(data: dict, db: Session = Depends(get_db)):
    existing = db.query(Program).filter_by(slug=data["slug"]).first()
    if existing:
        return {"error": "Course with this slug already exists"}
    course = Program(
        title=data["title"],
        slug=data["slug"],
        price=data["price"]
    )
    db.add(course)
    db.commit()
    return {"message": "Course created"}


# ─── Create Module ────────────────────────────────────────────
@router.post("/module")
def create_module(data: dict, db: Session = Depends(get_db)):
    # Auto-assign order
    count = db.query(Module).filter_by(course_id=data["course_id"]).count()
    module = Module(
        title=data["title"],
        course_id=data["course_id"],
        order=count + 1
    )
    db.add(module)
    db.commit()
    return {"message": "Module created", "id": module.id}


# ─── Create Lesson ────────────────────────────────────────────
@router.post("/lesson")
def create_lesson(
    data: LessonCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # Auto-assign order = count of existing lessons in module + 1
    count = db.query(Lesson).filter_by(module_id=data.module_id).count()
    lesson = Lesson(
        module_id=data.module_id,
        title=data.title,
        video_url=data.video_url,
        order=count + 1,
        unlocked=False,
    )
    db.add(lesson)
    db.commit()
    return {"id": lesson.id, "title": lesson.title}


# ─── Create Quiz ──────────────────────────────────────────────
@router.post("/quiz")
def create_quiz(data: QuizCreate, db: Session = Depends(get_db)):
    quiz = Quiz(
        lesson_id=data.lesson_id,
        question=data.question,
        option1=data.option1,
        option2=data.option2,
        option3=data.option3,
        option4=data.option4,
        answer=data.answer
    )
    db.add(quiz)
    db.commit()
    return {"message": "Quiz created successfully"}


# ─── Get Modules for a Course ─────────────────────────────────
@router.get("/modules/{course_id}")
def get_modules(
    course_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    modules = db.query(Module).filter_by(course_id=course_id).order_by(Module.order).all()
    return [{"id": m.id, "title": m.title, "course_id": m.course_id} for m in modules]


# ─── Get Lessons for a Module ─────────────────────────────────
@router.get("/lessons/{module_id}")
def get_lessons(
    module_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    lessons = db.query(Lesson).filter_by(module_id=module_id).order_by(Lesson.order).all()
    return [
        {
            "id": l.id,
            "title": l.title,
            "video_url": l.video_url,
            "module_id": l.module_id,
            "order": l.order,
        }
        for l in lessons
    ]


# ─── Get Quiz for a Lesson ────────────────────────────────────
@router.get("/quiz/{lesson_id}")
def get_quiz_for_lesson(
    lesson_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    quizzes = db.query(Quiz).filter_by(lesson_id=lesson_id).all()
    return [
        {
            "id": q.id,
            "question": q.question,
            "option1": q.option1,
            "option2": q.option2,
            "option3": q.option3,
            "option4": q.option4,
            "answer": q.answer
        }
        for q in quizzes
    ]


# ─── Delete Lesson ────────────────────────────────────────────
@router.delete("/lesson/{lesson_id}")
def delete_lesson(
    lesson_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    db.delete(lesson)
    db.commit()
    return {"message": "Lesson deleted"}


# ─── Delete Module ────────────────────────────────────────────
@router.delete("/module/{module_id}")
def delete_module(
    module_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    module = db.query(Module).filter(Module.id == module_id).first()
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    db.delete(module)
    db.commit()
    return {"message": "Module deleted"}
