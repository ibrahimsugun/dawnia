import React, { useEffect } from 'react';
import { Wheat, Trees as Tree, Mountain, Cog } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../lib/utils';

export function ResourceBar() {
  const { resources, updateResources, calculateArmyUpkeep } = useGameStore();

  useEffect(() => {
    const interval = setInterval(updateResources, 1000);
    return () => clearInterval(interval);
  }, [updateResources]);

  const resourcesList = [
    { icon: Wheat, ...resources.grain },
    { icon: Tree, ...resources.wood },
    { icon: Mountain, ...resources.stone },
    { icon: Cog, ...resources.iron },
  ];

  const upkeep = calculateArmyUpkeep();

  return (
    <div className="bg-amber-900/20 rounded-lg p-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {resourcesList.map((resource) => (
          <div key={resource.name} className="flex items-center gap-3 bg-amber-50/10 p-3 rounded-md">
            <resource.icon className="h-5 w-5 text-amber-200" />
            <div>
              <div className="text-amber-100 font-medium">{resource.name}</div>
              <div className="text-sm text-amber-200/80">
                {formatNumber(resource.amount)}/{formatNumber(resource.capacity)} 
                {resource.name === 'Grain' ? (
                  <span> (+{formatNumber(resource.production - upkeep)}/h)</span>
                ) : (
                  <span> (+{formatNumber(resource.production)}/h)</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}