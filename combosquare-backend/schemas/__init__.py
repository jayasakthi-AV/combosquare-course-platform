# schemas/__init__.py
from schemas.user import (
    UserSignup, UserLogin, UserResponse,
    TokenResponse, UserUpdateProfile, UserChangePassword
)
from schemas.program import ProgramCreate, ProgramUpdate, ProgramResponse
from schemas.enrollment import EnrollmentCreate, EnrollmentResponse, EnrollmentUpdateProgress
from schemas.contact import ContactCreate, ContactResponse