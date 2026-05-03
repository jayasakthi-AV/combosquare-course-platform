from sqlalchemy import Column, Integer, String, ForeignKey,Boolean
from database import Base

# models/lesson.py
class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True)
    module_id = Column(Integer, ForeignKey("modules.id"))
    title = Column(String)
    video_url = Column(String)
    order = Column(Integer, default=0)
    unlocked = Column(Boolean, default=False)  # ← must exist!