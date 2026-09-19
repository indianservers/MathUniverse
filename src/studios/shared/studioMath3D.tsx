import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import * as THREE from "three";
import "./studioMath3D.css";

export type Vec3 = [number, number, number];

function v3(v: Vec3) {
  return new THREE.Vector3(v[0], v[1], v[2]);
}

export function StudioMath3D({
  children,
  label,
  camera = [7.2, 5.4, 8.4],
  compact = false,
}: {
  children: ReactNode;
  label: string;
  camera?: Vec3;
  compact?: boolean;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);
  return (
    <div className={`studio-math-3d${compact ? " is-compact" : ""}`} data-engine="three" role="img" aria-label={label}>
      {ready ? (
        <Canvas camera={{ position: camera, fov: 42 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: false }}>
          <color attach="background" args={["#f7fbff"]} />
          <ambientLight intensity={1.2} />
          <directionalLight position={[6, 9, 5]} intensity={1.45} />
          <hemisphereLight args={["#ffffff", "#c5d4ea", 0.45]} />
          <gridHelper args={[12, 12, "#94a3b8", "#e2e8f0"]} />
          <MathAxes />
          {children}
          <OrbitControls makeDefault enableDamping dampingFactor={0.12} />
        </Canvas>
      ) : (
        <p className="studio-math-3d-ssr">Three.js 3D engine · drag to orbit · scroll to zoom</p>
      )}
    </div>
  );
}

export function MathAxes({ length = 3.4 }: { length?: number }) {
  return (
    <group>
      <MathArrow from={[0, 0, 0]} to={[length, 0, 0]} color="#94a3b8" />
      <MathArrow from={[0, 0, 0]} to={[0, length, 0]} color="#94a3b8" />
      <MathArrow from={[0, 0, 0]} to={[0, 0, length]} color="#94a3b8" />
    </group>
  );
}

