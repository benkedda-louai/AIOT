"""
Database models and session management using MongoDB
"""
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from datetime import datetime
from typing import Optional, List, Dict
from bson import ObjectId
from .config import settings

# MongoDB client - lazy connection
_client = None
_db = None

def get_mongo_client():
    """Get MongoDB client with lazy initialization"""
    global _client, _db
    if _client is None:
        try:
            # Create client with ServerApi as recommended by MongoDB Atlas
            _client = MongoClient(settings.MONGODB_URL, server_api=ServerApi('1'))
            # Test connection
            _client.admin.command('ping')
            _db = _client[settings.DATABASE_NAME]
            print("✓ Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(f"✗ MongoDB connection error: {e}")
            raise
    return _client, _db

# Collections getter functions
def get_users_collection():
    _, db = get_mongo_client()
    return db["users"]

def get_predictions_collection():
    _, db = get_mongo_client()
    return db["predictions"]


class User:
    """User model for MongoDB"""
    
    def __init__(self, username: str, hashed_password: str, pregnancies: int, 
                 weight_kg: float, height_m: float, age: int, 
                 _id: Optional[ObjectId] = None, created_at: Optional[datetime] = None):
        self._id = _id or ObjectId()
        self.username = username
        self.hashed_password = hashed_password
        self.pregnancies = pregnancies
        self.weight_kg = weight_kg
        self.height_m = height_m
        self.age = age
        self.created_at = created_at or datetime.utcnow()
    
    @property
    def id(self) -> str:
        """Return string ID"""
        return str(self._id)
    
    @property
    def bmi(self) -> float:
        """Calculate BMI"""
        return round(self.weight_kg / (self.height_m ** 2), 2)
    
    def to_dict(self) -> dict:
        """Convert to dictionary for MongoDB"""
        return {
            "_id": self._id,
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
        """Create User from MongoDB document"""
        return cls(
            username=data["username"],
            hashed_password=data["hashed_password"],
            pregnancies=data["pregnancies"],
            weight_kg=data["weight_kg"],
            height_m=data["height_m"],
            age=data["age"],
            _id=data.get("_id"),
            created_at=data.get("created_at")
        )


class Prediction:
    """Prediction model for MongoDB"""
    
    def __init__(self, user_id: str, pregnancies: int, glucose: float, 
                 blood_pressure: float, skin_thickness: float, insulin: float,
                 bmi: float, diabetes_pedigree_function: float, age: int,
                 prediction_result: int, confidence: float,
                 _id: Optional[ObjectId] = None, timestamp: Optional[datetime] = None):
        self._id = _id or ObjectId()
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
        self.timestamp = timestamp or datetime.utcnow()
    
    @property
    def id(self) -> str:
        """Return string ID"""
        return str(self._id)
    
    def to_dict(self) -> dict:
        """Convert to dictionary for MongoDB"""
        return {
            "_id": self._id,
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
        """Create Prediction from MongoDB document"""
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
            _id=data.get("_id"),
            timestamp=data.get("timestamp")
        )


def get_db():
    """Dependency to get database (MongoDB doesn't need session management like SQLAlchemy)"""
    _, db = get_mongo_client()
    return db


def init_db():
    """Initialize database - MongoDB creates collections automatically"""
    # Ensure indexes are created
    users_collection = get_users_collection()
    predictions_collection = get_predictions_collection()
    users_collection.create_index("username", unique=True)
    predictions_collection.create_index("user_id")
    predictions_collection.create_index("timestamp")
    print("✓ MongoDB indexes created")


# Database helper functions
def create_user(user: User) -> User:
    """Create a new user"""
    users_collection = get_users_collection()
    result = users_collection.insert_one(user.to_dict())
    user._id = result.inserted_id
    return user


def get_user_by_username(username: str) -> Optional[User]:
    """Get user by username"""
    users_collection = get_users_collection()
    doc = users_collection.find_one({"username": username})
    return User.from_dict(doc) if doc else None


def get_user_by_id(user_id: str) -> Optional[User]:
    """Get user by ID"""
    try:
        users_collection = get_users_collection()
        doc = users_collection.find_one({"_id": ObjectId(user_id)})
        return User.from_dict(doc) if doc else None
    except:
        return None


def create_prediction(prediction: Prediction) -> Prediction:
    """Create a new prediction"""
    predictions_collection = get_predictions_collection()
    result = predictions_collection.insert_one(prediction.to_dict())
    prediction._id = result.inserted_id
    return prediction


def get_user_predictions(user_id: str, limit: int = 20) -> List[Prediction]:
    """Get user's predictions sorted by timestamp"""
    predictions_collection = get_predictions_collection()
    docs = predictions_collection.find(
        {"user_id": user_id}
    ).sort("timestamp", -1).limit(limit)
    
    return [Prediction.from_dict(doc) for doc in docs]
