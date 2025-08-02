@echo off
echo 🎮 SCreate - Generate kvest
echo ==================================================

REM Проверяем наличие Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python не установлен или не найден в PATH
    pause
    exit /b 1
)

REM Проверяем наличие Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js не установлен или не найден в PATH
    pause
    exit /b 1
)

REM Проверяем наличие npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm не установлен или не найден в PATH
    pause
    exit /b 1
)

echo ✅ Все необходимые инструменты найдены

REM Устанавливаем Python зависимости
echo 📦 Устанавливаем Python зависимости...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Ошибка установки Python зависимостей
    pause
    exit /b 1
)
cd ..

REM Собираем фронтенд
echo 🔨 Собираем фронтенд...
cd frontend
npm install
if errorlevel 1 (
    echo ❌ Ошибка установки npm зависимостей
    pause
    exit /b 1
)

npm run build
if errorlevel 1 (
    echo ❌ Ошибка сборки фронтенда
    pause
    exit /b 1
)
cd ..

REM Запускаем сервер
echo 🚀 Запускаем сервер...
echo 📱 Фронтенд будет доступен по адресу: http://localhost:8000
echo 🔧 API будет доступен по адресу: http://localhost:8000/api
echo ⏹️  Для остановки сервера нажмите Ctrl+C
echo.

cd backend
python main.py

echo.
echo 👋 Сервер остановлен
pause 