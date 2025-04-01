import React from 'react';
import { RaceSelection } from './components/RaceSelection';
import { RegionSelection } from './components/RegionSelection';
import { FinalConfirmation } from './components/FinalConfirmation';
import { VillageView } from './components/VillageView';
import { useGameStore } from './store/gameStore';

function App() {
  const { selectedRace, selectedRegion, avatarName } = useGameStore();

  if (!selectedRace) {
    return <RaceSelection />;
  }

  if (!selectedRegion) {
    return <RegionSelection />;
  }

  if (!avatarName) {
    return <FinalConfirmation />;
  }

  return <VillageView />;
}

export default App;