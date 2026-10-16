import {test,expect} from 'vitest';
import questions from './geometryQuestions250.json';
import {matchExtendedGeometry} from './geometryExtendedCurriculum';
import {extendedGeometryTrainingRows} from './geometryExtendedDataset';
import {contextToScene,validateSemanticRows} from './semanticDataset';
import {SemanticEngine} from './semanticEngine';
import {classifyRequest} from './requestClassifier';
import {vertices} from './geometryQueries';
import {dist,foot,dot,sub,area} from './geometryAnalyticMath';
const rows=extendedGeometryTrainingRows();
test('all 250 distinct questions have training labels and extracted slots',()=>{
  expect(new Set(questions.map(q=>q.question)).size).toBe(250);
  expect(validateSemanticRows(rows)).toHaveLength(250);
  for(const q of questions)expect(matchExtendedGeometry(q.question)?.id,q.question).toBe(q.id);
});
for(const [index,row] of rows.entries())test(`${index+1}: ${row.phrase}`,async()=>{
  const engine=new SemanticEngine(row.mode),scene=contextToScene(row);engine.sync(scene.objects,scene.selectedIds);
  const before=engine.snapshot().objects,result=await engine.execute(row.phrase,async()=>undefined);
  expect(result.status,result.message).toBe('success');
  expect(result.verification?.passed,result.message).toBe(true);
  expect(classifyRequest(row.phrase)).toBe(questions[index].mutates?'COMMAND':'QUERY');
  expect(result.plan.commands[0].subAction).toBe('BOARD_ADVANCED');
  checkAnswer(index+1,result.value);
  if(questions[index].mutates)checkConstruction(index+1,engine,before);
  if(!questions[index].mutates)expect(engine.snapshot().objects).toEqual(before);
});

