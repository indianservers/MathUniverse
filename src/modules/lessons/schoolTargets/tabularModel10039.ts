import{fpParse10052}from'./factorisationPracticeModel10052';
export const tpRules10039=['a','b','2a','2b','a + b','a - b','2a + b','a + 2b','3a','b - a']as const;
export const tpRows10039=[[1,2,4],[3,4,10],[5,7,null]]as const;
export function tpParse10039(raw:string){const p=fpParse10052(raw);if(!p.valid)return{valid:false as const,error:p.error};let a=0,b=0,k=0;for(const[key,c]of p.p){const e=key.split(',').map(Number);if(e[2]||e[3]||e[0]+e[1]>1||c.d!==1n||c.n< -100n||c.n>100n)return{valid:false as const,error:'Use an integer affine rule A·a + B·b + C, with each coefficient from −100 to 100.'};if(e[0])a=Number(c.n);else if(e[1])b=Number(c.n);else k=Number(c.n);}return{valid:true as const,error:'',a,b,k};}
export const tpEvaluate10039=(c:{a:number;b:number;k:number},a:number,b:number)=>c.a*a+c.b*b+c.k;
export function tpRead10039(raw:string){const s=raw.trim().replace(/−/g,'-');if(!/^[+-]?\d{1,6}$/.test(s))return null;const n=Number(s);return Math.abs(n)<=10000?n:null;}
export function tpState10039(raw:string,answer:string){const rule=tpParse10039(raw),output=tpRead10039(answer);if(!rule.valid)return{valid:false as const,error:rule.error,rule,output,generated:[] as number[],matches:[null,null,null]as(boolean|null)[],givenFits:false,allMatch:false,count:0};const generated=tpRows10039.map(r=>tpEvaluate10039(rule,r[0],r[1])),matches=tpRows10039.map((r,i)=>i===2?output===null?null:generated[i]===output:generated[i]===r[2]),givenFits=matches[0]===true&&matches[1]===true;return{valid:true as const,error:'',rule,output,generated,matches,givenFits,allMatch:matches.every(v=>v===true),count:matches.filter(Boolean).length};}
export const tpChallenges10039=[
 {rows:[[1,2,4],[3,4,10],[5,7,null]],options:['a + b + 1','2a + b','a + 2b','3a - b']},
 {rows:[[2,1,4],[4,3,10],[6,5,null]],options:['2a + b','a + b','a + 2b','3b']},
 {rows:[[1,2,1],[3,1,8],[5,4,null]],options:['3a - b','2a + b','a + b + 1','b - a']},
 {rows:[[1,1,3],[3,2,6],[4,5,null]],options:['a + b','2a + b','3a - b','a + b + 1']},
]as const;
export function tpChallenge10039(index:number,choice:number|null){const d=tpChallenges10039[index];if(!d||choice===null||!Number.isInteger(choice)||choice<0||choice>=d.options.length)return{correct:false,generated:[]as number[],matches:[]as boolean[],prediction:null as number|null,label:''};const label=d.options[choice],r=tpParse10039(label);if(!r.valid)throw Error('Invalid fixed challenge rule.');const generated=d.rows.map(row=>tpEvaluate10039(r,row[0],row[1])),matches=d.rows.slice(0,2).map((row,i)=>generated[i]===row[2]);return{correct:matches.every(Boolean),generated,matches,prediction:generated[2],label};}
