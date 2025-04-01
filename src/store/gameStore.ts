import { create } from 'zustand';
import { calculateBattleOutcome, calculateResourceProduction, calculateStorageCapacity, calculateUpgradeCost, calculateTrainingTime, calculateUpgradeTime } from '../lib/utils';

interface Army {
  swordsmen: number;
  archers: number;
  cavalry: number;
}

export interface Resource {
  name: string;
  amount: number;
  production: number;
  capacity: number;
}

export interface Building {
  name: string;
  level: number;
  description: string;
  baseProduction?: number;
  baseCapacity?: number;
  upgradeTime: number;
  isUpgrading: boolean;
  upgradeCosts: {
    wood?: number;
    stone?: number;
    iron?: number;
    grain?: number;
  };
}

export interface Unit {
  name: string;
  attack: number;
  defense: number;
  health: number;
  trainingTime: number;
  upkeep: number;
  costs: {
    wood?: number;
    stone?: number;
    iron?: number;
    grain?: number;
  };
}

interface GameState {
  resources: {
    grain: Resource;
    wood: Resource;
    stone: Resource;
    iron: Resource;
  };
  buildings: Building[];
  units: Unit[];
  army: Army;
  trainingQueue: { unit: Unit; remainingTime: number }[];
  updateResources: () => void;
  upgradeBuilding: (buildingName: string) => void;
  trainUnit: (unitName: string) => void;
  calculateUpgradeCost: (building: Building) => {
    wood?: number;
    stone?: number;
    iron?: number;
    grain?: number;
  };
  calculateProductionRate: (building: Building) => number;
  calculateStorageCapacity: (building: Building) => number;
  calculateArmyUpkeep: () => number;
  calculateDefensePower: () => number;
  calculateAttackPower: () => number;
}

