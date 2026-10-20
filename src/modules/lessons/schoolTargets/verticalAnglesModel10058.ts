export type VAPoint10058={x:number;y:number};
export type VAState10058={angle:number;p:number};
export const vaInitial10058:VAState10058={angle:68,p:56};export const vaTarget10058:VAState10058={angle:125,p:27.5};
export const vaClamp10058=(a:number)=>Math.max(25,Math.min(155,a));
const normalize=(p:number)=>p-360*Math.floor((p+180)/360);
export function vaSet10058(g:VAState10058,angle:number){const a=vaClamp10058(angle),q=g.p-180+g.angle;return{angle:a,p:normalize(q+180-a)};}
export function vaMove10058(g:VAState10058,line:'p'|'q',degrees:number,snap=true){const q=g.p-180+g.angle,raw=line==='p'?180-(degrees-q):180-g.p+degrees,a=vaClamp10058(snap?Math.round(raw):raw);return line==='p'?{angle:a,p:normalize(q+180-a)}:{angle:a,p:g.p};}
export const vaUnit10058=(degrees:number)=>({x:Math.cos(degrees*Math.PI/180),y:Math.sin(degrees*Math.PI/180)});
export function vaModel10058(g:VAState10058){const p=vaUnit10058(g.p),q=vaUnit10058(g.p-180+g.angle),neg=(v:VAPoint10058)=>({x:-v.x,y:-v.y}),arms=[q,neg(p),neg(q),p],origin={x:300,y:230},point=(v:VAPoint10058,r=210)=>({x:origin.x+r*v.x,y:origin.y+r*v.y}),cross=(a:VAPoint10058,b:VAPoint10058)=>a.x*b.y-a.y*b.x,proper=[g.p,g.angle].every(Number.isFinite)&&g.angle>0&&g.angle<180&&Math.abs(cross(p,q))>1e-10,values=proper?arms.map((a,i)=>{const b=arms[(i+1)%4];return Math.atan2(Math.abs(cross(a,b)),a.x*b.x+a.y*b.y)*180/Math.PI;}):[null,null,null,null];return{p,q,arms,origin,point,proper,values,endpoints:{p:[point(p),point(neg(p))],q:[point(q),point(neg(q))]}};}
export function vaMatch10058(raw:string,target:number){const s=raw.trim();if(s.length>64||!/^\+?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(s)||!Number.isFinite(Number(s))||Number(s)<=0||Number(s)>=180)return false;const[m,exp='0']=s.replace(/^\+/,'').toLowerCase().split('e'),[w,f='']=m.split('.'),e=Number(exp)-f.length;if(Math.abs(e)>300)return false;const n=BigInt((w||'0')+f);return e>=0?n*10n**BigInt(e)===BigInt(target):n===BigInt(target)*10n**BigInt(-e);}
