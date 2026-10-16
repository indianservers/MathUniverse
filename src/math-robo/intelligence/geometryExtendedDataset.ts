import curriculum from './geometryQuestions250.json';
import {matchExtendedGeometry} from './geometryExtendedCurriculum';
import type {SemanticRow} from './types';

/** Read-only example scenes; these never contain executable setup instructions. */
export function extendedGeometryTrainingRows():SemanticRow[]{
  return curriculum.map(row=>{
    const three=row.id>=226,mode=three?'geometry3d' as const:'geometry2d' as const;
    const positions:Record<string,number[]>=three?{A:[0,0,0],B:[4,0,0],C:[0,3,0],D:[0,0,6],E:[4,3,2],F:[1,2,5],P:[1,1,1],O:[0,0,0]}:{A:[0,0],B:[6,0],C:[6,8],D:[0,8],E:[-2,4],F:[3,4],M:[3,8],P:[3,2],Q:[5,3],O:[3,4]};
    if(row.id===14)Object.assign(positions,{B:[4,0],C:[4,4],D:[0,4]});
    if(row.id===44)Object.assign(positions,{C:[2,-1],D:[4,-1],E:[4,1],F:[2,1]});
    if([65,66,167].includes(row.id))Object.assign(positions,{C:[3,-2],D:[3,2]});
    if([110,111,182].includes(row.id))positions.P=[13,4];
    if(row.id===128||row.id===133)Object.assign(positions,{C:[4,4],D:[2,4]});
    if(row.id===132)Object.assign(positions,{B:[3,4],C:[6,0],D:[3,-4]});
    const object=(label:string,type:string,position:number[],vertices?:number[][],parameters:SemanticRow['parameters']={})=>({id:label,label,type,mode,position,vertices,radius:5,style:{color:'#22d3ee'},parameters});
    const objects:NonNullable<SemanticRow['context']>['objects']=Object.entries(positions).map(([label,position])=>object(label,'point',position));
    if(three){
      objects.push(object('s','sphere',[0,0,0],undefined,{radius:2}),object('t','sphere',[2,0,0],undefined,{radius:2}),object('box','cuboid',[0,0,0],undefined,{width:2,height:4,depth:6}),object('cube','cube',[0,0,0],undefined,{width:4,height:4,depth:4}));
    }else{
      objects.push(object('c','circle',[3,4],undefined,{radius:5}),object('d','circle',[13,4],undefined,{radius:5}));
      for(const label of ['AB','CD'])objects.push(object(label,'line',positions[label[0]],label.split('').map(k=>positions[k]),{linearExtent:'segment',roboExplicitVertices:true,roboVertexLabels:label.split('')}));
      objects.push(object('l3','line',[0,0],[[0,0],[0,8]],{roboExplicitVertices:true}),object('l4','line',[6,0],[[6,0],[0,8]],{roboExplicitVertices:true}),object('BP','ray',positions.B,[positions.B,positions.P],{roboExplicitVertices:true}));
      objects.push(object('ABC','triangle',positions.A,['A','B','C'].map(k=>positions[k]),{roboExplicitVertices:true,roboVertexLabels:['A','B','C']}));
    }
    const selected=row.id===176?['A','B']:row.id===61||row.id===62?['AB','l3','l4']:row.id===166||row.id===167?['AB','CD']:row.id===244?['box']:row.id===246?['cube']:row.id===250?['s','t']:[];
    return {phrase:row.question,mode,action:row.mutates?'CONSTRUCT':'FIND',subAction:'BOARD_ADVANCED',parameters:{extendedLesson:matchExtendedGeometry(row.question)},context:{objects,selected},source:'user-geometry-250',group:`geometry-250:${row.id}`};
  });
}
