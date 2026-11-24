@echo off
TITLE NEET Intelligence Platform Launcher
COLOR 0B

echo =======================================================================
echo                 NEET INTELLIGENCE PLATFORM (INDIA)
echo          Youth NEET Prediction, Transition Analysis & Policy
echo =======================================================================
echo.

set SCRIPT_DIR=%~dp0
cd /d "%SCRIPT_DIR%"

echo [1/3] Initializing SQLite Database and Evidence Registry...
cd /d "%SCRIPT_DIR%backend"
python init_db.py
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Database initialization check had an issue, attempting to proceed...
)

echo [2/3] Launching FastAPI Backend on port 8000...
start "NEET Backend (FastAPI)" cmd /k "cd /d ""%SCRIPT_DIR%backend"" && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

echo [3/3] Launching Next.js 14 Frontend on port 3000...
start "NEET Frontend (Next.js)" cmd /k "cd /d ""%SCRIPT_DIR%frontend"" && pnpm start"

echo.
echo =======================================================================
echo Platform services launched successfully!
echo.
echo   - Web Application: http://localhost:3000
echo   - REST API Docs:   http://localhost:8000/docs
echo   - Interactive UI:  http://localhost:3000/catalog.html
echo.
echo Admin credentials: admin@neet.platform / admin123
echo Researcher credentials: researcher@neet.platform / research123
echo =======================================================================
echo.

timeout /t 3 >nul
start http://localhost:3000
