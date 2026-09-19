import { describe, expect, it } from "vitest";
import { classifyLessonPanel, normalizeLessonTab } from "./dedicatedLessonTabs";

describe("dedicated lesson tabs", () => {
  it("maps the standard five-tab labels", () => {
    expect(normalizeLessonTab("Interact")).toBe("interact");
    expect(normalizeLessonTab("Learn")).toBe("learn");
    expect(normalizeLessonTab("Worked Example")).toBe("example");
    expect(normalizeLessonTab("Formula")).toBe("formula");
    expect(normalizeLessonTab("Practice")).toBe("practice");
    expect(normalizeLessonTab("Reset")).toBeNull();
  });

  it("classifies lesson panels from headings", () => {
    expect(classifyLessonPanel("EXPRESSION WORKBENCH")).toEqual(["interact"]);
    expect(classifyLessonPanel("WHY IT WORKS")).toEqual(["learn"]);
    expect(classifyLessonPanel("WORKED EXAMPLE")).toEqual(["example"]);
    expect(classifyLessonPanel("KEY RULES")).toEqual(["formula"]);
    expect(classifyLessonPanel("MINI CHALLENGE")).toEqual(["practice"]);
  });
});
