import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import Geometry3DLessonAdapter from "./Geometry3DLessonAdapter";

describe("Geometry3DLessonAdapter", () => {
  it("renders 3D lessons 378 through 427 with lesson-specific guidance", () => {
    const expected = new Map([
      [378, "3D Coordinate System"],
      [379, "3D Points"],
      [380, "Distance in 3D"],
      [381, "Lines in 3D"],
      [382, "Planes"],
      [383, "Parallel and Perpendicular Planes"],
      [384, "Line–Plane Intersection"],
      [385, "Plane–Plane Intersection"],
      [386, "Angle Between Lines"],
      [387, "Angle Between Planes"],
      [388, "Angle Between Line and Plane"],
      [389, "Point-to-Plane Distance"],
      [390, "3D Vectors"],
      [391, "Cube"],
      [392, "Cuboid"],
      [393, "Prism"],
      [394, "Pyramid"],
      [395, "Tetrahedron"],
      [396, "Regular polyhedra"],
      [397, "Cylinder"],
      [398, "Cone"],
      [399, "Sphere"],
      [400, "Hemisphere"],
      [401, "Frustum"],
      [402, "Surface of revolution"],
      [403, "Extrusion"],
      [405, "Cross-sections"],
      [406, "Volume"],
      [407, "Surface area"],
      [408, "Euler's polyhedron formula"],
      [409, "Transparent / X-Ray Mode"],
      [410, "Camera controls"],
      [411, "Orthographic views"],
      [412, "AR placement"],
      [413, "Surface z=f(x,y)"],
      [414, "Implicit surfaces"],
      [415, "Parametric surfaces"],
      [416, "Space curves"],
      [417, "Quadric surfaces"],
      [418, "Cylindrical coordinates"],
      [419, "Spherical coordinates"],
      [420, "Contour curves"],
      [421, "Level surfaces"],
      [422, "Partial derivatives"],
      [423, "Gradient vector"],
      [424, "Tangent plane"],
      [425, "Normal vector"],
      [426, "Double integrals"],
      [427, "Multivariable optimisation"],
    ]);

    for (const [lessonId, snippet] of expected) {
      const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
      const html = renderToStaticMarkup(
        <Geometry3DLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );

      expect(html, String(lessonId)).toContain(
        lesson.title.replace(/'/g, "&#x27;"),
      );
      expect(html, String(lessonId)).toContain(snippet.replace(/'/g, "&#x27;"));
      if (
        ![
          378, 379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391,
          392,
        ].includes(lessonId) &&
        lesson.preset.id !== "geometry3d.solid-net"
      ) {
        expect(html, String(lessonId)).toContain(
          'data-direct-interaction="true"',
        );
        expect(html, String(lessonId)).toContain(
          /contour|gradient|tangent plane|partial derivative|multivariable|level curve|level surface|z=f\(x,y\)|implicit surface|parametric surface|space curve|quadric|cylindrical coordinates|spherical coordinates|normal vector/i.test(
            lesson.title,
          )
            ? "Drag surface"
            : "Drag solid",
        );
      }
      if (lessonId === 395) {
        expect(html, String(lessonId)).toContain(
          "tetrahedron spatial solid workspace",
        );
        expect(html, String(lessonId)).toContain("V = Bh / 3");
      }
      expect(html, String(lessonId)).not.toContain("3D geometry");
    }
  });

  it("uses a dedicated Three.js coordinate-system model for lesson 378", () => {
    const lesson = lessonCatalog.find((item) => item.id === 378)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0563"');
    expect(html).toContain(
      "threejs-draggable-ordered-triple-spatial-axes-projection-planes-step-path-distance-orbit",
    );
    expect(html).toContain('data-point="[3,2,4]"');
    expect(html).toContain('data-distance="5.39"');
    expect(html).toContain('data-planes="true"');
    expect(html).toContain('data-path="true"');
    expect(html).toContain('data-labels="true"');
  });

  it("uses a dedicated multi-point Three.js model for lesson 379", () => {
    const lesson = lessonCatalog.find((item) => item.id === 379)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );

    expect(html).toContain('data-testid="geometry3d-mockup-0564"');
    expect(html).toContain(
      "threejs-multi-point-selector-draggable-selected-point-add-snap-labels-drop-lines-shadow-step-path-table-height-octant-challenge",
    );
    expect(html).toContain('data-points="[[2,1,3],[-2,3,1],[3,-1,2]]"');
    expect(html).toContain('data-selected="A"');
    expect(html).toContain('data-highest="A"');
    expect(html).toContain('data-labels="true"');
    expect(html).toContain('data-drops="true"');
    expect(html).toContain('data-shadow="true"');
    expect(html).toContain('data-path="true"');
  });

  it("uses a dedicated two-point distance model for lesson 380", () => {
    const lesson = lessonCatalog.find((item) => item.id === 380)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0565"');
    expect(html).toContain(
      "threejs-two-draggable-points-component-differences-distance-segment-rectangular-box-orbit-live-formula",
    );
    expect(html).toContain('data-a="[1,2,1]"');
    expect(html).toContain('data-b="[4,6,3]"');
    expect(html).toContain('data-delta="[3,4,2]"');
    expect(html).toContain('data-squared="29"');
    expect(html).toContain('data-distance="5.39"');
    expect(html).toContain('data-components="true"');
    expect(html).toContain('data-segment="true"');
    expect(html).toContain('data-box="true"');
  });

  it("uses a dedicated parametric-line model for lesson 381", () => {
    const lesson = lessonCatalog.find((item) => item.id === 381)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0566"');
    expect(html).toContain(
      "threejs-parametric-line-anchor-direction-vector-live-t-sample-points-direction-step-equations-orbit-challenge",
    );
    expect(html).toContain('data-anchor="[1,2,1]"');
    expect(html).toContain('data-vector="[2,1,3]"');
    expect(html).toContain('data-t="1"');
    expect(html).toContain('data-selected="[3,3,4]"');
    expect(html).toContain('data-minus="[-1,1,-2]"');
  });

  it("uses a dedicated plane-equation model for lesson 382", () => {
    const lesson = lessonCatalog.find((item) => item.id === 382)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0567"');
    expect(html).toContain(
      "threejs-plane-equation-coefficients-intercepts-normal-vector-test-point-orbit-live-substitution-graded-normal-challenge",
    );
    expect(html).toContain('data-coefficients="[2,3,1,6]"');
    expect(html).toContain('data-intercepts="[[3,0,0],[0,2,0],[0,0,6]]"');
    expect(html).toContain('data-normal="[2,3,1]"');
    expect(html).toContain('data-test-value="6"');
    expect(html).toContain('data-passes="true"');
  });

  it("uses a dedicated two-plane relationship model for lesson 383", () => {
    const lesson = lessonCatalog.find((item) => item.id === 383)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0568"');
    expect(html).toContain(
      "threejs-two-editable-planes-normal-relation-cross-dot-scalar-multiple-separation-classification-orbit-challenge",
    );
    expect(html).toContain('data-plane-a="[1,2,2,6]"');
    expect(html).toContain('data-plane-b="[2,4,4,10]"');
    expect(html).toContain('data-dot="18"');
    expect(html).toContain('data-relation="Parallel"');
    expect(html).toContain('data-separation="0.33"');
    expect(html).toContain('data-scalar="2"');
  });

  it("uses a dedicated line-plane solver for lesson 384", () => {
    const lesson = lessonCatalog.find((item) => item.id === 384)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0569"');
    expect(html).toContain(
      "threejs-editable-parametric-line-plane-equation-exact-intersection-solver-single-parallel-contained-orbit-graded-challenge",
    );
    expect(html).toContain('data-point="[1,1,1]"');
    expect(html).toContain('data-vector="[1,2,0]"');
    expect(html).toContain('data-plane="[1,1,1,6]"');
    expect(html).toContain('data-numerator="3"');
    expect(html).toContain('data-denominator="3"');
    expect(html).toContain('data-status="single intersection"');
    expect(html).toContain('data-t="1"');
    expect(html).toContain('data-intersection="[2,3,1]"');
  });

  it("uses a dedicated plane-plane intersection solver for lesson 385", () => {
    const lesson = lessonCatalog.find((item) => item.id === 385)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0570"');
    expect(html).toContain(
      "threejs-two-editable-plane-equations-cross-product-intersection-line-parallel-coincident-solver-layers-orbit-graded-challenge",
    );
    expect(html).toContain('data-plane-a="[1,1,1,6]"');
    expect(html).toContain('data-plane-b="[1,-1,1,2]"');
    expect(html).toContain('data-normal-a="[1,1,1]"');
    expect(html).toContain('data-normal-b="[1,-1,1]"');
    expect(html).toContain('data-cross="[2,0,-2]"');
    expect(html).toContain('data-direction="[1,0,-1]"');
    expect(html).toContain('data-point="[4,2,0]"');
    expect(html).toContain('data-status="Intersecting line"');
  });

  it("uses a dedicated angle-between-lines solver for lesson 386", () => {
    const lesson = lessonCatalog.find((item) => item.id === 386)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0571"');
    expect(html).toContain(
      "threejs-two-directly-draggable-direction-vectors-dot-magnitude-cosine-acute-obtuse-angle-arc-translated-line-orbit-live-challenges",
    );
    expect(html).toContain('data-u="[1,0,0]"');
    expect(html).toContain('data-v="[1,1,0]"');
    expect(html).toContain('data-dot="1"');
    expect(html).toContain('data-magnitude-u="1"');
    expect(html).toContain('data-magnitude-v="1.4142"');
    expect(html).toContain('data-cosine="0.7071"');
    expect(html).toContain('data-angle="45"');
    expect(html).toContain('data-mode="Acute"');
  });

  it("uses a dedicated angle-between-planes solver for lesson 387", () => {
    const lesson = lessonCatalog.find((item) => item.id === 387)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0572"');
    expect(html).toContain(
      "threejs-two-planes-editable-directly-draggable-normals-dihedral-angle-dot-magnitudes-hinge-line-wedge-acute-obtuse-orbit-graded-challenge",
    );
    expect(html).toContain('data-normal-a="[0,0,1]"');
    expect(html).toContain('data-normal-b="[0,1,1]"');
    expect(html).toContain('data-dot="1"');
    expect(html).toContain('data-magnitude-a="1"');
    expect(html).toContain('data-magnitude-b="1.4142"');
    expect(html).toContain('data-cosine="0.7071"');
    expect(html).toContain('data-angle="45"');
    expect(html).toContain('data-hinge="[-1,0,0]"');
  });

  it("uses a dedicated angle-between-line-and-plane solver for lesson 388", () => {
    const lesson = lessonCatalog.find((item) => item.id === 388)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0573"');
    expect(html).toContain(
      "threejs-editable-directly-draggable-line-direction-and-plane-normal-projection-line-plane-angle-arcsin-complementary-normal-angle-coordinate-plane-selector-orbit-experiment",
    );
    expect(html).toContain('data-vector="[1,1,1]"');
    expect(html).toContain('data-normal="[0,0,1]"');
    expect(html).toContain('data-plane="z = 0"');
    expect(html).toContain('data-dot="1"');
    expect(html).toContain('data-magnitude-v="1.7321"');
    expect(html).toContain('data-magnitude-n="1"');
    expect(html).toContain('data-sine="0.5774"');
    expect(html).toContain('data-angle="35.3"');
    expect(html).toContain('data-normal-angle="54.7"');
    expect(html).toContain('data-projection="[1,1,0]"');
  });

  it("uses a dedicated point-to-plane distance solver for lesson 389", () => {
    const lesson = lessonCatalog.find((item) => item.id === 389)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0574"');
    expect(html).toContain(
      "threejs-editable-directly-draggable-point-and-plane-equation-exact-point-plane-distance-perpendicular-foot-normal-layers-orbit-validated-experiment",
    );
    expect(html).toContain('data-point="[4,4,4]"');
    expect(html).toContain('data-plane="[1,1,1,6]"');
    expect(html).toContain('data-numerator="6"');
    expect(html).toContain('data-denominator="1.73"');
    expect(html).toContain('data-distance="3.46"');
    expect(html).toContain('data-factor="2"');
    expect(html).toContain('data-foot="[2,2,2]"');
  });

  it("uses a dedicated 3D vector operations model for lesson 390", () => {
    const lesson = lessonCatalog.find((item) => item.id === 390)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0575"');
    expect(html).toContain(
      "threejs-dedicated-directly-draggable-two-vector-add-dot-cross-exact-magnitudes-angle-steppers-modes-axes-orbit-validated-practice",
    );
    expect(html).toContain('data-a="[3,2,1]"');
    expect(html).toContain('data-b="[1,-1,2]"');
    expect(html).toContain('data-sum="[4,1,3]"');
    expect(html).toContain('data-dot="3"');
    expect(html).toContain('data-cross="[5,-5,-5]"');
    expect(html).toContain('data-magnitude-a="3.74"');
    expect(html).toContain('data-magnitude-b="2.45"');
    expect(html).toContain('data-angle="70.89"');
  });

  it("uses a dedicated parametric cube model for lesson 391", () => {
    const lesson = lessonCatalog.find((item) => item.id === 391)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0576"');
    expect(html).toContain(
      "threejs-dedicated-parametric-cube-side-slider-solid-net-face-space-diagonals-orbit-highlight-exact-volume-surface-euler-validated-experiment",
    );
    expect(html).toContain('data-side="4"');
    expect(html).toContain('data-volume="64"');
    expect(html).toContain('data-surface="96"');
    expect(html).toContain('data-face-diagonal="5.66"');
    expect(html).toContain('data-space-diagonal="6.93"');
    expect(html).toContain('data-layers="[true,true]"');
    expect(html).toContain("Vertices: 8");
    expect(html).toContain("Edges: 12");
    expect(html).toContain("Faces: 6");
  });

  it("uses a dedicated parametric cuboid model for lesson 392", () => {
    const lesson = lessonCatalog.find((item) => item.id === 392)!;
    const html = renderToStaticMarkup(
      <Geometry3DLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="geometry3d-mockup-0577"');
    expect(html).toContain(
      "threejs-dedicated-parametric-cuboid-six-dimension-steppers-face-space-diagonals-six-face-net-orbit-exact-volume-surface-base-practice",
    );
    expect(html).toContain('data-dimensions="[5,3,2]"');
    expect(html).toContain('data-volume="30"');
    expect(html).toContain('data-surface="62"');
    expect(html).toContain('data-base="15"');
    expect(html).toContain('data-face-diagonal="5.83"');
    expect(html).toContain('data-space-diagonal="6.16"');
    expect(html).toContain('data-layers="[true,true,false]"');
  });
});
