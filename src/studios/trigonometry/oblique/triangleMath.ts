export type Vertex = 'A'|'B'|'C';
export type Side = 'a'|'b'|'c';
export type Quantity = Vertex|Side;
export type Triangle = Record<Quantity,number> & {area:number};
export type Point = {x:number;y:number};
export type Points = Record<Vertex,Point>;
export type Problem = 'ASA'|'AAS'|'SAS'|'SSS'|'SSA';
export const radians=(x:number)=>x*Math.PI/180;
export const degrees=(x:number)=>x*180/Math.PI;
export const format=(x:number,n=2)=>Number.isFinite(x)?Number(x.toFixed(n)).toString():'—';
const eps=1e-10;
const positive=(...xs:number[])=>xs.every(x=>Number.isFinite(x)&&x>0);
const domain=(x:number)=>Number.isFinite(x)&&Math.abs(x)<=1+eps?Math.max(-1,Math.min(1,x)):null;
export function validateTriangleSides(a:number,b:number,c:number){const m=Math.max(a,b,c);return positive(a,b,c)&&a/m+b/m>c/m+eps&&a/m+c/m>b/m+eps&&b/m+c/m>a/m+eps;}
export function validateAngles(A:number,B:number,C:number){return positive(A,B,C)&&Math.abs(A+B+C-180)<1e-7;}
export function lawOfSinesSolveSide(side:number,angle:number,other:number){return positive(side,angle,other)&&angle<180&&other<180?side*Math.sin(radians(other))/Math.sin(radians(angle)):NaN;}
export function lawOfCosinesSolveSide(b:number,c:number,A:number){return positive(b,c,A)&&A<180?Math.hypot(b-c,2*Math.sqrt(b)*Math.sqrt(c)*Math.sin(radians(A/2))):NaN;}
export function lawOfCosinesSolveAngle(a:number,b:number,c:number){if(!validateTriangleSides(a,b,c))return NaN;const m=Math.max(a,b,c),x=a/m,y=b/m,z=c/m;const t=domain((y*y+z*z-x*x)/(2*y*z));return t===null?NaN:degrees(Math.acos(t));}
export const triangleAreaFromSAS=(b:number,c:number,A:number)=>positive(b,c,A)&&A<180?.5*b*c*Math.sin(radians(A)):NaN;
export function solveSSS(a:number,b:number,c:number):Triangle|null{if(!validateTriangleSides(a,b,c))return null;const A=lawOfCosinesSolveAngle(a,b,c),B=lawOfCosinesSolveAngle(b,c,a),C=180-A-B,area=triangleAreaFromSAS(b,c,A);return validateAngles(A,B,C)&&Number.isFinite(area)?{a,b,c,A,B,C,area}:null;}
export function solveASA(A:number,B:number,a:number):Triangle|null{const C=180-A-B;if(!validateAngles(A,B,C)||!positive(a))return null;const b=lawOfSinesSolveSide(a,A,B),c=lawOfSinesSolveSide(a,A,C),area=triangleAreaFromSAS(b,c,A);return validateTriangleSides(a,b,c)&&Number.isFinite(area)?{a,b,c,A,B,C,area}:null;}
export const solveAAS=solveASA;
export function solveSAS(b:number,c:number,A:number){const a=lawOfCosinesSolveSide(b,c,A);return solveSSS(a,b,c);}
export function solveSSA(A:number,a:number,b:number):Triangle[]{if(!positive(A,a,b)||A>=180)return [];const t=domain(b/a*Math.sin(radians(A)));if(t===null)return [];const first=degrees(Math.asin(Math.abs(1-t)<=eps?1:t));return [first,180-first].filter((B,i,all)=>B>eps&&A+B<180-eps&&(i===0||Math.abs(B-all[0])>1e-7)).map(B=>solveASA(A,B,a)).filter((x):x is Triangle=>x!==null);}
export function solveProblem(kind:Problem,values:Record<Quantity,number>):Triangle[]{const {a,b,c,A,B}=values;const one=kind==='ASA'?solveASA(A,B,lawOfSinesSolveSide(c,180-A-B,A)):kind==='AAS'?solveASA(A,B,a):kind==='SAS'?solveSAS(b,c,A):kind==='SSS'?solveSSS(a,b,c):null;return kind==='SSA'?solveSSA(A,a,b):one?[one]:[];}
export function canonicalPoints(t:Triangle):Points{return {A:{x:0,y:0},B:{x:t.c,y:0},C:{x:t.b*Math.cos(radians(t.A)),y:-t.b*Math.sin(radians(t.A))}};}
export function triangleFromPoints(p:Points):Triangle|null{const dist=(x:Point,y:Point)=>Math.hypot(x.x-y.x,x.y-y.y);return solveSSS(dist(p.B,p.C),dist(p.C,p.A),dist(p.A,p.B));}
export function cyclicSAS(first:number,second:number,angle:number,vertex:Vertex):Triangle|null{const t=solveSAS(first,second,angle);return !t?null:vertex==='A'?t:vertex==='B'?{a:t.c,b:t.a,c:t.b,A:t.C,B:t.A,C:t.B,area:t.area}:{a:t.b,b:t.c,c:t.a,A:t.B,B:t.C,C:t.A,area:t.area};}
export function circumcircle(p:Points){const {A:a,B:b,C:c}=p,d=2*(a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y));if(Math.abs(d)<1e-10)return null;const aa=a.x*a.x+a.y*a.y,bb=b.x*b.x+b.y*b.y,cc=c.x*c.x+c.y*c.y;const center={x:(aa*(b.y-c.y)+bb*(c.y-a.y)+cc*(a.y-b.y))/d,y:(aa*(c.x-b.x)+bb*(a.x-c.x)+cc*(b.x-a.x))/d};return {center,radius:Math.hypot(center.x-a.x,center.y-a.y)};}
export function projection(p:Point,a:Point,b:Point){const dx=b.x-a.x,dy=b.y-a.y,t=((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy);return {x:a.x+t*dx,y:a.y+t*dy};}
export function legacyObliqueRoute(mode:string|null){const key=mode?.toLowerCase().replace(/[^a-z]/g,'');return ({sinelaw:'sine-law',cosinelaw:'cosine-law',area:'area',areaofatriangle:'area',ssa:'ssa-ambiguous-case',ssaambiguouscase:'ssa-ambiguous-case',solvetriangle:'solve-triangle'} as Record<string,string>)[key??'']??null;}
