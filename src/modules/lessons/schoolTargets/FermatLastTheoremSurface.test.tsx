import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./FermatLastTheoremTargetLesson2009";
it("renders exact initial evidence and a computed bounded search",()=>{
  const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2009-fermats-last-theorem")!}/></MemoryRouter>);
  expect(html).toContain('data-testid="advanced-mockup-0903"');expect(html).toContain("Pythagorean triple (3, 4, 5)");expect(html).toContain("64 &lt; 91 &lt; 125");expect(html).not.toContain("Not searched yet");expect(html).toContain("No solution found");expect(html).toContain("Checked 5050 unordered pairs");expect(html).toContain('aria-label="Candidate c"');expect(html).toContain('aria-label="3 cubed: 27 unit cubes"');
});
