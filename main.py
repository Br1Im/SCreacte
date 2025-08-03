from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import json
import re
import os
from typing import Optional, List, Dict, Any
import logging
from fastapi.responses import JSONResponse
from fastapi.requests import Request
from fastapi.exception_handlers import RequestValidationError
from fastapi.exceptions import HTTPException as FastAPIHTTPException
import string
from sqlalchemy import Column, Integer, String, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta

DATABASE_URL = "sqlite:///./screate.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SCreate Quest Generator API", version="1.0.0")

# Настройка CORS для работы с React фронтендом
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Разрешаем все источники для единого сервера
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Запуск сервера SCreate...")
    
    # Подключение статических файлов фронтенда
    frontend_dist_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
    if os.path.exists(frontend_dist_path):
        app.mount("/", StaticFiles(directory=frontend_dist_path, html=True), name="static")
        logger.info(f"✅ Фронтенд подключен из: {frontend_dist_path}")
    else:
        logger.warning(f"⚠️  Папка фронтенда не найдена: {frontend_dist_path}")
        logger.info("💡 Запустите 'npm run build' в папке frontend для сборки")

# Модели данных
class QuestRequest(BaseModel):
    setting: str
    starting_point: str
    quest_style: str
    custom_setting: Optional[str] = None
    custom_quest_style: Optional[str] = None
    file_content: Optional[str] = None
    input_method: str = "form"

class Character(BaseModel):
    id: str
    name: str
    role: str
    description: str
    motivation: Optional[str] = None
    is_enemy: Optional[bool] = None
    is_ally: Optional[bool] = None

class Location(BaseModel):
    id: str
    name: str
    description: str
    characters: Optional[List[str]] = None
    items: Optional[List[str]] = None

class Item(BaseModel):
    id: str
    name: str
    description: str
    is_key: Optional[bool] = None
    effect: Optional[str] = None

class Choice(BaseModel):
    id: str
    text: str
    next_scene_id: str
    required_items: Optional[List[str]] = None
    consequence: Optional[str] = None

class Scene(BaseModel):
    id: str
    title: str
    description: str
    location_id: str
    characters: Optional[List[str]] = None
    items: Optional[List[str]] = None
    choices: List[Choice]
    is_ending: Optional[bool] = None

class QuestResponse(BaseModel):
    id: str
    title: str
    description: str
    setting: str
    quest_style: str
    starting_point: str
    scenes: List[Scene]
    characters: List[Character]
    locations: List[Location]
    items: List[Item]

def parse_file_content(content: str) -> Dict[str, Any]:
    """Парсинг содержимого файла для извлечения параметров"""
    result = {
        "setting": "fantasy",
        "starting_point": "",
        "quest_style": "adventure",
        "description": "",
        "title": "Приключение в неизвестном мире"
    }
    
    # Извлекаем сеттинг
    setting_match = re.search(r'СЕТТИНГ:\s*(.+)', content, re.IGNORECASE)
    if setting_match:
        setting = setting_match.group(1).strip().lower()
        if 'фэнтези' in setting:
            result["setting"] = "fantasy"
        elif 'киберпанк' in setting:
            result["setting"] = "cyberpunk"
        elif 'постапокалипсис' in setting:
            result["setting"] = "post-apocalyptic"
        elif 'научная фантастика' in setting or 'sci-fi' in setting:
            result["setting"] = "sci-fi"
        elif 'хоррор' in setting:
            result["setting"] = "horror"
        elif 'вестерн' in setting:
            result["setting"] = "western"
    
    # Извлекаем отправную точку
    starting_point_match = re.search(r'ОТПРАВНАЯ ТОЧКА:\s*(.+)', content, re.IGNORECASE)
    if starting_point_match:
        result["starting_point"] = starting_point_match.group(1).strip()
    
    # Извлекаем стиль квеста
    quest_style_match = re.search(r'СТИЛЬ КВЕСТА:\s*(.+)', content, re.IGNORECASE)
    if quest_style_match:
        quest_style = quest_style_match.group(1).strip().lower()
        if 'детектив' in quest_style:
            result["quest_style"] = "detective"
        elif 'выживание' in quest_style:
            result["quest_style"] = "survival"
        elif 'политика' in quest_style:
            result["quest_style"] = "politics"
        elif 'приключение' in quest_style:
            result["quest_style"] = "adventure"
        elif 'романтика' in quest_style:
            result["quest_style"] = "romance"
        elif 'хоррор' in quest_style:
            result["quest_style"] = "horror"
    
    # Извлекаем описание мира
    description_match = re.search(r'ОПИСАНИЕ МИРА:\s*([\s\S]*?)(?=\n\n|\n[А-Я]|$)', content, re.IGNORECASE)
    if description_match:
        result["description"] = description_match.group(1).strip()
    
    # Извлекаем основную историю для заголовка
    story_match = re.search(r'ОСНОВНАЯ ИСТОРИЯ:\s*([\s\S]*?)(?=\n\n|\n[А-Я]|$)', content, re.IGNORECASE)
    if story_match:
        story_text = story_match.group(1).strip()
        first_sentence = story_text.split('.')[0]
        if first_sentence:
            result["title"] = first_sentence.strip()
    
    return result

