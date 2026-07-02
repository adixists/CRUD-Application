/**
 * =============================================================================
 * SCENE3D — Three.js Server Room Background
 * =============================================================================
 * Renders the full immersive 3D environment:
 * - Photorealistic server room background image
 * - Floating holographic code panels with scrolling text
 * - Randomly flickering rack LED lights
 * - Atmospheric fog and depth
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ── Floating Holographic Code Panel ──────────────────────────────────────── */
function HoloPanel({ position, rotation, width = 1.2, height = 1.8, speed = 0.3, color = '#00f0ff' }) {
  const meshRef = useRef();
  const canvasTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256; canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.clearRect(0, 0, 256, 512);

    // Draw code lines
    const lines = [
      'const archive = new Terminal()',
      'await db.connect(0x1F4)', 
      'res.status(200).json(data)',
      'import { Matrix } from core',
      'for(let i=0; i<nodes; i++)',
      '> scanning_archives...',
      'ENCRYPTED_HASH: 0xA4F2',
      'module.exports = { query }',
      '// v2.0 digital_library',
      'socket.emit("sync", payload)',
      'SELECT * FROM resources',
      'ping 192.168.1.1 --flood',
      'git push origin main',
      'npm run build --prod',
      'docker compose up -d',
      'kubectl apply -f deploy.yml',
      '> access_granted 0xF3A1',
      'const key = crypto.random()',
      'interface IResource { id }',
      'type Archive = Map<string>',
    ];

    ctx.font = '11px monospace';
    const c = color === '#00f0ff' ? '#00f0ff' : color === '#a855f7' ? '#a855f7' : '#ff00cc';
    lines.forEach((line, i) => {
      const alpha = 0.15 + Math.random() * 0.35;
      ctx.fillStyle = c.replace(')', `,${alpha})`).replace('rgb', 'rgba').replace('#', 'rgba(').replace('00f0ff,', '0,240,255,').replace('a855f7,','168,85,247,').replace('ff00cc,','255,0,204,');
      // Simpler: just use global alpha
      ctx.globalAlpha = 0.15 + Math.random() * 0.35;
      ctx.fillStyle = c;
      ctx.fillText(line, 8, 16 + i * 24);
    });

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }, [color]);

  // Animate scrolling
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.map.offset.y += speed * 0.0004;
      meshRef.current.material.opacity = 0.12 + Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial
        map={canvasTexture}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ── Rack LED Light ───────────────────────────────────────────────────────── */
function RackLED({ position, color, flickerSpeed = 1 }) {
  const meshRef = useRef();
  const baseIntensity = useRef(Math.random());

  useFrame((state) => {
    if (meshRef.current) {
      // Random flicker
      const t = state.clock.elapsedTime * flickerSpeed;
      const flicker = Math.sin(t * 7.3) * Math.sin(t * 3.1) * Math.sin(t * 11.7);
      const intensity = 0.5 + flicker * 0.5;
      meshRef.current.material.opacity = Math.max(0.1, intensity);
      // Occasional full-off flicker
      if (Math.random() < 0.002) meshRef.current.material.opacity = 0;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.012, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  );
}

/* ── Rack LED Bank ────────────────────────────────────────────────────────── */
function LEDBank({ x, side }) {
  const leds = useMemo(() => {
    const arr = [];
    for (let row = 0; row < 12; row++) {
      for (let col = 0; col < 3; col++) {
        const colors = ['#00f0ff', '#00ff88', '#ff00cc', '#0088ff'];
        arr.push({
          key: `${row}-${col}`,
          position: [x + (side === 'left' ? col * 0.08 : -col * 0.08), 2.5 - row * 0.35, -3 + col * 0.05],
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: 0.5 + Math.random() * 2,
        });
      }
    }
    return arr;
  }, [x, side]);

  return (
    <>
      {leds.map(led => (
        <RackLED key={led.key} position={led.position} color={led.color} flickerSpeed={led.speed} />
      ))}
    </>
  );
}

/* ── Server Rack Geometry ─────────────────────────────────────────────────── */
function ServerRack({ position }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.8, 5, 0.6]} />
        <meshStandardMaterial
          color="#0a0a14"
          roughness={0.85}
          metalness={0.4}
          emissive="#050508"
        />
      </mesh>
      {/* Rack unit dividers */}
      {[-2, -1.6, -1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2, 1.6, 2].map((y, i) => (
        <mesh key={i} position={[0, y, 0.31]}>
          <boxGeometry args={[0.78, 0.02, 0.02]} />
          <meshBasicMaterial color="#1a1a2e" />
        </mesh>
      ))}
    </group>
  );
}

