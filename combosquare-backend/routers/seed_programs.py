# seed_programs.py
from database import SessionLocal
from models.program import Program

db = SessionLocal()

programs = [
    {
        "slug": "full-stack",
        "title": "Full Stack Developer Program",
        "subtitle": "Master frontend + backend with real-world projects and industry mentorship.",
        "hero_img": "/images/hero/web.png",
        "duration": "6 Months",
        "level": "Beginner",
        "price": 0,
        "highlights": ["6-Month Guided Learning", "10+ Real Development Projects", "1:1 Doubt Support", "Placement Assistance", "Beginner Friendly", "Certification Included"],
        "curriculum": ["HTML, CSS & JavaScript Fundamentals", "React + UI Development", "Backend with Node.js", "Databases (MongoDB / SQL)", "Full-Stack Capstone Project"],
        "tools": ["React", "Node.js", "MongoDB", "GitHub", "TailwindCSS"]
    },
    {
        "slug": "ai-foundations",
        "title": "AI Foundations",
        "subtitle": "Learn the fundamentals of Artificial Intelligence and Machine Learning.",
        "hero_img": "/images/hero/ai.png",
        "duration": "3 Months",
        "level": "Beginner",
        "price": 0,
        "highlights": ["Beginner Friendly", "Neural Network Foundations", "Hands-on Python Labs", "Industry Projects", "Career Mentorship", "Certification Included"],
        "curriculum": ["Python for AI", "Math for Machine Learning", "Neural Networks 101", "Intro to Machine Learning", "AI Mini Projects"],
        "tools": ["Python", "NumPy", "Pandas", "TensorFlow", "Jupyter Notebook"]
    },
    {
        "slug": "data-science",
        "title": "Data Science Starter",
        "subtitle": "Build strong foundations in data analytics, visualization and ML basics.",
        "hero_img": "/images/hero/data.png",
        "duration": "4 Months",
        "level": "Beginner",
        "price": 0,
        "highlights": ["Hands-on Data Projects", "Excel + SQL Training", "Data Visualization Mastery", "Real Datasets Practice", "Career Guidance", "Certification Included"],
        "curriculum": ["Excel + SQL for Analytics", "Python for Data Science", "Statistics & Probability", "Data Visualization", "Basic Machine Learning Models"],
        "tools": ["Python", "Power BI", "Excel", "SQL", "Matplotlib"]
    },
    {
        "slug": "ui-ux",
        "title": "UI/UX Design Essentials",
        "subtitle": "Learn design thinking, wireframing, prototyping and brand design.",
        "hero_img": "/images/hero/ui.png",
        "duration": "2 Months",
        "level": "Beginner",
        "price": 0,
        "highlights": ["Figma Mastery", "Real Design Projects", "Portfolio Building", "Creative Thinking", "Beginner Friendly", "Certification Included"],
        "curriculum": ["UI/UX Foundations", "Wireframes & User Flows", "Figma Tools", "Interactive Prototypes", "Portfolio Project"],
        "tools": ["Figma", "Canva", "Illustrator"]
    }
]

print("Seeding programs...")
for p in programs:
    existing = db.query(Program).filter(Program.slug == p["slug"]).first()
    if not existing:
        db.add(Program(**p))
        print(f"  Added: {p['title']}")
    else:
        print(f"  Skipped (already exists): {p['title']}")

db.commit()
db.close()
print("\nDone! Programs are now in the database.")