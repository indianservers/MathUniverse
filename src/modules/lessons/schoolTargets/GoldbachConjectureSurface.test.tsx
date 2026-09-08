import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./GoldbachConjectureTargetLesson2007";
it("renders calculated pair connections, prime density and real practice controls", () => {
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2007-goldbach-conjecture")!} /></MemoryRouter>);
  expect(html).toContain('data-testid="advanced-mockup-0901"');
  expect(html).toContain("32.14%");
  expect(html).toContain("5 + 23 = 28");
  expect(html).toContain("11 + 17 = 28");
  expect(html).toContain("Show ordered pairs (4)");
  expect(html.match(/aria-label="Inspect prime/g)).toHaveLength(9);
  expect(html).toContain('aria-label="Your prime partitions"');
  expect(html).toContain("trigonometric-functions-galaxy.png");
  expect(html).not.toContain('role="status"');
});
