export interface User {
  id: string;
  username: string;
  height: number;
  weight: number;
  age: number;
}

export interface ThingSpeakData {
  Glucose: number;
  BloodPressure: number;
  SkinThickness: number;
  Insulin: number;
  DiabetesPedigreeFunction: number;
  timestamp: string;
}

export interface PredictionResult {
  probability: number;
  risk_level: string;
  prediction: number;
  features_used: {
    Pregnancies: number;
    Glucose: number;
    BloodPressure: number;
    SkinThickness: number;
    Insulin: number;
    BMI: number;
    DiabetesPedigreeFunction: number;
    Age: number;
  };
}

export interface PredictionHistory {
  id: string;
  timestamp: string;
  prediction: number;
  probability: number;
  risk_level: string;
  features_used: {
    Pregnancies: number;
    Glucose: number;
    BloodPressure: number;
    SkinThickness: number;
    Insulin: number;
    BMI: number;
    DiabetesPedigreeFunction: number;
    Age: number;
  };
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  password: string;
  pregnancies: number;
  weight_kg: number;
  height_m: number;
  age: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}
