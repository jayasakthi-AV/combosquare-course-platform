# models/program.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)  # e.g. "full-stack"
    title = Column(String(200), nullable=False)
    subtitle = Column(Text, nullable=True)
    hero_img = Column(String(500), nullable=True)
    duration = Column(String(100), nullable=True)        # e.g. "6 Months"
    level = Column(String(50), nullable=True)            # e.g. "Beginner"
    price = Column(Integer, default=0)                   # price in rupees
    is_active = Column(Boolean, default=True)

    # Store lists as JSON — e.g. ["React", "Node.js", "MongoDB"]
    highlights = Column(JSON, default=list)
    curriculum = Column(JSON, default=list)
    tools = Column(JSON, default=list)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationship — one program can have many enrollments
    enrollments = relationship("Enrollment", back_populates="program")

    def __repr__(self):
        return f"<Program {self.title}>"