import {Kid3dBoard} from './kidGeometry3dBoard';
import {add,sub,mul,dot,cross3,unit,norm,dist,near,clamp,foot,EPS} from './geometryAnalyticMath';
import {center} from './geometryQueries';
import {lineLine3,linePlane3} from '../kernel/geometry3d';
import type {RoboObjectDescriptor} from './types';
const topology:Record<string,[number,number,number]>={cube:[6,12,8],cuboid:[6,12,8],prism:[5,9,6],pyramid:[5,8,5],tetrahedron:[4,6,4],octahedron:[8,12,6],dodecahedron:[12,30,20],icosahedron:[20,30,12],sphere:[0,0,0],cylinder:[2,0,0],cone:[1,0,1],hemisphere:[1,0,0]};
export function sphereLine(b:Kid3dBoard){const s=b.sphere(),l=b.line(),u=unit(l.direction),w=sub(l.point,s.center),t=-dot(w,u),f=add(l.point,mul(u,t)),d=dist(f,s.center);if(d>s.radius+EPS)return [];const h=Math.sqrt(Math.max(0,s.radius*s.radius-d*d));return h<=EPS?[f]:[add(f,mul(u,-h)),add(f,mul(u,h))];}
export function sphereSection(b:Kid3dBoard){const s=b.sphere(),p=b.plane(),signed=dot(sub(s.center,p.point),p.normal),d=Math.abs(signed);return {center:sub(s.center,mul(p.normal,signed)),normal:p.normal,radius:d>s.radius+EPS?undefined:Math.sqrt(Math.max(0,s.radius*s.radius-d*d))};}
export function boxSection(b:Kid3dBoard,o:RoboObjectDescriptor,plane=b.plane()){
 const vs=b.boxVertices(o),out:number[][]=[];const append=(p:number[])=>{if(!out.some(q=>dist(p,q)<=EPS))out.push(p);};
 vs.forEach((a,i)=>vs.forEach((bb,j)=>{if(j<=i||![1,2,4].includes(i^j))return;const x=dot(sub(a,plane.point),plane.normal),y=dot(sub(bb,plane.point),plane.normal);if(Math.abs(x)<=EPS)append(a);if(Math.abs(y)<=EPS)append(bb);if(x*y<-EPS*EPS)append(add(a,mul(sub(bb,a),x/(x-y))));}));
 if(out.length>2){const c=mul(out.reduce(add,[0,0,0]),1/out.length),u=unit(sub(out[0],c)),v=cross3(plane.normal,u);out.sort((a,bb)=>Math.atan2(dot(sub(a,c),v),dot(sub(a,c),u))-Math.atan2(dot(sub(bb,c),v),dot(sub(bb,c),u)));}return out;
}
export function kid3dQuery(b:Kid3dBoard):unknown{
 const id=b.lesson.id,n=b.n,p=b.point,sphere=b.sphere,one=b.one,measure=b.measure;
 const list=b.list,points=b.objects('point'),solids=b.objects('solid');
 const extreme=(objects:RoboObjectDescriptor[],score:(o:RoboObjectDescriptor)=>number,min=false)=>{if(!objects.length)throw new Error('There are no matching objects on the board.');const values=objects.map(score),best=(min?Math.min:Math.max)(...values);return list(objects.filter((_,i)=>near(values[i],best)));};
 const vectorPair=()=>b.vectors();
 switch(id){
 case 41:return solids.length;case 42:return b.objects('cube').length;case 43:return b.objects('sphere').length;
 case 44:return one().type;case 45:return list(b.objects('sphere'));case 46:return list(solids.filter(o=>['cone','pyramid','tetrahedron'].includes(o.type)));case 47:return list(b.objects('cylinder'));
 case 48:return list(solids.filter(o=>['cube','cuboid','prism','pyramid','tetrahedron','octahedron','dodecahedron','icosahedron','wedge'].includes(o.type)));
 case 49:return list(solids.filter(o=>['sphere','cylinder','cone','hemisphere','capsule','ellipsoid','torus','tube','frustum'].includes(o.type)));
 case 50:return list(solids.filter(o=>['cylinder','cone','hemisphere','frustum','tube'].includes(o.type)));
 case 51:return topology[one('cube').type][0];case 52:return topology[one('cube').type][1];case 53:return topology[one('cube').type][2];case 54:return topology[one('cuboid').type][0];case 55:return topology[one('prism').type][1];case 56:return topology[one('pyramid').type][2];case 57:return topology[one('tetrahedron').type][0];
 case 58:return false;case 59:return false;case 60:{const o=one('solid');return ['cube','cuboid'].includes(o.type)?o.type:`This is a ${o.type}.`;}
 case 61:one('cube');return true;case 62:{const [a,bb]=b.pair('solid');return a.type===bb.type;}
 case 63:return extreme(solids,o=>topology[o.type]?.[2]??0);case 64:return list(solids.filter(o=>['cone','cylinder','hemisphere','frustum','tube'].includes(o.type)));case 65:return one().label??one().id;
 case 66:return p('A');case 67:return p('B');case 68:return list(points.filter(o=>dist(o.position,n)<=EPS));case 69:return extreme(points,o=>dist(o.position,n),true);case 70:return points.some(o=>norm(o.position)<=EPS);
 case 71:return dist(p('A'),p('B'));case 72:return norm(p('C'));case 73:{const [a,bb]=b.pair('point');return dist(a.position,bb.position);}case 74:return mul(add(p('A'),p('B')),.5);
 case 76:return extreme(points,o=>o.position[2]);case 77:return extreme(points,o=>o.position[0],true);case 78:return extreme(points,o=>Math.abs(o.position[2]),true);case 79:return p('A')[2]>EPS;case 80:return Math.hypot(p('B')[0],p('B')[1])<=EPS;case 81:return near(p('A')[2],p('B')[2]);case 82:return list(points.filter(o=>Math.abs(o.position[2])<=EPS));case 83:return Math.hypot(p('A')[1],p('A')[2]);case 84:return Math.abs(p('B')[0]);
 case 85:{const u=b.v('AB'),v=b.v('AC');if(norm(u)<=EPS||norm(v)<=EPS)return true;return norm(cross3(unit(u),unit(v)))<=EPS;}
 case 86:{const q=b.pair('point',4).map(o=>o.position);return Math.abs(dot(sub(q[3],q[0]),cross3(sub(q[1],q[0]),sub(q[2],q[0]))))<=EPS;}
 case 87:return dist(p('A'),sphere().center)<sphere().radius-EPS;case 88:{const s=sphere();return near(dist(p('B'),s.center),s.radius);}case 89:return b.inside(p('C'),one('cuboid'));case 90:{const o=one('solid');return list(points.filter(p=>!b.inside(p.position,o)));}
 case 91:return measure(one('cube'));case 92:return measure(one('cuboid'));case 93:return measure(one('sphere'));case 94:return measure(one('cylinder'));case 95:return measure(one('cone'));case 96:return measure(one('pyramid'));case 97:return measure(one('prism'));
 case 98:return measure(one('cube'),'SURFACE_AREA');case 99:return measure(one('cuboid'),'SURFACE_AREA');case 100:return measure(one('sphere'),'SURFACE_AREA');case 101:return measure(one('cylinder'),'SURFACE_AREA');
 case 102:{const o=one('cylinder'),s=o.command.scale??1;return 2*Math.PI*o.command.radius*o.command.height*s*s;}
 case 103:{const o=one('cone'),s=o.command.scale??1;return Math.PI*o.command.radius*Math.hypot(o.command.radius,o.command.height)*s*s;}case 104:return measure(one('cone'),'SURFACE_AREA');
 case 105:{const o=one('pyramid');return 2*(o.command.radius*(o.command.scale??1))**2;}case 106:return b.dimensions(one('cube'))[0]**2;case 107:return Math.PI*(one('cylinder').command.radius*(one('cylinder').command.scale??1))**2;
 case 108:return b.dimensions(one('cube'))[0];case 109:return one('cone').command.height*(one('cone').command.scale??1);case 110:return sphere().radius;case 111:return 2*one('cylinder').command.radius*(one('cylinder').command.scale??1);case 112:return b.dimensions(one('cuboid'));case 113:return norm(b.dimensions(one('cuboid')));case 114:return Math.SQRT2*b.dimensions(one('cube'))[0];case 115:{const o=one('cone'),s=o.command.scale??1;return Math.hypot(o.command.radius,o.command.height)*s;}
 case 116:return sphere().center;case 117:return center(one('cuboid'));case 118:{const [a,bb]=b.pair('sphere');return dist(center(a),center(bb));}case 119:return extreme(solids,o=>measure(o));case 120:return extreme(solids,o=>measure(o,'SURFACE_AREA'),true);case 121:return measure(one('cube'))>measure(one('sphere'));case 122:{const [a,bb]=b.pair('cuboid');return near(measure(a),measure(bb));}case 123:return measure(one('cylinder'))-measure(one('cone'));
 case 124:return 'Yes. With the same base radius r and height h, cylinder volume is πr²h and cone volume is πr²h / 3.';
 case 125:{const o=one('solid'),c=o.command,s=c.scale??1;return o.type==='sphere'?`V = 4πr³ / 3 = 4π × ${(c.radius*s)}³ / 3 = ${measure(o)} cubic units.`:o.type==='cube'?`V = side³ = ${(c.width*s)}³ = ${measure(o)} cubic units.`:o.type==='cuboid'?`V = length × height × depth = ${b.dimensions(o).join(' × ')} = ${measure(o)} cubic units.`:['cone','cylinder'].includes(o.type)?`V = πr²h${o.type==='cone'?' / 3':''} = π × ${(c.radius*s)}² × ${(c.height*s)}${o.type==='cone'?' / 3':''} = ${measure(o)} cubic units.`:`The ${o.type} has volume ${measure(o)} cubic units, using its current dimensions.`;}
 case 160:return 'No. A rotation changes the pose, while preserving lengths, surface area, and volume.';
 case 179:{const v=measure(one('cube'));return `Doubling all three sides multiplies the volume by 8: ${v} → ${8*v} cubic units.`;}case 180:{const a=measure(one('sphere'),'SURFACE_AREA');return `Doubling the radius multiplies surface area by 4: ${a} → ${4*a} square units.`;}
 case 211:return norm(b.v('AB'));case 212:return unit(b.v('AB'));case 213:return b.vector();case 214:return norm(b.vector());case 216:{const [u,v]=vectorPair();return add(u,v);}case 217:return sub(b.v('AB'),b.v('AC'));case 218:{const [u,v]=vectorPair();return Math.acos(clamp(dot(unit(u),unit(v))))*180/Math.PI;}case 219:{const [u,v]=vectorPair();return Math.abs(dot(unit(u),unit(v)))<=EPS;}case 220:{const [u,v]=vectorPair();return norm(cross3(unit(u),unit(v)))<=EPS;}case 221:{const [u,v]=vectorPair();return dot(u,v);}
 case 223:return dist(p('C'),foot(p('C'),p('A'),p('B')))<=EPS;
 case 224:case 225:case 226:case 227:case 228:{const [a,bb]=b.pair('line'),l=b.line(a),m=b.line(bb),hit=lineLine3(l,m);if(id===224)return norm(cross3(unit(l.direction),unit(m.direction)))<=EPS;if(id===225)return ['point','coincident'].includes(hit.kind);if(id===226)return hit;if(id===227)return hit.kind==='skew';const u=cross3(l.direction,m.direction);return norm(u)<=EPS?norm(cross3(sub(m.point,l.point),unit(l.direction))):Math.abs(dot(sub(m.point,l.point),unit(u)));}
 case 229:{const l=b.line();return dist(p('A'),foot(p('A'),l.point,add(l.point,l.direction)));}
 case 235:{const pl=b.plane();return {normal:pl.normal,constant:dot(pl.normal,pl.point),equation:`${pl.normal[0]}x + ${pl.normal[1]}y + ${pl.normal[2]}z = ${dot(pl.normal,pl.point)}`};}
 case 236:{const pl=b.plane();return Math.abs(dot(sub(p('D'),pl.point),pl.normal))<=EPS;}case 237:return Math.abs(dot(unit(b.line().direction),b.plane().normal))<=EPS;case 238:return linePlane3(b.line(),b.plane());case 239:{const pl=b.plane();return Math.abs(dot(sub(p('A'),pl.point),pl.normal));}
 case 241:case 242:case 243:{const [a,bb]=b.pair('plane'),u=b.plane(a).normal,v=b.plane(bb).normal;return id===241?Math.abs(dot(u,v))<=EPS:id===242?norm(cross3(u,v))<=EPS:Math.acos(clamp(Math.abs(dot(u,v))))*180/Math.PI;}
 case 245:return b.plane().normal;
 case 247:{const q=boxSection(b,one('cube'));if(q.length<3)return {kind:q.length===0?'none':q.length===1?'point':'segment',points:q};const edges=q.map((p,i)=>dist(p,q[(i+1)%q.length])),right=q.every((p,i)=>Math.abs(dot(unit(sub(q[(i+1)%q.length],p)),unit(sub(q[(i+q.length-1)%q.length],p))))<=EPS);return {kind:q.length===4&&right&&edges.every(x=>near(x,edges[0]))?'square':q.length===4&&right?'rectangle':`${q.length}-sided polygon`,vertices:q};}
 case 249:{const q=sphereSection(b);if(q.radius===undefined)throw new Error('The plane misses the sphere, so there is no circular slice.');return q.radius;}
 case 251:return 'Yes. A plane tilted to the cylinder axis can cut an ellipse, when the slice stays between its end caps.';
 case 254:{const s=sphere(),pl=b.plane();return near(Math.abs(dot(sub(s.center,pl.point),pl.normal)),s.radius);}
 case 256:case 257:case 258:case 259:{const [a,bb]=b.pair('sphere'),s=sphere(a),t=sphere(bb),d=dist(s.center,t.center);if(id===256)return near(d,s.radius+t.radius)||d>EPS&&near(d,Math.abs(s.radius-t.radius));if(id===257)return d<s.radius+t.radius-EPS;if(id===258)return d+Math.min(s.radius,t.radius)<=Math.max(s.radius,t.radius)+EPS;if(d<=EPS)return near(s.radius,t.radius)?{kind:'coincident'}:{kind:'none'};if(d>s.radius+t.radius+EPS||d<Math.abs(s.radius-t.radius)-EPS)return {kind:'none'};const u=unit(sub(t.center,s.center)),x=(d*d+s.radius*s.radius-t.radius*t.radius)/(2*d),r=Math.sqrt(Math.max(0,s.radius*s.radius-x*x));return {kind:r<=EPS?'point':'circle',center:add(s.center,mul(u,x)),normal:u,radius:r};}
 case 260:return sphereLine(b).length>0;case 262:return sphereLine(b).length===1;case 263:{const s=sphere();return b.boxVertices(one('cube')).every(p=>dist(p,s.center)<=s.radius+EPS);}case 264:{const box=one('cuboid'),pl=b.plane(),ds=b.boxVertices(box).map(p=>dot(sub(p,pl.point),pl.normal));return Math.min(...ds)<=EPS&&Math.max(...ds)>=-EPS;}
 case 271:return 'I will apply the next change only to the objects you name or select. The other objects stay where they are.';
 case 273:{const o=b.objects('sphere').filter(o=>o.style.color==='#3b82f6');if(o.length!==1)throw new Error('Select one blue sphere and ask what you want to measure or change.');return {name:o[0].label,center:center(o[0]),radius:sphere(o[0]).radius};}
 case 274:return measure(one('solid'));
 case 275:{const r=b.scene.previousResults?.filter(r=>r.action==='FIND').slice(-2);if(!r||r.length<2)return 'I need two completed measurements to explain a change. Ask the measurement, change the solid, and ask it again.';return `Previous result: ${JSON.stringify(r[0].value)}. Latest result: ${JSON.stringify(r[1].value)}. Measurements use the current coordinates, dimensions, and scale.`;}
 case 277:return b.scene.previousResult===undefined?'Ask a measurement first, and I can explain the answer.':`The last answer is ${JSON.stringify(b.scene.previousResult)}. ${b.scene.previousResults?.at(-1)?.explanation??''}`;
 case 276:return b.scene.previousResults?.at(-1)?.explanation??'Ask a measurement first, then I can explain its steps.';
 case 278:return b.scene.lastModified?b.scene.objects.find(o=>o.id===b.scene.lastModified)?.label??b.scene.lastModified:'No completed object edit is recorded.';
 case 279:{const ids=b.scene.previousCommands?.filter(c=>c.action!=='FIND').flatMap(c=>c.parameters.kidResolvedTargets as string[]??c.targets??(typeof c.target==='string'?[c.target]:[]))??[];return ids.length?`The previous request targeted: ${ids.join(', ')}.`:'Ask immediately after the cube edit so I can identify the objects involved.';}
 default:throw new Error('Unknown 3D question.');
 }
}
