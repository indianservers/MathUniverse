import { parseMath } from "../math-foundation/parser";
import { compileFunctionExpression, compileThreeVariableExpression, compileTwoVariableExpression } from "../utils/functionParser";
import type { MathAssumption, MathAstNode, MathDiagnostic } from "../math-foundation/types";
import type { AccuracyProfile, Bounds3, ExplicitSurfaceNode, ImplicitSurfaceNode, Math3DBase, Math3DNode, Mesh3D, ParameterDomain, ParametricSurfaceNode, SolidRegionNode, SpaceCurveNode, Vec3, VectorFieldNode } from "./types";

const defaultBounds: Bounds3 = { x: [-4, 4], y: [-4, 4], z: [-4, 4] };
let nodeSequence = 0;
const stableId = (prefix: string) => `${prefix}-${++nodeSequence}`;
const astFor = (source: string): { ast: MathAstNode[]; diagnostics: MathDiagnostic[] } => { const parsed = parseMath(source); return { ast: parsed.ast ? [parsed.ast] : [], diagnostics: parsed.diagnostics }; };
const provenance = (id: string, operation: string, inputs: string[] = []) => [{ id: `${operation.toLowerCase()}-${id}`, operation, inputNodeIds: inputs, timestamp: new Date(0).toISOString(), description: `${operation} by Phase 5 universal 3D engine.` }];

function base(kind: Math3DNode["kind"], label: string, definition: string, astSources: string[], parameters: ParameterDomain[] = [], assumptions: MathAssumption[] = [], id = stableId(kind.toLowerCase())): Math3DBase {
  const parsed = astSources.map(astFor);
  return { id, kind, label, definition, astReferences: parsed.flatMap((entry) => entry.ast), parameters, assumptions, units: { coordinate: "unit" }, dependencies: [], precision: 10, tolerance: 1e-4, rendering: { visible: true, opacity: .86, mode: "SOLID_MESH", color: "#22d3ee" }, accessibilityDescription: `${label} is defined by ${definition}.`, computationStatus: parsed.some((entry) => entry.diagnostics.some((d) => d.severity === "ERROR")) ? "FAILED" : "IDLE", diagnostics: parsed.flatMap((entry) => entry.diagnostics), provenance: provenance(id, "DEFINE_3D"), serializationVersion: 1 };
}

export function createExplicitSurface(definition: string, domains: ParameterDomain[] = domains2("x", "y"), id?: string): ExplicitSurfaceNode {
  const match = definition.replaceAll("²", "^2").match(/^\s*([xyz])\s*=\s*(.+)$/i); if (!match) throw new Error("Explicit surfaces use z=f(x,y), x=f(y,z), or y=f(x,z).");
  const axis = match[1].toLowerCase() as "x" | "y" | "z"; const expression = match[2];
  compileTwoVariableExpression(remapExplicit(expression, axis));
  return { ...base("EXPLICIT_SURFACE", "Explicit surface", definition, [expression], domains, [], id), kind: "EXPLICIT_SURFACE", dependentAxis: axis, expression, exactRepresentation: definition };
}

export function createParametricSurface(definition: string, u = domain("u"), v = domain("v"), id?: string): ParametricSurfaceNode {
  const components = parseVectorDefinition(definition, /^\s*r\s*\(\s*u\s*,\s*v\s*\)\s*=\s*/i); components.forEach((entry) => compileTwoVariableExpression(renameParameters(entry, "u", "v")));
  return { ...base("PARAMETRIC_SURFACE", "Parametric surface", definition, components.map((entry) => renameParameters(entry, "u", "v")), [u, v], [], id), kind: "PARAMETRIC_SURFACE", componentExpressions: components, exactRepresentation: definition };
}

export function createImplicitSurface(definition: string, bounds: Bounds3 = defaultBounds, id?: string): ImplicitSurfaceNode {
  const normalized = definition.replaceAll("²", "^2"); const parts = normalized.split("="); const expression = parts.length === 2 ? `((${parts[0]})-(${parts[1]}))` : normalized;
  compileThreeVariableExpression(expression);
  return { ...base("IMPLICIT_SURFACE", "Implicit surface", definition, [expression], [], [], id), kind: "IMPLICIT_SURFACE", expression, isoValue: 0, exactRepresentation: definition, numericalRepresentation: { bounds } };
}

