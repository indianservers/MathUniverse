import {buildSync} from 'esbuild';
import {writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {seeds} from './authored-lesson-seeds.mjs';
mkdirSync('tmp/authored-lessons',{recursive:true});
const compile=(source,name)=>{const path=resolve(`tmp/authored-lessons/${name}.mjs`);writeFileSync(path,buildSync({entryPoints:[source],bundle:true,platform:'node',format:'esm',write:false}).outputFiles[0].text);return import(pathToFileURL(path).href);};
const {evaluateAuthoredModel}=await compile('src/modules/lessons/authored/authoredLessonModels.ts','enrichment-models');
const {conceptVisual}=await compile('src/modules/lessons/authored/conceptVisualModels.ts','enrichment-visuals');
const {learnerText}=await compile('src/modules/lessons/lessonPresentation.ts','enrichment-presentation');
const records=[];
for(const [id,lesson] of [...seeds].sort(([a],[b])=>b-a)){
 const inputs=Object.fromEntries(lesson.interactive.controls.map(c=>[c.key,c.initial]));
 const result=evaluateAuthoredModel(lesson.interactive.model,inputs),visual=conceptVisual(lesson.interactive.model,inputs,result);
 lesson.sections=lesson.sections.filter(s=>!['Read the visualization','Follow a numerical walkthrough','Explain your result'].includes(s.heading));
 lesson.sections.push({heading:'Read the visualization',paragraphs:[visual.explanation,`For the initial values, ${result.outputs.map(o=>`${o.label} = ${o.value}`).join('; ')}. ${result.formula}`]});
 lesson.sections.push({heading:'Follow a numerical walkthrough',paragraphs:[`Use ${lesson.interactive.controls.map(c=>`${c.label} = ${c.initial}`).join(', ')}.`,...result.steps,`Check the result: ${result.outputs.map(o=>`${o.label} = ${o.value}`).join('; ')}.`]});
 const example=lesson.examples[0];
 lesson.sections.push({heading:'Explain your result',paragraphs:[example.prompt,...example.steps,`Therefore: ${example.answer}`,lesson.memoryCue,...lesson.misconceptions.slice(0,1).map(m=>`${m.mistake}: ${m.correction}`)]});
 const clean=value=>typeof value==='string'?learnerText(value):Array.isArray(value)?value.map(clean):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([key,v])=>[key,clean(v)])):value;
 for(const key of ['summary','prerequisites','objectives','sections','formulas','examples','practice','memoryCue','misconceptions'])lesson[key]=clean(lesson[key]);
 lesson.interactive.title=learnerText(lesson.interactive.title);lesson.interactive.prompts=lesson.interactive.prompts.map(learnerText);lesson.interactive.limitations=learnerText(lesson.interactive.limitations);
 records.push({lessonId:id,model:lesson.interactive.model,representation:visual.kind,explanations:lesson.sections.length,examples:lesson.examples.length});
}
writeFileSync('reports/REVERSE_LESSON_ENRICHMENT.json',JSON.stringify({order:'Descending lesson ID',total:records.length,lessons:records},null,2)+'\n');
