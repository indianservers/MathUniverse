import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./LinearSystemConsistencyTargetLesson10199";

describe("consistency attached screenshot surface", () => {
  it("renders the three-panel unique system with working-control markup", () => {
    const lesson = { title: "Consistency of Linear Systems" } as SchoolSyllabusLesson;
    const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
    expect(html).toContain('data-case="unique"');
    expect(html).toContain('data-rank-a="2"');
    expect(html).toContain('data-rank-augmented="2"');
    expect(html).toContain('aria-label="Equation 1 x coefficient" value="15"');
    expect(html).toContain('aria-label="Equation 2 constant" value="4"');
    expect(html).toContain('type="range"');
    expect(html).toContain("Try random system");
    expect(html).toContain("Build the system");
    expect(html).toContain("Watch the geometry");
    expect(html).toContain("Row reduction");
    expect(html).toContain("(0, 2)</text>");
    expect(html).toContain('aria-label="Inconsistent system worked example"');
    expect(html).not.toContain('aria-label="Consistency practice"');
    expect(html).not.toContain('aria-label="Rouche-Capelli theorem"');
    const clips = [...html.matchAll(/<clipPath id="([^"]+)"/g)].map(match => match[1]);
    expect(clips).toHaveLength(2);
    expect(new Set(clips).size).toBe(2);
  });
});
