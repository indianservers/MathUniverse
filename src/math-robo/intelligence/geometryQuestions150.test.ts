import {test,expect} from 'vitest';
import curriculum from './geometryQuestions150.json';
import {SemanticEngine} from './semanticEngine';
import {describeObject} from './sceneContext';
import {vertices} from './geometryQueries';
import {matchGeometryLesson} from './geometryCurriculum';
import {contextToScene,geometryCurriculumRows,validateSemanticRows} from './semanticDataset';
import type {VisualCommand} from '../../offline-intelligence/commands';

const positions:Record<string,number[]>={A:[0,0],B:[6,0],C:[6,8],D:[0,8],E:[-2,4],F:[3,4],M:[3,8],P:[3,2],O:[3,4]};
function fixture(){
  const engine=new SemanticEngine('geometry2d');
  const command=(kind:VisualCommand['kind'],label:string,points:number[][],extra:Partial<VisualCommand>={}):VisualCommand=>({kind,dimension:'2d',objectId:label,roboLabel:label,points,width:6,height:8,radius:5,color:'#22d3ee',scale:1,rotation:[0,0,0],action:'create',roboExplicitVertices:true,...extra});
  const objects=[...Object.entries(positions).map(([label,p])=>command('point',label,[p])),
    command('circle','c',[[3,4]]),command('circle','d',[[13,4]]),
    command('line','AB',[positions.A,positions.B],{linearExtent:'segment',roboVertexLabels:['A','B']}),
    command('line','CD',[positions.C,positions.D],{linearExtent:'line'}),
    command('triangle','ABC',[positions.A,positions.B,positions.C],{roboVertexLabels:['A','B','C']}),
    command('triangle','angle1',[[1,0],[0,0],[0,1]],{roboAngle:{vertex:1,degrees:90}}),
    command('triangle','angle2',[[1,0],[0,0],[0,1]],{roboAngle:{vertex:1,degrees:90}}),
  ].map(c=>describeObject(c,'geometry2d'));
  engine.sync(objects,[]);return engine;
}
// Independent numeric expectations for the fixed 6–8–10 triangle and 6×8 rectangle.
const values:Record<number,unknown>={
  3:[0,0],6:true,14:true,16:6,17:0,18:6,21:false,22:false,23:0,24:20,25:6,26:8,27:6,28:0,30:1,
  31:[3,0],32:true,34:[1.5,0],35:[4,0],36:[[2,0],[4,0]],37:[3,0],38:true,39:8,40:[12,0],41:[6,16],42:[3,0],43:[[1.5,0],[3,0],[4.5,0]],44:false,45:[[3,4]],
  46:0,47:true,48:false,50:'The line coincides with the axis; infinitely many intercepts.',51:[0,8],53:false,54:false,55:true,56:true,57:false,58:false,60:false,
  61:90,63:true,64:'acute',65:0,66:false,67:false,68:true,69:90,70:180,71:false,72:270,73:Math.PI/2,74:0,
  76:false,77:false,78:true,79:true,80:24,81:24,82:6,83:[4,8/3],84:[3,4],85:[4,2],86:[6,0],87:false,88:false,89:true,90:true,
  91:[3,4],92:5,93:10,94:10*Math.PI,95:25*Math.PI,96:true,97:'on the boundary',98:false,99:[[0,0],[6,0]],100:[[8,4]],101:false,102:true,103:6,104:10*Math.asin(.6),105:25*Math.asin(.6),
  106:true,107:false,108:true,109:false,111:20+2*Math.sqrt(20),112:48,113:true,114:true,115:false,116:'convex',117:false,118:540,120:false,
  121:[3,2],122:[0,0],123:[-6,0],124:[-6,-8],125:[0,0],126:[6,16],127:[[0,0],[12,0],[12,16]],128:[6,0],129:false,130:true,131:true,132:true,133:216,134:false,
};
const contains:Record<number,string>={
  2:'C',4:'A',5:'D',7:'C',8:'E',9:'C',10:'E',11:'C',12:'A–D',13:'A–B',15:'P',19:'F–O',20:'A–C',29:'CA = 10',33:'P',49:'y',52:'parallel',59:'CD',62:'B: 90',75:'D',110:'AB ∥ CD',119:'DE',135:'None',
};
function close(actual:unknown,expected:unknown){
  if(typeof expected==='number'){expect(actual).toBeTypeOf('number');expect(actual).toBeCloseTo(expected,7);}
  else if(Array.isArray(expected)){expect(Array.isArray(actual)).toBe(true);expect((actual as unknown[]).length).toBe(expected.length);expected.forEach((v,i)=>close((actual as unknown[])[i],v));}
  else expect(actual).toEqual(expected);
}
test('all 150 questions have stable intent templates',()=>{
  expect(curriculum).toHaveLength(150);expect(new Set(curriculum.map(r=>r.question)).size).toBe(150);
  for(const row of curriculum)expect(matchGeometryLesson(row.question)?.id,row.question).toBe(row.id);
});
test('all 150 authored training rows validate and execute using their saved board contexts',async()=>{
  const rows=validateSemanticRows(geometryCurriculumRows());expect(rows).toHaveLength(150);
  for(const row of rows){const engine=new SemanticEngine(row.mode),scene=contextToScene(row);engine.sync(scene.objects,scene.selectedIds);
    const result=await engine.execute(row.phrase,async()=>undefined);
    expect(result.status,`${row.phrase}: ${result.message}`).toBe('success');
    expect(result.plan.commands[0].action).toBe(row.action);expect(result.plan.commands[0].subAction).toBe(row.subAction);
  }
});
for(const row of curriculum)test(`${row.id}: ${row.question}`,async()=>{
  const engine=fixture();
  if(row.id===146){const objects=engine.snapshot().objects;for(const [id,position] of [['C',[3,-2]],['D',[3,2]]] as const){const o=objects.find(o=>o.id===id)!;o.position=[...position];o.command.points=[[...position]];}engine.sync(objects,[]);}
  if(row.id===26)engine.sync(engine.snapshot().objects,['AB','CD']);
  if(row.id===37)engine.sync(engine.snapshot().objects,['A','B']);
  if(row.id===67||row.id===68)engine.sync(engine.snapshot().objects,['angle1','angle2']);
  const before=engine.snapshot().objects;
  const result=await engine.execute(row.question,async()=>undefined);
  expect(result.status,result.message).toBe('success');
  expect(result.verification?.passed,result.message).toBe(true);
  if(row.id<=135){
    expect(engine.snapshot().objects).toEqual(before);
    if(row.id===1){expect(result.message).toContain('P');expect(result.value).toBeCloseTo(Math.sqrt(2));}
    else if(Object.hasOwn(values,row.id))close(result.value,values[row.id]);
    else {expect(contains[row.id],`Missing oracle for ${row.id}`).toBeDefined();expect(String(result.value)).toContain(contains[row.id]);}
  }else if(row.id<=146){
    expect(result.effects).toHaveLength(1);expect(engine.snapshot().objects).toHaveLength(before.length+1);
    const created=engine.snapshot().objects.at(-1)!;
    const expected:Record<number,{kind:string;points?:number[][];radius?:number}>={
      136:{kind:'line',points:[[6,8],[0,8]]},137:{kind:'point',points:[[3,0]]},138:{kind:'line',points:[[3,8],[3,7]]},139:{kind:'line',points:[[0,0],[0,1]]},
      140:{kind:'line',points:[[0,0],[6,0]]},141:{kind:'circle',points:[[0,0]],radius:6},142:{kind:'circle',points:[[3,4]],radius:5},143:{kind:'circle',points:[[4,2]],radius:2},
      144:{kind:'line',points:[[0,0],[6,4]]},145:{kind:'ray',points:[[6,0],[6-Math.SQRT1_2,Math.SQRT1_2]]},146:{kind:'point',points:[[3,0]]},
    };
    expect(created.type).toBe(expected[row.id]?.kind);
    if(expected[row.id]?.points)close(vertices(created),expected[row.id].points);
    if(expected[row.id]?.radius)close(created.command.radius,expected[row.id].radius);
  }else if(row.id===147)close(engine.snapshot().objects.find(o=>o.id==='A')!.position,[2,3]);
  else if(row.id===148)close(vertices(engine.snapshot().objects.find(o=>o.id==='ABC')!),[[0,0],[6,0],[6,-8]]);
  else if(row.id===149)close(vertices(engine.snapshot().objects.find(o=>o.id==='AB')!),[[0,0],[3*Math.SQRT2,3*Math.SQRT2]]);
  else expect(engine.snapshot().objects.map(o=>o.id).sort()).toEqual(['A','B']);
});

