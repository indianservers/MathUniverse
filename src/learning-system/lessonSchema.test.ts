import { describe,expect,it } from "vitest";
import { canonicalConcepts } from "./conceptTaxonomy";
import { createInductionLessonBundle,validateLesson } from "./lessonSchema";
import { practiceFamilies } from "./practiceEngine";
import { assessmentBlueprints } from "./assessmentEngine";
describe("schema-driven lesson",()=>{it("connects live blocks to real shared mathematical nodes",()=>{const {graph,lesson}=createInductionLessonBundle();const issues=validateLesson(lesson,new Set(canonicalConcepts.map((entry)=>entry.id)),new Set(graph.getSnapshot().records.map((entry)=>entry.id)),new Set(practiceFamilies.map((entry)=>entry.id)),new Set(assessmentBlueprints.map((entry)=>entry.id)));expect(issues).toEqual([]);expect(graph.evaluateExpression("lhs").exactForm).toBe("15");expect(graph.evaluateExpression("rhs").exactForm).toBe("15");expect(lesson.workflowStatus).toBe("DRAFT");expect(lesson.review.approvals).toEqual([]);expect(lesson.workedExamples).toHaveLength(2);});});
