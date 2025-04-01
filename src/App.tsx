import React from 'react';
import { Layout } from './components/Layout';
import { ResourceBar } from './components/ResourceBar';
import { VillageView } from './components/VillageView';

function App() {
  return (
    <Layout>
      <ResourceBar />
      <VillageView />
    </Layout>
  );
}

export default App;