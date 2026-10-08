# Ruhi 2D NLP baseline

73/300 passed; 224 failed; 3 blocked. End-to-end record accuracy: 24.33%. Scenario success: 54/237.

| Dimension | Passed / eligible | Accuracy |
|---|---:|---:|
| intent | 191/260 | 73.46% |
| entities | 12/101 | 11.88% |
| numeric | 3/11 | 27.27% |
| context | 95/108 | 87.96% |
| clarification | 19/27 | 70.37% |
| geometry | 57/236 | 24.15% |
| execution | 109/267 | 40.82% |
| response | 131/287 | 45.64% |

Metrics use eligible explicit assertions, not all 300 as each dimension denominator. Blocked records count against full-suite success.

Baseline all-300 is a regression observation; only development failures guide repairs. Repeated templates cross the scenario split.

Response relevance checks are bounded templates, not a free-form semantic judge. Geometry comparisons use relative/absolute 1e-7 coordinate tolerance.

## Failures

- RUHI2D-002 (S-002): Make a rectangle with its lower-left corner at (-2,-1), width 6 and height 4.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; create_rectangle; created type; completion response agrees with execution
- RUHI2D-003 (S-003): Create a square of side 4 starting at (-1,0).
  GEOMETRY_SOLVER_ERROR: lower-left origin and dimensions
- RUHI2D-005 (S-005): Sketch an ellipse centered at (1,2), horizontal radius 5 and vertical radius 2.
  ENTITY_EXTRACTION_ERROR: ellipse semiaxes
- RUHI2D-008 (S-008): Draw a regular parallelogram centered at (-3,0) with circumradius 3.
  GEOMETRY_SOLVER_ERROR: regular polygon circumscribed vertices
- RUHI2D-009 (S-009): Draw a regular rhombus centered at (-2,1) with circumradius 3.
  GEOMETRY_SOLVER_ERROR: regular polygon circumscribed vertices
