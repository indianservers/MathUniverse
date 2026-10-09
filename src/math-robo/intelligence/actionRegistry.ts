import { FLAT_SHAPES, SOLID_SHAPES } from '../../offline-intelligence/shapeCatalog';
import type { RoboMode } from './types';
import {COMMAND_ALIASES} from './commandLanguage';
export const LANGUAGE_ACTIONS = 'CREATE FIND CALCULATE DRAW PLOT ADD INSERT PLACE MARK SHOW HIDE DELETE REMOVE CLEAR RESET SELECT DESELECT MOVE TRANSLATE ROTATE SCALE RESIZE STRETCH SHRINK REFLECT FLIP SHEAR ALIGN DISTRIBUTE SNAP CONNECT JOIN SPLIT DIVIDE MERGE EXTEND TRIM CUT COPY DUPLICATE PASTE GROUP UNGROUP LOCK UNLOCK CHANGE SET INCREASE DECREASE TOGGLE CHECK TEST VERIFY COMPARE COUNT MEASURE SOLVE EVALUATE SIMPLIFY EXPAND FACTOR SUBSTITUTE DIFFERENTIATE INTEGRATE APPROXIMATE ESTIMATE ROUND CONVERT PROJECT INTERSECT CONSTRUCT BISECT PARALLEL PERPENDICULAR TANGENT TRACE LABEL RENAME COLOR STYLE FILL OUTLINE ANIMATE PLAY PAUSE STOP STEP UNDO REDO SAVE LOAD IMPORT EXPORT ZOOM PAN CENTER FOCUS FIT SWITCH EXPLAIN'.split(' ');
const aliases: Record<string, string> = {
  DRAW:'CREATE', ADD:'CREATE', INSERT:'CREATE', PLACE:'CREATE', CONSTRUCT:'CONSTRUCT',
  COLOR:'CHANGE', STYLE:'CHANGE', FILL:'CHANGE', OUTLINE:'CHANGE', SET:'CHANGE', LABEL:'CHANGE', RENAME:'CHANGE',
  MEASURE:'FIND', CALCULATE:'FIND', INTERSECT:'FIND', REMOVE:'DELETE', CLEAR:'DELETE', RESET:'DELETE',
  TRANSLATE:'MOVE', SHRINK:'SCALE', FLIP:'REFLECT', COPY:'DUPLICATE', TEST:'CHECK', VERIFY:'CHECK',
  PARALLEL:'CONSTRUCT', PERPENDICULAR:'CONSTRUCT', TANGENT:'CONSTRUCT', PROJECT:'FIND', CENTER:'FIND',
};
export function normalizeAction(action: string) { return aliases[action] ?? action; }
export type OperationSpec = {
  action: string; subAction: string; aliases: string[]; required: string[]; optional: string[];
  allowedTypes: string[]; modes: RoboMode[]; mutatesScene: boolean; createsObject: boolean; returnsValue: boolean;
  executor: string; implemented: boolean; validation: string[]; examples: string[];
};
const allModes: RoboMode[] = ['normal','geometry2d','graph2d','geometry3d','graph3d'];
const two: RoboMode[] = ['normal','geometry2d','graph2d'];
export const OPERATIONS: OperationSpec[] = [];
function register(action: string, subActions: string[], options: Partial<OperationSpec> = {}) {
  for (const subAction of subActions) OPERATIONS.push({ action, subAction, aliases: [...LANGUAGE_ACTIONS.filter(a => normalizeAction(a) === action),...(COMMAND_ALIASES[action.toLowerCase()]??[])], required: [], optional: ['target','targets'], allowedTypes: [], modes: allModes,
    mutatesScene: !['FIND','CHECK','COMPARE','COUNT'].includes(action), createsObject: ['CREATE','PLOT','MARK','CONSTRUCT','DUPLICATE'].includes(action), returnsValue: ['FIND','CHECK','COMPARE','COUNT'].includes(action),
    executor: `${action.toLowerCase()}:${subAction.toLowerCase()}`, implemented: true, validation: ['finite parameters','existing unambiguous targets','compatible dimensions'], examples: [], ...options });
}
register('CREATE', [...FLAT_SHAPES,...SOLID_SHAPES,'point','line','ray','vector'].map(v => v.toUpperCase()), { optional:['position','points','width','height','depth','radius','sides','color','label'] });
for(const op of OPERATIONS)if(op.action==='CREATE'&&(SOLID_SHAPES as readonly string[]).includes(op.subAction.toLowerCase()))op.modes=['normal','geometry3d','graph3d'];
register('FIND',['COMPONENTS','DIRECTION','PARAMETERIZATION'],{allowedTypes:['ray','vector'],mutatesScene:false});
register('FIND',['MAGNITUDE'],{allowedTypes:['vector'],mutatesScene:false});
register('PLOT', ['FUNCTION','SURFACE_3D'], { required:['expression'], optional:['expression','color'] });
register('FIND', ['DISTANCE','MIDPOINT','LENGTH','AREA','PERIMETER','CIRCUMFERENCE','SLOPE','CENTER','RADIUS','DIAMETER','CENTROID','VOLUME','SURFACE_AREA']);
register('FIND', ['INTERSECTION','ROOTS','X_INTERCEPT','Y_INTERCEPT'], { modes:two });
register('CHANGE', ['COLOR','WIDTH','HEIGHT','DEPTH','RADIUS','DIAMETER','POSITION','COORDINATES','LABEL'], { optional:['color','width','height','depth','radius','diameter','position','label'] });
register('CHANGE',['SIDE'],{allowedTypes:['triangle'],required:['length','side','sidePolicy']});
register('CHECK',['MEASUREMENT'],{required:['measurement','expectedValue'],mutatesScene:false});
register('CHANGE',['ENDPOINTS'],{allowedTypes:['line','ray','vector'],required:['points']});
register('MOVE', ['OBJECT'], { required:['vector'], optional:['vector','dx','dy','dz'] });
register('ROTATE', ['OBJECT'], { required:['angle'], optional:['angle','axis'] });
register('SCALE', ['UNIFORM'], { required:['factor'], optional:['factor'] });
register('RESIZE', ['OBJECT'], { optional:['width','height','depth','radius'] });
register('REFLECT', ['X_AXIS','Y_AXIS','ORIGIN'], { modes:two });
register('REFLECT', ['XY_PLANE','XZ_PLANE','YZ_PLANE'], { modes:['geometry3d','graph3d'] });
register('CONSTRUCT', ['PERPENDICULAR','PARALLEL','PERPENDICULAR_BISECTOR','TANGENT'], { modes:two });
register('MARK', ['POINT','MIDPOINT','CENTER','INTERSECTION']);
register('SHOW', ['OBJECT','CENTER','MIDPOINT','RADIUS','DIAMETER','INTERSECTION']);
register('HIDE', ['OBJECT']);
register('DELETE', ['OBJECT','ALL']);
register('SELECT', ['OBJECT','ALL']);
register('DESELECT', ['ALL']);
register('DUPLICATE', ['OBJECT']);
register('UNDO', ['LAST']); register('REDO', ['LAST']);
register('COUNT', ['OBJECTS','POINTS','LINES','SHAPES','VERTICES']);
register('COMPARE', ['SIZE','AREA','PERIMETER','LENGTH','VOLUME','SURFACE_AREA']);
register('CHECK', ['PARALLEL','PERPENDICULAR','EQUAL_LENGTH','EQUAL_AREA','POINT_INSIDE','POINT_ON_LINE','POINT_ON_CIRCLE','INTERSECTING'], { modes:two });
for(const op of OPERATIONS){
  if(['VOLUME','SURFACE_AREA'].includes(op.subAction))op.modes=['normal','geometry3d','graph3d'];
  if(op.action==='CHANGE'&&op.subAction!=='ENDPOINTS')op.required=[['POSITION','COORDINATES'].includes(op.subAction)?'position':op.subAction.toLowerCase()];
  if(op.action==='CHANGE'&&op.subAction==='DEPTH')op.modes=['normal','geometry3d','graph3d'];
  if(op.action==='FIND'&&['MIDPOINT','LENGTH','SLOPE'].includes(op.subAction))op.allowedTypes=op.subAction==='MIDPOINT'?['line','vector']:['line','ray','vector'];
  if(['FIND','CHANGE'].includes(op.action)&&['RADIUS','DIAMETER','CIRCUMFERENCE'].includes(op.subAction))op.allowedTypes=['circle','sphere'];
  if(op.action==='FIND'&&['ROOTS','X_INTERCEPT','Y_INTERCEPT'].includes(op.subAction))op.allowedTypes=op.subAction==='ROOTS'?['plot']:['plot','line'];
  if(op.action==='CHANGE'&&['WIDTH','HEIGHT','DEPTH'].includes(op.subAction))op.allowedTypes=['rectangle','square','triangle','cuboid','cube','cylinder','cone','ellipse','ellipsoid','polygon'];
  if(op.action==='CREATE')op.allowedTypes=[op.subAction.toLowerCase()];
  if(op.action==='CREATE')op.required=['LINE','RAY','VECTOR','POINT'].includes(op.subAction)?['points']:op.subAction==='CIRCLE'||op.subAction==='SPHERE'?['radius']:op.subAction==='RECTANGLE'?['width','height']:op.subAction==='SQUARE'||op.subAction==='CUBE'?['width']:[];
}

