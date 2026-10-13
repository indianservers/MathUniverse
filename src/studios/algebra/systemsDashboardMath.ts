import { solveAugmentedRref } from '../../utils/mathEngine/linearAlgebraUtils';
import { formatAlgebraNumber } from './algebraStudioMath';
export type SystemLine={m:number;b:number;relation:'>='|'>'|'<='|'<'};
export const defaultSystemLines:SystemLine[]=[{m:2,b:1,relation:'>='},{m:-1,b:4,relation:'<'}];
export const systemNumber=(n:number)=>formatAlgebraNumber(Math.abs(n)<1e-10?0:n);
export function lineExpression(line:SystemLine){const m=line.m===0?'':line.m===1?'x':line.m===-1?'−x':`${systemNumber(line.m)}x`;return m+(line.b===0?(m?'':'0'):m?` ${line.b<0?'−':'+'} ${systemNumber(Math.abs(line.b))}`:systemNumber(line.b));}
export function parseSystemLine(source:string):{m:number;b:number}|undefined{
 const text=source.replace(/\s/g,'').replaceAll('−','-').replace(/^y=/i,'');
 const match=/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)?)x(?:([+-](?:\d+(?:\.\d*)?|\.\d+)))?$/i.exec(text);
 if(match){const m=match[1]===''||match[1]==='+'?1:match[1]==='-'?-1:Number(match[1]),b=Number(match[2]||0);if(Number.isFinite(m)&&Number.isFinite(b))return{m,b};}
 if(/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(text))return{m:0,b:Number(text)};
 return undefined;
}
export function coefficientRows(lines:SystemLine[]){return lines.map(l=>{const s=l.m>=0?-1:1;return[-l.m*s,s,l.b*s];});}
export function solveSystemLines(lines:SystemLine[]){return solveAugmentedRref(coefficientRows(lines));}
export function satisfiesLine(line:SystemLine,x:number,y:number){const d=y-line.m*x-line.b;return line.relation==='>='?d>=-1e-9:line.relation==='>'?d>1e-9:line.relation==='<='?d<=1e-9:d<-1e-9;}
export function clipSystemRegion(lines:SystemLine[],range:number){
 let polygon:[number,number][]=[[-range,-range],[range,-range],[range,range],[-range,range]];
 for(const line of lines){const sign=line.relation.startsWith('>')?1:-1;const signed=([x,y]:[number,number])=>sign*(y-line.m*x-line.b);const next:[number,number][]=[];
  for(let i=0;i<polygon.length;i++){const a=polygon[i],b=polygon[(i+1)%polygon.length],da=signed(a),db=signed(b);if(da>=0)next.push(a);if((da>=0)!==(db>=0)){const u=da/(da-db);next.push([a[0]+u*(b[0]-a[0]),a[1]+u*(b[1]-a[1])]);}}
  polygon=next;if(!polygon.length)break;
 }
 return polygon;
}
export function systemPair(lines:SystemLine[]){const j=lines.findIndex((l,i)=>i>0&&Math.abs(l.m-lines[0].m)>1e-10);return[lines[0],lines[j>0?j:1]] as const;}
