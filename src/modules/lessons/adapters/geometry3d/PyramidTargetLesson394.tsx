import { Edges, Line, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DoubleSide } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./PyramidTargetLesson394.css";

type BaseShape = "Square" | "Triangle" | "Pentagon";
const clean = (value: number) => Number(value.toFixed(2));
function solve(shape: BaseShape, side: number, height: number) {
  const n = shape === "Square" ? 4 : shape === "Triangle" ? 3 : 5,
    apothem = side / (2 * Math.tan(Math.PI / n)),
    radius = side / (2 * Math.sin(Math.PI / n)),
    baseArea = (n * side * apothem) / 2,
    slant = Math.hypot(height, apothem),
    lateral = (n * side * slant) / 2;
  return {
    n,
    apothem: clean(apothem),
    radius: clean(radius),
    baseArea: clean(baseArea),
    volume: clean((baseArea * height) / 3),
    slant: clean(slant),
    lateral: clean(lateral),
    surface: clean(baseArea + lateral),
  };
}
export default function PyramidTargetLesson394({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [shape, setShape] = useState<BaseShape>("Square"),
    [side, setSide] = useState(4),
    [height, setHeight] = useState(6),
    [layers, setLayers] = useState([true, true, true]),
    [expanded, setExpanded] = useState(false),
    [tab, setTab] = useState("Interaction + visualization"),
    [shared, setShared] = useState(false),
    [practice, setPractice] = useState(false),
    [actions, setActions] = useState(0),
    result = solve(shape, side, height),
    act = (action: () => void) => {
      action();
      setActions((value) => value + 1);
      onInteraction();
    },
    reset = () => {
      setShape("Square");
      setSide(4);
      setHeight(6);
      setLayers([true, true, true]);
      setExpanded(false);
      setTab("Interaction + visualization");
      setShared(false);
      setPractice(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const update = (
      setter: React.Dispatch<React.SetStateAction<number>>,
      value: number,
    ) => act(() => setter(Math.max(1, Math.min(10, clean(value))))),
    share = () =>
      act(() => {
        void navigator.clipboard?.writeText(
          `${shape} pyramid s=${side}, h=${height}, Ab=${result.baseArea}, V=${result.volume}`,
        );
        setShared(true);
      });
  return (
    <section
      className="cs378-page pyr394-page"
      data-testid="geometry3d-mockup-0579"
      data-object-model="threejs-dedicated-regular-square-triangle-pentagon-pyramid-side-height-apothem-slant-volume-lateral-surface-height-slant-net-layers-orbit-practice"
      data-shape={shape}
      data-side={side}
      data-height={height}
      data-n={result.n}
      data-apothem={result.apothem}
      data-radius={result.radius}
      data-base-area={result.baseArea}
      data-volume={result.volume}
      data-slant={result.slant}
      data-lateral={result.lateral}
      data-surface={result.surface}
      data-layers={JSON.stringify(layers)}
      data-expanded={expanded}
      data-tab={tab}
      data-shared={shared}
      data-practice={practice}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Pyramid</h1>
        <p>Connect base and apex.</p>
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
          <button>
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
      <section className="pyr394-panel">
        <header>
          <div>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Explore the pyramid</h2>
          </div>
          <strong>Interactive</strong>
          <span>{actions} actions</span>
          <button
            title="Toggle fullscreen"
            onClick={() => act(() => setExpanded(true))}
          >
            <Maximize2 />
          </button>
        </header>
        <div className="pyr394-main">
          <article
            className={`pyr394-scene ${expanded ? "expanded" : ""}`}
            data-testid="geometry3d-pyramid-canvas"
          >
            {expanded && (
              <button
                title="Exit fullscreen"
                onClick={() => act(() => setExpanded(false))}
              >
                <Maximize2 />
              </button>
            )}
            <h2>{shape} pyramid (regular)</h2>
            <Canvas camera={{ position: [8, 6, 9], fov: 42 }} dpr={[1, 1.5]}>
              <color attach="background" args={["#06172b"]} />
              <ambientLight intensity={1.8} />
              <directionalLight position={[7, 9, 6]} intensity={2.2} />
              <PyramidScene
                result={result}
                side={side}
                height={height}
                layers={layers}
              />
            </Canvas>
            <div className="pyr394-net">
              <b>Net (unfolded)</b>
              <span>
                {layers[2]
                  ? shape === "Square"
                    ? "◇ ◇ □ ◇ ◇"
                    : shape === "Triangle"
                      ? "△ △ △ △"
                      : "△ △ △ △ △ ⬠"
                  : "Hidden"}
              </span>
              <p>
                <i>h</i> vertical height (apex to base center)
                <br />
                <i>l</i> slant height (apex to midpoint of side)
                <br />
                <i>s</i> base side length
              </p>
            </div>
          </article>
          <aside className="pyr394-side">
            <section className="pyr394-controls">
              <h2>Base shape</h2>
              <div>
                {(["Square", "Triangle", "Pentagon"] as BaseShape[]).map(
                  (name) => (
                    <button
                      key={name}
                      className={shape === name ? "active" : ""}
                      onClick={() => act(() => setShape(name))}
                    >
                      {name}
                    </button>
                  ),
                )}
              </div>
              <Control
                label="Base side s"
                value={side}
                onChange={(value) => update(setSide, value)}
              />
              <Control
                label="Height h"
                value={height}
                onChange={(value) => update(setHeight, value)}
              />
              {[
                "Show height (h)",
                "Show slant height (l)",
                "Show net (unfolded)",
              ].map((name, index) => (
                <label className="pyr394-toggle" key={name}>
                  {name}
                  <input
                    aria-label={name}
                    type="checkbox"
                    checked={layers[index]}
                    onChange={() =>
                      act(() =>
                        setLayers((current) =>
                          current.map((value, i) =>
                            i === index ? !value : value,
                          ),
                        ),
                      )
                    }
                  />
                </label>
              ))}
            </section>
            <section className="pyr394-results">
              <h2>Live results</h2>
              <p>
                <b>Base area</b>
                <span>Aᵦ = {result.baseArea}</span>
              </p>
              <p>
                <b>Volume</b>
                <span>V = ⅓Aᵦh = {result.volume}</span>
              </p>
              <p>
                <b>Slant height</b>
                <span>l = √(apothem²+h²) ≈ {result.slant}</span>
              </p>
              <p>
                <b>Lateral area</b>
                <span>L = ½Pl ≈ {result.lateral}</span>
              </p>
              <p>
                <b>Total surface area</b>
                <span>T = L + Aᵦ ≈ {result.surface}</span>
              </p>
            </section>
            <section className="pyr394-key">
              <h2>💡 Key idea</h2>
              <p>A pyramid tapers one base to a single apex.</p>
            </section>
            <section className="pyr394-practice">
              <h2>✎ Practice</h2>
              <p>If Aᵦ = 30 and h = 9, V = 90.</p>
              <button onClick={() => act(() => setPractice(true))}>
                {practice ? "Verified" : "Try it now"}
              </button>
            </section>
          </aside>
        </div>
        <div className="pyr394-chips">
          <span>☷ {shape.toLowerCase()}-pyramid</span>
          <span>▣ 3D object</span>
          <span>▣ measurement</span>
          <span>▣ geometry</span>
        </div>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/393-prism">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Prism
          </span>
        </a>
        <a href="/lessons/3d-mathematics/395-tetrahedron">
          <span>
            <small>NEXT</small>Tetrahedron
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}
function Control({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="pyr394-control">
      {label}
      <input
        aria-label={`${label} slider`}
        type="range"
        min="1"
        max="10"
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <input
        aria-label={label}
        type="number"
        min="1"
        max="10"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
function PyramidScene({
  result,
  side,
  height,
  layers,
}: {
  result: ReturnType<typeof solve>;
  side: number;
  height: number;
  layers: boolean[];
}) {
  const scale = 0.7,
    baseY = -height / 2,
    apexY = height / 2;
  return (
    <>
      <OrbitControls
        makeDefault
        target={[0, 0, 0]}
        minDistance={7}
        maxDistance={22}
      />
      <group scale={scale}>
        <mesh>
          <coneGeometry args={[result.radius, height, result.n, 1, false]} />
          <meshStandardMaterial
            color="#2299bd"
            transparent
            opacity={0.42}
            side={DoubleSide}
          />
          <Edges color="#8ddcf1" lineWidth={2} />
        </mesh>
        {layers[0] && (
          <Line
            points={[
              [0, baseY, 0],
              [0, apexY, 0],
            ]}
            color="#ffd93d"
            dashed
            lineWidth={3}
          />
        )}{" "}
        {layers[1] && (
          <Line
            points={[
              [0, apexY, 0],
              [result.apothem, baseY, 0],
            ]}
            color="#d75bef"
            lineWidth={3}
          />
        )}
        <Line
          points={[
            [-side / 2, baseY, result.apothem],
            [side / 2, baseY, result.apothem],
          ]}
          color="#4aa0ff"
          lineWidth={3}
        />
      </group>
    </>
  );
}
