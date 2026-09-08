import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./BestRationalApproximationsTargetLesson2004";
it("renders the searched winner, real metric choices, budget and inspect controls", () => {
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2004-best-rational-approximations")!} /></MemoryRouter>);
  expect(html).toContain('data-testid="advanced-mockup-0898"');
  expect(html).toContain("333/106");
  expect(html).toContain("289/92");
  expect(html).toContain('aria-label="Inspect candidate fraction"');
  expect(html).toContain('aria-label="Denominator budget"');
  expect(html).toContain("Next convergent: 355/113");
  expect(html).toContain("Second-kind error");
  expect(html).not.toContain('role="status"');
});
