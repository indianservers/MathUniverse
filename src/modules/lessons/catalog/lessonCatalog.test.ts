import { describe, expect, it } from "vitest";
import { findLesson, lessonCatalog, lessonCategories, lessonsForCategory } from "./lessonCatalog";
import { validateLessonDefinition } from "../engine/lessonContracts";

describe("complete four-phase lesson catalog", () => {
  it("contains all 674 workbook rows exactly once", () => {
    expect(lessonCatalog).toHaveLength(674);
    expect(new Set(lessonCatalog.map((lesson) => lesson.id)).size).toBe(674);
    expect(new Set(lessonCatalog.map((lesson) => lesson.route)).size).toBe(674);
    expect([...lessonCatalog.map((lesson) => lesson.id)].sort((a, b) => a - b)).toEqual(Array.from({ length: 674 }, (_, index) => index + 1));
    expect(lessonCatalog.filter((lesson) => lesson.phase === 1)).toHaveLength(130);
    expect(lessonCatalog.filter((lesson) => lesson.phase === 2)).toHaveLength(225);
    expect(lessonCatalog.filter((lesson) => lesson.phase === 3)).toHaveLength(163);
    expect(lessonCatalog.filter((lesson) => lesson.phase === 4)).toHaveLength(156);
  });

  it("reconciles all fourteen workbook category totals", () => {
    expect(lessonCategories.map((category) => [category.title, category.count])).toEqual([
      ["Core Workspaces", 38], ["Numbers and Arithmetic", 35], ["Authoring and Learning System", 39], ["Platform Capabilities", 18],
      ["Graphs and Functions", 56], ["Algebra", 37], ["Geometry", 90], ["Trigonometry", 20], ["Symbolic Mathematics", 22],
      ["Calculus", 57], ["Data and Probability", 106], ["Advanced Mathematics", 44], ["3D Mathematics", 50], ["Discrete and Applied Mathematics", 62],
    ]);
  });

  it("covers the exact Phase 4 workbook ranges", () => {
    const expected = [...Array.from({ length: 94 }, (_, index) => index + 334), ...Array.from({ length: 62 }, (_, index) => index + 556)];
    expect(lessonCatalog.filter((lesson) => lesson.phase === 4).map((lesson) => lesson.id)).toEqual(expected);
  });

  it("resolves canonical routes and rejects mismatches", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.phase === 4)!;
    expect(findLesson(lesson.categorySlug, `${lesson.id}-${lesson.slug}`)?.id).toBe(lesson.id);
    expect(findLesson(lesson.categorySlug, lesson.slug)).toBeNull();
    expect(findLesson("wrong-category", `${lesson.id}-${lesson.slug}`)).toBeNull();
  });

  it("assigns every topic to an on-demand adapter family", () => {
    expect(new Set(lessonCatalog.map((lesson) => lesson.adapter))).toEqual(new Set(["calculator", "algebra", "number", "authoring", "learning", "platform", "graph", "algebra-cas", "geometry2d", "vector", "trigonometry", "cas", "calculus", "spreadsheet", "statistics", "probability", "inference", "sequence", "matrix", "complex", "geometry3d", "discrete", "finance"]));
    expect(lessonsForCategory("3d-mathematics")).toHaveLength(50);
    expect(lessonsForCategory("discrete-and-applied-mathematics")).toHaveLength(62);
    expect(lessonCatalog.every((lesson) => lesson.purpose && lesson.outcome && lesson.interactions)).toBe(true);
  });

  it("gives every lesson a valid interaction contract and explicit preset diagnostic", () => {
    for (const lesson of lessonCatalog) {
      expect(validateLessonDefinition(lesson), `lesson ${lesson.id}`).toEqual([]);
      expect(lesson.preset.id).toBeTruthy();
      expect(["lesson", "family"]).toContain(lesson.preset.specificity);
      expect(lesson.contract.challengeFactory).toBe(lesson.preset.id);
    }
  });

  it("resolves the Phase 1 priority concepts to exact presets", () => {
    const expected: Record<number, string> = { 359: "matrix.eigen-directions", 404: "geometry3d.solid-net", 443: "cas.first-order-ode", 480: "statistics.box-plot", 576: "discrete.graph-colouring", 582: "discrete.set-builder", 583: "discrete.set-operations", 586: "discrete.power-set", 587: "discrete.truth-table", 588: "discrete.logical-connectives", 589: "discrete.quantifiers", 591: "finance.simple-interest" };
    for (const [id, preset] of Object.entries(expected)) expect(lessonCatalog.find((lesson) => lesson.id === Number(id))?.preset.id).toBe(preset);
  });
});
