# schemas/program.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# ─── Request Schemas ──────────────────────────────────────────

class ProgramCreate(BaseModel):
    slug: str
    title: str
    subtitle: Optional[str] = None
    hero_img: Optional[str] = None
    duration: Optional[str] = None
    level: Optional[str] = None
    price: Optional[int] = 0
    highlights: Optional[List[str]] = []
    curriculum: Optional[List[str]] = []
    tools: Optional[List[str]] = []


class ProgramUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    hero_img: Optional[str] = None
    duration: Optional[str] = None
    level: Optional[str] = None
    price: Optional[int] = None
    is_active: Optional[bool] = None
    highlights: Optional[List[str]] = None
    curriculum: Optional[List[str]] = None
    tools: Optional[List[str]] = None


# ─── Response Schemas ─────────────────────────────────────────

class ProgramResponse(BaseModel):
    id: int
    slug: str
    title: str
    subtitle: Optional[str]
    hero_img: Optional[str]
    duration: Optional[str]
    level: Optional[str]
    price: int
    is_active: bool
    highlights: List[str]
    curriculum: List[str]
    tools: List[str]
    created_at: datetime

    model_config = {"from_attributes": True}