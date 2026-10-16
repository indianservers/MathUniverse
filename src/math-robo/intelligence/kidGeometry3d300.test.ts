import {test,expect} from 'vitest';
import questions from './kidGeometry3d300.json';
import {kidGeometry3dTrainingRows} from './kidGeometry3dDataset';
import {contextToScene,generateStarterDataset,validateSemanticRows} from './semanticDataset';
import {SemanticEngine} from './semanticEngine';
import {geometryState} from './resultVerifier';
import {describeObject} from './sceneContext';
import {geometry3dInventory,type SceneEntry3D} from '../../offline-intelligence/geometry3dInventory';
import {commandTransform3d} from '../../offline-intelligence/solidAdapter';
import {createIntelligenceShapeGeometry} from '../../offline-intelligence/shapeGeometry3d';
import type {VisualCommand} from '../../offline-intelligence/commands';
const trainingRows=kidGeometry3dTrainingRows();
export function kidFixture(id:number){
 const row=structuredClone(trainingRows[id-1]),scene=contextToScene(row);
 let native:SceneEntry3D[]=scene.objects.map(o=>({id:o.id,kind:o.command.kind,command:o.command,label:o.label,transform:{...commandTransform3d(o.command),scale:o.command.scale??1,visible:o.command.roboVisible??true,locked:o.command.roboLocked??false}}));
 let selectedIds=scene.selectedIds;
 const engine=new SemanticEngine('geometry3d');
 const read=()=>({objects:geometry3dInventory(native).map(c=>describeObject(c,'geometry3d')),selectedIds});
 const apply=async(command:VisualCommand)=>{
  if(command.roboControl==='delete'){native=native.filter(o=>o.id!==command.objectId);selectedIds=selectedIds.filter(id=>id!==command.objectId);return;}
  if(command.roboControl==='select'){selectedIds=[command.objectId!];return;}if(command.roboControl==='deselect'){selectedIds=[];return;}
  if(!['point','line','ray','vector'].includes(command.kind)){const geometry=createIntelligenceShapeGeometry(command);const p=geometry.getAttribute('position');expect(p.count).toBeGreaterThan(0);for(let i=0;i<p.count;i++)expect(Number.isFinite(p.getX(i)+p.getY(i)+p.getZ(i))).toBe(true);geometry.dispose();}
  const next:SceneEntry3D={id:command.objectId!,kind:command.kind,command:structuredClone(command),transform:{...commandTransform3d(command),scale:command.scale??1,visible:command.roboVisible??true,locked:command.roboLocked??false}};
  native=[...native.filter(o=>o.id!==command.objectId),next];if(command.roboControl!=='visibility')selectedIds=[command.objectId!];
 };
 engine.sync(read().objects,selectedIds,{lastReferenced:scene.lastReferenced,activeObjectIds:scene.activeObjectIds});
 return {row,engine,read,apply,get native(){return native;},ask:(text:string)=>engine.execute(text,apply,undefined,read)};
}
test('all 300 questions are present in the production training dataset',()=>{expect(questions).toHaveLength(300);const rows=generateStarterDataset().filter(r=>r.source==='kid-geometry3d-300');expect(rows).toHaveLength(300);expect(validateSemanticRows(rows)).toHaveLength(300);},60000);
for(const question of questions)test(`${question.id}: ${question.question}`,async()=>{
 const f=kidFixture(question.id);
 if([293,294,295].includes(question.id)){expect((await f.ask('Color the cube red.')).status).toBe('success');if(question.id===294)expect((await f.ask('Undo')).status).toBe('success');}
 if(question.id===267)expect((await f.ask('Draw another one like that.')).status).toBe('success');
 const before=geometryState(f.engine.snapshot()),nativeBefore=JSON.stringify(f.native);
 const result=await f.ask(question.question);
 expect(result.status,result.message).toBe(question.status);
 expect(result.message.trim().length).toBeGreaterThan(0);
 if(result.status!=='success'||!question.mutates){expect(geometryState(f.engine.snapshot())).toBe(before);expect(JSON.stringify(f.native)).toBe(nativeBefore);expect(result.effects).toHaveLength(0);}
 else {expect(result.effects.length,result.message).toBeGreaterThan(0);expect(result.verification?.passed??true).toBe(true);}
});

