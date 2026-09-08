import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import Lesson from "./FormulatingLinearProgrammingTargetLesson10200";
import { WORKSHOP, FACTORY, formulationSlots, formulationTokens } from "./linearProgrammingFormulationModel";

describe("formulation lesson initial surface", () => {
  it("exposes separate workshop and factory fields with empty progress", () => {
    const lesson = { title: "Formulating Linear Programming Problems" } as SchoolSyllabusLesson;
    const html = renderToStaticMarkup(<MemoryRouter><Lesson lesson={lesson} /></MemoryRouter>);
    expect(html).toContain('data-testid="school-mockup-0874"');
    expect(html).toContain('aria-label="Workshop model builder"');
    expect(html).toContain('aria-label="Practice model builder"');
    for (const [scenario, prefix] of [[WORKSHOP, ""], [FACTORY, "Practice "]] as const) {
      for (const slot of formulationSlots(scenario)) expect(html).toContain(`aria-label="${prefix}${slot.label}"`);
    }
    expect(html.match(/<progress value="0" max="10"/g)).toHaveLength(2);
    expect(html.match(/draggable="true"/g)).toHaveLength(formulationTokens(WORKSHOP).length + formulationTokens(FACTORY).length);
    expect(html.match(/Check my model/g)).toHaveLength(2);
    expect(html).toContain('aria-label="Reset workshop model"');
    expect(html).toContain('aria-label="Reset practice model"');
    expect(html).not.toContain('role="status"');
  });
});
