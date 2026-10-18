export type LPVector={x:number;y:number;z:number};
export const LP_D:LPVector={x:1,y:2,z:2},LP_N:LPVector={x:2,y:-1,z:2},LP_ZERO:LPVector={x:0,y:0,z:0};
export const lpDot=(a:LPVector,b:LPVector)=>a.x*b.x+a.y*b.y+a.z*b.z;
export const lpNorm=(a:LPVector)=>Math.hypot(a.x,a.y,a.z);
export const lpScale=(a:LPVector,k:number):LPVector=>({x:a.x*k,y:a.y*k,z:a.z*k});
export const lpAdd=(a:LPVector,b:LPVector):LPVector=>({x:a.x+b.x,y:a.y+b.y,z:a.z+b.z});
export const lpSub=(a:LPVector,b:LPVector)=>lpAdd(a,lpScale(b,-1));
export const lpCross=(a:LPVector,b:LPVector):LPVector=>({x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x});
export const lpUnit=(a:LPVector)=>{const m=lpNorm(a);return m>0?{x:a.x/m,y:a.y/m,z:a.z/m}:LP_ZERO;};
export function calculateLinePlane(d:LPVector,n:LPVector){const dn=lpNorm(d),nn=lpNorm(n),product=lpDot(d,n),valid=dn>0&&nn>0,du=lpUnit(d),nu=lpUnit(n),ratio=valid?Math.min(1,Math.abs(lpDot(du,nu))):null,parallel=valid&&((product===0&&dn*nn>0)||lpDot(du,nu)===0),perpendicular=valid&&lpNorm(lpCross(du,nu))===0,component=nn>0?lpScale(nu,lpDot(d,nu)):null,projection=nn>0?(perpendicular?LP_ZERO:parallel?d:lpSub(d,component!)):null,theta=valid?(parallel?0:perpendicular?90:Math.asin(ratio!)*180/Math.PI):null;return{dn,nn,product,valid,ratio,parallel,perpendicular,component,projection,projectionLength:projection?lpNorm(projection):null,theta,phi:theta===null?null:90-theta};}
export function lpPlaneBasis(n:LPVector){if(lpNorm(n)===0)return null;const nu=lpUnit(n),u=lpUnit(lpCross(nu,Math.abs(nu.z)>.9?{x:1,y:0,z:0}:{x:0,y:0,z:1})),v=lpCross(nu,u),a=.45;return{u:lpAdd(lpScale(u,Math.cos(a)),lpScale(v,Math.sin(a))),v:lpAdd(lpScale(v,Math.cos(a)),lpScale(u,-Math.sin(a)))};}
export const lpCameraDefault={yaw:Math.atan2(2,1),pitch:28*Math.PI/180,panX:0,panY:0,zoom:1};
export type LPCamera=typeof lpCameraDefault;
export function lpCameraBasis(c:LPCamera){return{right:{x:Math.cos(c.yaw),y:Math.sin(c.yaw),z:0},up:{x:Math.sin(c.yaw)*Math.sin(c.pitch),y:-Math.cos(c.yaw)*Math.sin(c.pitch),z:Math.cos(c.pitch)}};}
export function lpPlaneCorners(n:LPVector,p:LPVector|null){const basis=lpPlaneBasis(n);if(!basis)return[];const half=Math.max(2.4,p?Math.abs(lpDot(p,basis.u))*1.12:0,p?Math.abs(lpDot(p,basis.v))*1.12:0);return[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>lpAdd(lpScale(basis.u,a*half),lpScale(basis.v,b*half)));}
export function lpView(d:LPVector,n:LPVector,p:LPVector|null,c:LPCamera){const basis=lpCameraBasis(c),axis=3.2,points=[d,n,p??LP_ZERO,...(lpDot(d,n)<0?[lpScale(n,-1)]:[]),...lpPlaneCorners(n,p),...[{x:axis,y:0,z:0},{x:0,y:axis,z:0},{x:0,y:0,z:axis}].flatMap(v=>[v,lpScale(v,-.5)])],xs=points.map(v=>lpDot(v,basis.right)),ys=points.map(v=>lpDot(v,basis.up)),fit=Math.min(350/Math.max(1,...xs.map(Math.abs)),245/Math.max(1,...ys),180/Math.max(1,...ys.map(y=>-y)))*.92;return{...basis,scale:fit*c.zoom,ox:400+c.panX,oy:300+c.panY};}
export type LPView=ReturnType<typeof lpView>;
export const lpProject=(v:LPVector,c:LPView)=>({x:c.ox+lpDot(v,c.right)*c.scale,y:c.oy-lpDot(v,c.up)*c.scale});
export function lpArc(a:LPVector,b:LPVector,r:number){const u=lpUnit(a),v=lpUnit(b),angle=Math.acos(Math.max(-1,Math.min(1,lpDot(u,v))));if(angle<1e-8)return[];return Array.from({length:41},(_,i)=>{const t=i/40;return lpScale(lpAdd(lpScale(u,Math.sin((1-t)*angle)/Math.sin(angle)),lpScale(v,Math.sin(t*angle)/Math.sin(angle))),r);});}
export function parseLPVector(values:string[]):LPVector|null{if(values.some(v=>!v.trim()||!Number.isFinite(Number(v))||Math.abs(Number(v))>5))return null;return{x:Number(values[0]),y:Number(values[1]),z:Number(values[2])};}
export const lpRound=(n:number,d=4)=>Number(n.toFixed(d));
export const lpTuple=(v:LPVector)=>`(${lpRound(v.x)}, ${lpRound(v.y)}, ${lpRound(v.z)})`;
export function lpNumberTex(n:number){const[m,e]=String(n).split('e');return e===undefined?m:`${m}\\times10^{${Number(e)}}`;}
export const lpVectorTex=(v:LPVector)=>`\\left(${[v.x,v.y,v.z].map(lpNumberTex).join(',\\,')}\\right)`;
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
export function lpFraction(a:number,b:number){const g=gcd(Math.abs(a),Math.abs(b))||1,num=a/g,den=b/g;return den===1?String(num):`${num<0?'-':''}\\dfrac{${Math.abs(num)}}{${den}}`;}
export const lpIntegerVectors=(d:LPVector,n:LPVector)=>[...Object.values(d),...Object.values(n)].every(Number.isInteger);
export function lpProjectionTex(d:LPVector,n:LPVector,component=false){const n2=lpDot(n,n),dot=lpDot(d,n);if(!n2)return'\\text{undefined}';return`\\left(${(['x','y','z']as const).map(k=>lpFraction(component?dot*n[k]:d[k]*n2-dot*n[k],n2)).join(',\\,')}\\right)`;}
export function lpMagnitudeTex(v:LPVector){const n2=lpDot(v,v),r=Math.sqrt(n2);return Number.isInteger(r)?String(r):`\\sqrt{${lpRound(n2,8)}}`;}
export function lpProjectionLengthTex(d:LPVector,n:LPVector){const numerator=lpDot(d,d)*lpDot(n,n)-lpDot(d,n)**2,denominator=lpDot(n,n);if(!denominator)return'\\text{undefined}';const g=gcd(numerator,denominator)||1,a=numerator/g,b=denominator/g;if(Number.isInteger(Math.sqrt(a))&&Number.isInteger(Math.sqrt(b)))return lpFraction(Math.sqrt(a),Math.sqrt(b));return Number.isInteger(Math.sqrt(b))?(b===1?`\\sqrt{${a}}`:`\\dfrac{\\sqrt{${a}}}{${Math.sqrt(b)}}`):`\\sqrt{\\dfrac{${a}}{${b}}}`;}
export const lpPractices=[{d:{x:2,y:1,z:2},n:{x:1,y:-2,z:2},plane:'x-2y+2z=0'},{d:{x:1,y:1,z:0},n:{x:1,y:1,z:1},plane:'x+y+z=0'},{d:{x:2,y:-1,z:3},n:{x:2,y:1,z:-2},plane:'2x+y-2z=0'},{d:{x:3,y:0,z:4},n:{x:3,y:0,z:4},plane:'3x+4z=0'}];

export function lpPlaneEquationTex(n:LPVector){const terms=(["x","y","z"]as const).filter(k=>n[k]!==0);return terms.map((k,i)=>`${n[k]<0?"-":i?"+":""}${Math.abs(n[k])===1?"":lpNumberTex(Math.abs(n[k]))}${k}`).join("")+"=0";}
