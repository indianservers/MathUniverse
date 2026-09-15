import type { StrengthenedLesson, WorkedExample } from "./strengthenedLessonSchema";

type HandOverlay = {
  introduction: string;
  definition: string;
  basicIdea: string;
  howItWorks: string;
  whyItWorks: string;
  worked: Array<Pick<WorkedExample, "prompt" | "steps" | "answer">>;
};

const overlays: Record<number, HandOverlay> = {
  231: {
    introduction: "Area works this concrete case: Find triangle area with base 6 and height 4. The labelled answer is 12. Measure regions. Calculates polygon, circle and conic areas. A common labelled error is adding side lengths when area is needed. Area keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Area measures the amount of flat region inside a shape. In Area, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Area works this concrete case: Find triangle area with base 6 and height 4.",
    howItWorks: "Identify the region. Choose a valid formula for the shape. Use perpendicular height when needed.",
    whyItWorks: "Area counts how many unit squares cover a flat region.",
    worked: [
      { prompt: "Find triangle area with base 6 and height 4.", steps: ["Use A=1/2 bh.", "A=1/2*6*4.", "Area is 12."], answer: "12" },
      { prompt: "Find the labelled area for base 10 and height 5.", steps: ["Use the Area formula.", "10 and 5 are the measured sides.", "The value is 50."], answer: "50" },
      { prompt: "If the height doubles from 5 to 10, what happens to this area model?", steps: ["Area scales with perpendicular height.", "New height 10.", "It doubles."], answer: "doubles" }
    ],
  },
  232: {
    introduction: "Angle works this concrete case: How many degrees are in a right angle? The labelled answer is 90. Measure angular relationships. Measures angles between points, lines or vectors. A common labelled error is thinking longer rays make a bigger angle. Angle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An angle measures the amount of turn between two rays with a common endpoint. In Angle, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Angle works this concrete case: How many degrees are in a right angle?",
    howItWorks: "Identify the vertex. Identify the two rays. Measure the turn from one ray to the other.",
    whyItWorks: "Angle measure quantifies rotation, not side length.",
    worked: [
      { prompt: "How many degrees are in a right angle?", steps: ["A right angle is a quarter turn.", "A full turn is 360 degrees.", "A quarter is 90 degrees."], answer: "90" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 30° and 60°. What is the sum?", steps: ["30+60.", "90.", "90."], answer: "90" }
    ],
  },
  233: {
    introduction: "Fixed Angle works this concrete case: If a fixed angle is 60 degrees, what is its measure after dragging? The labelled answer is 60. Construct exact rotations. Creates a ray at a specified angle. A common labelled error is letting the angle size change while dragging. Fixed Angle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A fixed angle construction keeps a chosen angle measure constant while points move. In Fixed Angle, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Fixed Angle works this concrete case: If a fixed angle is 60 degrees, what is its measure after dragging?",
    howItWorks: "Choose a vertex and starting ray. Set the angle measure. Construct the second ray at that fixed turn.",
    whyItWorks: "The construction constrains the ray direction by the chosen angle measure.",
    worked: [
      { prompt: "If a fixed angle is 60 degrees, what is its measure after dragging?", steps: ["Fixed means constant.", "Dragging should not change the measure.", "It remains 60 degrees."], answer: "60" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 40° and 70°. What is the sum?", steps: ["40+70.", "110.", "110."], answer: "110" }
    ],
  },
  234: {
    introduction: "Relation Checker works this concrete case: What should perpendicular lines measure? The labelled answer is 90. Verify geometric relationships. Tests equality, incidence, parallelism and perpendicularity. A common labelled error is judging a relation only by eye. Relation Checker keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A relation checker tests whether objects satisfy a geometric relationship. In Relation Checker, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Relation Checker works this concrete case: What should perpendicular lines measure?",
    howItWorks: "Choose the objects. Select the relation to test. Read true, false, or the measured relation.",
    whyItWorks: "Exact geometric relationships can be checked from definitions and measurements.",
    worked: [
      { prompt: "What should perpendicular lines measure?", steps: ["Perpendicular means meeting at a right angle.", "A right angle is 90 degrees.", "They measure 90 degrees."], answer: "90" },
      { prompt: "In Relation Checker, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Relation Checker rule.", "The first stored value is 10.", "10."], answer: "10" },
      { prompt: "Compare the Relation Checker outputs at 5 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "2."], answer: "2" }
    ],
  },
  235: {
    introduction: "Construction Steps works this concrete case: Can a perpendicular bisector be built before its segment? The labelled answer is no. Understand dependency order. Replays a construction one step at a time. A common labelled error is doing construction steps in any order. Construction Steps keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Construction steps are the ordered actions used to build a geometric object exactly. In Construction Steps, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Construction Steps works this concrete case: Can a perpendicular bisector be built before its segment?",
    howItWorks: "List the goal. Build required points and lines first. Use each result in the next step. Check the final object.",
    whyItWorks: "Geometric constructions depend on previously defined objects.",
    worked: [
      { prompt: "Can a perpendicular bisector be built before its segment?", steps: ["It depends on the segment.", "The segment must exist first.", "So no."], answer: "no" },
      { prompt: "In Construction Steps, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Construction Steps rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Construction Steps outputs at 6 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "3."], answer: "3" }
    ],
  },
  236: {
    introduction: "Translation by Vector works this concrete case: Translate (2,3) by (4,-1). The labelled answer is (6,2). Move objects rigidly. Creates translated images using a selected vector. A common labelled error is moving only one vertex of a shape. Translation by Vector keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Translation by vector moves every point the same distance in the same direction. In Translation by Vector, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Translation by Vector works this concrete case: Translate (2,3) by (4,-1).",
    howItWorks: "Read the vector components. Add them to each point's coordinates. Connect image points in the same order.",
    whyItWorks: "Adding the same vector preserves distances, angles, and orientation.",
    worked: [
      { prompt: "Translate (2,3) by (4,-1).", steps: ["Add x-components: 2+4=6.", "Add y-components: 3-1=2.", "The image is (6"], answer: "(6,2)" },
      { prompt: "Translate ( 7, 4 ) by vector <9, 1>.", steps: ["Add the vector.", "(16, 5).", "(16, 5)."], answer: "(16, 5)" },
      { prompt: "Rotate ( 7, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 7).", "(0, 7)."], answer: "(0, 7)" }
    ],
  },
  237: {
    introduction: "Reflection in Line works this concrete case: What is special about the mirror line for P and P'? The labelled answer is perpendicular bisector. Understand mirror symmetry. Reflects objects across a line. A common labelled error is sliding the shape instead of flipping it. Reflection in Line keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Reflection in a line flips each point across a mirror line. In Reflection in Line, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Reflection in Line works this concrete case: What is special about the mirror line for P and P'?",
    howItWorks: "Choose the mirror line. Drop a perpendicular from the point to the line. Place the image the same distance on the other side.",
    whyItWorks: "Equal perpendicular distances create a mirror image that preserves size.",
    worked: [
      { prompt: "What is special about the mirror line for P and P'?", steps: ["P and P' are matching points.", "The mirror line meets PP' at 90 degrees.", "It bisects PP'."], answer: "perpendicular bisector" },
      { prompt: "Translate ( 8, 5 ) by vector <10, 1>.", steps: ["Add the vector.", "(18, 6).", "(18, 6)."], answer: "(18, 6)" },
      { prompt: "Rotate ( 8, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 8).", "(0, 8)."], answer: "(0, 8)" }
    ],
  },
  238: {
    introduction: "Reflection in Point works this concrete case: If C is midpoint of PP', what transformation is shown? The labelled answer is point reflection. Understand central symmetry. Performs a half-turn about a point. A common labelled error is putting the image on the line but not equally far. Reflection in Point keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Reflection in a point sends each point through a centre to an image the same distance away. In Reflection in Point, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Reflection in Point works this concrete case: If C is midpoint of PP', what transformation is shown?",
    howItWorks: "Draw a line from the point through the centre. Continue the same distance beyond the centre to place the image.",
    whyItWorks: "A half-turn around the centre preserves distance and reverses direction.",
    worked: [
      { prompt: "If C is midpoint of PP', what transformation is shown?", steps: ["P and P' are opposite through C.", "C is exactly halfway.", "This is point reflection."], answer: "point reflection" },
      { prompt: "Translate ( 9, 6 ) by vector <4, 1>.", steps: ["Add the vector.", "(13, 7).", "(13, 7)."], answer: "(13, 7)" },
      { prompt: "Rotate ( 9, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 9).", "(0, 9)."], answer: "(0, 9)" }
    ],
  },
  239: {
    introduction: "Reflection in Circle works this concrete case: If r=6 and OP=3, find OP'. The labelled answer is 12. Explore inversion. Maps points and objects through circle inversion. A common labelled error is treating circle reflection like a line mirror. Reflection in Circle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Reflection in a circle, also called inversion, maps a point so the product of distances from the centre equals the radius squared.",
    basicIdea: "Reflection in Circle works this concrete case: If r=6 and OP=3, find OP'.",
    howItWorks: "Use the ray from the centre through the point. Place the image on that ray so OP times OP' equals r squared.",
    whyItWorks: "The inverse distance rule swaps inside and outside positions while keeping the circle fixed.",
    worked: [
      { prompt: "If r=6 and OP=3, find OP'.", steps: ["Use OP*OP'=r^2.", "3*OP'=36.", "OP'=12."], answer: "12" },
      { prompt: "Translate ( 10, 7 ) by vector <5, 1>.", steps: ["Add the vector.", "(15, 8).", "(15, 8)."], answer: "(15, 8)" },
      { prompt: "Rotate ( 10, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 10).", "(0, 10)."], answer: "(0, 10)" }
    ],
  },
  240: {
    introduction: "Rotation Around Point works this concrete case: After rotation, what happens to distance from centre? The labelled answer is unchanged. Understand angular transformations. Rotates objects by an adjustable angle. A common labelled error is moving the image closer to the centre after rotation. Rotation Around Point keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Rotation around a point turns every point by the same angle about a fixed centre. In Rotation Around Point, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Rotation Around Point works this concrete case: After rotation, what happens to distance from centre?",
    howItWorks: "Choose the centre and angle. Draw the radius to each point. Turn that radius by the angle and keep the same length.",
    whyItWorks: "Rotation is a rigid motion, so it preserves distances and angles.",
    worked: [
      { prompt: "After rotation, what happens to distance from centre?", steps: ["Rotation is rigid.", "The radius to the point stays the same.", "Distance is unchanged."], answer: "unchanged" },
      { prompt: "Translate ( 3, 2 ) by vector <6, 1>.", steps: ["Add the vector.", "(9, 3).", "(9, 3)."], answer: "(9, 3)" },
      { prompt: "Rotate ( 3, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 3).", "(0, 3)."], answer: "(0, 3)" }
    ],
  },
  241: {
    introduction: "Dilation from Point works this concrete case: If OP=4 and k=3, find OP'. The labelled answer is 12. Understand similarity and scale. Enlarges or reduces objects from a centre. A common labelled error is adding the scale factor instead of multiplying by it. Dilation from Point keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Dilation from a point scales distances from a fixed centre by a scale factor. In Dilation from Point, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Dilation from Point works this concrete case: If OP=4 and k=3, find OP'.",
    howItWorks: "Choose the centre and scale factor. Draw rays from the centre through points. Place image points at k times the original distance.",
    whyItWorks: "Multiplying all centre distances by the same factor makes a similar image.",
    worked: [
      { prompt: "If OP=4 and k=3, find OP'.", steps: ["Use OP'=k*OP.", "OP'=3*4.", "OP'=12."], answer: "12" },
      { prompt: "Translate ( 4, 3 ) by vector <7, 1>.", steps: ["Add the vector.", "(11, 4).", "(11, 4)."], answer: "(11, 4)" },
      { prompt: "Rotate ( 4, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 4).", "(0, 4)."], answer: "(0, 4)" }
    ],
  },
  242: {
    introduction: "Matrix Transformation works this concrete case: If A doubles x and y, where does (2,3) go? The labelled answer is (4,6). Connect geometry and linear algebra. Applies a transformation matrix to points and shapes. A common labelled error is applying the matrix to only one vertex. Matrix Transformation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A matrix transformation sends each coordinate vector to a new vector by matrix multiplication. In Matrix Transformation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Matrix Transformation works this concrete case: If A doubles x and y, where does (2,3) go?",
    howItWorks: "Write each point as a vector. Multiply by the matrix. Plot the image points and connect them in the same order.",
    whyItWorks: "Matrix multiplication combines coordinates using fixed linear rules.",
    worked: [
      { prompt: "If A doubles x and y, where does (2,3) go?", steps: ["Double the x-coordinate.", "Double the y-coordinate.", "The image is (4"], answer: "(4,6)" },
      { prompt: "Find det([[5,4],[0,8]]).", steps: ["5*8-4*0.", "40.", "40."], answer: "40" },
      { prompt: "What is the size of a 4 by 8 product if inner sizes match?", steps: ["Rows from the first matrix.", "Columns from the second.", "4 by 8."], answer: "4 by 8" }
    ],
  },
  243: {
    introduction: "Composite Transformations works this concrete case: Why track one point in a composition? The labelled answer is check order. Combine mappings. Applies and compares sequences of transformations. A common labelled error is doing transformations in any order. Composite Transformations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Composite transformations apply two or more transformations in sequence. In Composite Transformations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Composite Transformations works this concrete case: Why track one point in a composition?",
    howItWorks: "Apply the first transformation to the original object. Then apply the second transformation to the result. Track one point through each step.",
    whyItWorks: "Each step uses the output of the previous step as its input.",
    worked: [
      { prompt: "Why track one point in a composition?", steps: ["The image is built step by step.", "One point shows the order clearly.", "It helps check the final image."], answer: "check order" },
      { prompt: "Translate ( 6, 5 ) by vector <9, 1>.", steps: ["Add the vector.", "(15, 6).", "(15, 6)."], answer: "(15, 6)" },
      { prompt: "Rotate ( 6, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 6).", "(0, 6)."], answer: "(0, 6)" }
    ],
  },
  244: {
    introduction: "Transformation Mapping works this concrete case: What does A -> A' mean? The labelled answer is A maps to A'. Track coordinates before and after. Displays mapping rules and corresponding coordinates. A common labelled error is matching an original point with the wrong image point. Transformation Mapping keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A transformation mapping states where each original point goes after a transformation. In Transformation Mapping, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Transformation Mapping works this concrete case: What does A -> A' mean?",
    howItWorks: "Label original points. Apply the transformation. Label corresponding image points with primes. Compare each pair.",
    whyItWorks: "Mapping notation records the input-output relationship of a transformation.",
    worked: [
      { prompt: "What does A -> A' mean?", steps: ["A is the original point.", "A' is its image.", "The mapping sends A to A'."], answer: "A maps to A'" },
      { prompt: "Translate ( 7, 6 ) by vector <10, 1>.", steps: ["Add the vector.", "(17, 7).", "(17, 7)."], answer: "(17, 7)" },
      { prompt: "Rotate ( 7, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 7).", "(0, 7)."], answer: "(0, 7)" }
    ],
  },
  245: {
    introduction: "Invariants works this concrete case: Does dilation preserve length? The labelled answer is no. Identify preserved properties. Highlights distance, angle, orientation or parallelism preservation. A common labelled error is thinking every property stays unchanged. Invariants keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An invariant is a property that stays unchanged during a transformation. In Invariants, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Invariants works this concrete case: Does dilation preserve length?",
    howItWorks: "Choose a property. Measure it before the transformation. Measure it after. Decide whether it stayed equal.",
    whyItWorks: "A transformation's rule determines which properties are preserved.",
    worked: [
      { prompt: "Does dilation preserve length?", steps: ["Dilation multiplies distances by a scale factor.", "Lengths usually change unless scale factor is 1.", "So length is not always invariant."], answer: "no" },
      { prompt: "Translate ( 8, 7 ) by vector <4, 1>.", steps: ["Add the vector.", "(12, 8).", "(12, 8)."], answer: "(12, 8)" },
      { prompt: "Rotate ( 8, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 8).", "(0, 8)."], answer: "(0, 8)" }
    ],
  },
  246: {
    introduction: "Symmetry Explorer works this concrete case: What must happen after a symmetry transformation? The labelled answer is exact match. Investigate line and rotational symmetry. Tests and constructs symmetry axes and centres. A common labelled error is calling a near visual match a symmetry. Symmetry Explorer keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A symmetry explorer tests whether a shape matches itself after a reflection, rotation, or translation. In Symmetry Explorer, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Symmetry Explorer works this concrete case: What must happen after a symmetry transformation?",
    howItWorks: "Choose a possible symmetry. Apply the transformation. Check whether every image point lands on the original shape.",
    whyItWorks: "Symmetry exists when a transformation preserves the whole shape exactly.",
    worked: [
      { prompt: "What must happen after a symmetry transformation?", steps: ["Transform the shape.", "Compare with the original.", "It must match exactly."], answer: "exact match" },
      { prompt: "Translate ( 9, 2 ) by vector <5, 1>.", steps: ["Add the vector.", "(14, 3).", "(14, 3)."], answer: "(14, 3)" },
      { prompt: "Rotate ( 9, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 9).", "(0, 9)."], answer: "(0, 9)" }
    ],
  },
  247: {
    introduction: "Locus Generator works this concrete case: What is the locus of points 5 units from O? The labelled answer is circle. Trace dependent movement. Generates the path of a point driven by another object. A common labelled error is giving one point as the whole locus. Locus Generator keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A locus generator draws all points that satisfy a chosen condition. In Locus Generator, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Locus Generator works this concrete case: What is the locus of points 5 units from O?",
    howItWorks: "Read the condition. Move or generate many matching points. Draw the path formed by all matching points.",
    whyItWorks: "A condition can define a whole geometric set.",
    worked: [
      { prompt: "What is the locus of points 5 units from O?", steps: ["Fixed distance from one point is a circle.", "The radius is 5.", "The locus is a circle."], answer: "circle" },
      { prompt: "Points at distance 10 from a fixed point form what?", steps: ["Equal distance from one point.", "A circle of radius {x}.", "circle"], answer: "circle" },
      { prompt: "Points equidistant from two points lie on what?", steps: ["Equal distance from A and B.", "The perpendicular bisector.", "perpendicular bisector"], answer: "perpendicular bisector" }
    ],
  },
  248: {
    introduction: "Equidistant Loci works this concrete case: What is the locus equidistant from two points A and B? The labelled answer is perpendicular bisector. Understand bisector definitions. Builds loci equidistant from points or lines. A common labelled error is accepting distances that only look equal. Equidistant Loci keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An equidistant locus contains points that are the same distance from given objects. In Equidistant Loci, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Equidistant Loci works this concrete case: What is the locus equidistant from two points A and B?",
    howItWorks: "Identify the two objects. Mark points whose distances to both are equal. Recognize the resulting line or curve.",
    whyItWorks: "Equal-distance points balance the measurements from the given objects.",
    worked: [
      { prompt: "What is the locus equidistant from two points A and B?", steps: ["Points must satisfy PA=PB.", "Those points lie on the perpendicular bisector.", "The locus is the perpendicular bisector."], answer: "perpendicular bisector" },
      { prompt: "Points at distance 3 from a fixed point form what?", steps: ["Equal distance from one point.", "A circle of radius {x}.", "circle"], answer: "circle" },
      { prompt: "Points equidistant from two points lie on what?", steps: ["Equal distance from A and B.", "The perpendicular bisector.", "perpendicular bisector"], answer: "perpendicular bisector" }
    ],
  },
  249: {
    introduction: "Moving-Linkage Loci works this concrete case: What controls a moving-linkage locus? The labelled answer is constraints. Explore mechanical geometry. Animates linked segments and traces paths. A common labelled error is treating the tracing point as free. Moving-Linkage Loci keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A moving-linkage locus is the path traced by a point attached to moving connected segments. In Moving-Linkage Loci, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Moving-Linkage Loci works this concrete case: What controls a moving-linkage locus?",
    howItWorks: "Build the linkage. Choose a tracing point. Move the driver point and record the path.",
    whyItWorks: "Fixed segment lengths and joints restrict where the tracing point can move.",
    worked: [
      { prompt: "What controls a moving-linkage locus?", steps: ["The point is attached to a linkage.", "Segment lengths and joints restrict motion.", "The constraints control the path."], answer: "constraints" },
      { prompt: "Translate ( 4, 5 ) by vector <8, 1>.", steps: ["Add the vector.", "(12, 6).", "(12, 6)."], answer: "(12, 6)" },
      { prompt: "Rotate ( 4, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 4).", "(0, 4)."], answer: "(0, 4)" }
    ],
  },
  250: {
    introduction: "Envelope of Lines works this concrete case: Does one line make an envelope? The labelled answer is no. Explore curve generation. Displays a family of lines and its envelope. A common labelled error is using one line as the envelope. Envelope of Lines keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An envelope of lines is a curve touched by each line in a moving family. In Envelope of Lines, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Envelope of Lines works this concrete case: Does one line make an envelope?",
    howItWorks: "Generate many related lines. Watch where they crowd or just touch an invisible boundary. Trace that boundary curve.",
    whyItWorks: "A smooth boundary can be formed by tangencies from a changing line family.",
    worked: [
      { prompt: "Does one line make an envelope?", steps: ["An envelope needs a family of lines.", "One line is not enough.", "So no."], answer: "no" },
      { prompt: "Translate ( 5, 6 ) by vector <9, 1>.", steps: ["Add the vector.", "(14, 7).", "(14, 7)."], answer: "(14, 7)" },
      { prompt: "Rotate ( 5, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 5).", "(0, 5)."], answer: "(0, 5)" }
    ],
  },
  251: {
    introduction: "Dynamic Trace works this concrete case: What does a dynamic trace record? The labelled answer is path. Record motion visually. Leaves temporary or persistent traces. A common labelled error is thinking the trace changes the construction itself. Dynamic Trace keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A dynamic trace records the path of a moving point or object. In Dynamic Trace, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Dynamic Trace works this concrete case: What does a dynamic trace record?",
    howItWorks: "Select the object to trace. Move the construction. Read the trail of past positions.",
    whyItWorks: "Recording successive positions reveals the path made by motion.",
    worked: [
      { prompt: "What does a dynamic trace record?", steps: ["A point moves.", "The tool stores previous positions.", "It records the path."], answer: "path" },
      { prompt: "Translate ( 6, 7 ) by vector <10, 1>.", steps: ["Add the vector.", "(16, 8).", "(16, 8)."], answer: "(16, 8)" },
      { prompt: "Rotate ( 6, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 6).", "(0, 6)."], answer: "(0, 6)" }
    ],
  },
  252: {
    introduction: "Conjecture Testing works this concrete case: Can many examples replace proof? The labelled answer is no. Test geometric claims. Allows dragging while monitoring whether properties remain true. A common labelled error is thinking many examples prove a theorem. Conjecture Testing keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Conjecture testing checks whether a guessed geometric statement seems true under many cases. In Conjecture Testing, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Conjecture Testing works this concrete case: Can many examples replace proof?",
    howItWorks: "State the conjecture. Drag the construction through many cases. Look for a counterexample. Then seek proof.",
    whyItWorks: "A single counterexample disproves a conjecture, while many examples can guide a proof.",
    worked: [
      { prompt: "Can many examples replace proof?", steps: ["Examples can support a claim.", "They do not cover every possible case.", "Proof is still needed."], answer: "no" },
      { prompt: "Translate ( 7, 2 ) by vector <4, 1>.", steps: ["Add the vector.", "(11, 3).", "(11, 3)."], answer: "(11, 3)" },
      { prompt: "Rotate ( 7, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 7).", "(0, 7)."], answer: "(0, 7)" }
    ],
  },
  253: {
    introduction: "Exact Proof works this concrete case: Is measuring one diagram an exact proof? The labelled answer is no. Verify geometric relationships. Runs symbolic or algebraic checks where supported. A common labelled error is using one measured diagram as proof. Exact Proof keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An exact proof gives logical reasons showing a geometric statement is always true. In Exact Proof, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Exact Proof works this concrete case: Is measuring one diagram an exact proof?",
    howItWorks: "List the given facts. Add one justified step at a time. End with the required conclusion.",
    whyItWorks: "Logical implication guarantees the result for all allowed cases.",
    worked: [
      { prompt: "Is measuring one diagram an exact proof?", steps: ["One diagram is only one case.", "A proof must cover all allowed cases.", "So no."], answer: "no" },
      { prompt: "Translate ( 8, 3 ) by vector <5, 1>.", steps: ["Add the vector.", "(13, 4).", "(13, 4)."], answer: "(13, 4)" },
      { prompt: "Rotate ( 8, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 8).", "(0, 8)."], answer: "(0, 8)" }
    ],
  },
  254: {
    introduction: "Collinearity Test works this concrete case: If triangle area ABC is 0, what does that suggest? The labelled answer is collinear. Check shared-line conditions. Tests whether selected points are collinear. A common labelled error is judging collinearity only by eye. Collinearity Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A collinearity test checks whether points lie on one straight line. In Collinearity Test, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Collinearity Test works this concrete case: If triangle area ABC is 0, what does that suggest?",
    howItWorks: "Choose three points. Compare slopes or check whether the area of the triangle is zero.",
    whyItWorks: "Points on one line have the same direction between consecutive pairs.",
    worked: [
      { prompt: "If triangle area ABC is 0, what does that suggest?", steps: ["Three non-collinear points make area.", "Zero area means no triangle region.", "The points are collinear."], answer: "collinear" },
      { prompt: "Translate ( 9, 4 ) by vector <6, 1>.", steps: ["Add the vector.", "(15, 5).", "(15, 5)."], answer: "(15, 5)" },
      { prompt: "Rotate ( 9, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 9).", "(0, 9)."], answer: "(0, 9)" }
    ],
  },
  255: {
    introduction: "Concurrency Test works this concrete case: Are three lines concurrent if only two meet at P? The labelled answer is no. Check common intersections. Tests whether selected lines meet at one point. A common labelled error is checking only two lines. Concurrency Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A concurrency test checks whether three or more lines pass through one point. In Concurrency Test, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Concurrency Test works this concrete case: Are three lines concurrent if only two meet at P?",
    howItWorks: "Construct the lines. Find intersections. Check whether all lines pass through the same point.",
    whyItWorks: "Concurrency is an exact incidence relationship among lines.",
    worked: [
      { prompt: "Are three lines concurrent if only two meet at P?", steps: ["Two lines always meet or are parallel.", "The third must also pass through P.", "So not enough."], answer: "no" },
      { prompt: "Translate ( 10, 5 ) by vector <7, 1>.", steps: ["Add the vector.", "(17, 6).", "(17, 6)."], answer: "(17, 6)" },
      { prompt: "Rotate ( 10, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 10).", "(0, 10)."], answer: "(0, 10)" }
    ],
  },
  256: {
    introduction: "Concyclicity Test works this concrete case: What must be true for four points to be concyclic? The labelled answer is one circle. Check shared-circle conditions. Tests whether selected points lie on a circle. A common labelled error is assuming a fourth point is concyclic because three points define a circle. Concyclicity Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A concyclicity test checks whether points lie on one circle. In Concyclicity Test, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Concyclicity Test works this concrete case: What must be true for four points to be concyclic?",
    howItWorks: "Choose the points. Construct or test a circle through them. Check whether each point has the same distance from the centre.",
    whyItWorks: "All points on a circle are equally distant from its centre.",
    worked: [
      { prompt: "What must be true for four points to be concyclic?", steps: ["One circle must pass through them.", "Each point lies on that circle.", "They are concyclic."], answer: "one circle" },
      { prompt: "Translate ( 3, 6 ) by vector <8, 1>.", steps: ["Add the vector.", "(11, 7).", "(11, 7)."], answer: "(11, 7)" },
      { prompt: "Rotate ( 3, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 3).", "(0, 3)."], answer: "(0, 3)" }
    ],
  },
  257: {
    introduction: "Angle Measurement works this concrete case: Convert 180 degrees to radians. The labelled answer is pi. Convert angle units. Switches between degrees, radians and revolutions. A common labelled error is mixing degrees and radians in one calculation. Angle Measurement keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Angle measurement names the size of a turn in degrees or radians. In Angle Measurement, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Angle Measurement works this concrete case: Convert 180 degrees to radians.",
    howItWorks: "Identify the unit. Use 180 degrees equals pi radians to convert. Keep the same turn size.",
    whyItWorks: "Degrees and radians measure the same rotation with different unit sizes.",
    worked: [
      { prompt: "Convert 180 degrees to radians.", steps: ["180 degrees equals pi radians by definition.", "So the angle is pi radians."], answer: "pi" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 40° and 70°. What is the sum?", steps: ["40+70.", "110.", "110."], answer: "110" }
    ],
  },
  258: {
    introduction: "Unit Circle works this concrete case: What are coordinates at 0 degrees? The labelled answer is (1,0). Derive trig values geometrically. Moves a point around a circle and updates coordinates and ratios. A common labelled error is reading sine as x and cosine as y. Unit Circle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The unit circle is the circle of radius 1 centred at the origin. In Unit Circle, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Unit Circle works this concrete case: What are coordinates at 0 degrees?",
    howItWorks: "Choose an angle from the positive x-axis. Find the point on the radius-1 circle. Read x as cosine and y as sine.",
    whyItWorks: "The radius is 1, so triangle side ratios become coordinates.",
    worked: [
      { prompt: "What are coordinates at 0 degrees?", steps: ["The point is on the positive x-axis.", "x=1 and y=0.", "Coordinates are (1"], answer: "(1,0)" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  259: {
    introduction: "Right-Triangle Ratios works this concrete case: If opposite=3 and hypotenuse=5, find sin theta. The labelled answer is 0.6. Understand SOH-CAH-TOA. Changes triangle dimensions and updates ratios. A common labelled error is using the adjacent side as opposite. Right-Triangle Ratios keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Right-triangle trig ratios compare sides relative to an acute angle. In Right-Triangle Ratios, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Right-Triangle Ratios works this concrete case: If opposite=3 and hypotenuse=5, find sin theta.",
    howItWorks: "Mark the angle. Label opposite, adjacent, and hypotenuse. Choose the ratio that uses the known and wanted sides.",
    whyItWorks: "Similar right triangles keep the same side ratios for the same angle.",
    worked: [
      { prompt: "If opposite=3 and hypotenuse=5, find sin theta.", steps: ["Use sin=opposite/hypotenuse.", "sin theta=3/5.", "The value is 0.6."], answer: "0.6" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 60° and 30°. What is the sum?", steps: ["60+30.", "90.", "90."], answer: "90" }
    ],
  },
  260: {
    introduction: "Exact Trig Values works this concrete case: Find sin 30 degrees. The labelled answer is 1/2. Derive standard values. Constructs 30-60-90 and 45-45-90 triangles. A common labelled error is replacing exact values with rounded decimals too early. Exact Trig Values keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Exact trig values are special angle values written without decimal rounding. In Exact Trig Values, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Exact Trig Values works this concrete case: Find sin 30 degrees.",
    howItWorks: "Use the special triangle or unit circle. Read the exact fraction or surd value. Avoid decimal rounding unless asked.",
    whyItWorks: "Special triangles give exact side ratios.",
    worked: [
      { prompt: "Find sin 30 degrees.", steps: ["Use the 30-60-90 triangle.", "The opposite over hypotenuse is 1/2.", "sin 30 degrees = 1/2."], answer: "1/2" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  261: {
    introduction: "Sine Graph works this concrete case: What is the period of y=sin x? The labelled answer is 2 pi. Explore periodic shape. Links unit-circle motion to a live sine graph. A common labelled error is thinking sine does not repeat. Sine Graph keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The sine graph plots y=sin x against angle x. In Sine Graph, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Sine Graph works this concrete case: What is the period of y=sin x?",
    howItWorks: "Track the y-coordinate on the unit circle as the angle changes. Plot angle against sine value.",
    whyItWorks: "Sine is the vertical coordinate of circular motion.",
    worked: [
      { prompt: "What is the period of y=sin x?", steps: ["One full unit-circle turn is 2 pi.", "Sine repeats after one full turn.", "The period is 2 pi."], answer: "2 pi" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  262: {
    introduction: "Cosine Graph works this concrete case: What is cos 0? The labelled answer is 1. Explore phase-shifted periodic shape. Links horizontal coordinate to a live graph. A common labelled error is thinking cosine starts at 0 like sine. Cosine Graph keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The cosine graph plots y=cos x against angle x. In Cosine Graph, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cosine Graph works this concrete case: What is cos 0?",
    howItWorks: "Track the x-coordinate on the unit circle as the angle changes. Plot angle against cosine value.",
    whyItWorks: "Cosine is the horizontal coordinate of circular motion.",
    worked: [
      { prompt: "What is cos 0?", steps: ["At 0 degrees", "the unit-circle point is (1", "0)."], answer: "1" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  263: {
    introduction: "Tangent Graph works this concrete case: Why is tan 90 degrees undefined? The labelled answer is cos is 0. Understand period and asymptotes. Links tangent length or ratio to graph branches. A common labelled error is giving tangent a value where cos x=0. Tangent Graph keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The tangent graph plots y=tan x against angle x. In Tangent Graph, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Tangent Graph works this concrete case: Why is tan 90 degrees undefined?",
    howItWorks: "Read sine and cosine. Divide sine by cosine. Mark undefined values where cosine is zero.",
    whyItWorks: "Tangent compares vertical and horizontal unit-circle coordinates.",
    worked: [
      { prompt: "Why is tan 90 degrees undefined?", steps: ["tan=sin/cos.", "cos 90 degrees is 0.", "Division by zero is undefined."], answer: "cos is 0" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  264: {
    introduction: "Reciprocal Trig Functions works this concrete case: If cos theta=1/2, find sec theta. The labelled answer is 2. Explore sec, cosec and cot. Plots and relates reciprocal curves. A common labelled error is taking a reciprocal of zero. Reciprocal Trig Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Reciprocal trig functions are reciprocals of sine, cosine, and tangent. In Reciprocal Trig Functions, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Reciprocal Trig Functions works this concrete case: If cos theta=1/2, find sec theta.",
    howItWorks: "Find the base trig value. Take its reciprocal only if the base value is not zero.",
    whyItWorks: "A reciprocal is defined only for non-zero values.",
    worked: [
      { prompt: "If cos theta=1/2, find sec theta.", steps: ["sec=1/cos.", "sec=1/(1/2).", "sec=2."], answer: "2" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  265: {
    introduction: "Inverse Trig Functions works this concrete case: Find sin^-1(1/2) in degrees. The labelled answer is 30. Understand restricted inverses. Shows domain-range restrictions and reflections. A common labelled error is thinking inverse trig returns every possible solution. Inverse Trig Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inverse trig functions return a principal angle from a trig ratio. In Inverse Trig Functions, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Inverse Trig Functions works this concrete case: Find sin^-1(1/2) in degrees.",
    howItWorks: "Choose the inverse function. Enter the ratio. Check the output range and angle unit.",
    whyItWorks: "Restricting the output range makes an inverse function possible.",
    worked: [
      { prompt: "Find sin^-1(1/2) in degrees.", steps: ["Ask which principal angle has sine 1/2.", "That angle is 30 degrees.", "The answer is 30 degrees."], answer: "30" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  266: {
    introduction: "Trig Identities works this concrete case: Why does sin^2 theta + cos^2 theta equal 1? The labelled answer is unit circle. Verify equivalent expressions. Overlays graphs and simplifies symbolically. A common labelled error is checking one angle and calling it an identity. Trig Identities keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A trig identity is an equation true for every allowed angle. In Trig Identities, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Trig Identities works this concrete case: Why does sin^2 theta + cos^2 theta equal 1?",
    howItWorks: "Use the unit circle. Square sine and cosine. Add them. The result is 1 for every allowed angle.",
    whyItWorks: "The unit-circle point is always distance 1 from the origin, so x^2+y^2=1.",
    worked: [
      { prompt: "Why does sin^2 theta + cos^2 theta equal 1?", steps: ["The unit-circle point is (cos theta", "sin theta).", "It lies on x^2+y^2=1."], answer: "unit circle" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  267: {
    introduction: "Compound-Angle Formulae works this concrete case: Is sin(A+B)=sin A+sin B true? The labelled answer is false. Understand sum and difference identities. Uses geometric or graph-based demonstrations. A common labelled error is saying sin(A+B)=sin A+sin B. Compound-Angle Formulae keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Compound-angle formulae give trig values of sums or differences of angles. In Compound-Angle Formulae, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Compound-Angle Formulae works this concrete case: Is sin(A+B)=sin A+sin B true?",
    howItWorks: "Identify the two angles. Substitute their sine and cosine values into the formula. Simplify exactly when possible.",
    whyItWorks: "Rotating by A then B combines coordinates according to the addition formula.",
    worked: [
      { prompt: "Is sin(A+B)=sin A+sin B true?", steps: ["Sine is not distributive over angle addition.", "The formula also uses cosines.", "So it is false."], answer: "false" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 60° and 50°. What is the sum?", steps: ["60+50.", "110.", "110."], answer: "110" }
    ],
  },
  268: {
    introduction: "Double- and Half-Angle Formulae works this concrete case: If sin A=1/2 and cos A=sqrt(3)/2, find sin 2A. The labelled answer is sqrt(3)/2. Explore derived identities. Adjusts angles and verifies identities numerically. A common labelled error is thinking sin 2A equals 2 sin A always. Double- and Half-Angle Formulae keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Double- and half-angle formulae rewrite trig values of 2A or A/2. In Double- and Half-Angle Formulae, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Double- and Half-Angle Formulae works this concrete case: If sin A=1/2 and cos A=sqrt(3)/2, find sin 2A.",
    howItWorks: "Identify whether the angle is doubled or halved. Choose the matching identity. Substitute known values.",
    whyItWorks: "These identities come from compound-angle formulae with repeated or split angles.",
    worked: [
      { prompt: "If sin A=1/2 and cos A=sqrt(3)/2, find sin 2A.", steps: ["Use sin 2A=2 sin A cos A.", "2*(1/2)*(sqrt(3)/2)=sqrt(3)/2.", "So sin 2A=sqrt(3)/2."], answer: "sqrt(3)/2" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 70° and 60°. What is the sum?", steps: ["70+60.", "130.", "130."], answer: "130" }
    ],
  },
  269: {
    introduction: "Trig Equations works this concrete case: Solve sin theta=1/2 for 0<=theta<360. The labelled answer is 30, 150. Find interval and general solutions. Plots both sides and marks repeating intersections. A common labelled error is giving only one solution in a full interval. Trig Equations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A trig equation contains a trigonometric function of an unknown angle. In Trig Equations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Trig Equations works this concrete case: Solve sin theta=1/2 for 0<=theta<360.",
    howItWorks: "Find a reference angle. Use signs and the interval to find all matching angles. Check each solution.",
    whyItWorks: "Trig functions repeat and can have more than one angle with the same value.",
    worked: [
      { prompt: "Solve sin theta=1/2 for 0<=theta<360.", steps: ["Reference angle is 30 degrees.", "Sine is positive in quadrants I and II.", "Solutions are 30 and 150 degrees."], answer: "30, 150" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  270: {
    introduction: "Sine Rule works this concrete case: In the sine rule, side a pairs with which angle? The labelled answer is A. Solve oblique triangles. Changes known values and solves missing sides or angles. A common labelled error is pairing a side with the wrong angle. Sine Rule keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The sine rule links sides of a triangle with sines of opposite angles. In Sine Rule, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Sine Rule works this concrete case: In the sine rule, side a pairs with which angle?",
    howItWorks: "Match each side with its opposite angle. Set up the sine-rule proportion. Solve for the unknown.",
    whyItWorks: "All ratios equal the same value tied to the triangle's circumcircle.",
    worked: [
      { prompt: "In the sine rule, side a pairs with which angle?", steps: ["The formula uses a/sin A.", "Side a is opposite angle A.", "It pairs with A."], answer: "A" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  271: {
    introduction: "Cosine Rule works this concrete case: What does the cosine rule become when C=90 degrees? The labelled answer is Pythagoras. Relate three sides and angles. Solves triangles with SAS or SSS data. A common labelled error is using Pythagoras for every triangle. Cosine Rule keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The cosine rule links three sides of a triangle and one included angle. In Cosine Rule, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cosine Rule works this concrete case: What does the cosine rule become when C=90 degrees?",
    howItWorks: "Identify the side opposite the chosen angle. Substitute the two surrounding sides and included angle. Solve carefully.",
    whyItWorks: "The cosine rule extends Pythagoras to non-right triangles.",
    worked: [
      { prompt: "What does the cosine rule become when C=90 degrees?", steps: ["cos 90=0.", "The last term becomes 0.", "c^2=a^2+b^2."], answer: "Pythagoras" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  272: {
    introduction: "Triangle Area Formula works this concrete case: Find area when a=6, b=4, C=90 degrees. The labelled answer is 12. Use one-half ab sin C. Changes sides and angle and updates area. A common labelled error is using an angle that is not between the two sides. Triangle Area Formula keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The trigonometric triangle area formula uses two sides and the included angle. In Triangle Area Formula, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Triangle Area Formula works this concrete case: Find area when a=6, b=4, C=90 degrees.",
    howItWorks: "Choose two sides with the angle between them. Substitute into one half ab sin C. Keep square units.",
    whyItWorks: "The sine of the included angle gives the perpendicular height relative to one side.",
    worked: [
      { prompt: "Find area when a=6, b=4, C=90 degrees.", steps: ["Use A=1/2 ab sin C.", "sin 90=1.", "A=1/2*6*4=12."], answer: "12" },
      { prompt: "Find the labelled triangle area formula for base 3 and height 4.", steps: ["Use the Triangle Area Formula formula.", "3 and 4 are the measured sides.", "The value is 6."], answer: "6" },
      { prompt: "If the height doubles from 4 to 8, what happens to this area model?", steps: ["Area scales with perpendicular height.", "New height 8.", "It doubles."], answer: "doubles" }
    ],
  },
  273: {
    introduction: "Bearings works this concrete case: How is a bearing measured? The labelled answer is clockwise from north. Apply direction conventions. Uses compass grids and route vectors. A common labelled error is measuring bearing from east like a standard graph angle. Bearings keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A bearing is a direction angle measured clockwise from north. In Bearings, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Bearings works this concrete case: How is a bearing measured?",
    howItWorks: "Start at north. Turn clockwise to the direction line. Write the angle as three digits.",
    whyItWorks: "A shared convention prevents direction ambiguity.",
    worked: [
      { prompt: "How is a bearing measured?", steps: ["Start from north.", "Turn clockwise.", "Write three digits."], answer: "clockwise from north" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 40° and 50°. What is the sum?", steps: ["40+50.", "90.", "90."], answer: "90" }
    ],
  },
  274: {
    introduction: "Elevation and Depression works this concrete case: Is elevation measured above or below horizontal? The labelled answer is above. Model heights and distances. Creates sight lines and calculates unknown dimensions. A common labelled error is measuring from the vertical line. Elevation and Depression keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Angles of elevation and depression measure sight lines above or below the horizontal. In Elevation and Depression, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Elevation and Depression works this concrete case: Is elevation measured above or below horizontal?",
    howItWorks: "Draw the horizontal line. Mark whether the sight line goes up or down. Use a right-triangle ratio.",
    whyItWorks: "Horizontal and vertical distances form a right triangle with the sight line.",
    worked: [
      { prompt: "Is elevation measured above or below horizontal?", steps: ["Elevation means looking up.", "It is above the horizontal.", "So above."], answer: "above" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 50° and 60°. What is the sum?", steps: ["50+60.", "110.", "110."], answer: "110" }
    ],
  },
  275: {
    introduction: "Harmonic Motion works this concrete case: If peak is 5 and midline is 2, what is amplitude? The labelled answer is 3. Connect trigonometry to waves. Animates circular motion and sinusoidal displacement. A common labelled error is measuring amplitude from peak to trough. Harmonic Motion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Harmonic motion is smooth repeating motion modelled by sine or cosine. In Harmonic Motion, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Harmonic Motion works this concrete case: If peak is 5 and midline is 2, what is amplitude?",
    howItWorks: "Identify the midline. Measure amplitude from midline to peak. Read the time for one full cycle.",
    whyItWorks: "Circular motion projected onto a line creates sinusoidal motion.",
    worked: [
      { prompt: "If peak is 5 and midline is 2, what is amplitude?", steps: ["Amplitude is distance from midline to peak.", "5-2=3.", "Amplitude is 3."], answer: "3" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  276: {
    introduction: "Polar Trigonometry works this concrete case: If r=2 and theta=0, find (x,y). The labelled answer is (2,0). Connect polar coordinates and trig. Plots angle-radius relationships. A common labelled error is treating r as the x-coordinate. Polar Trigonometry keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Polar trigonometry uses angles and radii to locate points and describe curves. In Polar Trigonometry, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Polar Trigonometry works this concrete case: If r=2 and theta=0, find (x,y).",
    howItWorks: "Read the radius. Read the angle. Use cosine for x and sine for y when converting to Cartesian coordinates.",
    whyItWorks: "A radius and an angle form a right triangle with horizontal and vertical components.",
    worked: [
      { prompt: "If r=2 and theta=0, find (x,y).", steps: ["Use x=r cos theta and y=r sin theta.", "cos 0=1 and sin 0=0.", "The point is (2"], answer: "(2,0)" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  277: {
    introduction: "Informal Limits works this concrete case: If f(x) approaches 4 near x=2, what is the limit? The labelled answer is 4. Observe approach behaviour. Moves a point toward a target from both sides. A common labelled error is using only f(a) to decide the limit. Informal Limits keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An informal limit is the value a function appears to approach as x gets close to a chosen number. In Informal Limits, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Informal Limits works this concrete case: If f(x) approaches 4 near x=2, what is the limit?",
    howItWorks: "Move x-values closer to a from both sides. Watch the y-values. Name the value they approach if both sides agree.",
    whyItWorks: "Nearby inputs can settle toward one output even if the point itself is missing.",
    worked: [
      { prompt: "If f(x) approaches 4 near x=2, what is the limit?", steps: ["Check values close to 2.", "They approach 4.", "The limit is 4."], answer: "4" },
      { prompt: "Estimate lim x→8 of (x-8)/(x-8) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=8 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  278: {
    introduction: "One-Sided Limits works this concrete case: If left limit is 2 and right limit is 5, does the two-sided limit exist? The labelled answer is no. Compare left and right behaviour. Shows independent approach values. A common labelled error is using one side to claim a two-sided limit. One-Sided Limits keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A one-sided limit describes what a function approaches from only the left or only the right. In One-Sided Limits, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "One-Sided Limits works this concrete case: If left limit is 2 and right limit is 5, does the two-sided limit exist?",
    howItWorks: "Approach the point from the left. Record the output trend. Approach from the right and compare.",
    whyItWorks: "Functions can behave differently on the two sides of a point.",
    worked: [
      { prompt: "If left limit is 2 and right limit is 5, does the two-sided limit exist?", steps: ["Compare the two one-sided limits.", "2 and 5 are different.", "The two-sided limit does not exist."], answer: "no" },
      { prompt: "Estimate lim x→9 of (x-9)/(x-9) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=9 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  279: {
    introduction: "Infinite Limits works this concrete case: What happens to 1/x as x approaches 0 from the right? The labelled answer is infinity. Understand vertical asymptotes. Tracks unbounded function values. A common labelled error is treating infinity as an ordinary output value. Infinite Limits keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An infinite limit means function values grow without bound near an input. In Infinite Limits, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Infinite Limits works this concrete case: What happens to 1/x as x approaches 0 from the right?",
    howItWorks: "Move x closer to the input. Watch whether y-values grow larger and larger in magnitude.",
    whyItWorks: "A denominator approaching zero can make a quotient grow without bound.",
    worked: [
      { prompt: "What happens to 1/x as x approaches 0 from the right?", steps: ["Positive x-values get very small.", "1/x becomes very large.", "It approaches infinity."], answer: "infinity" },
      { prompt: "Estimate lim x→10 of (x-10)/(x-10) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=10 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  280: {
    introduction: "Limits at Infinity works this concrete case: What does y=1/x approach as x goes to infinity? The labelled answer is 0. Analyse end behaviour. Zooms out and compares horizontal or oblique asymptotes. A common labelled error is checking values near zero for a limit at infinity. Limits at Infinity keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A limit at infinity describes what f(x) approaches as x grows very large positive or negative. In Limits at Infinity, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Limits at Infinity works this concrete case: What does y=1/x approach as x goes to infinity?",
    howItWorks: "Move far right or far left on the graph. Watch whether y-values settle toward a fixed number.",
    whyItWorks: "Some functions level off as the input grows without bound.",
    worked: [
      { prompt: "What does y=1/x approach as x goes to infinity?", steps: ["As x grows", "1/x gets smaller.", "It approaches 0."], answer: "0" },
      { prompt: "Estimate lim x→3 of (x-3)/(x-3) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=3 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  281: {
    introduction: "Continuity at a Point works this concrete case: If limit is 3 but f(a)=5, is the function continuous at a? The labelled answer is no. Compare limit and actual value. Displays holes, filled points and limit values. A common labelled error is saying continuity only needs a limit. Continuity at a Point keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A function is continuous at a point when the function value exists, the limit exists, and they are equal. In Continuity at a Point, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Continuity at a Point works this concrete case: If limit is 3 but f(a)=5, is the function continuous at a?",
    howItWorks: "Check f(a). Check the two-sided limit. Compare the limit with the function value.",
    whyItWorks: "A continuous graph has no break at that point.",
    worked: [
      { prompt: "If limit is 3 but f(a)=5, is the function continuous at a?", steps: ["The limit exists.", "The value is different.", "Continuity fails."], answer: "no" },
      { prompt: "Estimate lim x→4 of (x-4)/(x-4) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=4 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  282: {
    introduction: "Types of Discontinuity works this concrete case: If left and right limits disagree, what type can it be? The labelled answer is jump. Classify graph breaks. Demonstrates removable, jump and infinite discontinuities. A common labelled error is calling every break a hole. Types of Discontinuity keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A discontinuity is a break in a graph, such as a hole, jump, or vertical asymptote. In Types of Discontinuity, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Types of Discontinuity works this concrete case: If left and right limits disagree, what type can it be?",
    howItWorks: "Look near the point. Decide whether there is a hole, jump, or unbounded behaviour.",
    whyItWorks: "Different failures of continuity create different graph breaks.",
    worked: [
      { prompt: "If left and right limits disagree, what type can it be?", steps: ["The graph approaches different values.", "That is a jump behaviour.", "It is a jump discontinuity."], answer: "jump" },
      { prompt: "Estimate lim x→5 of (x-5)/(x-5) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=5 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  283: {
    introduction: "Epsilon–Delta Visualiser works this concrete case: What does epsilon control? The labelled answer is output closeness. Develop formal limit intuition. Adjusts epsilon bands and corresponding delta intervals. A common labelled error is thinking one fixed delta works for every epsilon. Epsilon–Delta Visualiser keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An epsilon-delta visualiser shows how output closeness epsilon is controlled by input closeness delta. In Epsilon–Delta Visualiser, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Epsilon–Delta Visualiser works this concrete case: What does epsilon control?",
    howItWorks: "Choose epsilon around the target output. Adjust delta around the input until all nearby graph values stay inside the epsilon band.",
    whyItWorks: "The definition makes the idea of approaching a value precise.",
    worked: [
      { prompt: "What does epsilon control?", steps: ["Epsilon is around the output value.", "It sets allowed output error.", "It controls y-closeness."], answer: "output closeness" },
      { prompt: "Estimate lim x→6 of (x-6)/(x-6) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=6 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  284: {
    introduction: "Average Rate of Change works this concrete case: For f(x)=x^2 from 1 to 3, find average rate. The labelled answer is 4. Understand secant slope. Moves interval endpoints and updates slope. A common labelled error is using only the final output as the rate. Average Rate of Change keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Average rate of change is the change in output divided by the change in input over an interval. In Average Rate of Change, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Average Rate of Change works this concrete case: For f(x)=x^2 from 1 to 3, find average rate.",
    howItWorks: "Find f(a) and f(b). Subtract outputs. Divide by b-a.",
    whyItWorks: "The quotient compares total output change per input unit.",
    worked: [
      { prompt: "For f(x)=x^2 from 1 to 3, find average rate.", steps: ["f(3)=9 and f(1)=1.", "Change is 8 and input change is 2.", "Average rate is 4."], answer: "4" },
      { prompt: "Estimate lim x→7 of (x-7)/(x-7) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=7 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  285: {
    introduction: "Instantaneous Rate of Change works this concrete case: For f(x)=x^2, what is f'(2)? The labelled answer is 4. Transition to tangent slope. Shrinks secant intervals toward a point. A common labelled error is using a wide interval for an instant rate. Instantaneous Rate of Change keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Instantaneous rate of change is the limiting rate at one input. In Instantaneous Rate of Change, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Instantaneous Rate of Change works this concrete case: For f(x)=x^2, what is f'(2)?",
    howItWorks: "Use secant slopes with smaller h-values. Watch the slope approach the tangent slope.",
    whyItWorks: "As the two secant points merge, the secant slope approaches local slope.",
    worked: [
      { prompt: "For f(x)=x^2, what is f'(2)?", steps: ["Derivative is 2x.", "Substitute x=2.", "f'(2)=4."], answer: "4" },
      { prompt: "Estimate lim x→8 of (x-8)/(x-8) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=8 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  286: {
    introduction: "Derivative from First Principles works this concrete case: Why not set h=0 immediately? The labelled answer is division by zero. Visualise the derivative limit. Animates h approaching zero. A common labelled error is putting h=0 before simplifying. Derivative from First Principles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The derivative from first principles uses the limit of the difference quotient. In Derivative from First Principles, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Derivative from First Principles works this concrete case: Why not set h=0 immediately?",
    howItWorks: "Write f(x+h). Subtract f(x). Divide by h. Simplify before taking the limit.",
    whyItWorks: "The formula is the limiting slope of secant lines.",
    worked: [
      { prompt: "Why not set h=0 immediately?", steps: ["The quotient has division by h.", "h=0 would divide by zero.", "Simplify first"], answer: "division by zero" },
      { prompt: "Estimate lim x→9 of (x-9)/(x-9) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=9 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  287: {
    introduction: "Tangent Line works this concrete case: For f(x)=x^2 at x=2, what is tangent slope? The labelled answer is 4. Construct local linear behaviour. Draws and updates a tangent at a movable point. A common labelled error is using two far points for a tangent slope. Tangent Line keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A tangent line touches a curve locally and has slope equal to the derivative at the point. In Tangent Line, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Tangent Line works this concrete case: For f(x)=x^2 at x=2, what is tangent slope?",
    howItWorks: "Find f(a). Find f'(a). Use point-slope form with the derivative as slope.",
    whyItWorks: "The derivative gives the best linear approximation near the point.",
    worked: [
      { prompt: "For f(x)=x^2 at x=2, what is tangent slope?", steps: ["Derivative is 2x.", "At x=2", "slope is 4."], answer: "4" },
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" }
    ],
  },
  288: {
    introduction: "Normal Line works this concrete case: If tangent slope is 2, what is normal slope? The labelled answer is -1/2. Construct perpendicular local direction. Creates the normal at a selected point. A common labelled error is using tangent slope as normal slope. Normal Line keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A normal line is perpendicular to the tangent line at a point on a curve. In Normal Line, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Normal Line works this concrete case: If tangent slope is 2, what is normal slope?",
    howItWorks: "Find the tangent slope. Take its negative reciprocal. Use the point on the curve.",
    whyItWorks: "Perpendicular non-vertical lines have slopes whose product is -1.",
    worked: [
      { prompt: "If tangent slope is 2, what is normal slope?", steps: ["Take negative reciprocal.", "-1/2.", "Normal slope is -1/2."], answer: "-1/2" },
      { prompt: "Estimate lim x→3 of (x-3)/(x-3) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=3 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  289: {
    introduction: "Derivative Graph works this concrete case: If f is increasing, what sign can f' have? The labelled answer is positive. Connect a function and its derivative. Builds f'(x) from sampled tangent slopes. A common labelled error is thinking derivative graph is the original graph. Derivative Graph keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A derivative graph shows f'(x), the slope of the original function at each x. In Derivative Graph, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Derivative Graph works this concrete case: If f is increasing, what sign can f' have?",
    howItWorks: "Read the original graph's slope at many x-values. Plot those slopes as y-values on the derivative graph.",
    whyItWorks: "The derivative function records local slope across the domain.",
    worked: [
      { prompt: "If f is increasing, what sign can f' have?", steps: ["Increasing means positive local slope.", "Derivative records slope.", "f' is positive."], answer: "positive" },
      { prompt: "Estimate lim x→4 of (x-4)/(x-4) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=4 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  290: {
    introduction: "Higher Derivatives works this concrete case: For f(x)=x^3, find f''(x). The labelled answer is 6x. Analyse acceleration and concavity. Plots first and second derivatives. A common labelled error is thinking f'' means f squared. Higher Derivatives keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Higher derivatives are derivatives taken more than once. In Higher Derivatives, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Higher Derivatives works this concrete case: For f(x)=x^3, find f''(x).",
    howItWorks: "Differentiate once to get f'. Differentiate again to get f''. Continue if needed.",
    whyItWorks: "Repeated differentiation measures rates of rates, such as acceleration.",
    worked: [
      { prompt: "For f(x)=x^3, find f''(x).", steps: ["f'(x)=3x^2.", "Differentiate again.", "f''(x)=6x."], answer: "6x" },
      { prompt: "Estimate lim x→5 of (x-5)/(x-5) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=5 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  291: {
    introduction: "Product Rule works this concrete case: Differentiate x^2 sin x. The labelled answer is 2x sin x + x^2 cos x. Differentiate products. Shows symbolic steps and numerical verification. A common labelled error is saying (uv)'=u'v' only. Product Rule keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The product rule differentiates a product of two functions. In Product Rule, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Product Rule works this concrete case: Differentiate x^2 sin x.",
    howItWorks: "Differentiate the first and keep the second. Then keep the first and differentiate the second. Add the two terms.",
    whyItWorks: "Both factors can change, so both changes contribute to the derivative.",
    worked: [
      { prompt: "Differentiate x^2 sin x.", steps: ["u=x^2", "v=sin x.", "u'=2x and v'=cos x."], answer: "2x sin x + x^2 cos x" },
      { prompt: "Estimate lim x→6 of (x-6)/(x-6) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=6 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  292: {
    introduction: "Quotient Rule works this concrete case: What is the denominator in the quotient rule? The labelled answer is v^2. Differentiate quotients. Shows symbolic structure and domain restrictions. A common labelled error is forgetting the denominator squared. Quotient Rule keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The quotient rule differentiates one function divided by another. In Quotient Rule, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Quotient Rule works this concrete case: What is the denominator in the quotient rule?",
    howItWorks: "Differentiate the top times bottom. Subtract top times derivative of bottom. Divide by bottom squared.",
    whyItWorks: "The rule follows from product and chain rules applied to u times v^-1.",
    worked: [
      { prompt: "What is the denominator in the quotient rule?", steps: ["The rule is (u'v-uv')/v^2.", "The denominator is v^2.", "So it is bottom squared."], answer: "v^2" },
      { prompt: "Estimate lim x→7 of (x-7)/(x-7) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=7 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  293: {
    introduction: "Chain Rule works this concrete case: Differentiate (3x+1)^2. The labelled answer is 6(3x+1). Differentiate compositions. Visualises nested rate changes. A common labelled error is forgetting to multiply by the inside derivative. Chain Rule keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The chain rule differentiates a composite function. In Chain Rule, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Chain Rule works this concrete case: Differentiate (3x+1)^2.",
    howItWorks: "Identify inside and outside functions. Differentiate the outside with inside unchanged. Multiply by derivative of inside.",
    whyItWorks: "A change in x first changes the inside, which then changes the outside.",
    worked: [
      { prompt: "Differentiate (3x+1)^2.", steps: ["Outside is square.", "Derivative is 2(3x+1).", "Multiply by inside derivative 3 to get 6(3x+1)."], answer: "6(3x+1)" },
      { prompt: "Estimate lim x→8 of (x-8)/(x-8) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=8 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  294: {
    introduction: "Implicit Differentiation works this concrete case: Differentiate y^2 with respect to x. The labelled answer is 2y dy/dx. Differentiate implicit curves. Computes local slopes on non-function relations. A common labelled error is differentiating y as if it were a constant. Implicit Differentiation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Implicit differentiation differentiates equations where y is not isolated. In Implicit Differentiation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Implicit Differentiation works this concrete case: Differentiate y^2 with respect to x.",
    howItWorks: "Differentiate both sides with respect to x. Use chain rule for terms containing y. Solve for dy/dx if needed.",
    whyItWorks: "When y depends on x, changing x also changes y.",
    worked: [
      { prompt: "Differentiate y^2 with respect to x.", steps: ["y depends on x.", "Use chain rule.", "Derivative is 2y dy/dx."], answer: "2y dy/dx" },
      { prompt: "Estimate lim x→9 of (x-9)/(x-9) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=9 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  295: {
    introduction: "Parametric Differentiation works this concrete case: If dy/dt=6 and dx/dt=2, find dy/dx. The labelled answer is 3. Analyse parametric curves. Calculates dy/dx from dx/dt and dy/dt. A common labelled error is using dy/dt as dy/dx. Parametric Differentiation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Parametric differentiation finds dy/dx when x and y are both functions of a parameter. In Parametric Differentiation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Parametric Differentiation works this concrete case: If dy/dt=6 and dx/dt=2, find dy/dx.",
    howItWorks: "Differentiate y with respect to t. Differentiate x with respect to t. Divide dy/dt by dx/dt.",
    whyItWorks: "The parameter controls both coordinates, so their rates combine by division.",
    worked: [
      { prompt: "If dy/dt=6 and dx/dt=2, find dy/dx.", steps: ["Use dy/dx=(dy/dt)/(dx/dt).", "6/2=3.", "dy/dx=3."], answer: "3" },
      { prompt: "Estimate lim x→10 of (x-10)/(x-10) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=10 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  296: {
    introduction: "Critical Points works this concrete case: If f'(2)=0, what is x=2 called? The labelled answer is critical point. Identify candidate extrema. Marks derivative zeros and undefined points. A common labelled error is looking only where f'=0. Critical Points keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Critical points occur where f'(x)=0 or f'(x) is undefined, within the domain. In Critical Points, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Critical Points works this concrete case: If f'(2)=0, what is x=2 called?",
    howItWorks: "Find f'. Solve f'=0. Also check where f' is undefined but f is defined.",
    whyItWorks: "Extrema and shape changes can occur where the derivative stops being a regular non-zero slope.",
    worked: [
      { prompt: "If f'(2)=0, what is x=2 called?", steps: ["Derivative is zero.", "That meets the critical condition.", "x=2 is a critical point candidate."], answer: "critical point" },
      { prompt: "Estimate lim x→3 of (x-3)/(x-3) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=3 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  297: {
    introduction: "Increasing / Decreasing works this concrete case: If f'(x)>0 on an interval, what is f doing? The labelled answer is increasing. Use derivative signs. Highlights graph intervals by slope sign. A common labelled error is using the sign of f(x) instead of f'(x). Increasing / Decreasing keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A function is increasing where outputs rise as x moves right, and decreasing where outputs fall. In Increasing / Decreasing, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Increasing / Decreasing works this concrete case: If f'(x)>0 on an interval, what is f doing?",
    howItWorks: "Find intervals. Check the sign of f' on each interval. Label increasing or decreasing.",
    whyItWorks: "The derivative sign gives local slope direction.",
    worked: [
      { prompt: "If f'(x)>0 on an interval, what is f doing?", steps: ["Positive derivative means positive slope.", "The graph rises left to right.", "f is increasing."], answer: "increasing" },
      { prompt: "Estimate lim x→4 of (x-4)/(x-4) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=4 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  298: {
    introduction: "Local and Global Extrema works this concrete case: Can a local maximum fail to be global? The labelled answer is yes. Classify maxima and minima. Compares local and interval-wide extreme values. A common labelled error is calling a local maximum automatically global. Local and Global Extrema keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Extrema are maximum or minimum values, either near a point or over the whole domain. In Local and Global Extrema, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Local and Global Extrema works this concrete case: Can a local maximum fail to be global?",
    howItWorks: "Find candidate points. Compare nearby values for local extrema. Compare all allowed values for global extrema.",
    whyItWorks: "A maximum or minimum is defined by comparison with a set of other values.",
    worked: [
      { prompt: "Can a local maximum fail to be global?", steps: ["Local compares nearby values only.", "Some far value may be higher.", "So yes."], answer: "yes" },
      { prompt: "Estimate lim x→5 of (x-5)/(x-5) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=5 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  299: {
    introduction: "Concavity works this concrete case: If f''(x)>0, what is the concavity? The labelled answer is concave up. Use second derivative signs. Highlights concave-up and concave-down regions. A common labelled error is using f' sign to decide concavity. Concavity keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Concavity describes whether a graph bends upward or downward. In Concavity, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Concavity works this concrete case: If f''(x)>0, what is the concavity?",
    howItWorks: "Find the second derivative. Check its sign on intervals. Label the graph concave up or down.",
    whyItWorks: "The second derivative measures how the slope is changing.",
    worked: [
      { prompt: "If f''(x)>0, what is the concavity?", steps: ["Positive second derivative means slopes increase.", "The graph bends upward.", "It is concave up."], answer: "concave up" },
      { prompt: "Estimate lim x→6 of (x-6)/(x-6) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=6 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  300: {
    introduction: "Inflection Points works this concrete case: Is f''=0 enough to prove inflection? The labelled answer is no. Detect concavity changes. Marks and verifies change points. A common labelled error is assuming f''=0 always means inflection. Inflection Points keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An inflection point is where concavity changes. In Inflection Points, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Inflection Points works this concrete case: Is f''=0 enough to prove inflection?",
    howItWorks: "Find possible points from f''=0 or undefined. Check concavity on both sides. Keep points where concavity changes.",
    whyItWorks: "Inflection describes a change in bending direction.",
    worked: [
      { prompt: "Is f''=0 enough to prove inflection?", steps: ["It gives a candidate.", "Concavity must change sign.", "So no."], answer: "no" },
      { prompt: "Estimate lim x→7 of (x-7)/(x-7) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=7 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  301: {
    introduction: "Optimisation works this concrete case: Why compare endpoints in optimisation? The labelled answer is boundary can win. Apply derivatives to extrema problems. Builds editable geometric or business scenarios. A common labelled error is stopping after finding one critical point. Optimisation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Optimisation uses calculus to find the best maximum or minimum value under conditions. In Optimisation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Optimisation works this concrete case: Why compare endpoints in optimisation?",
    howItWorks: "Define the variable and objective function. Apply constraints. Differentiate, find candidates, and compare values.",
    whyItWorks: "Extrema occur at critical points or boundaries in many optimization problems.",
    worked: [
      { prompt: "Why compare endpoints in optimisation?", steps: ["The best value may occur at a boundary.", "Critical points are not the only candidates.", "Endpoints must be checked."], answer: "boundary can win" },
      { prompt: "Estimate lim x→8 of (x-8)/(x-8) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=8 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  302: {
    introduction: "Related Rates works this concrete case: If A=pi r^2, what is dA/dt? The labelled answer is 2pi r dr/dt. Model linked changing quantities. Animates variables and their rates. A common labelled error is differentiating with respect to x when time rates are asked. Related Rates keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Related rates use derivatives to connect changing quantities linked by an equation. In Related Rates, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Related Rates works this concrete case: If A=pi r^2, what is dA/dt?",
    howItWorks: "Write an equation linking the quantities. Differentiate both sides with respect to time. Substitute known values and solve.",
    whyItWorks: "If quantities are linked, their rates of change are linked too.",
    worked: [
      { prompt: "If A=pi r^2, what is dA/dt?", steps: ["Differentiate with respect to t.", "Use chain rule on r.", "dA/dt=2pi r dr/dt."], answer: "2pi r dr/dt" },
      { prompt: "Estimate lim x→9 of (x-9)/(x-9) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=9 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  303: {
    introduction: "Motion Analysis works this concrete case: If s(t)=t^2, find v(t). The labelled answer is 2t. Connect position, velocity and acceleration. Synchronises three graphs and moving objects. A common labelled error is using position value as velocity. Motion Analysis keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Motion analysis uses derivatives of position to study velocity and acceleration. In Motion Analysis, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Motion Analysis works this concrete case: If s(t)=t^2, find v(t).",
    howItWorks: "Start with position as a function of time. Differentiate once for velocity. Differentiate again for acceleration.",
    whyItWorks: "Velocity is rate of position change, and acceleration is rate of velocity change.",
    worked: [
      { prompt: "If s(t)=t^2, find v(t).", steps: ["Velocity is s'(t).", "Derivative of t^2 is 2t.", "v(t)=2t."], answer: "2t" },
      { prompt: "Estimate lim x→10 of (x-10)/(x-10) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=10 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  304: {
    introduction: "Newton's Method works this concrete case: What must not be zero in Newton's method? The labelled answer is f'(x_n). Approximate roots iteratively. Shows tangent-based iterations and convergence. A common labelled error is trusting an iteration without checking f(x). Newton's Method keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Newton's method uses tangent lines to approximate roots of equations. In Newton's Method, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Newton's Method works this concrete case: What must not be zero in Newton's method?",
    howItWorks: "Choose a starting estimate. Evaluate f and f'. Apply the update formula. Repeat and check the residual.",
    whyItWorks: "The tangent line near a root often meets the x-axis closer to the real root.",
    worked: [
      { prompt: "What must not be zero in Newton's method?", steps: ["The formula divides by f'(x_n).", "Division by zero is invalid.", "f'(x_n) must not be zero."], answer: "f'(x_n)" },
      { prompt: "Estimate lim x→3 of (x-3)/(x-3) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=3 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  305: {
    introduction: "Taylor Polynomial works this concrete case: What is the first Taylor polynomial for f near a? The labelled answer is tangent line. Approximate functions locally. Increases polynomial degree and displays approximation error. A common labelled error is thinking a Taylor polynomial is always exact everywhere. Taylor Polynomial keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A Taylor polynomial approximates a function near a point using derivative values at that point. In Taylor Polynomial, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Taylor Polynomial works this concrete case: What is the first Taylor polynomial for f near a?",
    howItWorks: "Choose a centre a. Use function and derivative values at a. Build polynomial terms up to the chosen degree.",
    whyItWorks: "Matching derivatives makes the polynomial share local behaviour with the function.",
    worked: [
      { prompt: "What is the first Taylor polynomial for f near a?", steps: ["Degree 1 uses value and first derivative.", "It is tangent-line approximation.", "P1=f(a)+f'(a)(x-a)."], answer: "tangent line" },
      { prompt: "Estimate lim x→4 of (x-4)/(x-4) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=4 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  306: {
    introduction: "Area by Rectangles works this concrete case: Find the labelled area by rectangles for base 5 and height 2. The labelled answer is 10. Develop integral intuition. Builds left, right and midpoint rectangle sums. A common labelled error is using a nearby formula that is not the Area by Rectangles rule. Area by Rectangles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Area by Rectangles is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Area by Rectangles works this concrete case: Find the labelled area by rectangles for base 5 and height 2.",
    howItWorks: "Read the Area by Rectangles inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Area by Rectangles works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find the labelled area by rectangles for base 5 and height 2.", steps: ["Use the Area by Rectangles formula.", "5 and 2 are the measured sides.", "The value is 10."], answer: "10" },
      { prompt: "If the height doubles from 2 to 4, what happens to this area model?", steps: ["Area scales with perpendicular height.", "New height 4.", "It doubles."], answer: "doubles" },
      { prompt: "Is perimeter 5+2 the same as area by rectangles?", steps: ["Perimeter is boundary length.", "Area is interior measure.", "No."], answer: "no" }
    ],
  },
  307: {
    introduction: "Riemann Sums works this concrete case: Find ∫ 3x dx from 0 to 6. The labelled answer is 54. Understand convergence of area estimates. Increases partition count and compares estimates. A common labelled error is using a nearby formula that is not the Riemann Sums rule. Riemann Sums keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Riemann Sums is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Riemann Sums works this concrete case: Find ∫ 3x dx from 0 to 6.",
    howItWorks: "Read the Riemann Sums inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Riemann Sums works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 3x dx from 0 to 6.", steps: ["Antiderivative 3/2 x^2.", "Evaluate at 6 minus 0.", "54."], answer: "54" },
      { prompt: "If F'=3, what is F(6)-F(0) when F(t)=3t?", steps: ["F(6)=18.", "F(0)=0.", "18."], answer: "18" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  308: {
    introduction: "Definite Integral works this concrete case: Find ∫ 4x dx from 0 to 7. The labelled answer is 98. Calculate signed area. Shades and measures area over a chosen interval. A common labelled error is using a nearby formula that is not the Definite Integral rule. Definite Integral keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Definite Integral is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Definite Integral works this concrete case: Find ∫ 4x dx from 0 to 7.",
    howItWorks: "Read the Definite Integral inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Definite Integral works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 4x dx from 0 to 7.", steps: ["Antiderivative 2.0 x^2.", "Evaluate at 7 minus 0.", "98."], answer: "98" },
      { prompt: "If F'=4, what is F(7)-F(0) when F(t)=4t?", steps: ["F(7)=28.", "F(0)=0.", "28."], answer: "28" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  309: {
    introduction: "Indefinite Integral works this concrete case: Find ∫ 5x dx from 0 to 8. The labelled answer is 160. Understand antiderivative families. Plots vertical-shifted antiderivatives. A common labelled error is using a nearby formula that is not the Indefinite Integral rule. Indefinite Integral keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Indefinite Integral is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Indefinite Integral works this concrete case: Find ∫ 5x dx from 0 to 8.",
    howItWorks: "Read the Indefinite Integral inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Indefinite Integral works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 5x dx from 0 to 8.", steps: ["Antiderivative 5/2 x^2.", "Evaluate at 8 minus 0.", "160."], answer: "160" },
      { prompt: "If F'=5, what is F(8)-F(0) when F(t)=5t?", steps: ["F(8)=40.", "F(0)=0.", "40."], answer: "40" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  310: {
    introduction: "Fundamental Theorem works this concrete case: Find ∫ 6x dx from 0 to 9. The labelled answer is 243. Connect differentiation and accumulation. Builds an accumulation function and its derivative. A common labelled error is using a nearby formula that is not the Fundamental Theorem rule. Fundamental Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Fundamental Theorem is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Fundamental Theorem works this concrete case: Find ∫ 6x dx from 0 to 9.",
    howItWorks: "Read the Fundamental Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Fundamental Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 6x dx from 0 to 9.", steps: ["Antiderivative 3.0 x^2.", "Evaluate at 9 minus 0.", "243."], answer: "243" },
      { prompt: "If F'=6, what is F(9)-F(0) when F(t)=6t?", steps: ["F(9)=54.", "F(0)=0.", "54."], answer: "54" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  311: {
    introduction: "Area Between Curves works this concrete case: Find the labelled area between curves for base 10 and height 7. The labelled answer is 70. Measure bounded regions. Finds intersections and shades the difference. A common labelled error is using a nearby formula that is not the Area Between Curves rule. Area Between Curves keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Area Between Curves is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Area Between Curves works this concrete case: Find the labelled area between curves for base 10 and height 7.",
    howItWorks: "Read the Area Between Curves inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Area Between Curves works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find the labelled area between curves for base 10 and height 7.", steps: ["Use the Area Between Curves formula.", "10 and 7 are the measured sides.", "The value is 70."], answer: "70" },
      { prompt: "If the height doubles from 7 to 14, what happens to this area model?", steps: ["Area scales with perpendicular height.", "New height 14.", "It doubles."], answer: "doubles" },
      { prompt: "Is perimeter 10+7 the same as area between curves?", steps: ["Perimeter is boundary length.", "Area is interior measure.", "No."], answer: "no" }
    ],
  },
  312: {
    introduction: "Substitution works this concrete case: Find ∫ 2x dx from 0 to 3. The labelled answer is 9. Reverse the chain rule. Shows variable replacement and transformed bounds. A common labelled error is using a nearby formula that is not the Substitution rule. Substitution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Substitution is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Substitution works this concrete case: Find ∫ 2x dx from 0 to 3.",
    howItWorks: "Read the Substitution inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Substitution works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 2x dx from 0 to 3.", steps: ["Antiderivative 1.0 x^2.", "Evaluate at 3 minus 0.", "9."], answer: "9" },
      { prompt: "If F'=2, what is F(3)-F(0) when F(t)=2t?", steps: ["F(3)=6.", "F(0)=0.", "6."], answer: "6" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  313: {
    introduction: "Integration by Parts works this concrete case: Find ∫ 3x dx from 0 to 4. The labelled answer is 24. Integrate products. Displays tabular or formula-based steps. A common labelled error is using a nearby formula that is not the Integration by Parts rule. Integration by Parts keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Integration by Parts is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Integration by Parts works this concrete case: Find ∫ 3x dx from 0 to 4.",
    howItWorks: "Read the Integration by Parts inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Integration by Parts works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 3x dx from 0 to 4.", steps: ["Antiderivative 3/2 x^2.", "Evaluate at 4 minus 0.", "24."], answer: "24" },
      { prompt: "If F'=3, what is F(4)-F(0) when F(t)=3t?", steps: ["F(4)=12.", "F(0)=0.", "12."], answer: "12" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  314: {
    introduction: "Partial Fractions works this concrete case: Find ∫ 4x dx from 0 to 5. The labelled answer is 50. Integrate rational functions. Decomposes functions before integration. A common labelled error is using a nearby formula that is not the Partial Fractions rule. Partial Fractions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Partial Fractions is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Partial Fractions works this concrete case: Find ∫ 4x dx from 0 to 5.",
    howItWorks: "Read the Partial Fractions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Partial Fractions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 4x dx from 0 to 5.", steps: ["Antiderivative 2.0 x^2.", "Evaluate at 5 minus 0.", "50."], answer: "50" },
      { prompt: "If F'=4, what is F(5)-F(0) when F(t)=4t?", steps: ["F(5)=20.", "F(0)=0.", "20."], answer: "20" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  315: {
    introduction: "Improper Integrals works this concrete case: Find ∫ 5x dx from 0 to 6. The labelled answer is 90. Explore unbounded regions. Shows limiting area as bounds approach infinity or singularities. A common labelled error is using a nearby formula that is not the Improper Integrals rule. Improper Integrals keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Improper Integrals is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Improper Integrals works this concrete case: Find ∫ 5x dx from 0 to 6.",
    howItWorks: "Read the Improper Integrals inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Improper Integrals works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 5x dx from 0 to 6.", steps: ["Antiderivative 5/2 x^2.", "Evaluate at 6 minus 0.", "90."], answer: "90" },
      { prompt: "If F'=5, what is F(6)-F(0) when F(t)=5t?", steps: ["F(6)=30.", "F(0)=0.", "30."], answer: "30" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  316: {
    introduction: "Numerical Integration works this concrete case: Find ∫ 6x dx from 0 to 7. The labelled answer is 147. Approximate integrals. Applies trapezoidal and Simpson methods. A common labelled error is using a nearby formula that is not the Numerical Integration rule. Numerical Integration keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Numerical Integration is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Numerical Integration works this concrete case: Find ∫ 6x dx from 0 to 7.",
    howItWorks: "Read the Numerical Integration inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Numerical Integration works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 6x dx from 0 to 7.", steps: ["Antiderivative 3.0 x^2.", "Evaluate at 7 minus 0.", "147."], answer: "147" },
      { prompt: "If F'=6, what is F(7)-F(0) when F(t)=6t?", steps: ["F(7)=42.", "F(0)=0.", "42."], answer: "42" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  317: {
    introduction: "Volume by Slicing works this concrete case: Find ∫ 7x dx from 0 to 8. The labelled answer is 224. Build volume from cross-sections. Animates slices and accumulates volume. A common labelled error is using a nearby formula that is not the Volume by Slicing rule. Volume by Slicing keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Volume by Slicing is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Volume by Slicing works this concrete case: Find ∫ 7x dx from 0 to 8.",
    howItWorks: "Read the Volume by Slicing inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Volume by Slicing works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 7x dx from 0 to 8.", steps: ["Antiderivative 7/2 x^2.", "Evaluate at 8 minus 0.", "224."], answer: "224" },
      { prompt: "If F'=7, what is F(8)-F(0) when F(t)=7t?", steps: ["F(8)=56.", "F(0)=0.", "56."], answer: "56" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  318: {
    introduction: "Disc and Washer Methods works this concrete case: Find ∫ 2x dx from 0 to 9. The labelled answer is 81. Generate solids of revolution. Rotates regions and displays radii. A common labelled error is using a nearby formula that is not the Disc and Washer Methods rule. Disc and Washer Methods keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Disc and Washer Methods is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Disc and Washer Methods works this concrete case: Find ∫ 2x dx from 0 to 9.",
    howItWorks: "Read the Disc and Washer Methods inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Disc and Washer Methods works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 2x dx from 0 to 9.", steps: ["Antiderivative 1.0 x^2.", "Evaluate at 9 minus 0.", "81."], answer: "81" },
      { prompt: "If F'=2, what is F(9)-F(0) when F(t)=2t?", steps: ["F(9)=18.", "F(0)=0.", "18."], answer: "18" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  319: {
    introduction: "Shell Method works this concrete case: Find ∫ 3x dx from 0 to 10. The labelled answer is 150. Use cylindrical shells. Animates shell accumulation. A common labelled error is using a nearby formula that is not the Shell Method rule. Shell Method keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Shell Method is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Shell Method works this concrete case: Find ∫ 3x dx from 0 to 10.",
    howItWorks: "Read the Shell Method inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Shell Method works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 3x dx from 0 to 10.", steps: ["Antiderivative 3/2 x^2.", "Evaluate at 10 minus 0.", "150."], answer: "150" },
      { prompt: "If F'=3, what is F(10)-F(0) when F(t)=3t?", steps: ["F(10)=30.", "F(0)=0.", "30."], answer: "30" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  320: {
    introduction: "Arc Length works this concrete case: Find ∫ 4x dx from 0 to 3. The labelled answer is 18. Measure curved paths. Approximates curves with segments then integrates. A common labelled error is using a nearby formula that is not the Arc Length rule. Arc Length keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Arc Length is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Arc Length works this concrete case: Find ∫ 4x dx from 0 to 3.",
    howItWorks: "Read the Arc Length inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Arc Length works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 4x dx from 0 to 3.", steps: ["Antiderivative 2.0 x^2.", "Evaluate at 3 minus 0.", "18."], answer: "18" },
      { prompt: "If F'=4, what is F(3)-F(0) when F(t)=4t?", steps: ["F(3)=12.", "F(0)=0.", "12."], answer: "12" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  321: {
    introduction: "Surface Area of Revolution works this concrete case: Find ∫ 5x dx from 0 to 4. The labelled answer is 40. Measure rotated surfaces. Rotates a curve and calculates surface area. A common labelled error is using a nearby formula that is not the Surface Area of Revolution rule. Surface Area of Revolution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Surface Area of Revolution is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Surface Area of Revolution works this concrete case: Find ∫ 5x dx from 0 to 4.",
    howItWorks: "Read the Surface Area of Revolution inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Surface Area of Revolution works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 5x dx from 0 to 4.", steps: ["Antiderivative 5/2 x^2.", "Evaluate at 4 minus 0.", "40."], answer: "40" },
      { prompt: "If F'=5, what is F(4)-F(0) when F(t)=5t?", steps: ["F(4)=20.", "F(0)=0.", "20."], answer: "20" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  322: {
    introduction: "Accumulation Functions works this concrete case: Find ∫ 6x dx from 0 to 5. The labelled answer is 75. Understand variable upper bounds. Moves an endpoint and updates accumulated area. A common labelled error is using a nearby formula that is not the Accumulation Functions rule. Accumulation Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Accumulation Functions is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Accumulation Functions works this concrete case: Find ∫ 6x dx from 0 to 5.",
    howItWorks: "Read the Accumulation Functions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Accumulation Functions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 6x dx from 0 to 5.", steps: ["Antiderivative 3.0 x^2.", "Evaluate at 5 minus 0.", "75."], answer: "75" },
      { prompt: "If F'=6, what is F(5)-F(0) when F(t)=6t?", steps: ["F(5)=30.", "F(0)=0.", "30."], answer: "30" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  323: {
    introduction: "Direction Fields works this concrete case: Find ∫ 7x dx from 0 to 6. The labelled answer is 126. Visualise differential equations. Displays slope segments over the plane. A common labelled error is using a nearby formula that is not the Direction Fields rule. Direction Fields keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Direction Fields is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Direction Fields works this concrete case: Find ∫ 7x dx from 0 to 6.",
    howItWorks: "Read the Direction Fields inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Direction Fields works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 7x dx from 0 to 6.", steps: ["Antiderivative 7/2 x^2.", "Evaluate at 6 minus 0.", "126."], answer: "126" },
      { prompt: "If F'=7, what is F(6)-F(0) when F(t)=7t?", steps: ["F(6)=42.", "F(0)=0.", "42."], answer: "42" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  324: {
    introduction: "Euler's Method works this concrete case: Find ∫ 2x dx from 0 to 7. The labelled answer is 49. Approximate solution curves. Steps numerically through a direction field. A common labelled error is using a nearby formula that is not the Euler's Method rule. Euler's Method keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Euler's Method is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Euler's Method works this concrete case: Find ∫ 2x dx from 0 to 7.",
    howItWorks: "Read the Euler's Method inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Euler's Method works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 2x dx from 0 to 7.", steps: ["Antiderivative 1.0 x^2.", "Evaluate at 7 minus 0.", "49."], answer: "49" },
      { prompt: "If F'=2, what is F(7)-F(0) when F(t)=2t?", steps: ["F(7)=14.", "F(0)=0.", "14."], answer: "14" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  325: {
    introduction: "Separable Equations works this concrete case: Find ∫ 3x dx from 0 to 8. The labelled answer is 96. Connect symbolic and graphical solutions. Plots solution families and chosen initial conditions. A common labelled error is using a nearby formula that is not the Separable Equations rule. Separable Equations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Separable Equations is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Separable Equations works this concrete case: Find ∫ 3x dx from 0 to 8.",
    howItWorks: "Read the Separable Equations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Separable Equations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 3x dx from 0 to 8.", steps: ["Antiderivative 3/2 x^2.", "Evaluate at 8 minus 0.", "96."], answer: "96" },
      { prompt: "If F'=3, what is F(8)-F(0) when F(t)=3t?", steps: ["F(8)=24.", "F(0)=0.", "24."], answer: "24" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  326: {
    introduction: "First-Order Linear Equations works this concrete case: Find ∫ 4x dx from 0 to 9. The labelled answer is 162. Explore integrating factors. Shows symbolic solution and direction field. A common labelled error is using a nearby formula that is not the First-Order Linear Equations rule. First-Order Linear Equations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "First-Order Linear Equations is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "First-Order Linear Equations works this concrete case: Find ∫ 4x dx from 0 to 9.",
    howItWorks: "Read the First-Order Linear Equations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "First-Order Linear Equations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 4x dx from 0 to 9.", steps: ["Antiderivative 2.0 x^2.", "Evaluate at 9 minus 0.", "162."], answer: "162" },
      { prompt: "If F'=4, what is F(9)-F(0) when F(t)=4t?", steps: ["F(9)=36.", "F(0)=0.", "36."], answer: "36" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  327: {
    introduction: "Logistic Growth works this concrete case: Find ∫ 5x dx from 0 to 10. The labelled answer is 250. Model limited population growth. Adjusts carrying capacity and growth rate. A common labelled error is using a nearby formula that is not the Logistic Growth rule. Logistic Growth keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Logistic Growth is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Logistic Growth works this concrete case: Find ∫ 5x dx from 0 to 10.",
    howItWorks: "Read the Logistic Growth inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Logistic Growth works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 5x dx from 0 to 10.", steps: ["Antiderivative 5/2 x^2.", "Evaluate at 10 minus 0.", "250."], answer: "250" },
      { prompt: "If F'=5, what is F(10)-F(0) when F(t)=5t?", steps: ["F(10)=50.", "F(0)=0.", "50."], answer: "50" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  328: {
    introduction: "Second-Order Equations works this concrete case: Find ∫ 6x dx from 0 to 3. The labelled answer is 27. Explore oscillation. Plots solution curves for mechanical systems. A common labelled error is using a nearby formula that is not the Second-Order Equations rule. Second-Order Equations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Second-Order Equations is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Second-Order Equations works this concrete case: Find ∫ 6x dx from 0 to 3.",
    howItWorks: "Read the Second-Order Equations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Second-Order Equations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 6x dx from 0 to 3.", steps: ["Antiderivative 3.0 x^2.", "Evaluate at 3 minus 0.", "27."], answer: "27" },
      { prompt: "If F'=6, what is F(3)-F(0) when F(t)=6t?", steps: ["F(3)=18.", "F(0)=0.", "18."], answer: "18" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  329: {
    introduction: "Phase Plane works this concrete case: Find ∫ 7x dx from 0 to 4. The labelled answer is 56. Analyse coupled systems. Plots trajectories in state space. A common labelled error is using a nearby formula that is not the Phase Plane rule. Phase Plane keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Phase Plane is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Phase Plane works this concrete case: Find ∫ 7x dx from 0 to 4.",
    howItWorks: "Read the Phase Plane inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Phase Plane works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 7x dx from 0 to 4.", steps: ["Antiderivative 7/2 x^2.", "Evaluate at 4 minus 0.", "56."], answer: "56" },
      { prompt: "If F'=7, what is F(4)-F(0) when F(t)=7t?", steps: ["F(4)=28.", "F(0)=0.", "28."], answer: "28" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  330: {
    introduction: "Equilibrium and Stability works this concrete case: Find ∫ 2x dx from 0 to 5. The labelled answer is 25. Classify steady states. Shows nearby trajectories around equilibria. A common labelled error is using a nearby formula that is not the Equilibrium and Stability rule. Equilibrium and Stability keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Equilibrium and Stability is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Equilibrium and Stability works this concrete case: Find ∫ 2x dx from 0 to 5.",
    howItWorks: "Read the Equilibrium and Stability inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Equilibrium and Stability works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 2x dx from 0 to 5.", steps: ["Antiderivative 1.0 x^2.", "Evaluate at 5 minus 0.", "25."], answer: "25" },
      { prompt: "If F'=2, what is F(5)-F(0) when F(t)=2t?", steps: ["F(5)=10.", "F(0)=0.", "10."], answer: "10" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  331: {
    introduction: "Discrete Dynamical Systems works this concrete case: Find ∫ 3x dx from 0 to 6. The labelled answer is 54. Iterate recurrence models. Generates sequence orbits from selected seeds. A common labelled error is using a nearby formula that is not the Discrete Dynamical Systems rule. Discrete Dynamical Systems keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete Dynamical Systems is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Discrete Dynamical Systems works this concrete case: Find ∫ 3x dx from 0 to 6.",
    howItWorks: "Read the Discrete Dynamical Systems inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Discrete Dynamical Systems works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 3x dx from 0 to 6.", steps: ["Antiderivative 3/2 x^2.", "Evaluate at 6 minus 0.", "54."], answer: "54" },
      { prompt: "If F'=3, what is F(6)-F(0) when F(t)=3t?", steps: ["F(6)=18.", "F(0)=0.", "18."], answer: "18" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  332: {
    introduction: "Cobweb Diagrams works this concrete case: Find ∫ 4x dx from 0 to 7. The labelled answer is 98. Visualise iteration. Draws alternating vertical and horizontal steps. A common labelled error is using a nearby formula that is not the Cobweb Diagrams rule. Cobweb Diagrams keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Cobweb Diagrams is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Cobweb Diagrams works this concrete case: Find ∫ 4x dx from 0 to 7.",
    howItWorks: "Read the Cobweb Diagrams inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Cobweb Diagrams works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 4x dx from 0 to 7.", steps: ["Antiderivative 2.0 x^2.", "Evaluate at 7 minus 0.", "98."], answer: "98" },
      { prompt: "If F'=4, what is F(7)-F(0) when F(t)=4t?", steps: ["F(7)=28.", "F(0)=0.", "28."], answer: "28" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  333: {
    introduction: "Chaos and Bifurcation works this concrete case: Find ∫ 5x dx from 0 to 8. The labelled answer is 160. Explore parameter sensitivity. Generates bifurcation diagrams and nearby trajectories. A common labelled error is using a nearby formula that is not the Chaos and Bifurcation rule. Chaos and Bifurcation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Chaos and Bifurcation is the Integral Calculus and Differential Equations rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Chaos and Bifurcation works this concrete case: Find ∫ 5x dx from 0 to 8.",
    howItWorks: "Read the Chaos and Bifurcation inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Chaos and Bifurcation works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 5x dx from 0 to 8.", steps: ["Antiderivative 5/2 x^2.", "Evaluate at 8 minus 0.", "160."], answer: "160" },
      { prompt: "If F'=5, what is F(8)-F(0) when F(t)=5t?", steps: ["F(8)=40.", "F(0)=0.", "40."], answer: "40" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  334: {
    introduction: "Sequence Generator works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Create explicit or recursive sequences. Generates tables, lists and plots. A common labelled error is treating a sequence as an unordered set. Sequence Generator keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A sequence generator creates ordered terms from a rule. In Sequence Generator, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Sequence Generator works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Sequence Generator inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Sequence Generator works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 6 odd numbers.", steps: ["1+3+...+11.", "The sum is 6^2.", "36."], answer: "36" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  335: {
    introduction: "Arithmetic Sequences works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Explore constant differences. Adjusts first term and common difference. A common labelled error is calling any increasing list arithmetic. Arithmetic Sequences keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An arithmetic sequence has a constant difference between consecutive terms. In Arithmetic Sequences, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Arithmetic Sequences works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Arithmetic Sequences inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Arithmetic Sequences works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 7 odd numbers.", steps: ["1+3+...+13.", "The sum is 7^2.", "49."], answer: "49" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  336: {
    introduction: "Geometric Sequences works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Explore constant ratios. Adjusts first term and common ratio. A common labelled error is using a nearby formula that is not the Geometric Sequences rule. Geometric Sequences keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Geometric Sequences is the Sequences and Series rule that produces one labelled numerical result from the given inputs. In Geometric Sequences, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Geometric Sequences works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Geometric Sequences inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Geometric Sequences works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 2 odd numbers.", steps: ["1+3+...+3.", "The sum is 2^2.", "4."], answer: "4" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  337: {
    introduction: "Recursive Sequences works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Understand recurrence. Generates terms from preceding values. A common labelled error is using a nearby formula that is not the Recursive Sequences rule. Recursive Sequences keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Recursive Sequences is the Sequences and Series rule that produces one labelled numerical result from the given inputs. In Recursive Sequences, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Recursive Sequences works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Recursive Sequences inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Recursive Sequences works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 3 odd numbers.", steps: ["1+3+...+5.", "The sum is 3^2.", "9."], answer: "9" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  338: {
    introduction: "Fibonacci Sequence works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Explore a famous recurrence. Displays terms, ratios and geometric patterns. A common labelled error is using a nearby formula that is not the Fibonacci Sequence rule. Fibonacci Sequence keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Fibonacci Sequence is the Sequences and Series rule that produces one labelled numerical result from the given inputs. In Fibonacci Sequence, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Fibonacci Sequence works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Fibonacci Sequence inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Fibonacci Sequence works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 4 odd numbers.", steps: ["1+3+...+7.", "The sum is 4^2.", "16."], answer: "16" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  339: {
    introduction: "Sigma Notation works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Understand compact summation. Expands and evaluates finite sums. A common labelled error is using a nearby formula that is not the Sigma Notation rule. Sigma Notation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Sigma Notation is the Sequences and Series rule that produces one labelled numerical result from the given inputs. In Sigma Notation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Sigma Notation works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Sigma Notation inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Sigma Notation works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 5 odd numbers.", steps: ["1+3+...+9.", "The sum is 5^2.", "25."], answer: "25" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  340: {
    introduction: "Arithmetic Series works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Derive finite-sum formulas. Builds paired-term visualisations. A common labelled error is using a nearby formula that is not the Arithmetic Series rule. Arithmetic Series keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Arithmetic Series is the Sequences and Series rule that produces one labelled numerical result from the given inputs. In Arithmetic Series, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Arithmetic Series works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Arithmetic Series inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Arithmetic Series works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 6 odd numbers.", steps: ["1+3+...+11.", "The sum is 6^2.", "36."], answer: "36" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  341: {
    introduction: "Geometric Series works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Explore finite and infinite sums. Displays partial sums and limiting values. A common labelled error is using a nearby formula that is not the Geometric Series rule. Geometric Series keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Geometric Series is the Sequences and Series rule that produces one labelled numerical result from the given inputs. In Geometric Series, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Geometric Series works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Geometric Series inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Geometric Series works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 7 odd numbers.", steps: ["1+3+...+13.", "The sum is 7^2.", "49."], answer: "49" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  342: {
    introduction: "Convergence and Divergence works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Classify sequence behaviour. Plots terms and partial sums. A common labelled error is using a nearby formula that is not the Convergence and Divergence rule. Convergence and Divergence keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Convergence and Divergence is the Sequences and Series rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Convergence and Divergence works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Convergence and Divergence inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Convergence and Divergence works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 2 odd numbers.", steps: ["1+3+...+3.", "The sum is 2^2.", "4."], answer: "4" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  343: {
    introduction: "Power Series works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Represent functions as infinite polynomials. Adjusts truncation degree and interval. A common labelled error is using a nearby formula that is not the Power Series rule. Power Series keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Power Series is the Sequences and Series rule that produces one labelled numerical result from the given inputs. In Power Series, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Power Series works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Power Series inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Power Series works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 3 odd numbers.", steps: ["1+3+...+5.", "The sum is 3^2.", "9."], answer: "9" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  344: {
    introduction: "Taylor and Maclaurin Series works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Approximate functions. Compares functions with increasing polynomial degree. A common labelled error is using a nearby formula that is not the Taylor and Maclaurin Series rule. Taylor and Maclaurin Series keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Taylor and Maclaurin Series is the Sequences and Series rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Taylor and Maclaurin Series works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Taylor and Maclaurin Series inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Taylor and Maclaurin Series works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 4 odd numbers.", steps: ["1+3+...+7.", "The sum is 4^2.", "16."], answer: "16" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  345: {
    introduction: "Binomial Series works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Extend binomial expansion. Displays coefficients and convergence restrictions. A common labelled error is using a nearby formula that is not the Binomial Series rule. Binomial Series keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Binomial Series is the Sequences and Series rule that produces one labelled numerical result from the given inputs. In Binomial Series, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Binomial Series works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Binomial Series inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Binomial Series works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 5 odd numbers.", steps: ["1+3+...+9.", "The sum is 5^2.", "25."], answer: "25" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  346: {
    introduction: "Recurrence Modelling works this concrete case: For 2, 4, 8, ... what is term 4? The labelled answer is 16. Apply sequences to real problems. Models finance, population or iterative processes. A common labelled error is using a nearby formula that is not the Recurrence Modelling rule. Recurrence Modelling keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Recurrence Modelling is the Sequences and Series rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Recurrence Modelling works this concrete case: For 2, 4, 8, ... what is term 4?",
    howItWorks: "Read the Recurrence Modelling inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Recurrence Modelling works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 6 odd numbers.", steps: ["1+3+...+11.", "The sum is 6^2.", "36."], answer: "36" },
      { prompt: "Is a sequence the same as its series of partial sums?", steps: ["A sequence is a list.", "A series adds terms.", "No."], answer: "no" }
    ],
  },
  347: {
    introduction: "Matrix Builder works this concrete case: In a_23, which number names the row? The labelled answer is 2. Create matrices easily. Provides editable grids and symbolic entries. A common labelled error is mixing up rows and columns. Matrix Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A matrix is a rectangular array of numbers. In Matrix Builder, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Matrix Builder works this concrete case: In a_23, which number names the row?",
    howItWorks: "Rows go across and columns go down.",
    whyItWorks: "Matrix entry",
    worked: [
      { prompt: "In a_23, which number names the row?", steps: ["Rows go across and columns go down.", "Read the labelled result.", "2"], answer: "2" },
      { prompt: "Find det([[6,7],[0,8]]).", steps: ["6*8-7*0.", "48.", "48."], answer: "48" },
      { prompt: "What is the size of a 7 by 8 product if inner sizes match?", steps: ["Rows from the first matrix.", "Columns from the second.", "7 by 8."], answer: "7 by 8" }
    ],
  },
  348: {
    introduction: "Matrix Addition and Subtraction works this concrete case: If entries are 3 and 5, what is their sum? The labelled answer is 8. Perform element-wise operations. Animates corresponding-entry operations. A common labelled error is adding matrices with different sizes. Matrix Addition and Subtraction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Matrix addition and subtraction combine matching entries. In Matrix Addition and Subtraction, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Matrix Addition and Subtraction works this concrete case: If entries are 3 and 5, what is their sum?",
    howItWorks: "Matrices must have the same dimensions.",
    whyItWorks: "Entry operation",
    worked: [
      { prompt: "If entries are 3 and 5, what is their sum?", steps: ["Matrices must have the same dimensions.", "Read the labelled result.", "8"], answer: "8" },
      { prompt: "Find det([[7,2],[0,9]]).", steps: ["7*9-2*0.", "63.", "63."], answer: "63" },
      { prompt: "What is the size of a 2 by 9 product if inner sizes match?", steps: ["Rows from the first matrix.", "Columns from the second.", "2 by 9."], answer: "2 by 9" }
    ],
  },
  349: {
    introduction: "Scalar Multiplication works this concrete case: If k=3 and an entry is 4, what is the new entry? The labelled answer is 12. Scale matrices. Updates every entry from one scalar. A common labelled error is multiplying only one entry. Scalar Multiplication keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Scalar multiplication multiplies every matrix entry by one number. In Scalar Multiplication, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Scalar Multiplication works this concrete case: If k=3 and an entry is 4, what is the new entry?",
    howItWorks: "Multiply each entry by the scalar.",
    whyItWorks: "Scalar product",
    worked: [
      { prompt: "If k=3 and an entry is 4, what is the new entry?", steps: ["Multiply each entry by the scalar.", "Read the labelled result.", "12"], answer: "12" },
      { prompt: "In Scalar Multiplication, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Scalar Multiplication rule.", "The first stored value is 24.", "24."], answer: "24" },
      { prompt: "Compare the Scalar Multiplication outputs at 8 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "3."], answer: "3" }
    ],
  },
  350: {
    introduction: "Matrix Multiplication works this concrete case: What is A times I? The labelled answer is A. Understand row-by-column products. Highlights active row and column. A common labelled error is multiplying only matching positions. Matrix Multiplication keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Matrix multiplication uses row-by-column dot products. In Matrix Multiplication, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Matrix Multiplication works this concrete case: What is A times I?",
    howItWorks: "Columns of the first matrix must match rows of the second.",
    whyItWorks: "Product entry",
    worked: [
      { prompt: "What is A times I?", steps: ["Columns of the first matrix must match rows of the second.", "Read the labelled result.", "A"], answer: "A" },
      { prompt: "Find det([[9,4],[0,4]]).", steps: ["9*4-4*0.", "36.", "36."], answer: "36" },
      { prompt: "What is the size of a 4 by 4 product if inner sizes match?", steps: ["Rows from the first matrix.", "Columns from the second.", "4 by 4."], answer: "4 by 4" }
    ],
  },
  351: {
    introduction: "Identity Matrix works this concrete case: What is A times I? The labelled answer is A. Understand multiplicative identity. Compares A, AI and IA. A common labelled error is identity matrix. Identity Matrix keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The identity matrix leaves vectors or matrices unchanged. In Identity Matrix, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Identity Matrix works this concrete case: What is A times I?",
    howItWorks: "It has 1s on the main diagonal and 0s elsewhere.",
    whyItWorks: "Identity rule",
    worked: [
      { prompt: "What is A times I?", steps: ["It has 1s on the main diagonal and 0s elsewhere.", "Read the labelled result.", "A"], answer: "A" },
      { prompt: "Find det([[10,5],[0,5]]).", steps: ["10*5-5*0.", "50.", "50."], answer: "50" },
      { prompt: "What is the size of a 5 by 5 product if inner sizes match?", steps: ["Rows from the first matrix.", "Columns from the second.", "5 by 5."], answer: "5 by 5" }
    ],
  },
  352: {
    introduction: "Transpose works this concrete case: In a transpose, row 1 becomes what? The labelled answer is column 1. Swap rows and columns. Animates matrix reflection across the main diagonal. A common labelled error is reversing the order of entries in a row only. Transpose keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The transpose swaps rows and columns. In Transpose, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Transpose works this concrete case: In a transpose, row 1 becomes what?",
    howItWorks: "Entry a_ij moves to position a_ji.",
    whyItWorks: "Transpose entry",
    worked: [
      { prompt: "In a transpose, row 1 becomes what?", steps: ["Entry a_ij moves to position a_ji.", "Read the labelled result.", "column 1"], answer: "column 1" },
      { prompt: "In Transpose, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Transpose rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Transpose outputs at 3 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "6."], answer: "6" }
    ],
  },
  353: {
    introduction: "Determinant works this concrete case: In RREF, what value is each pivot? The labelled answer is 1. Understand scale and invertibility. Links determinant to area or volume change. A common labelled error is using ad+bc. Determinant keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A determinant measures signed area scale for a square matrix. In Determinant, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Determinant works this concrete case: In RREF, what value is each pivot?",
    howItWorks: "For a 2 by 2 matrix, det [[a,b],[c,d]]=ad-bc.",
    whyItWorks: "2 by 2 determinant",
    worked: [
      { prompt: "In RREF, what value is each pivot?", steps: ["For a 2 by 2 matrix, det [[a,b],[c,d]]=ad-bc.", "Read the labelled result.", "1"], answer: "1" },
      { prompt: "Find det([[4,7],[0,7]]).", steps: ["4*7-7*0.", "28.", "28."], answer: "28" },
      { prompt: "What is the size of a 7 by 7 product if inner sizes match?", steps: ["Rows from the first matrix.", "Columns from the second.", "7 by 7."], answer: "7 by 7" }
    ],
  },
  354: {
    introduction: "Matrix Inverse works this concrete case: In RREF, what value is each pivot? The labelled answer is 1. Reverse transformations. Computes inverse and verifies the identity product. A common labelled error is matrix. Matrix Inverse keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A matrix inverse undoes a matrix transformation. In Matrix Inverse, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Matrix Inverse works this concrete case: In RREF, what value is each pivot?",
    howItWorks: "An inverse exists only when the determinant is non-zero.",
    whyItWorks: "Inverse check",
    worked: [
      { prompt: "In RREF, what value is each pivot?", steps: ["An inverse exists only when the determinant is non-zero.", "Read the labelled result.", "1"], answer: "1" },
      { prompt: "Find det([[5,2],[0,8]]).", steps: ["5*8-2*0.", "40.", "40."], answer: "40" },
      { prompt: "What is the size of a 2 by 8 product if inner sizes match?", steps: ["Rows from the first matrix.", "Columns from the second.", "2 by 8."], answer: "2 by 8" }
    ],
  },
  355: {
    introduction: "Row Operations works this concrete case: In RREF, what value is each pivot? The labelled answer is 1. Solve systems systematically. Applies and records elementary row operations. A common labelled error is multiplying a row by zero. Row Operations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Row operations transform a system without changing its solution set. In Row Operations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Row Operations works this concrete case: In RREF, what value is each pivot?",
    howItWorks: "Swap rows, scale a row by a non-zero number, or add a multiple of one row to another.",
    whyItWorks: "Row replacement",
    worked: [
      { prompt: "In RREF, what value is each pivot?", steps: ["Swap rows, scale a row by a non-zero number, or add a multiple of one row to another.", "Read the labelled result.", "1"], answer: "1" },
      { prompt: "In Row Operations, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Row Operations rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Row Operations outputs at 6 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "3."], answer: "3" }
    ],
  },
  356: {
    introduction: "RREF works this concrete case: In RREF, what value is each pivot? The labelled answer is 1. Reach canonical system form. Displays pivots, free variables and solutions. A common labelled error is stopping when zeros are only below pivots. RREF keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "RREF is a simplified row form with leading 1s and zeros above and below pivots. In RREF, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "RREF works this concrete case: In RREF, what value is each pivot?",
    howItWorks: "Each pivot column has one leading 1 and zeros elsewhere.",
    whyItWorks: "RREF pivot",
    worked: [
      { prompt: "In RREF, what value is each pivot?", steps: ["Each pivot column has one leading 1 and zeros elsewhere.", "Read the labelled result.", "1"], answer: "1" },
      { prompt: "In RREF, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the RREF rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the RREF outputs at 7 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "4."], answer: "4" }
    ],
  },
  357: {
    introduction: "Augmented Matrices works this concrete case: In [A|b], what does b represent? The labelled answer is constants. Represent simultaneous equations. Links equations to matrix rows. A common labelled error is coefficient matrix. Augmented Matrices keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An augmented matrix stores coefficients and constants from a linear system. In Augmented Matrices, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Augmented Matrices works this concrete case: In [A|b], what does b represent?",
    howItWorks: "The final column represents the right-hand side.",
    whyItWorks: "Augmented form",
    worked: [
      { prompt: "In [A|b], what does b represent?", steps: ["The final column represents the right-hand side.", "Read the labelled result.", "constants"], answer: "constants" },
      { prompt: "In Augmented Matrices, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Augmented Matrices rule.", "The first stored value is 40.", "40."], answer: "40" },
      { prompt: "Compare the Augmented Matrices outputs at 8 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "5."], answer: "5" }
    ],
  },
  358: {
    introduction: "Linear Transformations works this concrete case: A basis for a plane has how many vectors? The labelled answer is 2. Transform geometric objects. Applies a matrix to a grid and shapes. A common labelled error is transformation. Linear Transformations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A linear transformation preserves vector addition and scalar multiplication. In Linear Transformations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Linear Transformations works this concrete case: A basis for a plane has how many vectors?",
    howItWorks: "A matrix sends input vectors to output vectors linearly.",
    whyItWorks: "Linearity",
    worked: [
      { prompt: "A basis for a plane has how many vectors?", steps: ["A matrix sends input vectors to output vectors linearly.", "Read the labelled result.", "2"], answer: "2" },
      { prompt: "Translate ( 9, 6 ) by vector <5, 1>.", steps: ["Add the vector.", "(14, 7).", "(14, 7)."], answer: "(14, 7)" },
      { prompt: "Rotate ( 9, 0 ) by 90° about the origin.", steps: ["(x,y) → (−y,x).", "(0, 9).", "(0, 9)."], answer: "(0, 9)" }
    ],
  },
  359: {
    introduction: "Eigenvalues and Eigenvectors works this concrete case: Find the eigenvalues of diag(3, 2). The labelled answer is 3 and 2. Find invariant directions. Animates vectors under repeated transformation. A common labelled error is treating the zero vector as an eigenvector because A0=lambda0. Eigenvalues and Eigenvectors keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An eigenvector is a non-zero vector whose direction is unchanged by a linear transformation; its eigenvalue is the scale factor.",
    basicIdea: "Eigenvalues and Eigenvectors works this concrete case: Find the eigenvalues of diag(3, 2).",
    howItWorks: "Solve det(A - lambda I) = 0 for each eigenvalue, then solve (A - lambda I)v = 0 for a corresponding non-zero eigenvector.",
    whyItWorks: "The equation Av = lambda v says that applying A changes only the vector's length or orientation along the same line, so powers of A act predictably on that direction.",
    worked: [
      { prompt: "Find the eigenvalues of diag(3, 2).", steps: ["Compute det(A-lambda I)=(3-lambda)(2-lambda).", "Set the determinant to zero.", "The roots are lambda=3 and lambda=2."], answer: "3 and 2" },
      { prompt: "Find det([[10,7],[0,6]]).", steps: ["10*6-7*0.", "60.", "60."], answer: "60" },
      { prompt: "What is the size of a 7 by 6 product if inner sizes match?", steps: ["Rows from the first matrix.", "Columns from the second.", "7 by 6."], answer: "7 by 6" }
    ],
  },
  360: {
    introduction: "Basis and Dimension works this concrete case: A basis for a plane has how many vectors? The labelled answer is 2. Understand coordinate systems. Shows representation under different bases. A common labelled error is vector space. Basis and Dimension keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A basis is a set of independent vectors that spans a space. In Basis and Dimension, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Basis and Dimension works this concrete case: A basis for a plane has how many vectors?",
    howItWorks: "Dimension is the number of vectors in a basis.",
    whyItWorks: "Basis size",
    worked: [
      { prompt: "A basis for a plane has how many vectors?", steps: ["Dimension is the number of vectors in a basis.", "Read the labelled result.", "2"], answer: "2" },
      { prompt: "In Basis and Dimension, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Basis and Dimension rule.", "The first stored value is 6.", "6."], answer: "6" },
      { prompt: "Compare the Basis and Dimension outputs at 3 and 5. What is the difference?", steps: ["Second input 5.", "Difference uses the same rule.", "2."], answer: "2" }
    ],
  },
  361: {
    introduction: "Linear Independence works this concrete case: In Linear Independence, evaluate the labelled model at input 4. The labelled answer is 12. Test unique directional information. Detects redundant vectors geometrically and algebraically. A common labelled error is ignoring a non-zero combination that gives zero. Linear Independence keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Vectors are linearly independent when none is made from the others. In Linear Independence, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Linear Independence works this concrete case: In Linear Independence, evaluate the labelled model at input 4.",
    howItWorks: "The only zero combination is the trivial one.",
    whyItWorks: "Independence test",
    worked: [
      { prompt: "In Linear Independence, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Linear Independence rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Linear Independence outputs at 4 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Linear Independence restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  362: {
    introduction: "Vector Spaces works this concrete case: Least squares minimises squared what? The labelled answer is residuals. Explore spans and subspaces. Generates combinations of basis vectors. A common labelled error is space. Vector Spaces keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A vector space is a set closed under vector addition and scalar multiplication. In Vector Spaces, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Vector Spaces works this concrete case: Least squares minimises squared what?",
    howItWorks: "Adding vectors or scaling them must stay inside the set.",
    whyItWorks: "Closure",
    worked: [
      { prompt: "Least squares minimises squared what?", steps: ["Adding vectors or scaling them must stay inside the set.", "Read the labelled result.", "residuals"], answer: "residuals" },
      { prompt: "Find |( 5, 4 )|.", steps: ["√(5^2+4^2).", "√41.", "√41."], answer: "√41" },
      { prompt: "Dot ( 5, 4 ) with (1, 0).", steps: ["x-component only.", "5.", "5."], answer: "5" }
    ],
  },
  363: {
    introduction: "Gram–Schmidt works this concrete case: Least squares minimises squared what? The labelled answer is residuals. Create orthogonal bases. Animates projection and subtraction steps. A common labelled error is confusing orthogonal with unit length. Gram–Schmidt keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Gram-Schmidt turns independent vectors into orthogonal vectors. In Gram–Schmidt, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Gram–Schmidt works this concrete case: Least squares minimises squared what?",
    howItWorks: "Subtract projections onto earlier vectors.",
    whyItWorks: "Projection removal",
    worked: [
      { prompt: "Least squares minimises squared what?", steps: ["Subtract projections onto earlier vectors.", "Read the labelled result.", "residuals"], answer: "residuals" },
      { prompt: "In Gram–Schmidt, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Gram–Schmidt rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Gram–Schmidt outputs at 6 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "5."], answer: "5" }
    ],
  },
  364: {
    introduction: "Least Squares works this concrete case: Least squares minimises squared what? The labelled answer is residuals. Fit inconsistent systems. Shows projection onto a column space. A common labelled error is data matrix. Least Squares keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Least squares finds the best approximate solution when exact fit is impossible. In Least Squares, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Least Squares works this concrete case: Least squares minimises squared what?",
    howItWorks: "Minimise the sum of squared residuals.",
    whyItWorks: "Normal equation",
    worked: [
      { prompt: "Least squares minimises squared what?", steps: ["Minimise the sum of squared residuals.", "Read the labelled result.", "residuals"], answer: "residuals" },
      { prompt: "In Least Squares, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Least Squares rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Least Squares outputs at 7 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "6."], answer: "6" }
    ],
  },
  365: {
    introduction: "Complex Plane works this concrete case: Find |8+7i|. The labelled answer is √113. Represent complex values geometrically. Plots values as points or vectors. A common labelled error is plotting the imaginary part on the horizontal axis. Complex Plane keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The complex plane shows a complex number as a point with real and imaginary coordinates. In Complex Plane, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Complex Plane works this concrete case: Find |8+7i|.",
    howItWorks: "Read the Complex Plane inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Complex Plane works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find |8+7i|.", steps: ["√(8^2+7^2).", "√113.", "√113."], answer: "√113" },
      { prompt: "(8+7i)+(5-7i). What is the real part?", steps: ["8+5.", "13.", "13."], answer: "13" },
      { prompt: "Is the modulus of a complex number allowed to be negative?", steps: ["Modulus is a distance.", "Distances are ≥ 0.", "No."], answer: "no" }
    ],
  },
  366: {
    introduction: "Real and Imaginary Parts works this concrete case: Find |9+2i|. The labelled answer is √85. Understand components. Displays projections on real and imaginary axes. A common labelled error is saying the imaginary part of 3+2i is 2i. Real and Imaginary Parts keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The real part is the a in a+bi, and the imaginary part is the coefficient b. In Real and Imaginary Parts, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Real and Imaginary Parts works this concrete case: Find |9+2i|.",
    howItWorks: "Read the Real and Imaginary Parts inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Real and Imaginary Parts works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find |9+2i|.", steps: ["√(9^2+2^2).", "√85.", "√85."], answer: "√85" },
      { prompt: "(9+2i)+(6-2i). What is the real part?", steps: ["9+6.", "15.", "15."], answer: "15" },
      { prompt: "Is the modulus of a complex number allowed to be negative?", steps: ["Modulus is a distance.", "Distances are ≥ 0.", "No."], answer: "no" }
    ],
  },
  367: {
    introduction: "Complex Addition works this concrete case: What is the conjugate of 3+2i? The labelled answer is 3-2i. Visualise vector addition. Uses parallelogram addition. A common labelled error is adding a real part to an imaginary coefficient. Complex Addition keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Complex addition adds real parts together and imaginary parts together. In Complex Addition, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Complex Addition works this concrete case: What is the conjugate of 3+2i?",
    howItWorks: "Add component by component.",
    whyItWorks: "Addition",
    worked: [
      { prompt: "What is the conjugate of 3+2i?", steps: ["Add component by component.", "Read the labelled result.", "3-2i"], answer: "3-2i" },
      { prompt: "Find |10+3i|.", steps: ["√(10^2+3^2).", "√109.", "√109."], answer: "√109" },
      { prompt: "(10+3i)+(7-3i). What is the real part?", steps: ["10+7.", "17.", "17."], answer: "17" }
    ],
  },
  368: {
    introduction: "Complex Multiplication works this concrete case: What is the conjugate of 3+2i? The labelled answer is 3-2i. Interpret scaling and rotation. Animates modulus multiplication and argument addition. A common labelled error is leaving i^2 unchanged. Complex Multiplication keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Complex multiplication expands like algebra and uses i^2=-1. In Complex Multiplication, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Complex Multiplication works this concrete case: What is the conjugate of 3+2i?",
    howItWorks: "Multiply terms, then replace i^2 by -1.",
    whyItWorks: "Multiplication",
    worked: [
      { prompt: "What is the conjugate of 3+2i?", steps: ["Multiply terms, then replace i^2 by -1.", "Read the labelled result.", "3-2i"], answer: "3-2i" },
      { prompt: "Find |3+4i|.", steps: ["√(3^2+4^2).", "√25.", "√25."], answer: "√25" },
      { prompt: "(3+4i)+(8-4i). What is the real part?", steps: ["3+8.", "11.", "11."], answer: "11" }
    ],
  },
  369: {
    introduction: "Complex Conjugate works this concrete case: What is the conjugate of 3+2i? The labelled answer is 3-2i. Understand reflection. Reflects points across the real axis. A common labelled error is changing the real part sign too. Complex Conjugate keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The conjugate changes the sign of the imaginary part. In Complex Conjugate, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Complex Conjugate works this concrete case: What is the conjugate of 3+2i?",
    howItWorks: "The conjugate of a+bi is a-bi.",
    whyItWorks: "Conjugate",
    worked: [
      { prompt: "What is the conjugate of 3+2i?", steps: ["The conjugate of a+bi is a-bi.", "Read the labelled result.", "3-2i"], answer: "3-2i" },
      { prompt: "Find |4+5i|.", steps: ["√(4^2+5^2).", "√41.", "√41."], answer: "√41" },
      { prompt: "(4+5i)+(9-5i). What is the real part?", steps: ["4+9.", "13.", "13."], answer: "13" }
    ],
  },
  370: {
    introduction: "Modulus and Argument works this concrete case: What is |3+4i|? The labelled answer is 5. Measure polar properties. Displays radius and angle. A common labelled error is using the angle as the size. Modulus and Argument keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The modulus is distance from the origin, and the argument is direction angle. In Modulus and Argument, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Modulus and Argument works this concrete case: What is |3+4i|?",
    howItWorks: "Use r=sqrt(a^2+b^2) and theta=atan2(b,a).",
    whyItWorks: "Polar measures",
    worked: [
      { prompt: "What is |3+4i|?", steps: ["Use r=sqrt(a^2+b^2) and theta=atan2(b,a).", "Read the labelled result.", "5"], answer: "5" },
      { prompt: "Find |5+6i|.", steps: ["√(5^2+6^2).", "√61.", "√61."], answer: "√61" },
      { prompt: "(5+6i)+(10-6i). What is the real part?", steps: ["5+10.", "15.", "15."], answer: "15" }
    ],
  },
  371: {
    introduction: "Polar Form works this concrete case: For r=2 and theta=0, what is z? The labelled answer is 2. Convert representations. Switches between a+bi and r(cos θ+i sin θ). A common labelled error is treating r as the real part. Polar Form keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Polar form writes a complex number using size and direction. In Polar Form, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Polar Form works this concrete case: For r=2 and theta=0, what is z?",
    howItWorks: "z=r(cos theta+i sin theta).",
    whyItWorks: "Polar form",
    worked: [
      { prompt: "For r=2 and theta=0, what is z?", steps: ["z=r(cos theta+i sin theta).", "Read the labelled result.", "2"], answer: "2" },
      { prompt: "Find |6+7i|.", steps: ["√(6^2+7^2).", "√85.", "√85."], answer: "√85" },
      { prompt: "(6+7i)+(4-7i). What is the real part?", steps: ["6+4.", "10.", "10."], answer: "10" }
    ],
  },
  372: {
    introduction: "Euler Form works this concrete case: What is e^(i0)? The labelled answer is 1. Connect exponentials and trigonometry. Displays re^(iθ) dynamically. A common labelled error is forgetting the modulus r. Euler Form keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Euler form writes polar complex numbers using e^(i theta). In Euler Form, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Euler Form works this concrete case: What is e^(i0)?",
    howItWorks: "re^(i theta)=r(cos theta+i sin theta).",
    whyItWorks: "Euler form",
    worked: [
      { prompt: "What is e^(i0)?", steps: ["re^(i theta)=r(cos theta+i sin theta).", "Read the labelled result.", "1"], answer: "1" },
      { prompt: "Find |7+2i|.", steps: ["√(7^2+2^2).", "√53.", "√53."], answer: "√53" },
      { prompt: "(7+2i)+(5-2i). What is the real part?", steps: ["7+5.", "12.", "12."], answer: "12" }
    ],
  },
  373: {
    introduction: "Powers works this concrete case: If z=2e^(i theta), what is the modulus of z^3? The labelled answer is 8. Apply De Moivre's theorem. Shows repeated rotation and scaling. A common labelled error is raising real and imaginary parts separately. Powers keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Complex powers are easiest in polar form. In Powers, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Powers works this concrete case: If z=2e^(i theta), what is the modulus of z^3?",
    howItWorks: "Use De Moivre: [r(cos theta+i sin theta)]^n=r^n(cos ntheta+i sin ntheta).",
    whyItWorks: "De Moivre powers",
    worked: [
      { prompt: "If z=2e^(i theta), what is the modulus of z^3?", steps: ["Use De Moivre: [r(cos theta+i sin theta)]^n=r^n(cos ntheta+i sin ntheta).", "Read the labelled result.", "8"], answer: "8" },
      { prompt: "Find |8+3i|.", steps: ["√(8^2+3^2).", "√73.", "√73."], answer: "√73" },
      { prompt: "(8+3i)+(6-3i). What is the real part?", steps: ["8+6.", "14.", "14."], answer: "14" }
    ],
  },
  374: {
    introduction: "Roots works this concrete case: How many cube roots does a non-zero complex number have? The labelled answer is 3. Find evenly spaced complex roots. Plots roots on a circle. A common labelled error is giving only one root when n roots exist. Roots keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Complex roots split angle evenly around a circle. In Roots, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Roots works this concrete case: How many cube roots does a non-zero complex number have?",
    howItWorks: "The n roots have modulus r^(1/n) and angles (theta+2k pi)/n.",
    whyItWorks: "Complex roots",
    worked: [
      { prompt: "How many cube roots does a non-zero complex number have?", steps: ["The n roots have modulus r^(1/n) and angles (theta+2k pi)/n.", "Read the labelled result.", "3"], answer: "3" },
      { prompt: "Find |9+4i|.", steps: ["√(9^2+4^2).", "√97.", "√97."], answer: "√97" },
      { prompt: "(9+4i)+(7-4i). What is the real part?", steps: ["9+7.", "16.", "16."], answer: "16" }
    ],
  },
  375: {
    introduction: "Polynomial Roots works this concrete case: In w=1/z, which input is not allowed? The labelled answer is 0. Include non-real solutions. Displays all roots in the complex plane. A common labelled error is listing one non-real root for a real polynomial without its conjugate. Polynomial Roots keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Polynomial roots are values that make the polynomial equal zero. In Polynomial Roots, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Polynomial Roots works this concrete case: In w=1/z, which input is not allowed?",
    howItWorks: "Non-real complex roots of real-coefficient polynomials occur in conjugate pairs.",
    whyItWorks: "Conjugate root theorem",
    worked: [
      { prompt: "In w=1/z, which input is not allowed?", steps: ["Non-real complex roots of real-coefficient polynomials occur in conjugate pairs.", "Read the labelled result.", "0"], answer: "0" },
      { prompt: "Find |10+5i|.", steps: ["√(10^2+5^2).", "√125.", "√125."], answer: "√125" },
      { prompt: "(10+5i)+(8-5i). What is the real part?", steps: ["10+8.", "18.", "18."], answer: "18" }
    ],
  },
  376: {
    introduction: "Möbius Transformations works this concrete case: In w=1/z, which input is not allowed? The labelled answer is 0. Explore complex mappings. Maps points, circles and lines dynamically. A common labelled error is ignoring where cz+d equals zero. Möbius Transformations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A Mobius transformation maps complex numbers using a fractional linear rule. In Möbius Transformations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Möbius Transformations works this concrete case: In w=1/z, which input is not allowed?",
    howItWorks: "Use w=(az+b)/(cz+d), with cz+d not zero.",
    whyItWorks: "Mobius map",
    worked: [
      { prompt: "In w=1/z, which input is not allowed?", steps: ["Use w=(az+b)/(cz+d), with cz+d not zero.", "Read the labelled result.", "0"], answer: "0" },
      { prompt: "Find |3+6i|.", steps: ["√(3^2+6^2).", "√45.", "√45."], answer: "√45" },
      { prompt: "(3+6i)+(9-6i). What is the real part?", steps: ["3+9.", "12.", "12."], answer: "12" }
    ],
  },
  377: {
    introduction: "Complex Functions works this concrete case: For f(z)=z+1 and z=2+i, what is f(z)? The labelled answer is 3+i. Visualise mappings. Uses domain colouring or mapped grids. A common labelled error is checking only the real part of the output. Complex Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A complex function sends complex inputs to complex outputs. In Complex Functions, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Complex Functions works this concrete case: For f(z)=z+1 and z=2+i, what is f(z)?",
    howItWorks: "Track both real and imaginary parts of the output.",
    whyItWorks: "Complex function",
    worked: [
      { prompt: "For f(z)=z+1 and z=2+i, what is f(z)?", steps: ["Track both real and imaginary parts of the output.", "Read the labelled result.", "3+i"], answer: "3+i" },
      { prompt: "Find |4+7i|.", steps: ["√(4^2+7^2).", "√65.", "√65."], answer: "√65" },
      { prompt: "(4+7i)+(10-7i). What is the real part?", steps: ["4+10.", "14.", "14."], answer: "14" }
    ],
  },
  378: {
    introduction: "3D Coordinate System works this concrete case: How many coordinates locate a 3D point? The labelled answer is 3. Understand spatial axes. Provides orbitable x-y-z axes and planes. A common labelled error is using only x and y. 3D Coordinate System keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A 3D coordinate system locates points with x, y, and z axes. In 3D Coordinate System, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "3D Coordinate System works this concrete case: How many coordinates locate a 3D point?",
    howItWorks: "Use ordered triples (x,y,z).",
    whyItWorks: "3D point",
    worked: [
      { prompt: "How many coordinates locate a 3D point?", steps: ["Use ordered triples (x,y,z).", "Read the labelled result.", "3"], answer: "3" },
      { prompt: "Cube edge 5. Find the volume.", steps: ["V=s^3.", "5^3=125.", "125."], answer: "125" },
      { prompt: "Cube edge 5. Find the surface area.", steps: ["SA=6s^2.", "6*25=150.", "150."], answer: "150" }
    ],
  },
  379: {
    introduction: "3D Points works this concrete case: For P=(2,3,4), what is z? The labelled answer is 4. Plot locations in space. Creates draggable points with coordinate controls. A common labelled error is swapping coordinate order. 3D Points keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A 3D point is an exact position in space. In 3D Points, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "3D Points works this concrete case: For P=(2,3,4), what is z?",
    howItWorks: "The point (a,b,c) has x=a, y=b, and z=c.",
    whyItWorks: "Point coordinates",
    worked: [
      { prompt: "For P=(2,3,4), what is z?", steps: ["The point (a,b,c) has x=a, y=b, and z=c.", "Read the labelled result.", "4"], answer: "4" },
      { prompt: "Cube edge 6. Find the volume.", steps: ["V=s^3.", "6^3=216.", "216."], answer: "216" },
      { prompt: "Cube edge 6. Find the surface area.", steps: ["SA=6s^2.", "6*36=216.", "216."], answer: "216" }
    ],
  },
  380: {
    introduction: "Distance in 3D works this concrete case: What extra object does a point need to define a 3D line? The labelled answer is direction. Measure spatial separation. Builds coordinate differences and distance. A common labelled error is forgetting the z difference. Distance in 3D keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Distance in 3D measures straight-line length between two space points. In Distance in 3D, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Distance in 3D works this concrete case: What extra object does a point need to define a 3D line?",
    howItWorks: "Use the 3D distance formula.",
    whyItWorks: "3D distance",
    worked: [
      { prompt: "What extra object does a point need to define a 3D line?", steps: ["Use the 3D distance formula.", "Read the labelled result.", "direction"], answer: "direction" },
      { prompt: "Cube edge 7. Find the volume.", steps: ["V=s^3.", "7^3=343.", "343."], answer: "343" },
      { prompt: "Cube edge 7. Find the surface area.", steps: ["SA=6s^2.", "6*49=294.", "294."], answer: "294" }
    ],
  },
  381: {
    introduction: "Lines in 3D works this concrete case: What extra object does a point need to define a 3D line? The labelled answer is direction. Construct spatial lines. Creates lines from points, vectors or equations. A common labelled error is giving only one point for a line. Lines in 3D keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A 3D line is described by a point and a direction vector. In Lines in 3D, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Lines in 3D works this concrete case: What extra object does a point need to define a 3D line?",
    howItWorks: "Use r=a+lambda v.",
    whyItWorks: "Vector line",
    worked: [
      { prompt: "What extra object does a point need to define a 3D line?", steps: ["Use r=a+lambda v.", "Read the labelled result.", "direction"], answer: "direction" },
      { prompt: "Cube edge 8. Find the volume.", steps: ["V=s^3.", "8^3=512.", "512."], answer: "512" },
      { prompt: "Cube edge 8. Find the surface area.", steps: ["SA=6s^2.", "6*64=384.", "384."], answer: "384" }
    ],
  },
  382: {
    introduction: "Planes works this concrete case: What vector is perpendicular to a plane? The labelled answer is normal. Construct and graph planes. Creates planes through points, lines or equations. A common labelled error is thinking the normal lies along the plane. Planes keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A plane is a flat surface extending in two independent directions. In Planes, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Planes works this concrete case: What vector is perpendicular to a plane?",
    howItWorks: "A normal vector gives the plane equation.",
    whyItWorks: "Plane equation",
    worked: [
      { prompt: "What vector is perpendicular to a plane?", steps: ["A normal vector gives the plane equation.", "Read the labelled result.", "normal"], answer: "normal" },
      { prompt: "Cube edge 9. Find the volume.", steps: ["V=s^3.", "9^3=729.", "729."], answer: "729" },
      { prompt: "Cube edge 9. Find the surface area.", steps: ["SA=6s^2.", "6*81=486.", "486."], answer: "486" }
    ],
  },
  383: {
    introduction: "Parallel and Perpendicular Planes works this concrete case: If plane normals have dot product 0, what is the plane relationship? The labelled answer is perpendicular. Explore spatial orientation. Builds related planes and measures angles. A common labelled error is testing only points instead of normals. Parallel and Perpendicular Planes keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Plane relationships can be tested with normal vectors. In Parallel and Perpendicular Planes, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Parallel and Perpendicular Planes works this concrete case: If plane normals have dot product 0, what is the plane relationship?",
    howItWorks: "Parallel planes have parallel normals; perpendicular planes have perpendicular normals.",
    whyItWorks: "Plane normal test",
    worked: [
      { prompt: "If plane normals have dot product 0, what is the plane relationship?", steps: ["Parallel planes have parallel normals; perpendicular planes have perpendicular normals.", "Read the labelled result.", "perpendicular"], answer: "perpendicular" },
      { prompt: "Cube edge 10. Find the volume.", steps: ["V=s^3.", "10^3=1000.", "1000."], answer: "1000" },
      { prompt: "Cube edge 10. Find the surface area.", steps: ["SA=6s^2.", "6*100=600.", "600."], answer: "600" }
    ],
  },
  384: {
    introduction: "Line–Plane Intersection works this concrete case: What parameter is solved in a line-plane intersection? The labelled answer is lambda. Find spatial intersections. Computes and marks the intersection point. A common labelled error is trying to see the answer without solving the parameter. Line–Plane Intersection keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A line-plane intersection is where a line meets a plane. In Line–Plane Intersection, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Line–Plane Intersection works this concrete case: What parameter is solved in a line-plane intersection?",
    howItWorks: "Substitute the line equation into the plane equation.",
    whyItWorks: "Intersection test",
    worked: [
      { prompt: "What parameter is solved in a line-plane intersection?", steps: ["Substitute the line equation into the plane equation.", "Read the labelled result.", "lambda"], answer: "lambda" },
      { prompt: "Cube edge 3. Find the volume.", steps: ["V=s^3.", "3^3=27.", "27."], answer: "27" },
      { prompt: "Cube edge 3. Find the surface area.", steps: ["SA=6s^2.", "6*9=54.", "54."], answer: "54" }
    ],
  },
  385: {
    introduction: "Plane–Plane Intersection works this concrete case: Two non-parallel planes usually meet in what? The labelled answer is line. Find intersection lines. Computes and displays the shared line. A common labelled error is expecting one point for two non-parallel planes. Plane–Plane Intersection keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Two non-parallel planes meet in a line. In Plane–Plane Intersection, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Plane–Plane Intersection works this concrete case: Two non-parallel planes usually meet in what?",
    howItWorks: "Solve both plane equations together.",
    whyItWorks: "Plane pair",
    worked: [
      { prompt: "Two non-parallel planes usually meet in what?", steps: ["Solve both plane equations together.", "Read the labelled result.", "line"], answer: "line" },
      { prompt: "Cube edge 4. Find the volume.", steps: ["V=s^3.", "4^3=64.", "64."], answer: "64" },
      { prompt: "Cube edge 4. Find the surface area.", steps: ["SA=6s^2.", "6*16=96.", "96."], answer: "96" }
    ],
  },
  386: {
    introduction: "Angle Between Lines works this concrete case: Which vectors give the angle between lines? The labelled answer is direction. Measure spatial angles. Calculates the acute or directed angle. A common labelled error is using points instead of direction vectors. Angle Between Lines keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The angle between lines is the angle between their direction vectors. In Angle Between Lines, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Angle Between Lines works this concrete case: Which vectors give the angle between lines?",
    howItWorks: "Use the dot product formula.",
    whyItWorks: "Line angle",
    worked: [
      { prompt: "Which vectors give the angle between lines?", steps: ["Use the dot product formula.", "Read the labelled result.", "direction"], answer: "direction" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 50° and 40°. What is the sum?", steps: ["50+40.", "90.", "90."], answer: "90" }
    ],
  },
  387: {
    introduction: "Angle Between Planes works this concrete case: Which vectors give the angle between planes? The labelled answer is normal. Understand dihedral angles. Shows normal vectors and angle. A common labelled error is using random drawn edges instead of normals. Angle Between Planes keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The angle between planes is the angle between their normal vectors. In Angle Between Planes, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Angle Between Planes works this concrete case: Which vectors give the angle between planes?",
    howItWorks: "Use normals in the dot product formula.",
    whyItWorks: "Plane angle",
    worked: [
      { prompt: "Which vectors give the angle between planes?", steps: ["Use normals in the dot product formula.", "Read the labelled result.", "normal"], answer: "normal" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 60° and 50°. What is the sum?", steps: ["60+50.", "110.", "110."], answer: "110" }
    ],
  },
  388: {
    introduction: "Angle Between Line and Plane works this concrete case: Line-plane angle uses line direction and plane what? The labelled answer is normal. Measure inclination. Uses projection and complementary angle. A common labelled error is using the normal angle as the line-plane angle. Angle Between Line and Plane keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The angle between a line and plane is measured from the line to its projection on the plane. In Angle Between Line and Plane, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Angle Between Line and Plane works this concrete case: Line-plane angle uses line direction and plane what?",
    howItWorks: "It is complementary to the angle between the line direction and plane normal.",
    whyItWorks: "Line-plane angle",
    worked: [
      { prompt: "Line-plane angle uses line direction and plane what?", steps: ["It is complementary to the angle between the line direction and plane normal.", "Read the labelled result.", "normal"], answer: "normal" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 70° and 60°. What is the sum?", steps: ["70+60.", "130.", "130."], answer: "130" }
    ],
  },
  389: {
    introduction: "Point-to-Plane Distance works this concrete case: Point-to-plane distance is measured in what direction? The labelled answer is perpendicular. Find shortest spatial distance. Drops and measures a perpendicular. A common labelled error is measuring along the plane surface. Point-to-Plane Distance keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Point-to-plane distance is the shortest perpendicular distance from a point to a plane. In Point-to-Plane Distance, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Point-to-Plane Distance works this concrete case: Point-to-plane distance is measured in what direction?",
    howItWorks: "Use the absolute plane equation divided by normal length.",
    whyItWorks: "Point-plane distance",
    worked: [
      { prompt: "Point-to-plane distance is measured in what direction?", steps: ["Use the absolute plane equation divided by normal length.", "Read the labelled result.", "perpendicular"], answer: "perpendicular" },
      { prompt: "Cube edge 8. Find the volume.", steps: ["V=s^3.", "8^3=512.", "512."], answer: "512" },
      { prompt: "Cube edge 8. Find the surface area.", steps: ["SA=6s^2.", "6*64=384.", "384."], answer: "384" }
    ],
  },
  390: {
    introduction: "3D Vectors works this concrete case: Cube edge 9. Find the volume. The labelled answer is 729. Operate in space. Adds, scales, projects and computes products. A common labelled error is forgetting the z component. 3D Vectors keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A 3D vector has components in x, y, and z directions. In 3D Vectors, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "3D Vectors works this concrete case: Cube edge 9. Find the volume.",
    howItWorks: "Magnitude is sqrt(x^2+y^2+z^2).",
    whyItWorks: "Vector magnitude",
    worked: [
      { prompt: "Cube edge 9. Find the volume.", steps: ["V=s^3.", "9^3=729.", "729."], answer: "729" },
      { prompt: "Cube edge 9. Find the surface area.", steps: ["SA=6s^2.", "6*81=486.", "486."], answer: "486" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  391: {
    introduction: "Cube works this concrete case: Cube edge 10. Find the volume. The labelled answer is 1000. Explore regular hexahedra. Constructs, rotates, measures and unfolds a cube. A common labelled error is using s^2 for volume. Cube keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A cube is a solid with six equal square faces. In Cube, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cube works this concrete case: Cube edge 10. Find the volume.",
    howItWorks: "Volume is side cubed.",
    whyItWorks: "Cube volume",
    worked: [
      { prompt: "Cube edge 10. Find the volume.", steps: ["V=s^3.", "10^3=1000.", "1000."], answer: "1000" },
      { prompt: "Cube edge 10. Find the surface area.", steps: ["SA=6s^2.", "6*100=600.", "600."], answer: "600" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  392: {
    introduction: "Cuboid works this concrete case: How many faces does a tetrahedron have? The labelled answer is 4. Explore rectangular prisms. Adjusts length, width and height. A common labelled error is multiplying only length and width. Cuboid keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A cuboid is a box-shaped solid with rectangular faces. In Cuboid, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cuboid works this concrete case: How many faces does a tetrahedron have?",
    howItWorks: "Volume is length times width times height.",
    whyItWorks: "Cuboid volume",
    worked: [
      { prompt: "How many faces does a tetrahedron have?", steps: ["Volume is length times width times height.", "Read the labelled result.", "4"], answer: "4" },
      { prompt: "Cube edge 3. Find the volume.", steps: ["V=s^3.", "3^3=27.", "27."], answer: "27" },
      { prompt: "Cube edge 3. Find the surface area.", steps: ["SA=6s^2.", "6*9=54.", "54."], answer: "54" }
    ],
  },
  393: {
    introduction: "Prism works this concrete case: How many faces does a tetrahedron have? The labelled answer is 4. Extrude polygonal bases. Creates prisms from editable polygons. A common labelled error is base area. Prism keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A prism has identical parallel bases joined by rectangular side faces. In Prism, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Prism works this concrete case: How many faces does a tetrahedron have?",
    howItWorks: "Volume is base area times height.",
    whyItWorks: "Prism volume",
    worked: [
      { prompt: "How many faces does a tetrahedron have?", steps: ["Volume is base area times height.", "Read the labelled result.", "4"], answer: "4" },
      { prompt: "Cube edge 4. Find the volume.", steps: ["V=s^3.", "4^3=64.", "64."], answer: "64" },
      { prompt: "Cube edge 4. Find the surface area.", steps: ["SA=6s^2.", "6*16=96.", "96."], answer: "96" }
    ],
  },
  394: {
    introduction: "Pyramid works this concrete case: How many faces does a tetrahedron have? The labelled answer is 4. Connect base and apex. Creates pyramids and adjusts height. A common labelled error is base area. Pyramid keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A pyramid has a polygon base and triangular faces meeting at one apex. In Pyramid, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Pyramid works this concrete case: How many faces does a tetrahedron have?",
    howItWorks: "Volume is one third base area times height.",
    whyItWorks: "Pyramid volume",
    worked: [
      { prompt: "How many faces does a tetrahedron have?", steps: ["Volume is one third base area times height.", "Read the labelled result.", "4"], answer: "4" },
      { prompt: "Cube edge 5. Find the volume.", steps: ["V=s^3.", "5^3=125.", "125."], answer: "125" },
      { prompt: "Cube edge 5. Find the surface area.", steps: ["SA=6s^2.", "6*25=150.", "150."], answer: "150" }
    ],
  },
  395: {
    introduction: "Tetrahedron works this concrete case: How many faces does a tetrahedron have? The labelled answer is 4. Explore triangular pyramids. Constructs and measures a tetrahedron. A common labelled error is treating a tetrahedron like a cube. Tetrahedron keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A tetrahedron is a polyhedron with four triangular faces. In Tetrahedron, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Tetrahedron works this concrete case: How many faces does a tetrahedron have?",
    howItWorks: "A regular tetrahedron has all edges equal.",
    whyItWorks: "Regular tetrahedron volume",
    worked: [
      { prompt: "How many faces does a tetrahedron have?", steps: ["A regular tetrahedron has all edges equal.", "Read the labelled result.", "4"], answer: "4" },
      { prompt: "Cube edge 6. Find the volume.", steps: ["V=s^3.", "6^3=216.", "216."], answer: "216" },
      { prompt: "Cube edge 6. Find the surface area.", steps: ["SA=6s^2.", "6*36=216.", "216."], answer: "216" }
    ],
  },
  396: {
    introduction: "Regular Polyhedra works this concrete case: How many Platonic solids are there? The labelled answer is 5. Explore Platonic solids. Creates tetrahedron, cube, octahedron, dodecahedron and icosahedron. A common labelled error is thinking any regular-looking solid is Platonic. Regular Polyhedra keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A regular polyhedron has congruent regular polygon faces and the same arrangement at every vertex. In Regular Polyhedra, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Regular Polyhedra works this concrete case: How many Platonic solids are there?",
    howItWorks: "There are exactly five Platonic solids.",
    whyItWorks: "Platonic solids",
    worked: [
      { prompt: "How many Platonic solids are there?", steps: ["There are exactly five Platonic solids.", "Read the labelled result.", "5"], answer: "5" },
      { prompt: "Cube edge 7. Find the volume.", steps: ["V=s^3.", "7^3=343.", "343."], answer: "343" },
      { prompt: "Cube edge 7. Find the surface area.", steps: ["SA=6s^2.", "6*49=294.", "294."], answer: "294" }
    ],
  },
  397: {
    introduction: "Cylinder works this concrete case: Cube edge 8. Find the volume. The labelled answer is 512. Explore circular extrusion. Adjusts radius and height. A common labelled error is using a nearby formula that is not the Cylinder rule. Cylinder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Cylinder is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs. In Cylinder, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cylinder works this concrete case: Cube edge 8. Find the volume.",
    howItWorks: "Read the Cylinder inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Cylinder works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 8. Find the volume.", steps: ["V=s^3.", "8^3=512.", "512."], answer: "512" },
      { prompt: "Cube edge 8. Find the surface area.", steps: ["SA=6s^2.", "6*64=384.", "384."], answer: "384" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  398: {
    introduction: "Cone works this concrete case: Cube edge 9. Find the volume. The labelled answer is 729. Explore tapering solids. Adjusts radius, height and slant length. A common labelled error is using a nearby formula that is not the Cone rule. Cone keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Cone is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs. In Cone, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cone works this concrete case: Cube edge 9. Find the volume.",
    howItWorks: "Read the Cone inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Cone works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 9. Find the volume.", steps: ["V=s^3.", "9^3=729.", "729."], answer: "729" },
      { prompt: "Cube edge 9. Find the surface area.", steps: ["SA=6s^2.", "6*81=486.", "486."], answer: "486" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  399: {
    introduction: "Sphere works this concrete case: Cube edge 10. Find the volume. The labelled answer is 1000. Explore equal-distance surfaces. Constructs from centre and radius. A common labelled error is using a nearby formula that is not the Sphere rule. Sphere keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Sphere is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs. In Sphere, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Sphere works this concrete case: Cube edge 10. Find the volume.",
    howItWorks: "Read the Sphere inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Sphere works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 10. Find the volume.", steps: ["V=s^3.", "10^3=1000.", "1000."], answer: "1000" },
      { prompt: "Cube edge 10. Find the surface area.", steps: ["SA=6s^2.", "6*100=600.", "600."], answer: "600" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  400: {
    introduction: "Hemisphere works this concrete case: Cube edge 3. Find the volume. The labelled answer is 27. Explore half-sphere geometry. Shows curved and flat surfaces. A common labelled error is using a nearby formula that is not the Hemisphere rule. Hemisphere keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Hemisphere is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs. In Hemisphere, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Hemisphere works this concrete case: Cube edge 3. Find the volume.",
    howItWorks: "Read the Hemisphere inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Hemisphere works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 3. Find the volume.", steps: ["V=s^3.", "3^3=27.", "27."], answer: "27" },
      { prompt: "Cube edge 3. Find the surface area.", steps: ["SA=6s^2.", "6*9=54.", "54."], answer: "54" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  401: {
    introduction: "Frustum works this concrete case: Cube edge 4. Find the volume. The labelled answer is 64. Explore truncated solids. Adjusts top and bottom radii or scale. A common labelled error is using a nearby formula that is not the Frustum rule. Frustum keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Frustum is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs. In Frustum, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Frustum works this concrete case: Cube edge 4. Find the volume.",
    howItWorks: "Read the Frustum inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Frustum works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 4. Find the volume.", steps: ["V=s^3.", "4^3=64.", "64."], answer: "64" },
      { prompt: "Cube edge 4. Find the surface area.", steps: ["SA=6s^2.", "6*16=96.", "96."], answer: "96" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  402: {
    introduction: "Surface of Revolution works this concrete case: Cube edge 5. Find the volume. The labelled answer is 125. Create solids from curves. Rotates selected curves around an axis. A common labelled error is using a nearby formula that is not the Surface of Revolution rule. Surface of Revolution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Surface of Revolution is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Surface of Revolution works this concrete case: Cube edge 5. Find the volume.",
    howItWorks: "Read the Surface of Revolution inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Surface of Revolution works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 5. Find the volume.", steps: ["V=s^3.", "5^3=125.", "125."], answer: "125" },
      { prompt: "Cube edge 5. Find the surface area.", steps: ["SA=6s^2.", "6*25=150.", "150."], answer: "150" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  403: {
    introduction: "Extrusion works this concrete case: Cube edge 6. Find the volume. The labelled answer is 216. Convert 2D regions into 3D. Pulls polygons into prisms. A common labelled error is using a nearby formula that is not the Extrusion rule. Extrusion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Extrusion is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs. In Extrusion, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Extrusion works this concrete case: Cube edge 6. Find the volume.",
    howItWorks: "Read the Extrusion inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Extrusion works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 6. Find the volume.", steps: ["V=s^3.", "6^3=216.", "216."], answer: "216" },
      { prompt: "Cube edge 6. Find the surface area.", steps: ["SA=6s^2.", "6*36=216.", "216."], answer: "216" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  404: {
    introduction: "Nets of Solids works this concrete case: Find the surface area of a 3 by 2 by 1 cuboid from its net. The labelled answer is 22 square units. Connect 3D solids and 2D layouts. Unfolds and refolds solids with an animation slider. A common labelled error is calling any six-square arrangement a cube net. Nets of Solids keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A net is a connected two-dimensional arrangement of faces that folds without overlap to form a three-dimensional solid. In Nets of Solids, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Nets of Solids works this concrete case: Find the surface area of a 3 by 2 by 1 cuboid from its net.",
    howItWorks: "Match every polygon in the net to one face, fold along shared edges, and check that no faces overlap or leave a required face missing.",
    whyItWorks: "Folding preserves each face's shape and edge length, while shared edges act as hinges that determine the final adjacency of faces.",
    worked: [
      { prompt: "Find the surface area of a 3 by 2 by 1 cuboid from its net.", steps: ["Pair the congruent faces: 3x2", "3x1", "and 2x1."], answer: "22 square units" },
      { prompt: "Cube edge 7. Find the volume.", steps: ["V=s^3.", "7^3=343.", "343."], answer: "343" },
      { prompt: "Cube edge 7. Find the surface area.", steps: ["SA=6s^2.", "6*49=294.", "294."], answer: "294" }
    ],
  },
  405: {
    introduction: "Cross-Sections works this concrete case: Cube edge 8. Find the volume. The labelled answer is 512. Understand slices. Moves a plane through a solid and displays the section. A common labelled error is using a nearby formula that is not the Cross-Sections rule. Cross-Sections keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Cross-Sections is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs. In Cross-Sections, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cross-Sections works this concrete case: Cube edge 8. Find the volume.",
    howItWorks: "Read the Cross-Sections inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Cross-Sections works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 8. Find the volume.", steps: ["V=s^3.", "8^3=512.", "512."], answer: "512" },
      { prompt: "Cube edge 8. Find the surface area.", steps: ["SA=6s^2.", "6*64=384.", "384."], answer: "384" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  406: {
    introduction: "Volume works this concrete case: Cube edge 9. Find the volume. The labelled answer is 729. Calculate capacity. Updates volume from dimensions. A common labelled error is using a nearby formula that is not the Volume rule. Volume keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Volume is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs. In Volume, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Volume works this concrete case: Cube edge 9. Find the volume.",
    howItWorks: "Read the Volume inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Volume works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 9. Find the volume.", steps: ["V=s^3.", "9^3=729.", "729."], answer: "729" },
      { prompt: "Cube edge 9. Find the surface area.", steps: ["SA=6s^2.", "6*81=486.", "486."], answer: "486" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  407: {
    introduction: "Surface Area works this concrete case: Cube edge 10. Find the volume. The labelled answer is 1000. Calculate exposed area. Separates and totals faces or curved surfaces. A common labelled error is using a nearby formula that is not the Surface Area rule. Surface Area keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Surface Area is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs. In Surface Area, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Surface Area works this concrete case: Cube edge 10. Find the volume.",
    howItWorks: "Read the Surface Area inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Surface Area works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 10. Find the volume.", steps: ["V=s^3.", "10^3=1000.", "1000."], answer: "1000" },
      { prompt: "Cube edge 10. Find the surface area.", steps: ["SA=6s^2.", "6*100=600.", "600."], answer: "600" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  408: {
    introduction: "Euler's Polyhedron Formula works this concrete case: Cube edge 3. Find the volume. The labelled answer is 27. Relate vertices, edges and faces. Counts features and verifies V-E+F=2. A common labelled error is using a nearby formula that is not the Euler's Polyhedron Formula rule. Euler's Polyhedron Formula keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Euler's Polyhedron Formula is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Euler's Polyhedron Formula works this concrete case: Cube edge 3. Find the volume.",
    howItWorks: "Read the Euler's Polyhedron Formula inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Euler's Polyhedron Formula works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 3. Find the volume.", steps: ["V=s^3.", "3^3=27.", "27."], answer: "27" },
      { prompt: "Cube edge 3. Find the surface area.", steps: ["SA=6s^2.", "6*9=54.", "54."], answer: "54" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  409: {
    introduction: "Transparent / X-Ray Mode works this concrete case: Cube edge 4. Find the volume. The labelled answer is 64. Inspect hidden structure. Adjusts opacity and hidden-line display. A common labelled error is using a nearby formula that is not the Transparent / X-Ray Mode rule. Transparent / X-Ray Mode keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Transparent / X-Ray Mode is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Transparent / X-Ray Mode works this concrete case: Cube edge 4. Find the volume.",
    howItWorks: "Read the Transparent / X-Ray Mode inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Transparent / X-Ray Mode works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 4. Find the volume.", steps: ["V=s^3.", "4^3=64.", "64."], answer: "64" },
      { prompt: "Cube edge 4. Find the surface area.", steps: ["SA=6s^2.", "6*16=96.", "96."], answer: "96" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  410: {
    introduction: "Camera Controls works this concrete case: Cube edge 5. Find the volume. The labelled answer is 125. Navigate spatial models. Supports orbit, pan, zoom and preset views. A common labelled error is using a nearby formula that is not the Camera Controls rule. Camera Controls keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Camera Controls is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs. In Camera Controls, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Camera Controls works this concrete case: Cube edge 5. Find the volume.",
    howItWorks: "Read the Camera Controls inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Camera Controls works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 5. Find the volume.", steps: ["V=s^3.", "5^3=125.", "125."], answer: "125" },
      { prompt: "Cube edge 5. Find the surface area.", steps: ["SA=6s^2.", "6*25=150.", "150."], answer: "150" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  411: {
    introduction: "Orthographic Views works this concrete case: Cube edge 6. Find the volume. The labelled answer is 216. Connect 3D and engineering views. Shows front, top and side views. A common labelled error is using a nearby formula that is not the Orthographic Views rule. Orthographic Views keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Orthographic Views is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Orthographic Views works this concrete case: Cube edge 6. Find the volume.",
    howItWorks: "Read the Orthographic Views inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Orthographic Views works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 6. Find the volume.", steps: ["V=s^3.", "6^3=216.", "216."], answer: "216" },
      { prompt: "Cube edge 6. Find the surface area.", steps: ["SA=6s^2.", "6*36=216.", "216."], answer: "216" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  412: {
    introduction: "AR Placement works this concrete case: Cube edge 7. Find the volume. The labelled answer is 343. Place geometry in physical space. Anchors 3D solids and surfaces in augmented reality. A common labelled error is using a nearby formula that is not the AR Placement rule. AR Placement keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "AR Placement is the 3D Geometry and Solids rule that produces one labelled numerical result from the given inputs. In AR Placement, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "AR Placement works this concrete case: Cube edge 7. Find the volume.",
    howItWorks: "Read the AR Placement inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "AR Placement works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 7. Find the volume.", steps: ["V=s^3.", "7^3=343.", "343."], answer: "343" },
      { prompt: "Cube edge 7. Find the surface area.", steps: ["SA=6s^2.", "6*49=294.", "294."], answer: "294" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  413: {
    introduction: "Surface z=f(x,y) works this concrete case: Cube edge 8. Find the volume. The labelled answer is 512. Visualise two-variable functions. Plots an interactive height surface. A common labelled error is using a nearby formula that is not the Surface z=f(x,y) rule. Surface z=f(x,y) keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Surface z=f(x,y) is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Surface z=f(x,y) works this concrete case: Cube edge 8. Find the volume.",
    howItWorks: "Read the Surface z=f(x,y) inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Surface z=f(x,y) works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 8. Find the volume.", steps: ["V=s^3.", "8^3=512.", "512."], answer: "512" },
      { prompt: "Cube edge 8. Find the surface area.", steps: ["SA=6s^2.", "6*64=384.", "384."], answer: "384" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  414: {
    introduction: "Implicit Surfaces works this concrete case: Cube edge 9. Find the volume. The labelled answer is 729. Graph general spatial equations. Renders surfaces defined by F(x,y,z)=0. A common labelled error is using a nearby formula that is not the Implicit Surfaces rule. Implicit Surfaces keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Implicit Surfaces is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Implicit Surfaces works this concrete case: Cube edge 9. Find the volume.",
    howItWorks: "Read the Implicit Surfaces inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Implicit Surfaces works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 9. Find the volume.", steps: ["V=s^3.", "9^3=729.", "729."], answer: "729" },
      { prompt: "Cube edge 9. Find the surface area.", steps: ["SA=6s^2.", "6*81=486.", "486."], answer: "486" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  415: {
    introduction: "Parametric Surfaces works this concrete case: Cube edge 10. Find the volume. The labelled answer is 1000. Build two-parameter surfaces. Plots x(u,v), y(u,v), z(u,v). A common labelled error is using a nearby formula that is not the Parametric Surfaces rule. Parametric Surfaces keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Parametric Surfaces is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Parametric Surfaces works this concrete case: Cube edge 10. Find the volume.",
    howItWorks: "Read the Parametric Surfaces inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Parametric Surfaces works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 10. Find the volume.", steps: ["V=s^3.", "10^3=1000.", "1000."], answer: "1000" },
      { prompt: "Cube edge 10. Find the surface area.", steps: ["SA=6s^2.", "6*100=600.", "600."], answer: "600" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  416: {
    introduction: "Space Curves works this concrete case: Cube edge 3. Find the volume. The labelled answer is 27. Plot parametric paths in 3D. Animates a point along a spatial curve. A common labelled error is using a nearby formula that is not the Space Curves rule. Space Curves keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Space Curves is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs. In Space Curves, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Space Curves works this concrete case: Cube edge 3. Find the volume.",
    howItWorks: "Read the Space Curves inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Space Curves works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 3. Find the volume.", steps: ["V=s^3.", "3^3=27.", "27."], answer: "27" },
      { prompt: "Cube edge 3. Find the surface area.", steps: ["SA=6s^2.", "6*9=54.", "54."], answer: "54" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  417: {
    introduction: "Quadric Surfaces works this concrete case: Cube edge 4. Find the volume. The labelled answer is 64. Explore standard 3D conics. Displays ellipsoids, hyperboloids and paraboloids. A common labelled error is using a nearby formula that is not the Quadric Surfaces rule. Quadric Surfaces keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Quadric Surfaces is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Quadric Surfaces works this concrete case: Cube edge 4. Find the volume.",
    howItWorks: "Read the Quadric Surfaces inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Quadric Surfaces works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 4. Find the volume.", steps: ["V=s^3.", "4^3=64.", "64."], answer: "64" },
      { prompt: "Cube edge 4. Find the surface area.", steps: ["SA=6s^2.", "6*16=96.", "96."], answer: "96" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  418: {
    introduction: "Cylindrical Coordinates works this concrete case: Cube edge 5. Find the volume. The labelled answer is 125. Use radius-angle-height systems. Builds surfaces and converts coordinates. A common labelled error is using a nearby formula that is not the Cylindrical Coordinates rule. Cylindrical Coordinates keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Cylindrical Coordinates is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Cylindrical Coordinates works this concrete case: Cube edge 5. Find the volume.",
    howItWorks: "Read the Cylindrical Coordinates inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Cylindrical Coordinates works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 5. Find the volume.", steps: ["V=s^3.", "5^3=125.", "125."], answer: "125" },
      { prompt: "Cube edge 5. Find the surface area.", steps: ["SA=6s^2.", "6*25=150.", "150."], answer: "150" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  419: {
    introduction: "Spherical Coordinates works this concrete case: Cube edge 6. Find the volume. The labelled answer is 216. Use radius and two angles. Builds and converts spherical-coordinate objects. A common labelled error is using a nearby formula that is not the Spherical Coordinates rule. Spherical Coordinates keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Spherical Coordinates is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Spherical Coordinates works this concrete case: Cube edge 6. Find the volume.",
    howItWorks: "Read the Spherical Coordinates inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Spherical Coordinates works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 6. Find the volume.", steps: ["V=s^3.", "6^3=216.", "216."], answer: "216" },
      { prompt: "Cube edge 6. Find the surface area.", steps: ["SA=6s^2.", "6*36=216.", "216."], answer: "216" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  420: {
    introduction: "Contour Curves works this concrete case: Cube edge 7. Find the volume. The labelled answer is 343. Connect surfaces and level maps. Shows constant-height curves. A common labelled error is using a nearby formula that is not the Contour Curves rule. Contour Curves keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Contour Curves is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs. In Contour Curves, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Contour Curves works this concrete case: Cube edge 7. Find the volume.",
    howItWorks: "Read the Contour Curves inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Contour Curves works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 7. Find the volume.", steps: ["V=s^3.", "7^3=343.", "343."], answer: "343" },
      { prompt: "Cube edge 7. Find the surface area.", steps: ["SA=6s^2.", "6*49=294.", "294."], answer: "294" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  421: {
    introduction: "Level Surfaces works this concrete case: Cube edge 8. Find the volume. The labelled answer is 512. Explore constant-value sets. Displays selected levels of scalar fields. A common labelled error is using a nearby formula that is not the Level Surfaces rule. Level Surfaces keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Level Surfaces is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs. In Level Surfaces, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Level Surfaces works this concrete case: Cube edge 8. Find the volume.",
    howItWorks: "Read the Level Surfaces inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Level Surfaces works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 8. Find the volume.", steps: ["V=s^3.", "8^3=512.", "512."], answer: "512" },
      { prompt: "Cube edge 8. Find the surface area.", steps: ["SA=6s^2.", "6*64=384.", "384."], answer: "384" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  422: {
    introduction: "Partial Derivatives works this concrete case: Differentiate f(x)=x^4. What is f'(9)? The labelled answer is 2916. Measure directional change. Shows x- and y-direction tangent curves. A common labelled error is using a nearby formula that is not the Partial Derivatives rule. Partial Derivatives keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Partial Derivatives is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Partial Derivatives works this concrete case: Differentiate f(x)=x^4. What is f'(9)?",
    howItWorks: "Read the Partial Derivatives inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Partial Derivatives works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Differentiate f(x)=x^4. What is f'(9)?", steps: ["f'(x)=4x^3.", "Substitute x=9.", "2916."], answer: "2916" },
      { prompt: "Average rate of f(x)=x^2 from 9 to 10.", steps: ["Δy=19.", "Δx=1.", "19."], answer: "19" },
      { prompt: "Is the derivative the same as the average slope on a long interval?", steps: ["Derivative is instantaneous.", "Average slope uses a secant.", "No."], answer: "no" }
    ],
  },
  423: {
    introduction: "Gradient Vector works this concrete case: Cube edge 10. Find the volume. The labelled answer is 1000. Find steepest increase. Displays a movable gradient vector. A common labelled error is using a nearby formula that is not the Gradient Vector rule. Gradient Vector keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Gradient Vector is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Gradient Vector works this concrete case: Cube edge 10. Find the volume.",
    howItWorks: "Read the Gradient Vector inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Gradient Vector works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 10. Find the volume.", steps: ["V=s^3.", "10^3=1000.", "1000."], answer: "1000" },
      { prompt: "Cube edge 10. Find the surface area.", steps: ["SA=6s^2.", "6*100=600.", "600."], answer: "600" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  424: {
    introduction: "Tangent Plane works this concrete case: Find sin 30°. The labelled answer is 1/2. Approximate surfaces locally. Constructs a plane at a selected point. A common labelled error is using a nearby formula that is not the Tangent Plane rule. Tangent Plane keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Tangent Plane is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs. In Tangent Plane, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Tangent Plane works this concrete case: Find sin 30°.",
    howItWorks: "Read the Tangent Plane inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Tangent Plane works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find sin 30°.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Does Tangent Plane treat 90° the same as 90 radians?", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  425: {
    introduction: "Normal Vector works this concrete case: Cube edge 4. Find the volume. The labelled answer is 64. Display perpendicular direction. Shows surface normals. A common labelled error is using a nearby formula that is not the Normal Vector rule. Normal Vector keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Normal Vector is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs. In Normal Vector, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Normal Vector works this concrete case: Cube edge 4. Find the volume.",
    howItWorks: "Read the Normal Vector inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Normal Vector works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 4. Find the volume.", steps: ["V=s^3.", "4^3=64.", "64."], answer: "64" },
      { prompt: "Cube edge 4. Find the surface area.", steps: ["SA=6s^2.", "6*16=96.", "96."], answer: "96" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  426: {
    introduction: "Double Integrals works this concrete case: Find ∫ 2x dx from 0 to 5. The labelled answer is 25. Interpret volume under surfaces. Builds partitions and shaded volumes. A common labelled error is using a nearby formula that is not the Double Integrals rule. Double Integrals keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Double Integrals is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Double Integrals works this concrete case: Find ∫ 2x dx from 0 to 5.",
    howItWorks: "Read the Double Integrals inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Double Integrals works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 2x dx from 0 to 5.", steps: ["Antiderivative 1.0 x^2.", "Evaluate at 5 minus 0.", "25."], answer: "25" },
      { prompt: "If F'=2, what is F(5)-F(0) when F(t)=2t?", steps: ["F(5)=10.", "F(0)=0.", "10."], answer: "10" },
      { prompt: "Does a definite integral always equal a rectangle area?", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  427: {
    introduction: "Multivariable Optimisation works this concrete case: Cube edge 6. Find the volume. The labelled answer is 216. Find extrema and saddle points. Marks stationary points and constraint curves. A common labelled error is using a nearby formula that is not the Multivariable Optimisation rule. Multivariable Optimisation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Multivariable Optimisation is the 3D Functions and Surfaces rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Multivariable Optimisation works this concrete case: Cube edge 6. Find the volume.",
    howItWorks: "Read the Multivariable Optimisation inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Multivariable Optimisation works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Cube edge 6. Find the volume.", steps: ["V=s^3.", "6^3=216.", "216."], answer: "216" },
      { prompt: "Cube edge 6. Find the surface area.", steps: ["SA=6s^2.", "6*36=216.", "216."], answer: "216" },
      { prompt: "Is surface area measured in cubic units?", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  428: {
    introduction: "Symbolic Evaluation works this concrete case: Symbolic evaluation should preserve exact what? The labelled answer is form. Obtain exact mathematical results. Evaluates expressions without forced decimal approximation. A common labelled error is using a decimal when an exact symbolic form is needed. Symbolic Evaluation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Symbolic evaluation finds an exact value or form using symbols. In Symbolic Evaluation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Symbolic Evaluation works this concrete case: Symbolic evaluation should preserve exact what?",
    howItWorks: "Enter the expression, choose exact mode, and check restrictions.",
    whyItWorks: "Exact symbolic work preserves forms such as fractions, radicals, and pi.",
    worked: [
      { prompt: "Symbolic evaluation should preserve exact what?", steps: ["Enter the expression, choose exact mode, and check restrictions.", "Read the labelled result.", "form"], answer: "form" },
      { prompt: "In Symbolic Evaluation, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Symbolic Evaluation rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Symbolic Evaluation outputs at 7 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "4."], answer: "4" }
    ],
  },
  429: {
    introduction: "Simplify works this concrete case: Simplify must keep the same what? The labelled answer is value. Reduce expressions. Applies algebraic identities and cancellations. A common labelled error is changing the expression's value while making it look shorter. Simplify keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Simplify rewrites an expression into an equivalent cleaner form. In Simplify, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Simplify works this concrete case: Simplify must keep the same what?",
    howItWorks: "Combine like terms, reduce common factors, and preserve restrictions.",
    whyItWorks: "Simplification keeps the same value wherever the original expression is defined.",
    worked: [
      { prompt: "Simplify must keep the same what?", steps: ["Combine like terms, reduce common factors, and preserve restrictions.", "Read the labelled result.", "value"], answer: "value" },
      { prompt: "Solve 5x = 40.", steps: ["Divide by 5.", "x=8.", "8."], answer: "8" },
      { prompt: "Expand 5(x+6).", steps: ["5x+30.", "5x+30.", "5x+30."], answer: "5x+30" }
    ],
  },
  430: {
    introduction: "Expand works this concrete case: When expanding, multiply every inside what? The labelled answer is term. Multiply out expressions. Expands products, powers and polynomial forms. A common labelled error is multiplying only one term inside a bracket. Expand keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Expand rewrites products or powers as sums of terms. In Expand, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Expand works this concrete case: When expanding, multiply every inside what?",
    howItWorks: "Multiply each required term and combine like terms after expansion.",
    whyItWorks: "Expansion is useful for comparing coefficients and solving equations.",
    worked: [
      { prompt: "When expanding, multiply every inside what?", steps: ["Multiply each required term and combine like terms after expansion.", "Read the labelled result.", "term"], answer: "term" },
      { prompt: "Solve 6x = 54.", steps: ["Divide by 6.", "x=9.", "9."], answer: "9" },
      { prompt: "Expand 6(x+7).", steps: ["6x+42.", "6x+42.", "6x+42."], answer: "6x+42" }
    ],
  },
  431: {
    introduction: "Factor works this concrete case: How can you check a factorisation? The labelled answer is expand. Decompose expressions. Factors integers and algebraic expressions. A common labelled error is accepting factors without expanding back. Factor keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Factor rewrites an expression as a product of simpler factors. In Factor, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Factor works this concrete case: How can you check a factorisation?",
    howItWorks: "Find common factors or patterns, then multiply back to check.",
    whyItWorks: "Factoring helps solve equations because a product is zero when one factor is zero.",
    worked: [
      { prompt: "How can you check a factorisation?", steps: ["Find common factors or patterns, then multiply back to check.", "Read the labelled result.", "expand"], answer: "expand" },
      { prompt: "Solve 7x = 70.", steps: ["Divide by 7.", "x=10.", "10."], answer: "10" },
      { prompt: "Expand 7(x+8).", steps: ["7x+56.", "7x+56.", "7x+56."], answer: "7x+56" }
    ],
  },
  432: {
    introduction: "Substitute works this concrete case: When substituting, replace how many matching variables? The labelled answer is every. Replace variables or parts. Applies chosen substitutions. A common labelled error is replacing only one occurrence of the variable. Substitute keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Substitute means replace a variable with a chosen value or expression. In Substitute, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Substitute works this concrete case: When substituting, replace how many matching variables?",
    howItWorks: "Replace every matching variable, then follow order of operations.",
    whyItWorks: "Substitution connects formulas to specific values.",
    worked: [
      { prompt: "When substituting, replace how many matching variables?", steps: ["Replace every matching variable, then follow order of operations.", "Read the labelled result.", "every"], answer: "every" },
      { prompt: "In Substitute, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Substitute rule.", "The first stored value is 6.", "6."], answer: "6" },
      { prompt: "Compare the Substitute outputs at 3 and 5. What is the difference?", steps: ["Second input 5.", "Difference uses the same rule.", "2."], answer: "2" }
    ],
  },
  433: {
    introduction: "Solve works this concrete case: A solution should make the equation what? The labelled answer is true. Find exact equation solutions. Returns symbolic solutions with conditions. A common labelled error is giving a solution without checking it. Solve keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Solve finds values that make an equation true. In Solve, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Solve works this concrete case: A solution should make the equation what?",
    howItWorks: "Use valid inverse steps and check candidate answers.",
    whyItWorks: "Solving preserves equality while isolating the unknown.",
    worked: [
      { prompt: "A solution should make the equation what?", steps: ["Use valid inverse steps and check candidate answers.", "Read the labelled result.", "true"], answer: "true" },
      { prompt: "Solve 3x = 12.", steps: ["Divide by 3.", "x=4.", "4."], answer: "4" },
      { prompt: "Expand 3(x+10).", steps: ["3x+30.", "3x+30.", "3x+30."], answer: "3x+30" }
    ],
  },
  434: {
    introduction: "Numerical Solve works this concrete case: Numerical solve gives exact or approximate answers? The labelled answer is approximate. Approximate solutions. Computes numerical roots when exact forms are unavailable. A common labelled error is calling a rounded numerical answer exact. Numerical Solve keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Numerical solve finds an approximate solution when exact solving is hard. In Numerical Solve, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Numerical Solve works this concrete case: Numerical solve gives exact or approximate answers?",
    howItWorks: "Choose a starting range or guess and check the residual.",
    whyItWorks: "Approximate roots are useful, but their accuracy must be stated.",
    worked: [
      { prompt: "Numerical solve gives exact or approximate answers?", steps: ["Choose a starting range or guess and check the residual.", "Read the labelled result.", "approximate"], answer: "approximate" },
      { prompt: "Solve 4x = 20.", steps: ["Divide by 4.", "x=5.", "5."], answer: "5" },
      { prompt: "Expand 4(x+4).", steps: ["4x+16.", "4x+16.", "4x+16."], answer: "4x+16" }
    ],
  },
  435: {
    introduction: "Solve Systems works this concrete case: A system solution must satisfy how many equations? The labelled answer is all. Solve simultaneous equations. Handles linear and nonlinear systems. A common labelled error is checking the answer in only one equation. Solve Systems keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Solve systems finds values satisfying several equations at once. In Solve Systems, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Solve Systems works this concrete case: A system solution must satisfy how many equations?",
    howItWorks: "Use substitution, elimination, or matrices, then check every equation.",
    whyItWorks: "A system solution must work in all equations, not just one.",
    worked: [
      { prompt: "A system solution must satisfy how many equations?", steps: ["Use substitution, elimination, or matrices, then check every equation.", "Read the labelled result.", "all"], answer: "all" },
      { prompt: "Solve 5x = 30.", steps: ["Divide by 5.", "x=6.", "6."], answer: "6" },
      { prompt: "Expand 5(x+5).", steps: ["5x+25.", "5x+25.", "5x+25."], answer: "5x+25" }
    ],
  },
  436: {
    introduction: "Eliminate Variables works this concrete case: Before elimination, coefficients should be matched or what? The labelled answer is opposites. Reduce equation systems. Produces relations without selected variables. A common labelled error is combining equations before matching coefficients. Eliminate Variables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Eliminate variables removes one variable to make a smaller system. In Eliminate Variables, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Eliminate Variables works this concrete case: Before elimination, coefficients should be matched or what?",
    howItWorks: "Combine equations so one variable cancels.",
    whyItWorks: "Elimination works because equal operations preserve the solution set.",
    worked: [
      { prompt: "Before elimination, coefficients should be matched or what?", steps: ["Combine equations so one variable cancels.", "Read the labelled result.", "opposites"], answer: "opposites" },
      { prompt: "In Eliminate Variables, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Eliminate Variables rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Eliminate Variables outputs at 7 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "6."], answer: "6" }
    ],
  },
  437: {
    introduction: "Partial Fractions works this concrete case: Partial fractions starts by factoring what? The labelled answer is denominator. Decompose rational expressions. Splits rational functions into simpler fractions. A common labelled error is splitting before factoring the denominator. Partial Fractions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Partial fractions split a rational expression into simpler fractions. In Partial Fractions, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Partial Fractions works this concrete case: Partial fractions starts by factoring what?",
    howItWorks: "Factor the denominator, set unknown constants, and solve for them.",
    whyItWorks: "The split form makes integration and algebra easier.",
    worked: [
      { prompt: "Partial fractions starts by factoring what?", steps: ["Factor the denominator, set unknown constants, and solve for them.", "Read the labelled result.", "denominator"], answer: "denominator" },
      { prompt: "In Partial Fractions, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Partial Fractions rule.", "The first stored value is 56.", "56."], answer: "56" },
      { prompt: "Compare the Partial Fractions outputs at 8 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "7."], answer: "7" }
    ],
  },
  438: {
    introduction: "Polynomial Division works this concrete case: Polynomial division orders terms by descending what? The labelled answer is powers. Divide symbolically. Returns quotient and remainder. A common labelled error is skipping powers or writing terms out of order. Polynomial Division keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Polynomial division divides one polynomial by another. In Polynomial Division, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Polynomial Division works this concrete case: Polynomial division orders terms by descending what?",
    howItWorks: "Divide leading terms, multiply back, subtract, and repeat.",
    whyItWorks: "It works like long division because powers are ordered by degree.",
    worked: [
      { prompt: "Polynomial division orders terms by descending what?", steps: ["Divide leading terms, multiply back, subtract, and repeat.", "Read the labelled result.", "powers"], answer: "powers" },
      { prompt: "In Polynomial Division, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Polynomial Division rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Polynomial Division outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" }
    ],
  },
  439: {
    introduction: "Derivatives works this concrete case: A derivative measures rate of what? The labelled answer is change. Differentiate exactly. Computes derivatives and links output to graphs. A common labelled error is differentiating with respect to the wrong variable. Derivatives keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A derivative measures the instantaneous rate of change of a function. In Derivatives, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Derivatives works this concrete case: A derivative measures rate of what?",
    howItWorks: "Apply derivative rules and state the variable of differentiation.",
    whyItWorks: "Derivatives describe slope, velocity, and local change.",
    worked: [
      { prompt: "A derivative measures rate of what?", steps: ["Apply derivative rules and state the variable of differentiation.", "Read the labelled result.", "change"], answer: "change" },
      { prompt: "Differentiate f(x)=x^3. What is f'(10)?", steps: ["f'(x)=3x^2.", "Substitute x=10.", "300."], answer: "300" },
      { prompt: "Average rate of f(x)=x^2 from 10 to 11.", steps: ["Δy=21.", "Δx=1.", "21."], answer: "21" }
    ],
  },
  440: {
    introduction: "Integrals works this concrete case: An indefinite integral needs what constant? The labelled answer is C. Integrate exactly where possible. Computes antiderivatives and definite integrals. A common labelled error is leaving out +C for an indefinite integral. Integrals keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An integral accumulates quantities over an interval or region. In Integrals, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Integrals works this concrete case: An indefinite integral needs what constant?",
    howItWorks: "Find an antiderivative or add tiny pieces, then apply limits if given.",
    whyItWorks: "Integrals measure area, total change, and accumulation.",
    worked: [
      { prompt: "An indefinite integral needs what constant?", steps: ["Find an antiderivative or add tiny pieces, then apply limits if given.", "Read the labelled result.", "C"], answer: "C" },
      { prompt: "Find ∫ 4x dx from 0 to 3.", steps: ["Antiderivative 2.0 x^2.", "Evaluate at 3 minus 0.", "18."], answer: "18" },
      { prompt: "If F'=4, what is F(3)-F(0) when F(t)=4t?", steps: ["F(3)=12.", "F(0)=0.", "12."], answer: "12" }
    ],
  },
  441: {
    introduction: "Limits works this concrete case: A limit describes what a function approaches? The labelled answer is value. Evaluate limiting values. Handles one-sided, infinite and symbolic limits. A common labelled error is substituting without checking behaviour near the point. Limits keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A limit describes the value a function approaches near an input. In Limits, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Limits works this concrete case: A limit describes what a function approaches?",
    howItWorks: "Check behaviour from the needed side or sides.",
    whyItWorks: "Limits support continuity, derivatives, and infinite processes.",
    worked: [
      { prompt: "A limit describes what a function approaches?", steps: ["Check behaviour from the needed side or sides.", "Read the labelled result.", "value"], answer: "value" },
      { prompt: "Estimate lim x→4 of (x-4)/(x-4) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=4 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" }
    ],
  },
  442: {
    introduction: "Series Expansions works this concrete case: A series expansion should state its what? The labelled answer is centre. Approximate using series. Generates Taylor or related expansions. A common labelled error is using a series without naming its centre. Series Expansions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A series expansion writes a function as an infinite or finite sum of powers. In Series Expansions, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Series Expansions works this concrete case: A series expansion should state its what?",
    howItWorks: "Choose the centre and number of terms.",
    whyItWorks: "Series approximate functions near a centre.",
    worked: [
      { prompt: "A series expansion should state its what?", steps: ["Choose the centre and number of terms.", "Read the labelled result.", "centre"], answer: "centre" },
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 6 odd numbers.", steps: ["1+3+...+11.", "The sum is 6^2.", "36."], answer: "36" }
    ],
  },
  443: {
    introduction: "Differential Equations works this concrete case: Solve y'=2x with y(0)=3. The labelled answer is y=x^2+3. Solve supported ODEs. Returns symbolic families and plots them. A common labelled error is dividing by a function of y without checking when it is zero. Differential Equations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A differential equation relates an unknown function to one or more of its derivatives. In Differential Equations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Differential Equations works this concrete case: Solve y'=2x with y(0)=3.",
    howItWorks: "Classify the equation, choose a valid method such as separation or an integrating factor, solve for the function, and substitute the result back into the original equation.",
    whyItWorks: "Differentiating the proposed solution reproduces the required rate relationship; an initial condition then selects one member of the solution family.",
    worked: [
      { prompt: "Solve y'=2x with y(0)=3.", steps: ["Integrate: y=x^2+C.", "Use y(0)=3 to obtain C=3.", "Differentiate y=x^2+3 to check y'=2x."], answer: "y=x^2+3" },
      { prompt: "Solve 7x = 42.", steps: ["Divide by 7.", "x=6.", "6."], answer: "6" },
      { prompt: "Expand 7(x+6).", steps: ["7x+42.", "7x+42.", "7x+42."], answer: "7x+42" }
    ],
  },
  444: {
    introduction: "Matrix Operations works this concrete case: Matrix operations must check what first? The labelled answer is dimensions. Calculate symbolically with matrices. Performs determinant, inverse and row reduction. A common labelled error is multiplying matrices without checking sizes. Matrix Operations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Matrix operations use arrays of numbers or symbols. In Matrix Operations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Matrix Operations works this concrete case: Matrix operations must check what first?",
    howItWorks: "Check dimensions before adding, multiplying, or inverting.",
    whyItWorks: "Dimensions decide which matrix operations are valid.",
    worked: [
      { prompt: "Matrix operations must check what first?", steps: ["Check dimensions before adding, multiplying, or inverting.", "Read the labelled result.", "dimensions"], answer: "dimensions" },
      { prompt: "Find det([[7,2],[0,7]]).", steps: ["7*7-2*0.", "49.", "49."], answer: "49" },
      { prompt: "What is the size of a 2 by 7 product if inner sizes match?", steps: ["Rows from the first matrix.", "Columns from the second.", "2 by 7."], answer: "2 by 7" }
    ],
  },
  445: {
    introduction: "Complex Calculations works this concrete case: What is i squared? The labelled answer is -1. Work exactly with complex values. Simplifies and solves in the complex domain. A common labelled error is treating i like the number 1. Complex Calculations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Complex calculations use numbers with real and imaginary parts. In Complex Calculations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Complex Calculations works this concrete case: What is i squared?",
    howItWorks: "Handle i using i^2=-1 and keep real and imaginary parts clear.",
    whyItWorks: "Complex arithmetic extends algebra to solve more equations.",
    worked: [
      { prompt: "What is i squared?", steps: ["Handle i using i^2=-1 and keep real and imaginary parts clear.", "Read the labelled result.", "-1"], answer: "-1" },
      { prompt: "Find |8+3i|.", steps: ["√(8^2+3^2).", "√73.", "√73."], answer: "√73" },
      { prompt: "(8+3i)+(8-3i). What is the real part?", steps: ["8+8.", "16.", "16."], answer: "16" }
    ],
  },
  446: {
    introduction: "Assumptions works this concrete case: Assumptions describe a variable's what? The labelled answer is domain. Control symbolic domains. Sets sign, realness or interval assumptions. A common labelled error is simplifying without needed domain information. Assumptions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Assumptions tell a CAS what values variables may have. In Assumptions, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Assumptions works this concrete case: Assumptions describe a variable's what?",
    howItWorks: "State domains such as real, positive, integer, or nonzero.",
    whyItWorks: "Assumptions make simplification and solving mathematically correct.",
    worked: [
      { prompt: "Assumptions describe a variable's what?", steps: ["State domains such as real, positive, integer, or nonzero.", "Read the labelled result.", "domain"], answer: "domain" },
      { prompt: "In Assumptions, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Assumptions rule.", "The first stored value is 36.", "36."], answer: "36" },
      { prompt: "Compare the Assumptions outputs at 9 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "4."], answer: "4" }
    ],
  },
  447: {
    introduction: "Exact / Numeric Toggle works this concrete case: Numeric mode usually gives an what? The labelled answer is approximation. Compare symbolic and approximate output. Converts results between forms. A common labelled error is reading a rounded decimal as exact. Exact / Numeric Toggle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Exact/numeric toggle switches between symbolic form and decimal approximation. In Exact / Numeric Toggle, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Exact / Numeric Toggle works this concrete case: Numeric mode usually gives an what?",
    howItWorks: "Show the active mode and keep rounded answers labelled.",
    whyItWorks: "The toggle helps compare exact meaning with practical decimals.",
    worked: [
      { prompt: "Numeric mode usually gives an what?", steps: ["Show the active mode and keep rounded answers labelled.", "Read the labelled result.", "approximation"], answer: "approximation" },
      { prompt: "In Exact / Numeric Toggle, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Exact / Numeric Toggle rule.", "The first stored value is 50.", "50."], answer: "50" },
      { prompt: "Compare the Exact / Numeric Toggle outputs at 10 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "5."], answer: "5" }
    ],
  },
  448: {
    introduction: "Step-by-Step Algebra works this concrete case: Step-by-step algebra should include steps and what? The labelled answer is reasons. Teach procedures. Displays transformation steps and justifications. A common labelled error is showing steps without explaining why they are valid. Step-by-Step Algebra keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Step-by-step algebra shows each valid transformation in a solution. In Step-by-Step Algebra, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Step-by-Step Algebra works this concrete case: Step-by-step algebra should include steps and what?",
    howItWorks: "Reveal one algebra step with its reason.",
    whyItWorks: "Step display helps learners connect rules to results.",
    worked: [
      { prompt: "Step-by-step algebra should include steps and what?", steps: ["Reveal one algebra step with its reason.", "Read the labelled result.", "reasons"], answer: "reasons" },
      { prompt: "In Step-by-Step Algebra, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Step-by-Step Algebra rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Step-by-Step Algebra outputs at 3 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "6."], answer: "6" }
    ],
  },
  449: {
    introduction: "CAS-to-Graph Link works this concrete case: CAS-to-graph should carry symbolic what? The labelled answer is restrictions. Connect symbolic and visual output. Plots selected CAS results instantly. A common labelled error is graphing without preserving symbolic restrictions. CAS-to-Graph Link keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "CAS-to-graph link connects symbolic expressions to their graph. In CAS-to-Graph Link, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "CAS-to-Graph Link works this concrete case: CAS-to-graph should carry symbolic what?",
    howItWorks: "Update the graph from the exact expression and show restrictions.",
    whyItWorks: "The link helps learners see algebraic form and visual behaviour together.",
    worked: [
      { prompt: "CAS-to-graph should carry symbolic what?", steps: ["Update the graph from the exact expression and show restrictions.", "Read the labelled result.", "restrictions"], answer: "restrictions" },
      { prompt: "In CAS-to-Graph Link, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the CAS-to-Graph Link rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the CAS-to-Graph Link outputs at 4 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "7."], answer: "7" }
    ],
  },
  450: {
    introduction: "Data Entry Grid works this concrete case: What should a data grid include at the top? The labelled answer is headings. Organise structured data. Provides editable rows and columns. A common labelled error is entering values without labels. Data Entry Grid keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A data entry grid stores values in labelled rows and columns. In Data Entry Grid, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Data Entry Grid works this concrete case: What should a data grid include at the top?",
    howItWorks: "Enter one value per cell and keep headings clear.",
    whyItWorks: "Clean grids make formulas, charts, and analysis trustworthy.",
    worked: [
      { prompt: "What should a data grid include at the top?", steps: ["Enter one value per cell and keep headings clear.", "Read the labelled result.", "headings"], answer: "headings" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  451: {
    introduction: "Cell Formulas works this concrete case: Spreadsheet formulas usually start with what symbol? The labelled answer is =. Calculate from cell references. Evaluates formulas and updates dependents. A common labelled error is typing a formula without the equals sign. Cell Formulas keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Cell formulas calculate values from other cells. In Cell Formulas, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cell Formulas works this concrete case: Spreadsheet formulas usually start with what symbol?",
    howItWorks: "Start with equals, refer to cells, and check the computed result.",
    whyItWorks: "Formulas update automatically when source cells change.",
    worked: [
      { prompt: "Spreadsheet formulas usually start with what symbol?", steps: ["Start with equals, refer to cells, and check the computed result.", "Read the labelled result.", "="], answer: "=" },
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" }
    ],
  },
  452: {
    introduction: "Fill and Copy works this concrete case: After copying a formula, what should be checked? The labelled answer is references. Extend formulas and patterns. Copies formulas with reference adjustment. A common labelled error is copying formulas without checking references. Fill and Copy keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Fill and copy repeats values or formulas across cells. In Fill and Copy, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Fill and Copy works this concrete case: After copying a formula, what should be checked?",
    howItWorks: "Copy the formula and check how references changed.",
    whyItWorks: "It saves time and keeps repeated calculations consistent.",
    worked: [
      { prompt: "After copying a formula, what should be checked?", steps: ["Copy the formula and check how references changed.", "Read the labelled result.", "references"], answer: "references" },
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" }
    ],
  },
  453: {
    introduction: "Relative References works this concrete case: Relative references change when copied: yes or no? The labelled answer is yes. Understand changing references. Updates row and column references when copied. A common labelled error is expecting A2 to stay fixed after copying. Relative References keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Relative references change when a formula is copied. In Relative References, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Relative References works this concrete case: Relative references change when copied: yes or no?",
    howItWorks: "Use plain cell names such as A2 when movement should adjust.",
    whyItWorks: "Relative references let one formula work across many rows.",
    worked: [
      { prompt: "Relative references change when copied: yes or no?", steps: ["Use plain cell names such as A2 when movement should adjust.", "Read the labelled result.", "yes"], answer: "yes" },
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" }
    ],
  },
  454: {
    introduction: "Absolute References works this concrete case: What symbol marks an absolute reference? The labelled answer is $. Preserve fixed inputs. Locks rows or columns. A common labelled error is copying a formula that should keep one fixed cell. Absolute References keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Absolute references stay fixed when a formula is copied. In Absolute References, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Absolute References works this concrete case: What symbol marks an absolute reference?",
    howItWorks: "Use dollar signs, such as $A$1, for fixed cells.",
    whyItWorks: "They protect constants like tax rate or conversion factor.",
    worked: [
      { prompt: "What symbol marks an absolute reference?", steps: ["Use dollar signs, such as $A$1, for fixed cells.", "Read the labelled result.", "$"], answer: "$" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" }
    ],
  },
  455: {
    introduction: "Sorting works this concrete case: When sorting data, select the whole what? The labelled answer is table. Order data. Sorts by one or more columns. A common labelled error is sorting one column and leaving the rest behind. Sorting keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Sorting arranges rows by a chosen column. In Sorting, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Sorting works this concrete case: When sorting data, select the whole what?",
    howItWorks: "Select the full table and choose ascending or descending order.",
    whyItWorks: "Sorting helps compare values without separating related row data.",
    worked: [
      { prompt: "When sorting data, select the whole what?", steps: ["Select the full table and choose ascending or descending order.", "Read the labelled result.", "table"], answer: "table" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" }
    ],
  },
  456: {
    introduction: "Filtering works this concrete case: Filtering hides rows but does not what them? The labelled answer is delete. Focus on subsets. Shows records meeting selected conditions. A common labelled error is deleting rows instead of filtering them. Filtering keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Filtering shows only rows that match a condition. In Filtering, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Filtering works this concrete case: Filtering hides rows but does not what them?",
    howItWorks: "Choose the condition and keep hidden rows unchanged.",
    whyItWorks: "Filters help focus on a subset without deleting data.",
    worked: [
      { prompt: "Filtering hides rows but does not what them?", steps: ["Choose the condition and keep hidden rows unchanged.", "Read the labelled result.", "delete"], answer: "delete" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  457: {
    introduction: "Lists from Cells works this concrete case: A list from cells should preserve data what? The labelled answer is type. Connect spreadsheet and algebra. Creates mathematical lists from ranges. A common labelled error is mixing labels and numbers in one numeric list. Lists from Cells keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Lists from cells turn a cell range into an ordered data list. In Lists from Cells, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Lists from Cells works this concrete case: A list from cells should preserve data what?",
    howItWorks: "Select the range and preserve order and data type.",
    whyItWorks: "Lists feed charts, statistics, and dynamic activities.",
    worked: [
      { prompt: "A list from cells should preserve data what?", steps: ["Select the range and preserve order and data type.", "Read the labelled result.", "type"], answer: "type" },
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" }
    ],
  },
  458: {
    introduction: "Points from Columns works this concrete case: Points from columns pair values by matching what? The labelled answer is rows. Plot paired data. Converts columns into coordinate points. A common labelled error is pairing x and y values from different rows. Points from Columns keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Points from columns create coordinate points from paired x and y columns. In Points from Columns, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Points from Columns works this concrete case: Points from columns pair values by matching what?",
    howItWorks: "Choose matching columns and pair values row by row.",
    whyItWorks: "Column points link tables to graphs.",
    worked: [
      { prompt: "Points from columns pair values by matching what?", steps: ["Choose matching columns and pair values row by row.", "Read the labelled result.", "rows"], answer: "rows" },
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" }
    ],
  },
  459: {
    introduction: "Matrices from Cells works this concrete case: A matrix cell range must be what shape? The labelled answer is rectangular. Create linear algebra objects. Builds matrices from selected blocks. A common labelled error is selecting an uneven range for a matrix. Matrices from Cells keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Matrices from cells convert a rectangular range into a matrix. In Matrices from Cells, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Matrices from Cells works this concrete case: A matrix cell range must be what shape?",
    howItWorks: "Select a rectangular range and keep row and column order.",
    whyItWorks: "Matrices use spreadsheet data for linear algebra.",
    worked: [
      { prompt: "A matrix cell range must be what shape?", steps: ["Select a rectangular range and keep row and column order.", "Read the labelled result.", "rectangular"], answer: "rectangular" },
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" }
    ],
  },
  460: {
    introduction: "Frequency Tables works this concrete case: A frequency table counts how often values what? The labelled answer is appear. Summarise observations. Counts unique or grouped values. A common labelled error is counting a value in the wrong category. Frequency Tables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A frequency table counts how often each value or category appears. In Frequency Tables, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Frequency Tables works this concrete case: A frequency table counts how often values what?",
    howItWorks: "List values or classes and count each occurrence.",
    whyItWorks: "Frequency tables summarise raw data without losing counts.",
    worked: [
      { prompt: "A frequency table counts how often values what?", steps: ["List values or classes and count each occurrence.", "Read the labelled result.", "appear"], answer: "appear" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" }
    ],
  },
  461: {
    introduction: "Summary Statistics works this concrete case: Summary statistics often describe centre and what? The labelled answer is spread. Calculate descriptive measures. Computes centre and spread. A common labelled error is describing all data with only one statistic. Summary Statistics keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Summary statistics describe a data set with key numbers. In Summary Statistics, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Summary Statistics works this concrete case: Summary statistics often describe centre and what?",
    howItWorks: "Compute measures such as mean, median, mode, range, or standard deviation.",
    whyItWorks: "Summary values make large data sets easier to compare.",
    worked: [
      { prompt: "Summary statistics often describe centre and what?", steps: ["Compute measures such as mean, median, mode, range, or standard deviation.", "Read the labelled result.", "spread"], answer: "spread" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" }
    ],
  },
  462: {
    introduction: "Spreadsheet Charts works this concrete case: Which chart is best for paired number data? The labelled answer is scatter plot. Visualise selected data. Creates common statistical charts. A common labelled error is using a chart type that does not match the data. Spreadsheet Charts keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Spreadsheet In Spreadsheet Charts, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Spreadsheet Charts works this concrete case: Which chart is best for paired number data?",
    howItWorks: "tool",
    whyItWorks: "Spreadsheet charts turn selected cells into visual displays such as bar charts, line charts, or scatter plots.",
    worked: [
      { prompt: "Which chart is best for paired number data?", steps: ["tool", "Read the labelled result.", "scatter plot"], answer: "scatter plot" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  463: {
    introduction: "Regression from Data works this concrete case: A fair die. P(score ≤ 3)? The labelled answer is 3/6. Fit mathematical models. Builds regression equations and plots. A common labelled error is forcing a straight line onto clearly curved data. Regression from Data keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Spreadsheet In Regression from Data, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Regression from Data works this concrete case: A fair die. P(score ≤ 3)?",
    howItWorks: "tool",
    whyItWorks: "Regression from data fits an equation to points so a trend can be described.",
    worked: [
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  464: {
    introduction: "Dynamic Cell Links works this concrete case: A dynamic link should update when the source what changes? The labelled answer is cell. Maintain live connections. Updates graphics when cell values change. A common labelled error is linking the output to the wrong range. Dynamic Cell Links keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Spreadsheet In Dynamic Cell Links, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Dynamic Cell Links works this concrete case: A dynamic link should update when the source what changes?",
    howItWorks: "tool",
    whyItWorks: "Dynamic cell links connect spreadsheet cells to live outputs such as charts or workspace objects.",
    worked: [
      { prompt: "A dynamic link should update when the source what changes?", steps: ["tool", "Read the labelled result.", "cell"], answer: "cell" },
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" }
    ],
  },
  465: {
    introduction: "Import CSV works this concrete case: What separator does a normal CSV file use? The labelled answer is comma. Load external datasets. Imports comma-separated files. A common labelled error is importing with the wrong separator so columns shift. Import CSV keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Spreadsheet In Import CSV, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Import CSV works this concrete case: What separator does a normal CSV file use?",
    howItWorks: "tool",
    whyItWorks: "Import CSV loads comma-separated text data into rows and columns.",
    worked: [
      { prompt: "What separator does a normal CSV file use?", steps: ["tool", "Read the labelled result.", "comma"], answer: "comma" },
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" }
    ],
  },
  466: {
    introduction: "Export Data works this concrete case: What should usually be included when exporting a table? The labelled answer is headings. Reuse processed data. Exports tables or calculated results. A common labelled error is exporting numbers without labels. Export Data keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Spreadsheet In Export Data, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Export Data works this concrete case: What should usually be included when exporting a table?",
    howItWorks: "tool",
    whyItWorks: "Export data saves a table or result so another tool can read it.",
    worked: [
      { prompt: "What should usually be included when exporting a table?", steps: ["tool", "Read the labelled result.", "headings"], answer: "headings" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" }
    ],
  },
  467: {
    introduction: "Data Types works this concrete case: Is favourite colour categorical or numerical? The labelled answer is categorical. Distinguish variable types. Classifies categorical, discrete and continuous data. A common labelled error is treating category names like measured numbers. Data Types keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Data Types, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Data Types works this concrete case: Is favourite colour categorical or numerical?",
    howItWorks: "concept",
    whyItWorks: "Data types describe what kind of values a data set contains, such as categories, counts, or measurements.",
    worked: [
      { prompt: "Is favourite colour categorical or numerical?", steps: ["concept", "Read the labelled result.", "categorical"], answer: "categorical" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" }
    ],
  },
  468: {
    introduction: "Frequency Tables works this concrete case: A frequency table records how many times values what? The labelled answer is occur. Summarise repeated values. Counts and displays occurrences. A common labelled error is counting one observation in two categories. Frequency Tables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Frequency Tables, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Frequency Tables works this concrete case: A frequency table records how many times values what?",
    howItWorks: "concept",
    whyItWorks: "A frequency table counts how many times each value or category occurs.",
    worked: [
      { prompt: "A frequency table records how many times values what?", steps: ["concept", "Read the labelled result.", "occur"], answer: "occur" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  469: {
    introduction: "Grouped Frequency Tables works this concrete case: Grouped tables use non-overlapping what? The labelled answer is intervals. Organise continuous data. Creates intervals and frequencies. A common labelled error is using class intervals that overlap at endpoints. Grouped Frequency Tables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Grouped Frequency Tables, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Grouped Frequency Tables works this concrete case: Grouped tables use non-overlapping what?",
    howItWorks: "concept",
    whyItWorks: "A grouped frequency table counts data inside intervals, or class groups.",
    worked: [
      { prompt: "Grouped tables use non-overlapping what?", steps: ["concept", "Read the labelled result.", "intervals"], answer: "intervals" },
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" }
    ],
  },
  470: {
    introduction: "Mean works this concrete case: What must you do before finding the median? The labelled answer is sort. Understand arithmetic average. Calculates and visualises balance point. A common labelled error is adding values but not dividing by the number of values. Mean keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Mean, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Mean works this concrete case: What must you do before finding the median?",
    howItWorks: "concept",
    whyItWorks: "The mean is the sum of all values divided by the number of values.",
    worked: [
      { prompt: "What must you do before finding the median?", steps: ["concept", "Read the labelled result.", "sort"], answer: "sort" },
      { prompt: "Find the mean of 9, 4, 5, 10.", steps: ["Sum=28.", "Count=4.", "7."], answer: "7" },
      { prompt: "If one value increases by 4, how does the mean change?", steps: ["The total rises by 4.", "Mean rises by 4/4.", "1."], answer: "1" }
    ],
  },
  471: {
    introduction: "Median works this concrete case: What must you do before finding the median? The labelled answer is sort. Understand positional centre. Orders data and marks the middle. A common labelled error is finding the middle before sorting the data. Median keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Median, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Median works this concrete case: What must you do before finding the median?",
    howItWorks: "concept",
    whyItWorks: "The median is the middle value after the data is ordered.",
    worked: [
      { prompt: "What must you do before finding the median?", steps: ["concept", "Read the labelled result.", "sort"], answer: "sort" },
      { prompt: "Find the median of 5, 6, 10.", steps: ["Order the list.", "The middle is 6.", "6."], answer: "6" },
      { prompt: "Median of 5, 6, 10, 12?", steps: ["Average the two middle values.", "(6+10)/2.", "8."], answer: "8" }
    ],
  },
  472: {
    introduction: "Mode works this concrete case: What is the mode of 2, 3, 3, 5? The labelled answer is 3. Identify common values. Highlights highest-frequency observations. A common labelled error is thinking every data set has exactly one mode. Mode keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Mode, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Mode works this concrete case: What is the mode of 2, 3, 3, 5?",
    howItWorks: "concept",
    whyItWorks: "The mode is the value or category that appears most often.",
    worked: [
      { prompt: "What is the mode of 2, 3, 3, 5?", steps: ["concept", "Read the labelled result.", "3"], answer: "3" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" }
    ],
  },
  473: {
    introduction: "Weighted Mean works this concrete case: Find the mean of 4, 7, 8, 5. The labelled answer is 6. Use unequal importance. Calculates averages with adjustable weights. A common labelled error is averaging values without using their weights. Weighted Mean keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Weighted Mean, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Weighted Mean works this concrete case: Find the mean of 4, 7, 8, 5.",
    howItWorks: "concept",
    whyItWorks: "A weighted mean is an average where some values count more than others.",
    worked: [
      { prompt: "Find the mean of 4, 7, 8, 5.", steps: ["Sum=24.", "Count=4.", "6."], answer: "6" },
      { prompt: "If one value increases by 7, how does the mean change?", steps: ["The total rises by 7.", "Mean rises by 7/4.", "1.75."], answer: "1.75" },
      { prompt: "Must the mean be one of the data values?", steps: ["The mean is a balance point.", "It can sit between values.", "No."], answer: "no" }
    ],
  },
  474: {
    introduction: "Range works this concrete case: A fair die. P(score ≤ 2)? The labelled answer is 2/6. Measure overall spread. Displays maximum minus minimum. A common labelled error is subtracting largest from smallest and getting a negative range. Range keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Range, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Range works this concrete case: A fair die. P(score ≤ 2)?",
    howItWorks: "concept",
    whyItWorks: "The range is the largest value minus the smallest value.",
    worked: [
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  475: {
    introduction: "Quartiles and IQR works this concrete case: A fair die. P(score ≤ 3)? The labelled answer is 3/6. Measure central distribution. Calculates quartiles and box width. A common labelled error is finding quartiles before ordering the data. Quartiles and IQR keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Quartiles and IQR, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Quartiles and IQR works this concrete case: A fair die. P(score ≤ 3)?",
    howItWorks: "concept",
    whyItWorks: "Quartiles split ordered data into four parts, and IQR is the upper quartile minus the lower quartile.",
    worked: [
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  476: {
    introduction: "Variance and Standard Deviation works this concrete case: A fair die. P(score ≤ 4)? The labelled answer is 4/6. Quantify dispersion. Shows distances from the mean and squared deviations. A common labelled error is using only range to describe all spread. Variance and Standard Deviation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Variance and Standard Deviation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Variance and Standard Deviation works this concrete case: A fair die. P(score ≤ 4)?",
    howItWorks: "concept",
    whyItWorks: "Variance and standard deviation measure how far values usually are from the mean.",
    worked: [
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  477: {
    introduction: "Percentiles works this concrete case: Does the 80th percentile always mean score 80? The labelled answer is no. Interpret relative standing. Finds selected percentile cut-offs. A common labelled error is thinking the 80th percentile means a score of 80. Percentiles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Percentiles, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Percentiles works this concrete case: Does the 80th percentile always mean score 80?",
    howItWorks: "concept",
    whyItWorks: "A percentile tells the value below which a given percent of data lies.",
    worked: [
      { prompt: "Does the 80th percentile always mean score 80?", steps: ["concept", "Read the labelled result.", "no"], answer: "no" },
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" }
    ],
  },
  478: {
    introduction: "Z-Scores works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Standardise values. Converts data to standard units. A common labelled error is ignoring whether the z-score is positive or negative. Z-Scores keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Z-Scores, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Z-Scores works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "concept",
    whyItWorks: "A z-score tells how many standard deviations a value is from the mean.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  479: {
    introduction: "Outliers works this concrete case: Should you check an outlier before deleting it? The labelled answer is yes. Identify unusual observations. Applies IQR or z-score rules. A common labelled error is deleting an outlier without checking why it happened. Outliers keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Outliers, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Outliers works this concrete case: Should you check an outlier before deleting it?",
    howItWorks: "concept",
    whyItWorks: "An outlier is a data value that is unusually far from the rest of the data.",
    worked: [
      { prompt: "Should you check an outlier before deleting it?", steps: ["concept", "Read the labelled result.", "yes"], answer: "yes" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" }
    ],
  },
  480: {
    introduction: "Box Plot works this concrete case: Find the five-number summary of 1, 2, 4, 7, 9. The labelled answer is (1, 1.5, 4, 8, 9). Visualise five-number summaries. Creates editable box-and-whisker plots. A common labelled error is finding quartiles before ordering the data. Box Plot keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A box plot displays the minimum, first quartile, median, third quartile, and maximum on one number scale. In Box Plot, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Box Plot works this concrete case: Find the five-number summary of 1, 2, 4, 7, 9.",
    howItWorks: "Sort the data, find Q1, the median, and Q3, compute the IQR, apply the stated whisker rule, and plot every summary value on one consistent scale.",
    whyItWorks: "Quartiles divide ordered data by position, so the box from Q1 to Q3 contains the central 50 percent and its length measures middle spread.",
    worked: [
      { prompt: "Find the five-number summary of 1, 2, 4, 7, 9.", steps: ["The data are already sorted.", "Median=4; lower-half median Q1=1.5; upper-half median Q3=8.", "Minimum=1 and maximum=9."], answer: "(1, 1.5, 4, 8, 9)" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  481: {
    introduction: "Dot Plot works this concrete case: In a dot plot, repeated values are shown by stacking what? The labelled answer is dots. Display individual values. Stacks repeated observations. A common labelled error is using uneven spacing on the number line. Dot Plot keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Dot Plot, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Dot Plot works this concrete case: In a dot plot, repeated values are shown by stacking what?",
    howItWorks: "visual_exploration",
    whyItWorks: "A dot plot places one dot for each data value on a number line.",
    worked: [
      { prompt: "In a dot plot, repeated values are shown by stacking what?", steps: ["visual_exploration", "Read the labelled result.", "dots"], answer: "dots" },
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" }
    ],
  },
  482: {
    introduction: "Stem-and-Leaf Plot works this concrete case: In 67, if tens are stems, what is the leaf? The labelled answer is 7. Preserve raw values. Builds an ordered stem-and-leaf display. A common labelled error is leaving leaves unordered inside each stem. Stem-and-Leaf Plot keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Stem-and-Leaf Plot, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Stem-and-Leaf Plot works this concrete case: In 67, if tens are stems, what is the leaf?",
    howItWorks: "visual_exploration",
    whyItWorks: "A stem-and-leaf plot splits numbers into stems and final digits called leaves.",
    worked: [
      { prompt: "In 67, if tens are stems, what is the leaf?", steps: ["visual_exploration", "Read the labelled result.", "7"], answer: "7" },
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" }
    ],
  },
  483: {
    introduction: "Histogram works this concrete case: Do histogram bars usually touch? The labelled answer is yes. Visualise distributions. Changes bin width and counts. A common labelled error is drawing gaps between histogram bars as if categories are separate. Histogram keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Histogram, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Histogram works this concrete case: Do histogram bars usually touch?",
    howItWorks: "visual_exploration",
    whyItWorks: "A histogram uses touching bars to show frequencies for numerical intervals.",
    worked: [
      { prompt: "Do histogram bars usually touch?", steps: ["visual_exploration", "Read the labelled result.", "yes"], answer: "yes" },
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" }
    ],
  },
  484: {
    introduction: "Frequency Polygon works this concrete case: A frequency polygon plots frequencies at class what? The labelled answer is midpoints. Compare grouped patterns. Connects class midpoints. A common labelled error is plotting class endpoints instead of class midpoints. Frequency Polygon keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Frequency Polygon, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Frequency Polygon works this concrete case: A frequency polygon plots frequencies at class what?",
    howItWorks: "visual_exploration",
    whyItWorks: "A frequency polygon joins points plotted at class midpoints and their frequencies.",
    worked: [
      { prompt: "A frequency polygon plots frequencies at class what?", steps: ["visual_exploration", "Read the labelled result.", "midpoints"], answer: "midpoints" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" }
    ],
  },
  485: {
    introduction: "Cumulative Frequency Curve works this concrete case: Cumulative frequency uses running what? The labelled answer is totals. Show accumulated counts. Builds an ogive and reads percentiles. A common labelled error is plotting ordinary frequencies instead of cumulative totals. Cumulative Frequency Curve keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Cumulative Frequency Curve, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cumulative Frequency Curve works this concrete case: Cumulative frequency uses running what?",
    howItWorks: "visual_exploration",
    whyItWorks: "A cumulative frequency curve shows running totals up to each class boundary.",
    worked: [
      { prompt: "Cumulative frequency uses running what?", steps: ["visual_exploration", "Read the labelled result.", "totals"], answer: "totals" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" }
    ],
  },
  486: {
    introduction: "Bar and Pie Charts works this concrete case: A pie chart should show parts of one what? The labelled answer is whole. Compare categories. Creates category-frequency and proportional charts. A common labelled error is using a pie chart when categories do not form one whole. Bar and Pie Charts keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Bar and Pie Charts, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Bar and Pie Charts works this concrete case: A pie chart should show parts of one what?",
    howItWorks: "visual_exploration",
    whyItWorks: "Bar charts compare category frequencies, and pie charts show category parts of a whole.",
    worked: [
      { prompt: "A pie chart should show parts of one what?", steps: ["visual_exploration", "Read the labelled result.", "whole"], answer: "whole" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  487: {
    introduction: "Scatter Plot works this concrete case: A scatter plot uses paired what? The labelled answer is numbers. Explore bivariate relationships. Plots paired observations. A common labelled error is joining scatter points as if they are a time line. Scatter Plot keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Scatter Plot, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Scatter Plot works this concrete case: A scatter plot uses paired what?",
    howItWorks: "visual_exploration",
    whyItWorks: "A scatter plot shows paired numerical data as points on coordinate axes.",
    worked: [
      { prompt: "A scatter plot uses paired what?", steps: ["visual_exploration", "Read the labelled result.", "numbers"], answer: "numbers" },
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" }
    ],
  },
  488: {
    introduction: "Time-Series Plot works this concrete case: Which axis usually shows time? The labelled answer is horizontal. Analyse trends over time. Connects chronological observations. A common labelled error is plotting dates out of order. Time-Series Plot keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Time-Series Plot, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Time-Series Plot works this concrete case: Which axis usually shows time?",
    howItWorks: "visual_exploration",
    whyItWorks: "A time-series plot shows how a quantity changes over time.",
    worked: [
      { prompt: "Which axis usually shows time?", steps: ["visual_exploration", "Read the labelled result.", "horizontal"], answer: "horizontal" },
      { prompt: "For 2, 4, 8, ... what is term 4?", steps: ["Each term doubles.", "2,4,8,16.", "16."], answer: "16" },
      { prompt: "Sum of first 4 odd numbers.", steps: ["1+3+...+7.", "The sum is 4^2.", "16."], answer: "16" }
    ],
  },
  489: {
    introduction: "Correlation Coefficient works this concrete case: A fair die. P(score ≤ 5)? The labelled answer is 5/6. Measure linear association. Calculates r and displays direction and strength. A common labelled error is thinking correlation proves one variable causes the other. Correlation Coefficient keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Correlation Coefficient, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Correlation Coefficient works this concrete case: A fair die. P(score ≤ 5)?",
    howItWorks: "concept",
    whyItWorks: "The correlation coefficient r measures the direction and strength of a linear relationship.",
    worked: [
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  490: {
    introduction: "Linear Regression works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Fit a least-squares line. Displays equation, residuals and R². A common labelled error is using a fitted line far outside the data range. Linear Regression keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Linear Regression, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Linear Regression works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "modelling",
    whyItWorks: "Linear regression fits a straight line that best models paired numerical data.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  491: {
    introduction: "Polynomial Regression works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Fit curved models. Changes polynomial degree and compares fits. A common labelled error is choosing a very high degree just to hit every point. Polynomial Regression keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Polynomial Regression, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Polynomial Regression works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "modelling",
    whyItWorks: "Polynomial regression fits a polynomial curve to paired numerical data.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  492: {
    introduction: "Exponential Regression works this concrete case: A fair die. P(score ≤ 2)? The labelled answer is 2/6. Model multiplicative trends. Fits a·b^x or equivalent models. A common labelled error is using a line for data that changes by repeated percent growth. Exponential Regression keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Exponential Regression, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Exponential Regression works this concrete case: A fair die. P(score ≤ 2)?",
    howItWorks: "modelling",
    whyItWorks: "Exponential regression fits a model where values change by a repeated multiplying factor.",
    worked: [
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  493: {
    introduction: "Logarithmic Regression works this concrete case: A fair die. P(score ≤ 3)? The labelled answer is 3/6. Model slowing growth. Fits logarithmic curves. A common labelled error is using logarithmic regression when x values are zero or negative. Logarithmic Regression keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Logarithmic Regression, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Logarithmic Regression works this concrete case: A fair die. P(score ≤ 3)?",
    howItWorks: "modelling",
    whyItWorks: "Logarithmic regression fits data that changes quickly at first and then changes more slowly.",
    worked: [
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  494: {
    introduction: "Power Regression works this concrete case: A fair die. P(score ≤ 4)? The labelled answer is 4/6. Model scaling laws. Fits ax^b relationships. A common labelled error is confusing a power model y = ax^b with an exponential model y = ab^x. Power Regression keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Power Regression, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Power Regression works this concrete case: A fair die. P(score ≤ 4)?",
    howItWorks: "modelling",
    whyItWorks: "Power regression fits data where one variable is proportional to a power of another.",
    worked: [
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  495: {
    introduction: "Logistic Regression works this concrete case: A fair die. P(score ≤ 5)? The labelled answer is 5/6. Model bounded growth. Fits S-shaped curves. A common labelled error is using logistic regression when there is no sensible maximum level. Logistic Regression keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Logistic Regression, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Logistic Regression works this concrete case: A fair die. P(score ≤ 5)?",
    howItWorks: "modelling",
    whyItWorks: "Logistic regression for growth fits an S-shaped curve with an upper limit.",
    worked: [
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  496: {
    introduction: "Sinusoidal Regression works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Model periodic data. Fits amplitude, frequency and phase. A common labelled error is using a sinusoidal model for data with no repeated cycle. Sinusoidal Regression keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Sinusoidal Regression, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Sinusoidal Regression works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "modelling",
    whyItWorks: "Sinusoidal regression fits data that repeats in a wave pattern.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  497: {
    introduction: "Residual Plot works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Diagnose fit quality. Plots observed minus predicted values. A common labelled error is ignoring a clear curve or pattern in residuals. Residual Plot keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Residual Plot, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Residual Plot works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "visual_exploration",
    whyItWorks: "A residual plot shows prediction errors from a fitted model.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  498: {
    introduction: "Model Comparison works this concrete case: Besides error size, what should model comparison check? The labelled answer is context. Choose appropriate models. Compares errors, residuals and R². A common labelled error is choosing a model only because it has the smallest error. Model Comparison keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Model Comparison, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Model Comparison works this concrete case: Besides error size, what should model comparison check?",
    howItWorks: "modelling",
    whyItWorks: "Model comparison decides which model explains data best without adding needless complexity.",
    worked: [
      { prompt: "Besides error size, what should model comparison check?", steps: ["modelling", "Read the labelled result.", "context"], answer: "context" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  499: {
    introduction: "Interpolation and Extrapolation works this concrete case: Which is usually safer: interpolation or extrapolation? The labelled answer is interpolation. Estimate values responsibly. Predicts within or beyond the data range and flags risk. A common labelled error is trusting far extrapolation as if it were measured data. Interpolation and Extrapolation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Statistics and Regression In Interpolation and Extrapolation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Interpolation and Extrapolation works this concrete case: Which is usually safer: interpolation or extrapolation?",
    howItWorks: "concept",
    whyItWorks: "Interpolation predicts inside the data range, while extrapolation predicts outside it.",
    worked: [
      { prompt: "Which is usually safer: interpolation or extrapolation?", steps: ["concept", "Read the labelled result.", "interpolation"], answer: "interpolation" },
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" }
    ],
  },
  500: {
    introduction: "Sample Spaces works this concrete case: How many outcomes are in one fair die roll? The labelled answer is 6. Enumerate possible outcomes. Builds lists, grids or diagrams of outcomes. A common labelled error is leaving possible outcomes out of the sample space. Sample Spaces keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Sample Spaces, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Sample Spaces works this concrete case: How many outcomes are in one fair die roll?",
    howItWorks: "concept",
    whyItWorks: "A sample space is the set of all possible outcomes of a random experiment.",
    worked: [
      { prompt: "How many outcomes are in one fair die roll?", steps: ["concept", "Read the labelled result.", "6"], answer: "6" },
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" }
    ],
  },
  501: {
    introduction: "Events works this concrete case: For a die, how many outcomes are in the event even? The labelled answer is 3. Define outcome subsets. Selects and highlights event members. A common labelled error is thinking an event must contain only one outcome. Events keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Events, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Events works this concrete case: For a die, how many outcomes are in the event even?",
    howItWorks: "concept",
    whyItWorks: "An event is a set of outcomes from a sample space.",
    worked: [
      { prompt: "For a die, how many outcomes are in the event even?", steps: ["concept", "Read the labelled result.", "3"], answer: "3" },
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" }
    ],
  },
  502: {
    introduction: "Probability Scale works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Understand probability magnitude. Places events between impossible and certain. A common labelled error is writing a probability greater than 1. Probability Scale keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Probability Scale, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Probability Scale works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "concept",
    whyItWorks: "The probability scale runs from 0 for impossible to 1 for certain.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  503: {
    introduction: "Complement Rule works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Use opposite events. Shows P(Aᶜ)=1-P(A). A common labelled error is adding P(A) to find the complement. Complement Rule keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Complement Rule, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Complement Rule works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "procedure",
    whyItWorks: "The complement rule says the probability that A does not happen is 1 minus the probability that A happens.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  504: {
    introduction: "Addition Rule works this concrete case: A fair die. P(score ≤ 2)? The labelled answer is 2/6. Calculate unions. Uses Venn diagrams and overlap correction. A common labelled error is adding overlapping events without subtracting the overlap. Addition Rule keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Addition Rule, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Addition Rule works this concrete case: A fair die. P(score ≤ 2)?",
    howItWorks: "procedure",
    whyItWorks: "The addition rule finds the probability that A or B happens.",
    worked: [
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  505: {
    introduction: "Multiplication Rule works this concrete case: A fair die. P(score ≤ 3)? The labelled answer is 3/6. Calculate joint events. Uses tree diagrams and conditional branches. A common labelled error is multiplying as if events are independent when they are not. Multiplication Rule keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Multiplication Rule, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Multiplication Rule works this concrete case: A fair die. P(score ≤ 3)?",
    howItWorks: "procedure",
    whyItWorks: "The multiplication rule finds the probability that A and B both happen.",
    worked: [
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  506: {
    introduction: "Independent Events works this concrete case: Does one fair coin toss affect the next toss? The labelled answer is no. Test independence. Compares joint and product probabilities. A common labelled error is thinking independent means the events cannot happen together. Independent Events keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Independent Events, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Independent Events works this concrete case: Does one fair coin toss affect the next toss?",
    howItWorks: "concept",
    whyItWorks: "Independent events are events where one happening does not change the probability of the other.",
    worked: [
      { prompt: "Does one fair coin toss affect the next toss?", steps: ["concept", "Read the labelled result.", "no"], answer: "no" },
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" }
    ],
  },
  507: {
    introduction: "Mutually Exclusive Events works this concrete case: A fair die. P(score ≤ 5)? The labelled answer is 5/6. Recognise disjoint events. Shows non-overlapping regions. A common labelled error is confusing mutually exclusive with independent. Mutually Exclusive Events keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Mutually Exclusive Events, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Mutually Exclusive Events works this concrete case: A fair die. P(score ≤ 5)?",
    howItWorks: "concept",
    whyItWorks: "Mutually exclusive events cannot happen at the same time in one trial.",
    worked: [
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  508: {
    introduction: "Conditional Probability works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Update based on information. Restricts the sample space dynamically. A common labelled error is using the original denominator after a condition is known. Conditional Probability keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Conditional Probability, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Conditional Probability works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "concept",
    whyItWorks: "Conditional probability is the chance of one event when another event is already known.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  509: {
    introduction: "Tree Diagrams works this concrete case: In a tree diagram, do you add or multiply along one path? The labelled answer is multiply. Model sequences. Creates branches with probabilities and outcomes. A common labelled error is adding probabilities along one path. Tree Diagrams keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Tree Diagrams, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Tree Diagrams works this concrete case: In a tree diagram, do you add or multiply along one path?",
    howItWorks: "visual_exploration",
    whyItWorks: "A tree diagram shows probability paths for multi-step experiments.",
    worked: [
      { prompt: "In a tree diagram, do you add or multiply along one path?", steps: ["visual_exploration", "Read the labelled result.", "multiply"], answer: "multiply" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" }
    ],
  },
  510: {
    introduction: "Venn Diagrams works this concrete case: Where do outcomes in both A and B go? The labelled answer is overlap. Visualise set-based probability. Shades unions, intersections and complements. A common labelled error is putting the overlap into both only-regions. Venn Diagrams keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Venn Diagrams, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Venn Diagrams works this concrete case: Where do outcomes in both A and B go?",
    howItWorks: "visual_exploration",
    whyItWorks: "A Venn diagram shows events as regions inside a sample space.",
    worked: [
      { prompt: "Where do outcomes in both A and B go?", steps: ["visual_exploration", "Read the labelled result.", "overlap"], answer: "overlap" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  511: {
    introduction: "Two-Way Tables works this concrete case: A two-way table has row totals and column what? The labelled answer is totals. Analyse categorical probabilities. Calculates marginal, joint and conditional values. A common labelled error is confusing a row total with one joint cell. Two-Way Tables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Two-Way Tables, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Two-Way Tables works this concrete case: A two-way table has row totals and column what?",
    howItWorks: "visual_exploration",
    whyItWorks: "A two-way table organises counts by two categories at once.",
    worked: [
      { prompt: "A two-way table has row totals and column what?", steps: ["visual_exploration", "Read the labelled result.", "totals"], answer: "totals" },
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" }
    ],
  },
  512: {
    introduction: "Bayes' Theorem works this concrete case: A fair die. P(score ≤ 4)? The labelled answer is 4/6. Reverse conditions. Updates prior probabilities with evidence. A common labelled error is ignoring the base rate before using test evidence. Bayes' Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Bayes' Theorem, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Bayes' Theorem works this concrete case: A fair die. P(score ≤ 4)?",
    howItWorks: "procedure",
    whyItWorks: "Bayes' theorem updates a probability after new evidence is known.",
    worked: [
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  513: {
    introduction: "Expected Value works this concrete case: Do more trials usually reduce random noise? The labelled answer is yes. Understand long-run average. Calculates outcome-weighted means. A common labelled error is thinking expected value must be the most likely single outcome. Expected Value keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Expected Value, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Expected Value works this concrete case: Do more trials usually reduce random noise?",
    howItWorks: "concept",
    whyItWorks: "Expected value is the long-run average outcome of a random variable.",
    worked: [
      { prompt: "Do more trials usually reduce random noise?", steps: ["concept", "Read the labelled result.", "yes"], answer: "yes" },
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" }
    ],
  },
  514: {
    introduction: "Simulation works this concrete case: Do more trials usually reduce random noise? The labelled answer is yes. Approximate probabilities. Runs repeated virtual experiments. A common labelled error is trusting a very small simulation as exact. Simulation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Simulation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Simulation works this concrete case: Do more trials usually reduce random noise?",
    howItWorks: "tool",
    whyItWorks: "A probability simulation imitates random trials to estimate chances.",
    worked: [
      { prompt: "Do more trials usually reduce random noise?", steps: ["tool", "Read the labelled result.", "yes"], answer: "yes" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" }
    ],
  },
  515: {
    introduction: "Law of Large Numbers works this concrete case: The law of large numbers is about long-run what? The labelled answer is frequency. Observe frequency stabilisation. Plots cumulative experimental probability. A common labelled error is thinking a tail is due just because many heads happened. Law of Large Numbers keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Law of Large Numbers, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Law of Large Numbers works this concrete case: The law of large numbers is about long-run what?",
    howItWorks: "concept",
    whyItWorks: "The law of large numbers says sample results tend to get closer to the true probability as trials increase.",
    worked: [
      { prompt: "The law of large numbers is about long-run what?", steps: ["concept", "Read the labelled result.", "frequency"], answer: "frequency" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" }
    ],
  },
  516: {
    introduction: "Distribution Calculator works this concrete case: What must you choose before entering parameters? The labelled answer is distribution. Calculate distribution probabilities. Selects a distribution and parameter values. A common labelled error is using a calculator distribution that does not match the situation. Distribution Calculator keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Distribution Calculator, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Distribution Calculator works this concrete case: What must you choose before entering parameters?",
    howItWorks: "tool",
    whyItWorks: "A distribution calculator computes probabilities from a chosen probability model.",
    worked: [
      { prompt: "What must you choose before entering parameters?", steps: ["tool", "Read the labelled result.", "distribution"], answer: "distribution" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  517: {
    introduction: "Probability Plot works this concrete case: A probability plot checks data against a theoretical what? The labelled answer is distribution. Visualise mass or density. Displays and shades distribution regions. A common labelled error is thinking points must lie perfectly on the line. Probability Plot keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Probability Plot, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Probability Plot works this concrete case: A probability plot checks data against a theoretical what?",
    howItWorks: "visual_exploration",
    whyItWorks: "A probability plot compares data with a theoretical distribution.",
    worked: [
      { prompt: "A probability plot checks data against a theoretical what?", steps: ["visual_exploration", "Read the labelled result.", "distribution"], answer: "distribution" },
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" }
    ],
  },
  518: {
    introduction: "Cumulative Distribution works this concrete case: A fair die. P(score ≤ 4)? The labelled answer is 4/6. Understand cumulative probability. Plots CDF values. A common labelled error is confusing P(X = x) with P(X <= x). Cumulative Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Cumulative Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cumulative Distribution works this concrete case: A fair die. P(score ≤ 4)?",
    howItWorks: "concept",
    whyItWorks: "A cumulative distribution gives the probability that a random variable is at or below a value.",
    worked: [
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  519: {
    introduction: "Interval / Tail Probability works this concrete case: Tail questions often ask above or below a what? The labelled answer is cutoff. Calculate selected regions. Shades left, right or bounded intervals. A common labelled error is using the left tail when the question asks for the right tail. Interval / Tail Probability keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Interval / Tail Probability, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Interval / Tail Probability works this concrete case: Tail questions often ask above or below a what?",
    howItWorks: "procedure",
    whyItWorks: "Interval probability is chance inside a range, and tail probability is chance beyond a cutoff.",
    worked: [
      { prompt: "Tail questions often ask above or below a what?", steps: ["procedure", "Read the labelled result.", "cutoff"], answer: "cutoff" },
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" }
    ],
  },
  520: {
    introduction: "Inverse Probability works this concrete case: Inverse probability returns a cutoff what? The labelled answer is value. Find quantiles. Returns x-values for selected cumulative probabilities. A common labelled error is confusing the target probability with the output value. Inverse Probability keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Inverse Probability, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Inverse Probability works this concrete case: Inverse probability returns a cutoff what?",
    howItWorks: "procedure",
    whyItWorks: "Inverse probability finds the value that matches a given cumulative probability.",
    worked: [
      { prompt: "Inverse probability returns a cutoff what?", steps: ["procedure", "Read the labelled result.", "value"], answer: "value" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" }
    ],
  },
  521: {
    introduction: "Bernoulli Distribution works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Model one binary trial. Displays success and failure probabilities. A common labelled error is using Bernoulli for many trials at once. Bernoulli Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Bernoulli Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Bernoulli Distribution works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "concept",
    whyItWorks: "A Bernoulli distribution models one trial with two outcomes: success or failure.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  522: {
    introduction: "Binomial Distribution works this concrete case: A fair die. P(score ≤ 2)? The labelled answer is 2/6. Model repeated binary trials. Adjusts n and p and shows probabilities. A common labelled error is using binomial when trials are not independent or p changes. Binomial Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Binomial Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Binomial Distribution works this concrete case: A fair die. P(score ≤ 2)?",
    howItWorks: "concept",
    whyItWorks: "A binomial distribution models the number of successes in a fixed number of independent Bernoulli trials.",
    worked: [
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  523: {
    introduction: "Hypergeometric Distribution works this concrete case: Hypergeometric draws are with or without replacement? The labelled answer is without. Model sampling without replacement. Adjusts population and sample composition. A common labelled error is using binomial when draws are without replacement. Hypergeometric Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Hypergeometric Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Hypergeometric Distribution works this concrete case: Hypergeometric draws are with or without replacement?",
    howItWorks: "concept",
    whyItWorks: "The hypergeometric distribution counts successes in draws without replacement from a finite group.",
    worked: [
      { prompt: "Hypergeometric draws are with or without replacement?", steps: ["concept", "Read the labelled result.", "without"], answer: "without" },
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" }
    ],
  },
  524: {
    introduction: "Poisson Distribution works this concrete case: A fair die. P(score ≤ 4)? The labelled answer is 4/6. Model event counts. Adjusts mean rate and count interval. A common labelled error is naming a rate without saying the interval. Poisson Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Poisson Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Poisson Distribution works this concrete case: A fair die. P(score ≤ 4)?",
    howItWorks: "concept",
    whyItWorks: "The Poisson distribution models counts of events in a fixed time, area, or space when events occur at an average rate.",
    worked: [
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  525: {
    introduction: "Geometric Distribution works this concrete case: A fair die. P(score ≤ 5)? The labelled answer is 5/6. Model trials to first success. Adjusts success probability. A common labelled error is confusing trial number with number of failures before success. Geometric Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Geometric Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Geometric Distribution works this concrete case: A fair die. P(score ≤ 5)?",
    howItWorks: "concept",
    whyItWorks: "The geometric distribution models the trial number of the first success in repeated independent Bernoulli trials.",
    worked: [
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  526: {
    introduction: "Negative Binomial Distribution works this concrete case: Negative binomial needs a fixed target number of what? The labelled answer is successes. Model trials to multiple successes. Adjusts target successes and probability. A common labelled error is forgetting the target number of successes. Negative Binomial Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Negative Binomial Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Negative Binomial Distribution works this concrete case: Negative binomial needs a fixed target number of what?",
    howItWorks: "concept",
    whyItWorks: "The negative binomial distribution models the trial number or failure count needed to reach a fixed number of successes.",
    worked: [
      { prompt: "Negative binomial needs a fixed target number of what?", steps: ["concept", "Read the labelled result.", "successes"], answer: "successes" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" }
    ],
  },
  527: {
    introduction: "Uniform Distribution works this concrete case: In a uniform distribution, allowed outcomes are equally what? The labelled answer is likely. Model equally likely intervals. Adjusts lower and upper bounds. A common labelled error is giving probability to values outside the allowed range. Uniform Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Uniform Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Uniform Distribution works this concrete case: In a uniform distribution, allowed outcomes are equally what?",
    howItWorks: "concept",
    whyItWorks: "A uniform distribution gives equal probability to all allowed outcomes or equal density across an interval.",
    worked: [
      { prompt: "In a uniform distribution, allowed outcomes are equally what?", steps: ["concept", "Read the labelled result.", "likely"], answer: "likely" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" }
    ],
  },
  528: {
    introduction: "Normal Distribution works this concrete case: The normal distribution is symmetric around its what? The labelled answer is mean. Explore bell curves. Adjusts mean and standard deviation. A common labelled error is assuming every bell-shaped graph is exactly normal. Normal Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Normal Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Normal Distribution works this concrete case: The normal distribution is symmetric around its what?",
    howItWorks: "concept",
    whyItWorks: "The normal distribution is a symmetric bell-shaped distribution described by its mean and standard deviation.",
    worked: [
      { prompt: "The normal distribution is symmetric around its what?", steps: ["concept", "Read the labelled result.", "mean"], answer: "mean" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  529: {
    introduction: "Student t Distribution works this concrete case: The t distribution has heavier what than the normal? The labelled answer is tails. Model small-sample inference. Adjusts degrees of freedom. A common labelled error is using z methods when the population standard deviation is unknown. Student t Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Student t Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Student t Distribution works this concrete case: The t distribution has heavier what than the normal?",
    howItWorks: "concept",
    whyItWorks: "The Student t distribution is a bell-shaped distribution with heavier tails than the normal distribution.",
    worked: [
      { prompt: "The t distribution has heavier what than the normal?", steps: ["concept", "Read the labelled result.", "tails"], answer: "tails" },
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" }
    ],
  },
  530: {
    introduction: "Chi-Square Distribution works this concrete case: Can a chi-square statistic be negative? The labelled answer is no. Support categorical and variance inference. Adjusts degrees of freedom and tails. A common labelled error is expecting chi-square values to be negative. Chi-Square Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Chi-Square Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Chi-Square Distribution works this concrete case: Can a chi-square statistic be negative?",
    howItWorks: "concept",
    whyItWorks: "The chi-square distribution is a right-skewed distribution used with sums of squared standard normal values.",
    worked: [
      { prompt: "Can a chi-square statistic be negative?", steps: ["concept", "Read the labelled result.", "no"], answer: "no" },
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" }
    ],
  }
};

export function applyBatch4HandOverlay(lesson: StrengthenedLesson): StrengthenedLesson {
  const overlay = overlays[Number(lesson.id)];
  if (!overlay) return lesson;
  const workedExamples: WorkedExample[] = [
    ...overlay.worked.map((example, index) => ({
      id: `${lesson.id}-batch4-worked-${index + 1}`,
      prompt: example.prompt,
      steps: example.steps,
      answer: example.answer,
    })),
    ...lesson.workedExamples.filter(
      (example) =>
        !overlay.worked.some(
          (item) => item.prompt.trim().toLowerCase() === example.prompt.trim().toLowerCase(),
        ),
    ),
  ];
  return {
    ...lesson,
    introduction: overlay.introduction,
    basicIdea: overlay.basicIdea,
    howItWorks: overlay.howItWorks,
    whyItWorks: overlay.whyItWorks,
    definitions: [
      { id: `${lesson.id}-batch4-definition`, statement: overlay.definition },
      ...lesson.definitions,
    ],
    workedExamples,
  };
}

export const batch4HandAuthoredLessonIds = Object.keys(overlays).map(Number).sort((left, right) => left - right);
