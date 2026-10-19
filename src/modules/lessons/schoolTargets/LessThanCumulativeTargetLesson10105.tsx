import GroupedDataEditor from "../components/GroupedDataEditor";
import {
  AlertTriangle,
  Info,
  RotateCcw,
  Shuffle,
  Sparkles,
} from "lucide-react";
import { type PointerEvent, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LessThanCumulativeTargetLesson10105.css";
import MathExpression from "../../../components/ui/MathExpression";
import {Link} from "react-router-dom";

type FrequencyRow = {
  id: number;
  lower: number;
  upper: number;
  frequency: number;
};
const defaults: FrequencyRow[] = [
  { id: 1, lower: 0, upper: 10, frequency: 4 },
  { id: 2, lower: 10, upper: 20, frequency: 3 },
  { id: 3, lower: 20, upper: 30, frequency: 5 },
  { id: 4, lower: 30, upper: 40, frequency: 6 },
  { id: 5, lower: 40, upper: 50, frequency: 7 },
  { id: 6, lower: 50, upper: 60, frequency: 5 },
];

export default function LessThanCumulativeTargetLesson10105({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rows, setRows] = useState<FrequencyRow[]>(defaults);
  const [showValues, setShowValues] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [dragging, setDragging] = useState<{
    id: number;
    y: number;
    frequency: number;
  } | null>(null);
  const [editing,setEditing]=useState<number|null>(null),[draft,setDraft]=useState(''),[error,setError]=useState('');
  const [randomCycle, setRandomCycle] = useState(0);
  const [actions, setActions] = useState(0);
  let running = 0;
  const cumulative = rows.map((row) => ({
    ...row,
    previous: running,
    cumulative: (running += row.frequency),
  }));
  const total = running;
  const raw=total/6,unit=10**Math.floor(Math.log10(raw||1)),tick=([1,2,5,10].find(v=>v*unit>=raw)??10)*unit;
  const maxValue=total?tick*7:1;
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setFrequency = (id: number, value: number) =>
    setRows((current) =>
      current.map((row) =>
        row.id === id
          ? { ...row, frequency: Number.isFinite(value)?Math.max(0, Math.min(1000000, Math.round(value))):row.frequency }
          : row,
      ),
    );
  const dragFrequency = (
    event: PointerEvent<HTMLDivElement>,
    row: FrequencyRow,
  ) => {
    if (dragging?.id !== row.id) return;
    setFrequency(row.id, dragging.frequency + (dragging.y - event.clientY) / 4);
  };
  const reset = () =>
    act(() => {
      setRows(defaults);
      setShowValues(true);
      setShowPoints(true);
      setRandomCycle(0);setDragging(null);setEditing(null);setError('');
    });
  const randomize = () =>
    act(() => {
      const cycle = randomCycle + 1;
      setRows((current) =>
        current.map((row, index) => ({
          ...row,
          frequency: 2 + ((index * 5 + cycle * 3) % 8),
        })),
      );
      setRandomCycle(cycle);
    });
  const bars = cumulative.map((row, index) => {
    const x = 45 + index * 390/rows.length;
    const height = (row.cumulative / maxValue) * 180;
    return { ...row, x, y: 220 - height, height };
  });
  const point = (upper: number, cf: number) => ({
    x: 40 + ((upper-rows[0].lower)/(rows.at(-1)!.upper-rows[0].lower)) * 390,
    y: 220 - (cf / maxValue) * 180,
  });
  const ogivePoints = [
    { x: 40, y: 220 },
    ...cumulative.map((row) => point(row.upper, row.cumulative)),
  ];
  const staircase = ogivePoints
    .slice(1)
    .map((current, index) => {
      const previous = ogivePoints[index];
      return `${index === 0 ? `M${previous.x},${previous.y}` : ""} H${current.x} V${current.y}`;
    })
    .join(" ");

  return (
    <section
      className="ltc10105-page"
      data-testid="school-mockup-0779"
      data-object-model="dedicated-less-than-cumulative-ogive-engine"
      data-frequencies={rows.map((row) => row.frequency).join(",")}
      data-cumulative={cumulative.map((row) => row.cumulative).join(",")}
      data-total={total}
      data-show-values={String(showValues)}
      data-show-points={String(showPoints)}
      data-random-cycle={randomCycle}
      data-actions={actions}
    >
      <div className="ltc10105-hero">
        <div>
          <small>CLASS 10 · STATISTICS</small>
          <Link className="ltc10105-school" to="/lessons/school">← School lessons</Link>
          <h1>Less-Than Cumulative Frequency</h1>
          <p>
            Less-Than Cumulative Frequency (CF) is the running total of
            frequencies up to and including each class.
          </p>
          <p>
            Drag any frequency to change it — all later cumulative totals,
            table, and graphs update instantly.
          </p>
          <nav>
            <span>18 min</span>
            <span>INTERMEDIATE</span>
            <span>CONCEPT</span>
            <span>statistics</span>
          </nav>
        </div>
        <button onClick={reset}>
          <RotateCcw /> Reset
        </button>
      </div>

      <main>
        <section className="ltc10105-table">
          <h2>1) EDITABLE FREQUENCY TABLE</h2>
          <p>Drag a frequency, or double-click / press Enter to type (0–1,000,000).</p>
          <div className="ltc10105-table-scroll"><table>
            <thead>
              <tr>
                <th>Class Interval</th>
                <th>Upper Class Boundary (xᵢ)</th>
                <th>
                  Frequency (fᵢ)
                  <br />
                  (Drag)
                </th>
                <th>Less-Than CF (CFᵢ)</th>
                <th>Running Total (Accumulator)</th>
              </tr>
            </thead>
            <tbody>
              {cumulative.map((row, index) => (
                <tr key={row.id}>
                  <td>
                    {row.lower} – {row.upper}
                  </td>
                  <td>{row.upper}</td>
                  <td>
                    {editing===row.id?<input autoFocus aria-label={`Edit frequency row ${index+1}`} type="number" min="0" max="1000000" step="1" value={draft} onChange={e=>{setDraft(e.target.value);const v=Number(e.target.value);if(e.target.value.trim()===''||!Number.isInteger(v)||v<0||v>1000000){setError('Use a whole frequency from 0 to 1000000.');return;}setError('');act(()=>setFrequency(row.id,v));}} onBlur={()=>{setEditing(null);setError('');}} onKeyDown={e=>{e.stopPropagation();if(e.key==='Enter'||e.key==='Escape'){setEditing(null);setError('');}}}/>:<div
                      className={`ltc10105-frequency c${index%6}`}
                      role="slider"
                      tabIndex={0}
                      aria-label={`Frequency row ${index + 1}`}
                      aria-valuemin={0}
                      aria-valuemax={1000000}
                      aria-valuenow={row.frequency}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() =>
                          setDragging({
                            id: row.id,
                            y: event.clientY,
                            frequency: row.frequency,
                          }),
                        );
                      }}
                      onPointerMove={(event) => dragFrequency(event, row)}
                      onPointerUp={event=>{dragFrequency(event,row);act(()=>setDragging(null));}}
                      onPointerCancel={()=>setDragging(null)}
                      onDoubleClick={()=>{setEditing(row.id);setDraft(String(row.frequency));setError('');}}
                      onKeyDown={(event) => {
                        event.stopPropagation();
                        if(event.key==='Enter'){event.preventDefault();setEditing(row.id);setDraft(String(row.frequency));setError('');}
                        if(event.key==='Home'){event.preventDefault();act(()=>setFrequency(row.id,0));}
                        if (
                          event.key === "ArrowLeft" ||
                          event.key === "ArrowDown"
                        ) {
                          event.preventDefault();
                          act(() => setFrequency(row.id, row.frequency - 1));
                        }
                        if (
                          event.key === "ArrowRight" ||
                          event.key === "ArrowUp"
                        ) {
                          event.preventDefault();
                          act(() => setFrequency(row.id, row.frequency + 1));
                        }
                      }}
                    >
                      ↕ <b>{row.frequency}</b>
                    </div>}
                  </td>
                  <td>{row.cumulative}</td>
                  <td>
                    {index === 0
                      ? row.frequency
                      : `${row.previous} + ${row.frequency} = ${row.cumulative}`}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2}>Total (N)</td>
                <td>{total}</td>
                <td>{total}</td>
                <td />
              </tr>
            </tfoot>
          </table></div>
          {error&&<p role="alert">{error}</p>}
          <details className="ltc10105-custom"><summary>Edit grouped data</summary><GroupedDataEditor data={{bounds:[rows[0].lower,...rows.map(row=>row.upper)],frequencies:rows.map(row=>row.frequency)}} defaults={{bounds:[defaults[0].lower,...defaults.map(row=>row.upper)],frequencies:defaults.map(row=>row.frequency)}} onChange={data=>act(()=>setRows(data.frequencies.map((frequency,i)=>({id:i+1,lower:data.bounds[i],upper:data.bounds[i+1],frequency}))))}/></details>
          <footer>
            <Info /> Change any frequency — all later cumulative values update
            automatically.
          </footer>
        </section>
        <section className="ltc10105-bars">
          <div className="ltc10105-chart-heading">
            <div>
              <h2>2) LESS-THAN CUMULATIVE FREQUENCY (BAR VIEW)</h2>
              <p>Stacked by class in order of upper class boundaries.</p>
            </div>
            <label>
              Show values{" "}
              <input
                type="checkbox"
                checked={showValues}
                onChange={(event) =>
                  act(() => setShowValues(event.target.checked))
                }
              />
            </label>
          </div>
          <svg
            viewBox="0 0 440 270"
            aria-label="Cumulative frequency bar chart"
          >
            <g className="ltc10105-ticks">{Array.from({length:8},(_,i)=>{const v=i*maxValue/7,y=220-i/7*180;return <g key={i}><line x1="36" y1={y} x2="40" y2={y}/><text x="31" y={y+4} textAnchor="end">{v>=10000?`${Number((v/1000).toPrecision(3))}k`:Number(v.toPrecision(3))}</text></g>;})}</g>
            <text x="40" y="22">Less-Than CF (CFᵢ)</text>
            <text x="235" y="264" textAnchor="middle">Upper class boundary (xᵢ)</text>
            <line x1="40" y1="220" x2="425" y2="220" />
            <line x1="40" y1="35" x2="40" y2="220" />
            {bars.map((bar, index) => (
              <g key={bar.id} className={`c${index%6}`} data-bar-id={bar.id} data-cumulative={bar.cumulative}>
                <rect x={bar.x} y={bar.y} width={Math.max(1,390/rows.length-8)} height={bar.height} />
                {showValues && (
                  <text className="ltc10105-value" textAnchor="middle" x={bar.x + (390/rows.length-8)/2} y={bar.y - 6}>
                    {bar.cumulative}
                  </text>
                )}
                <text textAnchor="middle" x={bar.x + (390/rows.length-8)/2} y="242">
                  {bar.upper}
                </text>
              </g>
            ))}
          </svg>
          <footer>
            <b>RECURRENCE (RUNNING TOTAL RULE)</b>
            <strong><MathExpression value={String.raw`CF_i=CF_{i-1}+f_i`}/></strong>
            <span>with CF₀ = 0</span>
          </footer>
        </section>
        <section className="ltc10105-ogive">
          <div className="ltc10105-chart-heading">
            <div>
              <h2>3) LESS-THAN OGIVE (STAIRCASE)</h2>
              <p>Monotone staircase using upper class boundaries.</p>
            </div>
            <label>
              <input
                type="checkbox"
                checked={showPoints}
                onChange={(event) =>
                  act(() => setShowPoints(event.target.checked))
                }
              />{" "}
              Show points
            </label>
          </div>
          <svg
            viewBox="0 0 460 270"
            aria-label="Less-than cumulative frequency ogive"
          >
            <g className="grid">
              {[rows[0].lower,...rows.map(row=>row.upper)].map((tick) => (
                <line
                  key={`v${tick}`}
                  x1={40 + ((tick-rows[0].lower)/(rows.at(-1)!.upper-rows[0].lower)) * 390}
                  y1="35"
                  x2={40 + ((tick-rows[0].lower)/(rows.at(-1)!.upper-rows[0].lower)) * 390}
                  y2="220"
                />
              ))}
              {Array.from({ length: 8 }, (_, index) => (
                <line
                  key={`h${index}`}
                  x1="40"
                  y1={220 - (index / 7) * 180}
                  x2="430"
                  y2={220 - (index / 7) * 180}
                />
              ))}
            </g>
            <g className="ltc10105-ticks">{Array.from({length:8},(_,i)=>{const v=i*maxValue/7,y=220-i/7*180;return <g key={i}><line x1="36" y1={y} x2="40" y2={y}/><text x="31" y={y+4} textAnchor="end">{v>=10000?`${Number((v/1000).toPrecision(3))}k`:Number(v.toPrecision(3))}</text></g>;})}</g>
            <text x="40" y="22">Less-Than CF (CFᵢ)</text>
            <text x="235" y="264" textAnchor="middle">Upper class boundary (xᵢ)</text>
            <line x1="40" y1="220" x2="440" y2="220"/><line x1="40" y1="35" x2="40" y2="220"/>
            {[rows[0].lower,...rows.map(row=>row.upper)].map(x=><text key={x} textAnchor="middle" x={point(x,0).x} y="242">{x}</text>)}
            <path d={staircase} />
            {showPoints &&
              ogivePoints.map((item, index) => (
                <g key={index} data-ogive-point={index}>
                  <circle cx={item.x} cy={item.y} r="4" />
                  <text x={item.x - 7} y={item.y - 8}>
                    {index === 0 ? 0 : cumulative[index - 1].cumulative}
                  </text>
                </g>
              ))}
          </svg>
          <footer>
            <p>
              Start at ({rows[0].lower}, 0), then step up at each (xᵢ, CFᵢ) in order of upper class
              boundaries.
            </p>
            <p>
              This is the <b>less-than ogive</b> (cumulative frequency curve).
            </p>
          </footer>
        </section>
      </main>
      <aside className="ltc10105-warning">
        <AlertTriangle />
        <div>
          <strong>
            IMPORTANT: Do NOT plot less-than cumulative frequencies against
            lower class boundaries.
          </strong>
          <p>
            Use the upper class boundaries (xᵢ) on the x-axis for less-than
            ogive.
          </p>
        </div>
      </aside>
      <section className="ltc10105-try">
        <h2>Try it:</h2>
        <p>
          <b>1</b> Drag any frequency value in the table.
          <span>Example: change 5 → 8</span>
        </p>
        <p>
          <b>2</b> See the running totals update from that row forward.
        </p>
        <p>
          <b>3</b> Watch the bars and ogive update instantly.
        </p>
        <p>
          <b>4</b> Observe the recurrence CFᵢ=CFᵢ₋₁+fᵢ.
        </p>
        <button onClick={randomize}>
          <Shuffle /> Randomize Frequencies
        </button>
      </section>
      <footer className="ltc10105-footer">
        <div>
          <Sparkles />
          <span>
            <b>Math Universe</b>Interactive math labs, visual proofs, NCERT
            explorations, graphing, CAS-style tools, and classroom-ready
            activities.
          </span>
        </div>
        <small>
          © 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.
        </small>
      </footer>


    </section>
  );
}
