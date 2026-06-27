import { visualProofCategories } from "./visualProofCategories";
import type { ProofLearningModel, VisualProof, VisualProofComponentKey, VisualProofDifficulty } from "./proofTypes";

type GeometryProofSeed = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  difficulty: VisualProofDifficulty;
  tags: string[];
  estimatedTime: string;
  prerequisites: string[];
  learningOutcomes: string[];
  componentKey: VisualProofComponentKey;
};

type AlgebraProofSeed = GeometryProofSeed;
type TrigonometryProofSeed = GeometryProofSeed;
type CoordinateProofSeed = GeometryProofSeed;
type CalculusProofSeed = GeometryProofSeed;
type NumberTheoryProofSeed = GeometryProofSeed;
type ProbabilityProofSeed = GeometryProofSeed;
type StatisticsProofSeed = GeometryProofSeed;
type MatrixLinearAlgebraProofSeed = GeometryProofSeed;
type VectorProofSeed = GeometryProofSeed;
type ComplexNumberProofSeed = GeometryProofSeed;
type MensurationProofSeed = GeometryProofSeed;
type ConicSectionProofSeed = GeometryProofSeed;
type InequalityProofSeed = GeometryProofSeed;
type LogarithmExponentProofSeed = GeometryProofSeed;
type TransformationSymmetryProofSeed = GeometryProofSeed;
type EngineeringMathematicsProofSeed = GeometryProofSeed;
type SequenceSeriesProofSeed = GeometryProofSeed;

const geometryProofs: GeometryProofSeed[] = [
  {
    id: "pythagorean-area-rearrangement",
    title: "Pythagorean Theorem by Area Rearrangement",
    slug: "pythagorean-theorem-area-rearrangement",
    shortDescription: "Rearrange four equal right triangles to see why a^2 + b^2 = c^2.",
    longDescription: "Use the same four right triangles inside a square of side a + b. One arrangement leaves c^2; another leaves a^2 and b^2.",
    difficulty: "Intermediate",
    tags: ["right triangle", "area", "square", "pythagorean theorem", "rearrangement"],
    estimatedTime: "10 minutes",
    prerequisites: ["Right triangle", "Square area", "Triangle area"],
    learningOutcomes: ["Explain a^2 + b^2 = c^2 visually", "Compare equal leftover areas", "Connect side length to square area"],
    componentKey: "PythagoreanAreaRearrangementProof",
  },
  {
    id: "triangle-area-half-rectangle",
    title: "Area of Triangle as Half of a Rectangle",
    slug: "triangle-area-half-rectangle",
    shortDescription: "Duplicate any triangle with base b and height h to complete a rectangle.",
    longDescription: "Show that two equal triangles fill a rectangle of area b x h, so one triangle has area 1/2 x b x h.",
    difficulty: "Beginner",
    tags: ["triangle", "area", "rectangle", "altitude", "base"],
    estimatedTime: "7 minutes",
    prerequisites: ["Rectangle area", "Base", "Height"],
    learningOutcomes: ["Derive triangle area", "See why oblique triangles work", "Connect base and perpendicular height"],
    componentKey: "TriangleAreaHalfRectangleProof",
  },
  {
    id: "triangle-angle-sum",
    title: "Angle Sum of a Triangle",
    slug: "triangle-angle-sum",
    shortDescription: "Move the three triangle angles onto a straight line to make 180 degrees.",
    longDescription: "Highlight angles A, B, and C, then place copies of their arcs along a straight angle.",
    difficulty: "Beginner",
    tags: ["triangle", "angles", "180 degrees", "parallel line", "angle sum"],
    estimatedTime: "8 minutes",
    prerequisites: ["Angles", "Straight line", "Triangle"],
    learningOutcomes: ["Show A + B + C = 180 degrees", "Use angle arcs as movable copies", "Understand the parallel-line proof idea"],
    componentKey: "TriangleAngleSumProof",
  },
  {
    id: "exterior-angle-theorem",
    title: "Exterior Angle Theorem",
    slug: "exterior-angle-theorem",
    shortDescription: "Copy the two remote interior angles to fill the exterior angle.",
    longDescription: "Extend one side of a triangle and compare the exterior angle with the two non-adjacent interior angles.",
    difficulty: "Intermediate",
    tags: ["triangle", "exterior angle", "remote angles", "angle theorem"],
    estimatedTime: "8 minutes",
    prerequisites: ["Triangle angle sum", "Supplementary angles"],
    learningOutcomes: ["Relate exterior and remote interior angles", "Use supplementary angles", "Derive exterior angle = A + B"],
    componentKey: "ExteriorAngleTheoremProof",
  },
  {
    id: "similar-triangles-proportional-sides",
    title: "Similar Triangles and Proportional Sides",
    slug: "similar-triangles-proportional-sides",
    shortDescription: "Scale a triangle and watch corresponding side ratios stay constant.",
    longDescription: "Compare a triangle with a scaled copy. Equal angles preserve shape, and side lengths grow by the same factor.",
    difficulty: "Intermediate",
    tags: ["similar triangles", "ratio", "scale factor", "proportion", "angles"],
    estimatedTime: "9 minutes",
    prerequisites: ["Ratio", "Scale factor", "Triangle angles"],
    learningOutcomes: ["Identify corresponding sides", "Calculate a common scale factor", "Explain proportional side lengths"],
    componentKey: "SimilarTrianglesProof",
  },
  {
    id: "circle-circumference-unwrapping",
    title: "Circle Circumference by Rolling/Unwrapping",
    slug: "circle-circumference-unwrapping",
    shortDescription: "Roll a circle one full turn and compare the travel distance with its unwrapped boundary.",
    longDescription: "A circle that rolls exactly once travels one circumference. Unwrapping the boundary gives the same straight length, 2 pi r.",
    difficulty: "Beginner",
    tags: ["circle", "circumference", "radius", "diameter", "rolling"],
    estimatedTime: "8 minutes",
    prerequisites: ["Circle", "Radius", "Diameter"],
    learningOutcomes: ["Connect one rotation to one circumference", "Derive C = 2 pi r", "Compare diameter and circumference"],
    componentKey: "CircleCircumferenceUnwrappingProof",
  },
  {
    id: "sector-area-formula",
    title: "Sector Area Formula",
    slug: "sector-area-formula",
    shortDescription: "Grow a sector and see its area as the same fraction of the full circle.",
    longDescription: "A sector with angle theta occupies theta/360 of the circle, so its area is theta/360 x pi r^2.",
    difficulty: "Intermediate",
    tags: ["circle", "sector", "area", "angle", "radians"],
    estimatedTime: "9 minutes",
    prerequisites: ["Circle area", "Central angle", "Fractions"],
    learningOutcomes: ["Use angle fraction to find sector area", "Compare degree and radian formulas", "Connect arc length and area"],
    componentKey: "SectorAreaFormulaProof",
  },
  {
    id: "parallelogram-area-shearing",
    title: "Area of Parallelogram by Shearing",
    slug: "parallelogram-area-shearing",
    shortDescription: "Move the side triangle of a parallelogram to form an equal-area rectangle.",
    longDescription: "Cut the slanted triangle from one side and translate it to the other side. The base and height stay unchanged.",
    difficulty: "Beginner",
    tags: ["parallelogram", "area", "base", "height", "shearing"],
    estimatedTime: "7 minutes",
    prerequisites: ["Rectangle area", "Perpendicular height"],
    learningOutcomes: ["Derive parallelogram area", "Distinguish side length from height", "Explain area preservation by translation"],
    componentKey: "ParallelogramAreaShearingProof",
  },
  {
    id: "trapezoid-area-duplication",
    title: "Area of Trapezoid / Trapezium by Duplication",
    slug: "trapezoid-area-duplication",
    shortDescription: "Duplicate and rotate a trapezoid to form a parallelogram with base a + b.",
    longDescription: "Two congruent trapezoids make a parallelogram of base a + b and height h, so one trapezoid has half that area.",
    difficulty: "Intermediate",
    tags: ["trapezoid", "trapezium", "area", "parallel sides", "duplication"],
    estimatedTime: "8 minutes",
    prerequisites: ["Parallelogram area", "Parallel sides", "Height"],
    learningOutcomes: ["Derive 1/2(a + b)h", "Relate trapezoid and parallelogram area", "Use both trapezoid and trapezium naming"],
    componentKey: "TrapezoidAreaDuplicationProof",
  },
  {
    id: "polygon-interior-angle-sum",
    title: "Sum of Interior Angles of a Polygon",
    slug: "polygon-interior-angle-sum",
    shortDescription: "Triangulate an n-sided polygon to count n - 2 triangles.",
    longDescription: "Draw diagonals from one vertex of a polygon. The polygon splits into n - 2 triangles, each contributing 180 degrees.",
    difficulty: "Intermediate",
    tags: ["polygon", "angles", "triangulation", "interior angle sum"],
    estimatedTime: "9 minutes",
    prerequisites: ["Triangle angle sum", "Polygon", "Diagonals"],
    learningOutcomes: ["Count triangles in a polygon", "Derive (n - 2) x 180 degrees", "Test dynamic examples for n = 3 to 12"],
    componentKey: "PolygonInteriorAngleSumProof",
  },
  {
    id: "area-circle-unrolling",
    title: "Area of Circle by Unrolling Circumference",
    slug: "area-of-circle-by-unrolling",
    shortDescription: "Discover why the area of a circle is pi r^2 by unrolling its circumference into a triangle-like shape.",
    longDescription:
      "Split a circle into many narrow sectors, unroll the curved boundary, and watch the pieces approach a triangle/parallelogram model whose base is the circumference and whose height is the radius.",
    difficulty: "Beginner",
    tags: ["circle", "area", "pi", "radius", "circumference", "visual proof"],
    estimatedTime: "8 minutes",
    prerequisites: ["Circle", "Radius", "Circumference", "Triangle Area"],
    learningOutcomes: ["Understand why circle area is pi r^2", "Connect circumference 2 pi r with area", "Visualize a circle as many small sectors", "Understand limiting approximation"],
    componentKey: "CircleAreaUnrollingProof",
  },
  {
    id: "circle-to-triangle-uncurling",
    title: "Circle to Triangle Uncurling",
    slug: "circle-to-triangle",
    shortDescription: "Uncurl a filled circle into stacked straight lines that form a triangle with matching area.",
    longDescription:
      "Fill the circle with concentric circumference lines, keep every midpoint fixed, and uncurl each line into a straight segment so the final stack forms the circle area triangle.",
    difficulty: "Beginner",
    tags: ["circle", "triangle", "area", "circumference", "uncurling", "visual proof"],
    estimatedTime: "8 minutes",
    prerequisites: ["Circle", "Circumference", "Radius", "Triangle Area"],
    learningOutcomes: ["See the circle area transform into a triangle", "Compare base 2 pi r with height r", "Track area equality during the animation"],
    componentKey: "CircleAreaUnrollingProof",
  },
];

const algebraProofs: AlgebraProofSeed[] = [
  {
    id: "square-of-sum",
    title: "Square of a Sum: (a + b)^2",
    slug: "square-of-sum",
    shortDescription: "See why (a + b)^2 equals a^2 + 2ab + b^2 using a square split into four regions.",
    longDescription: "An interactive area model decomposes a square of side a + b into a^2, ab, ab, and b^2.",
    difficulty: "Beginner",
    tags: ["algebra", "identity", "area model", "expansion", "binomial", "perfect square"],
    estimatedTime: "6 minutes",
    prerequisites: ["Area of rectangle", "Area of square", "Basic algebraic notation"],
    learningOutcomes: ["Understand the geometric meaning of (a + b)^2", "Connect symbolic expansion with area decomposition", "Recognize why the middle term is 2ab"],
    componentKey: "SquareOfSumProof",
  },
  {
    id: "square-of-difference",
    title: "Square of a Difference: (a - b)^2",
    slug: "square-of-difference",
    shortDescription: "Remove strips from an a by a square and add back the overlapped b^2 corner.",
    longDescription: "A subtractive square model shows why (a - b)^2 = a^2 - 2ab + b^2.",
    difficulty: "Beginner",
    tags: ["algebra", "identity", "area model", "subtraction", "perfect square"],
    estimatedTime: "7 minutes",
    prerequisites: ["Square area", "Rectangle area", "Subtraction"],
    learningOutcomes: ["Visualize removed strips", "Explain the b^2 correction", "Derive a^2 - 2ab + b^2"],
    componentKey: "SquareOfDifferenceProof",
  },
  {
    id: "difference-of-squares",
    title: "Difference of Squares: a^2 - b^2",
    slug: "difference-of-squares",
    shortDescription: "Rearrange the L-shape left by removing b^2 from a^2 into a rectangle.",
    longDescription: "The remaining area after removing a b^2 square from an a^2 square becomes a rectangle of sides a - b and a + b.",
    difficulty: "Beginner",
    tags: ["algebra", "identity", "factorization", "area model", "difference of squares"],
    estimatedTime: "7 minutes",
    prerequisites: ["Square area", "Rectangle area", "Factoring"],
    learningOutcomes: ["Connect subtraction of squares to a rectangle", "Explain a^2 - b^2 = (a - b)(a + b)", "Use rearrangement to factor"],
    componentKey: "DifferenceOfSquaresProof",
  },
  {
    id: "product-of-binomials",
    title: "Product of Binomials: (x + a)(x + b)",
    slug: "product-of-binomials",
    shortDescription: "Split a rectangle into x^2, ax, bx, and ab to expand binomials.",
    longDescription: "A rectangle with side lengths x + a and x + b gives x^2 + ax + bx + ab.",
    difficulty: "Beginner",
    tags: ["algebra", "binomial", "area model", "expansion", "factorization"],
    estimatedTime: "8 minutes",
    prerequisites: ["Rectangle area", "Variables", "Like terms"],
    learningOutcomes: ["Expand a product of binomials", "Combine ax and bx", "Read factors from rectangle dimensions"],
    componentKey: "ProductOfBinomialsProof",
  },
  {
    id: "distributive-law-area-model",
    title: "Distributive Law Area Model: (a + b)(c + d)",
    slug: "distributive-law-area-model",
    shortDescription: "Use a 2 by 2 rectangle grid to see ac + ad + bc + bd.",
    longDescription: "The area of a rectangle with side lengths a + b and c + d splits into four product regions.",
    difficulty: "Beginner",
    tags: ["algebra", "distributive law", "area model", "rectangle", "expansion"],
    estimatedTime: "7 minutes",
    prerequisites: ["Rectangle area", "Multiplication", "Variables"],
    learningOutcomes: ["Connect distribution to area", "Track four product terms", "Expand two sums visually"],
    componentKey: "DistributiveLawAreaModelProof",
  },
  {
    id: "three-term-square",
    title: "Three-Term Square: (a + b + c)^2",
    slug: "three-term-square",
    shortDescription: "Split a square into a 3 by 3 grid and group symmetric product pairs.",
    longDescription: "Rows and columns a, b, c create nine regions that combine into a^2 + b^2 + c^2 + 2ab + 2bc + 2ca.",
    difficulty: "Intermediate",
    tags: ["algebra", "identity", "area model", "expansion", "three terms"],
    estimatedTime: "9 minutes",
    prerequisites: ["Square of a sum", "Area model", "Combining like terms"],
    learningOutcomes: ["Expand a three-term square", "Pair symmetric regions", "Explain why cross terms double"],
    componentKey: "ThreeTermSquareProof",
  },
  {
    id: "completing-the-square",
    title: "Completing the Square",
    slug: "completing-the-square",
    shortDescription: "Split bx into two rectangles and add the missing (b/2)^2 corner.",
    longDescription: "Build x^2 + bx into a complete square by adding the missing corner square.",
    difficulty: "Intermediate",
    tags: ["algebra", "completing the square", "quadratic", "area model", "perfect square"],
    estimatedTime: "10 minutes",
    prerequisites: ["Quadratics", "Square area", "Half of a coefficient"],
    learningOutcomes: ["Explain the missing corner", "Derive x^2 + bx + (b/2)^2", "Connect geometry to quadratic transformations"],
    componentKey: "CompletingTheSquareProof",
  },
  {
    id: "quadratic-factorization-area-model",
    title: "Factorization of x^2 + px + q",
    slug: "quadratic-factorization-area-model",
    shortDescription: "Choose m and n so p = m + n and q = mn, then build (x + m)(x + n).",
    longDescription: "An algebra-tile rectangle connects x^2 + (m+n)x + mn to (x + m)(x + n).",
    difficulty: "Intermediate",
    tags: ["algebra", "factorization", "quadratic", "area model", "tiles"],
    estimatedTime: "10 minutes",
    prerequisites: ["Quadratic expressions", "Factors", "Product of binomials"],
    learningOutcomes: ["Find p and q from m and n", "Build a factor rectangle", "Read factored form from dimensions"],
    componentKey: "QuadraticFactorizationAreaModelProof",
  },
  {
    id: "perfect-square-trinomial-recognition",
    title: "Perfect Square Trinomial Recognition",
    slug: "perfect-square-trinomial-recognition",
    shortDescription: "Check whether x^2 +/- 2ax + a^2 forms a complete square.",
    longDescription: "A checklist and area model show how first term, last term, and middle term identify perfect square trinomials.",
    difficulty: "Beginner",
    tags: ["algebra", "perfect square", "trinomial", "recognition", "factorization"],
    estimatedTime: "8 minutes",
    prerequisites: ["Square of a sum", "Square roots", "Middle term"],
    learningOutcomes: ["Recognize perfect square trinomials", "Compare plus and minus identities", "Use the twice-product rule"],
    componentKey: "PerfectSquareTrinomialRecognitionProof",
  },
  {
    id: "cube-of-sum",
    title: "Cube of a Sum: (a + b)^3",
    slug: "cube-of-sum",
    shortDescription: "Use an isometric SVG volume model to decompose (a + b)^3.",
    longDescription: "A browser-only isometric block model shows a^3, three a^2b blocks, three ab^2 blocks, and b^3.",
    difficulty: "Intermediate",
    tags: ["algebra", "cube", "volume model", "identity", "expansion"],
    estimatedTime: "11 minutes",
    prerequisites: ["Volume of cuboid", "Square of a sum", "Combining like terms"],
    learningOutcomes: ["Read cube expansion as volume", "Group repeated volume blocks", "Explain coefficients 1, 3, 3, 1"],
    componentKey: "CubeOfSumProof",
  },
  {
    id: "cube-of-difference",
    title: "Cube of a Difference: (a - b)^3",
    slug: "cube-of-difference",
    shortDescription: "Use subtractive volume blocks to see alternating signs in (a - b)^3.",
    longDescription: "Start with a^3, remove slabs, correct overlaps, and identify the final cube of side a - b.",
    difficulty: "Intermediate",
    tags: ["algebra", "cube", "subtraction", "volume model", "identity"],
    estimatedTime: "11 minutes",
    prerequisites: ["Cube of a sum", "Volume", "Subtractive area models"],
    learningOutcomes: ["Explain alternating signs", "Visualize overlap corrections", "Derive a^3 - 3a^2b + 3ab^2 - b^3"],
    componentKey: "CubeOfDifferenceProof",
  },
  {
    id: "sum-and-difference-product",
    title: "Sum and Difference Product: (a + b)(a - b)",
    slug: "sum-and-difference-product",
    shortDescription: "Rearrange a rectangle of sides a + b and a - b into a^2 - b^2.",
    longDescription: "A rectangle product model connects directly to the difference-of-squares L-shape.",
    difficulty: "Beginner",
    tags: ["algebra", "difference of squares", "factorization", "rectangle", "area model"],
    estimatedTime: "7 minutes",
    prerequisites: ["Difference of squares", "Rectangle area", "Factoring"],
    learningOutcomes: ["Connect product and difference forms", "Rearrange area without changing it", "Explain (a + b)(a - b) = a^2 - b^2"],
    componentKey: "SumAndDifferenceProductProof",
  },
];

