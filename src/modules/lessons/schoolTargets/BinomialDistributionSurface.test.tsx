import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./BinomialDistributionTargetLesson10220";
it("renders the dedicated PMF, arrangement controls and empty simulation", () => {
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={{ title: "Binomial Distribution" } as SchoolSyllabusLesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0894"');
  expect(html).toContain("0.2965");
  expect(html).toContain("C(8, 6) = 28");
  expect(html).toContain("No simulation run yet");
  expect(html.match(/data-position=/g)).toHaveLength(8);
  expect(html.match(/role="button"/g)).toHaveLength(9);
  expect(html.match(/type="range"/g)).toHaveLength(4);
  expect(html.match(/type="checkbox"/g)).toHaveLength(2);
  expect(html.match(/type="radio"/g)).toHaveLength(12);
  expect(html).toContain("Small p: right-skewed");
});
