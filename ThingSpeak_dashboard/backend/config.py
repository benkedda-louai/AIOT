"""
Configuration settings for the FastAPI backend
"""
import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings"""
    
    # JWT Configuration
    JWT_SECRET_KEY: str = "your-secret-key-change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_DAYS: int = 7
    # BrcTfnRsHDJwNFBw
    # ThingSpeak Configuration
    THINGSPEAK_CHANNEL_ID: str = "3124884"
    THINGSPEAK_READ_API: str = "2NPFT89DTCN0EZIS"
    THINGSPEAK_WRITE_API: str = "XKYL4F3JW3UT17CI"
    THINGSPEAK_BASE_URL: str = "https://api.thingspeak.com"
    
    # Firebase Configuration
    FIREBASE_DATABASE_URL: str = "https://aiot-2aadb-default-rtdb.firebaseio.com/"
    # Firebase credentials file path (optional - for service account authentication)
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    
    # Model Configuration
    MODEL_PATH: str = "../output/models/decision_tree_model.pkl"
    MODEL_METADATA_PATH: str = "../output/models/model_metadata.pkl"
    
    # CORS Configuration
    CORS_ORIGINS: list = ["http://localhost:8501", "http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True
        extra = "ignore"  # Ignore extra fields from .env file


# Create global settings instance
settings = Settings()
