import { compileFunctionExpression, compileTwoVariableExpression } from '../utils/functionParser';
import { COLORS, FLAT_SHAPES, SHAPE_ALIASES, SOLID_SHAPES, type ShapeKind } from './shapeCatalog';

export type IntelligenceMode = 'normal'|'graph2d'|'graph3d'|'geometry2d'|'geometry3d';
export type VisualCommand = {
  kind:ShapeKind|'plot'|'point'|'line'|'ray'|'vector'; dimension:'2d'|'3d'; expression?:string;
  points:number[][]; width:number; height:number; radius:number; depth?:number;
  sides?:number; color:string; rotation?:[number,number,number]; scale?:number;
  action?:'create'|'update';
  objectId?:string;
  fitDimensions?:boolean;
  roboControl?: 'delete'|'visibility'|'select'|'deselect';
  roboVisible?: boolean;
  roboLabel?: string;
  roboTemporary?: boolean;
  roboExplicitVertices?: boolean;
  roboNativeIds?: {points:string[];shape?:string};
  roboNativeRow?: boolean;
  roboVertexLabels?:string[];
  roboLocked?:boolean;
  roboSemanticKind?:string;
  roboFillColor?:string;
  roboStrokeColor?:string;
  roboLineWidth?:number;
  roboStrokeEdges?:number[];
  roboAngle?:{vertex:number;degrees:number;arcColor?:string;lineWidth?:number};
  linearExtent?:'line'|'segment';
  roboPlane?:{point:number[];normal:number[];exactCoefficients:string[]};
  roboDependency?:import('../math-robo/intelligence/workspaceDependencies').RoboDependency;
};
export type Interpretation={command?:VisualCommand;message:string};
export function modeForPath(path:string):IntelligenceMode {
  return path==='/math-lab/3d-graphing'?'graph3d':path==='/workspace/3d'?'geometry3d':path==='/workspace/geometry'?'geometry2d':['/workspace/graph','/math-lab/graphing-calculator'].includes(path)?'graph2d':'normal';
}
export function interpretVisualRequest(input:string,mode:IntelligenceMode,previous?:VisualCommand):Interpretation {
  const words=input.trim().replace(/[?.]+$/,'').replace(/grometry/gi,'geometry');
  const text=words.replace(/\b[a-z]+\b/gi,word=>SHAPE_ALIASES[word.toLowerCase()]??word);
  const lower=text.toLowerCase();
  const number='-?\\d+(?:\\.\\d+)?';
  const size=(name:string,fallback:number)=>Number(lower.match(new RegExp(`\\b(?:${name})\\s*(?:of|is|=|:|to)?\\s*(${number})`))?.[1]??lower.match(new RegExp(`(${number})\\s*(?:units?\\s*)?(?:${name})\\b`))?.[1]??fallback);
  const shape=lower.match(new RegExp(`\\b(${[...FLAT_SHAPES,...SOLID_SHAPES,'point','line','segment','ray','vector'].join('|')})\\b`))?.[1];
  const modifying=/\b(resize|scale|enlarge|shrink|grow|increase|decrease|reduce|double|halve|rotate|turn|tilt|recolor|colour|color|move|translate)\b|\bmake\b.*\b(bigger|smaller|blue|red|green|purple|orange|yellow|pink|white|black|cyan)\b/.test(lower);
  if(modifying && !/\b(create|draw|add|plot)\b/.test(lower)) {
    if(!previous) return {message:'Create an object first. Then ask me to resize, rotate, tilt, move, or recolor it.'};
    if(shape && shape!=='segment' && shape!==previous.kind && !(shape==='square'&&previous.kind==='rectangle')) return {message:`The last Ruhi object is a ${previous.kind}. Create a ${shape} first, or use “it” to edit the last object.`};
    const command:VisualCommand={...previous,points:previous.points.map(p=>[...p]),rotation:[...(previous.rotation??[0,0,0])],action:'update'};
    const color=lower.match(new RegExp(`\\b(${Object.keys(COLORS).join('|')})\\b`))?.[1];
    if(color) command.color=COLORS[color];
    if(/\b(rotate|turn|tilt)\b/.test(lower)) {
      if(command.dimension==='2d'&&/\btilt\b|\b[xy][ -]?axis\b/.test(lower)) return {message:'Tilting needs a 3D workspace. In 2D, use “rotate it 30 degrees”.'};
      const angle=Number(lower.match(new RegExp(`(${number})\\s*(?:degrees?|deg|°)?`))?.[1]??30)*(/radians?|\brad\b/.test(lower)?180/Math.PI:1);
      if(!Number.isFinite(angle)||Math.abs(angle)>36000) return {message:'Use a finite rotation angle between -36,000 and 36,000 degrees.'};
      const axis=lower.match(/\b([xyz])(?:[ -]?axis)?\b/)?.[1]??(/tilt/.test(lower)?'x':'z');
      const direction=/counterclockwise|anticlockwise/.test(lower)?1:/clockwise/.test(lower)?-1:1;
      command.rotation![axis==='x'?0:axis==='y'?1:2]+=angle*direction;
    }
    if(/\b(resize|scale|enlarge|shrink|grow|increase|decrease|reduce|double|halve|bigger|smaller)\b/.test(lower)) {
      const explicit=/\b(width|height|depth|radius|side|wide|tall|high)\b/.test(lower)||/\d\s*(by|×)\s*\d/.test(lower);
      if(explicit) {
        command.fitDimensions=true;
        const pair=lower.match(new RegExp(`(${number})\\s*(?:by|×)\\s*(${number})`));
        command.width=pair?Number(pair[1]):size('width|wide|side',command.width);
        command.height=pair?Number(pair[2]):size('height|high|tall',command.height);
        command.depth=size('depth|deep',command.depth??command.width);
        command.radius=size('radius',command.radius);
        if(/\bdiameter\b/.test(lower))command.radius=size('diameter',command.radius*2)/2;
        else if(['circle','sphere','hemisphere'].includes(command.kind)&&/\b(width|wide)\b/.test(lower)&&!/\bradius\b/.test(lower))command.radius=command.width/2;
        if(command.kind==='cube'||command.kind==='square') command.height=command.depth=command.width;
      } else {
        let factor=Number(lower.match(new RegExp(`(?:by|factor|to)\\s*(${number})`))?.[1]??lower.match(new RegExp(`(?:resize|scale)\\s*(?:it|this|the|shape|object)?\\s*(${number})`))?.[1]??(/halve|shrink|smaller/.test(lower)?.5:2));
        const percent=lower.match(new RegExp(`(${number})\\s*%`));
        if(percent) factor=/\bby\b/.test(lower)?1+(/shrink|smaller|decrease|reduce/.test(lower)?-1:1)*Number(percent[1])/100:Number(percent[1])/100;
        command.scale=(command.scale??1)*factor;
      }
    }
    if(/\b(move|translate)\b/.test(lower)) {
      const delta=Array.from(lower.matchAll(new RegExp(number,'g')),m=>Number(m[0]));
      const origin=command.points[0]??(command.dimension==='3d'?[0,0,0]:[0,0]);
      let vector:number[];
      if(/left|right|up|down|forward|back/.test(lower)) {
        const distance=delta[0]??1;vector=[/left/.test(lower)?-distance:/right/.test(lower)?distance:0,/down/.test(lower)?-distance:/up/.test(lower)?distance:0,/back/.test(lower)?-distance:/forward/.test(lower)?distance:0];
      } else if(delta.length===origin.length) vector=delta;
      else return {message:`Give a ${origin.length}-coordinate translation, or say “move it right by 2”.`};
      command.points=(command.points.length?command.points:[origin]).map(p=>p.map((v,i)=>v+vector[i]));
    }
    if(!validDimensions(command)) return {message:'Use positive dimensions and a scale that keeps the object within 10,000 units.'};
    return {command,message:`Updated ${command.kind}: size ${command.width} × ${command.height}, scale ${command.scale??1}; rotation ${command.rotation!.join(', ')} degrees (x, y, z).`};
  }
  if(!shape&&!/\b(draw|create|plot|graph|show|embed|add|connect|surface)\b/.test(lower))return {message:''};
  const dimension= /\b2d\b/.test(lower)?'2d': /\b3d\b|\bz\s*=|\bsurface\b/.test(lower)||mode.endsWith('3d')||(SOLID_SHAPES as readonly string[]).includes(shape??'')||(mode==='normal'&&/\([^()]*,[^()]*,[^()]*\)/.test(lower))?'3d':'2d';
  const points=Array.from(lower.matchAll(new RegExp(`\\(\\s*(${number})\\s*,\\s*(${number})(?:\\s*,\\s*(${number}))?\\s*\\)`,'g')),m=>[Number(m[1]),Number(m[2]),...(m[3]===undefined?[]:[Number(m[3])])]);
  const pair=lower.match(new RegExp(`(${number})\\s*(?:by|×|x)\\s*(${number})(?:\\s*(?:by|×|x)\\s*(${number}))?`));
  const color=lower.match(new RegExp(`\\b(${Object.keys(COLORS).join('|')})\\b`))?.[1];
  const command:VisualCommand={linearExtent:shape==='segment'?'segment':shape==='line'?'line':undefined,kind:shape==='segment'?'line':shape as VisualCommand['kind']??'plot',dimension,points,width:pair?Number(pair[1]):size('width|wide|side|size|base',6),height:pair?Number(pair[2]):size('height|high|tall',4),depth:pair?.[3]?Number(pair[3]):size('depth|deep',3),radius:/\bdiameter\b/.test(lower)?size('diameter',6)/2:size('radius',3),sides:size('sides',6),color:COLORS[color??'cyan'],rotation:[0,0,0],scale:1,action:'create'};
  if(command.kind==='square'||command.kind==='cube')command.height=command.depth=command.width;
  command.fitDimensions=/\b(width|wide|height|tall|base)\b/.test(lower)||!!pair;
  if(!validDimensions(command))return {message:'Dimensions must be positive numbers no greater than 10,000.'};
  if(!Number.isInteger(command.sides)||command.sides!<3||command.sides!>32)return {message:'A regular polygon needs an integer number of sides between 3 and 32.'};
  if(shape) {
    if(points.some(p=>p.length!==(dimension==='3d'?3:2)))return {message:`Use ${dimension==='3d'?'three':'two'} coordinates per point in this workspace.`};
    if(['line','ray','vector'].includes(command.kind)&&(points.length!==2||points[0].every((v,i)=>v===points[1][i])))return {message:'A line needs two distinct points. For example, (0,2) and (3,0); use three coordinates per point in 3D.'};
    if(command.kind==='point'&&points.length!==1)return {message:'Give one coordinate for the point, such as (2,3) or (2,3,1).'};
    if(dimension==='2d'&&(SOLID_SHAPES as readonly string[]).includes(command.kind))return {message:'This solid needs three dimensions. Ask for it in 3D.'};
    if(points.length>1&&!['line','ray','vector','triangle','polygon'].includes(command.kind))return {message:'Give one center coordinate for this shape.'};
    if(command.kind==='triangle'&&points.length>1&&points.length!==3)return {message:'Give three vertices for a triangle, or specify its base and height.'};
    if(command.kind==='polygon'&&points.length>1&&points.length<3)return {message:'A polygon needs at least three vertices.'};
    if((command.kind==='triangle'&&points.length===3)||(command.kind==='polygon'&&points.length>=3)) {
      const [a,b,d]=points,u=b.map((v,i)=>v-a[i]),v=d.map((n,i)=>n-a[i]);
      const cross=[(u[1]??0)*(v[2]??0)-(u[2]??0)*(v[1]??0),(u[2]??0)*(v[0]??0)-(u[0]??0)*(v[2]??0),(u[0]??0)*(v[1]??0)-(u[1]??0)*(v[0]??0)];
      const length=Math.hypot(...cross);
      if(length<1e-9)return {message:'The first three vertices must be distinct and must not lie on one line.'};
      if(points.some(p=>Math.abs(p.reduce((sum,n,i)=>sum+(n-a[i])*(cross[i]??0),0))/length>1e-7))return {message:'A flat polygon needs vertices in the same plane.'};
    }
    return {command,message:`Created ${dimension.toUpperCase()} ${command.kind}. ${points.length?'Using your coordinates.':'Centered at the origin.'} Width ${command.width}, height ${command.height}, radius ${command.radius}.`};
  }
  const expression=text.replace(/^(?:(?:please|can|could|you|me|create|add|a|an|plot|graph|surface|draw|embed|show|2d|3d|of|the|for)\b\s*)+/i,'').replace(/^[yz]\s*=\s*/i,'').trim();
  try {if(!expression)throw new Error();if(dimension==='3d')compileTwoVariableExpression(expression);else compileFunctionExpression(expression);}
  catch{return {message:'Give a mathematical expression, for example “plot sin(x)” or “plot z = sin(x)*cos(y)”.'};}
  command.expression=expression;return {command,message:`Added ${dimension.toUpperCase()} graph: ${dimension==='3d'?'z':'y'} = ${expression}.`};
}
function validDimensions(c:VisualCommand){return [c.width,c.height,c.radius,c.depth??1,c.scale??1].every(v=>Number.isFinite(v)&&v>0&&v<=10000)&&Math.max(c.width,c.height,c.radius,c.depth??1)*(c.scale??1)<=10000;}

