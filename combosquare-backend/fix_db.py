# fix_db.py
from database import engine
from sqlalchemy import text

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student' NOT NULL"))
    conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW()"))
    conn.commit()
    print("Columns added successfully!")

    # Verify
    result = conn.execute(text("SELECT column_name FROM information_schema.columns WHERE table_name='users' ORDER BY ordinal_position"))
    print("\nUsers table columns:")
    for row in result:
        print(" -", row[0])