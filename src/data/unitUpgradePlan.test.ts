import { describe, expect, it } from "vitest";
import { allSyllabusTopics, syllabusLevels } from "./syllabus";
import { syllabusUnitConcepts } from "./syllabusUnitConcepts";
import { topics } from "./topics";
import {
  buildAppTopicUpgradeTargets,
  buildSyllabusTopicUpgradeTargets,
  buildSyllabusUnitUpgradeTargets,
  unitUpgradeSummary,
} from "./unitUpgradePlan";

describe("unit upgrade plan", () => {
  it("covers every app topic with actionable modifications and upgrades", () => {
    const targets = buildAppTopicUpgradeTargets();

    expect(targets).toHaveLength(topics.length);
    expect(targets.every((target) => target.modifications.length > 0)).toBe(true);
    expect(targets.every((target) => target.upgrades.length > 0)).toBe(true);
    expect(targets.every((target) => target.qualityTargets.length > 0)).toBe(true);
  });

  it("covers every syllabus visual concept template", () => {
    const targets = buildSyllabusUnitUpgradeTargets();

    expect(targets).toHaveLength(syllabusUnitConcepts.length);
    expect(targets.every((target) => target.route.startsWith("/"))).toBe(true);
    expect(targets.every((target) => target.modifications.length > 0 && target.upgrades.length > 0)).toBe(true);
  });

  it("keeps statistics and probability on native routes", () => {
    const targets = buildSyllabusTopicUpgradeTargets(allSyllabusTopics);
    const statisticsTargets = targets.filter((target) => ["Statistics", "Probability"].includes(target.unit));

    expect(statisticsTargets.length).toBeGreaterThan(0);
    expect(statisticsTargets.every((target) => target.route.startsWith("/"))).toBe(true);
  });

  it("uses dedicated upgrade rules for every syllabus unit", () => {
    const targets = buildSyllabusTopicUpgradeTargets(allSyllabusTopics);
    const units = new Set(allSyllabusTopics.map((topic) => topic.unit));

    expect(new Set(targets.map((target) => target.unit)).size).toBe(units.size);
    expect(targets.every((target) => target.unit !== "General Mathematics")).toBe(true);
    expect(targets.every((target) => target.qualityTargets.length > 0)).toBe(true);
  });

  it("adds Engineering Mathematics with dedicated upgrade rules", () => {
    const engineering = syllabusLevels.find((level) => level.id === "engineering");
    const targets = buildSyllabusTopicUpgradeTargets(engineering?.topics ?? []);
    const requiredUnits = [
      "Engineering Calculus",
      "Engineering Differential Equations",
      "Engineering Linear Algebra",
      "Engineering Probability and Statistics",
      "Transforms",
      "Partial Differential Equations",
      "Numerical Methods",
      "Operations Research",
      "Vector Calculus",
    ];

    expect(engineering).toBeTruthy();
    expect(engineering?.topics.length).toBeGreaterThan(25);
    expect(requiredUnits.every((unit) => targets.some((target) => target.unit === unit))).toBe(true);
    expect(targets.every((target) => target.unit !== "General Mathematics")).toBe(true);
    expect(targets.every((target) => target.modifications.length > 0 && target.upgrades.length > 0)).toBe(true);
  });

  it("summarizes the upgrade workload", () => {
    const summary = unitUpgradeSummary();

    expect(summary.total).toBeGreaterThan(allSyllabusTopics.length);
    expect(summary.highPriority).toBeGreaterThan(0);
    expect(summary.nativeRoutes).toBe(summary.total);
    expect(summary.unitCount).toBeGreaterThan(5);
  });
});
