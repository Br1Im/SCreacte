import { create } from 'zustand';
<<<<<<< HEAD
import { GeneratorInput, Quest } from '../types/generator.js';

interface GeneratorState {

  input: GeneratorInput;

  generatedQuest: Quest | null;

  isLoading: boolean;

  error: string | null;
  

=======
import type { GeneratorInput, Quest } from '../types/generator.js';

interface GeneratorState {
  input: GeneratorInput;
  generatedQuest: Quest | null;
  isLoading: boolean;
  error: string | null;
  
>>>>>>> 6b47bff (Второй коммит))))
  setInput: (input: Partial<GeneratorInput>) => void;
  resetInput: () => void;
  generateQuest: () => Promise<void>;
  resetQuest: () => void;
}

<<<<<<< HEAD

=======
>>>>>>> 6b47bff (Второй коммит))))
const defaultInput: GeneratorInput = {
  setting: 'fantasy',
  startingPoint: '',
  questStyle: 'adventure',
  customSetting: '',
  customQuestStyle: '',
<<<<<<< HEAD
};


=======
  fileContent: '',
  inputMethod: 'form',
};

>>>>>>> 6b47bff (Второй коммит))))
export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  input: { ...defaultInput },
  generatedQuest: null,
  isLoading: false,
  error: null,
  
<<<<<<< HEAD

=======
>>>>>>> 6b47bff (Второй коммит))))
  setInput: (input) => set((state) => ({
    input: { ...state.input, ...input },
  })),
  