def generate_quest_with_ai(prompt: str) -> str:
    """Генерация текста с помощью простой логики"""
    # Простая генерация без AI модели
    setting_keywords = {
        "fantasy": ["магический", "древний", "зачарованный", "мистический"],
        "cyberpunk": ["технологичный", "футуристический", "цифровой", "неоновый"],
        "post-apocalyptic": ["разрушенный", "заброшенный", "опасный", "выживание"],
        "sci-fi": ["космический", "инопланетный", "научный", "футуристический"],
        "horror": ["жуткий", "темный", "пугающий", "зловещий"],
        "western": ["дикий", "ковбойский", "пустынный", "приключенческий"]
    }
    
    quest_keywords = {
        "adventure": ["приключение", "исследование", "открытие"],
        "detective": ["расследование", "загадка", "тайна"],
        "survival": ["выживание", "опасность", "борьба"],
        "politics": ["интриги", "власть", "дипломатия"],
        "romance": ["романтика", "чувства", "отношения"],
        "horror": ["ужас", "напряжение", "страх"]
    }
    
    # Извлекаем сеттинг и стиль из промпта
    setting = "fantasy"
    quest_style = "adventure"
    
    for key, keywords in setting_keywords.items():
        if any(keyword in prompt.lower() for keyword in keywords):
            setting = key
            break
    
    for key, keywords in quest_keywords.items():
        if any(keyword in prompt.lower() for keyword in keywords):
            quest_style = key
            break
    
    # Генерируем описание на основе ключевых слов
    setting_desc = setting_keywords.get(setting, ["увлекательный"])[0]
    quest_desc = quest_keywords.get(quest_style, ["захватывающий"])[0]
    
    return f"Это {setting_desc} мир, где вас ждет {quest_desc} квест. {prompt[:100]}..."

def create_mock_quest(request: QuestRequest) -> QuestResponse:
    """Создание квеста на основе запроса"""
    
    # Если есть содержимое файла, парсим его
    if request.input_method == "file" and request.file_content:
        parsed = parse_file_content(request.file_content)
        setting = parsed["setting"]
        starting_point = parsed["starting_point"] or request.starting_point
        quest_style = parsed["quest_style"]
        description = parsed["description"] or "Захватывающее приключение в неизвестном мире"
        title = parsed["title"]
    else:
        setting = request.setting
        starting_point = request.starting_point
        quest_style = request.quest_style
        description = "Захватывающее приключение в неизвестном мире"
        title = "Поиск артефакта"
    
    # Создаем промпт для AI генерации
    prompt = f"Create a quest in {setting} setting starting at {starting_point} with {quest_style} style"
    
    # Генерируем дополнительное описание с помощью AI
    ai_description = generate_quest_with_ai(prompt)
    
    # Создаем квест
    quest = QuestResponse(
        id="quest-1",
        title=title,
        description=description,
        setting=setting,
        quest_style=quest_style,
        starting_point=starting_point,
        scenes=[
            Scene(
                id="scene-1",
                title="Начало пути",
                description=f"Вы находитесь в {starting_point}. {ai_description[:200]}...",
                location_id="loc-1",
                characters=["char-1"],
                choices=[
                    Choice(id="choice-1", text="Исследовать окрестности", next_scene_id="scene-2"),
                    Choice(id="choice-2", text="Поговорить с местными", next_scene_id="scene-3"),
                ]
            ),
            Scene(
                id="scene-2",
                title="Исследование",
                description="Вы обнаруживаете интересные следы, ведущие вглубь территории.",
                location_id="loc-2",
                choices=[
                    Choice(id="choice-3", text="Следовать по следам", next_scene_id="scene-4"),
                    Choice(id="choice-4", text="Вернуться назад", next_scene_id="scene-1"),
                ]
            ),
            Scene(
                id="scene-3",
                title="Разговор с местными",
                description="Местные жители рассказывают о странных событиях в последнее время.",
                location_id="loc-1",
                characters=["char-1"],
                choices=[
                    Choice(id="choice-5", text="Узнать больше", next_scene_id="scene-4"),
                    Choice(id="choice-6", text="Покинуть это место", next_scene_id="scene-5", is_ending=True),
                ]
            ),
            Scene(
                id="scene-4",
                title="Тайна раскрывается",
                description="Вы находите ключ к разгадке тайны этого места.",
                location_id="loc-3",
                items=["item-1"],
                choices=[
                    Choice(id="choice-7", text="Продолжить приключение", next_scene_id="scene-6"),
                ]
            ),
            Scene(
                id="scene-5",
                title="Конец пути",
                description="Вы решаете покинуть это место и вернуться к обычной жизни.",
                location_id="loc-1",
                choices=[],
                is_ending=True
            ),
            Scene(
                id="scene-6",
                title="Финальная битва",
                description="Вы сталкиваетесь с главным антагонистом и должны сделать выбор.",
                location_id="loc-4",
                characters=["char-2"],
                choices=[
                    Choice(id="choice-8", text="Сражаться", next_scene_id="scene-7"),
                    Choice(id="choice-9", text="Попытаться договориться", next_scene_id="scene-8"),
                ]
            ),
            Scene(
                id="scene-7",
                title="Победа",
                description="Вы побеждаете зло и спасаете мир!",
                location_id="loc-4",
                choices=[],
                is_ending=True
            ),
            Scene(
                id="scene-8",
                title="Мирное решение",
                description="Вам удается найти мирное решение конфликта.",
                location_id="loc-4",
                choices=[],
                is_ending=True
            )
        ],
        characters=[
            Character(
                id="char-1",
                name="Местный житель",
                role="Информатор",
                description="Дружелюбный местный житель, готовый помочь",
                is_ally=True
            ),
            Character(
                id="char-2",
                name="Темный лорд",
                role="Антагонист",
                description="Могущественный злодей, угрожающий миру",
                is_enemy=True
            )
        ],
        locations=[
            Location(
                id="loc-1",
                name=starting_point,
                description=f"Начальная точка вашего приключения: {starting_point}"
            ),
            Location(
                id="loc-2",
                name="Загадочная территория",
                description="Странное место с необычными следами"
            ),
            Location(
                id="loc-3",
                name="Секретная комната",
                description="Скрытое помещение с важными артефактами"
            ),
            Location(
                id="loc-4",
                name="Финальная арена",
                description="Место решающей битвы"
            )
        ],
        items=[
            Item(
                id="item-1",
                name="Древний ключ",
                description="Магический ключ, открывающий тайны",
                is_key=True
            )
        ]
    )
    
    return quest