const numericAnswers:Record<number,number|number[]>={66:[2,0,0],67:[0,3,0],71:Math.sqrt(13),72:4,73:Math.sqrt(13),74:[1,1.5,0],83:0,84:0,91:64,92:48,93:36*Math.PI,94:20*Math.PI,95:18*Math.PI,96:112/3,97:15*Math.sqrt(3),98:96,99:88,100:36*Math.PI,101:28*Math.PI,102:20*Math.PI,103:9*Math.PI*Math.sqrt(5),104:9*Math.PI*(1+Math.sqrt(5)),105:16,106:16,107:4*Math.PI,108:4,109:6,110:3,111:4,112:[6,4,2],113:Math.sqrt(56),114:4*Math.SQRT2,115:Math.sqrt(45),116:[0,0,0],117:[10,0,0],118:6,123:2*Math.PI,211:Math.sqrt(13),212:[-2/Math.sqrt(13),3/Math.sqrt(13),0],213:[3,4,0],214:5,216:[3,4,2],217:[0,3,-4],218:90,221:0,228:1,229:0,239:0,243:90,245:[0,0,1],249:3,274:64};
for(const [key,expected] of Object.entries(numericAnswers))test('independent numeric answer '+key,async()=>{
 const id=Number(key),f=kidFixture(id),r=await f.ask(questions[id-1].question);expect(r.status,r.message).toBe('success');
 if(Array.isArray(expected)){expect(Array.isArray(r.value)).toBe(true);expected.forEach((x,i)=>expect((r.value as number[])[i]).toBeCloseTo(x,8));}else expect(r.value).toBeCloseTo(expected,8);
});
const booleanAnswers:Record<number,boolean>={58:false,59:false,61:true,70:false,79:false,80:false,81:true,85:false,86:false,87:true,88:true,89:false,121:false,122:true,219:true,220:false,223:false,224:false,225:false,227:true,236:false,237:true,241:true,242:false,254:false,256:true,257:false,258:false,260:true,262:false,263:false,264:true};
for(const [key,expected] of Object.entries(booleanAnswers))test('independent relationship answer '+key,async()=>{const id=Number(key),f=kidFixture(id),r=await f.ask(questions[id-1].question);expect(r.status,r.message).toBe('success');expect(r.value).toBe(expected);});
test('new coordinates and labels are extracted instead of replaying example values',async()=>{
 const f=kidFixture(25);const create=await f.ask('Add a point called Q at (9, -2, 1).');expect(create.status,create.message).toBe('success');expect(f.read().objects.find(o=>o.label==='Q')?.position).toEqual([9,-2,1]);
 const answer=await f.ask('What are Q’s coordinates?');expect(answer.status,answer.message).toBe('success');expect(answer.value).toEqual([9,-2,1]);
});
test('new dimensions and movement amounts reach the native renderer',async()=>{
 const f=kidFixture(15);expect((await f.ask('Draw a cube with sides of 7 units.')).status).toBe('success');
 expect((await f.ask('Move the cube 8 units to the right.')).status).toBe('success');const cube=f.read().objects.find(o=>o.type==='cube')!;expect(cube.command.width).toBe(7);expect(cube.position).toEqual([8,0,0]);
 const answer=await f.ask('What is the volume of this cube?');expect(answer.value).toBe(343);
});
test('rotation asks for an axis and angle, then applies the answers to the selected object',async()=>{
 const f=kidFixture(292),before=geometryState(f.engine.snapshot());const ask=await f.ask(questions[291].question);expect(ask.status).toBe('ambiguous');expect(ask.message).toContain('axis');
 expect(geometryState(f.engine.snapshot())).toBe(before);expect((await f.ask('z')).status).toBe('ambiguous');const done=await f.ask('45');expect(done.status,done.message).toBe('success');expect(f.read().objects.find(o=>o.type==='cube')!.command.rotation![2]).toBeCloseTo(45);
});
test('scaling waits for the child to supply a factor',async()=>{const f=kidFixture(291);expect((await f.ask(questions[290].question)).status).toBe('ambiguous');const r=await f.ask('1.5');expect(r.status,r.message).toBe('success');expect(f.read().objects.find(o=>o.type==='cube')!.command.scale).toBe(1.5);});
test('box width clarification preserves the other dimensions',async()=>{const f=kidFixture(169);expect((await f.ask(questions[168].question)).status).toBe('ambiguous');const r=await f.ask('9');expect(r.status,r.message).toBe('success');const box=f.read().objects.find(o=>o.type==='cuboid')!;expect([box.command.width,box.command.height,box.command.depth]).toEqual([9,4,2]);});
test('opacity choices update the actual 3D transform',async()=>{const f=kidFixture(188);expect((await f.ask(questions[187].question)).status).toBe('ambiguous');const r=await f.ask('50%');expect(r.status,r.message).toBe('success');expect(f.native.find(o=>o.kind==='cylinder')!.transform.opacity).toBe(.5);});
test('a hidden cone can be shown again',async()=>{const f=kidFixture(194);expect((await f.ask(questions[193].question)).status).toBe('success');expect(f.native.find(o=>o.kind==='cone')!.transform.visible).toBe(false);const r=await f.ask(questions[194].question);expect(r.status,r.message).toBe('success');expect(f.native.find(o=>o.kind==='cone')!.transform.visible).toBe(true);});
test('a point rotates around the origin rather than staying put',async()=>{const f=kidFixture(152),r=await f.ask(questions[151].question);expect(r.status,r.message).toBe('success');const a=f.read().objects.find(o=>o.id==='A')!;expect(a.position[0]).toBeCloseTo(0);expect(a.position[1]).toBeCloseTo(2);expect(a.position[2]).toBe(0);});
test('arbitrary tetrahedron geometry follows its parent points',async()=>{const f=kidFixture(38),r=await f.ask(questions[37].question);expect(r.status,r.message).toBe('success');const tetra=f.read().objects.find(o=>o.command.roboDependency?.kind==='tetrahedron')!;expect(tetra.command.points).toHaveLength(4);const moved=await f.ask('Move point A to (3, 0, 0).');expect(moved.status,moved.message).toBe('success');expect(f.read().objects.find(o=>o.id===tetra.id)!.command.points[0]).toEqual([3,0,0]);});
test('sphere sections change when the slicing plane moves',async()=>{const f=kidFixture(248),r=await f.ask(questions[247].question);expect(r.status,r.message).toBe('success');const section=f.read().objects.find(o=>o.command.roboDependency?.kind==='section3')!;expect(section.command.points).toHaveLength(64);
 const moved=await f.ask(questions[249].question);expect(moved.status,moved.message).toBe('success');const points=f.read().objects.find(o=>o.id===section.id)!.command.points;expect(points.every(p=>Math.abs(p[2]-1)<1e-8)).toBe(true);expect(Math.hypot(points[0][0],points[0][1])).toBeCloseTo(Math.sqrt(8));
 const radius=await f.ask(questions[248].question);expect(radius.status,radius.message).toBe('success');expect(radius.value).toBeCloseTo(Math.sqrt(8));
});
test('surface appearance options preserve geometry and undo correctly',async()=>{const f=kidFixture(190),r=await f.ask(questions[189].question);expect(r.status,r.message).toBe('success');expect(f.native.find(o=>o.kind==='cube')!.transform.material).toBe('wireframe');expect((await f.ask('Undo')).status).toBe('success');expect(f.native.find(o=>o.kind==='cube')!.transform.material).toBe('matte');});
test('volume follow-up steps retain a numerical formula',async()=>{const f=kidFixture(91);expect((await f.ask(questions[90].question)).value).toBe(64);const r=await f.ask(questions[275].question);expect(r.status,r.message).toBe('success');expect(r.message).toContain('4³');expect(r.message).toContain('64');});