export function MathArrow({
  from = [0, 0, 0],
  to,
  color,
}: {
  from?: Vec3;
  to: Vec3;
  color: string;
}) {
  const geom = useMemo(() => {
    const start = v3(from);
    const end = v3(to);
    const dir = end.clone().sub(start);
    const len = dir.length();
    if (len < 1e-6) return null;
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    const shaftLen = Math.max(0.05, len - 0.2);
    const mid = start.clone().add(dir.clone().setLength(shaftLen / 2));
    const tip = start.clone().add(dir.clone().setLength(shaftLen + 0.1));
    return { quat, shaftLen, mid: mid.toArray() as Vec3, tip: tip.toArray() as Vec3 };
  }, [from, to]);
  if (!geom) return null;
  return (
    <group>
      <mesh position={geom.mid} quaternion={geom.quat}>
        <cylinderGeometry args={[0.032, 0.032, geom.shaftLen, 10]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={geom.tip} quaternion={geom.quat}>
        <coneGeometry args={[0.085, 0.2, 12]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

export function MathParallelogram({
  a,
  b,
  color,
}: {
  a: Vec3;
  b: Vec3;
  color: string;
}) {
  const geometry = useMemo(() => {
    const pts = [new THREE.Vector3(0, 0, 0), v3(a), v3(a).add(v3(b)), v3(b)];
    const g = new THREE.BufferGeometry().setFromPoints(pts);
    g.setIndex([0, 1, 2, 0, 2, 3]);
    g.computeVertexNormals();
    return g;
  }, [a, b]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} transparent opacity={0.28} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

export function EquationPlane({
  a,
  b,
  c,
  d,
  color,
}: {
  a: number;
  b: number;
  c: number;
  d: number;
  color: string;
}) {
  const spec = useMemo(() => {
    const n = new THREE.Vector3(a, b, c);
    const mag = n.length();
    if (mag < 1e-8) return null;
    n.multiplyScalar(1 / mag);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
    const dist = d / mag;
    return { quat, pos: n.multiplyScalar(dist).toArray() as Vec3 };
  }, [a, b, c, d]);
  if (!spec) return null;
  return (
    <mesh position={spec.pos} quaternion={spec.quat}>
      <planeGeometry args={[8, 8]} />
      <meshStandardMaterial color={color} transparent opacity={0.32} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

export function MathParallelepiped({
  columns,
  color = "#8b45f4",
}: {
  columns: number[][];
  color?: string;
}) {
  const c0 = columns[0] ?? [1, 0, 0];
  const c1 = columns[1] ?? [0, 1, 0];
  const c2 = columns[2] ?? [0, 0, 1];
  const e1: Vec3 = [c0[0] ?? 0, c0[1] ?? 0, c0[2] ?? 0];
  const e2: Vec3 = [c1[0] ?? 0, c1[1] ?? 0, c1[2] ?? 0];
  const e3: Vec3 = [c2[0] ?? 0, c2[1] ?? 0, c2[2] ?? 0];
  return (
    <group>
      <MathParallelogram a={e1} b={e2} color={color} />
      <MathArrow to={e1} color="#147df2" />
      <MathArrow to={e2} color="#22c55e" />
      <MathArrow to={e3} color={color} />
    </group>
  );
}

export function TransformedCube({ matrix }: { matrix: number[][] }) {
  const corners = useMemo(() => {
    const pts: Vec3[] = [];
    for (const x of [0, 1]) {
      for (const y of [0, 1]) {
        for (const z of [0, 1]) {
          pts.push(applyMat3(matrix, [x, y, z]));
        }
      }
    }
    return pts;
  }, [matrix]);
  return (
    <group>
      {corners.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.05, 10, 8]} />
          <meshStandardMaterial color="#7c3aed" />
        </mesh>
      ))}
      <MathParallelepiped columns={[[matrix[0]?.[0] ?? 1, matrix[1]?.[0] ?? 0, matrix[2]?.[0] ?? 0], [matrix[0]?.[1] ?? 0, matrix[1]?.[1] ?? 1, matrix[2]?.[1] ?? 0], [matrix[0]?.[2] ?? 0, matrix[1]?.[2] ?? 0, matrix[2]?.[2] ?? 1]]} />
    </group>
  );
}

export function SolidKind({ kind }: { kind: string }) {
  if (kind === "Spheres") {
    return (
      <mesh>
        <sphereGeometry args={[1.35, 36, 28]} />
        <meshStandardMaterial color="#147df2" transparent opacity={0.85} />
      </mesh>
    );
  }
  if (kind === "Cylinders") {
    return (
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.95, 0.95, 2.2, 36]} />
        <meshStandardMaterial color="#147df2" />
      </mesh>
    );
  }
  if (kind === "Cones") {
    return (
      <mesh position={[0, 0.2, 0]}>
        <coneGeometry args={[1.15, 2.2, 36]} />
        <meshStandardMaterial color="#8b45f4" />
      </mesh>
    );
  }
  if (kind === "Nets") {
    return (
      <mesh>
        <boxGeometry args={[1.6, 1.6, 1.6]} />
        <meshStandardMaterial color="#38bdf8" wireframe />
      </mesh>
    );
  }
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[1, 1, 1.8, 28]} />
        <meshStandardMaterial color="#08b9dd" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0.2]}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshStandardMaterial color="#f59e0b" transparent opacity={0.35} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function ArRoomScene({ dist, elev, scale }: { dist: number; elev: number; scale: number }) {
  const h = dist * Math.tan((elev * Math.PI) / 180) * 0.08 * scale;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#d6cfc4" />
      </mesh>
      <mesh position={[0, h / 2, -1.2]}>
        <coneGeometry args={[1.1, Math.max(0.4, h), 5]} />
        <meshStandardMaterial color="#8b45f4" />
      </mesh>
      <mesh position={[2.2, 0.55, 0.4]}>
        <boxGeometry args={[1.2, 1.1, 1.2]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
    </group>
  );
}

function applyMat3(M: number[][], v: Vec3): Vec3 {
  return [
    (M[0]?.[0] ?? 0) * v[0] + (M[0]?.[1] ?? 0) * v[1] + (M[0]?.[2] ?? 0) * v[2],
    (M[1]?.[0] ?? 0) * v[0] + (M[1]?.[1] ?? 0) * v[1] + (M[1]?.[2] ?? 0) * v[2],
    (M[2]?.[0] ?? 0) * v[0] + (M[2]?.[1] ?? 0) * v[1] + (M[2]?.[2] ?? 0) * v[2],
  ];
}

export function lift2(M: number[][]): number[][] {
  return [
    [M[0]?.[0] ?? 1, M[0]?.[1] ?? 0, 0],
    [M[1]?.[0] ?? 0, M[1]?.[1] ?? 1, 0],
    [0, 0, 1],
  ];
}

