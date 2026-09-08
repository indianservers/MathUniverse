import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./ConvergentsTargetLesson2002";
it("renders a dedicated recurrence, selectable number line and live denominator cap", () => {
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2002-convergents")!} /></MemoryRouter>);
  expect(html).toContain('data-testid="advanced-mockup-0896"');
  expect(html).toContain("Recurrence engine (showing step k = 4 → 5)");
  expect(html).toContain('aria-label="Denominator cap"');
  expect(html).toContain('role="slider"');
  expect(html).toContain("1.41429");
  expect(html.match(/aria-label="Select convergent/g)).toHaveLength(5);
  expect(html).toContain("99");
  expect(html).toContain("Best among all rationals with q ≤ 12");
  expect(html).not.toContain("katex-error");
  expect(html).not.toContain('role="status"');
});
