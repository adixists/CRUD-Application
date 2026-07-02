/**
 * =============================================================================
 * HOLORBS — Three.js Holographic Particle Orbs
 * =============================================================================
 * Renders three rotating, particle-emitting holographic spheres:
 * - Cyan (TOTAL), Green (ACTIVE), Magenta (ARCHIVED)
 * - Each orb has orbiting particle specks
 * - Slow vertical bobbing sine wave
 * - Hover: spin faster + scale up 5%
 */

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ── Single Holographic Orb ───────────────────────────────────────────────── */
function HoloOrb({ color, glowColor, isHovered }) {
  const groupRef    = useRef();
  const sphereRef   = useRef();
  const particlesRef= useRef();
  const timeRef     = useRef(Math.random() * Math.PI * 2);

  // Particle positions orbiting the sphere
  const { positions, phases } = useMemo(() => {
    const count = 120;
    const pos   = new Float32Array(count * 3);
    const ph    = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Random points on sphere surface + slightly beyond
      const phi   = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r     = 0.58 + Math.random() * 0.25;
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
      ph[i]      = Math.random() * Math.PI * 2;
    }
    return { positions: pos, phases: ph };
  }, []);

  const spinSpeed = isHovered ? 0.9 : 0.22;
  const scaleTarget = isHovered ? 1.05 : 1.0;

  useFrame((state, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (groupRef.current) {
      // Vertical bob
      groupRef.current.position.y = Math.sin(t * 0.7 + timeRef.current * 0) * 0.08;
      // Smooth scale
      const cs = groupRef.current.scale.x;
      const ns = cs + (scaleTarget - cs) * 0.08;
      groupRef.current.scale.set(ns, ns, ns);
    }

    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * spinSpeed;
      sphereRef.current.rotation.x += delta * spinSpeed * 0.4;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y -= delta * spinSpeed * 0.6;
      particlesRef.current.rotation.z += delta * spinSpeed * 0.3;

      // Twinkle particles
      const posAttr = particlesRef.current.geometry.attributes.position;
      for (let i = 0; i < positions.length / 3; i++) {
        const phase = phases[i];
        const base = 0.58 + Math.sin(t * 2 + phase) * 0.04;
        const phi   = Math.acos(positions[i*3+2] / 0.6);
        const theta = Math.atan2(positions[i*3+1], positions[i*3]);
        posAttr.array[i*3]   = base * Math.sin(phi) * Math.cos(theta + t * 0.1);
        posAttr.array[i*3+1] = base * Math.sin(phi) * Math.sin(theta + t * 0.1);
        posAttr.array[i*3+2] = base * Math.cos(phi);
      }
      posAttr.needsUpdate = true;
    }
  });

  const c = new THREE.Color(color);
  const g = new THREE.Color(glowColor);

  return (
    <group ref={groupRef}>
      {/* Core glowing sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={glowColor}
          emissiveIntensity={isHovered ? 1.2 : 0.7}
          roughness={0.1}
          metalness={0.4}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Outer wireframe ring */}
      <mesh>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.06} />
      </mesh>

      {/* Orbital ring 1 */}
      <mesh rotation={[Math.PI/2, 0, 0]}>
        <torusGeometry args={[0.54, 0.006, 8, 60]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>

      {/* Orbital ring 2 — tilted */}
      <mesh rotation={[Math.PI/4, Math.PI/6, 0]}>
        <torusGeometry args={[0.56, 0.004, 8, 60]} />
        <meshBasicMaterial color={glowColor} transparent opacity={0.2} />
      </mesh>

      {/* Particle specks */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.018}
          transparent
          opacity={isHovered ? 0.85 : 0.55}
          sizeAttenuation
        />
      </points>

      {/* Point light for glow effect */}
      <pointLight color={glowColor} intensity={isHovered ? 1.5 : 0.8} distance={2.5} decay={2} />
    </group>
  );
}

/* ── Single Orb Canvas ────────────────────────────────────────────────────── */
function OrbCanvas({ color, glowColor, value, label, labelColor }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="orb-section">
      <div
        className="orb-canvas-wrapper"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ cursor: 'default' }}
      >
        <Canvas
          style={{ width: '110px', height: '110px', background: 'transparent' }}
          gl={{ alpha: true, antialias: true }}
          camera={{ position: [0, 0, 2], fov: 45 }}
          dpr={Math.min(window.devicePixelRatio, 1.5)}
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[2, 2, 2]} intensity={0.8} color={glowColor} />
          <pointLight position={[-2, -1, 1]} intensity={0.4} color={color} />
          <HoloOrb color={color} glowColor={glowColor} isHovered={hovered} />
        </Canvas>

        {/* Numeric value overlay */}
        <div className="orb-value-overlay" style={{ color, textShadow: `0 0 20px ${color}cc, 0 0 40px ${color}66` }}>
          {value}
        </div>
      </div>

      <span className="orb-label" style={{ color: labelColor }}>
        {label}
      </span>
    </div>
  );
}

/* ── Orb HUD — Three Orbs in a Glass Container ────────────────────────────── */
const HolOrbs = ({ total, active, archived }) => {
  return (
    <div className="orb-hud">
      <OrbCanvas color="#00aacc" glowColor="#00f0ff" value={total}    label="TOTAL"    labelColor="#00f0ff" />
      <OrbCanvas color="#00aa66" glowColor="#00ff88" value={active}   label="ACTIVE"   labelColor="#00ff88" />
      <OrbCanvas color="#cc0099" glowColor="#ff00cc" value={archived} label="ARCHIVED" labelColor="#ff00cc" />
    </div>
  );
};

export default HolOrbs;
