from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.program import Program
from models.enrollment import Enrollment
from models.module import Module
from models.lesson import Lesson
from models.progress import Progress
from models.quiz import Quiz
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
    current_user=Depends(get_current_user)
):
    program = db.query(Program).filter_by(slug=slug).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    enrollment = db.query(Enrollment).filter_by(
        user_id=current_user.id,
        program_id=program.id
    ).first()

    return {
        "id": program.id,
        "title": program.title,
        "subtitle": program.subtitle,
        "price": program.price,
        "slug": program.slug,
        "level": program.level,
        "duration": program.duration,
        "is_enrolled": True if enrollment else False
    }


# ─────────────────────────────────────────────
# ✅ COURSE CONTENT (MAIN LOGIC)
# ─────────────────────────────────────────────
@router.get("/courses/{slug}/content")
def get_course_content(
    slug: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    user_id = current_user.id
    program = db.query(Program).filter_by(slug=slug).first()

    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    enrollment = db.query(Enrollment).filter_by(
        user_id=user_id,
        program_id=program.id
    ).first()

    if not enrollment:
        raise HTTPException(status_code=403, detail="Please enroll first")

    modules = db.query(Module).filter_by(course_id=program.id).order_by(Module.id).all()

    result = []
    all_lessons_ordered = []  # flat list across all modules for cross-module unlock

    # First pass: collect all lessons in order
    for mod in modules:
        lessons = db.query(Lesson).filter_by(module_id=mod.id).order_by(Lesson.id).all()
        all_lessons_ordered.extend(lessons)

    # Second pass: build result with correct unlock logic
    lesson_index_map = {l.id: i for i, l in enumerate(all_lessons_ordered)}

    for mod in modules:
        lessons = db.query(Lesson).filter_by(module_id=mod.id).order_by(Lesson.id).all()
        lessons_data = []

        for lesson in lessons:
            progress = db.query(Progress).filter_by(
                user_id=user_id,
                lesson_id=lesson.id
            ).first()

            idx = lesson_index_map[lesson.id]

            if idx == 0:
                unlocked = True
            else:
                prev_lesson = all_lessons_ordered[idx - 1]
                prev_progress = db.query(Progress).filter_by(
                    user_id=user_id,
                    lesson_id=prev_lesson.id
                ).first()
                # ✅ Must have watched full video AND passed quiz to unlock next
                unlocked = (
                    prev_progress is not None
                    and prev_progress.completed
                    and prev_progress.quiz_passed
                )

            # Check if quiz exists for this lesson
            has_quiz = db.query(Quiz).filter_by(lesson_id=lesson.id).first() is not None

            lessons_data.append({
                "id": lesson.id,
                "title": lesson.title,
                "video_url": lesson.video_url,
                "completed": progress.completed if progress else False,
                "quiz_passed": progress.quiz_passed if progress else False,
                "video_progress": progress.progress if progress else 0,
                "unlocked": unlocked,
                "has_quiz": has_quiz,
            })

        result.append({
            "id": mod.id,
            "module_title": mod.title,
            "lessons": lessons_data
        })

    return result
