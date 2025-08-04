import React, { useState } from 'react';

interface Choice {
  text: string;
  nextScene: number | null;
}

interface Scene {
  id: number;
  title: string;
  description?: string;
  choices: Choice[];
}

const scenes: Scene[] = [
  {
    id: 1,
    title: 'Старый замок',
    description: 'Вы находитесь в старом замке. Перед вами стол с предметами.',
    choices: [
      { text: 'Взять дневник', nextScene: 2 },
      { text: 'Изучить карту', nextScene: 3 },
    ],
  },
  {
    id: 2,
    title: 'Тайны дневника',
    description: 'Дневник содержит странные символы и упоминание озера.',
    choices: [
      { text: 'Отправиться к озеру', nextScene: 4 },
      { text: 'Расшифровать руну', nextScene: 5 },
    ],
  },
  {
    id: 3,
    title: 'Забытая карта',
    description: 'Карта показывает путь в Забытую долину.',
    choices: [
      { text: 'В Забытую долину', nextScene: 6 },
      { text: 'Поискать следы', nextScene: 7 },
    ],
  },
  {
    id: 4,
    title: 'Тайное озеро',
    description: 'Вы обнаружили загадочное озеро с мерцающей водой.',
    choices: [
      { text: 'Исследовать берег', nextScene: null },
      { text: 'Окунуться в воду', nextScene: null },
    ],
  },
  {
    id: 5,
    title: 'Расшифровка рун',
    description: 'Символы указывают на скрытый проход в стене.',
    choices: [
      { text: 'Искать проход', nextScene: null },
      { text: 'Игнорировать', nextScene: null },
    ],
  },
  {
    id: 6,
    title: 'Забытая долина',
    description: 'Мрачная долина с древними руинами.',
    choices: [
      { text: 'Осмотреть руины', nextScene: null },
      { text: 'Обойти стороной', nextScene: null },
    ],
  },
  {
    id: 7,
    title: 'Поиск следов',
    description: 'Вы нашли следы, ведущие в лес.',
    choices: [
      { text: 'Следовать по следам', nextScene: 1 }, // Циклический переход
      { text: 'Вернуться назад', nextScene: null },
    ],
  },
];

