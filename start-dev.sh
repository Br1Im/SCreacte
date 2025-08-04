#!/bin/bash

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода с цветом
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка наличия необходимых команд
check_requirements() {
    print_status "Проверка требований..."
    
    if ! command -v python3 &> /dev/null; then
        print_error "Python3 не найден. Установите Python 3.8+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm не найден. Установите Node.js"
        exit 1
    fi
    
    print_success "Все требования выполнены"
}

# Проверка существования директорий
check_directories() {
    print_status "Проверка структуры проекта..."
    
    if [ ! -d "backend" ]; then
        print_error "Директория 'backend' не найдена"
        exit 1
    fi
    
    if [ ! -d "frontend" ]; then
        print_error "Директория 'frontend' не найдена"
        exit 1
    fi
    
    print_success "Структура проекта корректна"
}

# Проверка виртуального окружения Python
check_python_env() {
    print_status "Проверка Python окружения..."
    
    cd backend
    
    if [ ! -d "venv" ]; then
        print_warning "Виртуальное окружение не найдено. Создаю..."
        python3 -m venv venv
        if [ $? -ne 0 ]; then
            print_error "Не удалось создать виртуальное окружение"
            exit 1
        fi
    fi
    
    # Активация виртуального окружения
    source venv/bin/activate
    
    # Проверка установленных пакетов
    if ! python -c "import fastapi" 2>/dev/null; then
        print_warning "Зависимости Python не установлены. Устанавливаю..."
        pip install -r requirements.txt
        if [ $? -ne 0 ]; then
            print_error "Не удалось установить зависимости Python"
            exit 1
        fi
    fi
    
    cd ..
    print_success "Python окружение готово"
}

# Проверка зависимостей Node.js
check_node_deps() {
    print_status "Проверка Node.js зависимостей..."
    
    cd frontend
    
    if [ ! -d "node_modules" ]; then
        print_warning "Node.js зависимости не установлены. Устанавливаю..."
        npm install
        if [ $? -ne 0 ]; then
            print_error "Не удалось установить Node.js зависимости"
            exit 1
        fi
    fi
    
    cd ..
    print_success "Node.js зависимости готовы"
}

# Запуск бэкенда
start_backend() {
    print_status "Запуск бэкенда..."
    
    cd backend
    source venv/bin/activate
    
    # Запуск в фоне с перенаправлением вывода
    python run.py > ../backend.log 2>&1 &
    BACKEND_PID=$!
    
    cd ..
    
    # Проверка, что процесс запустился
    sleep 2
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        print_error "Не удалось запустить бэкенд"
        cat backend.log
        exit 1
    fi
    
    print_success "Бэкенд запущен (PID: $BACKEND_PID)"
}

# Ожидание готовности бэкенда
wait_for_backend() {
    print_status "Ожидание готовности бэкенда..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:8000/api/health > /dev/null 2>&1; then
            print_success "Бэкенд готов к работе"
            return 0
        fi
        
        print_status "Попытка $attempt/$max_attempts..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Бэкенд не отвечает после $max_attempts попыток"
    return 1
}

# Запуск фронтенда
start_frontend() {
    print_status "Запуск фронтенда..."
    
    cd frontend
    
    # Запуск в фоне с перенаправлением вывода
    npm run dev > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    
    cd ..
    
    # Проверка, что процесс запустился
    sleep 2
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        print_error "Не удалось запустить фронтенд"
        cat frontend.log
        exit 1
    fi
    
    print_success "Фронтенд запущен (PID: $FRONTEND_PID)"
}

# Функция для корректного завершения
cleanup() {
    echo
    print_status "Остановка серверов..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        print_status "Остановка бэкенда (PID: $BACKEND_PID)..."
        kill $BACKEND_PID 2>/dev/null
        wait $BACKEND_PID 2>/dev/null
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        print_status "Остановка фронтенда (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID 2>/dev/null
        wait $FRONTEND_PID 2>/dev/null
    fi
    
    # Удаление лог-файлов
    rm -f backend.log frontend.log
    
    print_success "Все серверы остановлены"
    exit 0
}

# Основная функция
main() {
    echo "========================================"
    echo "   SCreate - Запуск в режиме разработки"
    echo "========================================"
    echo
    
    # Перехват сигналов для корректного завершения
    trap cleanup SIGINT SIGTERM
    
    # Проверки
    check_requirements
    check_directories
    check_python_env
    check_node_deps
    
    # Запуск серверов
    start_backend
    wait_for_backend || exit 1
    start_frontend
    
    echo
    echo "========================================"
    print_success "Проект запущен!"
    echo "========================================"
    echo
    echo -e "${GREEN}Frontend:${NC} http://localhost:5173"
    echo -e "${GREEN}Backend API:${NC} http://localhost:8000"
    echo -e "${GREEN}API Docs:${NC} http://localhost:8000/docs"
    echo
    print_status "Нажмите Ctrl+C для остановки..."
    echo
    
    # Ожидание завершения
    wait
}

# Запуск основной функции
main "$@" 