import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import { coreWorkspaceHandAuthoredLessonIds } from "../strengthening/coreWorkspaceHandAuthoredOverlay";
import { LessonTopicStudyBoard } from "./LessonTopicStudyBoard";

describe("LessonTopicStudyBoard", () => {
  it("hides on the interaction canvas and shows labelled charts on a study view", () => {
    const hidden = renderToStaticMarkup(
      <LessonTopicStudyBoard lessonId={2} view="interaction" />,
    );
    expect(hidden).toBe("");

    const html = renderToStaticMarkup(
      <LessonTopicStudyBoard lessonId={2} view="examples" />,
    );
    expect(html).toContain('data-testid="lesson-study-board-2"');
    expect(html).toContain("Fraction Calculator labelled charts");
    expect(html).toContain("x: Part");
    expect(html).toContain("Add 1/2 + 3/4");
    expect(html).toContain("5/4");
    expect(html).toContain('aria-label="Fraction Calculator study probe"');
  });

  it("covers lessons 1-30 with unique hand-authored introductions and three numerical examples", () => {
    expect(coreWorkspaceHandAuthoredLessonIds).toEqual(
      Array.from({ length: 30 }, (_, index) => index + 1),
    );
    const introductions = new Set<string>();
    for (const id of coreWorkspaceHandAuthoredLessonIds) {
      const lesson = getStrengthenedFoundationLesson(id);
      expect(lesson, `lesson ${id}`).not.toBeNull();
      expect(lesson!.introduction.length).toBeGreaterThanOrEqual(220);
      expect(lesson!.definitions[0]?.statement.length).toBeGreaterThanOrEqual(120);
      expect(lesson!.workedExamples.length).toBeGreaterThanOrEqual(3);
      expect(introductions.has(lesson!.introduction), `duplicate intro ${id}`).toBe(false);
      introductions.add(lesson!.introduction);
    }
  });
});
