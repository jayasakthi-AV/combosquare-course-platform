from fastapi import APIRouter, Request, Depends, HTTPException
import razorpay
import hmac
import hashlib
from sqlalchemy.orm import Session
from database import get_db
from models.enrollment import Enrollment
from models.program import Program
from core.dependencies import get_current_user

router = APIRouter()

RAZORPAY_KEY_ID     = "rzp_test_SfOQxmW8B0EaiE"
RAZORPAY_KEY_SECRET = "VU0Kr7zHJ8KP3GCfT5ECccxS"

client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


# ── Create Order ──────────────────────────────────────────────────
@router.post("/create-order")
async def create_order(
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)   # ← secured
):
    data = await request.json()
    course_id = data.get("course_id")

    if not course_id:
        raise HTTPException(status_code=400, detail="course_id missing")

    # Check course exists
    program = db.query(Program).filter_by(id=course_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Course not found")

    # Check already enrolled
    existing = db.query(Enrollment).filter_by(
        user_id=current_user.id,
        program_id=course_id
    ).first()
    if existing:
        return {"already_enrolled": True, "slug": program.slug}

    order = client.order.create({
        "amount": 499 * 100,       # paise
        "currency": "INR",
        "payment_capture": 1
    })

    return {
        "key_id"    : RAZORPAY_KEY_ID,
        "amount"    : order["amount"],
        "currency"  : order["currency"],
        "order_id"  : order["id"],
        "program_id": course_id,
        "slug"      : program.slug,
    }


# ── Verify Payment ────────────────────────────────────────────────
@router.post("/verify")
async def verify(
    request: Request,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    data = await request.json()

    # ── Signature verification ─────────────────────────────────────
    msg = f"{data['razorpay_order_id']}|{data['razorpay_payment_id']}"
    
    generated_signature = hmac.new(          # ✅ correct
        RAZORPAY_KEY_SECRET.encode("utf-8"), # key must be bytes
        msg.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    if generated_signature != data.get("razorpay_signature"):
        raise HTTPException(status_code=400, detail="Invalid payment signature")

    # ── Enroll user ────────────────────────────────────────────────
    program_id = int(data.get("program_id"))

    existing = db.query(Enrollment).filter_by(
        user_id=current_user.id,
        program_id=program_id
    ).first()

    if not existing:
        db.add(Enrollment(
            user_id=current_user.id,
            program_id=program_id,
            status="active",
            progress=0.0
        ))
        db.commit()

    # Get slug to return to frontend
    program = db.query(Program).filter_by(id=program_id).first()

    return {"status": "success", "slug": program.slug if program else ""}