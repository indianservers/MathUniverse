import{describe,it,expect}from'vitest';
import{asaInitial10030 as initial,asaStart10030,asaSolve10030,asaSet10030,asaLayout10030,asaGrip10030,asaProject10030,asaGrade10030,asaHandles10030}from'./asaConstructionModel10030';
describe('ASA construction10030',()=>{
 it('solves exact reference, right/obtuse angles and rejects backward/parallel/degenerate rays',()=>{
  const s=asaSolve10030(initial);expect(s.c).toBe(65);expect(s.ac).toBeCloseTo(7);expect(s.bc).toBeCloseTo(7*Math.sin(50*Math.PI/180)/Math.sin(65*Math.PI/180));expect(asaSolve10030({a:90,b:30,side:7}).x).toBeCloseTo(0);expect(asaSolve10030({a:110,b:40,side:7}).x).toBeLessThan(0);
  for(const d of[{a:110,b:80,side:7},{a:90,b:90,side:7},{a:0,b:50,side:7},{a:30,b:50,side:0},{a:NaN,b:50,side:7}]){const q=asaSolve10030(d);expect(q.valid).toBe(false);expect(q.x).toBeNull();expect(q.ac).toBeNull();}
 });
 it('fits every integer angle pair and preserves actual lengths, ray directions and drag round trips',()=>{
  let valid=0,pairs=0;
  // Use numeric invariants inside the exhaustive loop; report the first failing
  // pair directly instead of allocating a million assertion objects.
  for(let a=10;a<=150;a++)for(let b=10;b<=150;b++){
   const check=(condition:boolean,what:string)=>{if(!condition)throw new Error(`${what}: A=${a}, B=${b}`);};
   const data={a,b,side:7},g=asaLayout10030(data),hs=asaHandles10030(data,g);pairs++;
   check(Math.hypot(hs.a.x-hs.b.x,hs.a.y-hs.b.y)>24,'Distinct handle centers');
   for(const[key,p,n]of[['a',g.a,a],['b',g.b,b]]as const)for(const h of[asaGrip10030(p,n,key),hs[key]]){
    check(h.x>=24.999&&h.x<=575.001&&h.y>=34.999,'In-bounds handle');
    check(asaProject10030(p,h.x,h.y,key)===n,'Round-trip ray projection');
   }
   if(g.c){valid++;check(g.c.x>=59.999&&g.c.x<=540.001&&g.c.y>=79.999&&g.c.y<470,'Fitted vertex');
    check(Math.abs(Math.hypot(g.c.x-g.a.x,g.c.y-g.a.y)/g.frame.scale-g.ac!)<1e-7,'AC length');
    check(Math.abs(Math.hypot(g.c.x-g.b.x,g.c.y-g.b.y)/g.frame.scale-g.bc!)<1e-7,'BC length');
    check(g.a.x>=59.999&&g.b.x<=540.001,'Fitted base');
   }else check(a+b>=180,'No missing valid vertex');
  }
  expect(pairs).toBe(19881);expect(valid).toBe(12500);
 },60000);
 it('clamps finite controls and requires learner changes to both rays before a valid challenge check',()=>{
  expect(asaSet10030(initial,'side',99).side).toBe(12);expect(asaSet10030(initial,'a',0).a).toBe(10);expect(asaSet10030(initial,'b',Infinity)).toBe(initial);expect(asaGrade10030(false,initial)).toBe('idle');expect(asaGrade10030(true,asaStart10030)).toBe('retry');expect(asaGrade10030(true,{a:50,b:80,side:7})).toBe('retry');expect(asaGrade10030(true,initial)).toBe('correct');expect(asaGrade10030(true,{...initial,side:8})).toBe('retry');expect(asaProject10030({x:0,y:0},-10,20,'a')).toBe(150);
 });
});
