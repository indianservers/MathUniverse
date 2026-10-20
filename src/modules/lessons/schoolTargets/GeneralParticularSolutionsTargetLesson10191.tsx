import { Maximize2, Minus, Plus, RotateCcw } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./GeneralParticularSolutionsTargetLesson10191.css";
import MathExpression from "../../../components/ui/MathExpression";
import "../components/LessonMockupReference.css";

const constants = [-2, -1, 0, 1, 2];
const colors = ["#c4a7ff", "#8f66df", "#7b8088", "#72d3bd", "#14942a"];
const fmt = (n: number, d = 2) => Number(n.toFixed(d));
export default function GeneralParticularSolutionsTargetLesson10191({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [c, setC] = useState(2),
    [visible, setVisible] = useState(constants),
    [zoom, setZoom] = useState(1),
    [answer, setAnswer] = useState("e^x"),
    [feedback, setFeedback] = useState("");
  const change = (n: number) =>
    setC(Math.max(-2, Math.min(2, Math.round(n * 4) / 4)));
  const showSelected = !constants.includes(c) || visible.includes(c);
  const clipId = useId().replace(/:/g, "");
  const dragging = useRef(false);
  const X = (x: number) => 300 + x * 66 * zoom;
  const Y = (y: number) => 330 - y * 30 * zoom;
  const equation = (k: number) => k === 0 ? "0" : `${k === 1 ? "" : k === -1 ? "-" : k}e^x`;
  const labelPosition = (k: number) => {
    const height = Math.abs(k) === 2 ? 7.8 : Math.abs(k) === 1 ? 4.5 : 6.3;
    const x = k === 0 ? 2.6 : Math.min(2.5, Math.log(height / zoom / Math.abs(k)));
    return {x: X(x)+8, y: Y(k*Math.exp(x))-(k === 0 ? 12 : 0)};
  };
  const points = (k: number) => Array.from({length:281}, (_,i) => {
    const x = -5 + i / 28;
    return `${X(x)},${Y(k*Math.exp(x))}`;
  }).join(" ");
  const move = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const matrix = e.currentTarget.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
    change((330-point.y)/(30*zoom));
  };
  const stop = (e: ReactPointerEvent<SVGSVGElement>) => {
    dragging.current = false;
    if(e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };
  const drag = (e: ReactPointerEvent<SVGCircleElement>) => {
    e.preventDefault();
    dragging.current = true;
    e.currentTarget.ownerSVGElement!.setPointerCapture(e.pointerId);
  };
  const key = (e: KeyboardEvent<SVGCircleElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault(); change(c + (e.key === "ArrowUp" ? .25 : -.25));
    }
    if(e.key === "Home") {e.preventDefault();change(-2);}
    if(e.key === "End") {e.preventDefault();change(2);}
  };
  const reset = () => {
    setC(2);
    setVisible(constants);
    setZoom(1);
    setAnswer("e^x");
    setFeedback("");
  };
  return (
    <main
      className="gps10191-page lesson-reference"
      data-testid="school-mockup-0865"
      data-object-model="dedicated-general-particular-solution-family-engine"
      data-c={fmt(c)}
      data-y0={fmt(c)}
      data-residual="0"
      data-zoom={fmt(zoom)}
      data-visible-count={visible.length}
    >
      <section className="gps-hero">
        <Link className="gps-school" to="/school">← School lessons</Link>
        <small>CLASS 12 · DIFFERENTIAL EQUATIONS</small>
        <h1>{lesson.title}</h1>

        <div>
          <span>18 min</span>
          <span>ADVANCED</span>
          <span>CONCEPT</span>
          <span>calculus</span>
        </div>
      </section>
      <section className="gps-explorer">
        <div className="gps-intro-copy">
        <p>
          Compare the general solution (family) of y′=y with particular
          solutions determined by initial conditions. Move, explore, and verify
          in real time.
        </p>
        </div>
        <h3>SOLUTION FAMILY EXPLORER: &nbsp; <MathExpression value="y'=y" /></h3>
        <div className="gps-workspace">
          <aside>
            <h3>General solution (family)</h3>
            <p className="formula"><MathExpression value={String.raw`y=Ce^x,\ C\in\mathbb{R}`} /></p>
            <p>
              Move the C slider or drag the point on the y-axis (x=0) to choose
              a particular solution.
            </p>
            <label>
              <b>C (arbitrary constant)</b>
              <input
                aria-label="C constant"
                type="range"
                min="-2"
                max="2"
                step=".25"
                value={c}
                onChange={(e) => change(Number(e.target.value))}
              />
            </label>
            <div className="gps-range-ticks">{constants.map(k=><span key={k}>{k}</span>)}</div>
            <p className="selected">Selected <MathExpression value={`C=${fmt(c)}`} /></p>
            <hr />
            <h3>Initial condition at x=0</h3>
            <p>Drag the point on the y-axis.</p>
            <div className="formula initial"><MathExpression value={`y(0)=${fmt(c)}`} /></div>
            <h3>Family members (y=Ceˣ)</h3>
            {constants.map((k, i) => (
              <label className="member" key={k}>
                <input
                  type="checkbox"
                  aria-label={`Show family C=${k}`}
                  checked={visible.includes(k)}
                  onChange={(e) =>
                    setVisible((old) =>
                      e.target.checked
                        ? [...old, k].sort()
                        : old.filter((n) => n !== k),
                    )
                  }
                />
                <span style={{ color: colors[i] }}><MathExpression value={`C=${k}`} /></span>
                <b style={{color:colors[i]}}><MathExpression value={`y=${equation(k)}`} /></b>
              </label>
            ))}
            <button onClick={reset}>
              <RotateCcw />
              Reset view
            </button>
          </aside>
          <div className="gps-graph">
            <div className="gps-legend">
              {constants.map((k, i) => (
                <span key={k} style={{ color: colors[i] }}>
                  <i /> <MathExpression value={`y=${equation(k)}`} />
                  {k === c ? " (selected)" : ""}
                </span>
              ))}
            </div>
            <svg viewBox="0 0 600 660" role="img" aria-label="Exponential solution family" onPointerMove={move} onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={()=>{dragging.current=false;}}>
              <defs><clipPath id={clipId}><rect x="22" y="28" width="556" height="602" /></clipPath></defs>
              <g clipPath={`url(#${clipId})`}>
                {Array.from({length:21},(_,i)=>i-10).map(k=><g key={k} className="gps-grid"><line x1={X(k)} y1="28" x2={X(k)} y2="630"/><line x1="22" y1={Y(k)} x2="578" y2={Y(k)}/></g>)}
                {constants.filter(k=>visible.includes(k)&&k!==c).map(k=><polyline data-constant={k} key={k} points={points(k)} style={{stroke:colors[constants.indexOf(k)]}} className="curve"/>)}
                {showSelected && <polyline data-constant={c} points={points(c)} className="curve selected-curve"/>}
              </g>
              <path d={`M22 330H584l-7 -4m7 4l-7 4M300 630V22l-4 7m4 -7l4 7`} className="axis" fill="none"/>
              {[-3,-2,-1,1,2,3].map(k=><g key={k} className="gps-tick"><path d={`M${X(k)} 326v8`}/><text x={X(k)} y="351" textAnchor="middle">{k}</text></g>)}
              {[-8,-6,-4,-2,2,4,6,8].map(k=><g key={k} className="gps-tick"><path d={`M296 ${Y(k)}h8`}/><text x="289" y={Y(k)+4} textAnchor="end">{k}</text></g>)}
              <text x="591" y="350" className="gps-axis-label">x</text><text x="298" y="14" className="gps-axis-label">y</text>
              {constants.filter(k=>visible.includes(k)&&k!==c).map(k=><text key={k} x={labelPosition(k).x} y={labelPosition(k).y} fill={colors[constants.indexOf(k)]}>{`y = ${k===0?'0':(k===1?'':k===-1?'−':k)+'eˣ'}`}</text>)}
              {showSelected && <text x={labelPosition(c).x} y={labelPosition(c).y} fill="#14942a">{`y = ${c===0?'0':(c===1?'':c===-1?'−':fmt(c))+'eˣ'}`}</text>}
              <circle cx="300" cy={Y(c)} r="7" role="slider" aria-label="Initial condition point" aria-valuemin={-2} aria-valuemax={2} aria-valuenow={c} tabIndex={0} onPointerDown={drag} onKeyDown={key}/>
              <text x="313" y={Y(c)-12} fill="#14942a">(0, {fmt(c)})</text>
            </svg>
            <div className="zoom">
              <button
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.7, fmt(z - 0.1, 1)))}
              >
                <Minus />
              </button>
              <button
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(1.3, fmt(z + 0.1, 1)))}
              >
                <Plus />
              </button>
              <button aria-label="Fit graph" onClick={() => setZoom(1)}>
                <Maximize2 />
              </button>
            </div>
          </div>
        </div>
        <div className="gps-verify">
          <div>
            <h3>
              LIVE VERIFICATION{" "}
              <small>(for the selected solution <MathExpression value={`y=${equation(c)}`} />)</small>
            </h3>
            <p className="formula">
              <MathExpression value={`y=${equation(c)} \\Rightarrow y'= ${equation(c)} \\Rightarrow y'-y=${equation(c)}-(${equation(c)})=0`} />
            </p>
          </div>
          <strong>✓ Verified: y′−y=0 identically for all x.</strong>
        </div>
      </section>
      <section className="gps-compare">
        <h3>GENERAL SOLUTION vs PARTICULAR SOLUTION</h3>
        <div>
          <article>
            <h3>GENERAL SOLUTION (family)</h3>
            <p className="formula">
              <MathExpression value={String.raw`y=Ce^x`} /><br /><MathExpression value={String.raw`C\in\mathbb{R}`} /> (arbitrary constant)
            </p>
            <ul>
              <li>Contains an arbitrary constant C.</li>
              <li>Represents infinitely many solutions.</li>
              <li>Satisfies y′−y=0 for every C.</li>
              <li>No specific initial data used.</li>
            </ul>
            <strong>Infinite possibilities</strong>
          </article>
          <article>
            <h3>PARTICULAR SOLUTION (determined)</h3>
            <p className="formula">
              <MathExpression value={`y=${equation(c)}`} /><br />(from the initial condition <MathExpression value={`y(0)=${fmt(c)}`} />)
            </p>
            <ul>
              <li>Constant fixed by an initial condition.</li>
              <li>Single, unique solution within the family.</li>
              <li>Satisfies y′−y=0.</li>
              <li>Matches y(0)={fmt(c)}.</li>
            </ul>
            <strong>Unique solution</strong>
          </article>
        </div>
        <aside>
          <div><h3>EQUILIBRIUM SOLUTION</h3>
          <p>
            y=0 is an equilibrium solution since y′=0 when y=0. It belongs to
            the family with C=0, so it is not a singular solution.
          </p></div>
          <b>Trajectories do not cross the equilibrium solution.<br />If y(0)=0, then y(x)=0 for all x.</b>
        </aside>
      </section>
      <section className="gps-example">
        <div>
          <h3>WORKED EXAMPLE</h3>
          <p>Solve <MathExpression value={String.raw`y'=2x\quad\text{with } y(1)=3`} />.</p>
          <ol>
            <li>Integrate: <MathExpression value={String.raw`y=\int 2x\,dx=x^2+C`} />.</li>
            <li>Apply <MathExpression value={String.raw`y(1)=3:\quad 3=1^2+C\Rightarrow C=2`} />.</li>
            <li>Particular solution: <MathExpression value="y=x^2+2" />.</li>
          </ol>
        </div>
        <aside>
          <h3>CHECK (verify)</h3>
          <p><MathExpression value="y'=2x" />.</p>
          <p>At <MathExpression value="x=1:\quad y(1)=1^2+2=3" /> ✓</p>
          <p>Equation satisfied: <MathExpression value="y'=2x" /> ✓</p>
        </aside>
      </section>
      <section className="gps-practice">
        <div>
          <h3>PRACTICE: INITIAL-CONDITION TASK</h3>
          <p>Solve <MathExpression value="y'=y" /> with the given initial condition.</p>
          <p>Set <MathExpression value="y(0)=1" />.</p>
          <b>What is the particular solution?</b>
        </div>
        <div>
          <h3>Select your answer</h3>
          {[
            ["e^x", "y=eˣ"],
            ["2e^x", "y=2eˣ"],
            ["e^x+1", "y=eˣ+1"],
            ["xe^x", "y=xeˣ"],
          ].map(([v, label]) => (
            <label key={v}>
              <input
                type="radio"
                name="gps10191"
                checked={answer === v}
                aria-label={label}
                onChange={() => {setAnswer(v);setFeedback("");}}
              />
              <MathExpression value={`y=${v}`} />
            </label>
          ))}
        </div>
        <aside>
          <h3>Check your work</h3>
          <p>General solution: <MathExpression value="y=Ce^x" />.</p>
          <p>Apply <MathExpression value="y(0)=1:\quad 1=Ce^0\Rightarrow C=1" />.</p>
          <p>Therefore, <MathExpression value="y=e^x" />.</p>
          <button
            onClick={() =>
              setFeedback(
                answer === "e^x"
                  ? "Correct: y=eˣ is the unique solution."
                  : "Use y(0)=C to determine the constant.",
              )
            }
          >
            Check answer
          </button>
          {feedback && (
            <p
              role="status"
              className={
                feedback.startsWith("Correct") ? "correct" : "incorrect"
              }
            >
              {feedback}
            </p>
          )}
        </aside>
      </section>
      <nav className="gps-nav">
        <Link to="/lessons/school/class-12/class-12-differential-equations-linear-first-order-equations">
          ← Linear First-Order Equations
        </Link>
        <Link to="/lessons/school/class-12/class-12-differential-equations-direction-fields">
          Direction Fields →
        </Link>
      </nav>
    </main>
  );
}
