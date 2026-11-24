"""
Core configuration for the NEET Intelligence Platform.
"""
import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables with sensible defaults."""

    # Application
    APP_NAME: str = "NEET Intelligence Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    BASE_DIR: str = str(Path(__file__).resolve().parent.parent.parent)
    DATABASE_URL: str = ""

    # Security
    SECRET_KEY: str = "neet-platform-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480  # 8 hours

    # File upload
    MAX_UPLOAD_SIZE_MB: int = 500
    UPLOAD_DIR: str = ""
    EXPORT_DIR: str = ""
    SYNTHETIC_DIR: str = ""

    # ML
    MODEL_DIR: str = ""
    MAX_TRAINING_ROWS: int = 1_000_000

    # CORS
    CORS_ORIGINS: list[str] = ["*"]

    class Config:
        env_prefix = "NEET_"

    def model_post_init(self, __context) -> None:
        """Set computed defaults after initialization."""
        if not self.DATABASE_URL:
            self.DATABASE_URL = f"sqlite:///{self.BASE_DIR}/data/neet_platform.db"
        if not self.UPLOAD_DIR:
            self.UPLOAD_DIR = os.path.join(self.BASE_DIR, "data", "uploads")
        if not self.EXPORT_DIR:
            self.EXPORT_DIR = os.path.join(self.BASE_DIR, "data", "exports")
        if not self.SYNTHETIC_DIR:
            self.SYNTHETIC_DIR = os.path.join(self.BASE_DIR, "data", "synthetic")
        if not self.MODEL_DIR:
            self.MODEL_DIR = os.path.join(self.BASE_DIR, "data", "models")

        # Ensure directories exist
        for d in [self.UPLOAD_DIR, self.EXPORT_DIR, self.SYNTHETIC_DIR, self.MODEL_DIR]:
            os.makedirs(d, exist_ok=True)


settings = Settings()
