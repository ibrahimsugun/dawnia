import React from 'react';
import { Home, Wheat, Trees as Tree, Mountain, Cog, Sword, Shield } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../lib/utils';
import { BuildingRenderer } from './BuildingRenderer';
import { CountdownTimer } from './CountdownTimer';

export function VillageView() {
  const { 
    buildings, 
    upgradeBuilding, 
    units, 
    trainUnit, 
    trainingQueue, 
    calculateUpgradeCost,
    army,
    calculateDefensePower,
    calculateAttackPower,
    calculateArmyUpkeep
  } = useGameStore();

  const buildingIcons = {
    'Main Building': Home,
    'Farm': Wheat,
    'Woodcutter': Tree,
    'Quarry': Mountain,
    'Iron Mine': Cog,
    'Barracks': Sword,
    'Wall': Shield,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings.map((building) => {
          const Icon = buildingIcons[building.name as keyof typeof buildingIcons];
          const upgradeCosts = calculateUpgradeCost(building);
          
          return (
            <div 
              key={building.name}
              className="bg-amber-900/20 rounded-lg p-4 hover:bg-amber-900/30 transition-colors"
            >
              <BuildingRenderer buildingType={building.name} level={building.level} />
              
              <div className="flex items-center gap-3 mb-3 mt-4">
                <Icon className="h-6 w-6 text-amber-200" />
                <div>
                  <h3 className="text-amber-100 font-medium">{building.name}</h3>
                  <p className="text-sm text-amber-200/80">Level {building.level}</p>
                </div>
              </div>
              <p className="text-amber-100/70 text-sm mb-3">{building.description}</p>
              
              <div className="text-sm text-amber-200/80 mb-3">
                <p className="font-medium mb-1">Upgrade Costs:</p>
                <div className="grid grid-cols-2 gap-2">
                  {upgradeCosts.wood && (
                    <div className="flex items-center gap-1">
                      <Tree className="h-4 w-4" />
                      <span>{formatNumber(upgradeCosts.wood)}</span>
                    </div>
                  )}
                  {upgradeCosts.stone && (
                    <div className="flex items-center gap-1">
                      <Mountain className="h-4 w-4" />
                      <span>{formatNumber(upgradeCosts.stone)}</span>
                    </div>
                  )}
                  {upgradeCosts.iron && (
                    <div className="flex items-center gap-1">
                      <Cog className="h-4 w-4" />
                      <span>{formatNumber(upgradeCosts.iron)}</span>
                    </div>
                  )}
                  {upgradeCosts.grain && (
                    <div className="flex items-center gap-1">
                      <Wheat className="h-4 w-4" />
                      <span>{formatNumber(upgradeCosts.grain)}</span>
                    </div>
                  )}
                </div>
              </div>

              {building.isUpgrading ? (
                <div className="mt-3 text-center">
                  <CountdownTimer 
                    endTime={Date.now() + building.upgradeTime * 1000} 
                    onComplete={() => {}} 
                  />
                </div>
              ) : (
                building.level > 0 ? (
                  <button
                    onClick={() => upgradeBuilding(building.name)}
                    className="mt-3 w-full bg-amber-700/50 hover:bg-amber-700/70 text-amber-100 py-2 px-4 rounded-md transition-colors"
                  >
                    Upgrade to Level {building.level + 1}
                  </button>
                ) : (
                  <button
                    onClick={() => upgradeBuilding(building.name)}
                    className="mt-3 w-full bg-amber-600/50 hover:bg-amber-600/70 text-amber-100 py-2 px-4 rounded-md transition-colors"
                  >
                    Build
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>

      {buildings.find(b => b.name === 'Barracks')?.level > 0 && (
        <div className="bg-amber-900/20 rounded-lg p-4">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-amber-100 mb-4">Military Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-amber-200/80">
              <div className="bg-amber-800/20 p-3 rounded-lg">
                <p className="font-medium">Army Size</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>Swordsmen: {formatNumber(army.swordsmen)}</p>
                  <p>Archers: {formatNumber(army.archers)}</p>
                  <p>Cavalry: {formatNumber(army.cavalry)}</p>
                </div>
              </div>
              <div className="bg-amber-800/20 p-3 rounded-lg">
                <p className="font-medium">Military Power</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>Attack: {formatNumber(calculateAttackPower())}</p>
                  <p>Defense: {formatNumber(calculateDefensePower())}</p>
                </div>
              </div>
              <div className="bg-amber-800/20 p-3 rounded-lg">
                <p className="font-medium">Upkeep</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>{formatNumber(calculateArmyUpkeep())} grain/hour</p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-amber-100 mb-4">Train Units</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {units.map((unit) => (
              <div key={unit.name} className="bg-amber-800/20 rounded-lg p-4">
                <h3 className="text-amber-100 font-medium mb-2">{unit.name}</h3>
                <div className="text-sm text-amber-200/80 space-y-1">
                  <p>Attack: {unit.attack}</p>
                  <p>Defense: {unit.defense}</p>
                  <p>Health: {unit.health}</p>
                  <p>Upkeep: {unit.upkeep} grain/hour</p>
                </div>
                <div className="mt-3 text-sm text-amber-200/80">
                  <p className="font-medium mb-1">Training Costs:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {unit.costs.wood && (
                      <div className="flex items-center gap-1">
                        <Tree className="h-4 w-4" />
                        <span>{formatNumber(unit.costs.wood)}</span>
                      </div>
                    )}
                    {unit.costs.stone && (
                      <div className="flex items-center gap-1">
                        <Mountain className="h-4 w-4" />
                        <span>{formatNumber(unit.costs.stone)}</span>
                      </div>
                    )}
                    {unit.costs.iron && (
                      <div className="flex items-center gap-1">
                        <Cog className="h-4 w-4" />
                        <span>{formatNumber(unit.costs.iron)}</span>
                      </div>
                    )}
                    {unit.costs.grain && (
                      <div className="flex items-center gap-1">
                        <Wheat className="h-4 w-4" />
                        <span>{formatNumber(unit.costs.grain)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => trainUnit(unit.name)}
                  className="mt-3 w-full bg-amber-700/50 hover:bg-amber-700/70 text-amber-100 py-2 px-4 rounded-md transition-colors"
                >
                  Train
                </button>
              </div>
            ))}
          </div>
          {trainingQueue.length > 0 && (
            <div className="mt-4">
              <h3 className="text-amber-100 font-medium mb-2">Training Queue</h3>
              <div className="space-y-2">
                {trainingQueue.map((item, index) => (
                  <div key={index} className="text-amber-200/80">
                    Training {item.unit.name} - <CountdownTimer endTime={Date.now() + item.remainingTime * 1000} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}