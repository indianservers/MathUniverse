import { describe, expect, it } from "vitest";
import { defaultGraphSettings, generateARGraphObject, generateExplicitSurfaceMesh } from "./arGraphGenerator";
import { circleARPoints, intersectARCircles, triangleARCenters, analyzeARFunction, createARConstruction, exportARMeshOBJ, extrudeARPolygon, generateARPlanarGraph, polygonMetrics, regularARPolygon, resolveARParameters, sectionARMesh, transformARPolygon } from "./arExplorationEngine";
import { parseSceneJson, serializeScene } from "./arInteractiveTools";
import { classifyEquationInput } from "./arEquationClassifier";
const settings={...defaultGraphSettings,resolutionX:20,resolutionY:20};
describe("AR planar graphs",()=>{
 it.each(["y=x^2-4","y=sin(x)","y=1/x","y=sqrt(x)","x=y^2","y^2=x","x^2+4y^2=9","y>sin(x)","r=2cos(3theta)","x=2cos(t),y=3sin(t)","Y^2","y=1e-3*x","y=a*sin(b*x)+c"])("renders %s",input=>{
  const graph=generateARGraphObject(input,settings,{a:2,b:1,c:0});expect(graph.type).toBe("planar_graph");expect(graph.geometry.kind).toBe("curve");if(graph.geometry.kind==="curve")expect(graph.geometry.points.flat().every(Number.isFinite)).toBe(true);
 });
 it("retains the two separate branches of a reciprocal",()=>{const g=generateARPlanarGraph("y=1/x",settings,{});expect(g.segments!.length).toBeGreaterThanOrEqual(2);expect(g.segments!.every(s=>s.every(p=>p[0]>0)||s.every(p=>p[0]<0))).toBe(true);});
 it("does not create a false implicit boundary at a pole",()=>{expect(()=>generateARPlanarGraph("1/x=0",settings,{})).toThrow();});
 it("shades the correct side of an inequality",()=>{const g=generateARPlanarGraph("y>x",settings,{});expect(g.regionPoints!.length).toBeGreaterThan(0);expect(g.regionPoints!.every(([x,y])=>y>x)).toBe(true);});
 it("measures a quadratic derivative and signed integral",()=>{const a=analyzeARFunction("y=x^2",2,[-1,1],{});expect(a.y).toBe(4);expect(a.slope).toBeCloseTo(4,6);expect(a.integral).toBeCloseTo(2/3,8);});
 it("rejects undefined trace and integration points",()=>{expect(()=>analyzeARFunction("1/x",0,[-1,1],{})).toThrow();expect(()=>analyzeARFunction("sqrt(x)",1,[-1,1],{})).toThrow();});
 it("substitutes coefficient parameters without corrupting functions",()=>{expect(resolveARParameters("2a*x+abs(x)",{a:3})).toBe("2(3)*x+abs(x)");});
 it("detects coefficient parameters and ignores scientific e",()=>{expect(classifyEquationInput("z=2a*x+1e-3*y").parameters).toEqual(["a"]);});
 it.each(["y=x+","y=sin()","y=1..2*x","y=window.location","y=alert(1)"])("rejects invalid %s",input=>expect(()=>generateARGraphObject(input,settings,{})).toThrow());
 it("rejects reversed ranges",()=>expect(()=>generateARGraphObject("z=x+y",{...settings,xRange:[5,-5]},{})).toThrow(/ranges/));
});
describe("AR surface parser and sections",()=>{
 it.each([["-x^2",-4],["2^-2*x",.5],["1e-3*x",.002],["sinh(x)",Math.sinh(2)]])("evaluates %s",(expression,value)=>{const mesh=generateExplicitSurfaceMesh({expression:expression as string,xRange:[2,3],yRange:[0,1],resolutionX:8,resolutionY:8,parameters:{},zScale:1});expect(mesh.vertices[1]).toBeCloseTo(value as number,8);});
 it.each(["z=x^2","z=2","z=x^(1/3)+y","x=2u,y=3v,z=4u","x*y*z=1","x^2+y^2-z^2=1","z^2=1"])("renders %s",input=>{const g=generateARGraphObject(input,settings,{});expect(g.geometry.kind).toBe("surface");if(g.geometry.kind==="surface")expect(g.geometry.indices.length).toBeGreaterThan(0);});
 it("renders coefficient-prefixed curve coordinates",()=>expect(generateARGraphObject("x=2t,y=3t,z=4t",settings,{}).geometry.kind).toBe("curve"));
 it("sections an extruded square at exact height",()=>{const mesh=extrudeARPolygon([[-1,-1],[1,-1],[1,1],[-1,1]],2);const section=sectionARMesh(mesh,1,1);expect(section.points.every(p=>Math.abs(p[1]-1)<1e-12)).toBe(true);expect(section.segments!.length).toBe(8);});
 it("rejects a plane outside the mesh",()=>expect(()=>sectionARMesh(extrudeARPolygon([[0,0],[3,0],[0,4]],2),1,3)).toThrow());
 it("exports valid OBJ vertex and face indices",()=>{const g=createARConstruction("Prism",extrudeARPolygon([[0,0],[3,0],[0,4]],2),settings),obj=exportARMeshOBJ(g);expect(obj.split("\n").filter(s=>s.startsWith("v "))).toHaveLength(6);expect(obj.split("\n").filter(s=>s.startsWith("f "))).toHaveLength(8);});
});
describe("AR editable geometry",()=>{
 it("measures a 3–4–5 triangle",()=>{const m=polygonMetrics([[0,0],[3,0],[0,4]]);expect(m.area).toBe(6);expect(m.perimeter).toBe(12);expect(m.angles.reduce((a,b)=>a+b,0)).toBeCloseTo(180,8);expect(m.centroid).toEqual([1,4/3]);});
 it.each([3,4,5,6,8,12,32])("measures a regular %s-gon",n=>{const m=polygonMetrics(regularARPolygon(n,2));expect(m.area).toBeCloseTo(n*2*Math.sin(2*Math.PI/n),8);expect(m.perimeter).toBeCloseTo(n*4*Math.sin(Math.PI/n),8);});
 it("preserves area under rotations and reflections",()=>{const p=regularARPolygon(5,2),area=polygonMetrics(p).area;expect(polygonMetrics(transformARPolygon(p,45,1,[3,-2],true)).area).toBeCloseTo(area,8);});
 it("dilation scales area quadratically and perimeter linearly",()=>{const p=regularARPolygon(6,2),m=polygonMetrics(p),n=polygonMetrics(transformARPolygon(p,0,3,[0,0]));expect(n.area).toBeCloseTo(m.area*9,8);expect(n.perimeter).toBeCloseTo(m.perimeter*3,8);});
 it.each([{points:[[0,0],[1,1],[2,2]]},{points:[[0,0],[2,2],[0,2],[2,0]]},{points:[[0,0],[2,0],[1,1],[2,2],[0,2]]}])("rejects degenerate or unsupported polygons",({points})=>expect(()=>polygonMetrics(points as [number,number][])).toThrow());
 it("serializes the new segmented AR graph with its scene",()=>{const graph=generateARGraphObject("y=1/x",settings,{});const scene=serializeScene({graphs:[graph],solids:[],measurements:[],animations:[],comparison:{enabled:false,mode:"side-by-side",syncScale:true},settings:{showGrid:true,showAxes:true,showLabels:true}});const loaded=parseSceneJson(JSON.stringify(scene));expect(loaded.graphs[0].geometry).toEqual(graph.geometry);});
});

