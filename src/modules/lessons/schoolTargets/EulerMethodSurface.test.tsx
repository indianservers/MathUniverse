import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./EulerMethodTargetLesson2017";
it("renders the completed quarter-step walk and real table without prechecked practice",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2017-euler-method")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0911"');expect(html).toContain("2.4414");expect(html).toContain("2.7183");expect(html).toContain("-0.2769");expect(html).toContain('aria-label="Current Euler step"');expect(html.match(/aria-label="Select step /g)).toHaveLength(5);expect(html).not.toContain('role="status"');expect(html).toContain("2018-growth-decay-ivps");expect(findAdvancedConceptLesson("2018-growth-decay-ivps")).toBeTruthy();});
