"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";

export const TANO_HAIRS = [
  "Bald",
  "Tuft",
  "Mohawk",
  "Spikes",
  "Bristles",
  "Curls",
  "Bangs",
  "Buns",
  "Tech-Fin",
];

function Hair({ id, gold, glowMat }: { id: number; gold: THREE.Material; glowMat: THREE.Material }) {
  switch (id) {
    case 1:
      return (
        <mesh position={[0, 0.66, 0.12]} rotation={[0.5, 0, 0.35]} material={gold}>
          <coneGeometry args={[0.17, 0.42, 14]} />
        </mesh>
      );
    case 2:
      return (
        <group>
          {[-0.3, -0.15, 0, 0.15, 0.3].map((z, i) => (
            <mesh key={i} position={[0, 0.6 + (0.12 - Math.abs(z) * 0.25), z]} material={gold}>
              <coneGeometry args={[0.1, 0.34 - Math.abs(z) * 0.3, 4]} />
            </mesh>
          ))}
        </group>
      );
    case 3:
      return (
        <group>
          {[
            [-0.32, 0.5, 0.1, -0.5, 0, 0.2],
            [-0.15, 0.6, 0.25, -0.2, 0, 0.1],
            [0.05, 0.64, 0.15, 0, 0, 0],
            [0.25, 0.58, 0.05, 0.2, 0, -0.1],
            [0.34, 0.5, -0.15, 0.5, 0, -0.2],
            [-0.05, 0.6, -0.28, 0, 0, 0.1],
          ].map((s, i) => (
            <mesh key={i} position={[s[0], s[1], s[2]]} rotation={[s[3], s[4], s[5]]} material={gold}>
              <coneGeometry args={[0.09, 0.4, 5]} />
            </mesh>
          ))}
        </group>
      );
    case 4:
      return (
        <group position={[0, 0.56, 0]}>
          <RoundedBox args={[0.95, 0.12, 0.8]} radius={0.05} smoothness={3} material={gold} />
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 3 }).map((_, c) => (
              <mesh key={`${r}-${c}`} position={[-0.34 + r * 0.23, 0.16, -0.24 + c * 0.24]} material={gold}>
                <cylinderGeometry args={[0.035, 0.035, 0.22, 8]} />
              </mesh>
            ))
          )}
        </group>
      );
    case 5:
      return (
        <group>
          {[-0.4, -0.24, -0.08, 0.08, 0.24, 0.4].map((x, i) => (
            <mesh key={i} position={[x, 0.56 + Math.cos(x * 3) * 0.06, 0.18]} material={gold}>
              <sphereGeometry args={[0.14, 16, 16]} />
            </mesh>
          ))}
          {[-0.3, 0, 0.3].map((x, i) => (
            <mesh key={`b${i}`} position={[x, 0.6, -0.15]} material={gold}>
              <sphereGeometry args={[0.13, 16, 16]} />
            </mesh>
          ))}
        </group>
      );
    case 6:
      return <RoundedBox args={[1.12, 0.4, 0.62]} radius={0.16} smoothness={5} position={[0, 0.5, 0.2]} material={gold} />;
    case 7:
      return (
        <group>
          <RoundedBox args={[1.0, 0.28, 0.7]} radius={0.12} smoothness={4} position={[0, 0.56, 0]} material={gold} />
          <mesh position={[-0.62, 0.5, 0]} material={gold}>
            <sphereGeometry args={[0.24, 20, 20]} />
          </mesh>
          <mesh position={[0.62, 0.5, 0]} material={gold}>
            <sphereGeometry args={[0.24, 20, 20]} />
          </mesh>
        </group>
      );
    case 8:
      return (
        <group>
          <mesh position={[0, 0.74, 0]} material={gold}>
            <boxGeometry args={[0.08, 0.5, 0.7]} />
          </mesh>
          <mesh position={[0, 1.02, 0.2]} material={glowMat}>
            <sphereGeometry args={[0.08, 16, 16]} />
          </mesh>
        </group>
      );
    default:
      return null;
  }
}

