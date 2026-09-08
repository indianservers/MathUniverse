import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./FeasibleRegionTargetLesson10201";

it("renders the default region and its dedicated controls",()=>{
  const lesson={title:"Feasible Region"} as SchoolSyllabusLesson;
  const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson}/></MemoryRouter>);
  expect(html).toContain('data-testid="school-mockup-0875"');
  expect(html).toContain("250 sq. units");
  expect(html).toContain("Maximum Z = 1100 at (10, 15)");
  expect(html.match(/role="switch"/g)).toHaveLength(4);
  expect(html.match(/aria-label="Feasible region graph"/g)).toHaveLength(2);
  expect(html).toContain('aria-label="Test point"');
  expect(html).toContain('aria-label="Objective sweep"');
  expect(html).toContain('aria-label="Vertex ordering practice"');
  expect(html.match(/draggable="true"/g)).toHaveLength(4);
  expect(html).toContain("Animate sweep");
  expect(html).toContain('aria-label="Adjacent lessons"');
});
