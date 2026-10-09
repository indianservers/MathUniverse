import {vertices} from './geometryQueries';
import type {RoboObjectDescriptor} from './types';
export type TriangleSidePolicy='fixed_third_vertex'|'preserve_other_sides';
export type TriangleSideEdit={side:[string,string];length:number;policy:TriangleSidePolicy};
export function triangleSideVertices(object:RoboObjectDescriptor,edit:TriangleSideEdit):number[][]{
 if(object.command.roboDependency)throw new Error('UNSUPPORTED: Edit the parent points of a constrained triangle; side edits cannot discard its dependency.');
 if(!['fixed_third_vertex','preserve_other_sides'].includes(edit.policy))throw new Error('Choose explicit side constraints.');
 if(object.type!=='triangle')throw new Error('Side edits require a triangle.');
 const points=vertices(object).map(p=>[...p]),labels=object.command.roboVertexLabels??['A','B','C'];
 const i=labels.findIndex(label=>label.toLowerCase()===edit.side[0].toLowerCase()),j=labels.findIndex(label=>label.toLowerCase()===edit.side[1].toLowerCase()),k=[0,1,2].find(index=>index!==i&&index!==j);
 if(points.length!==3||i<0||j<0||i===j||k===undefined)throw new Error('Specify two distinct named vertices of this triangle.');
 if(!Number.isFinite(edit.length)||edit.length<=0||edit.length>10000)throw new Error('Side length must be positive and no greater than 10,000.');
 const a=points[i],b=points[j],c=points[k],difference=b.map((n,index)=>n-a[index]),oldLength=Math.hypot(...difference);
 if(oldLength<=1e-12)throw new Error('The side is degenerate.');
 const u=difference.map(n=>n/oldLength),projection=c.reduce((sum,n,index)=>sum+(n-a[index])*u[index],0),perpendicular=c.map((n,index)=>n-a[index]-projection*u[index]),height=Math.hypot(...perpendicular);
 if(height<=1e-10*Math.max(1,oldLength))throw new Error('The original triangle is collinear or numerically ill-conditioned.');
 points[j]=a.map((n,index)=>n+edit.length*u[index]);
 if(edit.policy==='preserve_other_sides'){
  const ac=Math.hypot(...c.map((n,index)=>n-a[index])),bc=Math.hypot(...c.map((n,index)=>n-b[index]));
  if(edit.length>=ac+bc||edit.length<=Math.abs(ac-bc))throw new Error('The requested side contradicts the strict triangle inequalities.');
  const x=(ac*ac+edit.length*edit.length-bc*bc)/(2*edit.length),ySquared=ac*ac-x*x;
  if(ySquared<=1e-12*Math.max(1,ac*ac))throw new Error('The requested triangle is degenerate or ill-conditioned.');
  points[k]=a.map((n,index)=>n+x*u[index]+Math.sqrt(ySquared)*perpendicular[index]/height);
 }else if(edit.policy!=='fixed_third_vertex')throw new Error('An explicit side-edit constraint policy is required.');
 return points;
}
