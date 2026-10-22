import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
const base=process.env.LESSON_AUDIT_URL||'http://127.0.0.1:5188';
const file='audit/lesson-interactivity/reverse-queue.json';
const state=JSON.parse(await fs.readFile(file,'utf8'));
const sources=JSON.parse(await fs.readFile('audit/lesson-interactivity/source-map.json','utf8'));
const from=Number(process.argv[2]||919),to=Number(process.argv[3]||1);
await fs.mkdir('audit/lesson-interactivity/logs',{recursive:true});
for(const row of state.queue.filter(row=>row.index<=from&&row.index>=to)) {
  const mapping=sources.find(source=>source.index===row.index);
  row.route=mapping?.route??row.route;
  const custom=Boolean(row.verifier);
  let source=custom?await fs.readFile(row.verifier,'utf8'):null;
  source=source?.replaceAll('http://127.0.0.1:5190',base).replaceAll('http://127.0.0.1:5173',base);
  const result=await new Promise(resolve=>{
    const child=spawn(process.execPath,custom?['--input-type=module']:['scripts/verify-lesson-interactivity-smoke.mjs',String(row.index)],{env:{...process.env,LESSON_AUDIT_URL:base},stdio:['pipe','pipe','pipe']});
    let log='';child.stdout.on('data',data=>log+=data);child.stderr.on('data',data=>log+=data);
    const timeout=setTimeout(()=>child.kill(),180000);
    child.on('close',code=>{clearTimeout(timeout);resolve({code,log});});
    child.stdin.end(source??undefined);
  });
  const logFile=`audit/lesson-interactivity/logs/${String(row.index).padStart(4,'0')}.log`;
  await fs.writeFile(logFile,result.log);
  row.status=result.code===0?(custom?'browser-verified':'interaction-verified'):'needs-fix';
  row.verification={log:logFile,checkedAt:new Date().toISOString(),exitCode:result.code};
  await fs.writeFile(file,JSON.stringify(state,null,2));
  console.log(`${row.index}: ${row.status}`);
  if(result.code!==0){console.log(result.log.slice(-2500));break;}
}
