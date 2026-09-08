import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./ProductionPlanningTargetLesson10208";

it("renders the dedicated factory board and optimum comparison", () => {
  const lesson = { title: "Production Planning Problem" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0882"');
  expect(html).toContain('aria-label="Tables production"');
  expect(html).toContain('aria-label="Chairs quantity"');
  expect(html).toContain('role="switch"');
  expect(html).toContain('aria-label="Download graph"');
  expect(html.match(/<progress/g)).toHaveLength(2);
  expect(html.match(/type="radio"/g)).toHaveLength(4);
  expect(html).toContain("324.00");
  expect(html).toContain("320.00");
  expect(html).toContain("Inspect (6, 6)");
  expect(html).not.toContain("Correct. (3.6, 3.6)");
});