function Robot({
  hair,
  walking = false,
  facing = "forward",
}: {
  hair: number;
  walking?: boolean;
  facing?: "forward" | "left" | "right";
}) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);

  const chrome = useMemo(() => new THREE.MeshStandardMaterial({ color: "#cbd0d8", metalness: 0.9, roughness: 0.34 }), []);
  const gold = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#E7C87A", metalness: 1, roughness: 0.24, emissive: new THREE.Color("#4a3712"), emissiveIntensity: 0.25 }),
    []
  );
  const screen = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0a0d14", metalness: 0.3, roughness: 0.5 }), []);
  const eyeMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#FFE79A", emissive: new THREE.Color("#FFB01E"), emissiveIntensity: 2.6, toneMapped: false }),
    []
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (eyes.current) {
      const c = t % 3.4;
      let s = 1;
      if (c > 3.15) s = Math.abs(Math.cos(((c - 3.15) / 0.25) * Math.PI));
      eyes.current.scale.y = Math.max(0.08, s);
    }
    // ---- gait: slow, heavy, mechanical ----
    const step = t * 1.9; // ~0.6 steps/sec — a slow, heavy, rhythmic robot stride
    const s = Math.sin(step);
    // hold near the extremes so each swing reads as a *step*, not a pendulum
    const stiff = Math.sign(s) * Math.pow(Math.abs(s), 0.45);

    if (root.current) {
      // body drops each time a foot plants (twice per cycle) — sells the weight
      root.current.position.y = walking
        ? -0.15 - Math.abs(Math.cos(step)) * 0.08
        : -0.15 + Math.sin(t * 1.6) * 0.07;
      // weight shifts side to side as it steps
      root.current.rotation.z = THREE.MathUtils.lerp(root.current.rotation.z, walking ? s * 0.08 : 0, 0.15);
      // face sideways in the walk direction, otherwise idle-sway / look at cursor
      const targetY =
        facing === "left" ? -Math.PI / 2 : facing === "right" ? Math.PI / 2 : Math.sin(t * 0.5) * 0.12 + state.pointer.x * 0.25;
      root.current.rotation.y = THREE.MathUtils.lerp(root.current.rotation.y, targetY, facing === "forward" ? 0.08 : 0.14);
    }
    if (head.current) {
      if (facing === "forward" && !walking) {
        head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, state.pointer.x * 0.5, 0.08);
        head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -state.pointer.y * 0.32, 0.08);
      } else {
        head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, 0, 0.1);
        head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, walking ? -0.08 : 0, 0.1);
      }
    }
    // legs swing from the hip; the stepping foot lifts clear of the ground
    if (legL.current) {
      legL.current.rotation.x = walking ? stiff * 1.05 : 0;
      legL.current.position.y = -0.55 + (walking ? Math.max(0, s) * 0.16 : 0);
    }
    if (legR.current) {
      legR.current.rotation.x = walking ? -stiff * 1.05 : 0;
      legR.current.position.y = -0.55 + (walking ? Math.max(0, -s) * 0.16 : 0);
    }
    // arms counter-swing to the legs
    if (armL.current) armL.current.rotation.x = walking ? -stiff * 0.7 : Math.sin(t * 1.6) * 0.12;
    if (armR.current) armR.current.rotation.x = walking ? stiff * 0.7 : -Math.sin(t * 1.6) * 0.12;
  });

  return (
    <group ref={root} scale={0.82}>
      <group ref={head} position={[0, 1.15, 0]}>
        <RoundedBox args={[1.32, 1.16, 1.0]} radius={0.3} smoothness={6} material={chrome} />
        <RoundedBox args={[1.05, 0.86, 0.06]} radius={0.24} smoothness={5} position={[0, 0, 0.49]} material={gold} />
        <RoundedBox args={[0.94, 0.76, 0.06]} radius={0.2} smoothness={5} position={[0, 0, 0.52]} material={screen} />
        <group ref={eyes}>
          <mesh position={[-0.26, 0.02, 0.58]} material={eyeMat}>
            <sphereGeometry args={[0.16, 24, 24]} />
          </mesh>
          <mesh position={[0.26, 0.02, 0.58]} material={eyeMat}>
            <sphereGeometry args={[0.16, 24, 24]} />
          </mesh>
        </group>
        <mesh position={[0, -0.26, 0.57]} material={gold}>
          <torusGeometry args={[0.16, 0.028, 10, 24, Math.PI]} />
        </mesh>
        <mesh position={[-0.72, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chrome}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 20]} />
        </mesh>
        <mesh position={[0.72, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={chrome}>
          <cylinderGeometry args={[0.16, 0.16, 0.14, 20]} />
        </mesh>
        <mesh position={[0, 0.7, 0]} material={chrome}>
          <cylinderGeometry args={[0.03, 0.03, 0.34, 10]} />
        </mesh>
        <mesh position={[0, 0.92, 0]} material={eyeMat}>
          <sphereGeometry args={[0.09, 16, 16]} />
        </mesh>
        <Hair id={hair} gold={gold} glowMat={eyeMat} />
      </group>

      <RoundedBox args={[1.08, 1.0, 0.72]} radius={0.22} smoothness={5} position={[0, 0.15, 0]} material={chrome} />
      <mesh position={[0, 0.28, 0.38]} material={eyeMat}>
        <sphereGeometry args={[0.11, 20, 20]} />
      </mesh>
      <RoundedBox args={[0.5, 0.24, 0.05]} radius={0.1} smoothness={4} position={[0, 0.0, 0.38]} material={screen} />

      <group ref={armL} position={[-0.62, 0.5, 0]}>
        <mesh position={[0, -0.32, 0]} material={chrome}>
          <capsuleGeometry args={[0.13, 0.5, 6, 14]} />
        </mesh>
        <mesh position={[0, -0.66, 0]} material={gold}>
          <sphereGeometry args={[0.16, 18, 18]} />
        </mesh>
      </group>
      <group ref={armR} position={[0.62, 0.5, 0]}>
        <mesh position={[0, -0.32, 0]} material={chrome}>
          <capsuleGeometry args={[0.13, 0.5, 6, 14]} />
        </mesh>
        <mesh position={[0, -0.66, 0]} material={gold}>
          <sphereGeometry args={[0.16, 18, 18]} />
        </mesh>
      </group>

      <group ref={legL} position={[-0.3, -0.55, 0]}>
        <mesh position={[0, -0.22, 0]} material={chrome}>
          <capsuleGeometry args={[0.15, 0.44, 6, 14]} />
        </mesh>
        <RoundedBox args={[0.34, 0.2, 0.5]} radius={0.09} smoothness={4} position={[0, -0.56, 0.1]} material={gold} />
      </group>
      <group ref={legR} position={[0.3, -0.55, 0]}>
        <mesh position={[0, -0.22, 0]} material={chrome}>
          <capsuleGeometry args={[0.15, 0.44, 6, 14]} />
        </mesh>
        <RoundedBox args={[0.34, 0.2, 0.5]} radius={0.09} smoothness={4} position={[0, -0.56, 0.1]} material={gold} />
      </group>
    </group>
  );
}

export function Tano3D({
  hair = 0,
  walking = false,
  facing = "forward",
  className = "",
}: {
  hair?: number;
  walking?: boolean;
  facing?: "forward" | "left" | "right";
  className?: string;
}) {
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(fire);
    const t1 = setTimeout(fire, 120);
    const t2 = setTimeout(fire, 450);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <Canvas
      className={className}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
      frameloop="always"
      resize={{ debounce: 0 }}
      camera={{ position: [0, 0.2, 6.2], fov: 32 }}
      style={{ background: "transparent", position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.55} />
      <directionalLight position={[3, 5, 4]} intensity={1.4} />
      <directionalLight position={[-4, 1, -2]} intensity={0.5} color="#C9A24B" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={2.4} position={[2, 3, 4]} scale={6} />
        <Lightformer form="rect" intensity={1.2} position={[-3, 1, 3]} scale={5} color="#F4E8C6" />
        <Lightformer form="ring" intensity={1} position={[0, -2, 2]} scale={4} color="#C9A24B" />
      </Environment>
      <Robot hair={hair} walking={walking} facing={facing} />
    </Canvas>
  );
}
