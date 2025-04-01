import React from 'react';

interface WallProps {
  level: number;
  gridCellSize: number;
}

export function Wall({ level, gridCellSize }: WallProps) {
  // 25x25 grid için duvar parçaları
  const wallSegments = {
    top: Array.from({ length: 25 }, (_, i) => ({ x: i, y: 0 })),
    bottom: Array.from({ length: 25 }, (_, i) => ({ x: i, y: 24 })),
    left: Array.from({ length: 23 }, (_, i) => ({ x: 0, y: i + 1 })),
    right: Array.from({ length: 23 }, (_, i) => ({ x: 24, y: i + 1 }))
  };

  const getWallStyle = (x: number, y: number) => ({
    position: 'absolute',
    left: x * gridCellSize,
    top: y * gridCellSize,
    width: gridCellSize,
    height: gridCellSize,
    backgroundColor: 'rgba(120, 53, 15, 0.3)',
    borderColor: 'rgba(180, 83, 9, 0.5)',
    borderStyle: 'solid',
    borderWidth: level * 2 + 'px',
    transition: 'all 0.3s ease',
  } as React.CSSProperties);

  return (
    <>
      {/* Üst duvar */}
      {wallSegments.top.map((pos, i) => (
        <div
          key={`top-${i}`}
          style={getWallStyle(pos.x, pos.y)}
          className="border-b-0"
        />
      ))}
      
      {/* Alt duvar */}
      {wallSegments.bottom.map((pos, i) => (
        <div
          key={`bottom-${i}`}
          style={getWallStyle(pos.x, pos.y)}
          className="border-t-0"
        />
      ))}
      
      {/* Sol duvar */}
      {wallSegments.left.map((pos, i) => (
        <div
          key={`left-${i}`}
          style={getWallStyle(pos.x, pos.y)}
          className="border-r-0"
        />
      ))}
      
      {/* Sağ duvar */}
      {wallSegments.right.map((pos, i) => (
        <div
          key={`right-${i}`}
          style={getWallStyle(pos.x, pos.y)}
          className="border-l-0"
        />
      ))}

      {/* Köşe kuleler */}
      {[
        { x: 0, y: 0 },
        { x: 24, y: 0 },
        { x: 0, y: 24 },
        { x: 24, y: 24 }
      ].map((pos, i) => (
        <div
          key={`tower-${i}`}
          style={{
            ...getWallStyle(pos.x, pos.y),
            backgroundColor: 'rgba(120, 53, 15, 0.5)',
            borderWidth: (level * 2 + 2) + 'px',
            borderRadius: '50%'
          }}
        />
      ))}
    </>
  );
} 