export const BASELINE_SUBACTIONS=[...new Set(OPERATIONS.filter(op=>op.implemented).map(op=>op.subAction))];
export const BASELINE_OPERATION_KEYS=OPERATIONS.filter(op=>op.implemented).map(op=>`${op.action}:${op.subAction}`);
const unsupportedFamilies: Record<string,string[]> = {
  CREATE:['PLANE','ARC','SECTOR','RIGHT_TRIANGLE','EQUILATERAL_TRIANGLE','ISOSCELES_TRIANGLE'],
  FIND:['ANGLE','INCENTER','CIRCUMCENTER','ORTHOCENTER','VERTEX','MAXIMUM','MINIMUM','DOMAIN','RANGE','ASYMPTOTE','PROJECTION','FOOT_OF_PERPENDICULAR'],
  CONSTRUCT:['ANGLE_BISECTOR','INCIRCLE','CIRCUMCIRCLE','MEDIAN','ALTITUDE'],
  CHANGE:['OPACITY','LINE_WIDTH','LINE_STYLE','POINT_SIZE','FONT_SIZE','FILL_COLOR','STROKE_COLOR','EQUATION','SLOPE','ANGLE','LENGTH'],
  CHECK:['COLLINEAR','CONCURRENT','CONGRUENT','SIMILAR','OVERLAPPING','CONTAINMENT','TANGENT'],
  PLOT:['EQUATION','INEQUALITY','POINTS','PARAMETRIC','POLAR','IMPLICIT','PLANE_3D','VECTOR_FIELD'],
};
for (const [action, subActions] of Object.entries(unsupportedFamilies)) register(action,subActions,{implemented:false,executor:'unsupported'});
for (const action of new Set(LANGUAGE_ACTIONS.map(normalizeAction))) if (!OPERATIONS.some(op=>op.action===action)) register(action,['OBJECT'],{implemented:false,executor:'unsupported'});
function enable(action:string,subAction:string,options:Partial<OperationSpec>={}){
  const existing=OPERATIONS.find(op=>op.action===action&&op.subAction===subAction);
  if(existing)Object.assign(existing,{implemented:true,executor:`${action.toLowerCase()}:${subAction.toLowerCase()}`},options);
  else register(action,[subAction],options);
}
for(const sub of ['INCENTER','CIRCUMCENTER','ORTHOCENTER','TRIANGLE_TYPE','LONGEST_SIDE','LARGEST_ANGLE'])enable('FIND',sub,{modes:two,allowedTypes:['triangle']});
enable('FIND','COORDINATES');enable('FIND','EQUATION',{modes:two,allowedTypes:['line']});
enable('FIND','ANGLE',{modes:two});enable('FIND','PROJECTION',{modes:two});enable('FIND','TOUCHING_POINT',{modes:two});
for(const sub of ['MEDIAN','ALTITUDE','INCIRCLE','CIRCUMCIRCLE','ANGLE_BISECTOR','PROJECTION','NORMAL'])enable('CONSTRUCT',sub,{modes:two});
for(const sub of ['TANGENT','COLLINEAR','POINT_OUTSIDE','RIGHT_TRIANGLE','EQUAL_ANGLES','ORIENTATION','MEDIAL_TRIANGLE'])enable('CHECK',sub,{modes:two});
for(const action of ['LOCK','UNLOCK','EXTEND'])enable(action,'OBJECT',action==='EXTEND'?{allowedTypes:['line'],required:['factor']}:{createsObject:false});
for(const sub of ['LENGTH','SLOPE'])enable('CHANGE',sub,{modes:two,allowedTypes:['line'],required:[sub.toLowerCase()]});
enable('CHANGE','RELATION',{modes:two,required:['relation']});
for(const sub of ['FILL_COLOR','STROKE_COLOR'])enable('CHANGE',sub,{modes:two,required:['color']});
enable('MARK','CENTROID',{modes:two,allowedTypes:['triangle']});
enable('CREATE','SEGMENT',{modes:two});
enable('CONSTRUCT','CONDITIONAL_INTERSECTION',{modes:two});
enable('CHANGE','ANGLE',{modes:two});
enable('CREATE','ANGLE',{modes:two});
enable('CHANGE','LINE_WIDTH',{modes:two});
enable('REFLECT','DIAGONAL',{modes:two});enable('MARK','SIDE_MIDPOINTS',{modes:two});
enable('EXPLAIN','PREVIOUS',{mutatesScene:false,returnsValue:true,createsObject:false});
export function operationFor(action:string,subAction:string) { return OPERATIONS.find(op => op.action===normalizeAction(action)&&op.subAction===subAction); }
export const ACTION_REGISTRY = LANGUAGE_ACTIONS.map(action => ({ action, normalizedAction:normalizeAction(action), aliases:[action.toLowerCase()], operations:OPERATIONS.filter(op=>op.action===normalizeAction(action)) }));

enable('CREATE','PLANE',{modes:['geometry3d','graph3d'],required:[],allowedTypes:[]});
enable('CONSTRUCT','PERP_PLANE',{modes:['geometry3d','graph3d'],allowedTypes:['plane']});
const equationOperation=OPERATIONS.find(o=>o.action==='FIND'&&o.subAction==='EQUATION')!;equationOperation.modes=['normal','geometry2d','graph2d','geometry3d','graph3d'];equationOperation.allowedTypes=['line','plane'];

enable('FIND','INTERSECTION',{modes:allModes});

// Vertex centroid construction is implemented by the 2D and 3D dependency adapters.
enable('MARK','CENTROID',{modes:allModes,allowedTypes:['triangle','rectangle','square','polygon']});
