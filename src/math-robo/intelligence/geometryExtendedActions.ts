import {GeometryBoard} from './geometryBoard';
import {add,sub,mul,unit,dist,mid,dot,cross,EPS,near,foot,area,rotate,hull,lineCircle,circleCircle} from './geometryAnalyticMath';
import {constraintSide,type AnalyticConstraint} from './analyticConstraints';
import {commonTangents,tangentContacts,triangleCenters} from './geometryExtendedQueries';
import {ResolutionError} from './targetResolver';

export function extendedAction(b:GeometryBoard):unknown{
  const {id,numbers:n}=b.lesson,p=b.point,poly=b.poly,v=(keys:string)=>sub(p(keys[1]),p(keys[0])),c=()=>b.circle('c');
  const line=(a:number[],bb:number[],segment=false)=>{unit(sub(bb,a));return b.make('line',[a,bb],{linearExtent:segment?'segment':'line'});};
  const circle=(center:number[],radius:number)=>{if(radius<=EPS)throw new Error('A positive radius is required.');return b.make('circle',[center],{radius});};
  const constrain=(key:string,rule:AnalyticConstraint)=>{b.update(key,p(key),rule);return 'A persistent constraint has been applied. The current point is projected onto its permitted locus.';};
  switch(id){
    case 176:{const [a,bb]=b.selected('point',2);line(a.position,bb.position);return [a.position,bb.position];}
    case 177:unit(v('CD'));b.make('ray',b.pts('CD'));return b.pts('CD');
    case 178:{unit(v('AB'));const points=[p('A'),p('B'),rotate(p('B'),p('A'),60)];b.make('triangle',points);return points;}
    case 179:case 180:{const a=p('A'),bb=p('B'),[x,y]=unit(v('AB')),height=id===179?dist(a,bb):n[0];if(height<=0)throw new Error('A positive height is required.');const shift=mul([-y,x],height),points=[a,bb,add(bb,shift),add(a,shift)];b.make(id===179?'square':'rectangle',points);return points;}
    case 181:{if(dist(p('A'),p('O'))<=EPS)throw new Error('The polygon vertex must differ from its center.');const points=Array.from({length:5},(_,i)=>rotate(p('A'),p('O'),i*72));b.make('polygon',points);return points;}
    case 182:{const q=c(),contacts=tangentContacts(p('P'),q.center,q.radius);if(near(dist(p('P'),q.center),q.radius))throw new Error('P is on the circle; there is one tangent rather than two.');contacts.forEach(q=>line(p('P'),q));return contacts;}
    case 183:{const q=c(),a=p('A');if(!near(dist(a,q.center),q.radius))throw new Error('A must lie on circle c.');const [x,y]=unit(sub(a,q.center));line(a,add(a,[-y,x]));return a;}
    case 184:case 185:{const a=c(),bb=b.circle('d'),tangents=commonTangents(a.center,a.radius,bb.center,bb.radius,id===185);if(!tangents.length)throw new Error('These circles have no common tangents of the requested type.');tangents.forEach(([a,b])=>line(a,b));return tangents;}
    case 186:{const center=mid(p('A'),p('B')),radius=dist(p('A'),p('B'))/2;circle(center,radius);return {center,radius};}
    case 187:{const center=p('P'),radius=dist(center,foot(center,p('A'),p('B')));circle(center,radius);return {center,radius};}
    case 188:circle(p('A'),c().radius);return {center:p('A'),radius:c().radius};
    case 189:case 190:{const q=c(),points=lineCircle([0,0],id===189?[1,0]:[0,1],q.center,q.radius);if(!points.length)return 'The circle does not meet this axis; no points were created.';points.forEach(p=>b.make('point',[p]));return points;}
    case 191:{unit(v('AB'));const count=5,points=Array.from({length:count-1},(_,i)=>add(p('A'),mul(v('AB'),(i+1)/count)));points.forEach(p=>b.make('point',[p]));return points;}
    case 192:{poly('ABC');const origin=p('B'),u=unit(sub(unit(v('BA')),unit(v('BC'))));line(origin,add(origin,u));return origin;}
    case 193:{const points=poly('ABC'),feet=points.map((a,i)=>foot(a,points[(i+1)%3],points[(i+2)%3]));points.forEach((p,i)=>{if(dist(p,feet[i])<=EPS)throw new Error('A degenerate altitude cannot be drawn.');line(p,feet[i]);});return feet;}
    case 194:{const centers=triangleCenters(poly('ABC'));if(dist(centers.circumcenter,centers.orthocenter)<=EPS)throw new Error('The centers coincide; an equilateral triangle has no unique Euler line.');line(centers.circumcenter,centers.orthocenter);return [centers.circumcenter,centers.orthocenter];}
    case 195:{const centers=triangleCenters(poly('ABC')),center=mid(centers.circumcenter,centers.orthocenter),radius=centers.circumradius/2;circle(center,radius);return {center,radius};}
    case 196:{const points=poly('ABC'),midpoints=points.map((a,i)=>mid(a,points[(i+1)%3]));b.make('triangle',midpoints);return midpoints;}
    case 197:{poly('ABC');const d=add(p('A'),v('BC')),points=[p('A'),p('B'),p('C'),d];b.make('polygon',points);return points;}
    case 198:{const points=poly('ABCDE').map(q=>add(q,v('PQ')));b.make('polygon',points);return points;}
    case 199:{const points=hull(b.objects('point').map(o=>o.position));if(points.length<3)throw new Error('At least three noncollinear points are required.');b.make('polygon',points);return points;}
    case 200:{const q=c(),u=unit(v('AB')),points=[add(q.center,mul(u,q.radius)),sub(q.center,mul(u,q.radius))];points.forEach(p=>b.make('point',[p]));return points;}
    case 201:{const a=p('A'),bb=p('B'),r=n[0];if(!near(a[1],0))throw new Error('A must already lie on the x-axis for this movement.');if(r<=0||Math.abs(bb[1])>r+EPS)throw new Error('No such position on the x-axis exists.');const x=Math.sqrt(Math.max(0,r*r-bb[1]*bb[1])),solutions=[[bb[0]-x,0],[bb[0]+x,0]].filter((q,i,list)=>!i||dist(q,list[0])>EPS);
      const scores=solutions.map(q=>dist(q,a)),min=Math.min(...scores),best=solutions.filter((_,i)=>near(scores[i],min));if(best.length!==1)throw new ResolutionError(solutions.map(q=>`(${q.join(', ')})`),'Two equally near valid positions exist. Specify the desired destination for A.');b.update('A',best[0]);return best[0];}
    case 202:{const position=foot(p('P'),p('A'),p('B'));b.update('P',position);return position;}
    case 203:{const q=c(),position=add(q.center,mul(unit(sub(p('P'),q.center)),q.radius));b.update('P',position);return position;}
    case 204:if(n[0]<=0)throw new Error('The fixed distance must be positive.');return constrain('B',{kind:'distance',parents:b.refs('A'),length:n[0]});
    case 205:unit(v('AB'));return constrain('C',{kind:'equidistant',parents:b.refs('AB')});
    case 206:{const center=mid(p('A'),p('B')),u=unit(sub(p('C'),center));if(Math.abs(cross(v('AB'),u))<=EPS)throw new ResolutionError(b.refs('ABC'),'Choose a position above or below AB; collinear positions cannot make a nondegenerate right triangle.');return constrain('C',{kind:'rightAngle',parents:b.refs('AB')});}
    case 207:{unit(v('AB'));const sign=Math.sign(cross(v('AB'),sub(p('C'),p('A'))));if(!sign)throw new ResolutionError(b.refs('ABC'),'Two equilateral positions exist. Specify which side of AB should contain C.');const position=rotate(p('B'),p('A'),sign*60);b.update('C',position);return position;}
    case 208:poly('ABC');return constrain('C',{kind:'line',parents:[],anchor:[...p('C')],direction:unit(v('AB'))});
    case 209:return constrain('B',{kind:'distance',parents:b.refs('A'),length:dist(p('A'),p('B'))});
    case 210:unit(v('AB'));return constrain('P',{kind:'line',parents:b.refs('AB'),segment:true});
    case 211:return constrain('P',{kind:'circle',parents:[c().object.id]});
    case 212:case 213:{const u=unit(v('CD')),direction=id===213?[-u[1],u[0]]:u,sign=dot(v('AB'),direction)<0?-1:1;return constrain('B',{kind:'parallelEndpoint',parents:b.refs('ACD'),length:dist(p('A'),p('B')),perpendicular:id===213,sign});}
    case 214:{const q=c(),rule:AnalyticConstraint={kind:'tangentCircle',parents:b.refs('AB'),sign:constraintSide(q.center,p('A'),p('B'))};b.update('c',q.center,rule,'circle');return 'The circle center is constrained to remain one radius from AB.';}
    case 215:if(n[0]<=0)throw new Error('A positive distance is required.');p('P');circle(p('A'),n[0]);return {locus:'circle',center:p('A'),radius:n[0]};
    case 216:{const center=mid(p('A'),p('B')),[x,y]=unit(v('AB'));line(center,add(center,[-y,x]));return {locus:'perpendicular bisector',point:center,direction:[-y,x]};}
    case 217:{p('B');const q=c(),center=mid(p('A'),q.center),radius=q.radius/2;circle(center,radius);return {locus:'circle',center,radius,assumption:'B ranges over circle c; A stays fixed.'};}
    case 218:{poly('ABC');const derivative=(p('B')[0]-p('A')[0])/2,sign=Math.sign(cross(v('AB'),sub(p('C'),p('A'))));return {currentArea:area(poly('ABC')),areaChangePerUnitUpward:sign*derivative,formula:'Area after upward displacement t = |cross(B-A, C-A) + (Bx-Ax)t|/2; the rate reverses when C crosses AB.'};}
    case 219:poly('ABC');return 'Side lengths, perimeter, area, angles, orientation, parallelism, and relative positions stay unchanged. Absolute coordinates change.';
    case 220:poly('ABC');return 'For horizontal scale k: x-differences multiply by k and area by |k|. A side (dx,dy) becomes sqrt(k²dx²+dy²); perimeter and angles generally change. Vertical side lengths stay unchanged.';
    case 221:poly('ABC');return 'It generally moves. If the moving vertex stays on the same circumcircle and the vertices remain noncollinear, the circumcenter stays fixed.';
    case 222:poly('ABC');return 'As three distinct vertices approach a collinear configuration, the circumradius grows without bound. At exact collinearity there is no unique circumcircle.';
    case 223:{const a=p('A'),bb=p('B'),cc=p('C'),dd=p('D'),u=sub(bb,a),w=sub(dd,cc);unit(u);unit(w);return [1,-1].map(sign=>{const normal=sub([-u[1],u[0]],mul([-w[1],w[0]],sign)),constant=dot([-u[1],u[0]],a)-sign*dot([-w[1],w[0]],cc);return near(norm2(normal),0)?near(constant,0)?'Every point satisfies this branch.':'No points satisfy this branch.':`${normal[0]}x + ${normal[1]}y = ${constant}`;});}
    case 224:return lineCircle(p('A'),p('B'),c().center,c().radius).length>0;
    case 225:{const [r,s]=n;if(r<=0||s<=0)throw new Error('Positive distances are required.');if(dist(p('A'),p('B'))<=EPS&&near(r,s))return 'Infinitely many';return circleCircle(p('A'),r,p('B'),s).length;}
    default:throw new Error('Unknown geometry action.');
  }
}
const norm2=(a:number[])=>Math.hypot(...a);
