import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./EuclideanAlgorithmLinkTargetLesson2003";
it("renders synchronized divisions, proportional bars, reverse builder and unattempted practice", () => {
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2003-euclidean-algorithm-continued-fractions")!} /></MemoryRouter>);
  expect(html).toContain('data-testid="advanced-mockup-0897"');
  expect(html).toContain("[2; 3, 1, 4]");
  expect(html).toContain("gcd(43, 19) = 1");
  expect(html).toContain("Remainder zero: the reciprocal is undefined. Stop here.");
  expect(html.match(/aria-label="Select Euclidean step/g)).toHaveLength(4);
  expect(html.match(/aria-label="Select reciprocal step/g)).toHaveLength(4);
  expect(html.match(/aria-label="Reverse partial quotient/g)).toHaveLength(4);
  expect(html).toContain('role="switch"');
  expect(html).toContain("43 units partitioned into 2 blocks of 19 and remainder 5");
  expect(html).not.toContain("katex-error");
  expect(html).not.toContain('role="status"');
});
