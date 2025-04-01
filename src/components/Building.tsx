import React from 'react';
import { Home, Wheat, Trees as Tree, Mountain, Cog, Sword, Shield, Castle } from 'lucide-react';

interface BuildingProps {
  name: string;
  type: string;
  level: number;
  size: { width: number; height: number };
  position: { x: number; y: number };
  upgradeCost: {
    wood?: number;
    grain?: number;
    stone?: number;
    iron?: number;
  };
  isUpgrading: boolean;
  upgradeProgress: number;
  isSelected: boolean;
  gridCellSize: number;
  onClick: () => void;
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

export function Building({
  name,
  type,
  level,
  size,
  position,
  isUpgrading,
  upgradeProgress,
  isSelected,
  gridCellSize,
  onClick
}: BuildingProps) {
  const Icon = buildingIcons[type as keyof typeof buildingIcons];

  return (
    <div
      className={`
        absolute transition-all duration-300 cursor-pointer
        ${isSelected ? 'z-20 scale-110' : 'z-10 hover:scale-105'}
        ${isUpgrading ? 'animate-pulse' : ''}
      `}
      style={{
        left: position.x * gridCellSize,
        top: position.y * gridCellSize,
        width: size.width * gridCellSize,
        height: size.height * gridCellSize,
      }}
      onClick={onClick}
    >
      <div className="relative w-full h-full flex items-center justify-center group">
        {/* Bina arkaplanı */}
        <div className={`
          absolute inset-0 rounded-lg
          ${isSelected ? 'bg-amber-600/20' : 'bg-amber-900/20'}
          backdrop-blur-sm border-2 border-amber-600/30
          transition-all duration-300
        `} />

        {/* Bina ikonu */}
        <div className={`
          relative w-3/4 h-3/4 rounded-lg
          ${isSelected ? 'bg-amber-600/40' : 'bg-amber-900/40'}
          backdrop-blur-sm border-2 border-amber-600/30
          flex items-center justify-center
          transition-all duration-300
        `}>
          <Icon className={`
            w-1/2 h-1/2
            ${isSelected ? 'text-amber-300' : 'text-amber-500'}
          `} />

          {/* Yükseltme progress barı */}
          {isUpgrading && (
            <div className="absolute bottom-0 left-0 w-full h-2 bg-amber-900/50 overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-300 ease-linear"
                style={{ 
                  width: `${upgradeProgress}%`,
                  backgroundImage: 'linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1) 75%, transparent 75%, transparent)',
                  backgroundSize: '20px 20px',
                  animation: 'progress-bar-stripes 1s linear infinite'
                }}
              />
            </div>
          )}
        </div>

        {/* Seviye göstergesi */}
        <div className="absolute -top-2 -right-2 bg-amber-900 text-amber-300 
          text-sm font-medieval px-2 py-0.5 rounded-full border border-amber-600/50
          shadow-lg">
          {level}
        </div>

        {/* İsim (hover durumunda) */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2
          bg-amber-900/90 text-amber-300 text-sm font-medieval px-3 py-1 rounded
          whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity
          shadow-lg">
          {name}
        </div>

        {/* İnşaat durumu ve progress */}
        {isUpgrading && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2
            bg-amber-900/90 text-amber-300 text-xs font-medieval px-2 py-1 rounded
            whitespace-nowrap shadow-lg">
            İnşa Ediliyor... (%{Math.round(upgradeProgress)})
          </div>
        )}
      </div>
    </div>
  );
} 