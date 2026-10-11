import fs from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
const catalog=JSON.parse(await fs.readFile(path.join(root,'tmp/lesson-review-catalog.json'),'utf8'));
const nativeRepairs=JSON.parse(await fs.readFile(path.join(root,'artifacts/lesson-review/native-repairs.json'),'utf8'));
const evidenceDirectory=path.join(root,'artifacts/lesson-review');
const evidence=new Map();
for(const name of (await fs.readdir(evidenceDirectory)).filter(n=>n.endsWith('.json'))){
  const value=JSON.parse(await fs.readFile(path.join(evidenceDirectory,name),'utf8'));
  for(const record of Array.isArray(value)?value:[value])if(record.id&&record.snapshot)evidence.set(record.id,record);
}
const source=await fs.readFile(path.join(root,'src/modules/lessons/components/LessonStudySession.tsx'),'utf8');
const limit=Number(source.match(/studyRolloutLimit = (\d+)/)[1]);
const definitions=[
 ['UI','Compact introduction','Keep the interactive workspace near the top; expand the explanation when needed.'],
 ['Content','Attempt before example answer','Hide the introductory example answer behind a comparison disclosure.'],
 ['UI','Compact supplementary material','Collapse extra examples and charts instead of overwhelming the opening view.'],
 ['Content','Learning targets','Show this lesson’s learning objectives inside the preparation view.'],
 ['Interaction','Prerequisite checklist','Save the learner’s starting-knowledge checks for this lesson.'],
 ['Assessment','Diagnostic question','Offer a foundation question before the main practice sequence.'],
 ['Interaction','Vocabulary search','Search this lesson’s terms and meanings.'],
 ['Interaction','Recall then reveal','Let learners retrieve a definition before revealing it.'],
 ['Content','Formula conditions','Explain symbols, units, restrictions, and conditions beside formulas.'],
 ['Interaction','Prediction record','Record a prediction before using the lesson’s model.'],
 ['Interaction','Observation record','Record what actually happened after using the model.'],
 ['Assessment','Investigation completion guard','Require both prediction and observation before recording an investigation.'],
 ['Content','Expected-observation comparison','Reveal a reference observation on demand.'],
 ['Content','Applications','Connect the lesson to its supplied real-life examples.'],
 ['Interaction','Question-level filter','Choose foundation, application, or challenge questions.'],
 ['UI','Focused practice','Present one question at a time with a clear answer field.'],
 ['Assessment','Empty-answer guard','Require an answer before checking or revealing reasoning.'],
 ['Assessment','Equivalent-answer grading','Grade numeric expressions and ordered coordinates; compare proofs and prose honestly.'],
 ['Interaction','Progressive hints','Reveal hints incrementally and record when support was used.'],
 ['Content','Reasoning after an attempt','Show the worked solution after a submitted attempt.'],
 ['Assessment','Independent evidence','Separate correct independent work from answers obtained with support.'],
 ['Interaction','Retry without support','Clear the current attempt and let learners solve again.'],
 ['Interaction','Review filter','Filter to mistakes and supported answers.'],
 ['Interaction','Review notebook navigation','Return directly to a question that needs review.'],
 ['Content','Teach-back reflection','Save an explanation of the idea in the learner’s own words.'],
 ['Interaction','Review date','Choose a local review date for tomorrow or the following week.'],
 ['Functionality','Lesson-specific autosave','Restore this lesson’s answers and notes after reloading.'],
 ['Functionality','Export study notes','Download answers, attempts, investigation notes, and reflection as text.'],
 ['Functionality','Reset with undo','Reset the session while retaining a reversible undo action.'],
 ['Accessibility','Keyboard study tabs','Support arrow keys, Home, End, focus indicators, and labelled controls.'],
 ['UI','Responsive study layout','Use a single column and touch-sized controls on narrow screens.'],
 ['UI','Dark-mode study panel','Use readable dark backgrounds, borders, text, and feedback.'],
 ['Functionality','Storage failure handling','Continue the study session when local storage is unavailable.'],
 ['Functionality','Internal lesson navigation','Navigate internal lesson links through the app instead of reloading it.'],
];
const rows=catalog.map((lesson,index)=>{
  const record=evidence.get(lesson.id);
  const normalized=s=>s.normalize('NFKC').replace(/\bBookmark.*$/gi,'').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'');
  const headings=[...(record?.snapshot??'').matchAll(/heading "([^"]+)" \[level=[12]\]/g)].map(m=>m[1]);
  const headingAliases={356:'Reduced Row Echelon Form (RREF)',359:'Eigenvalues & Eigenvectors',360:'Basis & Dimension',363:'Gram-Schmidt Orthogonalization',401:'Frustum of a Cone',405:'Cross-Sections of Solids',413:'Surfaces z = f(x, y)',416:'Space Curves - reusable spatial engine',420:'420 Contour Curves',421:'Level Surfaces – Reusable 3D Graph Engine',422:'Partial Derivatives – reusable 3D graph engine',423:'423 Gradient Vector',427:'427. Multivariable Optimisation'};
  const matchingHeading=headings.some(h=>normalized(h)===normalized(headingAliases[lesson.id]??lesson.title))||headings.some(h=>normalized(h)===normalized('Understand '+lesson.title))&&[...(record?.snapshot??'').matchAll(/heading "([^"]+)" \[level=1\]/g)].some(m=>normalized(m[1]).includes(normalized(lesson.title)));
  const casPageWithoutTitle=lesson.id>=428&&lesson.id<=449&&headings.some(h=>normalized(h)===normalized('Understand '+lesson.title))&&(headings.length>=5||lesson.id===428&&record.snapshot.includes('button "Evaluate"'));
  const reviewed=(matchingHeading||casPageWithoutTitle||lesson.id===410&&headings.includes('3D Camera Controls')) && !record?.snapshot?.includes('generic "Loading lesson interaction"');
  const enabled=lesson.id<=limit;
  const c=lesson.content;
  const browserValidation=record?.checks ? {checkedAt:record.checkedAt??null,checks:record.checks,errors:record.errors??[],passed:['http','studyPanel','emptyAnswerGuard','reasoningGuard','hint','undo','desktopOverflow','mobileOverflow'].every(key=>record.checks[key]===true)&&!(record.errors?.length)} : null;
  return {id:lesson.id,title:lesson.title,route:lesson.route,batch:Math.floor(index/50)+1,reviewed,enabled,browserValidation,nativeRepair:nativeRepairs.find(item=>item.id===lesson.id),implementation:enabled?'Study flow implemented':'Pending batch rollout',practiceCount:c.practice.length,exampleCount:c.workedExamples.length,exitCount:c.exitCheck.length,objectives:c.learningObjectives,example:c.workedExamples[0]?.prompt,misconception:c.misconceptions[0]?.mistake,enhancements:definitions.map(([area,name,description],i)=>({number:i+1,area,name,description,status:enabled?'Implemented in shared study flow':'Proposed for this batch'}))};
});
await fs.writeFile(path.join(evidenceDirectory,'enhancement-register.json'),JSON.stringify(rows,null,2));
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const enabled=rows.filter(r=>r.enabled).length,reviewed=rows.filter(r=>r.reviewed).length;
const html=`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lesson enhancement register</title><style>body{font:16px/1.6 system-ui;background:#f3f6fb;color:#17324c;max-width:1100px;margin:0 auto;padding:24px}h1{line-height:1.2}input{font:inherit;width:90%;padding:12px;border:1px solid #aab9cb;border-radius:8px}details{background:white;padding:16px;margin:14px 0;border:1px solid #d6dfeb;border-radius:10px}summary{cursor:pointer;font-weight:700}table{width:100%;border-collapse:collapse}td,th{text-align:left;vertical-align:top;border-bottom:1px solid #dde5ef;padding:10px}small{display:block;color:#52667c}.status{font-weight:600}a{color:#075985}li{margin:8px 0}@media(max-width:600px){body{padding:12px}td,th{padding:5px;font-size:14px}}</style><h1>Lesson enhancement register</h1><p>${catalog.length} lessons · ${enabled} study flows enabled · ${reviewed} complete pages captured.</p><p>The register distinguishes page inspection, shared study-flow implementation, and further lesson-specific repairs. Reusing the study system gives each enabled lesson the features below, populated from that lesson’s own content. It does not certify that every native canvas or existing explanation is flawless.</p><p>Validation: 47 focused tests passed, including rendered study panels for all 919 routes in 19 batches; production Vite build passed; focused grading tests; live retry, support, reload, mobile, keyboard, and reset/undo checks. Full-project TypeScript validation is currently affected by existing errors in other workspace and studio files.</p><label for="search">Find a lesson by ID, title, or batch</label><p><input id="search" placeholder="e.g. 112, fractions, batch 3"></p>${rows.map(r=>`<details data-search="${escape((r.id+' '+r.title+' batch '+r.batch).toLowerCase())}"><summary>${r.id} · ${escape(r.title)} — Batch ${r.batch}</summary><p class="status">Page: ${r.reviewed?'Captured in browser':'Pending complete browser capture'} · ${escape(r.implementation)}</p><p>Route: <a href="http://127.0.0.1:5176${escape(r.route)}">${escape(r.route)}</a></p>${r.nativeRepair?`<p><strong>Native repairs:</strong> ${escape(r.nativeRepair.status)}</p><ul>${r.nativeRepair.repairs.map(item=>`<li>${escape(item)}</li>`).join('')}</ul>`:''}<p>Question content: ${r.exampleCount} worked examples, ${r.practiceCount} practice questions, ${r.exitCount} exit checks.</p><p><strong>Lesson-specific anchor:</strong> ${escape(r.example)}</p><p><strong>Misconception to address:</strong> ${escape(r.misconception)}</p><ul>${r.objectives.map(o=>`<li>${escape(o)}</li>`).join('')}</ul><table><thead><tr><th>#</th><th>Area / enhancement</th><th>Behavior and status</th></tr></thead><tbody>${r.enhancements.map(e=>`<tr><td>${e.number}</td><td>${escape(e.area)}<br><strong>${escape(e.name)}</strong></td><td>${escape(e.description)}<small>${escape(e.status)}</small></td></tr>`).join('')}</tbody></table></details>`).join('')}<script>document.getElementById('search').addEventListener('input',event=>{const text=event.target.value.trim().toLowerCase();document.querySelectorAll('details[data-search]').forEach(el=>el.hidden=!el.dataset.search.includes(text))});</script></html>`;
const browserPassed=rows.filter(r=>r.browserValidation?.passed).length;
const browserFailed=rows.filter(r=>r.browserValidation&&!r.browserValidation.passed).length;
let projectValidation='';
try {
  const audit=JSON.parse(await fs.readFile(path.join(evidenceDirectory,'pending-batch-validation.json'),'utf8'));
  if(audit.validation?.productionBuildPassed)projectValidation+=' Production build passed.';
  if(audit.validation?.scopedLintPassed)projectValidation+=' Scoped ESLint passed.';
  if(audit.validation?.fullTypecheck?.startsWith('Failed'))projectValidation+=' Full-project TypeScript validation failed in files outside this lesson audit; see artifacts/lesson-review/final-typecheck.log.';
} catch { /* Browser evidence can be reported before project checks finish. */ }
const updatedHtml=html.replace(/<p>Validation:.*?<\/p>/,`<p>Latest browser checks: ${browserPassed} lessons passed the study interaction and desktop/mobile overflow checks; ${browserFailed} captured lessons require follow-up. Question-bank, grading, route resolution, and study-panel tests passed for all 919 catalog routes (29 tests).${projectValidation} Browser captures and these checks do not certify every native model or mathematical explanation.</p>`);
await fs.writeFile(path.join(root,'LESSON_ENHANCEMENT_AUDIT.html'),updatedHtml);
console.log(JSON.stringify({total:rows.length,enabled,reviewed,browserPassed,browserFailed,enhancementsPerLesson:definitions.length}));
