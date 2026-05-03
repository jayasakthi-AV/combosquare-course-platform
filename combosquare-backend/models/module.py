from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Module(Base):
    __tablename__ = "modules"

    id = Column(Integer, primary_key=True)
    title = Column(String)
    course_id = Column(Integer, ForeignKey("programs.id"))
    order = Column(Integer, default=0)