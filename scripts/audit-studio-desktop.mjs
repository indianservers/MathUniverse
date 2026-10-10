import { readFileSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
const path='artifacts/all-studio-responsive-audit.json';
const initial=JSON.parse(readFileSync(path,'utf8'));
const completed=new Set(initial.results.filter(r=>r.width===1920).map(r=>r.route));
const remaining=initial.routes.filter(r=>!completed.has(r));
await Promise.all(Array.from({length:4},async(_,i)=>{
 const routes=remaining.filter((_,j)=>j%4===i);
 if(!routes.length)return;
 await new Promise((resolve,reject)=>{
  const child=spawn(process.execPath,['scripts/audit-studio-mobile.mjs'],{env:{...process.env,STUDIO_AUDIT_ROUTES:routes.join(','),STUDIO_AUDIT_WIDTHS:'390,1366,1920',STUDIO_AUDIT_OUTPUT:`artifacts/responsive-audit-${i}.json`},stdio:['ignore','pipe','pipe'],windowsHide:true});
  child.stdout.on('data',d=>process.stdout.write(`Worker ${i}: ${d}`));child.stderr.on('data',d=>process.stderr.write(d));child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error(`Audit worker ${i}: ${code}`)));
 });
}));
const results=[...initial.results.filter(r=>!Array.isArray(r)),...Array.from({length:4},(_,i)=>JSON.parse(readFileSync(`artifacts/responsive-audit-${i}.json`,'utf8')).results).flat()];
writeFileSync(path,JSON.stringify({...initial,results},null,2));
const failures=results.filter(r=>r.error||r.documentOverflow||r.overflowing?.length||r.errors?.length||r.styleIssues?.length);
console.log(JSON.stringify({routes:initial.routes.length,cases:results.length,failures:failures.map(r=>({route:r.route,width:r.width,error:r.error,overflow:r.overflowing,errors:r.errors}))},null,2));
