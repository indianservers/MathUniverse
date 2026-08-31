import { Billboard, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./LinesTargetLesson381.css";

type Point = [number, number, number];
const initialP: Point = [1, 2, 1],
  initialV: Point = [2, 1, 3];
const clean = (value: number) => Number(value.toFixed(1));
const at = (p: Point, v: Point, t: number): Point =>
  p.map((value, index) => clean(value + t * v[index])) as Point;

export default function LinesTargetLesson381({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [p, setP] = useState<Point>(initialP),
    [v, setV] = useState<Point>(initialV),
    [t, setT] = useState(1);
  const [samples, setSamples] = useState(true),
    [step, setStep] = useState(true),
    [equations, setEquations] = useState(true);
  const [solution, setSolution] = useState(true),
    [tab, setTab] = useState("Interaction + visualization"),
    [expanded, setExpanded] = useState(false),
    [cameraReset, setCameraReset] = useState(0),
    [actions, setActions] = useState(0);
  const selected = at(p, v, t),
    minus = at(p, v, -1);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setP(initialP);
    setV(initialV);
    setT(1);
    setSamples(true);
    setStep(true);
    setEquations(true);
    setSolution(true);
    setTab("Interaction + visualization");
    setExpanded(false);
    setCameraReset((value) => value + 1);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const update = (
    setter: React.Dispatch<React.SetStateAction<Point>>,
    index: number,
    value: number,
  ) =>
    act(() =>
      setter(
        (point) =>
          point.map((item, itemIndex) =>
            itemIndex === index ? clean(value) : item,
          ) as Point,
      ),
    );

  return (
    <section
      className={`cs378-page l381-page ${expanded ? "expanded" : ""}`}
      data-testid="geometry3d-mockup-0566"
      data-object-model="threejs-parametric-line-anchor-direction-vector-live-t-sample-points-direction-step-equations-orbit-challenge"
      data-anchor={JSON.stringify(p)}
      data-vector={JSON.stringify(v)}
      data-t={t}
      data-selected={JSON.stringify(selected)}
      data-minus={JSON.stringify(minus)}
      data-samples={samples}
      data-step={step}
      data-equations={equations}
      data-solution={solution}
      data-tab={tab}
      data-expanded={expanded}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Lines in 3D</h1>
        <p>Construct spatial lines.</p>
        <nav>
          <span>Intermediate-Advanced</span>
          <span>3D Lab</span>
          <span>3D Calculator</span>
          <span>6-10 min</span>
        </nav>
        <div className="cs378-actions">
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={() => act(() => {})}>
            <Share2 />
            Share
          </button>
          <button onClick={() => act(() => {})}>
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
      <section className="l381-lab">
        <header>
          <div>
            <small>INTERACTION · 3D LINE BUILDER</small>
            <h2>Construct a line from a point and a direction vector.</h2>
          </div>
          <strong>✓ All changes saved</strong>
          <span>Auto</span>
          <button
            title="Toggle fullscreen"
            onClick={() => act(() => setExpanded((value) => !value))}
          >
            <Maximize2 />
          </button>
        </header>
        <div className="l381-main">
          <article className="l381-scene">
            <div className="l381-canvas" data-testid="geometry3d-lines-canvas">
              <Canvas camera={{ position: [8, 6, 11], fov: 43 }} dpr={[1, 1.5]}>
                <color attach="background" args={["#06172b"]} />
                <ambientLight intensity={1.5} />
                <directionalLight position={[7, 9, 5]} intensity={2} />
                <LineScene
                  p={p}
                  v={v}
                  t={t}
                  samples={samples}
                  step={step}
                  equations={equations}
                  cameraReset={cameraReset}
                />
              </Canvas>
            </div>
            <div className="l381-drag">◉ &nbsp; DRAG TO ROTATE</div>
            <div className="l381-legend">
              <span>x-axis</span>
              <span>y-axis</span>
              <span>z-axis</span>
              <span>Line</span>
              <span>Point</span>
              <span>Direction vector v</span>
            </div>
          </article>
          <aside className="l381-side">
            <section className="l381-controls">
              <h3>Line controls</h3>
              <p>Anchor point P₀ = (x₀,y₀,z₀)</p>
              <Triple
                name="Anchor"
                prefix="0"
                point={p}
                update={(index, value) => update(setP, index, value)}
              />
              <p>Direction vector v = (vₓ,vᵧ,vz)</p>
              <Triple
                name="Direction"
                prefix="v"
                point={v}
                update={(index, value) => update(setV, index, value)}
              />
              <label className="l381-t">
                Parameter t
                <input
                  aria-label="Parameter t"
                  type="range"
                  min="-5"
                  max="5"
                  step="1"
                  value={t}
                  onChange={(event) =>
                    act(() => setT(Number(event.target.value)))
                  }
                />
                <input
                  aria-label="Parameter t value"
                  type="number"
                  min="-5"
                  max="5"
                  value={t}
                  onChange={(event) =>
                    act(() => setT(Number(event.target.value)))
                  }
                />
              </label>
              <Toggle
                label="Show sample points (t = -1, 0, 1)"
                checked={samples}
                set={setSamples}
                act={act}
              />
              <Toggle
                label={`Show direction step (+${v.join(", +")})`}
                checked={step}
                set={setStep}
                act={act}
              />
              <Toggle
                label="Show parametric equations"
                checked={equations}
                set={setEquations}
                act={act}
              />
            </section>
            <section className="l381-results">
              <h3>Live results</h3>
              <strong>
                r(t) = ({p.join(", ")}) + t ({v.join(", ")})
              </strong>
              <p>
                Selected t = {t}
                <br />
                Point: <b>({selected.join(", ")})</b>
              </p>
              <p>
                At t = −1
                <br />
                Point: <b>({minus.join(", ")})</b>
              </p>
            </section>
          </aside>
        </div>
      </section>
      <section className="l381-learning">
        <article>
          <h2>Formula</h2>
          <p>A line in 3D through P₀ with direction v=(a,b,c)</p>
          <strong>
            x=x₀+at
            <br />
            y=y₀+bt
            <br />
            z=z₀+ct
          </strong>
          <p>where t ∈ ℝ.</p>
        </article>
        <article>
          <h2>Worked example</h2>
          <p>Given P₀=(1,2,1), v=(2,1,3).</p>
          <p>Parametric equations:</p>
          <strong>
            x=1+2t
            <br />
            y=2+t
            <br />
            z=1+3t
          </strong>
          <p>
            Check:
            <br />
            t=0 → (1,2,1)
            <br />
            t=1 → (3,3,4), t=−1 → (−1,1,−2)
          </p>
        </article>
        <article className="l381-challenge">
          <h2>Practice challenge</h2>
          <p>For P=(0,1,2) and v=(1,−2,1), find the point when t=3.</p>
          <button onClick={() => act(() => setSolution((value) => !value))}>
            Show solution⌄
          </button>
          {solution && (
            <strong>
              r(3)=(0,1,2)+3(1,−2,1)
              <br />
              =(3,−5,5)<small>Correct! ✓</small>
            </strong>
          )}
        </article>
      </section>
      <section className="l381-warning">
        <h2>⚠ Common misconception</h2>
        <p>
          <b>A direction vector is not a second point:</b> it tells how the
          coordinates change per step of t.
        </p>
        <p>
          Using a second point gives many valid direction vectors. Choose
          v=(x₁−x₀,y₁−y₀,z₁−z₀).
        </p>
        <div>
          <i>P₀</i> ───── ➜ <i>P₁</i>
        </div>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/380-distance-in-3d">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Distance in 3D
          </span>
        </a>
        <a href="/lessons/3d-mathematics/382-planes">
          <span>
            <small>NEXT</small>Planes
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function Triple({
  name,
  prefix,
  point,
  update,
}: {
  name: string;
  prefix: string;
  point: Point;
  update: (index: number, value: number) => void;
}) {
  return (
    <div className="l381-triple">
      {point.map((value, index) => (
        <label key={index}>
          {prefix === "v"
            ? `v${["x", "y", "z"][index]}`
            : `${["x", "y", "z"][index]}${prefix}`}
          <input
            aria-label={`${name} ${["x", "y", "z"][index]}`}
            type="number"
            min="-6"
            max="6"
            step="1"
            value={value}
            onChange={(event) => update(index, Number(event.target.value))}
          />
        </label>
      ))}
    </div>
  );
}
function Toggle({
  label,
  checked,
  set,
  act,
}: {
  label: string;
  checked: boolean;
  set: (value: boolean) => void;
  act: (fn: () => void) => void;
}) {
  return (
    <label className="cs378-toggle">
      {label}
      <input
        aria-label={label}
        type="checkbox"
        checked={checked}
        onChange={(event) => act(() => set(event.target.checked))}
      />
    </label>
  );
}
function LineScene({
  p,
  v,
  t,
  samples,
  step,
  equations,
  cameraReset,
}: {
  p: Point;
  v: Point;
  t: number;
  samples: boolean;
  step: boolean;
  equations: boolean;
  cameraReset: number;
}) {
  const world = (point: Point): Point => [point[0], point[2], point[1]],
    start = world(at(p, v, -4)),
    end = world(at(p, v, 4)),
    pw = world(p),
    selected = world(at(p, v, t));
  return (
    <>
      <CameraHome token={cameraReset} />
      <OrbitControls
        key={cameraReset}
        makeDefault
        target={[1, 1, 1]}
        minDistance={7}
        maxDistance={24}
      />
      <gridHelper args={[16, 16, "#244a78", "#173150"]} />
      <Line
        points={[
          [-7, 0, 0],
          [8, 0, 0],
        ]}
        color="#ef5148"
        lineWidth={3}
      />
      <Line
        points={[
          [0, 0, -7],
          [0, 0, 8],
        ]}
        color="#56b43c"
        lineWidth={3}
      />
      <Line
        points={[
          [0, -6, 0],
          [0, 8, 0],
        ]}
        color="#23bcd9"
        lineWidth={3}
      />
      <Line points={[start, end]} color="#8247df" lineWidth={5} />
      {step && (
        <Line points={[pw, world(at(p, v, 1))]} color="#f6bd2a" lineWidth={6} />
      )}{" "}
      {samples &&
        [-1, 0, 1].map((sample) => {
          const point = at(p, v, sample);
          return (
            <group key={sample} position={world(point)}>
              <mesh>
                <sphereGeometry args={[0.15, 20, 20]} />
                <meshStandardMaterial
                  color={sample === 0 ? "#22c7e5" : "#8247df"}
                  emissiveIntensity={0.3}
                />
              </mesh>
              <Billboard position={[0.35, 0.3, 0]}>
                <Text fontSize={0.27} color="#fff">
                  t = {sample}
                  {"\n"}({point.join(", ")})
                </Text>
              </Billboard>
            </group>
          );
        })}
      <group position={selected}>
        <mesh>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial
            color="#8247df"
            emissive="#8247df"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>
      {equations && (
        <Billboard position={[p[0] + 1.2, p[2] + 0.8, p[1]]}>
          <Text fontSize={0.27} color="#22c7e5">
            P₀ = ({p.join(", ")})
          </Text>
        </Billboard>
      )}
      <Text position={[0, 7.3, 0]} fontSize={0.35} color="#23bcd9">
        z
      </Text>
    </>
  );
}
function CameraHome({ token }: { token: number }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(8, 6, 11);
    camera.lookAt(1, 1, 1);
    camera.updateProjectionMatrix();
  }, [camera, token]);
  return null;
}
