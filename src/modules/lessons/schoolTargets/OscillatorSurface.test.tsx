import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./OscillatorTargetLesson2020";
it("renders the dedicated synchronized default state with real time and parameter controls",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2020-second-order-oscillator")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0914"');expect(html).toContain("0.500");expect(html).toContain("-1.732");expect(html).toContain("-2.000");expect(html).toContain('aria-label="Time cursor"');expect(html.match(/type="range"/g)).toHaveLength(5);expect(html).not.toContain('role="status"');expect(html).not.toContain("katex-error");expect(findAdvancedConceptLesson("2021-gamma-function")).toBeTruthy();});
