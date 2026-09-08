import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { expect,it } from "vitest";
import { findAdvancedConceptLesson } from "../catalog/advanced/advancedConceptLessons";
import Lesson from "./FourColorTheoremTargetLesson2010";
it("renders linked region and vertex controls with computed conflict status",()=>{
  const html=renderToStaticMarkup(<MemoryRouter><Lesson lesson={findAdvancedConceptLesson("2010-four-color-theorem")!}/></MemoryRouter>);
  expect(html).toContain('data-testid="advanced-mockup-0904"');expect(html).toContain("Great! No adjacent regions share a color. 4 colors used.");expect(html.match(/aria-label="Graph vertex /g)).toHaveLength(11);expect(html).toContain('aria-label="Paint Orange"');expect(html).toContain("17 shared borders");expect(html).toContain("Region 4, uncolored");expect(html).not.toContain("Correct! The map uses at most three colors");
});
