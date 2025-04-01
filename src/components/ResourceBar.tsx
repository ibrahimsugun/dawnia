import React from 'react';
import { Wheat, Trees as Tree, Mountain, Cog } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../lib/utils';

export function ResourceBar() {
  const { resources, calculateResourceProduction } = useGameStore();

  const resourceIcons = {
    grain: Wheat,
    wood: Tree,
    stone: Mountain,
    iron: Cog,
  };

  const resourceNames = {
    grain: 'Tahıl',
    wood: 'Odun',
    stone: 'Taş',
    iron: 'Demir',
  };

  return (
    <div className="bg-[#2A1810]/95 border-b border-amber-900/30 p-4 sticky top-0 z-40 backdrop-blur-sm">
      <div className="container mx-auto flex justify-center gap-8">
        {(Object.keys(resources) as Array<keyof typeof resources>).map((resource) => {
          const Icon = resourceIcons[resource];
          const production = calculateResourceProduction(resource) || 0;
          const amount = resources[resource] || 0;

          return (
            <div key={resource} className="flex items-center gap-3">
              <Icon className="h-6 w-6 text-amber-500" />
              <div>
                <p className="text-amber-400 font-medieval text-sm">
                  {resourceNames[resource]}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 font-medium">
                    {formatNumber(amount)}
                  </span>
                  <span className="text-amber-400/70 text-sm">
                    (+{formatNumber(production)}/s)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}