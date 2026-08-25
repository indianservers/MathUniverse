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
      "Coordinate-grid right triangle OBC with independently draggable O, B and C and right angle at B",
    );
    expect(html).toContain('data-dedicated-lesson="259"');
    expect(html).toContain(
      'data-object-model="axis-aligned-right-triangle-dependent-vertex-ratio-model"',
    );
    expect(html).toContain('data-right-angle="true"');
    expect(html).toContain('data-testid="right-triangle-point-o"');
    expect(html).toContain('data-testid="right-triangle-point-b"');
    expect(html).toContain('data-testid="right-triangle-point-c"');
    expect(html).toContain("Right angle at B is fixed");
    expect(html).toContain("Signs by Quadrant (ASTC)");
    expect(html).toContain("SOH-CAH-TOA");
    expect(html).toContain("Common Misconception");
    expect(html).toContain('aria-label="Opposite"');
    expect(html).toContain('aria-label="Hypotenuse"');
  });

  it("renders lesson 260 as a dedicated linked exact-value surface", () => {
    const lesson = lessonCatalog.find((item) => item.id === 260)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0317"');
    expect(html).toContain('data-dedicated-lesson="260"');
    expect(html).toContain(
      'data-object-model="snapped-special-angle-linked-circle-triangle-exact-value-model"',
    );
    expect(html).toContain('data-angle="60"');
    expect(html).toContain('data-sin="√3/2"');
    expect(html).toContain('data-cos="1/2"');
    expect(html).toContain('data-tan="√3"');
    expect(html).toContain('data-testid="exact-unit-circle-handle"');
    expect(html).toContain('aria-label="Special angle"');
    expect(html).toContain("Exact trig values (derived from the model)");
    expect(html).toContain("Quick Reference: Special Angles");
    expect(html).toContain('aria-label="sin 45 degrees"');
  });

  it("renders lesson 261 as a dedicated linked sine-function workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 261)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0318"');
    expect(html).toContain('data-dedicated-lesson="261"');
    expect(html).toContain(
      'data-object-model="linked-unit-circle-transformable-sine-function-model"',
    );
    expect(html).toContain('data-amplitude="1.000"');
    expect(html).toContain('data-period="6.283185"');
    expect(html).toContain('data-testid="sine-unit-circle-handle"');
    expect(html).toContain('data-testid="sine-main-graph-handle"');
    expect(html).toContain('aria-label="Amplitude A"');
    expect(html).toContain('aria-label="Period factor B"');
    expect(html).toContain("Everything is in sync");
    expect(html).toContain("Practice Challenge");
    expect(html).toContain('aria-label="Practice C"');
  });

  it("renders lesson 262 as a dedicated horizontal-projection cosine workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 262)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0319"');
    expect(html).toContain('data-dedicated-lesson="262"');
    expect(html).toContain(
      'data-object-model="horizontal-unit-circle-projection-transformable-cosine-function-model"',
    );
    expect(html).toContain('data-current-x="0.500000"');
    expect(html).toContain('data-amplitude="1.000"');
    expect(html).toContain('data-period="6.283185"');
    expect(html).toContain('data-testid="cosine-unit-circle-handle"');
    expect(html).toContain('data-testid="cosine-main-graph-handle"');
    expect(html).toContain('aria-label="Amplitude (A)"');
    expect(html).toContain('aria-label="Cosine angle"');
    expect(html).toContain("Cosine is NOT sine");
    expect(html).toContain("Which equation matches the graph?");
  });

  it("renders lesson 263 as a dedicated asymptote-aware tangent workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 263)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0320"');
    expect(html).toContain('data-dedicated-lesson="263"');
    expect(html).toContain(
      'data-object-model="unit-circle-tangent-line-discontinuous-branch-asymptote-model"',
    );
    expect(html).toContain('data-tan="1.732051"');
    expect(html).toContain('data-defined="true"');
    expect(html).toContain('data-testid="tangent-unit-circle-handle"');
    expect(html).toContain('data-testid="tangent-graph-handle"');
    expect(html).toContain('aria-label="Tangent angle"');
    expect(html).toContain("UNIT CIRCLE TANGENT CONSTRUCTION");
    expect(html).toContain("Asymptotes");
    expect(html).toContain('aria-label="Tangent answer 4"');
    expect(html).toContain("MISCONCEPTION WARNING");
  });

  it("renders lesson 264 as a dedicated linked reciprocal-trig workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 264)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0321"');
    expect(html).toContain('data-dedicated-lesson="264"');
    expect(html).toContain(
      'data-object-model="linked-base-reciprocal-trig-branch-domain-asymptote-model"',
    );
    expect(html).toContain('data-function="sec"');
    expect(html).toContain('data-base-value="0.866025"');
    expect(html).toContain('data-reciprocal-value="1.154701"');
    expect(html).toContain('data-defined="true"');
    expect(html).toContain('data-testid="reciprocal-base-handle"');
    expect(html).toContain('data-testid="reciprocal-function-handle"');
    expect(html).toContain('aria-label="Reciprocal angle"');
    expect(html).toContain('aria-label="Graph view window"');
    expect(html).toContain('aria-label="Secant answer d"');
    expect(html).toContain("Reciprocal Trig Functions – Linked Graphs");
    expect(html).toContain("RULES AT A GLANCE");
    expect(html).toContain("MISCONCEPTION CHECK");
  });

  it("renders lesson 265 as a dedicated restricted-branch inverse-trig workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 265)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0322"');
    expect(html).toContain('data-dedicated-lesson="265"');
    expect(html).toContain(
      'data-object-model="restricted-branch-reflection-principal-inverse-trigonometry-model"',
    );
    expect(html).toContain('data-function="asin"');
    expect(html).toContain('data-angle="45.000000"');
    expect(html).toContain('data-input-value="0.707107"');
    expect(html).toContain('data-inverse-value="45.000000"');
    expect(html).toContain('data-testid="inverse-input-handle"');
    expect(html).toContain('data-testid="inverse-output-handle"');
    expect(html).toContain('data-testid="inverse-practice-handle"');
    expect(html).toContain('aria-label="Restricted branch angle"');
    expect(html).toContain('aria-label="Inverse output angle"');
    expect(html).toContain('aria-label="Practice inverse answer"');
    expect(html).toContain("Restricted branches reflected across");
    expect(html).toContain("PRINCIPAL RANGES");
    expect(html).toContain("COMMON MISCONCEPTION");
    expect(html).toContain("QUICK PRACTICE CHALLENGE");
  });

  it("renders lesson 266 as a dedicated symbolic and numerical identity workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 266)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0323"');
    expect(html).toContain('data-dedicated-lesson="266"');
    expect(html).toContain(
      'data-object-model="unit-circle-symbolic-transformation-numerical-identity-verification-model"',
    );
    expect(html).toContain('data-angle="60.000000"');
    expect(html).toContain('data-sin="0.866025"');
    expect(html).toContain('data-cos="0.500000"');
    expect(html).toContain('data-lhs="1.732051"');
    expect(html).toContain('data-rhs="1.732051"');
    expect(html).toContain('data-defined="true"');
    expect(html).toContain('data-testid="identity-circle-handle"');
    expect(html).toContain('aria-label="Identity angle"');
    expect(html).toContain('aria-label="Automatic verification"');
    expect(html).toContain('aria-label="Identity practice answer"');
    expect(html).toContain("Justified Identity Transformation");
    expect(html).toContain("Numerical Verification");
    expect(html).toContain("Common Misconception");
    expect(html).toContain("Practice Challenge");
  });

  it("renders lesson 267 as a dedicated dual-rotation compound-angle workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 267)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0324"');
    expect(html).toContain('data-dedicated-lesson="267"');
    expect(html).toContain(
      'data-object-model="dual-unit-circle-rotation-sum-difference-projection-formula-model"',
    );
    expect(html).toContain('data-alpha="40.000000"');
    expect(html).toContain('data-beta="75.000000"');
    expect(html).toContain('data-sum="115.000000"');
    expect(html).toContain('data-difference="-35.000000"');
    expect(html).toContain('data-cos-sum="-0.422618"');
    expect(html).toContain('data-sin-sum="0.906308"');
    expect(html).toContain('data-testid="compound-alpha-handle"');
    expect(html).toContain('data-testid="compound-beta-handle"');
    expect(html).toContain('aria-label="Alpha angle"');
    expect(html).toContain('aria-label="Beta angle"');
    expect(html).toContain("Explore on the unit circle");
    expect(html).toContain("Sum Identities");
    expect(html).toContain("Common Misconception");
    expect(html).toContain("Quick Practice");
  });

  it("renders lesson 268 as a dedicated linked double- and half-angle workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 268)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0325"');
    expect(html).toContain('data-dedicated-lesson="268"');
    expect(html).toContain(
      'data-object-model="linked-theta-double-half-unit-circle-sign-aware-identity-model"',
    );
    expect(html).toContain('data-theta="45.000000"');
    expect(html).toContain('data-double-angle="90.000000"');
    expect(html).toContain('data-half-angle="22.500000"');
    expect(html).toContain('data-double-direct="1.000000"');
    expect(html).toContain('data-double-expanded="1.000000"');
    expect(html).toContain('data-half-sign="+"');
    expect(html).toContain('data-testid="double-half-theta-handle"');
    expect(html).toContain('data-testid="double-half-double-handle"');
    expect(html).toContain('data-testid="double-half-half-handle"');
    expect(html).toContain('aria-label="Theta angle"');
    expect(html).toContain("Linked angles on the unit circle");
    expect(html).toContain("Half-angle domain &amp; sign");
    expect(html).toContain("Common Misconception");
    expect(html).toContain("Practice Challenge");
  });

  it("renders lesson 269 as a dedicated periodic trig-equation solver", () => {
    const lesson = lessonCatalog.find((item) => item.id === 269)!;
    const html = renderToStaticMarkup(
      <TrigonometryLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="trigonometry-mockup-0326"');
    expect(html).toContain('data-dedicated-lesson="269"');
    expect(html).toContain(
      'data-object-model="cosine-horizontal-level-periodic-interval-intersection-solution-family-model"',
    );
    expect(html).toContain('data-k="0.500000"');
    expect(html).toContain('data-interval-min="-6.283185"');
    expect(html).toContain('data-interval-max="6.283185"');
    expect(html).toContain('data-solution-count="4"');
    expect(html).toContain('data-testid="trig-equation-level-handle"');
    expect(html).toContain('data-testid="trig-equation-intersection"');
    expect(html).toContain('aria-label="Interval minimum"');
    expect(html).toContain('aria-label="Interval maximum"');
    expect(html).toContain('aria-label="Trig equation solutions"');
    expect(html).toContain("How inputs connect to outputs");
    expect(html).toContain("Common Pitfall");
    expect(html).toContain("Practice Challenge");
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
