import sys
import os
from datetime import date, timedelta

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.core.database import SessionLocal, Base, engine
from app.models.patient import Patient

def seed_database(force=False):
    """Populates the database with realistic Indian patient admission records."""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if force:
        db.query(Patient).delete()
        db.commit()

    existing_count = db.query(Patient).count()
    if existing_count > 0:
        print(f"Database already has {existing_count} records. Skipping seed.")
        db.close()
        return

    today = date.today()
    sample_patients = [
        Patient(
            name="Arjun Sharma",
            age=48,
            gender="Male",
            ward="Intensive Care Unit (ICU)",
            department="Cardiology",
            doctor="Dr. Rajesh Sharma (Cardiology)",
            admission_date=today - timedelta(days=3),
            status="Admitted",
        ),
        Patient(
            name="Priya Verma",
            age=29,
            gender="Female",
            ward="Maternity Ward",
            department="Obstetrics & Gynecology",
            doctor="Dr. Sunita Nair (Obstetrics & Gynecology)",
            admission_date=today - timedelta(days=1),
            status="Admitted",
        ),
        Patient(
            name="Rohan Joshi",
            age=9,
            gender="Male",
            ward="Pediatric Ward",
            department="Pediatrics",
            doctor="Dr. Pooja Mishra (Pediatrics)",
            admission_date=today - timedelta(days=5),
            status="Admitted",
        ),
        Patient(
            name="Sunita Devi",
            age=68,
            gender="Female",
            ward="General Ward (Female)",
            department="Neurology",
            doctor="Dr. Anjali Verma (Neurology)",
            admission_date=today - timedelta(days=8),
            status="Discharged",
        ),
        Patient(
            name="Vikram Malhotra",
            age=54,
            gender="Male",
            ward="Orthopedic Ward",
            department="Orthopedics",
            doctor="Dr. Amit Patel (Orthopedics)",
            admission_date=today - timedelta(days=2),
            status="Admitted",
        ),
        Patient(
            name="Neha Gupta",
            age=26,
            gender="Female",
            ward="Emergency Ward",
            department="Emergency Medicine",
            doctor="Dr. Priya Singh (Emergency Medicine)",
            admission_date=today,
            status="Admitted",
        ),
        Patient(
            name="Rajesh Patel",
            age=62,
            gender="Male",
            ward="Private Ward",
            department="Oncology",
            doctor="Dr. Manoj Kumar (Oncology)",
            admission_date=today - timedelta(days=14),
            status="Admitted",
        ),
        Patient(
            name="Ananya Iyer",
            age=32,
            gender="Female",
            ward="Semi-Private Ward",
            department="General Surgery",
            doctor="Dr. Vikram Malhotra (General Surgery)",
            admission_date=today - timedelta(days=4),
            status="Discharged",
        ),
        Patient(
            name="Suresh Reddy",
            age=44,
            gender="Male",
            ward="General Ward (Male)",
            department="General Medicine",
            doctor="Dr. Suresh Reddy (General Medicine)",
            admission_date=today - timedelta(days=6),
            status="Admitted",
        ),
        Patient(
            name="Meera Nambiar",
            age=65,
            gender="Female",
            ward="Cardiac CCU",
            department="Cardiology",
            doctor="Dr. Rajesh Sharma (Cardiology)",
            admission_date=today - timedelta(days=7),
            status="Discharged",
        ),
    ]

    db.add_all(sample_patients)
    db.commit()
    print(f"Successfully seeded {len(sample_patients)} realistic Indian patient records into database.")
    db.close()

if __name__ == "__main__":
    seed_database(force=True)
