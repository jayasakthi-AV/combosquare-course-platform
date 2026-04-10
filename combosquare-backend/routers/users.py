# routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.user import User
from schemas.user import UserResponse, UserUpdateProfile, UserChangePassword
from core.security import verify_password, hash_password
from core.dependencies import get_current_user, get_current_admin

router = APIRouter(prefix="/api/users", tags=["Users"])


# ─── Update My Profile ────────────────────────────────────────
@router.put("/me", response_model=UserResponse)
def update_profile(
    update_data: UserUpdateProfile,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    if update_data.full_name:
        current_user.full_name = update_data.full_name
    if update_data.mobile:
        current_user.mobile = update_data.mobile

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


# ─── Change Password ──────────────────────────────────────────
@router.put("/me/password")
def change_password(
    password_data: UserChangePassword,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Change current user's password"""
    if not verify_password(password_data.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )

    current_user.hashed_password = hash_password(password_data.new_password)
    db.commit()
    return {"message": "Password changed successfully"}


# ─── Admin: Get All Users ─────────────────────────────────────
@router.get("/", response_model=List[UserResponse])
def get_all_users(
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin only — get all registered users"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [UserResponse.model_validate(u) for u in users]


# ─── Admin: Block / Unblock User ─────────────────────────────
@router.put("/{user_id}/toggle-status", response_model=UserResponse)
def toggle_user_status(
    user_id: int,
    admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin only — block or unblock a user"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent admin from blocking themselves
    if user.id == admin.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot deactivate your own account"
        )

    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)

    status_text = "activated" if user.is_active else "deactivated"
    return UserResponse.model_validate(user)