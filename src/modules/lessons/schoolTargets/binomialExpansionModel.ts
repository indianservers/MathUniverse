import{ciChoose,ciTerm}from'./combinatorialInterpretationModel';
export const beColors=['#8543e3','#2560f2','#14c7c8','#d2a21b','#bd3d9f','#e06e3e','#70a94b','#7668d9','#45a6ce'];
export function beModel(n:number){return{coefficients:Array.from({length:n+1},(_,r)=>ciChoose(n,r)),terms:Array.from({length:n+1},(_,r)=>ciTerm(n,r))};}
export function beTiles(n:number){const cols=2**Math.ceil(n/2),rows=2**Math.floor(n/2);const tiles=Array.from({length:2**n},(_,i)=>{const word=n===0?'':i.toString(2).padStart(n,'0').replace(/0/g,'a').replace(/1/g,'b');return{word,r:[...word].filter(c=>c==='b').length};}).sort((a,b)=>a.r-b.r||a.word.localeCompare(b.word));return{cols,rows,tiles:tiles.map((t,i)=>({...t,x:i%cols,y:Math.floor(i/cols)}))};}
export const beAreas=[{word:'aa',r:0,x:0,y:0,w:2,h:2,label:'a²'},{word:'ab',r:1,x:2,y:0,w:1,h:2,label:'ab'},{word:'ba',r:1,x:0,y:2,w:2,h:1,label:'ab'},{word:'bb',r:2,x:2,y:2,w:1,h:1,label:'b²'}];
export const beValid=(s:string)=>s.trim()!==''&&Number.isInteger(Number(s))&&Number(s)>=0&&Number(s)<=8;
