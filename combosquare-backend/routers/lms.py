from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.program import Program
from models.enrollment import Enrollment
from models.module import Module
from models.lesson import Lesson
from models.progress import Progress
from core.dependencies import get_current_user

router = APIRouter()


# ─────────────────────────────────────────────
# ✅ LMS HOME
# ─────────────────────────────────────────────
@router.get("/")
def lms_home():
    return {"message": "LMS working 🚀"}


# ─────────────────────────────────────────────
# ✅ COURSE DETAILS
# ─────────────────────────────────────────────
@router.get("/courses/{slug}")
def get_course(
    slug: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    program = db.query(Program).filter_by(slug=slug).first()

    if not program:
        return {"error": "Program not found"}

    enrollment = db.query(Enrollment).filter_by(
        user_id=current_user.id,
        program_id=program.id
    ).first()

    return {
        "id": program.id,
        "title": program.title,
        "price": program.price,
        "slug": program.slug,
        "is_enrolled": True if enrollment else False
    }


# ─────────────────────────────────────────────
# ✅ COURSE CONTENT (MAIN LOGIC)
# ─────────────────────────────────────────────
@router.get("/courses/{slug}/content")
def get_course_content(
    slug: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):

    user_id = current_user.id

    # 🔍 GET COURSE
    program = db.query(Program).filter_by(slug=slug).first()

    if not program:
        return {"error": "Course not found"}

    # 🔒 CHECK ENROLLMENT (PAYMENT)
    enrollment = db.query(Enrollment).filter_by(
        user_id=user_id,
        program_id=program.id
    ).first()

    if not enrollment or enrollment.status != "active":
        return {"error": "Please enroll and complete payment"}

    # 📦 GET MODULES
    modules = db.query(Module).filter_by(course_id=program.id).all()

    final_data = []

    for mod in modules:

        lessons = db.query(Lesson).filter_by(module_id=mod.id).all()

        lessons_data = []

        for i, lesson in enumerate(lessons):

            # 📊 GET USER PROGRESS
            progress = db.query(Progress).filter_by(
                user_id=user_id,
                lesson_id=lesson.id
            ).first()

            # 🔓 UNLOCK LOGIC
            if i == 0:
                unlocked = True
            else:
                prev_lesson = lessons[i - 1]

                prev_progress = db.query(Progress).filter_by(
                    user_id=user_id,
                    lesson_id=prev_lesson.id
                ).first()

                unlocked = (
                    prev_progress is not None and
                    prev_progress.quiz_passed is True
                )

            lessons_data.append({
                "id": lesson.id,
                "title": lesson.title,
                "video_url": lesson.video_url,
                "completed": progress.completed if progress else False,
                "quiz_passed": progress.quiz_passed if progress else False,
                "unlocked": unlocked
            })

        final_data.append({
            "module_id": mod.id,
            "module_title": mod.title,
            "lessons": lessons_data
        })

    return final_data