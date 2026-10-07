import {interpretVisualRequest, outlineVertices, transformPoint, type IntelligenceMode, type Interpretation, type VisualCommand} from './languageEngine';

export type RoboObject = {command: VisualCommand; vertices?: number[][]};
const rounded = (n:number) => Math.abs(n)<1e-9?0:Number(n.toFixed(6));
const coordinate = (p:number[], dimension: string) => `(${p.slice(0,dimension==='3d'?3:2).map(rounded).join(', ')})`;
const isDraw = (input:string) => /\b(draw|create|add|mark|show|plot|place)\b/i.test(input);
export function contextualRequest(input:string,mode:IntelligenceMode,objects:RoboObject[]):Interpretation|undefined {
  const text=input.toLowerCase().replace(/mid[ -]point/g,'midpoint');
  const three=mode.endsWith('3d');
  const dimension=three?'3d':'2d';
  const find=(kind?:string)=>[...objects].reverse().find(object=>!kind||object.command.kind===kind);
  const points=(object:RoboObject)=>object.vertices??outlineVertices(object.command);
  if (/\bmidpoint\b/.test(text)) {
    const target=find('line');
    if(!target)return {message:'Draw a line first so I can find its midpoint.'};
    const [a,b]=points(target);
    const mid=a.map((v,i)=>(v+b[i])/2);
    const answer=`The midpoint of that line is ${coordinate(mid,dimension)}.`;
    if(isDraw(text)) {const result=interpretVisualRequest(`Create point ${coordinate(mid,dimension)}`,mode);return {...result,message:answer+' Marked it in the workspace.'};}
    return {message:answer};
  }
  if (/\b(length|distance)\b/.test(text)&&/\b(line|segment)\b/.test(text)&&!isDraw(text)) {
    const target=find('line');
    if(!target)return {message:'Draw a line first so I can measure its length.'};
    const [a,b]=points(target);return {message:`The length of that line is ${rounded(Math.hypot(...a.map((v,i)=>b[i]-v)))} units.`};
  }
  if (/\btangent\b/.test(text)) {
    if(/\binside\b/.test(text))return {message:'A tangent cannot lie inside a circle: it touches the boundary at one point. Ask “draw a tangent to the last circle at angle 0 degrees”.'};
    const target=find('circle');
    if(!target)return {message:'Draw a circle first, then ask for a tangent at an angle or a point on its boundary.'};
    const c=target.command, center=c.points[0]??[0,0,0],r=c.radius*(c.scale??1);
    let angle=Number(text.match(/(?:angle|at)\s*(-?\d+(?:\.\d+)?)\s*(?:degrees?|deg)?/)?.[1]??0)*Math.PI/180;
    const explicit=text.match(/\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)(?:\s*,\s*(-?\d+(?:\.\d+)?))?\s*\)/);
    if (explicit) {
      const p=[Number(explicit[1]),Number(explicit[2]),Number(explicit[3]??0)];
      if(c.rotation?.some(Boolean))return {message:'For a rotated circle, give the tangent angle in its local plane.'};
      if(Math.abs(Math.hypot(p[0]-center[0],p[1]-center[1])-r)>1e-6||Math.abs(p[2]-(center[2]??0))>1e-6)return {message:'That point is not on the circle boundary. Give a boundary point or a tangent angle.'};
      angle=Math.atan2(p[1]-center[1],p[0]-center[0]);
    }
    const local=[center[0]+c.radius*Math.cos(angle),center[1]+c.radius*Math.sin(angle),center[2]??0];
    const touch=transformPoint(local,c,center);
    const direction=transformPoint([-Math.sin(angle),Math.cos(angle),0],{...c,scale:1,points:[]},[0,0,0]);
    const span=Math.max(r,1);
    const a=touch.map((v,i)=>v-span*direction[i]),b=touch.map((v,i)=>v+span*direction[i]);
    const result=interpretVisualRequest(`Create line ${coordinate(a,dimension)} to ${coordinate(b,dimension)}`,mode);
    return {...result,message:`Drew a tangent segment touching the circle at ${coordinate(touch,dimension)}.`};
  }
  if (/\b(starting|start|beginning|begin)\b.*\b(end|vertex|corner)\b/.test(text)) {
    const kind=text.match(/(?:last(?:\s+drawn)?|that|previous)\s+(triangle|rectangle|square|line|polygon)/)?.[1];
    const target=find(kind);
    if(!target)return {message:`Draw a ${kind??'shape'} first so I can use its endpoint.`};
    const vertices=points(target),anchor=vertices.at(-1)!;
    const cleaned=input.replace(/(?:starting|start|beginning|begin)\s+from.*$/i,'').replace(/\banother\b/gi,'a');
    const result=interpretVisualRequest(cleaned,mode);
    if(!result.command)return result;
    if(!['rectangle','square','triangle'].includes(result.command.kind))return {message:'Endpoint anchoring supports rectangles, squares and triangles. Name one of those shapes.'};
    const command=result.command;
    const first=outlineVertices(command)[0];
    command.points=[anchor.map((v,i)=>v-first[i])];
    return {command,message:`Created ${dimension.toUpperCase()} ${command.kind} starting at ${coordinate(anchor,dimension)}, the last vertex of the ${target.command.kind}.`};
  }
  // Named references select an earlier object without accidentally modifying the latest one.
  if (/\b(resize|scale|rotate|turn|tilt|move|translate|recolor|colour|color|double|halve|make)\b/.test(text)) {
    const kind=text.match(/\b(?:last|previous|that|the)\s+(triangle|rectangle|square|circle|line|sphere|cube|cuboid)\b/)?.[1];
    if(kind) {
      const target=find(kind);
      if(!target)return {message:`No ${kind} is available in this workspace. Create one first.`};
      return interpretVisualRequest(input,mode,target.command);
    }
  }
  return undefined;
}
