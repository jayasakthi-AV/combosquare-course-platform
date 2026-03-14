# routers/dashboard.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models.user import User
from models.enrollment import Enrollment
from models.program import Program
from schemas.user import UserResponse
from schemas.enrollment import EnrollmentResponse
from core.dependencies import get_current_user

router = APIRouter(prefix="/api/dashboard", tags=["Student Dashboard"])


# ─── Student Dashboard Overview ───────────────────────────────
@router.get("/me")
def get_student_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns everything the student dashboard needs in one call:
    - Profile info
    - Enrolled programs with progress
    - Stats summary
    """

    # Get all enrollments with program details
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id
    ).all()

    # Build enrollment list
    enrolled_programs = []
    for e in enrollments:
        program = db.query(Program).filter(Program.id == e.program_id).first()
        if program:
            enrolled_programs.append({
                "enrollment_id": e.id,
                "program_id": program.id,
                "slug": program.slug,
                "title": program.title,
                "subtitle": program.subtitle,
                "hero_img": program.hero_img,
                "duration": program.duration,
                "level": program.level,
                "tools": program.tools,
                "progress": e.progress,
                "status": e.status,
                "enrolled_at": e.enrolled_at,
                "completed_at": e.completed_at
            })

    # Calculate stats
    total_enrolled = len(enrollments)
    completed = len([e for e in enrollments if e.status == "completed"])
    in_progress = len([e for e in enrollments if e.status == "active" and e.progress > 0])
    not_started = len([e for e in enrollments if e.progress == 0])

    # Average progress across all enrollments
    avg_progress = 0.0
    if total_enrolled > 0:
        avg_progress = sum(e.progress for e in enrollments) / total_enrolled

    return {
        "profile": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "email": current_user.email,
            "mobile": current_user.mobile,
            "role": current_user.role,
            "member_since": current_user.created_at
        },
        "stats": {
            "total_enrolled": total_enrolled,
            "completed": completed,
            "in_progress": in_progress,
            "not_started": not_started,
            "average_progress": round(avg_progress, 1)
        },
        "enrolled_programs": enrolled_programs
    }


# ─── Get Available Programs (Not Yet Enrolled) ────────────────
@router.get("/available-programs")
def get_available_programs(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns programs the student has NOT enrolled in yet.
    Used to show 'Browse More Programs' section on dashboard.
    """

    # Get IDs of programs already enrolled in
    enrolled_program_ids = db.query(Enrollment.program_id).filter(
        Enrollment.user_id == current_user.id
    ).all()
    enrolled_ids = [id[0] for id in enrolled_program_ids]

    # Get programs NOT in enrolled list
    available = db.query(Program).filter(
        Program.is_active == True,
        ~Program.id.in_(enrolled_ids) if enrolled_ids else Program.is_active == True
    ).all()

    return {
        "available_programs": [
            {
                "id": p.id,
                "slug": p.slug,
                "title": p.title,
                "subtitle": p.subtitle,
                "hero_img": p.hero_img,
                "duration": p.duration,
                "level": p.level,
                "tools": p.tools
            }
            for p in available
        ]
    }


# ─── Update Profile ───────────────────────────────────────────
@router.put("/me/profile", response_model=UserResponse)
def update_my_profile(
    update_data: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update student's own profile from dashboard"""
    if "full_name" in update_data and update_data["full_name"]:
        current_user.full_name = update_data["full_name"]
    if "mobile" in update_data and update_data["mobile"]:
        current_user.mobile = update_data["mobile"]

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)