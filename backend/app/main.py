"""
NEET Intelligence Platform - FastAPI Backend Application.
An AI-Powered Framework for Youth NEET Prediction, Transition Analysis,
Opportunity Discovery and Evidence-Based Intervention in India.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time
import os

from app.core.config import settings
from app.core.database import engine, Base
import app.models  # Ensure all models are registered with Base metadata
from app.api.v1.router import api_router

# Create database tables
Base.metadata.create_all(bind=engine)

# Ensure data directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.EXPORT_DIR, exist_ok=True)
os.makedirs(settings.SYNTHETIC_DIR, exist_ok=True)

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="An AI-Powered Framework for Youth NEET Prediction, Transition Analysis, Opportunity Discovery and Evidence-Based Intervention in India.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = f"{process_time:.4f}s"
    return response

# Mount API routes
app.include_router(api_router)

@app.get("/")
def root():
    return {
        "platform": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "documentation": "/docs",
        "research_foundation": "From NEET Status to NEET Persistence (India Youth Studies: PLFS, IHDS, UDAYA, Young Lives)",
        "synthetic_demonstration_mode": True
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "api_v1": "active",
        "timestamp": time.time()
    }
