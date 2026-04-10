# models/enrollment.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Enrollment(Base):
    __tablename__ = "enrollments"

    id = Column(Integer, primary_key=True, index=True)

    # Foreign keys — links to users and programs tables
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)

    # Enrollment details
    status = Column(String(50), default="active")       # active, completed, dropped
    progress = Column(Float, default=0.0)               # 0.0 to 100.0 percentage
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships — lets us do enrollment.user and enrollment.program
    user = relationship("User", back_populates="enrollments")
    program = relationship("Program", back_populates="enrollments")

    def __repr__(self):
        return f"<Enrollment user={self.user_id} program={self.program_id}>"