import { compileFunctionExpression, compileTwoVariableExpression } from "../utils/functionParser";
import { sampleFunction, approximateRoots } from "../utils/mathEngine/graphSampler";
import type { ARGraphGeometry, ARGraphSettings, ARGeneratedGraphObject } from "./types";

export type PlanarPoint = [number, number];
export function resolveARParameters(expression: string, parameters: Record<string, number>) {
  return Object.entries(parameters).reduce((s, [key, value]) => {
    if (!/^[a-zA-Z]+$/.test(key) || !Number.isFinite(value)) throw new Error("Parameters must be finite numbers.");
    if (["x", "y", "z", "t", "u", "v", "theta"].includes(key.toLowerCase()) || (key === "r" && /^r\s*=/i.test(expression))) return s;
    return s.replace(new RegExp(`(?<![A-Za-z_])${key}(?![A-Za-z_0-9])`, "g"), `(${value})`);
  }, expression);
}
export function generateARPlanarGraph(input: string, settings: ARGraphSettings, parameters: Record<string, number>): Extract<ARGraphGeometry, {kind:"curve"}> {
  const source = resolveARParameters(input, parameters).replace(/θ/g,"theta").trim();
  const [xmin,xmax]=settings.xRange, [ymin,ymax]=settings.yRange;
  if (![xmin,xmax,ymin,ymax].every(Number.isFinite) || xmin>=xmax || ymin>=ymax) throw new Error("Graph ranges must increase and be finite.");
  const segments: [number,number,number][][]=[]; const regionPoints: [number,number,number][]=[];
  let invalidPointCount=0;
  const parametric=source.match(/^x\s*=(.+),\s*y\s*=(.+)$/i);
  const relation=source.match(/^(.+?)(<=|>=|<|>|=)(.+)$/);
  const explicit=/^y\s*=/i.test(source), sideways=/^x\s*=/i.test(source) && !/y\s*=/i.test(source.split("=").slice(1).join("="));
  const polar=source.match(/^r\s*=(.+)$/i);
  if (parametric) {
    const fx=compileFunctionExpression(parametric[1].replace(/(?<![a-z])t\b/gi,"x")),fy=compileFunctionExpression(parametric[2].replace(/(?<![a-z])t\b/gi,"x"));
    let segment:[number,number,number][]=[];
    for(let i=0;i<=720;i++){const t=settings.tRange[0]+i/720*(settings.tRange[1]-settings.tRange[0]),x=fx(t),y=fy(t);if(Number.isFinite(x)&&Number.isFinite(y))segment.push([x,y,0]);else{if(segment.length>1)segments.push(segment);segment=[];invalidPointCount++;}}
    if(segment.length>1)segments.push(segment);
  } else if (relation && !explicit && !sideways && !polar) {
    const fn=compileTwoVariableExpression(`(${relation[1]})-(${relation[3]})`); const cells=80;
    for(let j=0;j<cells;j++) for(let i=0;i<cells;i++) {
      const x=xmin+i*(xmax-xmin)/cells,y=ymin+j*(ymax-ymin)/cells,dx=(xmax-xmin)/cells,dy=(ymax-ymin)/cells;
      const c:[[number,number],[number,number],[number,number],[number,number]]=[[x,y],[x+dx,y],[x+dx,y+dy],[x,y+dy]];
      const values=c.map(p=>fn(...p)); if(!values.every(Number.isFinite)){invalidPointCount++;continue;}
      const crossings: [number,number,number][]=[];
      for(let edge=0;edge<4;edge++){const next=(edge+1)%4,a=values[edge],b=values[next]; if((a<0)!==(b<0)) {
        const r=a/(a-b); const px=c[edge][0]+r*(c[next][0]-c[edge][0]),py=c[edge][1]+r*(c[next][1]-c[edge][1]);
        if(Math.abs(fn(px,py))<=Math.max(1e-6,Math.abs(a-b)*0.12))crossings.push([px,py,0]);
      }}
      for(let k=0;k+1<crossings.length;k+=2)segments.push([crossings[k],crossings[k+1]]);
      const value=fn(x+dx/2,y+dy/2), op=relation[2];
      if((op==="<"&&value<0)||(op==="<="&&value<=0)||(op===">"&&value>0)||(op===">="&&value>=0))regionPoints.push([x+dx/2,y+dy/2,0]);
    }
  } else if(polar) {
    const fn=compileFunctionExpression(polar[1].replace(/theta/gi,"x")); let segment:[number,number,number][]=[];
    for(let i=0;i<=720;i++){const t=i/720*Math.PI*2,r=fn(t);if(Number.isFinite(r)){segment.push([r*Math.cos(t),r*Math.sin(t),0]);}else {if(segment.length>1)segments.push(segment);segment=[];invalidPointCount++;}}
    if(segment.length>1)segments.push(segment);
  } else {
    const side=sideways || (!relation && /\by\b/i.test(source) && !/\bx\b/i.test(source));
    const expression=source.replace(/^[xy]\s*=/i,"").replace(side?/(?<![a-z])y\b/gi:/$^/,"x");
    const sample=sampleFunction(expression,side?ymin:xmin,side?ymax:xmax,700); if(sample.error)throw new Error(sample.error);
    let segment:[number,number,number][]=[];
    for(const p of sample.points){
      if(p.valid&&p.y!==null&&p.y>= (side?xmin:ymin)&&p.y<= (side?xmax:ymax)){
        const point:[number,number,number]=side?[p.y,p.x,0]:[p.x,p.y,0];
        if(segment.length&&Math.abs(point[1]-segment.at(-1)![1])>(ymax-ymin)*0.35){if(segment.length>1)segments.push(segment);segment=[];}
        segment.push(point);
      }else{if(segment.length>1)segments.push(segment);segment=[];invalidPointCount++;}
    }if(segment.length>1)segments.push(segment);
  }
  if(!segments.length&&!regionPoints.length)throw new Error("No graph is visible in this range. Expand the bounds or check the real domain.");
  return {kind:"curve",points:segments.flat(),segments,regionPoints,valueStats:{invalidPointCount},warnings:invalidPointCount?["Undefined or out-of-window portions are omitted; branches remain separate."]:[]};
}
export function analyzeARFunction(expression: string, x: number, bounds:[number,number], parameters:Record<string,number>) {
  const source=resolveARParameters(expression,parameters).replace(/^y\s*=/i,""); const fn=compileFunctionExpression(source);
  if (!Number.isFinite(x)) throw new Error("Trace position must be finite.");
  const y=fn(x),h=1e-4*Math.max(1,Math.abs(x)),slope=(fn(x+h)-fn(x-h))/(2*h);
  if (!Number.isFinite(y) || !Number.isFinite(slope)) throw new Error("No finite point or tangent at this trace position.");
  const [a,b]=bounds;if(!Number.isFinite(a)||!Number.isFinite(b)||a>=b)throw new Error("Integration bounds must increase.");
  let integral=0;const steps=800;
  for(let i=0;i<=steps;i++){const value=fn(a+(b-a)*i/steps);if(!Number.isFinite(value))throw new Error("The function is undefined within the integration interval.");integral+=value*(i===0||i===steps?1:i%2?4:2);}
  return {x,y,slope,integral:integral*(b-a)/(3*steps),roots:approximateRoots(source,a,b).roots,table:Array.from({length:11},(_,i)=>{const x=a+(b-a)*i/10;return {x,y:fn(x)};})};
}
export function regularARPolygon(sides:number,radius:number):PlanarPoint[]{
  if(!Number.isInteger(sides)||sides<3||sides>32||!Number.isFinite(radius)||radius<=0)throw new Error("Use 3–32 sides and a positive radius.");
  return Array.from({length:sides},(_,i)=>[radius*Math.cos(i*2*Math.PI/sides),radius*Math.sin(i*2*Math.PI/sides)]);
}
export function polygonMetrics(points:PlanarPoint[]){
  if(points.length<3||points.length>64||!points.every(p=>p.every(Number.isFinite)))throw new Error("Enter 3–64 finite vertices.");
  for(let i=0;i<points.length;i++)for(let j=i+1;j<points.length;j++){
    if(j===i+1||(i===0&&j===points.length-1))continue;
    const a=points[i],b=points[(i+1)%points.length],c=points[j],d=points[(j+1)%points.length];
    const cross=(p:PlanarPoint,q:PlanarPoint,r:PlanarPoint)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
    if(cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)throw new Error("Polygon edges must not cross.");
  }
  let twiceArea=0,perimeter=0,cx=0,cy=0;
  for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],cross=a[0]*b[1]-b[0]*a[1];twiceArea+=cross;perimeter+=Math.hypot(b[0]-a[0],b[1]-a[1]);cx+=(a[0]+b[0])*cross;cy+=(a[1]+b[1])*cross;}
  if(Math.abs(twiceArea)<1e-10)throw new Error("The polygon must have non-zero area.");
  let convexSign=0;
  for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],c=points[(i+2)%points.length],cross=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);if(Math.abs(cross)<1e-10)throw new Error("Remove repeated or collinear vertices.");if(convexSign&&Math.sign(cross)!==convexSign)throw new Error("Use a convex polygon for this construction tool.");convexSign=Math.sign(cross);}
  const angles=points.map((p,i)=>{const a=points[(i+points.length-1)%points.length],b=points[(i+1)%points.length],ux=a[0]-p[0],uy=a[1]-p[1],vx=b[0]-p[0],vy=b[1]-p[1];return Math.acos(Math.max(-1,Math.min(1,(ux*vx+uy*vy)/(Math.hypot(ux,uy)*Math.hypot(vx,vy)))))*180/Math.PI;});
  return {area:Math.abs(twiceArea)/2,perimeter,centroid:[cx/(3*twiceArea),cy/(3*twiceArea)] as PlanarPoint,angles};
}
export function transformARPolygon(points:PlanarPoint[],angle:number,scale:number,translation:PlanarPoint,reflect=false):PlanarPoint[]{
  if(![angle,scale,...translation].every(Number.isFinite)||scale<=0)throw new Error("Use finite transforms and a positive scale.");
  const r=angle*Math.PI/180;return points.map(([x,y])=>{const px=reflect?-x:x;return [scale*(px*Math.cos(r)-y*Math.sin(r))+translation[0],scale*(px*Math.sin(r)+y*Math.cos(r))+translation[1]];});
}
export function extrudeARPolygon(points:PlanarPoint[],height:number):Extract<ARGraphGeometry,{kind:"surface"}>{
  polygonMetrics(points);if(!Number.isFinite(height)||height<=0)throw new Error("Extrusion height must be positive.");
  let sign=0;for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length],c=points[(i+2)%points.length],cross=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);if(Math.abs(cross)<1e-10)throw new Error("Remove repeated or collinear vertices.");if(sign&&Math.sign(cross)!==sign)throw new Error("Extrusion currently requires a convex polygon.");sign=Math.sign(cross);}
  const vertices=[...points.map(([x,y])=>[x,0,y]),...points.map(([x,y])=>[x,height,y])].flat(),indices:number[]=[],n=points.length;
  for(let i=1;i<n-1;i++)indices.push(0,i+1,i,n,n+i,n+i+1);
  for(let i=0;i<n;i++){const j=(i+1)%n;indices.push(i,j,n+j,i,n+j,n+i);}
  return {kind:"surface",vertices,indices,valueStats:{minZ:0,maxZ:height,invalidPointCount:0},warnings:[]};
}
export function createARConstruction(name:string,geometry:ARGraphGeometry,settings:ARGraphSettings):ARGeneratedGraphObject {
  const type=geometry.kind==="surface"?"geometry_construction":"planar_graph";
  return {id:crypto.randomUUID(),name,equation:name,type,visible:true,locked:false,transform:{scale:settings.graphScale,rotation:[0,0,0],position:[0,0.45,0]},settings,geometry,parameterValues:{},explanation:"Coordinate construction; dimensions are in graph units, not measured camera distances.",classification:{type,normalizedInput:name,confidence:"high",dimensions:[],variables:[],recommendedMode:"3d-preview",message:name},status:"ready"};
}
export function sectionARMesh(geometry:ARGraphGeometry,axis:0|1|2,value:number):Extract<ARGraphGeometry,{kind:"curve"}>{
  if(geometry.kind!=="surface")throw new Error("Select a surface for sectioning.");if(!Number.isFinite(value))throw new Error("Section position must be finite.");
  const segments:[number,number,number][][]=[];
  for(let i=0;i<geometry.indices.length;i+=3){const tri=geometry.indices.slice(i,i+3).map(n=>geometry.vertices.slice(n*3,n*3+3) as [number,number,number]); const crossings:[number,number,number][]=[];
    for(let e=0;e<3;e++){const a=tri[e],b=tri[(e+1)%3],da=a[axis]-value,db=b[axis]-value;if((da<0)!==(db<0)){const t=da/(da-db);crossings.push(a.map((v,k)=>v+t*(b[k]-v)) as [number,number,number]);}}
    if(crossings.length===2)segments.push(crossings);
  }if(!segments.length)throw new Error("This plane does not cross the sampled mesh.");
  return {kind:"curve",points:segments.flat(),segments,valueStats:{invalidPointCount:0},warnings:["Section coordinates refer to the displayed mesh, including its display scaling."]};
}
export function exportARMeshOBJ(graph:ARGeneratedGraphObject){
  if(graph.geometry.kind!=="surface")throw new Error("OBJ export requires a surface.");
  const {vertices,indices}=graph.geometry;return ['# AR Math Lab displayed mesh',...Array.from({length:vertices.length/3},(_,i)=>'v '+vertices.slice(i*3,i*3+3).join(' ')),...Array.from({length:indices.length/3},(_,i)=>'f '+indices.slice(i*3,i*3+3).map(n=>n+1).join(' '))].join('\n');
}

