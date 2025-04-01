import React, { useState, useRef, useEffect } from 'react';
import { Building } from '../models/building';
import { useGameStore } from '../store/gameStore';
import { BuildingMapItem } from './BuildingMapItem';
import { gridToIso, screenToGrid, TILE_WIDTH, TILE_HEIGHT, calculateCircularLayout } from '../utils/isometric';

const MAP_CENTER = { x: 12, y: 12 };
const VILLAGE_RADIUS = 8;

export function VillageMap() {
  const { buildings, selectBuilding } = useGameStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const [hoveredBuilding, setHoveredBuilding] = useState<Building | null>(null);

  // Binaları dairesel düzende yerleştir ve z-indekse göre sırala
  useEffect(() => {
    calculateCircularLayout(buildings, MAP_CENTER.x, MAP_CENTER.y);
  }, [buildings]);

  // Tıklama işleyicisi
  const handleMapClick = (e: React.MouseEvent) => {
    if (!mapRef.current) return;

    const rect = mapRef.current.getBoundingClientRect();
    const mapOffsetX = rect.left + rect.width / 2;
    const mapOffsetY = rect.top + TILE_HEIGHT * 2; // Üst boşluk için offset

    // Ekran koordinatlarını grid koordinatlarına dönüştür
    const screenX = e.clientX - mapOffsetX;
    const screenY = e.clientY - mapOffsetY;
    const { x: gridX, y: gridY } = screenToGrid(screenX, screenY);

    // En yakın binayı bul
    const clickedBuilding = buildings.find(building => {
      const dx = Math.abs(building.position.x - gridX);
      const dy = Math.abs(building.position.y - gridY);
      return dx <= 1 && dy <= 1; // 1 birimlik tolerans
    });

    if (clickedBuilding) {
      selectBuilding(clickedBuilding.id);
    }
  };

  return (
    <div 
      ref={mapRef}
      className="relative w-full h-full overflow-hidden bg-gradient-to-b from-green-800 to-green-600"
      onClick={handleMapClick}
    >
      {/* İzometrik Zemin */}
      <div 
        className="absolute left-1/2 top-16 transform -translate-x-1/2"
        style={{
          width: TILE_WIDTH * (VILLAGE_RADIUS * 2 + 1),
          height: TILE_HEIGHT * (VILLAGE_RADIUS * 2 + 1),
        }}
      >
        {/* Zemin Karoları */}
        <div className="absolute inset-0">
          {Array.from({ length: VILLAGE_RADIUS * 2 + 1 }).map((_, y) =>
            Array.from({ length: VILLAGE_RADIUS * 2 + 1 }).map((_, x) => {
              const { isoX, isoY } = gridToIso(x, y);
              return (
                <div
                  key={`tile-${x}-${y}`}
                  className="absolute bg-green-700/20 border border-green-800/30"
                  style={{
                    width: TILE_WIDTH,
                    height: TILE_HEIGHT,
                    left: isoX,
                    top: isoY,
                    clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                  }}
                />
              );
            })
          )}
        </div>

        {/* Binalar (z-indekse göre sıralı) */}
        {buildings.sort((a, b) => (a.position.x + a.position.y) - (b.position.x + b.position.y)).map(building => {
          const { isoX, isoY } = gridToIso(building.position.x, building.position.y);
          return (
            <BuildingMapItem
              key={building.id}
              building={building}
              position={{ x: isoX, y: isoY }}
              isHovered={hoveredBuilding?.id === building.id}
              onHover={setHoveredBuilding}
            />
          );
        })}
      </div>
    </div>
  );
} 