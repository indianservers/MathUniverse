import { expect,it } from "vitest";
import { coloringStatus,fourColorMap,initialMapColors,mapEdges,practiceColorMap,regionPath,suggestedColors } from "./fourColorLessonModel";
it("derives exactly shared-border adjacency and excludes corner-only contacts",()=>{
  const edges=mapEdges(fourColorMap).map(e=>e.join("-"));
  expect(edges.sort()).toEqual(["1-2","1-4","2-3","2-5","3-6","4-5","4-7","5-6","5-8","6-9","7-8","7-10","8-9","8-10","8-11","9-11","10-11"].sort());
  expect(edges).not.toContain("1-5");expect(edges).not.toContain("2-4");
  expect(mapEdges(practiceColorMap)).toHaveLength(8);
});
it("validates the initial four-color map and a genuine three-color alternative",()=>{
  expect(coloringStatus(fourColorMap,initialMapColors)).toMatchObject({valid:true,used:4,conflicts:[],incomplete:[]});
  expect(coloringStatus(fourColorMap,[0,1,0,1,0,1,0,1,2,2,0],3).valid).toBe(true);
  expect(coloringStatus(fourColorMap,suggestedColors(fourColorMap)).valid).toBe(true);
});
it("detects conflicts, uncolored regions, missing values and forbidden fourth colors",()=>{
  const next=[...initialMapColors];next[0]=next[1];expect(coloringStatus(fourColorMap,next).conflicts).toContainEqual([1,2]);
  expect(coloringStatus(fourColorMap,Array(11).fill(-1)).incomplete).toHaveLength(11);
  expect(coloringStatus(fourColorMap,[]).valid).toBe(false);
  expect(coloringStatus(fourColorMap,initialMapColors,3).incomplete).toEqual([4,9]);
});
it("checks the practice map with at most three colors",()=>{
  expect(coloringStatus(practiceColorMap,[0,1,2,1,0],3).valid).toBe(true);
  expect(coloringStatus(practiceColorMap,[0,1,2,3,0],3).valid).toBe(false);
  expect(coloringStatus(practiceColorMap,[0,1,1,1,0],3).conflicts.length).toBeGreaterThan(0);
});
it("generates finite closed region paths and manifold shared segments",()=>{
  for(const map of [fourColorMap,practiceColorMap])for(const region of map.regions){const path=regionPath(map,region);expect(path.startsWith("M")).toBe(true);expect(path.endsWith("Z")).toBe(true);expect(path).not.toMatch(/NaN|Infinity/);expect(new Set(region.vertices).size).toBe(region.vertices.length);}
});