const trigonometryProofs: TrigonometryProofSeed[] = [
  {
    id: "right-triangle-trig-ratios",
    title: "Sine, Cosine, and Tangent from a Right Triangle",
    slug: "right-triangle-trig-ratios",
    shortDescription: "Adjust a right triangle and see sine, cosine, and tangent as side ratios.",
    longDescription: "A browser-only right-triangle model highlights opposite, adjacent, and hypotenuse sides for an acute angle theta.",
    difficulty: "Beginner",
    tags: ["trigonometry", "right triangle", "sine", "cosine", "tangent", "ratios"],
    estimatedTime: "7 minutes",
    prerequisites: ["Right triangles", "Ratio", "Angle measurement"],
    learningOutcomes: ["Define sine, cosine, and tangent from side ratios", "See why similar triangles preserve trig ratios", "Connect angle size to side proportions"],
    componentKey: "RightTriangleTrigRatiosProof",
  },
  {
    id: "unit-circle-sine-cosine",
    title: "Sine and Cosine on the Unit Circle",
    slug: "unit-circle-sine-cosine",
    shortDescription: "See sine and cosine as the y and x coordinates of a point moving around the unit circle.",
    longDescription: "An interactive unit-circle proof showing how cos theta is the horizontal projection and sin theta is the vertical projection.",
    difficulty: "Beginner",
    tags: ["trigonometry", "unit circle", "sine", "cosine", "angle", "coordinates"],
    estimatedTime: "7 minutes",
    prerequisites: ["Coordinate plane", "Circle", "Right triangle", "Basic angle measurement"],
    learningOutcomes: ["Understand sine and cosine as unit-circle coordinates", "Connect right-triangle ratios with the unit circle", "Visualize positive and negative trigonometric values by quadrant"],
    componentKey: "UnitCircleSineCosineProof",
  },
  {
    id: "pythagorean-trig-identity",
    title: "Pythagorean Identity: sin^2 theta + cos^2 theta = 1",
    slug: "pythagorean-trig-identity",
    shortDescription: "Use the unit-circle projection triangle to prove sin^2 theta + cos^2 theta = 1.",
    longDescription: "The radius of the unit circle is the hypotenuse of a right triangle with legs cos theta and sin theta.",
    difficulty: "Beginner",
    tags: ["trigonometry", "unit circle", "identity", "pythagorean theorem", "sine", "cosine"],
    estimatedTime: "8 minutes",
    prerequisites: ["Pythagorean theorem", "Unit circle", "Sine and cosine"],
    learningOutcomes: ["Derive the identity from a projection triangle", "Check the identity numerically", "Explain why the result stays 1 for every angle"],
    componentKey: "PythagoreanTrigIdentityProof",
  },
  {
    id: "tangent-ratio-identity",
    title: "Tangent Identity: tan theta = sin theta / cos theta",
    slug: "tangent-ratio-identity",
    shortDescription: "Compare opposite over adjacent in the unit-circle triangle to derive tangent.",
    longDescription: "The projection triangle has opposite side sin theta and adjacent side cos theta, so tan theta is their quotient.",
    difficulty: "Beginner",
    tags: ["trigonometry", "tangent", "identity", "unit circle", "ratio", "undefined"],
    estimatedTime: "8 minutes",
    prerequisites: ["Tangent ratio", "Sine", "Cosine", "Division"],
    learningOutcomes: ["Derive tan theta = sin theta / cos theta", "Interpret tangent as rise over run", "Handle undefined tangent values near cos theta = 0"],
    componentKey: "TangentRatioIdentityProof",
  },
  {
    id: "radians-arc-radius",
    title: "Radians as Arc Length over Radius",
    slug: "radians-arc-radius",
    shortDescription: "See radians as the number of radius lengths that fit along an arc.",
    longDescription: "A circle model compares radius r with arc length s to show theta = s / r.",
    difficulty: "Beginner",
    tags: ["trigonometry", "radians", "arc", "radius", "unit circle", "angle"],
    estimatedTime: "7 minutes",
    prerequisites: ["Circle", "Radius", "Arc length"],
    learningOutcomes: ["Define radian measure visually", "Explain theta = s / r", "Recognize that unit-circle arc length equals radians"],
    componentKey: "RadiansArcRadiusProof",
  },
  {
    id: "arc-length-formula",
    title: "Arc Length Formula: s = r theta",
    slug: "arc-length-formula",
    shortDescription: "Rearrange the radian definition to show why arc length is radius times angle.",
    longDescription: "Adjust radius and angle in radians and watch the highlighted arc grow proportionally with both.",
    difficulty: "Beginner",
    tags: ["trigonometry", "radians", "arc length", "circle", "formula"],
    estimatedTime: "7 minutes",
    prerequisites: ["Radians", "Radius", "Algebraic rearrangement"],
    learningOutcomes: ["Derive s = r theta", "Use theta in radians", "Connect full angle 2pi to circumference"],
    componentKey: "ArcLengthFormulaProof",
  },
  {
    id: "trig-graphs-from-unit-circle",
    title: "Trigonometric Graphs from the Unit Circle",
    slug: "trig-graphs-from-unit-circle",
    shortDescription: "Trace sine and cosine waves from a point rotating around the unit circle.",
    longDescription: "The y-coordinate becomes the sine graph and the x-coordinate becomes the cosine graph over one full turn.",
    difficulty: "Intermediate",
    tags: ["trigonometry", "unit circle", "graph", "sine graph", "cosine graph", "period"],
    estimatedTime: "10 minutes",
    prerequisites: ["Unit circle", "Coordinate graph", "Sine and cosine"],
    learningOutcomes: ["Generate sine and cosine from circular motion", "Identify amplitude and period", "Connect key graph points to circle positions"],
    componentKey: "TrigGraphsFromUnitCircleProof",
  },
  {
    id: "cosine-angle-addition",
    title: "Angle Addition Formula for Cosine",
    slug: "cosine-angle-addition",
    shortDescription: "Use rotation and x-projection to derive cos(alpha + beta).",
    longDescription: "A unit vector at alpha rotated by beta gives an x-coordinate of cos alpha cos beta - sin alpha sin beta.",
    difficulty: "Advanced",
    tags: ["trigonometry", "identity", "angle addition", "cosine", "rotation", "unit circle"],
    estimatedTime: "11 minutes",
    prerequisites: ["Unit vectors", "Sine and cosine", "Coordinate rotation"],
    learningOutcomes: ["Visualize alpha plus beta as a rotation", "Read the final x-coordinate", "Derive the cosine addition identity"],
    componentKey: "CosineAngleAdditionProof",
  },
  {
    id: "sine-angle-addition",
    title: "Angle Addition Formula for Sine",
    slug: "sine-angle-addition",
    shortDescription: "Use rotation and y-projection to derive sin(alpha + beta).",
    longDescription: "A rotated unit vector gives a y-coordinate of sin alpha cos beta + cos alpha sin beta.",
    difficulty: "Advanced",
    tags: ["trigonometry", "identity", "angle addition", "sine", "rotation", "unit circle"],
    estimatedTime: "11 minutes",
    prerequisites: ["Unit vectors", "Sine and cosine", "Coordinate rotation"],
    learningOutcomes: ["Visualize the sine of a combined angle", "Read the final y-coordinate", "Derive the sine addition identity"],
    componentKey: "SineAngleAdditionProof",
  },
  {
    id: "double-angle-identities",
    title: "Double Angle Identities",
    slug: "double-angle-identities",
    shortDescription: "Duplicate theta on the unit circle and substitute alpha = beta = theta.",
    longDescription: "Sine and cosine double-angle identities follow directly from angle-addition formulas.",
    difficulty: "Intermediate",
    tags: ["trigonometry", "identity", "double angle", "sine", "cosine", "unit circle"],
    estimatedTime: "10 minutes",
    prerequisites: ["Angle addition formulas", "Pythagorean identity"],
    learningOutcomes: ["Derive sin 2theta", "Derive cos 2theta", "Explain equivalent cosine double-angle forms"],
    componentKey: "DoubleAngleIdentitiesProof",
  },
  {
    id: "sine-rule-proof",
    title: "Sine Rule / Law of Sines",
    slug: "sine-rule-proof",
    shortDescription: "Use a circumcircle to show a/sin A = b/sin B = c/sin C = 2R.",
    longDescription: "Sides of a triangle are chords of its circumcircle, and each chord has length 2R times the sine of the opposite angle.",
    difficulty: "Advanced",
    tags: ["trigonometry", "triangle law", "sine rule", "circumcircle", "chord", "geometry"],
    estimatedTime: "11 minutes",
    prerequisites: ["Triangle angles", "Circumcircle", "Sine"],
    learningOutcomes: ["Connect triangle sides to circumcircle chords", "Derive a = 2R sin A", "Explain the shared ratio 2R"],
    componentKey: "SineRuleProof",
  },
  {
    id: "cosine-rule-proof",
    title: "Cosine Rule / Law of Cosines",
    slug: "cosine-rule-proof",
    shortDescription: "Resolve one side into projections and apply Pythagoras to derive c^2 = a^2 + b^2 - 2ab cos C.",
    longDescription: "A coordinate projection proof shows how the included angle changes the third side length.",
    difficulty: "Advanced",
    tags: ["trigonometry", "triangle law", "cosine rule", "projection", "pythagorean theorem"],
    estimatedTime: "11 minutes",
    prerequisites: ["Pythagorean theorem", "Projection", "Cosine"],
    learningOutcomes: ["Resolve a side into components", "Derive the cosine rule", "See the right-angle special case"],
    componentKey: "CosineRuleProof",
  },
  {
    id: "complementary-angle-identities",
    title: "Complementary Angle Identities",
    slug: "complementary-angle-identities",
    shortDescription: "Use the two acute angles of a right triangle to compare sine and cosine.",
    longDescription: "The side opposite theta is adjacent to 90 degrees minus theta, giving cofunction identities.",
    difficulty: "Beginner",
    tags: ["trigonometry", "right triangle", "complementary angles", "cofunction", "sine", "cosine"],
    estimatedTime: "7 minutes",
    prerequisites: ["Right triangles", "Complementary angles", "Trig ratios"],
    learningOutcomes: ["Show sin theta = cos(90 - theta)", "Show cos theta = sin(90 - theta)", "Match ratios to shared sides"],
    componentKey: "ComplementaryAngleIdentitiesProof",
  },
  {
    id: "triangle-area-sine-formula",
    title: "Area of a Triangle Using Sine: A = 1/2 ab sin C",
    slug: "triangle-area-sine-formula",
    shortDescription: "Drop an altitude to show the height is b sin C.",
    longDescription: "A triangle with sides a and b around angle C has height b sin C, so area equals one half ab sin C.",
    difficulty: "Intermediate",
    tags: ["trigonometry", "triangle area", "sine", "altitude", "geometry"],
    estimatedTime: "8 minutes",
    prerequisites: ["Triangle area", "Sine ratio", "Altitude"],
    learningOutcomes: ["Express height as b sin C", "Substitute into triangle area", "Use the included-angle area formula"],
    componentKey: "TriangleAreaSineFormulaProof",
  },
  {
    id: "small-angle-approximation",
    title: "Small Angle Approximation: sin theta is approximately theta",
    slug: "small-angle-approximation",
    shortDescription: "Compare sin theta, arc length theta, and tan theta near zero radians.",
    longDescription: "On the unit circle, sin theta < theta < tan theta for small positive theta, and the three lengths nearly coincide.",
    difficulty: "Intermediate",
    tags: ["trigonometry", "small angle", "approximation", "radians", "sine", "tangent"],
    estimatedTime: "9 minutes",
    prerequisites: ["Radians", "Unit circle", "Sine and tangent"],
    learningOutcomes: ["Compare sin theta, theta, and tan theta", "Explain why radians are required", "Estimate the approximation error"],
    componentKey: "SmallAngleApproximationProof",
  },
];

const coordinateProofs: CoordinateProofSeed[] = [
  {
    id: "distance-formula",
    title: "Distance Formula",
    slug: "distance-formula",
    shortDescription: "See how the distance between two points comes from the Pythagorean theorem.",
    longDescription: "An interactive coordinate grid proof showing how horizontal and vertical differences form a right triangle whose hypotenuse is the distance between two points.",
    difficulty: "Beginner",
    tags: ["coordinate geometry", "distance", "pythagorean theorem", "points", "grid"],
    estimatedTime: "6 minutes",
    prerequisites: ["Coordinate plane", "Right triangle", "Pythagorean theorem"],
    learningOutcomes: ["Understand why the distance formula uses squared coordinate differences", "Connect coordinate geometry with the Pythagorean theorem", "Calculate distance dynamically from two plotted points"],
    componentKey: "DistanceFormulaProof",
  },
  {
    id: "midpoint-formula",
    title: "Midpoint Formula",
    slug: "midpoint-formula",
    shortDescription: "Locate the halfway point by averaging x-coordinates and y-coordinates separately.",
    longDescription: "Move two endpoints on a grid and watch the midpoint remain halfway in both horizontal and vertical directions.",
    difficulty: "Beginner",
    tags: ["coordinate geometry", "midpoint", "average", "segment", "grid"],
    estimatedTime: "6 minutes",
    prerequisites: ["Coordinate plane", "Averages", "Line segment"],
    learningOutcomes: ["Derive the midpoint formula", "Interpret coordinate averages visually", "Locate midpoint dynamically"],
    componentKey: "MidpointFormulaProof",
  },
  {
    id: "section-formula",
    title: "Section Formula / Internal Division Formula",
    slug: "section-formula",
    shortDescription: "Move a point along a segment by changing the ratio AP:PB.",
    longDescription: "A weighted-average construction shows how a point dividing AB internally in ratio m:n gets its coordinates.",
    difficulty: "Intermediate",
    tags: ["coordinate geometry", "section formula", "ratio", "weighted average", "segment"],
    estimatedTime: "8 minutes",
    prerequisites: ["Coordinate plane", "Ratios", "Weighted averages"],
    learningOutcomes: ["Explain internal division", "Use weighted coordinate averages", "Connect ratio size to point location"],
    componentKey: "SectionFormulaProof",
  },
  {
    id: "slope-formula",
    title: "Slope Formula",
    slug: "slope-formula",
    shortDescription: "Build the slope formula from rise over run on a coordinate grid.",
    longDescription: "A slope triangle makes rise y2-y1 and run x2-x1 visible for any two points.",
    difficulty: "Beginner",
    tags: ["coordinate geometry", "slope", "rise", "run", "line"],
    estimatedTime: "7 minutes",
    prerequisites: ["Coordinate plane", "Fractions", "Line segment"],
    learningOutcomes: ["Derive slope as rise/run", "Identify positive, negative, zero, and undefined slopes", "Calculate slope dynamically"],
    componentKey: "SlopeFormulaProof",
  },
  {
    id: "slope-intercept-line-equation",
    title: "Equation of a Line: y = mx + c",
    slug: "slope-intercept-line-equation",
    shortDescription: "See how slope and y-intercept generate a line.",
    longDescription: "The intercept anchors the line on the y-axis while slope creates another point by rise over run.",
    difficulty: "Beginner",
    tags: ["coordinate geometry", "line equation", "slope", "intercept", "graph"],
    estimatedTime: "7 minutes",
    prerequisites: ["Slope", "Coordinate plane", "Linear equations"],
    learningOutcomes: ["Interpret m as slope", "Interpret c as y-intercept", "Draw y = mx + c from geometry"],
    componentKey: "SlopeInterceptLineEquationProof",
  },
  {
    id: "point-slope-line-equation",
    title: "Point-Slope Form of a Line",
    slug: "point-slope-line-equation",
    shortDescription: "Use a fixed point and constant slope to derive y - y1 = m(x - x1).",
    longDescription: "A moving point on the same line keeps the same rise/run from the fixed point.",
    difficulty: "Intermediate",
    tags: ["coordinate geometry", "point-slope", "line equation", "slope", "rise run"],
    estimatedTime: "8 minutes",
    prerequisites: ["Slope formula", "Linear equations", "Coordinate plane"],
    learningOutcomes: ["Derive point-slope form", "Relate moving points to constant slope", "Convert rise/run into equation form"],
    componentKey: "PointSlopeLineEquationProof",
  },
  {
    id: "parallel-lines-slope",
    title: "Parallel Lines Have Equal Slopes",
    slug: "parallel-lines-slope",
    shortDescription: "Compare two lines and see equal rise/run triangles when slopes match.",
    longDescription: "Two non-vertical lines with equal slopes keep the same tilt and never meet.",
    difficulty: "Beginner",
    tags: ["coordinate geometry", "parallel lines", "slope", "line equation"],
    estimatedTime: "7 minutes",
    prerequisites: ["Slope", "Line equations", "Parallel lines"],
    learningOutcomes: ["Recognize equal slopes", "Connect equal rise/run to parallel lines", "Compare line equations"],
    componentKey: "ParallelLinesSlopeProof",
  },
  {
    id: "perpendicular-lines-slope",
    title: "Perpendicular Lines Have Slopes with Product -1",
    slug: "perpendicular-lines-slope",
    shortDescription: "Rotate slope triangles to see why perpendicular slopes are negative reciprocals.",
    longDescription: "A 90-degree rotation swaps rise and run and changes sign, giving m1 x m2 = -1.",
    difficulty: "Intermediate",
    tags: ["coordinate geometry", "perpendicular lines", "slope", "negative reciprocal"],
    estimatedTime: "8 minutes",
    prerequisites: ["Slope", "Right angles", "Reciprocals"],
    learningOutcomes: ["Derive m2 = -1/m1", "Explain the product -1 rule", "Handle horizontal and vertical special cases"],
    componentKey: "PerpendicularLinesSlopeProof",
  },
  {
    id: "triangle-area-coordinates",
    title: "Area of Triangle Using Coordinates",
    slug: "triangle-area-coordinates",
    shortDescription: "Use the shoelace/determinant pattern to compute triangle area from coordinates.",
    longDescription: "A coordinate triangle and table show positive and negative diagonal products whose half-difference gives area.",
    difficulty: "Intermediate",
    tags: ["coordinate geometry", "triangle area", "shoelace", "determinant", "area"],
    estimatedTime: "9 minutes",
    prerequisites: ["Coordinate plane", "Triangle area", "Determinants"],
    learningOutcomes: ["Use the coordinate area formula", "Interpret signed area", "Connect shoelace pattern to geometry"],
    componentKey: "TriangleAreaCoordinatesProof",
  },
  {
    id: "circle-equation",
    title: "Equation of a Circle",
    slug: "circle-equation",
    shortDescription: "Derive (x-h)^2 + (y-k)^2 = r^2 from the distance formula.",
    longDescription: "A center, point on the circle, and radius triangle show every circle point is distance r from the center.",
    difficulty: "Beginner",
    tags: ["coordinate geometry", "circle", "distance formula", "radius", "equation"],
    estimatedTime: "8 minutes",
    prerequisites: ["Distance formula", "Circle", "Coordinate plane"],
    learningOutcomes: ["Derive circle equation", "Interpret center and radius", "Connect circle points to fixed distance"],
    componentKey: "CircleEquationProof",
  },
  {
    id: "translation-of-points",
    title: "Translation of Points",
    slug: "translation-of-points",
    shortDescription: "Move points by adding the same vector to every coordinate.",
    longDescription: "A vector arrow shows how P(x,y) becomes P'(x+a,y+b) without rotation or resizing.",
    difficulty: "Beginner",
    tags: ["coordinate geometry", "translation", "transformation", "vector", "points"],
    estimatedTime: "7 minutes",
    prerequisites: ["Coordinate plane", "Vectors", "Ordered pairs"],
    learningOutcomes: ["Apply translation rules", "See vector movement on a grid", "Explain preserved shape and orientation"],
    componentKey: "TranslationOfPointsProof",
  },
  {
    id: "reflection-across-axes",
    title: "Reflection Across Axes",
    slug: "reflection-across-axes",
    shortDescription: "Reflect points across axes and watch coordinate signs change.",
    longDescription: "Mirror lines and equal distances show why x-axis, y-axis, and origin reflections change signs predictably.",
    difficulty: "Beginner",
    tags: ["coordinate geometry", "reflection", "transformation", "axes", "signs"],
    estimatedTime: "7 minutes",
    prerequisites: ["Coordinate plane", "Reflection", "Negative coordinates"],
    learningOutcomes: ["Reflect across x-axis", "Reflect across y-axis", "Reflect across origin"],
    componentKey: "ReflectionAcrossAxesProof",
  },
  {
    id: "rotation-about-origin",
    title: "Rotation About Origin",
    slug: "rotation-about-origin",
    shortDescription: "Rotate a point around the origin and compare special-case coordinate rules.",
    longDescription: "A circular path and radius segment show how rotations preserve distance from the origin.",
    difficulty: "Intermediate",
    tags: ["coordinate geometry", "rotation", "transformation", "origin", "trigonometry"],
    estimatedTime: "9 minutes",
    prerequisites: ["Coordinate plane", "Angles", "Basic trigonometry"],
    learningOutcomes: ["Apply 90, 180, and 270 degree rotation rules", "Use the general rotation formula", "Visualize rotation about origin"],
    componentKey: "RotationAboutOriginProof",
  },
  {
    id: "scaling-dilation-origin",
    title: "Scaling / Dilation from Origin",
    slug: "scaling-dilation-origin",
    shortDescription: "Scale a point or shape from the origin by multiplying coordinates by k.",
    longDescription: "Rays from the origin show how dilation moves points outward, inward, or through the origin.",
    difficulty: "Beginner",
    tags: ["coordinate geometry", "scaling", "dilation", "transformation", "origin"],
    estimatedTime: "7 minutes",
    prerequisites: ["Coordinate plane", "Multiplication", "Scale factor"],
    learningOutcomes: ["Apply P'(kx,ky)", "Interpret enlargement and reduction", "Explain negative scale factors"],
    componentKey: "ScalingDilationOriginProof",
  },
  {
    id: "coordinate-proof-pythagorean-theorem",
    title: "Coordinate Proof of Pythagorean Theorem",
    slug: "coordinate-proof-pythagorean-theorem",
    shortDescription: "Place a right triangle on the axes and use the distance formula for the hypotenuse.",
    longDescription: "With A at the origin, B on the x-axis, and C on the y-axis, the distance formula gives c^2 = a^2 + b^2.",
    difficulty: "Beginner",
    tags: ["coordinate geometry", "pythagorean theorem", "distance formula", "right triangle", "axes"],
    estimatedTime: "8 minutes",
    prerequisites: ["Distance formula", "Right triangles", "Coordinate plane"],
    learningOutcomes: ["Use coordinates to prove Pythagoras", "Connect distance formula to side lengths", "Derive c^2 = a^2 + b^2"],
    componentKey: "CoordinateProofPythagoreanProof",
  },
];

