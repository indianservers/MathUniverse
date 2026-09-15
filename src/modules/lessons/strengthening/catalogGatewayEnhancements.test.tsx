import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
import { getStrengthenedFoundationLesson } from "./foundationNumberContent";
import {
  gatewayAnswerMatches,
  gatewayEnhancementIds,
  gatewayEnhancements,
} from "./catalogGatewayEnhancements";

describe("catalogGatewayEnhancements", () => {
  it("covers exactly 50 unique gateway lessons with topic-specific exams", () => {
    expect(gatewayEnhancementIds).toHaveLength(50);
    expect(new Set(gatewayEnhancementIds).size).toBe(50);

    const titles = new Set<string>();
    const sentences = new Set<string>();
    for (const id of gatewayEnhancementIds) {
      const spec = gatewayEnhancements[id];
      expect(spec, `missing spec ${id}`).toBeTruthy();
      expect(spec.id).toBe(id);
      expect(spec.title.length).toBeGreaterThan(3);
      expect(spec.liveLabel.length).toBeGreaterThan(2);
      expect(spec.liveValue(0.35).length).toBeGreaterThan(0);
      expect(spec.misconception.wrong.length).toBeGreaterThan(12);
      expect(spec.misconception.correction.length).toBeGreaterThan(12);
      expect(spec.unlocks.sentence.length).toBeGreaterThan(12);
      expect(spec.unlocks.nextHref.startsWith("/lessons/")).toBe(true);
      expect(spec.unlocks.nextLabel.length).toBeGreaterThan(2);
      expect(spec.exams).toHaveLength(3);
      expect(titles.has(spec.title), `duplicate title ${spec.title}`).toBe(false);
      titles.add(spec.title);
      expect(sentences.has(spec.unlocks.sentence), `duplicate unlock ${id}`).toBe(false);
      sentences.add(spec.unlocks.sentence);

      const lesson = getStrengthenedFoundationLesson(id);
      expect(lesson, `strengthened lesson ${id}`).not.toBeNull();
    }
  });

  it("accepts exact and listed alternate exam answers", () => {
    const item = gatewayEnhancements[2].exams[0];
    expect(gatewayAnswerMatches(item, "5/4")).toBe(true);
    expect(gatewayAnswerMatches(item, "1 1/4")).toBe(true);
    expect(gatewayAnswerMatches(item, "4/6")).toBe(false);
    expect(gatewayAnswerMatches(gatewayEnhancements[130].exams[0], "x >= 2")).toBe(true);
    expect(gatewayAnswerMatches(gatewayEnhancements[134].exams[0], "(2, −1)")).toBe(true);
  });

  it("renders a live readout, misconception, exam ticket, and next link for every gateway id", () => {
    for (const id of gatewayEnhancementIds) {
      const spec = gatewayEnhancements[id];
      const html = renderToStaticMarkup(
        <LessonTopicStudyBoard lessonId={id} view="interaction" />,
      );
      expect(html, `gateway ${id}`).toContain(`data-testid="lesson-gateway-${id}"`);
      expect(html, `study hidden ${id}`).not.toContain(`data-testid="lesson-study-board-${id}"`);
      expect(html, `aria-live ${id}`).toContain('aria-live="polite"');
      expect(html, `misconception ${id}`).toContain("Named misconception");
      expect(html, `wrong ${id}`).toContain(spec.misconception.wrong);
      expect(html, `exam ${id}`).toContain("Exam exit ticket");
      expect(html, `exam prompt ${id}`).toContain(spec.exams[0].prompt);
      expect(html, `next ${id}`).toContain("Next:");
      expect(html, `href ${id}`).toContain(`href="${spec.unlocks.nextHref}"`);
    }
  });

  it("uses a bound canvas value instead of the internal probe when provided", () => {
    const html = renderToStaticMarkup(
      <LessonTopicStudyBoard lessonId={130} view="interaction" boundLive="x ≥ 2; y ≥ 0" />,
    );
    expect(html).toContain("x ≥ 2; y ≥ 0");
    expect(html).toContain("bound to the interaction already on the canvas");
    expect(html).not.toContain("Canvas probe");
  });
});
