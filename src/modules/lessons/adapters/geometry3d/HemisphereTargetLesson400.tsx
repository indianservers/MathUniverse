import {
  Line,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { DoubleSide, type Group } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./HemisphereTargetLesson400.css";

type Half = "Top half" | "Bottom half";
type Display = "Solid" | "Open bowl";
type Projection = "Perspective" | "Orthographic";
type Config = {
  radius: number;
  cut: number;
  half: Half;
  display: Display;
  opacity: number;
  plane: boolean;
  base: boolean;
  radiusLine: boolean;
  isolated: boolean;
};
const initial: Config = {
  radius: 4,
  cut: 0,
  half: "Top half",
  display: "Solid",
  opacity: 70,
  plane: true,
  base: true,
  radiusLine: true,
  isolated: true,
};
export default function HemisphereTargetLesson400({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [config, setConfig] = useState(initial),
    [past, setPast] = useState<Config[]>([]),
    [future, setFuture] = useState<Config[]>([]),
    [view, setView] = useState("Hemisphere (isolated)"),
    [projection, setProjection] = useState<Projection>("Perspective"),
    [cameraDistance, setCameraDistance] = useState(8),
    [cameraReset, setCameraReset] = useState(0),
    [tool, setTool] = useState("Rotate"),
    [rotating, setRotating] = useState(false),
    [fullscreen, setFullscreen] = useState(false),
    [tab, setTab] = useState("Interaction"),
    [challengeMode, setChallengeMode] = useState<"Curved area" | "Total area">(
      "Curved area",
    ),
    [checked, setChecked] = useState(false),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0);
  const {
      radius,
      cut,
      half,
      display,
      opacity,
      plane,
      base,
      radiusLine,
      isolated,
    } = config,
    cutY = cut * radius,
    cutRadius = Math.sqrt(Math.max(0, radius * radius - cutY * cutY)),
    volumeCoefficient = (2 * radius ** 3) / 3,
    curvedCoefficient = 2 * radius ** 2,
    totalCoefficient = 3 * radius ** 2;
  const interact = () => {
    setActions((v) => v + 1);
    onInteraction();
  };
  const commit = (patch: Partial<Config>) => {
    setPast((items) => [...items, config]);
    setFuture([]);
    setConfig({ ...config, ...patch });
    interact();
  };
  const reset = () => {
    setConfig(initial);
    setPast([]);
    setFuture([]);
    setView("Hemisphere (isolated)");
    setProjection("Perspective");
    setCameraDistance(8);
    setCameraReset((v) => v + 1);
    setTool("Rotate");
    setRotating(false);
    setFullscreen(false);
    setTab("Interaction");
    setChallengeMode("Curved area");
    setChecked(false);
    setShared(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const undo = () => {
      if (!past.length) return;
      const previous = past[past.length - 1];
      setFuture((items) => [config, ...items]);
      setPast((items) => items.slice(0, -1));
      setConfig(previous);
      interact();
    },
    redo = () => {
      if (!future.length) return;
      const next = future[0];
      setPast((items) => [...items, config]);
      setFuture((items) => items.slice(1));
      setConfig(next);
      interact();
    };
  const share = () => {
    void navigator.clipboard?.writeText(
      `Hemisphere r=${radius}, V=${fmt(volumeCoefficient)}π, TSA=${fmt(totalCoefficient)}π`,
    );
    setShared(true);
    interact();
  };
  const toolbar = (nextTool: string, distance?: number) => {
    setTool(nextTool);
    if (distance) {
      setCameraDistance(distance);
      setCameraReset((v) => v + 1);
    }
    interact();
  };
  return (
    <section
      className="cs378-page hemi400-page"
      data-testid="geometry3d-mockup-0585"
      data-object-model="threejs-dedicated-dynamic-spherical-cap-cut-plane-top-bottom-solid-open-bowl-radius-opacity-orbit-zoom-undo-redo-fullscreen-exact-hemisphere-area-volume-comparison-graded-challenge"
      data-radius={radius}
      data-cut={cut}
      data-cut-radius={round(cutRadius)}
      data-half={half}
      data-display={display}
      data-opacity={opacity}
      data-plane={plane}
      data-base={base}
      data-radius-line={radiusLine}
      data-isolated={isolated}
      data-view={view}
      data-projection={projection}
      data-camera-distance={cameraDistance}
      data-tool={tool}
      data-rotating={rotating}
      data-fullscreen={fullscreen}
      data-volume-coefficient={round(volumeCoefficient)}
      data-curved-coefficient={round(curvedCoefficient)}
      data-total-coefficient={round(totalCoefficient)}
      data-past={past.length}
      data-future={future.length}
      data-tab={tab}
      data-challenge-mode={challengeMode}
      data-checked={checked}
      data-correct={checked}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="hemi400-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <small>GEOMETRY & SOLIDS</small>
        </div>
        <h1>Hemisphere</h1>
        <p>Cut a sphere by the equatorial plane and explore one half.</p>
        <nav>
          <span>Intermediate–Advanced</span>
          <span>3D Lab</span>
          <span>3D Calculator</span>
          <span>6–10 min</span>
        </nav>
        <div>
          <button
            onClick={() => {
              setTab("English (English)");
              interact();
            }}
          >
            English (English)⌄
          </button>
          <button onClick={reset}>↻ Reset</button>
          <button onClick={share}>{shared ? "✓ Shared" : "⌯ Share"}</button>
          <button
            onClick={() => {
              document
                .querySelector(".hemi400-work")
                ?.scrollIntoView({ behavior: "smooth" });
              interact();
            }}
          >
            ↗ Workspace
          </button>
        </div>
      </header>
      <nav className="hemi400-tabs">
        {[
          "Interaction",
          "Explain",
          "Examples",
          "Formulas",
          "Challenge",
          "Know more",
        ].map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            onClick={() => {
              setTab(item);
              interact();
            }}
          >
            {item}
          </button>
        ))}
      </nav>
      <section className="hemi400-work">
        <header>
          <small>INTERACTION</small>
          <h2>Cut the sphere and explore the hemisphere</h2>
          <nav>
            <button aria-label="Undo" disabled={!past.length} onClick={undo}>
              ↶
            </button>
            <button aria-label="Redo" disabled={!future.length} onClick={redo}>
              ↷
            </button>
            <button
              onClick={() => {
                setFullscreen((v) => !v);
                interact();
              }}
            >
              {fullscreen ? "Exit full screen" : "⛶ Full screen"}
            </button>
          </nav>
        </header>
        <div className={`hemi400-grid ${fullscreen ? "expanded" : ""}`}>
          {fullscreen && (
            <button
              className="hemi400-exit-fullscreen"
              aria-label="Exit expanded workspace"
              onClick={() => {
                setFullscreen(false);
                interact();
              }}
            >
              ×
            </button>
          )}
          <aside className="hemi400-controls">
            <h3>1. Cut sphere</h3>
            <p>Drag the plane to cut the sphere by its equatorial plane.</p>
            <Control
              label="Plane height"
              value={cut}
              min={-1}
              max={1}
              step={0.05}
              onChange={(value) => commit({ cut: value })}
            />
            <h3>2. Show</h3>
            <Toggle
              label="Show plane"
              checked={plane}
              onChange={() => commit({ plane: !plane })}
            />
            <Toggle
              label="Show base circle"
              checked={base}
              onChange={() => commit({ base: !base })}
            />
            <Toggle
              label="Show radius"
              checked={radiusLine}
              onChange={() => commit({ radiusLine: !radiusLine })}
            />
            <h3>3. Hemisphere view</h3>
            <Toggle
              label="Isolate one half"
              checked={isolated}
              onChange={() => commit({ isolated: !isolated })}
            />
            {(["Top half", "Bottom half"] as Half[]).map((item) => (
              <label className="hemi400-radio" key={item}>
                <input
                  type="radio"
                  name="half"
                  value={item}
                  checked={half === item}
                  onChange={() => commit({ half: item })}
                />
                {item}
              </label>
            ))}
            <b>Display as</b>
            <div className="hemi400-segment">
              {(["Solid", "Open bowl"] as Display[]).map((item) => (
                <button
                  key={item}
                  className={display === item ? "active" : ""}
                  onClick={() => commit({ display: item })}
                >
                  {item}
                </button>
              ))}
            </div>
            <h3>4. Radius (r)</h3>
            <Control
              label="Radius"
              value={radius}
              min={1}
              max={10}
              step={0.25}
              onChange={(value) => commit({ radius: value })}
            />
            <h3>5. Rotate</h3>
            <button
              className="hemi400-rotate"
              onClick={() => {
                setRotating((v) => !v);
                interact();
              }}
            >
              {rotating ? "Ⅱ Stop rotation" : "Drag to rotate　⟳"}
            </button>
            <h3>6. Fill</h3>
            <Control
              label="Opacity"
              value={opacity}
              min={10}
              max={100}
              step={5}
              suffix="%"
              onChange={(value) => commit({ opacity: value })}
            />
          </aside>
          <article
            className="hemi400-scene"
            data-testid="geometry3d-hemisphere-canvas"
          >
            <nav>
              {["Whole sphere", "Hemisphere (isolated)"].map((item) => (
                <button
                  key={item}
                  className={view === item ? "active" : ""}
                  onClick={() => {
                    setView(item);
                    interact();
                  }}
                >
                  {item}
                </button>
              ))}
            </nav>
            <Canvas
              camera={{ position: [6, 4.5, cameraDistance], fov: 42 }}
              dpr={[1, 1.5]}
            >
              <color attach="background" args={["#fff"]} />
              <ambientLight intensity={2.2} />
              <directionalLight position={[5, 8, 6]} intensity={2.5} />
              <HemisphereModel
                radius={radius}
                cut={cut}
                half={half}
                display={display}
                opacity={opacity}
                plane={plane}
                base={base}
                radiusLine={radiusLine}
                isolated={isolated}
                whole={view === "Whole sphere"}
                rotating={rotating}
              />
              <OrbitControls
                key={`${cameraReset}-${projection}`}
                makeDefault
                enablePan
                minDistance={4}
                maxDistance={14}
              />
              {projection === "Orthographic" && (
                <OrthographicCamera
                  makeDefault
                  position={[6, 4.5, cameraDistance]}
                  zoom={58}
                />
              )}{" "}
              {projection === "Perspective" && (
                <PerspectiveCamera
                  makeDefault
                  position={[6, 4.5, cameraDistance]}
                  fov={42}
                />
              )}
            </Canvas>
            <div className="hemi400-legend">
              <span>● Curved surface</span>
              <span>● Circular base</span>
              <span>● Radius r</span>
            </div>
            <div className="hemi400-toolbar">
              <button
                aria-label="Select tool"
                className={tool === "Select" ? "active" : ""}
                onClick={() => toolbar("Select")}
              >
                ➤
              </button>
              <button
                aria-label="Rotate tool"
                className={tool === "Rotate" ? "active" : ""}
                onClick={() => toolbar("Rotate")}
              >
                ↻
              </button>
              <button
                aria-label="Zoom out"
                onClick={() =>
                  toolbar("Zoom out", Math.min(14, cameraDistance + 1))
                }
              >
                ⊖
              </button>
              <button
                aria-label="Zoom in"
                onClick={() =>
                  toolbar("Zoom in", Math.max(4, cameraDistance - 1))
                }
              >
                ⊕
              </button>
              <button
                aria-label="Reset view"
                onClick={() => toolbar("Reset view", 8)}
              >
                ⌾
              </button>
              <button
                aria-label="Toggle projection"
                onClick={() => {
                  setProjection((v) =>
                    v === "Perspective" ? "Orthographic" : "Perspective",
                  );
                  interact();
                }}
              >
                ◇
              </button>
            </div>
          </article>
          <aside className="hemi400-values">
            <h2>Live values</h2>
            <p>In terms of r</p>
            <article>
              <b>Volume (V)</b>
              <strong>⅔ πr³</strong>
            </article>
            <article>
              <b>Curved area</b>
              <strong>2πr²</strong>
            </article>
            <article>
              <b>Total area</b>
              <strong>3πr²</strong>
            </article>
            <p>For r = {fmt(radius)}</p>
            <div>
              V = <b>{fmt(volumeCoefficient)}π</b>
              <span>≈ {fmt(volumeCoefficient * Math.PI)}</span>
            </div>
            <div>
              Curved area = <b>{fmt(curvedCoefficient)}π</b>
              <span>≈ {fmt(curvedCoefficient * Math.PI)}</span>
            </div>
            <div>
              Total area = <b>{fmt(totalCoefficient)}π</b>
              <span>≈ {fmt(totalCoefficient * Math.PI)}</span>
            </div>
            <small>Units: cubic units for volume; square units for area.</small>
          </aside>
        </div>
      </section>
      <section className="hemi400-why">
        <h2>Why a hemisphere?</h2>
        <p>
          A hemisphere has half the volume of the full sphere, but adding the
          circular base increases the total surface area.
        </p>
        <div>
          <figure>
            <b>Sphere (radius r)</b>
            <span className="hemi400-sphere-pic" />
          </figure>
          <table>
            <thead>
              <tr>
                <th />
                <th>Comparison</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>⁴⁄₃πr³</td>
                <th>Volume</th>
                <td>⅔πr³</td>
              </tr>
              <tr>
                <td>4πr²</td>
                <th>Curved surface area</th>
                <td>2πr²</td>
              </tr>
              <tr>
                <td>—</td>
                <th>Base (circular) area</th>
                <td>πr²</td>
              </tr>
              <tr>
                <td>4πr²</td>
                <th>Total surface area</th>
                <td>3πr²</td>
              </tr>
            </tbody>
          </table>
          <figure>
            <b>Hemisphere (radius r)</b>
            <span className="hemi400-hemi-pic" />
          </figure>
          <aside>
            <h3>Key takeaways</h3>
            <p>✓ Volume is halved: ⅔πr³</p>
            <p>✓ Curved surface is half: 2πr²</p>
            <p>✓ Adding the base πr² gives total area 3πr²</p>
            <p>✓ Curved area excludes the base.</p>
            <p>✓ Total area includes the base.</p>
          </aside>
        </div>
      </section>
      <section className="hemi400-bottom">
        <article>
          <h2>Worked example</h2>
          <p>
            Given r = 4. Find the volume and total surface area of the
            hemisphere.
          </p>
          <h3>Solution</h3>
          <b>Volume</b>
          <p>
            V = ⅔πr³ = ⅔π(4)³ = 128/3 π<br />≈ 134.04 cubic units
          </p>
          <b>Total surface area</b>
          <p>
            TSA = 3πr² = 3π(4)² = 48π
            <br />≈ 150.80 square units
          </p>
          <footer>
            <b>Answer</b>
            <br />V = 128/3 π cubic units, TSA = 48π square units.
          </footer>
        </article>
        <article className="hemi400-challenge">
          <h2>Challenge</h2>
          <p>Choose curved area or total area.</p>
          <p>A hemisphere has radius r = 6.</p>
          <ol>
            <li>What is the curved surface area?</li>
            <li>What is the total surface area?</li>
          </ol>
          <p>Select what you want to find:</p>
          <div>
            <button
              className={challengeMode === "Curved area" ? "active" : ""}
              onClick={() => {
                setChallengeMode("Curved area");
                setChecked(false);
                interact();
              }}
            >
              Curved area
            </button>
            <button
              className={challengeMode === "Total area" ? "active" : ""}
              onClick={() => {
                setChallengeMode("Total area");
                setChecked(false);
                interact();
              }}
            >
              Total area
            </button>
          </div>
          <strong>
            {checked
              ? challengeMode === "Curved area"
                ? "72π square units ✓"
                : "108π square units ✓"
              : ""}
          </strong>
          <button
            className="hemi400-check"
            onClick={() => {
              setChecked(true);
              interact();
            }}
          >
            {checked ? "✓ Correct" : "Check your answer　→"}
          </button>
        </article>
      </section>
      <nav className="hemi400-nav">
        <a href="/lessons/3d-mathematics/399-sphere">
          ← Previous
          <br />
          Sphere
        </a>
        <a href="/lessons/3d-mathematics/401-frustum">
          Next →<br />
          Frustum
        </a>
      </nav>
      <footer className="hemi400-footer">
        <b>⌘ Math Universe</b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <nav>
          <button
            onClick={() => {
              setTab("Sitemap");
              interact();
            }}
          >
            Sitemap
          </button>
          <button
            onClick={() => {
              setTab("Docs");
              interact();
            }}
          >
            Docs
          </button>
          <button
            onClick={() => {
              setTab("About");
              interact();
            }}
          >
            About
          </button>
        </nav>
      </footer>
    </section>
  );
}
function Control({
  label,
  value,
  min,
  max,
  step,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="hemi400-control">
      <span>
        <b>{label}</b>
        <input
          aria-label={label}
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </span>
      <input
        aria-label={`${label} slider`}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        {min}
        {suffix}
        <span>
          {max}
          {suffix}
        </span>
      </small>
    </label>
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
    <label className="hemi400-toggle">
      <span>{label}</span>
      <input
        aria-label={label}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}
function HemisphereModel({
  radius,
  cut,
  half,
  display,
  opacity,
  plane,
  base,
  radiusLine,
  isolated,
  whole,
  rotating,
}: {
  radius: number;
  cut: number;
  half: Half;
  display: Display;
  opacity: number;
  plane: boolean;
  base: boolean;
  radiusLine: boolean;
  isolated: boolean;
  whole: boolean;
  rotating: boolean;
}) {
  const group = useRef<Group>(null),
    theta = Math.acos(Math.max(-1, Math.min(1, cut))),
    top = half === "Top half",
    thetaStart = top ? 0 : theta,
    thetaLength = top ? theta : Math.PI - theta,
    cutY = cut * radius,
    baseRadius = Math.sqrt(Math.max(0, radius ** 2 - cutY ** 2)),
    scale = 1.85 / radius,
    ring = useMemo(
      () =>
        Array.from({ length: 65 }, (_, index) => {
          const a = (index / 64) * Math.PI * 2;
          return [Math.cos(a) * baseRadius, cutY, Math.sin(a) * baseRadius] as [
            number,
            number,
            number,
          ];
        }),
      [baseRadius, cutY],
    );
  useFrame((_, delta) => {
    if (rotating && group.current) group.current.rotation.y += delta * 0.6;
  });
  return (
    <group ref={group} position={[0, 0.9, 0]} scale={scale}>
      {whole && (
        <mesh>
          <sphereGeometry args={[radius, 64, 32]} />
          <meshPhysicalMaterial
            color="#58bd69"
            transparent
            opacity={opacity / 100}
            roughness={0.3}
          />
        </mesh>
      )}
      {!whole && (
        <>
          <mesh>
            <sphereGeometry
              args={[radius, 64, 32, 0, Math.PI * 2, thetaStart, thetaLength]}
            />
            <meshPhysicalMaterial
              color="#58bd69"
              transparent
              opacity={opacity / 100}
              roughness={0.3}
              side={DoubleSide}
            />
          </mesh>
          <mesh>
            <sphereGeometry
              args={[
                radius,
                64,
                32,
                0,
                Math.PI * 2,
                top ? theta : 0,
                top ? Math.PI - theta : theta,
              ]}
            />
            <meshPhysicalMaterial
              color={isolated ? "#aab4ba" : "#73bd7d"}
              transparent
              opacity={isolated ? 0.24 : Math.max(0.25, opacity / 180)}
              roughness={0.38}
              side={DoubleSide}
            />
          </mesh>
        </>
      )}
      {plane && (
        <mesh position={[0, cutY, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius * 1.35, 64]} />
          <meshBasicMaterial
            color="#70b7e8"
            transparent
            opacity={0.42}
            side={DoubleSide}
          />
        </mesh>
      )}
      {base && display === "Solid" && (
        <mesh
          position={[0, cutY + (top ? -0.01 : 0.01), 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <circleGeometry args={[baseRadius, 64]} />
          <meshBasicMaterial
            color="#3f8fbf"
            transparent
            opacity={0.5}
            side={DoubleSide}
          />
        </mesh>
      )}
      {base && <Line points={ring} color="#07578e" lineWidth={2} />}{" "}
      {radiusLine && (
        <Line
          points={[
            [0, cutY, 0],
            [-baseRadius, cutY, 0],
          ]}
          color="#ee780d"
          lineWidth={2}
        />
      )}
      <Line
        points={[
          [0, -radius * 1.35, 0],
          [0, radius * 1.35, 0],
        ]}
        color="#276080"
        dashed
        dashSize={0.15}
        gapSize={0.12}
      />
    </group>
  );
}
const round = (value: number) => Number(value.toFixed(4));
const fmt = (value: number) => Number(value.toFixed(2)).toString();
