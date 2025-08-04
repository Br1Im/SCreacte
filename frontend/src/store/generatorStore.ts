import { create } from 'zustand';
import type { GeneratorInput, Quest } from '../types/generator';

interface GeneratorState {
  input: GeneratorInput;
  generatedQuest: Quest | null;
  isLoading: boolean;
  error: string | null;
  generationProgress: {
    currentStep: string;
    completedSteps: string[];
    streamedContent: string;
    isGenerating: boolean;
  };
  setInput: (input: Partial<GeneratorInput>) => void;
  resetInput: () => void;
  generateQuest: () => Promise<void>;
  resetQuest: (navigate?: (path: string) => void) => void;
  updateGenerationProgress: (progress: Partial<GeneratorState['generationProgress']>) => void;
}

const defaultInput: GeneratorInput = {
  setting: 'fantasy',
  startingPoint: '',
  questStyle: 'adventure',
  customSetting: '',
  customQuestStyle: '',
  fileContent: '',
  inputMethod: 'form',
  // Значения по умолчанию для новых полей
  sceneCount: 3,
  complexity: 'medium',
  tone: 'serious',
  characterCount: 3,
  mainGoal: '',
  themes: '',
};
export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  input: { ...defaultInput },
  generatedQuest: null,
  isLoading: false,
  error: null,
  generationProgress: {
    currentStep: '',
    completedSteps: [],
    streamedContent: '',
    isGenerating: false,
  },

  setInput: (input) => set((state) => ({
    input: { ...state.input, ...input },
  })),

  resetInput: () => set({ input: { ...defaultInput } }),

  generateQuest: async () => {
    const { input } = get();
    
    console.log('generateQuest called with input:', input);

    if (input.inputMethod === 'form' && !input.startingPoint) {
      set({ error: 'Пожалуйста, укажите отправную точку' });
      return;
    }

    if (input.inputMethod === 'file' && !input.fileContent) {
      set({ error: 'Пожалуйста, загрузите файл' });
      return;
    }
    
    set({ isLoading: true, error: null });
    
    // Инициализируем прогресс генерации
    const { updateGenerationProgress } = get();
    updateGenerationProgress({
      isGenerating: true,
      currentStep: 'Подготовка запроса...',
      completedSteps: [],
      streamedContent: ''
    });
    
    try {
      updateGenerationProgress({
        currentStep: 'Подключение к серверу...',
        completedSteps: ['Подготовка запроса']
      });

      const response = await fetch('http://localhost:8000/api/generate-quest-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          setting: input.setting === 'custom' ? input.customSetting : input.setting,
          starting_point: input.startingPoint,
          quest_style: input.questStyle === 'custom' ? input.customQuestStyle : input.questStyle,
          custom_setting: input.customSetting,
          custom_quest_style: input.customQuestStyle,
          file_content: input.fileContent,
          input_method: input.inputMethod
        }),
      });

      if (!response.ok) {
        throw new Error(`Ошибка API бэкенда: ${response.status}`);
      }

      updateGenerationProgress({
        currentStep: 'Получение потоковых данных...',
        completedSteps: ['Подготовка запроса', 'Подключение к серверу']
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error('Не удалось получить поток данных');
      }

      let quest: Partial<Quest> = {
        id: Date.now().toString(),
        title: '',
        description: '',
        setting: input.setting === 'custom' ? input.customSetting : input.setting,
        questStyle: input.questStyle === 'custom' ? input.customQuestStyle : input.questStyle,
        startingPoint: input.startingPoint,
        scenes: [],
        characters: [],
        locations: [],
        items: [],
      };

      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              // Обновляем streamedContent для отладки
              updateGenerationProgress({
                streamedContent: get().generationProgress.streamedContent + JSON.stringify(data) + '\n'
              });
              
              switch (data.type) {
                case 'title':
                  quest.title = data.content;
                  updateGenerationProgress({
                    currentStep: 'Генерация заголовка...',
                    completedSteps: [...get().generationProgress.completedSteps, 'Заголовок создан']
                  });
                  // Обновляем квест с заголовком
                  set({ generatedQuest: { ...quest } as Quest });
                  break;
                  
                case 'description':
                  quest.description = data.content;
                  updateGenerationProgress({
                    currentStep: 'Описание сюжета создано',
                    completedSteps: [...get().generationProgress.completedSteps, 'Описание сюжета создано']
                  });
                  set({ generatedQuest: { ...quest } as Quest });
                  break;
                  
                case 'scene':
                  const scene = {
                    id: data.content.id,
                    title: data.content.title,
                    description: data.content.description,
                    locationId: data.content.location_id,
                    characters: data.content.characters || [],
                    items: data.content.items || [],
                    choices: data.content.choices ? data.content.choices.map((choice: any) => ({
                      id: choice.id,
                      text: choice.text,
                      nextSceneId: choice.next_scene_id,
                      requiredItems: choice.required_items || [],
                      consequence: choice.consequence || null,
                    })) : [],
                    isEnding: data.content.is_ending || false,
                  };
                  quest.scenes = [...(quest.scenes || []), scene];
                  updateGenerationProgress({
                    currentStep: `Создание сцены: ${scene.title}`,
                    completedSteps: [...get().generationProgress.completedSteps, `Сцена "${scene.title}" создана`]
                  });
                  set({ generatedQuest: { ...quest } as Quest });
                  break;
                  
                case 'characters':
                  quest.characters = data.content;
                  updateGenerationProgress({
                    currentStep: 'Создание персонажей...',
                    completedSteps: [...get().generationProgress.completedSteps, 'Персонажи созданы']
                  });
                  set({ generatedQuest: { ...quest } as Quest });
                  break;
                  
                case 'locations':
                  quest.locations = data.content;
                  updateGenerationProgress({
                    currentStep: 'Создание локаций...',
                    completedSteps: [...get().generationProgress.completedSteps, 'Локации созданы']
                  });
                  set({ generatedQuest: { ...quest } as Quest });
                  break;
                  
                case 'items':
                  quest.items = data.content;
                  updateGenerationProgress({
                    currentStep: 'Создание предметов...',
                    completedSteps: [...get().generationProgress.completedSteps, 'Предметы созданы']
                  });
                  set({ generatedQuest: { ...quest } as Quest });
                  break;
                  
                case 'complete':
                  updateGenerationProgress({
                    currentStep: 'Генерация завершена!',
                    completedSteps: [...get().generationProgress.completedSteps, 'Квест готов'],
                    isGenerating: false
                  });
                  // Устанавливаем финальный квест в состояние
                  set({ generatedQuest: { ...quest } as Quest });
                  break;
                  
                case 'error':
                  throw new Error(data.content);
              }
            } catch (parseError) {
              console.warn('Ошибка парсинга потоковых данных:', parseError);
            }
          }
        }
      }
      
      set({ isLoading: false });
    } catch (error) {
      console.error('Error generating quest:', error);
      updateGenerationProgress({
        currentStep: 'Ошибка генерации',
        isGenerating: false
      });
      
      set({ 
        isLoading: false, 
        error: `Ошибка при генерации квеста: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}` 
      });
      return;

    }
  },
  updateGenerationProgress: (progress) => set((state) => ({
    generationProgress: { ...state.generationProgress, ...progress },
  })),

  resetQuest: (navigate?: (path: string) => void) => {
    set({ 
      generatedQuest: null,
      generationProgress: {
        currentStep: '',
        completedSteps: [],
        streamedContent: '',
        isGenerating: false,
      },
    });
    
    // Перенаправляем на главную страницу, если передана функция навигации
    if (navigate) {
      navigate('/');
    }
  },
}));