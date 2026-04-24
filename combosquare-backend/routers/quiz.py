from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.progress import Progress
from core.dependencies import get_current_user

router = APIRouter()

# 🔥 TEMP QUIZ DATA (later you can move to DB)
QUIZ_DATA = {
    1: {
        "question": "What does CSS stand for?",
        "options": [
            "Cascading Style Sheets",
            "Computer Style Sheets",
            "Creative Style System",
            "Colorful Style Sheets"
        ],
        "answer": "Cascading Style Sheets"
    },
    2: {
        "question": "Which tag is used for HTML?",
        "options": ["<html>", "<css>", "<js>", "<python>"],
        "answer": "<html>"
    }
}

# ✅ GET QUIZ
@router.get("/lesson/{lesson_id}")
def get_quiz(lesson_id: int):
    return {
        "question": f"What is lesson {lesson_id} about?",
        "options": [
            "Correct Answer",
            "Wrong 1",
            "Wrong 2",
            "Wrong 3"
        ],
        "answer": "Correct Answer"
    }


# ✅ SUBMIT QUIZ
@router.post("/submit")
def submit_quiz(
    lesson_id: int,
    answer: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # 🔥 TEMP: allow all lessons
    correct_answer = "Correct Answer"

    is_correct = answer == correct_answer

    progress = db.query(Progress).filter_by(
        user_id=current_user.id,
        lesson_id=lesson_id
    ).first()

    if progress:
        progress.quiz_passed = is_correct
        db.commit()

    return {"passed": is_correct}