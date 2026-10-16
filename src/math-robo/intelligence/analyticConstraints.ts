import {add,sub,mul,unit,mid,dist,foot,dot,cross,near,EPS} from './geometryAnalyticMath';
import {describeObject} from './sceneContext';
import {resolveTarget} from './targetResolver';
import type {RoboSceneContext,RoboObjectDescriptor} from './types';
import type {VisualCommand} from '../../offline-intelligence/commands';
export type AnalyticConstraint={kind:'line'|'circle'|'distance'|'equidistant'|'rightAngle'|'parallelEndpoint'|'tangentCircle';parents:string[];length?:number;segment?:boolean;anchor?:number[];direction?:number[];perpendicular?:boolean;sign?:number};
export function analyticParentIds(object:RoboObjectDescriptor,scene:Pick<RoboSceneContext,'objects'>):string[]{
  return (object.command.roboAnalyticConstraint?.parents??[]).map(ref=>{
    const exact=scene.objects.find(o=>o.id===ref);if(exact)return exact.id;
    const matches=scene.objects.filter(o=>o.label?.toLowerCase()===ref.toLowerCase()||o.command.roboVertexLabels?.some(label=>label.toLowerCase()===ref.toLowerCase()));
    if(matches.length!==1)throw new Error(`The analytic constraint parent ${ref} is missing or ambiguous.`);return matches[0].id;
  });
}
/** Re-evaluate durable constraints in dependency order before committing geometry. */
export function refreshAnalyticConstraints(scene:RoboSceneContext):VisualCommand[]{
  const effects:VisualCommand[]=[],done=new Set<string>(),visiting=new Set<string>();
  const visit=(id:string)=>{
    if(done.has(id))return;if(visiting.has(id))throw new Error('The analytic constraints contain a dependency cycle.');
    const object=scene.objects.find(o=>o.id===id);if(!object)return;
    visiting.add(id);const rule=object.command.roboAnalyticConstraint;
    if(rule){const parents=rule.parents.map(ref=>scene.objects.find(o=>o.id===ref)??resolveTarget(ref,scene));parents.forEach(p=>visit(p.id));
      if(parents.some(p=>p.command.roboVisible===false||p.command.roboDefinitionState&&p.command.roboDefinitionState.status!=='defined'))throw new Error('A constrained object needs visible, defined parents.');
      const p=parents.map(p=>p.position),current=object.position;let next:number[];
      if(rule.kind==='line')next=rule.anchor&&rule.direction?foot(current,rule.anchor,add(rule.anchor,rule.direction)):foot(current,p[0],p[1],rule.segment?'segment':'line');
      else if(rule.kind==='equidistant'){const m=mid(p[0],p[1]),u=unit(sub(p[1],p[0]));next=foot(current,m,add(m,[-u[1],u[0]]));}
      else if(rule.kind==='parallelEndpoint'){let u=unit(sub(p[2],p[1]));if(rule.perpendicular)u=[-u[1],u[0]];next=add(p[0],mul(u,rule.length!*(rule.sign??1)));}
      else if(rule.kind==='tangentCircle'){const u=unit(sub(p[1],p[0])),normal=[-u[1],u[0]],f=foot(current,p[0],p[1]);next=add(f,mul(normal,object.command.radius*(object.command.scale??1)*(rule.sign??1)));}
      else {const center=rule.kind==='rightAngle'?mid(p[0],p[1]):p[0],radius=rule.kind==='rightAngle'?dist(p[0],p[1])/2:rule.kind==='circle'?parents[0].command.radius*(parents[0].command.scale??1):rule.length!;
        if(radius<=EPS)throw new Error('A circular constraint needs a positive radius.');
        let direction=sub(current,center);if(dist(current,center)<=EPS){if(!rule.direction)throw new Error('Specify a direction from the center for this circular constraint.');direction=rule.direction;}
        next=add(center,mul(unit(direction),radius));
      }
      if(next.some(x=>!Number.isFinite(x)))throw new Error('The constraint produced undefined coordinates.');
      if(dist(next,current)>EPS){if(object.command.roboLocked)throw new Error('Unlock the constrained object before moving its parents.');const command:VisualCommand={...object.command,points:[next],action:'update',roboExplicitVertices:true};Object.assign(object,describeObject(command,scene.activeMode));effects.push(command);}
    }
    visiting.delete(id);done.add(id);
  };
  scene.objects.forEach(o=>visit(o.id));
  // Canvas shapes share native point IDs; authored shapes may instead share labels.
  if(scene.objects.some(o=>o.command.roboAnalyticConstraint)){
    for(const o of scene.objects.filter(o=>o.type==='circle'&&o.command.roboAnalyticConstraint)){
      const id=o.command.roboNativeIds?.points[0],parent=scene.objects.find(p=>p.type==='point'&&p.command.roboNativeIds?.points[0]===id);
      if(id&&parent&&dist(parent.position,o.position)>EPS){const command={...parent.command,points:[[...o.position]],action:'update' as const};Object.assign(parent,describeObject(command,scene.activeMode));effects.push(command);}
      const edgeId=o.command.roboNativeIds?.points[1],edge=scene.objects.find(p=>p.type==='point'&&(p.id===edgeId||p.command.roboNativeIds?.points[0]===edgeId)),position=[o.position[0]+o.command.radius*(o.command.scale??1),o.position[1]];
      if(edgeId&&edge&&dist(edge.position,position)>EPS){const command={...edge.command,points:[position],action:'update' as const};Object.assign(edge,describeObject(command,scene.activeMode));effects.push(command);}
    }
    for(const o of scene.objects){const labels=o.command.roboVertexLabels,ids=o.command.roboNativeIds?.points;if(o.type==='point'||!ids&&!labels)continue;
    const points=ids?ids.map(id=>scene.objects.find(p=>p.type==='point'&&(p.id===id||p.command.roboNativeIds?.points[0]===id))?.position):labels!.map(label=>scene.objects.find(p=>p.type==='point'&&p.label?.toLowerCase()===label.toLowerCase())?.position);
    if(points.some(p=>!p))continue;
    if(o.type==='circle'){
      if(points.length!==2)continue;const radius=dist(points[0]!,points[1]!);if(radius<=EPS)throw new Error('A shared circle has collapsed to zero radius.');
      if(dist(points[0]!,o.position)>EPS||!near(radius,o.command.radius*(o.command.scale??1))){const command={...o.command,points:[points[0]!],radius,scale:1,action:'update' as const};Object.assign(o,describeObject(command,scene.activeMode));effects.push(command);}continue;
    }
    if(points.length!==o.command.points.length)continue;
    if(points.some((p,i)=>dist(p!,o.command.points[i])>EPS)){const command={...o.command,points:points as number[][],action:'update' as const,rotation:[0,0,0] as [number,number,number],scale:1,roboExplicitVertices:true};Object.assign(o,describeObject(command,scene.activeMode));effects.push(command);}
    }
  }
  return effects;
}

