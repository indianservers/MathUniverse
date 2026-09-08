import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./PeriodicSquareRootsTargetLesson2005";
it("renders the cycle, repeated state, exact convergents and unattempted quiz", () => {
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2005-periodic-square-root-continued-fractions")!} /></MemoryRouter>);
  expect(html).toContain('data-testid="advanced-mockup-0899"');
  expect(html.match(/aria-label="Select state/g)).toHaveLength(4);
  expect(html.match(/aria-label="Select table state/g)).toHaveLength(6);
  expect(html).toContain("k = 5 matches k = 1 exactly");
  expect(html).toContain("211/44");
  expect(html).toContain('aria-label="State playback position"');
  expect(html.match(/type="radio"/g)).toHaveLength(16);
  expect(html).not.toContain("katex-error");
  expect(html).not.toContain('role="status"');
});
