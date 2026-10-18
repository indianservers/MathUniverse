import {lpAdd,lpSub,lpDot,lpNorm,lpUnit,lpScale,lpCross,lpCameraBasis,type LPVector,type LPCamera} from './linePlaneAngleModel';
import {pnCalculate} from './pointNormalModel';
export const PE_P:LPVector={x:1,y:2,z:0},PE_N:LPVector={x:2,y:-1,z:3};
export const PE_CAMERA:LPCamera={yaw:.6,pitch:-.4,panX:0,panY:0,zoom:1};
const referenceCamera=lpCameraBasis(PE_CAMERA),referenceNormal=lpUnit(PE_N),referenceForward=lpCross(referenceCamera.right,referenceCamera.up);
const basePatchVector=(x:number,y:number)=>{const q=lpAdd(lpScale(referenceCamera.right,x),lpScale(referenceCamera.up,y));return lpAdd(q,lpScale(referenceForward,-lpDot(referenceNormal,q)/lpDot(referenceNormal,referenceForward)));};
const basePatch={u:basePatchVector(1,.2),v:basePatchVector(.75,-.6)};
export function peBasis(n:LPVector){let unit=lpUnit(n);if(lpDot(unit,referenceNormal)<0)unit=lpScale(unit,-1);const cross=lpCross(referenceNormal,unit),sin=lpNorm(cross),cos=Math.max(-1,Math.min(1,lpDot(referenceNormal,unit)));if(sin===0)return basePatch;const axis=lpUnit(cross),rotate=(v:LPVector)=>lpAdd(lpAdd(lpScale(v,cos),lpScale(lpCross(axis,v),sin)),lpScale(axis,lpDot(axis,v)*(1-cos)));return{u:rotate(basePatch.u),v:rotate(basePatch.v)};}
export type PEMode='rotate'|'pan'|'zoom';
export const peExamples:[string,LPVector][]=[['A',{x:2,y:3,z:-1}],['B',{x:0,y:0,z:0}],['C',{x:1,y:0,z:0}]];
export function peGeometry(p:LPVector|null,n:LPVector|null,camera:LPCamera){const c=pnCalculate(p,n,null),basis=c.valid?peBasis(n!):null,half=3.4,corners=basis?[[-1,-1],[1,-1],[1,1],[-1,1]].map(([a,b])=>lpAdd(p!,lpAdd(lpScale(basis.u,a*half),lpScale(basis.v,b*half)))):[],drawLength=Math.max(1,c.magnitude*.75),normalTip=c.valid?lpAdd(p!,lpScale(c.unit!,drawLength)):null,normalScale=c.magnitude>0?drawLength/c.magnitude:.75,line=c.valid?[lpAdd(p!,lpScale(c.unit!,-3)),lpAdd(p!,lpScale(c.unit!,3))]:[],cameraBasis=lpCameraBasis(camera),world=[...corners,...line,...[p,normalTip].filter((q):q is LPVector=>!!q),...(['x','y','z'] as const).flatMap(k=>[-4,4].map(t=>({x:k==='x'?t:0,y:k==='y'?t:0,z:k==='z'?t:0})))],xs=world.map(q=>lpDot(q,cameraBasis.right)),ys=world.map(q=>lpDot(q,cameraBasis.up)),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys),scale=Math.min(650/(maxX-minX||1),490/(maxY-minY||1))*camera.zoom,view={...cameraBasis,scale,ox:400-(minX+maxX)*scale/2+camera.panX,oy:310+(minY+maxY)*scale/2+camera.panY};return{c,basis,half,corners,normalTip,normalScale,line,view};}
export type PEView=ReturnType<typeof peGeometry>['view'];
export const peProject=(p:LPVector,v:PEView)=>({x:v.ox+lpDot(p,v.right)*v.scale,y:v.oy-lpDot(p,v.up)*v.scale});
export function peResize(n:LPVector,target:number){return lpScale(lpNorm(n)>0?lpUnit(n):lpUnit(PE_N),target);}
export function peNumber(text:string){const a=text.trim().replace(/−/g,'-').split('/'),pattern=/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;if(a.length>2||a.some(p=>!pattern.test(p.trim())))return null;const n=Number(a[0])/(a.length===2?Number(a[1]):1);return Number.isFinite(n)?n:null;}
export function peScaled(n:LPVector|null,text:string){const k=peNumber(text),result=n&&k!==null?lpScale(n,k):null,valid=!!result&&k!==0&&Object.values(result).every(v=>Number.isFinite(v)&&Math.abs(v)<=100)&&lpNorm(result)>0;return{k,result,valid};}
export const peWorked={p:{x:2,y:-1,z:3},n:{x:1,y:2,z:-2}};
export const pePractice4={a:{x:1,y:-1,z:0},b:{x:2,y:1,z:-1},c:{x:0,y:0,z:2},n:{x:5,y:-1,z:3},d:-6};
export const peNormalDelta=(n:LPVector,delta:LPVector,scale:number)=>lpAdd(n,lpScale(delta,Number.isFinite(scale)?1/scale:lpNorm(n)));
export const pePointResidual=(q:LPVector,p:LPVector,n:LPVector)=>lpDot(n,lpSub(q,p));
