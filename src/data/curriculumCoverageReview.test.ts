import { describe, expect, it } from "vitest";
import review from "./curriculumCoverageReview.json";
import { curriculumTopics, groupCurriculumTopics, topicHasUpcomingLesson } from "./curriculumTopics";
import { lessonById } from "../modules/lessons/catalog/unified/unifiedLessons";

const primary = curriculumTopics.filter((topic) => !topic.workbook && ["NCERT", "AP", "Telangana"].includes(topic.curriculum));
describe("review of all previously Upcoming curriculum topics", () => {
 it("records an explicit mapping or gap rationale for all 270 reviewed entries", () => {
  expect(review.reviews).toHaveLength(270);
  expect(new Set(review.reviews.map((entry) => `${entry.curriculum}:${entry.id}`)).size).toBe(270);
  for (const entry of review.reviews) {
   const topic = primary.find((topic) => topic.curriculum === entry.curriculum && topic.id === entry.id);
   expect(topic, `${entry.curriculum}:${entry.id}`).toBeDefined();
   expect(entry.rationale.length).toBeGreaterThan(20);
   expect(topic!.lessons.map((lesson) => lesson.id)).toEqual(entry.lessonIds);
   for (const id of entry.lessonIds) expect(lessonById(id)?.status).toBe("Published");
  }
 });
 it("maps 213 covered/practice entries, exposes partial coverage, and separates four unfinished mappings", () => {
  expect(review.reviews.filter((entry) => ["mapped", "shared-practice"].includes(entry.decision))).toHaveLength(213);
  expect(review.reviews.filter((entry) => entry.decision === "partial")).toHaveLength(1);
  expect(review.reviews.filter((entry) => entry.decision === "mapping-pending")).toHaveLength(4);
  const remaining = primary.filter(topicHasUpcomingLesson);
  expect(remaining).toHaveLength(2);
  expect(primary.filter((topic) => topic.draftLessons?.length).length).toBeGreaterThan(45);
  for (const topic of remaining) expect(topic.missingReason || topic.missingCoverage?.length, topic.title).toBeTruthy();
  console.log("Upcoming lesson gaps by curriculum:", Object.fromEntries(["NCERT", "AP", "Telangana"].map((board) => [board, remaining.filter((topic) => topic.curriculum === board).length])));
 });
 it("reuses actual mathematical coverage without substituting a related concept", () => {
  const lookup = (id: string) => primary.find((topic) => topic.id === id)!;
  expect(lookup("class-10-areas-similar-triangles").lessons[0].id).toBe(241);
  expect(lookup("30314").lessons[0].id).toBe(10109);
  expect(lookup("class-10-grouped-mode").lessons).toHaveLength(0);
  expect(lookup("class-10-similarity-criteria").lessons).toHaveLength(0);
  expect(lookup("32002").lessons).toHaveLength(0); // Point transformations are not rotations of coordinate axes.
 });
 it("keeps missing fractals visible beside the available solid-view lessons", () => {
  const topic = primary.find((topic) => topic.id === "class-8-fractals-and-solid-views")!;
  expect(topic.lessons.map((lesson) => lesson.id)).toEqual([411, 404]);
  expect(topicHasUpcomingLesson(topic)).toBe(true);
  const chapters = groupCurriculumTopics([topic])[0].classes[0].chapters;
  expect(chapters[0].upcoming.map((gap) => gap.title)).toEqual(["Fractals and Sierpinski carpet"]);
 });
 it("treats textbook assessment alignment separately from shared practice availability", () => {
  const practice = primary.filter((topic) => topic.practiceAlignmentPending);
  expect(practice).toHaveLength(179);
  for (const topic of practice) {
   expect(topic.lessons.length).toBeGreaterThan(0);
   expect(topicHasUpcomingLesson(topic)).toBe(false);
   expect(topic.coverageNote).toContain("does not certify");
  }
  for (const topic of primary.filter((topic) => topic.mappingPending)) expect(topicHasUpcomingLesson(topic)).toBe(false);
 });
});
