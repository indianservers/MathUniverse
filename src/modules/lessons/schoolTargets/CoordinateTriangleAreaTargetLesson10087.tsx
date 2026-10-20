import { ArrowLeft, ArrowRight, Check, RotateCcw } from "lucide-react";
import {
  type PointerEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./CoordinateTriangleAreaTargetLesson10087.css";
import MathExpression from "../../../components/ui/MathExpression";
import { triangleAreaModel } from "./triangleAreaModel";

type Point = { x: number; y: number };
type Key = "a" | "b" | "c";
const START: Record<Key, Point> = {
  a: { x: 1, y: 1 },
  b: { x: 5, y: 1 },
  c: { x: 3, y: 4 },
};
const round = (n: number, p = 2) => Math.round(n * 10 ** p) / 10 ** p;
const display = (n: number) => n === 0 ? "0" : Math.abs(n) < .0001 ? n.toExponential(5) : String(+n.toFixed(6));
function AreaCoordinateField({value,label,min,max,onValue}:{value:number;label:string;min:number;max:number;onValue:(n:number)=>void}) {
 const [draft,setDraft]=useState<string|null>(null),[invalid,setInvalid]=useState(false);
 const commit=()=>{if(draft===null)return;const n=Number(draft);if(!draft.trim()||!Number.isFinite(n)||n<min||n>max){setInvalid(true);return;}onValue(n);setDraft(null);setInvalid(false);};
 return <span className="cta10087-field"><input type="number" step="any" min={min} max={max} aria-label={label} aria-invalid={invalid} value={draft??value} onChange={e=>{setDraft(e.target.value);setInvalid(false);}} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')commit();if(e.key==='Escape'){setDraft(null);setInvalid(false);}}}/>{invalid&&<small>Enter {min} to {max}</small>}</span>;
}

export default function CoordinateTriangleAreaTargetLesson10087({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState(START),
    [swapped, setSwapped] = useState(false),
    [mode, setMode] = useState<"signed" | "absolute">("signed"),
    [showHeight, setShowHeight] = useState(true),
    [showCoordinates, setShowCoordinates] = useState(true),
    [dragging, setDragging] = useState<Key | null>(null),
    [tab, setTab] = useState(0),
    [explanation, setExplanation] = useState(""),
    [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null),
    m = useMemo(() => triangleAreaModel(points, swapped), [points, swapped]);
  const act = (fn: () => void) => {
    fn();
    setActions((n) => n + 1);
  };
  const update = (key: Key, next: Point) =>
    setPoints((v) => ({
      ...v,
      [key]: {
        x: Math.max(-1, Math.min(7, next.x)),
        y: Math.max(-2, Math.min(6, next.y)),
      },
    }));
  const local = (e: PointerEvent<SVGSVGElement>) => {
    const matrix=svgRef.current?.getScreenCTM();
    if(!matrix)return null;
    const q=new DOMPoint(e.clientX,e.clientY).matrixTransform(matrix.inverse());
    return {x:q.x/42-1,y:6-q.y/42};
  };
  const move=(e:PointerEvent<SVGSVGElement>)=>{if(!dragging)return;const q=local(e);if(q)update(dragging,{x:round(q.x,1),y:round(q.y,1)});};
  const navigateTab=(i:number)=>{setTab(i);document.getElementById(['cta10087-interact','cta10087-learn','cta10087-example','cta10087-formula','cta10087-practice'][i])?.scrollIntoView({behavior:'smooth',block:'start'});};
  const reset = () =>
    act(() => {
      setPoints(START);
      setSwapped(false);
      setMode("signed");
      setShowHeight(true);
      setShowCoordinates(true);
      setExplanation("");
      setDragging(null);
    });
  const sx = (x: number) => (x + 1) * 42,
    sy = (y: number) => (6 - y) * 42;
  const pointOrder = swapped
    ? [points.a, points.c, points.b]
    : [points.a, points.b, points.c];
  const areaText=m.area===0&&m.nonzero?'nonzero (below display precision)':display(m.area);
  const signedText=m.signed===0&&m.nonzero?`${m.orientation==='clockwise'?'−':'+'}nonzero (below display precision)`:display(m.signed);
  const detText=m.determinant===0&&m.nonzero?`${m.orientation==='clockwise'?'−':'+'}nonzero (below display precision)`:display(m.determinant);
  const formula = `${pointOrder[0].x}(${pointOrder[1].y}−${pointOrder[2].y}) + ${pointOrder[1].x}(${pointOrder[2].y}−${pointOrder[0].y}) + ${pointOrder[2].x}(${pointOrder[0].y}−${pointOrder[1].y})`;
  return (
    <section
      className="cta10087-page"
      data-testid="school-mockup-0761"
      data-object-model="dedicated-three-vertex-signed-determinant-area-engine"
      data-a={`${points.a.x},${points.a.y}`}
      data-b={`${points.b.x},${points.b.y}`}
      data-c={`${points.c.x},${points.c.y}`}
      data-determinant={m.determinant}
      data-signed-area={m.signed}
      data-absolute-area={m.area}
      data-orientation={m.orientation}
      data-swapped={String(swapped)}
      data-actions={actions}
    >
      <div className="cta10087-hero" role="banner">
        <small>CLASS 10 · COORDINATE GEOMETRY</small>
        <h1>Area of Triangle Using Coordinates</h1>
        <p>
          Compute the area of a triangle from its vertex coordinates using the
          determinant method.
        </p>
        <p>
          Interpret the result&apos;s sign to determine orientation and use
          absolute value for geometric area.
        </p>
      </div>
      <div className="cta10087-tabs" role="group" aria-label="Lesson sections">
        {["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"].map((x, i) => (
          <button
            key={x}
            className={tab === i ? "active" : ""}
            aria-pressed={tab===i}
            onClick={() => act(() => navigateTab(i))}
          >
            {x}
          </button>
        ))}
      </div>
      <main>
        <section id="cta10087-interact" className="cta10087-lab">
          <h2>Build and explore your triangle</h2>
          <div className="workspace">
            <aside>
              {(["a", "b", "c"] as Key[]).map((key, i) => (
                <section key={key} className={key}>
                  <h3>
                    ● {key.toUpperCase()} (x{i + 1}, y{i + 1})
                  </h3>
                  <label>
                    x{i + 1}
                    <AreaCoordinateField label={`Vertex ${key.toUpperCase()} x`} value={points[key].x} min={-1} max={7} onValue={x=>act(()=>update(key,{...points[key],x}))}/>
                  </label>
                  <label>
                    y{i + 1}
                    <AreaCoordinateField label={`Vertex ${key.toUpperCase()} y`} value={points[key].y} min={-2} max={6} onValue={y=>act(()=>update(key,{...points[key],y}))}/>
                  </label>
                </section>
              ))}
              <button onClick={reset}>
                <RotateCcw /> Reset triangle
              </button>
            </aside>
            <article>
              <svg
                ref={svgRef}
                viewBox="-12 -12 402 360"
                aria-label="Draggable coordinate-area triangle"
                onPointerMove={move}
                onPointerUp={e=>{if(dragging){move(e);act(()=>setDragging(null));}}}
                onPointerCancel={()=>setDragging(null)}
              >
                <defs><clipPath id="cta10087-clip"><rect x="-10" y="-10" width="398" height="356"/></clipPath></defs><g clipPath="url(#cta10087-clip)">
                {Array.from({ length: 10 }, (_, i) => (
                  <g key={i}>
                    <line
                      className="grid"
                      x1={i * 42}
                      y1="0"
                      x2={i * 42}
                      y2="336"
                    />
                    <line
                      className="grid"
                      x1="0"
                      y1={i * 42}
                      x2="378"
                      y2={i * 42}
                    />
                  </g>
                ))}
                <line className="axis" x1="0" y1={sy(0)} x2="378" y2={sy(0)} />
                <line className="axis" x1={sx(0)} y1="0" x2={sx(0)} y2="336" />
                {Array.from({length:10},(_,i)=>i-2).map(i=><g key={`tick${i}`}><text className="tick" x={sx(i)} y={sy(0)+17} textAnchor="middle">{i}</text>{i>=-2&&i<=6&&i!==0&&<text className="tick" x={sx(0)-10} y={sy(i)+4} textAnchor="end">{i}</text>}</g>)}
                <text className="axis-title" x="369" y={sy(0)-8}>x</text><text className="axis-title" x={sx(0)+8} y="14">y</text>
                <path className="triangle" d={`M${sx(points.a.x)} ${sy(points.a.y)}L${sx(points.b.x)} ${sy(points.b.y)}L${sx(points.c.x)} ${sy(points.c.y)}Z`}/>
                <line className="edge ab" x1={sx(points.a.x)} y1={sy(points.a.y)} x2={sx(points.b.x)} y2={sy(points.b.y)}/><line className="edge ac" x1={sx(points.a.x)} y1={sy(points.a.y)} x2={sx(points.c.x)} y2={sy(points.c.y)}/><line className="edge bc" x1={sx(points.b.x)} y1={sy(points.b.y)} x2={sx(points.c.x)} y2={sy(points.c.y)}/>
                {showHeight && m.foot && (
                  <>
                    <line
                      className="height"
                      x1={sx(points.c.x)}
                      y1={sy(points.c.y)}
                      x2={sx(m.foot.x)}
                      y2={sy(m.foot.y)}
                    />
                    <circle
                      className="foot"
                      cx={sx(m.foot.x)}
                      cy={sy(m.foot.y)}
                      r="5"
                    />
                    {showCoordinates&&<text x={sx(m.foot.x) - 12} y={Math.min(343,sy(m.foot.y) + 38)}><title>Foot of perpendicular: ({display(m.foot.x)}, {display(m.foot.y)})</title>D {m.foot.x!==round(m.foot.x)||m.foot.y!==round(m.foot.y)?"≈":""}({round(m.foot.x)}, {round(m.foot.y)})</text>}
                    {m.extension&&<line className="height" x1={sx(m.extension.x)} y1={sy(m.extension.y)} x2={sx(m.foot.x)} y2={sy(m.foot.y)}/>}
                  </>
                )}
                {(["a", "b", "c"] as Key[]).map((key) => (
                  <circle
                    key={key}
                    className={key}
                    role="slider"
                    aria-valuemin={-1} aria-valuemax={7} aria-valuenow={points[key].x} aria-valuetext={`x ${points[key].x}, y ${points[key].y}`}
                    tabIndex={0}
                    aria-label={`Draggable vertex ${key.toUpperCase()}`}
                    cx={sx(points[key].x)}
                    cy={sy(points[key].y)}
                    r="7"
                    onPointerDown={(e) => {
                      e.currentTarget.setPointerCapture(e.pointerId);
                      setDragging(key);
                    }}
                    onKeyDown={(e) => {
                      const dx =
                          e.key === "ArrowLeft"
                            ? -1
                            : e.key === "ArrowRight"
                              ? 1
                              : 0,
                        dy =
                          e.key === "ArrowUp"
                            ? 1
                            : e.key === "ArrowDown"
                              ? -1
                              : 0;
                      if (dx || dy) {
                        e.preventDefault();e.stopPropagation();
                        act(() =>
                          update(key, {
                            x: points[key].x + dx,
                            y: points[key].y + dy,
                          }),
                        );
                      }
                    }}
                  />
                ))}
                {showCoordinates &&
                  (["a", "b", "c"] as Key[]).map((key) => (
                    <text
                      className={`label ${key}`}
                      key={key}
                      x={sx(points[key].x)+(points[key].x>4?-8:8)}
                      textAnchor={points[key].x>4?"end":"start"}
                      y={sy(points[key].y)+(points[key].y>5.5?18:-10)}
                    >
                      {key.toUpperCase()} ({display(points[key].x)}, {display(points[key].y)})
                    </text>
                  ))}
                </g>
              </svg>
              <div className="toggles">
                <label>
                  <input
                    type="checkbox"
                    checked={showHeight}
                    onChange={(e) => act(() => setShowHeight(e.target.checked))}
                  />{" "}
                  Show base–height
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showCoordinates}
                    onChange={(e) =>
                      act(() => setShowCoordinates(e.target.checked))
                    }
                  />{" "}
                  Show coordinates
                </label>
              </div>
            </article>
            <aside className="method">
              <h2>Determinant method</h2>
              <h3>① Determinant (2 × signed area)</h3>
              <MathExpression value={String.raw`D=\begin{vmatrix}x_1&y_1&1\\x_2&y_2&1\\x_3&y_3&1\end{vmatrix}=\begin{vmatrix}${pointOrder.map(p=>`${p.x}&${p.y}&1`).join(String.raw`\\`)}\end{vmatrix}`}/>
              <p>{formula}</p>
              <p>= {detText}</p>
              <h3>
                ② Signed area = ½ × {detText} = {signedText} sq. units
              </h3>
              <section data-area-mode={mode}>
                <h3>Orientation & area</h3>
                <label>
                  <input
                    aria-label="Signed area mode"
                    type="radio"
                    checked={mode === "signed"}
                    onChange={() => act(() => setMode("signed"))}
                  />{" "}
                  Signed area (orientation matters)
                </label>
                <strong>
                  {signedText} sq. units ({m.orientation})
                </strong>
                <label>
                  <input
                    aria-label="Absolute area mode"
                    type="radio"
                    checked={mode === "absolute"}
                    onChange={() => act(() => setMode("absolute"))}
                  />{" "}
                  Absolute area (geometric area)
                </label>
                <strong>{areaText} sq. units</strong>
              </section>
            </aside>
          </div>
          <footer>
            <span>Base AB = {display(m.base)} units</span>
            <span>Height from C to AB = {m.height===null?"undefined":display(m.height)} units</span>
            <span>{m.height===null?"A and B coincide: area = 0; line AB is undefined.":`Area = ½ × ${display(m.base)} × ${display(m.height)} = ${areaText} sq. units`}</span>
          </footer>
        </section>
        <aside className="cta10087-tip">
          💡 <strong>Drag any vertex</strong> (or edit the coordinates) to see
          how the area and orientation change in real time.
        </aside>
        <section className="cta10087-cards">
          <article id="cta10087-learn">
            <h2>◎ Why it works</h2>
            <p>The determinant is twice the signed area of the triangle.</p>
            <MathExpression value={String.raw`\begin{vmatrix}x_1&y_1&1\\x_2&y_2&1\\x_3&y_3&1\end{vmatrix}=2\times\text{signed area}`}/>
            <p>Positive → counterclockwise (CCW)</p>
            <p>Negative → clockwise (CW)</p>
            <p>Taking absolute value gives geometric area.</p>
          </article>
          <article id="cta10087-example" className="worked">
            <h2>♙ Worked example</h2>
            <p>Find the area of △ABC with A(1,1), B(5,1), C(3,4).</p>
            <p>Determinant = 12</p>
            <p>Signed area = ½ × 12 = 6 sq. units (counterclockwise)</p>
            <p>Area = ½ |12| = 6 sq. units</p>
            <em>
              <Check /> Matches base–height: ½ × 4 × 3 = 6.
            </em>
          </article>
          <article id="cta10087-formula" className="mistake">
            <h2>⚠ Common mistake</h2>
            <p>Forgetting the absolute value.</p>
            <p>
              Signed area may be negative, but geometric area cannot be
              negative.
            </p>
            <div>
              <b>Correct:<MathExpression value={String.raw`A=\frac12|D|`}/></b>
              <b>Not correct:<MathExpression value={String.raw`A=\frac12 D`}/></b>
            </div>
          </article>
          <article id="cta10087-practice" className="challenge">
            <h2>♜ Challenge: swap two vertices</h2>
            <p>Swap B and C. What happens?</p>
            <p>{swapped?"Current":"New"} order: A({points.a.x},{points.a.y}), C({points.c.x},{points.c.y}), B({points.b.x},{points.b.y})</p>
            <button onClick={() => act(() => setSwapped((v) => !v))}>
              {swapped ? "Restore order" : "Apply swap"}
            </button>
            <strong>
              {swapped?"Result: Signed area is":"After swapping, signed area becomes"} {display(swapped ? m.signed : -m.signed)} sq. units, but absolute area remains {areaText}.
            </strong>
            <label>
              Why does the orientation change but the area stay the same?
              <textarea
                aria-label="Orientation explanation"
                value={explanation}
                onChange={(e) => act(() => setExplanation(e.target.value))}
                placeholder="Type your explanation here..."
              />
            </label>
          </article>
        </section>
      </main>
      <div className="cta10087-nav">
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-distance-formula">
          <ArrowLeft /> Distance Formula
        </Link>
        <Link to="/lessons/school/class-10/class-10-coordinate-geometry-collinearity-using-coordinate-area">
          Collinearity Using Coordinate Area <ArrowRight />
        </Link>
      </div>
      <footer className="cta10087-footer"><b>Math Universe</b><p>Interactive math labs, visual proofs, graphing, and classroom activities.</p><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small></footer>

    </section>
  );
}
