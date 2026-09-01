import { Edges, Line, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  CheckCircle2,
  LockKeyhole,
  Play,
  RotateCcw,
  Share2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DoubleSide } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./VolumeTargetLesson406.css";

type Solid = "prism" | "cylinder" | "pyramid" | "cone" | "sphere";
type Unit = "u³" | "m³" | "cm³" | "mL" | "L" | "ft³" | "in³";
const solids: Solid[] = ["prism", "cylinder", "pyramid", "cone", "sphere"],
  labels: Record<Solid, string> = {
    prism: "Rectangular Prism",
    cylinder: "Cylinder",
    pyramid: "Square Pyramid",
    cone: "Cone",
    sphere: "Sphere",
  };

export default function VolumeTargetLesson406({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [solid, setSolid] = useState<Solid>("prism"),
    [baseArea, setBaseArea] = useState(12),
    [height, setHeight] = useState(5),
    [a, setA] = useState(4),
    [b, setB] = useState(3),
    [layers, setLayers] = useState(10),
    [slice, setSlice] = useState(2.5),
    [showSlice, setShowSlice] = useState(true),
    [auto, setAuto] = useState(true),
    [playing, setPlaying] = useState(false),
    [from, setFrom] = useState<Unit>("u³"),
    [to, setTo] = useState<Unit>("m³"),
    [challengeB, setChallengeB] = useState(24),
    [challengeH, setChallengeH] = useState(5),
    [checked, setChecked] = useState(true),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0);
  const prismVolume = baseArea * height,
    pyramidVolume = prismVolume / 3,
    sphereVolume = 16 * Math.PI,
    selectedVolume =
      solid === "pyramid" || solid === "cone"
        ? pyramidVolume
        : solid === "sphere"
          ? sphereVolume
          : prismVolume,
    challengeVolume = volumeFor(solid, challengeB, challengeH),
    correct = checked && Math.abs(challengeVolume - 120) < 0.01,
    converted = selectedVolume * factor(from, to);
  const act = (fn: () => void) => {
    fn();
    setChecked(false);
    setActions((v) => v + 1);
    onInteraction();
  };
  const reset = () => {
    setSolid("prism");
    setBaseArea(12);
    setHeight(5);
    setA(4);
    setB(3);
    setLayers(10);
    setSlice(2.5);
    setShowSlice(true);
    setAuto(true);
    setPlaying(false);
    setFrom("u³");
    setTo("m³");
    setChallengeB(24);
    setChallengeH(5);
    setChecked(true);
    setShared(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () =>
        setLayers((value) => {
          if (value >= 10) {
            if (!auto) setPlaying(false);
            return auto ? 1 : 10;
          }
          return value + 1;
        }),
      160,
    );
    return () => window.clearInterval(timer);
  }, [playing, auto]);
  const setDimension = (name: "a" | "b", value: number) =>
    act(() => {
      const next = clamp(value, 0.5, 10);
      if (name === "a") {
        setA(next);
        setBaseArea(next * b);
      } else {
        setB(next);
        setBaseArea(a * next);
      }
    });
  return (
    <section
      className="cs378-page vol406-page"
      data-testid="geometry3d-mockup-0591"
      data-object-model="threejs-dedicated-five-solid-volume-comparison-layers-cross-section-dimensions-conversion-challenge"
      data-direct-interaction="true"
      data-solid={solid}
      data-base-area={round(baseArea)}
      data-height={round(height)}
      data-a={round(a)}
      data-b={round(b)}
      data-layers={layers}
      data-slice={round(slice)}
      data-show-slice={showSlice}
      data-auto={auto}
      data-playing={playing}
      data-prism-volume={round(prismVolume)}
      data-pyramid-volume={round(pyramidVolume)}
      data-sphere-volume={round(sphereVolume)}
      data-selected-volume={round(selectedVolume)}
      data-converted={round(converted)}
      data-challenge-volume={round(challengeVolume)}
      data-checked={checked}
      data-correct={correct}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="vol406-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <small>3D GEOMETRY AND SOLIDS</small>
          <h1>Volume</h1>
          <p>
            Compare solids with the same base area <i>B</i> and height <i>h</i>.
          </p>
        </div>
        <nav>
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={reset}>
            <RotateCcw size={14} />
            Reset
          </button>
          <button
            onClick={() =>
              act(() => {
                setShared(true);
                void navigator.clipboard?.writeText(
                  `${labels[solid]} volume ${fmt(selectedVolume)} cubic units`,
                );
              })
            }
          >
            <Share2 size={14} />
            {shared ? "Shared" : "Share"}
          </button>
        </nav>
      </header>
      <section className="vol406-top">
        <article>
          <h2>
            <i>1</i>Select a solid
          </h2>
          <div>
            {solids.map((item) => (
              <button
                key={item}
                className={solid === item ? "active" : ""}
                onClick={() => act(() => setSolid(item))}
              >
                <SolidIcon solid={item} />
                <b>{labels[item]}</b>
              </button>
            ))}
          </div>
        </article>
        <article>
          <h2>
            <i>2</i>Fill with layers
          </h2>
          <label>
            Layers
            <input
              aria-label="Layers"
              type="range"
              min="1"
              max="10"
              value={layers}
              onChange={(event) =>
                act(() => setLayers(Number(event.target.value)))
              }
            />
            <output>{layers}</output>
          </label>
          <footer>
            <button onClick={() => act(() => setPlaying((v) => !v))}>
              <Play size={13} />
              {playing ? "Pause" : "Animation"}
            </button>
            <label>
              Auto
              <input
                aria-label="Auto layers"
                type="checkbox"
                checked={auto}
                onChange={() => act(() => setAuto((v) => !v))}
              />
            </label>
          </footer>
        </article>
      </section>
      <section className="vol406-compare">
        <h2>
          <i>3</i>Compare same base and height
        </h2>
        <div>
          {solids.map((item) => (
            <VolumeCard
              key={item}
              solid={item}
              selected={solid === item}
              baseArea={baseArea}
              height={height}
              a={a}
              b={b}
              layers={layers}
              slice={slice}
              showSlice={showSlice}
              volume={
                item === "pyramid" || item === "cone"
                  ? pyramidVolume
                  : item === "sphere"
                    ? sphereVolume
                    : prismVolume
              }
              onSelect={() => act(() => setSolid(item))}
            />
          ))}
        </div>
        <footer>
          <span>
            Same base area<b>B = {fmt(baseArea)} u²</b>
          </span>
          <span>
            Same height<b>h = {fmt(height)} u</b>
          </span>
          <span>
            Volume ratios
            <b>
              Prism : Pyramid/Cone = 3 : 1<br />
              Prism : Sphere ≈ {fmt(prismVolume / sphereVolume)} : 1
            </b>
          </span>
        </footer>
        <aside>
          <label>
            Slice at height <output>{fmt(slice)} u</output>
            <small>Cross-sections at this height have the same area.</small>
          </label>
          <span>0</span>
          <input
            aria-label="Slice height"
            type="range"
            min="0"
            max={height}
            step=".1"
            value={slice}
            onChange={(event) =>
              act(() => setSlice(Number(event.target.value)))
            }
          />
          <span>{fmt(height)} u</span>
          <label>
            Show cross-section
            <input
              aria-label="Show cross-section"
              type="checkbox"
              checked={showSlice}
              onChange={() => act(() => setShowSlice((v) => !v))}
            />
          </label>
        </aside>
      </section>
      <section className="vol406-tools">
        <article>
          <h2>
            <i>4</i>Dimension controls
          </h2>
          <Stepper
            label="Base area, B (u²)"
            value={baseArea}
            onChange={(value) =>
              act(() => {
                setBaseArea(value);
                setA(value / b);
              })
            }
          />
          <Stepper
            label="Height, h (u)"
            value={height}
            onChange={(value) =>
              act(() => {
                setHeight(value);
                setSlice((current) => Math.min(current, value));
              })
            }
          />
          <LockKeyhole className="vol406-lock" size={12} />
          <hr />
          <p>Edit base dimensions</p>
          <nav>
            <button
              className={solid === "prism" ? "active" : ""}
              onClick={() => act(() => setSolid("prism"))}
            >
              Prism (a, b)
            </button>
            <button
              className={
                solid === "cylinder" || solid === "cone" ? "active" : ""
              }
              onClick={() => act(() => setSolid("cylinder"))}
            >
              Cylinder/Cone (r)
            </button>
          </nav>
          <div className="vol406-dims">
            <Stepper
              label="a (u)"
              value={a}
              onChange={(value) => setDimension("a", value)}
            />
            <Stepper
              label="b (u)"
              value={b}
              onChange={(value) => setDimension("b", value)}
            />
          </div>
          <strong>
            Check: B = {fmt(a)} × {fmt(b)} = {fmt(a * b)} u²
          </strong>
        </article>
        <article>
          <h2>
            <i>5</i>Unit conversion
          </h2>
          <label>
            From
            <select
              aria-label="Convert from"
              value={from}
              onChange={(event) =>
                act(() => setFrom(event.target.value as Unit))
              }
            >
              <option value="u³">cubic units (u³)</option>
              <option value="m³">cubic meters (m³)</option>
              <option value="cm³">cubic centimeters (cm³)</option>
              <option value="mL">milliliters (mL)</option>
              <option value="L">liters (L)</option>
              <option value="ft³">cubic feet (ft³)</option>
              <option value="in³">cubic inches (in³)</option>
            </select>
          </label>
          <label>
            To
            <select
              aria-label="Convert to"
              value={to}
              onChange={(event) => act(() => setTo(event.target.value as Unit))}
            >
              <option value="m³">cubic meters (m³)</option>
              <option value="cm³">cubic centimeters (cm³)</option>
              <option value="mL">milliliters (mL)</option>
              <option value="L">liters (L)</option>
              <option value="ft³">cubic feet (ft³)</option>
              <option value="in³">cubic inches (in³)</option>
              <option value="u³">cubic units (u³)</option>
            </select>
          </label>
          <p>
            Multiply by{" "}
            <b>
              1 {from} = {factor(from, to).toFixed(6)} {to}
            </b>
          </p>
          <div>
            <span>Volume</span>
            <b>
              {fmt(selectedVolume)} {from}
            </b>
            <span>=</span>
            <strong>
              {converted.toFixed(3)} {to}
            </strong>
          </div>
          <footer className="vol406-quick">
            <span>Quick conversions</span>
            {(["cm³", "mL", "L", "m³", "ft³", "in³"] as Unit[]).map((unit) => (
              <button key={unit} onClick={() => act(() => setTo(unit))}>
                {unit}
              </button>
            ))}
          </footer>
        </article>
        <article>
          <h2>
            <i>6</i>Worked example
          </h2>
          <small>Example</small>
          <p>
            A square pyramid has base area 12 u² and height 5 u.
            <br />
            Find its volume.
          </p>
          <small>Solution</small>
          <div className="vol406-worked">
            V = ⅓ Bh
            <br />= ⅓ (12 u²)(5 u)
            <br />= 20 u³
          </div>
          <strong>Answer: 20 cubic units (u³)</strong>
        </article>
      </section>
      <section className="vol406-challenge">
        <h2>
          <i>7</i>Challenge
        </h2>
        <h3>Match 120 cubic units</h3>
        <p>
          Adjust dimensions to make the selected solid's volume equal to 120 u³.
        </p>
        <b>
          Selected solid: {labels[solid]} <SolidIcon solid={solid} />
        </b>
        <div className="vol406-challenge-controls">
          <Stepper
            label="Base area, B challenge"
            value={challengeB}
            onChange={(value) => {
              setChallengeB(value);
              setChecked(false);
            }}
          />
          <Stepper
            label="Height, h challenge"
            value={challengeH}
            onChange={(value) => {
              setChallengeH(value);
              setChecked(false);
            }}
          />
          <button
            onClick={() => {
              setChecked(true);
              onInteraction();
            }}
          >
            Check
          </button>
          {checked && (
            <strong className={correct ? "correct" : "wrong"}>
              {correct
                ? `Great! V = ${fmt(challengeVolume)} u³`
                : `Current volume is ${fmt(challengeVolume)} u³`}
            </strong>
          )}
        </div>
        <aside>
          <SolidMini solid={solid} baseArea={challengeB} height={challengeH} />
          <div>
            <span>Volume</span>
            <b>{fmt(challengeVolume)} u³</b>
          </div>
          {correct && <CheckCircle2 size={38} />}
          <p>
            V = {solid === "pyramid" || solid === "cone" ? "⅓Bh" : "Bh"} ={" "}
            {fmt(challengeVolume)} u³
          </p>
        </aside>
      </section>
      <nav className="vol406-next">
        <a href="/lessons/3d-mathematics/405-cross-sections">
          ←{" "}
          <span>
            PREVIOUS<small>Cross-Sections</small>
          </span>
        </a>
        <a href="/lessons/3d-mathematics/407-surface-area">
          <span>
            NEXT<small>Surface Area</small>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function VolumeCard({
  solid,
  selected,
  baseArea,
  height,
  a,
  b,
  layers,
  slice,
  showSlice,
  volume,
  onSelect,
}: {
  solid: Solid;
  selected: boolean;
  baseArea: number;
  height: number;
  a: number;
  b: number;
  layers: number;
  slice: number;
  showSlice: boolean;
  volume: number;
  onSelect: () => void;
}) {
  const baseRadius = Math.sqrt(baseArea / Math.PI),
    sphereRadius = Math.cbrt(12),
    radius = solid === "sphere" ? sphereRadius : baseRadius,
    side = Math.sqrt(baseArea);
  return (
    <button
      aria-label={`${labels[solid]}. Drag solid to rotate`}
      className={selected ? "selected" : ""}
      onClick={onSelect}
    >
      <h3>{labels[solid]}</h3>
      <p>
        {solid === "pyramid" || solid === "cone"
          ? "V = ⅓ Bh"
          : solid === "sphere"
            ? "V = ⁴⁄₃ πr³"
            : "V = Bh"}
      </p>
      <div>
        <Canvas
          data-testid={`geometry3d-volume-${solid}-canvas`}
          camera={{ position: [5, 4.5, 6], fov: 40 }}
          gl={{ antialias: true, preserveDrawingBuffer: true }}
        >
          <color attach="background" args={["#f8fbff"]} />
          <ambientLight intensity={1.5} />
          <directionalLight position={[5, 8, 6]} intensity={2} />
          <VolumeSolid
            solid={solid}
            height={height}
            a={a}
            b={b}
            radius={radius}
            side={side}
            layers={layers}
            slice={slice}
            showSlice={showSlice}
          />
          <OrbitControls makeDefault enableZoom={false} enablePan={false} />
        </Canvas>
      </div>
      <span>
        h <b>{fmt(height)} u</b>
      </span>
      <span>
        {solid === "prism"
          ? `a ${fmt(a)} · b ${fmt(b)}`
          : solid === "pyramid"
            ? `s ${fmt(side)}`
            : `r ${fmt(solid === "sphere" ? baseRadius : radius)}`}{" "}
        u
      </span>
      <footer>
        Base area, B<b>{fmt(baseArea)} u²</b>Volume
        <strong>{fmt(volume)} u³</strong>
      </footer>
    </button>
  );
}

function VolumeSolid({
  solid,
  height,
  a,
  b,
  radius,
  side,
  layers,
  slice,
  showSlice,
}: {
  solid: Solid;
  height: number;
  a: number;
  b: number;
  radius: number;
  side: number;
  layers: number;
  slice: number;
  showSlice: boolean;
}) {
  const h = solid === "sphere" ? radius * 2 : height,
    y0 = -h / 2;
  return (
    <group scale={0.72}>
      <gridHelper
        args={[7, 10, "#c6d8ee", "#e2eaf4"]}
        position={[0, -h / 2 - 0.04, 0]}
      />
      {solid === "prism" ? (
        <mesh>
          <boxGeometry args={[a, h, b]} />
          <meshStandardMaterial color="#5937d9" transparent opacity={0.75} />
          <Edges color="#357ef0" />
        </mesh>
      ) : solid === "cylinder" ? (
        <mesh>
          <cylinderGeometry args={[radius, radius, h, 48]} />
          <meshStandardMaterial color="#4d35d8" transparent opacity={0.75} />
          <Edges color="#5ea9ff" />
        </mesh>
      ) : solid === "pyramid" ? (
        <mesh>
          <coneGeometry args={[side / Math.SQRT2, h, 4]} />
          <meshStandardMaterial color="#5630d6" transparent opacity={0.76} />
          <Edges color="#5ba3ff" />
        </mesh>
      ) : solid === "cone" ? (
        <mesh>
          <coneGeometry args={[radius, h, 48]} />
          <meshStandardMaterial color="#5530d5" transparent opacity={0.76} />
          <Edges color="#5da8ff" />
        </mesh>
      ) : (
        <mesh>
          <sphereGeometry args={[radius, 48, 32]} />
          <meshStandardMaterial color="#5b35da" transparent opacity={0.74} />
          <Edges color="#65adff" />
        </mesh>
      )}
      <LayerLines
        solid={solid}
        h={h}
        a={a}
        b={b}
        radius={radius}
        layers={layers}
      />
      {showSlice && (
        <SliceShape
          solid={solid}
          h={h}
          a={a}
          b={b}
          radius={radius}
          y={clamp(slice + y0, y0, h / 2)}
        />
      )}
    </group>
  );
}

function LayerLines({
  solid,
  h,
  a,
  b,
  radius,
  layers,
}: {
  solid: Solid;
  h: number;
  a: number;
  b: number;
  radius: number;
  layers: number;
}) {
  return (
    <>
      {Array.from({ length: layers }, (_, i) => {
        const y = -h / 2 + ((i + 0.5) * h) / layers,
          progress = (y + h / 2) / h,
          scale =
            solid === "pyramid" || solid === "cone"
              ? 1 - progress
              : solid === "sphere"
                ? Math.sqrt(Math.max(0, 1 - (y / radius) ** 2))
                : 1;
        return solid === "prism" || solid === "pyramid" ? (
          <Line
            key={i}
            points={[
              [(-a / 2) * scale, y, (-b / 2) * scale],
              [(a / 2) * scale, y, (-b / 2) * scale],
              [(a / 2) * scale, y, (b / 2) * scale],
              [(-a / 2) * scale, y, (b / 2) * scale],
              [(-a / 2) * scale, y, (-b / 2) * scale],
            ]}
            color="#79c7ff"
            lineWidth={1}
          />
        ) : (
          <Line
            key={i}
            points={circlePoints(radius * scale, y)}
            color="#79c7ff"
            lineWidth={1}
          />
        );
      })}
    </>
  );
}
function SliceShape({
  solid,
  h,
  a,
  b,
  radius,
  y,
}: {
  solid: Solid;
  h: number;
  a: number;
  b: number;
  radius: number;
  y: number;
}) {
  const progress = (y + h / 2) / h,
    scale =
      solid === "pyramid" || solid === "cone"
        ? 1 - progress
        : solid === "sphere"
          ? Math.sqrt(Math.max(0, 1 - (y / radius) ** 2))
          : 1;
  return solid === "prism" || solid === "pyramid" ? (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[a * scale, b * scale]} />
      <meshBasicMaterial
        color="#bd55ee"
        transparent
        opacity={0.7}
        side={DoubleSide}
      />
    </mesh>
  ) : (
    <mesh position={[0, y, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[radius * scale, 48]} />
      <meshBasicMaterial
        color="#bd55ee"
        transparent
        opacity={0.7}
        side={DoubleSide}
      />
    </mesh>
  );
}
function SolidIcon({ solid }: { solid: Solid }) {
  return (
    <span className={`vol406-icon ${solid}`}>
      <i />
      <i />
      <i />
    </span>
  );
}
function SolidMini({
  solid,
  baseArea,
  height,
}: {
  solid: Solid;
  baseArea: number;
  height: number;
}) {
  const radius =
    solid === "sphere" ? Math.cbrt(12) : Math.sqrt(baseArea / Math.PI);
  const side = Math.sqrt(baseArea);
  return (
    <div className={`vol406-mini ${solid}`}>
      <Canvas
        camera={{ position: [5, 4.5, 6], fov: 40 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#ffffff"]} />
        <ambientLight intensity={1.5} />
        <directionalLight position={[5, 8, 6]} intensity={2} />
        <VolumeSolid
          solid={solid}
          height={height}
          a={side}
          b={side}
          radius={radius}
          side={side}
          layers={6}
          slice={0}
          showSlice={false}
        />
        <OrbitControls makeDefault enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
function Stepper({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="vol406-stepper">
      <span>{label}</span>
      <button onClick={() => onChange(clamp(value - 1, 0.1, 999))}>−</button>
      <input
        aria-label={label}
        type="number"
        step="1"
        value={round(value)}
        onChange={(event) =>
          onChange(clamp(Number(event.target.value), 0.1, 999))
        }
      />
      <button onClick={() => onChange(clamp(value + 1, 0.1, 999))}>+</button>
    </label>
  );
}
function volumeFor(solid: Solid, B: number, h: number) {
  return solid === "pyramid" || solid === "cone"
    ? (B * h) / 3
    : solid === "sphere"
      ? (4 / 3) * Math.PI * (h / 2) ** 3
      : B * h;
}
function factor(from: Unit, to: Unit) {
  const meters: Record<Unit, number> = {
    "u³": 1,
    "m³": 1,
    "cm³": 1e-6,
    mL: 1e-6,
    L: 0.001,
    "ft³": 0.028316846592,
    "in³": 0.000016387064,
  };
  return meters[from] / meters[to];
}
function circlePoints(r: number, y: number) {
  return Array.from({ length: 49 }, (_, i) => {
    const t = (i / 48) * Math.PI * 2;
    return [r * Math.cos(t), y, r * Math.sin(t)] as [number, number, number];
  });
}
const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, Number.isFinite(v) ? v : min)),
  round = (v: number) => Math.round(v * 10000) / 10000,
  fmt = (v: number) =>
    Number.isInteger(round(v)) ? String(round(v)) : v.toFixed(2);