test('rotating a constructed triangle around AB moves C and preserves A and B',async()=>{
 const f=kidFixture(37);expect((await f.ask(questions[36].question)).status).toBe('success');
 const before=f.read().objects.filter(o=>['A','B'].includes(o.id)).map(o=>o.position),c=f.read().objects.find(o=>o.id==='C')!.position;
 expect((await f.ask(questions[150].question)).status).toBe('ambiguous');const result=await f.ask('45');expect(result.status,result.message).toBe('success');
 expect(f.read().objects.filter(o=>['A','B'].includes(o.id)).map(o=>o.position)).toEqual(before);
 const moved=f.read().objects.find(o=>o.id==='C')!.position;expect(moved).not.toEqual(c);
 const triangle=f.read().objects.find(o=>o.command.roboDependency?.kind==='triangle')!;expect(triangle.command.points[2]).toEqual(moved);
});

test('a vector choice answers the pending question instead of repeating an earlier move',async()=>{
 const f=kidFixture(213);expect((await f.ask('Move the cube 2 units to the right.')).status).toBe('success');
 const before=geometryState(f.engine.snapshot());const question=await f.ask(questions[212].question);expect(question.status).toBe('ambiguous');expect(question.candidates).toContain('Arrow');
 const answer=await f.ask('Arrow');expect(answer.status,answer.message).toBe('success');expect(answer.value).toEqual([3,4,0]);expect(geometryState(f.engine.snapshot())).toBe(before);
});
test('a two-vector query accumulates choices and waits until both are supplied',async()=>{
 const f=kidFixture(218);expect((await f.ask('Make an arrow from the origin to (1, 1, 0).')).status).toBe('success');
 const before=geometryState(f.engine.snapshot());const question=await f.ask(questions[217].question);expect(question.status).toBe('ambiguous');expect(question.clarification?.slots).toContain('kidTargets');
 expect((await f.ask('Arrow')).status).toBe('ambiguous');expect(geometryState(f.engine.snapshot())).toBe(before);
 const answer=await f.ask('OtherArrow');expect(answer.status,answer.message).toBe('success');expect(answer.value).toBe(90);expect(geometryState(f.engine.snapshot())).toBe(before);
});
test('the multi-object picker can submit both objects together or cancel',async()=>{
 const f=kidFixture(218);await f.ask('Make an arrow from the origin to (1, 1, 0).');await f.ask(questions[217].question);
 const answer=await f.ask('Arrow and OtherArrow');expect(answer.status,answer.message).toBe('success');expect(answer.value).toBe(90);
 await f.ask(questions[217].question);const before=geometryState(f.engine.snapshot());const cancel=await f.ask('cancel');expect(cancel.status).toBe('success');expect(f.engine.conversation.pending).toBeUndefined();expect(geometryState(f.engine.snapshot())).toBe(before);
});

test('an empty selection asks which solid to color and safely accepts the choice',async()=>{
 const f=kidFixture(287),before=f.read().objects.find(o=>o.id==='Cube')!.position;
 const question=await f.ask(questions[286].question);expect(question.status).toBe('ambiguous');expect(question.clarification?.slots).toContain('target');
 const answer=await f.ask('Cube');expect(answer.status,answer.message).toBe('success');const cube=f.read().objects.find(o=>o.id==='Cube')!;expect(cube.style.color).toBe('#3b82f6');expect(cube.position).toEqual(before);
});

test('the cube net is drawn beside the solid so its faces stay visible',async()=>{const f=kidFixture(265),r=await f.ask(questions[264].question);expect(r.status,r.message).toBe('success');const faces=r.effects.filter(e=>e.kind==='polygon'&&!e.roboControl);expect(faces).toHaveLength(6);expect(faces.every(face=>face.points.every(p=>p[0]>2))).toBe(true);expect(f.read().objects.find(o=>o.type==='cube')!.command.width).toBe(4);});
