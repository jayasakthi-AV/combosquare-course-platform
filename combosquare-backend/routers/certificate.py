from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.enrollment import Enrollment
from models.program import Program
from models.progress import Progress
from core.dependencies import get_current_user
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import os
from datetime import datetime

router = APIRouter()

@router.get("/generate/{program_id}")
def generate_certificate(
    program_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    user_id = current_user.id

    # ✅ check enrollment
    enrollment = db.query(Enrollment).filter_by(
        user_id=user_id,
        program_id=program_id
    ).first()

    if not enrollment:
        return {"error": "Not enrolled"}

    # ✅ check completion
    progress = db.query(Progress).filter_by(user_id=user_id).all()

    if not all(p.quiz_passed for p in progress):
        return {"error": "Complete all lessons"}

    program = db.query(Program).filter_by(id=program_id).first()

    os.makedirs("static/certificates", exist_ok=True)

    file_path = f"static/certificates/{user_id}_{program_id}.pdf"

    doc = SimpleDocTemplate(file_path)
    styles = getSampleStyleSheet()

    content = []

    content.append(Paragraph("🎓 Certificate of Completion", styles['Title']))
    content.append(Paragraph(f"Student: {current_user.full_name}", styles['Normal']))
    content.append(Paragraph(f"Course: {program.title}", styles['Normal']))
    content.append(Paragraph(f"Date: {datetime.now().strftime('%Y-%m-%d')}", styles['Normal']))

    doc.build(content)

    return {
        "certificate_url": f"http://127.0.0.1:8001/{file_path}"
    }