import { describe,expect,it } from "vitest";
import { equivalentExpressions,generateQuestion,practiceFamilies,validateFamilySeeds } from "./practiceEngine";
describe("deterministic parameterized practice",()=>{
 it("validates 1,000 seeds for every high-priority family",()=>{for(const family of practiceFamilies){const report=validateFamilySeeds(family,1000);expect(report.issues,family.id).toEqual([]);expect(report.distinctSignatures,family.id).toBeGreaterThan(5);}});
 it("reproduces questions exactly and retains seed",()=>{for(const family of practiceFamilies)expect(generateQuestion(family,927)).toEqual(generateQuestion(family,927));expect(generateQuestion(practiceFamilies[0],927).seed).toBe(927);});
 it("accepts equivalent display forms and rejects inequivalent ones",()=>{expect(equivalentExpressions("(x+1)^2","x^2+2*x+1").equivalent).toBe(true);expect(equivalentExpressions("x^2","x^3").equivalent).toBe(false);});
});
