@echo off
echo =======================================================
echo   VayuNet Air Quality Micro-Mapping (Local Launcher)
echo =======================================================
echo.
echo [*] Starting FastAPI Backend (Port 8000)...
start "VayuNet Backend (Port 8000)" cmd /k "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [*] Starting React Vite Frontend (Port 5173)...
start "VayuNet Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo [*] Waiting 3 seconds for servers to initialize...
timeout /t 3 /nobreak >nul

echo [*] Opening browser to http://localhost:5173/ ...
start http://localhost:5173/

echo.
echo [✓] Both services are running!
echo     - Frontend: http://localhost:5173/
echo     - Backend API Docs: http://localhost:8000/docs
echo.
pause