const calculusProofs: CalculusProofSeed[] = [
  {
    id: "limit-approaches-point",
    title: "Limit as x Approaches a Point",
    slug: "limit-approaches-point",
    shortDescription: "Watch left-hand and right-hand points approach the same function value.",
    longDescription: "An interactive graph proof shows how f(x) approaches L as x moves closer to a from both sides.",
    difficulty: "Intermediate",
    tags: ["calculus", "limit", "continuity", "graph", "approach"],
    estimatedTime: "8 minutes",
    prerequisites: ["Functions", "Graphs", "Coordinate geometry"],
    learningOutcomes: ["Interpret limits visually", "Compare left and right approaches", "Read a dynamic value table"],
    componentKey: "LimitApproachesPointProof",
  },
  {
    id: "derivative-slope-of-tangent",
    title: "Derivative as Slope of Tangent",
    slug: "derivative-slope-of-tangent",
    shortDescription: "See how the derivative measures the instantaneous slope of a curve.",
    longDescription: "An interactive graph proof showing a secant line approaching a tangent line as the second point moves closer to the first point.",
    difficulty: "Intermediate",
    tags: ["calculus", "derivative", "slope", "tangent", "limit", "graph"],
    estimatedTime: "8 minutes",
    prerequisites: ["Coordinate geometry", "Slope", "Functions", "Limits"],
    learningOutcomes: ["Understand derivative as instantaneous rate of change", "Connect secant slope with tangent slope", "Visualize the limit definition of derivative"],
    componentKey: "DerivativeSlopeOfTangentProof",
  },
  {
    id: "secant-becomes-tangent",
    title: "Secant Line Becoming Tangent Line",
    slug: "secant-becomes-tangent",
    shortDescription: "Animate secant lines converging to the tangent line.",
    longDescription: "A sequence of secants with shrinking h values reveals the tangent line as a limiting position.",
    difficulty: "Intermediate",
    tags: ["calculus", "derivative", "secant", "tangent", "limit"],
    estimatedTime: "8 minutes",
    prerequisites: ["Slope", "Limits", "Functions"],
    learningOutcomes: ["Explain tangent as a limit", "Compare secant slopes", "Understand slope convergence"],
    componentKey: "SecantBecomesTangentProof",
  },
  {
    id: "derivative-power-rule",
    title: "Power Rule for Derivatives",
    slug: "derivative-power-rule",
    shortDescription: "Use the difference quotient to see why d/dx[x^n] = nx^(n-1).",
    longDescription: "Graph and algebra panels show that after dividing by h, only the first-order h term survives as h approaches zero.",
    difficulty: "Intermediate",
    tags: ["calculus", "derivative", "power rule", "difference quotient"],
    estimatedTime: "9 minutes",
    prerequisites: ["Exponents", "Limits", "Difference quotient"],
    learningOutcomes: ["Derive the power rule visually", "Identify the surviving term", "Connect graph tangent to algebra"],
    componentKey: "DerivativePowerRuleProof",
  },
  {
    id: "product-rule-visual-proof",
    title: "Product Rule Visual Intuition",
    slug: "product-rule-visual-proof",
    shortDescription: "See product differentiation as changing rectangle area.",
    longDescription: "A rectangle with side lengths u and v grows by strips vdu and udv, with tiny corner dudv vanishing in the limit.",
    difficulty: "Intermediate",
    tags: ["calculus", "product rule", "derivative", "area", "differentiation rules"],
    estimatedTime: "9 minutes",
    prerequisites: ["Derivatives", "Area of rectangle", "Differentials"],
    learningOutcomes: ["Explain the product rule geometrically", "Identify u dv and v du", "Understand why du dv is negligible"],
    componentKey: "ProductRuleVisualProof",
  },
  {
    id: "chain-rule-visual-proof",
    title: "Chain Rule Visual Intuition",
    slug: "chain-rule-visual-proof",
    shortDescription: "Visualize a composite function as two linked rate machines.",
    longDescription: "The proof shows x changing u, then u changing y, so dy/dx multiplies dy/du and du/dx.",
    difficulty: "Intermediate",
    tags: ["calculus", "chain rule", "derivative", "composition", "differentiation rules"],
    estimatedTime: "9 minutes",
    prerequisites: ["Composite functions", "Derivatives", "Rates"],
    learningOutcomes: ["Interpret chain rule as linked rates", "Track dx to du to dy", "Apply the chain rule to examples"],
    componentKey: "ChainRuleVisualProof",
  },
  {
    id: "mean-value-theorem",
    title: "Mean Value Theorem",
    slug: "mean-value-theorem",
    shortDescription: "Find a tangent parallel to the secant over an interval.",
    longDescription: "A curve on [a,b] shows a point c where instantaneous slope matches average rate of change.",
    difficulty: "Advanced",
    tags: ["calculus", "mean value theorem", "theorem", "derivative", "secant", "tangent"],
    estimatedTime: "10 minutes",
    prerequisites: ["Continuity", "Differentiability", "Derivative"],
    learningOutcomes: ["State the Mean Value Theorem", "Compare average and instantaneous rates", "Visualize the point c"],
    componentKey: "MeanValueTheoremProof",
  },
  {
    id: "riemann-sums-area-under-curve",
    title: "Area Under a Curve by Riemann Sums",
    slug: "riemann-sums-area-under-curve",
    shortDescription: "Approximate area under a curve with rectangles.",
    longDescription: "Divide an interval into n pieces and watch rectangle sums approach the definite integral.",
    difficulty: "Intermediate",
    tags: ["calculus", "integral", "riemann sums", "area", "rectangles"],
    estimatedTime: "9 minutes",
    prerequisites: ["Functions", "Area", "Limits"],
    learningOutcomes: ["Build Riemann sums", "Interpret delta x", "Connect rectangle limits to integrals"],
    componentKey: "RiemannSumsAreaUnderCurveProof",
  },
  {
    id: "definite-integral-accumulated-area",
    title: "Definite Integral as Accumulated Area",
    slug: "definite-integral-accumulated-area",
    shortDescription: "Move the endpoint and watch signed area accumulate.",
    longDescription: "A shaded graph shows A(x) as signed accumulated area from a fixed start to a moving endpoint.",
    difficulty: "Intermediate",
    tags: ["calculus", "integral", "accumulated area", "signed area"],
    estimatedTime: "8 minutes",
    prerequisites: ["Definite integral", "Graph area", "Functions"],
    learningOutcomes: ["Interpret definite integrals as signed area", "Track an accumulation function", "Distinguish positive and negative area"],
    componentKey: "DefiniteIntegralAccumulatedAreaProof",
  },
  {
    id: "fundamental-theorem-of-calculus",
    title: "Fundamental Theorem of Calculus",
    slug: "fundamental-theorem-of-calculus",
    shortDescription: "See why the derivative of accumulated area returns the original function.",
    longDescription: "A small added area rectangle explains why A'(x) = f(x) for A(x)=int_a^x f(t)dt.",
    difficulty: "Advanced",
    tags: ["calculus", "fundamental theorem", "integral", "derivative", "theorem"],
    estimatedTime: "11 minutes",
    prerequisites: ["Derivatives", "Integrals", "Limits"],
    learningOutcomes: ["Connect area and slope", "Explain A'(x)=f(x)", "Visualize the small-rectangle argument"],
    componentKey: "FundamentalTheoremCalculusProof",
  },
  {
    id: "integration-by-parts-visual-proof",
    title: "Integration by Parts",
    slug: "integration-by-parts-visual-proof",
    shortDescription: "Rearrange the product rule to derive integration by parts.",
    longDescription: "A rectangle/product model balances uv with the two differential area strips.",
    difficulty: "Advanced",
    tags: ["calculus", "integration by parts", "integral", "product rule", "area"],
    estimatedTime: "10 minutes",
    prerequisites: ["Product rule", "Integration", "Differentials"],
    learningOutcomes: ["Derive integration by parts", "Connect it to product rule", "Interpret the area balance"],
    componentKey: "IntegrationByPartsVisualProof",
  },
  {
    id: "derivative-of-sine",
    title: "Derivative of sin x",
    slug: "derivative-of-sine",
    shortDescription: "Compare the tangent slope of sine with the cosine value.",
    longDescription: "A sine graph with moving tangent shows that d/dx[sin x] = cos x.",
    difficulty: "Intermediate",
    tags: ["calculus", "derivative", "sine", "cosine", "trigonometry"],
    estimatedTime: "8 minutes",
    prerequisites: ["Sine graph", "Derivative", "Tangent slope"],
    learningOutcomes: ["Visualize derivative of sine", "Compare slope with cosine", "Track slope sign changes"],
    componentKey: "DerivativeOfSineProof",
  },
  {
    id: "derivative-of-exponential",
    title: "Derivative of e^x",
    slug: "derivative-of-exponential",
    shortDescription: "See the function whose slope equals its height.",
    longDescription: "A graph of e^x shows that tangent slope and function value match at every point.",
    difficulty: "Intermediate",
    tags: ["calculus", "derivative", "exponential", "e^x", "tangent"],
    estimatedTime: "8 minutes",
    prerequisites: ["Exponential functions", "Derivatives", "Tangent slope"],
    learningOutcomes: ["Recognize e^x as its own derivative", "Compare value and slope", "Understand why e is special"],
    componentKey: "DerivativeOfExponentialProof",
  },
  {
    id: "taylor-series-approximation",
    title: "Taylor Series Approximation",
    slug: "taylor-series-approximation",
    shortDescription: "Approximate a function near a center using higher-order polynomials.",
    longDescription: "Compare a function with Taylor polynomial approximations as order increases.",
    difficulty: "Advanced",
    tags: ["calculus", "taylor series", "approximation", "series", "polynomial"],
    estimatedTime: "11 minutes",
    prerequisites: ["Derivatives", "Factorials", "Polynomial graphs"],
    learningOutcomes: ["Understand Taylor approximation", "Compare approximation order", "See why accuracy is local"],
    componentKey: "TaylorSeriesApproximationProof",
  },
  {
    id: "optimization-derivative-max-min",
    title: "Optimization: Maximum and Minimum from Derivative",
    slug: "optimization-derivative-max-min",
    shortDescription: "Find peaks and valleys where tangent slope becomes zero.",
    longDescription: "A moving tangent line and derivative sign chart show local maxima and minima as critical points.",
    difficulty: "Intermediate",
    tags: ["calculus", "optimization", "maximum", "minimum", "derivative", "critical points"],
    estimatedTime: "9 minutes",
    prerequisites: ["Derivative", "Tangent slope", "Functions"],
    learningOutcomes: ["Identify critical points", "Connect horizontal tangents to extrema", "Use derivative sign changes"],
    componentKey: "OptimizationDerivativeMaxMinProof",
  },
];

const numberTheoryProofs: NumberTheoryProofSeed[] = [
  {
    id: "even-odd-pairing",
    title: "Even and Odd Numbers as Pairing Patterns",
    slug: "even-odd-pairing",
    shortDescription: "Pair dots two by two to see even numbers leave no object and odd numbers leave one.",
    longDescription: "An interactive dot model shows parity as complete pairing or one leftover object.",
    difficulty: "Beginner",
    tags: ["number theory", "parity", "even", "odd", "pairing", "dots"],
    estimatedTime: "6 minutes",
    prerequisites: ["Counting", "Multiplication by 2"],
    learningOutcomes: ["Classify even and odd numbers visually", "Connect n=2k and n=2k+1 to pairing", "Use leftovers to explain parity"],
    componentKey: "EvenOddPairingProof",
  },
  {
    id: "divisibility-equal-grouping",
    title: "Divisibility as Equal Grouping",
    slug: "divisibility-equal-grouping",
    shortDescription: "Group objects into equal groups and inspect the remainder.",
    longDescription: "A browser-only grouping model shows a=bq+r and highlights when the remainder is zero.",
    difficulty: "Beginner",
    tags: ["number theory", "divisibility", "groups", "remainder", "division"],
    estimatedTime: "7 minutes",
    prerequisites: ["Division", "Remainders"],
    learningOutcomes: ["Interpret divisibility as no remainder", "Read quotient and remainder from groups", "Connect grouping to a=bq+r"],
    componentKey: "DivisibilityEqualGroupingProof",
  },
  {
    id: "primes-non-rectangular-arrays",
    title: "Prime Numbers as Non-Rectangular Arrays",
    slug: "primes-non-rectangular-arrays",
    shortDescription: "Try making rectangles from n dots and see why primes only make 1 by n arrays.",
    longDescription: "The proof tests factor-pair rectangles and shows primes have no non-trivial rectangular arrangement.",
    difficulty: "Beginner",
    tags: ["number theory", "prime", "arrays", "factor pairs", "rectangle"],
    estimatedTime: "8 minutes",
    prerequisites: ["Factors", "Rectangular arrays"],
    learningOutcomes: ["Identify prime numbers by factor pairs", "Distinguish trivial and non-trivial rectangles", "Explain why primes resist rectangular arrays"],
    componentKey: "PrimesNonRectangularArraysProof",
  },
  {
    id: "composites-rectangular-arrays",
    title: "Composite Numbers as Rectangular Arrays",
    slug: "composites-rectangular-arrays",
    shortDescription: "Use factor pairs to arrange composite numbers as rectangles.",
    longDescription: "A dot-array rectangle proves a number is composite when both side lengths are greater than one.",
    difficulty: "Beginner",
    tags: ["number theory", "composite", "arrays", "factor pairs", "rectangle"],
    estimatedTime: "8 minutes",
    prerequisites: ["Factors", "Multiplication arrays"],
    learningOutcomes: ["Show n=ab visually", "Recognize composite numbers", "Connect factors to rectangle sides"],
    componentKey: "CompositesRectangularArraysProof",
  },
  {
    id: "fundamental-theorem-arithmetic-factor-trees",
    title: "Fundamental Theorem of Arithmetic through Factor Trees",
    slug: "fundamental-theorem-arithmetic-factor-trees",
    shortDescription: "Split composite numbers into prime leaves and collect the unique prime factorization.",
    longDescription: "A factor-tree model recursively splits a number until only primes remain.",
    difficulty: "Intermediate",
    tags: ["number theory", "prime factorization", "factor tree", "fundamental theorem of arithmetic"],
    estimatedTime: "10 minutes",
    prerequisites: ["Prime numbers", "Factors", "Exponents"],
    learningOutcomes: ["Build a factor tree", "Collect prime leaves", "Write exponent-form factorization"],
    componentKey: "FundamentalTheoremArithmeticProof",
  },
  {
    id: "euclid-infinitely-many-primes",
    title: "Euclid's Proof of Infinitely Many Primes",
    slug: "euclid-infinitely-many-primes",
    shortDescription: "Multiply a finite prime list, add one, and see why the list cannot be complete.",
    longDescription: "The proof constructs N=p1p2...pk+1 and checks that each listed prime leaves remainder one.",
    difficulty: "Intermediate",
    tags: ["number theory", "prime", "euclid", "contradiction", "remainder"],
    estimatedTime: "10 minutes",
    prerequisites: ["Prime numbers", "Remainders", "Proof by contradiction"],
    learningOutcomes: ["State Euclid's prime proof", "Use remainders to challenge a finite list", "Explain why a new prime factor must exist"],
    componentKey: "EuclidInfinitelyManyPrimesProof",
  },
  {
    id: "gcd-euclidean-algorithm",
    title: "GCD by Euclidean Algorithm",
    slug: "gcd-euclidean-algorithm",
    shortDescription: "Repeat division and track the last non-zero remainder.",
    longDescription: "A length and division-table model shows why gcd(a,b)=gcd(b,a mod b).",
    difficulty: "Intermediate",
    tags: ["number theory", "gcd", "euclidean algorithm", "division", "remainder"],
    estimatedTime: "9 minutes",
    prerequisites: ["Division algorithm", "Remainders", "Common factors"],
    learningOutcomes: ["Run Euclid's algorithm", "Explain gcd preservation", "Identify the last non-zero remainder"],
    componentKey: "GcdEuclideanAlgorithmProof",
  },
  {
    id: "lcm-grid-alignment",
    title: "LCM by Grid Alignment",
    slug: "lcm-grid-alignment",
    shortDescription: "Align multiples on number lines to find the first common multiple.",
    longDescription: "Two repeated step patterns meet first at the least common multiple.",
    difficulty: "Beginner",
    tags: ["number theory", "lcm", "multiples", "number line", "alignment", "gcd"],
    estimatedTime: "8 minutes",
    prerequisites: ["Multiples", "Factors", "Number lines"],
    learningOutcomes: ["Find LCM as first alignment", "Compare multiples of two numbers", "Connect LCM and GCD"],
    componentKey: "LcmGridAlignmentProof",
  },
  {
    id: "modular-arithmetic-clock",
    title: "Modular Arithmetic as Clock Arithmetic",
    slug: "modular-arithmetic-clock",
    shortDescription: "Move around a modular clock and read the landing remainder.",
    longDescription: "A clock SVG shows modulo m as wrapping positions after m steps.",
    difficulty: "Beginner",
    tags: ["number theory", "modular arithmetic", "clock", "remainder", "congruence"],
    estimatedTime: "8 minutes",
    prerequisites: ["Remainders", "Clock arithmetic"],
    learningOutcomes: ["Interpret n mod m", "See wrapping behavior", "Connect congruence to equal remainders"],
    componentKey: "ModularArithmeticClockProof",
  },
  {
    id: "remainder-pattern-cycles",
    title: "Remainder Pattern Cycles",
    slug: "remainder-pattern-cycles",
    shortDescription: "Plot power remainders on a modular clock and watch cycles repeat.",
    longDescription: "The proof shows how finite residue sets force repeating modular patterns.",
    difficulty: "Intermediate",
    tags: ["number theory", "modular arithmetic", "remainders", "cycles", "powers"],
    estimatedTime: "9 minutes",
    prerequisites: ["Exponents", "Remainders", "Modulo"],
    learningOutcomes: ["Generate remainder cycles", "Read powers modulo m", "Explain repetition by finite residues"],
    componentKey: "RemainderPatternCyclesProof",
  },
  {
    id: "divisibility-by-3-and-9-digit-sum",
    title: "Divisibility by 3 and 9 using Digit Sum",
    slug: "divisibility-by-3-and-9-digit-sum",
    shortDescription: "Break a number into digits and use 10^k == 1 modulo 3 and 9.",
    longDescription: "A place-value board shows why a number and its digit sum have the same remainder modulo 3 and 9.",
    difficulty: "Intermediate",
    tags: ["number theory", "divisibility", "digit sum", "modular arithmetic", "place value"],
    estimatedTime: "9 minutes",
    prerequisites: ["Place value", "Remainders", "Powers of 10"],
    learningOutcomes: ["Prove digit-sum tests", "Use place-value decomposition", "Compare remainders modulo 3 and 9"],
    componentKey: "DivisibilityBy3And9Proof",
  },
  {
    id: "irrationality-of-square-root-2",
    title: "Why sqrt(2) is Irrational",
    slug: "irrationality-of-square-root-2",
    shortDescription: "Step through the contradiction that both numerator and denominator would be even.",
    longDescription: "A proof stepper pairs the unit-square diagonal intuition with the classical parity contradiction.",
    difficulty: "Intermediate",
    tags: ["number theory", "irrationality", "sqrt 2", "contradiction", "parity"],
    estimatedTime: "10 minutes",
    prerequisites: ["Fractions", "Even numbers", "Pythagorean theorem", "Proof by contradiction"],
    learningOutcomes: ["Explain why sqrt(2) is not rational", "Use parity in a contradiction", "Connect unit-square diagonal to sqrt(2)"],
    componentKey: "IrrationalitySqrt2Proof",
  },
];

const probabilityProofs: ProbabilityProofSeed[] = [
  {
    id: "probability-favorable-over-total",
    title: "Probability as Favorable Outcomes over Total Outcomes",
    slug: "probability-favorable-over-total",
    shortDescription: "Build a sample-space grid and compare favorable outcomes with all equally likely outcomes.",
    longDescription: "A simulation-board grid highlights event A, counts favorable outcomes, and converts the ratio to fraction, decimal, and percent.",
    difficulty: "Beginner",
    tags: ["probability", "sample space", "event", "favorable outcomes", "ratio"],
    estimatedTime: "7 minutes",
    prerequisites: ["Fractions", "Counting", "Ratios"],
    learningOutcomes: ["Compute P(A) from favorable and total outcomes", "Interpret probability as a ratio", "Compare fraction, decimal, and percent forms"],
    componentKey: "ProbabilityFavorableOverTotalProof",
  },
  {
    id: "complement-rule",
    title: "Complement Rule",
    slug: "complement-rule",
    shortDescription: "See event A and everything not in A fill the whole sample space.",
    longDescription: "A sample-space board splits outcomes into A and A complement, showing P(A complement)=1-P(A).",
    difficulty: "Beginner",
    tags: ["probability", "complement", "sample space", "event"],
    estimatedTime: "7 minutes",
    prerequisites: ["Basic probability", "Fractions"],
    learningOutcomes: ["Identify complements", "Use P(A)+P(A complement)=1", "Read remaining probability from a grid"],
    componentKey: "ComplementRuleProof",
  },
  {
    id: "addition-rule-overlapping-events",
    title: "Addition Rule for Overlapping Events",
    slug: "addition-rule-overlapping-events",
    shortDescription: "Use overlapping events to see why the intersection must be subtracted once.",
    longDescription: "A two-event Venn/grid model shows union, intersection, and the double-count correction in P(A union B).",
    difficulty: "Intermediate",
    tags: ["probability", "addition rule", "union", "intersection", "venn"],
    estimatedTime: "9 minutes",
    prerequisites: ["Events", "Set notation", "Basic probability"],
    learningOutcomes: ["Compute union probability", "Explain double-counting", "Distinguish disjoint and overlapping events"],
    componentKey: "AdditionRuleOverlappingEventsProof",
  },
  {
    id: "multiplication-rule-independent-events",
    title: "Multiplication Rule and Independent Events",
    slug: "multiplication-rule-independent-events",
    shortDescription: "Make a product grid where independent probabilities multiply into an intersection area.",
    longDescription: "A rectangular probability area model shows P(A and B)=P(A)P(B) when events are independent.",
    difficulty: "Intermediate",
    tags: ["probability", "independence", "multiplication rule", "product grid"],
    estimatedTime: "9 minutes",
    prerequisites: ["Fractions", "Area model", "Independent events"],
    learningOutcomes: ["Interpret independence", "Multiply probabilities for intersections", "Read product area from a grid"],
    componentKey: "MultiplicationRuleIndependentEventsProof",
  },
  {
    id: "conditional-probability",
    title: "Conditional Probability",
    slug: "conditional-probability",
    shortDescription: "Restrict the sample space to B and count A inside B.",
    longDescription: "A conditional zoom model shows P(A|B)=P(A intersection B)/P(B) by changing the denominator to event B.",
    difficulty: "Intermediate",
    tags: ["probability", "conditional probability", "sample space", "intersection"],
    estimatedTime: "9 minutes",
    prerequisites: ["Events", "Fractions", "Intersection"],
    learningOutcomes: ["Use B as a restricted sample space", "Compute P(A|B)", "Compare conditional and unconditional probability"],
    componentKey: "ConditionalProbabilityProof",
  },
  {
    id: "tree-diagram-compound-probability",
    title: "Tree Diagrams for Compound Probability",
    slug: "tree-diagram-compound-probability",
    shortDescription: "Multiply along branches and add across selected disjoint paths.",
    longDescription: "A two-stage probability tree shows branch probabilities, terminal path products, and selected-path sums.",
    difficulty: "Intermediate",
    tags: ["probability", "tree diagram", "compound probability", "branch", "path"],
    estimatedTime: "10 minutes",
    prerequisites: ["Fractions", "Multiplication", "Disjoint events"],
    learningOutcomes: ["Read branch probabilities", "Multiply along paths", "Add disjoint target paths"],
    componentKey: "TreeDiagramCompoundProbabilityProof",
  },
  {
    id: "experimental-probability-law-large-numbers",
    title: "Experimental Probability and Law of Large Numbers",
    slug: "experimental-probability-law-large-numbers",
    shortDescription: "Compare running frequency with a theoretical probability as trials increase.",
    longDescription: "A deterministic browser simulation board shows successes over trials approaching the target probability in long-run frequency.",
    difficulty: "Intermediate",
    tags: ["probability", "experimental probability", "law of large numbers", "simulation", "frequency"],
    estimatedTime: "10 minutes",
    prerequisites: ["Ratios", "Percent", "Random experiments"],
    learningOutcomes: ["Compute experimental probability", "Compare frequency with theory", "Explain long-run stabilization"],
    componentKey: "ExperimentalProbabilityLawLargeNumbersProof",
  },
  {
    id: "expected-value-long-run-average",
    title: "Expected Value as Long-Run Average",
    slug: "expected-value-long-run-average",
    shortDescription: "Build a weighted average from outcomes and their probabilities.",
    longDescription: "Contribution bars show x_i P(x_i), and a running-average comparison connects expectation to long-run behavior.",
    difficulty: "Intermediate",
    tags: ["probability", "expected value", "weighted average", "long-run average"],
    estimatedTime: "10 minutes",
    prerequisites: ["Averages", "Probability", "Multiplication"],
    learningOutcomes: ["Compute expected value", "Read contributions", "Understand expectation as long-run average"],
    componentKey: "ExpectedValueLongRunAverageProof",
  },
];

