import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./RandomVariablesTargetLesson10215";
it("renders the mapping machine, four outcomes and custom scores", () => {
  const lesson = { title: "Random Variables" } as SchoolSyllabusLesson;
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0889"');
  expect(html.match(/aria-label="Inspect outcome/g)).toHaveLength(4);
  expect(html.match(/aria-label="Custom score for/g)).toHaveLength(4);
  expect(html).toContain('src="/assets/lessons/random-variable-machine.png"');
  expect(html).toContain("Run 20");
  expect(html).toContain("X = number of heads");
  expect(html).toContain("No toss yet");
  expect(html.match(/type="radio"/g)).toHaveLength(4);
});
