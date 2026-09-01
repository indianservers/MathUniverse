import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./ConeTargetLesson398.css";

export default function ConeTargetLesson398({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [radius, setRadius] = useState(3);
  const [height, setHeight] = useState(4);
  const [tab, setTab] = useState("Interaction");
  const [cameraReset, setCameraReset] = useState(0);
  const [shared, setShared] = useState(false);
  const [steps, setSteps] = useState([false, false, false, false]);
  const [actions, setActions] = useState(0);
  const slant = Math.sqrt(radius * radius + height * height);
  const volumeCoefficient = (radius * radius * height) / 3;
  const cylinderCoefficient = radius * radius * height;
  const curvedCoefficient = radius * slant;
  const totalCoefficient = radius * (slant + radius);
  const sectorAngle = (360 * radius) / slant;
  const exact345 = near(radius, 3) && near(height, 4) && near(slant, 5);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setRadius(3);
    setHeight(4);
    setTab("Interaction");
    setCameraReset((value) => value + 1);
    setShared(false);
    setSteps([false, false, false, false]);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  const share = () =>
    act(() => {
      setShared(true);
      void navigator.clipboard?.writeText(
        `Cone r=${radius}, h=${height}, l=${fmt(slant)}, V=${fmt(volumeCoefficient)}π`,
      );
    });

  return (
    <section
      className="cs378-page cone398-page"
      data-testid="geometry3d-mockup-0583"
      data-object-model="threejs-dedicated-parametric-cone-radius-height-computed-slant-orbit-sector-net-arc-angle-cylinder-comparison-exact-volume-curved-total-area-345-challenge"
      data-radius={radius}
      data-height={height}
      data-slant={round(slant)}
      data-volume-coefficient={round(volumeCoefficient)}
      data-cylinder-coefficient={round(cylinderCoefficient)}
      data-curved-coefficient={round(curvedCoefficient)}
      data-total-coefficient={round(totalCoefficient)}
      data-sector-angle={round(sectorAngle)}
      data-tab={tab}
      data-shared={shared}
      data-steps={JSON.stringify(steps)}
      data-complete={steps.every(Boolean) && exact345}
      data-actions={actions}
    >
      <header className="cone398-hero">
        <div className="cone398-intro">
          <div>
            <small>3D MATHEMATICS</small>
            <small>GEOMETRY AND SOLIDS</small>
          </div>
          <h1>Cone</h1>
          <p>
            Explore tapering solids through interaction, visualization, and
            formulas.
          </p>
          <nav>
            <span>Intermediate–Advanced</span>
            <span>3D Lab</span>
            <span>3D Calculator</span>
            <span>6–10 min</span>
          </nav>
          <div className="cone398-actions">
            <button onClick={() => act(() => setTab("English (English)"))}>
              English (English)⌄
            </button>
            <button onClick={reset}>↻ Reset</button>
            <button onClick={share}>{shared ? "✓ Shared" : "⌯ Share"}</button>
            <button
              onClick={() =>
                act(() =>
                  document
                    .querySelector(".cone398-work")
                    ?.scrollIntoView({ behavior: "smooth" }),
                )
              }
            >
              ↗ Workspace
            </button>
          </div>
        </div>
        <aside>
          <h2>What you’ll learn</h2>
          <p>✓ Understand parts and measures of a cone</p>
          <p>✓ Derive formulas for area and volume</p>
          <p>✓ Visualize unfolding net and arc length</p>
          <p>✓ Compare cone with a cylinder</p>
          <p>✓ Solve real problems and challenges</p>
        </aside>
      </header>
      <nav className="cone398-tabs">
        {["Interaction", "Explore", "Formulas", "Examples", "Challenge"].map(
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

      <section className="cone398-work">
        <article className="cone398-model">
          <h2>1. Cone (rotate & explore) ⓘ</h2>
          <div className="cone398-canvas" data-testid="geometry3d-cone-canvas">
            <Canvas camera={{ position: [6, 4.7, 7], fov: 42 }} dpr={[1, 1.5]}>
              <color attach="background" args={["#061327"]} />
              <ambientLight intensity={1.9} />
              <directionalLight position={[5, 8, 6]} intensity={3} />
              <ConeMesh radius={radius} height={height} />
              <OrbitControls
                key={cameraReset}
                makeDefault
                enablePan={false}
                minDistance={4}
                maxDistance={12}
              />
            </Canvas>
            <div className="cone398-label cone398-r">r</div>
            <div className="cone398-label cone398-h">h</div>
            <div className="cone398-label cone398-l">l</div>
            <nav>
              <button
                aria-label="Orbit cone"
                onClick={() => act(() => setCameraReset((value) => value + 1))}
              >
                ☝
              </button>
              <button
                aria-label="Reset cone camera"
                onClick={() => act(() => setCameraReset((value) => value + 1))}
              >
                ◎
              </button>
            </nav>
            <div className="cone398-sliders">
              <Param
                label="Radius"
                symbol="r"
                value={radius}
                max={10}
                color="#188fe8"
                onChange={(value) => act(() => setRadius(value))}
              />
              <Param
                label="Height"
                symbol="h"
                value={height}
                max={10}
                color="#ff871d"
                onChange={(value) => act(() => setHeight(value))}
              />
              <Param
                label="Slant height"
                symbol="l"
                value={Number(slant.toFixed(2))}
                max={15}
                color="#35ae65"
                locked
                onChange={() => undefined}
              />
            </div>
          </div>
          <footer>
            ⓘ Right triangle (cross-section)
            <b>
              l² = r² + h²
              {near(slant * slant, radius * radius + height * height)
                ? "✓"
                : ""}
            </b>
            <span>
              {fmt(slant * slant)} = {fmt(radius * radius)} +{" "}
              {fmt(height * height)}
            </span>
          </footer>
        </article>

        <article className="cone398-net">
          <h2>2. Unfold net ⓘ</h2>
          <ConeSector radius={radius} slant={slant} />
          <div className="cone398-base-circle">
            <i>r = {fmt(radius)}</i>
          </div>
          <dl>
            <div>
              <dt>Arc length</dt>
              <dd>2πr = {fmt(2 * Math.PI * radius)}</dd>
            </div>
            <div>
              <dt>Sector angle</dt>
              <dd>θ = {fmt(sectorAngle)}°</dd>
            </div>
          </dl>
          <p>
            Arc length equals the circumference of the base.
            <br />
            <small>2πr = circumference</small>
          </p>
        </article>

        <article className="cone398-compare">
          <h2>3. Compare cylinder ⓘ</h2>
          <div className="cone398-comparison">
            <div className="cone398-mini-cone">
              <span />
            </div>
            <div className="cone398-mini-cylinder">
              <span />
            </div>
            <i>r = {fmt(radius)}</i>
            <b>h</b>
          </div>
          <p>
            For the same radius r and height h,
            <br />
            <strong>Volume of cone = 1/3 × Volume of cylinder</strong>
          </p>
          <dl>
            <div>
              <dt>Cone volume</dt>
              <dd>{fmt(volumeCoefficient)}π</dd>
            </div>
            <div>
              <dt>Cylinder volume</dt>
              <dd>{fmt(cylinderCoefficient)}π</dd>
            </div>
            <div>
              <dt>Ratio</dt>
              <dd>1 : 3</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="cone398-formulas">
        <h2>Key formulas</h2>
        <div>
          <article>
            <small>Volume</small>
            <p>V = ⅓ πr²h</p>
            <span>Cubic units</span>
          </article>
          <article>
            <small>Slant height</small>
            <p>l = √(r² + h²)</p>
            <span>Linear units</span>
          </article>
          <article>
            <small>Curved surface area</small>
            <p>
              A<sub>c</sub> = πrl
            </p>
            <span>Square units</span>
          </article>
          <article>
            <small>Total surface area</small>
            <p>
              A<sub>t</sub> = πr(l + r)
            </p>
            <span>Square units</span>
          </article>
        </div>
      </section>

      <section className="cone398-bottom">
        <article className="cone398-example">
          <h2>Worked example</h2>
          <p>
            <b>
              Example: Given r = {fmt(radius)}, h = {fmt(height)}
            </b>
          </p>
          <ol>
            <li>
              <b>Slant height</b>
              <br />l = √(r² + h²) = √({fmt(radius * radius)} +{" "}
              {fmt(height * height)}) = {fmt(slant)}
            </li>
            <li>
              <b>Volume</b>
              <br />V = ⅓πr²h = {fmt(volumeCoefficient)}π cubic units
            </li>
            <li>
              <b>Curved surface area</b>
              <br />A<sub>c</sub> = πrl = {fmt(curvedCoefficient)}π square units
            </li>
            <li>
              <b>Total surface area</b>
              <br />A<sub>t</sub> = πr(l+r) = {fmt(totalCoefficient)}π square
              units
            </li>
          </ol>
          <footer>✓ All results verified!</footer>
        </article>
        <article className="cone398-challenge">
          <div>
            <h2>Challenge</h2>
            <h3>Build a 3–4–5 cone</h3>
            <p>
              Adjust the sliders to create a cone where
              <br />
              <i>r = 3, h = 4, and l = 5.</i>
            </p>
            {[
              near(radius, 3),
              near(height, 4),
              near(slant, 5),
              near(slant * slant, radius * radius + height * height),
            ].map((ready, index) => (
              <label key={index} className={ready ? "ready" : ""}>
                <input
                  aria-label={`Challenge step ${index + 1}`}
                  type="checkbox"
                  checked={steps[index]}
                  onChange={() =>
                    act(() =>
                      setSteps((values) =>
                        values.map((value, i) =>
                          i === index ? !value : value,
                        ),
                      ),
                    )
                  }
                />
                {
                  [
                    "Set radius r = 3",
                    "Set height h = 4",
                    "Verify slant height l = 5",
                    "Confirm right triangle holds",
                  ][index]
                }{" "}
                {ready ? "✓" : ""}
              </label>
            ))}
            <button disabled={!steps.every(Boolean) || !exact345}>
              {steps.every(Boolean) && exact345
                ? "Badge earned ✓"
                : "▣ Complete all steps to earn badge"}
            </button>
          </div>
          <aside>
            <div>✦</div>
            <strong>3–4–5</strong>
            <span>CONE BUILDER</span>
            <b>★ ★ ★</b>
          </aside>
        </article>
      </section>
      <nav className="cone398-nav">
        <a href="/lessons/3d-mathematics/397-cylinder">
          ← Previous
          <br />
          Cylinder
        </a>
        <a href="/lessons/3d-mathematics/399-sphere">
          Next →<br />
          Sphere
        </a>
      </nav>
      <footer className="cone398-footer">
        <b>⌘ Math Universe</b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
        <nav>
          <button onClick={() => act(() => setTab("Sitemap"))}>Sitemap</button>
          <button onClick={() => act(() => setTab("Docs"))}>Docs</button>
          <button onClick={() => act(() => setTab("About"))}>About</button>
        </nav>
      </footer>
    </section>
  );
}

function Param({
  label,
  symbol,
  value,
  max,
  color,
  locked = false,
  onChange,
}: {
  label: string;
  symbol: string;
  value: number;
  max: number;
  color: string;
  locked?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <label>
      <b>{label}</b>
      <i>{symbol}</i>
      <input
        aria-label={label}
        type="range"
        min="1"
        max={max}
        step="0.25"
        value={value}
        disabled={locked}
        style={{ accentColor: color }}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <small>
        1<span>{max}</span>
      </small>
      <input
        aria-label={`${label} value`}
        type="number"
        min="1"
        max={max}
        step="0.25"
        value={value}
        disabled={locked}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {locked && <em>▣</em>}
    </label>
  );
}

function ConeMesh({ radius, height }: { radius: number; height: number }) {
  const scale = 3.35 / Math.max(radius, height / 1.3);
  return (
    <group scale={[scale * 0.78, scale, scale * 0.78]} rotation={[0, 0.35, 0]}>
      <mesh>
        <coneGeometry args={[radius, height, 64, 1, false]} />
        <meshPhysicalMaterial
          color="#1599e7"
          transparent
          opacity={0.63}
          roughness={0.2}
        />
        <Edges color="#b8f3ff" />
      </mesh>
      <mesh
        position={[0, -height / 2 - 0.012, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[radius, 64]} />
        <meshPhysicalMaterial color="#1e91de" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function ConeSector({ radius, slant }: { radius: number; slant: number }) {
  const theta = Math.min(359.5, (360 * radius) / slant),
    start = -90 - theta / 2,
    end = -90 + theta / 2,
    polar = (angle: number) => [
      100 + 78 * Math.cos((angle * Math.PI) / 180),
      92 + 78 * Math.sin((angle * Math.PI) / 180),
    ],
    a = polar(start),
    b = polar(end),
    path = `M 100 92 L ${a[0]} ${a[1]} A 78 78 0 ${theta > 180 ? 1 : 0} 1 ${b[0]} ${b[1]} Z`;
  return (
    <svg
      className="cone398-sector"
      viewBox="0 0 200 185"
      role="img"
      aria-label="Cone sector net"
    >
      <path d={path} />
      <line x1="100" y1="92" x2={a[0]} y2={a[1]} />
      <text x="16" y="35">
        l = {fmt(slant)}
      </text>
      <text x="75" y="181">
        2πr = {fmt(2 * Math.PI * radius)}
      </text>
    </svg>
  );
}
const near = (value: number, target: number) => Math.abs(value - target) < 0.01;
const round = (value: number) => Number(value.toFixed(3));
const fmt = (value: number) => Number(value.toFixed(2)).toString();
