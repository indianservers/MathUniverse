import fs from 'node:fs';
import crypto from 'node:crypto';
import {SemanticEngine} from '../src/math-robo/intelligence/semanticEngine';
import {geometryState} from '../src/math-robo/intelligence/resultVerifier';
import {vertices} from '../src/math-robo/intelligence/geometryQueries';
import type {RoboMode} from '../src/math-robo/intelligence/types';
type Turn={text:string;status?:string;value?:number|boolean|number[];nonmutation?:boolean;notVerified?:boolean};
type Oracle={type?:string;count?:number;position?:number[];width?:number;height?:number;radius?:number;scale?:number;points?:number[][];dependencyCount?:number;angle?:number;preserveId?:boolean};
type Case={id:string;category:string;family:string;partition:string;difficulty:string;mode:RoboMode;page:string;initialScene:{setup:string[]};turns:Turn[];expected:{scene:Oracle;intent?:string;verification:string};provenance:string};
const root='reports/ruhi-v6-phase3',phase=process.argv[2]??'generate',modes:RoboMode[]=['graph2d','geometry2d','graph3d','geometry3d'],two:RoboMode[]=['graph2d','geometry2d'],paths:Record<RoboMode,string>={graph2d:'/workspace/graph',geometry2d:'/workspace/geometry',graph3d:'/math-lab/3d-graphing',geometry3d:'/workspace/3d',normal:'/'};
const distribution:Record<string,number>={drawing:800,transformations:800,context:1000,clarification:800,planning:900,algebra:900,geometry2d:900,geometry3d:700,verification:900,pages:600,tutor:500,negative:700,persistence:500};
const ok=(text:string,value?:Turn['value']):Turn=>({text,status:'success',...(value!==undefined?{value}:{})}),ask=(text:string):Turn=>({text,status:'ambiguous',nonmutation:true}),invalid=(text:string):Turn=>({text,status:'invalid',nonmutation:true,notVerified:true});
function fixture(category:string,n:number):Omit<Case,'id'|'category'|'partition'|'difficulty'|'provenance'>{
 const a=n+2,b=3+(n%17),m=modes[n%4],d=m.endsWith('3d')?3:2,zero=Array<number>(d).fill(0),rect=`Draw rectangle width ${a} height ${b}`,circle=`Create circle radius ${a}`,xy=[a,b],point=`Create point (${[...xy,...(d===3?[4]:[])].join(',')})`;
 let family='',mode=m,page=paths[m],setup:string[]=[],turns:Turn[]=[],scene:Oracle={},intent:string|undefined;
 const k=n%8;
 if(category==='drawing'){
  intent='CREATE';
  if(k===0){family='rectangle-create';turns=[ok(rect)];scene={type:'rectangle',count:1,width:a,height:b};}
  if(k===1){family='circle-create';mode=two[n%2];turns=[ok(circle)];scene={type:'circle',count:1,radius:a};}
  if(k===2){family='point-create';turns=[ok(point)];scene={type:'point',count:1,position:[...xy,...(d===3?[4]:[])]};}
  if(k===3){family='line-create';turns=[ok(`Draw line (${zero.join(',')}) to (${[a,b,...(d===3?[4]:[])].join(',')})`)];scene={type:'line',count:1,points:[zero,[a,b,...(d===3?[4]:[])]]};}
  if(k===4){family='triangle-create';mode=two[n%2];turns=[ok(`Draw triangle ABC with A(0,0), B(${a},0), C(2,${b})`)];scene={type:'triangle',count:1,points:[[0,0],[a,0],[2,b]]};}
  if(k===5){family='vector-create';turns=[ok(`Create vector (${zero.join(',')}) to (${[a,b,...(d===3?[4]:[])].join(',')})`)];scene={type:'vector',count:1,points:[zero,[a,b,...(d===3?[4]:[])]]};}
  if(k===6){family='sphere-create';mode='geometry3d';turns=[ok(`Create sphere radius ${a}`)];scene={type:'sphere',count:1,radius:a};}
  if(k===7){family='cube-create';mode='graph3d';turns=[ok(`Create cube side ${a}`)];scene={type:'cube',count:1,width:a};}
 }
 if(category==='transformations'){
  if(k<2){family='rectangle-relative-size';setup=[rect];turns=[ok(`Increase its width by ${b}`),ok('Find its area',(a+b)*b)];scene={type:'rectangle',count:1,width:a+b,height:b,preserveId:true};}
  else if(k<4){family='point-translation';setup=[point];turns=[ok(`Move it right by ${b}`)];scene={type:'point',position:[a+b,b,...(d===3?[4]:[])],preserveId:true};}
  else if(k<6){family='circle-scale';mode=two[n%2];setup=[circle];turns=[ok('Scale it by 2'),ok('Find its radius',2*a)];scene={type:'circle',radius:a,scale:2,preserveId:true};}
  else{family='rectangle-rotation-area';setup=[rect];turns=[ok(`Rotate it by ${n%180+1} degrees`),ok('Find its area',a*b)];scene={type:'rectangle',width:a,height:b,preserveId:true};}
 }
 if(category==='context'){
  if(k<3){family='radius-undo-followup';mode=two[n%2];setup=[circle];turns=[ok(`Increase its radius by ${b}`),ok('Undo that'),ok('What is its radius now?',a)];scene={type:'circle',radius:a,preserveId:true};}
  else if(k<6){family='long-relative-width';setup=[rect];const length=[2,5,10,20,50,100][n%6];turns=Array.from({length},()=>ok('Increase its width by 1'));turns.push(ok('Find its area',(a+length)*b));scene={type:'rectangle',width:a+length,height:b,preserveId:true};}
  else{family='angle-relative-words';mode=two[n%2];setup=[`Create an angle of ${20+n/10} degrees`];turns=[ok('Increase it by two degrees'),ok('Make it another three degrees larger')];scene={type:'angle',angle:25+n/10};}
 }
 if(category==='clarification'){
  mode=two[n%2];
  if(k<3){family='line-incremental-definition';turns=[ask('Draw a line'),ask(`Through (${a},${b})`),ok('At 45 degrees')];scene={type:'line',count:1,points:[[a,b],[a+Math.SQRT1_2,b+Math.SQRT1_2]]};}
  else if(k<6){family='circle-ordinal-choice';setup=[circle,`Create circle radius ${a+1}`,'Deselect all'];turns=[ask(`Move that circle left by ${b}`),ok('the second circle')];scene={type:'circle',count:2,position:[-b,0],radius:a+1};}
  else{family='missing-distance-label';setup=[rect];turns=[ask('Move rectangle R1 right'),ok(String(b))];scene={type:'rectangle',position:[b,0],width:a,height:b};}
 }
 if(category==='planning'){
  if(k<4){family='atomic-create-measure-check';turns=[ok(`${rect}; move it right by ${b}; find its area; explain; verify its area is ${a*b}`,true)];scene={type:'rectangle',count:1,width:a,height:b,position:[b,0,...(d===3?[0]:[])]};}
  else{family='atomic-invalid-rollback';setup=[rect];turns=[invalid(`Move it right by ${b}; change its width to -${a}`)];scene={type:'rectangle',count:1,width:a,height:b,preserveId:true};}
 }
 if(category==='algebra'){
  mode='normal';
  if(k<2){family='rational-arithmetic';turns=[ok(`Calculate (${a}*${b}+${b})/${b}`,a+1)];}
  else if(k<4){family='integer-gcd';const gcd=(x:number,y:number):number=>y?gcd(y,x%y):x;turns=[ok(`gcd ${a}, ${b}`,gcd(a,b))];}
  else if(k<6){family='polynomial-substitution';turns=[ok(`Evaluate x^2+${b}*x+1 at x=${a}`,a*a+b*a+1)];}
  else{family='expression-inequivalence';turns=[ok(`Verify x^2+${a} equals x^2+${a+1}`,false)];}
  scene={count:0};
 }
 if(category==='geometry2d'){
  mode=two[n%2];
  if(k<3){family='line-midpoint';setup=[`Draw line (0,0) to (${a},${b})`];turns=[ok('Find its midpoint',[a/2,b/2])];scene={type:'line',count:1};}
  else if(k<5){family='triangle-area';setup=[`Draw triangle ABC with A(0,0), B(${a},0), C(2,${b})`];turns=[ok('Find its area',a*b/2)];scene={type:'triangle',count:1};}
  else if(k<7){family='line-slope';setup=[`Draw line (0,0) to (${a},${b})`];turns=[ok('Find its slope',b/a)];scene={type:'line',count:1};}
  else{family='dependent-centroid';setup=[`Draw triangle ABC with A(0,0), B(${a},0), C(2,${b})`];turns=[ok('Mark its centroid'),ok(`Move triangle ABC right by ${b}`)];scene={type:'point',count:2,position:[(a+2)/3+b,b/3],dependencyCount:1};}
 }
 if(category==='geometry3d'){
  mode=n%2?'geometry3d':'graph3d';
  if(k<3){family='spatial-centroid';setup=[`Draw triangle A(0,0,1), B(${a},0,1), C(0,${b},4)`];turns=[ok('Mark its centroid'),ok(`Move triangle T1 forward by ${b}`)];scene={type:'point',count:2,position:[a/3,b/3,2+b],dependencyCount:1};}
  else if(k<6){family='spatial-midpoint';setup=[`Draw line (0,0,0) to (${a},${b},4)`];turns=[ok('Find its midpoint',[a/2,b/2,2])];scene={type:'line',count:1};}
  else{family='spatial-translation';setup=[`Create point (${a},${b},4)`];turns=[ok(`Move it forward by ${b}`)];scene={type:'point',count:1,position:[a,b,4+b],preserveId:true};}
 }
 if(category==='verification'){
  if(k<3){family='measurement-true';setup=[rect];turns=[ok(`Verify its area is ${a*b}`,true)];scene={type:'rectangle',width:a,height:b,preserveId:true};}
  else if(k<6){family='measurement-false';setup=[rect];turns=[{...ok(`Verify its area is ${a*b+1}`,false),notVerified:true}];scene={type:'rectangle',width:a,height:b,preserveId:true};}
  else{family='false-parallel-proof';mode=two[n%2];setup=[`Draw line (0,0) to (${a},0)`,`Draw line (0,1) to (${a},${b+1})`];turns=[{text:'Prove these lines are parallel',status:'invalid',nonmutation:true,notVerified:true}];scene={count:2};}
 }
 if(category==='pages'){
  mode='geometry2d';setup=[`Create point (${a},${b})`];
  if(k<4){family='unit-circle-reviewed';page='/trigonometry/unit-circle';turns=[ok('Explain this page')];scene={type:'point',count:1,position:[a,b]};}
  else{family='unknown-page-safe';page=`/phase3-unregistered-topic-${a}`;turns=[{text:'Explain this page',status:'unsupported',nonmutation:true,notVerified:true}];scene={type:'point',count:1,position:[a,b]};}
 }
 if(category==='tutor'){
  setup=[rect,'Find its area'];family=k<4?'area-equivalent-answer':'area-misconception-hint';turns=k<4?[ok(`My answer is ${2*a*b}/2`)]:[ok(`I think the area is ${a*b+1}`),ok('Give me a hint'),ok(`My answer is ${a*b}`)];scene={type:'rectangle',count:1,width:a,height:b,preserveId:true};
 }
 if(category==='negative'){
  if(k<3){family='negative-rectangle-dimension';setup=[rect];turns=[invalid(`Change its width to -${a}`)];scene={type:'rectangle',count:1,width:a,height:b,preserveId:true};}
  else if(k<5){family='impossible-triangle';mode=two[n%2];turns=[invalid(`Construct a triangle with sides ${a}, ${b} and ${a+b+1}`)];scene={count:0};}
  else if(k<7){family='zero-denominator';mode='normal';turns=[{text:`Calculate ${a}/0`,nonmutation:true,notVerified:true}];scene={count:0};}
  else{family='deleted-reference';mode=two[n%2];setup=[circle,'Delete it'];turns=[{text:'Find its radius',nonmutation:true,notVerified:true}];scene={count:0};}
 }
 if(category==='persistence'){
  setup=[rect];family=k<4?'save-restore-history':'redo-relative';turns=k<4?[ok(`Move it right by ${b}`),{text:'$SAVE'},ok('Delete all objects'),{text:'$RESTORE'},ok('Undo'),ok('Find its area',a*b)]:[ok(`Increase its width by ${b}`),ok('Undo'),ok('Redo'),ok('Increase its width by 1'),ok('Find its area',(a+b+1)*b)];scene={type:'rectangle',count:1,width:k<4?a:a+b+1,height:b,preserveId:true};
 }
 if(category!=='pages')page=paths[mode];
 return {family,mode,page,initialScene:{setup},turns,expected:{scene,intent,verification:'Independent numeric/coordinate fixture or explicit rejection policy; no universal numerical proof'}};
}
const hash=(s:string)=>crypto.createHash('sha256').update(s).digest('hex');
if(phase==='generate'){
 const seen=new Set<string>(),records:Case[]=[];
 for(const [category,count]of Object.entries(distribution))for(let n=0;n<count;n++){
  const f=fixture(category,n),key=JSON.stringify([f.mode,f.page,f.initialScene,f.turns.map(t=>t.text)]);if(seen.has(key))throw new Error(`Semantic duplicate ${category}:${n}`);seen.add(key);
  const group=parseInt(hash(f.family).slice(0,8),16)%5,partition=group===0?'locked-evaluation':group===1?'regression':'development';
  records.push({id:`RUHI6P3-${category}-${String(n+1).padStart(4,'0')}`,category,partition,difficulty:f.turns.length>10?'stress':f.turns.length>1?'multi-turn':'bounded',...f,provenance:'Seed 20261009. Authored grammar family with controlled numeric/workspace variants. Closed-form arithmetic and Euclidean coordinate oracles authored before execution. Not an unseen human benchmark.'});
 }
 const bytes=records.map(r=>JSON.stringify(r)).join('\n')+'\n';fs.writeFileSync(`${root}/adversarial-10000.jsonl`,bytes);fs.writeFileSync(`${root}/corpus-manifest.json`,JSON.stringify({seed:20261009,total:records.length,sha256:hash(bytes),categories:distribution,families:[...new Set(records.map(r=>r.family))],partitions:Object.fromEntries(['development','regression','locked-evaluation'].map(p=>[p,records.filter(r=>r.partition===p).length])),semanticallyUnique:seen.size,oracleValidation:'Finite integer/rational/coordinate fixtures checked at generation; no runtime-derived expectations. Unsupported policy cases are distinct from solved mathematics.',lockedPolicy:'No training or tuning on locked records. Development/regression run before repair; locked records executed only on frozen final runtime.'},null,2));console.log('GENERATED',records.length);process.exit(0);
}
const records=fs.readFileSync(`${root}/adversarial-10000.jsonl`,'utf8').trim().split('\n').map(s=>JSON.parse(s) as Case),selected=records.filter(r=>phase==='final'||r.partition!=='locked-evaluation'),failures:{family:string}[]=[],results:{category:string;passed:boolean}[]=[],timings:number[]=[];
const close=(actual:unknown,expected:unknown):boolean=>typeof expected==='number'&&typeof actual==='string'&&/^-?\d+(?:\.\d+)?(?:\/-?\d+)?$/.test(actual)?close(actual.split('/').map(Number).reduce((a,b)=>a/b),expected):Array.isArray(expected)?Array.isArray(actual)&&actual.length===expected.length&&expected.every((v,i)=>close(actual[i],v)):typeof expected==='number'?typeof actual==='number'&&Number.isFinite(actual)&&Math.abs(actual-expected)<=1e-8*Math.max(1,Math.abs(expected)):actual===expected;
for(const record of selected){
 const engine=new SemanticEngine(record.mode);engine.setPageContext(record.page);let saved='',originalId:string|undefined;const traces:unknown[]=[],problems:string[]=[];const started=performance.now();
 try{
  for(const text of record.initialScene.setup){const r=await engine.execute(text,async()=>undefined);if(r.status!=='success')problems.push(`SETUP:${text}:${r.status}`);}originalId=engine.snapshot().objects[0]?.id;
  for(const turn of record.turns){const before=geometryState(engine.snapshot());
   if(turn.text==='$SAVE'){saved=engine.exportState();continue;}if(turn.text==='$RESTORE'){await engine.importState(saved,async()=>undefined);continue;}
   const r=await engine.execute(turn.text,async()=>undefined);traces.push({text:turn.text,status:r.status,value:r.value,message:r.message,execution:r.execution,plan:r.plan.actionGraph});
   if(['zero-denominator','deleted-reference'].includes(record.family)&&!['invalid','ambiguous','unsupported'].includes(r.status))problems.push(`REJECTION:${record.family}:${r.status}`);
   if(record.family==='atomic-create-measure-check'&&r.plan.actionGraph?.nodes.length!==5)problems.push('PLAN: expected five explicit ordered operations');
   if(turn.status&&r.status!==turn.status)problems.push(`STATUS:${turn.text}:${r.status} != ${turn.status}`);
   if(turn.value!==undefined&&!close(r.value,turn.value))problems.push(`MATH:${turn.text}:${JSON.stringify(r.value)} != ${JSON.stringify(turn.value)}`);
   if(turn.nonmutation&&before!==geometryState(engine.snapshot()))problems.push(`STATE:${turn.text}: unexpected mutation`);
   if(turn.notVerified&&r.execution?.status==='verified')problems.push(`FALSE_VERIFIED:${turn.text}`);
   if(!turn.status&&r.status==='success')problems.push(`REJECTION:${turn.text}: unexpectedly accepted`);
   if(record.category==='tutor'&&/^My answer/.test(turn.text)&&!/correct|matches/i.test(r.message))problems.push('TUTOR: equivalent correct answer rejected');
   if(record.category==='pages'&&record.family==='unit-circle-reviewed'&&!/circle|sine|cosine/i.test(r.message))problems.push('PAGE: unrelated reviewed definition');
  }
  const state=engine.snapshot(),o=record.expected.scene,object=o.type?state.objects.filter(x=>x.type===o.type).at(-1):undefined;
  if(o.count!==undefined&&state.objects.length!==o.count)problems.push(`COUNT:${state.objects.length} != ${o.count}`);
  if(o.type&&!object)problems.push(`OBJECT: missing ${o.type}`);
  if(object){for(const key of ['width','height','radius','scale'] as const)if(o[key]!==undefined&&!close(object.command[key]??(key==='scale'?1:undefined),o[key]))problems.push(`GEOMETRY:${key}:${object.command[key]} != ${o[key]}`);
   if(o.position&&!close(object.position,o.position))problems.push(`POSITION:${JSON.stringify(object.position)} != ${JSON.stringify(o.position)}`);
   if(o.points&&!close(vertices(object),o.points))problems.push(`VERTICES:${JSON.stringify(vertices(object))} != ${JSON.stringify(o.points)}`);
   if(o.angle!==undefined&&!close(object.command.roboAngle?.degrees,o.angle))problems.push(`ANGLE:${object.command.roboAngle?.degrees} != ${o.angle}`);
   if(o.preserveId&&object.id!==originalId)problems.push('IDENTITY: object ID changed');
  }
  if(o.dependencyCount!==undefined&&state.objects.filter(x=>x.command.roboDependency).length!==o.dependencyCount)problems.push('DEPENDENCY: live construction definition lost');
 }catch(error){problems.push(`EXCEPTION:${String(error)}`);}
 const elapsed=performance.now()-started;timings.push(elapsed);const row={id:record.id,category:record.category,family:record.family,partition:record.partition,passed:problems.length===0,problems,elapsedMs:elapsed};results.push(row);if(problems.length)failures.push({...row,fixture:record,traces,finalScene:engine.snapshot()});
 if(results.length%500===0)console.log('PROGRESS',results.length,'failures',failures.length);
}
timings.sort((a,b)=>a-b);const summary={phase,total:records.length,executed:selected.length,passed:selected.length-failures.length,failed:failures.length,corpusSha256:hash(fs.readFileSync(`${root}/adversarial-10000.jsonl`,'utf8')),scope:'Actual SemanticEngine parser/context/planner/kernel/verifier/semantic scene pipeline. Native browser and neural measurements are separate; adapter is a no-op scene commit, not a native-render proof.',categoryResults:Object.fromEntries(Object.keys(distribution).map(c=>[c,{total:results.filter((r)=>r.category===c).length,failed:results.filter((r)=>r.category===c&&!r.passed).length}])),timing:{samples:timings.length,medianMs:timings[Math.floor(timings.length*.5)],p95Ms:timings[Math.floor(timings.length*.95)],maxMs:timings.at(-1)},failureGroups:Object.fromEntries([...new Set(failures.map(f=>f.family))].map(f=>[f,failures.filter(r=>r.family===f).length]))};
fs.writeFileSync(`${root}/${phase}-corpus-results.jsonl`,results.map(r=>JSON.stringify(r)).join('\n')+'\n');fs.writeFileSync(`${root}/${phase}-failures.json`,JSON.stringify(failures,null,2));fs.writeFileSync(`${root}/${phase}-corpus-summary.json`,JSON.stringify(summary,null,2));console.log('SUMMARY',JSON.stringify(summary));if(failures.length)process.exitCode=1;