export function createSpaceCurve(definition: string, t = { ...domain("t"), min: 0, max: 2 * Math.PI }, id?: string): SpaceCurveNode {
  const components = parseVectorDefinition(definition, /^\s*r\s*\(\s*t\s*\)\s*=\s*/i); components.forEach((entry) => compileFunctionExpression(entry.replace(/\bt\b/g, "x")));
  return { ...base("SPACE_CURVE", "Space curve", definition, components.map((entry) => entry.replace(/\bt\b/g, "x")), [t], [], id), kind: "SPACE_CURVE", componentExpressions: components, exactRepresentation: definition };
}

export function createVectorField(definition: string, bounds: Bounds3 = defaultBounds, normalized = false, id?: string): VectorFieldNode {
  const components = parseVectorDefinition(definition, /^\s*[A-Za-zφΦ]+\s*\(\s*x\s*,\s*y\s*,\s*z\s*\)\s*=\s*/); components.forEach(compileThreeVariableExpression);
  return { ...base("VECTOR_FIELD", "Vector field", definition, components, [], [], id), kind: "VECTOR_FIELD", componentExpressions: components, bounds, normalized, exactRepresentation: definition };
}

export function createSolidRegion(definition:string,bounds:Bounds3=defaultBounds,id?:string):SolidRegionNode{const predicates=definition.replaceAll("²","^2").split(/\s+(?:and|&&)\s+/i).map(s=>s.trim());predicates.forEach(compilePredicate);return{...base("SOLID_REGION","Solid region",definition,predicates,[],[],id),kind:"SOLID_REGION",predicates,booleanOperation:"INTERSECTION",bounds,exactRepresentation:definition};}
export function sampleSolidRegion(node:SolidRegionNode,resolution=18){const tests=node.predicates.map(compilePredicate),points:Vec3[]=[];let inside=0;for(let i=0;i<resolution;i++)for(let j=0;j<resolution;j++)for(let k=0;k<resolution;k++){const p={x:lerp(node.bounds.x,(i+.5)/resolution),y:lerp(node.bounds.y,(j+.5)/resolution),z:lerp(node.bounds.z,(k+.5)/resolution)};if(tests.every(fn=>fn(p.x,p.y,p.z))){inside++;if(i===0||j===0||k===0||i===resolution-1||j===resolution-1||k===resolution-1||((i+j+k)%3===0))points.push(p);}}const boxVolume=(node.bounds.x[1]-node.bounds.x[0])*(node.bounds.y[1]-node.bounds.y[0])*(node.bounds.z[1]-node.bounds.z[0]);return{points,inside,total:resolution**3,volume:boxVolume*inside/resolution**3,resolution,estimatedError:boxVolume/Math.sqrt(resolution**3)};}

export function sampleExplicit(node: ExplicitSurfaceNode, profile: AccuracyProfile = "BALANCED", generation = 1): Mesh3D {
  const resolution = profileResolution(profile); const [a, b] = node.parameters; const fn = compileTwoVariableExpression(remapExplicit(node.expression, node.dependentAxis)); const vertices: Vec3[] = [];
  for (let j=0;j<resolution;j++) for(let i=0;i<resolution;i++){const p=a.min+i/(resolution-1)*(a.max-a.min);const q=b.min+j/(resolution-1)*(b.max-b.min);const value=fn(p,q);vertices.push(node.dependentAxis==="z"?{x:p,y:q,z:value}:node.dependentAxis==="x"?{x:value,y:p,z:q}:{x:p,y:value,z:q});}
  const triangles:gridTriangle[]=[];for(let j=0;j<resolution-1;j++)for(let i=0;i<resolution-1;i++){const k=j*resolution+i;triangles.push([k,k+1,k+resolution],[k+1,k+resolution+1,k+resolution]);}
  return finishMesh(vertices,triangles,`ADAPTIVE_EXPLICIT_GRID`,profile,resolution,generation);
}
type gridTriangle=[number,number,number];

export function sampleParametric(node: ParametricSurfaceNode, profile: AccuracyProfile = "BALANCED", generation = 1): Mesh3D {
  const resolution=profileResolution(profile),[u,v]=node.parameters;const f=node.componentExpressions.map((e)=>compileTwoVariableExpression(renameParameters(e,"u","v")));const vertices:Vec3[]=[];
  for(let j=0;j<resolution;j++)for(let i=0;i<resolution;i++){const a=u.min+i/(resolution-1)*(u.max-u.min),b=v.min+j/(resolution-1)*(v.max-v.min);vertices.push({x:f[0](a,b),y:f[1](a,b),z:f[2](a,b)});}
  const triangles:gridTriangle[]=[];for(let j=0;j<resolution-1;j++)for(let i=0;i<resolution-1;i++){const k=j*resolution+i;triangles.push([k,k+1,k+resolution],[k+1,k+resolution+1,k+resolution]);}
  return finishMesh(vertices,triangles,"ADAPTIVE_PARAMETRIC_GRID",profile,resolution,generation);
}

