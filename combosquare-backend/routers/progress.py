from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.progress import Progress

router = APIRouter()

@router.post("/")
def update_progress(data: dict, db: Session = Depends(get_db)):
    user_id = 1  # temp user

    progress = db.query(Progress).filter_by(
        user_id=user_id,
        lesson_id=data["lesson_id"]
    ).first()

    if not progress:
        progress = Progress(
            user_id=user_id,
            lesson_id=data["lesson_id"],
            progress=data["progress"],
            completed=data["progress"] == 100
        )
        db.add(progress)
    else:
        progress.progress = data["progress"]
        if data["progress"] == 100:
            progress.completed = True

    db.commit()

    return {"status": "updated"}