const QuestGraph: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);
  const [hoveredScene, setHoveredScene] = useState<number | null>(null);

  // Конфигурация стилей
  const styles = {
    scene: {
      width: 200,
      height: 80,
      fill: '#f8f9fa',
      stroke: '#495057',
      radius: 10,
      hoverFill: '#e9ecef',
      selectedStroke: '#212529'
    },
    choice: {
      fill: '#fff3bf',
      stroke: '#f59f00',
      hoverFill: '#ffec99'
    },
    line: {
      stroke: '#4dabf7',
      strokeWidth: 2,
      hoverStroke: '#339af0'
    },
    text: {
      title: { size: 14, weight: 'bold' },
      description: { size: 12, color: '#495057' }
    }
  };

  // Структурированное позиционирование
  const layout = {
    width: 1200,
    height: 700,
    levels: [
      { y: 100, scenes: [1] },          // Уровень 1
      { y: 300, scenes: [2, 3] },       // Уровень 2
      { y: 500, scenes: [4, 5, 6, 7] }  // Уровень 3
    ],
    getScenePosition(id: number) {
      for (const level of this.levels) {
        const index = level.scenes.indexOf(id);
        if (index !== -1) {
          const spacing = this.width / (level.scenes.length + 1);
          return {
            x: spacing * (index + 1),
            y: level.y
          };
        }
      }
      return { x: 0, y: 0 };
    }
  };

  const handleSceneClick = (scene: Scene) => {
    setSelectedScene(selectedScene?.id === scene.id ? null : scene);
  };

  // Проверка, нужно ли отображать соединение (скрываем для циклического перехода)
  const shouldDisplayConnection = (fromId: number, toId: number) => {
    return !(fromId === 7 && toId === 1); // Скрываем переход из 7 в 1 сцену
  };

  if (!expanded) {
    return (
      <div style={{ textAlign: 'center' }}>
        <svg width={800} height={200} style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10 }}>
          <rect
            x={350}
            y={70}
            width={styles.scene.width}
            height={styles.scene.height}
            fill={styles.scene.fill}
            stroke={styles.scene.stroke}
            rx={styles.scene.radius}
            style={{ cursor: 'pointer' }}
            onClick={() => setExpanded(true)}
          />
          <text
            x={350 + styles.scene.width / 2}
            y={70 + styles.scene.height / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontWeight={styles.text.title.weight}
            fontSize={styles.text.title.size}
            style={{ cursor: 'pointer' }}
            onClick={() => setExpanded(true)}
          >
            Граф квеста
          </text>
        </svg>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', overflow: 'auto', maxWidth: '100%' }}>
      <svg 
        width={layout.width} 
        height={layout.height} 
        style={{ background: '#fff', border: '1px solid #eee', borderRadius: 10 }}
      >
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={styles.line.stroke} />
          </marker>
        </defs>

        {/* Соединения между сценами */}
        {scenes.map(scene => {
          const fromPos = layout.getScenePosition(scene.id);
          
          return scene.choices.map(choice => {
            if (!choice.nextScene || !shouldDisplayConnection(scene.id, choice.nextScene)) return null;
            
            const toScene = scenes.find(s => s.id === choice.nextScene);
            if (!toScene) return null;
            
            const toPos = layout.getScenePosition(toScene.id);
            const isHovered = hoveredScene === scene.id || hoveredScene === toScene.id;
            
            return (
              <line
                key={`${scene.id}-${choice.nextScene}`}
                x1={fromPos.x}
                y1={fromPos.y + styles.scene.height / 2}
                x2={toPos.x}
                y2={toPos.y - styles.scene.height / 2}
                stroke={isHovered ? styles.line.hoverStroke : styles.line.stroke}
                strokeWidth={styles.line.strokeWidth}
                markerEnd="url(#arrowhead)"
              />
            );
          });
        })}

        {/* Сцены */}
        {scenes.map(scene => {
          const pos = layout.getScenePosition(scene.id);
          const isHovered = hoveredScene === scene.id;
          const isSelected = selectedScene?.id === scene.id;

          return (
            <g
              key={`scene-${scene.id}`}
              onClick={() => handleSceneClick(scene)}
              onMouseEnter={() => setHoveredScene(scene.id)}
              onMouseLeave={() => setHoveredScene(null)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={pos.x - styles.scene.width / 2}
                y={pos.y - styles.scene.height / 2}
                width={styles.scene.width}
                height={styles.scene.height}
                fill={isHovered ? styles.scene.hoverFill : styles.scene.fill}
                stroke={isSelected ? styles.scene.selectedStroke : styles.scene.stroke}
                strokeWidth={isSelected ? 3 : 1}
                rx={styles.scene.radius}
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontWeight={styles.text.title.weight}
                fontSize={styles.text.title.size}
              >
                {scene.title}
              </text>
            </g>
          );
        })}

        {/* Кнопка сворачивания */}
        <g onClick={() => setExpanded(false)} style={{ cursor: 'pointer' }}>
          <rect x={layout.width - 110} y={20} width={90} height={30} rx={5} fill="#f1f3f5" stroke="#dee2e6" />
          <text x={layout.width - 65} y={40} textAnchor="middle" fontSize={14}>Свернуть</text>
        </g>
      </svg>

      {/* Панель деталей с желтыми ромбами выбора */}
      {selectedScene && (
        <div style={{
          position: 'absolute',
          right: 40,
          top: 40,
          width: 300,
          padding: 15,
          background: 'white',
          border: '1px solid #dee2e6',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: 10 }}>
            {selectedScene.title}
          </h3>
          <p style={{ color: styles.text.description.color, fontSize: styles.text.description.size }}>
            {selectedScene.description}
          </p>
          
          {selectedScene.choices.length > 0 && (
            <div>
              <h4 style={{ marginBottom: 10 }}>Варианты выбора:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedScene.choices.map((choice, idx) => {
                  const nextScene = scenes.find(s => s.id === choice.nextScene);
                  const isLoopBack = selectedScene.id === 7 && choice.nextScene === 1;
                  
                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        padding: 10,
                        background: styles.choice.fill,
                        border: `1px solid ${styles.choice.stroke}`,
                        borderRadius: 6
                      }}
                    >
                      <div style={{ 
                        width: 24, 
                        height: 24, 
                        transform: 'rotate(45deg)',
                        background: styles.choice.fill,
                        border: `1px solid ${styles.choice.stroke}`,
                        marginRight: 10
                      }} />
                      <div>
                        <div style={{ fontWeight: 'bold' }}>{choice.text}</div>
                        {isLoopBack ? (
                          <div style={{ fontSize: 12, color: '#6c757d' }}>Возврат в начало квеста</div>
                        ) : (
                          <div style={{ fontSize: 12, color: '#6c757d' }}>
                            {nextScene ? `→ ${nextScene.title}` : 'Конечная сцена'}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuestGraph;