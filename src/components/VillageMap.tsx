import React, { useRef, useEffect } from 'react';
import { Building, BUILDING_GRID_SIZE, MAP_SIZE, GRID_CELLS } from '../models/building';
import { useGameStore } from '../store/gameStore';
import { BuildingMapItem } from './BuildingMapItem';

export function VillageMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { buildings, selectBuilding } = useGameStore();
  
  // Grid çizimi
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas boyutunu ayarla
    canvas.width = MAP_SIZE;
    canvas.height = MAP_SIZE;

    // Grid arkaplanı
    ctx.fillStyle = '#2A1810';
    ctx.fillRect(0, 0, MAP_SIZE, MAP_SIZE);

    // Grid çizgileri
    ctx.strokeStyle = '#4A3828';
    ctx.lineWidth = 1;

    const cellSize = MAP_SIZE / GRID_CELLS;

    // Yatay çizgiler
    for (let i = 0; i <= GRID_CELLS; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(MAP_SIZE, i * cellSize);
      ctx.stroke();
    }

    // Dikey çizgiler
    for (let i = 0; i <= GRID_CELLS; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, MAP_SIZE);
      ctx.stroke();
    }
  }, []);

  // Tıklama işleyicisi
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Grid hücresini bul
    const cellSize = MAP_SIZE / GRID_CELLS;
    const gridX = Math.floor(x / cellSize);
    const gridY = Math.floor(y / cellSize);

    // Bu konumdaki binayı bul
    const clickedBuilding = buildings.find(
      b => b.position.x === gridX && b.position.y === gridY
    );

    if (clickedBuilding) {
      selectBuilding(clickedBuilding.id);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Grid arkaplanı */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
      />
      
      {/* Binalar */}
      <div 
        className="absolute top-0 left-0 w-full h-full"
        onClick={handleClick}
      >
        {buildings.map((building) => (
          <BuildingMapItem
            key={building.id}
            building={building}
            gridCellSize={MAP_SIZE / GRID_CELLS}
          />
        ))}
      </div>
    </div>
  );
} 