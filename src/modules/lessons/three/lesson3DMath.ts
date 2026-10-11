export type V3 = [number, number, number];
export const add3 = (a: V3, b: V3): V3 => a.map((x, i) => x + b[i]) as V3;
export const scale3 = (a: V3, k: number): V3 => a.map(x => x * k) as V3;
export const sub3 = (a: V3, b: V3): V3 => add3(a, scale3(b, -1));
export const dot3 = (a: V3, b: V3) => a.reduce((s, x, i) => s + x * b[i], 0);
export const cross3 = (a: V3, b: V3): V3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
export const norm3 = (a: V3) => Math.hypot(...a);
export const unit3 = (a: V3): V3 | null => norm3(a) < 1e-10 ? null : scale3(a, 1/norm3(a));
export const project3 = (a: V3, onto: V3): V3 | null => norm3(onto) < 1e-10 ? null : scale3(onto, dot3(a, onto)/dot3(onto, onto));
export const angle3 = (a: V3, b: V3): number | null => norm3(a)*norm3(b) < 1e-10 ? null : Math.acos(Math.max(-1, Math.min(1, dot3(a,b)/(norm3(a)*norm3(b)))))*180/Math.PI;
export const determinant3 = (columns: [V3,V3,V3]) => dot3(columns[0], cross3(columns[1],columns[2]));
export const transform3 = (columns: [V3,V3,V3], p: V3) => add3(add3(scale3(columns[0],p[0]),scale3(columns[1],p[1])),scale3(columns[2],p[2]));

export function closestLines(a: V3, u: V3, b: V3, v: V3) {
  if (!unit3(u) || !unit3(v)) return null;
  const w = sub3(b,a), A=dot3(u,u), B=dot3(u,v), C=dot3(v,v), D=dot3(u,w), E=dot3(v,w);
  const det=A*C-B*B, parallel=Math.abs(det)<1e-10*A*C;
  const s=parallel?D/A:(C*D-B*E)/det, t=parallel?0:(B*D-A*E)/det;
  const p=add3(a,scale3(u,s)), q=add3(b,scale3(v,t)), distance=norm3(sub3(q,p));
  return {p,q,distance,s,t,kind:parallel?(distance<1e-8?'Coincident':'Parallel'):(distance<1e-8?'Intersecting':'Skew')};
}
export function pointPlane(p: V3, n: V3, d: number) {
  if (!unit3(n)) return null;
  const foot=sub3(p,scale3(n,(dot3(n,p)-d)/dot3(n,n)));
  return {foot,distance:norm3(sub3(p,foot))};
}
export function linePlane(a: V3, u: V3, n: V3, d: number) {
  if (!unit3(n)||!unit3(u)) return null;
  const denominator=dot3(n,u), numerator=d-dot3(n,a);
  if(Math.abs(denominator)<1e-9) return {kind:Math.abs(numerator)<1e-9?'Contained':'Parallel',point:null};
  return {kind:'Intersecting',point:add3(a,scale3(u,numerator/denominator))};
}
export function intersectPlanes(n: V3, d: number, m: V3, e: number) {
  if(!unit3(n)||!unit3(m))return null;
  const direction=cross3(n,m), square=dot3(direction,direction);
  if(square<1e-10)return null;
  return {direction,point:scale3(add3(scale3(cross3(m,direction),d),scale3(cross3(direction,n),e)),1/square)};
}
export function orthogonalBasis(vectors: V3[]) {
  const basis: V3[]=[];
  for(const v of vectors){let q:V3=[...v];for(const b of basis)q=sub3(q,project3(q,b)!);const u=unit3(q);if(u)basis.push(u);}
  return basis;
}
export function solveSystem(columns: [V3,V3,V3], rhs: V3) {
  const rows=rhs.map((r,i)=>[...columns.map(c=>c[i]),r]);
  const pivots:number[]=[];let row=0;
  for(let col=0;col<3&&row<3;col++){
    let pivot=row;for(let i=row+1;i<3;i++)if(Math.abs(rows[i][col])>Math.abs(rows[pivot][col]))pivot=i;
    if(Math.abs(rows[pivot][col])<1e-9)continue;
    [rows[row],rows[pivot]]=[rows[pivot],rows[row]];
    const divisor=rows[row][col];rows[row]=rows[row].map(x=>x/divisor);
    for(let i=0;i<3;i++)if(i!==row){const k=rows[i][col];rows[i]=rows[i].map((x,j)=>x-k*rows[row][j]);}
    pivots.push(col);row++;
  }
  const inconsistent=rows.some(r=>r.slice(0,3).every(x=>Math.abs(x)<1e-9)&&Math.abs(r[3])>1e-9);
  const point:V3=[0,0,0];pivots.forEach((p,i)=>{point[p]=rows[i][3];});
  return {kind:inconsistent?'No solution':pivots.length===3?'Unique solution':'Infinitely many solutions',point:inconsistent?null:point,rank:pivots.length,rows};
}

