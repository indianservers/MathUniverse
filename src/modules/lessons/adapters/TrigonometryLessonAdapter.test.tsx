import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import TrigonometryLessonAdapter from "./TrigonometryLessonAdapter";

describe("TrigonometryLessonAdapter", () => {
  it("renders trigonometry lessons 257 through 276 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      257: "Angle measurement",
      258: "Unit circle",
      260: "Exact trig values",
      261: "Sine graph",
      262: "Cosine graph",
      263: "Tangent graph",
      264: "Reciprocal trig",
      265: "Inverse trig",
      266: "Trig identities",
      267: "Compound-angle formulae",
      268: "Double and half angle",
      269: "Trig equations",
      270: "Sine rule",
      271: "Cosine rule",
      272: "Triangle area formula",
      273: "Bearings",
      274: "Elevation and depression",
      275: "Harmonic motion",
      276: "Polar trigonometry",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <TrigonometryLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(`trigonometry-mockup-`);
      expect(html, lesson.title).toContain(snippet.split(" ")[0]);
      expect(html, lesson.title).not.toContain("Trig rule");
    }
  });

  it("renders lesson 259 as its own right-triangle ratio surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 259)!;
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <TrigonometryLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />
      </MemoryRouter>,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0316"');
    expect(html).toContain(
      "Coordinate-grid right triangle OBC with right angle at B",
    );
    expect(html).toContain("Right angle at B is fixed");
    expect(html).toContain("Signs by Quadrant (ASTC)");
    expect(html).toContain("SOH-CAH-TOA");
    expect(html).toContain("Common Misconception");
    expect(html).toContain('aria-label="Opposite"');
    expect(html).toContain('aria-label="Hypotenuse"');
  });

  it("renders lesson 257 as a dedicated, shared-state angle measurement surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 257)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0314"');
    expect(html).toContain('data-dedicated-lesson="257"');
    expect(html).toContain(
      'data-object-model="oriented-unit-circle-degree-radian-angle-measurement"',
    );
    expect(html).toContain('data-angle-degrees="60.0"');
    expect(html).toContain('data-cos="0.500000"');
    expect(html).toContain('data-sin="0.866025"');
    expect(html).toContain('data-testid="angle-ray-handle"');
    expect(html).toContain('data-testid="protractor-handle"');
    expect(html).toContain('aria-label="Angle in degrees"');
    expect(html).toContain("Degree-Radian Conversion");
    expect(html).toContain("What is the radian measure of 45°?");
  });

  it("renders lesson 258 as a dedicated linked unit-circle construction", () => {
    const lesson = lessonCatalog.find((item) => item.id === 258)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0315"');
    expect(html).toContain('data-dedicated-lesson="258"');
    expect(html).toContain(
      'data-object-model="linked-unit-circle-point-projection-coordinate-identity"',
    );
    expect(html).toContain('data-angle-degrees="30.0"');
    expect(html).toContain('data-cos="0.866025"');
    expect(html).toContain('data-sin="0.500000"');
    expect(html).toContain('data-identity="1.000000"');
    expect(html).toContain('data-testid="unit-circle-point"');
    expect(html).toContain('aria-label="Unit circle angle"');
    expect(html).toContain("Pythagorean Identity (Unit Circle Rule)");
    expect(html).toContain("What are cos θ and sin θ?");
  });
});
