import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./TypeErrorsTargetLesson2015";
it("renders corrected power, real controls and unanswered practice",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2015-type-i-type-ii-error")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0909"');expect(html).toContain("6.000");expect(html).toContain("&gt; 0.999");expect(html).toContain('aria-label="Drag Sample size n"');expect(html.match(/type="radio"/g)).toHaveLength(12);expect(html).not.toContain('role="status"');expect(html).toContain("Open capstone workspace");});
