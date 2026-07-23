import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { lessonCatalog } from "./lessonCatalog";

type BaselineRecord = {
  lessonId: number;
  route: string;
  presetSpecificity: "lesson" | "concept" | "family";
  interactionStatus: "certified" | "generic" | "partial" | "mismatch" | "static" | "missing";
  reasons: string[];
  requiredRemediation: string[];
};

const audit = JSON.parse(readFileSync(resolve(process.cwd(), "docs/lessons/LESSON_PHASE_2_BASELINE_AUDIT.json"), "utf8")) as BaselineRecord[];

describe("Phase 2 unresolved baseline", () => {
  it("covers every canonical lesson exactly once", () => {
    expect(audit).toHaveLength(674);
    expect(new Set(audit.map((record) => record.lessonId)).size).toBe(674);
    expect(new Set(audit.map((record) => record.route)).size).toBe(674);
    expect(audit.map((record) => record.lessonId).sort((a, b) => a - b)).toEqual(lessonCatalog.map((lesson) => lesson.id).sort((a, b) => a - b));
    expect(audit.map((record) => record.route).sort()).toEqual(lessonCatalog.map((lesson) => lesson.route).sort());
  });

  it("does not convert structural validity into certification", () => {
    expect(audit.filter((record) => record.interactionStatus === "certified")).toHaveLength(0);
    expect(audit.every((record) => record.reasons.length > 0 && record.requiredRemediation.length > 0)).toBe(true);
    expect(audit.filter((record) => record.presetSpecificity === "family")).toHaveLength(662);
  });
});
