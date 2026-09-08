import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./MarginSampleSizeTargetLesson2012";
it("renders the calculated planner, comparisons, cost meter and unanswered challenge",()=>{
  const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2012-margin-of-error-sample-size")!}/></MemoryRouter>);
  expect(html).toContain('data-testid="advanced-mockup-0906"');expect(html).toContain("You need a sample size of 139.");expect(html).toContain("4.70");expect(html).toContain("2.94");expect(html).toContain('aria-label="Target margin of error slider"');expect(html.match(/aria-label="Required n for margin/g)).toHaveLength(3);expect(html).not.toContain('role="status"');expect(html).not.toContain('class="katex-error"');
});
