import{parallelogramAngles10074,paMove10074,paSector10074,type PABase10074,type PAP10074}from'./parallelogramAnglesModel10074';
export type PSPoint10073=PAP10074;
export type PSBase10073=PABase10074;
export type PSVertex10073='a'|'b'|'c'|'d';
export const psStart10073:PSBase10073={a:{x:118,y:82},b:{x:488,y:82},d:{x:70,y:330}};
export function parallelogramSides10073(base:PSBase10073,diagonal:'AC'|'BD'='AC'){const m=parallelogramAngles10074(base),p=m.points,dist=(a:PSPoint10073,b:PSPoint10073)=>Math.hypot(a.x-b.x,a.y-b.y),sides=[dist(p.a,p.b),dist(p.b,p.c),dist(p.c,p.d),dist(p.d,p.a)],triangles=diagonal==='AC'?[[p.a,p.b,p.c],[p.c,p.d,p.a]]:[[p.a,p.b,p.d],[p.c,p.d,p.b]],triangleSides=triangles.map(t=>[dist(t[0],t[1]),dist(t[1],t[2]),dist(t[2],t[0])]),areas=triangles.map(([a,b,c])=>Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x))/2),congruent=m.valid&&triangleSides[0].every((n,i)=>Math.abs(n-triangleSides[1][i])<=1e-10*Math.max(1,n)),pairs=diagonal==='AC'?[[p.a,p.b,p.c],[p.c,p.d,p.a],[p.a,p.c,p.d],[p.c,p.a,p.b]]:[[p.b,p.a,p.d],[p.d,p.c,p.b],[p.d,p.a,p.b],[p.b,p.c,p.d]];return{...m,sides,triangles,triangleSides,areas,congruent,pairs,labels:diagonal==='AC'?['ABC','CDA']:['ABD','CDB']};}
export const psMove10073=paMove10074;
export function psArc10073(v:PSPoint10073,a:PSPoint10073,b:PSPoint10073,r:number){const s=paSector10074(v,a,b,r);return s?s.path.replace(/^M[^L]+L/,'M').replace(/Z$/,''):null;}
export function psRandom10073(n:number):PSBase10073{return{a:{x:105+(n*17)%38,y:75+(n*13)%32},b:{x:425+(n*19)%42,y:76+(n*7)%25},d:{x:58+(n*11)%45,y:285+(n*23)%35}};}
export function psProof10073(diagonal:'AC'|'BD'){return diagonal==='AC'?['AB ∥ CD and AD ∥ BC','∠BAC = ∠DCA','∠BCA = ∠CAD','AC = CA','△ABC ≅ △CDA','AB = CD','BC = AD']:['AB ∥ CD and AD ∥ BC','∠ABD = ∠CDB','∠ADB = ∠CBD','BD = DB','△ABD ≅ △CDB','AB = CD','BC = AD'];}
