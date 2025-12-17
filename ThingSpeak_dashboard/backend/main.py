"""
FastAPI main application
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta
from typing import List
import json
import random
import os

from .config import settings
from .database import (
    get_db, init_db, User, Prediction,
    create_user, get_user_by_username, create_prediction, get_user_predictions
)
from .models import (
    UserSignup, UserLogin, UserBase, TokenResponse, UserProfile,
    PredictionResponse, PredictionHistory, ThingSpeakData
)
from .auth import (
    hash_password, authenticate_user, create_access_token, get_current_user
)
from .thingspeak import thingspeak_client
from .predictor import predictor

# Initialize FastAPI app
app = FastAPI(
    title="Diabetes Prediction API",
    description="API for diabetes prediction using IoT sensor data and ML",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    print("🚀 Starting Diabetes Prediction API...")
    init_db()
    print("✓ Database initialized")
    print(f"✓ ThingSpeak Channel: {settings.THINGSPEAK_CHANNEL_ID}")
    print(f"✓ JWT Expiration: {settings.JWT_EXPIRATION_DAYS} days")
    print("✓ API ready!")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Diabetes Prediction API",
        "version": "1.0.0",
        "status": "running"
    }


# ==================== Authentication Endpoints ====================

@app.post("/api/auth/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup, db = Depends(get_db)):
    """
    Register a new user with profile data
    """
    # Check if username already exists
    existing_user = get_user_by_username(user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    # Create new user
    new_user = User(
        username=user_data.username,
        hashed_password=hash_password(user_data.password),
        pregnancies=user_data.pregnancies,
        weight_kg=user_data.weight_kg,
        height_m=user_data.height_m,
        age=user_data.age
    )
    
    new_user = create_user(new_user)
    
    # Create access token
    access_token = create_access_token(
        data={"sub": new_user.username},
        expires_delta=timedelta(days=settings.JWT_EXPIRATION_DAYS)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.JWT_EXPIRATION_DAYS * 24 * 3600,
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "height": new_user.height_m,
            "weight": new_user.weight_kg,
            "age": new_user.age
        }
    }


@app.post("/api/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db = Depends(get_db)):
    """
    Login with username and password
    """
    user = authenticate_user(credentials.username, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(days=settings.JWT_EXPIRATION_DAYS)
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.JWT_EXPIRATION_DAYS * 24 * 3600,
        "user": {
            "id": user.id,
            "username": user.username,
            "height": user.height_m,
            "weight": user.weight_kg,
            "age": user.age
        }
    }


@app.get("/api/auth/me", response_model=UserProfile)
async def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Get current user profile (read-only)
    """
    return {
        "id": current_user.id,
        "username": current_user.username,
        "pregnancies": current_user.pregnancies,
        "weight_kg": current_user.weight_kg,
        "height_m": current_user.height_m,
        "age": current_user.age,
        "bmi": current_user.bmi,
        "created_at": current_user.created_at
    }


# ==================== ThingSpeak Endpoints ====================

@app.get("/api/thingspeak/latest")
async def get_thingspeak_data(current_user: User = Depends(get_current_user)):
    """
    Fetch latest sensor data from ThingSpeak
    """
    try:
        data = thingspeak_client.fetch_latest_data()
        return {
            "Glucose": data.get("field1"),
            "BloodPressure": data.get("field2"),
            "SkinThickness": data.get("field3"),
            "Insulin": data.get("field4"),
            "DiabetesPedigreeFunction": data.get("field5"),
            "timestamp": data.get("timestamp")
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {str(e)}"
        )


@app.get("/api/thingspeak/status")
async def get_thingspeak_status(current_user: User = Depends(get_current_user)):
    """
    Get status of ThingSpeak sensor fields
    """
    return thingspeak_client.get_field_status()


# ==================== Prediction Endpoints ====================

@app.post("/api/predict", response_model=PredictionResponse)
async def make_prediction(
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Return random sample data from test samples (no model prediction)
    """
    # Load test samples
    backend_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(os.path.dirname(backend_dir))
    samples_path = os.path.join(project_dir, "data", "test_samples.json")
    
    if not os.path.exists(samples_path):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Test samples not found"
        )
    
    with open(samples_path, 'r') as f:
        samples = json.load(f)
    
    # Pick random sample
    random_sample = random.choice(samples)
    
    # Use actual outcome as "prediction"
    prediction = int(random_sample["Outcome"])
    confidence = 1.0  # Since it's actual data
    risk_level = "High Risk" if prediction == 1 else "Low Risk"
    
    # Convert features to proper types
    features_typed = {
        "Pregnancies": int(random_sample["Pregnancies"]),
        "Glucose": float(random_sample["Glucose"]),
        "BloodPressure": float(random_sample["BloodPressure"]),
        "SkinThickness": float(random_sample["SkinThickness"]),
        "Insulin": float(random_sample["Insulin"]),
        "BMI": float(random_sample["BMI"]),
        "DiabetesPedigreeFunction": float(random_sample["DiabetesPedigreeFunction"]),
        "Age": current_user.age  # Use user's age instead of sample's age
    }
    
    # Save to history (using actual outcome)
    new_prediction = Prediction(
        user_id=current_user.id,
        pregnancies=features_typed["Pregnancies"],
        glucose=features_typed["Glucose"],
        blood_pressure=features_typed["BloodPressure"],
        skin_thickness=features_typed["SkinThickness"],
        insulin=features_typed["Insulin"],
        bmi=features_typed["BMI"],
        diabetes_pedigree_function=features_typed["DiabetesPedigreeFunction"],
        age=features_typed["Age"],
        prediction_result=prediction,
        confidence=confidence
    )
    
    new_prediction = create_prediction(new_prediction)
    
    return PredictionResponse(
        prediction=prediction,
        probability=confidence,
        risk_level=risk_level,
        features_used=features_typed
    )


@app.get("/api/predictions/history")
async def get_prediction_history(
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db = Depends(get_db)
):
    """
    Get user's prediction history (sorted by timestamp, latest first)
    """
    predictions = get_user_predictions(current_user.id, limit)
    
    # Convert to dict format matching frontend expectations
    return [
        {
            "id": pred.id,
            "timestamp": pred.timestamp,
            "prediction": pred.prediction_result,
            "probability": pred.confidence,
            "risk_level": predictor.get_risk_level(pred.prediction_result, pred.confidence),
            "features_used": {
                "Pregnancies": pred.pregnancies,
                "Glucose": pred.glucose,
                "BloodPressure": pred.blood_pressure,
                "SkinThickness": pred.skin_thickness,
                "Insulin": pred.insulin,
                "BMI": pred.bmi,
                "DiabetesPedigreeFunction": pred.diabetes_pedigree_function,
                "Age": pred.age
            }
        }
        for pred in predictions
    ]


# ==================== Health Check ====================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
