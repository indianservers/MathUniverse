import type {VisualCommand} from '../../offline-intelligence/commands';
export function graphCommand(id:string,expression:string,color:string,visible:boolean,dimension:'2d'|'3d',label?:string,position:number[]=[0,0,0],rotation:number[]=[0,0,0],scale=1):VisualCommand{
  return {kind:'plot',objectId:id,expression,color,roboVisible:visible,roboLabel:label??id,roboNativeRow:true,dimension,points:[position.slice(0,dimension==='3d'?3:2)],rotation:rotation as [number,number,number],scale,width:6,height:4,radius:3,action:'create'};
}
