from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.config import settings
from app.schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientStatusUpdate,
    PatientResponse,
    PatientStats,
    MetadataResponse,
)
from app.crud import patient as patient_crud

router = APIRouter()

@router.get("/metadata", response_model=MetadataResponse)
def get_metadata():
    """Returns predefined options for Gender, Ward, Department, Doctor, Status"""
    return {
        "genders": settings.GENDERS,
        "wards": settings.WARDS,
        "departments": settings.DEPARTMENTS,
        "doctors": settings.DOCTORS,
        "statuses": settings.STATUSES,
    }

@router.get("/stats", response_model=PatientStats)
def get_patient_statistics(db: Session = Depends(get_db)):
    """Returns statistical metrics for dashboard header cards"""
    return patient_crud.get_stats(db)

@router.get("/patients", response_model=List[PatientResponse])
def read_patients(
    search: Optional[str] = Query(None, description="Search patients by name"),
    ward: Optional[str] = Query(None, description="Filter by ward name"),
    department: Optional[str] = Query(None, description="Filter by department"),
    doctor: Optional[str] = Query(None, description="Filter by doctor"),
    status: Optional[str] = Query(None, description="Filter by status (Admitted/Discharged)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(200, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """Retrieve all patients with optional search and multi-criteria filters"""
    return patient_crud.get_patients(
        db,
        search=search,
        ward=ward,
        department=department,
        doctor=doctor,
        status=status,
        skip=skip,
        limit=limit,
    )

@router.get("/patients/{patient_id}", response_model=PatientResponse)
def read_patient(patient_id: int, db: Session = Depends(get_db)):
    """Retrieve a single patient record by ID"""
    patient = patient_crud.get_patient(db, patient_id=patient_id)
    if not patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found."
        )
    return patient

@router.post("/patients", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
def create_new_patient(patient_in: PatientCreate, db: Session = Depends(get_db)):
    """Register and admit a new patient"""
    return patient_crud.create_patient(db=db, patient_in=patient_in)

@router.put("/patients/{patient_id}", response_model=PatientResponse)
def update_existing_patient(
    patient_id: int,
    patient_in: PatientUpdate,
    db: Session = Depends(get_db)
):
    """Update details of an existing patient"""
    db_patient = patient_crud.get_patient(db, patient_id=patient_id)
    if not db_patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found."
        )
    return patient_crud.update_patient(db=db, db_patient=db_patient, patient_in=patient_in)

@router.patch("/patients/{patient_id}/status", response_model=PatientResponse)
def update_status(
    patient_id: int,
    status_in: PatientStatusUpdate,
    db: Session = Depends(get_db)
):
    """Mark patient status (e.g., mark as Discharged or Admitted)"""
    db_patient = patient_crud.get_patient(db, patient_id=patient_id)
    if not db_patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found."
        )
    return patient_crud.update_patient_status(db=db, db_patient=db_patient, status=status_in.status)

@router.patch("/patients/{patient_id}/discharge", response_model=PatientResponse)
def discharge_patient_endpoint(
    patient_id: int,
    db: Session = Depends(get_db)
):
    """Convenience endpoint to directly mark a patient as Discharged"""
    db_patient = patient_crud.get_patient(db, patient_id=patient_id)
    if not db_patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found."
        )
    if db_patient.status == "Discharged":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Patient '{db_patient.name}' is already discharged."
        )
    return patient_crud.update_patient_status(db=db, db_patient=db_patient, status="Discharged")

@router.delete("/patients/{patient_id}", status_code=status.HTTP_200_OK)
def delete_patient_record(patient_id: int, db: Session = Depends(get_db)):
    """Permanently delete a patient record"""
    db_patient = patient_crud.get_patient(db, patient_id=patient_id)
    if not db_patient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Patient with ID {patient_id} not found."
        )
    patient_name = db_patient.name
    patient_crud.delete_patient(db=db, db_patient=db_patient)
    return {"message": f"Patient '{patient_name}' (ID: {patient_id}) has been successfully deleted."}
