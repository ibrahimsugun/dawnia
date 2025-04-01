import { create } from 'zustand';
import { Building, BuildingType, BuildingCost } from '../models/building';

interface GameState {
  // Kaynaklar
  resources: {
    wood: number;
    stone: number;
    iron: number;
    grain: number;
  };
  
  // Binalar
  buildings: Building[];
  selectedBuilding: Building | null;
  
  // Ordu
  army: {
    swordsmen: number;
    archers: number;
    cavalry: number;
  };
  
  // Eğitim kuyruğu
  trainingQueue: {
    unit: {
      name: string;
      costs: BuildingCost;
      attack: number;
      defense: number;
      health: number;
      upkeep: number;
    };
    remainingTime: number;
  }[];

  // Aksiyonlar
  upgradeBuilding: (buildingId: string) => void;
  selectBuilding: (buildingId: string) => void;
  closeSelectedBuilding: () => void;
  trainUnit: (unitType: string) => void;
  calculateUpgradeCost: (building: Building) => BuildingCost;
  calculateAttackPower: () => number;
  calculateDefensePower: () => number;
  calculateArmyUpkeep: () => number;

  // Yeni fonksiyonlar
  calculateResourceProduction: (resourceType: keyof GameState['resources']) => number;
  updateResources: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  resources: {
    wood: 1000,
    stone: 1000,
    iron: 1000,
    grain: 1000,
  },
  
  buildings: [
    {
      id: '1',
      name: 'Main Building',
      type: 'Main Building',
      level: 1,
      position: { x: 12, y: 12 },
      description: 'Köyünüzün merkezi. Her seviye bina inşaat süresini %10 azaltır.',
      isUpgrading: false,
      isSelected: false,
    },
    {
      id: '2',
      name: 'Farm',
      type: 'Farm',
      level: 1,
      position: { x: 10, y: 10 },
      description: 'Köyünüz için tahıl üretir',
      isUpgrading: false,
      isSelected: false,
    },
    {
      id: '3',
      name: 'Woodcutter',
      type: 'Woodcutter',
      level: 1,
      position: { x: 14, y: 10 },
      description: 'Ormandan odun toplar',
      isUpgrading: false,
      isSelected: false,
    },
  ],
  
  selectedBuilding: null,
  
  army: {
    swordsmen: 0,
    archers: 0,
    cavalry: 0,
  },
  
  trainingQueue: [],

  upgradeBuilding: (buildingId) => {
    const state = get();
    const building = state.buildings.find(b => b.id === buildingId);
    if (!building) return;

    const cost = state.calculateUpgradeCost(building);
    
    // Kaynak kontrolü
    if (
      (cost.wood && state.resources.wood < cost.wood) ||
      (cost.stone && state.resources.stone < cost.stone) ||
      (cost.iron && state.resources.iron < cost.iron) ||
      (cost.grain && state.resources.grain < cost.grain)
    ) {
      return;
    }

    // Kaynakları düş
    set((state) => ({
      resources: {
        wood: state.resources.wood - (cost.wood || 0),
        stone: state.resources.stone - (cost.stone || 0),
        iron: state.resources.iron - (cost.iron || 0),
        grain: state.resources.grain - (cost.grain || 0),
      }
    }));

    // Binayı yükseltmeye başla
    set((state) => ({
      buildings: state.buildings.map(b => 
        b.id === buildingId 
          ? { ...b, isUpgrading: true, upgradeTime: 60 } // 60 saniye
          : b
      )
    }));

    // Yükseltme tamamlandığında
    setTimeout(() => {
      set((state) => ({
        buildings: state.buildings.map(b =>
          b.id === buildingId
            ? { ...b, level: b.level + 1, isUpgrading: false }
            : b
        )
      }));
    }, 60000); // 60 saniye
  },

  selectBuilding: (buildingId) => {
    set((state) => ({
      buildings: state.buildings.map(b => ({
        ...b,
        isSelected: b.id === buildingId
      })),
      selectedBuilding: state.buildings.find(b => b.id === buildingId) || null
    }));
  },

  closeSelectedBuilding: () => {
    set((state) => ({
      buildings: state.buildings.map(b => ({
        ...b,
        isSelected: false
      })),
      selectedBuilding: null
    }));
  },

  trainUnit: (unitType) => {
    // Birim eğitimi implementasyonu
  },

  calculateUpgradeCost: (building) => {
    const baseCost = {
      wood: 150,
      stone: 150,
    };

    const multiplier = Math.pow(1.5, building.level);

    return {
      wood: Math.floor(baseCost.wood * multiplier),
      stone: Math.floor(baseCost.stone * multiplier),
    };
  },

  calculateAttackPower: () => {
    const state = get();
    return (
      state.army.swordsmen * 10 +
      state.army.archers * 8 +
      state.army.cavalry * 15
    );
  },

  calculateDefensePower: () => {
    const state = get();
    return (
      state.army.swordsmen * 8 +
      state.army.archers * 5 +
      state.army.cavalry * 10
    );
  },

  calculateArmyUpkeep: () => {
    const state = get();
    return (
      state.army.swordsmen * 2 +
      state.army.archers * 2 +
      state.army.cavalry * 4
    );
  },

  calculateResourceProduction: (resourceType) => {
    const state = get();
    const baseProduction = {
      wood: 10,
      stone: 8,
      iron: 5,
      grain: 15
    };

    // Bina seviyelerine göre üretimi hesapla
    const buildings = state.buildings;
    let multiplier = 1;

    buildings.forEach(building => {
      switch (building.type) {
        case 'Woodcutter':
          if (resourceType === 'wood') {
            multiplier += building.level * 0.2; // Her seviye %20 artış
          }
          break;
        case 'Quarry':
          if (resourceType === 'stone') {
            multiplier += building.level * 0.2;
          }
          break;
        case 'Iron Mine':
          if (resourceType === 'iron') {
            multiplier += building.level * 0.2;
          }
          break;
        case 'Farm':
          if (resourceType === 'grain') {
            multiplier += building.level * 0.2;
          }
          break;
      }
    });

    // Tahıl üretiminden ordu bakım maliyetini düş
    if (resourceType === 'grain') {
      const upkeep = get().calculateArmyUpkeep();
      return Math.max(0, (baseProduction[resourceType] * multiplier) - upkeep);
    }

    return baseProduction[resourceType] * multiplier;
  },

  updateResources: () => {
    set((state) => {
      const newResources = { ...state.resources };
      
      (Object.keys(newResources) as Array<keyof typeof newResources>).forEach((resource) => {
        const production = state.calculateResourceProduction(resource);
        newResources[resource] = Math.max(0, newResources[resource] + production);
      });

      return { resources: newResources };
    });
  },
}));