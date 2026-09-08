import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import { confidenceRun } from "./confidenceIntervalsLessonModel";
import Lesson from "./ConfidenceIntervalsTargetLesson2011";
it("renders a coherent simulated cohort and unanswered practice",()=>{
  const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2011-confidence-intervals")!}/></MemoryRouter>),run=confidenceRun(64,12,95,1);
  expect(html).toContain('data-testid="advanced-mockup-0905"');expect(html).toContain(run.intervals[0].mean.toFixed(2));expect(html).toContain(`${run.covered} / 100`);expect(html).toContain('aria-label="Inspect simulated confidence interval"');expect(html.match(/type="radio"/g)).toHaveLength(16);expect(html).not.toContain('type="radio" checked');expect(html).not.toContain('class="katex-error"');expect(html).toContain("known σ = 12");
});
