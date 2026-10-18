import{psAngle,psCoords}from'./principalSolutionsModel';
export{psAngle as gsAngle,psCoords as gsCoords};
const t=String.raw;
export const gsEquations={
 'sin-half':{label:'sin x = 1/2',tex:t`\sin x=\frac12`,fn:'sin',target:.5,targetTex:t`\frac12`,roots:[2,10],period:24,reference:t`\alpha=\frac\pi6`,compact:t`x=m\pi+(-1)^m\frac\pi6`,note:'The two directions are reflections across the y-axis. Each family repeats after 2π.'},
 'cos-half':{label:'cos x = 1/2',tex:t`\cos x=\frac12`,fn:'cos',target:.5,targetTex:t`\frac12`,roots:[4,20],period:24,reference:t`\alpha=\frac\pi3`,compact:t`x=2m\pi\pm\frac\pi3`,note:'The two directions are reflections across the x-axis. Each family repeats after 2π.'},
 'sin-zero':{label:'sin x = 0',tex:t`\sin x=0`,fn:'sin',target:0,targetTex:'0',roots:[0,12],period:24,reference:t`\alpha=0`,compact:t`x=m\pi`,note:'The two axis directions are opposite. Together, the two 2π families give every integer multiple of π.'},
 'cos-zero':{label:'cos x = 0',tex:t`\cos x=0`,fn:'cos',target:0,targetTex:'0',roots:[6,18],period:24,reference:t`\alpha=\frac\pi2`,compact:t`x=\frac\pi2+m\pi`,note:'The two axis directions are opposite. Together, the two 2π families repeat every π.'},
 'tan-one':{label:'tan x = 1',tex:t`\tan x=1`,fn:'tan',target:1,targetTex:'1',roots:[3],period:12,reference:t`\alpha=\frac\pi4`,compact:t`x=\frac\pi4+m\pi`,note:'Tangent repeats after π: consecutive roots are opposite points. Only shifts of 2π are coterminal.'},
}as const;
export type GSEquation=keyof typeof gsEquations;
export function gsModel(key:GSEquation,n:number){const e=gsEquations[key],solutions=e.roots.map(u=>u+n*e.period),timeline:{u:number;family:number;n:number}[]=[];e.roots.forEach((u,family)=>{for(let k=Math.ceil((-36-u)/e.period);k<=Math.floor((36-u)/e.period);k++)timeline.push({u:u+k*e.period,family,n:k});});timeline.sort((a,b)=>a.u-b.u);return{solutions,timeline,verified:solutions.every(u=>Math.abs(Math[e.fn](u*Math.PI/12)-e.target)<1e-12)};}
export function gsInteger(s:string){return /^-?\d+$/.test(s)&&Number.isSafeInteger(Number(s))&&Number(s)>=-3&&Number(s)<=3;}
