import { describe, expect, it } from "vitest";
import {
  upcomingCurriculumItems,
  upcomingCurriculumLanes,
} from "./upcomingCurriculum";

describe("upcoming curriculum catalog", () => {
  it("keeps every expansion item explicitly upcoming and content-rich", () => {
    expect(upcomingCurriculumItems.length).toBeGreaterThanOrEqual(30);
    expect(upcomingCurriculumItems.every((item) => item.status === "upcoming")).toBe(true);
    expect(upcomingCurriculumItems.every((item) => item.topics.length >= 5)).toBe(true);
    expect(upcomingCurriculumItems.every((item) => item.delivery.length > 20)).toBe(true);
  });

  it("uses unique ids and covers every declared lane", () => {
    expect(new Set(upcomingCurriculumItems.map((item) => item.id)).size).toBe(upcomingCurriculumItems.length);
    for (const lane of upcomingCurriculumLanes) {
      expect(upcomingCurriculumItems.some((item) => item.lane === lane)).toBe(true);
    }
  });

  it("includes AP SCERT, school, university, postgraduate and PhD work", () => {
    const searchable = upcomingCurriculumItems
      .flatMap((item) => [item.lane, item.provider, item.levels, item.title, ...item.topics])
      .join(" ")
      .toLowerCase();
    for (const required of ["andhra pradesh scert", "class 6", "applied mathematics", "undergraduate", "postgraduate", "phd", "measure and integration", "algebraic geometry"]) {
      expect(searchable).toContain(required);
    }
  });
});
