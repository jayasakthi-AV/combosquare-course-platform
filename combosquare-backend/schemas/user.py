# schemas/user.py
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


# ─── Request Schemas (what frontend sends) ────────────────────

class UserSignup(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    mobile: Optional[str] = None

    @field_validator("full_name")
    def name_must_not_be_empty(cls, v):
        if not v.strip():
            raise ValueError("Full name cannot be empty")
        return v.strip()

    @field_validator("password")
    def password_min_length(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdateProfile(BaseModel):
    full_name: Optional[str] = None
    mobile: Optional[str] = None


class UserChangePassword(BaseModel):
    current_password: str
    new_password: str

    @field_validator("new_password")
    def new_password_min_length(cls, v):
        if len(v) < 6:
            raise ValueError("New password must be at least 6 characters")
        return v


# ─── Response Schemas (what API sends back) ───────────────────

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    mobile: Optional[str]
    role: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse