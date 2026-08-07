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
        <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Coordinate rule");
    }
  });

  it("renders dynamic geometry lessons 198 through 212 with construction-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      198: "Free point",
      199: "Point on object",
      200: "Intersection point",
      201: "Midpoint or centre",
      202: "Attach or detach",
      203: "Line through two points",
      204: "Segment",
      205: "Fixed length segment",
      206: "Ray",
      207: "Polyline",
      208: "Perpendicular line",
      209: "Parallel line",
      210: "Perpendicular bisector",
      211: "Angle bisector",
      212: "Tangent",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Coordinate rule");
    }
  });

  it("renders dynamic geometry lessons 213 through 215 with construction-specific guidance", () => {
    const expectedSnippets: Record<number, string> = {
      213: "Best-fit line",
      214: "Triangle constructor",
      215: "Regular polygon",
    };

    for (const [idText, snippet] of Object.entries(expectedSnippets)) {
      const id = Number(idText);
      const lesson = lessonCatalog.find((item) => item.id === id)!;
      const html = renderToStaticMarkup(
        <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Coordinate rule");
    }
  });

  it("renders geometry lessons 216 through 245 with construction and transformation guidance", () => {
    const expectedSnippets: Record<number, string> = {
      216: "Rigid polygon",
      217: "General polygon",
      218: "Centre and point circle",
      219: "Centre and radius circle",
      220: "Circle through three points",
      221: "Compass",
      222: "Semicircle",
      223: "Circular arc",
      224: "Circumcircular arc",
      225: "Circular sector",
      226: "Conic through five points",
      227: "Ellipse",
      228: "Hyperbola",
      229: "Parabola",
      230: "Distance or length",
      231: "Area",
      232: "Angle",
      233: "Fixed angle",
      234: "Relation checker",
      235: "Construction steps",
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
        <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
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
        <Geometry2DLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain(lesson.title);
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Coordinate rule");
    }
  });
});
