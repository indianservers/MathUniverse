import { OrbitControls } from "@react-three/drei";
import {
  CheckCircle2,
  Lightbulb,
  Move,
  RotateCcw,
  Search,
  Split,
} from "lucide-react";
import { useState } from "react";
import { DoubleSide } from "three";
import ThreeSceneWrapper from "../../../components/three/ThreeSceneWrapper";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CombinedSolidsTargetLesson10111.css";

const f2 = (value: number) => Number(value.toFixed(2));
function SolidScene({
  radius,
  height,
  slant,
  explode,
  grid,
  axes,
  tool,
}: {
  radius: number;
  height: number;
  slant: number;
  explode: boolean;
  grid: boolean;
  axes: boolean;
  tool: string;
}) {
  const coneHeight = Math.sqrt(Math.max(0.01, slant * slant - radius * radius));
  const gap = explode ? 1.4 : 0;
  const s = 0.6;
  return (
    <group>
      <mesh rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[radius * s, radius * s, height * s, 64]} />
        <meshStandardMaterial
          color="#19c6cf"
          metalness={0.15}
          roughness={0.25}
        />
      </mesh>
      <mesh
        position={[(-height * s) / 2 - gap, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <sphereGeometry
          args={[radius * s, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          color="#f5b72d"
          metalness={0.2}
          roughness={0.28}
          side={DoubleSide}
        />
      </mesh>
      <mesh
        position={[(height * s) / 2 + (coneHeight * s) / 2 + gap, 0, 0]}
        rotation={[0, 0, -Math.PI / 2]}
      >
        <coneGeometry args={[radius * s, coneHeight * s, 64]} />
        <meshStandardMaterial
          color="#8e52dc"
          metalness={0.15}
          roughness={0.28}
        />
      </mesh>
      {grid && (
        <gridHelper
          args={[12, 12, "#23758a", "#163950"]}
          position={[0, -radius * s - 0.15, 0]}
        />
      )}
      {axes && <axesHelper args={[5]} />}
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 7, 6]} intensity={1.1} />
      <OrbitControls
        enableRotate={tool === "rotate"}
        enablePan={tool === "pan"}
        enableZoom={tool === "zoom"}
        minDistance={6}
        maxDistance={18}
      />
    </group>
  );
}
export default function CombinedSolidsTargetLesson10111({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [radius, setRadius] = useState(3),
    [height, setHeight] = useState(12),
    [slant, setSlant] = useState(6);
  const [explode, setExplode] = useState(false),
    [grid, setGrid] = useState(true),
    [dimensions, setDimensions] = useState(true),
    [axes, setAxes] = useState(false),
    [measures, setMeasures] = useState(true);
  const [mode, setMode] = useState<"volume" | "surface">("volume"),
    [tool, setTool] = useState("rotate"),
    [answer, setAnswer] = useState<"a" | "b" | null>(null),
    [viewKey, setViewKey] = useState(0),
    [actions, setActions] = useState(0);
  const coneHeight = Math.sqrt(Math.max(0, slant * slant - radius * radius));
  const cylinderV = Math.PI * radius * radius * height;
  const hemisphereV = (2 * Math.PI * radius ** 3) / 3;
  const coneV = (Math.PI * radius * radius * coneHeight) / 3;
  const totalV = cylinderV + hemisphereV + coneV;
  const hemiArea = 2 * Math.PI * radius * radius,
    coneArea = Math.PI * radius * slant,
    cylinderArea = 2 * Math.PI * radius * height,
    totalArea = hemiArea + coneArea + cylinderArea,
    faceArea = Math.PI * radius * radius;
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const reset = () =>
    act(() => {
      setRadius(3);
      setHeight(12);
      setSlant(6);
      setExplode(false);
      setGrid(true);
      setDimensions(true);
      setAxes(false);
      setMeasures(true);
      setMode("volume");
      setTool("rotate");
      setAnswer(null);
      setViewKey((value) => value + 1);
    });
  const slider = (
    label: string,
    value: number,
    min: number,
    max: number,
    setter: (v: number) => void,
  ) => (
    <label>
      {label}
      <input
        aria-label={label}
        type="range"
        min={min}
        max={max}
        step="0.5"
        value={value}
        onChange={(event) => act(() => setter(Number(event.target.value)))}
        onKeyDown={(event) => {
          const d =
            event.key === "ArrowRight" || event.key === "ArrowUp"
              ? 1
              : event.key === "ArrowLeft" || event.key === "ArrowDown"
                ? -1
                : 0;
          if (d) {
            event.preventDefault();
            act(() => setter(Math.max(min, Math.min(max, value + d * 0.5))));
          }
        }}
      />
      <b>{value} cm</b>
    </label>
  );
  return (
    <section
      className="cmb10111-page"
      data-testid="school-mockup-0785"
      data-object-model="dedicated-threejs-combined-solids-hidden-face-engine"
      data-radius={radius}
      data-cylinder-height={height}
      data-cone-slant={slant}
      data-cone-height={f2(coneHeight)}
      data-cylinder-volume={f2(cylinderV)}
      data-hemisphere-volume={f2(hemisphereV)}
      data-cone-volume={f2(coneV)}
      data-total-volume={f2(totalV)}
      data-exposed-area={f2(totalArea)}
      data-explode={String(explode)}
      data-mode={mode}
      data-answer={answer ?? "unanswered"}
      data-actions={actions}
    >
      <header className="cmb10111-hero">
        <small>CLASS 10 · MENSURATION</small>
        <h1>Combined Solids ☆</h1>
        <p>
          A cylinder joined with a hemisphere on one end and a cone on the
          other.
        </p>
        <nav>
          <span>10 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>3D LAB</span>
        </nav>
        <button onClick={reset}>
          <RotateCcw /> Reset lab
        </button>
      </header>
      <main className="cmb10111-workspace">
        <section className="cmb10111-model">
          <h2>3D MODEL LAB</h2>
          <nav>
            {[
              ["rotate", <RotateCcw />],
              ["pan", <Move />],
              ["zoom", <Search />],
            ].map(([id, icon]) => (
              <button
                key={String(id)}
                className={tool === id ? "active" : ""}
                onClick={() => act(() => setTool(String(id)))}
              >
                {icon}
                {id}
              </button>
            ))}
            <button
              className={explode ? "active" : ""}
              onClick={() => act(() => setExplode(!explode))}
            >
              <Split /> Explode
            </button>
            <button onClick={() => act(() => setViewKey((v) => v + 1))}>
              <RotateCcw /> Reset view
            </button>
          </nav>
          <div className="cmb10111-scene">
            <ThreeSceneWrapper
              key={viewKey}
              height="255px"
              mobileHeight="300px"
              cameraPosition={[10, 4, 10]}
              showHint={false}
              sceneSummary="Interactive joined cylinder hemisphere and cone; drag to rotate, pan, and zoom"
            >
              <SolidScene
                radius={radius}
                height={height}
                slant={slant}
                explode={explode}
                grid={grid}
                axes={axes}
                tool={tool}
              />
            </ThreeSceneWrapper>
            {dimensions && (
              <div className="dims">
                <b>r = {radius} cm</b>
                <b>h = {height} cm</b>
                <b>l = {slant} cm</b>
              </div>
            )}
          </div>
          <div className="cmb10111-show">
            <span>Show</span>
            {[
              ["Dimensions", dimensions, setDimensions],
              ["Grid", grid, setGrid],
              ["Axes", axes, setAxes],
              ["Measures", measures, setMeasures],
            ].map(([label, value, setter]) => (
              <label key={String(label)}>
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  onChange={(event) =>
                    act(() =>
                      (setter as (v: boolean) => void)(event.target.checked),
                    )
                  }
                />
                {label}
              </label>
            ))}
          </div>
          <div className="cmb10111-mode">
            <b>MEASURE</b>
            <button
              className={mode === "volume" ? "active" : ""}
              onClick={() => act(() => setMode("volume"))}
            >
              Volume
            </button>
            <button
              className={mode === "surface" ? "active" : ""}
              onClick={() => act(() => setMode("surface"))}
            >
              Exposed Surface Area
            </button>
          </div>
          <article hidden={!measures}>
            <h3>
              {mode === "volume"
                ? "Total Volume (Live)"
                : "Exposed Surface Area (Live)"}
            </h3>
            {mode === "volume" ? (
              <>
                <strong>Vtotal = Vcylinder + Vhemisphere + Vcone</strong>
                <p>
                  = {f2(cylinderV)} + {f2(hemisphereV)} + {f2(coneV)} cm³
                </p>
                <mark>= {f2(totalV)} cm³</mark>
              </>
            ) : (
              <>
                <strong>Atotal = 2πr² + πrl + 2πrh</strong>
                <p>
                  = {f2(hemiArea)} + {f2(coneArea)} + {f2(cylinderArea)}
                </p>
                <mark>= {f2(totalArea)} cm²</mark>
              </>
            )}
          </article>
        </section>
        <section className="cmb10111-decomp">
          <h2>DECOMPOSITION (COLOR-CODED)</h2>
          {[
            [
              "Cylinder",
              `r = ${radius}, h = ${height}`,
              `V = πr²h = ${f2(cylinderV)} cm³`,
            ],
            [
              "Hemisphere",
              `r = ${radius}`,
              `V = 2πr³/3 = ${f2(hemisphereV)} cm³`,
            ],
            [
              "Cone",
              `r = ${radius}, l = ${slant}`,
              `h = √(l²-r²) = ${f2(coneHeight)}; V = ${f2(coneV)} cm³`,
            ],
          ].map((row, index) => (
            <article key={String(row[0])} className={`c${index}`}>
              <i />
              <div>
                <b>{row[0]}</b>
                <span>{row[1]}</span>
              </div>
              <strong>{row[2]}</strong>
            </article>
          ))}
          <aside>
            <h3>
              SHARED INTERNAL FACES <span>(NOT COUNTED IN EXPOSED AREA)</span>
            </h3>
            <p>
              ◯ Cylinder–Hemisphere circular face{" "}
              <b>Area = {f2(faceArea)} cm²</b> <em>× Excluded</em>
            </p>
            <p>
              ◯ Cylinder–Cone circular face <b>Area = {f2(faceArea)} cm²</b>{" "}
              <em>× Excluded</em>
            </p>
          </aside>
        </section>
        <section className="cmb10111-side">
          <article>
            <h2>EXPOSED SURFACE AREA</h2>
            <p>(Shared circular faces excluded)</p>
            <strong>
              Atotal = Ahemi(curved) + Acone(lateral) + Acyl(lateral)
            </strong>
            <p>= 2πr² + πrl + 2πrh</p>
            <mark>= {f2(totalArea)} cm²</mark>
            <button onClick={() => act(() => setMode("volume"))}>Volume</button>
            <button onClick={() => act(() => setMode("surface"))}>
              Exposed Surface Area
            </button>
          </article>
          <article>
            <h3>COMMON INTERFACE CHECK</h3>
            <p>
              A student adds the areas of the two circular faces to the external
              area. Is this correct?
            </p>
            <button onClick={() => act(() => setAnswer("a"))}>
              A Yes, both circular faces are exposed.
            </button>
            <button
              className={answer === "b" ? "correct" : ""}
              onClick={() => act(() => setAnswer("b"))}
            >
              B No, the circular faces are internal and not exposed.
            </button>
            {answer && (
              <p className={answer === "b" ? "ok" : "bad"}>
                {answer === "b" ? (
                  <>
                    <CheckCircle2 /> Correct! Internal faces must be excluded.
                  </>
                ) : (
                  "Not quite. Joined faces are hidden inside the solid."
                )}
              </p>
            )}
          </article>
          <article className="quick">
            <h2>QUICK CONTROLS</h2>
            {slider("Radius, r", radius, 1, 5, setRadius)}
            {slider("Cylinder height, h", height, 4, 18, setHeight)}
            {slider(
              "Cone slant height, l",
              slant,
              Math.max(radius + 0.5, 4),
              12,
              setSlant,
            )}
          </article>
        </section>
      </main>
      <footer className="cmb10111-tip">
        <Lightbulb />
        <b>Best classroom move:</b> Ask learners to change a dimension and
        predict how volume and exposed surface area change.
      </footer>
    </section>
  );
}
