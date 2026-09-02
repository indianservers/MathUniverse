import { Edges, Line, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import {
  Check,
  ExternalLink,
  Focus,
  Hand,
  Keyboard,
  Maximize,
  MousePointer2,
  Move,
  Rotate3D,
  RotateCcw,
  Search,
  Share2,
  ZoomIn,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  MOUSE,
  OrthographicCamera,
  PerspectiveCamera,
  Vector3,
} from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./CameraControlsTargetLesson410.css";

type Tool = "orbit" | "pan" | "zoom";
type Projection = "perspective" | "orthographic";
type Pose = {
  position: [number, number, number];
  target: [number, number, number];
};
type Telemetry = {
  x: number;
  y: number;
  z: number;
  azimuth: number;
  elevation: number;
  distance: number;
  tx: number;
  ty: number;
  tz: number;
};

const initialPose: Pose = {
  position: [6.12, 4.38, 5.29],
  target: [0, 0.25, 0],
};
const targetPose: Pose = { position: [4.3, 5.8, 6.5], target: [0, 0.25, 0] };
const defaultTelemetry = telemetry(initialPose.position, initialPose.target);

export default function CameraControlsTargetLesson410({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [tool, setTool] = useState<Tool>("orbit");
  const [projection, setProjection] = useState<Projection>("perspective");
  const [pose, setPose] = useState<Pose>(initialPose);
  const [viewVersion, setViewVersion] = useState(0);
  const [camera, setCamera] = useState(defaultTelemetry);
  const [tab, setTab] = useState("Interaction + visualization");
  const [coach, setCoach] = useState<"Mouse" | "Touch">("Mouse");
  const [guide, setGuide] = useState(0);
  const [checked, setChecked] = useState(false);
  const [targetSeed, setTargetSeed] = useState(0);
  const [shared, setShared] = useState(false);
  const [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const applyPose = (next: Pose) =>
    act(() => {
      setPose(next);
      setViewVersion((value) => value + 1);
      setChecked(false);
    });
  const reset = () => {
    setTool("orbit");
    setProjection("perspective");
    setPose(initialPose);
    setCamera(defaultTelemetry);
    setTab("Interaction + visualization");
    setCoach("Mouse");
    setGuide(0);
    setChecked(false);
    setTargetSeed(0);
    setShared(false);
    setActions(0);
    setViewVersion((value) => value + 1);
  };
  useEffect(reset, [resetToken]);
  const target = targetFor(targetSeed);
  const score = scoreView(camera, target);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.matches("input, select, textarea"))
        return;
      const key = event.key.toLowerCase();
      let next: Pose | null = null;
      if (key === "r" || key === "f" || key === "home") next = initialPose;
      if (key === "1") next = { position: [0, 9, 0.01], target: [0, 0.25, 0] };
      if (key === "2") next = { position: [0, 0.25, 9], target: [0, 0.25, 0] };
      if (key === "3") next = { position: [9, 0.25, 0], target: [0, 0.25, 0] };
      if (key === "p")
        setProjection((value) =>
          value === "perspective" ? "orthographic" : "perspective",
        );
      if (["arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key)) {
        const dx = key === "arrowleft" ? -0.3 : key === "arrowright" ? 0.3 : 0;
        const dy = key === "arrowdown" ? -0.3 : key === "arrowup" ? 0.3 : 0;
        next = {
          position: [
            pose.position[0] + dx,
            pose.position[1] + dy,
            pose.position[2],
          ],
          target: [pose.target[0] + dx, pose.target[1] + dy, pose.target[2]],
        };
      }
      if (["+", "=", "-", "_"].includes(key)) {
        const factor = key === "+" || key === "=" ? 0.85 : 1.15;
        next = {
          position: pose.position.map(
            (value, index) =>
              pose.target[index] + (value - pose.target[index]) * factor,
          ) as [number, number, number],
          target: pose.target,
        };
      }
      if (next) {
        setPose(next);
        setViewVersion((value) => value + 1);
        setChecked(false);
      }
      if (next || key === "p") {
        setActions((value) => value + 1);
        onInteraction();
        event.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onInteraction, pose]);
  return (
    <section
      className="cs378-page cam410-page"
      data-testid="geometry3d-mockup-0595"
      data-object-model="threejs-dedicated-camera-state-orbit-pan-zoom-projection-telemetry-guides-view-challenge"
      data-direct-interaction="true"
      data-tool={tool}
      data-projection={projection}
      data-camera={`${round(camera.x)},${round(camera.y)},${round(camera.z)}`}
      data-target={`${round(camera.tx)},${round(camera.ty)},${round(camera.tz)}`}
      data-azimuth={round(camera.azimuth)}
      data-elevation={round(camera.elevation)}
      data-distance={round(camera.distance)}
      data-fov="45"
      data-guide={guide}
      data-coach={coach}
      data-checked={checked}
      data-score={score.total}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="cam410-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <small>3D GEOMETRY AND SOLIDS</small>
          <h1>3D Camera Controls</h1>
          <p>Move the camera to see more. The object stays the same.</p>
          <div className="cam410-badges">
            <span>Intermediate–Advanced</span>
            <span>3D Lab</span>
            <span>3D Calculator</span>
            <span>6–10 min</span>
          </div>
          <nav>
            <select aria-label="Language">
              <option>English (English)</option>
            </select>
            <a href="/workspace">
              <ExternalLink />
              Workspace
            </a>
            <button onClick={reset}>
              <RotateCcw />
              Reset view
            </button>
            <button
              onClick={() =>
                act(() => {
                  setShared(true);
                  void navigator.clipboard?.writeText(
                    `Camera ${round(camera.azimuth)}°, ${round(camera.elevation)}°`,
                  );
                })
              }
            >
              <Share2 />
              {shared ? "Shared" : "Share"}
            </button>
          </nav>
        </div>
        <aside>
          <h3>What you’ll learn</h3>
          <p>
            <Check />
            Camera movement changes your viewpoint, not the object.
          </p>
          <p>
            <Check />
            Orbit, pan, and zoom to explore any solid.
          </p>
          <p>
            <Check />
            Use camera tools and shortcuts with confidence.
          </p>
        </aside>
      </header>
      <nav className="cam410-tabs">
        {[
          "Interaction + visualization",
          "Guided steps",
          "Shortcuts",
          "Challenge",
          "Explain",
          "Examples",
          "Know more",
        ].map((item) => (
          <button
            className={tab === item ? "active" : ""}
            key={item}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="cam410-lab">
        <article>
          <div className="cam410-stage">
            <span>
              <MousePointer2 />
              Drag to interact
            </span>
            <CameraCanvas
              pose={pose}
              version={viewVersion}
              projection={projection}
              tool={tool}
              onCamera={setCamera}
              onInteraction={onInteraction}
            />
            <div className="cam410-tools">
              <button
                className={tool === "orbit" ? "active" : ""}
                onClick={() => act(() => setTool("orbit"))}
              >
                <Rotate3D />
                Orbit
              </button>
              <button
                className={tool === "pan" ? "active" : ""}
                onClick={() => act(() => setTool("pan"))}
              >
                <Move />
                Pan
              </button>
              <button
                className={tool === "zoom" ? "active" : ""}
                onClick={() => act(() => setTool("zoom"))}
              >
                <Search />
                Zoom
              </button>
              <button onClick={() => applyPose(initialPose)}>
                <Maximize />
                Fit object
              </button>
              <button onClick={() => applyPose(initialPose)}>
                <RotateCcw />
                Reset view
              </button>
            </div>
          </div>
          <footer>
            <span>
              Camera position <b>x {round(camera.x)}</b>
              <b>y {round(camera.y)}</b>
              <b>z {round(camera.z)}</b>
            </span>
            <span>
              Azimuth <strong>{round(camera.azimuth)}°</strong>
            </span>
            <span>
              Elevation <strong>{round(camera.elevation)}°</strong>
            </span>
            <span>
              Field of view <strong>45°</strong>
            </span>
            <span>
              Projection{" "}
              <button
                className={projection === "perspective" ? "active" : ""}
                onClick={() => act(() => setProjection("perspective"))}
              >
                Perspective
              </button>
              <button
                className={projection === "orthographic" ? "active" : ""}
                onClick={() => act(() => setProjection("orthographic"))}
              >
                Orthographic
              </button>
            </span>
          </footer>
          <p className="cam410-note">
            You are moving the <b>camera</b>. The object stays fixed in space.
          </p>
        </article>
        <aside className="cam410-coach">
          <h3>Gesture coach</h3>
          <nav>
            <button
              className={coach === "Mouse" ? "active" : ""}
              onClick={() => act(() => setCoach("Mouse"))}
            >
              Mouse
            </button>
            <button
              className={coach === "Touch" ? "active" : ""}
              onClick={() => act(() => setCoach("Touch"))}
            >
              Touch
            </button>
          </nav>
          {coach === "Mouse" ? (
            <>
              <p>
                <b>Orbit</b>Click + drag <MousePointer2 />
              </p>
              <p>
                <b>Pan</b>Shift + drag <MousePointer2 />
              </p>
              <p>
                <b>Zoom</b>Scroll wheel <MousePointer2 />
              </p>
            </>
          ) : (
            <>
              <p>
                <b>Orbit</b>One-finger drag <Hand />
              </p>
              <p>
                <b>Pan</b>Two-finger drag <Hand />
              </p>
              <p>
                <b>Zoom</b>Pinch <ZoomIn />
              </p>
            </>
          )}
          <p>
            <b>Fit object</b>F <kbd>F</kbd>
          </p>
          <p>
            <b>Reset view</b>R <kbd>R</kbd>
          </p>
          <footer>
            Keyboard controls <Keyboard />
          </footer>
        </aside>
      </section>
      <section className="cam410-guided">
        <h2>
          Guided steps <small>(recommended sequence)</small>
        </h2>
        <div>
          {[
            [
              "Orbit to reveal hidden face",
              "Orbit around the solid to find the hidden face.",
            ],
            ["Pan to center", "Pan so the object is centered in the view."],
            [
              "Zoom without clipping",
              "Zoom in to see details without cutting off any part.",
            ],
            [
              "Check your view",
              "Use different angles and confirm the shape is the same.",
            ],
          ].map(([title, text], index) => (
            <article className={guide === index ? "active" : ""} key={title}>
              <b>{index + 1}</b>
              <h3>{title}</h3>
              <p>{text}</p>
              <MiniSolid pose={guidePose(index)} />
              <button
                onClick={() => {
                  setGuide(index);
                  applyPose(guidePose(index));
                }}
              >
                Start
              </button>
            </article>
          ))}
        </div>
      </section>
      <section className="cam410-before">
        <h2>
          Before / After <small>(same object, different view)</small>
        </h2>
        <div>
          {[initialPose, guidePose(0), guidePose(1), guidePose(3)].map(
            (item, index) => (
              <button
                key={index}
                onClick={() => applyPose(item)}
                aria-label={`Apply camera view ${index + 1}`}
              >
                <MiniSolid pose={item} />
              </button>
            ),
          )}
        </div>
        <p>
          Only the <b>camera</b> moves. The object and its dimensions never
          change.
        </p>
      </section>
      <section className="cam410-reference">
        <article>
          <h2>Camera shortcuts</h2>
          <table>
            <tbody>
              {[
                ["Orbit", "Left drag"],
                ["Pan", "Shift + Left drag"],
                ["Zoom", "Scroll wheel"],
                ["Fit object", "F"],
                ["Reset view", "R"],
                ["Toggle projection", "P"],
                ["Top view", "1"],
                ["Front view", "2"],
                ["Right view", "3"],
              ].map((row) => (
                <tr key={row[0]}>
                  <td>{row[0]}</td>
                  <th>{row[1]}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </article>
        <article>
          <h2>Accessibility keyboard controls</h2>
          {[
            ["← ↓ ↑ →", "Pan"],
            ["+ / −", "Zoom in / out"],
            ["Home", "Fit object"],
            ["R", "Reset view"],
            ["P", "Toggle perspective / orthographic"],
            ["TAB", "Focus next control"],
            ["Enter / Space", "Activate focused control"],
          ].map((row) => (
            <p key={row[0]}>
              <kbd>{row[0]}</kbd>
              <b>{row[1]}</b>
            </p>
          ))}
        </article>
        <article>
          <h2>Projection explained</h2>
          <label className={projection === "perspective" ? "active" : ""}>
            <input
              type="radio"
              checked={projection === "perspective"}
              onChange={() => act(() => setProjection("perspective"))}
            />
            <b>Perspective</b>
            <span>
              Simulates how your eyes see in real life. Objects farther away
              appear smaller.
            </span>
          </label>
          <label className={projection === "orthographic" ? "active" : ""}>
            <input
              type="radio"
              checked={projection === "orthographic"}
              onChange={() => act(() => setProjection("orthographic"))}
            />
            <b>Orthographic</b>
            <span>
              No perspective. Parallel lines remain parallel. Good for
              measurements.
            </span>
          </label>
        </article>
      </section>
      <section className="cam410-challenge">
        <header>
          <h2>Challenge: Match this camera view</h2>
          <p>Use the controls to match the target view on the right.</p>
        </header>
        <article>
          <b>Your view</b>
          <MiniSolid
            pose={{
              position: [camera.x, camera.y, camera.z],
              target: [camera.tx, camera.ty, camera.tz],
            }}
          />
        </article>
        <strong>→</strong>
        <article>
          <b>Target view</b>
          <MiniSolid pose={target} />
        </article>
        <aside>
          <h3>Scoring</h3>
          <p>
            <Check />
            Orientation match <b>{checked ? score.orientation : 0} / 60</b>
          </p>
          <p>
            <Check />
            Centering <b>{checked ? score.centering : 0} / 20</b>
          </p>
          <p>
            <Check />
            Zoom level <b>{checked ? score.zoom : 0} / 20</b>
          </p>
          <hr />
          <p>
            <strong>Total</strong>
            <b>{checked ? score.total : 0} / 100</b>
          </p>
        </aside>
        <button onClick={() => act(() => setChecked(true))}>
          <Focus />
          Check match
        </button>
        <button
          onClick={() =>
            act(() => {
              setTargetSeed((value) => value + 1);
              setChecked(false);
            })
          }
        >
          <RotateCcw />
          Try another target
        </button>
        <footer>Hint: Try orbiting around and adjusting elevation.</footer>
      </section>
      <nav className="cam410-next">
        <a href="/lessons/3d-mathematics/409-transparent-x-ray-mode">
          ←{" "}
          <span>
            Previous<small>Transparent / X-Ray Mode</small>
          </span>
        </a>
        <a href="/lessons/3d-mathematics/411-orthographic-views">
          <span>
            Next<small>Orthographic Views</small>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function CameraCanvas({
  pose,
  version,
  projection,
  tool,
  onCamera,
  onInteraction,
}: {
  pose: Pose;
  version: number;
  projection: Projection;
  tool: Tool;
  onCamera: (value: Telemetry) => void;
  onInteraction: () => void;
}) {
  return (
    <Canvas
      key={projection}
      orthographic={projection === "orthographic"}
      camera={
        projection === "orthographic"
          ? { position: pose.position, zoom: 58, near: 0.1, far: 100 }
          : { position: pose.position, fov: 45, near: 0.1, far: 100 }
      }
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#061b31"]} />
      <ambientLight intensity={1.7} />
      <directionalLight position={[5, 8, 7]} intensity={2} />
      <CameraRig
        pose={pose}
        version={version}
        tool={tool}
        onCamera={onCamera}
        onInteraction={onInteraction}
      />
      <SceneSolid />
      <axesHelper args={[4.7]} />
      <OrbitRing />
    </Canvas>
  );
}
function CameraRig({
  pose,
  version,
  tool,
  onCamera,
  onInteraction,
}: {
  pose: Pose;
  version: number;
  tool: Tool;
  onCamera: (value: Telemetry) => void;
  onInteraction: () => void;
}) {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  useEffect(() => {
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);
    if (camera instanceof OrthographicCamera) camera.zoom = 58;
    if (camera instanceof PerspectiveCamera) camera.fov = 45;
    camera.updateProjectionMatrix();
    if (controls.current) {
      controls.current.target.set(...pose.target);
      controls.current.update();
    }
    onCamera(telemetry(pose.position, pose.target));
  }, [camera, pose, version, onCamera]);
  return (
    <OrbitControls
      ref={controls}
      enableRotate={tool === "orbit"}
      enablePan={tool === "pan"}
      enableZoom={tool === "zoom" || tool === "orbit"}
      mouseButtons={
        tool === "pan"
          ? { LEFT: MOUSE.PAN, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE }
          : { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }
      }
      minDistance={3}
      maxDistance={16}
      onStart={onInteraction}
      onChange={() => {
        const target = controls.current?.target ?? new Vector3();
        onCamera(
          telemetry(
            camera.position.toArray() as [number, number, number],
            target.toArray() as [number, number, number],
          ),
        );
      }}
    />
  );
}
function SceneSolid() {
  const geometry = useMemo(makeSolid, []);
  return (
    <group position={[0, 0.15, 0]}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color="#6954c7"
          side={DoubleSide}
          transparent
          opacity={0.72}
          roughness={0.35}
        />
        <Edges color="#d7f2ff" />
      </mesh>
      <Line
        points={[
          [-2, -1.5, -1.7],
          [1.8, 1.65, 1.5],
        ]}
        color="#79d3e8"
        lineWidth={1}
      />
    </group>
  );
}
function OrbitRing() {
  const points = Array.from({ length: 65 }, (_, i) => {
    const a = (i / 64) * Math.PI * 2;
    return [Math.cos(a) * 4, 0, Math.sin(a) * 4] as [number, number, number];
  });
  return (
    <Line
      points={points}
      color="#66839d"
      dashed
      dashSize={0.12}
      gapSize={0.12}
      lineWidth={0.7}
    />
  );
}
function MiniSolid({ pose }: { pose: Pose }) {
  return (
    <div className="cam410-mini">
      <Canvas orthographic camera={{ position: pose.position, zoom: 12 }}>
        <color attach="background" args={["#092238"]} />
        <ambientLight intensity={2} />
        <directionalLight position={[4, 7, 5]} intensity={2} />
        <MiniRig pose={pose} />
        <SceneSolid />
      </Canvas>
    </div>
  );
}
function MiniRig({ pose }: { pose: Pose }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(...pose.position);
    camera.lookAt(...pose.target);
    camera.updateProjectionMatrix();
  }, [camera, pose]);
  return null;
}
function makeSolid() {
  const vertices = [
    -2, -1.5, -1.7, 1.8, -1.5, -1.3, 1.5, -1.5, 1.5, -1.7, -1.5, 1.2, -1.1,
    1.65, -0.9, 1.1, 1.65, -0.65, 0.7, 0.85, 1.25,
  ];
  const indices = [
    0, 1, 2, 0, 2, 3, 0, 4, 5, 0, 5, 1, 1, 5, 6, 1, 6, 2, 2, 6, 4, 2, 4, 3, 3,
    4, 0, 4, 6, 5,
  ];
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}
function telemetry(
  position: [number, number, number],
  target: [number, number, number],
) {
  const x = position[0] - target[0],
    y = position[1] - target[1],
    z = position[2] - target[2],
    distance = Math.hypot(x, y, z);
  return {
    x: position[0],
    y: position[1],
    z: position[2],
    distance,
    azimuth: ((Math.atan2(x, z) * 180) / Math.PI + 360) % 360,
    elevation: (Math.asin(y / distance) * 180) / Math.PI,
    tx: target[0],
    ty: target[1],
    tz: target[2],
  };
}
function scoreView(current: Telemetry, target: Pose) {
  const expected = telemetry(target.position, target.target);
  const angle =
    Math.abs(((current.azimuth - expected.azimuth + 540) % 360) - 180) +
    Math.abs(current.elevation - expected.elevation);
  const orientation = Math.max(0, Math.round(60 - angle * 1.4));
  const centerError = Math.hypot(
    current.tx - target.target[0],
    current.ty - target.target[1],
    current.tz - target.target[2],
  );
  const centering = Math.max(0, Math.round(20 - centerError * 18));
  const zoom = Math.max(
    0,
    Math.round(20 - Math.abs(current.distance - expected.distance) * 5),
  );
  return {
    orientation,
    centering,
    zoom,
    total: orientation + centering + zoom,
  };
}
function targetFor(seed: number): Pose {
  const poses = [
    targetPose,
    { position: [-5.8, 4.8, 5.2], target: [0, 0.25, 0] },
    { position: [5.5, 2.8, -6.2], target: [0, 0.25, 0] },
  ];
  return poses[seed % poses.length];
}
function guidePose(index: number): Pose {
  return [
    { position: [-5.8, 4.2, 5.4], target: [0, 0.25, 0] },
    { position: [5.4, 3.6, 5.5], target: [0.7, 0.35, 0] },
    { position: [3.8, 2.9, 4], target: [0, 0.25, 0] },
    { position: [6.2, 5.6, -4.7], target: [0, 0.25, 0] },
  ][index];
}
function round(value: number) {
  return Number(value.toFixed(2));
}
