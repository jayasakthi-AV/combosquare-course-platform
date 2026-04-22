# main.py — updated version
# Add these lines to your existing main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from config import settings
from database import SessionLocal
from models.user import User
from core.security import hash_password
import os
from routers import progress
from routers import quiz

from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.programs import router as programs_router
from routers.enrollments import router as enrollments_router
from routers.contact import router as contact_router
from routers.admin import router as admin_router
from routers.dashboard import router as dashboard_router

# ── NEW ──
from routers.lms import router as lms_router
from routers import payment
from database import Base, engine
from routers import certificate





app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="ComboSquare Educational Platform API v2 — Full LMS"
)
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 🔥 TEMPORARY FIX (100% works)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Serve certificate PDFs as static files
os.makedirs("static/certificates", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(payment.router, prefix="/payment")

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(programs_router)
app.include_router(enrollments_router)
app.include_router(contact_router)
app.include_router(admin_router)
app.include_router(dashboard_router)

# ── NEW: all LMS routes under /api/lms ──
app.include_router(lms_router, prefix="/api/lms")
app.include_router(payment.router, prefix="/api/payment")
app.include_router(progress.router, prefix="/api/progress")
app.include_router(quiz.router, prefix="/api/quiz", tags=["Quiz"])
app.include_router(certificate.router, prefix="/api/certificate")


@app.on_event("startup")
def create_default_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.role == "admin").first()
        if not existing:
            admin = User(
                full_name       = "Admin",
                email           = settings.ADMIN_EMAIL,
                hashed_password = hash_password(settings.ADMIN_PASSWORD),
                role            = "admin",
                is_active       = True,
            )
            db.add(admin)
            db.commit()
            print(f"✅ Default admin created: {settings.ADMIN_EMAIL}")
    finally:
        db.close()


@app.get("/")
def root():
    return {"message": f"{settings.APP_NAME} v{settings.APP_VERSION}", "status": "online"}

@app.get("/api/health")
def health():
    return {"status": "healthy"}
