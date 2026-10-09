import fs from 'node:fs';
import crypto from 'node:crypto';
import {SemanticEngine} from '../src/math-robo/intelligence/semanticEngine';
import type {RoboMode} from '../src/math-robo/intelligence/types';
import {geometryState} from '../src/math-robo/intelligence/resultVerifier';
const dir='reports/ruhi-v6-phase2',modes:RoboMode[]=['graph2d','geometry2d','graph3d','geometry3d'];
type Family={id:string;category:string;modes:RoboMode[];turns:(n:number)=>{text:string;status:string}[]};
const ok=(...texts:string[])=>texts.map(text=>({text,status:'success'})),two=modes.filter(m=>m.endsWith('2d'));
const families:Family[]=[
 {id:'dimension-continuity',category:'drawing styling relative dimension rotation measurement undo',modes,turns:n=>ok(`Draw rectangle width ${n+3} height ${n+5}`,'Change its color to blue','Increase its width by 2','Rotate it 30 degrees','Find its area','Undo')},
 {id:'circle-choice',category:'ambiguous reference clarification ordinal movement',modes:two,turns:n=>[...ok(`Create circle radius ${n+2}`,`Create circle radius ${n+3}`,'Deselect all'),{text:'Move that circle left by 2',status:'ambiguous'},...ok('the second circle')]},
 {id:'relative-angle',category:'angle numerical followup informal words',modes:two,turns:n=>ok(`Create an angle of ${n+70} degrees`,'Increase it by two degrees','Increase it by another three')},
 {id:'triangle-dependencies',category:'compound constructions live dependencies proof',modes:two,turns:n=>ok(`Draw triangle ABC with A(0,0), B(${n+5},0), C(2,4); construct its medians; mark its centroid; construct its circumcircle`,'Move triangle ABC right by 3','Prove the circumcenter is equidistant from the vertices','Undo')},
 {id:'rectangle-tutor',category:'misconception hint answer equivalence detailed explanation',modes,turns:n=>ok(`Create rectangle ${n+4} by ${n+4}`,'Find its area','I think the area is 2','Give me a hint',`My answer is ${2*(n+4)**2}/2`,'Explain in detail')},
 {id:'missing-line',category:'incomplete command coordinates angle clarification',modes:two,turns:n=>[{text:'Draw a line',status:'ambiguous'},...ok(`Through (${n},3) at 45 degrees`,'Find its slope')]},
 {id:'fuzzy-scale',category:'vague numerical intent ambiguity followup',modes,turns:n=>[...ok(`Create rectangle width ${n+3} height ${n+5}`),{text:'Make it a little larger',status:'ambiguous'},...ok('1.5','Undo')]},
 {id:'atomic-success',category:'multiintent create transform measure explain verify',modes,turns:n=>ok(`Draw rectangle width ${n+3} height ${n+5}; move it right by 2; find its area; explain; verify its area is ${(n+3)*(n+5)}`,'Undo')},
 {id:'negative-size',category:'contradiction rollback negative case',modes,turns:n=>[...ok(`Create rectangle width ${n+3} height ${n+5}`),{text:'Decrease its width by 100',status:'invalid'},...ok('Find its area')]},
 {id:'stale-tutor',category:'state invalidation session task',modes,turns:n=>[...ok(`Create rectangle ${n+4} by ${n+4}`,'Find its area','Give me a hint',`Change its width to ${n+6}`),{text:`My answer is ${(n+4)**2}`,status:'invalid'}]},
 {id:'triangle-inequality',category:'contradictory construction negative case',modes:two,turns:n=>[{text:`Draw a triangle with sides 3, 4 and ${n+10}`,status:'invalid'}]},
 {id:'bounded-typo',category:'spelling error synonym drawing transformation',modes,turns:n=>ok(`Draw a rectagle width ${n+3} height ${n+5}`,'Shift it two units right','Color it blue','Find its area')},
];
const records:unknown[]=[],failures:unknown[]=[];let conversations=0;
for(const [familyIndex,family]of families.entries())for(const mode of family.modes)for(let variant=0;variant<12;variant++){
 const engine=new SemanticEngine(mode),partition=familyIndex<6?'train':familyIndex<8?'validation':familyIndex<10?'calibration':'holdout';let valid=true;const pending=[];
 for(const [index,turn]of family.turns(variant).entries()){
  const before=engine.snapshot(),memory=engine.mathematicalMemory(),hash=geometryState(before),result=await engine.execute(turn.text,async()=>undefined),after=engine.snapshot();
  if(result.status!==turn.status||(['invalid','ambiguous'].includes(turn.status)&&geometryState(after)!==hash)){failures.push({family:family.id,mode,variant,index,text:turn.text,expected:turn.status,status:result.status,message:result.message});valid=false;break;}
  pending.push({id:`${family.id}:${mode}:${variant}:${index}`,family:family.id,partition,category:family.category,mode,question:turn.text,context:before,workingMemory:memory.working,currentTask:memory.session.currentTask,expected:{status:turn.status,value:result.value,commandIR:result.plan.ir,execution:result.execution},after:after,provenance:'Controlled synthetic dialogue; predeclared status oracle and nonmutation checks. Successful geometry correctness is additionally checked by independent focused tests; runtime-generated command IR is a candidate label, not an independent mathematical oracle.'});
 }
 if(valid){records.push(...pending);conversations++;}
}
const bytes=records.map(r=>JSON.stringify(r)).join('\n')+'\n';fs.writeFileSync(`${dir}/conversation-corpus.jsonl`,bytes);
fs.writeFileSync(`${dir}/conversation-corpus-audit.json`,JSON.stringify({records:records.length,conversations,families:families.length,variantsPerFamily:12,sha256:crypto.createHash('sha256').update(bytes).digest('hex'),failures,quality:'Only complete conversations passing predeclared statuses and nonmutation checks retained. Numeric variants and mode variants are grouped within one family; not independent human language.',training:'Not fitted into the context-only candidate. Prepared for trainer review and richer future semantic heads.'},null,2));console.log('Dialogues',conversations,'records',records.length,'failed cases',failures.length);
if(failures.length)process.exitCode=1;
