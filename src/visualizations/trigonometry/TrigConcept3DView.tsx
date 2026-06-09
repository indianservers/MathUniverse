import { Line, OrbitControls, Text } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import ThreeSceneWrapper from "../../components/three/ThreeSceneWrapper";
import { type TrigonometryVisualType } from "../../data/trigonometryConcepts";
import { degreesToRadians, roundTo } from "../../utils/math";

type TrigConcept3DViewProps = {
  visual: TrigonometryVisualType;
  a: number;
  b: number;
  title: string;
};

export default function TrigConcept3DView({ visual, a, b, title }: TrigConcept3DViewProps) {
  return (
    <ThreeSceneWrapper height="440px" mobileHeight="360px" cameraPosition={[4.2, 3.2, 5.8]} fov={45} quality="high" chrome="cinematic" sceneLabel="3D concept view" interactionLabel="Drag rotate - scroll zoom">
      <group>
        <ConceptGeometry visual={visual} a={a} b={b} />
        <gridHelper args={[7, 14, "#38bdf8", "#334155"]} />
        <Text position={[-3.15, 2.1, -2.6]} fontSize={0.16} color="#e0f2fe" anchorX="left">
          {title}
        </Text>
      </group>
      <OrbitControls enableDamping />
    </ThreeSceneWrapper>
  );
}

function ConceptGeometry({ visual, a, b }: { visual: TrigonometryVisualType; a: number; b: number }) {
  if (visual === "right-triangle" || visual === "ratio" || visual === "height-distance" || visual === "inverse") return <Triangle3D visual={visual} a={a} b={b} />;
  if (visual === "angle-measure" || visual === "identity" || visual === "polar" || visual === "bearing") return <Circle3D visual={visual} a={a} b={b} />;
  if (visual === "law") return <TriangleLaw3D a={a} b={b} />;
  return <WaveSurface3D visual={visual} a={a} b={b} />;
}

function Triangle3D({ visual, a, b }: { visual: TrigonometryVisualType; a: number; b: number }) {
  const angle = visual === "inverse" ? Math.asin(Math.max(-1, Math.min(1, a))) : degreesToRadians(Math.max(5, Math.min(85, a)));
  const scale = visual === "inverse" ? b / 90 : Math.max(0.9, b / 120);
  const adjacent = Math.cos(angle) * scale * 2.2;
  const opposite = Math.sin(angle) * scale * 2.2;
  const points = [
    new THREE.Vector3(-1.4, 0, 0),
    new THREE.Vector3(-1.4 + adjacent, 0, 0),
    new THREE.Vector3(-1.4 + adjacent, opposite, 0),
    new THREE.Vector3(-1.4, 0, 0),
  ];

  return (
    <group position={[0, -0.8, 0]}>
      <Line points={points} color="#22d3ee" lineWidth={4} />
      <Line points={[points[0], points[2]]} color="#c084fc" lineWidth={3} />
      <Line points={[points[2], new THREE.Vector3(-1.4 + adjacent, 0, 0.8)]} color="#10b981" lineWidth={2} />
      <mesh position={[-1.4 + adjacent / 2, opposite / 2, -0.03]} rotation={[0, 0, angle / 2]}>
        <boxGeometry args={[2.4 * scale, 0.025, 0.025]} />
        <meshStandardMaterial color="#f59e0b" emissive="#7c2d12" emissiveIntensity={0.2} />
      </mesh>
      <Text position={[-1.2, -0.28, 0]} fontSize={0.14} color="#e0f2fe" anchorX="left">
        theta = {roundTo((angle * 180) / Math.PI, 1)} deg
      </Text>
      <Text position={[0.2, -0.28, 0]} fontSize={0.12} color="#bae6fd" anchorX="left">
        side ratios
      </Text>
    </group>
  );
}

