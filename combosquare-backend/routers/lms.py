from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from database import get_db
from models.enrollment import Enrollment
from models.program import Program

router = APIRouter()

@router.get("/")
def lms_home():
    return {"message": "LMS working 🚀"}
@router.get("/courses/{slug}")
def get_course(slug: str, db: Session = Depends(get_db)):

    from models.program import Program
    from models.enrollment import Enrollment

    program = db.query(Program).filter_by(slug=slug).first()

    user_id = 1

    enrollments = db.query(Enrollment).all()
    print("ALL ENROLLMENTS:", enrollments)

    enrollment = db.query(Enrollment).filter_by(
        user_id=user_id,
        program_id=program.id
    ).first()

    print("PROGRAM ID:", program.id)
    print("FOUND ENROLLMENT:", enrollment)

    return {
        "id": program.id,
        "title": program.title,
        "price": program.price,
        "is_enrolled": True if enrollment else False
    }