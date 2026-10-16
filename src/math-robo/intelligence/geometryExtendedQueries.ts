import {GeometryBoard} from './geometryBoard';
import {vertices} from './geometryQueries';
import {add,sub,mul,dot,cross,unit,norm,dist,mid,near,EPS,clamp,foot,onLine,onSegment,inside,area,signedArea,hull,convexClip,segmentIntervals,lineCircle,circleOverlap,circumcenter,angle,rotate,reflect,centroid,lineHit} from './geometryAnalyticMath';

const bearing=(u:number[])=>{unit(u);return (Math.atan2(u[1],u[0])*180/Math.PI+360)%360;};
const equation=(p:number[],u:number[])=>{unit(u);const a=-u[1],b=u[0];return `${a}x + ${b}y = ${a*p[0]+b*p[1]}`;};
export function tangentContacts(p:number[],c:number[],r:number){const v=sub(p,c),d=norm(v);if(d<r-EPS)throw new Error('A point inside the circle has no real tangent.');if(near(d,r))return [p];const u=unit(v),f=add(c,mul(u,r*r/d)),h=r*Math.sqrt(Math.max(0,d*d-r*r))/d,w=[-u[1],u[0]];return [add(f,mul(w,h)),sub(f,mul(w,h))];}
export function commonTangents(a:number[],r:number,b:number[],s:number,internal=false){const d=sub(b,a),l=norm(d);if(l<=EPS){if(near(r,s)&&!internal)throw new Error('Coincident circles have infinitely many common tangents.');return [];}
  const u=unit(d),v=[-u[1],u[0]],signed=internal?-s:s,k=(r-signed)/l;if(Math.abs(k)>1+EPS)return [];
  const h=Math.sqrt(Math.max(0,1-k*k));return (h<=EPS?[1]:[1,-1]).map(sign=>{const n=add(mul(u,k),mul(v,sign*h)),p=add(a,mul(n,r)),q=add(b,mul(n,signed));return dist(p,q)<=EPS?[p,add(p,[-n[1],n[0]])]:[p,q];});
}
function interiorAngles(p:number[][]){const orientation=Math.sign(signedArea(p));return p.map((v,i)=>{const a=p[(i+p.length-1)%p.length],b=p[(i+1)%p.length],small=angle(a,v,b);return cross(sub(v,a),sub(b,v))*orientation<0?360-small:small;});}
function polygonPerimeter(p:number[][]){return p.reduce((s,a,i)=>s+dist(a,p[(i+1)%p.length]),0);}
function cyclic(p:number[][]){const c=circumcenter(p[0],p[1],p[2]),r=dist(p[0],c);return p.every(v=>near(dist(v,c),r));}
function bisector(a:number[],b:number[],c:number[]){const ab=dist(a,b),bc=dist(b,c);unit(sub(a,b));unit(sub(c,b));return mul(add(mul(a,bc),mul(c,ab)),1/(ab+bc));}
export function triangleCenters(p:number[][]){const [a,b,c]=p,o=circumcenter(a,b,c),lengths=[dist(b,c),dist(a,c),dist(a,b)],perimeter=lengths.reduce((x,y)=>x+y,0),i=mul(p.reduce((s,v,j)=>add(s,mul(v,lengths[j])),[0,0]),1/perimeter);return {circumcenter:o,circumradius:dist(o,a),incenter:i,inradius:2*area(p)/perimeter,orthocenter:sub(add(add(a,b),c),mul(o,2)),centroid:mul(p.reduce(add,[0,0]),1/3)};}
export function extendedQuery(b:GeometryBoard):unknown{
  const {id,numbers:n}=b.lesson,p=b.point,points=b.objects('point'),v=(keys:string)=>sub(p(keys[1]),p(keys[0])),ls=(keys:string)=>dist(p(keys[0]),p(keys[1])),poly=b.poly;
  const list=(filter:(p:number[])=>boolean)=>b.list(points.filter(o=>filter(o.position)));
  const lines=b.lines(),segments=lines.filter(o=>o.command.linearExtent==='segment');
  const c=()=>b.circle('c'),d=()=>b.circle('d');
  const parallel=(a:number[],b:number[])=>Math.abs(cross(unit(a),unit(b)))<=EPS;
  const perpendicular=(a:number[],b:number[])=>Math.abs(dot(unit(a),unit(b)))<=EPS;
  const selectedLines=(count:number)=>b.selected('line',count).map(o=>vertices(o) as [number[],number[]]);
  const inCircle=(q:number[],key='c')=>{const circle=b.circle(key);return dist(q,circle.center)<circle.radius-EPS;};
  const onCircle=(q:number[],key='c')=>{const circle=b.circle(key);return near(dist(q,circle.center),circle.radius);};
  const chord=(keys:string)=>{if(!keys.split('').every(k=>onCircle(p(k))))throw new Error('Both chord endpoints must lie on the named circle.');return ls(keys);};
  const tri=()=>poly('ABC'),centers=()=>triangleCenters(tri());
  const determinant=(a:number[],bb:number[],q:number[])=>cross(sub(bb,a),sub(q,a));
  switch(id){
    case 1:return list(q=>q.every(x=>near(x,Math.round(x))));
    case 2:return list(q=>near(q[0],q[1]));
    case 3:return list(q=>near(q[0]+q[1],n[0]));
    case 4:return list(q=>near(q[1],n[0]*q[0]));
    case 5:return list(q=>near(dist(q,p('A')),n[0]));
    case 6:return list(q=>dist(q,p('B'))<=n[0]+EPS);
    case 7:return list(q=>dist(q,p('C'))>n[0]+EPS);
    case 8:return list(q=>dist(q,p('A'))<dist(q,p('B'))-EPS);
    case 9:return list(q=>near(dist(q,p('C')),dist(q,p('D'))));
    case 10:return b.extreme(points,o=>Math.abs(o.position[1]));
    case 11:return b.extreme(points,o=>Math.abs(o.position[0]),false);
    case 12:return list(q=>q[0]>Math.min(...n)&&q[0]<Math.max(...n));
    case 13:return list(q=>q[0]>=Math.min(n[0],n[2])-EPS&&q[0]<=Math.max(n[0],n[2])+EPS&&q[1]>=Math.min(n[1],n[3])-EPS&&q[1]<=Math.max(n[1],n[3])+EPS);
    case 14:{const ps=poly('ABCD'),s=ps.map((a,i)=>dist(a,ps[(i+1)%4]));if(!s.every(x=>near(x,s[0]))||!perpendicular(sub(ps[1],ps[0]),sub(ps[2],ps[1])))throw new Error('ABCD must be a square.');return list(q=>ps.some((a,i)=>onSegment(q,a,ps[(i+1)%4])));}
    case 15:return list(q=>inCircle(q,'c')&&inCircle(q,'d'));
    case 16:return list(q=>inCircle(q,'c')&&dist(q,d().center)>d().radius+EPS);
    case 17:return b.extreme(points.filter(o=>o.id!==b.obj('A','point').id),o=>dist(o.position,p('A')));
    case 18:{const sorted=[...points].sort((a,b)=>dist(a.position,n)-dist(b.position,n));if(sorted.length<3)throw new Error('At least three points are required.');const cutoff=dist(sorted[2].position,n);return b.list(sorted.filter(o=>dist(o.position,n)<=cutoff+EPS));}
    case 19:return b.list([...points].sort((a,b)=>a.position[0]-b.position[0]||a.position[1]-b.position[1]));
    case 20:return b.list([...points].sort((a,bb)=>dist(a.position,p('B'))-dist(bb.position,p('B'))));
    case 21:{const matches=points.filter(o=>near(o.position[0],p('C')[0])&&o.position[1]>p('C')[1]+EPS);return matches.length?b.extreme(matches,o=>dist(o.position,p('C'))):'None';}
    case 22:return b.extreme(points.filter(o=>near(o.position[1],p('D')[1])&&o.position[0]>p('D')[0]+EPS),o=>dist(o.position,p('D')));
    case 23:{const [a,bb]=b.pts('AB');if(near(a[0],bb[0]))throw new Error('A vertical line has no below/above half-plane; ask left or right.');return list(q=>q[1]<a[1]+(q[0]-a[0])*(bb[1]-a[1])/(bb[0]-a[0])-EPS);}
    case 24:{unit(v('AB'));const x=cross(v('AB'),sub(p('P'),p('A')));return near(x,0)?'on the line':x>0?'left':'right';}
    case 25:return list(q=>inside(q,tri(),false)&&dist(q,c().center)>c().radius+EPS);
    case 26:return v('AB');
    case 27:return ls('AC');
    case 28:return unit(v('BC'));
    case 29:return add(v('AB'),v('CD'));
    case 30:case 37:return sub(v('AC'),v('AB'));
    case 31:return dot(v('AB'),v('CD'));
    case 32:return cross(v('AB'),v('AC'));
    case 33:return near(dot(unit(v('AB')),unit(v('CD'))),1);
    case 34:return near(dot(unit(v('AB')),unit(v('CD'))),-1);
    case 35:{const u=unit(v('AC'));return mul(u,dot(v('AB'),u));}
    case 36:return dot(v('AB'),unit(v('CD')));
    case 38:{const [a,bb,cc,dd]=b.pts('ABCD'),hit=lineHit(a,bb,cc,dd);if(hit&&onSegment(hit,a,bb)&&onSegment(hit,cc,dd))return 0;return Math.min(dist(a,foot(a,cc,dd,'segment')),dist(bb,foot(bb,cc,dd,'segment')),dist(cc,foot(cc,a,bb,'segment')),dist(dd,foot(dd,a,bb,'segment')));}
    case 39:return dist(p('P'),foot(p('P'),p('A'),p('B'),'segment'));
    case 40:{const f=foot(p('P'),p('A'),p('B'),'segment');return near(dist(f,p('A')),0)||near(dist(f,p('B')),0);}
    case 41:return dist(p('P'),foot(p('P'),p('A'),p('B'),'ray'));
    case 42:if(n[0]<0)throw new Error('The desired length must be nonnegative.');return `${n[0]-ls('AB')} units along the ray direction; a negative value means move toward A.`;
    case 43:{const a=p('A'),bb=p('B'),u=v('AB'),len=dot(u,u);unit(u);const roots=lineCircle(a,bb,c().center,c().radius).map(q=>dot(sub(q,a),u)/len);if(!roots.length)return 0;if(roots.length===1)return 0;return Math.max(0,Math.min(1,Math.max(...roots))-Math.max(0,Math.min(...roots)));}
    case 44:{const q=poly('CDEF'),u=sub(q[1],q[0]),w=sub(q[2],q[1]);if(!perpendicular(u,w)||!parallel(u,sub(q[3],q[2]))||!parallel(w,sub(q[0],q[3])))throw new Error('CDEF must be a rectangle.');return segmentIntervals(p('A'),p('B'),q).map(([a,bb])=>[add(p('A'),mul(v('AB'),a)),add(p('A'),mul(v('AB'),bb))]);}
    case 45:return segmentIntervals(p('A'),p('B'),poly('CDE')).reduce((s,[a,bb])=>s+(bb-a)*ls('AB'),0);
    case 46:return b.extreme(segments,o=>dist(p('P'),foot(p('P'),...vertices(o) as [number[],number[]],'segment')));
    case 47:{if(!segments.length)throw new Error('No drawn segments are available.');const score=(o:typeof segments[number])=>{const [a,bb]=vertices(o);return near(a[0],bb[0])?Infinity:Math.abs((bb[1]-a[1])/(bb[0]-a[0]));};const scores=segments.map(score),max=Math.max(...scores);return b.list(segments.filter((_,i)=>scores[i]===max||near(scores[i],max)));}
    case 48:case 55:return bearing(v('AB'));
    case 49:return sub(p('A'),p('B')).reduce((s,x)=>s+Math.abs(x),0);
    case 50:return ls('AB')+ls('BC')-ls('AC');
    case 51:{const u=unit(v('AB'));return equation(mid(p('A'),p('B')),[-u[1],u[0]]);}
    case 52:return equation(p('P'),[1,n[0]]);
    case 53:return equation(p('P'),v('AB'));
    case 54:{const [x,y]=v('AB');return equation(p('P'),[-y,x]);}
    case 56:case 57:case 58:return b.list(lines.filter(o=>{const [a,bb]=vertices(o);if(id===58)return near(a[0],bb[0]);if(near(a[0],bb[0]))return false;return id===56?(bb[1]-a[1])/(bb[0]-a[0])>EPS:(bb[1]-a[1])/(bb[0]-a[0])<-EPS;}));
    case 59:case 60:{const result:string[]=[];lines.forEach((a,i)=>lines.slice(i+1).forEach(bb=>{const u=sub(vertices(a)[1],vertices(a)[0]),v=sub(vertices(bb)[1],vertices(bb)[0]);if((id===59?perpendicular:parallel)(u,v))result.push(`${a.label??a.id} and ${bb.label??bb.id}`);}));return result.join('; ')||'None';}
    case 61:case 62:{const [a,bb,cc]=selectedLines(3),x=lineHit(...a,...bb),y=lineHit(...bb,...cc),z=lineHit(...cc,...a);if(id===61)return !!x&&!!y&&!!z&&dist(x,y)<=EPS&&dist(y,z)<=EPS;if(!x||!y||!z||area([x,y,z])<=EPS)throw new Error('The selected lines do not form a nondegenerate triangle.');return [x,y,z];}
    case 63:{const a=determinant(p('C'),p('D'),p('A')),bb=determinant(p('C'),p('D'),p('B'));unit(v('CD'));return a*bb>EPS;}
    case 64:unit(v('AB'));return determinant(p('A'),p('B'),p('C'))*determinant(p('A'),p('B'),p('D'))<-EPS;
    case 65:{const x=lineHit(...b.pts('AB') as [number[],number[]],...b.pts('CD') as [number[],number[]]);if(!x)throw new Error('Intersecting lines are required.');const u=unit(v('AB')),w=unit(v('CD'));return [equation(x,add(u,w)),equation(x,sub(u,w))];}
    case 66:{const a=Math.acos(clamp(Math.abs(dot(unit(v('AB')),unit(v('CD'))))))*180/Math.PI;if(near(a,0))throw new Error('Parallel lines do not form an intersection angle.');return near(a,90)?'All four intersection angles are right angles.':`The two obtuse angles each measure ${180-a} degrees.`;}
    case 67:case 68:{const u=unit(sub(p('A'),p('B'))),w=unit(sub(p('C'),p('B'))),z=unit(sub(p('D'),p('B'))),adjacent=cross(w,u)*cross(w,z)<-EPS;return id===67?adjacent:adjacent&&near(dot(u,z),-1);}
    case 69:return near(dot(unit(v('BA')),unit(v('BD'))),-1)&&near(dot(unit(v('BC')),unit(v('BE'))),-1);
    case 70:return angle(...b.pts('ABC') as [number[],number[],number[]])+angle(...b.pts('CBD') as [number[],number[],number[]]);
    case 71:return angle(...b.pts('ABC') as [number[],number[],number[]])-angle(...b.pts('DEF') as [number[],number[],number[]]);
    case 72:case 73:{const u=unit(v('BA')),w=unit(v('BC')),theta=Math.acos(clamp(dot(u,w)));if(theta<=EPS||near(theta,Math.PI))throw new Error('A nonzero, non-straight angle is required.');const inWedge=(z:number[])=>Math.acos(clamp(dot(u,unit(z))))+Math.acos(clamp(dot(unit(z),w)))<=theta+EPS;
      if(id===73)return inWedge(v('BP'))&&!parallel(v('BP'),u)&&!parallel(v('BP'),w);
      return b.list(b.objects('ray').filter(o=>{const [a,bb]=vertices(o);return dist(a,p('B'))<=EPS&&inWedge(sub(bb,a))&&!parallel(sub(bb,a),u)&&!parallel(sub(bb,a),w);}));}
    case 74:case 75:{const delta=(bearing(v('BC'))-bearing(v('BA'))+360)%360;return id===75?delta:(360-delta)%360;}
    case 76:return centers().circumradius;
    case 77:return centers().inradius;
    case 78:tri();return dist(p('B'),mid(p('A'),p('C')));
    case 79:tri();return dist(p('A'),bisector(p('B'),p('A'),p('C')));
    case 80:return 2*area(tri())/ls('AB');
    case 81:tri();return foot(p('B'),p('A'),p('C'));
    case 82:tri();return onSegment(foot(p('A'),p('B'),p('C')),p('B'),p('C'))?'on segment BC':'on the extension of BC';
    case 83:return inside(centers().orthocenter,tri(),false);
    case 84:return !inside(centers().circumcenter,tri());
    case 85:{const {centroid:g,circumcenter:o,orthocenter:h}=centers();return dist(o,g)<=EPS&&dist(o,h)<=EPS||Math.abs(cross(sub(o,g),sub(h,g)))<=EPS;}
    case 86:{const g=centers().centroid,m=mid(p('B'),p('C'));return dist(g,p('A'))/dist(g,m);}
    case 87:tri();return bisector(p('A'),p('B'),p('C'));
    case 88:{tri();const x=bisector(p('B'),p('A'),p('C'));return near(dist(p('B'),x)/dist(x,p('C')),ls('AB')/ls('AC'));}
    case 89:return area(tri())/4;
    case 90:return polygonPerimeter(tri())/2;
    case 91:{const q=tri(),lengths=q.map((x,i)=>dist(x,q[(i+1)%3])),max=Math.max(...lengths);return lengths.flatMap((l,i)=>near(l,max)?[b.name('ABC'[i]).toUpperCase()+b.name('ABC'[(i+1)%3]).toUpperCase()]:[]);}
    case 92:return near(area(tri()),area(poly('ABD')));
    case 93:return area(tri())/area(poly('ADE'));
    case 94:return Math.sign(signedArea(tri()))===Math.sign(signedArea(poly('DEF')));
    case 95:return signedArea(tri())>0?'counterclockwise':'clockwise';
    case 96:{const g=centers().centroid;return b.extreme('ABC'.split('').map(k=>b.obj(k,'point')),o=>dist(o.position,g));}
    case 97:{const q=poly('DEF');return tri().every(x=>inside(x,q));}
    case 98:case 99:{const intersection=convexClip(tri(),poly('DEF')),a=intersection.length>=3?area(intersection):0;return id===98?a>EPS:a;}
    case 100:{if(points.length>100)throw new Error('Select a smaller board with at most 100 points for this search.');let max=-1,best:string[]=[];points.forEach((a,i)=>points.slice(i+1).forEach((bb,j)=>points.slice(i+j+2).forEach(cc=>{const value=area([a.position,bb.position,cc.position]);if(value>max+EPS){max=value;best=[];}if(near(value,max))best.push([a,bb,cc].map(o=>o.label??o.id).join(''));})));if(max<=EPS)throw new Error('At least three noncollinear points are required.');return {triangles:best,area:max};}
    case 101:{const q=c();return `(x - (${q.center[0]}))² + (y - (${q.center[1]}))² = ${q.radius**2}`;}
    case 102:return dist(p('P'),c().center)**2-c().radius**2;
    case 103:return Math.abs(dist(p('P'),c().center)-c().radius);
    case 104:return dist(p('P'),c().center)+c().radius;
    case 105:{const a=c(),bb=d(),distance=dist(a.center,bb.center);return Math.max(0,distance-a.radius-bb.radius,Math.abs(a.radius-bb.radius)-distance);}
    case 106:return dist(c().center,d().center)+c().radius<d().radius-EPS;
    case 107:{const a=c(),bb=d(),distance=dist(a.center,bb.center);return distance>a.radius+bb.radius+EPS||distance<Math.abs(a.radius-bb.radius)-EPS;}
    case 108:{const a=c(),bb=d(),distance=dist(a.center,bb.center);if(distance<=EPS&&near(a.radius,bb.radius))return 'Infinitely many';return commonTangents(a.center,a.radius,bb.center,bb.radius).length+commonTangents(a.center,a.radius,bb.center,bb.radius,true).length;}
    case 109:{const a=c(),bb=d(),u=mul(sub(bb.center,a.center),2),constant=dot(bb.center,bb.center)-dot(a.center,a.center)+a.radius*a.radius-bb.radius*bb.radius;if(norm(u)<=EPS)return near(constant,0)?'Every point has equal power: the circles coincide.':'No radical axis: concentric unequal circles.';return `${u[0]}x + ${u[1]}y = ${constant}`;}
    case 110:{const square=dist(p('P'),c().center)**2-c().radius**2;if(square<-EPS)throw new Error('A point inside the circle has no real tangent.');return Math.sqrt(Math.max(0,square));}
    case 111:return tangentContacts(p('P'),c().center,c().radius);
    case 112:return chord('AB')>chord('CD')+EPS;
    case 113:{const chords=segments.filter(o=>vertices(o).every(q=>onCircle(q)));return b.extreme(chords,o=>dist(c().center,foot(c().center,...vertices(o) as [number[],number[]])));}
    case 114:chord('AB');return dist(c().center,foot(c().center,p('A'),p('B')));
    case 115:chord('AB');return near(dist(foot(c().center,p('A'),p('B')),mid(p('A'),p('B'))),0);
    case 116:chord('AB');return angle(p('A'),c().center,p('B'));
    case 117:case 118:case 119:case 120:{const length=chord('AB'),theta=2*Math.asin(clamp(length/(2*c().radius),0,1));if(id===118&&dist(p('O'),c().center)>EPS)throw new Error('O must be the center of circle c.');return id===117?c().radius*(2*Math.PI-theta):id===118?.5*c().radius**2*(2*Math.PI-theta):id===119?.5*c().radius**2*(theta-Math.sin(theta)):theta*90/Math.PI;}
    case 121:return cyclic(poly('ABCD'));
    case 122:{const center=circumcenter(...tri() as [number[],number[],number[]]);return {center,radius:dist(center,p('A'))};}
    case 123:return lineCircle(p('A'),p('B'),c().center,c().radius).length===2;
    case 124:return circleOverlap(c().radius,d().radius,dist(c().center,d().center));
    case 125:return Math.PI*c().radius**2-circleOverlap(c().radius,d().radius,dist(c().center,d().center));
    case 126:{const q=poly('ABCD'),s=q.map((a,i)=>dist(a,q[(i+1)%4]));return near(s[0],s[1])&&near(s[2],s[3])||near(s[1],s[2])&&near(s[3],s[0]);}
    case 127:poly('ABCD');return parallel(v('AB'),v('CD'))!==parallel(v('BC'),v('DA'));
    case 128:{poly('ABCD');const first=parallel(v('AB'),v('CD')),second=parallel(v('BC'),v('DA'));return first!==second&&(first?near(ls('BC'),ls('DA')):near(ls('AB'),ls('CD')));}
    case 129:return cyclic(poly('ABCD'));
    case 130:{const as=interiorAngles(poly('ABCD'));return near(as[0]+as[2],180)&&near(as[1]+as[3],180);}
    case 131:poly('ABCD');if(!parallel(v('AB'),v('CD'))||!parallel(v('BC'),v('DA')))throw new Error('ABCD must be a parallelogram.');return dist(p('D'),foot(p('D'),p('A'),p('B')));
    case 132:{const q=poly('ABCD'),s=q.map((a,i)=>dist(a,q[(i+1)%4]));if(!s.every(x=>near(x,s[0])))throw new Error('ABCD must be a rhombus.');return ls('AC')*ls('BD')/2;}
    case 133:{poly('ABCD');const first=parallel(v('AB'),v('CD')),second=parallel(v('BC'),v('DA'));if(first===second)throw new Error('Specify a trapezoid with exactly one parallel pair.');return first?(ls('AB')+ls('CD'))/2:(ls('BC')+ls('DA'))/2;}
    case 134:case 135:{poly('ABCD');const x=lineHit(p('A'),p('C'),p('B'),p('D'));if(!x)throw new Error('The diagonals have no unique intersection.');if(id===134)return x;const denominator=dist(x,p('C'));if(denominator<=EPS)throw new Error('The division ratio has zero denominator.');return dist(p('A'),x)/denominator;}
    case 136:poly('ABCDEF');return 9;
    case 137:{const q=poly('ABCDE'),result:string[]=[];q.forEach((a,i)=>q.forEach((bb,j)=>{if(j<=i||j===(i+1)%5||i===(j+1)%5)return;const intervals=segmentIntervals(a,bb,q);if(near(intervals.reduce((s,[a,b])=>s+b-a,0),1))result.push(b.name('ABCDE'[i]).toUpperCase()+b.name('ABCDE'[j]).toUpperCase());}));return result;}
    case 138:return centroid(poly('ABCDE'));
    case 139:{const q=hull(points.map(o=>o.position));if(q.length<3)throw new Error('At least three noncollinear points are required.');return polygonPerimeter(q);}
    case 140:{const q=hull(points.map(o=>o.position));return b.list(points.filter(o=>q.some(p=>dist(p,o.position)<=EPS)));}
    case 141:{const q=hull(points.map(o=>o.position));if(q.length<3)return 'None';return b.list(points.filter(o=>inside(o.position,q,false)));}
    case 142:return poly('ABCDE').every(q=>dist(q,c().center)<=c().radius+EPS);
    case 143:return inside(c().center,poly('ABCDE'));
    case 144:case 145:case 146:{const q=poly('ABCDE'),xs=q.map(p=>p[0]),ys=q.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys),xx=Math.max(...xs),yy=Math.max(...ys);return id===145?xx-x:id===146?yy-y:[[x,y],[xx,y],[xx,yy],[x,yy]];}
    case 147:return signedArea(poly('ABCDE'));
    case 148:poly('ABCDE');return true;
    case 149:{const as=interiorAngles(poly('ABCDE')),min=Math.min(...as);return as.flatMap((a,i)=>near(a,min)?[b.name('ABCDE'[i]).toUpperCase()]:[]);}
    case 150:return Math.sign(signedArea(poly('ABCDE')))*360;
    case 151:return [p('A')[1],p('A')[0]];
    case 152:return [-p('B')[1],-p('B')[0]];
    case 153:return [2*n[0]-p('C')[0],p('C')[1]];
    case 154:return [p('D')[0],2*n[0]-p('D')[1]];
    case 155:return add(p('A'),v('CD'));
    case 156:return rotate(p('P'),p('B'),-n[0]);
    case 157:return add(p('C'),mul(sub(p('A'),p('C')),n[0]));
    case 158:{const a=sub(p('A'),p('O')),bb=sub(p('B'),p('O'));if(norm(a)<=EPS)return norm(bb)<=EPS?'Any scale factor fixes the center.':'No dilation moves its center.';const k=dot(a,bb)/dot(a,a);return dist(mul(a,k),bb)<=EPS?k:'No dilation centered at O maps A to B.';}
    case 159:case 160:{const a=poly('ABC'),bb=poly('DEF'),matches=bb.filter(q=>{const delta=sub(q,a[0]);return a.every(p=>bb.some(v=>dist(add(p,delta),v)<=EPS));});return id===159?matches.length>0:matches.length?b.list(matches.map(q=>'DEF'.split('').map(k=>b.obj(k,'point')).find(o=>dist(o.position,q)<=EPS)!)):'No translation maps these triangles.';}
    case 161:{const a=sub(p('A'),p('O')),bb=sub(p('B'),p('O'));if(!near(norm(a),norm(bb)))return 'No rotation about O maps A to B: the radii differ.';if(norm(a)<=EPS)return 'Every rotation fixes this point at O.';return (bearing(bb)-bearing(a)+360)%360;}
    case 162:unit(v('AB'));return true;
    case 163:return list(q=>onLine(q,p('C'),p('D')));
    case 164:return list(q=>near(dist(q,p('O')),0)||near(((n[0]%360)+360)%360,0));
    case 165:return mul(p('P'),-1);
    case 166:case 167:{const [[a,bb],[cc,dd]]=selectedLines(2),u=sub(bb,a),w=sub(dd,cc);if(id===166&&!parallel(u,w))throw new Error('Select two parallel lines in reflection order.');if(id===167&&parallel(u,w))throw new Error('Select two intersecting lines in reflection order.');if(id===166)return reflect(reflect(p('P'),a,bb),cc,dd);const center=lineHit(a,bb,cc,dd)!;return {center,degrees:(2*(bearing(w)-bearing(u))+720)%360,order:'first selected line, then second selected line'};}
    case 168:poly('ABC');if(near(n[0],0))throw new Error('A zero scale collapses the triangle.');return false;
    case 169:return Math.abs(n[0]);
    case 170:poly('ABC');return [-2,2];
    case 171:return mul(mid(p('A'),p('B')),-1);
    case 172:return -bearing(v('AB'));
    case 173:return {center:reflect(c().center,p('A'),p('B')),radius:c().radius};
    case 174:if(near(n[0],0))throw new Error('A zero dilation collapses a circle to a point.');return {center:add(p('P'),mul(sub(c().center,p('P')),n[0])),radius:c().radius*Math.abs(n[0])};
    case 175:return Math.sign(signedArea(tri()))===Math.sign(signedArea(poly('DEF')))?'orientation-preserving':'orientation-reversing';
    default:throw new Error('Unknown extended geometry query.');
  }
}
