import { Edges, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ExternalLink, Maximize2, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DoubleSide, ExtrudeGeometry, Shape } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./PrismTargetLesson393.css";

type BaseShape = "Triangle" | "Rectangle" | "Hexagon";
const clean = (value: number) => Number(value.toFixed(2));

function measures(
  shape: BaseShape,
  base: number,
  height: number,
  length: number,
) {
  const baseArea =
      shape === "Triangle"
        ? (base * height) / 2
        : shape === "Rectangle"
          ? base * height
          : (3 * Math.sqrt(3) * base ** 2) / 2,
    perimeter =
      shape === "Triangle"
        ? base + 2 * Math.hypot(base / 2, height)
        : shape === "Rectangle"
          ? 2 * (base + height)
          : 6 * base,
    lateral = perimeter * length;
  return {
    baseArea: clean(baseArea),
    perimeter: clean(perimeter),
    volume: clean(baseArea * length),
    lateral: clean(lateral),
    surface: clean(2 * baseArea + lateral),
  };
}

export default function PrismTargetLesson393({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [shape, setShape] = useState<BaseShape>("Triangle"),
    [base, setBase] = useState(6),
    [height, setHeight] = useState(4),
    [length, setLength] = useState(5),
    [layers, setLayers] = useState([true, true, true]),
    [expanded, setExpanded] = useState(false),
    [tab, setTab] = useState("Interaction + visualization"),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0),
    result = measures(shape, base, height, length),
    act = (action: () => void) => {
      action();
      setActions((value) => value + 1);
      onInteraction();
    },
    reset = () => {
      setShape("Triangle");
      setBase(6);
      setHeight(4);
      setLength(5);
      setLayers([true, true, true]);
      setExpanded(false);
      setTab("Interaction + visualization");
      setShared(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const update = (
      setter: React.Dispatch<React.SetStateAction<number>>,
      value: number,
    ) => act(() => setter(Math.max(1, Math.min(20, clean(value))))),
    share = () =>
      act(() => {
        void navigator.clipboard?.writeText(
          `${shape} prism: Ab=${result.baseArea}, V=${result.volume}, LA=${result.lateral}, S=${result.surface}`,
        );
        setShared(true);
      });
  return (
    <section
      className="cs378-page prism393-page"
      data-testid="geometry3d-mockup-0578"
      data-object-model="threejs-dedicated-editable-triangle-rectangle-hexagon-cross-section-extrusion-base-height-length-sliders-bases-lateral-net-layers-orbit-exact-area-volume"
      data-shape={shape}
      data-base={base}
      data-height={height}
      data-length={length}
      data-base-area={result.baseArea}
      data-perimeter={result.perimeter}
      data-volume={result.volume}
      data-lateral={result.lateral}
      data-surface={result.surface}
      data-layers={JSON.stringify(layers)}
      data-expanded={expanded}
      data-tab={tab}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Prism</h1>
        <p>Extrude polygonal bases.</p>
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
        <aside className="prism393-hero-note">
          <h2>💡 Key idea</h2>
          <p>A prism keeps the same cross-section all along its length.</p>
          <h2>✎ Practice</h2>
          <p>
            If Aᵦ = 9 and L = 7,
            <br />V = 63.
          </p>
        </aside>
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
      <section className="prism393-work">
        <article className="prism393-lab">
          <header>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Explore a {shape.toLowerCase()} prism</h2>
          </header>
          <div
            className={`prism393-scene ${expanded ? "expanded" : ""}`}
            data-testid="geometry3d-prism-canvas"
          >
            {expanded && (
              <button
                title="Exit fullscreen"
                onClick={() => act(() => setExpanded(false))}
              >
                <Maximize2 />
              </button>
            )}
            <Canvas camera={{ position: [9, 7, 11], fov: 44 }} dpr={[1, 1.5]}>
              <color attach="background" args={["#06172b"]} />
              <ambientLight intensity={1.8} />
              <directionalLight position={[7, 9, 6]} intensity={2.2} />
              <PrismScene
                shape={shape}
                base={base}
                height={height}
                length={length}
                layers={layers}
              />
            </Canvas>
            <label>✥ DRAG TO ROTATE</label>
            <button
              className="prism393-full"
              title="Toggle fullscreen"
              onClick={() => act(() => setExpanded(true))}
            >
              <Maximize2 />
            </button>
            <section>
              <div>
                <b>Base ({shape.toLowerCase()})</b>
                <p>
                  b = {base}
                  <br />h = {height}
                  <br />
                  Aᵦ = {result.baseArea}
                </p>
              </div>
              <div>
                <b>Prism volume</b>
                <p>
                  V = Aᵦ · L<br />= {result.baseArea} · {length} ={" "}
                  {result.volume}
                </p>
              </div>
            </section>
          </div>
          <p className="prism393-caption">
            ⓘ The {shape.toLowerCase()} base is extruded (slid) by length L to
            form the prism.
          </p>
        </article>
        <aside className="prism393-side">
          <section className="prism393-shape">
            <h2>Base shape</h2>
            <div>
              {(["Triangle", "Rectangle", "Hexagon"] as BaseShape[]).map(
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
          </section>
          <section className="prism393-controls">
            <h2>Base ({shape.toLowerCase()})</h2>
            <Control
              label={shape === "Hexagon" ? "Side, s" : "Base, b"}
              value={base}
              onChange={(value) => update(setBase, value)}
            />
            {shape !== "Hexagon" && (
              <Control
                label={`${shape} height, h`}
                value={height}
                onChange={(value) => update(setHeight, value)}
              />
            )}
            <h2>Prism length</h2>
            <Control
              label="Length, L"
              value={length}
              onChange={(value) => update(setLength, value)}
            />
          </section>
          <section className="prism393-options">
            <h2>Display options</h2>
            {["Show bases", "Show lateral faces", "Unfold net (ghost)"].map(
              (name, index) => (
                <label key={name}>
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
              ),
            )}
          </section>
          <section className="prism393-results">
            <h2>Live results</h2>
            <p>
              <b>Base area</b>
              <span>Aᵦ = {result.baseArea}</span>
            </p>
            <p>
              <b>Volume</b>
              <span>
                V = AᵦL = {result.baseArea}({length}) = {result.volume}
              </span>
            </p>
            <p>
              <b>Lateral area</b>
              <span>
                Perimeter × L = {result.perimeter} × {length} = {result.lateral}
              </span>
            </p>
            <p>
              <b>Total surface area</b>
              <span>2Aᵦ + lateral area = {result.surface}</span>
            </p>
          </section>
        </aside>
      </section>
      <div className="prism393-chips">
        <span>☷ primary-control</span>
        <span>▣ 3D object</span>
        <span>▣ measurement</span>
      </div>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/392-cuboid">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Cuboid
          </span>
        </a>
        <a href="/lessons/3d-mathematics/394-pyramid">
          <span>
            <small>NEXT</small>Pyramid
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
    <label className="prism393-control">
      {label}
      <input
        aria-label={`${label} slider`}
        type="range"
        min="1"
        max="20"
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <input
        aria-label={label}
        type="number"
        min="1"
        max="20"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
function PrismScene({
  shape,
  base,
  height,
  length,
  layers,
}: {
  shape: BaseShape;
  base: number;
  height: number;
  length: number;
  layers: boolean[];
}) {
  const geometry = useMemo(() => {
      const polygon = new Shape();
      if (shape === "Triangle") {
        polygon.moveTo(-base / 2, -height / 3);
        polygon.lineTo(base / 2, -height / 3);
        polygon.lineTo(0, (height * 2) / 3);
      } else if (shape === "Rectangle") {
        polygon.moveTo(-base / 2, -height / 2);
        polygon.lineTo(base / 2, -height / 2);
        polygon.lineTo(base / 2, height / 2);
        polygon.lineTo(-base / 2, height / 2);
      } else {
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const x = Math.cos(angle) * base,
            y = Math.sin(angle) * base;
          if (i) polygon.lineTo(x, y);
          else polygon.moveTo(x, y);
        }
      }
      polygon.closePath();
      return new ExtrudeGeometry(polygon, {
        depth: length,
        bevelEnabled: false,
      });
    }, [shape, base, height, length]),
    scale = shape === "Hexagon" ? 0.38 : 0.62;
  return (
    <>
      <OrbitControls
        makeDefault
        target={[0, 0, (length * scale) / 2]}
        minDistance={7}
        maxDistance={24}
      />
      <group
        rotation={[-0.45, -0.25, 0]}
        scale={scale}
        position={[0, 0, (-length * scale) / 2]}
      >
        <mesh geometry={geometry}>
          <meshStandardMaterial
            color="#3e8bad"
            transparent
            opacity={layers[1] ? 0.42 : 0.13}
            side={DoubleSide}
          />
          <Edges color="#82dff0" lineWidth={2} />
        </mesh>
        {layers[0] && (
          <>
            <mesh position={[0, 0, 0.01]}>
              <primitive object={geometry.clone()} attach="geometry" />
              <meshBasicMaterial color="#28d7e9" transparent opacity={0.17} />
            </mesh>
          </>
        )}
        {layers[2] && (
          <NetGhost shape={shape} base={base} height={height} length={length} />
        )}
      </group>
    </>
  );
}
function NetGhost({
  shape,
  base,
  height,
  length,
}: {
  shape: BaseShape;
  base: number;
  height: number;
  length: number;
}) {
  const count = shape === "Triangle" ? 3 : shape === "Rectangle" ? 4 : 6;
  return (
    <group position={[0, -height * 1.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} position={[(i - (count - 1) / 2) * base * 0.65, 0, 0]}>
          <planeGeometry args={[base * 0.6, length]} />
          <meshBasicMaterial
            color="#8896c8"
            transparent
            opacity={0.18}
            side={DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}
