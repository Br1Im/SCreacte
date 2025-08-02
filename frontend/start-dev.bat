@echo off
echo ========================================
echo    SCreate - Запуск в режиме разработки
echo ========================================
echo.

echo [1/3] Запуск бэкенда...
cd backend
start "SCreate Backend" cmd /k "python run.py"
cd ..

echo [2/3] Ожидание запуска бэкенда...
timeout /t 5 /nobreak > nul

echo [3/3] Запуск фронтенда...
cd frontend
start "SCreate Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================
echo    Проект запущен!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo Нажмите любую клавишу для выхода...
pause > nul 