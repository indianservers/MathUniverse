import { CheckCircle2, Home, Maximize2, RotateCcw, ZoomIn } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LinearSystemsMatricesTargetLesson10197.css";
import MathExpression from "../../../components/ui/MathExpression";
import { analyzeCramers, cramerAnswer } from "./cramersRuleModel";
import { equationGeometry, consistencyGeometryMessage } from "./linearSystemConsistencyModel";
import "../components/LessonMockupReference.css";

type System = [number, number, number, number, number, number];
const DEFAULT: System = [2, 1, 5, 1, -1, 1],
  PRESETS: Record<string, System> = {
    unique: DEFAULT,
    none: [2, 1, 5, 4, 2, 12],
    infinite: [2, 1, 5, 4, 2, 10],
    random: [3, -2, 7, 1, 4, 5],
  };
const solve=(s:System)=>{const r=analyzeCramers(s);return {...r,det:r.D,dx:r.Dx,dy:r.Dy};};
function fraction(n:number,d=1){if(d===0)return "undefined";let a=Math.abs(n),b=Math.abs(d);if(Number.isInteger(n)&&Number.isInteger(d)){while(b){const t=a%b;a=b;b=t;}if(a){n/=a;d/=a;}}if(d<0){n=-n;d=-d;}return d===1?String(n):String.raw`\dfrac{${n}}{${d}}`;}
const fmt = (n: number | null) =>
  n === null ? "—" : Number.isInteger(n) ? String(n) : n.toFixed(2);
const equation = (a: number, b: number, c: number) =>
  `${a===1?"":a===-1?"−":a}x ${b < 0 ? "−" : "+"} ${Math.abs(b)===1?"":Math.abs(b)}y = ${c}`;