const statisticsProofs: StatisticsProofSeed[] = [
  {
    id: "mean-as-balance-point",
    title: "Mean as Balance Point",
    slug: "mean-as-balance-point",
    shortDescription: "Drag data points on a number line and watch the mean balance signed deviations.",
    longDescription: "A dot plot shows the arithmetic mean as a balance point where positive and negative deviations cancel.",
    difficulty: "Beginner",
    tags: ["statistics", "mean", "dot plot", "balance point", "deviation"],
    estimatedTime: "8 minutes",
    prerequisites: ["Addition", "Division", "Number line"],
    learningOutcomes: ["Compute mean from a data set", "Interpret the mean as a balance point", "Explain why signed deviations sum to zero"],
    componentKey: "MeanAsBalancePointProof",
  },
  {
    id: "median-and-quartiles",
    title: "Median and Quartiles",
    slug: "median-and-quartiles",
    shortDescription: "Sort data, locate the median and quartiles, and build a boxplot.",
    longDescription: "A sorted-dot display highlights median, Q1, Q3, IQR, and the five-number summary.",
    difficulty: "Beginner",
    tags: ["statistics", "median", "quartiles", "IQR", "boxplot"],
    estimatedTime: "8 minutes",
    prerequisites: ["Ordering numbers", "Data values"],
    learningOutcomes: ["Find the median after sorting", "Identify Q1 and Q3", "Construct and interpret a boxplot"],
    componentKey: "MedianAndQuartilesProof",
  },
  {
    id: "variance-standard-deviation",
    title: "Variance and Standard Deviation",
    slug: "variance-standard-deviation",
    shortDescription: "See deviations from the mean become squared distances and then a standard deviation.",
    longDescription: "A deviation display squares distances from the mean, averages them, and takes a square root to return to original units.",
    difficulty: "Intermediate",
    tags: ["statistics", "variance", "standard deviation", "deviation", "spread"],
    estimatedTime: "10 minutes",
    prerequisites: ["Mean", "Squares", "Square roots"],
    learningOutcomes: ["Compute variance", "Interpret squared deviations", "Relate standard deviation to spread"],
    componentKey: "VarianceStandardDeviationProof",
  },
  {
    id: "histogram-frequency-distribution",
    title: "Histogram and Frequency Distribution",
    slug: "histogram-frequency-distribution",
    shortDescription: "Drop raw data into bins and see frequency bars form a histogram.",
    longDescription: "A binning model groups data into intervals, counts frequencies, and shows how bin count changes shape.",
    difficulty: "Beginner",
    tags: ["statistics", "histogram", "frequency", "bins", "data count"],
    estimatedTime: "9 minutes",
    prerequisites: ["Counting", "Intervals", "Bar charts"],
    learningOutcomes: ["Group data into bins", "Read histogram frequencies", "Verify frequency totals equal n"],
    componentKey: "HistogramFrequencyDistributionProof",
  },
  {
    id: "sampling-distribution-mean",
    title: "Sampling Distribution of the Mean",
    slug: "sampling-distribution-mean",
    shortDescription: "Draw repeated samples and watch sample means form their own distribution.",
    longDescription: "A deterministic sampling display compares population values, latest sample means, and the spread of repeated sample means.",
    difficulty: "Intermediate",
    tags: ["statistics", "sampling distribution", "sample mean", "population mean", "sample size"],
    estimatedTime: "10 minutes",
    prerequisites: ["Mean", "Samples", "Distribution"],
    learningOutcomes: ["Distinguish sample means from population mean", "Explain sampling variability", "See larger sample size reduce spread"],
    componentKey: "SamplingDistributionMeanProof",
  },
  {
    id: "normal-distribution-empirical-rule",
    title: "Normal Distribution Empirical Rule",
    slug: "normal-distribution-empirical-rule",
    shortDescription: "Shade 68%, 95%, and 99.7% intervals on a normal curve.",
    longDescription: "A bell curve marks mu and sigma intervals while showing how sigma controls spread.",
    difficulty: "Intermediate",
    tags: ["statistics", "normal distribution", "empirical rule", "mean", "standard deviation"],
    estimatedTime: "9 minutes",
    prerequisites: ["Mean", "Standard deviation", "Percent"],
    learningOutcomes: ["Read mu and sigma markers", "Apply the empirical rule", "Explain why sigma changes curve width"],
    componentKey: "NormalDistributionEmpiricalRuleProof",
  },
  {
    id: "correlation-scatterplot",
    title: "Correlation and Scatterplots",
    slug: "correlation-scatterplot",
    shortDescription: "Change direction and spread in a scatterplot while tracking r.",
    longDescription: "A paired-data display shows trend direction, strength, and why correlation is not causation.",
    difficulty: "Intermediate",
    tags: ["statistics", "correlation", "scatterplot", "trend line", "association"],
    estimatedTime: "9 minutes",
    prerequisites: ["Coordinate plane", "Paired data", "Linear patterns"],
    learningOutcomes: ["Interpret positive and negative correlation", "Connect spread to correlation strength", "Distinguish correlation from causation"],
    componentKey: "CorrelationScatterplotProof",
  },
  {
    id: "linear-regression-least-squares",
    title: "Linear Regression Least Squares",
    slug: "linear-regression-least-squares",
    shortDescription: "Move a regression line and compare squared residual loss with the least-squares line.",
    longDescription: "A scatterplot with residual segments and squared-error bars shows how least squares minimizes total squared error.",
    difficulty: "Advanced",
    tags: ["statistics", "regression", "least squares", "residual", "scatterplot"],
    estimatedTime: "11 minutes",
    prerequisites: ["Scatterplots", "Linear equations", "Squares"],
    learningOutcomes: ["Measure residuals", "Compute squared-error loss", "Explain the least-squares criterion"],
    componentKey: "LinearRegressionLeastSquaresProof",
  },
];

const matrixLinearAlgebraProofs: MatrixLinearAlgebraProofSeed[] = [
  {
    id: "matrix-addition-cell-by-cell",
    title: "Matrix Addition as Cell-by-Cell Addition",
    slug: "matrix-addition-cell-by-cell",
    shortDescription: "Highlight matching entries in A and B to build the result matrix one cell at a time.",
    longDescription: "A matrix grid model shows that matrix addition requires the same dimensions and adds entries position by position.",
    difficulty: "Beginner",
    tags: ["matrices", "linear algebra", "matrix addition", "entries", "same size"],
    estimatedTime: "8 minutes",
    prerequisites: ["Matrix notation", "Integer arithmetic"],
    learningOutcomes: ["Add matching matrix entries", "Identify dimension requirements", "Explain why addition is position-by-position"],
    componentKey: "MatrixAdditionCellByCellProof",
  },
  {
    id: "matrix-multiplication-row-column",
    title: "Matrix Multiplication as Row-by-Column Dot Product",
    slug: "matrix-multiplication-row-column",
    shortDescription: "Select one product entry and see the row-column dot product that creates it.",
    longDescription: "A row-column highlighter connects pairwise products, their sum, and the selected entry of AB.",
    difficulty: "Intermediate",
    tags: ["matrices", "linear algebra", "matrix multiplication", "row", "column", "dot product"],
    estimatedTime: "10 minutes",
    prerequisites: ["Matrix notation", "Dot product", "Multiplication"],
    learningOutcomes: ["Compute one entry of a product matrix", "Connect rows and columns to dot products", "Avoid cell-by-cell multiplication mistakes"],
    componentKey: "MatrixMultiplicationRowColumnProof",
  },
  {
    id: "matrix-linear-transformation-grid",
    title: "Matrix as Linear Transformation",
    slug: "matrix-linear-transformation-grid",
    shortDescription: "Move a 2D vector through a matrix and watch the coordinate grid deform.",
    longDescription: "A transformation grid shows columns as transformed basis vectors and Av as their linear combination.",
    difficulty: "Intermediate",
    tags: ["matrices", "linear algebra", "linear transformation", "basis vectors", "grid"],
    estimatedTime: "10 minutes",
    prerequisites: ["Coordinate plane", "Vectors", "2x2 matrices"],
    learningOutcomes: ["Interpret columns as transformed basis vectors", "Compute Av", "See matrices as transformations of space"],
    componentKey: "MatrixLinearTransformationGridProof",
  },
  {
    id: "determinant-area-scale-factor",
    title: "Determinant as Area Scale Factor",
    slug: "determinant-area-scale-factor",
    shortDescription: "Transform the unit square and compare parallelogram area with ad-bc.",
    longDescription: "A transformed parallelogram shows determinant as signed area scale and orientation.",
    difficulty: "Intermediate",
    tags: ["matrices", "linear algebra", "determinant", "area scale", "orientation"],
    estimatedTime: "10 minutes",
    prerequisites: ["2x2 matrices", "Area", "Parallelograms"],
    learningOutcomes: ["Compute determinant ad-bc", "Interpret absolute determinant as area scale", "Recognize orientation flips"],
    componentKey: "DeterminantAreaScaleFactorProof",
  },
  {
    id: "linear-system-line-intersection",
    title: "Solving 2x2 Linear Systems as Line Intersection",
    slug: "linear-system-line-intersection",
    shortDescription: "Graph two equations and read their intersection as the shared solution.",
    longDescription: "A coordinate-grid model compares two lines, determinant status, and the point satisfying both equations.",
    difficulty: "Intermediate",
    tags: ["linear algebra", "linear systems", "line intersection", "determinant", "coordinate grid"],
    estimatedTime: "10 minutes",
    prerequisites: ["Line equations", "Coordinates", "Systems of equations"],
    learningOutcomes: ["Interpret a solution as line intersection", "Classify one/no/infinite solutions", "Connect determinant to uniqueness"],
    componentKey: "LinearSystemLineIntersectionProof",
  },
  {
    id: "row-operations-preserve-solutions",
    title: "Row Operations Preserve Solution Set",
    slug: "row-operations-preserve-solutions",
    shortDescription: "Apply an elementary row operation and watch the solution point stay fixed.",
    longDescription: "An augmented-matrix and line display shows equivalent systems preserving the same intersection.",
    difficulty: "Intermediate",
    tags: ["linear algebra", "row operations", "augmented matrix", "equivalent systems", "solution set"],
    estimatedTime: "10 minutes",
    prerequisites: ["Linear systems", "Rows", "Matrix notation"],
    learningOutcomes: ["Use valid row operations", "Explain equivalent systems", "Verify the solution set is preserved"],
    componentKey: "RowOperationsPreserveSolutionsProof",
  },
  {
    id: "eigenvectors-directions-do-not-turn",
    title: "Eigenvectors as Directions That Do Not Turn",
    slug: "eigenvectors-directions-do-not-turn",
    shortDescription: "Compare v and Av to find directions that stay on their own line.",
    longDescription: "A transformation grid shows eigenvector directions, image vectors, and the stretch factor lambda.",
    difficulty: "Advanced",
    tags: ["linear algebra", "eigenvectors", "eigenvalues", "transformation", "direction"],
    estimatedTime: "11 minutes",
    prerequisites: ["Vectors", "Linear transformations", "Scalar multiples"],
    learningOutcomes: ["Recognize eigenvector directions", "Interpret lambda as stretch factor", "Distinguish special directions from arbitrary vectors"],
    componentKey: "EigenvectorsDirectionsDoNotTurnProof",
  },
  {
    id: "matrix-inverse-undo-transformation",
    title: "Matrix Inverse as Undoing a Transformation",
    slug: "matrix-inverse-undo-transformation",
    shortDescription: "Apply A and then A inverse to return a vector and grid to the original state.",
    longDescription: "A transformation sequence shows invertibility, determinant nonzero status, and A inverse A as identity.",
    difficulty: "Advanced",
    tags: ["linear algebra", "matrix inverse", "identity", "determinant", "transformation"],
    estimatedTime: "11 minutes",
    prerequisites: ["2x2 matrices", "Determinants", "Linear transformations"],
    learningOutcomes: ["Explain inverse as undoing a transformation", "Connect determinant zero to non-invertibility", "Verify A inverse Av equals v"],
    componentKey: "MatrixInverseUndoTransformationProof",
  },
];

const vectorProofs: VectorProofSeed[] = [
  {
    id: "vector-as-directed-segment",
    title: "Vector as Directed Segment",
    slug: "vector-as-directed-segment",
    shortDescription: "Drag an endpoint to see a vector as components, magnitude, and direction.",
    longDescription: "A coordinate grid connects v=<x,y>, horizontal and vertical components, distance-formula magnitude, and direction angle from the positive x-axis.",
    difficulty: "Beginner",
    tags: ["vectors", "directed segment", "components", "magnitude", "direction"],
    estimatedTime: "8 minutes",
    prerequisites: ["Coordinate plane", "Distance formula", "Angles"],
    learningOutcomes: ["Read vector components", "Compute vector magnitude", "Interpret direction angle and quadrant"],
    componentKey: "VectorAsDirectedSegmentProof",
  },
  {
    id: "vector-addition-tip-to-tail",
    title: "Vector Addition: Tip-to-Tail and Parallelogram Rule",
    slug: "vector-addition-tip-to-tail",
    shortDescription: "Move two vectors and compare tip-to-tail addition with the parallelogram diagonal.",
    longDescription: "A vector field shows u, v, the translated copy of v, the parallelogram, and the resultant u+v from component sums.",
    difficulty: "Beginner",
    tags: ["vectors", "addition", "tip to tail", "parallelogram", "resultant"],
    estimatedTime: "9 minutes",
    prerequisites: ["Vector components", "Coordinate plane"],
    learningOutcomes: ["Add vector components", "Explain the resultant", "Verify tip-to-tail and parallelogram methods agree"],
    componentKey: "VectorAdditionTipToTailProof",
  },
  {
    id: "scalar-multiplication-vector",
    title: "Scalar Multiplication of Vectors",
    slug: "scalar-multiplication-vector",
    shortDescription: "Scale a vector by k and watch stretching, shrinking, reversal, and zero collapse.",
    longDescription: "A vector field compares v with kv and links the scale factor to component multiplication and length scaling.",
    difficulty: "Beginner",
    tags: ["vectors", "scalar multiplication", "scale factor", "direction", "components"],
    estimatedTime: "8 minutes",
    prerequisites: ["Vector components", "Signed numbers", "Multiplication"],
    learningOutcomes: ["Compute kv", "Relate |kv| to |k||v|", "Recognize direction reversal for negative k"],
    componentKey: "ScalarMultiplicationVectorProof",
  },
  {
    id: "dot-product-as-projection",
    title: "Dot Product as Projection",
    slug: "dot-product-as-projection",
    shortDescription: "Project u onto v and read the dot product sign from the angle.",
    longDescription: "Two draggable vectors reveal angle, signed projection, component formula, and u dot v = |u||v|cos theta.",
    difficulty: "Intermediate",
    tags: ["vectors", "dot product", "projection", "angle", "cosine"],
    estimatedTime: "10 minutes",
    prerequisites: ["Vector components", "Cosine", "Projection"],
    learningOutcomes: ["Compute dot product", "Interpret positive, zero, and negative signs", "Connect component and projection formulas"],
    componentKey: "DotProductAsProjectionProof",
  },
  {
    id: "cross-product-area",
    title: "Cross Product Magnitude as Area",
    slug: "cross-product-area",
    shortDescription: "Build the parallelogram spanned by u and v and measure |u x v| as area.",
    longDescription: "A 2D schematic for 3D cross-product magnitude shows base, perpendicular height, sin theta, and zero area for parallel vectors.",
    difficulty: "Intermediate",
    tags: ["vectors", "cross product", "area", "parallelogram", "sine"],
    estimatedTime: "10 minutes",
    prerequisites: ["Vector magnitude", "Parallelogram area", "Sine"],
    learningOutcomes: ["Interpret cross-product magnitude as area", "Identify base and height", "Explain why parallel vectors give zero area"],
    componentKey: "CrossProductAreaProof",
  },
  {
    id: "unit-vectors-normalization",
    title: "Unit Vectors and Normalization",
    slug: "unit-vectors-normalization",
    shortDescription: "Normalize a draggable vector and compare it with the unit circle.",
    longDescription: "A vector field shows v, |v|, v/|v|, the unit circle, and the zero-vector warning.",
    difficulty: "Beginner",
    tags: ["vectors", "unit vector", "normalization", "magnitude", "unit circle"],
    estimatedTime: "8 minutes",
    prerequisites: ["Vector magnitude", "Division", "Unit circle"],
    learningOutcomes: ["Normalize a nonzero vector", "Explain why direction stays fixed", "Recognize why the zero vector cannot be normalized"],
    componentKey: "UnitVectorsNormalizationProof",
  },
  {
    id: "vector-equation-line",
    title: "Vector Equation of a Line",
    slug: "vector-equation-line",
    shortDescription: "Move a starting vector, direction vector, and parameter t to trace r=a+td.",
    longDescription: "A vector-line guide shows start point a, direction d, scalar parameter t, td, current point r, and the full traced line.",
    difficulty: "Intermediate",
    tags: ["vectors", "line", "parameter", "vector equation", "direction"],
    estimatedTime: "10 minutes",
    prerequisites: ["Vector addition", "Scalar multiplication", "Line geometry"],
    learningOutcomes: ["Interpret r=a+td", "Use t to move along a line", "Connect direction vectors to traced points"],
    componentKey: "VectorEquationLineProof",
  },
  {
    id: "vector-projection-component",
    title: "Vector Projection and Component Along a Direction",
    slug: "vector-projection-component",
    shortDescription: "Project u onto v and show the residual perpendicular component.",
    longDescription: "A projection guide links proj_v u = ((u dot v)/|v|^2)v to the scaled target direction and a perpendicular residual.",
    difficulty: "Advanced",
    tags: ["vectors", "projection", "component", "residual", "perpendicular"],
    estimatedTime: "11 minutes",
    prerequisites: ["Dot product", "Scalar multiplication", "Perpendicular vectors"],
    learningOutcomes: ["Compute vector projection", "Interpret residual as perpendicular", "Distinguish projection direction from coordinate axes"],
    componentKey: "VectorProjectionComponentProof",
  },
];

