# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings

# ─── Import Routers ───────────────────────────────────────────
from routers.auth import router as auth_router
from routers.users import router as users_router
from routers.programs import router as programs_router
from routers.enrollments import router as enrollments_router    # ← ADD
from routers.contact import router as contact_router            # ← ADD
from routers.admin import router as admin_router  
from routers.dashboard import router as dashboard_router   


# ─── App Setup ────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="ComboSquare Educational Platform API"
)

# ─── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Register Routers ─────────────────────────────────────────
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(programs_router)
app.include_router(enrollments_router)                          # ← ADD
app.include_router(contact_router)  
app.include_router(admin_router)  
app.include_router(dashboard_router)                          # ← ADD


# ─── Health Check ─────────────────────────────────────────────
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