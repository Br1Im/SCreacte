export const Setting = {
  FANTASY: 'fantasy',
  CYBERPUNK: 'cyberpunk',
  POST_APOCALYPTIC: 'post-apocalyptic',
  SCI_FI: 'sci-fi',
  HORROR: 'horror',
  WESTERN: 'western',
  CUSTOM: 'custom'
};

export const QuestStyle = {
  DETECTIVE: 'detective',
  SURVIVAL: 'survival',
  POLITICS: 'politics',
  ADVENTURE: 'adventure',
  ROMANCE: 'romance',
  HORROR: 'horror',
  CUSTOM: 'custom'
};


export class GeneratorInput {
  constructor(setting, startingPoint, questStyle, customSetting, customQuestStyle) {
    this.setting = setting;
    this.startingPoint = startingPoint;
    this.questStyle = questStyle;
    this.customSetting = customSetting;
    this.customQuestStyle = customQuestStyle;
  }
}

export class Character {
  constructor(id, name, role, description, motivation, isEnemy, isAlly) {
    this.id = id;
    this.name = name;
    this.role = role;
    this.description = description;
    this.motivation = motivation;
    this.isEnemy = isEnemy;
    this.isAlly = isAlly;
  }
}

export class Location {
  constructor(id, name, description, characters, items) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.characters = characters;
    this.items = items;
  }
}

export class Item {
  constructor(id, name, description, isKey, effect) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.isKey = isKey;
    this.effect = effect;
  }
}

export class Choice {
  constructor(id, text, nextSceneId, requiredItems, consequence) {
    this.id = id;
    this.text = text;
    this.nextSceneId = nextSceneId;
    this.requiredItems = requiredItems;
    this.consequence = consequence;
  }
}

export class Scene {
  constructor(id, title, description, locationId, characters, items, choices, isEnding) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.locationId = locationId;
    this.characters = characters;
    this.items = items;
    this.choices = choices;
    this.isEnding = isEnding;
  }
}

export class Quest {
  constructor(id, title, description, setting, questStyle, startingPoint, scenes, characters, locations, items) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.setting = setting;
    this.questStyle = questStyle;
    this.startingPoint = startingPoint;
    this.scenes = scenes;
    this.characters = characters;
    this.locations = locations;
    this.items = items;
  }
}