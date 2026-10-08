import fs from 'node:fs';
import {evaluateRecord} from './ruhi-2d-nlp-oracle.mjs';
export function rescore(report,dataset){
 const history=new Map();const results=report.results.map(row=>{if(row.status==='blocked'||!row.before)return row;const prior=history.get(row.scenarioId)??[],record=dataset.records.find(r=>r.id===row.id),evaluation=evaluateRecord(record,row.before,row.after,row.actual,prior),next={...row,...evaluation,status:evaluation.passed?'passed':'failed'};prior.push(next);history.set(row.scenarioId,prior);return next;});
 const passed=results.filter(r=>r.status==='passed').length,failed=results.filter(r=>r.status==='failed').length,metrics={};
 for(const name of ['intent','entities','numeric','context','clarification','geometry','execution','response']){const rows=results.filter(r=>r.status!=='blocked'&&r.dimensions?.[name]!=null),n=rows.filter(r=>r.dimensions[name]).length;metrics[name]={passed:n,total:rows.length,accuracy:rows.length?n/rows.length:null};}
 const scenarios=[...new Set(results.map(r=>r.scenarioId))];return {...report,rescoredAt:new Date().toISOString(),rescorePolicy:'Identical stored commands, responses and native scenes; no application rerun or changed expected semantics.',passed,failed,endToEndAccuracy:passed/report.total,metrics,scenarios:{passed:scenarios.filter(id=>results.filter(r=>r.scenarioId===id).every(r=>r.status==='passed')).length,total:scenarios.length},results};
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/ruhi-2d-nlp-rescore.mjs')){
 const name=process.argv[2]??'baseline',datasetPath=process.argv[3]??'datasets/ruhi-2d-nlp/v1.normalized.json',report=rescore(JSON.parse(fs.readFileSync(`reports/ruhi-2d-nlp/${name}.json`,'utf8')),JSON.parse(fs.readFileSync(datasetPath,'utf8')));
 fs.writeFileSync(`reports/ruhi-2d-nlp/${name}-rescored.json`,JSON.stringify(report,null,2));console.log(name,report.passed,report.failed,report.blocked);
}
