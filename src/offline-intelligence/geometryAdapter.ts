import type { Construction } from '../workspace/geometryCommandController';
import { outlineVertices, type VisualCommand } from './commands';
import { compileFunctionExpression } from '../utils/functionParser';

export function addIntelligenceGeometry<T extends Pick<Construction, 'points' | 'lines' | 'circles' | 'polygons' | 'loci'>>(current: T, command: VisualCommand): T {
  const next=addGeometry(current,command);
  if(command.roboControl==='delete')return next;
  const id=command.roboNativeIds?.shape??(command.kind==='point'?(command.roboNativeIds?.points[0]??`${command.objectId}-p0`):`${command.objectId}-shape`);
  const stamp=<TItem extends {id:string;style?:object}>(items:TItem[])=>items.map(item=>item.id===id?{...item,style:{...item.style,color:command.roboStrokeColor??command.color,...(command.roboFillColor?{fill:command.roboFillColor}:{}),...(command.roboLineWidth!==undefined?{strokeWidth:command.roboLineWidth}:{}),ruhiCommand:structuredClone(command)}}:item);
  return {...next,points:stamp(next.points),lines:stamp(next.lines),circles:stamp(next.circles),polygons:stamp(next.polygons)};
}
function addGeometry<T extends Pick<Construction, 'points' | 'lines' | 'circles' | 'polygons' | 'loci'>>(current: T, command: VisualCommand): T {
  const base=command.objectId??crypto.randomUUID();
  const retained = <TItem extends {id:string}>(items:TItem[])=>items.filter(item=>!item.id.startsWith(`${base}-`));
  if(command.roboNativeIds){
    const ids=command.roboNativeIds,drop=new Set([...ids.points,...(ids.shape?[ids.shape]:[])]),deleted=new Set(ids.shape?[ids.shape]:ids.points);
    const preserve=<TItem extends {id:string;style?:{visible?:boolean;color?:string}}>(items:TItem[])=>command.roboControl==='delete'?items.filter(item=>!deleted.has(item.id)):items.map(item=>drop.has(item.id)?{...item,style:{...item.style,color:command.color,visible:command.roboVisible??true}}:item);
    const coordinates=command.kind==='circle'?[command.points[0],[(command.points[0]?.[0]??0)+command.radius*(command.scale??1),command.points[0]?.[1]??0]]:outlineVertices(command);
    const points=preserve(current.points).map(point=>{const index=ids.points.indexOf(point.id),p=coordinates[index];return index>=0&&p&&command.roboControl!=='visibility'?{...point,x:320+p[0]*40,y:210-p[1]*40,...(index===0&&command.roboLabel?{label:command.roboLabel}:{})}:point;});
    const next={...current,points,lines:preserve(current.lines),circles:preserve(current.circles),polygons:preserve(current.polygons),loci:preserve(current.loci)};
    if(command.roboControl!=='delete'){
      ids.points.forEach((id,index)=>{const p=coordinates[index];if(p&&!next.points.some(point=>point.id===id))next.points.push({id,x:320+p[0]*40,y:210-p[1]*40,label:command.roboLabel??id,style:{color:command.color}});});
      if(ids.shape&&['line','ray','vector'].includes(command.kind)&&!next.lines.some(line=>line.id===ids.shape))next.lines.push({id:ids.shape,a:ids.points[0],b:ids.points[1],kind:command.kind==='line'?(command.linearExtent??'line'):command.kind as 'ray'|'vector',style:{color:command.color}});
      if(ids.shape&&command.kind==='circle'&&!next.circles.some(circle=>circle.id===ids.shape))next.circles.push({id:ids.shape,center:ids.points[0],edge:ids.points[1],style:{color:command.color}});
      if(ids.shape&&!['line','ray','vector','circle','point'].includes(command.kind)&&!next.polygons.some(polygon=>polygon.id===ids.shape))next.polygons.push({id:ids.shape,points:ids.points,style:{color:command.color}});
    }
    return next;
  }
  if(command.roboControl==='delete')return {...current,points:retained(current.points),lines:retained(current.lines),circles:retained(current.circles),polygons:retained(current.polygons),loci:retained(current.loci)};
  if(command.roboControl==='visibility'){
    const visible=<TItem extends {id:string;style?:{visible?:boolean}}>(items:TItem[])=>items.map(item=>item.id.startsWith(`${base}-`)?{...item,style:{...item.style,visible:command.roboVisible}}:item);
    return {...current,points:visible(current.points),lines:visible(current.lines),circles:visible(current.circles),polygons:visible(current.polygons),loci:visible(current.loci)};
  }
  if(command.kind==='plot') {
    const fn=compileFunctionExpression(command.expression!),points:Array<{x:number;y:number}>=[],s=command.scale??1,angle=(command.rotation?.[2]??0)*Math.PI/180;
    for(let i=0;i<=400;i++){const x=-10+i/20,y=fn(x);if(!Number.isFinite(y)||Math.abs(y)>1000)continue;points.push({x:320+(x*Math.cos(angle)-y*Math.sin(angle))*s*40,y:210-(x*Math.sin(angle)+y*Math.cos(angle))*s*40});}
    return {...current,loci:[...retained(current.loci),{id:`${base}-graph`,label:command.expression!,points,style:{color:command.color},mode:'static'}]};
  }
  const center = command.points[0] ?? [0,0];
  const coordinates=command.kind==='circle'?[center,[center[0]+command.radius*(command.scale??1),center[1]]]:outlineVertices(command);
  const points = coordinates.map(([x,y],i) => ({ id:`${base}-p${i}`, x:320+x*40, y:210-y*40, label:i===0&&command.roboLabel?command.roboLabel:current.points.find(p=>p.id===`${base}-p${i}`)?.label??`P${retained(current.points).length+i+1}`, style:{color:command.color,visible:command.roboVisible??true} }));
  const next = { ...current, points:[...retained(current.points),...points],polygons:retained(current.polygons),circles:retained(current.circles),lines:retained(current.lines) };
  const style = {color:command.color,visible:command.roboVisible??true};
  if (!['circle','line','ray','vector','point'].includes(command.kind)) next.polygons.push({id:`${base}-shape`,points:points.map(p=>p.id),style});
  if (command.kind === 'circle') next.circles.push({id:`${base}-shape`,center:points[0].id,edge:points[1].id,style});
  if (['line','ray','vector'].includes(command.kind)) next.lines.push({id:`${base}-shape`,a:points[0].id,b:points[1].id,kind:command.kind==='line'?(command.linearExtent??'line'):command.kind as 'ray'|'vector',style});
  return next;
}

