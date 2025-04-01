import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BuildingRendererProps {
  buildingType: string;
  level: number;
}

export function BuildingRenderer({ buildingType, level }: BuildingRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create building geometry based on type and level
    const geometry = new THREE.BoxGeometry(1 + level * 0.2, 2 + level * 0.3, 1 + level * 0.2);
    
    // Different materials for different building types
    let material;
    switch (buildingType) {
      case 'Farm':
        material = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown
        break;
      case 'Woodcutter':
        material = new THREE.MeshPhongMaterial({ color: 0x228B22 }); // Forest Green
        break;
      case 'Quarry':
        material = new THREE.MeshPhongMaterial({ color: 0x808080 }); // Gray
        break;
      case 'Iron Mine':
        material = new THREE.MeshPhongMaterial({ color: 0x4A4A4A }); // Dark Gray
        break;
      case 'Barracks':
        material = new THREE.MeshPhongMaterial({ color: 0x8B0000 }); // Dark Red
        break;
      default:
        material = new THREE.MeshPhongMaterial({ color: 0xDEB887 }); // Burlywood
    }

    const building = new THREE.Mesh(geometry, material);
    scene.add(building);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Animation
    let animationFrameId: number;
    const animate = () => {
      if (!building || !renderer || !scene || !camera) return;

      building.rotation.y += 0.01;
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer && containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, [buildingType, level]);

  return <div ref={containerRef} className="w-full h-32 rounded-lg overflow-hidden" />;
}