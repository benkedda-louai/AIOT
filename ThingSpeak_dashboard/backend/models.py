"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime


class UserSignup(BaseModel):
    """User signup request model"""
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    pregnancies: int = Field(..., ge=0, le=20)
    weight_kg: float = Field(..., ge=30, le=200)
    height_m: float = Field(..., ge=1.0, le=2.5)
    age: int = Field(..., ge=18, le=120)
    
    @validator('height_m')
    def validate_height(cls, v):
        """Convert cm to m if needed"""
        if v > 3:  # Likely in cm
            return v / 100
        return v


class UserLogin(BaseModel):
    """User login request model"""
    username: str
    password: str


class UserBase(BaseModel):
    """Base user model for responses"""
    id: str
    username: str
    height: float
    weight: float
    age: int


class TokenResponse(BaseModel):
    """JWT token response model"""
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: UserBase


class UserProfile(BaseModel):
    """User profile response model"""
    id: str  # Changed to string for Firebase UUID
    username: str
    pregnancies: int
    weight_kg: float
    height_m: float
    age: int
    bmi: float
    created_at: str  # Changed to string for ISO format
    
    class Config:
        from_attributes = True


class ThingSpeakData(BaseModel):
    """ThingSpeak sensor data model"""
    glucose: float = Field(..., alias="field1")
    blood_pressure: float = Field(..., alias="field2")
    skin_thickness: float = Field(..., alias="field3")
    insulin: float = Field(..., alias="field4")
    diabetes_pedigree_function: float = Field(..., alias="field5")
    timestamp: str
    
    class Config:
        populate_by_name = True


class PredictionRequest(BaseModel):
    """Prediction request model"""
    pass  # Uses JWT to identify user and fetches ThingSpeak data


class PredictionResponse(BaseModel):
    """Prediction response model"""
    prediction: int
    probability: float
    risk_level: str
    features_used: dict


class PredictionHistory(BaseModel):
    """Prediction history item model"""
    id: str  # Changed to string for Firebase UUID
    user_id: str  # Changed to string for Firebase UUID
    pregnancies: int
    glucose: float
    blood_pressure: float
    skin_thickness: float
    insulin: float
    bmi: float
    diabetes_pedigree_function: float
    age: int
    prediction_result: int
    confidence: float
    timestamp: str  # Changed to string for ISO format
    
    class Config:
        from_attributes = True


class ErrorResponse(BaseModel):
    """Error response model"""
    error: str
    detail: Optional[str] = None
    missing_fields: Optional[list] = None
