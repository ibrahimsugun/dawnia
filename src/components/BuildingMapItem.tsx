import React from 'react';
import { Building } from '../models/building';
import { TILE_WIDTH, TILE_HEIGHT } from '../utils/isometric';
import { 
  Home, 
  Wheat, 
  Trees, 
  Mountain, 
  Pickaxe,
  Sword,
  Footprints,
  Hammer,
  Warehouse as WarehouseIcon,
  Castle,
  Store
} from 'lucide-react';

interface BuildingMapItemProps {
  building: Building;
  position: { x: number; y: number };
  isHovered: boolean;
  onHover: (building: Building | null) => void;
}

const buildingIcons: Record<string, React.ElementType> = {
  MainBuilding: Home,
  Farm: Wheat,
  Woodcutter: Trees,
  Quarry: Mountain,
  IronMine: Pickaxe,
  Barracks: Sword,
  Stable: Footprints,
  Blacksmith: Hammer,
  Warehouse: WarehouseIcon,
  Wall: Castle,
  Market: Store,
};

export function BuildingMapItem({ building, position, isHovered, onHover }: BuildingMapItemProps) {
  const Icon = buildingIcons[building.type];
  const elevation = building.level * 8; // Yükseklik artışı

  return (
    <div
      className={`
        absolute transition-all duration-300 cursor-pointer
        ${isHovered ? 'scale-110 z-50' : ''}
      `}
      style={{
        left: position.x + TILE_WIDTH / 2,
        top: position.y + TILE_HEIGHT / 2 - elevation,
        width: TILE_WIDTH,
        height: TILE_HEIGHT * 2,
        zIndex: Math.floor(building.position.x + building.position.y),
      }}
      onMouseEnter={() => onHover(building)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Bina İkonu */}
      <div 
        className={`
          absolute bottom-0 left-1/2 transform -translate-x-1/2
          p-3 rounded-lg
          ${isHovered ? 'bg-amber-100/90' : 'bg-amber-100/70'}
        `}
        style={{
          filter: `drop-shadow(0 ${elevation}px ${elevation/2}px rgba(0,0,0,0.3))`
        }}
      >
        <Icon className="w-8 h-8 text-amber-900" />
      </div>

      {/* Bina Seviyesi */}
      <div 
        className={`
          absolute -top-1 left-1/2 transform -translate-x-1/2
          w-6 h-6 flex items-center justify-center
          rounded-full bg-amber-500 text-white text-sm font-bold
          border-2 border-amber-600
          ${isHovered ? 'scale-110' : ''}
        `}
      >
        {building.level}
      </div>

      {/* İnşaat Durumu */}
      {building.isUpgrading && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="px-2 py-1 bg-amber-100 rounded-full text-xs text-amber-900 font-medium">
            İnşa Ediliyor: %{Math.round(building.upgradeProgress)}
          </div>
        </div>
      )}

      {/* Bina İsmi (Hover durumunda) */}
      {isHovered && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
          <div className="px-3 py-1.5 bg-white/90 rounded-lg shadow-lg">
            <div className="text-sm font-medium text-gray-900">{building.name}</div>
          </div>
        </div>
      )}
    </div>
  );
} 