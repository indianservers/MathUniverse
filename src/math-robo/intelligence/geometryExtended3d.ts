import {GeometryBoard} from './geometryBoard';
import {add,sub,mul,dot,cross3,unit,norm,dist,near,EPS,clamp} from './geometryAnalyticMath';
import {planeFromPoints3,lineLine3,linePlane3,planePlane3} from '../kernel/geometry3d';
import {transformPoint} from '../../offline-intelligence/commands';
import {vertices} from './geometryQueries';
import {ResolutionError} from './targetResolver';
import type {RoboObjectDescriptor} from './types';

function solidVertices(o:RoboObjectDescriptor){
  if(o.command.roboExplicitVertices&&vertices(o).length===8)return vertices(o);
  const c=o.command,center=c.points[0],w=c.width,h=o.type==='cube'?w:c.height,d=o.type==='cube'?w:c.depth??w;
  if([w,h,d].some(x=>x<=0))throw new Error('Positive solid dimensions are required.');
  return Array.from({length:8},(_,i)=>transformPoint(add(center,[(i&1?1:-1)*w/2,(i&2?1:-1)*h/2,(i&4?1:-1)*d/2]),c,center));
}
export function extended3d(b:GeometryBoard):unknown{
  const {id}=b.lesson,p=b.point;
  const plane=(keys:string)=>planeFromPoints3(b.pts(keys));
  const line=(keys:string)=>({kind:'line' as const,point:p(keys[0]),direction:sub(p(keys[1]),p(keys[0]))});
  const selectedSolid=(type:string)=>{const candidates=b.objects(type),selected=candidates.filter(o=>b.scene.selectedIds.includes(o.id));if(selected.length===1)return selected[0];if(candidates.length===1)return candidates[0];throw new ResolutionError(candidates.map(o=>o.id),`Select one ${type}.`);};
  const sphere=()=>{const o=b.obj('s','sphere'),radius=o.command.radius*(o.command.scale??1);if(radius<=0)throw new Error('A sphere needs a positive radius.');return {center:o.position,radius};};
  const tetra=()=>{const q=b.pts('ABCD'),volume=Math.abs(dot(sub(q[1],q[0]),cross3(sub(q[2],q[0]),sub(q[3],q[0]))))/6;if(volume<=EPS)throw new Error('A nondegenerate tetrahedron is required.');return {points:q,volume};};
  switch(id){
    case 226:return p('P');
    case 227:return b.list(b.objects('point').filter(o=>near(o.position[2],0)));
    case 228:return b.list(b.objects('point').filter(o=>o.position[2]>EPS));
    case 229:return Math.hypot(p('P')[0],p('P')[1]);
    case 230:return Math.abs(p('P')[2]);
    case 231:{const q=plane('ABC'),constant=dot(q.normal,q.point);return {normal:q.normal,constant,equation:`${q.normal[0]}x + ${q.normal[1]}y + ${q.normal[2]}z = ${constant}`};}
    case 232:{const q=plane('ABC');return Math.abs(dot(sub(p('D'),q.point),q.normal))<=EPS;}
    case 233:return plane('ABC').normal;
    case 234:{const l=line('AB'),q=plane('CDE');return Math.asin(clamp(Math.abs(dot(unit(l.direction),q.normal))))*180/Math.PI;}
    case 235:return Math.acos(clamp(Math.abs(dot(plane('ABC').normal,plane('DEF').normal))))*180/Math.PI;
    case 236:return lineLine3(line('AB'),line('CD')).kind==='skew';
    case 237:{const a=line('AB'),bb=line('CD');unit(a.direction);unit(bb.direction);const perpendicular=cross3(a.direction,bb.direction);if(norm(perpendicular)<=EPS)throw new Error('The lines are parallel rather than skew.');const value=Math.abs(dot(sub(bb.point,a.point),unit(perpendicular)));if(value<=EPS)throw new Error('The lines intersect rather than being skew.');return value;}
    case 238:return linePlane3(line('AB'),plane('CDE'));
    case 239:return planePlane3(plane('ABC'),plane('DEF'));
    case 240:{const q=plane('ABC');return sub(p('P'),mul(q.normal,dot(sub(p('P'),q.point),q.normal)));}
    case 241:return tetra().volume;
    case 242:{const {points:q}=tetra();return [[0,1,2],[0,1,3],[0,2,3],[1,2,3]].reduce((sum,[a,bb,c])=>sum+norm(cross3(sub(q[bb],q[a]),sub(q[c],q[a])))/2,0);}
    case 243:{const {points:q,volume}=tetra(),point=p('P');const total=q.reduce((sum,_,i)=>{const t=q.map((x,j)=>j===i?point:x);return sum+Math.abs(dot(sub(t[1],t[0]),cross3(sub(t[2],t[0]),sub(t[3],t[0]))))/6;},0);return near(total,volume);}
    case 244:{const o=selectedSolid('cuboid'),q=solidVertices(o);return Math.max(...q.flatMap((a,i)=>q.slice(i+1).map(bb=>dist(a,bb))));}
    case 245:return Math.acos(1/Math.sqrt(3))*180/Math.PI;
    case 246:{const cube=selectedSolid('cube'),q=solidVertices(cube),pl=plane('ABC'),edge=Math.min(...q.flatMap((a,i)=>q.slice(i+1).map(bb=>dist(a,bb))).filter(x=>x>EPS)),out:number[][]=[];
      const append=(p:number[])=>{if(!out.some(x=>dist(x,p)<=EPS))out.push(p);};
      q.forEach((a,i)=>q.slice(i+1).forEach(bb=>{if(!near(dist(a,bb),edge))return;const da=dot(sub(a,pl.point),pl.normal),db=dot(sub(bb,pl.point),pl.normal);if(Math.abs(da)<=EPS)append(a);if(Math.abs(db)<=EPS)append(bb);if(da*db<-EPS*EPS)append(add(a,mul(sub(bb,a),da/(da-db))));}));
      if(out.length<3)return {kind:out.length===0?'none':out.length===1?'point':'segment',points:out};
      const center=mul(out.reduce(add,[0,0,0]),1/out.length),u=unit(sub(out[0],center)),v=unit(cross3(pl.normal,u));out.sort((a,bb)=>Math.atan2(dot(sub(a,center),v),dot(sub(a,center),u))-Math.atan2(dot(sub(bb,center),v),dot(sub(bb,center),u)));return {kind:'polygon',vertices:out};}
    case 247:{const q=sphere(),a=p('A'),u=unit(sub(p('B'),a)),w=sub(a,q.center),projection=dot(w,u),disc=projection**2-dot(w,w)+q.radius**2;if(disc<-EPS)return [];const root=Math.sqrt(Math.max(0,disc));return root<=EPS?[add(a,mul(u,-projection))]:[add(a,mul(u,-projection-root)),add(a,mul(u,-projection+root))];}
    case 248:{const q=sphere(),pl=plane('ABC');return near(Math.abs(dot(sub(q.center,pl.point),pl.normal)),q.radius);}
    case 249:{const q=sphere(),pl=plane('ABC'),distance=Math.abs(dot(sub(q.center,pl.point),pl.normal));if(distance>q.radius+EPS)throw new Error('The plane does not intersect the sphere.');return Math.sqrt(Math.max(0,q.radius**2-distance**2));}
    case 250:{const [a,bb]=b.selected('sphere',2),r=a.command.radius*(a.command.scale??1),s=bb.command.radius*(bb.command.scale??1),d=dist(a.position,bb.position);if(r<=0||s<=0)throw new Error('Positive sphere radii are required.');if(d>=r+s)return 0;if(d<=Math.abs(r-s))return 4*Math.PI*Math.min(r,s)**3/3;return Math.PI*(r+s-d)**2*(d*d+2*d*(r+s)-3*(r-s)**2)/(12*d);}
    default:throw new Error('Unknown spatial geometry question.');
  }
}