export function MathPolyline({ points, color }: { points: Vec3[]; color: string }) {
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points.map((p) => v3(p))), [points]);
  return (
    <line geometry={geom}>
      <lineBasicMaterial color={color} />
    </line>
  );
}

export function EulerHelix({ theta }: { theta: number }) {
  const tmax = Math.max(theta, 0.04);
  const pts = useMemo((): Vec3[] => {
    const n = 180;
    return Array.from({ length: n }, (_, i) => {
      const t = (i / (n - 1)) * tmax;
      return [Math.cos(t), t * 0.28, Math.sin(t)];
    });
  }, [tmax]);
  const tip: Vec3 = [Math.cos(tmax), tmax * 0.28, Math.sin(tmax)];
  return (
    <group>
      <MathPolyline points={pts} color="#0891b2" />
      <mesh position={tip}>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
}

export function ElevationTriangle({ dist, height }: { dist: number; height: number }) {
  const d = Math.max(0.4, dist * 0.08);
  const h = Math.max(0.2, height * 0.08);
  return (
    <group>
      <MathArrow to={[d, 0, 0]} color="#22d3ee" />
      <MathArrow from={[d, 0, 0]} to={[d, h, 0]} color="#8b45f4" />
      <MathArrow to={[d, h, 0]} color="#f59e0b" />
    </group>
  );
}

export function ProjectilePaths({
  a,
  b,
  play,
}: {
  a: Array<{ x: number; y: number }>;
  b: Array<{ x: number; y: number }>;
  play: { x: number; y: number };
}) {
  const scale = 0.12;
  const toPts = (pts: Array<{ x: number; y: number }>): Vec3[] => pts.map((p) => [p.x * scale, p.y * scale, 0]);
  return (
    <group>
      <MathPolyline points={toPts(a)} color="#147df2" />
      <MathPolyline points={toPts(b)} color="#8b45f4" />
      <mesh position={[play.x * scale, play.y * scale, 0]}>
        <sphereGeometry args={[0.12, 12, 10]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
    </group>
  );
}

export function WasherSolid({
  lo,
  hi,
  inner,
  slices,
}: {
  lo: number;
  hi: number;
  inner: (x: number) => number;
  slices: number;
}) {
  const count = Math.max(8, slices);
  return (
    <group>
      {Array.from({ length: count }, (_, i) => {
        const x = lo + (i / (count - 1)) * (hi - lo);
        const rIn = Math.min(1.45, Math.abs(inner(x)) * 0.35);
        return (
          <group key={i} position={[x * 1.35, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[1.55, 1.55, 0.14, 28]} />
              <meshStandardMaterial color="#f59e0b" transparent opacity={0.28} />
            </mesh>
            <mesh>
              <cylinderGeometry args={[rIn, rIn, 0.16, 24]} />
              <meshStandardMaterial color="#e0f2fe" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function OpenBox({ width, depth, height }: { width: number; depth: number; height: number }) {
  const w = Math.max(0.5, width * 0.06);
  const d = Math.max(0.4, depth * 0.06);
  const h = Math.max(0.25, height * 0.12);
  const t = 0.04;
  return (
    <group>
      <mesh position={[0, t / 2, 0]}>
        <boxGeometry args={[w, t, d]} />
        <meshStandardMaterial color="#7dd3fc" />
      </mesh>
      <mesh position={[0, h / 2, d / 2]}>
        <boxGeometry args={[w, h, t]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[0, h / 2, -d / 2]}>
        <boxGeometry args={[w, h, t]} />
        <meshStandardMaterial color="#0ea5e9" />
      </mesh>
      <mesh position={[w / 2, h / 2, 0]}>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial color="#0284c7" />
      </mesh>
      <mesh position={[-w / 2, h / 2, 0]}>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial color="#0369a1" />
      </mesh>
    </group>
  );
}

export function ExpandingSphere({ radius }: { radius: number }) {
  const r = Math.max(0.35, radius * 0.32);
  return (
    <mesh>
      <sphereGeometry args={[r, 36, 28]} />
      <meshStandardMaterial color="#38c9ef" transparent opacity={0.82} />
    </mesh>
  );
}
