import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { lessonCatalog, findLesson } from "./lessonCatalog";
import { findSchoolLesson } from "./school/schoolSyllabusCatalog";
import { findAdvancedConceptLesson } from "./advanced/advancedConceptLessons";
import { unifiedLessons } from "./unified/unifiedLessons";
import authored from "../authored/authoredLessonIndex.generated.json";
import { curriculumTopics } from "../../../data/curriculumTopics";
import { legacyLessonRedirects } from "./legacyLessonRoutes";

function resolves(path: string) {
  const parts = path.split("/");
  if (parts[2] === "school") return !!findSchoolLesson(parts[3], parts[4]);
  if (parts[2] === "advanced-concepts") return !!findAdvancedConceptLesson(parts[3]);
  if (authored.lessons.some((lesson) => lesson.route === path)) return true;
  return !!findLesson(parts[2], parts[3]);
}
function linkSourceFiles(): string[] {
  try {
    return execFileSync("rg", ["-l", "/lessons/", "src", "--glob", "*.ts", "--glob", "*.tsx", "--glob", "*.json", "--glob", "!*.test.*", "--glob", "!*.generated.*", "--glob", "!legacyLessonRoutes.ts"], { cwd: process.cwd(), encoding: "utf8" }).trim().split(/\r?\n/).filter(Boolean);
  } catch { return files(join(process.cwd(), "src")); }
}
function files(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : /\.(tsx?|json)$/.test(path) && !/\.test\.|\.generated\.|legacyLessonRoutes\.ts$/.test(path) ? [path] : [];
  });
}
describe("lesson route integrity", () => {
  it("resolves every catalog lesson through the actual page lookup functions", () => {
    for (const lesson of unifiedLessons) expect(resolves(lesson.route), `${lesson.id}: ${lesson.route}`).toBe(true);
    expect(unifiedLessons.filter((lesson) => lesson.status === "Published")).toHaveLength(919);
    expect(lessonCatalog).toHaveLength(674);
  });
  it("resolves every curriculum dashboard lesson through the actual page catalogs", () => {
    for (const topic of curriculumTopics) for (const lesson of topic.lessons) expect(resolves(lesson.route), `${topic.curriculum}: ${topic.title}: ${lesson.route}`).toBe(true);
  });
  it("contains no unregistered literal lesson links anywhere in application source", () => {
    const broken: string[] = [];
    for (const file of linkSourceFiles()) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/["'`](\/lessons\/[^\s"'`<>?#{}]+)/g)) {
        if (!/\/\d+-[^/]+$/.test(match[1])) continue;
        if (!resolves(match[1])) broken.push(`${relative(process.cwd(), file)}:${source.slice(0, match.index).split("\n").length}: ${match[1]}`);
      }
    }
    expect(broken).toEqual([]);
  }, 120000);
  it("repairs only known broken bookmarks and preserves the requested decimal operation", () => {
    expect(legacyLessonRedirects["/lessons/numbers-and-arithmetic/81-subtract-decimals"]).toBe("/lessons/numbers-and-arithmetic/80-decimal-operations?operation=subtract");
    for (const destination of Object.values(legacyLessonRedirects)) {
      const path = destination.split("?")[0];
      expect(resolves(path) || ["/lessons", "/lessons/calculus", "/lessons/symbolic-mathematics", "/lessons/graphs-and-functions"].includes(path), destination).toBe(true);
      expect(legacyLessonRedirects[path]).toBeUndefined();
    }
    expect(findLesson("numbers-and-arithmetic", "999999-invented-lesson")).toBeNull();
  });
});
