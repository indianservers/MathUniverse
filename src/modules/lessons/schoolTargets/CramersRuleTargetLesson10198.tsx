import { CheckCircle2, Lightbulb } from "lucide-react";
import { Fragment, useState, type ReactNode } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import MathExpression from "../../../components/ui/MathExpression";
import { analyzeCramers as calc, cramerAnswer } from "./cramersRuleModel";
import { equationGeometry, consistencyGeometryMessage } from "./linearSystemConsistencyModel";
import "./CramersRuleTargetLesson10198.css";
import "../components/LessonMockupReference.css";

function LocalGrid({children,className=""}:{children:ReactNode;className?:string}){return <div className={`cr-grid ${className}`}>{children}</div>;}
function LocalPanel({children,className="",as}:{children:ReactNode;className?:string;as?:"article"}){return as==="article"?<article className={`cr-panel ${className}`}>{children}</article>:<section className={`cr-panel ${className}`}>{children}</section>;}
type Sys = [number, number, number, number, number, number];
const DEFAULT: Sys = [2, 1, 5, 1, -1, 1],
  tasks: Sys[] = [
    [3, 2, 11, 1, -1, 1],
    [1, 4, 13, 2, -1, 1],
    [4, -1, 7, 1, 1, 5],
    [2, 3, 12, 1, -2, 1],
  ];
const fmt = (n: number | null) =>
  n === null ? "—" : Number.isInteger(n) ? String(n) : n.toFixed(2);