test('renamed points and new numeric slots generalize beyond the listed questions',async()=>{
  const engine=fixture(),objects=engine.snapshot().objects;
  objects.find(o=>o.id==='A')!.label='U1';objects.find(o=>o.id==='B')!.label='V2';
  engine.sync(objects,[]);
  close((await engine.execute('Please what are the coordinates of point U1?',async()=>undefined)).value,[0,0]);
  close((await engine.execute('Where would U1 be after moving 7 units right and 4 units up?',async()=>undefined)).value,[7,4]);
  close((await engine.execute('What is the midpoint of U1V2?',async()=>undefined)).value,[3,0]);
});
test('selected-object questions request clarification without changing geometry',async()=>{
  for(const id of [26,37,67,68]){const engine=fixture(),before=engine.snapshot().objects;
    const result=await engine.execute(curriculum[id-1].question,async()=>{throw new Error('Must not mutate');});
    expect(result.status,result.message).toBe('ambiguous');expect(result.message).toMatch(/Select exactly/);expect(engine.snapshot().objects).toEqual(before);
  }
});

test('answers follow scaled and translated coordinates rather than memorized values',async()=>{
  const engine=fixture(),objects=engine.snapshot().objects;
  for(const o of objects){
    o.command.points=o.command.points.map(([x,y])=>[2*x+11,2*y-7]);
    o.position=o.command.points[0];o.vertices=o.command.points;o.command.radius*=2;
  }
  engine.sync(objects,[]);
  for(const [id,value] of [[18,12],[24,40],[25,12],[31,[17,-7]],[81,96],[84,[17,1]],[92,10],[112,192],[133,864]] as const){
    const result=await engine.execute(curriculum[id-1].question,async()=>undefined);
    expect(result.status,result.message).toBe('success');close(result.value,value);
  }
});
test('undefined geometry is explained and failed constructions leave the board unchanged',async()=>{
  for(const id of [84,142,143,145]){
    const engine=fixture(),objects=engine.snapshot().objects;
    objects.find(o=>o.id==='C')!.position=[12,0];objects.find(o=>o.id==='C')!.command.points=[[12,0]];
    engine.sync(objects,[]);const before=engine.snapshot().objects;
    const result=await engine.execute(curriculum[id-1].question,async()=>undefined);
    expect(result.status).toBe('invalid');expect(result.message).toMatch(/nondegenerate/);expect(engine.snapshot().objects).toEqual(before);
  }
  const engine=fixture();const before=engine.snapshot().objects;
  const result=await engine.execute(curriculum[145].question,async()=>undefined);
  expect(result.status).toBe('invalid');expect(result.message).toMatch(/parallel/);expect(engine.snapshot().objects).toEqual(before);
});
test('coincident circles report infinitely many intersections and no single tangency',async()=>{
  const engine=fixture(),objects=engine.snapshot().objects,d=objects.find(o=>o.id==='d')!;
  d.position=[3,4];d.command.points=[[3,4]];engine.sync(objects,[]);
  expect((await engine.execute(curriculum[99].question,async()=>undefined)).value).toMatch(/infinitely many/);
  expect((await engine.execute(curriculum[101].question,async()=>undefined)).value).toBe(false);
});
test('mutations can be undone and a failed native commit rolls back',async()=>{
  const engine=fixture(),before=engine.snapshot().objects;
  expect((await engine.execute(curriculum[136].question,async()=>undefined)).status).toBe('success');
  expect((await engine.execute('Undo',async()=>undefined)).status).toBe('success');
  expect(engine.snapshot().objects).toEqual(before);
  let failOnce=true;
  const failed=await engine.execute(curriculum[140].question,async()=>{if(failOnce){failOnce=false;throw new Error('Injected commit failure');}});
  expect(failed.status).toBe('invalid');expect(engine.snapshot().objects).toEqual(before);
});
test('unrecognized and negated requests are not turned into curriculum actions',()=>{
  for(const text of ['Do not mark the midpoint of AB','Maybe remove all objects','What is the area of triangle ABC and email it','Draw a segment joining C and D and publish it'])expect(matchGeometryLesson(text)).toBeUndefined();
});
