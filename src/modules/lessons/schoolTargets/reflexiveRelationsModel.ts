export type N=1|2|3|4;
export type Pair=`${N},${N}`;
export const A:N[]=[1,2,3,4];
export const pair=(a:N,b:N):Pair=>`${a},${b}`;
export const initial:Pair[]=['2,2','3,3','4,4'];
export const positions:Record<N,[number,number]>={1:[85,70],2:[315,70],3:[85,235],4:[315,235]};
export function reflexiveFacts(relation:Set<Pair>,size:number){const active=A.slice(0,size),missing=active.filter(a=>!relation.has(pair(a,a)));return{active,missing,reflexive:missing.length===0};}
export function resizeRelation(relation:Set<Pair>,size:number){return new Set([...relation].filter(k=>k.split(',').every(n=>Number(n)<=size)));}
export function addSelfPairs(relation:Set<Pair>,size:number){const next=resizeRelation(relation,size);for(const a of A.slice(0,size))next.add(pair(a,a));return next;}
export function reflexiveEdge(a:N,b:N){const[x,y]=positions[a],[xx,yy]=positions[b];if(a===b){const side=a===1||a===3?-1:1;return `M${x+side*18} ${y-15} C${x+side*95} ${y-65},${x+side*95} ${y+35},${x+side*18} ${y+15}`;}const dx=xx-x,dy=yy-y,l=Math.hypot(dx,dy),px=-dy/l*4,py=dx/l*4;return `M${x+dx/l*26+px} ${y+dy/l*26+py} L${xx-dx/l*29+px} ${yy-dy/l*29+py}`;}