export function extractImplicit(node: ImplicitSurfaceNode, bounds: Bounds3 = (node.numericalRepresentation as {bounds?:Bounds3})?.bounds ?? defaultBounds, profile: AccuracyProfile = "BALANCED", generation = 1, isCancelled:()=>boolean=()=>false): Mesh3D {
  const resolution=Math.min(36,profileResolution(profile));const fn=compileThreeVariableExpression(node.expression);const vertices:Vec3[]=[];const triangles:gridTriangle[]=[];const nx=resolution,ny=resolution,nz=resolution;const value=(i:number,j:number,k:number)=>fn(lerp(bounds.x,i/(nx-1)),lerp(bounds.y,j/(ny-1)),lerp(bounds.z,k/(nz-1)))-node.isoValue;
  const point=(i:number,j:number,k:number):Vec3=>({x:lerp(bounds.x,i/(nx-1)),y:lerp(bounds.y,j/(ny-1)),z:lerp(bounds.z,k/(nz-1))});
  const tetra=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];let cells=0;
  for(let k=0;k<nz-1;k++)for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){if(isCancelled())return {...finishMesh(vertices,triangles,"CANCELLED_MARCHING_TETRAHEDRA",profile,resolution,generation),refinementState:"COARSE",topologyWarnings:["Computation cancelled before completion."]};const ps=[point(i,j,k),point(i+1,j,k),point(i+1,j+1,k),point(i,j+1,k),point(i,j,k+1),point(i+1,j,k+1),point(i+1,j+1,k+1),point(i,j+1,k+1)];const vs=[value(i,j,k),value(i+1,j,k),value(i+1,j+1,k),value(i,j+1,k),value(i,j,k+1),value(i+1,j,k+1),value(i+1,j+1,k+1),value(i,j+1,k+1)];if(vs.every(v=>v>0)||vs.every(v=>v<0))continue;for(const t of tetra)polygoniseTetra(t.map(n=>ps[n]),t.map(n=>vs[n]),vertices,triangles);cells++;}
  const mesh=finishMesh(vertices,triangles,"ADAPTIVE_SIGN_CELL_MARCHING_TETRAHEDRA",profile,resolution,generation);mesh.estimatedError=Math.max(...bounds.x.map(Math.abs),...bounds.y.map(Math.abs),...bounds.z.map(Math.abs))*Math.sqrt(3)/(resolution-1);if(cells===0)mesh.topologyWarnings.push("No sign-changing cells were found; the surface may be outside the bounds or tangent within a cell.");return mesh;
}

function polygoniseTetra(points:Vec3[],values:number[],vertices:Vec3[],triangles:gridTriangle[]){const hits:Vec3[]=[];for(const [a,b] of [[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]])if((values[a]<=0&&values[b]>0)||(values[a]>0&&values[b]<=0)){const t=values[a]/(values[a]-values[b]);hits.push({x:points[a].x+t*(points[b].x-points[a].x),y:points[a].y+t*(points[b].y-points[a].y),z:points[a].z+t*(points[b].z-points[a].z)});}if(hits.length<3)return;const start=vertices.length;vertices.push(...hits);triangles.push([start,start+1,start+2]);if(hits.length===4)triangles.push([start,start+2,start+3]);}
function finishMesh(vertices:Vec3[],triangles:gridTriangle[],algorithm:string,profile:AccuracyProfile,resolution:number,generation:number):Mesh3D{const valid=triangles.filter(t=>triangleArea(vertices[t[0]],vertices[t[1]],vertices[t[2]])>1e-12);const normals=vertices.map(()=>({x:0,y:0,z:0}));valid.forEach(t=>{const n=normalize(cross(sub(vertices[t[1]],vertices[t[0]]),sub(vertices[t[2]],vertices[t[0]])));t.forEach(i=>{normals[i]=add(normals[i],n)});});return{vertices,triangles:valid,normals:normals.map(normalize),bounds:boundsOf(vertices),algorithm,profile,resolution,triangleCount:valid.length,estimatedError:1/Math.max(1,resolution-1),refinementState:profile==="PERFORMANCE"?"COARSE":profile==="BALANCED"?"REFINED":"FINAL",topologyWarnings:valid.length===0?["Mesh is empty."]:[],generation,deterministic:profile==="DETERMINISTIC_EXPORT"};}

