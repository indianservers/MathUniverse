export type FcKind10035='start'|'read'|'parity'|'zeroTest'|'positiveTest'|'even'|'odd'|'zero'|'positive'|'negative'|'end';
export type FcEdges10035=Record<string,FcKind10035|null>;
export const fcMainNodes10035:FcKind10035[]=['start','read','parity','even','odd','end'];
export const fcPracticeNodes10035:FcKind10035[]=['start','read','zeroTest','zero','positiveTest','positive','negative','end'];
export const fcLabels10035:Record<FcKind10035,string>={start:'Start',read:'Read n',parity:'n mod 2 = 0 ?',zeroTest:'n = 0 ?',positiveTest:'n > 0 ?',even:'Output Even',odd:'Output Odd',zero:'Output Zero',positive:'Output Positive',negative:'Output Negative',end:'End'};
export const fcPorts10035=(n:FcKind10035)=>n==='end'?[]:['parity','zeroTest','positiveTest'].includes(n)?['yes','no']:['next'];
export const fcSlot10035=(n:FcKind10035,p:string)=>n+'.'+p;
export const fcMainEdges10035:FcEdges10035={'start.next':'read','read.next':'parity','parity.yes':'even','parity.no':'odd','even.next':'end','odd.next':'end'};
export const fcPracticeEdges10035:FcEdges10035={'start.next':'read','read.next':'zeroTest','zeroTest.yes':'zero','zeroTest.no':'positiveTest','zero.next':null,'positiveTest.yes':'positive','positiveTest.no':'negative','positive.next':'end','negative.next':'end'};
export function fcNumber10035(raw:string,integer=false){
 const s=raw.trim();if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)||s.replace(/\D/g,'').length>60)return{valid:false as const,error:'Enter a signed decimal number with at most 60 digits.'};
 const negative=s.startsWith('-'),text=s.replace(/^[+-]/,''),parts=text.split('.'),scale=10n**BigInt(parts[1]?.length??0),numerator=BigInt((parts[0]||'0')+(parts[1]||''))*(negative?-1n:1n);
 if(integer&&numerator%scale!==0n)return{valid:false as const,error:'Parity requires an integer. Keep the fractional input unchanged and enter an integer.'};
 return{valid:true as const,numerator,scale,integer:numerator/scale,sign:numerator<0n?-1:numerator>0n?1:0,error:''};
}
export function fcTrace10035(raw:string,edges:FcEdges10035,practice=false){
 const number=fcNumber10035(raw,!practice),nodes=practice?fcPracticeNodes10035:fcMainNodes10035,trace:Array<{node:FcKind10035;port:string|null;output:string|null}>=[];
 if(!number.valid)return{trace,error:number.error,complete:false,output:null as string|null};
 let node:FcKind10035='start',output:string|null=null,read=false;const seen=new Set<FcKind10035>();
 while(true){
  if(!nodes.includes(node))return{trace,error:'Connection leaves this flowchart.',complete:false,output};
  if(seen.has(node))return{trace,error:'Cycle detected: '+fcLabels10035[node]+' repeats.',complete:false,output};seen.add(node);
  if(node==='read')read=true;
  if(!read&&!['start','read','end'].includes(node))return{trace,error:'Read n before testing a condition or producing output.',complete:false,output};
  const branch=node==='parity'?number.integer%2n===0n:node==='zeroTest'?number.sign===0:node==='positiveTest'?number.sign>0:null;
  const port=node==='end'?null:branch===null?'next':branch?'yes':'no';
  const nextOutput=['even','odd','zero','positive','negative'].includes(node)?node[0].toUpperCase()+node.slice(1):null;
  if(nextOutput&&output!==null)return{trace,error:'A path reaches more than one output.',complete:false,output};
  if(nextOutput)output=nextOutput;trace.push({node,port,output});
  if(node==='end')return{trace,error:output===null?'End reached without an output.':'',complete:output!==null,output};
  const next=edges[fcSlot10035(node,port!)];if(!next)return{trace,error:'Missing '+port+' connection after '+fcLabels10035[node]+'.',complete:false,output};node=next;
 }
}
export function fcValidate10035(edges:FcEdges10035,practice=false){
 const nodes=practice?fcPracticeNodes10035:fcMainNodes10035,missing:string[]=[],errors:string[]=[];
 for(const n of nodes)for(const p of fcPorts10035(n)){const slot=fcSlot10035(n,p);if(!edges[slot])missing.push(slot);else if(!nodes.includes(edges[slot]!))errors.push('Unknown target at '+slot);}
 const probes=practice?[['-1','Negative'],['0','Zero'],['1','Positive']]:[['2','Even'],['3','Odd']],visited=new Set<FcKind10035>();
 for(const[raw,expected]of probes){const t=fcTrace10035(raw,edges,practice);t.trace.forEach(s=>visited.add(s.node));if(!t.complete||t.output!==expected)errors.push('Input '+raw+': '+(t.error||'expected '+expected+', received '+t.output));}
 if(nodes.some(n=>!visited.has(n)))errors.push('Some steps are unreachable from Start.');
 return{valid:missing.length===0&&errors.length===0,missing,errors};
}
