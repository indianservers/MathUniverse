import { CheckCircle2, Eye, RefreshCw, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./InverseAdjointTargetLesson10195.css";
import MathExpression from "../../../components/ui/MathExpression";
import {minorDet as det2,determinant3 as det3,cofactorMatrix as cofactor,transposeMatrix as transpose,matrixProduct as multiply,inverseFraction as frac,identityVerified} from "./inverseAdjointModel";
import "../components/LessonMockupReference.css";

type M3 = number[][];
type M2 = [[number, number], [number, number]];
const EXAMPLES: M3[] = [
  [
    [1, 2, 3],
    [0, 4, 5],
    [1, 0, 6],
  ],
  [
    [2, 1, 0],
    [1, 2, 1],
    [0, 1, 2],
  ],
];
const B: M2 = [
    [4, 7],
    [2, 6],
  ],
  C2: M2 = [
    [2, -1],
    [5, 3],
  ],
  S: M3 = [
    [1, 2, 3],
    [2, 4, 6],
    [1, 2, 3],
  ];
const texFrac=(n:number,d=1)=>{const f=frac(n,d);const parts=f.split("/");return parts.length===2?String.raw`\dfrac{${parts[0]}}{${parts[1]}}`:f==="undefined"?String.raw`\text{undefined}`:f;};
const adj2 = (m: M2): M2 => [
  [m[1][1], -m[0][1]],
  [-m[1][0], m[0][0]],
];
function Matrix({
  m,
  den = 1,
  selected,
  label,
  reciprocal=false,
  approximate=false,
  onChange,
}: {
  m: M3;
  den?: number;
  selected?: [number, number];
  label: string;
  reciprocal?:boolean;
  approximate?:boolean;
  onChange?:(row:number,column:number,value:number)=>void;
}) {
  return (
    <div className={`ia-matrix n${m.length}`} aria-label={label}>
      {m.flatMap((row, r) =>
        row.map((v, c) => (
          <span
            key={`${r}-${c}`}
            className={
              selected?.[0] === r && selected[1] === c ? "selected" : ""
            }
          >
            {onChange?<input aria-label={`Matrix A row ${r+1} column ${c+1}`} type="number" step="any" value={v} onChange={event=>{const value=Number(event.target.value);if(Number.isFinite(value))onChange(r,c,value);}}/>:reciprocal&&v===0?<small className="ia-undefined">undefined</small>:<MathExpression value={texFrac(reciprocal?1:approximate&&Math.abs(v-Math.round(v))<1e-10?Math.round(v):v,reciprocal?v:den)}/>}
          </span>
        )),
      )}
    </div>
  );
}

export default function InverseAdjointTargetLesson10195({
  lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [example, setExample] = useState(0),
    [matrix,setMatrix]=useState<M3>(EXAMPLES[0].map(r=>[...r])),
    [editing,setEditing]=useState(false),
    [stage, setStage] = useState(1),
    [showCofactors, setShowCofactors] = useState(false),
    [order, setOrder] = useState<"left" | "right">("left"),
    [cell, setCell] = useState<[number, number]>([0, 1]),
    [answer, setAnswer] = useState(false);
  const A = matrix,
    det = det3(A),
    cof = cofactor(A),
    adj = transpose(cof),
    inverse = det!==0?adj.map((row) => row.map((v) => v / det)):null,
    left = inverse?multiply(A,inverse):[],
    right = inverse?multiply(inverse,A):[],
    product = order === "left" ? left : right,
    rowN = order==="left"?A[cell[0]]:adj[cell[0]], rowDen=order==="left"?1:det,
    columnN=(order==="left"?adj:A).map(row=>row[cell[1]]), columnDen=order==="left"?det:1,
    terms=rowN.map((v,i)=>v*columnN[i]),
    sum=det!==0?terms.reduce((a,b)=>a+b,0)/det:null;
  const reset = () => {
    setExample(0);setMatrix(EXAMPLES[0].map(r=>[...r]));setEditing(false);
    setStage(1);
    setShowCofactors(false);
    setOrder("left");
    setCell([0, 1]);
    setAnswer(false);
  };
  const bDet = det2(B),
    bAdj = adj2(B),
    cDet = det2(C2),
    cAdj = adj2(C2);
  return (
    <main
      className="ia10195-page lesson-reference"
      data-testid="school-mockup-0869"
      data-object-model="dedicated-inverse-adjoint-exact-matrix-engine"
      data-example={example + 1}
      data-stage={stage}
      data-determinant={det}
      data-order={order}
      data-row={cell[0] + 1}
      data-column={cell[1] + 1}
      data-cell-value={sum===null?"undefined":Math.abs(sum)<1e-10?0:Math.abs(sum-1)<1e-10?1:sum}
      data-cofactors-visible={showCofactors}
      data-answer-visible={answer}
    >
      <header className="ia-hero">
        <small>CLASS 12 · MATRICES AND DETERMINANTS</small>
        <h1>{lesson.title}</h1>
        <div className="ia-hero-copy">
          Compute the inverse of a matrix using the adjoint method and verify
          the result.
        </div>
        <div className="ia-badges">{["22 min","ADVANCED","CONCEPT","matrix","inverse"].map(tag=><span key={tag}>{tag}</span>)}</div>
        <Link to="/lessons/school/class-12">← School lessons</Link>
        <div className="ia-hero-actions">
          <button onClick={reset}>
            <RefreshCw />
            Reset lab
          </button>
          <button
            onClick={() => {
              const next=(example+1)%EXAMPLES.length;setExample(next);setMatrix(EXAMPLES[next].map(r=>[...r]));setEditing(false);
              setStage(1);
              setCell([0, 1]);
            }}
          >
            <Sparkles />
            New example
          </button>
        </div>
      </header>
      <section className="ia-machine">
        <h2>THE FOUR-STAGE INVERSE MACHINE</h2>
        <div>
          {[
            ["Input & Determinant", "Enter matrix and compute det(A)"],
            ["Adjoint", "Compute adj(A)"],
            ["Inverse", "A⁻¹ = adj(A) / det(A)"],
            ["Verify", "Check A·A⁻¹ and A⁻¹·A"],
          ].map((s, i) => (
            <button
              key={s[0]}
              className={stage === i + 1 ? "active" : ""}
              aria-current={stage===i+1?"step":undefined} onClickCapture={event=>{event.stopPropagation();setStage(i+1);document.getElementById(`ia-stage-${i+1}`)?.scrollIntoView({behavior:"smooth",block:"start"});}}
            >
              <span className="ia-stage-icon">{i===0?<Sparkles/>:i===1?<RefreshCw/>:i===2?<Eye/>:<CheckCircle2/>}</span><i>Stage {i + 1}</i>
              <b>{s[0]}</b>
              <span>{s[1]}</span>
            </button>
          ))}
        </div>
      </section>
      <div className="ia-layout">
        <div className="ia-main">
          <div className="ia-top-grid">
            <section id="ia-stage-1" className={stage === 1 ? "focus" : ""}>
              <h2>
                <i>1</i> INPUT & DETERMINANT
              </h2>
              <article>
                <b>Matrix A</b><button className="ia-edit" aria-pressed={editing} onClick={()=>setEditing(v=>!v)}>{editing?"Done editing":"Edit matrix"}</button>
                <div className="ia-equation">
                  <em>A =</em>
                  <Matrix m={A} label="matrix A" onChange={editing?(r,c,v)=>setMatrix(old=>old.map((row,i)=>row.map((n,j)=>i===r&&j===c?v:n))):undefined}/>
                </div>
              </article>
              <article className="ia-det">
                <span>det(A)</span>
                <strong>{det}</strong>
              </article>
              <footer className={det !== 0 ? "good" : "bad"}>
                det(A){" "}
                {det !== 0
                  ? "≠ 0 — Inverse exists."
                  : "= 0 — Matrix is singular."}
              </footer>
              <aside>
                <b>DETERMINANT GATE</b>
                <p>If det(A)=0, the inverse does not exist.</p>
                <button onClick={()=>{setMatrix(S.map(r=>[...r]));setEditing(false);setStage(1);}}>Try singular matrix</button>
              </aside>
            </section>
            <section id="ia-stage-2" className={stage === 2 ? "focus" : ""}>
              <h2>
                <i>2</i> ADJOINT OF A
              </h2>
              <p>Adjoint is the transpose of the cofactor matrix.</p>
              <div className="ia-equation">
                <em>adj(A)</em>
                <Matrix m={adj} label="adjoint of A" />
              </div>
              <button
                className="ia-outline"
                onClick={() => setShowCofactors((v) => !v)}
              >
                <Eye />
                {showCofactors ? "Hide" : "Show"} cofactor matrix
              </button>
              {showCofactors && (
                <div className="ia-pop">
                  <b>Cofactor matrix</b>
                  <Matrix m={cof} label="cofactor matrix" />
                </div>
              )}
            </section>
            <section id="ia-stage-3" className={stage === 3 ? "focus" : ""}>
              <h2>
                <i>3</i> INVERSE OF A
              </h2>
              {det!==0?<><div className="ia-formula"><MathExpression value={String.raw`A^{-1}=\frac{1}{\det(A)}\operatorname{adj}(A)=\frac{1}{${det}}\operatorname{adj}(A)`}/></div>
              <div className="ia-equation">
                <em><MathExpression value={String.raw`A^{-1}=\frac{1}{${det}}`}/></em>
                <Matrix m={adj} label="scaled adjoint" />
              </div>
              <div className="ia-equation">
                <em>=</em>
                <Matrix m={adj} den={det} label="inverse of A" />
              </div></>:<p className="ia-singular-message">det(A) = 0. The inverse does not exist.</p>}
            </section>
            <section id="ia-stage-4" className={stage === 4 ? "focus" : ""}>
              <h2>
                <i>4</i> VERIFY
              </h2>
              {det!==0?[
                ["Check 1: A · A⁻¹ = I₃", left],
                ["Check 2: A⁻¹ · A = I₃", right],
              ].map(([name, m]) => (
                <article key={String(name)}>
                  <b>{String(name)}</b>
                  <span>
                    <CheckCircle2 />
                    {identityVerified(m as M3)?"Verified":"Check precision"}
                  </span>
                  <div className="ia-equation">
                    <Matrix m={m as M3} label={String(name)} approximate />
                    <em>= I₃</em>
                  </div>
                </article>
              )):<p className="ia-singular-message">Verification with A⁻¹ is unavailable for a singular matrix.</p>}
            </section>
          </div>
          <section className="ia-inspect">
            <h2>INSPECT A MULTIPLICATION CELL (Row · Column)</h2>
            <p>Explore how entries of the product are computed.</p>
            {det!==0?<><div className="ia-selects">
              <label>
                Inspect{" "}
                <select aria-label="Multiplication order"
                  value={order}
                  onChange={(e) => setOrder(e.target.value as "left" | "right")}
                >
                  <option value="left">A · A⁻¹</option>
                  <option value="right">A⁻¹ · A</option>
                </select>
              </label>
              <label>
                Cell (i,j){" "}
                <select aria-label="Product cell"
                  value={`${cell[0]},${cell[1]}`}
                  onChange={(e) =>
                    setCell(
                      e.target.value.split(",").map(Number) as [number, number],
                    )
                  }
                >
                  {[0, 1, 2].flatMap((r) =>
                    [0, 1, 2].map((c) => (
                      <option key={`${r},${c}`} value={`${r},${c}`}>
                        ({r + 1}, {c + 1})
                      </option>
                    )),
                  )}
                </select>
              </label>
            </div>
            <div className="ia-inspect-grid">
              <article>
                <b>Row {cell[0] + 1}</b>
                <div className="ia-vector">
                  [
                  {rowN.map((v, i) => (
                    <span key={i}><MathExpression value={texFrac(v,rowDen)}/></span>
                  ))}
                  ]
                </div>
                <b>Column {cell[1] + 1}</b>
                <div className="ia-col">
                  {columnN.map((v, i) => (
                    <span key={i}><MathExpression value={texFrac(v,columnDen)}/></span>
                  ))}
                </div>
              </article>
              <article>
                <b>Dot product</b>
                {terms.map((v, i) => (
                  <p key={i}>
                    <MathExpression value={String.raw`(${texFrac(rowN[i],rowDen)})\cdot(${texFrac(columnN[i],columnDen)})=${texFrac(v,det)}`}/>
                  </p>
                ))}
                <strong>= {Math.round(sum??0)}</strong>
              </article>
              <article>
                <p>
                  So, ({order === "left" ? "A·A⁻¹" : "A⁻¹·A"})
                  <sub>
                    {cell[0] + 1},{cell[1] + 1}
                  </sub>{" "}
                  = {Math.round(sum??0)}
                </p>
                <Matrix
                  m={product}
                  selected={cell}
                  label="selected identity product" approximate
                />
                <small>This cell equals {Math.round(sum??0)}.</small>
              </article>
            </div></>:<p className="ia-singular-message">Choose a non-singular matrix to inspect inverse multiplication.</p>}
          </section>
        </div>
        <aside className="ia-side">
          <section>
            <h2>DO NOT USE ELEMENTWISE RECIPROCALS</h2>
            <b>ELEMENTWISE RECIPROCALS</b>
            <p>Taking reciprocals of entries is NOT the inverse.</p><p>Example (wrong):</p><Matrix m={A} label="original matrix in reciprocal warning"/><p className="ia-wrong-equals">≠ A⁻¹ (entrywise reciprocals below)</p>
            <Matrix m={A} label="wrong reciprocal example" reciprocal />
            <p>This is not the inverse. Always use the adjoint method.</p>
          </section>
          <section>
            <h2>SINGULAR-MATRIX COMPARISON</h2>
            <p>Example: S =</p>
            <Matrix m={S} label="singular matrix S" />
            <strong>det(S) = {det3(S)}</strong>
            <p>S is singular. Inverse does not exist.</p>
            <p>Try computing adj(S):</p><Matrix m={transpose(cofactor(S))} label="singular adjoint" /><p>Dividing adj(S) by det(S) = 0 is undefined.</p>
          </section>
          <section className="memory">
            <h2>QUICK MEMORY</h2>
            <p>① If det(A) ≠ 0, A⁻¹ exists.</p>
            <p>② <MathExpression value={String.raw`A^{-1}=\frac{1}{\det(A)}\operatorname{adj}(A)`}/></p>
            <p>③ Verify with both products.</p>
          </section>
        </aside>
      </div>
      <section className="ia-practice">
        <h2>PRACTICE: 2 × 2 INVERSE (BY ADJOINT)</h2>
        <div>
          <article>
            <b>Matrix B</b>
            <div className="ia-equation">
              <em>B =</em>
              <Matrix m={B} label="practice matrix B" />
            </div>
          </article>
          <article>
            <b>Solution</b>
            <p><MathExpression value={`\\det(B)=4\\cdot6-7\\cdot2=24-14=${bDet}`}/></p>
            <p>adj(B) =</p>
            <Matrix m={bAdj} label="adjoint B" />
            <p><MathExpression value={String.raw`B^{-1}=\frac1{${bDet}}\operatorname{adj}(B)`}/></p>
            <Matrix m={bAdj} den={bDet} label="inverse B" />
          </article>
          <article>
            <b>Verify</b>
            <p>B · B⁻¹ =</p><Matrix m={multiply(B,bAdj.map(row=>row.map(v=>v/bDet)))} label="B identity" approximate/><p>B⁻¹ · B =</p><Matrix m={multiply(bAdj.map(row=>row.map(v=>v/bDet)),B)} label="B reverse identity" approximate/>
            <span>
              <CheckCircle2 />
              Verified
            </span>
          </article>
          <article>
            <b>Try one</b>
            <div className="ia-equation">
              <em>C =</em>
              <Matrix m={C2} label="challenge matrix C" />
            </div>
            <p>Compute C⁻¹.</p>
            <button onClick={() => setAnswer((v) => !v)}>
              {answer ? "Hide" : "Show"} answer
            </button>
            {answer && (
              <div>
                <b>det(C)={cDet}</b>
                <Matrix m={cAdj} den={cDet} label="inverse C answer" />
              </div>
            )}
          </article>
        </div>
      </section>
      <footer className="ia-takeaway">
        <b>Key takeaway:</b> For any non-singular matrix A, <MathExpression value={String.raw`A^{-1}=\frac{1}{\det(A)}\operatorname{adj}(A)`}/><p>Always compute det(A) first. If it is zero, stop: the inverse does not exist. Then compute adj(A), form A⁻¹, and verify both products.</p>
      </footer>
      

    </main>
  );
}
