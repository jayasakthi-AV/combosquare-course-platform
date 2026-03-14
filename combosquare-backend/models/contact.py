# models/contact.py
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from datetime import datetime
from database import Base


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False)
    mobile = Column(String(20), nullable=True)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)        # admin can mark as read
    is_resolved = Column(Boolean, default=False)    # admin can mark as resolved
    submitted_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<ContactSubmission from {self.email}>"