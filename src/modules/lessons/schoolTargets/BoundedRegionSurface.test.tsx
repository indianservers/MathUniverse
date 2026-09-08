import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./BoundedRegionTargetLesson10203";
it("renders independent comparison, handles, controls and practice",()=>{
 const lesson={title:"Bounded Feasible Region"} as SchoolSyllabusLesson;
 const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson}/></MemoryRouter>);
 expect(html).toContain('data-testid="school-mockup-0877"');
 expect(html).toContain('aria-label="Boundary constant k"');
 expect(html).toContain('aria-label="Sum boundary"');
 expect(html).toContain('aria-label="Double-x boundary"');
 expect(html).toContain('aria-label="Boundary to remove"');
 expect(html).toContain("The remaining constraints still enclose a finite region.");
 expect(html).toContain("Check my answer");
 expect(html.match(/type="checkbox"/g)).toHaveLength(4);
 expect(html).not.toContain('role="status"');
});
