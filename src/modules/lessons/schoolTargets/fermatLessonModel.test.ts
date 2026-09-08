import { expect,it } from "vitest";
import { checkFermatPractice,compareFermatPowers,floorPowerRoot,searchFermat } from "./fermatLessonModel";
it("distinguishes squares and cubes exactly",()=>{
  expect(compareFermatPowers(3,4,2)).toMatchObject({ap:9n,bp:16n,sum:25n,lower:5n,equal:true});
  expect(compareFermatPowers(3,4,3)).toMatchObject({sum:91n,lower:4n,lowerPower:64n,upperPower:125n,equal:false});
  expect(compareFermatPowers(20,20,10).sum).toBe(20480000000000n);
});
it("brackets exact integer roots without floating-point equality",()=>{
  for(let n=2;n<=10;n++) for(let k=1n;k<=100n;k++) {
    const p=k**BigInt(n);expect(floorPowerRoot(p,n)).toBe(k);expect(floorPowerRoot(p-1n,n)).toBe(k-1n);expect(floorPowerRoot(p+1n,n)).toBe(k);
  }
});
it("searches bounded triples and applies the candidate constraint",()=>{
  expect(searchFermat(5,2,true).solutions).toEqual([{a:3,b:4,c:5}]);
  const restricted=searchFermat(100,2,true),full=searchFermat(100,2,false);
  expect(restricted.solutions).toEqual(full.solutions);expect(restricted.pairs).toBe(5050);expect(restricted.candidateTriples).toBeLessThan(full.candidateTriples);
  for(let n=3;n<=10;n++)expect(searchFermat(100,n,true).solutions).toEqual([]);
});
it("matches an independent exhaustive finite search",()=>{
  for(const n of [2,3,4]) {const expected=[];for(let a=1;a<=20;a++)for(let b=a;b<=20;b++)for(let c=1;c<=20;c++)if(a**n+b**n===c**n)expected.push({a,b,c});expect(searchFermat(20,n,true).solutions).toEqual(expected);}
});
it("rejects unsupported inputs and false practice answers",()=>{
  expect(()=>compareFermatPowers(0,4,2)).toThrow();expect(()=>compareFermatPowers(3,4,2.5)).toThrow();expect(()=>floorPowerRoot(-1n,2)).toThrow();expect(()=>searchFermat(101,3,true)).toThrow();
  expect(checkFermatPractice(["3","4","5"],"91","finite")).toBe(true);
  expect(checkFermatPractice(["12","5","13"],"91","finite")).toBe(true);
  for(const triple of [["0","1","1"],["3","4","6"],["","",""]])expect(checkFermatPractice(triple,"91","finite")).toBe(false);
  expect(checkFermatPractice(["3","4","5"],"91","proof")).toBe(false);
});
