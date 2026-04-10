# routers/admin.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
from models.user import User
from models.program import Program
from models.enrollment import Enrollment
from models.contact import ContactSubmission
from schemas.user import UserResponse
from schemas.enrollment import EnrollmentResponse
from schemas.contact import ContactResponse
from core.dependencies import get_current_admin

router = APIRouter(prefix="/api/admin", tags=["Admin Dashboard"])


# ─── Dashboard Stats ──────────────────────────────────────────
@router.get("/stats")
def get_dashboard_stats(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Returns all key stats for the admin dashboard overview:
    - Total users, programs, enrollments, contact submissions
    - Recent signups count (last 7 days)
    - Enrollment breakdown by status
    """
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
    """Get all registered users with their details"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [UserResponse.model_validate(u) for u in users]


# ─── User Detail ──────────────────────────────────────────────
@router.get("/users/{user_id}", response_model=UserResponse)
def get_user_detail(
    user_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get a specific user's details"""
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
    """Get all enrollments for a specific user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    enrollments = db.query(Enrollment).filter(
        Enrollment.user_id == user_id
    ).all()
    return [EnrollmentResponse.model_validate(e) for e in enrollments]


# ─── Toggle User Status ───────────────────────────────────────
@router.put("/users/{user_id}/toggle-status", response_model=UserResponse)
def toggle_user_status(
    user_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Block or unblock a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="You cannot deactivate your own account")

    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    status_msg = "activated" if user.is_active else "deactivated"
    return UserResponse.model_validate(user)


# ─── All Enrollments ──────────────────────────────────────────
@router.get("/enrollments", response_model=List[EnrollmentResponse])
def get_all_enrollments(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all enrollments across all users"""
    enrollments = db.query(Enrollment).order_by(
        Enrollment.enrolled_at.desc()
    ).all()
    return [EnrollmentResponse.model_validate(e) for e in enrollments]


# ─── All Contact Submissions ──────────────────────────────────
@router.get("/contacts", response_model=List[ContactResponse])
def get_all_contacts(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all contact form submissions"""
    submissions = db.query(ContactSubmission).order_by(
        ContactSubmission.submitted_at.desc()
    ).all()
    return [ContactResponse.model_validate(s) for s in submissions]


# ─── Promote User to Admin ────────────────────────────────────
@router.put("/users/{user_id}/make-admin", response_model=UserResponse)
def make_admin(
    user_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Promote a user to admin role"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.role = "admin"
    db.commit()
    db.refresh(user)
    return UserResponse.model_validate(user)