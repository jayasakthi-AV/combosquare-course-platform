# writer.py
code = """from database import SessionLocal
from models.program import Program

db = SessionLocal()

programs = [
    {
        "slug": "full-stack",
        "title": "Full Stack Developer Program",
        "subtitle": "Master frontend + backend with real-world projects.",
        "hero_img": "/images/hero/web.png",
        "duration": "6 Months",
        "level": "Beginner",
        "price": 0,
        "highlights": ["6-Month Guided Learning", "10+ Real Projects", "1:1 Doubt Support", "Placement Assistance", "Certification Included"],
        "curriculum": ["HTML, CSS and JavaScript", "React + UI Development", "Backend with Node.js", "Databases", "Capstone Project"],
        "tools": ["React", "Node.js", "MongoDB", "GitHub", "TailwindCSS"]
    },
    {
        "slug": "ai-foundations",
        "title": "AI Foundations",
        "subtitle": "Learn the fundamentals of AI and Machine Learning.",
        "hero_img": "/images/hero/ai.png",
        "duration": "3 Months",
        "level": "Beginner",
        "price": 0,
        "highlights": ["Beginner Friendly", "Neural Network Foundations", "Hands-on Python Labs", "Certification Included"],
        "curriculum": ["Python for AI", "Math for ML", "Neural Networks 101", "Intro to ML", "AI Mini Projects"],
        "tools": ["Python", "NumPy", "Pandas", "TensorFlow"]
    },
    {
        "slug": "data-science",
        "title": "Data Science Starter",
        "subtitle": "Build foundations in data analytics and ML basics.",
        "hero_img": "/images/hero/data.png",
        "duration": "4 Months",
        "level": "Beginner",
        "price": 0,
        "highlights": ["Hands-on Data Projects", "Excel + SQL Training", "Data Visualization", "Certification Included"],
        "curriculum": ["Excel + SQL", "Python for Data Science", "Statistics", "Data Visualization", "Basic ML Models"],
        "tools": ["Python", "Power BI", "Excel", "SQL"]
    },
    {
        "slug": "ui-ux",
        "title": "UI/UX Design Essentials",
        "subtitle": "Learn design thinking, wireframing and prototyping.",
        "hero_img": "/images/hero/ui.png",
        "duration": "2 Months",
        "level": "Beginner",
        "price": 0,
        "highlights": ["Figma Mastery", "Real Design Projects", "Portfolio Building", "Certification Included"],
        "curriculum": ["UI/UX Foundations", "Wireframes", "Figma Tools", "Prototypes", "Portfolio Project"],
        "tools": ["Figma", "Canva", "Illustrator"]
    }
]

print("Seeding programs...")
for p in programs:
    existing = db.query(Program).filter(Program.slug == p["slug"]).first()
    if not existing:
        db.add(Program(**p))
        print("  Added:", p["title"])
    else:
        print("  Skipped:", p["title"])

db.commit()
db.close()
print("Done! Programs are now in the database.")
"""

with open("seed_programs.py", "w") as f:
    f.write(code)

print("seed_programs.py written successfully!")