# make_admin.py
from database import SessionLocal
from models.user import User

db = SessionLocal()

# Change this email to your actual registered email
ADMIN_EMAIL = "madhu12@gmail.com"

user = db.query(User).filter(User.email == ADMIN_EMAIL).first()

if not user:
    print(f"No user found with email: {ADMIN_EMAIL}")
    print("Please signup first, then run this script again.")
else:
    user.role = "admin"
    db.commit()
    print(f"Success! {user.full_name} ({user.email}) is now an admin.")

db.close()