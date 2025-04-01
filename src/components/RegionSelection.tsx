import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

interface Region {
  id: string;
  name: string;
  isRecommended: boolean;
  description: string;
  bonuses: string[];
}

const regions: Region[] = [
  { 
    id: 'northwest',
    name: 'KUZEY - BATI',
    isRecommended: false,
    description: 'Ormanlık ve verimli topraklar',
    bonuses: [
      'Odun üretiminde %20 bonus',
      'Tahıl üretiminde %20 bonus',
      'Savunmada %10 bonus'
    ]
  },
  { 
    id: 'northeast',
    name: 'KUZEY - DOĞU',
    isRecommended: true,
    description: 'Dağlık ve korunaklı bölge',
    bonuses: [
      'Taş üretiminde %20 bonus',
      'Demir üretiminde %20 bonus',
      'Savunmada %20 bonus'
    ]
  },
  { 
    id: 'southwest',
    name: 'GÜNEY - BATI',
    isRecommended: false,
    description: 'Sahil ve orman bölgesi',
    bonuses: [
      'Odun üretiminde %20 bonus',
      'Demir üretiminde %20 bonus',
      'Ticaret avantajı'
    ]
  },
  { 
    id: 'southeast',
    name: 'GÜNEY - DOĞU',
    isRecommended: false,
    description: 'Verimli ovalar',
    bonuses: [
      'Taş üretiminde %20 bonus',
      'Tahıl üretiminde %20 bonus',
      'Ticaret avantajı'
    ]
  }
];

export const RegionSelection: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const { initializeRegion } = useGameStore();

  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
  };

  const handleConfirm = () => {
    if (selectedRegion) {
      console.log('Initializing region:', selectedRegion);
      initializeRegion(selectedRegion);
    }
  };

  return (
    <div className="min-h-screen bg-brown-100 flex flex-col items-center justify-center p-8">
      <div className="bg-parchment rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-medieval text-center mb-6">Başlangıç Bölgeni Seç</h1>
        <p className="text-lg text-center mb-8">
          İmparatorluğunu inşa etmeye nereden başlamak istersin? En uygun bölge için
          "tavsiye edilen" alanı kullan. Veya arkadaşlarının bulunduğu bölgeyi seç ve bir
          ekip oluştur!
        </p>

        <div className="relative w-full aspect-square mb-8">
          <div className="absolute inset-0 border-8 border-brown-800 rounded-lg overflow-hidden">
            <div 
              className="w-full h-full bg-cover bg-center grid grid-cols-2 grid-rows-2 gap-1"
              style={{ backgroundImage: 'url(/images/ui/map-background.png)' }}
            >
              {regions.map((region) => (
                <div
                  key={region.id}
                  className={`relative cursor-pointer transition-all duration-300 
                    ${selectedRegion === region.id ? 'ring-4 ring-gold' : ''}
                    hover:bg-brown-200/30`}
                  onClick={() => handleRegionSelect(region.id)}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-medieval text-xl text-brown-800">{region.name}</span>
                  </div>
                  {region.isRecommended && (
                    <div className="absolute top-2 right-2">
                      <span className="bg-orange-500 text-white px-2 py-1 rounded text-sm">
                        TAVSİYE EDİLEN
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedRegion && (
          <div className="bg-brown-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-medieval mb-2">
                  {regions.find(r => r.id === selectedRegion)?.name}
                </h2>
                <p className="text-lg mb-4">
                  {regions.find(r => r.id === selectedRegion)?.description}
                </p>
                <div className="space-y-2">
                  {regions
                    .find(r => r.id === selectedRegion)
                    ?.bonuses.map((bonus, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-brown-800">⚔</span>
                        <span>{bonus}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={!selectedRegion}
          className={`w-full py-3 text-lg font-semibold rounded-lg ${
            selectedRegion
              ? 'bg-green-700 text-white hover:bg-green-800'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Onayla ve Başla
        </button>
      </div>
    </div>
  );
}; 