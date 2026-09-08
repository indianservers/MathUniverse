import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./CornerPointTargetLesson10202";
it("renders the dedicated default model and controls",()=>{
  const lesson={title:"Corner-Point Method"} as SchoolSyllabusLesson;
  const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson}/></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0876"');
  expect(html).toContain("Maximum Z = 18");
  expect(html).toContain("A (6, 0)");
  expect(html).toContain('aria-label="Constraint 1 boundary"');
  expect(html).toContain('aria-label="Constraint 2 boundary"');
  expect(html).toContain('aria-label="Objective line value"');
  expect(html).toContain("Auto (Best)");
  expect(html.match(/type="radio"/g)).toHaveLength(4);
});
