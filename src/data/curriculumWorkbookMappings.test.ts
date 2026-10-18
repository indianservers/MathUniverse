import { describe, expect, it } from "vitest";
import { readFileSync, writeFileSync } from "node:fs";
import { curriculumWorkbook, workbookLessonMappings, workbookChapterLessons, initialWorkbookLessonMappings } from "./curriculumWorkbookMappings";
import { workbookCurriculumTopics } from "./curriculumWorkbookTopics";
import { curriculumTopics, groupCurriculumTopics } from "./curriculumTopics";
import { findLesson } from "../modules/lessons/catalog/lessonCatalog";
import { lessonById } from "../modules/lessons/catalog/unified/unifiedLessons";
import { availableDrafts } from "./curriculumAvailableDrafts";

describe("supplied textbook working index", () => {
  it("preserves all 1,317 rows, board categories, chapter names, order, tracks and verification notes", () => {
    expect(curriculumWorkbook.rows).toHaveLength(1317);
    expect(workbookCurriculumTopics).toHaveLength(1317);
    expect(new Set(workbookLessonMappings.map((mapping) => mapping.rowId)).size).toBe(1317);
    const expected = {NCERT:316,"Andhra Pradesh":208,Telangana:247,IB:253,Cambridge:293};
    for (const [board,count] of Object.entries(expected)) expect(curriculumWorkbook.rows.filter((row) => row.board === board)).toHaveLength(count);
    const grouped = groupCurriculumTopics(curriculumTopics).flatMap((board) => board.classes.flatMap((level) => level.chapters.flatMap((chapter) => chapter.topics.filter((topic) => topic.workbook))));
    expect(grouped).toHaveLength(1317);
    for (const row of curriculumWorkbook.rows) {
      const topic = grouped.find((entry) => entry.id === row.id)!;
      expect(topic.title).toBe(row.title);
      expect(topic.unit).toBe(row.chapter);
      expect(topic.level).toBe(row.level);
      expect(topic.workbook?.lessonNumber).toBe(row.lessonNumber);
      expect(topic.workbook?.track).toBe(row.track);
      expect(topic.workbook?.verification).toBe(row.verification);
    }
  });
  it("links only registered canonical lessons and keeps related resources separate from direct coverage", () => {
    const linkedIds = new Set(workbookLessonMappings.flatMap((mapping) => [...mapping.lessonIds,...mapping.relatedLessonIds]));
    for (const id of linkedIds) {
      const lesson = lessonById(id)!;
      expect(lesson).toBeDefined();
      expect(lesson.status === "Published" || availableDrafts.some((draft) => draft.id === id)).toBe(true);
      expect(lesson.route).toMatch(/^\/lessons\//);
      expect(lesson.route).not.toMatch(/ncert|telangana|andhra/i);
      if (lesson.kind === "interactive") expect(findLesson(lesson.route.split("/").at(-2)!,lesson.route.split("/").at(-1)!),lesson.route).toBeTruthy();
    }
    for (const mapping of workbookLessonMappings) {
      if (mapping.state === "mapped" || mapping.state === "partial") expect(mapping.lessonIds.length).toBeGreaterThan(0);
      else expect(mapping.lessonIds).toHaveLength(0);
    }
    const incorrectIndexRow = curriculumWorkbook.rows.find((row) => row.chapter === "Operations with Integers" && row.title === "Meaning and equivalent ratios")!;
    const mapping = workbookLessonMappings.find((entry) => entry.rowId === incorrectIndexRow.id)!;
    expect(mapping.state).toBe("mapped");
    expect(mapping.sourceIssue).toContain("Operations with Integers");
    expect(mapping.lessonIds).toEqual([83,84]);
    expect(workbookChapterLessons("Mechanics: Momentum","Class 12").map((lesson) => lesson.id)).toContain(183);
  },30000);
  it("reports every unresolved row explicitly instead of silently dropping it", () => {
    const audit = curriculumWorkbook.rows.map((row) => ({...row,...workbookLessonMappings.find((mapping) => mapping.rowId === row.id)!}));
    const counts = Object.fromEntries(["mapped","partial","chapter-resources","upcoming"].map((state) => [state,audit.filter((row) => row.state === state).length]));
    expect(Object.values(counts).reduce((sum,count) => sum+count,0)).toBe(1317);
    writeFileSync("artifacts/curriculum-workbook-mapping-audit.json",JSON.stringify({source:curriculumWorkbook.fileName,sha256:curriculumWorkbook.sha256,total:audit.length,counts,rows:audit},null,2));
    console.log("Workbook mapping audit",counts);
    console.log("Unmapped chapters",[...new Set(audit.filter((row) => row.state === "upcoming").map((row) => row.chapter))]);
  });
  it("reviews every previously pending row using chapter-specific lesson skills", () => {
    const pending = initialWorkbookLessonMappings.filter((mapping) => mapping.state === "chapter-resources");
    expect(pending).toHaveLength(722);
    const reviewed = pending.map((previous) => workbookLessonMappings.find((mapping) => mapping.rowId === previous.rowId)!);
    expect(reviewed.every((mapping) => mapping.reviewProfile && mapping.reason.length > 50)).toBe(true);
    expect(reviewed.filter((mapping) => mapping.state === "mapped")).toHaveLength(710);
    expect(reviewed.filter((mapping) => mapping.state === "partial")).toHaveLength(3);
    expect(reviewed.filter((mapping) => mapping.state === "upcoming")).toHaveLength(9);
    expect(workbookLessonMappings.filter((mapping) => mapping.state === "chapter-resources")).toHaveLength(0);
    const lookup = (chapter:string,title:string) => workbookLessonMappings.find((mapping) => curriculumWorkbook.rows.some((row) => row.id === mapping.rowId && row.chapter === chapter && row.title === title))!;
    expect(lookup("Coordinate Geometry","Area of triangle").lessonIds).toEqual([10087,10088]);
    expect(lookup("Arithmetic Progressions","Arithmetic mean").lessonIds).toEqual([335,30248]);
    expect(lookup("Relations and Functions","Cartesian products and relations").lessonIds).toContain(585);
    expect(lookup("Pure Mathematics 1: Integration","Meaning and equivalent ratios").sourceIssue).toContain("Integration");
    expect(lookup("Constructions and Tilings","Methods, properties and worked examples").lessonIds).toContain(215);
    expect(lookup("Complex Numbers and Quadratic Equations","Forming equations").lessonIds).toContain(114);
    expect(lookup("Complex Numbers and Quadratic Equations","Forming equations").lessonIds).not.toContain(111);
  });
  it("keeps actual gaps and partial coverage distinct from prerequisites", () => {
    const gapRows = workbookLessonMappings.filter((mapping) => mapping.state === "upcoming");
    const chapters = [...new Set(gapRows.map((mapping) => curriculumWorkbook.rows.find((row) => row.id === mapping.rowId)!.chapter))];
    expect(chapters).toEqual(["Probability and Statistics 2: Linear Combinations of Random Variables","Mechanics: Momentum","Mechanics: Newton's Laws"]);
    for (const gap of gapRows) {
      expect(gap.lessonIds).toHaveLength(0);
      expect(gap.relatedLessonIds.length).toBeGreaterThan(0);
    }
    for (const partial of workbookLessonMappings.filter((mapping) => mapping.state === "partial")) {
      expect(partial.lessonIds).toEqual([190]);
      expect(partial.missing?.[0].rationale).toContain("power");
      const topic = workbookCurriculumTopics.find((topic) => topic.id === partial.rowId)!;
      expect(topic.missingCoverage).toHaveLength(1);
      expect(topic.mappingPending).toBe(false);
    }
    // Validate the non-obvious Pythagoras/force/work matches against lesson models,
    // not just their titles or the unified catalog's display categories.
    const rhs = readFileSync(new URL("../modules/lessons/schoolTargets/RightTriangleRhsTargetLesson10031.tsx",import.meta.url),"utf8");
    expect(rhs).toContain("hypotenuse * hypotenuse - leg * leg");
    const forces = readFileSync(new URL("../modules/lessons/adapters/ForceVectorsTargetLesson197.tsx",import.meta.url),"utf8");
    expect(forces).toContain("equilibrant");
    expect(forces).toContain("balanced");
  });
});
