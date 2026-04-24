from fastapi import APIRouter, Request, Depends
import razorpay
import hmac
import hashlib
from sqlalchemy.orm import Session
from database import get_db
from models.enrollment import Enrollment
from models.program import Program
from core.dependencies import get_current_user   # or wherever it is

router = APIRouter()

client = razorpay.Client(auth=(
    "rzp_test_SfOQxmW8B0EaiE",
    "VU0Kr7zHJ8KP3GCfT5ECccxS"
))



from pydantic import BaseModel

class OrderRequest(BaseModel):
    course_id: int

@router.post("/create-order")
async def create_order(request: Request):
    data = await request.json()
    print("REQUEST DATA:", data)

    course_id = data.get("course_id")

    if not course_id:
        return {"error": "course_id missing"}

    order = client.order.create({
        "amount": 499 * 100,
        "currency": "INR",
        "payment_capture": 1
    })

    return {
        "key_id": "rzp_test_SfOQxmW8B0EaiE",
        "amount": order["amount"],
        "currency": order["currency"],
        "order_id": order["id"],
        "program_id": course_id
    }
@router.post("/verify")
async def verify(
    request: Request,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    data = await request.json()

    generated_signature = hmac.new(
        b"VU0Kr7zHJ8KP3GCfT5ECccxS",
        (data['razorpay_order_id'] + "|" + data['razorpay_payment_id']).encode(),
        hashlib.sha256
    ).hexdigest()

    if generated_signature == data['razorpay_signature']:

        program_id = int(data.get("program_id"))
        user_id = current_user.id   # ✅ FIXED

        existing = db.query(Enrollment).filter_by(
            user_id=user_id,
            program_id=program_id
        ).first()

        if not existing:
            new_enrollment = Enrollment(
                user_id=user_id,
                program_id=program_id,
                status="active",
                progress=0.0
            )
            db.add(new_enrollment)
            db.commit()

        return {"status": "success"}

    return {"status": "failed"}