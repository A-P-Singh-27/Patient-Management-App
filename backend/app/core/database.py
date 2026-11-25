from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.core.config import settings

database_url = settings.DATABASE_URL

# Fix compatibility: Neon & Render often provide 'postgres://' or 'postgresql://'
# Using psycopg2 driver guarantees compatibility across platforms
if database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql+psycopg2://", 1)
elif database_url.startswith("postgresql://") and not database_url.startswith("postgresql+"):
    database_url = database_url.replace("postgresql://", "postgresql+psycopg2://", 1)

connect_args = {}
engine_kwargs = {
    "pool_pre_ping": True,  # Verifies connection vitality before executing queries
}

if "sqlite" in database_url:
    connect_args["check_same_thread"] = False
else:
    # PostgreSQL (Neon, Supabase, RDS) optimizations
    engine_kwargs["pool_recycle"] = 300   # Recycle connections every 5 mins to handle serverless timeouts
    engine_kwargs["pool_size"] = 10       # Base connection pool size
    engine_kwargs["max_overflow"] = 20    # Burst connection capacity

engine = create_engine(
    database_url,
    connect_args=connect_args,
    **engine_kwargs
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
