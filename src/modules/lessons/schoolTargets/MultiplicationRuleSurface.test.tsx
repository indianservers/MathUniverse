import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./MultiplicationRuleTargetLesson10211";
it("renders a real five-ball experiment, selectable paths and checked practice", () => {
  const lesson = { title: "Multiplication Rule" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0885"');
  expect(html.match(/aria-label="Draw (red|blue) ball/g)).toHaveLength(5);
  expect(html.match(/aria-label="Select [RB]{2} path/g)).toHaveLength(4);
  expect(html).toContain('src="/assets/lessons/multiplication-rule-pouch.png"');
  expect(html).toContain('aria-label="With replacement"');
  expect(html).toContain("3/10");
  expect(html).toContain("1.00");
  expect(html).toContain('aria-label="Practice 3 probability"');
});
