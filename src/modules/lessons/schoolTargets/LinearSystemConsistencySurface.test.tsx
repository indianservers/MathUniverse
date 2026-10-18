import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./LinearSystemConsistencyTargetLesson10199";

describe("consistency attached screenshot surface", () => {
  it("renders the reference infinite system with working-control markup", () => {
    const lesson = { title: "Consistency of Linear Systems" } as SchoolSyllabusLesson;
    const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
    expect(html).toContain('data-case="infinite"');
    expect(html).toContain('data-rank-a="1"');
    expect(html).toContain('data-rank-augmented="1"');
    expect(html).toContain('aria-label="Equation 1 x coefficient" value="1"');
    expect(html).toContain('aria-label="Equation 2 constant" value="4"');
    expect(html).toContain('type="range"');
    expect(html).toContain("Random");
    expect(html).toContain("EDIT THE SYSTEM");
    expect(html).toContain("GEOMETRIC VIEW");
    expect(html).toContain("ROW-REDUCE AND ANALYZE");
    expect(html).toContain("Example points: (0, 2)");
    expect(html).toContain('aria-label="Inconsistent system worked example"');
    expect(html).toContain('aria-label="Consistency practice"');
    expect(html).toContain('aria-label="Rouche-Capelli theorem"');
    const clips = [...html.matchAll(/<clipPath id="([^"]+)"/g)].map(match => match[1]);
    expect(clips).toHaveLength(3);
    expect(new Set(clips).size).toBe(3);
  });
});
