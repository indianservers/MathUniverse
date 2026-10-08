import fs from 'node:fs';
/** Pure bounded controller. Repairs are diagnostic-driven Codex source changes,
 * not generated JavaScript or neural weights masquerading as geometry logic. */
export function loopDecision(history,report,guards={}){
 if(report.errors?.length)return {stop:true,reason:'Infrastructure errors prevent reliable evaluation'};
 const dimensions=['intent','entities','context','clarification','geometry'];
 const target=report.endToEndAccuracy>=.98&&report.scenarios.passed/report.scenarios.total>=.98&&dimensions.every(name=>report.metrics[name]?.accuracy>=.98);
 const critical=report.results.some(row=>row.status==='failed'&&row.dimensions?.geometry===false);
 const guarded=['conversations','persistence','priorRegression','unitRegression','studentBuild'].every(name=>guards[name]===true);
 if(target&&!critical&&guarded)return {stop:true,reason:'At least 98% on evaluated dimensions and scenarios; no failing geometry invariants; required regression and student-build guards passed'};
 if(history.length>=20)return {stop:true,reason:'Maximum 20 repair cycles reached'};
 const last=history.slice(-4);if(last.length===4&&last.slice(1).every((row,index)=>row.passed<=last[index].passed))return {stop:true,reason:'No meaningful improvement in three consecutive cycles'};
 return {stop:false,reason:target&&!guarded?'Complete required regression and student-build guards before declaring the target reached':'Continue diagnostic-driven repairs; validation and held-out remain separate'};
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/ruhi-2d-nlp-loop.mjs')){
 const dir='reports/ruhi-2d-nlp',history=fs.readdirSync(dir).filter(name=>/^cycle-\d\d\.json$/.test(name)).sort().map(name=>JSON.parse(fs.readFileSync(`${dir}/${name}`,'utf8')));
 const read=name=>JSON.parse(fs.readFileSync(`${dir}/${name}.json`,'utf8'));
 const name=process.argv[2]??'final-regression',report=read(name),guards=fs.existsSync(`${dir}/regression-results.json`)?read('regression-results').guards:{},decision=loopDecision(history,report,guards);
 fs.writeFileSync(`${dir}/loop-control.json`,JSON.stringify({maxCycles:20,cycles:history.map(({phase,subset,passed,total,endToEndAccuracy})=>({phase,subset,passed,total,endToEndAccuracy})),evaluatedScope:report.subset,guards,...decision},null,2));console.log(decision);
}
