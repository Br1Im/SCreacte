# SCreate - Генератор квестов

Веб-приложение для генерации интерактивных квестов с использованием AI.

## 🚀 Быстрый запуск

### Windows
```bash
start-server.bat
```

### Linux/Mac
```bash
python build-and-run.py
```

### Ручной запуск

1. **Установите зависимости:**
   ```bash
   # Python зависимости
   cd backend
   pip install -r requirements.txt
   
   # Node.js зависимости
   cd ../frontend
   npm install
   ```

2. **Соберите фронтенд:**
   ```bash
   cd frontend
   npm run build
   ```

3. **Запустите сервер:**
   ```bash
   cd backend
   python main.py
   ```

## 📱 Доступ к приложению

После запуска приложение будет доступно по адресу:
- **Фронтенд:** http://localhost:8000
- **API:** http://localhost:8000/api

## 🛠️ Технологии

### Backend
- **FastAPI** - веб-фреймворк
- **Transformers** - AI модели
- **PyTorch** - машинное обучение
- **Pydantic** - валидация данных

### Frontend
- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик
- **Chakra UI** - компоненты
- **Zustand** - управление состоянием

## 📁 Структура проекта

```
SCreacte-main/
├── backend/           # FastAPI сервер
│   ├── main.py       # Основной файл сервера
│   └── requirements.txt
├── frontend/         # React приложение
│   ├── src/
│   ├── package.json
│   └── dist/         # Собранные файлы
├── build-and-run.py  # Скрипт запуска (Linux/Mac)
└── start-server.bat  # Скрипт запуска (Windows)
```

## 🔧 API Endpoints

- `POST /api/generate-quest` - Генерация квеста
- `GET /api/health` - Проверка состояния сервера

## 🎮 Функции

- Генерация квестов по форме
- Загрузка квестов из файла
- Различные сеттинги (фэнтези, киберпанк, хоррор и др.)
- Интерактивный просмотр квестов
- AI-генерация контента

## 📝 Требования

- Python 3.8+
- Node.js 16+
- npm или yarn

## 🐛 Устранение неполадок

1. **Ошибка "Node.js не найден"**
   - Установите Node.js с официального сайта

2. **Ошибка "Python не найден"**
   - Установите Python и добавьте в PATH

3. **Ошибка сборки фронтенда**
   - Удалите node_modules и package-lock.json
   - Выполните `npm install` заново

4. **Ошибка загрузки AI модели**
   - Проверьте интернет-соединение
   - Модель загружается при первом запуске

## 📄 Лицензия

MIT License 