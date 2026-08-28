import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import Geometry2DLessonAdapter from "./Geometry2DLessonAdapter";

describe("Geometry2DLessonAdapter", () => {
  it("renders coordinate geometry lessons 169 through 182 with lesson-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
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

  it("renders plotting points as its own four-point construction surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 168)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain("geometry-mockup-0225");
    expect(html).toContain('data-dedicated-lesson="168"');
    expect(html).toContain("Click to plot points or drag to move them");
    expect(html).toContain("Snap to grid");
    expect(html).toContain("Treasure Challenge");
    expect(html).not.toContain("reusable 2D geometry engine");
  });

  it("renders Cartesian plane as its own draggable coordinate surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 167)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain("geometry-mockup-0224");
    expect(html).toContain('data-dedicated-lesson="167"');
    expect(html).toContain("Explore the Cartesian Plane");
    expect(html).toContain("Point P (x, y)");
    expect(html).toContain("Sign Pattern by Quadrant");
    expect(html).toContain("Plot each point on the plane");
    expect(html).toContain("Show Solution");
    expect(html).not.toContain("reusable 2D geometry engine");
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
      if (id !== 233) {
        expect(html, lesson.title).not.toContain("Construction Workspace");
      }
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

  it("renders Compass as a distance-transfer construction with linked controls", () => {
    const lesson = lessonCatalog.find((item) => item.id === 221)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive compass plane with draggable center and opening",
    );
    expect(html).toContain('data-testid="compass-center-point"');
    expect(html).toContain('data-testid="compass-radius-handle"');
    expect(html).toContain('aria-label="Opening radius"');
    expect(html).toContain("Copy Distance");
    expect(html).toContain("Step History");
    expect(html).toContain("Copy the distance AB to point C.");
    expect(html).toContain('data-testid="compass-practice-point-d"');
    expect(html).not.toContain("Compass transfer model");
  });

  it("renders Semicircle as a diameter-defined construction with Thales practice", () => {
    const lesson = lessonCatalog.find((item) => item.id === 222)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive semicircle with draggable diameter endpoints A B and arc point P",
    );
    expect(html).toContain('data-testid="semicircle-arc"');
    expect(html).toContain('data-testid="semicircle-endpoint-a"');
    expect(html).toContain('data-testid="semicircle-endpoint-b"');
    expect(html).toContain('data-testid="semicircle-arc-point"');
    expect(html).toContain('data-testid="thales-practice-point"');
    expect(html).toContain('aria-label="A x coordinate"');
    expect(html).toContain('aria-label="B y coordinate"');
    expect(html).toContain('aria-label="Upper semicircle"');
    expect(html).toContain('aria-label="Lower semicircle"');
    expect(html).toContain("Thales Challenge");
    expect(html).not.toContain('aria-label="Diameter"');
    expect(html).not.toContain('aria-label="Orientation"');
  });

  it("renders Circular Arc with a center-radius two-endpoint model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 223)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive circular arc plane with draggable center O and circumference points A and B",
    );
    expect(html).toContain('data-testid="circular-arc-path"');
    expect(html).toContain('data-testid="arc-center-point"');
    expect(html).toContain('data-testid="arc-start-point"');
    expect(html).toContain('data-testid="arc-end-point"');
    expect(html).toContain('aria-label="Center x"');
    expect(html).toContain('aria-label="Arc radius"');
    expect(html).toContain('aria-label="Start angle"');
    expect(html).toContain('aria-label="End angle"');
    expect(html).toContain("Minor arc");
    expect(html).toContain("Major arc");
    expect(html).toContain("s = θ/360° × 2πr");
    expect(html).toContain('aria-label="Practice arc length"');
    expect(html).not.toContain('aria-label="Arc angle"');
    expect(html).not.toContain("Circular arc model");
  });

  it("renders Circumcircular Arc from three unrestricted points", () => {
    const lesson = lessonCatalog.find((item) => item.id === 224)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive circumcircular arc through draggable points A B and C",
    );
    expect(html).toContain('data-testid="circumarc-circle"');
    expect(html).toContain('data-testid="circumarc-through-a"');
    expect(html).toContain('data-testid="circumarc-center"');
    expect(html).toContain('data-testid="circumarc-point-a"');
    expect(html).toContain('data-testid="circumarc-point-b"');
    expect(html).toContain('data-testid="circumarc-point-c"');
    expect(html).toContain('aria-label="Point A x"');
    expect(html).toContain('aria-label="Point C y slider"');
    expect(html).toContain("∠AOC = 2∠ABC");
    expect(html).toContain('aria-label="Practice arc measure"');
    expect(html).toContain('aria-label="Practice inscribed angle"');
    expect(html).not.toContain('aria-label="Central angle"');
    expect(html).not.toContain("circumArc objects with lesson-specific");
  });

  it("renders Circular Sector from a center-radius-angle object model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 225)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive circular sector with draggable center radius and angle handles",
    );
    expect(html).toContain('data-testid="sector-fill"');
    expect(html).toContain('data-testid="sector-arc"');
    expect(html).toContain('data-testid="sector-center-handle"');
    expect(html).toContain('data-testid="sector-radius-handle"');
    expect(html).toContain('data-testid="sector-angle-handle"');
    expect(html).toContain('aria-label="Sector radius"');
    expect(html).toContain('aria-label="Sector central angle"');
    expect(html).toContain('aria-label="Practice sector radius"');
    expect(html).toContain("A = ½ r²θ");
    expect(html).not.toContain("area = theta*r^2/2");
    expect(html).not.toContain("Dedicated sector objects with lesson-specific");
  });

  it("renders Conic Through Five Points from a solved homogeneous system", () => {
    const lesson = lessonCatalog.find((item) => item.id === 226)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain("Five draggable points and their solved general conic");
    expect(html).toContain('data-testid="five-point-conic-path"');
    expect(html).toContain('data-classification="ellipse"');
    expect(html).toContain('data-testid="conic-point-1"');
    expect(html).toContain('data-testid="conic-point-5"');
    expect(html).toContain('aria-label="Conic point 1 x"');
    expect(html).toContain('aria-label="Conic point 5 y"');
    expect(html).toContain("B² − 4AC");
    expect(html).toContain("All five points lie on the conic.");
    expect(html).not.toContain("Horizontal scale");
    expect(html).not.toContain("Dedicated conicFive objects");
  });

  it("renders Ellipse from a two-focus constant-sum locus", () => {
    const lesson = lessonCatalog.find((item) => item.id === 227)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive ellipse with draggable center foci and constrained point P",
    );
    expect(html).toContain('data-testid="ellipse-locus"');
    expect(html).toContain('data-testid="ellipse-center"');
    expect(html).toContain('data-testid="ellipse-focus-1"');
    expect(html).toContain('data-testid="ellipse-focus-2"');
    expect(html).toContain('data-testid="ellipse-point"');
    expect(html).toContain('data-testid="ellipse-focal-sum">12.00');
    expect(html).toContain('aria-label="Ellipse semi-major axis"');
    expect(html).toContain('aria-label="Ellipse eccentricity"');
    expect(html).toContain('aria-label="Ellipse practice minor"');
    expect(html).toContain("PF₁ + PF₂ = 2a");
    expect(html).not.toContain("Semi-minor b");
    expect(html).not.toContain("Dedicated ellipse objects");
  });

  it("renders Hyperbola from a two-focus constant-difference locus", () => {
    const lesson = lessonCatalog.find((item) => item.id === 228)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive hyperbola with draggable center foci and constrained point P",
    );
    expect(html).toContain('data-testid="hyperbola-left-branch"');
    expect(html).toContain('data-testid="hyperbola-right-branch"');
    expect(html).toContain('data-testid="hyperbola-focus-1"');
    expect(html).toContain('data-testid="hyperbola-focus-2"');
    expect(html).toContain('data-testid="hyperbola-point"');
    expect(html).toContain('data-testid="hyperbola-focal-difference">6.000');
    expect(html).toContain('aria-label="Hyperbola right focus"');
    expect(html).toContain('aria-label="Practice hyperbola semi-axis"');
    expect(html).toContain("c² = a² + b²");
    expect(html).not.toContain("Semi-axis b");
    expect(html).not.toContain("Dedicated hyperbola objects");
  });

  it("renders Parabola from a focus-directrix equal-distance locus", () => {
    const lesson = lessonCatalog.find((item) => item.id === 229)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive focus-directrix parabola with draggable focus directrix and trace point",
    );
    expect(html).toContain('data-object-model="focus-directrix-equal-distance-parabola"');
    expect(html).toContain('data-testid="parabola-locus"');
    expect(html).toContain('data-p="2.000000"');
    expect(html).toContain('data-vertex-y="0.000000"');
    expect(html).toContain('data-testid="parabola-focus"');
    expect(html).toContain('data-testid="parabola-directrix-line"');
    expect(html).toContain('data-testid="parabola-point"');
    expect(html).toContain('aria-label="Parabola directrix"');
    expect(html).toContain('aria-label="Practice parabola focus y"');
    expect(html).toContain("FP = d(P, directrix)");
    expect(html).toContain("Focus at (−1, 3)");
    expect(html).not.toContain("Dedicated parabola objects");
  });

  it("renders Distance Length from two editable coordinate endpoints", () => {
    const lesson = lessonCatalog.find((item) => item.id === 230)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Coordinate plane with draggable distance endpoints A and B",
    );
    expect(html).toContain('data-object-model="two-endpoint-coordinate-distance"');
    expect(html).toContain('data-testid="distance-segment"');
    expect(html).toContain('data-distance="7.810250"');
    expect(html).toContain('data-testid="distance-point-a"');
    expect(html).toContain('data-testid="distance-point-b"');
    expect(html).toContain('data-testid="distance-delta-x"');
    expect(html).toContain('data-testid="distance-delta-y"');
    expect(html).toContain('aria-label="Point A x coordinate"');
    expect(html).toContain('aria-label="Point B y coordinate"');
    expect(html).toContain(
      "Practice coordinate plane with draggable points P and Q",
    );
    expect(html).toContain("AB = √(6² + 5²) = √61");
    expect(html).not.toContain("Delta x");
    expect(html).not.toContain("Dedicated distance objects");
  });

  it("renders Area from an area-preserving shoelace quadrilateral", () => {
    const lesson = lessonCatalog.find((item) => item.id === 231)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Area-preserving draggable quadrilateral on a coordinate grid",
    );
    expect(html).toContain(
      'data-object-model="area-preserving-shoelace-quadrilateral"',
    );
    expect(html).toContain('data-testid="area-polygon"');
    expect(html).toContain('data-area="18.000000"');
    expect(html).toContain('data-testid="area-vertex-0"');
    expect(html).toContain('data-testid="area-vertex-3"');
    expect(html).toContain('data-testid="area-triangulation-diagonal"');
    expect(html).toContain('data-testid="polygon-area-value">18.00');
    expect(html).toContain('data-testid="polygon-perimeter-value">17.43');
    expect(html).toContain(
      "Practice area-preserving draggable quadrilateral",
    );
    expect(html).toContain("A = ½ |Σ(xᵢyᵢ₊₁ − xᵢ₊₁yᵢ)|");
    expect(html).not.toContain("Width");
    expect(html).not.toContain("Dedicated area objects");
  });

  it("renders Angle from three draggable points and two oriented rays", () => {
    const lesson = lessonCatalog.find((item) => item.id === 232)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Interactive angle with draggable vertex A and ray points B and C",
    );
    expect(html).toContain(
      'data-object-model="three-point-two-ray-oriented-angle"',
    );
    expect(html).toContain('data-testid="angle-ray-ab"');
    expect(html).toContain('data-testid="angle-ray-ac"');
    expect(html).toContain('data-testid="angle-arc"');
    expect(html).toContain('data-testid="angle-point-a"');
    expect(html).toContain('data-testid="angle-point-b"');
    expect(html).toContain('data-testid="angle-point-c"');
    expect(html).toContain('data-testid="angle-measurement">55.0°');
    expect(html).toContain('aria-label="Copy point A"');
    expect(html).toContain("Practice protractor with draggable ray C");
    expect(html).toContain("Construct an angle of 120°.");
    expect(html).not.toContain("Ray length");
    expect(html).not.toContain("Dedicated angle objects");
  });

  it("renders Fixed Angle with a locked origin-ray constraint model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 233)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Fixed angle graph with draggable origin O and constrained point P",
    );
    expect(html).toContain('data-object-model="locked-origin-ray-angle"');
    expect(html).toContain('data-testid="fixed-origin"');
    expect(html).toContain('data-testid="fixed-point-p"');
    expect(html).toContain('data-testid="fixed-constrained-ray"');
    expect(html).toContain('data-testid="fixed-live-angle">55.0°');
    expect(html).toContain('aria-label="Target angle"');
    expect(html).toContain('aria-label="Lock main angle"');
    expect(html).toContain(
      "Practice fixed angle graph with draggable point P",
    );
    expect(html).toContain('aria-label="Practice target angle"');
    expect(html).toContain("Construct a ray making 30° with the base line.");
    expect(html).not.toContain('aria-label="Base rotation"');
    expect(html).not.toContain("Dedicated fixedAngle objects");
  });

  it("renders Relation Checker with typed objects and exact predicates", () => {
    const lesson = lessonCatalog.find((item) => item.id === 234)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Relation workspace with draggable lines l and m and point A",
    );
    expect(html).toContain(
      'data-object-model="typed-object-exact-relation-predicates"',
    );
    expect(html).toContain('data-testid="relation-line-l"');
    expect(html).toContain('data-testid="relation-line-m"');
    expect(html).toContain('data-testid="relation-result"');
    expect(html).toContain('data-valid="true"');
    expect(html).toContain("m<sub>ℓ</sub> · m<sub>m</sub> = −1");
    expect(html).toContain('aria-label="Auto-check relations"');
    expect(html).toContain("Practice perpendicular lines with draggable line m");
    expect(html).toContain("Check my relation");
    expect(html).not.toContain('aria-label="Line 1 angle"');
    expect(html).not.toContain('aria-label="Line 2 angle"');
    expect(html).not.toContain("Dedicated relation objects");
  });

  it("renders Construction Steps with an ordered dependency DAG", () => {
    const lesson = lessonCatalog.find((item) => item.id === 235)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain(
      "Construction dependency graph with draggable points A and B",
    );
    expect(html).toContain(
      'data-object-model="ordered-geometric-dependency-dag"',
    );
    expect(html).toContain('data-current-step="1"');
    expect(html).toContain('data-stable="true"');
    expect(html).toContain('data-testid="steps-point-a"');
    expect(html).not.toContain('data-testid="steps-point-b"');
    expect(html).toContain('aria-label="Construction timeline position"');
    expect(html).toContain('aria-label="Unlock construction"');
    expect(html).toContain("Line ℓ ⟂ AB");
    expect(html).toContain("ordered-geometric-dependency-dag");
    expect(html).toContain("Start Construction");
    expect(html).not.toContain('aria-label="Point A x"');
    expect(html).not.toContain('aria-label="Point B x"');
    expect(html).not.toContain("Dedicated steps objects");
  });

  it("renders Rigid Polygon with a triangle rigid-body motion model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 216)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain("Interactive rigid triangle plane with movable original and translated overlay");
    expect(html).toContain('data-testid="rigid-original-polygon"');
    expect(html).toContain('data-testid="rigid-overlay-polygon"');
    expect(html).toContain('data-testid="rigid-vertex-a"');
    expect(html).toContain("Side lengths stay the same.");
    expect(html).toContain("Rotate triangle ABC about point P(0, 0) by 90 degrees counterclockwise.");
    expect(html).toContain('aria-label="A rotated x"');
    expect(html).not.toContain('aria-label="Rotation"');
    expect(html).not.toContain('aria-label="Translate x"');
  });

  it("renders General Polygon with an editable measured vertex collection", () => {
    const lesson = lessonCatalog.find((item) => item.id === 217)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain("Editable general polygon coordinate plane with add drag and remove vertices");
    expect(html).toContain('data-testid="general-polygon-body"');
    expect(html).toContain('data-testid="general-polygon-vertex-0"');
    expect(html).toContain('data-area=');
    expect(html).toContain("Interior Angles");
    expect(html).toContain("Self-intersecting");
    expect(html).toContain("Try It Independently");
    expect(html).toContain('aria-label="Hexagon interior sum"');
    expect(html).not.toContain('aria-label="Vertices"');
    expect(html).not.toContain('aria-label="Irregularity"');
  });

  it("renders Circle Centre and Point with a direct radius dependency", () => {
    const lesson = lessonCatalog.find((item) => item.id === 218)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain("Interactive circle with draggable centre C and circumference point P");
    expect(html).toContain('data-testid="circle-centre-handle"');
    expect(html).toContain('data-testid="circle-point-handle"');
    expect(html).toContain('aria-label="Centre x coordinate"');
    expect(html).toContain('aria-label="Point y coordinate"');
    expect(html).toContain("Live measurements");
    expect(html).toContain("Load this challenge");
    expect(html).not.toContain('aria-label="Point angle"');
    expect(html).not.toContain('aria-label="Point distance"');
  });

  it("renders Circle Centre and Radius with an independent fixed radius", () => {
    const lesson = lessonCatalog.find((item) => item.id === 219)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain("Interactive fixed-radius circle with draggable centre and compass handle");
    expect(html).toContain('data-testid="fixed-radius-circle"');
    expect(html).toContain('data-testid="fixed-radius-centre"');
    expect(html).toContain('data-testid="fixed-radius-handle"');
    expect(html).toContain('aria-label="Circle radius"');
    expect(html).toContain('aria-label="Centre x"');
    expect(html).toContain("Equation of the Circle");
    expect(html).toContain("Construct a circle with centre C(-3, 2)");
    expect(html).toContain("Check Answer");
    expect(html).not.toContain('aria-label="Centre x" type="range"');
  });

  it("renders Circle Through Three Points with a circumcircle dependency", () => {
    const lesson = lessonCatalog.find((item) => item.id === 220)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain("Interactive circumcircle through draggable points A B and C");
    expect(html).toContain('data-testid="circumcircle-point-0"');
    expect(html).toContain('data-testid="three-point-circle"');
    expect(html).toContain('data-testid="circumcentre-o"');
    expect(html).toContain("Perpendicular bisectors");
    expect(html).toContain("If the three points are collinear");
    expect(html).toContain('aria-label="Circumcentre x"');
    expect(html).toContain('aria-label="Equation radius squared"');
    expect(html).not.toContain('aria-label="Point C x"');
    expect(html).not.toContain('aria-label="Point C y"');
  });

  it("renders Translation by Vector as a dedicated rigid translation model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 236)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="dynamic-geometry-mockup-0293"');
    expect(html).toContain('data-object-model="rigid-vector-translation-pair"');
    expect(html).toContain("Interactive translation graph with draggable source triangle and vector");
    expect(html).toContain('data-testid="translation-source-triangle"');
    expect(html).toContain('data-testid="translation-image-triangle"');
    expect(html).toContain('data-testid="translation-vector-handle"');
    expect(html).toContain('aria-label="Vector x component exact value"');
    expect(html).toContain("(x, y) + &lt; a, b &gt; = (x + a, y + b)");
    expect(html).toContain("Practice translation graph with draggable triangle and vector");
    expect(html).toContain('aria-label="A&#x27; x coordinate"');
    expect(html).toContain("Show solution");
    expect(html).not.toContain("reusable 2D geometry engine");
  });

  it("renders Reflection in Line as a dedicated orthogonal reflection model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 237)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="dynamic-geometry-mockup-0294"');
    expect(html).toContain('data-object-model="point-line-orthogonal-reflection"');
    expect(html).toContain("Interactive point and mirror line reflection graph");
    expect(html).toContain('data-testid="reflection-source-point"');
    expect(html).toContain('data-testid="reflection-image-point"');
    expect(html).toContain('data-testid="reflection-mirror-line"');
    expect(html).toContain('aria-label="Point P x coordinate"');
    expect(html).toContain('aria-label="Image P&#x27; x coordinate"');
    expect(html).toContain("(x, y) → (2a - x, y)");
    expect(html).toContain("Practice horizontal line reflection graph");
    expect(html).toContain("Check my work");
    expect(html).not.toContain("reusable 2D geometry engine");
    expect(html).not.toContain("Drag points");
  });

  it("renders Reflection in Point as a dedicated midpoint half-turn model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 238)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain('data-testid="dynamic-geometry-mockup-0295"');
    expect(html).toContain('data-object-model="centre-midpoint-half-turn-reflection"');
    expect(html).toContain("Interactive central reflection graph with draggable centre P and point A");
    expect(html).toContain('data-testid="point-reflection-centre"');
    expect(html).toContain('data-testid="point-reflection-source"');
    expect(html).toContain('data-testid="point-reflection-image"');
    expect(html).toContain('data-testid="point-reflection-midpoint-pa"');
    expect(html).toContain('aria-label="Centre P x coordinate"');
    expect(html).toContain("A&#x27; = (2h - x, 2k - y)");
    expect(html).toContain('aria-label="Practice reflected x coordinate"');
    expect(html).toContain("Check answer");
    expect(html).not.toContain("reusable 2D geometry engine");
    expect(html).not.toContain("Drag points");
  });

  it("renders Reflection in Circle as a dedicated opposite-ray inversion model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 239)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain('data-testid="dynamic-geometry-mockup-0296"');
    expect(html).toContain('data-object-model="opposite-ray-circle-inversion"');
    expect(html).toContain("Interactive reflection in circle graph with draggable O, P, and radius");
    expect(html).toContain('data-testid="circle-reflection-centre"');
    expect(html).toContain('data-testid="circle-reflection-source"');
    expect(html).toContain('data-testid="circle-reflection-image"');
    expect(html).toContain('data-testid="circle-reflection-radius-handle"');
    expect(html).toContain('aria-label="Circle radius exact value"');
    expect(html).toContain("OP · OP&#x27; = r²");
    expect(html).toContain('aria-label="Practice inverse x coordinate"');
    expect(html).not.toContain("reusable 2D geometry engine");
    expect(html).not.toContain("Drag points");
  });

  it("renders Rotation Around Point as a dedicated signed-angle rotation model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 240)!;
    const html = renderToStaticMarkup(
      <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    );

    expect(html).toContain('data-testid="dynamic-geometry-mockup-0297"');
    expect(html).toContain('data-object-model="fixed-centre-signed-angle-rotation"');
    expect(html).toContain("Interactive graph rotating P around draggable centre O");
    expect(html).toContain('data-testid="rotation-centre"');
    expect(html).toContain('data-testid="rotation-source"');
    expect(html).toContain('data-testid="rotation-image"');
    expect(html).toContain('data-testid="rotation-arc"');
    expect(html).toContain('aria-label="Rotation angle"');
    expect(html).toContain("x cos θ − y sin θ");
    expect(html).toContain('aria-label="Practice rotated x coordinate"');
    expect(html).not.toContain("Drag points");
  });

  it("renders Dilation from Point as a dedicated triangle scale model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 241)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0298"');
    expect(html).toContain('data-object-model="centre-scale-triangle-dilation"');
    expect(html).toContain("Interactive triangle dilation with draggable centre and vertices");
    expect(html).toContain('data-testid="dilation-centre"');
    expect(html).toContain('data-testid="dilation-source-a"');
    expect(html).toContain('data-testid="dilation-image-polygon"');
    expect(html).toContain('aria-label="Scale factor"');
    expect(html).toContain("Area scale factor = k²");
    expect(html).toContain("Check my construction");
    expect(html).not.toContain("Drag points");
  });

  it("renders Matrix Transformation as a dedicated editable linear map", () => {
    const lesson = lessonCatalog.find((item) => item.id === 242)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0299"');
    expect(html).toContain('data-object-model="editable-linear-map-basis-shape"');
    expect(html).toContain("Interactive source shape and its matrix transformation");
    expect(html).toContain('data-testid="matrix-source-a"');
    expect(html).toContain('data-testid="matrix-transformed-shape"');
    expect(html).toContain('aria-label="Matrix a"');
    expect(html).toContain("Area scale factor = |det(A)|");
    expect(html).toContain('aria-label="Practice matrix 1"');
    expect(html).not.toContain("Drag points");
  });

  it("renders Composite Transformations as a dedicated ordered affine composer", () => {
    const lesson = lessonCatalog.find((item) => item.id === 243)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0300"');
    expect(html).toContain('data-object-model="ordered-two-step-affine-composition"');
    expect(html).toContain("Interactive two-step composite transformation graph");
    expect(html).toContain('data-testid="composite-source-a"');
    expect(html).toContain('data-testid="composite-intermediate-a"');
    expect(html).toContain('data-testid="composite-final-triangle"');
    expect(html).toContain('aria-label="Swap transformation order"');
    expect(html).toContain("T₂ ∘ T₁(P) = T₂(T₁(P))");
    expect(html).toContain('aria-label="First practice transformation"');
  });

  it("renders Transformation Mapping as a dedicated linked coordinate model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 244)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0301"');
    expect(html).toContain('data-object-model="linked-preimage-image-rule-inference"');
    expect(html).toContain("Interactive linked pre-image and image coordinate mapping");
    expect(html).toContain('data-testid="mapping-source-a"');
    expect(html).toContain('data-testid="mapping-image-a"');
    expect(html).toContain('data-testid="mapping-image-triangle"');
    expect(html).toContain('aria-label="Rotation angle"');
    expect(html).toContain("(x,y) → (−y,x)");
    expect(html).toContain('aria-label="Practice mapped x expression"');
  });

  it("renders Invariants as a dedicated measured transformation model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 245)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0302"');
    expect(html).toContain('data-object-model="measured-triangle-transformation-invariants"');
    expect(html).toContain("Interactive measured triangle and transformed image");
    expect(html).toContain('data-testid="invariants-source-a"');
    expect(html).toContain('data-testid="invariants-image-triangle"');
    expect(html).toContain('aria-label="Translation delta x"');
    expect(html).toContain("Invariants Tracker");
    expect(html).toContain('aria-label="Practice A prime x"');
    expect(html).toContain("Check Answer");
  });

  it("renders Symmetry Explorer as a dedicated exact symmetry model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 246)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0303"');
    expect(html).toContain('data-object-model="draggable-motif-exact-symmetry-tests"');
    expect(html).toContain("Interactive symmetry motif with mirror and rotation previews");
    expect(html).toContain('data-testid="symmetry-point-a"');
    expect(html).toContain('data-testid="symmetry-mirror-image"');
    expect(html).toContain('aria-label="Symmetry mirror line"');
    expect(html).toContain('aria-label="Rotation angle"');
    expect(html).toContain('aria-label="Practice reflected B x"');
    expect(html).toContain("Check Answer");
  });

  it("renders Locus Generator as a dedicated anchor-radius trace model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 247)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0304"');
    expect(html).toContain('data-object-model="anchor-radius-transformed-circle-locus"');
    expect(html).toContain("Interactive anchor and moving point circle locus");
    expect(html).toContain('data-testid="locus-anchor"');
    expect(html).toContain('data-testid="locus-moving-point"');
    expect(html).toContain('aria-label="Radius r"');
    expect(html).toContain("Distance AP");
    expect(html).toContain('aria-label="Practice A x (h)"');
    expect(html).toContain("Try it yourself");
  });

  it("renders Equidistant Loci as a dedicated perpendicular-bisector model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 248)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0305"');
    expect(html).toContain('data-object-model="dependent-perpendicular-bisector-equal-distance"');
    expect(html).toContain("Interactive equidistant points and perpendicular bisector locus");
    expect(html).toContain('data-testid="equidistant-point-a"');
    expect(html).toContain('data-testid="equidistant-anchor-p"');
    expect(html).toContain('aria-label="Locus anchor P x coordinate"');
    expect(html).toContain("|AP − BP|");
    expect(html).toContain('aria-label="Practice equation B"');
    expect(html).toContain("3x + 2y − 5 = 0");
  });

  it("renders Moving-Linkage Loci as a dedicated fixed-foci ellipse model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 249)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0306"');
    expect(html).toContain('data-object-model="fixed-foci-flexible-tether-ellipse"');
    expect(html).toContain("Interactive fixed-foci linkage tracing an ellipse");
    expect(html).toContain('data-testid="linkage-point-p"');
    expect(html).toContain('data-testid="linkage-locus"');
    expect(html).toContain('aria-label="Link AB"');
    expect(html).toContain("AP + PC");
    expect(html).toContain('aria-label="Linkage practice B"');
    expect(html).toContain("Ellipse (a = 5, b = 3)");
  });

  it("renders Envelope of Lines as a dedicated tangent-family model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 250)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0307"');
    expect(html).toContain('data-object-model="parameterized-tangent-family-parabola-envelope"');
    expect(html).toContain("Interactive tangent line family and detected parabola envelope");
    expect(html).toContain('data-testid="envelope-contact-point"');
    expect(html).toContain('data-testid="envelope-current-line"');
    expect(html).toContain('aria-label="m (slope)"');
    expect(html).toContain("∂F/∂m");
    expect(html).toContain('aria-label="Envelope challenge A"');
    expect(html).toContain("y = x² + 1");
  });

  it("renders Dynamic Trace as a dedicated dependent dilation model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 251)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0308"');
    expect(html).toContain('data-object-model="dependent-dilation-image-with-temporal-trace"');
    expect(html).toContain("Interactive dilation with source point and dependent traced image");
    expect(html).toContain('data-testid="dynamic-trace-source-a"');
    expect(html).toContain('data-testid="dynamic-trace-image-b"');
    expect(html).toContain('aria-label="Trace enabled"');
    expect(html).toContain('aria-label="Transform k"');
    expect(html).toContain("B′ = (k");
    expect(html).toContain('aria-label="Dynamic trace challenge A"');
    expect(html).toContain("(-6, 3)");
  });

  it("renders Conjecture Testing as a dedicated measured trial model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 252)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0309"');
    expect(html).toContain('data-object-model="measured-translation-conjecture-trial-engine"');
    expect(html).toContain("Draggable segment and its translated image for conjecture testing");
    expect(html).toContain('data-testid="conjecture-point-a"');
    expect(html).toContain('data-testid="conjecture-point-b"');
    expect(html).toContain('data-testid="conjecture-vector-handle"');
    expect(html).toContain('aria-label="Conjecture statement"');
    expect(html).toContain("claim holds so far");
    expect(html).toContain('aria-label="Conjecture challenge C"');
  });

  it("renders Exact Proof as a dedicated symbolic proof-chain model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 253)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0310"');
    expect(html).toContain('data-object-model="exact-translation-isometry-proof-chain"');
    expect(html).toContain("Exact translation proof construction with draggable premises");
    expect(html).toContain('data-testid="exact-proof-point-a"');
    expect(html).toContain('data-testid="exact-proof-vector-handle"');
    expect(html).toContain('aria-label="Proof reason 6"');
    expect(html).toContain("Distance preserved under translation");
    expect(html).toContain('aria-label="Exact proof practice A"');
    expect(html).toContain("A′ = (2,1)");
  });

  it("renders Collinearity Test as synchronized exact geometric tests", () => {
    const lesson = lessonCatalog.find((item) => item.id === 254)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0311"');
    expect(html).toContain('data-object-model="three-point-synchronized-exact-collinearity-tests"');
    expect(html).toContain("Three draggable points with exact synchronized collinearity tests");
    expect(html).toContain('data-testid="collinearity-point-a"');
    expect(html).toContain('data-testid="collinearity-line"');
    expect(html).toContain('aria-label="C y coordinate"');
    expect(html).toContain("Zero-area test (determinant)");
    expect(html).toContain("AB × AC");
    expect(html).toContain('aria-label="Collinearity practice A"');
  });

  it("renders Concurrency Test as an exact Ceva theorem model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 255)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0312"');
    expect(html).toContain('data-object-model="triangle-cevians-exact-ceva-concurrency"');
    expect(html).toContain("Draggable triangle side points with exact Ceva concurrency test");
    expect(html).toContain('data-testid="concurrency-point-f"');
    expect(html).toContain('data-testid="concurrency-common-point"');
    expect(html).toContain('aria-label="AF over FB"');
    expect(html).toContain("AF/FB × BD/DC × CE/EA = 1");
    expect(html).toContain('aria-label="Practice Ceva F ratio"');
  });

  it("renders Concyclicity Test as an exact four-point circle model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 256)!;
    const html = renderToStaticMarkup(<Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="dynamic-geometry-mockup-0313"');
    expect(html).toContain('data-object-model="four-point-circumcircle-determinant-angle-residual"');
    expect(html).toContain("Four draggable points with fitted circumcircle and exact concyclicity checks");
    expect(html).toContain('data-testid="concyclicity-fitted-circle"');
    expect(html).toContain('data-testid="concyclicity-point-d"');
    expect(html).toContain('aria-label="D y coordinate"');
    expect(html).toContain("Four-point determinant");
    expect(html).toContain("Radial residual");
    expect(html).toContain('aria-label="Practice D radial scale"');
  });
});
