import { useId, useState, type PointerEvent } from "react";
import { RotateCcw } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import { correlationDefault, correlationStats } from "./correlationLessonModel";
import "./CorrelationLesson489.css";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
export default function CorrelationLesson489({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  return <CorrelationActivity key={resetToken} onInteraction={onInteraction} />;
}
function CorrelationActivity({
  onInteraction,
}: Pick<LessonAdapterProps, "onInteraction">) {
  const [points, setPoints] = useState(correlationDefault),
    [selected, setSelected] = useState<number | null>(null),
    [line, setLine] = useState(true),
    [dragging, setDragging] = useState<number | null>(null),
    [dragView, setDragView] = useState<{x:number;y:number} | null>(null),
    [answer, setAnswer] = useState(""),
    [checked, setChecked] = useState(false);
  const clipId = useId().replace(/:/g, "");
  const display = (value:number) => Number.isFinite(value) ? value.toFixed(3) : "Undefined";
  const stats = correlationStats(points),
    strength = !stats.defined ? "Undefined (constant variable)" :
      Math.abs(stats.r) >= 0.7
        ? stats.r > 0
          ? "Strong positive"
          : "Strong negative"
        : Math.abs(stats.r) >= 0.3
          ? "Moderate"
          : "No linear relationship";
  const update = (index: number, axis: "x" | "y", raw: string) => {
    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    setPoints(
      points.map((point, i) =>
        i === index ? { ...point, [axis]: value } : point,
      ),
    );
    setChecked(false);
    onInteraction();
  };
  const bounds = dragView ?? {x:Math.max(3.5,...points.map(p=>Math.abs(p.x)))*1.15,y:Math.max(3,...points.map(p=>Math.abs(p.y)))*1.15};
  const px=(x:number)=>250+x/bounds.x*210, py=(y:number)=>160-y/bounds.y*120;
  const movePoint=(index:number,event:PointerEvent<SVGSVGElement>,view=bounds)=>{
    const matrix=event.currentTarget.getScreenCTM();if(!matrix)return;
    const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());
    const x=Math.round(Math.max(-view.x,Math.min(view.x,(point.x-250)/210*view.x))*10)/10;
    const y=Math.round(Math.max(-view.y,Math.min(view.y,(160-point.y)/120*view.y))*10)/10;
    setPoints(current=>current.map((p,i)=>i===index?{x,y}:p));setSelected(index);setChecked(false);onInteraction();
  };
  const reset=()=>{setPoints(correlationDefault);setSelected(null);setLine(true);setAnswer("");setChecked(false);setDragging(null);setDragView(null);onInteraction();};
  return (
    <div
      className="corr489"
      data-testid="statistics-mockup-0452"
      data-target-family="statistics-and-regression"
      data-r={stats.defined ? stats.r : "undefined"}
      data-points={JSON.stringify(points)}
    >
      <header>
        <div>
          <span>DATA AND PROBABILITY · STATISTICS AND REGRESSION</span>
          <h2>Correlation Coefficient</h2>
          <p>Measure linear association between two quantitative variables.</p>
        </div>
        <span>Lesson 489 · Share</span>
      </header>
      <nav>
        <b>Interact</b>
        <span>Learn</span>
        <span>Example</span>
        <span>Formula</span>
        <span>Practice</span>
      </nav>
      <section className="corr489-steps">
        <b>
          Interact
          <br />
          <small>Build data and see r update.</small>
        </b>
        <b>
          Learn
          <br />
          <small>Understand strength and direction.</small>
        </b>
        <b>
          Example
          <br />
          <small>Interpret association.</small>
        </b>
        <b>
          Formula
          <br />
          <small>Use Pearson's r.</small>
        </b>
        <b>
          Practice
          <br />
          <small>Try paired sets.</small>
        </b>
      </section>
      <section className="corr489-work">
        <aside>
          <h3>Paired data</h3>
          <table>
            <thead>
              <tr>
                <th>Point</th>
                <th>x</th>
                <th>y</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point, index) => (
                <tr key={index} onClick={() => setSelected(index)}>
                  <td>P{index + 1}</td>
                  <td>
                    <input
                      type="number" step="any"
                      aria-label={`Correlation x ${index + 1}`}
                      value={point.x}
                      onChange={(event) =>
                        update(index, "x", event.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number" step="any"
                      aria-label={`Correlation y ${index + 1}`}
                      value={point.y}
                      onChange={(event) =>
                        update(index, "y", event.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={reset}
          >
            <RotateCcw size={14} /> Reset points
          </button>
        </aside>
        <section className="corr489-graph">
          <h3>Drag points to explore</h3>
          <svg viewBox="0 0 500 320" role="img" aria-label="Correlation scatter plot" style={{touchAction:"none"}}
            onPointerDown={event=>{const target=(event.target as Element).closest("[data-point-index]");if(!target)return;const index=Number(target.getAttribute("data-point-index"));event.preventDefault();event.currentTarget.setPointerCapture(event.pointerId);setDragging(index);setDragView(bounds);movePoint(index,event);}}
            onPointerMove={event=>{if(dragging!==null)movePoint(dragging,event);}}
            onPointerUp={event=>{if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId);setDragging(null);setDragView(null);}}
            onPointerCancel={()=>{setDragging(null);setDragView(null);}}>
            <defs><clipPath id={clipId}><rect x="40" y="30" width="420" height="260"/></clipPath></defs>
            <line x1="40" x2="460" y1={py(0)} y2={py(0)} stroke="#cbd5e1"/><line x1={px(0)} x2={px(0)} y1="30" y2="290" stroke="#cbd5e1"/>
            <g clipPath={`url(#${clipId})`}>
              {line&&Number.isFinite(stats.slope)&&<line data-regression-line x1={px(-bounds.x)} y1={py(stats.intercept-stats.slope*bounds.x)} x2={px(bounds.x)} y2={py(stats.intercept+stats.slope*bounds.x)} stroke="#35b8dc" strokeWidth="2" strokeDasharray="7 5"/>}
              {points.map((point,index)=><circle key={index} data-point-index={index} role="button" tabIndex={0} aria-label={`Point ${index+1}: x ${point.x}, y ${point.y}. Use arrow keys to move.`} aria-pressed={selected===index} cx={px(point.x)} cy={py(point.y)} r={selected===index?10:6} fill="#19b6ce"
                onClick={()=>setSelected(index)} onKeyDown={event=>{const deltas:Record<string,[number,number]>={ArrowLeft:[-.1,0],ArrowRight:[.1,0],ArrowUp:[0,.1],ArrowDown:[0,-.1]};const delta=deltas[event.key];if(!delta)return;event.preventDefault();setPoints(current=>current.map((p,i)=>i===index?{x:Math.round((p.x+delta[0])*10)/10,y:Math.round((p.y+delta[1])*10)/10}:p));setSelected(index);setChecked(false);onInteraction();}}/>)}
            </g>
          </svg>
          <label>
            <input
              type="checkbox"
              checked={line}
              onChange={(event) => setLine(event.target.checked)}
            />{" "}
            Show regression line
          </label>
        </section>
        <aside className="corr489-panel">
          <h3>Pearson correlation (r)</h3>
          <strong>{display(stats.r)}</strong>
          <em>{strength}</em>
          {stats.defined&&<meter aria-label="Correlation value" aria-valuetext={display(stats.r)} min={-1} max={1} value={stats.r}/>}
          {!stats.defined&&<p>Correlation is undefined when either variable has zero variation.</p>}
          <div className="corr489-components">
            <p>
              Σ(xᵢ−x̄)(yᵢ−ȳ) <b>{(stats.covariance * stats.n).toFixed(3)}</b>
            </p>
            <p>
              x̄ <b>{stats.xMean.toFixed(3)}</b>
            </p>
            <p>
              ȳ <b>{stats.yMean.toFixed(3)}</b>
            </p>
            <p>
              Sx <b>{stats.sx.toFixed(3)}</b>
            </p>
            <p>
              Sy <b>{stats.sy.toFixed(3)}</b>
            </p>
            <p>
              Cov(x,y) <b>{stats.covariance.toFixed(3)}</b>
            </p>
          </div>
        </aside>
      </section>
      <section className="corr489-metrics">
        {[
          ["n", stats.n],
          ["r", display(stats.r)],
          ["r²", display(stats.r ** 2)],
          ["Cov(x,y)", stats.covariance.toFixed(3)],
          ["Sx", stats.sx.toFixed(3)],
          ["Sy", stats.sy.toFixed(3)],
        ].map(([label, value]) => (
          <span key={String(label)}>
            {label}
            <b>{value}</b>
          </span>
        ))}
      </section>
      <section className="corr489-lower">
        <article>
          <h3>Key ideas</h3>
          <p>
            r = +1 is a perfect positive linear association; r = −1 is perfect
            negative; r = 0 means no linear association.
          </p>
        </article>
        <article>
          <h3>Definition & formula</h3>
          <p>
            Pearson's r is unit-free and lies between −1 and 1. It measures
            association, not cause.
          </p>
        </article>
        <article>
          <h3>Misconception guard</h3>
          <p>
            A strong correlation does not imply that one variable causes the
            other. Look for lurking variables and experiments.
          </p>
        </article>
      </section>
      <section className="corr489-example">
        <h3>Worked example</h3>
        <p>
          Current data: n = {stats.n}, r = {display(stats.r)}, interpreted as
          a {strength.toLowerCase()} relationship.
        </p>
      </section>
      <section className="corr489-practice">
        <h3>Try it yourself</h3><p>Estimate r for the current paired data, within 0.01.</p>
        <label>Your estimate <input type="number" min="-1" max="1" step=".001" aria-label="Estimate correlation" value={answer} disabled={!stats.defined} onChange={event=>{setAnswer(event.target.value);setChecked(false);}}/></label>
        <button disabled={!stats.defined||answer.trim()===""} onClick={()=>{setChecked(true);onInteraction();}}>Check answer</button>
        {checked&&<p role="status">{Math.abs(Number(answer)-stats.r)<=.01?"Correct: your estimate matches the current data.":`Try again: r is about ${display(stats.r)} for the current data.`}</p>}
      </section>
      <footer>
        <button
          type="button"
          onClick={reset}
        >
          <RotateCcw size={14} /> Reset lesson
        </button>
        <span>Previous: Time-Series Plot &nbsp; Next: Linear Regression →</span>
      </footer>
      <LessonTopicStudyBoard lessonId={489} alwaysVisible onInteraction={onInteraction} />

    </div>
  );
}
