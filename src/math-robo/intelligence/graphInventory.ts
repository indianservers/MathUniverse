import type {VisualCommand} from '../../offline-intelligence/commands';
/** A saved shape has several rendered equations but retains one semantic ID. */
export function restoredGraphInventory(rows:{id:string;input:string;color:string;visible:boolean;name?:string;roboCommand?:VisualCommand}[],known:(id:string)=>boolean):VisualCommand[]{
 const seen=new Set<string>(),commands:VisualCommand[]=[];
 for(const row of rows){
  if(known(row.id))continue;
  const command=row.roboCommand?{...row.roboCommand,objectId:row.roboCommand.objectId??row.id,roboVisible:row.visible,color:row.color}:graphCommand(row.id,row.input,row.color,row.visible,'2d',row.name);
  if(seen.has(command.objectId!))continue;seen.add(command.objectId!);commands.push(command);
 }
 return commands;
}
export function graphCommand(id:string,expression:string,color:string,visible:boolean,dimension:'2d'|'3d',label?:string,position:number[]=[0,0,0],rotation:number[]=[0,0,0],scale=1):VisualCommand{
  return {kind:'plot',objectId:id,expression,color,roboVisible:visible,roboLabel:label??id,roboNativeRow:true,dimension,points:[position.slice(0,dimension==='3d'?3:2)],rotation:rotation as [number,number,number],scale,width:6,height:4,radius:3,action:'create'};
}
