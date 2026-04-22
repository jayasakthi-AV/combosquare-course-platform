from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Quiz(Base):
    __tablename__ = "quizzes"
    __table_args__ = {"extend_existing": True}  # 🔥 ADD THIS

    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"))

    question = Column(String)
    option1 = Column(String)
    option2 = Column(String)
    option3 = Column(String)
    option4 = Column(String)

    answer = Column(String)