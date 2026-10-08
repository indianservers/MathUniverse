import {operationFor} from './actionRegistry';
import {distance,vertices,measurement,center} from './geometryQueries';
import {near,nearVector,DISPLAY_EPSILON,EPSILON} from './tolerances';
import {RoboExecutionError} from './executionErrors';
import {resolveTarget,resolveTargets} from './targetResolver';
import type {MathRoboPlan,RoboSceneContext} from './types';
export function geometryState(scene:RoboSceneContext){
  const round=(n:number)=>Math.round(n*1e9)/1e9;
  return JSON.stringify([...scene.objects].sort((a,b)=>a.id.localeCompare(b.id)).map(o=>({id:o.id,type:o.type,vertices:vertices(o).map(p=>p.map(round)),position:center(o).map(round),width:round(o.command.width),height:round(o.command.height),depth:round(o.command.depth??0),radius:round(o.command.radius),scale:round(o.command.scale??1),rotation:(o.command.rotation??[0,0,0]).map(round),color:o.style.color,visible:o.command.roboVisible??true,expression:o.command.expression??null,locked:o.command.roboLocked??false})));
}
export function verifyResult(plan:MathRoboPlan,before:RoboSceneContext,after:RoboSceneContext){
  const checks:string[]=[];const fail=(message:string):never=>{throw new RoboExecutionError('VERIFICATION_FAILED',`I could not verify the result: ${message}`);};
  const mutates=plan.commands.some(c=>operationFor(c.action,c.subAction)?.mutatesScene);
  if(!mutates&&geometryState(before)!==geometryState(after))fail('a read-only request changed geometry.');
  if(!mutates)checks.push('Read-only geometry state unchanged');
  for(const object of after.objects){if(object.command.points.flat().some(n=>!Number.isFinite(n)))fail('non-finite coordinates.');if(object.command.radius<=0)fail('invalid radius.');if(['line','triangle'].includes(object.type)&&vertices(object).length<2)fail('missing vertices.');}
  checks.push('Finite geometry and valid dimensions');
  if(plan.commands.length===1){const c=plan.commands[0];
    if(c.action==='FIND'&&c.subAction==='DISTANCE'){
      const origin=/\bto (?:the )?origin\b/.test(c.normalizedPhrase),point=origin?resolveTarget({type:'point',reference:'lastReferenced'},before):undefined;
      const [a,b]=origin?[point!,{...point!,position:point!.position.map(()=>0)}]:resolveTargets(c.targets,c.target,before);let expected:number|undefined;
      if(a.type==='point'&&b.type==='point')expected=Math.hypot(...a.position.map((n,i)=>n-b.position[i]));
      if(a.type==='line'&&b.type==='line'&&a.mode.endsWith('2d')){const [p,q]=vertices(a),r=vertices(b)[0];expected=Math.abs((q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]))/Math.hypot(q[0]-p[0],q[1]-p[1]);}
      if(expected!==undefined){if(typeof after.previousResult!=='number'||!near(after.previousResult,expected,DISPLAY_EPSILON))fail('distance formula.');checks.push('Independent distance formula');}
    }
    if(c.action==='FIND'&&['AREA','VOLUME','LENGTH','RADIUS','DIAMETER','CIRCUMFERENCE'].includes(c.subAction)){
      const object=resolveTarget(c.target,before),v=vertices(object),q=object.command,scale=q.scale??1,r=q.radius*scale;let expected:number|undefined;
      if(c.subAction==='LENGTH'&&object.type==='line')expected=Math.hypot(...v[0].map((n,i)=>n-v[1][i]));
      if(['circle','sphere'].includes(object.type)){if(c.subAction==='RADIUS')expected=r;if(c.subAction==='DIAMETER')expected=2*r;if(c.subAction==='CIRCUMFERENCE')expected=2*Math.PI*r;}
      if(c.subAction==='AREA'){if(object.type==='circle')expected=Math.PI*r*r;else if(['triangle','rectangle','square','polygon'].includes(object.type)){const cross=v.reduce((sum,p,i)=>{const n=v[(i+1)%v.length];return [sum[0]+(p[1]*(n[2]??0)-(p[2]??0)*n[1]),sum[1]+((p[2]??0)*n[0]-p[0]*(n[2]??0)),sum[2]+p[0]*n[1]-n[0]*p[1]];},[0,0,0]);expected=Math.hypot(...cross)/2;}}
      if(c.subAction==='VOLUME'){if(object.type==='sphere')expected=4*Math.PI*r**3/3;if(['cube','cuboid'].includes(object.type))expected=q.width*q.height*(q.depth??q.width)*scale**3;if(object.type==='cylinder')expected=Math.PI*r*r*q.height*scale;if(object.type==='cone')expected=Math.PI*r*r*q.height*scale/3;}
      if(expected!==undefined){if(typeof after.previousResult!=='number'||!near(after.previousResult,expected,DISPLAY_EPSILON))fail('independent measurement formula.');checks.push(`Independent ${c.subAction.toLowerCase()} formula`);}
    }
    if(c.action==='CREATE'||c.action==='PLOT'){if(after.objects.length-before.objects.length!==Number(c.parameters.count??1))fail('creation count mismatch.');checks.push('Creation count');}
    if(c.action==='FIND'&&c.subAction==='MIDPOINT'){const object=resolveTarget(c.target,before),[a,b]=vertices(object),expected=a.map((n,i)=>(n+b[i])/2);if(!Array.isArray(after.previousResult)||!nearVector(after.previousResult as number[],expected))fail('incorrect midpoint.');checks.push('Midpoint formula');}
    if(['MOVE','ROTATE','REFLECT','SCALE','EXTEND'].includes(c.action)){
      const originals=c.parameters.multiple||c.targets?resolveTargets(c.targets,c.target,before):[resolveTarget(c.target,before)];for(const original of originals){const changed=after.objects.find(o=>o.id===original.id);if(!changed)fail('target disappeared.');
      if(c.action==='MOVE'){const vector=c.parameters.vector!,expected=c.parameters.absolute?vector:center(original).map((n,i)=>n+vector[i]);if(!nearVector(center(changed!),expected))fail('translation coordinates.');checks.push('Translation center');}
      if(['ROTATE','REFLECT'].includes(c.action)&&original.type!=='plot'){const kind=original.type==='line'?'LENGTH':original.type==='point'?undefined:original.mode.endsWith('3d')?'VOLUME':'AREA';if(kind)try{if(!near(Number(measurement(original,kind)),Number(measurement(changed!,kind)),DISPLAY_EPSILON))fail('isometry changed measurement.');}catch(error){if(error instanceof RoboExecutionError)throw error;}checks.push('Isometry invariant');}
      if(c.action==='SCALE'&&original.type==='line'&&!near(Number(measurement(changed!,'LENGTH')),Number(measurement(original,'LENGTH'))*Number(c.parameters.factor),DISPLAY_EPSILON))fail('scale invariant.');
      }
    }
    if(c.action==='CONSTRUCT'&&['PARALLEL','PERPENDICULAR','PERPENDICULAR_BISECTOR','NORMAL','TANGENT','ALTITUDE','MEDIAN'].includes(c.subAction)){
      const created=after.objects.filter(o=>!before.objects.some(old=>old.id===o.id)).at(-1),reference=resolveTarget(c.target,before);
      if(!created||created.type!=='line')fail('construction did not create a line.');const [a,b]=vertices(created!),u=b.map((n,i)=>n-a[i]);
      if(['PERPENDICULAR','PERPENDICULAR_BISECTOR','PARALLEL','NORMAL'].includes(c.subAction)){const [r,s]=vertices(reference),v=s.map((n,i)=>n-r[i]),value=c.subAction==='PARALLEL'?u[0]*v[1]-u[1]*v[0]:u.reduce((sum,n,i)=>sum+n*v[i],0);if(Math.abs(value)>DISPLAY_EPSILON*Math.hypot(...u)*Math.hypot(...v))fail('line direction relationship.');checks.push('Verified direction relationship');}
      if(c.subAction==='TANGENT'){const ctr=center(reference),radius=reference.command.radius*(reference.command.scale??1),t=a.map((n,i)=>(n+b[i])/2),radial=t.map((n,i)=>n-ctr[i]);if(!near(distance(t,ctr),radius,DISPLAY_EPSILON)||Math.abs(u.reduce((sum,n,i)=>sum+n*radial[i],0))>DISPLAY_EPSILON*Math.hypot(...u)*radius)fail('tangency condition.');checks.push('Verified radius and tangent orthogonality');}
      if(['MEDIAN','ALTITUDE'].includes(c.subAction)){
        const points=vertices(reference),index=c.parameters.from?reference.command.roboVertexLabels?.findIndex(label=>label.toLowerCase()===String(c.parameters.from).toLowerCase())??-1:0;
        if(index<0||!nearVector(a,points[index]))fail('construction starts at wrong vertex.');const p=points[(index+1)%3],q=points[(index+2)%3];
        if(c.subAction==='MEDIAN'&&!nearVector(b,p.map((n,i)=>(n+q[i])/2)))fail('median endpoint is not the opposite midpoint.');
        if(c.subAction==='ALTITUDE'){const edge=q.map((n,i)=>n-p[i]),cross=edge[0]*(b[1]-p[1])-edge[1]*(b[0]-p[0]);if(!near(cross,0,DISPLAY_EPSILON)||!near(u.reduce((sum,n,i)=>sum+n*edge[i],0),0,DISPLAY_EPSILON))fail('altitude endpoint or orthogonality.');}
        checks.push(`Independent ${c.subAction.toLowerCase()} endpoint check`);
      }
      if(Math.hypot(...u)<EPSILON)fail('degenerate construction.');
    }
  }
  return {passed:true,checks};
}
