import { readdirSync, readFileSync } from "node:fs";
import { isAbsolute, join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateStrengthenedLesson, type StrengthenedLesson } from "./strengthenedLessonSchema";

type Manifest = {
  totals: {
    main: number;
    school: number;
    all: number;
  };
  lessons: Array<{
    id: number | string;
    route: string;
    catalog: "main" | "school";
  }>;
};

describe("lesson strengthening Phase 1 artifacts", () => {
  it("keeps the parsed audit manifest aligned to every audited route", () => {
    const manifest = readJson<Manifest>("docs/lessons/lesson-strengthening-manifest.json");
    expect(manifest.totals).toEqual({ main: 662, school: 220, all: 882 });
    expect(manifest.lessons).toHaveLength(882);
    expect(new Set(manifest.lessons.map((lesson) => lesson.route)).size).toBe(882);
    expect(manifest.lessons.filter((lesson) => lesson.catalog === "main")).toHaveLength(662);
    expect(manifest.lessons.filter((lesson) => lesson.catalog === "school")).toHaveLength(220);
  });

  it("validates every generated Phase 1 lesson brief scaffold", () => {
    const briefFiles = collectBriefFiles(join(process.cwd(), "content/lesson-briefs"));
    const lessons = briefFiles.flatMap((file) => readJson<{ lessons: StrengthenedLesson[] }>(file).lessons);
    expect(lessons).toHaveLength(882);
    const errors = lessons.flatMap((lesson) => validateStrengthenedLesson(lesson).map((error) => `${lesson.route}: ${error}`));
    expect(errors).toEqual([]);
  });
});

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(isAbsolute(path) ? path : join(process.cwd(), path), "utf8")) as T;
}

function collectBriefFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) return collectBriefFiles(fullPath);
    return entry.name === "briefs.json" ? [fullPath] : [];
  });
}
