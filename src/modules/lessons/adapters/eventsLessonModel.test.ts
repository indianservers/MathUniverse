import { describe, expect, it } from "vitest";
import { diceOutcomes, eventOutcomes, eventSummary } from "./eventsLessonModel";
describe("Events model", () => { it("enumerates ordered dice outcomes", () => { expect(diceOutcomes).toHaveLength(36); expect(eventOutcomes("doubles")).toHaveLength(6); expect(eventOutcomes("sum7")).toHaveLength(6); }); it("calculates events and complements", () => { const summary = eventSummary(eventOutcomes("atLeast6")); expect(summary.count).toBe(11); expect(summary.complement).toBe(25); expect(summary.probability).toBeCloseTo(11 / 36); }); });
