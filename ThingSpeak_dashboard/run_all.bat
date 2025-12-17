@echo off
echo ========================================
echo   Diabetes Prediction System
echo   Starting All Services
echo ========================================
echo.

cd /d "%~dp0"

echo Starting FastAPI Backend Server...
START "FastAPI Backend" cmd /k "python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 5 /nobreak > nul

echo Starting Next.js Frontend...
START "Next.js Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Services Started!
echo ========================================
echo.
echo FastAPI Backend: http://localhost:8000
echo API Documentation: http://localhost:8000/docs
echo Next.js Frontend: http://localhost:3000
echo.
echo Press any key to stop all services...
pause > nul

echo.
echo Stopping services...
taskkill /FI "WINDOWTITLE eq FastAPI Backend*" /T /F > nul 2>&1
taskkill /FI "WINDOWTITLE eq Streamlit Frontend*" /T /F > nul 2>&1

echo Services stopped.
pause
