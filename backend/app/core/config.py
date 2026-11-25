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
    PROJECT_NAME: str = "Hospital Patient Admission Management API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = _resolve_database_url()
    ALLOWED_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    @property
    def cors_origins(self) -> List[str]:
        if isinstance(self.ALLOWED_ORIGINS, str):
            return [x.strip() for x in self.ALLOWED_ORIGINS.split(",") if x.strip()]
        return self.ALLOWED_ORIGINS

    GENDERS: List[str] = ["Male", "Female", "Other"]

    WARDS: List[str] = [
        "General Ward A",
        "General Ward B",
        "Intensive Care Unit (ICU)",
        "Emergency Care Ward",
        "Pediatric Ward",
        "Maternity Ward",
        "Surgical Ward",
        "Oncology Ward",
        "Cardiology CCU",
        "Orthopedic Ward"
    ]

    DEPARTMENTS: List[str] = [
        "Cardiology",
        "Neurology",
        "Orthopedics",
        "Pediatrics",
        "Oncology",
        "General Medicine",
        "General Surgery",
        "Emergency Medicine",
        "Gynecology & Obstetrics"
    ]

    DOCTORS: List[str] = [
        "Dr. Sarah Jenkins (Cardiology)",
        "Dr. Michael Chang (Neurology)",
        "Dr. Robert Davis (Orthopedics)",
        "Dr. Emily Patel (Pediatrics)",
        "Dr. David Kim (Oncology)",
        "Dr. James Wilson (General Medicine)",
        "Dr. Lisa Anderson (General Surgery)",
        "Dr. Rachel Martinez (Emergency Medicine)",
        "Dr. Priya Sharma (Gynecology & Obstetrics)"
    ]

    STATUSES: List[str] = ["Admitted", "Discharged"]

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
