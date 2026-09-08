import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./BernoulliTrialsTargetLesson10219";
it("renders an unrun experiment, real assumption switches and unanswered classification", () => {
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={{ title: "Bernoulli Trials" } as SchoolSyllabusLesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0893"');
  expect(html).toContain("Not run yet");
  expect(html.match(/trial not run/g)).toHaveLength(8);
  expect(html.match(/role="switch"/g)).toHaveLength(3);
  expect(html.match(/type="range"/g)).toHaveLength(2);
  expect(html.match(/type="radio"/g)).toHaveLength(14);
  expect(html).toContain("Path probabilities");
  expect(html).toContain("same p");
  expect(html).not.toContain('role="status"');
});
