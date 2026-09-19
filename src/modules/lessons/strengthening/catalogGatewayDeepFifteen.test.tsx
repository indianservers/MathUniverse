import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";
import { gatewayEnhancementIds } from "./catalogGatewayEnhancements";
import {
  deepFifteenSlots,
  gatewayDeepFifteen,
  gatewayDeepFifteenIds,
} from "./catalogGatewayDeepFifteen";

describe("catalogGatewayDeepFifteen", () => {
  it("authors 15 topic-specific slots for each of the 50 gateway lessons", () => {
    expect(gatewayDeepFifteenIds).toEqual(gatewayEnhancementIds);
    expect(Object.keys(gatewayDeepFifteen)).toHaveLength(50);

    const canvasTitles = new Set<string>();
    const boardPrompts = new Set<string>();
    const secondWrongs = new Set<string>();
    const probes = new Set<string>();
    const gates = new Set<string>();
    const spoken = new Set<string>();

    for (const id of gatewayDeepFifteenIds) {
      const spec = gatewayDeepFifteen[id];
      expect(spec, `missing deep spec ${id}`).toBeTruthy();
      expect(spec.id).toBe(id);
      expect(spec.canvas.layers.length).toBeGreaterThanOrEqual(3);
      expect(spec.canvas.forbidden.length).toBeGreaterThan(4);
      expect(spec.trap.wrong).not.toBe(spec.trap.right);
      expect(spec.secondMisconception.wrong.length).toBeGreaterThan(8);
      expect(spec.counterexample.result.length).toBeGreaterThan(2);
      expect(spec.boardExam.answer.length).toBeGreaterThan(0);
      expect(spec.keyboard.keys.length).toBeGreaterThan(0);
      expect(spec.handoff.href.startsWith("/lessons/")).toBe(true);
      expect(spec.generator.items).toHaveLength(3);
      expect(spec.workedFromLive).toHaveLength(3);
      expect(spec.unlockGate.checkLabel.length).toBeGreaterThan(4);
      expect(deepFifteenSlots(spec)).toHaveLength(15);

      expect(canvasTitles.has(spec.canvas.title), `duplicate canvas ${spec.canvas.title}`).toBe(false);
      canvasTitles.add(spec.canvas.title);
      expect(boardPrompts.has(spec.boardExam.prompt), `duplicate board ${id}`).toBe(false);
      boardPrompts.add(spec.boardExam.prompt);
      expect(secondWrongs.has(spec.secondMisconception.wrong), `duplicate second misconception ${id}`).toBe(false);
      secondWrongs.add(spec.secondMisconception.wrong);
      expect(probes.has(spec.probe.prompt), `duplicate probe ${id}`).toBe(false);
      probes.add(spec.probe.prompt);
      expect(gates.has(spec.unlockGate.requirement), `duplicate gate ${id}`).toBe(false);
      gates.add(spec.unlockGate.requirement);
      expect(spoken.has(spec.spoken), `duplicate spoken ${id}`).toBe(false);
      spoken.add(spec.spoken);
    }
  });

  it("renders all 15 slots on every gateway lesson", () => {
    for (const id of gatewayDeepFifteenIds) {
      const spec = gatewayDeepFifteen[id];
      const html = renderToStaticMarkup(
        <LessonTopicStudyBoard lessonId={id} view="interaction" />,
      );
      expect(html, `deep ${id}`).toContain(`data-testid="lesson-gateway-deep-${id}"`);
      expect(html, `count label ${id}`).toContain("15 topic enhancements");
      for (const slot of deepFifteenSlots(spec)) {
        expect(html, `${slot.title} ${id}`).toContain(slot.title);
      }
      expect(html, `canvas ${id}`).toContain(spec.canvas.title);
      expect(html, `href ${id}`).toContain(`href="${spec.handoff.href}"`);
      for (const slot of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]) {
        expect(html, `slot ${slot} ${id}`).toContain(`data-deep-slot="${slot}"`);
      }
    }
  });
});
