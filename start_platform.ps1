# NEET Intelligence Platform Launcher (PowerShell)
Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host "                 NEET INTELLIGENCE PLATFORM (INDIA)" -ForegroundColor Yellow
Write-Host "          Youth NEET Prediction, Transition Analysis & Policy" -ForegroundColor Cyan
Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Initialize Database
Write-Host "[1/3] Checking SQLite Database and Evidence Registry..." -ForegroundColor Green
Set-Location "$ScriptDir\backend"
python init_db.py

# 2. Launch Backend
Write-Host "[2/3] Launching FastAPI Backend on http://localhost:8000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\backend'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

# 3. Launch Frontend
Write-Host "[3/3] Launching Next.js 14 Frontend on http://localhost:3000..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir\frontend'; pnpm start"

Write-Host ""
Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host "Platform services launched successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "  - Web Application: http://localhost:3000" -ForegroundColor White
Write-Host "  - REST API Docs:   http://localhost:8000/docs" -ForegroundColor White
Write-Host "  - Design Catalog:  http://localhost:3000/catalog.html" -ForegroundColor White
Write-Host ""
Write-Host "Default Logins:" -ForegroundColor Gray
Write-Host "  Admin:      admin@neet.platform / admin123" -ForegroundColor Gray
Write-Host "  Researcher: researcher@neet.platform / research123" -ForegroundColor Gray
Write-Host "=======================================================================" -ForegroundColor Cyan

Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"