export type SurfaceKind='bowl'|'saddle'|'wave'|'positive';
export function surfaceValue(kind:SurfaceKind,x:number,y:number){return kind==='wave'?Math.sin(x)*Math.cos(y):0.3*(x*x+(kind==='saddle'?-1:1)*y*y)+(kind==='positive'?1:0);}
export function surfaceGradient(kind:SurfaceKind,x:number,y:number):[number,number]{return kind==='wave'?[Math.cos(x)*Math.cos(y),-Math.sin(x)*Math.sin(y)]:[0.6*x,(kind==='saddle'?-0.6:0.6)*y];}
export function midpointIntegral(a:number,count:number){
  const step=2*a/count;let sum=0;
  const cells: {x:number;y:number;height:number;width:number}[]=[];
  for(let i=0;i<count;i++)for(let j=0;j<count;j++){const x=-a+(i+0.5)*step,y=-a+(j+0.5)*step,height=surfaceValue('positive',x,y);sum+=height*step*step;cells.push({x,y,height,width:step});}
  return {sum,exact:4*a*a+0.8*a**4,cells};
}
export type SolidKind='cube'|'cuboid'|'prism'|'pyramid'|'tetrahedron'|'octahedron'|'cylinder'|'cone'|'sphere'|'hemisphere'|'frustum';
export function solidMeasures(shape:SolidKind,r:number,h:number){
  const w=2*r;
  switch(shape){
    case 'cube':return {volume:w**3,area:6*w*w};
    case 'cuboid':return {volume:w*w*h,area:2*w*w+4*w*h};
    case 'prism':{const base=3*Math.sqrt(3)*r*r/4;return {volume:base*h,area:2*base+3*Math.sqrt(3)*r*h};}
    case 'pyramid':return {volume:w*w*h/3,area:w*w+2*w*Math.hypot(r,h)};
    case 'tetrahedron':return {volume:w**3/(6*Math.sqrt(2)),area:Math.sqrt(3)*w*w};
    case 'octahedron':return {volume:4*r**3/3,area:4*Math.sqrt(3)*r*r};
    case 'cylinder':return {volume:Math.PI*r*r*h,area:2*Math.PI*r*(r+h)};
    case 'cone':return {volume:Math.PI*r*r*h/3,area:Math.PI*r*(r+Math.hypot(r,h))};
    case 'sphere':return {volume:4*Math.PI*r**3/3,area:4*Math.PI*r*r};
    case 'hemisphere':return {volume:2*Math.PI*r**3/3,area:3*Math.PI*r*r};
    case 'frustum':{const top=r/2;return {volume:Math.PI*h*(r*r+r*top+top*top)/3,area:Math.PI*(r+top)*Math.hypot(h,r-top)+Math.PI*(r*r+top*top)};}
  }
}
export function sectionMeasure(shape:SolidKind,r:number,h:number,fraction:number){
  const z=shape==='sphere'?r*(2*fraction-1):shape==='hemisphere'?r*fraction:shape==='cube'?2*r*fraction:h*fraction;
  if(shape==='sphere'||shape==='hemisphere'){const radius=Math.sqrt(Math.max(0,r*r-z*z));return {z,radius,area:Math.PI*radius*radius,circular:true};}
  const radius=shape==='cone'||shape==='pyramid'?r*(1-fraction):shape==='frustum'?r*(1-fraction/2):r;
  return {z,radius,area:shape==='cube'||shape==='cuboid'||shape==='pyramid'?4*radius*radius:Math.PI*radius*radius,circular:shape!=='cube'&&shape!=='cuboid'&&shape!=='pyramid'};
}
export function conicSlice(slope:number,height:number):V3[][]{
  const lift=(x:number,y:number):V3=>[x,y,height+slope*x];
  if(Math.abs(slope-1)<1e-7)return [Array.from({length:121},(_,i)=>{const y=-4+i/15;return lift((y*y-height*height)/(2*height),y);})];
  if(slope<1){const d=1-slope*slope,a=height/d,b=height/Math.sqrt(d),c=height*slope/d;return [Array.from({length:121},(_,i)=>{const t=i*Math.PI/60;return lift(c+a*Math.cos(t),b*Math.sin(t));})];}
  const d=slope*slope-1,a=height/d,b=height/Math.sqrt(d),c=-height*slope/d;
  return [-1,1].map(sign=>Array.from({length:121},(_,i)=>{const t=-1.5+i/40;return lift(c+sign*a*Math.cosh(t),b*Math.sinh(t));}));
}
export function stereographic(z:[number,number]):V3{const [x,y]=z,d=1+x*x+y*y;return [2*x/d,2*y/d,(x*x+y*y-1)/d];}
export function inverseComplex(z:[number,number]):[number,number]|null{const [x,y]=z,d=x*x+y*y;return d<1e-12?null:[x/d,-y/d];}
export const format3=(p:V3)=>`(${p.map(x=>Math.abs(x)<1e-9?'0':Number(x.toFixed(3))).join(', ')})`;
export function cubeNetCorners(fold:number,side=1.6):V3[][]{
  const r=side/2,t=fold*Math.PI/2,c=Math.cos(t),s=Math.sin(t);
  const square:V3[]=[[-r,-r,0],[r,-r,0],[r,r,0],[-r,r,0]];
  const rx=(p:V3,sign=1):V3=>[p[0],c*p[1]-sign*s*p[2],sign*s*p[1]+c*p[2]];
  const ry=(p:V3,sign=1):V3=>[c*p[0]+sign*s*p[2],p[1],-sign*s*p[0]+c*p[2]];
  return [square,square.map(p=>add3([r,0,0],ry(add3(p,[r,0,0]),-1))),square.map(p=>add3([-r,0,0],ry(add3(p,[-r,0,0])))),square.map(p=>add3([0,-r,0],rx(add3(p,[0,-r,0]),-1))),square.map(p=>add3([0,r,0],rx(add3(p,[0,r,0])))),square.map(p=>add3([0,r,0],rx(add3([0,side,0],rx(add3(p,[0,r,0]))))))];
}
