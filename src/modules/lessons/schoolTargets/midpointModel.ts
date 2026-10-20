export type MidpointPoint={x:number;y:number};
export type MidpointPair={a:MidpointPoint;b:MidpointPoint};
function decimal(value:number){if(!Number.isFinite(value))throw new Error('Finite coordinates required');const [mantissa,exp='0']=String(value).split('e'),fraction=mantissa.split('.')[1]?.length??0,scale=fraction-Number(exp),n=BigInt(mantissa.replace('.',''));return scale<0?{n:n*10n**BigInt(-scale),scale:0}:{n,scale};}
function sum(a:number,b:number){const p=decimal(a),q=decimal(b),scale=Math.max(p.scale,q.scale);return{n:p.n*10n**BigInt(scale-p.scale)+q.n*10n**BigInt(scale-q.scale),scale};}
const mean=(a:number,b:number)=>{const q=sum(a,b);return Number(`${q.n*5n}e-${q.scale+1}`);};
export function midpointModel(p:MidpointPair){const m={x:mean(p.a.x,p.b.x),y:mean(p.a.y,p.b.y)},am=Math.hypot(m.x-p.a.x,m.y-p.a.y),mb=Math.hypot(p.b.x-m.x,p.b.y-m.y),ab=Math.hypot(p.b.x-p.a.x,p.b.y-p.a.y);return {m,am,mb,ab,coincident:p.a.x===p.b.x&&p.a.y===p.b.y,equal:Math.abs(am-mb)<=Number.EPSILON*16*Math.max(1,am,mb)};}
export function fixedMidpoint(p:MidpointPair,target:MidpointPoint={x:2,y:1}){return (['x','y'] as const).every(axis=>{const q=sum(p.a[axis],p.b[axis]),t=decimal(target[axis]);return q.n*10n**BigInt(t.scale)===2n*t.n*10n**BigInt(q.scale);});}
export function boundMidpointPoint(p:MidpointPoint){return{x:Math.max(-8,Math.min(8,p.x)),y:Math.max(-7,Math.min(7,p.y))};}
