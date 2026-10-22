export type MagicGrid10037 = Array<number|null>;
export const msSolved10037=[8,1,6,3,5,7,4,9,2];
export const msChallenge10037:MagicGrid10037=[2,7,6,null,5,1,4,null,null];
export const msMainLocked10037=[4];
export const msChallengeLocked10037=[0,1,2,4,5,6];
export const msLines10037=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
export function msAnalyze10037(grid:MagicGrid10037){
 const entries=grid.filter((n):n is number=>n!==null),numbers=grid.length===9&&entries.every(n=>Number.isInteger(n)&&n>=1&&n<=9),unique=new Set(entries).size===entries.length;
 const lines=msLines10037.map(ids=>{const complete=ids.every(i=>grid[i]!=null),sum=ids.reduce((s,i)=>s+(grid[i]??0),0);return{ids,complete,sum,status:!complete?'pending':sum===15?'correct':'incorrect'};});
 return{lines,numbers,unique,complete:entries.length===9,valid:numbers&&unique&&entries.length===9&&lines.every(l=>l.status==='correct')};
}
export function msPlace10037(grid:MagicGrid10037,index:number,value:number,locked:number[]):MagicGrid10037{
 if(!Number.isInteger(index)||index<0||index>8||locked.includes(index)||!Number.isInteger(value)||value<1||value>9)return grid;
 const other=grid.indexOf(value);if(other===index||locked.includes(other))return grid;
 const next=[...grid];if(other>=0)next[other]=next[index];next[index]=value;return next;
}
export function msRemove10037(grid:MagicGrid10037,index:number,locked:number[]){if(!Number.isInteger(index)||index<0||index>8||locked.includes(index)||grid[index]===null)return grid;const next=[...grid];next[index]=null;return next;}
export function msPayload10037(raw:string){return /^[1-9]$/.test(raw)?Number(raw):null;}
