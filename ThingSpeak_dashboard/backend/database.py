"""
Database models and session management using Firebase Realtime Database
"""
import firebase_admin
from firebase_admin import credentials, db
from datetime import datetime
from typing import Optional, List, Dict
from .config import settings
import uuid

# Firebase initialization
_firebase_app = None

def init_firebase():
    """Initialize Firebase"""
    global _firebase_app
    if _firebase_app is None:
        try:
            # Check if app is already initialized
            if firebase_admin._apps:
                _firebase_app = firebase_admin.get_app()
                return _firebase_app
            
            # Initialize with credentials if provided
            if settings.FIREBASE_CREDENTIALS_PATH:
                cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
                _firebase_app = firebase_admin.initialize_app(cred, {
                    'databaseURL': settings.FIREBASE_DATABASE_URL
                })
            else:
                # Initialize with default credentials
                cred = credentials.ApplicationDefault()
                _firebase_app = firebase_admin.initialize_app(cred, {
                    'databaseURL': settings.FIREBASE_DATABASE_URL
                })
            print("✓ Connected to Firebase Realtime Database")
        except Exception as e:
            print(f"✗ Firebase connection error: {e}")
            print("\nTo fix this:")
            print("1. Go to Firebase Console: https://console.firebase.google.com/")
            print("2. Select your project 'aiot-2aadb'")
            print("3. Go to Project Settings > Service Accounts")
            print("4. Click 'Generate New Private Key'")
            print("5. Save the JSON file to ThingSpeak_dashboard/firebase-credentials.json")
            print("6. Update .env: FIREBASE_CREDENTIALS_PATH=firebase-credentials.json")
            raise
    return _firebase_app


def get_db():
    """Get Firebase database reference"""
    init_firebase()
    return db


class User:
    """User model for Firebase"""
    
    def __init__(self, username: str, hashed_password: str, pregnancies: int, 
                 weight_kg: float, height_m: float, age: int, 
                 id: Optional[str] = None, created_at: Optional[str] = None):
        self.id = id or str(uuid.uuid4())
        self.username = username
        self.hashed_password = hashed_password
        self.pregnancies = pregnancies
        self.weight_kg = weight_kg
        self.height_m = height_m
        self.age = age
        self.created_at = created_at or datetime.utcnow().isoformat()
    
    @property
    def bmi(self) -> float:
        """Calculate BMI"""
        return round(self.weight_kg / (self.height_m ** 2), 2)
    
    def to_dict(self) -> dict:
        """Convert to dictionary for Firebase"""
        return {
            "id": self.id,
            "username": self.username,
            "hashed_password": self.hashed_password,
            "pregnancies": self.pregnancies,
            "weight_kg": self.weight_kg,
            "height_m": self.height_m,
            "age": self.age,
            "created_at": self.created_at
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'User':
        """Create User from Firebase data"""
        return cls(
            username=data["username"],
            hashed_password=data["hashed_password"],
            pregnancies=data["pregnancies"],
            weight_kg=data["weight_kg"],
            height_m=data["height_m"],
            age=data["age"],
            id=data.get("id"),
            created_at=data.get("created_at")
        )


class Prediction:
    """Prediction model for Firebase"""
    
    def __init__(self, user_id: str, pregnancies: int, glucose: float, 
                 blood_pressure: float, skin_thickness: float, insulin: float,
                 bmi: float, diabetes_pedigree_function: float, age: int,
                 prediction_result: int, confidence: float,
                 id: Optional[str] = None, timestamp: Optional[str] = None):
        self.id = id or str(uuid.uuid4())
        self.user_id = user_id
        self.pregnancies = pregnancies
        self.glucose = glucose
        self.blood_pressure = blood_pressure
        self.skin_thickness = skin_thickness
        self.insulin = insulin
        self.bmi = bmi
        self.diabetes_pedigree_function = diabetes_pedigree_function
        self.age = age
        self.prediction_result = prediction_result
        self.confidence = confidence
        self.timestamp = timestamp or datetime.utcnow().isoformat()
    
    def to_dict(self) -> dict:
        """Convert to dictionary for Firebase"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "pregnancies": self.pregnancies,
            "glucose": self.glucose,
            "blood_pressure": self.blood_pressure,
            "skin_thickness": self.skin_thickness,
            "insulin": self.insulin,
            "bmi": self.bmi,
            "diabetes_pedigree_function": self.diabetes_pedigree_function,
            "age": self.age,
            "prediction_result": self.prediction_result,
            "confidence": self.confidence,
            "timestamp": self.timestamp
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Prediction':
        """Create Prediction from Firebase data"""
        return cls(
            user_id=data["user_id"],
            pregnancies=data["pregnancies"],
            glucose=data["glucose"],
            blood_pressure=data["blood_pressure"],
            skin_thickness=data["skin_thickness"],
            insulin=data["insulin"],
            bmi=data["bmi"],
            diabetes_pedigree_function=data["diabetes_pedigree_function"],
            age=data["age"],
            prediction_result=data["prediction_result"],
            confidence=data["confidence"],
            id=data.get("id"),
            timestamp=data.get("timestamp")
        )


def init_db():
    """Initialize database - Firebase creates collections automatically"""
    init_firebase()
    print("✓ Firebase database initialized")


# Database helper functions
def create_user(user: User) -> User:
    """Create a new user"""
    init_firebase()
    users_ref = db.reference('users')
    users_ref.child(user.id).set(user.to_dict())
    return user


def get_user_by_username(username: str) -> Optional[User]:
    """Get user by username"""
    init_firebase()
    users_ref = db.reference('users')
    
    # Get all users and search manually (works without indexing)
    all_users = users_ref.get()
    
    if not all_users:
        return None
    
    # Search for matching username
    for user_id, user_data in all_users.items():
        if user_data.get('username') == username:
            return User.from_dict(user_data)
    
    return None


def get_user_by_id(user_id: str) -> Optional[User]:
    """Get user by ID"""
    try:
        init_firebase()
        users_ref = db.reference(f'users/{user_id}')
        user_data = users_ref.get()
        return User.from_dict(user_data) if user_data else None
    except:
        return None


def create_prediction(prediction: Prediction) -> Prediction:
    """Create a new prediction"""
    init_firebase()
    predictions_ref = db.reference('predictions')
    predictions_ref.child(prediction.id).set(prediction.to_dict())
    return prediction


def get_user_predictions(user_id: str, limit: int = 20) -> List[Prediction]:
    """Get user's predictions sorted by timestamp"""
    init_firebase()
    predictions_ref = db.reference('predictions')
    
    # Get all predictions and filter manually
    all_predictions = predictions_ref.get()
    
    if not all_predictions:
        return []
    
    # Filter by user_id and convert to Prediction objects
    prediction_list = []
    for pred_id, pred_data in all_predictions.items():
        if pred_data.get('user_id') == user_id:
            prediction_list.append(Prediction.from_dict(pred_data))
    
    # Sort by timestamp (newest first)
    prediction_list.sort(key=lambda x: x.timestamp, reverse=True)
    
    return prediction_list[:limit]
