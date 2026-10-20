import {
  AlertTriangle,
  Calculator,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./GroupedMeanDirectTargetLesson10102.css";
import{groupedMeanStepModel}from "./groupedMeanStepModel";
import{moveGroupedMidpoint}from "./groupedMeanDirectModel";
import MathExpression from "../../../components/ui/MathExpression";
import{Link}from "react-router-dom";

type GroupRow = { id: number; lower: number; upper: number; frequency: number };
const initialRows: GroupRow[] = [
  { id: 1, lower: 0, upper: 10, frequency: 4 },
  { id: 2, lower: 10, upper: 20, frequency: 6 },
  { id: 3, lower: 20, upper: 30, frequency: 10 },
  { id: 4, lower: 30, upper: 40, frequency: 12 },
  { id: 5, lower: 40, upper: 50, frequency: 8 },
];
const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;

export default function GroupedMeanDirectTargetLesson10102({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rows, setRows] = useState<GroupRow[]>(initialRows);
  const [selected, setSelected] = useState(4);
  const [dragging, setDragging] = useState<number | null>(null);
  const [calculated, setCalculated] = useState(true);
  const [actions, setActions] = useState(0);
  const visualRef = useRef<SVGSVGElement>(null);
  const {enriched,totalFrequency,mean}=groupedMeanStepModel(rows,0,1);
  const totalProduct=enriched.reduce((s,r)=>s+r.product,0),meanText=mean===null?'—':mean.toFixed(2);
  const [draftKey,setDraftKey]=useState<string|null>(null),[draft,setDraft]=useState(''),[error,setError]=useState(''),[calculationMessage,setCalculationMessage]=useState('');
  const frame=useRef<{min:number;max:number}|null>(null);
  const minX=frame.current?.min??rows[0].lower,maxX=frame.current?.max??rows.at(-1)!.upper;
  const sx=(x:number)=>115+(x-minX)/(maxX-minX)*220;
  const midpointAverage = enriched.length ? enriched.reduce((sum,row)=>sum+row.midpoint,0)/enriched.length : 0;
  const applyScenario=(scenario:'original'|'equal'|'high')=>act(()=>{
    setRows(initialRows.map((row,index)=>({...row,frequency:scenario==='equal'?8:scenario==='high'?[1,2,3,6,18][index]:row.frequency})));
    setSelected(4);setCalculated(true);setDraftKey(null);setError('');setCalculationMessage('');
  });
  const selectedRow =
    enriched.find((row) => row.id === selected) ?? enriched[0];
  const maxProduct = Math.max(1, ...enriched.map((row) => Math.abs(row.product)));

  const signedBars=enriched.some(row=>row.product<0),barBase=signedBars?520:455,barSpan=signedBars?65:130;
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const updateRow = (id: number, patch: Partial<GroupRow>) => {
    setRows((current) =>
      current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
    setCalculated(false);setCalculationMessage('');
  };
  const edit=(key:string,text:string,apply:(v:number)=>void,okay:(v:number)=>boolean)=>{setDraftKey(key);setDraft(text);const v=text.trim()===''?NaN:Number(text);if(!Number.isFinite(v)||!okay(v)){setError('Use finite ordered boundaries and whole nonnegative frequencies.');return;}setError('');act(()=>apply(v));};
  const inputValue=(key:string,v:number)=>draftKey===key?draft:v,blur=()=>{setDraftKey(null);setError('');};
  const setMidpoint=(id:number,value:number)=>{setRows(current=>moveGroupedMidpoint(current,id,round(value,3)));setCalculated(false);setCalculationMessage('');};
  const updateMarker=(event:PointerEvent<SVGSVGElement>)=>{if(dragging===null||!visualRef.current)return;const m=visualRef.current.getScreenCTM();if(!m)return;const pt=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());setMidpoint(dragging,minX+Math.max(0,Math.min(1,(pt.x-115)/220))*(maxX-minX));};

  const addRow = () =>
    act(() => {
      const upper = Math.max(...rows.map((row) => row.upper));
      const id = Math.max(...rows.map((row) => row.id)) + 1;
      setRows((current) => [
        ...current,
        { id, lower: upper, upper: upper + (rows.at(-1)!.upper-rows.at(-1)!.lower), frequency: 1 },
      ]);
      setSelected(id);
      setCalculated(false);setCalculationMessage('');
    });
  const removeRow = (id: number) =>
    act(() => {
      if (rows.length <= 1) return;
      const remaining = rows.filter((row) => row.id !== id);
      setRows(remaining);
      if (selected === id) setSelected(remaining[0].id);
      setCalculated(false);setCalculationMessage('');
    });
  const reset = () =>
    act(() => {
      setRows(initialRows);
      setSelected(4);
      setCalculated(true);setDragging(null);frame.current=null;setDraftKey(null);setError('');setCalculationMessage('');
    });

  return (
    <section
      className="gmd10102-page"
      data-testid="school-mockup-0776"
      data-object-model="dedicated-grouped-frequency-direct-mean-engine"
      data-row-count={rows.length}
      data-selected-row={selected}
      data-total-frequency={round(totalFrequency)}
      data-total-product={totalProduct}
      data-mean={mean===null?"none":mean}
      data-calculated={String(calculated)}
      data-actions={actions}
    >
      <div className="gmd10102-hero">
        <div>
          <small>CLASS 10 · STATISTICS</small>
          <Link className="gmd10102-school" to="/lessons/school">← School lessons</Link>
          <h1>Grouped Mean by Direct Method</h1>
          <p>
            Use the Direct Method to find the mean of grouped data. Compute
            midpoints xᵢ, multiply by frequencies fᵢ, sum the products and
            divide by total frequency.
          </p>
          <nav>
            <span>16 min</span>
            <span>INTERMEDIATE</span>
            <span>CONCEPT</span>
            <span>statistics</span>
          </nav>
        </div>
        <button onClick={reset}>
          <RotateCcw /> Reset workbench
        </button>
      </div>

      <main>
        <section className="gmd10102-left">
          <div className="gmd10102-table">
            <table>
              <thead>
                <tr>
                  <th>S. No.</th>
                  <th>
                    Class Interval
                    <br />
                    (Lower – Upper)
                  </th>
                  <th>
                    Frequency
                    <br />
                    fᵢ
                  </th>
                  <th>
                    Midpoint
                    <br />
                    xᵢ = (L+U)/2
                  </th>
                  <th>
                    Product
                    <br />
                    fᵢ · xᵢ
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {enriched.map((row, index) => (
                  <tr
                    key={row.id}
                    data-table-row={row.id} data-midpoint={row.midpoint} data-product={row.product}
                    className={selected === row.id ? "selected" : ""}
                    onClick={() => act(() => setSelected(row.id))}
                  >
                    <td>{index + 1}</td>
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
                      <b>–</b>
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
                    <td>
                      <strong>{round(row.midpoint)}</strong>
                      {selected === row.id && (
                        <small>
                          = ({row.lower} + {row.upper}) / 2
                        </small>
                      )}
                    </td>
                    <td>
                      <strong>{round(row.product)}</strong>
                    </td>
                    <td>
                      <button
                        aria-label={`Remove row ${index + 1}`}
                        disabled={rows.length<=1}
                        onClick={(event) => {
                          event.stopPropagation();
                          removeRow(row.id);
                        }}
                      >
                        <Trash2 />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>
                    <button onClick={addRow} disabled={rows.length>=12}>
                      <Plus /> Add Row
                    </button>
                  </td>
                  <td>
                    <span>Σfᵢ</span>
                    <strong>{round(totalFrequency)}</strong>
                  </td>
                  <td>Totals</td>
                  <td>
                    <span>Σfᵢxᵢ</span>
                    <strong>{round(totalProduct).toLocaleString()}</strong>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          {error&&<p role="alert">{error}</p>}
          <section className="gmd10102-formula">
            <article>
              <b>Direct Method Formula</b>
              <p><MathExpression value={String.raw`\bar{x}=\frac{\sum_{i} f_i x_i}{\sum_{i} f_i}`}/></p>
            </article>
            <i>→</i>
            <article>
              <b>Substitute</b>
              <p>{mean===null?'No observations':<MathExpression value={String.raw`\bar{x}=\frac{${round(totalProduct,4)}}{${totalFrequency}}`}/>}</p>
            </article>
            <i>→</i>
            <strong>x̄ = {meanText}</strong>
          </section>
          <button
            className="gmd10102-calculate"
            onClick={() => act(() => {setCalculated(true);setCalculationMessage(mean===null?'No observations: the mean is undefined.':`Calculated mean: ${meanText}`);})}
          >
            <Calculator /> Calculate Mean
          </button>
          <p className="gmd10102-confirmation" role="status">{calculationMessage}</p>
        </section>
        <section className="gmd10102-right">
          <div className="gmd10102-heading">
            <h2>
              <span>Visual:</span> Frequency-weighted accumulation of fᵢ · xᵢ
            </h2>
            <p>
              Midpoints xᵢ are centred on each class interval. Bar length = fᵢ ·
              xᵢ
            </p>
          </div>
          <svg
            ref={visualRef}
            style={{maxHeight:rows.length>6?'none':'355px'}}
            viewBox={`0 0 640 ${100 + enriched.length * 44}`}
            aria-label="Frequency weighted midpoint visualization"
            onPointerMove={(event) => dragging !== null && updateMarker(event)}
            onPointerUp={event=>{if(dragging!==null)updateMarker(event);frame.current=null;act(()=>setDragging(null));}}
            onPointerCancel={()=>{frame.current=null;setDragging(null);}}
          >
            <text x="25" y="24">
              Class Interval (L – U)
            </text>
            <text x="165" y="24">
              Midpoint xᵢ
            </text>
            <text x="390" y="24">
              Frequency fᵢ
            </text>
            <text x="555" y="24">
              fᵢ · xᵢ
            </text>
            {Array.from({length:6},(_,i)=>minX+i/5*(maxX-minX)).map((tick) => (
              <g key={tick}>
                <text x={sx(tick)} textAnchor="middle" y="45">
                  {round(tick)}
                </text>
                <line
                  x1={sx(tick)}
                  y1="50"
                  x2={sx(tick)}
                  y2="58"
                />
              </g>
            ))}
            {signedBars&&<line className="gmd10102-product-zero" x1={barBase} x2={barBase} y1="65" y2={90+44*(rows.length-1)}/>}
            {enriched.map((row, index) => {
              const y = 80 + index * 44;
              const dotX =
                sx(row.midpoint);
              const barWidth = Math.abs(row.product) / maxProduct * barSpan;
              return (
                <g
                  key={row.id}
                  data-visual-row={row.id}
                  className={selected === row.id ? "selected" : ""}
                  onClick={() => act(() => setSelected(row.id))}
                >
                  <line x1="115" y1={y} x2="335" y2={y} />
                  <line
                    x1={sx(row.lower)}
                    y1={y - 6}
                    x2={sx(row.lower)}
                    y2={y + 6}
                  />
                  <line
                    x1={sx(row.upper)}
                    y1={y - 6}
                    x2={sx(row.upper)}
                    y2={y + 6}
                  />
                  <text x="25" y={y + 5}>
                    {row.lower} – {row.upper}
                  </text>
                  <circle
                    className="gmd10102-marker"
                    cx={dotX}
                    cy={y}
                    r="7"
                    role="slider"
                    tabIndex={0}
                    aria-label={`Midpoint row ${index + 1}`}
                    aria-valuemin={minX}
                    aria-valuemax={maxX}
                    aria-valuenow={row.midpoint}
                    onPointerDown={(event) => {
                      event.currentTarget.setPointerCapture(event.pointerId);
                      frame.current={min:minX,max:maxX};act(() => {setSelected(row.id);setDragging(row.id);});
                    }}
                    onKeyDown={(event) => {
                      event.stopPropagation();
                      if (event.key === "ArrowLeft") {
                        event.preventDefault();
                        act(() => setMidpoint(row.id, row.midpoint - 1));
                      }
                      if (event.key === "ArrowRight") {
                        event.preventDefault();
                        act(() => setMidpoint(row.id, row.midpoint + 1));
                      }
                    }}
                  />
                  <text x="405" y={y + 5}>
                    {row.frequency}
                  </text>
                  <rect data-product-bar={row.id} x={row.product<0?barBase-barWidth:barBase} y={y - 9} width={barWidth} height="18" />
                  {Array.from({length:Math.max(0,Math.ceil(barWidth/15)-1)},(_,i)=><line className="gmd10102-bar-segment" key={i} x1={(row.product<0?barBase-barWidth:barBase)+(i+1)*15} x2={(row.product<0?barBase-barWidth:barBase)+(i+1)*15} y1={y-9} y2={y+9}/>)}
                  <text x="600" y={y + 5}>
                    {round(row.product)}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="gmd10102-drag-help">Drag a midpoint to shift its interval; adjoining boundaries move with it.</p>
          <footer>
            <span>
              Total frequency Σfᵢ = <b>{round(totalFrequency)}</b>
            </span>
            <span>
              Total Σfᵢxᵢ = <b>{round(totalProduct).toLocaleString()}</b>
            </span>
          </footer>
          <aside>
            <AlertTriangle />
            <div>
              <strong>
                Common mistake: Do NOT take the average of midpoints.
              </strong>
              <p>
                The mean depends on frequencies. Use the frequency-weighted mean; equal weights are the special case where midpoint averaging agrees.
              </p>
            </div>
          </aside>
        </section>
      </main>
      <footer className="gmd10102-tip">
        ⓘ Edit any frequency or interval to see all values update live.{" "}
        {selectedRow && `Selected midpoint: ${selectedRow.midpoint}.`}
      </footer>
      <details className="gmd10102-extra"><summary>Investigate frequency weighting</summary>      <section className="gmd10102-scenarios" aria-label="Frequency weighting scenarios">
        <h2>Investigate frequency weighting</h2>
        <p>Predict how the mean moves when higher classes become more frequent. Compare with equal frequencies.</p>
        <div><button onClick={()=>applyScenario('original')}>Original dataset</button><button onClick={()=>applyScenario('equal')}>Equal frequencies</button><button onClick={()=>applyScenario('high')}>Higher values more frequent</button></div>
        <p data-testid="grouped-mean-comparison">{totalFrequency>0?`Weighted mean: ${mean===null?'—':round(mean)} · Unweighted midpoint average: ${round(midpointAverage)} · Difference: ${mean===null?'—':round(mean-midpointAverage)}`:'A positive total frequency is needed to calculate the weighted mean.'}</p>
      </section></details>

    </section>
  );
}
