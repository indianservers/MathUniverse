import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./SlopeFieldsTargetLesson2016";
it("renders the dedicated field, actual initial point and corrected equilibrium explanation",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2016-slope-fields")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0910"');expect(html).toContain('aria-label="Initial x"');expect(html).toContain('aria-label="Initial y"');expect(html).toContain("There are no constant equilibria.");expect(html).toContain("Zero slopes");expect(html).toContain("Euler Method");expect(html).not.toContain('role="status"');});
