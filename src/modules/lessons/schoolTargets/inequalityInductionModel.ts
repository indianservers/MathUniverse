export type IIScale='log'|'linear';
export function iiHeight(value:number,limit:number,scale:IIScale){return 48*(scale==='log'?Math.log2(value)/limit:value/2**limit);}
export function iiRows(limit:number,scale:IIScale){return Array.from({length:limit},(_,i)=>{const n=i+1,power=2**n,linear=n+1;return{n,power,linear,holds:power>=linear,powerHeight:iiHeight(power,limit,scale),linearHeight:iiHeight(linear,limit,scale)};});}
