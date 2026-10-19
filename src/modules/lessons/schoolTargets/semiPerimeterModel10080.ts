export type Sides10080={a:number;b:number;c:number};
export type Point10080={x:number;y:number};
export type Points10080=Record<keyof Sides10080,Point10080>;
export const keys10080=['a','b','c'] as const;
function decimal(n:number){const [v,e='0']=String(n).toLowerCase().split('e'),[i,f='']=v.split('.');return {n:BigInt(i+f),scale:f.length-Number(e)};}
export function semiPerimeter10080(sides:Sides10080){
 const ds=keys10080.map(k=>decimal(sides[k])),scale=Math.max(0,...ds.map(d=>d.scale)),S=10n**BigInt(scale),ns=ds.map(d=>d.n*10n**BigInt(scale-d.scale)),sum=ns.reduce((a,b)=>a+b,0n),f=ns.map(n=>sum-2n*n),state=f.some(n=>n<0n)?'impossible':f.some(n=>n===0n)?'degenerate':'proper',den=Number(S),p=Number(sum)/den,s=p/2,factors=f.map(n=>Number(n)/(2*den));
 const product=sum*f[0]*f[1]*f[2];
 // Exact decimal factors determine classification; logs preserve thin positive areas.
 const area=state==='impossible'?null:state==='degenerate'?0:Number.isFinite(Number(product))&&Number.isFinite(4*den*den)?Math.sqrt(Number(product))/(4*den*den):Math.exp((Math.log(Number(sum))+f.reduce((a,n)=>a+Math.log(Number(n)),0))/2-Math.log(4)-2*Math.log(den));
 let radical:string|null=null;
 if(keys10080.every(k=>Number.isInteger(sides[k]))&&state!=='impossible'){let r=Number(product),outside=1;for(let d=2;d*d<=r;d++)while(r%(d*d)===0){outside*=d;r/=d*d;}radical=state==='degenerate'?'0':r===1?String(outside/4):`${outside/4}\\sqrt{${r}}`;}
 return{p,s,f:factors,area,state,valid:state==='proper',radical};
}
export function geometry10080(sides:Sides10080):Points10080|null{const m=semiPerimeter10080(sides);if(m.area===null)return null;const x=(sides.c*sides.c+sides.a*sides.a-sides.b*sides.b)/(2*sides.c);return{a:{x,y:2*m.area/sides.c},b:{x:0,y:0},c:{x:sides.c,y:0}};}
export function sides10080(p:Points10080):Sides10080{return{a:Math.hypot(p.a.x-p.b.x,p.a.y-p.b.y),b:Math.hypot(p.a.x-p.c.x,p.a.y-p.c.y),c:Math.hypot(p.b.x-p.c.x,p.b.y-p.c.y)}};
export function ribbon10080(sides:Sides10080){const s=semiPerimeter10080(sides).s;return[0,s].map(start=>{let offset=0;return keys10080.flatMap(key=>{const end=offset+sides[key],length=Math.max(0,Math.min(end,start+s)-Math.max(offset,start));offset=end;return length>0?[{key,length}]:[];});});}
export function fit10080(points:Points10080){const ps=Object.values(points),minX=Math.min(...ps.map(p=>p.x)),maxX=Math.max(...ps.map(p=>p.x)),minY=Math.min(...ps.map(p=>p.y)),maxY=Math.max(...ps.map(p=>p.y)),scale=Math.min(40,240/Math.max(.01,maxX-minX),200/Math.max(.01,maxY-minY));return{scale,x:165-(minX+maxX)*scale/2,y:155+(minY+maxY)*scale/2};}
