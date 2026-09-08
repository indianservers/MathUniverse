import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./IndependentEventsTargetLesson10212";
it("renders a dedicated coin/die lab with an empty real simulation", () => {
  const lesson = { title: "Independent Events" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0886"');
  expect(html).toContain('aria-label="Coin event A"');
  expect(html).toContain('aria-label="Die event B"');
  expect(html.match(/<td[^>]*aria-label="[HT], /g)).toHaveLength(12);
  expect(html).toContain("No trials yet");
  expect(html).toContain("Run 1000");
  expect(html).toContain("Events A and B are independent.");
  expect(html).toContain("Dependent (2R, 1B balls)");
  expect(html.match(/type="radio"/g)).toHaveLength(11);
});
