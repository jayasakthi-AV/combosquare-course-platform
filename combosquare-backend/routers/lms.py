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
    print("USER ID 👉", current_user.id)

    program = db.query(Program).filter_by(slug=slug).first()

    if not program:
        return []

    enrollment = db.query(Enrollment).filter_by(
        user_id=user_id,
        program_id=program.id
    ).first()

    # 🔒 BLOCK if not enrolled
    if not enrollment:
        return {"error": "Please enroll first"}

    modules = db.query(Module).filter_by(course_id=program.id).all()

    result = []

    for mod in modules:
        lessons = db.query(Lesson).filter_by(module_id=mod.id).all()

        lessons_data = []

        for i, l in enumerate(lessons):

            progress = db.query(Progress).filter_by(
                user_id=user_id,
                lesson_id=l.id
            ).first()

            if i == 0:
                unlocked = True
            else:
                prev = lessons[i-1]
                prev_progress = db.query(Progress).filter_by(
                    user_id=user_id,
                    lesson_id=prev.id
                ).first()

                unlocked = prev_progress and prev_progress.quiz_passed

            lessons_data.append({
                "id": l.id,
                "title": l.title,
                "video_url": l.video_url,
                "quiz_passed": progress.quiz_passed if progress else False,
                "unlocked": unlocked
            })

        result.append({
            "module_title": mod.title,
            "lessons": lessons_data
        })

    return result