# routers/contact.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.contact import ContactSubmission
from schemas.contact import ContactCreate, ContactResponse
from core.dependencies import get_current_admin
from services.email_service import send_contact_email

router = APIRouter(prefix="/api/contact", tags=["Contact"])


# ─── Submit Contact Form (Public) ─────────────────────────────
@router.post("/", status_code=201)
def submit_contact(
    data: ContactCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Public endpoint — submit a contact form message"""
    submission = ContactSubmission(
        name=data.name,
        email=data.email,
        mobile=data.mobile,
        message=data.message
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    # Send email notification in the background (won't block the response)
    background_tasks.add_task(
        send_contact_email,
        name=data.name,
        email=data.email,
        mobile=data.mobile,
        message=data.message
    )

    return {"message": "Message sent successfully"}


# ─── Admin: Get All Submissions ───────────────────────────────
@router.get("/", response_model=List[ContactResponse])
def get_all_submissions(
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin only — view all contact submissions"""
    submissions = db.query(ContactSubmission).order_by(
        ContactSubmission.submitted_at.desc()
    ).all()
    return [ContactResponse.model_validate(s) for s in submissions]


# ─── Admin: Mark as Read ──────────────────────────────────────
@router.put("/{submission_id}/read", response_model=ContactResponse)
def mark_as_read(
    submission_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin only — mark a submission as read"""
    submission = db.query(ContactSubmission).filter(
        ContactSubmission.id == submission_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission.is_read = True
    db.commit()
    db.refresh(submission)
    return ContactResponse.model_validate(submission)


# ─── Admin: Mark as Resolved ──────────────────────────────────
@router.put("/{submission_id}/resolve", response_model=ContactResponse)
def mark_as_resolved(
    submission_id: int,
    admin=Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin only — mark a submission as resolved"""
    submission = db.query(ContactSubmission).filter(
        ContactSubmission.id == submission_id
    ).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission.is_resolved = True
    submission.is_read = True
    db.commit()
    db.refresh(submission)
    return ContactResponse.model_validate(submission)