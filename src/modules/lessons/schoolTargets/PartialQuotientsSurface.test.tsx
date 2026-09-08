import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./PartialQuotientsTargetLesson2001";
it("renders exact step identities, nested notation, convergents and real practice controls", () => {
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2001-partial-quotients")!} /></MemoryRouter>);
  expect(html).toContain('data-testid="advanced-mockup-0895"');
  expect(html).toContain("Euclidean peel machine");
  expect(html).toContain("[2; 3, 1, 4]");
  expect(html).toContain("43 = 2 × 19 + 5");
  expect(html).toContain("Remainder: 0 (stop)");
  expect(html.match(/aria-label="Euclidean step/g)).toHaveLength(4);
  expect(html.match(/aria-label="Practice/g)).toHaveLength(4);
  expect(html).toContain('role="slider"');
  expect(html).toContain("katex");
  expect(html).not.toContain("katex-error");
});
