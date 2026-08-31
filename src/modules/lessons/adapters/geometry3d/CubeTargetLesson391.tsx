import { Billboard, Edges, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./CubeTargetLesson391.css";

const initialSide = 4,
  clean = (value: number) => Number(value.toFixed(2));

export default function CubeTargetLesson391({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [side, setSide] = useState(initialSide),
    [faceDiagonal, setFaceDiagonal] = useState(true),
    [spaceDiagonal, setSpaceDiagonal] = useState(true),
    [unfolded, setUnfolded] = useState(false),
    [highlight, setHighlight] = useState("none"),
    [expanded, setExpanded] = useState(false),
    [tab, setTab] = useState("Interaction + visualization"),
    [cameraReset, setCameraReset] = useState(0),
    [shared, setShared] = useState(false),
    [experiment, setExperiment] = useState(false),
    [actions, setActions] = useState(0),
    volume = clean(side ** 3),
    surface = clean(6 * side ** 2),
    face = clean(side * Math.SQRT2),
    space = clean(side * Math.sqrt(3)),
    act = (action: () => void) => {
      action();
      setActions((value) => value + 1);
      onInteraction();
    },
    reset = () => {
      setSide(initialSide);
      setFaceDiagonal(true);
      setSpaceDiagonal(true);
      setUnfolded(false);
      setHighlight("none");
      setExpanded(false);
      setTab("Interaction + visualization");
      setCameraReset((value) => value + 1);
      setShared(false);
      setExperiment(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const changeSide = (value: number) =>
      act(() => {
        setSide(Math.max(1, Math.min(8, clean(value))));
        setExperiment(false);
      }),
    share = () =>
      act(() => {
        void navigator.clipboard?.writeText(
          `Cube a=${side}, V=${volume}, S=${surface}, df=${face}, d=${space}`,
        );
        setShared(true);
      });
  return (
    <section
      className="cs378-page cube391-page"
      data-testid="geometry3d-mockup-0576"
      data-object-model="threejs-dedicated-parametric-cube-side-slider-solid-net-face-space-diagonals-orbit-highlight-exact-volume-surface-euler-validated-experiment"
      data-side={side}
      data-volume={volume}
      data-surface={surface}
      data-face-diagonal={face}
      data-space-diagonal={space}
      data-layers={JSON.stringify([faceDiagonal, spaceDiagonal])}
      data-unfolded={unfolded}
      data-highlight={highlight}
      data-expanded={expanded}
      data-tab={tab}
      data-shared={shared}
      data-experiment={experiment}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Cube</h1>
        <p>Explore regular hexahedra.</p>
        <nav>
          <span>Intermediate–Advanced</span>
          <span>3D Lab</span>
          <span>3D Calculator</span>
          <span>6–10 min</span>
        </nav>
        <div className="cs378-actions">
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={share}>
            <Share2 />
            {shared ? "Shared" : "Share"}
          </button>
          <button
            onClick={() => act(() => setCameraReset((value) => value + 1))}
          >
            <ExternalLink />
            Workspace
          </button>
        </div>
      </header>
      <nav className="cs378-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="cube391-lab">
        <header>
          <h2>Cube - 3D visualization</h2>
          <div>
            <span>● Vertices: 8</span>
            <span>● Edges: 12</span>
            <span>● Faces: 6</span>
            <button
              title="Toggle fullscreen"
              onClick={() => act(() => setExpanded((value) => !value))}
            >
              <Maximize2 />
            </button>
          </div>
        </header>
        <div className="cube391-main">
          <article
            className={`cube391-scene ${expanded ? "expanded" : ""}`}
            data-testid="geometry3d-cube-canvas"
          >
            {expanded && (
              <button
                className="cube391-exit"
                title="Exit fullscreen"
                onClick={() => act(() => setExpanded(false))}
              >
                <Maximize2 />
              </button>
            )}
            <Canvas camera={{ position: [7, 6, 8], fov: 42 }} dpr={[1, 1.5]}>
              <color attach="background" args={["#06172b"]} />
              <ambientLight intensity={1.8} />
              <directionalLight position={[6, 9, 7]} intensity={2.3} />
              <CubeScene
                side={side}
                faceDiagonal={faceDiagonal}
                spaceDiagonal={spaceDiagonal}
                unfolded={unfolded}
                highlight={highlight}
                cameraReset={cameraReset}
                onHighlight={(value) => act(() => setHighlight(value))}
              />
            </Canvas>
            <p>
              Drag to rotate <i>·</i> Scroll to zoom <i>·</i> Click a feature to
              highlight
            </p>
          </article>
          <aside className="cube391-side">
            <section className="cube391-controls">
              <h2>
                Side length <i>a</i>
              </h2>
              <input
                aria-label="Side length slider"
                type="range"
                min="1"
                max="8"
                step=".5"
                value={side}
                onChange={(event) => changeSide(Number(event.target.value))}
              />
              <input
                aria-label="Side length"
                type="number"
                min="1"
                max="8"
                step=".5"
                value={side}
                onChange={(event) => changeSide(Number(event.target.value))}
              />
              <Toggle
                label="Show face diagonal (dᶠ)"
                checked={faceDiagonal}
                onChange={() => act(() => setFaceDiagonal((value) => !value))}
              />
              <Toggle
                label="Show space diagonal (d)"
                checked={spaceDiagonal}
                onChange={() => act(() => setSpaceDiagonal((value) => !value))}
              />
              <Toggle
                label="Unfold net"
                checked={unfolded}
                onChange={() => act(() => setUnfolded((value) => !value))}
              />
            </section>
            <section className="cube391-results">
              <h2>Live results</h2>
              <p>
                <span>Volume</span>
                <b>V = a³ = {volume}</b>
              </p>
              <p>
                <span>Surface area</span>
                <b>S = 6a² = {surface}</b>
              </p>
              <p>
                <span>Face diagonal</span>
                <b>
                  dᶠ = a√2
                  <br />= {side}√2 ≈ {face}
                </b>
              </p>
              <p>
                <span>Space diagonal</span>
                <b>
                  d = a√3
                  <br />= {side}√3 ≈ {space}
                </b>
              </p>
              <p>
                <span>Euler's formula</span>
                <b>
                  V − E + F = 2<br />8 − 12 + 6 = 2
                </b>
              </p>
            </section>
          </aside>
        </div>
        <section className="cube391-info">
          <article>
            <div>♧</div>
            <h2>Key idea</h2>
            <p>
              All faces are congruent squares
              <br />
              and all edges have equal length.
            </p>
            <span>▱</span>
          </article>
          <article>
            <h2>What makes a cube special?</h2>
            <p>
              ✓ 6 faces, all congruent squares
              <br />
              ✓ 12 edges, all equal in length (a)
              <br />
              ✓ 8 vertices where three edges meet
              <br />✓ Highest symmetry among hexahedra
            </p>
          </article>
        </section>
        <section className="cube391-try">
          <h2>◎ Try it yourself</h2>
          <p>
            If <i>a</i> = 5,
            <br />
            what are V and S?
          </p>
          <strong>
            V = 5³ = 125
            <br />S = 6 × 5² = 150
          </strong>
          <button
            onClick={() =>
              act(() => {
                setSide(5);
                setExperiment(true);
              })
            }
          >
            {experiment ? "Applied a = 5" : "Change a to 5　→"}
          </button>
        </section>
        <nav className="cs378-nav">
          <a href="/lessons/3d-mathematics/390-3d-vectors">
            ←{" "}
            <span>
              <small>PREVIOUS</small>3D Vectors
            </span>
          </a>
          <a href="/lessons/3d-mathematics/392-cuboid">
            <span>
              <small>NEXT</small>Cuboid
            </span>{" "}
            →
          </a>
        </nav>
      </section>
    </section>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="cube391-toggle">
      {label}
      <input
        aria-label={label}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}

function CubeScene({
  side,
  faceDiagonal,
  spaceDiagonal,
  unfolded,
  highlight,
  cameraReset,
  onHighlight,
}: {
  side: number;
  faceDiagonal: boolean;
  spaceDiagonal: boolean;
  unfolded: boolean;
  highlight: string;
  cameraReset: number;
  onHighlight: (value: string) => void;
}) {
  const scale = side / 2;
  return (
    <>
      <OrbitControls
        key={cameraReset}
        makeDefault
        target={[0, 0, 0]}
        minDistance={6}
        maxDistance={20}
      />
      {unfolded ? (
        <CubeNet
          scale={scale}
          onHighlight={onHighlight}
          highlight={highlight}
        />
      ) : (
        <group scale={scale}>
          <mesh
            onClick={() => onHighlight(highlight === "face" ? "none" : "face")}
          >
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial
              color={highlight === "face" ? "#7ce9f3" : "#159ab5"}
              transparent
              opacity={0.34}
            />
            <Edges color="#5de7f5" lineWidth={2} />
          </mesh>
          {faceDiagonal && (
            <>
              <Line
                points={[
                  [-1, -1, 1],
                  [1, 1, 1],
                ]}
                color="#eaa2ff"
                dashed
                lineWidth={3}
              />
              <Billboard position={[1.25, 0.45, 1]}>
                <Text fontSize={0.18} color="#eaa2ff">
                  dᶠ = {side}√2 ≈ {clean(side * Math.SQRT2)}
                </Text>
              </Billboard>
            </>
          )}
          {spaceDiagonal && (
            <>
              <Line
                points={[
                  [-1, -1, -1],
                  [1, 1, 1],
                ]}
                color="#fff"
                dashed
                lineWidth={3}
              />
              <Billboard position={[-0.9, 0.05, 0]}>
                <Text fontSize={0.18} color="#fff">
                  d = {side}√3 ≈ {clean(side * Math.sqrt(3))}
                </Text>
              </Billboard>
            </>
          )}
          <Axis />
        </group>
      )}
    </>
  );
}

function CubeNet({
  scale,
  onHighlight,
  highlight,
}: {
  scale: number;
  onHighlight: (value: string) => void;
  highlight: string;
}) {
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} scale={scale * 0.65}>
      {[
        [0, 0],
        [2.05, 0],
        [-2.05, 0],
        [0, 2.05],
        [0, -2.05],
        [0, -4.1],
      ].map(([x, y], index) => (
        <mesh
          key={index}
          position={[x, y, 0]}
          onClick={() => onHighlight(`net-${index}`)}
        >
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial
            color={
              highlight === `net-${index}`
                ? "#8bf0f5"
                : index % 2
                  ? "#31b6cd"
                  : "#168ba7"
            }
            transparent
            opacity={0.75}
          />
          <Edges color="#bff8ff" lineWidth={2} />
        </mesh>
      ))}
    </group>
  );
}

function Axis() {
  return (
    <>
      <Line
        points={[
          [-1.35, -1, -1],
          [1.45, -1, -1],
        ]}
        color="#ef5148"
        lineWidth={2}
      />
      <Line
        points={[
          [-1, -1.35, -1],
          [-1, 1.45, -1],
        ]}
        color="#35aef2"
        lineWidth={2}
      />
      <Line
        points={[
          [-1, -1, -1.35],
          [-1, -1, 1.45],
        ]}
        color="#38d36d"
        lineWidth={2}
      />
    </>
  );
}
