# schemas/enrollment.py
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from schemas.program import ProgramResponse


# ─── Request Schemas ──────────────────────────────────────────

class EnrollmentCreate(BaseModel):
    program_id: int


class EnrollmentUpdateProgress(BaseModel):
    progress: float  # 0.0 to 100.0


# ─── Response Schemas ─────────────────────────────────────────

class EnrollmentResponse(BaseModel):
    id: int
    user_id: int
    program_id: int
    status: str
    progress: float
    enrolled_at: datetime
    completed_at: Optional[datetime]
    program: ProgramResponse

    model_config = {"from_attributes": True}


class EnrollmentSimple(BaseModel):
    id: int
    user_id: int
    program_id: int
    status: str
    progress: float
    enrolled_at: datetime

    model_config = {"from_attributes": True}