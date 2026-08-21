import { describe,expect,it } from "vitest";
import { canonicalConcepts,validateConceptTaxonomy } from "./conceptTaxonomy";
import { boardDifferenceView,coursePathways,validateCourseSeparation } from "./courseStructures";
describe("canonical concepts and independent board pathways",()=>{
 it("uses stable unique concepts with valid prerequisites",()=>{expect(new Set(canonicalConcepts.map((entry)=>entry.id)).size).toBe(canonicalConcepts.length);expect(validateConceptTaxonomy()).toEqual([]);expect(canonicalConcepts.every((entry)=>entry.description&&entry.misconceptions.length&&entry.mathematicalObjectTypes.length)).toBe(true);});
 it("separates CBSE variants and all AP/Telangana papers",()=>{expect(validateCourseSeparation()).toEqual([]);expect(coursePathways.filter((entry)=>entry.board==="AP_BIE").map((entry)=>entry.paper)).toEqual(["IA","IB","IIA","IIB"]);expect(coursePathways.filter((entry)=>entry.board==="TELANGANA_BIE").map((entry)=>entry.paper)).toEqual(["IA","IB","IIA","IIB"]);expect(coursePathways.find((entry)=>entry.id==="CBSE_IX_MATHEMATICS_ADVANCED")?.id).not.toBe("CBSE_IX_MATHEMATICS");expect(coursePathways.find((entry)=>entry.id==="CBSE_XI_APPLIED_MATHEMATICS")?.course).toContain("Applied");});
 it("does not infer Telangana coverage from AP",()=>{const view=boardDifferenceView();expect(view.status).toBe("COMPARISON_PENDING_OFFICIAL_SOURCES");expect(view.sharedCanonicalConcepts).toEqual([]);expect(view.sourceVersions.AP_BIE).toBe("unavailable");expect(view.sourceVersions.TELANGANA_BIE).toBe("unavailable");});
});
