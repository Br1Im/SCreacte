import React, { useState } from 'react';

// Тестовые данные основной ветки
const scenes = [
  {
    id: 1,
    title: 'Сцена 1',
    choices: [
      { text: 'Взять дневник', nextScene: 2 },
      { text: 'Изучить карту', nextScene: 3 },
    ],
  },
  {
    id: 2,
    title: 'Сцена 2',
    choices: [
      { text: 'Отправиться к озеру', nextScene: null },
      { text: 'Расшифровать руну', nextScene: null },
    ],
  },
  {
    id: 3,
    title: 'Сцена 3',
    choices: [
      { text: 'В Забытую долину', nextScene: null },
      { text: 'Поискать следы', nextScene: null },
    ],
  },
];

const blockWidth = 140;
const blockHeight = 50;
const rombWidth = 100;
const rombHeight = 60;
const hGap = 220;
const vGap = 120;

function getRombPoints(cx: number, cy: number) {
  return [
    [cx, cy - rombHeight / 2],
    [cx + rombWidth / 2, cy],
    [cx, cy + rombHeight / 2],
    [cx - rombWidth / 2, cy],
  ].map(([x, y]) => `${x},${y}`).join(' ');
}

const QuestGraph: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  // Координаты для сцен и ромбов (простая раскладка)
  const positions = [
    { x: 320, y: 40 }, // Сцена 1
    { x: 120, y: 220 }, // Сцена 2
    { x: 520, y: 220 }, // Сцена 3
  ];
  const rombPositions = [
    // Для сцены 1
    [
      { x: 220, y: 140 },
      { x: 420, y: 140 },
    ],
    // Для сцены 2
    [
      { x: 70, y: 320 },
      { x: 170, y: 320 },
    ],
    // Для сцены 3
    [
      { x: 470, y: 320 },
      { x: 570, y: 320 },
    ],
  ];

  if (!expanded) {
    // Свернуто: только прямоугольник "Основная ветка"
    return (
      <svg width={800} height={200} style={{ background: '#fff', border: '1px solid #eee' }}>
        <rect
          x={330}
          y={70}
          width={blockWidth}
          height={blockHeight}
          fill="#f0f0f0"
          stroke="#222"
          rx={8}
          style={{ cursor: 'pointer' }}
          onClick={() => setExpanded(true)}
        />
        <text
          x={330 + blockWidth / 2}
          y={70 + blockHeight / 2 + 5}
          textAnchor="middle"
          fontWeight="bold"
          fontSize={16}
          style={{ cursor: 'pointer' }}
          onClick={() => setExpanded(true)}
        >
          Основная ветка
        </text>
      </svg>
    );
  }

  // Развернуто: граф основной ветки
  return (
    <svg width={800} height={450} style={{ background: '#fff', border: '1px solid #eee' }}>
      {/* Сцены */}
      {scenes.map((scene, idx) => (
        <g key={scene.id}>
          {/* Прямоугольник-сцена */}
          <rect
            x={positions[idx].x}
            y={positions[idx].y}
            width={blockWidth}
            height={blockHeight}
            fill="#f0f0f0"
            stroke="#222"
            rx={8}
          />
          <text
            x={positions[idx].x + blockWidth / 2}
            y={positions[idx].y + blockHeight / 2 + 5}
            textAnchor="middle"
            fontWeight="bold"
            fontSize={14}
          >
            {scene.title}
          </text>
          {/* Стрелки к ромбам */}
          {scene.choices.map((choice, cidx) => {
            const fromX = positions[idx].x + blockWidth / 2;
            const fromY = positions[idx].y + blockHeight;
            const toX = rombPositions[idx][cidx].x;
            const toY = rombPositions[idx][cidx].y - rombHeight / 2;
            return (
              <g key={cidx}>
                {/* Стрелка от сцены к ромбу */}
                <line
                  x1={fromX}
                  y1={fromY}
                  x2={toX}
                  y2={toY}
                  stroke="#2b6cb0"
                  strokeWidth={2}
                  markerEnd="url(#arrowhead)"
                />
                {/* Ромб */}
                <polygon
                  points={getRombPoints(rombPositions[idx][cidx].x, rombPositions[idx][cidx].y)}
                  fill="#fffbe6"
                  stroke="#b7791f"
                  strokeWidth={2}
                />
                <text
                  x={rombPositions[idx][cidx].x}
                  y={rombPositions[idx][cidx].y}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight="bold"
                  dominantBaseline="middle"
                >
                  {choice.text}
                </text>
                {/* Стрелка от ромба к следующей сцене */}
                {choice.nextScene && (
                  (() => {
                    const nextIdx = scenes.findIndex(s => s.id === choice.nextScene);
                    if (nextIdx === -1) return null;
                    const toSceneX = positions[nextIdx].x + blockWidth / 2;
                    const toSceneY = positions[nextIdx].y;
                    return (
                      <line
                        x1={rombPositions[idx][cidx].x}
                        y1={rombPositions[idx][cidx].y + rombHeight / 2}
                        x2={toSceneX}
                        y2={toSceneY}
                        stroke="#2b6cb0"
                        strokeWidth={2}
                        markerEnd="url(#arrowhead)"
                      />
                    );
                  })()
                )}
              </g>
            );
          })}
        </g>
      ))}
      {/* Определение стрелки */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#2b6cb0" />
        </marker>
      </defs>
    </svg>
  );
};

export default QuestGraph;