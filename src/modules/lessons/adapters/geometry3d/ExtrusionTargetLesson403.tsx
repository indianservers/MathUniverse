import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Box,
  CheckCircle2,
  Circle,
  Eraser,
  LassoSelect,
  Maximize2,
  MousePointer2,
  Redo2,
  Rotate3D,
  RotateCcw,
  Share2,
  Triangle,
  Undo2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ExtrudeGeometry, Shape } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./ExtrusionTargetLesson403.css";

type Profile = "triangle" | "circle" | "lshape";
type Path = "straight" | "oblique";

const profiles = {
  triangle: { label: "Triangle", area: 6, perimeter: 6 },
  circle: { label: "Circle", area: Math.PI * 4, perimeter: Math.PI * 4 },
  lshape: { label: "L-shape", area: 7, perimeter: 12 },
} satisfies Record<Profile, { label: string; area: number; perimeter: number }>;

export default function ExtrusionTargetLesson403({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [profile, setProfile] = useState<Profile>("triangle");
  const [depth, setDepth] = useState(8);
  const [path, setPath] = useState<Path>("straight");
  const [invariant, setInvariant] = useState(true);
  const [cameraReset, setCameraReset] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [tab, setTab] = useState("Explore");
  const [shared, setShared] = useState(false);
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [depthHistory, setDepthHistory] = useState([8]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [tool, setTool] = useState<"select" | "profile">("profile");
  const [actions, setActions] = useState(0);
  const data = profiles[profile];
  const taperFactor = invariant ? 1 : 1 - 0.35 + 0.35 ** 2 / 3;
  const volume = data.area * depth * taperFactor;
  const lateralArea = data.perimeter * depth * (invariant ? 1 : 0.825);
  const correct = checked && Math.abs(volume - 60) < 0.51;

  const act = (fn: () => void) => {
    fn();
    setChecked(false);
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setProfile("triangle");
    setDepth(8);
    setPath("straight");
    setInvariant(true);
    setCameraReset((value) => value + 1);
    setZoom(1);
    setTab("Explore");
    setShared(false);
    setChecked(false);
    setHint(false);
    setLanguageOpen(false);
    setFullscreen(false);
    setDepthHistory([8]);
    setHistoryIndex(0);
    setTool("profile");
    setActions(0);
  };
  useEffect(reset, [resetToken]);

  const chooseProfile = (next: Profile) => act(() => setProfile(next));
  const setSweepDepth = (next: number) =>
    act(() => {
      const value = clamp(next, 0, 20);
      setDepth(value);
      setDepthHistory((history) => [
        ...history.slice(0, historyIndex + 1),
        value,
      ]);
      setHistoryIndex((index) => index + 1);
    });
  const moveHistory = (direction: -1 | 1) => {
    const next = clamp(historyIndex + direction, 0, depthHistory.length - 1);
    if (next === historyIndex) return;
    act(() => {
      setHistoryIndex(next);
      setDepth(depthHistory[next]);
    });
  };

  return (
    <section
      className="cs378-page ext403-page"
      data-testid="geometry3d-mockup-0588"
      data-object-model="threejs-dedicated-extrusion-profile-sweep-depth-oblique-straight-cross-section-volume-lateral-area-orbit-zoom-graded-target"
      data-direct-interaction="true"
      data-profile={profile}
      data-depth={depth}
      data-path={path}
      data-invariant={invariant}
      data-profile-area={round(data.area)}
      data-profile-perimeter={round(data.perimeter)}
      data-volume={round(volume)}
      data-lateral-area={round(lateralArea)}
      data-checked={checked}
      data-correct={correct}
      data-actions={actions}
      data-fullscreen={fullscreen}
      data-tool={tool}
    >
      <header className="ext403-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <small>GEOMETRY AND SOLIDS</small>
          <h1>Extrusion</h1>
          <p>Sweep a 2D profile along a path to create a 3D solid.</p>
          <div className="ext403-badges">
            <span>Intermediate-Advanced</span>
            <span>3D Lab</span>
            <span>3D Calculator</span>
            <span>10-15 min</span>
          </div>
        </div>
        <nav>
          <button onClick={reset}>
            <RotateCcw size={14} /> Reset
          </button>
          <button
            onClick={() =>
              act(() => {
                setShared(true);
                void navigator.clipboard?.writeText(
                  `Extrusion: V = ${fmt(volume)} cubic units`,
                );
              })
            }
          >
            <Share2 size={14} /> {shared ? "Shared" : "Share"}
          </button>
        </nav>
      </header>

      <div className="ext403-actions">
        <button onClick={() => setLanguageOpen((value) => !value)}>
          English (English) <span>⌄</span>
        </button>
        {languageOpen && <aside>English is selected</aside>}
      </div>

      <nav className="ext403-tabs">
        {["Explore", "Explain", "Examples", "Formulas", "Challenges"].map(
          (item) => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => act(() => setTab(item))}
            >
              {item}
            </button>
          ),
        )}
      </nav>

      <section className="ext403-builder">
        <header>
          <div>
            <h2>Build by Extrusion</h2>
            <p>
              Draw or select a 2D profile, then drag the depth handle to
              extrude.
            </p>
          </div>
          <fieldset>
            <button
              className={path === "straight" ? "active" : ""}
              onClick={() => act(() => setPath("straight"))}
            >
              Straight
            </button>
            <button
              className={path === "oblique" ? "active" : ""}
              onClick={() => act(() => setPath("oblique"))}
            >
              Oblique
            </button>
          </fieldset>
          <label>
            Cross-section invariant{" "}
            <input
              aria-label="Cross-section invariant"
              type="checkbox"
              checked={invariant}
              onChange={() => act(() => setInvariant((value) => !value))}
            />
          </label>
        </header>

        <div className="ext403-stages">
          <article className="ext403-profile-stage">
            <h3>
              <i>1</i> 2D profile
            </h3>
            <p>Draw or select a profile.</p>
            <div className="ext403-profile-tools">
              <button
                title="Select profile"
                className={tool === "select" ? "active" : ""}
                onClick={() => act(() => setTool("select"))}
              >
                <MousePointer2 size={15} />
                Select
              </button>
              <button
                className={profile === "triangle" ? "active" : ""}
                onClick={() => {
                  setTool("profile");
                  chooseProfile("triangle");
                }}
              >
                <Triangle size={16} />
                Triangle
              </button>
              <button
                className={profile === "circle" ? "active" : ""}
                onClick={() => chooseProfile("circle")}
              >
                <Circle size={16} />
                Circle
              </button>
              <button
                className={profile === "lshape" ? "active" : ""}
                onClick={() => chooseProfile("lshape")}
              >
                <LassoSelect size={16} />
                L-shape
              </button>
            </div>
            <ProfilePlot profile={profile} area={data.area} />
            <nav className="ext403-edit-buttons">
              <button
                title="Undo depth change"
                disabled={historyIndex === 0}
                onClick={() => moveHistory(-1)}
              >
                <Undo2 size={13} />
              </button>
              <button
                title="Redo depth change"
                disabled={historyIndex >= depthHistory.length - 1}
                onClick={() => moveHistory(1)}
              >
                <Redo2 size={13} />
              </button>
              <button onClick={() => chooseProfile("triangle")}>
                <Eraser size={13} />
                Clear
              </button>
            </nav>
          </article>

          <article className="ext403-sweep-stage">
            <h3>
              <i>2</i> Extrusion depth
            </h3>
            <p>Drag to set how far the profile is swept.</p>
            <SweepDiagram
              profile={profile}
              depth={depth}
              path={path}
              invariant={invariant}
            />
            <label className="ext403-depth">
              <span>0</span>
              <input
                aria-label="Extrusion depth"
                type="range"
                min="0"
                max="20"
                step="1"
                value={depth}
                onChange={(event) => setSweepDepth(Number(event.target.value))}
              />
              <output>{depth}</output>
              <span>20</span>
            </label>
          </article>

          <article className="ext403-solid-stage">
            <h3>
              <i>3</i> Resulting solid
            </h3>
            <p>Rotate to explore the solid.</p>
            <div
              className={`ext403-scene ${fullscreen ? "expanded" : ""}`}
              aria-label="Drag solid to rotate"
            >
              <Canvas
                key={`${cameraReset}-${zoom}`}
                data-testid="geometry3d-extrusion-canvas"
                camera={{ position: [7 / zoom, 5 / zoom, 9 / zoom], fov: 38 }}
                gl={{ antialias: true, preserveDrawingBuffer: true }}
              >
                <color attach="background" args={["#fbfdff"]} />
                <ambientLight intensity={1.7} />
                <directionalLight position={[5, 8, 7]} intensity={2.5} />
                <ExtrusionSolid
                  profile={profile}
                  depth={depth}
                  path={path}
                  invariant={invariant}
                />
                <gridHelper
                  args={[11, 11, "#dce6f2", "#edf2f8"]}
                  position={[0, -2.2, 0]}
                />
                <axesHelper args={[4.5]} />
                <OrbitControls makeDefault enablePan enableZoom />
              </Canvas>
              <nav>
                <button
                  title="Reset view"
                  onClick={() => act(() => setCameraReset((v) => v + 1))}
                >
                  <Rotate3D size={15} />
                </button>
                <button title="Fit solid" onClick={() => act(() => setZoom(1))}>
                  <Box size={15} />
                </button>
                <button
                  title="Zoom out"
                  onClick={() =>
                    act(() => setZoom(Math.max(0.65, zoom - 0.15)))
                  }
                >
                  <ZoomOut size={15} />
                </button>
                <button
                  title="Zoom in"
                  onClick={() => act(() => setZoom(Math.min(1.6, zoom + 0.15)))}
                >
                  <ZoomIn size={15} />
                </button>
                <button
                  title={fullscreen ? "Exit full screen" : "Full screen"}
                  onClick={() => act(() => setFullscreen((value) => !value))}
                >
                  <Maximize2 size={15} />
                </button>
              </nav>
            </div>
          </article>
        </div>
      </section>

      <section className="ext403-formulas">
        <article className="ext403-cross">
          <h3>Cross-section</h3>
          <p>
            Any slice perpendicular to the sweep path matches the original
            profile.
          </p>
          <CrossSectionGraphic profile={profile} />
        </article>
        <article>
          <h3>Synchronized formulas</h3>
          <p>The volume and lateral area update in real time.</p>
          <div>
            <span>Volume</span>
            <b>
              V = A<sub>profile</sub> × depth
            </b>
            <strong>
              {fmt(volume)}
              <small>cubic units</small>
            </strong>
          </div>
          <div>
            <span>Lateral area</span>
            <b>
              S.A.<sub>lateral</sub> = P<sub>profile</sub> × depth
            </b>
            <strong>
              {fmt(lateralArea)}
              <small>square units</small>
            </strong>
          </div>
        </article>
        <article className="ext403-summary">
          <p>
            <i /> A<sub>profile</sub>
            <b>{fmt(data.area)}</b>
            <span>sq units</span>
          </p>
          <p>
            <i /> P<sub>profile</sub>
            <b>{fmt(data.perimeter)}</b>
            <span>units</span>
          </p>
          <p>
            <i /> Depth<b>{depth}</b>
            <span>units</span>
          </p>
          <hr />
          <strong>
            V = A × d <b>{fmt(volume)}</b>
            <small>cubic units</small>
          </strong>
          <strong>
            S.A. = P × d <b>{fmt(lateralArea)}</b>
            <small>square units</small>
          </strong>
        </article>
      </section>

      <section className="ext403-practice">
        <article>
          <h2>Worked example</h2>
          <p>Triangle profile → depth 8</p>
          <div className="ext403-worked">
            <ProfilePlot profile="triangle" area={6} />
            <span>
              <b>Step 1</b>Find profile area
              <br />
              <strong>A = ½ × 4 × 3 = 6</strong>
            </span>
            <span>
              <b>Step 2</b>Set depth
              <br />
              <strong>d = 8 units</strong>
            </span>
            <span>
              <b>Step 3</b>Compute volume
              <br />
              <strong>
                V = 6 × 8<br />
                <em>V = 48</em>
              </strong>
            </span>
          </div>
        </article>
        <article className="ext403-challenge">
          <h2>Your challenge</h2>
          <p>Create a solid with volume 60.</p>
          <div>
            <span>Target volume</span>
            <strong>
              60<small>cubic units</small>
            </strong>
            <p>Adjust your profile or depth to hit the target.</p>
            <button
              onClick={() => {
                setChecked(true);
                onInteraction();
              }}
            >
              <CheckCircle2 size={14} /> Check my answer
            </button>
            {checked && (
              <b className={correct ? "correct" : "wrong"}>
                {correct
                  ? "Correct: volume is 60."
                  : `Current volume is ${fmt(volume)}.`}
              </b>
            )}
            <button className="hint" onClick={() => setHint((v) => !v)}>
              Need a hint?
            </button>
            {hint && <small>With the triangle, set depth to 10.</small>}
          </div>
        </article>
      </section>

      <section className="ext403-footer-info">
        <article>
          <h3>Try different profiles</h3>
          <p>Select a profile to get started.</p>
          <nav>
            {(Object.keys(profiles) as Profile[]).map((key) => (
              <button
                key={key}
                className={profile === key ? "active" : ""}
                onClick={() => chooseProfile(key)}
              >
                {key === "triangle" ? (
                  <Triangle size={16} />
                ) : key === "circle" ? (
                  <Circle size={16} />
                ) : (
                  <LassoSelect size={16} />
                )}
                <b>{profiles[key].label}</b>
                <span>A = {fmt(profiles[key].area)}</span>
                <span>P = {fmt(profiles[key].perimeter)}</span>
              </button>
            ))}
          </nav>
        </article>
        <article>
          <h3>What's happening?</h3>
          <ul>
            <li>You extrude a 2D profile along a path.</li>
            <li>
              Every cross-section perpendicular to the path is congruent to the
              original profile.
            </li>
            <li>Volume is area of the profile times the extrusion depth.</li>
            <li>
              Lateral area is perimeter of the profile times the extrusion
              depth.
            </li>
          </ul>
        </article>
      </section>

      <nav className="ext403-next">
        <a href="/lessons/3d-mathematics/402-surface-of-revolution">
          ←{" "}
          <span>
            Previous<small>Surface of Revolution</small>
          </span>
        </a>
        <a href="/lessons/3d-mathematics/404-nets-of-solids">
          <span>
            Next<small>Nets of Solids</small>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function ExtrusionSolid({
  profile,
  depth,
  path,
  invariant,
}: {
  profile: Profile;
  depth: number;
  path: Path;
  invariant: boolean;
}) {
  const geometry = useMemo(() => {
    const shape = shapeFor(profile);
    const modelDepth = Math.max(0.05, depth * 0.65);
    const geo = new ExtrudeGeometry(shape, {
      depth: modelDepth,
      bevelEnabled: false,
      curveSegments: 32,
    });
    const position = geo.attributes.position;
    const maxDepth = modelDepth;
    for (let index = 0; index < position.count; index++) {
      const z = position.getZ(index);
      const progress = z / maxDepth;
      const scale = invariant ? 1 : 1 - progress * 0.35;
      position.setX(
        index,
        position.getX(index) * scale +
          (path === "oblique" ? progress * 1.2 : 0),
      );
      position.setY(index, position.getY(index) * scale);
    }
    position.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [profile, depth, path, invariant]);
  return (
    <mesh
      geometry={geometry}
      rotation={[0.05, 1.2, 0]}
      position={[-2.7, -1.45, -2.4]}
      scale={[1, 0.7, 1]}
    >
      <meshStandardMaterial color="#7139e8" roughness={0.42} metalness={0.08} />
      <Edges color="#4b22bd" threshold={12} />
    </mesh>
  );
}

function shapeFor(profile: Profile) {
  const shape = new Shape();
  if (profile === "triangle") {
    shape.moveTo(-2, 0);
    shape.lineTo(0, 3);
    shape.lineTo(2, 0);
    shape.closePath();
  } else if (profile === "circle") {
    shape.absarc(0, 1.2, 1.65, 0, Math.PI * 2);
  } else {
    shape.moveTo(-2, 0);
    shape.lineTo(2, 0);
    shape.lineTo(2, 1);
    shape.lineTo(-0.5, 1);
    shape.lineTo(-0.5, 3);
    shape.lineTo(-2, 3);
    shape.closePath();
  }
  return shape;
}

function ProfilePlot({ profile, area }: { profile: Profile; area: number }) {
  return (
    <svg
      className="ext403-profile-plot"
      viewBox="0 0 210 250"
      role="img"
      aria-label={`${profiles[profile].label} profile`}
    >
      <defs>
        <pattern
          id={`grid-${profile}`}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path d="M20 0H0V20" fill="none" stroke="#e8edf5" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="210" height="250" fill={`url(#grid-${profile})`} />
      <path d="M10 125H205M105 10V240" stroke="#2f3748" />
      <path d="m201 121 7 4-7 4M101 14l4-8 4 8" fill="#2f3748" />
      {profile === "triangle" ? (
        <path d="M55 155 105 65 155 155Z" />
      ) : profile === "circle" ? (
        <circle cx="105" cy="125" r="55" />
      ) : (
        <path d="M55 180V65h40v75h65v40Z" />
      )}
      <g className="ext403-points">
        <circle cx="55" cy="155" r="4" />
        <circle cx="105" cy="65" r="4" />
        <circle cx="155" cy="155" r="4" />
      </g>
      <g className="ext403-area-note">
        <path d="m167 75-18 27" />
        <circle cx="149" cy="102" r="3" />
        <rect x="142" y="42" width="65" height="39" rx="7" />
        <text x="151" y="57">
          Profile area
        </text>
        <text x="151" y="71">
          A = {fmt(area)} sq units
        </text>
      </g>
    </svg>
  );
}

function SweepDiagram({
  profile,
  depth,
  path,
  invariant,
}: {
  profile: Profile;
  depth: number;
  path: Path;
  invariant: boolean;
}) {
  const count = Math.max(2, Math.round(depth / 2));
  return (
    <svg
      className="ext403-sweep"
      viewBox="0 0 250 260"
      role="img"
      aria-label="Extrusion sweep"
    >
      <defs>
        <linearGradient id="sweep403" x1="0" x2="1">
          <stop stopColor="#d8c8ff" />
          <stop offset="1" stopColor="#6430dd" />
        </linearGradient>
      </defs>
      {Array.from({ length: count + 1 }, (_, i) => {
        const t = i / count;
        const x = 25 + t * 155;
        const y = 68 + t * 65 + (path === "oblique" ? -t * 35 : 0);
        const scale = invariant ? 1 : 1 - t * 0.35;
        return (
          <g
            key={i}
            transform={`translate(${x} ${y}) scale(${scale})`}
            opacity={i === count ? 1 : 0.16 + 0.12 * i}
          >
            {profile === "triangle" ? (
              <path d="M0 65 23 0 48 65Z" />
            ) : profile === "circle" ? (
              <ellipse cx="25" cy="34" rx="25" ry="34" />
            ) : (
              <path d="M0 65V0h18v42h30v23Z" />
            )}
          </g>
        );
      })}
      <path
        className="ext403-sweep-path"
        d={path === "straight" ? "M25 148 205 224" : "M25 148 205 188"}
      />
      <path
        className="ext403-arrow"
        d={path === "straight" ? "m195 215 10 9-13 1" : "m194 181 11 7-12 4"}
      />
      <g className="ext403-sweep-label">
        <rect x="45" y="205" width="74" height="31" rx="7" />
        <text x="57" y="224">
          Sweep path
        </text>
        <path d="m104 205 20-25" />
      </g>
    </svg>
  );
}

function CrossSectionGraphic({ profile }: { profile: Profile }) {
  return (
    <svg viewBox="0 0 220 90">
      <path
        d="M12 70 34 20 56 70Z"
        fill="#ded2ff"
        stroke="#6337df"
        strokeWidth="2"
      />
      <path d="M67 45h24m-7-6 7 6-7 6" stroke="#273250" fill="none" />
      <path d="m99 69 17-45h60l18 45Z" fill="#ece7ff" stroke="#8b6ce8" />
      <rect
        x="139"
        y="24"
        width="13"
        height="45"
        fill="#6739de"
        opacity=".75"
      />
      <path d="M199 45h15m-7-6 7 6-7 6" stroke="#273250" fill="none" />
      <path
        d={
          profile === "circle"
            ? "M225 45a22 22 0 1 0 44 0 22 22 0 1 0-44 0"
            : profile === "lshape"
              ? "M224 70V20h16v32h28v18Z"
              : "M224 70 246 20 268 70Z"
        }
        fill="#ded2ff"
        stroke="#6337df"
        strokeWidth="2"
      />
    </svg>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}
function round(value: number) {
  return Math.round(value * 10000) / 10000;
}
function fmt(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}
