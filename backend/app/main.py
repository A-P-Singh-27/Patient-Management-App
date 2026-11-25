from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.database import Base, engine
from app.api.routes import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    try:
        from seed_data import seed_database
        seed_database()
    except Exception as e:
        print("Note: Seed check complete.", e)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade REST API for Patient Admission Management",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "error",
            "message": "An unexpected server error occurred.",
            "detail": str(exc),
        },
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors_map = {}
    error_messages = []
    clean_details = []
    
    for err in exc.errors():
        loc = err.get("loc", [])
        field = loc[-1] if loc else "general"
        msg = err.get("msg", "Invalid value.")
        if msg.startswith("Value error, "):
            msg = msg[len("Value error, "):]
        errors_map[str(field)] = msg
        error_messages.append(f"{field}: {msg}")
        clean_details.append({
            "field": str(field),
            "message": msg,
            "type": str(err.get("type", "value_error"))
        })

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "status": "error",
            "message": "Validation failed: " + "; ".join(error_messages),
            "errors": errors_map,
            "details": clean_details,
        },
    )

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health"])
def root_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api": "/api/patients"
    }

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}
