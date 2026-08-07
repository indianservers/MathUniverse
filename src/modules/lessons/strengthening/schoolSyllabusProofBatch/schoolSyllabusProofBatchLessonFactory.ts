import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type SchoolSyllabusProofChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

export type SchoolSyllabusProofSeed = {
  id: number;
  title: string;
  route: string;
  topic: string;
  academicLevel: string;
  lessonType: StrengthenedLesson["lessonType"];
  definition: string;
  action: string;
  reason: string;
  representation: StrengthenedLesson["representations"][number]["type"];
  misconception: [string, string, string];
  examples: [string, string][];
  prompt: string;
  expected: string;
  formula: {
    label: string;
    expression: string;
    exactness: StrengthenedLesson["formulas"][number]["exactness"];
  };
  expertReviewRequired: boolean;
};

type SchoolSyllabusProofSource = { title: string; route: string; topic: string; academicLevel: string };

const sources: Record<number, SchoolSyllabusProofSource> = {
  10054: { title: "Euclid's Five Postulates", route: "/lessons/school/class-9/class-9-euclidean-geometry-euclid-s-five-postulates", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10055: { title: "Equivalent Forms of the Fifth Postulate", route: "/lessons/school/class-9/class-9-euclidean-geometry-equivalent-forms-of-the-fifth-postulate", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10056: { title: "Axiom versus Theorem", route: "/lessons/school/class-9/class-9-euclidean-geometry-axiom-versus-theorem", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10057: { title: "Proof Structure and Logical Statements", route: "/lessons/school/class-9/class-9-euclidean-geometry-proof-structure-and-logical-statements", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10058: { title: "Vertically Opposite Angles", route: "/lessons/school/class-9/class-9-euclidean-geometry-vertically-opposite-angles", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10059: { title: "Linear Pair Axiom and Converse", route: "/lessons/school/class-9/class-9-euclidean-geometry-linear-pair-axiom-and-converse", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10060: { title: "Corresponding Angles", route: "/lessons/school/class-9/class-9-euclidean-geometry-corresponding-angles", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10061: { title: "Alternate Interior Angles", route: "/lessons/school/class-9/class-9-euclidean-geometry-alternate-interior-angles", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10062: { title: "Interior Angles on the Same Side", route: "/lessons/school/class-9/class-9-euclidean-geometry-interior-angles-on-the-same-side", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10063: { title: "Parallel Line Converse Theorems", route: "/lessons/school/class-9/class-9-euclidean-geometry-parallel-line-converse-theorems", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10064: { title: "Triangle Angle Sum Theorem", route: "/lessons/school/class-9/class-9-euclidean-geometry-triangle-angle-sum-theorem", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10065: { title: "Exterior Angle Theorem", route: "/lessons/school/class-9/class-9-euclidean-geometry-exterior-angle-theorem", topic: "Euclidean Geometry", academicLevel: "CLASS_9" },
  10066: { title: "SAS Congruence", route: "/lessons/school/class-9/class-9-triangle-proofs-sas-congruence", topic: "Triangle Proofs", academicLevel: "CLASS_9" },
  10067: { title: "ASA Congruence", route: "/lessons/school/class-9/class-9-triangle-proofs-asa-congruence", topic: "Triangle Proofs", academicLevel: "CLASS_9" },
  10068: { title: "AAS Congruence", route: "/lessons/school/class-9/class-9-triangle-proofs-aas-congruence", topic: "Triangle Proofs", academicLevel: "CLASS_9" },
  10069: { title: "SSS Congruence", route: "/lessons/school/class-9/class-9-triangle-proofs-sss-congruence", topic: "Triangle Proofs", academicLevel: "CLASS_9" },
  10070: { title: "RHS Congruence", route: "/lessons/school/class-9/class-9-triangle-proofs-rhs-congruence", topic: "Triangle Proofs", academicLevel: "CLASS_9" },
  10071: { title: "Equal Sides and Equal Angles", route: "/lessons/school/class-9/class-9-triangle-proofs-equal-sides-and-equal-angles", topic: "Triangle Proofs", academicLevel: "CLASS_9" },
  10072: { title: "Triangle Inequality", route: "/lessons/school/class-9/class-9-triangle-proofs-triangle-inequality", topic: "Triangle Proofs", academicLevel: "CLASS_9" },
  10073: { title: "Parallelogram Opposite Sides", route: "/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-opposite-sides", topic: "Quadrilateral Proofs", academicLevel: "CLASS_9" },
  10074: { title: "Parallelogram Opposite Angles", route: "/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-opposite-angles", topic: "Quadrilateral Proofs", academicLevel: "CLASS_9" },
  10075: { title: "Parallelogram Diagonals", route: "/lessons/school/class-9/class-9-quadrilateral-proofs-parallelogram-diagonals", topic: "Quadrilateral Proofs", academicLevel: "CLASS_9" },
  10076: { title: "Conditions for a Quadrilateral to Be a Parallelogram", route: "/lessons/school/class-9/class-9-quadrilateral-proofs-conditions-for-a-quadrilateral-to-be-a-parallelogram", topic: "Quadrilateral Proofs", academicLevel: "CLASS_9" },
  10077: { title: "Midpoint Theorem", route: "/lessons/school/class-9/class-9-quadrilateral-proofs-midpoint-theorem", topic: "Quadrilateral Proofs", academicLevel: "CLASS_9" },
  10078: { title: "Converse of Midpoint Theorem", route: "/lessons/school/class-9/class-9-quadrilateral-proofs-converse-of-midpoint-theorem", topic: "Quadrilateral Proofs", academicLevel: "CLASS_9" },
  10079: { title: "Heron's Formula Derivation", route: "/lessons/school/class-9/class-9-mensuration-heron-s-formula-derivation", topic: "Mensuration", academicLevel: "CLASS_9" },
  10080: { title: "Semi-Perimeter Lab", route: "/lessons/school/class-9/class-9-mensuration-semi-perimeter-lab", topic: "Mensuration", academicLevel: "CLASS_9" },
  10081: { title: "Coordinate Area versus Heron's Formula", route: "/lessons/school/class-9/class-9-mensuration-coordinate-area-versus-heron-s-formula", topic: "Mensuration", academicLevel: "CLASS_9" },
  10082: { title: "Combined Solids", route: "/lessons/school/class-9/class-9-mensuration-combined-solids", topic: "Mensuration", academicLevel: "CLASS_9" },
  10083: { title: "Distance Formula", route: "/lessons/school/class-10/class-10-coordinate-geometry-distance-formula", topic: "Coordinate Geometry", academicLevel: "CLASS_10" },
  10084: { title: "Midpoint Formula", route: "/lessons/school/class-10/class-10-coordinate-geometry-midpoint-formula", topic: "Coordinate Geometry", academicLevel: "CLASS_10" },
  10085: { title: "Internal Section Formula", route: "/lessons/school/class-10/class-10-coordinate-geometry-internal-section-formula", topic: "Coordinate Geometry", academicLevel: "CLASS_10" },
  10086: { title: "External Section Formula", route: "/lessons/school/class-10/class-10-coordinate-geometry-external-section-formula", topic: "Coordinate Geometry", academicLevel: "CLASS_10" },
  10087: { title: "Area of Triangle Using Coordinates", route: "/lessons/school/class-10/class-10-coordinate-geometry-area-of-triangle-using-coordinates", topic: "Coordinate Geometry", academicLevel: "CLASS_10" },
  10088: { title: "Collinearity Using Coordinate Area", route: "/lessons/school/class-10/class-10-coordinate-geometry-collinearity-using-coordinate-area", topic: "Coordinate Geometry", academicLevel: "CLASS_10" },
  10089: { title: "Equal Chords and Equal Angles", route: "/lessons/school/class-10/class-10-circle-proofs-equal-chords-and-equal-angles", topic: "Circle Proofs", academicLevel: "CLASS_10" },
  10090: { title: "Perpendicular from Centre to Chord", route: "/lessons/school/class-10/class-10-circle-proofs-perpendicular-from-centre-to-chord", topic: "Circle Proofs", academicLevel: "CLASS_10" },
  10091: { title: "Angle Subtended by an Arc", route: "/lessons/school/class-10/class-10-circle-proofs-angle-subtended-by-an-arc", topic: "Circle Proofs", academicLevel: "CLASS_10" },
  10092: { title: "Angle in a Semicircle", route: "/lessons/school/class-10/class-10-circle-proofs-angle-in-a-semicircle", topic: "Circle Proofs", academicLevel: "CLASS_10" },
  10093: { title: "Angles in the Same Segment", route: "/lessons/school/class-10/class-10-circle-proofs-angles-in-the-same-segment", topic: "Circle Proofs", academicLevel: "CLASS_10" },
  10094: { title: "Cyclic Quadrilateral", route: "/lessons/school/class-10/class-10-circle-proofs-cyclic-quadrilateral", topic: "Circle Proofs", academicLevel: "CLASS_10" },
  10095: { title: "Opposite Angles of a Cyclic Quadrilateral", route: "/lessons/school/class-10/class-10-circle-proofs-opposite-angles-of-a-cyclic-quadrilateral", topic: "Circle Proofs", academicLevel: "CLASS_10" },
  10096: { title: "Tangent Perpendicular to Radius", route: "/lessons/school/class-10/class-10-circle-proofs-tangent-perpendicular-to-radius", topic: "Circle Proofs", academicLevel: "CLASS_10" },
  10097: { title: "Tangent Lengths from an External Point", route: "/lessons/school/class-10/class-10-circle-proofs-tangent-lengths-from-an-external-point", topic: "Circle Proofs", academicLevel: "CLASS_10" },
  10098: { title: "Angle of Elevation", route: "/lessons/school/class-10/class-10-trigonometry-applications-angle-of-elevation", topic: "Trigonometry Applications", academicLevel: "CLASS_10" },
  10099: { title: "Angle of Depression", route: "/lessons/school/class-10/class-10-trigonometry-applications-angle-of-depression", topic: "Trigonometry Applications", academicLevel: "CLASS_10" },
  10100: { title: "Shadow-Length Modelling", route: "/lessons/school/class-10/class-10-trigonometry-applications-shadow-length-modelling", topic: "Trigonometry Applications", academicLevel: "CLASS_10" },
  10101: { title: "Two-Observer Height Problems", route: "/lessons/school/class-10/class-10-trigonometry-applications-two-observer-height-problems", topic: "Trigonometry Applications", academicLevel: "CLASS_10" },
  10102: { title: "Grouped Mean by Direct Method", route: "/lessons/school/class-10/class-10-statistics-grouped-mean-by-direct-method", topic: "Statistics", academicLevel: "CLASS_10" },
  10103: { title: "Grouped Mean by Assumed Mean", route: "/lessons/school/class-10/class-10-statistics-grouped-mean-by-assumed-mean", topic: "Statistics", academicLevel: "CLASS_10" },
};

type Specifics = Pick<
  SchoolSyllabusProofSeed,
  "definition" | "action" | "reason" | "representation" | "misconception" | "examples" | "prompt" | "expected" | "formula" | "lessonType"
>;

const specifics: Record<number, Specifics> = {
  10054: proof("Euclid's five postulates are accepted starting rules about drawing lines, extending lines, circles, right angles, and parallel lines.", "Read each postulate, identify what it allows, then use it only as an accepted starting statement.", "A proof system needs starting rules before later theorems can be proved.", "Trying to prove Euclid's postulates inside Euclidean geometry.", "A postulate is accepted as a starting rule in that system.", "Which postulate draws a straight line through two points?", "first postulate", "Euclid postulates", "accepted starting statements for Euclidean geometry"),
  10055: proof("Equivalent forms of the fifth postulate are statements with the same logical force as the Euclidean parallel postulate.", "Compare both statements, then check whether each one can imply the other.", "Equivalent statements are interchangeable because each can be proved from the other.", "Thinking two statements are equivalent just because they sound similar.", "Equivalent means each statement logically implies the other.", "What does equivalent mean for two postulate forms?", "each implies the other", "Equivalence", "A implies B and B implies A"),
  10056: proof("An axiom is accepted without proof, while a theorem is proved from accepted facts.", "Classify the statement, list accepted facts, then decide whether proof is required.", "Logical systems need axioms as starting points and theorems as proved results.", "Calling every true statement a theorem.", "A theorem must be proved from definitions, axioms, or earlier theorems.", "Does a theorem need proof?", "yes", "Proof system", "axioms and definitions imply theorems", "text_table"),
  10057: proof("A proof is a chain of logical statements where each important step has a valid reason.", "Write the given facts, state each claim, add a reason, and finish with the required conclusion.", "Valid rules preserve truth from one step to the next.", "Writing proof steps without reasons.", "Every important proof step needs a definition, axiom, theorem, or given fact.", "What must each key proof step include?", "reason", "Proof chain", "given facts plus valid reasons lead to conclusion"),
  10058: proof("Vertically opposite angles are opposite angles made by two intersecting lines, and they are equal.", "Find the intersecting lines, form two linear pairs, then subtract from 180 degrees.", "Both angles are supplements of the same angle, so they are equal.", "Thinking adjacent angles are vertically opposite.", "Vertically opposite angles face each other across the intersection.", "If one angle is 65 degrees, what is its vertically opposite angle?", "65", "Vertically opposite angles", "opposite angles at intersecting lines are equal"),
  10059: proof("A linear pair has adjacent angles whose non-common arms form a straight line, so their sum is 180 degrees.", "Check adjacency and straight arms, add the angles, then use the converse when the sum is 180 degrees.", "A straight angle measures 180 degrees, so adjacent parts on it add to 180 degrees.", "Using the converse without checking adjacent angles.", "The angles must be adjacent and sum to 180 degrees.", "Angles 110 and 70 degrees form a linear pair. What is their sum?", "180", "Linear pair", "adjacent angles on a straight line sum to 180 degrees"),
  10060: proof("Corresponding angles occupy matching positions when a transversal cuts two lines.", "Find the transversal, match the same corner position, then compare the angles.", "For parallel lines, a transversal makes equal corresponding angles because the line directions match.", "Pairing angles that are not in matching positions.", "Corresponding angles sit in the same relative corner at each crossing.", "For parallel lines, are corresponding angles equal?", "yes", "Corresponding angles", "parallel lines give equal corresponding angles"),
  10061: proof("Alternate interior angles lie inside two lines on opposite sides of a transversal.", "Find the interior region, choose opposite sides of the transversal, then compare the pair.", "When the lines are parallel, the same direction change makes alternate interior angles equal.", "Choosing an outside angle by mistake.", "Alternate interior angles must both lie between the two lines.", "For parallel lines, are alternate interior angles equal?", "yes", "Alternate interior angles", "parallel lines give equal alternate interior angles"),
  10062: proof("Same-side interior angles lie between two lines on the same side of a transversal.", "Find both interior angles on one side, then add their measures.", "For parallel lines, these angles form a pair whose measures add to a straight angle.", "Thinking same-side interior angles are equal.", "They are supplementary, so they sum to 180 degrees.", "For parallel lines, what is their sum?", "180", "Same-side interior", "same-side interior angles sum to 180 degrees"),
  10063: proof("Parallel line converse theorems use angle facts to prove that two lines are parallel.", "Check the angle relation, match it to the correct converse, then conclude the lines are parallel.", "A converse reverses a known parallel-line theorem under stated conditions.", "Using a theorem when the proof needs its reverse statement.", "A converse starts with angle information and concludes parallel lines.", "If corresponding angles are equal, what can we conclude?", "parallel", "Parallel converse", "equal corresponding angles imply parallel lines"),
  10064: proof("The three interior angles of any Euclidean triangle sum to 180 degrees.", "Draw a line through one vertex parallel to the opposite side, then use alternate interior angles and a straight angle.", "Parallel-line angle facts place the three triangle angles on one straight line.", "Thinking the theorem works only for the drawn triangle.", "The proof uses any triangle, so the result is general.", "Two triangle angles are 50 and 60 degrees. What is the third?", "70", "Triangle angle sum", "A+B+C=180 degrees"),
  10065: proof("A triangle exterior angle equals the sum of the two opposite interior angles.", "Extend one side, use the linear pair, then replace the third interior angle using the triangle angle sum.", "The exterior angle and nearby interior angle form 180 degrees, matching the remaining two angles.", "Adding the adjacent interior angle instead of the two opposite angles.", "Use the two remote interior angles, not the adjacent one.", "Remote interior angles are 40 and 75 degrees. What is the exterior angle?", "115", "Exterior angle", "exterior angle = sum of two remote interior angles"),
  10066: proof("SAS congruence says two triangles are congruent when two sides and the included angle are equal.", "Match two side pairs, check the angle between them, then conclude corresponding parts are equal.", "The included angle fixes how the two equal sides open, so the triangle shape is forced.", "Using an angle that is not between the two given sides.", "SAS needs the included angle between the two sides.", "What does the A in SAS need to be?", "included angle", "SAS", "two sides and included angle prove congruence"),
  10067: proof("ASA congruence says two triangles are congruent when two angles and the included side are equal.", "Match two angle pairs, check the side between them, then name the congruent triangles in order.", "Two angles fix the directions, and the included side fixes the size.", "Using a side that is not between the two angles.", "ASA uses the included side between the equal angles.", "In ASA, where is the known side?", "between the angles", "ASA", "two angles and included side prove congruence"),
  10068: proof("AAS congruence says two triangles are congruent when two angles and a non-included corresponding side are equal.", "Match two angle pairs and one corresponding side, then use angle sum if the third angle is needed.", "Two equal angles force the third angle equal, reducing the case to ASA.", "Ignoring whether the given side corresponds correctly.", "The side must match the same position in both triangles.", "Why does AAS work?", "third angle becomes equal", "AAS", "two angles and a corresponding side prove congruence"),
  10069: proof("SSS congruence says two triangles are congruent when all three pairs of corresponding sides are equal.", "Match the three side pairs, keep the order correct, then conclude congruence.", "Three fixed side lengths force one triangle shape in Euclidean geometry.", "Thinking an angle must also be given for SSS.", "Three corresponding equal sides are enough.", "How many side pairs are needed for SSS?", "3", "SSS", "three equal side pairs prove congruence"),
  10070: proof("RHS congruence applies to right triangles with equal hypotenuse and one equal corresponding side.", "Check both right angles, match hypotenuses, match one side, then conclude congruence.", "A right angle and hypotenuse-side data fix the remaining side by the Pythagorean relation.", "Using RHS on triangles that are not right triangles.", "RHS only works for right triangles.", "What kind of triangles use RHS?", "right triangles", "RHS", "right angle, hypotenuse, and side prove congruence"),
  10071: proof("In a triangle, equal sides have equal opposite angles, and equal angles have equal opposite sides.", "Identify the equal sides or angles, then match the opposite parts across the triangle.", "Symmetry in the triangle makes the opposite parts correspond exactly.", "Matching an angle beside a side instead of opposite it.", "Use the angle or side directly opposite the equal part.", "If AB = AC, which angles are equal?", "angle B and angle C", "Isosceles triangle fact", "equal sides have equal opposite angles"),
  10072: proof("The triangle inequality says the sum of any two side lengths of a triangle is greater than the third side.", "Add each pair of side lengths and compare it with the remaining side.", "A direct path between two points is shorter than any broken path through a third point.", "Checking only one pair of sides.", "All three pair sums must be greater than the remaining side.", "Can sides 2, 3, and 6 form a triangle?", "no", "Triangle inequality", "a+b>c, b+c>a, c+a>b"),
  10073: proof("In a parallelogram, both pairs of opposite sides are equal.", "Draw a diagonal, use parallel-line angles, prove two triangles congruent, then match sides.", "The diagonal creates congruent triangles because opposite sides are parallel.", "Thinking the fact needs right angles.", "Every parallelogram has equal opposite sides, even without right angles.", "In parallelogram ABCD, which side equals AB?", "CD", "Parallelogram sides", "opposite sides of a parallelogram are equal"),
  10074: proof("In a parallelogram, opposite angles are equal.", "Use a diagonal or parallel-line angle facts, then match the opposite angles.", "Parallel opposite sides create equal alternate interior angle pairs.", "Thinking adjacent angles are equal in every parallelogram.", "Adjacent angles are supplementary; opposite angles are equal.", "In a parallelogram, which angles are equal?", "opposite angles", "Parallelogram angles", "opposite angles of a parallelogram are equal"),
  10075: proof("The diagonals of a parallelogram bisect each other.", "Draw both diagonals, prove the small triangles congruent, then match the diagonal parts.", "Parallel sides give equal angle pairs, so the crossing point is the midpoint of both diagonals.", "Thinking parallelogram diagonals are always equal.", "They bisect each other; they are not always equal.", "What do parallelogram diagonals do to each other?", "bisect each other", "Parallelogram diagonals", "diagonals bisect each other"),
  10076: proof("A quadrilateral is a parallelogram when a valid converse condition proves both opposite sides are parallel.", "Check one accepted condition, such as diagonals bisecting each other, then conclude parallelogram.", "Each condition forces the two pairs of opposite sides to behave like parallel sides.", "Using an unrelated equal side or angle to prove parallelogram.", "Use a known sufficient condition, not just any matching measurement.", "If diagonals bisect each other, what is proved?", "parallelogram", "Parallelogram condition", "diagonals bisect each other implies parallelogram"),
  10077: proof("The segment joining midpoints of two sides of a triangle is parallel to the third side and half its length.", "Mark the two midpoints, join them, then use similarity or parallelogram reasoning.", "Halving two sides in the same triangle creates a smaller similar triangle.", "Remembering parallel but forgetting half the third side.", "The midpoint segment is parallel to the third side and equals half of it.", "If the third side is 12 cm, what is the midpoint segment length?", "6", "Midpoint theorem", "midpoint segment is parallel to third side and half its length"),
  10078: proof("The converse says a line through the midpoint of one triangle side and parallel to another side bisects the third side.", "Identify the midpoint, check the parallel line, then conclude the other side is bisected.", "Parallel lines create matching triangles, so the proportional split becomes equal halves.", "Assuming bisection without proving the line is parallel.", "The converse needs a midpoint and a parallel line.", "What two facts are needed for the converse?", "midpoint and parallel line", "Midpoint converse", "midpoint plus parallel line implies other side is bisected"),
  10079: procedure("Heron's formula finds the area of a triangle from its three side lengths.", "Find the semi-perimeter s, then compute the square root of s(s-a)(s-b)(s-c).", "The formula follows from altitude-area relations and algebra using side lengths.", "Using the full perimeter where semi-perimeter is needed.", "Use s = (a+b+c)/2 before applying Heron's formula.", "For sides 3, 4, 5, what is s?", "6", "Heron formula", "Area = sqrt(s(s-a)(s-b)(s-c))", "symbolic_steps"),
  10080: procedure("The semi-perimeter of a triangle is half the sum of its three side lengths.", "Add the three sides, divide by 2, then use s in formulas such as Heron's formula.", "Half the perimeter gives a compact value used in triangle area relations.", "Using the perimeter as s.", "Semi-perimeter means half the perimeter.", "Sides are 5, 6, and 7. What is s?", "9", "Semi-perimeter", "s = (a+b+c)/2", "symbolic_steps"),
  10081: procedure("Coordinate area and Heron's formula are two exact ways to find a triangle's area.", "Use coordinates directly, or find side lengths first and then use Heron's formula.", "Both methods measure the same region, so correct exact work gives the same area.", "Mixing coordinate values into Heron's formula without side lengths.", "Heron's formula needs side lengths; coordinate area uses vertex coordinates.", "Which method uses vertex coordinates directly?", "coordinate area", "Coordinate area", "Area = |x1(y2-y3)+x2(y3-y1)+x3(y1-y2)|/2", "coordinate_graph"),
  10082: modelling("A combined solid is made by joining or removing simple solids such as cubes, cylinders, cones, or hemispheres.", "Split the shape into simple solids, find each needed area or volume, then add or subtract correctly.", "Area and volume are additive when pieces do not overlap in the counted region.", "Counting a joined face as exposed surface area.", "Do not include faces hidden inside a joined solid.", "When two cubes are joined face to face, is the common face exposed?", "no", "Additive volume", "total volume = sum of non-overlapping parts", "geometric_construction"),
  10083: procedure("The distance formula gives the length between two points in the coordinate plane.", "Subtract coordinates, square both differences, add them, and take the square root.", "The horizontal and vertical differences form a right triangle, so the Pythagorean theorem gives the distance.", "Forgetting the square root after adding squared differences.", "Distance is the square root of the sum of squares.", "Find the distance between (0,0) and (3,4).", "5", "Distance formula", "d = sqrt((x2-x1)^2 + (y2-y1)^2)", "coordinate_graph"),
  10084: procedure("The midpoint formula gives the point halfway between two coordinate points.", "Average the x-coordinates and average the y-coordinates.", "A midpoint is equally far from both endpoints along each coordinate direction.", "Adding coordinates but forgetting to divide by 2.", "A midpoint uses the average of the endpoint coordinates.", "Find the midpoint of (2,4) and (6,8).", "(4,6)", "Midpoint formula", "M = ((x1+x2)/2, (y1+y2)/2)", "coordinate_graph"),
  10085: procedure("The internal section formula finds a point that divides a segment between two endpoints in a given ratio.", "Multiply each endpoint coordinate by the opposite ratio part, add, then divide by the total ratio.", "Weighted averages place the point inside the segment at the required ratio.", "Using the same endpoint's ratio part instead of the opposite part.", "In internal division, each endpoint is weighted by the other ratio part.", "A point divides A to B in ratio 1:1. What formula does this become?", "midpoint", "Internal section", "P=((mx2+nx1)/(m+n),(my2+ny1)/(m+n))", "coordinate_graph"),
  10086: procedure("The external section formula finds a point outside a segment that divides the line externally in a given ratio.", "Use weighted coordinate differences, then divide by the difference of the ratio parts.", "External division places the point beyond an endpoint while preserving the directed ratio.", "Using the internal formula for an outside division point.", "External division uses differences and needs unequal ratio parts.", "Can external division use equal ratio parts in the usual formula?", "no", "External section", "P=((mx2-nx1)/(m-n),(my2-ny1)/(m-n))", "coordinate_graph"),
  10087: procedure("The coordinate area formula gives a triangle's area from its three vertex coordinates.", "Substitute coordinates in order, compute the signed sum, take absolute value, then divide by 2.", "The formula adds and subtracts rectangle-like parts around the triangle.", "Keeping a negative area after substitution.", "Area is non-negative, so take the absolute value.", "What is the area if the formula gives -18 before halving?", "9", "Coordinate triangle area", "Area = |x1(y2-y3)+x2(y3-y1)+x3(y1-y2)|/2", "coordinate_graph"),
  10088: procedure("Three points are collinear when they lie on one straight line, which makes triangle area zero.", "Use the coordinate area formula; if the area is zero, the three points are collinear.", "A straight-line set of three points encloses no triangular region.", "Thinking collinearity means all points are the same point.", "Different points can be collinear if they lie on one line.", "What area shows three points are collinear?", "0", "Collinearity test", "Area of triangle = 0", "coordinate_graph"),
  10089: proof("Equal chords of a circle subtend equal angles at the centre, and equal central angles subtend equal chords.", "Join chord endpoints to the centre, prove the radii triangles congruent, then match angles or chords.", "All radii of the same circle are equal, so congruent triangles connect chord length and central angle.", "Comparing chords from different circles without extra facts.", "The theorem applies to chords in the same circle or congruent circles.", "Equal chords in the same circle subtend what central angles?", "equal", "Equal chords", "equal chords subtend equal angles at centre"),
  10090: proof("The perpendicular from the centre of a circle to a chord bisects the chord.", "Join the centre to the chord endpoints, use equal radii, then prove the two right triangles congruent.", "Equal radii and a shared perpendicular create congruent right triangles.", "Thinking any line from the centre bisects a chord.", "The line must be perpendicular to the chord.", "What does the centre perpendicular do to a chord?", "bisects it", "Centre to chord", "perpendicular from centre to chord bisects chord"),
  10091: proof("An arc subtends an angle at a point when lines from the arc endpoints meet at that point.", "Identify the arc endpoints, draw the two joining segments, then read the angle they form.", "The angle depends on how the endpoints are seen from the chosen point.", "Calling the curved arc itself the angle.", "The angle is formed by two straight segments from the arc endpoints.", "What forms the angle subtended by an arc?", "segments from arc endpoints", "Arc angle", "arc endpoints joined to a point form an angle"),
  10092: proof("The angle in a semicircle is a right angle.", "Use the diameter as the hypotenuse and join the point on the circle to both endpoints.", "The diameter subtends 180 degrees at the centre, so the angle at the circle is half of it.", "Using a chord that is not a diameter.", "The theorem needs the side across the semicircle to be a diameter.", "What is the angle in a semicircle?", "90", "Semicircle angle", "angle in a semicircle = 90 degrees"),
  10093: proof("Angles in the same segment of a circle are equal.", "Check that both angles stand on the same chord and their vertices lie on the same arc segment.", "Both angles are half of the same central angle subtended by the chord.", "Using angles standing on different chords.", "The angles must stand on the same chord in the same segment.", "Angles in the same segment are what?", "equal", "Same segment angles", "angles in the same segment are equal"),
  10094: proof("A cyclic quadrilateral has all four vertices on one circle.", "Check that each vertex lies on the circle, then use circle angle facts for its angles.", "Points on the same circle share angle relationships made by common arcs and chords.", "Thinking any round-looking quadrilateral is cyclic.", "All four vertices must lie on one circle.", "How many vertices lie on one circle?", "4", "Cyclic quadrilateral", "four vertices lie on one circle"),
  10095: proof("Opposite angles of a cyclic quadrilateral sum to 180 degrees.", "Identify the opposite angle pair, then use the arcs around the circle to show they are supplementary.", "Together the opposite angles stand on arcs that complete the full circle.", "Thinking opposite cyclic angles are equal.", "They are supplementary, so their sum is 180 degrees.", "One angle is 110 degrees. What is its opposite angle?", "70", "Cyclic opposite angles", "opposite angles sum to 180 degrees"),
  10096: proof("A tangent to a circle is perpendicular to the radius at the point of contact.", "Mark the contact point, draw the radius to it, then use the closest-distance idea.", "The tangent touches at one point, so the radius to that closest point meets it at 90 degrees.", "Drawing the radius to a different point on the tangent.", "Use the radius to the exact point of contact.", "What angle does a tangent make with the radius at contact?", "90", "Tangent-radius", "tangent is perpendicular to radius at contact"),
  10097: proof("Tangent segments drawn from the same external point to a circle are equal.", "Join the external point and centre, draw radii to contact points, then prove right triangles congruent.", "Both radii are perpendicular to tangents and share the same hypotenuse from centre to external point.", "Using a line that cuts the circle as a tangent.", "A tangent touches the circle at exactly one point.", "Tangents from one external point are what in length?", "equal", "Tangent lengths", "tangent segments from same external point are equal"),
  10098: procedure("An angle of elevation is the angle made when looking upward from a horizontal line.", "Draw the horizontal line, draw the upward line of sight, then form a right triangle.", "The angle measures how steeply the line of sight rises above eye level.", "Measuring the angle from the vertical line.", "Angle of elevation is measured from the horizontal line upward.", "From which line is angle of elevation measured?", "horizontal", "Elevation", "tan(theta)=opposite/adjacent", "coordinate_graph"),
  10099: procedure("An angle of depression is the angle made when looking downward from a horizontal line.", "Draw a horizontal line from the observer, draw the downward line of sight, then build a right triangle.", "It measures how steeply the sight line falls below eye level.", "Measuring from the ground instead of the observer's horizontal line.", "Angle of depression is measured from the observer's horizontal line downward.", "From which line is angle of depression measured?", "horizontal", "Depression", "angle of depression equals corresponding angle of elevation", "coordinate_graph"),
  10100: modelling("Shadow-length modelling uses a right triangle formed by object height, shadow length, and sunlight.", "Draw the height and shadow, mark the sun angle, then use tan(theta)=height/shadow.", "The vertical object and horizontal ground form a right triangle with the light ray.", "Putting shadow length over height for tangent.", "For the sun angle at the ground, tan(theta)=height/shadow.", "If tan(theta)=height/shadow, what is height?", "shadow x tan(theta)", "Shadow model", "height = shadow length x tan(theta)", "coordinate_graph"),
  10101: modelling("Two-observer height problems use two sight lines to find a height or distance.", "Draw both right triangles, assign unknown distances, write two trigonometric equations, then solve together.", "Two observations give enough information to connect height and horizontal distances.", "Using only one observer when two equations are needed.", "Use both observers to form linked right-triangle equations.", "Why are two observations useful?", "two equations", "Two-observer model", "tan(theta)=height/distance for each observer", "coordinate_graph"),
  10102: procedure("The direct method finds grouped mean by multiplying each class mark by its frequency.", "Find class marks, multiply by frequencies, add all products, then divide by total frequency.", "A grouped mean is a weighted average where frequency tells how many values each class represents.", "Averaging class marks without using frequencies.", "Use frequencies as weights for class marks.", "What is divided by total frequency in the direct method?", "sum of f x x", "Grouped mean", "mean = sum(fx)/sum(f)", "table"),
  10103: procedure("The assumed mean method finds grouped mean using deviations from a chosen central value.", "Choose assumed mean A, find d=x-A, compute fd, add fd, then use A + sum(fd)/sum(f).", "It simplifies arithmetic because deviations are smaller than the original class marks.", "Computing only sum(fd)/sum(f) and stopping.", "Add the correction to the assumed mean A.", "What must you add after finding sum(fd)/sum(f)?", "assumed mean", "Assumed mean", "mean = A + sum(fd)/sum(f)", "table"),
};

const expertReviewIds = new Set([10054, 10055, 10056, 10057, 10063, 10064, 10065, 10066, 10067, 10068, 10069, 10070, 10071, 10072, 10073, 10074, 10075, 10076, 10077, 10078, 10089, 10090, 10091, 10092, 10093, 10094, 10095, 10096, 10097]);

export function schoolSyllabusProofSeed(id: number): SchoolSyllabusProofSeed {
  const source = sources[id];
  const detail = specifics[id];
  if (!source || !detail) throw new Error(`Missing school syllabus proof lesson seed for ${id}`);
  return {
    id,
    title: source.title,
    route: source.route,
    topic: source.topic,
    academicLevel: source.academicLevel,
    expertReviewRequired: expertReviewIds.has(id),
    ...detail,
  };
}

export function schoolSyllabusProofLesson(seed: SchoolSyllabusProofSeed): StrengthenedLesson {
  const slug = seed.route.split("/").pop() ?? String(seed.id);
  const code = seed.misconception[0];
  return {
    id: seed.id,
    title: seed.title,
    route: seed.route,
    category: "School Syllabus",
    topic: seed.topic,
    academicLevel: seed.academicLevel,
    lessonType: seed.lessonType,
    learningObjectives: [`Define ${seed.title} correctly.`, seed.action, `Avoid this mistake: ${seed.misconception[1]}`],
    prerequisites: prerequisitesFor(seed.topic),
    keyVocabulary: [{ term: seed.title, meaning: seed.definition }, vocabularyFor(seed.topic)],
    introduction: `${seed.title} is a school mathematics idea in ${seed.topic}. It helps students solve drawings, measurements, data tables, and proof questions. The idea also appears in maps, buildings, designs, and daily comparisons.`,
    basicIdea: `${seed.definition} The basic idea is to identify the exact condition first. ${seed.reason} A common mistake is ${seed.misconception[1]}`,
    howItWorks: `${seed.action} Then check that the result matches the condition in the question.`,
    whyItWorks: whyFor(seed.topic),
    definitions: [{ id: `${slug}-definition`, statement: seed.definition }],
    facts: [{ id: `${slug}-fact`, statement: seed.reason }],
    formulas: [formula(seed.formula.label, seed.formula.expression, seed.formula.exactness)],
    conditionsAndRestrictions: restrictionsFor(seed.topic),
    representations: [{ id: `${slug}-representation`, type: seed.representation, learningPurpose: `Show the exact structure of ${seed.title}.` }],
    workedExamples: [{ id: `${slug}-worked-1`, prompt: seed.prompt, steps: ["Read the given information.", seed.action, "Check the answer against the lesson condition."], answer: seed.expected }],
    realLifeExamples: seed.examples.length >= 3 ? seed.examples.map(realExample(slug)) : examplesFor(seed.topic, slug),
    misconceptions: [{ code, mistake: seed.misconception[1], correction: seed.misconception[2] }],
    interaction: {
      id: `${slug}-interaction`,
      learningPurpose: `Explore ${seed.title} with a linked school-style diagram, table, or model.`,
      parameters: [{ id: "value", label: "Value", validRange: [1, 30] }],
      initialState: `Start with the worked example for ${seed.title}.`,
      dynamicFeedback: "Changing one input updates the diagram, table, formula, or proof check.",
      successCriteria: ["Use the exact condition", "Read the representation", "Explain the common mistake"],
      accessibilityAlternative: "Provide the same steps and result as labelled text.",
    },
    guidedExploration: [{ id: "predict", prompt: "Predict the result before changing the model." }, { id: "test", prompt: "Change one input and read the new result." }, { id: "explain", prompt: "Explain why the rule still works." }],
    practice: [
      practice(`${slug}-recognition`, `What is ${seed.title}?`, seed.definition, code, "recognition"),
      practice(`${slug}-direct`, seed.prompt, seed.expected, code, "direct"),
      practice(`${slug}-multi`, `How do you use ${seed.title}?`, seed.action, code, "multi_step"),
      practice(`${slug}-error`, `What is wrong with this mistake: ${seed.misconception[1]}`, seed.misconception[2], code, "error_diagnosis"),
      practice(`${slug}-transfer`, `Give one daily use of ${seed.title}.`, examplesFor(seed.topic, slug)[0].context, code, "transfer"),
    ],
    challenge: { id: `${slug}-challenge`, prompt: seed.prompt, successCriteria: ["Uses the exact rule", "Checks conditions", "Avoids the named mistake"], hints: [`Use the rule for ${seed.title}.`, seed.misconception[2]] },
    exitCheck: [{ id: `${slug}-exit`, prompt: `State one rule for ${seed.title}.`, answer: seed.misconception[2], criterion: "Answer names a correct rule or condition." }],
    accessibilityNotes: ["Announce values, labels, and construction or proof steps as text.", "Do not rely only on colour."],
    expertReviewRequired: seed.expertReviewRequired,
    reviewReason: seed.expertReviewRequired ? "This theorem or proof-heavy school lesson needs expert review." : undefined,
  };
}

export function schoolSyllabusProofChallenge(seed: SchoolSyllabusProofSeed): SchoolSyllabusProofChallenge {
  return {
    prompt: seed.prompt,
    expected: seed.expected,
    hint: `Use the rule for ${seed.title}.`,
    kind: Number.isFinite(Number(seed.expected)) ? "numeric" : "keywords",
    factoryId: `school.proof.${seed.id}`,
  };
}

function proof(definition: string, action: string, reason: string, mistake: string, correction: string, prompt: string, expected: string, label: string, expression: string, representation: SchoolSyllabusProofSeed["representation"] = "proof_diagram"): Specifics {
  return base("proof", definition, action, reason, mistake, correction, prompt, expected, label, expression, representation, "theorem");
}

function procedure(definition: string, action: string, reason: string, mistake: string, correction: string, prompt: string, expected: string, label: string, expression: string, representation: SchoolSyllabusProofSeed["representation"]): Specifics {
  return base("procedure", definition, action, reason, mistake, correction, prompt, expected, label, expression, representation, "definition");
}

function modelling(definition: string, action: string, reason: string, mistake: string, correction: string, prompt: string, expected: string, label: string, expression: string, representation: SchoolSyllabusProofSeed["representation"]): Specifics {
  return base("modelling", definition, action, reason, mistake, correction, prompt, expected, label, expression, representation, "definition");
}

function base(lessonType: SchoolSyllabusProofSeed["lessonType"], definition: string, action: string, reason: string, mistake: string, correction: string, prompt: string, expected: string, label: string, expression: string, representation: SchoolSyllabusProofSeed["representation"], exactness: SchoolSyllabusProofSeed["formula"]["exactness"]): Specifics {
  return {
    lessonType,
    definition,
    action,
    reason,
    representation,
    misconception: [label.toUpperCase().replace(/[^A-Z0-9]+/g, "_"), mistake, correction],
    examples: [],
    prompt,
    expected,
    formula: { label, expression, exactness },
  };
}

function formula(label: string, expression: string, exactness: StrengthenedLesson["formulas"][number]["exactness"]): StrengthenedLesson["formulas"][number] {
  return { id: `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-formula`, label, expression, variables: [{ symbol: "given values", meaning: "the values named in the lesson question" }], exactness };
}

function realExample(slug: string) {
  return ([context, connection]: [string, string], index: number) => ({ id: `${slug}-real-${index + 1}`, context, connection });
}

function examplesFor(topic: string, slug: string) {
  const examples: [string, string][] = /Circle/.test(topic)
    ? [["Wheel design", "Circle facts explain radii, chords, and tangents."], ["Clock face", "Angles and arcs can be compared."], ["Round table plan", "Points on a circle create useful shapes."]]
    : /Coordinate/.test(topic)
      ? [["Map reading", "Coordinates locate points and distances."], ["Screen graphics", "Points and segments are measured by coordinates."], ["Route planning", "Midpoints and distances guide locations."]]
      : /Statistics/.test(topic)
        ? [["Class marks", "Grouped data can give a useful average."], ["Shop bills", "Many values can be summarised in a table."], ["Sports scores", "Frequencies show repeated results."]]
        : /Trigonometry/.test(topic)
          ? [["Tree height", "A right triangle can estimate height."], ["Building view", "Sight angles connect distance and height."], ["Shadow measurement", "Sun angle and shadow length form a model."]]
          : [["Building design", "Exact geometry keeps shapes stable."], ["Map drawing", "Lines and angles guide locations."], ["Craft work", "Proof facts help make matching parts."]];
  return examples.map(realExample(slug));
}

function vocabularyFor(topic: string) {
  if (/Circle/.test(topic)) return { term: "Circle", meaning: "All points at a fixed distance from a centre." };
  if (/Coordinate/.test(topic)) return { term: "Coordinate", meaning: "A number pair that gives a point's position." };
  if (/Statistics/.test(topic)) return { term: "Frequency", meaning: "How many times a value or class occurs." };
  if (/Trigonometry/.test(topic)) return { term: "Line of sight", meaning: "The straight line from the observer to the object." };
  return { term: "Theorem", meaning: "A statement proved from accepted facts." };
}

function prerequisitesFor(topic: string) {
  if (/Coordinate/.test(topic)) return ["Ordered pairs", "Squares and square roots", "Plotting points"];
  if (/Statistics/.test(topic)) return ["Tables", "Frequency", "Arithmetic mean"];
  if (/Trigonometry/.test(topic)) return ["Right triangles", "Tangent ratio", "Horizontal and vertical lines"];
  if (/Mensuration/.test(topic)) return ["Area", "Perimeter", "Square roots"];
  return ["Points and lines", "Angles", "Basic proof reasons"];
}

function restrictionsFor(topic: string) {
  if (/Coordinate/.test(topic)) return ["Keep x- and y-coordinates in order.", "Use absolute value for area."];
  if (/Statistics/.test(topic)) return ["Use class marks for grouped data.", "Use frequencies as weights."];
  if (/Trigonometry/.test(topic)) return ["Measure sight angles from the horizontal.", "Draw a right triangle before choosing a ratio."];
  if (/Circle/.test(topic)) return ["Use the same circle unless a congruent circle is stated.", "Mark tangent contact points exactly."];
  return ["Do not assume the diagram is exact unless the facts are given.", "Give a reason for each proof step."];
}

function whyFor(topic: string) {
  if (/Coordinate/.test(topic)) return "Coordinate geometry works because horizontal and vertical changes measure positions exactly on perpendicular axes.";
  if (/Statistics/.test(topic)) return "Statistics works because frequencies show how many data values each class represents.";
  if (/Trigonometry/.test(topic)) return "Trigonometry works because similar right triangles keep the same side ratios for the same angle.";
  if (/Circle/.test(topic)) return "Circle facts work because radii, chords, arcs, and tangents have fixed relationships from the centre.";
  return "Geometry proof works because accepted facts force exact relationships between lines, angles, and shapes.";
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Read the condition.", "Choose the matching rule.", "Check the final answer."], workedSolution: ["Identify the given information.", "Apply the lesson rule.", "Check the answer in context."], misconceptionTag, difficulty, parameterConstraints: ["Use school-level whole numbers, simple diagrams, or exact algebraic values."] };
}
