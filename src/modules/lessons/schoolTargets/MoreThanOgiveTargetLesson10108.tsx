import GroupedDataEditor from "../components/GroupedDataEditor";
import { Eye, Grip, Lightbulb, RotateCcw, MousePointer2, Type, Trash2, Maximize, ZoomIn } from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MoreThanOgiveTargetLesson10108.css";
import{moreThanModel,moreThanYMax,moveMorePoint}from "./moreThanOgiveModel";

type Row = { id: number; boundary: number; frequency: number };
const defaults: Row[] = [
  { id: 1, boundary: 0, frequency: 4 },
  { id: 2, boundary: 10, frequency: 6 },
  { id: 3, boundary: 20, frequency: 8 },
  { id: 4, boundary: 30, frequency: 7 },
  { id: 5, boundary: 40, frequency: 5 },
];
const round = (value: number) => Number(value.toFixed(1));

export default function MoreThanOgiveTargetLesson10108({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [upperBoundary,setUpperBoundary] = useState(50);
  const [rows, setRows] = useState(defaults);
  const [guide, setGuide] = useState(true);
  const [mode, setMode] = useState<"table" | "graph">("graph");
  const [dragging, setDragging] = useState<number | null>(null);
  const [draftKey,setDraftKey]=useState<string|null>(null),[draft,setDraft]=useState(''),[editError,setEditError]=useState('');
  const [chartTool,setChartTool]=useState<'select'|'text'>('select'),[note,setNote]=useState(''),[expanded,setExpanded]=useState(false),[zoomed,setZoomed]=useState(false);
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const facts=moreThanModel(rows,upperBoundary);
  const {total,half,points,valid}=facts;
  const exactMedian=facts.median,median=exactMedian===null?'—':round(exactMedian);
  const maxBoundary = upperBoundary+(upperBoundary-rows[rows.length-1].boundary);
  const minBoundary=rows[0].boundary;
  const sx = (x: number) => 55 + ((x-minBoundary) / (maxBoundary-minBoundary)) * 560;
  const sy = (cf: number) => 275 - (cf / moreThanYMax(total)) * 220;
  const path = points
    .map(
      (point, index) =>
        `${index ? "L" : "M"}${sx(point.boundary)},${sy(point.cf)}`,
    )
    .join(" ");
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const editField=(field:'boundary'|'frequency',id:number,text:string)=>{setDraftKey(`${field}-${id}`);setDraft(text);const value=text.trim()===''?NaN:Number(text),index=rows.findIndex(row=>row.id===id);const ok=Number.isFinite(value)&&(field==='frequency'?Number.isInteger(value)&&value>=0&&value<=1000000:value>(rows[index-1]?.boundary??-Infinity)&&value<(rows[index+1]?.boundary??upperBoundary));if(!ok){setEditError(field==='frequency'?'Enter a whole frequency from 0 to 1,000,000.':'Boundaries must stay strictly increasing.');return;}setEditError('');act(()=>setRows(current=>current.map(row=>row.id===id?{...row,[field]:value}:row)));};
  const dragPoint = (
    event: PointerEvent<SVGCircleElement>,
    pointId: number,
  ) => {
    if (dragging !== pointId || pointId > rows.length || !svgRef.current)
      return;
    const matrix=svgRef.current.getScreenCTM();if(!matrix)return;
    const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
    const desired=(275-point.y)/220*moreThanYMax(total),index=points.findIndex(p=>p.id===pointId);
    act(()=>setRows(current=>moveMorePoint(current,index,desired)));
  };
  const reset = () =>
    act(() => {
      setDraftKey(null);setEditError('');setChartTool('select');setNote('');setExpanded(false);setZoomed(false);
      setRows(defaults);
      setUpperBoundary(50);
      setGuide(true);
      setMode("graph");
      setDragging(null);
    });

  return (
    <section
      className="mto10108-page"
      data-testid="school-mockup-0782"
      data-object-model="dedicated-more-than-ogive-descending-median-engine"
      data-frequencies={rows.map((row) => row.frequency).join(",")}
      data-more-than={points.map((point) => point.cf).join(",")}
      data-total={total}
      data-half={half}
      data-median={median}
      data-axis-max={maxBoundary} data-exact-median={exactMedian??"none"} data-valid={String(valid)} data-y-max={moreThanYMax(total)} data-median-range={facts.medianRange?.join(",")??"none"}
      data-guide={String(guide)}
      data-mode={mode}
      data-chart-tool={chartTool} data-expanded={String(expanded)} data-zoomed={String(zoomed)} data-note={note}
      data-actions={actions}
    >
      <div className="mto10108-hero">
        <small>CLASS 10 · STATISTICS</small>
        <h1>More-Than Ogive</h1>
        <p>
          More-Than Ogive is a school mathematical idea in Statistics. It helps
          students model data, functions, curves, proofs, and 3D directions. We
          use related ideas in graphs, design, surveys, navigation, and
          measurement.
        </p>
        <nav>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>statistics</span>
        </nav>
      </div>

      <main className="mto10108-lab">
        <div className="mto10108-lab-heading">
          <div>
            <small>☷ INTERACTIVE LAB</small>
            <h2>Data &amp; More-Than Ogive Lab</h2>
            <p>
              Edit the table or drag the plotted points. The ogive updates live.
              Read the median from the curve.
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset lab
          </button>
        </div>
        <div className="mto10108-workspace">
          <section className="mto10108-table">
            {editError&&<p role="alert">{editError} The graph retains the last valid values.</p>}
            <h3>
              DATA TABLE <span>(More-Than Cumulative Frequencies)</span>
            </h3>
            <table>
              <thead>
                <tr>
                  <th>Lower class boundary (x)</th>
                  <th>Frequency (f)</th>
                  <th>More-than c.f. (Nₓ)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        aria-label={`Lower boundary row ${row.id}`}
                        type="number"
                        value={draftKey===`boundary-${row.id}`?draft:row.boundary}
                        onFocus={()=>{setDraftKey(`boundary-${row.id}`);setDraft(String(row.boundary));}} onBlur={()=>setDraftKey(null)}
                        onChange={e=>editField('boundary',row.id,e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Frequency row ${row.id}`}
                        type="number"
                        min="0"
                        max="1000000"
                        value={draftKey===`frequency-${row.id}`?draft:row.frequency}
                        onFocus={()=>{setDraftKey(`frequency-${row.id}`);setDraft(String(row.frequency));}} onBlur={()=>setDraftKey(null)}
                        onChange={e=>editField('frequency',row.id,e.target.value)}
                      />
                    </td>
                    <td>
                      <b>{points[index].cf}</b>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr data-terminal-boundary="true"><td>{upperBoundary}</td><td>—</td><td>0</td></tr>
                <tr>
                  <td>Total (N)</td>
                  <td>{total}</td>
                  <td>N = {total}</td>
                </tr>
              </tfoot>
            </table>
            <aside>
              <Lightbulb />
              <div>
                <b>Why does the curve start at N?</b>
                <p>
                  At the smallest lower class boundary ({minBoundary}), all observations are
                  “more than or equal to {minBoundary}”. Hence the curve starts at total N.
                </p>
              </div>
            </aside>
            <details className="mto10108-custom"><summary>Edit class boundaries and data</summary><GroupedDataEditor data={{bounds:[...rows.map(row=>row.boundary),upperBoundary],frequencies:rows.map(row=>row.frequency)}} defaults={{bounds:[0,10,20,30,40,50],frequencies:defaults.map(row=>row.frequency)}} onChange={data=>act(()=>{setUpperBoundary(data.bounds.at(-1)!);setRows(data.frequencies.map((frequency,i)=>({id:i+1,boundary:data.bounds[i],frequency})));})}/></details>
          </section>
          <section className={`mto10108-chart ${expanded?'mto10108-expanded':''}`} onKeyDown={e=>{if(e.key==='Escape')setExpanded(false);}}>
            <div className="mto10108-chart-heading">
              <h3>
                MORE-THAN OGIVE <span>(Drag points or edit table)</span>
              </h3>
              <button
                aria-pressed={mode === "table"}
                onClick={() =>
                  act(() => setMode(mode === "graph" ? "table" : "graph"))
                }
              >
                {mode === "graph" ? "Focus table" : "Focus graph"} ⇄
              </button>
              <button aria-pressed={guide} onClick={() => act(() => setGuide(!guide))}>
                <Eye /> Guide
              </button>
            </div>
            {chartTool==='text'&&<label className="mto10108-note">Chart note <input aria-label="Chart note" maxLength={80} value={note} onChange={e=>setNote(e.target.value)}/></label>}
            <div className="mto10108-plot">
              <div className="mto10108-chart-scroll">
              <svg
                ref={svgRef}
                viewBox="0 0 650 330"
                aria-label="Interactive more-than ogive"
                style={zoomed?{width:'max(100%,900px)',height:460}:undefined}
              >
                <text x="330" y="325" textAnchor="middle">Lower class boundary (x)</text><text transform="translate(16 160) rotate(-90)" textAnchor="middle">More-than cumulative frequency</text>
                {note&&<text className="mto10108-annotation" x="70" y="25">{note}</text>}
                <g className="grid">
                  {Array.from({length:8},(_,i)=>Number((i*moreThanYMax(total)/7).toFixed(2))).map((value) => (
                    <g key={value}><text x="44" y={sy(value)+4} textAnchor="end">{value>=1000?`${Number((value/1000).toPrecision(3))}k`:value}</text><line
                      x1="55"
                      y1={sy(value)}
                      x2="625"
                      y2={sy(value)}
                    /></g>
                  ))}
                {points.map(point=><line key={`xgrid-${point.id}`} x1={sx(point.boundary)} x2={sx(point.boundary)} y1="45" y2="275"/>)}<line x1={sx(maxBoundary)} x2={sx(maxBoundary)} y1="45" y2="275"/>
                </g>
                <line x1="55" y1="275" x2="630" y2="275" />
                <line x1="55" y1="280" x2="55" y2="45" />
                <text x={sx(maxBoundary)-5} y="300">{maxBoundary}</text>
                <path d={path} />
                {guide && valid && (
                  <g className="guide">
                    <line x1="55" y1={sy(half)} x2={sx(exactMedian??minBoundary)} y2={sy(half)} />
                    <line
                      x1={sx(exactMedian??minBoundary)}
                      y1={sy(half)}
                      x2={sx(exactMedian??minBoundary)}
                      y2="275"
                    />
                    <circle cx={sx(exactMedian!)} cy={sy(half)} r="6"/>
                    <text x="70" y={sy(half) - 8}>
                      N/2 = {half}
                    </text>
                  </g>
                )}
                {points.map((point) => (
                  <g key={point.id}>
                    <circle
                      data-point-id={point.id} data-cf={point.cf} data-boundary={point.boundary}
                      role="slider"
                      tabIndex={0}
                      aria-label={`More-than point ${point.id}`}
                      aria-valuemin={0}
                      aria-valuemax={total}
                      aria-valuenow={point.cf}
                      cx={sx(point.boundary)}
                      cy={sy(point.cf)}
                      r="6"
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() => setDragging(point.id));
                      }}
                      onPointerMove={(event) => dragPoint(event, point.id)}
                      onPointerUp={() =>
                        dragging && act(() => setDragging(null))
                      }
                      onPointerCancel={()=>setDragging(null)}
                      onKeyDown={event=>{if(event.key==='ArrowUp'||event.key==='ArrowDown'){event.preventDefault();const index=points.findIndex(p=>p.id===point.id);act(()=>setRows(current=>moveMorePoint(current,index,point.cf+(event.key==='ArrowUp'?1:-1))));}}}
                    />
                    <text x={sx(point.boundary) - 5} y="300">
                      {point.boundary}
                    </text>
                  </g>
                ))}
              </svg>
              </div>
              <aside>
                <p><i className="mto10108-legend-curve"/> More-Than Ogive</p>
                <p><i className="mto10108-legend-half"/> Horizontal N/2</p><p><i className="mto10108-legend-median"/> Median read-off</p>
                <b>
                  N = {total}
                  <br />
                  N/2 = {half}
                </b>
                <strong>
                  <span className="mto10108-median-label">Median (M)</span>
                  <span className="mto10108-median-value">{valid?`≈ ${median}`:"No median"}</span>
                </strong>
              </aside>
            </div>
            <footer>
              <Grip /> Drag points on the curve or edit the table to see the
              ogive update in real time.
              <div className="mto10108-tools"><button aria-label="Select and drag points" aria-pressed={chartTool==='select'} onClick={()=>setChartTool('select')}><MousePointer2/></button><button aria-label="Add chart annotation" aria-pressed={chartTool==='text'} onClick={()=>setChartTool(t=>t==='text'?'select':'text')}><Type/></button><button aria-label="Clear frequencies" onClick={()=>act(()=>{setDraftKey(null);setEditError('');setRows(current=>current.map(row=>({...row,frequency:0})));})}><Trash2/></button><button aria-label="Expand chart" aria-pressed={expanded} onClick={()=>setExpanded(v=>!v)}><Maximize/></button><button aria-label="Zoom chart" aria-pressed={zoomed} onClick={()=>setZoomed(v=>!v)}><ZoomIn/></button></div>
            </footer>
          </section>
        </div>
        <section className="mto10108-explain">
          <h3>How the median is read:</h3>
          <p>
            For a more-than ogive, the median is read at the value of x where
            the ogive cuts the horizontal line at N/2.
          </p>
          <p>
            {valid?`Here, the curve cuts N/2 = ${half} at x ≈ ${median}. The grouped median estimate uses piecewise-linear interpolation.`:"With no observations (N = 0), the median is undefined."}
            {facts.medianRange&&facts.medianRange[1]>facts.medianRange[0]&&` A zero-frequency gap gives a median interval [${facts.medianRange.join(", ")}]; the displayed convention uses its lower endpoint.`}
          </p>
        </section>
      </main>


    </section>
  );
}
