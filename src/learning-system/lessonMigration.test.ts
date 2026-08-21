import { describe,expect,it } from "vitest";
import { lessonMigrationSummary,phase3LessonMigrationInventory } from "./lessonMigration";
describe("919-lesson migration inventory",()=>{it("preserves every catalogue record without approving scaffolds",()=>{expect(lessonMigrationSummary()).toEqual({total:919,core:674,school:220,advanced:25,approved:0,certified:0,duplicateStableIds:[],duplicateRoutes:[]});expect(phase3LessonMigrationInventory.every((entry)=>entry.classification!=="APPROVED"&&entry.phase3Workflow!=="APPROVED")).toBe(true);});});
