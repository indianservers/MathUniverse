import {describe,it,expect} from 'vitest';
import {canonicalPoints,circumcircle,cyclicSAS,legacyObliqueRoute,solveASA,solveSAS,solveSSS,solveSSA,solveProblem,triangleAreaFromSAS,triangleFromPoints,validateTriangleSides} from './triangleMath';
function valid(t:NonNullable<ReturnType<typeof solveSSS>>){expect(t.A+t.B+t.C).toBeCloseTo(180,8);expect(validateTriangleSides(t.a,t.b,t.c)).toBe(true);expect(t.a/Math.sin(t.A*Math.PI/180)).toBeCloseTo(t.b/Math.sin(t.B*Math.PI/180),7);expect(t.area).toBeGreaterThan(0);}
describe('oblique triangle mathematics',()=>{
 it('ASA mandated values',()=>{const t=solveASA(30,45,10)!;expect(t.C).toBe(105);expect(t.b).toBeCloseTo(14.1421356,6);expect(t.c).toBeCloseTo(19.3185165,6);valid(t);});
 it('checks ambiguity for A40 a8 b10',()=>{expect(solveSSA(40,8,10)).toHaveLength(2);});
 it('SAS mandated square root of67',()=>{const t=solveSAS(9,7,60)!;expect(t.a).toBeCloseTo(Math.sqrt(67),9);valid(t);});
 it('SSS mandated angle and sum',()=>{const t=solveSSS(5,6,7)!;expect(t.A).toBeCloseTo(44.4153086,6);valid(t);});
 it('area mandated20',()=>{expect(triangleAreaFromSAS(8,10,30)).toBeCloseTo(20,10);});
 it('two SSA solutions return complete triangles',()=>{const ts=solveSSA(30,7,10);expect(ts).toHaveLength(2);expect(ts[0].B).toBeCloseTo(45.5846914,6);expect(ts[1].B).toBeCloseTo(134.4153086,6);ts.forEach(valid);});
 it('SSA no reach',()=>{expect(solveSSA(30,4,10)).toHaveLength(0);});
 it('SSA tangent returns one right triangle without duplicate',()=>{const ts=solveSSA(30,5,10);expect(ts).toHaveLength(1);expect(ts[0].B).toBeCloseTo(90,6);});
 it.each([[110,8,10,0],[110,10,10,0],[110,12,10,1],[90,10,10,0],[90,12,10,1],[35,10,10,1],[35,12,10,1]])('obtuse/right/equal edge A%s a%s b%s ->%s',(A,a,b,n)=>{const ts=solveSSA(A,a,b);expect(ts).toHaveLength(n);ts.forEach(valid);});
 it.each([[1,2,10],[1,2,3],[0,3,3],[-1,2,2],[NaN,2,2],[Infinity,2,2],[1e-11,1,1]])('rejects invalid or numerically degenerate sides', (a,b,c)=>{expect(solveSSS(a,b,c)).toBeNull();});
 it.each([[0,40,2],[90,90,2],[-1,30,2],[NaN,30,2],[50,50,0]])('rejects invalid ASA',(A,B,a)=>{expect(solveASA(A,B,a)).toBeNull();});
 it('does not clamp unreachable data into a fake right triangle',()=>{expect(solveSSA(30,4.999,10)).toHaveLength(0);});
 it('handles floating tolerance at tangent',()=>{expect(solveSSA(30,5*(1-1e-12),10)).toHaveLength(1);});
 it('cyclic forms and point geometry agree',()=>{for(const v of ['A','B','C'] as const){const t=cyclicSAS(8.4,10.2,47,v)!;expect(t[v]).toBeCloseTo(47,9);expect(t.area).toBeCloseTo(31.33119257736526,7);const rt=triangleFromPoints(canonicalPoints(t))!;valid(rt);expect(rt.area).toBeCloseTo(t.area,8);}});
 it('circumcircle passes through all vertices',()=>{const pts=canonicalPoints(solveSSS(5,6,7)!),c=circumcircle(pts)!;for(const v of Object.values(pts))expect(Math.hypot(v.x-c.center.x,v.y-c.center.y)).toBeCloseTo(c.radius,9);});
 it.each(['ASA','AAS','SAS','SSS','SSA'] as const)('complete solver %s',(k)=>{const ts=solveProblem(k,{A:35,B:62,C:83,a:7,b:10,c:12});expect(ts.length).toBeGreaterThan(0);ts.forEach(valid);});
 it('normalizes old modes',()=>{for(const [name,slug] of [['Sine Law','sine-law'],['SineLaw','sine-law'],['CosineLaw','cosine-law'],['Area','area'],['SSA Ambiguous Case','ssa-ambiguous-case'],['SSAAmbiguousCase','ssa-ambiguous-case'],['Solve Triangle','solve-triangle']])expect(legacyObliqueRoute(name)).toBe(slug);});
 it('fuzzes valid SAS geometry and SSA candidate consistency',()=>{for(let i=1;i<=160;i++){const b=1+i*.07,c=2+i*.03,A=1+i*1.1,t=solveSAS(b,c,A)!;valid(t);const ts=solveSSA(t.A,t.a,t.b);expect(ts.length).toBeGreaterThan(0);ts.forEach(valid);expect(ts.some(s=>Math.abs(s.c-t.c)<1e-7)).toBe(true);}});
});
