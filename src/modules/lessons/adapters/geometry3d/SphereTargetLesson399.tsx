import {
  Line,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./SphereTargetLesson399.css";

type Projection = "Orthographic" | "Perspective";
export default function SphereTargetLesson399({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [radius, setRadius] = useState(5);
  const [sliceHeight, setSliceHeight] = useState(2);
  const [longitude, setLongitude] = useState(45);
  const [greatCircle, setGreatCircle] = useState(true);
  const [layers, setLayers] = useState(true);
  const [layerIntensity, setLayerIntensity] = useState(0.7);
  const [projection, setProjection] = useState<Projection>("Perspective");
  const [animating, setAnimating] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  const [tab, setTab] = useState("Interaction");
  const [volumeAnswer, setVolumeAnswer] = useState(27);
  const [areaAnswer, setAreaAnswer] = useState(9);
  const [revealed, setRevealed] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exported, setExported] = useState(false);
  const [shared, setShared] = useState(false);
  const [actions, setActions] = useState(0);
  const sliceRadius = Math.sqrt(
    Math.max(0, radius * radius - sliceHeight * sliceHeight),
  );
  const areaCoefficient = 4 * radius * radius;
  const volumeCoefficient = (4 * radius * radius * radius) / 3;
  const challengeCorrect = volumeAnswer === 27 && areaAnswer === 9;
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setRadius(5);
    setSliceHeight(2);
    setLongitude(45);
    setGreatCircle(true);
    setLayers(true);
    setLayerIntensity(0.7);
    setProjection("Perspective");
    setAnimating(false);
    setCameraReset((value) => value + 1);
    setTab("Interaction");
    setVolumeAnswer(27);
    setAreaAnswer(9);
    setRevealed(false);
    setSaved(false);
    setExported(false);
    setShared(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const updateRadius = (value: number) =>
    act(() => {
      setRadius(value);
      setSliceHeight((z) => Math.max(-value, Math.min(value, z)));
    });
  const saveWorkspace = () =>
    act(() => {
      localStorage.setItem(
        "sphere-399-workspace",
        JSON.stringify({
          radius,
          sliceHeight,
          longitude,
          greatCircle,
          layers,
          layerIntensity,
          projection,
        }),
      );
      setSaved(true);
    });
  const exportImage = () =>
    act(() => {
      const canvas = document.querySelector<HTMLCanvasElement>(
        '[data-testid="geometry3d-sphere-canvas"] canvas',
      );
      if (canvas) {
        const link = document.createElement("a");
        link.download = "sphere-lesson-399.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
        setExported(true);
      }
    });
  const share = () =>
    act(() => {
      void navigator.clipboard?.writeText(
        `Sphere R=${radius}, z=${sliceHeight}, slice r=${fmt(sliceRadius)}`,
      );
      setShared(true);
    });

  return (
    <section
      className="cs378-page sph399-page"
      data-testid="geometry3d-mockup-0584"
      data-object-model="threejs-dedicated-parametric-sphere-radius-slice-great-circle-meridian-axes-orthographic-perspective-animation-exact-area-volume-scaling-graded-challenge-save-export"
      data-radius={radius}
      data-slice-height={sliceHeight}
      data-slice-radius={round(sliceRadius)}
      data-longitude={longitude}
      data-great-circle={greatCircle}
      data-layers={layers}
      data-layer-intensity={layerIntensity}
      data-projection={projection}
      data-animating={animating}
      data-area-coefficient={round(areaCoefficient)}
      data-volume-coefficient={round(volumeCoefficient)}
      data-tab={tab}
      data-volume-answer={volumeAnswer}
      data-area-answer={areaAnswer}
      data-revealed={revealed}
      data-correct={revealed && challengeCorrect}
      data-saved={saved}
      data-exported={exported}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="sph399-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <small>3D GEOMETRY AND SOLIDS</small>
        </div>
        <h1>Sphere</h1>
        <p>
          Explore the geometry of a sphere through interaction and discovery.
        </p>
        <nav>
          <span>Intermediate–Advanced</span>
          <span>3D Lab</span>
          <span>3D Calculator</span>
          <span>6–10 min</span>
        </nav>
        <div>
          <button onClick={() => act(() => setTab("English (English)"))}>
            English (English)⌄
          </button>
          <button onClick={reset}>↻ Reset</button>
          <button onClick={share}>{shared ? "✓ Shared" : "⌯ Share"}</button>
          <button
            onClick={() =>
              act(() =>
                document
                  .querySelector(".sph399-work")
                  ?.scrollIntoView({ behavior: "smooth" }),
              )
            }
          >
            ↗ Workspace
          </button>
        </div>
      </header>
      <nav className="sph399-tabs">
        {[
          "Interaction",
          "Formulas",
          "Examples",
          "Insights",
          "Challenge",
          "Know more",
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
      <section className="sph399-work">
        <aside className="sph399-controls">
          <h2>CONTROLS</h2>
          <Control
            label="Radius"
            symbol="R"
            value={radius}
            min={1}
            max={10}
            step={0.25}
            onChange={updateRadius}
          />
          <Toggle
            label="Great circle"
            checked={greatCircle}
            onChange={() => act(() => setGreatCircle((value) => !value))}
          />
          <Control
            label="Slice height"
            symbol="z"
            value={sliceHeight}
            min={-radius}
            max={radius}
            step={0.25}
            onChange={(value) => act(() => setSliceHeight(value))}
          />
          <div className="sph399-calculation">
            Slice radius r = √R² − z²<strong>{fmt(sliceRadius, 4)}</strong>
          </div>
          <Control
            label="Meridian / Longitude"
            value={longitude}
            min={0}
            max={180}
            step={1}
            suffix="°"
            onChange={(value) => act(() => setLongitude(value))}
          />
          <Toggle
            label="Show layers (fill)"
            checked={layers}
            onChange={() => act(() => setLayers((value) => !value))}
          />
          <label className="sph399-layer">
            <input
              aria-label="Layer fill intensity"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={layerIntensity}
              onChange={(event) =>
                act(() => setLayerIntensity(Number(event.target.value)))
              }
            />
            <small>
              Center<span>Surface</span>
            </small>
          </label>
          <button
            className="sph399-animate"
            onClick={() => act(() => setAnimating((value) => !value))}
          >
            {animating ? "Ⅱ Stop rotation" : "Animate rotation　▷"}
          </button>
          <footer>
            ☝ Drag on the sphere to rotate
            <br />
            <small>Scroll to zoom • Shift + drag to pan</small>
          </footer>
        </aside>
        <article
          className="sph399-scene"
          data-testid="geometry3d-sphere-canvas"
        >
          <Canvas gl={{ preserveDrawingBuffer: true }} dpr={[1, 1.5]}>
            <SphereCamera projection={projection} />
            <color attach="background" args={["#061a3a"]} />
            <ambientLight intensity={2} />
            <directionalLight position={[5, 7, 6]} intensity={2.6} />
            <SphereModel
              radius={radius}
              sliceHeight={sliceHeight}
              sliceRadius={sliceRadius}
              longitude={longitude}
              greatCircle={greatCircle}
              layers={layers}
              layerIntensity={layerIntensity}
              animating={animating}
            />
            <OrbitControls
              key={`${cameraReset}-${projection}`}
              makeDefault
              enablePan
              minDistance={5}
              maxDistance={14}
            />
          </Canvas>
          <button
            className="sph399-reset-view"
            onClick={() => act(() => setCameraReset((value) => value + 1))}
          >
            ↻ Reset view
          </button>
          <div className="sph399-projection">
            <button
              className={projection === "Orthographic" ? "active" : ""}
              onClick={() => act(() => setProjection("Orthographic"))}
            >
              Orthographic
            </button>
            <button
              className={projection === "Perspective" ? "active" : ""}
              onClick={() => act(() => setProjection("Perspective"))}
            >
              Perspective
            </button>
          </div>
          <div className="sph399-legend">
            <span>│ Radius R</span>
            <span>━ Great circle</span>
            <span>┃ Slice (height z)</span>
            <span>╍ Meridian / Longitude</span>
          </div>
          <div className="sph399-stats">
            <span>
              Radius (R)<b>{fmt(radius, 4)}</b>
            </span>
            <span>
              Slice height (z)<b>{fmt(sliceHeight, 4)}</b>
            </span>
            <span>
              Slice radius
              <br />
              √(R²−z²)<b>{fmt(sliceRadius, 4)}</b>
            </span>
            <span>
              Meridian / Longitude<b>{fmt(longitude)}°</b>
            </span>
          </div>
        </article>
      </section>
      <section className="sph399-cards">
        <article>
          <h2>FORMULAS</h2>
          <h3>Surface area</h3>
          <p>A = 4πr²</p>
          <hr />
          <h3>Volume</h3>
          <p>V = ⁴⁄₃ πr³</p>
          <small>Where r is the radius of the sphere.</small>
        </article>
        <article className="sph399-scale">
          <h2>SCALE COMPARISON: r → 2r</h2>
          <div>
            <i>Radius = r</i>
            <span />
            <b>−</b>
            <span />
            <i>Radius = 2r</i>
          </div>
          <footer>
            <p>
              Volume<strong>× 8</strong>
              <small>(2³)</small>
            </p>
            <p>
              Surface area<strong>× 4</strong>
              <small>(2²)</small>
            </p>
          </footer>
        </article>
        <article>
          <h2>WORKED EXAMPLE</h2>
          <h3>Let r = 3</h3>
          <hr />
          <h3>Surface area</h3>
          <p>
            A = 4πr² = 4π(3)²
            <br />= 36π
          </p>
          <hr />
          <h3>Volume</h3>
          <p>
            V = ⁴⁄₃πr³ = ⁴⁄₃π(3)³
            <br />= 36π
          </p>
          <small>Units: A in square units, V in cubic units.</small>
        </article>
      </section>
      <section className="sph399-insight">
        <div className="sph399-archimedes">A</div>
        <article>
          <h2>ARCHIMEDES’ INSIGHT</h2>
          <strong>
            “Give me a place to stand, and I will move the Earth.”
          </strong>
          <p>
            Archimedes discovered the volume of a sphere by exhausting sums of
            cylindrical slices — a beautiful early use of integrals.
          </p>
          <p>His method leads to: V = ⁴⁄₃ πr³</p>
        </article>
        <aside>
          <div className="sph399-insight-sphere" />
          <b>=</b>
          <div className="sph399-insight-cylinder">
            <span />
            <span />
            <span />
          </div>
        </aside>
      </section>
      <section className="sph399-challenge">
        <article>
          <h2>CHALLENGE</h2>
          <h3>Predict the scaling</h3>
          <p>
            If the radius of a sphere is tripled (r → 3r), what happens to its
            volume and surface area?
          </p>
          <p>Predict the scale factors, then reveal to check!</p>
        </article>
        <aside>
          <ChoiceRow
            label="Volume scales by"
            value={volumeAnswer}
            onChange={(value) =>
              act(() => {
                setVolumeAnswer(value);
                setRevealed(false);
              })
            }
          />
          <ChoiceRow
            label="Surface area scales by"
            value={areaAnswer}
            onChange={(value) =>
              act(() => {
                setAreaAnswer(value);
                setRevealed(false);
              })
            }
          />
          <button onClick={() => act(() => setRevealed(true))}>
            {revealed
              ? challengeCorrect
                ? "✓ Correct"
                : "Try again"
              : "▣ Reveal Answer"}
          </button>
        </aside>
      </section>
      <section className="sph399-facts">
        <article>
          <h2>QUICK FACTS</h2>
          <p>◉ The great circle is the largest circle on the sphere.</p>
          <p>◉ A slice at height z has radius r = √(R²−z²).</p>
          <p>◉ Surface area grows with the square of radius (r²).</p>
          <p>◉ Volume grows with the cube of radius (r³).</p>
        </article>
        <article>
          <h2>KEY RELATIONSHIPS</h2>
          <p>−R ≤ z ≤ R</p>
          <p>r² + z² = R²</p>
          <p>0 ≤ r ≤ R</p>
        </article>
        <article>
          <h2>DOWNLOAD / SAVE</h2>
          <p>
            Save your current setup
            <br />
            or export the visualization.
          </p>
          <button onClick={saveWorkspace}>
            {saved ? "✓ Saved" : "Save Workspace"}
          </button>
          <button onClick={exportImage}>
            {exported ? "✓ Exported" : "Export Image"}
          </button>
        </article>
      </section>
      <nav className="sph399-nav">
        <a href="/lessons/3d-mathematics/398-cone">
          ← Previous
          <br />
          Cone
        </a>
        <a href="/lessons/3d-mathematics">▦ All 3D Mathematics Lessons</a>
        <a href="/lessons/3d-mathematics/400-hemisphere">
          Next →<br />
          Hemisphere
        </a>
      </nav>
    </section>
  );
}

function Control({
  label,
  symbol,
  value,
  min,
  max,
  step,
  suffix = "",
  onChange,
}: {
  label: string;
  symbol?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="sph399-control">
      <b>{label}</b>
      {symbol && <i>({symbol})</i>}
      <input
        aria-label={label}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <input
        aria-label={`${label} slider`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
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
    <label className="sph399-toggle">
      <b>{label}</b>
      <input
        aria-label={label}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}
function ChoiceRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="sph399-choice">
      <b>{label}</b>
      {[3, 9, 27].map((item) => (
        <button
          key={item}
          className={value === item ? "active" : ""}
          onClick={() => onChange(item)}
        >
          × {item}
        </button>
      ))}
    </div>
  );
}
function SphereCamera({ projection }: { projection: Projection }) {
  return projection === "Perspective" ? (
    <PerspectiveCamera makeDefault position={[6.5, 4.5, 7.5]} fov={43} />
  ) : (
    <OrthographicCamera makeDefault position={[6.5, 4.5, 7.5]} zoom={62} />
  );
}
function SphereModel({
  radius,
  sliceHeight,
  sliceRadius,
  longitude,
  greatCircle,
  layers,
  layerIntensity,
  animating,
}: {
  radius: number;
  sliceHeight: number;
  sliceRadius: number;
  longitude: number;
  greatCircle: boolean;
  layers: boolean;
  layerIntensity: number;
  animating: boolean;
}) {
  const group = useRef<Group>(null),
    scale = 2.3 / radius;
  useFrame((_, delta) => {
    if (animating && group.current) group.current.rotation.y += delta * 0.55;
  });
  const circle = (r: number, y = 0) =>
    Array.from({ length: 65 }, (_, index) => {
      const a = (index / 64) * Math.PI * 2;
      return [Math.cos(a) * r, y, Math.sin(a) * r] as [number, number, number];
    });
  return (
    <group ref={group} scale={scale} position={[0, 0.9, 0]}>
      <mesh>
        <sphereGeometry args={[radius, 64, 40]} />
        <meshPhysicalMaterial
          color="#86a9ed"
          transparent
          opacity={layers ? 0.18 + 0.2 * layerIntensity : 0.08}
          roughness={0.15}
          side={2}
        />
      </mesh>
      {greatCircle && (
        <Line points={circle(radius * 1.003)} color="#15d7ed" lineWidth={2} />
      )}
      <Line
        points={circle(sliceRadius, sliceHeight)}
        color="#bb62f3"
        lineWidth={3}
      />
      <mesh position={[0, sliceHeight, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[sliceRadius, 64]} />
        <meshBasicMaterial
          color="#9854db"
          transparent
          opacity={layers ? 0.22 * layerIntensity : 0.04}
          side={2}
        />
      </mesh>
      <group rotation={[0, (longitude * Math.PI) / 180, 0]}>
        <Line
          points={Array.from({ length: 65 }, (_, index) => {
            const a = (index / 64) * Math.PI * 2;
            return [Math.cos(a) * radius, Math.sin(a) * radius, 0] as [
              number,
              number,
              number,
            ];
          })}
          color="#f0f3ff"
          lineWidth={1.5}
          dashed
          dashSize={0.15}
          gapSize={0.12}
        />
      </group>
      <Line
        points={[
          [-radius * 1.35, 0, 0],
          [radius * 1.35, 0, 0],
        ]}
        color="#ff3d60"
      />
      <Line
        points={[
          [0, -radius * 1.35, 0],
          [0, radius * 1.35, 0],
        ]}
        color="#13a7ff"
      />
      <Line
        points={[
          [0, 0, -radius * 1.35],
          [0, 0, radius * 1.35],
        ]}
        color="#2be88d"
      />
      <Line
        points={[
          [0, 0, 0],
          [sliceRadius, sliceHeight, 0],
        ]}
        color="#fff"
        lineWidth={2}
      />
    </group>
  );
}
const round = (value: number) => Number(value.toFixed(4));
const fmt = (value: number, digits = 2) =>
  Number(value.toFixed(digits)).toString();
