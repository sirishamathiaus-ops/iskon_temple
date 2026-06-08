from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import get_settings
from app.core.exceptions import (
    http_exception_handler,
    unhandled_exception_handler,
    validation_exception_handler,
)
from app.core.logging_config import setup_logging
from app.database import Base, engine, ensure_db_schema
from app.routers import about, admin, auth, deities, donations, festivals, history, payments, public

setup_logging()
settings = get_settings()

STATIC_DIR = Path(__file__).resolve().parent / "static"
UPLOAD_DIR = STATIC_DIR / "uploads"


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    ensure_db_schema()
    STATIC_DIR.mkdir(parents=True, exist_ok=True)
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    yield


app = FastAPI(
    title=settings.app_name,
    description="ISKCON Dornala — Sri Jagannath Temple API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Root & discovery ---
@app.get("/")
def home():
    return {"message": "ISKCON Temple Backend Running Successfully"}


@app.get("/api")
def api_root():
    return {
        "message": "ISKCON Temple API",
        "docs": "/docs",
        "health": "/api/health",
        "endpoints": {
            "festivals": "/api/festivals",
            "about": "/api/about",
            "deities": "/api/deities",
            "history": "/api/history",
            "public": "/api/public",
            "donations": "/api/donations",
            "payments": "/api/payments",
            "auth": "/api/auth",
        },
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "app": settings.app_name}


# --- Feature routers (under /api) ---
app.include_router(festivals.router, prefix="/api")
app.include_router(about.router, prefix="/api")
app.include_router(deities.router, prefix="/api")
app.include_router(history.router, prefix="/api")

app.include_router(auth.router, prefix="/api")
app.include_router(public.router, prefix="/api")
app.include_router(donations.router, prefix="/api")
app.include_router(payments.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
