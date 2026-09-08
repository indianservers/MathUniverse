import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./ErrorFunctionTargetLesson2023";
it("renders the linked default values, diffusion controls and ungraded practice",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2023-error-function")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0917"');expect(html).toContain("0.7468241328");expect(html).toContain("0.8427007929");expect(html).toContain("0.1572992071");expect(html).toContain("0.8413447461");expect(html).toContain('aria-label="Gaussian upper limit slider"');expect(html).toContain('aria-label="Diffusivity times time"');expect(html).toContain("erfc decreases from 2");expect(html).not.toContain('role="status"');expect(html).not.toContain("katex-error");expect(findAdvancedConceptLesson("2024-zeta-function")).toBeTruthy();});
