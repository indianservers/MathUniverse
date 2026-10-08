import {SemanticEngine} from './semanticEngine';
import {contextToScene,splitSemanticRows} from './semanticDataset';
import {OPERATIONS} from './actionRegistry';
import {geometryState} from './resultVerifier';
import {runAdversarialSafety} from './adversarialCorpus';
import type {SemanticRow} from './types';
import type {V4Report} from './hierarchicalModel';
export async function assessExecution(rows:SemanticRow[],progress:(text:string)=>void=()=>{}){
 const test=splitSemanticRows(rows).test,covered=new Set<string>(),errors:{phrase:string;reason:string}[]=[];let passed=0,queryMutations=0,contextRows=0,contextPassed=0;
 for(const [index,row] of test.entries()){
  const engine=new SemanticEngine(row.mode),scene=contextToScene(row);engine.sync(scene.objects,scene.selectedIds,{lastReferenced:scene.lastReferenced,previousResult:scene.previousResult,previousResults:scene.previousResults,activeObjectIds:scene.activeObjectIds});if(['UNDO','REDO'].includes(row.action)){await engine.execute(row.mode.endsWith('3d')?'Create a point at (1,2,3)':'Create a point at (1,2)',async()=>undefined);if(row.action==='REDO')await engine.execute('Undo',async()=>undefined);}
  const before=geometryState(engine.snapshot()),result=await engine.execute(row.phrase,async()=>undefined);
  const command=result.plan.commands[0],semantic=command?.action===row.action&&command?.subAction===row.subAction;
  const changed=geometryState(engine.snapshot())!==before;
  if(!OPERATIONS.find(o=>o.action===row.action&&o.subAction===row.subAction)?.mutatesScene&&changed)queryMutations++;
  if(row.context)contextRows++;
  if(result.status==='success'&&semantic){passed++;covered.add(`${row.action}:${row.subAction}`);if(row.context)contextPassed++;}else errors.push({phrase:row.phrase,reason:result.message||`${command?.action}:${command?.subAction}`});
  if(index%100===0){progress(`Execution regression ${index}/${test.length}`);await new Promise(resolve=>setTimeout(resolve,0));}
 }
 const missing=OPERATIONS.filter(o=>o.implemented&&!covered.has(`${o.action}:${o.subAction}`)).map(o=>`${o.action}:${o.subAction}`);
 progress('Running 2,000 intent-negative safety checks…');const adversarial=await runAdversarialSafety();
 return {rows:test.length,passed,accuracy:test.length?passed/test.length:0,contextRows,contextAccuracy:contextRows?contextPassed/contextRows:0,queryMutations,coveredOperations:[...covered],missingOperations:missing,errors,adversarial};
}
export type ExecutionAssessment=Awaited<ReturnType<typeof assessExecution>>;
export function publicationBlocks(report:V4Report|undefined,assessment:ExecutionAssessment|undefined,hasCandidate:boolean){
 const blocks:string[]=[];
 if(!hasCandidate)blocks.push('Train a separate candidate first.');
 if(!report||report.metrics.actionAccuracy<.97)blocks.push('Held-out action accuracy must reach 97%.');
 if(!report||report.metrics.subActionAccuracy<.96)blocks.push('Held-out subaction accuracy must reach 96%.');
 if(!report||Number(report.metrics.macroF1??0)<.96||Number(report.metrics.subActionMacroF1??0)<.96)blocks.push('Both macro-F1 scores must reach 96%.');
 if(!assessment)blocks.push('Run execution, context, and adversarial regression.');
 else {if(assessment.passed!==assessment.rows||assessment.missingOperations.length)blocks.push('Every implemented operation needs a passing held-out execution regression.');if(assessment.queryMutations||assessment.adversarial.falseMutations)blocks.push('Read-only and intent-negative requests must produce zero mutations.');if(assessment.contextAccuracy<.95)blocks.push('Context accuracy must reach 95%.');if(assessment.adversarial.accuracy<.90)blocks.push('Adversarial accuracy must reach 90%.');}
 return blocks;
}
