import type {MathAstNode,MathAssumption,MathDomain,MathValue} from './types';
/** Versioned extension of the existing MathAstNode/MathValue IR. Render entities
 * are excluded; unsupported definitions are retained with an explicit state. */
export const MATH_IR_VERSION=1 as const;
export type MathUnit={symbol:string;dimension:'dimensionless'|'length'|'area'|'volume'|'angle';scaleToBase:number};
export type Coordinate=number[];
export type MathDefinition=
 |{kind:'scalar'|'exact_rational'|'decimal_approximation';value:MathValue}
 |{kind:'expression'|'equation'|'inequality';ast:MathAstNode}
 |{kind:'coordinate'|'point';coordinates:Coordinate}
 |{kind:'vector'|'line'|'segment'|'ray';points:[Coordinate,Coordinate]}
 |{kind:'circle'|'sphere';center:Coordinate;radius:number}
 |{kind:'polygon'|'triangle'|'rectangle';vertices:Coordinate[]}
 |{kind:'plane';points:[Coordinate,Coordinate,Coordinate]}
 |{kind:'matrix';rows:MathValue[][]}
 |{kind:'transformation';operation:'translation'|'rotation'|'scaling'|'reflection';targets:string[];parameters:Record<string,number|number[]>}
 |{kind:'constraint';relation:string;targets:string[];parameters:Record<string,number|number[]>}
 |{kind:'unsupported';originalKind:string;reason:string};
export type DefinitionState={status:'defined'}|{status:'undefined'|'inconsistent'|'underdetermined'|'unsupported';reason:string};
export type MathObjectIR={id:string;aliases:string[];definition:MathDefinition;state:DefinitionState;unit:MathUnit;domain:MathDomain;assumptions:MathAssumption[];dependencies:string[]};
export type MathObjectGraph={schema:'ruhi-math-object-graph';version:typeof MATH_IR_VERSION;objects:MathObjectIR[]};
export function topologicalObjects(graph:MathObjectGraph):MathObjectIR[]{
 const objects=new Map<string,MathObjectIR>(),visiting=new Set<string>(),visited=new Set<string>(),ordered:MathObjectIR[]=[];
 for(const object of graph.objects){if(typeof object.id!=='string'||!object.id||objects.has(object.id))throw new Error('Missing or duplicate semantic ID.');objects.set(object.id,object);}
 const visit=(id:string)=>{if(visited.has(id))return;if(visiting.has(id))throw new Error(`Dependency cycle at ${id}.`);const object=objects.get(id);if(!object)throw new Error(`Dangling dependency ${id}.`);if(visiting.size>=256)throw new Error('Dependency depth exceeds 256.');visiting.add(id);object.dependencies.forEach(visit);visiting.delete(id);visited.add(id);ordered.push(object);};
 graph.objects.forEach(o=>visit(o.id));return ordered;
}
export function validateMathObjectGraph(graph:MathObjectGraph):void{
 if(graph.schema!=='ruhi-math-object-graph'||graph.version!==MATH_IR_VERSION||!Array.isArray(graph.objects)||graph.objects.length>10000)throw new Error('Unsupported or invalid MathIR schema.');
 topologicalObjects(graph);
 const finite=(value:unknown,depth=0):void=>{if(depth>48)throw new Error('MathIR nesting exceeds 48.');if(value&&typeof value==='object'&&'kind'in value&&value.kind==='RATIONAL'){const r=value as unknown as {numerator:string;denominator:string};if(!/^-?\d+$/.test(r.numerator)||!/^\d+$/.test(r.denominator)||BigInt(r.denominator)===0n)throw new Error('Invalid exact rational.');}if(typeof value==='number'&&!Number.isFinite(value))throw new Error('Nonfinite mathematical definition.');if(Array.isArray(value))value.forEach(v=>finite(v,depth+1));else if(value&&typeof value==='object')Object.values(value).forEach(v=>finite(v,depth+1));};
 for(const object of graph.objects){finite(object.definition);if(!['REAL','COMPLEX','INTEGER','NATURAL','BOOLEAN','UNKNOWN'].includes(object.domain))throw new Error('Invalid mathematical domain.');if(!['dimensionless','length','area','volume','angle'].includes(object.unit.dimension))throw new Error('Invalid unit dimension.');if(!Number.isFinite(object.unit.scaleToBase)||object.unit.scaleToBase<=0)throw new Error('Invalid unit scale.');if(object.state.status!=='defined')continue;
  const d=object.definition;const coordinate=(p:number[])=>{if(!Array.isArray(p)||![2,3].includes(p.length)||p.some(n=>typeof n!=='number'||!Number.isFinite(n)))throw new Error('Coordinates must contain finite numbers in two or three dimensions.');};if('coordinates'in d)coordinate(d.coordinates);if('center'in d)coordinate(d.center);if('points'in d)d.points.forEach(coordinate);if('vertices'in d)d.vertices.forEach(coordinate);if('radius'in d&&typeof d.radius!=='number')throw new Error('Radius must be numeric.');if(d.kind==='matrix'&&(d.rows.length>32||d.rows.some(row=>row.length>32||row.length!==d.rows[0]?.length)))throw new Error('Matrix must be rectangular and at most 32 by 32.');if('coordinates'in d&&![2,3].includes(d.coordinates.length))throw new Error('Coordinate dimension must be two or three.');
  if('radius'in d&&d.radius<=0)throw new Error('Radius must be positive.');if('points'in d&&d.points.some(p=>![2,3].includes(p.length)||p.length!==d.points[0].length))throw new Error('Inconsistent coordinate dimensions.');
  if('vertices'in d&&d.vertices.some(p=>![2,3].includes(p.length)||p.length!==d.vertices[0]?.length))throw new Error('Inconsistent polygon dimensions.');
 }
}
