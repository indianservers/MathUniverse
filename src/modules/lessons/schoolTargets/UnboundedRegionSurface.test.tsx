import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./UnboundedRegionTargetLesson10204";
it("renders the finite minimum and dedicated exploration controls",()=>{
 const lesson={title:"Unbounded Feasible Region"} as SchoolSyllabusLesson;
 const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson}/></MemoryRouter>);
 expect(html).toContain('data-testid="school-mockup-0878"');
 expect(html).toContain("Finite minimum");expect(html).toContain("Minimum Z = 4");
 expect(html).toContain('aria-label="Direction angle"');
 expect(html).toContain('aria-label="Objective line constant"');
 expect(html.match(/type="checkbox"/g)).toHaveLength(4);
 expect(html.match(/type="radio"/g)).toHaveLength(2);
 expect(html).toContain("Check answer 3");
});
