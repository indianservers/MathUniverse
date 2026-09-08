import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./PValuesTargetLesson2014";
it("renders all 1000 actual trials, numerical tail area and unanswered interpretation",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2014-p-values")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0908"');expect(html).toContain("0.0455");expect(html.match(/data-null-trial=/g)).toHaveLength(1000);expect(html).toContain('aria-label="Observed z graph handle"');expect(html.match(/type="radio"/g)).toHaveLength(4);expect(html).not.toContain('role="status"');expect(html).toContain("Type I and Type II Error");});
