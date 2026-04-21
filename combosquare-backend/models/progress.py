from sqlalchemy import Column, Integer, Boolean
from database import Base

class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    lesson_id = Column(Integer)

    progress = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    quiz_passed = Column(Boolean, default=False) 