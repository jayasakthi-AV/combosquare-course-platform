# schemas/contact.py
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ─── Request Schemas ──────────────────────────────────────────

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    mobile: Optional[str] = None
    message: str


# ─── Response Schemas ─────────────────────────────────────────

class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    mobile: Optional[str]
    message: str
    is_read: bool
    is_resolved: bool
    submitted_at: datetime

    model_config = {"from_attributes": True}