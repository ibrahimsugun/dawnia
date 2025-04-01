export interface Position {
  x: number;
  y: number;
}

export interface Building {
  id: string;
  name: string;
  type: string;
  level: number;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  description: string;
  isUpgrading: boolean;
  isSelected: boolean;
  upgradeProgress: number;
  upgradeCost?: {
    wood?: number;
    grain?: number;
    stone?: number;
    iron?: number;
  };
}

export type BuildingType = 
  | 'Main Building'
  | 'Farm'
  | 'Woodcutter'
  | 'Quarry'
  | 'Iron Mine'
  | 'Barracks'
  | 'Wall';

export interface BuildingCost {
  wood?: number;
  stone?: number;
  iron?: number;
  grain?: number;
}

export const BUILDING_GRID_SIZE = 32; // Her bina için grid boyutu
export const MAP_SIZE = 800; // Harita boyutu (px)
export const GRID_CELLS = 25; // 25x25 grid

// Bina yerleşim kısıtlamaları
export const BUILDING_CONSTRAINTS = {
  'Main Building': { minLevel: 1, maxLevel: 20 },
  'Farm': { minLevel: 1, maxLevel: 30 },
  'Woodcutter': { minLevel: 1, maxLevel: 30 },
  'Quarry': { minLevel: 1, maxLevel: 30 },
  'Iron Mine': { minLevel: 1, maxLevel: 30 },
  'Barracks': { minLevel: 1, maxLevel: 25 },
  'Wall': { minLevel: 1, maxLevel: 20 }
}; 