- RUHI2D-010 (S-010): Draw a regular trapezoid centered at (-1,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
- RUHI2D-012 (S-012): Make a rectangle with its lower-left corner at (1,-1), width 6 and height 4.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; create_rectangle; created type; completion response agrees with execution
- RUHI2D-013 (S-013): Create a square of side 4 starting at (2,0).
  GEOMETRY_SOLVER_ERROR: lower-left origin and dimensions
- RUHI2D-015 (S-015): Sketch an ellipse centered at (-3,2), horizontal radius 5 and vertical radius 2.
  ENTITY_EXTRACTION_ERROR: ellipse semiaxes
- RUHI2D-018 (S-018): Draw a regular parallelogram centered at (0,0) with circumradius 3.
  GEOMETRY_SOLVER_ERROR: regular polygon circumscribed vertices
- RUHI2D-019 (S-019): Draw a regular rhombus centered at (1,1) with circumradius 3.
  GEOMETRY_SOLVER_ERROR: regular polygon circumscribed vertices
- RUHI2D-020 (S-020): Draw a regular trapezoid centered at (2,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
- RUHI2D-022 (S-022): Make a rectangle with its lower-left corner at (-3,-1), width 6 and height 4.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; create_rectangle; created type; completion response agrees with execution
- RUHI2D-023 (S-023): Create a square of side 4 starting at (-2,0).
  GEOMETRY_SOLVER_ERROR: lower-left origin and dimensions
- RUHI2D-025 (S-025): Sketch an ellipse centered at (0,2), horizontal radius 5 and vertical radius 2.
  ENTITY_EXTRACTION_ERROR: ellipse semiaxes
- RUHI2D-028 (S-028): Draw a regular parallelogram centered at (3,0) with circumradius 3.
  GEOMETRY_SOLVER_ERROR: regular polygon circumscribed vertices
- RUHI2D-029 (S-029): Draw a regular rhombus centered at (-3,1) with circumradius 3.
  GEOMETRY_SOLVER_ERROR: regular polygon circumscribed vertices
- RUHI2D-030 (S-030): Draw a regular trapezoid centered at (-2,2) with circumradius 3.
  DATASET_EXPECTATION_ERROR: {"invalid":[],"warnings":["A regular trapezoid has no unique conventional definition; do not silently invent vertices."]}
- RUHI2D-032 (S-032): Plot the function f(x) = -1x + -2.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation graph exists; completion response agrees with execution
- RUHI2D-033 (S-033): Show the straight line with slope 0 and y-intercept -1.
  ACTION_PLANNING_ERROR: normal workspace execution; plot_equation; equation graph exists; completion response agrees with execution
- RUHI2D-034 (S-034): Draw y=1*x+(0) on the coordinate plane.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation graph exists; completion response agrees with execution
- RUHI2D-036 (S-036): Plot the function f(x) = -2x + 2.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation graph exists; completion response agrees with execution
- RUHI2D-037 (S-037): Show the straight line with slope -1 and y-intercept 3.
  ACTION_PLANNING_ERROR: normal workspace execution; plot_equation; equation graph exists; completion response agrees with execution
- RUHI2D-038 (S-038): Draw y=0*x+(-3) on the coordinate plane.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation graph exists; completion response agrees with execution
- RUHI2D-040 (S-040): Plot the function f(x) = 2x + -1.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation graph exists; completion response agrees with execution
- RUHI2D-041 (S-041): Show the straight line with slope -2 and y-intercept 0.
  ACTION_PLANNING_ERROR: normal workspace execution; plot_equation; equation graph exists; completion response agrees with execution
- RUHI2D-042 (S-042): Draw y=-1*x+(1) on the coordinate plane.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation graph exists; completion response agrees with execution
- RUHI2D-044 (S-044): Plot the function f(x) = 1x + 3.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation graph exists; completion response agrees with execution
- RUHI2D-045 (S-045): Show the straight line with slope 2 and y-intercept -3.
  ACTION_PLANNING_ERROR: normal workspace execution; plot_equation; equation graph exists; completion response agrees with execution
- RUHI2D-046 (S-046): Draw y=-2*x+(-2) on the coordinate plane.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation graph exists; completion response agrees with execution
- RUHI2D-048 (S-048): Plot the function f(x) = 0x + 0.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation graph exists; completion response agrees with execution
- RUHI2D-049 (S-049): Show the straight line with slope 1 and y-intercept 1.
  ACTION_PLANNING_ERROR: normal workspace execution; plot_equation; equation graph exists; completion response agrees with execution
- RUHI2D-050 (S-050): Draw y=2*x+(2) on the coordinate plane.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation graph exists; completion response agrees with execution
- RUHI2D-053 (S-053): Move the rectangle we just drew 3 units up.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; correct object translated; translation vector; completion response agrees with execution
- RUHI2D-057 (S-057): Move the rectangle we just drew 3 units up.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; correct object translated; translation vector; completion response agrees with execution
- RUHI2D-061 (S-061): Move the rectangle we just drew 3 units up.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; correct object translated; translation vector; completion response agrees with execution
- RUHI2D-065 (S-065): Move the rectangle we just drew 3 units up.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; correct object translated; translation vector; completion response agrees with execution
- RUHI2D-069 (S-069): Move the rectangle we just drew 3 units up.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; correct object translated; translation vector; completion response agrees with execution
- RUHI2D-071 (S-071): Change selected shape's outline to teal.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke; completion response agrees with execution
- RUHI2D-072 (S-072): Change that triangle's interior to red.
  ENTITY_EXTRACTION_ERROR: style fill
- RUHI2D-073 (S-073): Change the most recent circle's outline to navy blue.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-074 (S-074): Change selected shape's outline to orange.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-075 (S-075): Change that triangle's interior to lime.
  ACTION_PLANNING_ERROR: normal workspace execution; style fill; completion response agrees with execution
- RUHI2D-076 (S-076): Change the most recent circle's outline to magenta.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke; completion response agrees with execution
- RUHI2D-077 (S-077): Change selected shape's outline to purple.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-078 (S-078): Change that triangle's interior to gold.
  ACTION_PLANNING_ERROR: normal workspace execution; style fill; completion response agrees with execution
- RUHI2D-079 (S-079): Change the most recent circle's outline to black.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-080 (S-080): Change selected shape's outline to cyan.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-081 (S-081): Change that triangle's interior to teal.
  ACTION_PLANNING_ERROR: normal workspace execution; style fill; completion response agrees with execution
- RUHI2D-082 (S-082): Change the most recent circle's outline to red.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-083 (S-083): Change selected shape's outline to navy blue.
  ENTITY_EXTRACTION_ERROR: style stroke
- RUHI2D-084 (S-084): Change that triangle's interior to orange.
  ENTITY_EXTRACTION_ERROR: style fill
- RUHI2D-085 (S-085): Change the most recent circle's outline to lime.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke; completion response agrees with execution
- RUHI2D-087 (S-087): Rotate the selected triangle 30 degrees clockwise about its origin.
  GEOMETRY_SOLVER_ERROR: rotation about requested anchor
- RUHI2D-088 (S-088): Rotate the selected triangle 45 degrees counterclockwise about its vertex A.
  GEOMETRY_SOLVER_ERROR: rotation about requested anchor
- RUHI2D-090 (S-090): Rotate the selected triangle 75 degrees counterclockwise about its origin.
  GEOMETRY_SOLVER_ERROR: rotation about requested anchor
- RUHI2D-091 (S-091): Rotate the selected triangle 15 degrees clockwise about its vertex A.
  GEOMETRY_SOLVER_ERROR: rotation about requested anchor
- RUHI2D-093 (S-093): Rotate the selected triangle 45 degrees clockwise about its origin.
  GEOMETRY_SOLVER_ERROR: rotation about requested anchor
- RUHI2D-094 (S-094): Rotate the selected triangle 60 degrees counterclockwise about its vertex A.
  GEOMETRY_SOLVER_ERROR: rotation about requested anchor
- RUHI2D-096 (S-096): Rotate the selected triangle 15 degrees counterclockwise about its origin.
  GEOMETRY_SOLVER_ERROR: rotation about requested anchor
- RUHI2D-097 (S-097): Rotate the selected triangle 30 degrees clockwise about its vertex A.
  GEOMETRY_SOLVER_ERROR: rotation about requested anchor
- RUHI2D-099 (S-099): Rotate the selected triangle 60 degrees clockwise about its origin.
  GEOMETRY_SOLVER_ERROR: rotation about requested anchor
- RUHI2D-100 (S-100): Rotate the selected triangle 75 degrees counterclockwise about its vertex A.
  GEOMETRY_SOLVER_ERROR: rotation about requested anchor
- RUHI2D-101 (CONV-01): On triangle T1, set angle A to 77 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-102 (CONV-01): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-103 (CONV-01): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-104 (CONV-01): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-105 (CONV-02): On triangle T2, set angle B to 80 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-106 (CONV-02): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-107 (CONV-02): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-108 (CONV-02): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-109 (CONV-03): On triangle T3, set angle A to 83 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-110 (CONV-03): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-111 (CONV-03): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-112 (CONV-03): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-113 (CONV-04): On triangle T4, set angle B to 86 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-114 (CONV-04): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-115 (CONV-04): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-116 (CONV-04): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-117 (CONV-05): On triangle T5, set angle A to 89 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-118 (CONV-05): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-119 (CONV-05): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-120 (CONV-05): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-121 (CONV-06): On triangle T6, set angle B to 77 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-122 (CONV-06): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-123 (CONV-06): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-124 (CONV-06): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-125 (CONV-07): On triangle T7, set angle A to 80 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-126 (CONV-07): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-127 (CONV-07): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-128 (CONV-07): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-129 (CONV-08): On triangle T8, set angle B to 83 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-130 (CONV-08): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-131 (CONV-08): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-132 (CONV-08): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-133 (CONV-09): On triangle T9, set angle A to 86 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-134 (CONV-09): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-135 (CONV-09): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-136 (CONV-09): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-137 (CONV-10): On triangle T10, set angle B to 89 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-138 (CONV-10): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-139 (CONV-10): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-140 (CONV-10): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-141 (CONV-11): On triangle T11, set angle A to 77 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-142 (CONV-11): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-143 (CONV-11): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-144 (CONV-11): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-145 (CONV-12): On triangle T12, set angle B to 80 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; actual vertex angle; completion response agrees with execution
- RUHI2D-146 (CONV-12): Increase it by another two degrees.
  ENTITY_EXTRACTION_ERROR: set_angle; actual vertex angle
- RUHI2D-147 (CONV-12): Make its two sides thicker and change the angle mark to violet.
  ACTION_PLANNING_ERROR: normal workspace execution; style stroke_width; style stroke; completion response agrees with execution
- RUHI2D-148 (CONV-12): Actually, undo only the colour change, not the thickness.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; selective style undo; completion response agrees with execution
- RUHI2D-150 (CLAR-01): Make it 1.5 times its current size.
  ACTION_PLANNING_ERROR: normal workspace execution; scale; scale factor; scale convention; completion response agrees with execution
- RUHI2D-155 (CLAR-04): Increase the other angle.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-156 (CLAR-04): I mean angle ABC. Increase it to 84 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; set_angle; actual vertex angle; completion response agrees with execution
- RUHI2D-157 (CLAR-05): Color that polygon differently.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-158 (CLAR-05): Fill it with forest green.
  ACTION_PLANNING_ERROR: normal workspace execution; style fill; completion response agrees with execution
- RUHI2D-162 (CLAR-07): Make it 1.5 times its current size.
  ACTION_PLANNING_ERROR: normal workspace execution; scale; scale factor; scale convention; completion response agrees with execution
- RUHI2D-167 (CLAR-10): Increase the other angle.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-168 (CLAR-10): I mean angle ABC. Increase it to 84 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; set_angle; actual vertex angle; completion response agrees with execution
- RUHI2D-169 (CLAR-11): Color that polygon differently.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-170 (CLAR-11): Fill it with forest green.
  ACTION_PLANNING_ERROR: normal workspace execution; style fill; completion response agrees with execution
- RUHI2D-174 (CLAR-13): Make it 1.5 times its current size.
  ACTION_PLANNING_ERROR: normal workspace execution; scale; scale factor; scale convention; completion response agrees with execution
- RUHI2D-179 (CLAR-16): Increase the other angle.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-180 (CLAR-16): I mean angle ABC. Increase it to 84 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; set_angle; actual vertex angle; completion response agrees with execution
- RUHI2D-181 (CLAR-17): Color that polygon differently.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-182 (CLAR-17): Fill it with forest green.
  ACTION_PLANNING_ERROR: normal workspace execution; style fill; completion response agrees with execution
- RUHI2D-186 (CLAR-19): Make it 1.5 times its current size.
  ACTION_PLANNING_ERROR: normal workspace execution; scale; scale factor; scale convention; completion response agrees with execution
- RUHI2D-191 (CLAR-22): Increase the other angle.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-192 (CLAR-22): I mean angle ABC. Increase it to 84 degrees.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; set_angle; actual vertex angle; completion response agrees with execution
- RUHI2D-193 (CLAR-23): Color that polygon differently.
  FOLLOWUP_RESOLUTION_ERROR: asks before executing; stores pending original action; relevant clarification
- RUHI2D-194 (CLAR-23): Fill it with forest green.
  ACTION_PLANNING_ERROR: normal workspace execution; style fill; completion response agrees with execution
- RUHI2D-198 (CLAR-25): Make it 1.5 times its current size.
  ACTION_PLANNING_ERROR: normal workspace execution; scale; scale factor; scale convention; completion response agrees with execution
- RUHI2D-203 (S-203): Draw a triangle A0B0C0 with vertices (0,0), (4,0), (2,3); then construct its centroid and label it G0.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-204 (S-204): Draw a triangle A1B1C1 with vertices (0,0), (5,0), (2,4); then construct its centroid and label it G1.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-205 (S-205): Draw a triangle A2B2C2 with vertices (0,0), (6,0), (2,5); then construct its centroid and label it G2.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-206 (S-206): Draw a triangle A3B3C3 with vertices (0,0), (7,0), (2,6); then construct its centroid and label it G3.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-207 (S-207): Draw a triangle A4B4C4 with vertices (0,0), (8,0), (2,3); then construct its centroid and label it G4.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-208 (S-208): Draw a triangle A5B5C5 with vertices (0,0), (4,0), (2,4); then construct its centroid and label it G5.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-209 (S-209): Draw a triangle A6B6C6 with vertices (0,0), (5,0), (2,5); then construct its centroid and label it G6.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-210 (S-210): Draw a triangle A7B7C7 with vertices (0,0), (6,0), (2,6); then construct its centroid and label it G7.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-211 (S-211): Draw a triangle A8B8C8 with vertices (0,0), (7,0), (2,3); then construct its centroid and label it G8.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-212 (S-212): Draw a triangle A9B9C9 with vertices (0,0), (8,0), (2,4); then construct its centroid and label it G9.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-213 (S-213): Draw a triangle A10B10C10 with vertices (0,0), (4,0), (2,5); then construct its centroid and label it G10.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-214 (S-214): Draw a triangle A11B11C11 with vertices (0,0), (5,0), (2,6); then construct its centroid and label it G11.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-215 (S-215): Draw a triangle A12B12C12 with vertices (0,0), (6,0), (2,3); then construct its centroid and label it G12.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-216 (S-216): Draw a triangle A13B13C13 with vertices (0,0), (7,0), (2,4); then construct its centroid and label it G13.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-217 (S-217): Draw a triangle A14B14C14 with vertices (0,0), (8,0), (2,5); then construct its centroid and label it G14.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-218 (S-218): Draw a triangle A15B15C15 with vertices (0,0), (4,0), (2,6); then construct its centroid and label it G15.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-219 (S-219): Draw a triangle A16B16C16 with vertices (0,0), (5,0), (2,3); then construct its centroid and label it G16.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-220 (S-220): Draw a triangle A17B17C17 with vertices (0,0), (6,0), (2,4); then construct its centroid and label it G17.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-221 (S-221): Draw a triangle A18B18C18 with vertices (0,0), (7,0), (2,5); then construct its centroid and label it G18.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-222 (S-222): Draw a triangle A19B19C19 with vertices (0,0), (8,0), (2,6); then construct its centroid and label it G19.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; created type; construct_centroid; centroid marker; completion response agrees with execution
- RUHI2D-223 (S-223): Construct a circle tangent to all three sides of triangle T0, then connect its incenter to vertex A0.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-224 (S-224): Construct a circle tangent to all three sides of triangle T1, then connect its incenter to vertex A1.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-225 (S-225): Construct a circle tangent to all three sides of triangle T2, then connect its incenter to vertex A2.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-226 (S-226): Construct a circle tangent to all three sides of triangle T3, then connect its incenter to vertex A3.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-227 (S-227): Construct a circle tangent to all three sides of triangle T4, then connect its incenter to vertex A4.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-228 (S-228): Construct a circle tangent to all three sides of triangle T5, then connect its incenter to vertex A5.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-229 (S-229): Construct a circle tangent to all three sides of triangle T6, then connect its incenter to vertex A6.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-230 (S-230): Construct a circle tangent to all three sides of triangle T7, then connect its incenter to vertex A7.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-231 (S-231): Construct a circle tangent to all three sides of triangle T8, then connect its incenter to vertex A8.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-232 (S-232): Construct a circle tangent to all three sides of triangle T9, then connect its incenter to vertex A9.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-233 (S-233): Construct a circle tangent to all three sides of triangle T10, then connect its incenter to vertex A10.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-234 (S-234): Construct a circle tangent to all three sides of triangle T11, then connect its incenter to vertex A11.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-235 (S-235): Construct a circle tangent to all three sides of triangle T12, then connect its incenter to vertex A12.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-236 (S-236): Construct a circle tangent to all three sides of triangle T13, then connect its incenter to vertex A13.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-237 (S-237): Construct a circle tangent to all three sides of triangle T14, then connect its incenter to vertex A14.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-238 (S-238): Construct a circle tangent to all three sides of triangle T15, then connect its incenter to vertex A15.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-239 (S-239): Construct a circle tangent to all three sides of triangle T16, then connect its incenter to vertex A16.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-240 (S-240): Construct a circle tangent to all three sides of triangle T17, then connect its incenter to vertex A17.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-241 (S-241): Construct a circle tangent to all three sides of triangle T18, then connect its incenter to vertex A18.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-242 (S-242): Construct a circle tangent to all three sides of triangle T19, then connect its incenter to vertex A19.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; incircle created; segment connects intended endpoints; completion response agrees with execution
- RUHI2D-243 (S-243): Find the intersection of y=1x+1 and y=-x+5, put a dot there, and call it P0.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-244 (S-244): Find the intersection of y=2x+1 and y=-x+6, put a dot there, and call it P1.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-245 (S-245): Find the intersection of y=3x+1 and y=-x+7, put a dot there, and call it P2.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-246 (S-246): Find the intersection of y=4x+1 and y=-x+8, put a dot there, and call it P3.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-247 (S-247): Find the intersection of y=1x+1 and y=-x+9, put a dot there, and call it P4.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-248 (S-248): Find the intersection of y=2x+1 and y=-x+10, put a dot there, and call it P5.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-249 (S-249): Find the intersection of y=3x+1 and y=-x+11, put a dot there, and call it P6.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-250 (S-250): Find the intersection of y=4x+1 and y=-x+12, put a dot there, and call it P7.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-251 (S-251): Find the intersection of y=1x+1 and y=-x+13, put a dot there, and call it P8.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-252 (S-252): Find the intersection of y=2x+1 and y=-x+14, put a dot there, and call it P9.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-253 (S-253): Find the intersection of y=3x+1 and y=-x+15, put a dot there, and call it P10.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-254 (S-254): Find the intersection of y=4x+1 and y=-x+16, put a dot there, and call it P11.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-255 (S-255): Find the intersection of y=1x+1 and y=-x+17, put a dot there, and call it P12.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-256 (S-256): Find the intersection of y=2x+1 and y=-x+18, put a dot there, and call it P13.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-257 (S-257): Find the intersection of y=3x+1 and y=-x+19, put a dot there, and call it P14.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; equation intersection marker; intersection label; completion response agrees with execution
- RUHI2D-258 (S-258): Draw a perpendicular from vertex A of triangle T0 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-259 (S-259): Draw a perpendicular from vertex A of triangle T1 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-260 (S-260): Draw a perpendicular from vertex A of triangle T2 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-261 (S-261): Draw a perpendicular from vertex A of triangle T3 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-262 (S-262): Draw a perpendicular from vertex A of triangle T4 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-263 (S-263): Draw a perpendicular from vertex A of triangle T5 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-264 (S-264): Draw a perpendicular from vertex A of triangle T6 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-265 (S-265): Draw a perpendicular from vertex A of triangle T7 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-266 (S-266): Draw a perpendicular from vertex A of triangle T8 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-267 (S-267): Draw a perpendicular from vertex A of triangle T9 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-268 (S-268): Draw a perpendicular from vertex A of triangle T10 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-269 (S-269): Draw a perpendicular from vertex A of triangle T11 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-270 (S-270): Draw a perpendicular from vertex A of triangle T12 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-271 (S-271): Draw a perpendicular from vertex A of triangle T13 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-272 (S-272): Draw a perpendicular from vertex A of triangle T14 onto side BC, then extend the perpendicular until it hits the x-axis.
  ENTITY_EXTRACTION_ERROR: normal workspace execution; perpendicular through triangle A to BC; extend_to_intersection; extended line reaches x-axis; completion response agrees with execution
- RUHI2D-273 (S-273): If the two lines intersect, mark the intersection in teal ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional execution; marks true branch intersection; conditional color
- RUHI2D-274 (S-274): If the two lines intersect, mark the intersection in red ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional execution; marks true branch intersection; conditional color
- RUHI2D-275 (S-275): If the two lines intersect, mark the intersection in navy blue ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional execution; marks true branch intersection; conditional color
- RUHI2D-276 (S-276): If the two lines intersect, mark the intersection in orange ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional execution; marks true branch intersection; conditional color
- RUHI2D-277 (S-277): If the two lines intersect, mark the intersection in lime ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional execution; marks true branch intersection; conditional color
- RUHI2D-278 (S-278): If the two lines intersect, mark the intersection in magenta ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional execution; marks true branch intersection; conditional color
- RUHI2D-279 (S-279): If the two lines intersect, mark the intersection in purple ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional execution; marks true branch intersection; conditional color
- RUHI2D-280 (S-280): If the two lines intersect, mark the intersection in gold ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional execution; marks true branch intersection; conditional color
- RUHI2D-281 (S-281): If the two lines intersect, mark the intersection in black ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional execution; marks true branch intersection; conditional color
- RUHI2D-282 (S-282): If the two lines intersect, mark the intersection in cyan ; otherwise tell me they are parallel without making a point.
  ENTITY_EXTRACTION_ERROR: conditional execution; marks true branch intersection; conditional color
- RUHI2D-283 (S-283): Use the upper triangle, not the lower one. Reflect it across the y-axis, but leave the original visible.
  ENTITY_EXTRACTION_ERROR: reflect_copy; reflected copy preserves original
- RUHI2D-284 (S-284): Use the upper triangle, not the lower one. Reflect it across the y-axis, but leave the original visible.
  ENTITY_EXTRACTION_ERROR: reflect_copy; reflected copy preserves original
- RUHI2D-285 (S-285): Use the upper triangle, not the lower one. Reflect it across the y-axis, but leave the original visible.
  ENTITY_EXTRACTION_ERROR: reflect_copy; reflected copy preserves original
- RUHI2D-286 (S-286): Use the upper triangle, not the lower one. Reflect it across the y-axis, but leave the original visible.
  ENTITY_EXTRACTION_ERROR: reflect_copy; reflected copy preserves original
- RUHI2D-287 (S-287): Use the upper triangle, not the lower one. Reflect it across the y-axis, but leave the original visible.
  ENTITY_EXTRACTION_ERROR: reflect_copy; reflected copy preserves original
- RUHI2D-291 (S-291): Find the midpoint of segment A0B0, label it M0, and make the midpoint marker red.
  GEOMETRY_SOLVER_ERROR: midpoint marker; midpoint label; style stroke
- RUHI2D-292 (S-292): Find the midpoint of segment A1B1, label it M1, and make the midpoint marker red.
  GEOMETRY_SOLVER_ERROR: midpoint marker; midpoint label; style stroke
- RUHI2D-293 (S-293): Find the midpoint of segment A2B2, label it M2, and make the midpoint marker red.
  GEOMETRY_SOLVER_ERROR: midpoint marker; midpoint label; style stroke
- RUHI2D-294 (S-294): Find the midpoint of segment A3B3, label it M3, and make the midpoint marker red.
  GEOMETRY_SOLVER_ERROR: midpoint marker; midpoint label; style stroke
- RUHI2D-295 (S-295): Find the midpoint of segment A4B4, label it M4, and make the midpoint marker red.
  GEOMETRY_SOLVER_ERROR: midpoint marker; midpoint label; style stroke
- RUHI2D-296 (S-296): Find the midpoint of segment A5B5, label it M5, and make the midpoint marker red.
  GEOMETRY_SOLVER_ERROR: midpoint marker; midpoint label; style stroke
- RUHI2D-297 (S-297): Find the midpoint of segment A6B6, label it M6, and make the midpoint marker red.
  GEOMETRY_SOLVER_ERROR: midpoint marker; midpoint label; style stroke
- RUHI2D-298 (S-298): Find the midpoint of segment A7B7, label it M7, and make the midpoint marker red.
  GEOMETRY_SOLVER_ERROR: midpoint marker; midpoint label; style stroke
- RUHI2D-299 (S-299): Find the midpoint of segment A8B8, label it M8, and make the midpoint marker red.
  GEOMETRY_SOLVER_ERROR: midpoint marker; midpoint label; style stroke
- RUHI2D-300 (S-300): Find the midpoint of segment A9B9, label it M9, and make the midpoint marker red.
  GEOMETRY_SOLVER_ERROR: midpoint marker; midpoint label; style stroke
