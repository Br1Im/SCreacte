#!/usr/bin/env python3
"""
Скрипт для запуска FastAPI бэкенда SCreate
"""

import uvicorn
from main import app

if __name__ == "__main__":
    print("🚀 Запуск SCreate API сервера...")
    print("📖 Документация API: http://localhost:8000/docs")
    print("🔍 Health check: http://localhost:8000/api/health")
    
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True,  # Автоперезагрузка при изменениях
        log_level="info"
    ) 