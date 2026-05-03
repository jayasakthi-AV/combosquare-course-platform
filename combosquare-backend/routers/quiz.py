from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db
from models.progress import Progress
from models.quiz import Quiz
from core.dependencies import get_current_user

router = APIRouter()


class QuizSubmit(BaseModel):
    lesson_id: int
    answer: str


# ✅ GET QUIZ FOR A LESSON (from DB)
@router.get("/lesson/{lesson_id}")
def get_quiz(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # 🔒 Must have completed watching the video first
    progress = db.query(Progress).filter_by(
        user_id=current_user.id,
        lesson_id=lesson_id
    ).first()

    if not progress or not progress.completed:
        raise HTTPException(
            status_code=403,
            detail="You must finish watching the video before taking the quiz"
        )

    quiz = db.query(Quiz).filter_by(lesson_id=lesson_id).first()

    if not quiz:
        # No quiz for this lesson — auto-mark as passed so next unlocks
        progress.quiz_passed = True
        db.commit()
        return {"no_quiz": True, "message": "No quiz for this lesson. Next lesson unlocked!"}

    return {
        "id": quiz.id,
        "question": quiz.question,
        "options": [quiz.option1, quiz.option2, quiz.option3, quiz.option4],
    }


# ✅ SUBMIT QUIZ ANSWER
# routes/quiz.py — replace the submit endpoint

@router.post("/submit")
def submit_quiz(
    data: QuizSubmit,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    progress = db.query(Progress).filter_by(
        user_id=current_user.id,
        lesson_id=data.lesson_id
    ).first()

    if not progress or not progress.completed:
        raise HTTPException(status_code=403, detail="Finish watching the video first")

    quiz = db.query(Quiz).filter_by(lesson_id=data.lesson_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="No quiz found")

    is_correct = data.answer.strip().lower() == quiz.answer.strip().lower()

    if is_correct:
        progress.quiz_passed = True
        db.commit()          # ← this MUST happen before loadContent() is called

    return {
        "passed": is_correct,
        "message": "Correct! Next lesson unlocked." if is_correct else "Wrong answer, try again.",
    }