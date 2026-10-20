export type PCPoint10063={x:number;y:number};
export type PCState10063={angle:number;offset:number;l:number;m:number};
export const pcInitial10063:PCState10063={angle:58,offset:0,l:0,m:0};
const r=Math.PI/180;
export const pcUnit10063=(a:number)=>({x:Math.cos(a*r),y:Math.sin(a*r)});
const cross=(a:PCPoint10063,b:PCPoint10063)=>a.x*b.y-a.y*b.x;
export const pcAdd10063=(a:PCPoint10063,b:PCPoint10063,k=1)=>({x:a.x+k*b.x,y:a.y+k*b.y});
export function pcAngle10063(a:PCPoint10063,b:PCPoint10063){return Math.atan2(Math.abs(cross(a,b)),a.x*b.x+a.y*b.y)/r;}
export function pcModel10063(g:PCState10063){const origin={x:300+g.offset,y:290},t=pcUnit10063(g.angle),l=pcUnit10063(g.l),m=pcUnit10063(g.m);function at(y:number,v:PCPoint10063){const q={x:300,y},d=cross(t,v);if(Math.abs(d)<1e-12)return null;return pcAdd10063(origin,t,cross({x:q.x-origin.x,y:q.y-origin.y},v)/d);}const upper=at(190,l),lower=at(390,m),proper=upper!==null&&lower!==null,top=pcAngle10063(t,l),bottom=pcAngle10063(t,m),pairs=[[top,bottom],[top,pcAngle10063(pcAdd10063({x:0,y:0},t,-1),pcAdd10063({x:0,y:0},m,-1))],[top,pcAngle10063(pcAdd10063({x:0,y:0},t,-1),m)]],condition=proper&&g.l===g.m;return{origin,t,l,m,upper,lower,pairs,proper,condition};}
export function pcClamp10063(g:PCState10063):PCState10063{return{angle:Math.max(35,Math.min(145,g.angle)),offset:Math.max(-40,Math.min(40,g.offset)),l:Math.max(-8,Math.min(8,g.l)),m:Math.max(-8,Math.min(8,g.m))};}
export function pcLine10063(p:PCPoint10063,u:PCPoint10063){const ts:number[]=[];for(const x of[35,565])if(Math.abs(u.x)>1e-12){const s=(x-p.x)/u.x,y=p.y+s*u.y;if(y>=45-1e-8&&y<=535+1e-8)ts.push(s);}for(const y of[45,535])if(Math.abs(u.y)>1e-12){const s=(y-p.y)/u.y,x=p.x+s*u.x;if(x>=35-1e-8&&x<=565+1e-8)ts.push(s);}return ts.length>=2?[pcAdd10063(p,u,Math.min(...ts)),pcAdd10063(p,u,Math.max(...ts))]:null;}