<<<<<<< HEAD

  resetInput: () => set({ input: { ...defaultInput } }),
  

  generateQuest: async () => {
    const { input } = get();
    

    if (!input.startingPoint) {
      set({ error: 'Необходимо указать отправную точку' });
      return;
    }
=======
  resetInput: () => set({ input: { ...defaultInput } }),
  
  generateQuest: async () => {
    const { input } = get();
    
    console.log('generateQuest called with input:', input);

    if (input.inputMethod === 'form' && !input.startingPoint) {
      set({ error: 'Необходимо указать отправную точку' });
      return;
    }

    if (input.inputMethod === 'file' && !input.fileContent) {
      set({ error: 'Необходимо загрузить файл' });
      return;
    }
>>>>>>> 6b47bff (Второй коммит))))
    
    set({ isLoading: true, error: null });
    
    try {
<<<<<<< HEAD
  
  
      await new Promise(resolve => setTimeout(resolve, 2000));
      

      const mockQuest: Quest = {
        id: 'quest-1',
        title: 'Поиск артефакта',
        description: 'В мире, охваченном тьмой, вы должны найти древний артефакт, способный восстановить свет.',
        setting: input.setting,
        questStyle: input.questStyle,
        startingPoint: input.startingPoint,
        scenes: [
          {
            id: 'scene-1',
            title: 'Начало пути',
            description: `Вы находитесь в ${input.startingPoint}. Вокруг вас суета и шум. К вам подходит старец и рассказывает о древнем артефакте.`,
            locationId: 'loc-1',
            characters: ['char-1'],
            choices: [
              { id: 'choice-1', text: 'Расспросить подробнее о артефакте', nextSceneId: 'scene-2' },
              { id: 'choice-2', text: 'Отказаться от задания', nextSceneId: 'scene-3' },
            ],
          },
          {
            id: 'scene-2',
            title: 'Поиски информации',
            description: 'Старец рассказывает вам о древней библиотеке, где можно найти больше информации об артефакте.',
            locationId: 'loc-1',
            characters: ['char-1'],
            choices: [
              { id: 'choice-3', text: 'Отправиться в библиотеку', nextSceneId: 'scene-4' },
              { id: 'choice-4', text: 'Поискать информацию в таверне', nextSceneId: 'scene-5' },
            ],
          },
          {
            id: 'scene-3',
            title: 'Отказ',
            description: 'Вы решаете не ввязываться в эту историю. Старец уходит с разочарованием.',
            locationId: 'loc-1',
            choices: [],
            isEnding: true,
          },
          {
            id: 'scene-4',
            title: 'Библиотека',
            description: 'В древней библиотеке вы находите манускрипт, описывающий местонахождение артефакта в пещерах на севере.',
            locationId: 'loc-2',
            items: ['item-1'],
            choices: [
              { id: 'choice-5', text: 'Отправиться к пещерам', nextSceneId: 'scene-6' },
              { id: 'choice-6', text: 'Показать манускрипт старцу', nextSceneId: 'scene-7' },
            ],
          },
          {
            id: 'scene-5',
            title: 'Таверна',
            description: 'В таверне вы встречаете странного путешественника, который утверждает, что знает о артефакте.',
            locationId: 'loc-3',
            characters: ['char-2'],
            choices: [
              { id: 'choice-7', text: 'Довериться путешественнику', nextSceneId: 'scene-8' },
              { id: 'choice-8', text: 'Отказаться от его помощи', nextSceneId: 'scene-4' },
            ],
          },
          {
            id: 'scene-6',
            title: 'Пещеры',
            description: 'Вы достигаете пещер и находите древний храм внутри. Вход охраняет каменный голем.',
            locationId: 'loc-4',
            characters: ['char-3'],
            choices: [
              { id: 'choice-9', text: 'Попытаться обойти голема', nextSceneId: 'scene-9' },
              { id: 'choice-10', text: 'Атаковать голема', nextSceneId: 'scene-10' },
            ],
          },
          {
            id: 'scene-7',
            title: 'Возвращение к старцу',
            description: 'Старец изучает манускрипт и предупреждает об опасностях, которые ждут вас в пещерах.',
            locationId: 'loc-1',
            characters: ['char-1'],
            choices: [
              { id: 'choice-11', text: 'Всё равно отправиться к пещерам', nextSceneId: 'scene-6' },
              { id: 'choice-12', text: 'Попросить старца о помощи', nextSceneId: 'scene-11' },
            ],
          },
          {
            id: 'scene-8',
            title: 'Ловушка',
            description: 'Путешественник заводит вас в ловушку и оказывается приспешником тёмных сил.',
            locationId: 'loc-5',
            characters: ['char-2', 'char-4'],
            choices: [
              { id: 'choice-13', text: 'Попытаться сбежать', nextSceneId: 'scene-12' },
              { id: 'choice-14', text: 'Сражаться', nextSceneId: 'scene-13' },
            ],
          },
          {
            id: 'scene-9',
            title: 'Храм',
            description: 'Вам удаётся обойти голема и проникнуть в храм. В центре на постаменте лежит артефакт.',
            locationId: 'loc-6',
            items: ['item-2'],
            choices: [
              { id: 'choice-15', text: 'Взять артефакт', nextSceneId: 'scene-14' },
              { id: 'choice-16', text: 'Осмотреться внимательнее', nextSceneId: 'scene-15' },
            ],
          },
          {
            id: 'scene-10',
            title: 'Битва с големом',
            description: 'Вы вступаете в битву с големом, но он слишком силён. Вам приходится отступить.',
            locationId: 'loc-4',
            characters: ['char-3'],
            choices: [
              { id: 'choice-17', text: 'Искать другой путь', nextSceneId: 'scene-9' },
              { id: 'choice-18', text: 'Вернуться к старцу', nextSceneId: 'scene-7' },
            ],
          },
          {
            id: 'scene-11',
            title: 'Помощь старца',
            description: 'Старец даёт вам амулет, который поможет усмирить голема.',
            locationId: 'loc-1',
            characters: ['char-1'],
            items: ['item-3'],
            choices: [
              { id: 'choice-19', text: 'Отправиться к пещерам', nextSceneId: 'scene-16' },
            ],
          },
          {
            id: 'scene-12',
            title: 'Побег',
            description: 'Вам удаётся сбежать от тёмных сил, но вы ранены.',
            locationId: 'loc-7',
            choices: [
              { id: 'choice-20', text: 'Искать помощи', nextSceneId: 'scene-17' },
              { id: 'choice-21', text: 'Продолжить путь к пещерам', nextSceneId: 'scene-6' },
            ],
          },
          {
            id: 'scene-13',
            title: 'Поражение',
            description: 'Вы сражаетесь отважно, но силы неравны. Тьма поглощает вас.',
            locationId: 'loc-5',
            choices: [],
            isEnding: true,
          },
          {
            id: 'scene-14',
            title: 'Проклятие',
            description: 'Как только вы касаетесь артефакта, древнее проклятие активируется. Вы становитесь его новым хранителем, обречённым на вечность в храме.',
            locationId: 'loc-6',
            choices: [],
            isEnding: true,
          },
          {
            id: 'scene-15',
            title: 'Разгадка',
            description: 'Осмотревшись, вы замечаете древние письмена, предупреждающие о проклятии. Вы находите способ безопасно извлечь артефакт.',
            locationId: 'loc-6',
            items: ['item-2'],
            choices: [
              { id: 'choice-22', text: 'Взять артефакт и вернуться', nextSceneId: 'scene-18' },
            ],
          },
          {
            id: 'scene-16',
            title: 'Усмирение голема',
            description: 'С помощью амулета вы усмиряете голема, и он пропускает вас в храм.',
            locationId: 'loc-4',
            characters: ['char-3'],
            choices: [
              { id: 'choice-23', text: 'Войти в храм', nextSceneId: 'scene-9' },
            ],
          },
          {
            id: 'scene-17',
            title: 'Помощь незнакомца',
            description: 'Вам помогает таинственный незнакомец, который оказывается союзником старца.',
            locationId: 'loc-7',
            characters: ['char-5'],
            choices: [
              { id: 'choice-24', text: 'Принять его помощь', nextSceneId: 'scene-11' },
              { id: 'choice-25', text: 'Отказаться от помощи', nextSceneId: 'scene-6' },
            ],
          },
          {
            id: 'scene-18',
            title: 'Возвращение героя',
            description: 'Вы возвращаетесь с артефактом и передаёте его старцу. Свет возвращается в мир, а вы становитесь легендой.',
            locationId: 'loc-1',
            characters: ['char-1'],
            choices: [],
            isEnding: true,
          },
        ],
        characters: [
          {
            id: 'char-1',
            name: 'Старец Мирон',
            role: 'Наставник',
            description: 'Древний мудрец с длинной седой бородой и глубокими знаниями о мире.',
            motivation: 'Восстановить свет в мире и победить тьму.',
            isAlly: true,
          },
          {
            id: 'char-2',
            name: 'Странник Корвус',
            role: 'Обманщик',
            description: 'Харизматичный путешественник в потрёпанном плаще с таинственной улыбкой.',
            motivation: 'Заполучить артефакт для своего тёмного хозяина.',
            isEnemy: true,
          },
          {
            id: 'char-3',
            name: 'Каменный голем',
            role: 'Страж',
            description: 'Огромное существо из камня, охраняющее вход в древний храм.',
            motivation: 'Защищать храм от недостойных.',
          },
          {
            id: 'char-4',
            name: 'Культист тьмы',
            role: 'Враг',
            description: 'Последователь тёмных сил в чёрных одеждах с символами тьмы.',
            motivation: 'Служить тьме и не допустить возвращения света.',
            isEnemy: true,
          },
          {
            id: 'char-5',
            name: 'Лучник Элиан',
            role: 'Помощник',
            description: 'Ловкий лучник с острым взглядом и быстрыми рефлексами.',
            motivation: 'Помогать тем, кто борется против тьмы.',
            isAlly: true,
          },
        ],
        locations: [
          {
            id: 'loc-1',
            name: 'Деревня Светлоречье',
            description: 'Небольшая деревня на берегу реки, одно из последних мест, где ещё сохранился свет.',
            characters: ['char-1'],
          },
          {
            id: 'loc-2',
            name: 'Древняя библиотека',
            description: 'Огромное здание, заполненное книгами и свитками, хранящими знания тысячелетий.',
            items: ['item-1'],
          },
          {
            id: 'loc-3',
            name: 'Таверна "Пьяный гоблин"',
            description: 'Шумное место, где собираются путешественники и местные жители для обмена новостями.',
            characters: ['char-2'],
          },
          {
            id: 'loc-4',
            name: 'Северные пещеры',
            description: 'Тёмные и холодные пещеры в горах, скрывающие древние тайны.',
            characters: ['char-3'],
          },
          {
            id: 'loc-5',
            name: 'Заброшенная башня',
            description: 'Полуразрушенная башня в лесу, ставшая убежищем для последователей тьмы.',
            characters: ['char-2', 'char-4'],
          },
          {
            id: 'loc-6',
            name: 'Храм Света',
            description: 'Древний храм внутри пещер, построенный для хранения артефакта.',
            items: ['item-2'],
          },
          {
            id: 'loc-7',
            name: 'Лесная поляна',
            description: 'Тихая поляна в лесу, окружённая высокими деревьями и кустарниками.',
            characters: ['char-5'],
          },
        ],
        items: [
          {
            id: 'item-1',
            name: 'Древний манускрипт',
            description: 'Пожелтевший от времени свиток с картой и описанием местонахождения артефакта.',
            isKey: true,
          },
          {
            id: 'item-2',
            name: 'Кристалл Света',
            description: 'Сияющий кристалл, способный рассеять тьму и восстановить баланс в мире.',
            isKey: true,
            effect: 'Восстанавливает свет в мире',
          },
          {
            id: 'item-3',
            name: 'Амулет Усмирения',
            description: 'Древний амулет с символом мира, способный усмирить каменного голема.',
            isKey: true,
            effect: 'Усмиряет големов и других магических стражей',
          },
        ],
      };
      
      set({ generatedQuest: mockQuest, isLoading: false });
    } catch (error) {
      set({ error: 'Произошла ошибка при генерации квеста', isLoading: false });
      console.error('Error generating quest:', error);
    }
  },
  

