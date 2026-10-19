import {
  AlertTriangle,
  CheckCircle2,
  Info,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./GroupedMeanStepTargetLesson10104.css";
import{groupedMeanStepModel}from "./groupedMeanStepModel";
import MathExpression from "../../../components/ui/MathExpression";
import{Link}from "react-router-dom";

type StepRow = {
  id: number;
  lower: number;
  upper: number;
  frequency: number;
  midpoint: number;
};
const defaults: StepRow[] = [
  { id: 1, lower: 0, upper: 10, frequency: 4, midpoint: 5 },
  { id: 2, lower: 10, upper: 20, frequency: 9, midpoint: 15 },
  { id: 3, lower: 20, upper: 30, frequency: 13, midpoint: 25 },
  { id: 4, lower: 30, upper: 40, frequency: 10, midpoint: 35 },
  { id: 5, lower: 40, upper: 50, frequency: 4, midpoint: 45 },
];
const round = (value: number, places = 2) =>
  Math.round(value * 10 ** places) / 10 ** places;

export default function GroupedMeanStepTargetLesson10104({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [rows, setRows] = useState<StepRow[]>(defaults);
  const [assumed, setAssumed] = useState(25);
  const [classWidth, setClassWidth] = useState(10);
  const [dragging, setDragging] = useState(false);
  const [actions, setActions] = useState(0);
  const lineRef = useRef<SVGSVGElement>(null);
  const {enriched,totalFrequency,totalStep,mean,widths,sameWidths,equalWidth}=groupedMeanStepModel(rows,assumed,classWidth);
  const [draftKey,setDraftKey]=useState<string|null>(null),[draft,setDraft]=useState(''),[error,setError]=useState('');
  const frame=useRef<{min:number;max:number}|null>(null);
  const minX=frame.current?.min??Math.min(rows[0].lower,assumed),maxX=frame.current?.max??Math.max(rows.at(-1)!.upper,assumed);
  const sx=(x:number)=>40+(x-minX)/(maxX-minX)*560;
  const markerX=sx(assumed),meanText=mean===null?'—':mean.toFixed(2);

  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const setA=(v:number)=>{if(Number.isFinite(v))setAssumed(Math.max(-1e9,Math.min(1e9,round(v,3))));};
  const setH=(v:number)=>{if(Number.isFinite(v)&&v>0)setClassWidth(Math.min(1e9,v));};
  const edit=(key:string,text:string,apply:(v:number)=>void,okay:(v:number)=>boolean)=>{setDraftKey(key);setDraft(text);const v=text.trim()===''?NaN:Number(text);if(!Number.isFinite(v)||!okay(v)){setError('Use finite ordered boundaries, whole nonnegative frequencies and a positive scale h.');return;}setError('');act(()=>apply(v));};
  const inputValue=(key:string,v:number)=>draftKey===key?draft:v;
  const blur=()=>{setDraftKey(null);setError('');};
  const updateRow=(id:number,patch:Partial<StepRow>)=>setRows(current=>current.map(row=>row.id===id?{...row,...patch}:row));
  const updateMarker=(event:PointerEvent<SVGSVGElement>)=>{if(!lineRef.current)return;const m=lineRef.current.getScreenCTM();if(!m)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());setA(minX+Math.max(0,Math.min(1,(p.x-40)/560))*(maxX-minX));};

  const reset = () =>
    act(() => {
      setRows(defaults);
      setAssumed(25);
      setClassWidth(10);setDragging(false);frame.current=null;setDraftKey(null);setError('');
    });

  return (
    <section
      className="gms10104-page"
      data-testid="school-mockup-0778"
      data-object-model="dedicated-step-deviation-common-width-engine"
      data-assumed-mean={assumed}
      data-class-width={classWidth}
      data-total-frequency={round(totalFrequency)}
      data-total-step={round(totalStep)}
      data-mean={mean===null?"none":mean}
      data-exact-step={totalStep}
      data-equal-width={String(equalWidth)}
      data-widths={widths.join(",")}
      data-actions={actions}
    >
      <div className="gms10104-hero">
        <small>CLASS 10 · STATISTICS</small>
        <Link className="gms10104-school" to="/lessons/school">← School lessons</Link>
        <h1>Grouped Mean by Step Deviation</h1>
        <p>
          A shortcut to find the mean of grouped data using deviation method
          with a common class width.
        </p>
        <nav>
          <span>18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>statistics</span>
        </nav>
      </div>
      <main>
        <section className="gms10104-lab">
          <div className="gms10104-heading">
            <div>
              <h2>
                <SlidersHorizontal /> INTERACTIVE LAB
              </h2>
              <h3>Equal-width Grouped-Data Lab</h3>
              <p>
                Enter grouped data with a common class width to use step
                deviation.
              </p>
            </div>
            <button onClick={reset}>
              <RotateCcw /> Reset lab
            </button>
          </div>
          <div className="gms10104-table">
            <table>
              <thead>
                <tr>
                  <th>Interval (Class)</th>
                  <th>fᵢ</th>
                  <th>Midpoint xᵢ</th>
                  <th>uᵢ = (xᵢ − A) / h</th>
                  <th>fᵢ · uᵢ</th>
                </tr>
              </thead>
              <tbody>
                {enriched.map((row, index) => (
                  <tr key={row.id}>
                    <td>
                      <input
                        aria-label={`Lower bound row ${index + 1}`}
                        type="number"
                        value={inputValue(`lower-${row.id}`,row.lower)}
                        onBlur={blur}
                        step="any"
                        onChange={(event) =>
                          edit(`lower-${row.id}`,event.target.value,v=>updateRow(row.id,{lower:v}),v=>v<row.upper&&(index===0||v>=rows[index-1].upper))
                        }
                      />
                      <span>–</span>
                      <input
                        aria-label={`Upper bound row ${index + 1}`}
                        type="number"
                        value={inputValue(`upper-${row.id}`,row.upper)}
                        onBlur={blur}
                        step="any"
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
                        onBlur={blur}
                        max="1000000" step="1"
                        onChange={(event) =>
                          edit(`frequency-${row.id}`,event.target.value,v=>updateRow(row.id,{frequency:v}),v=>Number.isInteger(v)&&v>=0&&v<=1e6)
                        }
                      />
                    </td>
                    <td>
                      <input
                        aria-label={`Midpoint row ${index + 1}`}
                        type="number"
                        value={row.midpoint}
                        readOnly title="Midpoint is calculated from the class boundaries"
                      />
                    </td>
                    <td>{round(row.deviation)}</td>
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
                  <td>Totals</td>
                  <td>
                    Σfᵢ = <b>{round(totalFrequency)}</b>
                  </td>
                  <td />
                  <td />
                  <td>
                    Σfᵢuᵢ = <b>{round(totalStep)}</b>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
          {error&&<p role="alert">{error}</p>}
          <footer>
            <label>
              Assumed mean A{" "}
              <input
                aria-label="Assumed mean"
                type="number"
                min="-1000000000"
                max="1000000000" step="any"
                value={inputValue('A',assumed)}
                onBlur={blur}
                onChange={event=>edit('A',event.target.value,setA,v=>Math.abs(v)<=1e9)}
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
                }}
              />
            </label>
            <label>
              Class width h (common){" "}
              <input
                aria-label="Common class width"
                type="number"
                min="0.000001"
                max="1000000000" step="any"
                value={inputValue('h',classWidth)}
                onBlur={blur}
                onChange={event=>edit('h',event.target.value,setH,v=>v>0&&v<=1e9)}
                onKeyDown={(event) => {
                  event.stopPropagation();
                  if (event.key === "ArrowLeft") {
                    event.preventDefault();
                    act(() => setH(classWidth - 1));
                  }
                  if (event.key === "ArrowRight") {
                    event.preventDefault();
                    act(() => setH(classWidth + 1));
                  }
                }}
              />
            </label>
            <strong>{mean===null?'No observations: the mean is undefined.':<MathExpression value={String.raw`\bar{x}=A+h\frac{\sum_{i} f_i u_i}{\sum_{i} f_i}=${assumed}+${classWidth}\left(\frac{${round(totalStep,4)}}{${totalFrequency}}\right)=${meanText}`}/>}</strong>
          </footer>
        </section>
        <section className="gms10104-side">
          <article className="gms10104-line">
            <h2>
              Deviation Number Line <small>(in units of h)</small>
            </h2>
            <svg
              ref={lineRef}
              viewBox="0 0 640 100"
              aria-label="Step deviation number line"
              onPointerMove={(event) => dragging && updateMarker(event)}
              onPointerUp={event=>{if(dragging)updateMarker(event);frame.current=null;act(()=>setDragging(false));}}
              onPointerCancel={()=>{frame.current=null;setDragging(false);}}
            >
              <line x1="40" y1="58" x2="600" y2="58" />
              {enriched.map((row) => {
                const x=sx(row.midpoint);
                return (
                  <g key={row.id} data-deviation-id={row.id} role="button" tabIndex={0} aria-label={`Set assumed mean to midpoint ${row.midpoint}`} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();event.stopPropagation();act(()=>setA(row.midpoint));}}} onClick={() => act(() => setA(row.midpoint))}>
                    <circle cx={x} cy="58" r="6" />
                    <text textAnchor="middle" x={x} y="87">
                      {round(row.deviation)}
                    </text>

                  </g>
                );
              })}
              <circle
                className="gms10104-marker"
                cx={markerX}
                cy="58"
                r="9"
                role="slider"
                tabIndex={0}
                aria-label="Assumed mean step marker"
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
          </article>
          <article className="gms10104-summary">
            <h2>Live Summary</h2>
            <div>
              <span>
                Σfᵢ <b>{round(totalFrequency)}</b>
              </span>
              <span>
                Σfᵢuᵢ <b>{round(totalStep)}</b>
              </span>
              <span>
                x̄ <b>{meanText}</b>
              </span>
            </div>
          </article>
          <article
            className={`gms10104-detector ${equalWidth ? "valid" : "invalid"}`}
          >
            {equalWidth ? <CheckCircle2 /> : <AlertTriangle />}
            <div>
              <div className="gms10104-heading">
                <h2>Equal-Class-Width Detector</h2>
                <b>{equalWidth ? "EQUAL WIDTH" : sameWidths?"h DOES NOT MATCH":"NOT EQUAL-WIDTH"}</b>
              </div>
              <p>
                {equalWidth
                  ? "All class widths match the common class width h. Step deviation is valid."
                  : sameWidths?"The class widths are equal, but h does not match their common width.":"Class widths differ. A shared scale still gives the weighted mean, but loses the equal-width shortcut."}
              </p>
              <aside>
                Detected class widths <strong>{widths.join(", ")}</strong> →{" "}
                {sameWidths ? "All equal" : "Not all equal"}
              </aside>
            </div>
          </article>
          <article className="gms10104-why">
            <Info />
            <div>
              <h3>Why choose the common class width</h3>
              <p>
                The step deviation method uses uᵢ=(xᵢ−A)/h so that deviations
                are measured in the same units.
              </p>
              <p>
                Choosing the common class width makes consecutive midpoints differ by one unit. With unequal widths, the identity still holds for any positive shared h, but the deviations need not be consecutive integers.
              </p>
            </div>
          </article>
        </section>
      </main>


    </section>
  );
}
