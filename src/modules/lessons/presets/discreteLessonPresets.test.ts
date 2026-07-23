import { describe,expect,it } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import { discreteLessonPreset,discreteLessonPresets } from "./discreteLessonPresets";

describe("discrete concept preset registry",()=>{
 it("exhaustively maps all 35 discrete lessons without title fallback",()=>{
  const ids=lessonCatalog.filter(lesson=>lesson.adapter==="discrete").map(lesson=>lesson.id);
  expect(discreteLessonPresets.map(preset=>preset.lessonId)).toEqual(ids);
  expect(ids.every(id=>discreteLessonPreset(id).id.startsWith("discrete."))).toBe(true);
  expect(ids.every(id=>lessonCatalog.find(lesson=>lesson.id===id)?.preset.specificity==="lesson")).toBe(true);
 });
 it("keeps unrelated graph and set concepts in distinct modes",()=>{
  expect(discreteLessonPreset(574).mode).toBe("mst");
  expect(discreteLessonPreset(575).mode).toBe("shortest-path");
  expect(discreteLessonPreset(584).mode).toBe("complement");
  expect(discreteLessonPreset(585).mode).toBe("cartesian-product");
 });
});
