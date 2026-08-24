import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import Geometry2DLessonAdapter from "./Geometry2DLessonAdapter";

describe("Geometry2DLessonAdapter", () => {
  it("renders coordinate geometry lessons 167 through 182 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      167: "Cartesian rule",
      168: "Plotting rule",
      169: "Distance formula",
      170: "Midpoint formula",
      171: "Section formula",
      172: "Slope formula",
      173: "Line equation",
      174: "Parallel test",
      175: "Perpendicular test",
      176: "Angle rule",
      177: "Shortest distance",
      178: "Locus rule",
      179: "Transformation rule",
      180: "Polar conversion",
      181: "Parametric rule",
      182: "Barycentric rule",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <Geometry2DLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).toContain('data-direct-interaction="true"');
      expect(html, lesson.title).toContain("Drag points");
      expect(html, lesson.title).toContain("Worked:");
      expect(html, lesson.title).toContain("Avoid:");
      expect(html, lesson.title).not.toContain("Coordinate rule");
    }
  });

  it("renders angle-between-lines with two lines and an angle marker", () => {
    const lesson = lessonCatalog.find((item) => item.id === 176)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("Angle Between Lines");
    expect(html).toContain("line 1");
    expect(html).toContain("line 2");
    expect(html).toContain("angle 55.0 deg");
    expect(html).toContain("Angle offset");
    expect(html).toContain('data-direct-interaction="true"');
  });

  it("renders attach-detach point as its own circle-constraint surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 202)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("dynamic-geometry-mockup-0259");
    expect(html).toContain("Circle with attached point P and detached point Q");
    expect(html).toContain("P attached");
    expect(html).toContain("Q detached");
    expect(html).toContain("Constraint: circle");
    expect(html).toContain("Attach to circle");
    expect(html).toContain("Detach point");
    expect(html).toContain("Distance to object");
    expect(html).not.toContain("Construction Workspace");
  });

  it("renders line through two points as its own line-construction surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 203)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("dynamic-geometry-mockup-0260");
    expect(html).toContain(
      "Infinite line through draggable points A and B on a coordinate plane",
    );
    expect(html).toContain("Equation (slope-intercept form)");
    expect(html).toContain("Construction Steps");
    expect(html).toContain("slope m = (y₂ − y₁) / (x₂ − x₁)");
    expect(html).toContain("C x task coordinate");
    expect(html).not.toContain("Construction Workspace");
  });

  it("renders segment as its own finite-endpoint surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 204)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("dynamic-geometry-mockup-0261");
    expect(html).toContain(
      "Finite segment AB with draggable endpoints A and B",
    );
    expect(html).toContain("Instant observation");
    expect(html).toContain("Construction steps");
    expect(html).toContain("Definition &amp; insight");
    expect(html).toContain("Practice coordinate plane for segment");
    expect(html).toContain("Compare with");
    expect(html).not.toContain("Construction Workspace");
  });

  it("renders segment with given length as its own constrained construction", () => {
    const lesson = lessonCatalog.find((item) => item.id === 205)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("dynamic-geometry-mockup-0262");
    expect(html).toContain(
      "Fixed-length segment from A to constructed point B",
    );
    expect(html).toContain("Construction Controls");
    expect(html).toContain("Live Verification");
    expect(html).toContain("Coordinate Rule");
    expect(html).toContain("Construction Steps (Compass &amp; Straightedge)");
    expect(html).toContain('aria-label="Task length"');
    expect(html).not.toContain("Construction Workspace");
  });

  it("renders free point as its own draggable coordinate surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 198)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("dynamic-geometry-mockup-0255");
    expect(html).toContain("Free point P coordinate plane");
    expect(html).toContain("Point Properties");
    expect(html).toContain("Independent coordinates");
    expect(html).toContain("Worked Example");
    expect(html).toContain("Understand the Rule");
    expect(html).toContain("Try It: Your Turn");
    expect(html).not.toContain("Construction steps (Compass-style)");
  });

  it("renders point on object as its own constrained-line surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 199)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("dynamic-geometry-mockup-0256");
    expect(html).toContain("Point P constrained to line l coordinate plane");
    expect(html).toContain("Free point mode");
    expect(html).toContain("Slope (m)");
    expect(html).toContain("y-intercept (b)");
    expect(html).toContain("Point on a Circle");
    expect(html).toContain("Construction Steps (Line)");
    expect(html).toContain("Practice x coordinate");
    expect(html).not.toContain("Construction Workspace");
  });

  it("renders intersection point as its own two-line relationship surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 200)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("dynamic-geometry-mockup-0257");
    expect(html).toContain(
      "Two lines and their intersection on a coordinate plane",
    );
    expect(html).toContain("Intersecting (Unique Solution)");
    expect(html).toContain("Parallel (No Solution)");
    expect(html).toContain("Coincident (Infinite Solutions)");
    expect(html).toContain("Understand the rule");
    expect(html).toContain("Intersection answer x");
    expect(html).not.toContain("Construction Workspace");
  });

  it("renders midpoint or centre as its own endpoint-and-midpoint surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 201)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("dynamic-geometry-mockup-0258");
    expect(html).toContain("Draggable endpoints A and B with midpoint M");
    expect(html).toContain("Reverse endpoints challenge");
    expect(html).toContain("Midpoint / Centre Formula");
    expect(html).toContain("Worked midpoint graph");
    expect(html).toContain("Midpoint answer x");
    expect(html).not.toContain("Construction Workspace");
  });

  it("renders lessons 206 through 235 as thirty dedicated target surfaces", () => {
    for (let id = 206; id <= 235; id += 1) {
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const mockup = String(id + 57).padStart(4, "0");
      const html = renderToStaticMarkup(
        <Geometry2DLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(`dynamic-geometry-mockup-${mockup}`);
      expect(html, lesson.title).toContain(`data-dedicated-lesson="${id}"`);
      expect(html, lesson.title).toContain("data-object-model=");
      expect(html, lesson.title).toContain(
        "dedicated interactive geometry model",
      );
      expect(html, lesson.title).toContain("Live Verification");
      expect(html, lesson.title).toContain("Check Construction");
      expect(html, lesson.title).not.toContain("Construction Workspace");
    }
  });

  it("renders Ray with real point editing and target practice controls", () => {
    const lesson = lessonCatalog.find((item) => item.id === 206)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("Ray AB coordinate plane with draggable endpoint");
    expect(html).toContain('aria-label="Edit point A"');
    expect(html).toContain('aria-label="Edit point B"');
    expect(html).toContain('aria-label="Zoom in"');
    expect(html).toContain('aria-label="Fullscreen"');
    expect(html).toContain("P(-2,1)");
    expect(html).toContain("Q(2,5)");
    expect(html).toContain("Ray practice slope");
    expect(html).toContain("Check your answer");
    expect(html).not.toContain('type="range"');
  });

  it("renders geometry lessons 236 through 245 with transformation guidance", () => {
    const expectedSnippets: Record<number, string> = {
      236: "Translation by vector",
      237: "Reflection in line",
      238: "Reflection in point",
      239: "Reflection in circle",
      240: "Rotation around point",
      241: "Dilation from point",
      242: "Matrix transformation",
      243: "Composite transformations",
      244: "Transformation mapping",
      245: "Invariants",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <Geometry2DLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).toContain('data-direct-interaction="true"');
      expect(html, lesson.title).toContain("Drag points");
      expect(html, lesson.title).toContain("Worked:");
      expect(html, lesson.title).toContain("Avoid:");
      expect(html, lesson.title).not.toContain("Coordinate rule");
    }
  });

  it("renders geometry lessons 246 through 256 with loci and proof guidance", () => {
    const expectedSnippets: Record<number, string> = {
      246: "Symmetry explorer",
      247: "Locus generator",
      248: "Equidistant loci",
      249: "Moving-linkage loci",
      250: "Envelope of lines",
      251: "Dynamic trace",
      252: "Conjecture testing",
      253: "Exact proof",
      254: "Collinearity test",
      255: "Concurrency test",
      256: "Concyclicity test",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <Geometry2DLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).toContain('data-direct-interaction="true"');
      expect(html, lesson.title).toContain("Drag points");
      expect(html, lesson.title).toContain("Worked:");
      expect(html, lesson.title).toContain("Avoid:");
      expect(html, lesson.title).not.toContain("Coordinate rule");
    }
  });
});
