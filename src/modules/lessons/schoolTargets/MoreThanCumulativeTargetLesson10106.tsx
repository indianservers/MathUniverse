import GroupedDataEditor from "../components/GroupedDataEditor";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { type PointerEvent, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MoreThanCumulativeTargetLesson10106.css";
import { Link } from "react-router-dom";
import MathExpression from "../../../components/ui/MathExpression";

const defaultFrequencies = [6, 9, 12, 8, 5];
const defaultBoundaries = [9.5, 19.5, 29.5, 39.5, 49.5];

export default function MoreThanCumulativeTargetLesson10106({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [bounds,setBounds] = useState([...defaultBoundaries,59.5]);
  const boundaries=bounds.slice(1);
  const [editing,setEditing]=useState<number|null>(null),[draft,setDraft]=useState(''),[error,setError]=useState('');
  const [frequencies, setFrequencies] = useState(defaultFrequencies);
  const [drag, setDrag] = useState<{
    index: number;
    y: number;
    value: number;
  } | null>(null);
  const [actions, setActions] = useState(0);
  const total = frequencies.reduce((sum, value) => sum + value, 0);
  let remaining = total;
  const rows = frequencies.map((frequency, index) => {
    const current = remaining;
    remaining -= frequency;
    return { frequency, current, next: remaining, boundary: boundaries[index] };
  });
  const moreThan = [total, ...rows.map((row) => row.next)];
  const lessThan = [0];
  frequencies.forEach((frequency) =>
    lessThan.push(lessThan[lessThan.length - 1] + frequency),
  );
  const setFrequency = (index: number, value: number) => {
    setFrequencies((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? Number.isFinite(value)?Math.max(0, Math.min(1000000, Math.round(value))):item
          : item,
      ),
    );
  };
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const dragFrequency = (
    event: PointerEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (drag?.index !== index) return;
    setFrequency(index, drag.value + (drag.y - event.clientY) / 5);
  };
  const reset = () =>
    act(() => {
      setFrequencies(defaultFrequencies);
      setBounds([...defaultBoundaries,59.5]);
      setDrag(null);setEditing(null);setError('');
    });
  const chartX = (index: number) => 40 + (bounds[index]-bounds[0])/(bounds.at(-1)!-bounds[0])*385;
  const yMax=total?Math.ceil(total/4/10**Math.floor(Math.log10(total/4)))*10**Math.floor(Math.log10(total/4))*4:1;
  const chartY = (value: number) => 230 - (value / yMax) * 180;
  const staircase = moreThan
    .slice(0, -1)
    .map((value, index) => {
      const x = chartX(index);
      const nextX = chartX(index + 1);
      const y = chartY(value);
      const nextY = chartY(moreThan[index + 1]);
      return `${index === 0 ? `M${x},${y}` : ""} H${nextX} V${nextY}`;
    })
    .join(" ");

  return (
    <section
      className="mtc10106-page"
      data-testid="school-mockup-0780"
      data-object-model="dedicated-more-than-descending-subtraction-engine"
      data-frequencies={frequencies.join(",")}
      data-more-than={moreThan.join(",")}
      data-less-than={lessThan.join(",")}
      data-total={total}
      data-actions={actions}
    >
      <div className="mtc10106-hero">
        <small>CLASS 10 · STATISTICS</small>
        <Link className="mtc10106-school" to="/lessons/school"><ArrowLeft/> School lessons</Link>
        <h1>More-Than Cumulative Frequency</h1>
        <p>
          More-than cumulative frequency (CF<sub>more</sub>) at a boundary shows
          how many observations are greater than or equal to that boundary.
        </p>
        <p>
          Start at total <i>N</i>, subtract each class frequency, and move
          downward.
        </p>
        <button onClick={reset}>
          <RotateCcw /> Reset table
        </button>
      </div>


      <main className="mtc10106-workspace">
        <section className="mtc10106-table-card">
          <h2>Editable grouped table (class boundaries)</h2>
          <p className="mtc10106-total">
            Total observations (<i>N</i>) <strong>{total}</strong>
          </p>
          <div className="mtc10106-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Step</th>
                  <th>Boundary reached (Lᵢ₊₁)</th>
                  <th>Class interval</th>
                  <th>
                    Frequency (fᵢ)<small>Drag · double-click to type</small>
                  </th>
                  <th>Remove blocks</th>
                  <th>
                    Cumulative more-than CF<sub>more</sub> (≥ boundary)
                  </th>
                  <th>Computation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>0</b>
                    <br />
                    (Start)
                  </td>
                  <td>{bounds[0]}</td>
                  <td>–</td>
                  <td>–</td>
                  <td>–</td>
                  <td>
                    <strong>{total}</strong>
                    <small>= N</small>
                  </td>
                  <td>
                    Start at <i>N</i> = {total}
                  </td>
                </tr>
                {rows.map((row, index) => (
                  <tr key={row.boundary}>
                    <td>{index + 1}</td>
                    <td>{row.boundary}</td>
                    <td>
                      {bounds[index]}–{bounds[index+1]}
                    </td>
                    <td>
                      {editing===index?<input autoFocus type="number" aria-label={`Edit frequency row ${index+1}`} min="0" max="1000000" step="1" value={draft} onChange={e=>{setDraft(e.target.value);const v=Number(e.target.value);if(e.target.value.trim()===''||!Number.isInteger(v)||v<0||v>1000000){setError('Use a whole frequency from 0 to 1000000.');return;}setError('');act(()=>setFrequency(index,v));}} onBlur={()=>{setEditing(null);setError('');}} onKeyDown={e=>{e.stopPropagation();if(e.key==='Enter'||e.key==='Escape'){setEditing(null);setError('');}}}/>:<div
                        className="mtc10106-frequency"
                        role="slider"
                        tabIndex={0}
                        aria-label={`Frequency row ${index + 1}`}
                        aria-valuemin={0}
                        aria-valuemax={1000000}
                        aria-valuenow={row.frequency}
                        onPointerDown={(event) => {
                          event.currentTarget.setPointerCapture(
                            event.pointerId,
                          );
                          act(() =>
                            setDrag({
                              index,
                              y: event.clientY,
                              value: row.frequency,
                            }),
                          );
                        }}
                        onPointerMove={(event) => dragFrequency(event, index)}
                        onPointerUp={event=>{dragFrequency(event,index);act(()=>setDrag(null));}}
                        onPointerCancel={()=>setDrag(null)}
                        onDoubleClick={()=>{setEditing(index);setDraft(String(row.frequency));setError('');}}
                        onKeyDown={(event) => {
                          event.stopPropagation();
                          if(event.key==='Enter'){event.preventDefault();setEditing(index);setDraft(String(row.frequency));setError('');}
                          if (
                            event.key === "ArrowDown" ||
                            event.key === "ArrowLeft"
                          ) {
                            event.preventDefault();
                            act(() => setFrequency(index, row.frequency - 1));
                          }
                          if (
                            event.key === "ArrowUp" ||
                            event.key === "ArrowRight"
                          ) {
                            event.preventDefault();
                            act(() => setFrequency(index, row.frequency + 1));
                          }
                          if (event.key === "Home")
                            act(() => setFrequency(index, 0));
                        }}
                      >
                        ↕ <b>{row.frequency}</b>
                      </div>}
                    </td>
                    <td>
                      <span
                        className="mtc10106-blocks"
                        aria-label={`${row.frequency} observation blocks`}
                      >
                        {Array.from({ length: Math.min(row.frequency,50) }, (_, block) => (
                          <i key={block} />
                        ))}
                        {row.frequency>50&&<small>+{row.frequency-50}</small>}
                      </span>
                      <button
                        aria-label={`Clear frequency row ${index + 1}`}
                        onClick={() => act(() => setFrequency(index, 0))}
                      >
                        <Trash2 />
                      </button>
                    </td>
                    <td>
                      <strong>{row.next}</strong>
                    </td>
                    <td>
                      {row.current} − {row.frequency} = {row.next}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {error&&<p role="alert">{error}</p>}
          <details className="mtc10106-custom"><summary>Edit class boundaries and grouped data</summary><GroupedDataEditor data={{bounds,frequencies}} defaults={{bounds:[...defaultBoundaries,59.5],frequencies:defaultFrequencies}} onChange={data=>act(()=>{setBounds(data.bounds);setFrequencies(data.frequencies);})}/></details>
          <footer>
            <span className="mtc10106-cube" /> = 1 observation (removed from the
            remaining total)
            <b>
              Final: CF<sub>more</sub> at last boundary = {moreThan.at(-1)}
            </b>
          </footer>
        </section>

        <section className="mtc10106-chart-card">
          <h2>
            Decreasing staircase (CF<sub>more</sub> vs. class boundary)
          </h2>
          <svg
            viewBox="0 0 430 290"
            aria-label="More-than cumulative frequency staircase"
          >
            <g className="grid">
              {Array.from({length:5},(_,i)=>i*yMax/4).map((v) => (
                <g key={v}><line x1="40" y1={chartY(v)} x2="425" y2={chartY(v)} /><text x="31" y={chartY(v)+4} textAnchor="end">{v>=10000?`${v/1000}k`:v}</text></g>
              ))}
            </g>
            <line x1="40" y1="230" x2="425" y2="230" />
            <line x1="40" y1="35" x2="40" y2="230" />
            <path className="mtc10106-area" d={`${staircase} L425,230 L40,230 Z`} />
            <path className="mtc10106-step" d={staircase} />
            <text x="235" y="279" textAnchor="middle">Class boundary, Lᵢ</text>
            <text x="40" y="22">CFmore (≥ Lᵢ)</text>
            {moreThan.map((value, index) => (
              <g className="mtc10106-point" key={index} data-stair-point={index} data-boundary={bounds[index]} data-count={value}>
                <circle cx={chartX(index)} cy={chartY(value)} r="4" />
                <text x={chartX(index)+(index===0?17:index===moreThan.length-1?-10:0)} textAnchor="middle" y={chartY(value) - 10}>
                  {value}
                </text>
                <text x={chartX(index)} textAnchor="middle" y="250">
                  {bounds[index]}
                </text>
              </g>
            ))}
          </svg>
          <footer>
            <p>
              Each drop removes the frequency between two consecutive boundaries.
            </p>
            <p>
              Drag any frequency in the table — all subsequent counts update
              automatically.
            </p>
          </footer>
        </section>

        <section className="mtc10106-warning">
          <div>
            <h2>
              <AlertTriangle /> Important: Do not accumulate upward
            </h2>
            <p>
              More-than cumulative frequency uses <b>descending subtraction.</b>
            </p>
            <p>Do not add upward as in the less-than method.</p>
            <p>That would give incorrect results.</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Less-than (ascending) ↑</th>
                <th>More-than (descending) ↓</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Add as you go up</td>
                <td>Subtract as you go down</td>
              </tr>
              <tr>
                <td>{lessThan.join(", ")}</td>
                <td>{moreThan.join(", ")}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="mtc10106-rule">
          <h2>Rule (at each step i)</h2>
          <strong><MathExpression value={String.raw`CF_{more}(L_{i+1})=CF_{more}(L_i)-f_i`}/></strong>
          <p>
            with CF<sub>more</sub>(L₁) = <i>N</i>
          </p>
        </section>
      </main>
      <nav className="mtc10106-nav">
        <Link to="/lessons/school/class-10/class-10-statistics-less-than-cumulative-frequency"><ArrowLeft /> Less-Than Cumulative Frequency</Link>
        <Link to="/lessons/school/class-10/class-10-statistics-less-than-ogive">Less-Than Ogive <ArrowRight /></Link>
      </nav>


    </section>
  );
}
