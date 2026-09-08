import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./TransportationTargetLesson10209";

it("renders the dedicated shipment network, table and corrected family", () => {
  const lesson = { title: "Transportation-Style LPP Introduction" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0883"');
  expect(html.match(/role="slider"/g)).toHaveLength(4);
  expect(html.match(/type="number"/g)).toHaveLength(4);
  expect(html.match(/<progress/g)).toHaveLength(4);
  expect(html).toContain("x₂₂ = t − 5");
  expect(html).toContain("All row supplies and column demands are satisfied.");
  expect(html).toContain('aria-label="Feasible allocation t"');
  expect(html).toContain("190");
  expect(html).toContain("Show");
  expect(html).not.toContain("Correct. Both supplies");
});
