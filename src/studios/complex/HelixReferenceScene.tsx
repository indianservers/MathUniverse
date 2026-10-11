import { Canvas, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { Color } from "three";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  type ElementRef,
  type ReactNode,
} from "react";

export type HelixDisplay = {
  circle: boolean;
  helix: boolean;
  projections: boolean;
  axes: boolean;
  point: boolean;
};
type Props = {
  theta: number;
  radius: number;
  stretch: number;
  display: HelixDisplay;
  cameraPreset: number;
  zoom: number;
  pan: boolean;
  reduced: boolean;
};
class HelixBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
function Scene(p: Props) {
  const { camera } = useThree();
  const controls = useRef<ElementRef<typeof OrbitControls>>(null);
  const height = p.theta * p.stretch;
  const points = useMemo(
    () =>
      Array.from({ length: 401 }, (_, i): [number, number, number] => {
        const t = (p.theta * i) / 400;
        return [p.radius * Math.cos(t), p.stretch * t, -p.radius * Math.sin(t)];
      }),
    [p.theta, p.radius, p.stretch],
  );
  const colors = useMemo(
    () =>
      points.map((_, i) =>
        new Color().setHSL(
          0.55 + (0.2 * (1 + Math.cos((p.theta * i) / 400))) / 2,
          1,
          0.53,
        ),
      ),
    [points, p.theta],
  );
  const ring = useMemo(
    () =>
      Array.from({ length: 129 }, (_, i): [number, number, number] => [
        p.radius * Math.cos((i * Math.PI) / 64),
        0,
        -p.radius * Math.sin((i * Math.PI) / 64),
      ]),
    [p.radius],
  );
  const tip = points[points.length - 1];
  useEffect(() => {
    const center = Math.max(0.5, (height * 0.7) / 2 - 1.2);
    const distance = Math.max(8, height + 5);
    const position: [number, number, number] =
      p.cameraPreset % 3 === 1
        ? [0, center + distance, 0.001]
        : p.cameraPreset % 3 === 2
          ? [distance, center, 0]
          : [-distance * 0.55, center + distance * 0.28, distance * 0.9];
    camera.position.set(...position);
    controls.current?.target.set(0, center, 0);
    controls.current?.update();
  }, [camera, p.cameraPreset, height]);
  return (
    <>
      <color attach="background" args={["#eaf2fc"]} />
      <ambientLight intensity={2} />
      <group scale={[2.2, 0.7, 2.2]}>
        {p.display.axes && (
          <>
            <gridHelper args={[9, 18, "#cadbf3", "#d9e5f6"]} />
            <Line
              points={[
                [0, 0, 0],
                [-2.5, 0, 0],
              ]}
              color="#10286d"
              lineWidth={1.5}
            />
            <Line
              points={[
                [0, 0, 0],
                [0, 0, 2.5],
              ]}
              color="#10286d"
              lineWidth={1.5}
            />
            <Line
              points={[
                [0, 0, 0],
                [0, Math.max(4, height + 0.8), 0],
              ]}
              color="#10286d"
              dashed
              dashSize={0.13}
              gapSize={0.08}
              lineWidth={1.5}
            />
            {[
              [[-2.6, 0, 0], "x"],
              [[0, 0, 2.6], "y"],
              [[0, Math.max(4, height + 0.9), 0], "z"],
            ].map(([position, label]) => (
              <Html
                key={String(label)}
                position={position as [number, number, number]}
                center
              >
                <span className="hr-axis-label">{String(label)}</span>
              </Html>
            ))}
          </>
        )}
        {p.display.circle && (
          <Line
            points={ring}
            toneMapped={false}
            vertexColors={ring.map((_, i) =>
              new Color().setHSL(0.55 + (0.2 * i) / 128, 1, 0.53),
            )}
            lineWidth={2.5}
            dashed
            dashSize={0.08}
            gapSize={0.05}
          />
        )}
        {p.display.helix && (
          <Line
            points={points}
            vertexColors={colors}
            lineWidth={4}
            toneMapped={false}
          />
        )}
        {p.display.projections && (
          <Line
            points={[tip, [tip[0], 0, tip[2]], [0, 0, 0]]}
            color="#65c7f5"
            dashed
            dashSize={0.08}
            gapSize={0.08}
            lineWidth={1}
          />
        )}
        {p.display.point && (
          <>
            <mesh position={tip}>
              <sphereGeometry args={[0.11, 24, 16]} />
              <meshBasicMaterial color="#b960ff" />
            </mesh>
            <mesh position={tip}>
              <sphereGeometry args={[0.075, 24, 16]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
            <Html position={tip}>
              <span className="hr-point-dot" />
              <span className="hr-point-label">
                {p.radius === 1
                  ? "(cos θ, sin θ, cθ)"
                  : "(r cos θ, r sin θ, cθ)"}
              </span>
            </Html>
          </>
        )}
      </group>
      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping={!p.reduced}
        enablePan={p.pan}
        enableRotate={!p.pan}
        minDistance={3}
        maxDistance={65}
      />
    </>
  );
}
export default function HelixReferenceScene(p: Props) {
  const projected = Array.from({ length: 361 }, (_, i) => {
    const t = (p.theta * i) / 360;
    return `${i ? "L" : "M"}${360 + 100 * p.radius * Math.cos(t) - 60 * p.radius * Math.sin(t)} ${330 - (240 * p.stretch * t) / Math.max(1, p.stretch * p.theta) - 22 * p.radius * Math.sin(t)}`;
  }).join(" ");
  const fallback = (
    <div className="hr-fallback">
      <svg
        viewBox="0 0 720 440"
        role="img"
        aria-label="Helix projection; interactive 3D is unavailable"
      >
        <path
          d="M180 385L360 330L550 385M360 330V55"
          stroke="#243e81"
          fill="none"
        />
        {p.display.circle && (
          <ellipse
            cx="360"
            cy="330"
            rx={110 * p.radius}
            ry={32 * p.radius}
            fill="none"
            stroke="#00caff"
            strokeDasharray="6 4"
          />
        )}
        {p.display.helix && (
          <path d={projected} fill="none" stroke="#7937fa" strokeWidth="4" />
        )}
      </svg>
      <p>
        3D is unavailable in this browser. This projected diagram follows the
        same parameters.
      </p>
    </div>
  );
  return (
    <HelixBoundary fallback={fallback}>
      <Canvas
        frameloop="demand"
        camera={{ position: [8, 7, 14], fov: 39, zoom: p.zoom }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <Scene {...p} />
      </Canvas>
    </HelixBoundary>
  );
}
