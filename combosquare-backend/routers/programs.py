# routers/programs.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.program import Program
from schemas.program import ProgramCreate, ProgramUpdate, ProgramResponse
from core.dependencies import get_current_admin

router = APIRouter(prefix="/api/programs", tags=["Programs"])


# ─── Get All Programs (Public) ────────────────────────────────
@router.get("/", response_model=List[ProgramResponse])
def get_all_programs(db: Session = Depends(get_db)):
    """Get all active programs — public, no login needed"""
    programs = db.query(Program).filter(
        Program.is_active == True
    ).order_by(Program.id).all()
    return [ProgramResponse.model_validate(p) for p in programs]


# ─── Get Single Program by Slug (Public) ──────────────────────
@router.get("/{slug}", response_model=ProgramResponse)
def get_program(slug: str, db: Session = Depends(get_db)):
    """Get one program by slug e.g. /api/programs/full-stack"""
    program = db.query(Program).filter(
        Program.slug == slug,
        Program.is_active == True
    ).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")
    return ProgramResponse.model_validate(program)


# ─── Create Program (Admin Only) ──────────────────────────────
@router.post("/", response_model=ProgramResponse, status_code=201)
def create_program(
    data: ProgramCreate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    """Admin only — create a new program"""
    # Check slug is unique
    existing = db.query(Program).filter(Program.slug == data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="A program with this slug already exists")

    program = Program(**data.model_dump())
    db.add(program)
    db.commit()
    db.refresh(program)
    return ProgramResponse.model_validate(program)


# ─── Update Program (Admin Only) ──────────────────────────────
@router.put("/{slug}", response_model=ProgramResponse)
def update_program(
    slug: str,
    data: ProgramUpdate,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    """Admin only — update an existing program"""
    program = db.query(Program).filter(Program.slug == slug).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    # Only update fields that were actually sent
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(program, field, value)

    db.commit()
    db.refresh(program)
    return ProgramResponse.model_validate(program)


# ─── Delete Program (Admin Only) ──────────────────────────────
@router.delete("/{slug}")
def delete_program(
    slug: str,
    db: Session = Depends(get_db),
    admin=Depends(get_current_admin)
):
    """Admin only — soft delete (deactivate) a program"""
    program = db.query(Program).filter(Program.slug == slug).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found")

    # Soft delete — just deactivate instead of removing from DB
    program.is_active = False
    db.commit()
    return {"message": f"Program '{program.title}' deactivated successfully"}