# database.py
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# Create the database engine
# pool_pre_ping=True means SQLAlchemy will test the connection before using it
# This prevents "connection lost" errors after idle time
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,          # max 10 connections in pool
    max_overflow=20        # allow 20 extra connections under heavy load
)

# Each request gets its own database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# All models will inherit from this Base class
Base = declarative_base()


# ─── Dependency ───────────────────────────────────────────────
# This function is used in every router with Depends(get_db)
# It gives a DB session to the route, then closes it automatically
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()