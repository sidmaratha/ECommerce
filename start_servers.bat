@echo off
echo Starting E-Commerce Servers...
echo.

echo Starting Backend Server...
start "Django Backend" cmd /k "cd /d %~dp0backend && python manage.py runserver"
timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "React Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Servers are starting in separate windows...
echo.
echo Backend: http://localhost:8000
echo Frontend: http://localhost:3000
echo Admin Panel: http://localhost:8000/admin/
echo.
echo Press any key to exit this window (servers will continue running)...
pause >nul

