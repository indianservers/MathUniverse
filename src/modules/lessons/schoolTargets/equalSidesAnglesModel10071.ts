export type EAP10071={x:number;y:number};
export const eaInitial10071={x:0,y:Math.sqrt((6.72/3.62)**2-1)};
export const eaClamp10071=(n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));
export function eaPairs10071(side:number,angle:number){return [...new Set([side,[0,1,3,2][angle]].filter(Boolean))];}
export function eaConstrain10071(p:EAP10071,side:number,angle:number){const q={x:eaClamp10071(p.x,-1.35,1.35),y:eaClamp10071(p.y,.65,2.8)},pairs=eaPairs10071(side,angle);if(pairs.length>1)return{x:0,y:Math.sqrt(3)};if(pairs[0]===1)q.x=0;if(pairs[0]===2||pairs[0]===3){q.y=Math.min(q.y,1.95);if(q.y===Math.sqrt(3))return{x:0,y:q.y};q.x=(pairs[0]===2?-1:1)*(1-Math.sqrt(4-q.y*q.y));}return q;}
export function eaMeasure10071(p:EAP10071,side=0,angle=0){const a=p,b={x:-1,y:0},c={x:1,y:0},len=(u:EAP10071,v:EAP10071)=>Math.hypot(u.x-v.x,u.y-v.y)*3.62,ang=(v:EAP10071,u:EAP10071,w:EAP10071)=>Math.atan2(Math.abs((u.x-v.x)*(w.y-v.y)-(u.y-v.y)*(w.x-v.x)),(u.x-v.x)*(w.x-v.x)+(u.y-v.y)*(w.y-v.y))*180/Math.PI,ab=len(a,b),ac=len(a,c),bc=len(b,c),forced=eaPairs10071(side,angle),all=forced.length>1||(p.x===0&&p.y===Math.sqrt(3)),eq=[p.x===0,ab===bc,ac===bc].map((v,i)=>v||all||forced.includes(i+1));return{ab,ac,bc,a:ang(a,b,c),b:ang(b,a,c),c:ang(c,a,b),eq};}
export const eaRelations10071=[['AB = AC','∠B = ∠C'],['AB = BC','∠A = ∠C'],['AC = BC','∠A = ∠B']];
