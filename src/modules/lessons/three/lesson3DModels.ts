import type { Investigation3D } from './lesson3DRegistry';
import { add3, sub3, scale3, dot3, cross3, norm3, unit3, project3, angle3, closestLines, pointPlane, linePlane, intersectPlanes, orthogonalBasis, determinant3, transform3, solveSystem, surfaceValue, surfaceGradient, midpointIntegral, solidMeasures, sectionMeasure, conicSlice, stereographic, inverseComplex, format3, cubeNetCorners, type V3, type SolidKind, type SurfaceKind } from './lesson3DMath';

export type InvestigationState={a:V3;b:V3;k:number;l:number;m:number;shape:SolidKind;surface:SurfaceKind;scenario:string;construction:boolean};
export type Control3D={key:'k'|'l'|'m';label:string;min:number;max:number;step:number};
export type Segment3D={points:V3[];color:string;dashed?:boolean};
export type Arrow3D={start:V3;vector:V3;color:string;label?:string};
export type Plane3D={normal:V3;offset:number;color:string;size?:number};
export type Body3D={kind:SolidKind;radius:number;height:number;position:V3;color:string;wire?:boolean;opacity?:number;clipHeight?:number;flip?:boolean;innerRadius?:number};
export type Patch3D={kind:SurfaceKind|'tangent'|'complex';point?:[number,number];domain?:number;color:string};
export type Box3D={size:V3;position:V3;color:string;opacity?:number};
export type Marker3D={point:V3;color:string;label:string;drag?:'a'|'b'|'surface'};
export type Model3D={segments:Segment3D[];arrows:Arrow3D[];planes:Plane3D[];bodies:Body3D[];boxes:Box3D[];patches:Patch3D[];markers:Marker3D[];readouts:[string,string][];notice:string;net?:number;torus?:{u:number;v:number};extent:number};
export const COLORS={a:'#2563eb',b:'#e87916',result:'#059669',secondary:'#9333ea',error:'#e11d48'};
export function investigationFrame(model:Model3D,profile:SurfaceKind){
  const points:V3[]=[];
  const box=(center:V3,half:V3)=>{for(let i=0;i<8;i++)points.push(center.map((x,j)=>x+(i&(1<<j)?1:-1)*half[j]) as V3);};
  model.segments.forEach(s=>points.push(...s.points));model.arrows.forEach(a=>points.push(a.start,add3(a.start,a.vector)));model.markers.forEach(m=>points.push(m.point));
  model.boxes.forEach(b=>box(b.position,scale3(b.size,0.5)));
  model.bodies.forEach(b=>{const spherical=['sphere','hemisphere','tetrahedron','octahedron'].includes(b.kind),height=b.kind==='cube'?2*b.radius:b.height;box(spherical?b.position:add3(b.position,[0,0,height/2]),[b.radius*(b.kind==='tetrahedron'?1.3:1),b.radius*(b.kind==='tetrahedron'?1.3:1),spherical?b.radius*1.3:height/2]);});
  model.planes.forEach(p=>box(scale3(p.normal,p.offset/dot3(p.normal,p.normal)),[(p.size??5)/2,(p.size??5)/2,(p.size??5)/2]));
  model.patches.forEach(p=>{const d=p.domain??3,[px,py]=p.point??[0,0],[fx,fy]=surfaceGradient(profile,px,py);for(const x of [-d,0,d])for(const y of [-d,0,d])points.push([x+(p.kind==='tangent'?px:0),y+(p.kind==='tangent'?py:0),p.kind==='tangent'?surfaceValue(profile,px,py)+fx*x+fy*y:p.kind==='complex'?x*x+y*y:surfaceValue(p.kind,x,y)]);if(p.kind==='wave')points.push([0,0,-1],[0,0,1]);});
  if(model.net!==undefined)points.push(...cubeNetCorners(model.net).flat());if(model.torus)box([0,0,0],[2.6,2.6,0.6]);
  if(!points.length)return {center:[0,0,0] as V3,radius:3};
  const low:V3=[0,1,2].map(i=>Math.min(...points.map(p=>p[i]))) as V3,high:V3=[0,1,2].map(i=>Math.max(...points.map(p=>p[i]))) as V3;
  return {center:scale3(add3(low,high),0.5),radius:Math.max(2,norm3(sub3(high,low))/2)};
}
const O:V3=[0,0,0], X:V3=[1,0,0], Z:V3=[0,0,1];
const f=(x:number)=>Number(x.toFixed(4)).toString();
const degrees=(x:number|null)=>x===null?'Undefined for a zero direction':`${f(x)}°`;
export function initialInvestigation(config:Investigation3D):InvestigationState{
  const state:InvestigationState={a:[2,1,1],b:[1,2,-1],k:1,l:1,m:0.5,shape:'cube',surface:'bowl',scenario:'Skew',construction:true};
  if(config.family==='geometry'){state.a=[1,0,0];state.b=[0,1,0];state.k=1;}
  if(config.family==='solid'){state.k=1;state.l=2;state.m=0.5;const shapes:SolidKind[]=['cube','cuboid','prism','pyramid','tetrahedron','octahedron','cylinder','cone','sphere','hemisphere','frustum'];if(shapes.includes(config.operation as SolidKind))state.shape=config.operation as SolidKind;if(config.operation==='revolution')state.shape='cone';if(config.operation==='net')state.k=0;if(config.operation==='combined')state.shape='cylinder';}
  if(config.family==='surface'){state.a=[1,1,0];state.k=1;state.l=Math.PI/4;state.m=Math.PI/3;if(config.operation==='tangent')state.surface='wave';if(config.operation==='double-integral'){state.surface='positive';state.l=4;}}
  if(config.family==='matrix'){state.a=[2,0,0];state.b=[0,1,0];state.k=1;state.l=1;state.m=1;state.scenario='Unique';}
  if(config.family==='integral'){state.k=2;state.l=8;state.m=0.5;}
  if(config.family==='conic'){state.k=config.operation==='hyperbola'?1.8:config.operation==='parabola'?1:0.4;state.l=0.7;}
  if(config.family==='trig'){state.k=2;state.l=3;state.m=config.operation==='shadow'?35:30;}
  if(config.family==='complex'){state.a=[1,1,0];}
  return state;
}
export function investigationControls(config:Investigation3D):Control3D[]{
  const c=(key:Control3D['key'],label:string,min:number,max:number,step=0.1):Control3D=>({key,label,min,max,step});
  switch(config.family){
    case 'vector':return ['scale','line','motion','span','plane'].includes(config.operation)?[c('k',config.operation==='motion'?'Elapsed time':'Scalar / first parameter',-2,2),...(['span','plane'].includes(config.operation)?[c('l','Second span parameter',-2,2)]:[])]:[];
    case 'geometry':return ['coordinates','point','distance','two-points'].includes(config.operation)?[]:[c('k',config.operation==='closest'||config.operation==='skew'||config.operation==='lines'?'Separation in z':'Plane offset / line parameter',-3,3),...(['plane-angle','plane-intersection'].includes(config.operation)?[c('l','Second plane offset',-3,3)]:[])];
    case 'solid':return config.operation==='net'?[c('k','Fold fraction',0,1,0.01)]:[c('k',config.operation==='cubic'?'Length a':'Radius / half-width',0.5,2.5),...(!['cube','sphere','hemisphere','tetrahedron','octahedron','euler'].includes(config.operation)?[c('l',config.operation==='cubic'?'Length b':'Height',0.5,4)]:[]),...(['section','revolution','placement'].includes(config.operation)?[c('m',config.operation==='placement'?'Ground position':'Slice / revolution fraction',0,1,0.01)]:[])];
    case 'surface':return config.operation==='double-integral'?[c('k','Domain half-width',0.5,2),c('l','Partitions per axis',2,12,1)]:config.operation==='parametric'?[c('l','Torus parameter u',0,2*Math.PI),c('m','Torus parameter v',0,2*Math.PI)]:config.operation==='spherical'?[c('k','Radius',0.5,3),c('l','Azimuth θ (radians)',0,2*Math.PI),c('m','Polar φ (radians)',0,Math.PI)]:config.operation==='cylindrical'?[c('k','Radius',0.5,3),c('l','Azimuth θ (radians)',0,2*Math.PI),c('m','Height z',-2,3)]:['curve','implicit','level','contour'].includes(config.operation)?[c('k',config.operation==='curve'?'Helix parameter t':config.operation==='implicit'||config.operation==='level'?'Level c':'Contour height',0.1,4)]:[];
    case 'matrix':return [c('k',config.operation==='least-squares'?'Target z component':'Third column z component',-2,2),...(['system','consistency','cramer','row-operation','rref','augmented','composition'].includes(config.operation)?[c('l','Right-hand side / second-map scale',-2,2)]:[]),...(config.operation==='row-operation'?[c('m','Row-operation multiplier',-2,2)]:[])];
    case 'integral':return [c('k','Outer radius / base radius',0.5,3),c('l','Number of slices / shells',2,20,1),c('m','Inner-radius fraction',0,0.9,0.05)];
    case 'conic':return [c('k','Cutting-plane slope',0,2,0.05),c('l','Plane height at x = 0',0.4,1.2)];
    case 'trig':return [c('k','Height above eye / ground',0.5,4),c('l','Horizontal distance',1,5),c('m',config.operation==='shadow'?'Sun elevation (degrees)':'Bearing (degrees)',10,80,1)];
    case 'complex':return [];
  }
}
export function buildInvestigation(config:Investigation3D,s:InvestigationState):Model3D{
  const model:Model3D={segments:[],arrows:[],planes:[],bodies:[],boxes:[],patches:[],markers:[],readouts:[],notice:'Coordinates and numerical results do not depend on the camera. Lengths are in model units.',extent:6};
  const {a,b,k,l,m}=s, op=config.operation;
  const line=(points:V3[],color=COLORS.result,dashed=false)=>model.segments.push({points,color,dashed});
  const arrow=(vector:V3,color=COLORS.a,label?:string,start:V3=O)=>model.arrows.push({vector,color,label,start});
  const mark=(point:V3,label:string,color=COLORS.result,drag?:Marker3D['drag'])=>model.markers.push({point,label,color,drag});
  const read=(label:string,value:string|number)=>model.readouts.push([label,typeof value==='number'?f(value):value]);
  const infiniteLine=(p:V3,d:V3,color:string)=>{const u=unit3(d);if(u)line([add3(p,scale3(u,-4)),add3(p,scale3(u,4))],color);};
  if(config.family==='vector'){
    arrow(a,COLORS.a,'u');mark(a,'u',COLORS.a,'a');
    const p=project3(a,b),n=cross3(a,b);
    if(!['intro','position','components','unit','scale'].includes(op)){arrow(b,COLORS.b,'v');mark(b,'v',COLORS.b,'b');}
    if(op==='components'||op==='intro'||op==='position'){line([O,[a[0],0,0],[a[0],a[1],0],a],COLORS.b,true);read('Position / components',format3(a));}
    if(op==='add'||op==='force'){arrow(b,COLORS.b,undefined,a);arrow(add3(a,b),COLORS.result,'u + v');if(op==='force')arrow(scale3(add3(a,b),-1),COLORS.secondary,'balancing force');read('Resultant',format3(add3(a,b)));}
    if(op==='subtract'||op==='motion'){const relative=sub3(a,b);arrow(relative,COLORS.result,'u − v');line([b,a],COLORS.secondary);read('Difference / relative velocity',format3(relative));if(op==='motion'){mark(scale3(a,k),'First position');mark(scale3(b,k),'Second position',COLORS.b);read('Relative displacement',format3(scale3(relative,k)));}}
    if(op==='scale'){arrow(scale3(a,k),COLORS.result,'k u');read('Scaled vector',format3(scale3(a,k)));}
    if(op==='unit'){const u=unit3(a);if(u){arrow(u,COLORS.result,'unit u');read('Unit vector',format3(u));}else read('Unit vector','Undefined: the zero vector has no direction.');}
    if(op==='dot'||op==='projection'){if(p){arrow(p,COLORS.result,'projection');line([p,a],COLORS.secondary,true);read('Projection of u onto v',format3(p));read('Residual · v',dot3(sub3(a,p),b));}else read('Projection','Undefined onto the zero vector.');read('u · v',dot3(a,b));read('Angle',degrees(angle3(a,b)));}
    if(op==='cross'){arrow(n,COLORS.result,'u × v');arrow(scale3(n,-1),COLORS.secondary,'v × u');if(s.construction)line([O,a,add3(a,b),b,O],COLORS.b);read('u × v',format3(n));read('Parallelogram area',norm3(n));read('(u × v) · u',dot3(n,a));read('(u × v) · v',dot3(n,b));}
    if(op==='span'||op==='plane'){if(unit3(n))model.planes.push({normal:n,offset:0,color:COLORS.secondary});mark(add3(scale3(a,k),scale3(b,l)),'k u + l v');read('Span dimension',orthogonalBasis([a,b]).length);read('Combination',format3(add3(scale3(a,k),scale3(b,l))));}
    if(op==='line'){infiniteLine(a,b,COLORS.result);mark(add3(a,scale3(b,k)),'u + t v');read('Point on line',format3(add3(a,scale3(b,k))));if(!unit3(b))read('Line','A zero direction does not define a line.');}
    read('|u|',norm3(a));
  }
  if(config.family==='geometry'){
    const pointOps=['coordinates','point','distance','two-points'];
    if(pointOps.includes(op)){
      mark(a,'A',COLORS.a,'a');mark(b,'B',COLORS.b,'b');line([a,b]);line([O,[a[0],0,0],[a[0],a[1],0],a],COLORS.secondary,true);read('A',format3(a));read('B',format3(b));read('B − A',format3(sub3(b,a)));read('Distance',norm3(sub3(b,a)));if(op==='two-points')infiniteLine(a,sub3(b,a),COLORS.result);
    }else if(['ratios','cosines','parameter-line','cartesian-line'].includes(op)){
      const origin:V3=[0,1,0],point=add3(origin,scale3(a,k));infiniteLine(origin,a,COLORS.a);arrow(a,COLORS.b,'direction');mark(point,'r(t)');const direction=unit3(a);read('r(t) = (0,1,0) + t a',format3(point));read('Direction cosines',direction?format3(direction):'Undefined for a zero direction');if(direction)read('Sum of squared cosines',dot3(direction,direction));read('Cartesian condition',a.map((x,i)=>Math.abs(x)<1e-9?`${'xyz'[i]} = ${origin[i]}`:`(${'xyz'[i]} − ${origin[i]})/${f(x)} = t`).join('; '));
    }else if(['lines','skew','closest','line-angle'].includes(op)){
      const origin=O,other:V3=s.scenario==='Intersecting'?O:s.scenario==='Coincident'?scale3(a,1):[0,1,k];
      const direction=s.scenario==='Parallel'||s.scenario==='Coincident'?a:b;
      const result=closestLines(origin,a,other,direction);infiniteLine(origin,a,COLORS.a);infiniteLine(other,direction,COLORS.b);
      if(result){mark(result.p,'P');mark(result.q,'Q',COLORS.secondary);line([result.p,result.q],COLORS.result);read('Configuration',result.kind);read('Shortest distance',result.distance);read('Connector · first direction',dot3(sub3(result.q,result.p),a));read('Connector · second direction',dot3(sub3(result.q,result.p),direction));const angle=angle3(a,direction);read('Smaller line angle',degrees(angle===null?null:Math.min(angle,180-angle)));}else read('Line validity','Both direction vectors must be nonzero.');
    }else{
      if(unit3(a))model.planes.push({normal:a,offset:k,color:COLORS.a});else read('Plane validity','A zero normal does not define a plane.');
      arrow(a,COLORS.a,'normal n');read('Plane equation',`${f(a[0])}x + ${f(a[1])}y + ${f(a[2])}z = ${f(k)}`);
      if(['plane-angle','plane-intersection'].includes(op)){
        if(unit3(b))model.planes.push({normal:b,offset:l,color:COLORS.b});const intersection=intersectPlanes(a,k,b,l);if(intersection)infiniteLine(intersection.point,intersection.direction,COLORS.result);
        const angle=angle3(a,b);read('Smaller plane angle',degrees(angle===null?null:Math.min(angle,180-angle)));read('Intersection',intersection?'A line':unit3(a)&&unit3(b)?'Parallel or coincident planes':'Undefined plane');
      }else if(op==='line-plane'||op==='line-plane-angle'){
        const origin:V3=[0,1,1];infiniteLine(origin,b,COLORS.b);const intersection=linePlane(origin,b,a,k);if(intersection?.point)mark(intersection.point,'intersection');read('Line relation',intersection?.kind??'Undefined direction or normal');const angle=angle3(a,b);read('Line–plane angle',degrees(angle===null?null:Math.abs(90-angle)));
      }else{
        mark(b,'point P',COLORS.b,'b');const foot=pointPlane(b,a,k);if(foot){line([b,foot.foot]);mark(foot.foot,'foot');read('Perpendicular distance',foot.distance);read('Point on plane',format3(foot.foot));if(op==='point-normal'){const tangent=cross3(a,Math.abs(a[0])<0.9*norm3(a)?X:[0,1,0]),r=add3(foot.foot,tangent);mark(r,'another plane point');read('n · (r − foot)',dot3(a,sub3(r,foot.foot)));}}
        if(op==='intercepts')a.forEach((coefficient,i)=>read(`${'xyz'[i]} intercept`,Math.abs(coefficient)<1e-9?k===0?'Axis lies in plane':'No intercept':f(k/coefficient)));
      }
      model.notice='Coloured finite patches represent infinite planes. A plane needs a nonzero normal. Rotate to inspect depth; use the readout to check exact relationships.';
    }
  }
  if(config.family==='solid'){
    const fixed:SolidKind[]=['cube','cuboid','prism','pyramid','tetrahedron','octahedron','cylinder','cone','sphere','hemisphere','frustum'];
    const shape=fixed.includes(op as SolidKind)?op as SolidKind:op==='euler'?'octahedron':op==='revolution'?'cone':op==='extrusion'?'cuboid':s.shape;
    if(op==='net'){model.net=k;read('Fold angle',`${f(k*90)}°`);read('Faces / edges / vertices','6 / 12 / 8');model.notice='This investigation folds a valid cube net continuously. The main lesson retains its other solid nets.';model.extent=8;
    }else if(op==='cubic'){
      const sizes=[k,l],colors=[COLORS.a,COLORS.b,COLORS.result,COLORS.secondary];
      for(let i=0;i<2;i++)for(let j=0;j<2;j++)for(let h=0;h<2;h++){const size:V3=[sizes[i],sizes[j],sizes[h]],center:V3=[(i?k:0)+sizes[i]/2,(j?k:0)+sizes[j]/2,(h?k:0)+sizes[h]/2];model.boxes.push({size,position:sub3(center,[(k+l)/2,(k+l)/2,0]),color:colors[i+j+h],opacity:0.75});}
      read('(a + b)³',(k+l)**3);read('a³ + 3a²b + 3ab² + b³',k**3+3*k*k*l+3*k*l*l+l**3);read('Eight pieces',`${f(k**3)}, 3 × ${f(k*k*l)}, 3 × ${f(k*l*l)}, ${f(l**3)}`);
    }else if(op==='combined'){
      model.bodies.push({kind:'cylinder',radius:k,height:l,position:O,color:COLORS.a,opacity:0.7},{kind:'hemisphere',radius:k,height:k,position:[0,0,l],color:COLORS.b,opacity:0.7});
      read('Cylinder + hemisphere volume',Math.PI*k*k*l+2*Math.PI*k**3/3);read('External surface area',2*Math.PI*k*l+3*Math.PI*k*k);read('Joining face','Internal: exclude both touching circular faces.');
    }else{
      const z=op==='placement'?0:0,position:V3=op==='placement'?[(m-0.5)*6,0,z]:O;
      const measurements=solidMeasures(shape,k,l),section=sectionMeasure(shape,k,l,m);
      model.bodies.push({kind:shape,radius:k,height:l,position,color:COLORS.a,opacity:op==='xray'||op==='section'?0.35:0.7,wire:op==='xray',clipHeight:op==='section'?section.z:undefined});
      read('Solid',shape);read('Volume',measurements.volume);read('Total surface area',measurements.area);
      if(op==='section'){
        model.planes.push({normal:Z,offset:section.z,color:COLORS.b});read('Horizontal section z',section.z);read('Section area',section.area);
        if(section.circular&&section.radius>0)line(Array.from({length:65},(_,i)=>[section.radius*Math.cos(i*Math.PI/32),section.radius*Math.sin(i*Math.PI/32),section.z]),COLORS.result);
        else line([[-section.radius,-section.radius,section.z],[section.radius,-section.radius,section.z],[section.radius,section.radius,section.z],[-section.radius,section.radius,section.z],[-section.radius,-section.radius,section.z]],COLORS.result);
      }
      if(op==='euler'){read('V − E + F','6 − 12 + 8 = 2');model.notice='The regular octahedron is a convex polyhedron. Euler’s formula here applies to its closed, sphere-like boundary.';}
      if(op==='revolution'){const angle=m*2*Math.PI;line([O,[k*Math.cos(angle),k*Math.sin(angle),0],[0,0,l]],COLORS.b);read('Generating-line rotation',`${f(m*360)}°`);}
      if(op==='extrusion'){line([[-k,-k,0],[k,-k,0],[k,k,0],[-k,k,0],[-k,-k,0]],COLORS.b);read('Base area × height',`${f(4*k*k)} × ${f(l)}`);}
      if(op==='placement')model.notice='Placement rehearsal on a model ground plane. This panel does not request camera access or start an AR session.';
      if(shape==='hemisphere')model.notice='The hemisphere includes its flat circular base in total surface area.';
    }
  }
  if(config.family==='surface'){
    const [x,y]=a,z=surfaceValue(s.surface,x,y),[fx,fy]=surfaceGradient(s.surface,x,y),p:V3=[x,y,z];
    if(op==='implicit'||op==='level'){
      const radius=Math.sqrt(k);model.bodies.push({kind:'sphere',radius,height:radius*2,position:O,color:COLORS.a,opacity:0.45});const point:V3=[radius/Math.sqrt(3),radius/Math.sqrt(3),radius/Math.sqrt(3)];mark(point,'point on level');arrow(scale3(point,2),COLORS.result,'∇g',point);read('Level equation',`x² + y² + z² = ${f(k)}`);read('Radius',radius);read('At the marked point: g',dot3(point,point));
    }else if(op==='parametric'){
      model.torus={u:l,v:m};const point:V3=[(2+0.6*Math.cos(m))*Math.cos(l),(2+0.6*Math.cos(m))*Math.sin(l),0.6*Math.sin(m)];mark(point,'r(u,v)');read('r(u,v)',format3(point));model.notice='Torus parametrisation: r(u,v) = ((2 + 0.6 cos v) cos u, (2 + 0.6 cos v) sin u, 0.6 sin v).';
    }else if(op==='curve'){
      line(Array.from({length:161},(_,i)=>{const t=i*Math.PI/20;return [Math.cos(t),Math.sin(t),t/4];}),COLORS.a);const point:V3=[Math.cos(k),Math.sin(k),k/4],tangent:V3=[-Math.sin(k),Math.cos(k),0.25];mark(point,'r(t)');arrow(tangent,COLORS.result,'r′(t)',point);read('Position',format3(point));read('Tangent',format3(tangent));
    }else if(op==='cylindrical'||op==='spherical'){
      const point:V3=op==='cylindrical'?[k*Math.cos(l),k*Math.sin(l),m]:[k*Math.sin(m)*Math.cos(l),k*Math.sin(m)*Math.sin(l),k*Math.cos(m)];arrow(point,COLORS.a,'position');line([O,[point[0],point[1],0],point],COLORS.b,true);line(Array.from({length:65},(_,i)=>[k*Math.cos(i*Math.PI/32),k*Math.sin(i*Math.PI/32),0]),COLORS.secondary);if(op==='spherical')model.bodies.push({kind:'sphere',radius:k,height:2*k,position:O,color:COLORS.a,opacity:0.12});read('Cartesian coordinates',format3(point));read(op==='cylindrical'?'Cylindrical radius':'Spherical radius',op==='cylindrical'?Math.hypot(point[0],point[1]):norm3(point));model.notice=op==='spherical'?'θ is azimuth in the xy-plane; φ is the polar angle from +z. Other textbooks may swap these symbols.':'The cylindrical radius is distance from the z-axis; height is independent.';
    }else if(op==='double-integral'){
      const integral=midpointIntegral(k,Math.round(l));for(const cell of integral.cells)model.boxes.push({size:[cell.width*0.94,cell.width*0.94,cell.height],position:[cell.x,cell.y,cell.height/2],color:COLORS.a,opacity:0.65});model.patches.push({kind:'positive',domain:k,color:COLORS.b});read('Midpoint volume sum',integral.sum);read('Exact integral',integral.exact);read('Absolute error',Math.abs(integral.exact-integral.sum));model.notice='Integrate f = 1 + 0.3(x² + y²) over [−a,a]². The exact volume is 4a² + 0.8a⁴; each column uses its midpoint height.';
    }else{
      model.patches.push({kind:s.surface,color:COLORS.a});mark(p,'contact point',COLORS.b,'surface');read('f(x,y)',z);read('∂f/∂x',fx);read('∂f/∂y',fy);
      if(op==='contour'){
        const radius=Math.sqrt(k/0.3);model.planes.push({normal:Z,offset:k,color:COLORS.b});line(Array.from({length:65},(_,i)=>[radius*Math.cos(i*Math.PI/32),radius*Math.sin(i*Math.PI/32),k]));line(Array.from({length:65},(_,i)=>[radius*Math.cos(i*Math.PI/32),radius*Math.sin(i*Math.PI/32),0]),COLORS.secondary);read('Contour equation',`x² + y² = ${f(k/0.3)}`);
      }
      if(['partial','gradient','tangent','normal','optimisation'].includes(op)){
        if(s.construction){line(Array.from({length:41},(_,i)=>{const q=-3+i*0.15;return [q,y,surfaceValue(s.surface,q,y)];}),COLORS.b);line(Array.from({length:41},(_,i)=>{const q=-3+i*0.15;return [x,q,surfaceValue(s.surface,x,q)];}),COLORS.secondary);arrow([1,0,fx],COLORS.b,'x tangent',p);arrow([0,1,fy],COLORS.secondary,'y tangent',p);}
        if(op==='gradient'||op==='optimisation'){arrow([fx,fy,0],COLORS.result,'∇f',p);read('Gradient',`(${f(fx)}, ${f(fy)})`);read('Gradient magnitude',Math.hypot(fx,fy));}
        if(op==='tangent'||op==='normal'){model.patches.push({kind:'tangent',point:[x,y],domain:0.9,color:COLORS.result});arrow([-fx,-fy,1],COLORS.result,'normal',p);const nearby:V3=[x+0.25,y+0.25,surfaceValue(s.surface,x+0.25,y+0.25)];read('Normal',format3([-fx,-fy,1]));read('Linearisation error at (x+0.25,y+0.25)',nearby[2]-(z+0.25*(fx+fy)));}
        if(op==='optimisation')read('Stationary point at (0,0)',s.surface==='saddle'?'Saddle: zero gradient, not a minimum.':'Minimum of the bowl.');
      }
      model.notice=`Surface: ${s.surface==='wave'?'sin x cos y':s.surface==='saddle'?'0.3(x² − y²)':s.surface==='positive'?'1 + 0.3(x² + y²)':'0.3(x² + y²)'}. Drag the contact point horizontally or use the x/y controls. Transparent patches represent local tangent planes.`;
    }
  }
  if(config.family==='matrix'){
    let columns:[V3,V3,V3]=[a,b,[0,0,k]],rhs:V3=[l,1,2];
    if(['system','consistency'].includes(op)){
      if(s.scenario==='Infinite'){columns=[[1,0,1],[0,1,1],[0,0,0]];rhs=[1,1,2];}
      if(s.scenario==='Inconsistent'){columns=[[1,0,1],[0,1,1],[0,0,0]];rhs=[1,1,3];}
    }
    const det=determinant3(columns),basis=orthogonalBasis(columns);
    if(['system','consistency','cramer','row-operation','rref','augmented'].includes(op)){
      const solution=solveSystem(columns,rhs);const rows=rhs.map((value,i)=>({normal:columns.map(c=>c[i]) as V3,offset:value}));
      rows.forEach((plane,i)=>{if(unit3(plane.normal))model.planes.push({...plane,color:[COLORS.a,COLORS.b,COLORS.secondary][i]});});
      if(op==='row-operation'&&s.construction)model.planes.push({normal:add3(rows[1].normal,scale3(rows[0].normal,m)),offset:rows[1].offset+m*rows[0].offset,color:COLORS.result});
      if(op==='rref'&&s.construction)solution.rows.forEach(row=>{const normal:V3=[row[0],row[1],row[2]];if(unit3(normal))model.planes.push({normal,offset:row[3],color:COLORS.result});});
      if(solution.point)mark(solution.point,'common point');read('Solution classification',solution.kind);if(solution.point)read(solution.kind==='Unique solution'?'Solution':'One solution (free variables set to zero)',format3(solution.point));read('Rank of coefficients',solution.rank);read('det A',det);
      if(op==='cramer')read('Cramer’s rule',Math.abs(det)<1e-9?'Undefined: det A = 0.':format3([determinant3([rhs,columns[1],columns[2]])/det,determinant3([columns[0],rhs,columns[2]])/det,determinant3([columns[0],columns[1],rhs])/det]));
      if(op==='augmented'||op==='rref')read('Reduced augmented rows',solution.rows.map(row=>row.map(f).join(', ')).join(' | '));
      model.notice='Matrix columns form A; each displayed plane is one row equation of A r = b. Finite patches represent infinite planes. Zero normal rows are classified algebraically rather than drawn as planes.';
    }else if(op==='least-squares'){
      const target:V3=[1,1,k],span=orthogonalBasis([a,b]),projection=span.reduce<V3>((sum,q)=>add3(sum,scale3(q,dot3(target,q))),O),residual=sub3(target,projection);arrow(target,COLORS.a,'target');arrow(projection,COLORS.result,'least-squares projection');line([projection,target],COLORS.b,true);const normal=cross3(a,b);if(unit3(normal))model.planes.push({normal,offset:0,color:COLORS.secondary});read('Projection',format3(projection));read('Residual',format3(residual));read('Residual · first column',dot3(residual,a));read('Residual · second column',dot3(residual,b));
    }else{
      columns.forEach((v,i)=>arrow(v,[COLORS.a,COLORS.b,COLORS.secondary][i],`column ${i+1}`));
      const vertices:V3[]=Array.from({length:8},(_,i)=>[i&1?1:0,i&2?1:0,i&4?1:0]);
      vertices.forEach((p,i)=>{[1,2,4].forEach(bit=>{if(!(i&bit)){const q=vertices[i|bit];line([transform3(columns,p),transform3(columns,q)],COLORS.result);if(s.construction)line([p,q],COLORS.secondary,true);}});});
      read('Signed determinant',det);read('Volume scale',Math.abs(det));read('Span dimension',basis.length);
      if(op==='eigen'){arrow(X,COLORS.b,'e₁');const image=transform3(columns,X);read('A e₁',format3(image));read('e₁ eigenvector?',norm3(cross3(X,image))<1e-9?`Yes, eigenvalue ${f(image[0])}`:'No: its image leaves the e₁ direction.');}
      if(op==='gram-schmidt'){basis.forEach((v,i)=>arrow(v,COLORS.result,`q${i+1}`));read('Orthonormal directions',basis.map(format3).join('; '));}
      if(op==='inverse'){read('Inverse available?',Math.abs(det)<1e-9?'No: the map collapses dimension.':'Yes: the transformed basis determines a unique preimage.');const original:V3=[1,1,1],mapped=transform3(columns,original),recovered=solveSystem(columns,mapped);arrow(mapped,COLORS.result,'A v');read('A v',format3(mapped));read('A⁻¹(A v)',Math.abs(det)<1e-9?'Undefined: no inverse.':format3(recovered.point!));}
      if(op==='composition'){const second:[V3,V3,V3]=[[l,0,0],[0,1,0],[0,0,1]],input:V3=[1,1,1],composed=second.map(c=>transform3(columns,c)) as [V3,V3,V3];arrow(transform3(columns,transform3(second,input)),COLORS.result,'A(Bv)');read('A(Bv)',format3(transform3(columns,transform3(second,input))));read('(AB)v',format3(transform3(composed,input)));}
    }
  }
  if(config.family==='integral'){
    const count=Math.round(l),inner=k*m,h=3;
    if(op==='revolution-area'){
      model.bodies.push({kind:'cone',radius:k,height:h,position:O,color:COLORS.a,opacity:0.5});line([[k,0,0],[0,0,h]],COLORS.b);read('Slant height',Math.hypot(k,h));read('Curved surface area',Math.PI*k*Math.hypot(k,h));model.notice='Revolving the straight generating segment gives a cone. Curved area is πr√(r² + h²); the base is excluded.';
    }else if(op==='shells'){
      const step=(k-inner)/count;let sum=0;for(let i=0;i<count;i++){const radius=inner+(i+0.5)*step;model.bodies.push({kind:'cylinder',radius:radius+step/2,innerRadius:Math.max(0,radius-step/2),height:h,position:O,color:i%2?COLORS.a:COLORS.b,opacity:0.3});sum+=2*Math.PI*radius*h*step;}read('Shell sum Σ 2πr h Δr',sum);read('Exact annular-cylinder volume',Math.PI*(k*k-inner*inner)*h);read('Shell thickness',step);model.notice='Each transparent annulus is a cylindrical shell. Here height is constant, so the midpoint shell sum is exact apart from floating-point rounding.';
    }else{
      const step=h/count;let sum=0;for(let i=0;i<count;i++){const z=(i+0.5)*step,radius=op==='slices'?k*(1-z/h):k,inside=op==='washers'?inner:0;model.bodies.push({kind:'cylinder',radius,innerRadius:inside,height:step*0.92,position:[0,0,i*step],color:i%2?COLORS.a:COLORS.b,opacity:0.65});sum+=Math.PI*(radius*radius-inside*inside)*step;}const exact=op==='slices'?Math.PI*k*k*h/3:Math.PI*(k*k-inner*inner)*h;read('Cross-sectional volume sum',sum);read('Exact volume',exact);read('Absolute error',Math.abs(exact-sum));model.notice=op==='washers'?'Each washer has a genuine central hole. Its area is π(R² − r²); all slices here have constant radii. Small display gaps separate adjacent slices.':'Midpoint circular slices approximate a cone. Increase the number of slices to reduce the approximation error. Small display gaps separate adjacent slices.';
    }
  }
  if(config.family==='conic'){
    model.bodies.push({kind:'cone',radius:4,height:4,position:O,color:COLORS.a,opacity:0.18,flip:true},{kind:'cone',radius:4,height:4,position:[0,0,-4],color:COLORS.a,opacity:0.18});
    model.planes.push({normal:[-k,0,1],offset:l,color:COLORS.b,size:8});
    for(const points of conicSlice(k,l))line(points);
    const type=Math.abs(k-1)<1e-7?'Parabola':k<1?k===0?'Circle':'Ellipse':'Hyperbola';read('Section type',type);read('Cutting plane',`z = ${f(l)} + ${f(k)}x`);read('Cone equation','x² + y² = z²');model.extent=9;model.notice='The cone extends beyond the drawn mesh. The green curve satisfies both equations; faraway portions may leave the viewport. Slope 1 gives a plane parallel to a generator.';
  }
  if(config.family==='trig'){
    const bearing=m*Math.PI/180,point:V3=[l*Math.sin(bearing),l*Math.cos(bearing),k],base:V3=[point[0],point[1],0];
    model.boxes.push({size:[0.35,0.35,k],position:[base[0],base[1],k/2],color:COLORS.a});mark(O,'observer');mark(point,'top');line([O,base,point,O],COLORS.b);read('Elevation / depression angle',`${f(Math.atan2(k,l)*180/Math.PI)}°`);read('Height / horizontal distance',`${f(k)} / ${f(l)}`);read('Bearing clockwise from +y (north)',`${f(m)}°`);
    if(op==='observers'){const other:V3=[1,0,0],distance=norm3(sub3(base,other));line([other,point],COLORS.result);mark(other,'second observer');read('Second horizontal distance',distance);read('Second elevation',`${f(Math.atan2(k,distance)*180/Math.PI)}°`);}
    if(op==='depression'){line([point,add3(point,scale3(unit3(base)??X,-l))],COLORS.secondary,true);model.notice='The upper horizontal is parallel to the ground horizontal. The angle of depression equals the corresponding elevation angle.';}
    if(op==='shadow'){const length=k/Math.tan(bearing),end=add3(base,[length,0,0]);line([point,end],COLORS.result);line([base,end],COLORS.secondary);mark(end,'shadow tip');read('Shadow length = h / tan α',length);read('Sun elevation',`${f(m)}°`);model.notice='A level ground plane and a vertical object are assumed. The green ray arrives at the chosen sun elevation; the purple ground segment is the shadow.';}
  }
  if(config.family==='complex'){
    const input:[number,number]=[a[0],a[1]];
    if(op==='mobius'){model.bodies.push({kind:'sphere',radius:1,height:2,position:O,color:COLORS.a,opacity:0.2});const mapped=inverseComplex(input),source=stereographic(input),target=mapped?stereographic(mapped):Z;mark(source,'z on sphere',COLORS.a);mark(target,'1/z on sphere',COLORS.b);line([source,target],COLORS.result);read('z',`${f(input[0])} + (${f(input[1])})i`);read('1/z',mapped?`${f(mapped[0])} + (${f(mapped[1])})i`:'∞ (north pole)');model.notice='Stereographic projection maps the complex plane to the unit sphere minus its north pole. This investigation uses the Möbius map w = 1/z.';
    }else{model.patches.push({kind:'complex',domain:2,color:COLORS.a});const height=dot3([a[0],a[1],0],[a[0],a[1],0]);mark([a[0],a[1],height],'|z²|');line([[a[0],a[1],0],[a[0],a[1],height]],COLORS.b);read('|z²|',height);read('Re(z²)',a[0]*a[0]-a[1]*a[1]);read('Im(z²)',2*a[0]*a[1]);model.notice='Height shows |z²|, a real magnitude. It does not represent the entire complex output; the readout supplies its real and imaginary parts.';}
  }
  return model;
}