=======
      // Подготавливаем данные для отправки на API
      const requestData = {
        setting: input.setting,
        starting_point: input.startingPoint,
        quest_style: input.questStyle,
        custom_setting: input.customSetting,
        custom_quest_style: input.customQuestStyle,
        file_content: input.fileContent,
        input_method: input.inputMethod
      };

      console.log('Отправляем запрос на API:', requestData);

      // Отправляем запрос на бэкенд
      const response = await fetch('/api/generate-quest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при генерации квеста');
      }

      const questData = await response.json();
      console.log('Получен ответ от API:', questData);

      // Преобразуем данные в формат фронтенда
      const quest: Quest = {
        id: questData.id,
        title: questData.title,
        description: questData.description,
        setting: questData.setting,
        questStyle: questData.quest_style,
        startingPoint: questData.starting_point,
        scenes: questData.scenes.map((scene: any) => ({
          id: scene.id,
          title: scene.title,
          description: scene.description,
          locationId: scene.location_id,
          characters: scene.characters,
          items: scene.items,
          choices: scene.choices.map((choice: any) => ({
            id: choice.id,
            text: choice.text,
            nextSceneId: choice.next_scene_id,
            requiredItems: choice.required_items,
            consequence: choice.consequence,
          })),
          isEnding: scene.is_ending,
        })),
        characters: questData.characters.map((char: any) => ({
          id: char.id,
          name: char.name,
          role: char.role,
          description: char.description,
          motivation: char.motivation,
          isEnemy: char.is_enemy,
          isAlly: char.is_ally,
        })),
        locations: questData.locations.map((loc: any) => ({
          id: loc.id,
          name: loc.name,
          description: loc.description,
          characters: loc.characters,
          items: loc.items,
        })),
        items: questData.items.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          isKey: item.is_key,
          effect: item.effect,
        })),
      };
      
      set({ generatedQuest: quest, isLoading: false });
    } catch (error) {
      console.error('Error generating quest:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Произошла ошибка при генерации квеста', 
        isLoading: false 
      });
    }
  },
  
>>>>>>> 6b47bff (Второй коммит))))
  resetQuest: () => set({ generatedQuest: null }),
}));