export const useGameStore = create<GameState>((set, get) => ({
  resources: {
    grain: { name: 'Grain', amount: 100, production: 10, capacity: 1000 },
    wood: { name: 'Wood', amount: 150, production: 8, capacity: 1000 },
    stone: { name: 'Stone', amount: 80, production: 5, capacity: 1000 },
    iron: { name: 'Iron', amount: 50, production: 3, capacity: 1000 },
  },
  buildings: [
    {
      name: 'Main Building',
      level: 1,
      description: 'Center of your village. Each level reduces building time by 10%',
      upgradeTime: 300,
      isUpgrading: false,
      upgradeCosts: { wood: 100, stone: 100 },
    },
    {
      name: 'Farm',
      level: 1,
      description: 'Produces grain for your village',
      baseProduction: 10,
      baseCapacity: 1000,
      upgradeTime: 180,
      isUpgrading: false,
      upgradeCosts: { wood: 80, stone: 50 },
    },
    {
      name: 'Woodcutter',
      level: 1,
      description: 'Gathers wood from the forest',
      baseProduction: 8,
      baseCapacity: 1000,
      upgradeTime: 180,
      isUpgrading: false,
      upgradeCosts: { wood: 50, stone: 50 },
    },
    {
      name: 'Quarry',
      level: 1,
      description: 'Mines stone from the mountains',
      baseProduction: 5,
      baseCapacity: 1000,
      upgradeTime: 240,
      isUpgrading: false,
      upgradeCosts: { wood: 100, stone: 30 },
    },
    {
      name: 'Iron Mine',
      level: 1,
      description: 'Extracts iron ore',
      baseProduction: 3,
      baseCapacity: 1000,
      upgradeTime: 300,
      isUpgrading: false,
      upgradeCosts: { wood: 100, stone: 100 },
    },
    {
      name: 'Barracks',
      level: 0,
      description: 'Train military units. Each level reduces training time by 10%',
      upgradeTime: 360,
      isUpgrading: false,
      upgradeCosts: { wood: 200, stone: 150 },
    },
    {
      name: 'Wall',
      level: 0,
      description: 'Defends your village. Each level adds 20% to defense',
      upgradeTime: 420,
      isUpgrading: false,
      upgradeCosts: { wood: 100, stone: 300 },
    },
  ],
  units: [
    {
      name: 'Swordsman',
      attack: 10,
      defense: 5,
      health: 100,
      trainingTime: 120,
      upkeep: 1,
      costs: { wood: 30, iron: 20, grain: 10 },
    },
    {
      name: 'Archer',
      attack: 12,
      defense: 3,
      health: 80,
      trainingTime: 150,
      upkeep: 1,
      costs: { wood: 40, iron: 15, grain: 10 },
    },
    {
      name: 'Cavalry',
      attack: 20,
      defense: 15,
      health: 150,
      trainingTime: 300,
      upkeep: 2,
      costs: { wood: 50, iron: 40, grain: 30 },
    },
  ],
  army: {
    swordsmen: 0,
    archers: 0,
    cavalry: 0,
  },
  trainingQueue: [],

  calculateUpgradeCost: (building: Building) => {
    const baseCosts = building.upgradeCosts;
    const level = building.level;
    return calculateUpgradeCost(baseCosts, level);
  },

  calculateProductionRate: (building: Building) => {
    if (!building.baseProduction) return 0;
    return calculateResourceProduction(building.baseProduction, building.level);
  },

  calculateStorageCapacity: (building: Building) => {
    if (!building.baseCapacity) return 0;
    return calculateStorageCapacity(building.baseCapacity, building.level);
  },

  calculateArmyUpkeep: () => {
    const state = get();
    return (
      state.army.swordsmen * state.units[0].upkeep +
      state.army.archers * state.units[1].upkeep +
      state.army.cavalry * state.units[2].upkeep
    );
  },

  calculateDefensePower: () => {
    const state = get();
    const wall = state.buildings.find(b => b.name === 'Wall');
    const wallBonus = wall ? 1 + (wall.level * 0.2) : 1;

    const baseDefense = 
      state.army.swordsmen * state.units[0].defense +
      state.army.archers * state.units[1].defense +
      state.army.cavalry * state.units[2].defense;

    return Math.floor(baseDefense * wallBonus);
  },

  calculateAttackPower: () => {
    const state = get();
    return (
      state.army.swordsmen * state.units[0].attack +
      state.army.archers * state.units[1].attack +
      state.army.cavalry * state.units[2].attack
    );
  },

  updateResources: () => {
    set((state) => {
      const newResources = { ...state.resources };
      const upkeep = state.calculateArmyUpkeep();

      Object.keys(newResources).forEach((key) => {
        const resource = newResources[key as keyof typeof newResources];
        let newAmount = resource.amount;

        if (key === 'grain') {
          newAmount += (resource.production - upkeep) / 3600;
        } else {
          newAmount += resource.production / 3600;
        }

        resource.amount = Math.max(0, Math.min(newAmount, resource.capacity));
      });

      return { resources: newResources };
    });
  },

  upgradeBuilding: (buildingName: string) => {
    const state = get();
    const buildingIndex = state.buildings.findIndex((b) => b.name === buildingName);
    if (buildingIndex === -1) return;

    const building = state.buildings[buildingIndex];
    const costs = state.calculateUpgradeCost(building);

    // Check if we have enough resources
    if (
      costs.wood && state.resources.wood.amount < costs.wood ||
      costs.stone && state.resources.stone.amount < costs.stone ||
      costs.iron && state.resources.iron.amount < costs.iron ||
      costs.grain && state.resources.grain.amount < costs.grain
    ) {
      return;
    }

    // Calculate upgrade time with Main Building bonus
    const mainBuilding = state.buildings.find(b => b.name === 'Main Building');
    const actualUpgradeTime = calculateUpgradeTime(building.upgradeTime, mainBuilding?.level || 0);

    // Deduct resources
    set((state) => {
      const newResources = { ...state.resources };
      if (costs.wood) newResources.wood.amount -= costs.wood;
      if (costs.stone) newResources.stone.amount -= costs.stone;
      if (costs.iron) newResources.iron.amount -= costs.iron;
      if (costs.grain) newResources.grain.amount -= costs.grain;

      const newBuildings = [...state.buildings];
      newBuildings[buildingIndex] = {
        ...building,
        isUpgrading: true,
      };

      // Start upgrade timer
      setTimeout(() => {
        set((state) => {
          const buildings = [...state.buildings];
          buildings[buildingIndex] = {
            ...buildings[buildingIndex],
            level: buildings[buildingIndex].level + 1,
            isUpgrading: false,
          };

          // Update production and capacity if it's a resource building
          if (buildings[buildingIndex].baseProduction) {
            const resourceType = buildings[buildingIndex].name.toLowerCase().includes('farm') ? 'grain'
              : buildings[buildingIndex].name.toLowerCase().includes('woodcutter') ? 'wood'
              : buildings[buildingIndex].name.toLowerCase().includes('quarry') ? 'stone'
              : buildings[buildingIndex].name.toLowerCase().includes('iron') ? 'iron'
              : null;

            if (resourceType) {
              const newResources = { ...state.resources };
              const resource = newResources[resourceType as keyof typeof newResources];
              resource.production = state.calculateProductionRate(buildings[buildingIndex]);
              resource.capacity = state.calculateStorageCapacity(buildings[buildingIndex]);
              return { buildings, resources: newResources };
            }
          }

          return { buildings };
        });
      }, actualUpgradeTime * 1000);

      return { resources: newResources, buildings: newBuildings };
    });
  },

  trainUnit: (unitName: string) => {
    const state = get();
    const unit = state.units.find((u) => u.name === unitName);
    if (!unit) return;

    // Check if barracks exists and is level > 0
    const barracks = state.buildings.find((b) => b.name === 'Barracks');
    if (!barracks || barracks.level === 0) return;

    // Calculate training time with Barracks bonus
    const actualTrainingTime = calculateTrainingTime(unit.trainingTime, barracks.level);

    // Check if we have enough resources
    const costs = unit.costs;
    if (
      costs.wood && state.resources.wood.amount < costs.wood ||
      costs.stone && state.resources.stone.amount < costs.stone ||
      costs.iron && state.resources.iron.amount < costs.iron ||
      costs.grain && state.resources.grain.amount < costs.grain
    ) {
      return;
    }

    // Deduct resources
    set((state) => {
      const newResources = { ...state.resources };
      if (costs.wood) newResources.wood.amount -= costs.wood;
      if (costs.stone) newResources.stone.amount -= costs.stone;
      if (costs.iron) newResources.iron.amount -= costs.iron;
      if (costs.grain) newResources.grain.amount -= costs.grain;

      const newQueue = [...state.trainingQueue, { unit, remainingTime: actualTrainingTime }];

      // Start training timer
      setTimeout(() => {
        set((state) => {
          const newArmy = { ...state.army };
          switch (unit.name) {
            case 'Swordsman':
              newArmy.swordsmen++;
              break;
            case 'Archer':
              newArmy.archers++;
              break;
            case 'Cavalry':
              newArmy.cavalry++;
              break;
          }

          return {
            army: newArmy,
            trainingQueue: state.trainingQueue.filter((item) => item.unit !== unit),
          };
        });
      }, actualTrainingTime * 1000);

      return { resources: newResources, trainingQueue: newQueue };
    });
  },
}));