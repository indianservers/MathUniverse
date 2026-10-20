import fs from 'node:fs/promises';
import {spawn} from 'node:child_process';
const base=process.env.LESSON_AUDIT_URL||'http://127.0.0.1:5192';
const file='audit/lesson-interactivity/reverse-queue.json';
const state=JSON.parse(await fs.readFile(file,'utf8'));
const sources=JSON.parse(await fs.readFile('audit/lesson-interactivity/source-map.json','utf8'));
const from=Number(process.argv[2]||919),to=Number(process.argv[3]||1),concurrency=Number(process.argv[4]||3);
const rows=state.queue.filter(row=>row.index<=from&&row.index>=to&&!['browser-verified','interaction-verified'].includes(row.status));
state.verificationStrategy='Checks start in descending order; independent browser sessions may overlap. Fixes proceed in descending order.';
let cursor=0,committed=0,stopped=false,flush=Promise.resolve();const completed=new Map();
await fs.mkdir('audit/lesson-interactivity/logs',{recursive:true});
async function check(row) {
 const custom=Boolean(row.verifier);let source=custom?await fs.readFile(row.verifier,'utf8'):null;
 source=source?.replaceAll('http://127.0.0.1:5190',base).replaceAll('http://127.0.0.1:5173',base);
 return new Promise(resolve=>{
  const child=spawn(process.execPath,custom?['--input-type=module']:['scripts/verify-lesson-interactivity-smoke.mjs',String(row.index)],{env:{...process.env,LESSON_AUDIT_URL:base},stdio:['pipe','pipe','pipe']});
  let log='';child.stdout.on('data',value=>log+=value);child.stderr.on('data',value=>log+=value);
  const timeout=setTimeout(()=>{log+='\nVerification timeout (180 seconds).';child.kill();},180000);
  child.on('close',code=>{clearTimeout(timeout);resolve({code,log,custom});});child.stdin.end(source??undefined);
 });
}
async function save() {
 while(completed.has(committed)) {
  const {row,result}=completed.get(committed);completed.delete(committed++);
  const logFile=`audit/lesson-interactivity/logs/${String(row.index).padStart(4,'0')}.log`;
  await fs.writeFile(logFile,result.log);
  row.route=sources.find(source=>source.index===row.index)?.route??row.route;
  row.status=result.code===0?(result.custom?'browser-verified':'interaction-verified'):'needs-fix';
  row.verification={log:logFile,checkedAt:new Date().toISOString(),exitCode:result.code,base};
  console.log(`${row.index}: ${row.status}`);if(result.code!==0)console.log(result.log.slice(-2000));
 }
 await fs.writeFile(file+'.next',JSON.stringify(state,null,2));for(let attempt=0;;attempt++){try{await fs.rename(file+'.next',file);break;}catch(error){if(!['EPERM','EBUSY','EACCES'].includes(error.code)||attempt>=7)throw error;await new Promise(resolve=>setTimeout(resolve,Math.min(1000,50*2**attempt)));}}
}
async function worker(){while(!stopped&&cursor<rows.length){const position=cursor++,row=rows[position];const result=await check(row);if(result.code!==0)stopped=true;completed.set(position,{row,result});flush=flush.then(save);await flush;}}
await Promise.all(Array.from({length:concurrency},worker));await flush;
console.log(stopped?'Stopped for a lesson that needs attention.':'Requested reverse range completed.');process.exitCode=stopped?1:0;
