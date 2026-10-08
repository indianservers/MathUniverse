import {center,distance,vertices,intersections,measurement} from './geometryQueries';
import {EPSILON,near} from './tolerances';
import type {RoboObjectDescriptor} from './types';
export const dot=(a:number[],b:number[])=>a.reduce((sum,n,i)=>sum+n*b[i],0);
export const subtract=(a:number[],b:number[])=>a.map((n,i)=>n-b[i]);
export function unit(vector:number[]){const norm=Math.hypot(...vector);if(norm<EPSILON)throw new Error('Coincident points do not define a direction.');return vector.map(n=>n/norm);}
export function projection(point:number[],line:RoboObjectDescriptor){if(line.type!=='line')throw new Error('Projection requires a reference line.');const [a,b]=vertices(line),u=subtract(b,a),t=dot(subtract(point,a),u)/dot(u,u);if(!Number.isFinite(t))throw new Error('A degenerate line has no projection.');return a.map((n,i)=>n+t*u[i]);}
export function angleBetween(a:RoboObjectDescriptor,b:RoboObjectDescriptor){if(a.type!=='line'||b.type!=='line')throw new Error('Angle requires two lines.');const u=unit(subtract(vertices(a)[1],vertices(a)[0])),v=unit(subtract(vertices(b)[1],vertices(b)[0]));return Math.acos(Math.max(-1,Math.min(1,dot(u,v))))*180/Math.PI;}
export function triangleData(o:RoboObjectDescriptor){const p=vertices(o);if(o.type!=='triangle'||p.length!==3)throw new Error('Specify a triangle with three vertices.');const [a,b,c]=p,lengths=[distance(b,c),distance(a,c),distance(a,b)],area=Number(measurement(o,'AREA'));if(area<EPSILON)throw new Error('Degenerate triangle: the points are collinear.');return {p,a,b,c,lengths,area};}
export function triangleCenter(o:RoboObjectDescriptor,kind:string){const {a,b,c,lengths:[la,lb,lc],area}=triangleData(o);
  if(kind==='INCENTER')return {point:a.map((n,i)=>(la*n+lb*b[i]+lc*c[i])/(la+lb+lc)),radius:2*area/(la+lb+lc)};
  const det=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));if(Math.abs(det)<EPSILON)throw new Error('No unique circumcenter for collinear vertices.');
  const aa=dot(a,a),bb=dot(b,b),cc=dot(c,c),u=[(aa*(b[1]-c[1])+bb*(c[1]-a[1])+cc*(a[1]-b[1]))/det,(aa*(c[0]-b[0])+bb*(a[0]-c[0])+cc*(b[0]-a[0]))/det];
  return {point:kind==='ORTHOCENTER'?a.map((n,i)=>n+b[i]+c[i]-2*u[i]):u,radius:distance(u,a)};
}
export function derivedMeasurement(o:RoboObjectDescriptor,kind:string):number|string|number[]|number[][]{
  if(kind==='COORDINATES')return o.type==='point'?o.position:vertices(o);
  if(['INCENTER','CIRCUMCENTER','ORTHOCENTER'].includes(kind))return triangleCenter(o,kind).point;
  if(kind==='EQUATION'){if(o.type!=='line')throw new Error('A line equation needs a line.');const [a,b]=vertices(o),A=b[1]-a[1],B=a[0]-b[0],C=-(A*a[0]+B*a[1]);return `${A}x + ${B}y + ${C} = 0`;}
  if(kind==='TRIANGLE_TYPE'){const {lengths}=triangleData(o),s=[...lengths].sort((a,b)=>a-b);return `${near(s[0],s[2])?'equilateral':near(s[0],s[1])||near(s[1],s[2])?'isosceles':'scalene'}, ${near(s[0]**2+s[1]**2,s[2]**2)?'right angled':s[0]**2+s[1]**2>s[2]**2?'acute angled':'obtuse angled'}`;}
  if(kind==='LONGEST_SIDE'){const {lengths}=triangleData(o);return Math.max(...lengths);}
  if(kind==='LARGEST_ANGLE'){const {lengths}=triangleData(o),a=Math.max(...lengths),[b,c]=lengths.filter((_,i)=>i!==lengths.indexOf(a));return Math.acos((b*b+c*c-a*a)/(2*b*c))*180/Math.PI;}
  throw new Error(`UNSUPPORTED: ${kind}.`);
}
export function derivedRelationship(objects:RoboObjectDescriptor[],kind:string){
  if(kind==='TANGENT'){const [a,b]=objects;if(a.type==='circle'&&b.type==='circle'){const d=distance(center(a),center(b)),r=a.command.radius*(a.command.scale??1),s=b.command.radius*(b.command.scale??1);return near(d,r+s)||d>EPSILON&&near(d,Math.abs(r-s));}const c=objects.find(o=>o.type==='circle'),l=objects.find(o=>o.type==='line');if(!c||!l)throw new Error('Tangency requires two circles or a circle and line.');return near(distance(center(c),projection(center(c),l)),c.command.radius*(c.command.scale??1));}
  if(kind==='COLLINEAR'){if(objects.some(o=>o.type!=='point')||objects.length<3)throw new Error('Specify three points for collinearity.');const [a,b,...rest]=objects.map(o=>o.position),u=subtract(b,a);if(Math.hypot(...u)<EPSILON)throw new Error('Use distinct points.');return rest.every(c=>near(u[0]*(c[1]-a[1])-u[1]*(c[0]-a[0]),0));}
  if(kind==='POINT_OUTSIDE'){const p=objects.find(o=>o.type==='point'),c=objects.find(o=>o.type==='circle');if(!p||!c)throw new Error('Specify a point and circle.');return distance(p.position,center(c))>c.command.radius*(c.command.scale??1)+EPSILON;}
  if(kind==='RIGHT_TRIANGLE')return derivedMeasurement(objects[0],'TRIANGLE_TYPE').toString().includes('right angled');
  if(kind==='EQUAL_ANGLES'){if(objects.length!==4)throw new Error('Select four lines defining two angles.');return near(angleBetween(objects[0],objects[1]),angleBetween(objects[2],objects[3]));}
  return intersections(objects[0],objects[1]).length>0;
}
