import questions from './kidGeometry3d300.json';
import {matchKidGeometry3d} from './kidGeometry3dLanguage';
import type {SemanticRow} from './types';
export function kidGeometry3dTrainingRows():SemanticRow[]{
 return questions.map(row=>{
  const mode='geometry3d' as const;
  type ObjectRow=NonNullable<SemanticRow['context']>['objects'][number];
  const objects:ObjectRow[]=[];
  const add=(id:string,type:string,position:number[],parameters:SemanticRow['parameters']={},vertices?:number[][])=>objects.push({id,label:id,type,mode,position,vertices,radius:3,style:{color:type==='sphere'?'#3b82f6':type==='cone'?'#ef4444':'#22d3ee'},parameters:{width:4,height:6,depth:2,radius:3,roboExplicitVertices:true,...parameters}});
  add('Cube','cube',[0,0,0],{width:4,height:4,depth:4});add('Box','cuboid',[10,0,0],{width:6,height:4,depth:2});add('Sphere','sphere',[0,0,0]);
  add('Cylinder','cylinder',[0,10,0],{radius:2,height:5,rotation:[90,0,0]});add('Cone','cone',[0,0,10],{radius:3,height:6,rotation:[90,0,0]});add('Pyramid','pyramid',[10,10,0],{radius:2*Math.SQRT2,height:7,rotation:[90,0,0]});add('Prism','prism',[10,0,10],{radius:2,height:5,rotation:[90,0,0]});add('Tetra','tetrahedron',[0,0,0],{},[[0,0,0],[2,0,0],[0,3,0],[0,0,4]]);
  const coords:Record<string,number[]>={A:[2,0,0],B:[0,3,0],C:[0,0,4],D:[2,3,4]};for(const [name,position] of Object.entries(coords))add(name,'point',position);
  add('ABline','line',[0,0,0],{linearExtent:'line'},[[0,0,0],[4,0,0]]);add('OtherLine','line',[0,1,1],{linearExtent:'line'},[[0,1,1],[0,3,1]]);
  add('Arrow','vector',[0,0,0],{},[[0,0,0],[3,4,0]]);add('OtherArrow','vector',[0,0,0],{},[[0,0,0],[0,0,2]]);
  add('Triangle','triangle',coords.A,{},[coords.A,coords.B,coords.C]);add('Plane','plane',[0,0,0],{roboSemanticKind:'plane'},[[0,0,0],[4,0,0],[0,4,0]]);
  let selected=['Cube'];
  if(row.id<=29)objects.length=0;
  if([38,86].includes(row.id))selected=['A','B','C','D'];
  if(row.id===62)selected=['Cube','Sphere'];
  if(row.id===73)selected=['A','B'];
  if([118,139,140,256,257,258,259].includes(row.id)){add('Sphere2','sphere',[6,0,0],{radius:3});selected=['Sphere','Sphere2'];}
  if(row.id===143){add('Sphere2','sphere',[5,4,0]);add('Sphere3','sphere',[12,0,0]);selected=['Sphere','Sphere2','Sphere3'];}
  if([122,208].includes(row.id)){add('Box2','cuboid',[20,0,0],{width:6,height:4,depth:2});selected=['Box','Box2'];}
  if([135,153].includes(row.id)){add('Cube2','cube',[10,0,0],{width:2,height:2,depth:2});selected=['Cube','Cube2'];}
  if(row.id===144){add('Cube2','cube',[12,0,0]);add('Cube3','cube',[25,0,0]);}
  if(row.id===151)selected=['Triangle'];
  if(row.id===185)selected=['Cone'];
  if(row.id===197)objects.find(o=>o.id==='Cone')!.parameters!.roboVisible=false;
  if(row.id===200)objects.find(o=>o.id==='Cube')!.parameters!.roboLocked=true;
  if([210].includes(row.id))selected=['Pyramid'];
  if([213,214,215].includes(row.id))selected=['Arrow'];
  if([229,230,237,238,260,261,262].includes(row.id))selected=['ABline'];
  if([216,218,219,220,221,222].includes(row.id))selected=['Arrow','OtherArrow'];
  if([224,225,226,227,228].includes(row.id))selected=['ABline','OtherLine'];
  if([241,242,243,244].includes(row.id)){add('Plane2','plane',[0,0,0],{roboSemanticKind:'plane'},[[0,0,0],[4,0,0],[0,0,4]]);selected=['Plane','Plane2'];}
  if(row.id===250)objects.find(o=>o.id==='Plane')!.label='Slicing plane';
  if(row.id===255)selected=['B'];
  if(row.id===283){selected=['A','B','C'];for(const [i,name] of ['A','B','C'].entries())objects.find(o=>o.id===name)!.position=[i,0,0];}
  if(row.id===284)selected=['A'];
  if(row.id===286)objects.splice(objects.findIndex(o=>o.id==='Cone'),1);
  if(row.id===287)selected=[];
  if(row.id===288)objects.find(o=>o.id==='Cube')!.parameters!.roboLocked=true;
  if(row.id===296)selected=['Sphere'];
  let action=row.mutates?'CONSTRUCT':'FIND',subAction='KID_3D';
  if([149,150,153,292].includes(row.id)){action='ROTATE';subAction='OBJECT';}
  if(row.id===291){action='SCALE';subAction='UNIFORM';}
  if([136,270,280].includes(row.id)){action='MOVE';subAction='OBJECT';}
  if([169,188].includes(row.id)){action='CHANGE';subAction=row.id===169?'WIDTH':'OPACITY';}
  if([293,294,295].includes(row.id)){action=row.id===294?'REDO':'UNDO';subAction='LAST';}
  const lesson=matchKidGeometry3d(row.question)!;
  return {phrase:row.question,mode,action,subAction,expectedStatus:row.status as SemanticRow['expectedStatus'],parameters:{kid3d:lesson,...(row.id===149?{angle:lesson.numbers[0]}:{}),...([149,150,153,292].includes(row.id)?{kidRequireAxis:true}:{}),...(row.id===153?{multiple:true,anchor:'origin'}:{}),...(row.id===169?{kidRequireWidth:true}:{})},context:{objects,selected,lastReferenced:'Cube',activeObjectIds:['Cube']},source:'kid-geometry3d-300',group:`kid-geometry3d:${lesson.id}`};
 });
}
