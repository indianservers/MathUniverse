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

  it("renders Polyline with an ordered vertex model and real topology controls", () => {
    const lesson = lessonCatalog.find((item) => item.id === 207)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("Interactive polyline coordinate plane");
    expect(html).toContain('data-testid="polyline-point-0"');
    expect(html).toContain("Undo last action");
    expect(html).toContain("Polyline summary");
    expect(html).toContain("Segment lengths");
    expect(html).toContain('aria-label="Closure tolerance"');
    expect(html).toContain("Start constructing");
    expect(html).toContain("Target total length");
    expect(html).not.toContain("Direction</");
    expect(html).not.toContain("Spread</");
  });

  it("renders Perpendicular Line with a real constrained-line construction", () => {
    const lesson = lessonCatalog.find((item) => item.id === 208)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("Perpendicular line coordinate plane");
    expect(html).toContain('data-testid="perpendicular-point-p"');
    expect(html).toContain('aria-label="Given line slope"');
    expect(html).toContain('aria-label="Point P x"');
    expect(html).toContain("m⊥ = -1/m");
    expect(html).toContain("Construction steps (Compass-style)");
    expect(html).toContain("Start construction");
    expect(html).toContain("Check answer");
    expect(html).not.toContain("Base angle");
    expect(html).not.toContain("Point offset");
  });

  it("renders Parallel Line with equal-slope dependency controls", () => {
    const lesson = lessonCatalog.find((item) => item.id === 209)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("Parallel lines coordinate plane");
    expect(html).toContain('data-testid="parallel-point-p"');
    expect(html).toContain('aria-label="Slope m"');
    expect(html).toContain('aria-label="Point P x"');
    expect(html).toContain("mℓ = mₘ");
    expect(html).toContain("Worked example (steps)");
    expect(html).toContain("Start practice");
    expect(html).toContain("Check my answer");
    expect(html).not.toContain("Translate x");
  });

  it("renders Perpendicular Bisector with circle-intersection geometry", () => {
    const lesson = lessonCatalog.find((item) => item.id === 210)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Perpendicular bisector construction with draggable",
    );
    expect(html).toContain('data-testid="bisector-point-a"');
    expect(html).toContain('data-testid="bisector-point-b"');
    expect(html).toContain('aria-label="Arc radius"');
    expect(html).toContain("Show perpendicular bisector");
    expect(html).toContain("AP = BP");
    expect(html).toContain("XA = XB");
    expect(html).toContain("Practice point C draggable");
    expect(html).not.toContain("Segment angle");
    expect(html).not.toContain("Half length");
  });

  it("renders Angle Bisector with draggable rays and derived half-angles", () => {
    const lesson = lessonCatalog.find((item) => item.id === 211)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive angle bisector construction with draggable points A B and C",
    );
    expect(html).toContain('data-testid="angle-point-a"');
    expect(html).toContain('data-testid="angle-point-b"');
    expect(html).toContain('data-testid="angle-point-c"');
    expect(html).toContain('aria-label="Show arcs"');
    expect(html).toContain("∠BAL = ∠LAC = ½∠BAC");
    expect(html).toContain("Compass Construction");
    expect(html).toContain("Show steps on canvas");
    expect(html).toContain('data-testid="practice-angle-point-b"');
    expect(html).toContain('data-testid="practice-angle-point-c"');
    expect(html).toContain("New Angle");
    expect(html).not.toContain('aria-label="Full angle"');
    expect(html).not.toContain('aria-label="Ray length"');
  });

  it("renders Tangent with a constrained circle-contact dependency model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 212)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive tangent circle with draggable center O and contact point T",
    );
    expect(html).toContain('data-testid="tangent-center-o"');
    expect(html).toContain('data-testid="tangent-point-t"');
    expect(html).toContain('aria-label="Snap to circle"');
    expect(html).toContain('aria-label="Show secant line"');
    expect(html).toContain("Distance from O to");
    expect(html).toContain("Angle ∠OTℓ");
    expect(html).toContain("Power (point O to");
    expect(html).toContain("New Position");
    expect(html).not.toContain('aria-label="Contact angle"');
    expect(html).not.toContain('aria-label="Radius"');
  });

  it("renders Best Fit Line with draggable data and least-squares statistics", () => {
    const lesson = lessonCatalog.find((item) => item.id === 213)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive least-squares scatterplot with draggable observations and line",
    );
    expect(html).toContain('data-testid="best-fit-point-0"');
    expect(html).toContain('data-testid="best-fit-draggable-line"');
    expect(html).toContain('aria-label="m (slope)"');
    expect(html).toContain('aria-label="b (y-intercept)"');
    expect(html).toContain('aria-label="Fit least squares line"');
    expect(html).toContain("Sum of squared residuals (SSE)");
    expect(html).toContain("R² (maximize)");
    expect(html).toContain("Check my line");
    expect(html).not.toContain('aria-label="Intercept b"');
  });

  it("renders Triangle Constructor with SSS, SAS, and ASA construction contracts", () => {
    const lesson = lessonCatalog.find((item) => item.id === 214)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive triangle coordinate plane with draggable vertices A B and C",
    );
    expect(html).toContain('data-testid="triangle-point-a"');
    expect(html).toContain('data-testid="triangle-point-b"');
    expect(html).toContain('data-testid="triangle-point-c"');
    expect(html).toContain('data-testid="triangle-pan-layer"');
    expect(html).toContain("Triangle from three measures");
    expect(html).toContain("Feasibility rule (Triangle Inequality)");
    expect(html).toContain("Insight (Law of Cosines)");
    expect(html).toContain("Perimeter");
    expect(html).toContain("Classification");
    expect(html).toContain("New values");
    expect(html).not.toContain('aria-label="Apex x"');
    expect(html).not.toContain('aria-label="Apex y"');
  });

  it("renders Regular Polygon with generated vertices and exact measurements", () => {
    const lesson = lessonCatalog.find((item) => item.id === 215)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive regular polygon coordinate plane with draggable centre and vertices",
    );
    expect(html).toContain('data-testid="regular-polygon-center"');
    expect(html).toContain('data-testid="regular-polygon-vertex-0"');
    expect(html).toContain('aria-label="Sides (n)"');
    expect(html).toContain('aria-label="Radius (r)"');
    expect(html).toContain("Central angle (θ)");
    expect(html).toContain("Lines of symmetry");
    expect(html).toContain("A = ½nr² sin(360° / n)");
    expect(html).toContain('aria-label="Polygon practice side"');
    expect(html).toContain("Check Answer");
    expect(html).not.toContain('aria-label="Sides n"');
    expect(html).not.toContain('aria-label="Radius"');
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
