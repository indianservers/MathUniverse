

import {
  Box,
  CircleDot,
  Info,
  Play,
  RotateCcw,
  Triangle,
  View,
} from "lucide-react";
import { useState } from "react";

import ThreeSceneWrapper from "../../../components/three/ThreeSceneWrapper";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./FrustumConeTargetLesson10110.css";
import FrustumScene10110 from "./FrustumScene10110";
import {frustumModel,frustumNet} from "./frustumConeModel";
import MathExpression from "../../../components/ui/MathExpression";

const f2 = (value: number) => Number(value.toFixed(2));
type Preset = "perspective" | "front" | "top" | "side";
const cameras: Record<Preset, [number, number, number]> = {
  perspective: [6, 3, 7],
  front: [0, 1.5, 9],
  top: [0, 9, 0.1],
  side: [9, 1.5, 0],
};

export default function FrustumConeTargetLesson10110({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [R, setR] = useState(6);
  const [r, setSmallR] = useState(3);
  const [h, setH] = useState(8);
  const [unfold, setUnfold] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const [preset, setPreset] = useState<Preset>("perspective");
  const [tab, setTab] = useState<"3d" | "net">("3d");
  const [actions, setActions] = useState(0);
  const {slant,volume,csa,tsa,theta,degrees,outerSlant,innerSlant}=frustumModel(R,r,h);
  const [viewKey,setViewKey]=useState(0);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const reset = () =>
    act(() => {
      setViewKey(n=>n+1);
      setR(6);
      setSmallR(3);
      setH(8);
      setUnfold(true);
      setAnimate(false);
      setSpeed(0.5);
      setPreset("perspective");
      setTab("3d");
    });
  const {a,b,path:sector,Ri}=frustumNet(R,r,h);
  const foldScale=Math.min(100/R,190/h),baseX=R*foldScale,topX=r*foldScale,topY=300-h*foldScale;
  return (
    <section
      className="fru10110-page"
      data-testid="school-mockup-0784"
      data-object-model="dedicated-threejs-frustum-annular-net-engine"
      data-radius-base={R}
      data-radius-top={r}
      data-height={h}
      data-slant={f2(slant)}
      data-volume={f2(volume)}
      data-csa={f2(csa)}
      data-tsa={f2(tsa)}
      data-theta={f2(degrees)}
      data-theta-radians={theta} data-outer-slant={outerSlant} data-inner-slant={innerSlant} data-speed={speed} data-view-key={viewKey}
      data-unfold={String(unfold)}
      data-animate={String(animate)}
      data-view={preset}
      data-tab={tab}
      data-actions={actions}
    >
      <div className="fru10110-hero">
        <small>CLASS 10 · MENSURATION</small>
        <h1>Frustum of a Cone</h1>
        <p>
          Explore a cone cut by a plane parallel to the base. Adjust dimensions,
          see the 3D frustum and its net, and verify formulas.
        </p>
        <nav>
          <button
            aria-pressed={tab==="3d"}
            className={tab === "3d" ? "active" : ""}
            onClick={() => act(() => setTab("3d"))}
          >
            3D VIEW
          </button>
          <button
            aria-pressed={tab==="net"}
            className={tab === "net" ? "active" : ""}
            onClick={() => act(() => {setTab("net");setUnfold(true);})}
          >
            UNFOLDED NET
          </button>
        </nav>
        <button className="reset" onClick={reset}>
          <RotateCcw /> Reset lab
        </button>
      </div>
      <main className="fru10110-lab">
        <section className="fru10110-dims">
          <h2>DIMENSIONS</h2>
          {([
            ["R (base radius)", R, 1, 10, setR],
            ["r (top radius)", r, 0.5, Math.max(0.5, R - 0.5), setSmallR],
            ["h (vertical height)", h, 1, 15, setH],
          ] as const).map(([label, value, min, max, setter]) => (
            <label key={String(label)}>
              {label}
              <b>{Number(value)}</b>
              <input
                aria-label={String(label)}
                type="range"
                min={Number(min)}
                max={Number(max)}
                step="0.5"
                value={Number(value)}
                onKeyDown={(event) => {
                  const direction =
                    event.key === "ArrowRight" || event.key === "ArrowUp"
                      ? 1
                      : event.key === "ArrowLeft" || event.key === "ArrowDown"
                        ? -1
                        : 0;
                  if (!direction) return;
                  event.preventDefault();
                  const next = Math.max(
                    Number(min),
                    Math.min(Number(max), Number(value) + direction * 0.5),
                  );
                  act(() => {
                    (setter as (v: number) => void)(next);
                    if (label === "R (base radius)" && r >= next)
                      setSmallR(Math.max(0.5, next - 0.5));
                  });
                }}
                onChange={(event) =>
                  act(() => {
                    const next = Number(event.target.value);
                    (setter as (v: number) => void)(next);
                    if (label === "R (base radius)" && r >= next)
                      setSmallR(Math.max(0.5, next - 0.5));
                  })
                }
              />
              <span>
                {Number(min)}
                <i>{Number(max)}</i>
              </span>
            </label>
          ))}
          <aside>
            <h2>DERIVED VALUES</h2>
            <strong><MathExpression value={String.raw`l=\sqrt{h^2+(R-r)^2}`}/></strong>
            <p>
              l = √({h}² + ({R} − {r})²) ≈ <b>{f2(slant)}</b>
            </p>
          </aside>
        </section>
        <section className="fru10110-three">
          <h2>3D EXPLORER</h2>
          <div className={tab === "net" ? "muted" : ""}>
            <ThreeSceneWrapper
              key={`${preset}-${viewKey}`}
              height="390px"
              mobileHeight="340px"
              cameraPosition={cameras[preset]}
              fov={36}
              showHint={false}
              sceneSummary="Interactive three-dimensional frustum; drag to rotate and scroll to zoom"
            >
              <FrustumScene10110 R={R} r={r} h={h} animate={animate} speed={speed} />
            </ThreeSceneWrapper>
          </div>
          <footer>
            <button aria-pressed={animate} onClick={() => act(() => setAnimate(!animate))}>
              <Play /> {animate ? "Pause" : "Animate"}
            </button>
            <input
              aria-label="Animation speed"
              type="range"
              min="0.1"
              max="1.5"
              step="0.1"
              value={speed}
              onChange={(event) =>
                act(() => setSpeed(Number(event.target.value)))
              }
            />
            <span>View</span>
            {(["perspective", "front", "top", "side"] as Preset[]).map(
              (view, index) => (
                <button
                  key={view}
                  className={preset === view ? "active" : ""}
                  aria-label={`${view} view`}
                  aria-pressed={preset===view}
                  onClick={() => act(() => setPreset(view))}
                >
                  {[<Box />, <View />, <CircleDot />, <Triangle />][index]}
                </button>
              ),
            )}
          </footer>
        </section>
        <section className={`fru10110-net ${tab === "net" ? "selected" : ""}`}>
          <div className="fru10110-net-heading">
            <h2>NET (UNFOLDED LATERAL SURFACE)</h2>
            <label>
              Unfold{" "}
              <input
                type="checkbox"
                checked={unfold}
                onChange={(event) => act(() => setUnfold(event.target.checked))}
              />
            </label>
          </div>
          <svg
            viewBox={!unfold?"0 0 360 360":theta<.5?`${180-135*Math.sin(theta/2)-10} 25 ${270*Math.sin(theta/2)+20} 60`:"0 15 360 215"}
            data-detail={String(unfold&&theta<.5)}
            aria-label="Annular sector net of the frustum"
          >
            {unfold?<><path data-net-sector="true" d={sector} className="open"/><line x1="180" y1="180" x2={a.x} y2={a.y}/><line x1="180" y1="180" x2={b.x} y2={b.y}/><text x="158" y="32" style={{fontSize:theta<.5?5:17}}>2πR</text><text x="158" y={180-Ri+18} style={{fontSize:theta<.5?5:17}}>2πr</text><text x="174" y="203">θ</text></>:<g data-folded="true"><path className="open" d={`M${180-topX} ${topY} L${180-baseX} 300 Q180 ${300+baseX*.4} ${180+baseX} 300 L${180+topX} ${topY} Q180 ${topY+topX*.4} ${180-topX} ${topY}Z`}/><ellipse cx="180" cy={topY} rx={topX} ry={topX*.2} fill="none" stroke="#35e0e4"/><text x="117" y="345">Folded lateral surface</text></g>}
          </svg>
          <aside>
            <strong>θ = 2π(R − r) / l = {f2(theta)} rad</strong>
            <p>θ ≈ {f2(degrees)}°</p>
            <small>
              {theta<.5?"Magnified sector detail. ":""}Outer radius {f2(outerSlant)}, inner radius {f2(innerSlant)}
            </small>
          </aside>
        </section>
      </main>
      <section className="fru10110-results">
        <h2>RESULTS</h2>
        <article>
          <b>VOLUME</b>
          <strong><MathExpression value={String.raw`V=\frac{\pi h(R^2+Rr+r^2)}{3}`}/></strong>
          <p>≈ {f2(volume)} cubic units</p>
        </article>
        <article>
          <b>CURVED SURFACE AREA (LATERAL)</b>
          <strong><MathExpression value={String.raw`CSA=\pi(R+r)l`}/></strong>
          <p>≈ {f2(csa)} square units</p>
        </article>
        <article>
          <b>TOTAL SURFACE AREA (INCLUDING BASES)</b>
          <strong><MathExpression value={String.raw`TSA=CSA+\pi R^2+\pi r^2`}/></strong>
          <p>≈ {f2(tsa)} square units</p>
        </article>
        <aside>
          <b>IMPORTANT WARNING</b>
          <p>Do NOT use h in place of l for curved surface area.</p>
          <strong>Use l = √(h² + (R − r)²).</strong>
        </aside>
      </section>
      <footer className="fru10110-info">
        <Info /> All values update live as you move the sliders. Formulas use
        exact π and precise calculations.
      </footer>


    </section>
  );
}
