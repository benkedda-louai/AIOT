@echo off
echo ========================================
echo   Starting FastAPI Backend Server
echo ========================================
echo.

cd /d "%~dp0"

echo Server will start on http://localhost:8000
echo API documentation available at http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop the server
echo.

python -m uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000

pause
