import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { VillageMap } from './VillageMap';
import { BuildingDetailModal } from './BuildingDetailModal';
import { ResourceBar } from './ResourceBar';

export function VillageView() {
  const { 
    buildings,
    selectedBuilding,
    upgradeBuilding,
    calculateUpgradeCost,
    closeSelectedBuilding,
    updateResources
  } = useGameStore();

  // Kaynak güncelleme döngüsü
  useEffect(() => {
    // Her saniye kaynakları güncelle
    const resourceInterval = setInterval(updateResources, 1000);

    // Temizlik
    return () => {
      clearInterval(resourceInterval);
    };
  }, [updateResources]);

  return (
    <div className="min-h-screen bg-amber-950">
      {/* Üst kaynak çubuğu */}
      <ResourceBar />

      {/* Ana harita alanı */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-medieval text-amber-500 mb-8 text-center">
          Köyünüz
        </h1>

        {/* Harita */}
        <div className="aspect-square max-w-4xl mx-auto">
          <VillageMap />
        </div>
      </div>

      {/* Seçili bina detayları */}
      {selectedBuilding && (
        <BuildingDetailModal
          building={selectedBuilding}
          upgradeCost={calculateUpgradeCost(selectedBuilding)}
          onUpgrade={() => upgradeBuilding(selectedBuilding.id)}
          onClose={closeSelectedBuilding}
        />
      )}
    </div>
  );
}