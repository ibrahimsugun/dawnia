import React, { useState, useRef, useEffect } from 'react';
import { Building, BUILDING_GRID_SIZE, MAP_SIZE, GRID_CELLS } from '../models/building';
import { useGameStore } from '../store/gameStore';
import { BuildingMapItem } from './BuildingMapItem';

const GRID_SIZE = 32;

export function VillageMap() {
  const { buildings } = useGameStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({
    x: 0,
    y: 0,
    isDragging: false,
    startX: 0,
    startY: 0
  });

  // Pan işlemi
  const handleMouseDown = (e: React.MouseEvent) => {
    setTransform(prev => ({
      ...prev,
      isDragging: true,
      startX: e.clientX - prev.x,
      startY: e.clientY - prev.y
    }));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (transform.isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - prev.startX,
        y: e.clientY - prev.startY
      }));
    }
  };

  const handleMouseUp = () => {
    setTransform(prev => ({
      ...prev,
      isDragging: false
    }));
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  return (
    <div 
      ref={mapRef}
      className="relative w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div 
        className="absolute inset-0 transition-transform duration-100"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px)`,
          transformOrigin: '0 0'
        }}
      >
        {/* Grid */}
        <div className="absolute inset-0 grid grid-cols-25 grid-rows-25 gap-px bg-amber-950/20">
          {Array.from({ length: 625 }).map((_, i) => (
            <div key={i} className="w-8 h-8 bg-amber-950/40" />
          ))}
        </div>

        {/* Binalar */}
        {buildings.map(building => (
          <BuildingMapItem
            key={building.id}
            building={building}
            gridCellSize={GRID_SIZE}
          />
        ))}
      </div>
    </div>
  );
} 