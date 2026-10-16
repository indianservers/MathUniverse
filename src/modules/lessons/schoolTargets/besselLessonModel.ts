import { simpsonIntegral } from "../../../studios/calculus/calculusEnhancementEngine";
export function besselJ(n:number,x:number) {if(x===0)return n===0?1:0;return simpsonIntegral(theta=>Math.cos(x*Math.sin(theta)-n*theta),0,Math.PI,320)/Math.PI;}
const rootCache=new Map<number,number[]>();
export function besselZeros(n:number) {
  const cached=rootCache.get(n);if(cached)return cached;
  const roots:number[]=[];let left=.2,fl=besselJ(n,left);
  for(let right=.4;right<25&&roots.length<3;right+=.2){const fr=besselJ(n,right);if(fl*fr<0){let lo=left,hi=right,flo=fl;for(let k=0;k<45;k++){const mid=(lo+hi)/2,fm=besselJ(n,mid);if(flo*fm<=0)hi=mid;else{lo=mid;flo=fm;}}roots.push((lo+hi)/2);}left=right;fl=fr;}
  rootCache.set(n,roots);return roots;
}
export function drumMode(n:number,m:number) {const roots=besselZeros(n),root=roots[m-1],radial=Array.from({length:601},(_,i)=>besselJ(n,root*i/600));return {root,radial,nodalRadii:roots.slice(0,m-1).map(r=>r/root),angularDiameters:n};}
export function radialAt(radial:number[],r:number){const p=Math.max(0,Math.min(1,r))*(radial.length-1),i=Math.floor(p);return radial[i]+(radial[Math.min(i+1,radial.length-1)]-radial[i])*(p-i);}
export function drumPixels(n:number,radial:number[],phase:number,nodesOnly=false,size=256) {
  const pixels=new Uint8ClampedArray(size*size*4),amplitude=Math.max(...radial.map(Math.abs));
  for(let y=0;y<size;y++)for(let x=0;x<size;x++){const xx=(x+.5-size/2)/(size/2),yy=(y+.5-size/2)/(size/2),r=Math.hypot(xx,yy),i=(y*size+x)*4;if(r>1)continue;const spatial=radialAt(radial,r)*Math.cos(n*Math.atan2(yy,xx))/amplitude,value=spatial*Math.cos(phase);let rgb:number[];if(nodesOnly)rgb=Math.abs(spatial)<.035?[244,247,251]:[15,31,95];else{const magnitude=Math.abs(value);const stops=value>=0?[[3,3,50],[8,3,89],[22,8,135],[47,18,194],[85,37,245],[104,53,255],[52,22,199],[24,8,111],[40,7,119],[111,23,175],[255,136,40],[255,249,158]]:[[5,5,65],[17,30,139],[23,82,220],[38,193,245]];const levels=value>=0?[0,.03,.12,.25,.4,.55,.7,.86,.94,.98,.995,1]:[0,1/3,2/3,1];let low=0;while(low<levels.length-2&&magnitude>levels[low+1])low++;const fraction=(magnitude-levels[low])/(levels[low+1]-levels[low]);rgb=stops[low].map((channel,index)=>channel+(stops[low+1][index]-channel)*fraction);}pixels[i]=rgb[0];pixels[i+1]=rgb[1];pixels[i+2]=rgb[2];pixels[i+3]=255;}
  return pixels;
}
