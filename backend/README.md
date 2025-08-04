# SCreate Backend API

Бэкенд для генерации игровых квестов с использованием AI модели.

## Технологии

- **FastAPI** - современный веб-фреймворк для Python
- **Transformers** - библиотека для работы с AI моделями
- **PyTorch** - фреймворк для машинного обучения
- **Pydantic** - валидация данных
- **Uvicorn** - ASGI сервер

## Установка

1. **Создайте виртуальное окружение:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # или
   venv\Scripts\activate     # Windows
   ```

2. **Установите зависимости:**
   ```bash
   pip install -r requirements.txt
   ```

## Запуск

### Разработка
```bash
python run.py
```

### Продакшн
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## API Endpoints

### POST /api/generate-quest
Генерирует квест на основе входных данных.

**Request Body:**
```json
{
  "setting": "fantasy",
  "starting_point": "Древний лес",
  "quest_style": "adventure",
  "custom_setting": null,
  "custom_quest_style": null,
  "file_content": null,
  "input_method": "form"
}
```

**Response:**
```json
{
  "id": "quest-1",
  "title": "Название квеста",
  "description": "Описание квеста",
  "setting": "fantasy",
  "quest_style": "adventure",
  "starting_point": "Древний лес",
  "scenes": [...],
  "characters": [...],
  "locations": [...],
  "items": [...]
}
```

### GET /api/health
Проверка состояния API.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

## Документация API

После запуска сервера документация доступна по адресу:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## AI Модель

Используется модель GPT-2 для генерации текста квестов. При первом запуске модель автоматически загружается.

### Fallback режим
Если модель не может быть загружена, API работает в fallback режиме с предустановленными шаблонами.

## Структура проекта

```
backend/
├── main.py          # Основной файл FastAPI приложения
├── run.py           # Скрипт для запуска
├── requirements.txt # Зависимости Python
└── README.md        # Документация
```

## Интеграция с фронтендом

API настроен для работы с React фронтендом на порту 5173. CORS настроен автоматически.

## Переменные окружения

Создайте файл `.env` для настройки:

```env
# Настройки сервера
HOST=0.0.0.0
PORT=8000

# Настройки модели
MODEL_NAME=gpt2
MAX_LENGTH=200
TEMPERATURE=0.8
``` 