import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./LogisticTargetLesson2019";
it("renders dedicated logistic plots and corrected default values, with comparison off",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2019-logistic-differential-equation")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0913"');expect(html).toContain("3.66");expect(html).toContain("15.00");expect(html).toContain("26.949");expect(html.match(/type="range"/g)).toHaveLength(3);expect(html).not.toContain('data-testid="logistic-exponential-curve"');expect(html).not.toContain('role="status"');expect(html).not.toContain("katex-error");expect(findAdvancedConceptLesson("2020-second-order-oscillator")).toBeTruthy();});
