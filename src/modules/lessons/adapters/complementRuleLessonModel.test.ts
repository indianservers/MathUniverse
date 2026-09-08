import { describe, expect, it } from "vitest";
import { complementSummary, eventMembers, twelveSidedDie } from "./complementRuleLessonModel";
describe("Complement rule model", () => { it("partitions the twelve-sided die", () => { expect(twelveSidedDie).toHaveLength(12); expect(eventMembers("even")).toEqual([2,4,6,8,10,12]); expect(eventMembers("prime")).toEqual([2,3,5,7,11]); }); it("links probabilities and counts", () => { const result = complementSummary(60, 120); expect(result.complement).toBe(60); expect(result.p + result.pc).toBe(1); }); });
