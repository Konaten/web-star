import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';

const FadeImage = ({ url, active }: { url: string; active: boolean }) => {
  const imageRef = useRef<any>(null!);
  const { viewport } = useThree();

  const width = viewport.width * 0.95;
  const height = viewport.height * 0.95;

  useFrame(() => {
    if (!imageRef.current || !imageRef.current.material) return;

    imageRef.current.material.opacity = THREE.MathUtils.lerp(
      imageRef.current.material.opacity,
      active ? 1 : 0,
      0.05
    );

    const targetZ = active ? 0.1 : -0.1;
    imageRef.current.position.z = THREE.MathUtils.lerp(
      imageRef.current.position.z,
      targetZ,
      0.05
    );
  });

  return (
    <Image
      ref={imageRef}
      url={url}
      transparent
      radius={0.08}
      scale={[width, height]}
    />
  );
};

export default function CourseImage3D({ imageUrls }: { imageUrls: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!imageUrls || imageUrls.length === 0) return null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [imageUrls.length]);

  return (
    <div 
      className="w-full h-full cursor-pointer" 
      onClick={() => setCurrentIndex((prev) => (prev + 1) % imageUrls.length)}
    >
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <ambientLight intensity={1} />
        {imageUrls.map((url, index) => (
          <FadeImage 
            key={url} 
            url={url} 
            active={index === currentIndex} 
          />
        ))}
      </Canvas>
    </div>
  );
}