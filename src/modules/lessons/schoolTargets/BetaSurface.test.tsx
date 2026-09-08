import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./BetaTargetLesson2022";
it("renders calculated beta area, normalization, controls and honest initial self-assessment",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2022-beta-function")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0916"');expect(html).toContain("0.08333333");expect(html).toContain("1.000000");expect(html).toContain("0.33333");expect(html).toContain("Right-skewed");expect(html).toContain("self-reported");expect(html).toContain('aria-label="Swap a and b"');expect(html.match(/type="range"/g)).toHaveLength(2);expect(html).not.toContain('role="status"');expect(html).not.toContain("katex-error");expect(findAdvancedConceptLesson("2023-error-function")).toBeTruthy();});
