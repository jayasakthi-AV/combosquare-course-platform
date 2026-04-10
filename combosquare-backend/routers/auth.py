# routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.user import UserSignup, UserLogin, TokenResponse, UserResponse
from core.security import hash_password, verify_password, create_access_token
from core.dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ─── Signup ───────────────────────────────────────────────────
@router.post("/signup", response_model=TokenResponse, status_code=201)
def signup(user_data: UserSignup, db: Session = Depends(get_db)):
    """Register a new user account"""

    # Check if email already exists
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please login instead."
        )

    # Create new user
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        mobile=user_data.mobile,
        hashed_password=hash_password(user_data.password),
        role="student"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create JWT token
    token = create_access_token(data={"sub":str(new_user.id) })

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )


# ─── Login ────────────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password"""

    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # Check account is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account deactivated. Please contact support."
        )

    # Create JWT token
    token = create_access_token(data={"sub":str( user.id)})

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


# ─── Get Current User ─────────────────────────────────────────
@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get currently logged in user info"""
    return UserResponse.model_validate(current_user)