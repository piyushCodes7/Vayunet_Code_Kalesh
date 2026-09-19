@echo off
echo ===================================================
echo   VayuNet Air Quality Micro-Mapping (Docker Launcher)
echo ===================================================
echo.

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Docker is not installed or not in your Windows PATH.
    echo.
    echo To install Docker Desktop on Windows:
    echo   1. Download and install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    echo   2. Start Docker Desktop and ensure the engine is running.
    echo   3. Run this script again: run-docker.bat
    echo.
    echo Alternatively, you can run the app locally without Docker right now!
    echo Would you like to run locally via run-local.bat? (Y/N)
    set /p choice="Enter choice [Y/N]: "
    if /i "%choice%"=="Y" (
        call run-local.bat
        exit /b
    )
    pause
    exit /b 1
)

echo [*] Starting VayuNet services via Docker Compose...
echo [*] Services: PostgreSQL 16 (db) + FastAPI (backend) + React Nginx (frontend)
echo.
docker compose up --build

pause
