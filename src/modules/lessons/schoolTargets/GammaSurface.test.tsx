import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./GammaTargetLesson2021";
it("renders the dedicated positive explorer and finite versus full integral without pregraded practice",()=>{const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2021-gamma-function")!}/></MemoryRouter>);expect(html).toContain('data-testid="advanced-mockup-0915"');expect(html.match(/role="tab"/g)).toHaveLength(5);expect(html).toContain('aria-label="Gamma input slider"');expect(html).toContain("tail beyond 12");expect(html).toContain("not everywhere increasing");expect(html).not.toContain('role="status"');expect(html).not.toContain("katex-error");expect(findAdvancedConceptLesson("2022-beta-function")).toBeTruthy();});
