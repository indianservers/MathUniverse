import {lpCameraBasis,lpCameraDefault,lpCross,lpDot,lpNorm,lpSub,lpScale,lpAdd,lpUnit,lpPlaneBasis,type LPVector,type LPCamera} from './linePlaneAngleModel';
export type IPAxis='a'|'b'|'c';
export type IPValues=Record<IPAxis,number>;
export const IP_AXES:IPAxis[]=['a','b','c'];
export const IP_DEFAULT:IPValues={a:4,b:3,c:2};
export const IP_CAMERA:LPCamera={...lpCameraDefault,yaw:.6,pitch:-.4};
export const ipValue=(v:number)=>Number.isFinite(v)?String(v):'∞';
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
const lcm=(a:number,b:number)=>Math.abs(a*b)/gcd(a,b);
export function ipCalculate(v:IPValues){
 const vals=IP_AXES.map(k=>v[k]),valid=vals.every(x=>x===Infinity||(Number.isFinite(x)&&x!==0&&Math.abs(x)<=8&&Number.isInteger(x*4)))&&vals.some(Number.isFinite),allFinite=vals.every(Number.isFinite);
 const nums=vals.filter(Number.isFinite).map(x=>x*4),common=nums.reduce((a,b)=>lcm(a,Math.abs(b)),1),coeff=vals.map(x=>Number.isFinite(x)?4*common/(x*4):0),divisor=coeff.reduce((a,b)=>gcd(a,b),common)||1;
 const n={x:coeff[0]/divisor,y:coeff[1]/divisor,z:coeff[2]/divisor},rhs=common/divisor;
 const points=IP_AXES.map((k,i)=>Number.isFinite(v[k])?{x:i===0?v[k]:0,y:i===1?v[k]:0,z:i===2?v[k]:0}:null);
 const terms=([['x',n.x],['y',n.y],['z',n.z]] as const).filter(([,a])=>a!==0).map(([k,a],i)=>`${a<0?i?' - ':'-':i?' + ':''}${Math.abs(a)===1?'':Math.abs(a)}${k}`).join('');
 const normal=allFinite?{x:v.b*v.c,y:v.a*v.c,z:v.a*v.b}:n;
 return{valid,allFinite,n,rhs,points,standard:valid?`${terms} = ${rhs}`:'Undefined intercept form',normal,volume:valid&&allFinite?Math.abs(v.a*v.b*v.c)/6:null,distance:valid?Math.abs(rhs)/lpNorm(n):null,area:valid&&allFinite?lpNorm(normal)/2:null};
}
export function ipSet(value:number){return Math.max(-8,Math.min(8,Math.round(value*4)/4));}
export function ipTrace(v:IPValues,i:number,j:number){const c=ipCalculate(v);if(!c.valid)return[];const values=IP_AXES.map(k=>v[k]);if(Number.isFinite(values[i])&&Number.isFinite(values[j]))return[{x:values[i],y:0},{x:0,y:values[j]}];const ns=[c.n.x,c.n.y,c.n.z],m=Math.max(4,...IP_AXES.map(k=>Number.isFinite(v[k])?Math.abs(v[k])+1:0));const pts:{x:number;y:number}[]=[];
 for(const x of[-m,m])if(ns[j]!==0){const y=(c.rhs-ns[i]*x)/ns[j];if(Math.abs(y)<=m+1e-9)pts.push({x,y});}
 for(const y of[-m,m])if(ns[i]!==0){const x=(c.rhs-ns[j]*y)/ns[i];if(Math.abs(x)<=m+1e-9&&!pts.some(p=>Math.hypot(p.x-x,p.y-y)<1e-8))pts.push({x,y});}
 return pts.slice(0,2);
}
export function ipPolygon(v:IPValues){const c=ipCalculate(v);if(!c.valid)return[];if(c.allFinite)return c.points as LPVector[];
 const m=Math.max(4,...IP_AXES.map(k=>Number.isFinite(v[k])?Math.abs(v[k])+1:0)),vertices=[] as LPVector[];for(const x of[-m,m])for(const y of[-m,m])for(const z of[-m,m])vertices.push({x,y,z});const pts:LPVector[]=[];
 for(let i=0;i<8;i++)for(let j=i+1;j<8;j++){const a=vertices[i],b=vertices[j];if(['x','y','z'].filter(k=>a[k as keyof LPVector]!==b[k as keyof LPVector]).length!==1)continue;const fa=lpDot(c.n,a)-c.rhs,fb=lpDot(c.n,b)-c.rhs;if(fa===0&&!pts.some(p=>lpNorm(lpSub(a,p))<1e-8))pts.push(a);if(fa*fb<0){const p=lpAdd(a,lpScale(lpSub(b,a),fa/(fa-fb)));if(!pts.some(q=>lpNorm(lpSub(p,q))<1e-8))pts.push(p);}}
 const center=lpScale(pts.reduce(lpAdd,{x:0,y:0,z:0}),1/(pts.length||1)),basis=lpPlaneBasis(c.n)!;return pts.sort((a,b)=>Math.atan2(lpDot(lpSub(a,center),basis.v),lpDot(lpSub(a,center),basis.u))-Math.atan2(lpDot(lpSub(b,center),basis.v),lpDot(lpSub(b,center),basis.u)));
}
export function ipView(v:IPValues,camera:LPCamera,compact=false){const basis=lpCameraBasis(camera),c=ipCalculate(v),extents={x:Number.isFinite(v.a)?Math.max(2,Math.abs(v.a)+1):4,y:Number.isFinite(v.b)?Math.max(2,Math.abs(v.b)+1):4,z:Number.isFinite(v.c)?Math.max(2,Math.abs(v.c)+1):4},extent=Math.max(...Object.values(extents)),points=[...ipPolygon(v),{x:0,y:0,z:0},...(compact?[]:(['x','y','z'] as const).flatMap(k=>[-Math.min(1.5,extents[k]*.35),extents[k]].map(t=>({x:k==='x'?t:0,y:k==='y'?t:0,z:k==='z'?t:0}))))],xs=points.map(p=>lpDot(p,basis.right)),ys=points.map(p=>lpDot(p,basis.up)),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),scale=Math.min((compact?480:520)/(maxX-minX||1),(compact?430:485)/(maxY-minY||1))*camera.zoom;
 return{...basis,scale,ox:340-(minX+maxX)*scale/2+camera.panX,oy:355+(minY+maxY)*scale/2+camera.panY,extent,extents,c};
}
export const ipProject=(p:LPVector,view:ReturnType<typeof ipView>)=>({x:view.ox+lpDot(p,view.right)*view.scale,y:view.oy-lpDot(p,view.up)*view.scale});
export const ipResidual=(p:LPVector,v:IPValues)=>{const c=ipCalculate(v);return lpDot(c.n,p)-c.rhs;};
export const ipDirections=(v:IPValues)=>{const c=ipCalculate(v);if(!c.valid)return null;if(c.allFinite){const[a,b,d]=c.points as LPVector[];return{u:lpSub(b,a),v:lpSub(d,a),cross:lpCross(lpSub(b,a),lpSub(d,a))};}const b=lpPlaneBasis(c.n)!;return{u:b.u,v:b.v,cross:lpUnit(c.n)};};
