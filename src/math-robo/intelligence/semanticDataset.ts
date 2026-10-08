import { interpretVisualRequest } from '../../offline-intelligence/commands';
import { OPERATIONS, normalizeAction, operationFor,BASELINE_OPERATION_KEYS } from './actionRegistry';
import { emptyScene, describeObject } from './sceneContext';
import { parseSemanticCommand } from './semanticParser';
import type { RoboMode, RoboSceneContext, SemanticRow } from './types';
import {extendedDataset} from './extendedDataset';
import {validateCommand} from './commandValidator';
export function contextToScene(row:SemanticRow):RoboSceneContext {
  const scene=emptyScene(row.mode);
  scene.objects=(row.context?.objects??[]).map(object=>{
    const command={kind:object.type as Parameters<typeof describeObject>[0]['kind'],objectId:object.id,dimension:row.mode.endsWith('3d')?'3d' as const:'2d' as const,points:object.type==='line'||object.type==='triangle'||object.type==='polygon'?object.vertices??[object.position]:[object.position],width:6,height:4,depth:3,radius:object.radius??3,color:object.style?.color??'#22d3ee',roboLabel:object.label,action:'create' as const,scale:1,rotation:[0,0,0] as [number,number,number],...object.parameters};
    return {...describeObject(command,row.mode,object.vertices),...object,command};
  });scene.selectedIds=row.context?.selected??[];scene.lastReferenced=row.context?.lastReferenced;scene.previousResult=row.context?.previousResult;scene.previousResults=row.context?.previousResults;scene.activeObjectIds=row.context?.activeObjectIds;return scene;
}
export function validateSemanticRows(input:unknown[]):SemanticRow[] {
  if(!input.length||input.length>100000)throw new Error('Provide 1 to 100,000 semantic rows.');
  return input.map((value,index)=>{
    const row=value as SemanticRow;const fail=(message:string):never=>{throw new Error(`Row ${index+1}: ${message}`);};
    if(!row||typeof row.phrase!=='string'||!row.phrase.trim()||row.phrase.length>500)fail('phrase must have 1–500 characters.');
    if(!['normal','graph2d','graph3d','geometry2d','geometry3d'].includes(row.mode))fail('invalid mode.');
    if(typeof row.action!=='string'||typeof row.subAction!=='string')fail('provide action and subAction.');
    const action=normalizeAction(row.action.toUpperCase()),subAction=row.subAction.toUpperCase();
    if(!operationFor(action,subAction)?.implemented)fail('this action/subAction has no implemented executor.');
    if(!row.parameters||typeof row.parameters!=='object'||Array.isArray(row.parameters))fail('parameters must be an object.');
    try{validateCommand({id:'dataset',rawPhrase:row.phrase,normalizedPhrase:row.phrase,detectedAction:action,action,subAction,mode:row.mode,target:row.target,targets:row.targets,parameters:row.parameters,confidence:{overall:1,action:1,subAction:1},source:{action:'rule',subAction:'rule'},requiresExecution:true});}catch(error){fail(String(error));}
    if(row.context&&(!Array.isArray(row.context.objects)||row.context.objects.length>100||row.context.objects.some(o=>!o||typeof o.id!=='string'||typeof o.type!=='string'||!Array.isArray(o.position)||o.position.some(n=>typeof n!=='number'||!Number.isFinite(n)))))fail('context must be a read-only object snapshot; executable strings are forbidden.');
    if(row.context&&new Set(row.context.objects.map(o=>o.id)).size!==row.context.objects.length)fail('duplicate context object IDs.');
    return {...row,action,subAction};
  });
}
export async function readSemanticDataset(file:File) {
  if(file.size>100*1024*1024)throw new Error('Maximum dataset size is 100 MB.');
  const rows:unknown[]=[];let pending='',line=0;const reader=file.stream().pipeThrough(new TextDecoderStream('utf-8',{fatal:true})).getReader();
  const parse=(text:string)=>{line++;if(!text.trim())return;if(rows.length>=100000)throw new Error('Maximum 100,000 rows.');try{rows.push(JSON.parse(text.replace(/^\uFEFF/,'')));}catch{throw new Error(`Invalid JSON at line ${line}.`);}};
  try{while(true){const chunk=await reader.read();if(chunk.done)break;pending+=chunk.value;const lines=pending.split('\n');pending=lines.pop()??'';lines.forEach(parse);if(pending.length>100000)throw new Error('One row exceeds 100 KB.');}if(pending.trim())parse(pending);}finally{await reader.cancel();reader.releaseLock();}
  return validateSemanticRows(rows);
}
export function semanticGroup(row:SemanticRow){return row.group??row.phrase.toLowerCase().replace(/-?\d+(?:\.\d+)?/g,'#').replace(/\b(?:please|kindly|now)\b/g,'').replace(/\s+/g,' ').trim();}
export function splitSemanticRows(rows:SemanticRow[]){
  const train:SemanticRow[]=[],validation:SemanticRow[]=[],test:SemanticRow[]=[];
  const strata=new Map<string,Map<string,SemanticRow[]>>();
  for(const row of rows){const key=`${row.action}:${row.subAction}`,groups=strata.get(key)??new Map<string,SemanticRow[]>(),group=semanticGroup(row),items=groups.get(group)??[];items.push(row);groups.set(group,items);strata.set(key,groups);}
  const hash=(value:string)=>{let n=2166136261;for(const char of value)n=Math.imul(n^char.charCodeAt(0),16777619);return n>>>0;};
  for(const groups of strata.values()){
    const ordered=[...groups.entries()].sort((a,b)=>hash(a[0])-hash(b[0]));
    if(ordered.length<3){train.push(...ordered.flatMap(([,group])=>group));continue;}
    const held=Math.max(1,Math.round(ordered.length*.15));
    ordered.forEach(([,group],index)=>(index<held?test:index<held*2?validation:train).push(...group));
  }
  return {train,validation,test};
}
function descriptor(id:string,type:string,position:number[],mode:RoboMode,radius=3,vertices?:number[][]){return {id,type,position,mode,radius,style:{color:'#ef4444'},...(vertices?{vertices}:{})};}
function seedContext(mode:RoboMode){const three=mode.endsWith('3d'),p=(x:number,y:number)=>three?[x,y,0]:[x,y];return {objects:[descriptor('A','point',p(1,1),mode),descriptor('B','point',p(4,5),mode),descriptor('line_1','line',p(0,0),mode,3,[p(0,0),p(6,8)]),descriptor('line_2','line',p(0,8),mode,3,[p(0,8),p(8,0)]),descriptor('circle_1','circle',p(0,0),mode,5),descriptor('circle_2','circle',p(4,2),mode,2),descriptor('square_1','square',p(0,0),mode),descriptor('sphere_1','sphere',p(0,0),mode,3),descriptor('sphere_2','sphere',p(4,2),mode,2)],selected:['circle_1'],lastReferenced:'circle_1',previousResult:p(3,4)};}
const questionVariations=(sub:string)=>[`What is its ${sub}?`,`Find its ${sub}`,`Calculate its ${sub}`,`Measure the ${sub} of the selected object`,`What's the ${sub} of that object?`,`Please find the ${sub}`,`Tell me its ${sub}`,`Can you calculate its ${sub}?`];
export function generateStarterDataset():SemanticRow[]{
  const rows:SemanticRow[]=[];
  for(const op of OPERATIONS.filter(op=>op.implemented)){
    if(!BASELINE_OPERATION_KEYS.includes(`${op.action}:${op.subAction}`))continue;
    const modes=op.modes.filter(mode=>mode!=='normal');
    for(const mode of modes){
      const sub=op.subAction.toLowerCase().replaceAll('_',' ');let phrases:string[]=[];
      switch(op.action){
        case 'CREATE':{const suffix=sub==='line'?(mode.endsWith('3d')?' from (0,0,0) to (6,8,0)':' from (0,0) to (6,8)'):sub==='point'?(mode.endsWith('3d')?' at (1,2,3)':' at (1,2)'):sub==='circle'||sub==='sphere'?' radius 5':sub==='rectangle'?' 4 by 6':sub==='square'||sub==='cube'?' side 4':' width 6 height 4 radius 3';phrases=['Draw','Create','Make','Add','Sketch','Please draw','Can you construct','Show me','Build','I need'].map(verb=>`${verb} a ${sub}${suffix}`);break;}
        case 'PLOT':if(op.subAction==='SURFACE_3D'&&!mode.endsWith('3d')||op.subAction==='FUNCTION'&&mode.endsWith('3d'))continue;phrases=['Plot','Graph','Draw a graph of','Show graph of','Please plot','Can you plot','Create a graph of','Embed graph of'].map(verb=>`${verb} ${mode.endsWith('3d')?'z=x^2+y^2':'y=x^2'}`);break;
        case 'FIND':phrases=questionVariations(sub);if(op.subAction==='DISTANCE')phrases=['Find the distance between A and B','How far apart are A and B?','What is the distance between A and B?','Measure the distance between A and B','Calculate the distance between A and B'];if(op.subAction==='INTERSECTION')phrases=['Where do these two lines intersect?','Find the intersection of these two lines','Find where the last two lines intersect','Calculate the intersection of these two lines','Where is the intersection?'];break;
        case 'CHANGE':phrases=op.subAction==='COLOR'?['Make it blue','Change its color to blue','Color the selected circle blue','Set its color to blue','Turn it blue','Recolor it blue']:op.subAction==='LABEL'?['Rename it to C','Set its label to C','Change the label to C','Rename that circle to C']:['Change','Set','Please change','Can you set','Make'].map(verb=>`${verb} its ${sub} to ${op.subAction==='POSITION'||op.subAction==='COORDINATES'?(mode.endsWith('3d')?'(2,3,1)':'(2,3)'):'8'}`);break;
        case 'MOVE':phrases=['Move it 3 right and 2 up','Translate it (3,2)','Move the red circle 3 units right','Move it right by 3','Please move it 3 right','Move it 2 units left'];if(mode.endsWith('3d'))phrases=phrases.map(p=>p.replace('(3,2)','(3,2,1)'));break;
        case 'ROTATE':phrases=['Rotate it 45 degrees','Turn it 90 degrees','Rotate the selected circle 30 degrees','Rotate it 1 radians','Rotate it 45 degrees clockwise'];break;
        case 'SCALE':phrases=['Scale it by 2','Double it','Make it twice as big','Halve it','Enlarge it by 2'];break;
        case 'RESIZE':phrases=['Resize it width 8 height 5','Resize its width to 4','Resize the circle radius 6','Please resize it width 8'];break;
        case 'REFLECT':phrases=['Reflect it across','Flip it across','Please reflect it across','Reflect the selected circle across','Reflect that shape across'].map(verb=>`${verb} the ${sub.replace(' axis','-axis').replace(' plane','-plane')}`);break;
        case 'CONSTRUCT':phrases=['Draw','Construct','Create','Please draw','Can you construct'].map(verb=>`${verb} a ${sub} ${op.subAction==='TANGENT'?'to the circle at angle 30 degrees':'through the midpoint of the last line'}`);break;
        case 'MARK':phrases=['Mark','Please mark','Can you mark','Mark now','Create a point at'].map(verb=>`${verb} ${sub==='point'?'it':`the ${sub}`}`);break;
        case 'SHOW':phrases=['Show','Please show','Can you show','Show me','Display'].map(verb=>`${verb} ${sub==='object'?'it':`the ${sub}`}`);break;
        case 'HIDE':phrases=['Hide it','Hide the selected object','Please hide that circle','Hide this object'];break;
        case 'DELETE':phrases=op.subAction==='ALL'?['Delete all objects','Clear all','Reset all objects','Remove all objects']:['Delete it','Remove it','Delete the selected object','Please delete that circle'];break;
        case 'SELECT':phrases=op.subAction==='ALL'?['Select all','Select all objects','Please select all','Select everything']:['Select the largest circle','Select the red circle','Select the first point','Select the last line'];break;
        case 'DESELECT':phrases=['Deselect all','Deselect everything','Deselect objects','Deselect the selection'];break;
        case 'DUPLICATE':phrases=['Duplicate it','Copy it','Duplicate that circle','Make a copy of it','Please duplicate it'];break;
        case 'UNDO':phrases=['Undo that','Undo','Undo the last action','Please undo'];break;
        case 'REDO':phrases=['Redo that','Redo','Redo the last action','Please redo'];break;
        case 'COUNT':phrases=['Count','Please count','How many','Count all'].map(verb=>`${verb} ${sub}`);break;
        case 'COMPARE':phrases=['Compare','Please compare','Compare the','Which has larger'].map(verb=>`${verb} ${sub} of these two ${op.subAction==='LENGTH'?'lines':['VOLUME','SURFACE_AREA'].includes(op.subAction)?'spheres':'circles'}`);if(op.subAction==='SIZE')phrases.push('Which circle is larger?');break;
        case 'CHECK':phrases=['Check','Test','Verify',op.subAction==='EQUAL_AREA'?'Are these two circles':'Are these two lines'].map(verb=>`${verb} ${sub}`);if(sub==='point inside')phrases=['Is this point inside the circle?','Check if the point is inside the circle','Is point A inside the circle?','Test if A is inside the circle'];break;
      }
      const context=seedContext(mode);
      if(op.action==='CHECK'&&['POINT_ON_LINE','POINT_ON_CIRCLE'].includes(op.subAction))phrases=['Is point A','Check if point A is','Test if point A is','Verify that point A is'].map(prefix=>`${prefix} on the ${op.subAction==='POINT_ON_LINE'?'line':'circle'}`);
      const preferred=['LENGTH','MIDPOINT','SLOPE'].includes(op.subAction)?'line_1':['VOLUME','SURFACE_AREA'].includes(op.subAction)?'sphere_1':['ROOTS','X_INTERCEPT','Y_INTERCEPT'].includes(op.subAction)?'graph_1':op.action==='CHANGE'&&['WIDTH','HEIGHT','DEPTH'].includes(op.subAction)||op.action==='RESIZE'?'square_1':'circle_1';
      if(preferred==='graph_1')context.objects.push({...descriptor('graph_1','plot',[0,0],mode),parameters:{expression:'x^2'}} as ReturnType<typeof descriptor>);context.selected=[preferred];context.lastReferenced=preferred;
      if(op.action==='CHECK'){context.selected=op.subAction.startsWith('POINT_')?['A']:op.subAction==='EQUAL_AREA'?['circle_1','circle_2']:['line_1','line_2'];context.lastReferenced=context.selected[0];}
      phrases.forEach((phrase,index)=>{
        const parsed=parseSemanticCommand(phrase,mode);
        // Labels are authored from the operation registry, not inferred from parser output.
        // Expected numeric fields are authored independently of the parser.
        const parameters:SemanticRow['parameters']={};
        if(op.action==='CREATE'){
          if(sub==='point')parameters.points=[mode.endsWith('3d')?[1,2,3]:[1,2]];
          else if(sub==='line')parameters.points=mode.endsWith('3d')?[[0,0,0],[6,8,0]]:[[0,0],[6,8]];
          else if(sub==='rectangle'){parameters.width=4;parameters.height=6;}
          else if(sub==='circle'||sub==='sphere')parameters.radius=5;
          else if(sub==='square'||sub==='cube')parameters.width=4;
          else {parameters.width=6;parameters.height=4;parameters.radius=3;}
        }
        if(op.action==='PLOT')parameters.expression=mode.endsWith('3d')?'x^2+y^2':'x^2';
        if(op.action==='CHANGE'){if(op.subAction==='COLOR')parameters.color='blue';else if(op.subAction==='LABEL')parameters.label='c';else if(['POSITION','COORDINATES'].includes(op.subAction))parameters.position=mode.endsWith('3d')?[2,3,1]:[2,3];else parameters[op.subAction.toLowerCase()]=8;}
        if(op.action==='MOVE')parameters.vector=([[3,2],[3,2],[3,0],[3,0],[3,0],[-2,0]][index]??[3,0]).concat(mode.endsWith('3d')?[index===1?1:0]:[]);
        if(op.action==='ROTATE')parameters.angle=[45,90,30,180/Math.PI,-45][index];
        if(op.action==='SCALE')parameters.factor=[2,2,2,.5,2][index];
        if(op.action==='RESIZE'){if(index===0||index===3){parameters.width=8;if(index===0)parameters.height=5;}if(index===1)parameters.width=4;if(index===2)parameters.radius=6;}
        const needsTarget=!['CREATE','PLOT','COUNT','UNDO','REDO','DESELECT'].includes(op.action)&&!(op.action==='SELECT'&&op.subAction==='ALL')&&!(op.action==='DELETE'&&op.subAction==='ALL')&&!(op.action==='MARK'&&['POINT','INTERSECTION'].includes(op.subAction));
        const multiple=['COMPARE','CHECK'].includes(op.action)||op.action==='FIND'&&['DISTANCE','INTERSECTION'].includes(op.subAction);
        rows.push({phrase,action:op.action,subAction:op.subAction,mode,parameters,context,source:'controlled-template',group:`${op.action}:${op.subAction}:template-${index}`,...(needsTarget&&!multiple&&parsed.target?{target:parsed.target}:{}),...(parsed.targets?{targets:parsed.targets}:{})});
      });
    }
  }
  rows.push(...(['normal','graph2d','geometry2d'] as RoboMode[]).flatMap(mode=>extendedDataset(mode,seedContext(mode))));
  for(const op of OPERATIONS)op.examples=rows.filter(row=>row.action===op.action&&row.subAction===op.subAction).slice(0,5).map(row=>row.phrase);
  return rows;
}
export function migrateLegacyRow(row:{phrase:string;canonical:string;mode:RoboMode;label?:string;context?:string[]}):SemanticRow {
  const parsed=parseSemanticCommand(row.canonical,row.mode),objects=(row.context??[]).map((text,index)=>{
    const command=interpretVisualRequest(text,row.mode).command;if(!command)throw new Error('Legacy context contains an invalid object definition.');command.objectId=`legacy_${index}`;const {command:unused,...object}=describeObject(command,row.mode);void unused;return object;
  });
  const parameters={...parsed.parameters};delete parameters.legacy;
  return {phrase:row.phrase,action:parsed.action,subAction:parsed.subAction,mode:row.mode,parameters,target:parsed.target,targets:parsed.targets,context:{objects},source:'legacy-migration'};
}
