import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./MultipleOptimalTargetLesson10205";
it("renders the optimal edge and dedicated coefficient controls",()=>{
 const lesson={title:"Multiple Optimal Solutions"} as SchoolSyllabusLesson;
 const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson}/></MemoryRouter>);
 expect(html).toContain('data-testid="school-mockup-0879"');
 expect(html).toContain("Infinitely many optimal points on edge AB");
 expect(html).toContain('aria-label="Optimization mode"');
 expect(html).toContain('aria-label="Objective position c"');
 expect(html).toContain('aria-label="a (coefficient of x)"');
 expect(html).toContain('aria-label="b (coefficient of y)"');
 expect(html.match(/type="radio"/g)).toHaveLength(6);
 expect(html).toContain("Show Solution");
});