const complexNumberProofs: ComplexNumberProofSeed[] = [
  {
    id: "complex-number-plane-point",
    title: "Complex Number as a Point on the Plane",
    slug: "complex-number-plane-point",
    shortDescription: "Drag z=a+bi on the complex plane and read its real and imaginary coordinates.",
    longDescription: "A complex-plane model shows real and imaginary axes, the point z, component guides, and the vector from the origin.",
    difficulty: "Beginner",
    tags: ["complex numbers", "complex plane", "real part", "imaginary part", "coordinates"],
    estimatedTime: "8 minutes",
    prerequisites: ["Coordinate plane", "Real and imaginary parts"],
    learningOutcomes: ["Plot z=a+bi", "Connect a+bi to (a,b)", "Interpret imaginary part as vertical coordinate"],
    componentKey: "ComplexNumberPlanePointProof",
  },
  {
    id: "modulus-and-argument",
    title: "Complex Modulus and Argument",
    slug: "modulus-and-argument",
    shortDescription: "Measure |z| as distance from the origin and arg(z) as the direction angle.",
    longDescription: "A component triangle connects a, b, modulus, argument, and quadrant on the complex plane.",
    difficulty: "Beginner",
    tags: ["complex numbers", "modulus", "argument", "polar form", "distance"],
    estimatedTime: "9 minutes",
    prerequisites: ["Distance formula", "Angles", "Complex plane"],
    learningOutcomes: ["Compute modulus", "Measure argument", "Connect rectangular and polar descriptions"],
    componentKey: "ModulusAndArgumentProof",
  },
  {
    id: "complex-addition-vector",
    title: "Complex Addition as Vector Addition",
    slug: "complex-addition-vector",
    shortDescription: "Add z1 and z2 with tip-to-tail vectors and component sums.",
    longDescription: "Complex addition appears as vector addition: real parts add horizontally and imaginary parts add vertically.",
    difficulty: "Beginner",
    tags: ["complex numbers", "addition", "vector addition", "parallelogram", "components"],
    estimatedTime: "9 minutes",
    prerequisites: ["Complex plane", "Vector addition"],
    learningOutcomes: ["Add complex numbers component-wise", "Use tip-to-tail addition", "Distinguish addition from polar multiplication"],
    componentKey: "ComplexAdditionVectorProof",
  },
  {
    id: "complex-multiplication-rotation-scaling",
    title: "Complex Multiplication as Rotation and Scaling",
    slug: "complex-multiplication-rotation-scaling",
    shortDescription: "Multiply moduli and add arguments to locate z1z2.",
    longDescription: "A polar complex-plane guide shows complex multiplication as length scaling by r1r2 and rotation by theta1+theta2.",
    difficulty: "Intermediate",
    tags: ["complex numbers", "multiplication", "polar form", "rotation", "scaling"],
    estimatedTime: "11 minutes",
    prerequisites: ["Polar form", "Trigonometry", "Complex multiplication"],
    learningOutcomes: ["Interpret multiplication in polar form", "Multiply moduli", "Add arguments"],
    componentKey: "ComplexMultiplicationRotationScalingProof",
  },
  {
    id: "multiplication-by-i-rotation",
    title: "Multiplication by i as 90 Degree Rotation",
    slug: "multiplication-by-i-rotation",
    shortDescription: "Rotate z by 90 degrees counterclockwise and read iz=-b+ai.",
    longDescription: "The complex plane shows multiplication by i as a quarter-turn that sends coordinates (a,b) to (-b,a).",
    difficulty: "Beginner",
    tags: ["complex numbers", "imaginary unit", "rotation", "90 degrees", "coordinates"],
    estimatedTime: "8 minutes",
    prerequisites: ["Complex plane", "Rotation", "Imaginary unit"],
    learningOutcomes: ["Explain i as a rotation", "Compute iz", "Verify modulus is preserved"],
    componentKey: "MultiplicationByIRotationProof",
  },
  {
    id: "complex-conjugate-reflection",
    title: "Complex Conjugate and Reflection",
    slug: "complex-conjugate-reflection",
    shortDescription: "Reflect z across the real axis to see conjugation.",
    longDescription: "A reflection guide shows z=a+bi, conjugate zbar=a-bi, unchanged real part, and imaginary sign flip.",
    difficulty: "Beginner",
    tags: ["complex numbers", "conjugate", "reflection", "real axis", "modulus"],
    estimatedTime: "8 minutes",
    prerequisites: ["Complex plane", "Reflection", "Sign changes"],
    learningOutcomes: ["Find a complex conjugate", "Interpret conjugation as reflection", "Connect z zbar to |z|^2"],
    componentKey: "ComplexConjugateReflectionProof",
  },
  {
    id: "roots-of-unity",
    title: "Roots of Unity",
    slug: "roots-of-unity",
    shortDescription: "Divide the unit circle into equal angles to see all n roots of z^n=1.",
    longDescription: "A unit-circle guide plots equally spaced roots, the selected root, and the regular polygon formed by the roots.",
    difficulty: "Intermediate",
    tags: ["complex numbers", "roots of unity", "unit circle", "cis", "regular polygon"],
    estimatedTime: "10 minutes",
    prerequisites: ["Unit circle", "Angles", "Powers"],
    learningOutcomes: ["Locate n roots of unity", "Use angle spacing 2pi/n", "Explain why complex roots form a regular polygon"],
    componentKey: "RootsOfUnityProof",
  },
  {
    id: "euler-form-unit-circle",
    title: "Euler Form and Unit Circle",
    slug: "euler-form-unit-circle",
    shortDescription: "Move theta around the unit circle and read e^{i theta}=cos theta+i sin theta.",
    longDescription: "Euler form is shown as the unit-circle point with x-coordinate cos theta and y-coordinate sin theta.",
    difficulty: "Intermediate",
    tags: ["complex numbers", "Euler form", "unit circle", "cosine", "sine"],
    estimatedTime: "10 minutes",
    prerequisites: ["Unit circle", "Sine and cosine", "Complex plane"],
    learningOutcomes: ["Interpret e^{i theta}", "Connect cosine and sine to coordinates", "Verify modulus 1"],
    componentKey: "EulerFormUnitCircleProof",
  },
];

const mensurationProofs: MensurationProofSeed[] = [
  {
    id: "rectangle-square-area",
    title: "Rectangle and Square Area",
    slug: "rectangle-square-area",
    shortDescription: "Drag length and width to count unit squares and see area = length x width.",
    longDescription: "A measurement grid fills a rectangle with unit squares, switches into square mode when both sides match, and connects counting to side^2.",
    difficulty: "Beginner",
    tags: ["mensuration", "area", "rectangle", "square", "unit squares"],
    estimatedTime: "8 minutes",
    prerequisites: ["Multiplication", "Rows and columns", "Square units"],
    learningOutcomes: ["Count unit squares", "Explain area = length x width", "Recognize square area as side^2"],
    componentKey: "RectangleSquareAreaProof",
  },
  {
    id: "perimeter-and-circumference",
    title: "Perimeter and Circumference",
    slug: "perimeter-and-circumference",
    shortDescription: "Trace the outside boundary of rectangles and unwrap a circle circumference into a line.",
    longDescription: "A boundary-walk model compares perimeter with area, then unwraps a circle to show circumference as 2 pi r = pi d.",
    difficulty: "Beginner",
    tags: ["mensuration", "perimeter", "circumference", "rectangle", "circle"],
    estimatedTime: "9 minutes",
    prerequisites: ["Rectangle", "Circle", "Radius", "Diameter"],
    learningOutcomes: ["Distinguish boundary length from area", "Calculate rectangle perimeter", "Connect circumference to radius and diameter"],
    componentKey: "PerimeterAndCircumferenceProof",
  },
  {
    id: "cuboid-cube-surface-area",
    title: "Surface Area of Cuboid and Cube",
    slug: "cuboid-cube-surface-area",
    shortDescription: "Open a cuboid into paired faces and add lw, lh, and wh twice.",
    longDescription: "A cuboid schematic and net identify three opposite face pairs, with cube mode showing the special case 6s^2.",
    difficulty: "Intermediate",
    tags: ["mensuration", "surface area", "cuboid", "cube", "net"],
    estimatedTime: "10 minutes",
    prerequisites: ["Rectangle area", "Cuboid", "Opposite faces"],
    learningOutcomes: ["Find face-pair areas", "Explain 2(lw+lh+wh)", "Recognize cube surface area as 6s^2"],
    componentKey: "CuboidCubeSurfaceAreaProof",
  },
  {
    id: "cuboid-cube-volume",
    title: "Volume of Cuboid and Cube",
    slug: "cuboid-cube-volume",
    shortDescription: "Build a base layer of unit cubes and stack height layers to get volume.",
    longDescription: "A unit-cube stack shows base area length x width, height as number of layers, and cube mode as side^3.",
    difficulty: "Beginner",
    tags: ["mensuration", "volume", "cuboid", "cube", "unit cubes"],
    estimatedTime: "9 minutes",
    prerequisites: ["Area of rectangle", "Multiplication", "Cubic units"],
    learningOutcomes: ["Compute base area", "Count stacked layers", "Explain volume = length x width x height"],
    componentKey: "CuboidCubeVolumeProof",
  },
  {
    id: "cylinder-volume-surface-area",
    title: "Cylinder Volume and Curved Surface Area",
    slug: "cylinder-volume-surface-area",
    shortDescription: "Stack circular disks for volume and unwrap the curved side into a rectangle.",
    longDescription: "A cylinder model links base area pi r^2, height h, unrolled circumference 2 pi r, curved surface area, and total surface area.",
    difficulty: "Intermediate",
    tags: ["mensuration", "cylinder", "volume", "curved surface area", "surface area"],
    estimatedTime: "11 minutes",
    prerequisites: ["Circle area", "Circumference", "Height"],
    learningOutcomes: ["Explain cylinder volume", "Unroll curved surface area", "Add bases for total surface area"],
    componentKey: "CylinderVolumeSurfaceAreaProof",
  },
  {
    id: "cone-volume-surface-area",
    title: "Cone Volume and Surface Area",
    slug: "cone-volume-surface-area",
    shortDescription: "Compare a cone with its matching cylinder and unwrap the curved side as a sector.",
    longDescription: "A cone guide marks radius, height, slant height, one-third cylinder volume, lateral sector area, and total surface area.",
    difficulty: "Intermediate",
    tags: ["mensuration", "cone", "volume", "slant height", "sector"],
    estimatedTime: "11 minutes",
    prerequisites: ["Cylinder volume", "Pythagorean theorem", "Circle sector"],
    learningOutcomes: ["Use the one-third volume relation", "Distinguish height and slant height", "Connect cone surface area to a sector"],
    componentKey: "ConeVolumeSurfaceAreaProof",
  },
  {
    id: "sphere-surface-area-volume",
    title: "Sphere Surface Area and Volume",
    slug: "sphere-surface-area-volume",
    shortDescription: "Scale a sphere radius and compare surface area growth with volume growth.",
    longDescription: "A schematic sphere shows the radius, great-circle area, four-circle surface analogy, and r^2 versus r^3 scaling.",
    difficulty: "Intermediate",
    tags: ["mensuration", "sphere", "surface area", "volume", "scaling"],
    estimatedTime: "10 minutes",
    prerequisites: ["Circle area", "Radius", "Powers"],
    learningOutcomes: ["Use surface area = 4 pi r^2", "Use volume = 4/3 pi r^3", "Explain why volume scales faster than area"],
    componentKey: "SphereSurfaceAreaVolumeProof",
  },
  {
    id: "composite-solids-and-units",
    title: "Composite Solids and Units",
    slug: "composite-solids-and-units",
    shortDescription: "Decompose composite measurements into parts, subtract holes, and keep units consistent.",
    longDescription: "A composite area/volume scene shows adding known parts, subtracting cutouts, and checking square units versus cubic units.",
    difficulty: "Intermediate",
    tags: ["mensuration", "composite", "decompose", "units", "area", "volume"],
    estimatedTime: "10 minutes",
    prerequisites: ["Area", "Volume", "Units", "Subtraction"],
    learningOutcomes: ["Decompose composite figures", "Subtract holes or cutouts", "Use square units for area and cubic units for volume"],
    componentKey: "CompositeSolidsAndUnitsProof",
  },
];

const conicSectionProofs: ConicSectionProofSeed[] = [
  {
    id: "circle-locus-equal-distance",
    title: "Circle as Equal Distance from Center",
    slug: "circle-locus-equal-distance",
    shortDescription: "Drag the center and radius point to see every circle point stay a fixed distance from the center.",
    longDescription: "A coordinate-grid locus model connects center C(h,k), radius r, selected point P, and (x-h)^2+(y-k)^2=r^2.",
    difficulty: "Beginner",
    tags: ["conic sections", "circle", "locus", "radius", "coordinate grid"],
    estimatedTime: "8 minutes",
    prerequisites: ["Coordinate plane", "Distance formula", "Circle"],
    learningOutcomes: ["Define a circle as a locus", "Read center-radius form", "Connect squared distance to r^2"],
    componentKey: "CircleLocusEqualDistanceProof",
  },
  {
    id: "parabola-focus-directrix",
    title: "Parabola as Focus-Directrix Locus",
    slug: "parabola-focus-directrix",
    shortDescription: "Compare distance to a focus with perpendicular distance to a directrix.",
    longDescription: "A focus-directrix guide shows why points on x^2=4py have equal distance to F(0,p) and y=-p.",
    difficulty: "Intermediate",
    tags: ["conic sections", "parabola", "focus", "directrix", "locus"],
    estimatedTime: "10 minutes",
    prerequisites: ["Coordinate plane", "Distance", "Perpendicular distance"],
    learningOutcomes: ["Use the focus-directrix definition", "Measure equal distances", "Relate geometry to x^2=4py"],
    componentKey: "ParabolaFocusDirectrixProof",
  },
  {
    id: "ellipse-sum-of-distances",
    title: "Ellipse as Constant Sum of Distances",
    slug: "ellipse-sum-of-distances",
    shortDescription: "Move a point on an ellipse and watch PF1 + PF2 stay constant.",
    longDescription: "Two foci, major/minor axes, and distance ribbons show the ellipse locus rule PF1+PF2=2a.",
    difficulty: "Intermediate",
    tags: ["conic sections", "ellipse", "foci", "distance sum", "axes"],
    estimatedTime: "10 minutes",
    prerequisites: ["Coordinate plane", "Distance formula", "Axes"],
    learningOutcomes: ["Explain the constant-sum locus", "Read a, b, and c", "Connect foci to standard form"],
    componentKey: "EllipseSumOfDistancesProof",
  },
  {
    id: "hyperbola-difference-of-distances",
    title: "Hyperbola as Constant Difference of Distances",
    slug: "hyperbola-difference-of-distances",
    shortDescription: "Move a point on a hyperbola branch and track the constant absolute distance difference.",
    longDescription: "A two-focus hyperbola model shows branches, asymptotes, and |PF1-PF2|=2a.",
    difficulty: "Advanced",
    tags: ["conic sections", "hyperbola", "foci", "distance difference", "asymptotes"],
    estimatedTime: "11 minutes",
    prerequisites: ["Coordinate plane", "Distance formula", "Asymptotes"],
    learningOutcomes: ["Explain the constant-difference locus", "Interpret both branches", "Connect asymptotes to standard form"],
    componentKey: "HyperbolaDifferenceOfDistancesProof",
  },
  {
    id: "eccentricity-classification",
    title: "Eccentricity: Circle, Ellipse, Parabola, Hyperbola",
    slug: "eccentricity-classification",
    shortDescription: "Move eccentricity e and classify the conic by its focus-directrix ratio.",
    longDescription: "A schematic classifier shows circle, ellipse, parabola, and hyperbola regimes as e changes.",
    difficulty: "Intermediate",
    tags: ["conic sections", "eccentricity", "classification", "focus-directrix", "ratio"],
    estimatedTime: "9 minutes",
    prerequisites: ["Conic definitions", "Ratios", "Coordinate graphs"],
    learningOutcomes: ["Classify conics by eccentricity", "Use e=0, 0<e<1, e=1, e>1", "Interpret eccentricity as a ratio"],
    componentKey: "EccentricityClassificationProof",
  },
  {
    id: "cone-slicing-conics",
    title: "Conic Sections from Slicing a Cone",
    slug: "cone-slicing-conics",
    shortDescription: "Change a slicing plane through a double cone and see circle, ellipse, parabola, or hyperbola.",
    longDescription: "A double-cone schematic links plane angle and position to the four classic conic-section slice types.",
    difficulty: "Beginner",
    tags: ["conic sections", "cone", "slicing", "circle", "ellipse", "parabola", "hyperbola"],
    estimatedTime: "9 minutes",
    prerequisites: ["Cone", "Plane sections", "Basic conic names"],
    learningOutcomes: ["Identify conics as cone slices", "Relate slicing angle to result", "Unify conic formulas through geometry"],
    componentKey: "ConeSlicingConicsProof",
  },
  {
    id: "parabola-reflective-property",
    title: "Tangent and Reflective Property of Parabola",
    slug: "parabola-reflective-property",
    shortDescription: "Move a point on a parabola and see parallel rays reflect through the focus.",
    longDescription: "A tangent and ray model shows why a ray parallel to the axis reflects through the parabola focus.",
    difficulty: "Advanced",
    tags: ["conic sections", "parabola", "tangent", "reflection", "focus"],
    estimatedTime: "11 minutes",
    prerequisites: ["Parabola", "Tangent line", "Reflection"],
    learningOutcomes: ["Draw tangent at P", "Trace incoming and reflected rays", "Explain the focus role in reflection"],
    componentKey: "ParabolaReflectivePropertyProof",
  },
  {
    id: "directrix-focus-standard-equations",
    title: "Directrix, Focus, and Standard Equations",
    slug: "directrix-focus-standard-equations",
    shortDescription: "Compare focus-directrix geometry with standard parabola, ellipse, and hyperbola equations.",
    longDescription: "A structured conic comparison panel connects selected conic type, focus/directrix data, parameters, signs, and standard equations.",
    difficulty: "Intermediate",
    tags: ["conic sections", "standard equations", "focus", "directrix", "eccentricity"],
    estimatedTime: "10 minutes",
    prerequisites: ["Parabola", "Ellipse", "Hyperbola", "Standard form"],
    learningOutcomes: ["Compare standard equations", "Explain plus versus minus signs", "Connect parameters to geometry"],
    componentKey: "DirectrixFocusStandardEquationsProof",
  },
];

const inequalityProofs: InequalityProofSeed[] = [
  {
    id: "inequality-number-line",
    title: "Inequality on a Number Line",
    slug: "inequality-number-line",
    shortDescription: "Drag the boundary, switch strict/inclusive operators, and watch the solution ray change.",
    longDescription: "A number-line comparison model shows how x<a, x<=a, x>a, and x>=a use direction plus open or closed boundary markers.",
    difficulty: "Beginner",
    tags: ["inequalities", "number line", "open circle", "closed circle", "interval"],
    estimatedTime: "8 minutes",
    prerequisites: ["Number line", "Order comparison", "Interval notation"],
    learningOutcomes: ["Graph simple inequalities", "Distinguish strict and inclusive boundaries", "Use test values to verify regions"],
    componentKey: "InequalityNumberLineProof",
  },
  {
    id: "solving-linear-inequalities",
    title: "Solving Linear Inequalities",
    slug: "solving-linear-inequalities",
    shortDescription: "Solve ax+b<c and see why dividing by a negative flips the inequality sign.",
    longDescription: "A balance-and-number-line guide links algebraic operations to an equivalent solution interval, highlighting the sign flip rule.",
    difficulty: "Intermediate",
    tags: ["inequalities", "linear inequality", "sign flip", "number line", "algebra"],
    estimatedTime: "10 minutes",
    prerequisites: ["Linear equations", "Order comparison", "Negative numbers"],
    learningOutcomes: ["Isolate the variable", "Explain the negative division sign flip", "Graph the final solution interval"],
    componentKey: "SolvingLinearInequalitiesProof",
  },
  {
    id: "compound-inequalities-intervals",
    title: "Compound Inequalities and Intervals",
    slug: "compound-inequalities-intervals",
    shortDescription: "Combine two inequality regions using AND as intersection and OR as union.",
    longDescription: "Two endpoints and connector controls show why compound inequalities become overlap intervals or outside unions.",
    difficulty: "Intermediate",
    tags: ["inequalities", "compound inequality", "interval", "union", "intersection"],
    estimatedTime: "9 minutes",
    prerequisites: ["Simple inequalities", "Interval notation", "Set union and intersection"],
    learningOutcomes: ["Separate AND from OR", "Write interval notation", "Check membership with a test value"],
    componentKey: "CompoundInequalitiesIntervalsProof",
  },
  {
    id: "quadratic-inequalities-graph-regions",
    title: "Quadratic Inequalities by Graph Regions",
    slug: "quadratic-inequalities-graph-regions",
    shortDescription: "Use roots and above/below x-axis regions to solve f(x)>0 or f(x)<0.",
    longDescription: "A coordinate-grid sign chart shows how a quadratic's graph splits the x-axis into positive and negative intervals.",
    difficulty: "Advanced",
    tags: ["inequalities", "quadratic", "graph", "roots", "sign chart"],
    estimatedTime: "11 minutes",
    prerequisites: ["Quadratic graphs", "Roots", "Coordinate plane"],
    learningOutcomes: ["Locate boundary roots", "Connect graph position to sign", "Choose solution intervals for f(x)>0 or f(x)<0"],
    componentKey: "QuadraticInequalitiesGraphRegionsProof",
  },
  {
    id: "am-gm-inequality",
    title: "AM-GM Inequality",
    slug: "am-gm-inequality",
    shortDescription: "Compare arithmetic mean and geometric mean for nonnegative a and b.",
    longDescription: "A length and area model shows why (a+b)/2 is at least sqrt(ab), with equality exactly at a=b.",
    difficulty: "Intermediate",
    tags: ["inequalities", "AM-GM", "area model", "mean", "equality case"],
    estimatedTime: "10 minutes",
    prerequisites: ["Square roots", "Area of rectangle", "Mean"],
    learningOutcomes: ["Compute AM and GM", "Identify the equality case", "Explain AM>=GM visually"],
    componentKey: "AmGmInequalityProof",
  },
  {
    id: "triangle-inequality",
    title: "Triangle Inequality",
    slug: "triangle-inequality",
    shortDescription: "Compare a broken path a+b with the direct side c.",
    longDescription: "A two-segment path model shows why the straight side is shorter than the broken path in a nondegenerate triangle.",
    difficulty: "Beginner",
    tags: ["inequalities", "triangle", "side lengths", "shortest path", "geometry"],
    estimatedTime: "8 minutes",
    prerequisites: ["Triangle sides", "Segment length", "Angles"],
    learningOutcomes: ["Compare broken and direct paths", "Recognize the degenerate equality limit", "State a+b>c for triangles"],
    componentKey: "TriangleInequalityProof",
  },
  {
    id: "cauchy-schwarz-dot-product-bound",
    title: "Cauchy-Schwarz Inequality: Dot Product Bound",
    slug: "cauchy-schwarz-dot-product-bound",
    shortDescription: "Drag two vectors and bound the dot product using projection and cos theta.",
    longDescription: "A vector-field model connects u dot v = |u||v|cos theta with |cos theta|<=1, proving |u dot v|<=|u||v|.",
    difficulty: "Advanced",
    tags: ["inequalities", "Cauchy-Schwarz", "dot product", "vectors", "projection"],
    estimatedTime: "12 minutes",
    prerequisites: ["Vectors", "Dot product", "Cosine"],
    learningOutcomes: ["Interpret dot product as projection", "Use the cosine bound", "Identify equality for parallel or opposite vectors"],
    componentKey: "CauchySchwarzDotProductBoundProof",
  },
  {
    id: "linear-inequality-regions",
    title: "Inequality Regions in the Coordinate Plane",
    slug: "linear-inequality-regions",
    shortDescription: "Shade the half-plane satisfying ax+by<=c and test points against the boundary.",
    longDescription: "A coordinate-grid half-plane model shows boundary style, side choice, and point testing for linear inequalities.",
    difficulty: "Intermediate",
    tags: ["inequalities", "half-plane", "coordinate grid", "test point", "linear inequality"],
    estimatedTime: "10 minutes",
    prerequisites: ["Line equations", "Coordinate plane", "Substitution"],
    learningOutcomes: ["Draw the boundary line", "Use solid versus dashed boundaries", "Choose the satisfying half-plane with a test point"],
    componentKey: "LinearInequalityRegionsProof",
  },
];

