from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.progress import Progress
from core.dependencies import get_current_user

router = APIRouter()


class ProgressUpdate(BaseModel):
    lesson_id: int
    progress: int          # 0–100 percentage watched
    completed: bool = False


@router.post("/")
def update_progress(
    data: ProgressUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    """
    Called by frontend periodically as user watches video.
    progress = percentage (0-100). completed = True when video ends.
    """
    user_id = current_user.id

    progress_row = db.query(Progress).filter_by(
        user_id=user_id,
        lesson_id=data.lesson_id
    ).first()

    if not progress_row:
        progress_row = Progress(
            user_id=user_id,
            lesson_id=data.lesson_id,
            progress=data.progress,
            completed=data.completed,
            quiz_passed=False
        )
        db.add(progress_row)
    else:
        # Only update if new progress is higher (prevent rewind cheating)
        if data.progress > progress_row.progress:
            progress_row.progress = data.progress
        if data.completed:
            progress_row.completed = True

    db.commit()

    return {
        "status": "updated",
        "progress": progress_row.progress,
        "completed": progress_row.completed,
        "quiz_passed": progress_row.quiz_passed
    }


@router.get("/{lesson_id}")
def get_progress(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    progress = db.query(Progress).filter_by(
        user_id=current_user.id,
        lesson_id=lesson_id
    ).first()

    if not progress:
        return {"progress": 0, "completed": False, "quiz_passed": False}

    return {
        "progress": progress.progress,
        "completed": progress.completed,
        "quiz_passed": progress.quiz_passed
    }
