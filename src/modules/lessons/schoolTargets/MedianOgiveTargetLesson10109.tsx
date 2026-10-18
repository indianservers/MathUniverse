import GroupedDataEditor from "../components/GroupedDataEditor";
import { CheckCircle2, Info, GripVertical, RotateCcw } from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./MedianOgiveTargetLesson10109.css";
import {Link} from "react-router-dom";
import MathExpression from "../../../components/ui/MathExpression";
import {medianOgiveModel,moveOgivePoint,ogiveMethods,ogiveYMax} from "./medianOgiveModel";

const defaults = [5, 9, 12, 15, 7, 2];
const defaultBounds = [0, 10, 20, 30, 40, 50, 60];
const r2 = (value: number) => Number(value.toFixed(2));

export default function MedianOgiveTargetLesson10109({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [bounds,setBounds] = useState(defaultBounds);
  const [frequencies, setFrequencies] = useState(defaults);
  const [showLess, setShowLess] = useState(true);
  const [showMore, setShowMore] = useState(true);
  const [dragging, setDragging] = useState<{
    index: number;
    y: number;
    value: number;
  } | null>(null);
  const [editingRow,setEditingRow]=useState<number|null>(null),[frequencyDraft,setFrequencyDraft]=useState(''),[frequencyError,setFrequencyError]=useState('');
  const [practice,setPractice]=useState(false),[practiceDraft,setPracticeDraft]=useState(''),[attempt,setAttempt]=useState<{signature:string;correct:boolean}|null>(null);
  const [actions, setActions] = useState(0);
  const facts=medianOgiveModel(bounds,frequencies);
  const {total,half,less,more,valid}=facts;
  const lower=facts.lower??bounds[0],width=facts.width??bounds[1]-bounds[0],cumulativeBefore=facts.cumulativeBefore??0,medianFrequency=facts.medianFrequency??0;
  const methods=ogiveMethods(bounds,frequencies),signature=JSON.stringify({bounds,frequencies});
  const exactMedian=facts.median,median=exactMedian===null?'—':r2(exactMedian);
  const graphDrag=useRef<{index:number;kind:string;max:number}|null>(null);
  const sx = (x: number) => 45 + ((x-bounds[0]) / (bounds.at(-1)!-bounds[0])) * 455;
  const sy = (value: number) => 260 - (value / ogiveYMax(total)) * 220;
  const lessPath = less
    .map(
      (value, index) => `${index ? "L" : "M"}${sx(bounds[index])},${sy(value)}`,
    )
    .join(" ");
  const morePath = more
    .map(
      (value, index) => `${index ? "L" : "M"}${sx(bounds[index])},${sy(value)}`,
    )
    .join(" ");
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setFrequency = (index: number, value: number) =>
    setFrequencies((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? Math.max(0, Math.min(1000000, Math.round(value)))
          : item,
      ),
    );
  const editFrequency=(i:number)=>{setEditingRow(i);setFrequencyDraft(String(frequencies[i]));setFrequencyError('');};
  const commitFrequency=()=>{if(editingRow===null)return;if(!/^\d+$/.test(frequencyDraft)||Number(frequencyDraft)>1000000){setFrequencyError('Enter a whole frequency from 0 to 1,000,000.');return;}act(()=>setFrequency(editingRow,Number(frequencyDraft)));setEditingRow(null);setFrequencyError('');};
  const dragFrequency = (
    event: PointerEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (dragging?.index !== index) return;
    setFrequency(index, dragging.value + (dragging.y - event.clientY) / 4);
  };
  const reset = () =>
    act(() => {
      setFrequencies(defaults);
      setBounds(defaultBounds);
      setShowLess(true);
      setShowMore(true);
      setDragging(null);
      setEditingRow(null);setFrequencyError('');setPractice(false);setPracticeDraft('');setAttempt(null);
    });

  return (
    <section
      className="med10109-page"
      data-testid="school-mockup-0783"
      data-object-model="dedicated-dual-ogive-grouped-median-equivalence-engine"
      data-frequencies={frequencies.join(",")}
      data-less={less.join(",")}
      data-more={more.join(",")}
      data-total={total}
      data-half={half}
      data-median={median}
      data-y-max={ogiveYMax(total)} data-exact-median={exactMedian??"none"} data-valid={String(valid)} data-median-range={facts.medianRange?.join(",")??"none"}
      data-median-class={valid?`${lower}-${lower+width}`:"none"}
      data-show-less={String(showLess)}
      data-show-more={String(showMore)}
      data-actions={actions}
    >
      <div className="med10109-hero">
        <div>
          <small>CLASS 10 · STATISTICS</small>
          <h1>Median from an Ogive</h1>
          <p>
            Find the median of grouped data using two equivalent graphical
            constructions and compare with the grouped median formula.
          </p>
          <nav>
            <span>18 min</span>
            <span>INTERMEDIATE</span>
            <span>CONCEPT</span>
            <span>statistics</span>
          </nav>
        </div>

      <aside>
          <b>KEY IDEA</b>
          <p>
            The median splits the data into two equal parts (N/2 each). Both
            less-than and more-than ogives give the same median.
          </p>
        </aside>
      </div>

      <main className="med10109-workspace">
        <section className="med10109-data">
          <h2>
            1 ) DATA <span>(Grouped Frequency Distribution)</span>
          </h2>
          <table>
            <thead>
              <tr>
                <th>Class Interval</th>
                <th>f (Frequency)</th>
                <th>&lt; Cf</th>
                <th>&gt; Cf</th>
              </tr>
            </thead>
            <tbody>
              {frequencies.map((frequency, index) => (
                <tr key={index}>
                  <td>
                    <GripVertical /> {bounds[index]} – {bounds[index + 1]}
                  </td>
                  <td>
                    {editingRow===index?<input autoFocus aria-label={`Edit frequency row ${index+1}`} value={frequencyDraft} onChange={e=>setFrequencyDraft(e.target.value)} onBlur={commitFrequency} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();commitFrequency();}if(e.key==='Escape'){setEditingRow(null);setFrequencyError('');}}}/>:<div
                      onDoubleClick={()=>editFrequency(index)}
                      role="slider"
                      tabIndex={0}
                      aria-label={`Frequency row ${index + 1}`}
                      aria-valuemin={0}
                      aria-valuemax={1000000}
                      aria-valuenow={frequency}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() =>
                          setDragging({
                            index,
                            y: event.clientY,
                            value: frequency,
                          }),
                        );
                      }}
                      onPointerMove={(event) => dragFrequency(event, index)}
                      onPointerUp={() =>
                        dragging && act(() => setDragging(null))
                      }
                      onKeyDown={(event) => {
                        if(event.key==='Enter'){event.preventDefault();editFrequency(index);return;}
                        if(event.key.startsWith("Arrow"))event.preventDefault();
                        if (event.key === "ArrowUp")
                          act(() => setFrequency(index, frequency + 1));
                        if (event.key === "ArrowDown")
                          act(() => setFrequency(index, frequency - 1));
                      }}
                    >
                      ↕ {frequency}
                    </div>}
                  </td>
                  <td>{less[index + 1]}</td>
                  <td>{more[index]}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total (N)</td>
                <td>{total}</td>
                <td>–</td>
                <td>–</td>
              </tr>
            </tfoot>
          </table>
          <p>Drag an ogive point or a frequency; double-click a frequency (or press Enter) to type. More-than Cf is shown at the lower boundary.</p>
          {frequencyError&&<p role="alert">{frequencyError}</p>}
          <aside>
            <b>N = {total}</b>
            <strong>⇒</strong>
            <b>N/2 = {half}</b>
            <span>Class width (h) = {width}</span>
          </aside>
      <details className="med10109-custom"><summary>Edit class boundaries and data</summary><GroupedDataEditor data={{bounds,frequencies}} defaults={{bounds:defaultBounds,frequencies:defaults}} onChange={data=>act(()=>{setBounds(data.bounds);setFrequencies(data.frequencies);})}/></details>
        </section>
        <section className="med10109-dual">
          <div className="med10109-graph-heading">
            <h2>
              2 ) DUAL OGIVE{" "}
              <span>(Less-than &amp; More-than on same axes)</span>
            </h2>
            <label>
              <input
                type="checkbox"
                checked={showLess}
                onChange={(event) =>
                  act(() => setShowLess(event.target.checked))
                }
              />{" "}
              Less-than ogive
            </label>
            <label>
              <input
                type="checkbox"
                checked={showMore}
                onChange={(event) =>
                  act(() => setShowMore(event.target.checked))
                }
              />{" "}
              More-than ogive
            </label>
            <button onClick={reset}>
              <RotateCcw /> Reset points
            </button>
          </div>
          <svg
            viewBox="0 0 540 330"
            aria-label="Dual ogive median construction"
            onPointerDown={e=>{const point=(e.target as SVGElement).closest('[data-ogive-point]');if(!point)return;graphDrag.current={index:Number(point.getAttribute('data-ogive-point')),kind:point.getAttribute('data-kind')!,max:ogiveYMax(total)};e.currentTarget.setPointerCapture(e.pointerId);}}
            onPointerMove={e=>{const d=graphDrag.current,m=e.currentTarget.getScreenCTM();if(!d||!m)return;const pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse()),y=(260-pt.y)*d.max/220;act(()=>setFrequencies(f=>moveOgivePoint(f,d.index,d.kind==='less'?y:total-y)));}}
            onPointerUp={()=>{graphDrag.current=null;}}
            onPointerCancel={()=>{graphDrag.current=null;}}
          >
            <text x="260" y="315" textAnchor="middle">Class Boundary</text><text transform="translate(12 155) rotate(-90)" textAnchor="middle">Cumulative Frequency</text>
            <g className="grid">
              {Array.from({length:7},(_,i)=>Number((i*ogiveYMax(total)/6).toFixed(2))).map((value) => (
                <g key={value}><text x="35" y={sy(value)+4} textAnchor="end">{value>=1000000?`${Number((value/1000000).toPrecision(3))}M`:value>=1000?`${Number((value/1000).toPrecision(3))}k`:value}</text><line
                  x1="45"
                  y1={sy(value)}
                  x2="510"
                  y2={sy(value)}
                /></g>
              ))}
            </g>
            <line x1="45" y1="260" x2="515" y2="260" />
            <line x1="45" y1="265" x2="45" y2="35" />
            {showLess && (
              <>
                <path className="less" d={lessPath} />
                {less.map((value, index) => (
                  <circle
                    key={`l${index}`}
                    data-ogive-point={index} data-kind="less"
                    role={index>0&&index<frequencies.length?'slider':undefined} tabIndex={index>0&&index<frequencies.length?0:-1}
                    aria-label={`Less-than cumulative boundary ${index}`} aria-valuenow={value} aria-valuemin={less[Math.max(0,index-1)]} aria-valuemax={less[Math.min(frequencies.length,index+1)]}
                    onKeyDown={e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();act(()=>setFrequencies(f=>moveOgivePoint(f,index,value+(e.key==='ArrowUp'?1:-1))));}}}
                    className="less"
                    cx={sx(bounds[index])}
                    cy={sy(value)}
                    r="4"
                  />
                ))}
              </>
            )}
            {showMore && (
              <>
                <path className="more" d={morePath} />
                {more.map((value, index) => (
                  <circle
                    key={`m${index}`}
                    data-ogive-point={index} data-kind="more"
                    role={index>0&&index<frequencies.length?'slider':undefined} tabIndex={index>0&&index<frequencies.length?0:-1}
                    aria-label={`More-than cumulative boundary ${index}`} aria-valuenow={value} aria-valuemin={more[Math.min(frequencies.length,index+1)]} aria-valuemax={more[Math.max(0,index-1)]}
                    onKeyDown={e=>{if(e.key==='ArrowUp'||e.key==='ArrowDown'){e.preventDefault();act(()=>setFrequencies(f=>moveOgivePoint(f,index,less[index]+(e.key==='ArrowUp'?-1:1))));}}}
                    className="more"
                    cx={sx(bounds[index])}
                    cy={sy(value)}
                    r="4"
                  />
                ))}
              </>
            )}
            {valid&&<g className="guide">
              <line x1="45" y1={sy(half)} x2={sx(exactMedian??bounds[0])} y2={sy(half)} />
              <line x1={sx(exactMedian??bounds[0])} y1={sy(half)} x2={sx(exactMedian??bounds[0])} y2="260" />
              <circle cx={sx(exactMedian??bounds[0])} cy={sy(half)} r="6" />
              <text x="52" y={sy(half) - 8}>
                N/2 = {half}
              </text>
              {facts.medianRange&&facts.medianRange[1]>facts.medianRange[0]&&<line data-median-interval="true" x1={sx(facts.medianRange[0])} x2={sx(facts.medianRange[1])} y1={sy(half)} y2={sy(half)} style={{stroke:'#d3b6ff',strokeWidth:5}}/>}
              <rect x={sx(exactMedian!)>330?sx(exactMedian!)-190:sx(exactMedian!)+15} y={sy(half)-20} width="175" height="40" rx="5" fill="#06162bee" stroke="#b99b61"/>
              <text x={(sx(exactMedian!)>330?sx(exactMedian!)-190:sx(exactMedian!)+15)+10} className="med10109-callout-title" y={sy(half)-5}>Intersection (Median)</text>
              <text x={(sx(exactMedian!)>330?sx(exactMedian!)-190:sx(exactMedian!)+15)+10} y={sy(half)+10}>{facts.medianRange&&facts.medianRange[1]>facts.medianRange[0]?`Interval [${facts.medianRange.join(', ')}]`:`(${median}, ${half})`}</text>

            </g>}
            {bounds.map((value) => (
              <text key={value} x={sx(value) - 5} y="282">
                {value}
              </text>
            ))}
          </svg>
          <div className="med10109-read">
            <article>
              <b>Read-off from Less-than ogive</b>
              <p>At cumulative frequency N/2 = {half}</p>
              <strong>x (Median) = {median}</strong>
            </article>
            <article>
              <b>Intersection of ogives</b>
              <strong>
                {valid?`(${median}, ${half})`:"No median intersection"}
              </strong>
              <p>Median = {median}</p>
            </article>
            <article>
              <b>Read-off from More-than ogive</b>
              <p>At cumulative frequency N/2 = {half}</p>
              <strong>x (Median) = {median}</strong>
            </article>
          </div>
          <aside>
            <b>{valid?"Why do both constructions agree?":"No observations"}</b>
            <p>
              {valid?"At the median, half the observations lie below and half lie above,":"A distribution with N = 0 has no median. Add a positive frequency to construct one."}
              {valid&&"so both curves meet the N/2 guide at the same x-value."}
              {facts.medianRange&&facts.medianRange[1]>facts.medianRange[0]&&` A zero-frequency gap gives a median interval [${facts.medianRange.join(", ")}]. The displayed formula uses its lower endpoint.`}
            </p>
          </aside>
        </section>
        <div className="med10109-right">
          <section className="med10109-formula">
            <h2>3 ) GROUPED MEDIAN FORMULA</h2>
            <strong><MathExpression value={String.raw`\operatorname{Median}=l+\frac{N/2-c_f}{f}h`}/></strong>
            <p>
              {valid?"":"No median: the total frequency is zero. "}l = lower boundary, cᶠ = cumulative frequency before median class,
              f = frequency, h = class width
            </p>
            {valid&&<div>
              N/2 = {half}
              <br />
              Median class: {lower} – {lower + width}
              <br />
              l={lower}, cᶠ={cumulativeBefore}, f={medianFrequency}, h={width}
              <br />
              <b>
                <MathExpression value={String.raw`=${lower}+\frac{${half}-${cumulativeBefore}}{${medianFrequency}}\times ${width}`}/>
              </b>
              <br />= {median}
            </div>}
            <mark>{valid?`Median (Formula) ≈ ${median}`:"No median: N = 0"}</mark>
          </section>
          <section className="med10109-compare">
            <h2>4 ) COMPARISON</h2>
            <table>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Value</th>
                  <th>Difference</th>
                </tr>
              </thead>
              <tbody>
                {[
                  "Less-than ogive (N/2 read-off)",
                  "Intersection of ogives",
                  "More-than ogive (N/2 read-off)",
                  "Grouped median formula",
                ].map((method,i) => (
                  <tr key={method} data-method={i} data-value={methods[i]??"none"}>
                    <td>{method}</td>
                    <td>{methods[i]===null?"—":r2(methods[i]!)}</td>
                    <td>{!valid||i===3?"—":`≈ ${Math.abs(methods[i]!-exactMedian!).toFixed(2)}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              {valid?<CheckCircle2/>:<Info/>} {valid?"All methods agree for the same piecewise-linear grouped distribution.":"No data: the median is undefined."}
            </p>
          </section>
        </div>
      </main>
      <div className="med10109-neighbors"><Link to="/lessons/school/class-10/class-10-statistics-more-than-ogive">← More-Than Ogive</Link><button onClick={()=>setPractice(v=>!v)} aria-expanded={practice}>Next: Practice →</button></div>
      {practice&&<section className="med10109-practice"><h2>Practice: read the median</h2><p>{valid?'Use the displayed grouped-median formula, taking the lower endpoint if there is an interval. Round to two decimals.':'Add a positive frequency before attempting this question.'}</p><label>Median estimate <input aria-label="Practice median estimate" value={practiceDraft} onChange={e=>setPracticeDraft(e.target.value)}/></label><button disabled={!valid||practiceDraft.trim()===''||!Number.isFinite(Number(practiceDraft))} onClick={()=>setAttempt({signature,correct:Math.abs(Number(practiceDraft)-exactMedian!)<=.0051})}>Check answer</button>{attempt?.signature===signature&&<p role="status">{attempt.correct?'Correct: your estimate agrees with the current ogives.':`Try again: use N/2 = ${half} and interpolate in the median class.`}</p>}</section>}



    </section>
  );
}
