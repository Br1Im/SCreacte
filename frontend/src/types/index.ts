export type Setting = 'fantasy' | 'cyberpunk' | 'post-apocalyptic' | 'sci-fi' | 'horror' | 'western' | 'custom';
export type QuestStyle = 'detective' | 'survival' | 'politics' | 'adventure' | 'romance' | 'horror' | 'custom';

export interface GeneratorInput {
  setting: Setting;
  startingPoint: string;
  questStyle: QuestStyle;
  customSetting?: string;
  customQuestStyle?: string;
}


export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  motivation?: string;
  isEnemy?: boolean;
  isAlly?: boolean;
}

export interface Location {
  id: string;
  name: string;
  description: string;
  characters?: string[];
  items?: string[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  isKey?: boolean;
  effect?: string;
}

export interface Choice {
  id: string;
  text: string;
  nextSceneId: string;
  requiredItems?: string[];
  consequence?: string;
}

export interface Scene {
  id: string;
  title: string;
  description: string;
  locationId: string;
  characters?: string[];
  items?: string[];
  choices: Choice[];
  isEnding?: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  setting: Setting;
  questStyle: QuestStyle;
  startingPoint: string;
  scenes: Scene[];
  characters: Character[];
  locations: Location[];
  items: Item[];
}