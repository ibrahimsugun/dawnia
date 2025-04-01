import React from 'react';
import { Home, Wheat, Trees as Tree, Mountain, Cog, Sword, Shield, Castle } from 'lucide-react';
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
    'Main Building': Castle,
    'Farm': Wheat,
    'Woodcutter': Tree,
    'Quarry': Mountain,
    'Iron Mine': Cog,
    'Barracks': Sword,
    'Wall': Shield,
  };

  return (
    <div className="space-y-8 p-6 bg-[url('/assets/parchment-bg.jpg')] bg-cover min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-medieval text-amber-900 mb-8 text-center">Village Overview</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildings.map((building) => {
            const Icon = buildingIcons[building.name as keyof typeof buildingIcons];
            const upgradeCosts = calculateUpgradeCost(building);
            
            return (
              <div 
                key={building.name}
                className="bg-[#2A1810]/90 backdrop-blur-sm rounded-lg p-6 border-2 border-amber-900/30 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <BuildingRenderer buildingType={building.name} level={building.level} />
                
                <div className="flex items-center gap-3 mb-3 mt-4">
                  <Icon className="h-8 w-8 text-amber-500" />
                  <div>
                    <h3 className="text-amber-100 font-medieval text-xl">{building.name}</h3>
                    <p className="text-sm text-amber-400">Level {building.level}</p>
                  </div>
                </div>
                <p className="text-amber-200/80 text-sm mb-4 font-medieval">{building.description}</p>
                
                <div className="text-sm text-amber-300/90 mb-4 bg-amber-900/20 p-3 rounded">
                  <p className="font-medieval mb-2">Upgrade Costs:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {upgradeCosts.wood && (
                      <div className="flex items-center gap-2">
                        <Tree className="h-5 w-5 text-amber-500" />
                        <span>{formatNumber(upgradeCosts.wood)}</span>
                      </div>
                    )}
                    {upgradeCosts.stone && (
                      <div className="flex items-center gap-2">
                        <Mountain className="h-5 w-5 text-amber-500" />
                        <span>{formatNumber(upgradeCosts.stone)}</span>
                      </div>
                    )}
                    {upgradeCosts.iron && (
                      <div className="flex items-center gap-2">
                        <Cog className="h-5 w-5 text-amber-500" />
                        <span>{formatNumber(upgradeCosts.iron)}</span>
                      </div>
                    )}
                    {upgradeCosts.grain && (
                      <div className="flex items-center gap-2">
                        <Wheat className="h-5 w-5 text-amber-500" />
                        <span>{formatNumber(upgradeCosts.grain)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {building.isUpgrading ? (
                  <div className="mt-4 text-center bg-amber-900/30 p-3 rounded">
                    <p className="text-amber-200 font-medieval mb-2">Under Construction</p>
                    <CountdownTimer 
                      endTime={Date.now() + building.upgradeTime * 1000} 
                      onComplete={() => {}} 
                    />
                  </div>
                ) : (
                  building.level > 0 ? (
                    <button
                      onClick={() => upgradeBuilding(building.name)}
                      className="mt-4 w-full bg-amber-800 hover:bg-amber-700 text-amber-100 py-3 px-6 rounded font-medieval border border-amber-600/30 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Upgrade to Level {building.level + 1}
                    </button>
                  ) : (
                    <button
                      onClick={() => upgradeBuilding(building.name)}
                      className="mt-4 w-full bg-amber-700 hover:bg-amber-600 text-amber-100 py-3 px-6 rounded font-medieval border border-amber-500/30 shadow-lg hover:shadow-xl transition-all duration-300"
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
          <div className="mt-12 bg-[#2A1810]/90 backdrop-blur-sm rounded-lg p-8 border-2 border-amber-900/30 shadow-xl">
            <div className="mb-8">
              <h2 className="text-2xl font-medieval text-amber-500 mb-6">Military Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-amber-900/30 p-4 rounded-lg border border-amber-800/30">
                  <p className="font-medieval text-amber-300 mb-3">Army Size</p>
                  <div className="space-y-2 text-sm text-amber-200/90">
                    <p>Swordsmen: {formatNumber(army.swordsmen)}</p>
                    <p>Archers: {formatNumber(army.archers)}</p>
                    <p>Cavalry: {formatNumber(army.cavalry)}</p>
                  </div>
                </div>
                <div className="bg-amber-900/30 p-4 rounded-lg border border-amber-800/30">
                  <p className="font-medieval text-amber-300 mb-3">Military Power</p>
                  <div className="space-y-2 text-sm text-amber-200/90">
                    <p>Attack: {formatNumber(calculateAttackPower())}</p>
                    <p>Defense: {formatNumber(calculateDefensePower())}</p>
                  </div>
                </div>
                <div className="bg-amber-900/30 p-4 rounded-lg border border-amber-800/30">
                  <p className="font-medieval text-amber-300 mb-3">Upkeep</p>
                  <div className="text-sm text-amber-200/90">
                    <p>{formatNumber(calculateArmyUpkeep())} grain/hour</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-medieval text-amber-500 mb-6">Train Units</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {units.map((unit) => (
                <div key={unit.name} className="bg-amber-900/30 rounded-lg p-5 border border-amber-800/30">
                  <h3 className="text-amber-300 font-medieval text-lg mb-3">{unit.name}</h3>
                  <div className="text-sm text-amber-200/90 space-y-2">
                    <p>Attack: {unit.attack}</p>
                    <p>Defense: {unit.defense}</p>
                    <p>Health: {unit.health}</p>
                    <p>Upkeep: {unit.upkeep} grain/hour</p>
                  </div>
                  <div className="mt-4 text-sm text-amber-300">
                    <p className="font-medieval mb-2">Training Costs:</p>
                    <div className="grid grid-cols-2 gap-3">
                      {unit.costs.wood && (
                        <div className="flex items-center gap-2">
                          <Tree className="h-5 w-5 text-amber-500" />
                          <span>{formatNumber(unit.costs.wood)}</span>
                        </div>
                      )}
                      {unit.costs.stone && (
                        <div className="flex items-center gap-2">
                          <Mountain className="h-5 w-5 text-amber-500" />
                          <span>{formatNumber(unit.costs.stone)}</span>
                        </div>
                      )}
                      {unit.costs.iron && (
                        <div className="flex items-center gap-2">
                          <Cog className="h-5 w-5 text-amber-500" />
                          <span>{formatNumber(unit.costs.iron)}</span>
                        </div>
                      )}
                      {unit.costs.grain && (
                        <div className="flex items-center gap-2">
                          <Wheat className="h-5 w-5 text-amber-500" />
                          <span>{formatNumber(unit.costs.grain)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => trainUnit(unit.name)}
                    className="mt-4 w-full bg-amber-800 hover:bg-amber-700 text-amber-100 py-3 px-6 rounded font-medieval border border-amber-600/30 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Train
                  </button>
                </div>
              ))}
            </div>
            {trainingQueue.length > 0 && (
              <div className="mt-6 bg-amber-900/30 p-4 rounded-lg border border-amber-800/30">
                <h3 className="text-amber-300 font-medieval mb-3">Training Queue</h3>
                <div className="space-y-3">
                  {trainingQueue.map((item, index) => (
                    <div key={index} className="text-amber-200/90 flex items-center gap-3">
                      <Sword className="h-5 w-5 text-amber-500" />
                      <span>Training {item.unit.name} - </span>
                      <CountdownTimer endTime={Date.now() + item.remainingTime * 1000} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}