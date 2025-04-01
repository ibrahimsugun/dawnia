import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Wheat, Trees as Tree, Mountain, Cog } from 'lucide-react';
import { formatNumber } from '../lib/utils';

const resourceConfig = [
  { type: 'wood', name: 'Odun', Icon: Tree },
  { type: 'stone', name: 'Taş', Icon: Mountain },
  { type: 'iron', name: 'Demir', Icon: Cog },
  { type: 'grain', name: 'Tahıl', Icon: Wheat },
];

export function ResourceBar() {
  const { resources, calculateResourceProduction } = useGameStore();
  const production = calculateResourceProduction();

  return (
    <div className="bg-[#2A1810]/95 border-b border-amber-900/30 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-center gap-8 items-center">
          {resourceConfig.map(({ type, name, Icon }) => (
            <div key={type} className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-amber-500" />
              <div className="text-amber-300">
                <span>{formatNumber(resources[type as keyof typeof resources])}</span>
                <span className="text-amber-500 text-sm ml-1">
                  (+{formatNumber(production[type as keyof typeof production])}/s)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}