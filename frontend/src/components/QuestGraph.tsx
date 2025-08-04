import React, { useState, useMemo } from 'react';
import { useGeneratorStore } from '../store/generatorStore';

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

const QuestGraph: React.FC = React.memo(() => {
  const { generatedQuest } = useGeneratorStore();
  const [expanded, setExpanded] = useState(false);

  if (!generatedQuest || !generatedQuest.scenes || generatedQuest.scenes.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        Квест не загружен или не содержит сцен
      </div>
    );
  }

  // Мемоизируем карту сцен для быстрого поиска
  const sceneMap = useMemo(() => {
    return new Map(generatedQuest.scenes.map(scene => [scene.id, scene]));
  }, [generatedQuest.scenes]);
  
  // Мемоизируем вычисления позиций сцен
  const positions = useMemo(() => {
    const calculatePositions = () => {
    const positions: { [key: string]: { x: number; y: number } } = {};
    const levels: { [key: string]: number } = {};
    const visited = new Set<string>();
    
    // Определяем уровни сцен (глубину от начальной сцены)
    const calculateLevels = (sceneId: string, level: number = 0) => {
      if (visited.has(sceneId) || !sceneMap.has(sceneId)) return;
      visited.add(sceneId);
      levels[sceneId] = level;
      
      const scene = sceneMap.get(sceneId)!;
      scene.choices?.forEach(choice => {
        if (choice.nextSceneId && !visited.has(choice.nextSceneId)) {
          calculateLevels(choice.nextSceneId, level + 1);
        }
      });
    };
    
    // Начинаем с первой сцены
    if (generatedQuest.scenes.length > 0) {
      calculateLevels(generatedQuest.scenes[0].id);
    }
    
    // Группируем сцены по уровням
    const levelGroups: { [level: number]: string[] } = {};
    Object.entries(levels).forEach(([sceneId, level]) => {
      if (!levelGroups[level]) levelGroups[level] = [];
      levelGroups[level].push(sceneId);
    });
    
    // Вычисляем позиции
    Object.entries(levelGroups).forEach(([levelStr, sceneIds]) => {
      const level = parseInt(levelStr);
      const y = 80 + level * (blockHeight + vGap);
      const totalWidth = sceneIds.length * blockWidth + (sceneIds.length - 1) * hGap;
      const startX = (800 - totalWidth) / 2;
      
      sceneIds.forEach((sceneId, index) => {
        positions[sceneId] = {
          x: startX + index * (blockWidth + hGap),
          y: y
        };
      });
    });
    
    return positions;
  };
  
  return calculatePositions();
}, [generatedQuest.scenes, sceneMap]);
  
  const maxY = Math.max(...Object.values(positions).map(p => p.y)) + blockHeight + 50;

  if (!expanded) {
    // Свернуто: только прямоугольник "Граф квеста"
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
          Граф квеста
        </text>
        <text
          x={330 + blockWidth / 2}
          y={70 + blockHeight + 20}
          textAnchor="middle"
          fontSize={12}
          fill="#666"
        >
          {generatedQuest.scenes.length} сцен
        </text>
      </svg>
    );
  }

  // Развернуто: полный граф квеста
  return (
    <svg width={800} height={Math.max(450, maxY)} style={{ background: '#fff', border: '1px solid #eee' }}>
      {/* Сцены */}
      {generatedQuest.scenes.map((scene, idx) => (
        <g key={scene.id}>
          {/* Прямоугольник-сцена */}
          <rect
            x={positions[scene.id].x}
            y={positions[scene.id].y}
            width={blockWidth}
            height={blockHeight}
            fill="#f0f0f0"
            stroke="#222"
            rx={8}
          />
          <text
            x={positions[scene.id].x + blockWidth / 2}
            y={positions[scene.id].y + blockHeight / 2 + 5}
            textAnchor="middle"
            fontWeight="bold"
            fontSize={14}
          >
            {scene.title}
          </text>
          {/* Стрелки к ромбам */}
          {(scene.choices || []).map((choice, cidx) => {
            const fromX = positions[scene.id].x + blockWidth / 2;
            const fromY = positions[scene.id].y + blockHeight;
            const toX = positions[scene.id].x + blockWidth / 2 + (cidx - ((scene.choices?.length || 1) - 1) / 2) * 120;
            const toY = positions[scene.id].y + blockHeight + 60;
            return (
              <g key={`${scene.id}-choice-${choice.id || cidx}`}>
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
                  points={getRombPoints(toX, toY + rombHeight / 2)}
                  fill="#fffbe6"
                  stroke="#b7791f"
                  strokeWidth={2}
                />
                <text
                  x={toX}
                  y={toY + rombHeight / 2}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight="bold"
                  dominantBaseline="middle"
                >
                  {choice.text}
                </text>
                {/* Стрелка от ромба к следующей сцене */}
                {choice.nextSceneId && positions[choice.nextSceneId] && (
                  <line
                    key={`${scene.id}-arrow-${choice.id || cidx}`}
                    x1={toX}
                    y1={toY + rombHeight / 2}
                    x2={positions[choice.nextSceneId].x + blockWidth / 2}
                    y2={positions[choice.nextSceneId].y}
                    stroke="#2b6cb0"
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                  />
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
});

QuestGraph.displayName = 'QuestGraph';

export default QuestGraph;