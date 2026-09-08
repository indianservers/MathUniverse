import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./GrowthDecayTargetLesson2018";
it("renders dedicated controls, computed marker times and ungraded challenge",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2018-growth-decay-ivps")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0912"');expect(html.match(/type="range"/g)).toHaveLength(3);expect(html).toContain("1.98");expect(html).toContain("3.96");expect(html).toContain("5.94");expect(html).toContain("Linear axes");expect(html).toContain('aria-label="Challenge exponent rate b"');expect(html).not.toContain('role="status"');expect(html).not.toContain('class="gd-answer"');expect(html).not.toContain("katex-error");expect(findAdvancedConceptLesson("2019-logistic-differential-equation")).toBeTruthy();});
