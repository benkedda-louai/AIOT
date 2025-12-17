@echo off
echo ========================================
echo   Installing Backend Dependencies
echo ========================================
echo.

cd /d "%~dp0"

echo Installing Python packages...
pip install -r requirements.txt

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   Installation Successful!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Copy .env.template to .env and configure your settings
    echo 2. Run run_backend.bat to start the FastAPI server
    echo 3. Run run_app.bat to start the Streamlit frontend
    echo.
) else (
    echo.
    echo ========================================
    echo   Installation Failed!
    echo ========================================
    echo Please check the error messages above.
    echo.
)

pause