function Graph({ system, zoom }: { system: System; zoom: number }) {
  const [a, b, c, d, e, f] = system,
    res = solve(system),
    w = 390,
    h = 430,
    o = { x: 195, y: 215 },
    scale = 28 * zoom,
    line=(aa:number,bb:number,cc:number)=>equationGeometry(aa,bb,cc,Math.ceil(8/zoom)),
    map = (x: number, y: number) => ({
      x: o.x + x * scale,
      y: o.y - y * scale,
    }),
    l1 = line(a,b,c),l2=line(d,e,f),
    first=l1.endpoints||[0,0,0,0],second=l2.endpoints||[0,0,0,0],
    p1=map(first[0],first[1]),p2=map(first[2],first[3]),q1=map(second[0],second[1]),q2=map(second[2],second[3]);
  return (
    <svg role="img" aria-label={consistencyGeometryMessage(system)} className="ls-graph" viewBox={`0 0 ${w} ${h}`}>
      {Array.from({length:13},(_,i)=>(i-6)*Math.max(1,Math.ceil(1/zoom))).map((v) => (
        <g key={v}>
          <line x1={o.x + v * scale} y1="10" x2={o.x + v * scale} y2="420" />
          <line x1="10" y1={o.y - v * scale} x2="380" y2={o.y - v * scale} />
          {v!==0&&<text x={o.x-7} y={o.y-v*scale+4} textAnchor="end">{v}</text>}<text x={o.x + v * scale + 2} y={o.y + 13}>
            {v}
          </text>
        </g>
      ))}
      <text className="ls-axis-letter" x="375" y="207">x</text><text className="ls-axis-letter" x="201" y="15">y</text><line className="axis" x1="10" y1={o.y} x2="380" y2={o.y} />
      <line className="axis" x1={o.x} y1="10" x2={o.x} y2="420" />
      {l1.endpoints&&<line className="line1" x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} />}
      {l2.endpoints&&<line className="line2" x1={q1.x} y1={q1.y} x2={q2.x} y2={q2.y} />}
      <text className="ls-equation-label first" x="220" y="45" textLength="85" lengthAdjust="spacingAndGlyphs">{equation(a,b,c)}</text><text className="ls-equation-label second" x="220" y="75" textLength="85" lengthAdjust="spacingAndGlyphs">{equation(d,e,f)}</text>
      {res.type === "unique" && (
        <>
          <line
            className="guide"
            x1={o.x}
            y1={map(res.x!, res.y!).y}
            x2={map(res.x!, res.y!).x}
            y2={map(res.x!, res.y!).y}
          />
          <line
            className="guide"
            x1={map(res.x!, res.y!).x}
            y1={o.y}
            x2={map(res.x!, res.y!).x}
            y2={map(res.x!, res.y!).y}
          />
          <circle cx={map(res.x!, res.y!).x} cy={map(res.x!, res.y!).y} r="5" />
          <text
            className="solution"
            x={map(res.x!, res.y!).x + 8}
            y={map(res.x!, res.y!).y + 4}
          >
            ({fmt(res.x)}, {fmt(res.y)})
          </text>
        </>
      )}
    </svg>
  );
}
export default function LinearSystemsMatricesTargetLesson10197({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [system, setSystem] = useState<System>(DEFAULT),
    [caseName, setCaseName] = useState("unique"),
    [zoom, setZoom] = useState(1),
    [hints, setHints] = useState<boolean[]>([false, false, false]),
    [solutions, setSolutions] = useState<boolean[]>([false, false, false]),
    [checked, setChecked] = useState(false),
    [practiceAnswers,setPracticeAnswers]=useState(()=>Array.from({length:3},()=>({kind:"",x:"",y:""})));
  const r = solve(system),
    [a, b, c, d, e, f] = system,
    adj: [[number, number], [number, number]] = [
      [e, -b],
      [-d, a],
    ],
    set = (i: number, v: number) =>
      {if(Number.isFinite(v)){setCaseName("custom");setSystem((old) => old.map((x, j) => (j === i ? v : x)) as System);}},
    choose = (name: string) => {
      setCaseName(name);
      if(name==="random"){const a=1+Math.floor(Math.random()*4),b=1+Math.floor(Math.random()*3),d=1+Math.floor(Math.random()*3),e=-1-Math.floor(Math.random()*3),x=Math.floor(Math.random()*7)-2,y=Math.floor(Math.random()*7)-2;setSystem([a,b,a*x+b*y,d,e,d*x+e*y]);}else setSystem([...PRESETS[name]]);
      setChecked(false);
    };
  const practices: System[] = [
    [3, 1, 9, 1, -2, -1],
    [2, -1, 4, 4, -2, 8],
    [1, 1, 3, 2, 2, 6],
  ];
  return (
    <main
      className="ls10197-page lesson-reference"
      data-testid="school-mockup-0871"
      data-object-model="dedicated-linear-system-matrix-and-graph-engine"
      data-determinant={r.det}
      data-case={r.type}
      data-x={r.x ?? "undefined"}
      data-y={r.y ?? "undefined"}
      data-zoom={zoom}
    >
      <header className="ls-hero">
        <small>CLASS 12 · MATRICES AND DETERMINANTS</small>
        <h1>{lesson.title}</h1>
        <div className="ls-copy">
          Solve the system using matrices. Change constants to see unique, no,
          or infinite solution cases. Algebra steps and graph stay in sync.
        </div>
        <div className="ls-badges">{["16 min","ADVANCED","CONCEPT","matrix","systems"].map(badge=><span key={badge}>{badge}</span>)}</div>
        <Link to="/lessons/school/class-12">← School lessons</Link>
      </header>
      <section className="ls-controls">
        <article>
          <b>System (edit constants)</b>
          <label>
            <i className="blue" /> {equation(a,b,c).split(" = ")[0]} ={" "}
            <input
              aria-label="first equation constant"
              type="number"
              value={c}
              onChange={(e) => set(2, Number(e.target.value))}
            />
          </label>
          <label>
            <i className="red" /> {equation(d,e,f).split(" = ")[0]} ={" "}
            <input
              aria-label="second equation constant"
              type="number"
              value={f}
              onChange={(e) => set(5, Number(e.target.value))}
            />
          </label>
        </article>
        <article>
          <b>Solution status</b>
          <strong className={r.type}>
            {r.type==="none"?"×":"✓"}{" "}
            {r.type === "unique"
              ? "Unique solution"
              : r.type === "none"
                ? "No solution"
                : "Infinite solutions"}
          </strong>
          <p>
            det(A) = {r.det} {r.det !== 0 ? "≠ 0" : "= 0"}
          </p>
        </article>
        <article>
          <b>Case explorer</b>
          <p>Try other cases</p>
          <select
            aria-label="Case explorer"
            value={caseName}
            onChange={(e) => choose(e.target.value)}
          >
            <option value="custom" disabled>Custom system</option><option value="unique">Unique solution (det(A) ≠ 0)</option>
            <option value="none">No solution (parallel)</option>
            <option value="infinite">Infinite solutions (same line)</option>
            <option value="random">Random values</option>
          </select>
        </article>
      </section>
      <div className="ls-main">
        <section className="ls-solver">
          <h2>Algebra Solver</h2>
          <p>Synchronized matrix solution</p>
          <Step n={1} title="Matrix form AX = B">
            <div className="ls-formula">
              <MathExpression value={String.raw`A=\begin{bmatrix}${a}&${b}\\${d}&${e}\end{bmatrix}\quad X=\begin{bmatrix}x\\y\end{bmatrix}\quad B=\begin{bmatrix}${c}\\${f}\end{bmatrix}`} />
            </div>
            <aside>
              <span>🔵 Row 1 → {equation(a, b, c)}</span>
              <span>🔴 Row 2 → {equation(d, e, f)}</span>
            </aside>
          </Step>
          <Step n={2} title="Determinant of A">
            <div className="ls-formula">
              <MathExpression value={String.raw`\det(A)=\begin{vmatrix}${a}&${b}\\${d}&${e}\end{vmatrix}=(${a})(${e})-(${b})(${d})=${fmt(r.det)}`} />
            </div>
            <footer>
              det(A){" "}
              {r.det !== 0
                ? "≠ 0 → A is invertible. Unique solution exists."
                : "= 0 → classify using consistency."}
            </footer>
          </Step>
          <Step n={3} title="Inverse of A">
            <div className="ls-formula">
              {r.det!==0?<><MathExpression value={String.raw`A^{-1}=\frac{1}{\det(A)}\operatorname{adj}(A),\quad \operatorname{adj}(A)=\begin{bmatrix}${adj[0][0]}&${adj[0][1]}\\${adj[1][0]}&${adj[1][1]}\end{bmatrix}`} /><MathExpression value={String.raw`A^{-1}=\frac{1}{${r.det}}\begin{bmatrix}${adj[0][0]}&${adj[0][1]}\\${adj[1][0]}&${adj[1][1]}\end{bmatrix}=\begin{bmatrix}${fraction(e,r.det)}&${fraction(-b,r.det)}\\${fraction(-d,r.det)}&${fraction(a,r.det)}\end{bmatrix}`} /></>:<p>A is singular: its inverse does not exist.</p>}
            </div>
          </Step>
          <Step n={4} title="Solve X = A⁻¹B">
            <div className="ls-formula">
              {r.det!==0?<><MathExpression value={String.raw`X=A^{-1}B=\begin{bmatrix}${fraction(e,r.det)}&${fraction(-b,r.det)}\\${fraction(-d,r.det)}&${fraction(a,r.det)}\end{bmatrix}\begin{bmatrix}${c}\\${f}\end{bmatrix}`} /><MathExpression value={String.raw`=\begin{bmatrix}(${fraction(e,r.det)})(${c})+(${fraction(-b,r.det)})(${f})\\(${fraction(-d,r.det)})(${c})+(${fraction(a,r.det)})(${f})\end{bmatrix}=\begin{bmatrix}${fraction(r.dx,r.det)}\\${fraction(r.dy,r.det)}\end{bmatrix}`} /></>:<p>{consistencyGeometryMessage(system)}</p>}
            </div>
            {r.type === "unique" ? (
              <strong className="ls-answer">
                Solution x={fmt(r.x)}, y={fmt(r.y)}
              </strong>
            ) : (
              <strong className="ls-answer">
                {r.type === "none"
                  ? "No common solution"
                  : "Infinitely many solutions"}
              </strong>
            )}
          </Step>
          <Step n={5} title="Verification (substitution)">
            {r.type === "unique" ? (
              <aside>
                <span>
                  🔵 {a}({fmt(r.x)}) + {b}({fmt(r.y)}) = {c} ✓
                </span>
                <span>
                  🔴 {d}({fmt(r.x)}) + {e}({fmt(r.y)}) = {f} ✓
                </span>
              </aside>
            ) : (
              <p>
                {consistencyGeometryMessage(system)}
              </p>
            )}
            <footer>
              Both equations are{" "}
              {r.type === "unique" ? "satisfied" : "classified consistently"}.
            </footer>
          </Step>
          <article className="ls-order">
            <b>⚠ Important: order of multiplication</b>
            <p>
              Matrix multiplication is not commutative. A⁻¹B is correct. Always
              multiply in the order X=A⁻¹B.
            </p><p>B has size 2×1 and A⁻¹ has size 2×2. The reversed product BA⁻¹ is undefined because its inner dimensions do not match.</p>
          </article>
        </section>
        <div className="ls-right">
          <section className="ls-graph-card">
            <header>
              <div>
                <h2>Graph (linked to algebra)</h2>
                <p>The lines correspond to matrix rows.</p>
              </div>
              <aside>
                <button aria-label="Fit graph" onClick={() => {const coordinates=[r.x??0,r.y??0,...[[a,b,c],[d,e,f]].flatMap(([aa,bb,cc])=>[aa?cc/aa:0,bb?cc/bb:0])];setZoom(Math.min(1,6/Math.max(6,...coordinates.map(Math.abs))));}}>
                  <Maximize2 />
                </button>
                <button aria-label="Reset graph" onClick={() => setZoom(1)}>
                  <Home />
                </button>
                <button
                  aria-label="Zoom graph"
                  onClick={() => setZoom((v) => (v === 1 ? 1.2 : 1))}
                >
                  <ZoomIn />
                </button>
              </aside>
            </header>
            <Graph system={system} zoom={zoom} />
            <div className="ls-legend">
              <p>━ Row 1 → {equation(a, b, c)}</p>
              <p>━ Row 2 → {equation(d, e, f)}</p>
              <p>
                ●{" "}
                {r.type === "unique"
                  ? `Intersection = (${fmt(r.x)}, ${fmt(r.y)})`
                  : r.type === "none"
                    ? consistencyGeometryMessage(system)
                    : consistencyGeometryMessage(system)}
              </p>
            </div>
            <footer>
              <b>Graph checks</b>
              <p>
                {r.type === "unique"
                  ? `At (${fmt(r.x)},${fmt(r.y)}), both equations are true ✓`
                  : r.type === "none"
                    ? consistencyGeometryMessage(system)
                    : consistencyGeometryMessage(system)}
              </p>
            </footer>
          </section>
          <section className="ls-builder">
            <article>
              <h2>Dynamic system builder</h2>
              <p>Adjust coefficients to explore all cases.</p>
              {[0,3].map(start=><div key={start} className="ls-builder-row">{[0,1,2].map(offset=><span key={offset}><input aria-label={`${start===0?"first":"second"} ${offset===0?"x coefficient":offset===1?"y coefficient":"constant"}`} type="number" value={system[start+offset]} onChange={event=>set(start+offset,Number(event.target.value))}/>{offset===0?"x +":offset===1?"y =":""}</span>)}</div>)}
            </article>
            <aside>
              <b>Quick presets</b>
              {[
                ["unique", "Unique solution"],
                ["none", "No solution (parallel)"],
                ["infinite", "Infinite solutions (same line)"],
                ["random", "Random values"],
              ].map(([key, label]) => (
                <button
                  key={key}
                  className={caseName === key ? "active" : ""}
                  onClick={() => choose(key)}
                >
                  ◉ {label}
                </button>
              ))}
            </aside>
          </section>
        </div>
      </div>
      <section className="ls-practice">
        <header>
          <div>
            <h2>Practice</h2>
            <p>
              Solve using matrices. Show A, det(A), A⁻¹, X=A⁻¹B, and verify.
            </p>
          </div>
          <aside>
            <button onClick={() => setChecked(true)}>☑ Check my work</button>
            <button
              aria-label="Reset practice"
              onClick={() => {
                setHints([false, false, false]);
                setSolutions([false, false, false]);
                setChecked(false);setPracticeAnswers(Array.from({length:3},()=>({kind:"",x:"",y:""})));
              }}
            >
              <RotateCcw />
            </button>
          </aside>
        </header>
        <div>
          {practices.map((p, i) => {
            const q = solve(p);
            const answer=practiceAnswers[i],correct=answer.kind===q.type&&(q.type!=="unique"||(cramerAnswer(answer.x)!==null&&cramerAnswer(answer.y)!==null&&Math.abs(cramerAnswer(answer.x)!-q.x!)<1e-6&&Math.abs(cramerAnswer(answer.y)!-q.y!)<1e-6));
            return (
              <article key={i}>
                <i>{i + 1}</i>
                <div>
                  {equation(p[0], p[1], p[2])}
                  <br />
                  {equation(p[3], p[4], p[5])}
                </div>
                <div className="ls-practice-answer"><select aria-label={`Practice ${i+1} classification`} value={answer.kind} onChange={e=>{setPracticeAnswers(v=>v.map((a,j)=>j===i?{...a,kind:e.target.value}:a));setChecked(false);}}><option value="">Choose solution type</option><option value="unique">Unique solution</option><option value="none">No solution</option><option value="infinite">Infinitely many solutions</option></select>{answer.kind==="unique"&&<div>{(["x","y"] as const).map(key=><label key={key}>{key}=<input aria-label={`Practice ${i+1} ${key}`} value={answer[key]} onChange={e=>{setPracticeAnswers(v=>v.map((a,j)=>j===i?{...a,[key]:e.target.value}:a));setChecked(false);}}/></label>)}</div>}{checked&&<p role="status" className={correct?"correct":"incorrect"}>{correct?"Correct":"Try again — check the determinant and consistency."}</p>}</div><button
                  onClick={() =>
                    setHints((v) => v.map((x, j) => (j === i ? !x : x)))
                  }
                >
                  {hints[i] ? "Hide hint" : "◉ Show hint"}
                </button>
                {hints[i] && <p>Compute det(A)={q.det} first. {q.det===0?"Compare coefficients and constants; the inverse does not exist.":"Use X = A⁻¹B and verify both equations."}</p>}
                <button
                  onClick={() =>
                    setSolutions((v) => v.map((x, j) => (j === i ? !x : x)))
                  }
                >
                  {solutions[i] ? "Hide solution" : "Show solution"}
                </button>
                {solutions[i] && (
                  <strong>
                    {q.type === "unique"
                      ? <MathExpression value={String.raw`x=${fraction(q.dx,q.det)},\quad y=${fraction(q.dy,q.det)}`} />
                      : "Infinitely many solutions"}
                  </strong>
                )}
              </article>
            );
          })}
        </div>
        {checked && (
          <footer>
            <CheckCircle2 /> Answers checked against each system. Use hints and solutions to review your work.
          </footer>
        )}
      </section>
      <nav className="ls-next">
        <Link to="/lessons/school/class-12/class-12-matrices-and-determinants-determinants-and-geometric-area">
          ← Determinants and Geometric Area
        </Link>
        <Link to="/lessons/school/class-12/class-12-matrices-and-determinants-cramer-s-rule">
          Cramer’s Rule →
        </Link>
      </nav>
      

    </main>
  );
}
function Step({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="ls-step">
      <h3>
        <i>{n}</i>
        {title}
      </h3>
      {children}
    </article>
  );
}
