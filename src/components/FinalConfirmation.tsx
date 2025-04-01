import React from 'react';
import { useGameStore } from '../store/gameStore';

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

const regions = [
  { 
    id: 'northwest',
    name: 'KUZEY - BATI',
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
    description: 'Verimli ovalar',
    bonuses: [
      'Taş üretiminde %20 bonus',
      'Tahıl üretiminde %20 bonus',
      'Ticaret avantajı'
    ]
  }
];

export const FinalConfirmation: React.FC = () => {
  const { selectedRace, selectedRegion, initializeGame } = useGameStore();
  const [avatarNameInput, setAvatarNameInput] = React.useState('');
  const setAvatarName = useGameStore(state => state.setAvatarName);

  const selectedRaceData = races.find(r => r.id === selectedRace);
  const selectedRegionData = regions.find(r => r.id === selectedRegion);

  const handleStartGame = () => {
    if (avatarNameInput.trim()) {
      setAvatarName(avatarNameInput.trim());
      initializeGame(selectedRace!);
    }
  };

  return (
    <div className="min-h-screen bg-brown-100 flex flex-col items-center justify-center p-8">
      <div className="bg-parchment rounded-lg p-8 max-w-4xl w-full">
        <h1 className="text-3xl font-medieval text-center mb-6">Seçimini onayla</h1>
        <p className="text-lg text-center mb-8">
          Tercihlerini onayla, avatar ismini seç ve maceraya başla
        </p>

        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* Irk Seçimi */}
          <div className="bg-brown-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-medieval">Seçilen Irk</h2>
              <button 
                onClick={() => window.history.back()}
                className="text-green-700 hover:text-green-800 font-semibold"
              >
                Değiştir
              </button>
            </div>
            <div className="flex items-start gap-4">
              <img 
                src={selectedRaceData?.imageUrl} 
                alt={selectedRaceData?.name}
                className="w-24 h-24 object-cover rounded-lg border-2 border-brown-800"
              />
              <div>
                <h3 className="text-xl font-medieval mb-2">{selectedRaceData?.name}</h3>
                <p className="text-sm mb-2">{selectedRaceData?.description}</p>
                <div className="space-y-1">
                  {selectedRaceData?.traits.map((trait, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="text-brown-800">⚔</span>
                      <span>{trait}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bölge Seçimi */}
          <div className="bg-brown-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-medieval">Seçilen Bölge</h2>
              <button 
                onClick={() => window.history.back()}
                className="text-green-700 hover:text-green-800 font-semibold"
              >
                Değiştir
              </button>
            </div>
            <div>
              <h3 className="text-xl font-medieval mb-2">{selectedRegionData?.name}</h3>
              <p className="text-sm mb-4">{selectedRegionData?.description}</p>
              <div className="space-y-1">
                {selectedRegionData?.bonuses.map((bonus, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span className="text-brown-800">⚔</span>
                    <span>{bonus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Avatar İsmi */}
        <div className="mb-8">
          <label className="block text-lg font-medieval mb-2">Avatar ismini gir:</label>
          <input
            type="text"
            value={avatarNameInput}
            onChange={(e) => setAvatarNameInput(e.target.value)}
            className="w-full p-3 border-2 border-brown-800 rounded-lg bg-parchment"
            placeholder="Avatar ismi..."
          />
          <div className="mt-2 text-sm text-blue-600">
            Bu, bu oyun dünyasındaki avatarının adıdır.
          </div>
        </div>

        <button
          onClick={handleStartGame}
          disabled={!avatarNameInput.trim()}
          className={`w-full py-3 text-lg font-semibold rounded-lg ${
            avatarNameInput.trim()
              ? 'bg-green-700 text-white hover:bg-green-800'
              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
          }`}
        >
          Hadi oynayalım
        </button>
      </div>
    </div>
  );
}; 