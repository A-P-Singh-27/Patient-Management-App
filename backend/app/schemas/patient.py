import re
from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator, ConfigDict
from app.core.config import settings

NAME_REGEX = re.compile(r"^[A-Za-z\s]+$")

class PatientBase(BaseModel):
    name: str = Field(..., description="Patient full name (letters and spaces only)")
    age: int = Field(..., description="Patient age between 0 and 120")
    gender: str = Field(..., description="Patient gender")
    ward: str = Field(..., description="Assigned hospital ward")
    department: str = Field(..., description="Assigned clinical department")
    doctor: str = Field(..., description="Attending physician")
    admission_date: date = Field(..., description="Date of admission (cannot be in the future)")
    status: str = Field(default="Admitted", description="Admission status: Admitted or Discharged")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Patient name is required.")
        cleaned = v.strip()
        if len(cleaned) < 2:
            raise ValueError("Patient name must be at least 2 characters long.")
        if len(cleaned) > 100:
            raise ValueError("Patient name cannot exceed 100 characters.")
        if not NAME_REGEX.match(cleaned):
            raise ValueError("Patient name must contain only letters and spaces.")
        return cleaned

    @field_validator("age")
    @classmethod
    def validate_age(cls, v: int) -> int:
        if v is None:
            raise ValueError("Age is required.")
        if v < 0 or v > 120:
            raise ValueError("Age must be between 0 and 120.")
        return v

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Gender is required.")
        cleaned = v.strip()
        if cleaned not in settings.GENDERS:
            raise ValueError(f"Invalid gender '{cleaned}'. Allowed options: {', '.join(settings.GENDERS)}")
        return cleaned

    @field_validator("ward")
    @classmethod
    def validate_ward(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Ward selection is required.")
        cleaned = v.strip()
        if cleaned not in settings.WARDS:
            raise ValueError(f"Invalid ward '{cleaned}'. Allowed options: {', '.join(settings.WARDS)}")
        return cleaned

    @field_validator("department")
    @classmethod
    def validate_department(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Department selection is required.")
        cleaned = v.strip()
        if cleaned not in settings.DEPARTMENTS:
            raise ValueError(f"Invalid department '{cleaned}'. Allowed options: {', '.join(settings.DEPARTMENTS)}")
        return cleaned

    @field_validator("doctor")
    @classmethod
    def validate_doctor(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Doctor selection is required.")
        cleaned = v.strip()
        if cleaned not in settings.DOCTORS:
            raise ValueError(f"Invalid doctor '{cleaned}'. Allowed options: {', '.join(settings.DOCTORS)}")
        return cleaned

    @field_validator("admission_date", mode="before")
    @classmethod
    def validate_admission_date(cls, v) -> date:
        if v is None or (isinstance(v, str) and not v.strip()):
            raise ValueError("Admission date is required.")
        
        parsed_date = None
        if isinstance(v, str):
            clean_str = v.strip()
            try:
                if "/" in clean_str:
                    parts = clean_str.split("/")
                    if len(parts) == 3:
                        parsed_date = date(int(parts[2]), int(parts[1]), int(parts[0]))
                elif "-" in clean_str:
                    parts = clean_str.split("-")
                    if len(parts) == 3:
                        if len(parts[0]) == 4:
                            parsed_date = date(int(parts[0]), int(parts[1]), int(parts[2]))
                        else:
                            parsed_date = date(int(parts[2]), int(parts[1]), int(parts[0]))
            except Exception:
                raise ValueError(f"Invalid date format '{v}'. Please provide a valid date (YYYY-MM-DD).")
        elif isinstance(v, date):
            parsed_date = v

        if not parsed_date:
            raise ValueError(f"Invalid admission date '{v}'.")

        today = date.today()
        if parsed_date > today:
            raise ValueError(f"Admission date cannot be in the future. Selected date ({parsed_date}) is after today ({today}).")
        return parsed_date

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        if not v or not v.strip():
            return "Admitted"
        cleaned = v.strip().capitalize()
        if cleaned not in settings.STATUSES:
            raise ValueError(f"Invalid status '{cleaned}'. Allowed options: {', '.join(settings.STATUSES)}")
        return cleaned

class PatientCreate(PatientBase):
    pass

class PatientUpdate(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    ward: Optional[str] = None
    department: Optional[str] = None
    doctor: Optional[str] = None
    admission_date: Optional[date] = None
    status: Optional[str] = None

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = v.strip()
        if not cleaned:
            raise ValueError("Patient name cannot be empty.")
        if len(cleaned) < 2:
            raise ValueError("Patient name must be at least 2 characters long.")
        if len(cleaned) > 100:
            raise ValueError("Patient name cannot exceed 100 characters.")
        if not NAME_REGEX.match(cleaned):
            raise ValueError("Patient name must contain only letters and spaces.")
        return cleaned

    @field_validator("age")
    @classmethod
    def validate_age(cls, v: Optional[int]) -> Optional[int]:
        if v is None:
            return v
        if v < 0 or v > 120:
            raise ValueError("Age must be between 0 and 120.")
        return v

    @field_validator("gender")
    @classmethod
    def validate_gender(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = v.strip()
        if cleaned not in settings.GENDERS:
            raise ValueError(f"Invalid gender '{cleaned}'.")
        return cleaned

    @field_validator("ward")
    @classmethod
    def validate_ward(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = v.strip()
        if cleaned not in settings.WARDS:
            raise ValueError(f"Invalid ward '{cleaned}'.")
        return cleaned

    @field_validator("department")
    @classmethod
    def validate_department(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = v.strip()
        if cleaned not in settings.DEPARTMENTS:
            raise ValueError(f"Invalid department '{cleaned}'.")
        return cleaned

    @field_validator("doctor")
    @classmethod
    def validate_doctor(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = v.strip()
        if cleaned not in settings.DOCTORS:
            raise ValueError(f"Invalid doctor '{cleaned}'.")
        return cleaned

    @field_validator("admission_date", mode="before")
    @classmethod
    def validate_admission_date(cls, v) -> Optional[date]:
        if v is None or (isinstance(v, str) and not v.strip()):
            return None
        
        parsed_date = None
        if isinstance(v, str):
            clean_str = v.strip()
            try:
                if "/" in clean_str:
                    parts = clean_str.split("/")
                    if len(parts) == 3:
                        parsed_date = date(int(parts[2]), int(parts[1]), int(parts[0]))
                elif "-" in clean_str:
                    parts = clean_str.split("-")
                    if len(parts) == 3:
                        if len(parts[0]) == 4:
                            parsed_date = date(int(parts[0]), int(parts[1]), int(parts[2]))
                        else:
                            parsed_date = date(int(parts[2]), int(parts[1]), int(parts[0]))
            except Exception:
                raise ValueError(f"Invalid date format '{v}'. Please provide a valid date (YYYY-MM-DD).")
        elif isinstance(v, date):
            parsed_date = v

        if not parsed_date:
            raise ValueError(f"Invalid admission date '{v}'.")

        today = date.today()
        if parsed_date > today:
            raise ValueError(f"Admission date cannot be in the future. Selected date ({parsed_date}) is after today ({today}).")
        return parsed_date

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = v.strip().capitalize()
        if cleaned not in settings.STATUSES:
            raise ValueError(f"Invalid status '{cleaned}'. Allowed options: {', '.join(settings.STATUSES)}")
        return cleaned

class PatientStatusUpdate(BaseModel):
    status: str = Field(..., description="Admitted or Discharged")

    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        cleaned = v.strip().capitalize()
        if cleaned not in settings.STATUSES:
            raise ValueError(f"Invalid status '{cleaned}'. Allowed options: {', '.join(settings.STATUSES)}")
        return cleaned

class PatientResponse(BaseModel):
    id: int
    name: str
    age: int
    gender: str
    ward: str
    department: str
    doctor: str
    admission_date: date
    status: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)

class PatientStats(BaseModel):
    total_patients: int
    admitted_patients: int
    discharged_patients: int
    total_departments: int
    total_wards: int

class MetadataResponse(BaseModel):
    genders: List[str]
    wards: List[str]
    departments: List[str]
    doctors: List[str]
    statuses: List[str]
