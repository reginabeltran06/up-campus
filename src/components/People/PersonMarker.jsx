import { useRef, useMemo } from 'react';
import { Billboard, Text } from '@react-three/drei';
import * as THREE from 'three';

// Cache de texturas
const textureCache = new Map();

export function PersonMarker({ person, position, isDragging }) {
  const groupRef = useRef();

  // Crear textura desde imagen
  const texture = useMemo(() => {
    if (!person.foto) return null;

    if (textureCache.has(person.foto)) {
      return textureCache.get(person.foto);
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 128;
    canvas.height = 128;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.arc(64, 64, 64, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, 0, 0, 128, 128);
    };
    img.onerror = () => {
      ctx.fillStyle = '#ddd';
      ctx.fillRect(0, 0, 128, 128);
      ctx.fillStyle = '#999';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Sin foto', 64, 64);
    };
    img.src = person.foto;

    const texture = new THREE.CanvasTexture(canvas);
    textureCache.set(person.foto, texture);
    return texture;
  }, [person.foto]);

  return (
    <Billboard
      ref={groupRef}
      position={position}
      scale={isDragging ? 1.2 : 1}
      follow={true}
      lockX={false}
      lockY={false}
      lockZ={false}
    >
      {/* Círculo de foto */}
      <mesh castShadow>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial
          map={texture}
          color="#ffffff"
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Borde */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.42, 32]} />
        <meshBasicMaterial
          color={isDragging ? '#ff6b6b' : '#333'}
          wireframe={false}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Nombre debajo */}
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.25}
        color="#000"
        anchorX="center"
        anchorY="top"
        maxWidth={1.2}
        textAlign="center"
      >
        {person.nombre.split(' ')[0]}
      </Text>
    </Billboard>
  );
}
