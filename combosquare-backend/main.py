# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import SessionLocal
from models.user import User
from core.security import hash_password

from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.programs import router as programs_router
from routers.enrollments import router as enrollments_router
from routers.contact import router as contact_router
from routers.admin import router as admin_router
from routers.dashboard import router as dashboard_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="ComboSquare Educational Platform API"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(programs_router)
app.include_router(enrollments_router)
app.include_router(contact_router)
app.include_router(admin_router)
app.include_router(dashboard_router)


# ─── Auto Create Default Admin on Startup ─────────────────────
@app.on_event("startup")
def create_default_admin():
    """
    When server starts — check if any admin exists.
    If no admin found → create default admin automatically.
    This runs ONCE on first startup, skips if admin already exists.
    """
    db = SessionLocal()
    try:
        existing_admin = db.query(User).filter(User.role == "admin").first()
        if not existing_admin:
            default_admin = User(
                full_name="Admin",
                email=settings.ADMIN_EMAIL,
                mobile=None,
                hashed_password=hash_password(settings.ADMIN_PASSWORD),
                role="admin",
                is_active=True
            )
            db.add(default_admin)
            db.commit()
            print(f"✅ Default admin created: {settings.ADMIN_EMAIL}")
        else:
            print(f"✅ Admin already exists: {existing_admin.email}")
    finally:
        db.close()


@app.get("/")
def root():
    return {
        "message": f"{settings.APP_NAME} is running!",
        "version": settings.APP_VERSION,
        "status": "online"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy"}