@echo off
echo ========================================================
echo   Dscribe - Patient Admission Management System
echo ========================================================
echo.

echo Starting FastAPI Backend Server on http://localhost:8000...
start cmd /k "cd /d %~dp0backend && python run.py"

echo Starting React Vite Frontend Server on http://localhost:5173...
start cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers have been launched in separate windows!
echo - Frontend UI: http://localhost:5173
echo - Backend API: http://localhost:8000
echo - Interactive Swagger Docs: http://localhost:8000/docs
echo ========================================================
