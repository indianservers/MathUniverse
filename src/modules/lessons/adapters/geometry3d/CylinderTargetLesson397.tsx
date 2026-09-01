import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./CylinderTargetLesson397.css";

type View = "Rotate" | "Top" | "Front" | "Right";
type Mode = "Fill" | "Unfold net" | "Cross-section";
const challengeOptions = [
  { label: "A", r: 3, h: 10, volume: 90 },
  { label: "B", r: 5, h: 9, volume: 225 },
  { label: "C", r: 2, h: 22.5, volume: 90 },
  { label: "D", r: 4, h: 5.625, volume: 90 },
];

export default function CylinderTargetLesson397({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [radius, setRadius] = useState(3);
  const [height, setHeight] = useState(5);
  const [fill, setFill] = useState(72);
  const [mode, setMode] = useState<Mode>("Fill");
  const [view, setView] = useState<View>("Rotate");
  const [cameraReset, setCameraReset] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [section, setSection] = useState("Horizontal slice");
  const [tab, setTab] = useState("Interaction + visualization");
  const [answer, setAnswer] = useState("A");
  const [graded, setGraded] = useState(false);
  const [challenge, setChallenge] = useState(0);
  const [shared, setShared] = useState(false);
  const [actions, setActions] = useState(0);
  const timer = useRef<number | null>(null);
  const volume = Math.PI * radius * radius * height;
  const curved = 2 * Math.PI * radius * height;
  const surface = 2 * Math.PI * radius * (height + radius);
  const sectionArea =
    section === "Horizontal slice"
      ? Math.PI * radius * radius
      : section === "Axial slice"
        ? 2 * radius * height
        : radius * height;
  const correctAnswers = challenge % 2 === 0 ? ["A"] : ["C"];
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    if (timer.current !== null) window.clearInterval(timer.current);
    timer.current = null;
    setRadius(3);
    setHeight(5);
    setFill(72);
    setMode("Fill");
    setView("Rotate");
    setCameraReset((value) => value + 1);
    setAnimating(false);
    setSection("Horizontal slice");
    setTab("Interaction + visualization");
    setAnswer("A");
    setGraded(false);
    setChallenge(0);
    setShared(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  useEffect(
    () => () => {
      if (timer.current !== null) window.clearInterval(timer.current);
    },
    [],
  );
  const toggleAnimation = () =>
    act(() => {
      if (timer.current !== null) {
        window.clearInterval(timer.current);
        timer.current = null;
        setAnimating(false);
        return;
      }
      setAnimating(true);
      timer.current = window.setInterval(
        () => setFill((value) => (value >= 100 ? 0 : value + 2)),
        90,
      );
    });
  const share = () =>
    act(() => {
      setShared(true);
      void navigator.clipboard?.writeText(
        `Cylinder r=${radius}, h=${height}, V=${format(volume)} cm^3`,
      );
    });

  return (
    <section
      className="cs378-page cyl397-page"
      data-testid="geometry3d-mockup-0582"
      data-object-model="threejs-dedicated-parametric-cylinder-liquid-fill-radius-height-net-cross-sections-camera-presets-orbit-zoom-exact-volume-curved-total-surface-graded-challenge"
      data-radius={radius}
      data-height={height}
      data-fill={fill}
      data-volume={round(volume)}
      data-curved={round(curved)}
      data-surface={round(surface)}
      data-mode={mode}
      data-view={view}
      data-animating={animating}
      data-section={section}
      data-section-area={round(sectionArea)}
      data-tab={tab}
      data-answer={answer}
      data-challenge={challenge}
      data-graded={graded}
      data-correct={graded && correctAnswers.includes(answer)}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="cyl397-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <small>3D GEOMETRY AND SOLIDS</small>
        </div>
        <h1>Cylinder</h1>
        <p>Explore circular extrusion.</p>
        <nav className="cyl397-meta">
          <span>Intermediate–Advanced</span>
          <span>3D Lab</span>
          <span>3D Calculator</span>
          <span>6–10 min</span>
        </nav>
        <div className="cyl397-actions">
          <button onClick={() => act(() => setTab("English (English)"))}>
            English (English)⌄
          </button>
          <button onClick={reset}>↻ Reset</button>
          <button onClick={share}>{shared ? "✓ Shared" : "⌯ Share"}</button>
          <button
            onClick={() =>
              act(() =>
                document
                  .querySelector(".cyl397-lab")
                  ?.scrollIntoView({ behavior: "smooth" }),
              )
            }
          >
            ↗ Workspace
          </button>
        </div>
      </header>
      <nav className="cyl397-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
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

      <section className="cyl397-lab">
        <aside className="cyl397-controls">
          <div className="cyl397-mode">
            {(["Fill", "Unfold net", "Cross-section"] as Mode[]).map((item) => (
              <button
                key={item}
                className={mode === item ? "active" : ""}
                onClick={() => act(() => setMode(item))}
              >
                {item}
              </button>
            ))}
          </div>
          <RangeControl
            label="Radius"
            symbol="r"
            value={radius}
            min={0.5}
            max={10}
            step={0.5}
            color="#168ee8"
            onChange={(value) => act(() => setRadius(value))}
          />
          <RangeControl
            label="Height"
            symbol="h"
            value={height}
            min={0.5}
            max={15}
            step={0.5}
            color="#7142df"
            onChange={(value) => act(() => setHeight(value))}
          />
          <RangeControl
            label="Fill"
            symbol="Volume filled"
            value={fill}
            min={0}
            max={100}
            step={1}
            color="#188eea"
            suffix="%"
            onChange={(value) => act(() => setFill(value))}
          />
          <h3>View</h3>
          <div className="cyl397-view">
            {(["Rotate", "Top", "Front", "Right"] as View[]).map((item) => (
              <button
                key={item}
                className={view === item ? "active" : ""}
                onClick={() =>
                  act(() => {
                    setView(item);
                    setCameraReset((value) => value + 1);
                  })
                }
              >
                {item}
              </button>
            ))}
          </div>
          <div className="cyl397-animate">
            <b>Animate fill</b>
            <button aria-label="Animate fill" onClick={toggleAnimation}>
              {animating ? "Ⅱ" : "▶"}
            </button>
            <input
              aria-label="Animation speed"
              type="range"
              min="1"
              max="5"
              defaultValue="3"
              onChange={() => onInteraction()}
            />
            <button
              aria-label="Restart fill animation"
              onClick={() => act(() => setFill(0))}
            >
              ↻
            </button>
          </div>
        </aside>

        <article
          className="cyl397-scene"
          data-testid="geometry3d-cylinder-canvas"
        >
          <Canvas
            camera={{ position: [6.8, 5.2, 7.5], fov: 40 }}
            dpr={[1, 1.5]}
          >
            <color attach="background" args={["#ffffff"]} />
            <ambientLight intensity={2.1} />
            <directionalLight position={[5, 8, 6]} intensity={2.5} />
            <CylinderModel radius={radius} height={height} fill={fill} />
            <CameraRig view={view} reset={cameraReset} />
          </Canvas>
          <div className="cyl397-radius-guide">
            <i>r</i>
          </div>
          <div className="cyl397-height-guide">
            <i>h</i>
          </div>
          <span>Drag to rotate • Scroll to zoom</span>
          <nav>
            <button
              className={view === "Rotate" ? "active" : ""}
              onClick={() => act(() => setView("Rotate"))}
            >
              ⌁
            </button>
            <button
              onClick={() => act(() => setCameraReset((value) => value + 1))}
            >
              ↻
            </button>
            <button
              onClick={() => act(() => setCameraReset((value) => value + 1))}
            >
              ⊕
            </button>
            <button onClick={() => act(() => setView("Top"))}>⌂</button>
            <button onClick={() => act(() => setView("Front"))}>⛶</button>
          </nav>
        </article>

        <aside className="cyl397-formulas">
          <h2>Live formulas</h2>
          <p>
            <i>V</i> = π r² h
          </p>
          <p>
            <i>C</i>
            <sub>curved</sub> = 2 π r h
          </p>
          <p>
            <strong>TSA</strong> = 2 π r (h + r)
          </p>
          <hr />
          <h2>Live values</h2>
          <p>
            <i>r</i> = {radius.toFixed(2)} cm
          </p>
          <p>
            <i>h</i> = {height.toFixed(2)} cm
          </p>
          <p>
            <i>V</i> = π ({radius})² ({height}) ={" "}
            {formatPi(radius * radius * height)} cm³
            <br />≈ {format(volume)} cm³
          </p>
          <p>
            <i>C</i>
            <sub>curved</sub> = 2 π ({radius}) ({height}) ={" "}
            {formatPi(2 * radius * height)} cm²
            <br />≈ {format(curved)} cm²
          </p>
          <p>
            <strong>TSA</strong> = 2 π ({radius}) ({height} + {radius}) ={" "}
            {formatPi(2 * radius * (height + radius))} cm²
            <br />≈ {format(surface)} cm²
          </p>
        </aside>
      </section>

      <section className="cyl397-diagrams">
        <article>
          <h2>Unfold net ⓘ</h2>
          <CylinderNet radius={radius} height={height} />
        </article>
        <article>
          <header>
            <h2>Cross-section ⓘ</h2>
            <select
              aria-label="Cross-section type"
              value={section}
              onChange={(event) => act(() => setSection(event.target.value))}
            >
              <option>Horizontal slice</option>
              <option>Axial slice</option>
              <option>Half axial slice</option>
            </select>
          </header>
          <CrossSection type={section} radius={radius} height={height} />
          <p>
            Area ={" "}
            {section === "Horizontal slice"
              ? "π r²"
              : section === "Axial slice"
                ? "2rh"
                : "rh"}{" "}
            = {format(sectionArea)} cm²
          </p>
        </article>
      </section>

      <section className="cyl397-bottom">
        <article className="cyl397-example">
          <h2>☆ Worked example</h2>
          <div>
            <b>Given</b>
            <br />
            <i>r</i> = {radius} cm, <i>h</i> = {height} cm
          </div>
          <div>
            <b>Find</b>
            <br />
            Volume (V) and Total Surface Area (TSA)
          </div>
          <p>
            <b>Solution</b>
            <br />
            <i>V</i> = πr²h = {formatPi(radius * radius * height)} cm³ ≈{" "}
            {format(volume)} cm³
            <br />
            <strong>TSA</strong> = 2πr(h+r) ={" "}
            {formatPi(2 * radius * (height + radius))} cm² ≈ {format(surface)}{" "}
            cm²
          </p>
          <footer>
            Answer: V = {formatPi(radius * radius * height)} cm³, TSA ={" "}
            {formatPi(2 * radius * (height + radius))} cm² ✓
          </footer>
        </article>
        <article className="cyl397-challenge">
          <h2>☆ Challenge: Match the target volume</h2>
          <strong>
            Target volume: {challenge % 2 === 0 ? "90π" : "90π"} cm³
          </strong>
          <p>Choose the cylinder that matches the target (within tolerance).</p>
          <fieldset>
            {challengeOptions.map((item) => (
              <label
                key={item.label}
                className={answer === item.label ? "selected" : ""}
              >
                <input
                  type="radio"
                  name="cylinder-answer"
                  aria-label={item.label}
                  value={item.label}
                  checked={answer === item.label}
                  onChange={() =>
                    act(() => {
                      setAnswer(item.label);
                      setGraded(false);
                    })
                  }
                />
                <b>r = {item.r} cm</b>
                <br />h = {item.h} cm
                <br />V = {item.volume}π cm³
              </label>
            ))}
          </fieldset>
          <footer>
            <span>Tip: V = πr²h</span>
            <button onClick={() => act(() => setGraded(true))}>
              {graded
                ? correctAnswers.includes(answer)
                  ? "✓ Correct"
                  : "Try again"
                : "Check answer"}
            </button>
            <button
              onClick={() =>
                act(() => {
                  setChallenge((value) => value + 1);
                  setAnswer("C");
                  setGraded(false);
                })
              }
            >
              New challenge
            </button>
          </footer>
        </article>
      </section>
      <nav className="cyl397-nav">
        <a href="/lessons/3d-mathematics/396-regular-polyhedra">
          ← Previous
          <br />
          Regular Polyhedra
        </a>
        <a href="/lessons/3d-mathematics/398-cone">
          Next →<br />
          Cone
        </a>
      </nav>
    </section>
  );
}

function RangeControl({
  label,
  symbol,
  value,
  min,
  max,
  step,
  color,
  suffix = " cm",
  onChange,
}: {
  label: string;
  symbol: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="cyl397-range">
      <b>{label} ⓘ</b>
      <div>
        <input
          aria-label={label}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          style={{ accentColor: color }}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          aria-label={`${label} value`}
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span>{suffix}</span>
      </div>
      <small>
        {min}
        <span>{max}</span>
      </small>
      <em>
        {symbol} = {value.toFixed(2)}
        {suffix}
      </em>
    </label>
  );
}

function CylinderModel({
  radius,
  height,
  fill,
}: {
  radius: number;
  height: number;
  fill: number;
}) {
  const scale = 2.45 / Math.max(radius, height / 2);
  const liquidHeight = Math.max(0.02, (height * fill) / 100);
  return (
    <group scale={[scale * 0.57, scale, scale * 0.57]}>
      <mesh>
        <cylinderGeometry args={[radius, radius, height, 64, 1, true]} />
        <meshPhysicalMaterial
          color="#bce7fb"
          transparent
          opacity={0.3}
          roughness={0.2}
          side={2}
        />
        <Edges color="#168ee8" />
      </mesh>
      <mesh position={[0, -height / 2 + liquidHeight / 2, 0]}>
        <cylinderGeometry
          args={[radius * 0.99, radius * 0.99, liquidHeight, 64]}
        />
        <meshPhysicalMaterial
          color="#178be4"
          transparent
          opacity={0.72}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, height / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.985, radius, 64]} />
        <meshBasicMaterial color="#087ed8" side={2} />
      </mesh>
    </group>
  );
}

