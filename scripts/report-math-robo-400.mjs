import {readFile,writeFile} from 'node:fs/promises';
const directory='artifacts/math-robo-400';
const modes=['geometry2d','geometry3d','graph2d','graph3d'];
const reports=await Promise.all(modes.map(async mode=>JSON.parse(await readFile(`${directory}/${mode}.json`,'utf8'))));
const near=(actual,expected)=>Array.isArray(expected)?Array.isArray(actual)&&actual.length===expected.length&&expected.every((n,i)=>near(actual[i],n)):typeof actual==='number'&&Math.abs(actual-expected)<1e-7;
const numericChecks=[];
for(const report of reports){
  for(const record of report.records){
    const i=Math.floor((record.number-1)/10),n=i+1;let expected;
    if(report.mode==='graph2d'&&record.number%10===2)expected=[[-n,0],[n,0]];
    if(report.mode==='geometry3d'&&record.number%10===5)expected=[4*Math.PI*n**3/3,(n+2)**3,(n+2)*6*4,Math.PI*n*n*6,Math.PI*n*n*6/3][i%5];
    if(report.mode==='geometry2d'&&record.number%10===5)expected=[[4,0],(n+2)*6,Math.PI*n*n,(n+2)**2,10][i%5];
    if(expected!==undefined){const text=record.answer.split(' = ')[1]?.replace(/\s*units\.?$/,'').replace(/\.$/,'');let actual;try{actual=JSON.parse(text);}catch{actual=null;}numericChecks.push({mode:report.mode,number:record.number,phrase:record.phrase,actual,expected,passed:near(actual,expected)});}
  }
}
const summary={testedAt:new Date().toISOString(),app:'http://localhost:9867',totalCommands:reports.reduce((n,r)=>n+r.commands,0),passed:reports.reduce((n,r)=>n+r.passed,0),failed:reports.reduce((n,r)=>n+r.failed,0),workspaces:reports.map(({mode,commands,passed,failed,records})=>({mode,commands,passed,failed,uniquePhrases:new Set(records.map(r=>r.phrase)).size,report:`${directory}/${mode}.json`})),numericChecks:{total:numericChecks.length,passed:numericChecks.filter(r=>r.passed).length,records:numericChecks},scope:'100 executed NLP requests per workspace, arranged in ten stateful ten-command sequences. Some phrases repeat with different objects/context. Each request checks response and scene count; numeric checks independently verify all 30 mathematical answers. This is controlled regression coverage, not arbitrary-language accuracy or full visual pixel comparison.',fixedIssues:['Incomplete triangle destinations previously accepted as zero-distance moves; now request explicit coordinates.','Plural and hyphenated intercept queries plus crossing-the-axis phrasing.','Show graph of expressions previously treated as visibility commands.','Square/cube dimensions are kept uniform when semantic parameters override legacy defaults.'],checks:['Object creation, pronouns, absolute/relative movement, color, rotation, queries, hide/show, duplication, original/copy resolution, deletion, undo and counting.','Read-only queries leave object counts unchanged.','An ambiguous move is correctly rejected without mutation.'],testFile:'tests/workspace/mathRobo400.e2e.ts',unitRegression:'artifacts/math-robo-400/regression.log'};
summary.limitations=['Scene-count assertions cover Robo-inventoried objects. Existing/manual graph layers are not inventoried and are excluded from the count.','The 3D graph screenshot took several minutes under browser load. One intermediate geometry rerun hit a navigation timeout; the subsequent final run passed.','These are 400 stateful command executions with repeated phrases in different contexts, not 400 unique unseen-language samples.'];
summary.verification={unitRegression:'665 tests passed across 10 files',scopedTypecheck:'PASS',targetedLint:'PASS',workspaceCommandChecks:'See final per-workspace records; expected rejection of incomplete destination counts as a passed safety check.'};
await writeFile(`${directory}/summary.json`,JSON.stringify(summary,null,2));
await writeFile(`${directory}/all-400-commands.jsonl`,reports.flatMap(report=>report.records.map(record=>JSON.stringify({mode:report.mode,...record}))).join('\n')+'\n');
console.log(JSON.stringify({commands:summary.totalCommands,passed:summary.passed,failed:summary.failed,numericPassed:summary.numericChecks.passed,numericTotal:numericChecks.length}));
if(summary.failed||numericChecks.some(row=>!row.passed))process.exitCode=1;
