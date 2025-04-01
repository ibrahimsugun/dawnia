import { create } from 'zustand';

interface Resources {
  wood: number;
  stone: number;
  iron: number;
  grain: number;
}

interface Building {
  id: string;
  name: string;
  type: string;
  level: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  description: string;
  isUpgrading: boolean;
  isSelected: boolean;
  upgradeProgress: number;
}

interface BuildingCost {
  wood?: number;
  stone?: number;
  iron?: number;
  grain?: number;
}

export interface GameState {
  // Temel özellikler
  selectedRace: string | null;
  selectedRegion: string | null;
  avatarName: string | null;
  resources: Resources;
  
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

  // Irk özellikleri
  raceBonus: {
    resourceProduction: {
      wood: number;
      stone: number;
      iron: number;
      grain: number;
    };
    buildingCostReduction: number;
    armyBonus: {
      attack: number;
      defense: number;
      trainingSpeed: number;
    };
  };

  // Aksiyonlar
  initializeGame: (race: string) => void;
  upgradeBuilding: (buildingId: string) => void;
  selectBuilding: (buildingId: string) => void;
  closeSelectedBuilding: () => void;
  trainUnit: (unitType: 'swordsmen' | 'archers' | 'cavalry') => void;
  calculateUpgradeCost: (building: Building) => BuildingCost;
  calculateAttackPower: () => number;
  calculateDefensePower: () => number;
  calculateArmyUpkeep: () => number;
  calculateResourceProduction: () => {
    wood: number;
    stone: number;
    iron: number;
    grain: number;
  };
  updateResources: () => void;
  initializeRace: (race: string) => void;
  initializeRegion: (region: string) => void;
  addResource: (resource: keyof Resources, amount: number) => void;
  setAvatarName: (name: string) => void;
}

const getRaceBonus = (race: string) => {
  switch (race) {
    case 'highlanders':
      return {
        resourceProduction: {
          wood: 1.0,
          stone: 1.5,
          iron: 1.5,
          grain: 1.0
        },
        buildingCostReduction: 0.1,
        armyBonus: {
          attack: 1.0,
          defense: 1.5,
          trainingSpeed: 1.0
        }
      };
    case 'forestkin':
      return {
        resourceProduction: {
          wood: 1.5,
          stone: 1.0,
          iron: 1.0,
          grain: 1.5
        },
        buildingCostReduction: 0.0,
        armyBonus: {
          attack: 1.3,
          defense: 1.0,
          trainingSpeed: 1.2
        }
      };
    case 'nomads':
      return {
        resourceProduction: {
          wood: 1.0,
          stone: 1.0,
          iron: 1.2,
          grain: 1.2
        },
        buildingCostReduction: 0.0,
        armyBonus: {
          attack: 1.5,
          defense: 0.8,
          trainingSpeed: 1.5
        }
      };
    default:
      return {
        resourceProduction: {
          wood: 1.0,
          stone: 1.0,
          iron: 1.0,
          grain: 1.0
        },
        buildingCostReduction: 0.0,
        armyBonus: {
          attack: 1.0,
          defense: 1.0,
          trainingSpeed: 1.0
        }
      };
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  selectedRace: null,
  selectedRegion: null,
  avatarName: null,
  resources: {
    wood: 100,
    stone: 100,
    iron: 100,
    grain: 100,
  },
  
  buildings: [],
  selectedBuilding: null,
  
  army: {
    swordsmen: 0,
    archers: 0,
    cavalry: 0,
  },
  
  trainingQueue: [],

  raceBonus: getRaceBonus(''),

  initializeGame: (race: string) => {
    set({
      selectedRace: race,
      raceBonus: getRaceBonus(race),
      buildings: [
        {
          id: '1',
          name: 'Ana Bina',
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
          name: 'Çiftlik',
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
          name: 'Oduncu',
          type: 'Woodcutter',
          level: 1,
          position: { x: 14, y: 10 },
          size: { width: 2, height: 2 },
          description: 'Ormandan odun toplar',
          isUpgrading: false,
          isSelected: false,
          upgradeProgress: 0,
        },
      ]
    });
  },

  upgradeBuilding: (buildingId) => {
    const state = get();
    const building = state.buildings.find(b => b.id === buildingId);
    if (!building) return;

    const cost = state.calculateUpgradeCost(building);
    
    if (
      (cost.wood && state.resources.wood < cost.wood) ||
      (cost.stone && state.resources.stone < cost.stone) ||
      (cost.iron && state.resources.iron < cost.iron) ||
      (cost.grain && state.resources.grain < cost.grain)
    ) {
      return;
    }

    set((state) => ({
      resources: {
        wood: state.resources.wood - (cost.wood || 0),
        stone: state.resources.stone - (cost.stone || 0),
        iron: state.resources.iron - (cost.iron || 0),
        grain: state.resources.grain - (cost.grain || 0),
      }
    }));

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

  trainUnit: (unitType: 'swordsmen' | 'archers' | 'cavalry') => {
    const state = get();
    const costs = {
      swordsmen: { iron: 30, grain: 20 },
      archers: { wood: 30, grain: 15 },
      cavalry: { iron: 40, grain: 30 }
    };

    const cost = costs[unitType];
    
    // Kaynak kontrolü
    if (
      Object.entries(cost).some(
        ([resource, amount]) => state.resources[resource as keyof Resources] < amount
      )
    ) {
      return;
    }

    // Kaynakları düş
    set((state) => ({
      resources: {
        ...state.resources,
        ...Object.fromEntries(
          Object.entries(cost).map(([resource, amount]) => [
            resource,
            state.resources[resource as keyof Resources] - amount
          ])
        )
      }
    }));

    // Birimi ekle
    set((state) => ({
      army: {
        ...state.army,
        [unitType]: state.army[unitType] + 1
      }
    }));
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

  initializeRace: (race) => set(() => ({ selectedRace: race })),
  initializeRegion: (region) => set(() => ({ selectedRegion: region })),
  addResource: (resource, amount) =>
    set((state) => ({
      resources: {
        ...state.resources,
        [resource]: state.resources[resource] + amount,
      },
    })),
  setAvatarName: (name: string) => set({ avatarName: name }),
}));