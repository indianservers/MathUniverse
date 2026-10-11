import { Canvas, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementRef,
  type ReactNode,
} from "react";
import { EULER_COLORS, EulerCircle } from "./EulerLinkedFigures";
import type { EulerCamera } from "./eulerLearningMath";
class SceneBoundary extends Component<
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
function HelixContent({
  degrees,
  trace,
  grid,
  labels,
  cameraState,
  onCamera,
  reduced,
  dark,
}: SceneProps) {
  const { camera } = useThree();
  const controls = useRef<ElementRef<typeof OrbitControls>>(null);
  const rad = (degrees * Math.PI) / 180;
  const start = Math.max(0, rad - trace * Math.PI * 2);
  const points = useMemo(
    () =>
      Array.from({ length: 241 }, (_, i): [number, number, number] => {
        const t = start + ((rad - start) * i) / 240;
        return [Math.cos(t), t, Math.sin(t)];
      }),
    [rad, start],
  );
  const tip: [number, number, number] = [Math.cos(rad), rad, Math.sin(rad)];
  useEffect(() => {
    camera.position.set(...cameraState.position);
    controls.current?.target.set(...cameraState.target);
    controls.current?.update();
  }, [camera, cameraState]);
  return (
    <>
      <color attach="background" args={[dark ? "#0c1c34" : "#f8fafc"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 8, 6]} intensity={2} />
      {grid && <gridHelper args={[4, 8, "#94a3b8", "#dbe4ed"]} />}
      <Line
        points={[
          [-1.7, 0, 0],
          [1.7, 0, 0],
        ]}
        color={EULER_COLORS.real}
        lineWidth={2}
      />
      <Line
        points={[
          [0, 0, -1.7],
          [0, 0, 1.7],
        ]}
        color={EULER_COLORS.imaginary}
        lineWidth={2}
      />
      <Line
        points={[
          [0, 0, 0],
          [0, Math.max(4, rad + 0.6), 0],
        ]}
        color={EULER_COLORS.angle}
        lineWidth={2}
      />
      <Line
        points={points}
        color={dark ? "#28dfff" : EULER_COLORS.exact}
        lineWidth={3}
      />
      <Line
        points={[[0, rad, 0], tip]}
        color={EULER_COLORS.angle}
        lineWidth={2}
      />
      <Line
        points={[tip, [tip[0], 0, tip[2]]]}
        color={EULER_COLORS.exact}
        dashed
        dashSize={0.1}
        gapSize={0.08}
      />
      <Line
        points={[
          [0, 0, 0],
          [tip[0], 0, 0],
        ]}
        color={EULER_COLORS.real}
        lineWidth={3}
      />
      <Line
        points={[
          [tip[0], 0, 0],
          [tip[0], 0, tip[2]],
        ]}
        color={EULER_COLORS.imaginary}
        lineWidth={3}
      />
      <mesh position={tip}>
        <sphereGeometry args={[0.075, 16, 12]} />
        <meshStandardMaterial color={EULER_COLORS.exact} />
      </mesh>
      <mesh position={[tip[0], 0, tip[2]]}>
        <sphereGeometry args={[0.06, 16, 12]} />
        <meshStandardMaterial color={EULER_COLORS.angle} />
      </mesh>
      {labels && (
        <>
          <Html position={[1.8, 0, 0]} center>
            <span
              className="euler-axis-label"
              style={{ color: EULER_COLORS.real }}
            >
              Re
            </span>
          </Html>
          <Html position={[0, 0, 1.8]} center>
            <span
              className="euler-axis-label"
              style={{ color: EULER_COLORS.imaginary }}
            >
              Im
            </span>
          </Html>
          <Html position={[0, Math.max(4, rad + 0.7), 0]} center>
            <span
              className="euler-axis-label"
              style={{ color: EULER_COLORS.angle }}
            >
              θ (rad)
            </span>
          </Html>
          {[Math.PI, Math.PI * 2, Math.PI * 3, Math.PI * 4]
            .filter((t) => t <= Math.max(4, rad + 0.6))
            .map((t) => (
              <Html key={t} position={[0, t, 0]}>
                <span className="euler-axis-label">
                  {t === Math.PI ? "π" : `${Math.round(t / Math.PI)}π`}
                </span>
              </Html>
            ))}
        </>
      )}
      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping={!reduced}
        dampingFactor={0.12}
        minDistance={2}
        maxDistance={30}
        onEnd={() => {
          if (controls.current)
            onCamera({
              position: camera.position.toArray() as EulerCamera["position"],
              target:
                controls.current.target.toArray() as EulerCamera["target"],
            });
        }}
      />
    </>
  );
}
type SceneProps = {
  degrees: number;
  trace: number;
  grid: boolean;
  labels: boolean;
  cameraState: EulerCamera;
  onCamera: (camera: EulerCamera) => void;
  reduced: boolean;
  dark?: boolean;
};
export default function EulerHelixScene(props: SceneProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const fallback = (
    <div className="euler-scene-fallback">
      <p>
        3D is unavailable here. The linked unit circle shows the same complex
        point; helix height is θ in radians.
      </p>
      <EulerCircle {...props} terms={6} />
    </div>
  );
  return (
    <div
      className="euler-helix"
      aria-label="Complex exponential helix: real, imaginary and unwrapped angle axes"
    >
      {mounted ? (
        <SceneBoundary fallback={fallback}>
          <Canvas
            camera={{ position: props.cameraState.position, fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, preserveDrawingBuffer: true }}
          >
            <HelixContent {...props} />
          </Canvas>
        </SceneBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
