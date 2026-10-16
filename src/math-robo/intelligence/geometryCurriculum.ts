import curriculum from './geometryQuestions150.json';
import {center, distance, intersections, rounded, vertices} from './geometryQueries';
import {triangleCenter} from './derivedGeometry';
import {resolveTarget, ResolutionError} from './targetResolver';
import type {RoboObjectDescriptor, RoboSceneContext} from './types';
import type {VisualCommand} from '../../offline-intelligence/commands';

export type GeometryLesson = {id:number; names:Record<string,string>; numbers:number[]};
const normalize=(text:string)=>text.toLowerCase().trim().replace(/[?.!]+$/,'').replace(/−/g,'-').replace(/^(?:please|kindly|can you|could you)\s+/,'').replace(/\s+/g,' ');
const escape=(text:string)=>text.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s*');
// Templates teach intent and slots. Geometry and answers always come from the scene.
const grammar=curriculum.map(row=>{
  const slots:Array<{name?:string}>=[];let pattern='',last=0;
  for(const match of row.question.matchAll(/\b(?:[A-Z]+|[cd])\b|\d+(?:\.\d+)?/g)){
    pattern+=escape(normalizeFragment(row.question.slice(last,match.index)));
    const name=/^[A-Za-z]+$/.test(match[0])?match[0]:undefined;
    slots.push({name});pattern+=name?`(${name.length>1?'(?:[a-z][0-9]*){'+name.length+'}':'[a-z][a-z0-9_]*'})`:'([+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+))';last=match.index!+match[0].length;
  }
  pattern+=escape(normalizeFragment(row.question.slice(last)).replace(/[?.!]+$/,''));
  return {id:row.id,slots,regex:new RegExp('^'+pattern+'$','i')};
});
function normalizeFragment(text:string){return text.toLowerCase();}
export function matchGeometryLesson(raw:string):GeometryLesson|undefined{
  const text=normalize(raw);
  const bisector=text.match(/^(?:draw|construct|create|make|show) (?:the |a )?perpendicular bisector (?:of|for) (?:segment |line )?(?:([a-z][0-9]*)([a-z][0-9]*)|(?:point )?([a-z][a-z0-9_]*)\s*(?:and|to|,)\s*(?:point )?([a-z][a-z0-9_]*))$/i);
  if(bisector)return {id:138,names:{C:bisector[1]??bisector[3],D:bisector[2]??bisector[4]},numbers:[]};
  for(const row of grammar){const match=text.match(row.regex);if(!match)continue;
    const names:Record<string,string>={},numbers:number[]=[];let valid=true;
    row.slots.forEach((slot,i)=>{
      if(slot.name){
        const keys=slot.name.length===1?[slot.name]:slot.name.split('');
        const values=keys.length===1?[match[i+1]]:match[i+1].match(/[a-z][0-9]*/gi)!;
        keys.forEach((key,j)=>{if(names[key]&&names[key]!==values[j])valid=false;names[key]=values[j];});
      }else numbers.push(Number(match[i+1]));
    });
    if(valid&&numbers.every(Number.isFinite))return {id:row.id,names,numbers};
  }
}
const tol=1e-8;
const near=(a:number,b:number)=>Math.abs(a-b)<=tol*Math.max(1,Math.abs(a),Math.abs(b));
const sub=(a:number[],b:number[])=>a.map((n,i)=>n-b[i]);
const add=(a:number[],b:number[])=>a.map((n,i)=>n+b[i]);
const mul=(a:number[],k:number)=>a.map(n=>n*k);
const dot=(a:number[],b:number[])=>a.reduce((s,n,i)=>s+n*b[i],0);
const cross=(a:number[],b:number[])=>a[0]*b[1]-a[1]*b[0];
const mid=(a:number[],b:number[])=>mul(add(a,b),.5);
const unit=(a:number[])=>{const n=Math.hypot(...a);if(n<=tol)throw new Error('Distinct points are required to define this direction.');return mul(a,1/n);};
const angle=(a:number[],b:number[],c:number[])=>{const u=unit(sub(a,b)),v=unit(sub(c,b));return Math.atan2(Math.abs(cross(u,v)),dot(u,v))*180/Math.PI;};
const parallel=(u:number[],v:number[])=>Math.abs(cross(unit(u),unit(v)))<=tol;
const perpendicular=(u:number[],v:number[])=>Math.abs(dot(unit(u),unit(v)))<=tol;
const onLine=(p:number[],a:number[],b:number[])=>Math.abs(cross(unit(sub(b,a)),sub(p,a)))<=tol;
function foot(p:number[],a:number[],b:number[]){const u=unit(sub(b,a));return add(a,mul(u,dot(sub(p,a),u)));}
function lineHit(a:number[],b:number[],c:number[],d:number[],segment=false):number[]|undefined{
  const u=sub(b,a),v=sub(d,c);unit(u);unit(v);const den=cross(u,v);
  if(near(den,0))return;
  const t=cross(sub(c,a),v)/den,s=cross(sub(c,a),u)/den;
  return !segment||t>=-tol&&t<=1+tol&&s>=-tol&&s<=1+tol?add(a,mul(u,t)):undefined;
}
function segmentHit(a:number[],b:number[],c:number[],d:number[]){
  if(lineHit(a,b,c,d,true))return true;
  const within=(p:number[],u:number[],v:number[])=>onLine(p,u,v)&&dot(sub(p,u),sub(p,v))<=tol;
  return within(a,c,d)||within(b,c,d)||within(c,a,b)||within(d,a,b);
}
const area=(p:number[][])=>Math.abs(p.reduce((s,a,i)=>s+cross(a,p[(i+1)%p.length]),0))/2;
const sideLengths=(p:number[][])=>p.map((a,i)=>distance(a,p[(i+1)%p.length]));
function inside(p:number[],poly:number[][]){let yes=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){
  const a=poly[i],b=poly[j];if(onLine(p,a,b)&&dot(sub(p,a),sub(p,b))<=tol)return true;
  if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])yes=!yes;
}return yes;}
export type GeometryAnswer={value:NonNullable<RoboSceneContext['previousResult']>;message:string;targets:string[];effects:VisualCommand[]};
export function evaluateGeometryLesson(lesson:GeometryLesson,scene:RoboSceneContext):GeometryAnswer{
  if(scene.activeMode.endsWith('3d'))throw new Error('UNSUPPORTED: This geometry curriculum uses a 2D board.');
  const {id,names,numbers:n}=lesson,targets=new Set<string>(),effects:VisualCommand[]=[];
  const usable=(o:RoboObjectDescriptor)=>o.command.roboVisible!==false&&(!o.command.roboDefinitionState||o.command.roboDefinitionState.status==='defined');
  const points=scene.objects.filter(o=>o.type==='point'&&usable(o));
  const name=(key:string)=>names[key]??key.toLowerCase();
  const obj=(key:string,type?:string)=>{
    const label=name(key),candidates=scene.objects.filter(o=>usable(o)&&o.label?.toLowerCase()===label.toLowerCase()&&(!type||o.type===type));
    if(candidates.length>1)throw new ResolutionError(candidates.map(o=>o.id),`Several ${type??'objects'} are named ${label}. Select or rename one.`);
    let o=candidates[0];if(!o){o=resolveTarget(type?{name:label,type}:label,scene);if(!usable(o))throw new Error(`Object ${label} is hidden or undefined.`);}
    targets.add(o.id);return o;
  };
  const point=(key:string)=>{const o=obj(key,'point');if(o.position.length!==2||o.position.some(v=>!Number.isFinite(v)))throw new Error('Finite 2D point coordinates are required.');return o.position;};
  const poly=(keys:string)=>keys.split('').map(point);
  const validPoly=(keys:string)=>{
    const p=poly(keys);
    if(p.some((a,i)=>distance(a,p[(i+1)%p.length])<=tol)||area(p)<=tol)throw new Error('A nondegenerate polygon with distinct adjacent vertices is required.');
    if(p.some((a,i)=>p.some((c,j)=>j>i&&j!==(i+1)%p.length&&i!==(j+1)%p.length&&segmentHit(a,p[(i+1)%p.length],c,p[(j+1)%p.length]))))throw new Error('The polygon crosses itself; specify a simple polygon for this measurement.');
    return p;
  };
  const triangle=(keys='ABC')=>{const p=validPoly(keys);return {...obj(keys[0],'point'),type:'triangle',vertices:p,command:{...obj(keys[0],'point').command,kind:'triangle',points:p,roboExplicitVertices:true}} as RoboObjectDescriptor;};
  const circle=(key='c')=>{const o=obj(key,'circle');if(!(o.command.radius>0))throw new Error('A circle needs a positive radius.');return o;};
  const radius=(key='c')=>{const o=circle(key);return o.command.radius*(o.command.scale??1);};
  const length=(keys:string)=>distance(point(keys[0]),point(keys[1]));
  const direction=(keys:string)=>sub(point(keys[1]),point(keys[0]));
  const midpoint=(keys:string)=>mid(point(keys[0]),point(keys[1]));
  const angleAt=(keys='ABC')=>angle(...poly(keys) as [number[],number[],number[]]);
  const pointNames=(list:RoboObjectDescriptor[])=>{list.forEach(o=>targets.add(o.id));return list.map(o=>`${o.label??o.id} (${o.position.map(rounded).join(', ')})`).join('; ')||'None';};
  const extreme=(list:RoboObjectDescriptor[],score:(o:RoboObjectDescriptor)=>number,min=false)=>{
    if(!list.length)throw new Error('No visible, defined points are available.');const values=list.map(score),best=(min?Math.min:Math.max)(...values);return pointNames(list.filter((_,i)=>near(values[i],best)));
  };
  const pairs=points.flatMap((a,i)=>points.slice(i+1).map(b=>({a,b,d:distance(a.position,b.position)})));
  const pairNames=(condition:(a:RoboObjectDescriptor,b:RoboObjectDescriptor)=>boolean)=>pairs.filter(({a,b})=>condition(a,b)).map(({a,b})=>`${a.label??a.id}–${b.label??b.id}`).join('; ')||'None';
  const selected=(type:string,count:number)=>{const list=scene.objects.filter(o=>scene.selectedIds.includes(o.id)&&o.type===type&&usable(o));if(list.length!==count)throw new ResolutionError(scene.objects.filter(o=>o.type===type).map(o=>o.id),`Select exactly ${count} ${type} objects first.`);list.forEach(o=>targets.add(o.id));return list;};
  const interpolated=(keys:string,t:number)=>add(point(keys[0]),mul(direction(keys),t));
  const angleList=(keys:string)=>{const p=validPoly(keys),orientation=Math.sign(p.reduce((sum,a,i)=>sum+cross(a,p[(i+1)%p.length]),0));return p.map((v,i)=>{const prev=p[(i+p.length-1)%p.length],next=p[(i+1)%p.length],a=angle(prev,v,next);return cross(sub(v,prev),sub(next,v))*orientation<0?360-a:a;});};
  const lengths=(keys:string)=>sideLengths(validPoly(keys));
  const reflect=(p:number[],a:number[],b:number[])=>sub(mul(foot(p,a,b),2),p);
  const rotate=(p:number[],pivot:number[],degrees:number)=>{const [x,y]=sub(p,pivot),r=degrees*Math.PI/180;return add(pivot,[x*Math.cos(r)-y*Math.sin(r),x*Math.sin(r)+y*Math.cos(r)]);};
  const sameSet=(a:number[][],b:number[][])=>a.length===b.length&&a.every(p=>b.some(q=>distance(p,q)<=tol));
  const edgeName=(keys:string,i:number)=>name(keys[i]).toUpperCase()+name(keys[(i+1)%keys.length]).toUpperCase();
  const shortestLongest=(keys:string,longest:boolean)=>{const values=lengths(keys),best=(longest?Math.max:Math.min)(...values);return values.map((v,i)=>near(v,best)?`${edgeName(keys,i)} = ${rounded(v)} units`:undefined).filter(Boolean).join('; ');};
  const make=(kind:VisualCommand['kind'],p:number[][],extra:Partial<VisualCommand>={})=>{const seed=scene.objects[0]?.command;const command:VisualCommand={...seed,kind,dimension:'2d',points:p,width:4,height:4,radius:1,color:'#22d3ee',rotation:[0,0,0],scale:1,action:'create',objectId:crypto.randomUUID(),roboLabel:undefined,roboControl:undefined,roboAnalyticConstraint:undefined,roboVisible:true,roboNativeIds:undefined,roboDependency:undefined,roboDefinitionState:undefined,roboExplicitVertices:true,...extra};effects.push(command);return command;};
  let value:GeometryAnswer['value'];let detail='';
  switch(id){
    case 1:{const q=n;value=extreme(points,o=>distance(o.position,q),true);detail=`Nearest to (${q.join(', ')}).`;break;}
    case 2:value=extreme(points,o=>Math.hypot(...o.position));break;
    case 3:value=point('A');break;
    case 4:value=pointNames(points.filter(o=>near(o.position[1],0)));break;
    case 5:value=pointNames(points.filter(o=>near(o.position[0],0)));break;
    case 6:value=points.some(o=>near(Math.hypot(...o.position),0));break;
    case 7:value=pointNames(points.filter(o=>o.position[0]>0&&o.position[1]>0));break;
    case 8:value=pointNames(points.filter(o=>o.position[0]<0));break;
    case 9:value=pointNames(points.filter(o=>o.position[1]>0));break;
    case 10:value=extreme(points,o=>o.position[0],true);break;
    case 11:value=extreme(points,o=>o.position[1]);break;
    case 12:value=pairNames((a,b)=>near(a.position[0],b.position[0]));break;
    case 13:value=pairNames((a,b)=>near(a.position[1],b.position[1]));break;
    case 14:value=pairs.some(({d})=>near(d,0));break;
    case 15:{const c=center(circle()),r=radius();value=pointNames(points.filter(o=>distance(o.position,c)<r-tol));break;}
    case 16:value=length('CD');detail='units';break;
    case 17:value=Math.hypot(...point('A'));detail='units';break;
    case 18:value=length('AB');detail='units';break;
    case 19:case 20:{if(!pairs.length)throw new Error('At least two points are required.');const best=(id===19?Math.min:Math.max)(...pairs.map(p=>p.d));value=pairs.filter(p=>near(p.d,best)).map(p=>`${p.a.label??p.a.id}–${p.b.label??p.b.id}: ${rounded(p.d)} units`).join('; ');break;}
    case 21:value=length('AB')>length('CD')+tol;break;
    case 22:value=near(length('AB'),length('BC'));break;
    case 23:value=length('AB')-length('CD');detail='units (negative means the first segment is shorter)';break;
    case 24:value=length('AB')+length('BC')+length('CD');detail='units';break;
    case 25:value=distance(point('A'),foot(point('A'),point('B'),point('C')));detail='units';break;
    case 26:{const lines=selected('line',2),[a,b]=vertices(lines[0]),[c,d]=vertices(lines[1]);if(!parallel(sub(b,a),sub(d,c)))throw new Error('The selected lines are not parallel.');value=distance(c,foot(c,a,b));detail='units';break;}
    case 27:value=Math.abs(direction('AB')[0]);detail='units';break;
    case 28:value=Math.abs(direction('CD')[1]);detail='units';break;
    case 29:value=shortestLongest('ABC',true);break;
    case 30:{const denominator=length('CD');if(denominator<=tol)throw new Error('The denominator segment has zero length.');value=length('AB')/denominator;break;}
    case 31:value=midpoint('AB');break;
    case 32:value=near(distance(point('M'),midpoint('CD')),0);break;
    case 33:value=extreme(points,o=>distance(o.position,midpoint('AB')),true);break;
    case 34:value=interpolated('AB',.25);break;
    case 35:case 40:{const [a,b]=n;if(a<=0||b<=0||id===40&&near(a,b))throw new Error('Use positive ratios; equal ratios have no external division point.');value=interpolated('AB',a/(id===35?a+b:a-b));detail='Coordinates of the division point; no point was created.';break;}
    case 36:value=[interpolated('AB',1/3),interpolated('AB',2/3)];break;
    case 37:{const list=selected('point',2);value=mid(list[0].position,list[1].position);break;}
    case 38:value=near(midpoint('AB')[1],0);break;
    case 39:value=distance(midpoint('AB'),midpoint('CD'));detail='units';break;
    case 41:value=sub(mul(point('M'),2),point('A'));break;
    case 42:{const l=length('AB');if(l<=tol||n[0]<0||n[0]>l+tol)throw new Error('The requested length must lie between zero and the segment length.');value=interpolated('AB',n[0]/l);break;}
    case 43:value=[.25,.5,.75].map(t=>interpolated('AB',t));break;
    case 44:value=near(distance(midpoint('AB'),midpoint('CD')),0);break;
    case 45:{const p=validPoly('ABC'),ls=sideLengths(p),best=Math.max(...ls);value=p.flatMap((a,i)=>near(ls[i],best)?[mid(a,p[(i+1)%3])]:[]);break;}
    case 46:{const [x,y]=direction('AB');unit([x,y]);value=near(x,0)?'Undefined: the line is vertical.':y/x;break;}
    case 47:unit(direction('CD'));value=near(direction('CD')[1],0);break;
    case 48:unit(direction('AB'));value=near(direction('AB')[0],0);break;
    case 49:{const a=point('A'),b=point('B'),[x,y]=sub(b,a);unit([x,y]);value=`${rounded(y)}x + ${rounded(-x)}y + ${rounded(x*a[1]-y*a[0])} = 0`;break;}
    case 50:case 51:{const keys=id===50?'AB':'CD',a=point(keys[0]),u=direction(keys),axis=id===50?1:0;unit(u);value=near(u[axis],0)?near(a[axis],0)?'The line coincides with the axis; infinitely many intercepts.':'No intercept: the line is parallel to the axis.':add(a,mul(u,-a[axis]/u[axis]));break;}
    case 52:case 146:{const p=lineHit(point('A'),point('B'),point('C'),point('D'));if(!p){value=onLine(point('C'),point('A'),point('B'))?'Coincident lines have infinitely many intersections; there is no unique point.':'No intersection: the lines are parallel.';if(id===146)throw new Error(value);}else {value=p;if(id===146)make('point',[p]);}break;}
    case 53:value=segmentHit(point('A'),point('B'),point('C'),point('D'));break;
    case 54:value=onLine(point('C'),point('A'),point('B'))&&dot(direction('AB'),sub(point('C'),point('A')))>=-tol;break;
    case 55:value=parallel(direction('AB'),direction('CD'));break;
    case 56:value=perpendicular(direction('AB'),direction('BC'));break;
    case 57:value=onLine(point('C'),point('A'),point('B'));break;
    case 58:value=onLine(point('P'),point('A'),point('B'));break;
    case 59:{const p=point('C'),list=scene.objects.filter(o=>o.type==='line'&&usable(o)&&vertices(o).length===2&&onLine(p,...vertices(o) as [number[],number[]]));value=list.map(o=>o.label??o.id).join('; ')||'None';list.forEach(o=>targets.add(o.id));break;}
    case 60:value=parallel(direction('AB'),direction('CD'))&&onLine(point('C'),point('A'),point('B'));break;
    case 61:value=angleAt();detail='degrees';break;
    case 62:{const p=validPoly('ABC'),as=p.map((v,i)=>angle(p[(i+2)%3],v,p[(i+1)%3])),best=Math.max(...as);value=as.map((a,i)=>near(a,best)?`${name('ABC'[i]).toUpperCase()}: ${rounded(a)} degrees`:undefined).filter(Boolean).join('; ');break;}
    case 63:value=near(angleAt(),90);break;
    case 64:{const a=angleAt('BAC');value=near(a,90)?'right':a<90?'acute':'obtuse';break;}
    case 65:{const a=Math.acos(Math.min(1,Math.abs(dot(unit(direction('AB')),unit(direction('CD'))))))*180/Math.PI;value=a;detail='degrees';break;}
    case 66:value=near(angleAt(),angleAt('DEF'));break;
    case 67:case 68:{const list=scene.objects.filter(o=>scene.selectedIds.includes(o.id)&&o.command.roboAngle&&usable(o));if(list.length!==2)throw new ResolutionError(scene.objects.map(o=>o.id),'Select exactly two defined angle objects first.');const as=list.map(o=>{const p=vertices(o),i=o.command.roboAngle!.vertex;return angle(p[(i+1)%3],p[i],p[(i+2)%3]);});value=near(as[0]+as[1],id===67?90:180);break;}
    case 69:value=180-angleAt();detail='degrees';break;
    case 70:validPoly('ABC');value=180;detail='degrees';break;
    case 71:{const b=point('B'),d=unit(sub(point('D'),b)),u=unit(sub(point('A'),b)),v=unit(sub(point('C'),b)),bisector=unit(add(u,v));value=near(distance(d,bisector),0);break;}
    case 72:value=360-angleAt();detail='degrees';break;
    case 73:value=angleAt()*Math.PI/180;detail='radians';break;
    case 74:value=90-angleAt();detail='degrees (negative means decrease the angle)';break;
    case 75:{const as=angleList('ABCDE');value=as.map((a,i)=>a>90+tol&&a<180-tol?name('ABCDE'[i]).toUpperCase():undefined).filter(Boolean).join(', ')||'None';break;}
    case 76:case 77:case 78:case 79:{const ls=lengths('ABC').sort((a,b)=>a-b);value=id===76?near(ls[0],ls[2]):id===77?near(ls[0],ls[1])||near(ls[1],ls[2]):id===78?!near(ls[0],ls[1])&&!near(ls[1],ls[2]):near(ls[0]**2+ls[1]**2,ls[2]**2);detail=id===77?'Isosceles means at least two equal sides.':'';break;}
    case 80:value=lengths('ABC').reduce((s,a)=>s+a,0);detail='units';break;
    case 81:value=area(validPoly('ABC'));detail='square units';break;
    case 82:value=2*area(validPoly('ABC'))/length('BC');detail='units';break;
    case 83:value=mul(validPoly('ABC').reduce(add,[0,0]),1/3);break;
    case 84:case 85:case 86:value=triangleCenter(triangle(),id===84?'CIRCUMCENTER':id===85?'INCENTER':'ORTHOCENTER').point;break;
    case 87:case 88:{const a=lengths('ABC').sort((x,y)=>x-y),b=lengths('DEF').sort((x,y)=>x-y);value=a.every((v,i)=>near(id===88?v:v/a[0],id===88?b[i]:b[i]/b[0]));break;}
    case 89:value=inside(point('P'),validPoly('ABC'));detail='Boundary points count as inside.';break;
    case 90:{const ls=['AB','BC','CA'].map(length).sort((a,b)=>a-b);value=ls[0]+ls[1]>ls[2]+tol;break;}
    case 91:value=center(circle());break;
    case 92:value=radius();detail='units';break;
    case 93:value=2*radius();detail='units';break;
    case 94:value=2*Math.PI*radius();detail='units';break;
    case 95:value=Math.PI*radius()**2;detail='square units';break;
    case 96:value=near(distance(point('A'),center(circle())),radius());break;
    case 97:{const d=distance(point('B'),center(circle())),r=radius();value=near(d,r)?'on the boundary':d<r?'inside':'outside';break;}
    case 98:value=near(distance(center(circle()),foot(center(circle()),point('A'),point('B'))),radius());break;
    case 99:{const a=point('A'),b=point('B'),o=circle(),l={...obj('A','point'),type:'line',vertices:[a,b],command:{...obj('A','point').command,kind:'line',points:[a,b],linearExtent:'line'}} as RoboObjectDescriptor;value=intersections(l,o);break;}
    case 100:value=near(distance(center(circle('c')),center(circle('d'))),0)&&near(radius('c'),radius('d'))?'Coincident circles have infinitely many intersections.':intersections(circle('c'),circle('d'));break;
    case 101:value=near(distance(center(circle('c')),center(circle('d'))),0);break;
    case 102:{const d=distance(center(circle('c')),center(circle('d'))),r=radius('c'),s=radius('d');value=d>tol&&(near(d,r+s)||near(d,Math.abs(r-s)));break;}
    case 103:case 104:case 105:{const a=point('A'),b=point('B'),c=center(circle()),r=radius();if(!near(distance(a,c),r)||!near(distance(b,c),r))throw new Error('Both endpoints must lie on the named circle.');if(id===105&&!near(distance(point('O'),c),0))throw new Error('O must be the center of the named circle.');const theta=distance(a,b)<=tol?0:angle(a,c,b)*Math.PI/180;value=id===103?distance(a,b):id===104?r*theta:r*r*theta/2;detail=id===105?'square units':'units';break;}
    case 106:case 107:case 108:case 109:{const p=validPoly('ABCD'),u=p.map((v,i)=>sub(p[(i+1)%4],v)),ls=sideLengths(p),para=parallel(u[0],u[2])&&parallel(u[1],u[3]),rect=para&&perpendicular(u[0],u[1]),rhomb=para&&ls.every(l=>near(l,ls[0]));value=id===106?rect:id===107?rect&&rhomb:id===108?para:rhomb;break;}
    case 110:{validPoly('ABCD');value=[parallel(direction('AB'),direction('CD'))?'AB ∥ CD':'',parallel(direction('BC'),direction('DA'))?'BC ∥ DA':''].filter(Boolean).map(t=>t.replace(/[ABCD]/g,k=>name(k).toUpperCase())).join('; ')||'None';break;}
    case 111:value=lengths('ABCDE').reduce((s,a)=>s+a,0);detail='units';break;
    case 112:value=area(validPoly('ABCD'));detail='square units';break;
    case 113:validPoly('ABCD');value=near(length('AC'),length('BD'));break;
    case 114:validPoly('ABCD');value=near(distance(midpoint('AC'),midpoint('BD')),0);break;
    case 115:validPoly('ABCD');value=perpendicular(direction('AC'),direction('BD'));break;
    case 116:{const p=validPoly('ABCDE'),turns=p.map((a,i)=>cross(sub(p[(i+1)%5],a),sub(p[(i+2)%5],p[(i+1)%5]))).filter(t=>Math.abs(t)>tol);value=turns.every(t=>t>0)||turns.every(t=>t<0)?'convex':'concave';break;}
    case 117:{const ls=lengths('ABCDE'),as=angleList('ABCDE');value=ls.every(l=>near(l,ls[0]))&&as.every(a=>near(a,as[0]));break;}
    case 118:validPoly('ABCDE');value=540;detail='degrees';break;
    case 119:value=shortestLongest('ABCDE',false);break;
    case 120:{const p=poly('ABCDE');value=p.some((a,i)=>p.some((c,j)=>j>i&&j!==(i+1)%5&&i!==(j+1)%5&&segmentHit(a,p[(i+1)%5],c,p[(j+1)%5])));break;}
    case 121:value=add(point('A'),n);break;
    case 122:{const [x,y]=point('A');value=[x,-y];break;}
    case 123:{const [x,y]=point('B');value=[-x,y];break;}
    case 124:value=mul(point('C'),-1);break;
    case 125:value=rotate(point('A'),[0,0],n[0]);break;
    case 126:value=rotate(point('B'),point('C'),n[0]);break;
    case 127:value=validPoly('ABC').map(p=>mul(p,n[0]));break;
    case 128:value=direction('AB');break;
    case 129:value=sameSet(validPoly('ABC').map(([x,y])=>[-x,y]),validPoly('DEF'));break;
    case 130:{const p=validPoly('ABCD'),c=mul(p.reduce(add,[0,0]),.25),axes=[...p,...p.map((a,i)=>mid(a,p[(i+1)%4]))].filter(a=>distance(a,c)>tol);value=axes.some(a=>sameSet(p.map(v=>reflect(v,c,a)),p));break;}
    case 131:{const p=validPoly('ABCD'),c=mul(p.reduce(add,[0,0]),.25);value=[90,180,270].some(a=>sameSet(p.map(v=>rotate(v,c,a)),p));detail='Nontrivial rotations smaller than 360 degrees.';break;}
    case 132:validPoly('ABC');value=true;detail='Rotation preserves Euclidean area.';break;
    case 133:value=area(validPoly('ABC'))*n[0]**2;detail='square units';break;
    case 134:validPoly('ABC');value=false;detail='Reflection preserves Euclidean lengths and perimeter.';break;
    case 135:{const p=reflect(point('A'),point('B'),point('C'));value=pointNames(points.filter(o=>near(distance(o.position,p),0)));detail=`Reflected coordinates: (${p.map(rounded).join(', ')}).`;break;}
    case 136:unit(direction('CD'));make('line',poly('CD'),{linearExtent:'segment'});value=length('CD');detail='Created segment.';break;
    case 137:value=midpoint('AB');make('point',[value]);break;
    case 138:{const m=midpoint('CD'),[x,y]=unit(direction('CD')),c=obj('C','point'),d=obj('D','point');make('line',[m,add(m,[-y,x])],{linearExtent:'line',roboLabel:`Perpendicular bisector ${c.label??name('C')}${d.label??name('D')}`,roboDependency:{kind:'perpBisector',parents:[{objectId:c.id},{objectId:d.id}]}});value=m;detail=`Drawn on the board through midpoint (${m.map(rounded).join(', ')}), perpendicular to ${c.label??name('C')}${d.label??name('D')}. It updates when either endpoint moves.`;break;}
    case 139:{const a=point('A'),u=unit(direction('BC'));make('line',[a,add(a,u)],{linearExtent:'line'});value=a;break;}
    case 140:{const a=point('A'),f=foot(a,point('B'),point('C'));if(distance(a,f)<=tol)throw new Error('A already lies on BC; a nonzero perpendicular segment cannot be drawn.');make('line',[a,f],{linearExtent:'segment'});value=f;break;}
    case 141:{const a=point('A'),r=length('AB');if(r<=tol)throw new Error('The center and circle point must be distinct.');make('circle',[a],{radius:r});value=r;detail='Created circle; radius in units.';break;}
    case 142:case 143:{const c=triangleCenter(triangle(),id===142?'CIRCUMCENTER':'INCENTER');make('circle',[c.point],{radius:c.radius});value=c.point;detail=`Created circle; radius ${rounded(c.radius)} units.`;break;}
    case 144:{validPoly('ABC');const m=midpoint('BC');make('line',[point('A'),m],{linearExtent:'segment'});value=m;break;}
    case 145:{validPoly('ABC');const b=point('B'),u=unit(add(unit(sub(point('A'),b)),unit(sub(point('C'),b))));make('ray',[b,add(b,u)]);value=angleAt()/2;detail='Created internal angle bisector; half-angle in degrees.';break;}
    default:throw new Error('UNSUPPORTED: This curriculum operation must use the native mutation planner.');
  }
  if(typeof value==='number'&&!Number.isFinite(value)||Array.isArray(value)&&value.flat().some(v=>!Number.isFinite(v)))throw new Error('The requested geometry has no finite defined result.');
  return {value,message:`${id>=136?'Construction':'Answer'}: ${typeof value==='number'?rounded(value):typeof value==='boolean'?value?'Yes':'No':JSON.stringify(value)}${detail?' '+detail:''}`,targets:[...targets],effects};
}
