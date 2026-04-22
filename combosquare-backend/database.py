# database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from config import settings

# 🔥 SQLite Database URL (from .env)
# Example: sqlite:///./test.db

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}  # ✅ required for SQLite
)

# Session configuration
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
Base = declarative_base()


# ─── Dependency ───────────────────────────────────────────────
# Used in routes: Depends(get_db)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()