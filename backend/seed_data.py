import sys
import os
from datetime import date, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, Base, engine
from app.models.patient import Patient

def seed_database():
    """Populates the database with realistic sample patient admissions."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    existing_count = db.query(Patient).count()
    if existing_count > 0:
        print(f"Database already has {existing_count} records. Skipping seed.")
        db.close()
        return

    today = date.today()
    sample_patients = [
        Patient(
            name="Alexander Wright",
            age=48,
            gender="Male",
            ward="Intensive Care Unit (ICU)",
            department="Cardiology",
            doctor="Dr. Sarah Jenkins (Cardiology)",
            admission_date=today - timedelta(days=3),
            status="Admitted",
        ),
        Patient(
            name="Eleanor Vance",
            age=34,
            gender="Female",
            ward="Maternity Ward",
            department="Gynecology & Obstetrics",
            doctor="Dr. Priya Sharma (Gynecology & Obstetrics)",
            admission_date=today - timedelta(days=1),
            status="Admitted",
        ),
        Patient(
            name="Liam Henderson",
            age=9,
            gender="Male",
            ward="Pediatric Ward",
            department="Pediatrics",
            doctor="Dr. Emily Patel (Pediatrics)",
            admission_date=today - timedelta(days=5),
            status="Admitted",
        ),
        Patient(
            name="Margaret Sullivan",
            age=72,
            gender="Female",
            ward="General Ward A",
            department="Neurology",
            doctor="Dr. Michael Chang (Neurology)",
            admission_date=today - timedelta(days=8),
            status="Discharged",
        ),
        Patient(
            name="James Thorne",
            age=55,
            gender="Male",
            ward="Orthopedic Ward",
            department="Orthopedics",
            doctor="Dr. Robert Davis (Orthopedics)",
            admission_date=today - timedelta(days=2),
            status="Admitted",
        ),
        Patient(
            name="Sophia Garcia",
            age=29,
            gender="Female",
            ward="Emergency Care Ward",
            department="Emergency Medicine",
            doctor="Dr. Rachel Martinez (Emergency Medicine)",
            admission_date=today,
            status="Admitted",
        ),
        Patient(
            name="Arthur Pendelton",
            age=63,
            gender="Male",
            ward="Oncology Ward",
            department="Oncology",
            doctor="Dr. David Kim (Oncology)",
            admission_date=today - timedelta(days=14),
            status="Admitted",
        ),
        Patient(
            name="Clara Oswald",
            age=31,
            gender="Female",
            ward="Surgical Ward",
            department="General Surgery",
            doctor="Dr. Lisa Anderson (General Surgery)",
            admission_date=today - timedelta(days=4),
            status="Discharged",
        ),
        Patient(
            name="Lucas Bennett",
            age=42,
            gender="Male",
            ward="General Ward B",
            department="General Medicine",
            doctor="Dr. James Wilson (General Medicine)",
            admission_date=today - timedelta(days=6),
            status="Admitted",
        ),
        Patient(
            name="Evelyn Harper",
            age=67,
            gender="Female",
            ward="Cardiology CCU",
            department="Cardiology",
            doctor="Dr. Sarah Jenkins (Cardiology)",
            admission_date=today - timedelta(days=7),
            status="Discharged",
        ),
    ]

    db.add_all(sample_patients)
    db.commit()
    print(f"Successfully seeded {len(sample_patients)} realistic patient records into database.")
    db.close()

if __name__ == "__main__":
    seed_database()
