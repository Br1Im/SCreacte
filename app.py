import requests
import json
import sys
import time

url = "http://localhost:11434/api/generate"

# Создаем разнообразный промпт
import random

settings = [
    "киберпанк в неоновом мегаполисе", "фэнтези в магическом королевстве", 
    "постапокалипсис в разрушенном мире", "космическая опера в далекой галактике",
    "хоррор в проклятом особняке", "дикий запад в приграничном городке"
]

protagonists = [
    "хакер-одиночка", "молодой маг", "выживший из убежища", 
    "капитан звездолета", "паранормальный исследователь", "одинокий стрелок"
]

goals = [
    "украсть секретные данные корпорации", "найти легендарный артефакт", 
    "найти безопасное убежище", "исследовать неизвестную планету",
    "изгнать злого духа", "поймать опасного преступника"
]

locations = [
    "заброшенная корпоративная башня", "древний храм в лесу", 
    "руины мегаполиса", "космическая станция", 
    "старинное кладбище", "салун в пыльном городке"
]

# Случайно выбираем элементы
chosen_setting = random.choice(settings)
chosen_protagonist = random.choice(protagonists)
chosen_goal = random.choice(goals)
chosen_location = random.choice(locations)

detailed_prompt = f"""Создай увлекательный интерактивный квест на русском языке.

СЕТТИНГ: {chosen_setting}
ГЛАВНЫЙ ГЕРОЙ: {chosen_protagonist}
ОТПРАВНАЯ ТОЧКА: {chosen_location}
ЦЕЛЬ: {chosen_goal}

Требования:
1. Создай захватывающую историю с неожиданными поворотами
2. Разработай интересных персонажей с собственными мотивами
3. Добавь атмосферные описания локаций
4. Включи моральные дилеммы и сложные выборы
5. Создай логичную структуру из 6 сцен в JSON формате
6. Каждая сцена должна содержать scene_id, text и choices
7. Добавь элементы неожиданности и интриги
8. Сделай концовку зависящей от выборов игрока

Верни ТОЛЬКО JSON структуру без дополнительного текста."""

payload = {
    "model": "gemma3:4b",
    "prompt": detailed_prompt,
    "stream": True
}

accumulated_text = ""

with requests.post(url, json=payload, stream=True) as response:
    for line in response.iter_lines():
        if line:
            try:
                data = json.loads(line)
                chunk = data.get("response", "")
                if chunk:
                    # Выводим полученный фрагмент без перехода на новую строку
                    print(chunk, end="", flush=True)
                    accumulated_text += chunk
                if data.get("done", False):
                    break
            except json.JSONDecodeError:
                # Иногда может прийти неполный JSON — пропускаем
                continue

print("\n\n--- Генерация завершена ---\n")

# Парсим и форматируем итог, если нужно
try:
    quest_data = json.loads(accumulated_text)
    print("Собранный JSON квеста:")
    print(json.dumps(quest_data, ensure_ascii=False, indent=2))
except json.JSONDecodeError as e:
    print("Ошибка при разборе итогового JSON:", e)
    print("Текст, который пытались разобрать:")
    print(accumulated_text)
