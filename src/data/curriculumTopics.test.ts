import { describe, expect, it } from "vitest";
import { curriculumTopics, groupCurriculumTopics } from "./curriculumTopics";
import { curriculumLessonIds, curriculumTopicRoute } from "./curriculumLessonMappings";
import { ncertConcepts } from "./ncertConcepts";
import { lessonById } from "../modules/lessons/catalog/unified/unifiedLessons";

describe("shared curriculum lesson mappings", () => {
 it("accounts for every existing NCERT topic explicitly", () => {
  expect(ncertConcepts.every((concept) => Object.hasOwn(curriculumLessonIds, concept.id))).toBe(true);
 });
 it("only maps published lessons with global lesson URLs", () => {
  for (const ids of Object.values(curriculumLessonIds)) for (const id of ids) expect(lessonById(id)?.status).toBe("Published");
  for (const topic of curriculumTopics) for (const lesson of topic.lessons) {
   expect(lesson.status).toBe("Published");
   expect(lesson.route).toMatch(/^\/lessons\//);
   expect(lesson.route).not.toMatch(/ncert|telangana|andhra|ap-scert|ap-bie/i);
  }
 });
 it("shares decimal operations and retains missing topic visibility", () => {
  expect(curriculumTopicRoute("class-7-decimal-operations")).toBe(lessonById(80)?.route);
  expect(curriculumTopicRoute("class-8-fractals-and-solid-views")).toBe(lessonById(411)?.route);
  for (const board of ["NCERT", "AP", "Telangana"]) expect(curriculumTopics.some((topic) => topic.curriculum === board)).toBe(true);
  expect(curriculumTopics.filter((topic) => topic.curriculum === "AP" && topic.lessons.length).length).toBeGreaterThan(0);
 });
 it("keeps textbook classes and chapters distinct while reusing lesson identities", () => {
  const tree = groupCurriculumTopics(curriculumTopics);
  for (const name of ["NCERT", "AP", "Telangana"]) {
   const board = tree.find((entry) => entry.title === name)!;
   for (const grade of [6, 7, 8, 9, 10, 11, 12]) expect(board.classes.some((entry) => entry.title === `Class ${grade}`)).toBe(true);
   for (const level of board.classes) for (const chapter of level.chapters) {
    expect(new Set(chapter.lessons.map((lesson) => lesson.id)).size).toBe(chapter.lessons.length);
   }
  }
  const telangana = tree.find((entry) => entry.title === "Telangana")!;
  expect(telangana.classes.find((entry) => entry.title === "Class 7")!.chapters.filter((chapter) => chapter.topics.some((topic) => !topic.workbook))).toHaveLength(15);
  expect(telangana.classes.find((entry) => entry.title === "Class 10")!.chapters.map((entry) => entry.title)).toContain("Progressions");
  const ncertDecimal = curriculumTopics.find((topic) => topic.id === "class-7-decimal-operations")!.lessons[0];
  const telanganaFractions = telangana.classes.find((entry) => entry.title === "Class 7")!.chapters.find((entry) => entry.title.startsWith("Fractions"))!;
  expect(telanganaFractions.lessons.find((lesson) => lesson.id === 80)?.route).toBe(ncertDecimal.route);
  expect(curriculumTopics.find((topic) => topic.curriculum === "AP" && topic.level === "Class 7" && topic.title === "Fractions and Decimals")!.lessons.find((lesson) => lesson.id === 80)?.route).toBe(ncertDecimal.route);
 });
 it("maps AP topic aliases to the same published lessons as other curricula", () => {
  expect(curriculumTopics.find((topic) => topic.curriculum === "AP" && topic.id === "30354")!.lessons[0].id).toBe(99);
  expect(curriculumTopics.find((topic) => topic.curriculum === "AP" && topic.id === "30230")!.lessons.map((lesson) => lesson.id)).toContain(112);
  expect(curriculumTopics.find((topic) => topic.curriculum === "AP" && topic.id === "30009")!.lessons).toHaveLength(0);
 });
});
