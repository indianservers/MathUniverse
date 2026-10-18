export type ETPoint={x:number;y:number};
export function etCalculate(a:number|null,b:number|null,degrees:number|null){
 if(a===null||b===null||degrees===null||![a,b,degrees].every(Number.isFinite)||a<=0||b<=0||b>a||degrees<0||degrees>180)return null;
 const angle=degrees*Math.PI/180,c=degrees===90?0:Math.cos(angle),s=degrees===0||degrees===180?0:Math.sin(angle),p={x:a*c,y:b*s},nx=c/a,ny=s/b;
 return{a,b,degrees,c,s,p,nx,ny,focus:Math.sqrt((a-b)*(a+b)),slope:ny===0?null:-nx/ny,normalSlope:nx===0?null:ny/nx,xIntercept:nx===0?null:1/nx,yIntercept:ny===0?null:1/ny,verified:c*c+s*s};
}
export function etClip(nx:number,ny:number,k:number,rx:number,ry:number,right=rx):ETPoint[]{
 const n=Math.hypot(nx,ny);if(!n)return[];const ux=nx/n,uy=ny/n,o={x:ux*k/n,y:uy*k/n},d={x:-uy,y:ux};let lo=-Infinity,hi=Infinity;
 for(const [p,v,r,upper] of [[o.x,d.x,rx,right],[o.y,d.y,ry,ry]]){if(v===0){if(p < -r || p > upper)return[];}else{const q=(-r-p)/v,t=(upper-p)/v;lo=Math.max(lo,Math.min(q,t));hi=Math.min(hi,Math.max(q,t));}}
 return lo<=hi?[{x:o.x+lo*d.x,y:o.y+lo*d.y},{x:o.x+hi*d.x,y:o.y+hi*d.y}]:[];
}
export function etGeometry(a:number|null,b:number|null,degrees:number|null){const m=etCalculate(a,b,degrees),scale=m?Math.min(38,235/m.a,160/m.b):38,ox=260,oy=215,rx=ox/scale,ry=oy/scale;
 return{m,scale,ox,oy,rx,ry,curve:m?Array.from({length:361},(_,i)=>({x:m.a*Math.cos(i*Math.PI/180),y:m.b*Math.sin(i*Math.PI/180)})):[],tangent:m?etClip(m.nx,m.ny,1,rx,ry,440/scale):[],normal:m?etClip(-m.ny,m.nx,-m.ny*m.p.x+m.nx*m.p.y,rx,ry,440/scale):[]};}