export function sampleCurve(node:SpaceCurveNode,count=240){const t=node.parameters[0];const fn=node.componentExpressions.map(e=>compileFunctionExpression(e.replace(/\bt\b/g,"x")));return Array.from({length:count},(_,i)=>{const q=t.min+i/(count-1)*(t.max-t.min);return{x:fn[0](q),y:fn[1](q),z:fn[2](q)};});}
export function evaluateVectorField(node:VectorFieldNode,p:Vec3){const f=node.componentExpressions.map(compileThreeVariableExpression);const v={x:f[0](p.x,p.y,p.z),y:f[1](p.x,p.y,p.z),z:f[2](p.x,p.y,p.z)};return node.normalized?normalize(v):v;}
export function parseGeneral3D(input:string):Math3DNode{if(/^\s*[xyz]\s*=/i.test(input))return createExplicitSurface(input);if(/^\s*r\s*\(\s*u\s*,/i.test(input))return createParametricSurface(input);if(/^\s*r\s*\(\s*t\s*\)/i.test(input))return createSpaceCurve(input);if(/^\s*[A-Za-zφΦ]+\s*\(\s*x\s*,\s*y\s*,\s*z/i.test(input)&&/[<⟨]/.test(input))return createVectorField(input);if(/<=|>=|≤|≥/.test(input))return createSolidRegion(input);if(input.includes("="))return createImplicitSurface(input);throw new Error("Enter an explicit, parametric, implicit, curve, solid-region, or vector-field definition.");}
export const vector={add,sub,cross,normalize,dot:(a:Vec3,b:Vec3)=>a.x*b.x+a.y*b.y+a.z*b.z,length:(a:Vec3)=>Math.hypot(a.x,a.y,a.z)};
function domain(name:string):ParameterDomain{return{name,min:-2,max:2,minInclusive:true,maxInclusive:true};}function domains2(a:string,b:string){return[domain(a),domain(b)];}function profileResolution(p:AccuracyProfile){return p==="PERFORMANCE"?18:p==="BALANCED"?32:p==="HIGH_ACCURACY"?54:48;}function remapExplicit(e:string,axis:string){return axis==="z"?e:axis==="x"?e.replace(/\by\b/g,"x").replace(/\bz\b/g,"y"):e.replace(/\bz\b/g,"y");}function renameParameters(e:string,a:string,b:string){return e.replace(new RegExp(`\\b${a}\\b`,"g"),"x").replace(new RegExp(`\\b${b}\\b`,"g"),"y");}function parseVectorDefinition(input:string,prefix:RegExp):[string,string,string]{const raw=input.replace(prefix,"").trim().replace(/^<|>$/g,"").replace(/^⟨|⟩$/g,"");const parts=raw.split(",").map(s=>s.trim());if(parts.length!==3)throw new Error("A 3D vector definition requires three components.");return parts as [string,string,string];}function compilePredicate(source:string){const match=source.replace("≤","<=").replace("≥",">=").match(/^(.+?)(<=|>=|<|>)(.+)$/);if(!match)throw new Error(`Unsupported solid predicate: ${source}`);const left=compileThreeVariableExpression(match[1]),right=compileThreeVariableExpression(match[3]);return(x:number,y:number,z:number)=>{const a=left(x,y,z),b=right(x,y,z);return match[2]==="<="?a<=b:match[2]===">="?a>=b:match[2]==="<"?a<b:a>b;};}function lerp(r:[number,number],t:number){return r[0]+t*(r[1]-r[0]);}function add(a:Vec3,b:Vec3):Vec3{return{x:a.x+b.x,y:a.y+b.y,z:a.z+b.z};}function sub(a:Vec3,b:Vec3):Vec3{return{x:a.x-b.x,y:a.y-b.y,z:a.z-b.z};}function cross(a:Vec3,b:Vec3):Vec3{return{x:a.y*b.z-a.z*b.y,y:a.z*b.x-a.x*b.z,z:a.x*b.y-a.y*b.x};}function normalize(a:Vec3):Vec3{const l=Math.hypot(a.x,a.y,a.z)||1;return{x:a.x/l,y:a.y/l,z:a.z/l};}function triangleArea(a:Vec3,b:Vec3,c:Vec3){return Math.hypot(...Object.values(cross(sub(b,a),sub(c,a))))/2;}function boundsOf(v:Vec3[]):Bounds3{return v.length?{x:[Math.min(...v.map(p=>p.x)),Math.max(...v.map(p=>p.x))],y:[Math.min(...v.map(p=>p.y)),Math.max(...v.map(p=>p.y))],z:[Math.min(...v.map(p=>p.z)),Math.max(...v.map(p=>p.z))]}:structuredClone(defaultBounds);}
