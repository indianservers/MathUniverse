import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { schoolLessonCatalog } from "../catalog/school/schoolSyllabusCatalog";
import SchoolProofMiniTool, { hasPhaseOneSchoolProofTool, hasPhaseThreeSchoolProofTool, hasPhaseTwoSchoolProofTool, hasSchoolProofMiniTool, phaseOneSchoolProofToolTitles, phaseThreeSchoolProofToolTitles, phaseTwoSchoolProofToolTitles, schoolProofToolConfigFor } from "./SchoolProofMiniTool";

describe("SchoolProofMiniTool Phase 1", () => {
  it("registers exact proof mini tools for all Phase 1 target lessons", () => {
    expect(phaseOneSchoolProofToolTitles).toHaveLength(18);
    const registeredTitles = new Set(schoolLessonCatalog.filter(hasPhaseOneSchoolProofTool).map((lesson) => lesson.title));
    expect(registeredTitles).toEqual(new Set(phaseOneSchoolProofToolTitles));
  });

  it("assigns the expected reusable modes", () => {
    const modeByTitle = new Map(
      schoolLessonCatalog
        .filter(hasPhaseOneSchoolProofTool)
        .map((lesson) => [lesson.title, schoolProofToolConfigFor(lesson)?.mode]),
    );

    expect(modeByTitle.get("Remainder Theorem")).toBe("polynomial");
    expect(modeByTitle.get("Factor Theorem")).toBe("polynomial");
    expect(modeByTitle.get("Euclid's Five Postulates")).toBe("classifier");
    expect(modeByTitle.get("Corresponding Angles")).toBe("parallel-angles");
    expect(modeByTitle.get("Triangle Angle Sum Theorem")).toBe("triangle-angles");
    expect(modeByTitle.get("Exterior Angle Theorem")).toBe("triangle-angles");
  });

  it("renders exact theorem and formula cards for representative Phase 1 tools", () => {
    for (const title of ["Remainder Theorem", "Euclid's Five Postulates", "Corresponding Angles", "Triangle Angle Sum Theorem"]) {
      const lesson = schoolLessonCatalog.find((candidate) => candidate.title === title)!;
      const html = renderToStaticMarkup(<SchoolProofMiniTool lesson={lesson} />);
      expect(html, title).toContain("Exact proof mini tool");
      expect(html, title).toContain("Theorem statement");
      expect(html, title).toContain("Exact formula / relation");
      expect(html, title).toContain("Invalid step to reject");
      expect(html, title).toContain("Board-style check");
    }
  });

  it("does not claim coverage for non-phase-one school lessons", () => {
    const lesson = schoolLessonCatalog.find((candidate) => candidate.title === "SAS Congruence")!;
    expect(hasPhaseOneSchoolProofTool(lesson)).toBe(false);
    expect(hasPhaseTwoSchoolProofTool(lesson)).toBe(true);
  });
});

describe("SchoolProofMiniTool Phase 3", () => {
  it("registers exact proof mini tools for all Phase 3 target lessons", () => {
    expect(phaseThreeSchoolProofToolTitles).toHaveLength(14);
    const registeredTitles = new Set(schoolLessonCatalog.filter(hasPhaseThreeSchoolProofTool).map((lesson) => lesson.title));
    expect(registeredTitles).toEqual(new Set(phaseThreeSchoolProofToolTitles));
    expect(schoolLessonCatalog.filter(hasSchoolProofMiniTool)).toHaveLength(51);
  });

  it("assigns Phase 3 lessons to senior theorem modes", () => {
    const modeByTitle = new Map(
      schoolLessonCatalog
        .filter(hasPhaseThreeSchoolProofTool)
        .map((lesson) => [lesson.title, schoolProofToolConfigFor(lesson)?.mode]),
    );

    expect(modeByTitle.get("Sum Formula by Induction")).toBe("induction");
    expect(modeByTitle.get("Tangent to a Parabola")).toBe("conic-tangent");
    expect(modeByTitle.get("Rolle's Theorem")).toBe("calculus-theorem");
    expect(modeByTitle.get("Minors and Cofactors")).toBe("cofactor");
    expect(modeByTitle.get("Bayes' Theorem")).toBe("probability-theorem");
  });

  it("renders exact theorem cards for representative Phase 3 tools", () => {
    for (const title of ["Logic of Mathematical Induction", "Tangent to an Ellipse", "Lagrange Mean Value Theorem", "Minors and Cofactors", "Bayes' Theorem"]) {
      const lesson = schoolLessonCatalog.find((candidate) => candidate.title === title)!;
      const html = renderToStaticMarkup(<SchoolProofMiniTool lesson={lesson} />);
      expect(html, title).toContain("Exact proof mini tool");
      expect(html, title).toContain("Theorem statement");
      expect(html, title).toContain("Exact formula / relation");
      expect(html, title).toContain("Invalid step to reject");
      expect(html, title).toContain("Board-style check");
    }
  });
});

describe("SchoolProofMiniTool Phase 2", () => {
  it("registers exact proof mini tools for all Phase 2 target lessons", () => {
    expect(phaseTwoSchoolProofToolTitles).toHaveLength(19);
    const registeredTitles = new Set(schoolLessonCatalog.filter(hasPhaseTwoSchoolProofTool).map((lesson) => lesson.title));
    expect(registeredTitles).toEqual(new Set(phaseTwoSchoolProofToolTitles));
    expect(phaseOneSchoolProofToolTitles.length + phaseTwoSchoolProofToolTitles.length).toBe(37);
  });

  it("assigns Phase 2 lessons to exact geometry modes", () => {
    const modeByTitle = new Map(
      schoolLessonCatalog
        .filter(hasPhaseTwoSchoolProofTool)
        .map((lesson) => [lesson.title, schoolProofToolConfigFor(lesson)?.mode]),
    );

    expect(modeByTitle.get("SAS Congruence")).toBe("congruence");
    expect(modeByTitle.get("Parallelogram Diagonals")).toBe("quadrilateral");
    expect(modeByTitle.get("Midpoint Theorem")).toBe("quadrilateral");
    expect(modeByTitle.get("Heron's Formula Derivation")).toBe("heron");
    expect(modeByTitle.get("Tangent Lengths from an External Point")).toBe("circle");
  });

  it("renders theorem cards and diagram labels for representative Phase 2 tools", () => {
    for (const title of ["SAS Congruence", "Parallelogram Diagonals", "Heron's Formula Derivation", "Tangent Perpendicular to Radius"]) {
      const lesson = schoolLessonCatalog.find((candidate) => candidate.title === title)!;
      const html = renderToStaticMarkup(<SchoolProofMiniTool lesson={lesson} />);
      expect(html, title).toContain("Exact proof mini tool");
      expect(html, title).toContain("Theorem statement");
      expect(html, title).toContain("Exact formula / relation");
      expect(html, title).toContain("Invalid step to reject");
      expect(html, title).toContain("Board-style check");
    }
  });
});
