import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./BesselTargetLesson2025";
it("renders dedicated calculated roots, membrane canvas and corrected fundamental mode",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2025-bessel-function")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0919"');expect(html).toContain("2.4048");expect(html).toContain("5.5201");expect(html).toContain("8.6537");expect(html).toContain("No interior nodal ring in this mode.");expect(html).toContain("<canvas");expect(html).toContain('aria-label="Radial probe"');expect(html).toContain('aria-label="Animation phase"');expect(html).not.toContain('role="status"');expect(html).not.toContain("katex-error");});
