const fs=require('fs');
const file='artifacts/lesson-layout-complete-audit/checks.json';
const source=fs.readFileSync(file,'utf8');
let depth=0,string=false,escape=false,last=-1;
for(let i=0;i<source.length;i++){
 const c=source[i];
 if(string){if(escape)escape=false;else if(c==='\\')escape=true;else if(c==='"')string=false;}
 else if(c==='"')string=true;
 else if(c==='{'||c==='[')depth++;
 else if(c==='}'||c===']'){depth--;if(depth===1&&c==='}')last=i;}
}
const results=JSON.parse(source.slice(0,last+1)+']');
fs.writeFileSync(file,JSON.stringify(results));
console.log({recovered:results.length,bytes:source.length});
