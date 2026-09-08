import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./ZetaTargetLesson2024";
it("renders dedicated actual convergence, divisibility and correct critical line",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2024-zeta-function")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0918"');expect(html).toContain("1.596163244");expect(html).toContain("1.6449340668");expect(html).toContain("Re(s) = 1/2");expect(html).toContain('aria-label="2 divides 12"');expect(html).toContain('aria-label="5 does not divide 12"');expect(html).not.toContain('role="status"');expect(html).not.toContain("katex-error");expect(findAdvancedConceptLesson("2025-bessel-function")).toBeTruthy();});
