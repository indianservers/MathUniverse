import {useState} from "react";
import {RotateCcw} from "lucide-react";
import type {LessonAdapterProps} from "../types";
import {comparisonDefault,compareModels} from "./modelComparisonLessonModel";
import {LessonTopicStudyBoard} from "../components/LessonTopicStudyBoard";
import "./ModelComparisonLesson498.css";
const kinds=["linear","quadratic","exponential"] as const;
type Kind=typeof kinds[number];
const format=(value:number,digits=3)=>Number.isFinite(value)?value.toFixed(digits):"—";
export default function ModelComparisonLesson498({resetToken,onInteraction}:LessonAdapterProps){return <CompareActivity key={resetToken} onInteraction={onInteraction}/>;}
function CompareActivity({onInteraction}:Pick<LessonAdapterProps,"onInteraction">){
 const [points,setPoints]=useState(comparisonDefault),[choice,setChoice]=useState<Kind>("exponential"),[checked,setChecked]=useState(false);
 const models=compareModels(points),selected=models[choice];
 const recommended=[...kinds].filter(kind=>models[kind].valid).sort((a,b)=>models[a].score-models[b].score)[0];
 const xs=Array.from({length:61},(_,i)=>1+9*i/60),ys=[0,...points.map(p=>p.y),...kinds.flatMap(kind=>models[kind].valid?xs.map(models[kind].predict):[])].filter(Number.isFinite);
 const low=Math.min(...ys),high=Math.max(...ys),px=(x:number)=>20+(x-1)/9*210,py=(y:number)=>160-(y-low)/(high-low||1)*140;
 const edit=(index:number,raw:string)=>{const value=Number(raw);if(!Number.isFinite(value))return;setPoints(p=>p.map((row,i)=>i===index?{...row,y:value}:row));setChecked(false);onInteraction();};
 const load=(kind:"growth"|"linear"|"quadratic")=>{setPoints(kind==="growth"?comparisonDefault:comparisonDefault.map((p,i)=>({x:p.x,y:(kind==="linear"?2+3*p.x:2+p.x+.7*p.x*p.x)+(i%2?.2:-.2)})));setChecked(false);onInteraction();};
 const reset=()=>{load("growth");setChoice("exponential");};
 return <div className="mc498" data-testid="statistics-mockup-0461" data-target-family="statistics-and-regression" data-selected={choice} data-recommended={recommended}>
  <header><div><span>DATA AND PROBABILITY · STATISTICS AND REGRESSION</span><h2>Model Comparison</h2><p>Compare fitted curves and errors for the same editable dataset.</p></div></header>
  <div className="mc498-presets" role="group" aria-label="Dataset presets"><b>Try a dataset</b><button onClick={()=>load("growth")}>Growth data</button><button onClick={()=>load("linear")}>Linear data</button><button onClick={()=>load("quadratic")}>Quadratic data</button></div>
  <section className="mc498-work"><aside><h3>Dataset (editable)</h3><table><thead><tr><th>x</th><th>y</th></tr></thead><tbody>{points.map((point,index)=><tr key={index}><td>{point.x.toFixed(1)}</td><td><input type="number" step="any" aria-label={`Comparison y ${index+1}`} value={point.y} onChange={e=>edit(index,e.target.value)}/></td></tr>)}</tbody></table><button onClick={reset}><RotateCcw size={14}/> Reset</button></aside>
   {kinds.map((kind,index)=><article key={kind} className="mc498-model" data-model={kind} data-valid={models[kind].valid} data-rmse={models[kind].rmse} data-score={models[kind].score}><h3>{kind} model</h3><div className="mc498-mini"><svg viewBox="0 0 250 180" role="img" aria-label={`${kind} model chart`}><line x1="20" x2="230" y1="160" y2="160" stroke="#94a3b8"/>{models[kind].valid&&<polyline aria-label={`${kind} fitted curve`} points={xs.map(x=>`${px(x)},${py(models[kind].predict(x))}`).join(" ")} fill="none" stroke={["#d97706","#7c3aed","#059669"][index]} strokeWidth="2"/>}{points.map(p=><circle key={p.x} cx={px(p.x)} cy={py(p.y)} r="4" fill="#176fc5"/>)}</svg></div><p>R² <b>{format(models[kind].r2)}</b></p><p>RMSE <b>{format(models[kind].rmse,2)}</b></p><p>Score <b>{format(models[kind].score,2)}</b></p>{!models[kind].valid&&<p>Exponential fitting requires positive y-values.</p>}<label><input type="radio" aria-label={`Select ${kind} model`} name="comparison-model" checked={choice===kind} onChange={()=>{setChoice(kind);setChecked(false);onInteraction();}}/> Select</label></article>)}
  </section>
  <section className="mc498-selection"><h3>Evidence-based model selection</h3><p>Selected model: <b>{choice}</b></p><p>Selected R² = {format(selected.r2)} · RMSE = {format(selected.rmse)}</p><p>Teaching score = SSE + 2k, where k is the number of fitted coefficients. Compare lower scores alongside the residual pattern and intended use.</p></section>
  <section className="mc498-lower"><article><h3>Model fit</h3><p>R² describes explained variation; RMSE measures error in the original y units. Every chart uses the same axes.</p></article><article><h3>Worked example</h3><p>The current lowest score belongs to <b>{recommended}</b>. Compare its curve with the data and the other fitted models.</p></article><article><h3>Misconception guard</h3><p>A larger R² alone does not settle the choice. Account for complexity, residual patterns, and extrapolation risk.</p></article></section>
  <section className="mc498-practice"><h3>Practice · Model Comparison</h3><p>Select the model with the lowest teaching score for the current dataset, then check your choice.</p><button onClick={()=>{setChecked(true);onInteraction();}}>Check answer</button>{checked&&<p role="status" className={choice===recommended?"correct":"incorrect"}>{choice===recommended?`Correct: ${recommended} has the lowest score.`:`Try again: compare the scores. ${recommended} has the lowest score.`}</p>}</section>
  <footer><button onClick={reset}><RotateCcw size={14}/> Reset lesson</button></footer>
  <LessonTopicStudyBoard lessonId={498} alwaysVisible onInteraction={onInteraction}/>
 </div>;
}
