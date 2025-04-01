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
    scene.background = new THREE.Color(0x2A1810);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    camera.position.y = 2;
    cameraRef.current = camera;

    // Setup renderer with medieval aesthetics
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create building geometry based on type and level
    const buildingGeometries: THREE.BufferGeometry[] = [];
    
    // Base building
    const baseHeight = 1.5 + level * 0.2;
    const baseGeometry = new THREE.BoxGeometry(2, baseHeight, 2);
    buildingGeometries.push(baseGeometry);

    // Roof
    const roofGeometry = new THREE.ConeGeometry(1.5, 1 + level * 0.1, 4);
    roofGeometry.translate(0, baseHeight + 0.5, 0);
    buildingGeometries.push(roofGeometry);

    // Different materials for different building types
    let baseMaterial, roofMaterial;
    switch (buildingType) {
      case 'Farm':
        baseMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown wood
        roofMaterial = new THREE.MeshPhongMaterial({ color: 0xFFD700 }); // Golden straw
        break;
      case 'Woodcutter':
        baseMaterial = new THREE.MeshPhongMaterial({ color: 0x654321 }); // Dark wood
        roofMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown wood
        break;
      case 'Quarry':
        baseMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 }); // Gray stone
        roofMaterial = new THREE.MeshPhongMaterial({ color: 0x696969 }); // Darker gray
        break;
      case 'Iron Mine':
        baseMaterial = new THREE.MeshPhongMaterial({ color: 0x4A4A4A }); // Dark gray
        roofMaterial = new THREE.MeshPhongMaterial({ color: 0x363636 }); // Very dark gray
        break;
      case 'Barracks':
        baseMaterial = new THREE.MeshPhongMaterial({ color: 0x8B0000 }); // Dark red
        roofMaterial = new THREE.MeshPhongMaterial({ color: 0x800000 }); // Maroon
        break;
      case 'Wall':
        baseMaterial = new THREE.MeshPhongMaterial({ color: 0xA0522D }); // Stone wall
        roofMaterial = baseMaterial;
        break;
      default:
        baseMaterial = new THREE.MeshPhongMaterial({ color: 0xDEB887 }); // Burlywood
        roofMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Brown wood
    }

    // Create meshes
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    
    // Add details based on level
    if (level > 1) {
      // Windows
      const windowGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.1);
      const windowMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, emissive: 0x555555 });
      
      for (let i = 0; i < level && i < 4; i++) {
        const window = new THREE.Mesh(windowGeometry, windowMaterial);
        window.position.set(
          Math.cos(i * Math.PI / 2) * 0.8,
          0.5,
          Math.sin(i * Math.PI / 2) * 0.8
        );
        base.add(window);
      }
    }

    // Add meshes to scene
    scene.add(base);
    scene.add(roof);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffd700, 0.3);
    scene.add(ambientLight);

    // Add directional light with shadows
    const directionalLight = new THREE.DirectionalLight(0xffd700, 0.7);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Add point light for window glow effect
    const pointLight = new THREE.PointLight(0xffd700, 0.5, 10);
    pointLight.position.set(0, 2, 3);
    scene.add(pointLight);

    // Animation
    let animationFrameId: number;
    const animate = () => {
      if (!base || !roof || !renderer || !scene || !camera) return;

      base.rotation.y += 0.005;
      roof.rotation.y = base.rotation.y;
      
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

  return (
    <div 
      ref={containerRef} 
      className="w-full h-48 rounded-lg overflow-hidden bg-[#2A1810] shadow-inner"
    />
  );
}