import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChallengeBox } from '../mockup/studioLabKit';
import { masteryCourses } from './masteryContent';

export function GuidedCourse({studioId}:{studioId:string}) {
 const course=masteryCourses[studioId];
 const [params]=useSearchParams();
 const requestedLesson=params.get('lesson');
 const [selected,setSelected]=useState(()=>Math.max(0,course?.units.findIndex(unit=>unit.id===requestedLesson)??0)),[choice,setChoice]=useState<string>('');
 useEffect(()=>{const index=course?.units.findIndex(unit=>unit.id===requestedLesson)??-1;if(index>=0){setSelected(index);setChoice('');}},[course,requestedLesson]);
 const [solved,setSolved]=useState<string[]>(()=>{try{const x=JSON.parse(localStorage.getItem(`guided-exercises:v1:${studioId}`)||'[]');return Array.isArray(x)?x.filter(v=>typeof v==='string'):[];}catch{return [];}});
 const recordSolved=(id:string)=>setSolved(previous=>{const next=previous.includes(id)?previous:[...previous,id];try{localStorage.setItem(`guided-exercises:v1:${studioId}`,JSON.stringify(next));}catch{/* Exercise feedback still works when browser storage is unavailable. */}return next;});
 if(!course)return null;
 const lesson=course.units[selected]||course.units[0];
 return <section className="guided-course" aria-label="Guided lessons">
 <h2>Guided lessons and practice</h2><p>Work through these lessons alongside the full reference chapters. Numeric checks assess the stated exercise; investigations ask you to explain a lab result.</p>
 <p aria-live="polite">Numeric exercises solved: {course.units.filter(u=>solved.includes(u.id)).length}/{course.units.length}. Explanations and investigations are self-assessed.</p><h3>Learning outcomes</h3><ul>{course.outcomes.map(x=><li key={x}>{x}</li>)}</ul>
 <div className="studio-curriculum-layout"><aside><nav aria-label="Guided lessons">{course.units.map((u,i)=><button key={u.id} aria-current={selected===i?'page':undefined} onClick={()=>{setSelected(i);setChoice('');}}>{i+1}. {u.title}{solved.includes(u.id)?' · exercise solved':''}</button>)}</nav></aside>
 <article key={lesson.id}><h2>{lesson.title}</h2><h3>Concept</h3><p>{lesson.idea}</p><h3>Conditions</h3><p>{lesson.conditions}</p><h3>Solution strategy</h3><ol>{lesson.method.map(x=><li key={x}>{x}</li>)}</ol>
 <h3>Worked problem</h3><p>{lesson.problem}</p><ol>{lesson.solution.map(x=><li key={x}>{x}</li>)}</ol>
 <ChallengeBox kind="concept" prompt={lesson.calculation.prompt} expected={lesson.calculation.answer} tolerance={.00001} onCorrect={()=>recordSolved(lesson.id)} hint="Apply the worked method. A simple fraction is accepted." placeholder="Numeric answer"/>
 <section className="studio-assumptions"><h3>Misconception check</h3><p>{lesson.misconception}</p><div className="guided-choice"><button aria-expanded={!!choice} onClick={()=>setChoice(choice?'':'reveal')}>Explain the flaw, then reveal the correction</button></div>{choice?<p role="status"><b>Correction:</b> {lesson.explanation}</p>:null}</section>
 <h3>Lab investigation</h3><p>{lesson.investigation}</p><Link className="studio-lab-link" to={lesson.href}>Open the studio and select a relevant lab →</Link>
 <details><summary>Explanation checklist</summary><p>State the hypothesis, derive the expected change, report the observed result, and discuss a counterexample or boundary. Compare with the conditions above. This reflection is a self-check, not automatically graded proof.</p></details>
 <div className="guided-choice"><button disabled={selected===0} onClick={()=>{setSelected(selected-1);setChoice('');}}>Previous lesson</button><button disabled={selected===course.units.length-1} onClick={()=>{setSelected(selected+1);setChoice('');}}>Next lesson</button></div></article></div>
 <section className="studio-assumptions"><h3>Course capstone</h3><p>{course.capstone.prompt}</p><details><summary>Compare your reasoning with the solution</summary><p>{course.capstone.solution}</p></details></section>
 <p>Reference reading: <a href="https://openstax.org/books/precalculus/pages/index" target="_blank" rel="noreferrer">OpenStax Precalculus</a> · <a href="https://openstax.org/books/introductory-statistics/pages/index" target="_blank" rel="noreferrer">OpenStax Statistics</a> · <a href="https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" target="_blank" rel="noreferrer">MIT Linear Algebra</a> · <a href="https://dlmf.nist.gov/" target="_blank" rel="noreferrer">NIST special functions</a> · <a href="https://www.claymath.org/millennium-problems/" target="_blank" rel="noreferrer">Clay problem statements</a></p>
 </section>;
}
