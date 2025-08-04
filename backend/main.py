from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, ValidationError
import json
import re
import asyncio
import requests
from typing import Optional, List, Dict, Any
import logging
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "gemma3:4b"
model_loaded = False

app = FastAPI(title="SCreate Quest Generator API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QuestRequest(BaseModel):
    setting: str
    starting_point: str
    quest_style: str
    custom_setting: Optional[str] = None
    custom_quest_style: Optional[str] = None
    scene_count: Optional[int] = 3
    complexity: Optional[str] = "medium"
    tone: Optional[str] = "serious"
    character_count: Optional[int] = 3
    main_goal: Optional[str] = None
    themes: Optional[str] = None

class Character(BaseModel):
    id: str
    name: str
    role: str
    description: str
    motivation: Optional[str] = None
    is_ally: Optional[bool] = None
    is_enemy: Optional[bool] = None

class Location(BaseModel):
    id: str
    name: str
    description: str

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

def safe_json_parse(text: str, fallback_data: Any) -> Any:

    try:

        cleaned_text = re.sub(r'```(?:json)?\s*([\s\S]*?)\s*```', r'\1', text.strip())

        json_match = re.search(r'(\[.*\]|\{.*\})', cleaned_text, re.DOTALL)
        if json_match:
            json_str = json_match.group(1)
            return json.loads(json_str)

        return json.loads(cleaned_text)
    
    except (json.JSONDecodeError, AttributeError) as e:
        logger.warning(f"JSON parsing failed: {e}. Using fallback data.")
        return fallback_data

def validate_and_fix_data(data: List[Dict], required_fields: List[str], data_type: str) -> List[Dict]:

    if not isinstance(data, list):
        logger.warning(f"Expected list for {data_type}, got {type(data)}")
        return []
    
    validated_data = []
    for i, item in enumerate(data):
        if not isinstance(item, dict):
            logger.warning(f"Skipping invalid {data_type} item at index {i}")
            continue
        

        valid_item = True
        for field in required_fields:
            if field not in item:
                logger.warning(f"Missing required field '{field}' in {data_type} item")
                valid_item = False
                break
            if field == 'choices':
                if not isinstance(item[field], list):
                    logger.warning(f"Field '{field}' must be a list in {data_type} item")
                    valid_item = False
                    break
            elif not item[field]:
                logger.warning(f"Missing required field '{field}' in {data_type} item")
                valid_item = False
                break
        
        if valid_item:
            validated_data.append(item)
    
    return validated_data

def fix_scene_references(scenes: List[Dict]) -> List[Dict]:
    """Исправляет ссылки между сценами, чтобы все next_scene_id указывали на существующие сцены"""
    if not scenes:
        return scenes
    
    # Получаем список всех ID сцен
    scene_ids = {scene['id'] for scene in scenes}
    logger.info(f"Available scene IDs: {scene_ids}")
    
    # Исправляем ссылки в choices
    for scene in scenes:
        logger.info(f"Processing scene: {scene['id']}")
        if 'choices' in scene and isinstance(scene['choices'], list):
            logger.info(f"Scene {scene['id']} has {len(scene['choices'])} choices")
            for i, choice in enumerate(scene['choices']):
                if isinstance(choice, dict) and 'next_scene_id' in choice:
                    original_next_scene_id = choice['next_scene_id']
                    logger.info(f"Choice {i+1} in scene {scene['id']} points to: {original_next_scene_id}")
                    # Если ссылка указывает на несуществующую сцену
                    if choice['next_scene_id'] not in scene_ids:
                        logger.warning(f"Invalid scene reference found: {choice['next_scene_id']} in scene {scene['id']}")
                        
                        # Если это не последняя сцена, ссылаемся на следующую по порядку
                        try:
                            current_scene_num = int(scene['id'].split('_')[-1]) if '_' in scene['id'] else 1
                            next_scene_id = f"scene_{current_scene_num + 1}"
                            
                            # Если следующая сцена существует, используем её
                            if next_scene_id in scene_ids:
                                choice['next_scene_id'] = next_scene_id
                                logger.info(f"Fixed choice reference from {original_next_scene_id} to {next_scene_id}")
                            else:
                                # Попробуем найти любую доступную сцену
                                available_scenes = [sid for sid in scene_ids if sid != scene['id']]
                                if available_scenes:
                                    choice['next_scene_id'] = available_scenes[0]
                                    logger.info(f"Fixed choice reference from {original_next_scene_id} to {available_scenes[0]}")
                                else:
                                    # Иначе делаем сцену завершающей
                                    scene['is_ending'] = True
                                    scene['choices'] = []  # Убираем choices для завершающей сцены
                                    logger.info(f"Made scene {scene['id']} an ending scene due to invalid reference")
                                    break
                        except (ValueError, IndexError) as e:
                            logger.error(f"Error parsing scene ID {scene['id']}: {e}")
                            # Делаем сцену завершающей в случае ошибки
                            scene['is_ending'] = True
                            scene['choices'] = []
                            break
                    else:
                        logger.info(f"Valid scene reference: {original_next_scene_id} in scene {scene['id']}")
    
    # Логируем финальное состояние
    logger.info("Final scene structure:")
    for scene in scenes:
        choices_info = []
        if 'choices' in scene and scene['choices']:
            for choice in scene['choices']:
                if isinstance(choice, dict) and 'next_scene_id' in choice:
                    choices_info.append(f"'{choice.get('text', 'No text')}' -> {choice['next_scene_id']}")
        logger.info(f"Scene {scene['id']}: {len(choices_info)} choices - {choices_info}")
    
    return scenes

async def check_ollama_connection() -> bool:

    try:
        response = requests.post(
            OLLAMA_URL,
            json={"model": OLLAMA_MODEL, "prompt": "Test", "stream": False},
            timeout=30
        )
        return response.status_code == 200
    except Exception as e:
        logger.error(f"Ollama connection failed: {e}")
        return False

async def generate_with_ai(prompt: str) -> str:

    global model_loaded
    
    if not model_loaded:
        return "Fallback response due to AI unavailability"
    
    try:
        response = requests.post(
            OLLAMA_URL,
            json={"model": OLLAMA_MODEL, "prompt": prompt, "stream": False},
            timeout=120
        )
        
        if response.status_code == 200:
            return response.json().get("response", "")
        else:
            logger.error(f"AI generation failed with status {response.status_code}")
            return "Fallback response"
    
    except Exception as e:
        logger.error(f"AI generation error: {e}")
        return "Fallback response"

async def generate_quest_description(request: QuestRequest) -> str:
    """Генерирует описание сюжета квеста"""
    setting = request.setting if request.setting != 'custom' else request.custom_setting
    quest_style = request.quest_style if request.quest_style != 'custom' else request.custom_quest_style
    timestamp = int(time.time())
    
    prompt = f"""Создай краткое описание сюжета для квеста в сеттинге "{setting}" стиля "{quest_style}".
    Отправная точка: {request.starting_point}
    {f'Основная цель: {request.main_goal}' if request.main_goal else ''}
    {f'Темы: {request.themes}' if request.themes else ''}
    
    Описание должно быть:
    - Кратким (2-3 предложения)
    - Интригующим
    - Задающим общий тон приключения
    
    Timestamp: {timestamp}
    Верни ТОЛЬКО текст описания, без дополнительного форматирования!"""
    
    try:
        response = await generate_with_ai(prompt)
        return response.strip()
    except Exception as e:
        logger.error(f"Ошибка при генерации описания квеста: {e}")
        return f"Увлекательное приключение в мире {setting}, где вас ждут неожиданные повороты сюжета и сложные выборы."

async def generate_characters(request: QuestRequest) -> List[Dict]:

    setting = request.setting if request.setting != 'custom' else request.custom_setting
    timestamp = int(time.time())
    
    prompt = f"""Создай {request.character_count} персонажей для квеста в сеттинге "{setting}".
    
Верни ТОЛЬКО JSON массив в формате:
    [{{
        "id": "character_1",
        "name": "Уникальное имя",
        "role": "роль",
        "description": "описание",
        "motivation": "мотивация",
        "is_ally": true,
        "is_enemy": false
    }}]
    
    Timestamp: {timestamp}
    ТОЛЬКО JSON, никакого дополнительного текста!"""
    
    ai_response = await generate_with_ai(prompt)
    
    fallback_characters = [{
        "id": f"character_{i+1}",
        "name": f"Персонаж {i+1}",
        "role": "guide",
        "description": "Загадочная фигура",
        "motivation": "Помочь герою",
        "is_ally": True,
        "is_enemy": False
    } for i in range(request.character_count)]
    
    characters = safe_json_parse(ai_response, fallback_characters)
    return validate_and_fix_data(characters, ["id", "name", "role", "description"], "character")

async def generate_locations(request: QuestRequest) -> List[Dict]:

    setting = request.setting if request.setting != 'custom' else request.custom_setting
    timestamp = int(time.time())
    
    prompt = f"""Создай {request.scene_count} локаций для квеста в сеттинге "{setting}".
    Первая локация связана с "{request.starting_point}".
    
    Верни ТОЛЬКО JSON массив в формате:
    [{{
        "id": "location_1",
        "name": "Название локации",
        "description": "Описание локации"
    }}]
    
    Timestamp: {timestamp}
    ТОЛЬКО JSON, никакого дополнительного текста!"""
    
    ai_response = await generate_with_ai(prompt)
    
    fallback_locations = [{
        "id": f"location_{i+1}",
        "name": f"Локация {i+1}",
        "description": "Загадочное место"
    } for i in range(request.scene_count)]
    
    locations = safe_json_parse(ai_response, fallback_locations)
    return validate_and_fix_data(locations, ["id", "name", "description"], "location")

async def generate_items(request: QuestRequest) -> List[Dict]:

    setting = request.setting if request.setting != 'custom' else request.custom_setting
    timestamp = int(time.time())
    
    prompt = f"""Создай 3-5 предметов для квеста в сеттинге "{setting}".
    
    Верни ТОЛЬКО JSON массив в формате:
    [{{
        "id": "item_1",
        "name": "Название предмета",
        "description": "Описание предмета",
        "is_key": true,
        "effect": "Эффект предмета"
    }}]
    
    Timestamp: {timestamp}
    ТОЛЬКО JSON, никакого дополнительного текста!"""
    
    ai_response = await generate_with_ai(prompt)
    
    fallback_items = [{
        "id": f"item_{i+1}",
        "name": f"Предмет {i+1}",
        "description": "Загадочный артефакт",
        "is_key": i == 0,
        "effect": "Неизвестный эффект"
    } for i in range(3)]
    
    items = safe_json_parse(ai_response, fallback_items)
    return validate_and_fix_data(items, ["id", "name", "description"], "item")

async def generate_scenes(request: QuestRequest, characters: List[Dict], locations: List[Dict], items: List[Dict]) -> List[Dict]:

    setting = request.setting if request.setting != 'custom' else request.custom_setting
    quest_style = request.quest_style if request.quest_style != 'custom' else request.custom_quest_style
    timestamp = int(time.time())
    
    char_names = [char['name'] for char in characters[:3]]
    loc_names = [loc['name'] for loc in locations[:3]]
    item_names = [item['name'] for item in items[:3]]
    
    prompt = f"""Создай {request.scene_count} сцен для квеста в сеттинге "{setting}" стиля "{quest_style}".
    Персонажи: {char_names}
    Локации: {loc_names}
    Предметы: {item_names}
    
    Верни ТОЛЬКО JSON массив в формате:
    [{{
        "id": "scene_1",
        "title": "Название сцены",
        "description": "Описание сцены",
        "location_id": "location_1",
        "characters": ["character_1"],
        "items": ["item_1"],
        "choices": [{{
            "id": "choice_1_1",
            "text": "Текст выбора",
            "next_scene_id": "scene_2",
            "consequence": "Последствие"
        }}],
        "is_ending": false
    }}]
    
    Timestamp: {timestamp}
    ТОЛЬКО JSON, никакого дополнительного текста!"""
    
    ai_response = await generate_with_ai(prompt)
    
    fallback_scenes = []
    for i in range(request.scene_count):
        scene = {
            "id": f"scene_{i+1}",
            "title": f"Сцена {i+1}",
            "description": f"Описание сцены {i+1}",
            "location_id": locations[0]['id'] if locations else "location_1",
            "characters": [characters[0]['id']] if characters else [],
            "items": [],
            "is_ending": i == request.scene_count - 1
        }
        
        # Добавляем choices только если это не последняя сцена
        if i < request.scene_count - 1:
            scene["choices"] = [{
                "id": f"choice_{i+1}_1",
                "text": "Продолжить",
                "next_scene_id": f"scene_{i+2}",
                "consequence": "Продолжение истории"
            }]
        else:
            scene["choices"] = []  # Последняя сцена без выборов
            
        fallback_scenes.append(scene)
    
    scenes = safe_json_parse(ai_response, fallback_scenes)
    validated_scenes = validate_and_fix_data(scenes, ["id", "title", "description", "location_id", "choices"], "scene")
    
    # Исправляем ссылки между сценами
    fixed_scenes = fix_scene_references(validated_scenes)
    
    return fixed_scenes

@app.on_event("startup")
async def startup_event():

    global model_loaded
    logger.info("🚀 Запуск SCreate Quest Generator API v2.0")
    
    model_loaded = await check_ollama_connection()
    if model_loaded:
        logger.info(f"✅ Ollama подключена: {OLLAMA_MODEL}")
    else:
        logger.warning("⚠️ Ollama недоступна, используется fallback режим")

@app.post("/api/generate-quest-stream")
async def generate_quest_stream(request: QuestRequest):

    
    async def stream_generator():
        try:

            yield f"data: {json.dumps({'type': 'status', 'content': 'Начинаем генерацию квеста...'}, ensure_ascii=False)}\n\n"
            await asyncio.sleep(0.5)

            title = f"Квест: {request.setting.title() if request.setting != 'custom' else request.custom_setting}"
            yield f"data: {json.dumps({'type': 'title', 'content': title}, ensure_ascii=False)}\n\n"
            await asyncio.sleep(0.5)
            
            # Генерируем описание квеста
            yield f"data: {json.dumps({'type': 'status', 'content': 'Создаём описание сюжета...'}, ensure_ascii=False)}\n\n"
            description = await generate_quest_description(request)
            yield f"data: {json.dumps({'type': 'description', 'content': description}, ensure_ascii=False)}\n\n"
            await asyncio.sleep(0.5)

            yield f"data: {json.dumps({'type': 'status', 'content': 'Создаём персонажей...'}, ensure_ascii=False)}\n\n"
            characters = await generate_characters(request)
            yield f"data: {json.dumps({'type': 'characters', 'content': characters}, ensure_ascii=False)}\n\n"
            await asyncio.sleep(1)

            yield f"data: {json.dumps({'type': 'status', 'content': 'Создаём локации...'}, ensure_ascii=False)}\n\n"
            locations = await generate_locations(request)
            yield f"data: {json.dumps({'type': 'locations', 'content': locations}, ensure_ascii=False)}\n\n"
            await asyncio.sleep(1)

            yield f"data: {json.dumps({'type': 'status', 'content': 'Создаём предметы...'}, ensure_ascii=False)}\n\n"
            items = await generate_items(request)
            yield f"data: {json.dumps({'type': 'items', 'content': items}, ensure_ascii=False)}\n\n"
            await asyncio.sleep(1)

            yield f"data: {json.dumps({'type': 'status', 'content': 'Создаём сцены...'}, ensure_ascii=False)}\n\n"
            scenes = await generate_scenes(request, characters, locations, items)
            
            for i, scene in enumerate(scenes):
                yield f"data: {json.dumps({'type': 'scene', 'content': scene, 'scene_number': i + 1, 'total_scenes': len(scenes)}, ensure_ascii=False)}\n\n"
                await asyncio.sleep(0.5)

            yield f"data: {json.dumps({'type': 'complete', 'content': 'Квест успешно создан!'}, ensure_ascii=False)}\n\n"
            
        except Exception as e:
            logger.error(f"Ошибка при генерации квеста: {e}")
            yield f"data: {json.dumps({'type': 'error', 'content': f'Ошибка: {str(e)}'}, ensure_ascii=False)}\n\n"
    
    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        }
    )

@app.get("/api/health")
async def health_check():

    return {
        "status": "healthy",
        "version": "2.0.0",
        "message": "SCreate Quest Generator API v2.0 работает",
        "model_loaded": model_loaded,
        "ai_mode": f"Ollama ({OLLAMA_MODEL})" if model_loaded else "Fallback"
    }

@app.get("/")
async def root():

    return {"message": "SCreate Quest Generator API v2.0", "docs": "/docs"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)