function close(actual:unknown,expected:unknown){
  if(typeof expected==='number'){expect(actual).toBeTypeOf('number');expect(actual).toBeCloseTo(expected,7);}
  else if(Array.isArray(expected)){expect(Array.isArray(actual)).toBe(true);expect((actual as unknown[]).length).toBe(expected.length);expected.forEach((v,i)=>close((actual as unknown[])[i],v));}
  else if(expected&&typeof expected==='object'){for(const [k,v] of Object.entries(expected))close((actual as Record<string,unknown>)[k],v);}
  else expect(actual).toEqual(expected);
}
function checkConstruction(id:number,engine:SemanticEngine,before:ReturnType<SemanticEngine['snapshot']>['objects']){
  const objects=engine.snapshot().objects,created=objects.filter(o=>!before.some(p=>p.id===o.id));
  const rt=Math.sqrt(3),h=Math.SQRT1_2;
  const points:Record<number,number[][][]>={
    176:[[[0,0],[6,0]]],177:[[[6,8],[0,8]]],178:[[[0,0],[6,0],[3,3*rt]]],179:[[[0,0],[6,0],[6,6],[0,6]]],180:[[[0,0],[6,0],[6,4],[0,4]]],
    183:[[[0,0],[.8,-.6]]],185:[[[8,4],[8,5]]],186:[[[3,0]]],187:[[[3,2]]],188:[[[0,0]]],189:[[[0,0]],[[6,0]]],190:[[[0,0]],[[0,8]]],191:[[[1.2,0]],[[2.4,0]],[[3.6,0]],[[4.8,0]]],
    192:[[[6,0],[6-h,-h]]],193:[[[0,0],[6,0]],[[6,0],[2.16,2.88]],[[6,8],[6,0]]],194:[[[3,4],[6,0]]],195:[[[4.5,2]]],196:[[[3,0],[6,4],[3,4]]],197:[[[0,0],[6,0],[6,8],[0,8]]],198:[[[2,1],[8,1],[8,9],[2,9],[0,5]]],199:[[[-2,4],[0,0],[6,0],[6,8],[0,8]]],200:[[[8,4]],[[-2,4]]],215:[[[0,0]]],216:[[[3,0],[3,1]]],217:[[[1.5,2]]],
  };
  if(points[id]){expect(created).toHaveLength(points[id].length);created.forEach((o,i)=>close(vertices(o),points[id][i]));}
  const radii:Record<number,number>={186:3,187:2,188:5,195:2.5,215:3,217:2.5};if(radii[id])close(created[0].command.radius,radii[id]);
  if(id===181){expect(created).toHaveLength(1);const p=vertices(created[0]);expect(p).toHaveLength(5);close(p[0],[0,0]);p.forEach(q=>close(dist(q,[3,4]),5));close(area(p),62.5*Math.sin(2*Math.PI/5));}
  if(id===182||id===184){expect(created).toHaveLength(2);for(const o of created){const [a,b]=vertices(o);close(dist([3,4],foot([3,4],a,b)),5);if(id===184)close(dist([13,4],foot([13,4],a,b)),5);else close(a,[13,4]);}}
  const updates:Record<number,[string,number[]]>={201:['A',[1,0]],202:['P',[3,0]],203:['P',[3,-1]],204:['B',[4,0]],205:['C',[3,8]],206:['C',[3+9/Math.sqrt(73),24/Math.sqrt(73)]],207:['C',[3,3*rt]],208:['C',[6,8]],209:['B',[6,0]],210:['P',[3,0]],211:['P',[3,-1]],212:['B',[6,0]],213:['B',[0,-6]],214:['c',[3,5]]};
  if(updates[id]){const [key,expected]=updates[id];close(objects.find(o=>o.id===key)!.position,expected);expect(created).toHaveLength(0);}
  if(id===206){const a=objects.find(o=>o.id==='A')!.position,b=objects.find(o=>o.id==='B')!.position,c=objects.find(o=>o.id==='C')!.position;close(dot(sub(a,c),sub(b,c)),0);}
  if(id>=204&&id<=214&&id!==207){const key=updates[id][0];expect(objects.find(o=>o.id===key)!.command.roboAnalyticConstraint).toBeDefined();}
}
const numeric:Record<number,unknown>={
  26:[6,0],27:10,28:[0,1],29:[0,0],30:[0,8],31:-36,32:48,33:false,34:true,35:[2.16,2.88],36:-6,37:[0,8],38:8,39:2,40:false,41:2,43:1,44:[[[2,0],[4,0]]],45:0,48:0,49:6,50:4,55:0,
  61:false,62:[[0,0],[0,8],[6,0]],63:true,64:false,67:false,68:false,69:false,70:90+Math.atan(3/4)*180/Math.PI,71:Math.atan(.5)*180/Math.PI,73:true,74:90,75:270,
  76:5,77:2,78:5,79:3*Math.sqrt(5),80:8,81:[2.16,2.88],83:false,84:false,85:true,86:2,87:[18/7,24/7],88:true,89:6,90:12,92:true,93:3,94:true,97:false,98:false,99:0,100:{area:32},
  102:-21,103:3,104:7,105:0,106:false,107:false,108:3,110:5*Math.sqrt(3),111:[[5.5,4+2.5*Math.sqrt(3)],[5.5,4-2.5*Math.sqrt(3)]],112:false,114:4,115:true,116:2*Math.asin(.6)*180/Math.PI,117:10*Math.PI-10*Math.asin(.6),118:25*Math.PI-25*Math.asin(.6),119:25*Math.asin(.6)-12,120:Math.asin(.6)*180/Math.PI,121:true,122:{center:[3,4],radius:5},123:true,124:0,125:25*Math.PI,
  126:false,127:false,128:true,129:true,130:true,131:8,132:24,133:4,134:[3,4],135:1,136:9,137:['AC','AD','BD','BE','CE'],138:[52/21,4],139:20+2*Math.sqrt(20),142:true,143:true,144:[[-2,0],[6,0],[6,8],[-2,8]],145:8,146:8,147:56,148:true,149:['B','C'],150:360,
  151:[0,0],152:[0,-6],153:[-2,8],154:[0,-2],155:[-6,0],156:[7-1.5*Math.sqrt(3),1.5+Math.sqrt(3)],157:[18,24],159:false,161:2*Math.asin(.6)*180/Math.PI,162:true,165:[-3,-2],166:[3,18],167:{center:[3,0],degrees:180},168:false,169:1.5,170:[-2,2],171:[-3,0],172:0,173:{center:[3,-4],radius:5},174:{center:[3,6],radius:10},
  201:[1,0],202:[3,0],203:[3,-1],207:[3,3*Math.sqrt(3)],218:{currentArea:24,areaChangePerUnitUpward:3},224:true,225:2,
  226:[1,1,1],229:Math.sqrt(2),230:1,231:{normal:[0,0,1],constant:0},232:false,233:[0,0,1],234:Math.asin(1/Math.sqrt(21))*180/Math.PI,235:45,236:true,237:6/Math.sqrt(5),238:{kind:'point',point:[-12,0,0]},239:{kind:'line'},240:[1,1,0],241:12,242:27+3*Math.sqrt(29),243:true,244:2*Math.sqrt(14),245:Math.acos(1/Math.sqrt(3))*180/Math.PI,246:{kind:'polygon'},247:[[-2,0,0],[2,0,0]],248:false,249:2,250:10*Math.PI/3,
};
const labels:Record<number,string[]>={
  1:['A','B','C','D','E','F','M','P','Q','O'],2:['A'],3:['P'],4:['A'],5:['F','O'],6:['B'],7:['A','B','D','E','F','P','Q','O'],8:['A','D','E'],9:['F','M','P','O'],10:['A','B'],11:['B','C'],12:['F','M','P','O'],13:['A','F','P','Q','O'],14:['A','B','C','D','F','O'],15:[],16:['F','M','P','Q','O'],17:['P'],18:['P','A','F','O'],19:['E','A','D','P','F','O','M','Q','B','C'],20:['B','Q','P','F','O','A','C','M','E','D'],21:[],22:['M'],23:[],25:[],46:['AB'],47:['AB','CD'],56:[],57:['l4'],58:['l3'],72:['BP'],96:['B'],113:['AB','CD'],140:['A','B','C','D','E'],141:['F','P','Q','O'],163:['C','D','M'],164:['F','O'],227:['A','B','C','O'],228:['D','E','F','P'],
};
const contains:Record<number,string>={24:'left',42:'4 units',51:'-3',52:'-7',53:'12',54:'-18',59:'AB and l3',60:'AB and CD',65:'-3',66:'right angles',82:'on segment',91:'CA',95:'counterclockwise',101:'25',109:'160',158:'No dilation',160:'No translation',175:'orientation-preserving',
  204:'persistent constraint',205:'persistent constraint',206:'persistent constraint',208:'persistent constraint',209:'persistent constraint',210:'persistent constraint',211:'persistent constraint',212:'persistent constraint',213:'persistent constraint',214:'constrained',215:'circle',216:'perpendicular bisector',217:'circle',219:'Side lengths',220:'area by |k|',221:'same circumcircle',222:'no unique circumcircle',223:'12y = 48',
};
function checkAnswer(id:number,value:unknown){
  let answer=value;if(typeof answer==='string'&&(answer.startsWith('[')||answer.startsWith('{'))){try{answer=JSON.parse(answer);}catch{/* A text answer may begin with a bracket. */}}
  if(Object.hasOwn(numeric,id))close(answer,numeric[id]);
  else if(Object.hasOwn(labels,id)){
    const actual=String(value)==='None'?[]:[...String(value).matchAll(/(?:^|; )([^ ;]+) \(/g)].map(m=>m[1]);expect(actual).toEqual(labels[id]);
  }else if(Object.hasOwn(contains,id))expect(String(value)).toContain(contains[id]);
  else if(id>=176&&id<=200)expect(answer).toBeDefined();
  else throw new Error(`Missing answer oracle for question ${id}`);
}

function fixture(id:number,emptySelection=false){const row=rows[id-1],engine=new SemanticEngine(row.mode),scene=contextToScene(row);engine.sync(scene.objects,emptySelection?[]:scene.selectedIds);return {engine,ask:(text:string)=>engine.execute(text,async()=>undefined)};}
test('fixed-length constraints survive parent movement, projected movement, save, restore, and undo',async()=>{
  const f=fixture(209);expect((await f.ask(rows[208].phrase)).status).toBe('success');
  expect((await f.ask('Move A right by 2')).status).toBe('success');
  let scene=f.engine.snapshot();close(dist(scene.objects.find(o=>o.id==='A')!.position,scene.objects.find(o=>o.id==='B')!.position),6);
  const moved=await f.ask('Move B to (3,4)');expect(moved.status,moved.message).toBe('success');
  scene=f.engine.snapshot();close(dist(scene.objects.find(o=>o.id==='A')!.position,scene.objects.find(o=>o.id==='B')!.position),6);
  const restored=new SemanticEngine('geometry2d');await restored.importState(f.engine.exportState(),async()=>undefined);
  expect(restored.snapshot().objects.find(o=>o.id==='B')!.command.roboAnalyticConstraint?.kind).toBe('distance');
  expect((await f.ask('Undo')).status).toBe('success');expect(f.engine.snapshot().objects.find(o=>o.id==='B')!.command.roboAnalyticConstraint).toBeDefined();
});
for(const id of [205,206,208,210,211,212,213,214])test(`${id}: constraint remains satisfied after a later parent or point move`,async()=>{
  const f=fixture(id);expect((await f.ask(rows[id-1].phrase)).status).toBe('success');
  const move=id===211?'Move P to (8,8)':id===214?'Move A up by 1':id===212||id===213?'Move point C right by 1':id===208||id===210?'Move point '+(id===208?'C':'P')+' to (2,5)':'Move A left by 1';
  const result=await f.ask(move);expect(result.status,result.message).toBe('success');expect(result.verification?.checks.some(c=>c.startsWith('Independent'))).toBe(true);
});
test('constraints undo completely and failed commits preserve the board',async()=>{
  const f=fixture(211),before=f.engine.snapshot().objects;expect((await f.ask(rows[210].phrase)).status).toBe('success');
  expect((await f.ask('Undo')).status).toBe('success');expect(f.engine.snapshot().objects).toEqual(before);
  let fail=true;const result=await f.engine.execute(rows[210].phrase,async()=>{if(fail){fail=false;throw new Error('Injected commit failure');}});
  expect(result.status).toBe('invalid');expect(f.engine.snapshot().objects).toEqual(before);
});
test('a length-locked segment can rotate and its constrained endpoint follows',async()=>{
  const f=fixture(209);expect((await f.ask(rows[208].phrase)).status).toBe('success');
  const result=await f.ask('Rotate segment AB 45 degrees counterclockwise about A.');
  expect(result.status,result.message).toBe('success');close(f.engine.snapshot().objects.find(o=>o.id==='B')!.position,[3*Math.SQRT2,3*Math.SQRT2]);
  close(vertices(f.engine.snapshot().objects.find(o=>o.id==='AB')!),[[0,0],[3*Math.SQRT2,3*Math.SQRT2]]);
});
test('missing selections and genuinely ambiguous solutions ask for clarification',async()=>{
  for(const id of [61,62,166,167,176,250]){const f=fixture(id,true);const result=await f.ask(rows[id-1].phrase);expect(result.status,result.message).toBe('ambiguous');}
  const f=fixture(201),objects=f.engine.snapshot().objects;objects.find(o=>o.id==='A')!.position=[6,0];objects.find(o=>o.id==='A')!.command.points=[[6,0]];f.engine.sync(objects,[]);
  const result=await f.ask(rows[200].phrase);expect(result.status,result.message).toBe('ambiguous');expect(result.message).toMatch(/Two equally near/);
});
test('wrong workspace, impossible tangents, and malformed constraints never create geometry',async()=>{
  const f=fixture(1),before=f.engine.snapshot().objects;
  const wrong=await f.ask(rows[225].phrase);expect(wrong.status).toBe('unsupported');
  const tangent=await f.ask(rows[181].phrase);expect(tangent.status).toBe('invalid');expect(tangent.message).toMatch(/inside/);expect(f.engine.snapshot().objects).toEqual(before);
  const source=JSON.parse(f.engine.exportState());source.scene.objects[0].command.roboAnalyticConstraint={kind:'distance',parents:['B'],length:-2};
  await expect(f.engine.importState(JSON.stringify(source),async()=>undefined)).rejects.toThrow(/constraint length/);
});
test('slot extraction accepts renamed points, changed numbers, and ASCII minus signs',async()=>{
  expect(matchExtendedGeometry('What is the reflection of B across the line y = -x?')?.id).toBe(152);
  expect(matchExtendedGeometry('What is the signed 3D cross product of vectors AB and AC?')).toBeUndefined();
  const f=fixture(157),objects=f.engine.snapshot().objects;objects.find(o=>o.id==='A')!.label='U1';objects.find(o=>o.id==='C')!.label='V2';f.engine.sync(objects,[]);
  const answer=await f.ask('Please what are the coordinates of U1 after a dilation of scale factor 3 about V2?');expect(answer.status,answer.message).toBe('success');close(answer.value,[-12,-16]);
  for(const text of ['Do not constrain P to remain on circle c','Maybe draw the common external tangents of circles c and d','What is the power of point P with respect to circle c and delete everything'])expect(matchExtendedGeometry(text)).toBeUndefined();
});
test('3D section vertices lie on both the plane and cube, and spatial intersections satisfy incidence',async()=>{
  const f=fixture(246),result=await f.ask(rows[245].phrase),section=JSON.parse(String(result.value));expect(section.vertices).toHaveLength(4);
  for(const p of section.vertices){close(p[2],0);close(Math.abs(p[0]),2);close(Math.abs(p[1]),2);}
  const sphere=fixture(247),hits=(await sphere.ask(rows[246].phrase)).value as number[][];hits.forEach(p=>close(Math.hypot(...p),2));
});