export function nativeGeometryCommands(current:Pick<Construction,'points'|'lines'|'circles'|'polygons'>,owned:(id:string)=>boolean=()=>false):VisualCommand[]{
  const xy=(id:string)=>{const p=current.points.find(point=>point.id===id);return p?[(p.x-320)/40,(210-p.y)/40]:undefined;};
  const base=(id:string,kind:VisualCommand['kind'],points:number[][],color?:string):VisualCommand=>({objectId:id,kind,dimension:'2d',points,width:6,height:4,radius:3,color:color??'#22d3ee',action:'create',rotation:[0,0,0],scale:1});
  const standalone=(id:string)=>!/-p\d+$|-shape$/.test(id);
  const commands:VisualCommand[]=current.points.filter(p=>standalone(p.id)).map(point=>({...base(point.id,'point',[xy(point.id)!],point.style?.color),roboLabel:point.label,roboNativeIds:{points:[point.id]}}));
  for(const object of current.lines.filter(o=>!owned(o.id))){const a=xy(object.a),b=xy(object.b);if(a&&b)commands.push({...base(object.id,(object.kind==='segment'?'line':object.kind)??(object.style?.label==='ray'?'ray':object.style?.label==='vector'?'vector':'line'),[a,b],object.style?.color),roboLabel:current.points.find(p=>p.id===object.a)?.label,linearExtent:object.kind==='segment'?'segment':'line',roboNativeIds:{points:[object.a,object.b],shape:object.id}});}
  for(const object of current.circles.filter(o=>!owned(o.id))){const c=xy(object.center),e=xy(object.edge);if(c&&e)commands.push({...base(object.id,'circle',[c],object.style?.color),roboLabel:current.points.find(p=>p.id===object.center)?.label,radius:Math.hypot(c[0]-e[0],c[1]-e[1]),roboNativeIds:{points:[object.center,object.edge],shape:object.id}});}
  for(const object of current.polygons.filter(o=>!owned(o.id))){const points=object.points.map(xy);if(points.every((p):p is number[]=>!!p))commands.push({...base(object.id,points.length===3?'triangle':'polygon',points,object.style?.color),roboLabel:current.points.find(p=>p.id===object.points[0])?.label,roboNativeIds:{points:object.points,shape:object.id},roboExplicitVertices:true});}
  const restored=new Map<string,VisualCommand>();
  const metadata=(style:unknown)=>(style as {ruhiCommand?:VisualCommand}|undefined)?.ruhiCommand;
  for(const object of [...current.lines,...current.circles,...current.polygons,...current.points]){
    const command=metadata(object.style);
    if(!command?.objectId||owned(command.objectId))continue;
    const pointIds='center' in object?[object.center,object.edge]:'a' in object?[object.a,object.b]:'points' in object?object.points:[object.id];
    restored.set(command.objectId,{...structuredClone(command),color:command.roboStrokeColor?command.color:object.style?.color??command.color,roboNativeIds:{points:pointIds,...(!('x' in object)?{shape:object.id}:{})}});
  }
  const restoredNativeIds=new Set([...restored.values()].flatMap(c=>[...(c.roboNativeIds?.points??[]),...(c.roboNativeIds?.shape?[c.roboNativeIds.shape]:[])]));
  return [...commands.filter(c=>!c.objectId||!restoredNativeIds.has(c.objectId)),...restored.values()];
}
