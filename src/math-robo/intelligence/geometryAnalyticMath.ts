export const EPS=1e-8;
export const near=(a:number,b:number)=>Math.abs(a-b)<=EPS*Math.max(1,Math.abs(a),Math.abs(b));
export const add=(a:number[],b:number[])=>a.map((x,i)=>x+b[i]);
export const sub=(a:number[],b:number[])=>a.map((x,i)=>x-b[i]);
export const mul=(a:number[],k:number)=>a.map(x=>x*k);
export const dot=(a:number[],b:number[])=>a.reduce((s,x,i)=>s+x*b[i],0);
export const cross=(a:number[],b:number[])=>a[0]*b[1]-a[1]*b[0];
export const cross3=(a:number[],b:number[])=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const norm=(a:number[])=>Math.hypot(...a);
export const dist=(a:number[],b:number[])=>norm(sub(a,b));
export const mid=(a:number[],b:number[])=>mul(add(a,b),.5);
export const unit=(a:number[])=>{const l=norm(a);if(l<=EPS)throw new Error('Distinct points are required for a direction.');return mul(a,1/l);};
export const clamp=(x:number,a=-1,b=1)=>Math.max(a,Math.min(b,x));
export const turn=(a:number[],b:number[],c:number[])=>cross(sub(b,a),sub(c,a));
export const signedArea=(p:number[][])=>p.reduce((s,a,i)=>s+cross(a,p[(i+1)%p.length]),0)/2;
export const area=(p:number[][])=>Math.abs(signedArea(p));
export function foot(p:number[],a:number[],b:number[],domain:'line'|'segment'|'ray'='line'){
  const d=sub(b,a),l=dot(d,d);if(l<=EPS*EPS)throw new Error('A zero-length line has no direction.');
  let t=dot(sub(p,a),d)/l;if(domain==='segment')t=clamp(t,0,1);if(domain==='ray')t=Math.max(0,t);return add(a,mul(d,t));
}
export const onLine=(p:number[],a:number[],b:number[])=>dist(p,foot(p,a,b))<=EPS;
export const onSegment=(p:number[],a:number[],b:number[])=>dist(p,foot(p,a,b,'segment'))<=EPS;
export function lineHit(a:number[],b:number[],c:number[],d:number[]){const u=sub(b,a),v=sub(d,c),den=cross(u,v);unit(u);unit(v);if(near(den,0))return;return add(a,mul(u,cross(sub(c,a),v)/den));}
export function segmentsMeet(a:number[],b:number[],c:number[],d:number[]){const p=lineHit(a,b,c,d);return p?onSegment(p,a,b)&&onSegment(p,c,d):[a,b].some(p=>onSegment(p,c,d))||[c,d].some(p=>onSegment(p,a,b));}
export function inside(p:number[],poly:number[][],boundary=true){let result=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];if(onSegment(p,a,b))return boundary;
  if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])result=!result;
}return result;}
export function validatePolygon(p:number[][]){if(p.length<3||p.some((a,i)=>dist(a,p[(i+1)%p.length])<=EPS)||area(p)<=EPS)throw new Error('A nondegenerate polygon is required.');
  if(p.some((a,i)=>p.some((c,j)=>j>i&&j!==(i+1)%p.length&&i!==(j+1)%p.length&&segmentsMeet(a,p[(i+1)%p.length],c,p[(j+1)%p.length]))))throw new Error('The polygon crosses itself.');return p;
}
export function hull(points:number[][]){const p=[...points].sort((a,b)=>a[0]-b[0]||a[1]-b[1]).filter((a,i,list)=>!i||dist(a,list[i-1])>EPS);if(p.length<3)return p;
  const half=(list:number[][])=>{const out:number[][]=[];for(const x of list){while(out.length>=2&&turn(out.at(-2)!,out.at(-1)!,x)<=EPS)out.pop();out.push(x);}return out;};
  return [...half(p).slice(0,-1),...half([...p].reverse()).slice(0,-1)];
}
export function convexClip(subject:number[][],clip:number[][]){let out=subject;const sign=Math.sign(signedArea(clip));
  for(let i=0;i<clip.length;i++){const a=clip[i],b=clip[(i+1)%clip.length],input=out;out=[];if(!input.length)break;
    for(let j=0;j<input.length;j++){const p=input[j],q=input[(j+1)%input.length],pi=sign*turn(a,b,p)>=-EPS,qi=sign*turn(a,b,q)>=-EPS;
      if(pi)out.push(p);if(pi!==qi){const x=lineHit(p,q,a,b);if(x)out.push(x);}
    }
  }return out.filter((p,i,list)=>!i||dist(p,list[i-1])>EPS);
}
export function segmentIntervals(a:number[],b:number[],poly:number[][]){unit(sub(b,a));const ts=[0,1],d=sub(b,a);
  for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],x=lineHit(a,b,p,q);if(x&&onSegment(x,a,b)&&onSegment(x,p,q))ts.push(dot(sub(x,a),d)/dot(d,d));
    for(const v of [p,q])if(onSegment(v,a,b))ts.push(dot(sub(v,a),d)/dot(d,d));
  }
  const sorted=ts.sort((x,y)=>x-y).filter((v,i,list)=>!i||!near(v,list[i-1]));
  return sorted.slice(0,-1).flatMap((t,i)=>inside(add(a,mul(d,(t+sorted[i+1])/2)),poly)?[[t,sorted[i+1]]]:[]);
}
export function lineCircle(a:number[],b:number[],c:number[],r:number){if(r<=0)throw new Error('A positive radius is required.');const u=unit(sub(b,a)),f=foot(c,a,b),h2=r*r-dist(f,c)**2;if(h2<-EPS)return [];if(near(h2,0))return [f];const h=Math.sqrt(Math.max(0,h2));return [sub(f,mul(u,h)),add(f,mul(u,h))];}
export function circleCircle(a:number[],r:number,b:number[],s:number){const d=dist(a,b);if(r<=0||s<=0)throw new Error('Positive radii are required.');
  if(d<=EPS){if(near(r,s))throw new Error('Coincident circles have infinitely many intersections.');return [];}
  if(d>r+s+EPS||d<Math.abs(r-s)-EPS)return [];
  const u=unit(sub(b,a)),x=(d*d+r*r-s*s)/(2*d),f=add(a,mul(u,x)),h=Math.sqrt(Math.max(0,r*r-x*x)),v=[-u[1],u[0]];return h<=EPS?[f]:[add(f,mul(v,h)),sub(f,mul(v,h))];
}
export function circleOverlap(r:number,s:number,d:number){if(d>=r+s)return 0;if(d<=Math.abs(r-s))return Math.PI*Math.min(r,s)**2;const a=Math.acos(clamp((d*d+r*r-s*s)/(2*d*r))),b=Math.acos(clamp((d*d+s*s-r*r)/(2*d*s)));return r*r*a+s*s*b-.5*Math.sqrt(Math.max(0,(-d+r+s)*(d+r-s)*(d-r+s)*(d+r+s)));}
export function circumcenter(a:number[],b:number[],c:number[]){const d=2*turn(a,b,c);if(Math.abs(d)<=EPS)throw new Error('Collinear points have no unique circumcircle.');const x=dot(a,a),y=dot(b,b),z=dot(c,c);return [(x*(b[1]-c[1])+y*(c[1]-a[1])+z*(a[1]-b[1]))/d,(x*(c[0]-b[0])+y*(a[0]-c[0])+z*(b[0]-a[0]))/d];}
export const angle=(a:number[],b:number[],c:number[])=>Math.atan2(Math.abs(cross(unit(sub(a,b)),unit(sub(c,b)))),dot(unit(sub(a,b)),unit(sub(c,b))))*180/Math.PI;
export const rotate=(p:number[],o:number[],degrees:number)=>{const r=degrees*Math.PI/180,[x,y]=sub(p,o);return add(o,[x*Math.cos(r)-y*Math.sin(r),x*Math.sin(r)+y*Math.cos(r)]);};
export const reflect=(p:number[],a:number[],b:number[])=>sub(mul(foot(p,a,b),2),p);
export function centroid(p:number[][]){const twice=2*signedArea(p);if(Math.abs(twice)<=EPS)throw new Error('A degenerate polygon has no area centroid.');return p.reduce((v,a,i)=>{const b=p[(i+1)%p.length],k=cross(a,b);return add(v,mul(add(a,b),k/(3*twice)));},[0,0]);}
