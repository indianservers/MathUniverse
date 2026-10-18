
import {
  CheckCircle2,
  Lightbulb,
  Move,
  RotateCcw,
  Search,
  Split,
} from "lucide-react";
import { useState } from "react";

import ThreeSceneWrapper from "../../../components/three/ThreeSceneWrapper";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CombinedSolidsTargetLesson10111.css";
import CombinedSolidScene10111 from "./CombinedSolidScene10111";
import {csModel,csSlantMin} from "./combinedSolidsModel";
import MathExpression from "../../../components/ui/MathExpression";

const f2 = (value: number) => Number(value.toFixed(2));
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
    [answer, setAnswer] = useState<"a" | "b" | null>("b"),
    [viewKey, setViewKey] = useState(0),
    [actions, setActions] = useState(0);
  const {coneHeight,cylinderV,hemisphereV,coneV,totalV,hemiArea,coneArea,cylinderArea,totalArea,faceArea}=csModel(radius,height,slant);
  const M=({v}:{v:string})=><MathExpression value={v}/>;
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
      setAnswer("b");
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
      data-dimensions={String(dimensions)} data-grid={String(grid)} data-axes={String(axes)} data-measures={String(measures)} data-tool={tool} data-view-key={viewKey}
      data-mode={mode}
      data-answer={answer ?? "unanswered"}
      data-actions={actions}
    >
      <div className="cmb10111-hero">
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
      </div>
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
                aria-pressed={tool===id}
                className={tool === id ? "active" : ""}
                onClick={() => act(() => setTool(String(id)))}
              >
                {icon}
                {id}
              </button>
            ))}
            <button
              aria-pressed={explode}
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
              height="270px"
              mobileHeight="300px"
              cameraPosition={[0, 1.3, 9]}
              fov={40}
              showHint={false}
              sceneSummary="Interactive joined cylinder hemisphere and cone; drag to rotate, pan, and zoom"
            >
              <CombinedSolidScene10111
                radius={radius}
                height={height}
                slant={slant}
                explode={explode}
                grid={grid}
                axes={axes}
                tool={tool}
                dimensions={dimensions}
              />
            </ThreeSceneWrapper>
          </div>
          <div className="cmb10111-show">
            <span>Show</span>
            {([
              ["Dimensions", dimensions, setDimensions],
              ["Grid", grid, setGrid],
              ["Axes", axes, setAxes],
              ["Measures", measures, setMeasures],
            ] as const).map(([label, value, setter]) => (
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
              aria-pressed={mode==="volume"}
              className={mode === "volume" ? "active" : ""}
              onClick={() => act(() => setMode("volume"))}
            >
              Volume
            </button>
            <button
              aria-pressed={mode==="surface"}
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
                <strong><M v={String.raw`V_{total}=V_{cylinder}+V_{hemisphere}+V_{cone}`}/></strong>
                <p>
                  = {f2(cylinderV)} + {f2(hemisphereV)} + {f2(coneV)} cm³
                </p>
                <mark>= {f2(totalV)} cm³</mark>
              </>
            ) : (
              <>
                <strong><M v={String.raw`A_{total}=2\pi r^2+\pi rl+2\pi rh`}/></strong>
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
            {name:'Cylinder',details:`r = ${radius} cm, h = ${height} cm`,formula:String.raw`V=\pi r^2h=\pi(${radius})^2(${height})`,value:cylinderV},
            {name:'Hemisphere',details:`r = ${radius} cm`,formula:String.raw`V=\frac{2}{3}\pi r^3=\frac{2}{3}\pi(${radius})^3`,value:hemisphereV},
            {name:'Cone',details:`r = ${radius} cm, l = ${slant} cm`,formula:String.raw`h_c=\sqrt{l^2-r^2}=\sqrt{${slant}^2-${radius}^2}`,value:coneV}
          ].map((row,index)=><article key={row.name} className={`c${index}`}><svg className="cmb10111-part-icon" viewBox="0 0 60 70" aria-hidden="true">{index===0?<><ellipse cx="30" cy="15" rx="20" ry="7"/><path d="M10 15V55M50 15V55"/><ellipse cx="30" cy="55" rx="20" ry="7"/></>:index===1?<><path d="M5 50A25 25 0 0 1 55 50Z"/><ellipse cx="30" cy="50" rx="25" ry="7"/></>:<><path d="M6 58L30 6L54 58"/><ellipse cx="30" cy="58" rx="24" ry="7"/></>}</svg><div><b>{row.name}</b><span>{row.details}</span></div><strong><M v={row.formula}/>{index===2&&<M v={String.raw`V=\frac13\pi r^2h_c`}/>}<span>= {row.value.toFixed(2)} cm³</span></strong></article>)}
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
            <strong><M v={String.raw`A_{total}=A_{hemi}+A_{cone}+A_{cyl}`}/></strong>
            <p><M v={String.raw`=2\pi r^2+\pi rl+2\pi rh`}/></p>
            <p>= {hemiArea.toFixed(2)} + {coneArea.toFixed(2)} + {cylinderArea.toFixed(2)}</p>
            <mark>= {f2(totalArea)} cm²</mark>
            <button aria-pressed={mode==="volume"} onClick={() => act(() => setMode("volume"))}>Volume</button>
            <button aria-pressed={mode==="surface"} onClick={() => act(() => setMode("surface"))}>
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
            {slider("Radius, r", radius, 1, 5, v=>{setRadius(v);setSlant(l=>Math.max(l,csSlantMin(v)));})}
            {slider("Cylinder height, h", height, 4, 18, setHeight)}
            {slider(
              "Cone slant height, l",
              slant,
              csSlantMin(radius),
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
