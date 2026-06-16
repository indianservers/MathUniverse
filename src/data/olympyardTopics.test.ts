import { describe, expect, it } from "vitest";
import {
  filterOlympyardTopics,
  olympyardDifficulties,
  olympyardGradeBands,
  olympyardTopics,
} from "./olympyardTopics";

describe("olympyard topic metadata", () => {
  it("has unique stable topic ids and valid metadata", () => {
    const ids = new Set(olympyardTopics.map((topic) => topic.id));

    expect(ids.size).toBe(olympyardTopics.length);
    expect(olympyardTopics.length).toBeGreaterThanOrEqual(18);
    expect(olympyardTopicsAllValid()).toBe(true);
  });

  it("filters by grade band", () => {
    const filtered = filterOlympyardTopics(olympyardTopics, "class-1-2", "all");

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((topic) => topic.gradeBands.includes("class-1-2"))).toBe(true);
  });

  it("filters by difficulty", () => {
    const filtered = filterOlympyardTopics(olympyardTopics, "all", "advanced");

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((topic) => topic.difficultyRange.includes("advanced"))).toBe(true);
  });

  it("has selector metadata for all supported filters", () => {
    expect(olympyardSelectorValues(olympyardGradeBandsWithoutAll())).toEqual([
      "class-1-2",
      "class-3-4",
      "class-5-6",
      "class-7-8",
      "class-9-10",
    ]);
    expect(olympyardSelectorValues(olympyardDifficultiesWithoutAll())).toEqual([
      "warm-up",
      "basic",
      "intermediate",
      "advanced",
      "speed",
    ]);
  });
});

function olympyardTopicsAllValid() {
  return olympyardTopics.every((topic) =>
    topic.id.length > 0 &&
    topic.title.length > 0 &&
    topic.description.length > 0 &&
    topic.visualModel.length > 0 &&
    topic.gradeBands.length > 0 &&
    topic.difficultyRange.length > 0 &&
    topic.availableQuestions >= 0 &&
    (!topic.route || topic.route.startsWith("/")),
  );
}

function olympyardSelectorValues(items: Array<{ id: string }>) {
  return items.map((item) => item.id);
}

function olympyardGradeBandsWithoutAll() {
  return olympyardGradeBands.filter((item) => item.id !== "all");
}

function olympyardDifficultiesWithoutAll() {
  return olympyardDifficulties.filter((item) => item.id !== "all");
}
