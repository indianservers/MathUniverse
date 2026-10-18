export type N = 1 | 2 | 3 | 4;
export type Pair = `${N},${N}`;
export const A: N[] = [1, 2, 3, 4];
export const p = (a: N, b: N): Pair => `${a},${b}`;
export const initial = A.flatMap((a) => A.map((b) => p(a, b))).filter(
  (item) => item !== "3,1",
);

export function analyze(relation:Set<Pair>){const unmatched=A.flatMap(a=>A.filter(b=>relation.has(p(a,b))&&!relation.has(p(b,a))).map(b=>[a,b] as const));return {unmatched,symmetric:unmatched.length===0,reflexive:A.every(a=>relation.has(p(a,a)))};}
export function symmetricClosure(relation:Set<Pair>){const next=new Set(relation);for(const item of relation){const[a,b]=item.split(',') as unknown as [N,N];next.add(p(Number(b) as N,Number(a) as N));}return next;}
export const positions:Record<N,[number,number]>={1:[90,65],2:[310,65],3:[310,245],4:[90,245]};
export function edgeGeometry(a:N,b:N){const[x,y]=positions[a],[xx,yy]=positions[b];if(a===b){const sign=a<=2?-1:1;return `M${x-13} ${y+sign*21} C${x-65} ${y+sign*70},${x+65} ${y+sign*70},${x+13} ${y+sign*21}`;}const dx=xx-x,dy=yy-y,l=Math.hypot(dx,dy),px=-dy/l*5,py=dx/l*5;return `M${x+dx/l*27+px} ${y+dy/l*27+py} L${xx-dx/l*30+px} ${yy-dy/l*30+py}`;}
