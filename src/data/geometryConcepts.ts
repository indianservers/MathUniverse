export type GeometryVisualType =
  | "line"
  | "angle"
  | "parallel"
  | "triangle"
  | "pythagoras"
  | "similarity"
  | "quadrilateral"
  | "polygon"
  | "circle"
  | "arc"
  | "tangent"
  | "coordinate"
  | "transform"
  | "symmetry"
  | "area"
  | "solid"
  | "construction"
  | "locus"
  | "trig";

export type GeometryConcept = {
  id: string;
  title: string;
  category: string;
  summary: string;
  formula: string;
  visual: GeometryVisualType;
  sliderA: string;
  sliderB: string;
  minA: number;
  maxA: number;
  stepA: number;
  minB: number;
  maxB: number;
  stepB: number;
  defaultA: number;
  defaultB: number;
  use: string;
  tasks: string[];
};

export const geometryConcepts: GeometryConcept[] = [
  { id: "points-lines-rays", title: "Points, Lines, and Rays", category: "Foundations", summary: "Build geometric figures from points, finite segments, infinite lines, and one-direction rays.", formula: "distance = sqrt((x2-x1)^2 + (y2-y1)^2)", visual: "line", sliderA: "Point B x", sliderB: "Point B y", minA: 180, maxA: 540, stepA: 5, minB: 80, maxB: 340, stepB: 5, defaultA: 470, defaultB: 170, use: "Maps, CAD sketches, paths, vectors, and construction diagrams.", tasks: ["Move point B horizontally.", "Move point B vertically.", "Watch length and slope change."] },
  { id: "angles", title: "Angles and Rotation", category: "Foundations", summary: "Angles measure turn between two rays and connect directly to circular motion.", formula: "arc length = r theta", visual: "angle", sliderA: "Angle theta", sliderB: "Radius r", minA: 0, maxA: 180, stepA: 1, minB: 40, maxB: 150, stepB: 5, defaultA: 55, defaultB: 105, use: "Navigation, hinges, robotics joints, steering, and optics.", tasks: ["Make an acute angle.", "Make an obtuse angle.", "Double radius and compare arc length."] },
  { id: "parallel-lines", title: "Parallel Lines and Transversals", category: "Foundations", summary: "When a transversal cuts parallel lines, corresponding and alternate angles match.", formula: "corresponding angles are equal", visual: "parallel", sliderA: "Transversal angle", sliderB: "Line gap", minA: 25, maxA: 150, stepA: 1, minB: 70, maxB: 190, stepB: 5, defaultA: 62, defaultB: 120, use: "Road lanes, ladders, structural grids, and proof writing.", tasks: ["Rotate the transversal.", "Increase the gap.", "Find equal angle pairs."] },
  { id: "triangles", title: "Triangle Basics", category: "Triangles", summary: "A triangle's area is half the rectangle with the same base and height.", formula: "A = 1/2 bh, A + B + C = 180 deg", visual: "triangle", sliderA: "Base b", sliderB: "Height h", minA: 120, maxA: 420, stepA: 5, minB: 80, maxB: 280, stepB: 5, defaultA: 320, defaultB: 180, use: "Roofs, trusses, mesh models, surveying, and stability.", tasks: ["Increase the base.", "Increase the height.", "Compare triangle area with its enclosing rectangle."] },
  { id: "pythagorean-theorem", title: "Pythagorean Theorem", category: "Triangles", summary: "In a right triangle, the square on the hypotenuse equals the sum of the other two squares.", formula: "a^2 + b^2 = c^2", visual: "pythagoras", sliderA: "Side a", sliderB: "Side b", minA: 60, maxA: 220, stepA: 5, minB: 60, maxB: 220, stepB: 5, defaultA: 150, defaultB: 110, use: "Distance, construction, screen coordinates, and navigation.", tasks: ["Make a 3-4-5 style triangle.", "Compare square areas.", "Watch c change dynamically."] },
  { id: "triangle-congruence", title: "Triangle Congruence", category: "Triangles", summary: "Congruent triangles have the same size and shape even after moving or rotating.", formula: "SSS, SAS, ASA, RHS prove congruence", visual: "triangle", sliderA: "Side scale", sliderB: "Rotation hint", minA: 120, maxA: 380, stepA: 5, minB: 40, maxB: 220, stepB: 5, defaultA: 260, defaultB: 130, use: "Proofs, structural matching, quality control, and rigid designs.", tasks: ["Change the side scale.", "Compare matching sides.", "Look for equal angles."] },
  { id: "similar-triangles", title: "Similar Triangles", category: "Triangles", summary: "Similar triangles keep equal angles while corresponding sides stay proportional.", formula: "a1/a2 = b1/b2 = c1/c2", visual: "similarity", sliderA: "Scale factor", sliderB: "Base", minA: 0.5, maxA: 2.2, stepA: 0.05, minB: 120, maxB: 300, stepB: 5, defaultA: 1.45, defaultB: 200, use: "Shadow measurement, maps, camera projection, and blueprints.", tasks: ["Change the scale factor.", "Keep angle shape constant.", "Compare corresponding sides."] },
  { id: "quadrilaterals", title: "Quadrilaterals", category: "Polygons", summary: "Four-sided shapes include squares, rectangles, parallelograms, rhombi, kites, and trapeziums.", formula: "A parallelogram = base * height", visual: "quadrilateral", sliderA: "Base", sliderB: "Slant", minA: 150, maxA: 390, stepA: 5, minB: -100, maxB: 120, stepB: 5, defaultA: 280, defaultB: 70, use: "Tiles, screens, frames, bridges, and force diagrams.", tasks: ["Make a rectangle.", "Slant into a parallelogram.", "Watch height stay perpendicular."] },
  { id: "polygons", title: "Regular Polygons", category: "Polygons", summary: "Regular polygons split into equal center triangles, making perimeter and area easier.", formula: "P = ns, A = n s^2 / (4 tan(pi/n))", visual: "polygon", sliderA: "Sides n", sliderB: "Radius", minA: 3, maxA: 12, stepA: 1, minB: 70, maxB: 160, stepB: 5, defaultA: 6, defaultB: 120, use: "Tiling, icons, bolts, game meshes, and architecture.", tasks: ["Change side count.", "Compare triangle slices.", "Increase radius and area."] },
  { id: "circles", title: "Circles", category: "Circles", summary: "A circle is all points at a fixed radius from a center.", formula: "C = 2 pi r, A = pi r^2", visual: "circle", sliderA: "Radius r", sliderB: "Sector angle", minA: 50, maxA: 165, stepA: 5, minB: 30, maxB: 330, stepB: 5, defaultA: 110, defaultB: 95, use: "Wheels, clocks, gears, lenses, and circular motion.", tasks: ["Increase radius.", "Compare diameter and radius.", "Watch circumference grow."] },
  { id: "arcs-sectors", title: "Arcs and Sectors", category: "Circles", summary: "A sector is a fraction of a circle, controlled by its central angle.", formula: "sector area = theta/360 * pi r^2", visual: "arc", sliderA: "Radius r", sliderB: "Angle theta", minA: 60, maxA: 160, stepA: 5, minB: 20, maxB: 340, stepB: 5, defaultA: 120, defaultB: 110, use: "Pie charts, clock angles, circular tracks, and radars.", tasks: ["Make a quarter sector.", "Make a semicircle.", "Relate theta to area fraction."] },
  { id: "chords-secants", title: "Chords and Secants", category: "Circles", summary: "Chords connect two points on a circle; secants extend through the circle.", formula: "intersecting chords: AE * EB = CE * ED", visual: "circle", sliderA: "Radius r", sliderB: "Chord offset", minA: 70, maxA: 160, stepA: 5, minB: -100, maxB: 100, stepB: 5, defaultA: 120, defaultB: 45, use: "Lens geometry, circle proofs, and mechanical linkages.", tasks: ["Move the chord from center.", "Compare chord length.", "Find the diameter chord."] },
  { id: "tangents", title: "Tangents", category: "Circles", summary: "A tangent touches a circle at one point and is perpendicular to the radius there.", formula: "radius perpendicular tangent", visual: "tangent", sliderA: "Contact angle", sliderB: "Radius r", minA: 0, maxA: 360, stepA: 2, minB: 70, maxB: 155, stepB: 5, defaultA: 35, defaultB: 115, use: "Wheels, cams, gears, normals, and optics.", tasks: ["Move the contact point.", "Check the 90 deg angle.", "Increase radius."] },
  { id: "coordinate-geometry", title: "Coordinate Geometry", category: "Analytic Geometry", summary: "Coordinates turn shapes into algebra using distance, midpoint, and slope.", formula: "m = (y2-y1)/(x2-x1)", visual: "coordinate", sliderA: "x2", sliderB: "y2", minA: -5, maxA: 5, stepA: 0.5, minB: -5, maxB: 5, stepB: 0.5, defaultA: 4, defaultB: 3, use: "Graphs, CAD, game worlds, GPS, and data visualization.", tasks: ["Move point B.", "Read slope.", "Compare distance to Pythagoras."] },
  { id: "transformations", title: "Transformations", category: "Transformations", summary: "Translation, rotation, reflection, and dilation move shapes while preserving or scaling structure.", formula: "(x, y) -> (kx, ky) for dilation", visual: "transform", sliderA: "Rotation", sliderB: "Scale", minA: -180, maxA: 180, stepA: 5, minB: 0.5, maxB: 1.8, stepB: 0.05, defaultA: 35, defaultB: 1.2, use: "Animation, design tools, maps, and computer graphics.", tasks: ["Rotate the triangle.", "Dilate the image.", "Compare original and transformed shape."] },
  { id: "symmetry", title: "Symmetry", category: "Transformations", summary: "Symmetry means a shape matches itself after reflection or rotation.", formula: "reflection across y-axis: (x,y) -> (-x,y)", visual: "symmetry", sliderA: "Point x", sliderB: "Point y", minA: 40, maxA: 180, stepA: 5, minB: 60, maxB: 230, stepB: 5, defaultA: 120, defaultB: 120, use: "Art, architecture, molecules, logos, and pattern design.", tasks: ["Move the point.", "Find its mirror.", "Trace symmetry pairs."] },
  { id: "area-perimeter", title: "Area and Perimeter", category: "Measurement", summary: "Perimeter measures the boundary, while area measures covered surface.", formula: "rectangle A = lb, P = 2(l+b)", visual: "area", sliderA: "Length l", sliderB: "Breadth b", minA: 100, maxA: 380, stepA: 5, minB: 70, maxB: 240, stepB: 5, defaultA: 280, defaultB: 150, use: "Floor plans, fencing, packaging, and screens.", tasks: ["Double length.", "Double breadth.", "Compare perimeter and area growth."] },
  { id: "mensuration-3d", title: "3D Mensuration", category: "Solids", summary: "3D geometry measures volume and surface area of solids.", formula: "cuboid V = lbh", visual: "solid", sliderA: "Base size", sliderB: "Height", minA: 80, maxA: 210, stepA: 5, minB: 70, maxB: 220, stepB: 5, defaultA: 145, defaultB: 150, use: "Containers, buildings, tanks, and manufacturing.", tasks: ["Increase base.", "Increase height.", "Watch volume multiply."] },
  { id: "surface-area-volume", title: "Surface Area and Volume", category: "Solids", summary: "Surface area covers the outside, while volume fills the inside.", formula: "cylinder V = pi r^2 h, SA = 2 pi r(r+h)", visual: "solid", sliderA: "Radius r", sliderB: "Height h", minA: 70, maxA: 170, stepA: 5, minB: 80, maxB: 240, stepB: 5, defaultA: 115, defaultB: 180, use: "Cans, pipes, silos, capsules, and tanks.", tasks: ["Change radius.", "Change height.", "Notice radius affects volume quadratically."] },
  { id: "geometric-constructions", title: "Geometric Constructions", category: "Construction", summary: "Compass and straightedge construction creates exact geometry from circles and lines.", formula: "perpendicular bisector: equal-radius arcs intersect", visual: "construction", sliderA: "Point gap", sliderB: "Arc radius", minA: 120, maxA: 330, stepA: 5, minB: 100, maxB: 240, stepB: 5, defaultA: 250, defaultB: 170, use: "Technical drawing, proofs, architecture, and design foundations.", tasks: ["Increase point gap.", "Set arcs to intersect.", "Trace the perpendicular bisector."] },
  { id: "loci", title: "Loci", category: "Construction", summary: "A locus is the path of all points satisfying a rule.", formula: "points at fixed distance r from center form a circle", visual: "locus", sliderA: "Radius r", sliderB: "Moving angle", minA: 60, maxA: 160, stepA: 5, minB: 0, maxB: 360, stepB: 2, defaultA: 110, defaultB: 45, use: "Robot reach, GPS constraints, wave fronts, and mechanism paths.", tasks: ["Move the point around.", "Increase the fixed distance.", "Observe the full path."] },
  { id: "trig-in-geometry", title: "Trigonometry in Geometry", category: "Analytic Geometry", summary: "Sine, cosine, and tangent convert angles into side ratios.", formula: "tan(theta) = opposite / adjacent", visual: "trig", sliderA: "Angle theta", sliderB: "Adjacent side", minA: 10, maxA: 75, stepA: 1, minB: 100, maxB: 310, stepB: 5, defaultA: 35, defaultB: 220, use: "Heights, ramps, surveying, shadows, and navigation.", tasks: ["Increase angle.", "Increase adjacent side.", "Read opposite side from tangent."] },
];

export function getGeometryConcept(id: string | undefined) {
  return geometryConcepts.find((concept) => concept.id === id);
}
