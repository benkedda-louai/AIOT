@echo off
echo ========================================
echo   Starting Streamlit Frontend
echo ========================================
echo.

cd /d "%~dp0"

echo Application will open in your browser at http://localhost:8501
echo.
echo Press Ctrl+C to stop the application
echo.

streamlit run diabetes_app.py --server.port 8501

pause