function CameraRig({ view, reset }: { view: View; reset: number }) {
  const { camera } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  useEffect(() => {
    const positions: Record<View, [number, number, number]> = {
      Rotate: [6.8, 5.2, 7.5],
      Top: [0, 10.5, 0.01],
      Front: [0, 0.4, 10],
      Right: [10, 0.4, 0],
    };
    camera.position.set(...positions[view]);
    camera.lookAt(0, 0, 0);
    controls.current?.target.set(0, 0, 0);
    controls.current?.update();
  }, [camera, reset, view]);
  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableRotate={view === "Rotate"}
      enablePan={false}
      minDistance={5}
      maxDistance={15}
    />
  );
}

function CylinderNet({ radius, height }: { radius: number; height: number }) {
  const width = Math.min(250, 54 + radius * 28);
  const rectHeight = Math.min(115, 34 + height * 12);
  const circle = Math.min(62, 28 + radius * 8);
  return (
    <div
      className="cyl397-net"
      style={
        {
          "--net-width": `${width}px`,
          "--net-height": `${rectHeight}px`,
          "--net-circle": `${circle}px`,
        } as React.CSSProperties
      }
    >
      <span>r</span>
      <div />
      <div />
      <div />
      <i>2π r</i>
      <b>h</b>
    </div>
  );
}

function CrossSection({
  type,
  radius,
  height,
}: {
  type: string;
  radius: number;
  height: number;
}) {
  if (type === "Horizontal slice")
    return (
      <div
        className="cyl397-circle"
        style={{ width: 68 + radius * 9, height: 68 + radius * 9 }}
      >
        r
      </div>
    );
  return (
    <div
      className="cyl397-rectangle"
      style={{ width: 75 + radius * 14, height: 50 + height * 8 }}
    >
      {type === "Axial slice" ? "2r × h" : "r × h"}
    </div>
  );
}
const round = (value: number) => Number(value.toFixed(3));
const format = (value: number) => value.toFixed(2);
const formatPi = (coefficient: number) => `${Number(coefficient.toFixed(2))}π`;