const equation=(a:number,b:number,c:number)=>`${a===1?"":a===-1?"−":a}x ${b<0?"−":"+"} ${Math.abs(b)===1?"":Math.abs(b)}y = ${c}`;
function Matrix({ m, replacedColumn }: { m: number[][]; replacedColumn?: number }) {
  return (
    <div className="cr-matrix" data-replaced-column={replacedColumn}>
      {m.flat().map((v, i) => (
        <span key={i}>{v}</span>
      ))}


    </div>
  );
}
function AreaSketch({m}:{m:number[][]}){
 const [a,b]=m[0],[d,e]=m[1];const pts=[[0,0],[a,d],[a+b,d+e],[b,e]];
 const minX=Math.min(...pts.map(p=>p[0])),maxX=Math.max(...pts.map(p=>p[0])),minY=Math.min(...pts.map(p=>p[1])),maxY=Math.max(...pts.map(p=>p[1]));const scale=65/Math.max(1,maxX-minX,maxY-minY);const map=(p:number[])=>[15+(p[0]-minX)*scale,80-(p[1]-minY)*scale];
 return <svg className="cr-area-sketch" viewBox="0 0 110 100" role="img" aria-label={`Column-vector parallelogram, area ${fmt(Math.abs(a*e-b*d))}`}>{[20,40,60,80].map(n=><path key={n} d={`M${n} 5V95 M5 ${n}H105`} stroke="#e5edf6" strokeWidth=".6"/>)}<polygon points={pts.map(p=>map(p).join(",")).join(" ")} fill="#bce9e7" fillOpacity=".14" stroke="#ef6fb0" strokeWidth="1"/><path d={`M${map([0,0])}L${map([a,d])}`} stroke="#2e9fee" strokeWidth="2"/><path d={`M${map([0,0])}L${map([b,e])}`} stroke="#ed65a4" strokeWidth="2"/><circle cx={map([0,0])[0]} cy={map([0,0])[1]} r="2.5" fill="#124c88"/><text x={map([a,d])[0]+3} y={Math.max(10,map([a,d])[1]-5)} fill="#237ab8">u</text><text x={map([b,e])[0]+3} y={Math.min(95,map([b,e])[1]+10)} fill="#c8468a">v</text></svg>;
}
function MiniGraph({ s }: { s: Sys }) {
  const [a, b, c, d, e, f] = s,
    r = calc(s),
    o = { x: 150, y: 145 },
    sc = 28,
    line = (aa:number,bb:number,cc:number)=>equationGeometry(aa,bb,cc,6),
    map = (x: number, y: number) => [o.x + x * sc, o.y - y * sc],
    first = line(a,b,c), second=line(d,e,f),
    l = first.endpoints || [0,0,0,0],
    q = second.endpoints || [0,0,0,0],
    p1 = map(l[0], l[1]),
    p2 = map(l[2], l[3]),
    q1 = map(q[0], q[1]),
    q2 = map(q[2], q[3]);
  return (
    <svg viewBox="0 0 300 290" role="img" aria-label={`Graph of the two equations. ${consistencyGeometryMessage(s)}`}>
      {[-4, -3, -2, -1, 0, 1, 2, 3, 4].map((v) => (
        <g key={v}>
          <line x1={o.x + v * sc} y1="10" x2={o.x + v * sc} y2="280" />
          <line x1="10" y1={o.y - v * sc} x2="290" y2={o.y - v * sc} />
          {v !== 0 && <>
            <text className="cr-tick" x={o.x + v * sc} y={o.y + 16} textAnchor="middle">{v}</text>
            <text className="cr-tick" x={o.x - 7} y={o.y - v * sc + 4} textAnchor="end">{v}</text>
          </>}
        </g>
      ))}
      <text x="287" y="138">x</text><text x="157" y="15">y</text><line className="axis" x1="10" y1={o.y} x2="290" y2={o.y} />
      <line className="axis" x1={o.x} y1="10" x2={o.x} y2="280" />
      {first.endpoints&&<line className="l1" x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />}
      {second.endpoints&&<line className="l2" x1={q1[0]} y1={q1[1]} x2={q2[0]} y2={q2[1]} />}
      {r.type === "unique" && (
        <>
          <circle cx={o.x + r.x! * sc} cy={o.y - r.y! * sc} r="5" />
          <text x={o.x + r.x! * sc + 8} y={o.y - r.y! * sc + 4}>
            ({fmt(r.x)}, {fmt(r.y)})
          </text>
        </>
      )}
    </svg>
  );
}
export default function CramersRuleTargetLesson10198({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [sys, setSys] = useState<Sys>(DEFAULT),
    [hints, setHints] = useState(false),
    [answers, setAnswers] = useState(() => tasks.map(() => ["", ""])),
    [graded, setGraded] = useState<(boolean|null)[]>(tasks.map(() => null)),
    [learn, setLearn] = useState(false);
  const r = calc(sys),
    [a, b, c, d, e, f] = sys,
    set = (i: number, v: number) =>
      {if(Number.isFinite(v))setSys((old) => old.map((x, j) => (j === i ? v : x)) as Sys);},
    reset = () => {
      setSys(DEFAULT);
    },
    random = () => {
      const aa=1+Math.floor(Math.random()*5),bb=1+Math.floor(Math.random()*3),dd=1+Math.floor(Math.random()*3),ee=-1-Math.floor(Math.random()*4),xx=Math.floor(Math.random()*7)-2,yy=Math.floor(Math.random()*7)-2;
      setSys([aa,bb,aa*xx+bb*yy,dd,ee,dd*xx+ee*yy]);
    },
    swap = () => setSys([d, e, f, a, b, c]),
    grade = (i: number) => {
      const q = calc(tasks[i]);
      setGraded((v) =>
        v.map((x, j) =>
          j === i
            ? cramerAnswer(answers[i][0])!==null && cramerAnswer(answers[i][1])!==null && Math.abs(cramerAnswer(answers[i][0])! - (q.x ?? Infinity)) < 1e-6 &&
              Math.abs(cramerAnswer(answers[i][1])! - (q.y ?? Infinity)) < 1e-6
            : x,
        ),
      );
    },
    gradeAll = () => tasks.forEach((_, i) => grade(i));
  return (
    <main
      className="cr10198-page lesson-reference"
      data-testid="school-mockup-0872"
      data-object-model="dedicated-cramer-column-replacement-engine"
      data-delta={r.D}
      data-delta-x={r.Dx}
      data-delta-y={r.Dy}
      data-case={r.type}
      data-x={r.x ?? "undefined"}
      data-y={r.y ?? "undefined"}
      data-hints={hints}
    >
      <header className="cr-hero">
        <div>
          <h1>
            {lesson.title} <span>DETERMINANT COLUMN-REPLACEMENT LAB</span>
          </h1>
          <p>Solve a 2×2 linear system using determinants.</p>
        </div>

      </header>
      <div className="lesson-header-content cr-hero"><div className="cr-hero-summary">
          <b>
            ◷ System Size<strong>2 × 2</strong>
          </b>
          <b>
            ◇ Rule<strong>Cramer&apos;s Rule</strong>
          </b>
          <b className={r.type}>
            ◉{" "}
            {r.type === "unique"
              ? "Unique solution"
              : r.type === "none"
                ? "No solution"
                : "Infinite solutions"}
            <strong>Δ {r.D !== 0 ? "≠" : "="} 0</strong>
            {r.type === "unique" && <strong>x = {fmt(r.x)}, y = {fmt(r.y)}</strong>}
          </b>
        </div></div>
      <LocalGrid className="cr-system">
        <LocalPanel as="article">
          <h2>
            <i>1</i> Enter / Edit the System
          </h2>
          <div className="cr-equation-inputs">
            <div className="cr-equation-labels" aria-hidden="true"><span>x coefficient</span><span>y coefficient</span><span>constant</span></div>
            {[0, 3].map((start) => (
              <div className="cr-equation-row" key={start}>
                {[0, 1, 2].map((offset) => {
                  const i = start + offset;
                  return (
                    <Fragment key={i}>
                      <input
                        aria-label={`system value ${i + 1}`}
                        type="number"
                        value={sys[i]}
                        onChange={(event) => set(i, Number(event.target.value))}
                      />
                      {offset < 2 && (
                        <span>
                          {offset === 0 ? "+" : "="}
                        </span>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            ))}
          </div>
          <footer>
            <button onClick={random}>Random system</button>
            <button onClick={reset}>Reset</button>
            <button onClick={swap}>Swap equations</button>
          </footer>
        </LocalPanel>
        <LocalPanel as="article">
          <p>System in Standard Form</p>
          <strong>
            {equation(a,b,c)}
          </strong>
          <strong>
            {equation(d,e,f)}
          </strong>
          <p>Matrix form: AX=b</p>
          <div className="cr-formula">
            <MathExpression value={String.raw`A = \begin{bmatrix}${a}&${b}\\${d}&${e}\end{bmatrix},\quad X=\begin{bmatrix}x\\y\end{bmatrix},\quad b=\begin{bmatrix}${c}\\${f}\end{bmatrix}`} />
          </div>
        </LocalPanel>
        <LocalPanel as="article">
          <h2>Determinant Area Insight</h2>
          <p>
            For a 2×2 matrix det=ad−bc. Geometric meaning: signed area of the
            parallelogram formed by column vectors.
          </p>
          <AreaSketch m={[[a,b],[d,e]]}/>
          <b>Area = |det(A)| = {Math.abs(r.D)}</b>
        </LocalPanel>
      </LocalGrid>
      <LocalPanel className="cr-build">
        <h2>
          <i>2</i> Build Determinants by Column Replacement
        </h2>
        <p>Watch each determinant form step-by-step.</p>
        <LocalGrid>
          {[
            {
              title: "Step 1: Coefficient Determinant Δ",
              m: [
                [a, b],
                [d, e],
              ],
              value: r.D,
              formula: `(${a})(${e}) − (${b})(${d})`,
            },
            {
              title: "Step 2: Replace x-column → Δx",
              m: [
                [c, b],
                [f, e],
              ],
              value: r.Dx,
              formula: `(${c})(${e}) − (${b})(${f})`,
            },
            {
              title: "Step 3: Replace y-column → Δy",
              m: [
                [a, c],
                [d, f],
              ],
              value: r.Dy,
              formula: `(${a})(${f}) − (${c})(${d})`,
            },
          ].map((x, i) => (
            <article key={x.title}>
              <h3>{x.title}</h3>
              <p>
                {i === 0
                  ? "Use columns of A."
                  : i === 1
                    ? "Replace first column with constants b."
                    : "Replace second column with constants b."}
              </p>
              <div className="cr-coefficient-display"><span>{i===0?"A":i===1?"Aₓ":"Aᵧ"} =</span><Matrix m={x.m} replacedColumn={i===0?undefined:i-1}/></div><div className="cr-det">
                <span>{i === 0 ? "Δ" : i === 1 ? "Δx" : "Δy"} = det =</span>
                <div className="cr-cross-matrix">
                  <Matrix m={x.m} replacedColumn={i === 0 ? undefined : i - 1} />
                </div>
              </div>
              <div className="cr-work">
                <p>= {x.formula}</p>
                <p>
                  = {x.m[0][0] * x.m[1][1]} − {x.m[0][1] * x.m[1][0]}
                </p>
                <p>= {x.value}</p>
              </div>
              <strong className="lesson-studio-result">
                {i === 0 ? "Δ" : i === 1 ? "Δx" : "Δy"} = {x.value}
              </strong>
              <footer><AreaSketch m={x.m}/><div>
                Area = {Math.abs(x.value)} square units
                <br />
                Orientation:{" "}
                {x.value < 0
                  ? "negative"
                  : x.value > 0
                    ? "positive"
                    : "collapsed"}
              </div></footer>
            </article>
          ))}
        </LocalGrid>
      </LocalPanel>
      <LocalPanel className="cr-solve">
        <h2>
          <i>3</i> Solve Using Cramer&apos;s Rule
        </h2>
        {r.type === "unique" ? (
          <>
            <div className="cr-solve-formula"><MathExpression display value={String.raw`x = \frac{Δ_x}{Δ}=\frac{${r.Dx}}{${r.D}}=${fmt(r.x)} \qquad y=\frac{Δ_y}{Δ}=\frac{${r.Dy}}{${r.D}}=${fmt(r.y)}`} /></div>
            <strong className="lesson-studio-result" aria-live="polite">
              Solution x={fmt(r.x)}
              <br />
              y={fmt(r.y)}
            </strong>
          </>
        ) : (
          <>
            <p>Δ=0, so Cramer&apos;s Rule cannot produce a unique solution.</p>
            <strong>
              {r.type === "none" ? "No solution" : "Infinitely many solutions"}
            </strong>
          </>
        )}
      </LocalPanel>
      <LocalGrid className="cr-verify">
        <LocalPanel as="article">
          <h2>
            <i>4</i> Verify Graphically
          </h2>
          <p>
            {consistencyGeometryMessage(sys)}
          </p>
          <MiniGraph s={sys} />
          <footer><span className="cr-legend-first">■ {equation(a,b,c)}</span><span className="cr-legend-second">■ {equation(d,e,f)}</span><span>● {r.type}</span></footer>
        </LocalPanel>
        <div>
          <LocalPanel as="article">
            <h2>
              <i>5</i> Verify by Substitution
            </h2>
            {r.type === "unique" ? (
              <>
                <p>
                  {a}({fmt(r.x)}) + {b}({fmt(r.y)}) = {c} ✓
                </p>
                <p>
                  {d}({fmt(r.x)}) + {e}({fmt(r.y)}) = {f} ✓
                </p>
                <strong className="lesson-studio-result">
                  Both equations are satisfied. The solution is correct.
                </strong>
              </>
            ) : (
              <p>{r.type==="none"?"No ordered pair satisfies both equations.":"There is a family of solutions; Cramer’s ratios are undefined."}</p>
            )}
          </LocalPanel>
          <LocalPanel as="article" className="cr-zero">
            <h2>
              <i>!</i> What if Δ = 0?
            </h2>
            <p>If Δ=0, the system does not have a unique solution.</p>
            <p>• When Δ=Δx=Δy=0, compare ranks to distinguish infinitely many solutions from a degenerate contradiction.</p>
            <p>• At least one nonzero → no solution.</p>
            <button onClick={() => setLearn((v) => !v)}>
              {learn ? "Hide" : "Learn more"}
            </button>
            {learn && (
              <p>
                Cramer&apos;s Rule applies uniquely only when the coefficient matrix is invertible. If every coefficient is zero, an equation 0 = nonzero still makes the system inconsistent, even when all three determinants vanish.
              </p>
            )}
          </LocalPanel>
        </div>
      </LocalGrid>
      <LocalPanel className="cr-practice">
        <header>
          <div>
            <h2>
              <i>6</i> Practice Problems
            </h2>
            <p>Solve each system using Cramer&apos;s Rule.</p>
          </div>
          <aside>
            <button onClick={() => setHints((v) => !v)}>
              <Lightbulb />
              {hints ? "Hide" : "Show"} hints
            </button>
            <button onClick={gradeAll}>Check all</button>
          </aside>
        </header>
        <LocalGrid>
          {tasks.map((s, i) => {
            const q = calc(s);
            return (
              <article key={i}>
                <i>{i + 1}</i>
                <strong>
                  {equation(s[0],s[1],s[2])}
                  <br />
                  {equation(s[3],s[4],s[5])}
                </strong>
                {hints && <p>Hint: Δ={q.D}</p>}
                <label>
                  x=
                  <input
                    aria-label={`practice ${i + 1} x`}
                    value={answers[i][0]}
                    onChange={(e) => {
                      setAnswers((v) =>
                        v.map((x, j) => (j === i ? [e.target.value, x[1]] : x)),
                      );
                      setGraded((v) => v.map((x, j) => (j === i ? null : x)));
                    }}
                  />
                </label>
                <label>
                  y=
                  <input
                    aria-label={`practice ${i + 1} y`}
                    value={answers[i][1]}
                    onChange={(e) => {
                      setAnswers((v) =>
                        v.map((x, j) => (j === i ? [x[0], e.target.value] : x)),
                      );
                      setGraded((v) => v.map((x, j) => (j === i ? null : x)));
                    }}
                  />
                </label>
                <button onClick={() => grade(i)}>Check</button>
                {graded[i] !== null && (
                  <span role="status" className={graded[i]?"cr-correct":"cr-incorrect"}>
                    {graded[i]&&<CheckCircle2 />}
                    {graded[i]?"Correct":"Try again — check both determinants."}
                  </span>
                )}
              </article>
            );
          })}
        </LocalGrid>
      </LocalPanel>
      <nav className="cr-next">
        <a href="/lessons/school/class-12/class-12-matrices-and-determinants-solving-linear-equations-by-matrices">
          ← Solving Linear Equations by Matrices
        </a>
        <a href="/lessons/school/class-12/class-12-matrices-and-determinants-consistency-of-linear-systems">
          Consistency of Linear Systems →
        </a>
      </nav>
    </main>
  );
}
