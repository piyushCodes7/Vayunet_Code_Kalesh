import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base, SessionLocal
from app.api.routes import router as api_router
from app.services.seeder import seed_database_if_empty

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("vayu_main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing VayuNet Air Quality Micro-Mapping Service...")
    
    # 1. Initialize Tables
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized successfully.")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")

    # 2. Seed realistic data & Train ML Model
    try:
        db = SessionLocal()
        seed_database_if_empty(db)
        db.close()
        logger.info("Database seeding and ML training verification complete.")
    except Exception as e:
        logger.error(f"Error during database seeding / ML initialization: {e}")

    yield

    logger.info("Shutting down VayuNet service.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Street-level air quality micro-mapping platform with low-cost sensor "
        "spatial interpolation and automated AI health advisories for schools and outdoor workers."
    ),
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Router
app.include_router(api_router, prefix="/api")

@app.get("/")
def root():
    return {
        "service": "VayuNet Air Quality Micro-Mapping API",
        "status": "online",
        "docs": "/docs",
        "health": "/api/health",
        "map_data": "/api/map-data"
    }
