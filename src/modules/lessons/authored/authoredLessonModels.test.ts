import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { checkAuthoredAnswer, evaluateAuthoredModel as run } from './authoredLessonModels';
import content from './authoredLessons.generated.json';
import registry from '../catalog/upcoming/apCurriculumRegistry.generated.json';
import lessonIndex from './authoredLessonIndex.generated.json';

const value=(model:string,inputs:Record<string,number>,label:string)=>Number(run(model,inputs).outputs.find(x=>x.label===label)?.value);
describe('authored curriculum teaching contract',()=>{
 it('has a runnable, complete draft for every reserved ID in batches of 25',()=>{
  expect(content.lessons).toHaveLength(448);
  expect(content.lessons.map(x=>x.lessonId)).toEqual(registry.upcomingLessons.map(x=>x.lessonId));
  for(const lesson of content.lessons){
   expect(lesson.batch).toBe(Math.floor(registry.upcomingLessons.findIndex(x=>x.lessonId===lesson.lessonId)/25)+1);
   expect(lesson.examples.length).toBeGreaterThanOrEqual(8);
   expect(lesson.practice.length).toBeGreaterThanOrEqual(8);
   expect(new Set(lesson.examples.map(x=>x.prompt)).size).toBe(lesson.examples.length);
   expect(new Set(lesson.practice.map(x=>x.prompt)).size).toBe(lesson.practice.length);
   expect(lesson.sections.length).toBeGreaterThanOrEqual(3);
   const initial=Object.fromEntries(lesson.interactive.controls.map(c=>[c.key,c.initial]));
   const output=run(lesson.interactive.model,initial);
   expect(output.steps.length).toBeGreaterThanOrEqual(2);
   expect(output.outputs.length).toBeGreaterThan(0);
   for(const item of output.outputs)expect(item.value).not.toMatch(/NaN|Infinity|undefined/);
   for(const item of lesson.practice){expect(item.steps.length).toBeGreaterThan(0);expect(checkAuthoredAnswer(item.expected,item.expected,'tolerance' in item?item.tolerance:undefined)).toBe(true);}
  }
 });
 it('retains upcoming/source-review flags when content is drafted',()=>{
  for(const row of registry.upcomingLessons){expect(row.status).toBe('Upcoming');expect(row.contentStatus).toBe('Drafted');expect(row.coverageVerified).toBe('No');}
 });
 it('loads the correct content from all eighteen lazy batch files',()=>{
  expect(lessonIndex.lessons.map(l=>l.lessonId)).toEqual(content.lessons.map(l=>l.lessonId));
  for(let batch=1;batch<=18;batch++){
   const saved=JSON.parse(readFileSync(new URL(`./batches/batch-${String(batch).padStart(2,'0')}.generated.json`,import.meta.url),'utf8'));
   expect(saved.lessons).toEqual(content.lessons.filter(l=>l.batch===batch));
   expect(saved.lessons.length).toBe(batch===18?23:25);
  }
 });
});
describe('independent mathematical checks',()=>{
 it('checks number patterns and powers',()=>{
  expect(value('odd-square',{n:12},'Odd border')).toBe(25);
  expect(value('negative-power',{base:2,n:3},'Reciprocal')).toBe(.125);
  expect(value('sexagesimal',{n:135},'Decimal value')).toBe(135);
  expect(run('sexagesimal',{n:135}).outputs.find(x=>x.label==='Representation')?.value).toBe('0;2;15');
  expect(value('hcf-lcm',{a:18,b:24},'HCF')).toBe(6);
  expect(value('hcf-lcm',{a:18,b:24},'LCM')).toBe(72);
 });
 it('checks geometric and statistical measurements',()=>{
  expect(value('heron',{a:13,b:14,c:15},'Area')).toBe(84);
  expect(value('chord',{radius:5,distance:3},'Full chord')).toBe(8);
  expect(value('cone',{radius:3,h:4},'Slant height')).toBe(5);
  expect(value('cone',{radius:3,h:4},'Volume / π')).toBe(12);
  expect(value('tangent',{radius:3,distance:5},'Tangent length')).toBe(4);
  expect(value('trapezium',{a:8,b:4,h:3},'Area')).toBe(18);
  expect(value('grouped',{a:2,b:6,c:2,width:10},'Estimated median')).toBe(15);
  expect(value('coins',{k:3,heads:2},'Probability')).toBe(.375);
 });
 it('checks algebra and degenerate equation systems',()=>{
  expect(value('quadratic',{a:1,b:-5,c:6},'Root 1')).toBe(3);
  expect(value('linear-system',{a:1,b:1,p:5,c:1,d:-1,q:1},'x')).toBe(3);
  const classification=(v:Record<string,number>)=>run('linear-system',v).outputs.find(x=>x.label==='Solution count')?.value;
  expect(classification({a:1,b:1,p:2,c:2,d:2,q:5})).toBe('None');
  expect(classification({a:1,b:1,p:2,c:2,d:2,q:4})).toBe('Infinitely many');
  expect(classification({a:0,b:0,p:1,c:1,d:1,q:3})).toBe('None');
  expect(value('ap',{a:3,d:4,n:10},'Nth term')).toBe(39);
  expect(value('ap',{a:3,d:4,n:10},'Sum')).toBe(210);
  expect(value('product-growth',{a:10,b:20,h:1,k:2},'Product increase')).toBe(42);
  expect(value('section-point',{x:1,y1:2,x2:7,y2:8,m:1,n:2},'Section x')).toBe(3);
  expect(value('section-point',{x:1,y1:2,x2:7,y2:8,m:1,n:2},'Section y')).toBe(4);
  expect(value('polynomial',{a:2,b:-2,c:3,exponent:1,x:4},'Degree')).toBe(0);
  expect(run('polynomial',{a:0,b:0,c:0,exponent:2,x:1}).outputs.find(x=>x.label==='Degree')?.value).toBe('Undefined for the zero polynomial');
 });
 it('checks advanced normalization, gradients and invariants',()=>{
  expect(value('pg-32005',{a:2,b:3},'Largest residual entry')).toBe(0);
  expect(value('pg-32006',{a:1,b:2,n:5},'Laplace transform')).toBe(.25);
  expect(value('pg-32009',{a:2,b:3,n:4},'Euler left side')).toBe(640);
  expect(value('pg-32013',{a:5,b:5},'Gini impurity')).toBe(.5);
  expect(value('pg-32017',{a:2,b:3},'First responsibility')).toBe(.4);
  expect(value('pg-32018',{a:0,b:2},'Weight gradient')).toBe(-1);
  expect(value('pg-32028',{a:2,b:5,n:10},'Smoothed probability')).toBe(.2);
  expect(value('pg-32031',{a:3,b:4},'Probability of 0')).toBe(.36);
  expect(value('pg-32033',{a:45},'Reduced-state purity')).toBeCloseTo(.5,8);
  for(const angle of [0,30,90,180]){const p=run('pg-32032',{a:angle,b:60}),xyz=['Bloch x','Bloch y','Bloch z'].map(label=>Number(p.outputs.find(x=>x.label===label)?.value));expect(xyz.reduce((s,x)=>s+x*x,0)).toBeCloseTo(1,7);}
 });
 it('rejects undefined domains and checks typed answers safely',()=>{
  expect(()=>run('zero-power',{base:0})).toThrow();
  expect(()=>run('chord',{radius:3,distance:4})).toThrow();
  expect(()=>run('heron',{a:1,b:2,c:4})).toThrow();
  expect(()=>run('pg-32006',{a:5,n:2})).toThrow();
  expect(()=>run('pg-32008',{a:2,b:1,n:3})).toThrow();
  expect(checkAuthoredAnswer('1/8','.125')).toBe(true);
  expect(checkAuthoredAnswer('','0')).toBe(false);
  expect(checkAuthoredAnswer('1/0','0')).toBe(false);
  expect(checkAuthoredAnswer('2+2','4')).toBe(false);
  expect(checkAuthoredAnswer('  YES ','yes')).toBe(true);
 });
 it('removes general explanatory filler and keeps topic-focused numerical prompts',()=>{
  const allTeaching=content.lessons.flatMap(l=>l.sections.flatMap(s=>s.paragraphs)).join('\n');
  expect(allTeaching).not.toContain('Start with the stated definitions and identify the objects');
  expect(allTeaching).not.toContain('After calculating, explain which assumptions made the result valid');
  for(const [id,term] of [[30130,/degree/],[30195,/area/],[30314,/median/],[30089,/product increase|corner contribution/],[30269,/section|fraction from a/]] as const){
   expect(content.lessons.find(l=>l.lessonId===id)?.examples.every(e=>term.test(e.prompt.toLowerCase()))).toBe(true);
  }
 });
});
