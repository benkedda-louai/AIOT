import axios from "axios";
import { getToken, removeToken } from "./auth";
import type {
  LoginRequest,
  SignupRequest,
  AuthResponse,
  User,
  ThingSpeakData,
  PredictionResult,
  PredictionHistory,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await api.post("/api/auth/signup", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/api/auth/me");
    return response.data;
  },
};

export const thingspeakAPI = {
  getLatestData: async (): Promise<ThingSpeakData> => {
    const response = await api.get("/api/thingspeak/latest");
    return response.data;
  },
};

export const predictionAPI = {
  predict: async (pregnancies: number): Promise<PredictionResult> => {
    const response = await api.post("/api/predict", { pregnancies });
    return response.data;
  },

  getHistory: async (): Promise<PredictionHistory[]> => {
    const response = await api.get("/api/predictions/history");
    return response.data;
  },
};

export default api;
