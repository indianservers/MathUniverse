import {
  ArrowLeft,
  ArrowRight,
  Edit3,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./GroupedMeanAssumedTargetLesson10103.css";
import{groupedMeanStepModel}from "./groupedMeanStepModel";
import MathExpression from "../../../components/ui/MathExpression";

type MeanRow = { id: number; lower: number; upper: number; frequency: number };
const defaults: MeanRow[] = [
  { id: 1, lower: 0, upper: 10, frequency: 4 },
  { id: 2, lower: 10, upper: 20, frequency: 8 },
  { id: 3, lower: 20, upper: 30, frequency: 12 },
  { id: 4, lower: 30, upper: 40, frequency: 10 },
  { id: 5, lower: 40, upper: 50, frequency: 6 },
];
const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;

export default function GroupedMeanAssumedTargetLesson10103({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rows, setRows] = useState<MeanRow[]>(defaults);
  const [assumed, setAssumed] = useState(25);
  const [dragging, setDragging] = useState(false);
  const [editing, setEditing] = useState(false);
  const [actions, setActions] = useState(0);
  const lineRef = useRef<SVGSVGElement>(null);
  const {enriched,totalFrequency,totalStep:totalDeviation,mean}=groupedMeanStepModel(rows,assumed,1);
  const directMean=mean,invariant=mean!==null&&Math.abs(assumed+totalDeviation/totalFrequency-mean)<=1e-8*Math.max(1,Math.abs(mean));
  const [draftKey,setDraftKey]=useState<string|null>(null),[draft,setDraft]=useState(''),[error,setError]=useState('');
  const frame=useRef<{min:number;max:number}|null>(null);
  const minX=frame.current?.min??Math.min(rows[0].lower,assumed),maxX=frame.current?.max??Math.max(rows.at(-1)!.upper,assumed);
  const sx=(x:number)=>30+(x-minX)/(maxX-minX)*580,markerX=sx(assumed);
  const meanText=mean===null?'—':String(round(mean));

  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setA=(value:number)=>{if(Number.isFinite(value))setAssumed(Math.max(-1e9,Math.min(1e9,round(value,3))));};
  const updateRow=(id:number,patch:Partial<MeanRow>)=>setRows(current=>current.map(row=>row.id===id?{...row,...patch}:row));
  const edit=(key:string,text:string,apply:(v:number)=>void,okay:(v:number)=>boolean)=>{setDraftKey(key);setDraft(text);const v=text.trim()===''?NaN:Number(text);if(!Number.isFinite(v)||!okay(v)){setError('Use finite ordered boundaries, whole nonnegative frequencies and a finite assumed mean.');return;}setError('');act(()=>apply(v));};
  const inputValue=(key:string,v:number)=>draftKey===key?draft:v;
  const blur=()=>{setDraftKey(null);setError('');};
  const updateMarker=(event:PointerEvent<SVGSVGElement>)=>{if(!lineRef.current)return;const m=lineRef.current.getScreenCTM();if(!m)return;const pt=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());setA(minX+Math.max(0,Math.min(1,(pt.x-30)/580))*(maxX-minX));};

  const reset = () =>
    act(() => {
      setRows(defaults);
      setAssumed(25);
      setEditing(false);setDragging(false);frame.current=null;setDraftKey(null);setError('');
    });

  return (
    <section
      className="gma10103-page"
      data-testid="school-mockup-0777"
      data-object-model="dedicated-assumed-mean-deviation-invariant-engine"
      data-assumed-mean={assumed}
      data-total-frequency={round(totalFrequency)}
      data-total-deviation={round(totalDeviation)}
      data-mean={mean===null?"none":mean}
      data-exact-deviation={totalDeviation}
      data-direct-mean={directMean===null?"none":directMean}
      data-invariant={String(invariant)}
      data-actions={actions}
    >
      <div className="gma10103-hero">
        <div>
          <small>CLASS 10 · STATISTICS</small>
          <Link className="gma10103-school" to="/lessons/school">← School lessons</Link>
          <h1>Grouped Mean by Assumed Mean</h1>
          <p>
            Use a convenient assumed mean A to simplify calculations. The final
            mean stays the same for any valid A.
          </p>
          <nav>
            <span>18 min</span>
            <span>INTERMEDIATE</span>
            <span>CONCEPT</span>
            <span>statistics</span>
          </nav>
        </div>
        <button onClick={reset}>
          <RotateCcw /> Reset all
        </button>
      </div>
      <main>
        <section className="gma10103-workbench">
          <h2>
            <b>1</b> ASSUMED-MEAN WORKBENCH
          </h2>
          <p>Edit the table below. Changes update everything instantly.</p>
          <div>
            <table>
              <thead>
                <tr>
                  <th>Class interval</th>
                  <th>fᵢ</th>
                  <th>Midpoint xᵢ</th>
                  <th>Deviation dᵢ = xᵢ − A</th>
                  <th>fᵢ · dᵢ</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map((row, index) => (
                  <tr key={row.id} data-row-id={row.id} data-midpoint={row.midpoint} data-deviation={row.deviation} data-product={row.product}>
                    <td>
                      <input
                        aria-label={`Lower bound row ${index + 1}`}
                        type="number"
                        value={inputValue(`lower-${row.id}`,row.lower)}
                        onBlur={blur} step="any"
                        onChange={(event) =>
                          edit(`lower-${row.id}`,event.target.value,v=>updateRow(row.id,{lower:v}),v=>v<row.upper&&(index===0||v>=rows[index-1].upper))
                        }
                      />
                      <span>–</span>
                      <input
                        aria-label={`Upper bound row ${index + 1}`}
                        type="number"
                        value={inputValue(`upper-${row.id}`,row.upper)}
                        onBlur={blur} step="any"
                        onChange={(event) =>
                          edit(`upper-${row.id}`,event.target.value,v=>updateRow(row.id,{upper:v}),v=>v>row.lower&&(index===rows.length-1||v<=rows[index+1].lower))
                        }
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Frequency row ${index + 1}`}
                        type="number"
                        min="0"
                        value={inputValue(`frequency-${row.id}`,row.frequency)}
                        onBlur={blur} max="1000000" step="1"
                        onChange={(event) =>
                          edit(`frequency-${row.id}`,event.target.value,v=>updateRow(row.id,{frequency:v}),v=>Number.isInteger(v)&&v>=0&&v<=1e6)
                        }
                      />
                    </td>
                    <td>{round(row.midpoint)}</td>
                    <td
                      className={
                        row.deviation < 0
                          ? "negative"
                          : row.deviation > 0
                            ? "positive"
                            : "zero"
                      }
                    >
                      {round(row.deviation)}
                    </td>
                    <td
                      className={
                        row.product < 0
                          ? "negative"
                          : row.product > 0
                            ? "positive"
                            : "zero"
                      }
                    >
                      {round(row.product)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td>
                    Σfᵢ = <strong>{round(totalFrequency)}</strong>
                  </td>
                  <td />
                  <td />
                  <td>
                    Σfᵢdᵢ = <strong>{round(totalDeviation)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {error&&<p role="alert">{error}</p>}
          <aside>
            <TriangleAlert />
            <p>
              <strong>
                A (assumed mean) is only a convenient reference, <i>not</i> the
                answer.
              </strong>
              <br />
              The final mean remains invariant for any choice of A.
            </p>
          </aside>
        </section>
        <section className="gma10103-model">
          <article>
            <div className="gma10103-heading">
              <h2>
                <b>2</b> ASSUMED MEAN ON NUMBER LINE
              </h2>
              <div>
                <label>
                  Assumed mean A{" "}
                  {editing && (
                    <input
                      aria-label="Assumed mean"
                      type="number"
                      min="-1000000000"
                      max="1000000000" step="any"
                      value={inputValue('A',assumed)}
                      onBlur={blur}
                      onChange={event=>edit('A',event.target.value,setA,v=>Math.abs(v)<=1e9)}
                    />
                  )}
                </label>
                <button
                  aria-label="Decrease assumed mean"
                  onClick={() => act(() => setA(assumed - 1))}
                >
                  <Minus />
                </button>
                <strong>{assumed}</strong>
                <button
                  aria-label="Increase assumed mean"
                  onClick={() => act(() => setA(assumed + 1))}
                >
                  <Plus />
                </button>
                <button
                  aria-label="Edit assumed mean"
                  aria-pressed={editing}
                  onClick={() => act(() => setEditing((value) => !value))}
                >
                  <Edit3 />
                </button>
              </div>
            </div>
            <p>Choose A. Deviations dᵢ = xᵢ − A update automatically.</p>
            <svg
              ref={lineRef}
              viewBox="0 0 640 190"
              aria-label="Assumed mean number line"
              onPointerMove={(event) => dragging && updateMarker(event)}
              onPointerUp={event=>{if(dragging)updateMarker(event);frame.current=null;act(()=>setDragging(false));}}
              onPointerCancel={()=>{frame.current=null;setDragging(false);}}
            >
              <defs><marker id="gma10103-neg-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="#ff5728" stroke="none"/></marker><marker id="gma10103-pos-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill="#71d35a" stroke="none"/></marker></defs>
              <line className="axis" x1="30" y1="75" x2="610" y2="75" />
              {Array.from({ length: 51 }, (_, i) => (
                <line
                  key={i}
                  x1={30+i/50*580}
                  y1={i % 5 === 0 ? 68 : 72}
                  x2={30+i/50*580}
                  y2={i % 5 === 0 ? 82 : 78}
                />
              ))}
              {Array.from({length:6},(_,i)=>minX+i/5*(maxX-minX)).map((tick) => (
                <text key={tick} x={sx(tick)} textAnchor="middle" y="98">
                  {round(tick)}
                </text>
              ))}
              {enriched.map((row, index) => {
                const x=sx(row.midpoint);
                return (
                  <g key={row.id} data-deviation-id={row.id} role="button" tabIndex={0} aria-label={`Set assumed mean to midpoint ${row.midpoint}`} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();act(()=>setA(row.midpoint));}}} onClick={() => act(() => setA(row.midpoint))}>
                    <circle cx={x} cy="68" r="6" />
                    <text textAnchor="middle" x={x} y="45">
                      {round(row.midpoint)}
                    </text>
                    <path
                      data-deviation-arrow={row.id}
                      style={{display:row.deviation===0?'none':undefined}}
                      markerEnd={`url(#gma10103-${row.deviation<0?'neg':'pos'}-arrow)`}
                      className={
                        row.deviation < 0
                          ? "negative"
                          : row.deviation > 0
                            ? "positive"
                            : "zero"
                      }
                      d={`M${markerX} 86 Q${(markerX + x) / 2} ${120 + index * 8} ${x} 88`}
                    />
                    <text
                      className={
                        row.deviation < 0
                          ? "negative"
                          : row.deviation > 0
                            ? "positive"
                            : "zero"
                      }
                      x={x} textAnchor="middle"
                      y={148}
                    >
                      {round(row.deviation)}
                    </text>
                  </g>
                );
              })}
              <circle
                className="assumed-marker"
                cx={markerX}
                cy="75"
                r="9"
                role="slider"
                tabIndex={0}
                aria-label="Assumed mean marker"
                aria-valuemin={minX}
                aria-valuemax={maxX}
                aria-valuenow={assumed}
                onPointerDown={(event) => {
                  event.currentTarget.setPointerCapture(event.pointerId);
                  frame.current={min:minX,max:maxX};act(() => setDragging(true));
                }}
                onKeyDown={(event) => {
                  event.stopPropagation();
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setA(assumed - 1));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setA(assumed + 1));
                  }
                  if (event.key === "Home") {
                    event.preventDefault();
                    act(() => setA(25));
                  }
                }}
              />
            </svg>
            <footer>
              <span className="negative">dᵢ negative</span>
              <span>dᵢ zero</span>
              <span className="positive">dᵢ positive</span>
            </footer>
          </article>
          <article className="gma10103-result">
            <div>
              <h2>
                <b>3</b> MEAN USING ASSUMED MEAN METHOD
              </h2>
              {mean===null?<p>No observations: the mean is undefined.</p>:<><p><MathExpression value={String.raw`\bar{x}=A+\frac{\sum_{i} f_i d_i}{\sum_{i} f_i}`}/></p><p><MathExpression value={String.raw`=${assumed}+\frac{${round(totalDeviation,4)}}{${totalFrequency}}`}/></p><p><MathExpression value={String.raw`=${assumed}+(${round(totalDeviation/totalFrequency,4)})`}/></p><strong>= {meanText}</strong></>}

            </div>
            <aside>
              <h3>Mean (invariant)</h3>
              <strong>{meanText}</strong>
              <p>
                {mean===null?'Enter at least one observation to calculate the mean.':`The mean remains ${meanText} for any valid choice of A.`}
              </p>
              <b>{mean===null?"No observations":invariant?"Verified":"Check data"}</b>
            </aside>
          </article>
        </section>
      </main>
      <nav className="gma10103-next">
        <Link to="/lessons/school/class-10/class-10-statistics-grouped-mean-by-direct-method">
          <ArrowLeft /> Grouped Mean by Direct Method
        </Link>
        <Link to="/lessons/school/class-10/class-10-statistics-grouped-mean-by-step-deviation">
          Grouped Mean by Step Deviation <ArrowRight />
        </Link>
      </nav>
      <footer className="gma10103-footer">
        <div>
          <Sparkles />
          <span>
            <b>Math Universe</b>Interactive math labs, visual proofs, NCERT
            explorations, graphing, CAS-style tools, and classroom-ready
            activities.
          </span>
        </div>
        <p>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</p>
      </footer>


    </section>
  );
}
