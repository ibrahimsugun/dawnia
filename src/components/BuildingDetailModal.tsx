import React from 'react';
import { Building, BuildingCost } from '../models/building';
import { formatNumber } from '../lib/utils';
import { Wheat, Trees as Tree, Mountain, Cog } from 'lucide-react';
import { CountdownTimer } from './CountdownTimer';

interface BuildingDetailModalProps {
  building: Building;
  upgradeCost: BuildingCost;
  onUpgrade: () => void;
  onClose: () => void;
}

export function BuildingDetailModal({ 
  building, 
  upgradeCost, 
  onUpgrade, 
  onClose 
}: BuildingDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#2A1810] rounded-lg border-2 border-amber-900/30 shadow-2xl 
        max-w-2xl w-full mx-4 p-6 space-y-6">
        {/* Başlık */}
        <div className="flex justify-between items-center border-b border-amber-900/30 pb-4">
          <h2 className="text-2xl font-medieval text-amber-500">{building.name}</h2>
          <button 
            onClick={onClose}
            className="text-amber-500 hover:text-amber-400 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Bina Bilgileri */}
        <div className="space-y-4">
          <p className="text-amber-300/90 font-medieval">{building.description}</p>
          
          <div className="flex items-center gap-3 text-amber-400">
            <span className="font-medieval">Seviye:</span>
            <span className="text-lg">{building.level}</span>
          </div>

          {/* Yükseltme Maliyeti */}
          {!building.isUpgrading && (
            <div className="bg-amber-900/20 rounded p-4 space-y-3">
              <h3 className="font-medieval text-amber-400">Yükseltme Maliyeti:</h3>
              <div className="grid grid-cols-2 gap-4">
                {upgradeCost.wood && (
                  <div className="flex items-center gap-2">
                    <Tree className="h-5 w-5 text-amber-500" />
                    <span className="text-amber-300">{formatNumber(upgradeCost.wood)}</span>
                  </div>
                )}
                {upgradeCost.stone && (
                  <div className="flex items-center gap-2">
                    <Mountain className="h-5 w-5 text-amber-500" />
                    <span className="text-amber-300">{formatNumber(upgradeCost.stone)}</span>
                  </div>
                )}
                {upgradeCost.iron && (
                  <div className="flex items-center gap-2">
                    <Cog className="h-5 w-5 text-amber-500" />
                    <span className="text-amber-300">{formatNumber(upgradeCost.iron)}</span>
                  </div>
                )}
                {upgradeCost.grain && (
                  <div className="flex items-center gap-2">
                    <Wheat className="h-5 w-5 text-amber-500" />
                    <span className="text-amber-300">{formatNumber(upgradeCost.grain)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* İnşaat Durumu */}
          {building.isUpgrading && (
            <div className="bg-amber-900/20 rounded p-4 text-center">
              <p className="text-amber-400 font-medieval mb-2">İnşaat Devam Ediyor</p>
              <CountdownTimer 
                endTime={Date.now() + (building.upgradeTime || 0) * 1000}
                onComplete={() => {}}
              />
            </div>
          )}
        </div>

        {/* Aksiyonlar */}
        <div className="flex justify-end gap-4 pt-4 border-t border-amber-900/30">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded font-medieval text-amber-400 
              hover:bg-amber-900/30 transition-colors"
          >
            Kapat
          </button>
          
          {!building.isUpgrading && (
            <button
              onClick={onUpgrade}
              className="px-6 py-2 bg-amber-800 hover:bg-amber-700 text-amber-100 
                rounded font-medieval border border-amber-600/30 
                shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Seviye {building.level + 1}'e Yükselt
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 