/* ── Particle Field ───────────────────────────────────────────────────────── */
function ParticleField() {
  const pointsRef = useRef();
  const count = 300;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = -4 - Math.random() * 4;
      const c = Math.random();
      if (c < 0.5)      { col[i*3]=0; col[i*3+1]=0.94; col[i*3+2]=1; }
      else if (c < 0.8) { col[i*3]=0; col[i*3+1]=1; col[i*3+2]=0.53; }
      else               { col[i*3]=1; col[i*3+1]=0; col[i*3+2]=0.8; }
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
      // Drift particles upward slowly
      const pos = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += 0.002;
        if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -4;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.015} vertexColors transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ── Scene Content ────────────────────────────────────────────────────────── */
function SceneContent() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0.5, 5);
    camera.fov = 65;
    camera.updateProjectionMatrix();
  }, [camera]);

  // Subtle camera drift
  useFrame((state) => {
    camera.position.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.08;
    camera.position.y = 0.5 + Math.sin(state.clock.elapsedTime * 0.08) * 0.04;
  });

  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.15} color="#0a1428" />
      <pointLight position={[0, 3, 1]} intensity={0.3} color="#0066aa" />
      <pointLight position={[-5, 0, -2]} intensity={0.2} color="#ff00cc" />
      <pointLight position={[5, 0, -2]}  intensity={0.2} color="#00f0ff" />

      {/* Server racks — left wall */}
      <ServerRack position={[-3.8, 0, -3]} />
      <ServerRack position={[-2.8, 0, -3.5]} />
      <ServerRack position={[-4.6, 0, -3.2]} />

      {/* Server racks — right wall */}
      <ServerRack position={[3.8, 0, -3]} />
      <ServerRack position={[2.8, 0, -3.5]} />
      <ServerRack position={[4.6, 0, -3.2]} />

      {/* LED banks */}
      <LEDBank x={-3.5} side="left" />
      <LEDBank x={3.5}  side="right" />

      {/* Floating holographic panels */}
      <Float speed={0.6} rotationIntensity={0.08} floatIntensity={0.3}>
        <HoloPanel position={[-3.5, 0.5, -2.5]} rotation={[0, 0.4, 0]} color="#00f0ff" />
      </Float>
      <Float speed={0.4} rotationIntensity={0.06} floatIntensity={0.2}>
        <HoloPanel position={[3.5, 0.2, -2.5]} rotation={[0, -0.4, 0]} color="#a855f7" speed={0.4} />
      </Float>
      <Float speed={0.7} rotationIntensity={0.1} floatIntensity={0.25}>
        <HoloPanel position={[-2.2, -0.5, -4]} rotation={[0, 0.6, 0]} color="#ff00cc" speed={0.2} width={0.9} height={1.4} />
      </Float>

      {/* Particle field */}
      <ParticleField />

      {/* Stars in the distance */}
      <Stars radius={20} depth={10} count={500} factor={1} saturation={0.5} fade speed={0.3} />

      {/* Fog */}
      <fog attach="fog" args={['#040408', 5, 18]} />
    </>
  );
}

/* ── Main Export ──────────────────────────────────────────────────────────── */
const Scene3D = () => {
  return (
    <div className="webgl-canvas">
      <Canvas
        gl={{ antialias: true, alpha: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.9 }}
        style={{ background: '#040408' }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default Scene3D;
