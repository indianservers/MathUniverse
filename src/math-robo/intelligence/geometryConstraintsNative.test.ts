import {test,expect} from 'vitest';
import {addIntelligenceGeometry,nativeGeometryCommands} from '../../offline-intelligence/geometryAdapter';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import type {Construction} from '../../workspace/geometryCommandController';
import type {VisualCommand} from '../../offline-intelligence/commands';
type Native=Pick<Construction,'points'|'lines'|'circles'|'polygons'|'loci'>;
function fixture(){
  let native:Native={points:[{id:'a',label:'A',x:320,y:210},{id:'b',label:'B',x:560,y:210},{id:'p',label:'P',x:440,y:130},{id:'o',label:'O',x:440,y:50},{id:'r',label:'R',x:640,y:50}],lines:[{id:'segment',a:'a',b:'b',kind:'segment'}],circles:[{id:'circle',center:'o',edge:'r'}],polygons:[],loci:[]};
  const engine=new SemanticEngine('geometry2d');
  const read=()=>({objects:nativeGeometryCommands(native).map(command=>describeObject(command,'geometry2d'))});
  const apply=async(command:VisualCommand)=>{if(command.roboControl==='select'||command.roboControl==='deselect')return;native=addIntelligenceGeometry(native,command);};
  engine.sync(read().objects,[]);
  return {engine,read,apply,get native(){return native;},drag:(id:string,x:number,y:number)=>{native={...native,points:native.points.map(p=>p.id===id?{...p,x:320+40*x,y:210-40*y}:p)};},ask:(text:string)=>engine.execute(text,apply,undefined,read)};
}
test('a length constraint updates real shared canvas endpoints and connected segments',async()=>{
  const f=fixture();const result=await f.ask('Move B while keeping AB equal to 4 units.');
  expect(result.status,result.message).toBe('success');
  expect(f.native.points.find(p=>p.id==='b')!.x).toBe(480);
  const moved=await f.ask('Move point A right by 1');expect(moved.status,moved.message).toBe('success');
  expect(f.native.points.find(p=>p.id==='b')!.x).toBe(520);
  expect(f.read().objects.find(o=>o.id==='b')!.command.roboAnalyticConstraint?.kind).toBe('distance');
  const rotated=await f.ask('Rotate segment AB 45 degrees counterclockwise about A.');expect(rotated.status,rotated.message).toBe('success');
  const a=f.engine.snapshot().objects.find(o=>o.id==='a')!.position,b=f.engine.snapshot().objects.find(o=>o.id==='b')!.position;
  expect(Math.hypot(b[0]-a[0],b[1]-a[1])).toBeCloseTo(4);expect(b[1]-a[1]).toBeCloseTo(2*Math.SQRT2);
});
test('manual canvas dragging reads current coordinates and reprojects a constrained point',async()=>{
  const f=fixture();const result=await f.ask('Constrain P to remain on segment AB.');expect(result.status,result.message).toBe('success');
  f.drag('p',2,5);f.engine.sync(f.read().objects,[]);
  expect(f.engine.snapshot().objects.find(o=>o.id==='p')!.position).toEqual([2,5]);
  await f.engine.refreshDependencies(f.apply);
  expect(f.native.points.find(p=>p.id==='p')!.y).toBe(210);
  expect(f.engine.snapshot().objects.find(o=>o.id==='p')!.position).toEqual([2,0]);
});
test('a tangent-circle constraint keeps its real center, edge, and radius consistent',async()=>{
  const f=fixture(),objects=f.read().objects,circle=objects.find(o=>o.id==='circle')!;circle.label='c';circle.command.roboLabel='c';f.engine.sync(objects,[]);
  const result=await f.ask('Keep circle c tangent to line AB while its center moves.');expect(result.status,result.message).toBe('success');
  const center=f.native.points.find(p=>p.id==='o')!,edge=f.native.points.find(p=>p.id==='r')!;
  expect(Math.hypot(edge.x-center.x,edge.y-center.y)/40).toBeCloseTo(5);
  expect((210-center.y)/40).toBeCloseTo(5);
});

 test('perpendicular bisector appears on the native board and answer options execute',async()=>{
  const f=fixture();
  // This fixture uses A and B in place of the screenshot's C and D.
  const result=await f.ask('Draw the perpendicular bisector of AB.');
  expect(result.status,result.message).toBe('success');
  const line=f.read().objects.find(o=>o.command.roboDependency?.kind==='perpBisector')!;
  expect(line).toBeDefined();expect(line.command.linearExtent).toBe('line');
  expect(line.position[0]).toBeCloseTo(3);
  const native=f.native.lines.find(l=>l.id===line.command.roboNativeIds?.shape);
  expect(native?.kind).toBe('line');
  expect(result.followUps).toHaveLength(3);
  const mark=await f.ask(result.followUps![0].prompt);expect(mark.status,mark.message).toBe('success');
  expect(f.read().objects.some(o=>o.type==='point'&&o.position[0]===3&&o.position[1]===0)).toBe(true);
  const distance=await f.ask(result.followUps![2].prompt);expect(distance.status,distance.message).toBe('success');expect(distance.value).toBe(6);
  f.drag('b',8,2);f.engine.sync(f.read().objects,[]);await f.engine.refreshDependencies(f.apply);
  const updated=f.read().objects.find(o=>o.id===line.id)!;
  expect(updated.command.points[0]).toEqual([4,1]);
  const [a,b]=updated.command.points;expect((b[0]-a[0])*8+(b[1]-a[1])*2).toBeCloseTo(0);
 });
