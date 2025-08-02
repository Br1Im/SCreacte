#!/usr/bin/env python3
"""
Скрипт для сборки фронтенда и запуска единого сервера
"""

import os
import subprocess
import sys
import time

def run_command(command, cwd=None, shell=True):
    """Выполнить команду и вернуть результат"""
    print(f"Выполняем команду: {command}")
    if cwd:
        print(f"В директории: {cwd}")
    
    try:
        result = subprocess.run(command, cwd=cwd, shell=shell, check=True, 
                              capture_output=True, text=True)
        print("✅ Команда выполнена успешно")
        if result.stdout:
            print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка выполнения команды: {e}")
        if e.stdout:
            print("STDOUT:", e.stdout)
        if e.stderr:
            print("STDERR:", e.stderr)
        return False

def check_node_installed():
    """Проверить, установлен ли Node.js"""
    try:
        subprocess.run(["node", "--version"], check=True, capture_output=True)
        subprocess.run(["npm", "--version"], check=True, capture_output=True)
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False

def check_python_dependencies():
    """Проверить и установить Python зависимости"""
    backend_dir = "backend"
    requirements_file = os.path.join(backend_dir, "requirements.txt")
    
    if not os.path.exists(requirements_file):
        print(f"❌ Файл requirements.txt не найден в {backend_dir}")
        return False
    
    print("📦 Устанавливаем Python зависимости...")
    return run_command("pip install -r requirements.txt", cwd=backend_dir)

def build_frontend():
    """Собрать фронтенд"""
    frontend_dir = "frontend"
    
    if not os.path.exists(frontend_dir):
        print(f"❌ Папка фронтенда не найдена: {frontend_dir}")
        return False
    
    print("🔨 Собираем фронтенд...")
    
    # Устанавливаем зависимости
    if not run_command("npm install", cwd=frontend_dir):
        return False
    
    # Собираем проект
    if not run_command("npm run build", cwd=frontend_dir):
        return False
    
    return True

def start_server():
    """Запустить сервер"""
    backend_dir = "backend"
    
    if not os.path.exists(backend_dir):
        print(f"❌ Папка бэкенда не найдена: {backend_dir}")
        return False
    
    print("🚀 Запускаем сервер...")
    print("📱 Фронтенд будет доступен по адресу: http://localhost:8000")
    print("🔧 API будет доступен по адресу: http://localhost:8000/api")
    print("⏹️  Для остановки сервера нажмите Ctrl+C")
    
    try:
        subprocess.run([sys.executable, "main.py"], cwd=backend_dir, check=True)
    except KeyboardInterrupt:
        print("\n👋 Сервер остановлен")
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка запуска сервера: {e}")
        return False
    
    return True

def main():
    """Основная функция"""
    print("🎮 SCreate - Генератор квестов")
    print("=" * 50)
    
    # Проверяем Node.js
    if not check_node_installed():
        print("❌ Node.js не установлен. Установите Node.js для сборки фронтенда.")
        return False
    
    # Устанавливаем Python зависимости
    if not check_python_dependencies():
        print("❌ Не удалось установить Python зависимости")
        return False
    
    # Собираем фронтенд
    if not build_frontend():
        print("❌ Не удалось собрать фронтенд")
        return False
    
    # Запускаем сервер
    return start_server()

if __name__ == "__main__":
    success = main()
    if not success:
        sys.exit(1) 