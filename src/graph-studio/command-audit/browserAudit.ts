import corpus from './corpus.json';
import {liveEngine,runSemanticAssistant} from '../../math-robo/intelligence/liveAssistant';
import {SemanticEngine} from '../../math-robo/intelligence/semanticEngine';
import {applyVisualCommand,readRoboScene,waitForRoboWorkspace} from '../../offline-intelligence/workspaceBridge';
import {describeObject} from '../../math-robo/intelligence/sceneContext';
import {COLORS} from '../../offline-intelligence/shapeCatalog';
import {SOLID_SHAPES} from '../../offline-intelligence/shapeCatalog';
import {readGraph3DRenderEvidence} from './Graph3DAuditProbe';
import type {RoboResult,RoboObjectDescriptor} from '../../math-robo/intelligence/types';

const paint=()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
const snapshot=()=>structuredClone(readRoboScene('graph3d'));
const descriptors=()=>snapshot().objects.map(o=>describeObject(o.command,'graph3d','vertices' in o?o.vertices as number[][]:undefined));
const same=(a:unknown,b:unknown):boolean=>typeof a==='number'&&typeof b==='number'?Math.abs(a-b)<1e-6:Array.isArray(a)&&Array.isArray(b)?a.length===b.length&&a.every((v,i)=>same(v,b[i])):a===b;
const geometryKey=(objects:RoboObjectDescriptor[])=>JSON.stringify(objects.map(o=>o.command));
const normalized=(value:string)=>value.replace(/\s|\bz\s*=/g,'').replace(/²/g,'^2').replace(/×/g,'*').replace(/−/g,'-');

