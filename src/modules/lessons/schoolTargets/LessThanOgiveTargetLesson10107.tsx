import GroupedDataEditor from "../components/GroupedDataEditor";
import {
  Calculator,
  Download,
  GripVertical,
  Lightbulb,
  Plus,
  RotateCcw,
} from "lucide-react";
import { type PointerEvent, useRef, useState } from "react";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./LessThanOgiveTargetLesson10107.css";
import{lessThanModel,lessAxisMax,moveLessPoint}from "./lessThanOgiveModel";
import MathExpression from "../../../components/ui/MathExpression";

type Point = { id: number; x: number; cf: number };
const defaults: Point[] = [
  { id: 1, x: 10.5, cf: 0 },
  { id: 2, x: 20.5, cf: 4 },
  { id: 3, x: 30.5, cf: 8 },
  { id: 4, x: 40.5, cf: 15 },
  { id: 5, x: 50.5, cf: 22 },
  { id: 6, x: 60.5, cf: 28 },
  { id: 7, x: 70.5, cf: 30 },
];
const round = (value: number, places = 1) => Number(value.toFixed(places));

export default function LessThanOgiveTargetLesson10107({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [points, setPoints] = useState<Point[]>(defaults);
  const [showGuide, setShowGuide] = useState(true);
  const [showGrid, setShowGrid] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [draftKey,setDraftKey]=useState<string|null>(null),[draft,setDraft]=useState(''),[editError,setEditError]=useState('');
  const [actions, setActions] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const {total,half,median:exactMedian,medianRange,valid}=lessThanModel(points);
  const median=exactMedian===null?'—':round(exactMedian);
  const dragFrame=useRef<{min:number;max:number;ymax:number}|null>(null);
  const minX=dragFrame.current?.min??points[0].x,maxX=dragFrame.current?.max??points[points.length-1].x,ymax=dragFrame.current?.ymax??lessAxisMax(total);
  const sx=(x:number)=>55+(x-minX)/(maxX-minX)*630,sy=(cf:number)=>300-cf/ymax*245;
  const path = points
    .map((point, index) => `${index ? "L" : "M"}${sx(point.x)},${sy(point.cf)}`)
    .join(" ");
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const updatePoint=(id:number,next:Partial<Point>)=>setPoints(current=>moveLessPoint(current,id,next));
  const editField=(id:number,field:'x'|'cf',text:string)=>{setDraftKey(`${field}-${id}`);setDraft(text);const value=text.trim()===''?NaN:Number(text),i=points.findIndex(p=>p.id===id),previous=points[i-1],following=points[i+1];const okay=Number.isFinite(value)&&(field==='x'?value>(previous?.x??-Infinity)&&value<(following?.x??Infinity):Number.isInteger(value)&&value>=(previous?.cf??0)&&value<=(following?.cf??1000000000)&&(i>0||value===0));if(!okay){setEditError(field==='x'?'Boundaries must stay strictly increasing.':'Use a nondecreasing whole cumulative count; the first count must stay zero.');return;}setEditError('');act(()=>setPoints(current=>current.map(p=>p.id===id?{...p,[field]:value}:p)));};
  const dragPoint=(event:PointerEvent<SVGCircleElement>,point:Point)=>{if(dragging!==point.id||!svgRef.current)return;const m=svgRef.current.getScreenCTM();if(!m)return;const pt=new DOMPoint(event.clientX,event.clientY).matrixTransform(m.inverse());updatePoint(point.id,{x:round(minX+(pt.x-55)/630*(maxX-minX),Math.max(1,-Math.floor(Math.log10((maxX-minX)/1000)))),cf:(300-pt.y)/245*ymax});};
  const exportPng = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    const sourceNodes = [svg, ...svg.querySelectorAll('*')];
    const copiedNodes = [clone, ...clone.querySelectorAll('*')];
    sourceNodes.forEach((node, index) => {
      const style = getComputedStyle(node);
      const properties = ['fill', 'stroke', 'stroke-width', 'stroke-dasharray', 'opacity', 'font-size', 'font-family', 'font-weight', 'font-style', 'text-anchor', 'visibility', 'display'];
      copiedNodes[index].setAttribute('style', properties.map(name => `${name}:${style.getPropertyValue(name)}`).join(';'));
    });
    clone.setAttribute('width', '740');
    clone.setAttribute('height', '345');
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    const source = new XMLSerializer().serializeToString(clone);
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1480;
      canvas.height = 690;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.fillStyle = "#06182f";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const anchor = document.createElement("a");
      anchor.download = "less-than-ogive.png";
      anchor.href = canvas.toDataURL("image/png");
      anchor.click();
    };
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
    setActions((value) => value + 1);
  };
  const reset = () =>
    act(() => {
      setDraftKey(null);setEditError('');
      dragFrame.current=null;
      setPoints(defaults);
      setShowGuide(true);
      setShowGrid(false);
      setDragging(null);
    });
  const addRow = () =>
    act(() =>
      setPoints((current) => [
        ...current,
        {
          id: Math.max(...current.map((point) => point.id)) + 1,
          x: round((current.at(-1)?.x ?? 0) + 10),
          cf: current.at(-1)?.cf ?? 0,
        },
      ]),
    );

  return (
    <section
      className="lto10107-page"
      data-testid="school-mockup-0781"
      data-object-model="dedicated-less-than-ogive-median-read-off-engine"
      data-points={points.map((point) => `${point.x}:${point.cf}`).join(",")}
      data-total={total}
      data-half={half}
      data-median={median}
      data-exact-median={exactMedian??"none"} data-valid={String(valid)} data-median-range={medianRange?.join(",")??"none"} data-y-max={ymax}
      data-show-guide={String(showGuide)}
      data-show-grid={String(showGrid)}
      data-actions={actions}
    >
      <div className="lto10107-hero">
        <small>CLASS 10 · STATISTICS</small>
        <h1>Less-Than Ogive</h1>
        <p>
          Less-Than Ogive is a school mathematics idea in Statistics. It helps
          students model data, functions, curves, proofs, and 3D directions.
        </p>
        <p>
          We use related ideas in graphs, design, surveys, navigation, and
          measurement.
        </p>
        <nav>
          <span>◷ 18 min</span>
          <span>INTERMEDIATE</span>
          <span>CONCEPT</span>
          <span>statistics</span>
        </nav>
      </div>

      <main className="lto10107-lab">
        <div className="lto10107-lab-heading">
          <div>
            <small>INTERACTIVE LAB</small>
            <h2>Data balance lab</h2>
            <p>
              Edit the table or drag points. The ogive updates instantly. Read
              the median at <i>N/2</i>.
            </p>
          </div>
          <button onClick={reset}>
            <RotateCcw /> Reset lab
          </button>
        </div>
        <div className="lto10107-grid">
          <div className="lto10107-left">
            <section className="lto10107-table">
              <h3>
                DATA TABLE <span>(Editable)</span>
              </h3>
              {editError&&<p role="alert">{editError} The graph retains the last valid values.</p>}
              <table>
                <thead>
                  <tr>
                    <th>Upper class boundary (x)</th>
                    <th>Less-than cumulative frequency (F(&lt; x))</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.id}>
                      <td>
                        <label>
                          <GripVertical />
                          <input
                            aria-label={`Upper boundary row ${point.id}`}
                            type="number"
                            step="0.5"
                            value={draftKey===`x-${point.id}`?draft:point.x}
                            onFocus={()=>{setDraftKey(`x-${point.id}`);setDraft(String(point.x));}} onBlur={()=>setDraftKey(null)}
                            onChange={e=>editField(point.id,'x',e.target.value)}
                          />
                        </label>
                      </td>
                      <td>
                        <input
                          aria-label={`Cumulative frequency row ${point.id}`}
                          type="number"
                          min="0"
                          max="1000000000"
                          value={draftKey===`cf-${point.id}`?draft:point.cf}
                          onFocus={()=>{setDraftKey(`cf-${point.id}`);setDraft(String(point.cf));}} onBlur={()=>setDraftKey(null)}
                          onChange={e=>editField(point.id,'cf',e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <footer>
                Total frequency, <i>N</i> = <b>{total}</b>
                <button disabled={points.length>=13} onClick={addRow}>
                  <Plus /> Add row
                </button>
              </footer>
            </section>
            <details className="lto10107-custom"><summary>Edit grouped data</summary><GroupedDataEditor data={{bounds:points.map(point=>point.x),frequencies:points.slice(1).map((point,i)=>point.cf-points[i].cf)}} defaults={{bounds:defaults.map(point=>point.x),frequencies:defaults.slice(1).map((point,i)=>point.cf-defaults[i].cf)}} onChange={data=>act(()=>{let cf=0;setPoints(data.bounds.map((x,i)=>({id:i+1,x,cf:i===0?0:(cf+=data.frequencies[i-1])})));})}/></details>
            <section className="lto10107-formula">
              <h3>OGIVE FORMULA</h3>
              <strong><MathExpression value={String.raw`F(<x)=\sum_{i=1}^{k}f_i`}/></strong>
              <p>
                Cumulative total of frequencies up to upper boundary <i>x</i>.
              </p>
            </section>
          </div>
          <div className="lto10107-right">
            <section className="lto10107-chart">
              <div className="lto10107-chart-heading">
                <h3>LESS-THAN OGIVE ⓘ</h3>
                <label>
                  <input
                    type="checkbox"
                    checked={showGuide}
                    onChange={(event) =>
                      act(() => setShowGuide(event.target.checked))
                    }
                  />{" "}
                  Show N/2 guide
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(event) =>
                      act(() => setShowGrid(event.target.checked))
                    }
                  />{" "}
                  Show grid
                </label>
                <button onClick={exportPng}>
                  <Download /> Export PNG
                </button>
              </div>
              <svg
                ref={svgRef}
                viewBox="0 0 740 345"
                aria-label="Interactive less-than ogive"
              >
                <rect width="740" height="345" fill="#06182f" />
                <text x="370" y="342" textAnchor="middle">Upper class boundary, x</text><text transform="translate(15 175) rotate(-90)" textAnchor="middle">Less-than cumulative frequency</text>
                <g className={showGrid ? "grid visible" : "grid"}>
                  {Array.from({length:8},(_,i)=>Number((i*ymax/7).toFixed(2))).map((v) => (
                    <g key={`h${v}`}><text x="43" y={sy(v)+4} textAnchor="end">{v>=1000?`${Number((v/1000).toPrecision(3))}k`:v}</text><line
                      x1="55"
                      y1={sy(v)}
                      x2="700"
                      y2={sy(v)}
                    /></g>
                  ))}
                  {points.map((p) => (
                    <line
                      key={`v${p.id}`}
                      x1={sx(p.x)}
                      y1="45"
                      x2={sx(p.x)}
                      y2="300"
                    />
                  ))}
                </g>
                <line x1="55" y1="300" x2="705" y2="300" />
                <line x1="55" y1="305" x2="55" y2="40" />
                <path d={path} />
                {showGuide && valid && (
                  <g className="guide">
                    <line x1="55" y1={sy(half)} x2={sx(exactMedian??minX)} y2={sy(half)} />
                    <line
                      x1={sx(exactMedian??minX)}
                      y1={sy(half)}
                      x2={sx(exactMedian??minX)}
                      y2="300"
                    />
                    <text x="70" y={sy(half) - 10}>
                      N/2 = {half}
                    </text>
                    <rect x={sx(exactMedian!)>500?sx(exactMedian!)-190:sx(exactMedian!)+20} y={sy(half)+90>300?sy(half)-85:sy(half)+15} width="175" height="70" rx="9" fill="#020b1cee" stroke="#456078"/>
                    <text x={(sx(exactMedian!)>500?sx(exactMedian!)-190:sx(exactMedian!)+20)+12} y={(sy(half)+90>300?sy(half)-85:sy(half)+15)+22}>Median read-off</text>
                    <text x={(sx(exactMedian!)>500?sx(exactMedian!)-190:sx(exactMedian!)+20)+25} y={(sy(half)+90>300?sy(half)-85:sy(half)+15)+53}>x = {median}</text>

                  </g>
                )}
                {points.map((point) => (
                  <g key={point.id}>
                    <circle
                      data-ogive-id={point.id} data-x={point.x} data-cf={point.cf}
                      role="slider"
                      tabIndex={0}
                      aria-label={`Ogive point ${point.id}`}
                      aria-valuemin={points[Math.max(0, point.id - 2)]?.cf ?? 0}
                      aria-valuemax={points[point.id]?.cf ?? 1000000000}
                      aria-valuenow={point.cf}
                      cx={sx(point.x)}
                      cy={sy(point.cf)}
                      r="6"
                      onPointerDown={(event) => {
                        dragFrame.current={min:minX,max:maxX,ymax};
                        event.currentTarget.setPointerCapture(event.pointerId);
                        act(() => setDragging(point.id));
                      }}
                      onPointerMove={(event) => dragPoint(event, point)}
                      onPointerUp={event=>{dragPoint(event,point);dragFrame.current=null;act(()=>setDragging(null));}}
                      onPointerCancel={()=>{dragFrame.current=null;act(()=>setDragging(null));}}
                      onKeyDown={(event) => {
                        if(event.key.startsWith('Arrow')){event.preventDefault();event.stopPropagation();}
                        if (event.key === "ArrowUp")
                          act(() =>
                            updatePoint(point.id, { cf: point.cf + 1 }),
                          );
                        if (event.key === "ArrowDown")
                          act(() =>
                            updatePoint(point.id, { cf: point.cf - 1 }),
                          );
                        if (event.key === "ArrowRight")
                          act(() =>
                            updatePoint(point.id, { x: point.x + 0.5 }),
                          );
                        if (event.key === "ArrowLeft")
                          act(() =>
                            updatePoint(point.id, { x: point.x - 0.5 }),
                          );
                      }}
                    />
                    <text x={sx(point.x) - 10} y="325">
                      {point.x}
                    </text>
                  </g>
                ))}
              {showGuide&&valid&&<g className="lto10107-median-marker" data-median-marker="true"><circle cx={sx(exactMedian!)} cy={sy(half)} r="8"/><circle cx={sx(exactMedian!)} cy={sy(half)} r="4"/></g>}
              </svg>
            </section>
            <div className="lto10107-read">
              <section>
                <Calculator />
                <div>
                  <b>Median (read-off)</b>
                  <strong>{median}</strong>
                </div>
                <span>
                  <i>N</i> = {total}
                  <br />
                  <i>N</i>/2 = {half}
                </span>
              </section>
              <aside>
                <Lightbulb />
                <div>
                  <b>How to read median</b>
                  <p>
                    {valid?"Draw a horizontal line at N/2 to meet the ogive, then drop a vertical line to the x-axis. The x value is the median.":"No observations (N = 0): the median is undefined."}
                    {medianRange&&medianRange[1]>medianRange[0]&&` A flat median interval is [${medianRange.join(", ")}]; the read-off uses its lower endpoint.`}
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>


    </section>
  );
}