export function circleARPoints(center:PlanarPoint,radius:number):[number,number,number][]{
  if(![...center,radius].every(Number.isFinite)||radius<=0)throw new Error("Circle radius must be positive and its center finite.");
  return Array.from({length:181},(_,i)=>{const t=i*Math.PI/90;return [center[0]+radius*Math.cos(t),center[1]+radius*Math.sin(t),0];});
}
export function intersectARCircles(a:PlanarPoint,ra:number,b:PlanarPoint,rb:number):PlanarPoint[]{
  circleARPoints(a,ra);circleARPoints(b,rb);const d=Math.hypot(b[0]-a[0],b[1]-a[1]);
  if(d<1e-10){if(Math.abs(ra-rb)<1e-10)throw new Error("Coincident circles have infinitely many intersections.");return [];}
  if(d>ra+rb+1e-10||d<Math.abs(ra-rb)-1e-10)return [];
  const x=(ra*ra-rb*rb+d*d)/(2*d),h=Math.sqrt(Math.max(0,ra*ra-x*x)),px=a[0]+x*(b[0]-a[0])/d,py=a[1]+x*(b[1]-a[1])/d,dx=-(b[1]-a[1])*h/d,dy=(b[0]-a[0])*h/d;
  return h<1e-8?[[px,py]]:[[px+dx,py+dy],[px-dx,py-dy]];
}
export function triangleARCenters(points:PlanarPoint[]){
  const metrics=polygonMetrics(points);if(points.length!==3)throw new Error("Triangle centers require exactly three vertices.");
  const [a,b,c]=points,den=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));
  const sq=(p:PlanarPoint)=>p[0]*p[0]+p[1]*p[1];
  const circumcenter:PlanarPoint=[(sq(a)*(b[1]-c[1])+sq(b)*(c[1]-a[1])+sq(c)*(a[1]-b[1]))/den,(sq(a)*(c[0]-b[0])+sq(b)*(a[0]-c[0])+sq(c)*(b[0]-a[0]))/den];
  const lengths=[Math.hypot(b[0]-c[0],b[1]-c[1]),Math.hypot(a[0]-c[0],a[1]-c[1]),Math.hypot(a[0]-b[0],a[1]-b[1])];
  const incenter:PlanarPoint=[points.reduce((sum,p,i)=>sum+p[0]*lengths[i],0)/metrics.perimeter,points.reduce((sum,p,i)=>sum+p[1]*lengths[i],0)/metrics.perimeter];
  return {centroid:metrics.centroid,circumcenter,incenter,orthocenter:[a[0]+b[0]+c[0]-2*circumcenter[0],a[1]+b[1]+c[1]-2*circumcenter[1]] as PlanarPoint,circumradius:Math.hypot(a[0]-circumcenter[0],a[1]-circumcenter[1]),inradius:2*metrics.area/metrics.perimeter};
}
