import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Float } from '@react-three/drei';
import * as THREE from 'three';

// Preload tất cả textures một lần
function PreloadedProducts() {
  // Load tất cả textures cùng lúc
  const textures = useTexture([
    '/kem-duong-da-1.jpg',
    '/dau-goi-2.jpg',
    '/sua-tam-1.jpg',
    '/kem-duong-am-2.jpg',
    '/sua-rua-mat-1.jpg'
  ]);

  return (
    <>
      <Product3D position={[-3, 0, 0]} texture={textures[0]} scale={1} />
      <Product3D position={[0, 0, 0]} texture={textures[1]} scale={1.1} />
      <Product3D position={[3, 0, 0]} texture={textures[2]} scale={1} />
      <Product3D position={[-1.5, -2, 1]} texture={textures[3]} scale={0.9} />
      <Product3D position={[1.5, -2, 1]} texture={textures[4]} scale={0.9} />
    </>
  );
}

// Component sản phẩm 3D với texture đã load
function Product3D({ position, texture, scale = 1 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      // Tự động xoay chậm
      meshRef.current.rotation.y += 0.005;
      
      // Scale khi hover
      const targetScale = hovered ? scale * 1.2 : scale;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        {/* Hình hộp với texture */}
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.3}
          roughness={0.4}
          emissive={hovered ? '#ff69b4' : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
        />
      </mesh>
      
      {/* Glow effect khi hover */}
      {hovered && (
        <pointLight
          position={position}
          intensity={1}
          distance={3}
          color="#ff69b4"
        />
      )}
    </Float>
  );
}

// Scene chính với nhiều sản phẩm
function ProductScene() {
  return (
    <>
      {/* Ánh sáng */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[-10, -10, -5]} color="#ff69b4" intensity={0.5} />
      <pointLight position={[10, -10, -5]} color="#9333ea" intensity={0.5} />

      {/* Các sản phẩm 3D với hình ảnh thật - Preloaded */}
      <Suspense fallback={null}>
        <PreloadedProducts />
      </Suspense>

      {/* Controls - cho phép xoay 360 độ */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate={true}
        autoRotateSpeed={0.5}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />
    </>
  );
}

// Component chính export
export default function ProductCarousel3D() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        shadows
        gl={{ 
          antialias: true, 
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
          failIfMajorPerformanceCaveat: false
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#1a0a2e', 0);
        }}
      >
        <ProductScene />
      </Canvas>
    </div>
  );
}