function Circle3D({ visual, a, b }: { visual: TrigonometryVisualType; a: number; b: number }) {
  const theta = degreesToRadians(a);
  const radius = visual === "identity" ? 1.55 : Math.max(0.9, Math.min(2, b / 80));
  const point = new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0);
  const circle = useMemo(() => Array.from({ length: 121 }, (_, index) => {
    const t = (index / 120) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(t) * radius, Math.sin(t) * radius, 0);
  }), [radius]);
  const helix = useMemo(() => Array.from({ length: 180 }, (_, index) => {
    const t = (index / 179) * Math.PI * 4;
    return new THREE.Vector3(Math.cos(t) * radius, Math.sin(t) * radius, -2 + (index / 179) * 4);
  }), [radius]);

  return (
    <group>
      <Line points={circle} color="#22d3ee" lineWidth={3} />
      <Line points={helix} color="#8b5cf6" lineWidth={1.6} />
      <Line points={[new THREE.Vector3(0, 0, 0), point]} color="#f59e0b" lineWidth={4} />
      <Line points={[new THREE.Vector3(point.x, 0, 0), point]} color="#10b981" lineWidth={2} />
      <Line points={[new THREE.Vector3(0, point.y, 0), point]} color="#ec4899" lineWidth={2} />
      <mesh position={[point.x, point.y, point.z]}>
        <sphereGeometry args={[0.09, 24, 16]} />
        <meshStandardMaterial color="#f59e0b" emissive="#7c2d12" emissiveIntensity={0.25} />
      </mesh>
      <Text position={[-2.8, -2, 0]} fontSize={0.13} color="#e0f2fe" anchorX="left">
        sin={roundTo(Math.sin(theta), 3)}  cos={roundTo(Math.cos(theta), 3)}
      </Text>
    </group>
  );
}

function TriangleLaw3D({ a, b }: { a: number; b: number }) {
  const angle = degreesToRadians(Math.max(10, Math.min(170, a)));
  const scale = Math.max(0.9, b / 90);
  const p1 = new THREE.Vector3(-1.8, -0.7, 0);
  const p2 = new THREE.Vector3(1.8, -0.7, 0);
  const p3 = new THREE.Vector3(-1.8 + Math.cos(angle) * scale * 1.7, -0.7 + Math.sin(angle) * scale * 1.7, 0.45);
  return (
    <group>
      <Line points={[p1, p2, p3, p1]} color="#22d3ee" lineWidth={4} />
      <Line points={[p1, new THREE.Vector3(p3.x, p3.y, 0), p3]} color="#f59e0b" lineWidth={2} />
      <Text position={[-2.8, -1.45, 0]} fontSize={0.13} color="#e0f2fe" anchorX="left">
        oblique triangle in 3D plane
      </Text>
    </group>
  );
}

function WaveSurface3D({ visual, a, b }: { visual: TrigonometryVisualType; a: number; b: number }) {
  const geometry = useMemo(() => {
    const xSteps = 80;
    const zSteps = 22;
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const color = new THREE.Color(visual === "graph-transform" ? "#06b6d4" : "#8b5cf6");
    const amp = Math.max(0.25, Math.min(2, Math.abs(a) / 2.5));
    const freq = Math.max(0.25, Math.min(5, Math.abs(b)));

    for (let iz = 0; iz < zSteps; iz += 1) {
      const z = -2.5 + (iz / (zSteps - 1)) * 5;
      for (let ix = 0; ix < xSteps; ix += 1) {
        const x = -Math.PI * 2 + (ix / (xSteps - 1)) * Math.PI * 4;
        const y = Math.sin(freq * x) * amp * 0.5 + Math.cos(z * 1.4) * 0.08;
        positions.push((x / (Math.PI * 2)) * 3, y, z);
        colors.push(color.r, color.g, color.b);
      }
    }

    for (let iz = 0; iz < zSteps - 1; iz += 1) {
      for (let ix = 0; ix < xSteps - 1; ix += 1) {
        const start = iz * xSteps + ix;
        indices.push(start, start + 1, start + xSteps, start + 1, start + xSteps + 1, start + xSteps);
      }
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [a, b, visual]);

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.42} metalness={0.05} transparent opacity={0.86} />
      </mesh>
      <Text position={[-3, -1.45, -2.4]} fontSize={0.13} color="#e0f2fe" anchorX="left">
        wave surface: amplitude, period, phase
      </Text>
    </group>
  );
}
