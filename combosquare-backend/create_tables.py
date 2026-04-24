# create_tables.py

from database import engine, Base

# Import all models so Base knows about them
from models import User, Program, Enrollment, ContactSubmission
from models.lms import (
    Course, Module, Lesson, Quiz, QuizQuestion,
    CourseEnrollment, LessonProgress, Payment, QuizAttempt
)
from models.progress import Progress   # 🔥 MUST ADD
from models.quiz import Quiz



print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("✅ All tables created successfully!")
print("\nTables created:")
for table in Base.metadata.tables.keys():
    print(f"  - {table}")