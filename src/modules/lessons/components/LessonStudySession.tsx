import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { useParams } from 'react-router-dom';
import { findLesson } from '../catalog/lessonCatalog';
import { findSchoolLesson } from '../catalog/school/schoolSyllabusCatalog';
import { findAdvancedConceptLesson } from '../catalog/advanced/advancedConceptLessons';
import { getStrengthenedFoundationLesson } from '../strengthening/foundationNumberContent';
import { batchOneStudyChecks } from '../strengthening/studyBatchOne';
import { gradeStudyAnswer, newStudySession, questionKind, readStudySession, studyEvidence, studyStorageKey, type StudyQuestion, type StudySession } from '../engine/lessonStudySession';
import type { StrengthenedLesson } from '../strengthening/strengthenedLessonSchema';
import { MathText } from '../../../components/ui/MathExpression';
import './LessonStudySession.css';

// Increase only after a batch has been reviewed and verified.
export const studyRolloutLimit = 150;
export function resolveStudyLessonId(params: {categorySlug?:string;lessonSlug?:string;levelSlug?:string}) {
  return findLesson(params.categorySlug,params.lessonSlug)?.id ?? findSchoolLesson(params.levelSlug,params.lessonSlug)?.numericId ?? findAdvancedConceptLesson(params.lessonSlug)?.numericId;
}
export function makeStudyQuestions(lesson: StrengthenedLesson): StudyQuestion[] {
  const examples = lesson.workedExamples;
  const questions: StudyQuestion[] = [];
  const seen = new Set<string>();
  for (const example of examples) {
    const key = `${example.prompt.trim().toLowerCase()}|${example.answer.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    questions.push({id:`example-${example.id}`,prompt:example.prompt,answer:example.answer,kind:questionKind(example.answer),hints:[lesson.definitions[0]?.statement ?? lesson.basicIdea,example.steps[0] ?? lesson.howItWorks],solution:example.steps,level:questions.length===0?'foundation':'application'});
  }
  if (batchOneStudyChecks[Number(lesson.id)]) questions.push(batchOneStudyChecks[Number(lesson.id)]);
  for (const item of lesson.practice) {
    const key = `${item.prompt.trim().toLowerCase()}|${item.answer.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    questions.push({id:`practice-${item.id}`,prompt:item.prompt,answer:item.answer,kind:questionKind(item.answer),hints:item.hints,solution:item.workedSolution,tolerance:item.tolerance,level:item.difficulty==='recognition'||item.difficulty==='direct'?'foundation':item.difficulty==='challenge'||item.difficulty==='transfer'||item.difficulty==='error_diagnosis'?'challenge':'application'});
  }
  for (const item of lesson.exitCheck) {
    const key = `${item.prompt.trim().toLowerCase()}|${item.answer.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    questions.push({id:`exit-${item.id}`,prompt:item.prompt,answer:item.answer,kind:questionKind(item.answer),hints:[item.criterion],solution:[item.answer],level:'challenge'});
  }
  for (const misconception of lesson.misconceptions) {
    questions.push({id:`misconception-${misconception.code}`,prompt:`Explain and correct this mistake: ${misconception.mistake}`,answer:misconception.correction,kind:'reflection',hints:[lesson.definitions[0]?.statement ?? lesson.basicIdea],solution:[misconception.correction],level:'challenge'});
  }
  return questions;
}
export default function LessonStudySession() {
  const params = useParams();
  const id = resolveStudyLessonId(params);
  const lesson = id == null ? null : getStrengthenedFoundationLesson(id);
  if (!id || id > studyRolloutLimit || !lesson) return null;
  return <StudyPanel key={id} lesson={lesson} lessonId={id} />;
}
const views = ['Ready','Investigate','Practice','Review'] as const;
type View = typeof views[number];
function StudyPanel({lesson,lessonId}:{lesson:StrengthenedLesson;lessonId:number}) {
  const [session,setSession] = useState<StudySession>(()=>readStudySession(lessonId));
  const [open,setOpen] = useState(false);
  const [view,setView] = useState<View>('Ready');
  const [level,setLevel] = useState('all');
  const [reviewOnly,setReviewOnly] = useState(false);
  const [hintCount,setHintCount] = useState(0);
  const [feedback,setFeedback] = useState('');
  const [notice,setNotice] = useState('');
  const [storageError,setStorageError] = useState(false);
  const [undo,setUndo] = useState<StudySession|null>(null);
  const [termSearch,setTermSearch] = useState('');
  const [flipped,setFlipped] = useState<string[]>([]);
  const questions = useMemo(()=>makeStudyQuestions(lesson),[lesson]);
  const evidence = useMemo(()=>studyEvidence(questions,session),[questions,session]);
  const candidates = questions.filter(q=>(level==='all'||q.level===level)&&(!reviewOnly||evidence.needsReview.some(x=>x.id===q.id)));
  const question = candidates.find(q=>q.id===session.questionId) ?? candidates[0];
  const attempt = question ? session.attempts[question.id] : undefined;
  useEffect(()=>{try{localStorage.setItem(studyStorageKey(lessonId),JSON.stringify(session));setStorageError(false);}catch{setStorageError(true);}},[lessonId,session]);
  const selectQuestion = (id:string) => {setSession(s=>({...s,questionId:id}));setHintCount(0);setFeedback('');};
  const updateAnswer = (answer:string) => {
    if (!question) return;
    setSession(s=>({...s,questionId:question.id,attempts:{...s.attempts,[question.id]:{answer,attempts:s.attempts[question.id]?.attempts??0,correct:false,assisted:s.attempts[question.id]?.assisted??false,revealed:s.attempts[question.id]?.revealed??false}}}));
    setFeedback('');
  };
  const check = () => {
    if (!question) return;
    const result = gradeStudyAnswer(question,attempt?.answer??'');
    if (result==='empty') {setFeedback('Enter an answer before checking.');return;}
    setSession(s=>({...s,questionId:question.id,attempts:{...s.attempts,[question.id]:{answer:attempt?.answer??'',attempts:(attempt?.attempts??0)+1,correct:result==='correct',assisted:attempt?.assisted??false,revealed:attempt?.revealed??false}}}));
    setFeedback(result==='correct' ? 'Correct. Explain why this result follows from the rule.' : result==='compare' ? 'Compare your reasoning with the solution. This response needs your judgment; it is not automatically graded.' : 'That answer does not match yet. Check the rule, signs, units, or coordinate order, then try again.');
  };
  const support = (reveal:boolean) => {
    if (!question) return;
    setSession(s=>({...s,questionId:question.id,attempts:{...s.attempts,[question.id]:{answer:attempt?.answer??'',attempts:attempt?.attempts??0,correct:attempt?.correct??false,assisted:true,revealed:reveal||!!attempt?.revealed}}}));
    if (!reveal) setHintCount(c=>c+1);
  };
  const retry = () => {if(!question)return;setSession(s=>{const attempts={...s.attempts};delete attempts[question.id];return {...s,attempts};});setHintCount(0);setFeedback('Try again without hints.');};
  const reportText = () => [lesson.title,lesson.route,'',...questions.flatMap(q=>{const a=session.attempts[q.id];return a?[q.prompt,`Your answer: ${a.answer}`,`Attempts: ${a.attempts}; ${a.correct?'correct':'needs review'}; ${a.assisted?'with support':'without support'}`,'']:[];}),'Investigation notes',...lesson.guidedExploration.flatMap(g=>[g.prompt,`Prediction: ${session.predictions[g.id]??''}`,`Observation: ${session.observations[g.id]??''}`]),'Reflection',session.reflection].join('\n');
  const exportNotes = () => {const url=URL.createObjectURL(new Blob([reportText()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`lesson-${lessonId}-study-notes.txt`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('Study notes exported.');};
  const changeView = (next:View) => {setView(next);setFeedback('');};
  const tabKey = (event:KeyboardEvent<HTMLButtonElement>,index:number) => {
    const next = event.key==='ArrowRight'?(index+1)%views.length:event.key==='ArrowLeft'?(index+views.length-1)%views.length:event.key==='Home'?0:event.key==='End'?views.length-1:null;
    if(next===null)return;event.preventDefault();changeView(views[next]);document.getElementById(`study-${lessonId}-tab-${next}`)?.focus();
  };
  return <section className="lesson-study-session" data-lesson-study-session data-testid={`study-session-${lessonId}`} aria-label={`${lesson.title} study session`}>
    <header className="study-session-header"><div><h2>Practice and remember {lesson.title}</h2><p>{evidence.independent} of {evidence.total} checks solved without support</p></div><button type="button" aria-expanded={open} aria-controls={`study-${lessonId}-body`} onClick={()=>setOpen(v=>!v)}>{open?'Close study session':session.questionId?'Resume study session':'Start study session'}</button></header>
    {open&&<div id={`study-${lessonId}-body`}>
      <div className="study-session-tabs" role="tablist" aria-label="Study session views">{views.map((v,i)=><button type="button" role="tab" id={`study-${lessonId}-tab-${i}`} aria-selected={view===v} aria-controls={`study-${lessonId}-panel`} tabIndex={view===v?0:-1} key={v} onClick={()=>changeView(v)} onKeyDown={e=>tabKey(e,i)}>{v}</button>)}</div>
      <div role="tabpanel" id={`study-${lessonId}-panel`} aria-labelledby={`study-${lessonId}-tab-${views.indexOf(view)}`} tabIndex={0}>
      {view==='Ready'&&<div className="study-session-grid">
        <article><h3>What you will learn</h3><ul>{lesson.learningObjectives.map(x=><li key={x}><MathText value={x}/></li>)}</ul><h3>Check your starting knowledge</h3>{lesson.prerequisites.map(x=><label className="study-check" key={x}><input type="checkbox" checked={session.prerequisites.includes(x)} onChange={e=>setSession(s=>({...s,prerequisites:e.target.checked?[...s.prerequisites,x]:s.prerequisites.filter(v=>v!==x)}))}/>{x}</label>)}<p>This checklist is your own assessment. Use the diagnostic question to test it.</p><button type="button" onClick={()=>{setLevel('foundation');setReviewOnly(false);selectQuestion(questions.find(q=>q.level==='foundation')?.id??'');changeView('Practice');}}>Try a diagnostic question</button></article>
        <article><h3>Recall the vocabulary</h3><label>Find a term<input type="search" value={termSearch} onChange={e=>setTermSearch(e.target.value)} /></label>{lesson.keyVocabulary.filter(v=>`${v.term} ${v.meaning}`.toLowerCase().includes(termSearch.toLowerCase())).map(v=><div className="study-vocabulary" key={v.term}><button type="button" aria-expanded={flipped.includes(v.term)} onClick={()=>setFlipped(f=>f.includes(v.term)?f.filter(t=>t!==v.term):[...f,v.term])}>{v.term} — {flipped.includes(v.term)?'Hide meaning':'Recall, then reveal'}</button>{flipped.includes(v.term)&&<p><MathText value={v.meaning}/></p>}</div>)}<details><summary>Rules and their conditions</summary>{lesson.formulas.map(f=><div key={f.id}><h4>{f.label}</h4><MathText value={f.expression}/><ul>{f.variables.map(v=><li key={v.symbol}>{v.symbol}: {v.meaning}{v.unit?` (${v.unit})`:''}</li>)}{f.restrictions?.map(r=><li key={r}>{r}</li>)}</ul></div>)}<ul>{lesson.conditionsAndRestrictions.map(r=><li key={r}>{r}</li>)}</ul></details></article>
      </div>}
      {view==='Investigate'&&<div><p>Use the lesson workspace above to test each prediction. Your notes record what you observed.</p>{lesson.guidedExploration.map(g=><article className="study-investigation" key={g.id}><h3><MathText value={g.prompt}/></h3><div className="study-session-grid"><label>Prediction before using the model<textarea value={session.predictions[g.id]??''} onChange={e=>setSession(s=>({...s,predictions:{...s.predictions,[g.id]:e.target.value},completedSteps:s.completedSteps.filter(x=>x!==g.id)}))}/></label><label>Observation after using the model<textarea value={session.observations[g.id]??''} onChange={e=>setSession(s=>({...s,observations:{...s.observations,[g.id]:e.target.value},completedSteps:s.completedSteps.filter(x=>x!==g.id)}))}/></label></div><button type="button" disabled={!session.predictions[g.id]?.trim()||!session.observations[g.id]?.trim()} onClick={()=>setSession(s=>({...s,completedSteps:[...new Set([...s.completedSteps,g.id])]}))}>{session.completedSteps.includes(g.id)?'Notes recorded':'Record investigation notes'}</button>{g.expectedObservation&&<details><summary>Compare with the expected observation</summary><p><MathText value={g.expectedObservation}/></p></details>}</article>)}<details><summary>Where this idea is used</summary>{lesson.realLifeExamples.map(x=><p key={x.id}><strong>{x.context}.</strong> <MathText value={x.connection}/></p>)}</details></div>}
      {view==='Practice'&&<div className="study-practice">
        <div className="study-session-toolbar"><label>Question level<select value={level} onChange={e=>{setLevel(e.target.value);setHintCount(0);setFeedback('');}}><option value="all">All levels</option><option value="foundation">Foundation</option><option value="application">Apply the idea</option><option value="challenge">Boundary cases and reasoning</option></select></label><label className="study-check"><input type="checkbox" checked={reviewOnly} onChange={e=>{setReviewOnly(e.target.checked);setHintCount(0);setFeedback('');}}/>Review mistakes and supported answers</label></div>
        {question?<div key={question.id}><p className="study-question-count">Question {candidates.indexOf(question)+1} of {candidates.length} · {question.level}</p><h3><MathText value={question.prompt}/></h3><p>{question.kind==='number'?'Enter a number, fraction, or arithmetic expression.':question.kind==='tuple'?'Enter coordinates in order, such as (2,3).':question.kind==='reflection'?'Explain your reasoning in your own words; compare it with the solution after trying.':'Use the answer format requested in the question.'}</p><form onSubmit={e=>{e.preventDefault();check();}}><label>Your answer<textarea aria-label={`${lesson.title} study answer`} value={attempt?.answer??''} onChange={e=>updateAnswer(e.target.value)} maxLength={2000}/></label><div className="study-session-toolbar"><button type="submit">Check my answer</button><button type="button" disabled={hintCount>=question.hints.length} onClick={()=>support(false)}>{hintCount===0?'Get a hint':'Get the next hint'}</button><button type="button" disabled={!attempt?.attempts} onClick={()=>support(true)}>Show reasoning</button></div></form><p role="status" className="study-feedback">{feedback}</p>{question.hints.slice(0,hintCount).map((hint,i)=><p className="study-hint" key={i}><strong>Hint {i+1}.</strong> <MathText value={hint}/></p>)}{attempt?.revealed&&<article className="study-solution"><h4>Compare your solution</h4><ol>{question.solution.map((step,i)=><li key={i}><MathText value={step}/></li>)}</ol><p><strong>Answer:</strong> <MathText value={question.answer}/></p>{question.kind==='reflection'&&<button type="button" onClick={()=>{setSession(s=>({...s,attempts:{...s.attempts,[question.id]:{...s.attempts[question.id],correct:true,assisted:true}}}));setFeedback('Reflection compared. Try another example to test the idea independently.');}}>I compared my reasoning</button>}</article>}<div className="study-session-toolbar"><button type="button" onClick={retry}>Retry without support</button><button type="button" disabled={candidates.length<2} onClick={()=>selectQuestion(candidates[(candidates.indexOf(question)+1)%candidates.length].id)}>Next question</button></div></div>:<p>No questions match this filter. Switch to all levels or clear the review filter.</p>}
      </div>}
      {view==='Review'&&<div className="study-session-grid"><article><h3>Your learning evidence</h3><progress max={Math.max(1,evidence.total)} value={evidence.independent} aria-label="Checks solved independently"/><p>{evidence.independent}/{evidence.total} automatically checkable questions solved without hints or revealed solutions.</p><p>{evidence.ready?'All checkable questions in this set are solved independently. Revisit them later to check retention.':'Keep practising the unanswered or supported questions. Opening a page does not count as understanding.'}</p><p>{session.completedSteps.length} investigation notes recorded.</p><h3>Review notebook</h3>{evidence.needsReview.length?evidence.needsReview.map(q=><div className="study-review-item" key={q.id}><p><MathText value={q.prompt}/></p><p>Your answer: {session.attempts[q.id]?.answer||'Not entered'}</p><button type="button" onClick={()=>{setLevel('all');setReviewOnly(false);selectQuestion(q.id);changeView('Practice');}}>Revisit this question</button></div>):<p>No mistakes or supported answers are recorded yet.</p>}</article><article><label>Explain the main idea to a friend<textarea value={session.reflection} onChange={e=>setSession(s=>({...s,reflection:e.target.value}))} placeholder={`Explain ${lesson.title} using an example and a restriction.`}/></label><h3>Plan a recall check</h3><p>{session.reviewAt?`Review ${session.reviewAt<=Date.now()?'is due now':'planned for '+new Date(session.reviewAt).toLocaleDateString()}.`:'Choose when you want to revisit this lesson.'} This is stored locally; it does not send a notification.</p><div className="study-session-toolbar"><button type="button" onClick={()=>setSession(s=>({...s,reviewAt:Date.now()+86400000}))}>Review tomorrow</button><button type="button" onClick={()=>setSession(s=>({...s,reviewAt:Date.now()+7*86400000}))}>Review in a week</button></div><button type="button" onClick={exportNotes}>Download my study notes</button></article></div>}
      </div><footer className="study-session-toolbar"><button type="button" onClick={()=>{setUndo(session);setSession(newStudySession());setHintCount(0);setFeedback('');setNotice('This study session was reset. You can undo it.');}}>Reset study session</button>{undo&&<button type="button" onClick={()=>{setSession(undo);setUndo(null);setNotice('Study session restored.');}}>Undo reset</button>}<span role="status">{storageError?'Progress could not be saved on this device. Download your notes.':notice||'Progress saved on this device.'}</span></footer>
    </div>}
  </section>;
}
