import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./DietProblemTargetLesson10207";

it("renders a dedicated diet lab with real serving, cost and practice controls", () => {
  const lesson = { title: "Diet Problem" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0881"');
  expect(html).toContain('aria-label="Food A servings"');
  expect(html).toContain('aria-label="Food B servings"');
  expect(html).toContain('aria-label="Cost line position"');
  expect(html).toContain('role="switch"');
  expect(html.match(/<progress/g)).toHaveLength(2);
  expect(html).toContain("20.25");
  expect(html).toContain("Open practice workspace");
  expect(html).toContain("Use optimal mix");
  expect(html).toContain("Production Planning Problem");
});
