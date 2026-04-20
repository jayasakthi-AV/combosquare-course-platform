from fastapi import APIRouter, Request, Depends
import razorpay
import hmac
import hashlib
from sqlalchemy.orm import Session
from database import get_db
from models.enrollment import Enrollment

router = APIRouter()

client = razorpay.Client(auth=(
    "rzp_test_SfOQxmW8B0EaiE",
    "VU0Kr7zHJ8KP3GCfT5ECccxS"
))


@router.post("/create-order")
def create_order(data: dict):
    amount = 499
    program_id = data.get("course_id")

    order = client.order.create({
        "amount": amount * 100,
        "currency": "INR",
        "payment_capture": 1
    })

    return {
        "key_id": "rzp_test_SfOQxmW8B0EaiE",
        "amount": order["amount"],
        "currency": order["currency"],
        "order_id": order["id"],
        "program_id": program_id   # ✅ correct
    }


@router.post("/verify")
async def verify(request: Request, db: Session = Depends(get_db)):
    data = await request.json()

    generated_signature = hmac.new(
        b"VU0Kr7zHJ8KP3GCfT5ECccxS",
        (data['razorpay_order_id'] + "|" + data['razorpay_payment_id']).encode(),
        hashlib.sha256
    ).hexdigest()

    if generated_signature == data['razorpay_signature']:

        # ✅ FIXED
        program_id = int(data.get("program_id"))  # convert to int
        user_id = 1

        print("PROGRAM ID:", program_id)  # debug

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