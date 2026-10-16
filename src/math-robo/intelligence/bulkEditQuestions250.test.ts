import {test,expect} from 'vitest';
import questions from './bulkEditQuestions250.json';
import {bulkEditTrainingRows} from './bulkEditDataset';
import {generateStarterDataset,validateSemanticRows,contextToScene} from './semanticDataset';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import {vertices} from './geometryQueries';
import {addIntelligenceGeometry,nativeGeometryCommands} from '../../offline-intelligence/geometryAdapter';
import {COLORS} from '../../offline-intelligence/shapeCatalog';
import type {VisualCommand} from '../../offline-intelligence/commands';
import type {Construction} from '../../workspace/geometryCommandController';

test('250 distinct authored examples have complete expected labels',()=>{
 expect(questions).toHaveLength(250);expect(new Set(questions.map(q=>q.question.toLowerCase())).size).toBe(250);
 const rows=generateStarterDataset().filter(row=>row.source==='user-bulk-edit-250');expect(rows).toHaveLength(250);expect(validateSemanticRows(rows)).toHaveLength(250);
});
for(const [index,row] of bulkEditTrainingRows().entries())test(`${index+1}: ${row.phrase}`,async()=>{
 const expected=questions[index],initial=contextToScene(row);
 let native:Pick<Construction,'points'|'lines'|'circles'|'polygons'|'loci'>={points:[],lines:[],circles:[],polygons:[],loci:[]};
 for(const o of initial.objects)native=addIntelligenceGeometry(native,o.command);
 const engine=new SemanticEngine('geometry2d');
 const read=()=>({objects:nativeGeometryCommands(native).map(c=>describeObject(c,'geometry2d')),selectedIds:initial.selectedIds});
 const apply=async(c:VisualCommand)=>{if(c.roboControl==='select'||c.roboControl==='deselect')return;native=addIntelligenceGeometry(native,c);};
 engine.sync(read().objects,initial.selectedIds);const before=read().objects;
 const plan=engine.parse(row.phrase),command=plan.commands[0];
 expect(plan.commands).toHaveLength(1);expect(command.action).toBe(expected.action);expect(command.subAction).toBe(expected.subAction);
 expect(command.parameters).toMatchObject(row.parameters);expect(command.target).toEqual(row.target);
 const affected=before.filter(o=>(o.type===expected.type||expected.type==='polygon'&&o.type==='triangle')&&(!expected.selected||initial.selectedIds.includes(o.id))&&(!expected.sourceColor||o.style.color===COLORS[expected.sourceColor]));
 expect(affected.length).toBeGreaterThan(0);
 const result=await engine.execute(row.phrase,apply,undefined,read);
 expect(result.status,result.message).toBe('success');expect(result.message).toContain(`Updated ${affected.length} matching`);
 const after=read().objects;expect(after.map(o=>o.id).sort()).toEqual(before.map(o=>o.id).sort());
 for(const prior of before){
  const next=after.find(o=>o.id===prior.id)!;expect(vertices(next)).toEqual(vertices(prior));expect(next.command.radius).toBe(prior.command.radius);
  if(!affected.some(o=>o.id===prior.id)){expect(next.command).toEqual(prior.command);continue;}
  const p=expected.parameters as {color?:string;lineWidth?:number;lineWidthFactor?:number};
  if(expected.subAction==='COLOR')expect(next.style.color).toBe(COLORS[p.color!]);
  if(expected.subAction==='FILL_COLOR')expect(next.command.roboFillColor).toBe(COLORS[p.color!]);
  if(expected.subAction==='STROKE_COLOR'){expect(next.command.roboStrokeColor).toBe(COLORS[p.color!]);expect(next.style.color).toBe(COLORS[p.color!]);}
  if(expected.subAction==='LINE_WIDTH')expect(next.command.roboLineWidth).toBe(p.lineWidth??3*p.lineWidthFactor!);
  if(['HIDE','SHOW'].includes(expected.action))expect(next.command.roboVisible).toBe(expected.action==='SHOW');
  if(['LOCK','UNLOCK'].includes(expected.action))expect(next.command.roboLocked).toBe(expected.action==='LOCK');
  const id=next.command.roboNativeIds?.shape??next.command.roboNativeIds?.points[0];
  const item=[...native.points,...native.lines,...native.circles,...native.polygons].find(o=>o.id===id)!;
  if(expected.subAction==='COLOR'||expected.subAction==='STROKE_COLOR')expect(item.style?.color).toBe(COLORS[p.color!]);
  if(expected.subAction==='FILL_COLOR')expect(item.style?.fill).toBe(COLORS[p.color!]);
  if(expected.subAction==='LINE_WIDTH')expect(item.style?.strokeWidth).toBe(p.lineWidth??3*p.lineWidthFactor!);
  if(['HIDE','SHOW'].includes(expected.action))expect(item.style?.visible).toBe(expected.action==='SHOW');
 }
});
