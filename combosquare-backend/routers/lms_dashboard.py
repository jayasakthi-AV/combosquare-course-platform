# routers/lms_dashboard.py
# ─────────────────────────────────────────────────────────────────────────────
#  Single endpoint: GET /api/lms/dashboard
#  Returns everything StudentDashboard.jsx needs in one call:
#    • profile
#    • stats  (total, completed, in_progress, avg_progress)
#    • enrolled_courses  — each with real lesson-level progress
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from models.enrollment import Enrollment
from models.program import Program
from models.module import Module
from models.lesson import Lesson
from models.progress import Progress
from core.dependencies import get_current_user
import os

router = APIRouter()


@router.get("/dashboard")
def lms_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    LMS-aware student dashboard.
    Progress is calculated from the lessons/progress tables,
    not the old enrollment.progress float — so it's always accurate.
    """

    enrollments = (
        db.query(Enrollment)
        .filter(Enrollment.user_id == current_user.id)
        .order_by(Enrollment.enrolled_at.desc())
        .all()
    )

    enrolled_courses = []

    for enr in enrollments:
        program = db.query(Program).filter(Program.id == enr.program_id).first()
        if not program:
            continue

        # ── Count total lessons across all modules ──────────────────────────
        modules = (
            db.query(Module)
            .filter(Module.course_id == program.id)
            .order_by(Module.id)
            .all()
        )

        all_lesson_ids = []
        for mod in modules:
            lessons = (
                db.query(Lesson)
                .filter(Lesson.module_id == mod.id)
                .order_by(Lesson.id)
                .all()
            )
            all_lesson_ids.extend([l.id for l in lessons])

        total_lessons = len(all_lesson_ids)

        # ── Count lessons where user passed the quiz ─────────────────────────
        completed_lessons = 0
        if all_lesson_ids:
            completed_lessons = (
                db.query(Progress)
                .filter(
                    Progress.user_id == current_user.id,
                    Progress.lesson_id.in_(all_lesson_ids),
                    Progress.quiz_passed == True,
                )
                .count()
            )

        # ── Overall progress % ───────────────────────────────────────────────
        if total_lessons > 0:
            overall_progress = round((completed_lessons / total_lessons) * 100)
        else:
            overall_progress = 0

        # ── Sync enrollment status ───────────────────────────────────────────
        if overall_progress == 100 and enr.status != "completed":
            enr.status = "completed"
            from datetime import datetime
            enr.completed_at = datetime.utcnow()
            db.commit()

        # ── Certificate URL (if already generated) ───────────────────────────
        cert_path = f"static/certificates/{current_user.id}_{program.id}.pdf"
        certificate_url = f"/static/certificates/{current_user.id}_{program.id}.pdf" \
            if os.path.exists(cert_path) else None

        enrolled_courses.append({
            "enrollment_id":    enr.id,
            "program_id":       program.id,
            "slug":             program.slug,
            "title":            program.title,
            "subtitle":         program.subtitle,
            "thumbnail":        program.hero_img,
            "duration":         program.duration,
            "level":            program.level,
            "status":           enr.status,
            "overall_progress": overall_progress,
            "total_lessons":    total_lessons,
            "completed_lessons":completed_lessons,
            "enrolled_at":      enr.enrolled_at,
            "completed_at":     enr.completed_at,
            "certificate_url":  certificate_url,
        })

    # ── Aggregate stats ──────────────────────────────────────────────────────
    total_enrolled = len(enrolled_courses)
    completed      = sum(1 for c in enrolled_courses if c["status"] == "completed")
    in_progress    = sum(1 for c in enrolled_courses if 0 < c["overall_progress"] < 100)
    avg_progress   = (
        round(sum(c["overall_progress"] for c in enrolled_courses) / total_enrolled, 1)
        if total_enrolled > 0 else 0.0
    )

    return {
        "profile": {
            "id":           current_user.id,
            "full_name":    current_user.full_name,
            "email":        current_user.email,
            "mobile":       getattr(current_user, "mobile", None),
            "role":         current_user.role,
            "member_since": current_user.created_at,
        },
        "stats": {
            "total_enrolled":   total_enrolled,
            "completed":        completed,
            "in_progress":      in_progress,
            "not_started":      total_enrolled - completed - in_progress,
            "average_progress": avg_progress,
        },
        "enrolled_courses": enrolled_courses,
    }