export async function runAuditCase(id:number){
  if(!import.meta.env.DEV)throw new Error('Command audits are available only in development.');
  const fixture=corpus.find(c=>c.id===id);if(!fixture)throw new Error('Unknown audit case.');
  if(!await waitForRoboWorkspace('graph3d'))throw new Error('3D workspace did not mount.');
  const engine=liveEngine('graph3d');
  // Clear through the student interface; import a fresh empty conversation/history.
  await runSemanticAssistant('Clear all shapes','graph3d');
  await engine.importState(new SemanticEngine('graph3d').exportState(),c=>applyVisualCommand('graph3d',c));
  const setup:RoboResult[]=[];
  for(const command of fixture.setup)setup.push(await runSemanticAssistant(command,'graph3d'));
  await paint();
  const before=descriptors(),selectionBefore=snapshot().selectedIds,renderBefore=readGraph3DRenderEvidence();
  const started=performance.now();
  const result=await runSemanticAssistant(fixture.command,'graph3d');
  await paint();
  // React camera effects and OrbitControls can settle after the command commits.
  // Give the actual renderer a bounded paint window, as browser visibility checks do.
  const renderDeadline=performance.now()+1500;
  while(performance.now()<renderDeadline){
    const evidence=readGraph3DRenderEvidence();
    const solids=descriptors().filter(o=>o.style.visible!==false&&(o.type==='point'||(SOLID_SHAPES as readonly string[]).includes(o.type)));
    if(solids.every(o=>evidence?.objects.some(m=>(m.layerId===o.id||m.layerId.startsWith(o.id+'-'))&&m.visible&&m.fullyInFrustum)))break;
    await paint();
  }
  const elapsedMs=performance.now()-started,after=descriptors(),renderAfter=readGraph3DRenderEvidence();
  const expected=fixture.expected as Record<string,unknown>;
  const checks:{name:string;passed:boolean;actual?:unknown;expected?:unknown}[]=[];
  const check=(name:string,passed:boolean,actual?:unknown,wanted?:unknown)=>checks.push({name,passed,actual,expected:wanted});
  const unchanged=geometryKey(before)===geometryKey(after);
  const rejected=['invalid','ambiguous','unsupported','unhandled'].includes(result.status);
  const semanticUnsupported=['unsupported','unhandled'].includes(result.status);
  check('Parsed action family',expected.kind==='unsupported'?result.plan.commands.some(c=>fixture.expectedActions.includes(c.action)):same(result.plan.commands.map(c=>c.action),fixture.expectedActions),result.plan.commands.map(c=>c.action),fixture.expectedActions);
  if(expected.kind==='unsupported'){
    check('Capability rejected explicitly',semanticUnsupported,result.status,'unsupported');
    check('No partial scene mutation',unchanged);
  }else if(expected.kind==='invalid'||expected.kind==='clarify'){
    check('Invalid input rejected / missing parameters clarified',expected.kind==='clarify'?result.status==='ambiguous':rejected,result.status);
    check('Rejected input preserves scene',unchanged);
  }else{
    check('Execution succeeds',result.status==='success',result.message);
    if(expected.count!==undefined)check('Logical object count',after.length===expected.count,after.length,expected.count);
    const objects=after.filter(o=>!expected.type||o.type===expected.type);
    const target=expected.kind==='selection'?objects.find(o=>engine.snapshot().selectedIds.includes(o.id)):expected.index?objects[Number(expected.index)-1]:objects.at(-1);
    if(['objects','property'].includes(String(expected.kind))&&expected.type)check('Object type exists',objects.length>0,objects.map(o=>o.type),expected.type);
    for(const property of ['position','points','scale','width','height','depth','radius','rotation','color','visible','expression']){
      if(expected[property]===undefined)continue;
      const actual=property==='position'?target?.position:property==='color'?target?.style.color:property==='visible'?target?.style.visible:target?.command[property as keyof typeof target.command];
      const wanted=property==='color'?COLORS[String(expected.color)]:expected[property];
      const matches=property==='expression'?normalized(String(actual))===normalized(String(wanted)):property==='rotation'&&Array.isArray(actual)&&Array.isArray(wanted)?actual.every((v,i)=>same(((Number(v)%360)+360)%360,((Number(wanted[i])%360)+360)%360)):same(actual,wanted);
      check(property,matches,actual,wanted);
    }
    if(expected.kind==='deleteType'){
      check('All matching types removed',!after.some(o=>o.type===expected.type)&&before.some(o=>o.type===expected.type));
      check('Other object types preserved',before.filter(o=>o.type!==expected.type).every(o=>after.some(a=>a.id===o.id)));
    }
    if(expected.kind==='deleteOne')check('Exactly one object removed',after.length===before.length-1,after.length,before.length-1);
    if(id===27)check('Last created ID removed despite another selection',!!before.at(-1)&&!after.some(o=>o.id===before.at(-1)!.id));
    if(id===124){const cubes=before.filter(o=>o.type==='cube');check('First cube ID removed and later cube retained',!after.some(o=>o.id===cubes[0]?.id)&&after.some(o=>o.id===cubes[1]?.id));}
    if(expected.kind==='duplicate'){
      const added=after.find(o=>!before.some(b=>b.id===o.id)),source=before.find(o=>o.id===engine.snapshot().objects.find(o=>o.id===added?.id)?.originalId);
      check('Duplicate retains geometry and has a new ID',after.length===before.length+1&&!!added&&!!source&&['kind','points','width','height','depth','radius','scale','rotation','color'].every(key=>JSON.stringify(added.command[key as keyof typeof added.command])===JSON.stringify(source.command[key as keyof typeof source.command])));
    }
    if(expected.kind==='query')check('Mathematical query result',same(result.value,expected.value),result.value,expected.value);
    if(expected.kind==='selection')check('Smallest sphere selected',engine.snapshot().selectedIds.length===1&&engine.snapshot().selectedIds.some(id=>after.find(o=>o.id===id)?.command.radius===expected.radius));
    if(expected.kind==='apart')check('Spheres have separate centers',objects.length===2&&!same(objects[0].position,objects[1].position));
    if(expected.kind!=='query'&&expected.kind!=='selection'&&id!==145&&id!==70)check('Committed scene actually changes',!unchanged);
    if(id===145)check('Create/delete compound executes both effects',result.effects.some(e=>e.action==='create')&&result.effects.some(e=>e.roboControl==='delete'));
    if(id===51)check('All object scales updated',after.length===before.length&&after.every(o=>same(o.command.scale,1.5)));
    if(id===130)check('Only third cube recolored',objects.length===5&&objects.filter(o=>o.style.color===COLORS.green).length===1&&objects[2].style.color===COLORS.green);
  }
  const setupPassed=setup.every(r=>r.status==='success');
  check('Preconditions executed successfully',setupPassed,setup.filter(r=>r.status!=='success').map(r=>r.message));
  const rendered=renderAfter?.objects??[];
  check('GPU frame rendered',!!renderAfter&&renderAfter.frames>0&&renderAfter.calls>0);
  check('Mesh coordinates finite',rendered.every(o=>o.finite));
  for(const hidden of after.filter(o=>o.style.visible===false))check('Hidden object absent from renderer',!rendered.some(m=>(m.layerId===hidden.id||m.layerId.startsWith(hidden.id+'-'))&&m.visible));
  if(id>=121&&id<=132)check('Context resolves against committed scene',checks.filter(c=>['position','color','rotation','Logical object count','Exactly one object removed','Duplicate retains geometry and has a new ID','Spheres have separate centers','Smallest sphere selected'].includes(c.name)).every(c=>c.passed));
  if(!rejected&&expected.kind!=='query'&&expected.kind!=='selection'){
    for(const object of after.filter(o=>o.style.visible!==false)){
      const mesh=rendered.filter(m=>m.layerId===object.id||m.layerId.startsWith(object.id+'-'));
      check(`Rendered mesh: ${object.label??object.type}`,mesh.some(m=>m.vertices>0&&m.visible&&m.inFrustum),mesh);
      if(object.type==='point'||(SOLID_SHAPES as readonly string[]).includes(object.type))check(`Full mesh bounds visible: ${object.label??object.type}`,mesh.some(m=>m.visible&&m.fullyInFrustum));
    }
    for(const removed of before.filter(o=>!after.some(a=>a.id===o.id)))check('Deleted object absent from renderer',!rendered.some(m=>m.layerId===removed.id||m.layerId.startsWith(removed.id+'-')));
  }
  const failures=checks.filter(c=>!c.passed);
  const status=failures.length?'failed':semanticUnsupported?'unsupported':'passed';
  return {id,category:fixture.category,command:fixture.command,initialSetup:fixture.setup,expected,expectedVisibleResult:'Finite geometry for every visible logical object, inside the camera frustum; deletions absent. Rejected requests preserve the scene.',actualParserOutput:result.plan,actualExecutionResult:result,setupResults:setup,before,after,selectionBefore,selectionAfter:snapshot().selectedIds,renderBefore,renderAfter,checks,status,elapsedMs,errorCategory:failures.length?(setupPassed?failures.some(f=>/mesh|GPU|renderer/.test(f.name))?'rendering':'interpretation-or-execution':'precondition'):semanticUnsupported?'unsupported-capability':null,rootCause:failures.map(f=>f.name).join('; ')||null,fixVerified:false};
}

export const auditCorpus=corpus;
