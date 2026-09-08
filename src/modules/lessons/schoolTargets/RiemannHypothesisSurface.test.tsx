import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./RiemannHypothesisTargetLesson2008";
it("renders calculated prime counts, sourced zeros and unanswered practice", () => {
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2008-riemann-hypothesis-primes")!} /></MemoryRouter>);
  expect(html).toContain('data-testid="advanced-mockup-0902"');
  expect(html).toContain("30.1");
  expect(html).toContain("-5.1");
  expect(html).toContain("14.134725142");
  expect(html).toContain('aria-label="Prime counting inspection x"');
  expect(html).toContain('aria-label="Inspect known zeta zero"');
  expect(html).toContain("Finite plots and zero tables do not prove RH.");
  expect(html).not.toContain('role="status"');
});
