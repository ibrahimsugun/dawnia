import React from 'react';
import { Building } from '../models/building';
import { Home, Wheat, Trees as Tree, Mountain, Cog, Sword, Shield, Castle } from 'lucide-react';

interface BuildingMapItemProps {
  building: Building;
  gridCellSize: number;
}

const buildingIcons = {
  'Main Building': Castle,
  'Farm': Wheat,
  'Woodcutter': Tree,
  'Quarry': Mountain,
  'Iron Mine': Cog,
  'Barracks': Sword,
  'Wall': Shield,
};

export function BuildingMapItem({ building, gridCellSize }: BuildingMapItemProps) {
  const Icon = buildingIcons[building.type as keyof typeof buildingIcons];
  
  return (
    <div
      className={`
        absolute transition-all duration-300
        ${building.isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'}
        ${building.isUpgrading ? 'animate-pulse' : ''}
      `}
      style={{
        left: building.position.x * gridCellSize,
        top: building.position.y * gridCellSize,
        width: gridCellSize * 2,
        height: gridCellSize * 2,
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center group">
        {/* Bina arkaplanı */}
        <div className={`
          absolute inset-0 rounded-lg
          ${building.isSelected ? 'bg-amber-600/20' : 'bg-amber-900/20'}
          backdrop-blur-sm border-2 border-amber-600/30
          transition-all duration-300
        `} />

        {/* Bina ikonu */}
        <div className={`
          relative w-3/4 h-3/4 rounded-lg
          ${building.isSelected ? 'bg-amber-600/40' : 'bg-amber-900/40'}
          backdrop-blur-sm border-2 border-amber-600/30
          flex items-center justify-center
          transition-all duration-300
        `}>
          <Icon className={`
            w-1/2 h-1/2
            ${building.isSelected ? 'text-amber-300' : 'text-amber-500'}
          `} />
        </div>

        {/* Seviye göstergesi */}
        <div className="absolute -top-2 -right-2 bg-amber-900 text-amber-300 
          text-sm font-medieval px-2 py-0.5 rounded-full border border-amber-600/50
          shadow-lg">
          {building.level}
        </div>

        {/* İsim (hover durumunda) */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2
          bg-amber-900/90 text-amber-300 text-sm font-medieval px-3 py-1 rounded
          whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity
          shadow-lg">
          {building.name}
        </div>

        {/* İnşaat durumu */}
        {building.isUpgrading && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2
            bg-amber-900/90 text-amber-300 text-xs font-medieval px-2 py-1 rounded
            whitespace-nowrap shadow-lg animate-pulse">
            İnşa Ediliyor...
          </div>
        )}
      </div>
    </div>
  );
} 