const logarithmExponentProofs: LogarithmExponentProofSeed[] = [
  {
    id: "exponents-repeated-multiplication",
    title: "Exponents as Repeated Multiplication",
    slug: "exponents-repeated-multiplication",
    shortDescription: "Build a^n as n repeated factors of the base and watch the value grow.",
    longDescription: "A factor-chain and growth-block model shows exponent meaning, including n=0 as the empty product and n=1 as the base.",
    difficulty: "Beginner",
    tags: ["exponents", "repeated multiplication", "base", "power", "growth scale"],
    estimatedTime: "8 minutes",
    prerequisites: ["Multiplication", "Factors", "Whole-number powers"],
    learningOutcomes: ["Interpret exponent as factor count", "Explain a^0=1", "Compare consecutive powers by multiplying by a"],
    componentKey: "ExponentsRepeatedMultiplicationProof",
  },
  {
    id: "laws-of-exponents-same-base",
    title: "Laws of Exponents: Same Base",
    slug: "laws-of-exponents-same-base",
    shortDescription: "Use factor chains to add, subtract, or multiply exponents in same-base expressions.",
    longDescription: "A factor-count model shows product, quotient, and power-of-a-power laws by concatenating, cancelling, and nesting repeated factors.",
    difficulty: "Intermediate",
    tags: ["exponents", "laws of exponents", "same base", "factor chains"],
    estimatedTime: "10 minutes",
    prerequisites: ["Exponent meaning", "Multiplication", "Division"],
    learningOutcomes: ["Use product rule", "Use quotient rule", "Use power-of-a-power rule"],
    componentKey: "LawsOfExponentsSameBaseProof",
  },
  {
    id: "exponential-growth-decay",
    title: "Exponential Growth and Decay",
    slug: "exponential-growth-decay",
    shortDescription: "Graph y=a*b^x and see equal x-steps multiply by the same factor.",
    longDescription: "A growth-scale graph and step markers show why exponential models multiply rather than add over equal input steps.",
    difficulty: "Intermediate",
    tags: ["exponents", "exponential growth", "decay", "multiplier", "graph"],
    estimatedTime: "10 minutes",
    prerequisites: ["Coordinate graph", "Exponents", "Ratios"],
    learningOutcomes: ["Identify initial value", "Interpret growth or decay multiplier", "Explain the constant-ratio pattern"],
    componentKey: "ExponentialGrowthDecayProof",
  },
  {
    id: "logarithm-inverse-exponential",
    title: "Logarithm as Inverse of Exponential",
    slug: "logarithm-inverse-exponential",
    shortDescription: "Reflect y=b^x across y=x to see logarithms reverse exponentiation.",
    longDescription: "An inverse-graph model maps (x,y) on an exponential curve to (y,x) on the logarithm curve, showing log_b(y)=x.",
    difficulty: "Intermediate",
    tags: ["logarithms", "inverse functions", "exponential graph", "reflection"],
    estimatedTime: "10 minutes",
    prerequisites: ["Exponential functions", "Inverse functions", "Coordinate graph"],
    learningOutcomes: ["Explain what a logarithm asks", "Map exponential and logarithmic points", "Use log_b(b^x)=x"],
    componentKey: "LogarithmInverseExponentialProof",
  },
  {
    id: "laws-of-logarithms",
    title: "Laws of Logarithms",
    slug: "laws-of-logarithms",
    shortDescription: "Derive product, quotient, and power log laws from exponent laws.",
    longDescription: "A growth-scale derivation writes M and N as powers of b, then uses exponent laws to explain logarithm laws.",
    difficulty: "Advanced",
    tags: ["logarithms", "log laws", "product law", "quotient law", "power law"],
    estimatedTime: "11 minutes",
    prerequisites: ["Exponent laws", "Logarithm definition", "Algebra"],
    learningOutcomes: ["Derive product law", "Derive quotient law", "Derive power law without misusing addition"],
    componentKey: "LawsOfLogarithmsProof",
  },
  {
    id: "change-of-base-formula",
    title: "Change of Base Formula",
    slug: "change-of-base-formula",
    shortDescription: "Convert one logarithm scale into another using a ratio of logs.",
    longDescription: "A two-scale model shows how log_b x equals log_k x divided by log_k b, preserving the same exponent answer.",
    difficulty: "Advanced",
    tags: ["logarithms", "change of base", "scale conversion", "ratio"],
    estimatedTime: "10 minutes",
    prerequisites: ["Logarithm definition", "Power law", "Ratios"],
    learningOutcomes: ["Derive change of base", "Interpret the denominator as a conversion factor", "Compute logs using another base"],
    componentKey: "ChangeOfBaseFormulaProof",
  },
  {
    id: "logarithmic-scale-orders-magnitude",
    title: "Logarithmic Scale and Orders of Magnitude",
    slug: "logarithmic-scale-orders-magnitude",
    shortDescription: "Compare linear and logarithmic scales to see equal ratios become equal distances.",
    longDescription: "Side-by-side scales show why 1 to 10 and 10 to 100 have equal spacing on a base-10 log scale.",
    difficulty: "Intermediate",
    tags: ["logarithms", "log scale", "orders of magnitude", "ratio", "base 10"],
    estimatedTime: "9 minutes",
    prerequisites: ["Powers of 10", "Ratios", "Number line"],
    learningOutcomes: ["Read log10 position", "Explain orders of magnitude", "Distinguish equal ratios from equal differences"],
    componentKey: "LogarithmicScaleOrdersMagnitudeProof",
  },
  {
    id: "natural-exponential-e",
    title: "Natural Exponential and Euler's Number e",
    slug: "natural-exponential-e",
    shortDescription: "Connect y=e^x to equal height and slope plus compound-growth approximation.",
    longDescription: "A graph-and-tangent model shows the natural exponential as the function whose slope equals its value, with (1+1/n)^n approaching e.",
    difficulty: "Advanced",
    tags: ["exponents", "natural exponential", "e", "derivative", "continuous growth"],
    estimatedTime: "11 minutes",
    prerequisites: ["Exponential graphs", "Slope", "Limits intuition"],
    learningOutcomes: ["Explain why e is natural", "Compare height and slope on e^x", "Use compound growth to approximate e"],
    componentKey: "NaturalExponentialEProof",
  },
];

const transformationSymmetryProofs: TransformationSymmetryProofSeed[] = [
  {
    id: "translation-sliding-vector",
    title: "Translation as Sliding Without Turning",
    slug: "translation-sliding-vector",
    shortDescription: "Slide a shape by vector (a,b) and see every point move the same way.",
    longDescription: "A transformation-grid model links (x,y)->(x+a,y+b) to equal movement arrows, preserved side lengths, and unchanged orientation.",
    difficulty: "Beginner",
    tags: ["transformations", "translation", "vector", "preimage", "image", "invariant"],
    estimatedTime: "8 minutes",
    prerequisites: ["Coordinate plane", "Ordered pairs", "Vectors"],
    learningOutcomes: ["Apply a translation vector", "Compare preimage and image coordinates", "Explain why translations preserve size, shape, and orientation"],
    componentKey: "TranslationSlidingVectorProof",
  },
  {
    id: "reflection-mirror-line",
    title: "Reflection as Mirror Image",
    slug: "reflection-mirror-line",
    shortDescription: "Reflect a shape across an axis and compare equal perpendicular distances.",
    longDescription: "A mirror-line model shows x-axis and y-axis reflection rules while making equal distance and orientation reversal visible.",
    difficulty: "Beginner",
    tags: ["transformations", "reflection", "mirror line", "equal distance", "orientation"],
    estimatedTime: "8 minutes",
    prerequisites: ["Coordinate plane", "Axes", "Perpendicular distance"],
    learningOutcomes: ["Use x-axis and y-axis reflection rules", "Explain equal distance from the mirror line", "Recognize that reflections reverse orientation"],
    componentKey: "ReflectionMirrorLineProof",
  },
  {
    id: "rotation-about-point",
    title: "Rotation About a Point",
    slug: "rotation-about-point",
    shortDescription: "Turn a shape around a center and watch each radius stay fixed.",
    longDescription: "A rotation-grid model shows centers, angle arcs, and preserved distances from the center for 90, 180, and 270 degree turns.",
    difficulty: "Intermediate",
    tags: ["transformations", "rotation", "center of rotation", "angle", "distance preserved"],
    estimatedTime: "10 minutes",
    prerequisites: ["Coordinate plane", "Angles", "Distance"],
    learningOutcomes: ["Identify the center and angle of rotation", "Apply common coordinate rotation rules", "Explain why rotations are rigid motions"],
    componentKey: "RotationAboutPointProof",
  },
  {
    id: "dilation-similarity-scale-factor",
    title: "Dilation and Similarity",
    slug: "dilation-similarity-scale-factor",
    shortDescription: "Scale a shape from a center and compare proportional side lengths.",
    longDescription: "A dilation model uses rays from the center and a scale factor k to show why images are similar and side lengths scale by |k|.",
    difficulty: "Intermediate",
    tags: ["transformations", "dilation", "scale factor", "similarity", "rays"],
    estimatedTime: "10 minutes",
    prerequisites: ["Coordinate plane", "Ratios", "Similar figures"],
    learningOutcomes: ["Interpret scale factor k", "Compare original and image side lengths", "Distinguish multiplying by k from adding k"],
    componentKey: "DilationSimilarityScaleFactorProof",
  },
  {
    id: "congruence-rigid-motions",
    title: "Congruence Through Rigid Motions",
    slug: "congruence-rigid-motions",
    shortDescription: "Map one figure onto another using translations, rotations, and reflections.",
    longDescription: "A sequence guide shows how rigid motions preserve side lengths and angles, proving figures are congruent even in different positions.",
    difficulty: "Intermediate",
    tags: ["transformations", "congruence", "rigid motion", "translation", "rotation", "reflection"],
    estimatedTime: "10 minutes",
    prerequisites: ["Congruent figures", "Basic transformations", "Angles"],
    learningOutcomes: ["Build a rigid-motion sequence", "Compare corresponding side lengths and angles", "Explain congruence without requiring the same starting position"],
    componentKey: "CongruenceRigidMotionsProof",
  },
  {
    id: "line-rotational-symmetry",
    title: "Line Symmetry and Rotational Symmetry",
    slug: "line-rotational-symmetry",
    shortDescription: "Test mirror lines and rotation angles that map a shape to itself.",
    longDescription: "A symmetry guide compares line-symmetry counts and rotational-symmetry orders for regular shapes and rectangles.",
    difficulty: "Beginner",
    tags: ["transformations", "symmetry", "line symmetry", "rotational symmetry", "order"],
    estimatedTime: "9 minutes",
    prerequisites: ["Reflection", "Rotation", "Regular polygons"],
    learningOutcomes: ["Count line symmetries", "Find rotational symmetry order", "Explain what maps-to-itself means"],
    componentKey: "LineRotationalSymmetryProof",
  },
  {
    id: "tessellations-repeated-transformations",
    title: "Tessellations by Repeated Transformations",
    slug: "tessellations-repeated-transformations",
    shortDescription: "Repeat tiles by transformations and test for gaps and overlaps.",
    longDescription: "A tessellation board shows translations, rotations, and reflections of basic tiles while tracking vertex-angle fit and coverage.",
    difficulty: "Intermediate",
    tags: ["transformations", "tessellation", "tiles", "no gaps", "no overlaps"],
    estimatedTime: "10 minutes",
    prerequisites: ["Polygons", "Angles", "Transformations"],
    learningOutcomes: ["Recognize repeated transformation patterns", "Check gap and overlap conditions", "Connect vertex angles to tessellations"],
    componentKey: "TessellationsRepeatedTransformationsProof",
  },
  {
    id: "transformation-matrices-2d",
    title: "Transformation Matrices in 2D",
    slug: "transformation-matrices-2d",
    shortDescription: "Use a matrix to transform basis vectors, shapes, and every point by one rule.",
    longDescription: "A 2D matrix guide shows reflection, rotation, scaling, and shear through transformed basis vectors, determinant, area scale, and orientation.",
    difficulty: "Advanced",
    tags: ["transformations", "matrix", "basis vectors", "determinant", "linear algebra"],
    estimatedTime: "12 minutes",
    prerequisites: ["Coordinate plane", "Vectors", "Basic matrices"],
    learningOutcomes: ["Read matrix columns as transformed basis vectors", "Transform a point and shape", "Interpret determinant as area scale and orientation"],
    componentKey: "TransformationMatrices2DProof",
  },
];

const engineeringMathematicsProofs: EngineeringMathematicsProofSeed[] = [
  {
    id: "first-order-differential-equation-slope-field",
    title: "First-Order Differential Equation: Slope Field",
    slug: "first-order-differential-equation-slope-field",
    shortDescription: "Read dy/dx=f(x,y) as local direction arrows and trace a solution from an initial condition.",
    longDescription: "An applied slope-field model shows local slopes, a draggable initial condition, an Euler-style solution curve, and the next-step tangent estimate.",
    difficulty: "Intermediate",
    tags: ["engineering mathematics", "differential equation", "slope field", "initial condition", "system"],
    estimatedTime: "10 minutes",
    prerequisites: ["Coordinate plane", "Slope", "Differential equations"],
    learningOutcomes: ["Interpret a direction field", "Use an initial condition", "Explain how solution curves follow local slopes"],
    componentKey: "FirstOrderDifferentialEquationSlopeFieldProof",
  },
  {
    id: "simple-harmonic-motion",
    title: "Simple Harmonic Motion",
    slug: "simple-harmonic-motion",
    shortDescription: "Connect an oscillating mass to x(t)=A cos(omega t + phi).",
    longDescription: "A mass-spring and cosine graph model links amplitude, angular frequency, phase, displacement, and period.",
    difficulty: "Intermediate",
    tags: ["engineering mathematics", "oscillation", "simple harmonic motion", "frequency", "systems"],
    estimatedTime: "10 minutes",
    prerequisites: ["Cosine graph", "Radians", "Period"],
    learningOutcomes: ["Interpret amplitude", "Relate angular frequency to period", "Explain phase shift and current displacement"],
    componentKey: "SimpleHarmonicMotionProof",
  },
  {
    id: "fourier-series-wave-building",
    title: "Fourier Series as Wave Building",
    slug: "fourier-series-wave-building",
    shortDescription: "Add harmonic waves and watch a periodic signal approximation improve.",
    longDescription: "A waveform builder shows weighted harmonics, partial sums, target comparison, and approximation error at a selected time.",
    difficulty: "Advanced",
    tags: ["engineering mathematics", "Fourier series", "harmonics", "signals", "wave"],
    estimatedTime: "12 minutes",
    prerequisites: ["Sine waves", "Periodic functions", "Summation"],
    learningOutcomes: ["Explain harmonic addition", "Compare partial sums to a target waveform", "Recognize approximation and ringing"],
    componentKey: "FourierSeriesWaveBuildingProof",
  },
  {
    id: "laplace-transform-decay-system",
    title: "Laplace Transform as Time-to-System View",
    slug: "laplace-transform-decay-system",
    shortDescription: "Transform e^(-at) into 1/(s+a) and compare time decay with s-domain expression.",
    longDescription: "A decay-system view shows how changing a affects time-domain decay and the s-domain denominator shift.",
    difficulty: "Advanced",
    tags: ["engineering mathematics", "Laplace transform", "s-domain", "decay", "systems"],
    estimatedTime: "11 minutes",
    prerequisites: ["Exponential decay", "Functions", "Systems intuition"],
    learningOutcomes: ["Interpret decay rate a", "Read L{e^(-at)}=1/(s+a)", "Explain transform as a different system viewpoint"],
    componentKey: "LaplaceTransformDecaySystemProof",
  },
  {
    id: "gradient-steepest-increase",
    title: "Gradient and Direction of Steepest Increase",
    slug: "gradient-steepest-increase",
    shortDescription: "Drag a point on contours and see grad f point uphill, perpendicular to level curves.",
    longDescription: "A contour-map model shows partial derivative components, gradient magnitude, directional derivative, and the steepest-increase direction.",
    difficulty: "Intermediate",
    tags: ["engineering mathematics", "gradient", "contour", "directional derivative", "optimization"],
    estimatedTime: "10 minutes",
    prerequisites: ["Functions of two variables", "Vectors", "Partial derivatives"],
    learningOutcomes: ["Compute gradient components", "Relate gradient to contours", "Interpret directional derivative as projection"],
    componentKey: "GradientSteepestIncreaseProof",
  },
  {
    id: "divergence-curl-vector-field",
    title: "Divergence and Curl Intuition",
    slug: "divergence-curl-vector-field",
    shortDescription: "Compare source, sink, rotation, and uniform vector fields using a local test region.",
    longDescription: "A vector-field guide contrasts divergence as spreading/inflow and curl as local spinning around a draggable test region.",
    difficulty: "Advanced",
    tags: ["engineering mathematics", "vector field", "divergence", "curl", "field"],
    estimatedTime: "12 minutes",
    prerequisites: ["Vectors", "Partial derivatives", "Vector fields"],
    learningOutcomes: ["Distinguish divergence from curl", "Identify source/sink behavior", "Identify local rotation"],
    componentKey: "DivergenceCurlVectorFieldProof",
  },
  {
    id: "trapezoidal-rule-numerical-integration",
    title: "Numerical Integration: Trapezoidal Rule",
    slug: "trapezoidal-rule-numerical-integration",
    shortDescription: "Approximate area under a curve by splitting it into trapezoids.",
    longDescription: "A numerical-integration model draws trapezoids, marks subinterval width h, and compares the approximation with a reference area.",
    difficulty: "Intermediate",
    tags: ["engineering mathematics", "numerical integration", "trapezoidal rule", "area", "approximation"],
    estimatedTime: "10 minutes",
    prerequisites: ["Graph of a function", "Area", "Definite integrals"],
    learningOutcomes: ["Compute h", "Explain why interior heights are counted twice", "Compare approximation and error"],
    componentKey: "TrapezoidalRuleNumericalIntegrationProof",
  },
  {
    id: "linear-programming-feasible-region",
    title: "Linear Programming Feasible Region",
    slug: "linear-programming-feasible-region",
    shortDescription: "Intersect half-planes and slide an objective line to find the optimum vertex.",
    longDescription: "A feasible-region model shows constraints, candidate vertices, objective values, and the bounded optimum.",
    difficulty: "Intermediate",
    tags: ["engineering mathematics", "linear programming", "feasible region", "objective function", "optimization"],
    estimatedTime: "11 minutes",
    prerequisites: ["Linear inequalities", "Coordinate plane", "Optimization"],
    learningOutcomes: ["Shade feasible regions", "Evaluate objective values at vertices", "Explain why bounded linear optima occur at vertices"],
    componentKey: "LinearProgrammingFeasibleRegionProof",
  },
];

