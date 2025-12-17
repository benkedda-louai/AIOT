"""
Diabetes prediction service using trained Decision Tree model
"""
import os
import joblib
import numpy as np
from typing import Dict, Tuple
from fastapi import HTTPException, status
from .config import settings
from .database import User


class DiabetesPredictor:
    """Diabetes prediction service"""
    
    def __init__(self):
        self.model = None
        self.metadata = None
        self.load_model()
    
    def load_model(self):
        """Load the trained Decision Tree model"""
        try:
            # Get absolute path to model
            backend_dir = os.path.dirname(os.path.abspath(__file__))
            thingspeak_dashboard_dir = os.path.dirname(backend_dir)
            project_dir = os.path.dirname(thingspeak_dashboard_dir)
            model_path = os.path.join(project_dir, "output", "models", "decision_tree_model.pkl")
            metadata_path = os.path.join(project_dir, "output", "models", "model_metadata.pkl")
            
            # Load model
            if os.path.exists(model_path):
                self.model = joblib.load(model_path)
                print(f"✓ Model loaded from {model_path}")
            else:
                raise FileNotFoundError(f"Model file not found at {model_path}")
            
            # Load metadata if available
            if os.path.exists(metadata_path):
                self.metadata = joblib.load(metadata_path)
                print(f"✓ Model metadata loaded: {self.metadata.get('model_type', 'Unknown')}")
                print(f"  - Accuracy: {self.metadata.get('accuracy', 'N/A')}")
                print(f"  - ROC-AUC: {self.metadata.get('roc_auc', 'N/A')}")
            
        except Exception as e:
            print(f"✗ Error loading model: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to load prediction model: {str(e)}"
            )
    
    def prepare_features(self, user: User, sensor_data: Dict) -> np.ndarray:
        """
        Prepare feature array for prediction
        
        Feature order: [Pregnancies, Glucose, BloodPressure, SkinThickness, 
                       Insulin, BMI, DiabetesPedigreeFunction, Age]
        
        Args:
            user: User object with profile data
            sensor_data: Dict with ThingSpeak sensor values
            
        Returns:
            numpy array of features
        """
        # Calculate BMI
        bmi = user.weight_kg / (user.height_m ** 2)
        
        # Assemble features in correct order
        features = [
            user.pregnancies,                       # Pregnancies
            sensor_data.get("field1"),              # Glucose
            sensor_data.get("field2"),              # BloodPressure
            sensor_data.get("field3"),              # SkinThickness
            sensor_data.get("field4"),              # Insulin
            bmi,                                     # BMI
            sensor_data.get("field5"),              # DiabetesPedigreeFunction
            user.age                                 # Age
        ]
        
        return np.array(features).reshape(1, -1)
    
    def predict(self, user: User, sensor_data: Dict) -> Tuple[int, float, Dict]:
        """
        Make diabetes prediction
        
        Args:
            user: User object with profile data
            sensor_data: Dict with ThingSpeak sensor values
            
        Returns:
            Tuple of (prediction, confidence, input_data_dict)
        """
        if self.model is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Prediction model not loaded"
            )
        
        # Prepare features
        features = self.prepare_features(user, sensor_data)
        
        # Make prediction
        prediction = int(self.model.predict(features)[0])
        
        # Get prediction probability
        probabilities = self.model.predict_proba(features)[0]
        confidence = float(probabilities[prediction])
        
        # Prepare input data for history
        bmi = user.weight_kg / (user.height_m ** 2)
        input_data = {
            "pregnancies": user.pregnancies,
            "glucose": float(sensor_data.get("field1")),
            "blood_pressure": float(sensor_data.get("field2")),
            "skin_thickness": float(sensor_data.get("field3")),
            "insulin": float(sensor_data.get("field4")),
            "bmi": round(bmi, 2),
            "diabetes_pedigree_function": float(sensor_data.get("field5")),
            "age": user.age
        }
        
        return prediction, confidence, input_data
    
    def predict_from_features(self, features_dict: Dict) -> Tuple[int, float, Dict]:
        """
        Make diabetes prediction from raw features
        
        Args:
            features_dict: Dict with feature values
            
        Returns:
            Tuple of (prediction, confidence, input_data_dict)
        """
        if self.model is None:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Prediction model not loaded"
            )
        
        # Prepare features array
        features = np.array([
            float(features_dict.get("Pregnancies", 0)),
            float(features_dict.get("Glucose", 0)),
            float(features_dict.get("BloodPressure", 0)),
            float(features_dict.get("SkinThickness", 0)),
            float(features_dict.get("Insulin", 0)),
            float(features_dict.get("BMI", 0)),
            float(features_dict.get("DiabetesPedigreeFunction", 0)),
            float(features_dict.get("Age", 0))
        ]).reshape(1, -1)
        
        # Make prediction
        prediction = int(self.model.predict(features)[0])
        
        # Get prediction probability
        probabilities = self.model.predict_proba(features)[0]
        confidence = float(probabilities[prediction])
        
        # Return input data
        input_data = {k: float(v) for k, v in features_dict.items()}
        
        return prediction, confidence, input_data
    
    def get_risk_level(self, prediction: int, confidence: float) -> str:
        """
        Determine risk level based on prediction and confidence
        
        Args:
            prediction: 0 (non-diabetic) or 1 (diabetic)
            confidence: Prediction confidence (0-1)
            
        Returns:
            Risk level string
        """
        if prediction == 0:
            if confidence > 0.8:
                return "Low Risk"
            elif confidence > 0.6:
                return "Low-Moderate Risk"
            else:
                return "Moderate Risk"
        else:  # prediction == 1
            if confidence > 0.8:
                return "High Risk"
            elif confidence > 0.6:
                return "Moderate-High Risk"
            else:
                return "Moderate Risk"


# Create global predictor instance
predictor = DiabetesPredictor()
