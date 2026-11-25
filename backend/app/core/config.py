import os
from typing import List, Union
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

_BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(_BACKEND_DIR, ".env"))

_DEFAULT_DB_PATH = os.path.join(_BACKEND_DIR, "patients.db").replace("\\", "/")

def _resolve_database_url() -> str:
    raw = os.getenv("DATABASE_URL", "")
    if not raw or raw.strip() == "":
        return f"sqlite:///{_DEFAULT_DB_PATH}"
    if raw.startswith("sqlite:///./"):
        sub = raw[len("sqlite:///./"):]
        return f"sqlite:///{os.path.join(_BACKEND_DIR, sub).replace('\\', '/')}"
    return raw

class Settings(BaseSettings):
    PROJECT_NAME: str = "Dscribe Hospital Patient Admission Management API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = _resolve_database_url()
    ALLOWED_ORIGINS: str = ""

    @property
    def cors_origins(self) -> List[str]:
        raw = self.ALLOWED_ORIGINS or os.getenv("ALLOWED_ORIGINS", "")
        if not raw or not raw.strip():
            return []
        return [x.strip() for x in raw.split(",") if x.strip()]

    GENDERS: List[str] = ["Male", "Female", "Other"]

    WARDS: List[str] = [
        "General Ward (Male)",
        "General Ward (Female)",
        "Intensive Care Unit (ICU)",
        "Emergency Ward",
        "Pediatric Ward",
        "Maternity Ward",
        "Private Ward",
        "Semi-Private Ward",
        "Cardiac CCU",
        "Orthopedic Ward"
    ]

    DEPARTMENTS: List[str] = [
        "General Medicine",
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Obstetrics & Gynecology",
        "General Surgery",
        "Emergency Medicine",
        "Oncology"
    ]

    DOCTORS: List[str] = [
        "Dr. Rajesh Sharma (Cardiology)",
        "Dr. Anjali Verma (Neurology)",
        "Dr. Amit Patel (Orthopedics)",
        "Dr. Pooja Mishra (Pediatrics)",
        "Dr. Suresh Reddy (General Medicine)",
        "Dr. Sunita Nair (Obstetrics & Gynecology)",
        "Dr. Vikram Malhotra (General Surgery)",
        "Dr. Priya Singh (Emergency Medicine)",
        "Dr. Manoj Kumar (Oncology)"
    ]

    STATUSES: List[str] = ["Admitted", "Discharged"]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
