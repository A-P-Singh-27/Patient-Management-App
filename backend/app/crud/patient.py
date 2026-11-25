from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate

def get_patient(db: Session, patient_id: int) -> Optional[Patient]:
    return db.query(Patient).filter(Patient.id == patient_id).first()

def get_patients(
    db: Session,
    search: Optional[str] = None,
    ward: Optional[str] = None,
    department: Optional[str] = None,
    doctor: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 500,
) -> List[Patient]:
    query = db.query(Patient)

    if search and isinstance(search, str) and search.strip():
        search_term = f"%{search.strip().lower()}%"
        query = query.filter(func.lower(Patient.name).like(search_term))

    if ward and isinstance(ward, str) and ward.strip() and ward.lower() != "all":
        query = query.filter(Patient.ward == ward.strip())

    if department and isinstance(department, str) and department.strip() and department.lower() != "all":
        query = query.filter(Patient.department == department.strip())

    if doctor and isinstance(doctor, str) and doctor.strip() and doctor.lower() != "all":
        query = query.filter(Patient.doctor == doctor.strip())

    if status and isinstance(status, str) and status.strip() and status.lower() != "all":
        query = query.filter(Patient.status == status.strip().capitalize())

    if not isinstance(skip, int):
        skip = 0
    if not isinstance(limit, int):
        limit = 500

    return query.order_by(Patient.id.desc()).offset(skip).limit(limit).all()

def create_patient(db: Session, patient_in: PatientCreate) -> Patient:
    patient_data = patient_in.model_dump()
    db_patient = Patient(**patient_data)
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def update_patient(db: Session, db_patient: Patient, patient_in: PatientUpdate) -> Patient:
    update_data = patient_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if value is not None:
            setattr(db_patient, field, value)
    db.commit()
    db.refresh(db_patient)
    return db_patient

def update_patient_status(db: Session, db_patient: Patient, status: str) -> Patient:
    db_patient.status = status
    db.commit()
    db.refresh(db_patient)
    return db_patient

def delete_patient(db: Session, db_patient: Patient) -> None:
    db.delete(db_patient)
    db.commit()

def get_stats(db: Session) -> dict:
    total = db.query(Patient).count()
    admitted = db.query(Patient).filter(Patient.status == "Admitted").count()
    discharged = db.query(Patient).filter(Patient.status == "Discharged").count()
    departments_count = db.query(func.count(func.distinct(Patient.department))).scalar() or 0
    wards_count = db.query(func.count(func.distinct(Patient.ward))).scalar() or 0

    return {
        "total_patients": total,
        "admitted_patients": admitted,
        "discharged_patients": discharged,
        "total_departments": departments_count,
        "total_wards": wards_count,
    }