export const constraintSide=(p:number[],a:number[],b:number[])=>dot(sub(p,a),[-unit(sub(b,a))[1],unit(sub(b,a))[0]])<0?-1:1;

export function checkAnalyticConstraints(scene:RoboSceneContext):string[]{
  const checks:string[]=[];
  for(const o of scene.objects){const rule=o.command.roboAnalyticConstraint;if(!rule)continue;
    const parents=rule.parents.map(id=>scene.objects.find(p=>p.id===id)??resolveTarget(id,scene)),p=parents.map(p=>p.position),q=o.position;let passed=false;
    if(rule.kind==='line'){const a=rule.anchor??p[0],b=rule.direction?add(a,rule.direction):p[1];passed=dist(q,foot(q,a,b,rule.segment?'segment':'line'))<=EPS;}
    else if(rule.kind==='equidistant')passed=near(dist(q,p[0]),dist(q,p[1]));
    else if(rule.kind==='rightAngle')passed=dist(q,p[0])>EPS&&dist(q,p[1])>EPS&&Math.abs(dot(unit(sub(q,p[0])),unit(sub(q,p[1]))))<=EPS;
    else if(rule.kind==='parallelEndpoint'){const a=unit(sub(q,p[0])),b=unit(sub(p[2],p[1]));passed=near(dist(q,p[0]),rule.length!)&&(rule.perpendicular?Math.abs(dot(a,b))<=EPS:Math.abs(cross(a,b))<=EPS);}
    else if(rule.kind==='tangentCircle')passed=near(dist(q,foot(q,p[0],p[1])),o.command.radius*(o.command.scale??1));
    else passed=near(dist(q,p[0]),rule.kind==='circle'?parents[0].command.radius*(parents[0].command.scale??1):rule.length!);
    if(!passed)throw new Error(`The ${rule.kind} constraint on ${o.label??o.id} failed its geometric check.`);
    checks.push(`Independent ${rule.kind} constraint residual`);
  }return checks;
}