# Безопасность: проверка текста файла
def is_safe_text(text):
    allowed = set(string.printable + "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ \n\r\t")
    return all(c in allowed for c in text)

from pydantic import BaseModel as PydanticBaseModel
class UserCreate(PydanticBaseModel):
    username: str
    password: str

class Token(PydanticBaseModel):
    access_token: str
    token_type: str

class TokenData(PydanticBaseModel):
    username: str | None = None

SECRET_KEY = "supersecretkey"  # Лучше вынести в .env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/login")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user_by_username(db, username: str):
    return db.query(User).filter(User.username == username).first()

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    db = SessionLocal()
    user = get_user_by_username(db, username=token_data.username)
    db.close()
    if user is None:
        raise credentials_exception
    return user

@app.post("/api/register")
async def register(user: UserCreate):
    db = SessionLocal()
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        db.close()
        raise HTTPException(status_code=400, detail="Пользователь с таким именем уже существует")
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    db.close()
    logger.info(f"Зарегистрирован новый пользователь: {user.username}")
    return {"username": new_user.username, "id": new_user.id}

@app.post("/api/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db = SessionLocal()
    user = get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        db.close()
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token(data={"sub": user.username})
    db.close()
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/generate-quest", response_model=QuestResponse)
async def generate_quest(request: QuestRequest):
    """Эндпоинт для генерации квеста"""
    try:
        logger.info(f"Получен запрос на генерацию квеста: {request.input_method}")
        
        # Валидация входных данных
        if request.input_method == "form" and not request.starting_point:
            raise HTTPException(status_code=400, detail="Необходимо указать отправную точку")
        
        if request.input_method == "file":
            if not request.file_content:
                raise HTTPException(status_code=400, detail="Необходимо загрузить файл")
            if len(request.file_content) > 1_000_000:
                raise HTTPException(status_code=400, detail="Файл слишком большой (макс. 1 МБ)")
            if not is_safe_text(request.file_content):
                raise HTTPException(status_code=400, detail="Недопустимые символы в файле")
        
        # Генерируем квест
        quest = create_mock_quest(request)
        
        logger.info(f"Квест успешно сгенерирован: {quest.title}")
        return quest
        
    except Exception as e:
        logger.error(f"Ошибка при генерации квеста: {e}")
        raise HTTPException(status_code=500, detail=f"Ошибка при генерации квеста: {str(e)}")

@app.get("/api/health")
async def health_check():
    """Проверка состояния API"""
    return {
        "status": "healthy",
        "version": "1.0.0",
        "message": "SCreate Quest Generator API работает"
    }

@app.get("/")
async def serve_frontend():
    """Сервис главной страницы фронтенда"""
    frontend_dist_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist", "index.html")
    if os.path.exists(frontend_dist_path):
        return FileResponse(frontend_dist_path)
    else:
        return {"message": "Frontend not built. Run 'npm run build' in frontend directory"}

# Глобальные обработчики ошибок
@app.exception_handler(FastAPIHTTPException)
async def http_exception_handler(request: Request, exc: FastAPIHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.status_code, "message": exc.detail, "details": None},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"code": 422, "message": "Validation error", "details": exc.errors()},
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"code": 500, "message": "Internal server error", "details": str(exc)},
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 