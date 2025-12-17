"""
ThingSpeak API integration for fetching sensor data
"""
import requests
import random
import pandas as pd
from pathlib import Path
from typing import Dict, List, Optional
from fastapi import HTTPException, status
from .config import settings


class ThingSpeakClient:
    """Client for ThingSpeak API"""
    
    def __init__(self):
        self.base_url = settings.THINGSPEAK_BASE_URL
        self.channel_id = settings.THINGSPEAK_CHANNEL_ID
        self.read_api_key = settings.THINGSPEAK_READ_API
        
        # Load DiabetesPedigreeFunction values from dataset
        self.dpf_values = []
        try:
            csv_path = Path(__file__).parent.parent.parent / "data" / "diabetes.csv"
            if csv_path.exists():
                df = pd.read_csv(csv_path)
                self.dpf_values = df['DiabetesPedigreeFunction'].dropna().tolist()
                print(f"✓ Loaded {len(self.dpf_values)} DiabetesPedigreeFunction values from dataset")
            else:
                # Fallback to typical range if CSV not found
                self.dpf_values = [round(random.uniform(0.078, 2.42), 3) for _ in range(100)]
                print("⚠ Using generated DiabetesPedigreeFunction values (CSV not found)")
        except Exception as e:
            # Fallback to typical range
            self.dpf_values = [round(random.uniform(0.078, 2.42), 3) for _ in range(100)]
            print(f"⚠ Error loading CSV, using generated values: {e}")
    
    def get_random_dpf(self) -> float:
        """Get a random DiabetesPedigreeFunction value from the dataset"""
        return random.choice(self.dpf_values)
    
    def fetch_latest_data(self) -> Dict:
        """
        Fetch the latest sensor data from ThingSpeak
        
        Returns:
            Dict containing field1-field5 values
            
        Raises:
            HTTPException if data is incomplete or API fails
        """
        url = f"{self.base_url}/channels/{self.channel_id}/feeds.json"
        params = {
            "api_key": self.read_api_key,
            "results": 1  # Get only the latest entry
        }
        
        try:
            response = requests.get(url, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            if not data.get("feeds") or len(data["feeds"]) == 0:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="No data available from ThingSpeak. Please check if IoT device is connected and transmitting data."
                )
            
            latest_feed = data["feeds"][0]
            
            # Validate required fields
            required_fields = {
                "field1": "Glucose",
                "field2": "BloodPressure",
                "field3": "SkinThickness",
                "field4": "Insulin",
                # "field5": "DiabetesPedigreeFunction"
            }
            
            missing_fields = []
            sensor_data = {}
            
            for field_key, field_name in required_fields.items():
                value = latest_feed.get(field_key)
                
                # Check if field is missing or null
                if value is None or value == "":
                    missing_fields.append(field_name)
                else:
                    try:
                        sensor_data[field_key] = float(value)
                    except (ValueError, TypeError):
                        missing_fields.append(field_name)
            
            # If any fields are missing, raise detailed error
            if missing_fields:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail={
                        "error": "Incomplete sensor data",
                        "message": f"Missing or invalid sensor data: {', '.join(missing_fields)}. Please check IoT device connection and retry.",
                        "missing_fields": missing_fields
                    }
                )
            
            # Add DiabetesPedigreeFunction from dataset (random value)
            sensor_data["field5"] = self.get_random_dpf()
            
            # Add timestamp
            sensor_data["timestamp"] = latest_feed.get("created_at", "")
            
            return sensor_data
            
        except requests.exceptions.RequestException as e:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Failed to fetch data from ThingSpeak: {str(e)}"
            )
    
    def get_field_status(self) -> Dict:
        """
        Get status of all sensor fields
        
        Returns:
            Dict with field names and their status
        """
        try:
            data = self.fetch_latest_data()
            return {
                "Glucose": data.get("field1"),
                "BloodPressure": data.get("field2"),
                "SkinThickness": data.get("field3"),
                "Insulin": data.get("field4"),
                "DiabetesPedigreeFunction": data.get("field5"),
                "timestamp": data.get("timestamp"),
                "status": "ok"
            }
        except HTTPException as e:
            return {
                "status": "error",
                "detail": e.detail
            }


# Create global ThingSpeak client instance
thingspeak_client = ThingSpeakClient()
