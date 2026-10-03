import { describe, expect, it } from "vitest";
import { safeEvaluateSurface, sampleSurface, generateSurfaceMeshData } from "../utils/mathEngine/graph3dUtils";
import { sampleImplicitSurface, sampleParametricCurve, sampleParametricSurface } from "./graph3dAdvanced";
import { createGraph3DSurface, migrateGraph3DSurfaces } from "./graph3dSurfaceModel";
import { numericalCases, invalidCases, type RegressionCase } from "./graphRegressionFixtures";
const cases: RegressionCase[]=[];
const add=(name:string,run:()=>void)=>cases.push({name,run});
for(const [expression,x,expected] of numericalCases) add(`numeric z=${expression} at ${x}`,()=>{
 const result=safeEvaluateSurface(`z=${expression}`,x,2); expect(result.valid).toBe(true); expect(result.z).toBeCloseTo(expected,9);
});
for(const expression of invalidCases) add(`invalid ${JSON.stringify(expression)}`,()=>{
 expect(safeEvaluateSurface(expression,1,2).valid).toBe(false); expect(sampleSurface(expression,-2,2,-2,2,8).error).toBeTruthy();
});
const boundCases:Array<[string,number,number,number,number,number,boolean]>=[
 ["x+y",-2,2,-3,3,8,true],["x-y",2,-2,3,-3,10,true],["x*y",-1,1,-2,2,12,true],["Y^2",-2,2,-3,3,8,true],
 ["Z=X+Y",-2,2,-3,3,8,true],["x+y",-2,2,-3,3,1,true],["x+y",-2,2,-3,3,100,true],["x+y",-2,2,-3,3,8.5,true],
 ["x+y",0,0,-3,3,8,false],["x+y",-2,2,0,0,8,false],["x+y",NaN,2,-3,3,8,false],["x+y",-2,Infinity,-3,3,8,false],
 ["x+y",-2,2,NaN,3,8,false],["x+y",-2,2,-3,Infinity,8,false],["x+y",-2,2,-3,3,NaN,false],["x+y",-2,2,-3,3,Infinity,false],
 ["sqrt(-1)",-2,2,-3,3,8,true],["sqrt(x)",-2,2,-3,3,8,true],["1/(x-y)",-2,2,-2,2,9,true],["ln(x)",-2,2,-3,3,8,true],
];
for(const [expression,x0,x1,y0,y1,n,valid] of boundCases) add(`bounds ${expression} [${x0},${x1}] [${y0},${y1}] n=${n}`,()=>{
 const result=sampleSurface(expression,x0,x1,y0,y1,n);
 if(!valid){expect(result.error).toBeTruthy();expect(result.grid).toEqual([]);return;}
 expect(result.error).toBeUndefined();const size=Math.max(8,Math.min(90,Math.round(n)));expect(result.grid).toHaveLength(size);
 expect(result.grid[0][0]).toMatchObject({x:Math.min(x0,x1),y:Math.min(y0,y1)});
 const finite=result.grid.flat().filter(p=>p.valid);if(expression==="sqrt(-1)") {expect(finite).toHaveLength(0);expect(result.warning).toBeTruthy();}
 else { expect(finite.length).toBeGreaterThan(0); expect(result.minZ).toBeCloseTo(Math.min(...finite.map(p=>p.z!)),9);expect(result.maxZ).toBeCloseTo(Math.max(...finite.map(p=>p.z!)),9); }
});
for(const expression of ["0","1","x","y","x+y","x-y","x*y","x^2+y^2","x^2-y^2","sin(x)*cos(y)","sqrt(x)","sqrt(y)","ln(x)","1/x","sqrt(-1)"]) add(`mesh ${expression}`,()=>{
 const samples=sampleSurface(expression,-2,2,-2,2,8);const mesh=generateSurfaceMeshData(samples);
 expect(mesh.positions).toHaveLength(8*8*3);expect(mesh.colors).toHaveLength(mesh.positions.length);expect(mesh.positions.every(Number.isFinite)).toBe(true);expect(mesh.indices.length%3).toBe(0);
 for(const index of mesh.indices) {expect(index).toBeGreaterThanOrEqual(0);expect(index).toBeLessThan(64);expect(samples.grid[Math.floor(index/8)][index%8].valid).toBe(true);}
 if(expression==="sqrt(-1)") expect(mesh.indices).toHaveLength(0); else expect(mesh.indices.length).toBeGreaterThan(0);
});
for(const equation of ["x=0","y=0","z=0","x+y+z=0","x^2+y^2+z^2=1","x^2+y^2=1","x*y-z=0","X+Y+Z=0","x^2-y^2-z=0","sin(x)+y-z=0"]) add(`implicit ${equation}`,()=>{
 const mesh=sampleImplicitSurface(equation,2,12);expect(mesh.error).toBeUndefined();expect(mesh.indices.length).toBeGreaterThan(0);expect(mesh.positions.every(Number.isFinite)).toBe(true);
 for(const index of mesh.indices) expect(index).toBeLessThan(mesh.positions.length/3);
});
for(const z of ["t","t^2","t^3","sin(t)","cos(t)","0","2*t","-t","abs(t)","exp(t)"]) add(`curve z=${z}`,()=>{
 const curve=sampleParametricCurve({x:"cos(t)",y:"sin(t)",z},-1,1,32);expect(curve.error).toBeUndefined();expect(curve.points).toHaveLength(32);
 for(const p of curve.points){expect(p.x*p.x+p.y*p.y).toBeCloseTo(1,9);expect([p.x,p.y,p.z].every(Number.isFinite)).toBe(true);}
});
for(const z of ["0","u","v","u+v","u*v","u^2+v^2","sin(u)*cos(v)","-u^2","sqrt(abs(u))","exp(u)"]) add(`parametric z=${z}`,()=>{
 const mesh=sampleParametricSurface({x:"u",y:"v",z},{uMin:-1,uMax:1,vMin:-2,vMax:2},8);expect(mesh.error).toBeUndefined();expect(mesh.positions).toHaveLength(192);expect(mesh.indices).toHaveLength(7*7*6);
 expect(mesh.positions.slice(0,2)).toEqual([-1,-2]);expect(mesh.positions.slice(-3,-1)).toEqual([1,2]);expect(mesh.positions.every(Number.isFinite)).toBe(true);
});
for(const count of [0,1,2,12,150]) add(`layer lifecycle ${count} surfaces`,()=>{
 const source=Array.from({length:count},(_,i)=>createGraph3DSurface(`x+y+${i}`,i));const migrated=migrateGraph3DSurfaces({surfaces:source});expect(migrated).toHaveLength(count);expect(new Set(migrated.map(s=>s.id)).size).toBe(count);
 migrated.forEach((s,i)=>{expect(s.expression).toBe(`x+y+${i}`);expect(s.opacity).toBeGreaterThan(0);expect(s.opacity).toBeLessThanOrEqual(1);});
});
if(cases.length!==150) throw new Error(`Expected 150 3D cases, got ${cases.length}`);
describe("3D graph: 150 regression cases",()=>cases.forEach((c,i)=>it(`3D-${String(i+1).padStart(3,"0")} ${c.name}`,c.run)));