export function outlineVertices(c:VisualCommand):number[][] {
  if(c.roboExplicitVertices)return c.points.map(p=>transformPoint(p,c,centroid(c.points)));
  const w=c.width,h=c.height,[x,y,z]=c.points[0]??[0,0,0];
  let vertices:number[][];
  if((c.kind==='triangle'&&c.points.length===3)||(c.kind==='polygon'&&c.points.length>=3)) return c.points.map(p=>transformPoint(p,c,centroid(c.points)));
  switch(c.kind){
    case 'ray':case 'vector':case 'line':return c.points.map(p=>transformPoint(p,c,centroid(c.points)));
    case 'point':return c.points;
    case 'triangle':vertices=[[-w/2,-h/3],[w/2,-h/3],[0,h*2/3]];break;
    case 'rectangle':case 'square':vertices=[[-w/2,-h/2],[w/2,-h/2],[w/2,h/2],[-w/2,h/2]];break;
    case 'parallelogram':vertices=[[-w/2,-h/2],[w/4,-h/2],[w/2,h/2],[-w/4,h/2]];break;
    case 'trapezoid':vertices=[[-w/2,-h/2],[w/2,-h/2],[w/4,h/2],[-w/4,h/2]];break;
    case 'rhombus':vertices=[[0,-h/2],[w/2,0],[0,h/2],[-w/2,0]];break;
    case 'kite':vertices=[[0,-h*2/3],[w/2,0],[0,h/3],[-w/2,0]];break;
    case 'circle':case 'ellipse':case 'semicircle': {
      const a=c.kind==='ellipse'?w/2:c.radius,b=c.kind==='ellipse'?h/2:c.radius;
      vertices=Array.from({length:65},(_,i)=>{const t=i/64*(c.kind==='semicircle'?Math.PI:2*Math.PI);return [a*Math.cos(t),b*Math.sin(t)];});break;
    }
    default:{const sides:Record<string,number>={pentagon:5,hexagon:6,heptagon:7,octagon:8,nonagon:9,decagon:10,star:10};const n=sides[c.kind]??c.sides??6;vertices=Array.from({length:n},(_,i)=>{const r=c.kind==='star'&&i%2?.45*c.radius:c.radius,t=2*Math.PI*i/n+Math.PI/2;return [r*Math.cos(t),r*Math.sin(t)];});
      if(c.fitDimensions){const minX=Math.min(...vertices.map(p=>p[0])),maxX=Math.max(...vertices.map(p=>p[0])),minY=Math.min(...vertices.map(p=>p[1])),maxY=Math.max(...vertices.map(p=>p[1]));vertices=vertices.map(p=>[(p[0]-(minX+maxX)/2)*w/(maxX-minX),(p[1]-(minY+maxY)/2)*h/(maxY-minY)]);}
    }
  }
  return vertices.map(p=>transformPoint([p[0]+x,p[1]+y,(p[2]??0)+(z??0)],c,[x,y,z??0]));
}
export function centroid(points:number[][]){return [0,1,2].map(i=>points.reduce((sum,p)=>sum+(p[i]??0),0)/points.length);}
export function transformPoint(p:number[],c:VisualCommand,center:number[]):number[]{
  const [a,b,g]=(c.rotation??[0,0,0]).map(v=>v*Math.PI/180),s=c.scale??1;
  let [x,y,z]=[0,1,2].map(i=>((p[i]??0)-(center[i]??0))*s);
  // Same XYZ Euler convention as the Three.js scene.
  [x,y]=[x*Math.cos(g)-y*Math.sin(g),x*Math.sin(g)+y*Math.cos(g)];
  [x,z]=[x*Math.cos(b)+z*Math.sin(b),-x*Math.sin(b)+z*Math.cos(b)];
  [y,z]=[y*Math.cos(a)-z*Math.sin(a),y*Math.sin(a)+z*Math.cos(a)];
  return [x+(center[0]??0),y+(center[1]??0),z+(center[2]??0)];
}
export function graphExpressions(c:VisualCommand):string[]{
  if(c.roboSemanticKind==='angle'){const p=outlineVertices(c);return [segment(p[0],p[1]),segment(p[0],p[2])];}
  if(c.kind==='plot'){
    if(!(c.scale!==1&&c.scale!==undefined)&&!c.rotation?.some(Boolean)&&!c.points.length)return [c.expression!];
    const f=c.expression!.replace(/\bx\b/g,'t'),s=c.scale??1,t=(c.rotation?.[2]??0)*Math.PI/180;
    const [x,y]=c.points[0]??[0,0];
    return [`param(${x}+${s}*(t*${Math.cos(t)}-(${f})*${Math.sin(t)}),${y}+${s}*(t*${Math.sin(t)}+(${f})*${Math.cos(t)}),-10,10)`];
  }
  if(c.kind==='circle'&&!c.rotation?.some(Boolean)){const [x,y]=c.points[0]??[0,0],r=c.radius*(c.scale??1);return [`(x-${x})^2+(y-${y})^2=${r*r}`];}
  if(['circle','ellipse','semicircle'].includes(c.kind)){
    const [x,y]=c.points[0]??[0,0],s=c.scale??1,a=(c.kind==='ellipse'?c.width/2:c.radius)*s,b=(c.kind==='ellipse'?c.height/2:c.radius)*s,t=(c.rotation?.[2]??0)*Math.PI/180;
    const curve=`param(${x}+${a*Math.cos(t)}*cos(t)-${b*Math.sin(t)}*sin(t),${y}+${a*Math.sin(t)}*cos(t)+${b*Math.cos(t)}*sin(t),0,${c.kind==='semicircle'?Math.PI:2*Math.PI})`;
    if(c.kind!=='semicircle')return [curve];
    const p=outlineVertices(c);return [curve,segment(p[0],p.at(-1)!)];
  }
  if(c.kind==='point')return [`(${c.points[0].slice(0,2).join(',')})`];
  const p=outlineVertices(c);if(['line','ray','vector'].includes(c.kind))return [segment(p[0],p[1])];
  return p.map((a,i)=>segment(a,p[(i+1)%p.length]));
}
function segment(a:number[],b:number[]){return `param(${a[0]}+(${b[0]-a[0]})*t,${a[1]}+(${b[1]-a[1]})*t,0,1)`;}
