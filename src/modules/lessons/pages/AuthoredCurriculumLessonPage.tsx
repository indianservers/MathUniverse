import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useParams,useLocation,Navigate } from "react-router-dom";
import ConceptVisualization from "../authored/ConceptVisualization";
import {publicLessonLevel,learnerText} from '../lessonPresentation';
import { LessonSectionNav, type LessonSection } from "../components/LessonSectionJourney";
import index from "../authored/authoredLessonIndex.generated.json";
import type { AuthoredLesson, AuthoredPractice, LessonModelResult } from "../authored/authoredLessonTypes";
import { checkAuthoredAnswer, evaluateAuthoredModel } from "../authored/authoredLessonModels";

const batchFiles=import.meta.glob<{default:{lessons:AuthoredLesson[]}}>("../authored/batches/*.generated.json");
export function getAuthoredCurriculumLesson(id: number) { return index.lessons.find(x=>x.lessonId===id); }
export default function AuthoredCurriculumLessonPage({lessonId}:{lessonId?:number}) {
  const {lessonSlug}=useParams();
  const {pathname}=useLocation();
  const id=lessonId??Number(lessonSlug?.split("-")[0]);
  const lesson=getAuthoredCurriculumLesson(id);
  if(!lesson)return <main className="p-8"><h1 className="text-2xl font-black">Lesson not found</h1><Link to="/lessons">Browse lessons</Link></main>;
  if(pathname!==lesson.route)return <Navigate to={lesson.route} replace/>;
  return <AuthoredLessonLoader key={id} id={id} batch={lesson.batch} title={lesson.title}/>;
}
function AuthoredLessonLoader({id,batch,title}:{id:number;batch:number;title:string}) {
  const [lesson,setLesson]=useState<AuthoredLesson|null>(null);
  const [error,setError]=useState("");
  useEffect(()=>{
    let active=true;
    const load=batchFiles[`../authored/batches/batch-${String(batch).padStart(2,"0")}.generated.json`];
    if(!load){setError("This lesson is unavailable.");return;}
    load().then(module=>{if(!active)return;const found=module.default.lessons.find(item=>item.lessonId===id);if(found)setLesson(found);else setError("This lesson could not be found.");}).catch(()=>{if(active)setError("The lesson could not load. Reload the page to retry.");});
    return ()=>{active=false;};
  },[id,batch]);
  if(error)return <main className="p-8"><h1 className="text-2xl font-black">{title}</h1><p role="alert">{error}</p><Link to="/lessons">Browse lessons</Link></main>;
  if(!lesson)return <main className="p-8"><p role="status">Loading lesson {id}…</p></main>;
  return <AuthoredLessonContent lesson={lesson}/>;
}
function AuthoredLessonContent({lesson}:{lesson:AuthoredLesson}) {
  useEffect(()=>{document.title=`${lesson.title} | Math Universe`;const old=document.querySelector<HTMLLinkElement>('link[rel="canonical"]');const link=old??document.createElement("link");link.rel="canonical";link.href=window.location.origin+lesson.route;if(!old)document.head.appendChild(link);return ()=>{if(!old)link.remove();};},[lesson.title,lesson.route]);
  const [section,setSection]=useState<LessonSection>("interaction");
  const initial=Object.fromEntries(lesson.interactive.controls.map(x=>[x.key,x.initial]));
  const [values,setValues]=useState<Record<string,number>>(initial);
  const calculation=useMemo(()=>{
    try {
      for(const control of lesson.interactive.controls){const value=values[control.key];if(!Number.isFinite(value)||value<control.min||value>control.max||(control.step===1&&!Number.isInteger(value)))throw new Error(`${control.label}: choose ${control.step===1?"a whole number":"a number"} from ${control.min} to ${control.max}.`);}
      return {result:evaluateAuthoredModel(lesson.interactive.model,values),error:""};
    } catch(error) {return {result:null,error:error instanceof Error?error.message:"Invalid inputs"};}
  },[lesson,values]);
  return <main className="mx-auto max-w-6xl space-y-5 px-4 py-6 pb-28 text-slate-900 dark:text-slate-100 md:px-8">
    <header className="space-y-3"><Link to="/lessons" className="text-sm font-bold text-cyan-700 dark:text-cyan-300">Browse lessons</Link><p className="text-sm font-bold">Lesson {lesson.lessonId} · {publicLessonLevel(lesson.level)}</p><h1 className="text-3xl font-black">{lesson.title}</h1><p className="max-w-4xl text-base leading-7">{lesson.summary}</p></header>
    <LessonSectionNav active={section} onChange={setSection} lessonId={lesson.lessonId}/>
    {section==="interaction"&&<section aria-label="Interactive tool" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/15 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-black">{lesson.interactive.title}</h2><button onClick={()=>setValues(initial)} className="rounded-xl border px-4 py-2 font-bold">Reset tool</button></div>
      <div className="grid gap-4 sm:grid-cols-2">{lesson.interactive.controls.map(control=><label key={control.key} className="space-y-2 text-sm font-bold">{control.label}<input aria-label={control.label} type="number" min={control.min} max={control.max} step={control.step} value={Number.isFinite(values[control.key])?values[control.key]:""} onChange={event=>setValues({...values,[control.key]:event.target.value===""?NaN:Number(event.target.value)})} className="block w-full rounded-lg border border-slate-300 bg-transparent p-3 dark:border-white/20"/><input aria-label={`${control.label} slider`} type="range" min={control.min} max={control.max} step={control.step} disabled={control.min===control.max} value={Number.isFinite(values[control.key])?values[control.key]:control.initial} onChange={event=>setValues({...values,[control.key]:Number(event.target.value)})} className="w-full"/></label>)}</div>
      {calculation.error?<p role="alert" className="rounded-lg bg-red-50 p-4 text-red-800">{calculation.error}</p>:calculation.result&&<><ConceptVisualization model={lesson.interactive.model} values={values} result={calculation.result} onChange={patch=>setValues(previous=>({...previous,...patch}))}/><ModelReadout result={calculation.result}/></>}
      <div><h3 className="font-black">Investigate</h3><ul className="list-disc space-y-2 pl-5">{lesson.interactive.prompts.map(x=><li key={x}>{x}</li>)}</ul></div><p className="text-sm text-slate-600 dark:text-slate-300">Tool conditions: {learnerText(lesson.interactive.limitations)}</p>
    </section>}
    {section==="learn"&&<section aria-label="Learn" className="space-y-6"><div className="rounded-2xl bg-cyan-50 p-5 dark:bg-cyan-400/10"><h2 className="font-black">Before you start</h2><p>{lesson.prerequisites.join("; ")}</p><h3 className="mt-4 font-bold">Learning goals</h3><ul className="mt-2 list-disc space-y-2 pl-5">{lesson.objectives.map(goal=><li key={goal}>{goal}</li>)}</ul></div>{lesson.sections.map(block=><article key={block.heading} className="space-y-3 rounded-2xl border bg-white p-5 dark:border-white/10 dark:bg-slate-950"><h2 className="text-xl font-black">{block.heading}</h2>{block.paragraphs.map((text,i)=><p key={i} className="text-base leading-8">{text}</p>)}</article>)}<article className="rounded-2xl bg-amber-50 p-5 dark:bg-amber-300/10"><h2 className="font-black">Remember</h2><p className="mt-2 text-lg">{lesson.memoryCue}</p></article>{lesson.misconceptions.map(item=><article key={item.mistake} className="rounded-2xl border p-5"><h2 className="font-black">Common mistake: {item.mistake}</h2><p className="mt-2 leading-7">{item.correction}</p></article>)}</section>}
    {section==="examples"&&<section aria-label="Worked examples" className="space-y-4">{lesson.examples.map((example,i)=><article key={i} className="space-y-3 rounded-2xl border bg-white p-5 dark:border-white/10 dark:bg-slate-950"><h2 className="text-lg font-black">Example {i+1}: {example.prompt}</h2><ol className="list-decimal space-y-2 pl-6">{example.steps.map((step,j)=><li key={j} className="leading-7">{step}</li>)}</ol><p className="rounded-xl bg-cyan-50 p-3 font-bold dark:bg-cyan-400/10">Answer: {example.answer}</p></article>)}</section>}
    {section==="formulas"&&<section aria-label="Formulas" className="space-y-4">{lesson.formulas.map((formula,i)=><article key={i} className="space-y-3 rounded-2xl border p-5"><h2 className="break-words text-xl font-black">{formula.expression}</h2><p className="leading-7">{formula.meaning}</p><p className="text-sm font-semibold">Conditions: {formula.restriction}</p></article>)}</section>}
    {section==="practice"&&<section aria-label="Practice" className="space-y-4"><h2 className="text-xl font-black">Try first, then check</h2>{lesson.practice.map((item,i)=><PracticeCard key={i} item={item} number={i+1}/>)}</section>}
    {lesson.sourceUrl&&<footer className="border-t pt-4 text-sm"><a href={lesson.sourceUrl} target="_blank" rel="noreferrer" className="font-bold text-cyan-700 dark:text-cyan-300">Further reading</a></footer>}
  </main>;
}
function ModelReadout({result}:{result:LessonModelResult}) {
  return <div className="space-y-4" aria-live="polite"><h3 className="text-lg font-black">{result.heading}</h3><p className="break-words rounded-xl bg-cyan-50 p-3 font-bold dark:bg-cyan-400/10">{result.formula}</p><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{result.outputs.map(x=><div key={x.label} className="rounded-xl bg-slate-100 p-4 dark:bg-white/5"><p className="text-sm">{x.label}</p><strong className="break-words text-xl">{x.value}</strong></div>)}</div>
    {result.plot&&<ModelPlot plot={result.plot}/>}
    <ol className="list-decimal space-y-2 pl-6">{result.steps.map((x,i)=><li key={i}>{x}</li>)}</ol>
    {result.table&&<div className="overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Calculation table</caption><thead><tr>{result.table.headers.map(x=><th key={x} className="border-b p-3">{x}</th>)}</tr></thead><tbody>{result.table.rows.map((row,i)=><tr key={i}>{row.map((x,j)=><td key={j} className="border-b border-slate-200 p-3 dark:border-white/10">{x}</td>)}</tr>)}</tbody></table></div>}
  </div>;
}
function ModelPlot({plot}:{plot:NonNullable<LessonModelResult["plot"]>}) {
  const diagram=(label:string,children:ReactNode)=><svg role="img" aria-label={label} viewBox="0 0 460 240" className="max-h-72 w-full">{children}</svg>;
  const polygon=(points:string)=><polygon points={points} fill="#cffafe" stroke="#0891b2" strokeWidth="3"/>;
  if(plot.kind==="parallelogram"){const[a,b,angle]=plot.values,t=angle*Math.PI/180,rawDx=b*Math.cos(t),rawDy=b*Math.sin(t),left=Math.min(0,rawDx),right=Math.max(a,a+rawDx),s=Math.min(320/(right-left),170/rawDy),origin=230-(right+left)*s/2,dx=rawDx*s,dy=rawDy*s;return diagram(`Parallelogram with adjacent sides ${a}, ${b} and angle ${angle} degrees`,<>{polygon(`${origin},200 ${origin+a*s},200 ${origin+a*s+dx},${200-dy} ${origin+dx},${200-dy}`)}<path d={`M${origin} 200 L${origin+a*s+dx} ${200-dy} M${origin+a*s} 200 L${origin+dx} ${200-dy}`} stroke="#7c3aed" strokeDasharray="5 4"/><text x="40" y="225" fill="currentColor">Side {a}; side {b}; angle {angle}°</text></>);}
  if(plot.kind==="kite"){const[top,bottom,half]=plot.values,s=Math.min(180/(top+bottom),300/(2*half)),base=20+(top+bottom)*s;return diagram("Kite with perpendicular diagonals and a vertical symmetry axis",<>{polygon(`230,20 ${230+half*s},${20+top*s} 230,${base} ${230-half*s},${20+top*s}`)}<path d={`M230 20 V${base} M${230-half*s} ${20+top*s} H${230+half*s}`} stroke="#7c3aed" strokeDasharray="5 4"/></>);}
  if(plot.kind==="trapezium"){const[a,b,h]=plot.values,s=260/Math.max(a,b,h*2);return diagram("Trapezium with two parallel horizontal bases and perpendicular height",<>{polygon(`${230-a*s/2},200 ${230+a*s/2},200 ${230+b*s/2},${200-h*s} ${230-b*s/2},${200-h*s}`)}<path d={`M230 200 V${200-h*s}`} stroke="#7c3aed" strokeDasharray="5 4"/><text x="20" y="225" fill="currentColor">Bases {a}, {b}; height {h}</text></>);}
  if(plot.kind==="point"||plot.kind==="two-points"){const[x,y,u,w]=plot.values;return diagram("Cartesian axes and the selected coordinates",<><path d="M20 120 H440 M230 15 V225" stroke="currentColor"/>{[[x,y],...(u===undefined?[]:[[u,w]])].map(([px,py],i)=><g key={i}><circle cx={230+px*10} cy={120-py*10} r="5" fill="#0891b2"/><text x={238+px*10} y={115-py*10} fill="currentColor" fontSize="13">({px},{py})</text></g>)}</>);}
  if(plot.kind==="triangle"){const[a,b,c,k]=plot.values,px=(b*b+c*c-a*a)/(2*c),py=Math.sqrt(Math.max(0,b*b-px*px)),left=Math.min(0,px),width=Math.max(c,px)-left,s=Math.min(170/width,170/py)/Math.max(1,k),origin1=25-left*s,origin2=245-left*s*k;return diagram("Two triangles with corresponding sides and the selected scale factor",<>{polygon(`${origin1},195 ${origin1+c*s},195 ${origin1+px*s},${195-py*s}`)}{polygon(`${origin2},195 ${origin2+c*s*k},195 ${origin2+px*s*k},${195-py*s*k}`)}<text x="25" y="225" fill="currentColor">Original</text><text x="245" y="225" fill="currentColor">Scale {k}</text></>);}
  if(plot.kind==="bpt"){const[a,b]=plot.values,t=a/(a+b),yl=20+180*t;return diagram("Triangle cut by a line parallel to its base",<>{polygon("230,20 50,200 410,200")}<line x1={230-180*t} y1={yl} x2={230+180*t} y2={yl} stroke="#7c3aed" strokeWidth="3"/><text x="20" y="225" fill="currentColor">Side fraction {Number(t.toFixed(3))}</text></>);}
  if(plot.kind==="chord"){const[r,d,h]=plot.values,s=80/r;return diagram("Circle, chord and perpendicular from the centre",<><circle cx="230" cy="115" r="80" fill="#cffafe" stroke="#0891b2" strokeWidth="3"/><line x1={230-h*s} y1={115+d*s} x2={230+h*s} y2={115+d*s} stroke="#7c3aed" strokeWidth="3"/><line x1="230" y1="115" x2="230" y2={115+d*s} stroke="currentColor" strokeDasharray="4 4"/><text x="20" y="225" fill="currentColor">Radius {r}; perpendicular distance {d}</text></>);}
  if(plot.kind==="cone"){const[r,h]=plot.values,s=140/(r+h),ry=r*s,hy=h*s;return diagram("Cone showing radius, perpendicular height and slant edge",<><path d={`M${230-ry} 195 L230 ${195-hy} L${230+ry} 195`} fill="#cffafe" stroke="#0891b2" strokeWidth="3"/><ellipse cx="230" cy="195" rx={ry} ry={ry/4} fill="#cffafe" stroke="#0891b2"/><path d={`M230 ${195-hy} V195 H${230+ry}`} stroke="#7c3aed" strokeDasharray="5 4"/><text x="20" y="225" fill="currentColor">r={r}, h={h}</text></>);}
  if(plot.kind==="line"){const[m,k]=plot.values,ys=[k,5*m+k],lo=Math.min(0,...ys),hi=Math.max(1,...ys),Y=(y:number)=>190-(y-lo)/(hi-lo)*160;return diagram("Line graph of the selected affine rule on inputs zero to five",<><path d={`M35 ${Y(0)} H435 M35 20 V200`} stroke="currentColor"/><line x1="35" y1={Y(k)} x2="435" y2={Y(5*m+k)} stroke="#0891b2" strokeWidth="3"/><text x="35" y="225" fill="currentColor">x=0</text><text x="410" y="225" fill="currentColor">x=5</text></>);}
  if(plot.kind==="square-grid"){const n=plot.values[0],size=240/n;return <svg role="img" aria-label={`${n} by ${n} array with ${n*n} cells`} viewBox="0 0 260 260" className="mx-auto max-h-72 w-full">{Array.from({length:n*n},(_,i)=><rect key={i} x={10+(i%n)*size} y={10+Math.floor(i/n)*size} width={size-1} height={size-1} fill="#0891b2" stroke="white"/>)}</svg>;}
  const max=Math.max(1,...plot.values.map(Math.abs)),width=420/Math.max(1,plot.values.length);
  return <svg role="img" aria-label={`Comparison of values: ${plot.values.join(", ")}`} viewBox="0 0 460 220" className="max-h-64 w-full"><line x1="15" y1="180" x2="450" y2="180" stroke="currentColor"/>{plot.values.map((value,i)=><g key={i}><rect x={20+i*width} y={180-Math.abs(value)/max*150} width={Math.max(2,width-5)} height={Math.abs(value)/max*150} fill={value<0?"#dc2626":"#0891b2"}/><text x={20+i*width+width/2} y="201" textAnchor="middle" fill="currentColor" fontSize="11">{plot.labels?.[i]??i+1}</text></g>)}</svg>;
}
function PracticeCard({item,number}:{item:AuthoredPractice;number:number}) {
  const [answer,setAnswer]=useState("");const[checked,setChecked]=useState(false);const[hint,setHint]=useState(false);
  const correct=answer.trim()!==""&&checkAuthoredAnswer(answer,item.expected,item.tolerance);
  return <article className="space-y-3 rounded-2xl border bg-white p-5 dark:border-white/10 dark:bg-slate-950"><h3 className="font-black">{number}. {item.prompt}</h3><label className="block text-sm font-bold">Your answer<input value={answer} onChange={e=>{setAnswer(e.target.value);setChecked(false);}} className="mt-1 block w-full max-w-md rounded-lg border border-slate-300 bg-transparent p-3 dark:border-white/20"/></label><div className="flex flex-wrap gap-3"><button disabled={!answer.trim()} onClick={()=>setChecked(true)} className="rounded-xl bg-cyan-700 px-4 py-2 font-bold text-white disabled:opacity-50">Check answer</button><button onClick={()=>setHint(!hint)} className="rounded-xl border px-4 py-2 font-bold">{hint?"Hide hint":"Show hint"}</button></div>{hint&&<p>{item.hint}</p>}{checked&&<p role="status" className={correct?"font-bold text-emerald-700 dark:text-emerald-300":"font-bold text-amber-800 dark:text-amber-200"}>{correct?"Correct. Explain the reasoning before moving on.":"Try again. Use the hint or compare with the worked solution."}</p>}<details><summary className="cursor-pointer font-bold">Show worked solution</summary><ol className="mt-3 list-decimal space-y-2 pl-6">{item.steps.map((x,i)=><li key={i}>{x}</li>)}</ol><p className="mt-2 font-bold">Answer: {item.answer}</p></details></article>;
}
