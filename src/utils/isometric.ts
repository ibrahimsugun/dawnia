// İzometrik dönüşüm için yardımcı fonksiyonlar
export const TILE_WIDTH = 64;   // İzometrik karo genişliği
export const TILE_HEIGHT = 32;  // İzometrik karo yüksekliği

// Grid koordinatlarını izometrik ekran koordinatlarına dönüştür
export function gridToIso(x: number, y: number): { isoX: number; isoY: number } {
  return {
    isoX: (x - y) * (TILE_WIDTH / 2),
    isoY: (x + y) * (TILE_HEIGHT / 2)
  };
}

// Ekran koordinatlarını grid koordinatlarına dönüştür
export function screenToGrid(screenX: number, screenY: number): { x: number; y: number } {
  return {
    x: (screenX / TILE_WIDTH + screenY / TILE_HEIGHT) / 2,
    y: (screenY / TILE_HEIGHT - screenX / TILE_WIDTH) / 2
  };
}

// Z-indeks hesapla (derinlik sıralaması için)
export function calculateZIndex(x: number, y: number): number {
  return x + y;
}

// Dairesel yerleşim için bina pozisyonlarını hesapla
export function calculateCircularLayout(buildings: any[], centerX: number, centerY: number) {
  const radius = 3; // Merkeze olan uzaklık
  const mainBuilding = buildings.find(b => b.type === 'MainBuilding');
  const otherBuildings = buildings.filter(b => b.type !== 'MainBuilding');
  
  // Ana binayı merkeze yerleştir
  if (mainBuilding) {
    mainBuilding.position = { x: centerX, y: centerY };
  }

  // Diğer binaları dairesel olarak yerleştir
  otherBuildings.forEach((building, index) => {
    const angle = (index * (2 * Math.PI / otherBuildings.length));
    building.position = {
      x: centerX + Math.round(radius * Math.cos(angle)),
      y: centerY + Math.round(radius * Math.sin(angle))
    };
  });

  // Z-indeksi hesapla ve binaları sırala
  return buildings.map(building => ({
    ...building,
    zIndex: calculateZIndex(building.position.x, building.position.y)
  })).sort((a, b) => a.zIndex - b.zIndex);
} 