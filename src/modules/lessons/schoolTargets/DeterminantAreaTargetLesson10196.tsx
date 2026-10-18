import { Eye, Shuffle, RotateCcw, RotateCw, Minus } from "lucide-react";
import { useRef, useId, useState, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./DeterminantAreaTargetLesson10196.css";
import MathExpression from "../../../components/ui/MathExpression";
import LessonMockupFooter from "../components/LessonMockupFooter";
import "../components/LessonMockupReference.css";

type Matrix2 = [[number, number], [number, number]];
const DEFAULT: Matrix2 = [
    [3, 1],
    [1, 2],
  ],
  practices: Matrix2[] = [
    [
      [1, 2],
      [3, 4],
    ],
    [
      [0, -1],
      [1, 0],
    ],
    [
      [2, 5],
      [-1, 3],
    ],
    [
      [2, 4],
      [1, 2],
    ],
  ];
const det = (m: Matrix2) => {const p=m[0][0]*m[1][1],q=m[0][1]*m[1][0];return Math.abs(p-q)<=32*Number.EPSILON*(Math.abs(p)+Math.abs(q))?0:p-q;};
const fmt=(n:number)=>Number(n.toPrecision(8));
const matrixTex=(m:Matrix2)=>String.raw`\begin{bmatrix}${m[0][0]}&${m[0][1]}\\${m[1][0]}&${m[1][1]}\end{bmatrix}`;
const orientation = (d: number) =>
  d > 0
    ? "Positive (Counterclockwise)"
    : d < 0
      ? "Negative (Clockwise)"
      : "Collapsed";
const clean = (n: number) => (Math.abs(n) < 0.05 ? 0 : Math.round(n * 10) / 10);
function MatrixInputs({
  matrix,
  onChange,
}: {
  matrix: Matrix2;
  onChange: Dispatch<SetStateAction<Matrix2>>;
}) {
  return (
    <div className="da-input-matrix">
      {matrix.flatMap((row, r) =>
        row.map((v, c) => (
          <input
            key={`${r}-${c}`}
            aria-label={`matrix entry row ${r + 1} column ${c + 1}`}
            type="number"
            step="0.1"
            value={v}
            onChange={(e) => {
              const value=Number(e.target.value);if(Number.isFinite(value))onChange(previous=>{const next=previous.map(row=>[...row]) as Matrix2;next[r][c]=value;return next;});
            }}
          />
        )),
      )}
    </div>
  );
}
function Plane({matrix,onChange,interactive=false}:{matrix:Matrix2;onChange?:(m:Matrix2)=>void;interactive?:boolean}) {
 const drag=useRef<number|null>(null),marker=useId();
 const cols=[[matrix[0][0],matrix[1][0]],[matrix[0][1],matrix[1][1]]],corners=[[0,0],cols[0],[cols[0][0]+cols[1][0],cols[0][1]+cols[1][1]],cols[1]];
 const minX=Math.min(-1,...corners.map(p=>p[0]))-.4,maxX=Math.max(4.5,...corners.map(p=>p[0]))+.4,minY=Math.min(-2,...corners.map(p=>p[1]))-.3,maxY=Math.max(4.5,...corners.map(p=>p[1]))+.3,scale=Math.min(300/(maxX-minX),265/(maxY-minY));
 const origin=[30-minX*scale,285+minY*scale],map=(p:number[])=>[origin[0]+p[0]*scale,origin[1]-p[1]*scale],points=(pts:number[][])=>pts.map(p=>map(p).join(",")).join(" ");
 const update=(i:number,x:number,y:number)=>{if(!onChange)return;const m=matrix.map(r=>[...r]) as Matrix2;m[0][i]=clean(x);m[1][i]=clean(y);onChange(m);};
 const tickStep=Math.max(1,Math.ceil(Math.max(maxX-minX,maxY-minY)/9)),ticks=Array.from({length:Math.ceil(Math.max(maxX,maxY)/tickStep)-Math.floor(Math.min(minX,minY)/tickStep)+1},(_,i)=>(Math.floor(Math.min(minX,minY)/tickStep)+i)*tickStep);
 return <svg className={`da-plane ${interactive?"transformed":"before"}`} viewBox="0 0 360 320" role="img" aria-label={interactive?"Transformed parallelogram with draggable columns":"Unit square before transformation"} data-scale={scale} data-origin-x={origin[0]} data-origin-y={origin[1]} onPointerMove={event=>{if(drag.current===null)return;const ctm=event.currentTarget.getScreenCTM();if(!ctm)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(ctm.inverse());update(drag.current,(p.x-origin[0])/scale,(origin[1]-p.y)/scale);}} onPointerUp={event=>{drag.current=null;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);}} onPointerCancel={()=>{drag.current=null;}} onLostPointerCapture={()=>{drag.current=null;}}>
 <defs><marker id={marker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10" fill={interactive?"#098945":"#1681ef"}/></marker></defs>
 {ticks.map(v=><g key={v}><path d={`M${map([v,0])[0]} 15V290 M20 ${map([0,v])[1]}H345`} className="grid"/>{v!==0&&v>=minX&&v<=maxX&&<text x={map([v,0])[0]+2} y={origin[1]+14}>{v}</text>}{v!==0&&v>=minY&&v<=maxY&&<text x={origin[0]-8} y={map([0,v])[1]+4} textAnchor="end">{v}</text>}</g>)}
 <path className="axis" d={`M20 ${origin[1]}H345 M${origin[0]} 15V290`}/><text x="344" y={origin[1]-7}>x</text><text x={origin[0]+6} y="16">y</text>
 <polygon className={interactive?"area":"unit"} points={points(corners)}/><path className="far-edges" d={`M${map(cols[0])}L${map(corners[2])}L${map(cols[1])}`}/>
 {corners.map((p,i)=><g key={i}><circle className="corner" cx={map(p)[0]} cy={map(p)[1]} r="2"/>{[0,2].includes(i)&&<text x={map(p)[0]+(i===0?-8:4)} textAnchor={i===0?"end":undefined} y={map(p)[1]+(i===0?14:-7)} textLength={i===0?35:undefined} lengthAdjust="spacingAndGlyphs">({p.map(fmt).join(", ")})</text>}</g>)}
 {cols.map((p,i)=><g key={i}><line className={`vector v${i}`} x1={origin[0]} y1={origin[1]} x2={map(p)[0]} y2={map(p)[1]} markerEnd={`url(#${marker})`}/><circle tabIndex={interactive?0:undefined} role={interactive?"slider":undefined} aria-label={interactive?`Column ${i+1} vector`:undefined} aria-valuetext={interactive?p.join(", "):undefined} cx={map(p)[0]} cy={map(p)[1]} r={interactive?5:2.5} className="vector-handle" onPointerDown={event=>{if(interactive){drag.current=i;event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);event.preventDefault();}}} onKeyDown={event=>{const delta:Record<string,number[]>={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};if(interactive&&delta[event.key]){event.preventDefault();const step=event.shiftKey?.5:.1;update(i,p[0]+delta[event.key][0]*step,p[1]+delta[event.key][1]*step);}}}/><text className="vector-label" x={Math.max(20,Math.min(250,map(p)[0]+(i===0?7:-40)))} y={map(p)[1]+(i===0?(interactive?17:27):-12)} textLength={interactive?86:70} lengthAdjust="spacingAndGlyphs">{interactive?`u${i+1} = A e${i+1} = (${p.map(fmt).join(", ")})`:`e${i+1} = (${p.join(", ")})`}</text></g>)}
 </svg>;
}
export default function DeterminantAreaTargetLesson10196({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [matrix, setMatrix] = useState<Matrix2>(DEFAULT),
    [checks, setChecks] = useState<boolean[]>([false, false, false, false]),
    [solutions, setSolutions] = useState(false),
    [problems,setProblems]=useState<Matrix2[]>(practices);
  const d = det(matrix),
    area = Math.abs(d),
    orient = orientation(d),
    setPreset = (m: Matrix2) => setMatrix(m.map((r) => [...r]) as Matrix2),
    random = () => {
      setMatrix(Array.from({length:2},()=>Array.from({length:2},()=>Math.floor(Math.random()*7)-2)) as Matrix2);
    },
    randomPractice = () => {
      setProblems(Array.from({length:4},()=>Array.from({length:2},()=>Array.from({length:2},()=>Math.floor(Math.random()*9)-4))) as Matrix2[]);
      setChecks([false,false,false,false]);setSolutions(false);
    };
  return (
    <main
      className="da10196-page lesson-reference"
      data-testid="school-mockup-0870"
      data-object-model="dedicated-determinant-area-linear-transformation-engine"
      data-a={matrix[0][0]}
      data-b={matrix[0][1]}
      data-c={matrix[1][0]}
      data-d={matrix[1][1]}
      data-determinant={d}
      data-area={area}
      data-orientation={orient}
      data-solutions={solutions}
    >
      <header className="da-hero">
        <small>CLASS 12 · MATRICES AND DETERMINANTS</small>
        <h1>{lesson.title}</h1>
        <div className="da-hero-copy">
          See how a 2×2 matrix transforms the unit square into a parallelogram.
          The determinant gives the signed area (orientation + size).
        </div>
        <span>Interactive Lab</span>
        <Link to="/lessons/school/class-12">← School lessons</Link>
      </header>
      <section className="da-controls">
        <article>
          <b>MATRIX A (ADJUSTABLE)</b>
          <div>
            <i>A =</i>
            <MatrixInputs matrix={matrix} onChange={setMatrix} />
            <aside>
              <button onClick={random}>⚄ Random</button>
              <button
                onClick={() =>
                  setPreset([
                    [1, 0],
                    [0, 1],
                  ])
                }
              >
                ↳ Identity I
              </button>
              <button
                onClick={() =>
                  setPreset([
                    [matrix[0][1], matrix[0][0]],
                    [matrix[1][1], matrix[1][0]],
                  ])
                }
              >
                Swap columns
              </button>
              <button
                onClick={() =>
                  setPreset([
                    [matrix[0][0], matrix[1][0]],
                    [matrix[0][1], matrix[1][1]],
                  ])
                }
              >
                Transpose Aᵀ
              </button>
            </aside>
          </div>
        </article>
        <article>
          <b>◇ det(A)</b>
          <strong>
            {matrix[0][0]} · {matrix[1][1]} − {matrix[0][1]} · {matrix[1][0]} ={" "}
            {fmt(d)}
          </strong>
          <em>= {fmt(d)}</em>
        </article>
        <article>
          <b>◇ Orientation</b>
          <strong className={d < 0 ? "negative" : ""}>{d<0?<RotateCw/>:d>0?<RotateCcw/>:<Minus/>} {orient}</strong>
        </article>
        <article>
          <b>◇ Area</b>
          <strong>|det(A)| · 1 = {fmt(area)}</strong>
          <em>square units</em>
        </article>
      </section>
      <section className="da-graphs">
        <article>
          <h2>BEFORE TRANSFORMATION (UNIT SQUARE)</h2>
          <Plane
            matrix={[
              [1, 0],
              [0, 1],
            ]}
          />
          <footer>→ e₁=(1,0) → e₂=(0,1) Unit square area = 1</footer>
        </article>
        <i>A →</i>
        <article>
          <h2>AFTER TRANSFORMATION BY A</h2>
          <Plane matrix={matrix} onChange={setMatrix} interactive />
          <footer>
            → u₁=({matrix[0][0]},{matrix[1][0]}) → u₂=({matrix[0][1]},
            {matrix[1][1]}) Parallelogram area = {area}
          </footer>
        </article>
      </section>
      <section className="da-theory">
        <article>
          <h2>DETERMINANT (SIGNED AREA)</h2>
          <p><MathExpression value={String.raw`\det(A)=ad-bc`}/></p>
          <p>
            = {matrix[0][0]}·{matrix[1][1]} − {matrix[0][1]}·{matrix[1][0]}
          </p>
          <p>= {d}</p>
          <strong>
            {d > 0
              ? "Positive ⇒ Counterclockwise orientation"
              : d < 0
                ? "Negative ⇒ Clockwise orientation"
                : "Zero ⇒ Collapsed area"}
          </strong>
        </article>
        <article>
          <h2>AREA CONNECTIONS</h2>
          <p>• Parallelogram area = |det(A)| = {fmt(area)} square units</p>
          <p><MathExpression value={String.raw`\text{Triangle area}=\frac12|\det(A)|=${fmt(area/2)}`} /></p>
        </article>
        <article>
          <h2>WHAT IF det(A) CHANGES SIGN?</h2>
          <p>
            Negative determinant is clockwise orientation. Swapping columns or negating one column reverses orientation and preserves the area magnitude.
          </p>
          <strong>↺ Positive (Counterclockwise)</strong>
          <strong className="red">↻ Negative (Clockwise)</strong>
        </article>
      </section>
      <section className="da-collapse">
        <article>
          <h2>WHEN det(A) = 0 (COLLAPSE)</h2>
          <p>
            The vectors become linearly dependent. The parallelogram collapses
            into a line segment (or a point). Area = 0.
          </p>
        </article>
        <div>
          <svg viewBox="0 0 280 90" role="img" aria-label="Collapsed parallelogram from (0,0) to (6,3)"><path d="M20 70L250 15" stroke="#b3bccb"/><path d="M35 66L230 20" stroke="#263446" strokeWidth="2"/><circle cx="35" cy="66" r="3"/><circle cx="100" cy="50.67" r="2"/><circle cx="165" cy="35.33" r="2"/><circle cx="230" cy="20" r="3"/><text x="20" y="84">(0, 0)</text><text x="225" y="40">(6, 3)</text></svg>
        </div>
        <article>
          Example: <MathExpression value={String.raw`A=\begin{bmatrix}2&4\\1&2\end{bmatrix}`} /><strong>det(A)=2·2−4·1=0</strong>
        </article>
      </section>
      <aside className="da-warning">
        ▲ <b>IMPORTANT: AREA USES ABSOLUTE DETERMINANT</b> Geometric area is
        always non-negative. Use |det(A)|, not det(A), to compute area.
      </aside>
      <section className="da-worked">
        <article>
          <h2>WORKED EXAMPLE (CORRECT)</h2><p>Example: <MathExpression value={`A=${matrixTex(matrix)}`}/></p>
          <p>
            1) det(A) = {matrix[0][0]}·{matrix[1][1]} − {matrix[0][1]}·
            {matrix[1][0]} = {d}
          </p>
          <p>
            2) Orientation: det(A) {d > 0 ? ">" : d < 0 ? "<" : "="} 0 ⇒ {orient}
          </p>
          <p>3) Parallelogram area = |det(A)| = {area}</p>
          <p>4) Triangle area = {area / 2}</p>
          <p>5) Transformed vectors are the columns of A.</p><p><MathExpression value={String.raw`u_1=Ae_1=(${matrix[0][0]},${matrix[1][0]})`}/></p><p><MathExpression value={String.raw`u_2=Ae_2=(${matrix[0][1]},${matrix[1][1]})`}/></p>
        </article>
        <article>
          <h2>CHECK (OPTIONAL)</h2>
          <p>
            <MathExpression value={`A=${matrixTex(matrix)}`}/>
          </p>
          <p>
            <MathExpression value={`A^T=${matrixTex([[matrix[0][0],matrix[1][0]],[matrix[0][1],matrix[1][1]]])}`}/>
          </p>
          <b>
            det(A)={fmt(d)}, |det(A)|={fmt(area)}
          </b><p>Orientation = {orient}</p><p>Area (parallelogram) = {fmt(area)}</p><p>Area (triangle) = {fmt(area/2)}</p>
        </article>
        <article>
          <h2>VERIFICATION</h2>
          <p>Column product check:</p>
          <p>
            <MathExpression value={String.raw`Ae_1=${matrixTex(matrix)}\begin{bmatrix}1\\0\end{bmatrix}=\begin{bmatrix}${matrix[0][0]}\\${matrix[1][0]}\end{bmatrix}`} />
          </p>
          <p>
            <MathExpression value={String.raw`Ae_2=${matrixTex(matrix)}\begin{bmatrix}0\\1\end{bmatrix}=\begin{bmatrix}${matrix[0][1]}\\${matrix[1][1]}\end{bmatrix}`} />
          </p>
          <b>Determinant cross-check: {d} ✓</b>
        </article>
      </section>
      <section className="da-practice">
        <h2>TARGETED PRACTICE</h2>
        <div>
          {problems.map((m, i) => {
            const pd = det(m);
            return (
              <article key={i}>
                <i>{i + 1}</i>
                <b>
                  <MathExpression value={`A=${matrixTex(m)}`}/>
                </b>
                <p>(a) det(A) = ?</p>
                <p>(b) Orientation?</p>
                <p>(c) Area?</p>
                <button
                  onClick={() =>
                    setChecks((v) => v.map((x, j) => (j === i ? !x : x)))
                  }
                >
                  {checks[i] ? "Hide" : "Check"}
                </button>
                {checks[i] && (
                  <strong>
                    det={pd}; {orientation(pd)}; area={Math.abs(pd)}
                  </strong>
                )}
              </article>
            );
          })}
        </div>
        <footer>
          <button onClick={randomPractice}>
            <Shuffle />
            New random problems
          </button>
          <button onClick={() => setSolutions((v) => !v)}>
            <Eye />
            {solutions ? "Hide" : "Show"} solutions
          </button>
        </footer>
        {solutions && (
          <p className="da-solutions">
            Solutions:{" "}
            {problems
              .map(
                (m) => `${det(m)}, ${orientation(det(m))}, ${Math.abs(det(m))}`,
              )
              .join(" | ")}
          </p>
        )}
      </section>
      <nav className="da-next">
        <Link to="/lessons/school/class-12/class-12-matrices-and-determinants-inverse-by-adjoint">
          ← Inverse by Adjoint
        </Link>
        <Link to="/lessons/school/class-12/class-12-matrices-and-determinants-solving-linear-equations-by-matrices">
          Solving Linear Equations by Matrices →
        </Link>
      </nav>
      <LessonMockupFooter />

    </main>
  );
}
