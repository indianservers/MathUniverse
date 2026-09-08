import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect, it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./CollatzConjectureTargetLesson2006";
it("renders computed orbit, a hundred heatmap starts and an unrun search", () => {
  const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2006-collatz-conjecture")!} /></MemoryRouter>);
  expect(html).toContain('data-testid="advanced-mockup-0900"');
  expect(html).toContain("9232"); expect(html).toContain("111");
  expect(html).toContain("Status: Not run");
  expect(html.match(/aria-label="Start \d+, stopping time/g)).toHaveLength(100);
  expect(html.match(/aria-label="Select orbit step/g)).toHaveLength(115);
  expect(html).toContain('aria-label="Orbit playback position"');
  expect(html).toContain("An unresolved bounded run is not a counterexample.");
  expect(html).not.toContain('role="status"');
});
