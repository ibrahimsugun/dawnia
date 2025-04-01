import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return Math.floor(num).toLocaleString();
}

export function calculateBattleOutcome(
  attackerArmy: {
    swordsmen: number;
    archers: number;
    cavalry: number;
  },
  defenderArmy: {
    swordsmen: number;
    archers: number;
    cavalry: number;
  },
  wallLevel: number
) {
  // Base stats for each unit type
  const unitStats = {
    swordsmen: { attack: 10, defense: 5 },
    archers: { attack: 12, defense: 3 },
    cavalry: { attack: 20, defense: 15 },
  };

  // Calculate total attack power
  const totalAttack =
    attackerArmy.swordsmen * unitStats.swordsmen.attack +
    attackerArmy.archers * unitStats.archers.attack +
    attackerArmy.cavalry * unitStats.cavalry.attack;

  // Calculate total defense power with wall bonus
  const wallBonus = 1 + wallLevel * 0.2; // 20% bonus per wall level
  const totalDefense = (
    defenderArmy.swordsmen * unitStats.swordsmen.defense +
    defenderArmy.archers * unitStats.archers.defense +
    defenderArmy.cavalry * unitStats.cavalry.defense
  ) * wallBonus;

  // Calculate casualties
  const attackerLossRatio = Math.min(totalDefense / totalAttack, 1);
  const defenderLossRatio = Math.min(totalAttack / totalDefense, 1);

  // Calculate surviving units
  const survivingAttackers = {
    swordsmen: Math.floor(attackerArmy.swordsmen * (1 - attackerLossRatio)),
    archers: Math.floor(attackerArmy.archers * (1 - attackerLossRatio)),
    cavalry: Math.floor(attackerArmy.cavalry * (1 - attackerLossRatio)),
  };

  const survivingDefenders = {
    swordsmen: Math.floor(defenderArmy.swordsmen * (1 - defenderLossRatio)),
    archers: Math.floor(defenderArmy.archers * (1 - defenderLossRatio)),
    cavalry: Math.floor(defenderArmy.cavalry * (1 - defenderLossRatio)),
  };

  // Determine winner
  const attackerWon = totalAttack > totalDefense;

  return {
    attackerWon,
    survivingAttackers,
    survivingDefenders,
    attackerLossRatio,
    defenderLossRatio,
  };
}

export function calculateResourceProduction(
  baseProduction: number,
  level: number
): number {
  return Math.floor(baseProduction * (1 + level * 0.2)); // 20% increase per level
}

export function calculateStorageCapacity(
  baseCapacity: number,
  level: number
): number {
  return Math.floor(baseCapacity * Math.pow(1.5, level)); // 50% increase per level
}

export function calculateUpgradeCost(
  baseCost: { [key: string]: number },
  level: number
): { [key: string]: number } {
  const multiplier = Math.pow(1.5, level);
  const result: { [key: string]: number } = {};

  for (const [resource, cost] of Object.entries(baseCost)) {
    result[resource] = Math.floor(cost * multiplier);
  }

  return result;
}

export function calculateTrainingTime(
  baseTime: number,
  barracksLevel: number
): number {
  const reduction = barracksLevel * 0.1; // 10% reduction per level
  return Math.max(baseTime * (1 - reduction), baseTime * 0.1); // Minimum 10% of base time
}

export function calculateUpgradeTime(
  baseTime: number,
  mainBuildingLevel: number
): number {
  const reduction = mainBuildingLevel * 0.1; // 10% reduction per level
  return Math.max(baseTime * (1 - reduction), baseTime * 0.1); // Minimum 10% of base time
}