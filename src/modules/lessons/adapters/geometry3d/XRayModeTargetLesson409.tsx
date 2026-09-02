import { Edges, Line, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  CheckCircle2,
  ExternalLink,
  Lightbulb,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DoubleSide } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./XRayModeTargetLesson409.css";

type Mode = "opaque" | "transparent" | "xray";
type Layer =
  "outer" | "cavity" | "sphere" | "space" | "plane" | "base" | "center";
type Hidden = "show" | "faint" | "hide";
const layerLabels: Record<Layer, string> = {
    outer: "Outer prism",
    cavity: "Cylindrical cavity",
    sphere: "Inscribed sphere",
    space: "Space diagonals",
    plane: "Cross-section plane",
    base: "Base diagonals",
    center: "Center lines",
  },
  allLayers = Object.keys(layerLabels) as Layer[];
export default function XRayModeTargetLesson409({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [opacity, setOpacity] = useState(100),
    [layers, setLayers] = useState<Layer[]>(allLayers),
    [hidden, setHidden] = useState<Hidden>("show"),
    [tab, setTab] = useState("Explore"),
    [challengeMode, setChallengeMode] = useState<Mode>("opaque"),
    [solution, setSolution] = useState(false),
    [length, setLength] = useState(false),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0);
  const act = (fn: () => void) => {
      fn();
      setActions((v) => v + 1);
      onInteraction();
    },
    reset = () => {
      setOpacity(100);
      setLayers(allLayers);
      setHidden("show");
      setTab("Explore");
      setChallengeMode("opaque");
      setSolution(false);
      setLength(false);
      setShared(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const toggle = (layer: Layer) =>
    act(() =>
      setLayers((current) =>
        current.includes(layer)
          ? current.filter((item) => item !== layer)
          : [...current, layer],
      ),
    );
  return (
    <section
      className="cs378-page xr409-page"
      data-testid="geometry3d-mockup-0594"
      data-object-model="threejs-dedicated-synchronized-composite-solid-opacity-depth-xray-layers-measurements-challenge"
      data-direct-interaction="true"
      data-opacity={opacity}
      data-layers={layers.length}
      data-hidden={hidden}
      data-tab={tab}
      data-challenge-mode={challengeMode}
      data-solution={solution}
      data-length={length}
      data-space-diagonal={round(Math.sqrt(125))}
      data-body-diagonal={round(Math.sqrt(61))}
      data-face-diagonal={round(Math.sqrt(89))}
      data-cylinder-height="6"
      data-sphere-diameter="5"
      data-cross-area="24"
      data-shared={shared}
      data-actions={actions}
    >
      <header className="xr409-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <small>3D GEOMETRY AND SOLIDS</small>
          <h1>Transparent / X-Ray Mode</h1>
          <p>Inspect hidden structure inside composite solids.</p>
          <div className="xr409-badges">
            <span>Intermediate–Advanced</span>
            <span>3D Lab</span>
            <span>3D Calculator</span>
            <span>6–10 min</span>
          </div>
          <nav>
            <select aria-label="Language">
              <option>English (English)</option>
            </select>
            <button onClick={reset}>
              <RotateCcw />
              Reset
            </button>
            <button
              onClick={() =>
                act(() => {
                  setShared(true);
                  void navigator.clipboard?.writeText(
                    "Space diagonal AG = sqrt(125) = 11.18 units",
                  );
                })
              }
            >
              <Share2 />
              {shared ? "Shared" : "Share"}
            </button>
            <a href="/workspace">
              <ExternalLink />
              Workspace
            </a>
          </nav>
        </div>
        <aside>
          <Lightbulb />
          <h3>Learning goal</h3>
          <p>
            Reveal and study hidden edges, interior diagonals, inscribed
            spheres, cross-sections and occluded measurements using various
            rendering modes.
          </p>
        </aside>
      </header>
      <nav className="xr409-tabs">
        {[
          "Explore",
          "What becomes visible?",
          "How it works",
          "When to use",
          "Challenge",
          "Notes",
        ].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => act(() => setTab(item))}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="xr409-explore">
        <header>
          <small>EXPLORE THE MODEL</small>
          <h2>Composite solid</h2>
          <p>
            Rectangular prism with a cylindrical cavity, inscribed sphere, and
            an internal diagonal.
          </p>
          <label>
            Opacity
            <input
              aria-label="Opacity"
              type="range"
              min="5"
              max="100"
              value={opacity}
              onChange={(e) => act(() => setOpacity(Number(e.target.value)))}
            />
            <output>{opacity}%</output>
          </label>
        </header>
        <article>
          <ModeView
            mode="opaque"
            opacity={opacity}
            layers={layers}
            hidden={hidden}
          />
          <ModeView
            mode="transparent"
            opacity={opacity}
            layers={layers}
            hidden={hidden}
          />
          <ModeView
            mode="xray"
            opacity={opacity}
            layers={layers}
            hidden={hidden}
          />
          <footer>
            <b>Hidden edges</b>
            {(["show", "faint", "hide"] as Hidden[]).map((item) => (
              <label key={item}>
                <input
                  type="radio"
                  name="hidden"
                  checked={hidden === item}
                  onChange={() => act(() => setHidden(item))}
                />
                {cap(item)}
              </label>
            ))}
          </footer>
        </article>
        <aside>
          <h3>Layers & Structure</h3>
          {allLayers.map((layer) => (
            <label key={layer}>
              <input
                aria-label={layerLabels[layer]}
                type="checkbox"
                checked={layers.includes(layer)}
                onChange={() => toggle(layer)}
              />
              {layerLabels[layer]}
            </label>
          ))}
          <hr />
          <h3>Color legend (depth-aware)</h3>
          {allLayers.map((layer) => (
            <span key={layer} className={layer}>
              {layerLabels[layer]}
            </span>
          ))}
          <p>
            Depth-aware colors help front elements appear brighter and occlude
            back elements naturally.
          </p>
        </aside>
      </section>
      <section className="xr409-visible">
        <small>WHAT BECOMES VISIBLE?</small>
        <h3>Compare what you can see in each mode.</h3>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Opaque</th>
              <th>Transparent</th>
              <th>X-Ray</th>
              <th>Why it matters</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Hidden edges</td>
              <td>
                Not visible
                <br />
                Dashed (when shown)
              </td>
              <td>Faint dashed</td>
              <td>Clear dashed</td>
              <td>Reveals shape behind surfaces.</td>
            </tr>
            <tr>
              <td>Cylindrical cavity</td>
              <td>Only top opening</td>
              <td>Cavity walls visible</td>
              <td>Full cavity visible</td>
              <td>Understand internal cutouts and volumes.</td>
            </tr>
            <tr>
              <td>Inscribed sphere</td>
              <td>Hidden</td>
              <td>Sphere visible</td>
              <td>Sphere and tangency lines visible</td>
              <td>Study inscribed/tangent relationships.</td>
            </tr>
            <tr>
              <td>Space diagonal</td>
              <td>Not visible</td>
              <td>Faint through material</td>
              <td>Full diagonal visible (A to G)</td>
              <td>Crucial for 3D distance problems.</td>
            </tr>
            <tr>
              <td>Cross-section plane</td>
              <td>Not visible</td>
              <td>Plane visible, intersection shows</td>
              <td>Plane + intersections visible everywhere</td>
              <td>Understand slicing, areas, and sections.</td>
            </tr>
            <tr>
              <td>Occluded measurements</td>
              <td>Only external dimensions</td>
              <td>Some internal dimensions</td>
              <td>All key measurements visible</td>
              <td>Improves accuracy in calculations.</td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="xr409-guides">
        <article>
          <small>HOW IT WORKS</small>
          <h3>Depth-aware rendering pipeline</h3>
          <div>
            {["Scene graph", "Depth sorting", "Transparency", "X-Ray pass"].map(
              (item, i) => (
                <span key={item}>
                  <b>{i + 1}</b>
                  {item}
                  <small>
                    {
                      [
                        "Model parts and their hierarchy.",
                        "Front surfaces drawn first.",
                        "Blend with adjustable opacity.",
                        "Show all geometry with depth cues.",
                      ][i]
                    }
                  </small>
                </span>
              ),
            )}
          </div>
          <footer>
            Opacity controls surface transparency. X-Ray mode ignores occlusion
            to reveal all geometry.
          </footer>
        </article>
        <article>
          <small>WHEN TO USE</small>
          <h3>Hidden edges and interior structure</h3>
          <div>
            <WireCube dashed />
            <p>
              <b>Use dashed hidden edges when:</b>
              <br />✓ An edge exists but is not visible.
              <br />✓ It is behind a surface.
              <br />✓ It helps understand the 3D shape.
            </p>
          </div>
          <div>
            <WireCube />
            <p>
              <b>Use solid lines for:</b>
              <br />✓ Visible edges and boundaries.
              <br />✓ Intersection lines on the surface.
              <br />✓ Edges after a cut (cross-section).
            </p>
          </div>
          <footer>
            Dashed = exists but hidden. Solid = visible or in the cut.
          </footer>
        </article>
      </section>
      <section className="xr409-challenge">
        <small>CHALLENGE</small>
        <h3>Reveal the hidden diagonal</h3>
        <p>Show the space diagonal from A to G using different modes.</p>
        <article>
          <b>Your task</b>
          <p>
            1. Start in Opaque mode.
            <br />
            2. Switch to Transparent.
            <br />
            3. Reveal it fully in X-Ray.
            <br />
            4. Measure its length.
          </p>
          <button onClick={() => act(() => setSolution((v) => !v))}>
            {solution ? "Hide solution" : "Check solution"}
          </button>
        </article>
        {(["opaque", "transparent", "xray"] as Mode[]).map((mode) => (
          <button
            key={mode}
            className={challengeMode === mode ? "active" : ""}
            onClick={() => act(() => setChallengeMode(mode))}
          >
            <b>{modeLabel(mode)}</b>
            <MiniChallenge mode={mode} />
          </button>
        ))}
        <aside>
          <Lightbulb />
          <b>Hint</b>
          <p>The space diagonal connects opposite vertices.</p>
          <button onClick={() => act(() => setLength(true))}>
            Show length
          </button>
          {length && (
            <strong>
              Length AG = √125
              <br />≈ 11.18 units
            </strong>
          )}
        </aside>
        {solution && (
          <footer>
            <CheckCircle2 />
            Use X-Ray mode: AG = √(8² + 5² + 6²) = √125.
          </footer>
        )}
      </section>
      <section className="xr409-measures">
        <small>MEASUREMENTS (X-RAY MODE)</small>
        <h3>Key lengths and distances</h3>
        <div>
          {[
            ["Space diagonal AG", "√125", "≈ 11.18"],
            ["Body diagonal EG", "√61", "≈ 7.81"],
            ["Face diagonal AC", "√89", "≈ 9.43"],
            ["Cylinder height", "6", "units"],
            ["Sphere diameter", "5", "units"],
            ["Cross-section area", "24", "square units"],
          ].map(([a, b, c]) => (
            <span key={a}>
              {a}
              <b>{b}</b>
              <small>{c}</small>
            </span>
          ))}
        </div>
        <footer>
          Use Transparent mode for exploration and intuition. Use X-Ray mode to
          analyze, measure and prove.
        </footer>
      </section>
      <nav className="xr409-next">
        <a href="/lessons/3d-mathematics/408-euler-s-polyhedron-formula">
          ←{" "}
          <span>
            Previous<small>Euler's Polyhedron Formula</small>
          </span>
        </a>
        <a href="/lessons/3d-mathematics/410-camera-controls">
          <span>
            Next<small>Camera Controls</small>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function ModeView({
  mode,
  opacity,
  layers,
  hidden,
}: {
  mode: Mode;
  opacity: number;
  layers: Layer[];
  hidden: Hidden;
}) {
  return (
    <section className={`xr409-mode ${mode}`}>
      <h3>{modeLabel(mode)}</h3>
      <p>
        {mode === "opaque"
          ? "Surfaces only"
          : mode === "transparent"
            ? "See through surfaces"
            : "Reveal everything"}
      </p>
      <Canvas
        data-testid={`geometry3d-xray-${mode}-canvas`}
        aria-label={`Drag ${mode} model to rotate`}
        camera={{ position: [5, 4, 6], fov: 42 }}
        gl={{ antialias: true, preserveDrawingBuffer: true }}
      >
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={1.6} />
        <directionalLight position={[5, 7, 6]} intensity={2} />
        <Composite
          mode={mode}
          opacity={opacity}
          layers={layers}
          hidden={hidden}
        />
        <OrbitControls makeDefault enablePan={false} enableZoom={false} />
      </Canvas>
      {mode === "opaque" && (
        <div className="xr409-dims">
          <b>6</b>
          <b>8</b>
          <b>5</b>
        </div>
      )}
    </section>
  );
}
function Composite({
  mode,
  opacity,
  layers,
  hidden,
}: {
  mode: Mode;
  opacity: number;
  layers: Layer[];
  hidden: Hidden;
}) {
  const visible = mode !== "opaque",
    alpha =
      mode === "opaque"
        ? 0.72
        : mode === "transparent"
          ? Math.min(0.42, opacity / 240)
          : Math.max(0.03, opacity / 800),
    lineOpacity = hidden === "hide" ? 0 : hidden === "faint" ? 0.25 : 1;
  return (
    <group scale={0.65}>
      {layers.includes("outer") && (
        <mesh>
          <boxGeometry args={[4, 3, 2.5]} />
          <meshStandardMaterial
            color={mode === "opaque" ? "#6b7180" : "#75dce6"}
            transparent
            opacity={alpha}
            depthWrite={mode === "opaque"}
          />
          <Edges color="#357a9b" />
        </mesh>
      )}
      {layers.includes("cavity") && (
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.62, 0.62, 3.4, 40, 1, true]} />
          <meshStandardMaterial
            color="#30c6d3"
            transparent
            opacity={visible ? 0.35 : 0.1}
            side={DoubleSide}
          />
        </mesh>
      )}
      {layers.includes("sphere") && visible && (
        <mesh>
          <sphereGeometry args={[1.05, 40, 28]} />
          <meshStandardMaterial
            color="#8f61db"
            transparent
            opacity={mode === "xray" ? 0.34 : 0.26}
          />
          <Edges color="#b985ec" />
        </mesh>
      )}
      {layers.includes("space") && visible && (
        <Line
          points={[
            [-2, -1.5, -1.25],
            [2, 1.5, 1.25],
          ]}
          color="#f05b40"
          lineWidth={3}
        />
      )}{" "}
      {layers.includes("plane") && visible && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.8, 3.2]} />
          <meshBasicMaterial
            color="#7359d9"
            transparent
            opacity={0.25}
            side={DoubleSide}
          />
        </mesh>
      )}
      {layers.includes("base") && visible && (
        <>
          <Line
            points={[
              [-2, -1.5, -1.25],
              [2, -1.5, 1.25],
            ]}
            color="#61be4d"
            lineWidth={1.5}
          />
          <Line
            points={[
              [2, -1.5, -1.25],
              [-2, -1.5, 1.25],
            ]}
            color="#61be4d"
            lineWidth={1.5}
          />
        </>
      )}
      {layers.includes("center") && (
        <Line
          points={[
            [0, -1.5, 0],
            [0, 1.5, 0],
          ]}
          color="#7a7f8d"
          lineWidth={1}
          transparent
          opacity={lineOpacity}
        />
      )}
    </group>
  );
}
function MiniChallenge({ mode }: { mode: Mode }) {
  return (
    <Canvas camera={{ position: [4, 3.5, 5], fov: 42 }}>
      <ambientLight intensity={2} />
      <directionalLight position={[4, 6, 5]} intensity={2} />
      <Composite
        mode={mode}
        opacity={45}
        layers={["outer", "space", "center"]}
        hidden="show"
      />
      <OrbitControls autoRotate enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
function WireCube({ dashed = false }: { dashed?: boolean }) {
  return (
    <span className={`xr409-wire ${dashed ? "dashed" : ""}`}>
      <i />
      <i />
      <i />
    </span>
  );
}
const cap = (v: string) => v[0].toUpperCase() + v.slice(1),
  modeLabel = (mode: Mode) => (mode === "xray" ? "X-Ray" : cap(mode)),
  round = (v: number) => Math.round(v * 100) / 100;
