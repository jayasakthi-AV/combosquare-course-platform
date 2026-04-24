from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    video_url = Column(String)
    module_id = Column(Integer, ForeignKey("modules.id"))