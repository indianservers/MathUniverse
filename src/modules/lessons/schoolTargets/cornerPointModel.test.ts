import { expect,it } from "vitest";
import { cornerPointModel } from "./cornerPointModel";
it("matches the reference vertices and optimum",()=>{
  const model=cornerPointModel(6,8,3,2);
  expect(model.vertices.map(v=>v.point)).toEqual([[0,0],[6,0],[4,2],[0,4]]);
  expect(model.vertices.map(v=>v.value)).toEqual([0,18,16,8]);
  expect(model.maximum).toBe(18);expect(model.best[0].label).toBe("A");
});
it("recomputes geometry after a boundary edit",()=>{
  const model=cornerPointModel(4,8,3,2);
  expect(model.vertices.map(v=>v.point)).toEqual([[0,0],[4,0],[0,4]]);
  expect(model.maximum).toBe(12);
});
it("recognizes optimal edges, zero and negative objectives",()=>{
  expect(cornerPointModel(6,8,1,1).best.map(v=>v.point)).toEqual([[6,0],[4,2]]);
  expect(cornerPointModel(6,8,0,0).best).toHaveLength(4);
  expect(cornerPointModel(6,8,-3,-2).best[0].point).toEqual([0,0]);
  expect(cornerPointModel(6,8,2,1).maximum).toBe(12);
});
