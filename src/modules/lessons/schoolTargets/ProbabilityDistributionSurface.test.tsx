import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./ProbabilityDistributionTargetLesson10216";
it("renders locked fair-coin theory and real simulation controls", () => {
  const lesson = { title: "Probability Distribution of a Random Variable" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0890"');
  expect(html.match(/draggable="true"/g)).toHaveLength(4);
  expect(html.match(/aria-label="Probability handle X/g)).toHaveLength(3);
  expect(html).toContain('role="switch"');
  expect(html).toContain("No trials yet");
  expect(html).toContain("Valid distribution");
  expect(html).toContain("0.75");
  expect(html.match(/type="radio"/g)).toHaveLength(4);
});
