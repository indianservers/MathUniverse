export type ATLane10056='assumed'|'proved';
export const atStatements10056=[
{id:'A1',text:'The whole is greater than a proper part (finite Euclidean lengths).',type:'Axiom',lane:'assumed'},
{id:'A2',text:'Through two distinct points, there is exactly one line.',type:'Axiom',lane:'assumed'},
{id:'D1',text:'Definition: Vertically opposite angles are the non-adjacent angles formed by two intersecting lines.',type:'Definition',lane:'assumed'},
{id:'T1',text:'If a ray stands on a line, the two adjacent angles sum to 180°.',type:'Theorem',lane:'proved'},
{id:'T2',text:'Vertically opposite angles are equal.',type:'Theorem',lane:'proved'}] as const;
export const atInitial10056:Record<string,ATLane10056>=Object.fromEntries(atStatements10056.map(s=>[s.id,s.lane]));
export const atClassify10056=(placed:Record<string,ATLane10056>)=>atStatements10056.every(s=>placed[s.id]===s.lane);
export function atChallenge10056(ids:string[]){const supported=ids.every(id=>atStatements10056.some(s=>s.id===id))&&new Set(ids).size===ids.length;const target=ids.indexOf('T2'),d=ids.indexOf('D1'),t=ids.indexOf('T1');const valid=supported&&d>=0&&t>=0&&target>d&&target>t;return{valid,minimal:valid&&ids.length===3,links:valid?2:0};}
function decimal(s:string){if(s.length>64||!/^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[-+]?\d+)?$/i.test(s.trim()))return null;const[m,e='0']=s.trim().toLowerCase().split('e'),exponent=Number(e);if(Math.abs(exponent)>300)return null;const[w,f='']=m.split('.');return{n:BigInt((w==='-'?'-0':w==='+'?'+0':w||'0')+f),scale:exponent-f.length};}
export function atCompare10056(a:string,b:string){const x=decimal(a),y=decimal(b);if(!x||!y)return null;const d=Math.min(x.scale,y.scale);const n=x.n*10n**BigInt(x.scale-d)-y.n*10n**BigInt(y.scale-d);return n>0n?1:n<0n?-1:0;}
export function atTest10056(whole:string,part:string,domain:'numbers'|'lengths'){const cmp=atCompare10056(whole,part);if(cmp===null)return'invalid';if(domain==='lengths'&&(atCompare10056(whole,'0')!==1||atCompare10056(part,'0')!==1||cmp!==1))return'outside';return cmp===1?'holds':'found';}
