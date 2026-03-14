# routers/enrollments.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.enrollment import Enrollment
from models.program import Program
from schemas.enrollment import EnrollmentCreate, EnrollmentResponse, EnrollmentUpdateProgress
from core.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/api/enrollments", tags=["Enrollments"])


# ─── Enroll in a Program ──────────────────────────────────────
@router.post("/", response_model=EnrollmentResponse, status_code=201)
def enroll(
    data: EnrollmentCreate,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Enroll current user in a program"""

    # Check program exists
    program = db.query(Program).filter(
        Program.id == data.program_id,
        Program.is_active == True
    ).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    # Check if already enrolled
    existing = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id,
        Enrollment.program_id == data.program_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="You are already enrolled in this program")

    enrollment = Enrollment(
        user_id=current_user.id,
        program_id=data.program_id
    )
    db.add(enrollment)
    db.commit()
    db.refresh(enrollment)
    return EnrollmentResponse.model_validate(enrollment)


# ─── Get My Enrollments ───────────────────────────────────────
@router.get("/me", response_model=List[EnrollmentResponse])
def get_my_enrollments(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all enrollments for current logged in user"""
    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == current_user.id
    ).all()
    return [EnrollmentResponse.model_validate(e) for e in enrollments]


# ─── Update Progress ──────────────────────────────────────────
@router.put("/{enrollment_id}/progress", response_model=EnrollmentResponse)
def update_progress(
    enrollment_id: int,
    data: EnrollmentUpdateProgress,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update progress percentage for an enrollment"""
    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id,
        Enrollment.user_id == current_user.id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    # Validate progress value
    if not 0 <= data.progress <= 100:
        raise HTTPException(status_code=400, detail="Progress must be between 0 and 100")

    enrollment.progress = data.progress

    # Auto mark as completed when progress hits 100
    if data.progress == 100:
        enrollment.status = "completed"
        from datetime import datetime
        enrollment.completed_at = datetime.utcnow()

    db.commit()
    db.refresh(enrollment)
    return EnrollmentResponse.model_validate(enrollment)


# ─── Unenroll ─────────────────────────────────────────────────
@router.delete("/{enrollment_id}")
def unenroll(
    enrollment_id: int,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Unenroll from a program"""
    enrollment = db.query(Enrollment).filter(
        Enrollment.id == enrollment_id,
        Enrollment.user_id == current_user.id
    ).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")

    db.delete(enrollment)
    db.commit()
    return {"message": "Successfully unenrolled"}


# ─── Admin: Get All Enrollments ───────────────────────────────
@router.get("/", response_model=List[EnrollmentResponse])
def get_all_enrollments(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin only — get all enrollments"""
    enrollments = db.query(Enrollment).order_by(
        Enrollment.enrolled_at.desc()
    ).all()
    return [EnrollmentResponse.model_validate(e) for e in enrollments]