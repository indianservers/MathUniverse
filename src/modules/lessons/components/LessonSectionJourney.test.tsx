import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import { CoreLessonSections, lessonSectionForLabel, LessonSectionNav, SchoolLessonSections } from "./LessonSectionJourney";

describe("lesson section journey", () => {
  it("covers every core and school lesson with lesson-specific source data", () => {
    expect(lessonCatalog).toHaveLength(674);
    expect(schoolLessonCatalog).toHaveLength(220);

    for (const lesson of lessonCatalog) {
      const strengthened = getStrengthenedFoundationLesson(lesson.id);
      expect(titleKey(strengthened?.title ?? ""), `core lesson ${lesson.id} has strengthened content`).toBe(titleKey(lesson.title));
    }
    for (const lesson of schoolLessonCatalog) {
      const strengthened = getStrengthenedFoundationLesson(lesson.numericId);
      expect(strengthened?.title, `school lesson ${lesson.numericId} has strengthened content`).toBe(lesson.title);
    }
  });

  it("renders the five same-page navigation controls", () => {
    const html = renderToStaticMarkup(<LessonSectionNav lessonId={10084} />);
    for (const label of ["Interaction + visualization", "Learn", "Examples", "Formulas", "Know more"]) {
      expect(html).toContain(`>${label}</button>`);
    }
    expect(html).toContain("Lesson ID: 10084");
    expect(html).toContain('aria-label="Lesson ID 10084"');
  });

  it("maps bespoke lesson tab labels to the shared same-page sections", () => {
    expect(lessonSectionForLabel("▤ Explain")).toBe("learn");
    expect(lessonSectionForLabel("Learn")).toBe("learn");
    expect(lessonSectionForLabel("3 Worked Examples")).toBe("examples");
    expect(lessonSectionForLabel("∑ Formula & Rules")).toBe("formulas");
    expect(lessonSectionForLabel("⌘ Know more")).toBe("practice");
    expect(lessonSectionForLabel("Check answer")).toBeNull();
  });

  it("renders exact lesson sections for a core finance lesson", () => {
    const lesson = lessonCatalog.find((item) => item.id === 591)!;
    const html = renderToStaticMarkup(<CoreLessonSections lesson={lesson} />);
    expect(html).toContain('id="lesson-section-learn"');
    expect(html).toContain('id="lesson-section-examples"');
    expect(html).toContain('id="lesson-section-formulas"');
    expect(html).toContain('id="lesson-section-practice"');
    expect(html).toContain("Practice Simple Interest");
    expect(html).toContain("principal");
    expect(html).toContain("rate");
    expect(html).toContain("What you should be able to do");
    expect(html).toContain("Before you start");
    expect(html).toContain("Key vocabulary");
    expect(html).toContain("Essential facts");
    expect(html).toContain("Conditions and edge cases");
    expect(html).toContain("Common mistake");
    expect(html).toContain("Exit check");
    expect(html.match(/Example [123]/g)).toHaveLength(3);
    expect(html).toContain('data-testid="step-by-step-examples"');
    expect(html).toContain('data-testid="try-these"');
    expect(html).toContain("Show answer");
    expect(html.match(/aria-expanded="false"/g)).toHaveLength(5);
  });

  it("renders exact lesson sections for the final school lesson", () => {
    const lesson = schoolLessonCatalog.at(-1)!;
    const html = renderToStaticMarkup(<SchoolLessonSections lesson={lesson} />);
    expect(html).toContain(`Learn ${lesson.title}`);
    expect(html).toContain(`${lesson.title} examples`);
    expect(html).toContain(`${lesson.title} formulas and rules`);
    expect(html).toContain(`Practice ${lesson.title}`);
  });

  it("provides one visible content panel for every tab in every catalog lesson", () => {
    const sections = ["learn", "examples", "formulas", "practice"] as const;
    const expectActivePanel = (html: string, section: (typeof sections)[number], label: string) => {
      const panel = new RegExp(`<section(?=[^>]*id="lesson-section-${section}")(?![^>]*\\shidden=)[^>]*>`);
      expect(html, `${label} exposes ${section}`).toMatch(panel);
    };

    for (const lesson of lessonCatalog) {
      for (const section of sections) {
        expectActivePanel(
          renderToStaticMarkup(<CoreLessonSections lesson={lesson} active={section} />),
          section,
          `core lesson ${lesson.id}`,
        );
      }
    }

    for (const lesson of schoolLessonCatalog) {
      for (const section of sections) {
        expectActivePanel(
          renderToStaticMarkup(<SchoolLessonSections lesson={lesson} active={section} />),
          section,
          `school lesson ${lesson.numericId}`,
        );
      }
    }
  }, 15_000);
});

function titleKey(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "").toLowerCase();
}
