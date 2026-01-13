import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

const ParticleWave = () => {
  // On utilise useRef pour accéder au mesh sans re-render
  const pointsRef = useRef<THREE.Points>(null!);
  
  // Nombre de particules
  const count = 2000;

  // Création des positions et couleurs une seule fois (useMemo)
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color('#ec4899'); // Pink-500 (Tailwind)
    const color2 = new THREE.Color('#3b82f6'); // Blue-500 (Tailwind)

    for (let i = 0; i < count; i++) {
      // Position aléatoire dans une sphère
      const r = (Math.random() * 5) + 1; // Rayon
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Mix des couleurs
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    // Rotation lente de l'ensemble
    pointsRef.current.rotation.y = time * 0.05;
    
    // Effet de respiration (scale)
    const scale = 1 + Math.sin(time * 0.5) * 0.05;
    pointsRef.current.scale.set(scale, scale, scale);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            args={[positions, 3]} 
        />
        <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            args={[colors, 3]} 
        />
        </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors // Indispensable pour utiliser le tableau de couleurs
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default function DanceScene() {
  return (
    <div className="absolute inset-0 -z-10 bg-slate-900">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 2]}>
        <ParticleWave />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        {/* OrbitControls permet de tester à la souris, on pourra le retirer ou le limiter plus tard */}
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.3} />
      </Canvas>
    </div>
  );
}