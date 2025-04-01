import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { GameState } from '../store/gameStore';

interface Race {
  id: string;
  name: string;
  description: string;
  traits: string[];
  imageUrl: string;
  recommendedFor: string;
}

const races: Race[] = [
  {
    id: 'highlanders',
    name: 'YÜCE DAĞLILAR',
    description: 'Kadim dağların soylu bekçileri',
    traits: [
      'Savunma odaklı yapılar',
      'Verimli maden işletmeciliği',
      'Dayanıklı piyade birlikleri',
      'Yeni oyuncular için ideal'
    ],
    imageUrl: '/images/races/highlanders.png',
    recommendedFor: 'YENİ OYUNCULAR İÇİN TAVSİYE EDİLİR!'
  },
  {
    id: 'forestkin',
    name: 'ORMAN HALKI',
    description: 'Kadim ormanların gizemli koruyucuları',
    traits: [
      'Hızlı kaynak üretimi',
      'Güçlü okçu birlikleri',
      'Gizli saldırı taktikleri',
      'Deneyimli oyuncular için'
    ],
    imageUrl: '/images/races/forestkin.png',
    recommendedFor: 'STRATEJİK OYUNCULAR İÇİN'
  },
  {
    id: 'nomads',
    name: 'GÖÇEBELERİN ÇOCUKLARI',
    description: 'Uçsuz bucaksız bozkırların özgür ruhları',
    traits: [
      'Süvari üstünlüğü',
      'Hızlı hareket kabiliyeti',
      'Yağma ve baskın avantajı',
      'Saldırgan oyuncular için'
    ],
    imageUrl: '/images/races/nomads.png',
    recommendedFor: 'SALDIRGAN OYUNCULAR İÇİN'
  }
];

export const RaceSelection: React.FC = () => {
  const [selectedRace, setSelectedRace] = useState<string | null>(null);
  const initializeGame = useGameStore((state: GameState) => state.initializeGame);

  const handleRaceSelect = (raceId: string) => {
    setSelectedRace(raceId);
  };

  const handleConfirm = () => {
    if (selectedRace) {
      initializeGame(selectedRace);
    }
  };

  return (
    <div className="min-h-screen bg-brown-100 flex flex-col items-center justify-center p-8">
      <div className="bg-parchment rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-medieval text-center mb-6">Halkını Seç</h1>
        <p className="text-lg text-center mb-8">
          Büyük imparatorluklar önemli kararlarla başlar! Mücadele seven bir saldırgan mısın? 
          Yoksa zaman tasarrufun nispeten düşük mü? Fitili ateşlemek için gelişen bir ekonomi 
          inşa etmeyi seven bir ekip oyuncusu musun?
        </p>

        <div className="flex justify-center gap-4 mb-8">
          {races.map((race) => (
            <div
              key={race.id}
              className={`relative cursor-pointer transition-all duration-300 ${
                selectedRace === race.id ? 'scale-105 ring-4 ring-gold' : ''
              }`}
              onClick={() => handleRaceSelect(race.id)}
            >
              <div className="w-48 h-64 border-4 border-brown-800 rounded-lg overflow-hidden">
                <img
                  src={race.imageUrl}
                  alt={race.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {selectedRace && (
          <div className="bg-brown-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-medieval mb-2">
                  {races.find(r => r.id === selectedRace)?.name}
                </h2>
                <div className="space-y-2">
                  {races
                    .find(r => r.id === selectedRace)
                    ?.traits.map((trait, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-brown-800">⚔</span>
                        <span>{trait}</span>
                      </div>
                    ))}
                </div>
                {races.find(r => r.id === selectedRace)?.recommendedFor && (
                  <div className="mt-4 text-green-700 font-semibold">
                    {races.find(r => r.id === selectedRace)?.recommendedFor}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!selectedRace}
          className={`w-full py-3 text-lg font-semibold rounded-lg ${
            selectedRace
              ? 'bg-green-700 text-white hover:bg-green-800'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Onayla
        </button>
      </div>
    </div>
  );
}; 