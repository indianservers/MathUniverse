export const siBases={8:[3,5],9:[3,3,3],10:[5,5]};
export function siRepresent(value:number){if(!Number.isInteger(value)||value<0)return null;for(let fives=Math.floor(value/5);fives>=0;fives--){const rest=value-fives*5;if(rest%3===0)return[...Array<number>(fives).fill(5),...Array<number>(rest/3).fill(3)];}return null;}
export const siValid=(s:string)=>s.trim()!==''&&Number.isInteger(Number(s))&&Number(s)>=10&&Number(s)<=30;
export function siModel(k:number,chosen:number,mode:'strong'|'ordinary',checked:boolean){const support=mode==='ordinary'?k:chosen,tiles=siRepresent(support)??[],next=[...tiles,3],available=mode==='strong'?support>=8&&support<=k:support===k,step=support+3===k+1;return{support,tiles,next,available,step,total:next.reduce((a,b)=>a+b,0),valid:checked&&available&&step};}
export function siSupports(k:number){return Array.from({length:k-7},(_,i)=>i+8);}
