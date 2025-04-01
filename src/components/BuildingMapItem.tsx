import React from 'react';
import { Building as BuildingModel } from '../models/building';
import { Building } from './Building';
import { useGameStore } from '../store/gameStore';

interface BuildingMapItemProps {
  building: BuildingModel;
  gridCellSize: number;
}

export function BuildingMapItem({ building, gridCellSize }: BuildingMapItemProps) {
  const { selectBuilding } = useGameStore();

  return (
    <Building
      name={building.name}
      type={building.type}
      level={building.level}
      size={{ width: 2, height: 2 }} // Tüm binalar için 2x2
      position={building.position}
      upgradeCost={{}} // gameStore'dan hesaplanacak
      isUpgrading={building.isUpgrading}
      upgradeProgress={building.upgradeProgress || 0}
      isSelected={building.isSelected}
      gridCellSize={gridCellSize}
      onClick={() => selectBuilding(building.id)}
    />
  );
} 