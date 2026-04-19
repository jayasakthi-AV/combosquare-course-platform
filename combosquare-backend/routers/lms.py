from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def lms_home():
    return {"message": "LMS working 🚀"}