describe("AR classical circle constructions",()=>{
 it("computes two equal-circle intersections",()=>{const points=intersectARCircles([0,0],2,[2,0],2);expect(points).toHaveLength(2);for(const p of points){expect(p[0]).toBeCloseTo(1,10);expect(Math.abs(p[1])).toBeCloseTo(Math.sqrt(3),10);}});
 it("computes exactly one tangent intersection",()=>expect(intersectARCircles([0,0],2,[4,0],2)).toEqual([[2,0]]));
 it("handles non-intersecting, contained and concentric circles",()=>{expect(intersectARCircles([0,0],1,[5,0],1)).toEqual([]);expect(intersectARCircles([0,0],3,[1,0],1)).toEqual([]);expect(intersectARCircles([0,0],3,[0,0],1)).toEqual([]);});
 it("reports coincident circles rather than inventing intersections",()=>expect(()=>intersectARCircles([0,0],2,[0,0],2)).toThrow(/infinitely/));
 it("computes known 3–4–5 triangle centers",()=>{const c=triangleARCenters([[0,0],[3,0],[0,4]]);expect(c.incenter).toEqual([1,1]);expect(c.circumcenter).toEqual([1.5,2]);expect(c.orthocenter).toEqual([0,0]);expect(c.inradius).toBe(1);expect(c.circumradius).toBe(2.5);});
 it("creates a closed finite circle",()=>{const p=circleARPoints([1,2],3);expect(p).toHaveLength(181);for(const [x,y] of p)expect(Math.hypot(x-1,y-2)).toBeCloseTo(3,10);});
});
