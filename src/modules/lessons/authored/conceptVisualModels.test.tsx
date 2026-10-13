import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import content from './authoredLessons.generated.json';
import {evaluateAuthoredModel} from './authoredLessonModels';
import {conceptVisual} from './conceptVisualModels';
import ConceptVisualization from './ConceptVisualization';
describe('Lesson visual explanations',()=>{
 it('renders every new lesson without invalid numeric SVG coordinates and uses named URLs',()=>{
  expect(content.lessons).toHaveLength(448);
  for(const lesson of content.lessons){
   const values=Object.fromEntries(lesson.interactive.controls.map(c=>[c.key,c.initial]));
   const result=evaluateAuthoredModel(lesson.interactive.model,values);
   const html=renderToStaticMarkup(<ConceptVisualization model={lesson.interactive.model} values={values} result={result} onChange={()=>{}}/>);
   expect(html,`${lesson.lessonId}: invalid visualization`).not.toMatch(/(?:="[^"]*(?:NaN|Infinity))/);
   expect(lesson.route).toMatch(new RegExp(`/lessons/[a-z-]+/${lesson.lessonId}-[a-z0-9-]+$`));
   expect(lesson.sections.some(s=>s.heading==='Follow a numerical walkthrough')).toBe(true);
   const learnerContent=JSON.stringify([lesson.summary,lesson.sections,lesson.interactive.title,lesson.interactive.limitations]);
   expect(learnerContent).not.toMatch(/\b(upcoming|planned|draft|batch|jntu\w*)\b/i);
  }
 });
 it('distinguishes entanglement from product states and rejects a zero state',()=>{
  for(const [angle,purity] of [[0,1],[45,.5],[90,1]]){
   const result=evaluateAuthoredModel('pg-32033',{a:angle,b:1,n:1});
   const visual=conceptVisual('pg-32033',{a:angle},result);
   expect(visual.numbers.reduce((a,b)=>a+b,0)).toBeCloseTo(1);
   expect(Number(result.outputs.find(o=>o.label==='Reduced-state purity')?.value)).toBeCloseTo(purity);
  }
  expect(()=>evaluateAuthoredModel('pg-32031',{a:0,b:0,n:1})).toThrow(/nonzero/);
 });
});
