import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import Geometry3DLessonAdapter from "./Geometry3DLessonAdapter";

describe("Geometry3DLessonAdapter", () => {
  it("renders 3D lessons 378 through 427 with lesson-specific guidance", () => {
    const expected = new Map([
      [378, "3D Coordinate System"],
      [379, "3D points"],
      [380, "Distance in 3D"],
      [381, "Lines in 3D"],
      [382, "Planes"],
      [383, "Parallel and perpendicular planes"],
      [384, "Line-plane intersection"],
      [385, "Plane-plane intersection"],
      [386, "Angle between lines"],
      [387, "Angle between planes"],
      [388, "Angle between line and plane"],
      [389, "Point-to-plane distance"],
      [390, "3D vectors"],
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
      if (lessonId !== 378 && lesson.preset.id !== "geometry3d.solid-net") {
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
});
