import {noEvidence,type VerificationEvidence} from '../../math-foundation/executionOutcome';
import {vertices,center} from './geometryQueries';
import {resolveTarget,resolveTargets} from './targetResolver';
import type {MathRoboPlan,RoboSceneContext} from './types';
/** Float coordinate invariants are numerical consistency, never symbolic proof. */
export function geometryEvidence(plan:MathRoboPlan,before:RoboSceneContext,after:RoboSceneContext):VerificationEvidence{
 if(plan.commands.length!==1)return noEvidence();const c=plan.commands[0];
 if(c.action==='FIND'&&c.subAction==='DISTANCE'&&!/\borigin\b/.test(c.normalizedPhrase)){
  const [a,b]=resolveTargets(c.targets,c.target,before);
  if(a?.type==='point'&&b?.type==='point'&&a.position.length===b.position.length&&[...a.position,...b.position].every(Number.isFinite)){
   const expected=Math.sqrt(a.position.reduce((sum,n,i)=>sum+(b.position[i]-n)**2,0)),actual=after.previousResult;
   const residual=typeof actual==='number'?Math.abs(actual-expected)/Math.max(1,expected):Infinity,passed=Number.isFinite(residual)&&residual<=1e-8;
   return {level:passed?'numerical_consistency':'contradicted',independent:true,passed,method:'Independent Euclidean distance formula checked against the live point coordinates',residual,assumptions:['Finite Euclidean coordinates; relative numerical tolerance 1e-8.'],...(!passed?{counterexample:{input:c,expected,actual,reason:'The reported distance does not match the selected point coordinates.'}}:{})};
  }
 }
 if(c.action!=='CHANGE'||c.subAction!=='SIDE')return noEvidence();
 const object=resolveTarget(c.target,before),updated=after.objects.find(o=>o.id===object.id);if(!updated)return noEvidence();
 const labels=object.command.roboVertexLabels??['A','B','C'],side=c.parameters.side as [string,string],i=labels.indexOf(side[0]),j=labels.indexOf(side[1]),k=[0,1,2].find(n=>n!==i&&n!==j)!;
 const a=vertices(object),b=vertices(updated),dist=(x:number[],y:number[])=>Math.hypot(...x.map((n,index)=>n-y[index]));const near=(x:number,y:number)=>Math.abs(x-y)<=1e-8*Math.max(1,Math.abs(x),Math.abs(y));
 let passed=near(dist(b[i],b[j]),Number(c.parameters.length))&&near(dist(a[i],b[i]),0);
 const u=a[j].map((n,index)=>n-a[i][index]),v=b[j].map((n,index)=>n-b[i][index]),cos=u.reduce((s,n,index)=>s+n*v[index],0)/(Math.hypot(...u)*Math.hypot(...v));passed&&=near(cos,1);
 if(c.parameters.sidePolicy==='fixed_third_vertex')passed&&=near(dist(a[k],b[k]),0);else passed&&=near(dist(a[i],a[k]),dist(b[i],b[k]))&&near(dist(a[j],a[k]),dist(b[j],b[k]));
 for(const child of after.objects.filter(o=>o.command.roboDependency?.kind==='circumcircle'&&o.command.roboDependency.parents.some(p=>p.objectId===object.id))){const origin=center(child),radius=child.command.radius*(child.command.scale??1);passed&&=vertices(updated).every(p=>near(dist(p,origin),radius));}
 return {level:passed?'numerical_consistency':'contradicted',independent:true,passed,method:'Independent side-length, anchored vertex, ray direction, retained-side and dependent circumcircle incidence invariants',assumptions:[],...(!passed?{counterexample:{input:c,expected:'Constraint satisfaction',actual:b,reason:'Edited triangle or its circumcircle violates the retained constraints.'}}:{})};
}
