/**
 * =============================================================================
 * SPACE HUD — Archive Terminal v4.0
 * =============================================================================
 * A horizontal 3D rocket flies in from the left and settles at center.
 * - Rocket is horizontal (nose pointing RIGHT)
 * - Three glowing portholes on the fuselage display TOTAL / ACTIVE / ARCHIVED
 * - Live additive-blended fire exhaust from the nozzle (left side)
 * - Animated starfield background
 * - Gentle float + bob when settled
 */

import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  STARFIELD                                                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */
function StarField() {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(4000 * 3);
    for (let i = 0; i < 4000; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 120;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 60;
      arr[i * 3 + 2] = -5 - Math.random() * 30;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#aad4ff" size={0.07} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  NEBULA GLOW PLANES                                                          */
/* ═══════════════════════════════════════════════════════════════════════════ */
function NebulaGlow() {
  return (
    <>
      {/* Left purple nebula */}
      <mesh position={[-8, 0, -8]}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial color="#3300aa" transparent opacity={0.06} depthWrite={false} />
      </mesh>
      {/* Right cyan nebula */}
      <mesh position={[8, 1, -10]}>
        <planeGeometry args={[12, 6]} />
        <meshBasicMaterial color="#003355" transparent opacity={0.08} depthWrite={false} />
      </mesh>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  EXHAUST FIRE PARTICLES                                                      */
/*  Local coords: rocket nose is at +X, nozzle is at -X.                       */
/*  So particles shoot toward -X (world left).                                  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function ExhaustParticles() {
  const ref = useRef();
  const COUNT = 200;

  const { positions, velocities, lifetimes, lifetimeMax, cols, sizes } = useMemo(() => {
    const pos  = new Float32Array(COUNT * 3);
    const vel  = new Float32Array(COUNT * 3);
    const lt   = new Float32Array(COUNT);
    const lmax = new Float32Array(COUNT);
    const c    = new Float32Array(COUNT * 3);
    const sz   = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      lt[i]   = Math.random();
      lmax[i] = 0.4 + Math.random() * 0.35;
      sz[i]   = 0.04 + Math.random() * 0.12;
    }
    return { positions: pos, velocities: vel, lifetimes: lt, lifetimeMax: lmax, cols: c, sizes: sz };
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    const colAttr = ref.current.geometry.attributes.color;
    const szAttr  = ref.current.geometry.attributes.size;

    for (let i = 0; i < COUNT; i++) {
      lifetimes[i] -= delta * 2.5;
      if (lifetimes[i] <= 0) {
        // Reset at nozzle — local coords: nozzle at X=-2.6, center Y=0, spread on Z
        lifetimes[i] = lifetimeMax[i];
        posAttr.array[i*3]   = -2.6;
        posAttr.array[i*3+1] = (Math.random() - 0.5) * 0.18;
        posAttr.array[i*3+2] = (Math.random() - 0.5) * 0.18;
        velocities[i*3]   = -(1.5 + Math.random() * 3.5); // shoots -X
        velocities[i*3+1] = (Math.random() - 0.5) * 0.6;
        velocities[i*3+2] = (Math.random() - 0.5) * 0.6;
      }
      posAttr.array[i*3]   += velocities[i*3]   * delta;
      posAttr.array[i*3+1] += velocities[i*3+1] * delta;
      posAttr.array[i*3+2] += velocities[i*3+2] * delta;

      // Heat gradient: white → yellow → orange → deep red
      const age = 1 - lifetimes[i] / lifetimeMax[i];
      if (age < 0.15) {
        colAttr.array[i*3]   = 1.0; colAttr.array[i*3+1] = 1.0; colAttr.array[i*3+2] = 0.85;
      } else if (age < 0.4) {
        colAttr.array[i*3]   = 1.0; colAttr.array[i*3+1] = 0.6 - age; colAttr.array[i*3+2] = 0.1;
      } else if (age < 0.7) {
        colAttr.array[i*3]   = 1.0; colAttr.array[i*3+1] = 0.15; colAttr.array[i*3+2] = 0.0;
      } else {
        colAttr.array[i*3]   = 0.5 * (1 - age); colAttr.array[i*3+1] = 0.0; colAttr.array[i*3+2] = 0.0;
      }
      szAttr.array[i] = sizes[i] * (1 - age * 0.6) * (0.5 + 0.5 * (lifetimes[i] / lifetimeMax[i]));
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    szAttr.needsUpdate  = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[cols, 3]} />
        <bufferAttribute attach="attributes-size"     args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={1}
        sizeAttenuation
        size={0.1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  PORTHOLE ON ROCKET                                                          */
/*  Placed on top face (+Z in local pre-rotation coords) of the fuselage.      */
/*  After -Z rotation of parent group: local +Z stays +Z (toward camera).      */
/* ═══════════════════════════════════════════════════════════════════════════ */
function RocketPorthole({ xPos, color, glowColor, value, label }) {
  const ringRef = useRef();
  const timeRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.4;
    }
  });

  const col = new THREE.Color(color);

  return (
    <group position={[xPos, 0, 0.42]}>
      {/* Glass disc */}
      <mesh>
        <circleGeometry args={[0.32, 48]} />
        <meshStandardMaterial
          color="#050510"
          emissive={col}
          emissiveIntensity={0.08}
          metalness={0.3}
          roughness={0.5}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Outer metal rim */}
      <mesh>
        <ringGeometry args={[0.30, 0.36, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={col}
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Inner thin glow ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.26, 0.29, 36]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      {/* Porthole glass reflection sheen */}
      <mesh position={[-0.06, 0.07, 0.001]}>
        <circleGeometry args={[0.10, 24]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.06} depthWrite={false} />
      </mesh>

      {/* Porthole light */}
      <pointLight color={color} intensity={0.8} distance={1.4} decay={2} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  ROCKET BODY — horizontal, nose pointing RIGHT (+X local after rotation)    */
/*  The whole group is rotated [0, 0, -PI/2] so local +Y → world +X (right)  */
/* ═══════════════════════════════════════════════════════════════════════════ */
function RocketBody({ stats }) {
  const groupRef = useRef();
  const flameA   = useRef();
  const flameB   = useRef();
  const timeRef  = useRef(0);
  const xPos     = useRef(-28);
  const settled  = useRef(false);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (!settled.current) {
      xPos.current += (0 - xPos.current) * Math.min(delta * 1.4, 0.08);
      if (Math.abs(xPos.current) < 0.02) { xPos.current = 0; settled.current = true; }
    }

    if (groupRef.current) {
      groupRef.current.position.x = xPos.current;
      groupRef.current.position.y = Math.sin(t * 0.9) * 0.12;
      groupRef.current.rotation.z = Math.sin(t * 0.55) * 0.025;
    }

    // Pulsating flame
    if (flameA.current) {
      const p = 1 + Math.sin(t * 22) * 0.18;
      flameA.current.scale.set(p, 0.8 + Math.sin(t * 16) * 0.2, p);
    }
    if (flameB.current) {
      const p = 1 + Math.sin(t * 18 + 1.2) * 0.22;
      flameB.current.scale.set(p, 0.7 + Math.sin(t * 14 + 0.5) * 0.25, p);
    }
  });

  return (
    /*
     * Parent group rotated [0,0,-PI/2]:
     *   local +Y → world +X (nose points right on screen)
     *   local -Y → world -X (nozzle/exhaust goes left)
     *   local +Z → world +Z (toward camera — portholes visible)
     */
    <group ref={groupRef} position={[-28, 0, 0]}>
      <group rotation={[0, 0, -Math.PI / 2]}>

        {/* ── Main fuselage ── */}
        <mesh>
          <cylinderGeometry args={[0.38, 0.42, 5.0, 48]} />
          <meshStandardMaterial color="#0e0e22" metalness={0.85} roughness={0.18} />
        </mesh>

        {/* Fuselage panels / accent stripes */}
        {[-1.6, 0, 1.6].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <cylinderGeometry args={[0.385, 0.385, 0.06, 48]} />
            <meshStandardMaterial
              color={i === 1 ? '#00f0ff' : '#1a1a40'}
              emissive={i === 1 ? '#00f0ff' : '#000000'}
              emissiveIntensity={i === 1 ? 0.5 : 0}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        ))}

        {/* ── Nose cone ── */}
        <mesh position={[0, 3.1, 0]}>
          <coneGeometry args={[0.38, 1.6, 48]} />
          <meshStandardMaterial color="#080818" metalness={0.92} roughness={0.08} />
        </mesh>

        {/* Nose tip glow */}
        <mesh position={[0, 3.9, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#00f0ff" emissive="#00f0ff" emissiveIntensity={3} />
        </mesh>

        {/* ── Engine section ── */}
        <mesh position={[0, -2.65, 0]}>
          <cylinderGeometry args={[0.3, 0.42, 0.4, 32]} />
          <meshStandardMaterial color="#060610" metalness={1} roughness={0.05} />
        </mesh>

        {/* Nozzle bell */}
        <mesh position={[0, -3.0, 0]}>
          <cylinderGeometry args={[0.28, 0.46, 0.5, 32]} />
          <meshStandardMaterial color="#04040e" metalness={1} roughness={0.04} />
        </mesh>

        {/* Nozzle inner glow ring */}
        <mesh position={[0, -3.22, 0]}>
          <ringGeometry args={[0.12, 0.28, 32]} />
          <meshBasicMaterial color="#ff5500" blending={THREE.AdditiveBlending} transparent opacity={0.9} depthWrite={false} />
        </mesh>

        {/* ── Four swept fins ── */}
        {[0, 90, 180, 270].map((deg, i) => {
          const angle = (deg * Math.PI) / 180;
          return (
            <mesh
              key={i}
              position={[Math.sin(angle) * 0.44, -1.9, Math.cos(angle) * 0.44]}
              rotation={[0, angle + Math.PI / 2, -0.35]}
            >
              <boxGeometry args={[0.06, 1.1, 0.7]} />
              <meshStandardMaterial color="#0a0a1e" metalness={0.8} roughness={0.25} />
            </mesh>
          );
        })}

        {/* ── Three portholes on the fuselage top face (toward camera) ── */}
        <RocketPorthole xPos={-1.0} color="#00c8ff" glowColor="#00f0ff" value={stats.total}    label="TOTAL"    />
        <RocketPorthole xPos={ 0.0} color="#00e87a" glowColor="#00ff88" value={stats.active}   label="ACTIVE"   />
        <RocketPorthole xPos={ 1.0} color="#cc44ff" glowColor="#aa00ff" value={stats.archived} label="ARCHIVED" />

        {/* ── Flame cones at nozzle ── */}
        <mesh ref={flameA} position={[0, -3.55, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.28, 1.2, 24, 1, true]} />
          <meshBasicMaterial
            color="#ff6600"
            transparent opacity={0.65}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={flameB} position={[0, -3.45, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.14, 0.85, 16, 1, true]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent opacity={0.75}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* ── Engine glow light ── */}
        <pointLight position={[0, -3.8, 0]} color="#ff4400" intensity={6} distance={5} decay={2} />
        <pointLight position={[0, -3.2, 0]} color="#ffaa00" intensity={3} distance={3} decay={2} />

        {/* ── Nose blue light ── */}
        <pointLight position={[0, 3.5, 0]} color="#00f0ff" intensity={1.2} distance={3} decay={2} />

        {/* ── Exhaust particle stream ── */}
        <ExhaustParticles />

      </group>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  NUMBER LABELS (HTML overlay) — positioned absolutely over the portholes   */
/* ═══════════════════════════════════════════════════════════════════════════ */
function PortholeLabels({ total, active, archived }) {
  const items = [
    { value: total,    label: 'TOTAL',    color: '#00c8ff' },
    { value: active,   label: 'ACTIVE',   color: '#00e87a' },
    { value: archived, label: 'ARCHIVED', color: '#cc44ff' },
  ];

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 0,
      pointerEvents: 'none',
    }}>
      {/* Shift slightly up so labels sit over the portholes (top half of rocket) */}
      <div style={{ display: 'flex', gap: '92px', transform: 'translateY(-28px)' }}>
        {items.map(({ value, label, color }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '1.55rem',
              fontWeight: 300,
              color,
              textShadow: `0 0 14px ${color}, 0 0 28px ${color}88`,
              lineHeight: 1,
              letterSpacing: '0.04em',
            }}>
              {String(value).padStart(2, '0')}
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '0.42rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              color: `${color}99`,
              marginTop: '3px',
              textTransform: 'uppercase',
            }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  SCENE CONFIG                                                                */
/* ═══════════════════════════════════════════════════════════════════════════ */
function SceneSetup() {
  const { scene } = useThree();
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#03030c', 0.014);
    return () => { scene.fog = null; };
  }, [scene]);
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*  ROOT EXPORT                                                                 */
/* ═══════════════════════════════════════════════════════════════════════════ */
const HolOrbs = ({ total, active, archived }) => {
  const stats = { total, active, archived };

  return (
    <div className="space-hud">
      {/* ── Full-bleed 3D canvas ── */}
      <div className="space-hud-canvas">
        <Canvas
          camera={{ position: [0, 1.8, 10], fov: 42 }}
          gl={{ alpha: false, antialias: true }}
          dpr={Math.min(window.devicePixelRatio, 2)}
          style={{ background: '#03030c' }}
        >
          <SceneSetup />
          <ambientLight intensity={0.12} color="#1a1a3e" />
          <directionalLight position={[0, 4, 8]} intensity={0.3} color="#6688ff" />
          <StarField />
          <NebulaGlow />
          <RocketBody stats={stats} />
        </Canvas>
      </div>

      {/* ── Number labels overlay ── */}
      <PortholeLabels total={total} active={active} archived={archived} />

      {/* ── HUD decorators ── */}
      <div className="hud-corner hud-tl" />
      <div className="hud-corner hud-tr" />
      <div className="hud-corner hud-bl" />
      <div className="hud-corner hud-br" />
      <div className="hud-scan-bar" />
    </div>
  );
};

export default HolOrbs;