const sequenceSeriesProofs: SequenceSeriesProofSeed[] = [
  {
    id: "arithmetic-progression-equal-steps",
    title: "Arithmetic Progression as Equal Steps",
    slug: "arithmetic-progression-equal-steps",
    shortDescription: "Place AP terms on a number line and see the constant difference.",
    longDescription: "A number-line model shows each term as one more equal jump from the previous term.",
    difficulty: "Beginner",
    tags: ["sequences", "arithmetic progression", "number line", "equal steps"],
    estimatedTime: "7 minutes",
    prerequisites: ["Number line", "Addition", "Sequences"],
    learningOutcomes: ["Identify common difference", "Use a_n=a+(n-1)d", "Visualize AP terms"],
    componentKey: "ArithmeticProgressionEqualStepsProof",
  },
  {
    id: "sum-first-n-natural-numbers",
    title: "Sum of First n Natural Numbers",
    slug: "sum-first-n-natural-numbers",
    shortDescription: "Duplicate a triangular dot pattern to make a rectangle.",
    longDescription: "The triangular arrangement of 1+2+...+n becomes half of an n by n+1 rectangle.",
    difficulty: "Beginner",
    tags: ["series", "finite sum", "natural numbers", "triangular numbers", "dots"],
    estimatedTime: "8 minutes",
    prerequisites: ["Counting", "Rectangle area"],
    learningOutcomes: ["Derive n(n+1)/2", "Relate triangles and rectangles", "Use dot patterns to prove a sum"],
    componentKey: "SumFirstNNaturalNumbersProof",
  },
  {
    id: "sum-first-n-odd-numbers",
    title: "Sum of First n Odd Numbers",
    slug: "sum-first-n-odd-numbers",
    shortDescription: "Build a square from successive odd L-shaped layers.",
    longDescription: "Each odd number adds the next layer around a square, proving the first n odd numbers sum to n^2.",
    difficulty: "Beginner",
    tags: ["series", "finite sum", "odd numbers", "square numbers", "layers"],
    estimatedTime: "8 minutes",
    prerequisites: ["Odd numbers", "Square numbers"],
    learningOutcomes: ["Prove odd-number sum identity", "Visualize square growth", "Connect odd layers to n^2"],
    componentKey: "SumFirstNOddNumbersProof",
  },
  {
    id: "sum-arithmetic-progression",
    title: "Sum of Arithmetic Progression",
    slug: "sum-arithmetic-progression",
    shortDescription: "Pair first and last terms to make equal sums.",
    longDescription: "Bars for an arithmetic progression are duplicated and reversed so every pair has the same total height.",
    difficulty: "Intermediate",
    tags: ["series", "arithmetic progression", "finite sum", "pairing"],
    estimatedTime: "9 minutes",
    prerequisites: ["Arithmetic progressions", "Finite sums"],
    learningOutcomes: ["Derive S_n=n/2(a+l)", "Use pair sums", "Connect last term to common difference"],
    componentKey: "SumArithmeticProgressionProof",
  },
  {
    id: "geometric-progression-repeated-scaling",
    title: "Geometric Progression as Repeated Scaling",
    slug: "geometric-progression-repeated-scaling",
    shortDescription: "Show each term scaling by the same ratio.",
    longDescription: "Bars grow or shrink by a fixed multiplier, making the common ratio visible.",
    difficulty: "Beginner",
    tags: ["sequences", "geometric progression", "scaling", "ratio"],
    estimatedTime: "7 minutes",
    prerequisites: ["Multiplication", "Ratios", "Sequences"],
    learningOutcomes: ["Identify common ratio", "Use a_n=ar^(n-1)", "Compare growth and decay"],
    componentKey: "GeometricProgressionScalingProof",
  },
  {
    id: "finite-geometric-series-sum",
    title: "Sum of Finite Geometric Series",
    slug: "finite-geometric-series-sum",
    shortDescription: "Use shifted series cancellation to derive the finite GP sum formula.",
    longDescription: "Geometric bars and an algebra panel show S-rS cancellation.",
    difficulty: "Intermediate",
    tags: ["series", "geometric progression", "finite sum", "cancellation"],
    estimatedTime: "10 minutes",
    prerequisites: ["Geometric progressions", "Algebraic subtraction"],
    learningOutcomes: ["Derive finite GP sum", "Explain shifted cancellation", "Calculate S_n dynamically"],
    componentKey: "FiniteGeometricSeriesSumProof",
  },
  {
    id: "infinite-geometric-series-convergence",
    title: "Infinite Geometric Series Convergence",
    slug: "infinite-geometric-series-convergence",
    shortDescription: "Fill a bounded area with shrinking geometric pieces.",
    longDescription: "A convergence meter shows partial sums approaching a/(1-r) when |r|<1.",
    difficulty: "Advanced",
    tags: ["series", "infinite series", "geometric series", "convergence"],
    estimatedTime: "10 minutes",
    prerequisites: ["Geometric series", "Limits", "Fractions"],
    learningOutcomes: ["Understand convergence for |r|<1", "Compare partial sums with the limit", "Visualize shrinking remainders"],
    componentKey: "InfiniteGeometricSeriesConvergenceProof",
  },
  {
    id: "triangular-numbers",
    title: "Triangular Numbers",
    slug: "triangular-numbers",
    shortDescription: "Arrange dots into triangular rows and duplicate them into a rectangle.",
    longDescription: "Triangular dot rows show T_n=1+2+...+n=n(n+1)/2.",
    difficulty: "Beginner",
    tags: ["sequences", "triangular numbers", "finite sum", "dots"],
    estimatedTime: "7 minutes",
    prerequisites: ["Counting", "Rows"],
    learningOutcomes: ["Build triangular numbers", "Connect T_n to natural sums", "Use duplicate rectangle proof"],
    componentKey: "TriangularNumbersProof",
  },
  {
    id: "square-numbers-odd-layers",
    title: "Square Numbers from Odd Number Layers",
    slug: "square-numbers-odd-layers",
    shortDescription: "Grow n by n squares using odd L-shaped layers.",
    longDescription: "The nth layer adds 2n-1 cells, proving square numbers accumulate odd numbers.",
    difficulty: "Beginner",
    tags: ["sequences", "square numbers", "odd numbers", "layers", "finite sum"],
    estimatedTime: "8 minutes",
    prerequisites: ["Square numbers", "Odd numbers"],
    learningOutcomes: ["Explain n^2-(n-1)^2=2n-1", "Visualize square growth", "Relate layers to sums"],
    componentKey: "SquareNumbersOddLayersProof",
  },
  {
    id: "fibonacci-sequence-tiling",
    title: "Fibonacci Sequence by Tiling",
    slug: "fibonacci-sequence-tiling",
    shortDescription: "Add Fibonacci squares where each new side uses the previous two.",
    longDescription: "A tile board shows F_n=F_(n-1)+F_(n-2) through adjacent square sizes.",
    difficulty: "Intermediate",
    tags: ["sequences", "fibonacci", "tiling", "recurrence"],
    estimatedTime: "9 minutes",
    prerequisites: ["Recurrence", "Addition", "Squares"],
    learningOutcomes: ["Build Fibonacci terms", "Interpret the recurrence visually", "Read tile side lengths"],
    componentKey: "FibonacciSequenceTilingProof",
  },
  {
    id: "fibonacci-spiral-approximation",
    title: "Fibonacci Spiral Approximation",
    slug: "fibonacci-spiral-approximation",
    shortDescription: "Draw quarter arcs inside Fibonacci squares to approximate a spiral.",
    longDescription: "Fibonacci tiling plus quarter-circle arcs shows how ratios approach the golden ratio.",
    difficulty: "Intermediate",
    tags: ["sequences", "fibonacci", "spiral", "golden ratio", "tiling"],
    estimatedTime: "9 minutes",
    prerequisites: ["Fibonacci sequence", "Quarter circles"],
    learningOutcomes: ["Build a Fibonacci spiral approximation", "Relate square sizes to Fibonacci terms", "Recognize ratio convergence"],
    componentKey: "FibonacciSpiralApproximationProof",
  },
  {
    id: "sum-of-fibonacci-numbers",
    title: "Sum of Fibonacci Numbers",
    slug: "sum-of-fibonacci-numbers",
    shortDescription: "Accumulate Fibonacci terms and compare with F_(n+2)-1.",
    longDescription: "A tile/card accumulation shows the identity F1+...+Fn=F_(n+2)-1.",
    difficulty: "Intermediate",
    tags: ["series", "fibonacci", "finite sum", "identity"],
    estimatedTime: "9 minutes",
    prerequisites: ["Fibonacci sequence", "Finite sums"],
    learningOutcomes: ["Verify Fibonacci sum identity", "Connect accumulation to later terms", "Use dynamic substitution"],
    componentKey: "SumOfFibonacciNumbersProof",
  },
  {
    id: "pascal-triangle-binomial-coefficients",
    title: "Binomial Coefficients and Pascal's Triangle",
    slug: "pascal-triangle-binomial-coefficients",
    shortDescription: "Highlight a Pascal entry and the two entries above it.",
    longDescription: "Pascal's triangle shows C(n,k)=C(n-1,k-1)+C(n-1,k) and binomial coefficients.",
    difficulty: "Intermediate",
    tags: ["sequences", "pascal triangle", "binomial coefficients", "combinations"],
    estimatedTime: "10 minutes",
    prerequisites: ["Addition", "Combinations", "Binomial expansion"],
    learningOutcomes: ["Use Pascal's rule", "Read binomial coefficients", "Connect triangle rows to expansion coefficients"],
    componentKey: "PascalTriangleBinomialCoefficientsProof",
  },
  {
    id: "visual-induction-domino-growth",
    title: "Visual Induction: Domino Growth",
    slug: "visual-induction-domino-growth",
    shortDescription: "Use falling dominoes to model base case and induction step.",
    longDescription: "A domino chain shows how P(1) and P(k)=>P(k+1) establish every case.",
    difficulty: "Beginner",
    tags: ["sequences", "induction", "proof", "dominoes", "logic"],
    estimatedTime: "8 minutes",
    prerequisites: ["Statements", "Implication"],
    learningOutcomes: ["Explain base case", "Explain induction step", "Visualize why all cases follow"],
    componentKey: "VisualInductionDominoGrowthProof",
  },
  {
    id: "harmonic-series-growth-intuition",
    title: "Harmonic Series Growth Intuition",
    slug: "harmonic-series-growth-intuition",
    shortDescription: "Group harmonic terms by powers of two to see persistent growth.",
    longDescription: "Grouped bars show that the harmonic series keeps gaining at least about one half per group.",
    difficulty: "Advanced",
    tags: ["series", "harmonic series", "divergence", "infinite series", "partial sums"],
    estimatedTime: "11 minutes",
    prerequisites: ["Fractions", "Partial sums", "Inequalities"],
    learningOutcomes: ["Explain harmonic divergence intuition", "Use power-of-two grouping", "Compare partial sums dynamically"],
    componentKey: "HarmonicSeriesGrowthIntuitionProof",
  },
];

const phaseUpgradedProofs = new Set<VisualProofComponentKey>([
  "SumFirstNNaturalNumbersProof",
  "SumFirstNOddNumbersProof",
  "ArithmeticProgressionEqualStepsProof",
  "SumArithmeticProgressionProof",
  "GeometricProgressionScalingProof",
  "FiniteGeometricSeriesSumProof",
  "InfiniteGeometricSeriesConvergenceProof",
  "TriangularNumbersProof",
  "SquareNumbersOddLayersProof",
  "FibonacciSequenceTilingProof",
  "FibonacciSpiralApproximationProof",
  "SumOfFibonacciNumbersProof",
  "PascalTriangleBinomialCoefficientsProof",
  "VisualInductionDominoGrowthProof",
  "HarmonicSeriesGrowthIntuitionProof",
  "TriangleAreaHalfRectangleProof",
  "ParallelogramAreaShearingProof",
  "SquareOfSumProof",
  "PythagoreanAreaRearrangementProof",
  "TriangleAngleSumProof",
  "ExteriorAngleTheoremProof",
  "SimilarTrianglesProof",
  "CircleCircumferenceUnwrappingProof",
  "SectorAreaFormulaProof",
  "TrapezoidAreaDuplicationProof",
  "PolygonInteriorAngleSumProof",
  "CircleAreaUnrollingProof",
  "DifferenceOfSquaresProof",
  "SquareOfDifferenceProof",
  "ProductOfBinomialsProof",
  "DistributiveLawAreaModelProof",
  "ThreeTermSquareProof",
  "CompletingTheSquareProof",
  "QuadraticFactorizationAreaModelProof",
  "PerfectSquareTrinomialRecognitionProof",
  "CubeOfSumProof",
  "CubeOfDifferenceProof",
  "SumAndDifferenceProductProof",
  "RightTriangleTrigRatiosProof",
  "UnitCircleSineCosineProof",
  "PythagoreanTrigIdentityProof",
  "TangentRatioIdentityProof",
  "RadiansArcRadiusProof",
  "ArcLengthFormulaProof",
  "TrigGraphsFromUnitCircleProof",
  "CosineAngleAdditionProof",
  "SineAngleAdditionProof",
  "DoubleAngleIdentitiesProof",
  "SineRuleProof",
  "CosineRuleProof",
  "ComplementaryAngleIdentitiesProof",
  "TriangleAreaSineFormulaProof",
  "SmallAngleApproximationProof",
  "DistanceFormulaProof",
  "MidpointFormulaProof",
  "SlopeFormulaProof",
  "SlopeInterceptLineEquationProof",
  "ParallelLinesSlopeProof",
  "PerpendicularLinesSlopeProof",
  "CircleEquationProof",
  "TranslationOfPointsProof",
  "SectionFormulaProof",
  "PointSlopeLineEquationProof",
  "TriangleAreaCoordinatesProof",
  "ReflectionAcrossAxesProof",
  "RotationAboutOriginProof",
  "ScalingDilationOriginProof",
  "CoordinateProofPythagoreanProof",
  "LimitApproachesPointProof",
  "DerivativeSlopeOfTangentProof",
  "SecantBecomesTangentProof",
  "DerivativePowerRuleProof",
  "ProductRuleVisualProof",
  "ChainRuleVisualProof",
  "RiemannSumsAreaUnderCurveProof",
  "DefiniteIntegralAccumulatedAreaProof",
  "MeanValueTheoremProof",
  "FundamentalTheoremCalculusProof",
  "IntegrationByPartsVisualProof",
  "DerivativeOfSineProof",
  "DerivativeOfExponentialProof",
  "TaylorSeriesApproximationProof",
  "OptimizationDerivativeMaxMinProof",
  "EvenOddPairingProof",
  "DivisibilityEqualGroupingProof",
  "PrimesNonRectangularArraysProof",
  "CompositesRectangularArraysProof",
  "FundamentalTheoremArithmeticProof",
  "EuclidInfinitelyManyPrimesProof",
  "GcdEuclideanAlgorithmProof",
  "LcmGridAlignmentProof",
  "ModularArithmeticClockProof",
  "RemainderPatternCyclesProof",
  "DivisibilityBy3And9Proof",
  "IrrationalitySqrt2Proof",
  "ProbabilityFavorableOverTotalProof",
  "ComplementRuleProof",
  "AdditionRuleOverlappingEventsProof",
  "MultiplicationRuleIndependentEventsProof",
  "ConditionalProbabilityProof",
  "TreeDiagramCompoundProbabilityProof",
  "ExperimentalProbabilityLawLargeNumbersProof",
  "ExpectedValueLongRunAverageProof",
  "MeanAsBalancePointProof",
  "MedianAndQuartilesProof",
  "VarianceStandardDeviationProof",
  "HistogramFrequencyDistributionProof",
  "SamplingDistributionMeanProof",
  "NormalDistributionEmpiricalRuleProof",
  "CorrelationScatterplotProof",
  "LinearRegressionLeastSquaresProof",
  "MatrixAdditionCellByCellProof",
  "MatrixMultiplicationRowColumnProof",
  "MatrixLinearTransformationGridProof",
  "DeterminantAreaScaleFactorProof",
  "LinearSystemLineIntersectionProof",
  "RowOperationsPreserveSolutionsProof",
  "EigenvectorsDirectionsDoNotTurnProof",
  "MatrixInverseUndoTransformationProof",
  "VectorAsDirectedSegmentProof",
  "VectorAdditionTipToTailProof",
  "ScalarMultiplicationVectorProof",
  "DotProductAsProjectionProof",
  "CrossProductAreaProof",
  "UnitVectorsNormalizationProof",
  "VectorEquationLineProof",
  "VectorProjectionComponentProof",
  "ComplexNumberPlanePointProof",
  "ModulusAndArgumentProof",
  "ComplexAdditionVectorProof",
  "ComplexMultiplicationRotationScalingProof",
  "MultiplicationByIRotationProof",
  "ComplexConjugateReflectionProof",
  "RootsOfUnityProof",
  "EulerFormUnitCircleProof",
  "RectangleSquareAreaProof",
  "PerimeterAndCircumferenceProof",
  "CuboidCubeSurfaceAreaProof",
  "CuboidCubeVolumeProof",
  "CylinderVolumeSurfaceAreaProof",
  "ConeVolumeSurfaceAreaProof",
  "SphereSurfaceAreaVolumeProof",
  "CompositeSolidsAndUnitsProof",
  "CircleLocusEqualDistanceProof",
  "ParabolaFocusDirectrixProof",
  "EllipseSumOfDistancesProof",
  "HyperbolaDifferenceOfDistancesProof",
  "EccentricityClassificationProof",
  "ConeSlicingConicsProof",
  "ParabolaReflectivePropertyProof",
  "DirectrixFocusStandardEquationsProof",
  "InequalityNumberLineProof",
  "SolvingLinearInequalitiesProof",
  "CompoundInequalitiesIntervalsProof",
  "QuadraticInequalitiesGraphRegionsProof",
  "AmGmInequalityProof",
  "TriangleInequalityProof",
  "CauchySchwarzDotProductBoundProof",
  "LinearInequalityRegionsProof",
  "ExponentsRepeatedMultiplicationProof",
  "LawsOfExponentsSameBaseProof",
  "ExponentialGrowthDecayProof",
  "LogarithmInverseExponentialProof",
  "LawsOfLogarithmsProof",
  "ChangeOfBaseFormulaProof",
  "LogarithmicScaleOrdersMagnitudeProof",
  "NaturalExponentialEProof",
  "TranslationSlidingVectorProof",
  "ReflectionMirrorLineProof",
  "RotationAboutPointProof",
  "DilationSimilarityScaleFactorProof",
  "CongruenceRigidMotionsProof",
  "LineRotationalSymmetryProof",
  "TessellationsRepeatedTransformationsProof",
  "TransformationMatrices2DProof",
  "FirstOrderDifferentialEquationSlopeFieldProof",
  "SimpleHarmonicMotionProof",
  "FourierSeriesWaveBuildingProof",
  "LaplaceTransformDecaySystemProof",
  "GradientSteepestIncreaseProof",
  "DivergenceCurlVectorFieldProof",
  "TrapezoidalRuleNumericalIntegrationProof",
  "LinearProgrammingFeasibleRegionProof",
]);

