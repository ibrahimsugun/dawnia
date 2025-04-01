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
  calculateResourceProduction: () => {
    wood: number;
    stone: number;
    iron: number;
    grain: number;
  };
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
      size: { width: 2, height: 2 },
      description: 'Köyünüzün merkezi. Her seviye bina inşaat süresini %10 azaltır.',
      isUpgrading: false,
      isSelected: false,
      upgradeProgress: 0,
    },
    {
      id: '2',
      name: 'Farm',
      type: 'Farm',
      level: 1,
      position: { x: 10, y: 10 },
      size: { width: 2, height: 2 },
      description: 'Köyünüz için tahıl üretir',
      isUpgrading: false,
      isSelected: false,
      upgradeProgress: 0,
    },
    {
      id: '3',
      name: 'Woodcutter',
      type: 'Woodcutter',
      level: 1,
      position: { x: 14, y: 10 },
      size: { width: 2, height: 2 },
      description: 'Ormandan odun toplar',
      isUpgrading: false,
      isSelected: false,
      upgradeProgress: 0,
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
          ? { ...b, isUpgrading: true, upgradeProgress: 0 }
          : b
      )
    }));

    // Progress güncelleme intervali
    const interval = setInterval(() => {
      set((state) => {
        const building = state.buildings.find(b => b.id === buildingId);
        if (!building || !building.isUpgrading) {
          clearInterval(interval);
          return state;
        }

        const newProgress = building.upgradeProgress + (100 / 60); // 60 saniyede tamamlanacak
        
        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            buildings: state.buildings.map(b =>
              b.id === buildingId
                ? { ...b, level: b.level + 1, isUpgrading: false, upgradeProgress: 0 }
                : b
            )
          };
        }

        return {
          buildings: state.buildings.map(b =>
            b.id === buildingId
              ? { ...b, upgradeProgress: newProgress }
              : b
          )
        };
      });
    }, 1000);
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

  calculateResourceProduction: () => {
    const state = get();
    const production = {
      wood: 0,
      stone: 0,
      iron: 0,
      grain: 0
    };

    state.buildings.forEach(building => {
      switch (building.type) {
        case 'Woodcutter':
          production.wood += 16 * building.level;
          break;
        case 'Quarry':
          production.stone += 8 * building.level;
          break;
        case 'Iron Mine':
          production.iron += 5 * building.level;
          break;
        case 'Farm':
          production.grain += 24 * building.level;
          break;
      }
    });

    return production;
  },

  updateResources: () => {
    set((state) => {
      const newResources = { ...state.resources };
      
      (Object.keys(newResources) as Array<keyof typeof newResources>).forEach((resource) => {
        const production = state.calculateResourceProduction();
        newResources[resource] = Math.max(0, newResources[resource] + production[resource]);
      });

      return { resources: newResources };
    });
  },
}));