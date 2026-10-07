import { outlineVertices } from '../../offline-intelligence/commands';
import { compileFunctionExpression } from '../../utils/functionParser';
import { circle, line, intersectObjects, type KernelObject } from '../../workspace/geometry2dKernel';
import type { RoboObjectDescriptor } from './types';
export const rounded=(value:number)=>Number(value.toFixed(8));
export function vertices(o:RoboObjectDescriptor) { return o.vertices?.length?o.vertices:outlineVertices(o.command); }
export function center(o:RoboObjectDescriptor) {
  if(['circle','sphere','ellipse','cylinder','cone','cube','cuboid'].includes(o.type))return o.command.points[0]??o.position;
  const pts=vertices(o);if(!pts.length)return o.position;
  if(pts[0].length===2&&pts.length>=3){let crossSum=0,x=0,y=0;pts.forEach((p,i)=>{const q=pts[(i+1)%pts.length],cross=p[0]*q[1]-q[0]*p[1];crossSum+=cross;x+=(p[0]+q[0])*cross;y+=(p[1]+q[1])*cross;});if(Math.abs(crossSum)>1e-9)return [x/(3*crossSum),y/(3*crossSum)];}
  return pts[0].map((_,i)=>pts.reduce((sum,p)=>sum+(p[i]??0),0)/pts.length);
}
export function distance(a:number[],b:number[]){return Math.hypot(...a.map((v,i)=>v-(b[i]??0)));}
export function midpoint(o:RoboObjectDescriptor){const pts=vertices(o);if(o.type!=='line'||pts.length!==2)throw new Error('Midpoint requires a line segment with two endpoints.');return pts[0].map((v,i)=>(v+pts[1][i])/2);}
export function measurement(o:RoboObjectDescriptor,kind:string):number|number[] {
  const c=o.command,s=c.scale??1,r=c.radius*s,w=c.width*s,h=c.height*s,d=(c.depth??c.width)*s;
  if(kind==='CENTER'||kind==='CENTROID')return center(o);
  if(['RADIUS','DIAMETER','CIRCUMFERENCE'].includes(kind)){
    if(!['circle','sphere'].includes(o.type))throw new Error(`A ${o.type} has no single radius. Specify an incircle or circumcircle for a triangle.`);
    return kind==='RADIUS'?r:kind==='DIAMETER'?2*r:2*Math.PI*r;
  }
  if(kind==='MIDPOINT')return midpoint(o);
  if(kind==='LENGTH'||kind==='DISTANCE'||kind==='SLOPE'){
    if(o.type!=='line')throw new Error('This measurement requires a line with two endpoints.');const [a,b]=vertices(o);
    if(kind==='SLOPE'){if(Math.abs(b[0]-a[0])<1e-10)throw new Error('The slope of a vertical line is undefined.');return (b[1]-a[1])/(b[0]-a[0]);}return distance(a,b);
  }
  if(kind==='AREA'||kind==='PERIMETER'){
    if(o.mode.endsWith('3d')&&!['triangle','rectangle','square','circle','polygon'].includes(o.type))throw new Error('Use volume or surface area for a solid.');
    if(o.type==='circle')return kind==='AREA'?Math.PI*r*r:2*Math.PI*r;
    if(o.type==='ellipse')return kind==='AREA'?Math.PI*w*h/4:Math.PI*(3*(w+h)/2-Math.sqrt((3*w+h)*(w+3*h))/2);
    if(o.type==='line'||o.type==='point'||o.type==='plot')throw new Error('Area and perimeter require a closed shape.');
    const pts=vertices(o);if(kind==='PERIMETER')return pts.reduce((sum,p,i)=>sum+distance(p,pts[(i+1)%pts.length]),0);
    if(pts[0]?.length===3){let total=0;for(let i=1;i<pts.length-1;i++){const a=pts[i].map((v,j)=>v-pts[0][j]),b=pts[i+1].map((v,j)=>v-pts[0][j]);total+=Math.hypot(a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0])/2;}return total;}
    return Math.abs(pts.reduce((sum,p,i)=>sum+p[0]*pts[(i+1)%pts.length][1]-p[1]*pts[(i+1)%pts.length][0],0))/2;
  }
  if(kind==='VOLUME'||kind==='SURFACE_AREA'){
    const volume:Record<string,number>={sphere:4*Math.PI*r**3/3,cube:w**3,cuboid:w*h*d,cylinder:Math.PI*r*r*h,cone:Math.PI*r*r*h/3,prism:w*h*d,pyramid:w*d*h/3};
    const surface:Record<string,number>={sphere:4*Math.PI*r*r,cube:6*w*w,cuboid:2*(w*h+w*d+h*d),cylinder:2*Math.PI*r*(r+h),cone:Math.PI*r*(r+Math.hypot(r,h))};
    const value=(kind==='VOLUME'?volume:surface)[o.type];if(value===undefined)throw new Error(`UNSUPPORTED: ${kind.toLowerCase()} for ${o.type}.`);return value;
  }
  if(kind==='Y_INTERCEPT'){if(o.type!=='plot')throw new Error('Y intercept requires a function graph.');return [0,compileFunctionExpression(c.expression!)(0)];}
  throw new Error(`UNSUPPORTED: ${kind}.`);
}
function kernel(o:RoboObjectDescriptor):KernelObject {
  if(o.type==='circle'){const c=center(o);return circle({x:c[0],y:c[1]},o.command.radius*(o.command.scale??1));}
  if(o.type==='line'){const [a,b]=vertices(o);return line({x:a[0],y:a[1]},{x:b[0],y:b[1]});}
  throw new Error('UNSUPPORTED: Analytic intersection supports lines and circles, or two function graphs.');
}
export function numericRoots(fn:(x:number)=>number):number[] {
  const roots:number[]=[];const add=(x:number)=>{if(!roots.some(r=>Math.abs(r-x)<1e-5))roots.push(rounded(x));};
  for(let x=-100;x<100;x+=.125){let a=x,b=x+.125,fa=fn(a),fb=fn(b);if(!Number.isFinite(fa)||!Number.isFinite(fb))continue;
    if(Math.abs(fa)<1e-8)add(a);if(fa*fb<0){for(let i=0;i<45;i++){const mid=(a+b)/2,f=fn(mid);if(fa*f<=0){b=mid;fb=f;}else{a=mid;fa=f;}}const root=(a+b)/2;if(Math.abs(fn(root))<1e-6)add(root);}}
  if(Math.abs(fn(100))<1e-8)add(100);return roots;
}
export function intersections(a:RoboObjectDescriptor,b:RoboObjectDescriptor):number[][] {
  if(a.type==='plot'&&b.type==='plot'){const f=compileFunctionExpression(a.command.expression!),g=compileFunctionExpression(b.command.expression!);return numericRoots(x=>f(x)-g(x)).map(x=>[x,f(x)]);}
  return intersectObjects(kernel(a),kernel(b)).map(p=>[p.x,p.y]);
}
export function relationship(objects:RoboObjectDescriptor[],kind:string):boolean {
  const [a,b]=objects;if(!a||!b)throw new Error('Select or specify two objects.');
  if(kind==='POINT_INSIDE'||kind==='POINT_ON_CIRCLE'){
    const p=objects.find(o=>o.type==='point'),c=objects.find(o=>o.type==='circle');if(!p||!c)throw new Error('Specify a point and a circle.');const d=distance(p.position,center(c)),r=c.command.radius*(c.command.scale??1);return kind==='POINT_INSIDE'?d<r:Math.abs(d-r)<1e-7;
  }
  if(kind==='POINT_ON_LINE'){const p=objects.find(o=>o.type==='point'),l=objects.find(o=>o.type==='line');if(!p||!l)throw new Error('Specify a point and a line.');const [u,v]=vertices(l);return Math.abs((v[0]-u[0])*(p.position[1]-u[1])-(v[1]-u[1])*(p.position[0]-u[0]))<1e-7;}
  if(kind==='EQUAL_AREA')return Math.abs(Number(measurement(a,'AREA'))-Number(measurement(b,'AREA')))<1e-7;
  if(kind==='EQUAL_LENGTH')return Math.abs(Number(measurement(a,'LENGTH'))-Number(measurement(b,'LENGTH')))<1e-7;
  if(kind==='INTERSECTING')return intersections(a,b).length>0;
  if(a.type!=='line'||b.type!=='line')throw new Error('This check requires two lines.');const [p,q]=vertices(a),[r,s]=vertices(b),u=q.map((v,i)=>v-p[i]),v=s.map((n,i)=>n-r[i]);
  if(kind==='PERPENDICULAR')return Math.abs(u.reduce((sum,n,i)=>sum+n*v[i],0))<1e-7*distance(p,q)*distance(r,s);
  if(kind==='PARALLEL')return Math.abs(u[0]*v[1]-u[1]*v[0])<1e-7*distance(p,q)*distance(r,s);
  throw new Error(`UNSUPPORTED: ${kind}.`);
}