function getLearningModel(categorySlug: string, proof: { componentKey: VisualProofComponentKey; tags: string[] }): ProofLearningModel {
  if (
    proof.componentKey === "SumFirstNNaturalNumbersProof" ||
    proof.componentKey === "SumFirstNOddNumbersProof" ||
    proof.componentKey === "ArithmeticProgressionEqualStepsProof" ||
    proof.componentKey === "SumArithmeticProgressionProof" ||
    proof.componentKey === "GeometricProgressionScalingProof" ||
    proof.componentKey === "FiniteGeometricSeriesSumProof" ||
    proof.componentKey === "InfiniteGeometricSeriesConvergenceProof" ||
    proof.componentKey === "TriangularNumbersProof" ||
    proof.componentKey === "SquareNumbersOddLayersProof" ||
    proof.componentKey === "FibonacciSequenceTilingProof" ||
    proof.componentKey === "FibonacciSpiralApproximationProof" ||
    proof.componentKey === "SumOfFibonacciNumbersProof" ||
    proof.componentKey === "PascalTriangleBinomialCoefficientsProof" ||
    proof.componentKey === "VisualInductionDominoGrowthProof" ||
    proof.componentKey === "HarmonicSeriesGrowthIntuitionProof"
  ) return "pattern-model";
  if (proof.componentKey === "ExteriorAngleTheoremProof") return "angle-model";
  if (proof.componentKey === "SimilarTrianglesProof") return "angle-model";
  if (proof.componentKey === "SectorAreaFormulaProof") return "measurement-scene";
  if (proof.componentKey === "TrapezoidAreaDuplicationProof") return "area-rearrangement";
  if (proof.componentKey === "PolygonInteriorAngleSumProof") return "angle-model";
  if (proof.componentKey === "CircleAreaUnrollingProof") return "area-rearrangement";
  if (
    proof.componentKey === "SquareOfSumProof" ||
    proof.componentKey === "SquareOfDifferenceProof" ||
    proof.componentKey === "DifferenceOfSquaresProof" ||
    proof.componentKey === "ProductOfBinomialsProof" ||
    proof.componentKey === "DistributiveLawAreaModelProof" ||
    proof.componentKey === "ThreeTermSquareProof" ||
    proof.componentKey === "CompletingTheSquareProof" ||
    proof.componentKey === "QuadraticFactorizationAreaModelProof" ||
    proof.componentKey === "PerfectSquareTrinomialRecognitionProof" ||
    proof.componentKey === "CubeOfSumProof" ||
    proof.componentKey === "CubeOfDifferenceProof" ||
    proof.componentKey === "SumAndDifferenceProductProof"
  ) return "tile-model";
  if (proof.componentKey === "CircleCircumferenceUnwrappingProof") return "measurement-scene";
  if (proof.componentKey === "TriangleAngleSumProof") return "angle-model";
  if (proof.componentKey === "PythagoreanAreaRearrangementProof") return "area-rearrangement";
  if (proof.componentKey === "RadiansArcRadiusProof") return "measurement-scene";
  if (proof.componentKey === "ArcLengthFormulaProof") return "measurement-scene";
  if (proof.componentKey === "SmallAngleApproximationProof") return "measurement-scene";
  if (proof.componentKey === "TrigGraphsFromUnitCircleProof") return "graph-limit";
  if (
    proof.componentKey === "EvenOddPairingProof" ||
    proof.componentKey === "DivisibilityEqualGroupingProof" ||
    proof.componentKey === "PrimesNonRectangularArraysProof" ||
    proof.componentKey === "CompositesRectangularArraysProof" ||
    proof.componentKey === "FundamentalTheoremArithmeticProof" ||
    proof.componentKey === "EuclidInfinitelyManyPrimesProof" ||
    proof.componentKey === "GcdEuclideanAlgorithmProof" ||
    proof.componentKey === "LcmGridAlignmentProof" ||
    proof.componentKey === "ModularArithmeticClockProof" ||
    proof.componentKey === "RemainderPatternCyclesProof" ||
    proof.componentKey === "DivisibilityBy3And9Proof" ||
    proof.componentKey === "IrrationalitySqrt2Proof"
  ) return "number-model";
  if (
    proof.componentKey === "ProbabilityFavorableOverTotalProof" ||
    proof.componentKey === "ComplementRuleProof" ||
    proof.componentKey === "AdditionRuleOverlappingEventsProof" ||
    proof.componentKey === "MultiplicationRuleIndependentEventsProof" ||
    proof.componentKey === "ConditionalProbabilityProof" ||
    proof.componentKey === "TreeDiagramCompoundProbabilityProof" ||
    proof.componentKey === "ExperimentalProbabilityLawLargeNumbersProof" ||
    proof.componentKey === "ExpectedValueLongRunAverageProof"
  ) return "simulation-board";
  if (
    proof.componentKey === "MeanAsBalancePointProof" ||
    proof.componentKey === "MedianAndQuartilesProof" ||
    proof.componentKey === "VarianceStandardDeviationProof" ||
    proof.componentKey === "HistogramFrequencyDistributionProof" ||
    proof.componentKey === "SamplingDistributionMeanProof" ||
    proof.componentKey === "NormalDistributionEmpiricalRuleProof" ||
    proof.componentKey === "CorrelationScatterplotProof" ||
    proof.componentKey === "LinearRegressionLeastSquaresProof"
  ) return "data-display";
  if (
    proof.componentKey === "MatrixAdditionCellByCellProof" ||
    proof.componentKey === "MatrixMultiplicationRowColumnProof" ||
    proof.componentKey === "RowOperationsPreserveSolutionsProof"
  ) return "tile-model";
  if (
    proof.componentKey === "MatrixLinearTransformationGridProof" ||
    proof.componentKey === "DeterminantAreaScaleFactorProof" ||
    proof.componentKey === "EigenvectorsDirectionsDoNotTurnProof" ||
    proof.componentKey === "MatrixInverseUndoTransformationProof"
  ) return "transformation-grid";
  if (proof.componentKey === "LinearSystemLineIntersectionProof") return "coordinate-grid";
  if (
    proof.componentKey === "VectorAsDirectedSegmentProof" ||
    proof.componentKey === "VectorAdditionTipToTailProof" ||
    proof.componentKey === "ScalarMultiplicationVectorProof" ||
    proof.componentKey === "DotProductAsProjectionProof" ||
    proof.componentKey === "CrossProductAreaProof" ||
    proof.componentKey === "UnitVectorsNormalizationProof" ||
    proof.componentKey === "VectorEquationLineProof" ||
    proof.componentKey === "VectorProjectionComponentProof"
  ) return "vector-field";
  if (
    proof.componentKey === "ComplexNumberPlanePointProof" ||
    proof.componentKey === "ModulusAndArgumentProof" ||
    proof.componentKey === "ComplexAdditionVectorProof" ||
    proof.componentKey === "ComplexMultiplicationRotationScalingProof" ||
    proof.componentKey === "MultiplicationByIRotationProof" ||
    proof.componentKey === "ComplexConjugateReflectionProof" ||
    proof.componentKey === "RootsOfUnityProof" ||
    proof.componentKey === "EulerFormUnitCircleProof"
  ) return "complex-plane";
  if (
    proof.componentKey === "RectangleSquareAreaProof" ||
    proof.componentKey === "PerimeterAndCircumferenceProof" ||
    proof.componentKey === "CuboidCubeSurfaceAreaProof" ||
    proof.componentKey === "CuboidCubeVolumeProof" ||
    proof.componentKey === "CylinderVolumeSurfaceAreaProof" ||
    proof.componentKey === "ConeVolumeSurfaceAreaProof" ||
    proof.componentKey === "SphereSurfaceAreaVolumeProof" ||
    proof.componentKey === "CompositeSolidsAndUnitsProof"
  ) return "measurement-scene";
  if (proof.componentKey === "ConeSlicingConicsProof") return "measurement-scene";
  if (
    proof.componentKey === "CircleLocusEqualDistanceProof" ||
    proof.componentKey === "ParabolaFocusDirectrixProof" ||
    proof.componentKey === "EllipseSumOfDistancesProof" ||
    proof.componentKey === "HyperbolaDifferenceOfDistancesProof" ||
    proof.componentKey === "EccentricityClassificationProof" ||
    proof.componentKey === "ParabolaReflectivePropertyProof" ||
    proof.componentKey === "DirectrixFocusStandardEquationsProof"
  ) return "coordinate-grid";
  if (
    proof.componentKey === "InequalityNumberLineProof" ||
    proof.componentKey === "SolvingLinearInequalitiesProof" ||
    proof.componentKey === "CompoundInequalitiesIntervalsProof" ||
    proof.componentKey === "TriangleInequalityProof"
  ) return "comparison-model";
  if (
    proof.componentKey === "QuadraticInequalitiesGraphRegionsProof" ||
    proof.componentKey === "LinearInequalityRegionsProof"
  ) return "coordinate-grid";
  if (proof.componentKey === "AmGmInequalityProof") return "area-rearrangement";
  if (proof.componentKey === "CauchySchwarzDotProductBoundProof") return "vector-field";
  if (
    proof.componentKey === "ExponentsRepeatedMultiplicationProof" ||
    proof.componentKey === "LawsOfExponentsSameBaseProof" ||
    proof.componentKey === "ExponentialGrowthDecayProof" ||
    proof.componentKey === "LogarithmInverseExponentialProof" ||
    proof.componentKey === "LawsOfLogarithmsProof" ||
    proof.componentKey === "ChangeOfBaseFormulaProof" ||
    proof.componentKey === "LogarithmicScaleOrdersMagnitudeProof" ||
    proof.componentKey === "NaturalExponentialEProof"
  ) return "growth-scale";
  if (
    proof.componentKey === "TranslationSlidingVectorProof" ||
    proof.componentKey === "ReflectionMirrorLineProof" ||
    proof.componentKey === "RotationAboutPointProof" ||
    proof.componentKey === "DilationSimilarityScaleFactorProof" ||
    proof.componentKey === "CongruenceRigidMotionsProof" ||
    proof.componentKey === "LineRotationalSymmetryProof" ||
    proof.componentKey === "TessellationsRepeatedTransformationsProof" ||
    proof.componentKey === "TransformationMatrices2DProof"
  ) return "transformation-grid";
  if (
    proof.componentKey === "FirstOrderDifferentialEquationSlopeFieldProof" ||
    proof.componentKey === "SimpleHarmonicMotionProof" ||
    proof.componentKey === "FourierSeriesWaveBuildingProof" ||
    proof.componentKey === "LaplaceTransformDecaySystemProof" ||
    proof.componentKey === "GradientSteepestIncreaseProof" ||
    proof.componentKey === "DivergenceCurlVectorFieldProof" ||
    proof.componentKey === "TrapezoidalRuleNumericalIntegrationProof" ||
    proof.componentKey === "LinearProgrammingFeasibleRegionProof"
  ) return "applied-system";
  if (
    proof.componentKey === "LimitApproachesPointProof" ||
    proof.componentKey === "DerivativeSlopeOfTangentProof" ||
    proof.componentKey === "SecantBecomesTangentProof" ||
    proof.componentKey === "DerivativePowerRuleProof" ||
    proof.componentKey === "ProductRuleVisualProof" ||
    proof.componentKey === "ChainRuleVisualProof" ||
    proof.componentKey === "RiemannSumsAreaUnderCurveProof" ||
    proof.componentKey === "DefiniteIntegralAccumulatedAreaProof" ||
    proof.componentKey === "MeanValueTheoremProof" ||
    proof.componentKey === "FundamentalTheoremCalculusProof" ||
    proof.componentKey === "IntegrationByPartsVisualProof" ||
    proof.componentKey === "DerivativeOfSineProof" ||
    proof.componentKey === "DerivativeOfExponentialProof" ||
    proof.componentKey === "TaylorSeriesApproximationProof" ||
    proof.componentKey === "OptimizationDerivativeMaxMinProof"
  ) return "graph-limit";
  if (
    proof.componentKey === "TranslationOfPointsProof" ||
    proof.componentKey === "ReflectionAcrossAxesProof" ||
    proof.componentKey === "RotationAboutOriginProof" ||
    proof.componentKey === "ScalingDilationOriginProof"
  ) return "transformation-grid";
  if (
    proof.componentKey === "DistanceFormulaProof" ||
    proof.componentKey === "MidpointFormulaProof" ||
    proof.componentKey === "SectionFormulaProof" ||
    proof.componentKey === "SlopeFormulaProof" ||
    proof.componentKey === "SlopeInterceptLineEquationProof" ||
    proof.componentKey === "PointSlopeLineEquationProof" ||
    proof.componentKey === "ParallelLinesSlopeProof" ||
    proof.componentKey === "PerpendicularLinesSlopeProof" ||
    proof.componentKey === "TriangleAreaCoordinatesProof" ||
    proof.componentKey === "CircleEquationProof" ||
    proof.componentKey === "CoordinateProofPythagoreanProof"
  ) return "coordinate-grid";
  if (
    proof.componentKey === "RightTriangleTrigRatiosProof" ||
    proof.componentKey === "UnitCircleSineCosineProof" ||
    proof.componentKey === "PythagoreanTrigIdentityProof" ||
    proof.componentKey === "TangentRatioIdentityProof" ||
    proof.componentKey === "CosineAngleAdditionProof" ||
    proof.componentKey === "SineAngleAdditionProof" ||
    proof.componentKey === "DoubleAngleIdentitiesProof" ||
    proof.componentKey === "SineRuleProof" ||
    proof.componentKey === "CosineRuleProof" ||
    proof.componentKey === "ComplementaryAngleIdentitiesProof" ||
    proof.componentKey === "TriangleAreaSineFormulaProof"
  ) return "angle-model";
  if (proof.tags.includes("area model") || proof.tags.includes("tiles")) return "tile-model";
  if (proof.tags.some((tag) => tag.includes("angle"))) return "angle-model";
  if (proof.tags.includes("transformation")) return "transformation-grid";
  if (proof.tags.includes("limit") || proof.tags.includes("derivative") || proof.tags.includes("integral")) return "graph-limit";

  switch (categorySlug) {
    case "geometry":
      return "area-rearrangement";
    case "algebraic-identities":
      return "tile-model";
    case "trigonometry":
      return "angle-model";
    case "coordinate-geometry":
      return "coordinate-grid";
    case "calculus":
      return "graph-limit";
    case "number-theory":
      return "number-model";
    case "sequences-and-series":
      return "pattern-model";
    case "probability":
      return "simulation-board";
    case "statistics":
      return "data-display";
    case "vectors":
      return "vector-field";
    case "complex-numbers":
      return "complex-plane";
    case "mensuration":
      return "measurement-scene";
    case "inequalities":
      return "comparison-model";
    case "transformations-symmetry":
      return "transformation-grid";
    case "logarithms-exponents":
      return "growth-scale";
    case "engineering-mathematics":
      return "applied-system";
    default:
      return "applied-system";
  }
}

const visualProofExplanationContexts: Record<string, string> = {
  geometry: "The diagram keeps the geometric object visible while students compare equal angles, lengths, or areas step by step.",
  "algebraic-identities": "The tile model connects each symbolic term to a visible area region, so expansion and factoring feel concrete.",
  trigonometry: "The angle model links the formula to projections, rotations, triangle sides, or unit-circle motion instead of memorized symbols.",
  "coordinate-geometry": "The coordinate grid shows how changing points, slopes, or transformations changes the formula in real time.",
  calculus: "The graph model ties the algebraic rule to motion, slope, accumulated area, or local approximation.",
  "number-theory": "The number model uses grouping, arrays, clocks, or cycles so the divisibility pattern can be seen before it is generalized.",
  probability: "The simulation board connects the formula to repeated trials, event regions, and long-run frequency behavior.",
  statistics: "The data display makes the statistic visible as balance, spread, position, or trend rather than only a computed value.",
  "matrices-linear-algebra": "The matrix view connects entries, row-column operations, systems, and transformations to visible movement or structure.",
  vectors: "The vector field keeps direction, length, components, and projection visible while the formula updates.",
  "complex-numbers": "The complex-plane model shows modulus, argument, rotation, reflection, and scaling as movement in the plane.",
  mensuration: "The measurement scene connects surface, volume, perimeter, and unit changes to visible parts of the object.",
  "conic-sections": "The locus view keeps distances, focus, directrix, and eccentricity visible while the curve is formed.",
  inequalities: "The comparison model shows which side, interval, or region remains valid as the boundary changes.",
  "logarithms-exponents": "The growth-scale view links repeated multiplication, inverse growth, and logarithmic measurement to visible change.",
  "transformations-symmetry": "The transformation grid makes invariant distances, angles, orientation, and repeated motion easy to compare.",
  "engineering-mathematics": "The applied model ties each formula to a system, signal, field, constraint, or numerical method used in engineering.",
  "sequences-and-series": "The pattern model shows how each term, partial sum, or recursive rule grows from the previous structure.",
};

function stabilizeVisualProofLongDescription(proof: VisualProof, phaseUpgraded: boolean) {
  if (!phaseUpgraded || proof.longDescription.trim().length >= 110) {
    return proof.longDescription;
  }

  const context =
    visualProofExplanationContexts[proof.categorySlug] ??
    "The visual model keeps the mathematical objects visible while students connect the formula to the reason it works.";

  return `${proof.longDescription} ${context}`;
}

function withUpgradeMetadata(proof: VisualProof): VisualProof {
  const phaseUpgraded = phaseUpgradedProofs.has(proof.componentKey);
  return {
    ...proof,
    longDescription: stabilizeVisualProofLongDescription(proof, phaseUpgraded),
    proofLearningModel: getLearningModel(proof.categorySlug, proof),
    proofUpgradeStatus: phaseUpgraded ? "phase-upgraded" : "legacy",
    misconceptionCheckCount: phaseUpgraded ? 1 : 0,
    hasTeacherMode: phaseUpgraded,
    hasKeyboardControls: phaseUpgraded,
    hasStateInspector: phaseUpgraded,
    hasOlympyardPracticeExit: phaseUpgraded,
    hasVisualRegressionTest: false,
    hasFormulaTokens: phaseUpgraded,
    hasPredictionPrompt: phaseUpgraded,
    hasSnapshotSupport: phaseUpgraded,
    expectedVisualKind: phaseUpgraded ? "svg" : undefined,
    expectedPrimarySelector: phaseUpgraded ? '[data-testid="visual-proof-primary-visual"] svg' : undefined,
    expectedMinimumVisualElements: phaseUpgraded ? 3 : undefined,
    expectedInteractiveControls: phaseUpgraded ? ["previous", "next", "reset", "labels", "formula", "reveal", "challenge", "teacher"] : undefined,
  };
}

const geometryAvailableProofs: VisualProof[] = geometryProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "geometry",
  level: "School to Engineering Foundation",
  route: `/visual-proofs/geometry/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const algebraAvailableProofs: VisualProof[] = algebraProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "algebraic-identities",
  level: "School to Foundation Algebra",
  route: `/visual-proofs/algebraic-identities/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const trigonometryAvailableProofs: VisualProof[] = trigonometryProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "trigonometry",
  level: "High School to Engineering Foundation",
  route: `/visual-proofs/trigonometry/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const coordinateAvailableProofs: VisualProof[] = coordinateProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "coordinate-geometry",
  level: "High School to Engineering Foundation",
  route: `/visual-proofs/coordinate-geometry/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const calculusAvailableProofs: VisualProof[] = calculusProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "calculus",
  level: "High School to Engineering Mathematics",
  route: `/visual-proofs/calculus/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const numberTheoryAvailableProofs: VisualProof[] = numberTheoryProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "number-theory",
  level: "Middle School to Olympiad Foundation",
  route: `/visual-proofs/number-theory/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const probabilityAvailableProofs: VisualProof[] = probabilityProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "probability",
  level: "School to Engineering Probability Foundation",
  route: `/visual-proofs/probability/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const statisticsAvailableProofs: VisualProof[] = statisticsProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "statistics",
  level: "School to Engineering Statistics Foundation",
  route: `/visual-proofs/statistics/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const matrixLinearAlgebraAvailableProofs: VisualProof[] = matrixLinearAlgebraProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "matrices-linear-algebra",
  level: "High School to Engineering Linear Algebra",
  route: `/visual-proofs/matrices-linear-algebra/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const vectorAvailableProofs: VisualProof[] = vectorProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "vectors",
  level: "High School Physics to Engineering Vectors",
  route: `/visual-proofs/vectors/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const complexNumberAvailableProofs: VisualProof[] = complexNumberProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "complex-numbers",
  level: "Senior School to Engineering Complex Analysis Foundations",
  route: `/visual-proofs/complex-numbers/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const mensurationAvailableProofs: VisualProof[] = mensurationProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "mensuration",
  level: "School to Competitive Exam Mensuration",
  route: `/visual-proofs/mensuration/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const conicSectionAvailableProofs: VisualProof[] = conicSectionProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "conic-sections",
  level: "Senior School to Engineering Analytic Geometry",
  route: `/visual-proofs/conic-sections/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const inequalityAvailableProofs: VisualProof[] = inequalityProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "inequalities",
  level: "Olympiad and Engineering Inequality Foundations",
  route: `/visual-proofs/inequalities/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const logarithmExponentAvailableProofs: VisualProof[] = logarithmExponentProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "logarithms-exponents",
  level: "High School to Engineering Precalculus Foundations",
  route: `/visual-proofs/logarithms-exponents/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const transformationSymmetryAvailableProofs: VisualProof[] = transformationSymmetryProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "transformations-symmetry",
  level: "School to Design and Engineering Transformations",
  route: `/visual-proofs/transformations-symmetry/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const engineeringMathematicsAvailableProofs: VisualProof[] = engineeringMathematicsProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "engineering-mathematics",
  level: "Engineering Mathematics Applied Systems",
  route: `/visual-proofs/engineering-mathematics/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const sequenceSeriesAvailableProofs: VisualProof[] = sequenceSeriesProofs.map((proof): VisualProof => ({
  ...proof,
  categorySlug: "sequences-and-series",
  level: "High School to Engineering Mathematics",
  route: `/visual-proofs/sequences-and-series/${proof.slug}`,
  status: "available",
  thumbnailKey: proof.componentKey,
})).map(withUpgradeMetadata);

const comingSoonProofs: VisualProof[] = visualProofCategories
  .filter((category) => !["geometry", "algebraic-identities", "trigonometry", "coordinate-geometry", "calculus", "number-theory", "probability", "statistics", "matrices-linear-algebra", "vectors", "complex-numbers", "mensuration", "conic-sections", "inequalities", "logarithms-exponents", "transformations-symmetry", "engineering-mathematics", "sequences-and-series"].includes(category.slug))
  .map((category): VisualProof => ({
    id: `${category.slug}-starter-proof`,
    title: `${category.title} Starter Visual Proof`,
    slug: "starter-visual-proof",
    categorySlug: category.slug,
    shortDescription: `A scalable placeholder for the first ${category.title.toLowerCase()} interactive proof.`,
    longDescription:
      "This proof slot is reserved for the next expansion phase. It already participates in routing, listing, metadata, and graceful coming-soon rendering.",
    difficulty: "Intermediate",
    level: category.targetAudience,
    tags: [category.slug, "visual proof", "coming soon"],
    estimatedTime: "Coming soon",
    prerequisites: ["Core definitions"],
    learningOutcomes: ["Preview the module structure", "Prepare a dedicated visual proof route"],
    route: `/visual-proofs/${category.slug}/starter-visual-proof`,
    status: "coming-soon",
    componentKey: "ComingSoonProof",
  })).map(withUpgradeMetadata);

export const visualProofsIndex: VisualProof[] = [
  ...geometryAvailableProofs,
  ...algebraAvailableProofs,
  ...trigonometryAvailableProofs,
  ...coordinateAvailableProofs,
  ...calculusAvailableProofs,
  ...numberTheoryAvailableProofs,
  ...probabilityAvailableProofs,
  ...statisticsAvailableProofs,
  ...matrixLinearAlgebraAvailableProofs,
  ...vectorAvailableProofs,
  ...complexNumberAvailableProofs,
  ...mensurationAvailableProofs,
  ...conicSectionAvailableProofs,
  ...inequalityAvailableProofs,
  ...logarithmExponentAvailableProofs,
  ...transformationSymmetryAvailableProofs,
  ...engineeringMathematicsAvailableProofs,
  ...sequenceSeriesAvailableProofs,
  ...comingSoonProofs,
];

export const featuredVisualProofs = visualProofsIndex.filter((proof) => proof.status === "available").slice(0, 6);

export function getVisualProof(categorySlug: string, proofSlug: string) {
  return visualProofsIndex.find((proof) => proof.categorySlug === categorySlug && proof.slug === proofSlug);
}

export function getVisualProofsByCategory(categorySlug: string) {
  return visualProofsIndex.filter((proof) => proof.categorySlug === categorySlug);
}

export function getAdjacentVisualProofs(proofId: string) {
  const proofIndex = visualProofsIndex.findIndex((proof) => proof.id === proofId);
  return {
    previous: proofIndex > 0 ? visualProofsIndex[proofIndex - 1] : undefined,
    next: proofIndex >= 0 && proofIndex < visualProofsIndex.length - 1 ? visualProofsIndex[proofIndex + 1] : undefined,
  };
}
