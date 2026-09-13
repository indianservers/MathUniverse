export type StudioLearningCopy = {
  observe: string;
  understand: string;
  why: string;
  try: string;
  challenge: string;
};

export type StudioMockupPage = {
  id: string;
  label: string;
  route: string;
  title: string;
  subtitle: string;
  description: string;
  modes: string[];
  challenge: { prompt: string; expected: number; hint: string };
  learning: StudioLearningCopy;
};

export type StudioMockupDefinition = {
  id: string;
  name: string;
  mark: string;
  homeTitle: string;
  homeSubtitle: string;
  searchPlaceholder: string;
  basePath: string;
  continueLabel: string;
  continueRoute: string;
  pages: StudioMockupPage[];
};

const loop = (observe: string, understand: string, why: string, tryText: string, challenge: string): StudioLearningCopy => ({
  observe, understand, why, try: tryText, challenge,
});

function page(
  id: string,
  label: string,
  base: string,
  title: string,
  subtitle: string,
  description: string,
  modes: string[],
  challenge: StudioMockupPage["challenge"],
  learning: StudioLearningCopy,
): StudioMockupPage {
  return { id, label, route: id === "home" ? base : `${base}/${id}`, title, subtitle, description, modes, challenge, learning };
}

export const studioMockups: Record<string, StudioMockupDefinition> = {
  geometry: {
    id: "geometry", name: "Geometry Studio", mark: "G", homeTitle: "Geometry Studio",
    homeSubtitle: "Construct, measure, transform, and prove with interactive figures.",
    searchPlaceholder: "Search constructions, theorems, or solids...",
    basePath: "/geometry", continueLabel: "Triangles & Congruence", continueRoute: "/geometry/triangles",
    pages: [
      page("home", "Studio Home", "/geometry", "Geometry Studio", "Explore shape, measure, and proof.", "Launch a geometry lab.", [], { prompt: "0", expected: 0, hint: "" }, loop("Watch the figure.", "Read the measures.", "See why it holds.", "Move a point.", "Prove a claim.")),
      page("construction", "Construction", "/geometry", "Construction Workspace", "Build figures with dependent objects.", "Point, line, circle, and polygon tools.", ["Live Object Tree", "Measurements", "Dependencies", "Proof Explanation"], { prompt: "How many degrees in a straight angle?", expected: 180, hint: "A straight line is a half turn." }, loop("Watch objects appear.", "Read the object tree.", "Dependencies keep the figure consistent.", "Add a circle through two points.", "Reconstruct a perpendicular bisector.")),
      page("triangles", "Triangles", "/geometry", "Triangles Lab", "Explore triangle geometry through dynamic constructions, measurements and proofs.", "Interactive triangle explorer.", ["Triangle Explorer", "Congruence", "Similarity", "Centers", "Inequalities"], { prompt: "Angle sum of a triangle (degrees)?", expected: 180, hint: "Interior angles of a Euclidean triangle." }, loop("Drag vertices to explore how side lengths and angles change.", "Notice if parts remain constant under different movements.", "Why does SSS guarantee triangle congruence?", "Use transformations to move one triangle onto the other.", "Create two non-congruent triangles that look similar.")),
      page("circles", "Circles", "/geometry", "Circles Lab", "Explore circle geometry through constructions, measurements and dynamic relationships.", "Circle theorems in motion.", ["Chords", "Tangents", "Angles", "Power of a Point", "Arcs & Sectors"], { prompt: "Angle in a semicircle (degrees)?", expected: 90, hint: "Thales' theorem." }, loop("Move the inscribed point.", "Read the intercepted arc.", "Inscribed angle is half the center.", "Drag a tangent.", "Find an angle from an arc.")),
      page("polygons", "Polygons", "/geometry", "Polygons Lab", "Explore polygon structure, angles, tessellations, area and diagonals through interactive constructions.", "Regular polygons, interior angles, tessellation, area, and diagonals.", ["Regular Polygon", "Interior Angles", "Tessellation", "Area", "Diagonals"], { prompt: "Interior angle of a regular hexagon?", expected: 120, hint: "((n-2)×180)/n." }, loop("Change n and watch the regular n-gon rebuild.", "Interior sum is (n−2)×180°; exteriors always close 360°.", "Only triangles, squares, and hexagons tessellate regularly.", "Decompose area into triangles or use the shoelace formula.", "Count n(n−3)/2 diagonals of an octagon.")),
      page("transformations", "Transformations", "/geometry", "Transformations Lab", "Translate, rotate, reflect, dilate, compose.", "See images of a shape.", ["Translate", "Rotate", "Reflect", "Dilate", "Compose"], { prompt: "Rotation of 180° around origin sends (1,0) to x=?", expected: -1, hint: "Halfway around the origin." }, loop("Move the pre-image.", "Read the image coordinates.", "Isometries preserve distance.", "Compose reflect then rotate.", "Map a triangle onto another.")),
      page("coordinate", "Coordinate Geometry", "/geometry", "Coordinate Geometry", "Distance, midpoint, slope, and loci.", "Algebra meets the plane.", ["Distance", "Midpoint", "Slope", "Section Formula", "Locus"], { prompt: "Distance from (0,0) to (3,4)?", expected: 5, hint: "3-4-5 triangle." }, loop("Plot two points.", "Read distance and slope.", "The formula is Pythagoras on the grid.", "Find a midpoint.", "Write the locus of a circle.")),
      page("measurement", "Measurement", "/geometry", "Measurement Lab", "Length, angle, area, perimeter, scale, error.", "Precision and scale.", ["Length", "Angle", "Area", "Perimeter", "Scale", "Error"], { prompt: "Area of a 6 by 4 rectangle?", expected: 24, hint: "length × width." }, loop("Measure a segment.", "Compare units.", "Scale multiplies lengths linearly.", "Change the scale factor.", "Estimate error after rounding.")),
      page("proofs", "Theorems & Proofs", "/geometry", "Theorem & Visual Proof", "See why classic theorems hold.", "Visual proof selector.", ["Pythagoras", "Angle Sum", "Circle Theorems", "Similarity", "Area Proofs"], { prompt: "In a 3-4-5 triangle, hypotenuse is?", expected: 5, hint: "3²+4²=c²." }, loop("Watch the rearrangement.", "Read each proof step.", "Area is conserved under dissection.", "Rearrange the squares.", "Write a two-column proof.")),
      page("solids", "Solid Geometry", "/geometry", "Solid Geometry", "Prisms, pyramids, cylinders, cones, spheres.", "Nets and cross-sections.", ["Prisms", "Pyramids", "Cylinders", "Cones", "Spheres", "Nets", "Cross-sections"], { prompt: "Volume of a cube of side 3?", expected: 27, hint: "s³." }, loop("Rotate the solid.", "Read surface area and volume.", "Nets fold without overlap.", "Unfold a cylinder.", "Sketch a cross-section.")),
      page("ar", "Geometry AR", "/geometry", "Geometry AR Lab", "Overlay constructions on the camera plane.", "AR construction tools.", ["Select", "Point", "Line", "Circle", "Polygon", "3D Solid", "Plane", "Measure"], { prompt: "A full turn in degrees?", expected: 360, hint: "One complete rotation." }, loop("Place a point in AR.", "Measure a live length.", "Camera pose maps world to screen.", "Measure a room corner.", "Capture a triangle overlay.")),
    ],
  },
  trigonometry: {
    id: "trigonometry", name: "Trigonometry Studio", mark: "θ", homeTitle: "Trigonometry Studio",
    homeSubtitle: "From the unit circle to waves, identities, and applications.",
    searchPlaceholder: "Search angles, identities, or waves...",
    basePath: "/trigonometry", continueLabel: "Unit Circle", continueRoute: "/trigonometry/unit-circle",
    pages: [
      page("home", "Studio Home", "/trigonometry", "Trigonometry Studio", "Angles, triangles, and waves.", "", [], { prompt: "0", expected: 0, hint: "" }, loop("Watch the circle.", "Read sine and cosine.", "Projection explains the graphs.", "Change the angle.", "Solve a triangle.")),
      page("unit-circle", "Unit Circle", "/trigonometry", "Unit Circle & Angle Studio", "Explore angles, unit circle relationships, and exact trig values.", "Drag the terminal ray.", ["Angles", "Unit Circle", "Quadrants", "Exact Values", "Reference Angles"], { prompt: "sin(90°) = ?", expected: 1, hint: "The point is (0,1)." }, loop("See how the point moves on the unit circle as θ changes.", "Understand projections, signs, and exact values.", "Discover the meaning behind the relationships.", "Practice with angles and check your understanding.", "Solve problems and apply trig concepts.")),
      page("right-triangle", "Right Triangle", "/trigonometry", "Right Triangle Studio", "Solve, explore, and master right triangles.", "SOH-CAH-TOA in motion.", ["Solve Triangle", "Ratios", "Pythagoras", "Similarity", "Special Triangles"], { prompt: "In a 30-60-90 triangle, short leg if hypotenuse is 2?", expected: 1, hint: "Short leg is half the hypotenuse." }, loop("Move points and see how sides and angles change in real time.", "Explore ratios, the Pythagorean theorem, and right triangle facts.", "Discover the relationships behind the calculations.", "Change inputs or drag vertices to create your own problems.", "Solve triangle puzzles and beat your best time.")),
      page("graphs", "Functions & Graphs", "/trigonometry", "Trigonometric Functions & Graphs Studio", "Explore how transformations shape sine, cosine, and tangent graphs.", "Amplitude, period, phase.", ["Sine", "Cosine", "Tangent", "Transformations", "Comparison"], { prompt: "Period of sin(2x) in π units? Enter 1 for π.", expected: 1, hint: "Period is 2π/|b|." }, loop("Drag a point on the unit circle or the graph to see them synchronize.", "Amplitude controls height. B controls period. C shifts left/right. D moves up/down.", "Transformations come from stretching and shifting the parent function.", "Change B to 2 and C to −π/2. What happens to the graph?", "Can you make the graph pass through (0, 1.5) with a period of π?")),
      page("identities", "Identities", "/trigonometry", "Identities & Visual Proofs", "Pythagorean and angle-sum identities.", "Prove with the circle.", ["Pythagorean", "Angle Sum", "Double Angle", "Half Angle", "Product-Sum"], { prompt: "sin²θ + cos²θ = ?", expected: 1, hint: "Unit circle radius." }, loop("Move θ.", "See the identity hold.", "The radius is identically 1.", "Expand sin(2θ).", "Verify a double-angle value.")),
      page("inverse", "Inverse Trig", "/trigonometry", "Inverse Trig Lab", "Principal values and compositions.", "Arcsin, arccos, arctan.", ["Arcsin", "Arccos", "Arctan", "Principal Values", "Compositions"], { prompt: "arcsin(1) in degrees?", expected: 90, hint: "Sine of 90° is 1." }, loop("Restrict the range.", "Read the principal value.", "Inverse undoes on the principal branch.", "Compose sin(arcsin x).", "Find arctan(1).")),
      page("oblique", "Sine & Cosine Laws", "/trigonometry", "Oblique Triangle Studio", "Explore and solve non-right triangles using the Sine Law and Cosine Law.", "Sine and cosine laws.", ["Sine Law", "Cosine Law", "Area", "SSA Ambiguous Case", "Solve Triangle"], { prompt: "Area of SAS triangle a=2, b=2, included 90°?", expected: 2, hint: "(1/2)ab sin C." }, loop("Manipulate the triangle and watch how sides and angles respond together.", "See how the Sine Law and Cosine Law connect sides and angles.", "Explore why the laws hold true for any triangle.", "Change the known values and solve new triangles.", "Test yourself with real-world problems and puzzles.")),
      page("waves", "Waves & Harmonics", "/trigonometry", "Waves & Harmonics Studio", "Explore, combine, and analyze periodic motion and harmonic phenomena.", "Build a wave.", ["Simple Wave", "Superposition", "Harmonics", "Beats", "Phase"], { prompt: "Beat frequency for 10 Hz and 12 Hz?", expected: 2, hint: "|f1 − f2|." }, loop("Watch how changing frequency or phase alters the pattern.", "Learn how superposition creates interference and beats.", "Explore the connection between waves and circular motion.", "Adjust parameters to matching a target waveform.", "Build a waveform using specific harmonic coefficients.")),
      page("applications", "Applications", "/trigonometry", "Applications Lab", "Heights, bearings, navigation, surveying.", "Real-world triangles.", ["Heights & Distances", "Bearings", "Navigation", "Surveying", "Periodic Models"], { prompt: "Height if tan(45°)=h/10 with adjacent 10?", expected: 10, hint: "tan 45° = 1." }, loop("Change the angle of elevation.", "Read the height.", "Tangent is opposite over adjacent.", "Work a bearing problem.", "Model a tide.")),
      page("ar", "AR Lab", "/trigonometry", "Trigonometry AR Lab", "Measure height and project waves in AR.", "Camera overlays.", ["Height Measurement", "Distance", "Angle", "Triangle Overlay", "Unit Circle", "Wave Projection"], { prompt: "If angle of elevation is 45° and distance is 8, height is?", expected: 8, hint: "tan 45° = 1." }, loop("Point the camera.", "Read live angle.", "The overlay is a similar triangle.", "Measure a building.", "Project a unit circle.")),
    ],
  },
  "linear-algebra": {
    id: "linear-algebra", name: "Linear Algebra Studio", mark: "A", homeTitle: "Linear Algebra Studio",
    homeSubtitle: "Vectors, matrices, spaces, and transformations you can move.",
    searchPlaceholder: "Search vectors, eigen, or transforms...",
    basePath: "/linear-algebra", continueLabel: "Eigenvectors", continueRoute: "/linear-algebra/eigenvectors",
    pages: [
      page("home", "Studio Home", "/linear-algebra", "Linear Algebra Studio", "See linear maps in 2D and 3D.", "", [], { prompt: "0", expected: 0, hint: "" }, loop("Watch a vector.", "Read components.", "Matrices act as maps.", "Apply a shear.", "Find an eigenvector.")),
      page("vectors", "Vectors", "/linear-algebra", "Vectors Lab", "Explore vectors in 3D: components, operations, dot and cross products, projections.", "2D and 3D vector ops.", ["Dot", "Cross", "Projections", "Add", "Subtract", "Scale"], { prompt: "Dot product of (1,0) and (0,1)?", expected: 0, hint: "Orthogonal vectors." }, loop("Drag vector endpoints to explore operations and see values update in real time.", "Study relationships between vectors, angles, and how projections work geometrically.", "Dot product measures alignment. Cross product gives a perpendicular vector and area.", "Change vectors, compute projections, or test a + (b + c) = (a + b) + c.", "Can you make a · b = 0? What maximizes |a × b|?")),
      page("matrices", "Matrices", "/linear-algebra", "Matrices Lab", "Add, multiply, invert, transpose, block.", "Live matrix algebra.", ["Add", "Multiply", "Inverse", "Transpose", "Block"], { prompt: "det([[1,0],[0,1]])?", expected: 1, hint: "Identity." }, loop("Edit an entry.", "Watch the product.", "AB is composition of maps.", "Invert a 2×2.", "Check A A⁻¹ = I.")),
      page("row-reduction", "Row Reduction", "/linear-algebra", "Systems & Row Reduction", "Pivots, RREF, and solution geometry.", "3D / 2D / pivot map.", ["3D View", "2D View", "Pivot Map"], { prompt: "Rank of identity 2×2?", expected: 2, hint: "Two pivots." }, loop("Watch a pivot.", "Read the RREF.", "Pivots count independent rows.", "Solve a 2×2 system.", "Spot a free variable.")),
      page("linear-transforms", "Linear Transforms", "/linear-algebra", "Linear Transformations", "See the plane stretch, rotate, and shear.", "Presets and 2D/3D.", ["Identity", "R90", "Scale X", "Shear", "2D", "3D"], { prompt: "Rotation by 90° sends (1,0) to y=?", expected: 1, hint: "(0,1)." }, loop("Apply a preset.", "Watch the unit square.", "The matrix columns are the images of e1, e2.", "Shear the square.", "Compose two maps.")),
      page("determinants", "Determinants", "/linear-algebra", "Determinants Lab", "Area, volume, orientation, singularity.", "Signed scale of maps.", ["2D Area", "3D Volume", "Cofactor", "Orientation", "Singularity"], { prompt: "det of a 90° rotation?", expected: 1, hint: "Rotation preserves area and orientation." }, loop("Watch the parallelogram.", "Read signed area.", "Negative det reverses orientation.", "Make det 0.", "Find a singular matrix.")),
      page("vector-spaces", "Vector Spaces", "/linear-algebra", "Vector Spaces & Basis", "Span, independence, basis, coordinates.", "Live spanning set.", ["Span", "Independence", "Basis", "Subspaces", "Coordinates"], { prompt: "Dimension of R²?", expected: 2, hint: "Two independent directions." }, loop("Add a vector to the set.", "See the span fill.", "A basis is independent and spanning.", "Read coordinates.", "Test dependence.")),
      page("eigenvectors", "Eigenvectors", "/linear-algebra", "Eigenvalues & Eigenvectors", "Directions the map only scales.", "2D, 3D, phase portrait.", ["2D View", "3D View", "Phase Portrait"], { prompt: "Eigenvalue of I₂ (either)?", expected: 1, hint: "Identity scales by 1." }, loop("Rotate the vector.", "See when it stays on its line.", "Av = λv.", "Trace the phase portrait.", "Find both eigenlines.")),
      page("orthogonality", "Orthogonality", "/linear-algebra", "Orthogonality Lab", "Projections, decompositions, orthonormal frames.", "3D and 2D views.", ["3D View", "Vector Decomp", "2D Projections"], { prompt: "Length of a unit vector?", expected: 1, hint: "Normalized." }, loop("Project onto a subspace.", "Read the residual.", "The error is orthogonal to the subspace.", "Orthonormalize.", "Split into parallel and perpendicular.")),
      page("least-squares", "Least Squares", "/linear-algebra", "Least Squares Lab", "Best fit in the column space.", "Fit a line to data.", ["Fit", "Residuals", "Column Space"], { prompt: "Slope of least squares for points (0,0) and (1,2)?", expected: 2, hint: "The line through the origin and (1,2)." }, loop("Move a data point.", "Watch the fit.", "The residual is orthogonal to the columns.", "Add an outlier.", "Read R².")),
      page("playground", "Transform Playground", "/linear-algebra", "2D/3D Transformation Playground", "Compose maps on dual canvases.", "Presets and a stack.", ["2D Canvas", "3D Canvas", "Compose"], { prompt: "Identity composed n times still has det?", expected: 1, hint: "det I = 1." }, loop("Push a transform.", "See 2D and 3D together.", "Composition is matrix product.", "Reorder the stack.", "Reset to identity.")),
    ],
  },
  "complex-numbers": {
    id: "complex-numbers", name: "Complex Numbers Studio", mark: "i", homeTitle: "Welcome to Complex Numbers Studio",
    homeSubtitle: "Explore, visualize, and master complex numbers through interactive experiments.",
    searchPlaceholder: "Search topics, e.g. z = a + bi, roots, Euler formula...",
    basePath: "/complex-numbers", continueLabel: "Argand Plane", continueRoute: "/complex-numbers/argand-plane",
    pages: [
      page("home", "Studio Home", "/complex-numbers", "Complex Numbers Studio", "Plot, rotate, and transform z.", "", [], { prompt: "0", expected: 0, hint: "" }, loop("Watch z move.", "Read modulus and argument.", "Geometry is algebra.", "Rotate by i.", "Find cube roots of −1.")),
      page("argand-plane", "Argand Plane", "/complex-numbers", "Argand Plane Lab", "Plot z, conjugate, modulus, argument, locus.", "Drag the blue point.", ["Plot", "Modulus", "Argument", "Conjugate", "Distance", "Locus"], { prompt: "|3+4i| = ?", expected: 5, hint: "3-4-5." }, loop("Drag z.", "Read r and θ.", "Modulus is distance from origin.", "Show the conjugate.", "Open locus |z|=2.")),
      page("arithmetic", "Arithmetic", "/complex-numbers", "Complex Arithmetic & Geometry", "Operate on z as plane vectors.", "Parallelogram addition.", ["Add", "Subtract", "Multiply", "Divide", "Conjugate"], { prompt: "Re((2+i)+(1+2i))?", expected: 3, hint: "Add real parts." }, loop("Drag P and Q.", "See the sum diagonal.", "Addition is the parallelogram law.", "Switch to multiply.", "Make a product purely imaginary.")),
      page("polar-forms", "Polar Forms", "/complex-numbers", "Polar & Exponential Forms", "Keep rectangular, polar, and exponential in sync.", "Linked sliders.", ["Rectangular", "Polar", "Exponential"], { prompt: "Argument of i in degrees?", expected: 90, hint: "Positive imaginary axis." }, loop("Move r and θ.", "See all three forms update.", "e^{iθ} is the unit circle.", "Animate conversion.", "Change the argument branch.")),
      page("rotation", "Rotation", "/complex-numbers", "Multiplication as Rotation Lab", "z × w rotates and scales.", "Spiral of powers.", ["Rotate", "Scale", "Sequence"], { prompt: "arg(i) in degrees?", expected: 90, hint: "Multiplying by i is +90°." }, loop("Change arg(w).", "Watch z spiral.", "Multiply adds arguments.", "Set θ = −60°.", "Find w with wz = −z.")),
      page("roots", "Roots", "/complex-numbers", "Roots of Complex Numbers Lab", "nth roots lie on a regular polygon.", "De Moivre in action.", ["Square Roots", "nth Roots", "Roots of Unity", "Polynomial Roots"], { prompt: "How many 6th roots does a nonzero z have?", expected: 6, hint: "n distinct nth roots." }, loop("Change n.", "See the polygon.", "Angles step by 360°/n.", "Rotate the roots.", "Find a purely imaginary cube root.")),
      page("euler", "Euler Formula", "/complex-numbers", "Euler's Formula Lab", "e^{iθ} = cos θ + i sin θ, helix, Taylor.", "Four linked views.", ["Unit Circle", "Helix", "Projections", "Taylor"], { prompt: "e^{iπ} + 1 = ?", expected: 0, hint: "Euler's identity." }, loop("Animate θ.", "Trace the helix.", "Taylor extends e^{iθ} from polynomials.", "Add Taylor terms.", "Check e^{iπ}+1=0.")),
      page("loci", "Loci & Transforms", "/complex-numbers", "Loci & Transformations Lab", "Circles, lines, Möbius, inversion, affine maps.", "Before and after planes.", ["Circle Loci", "Line Loci", "Möbius", "Inversion", "Affine Map"], { prompt: "Möbius maps send generalized circles to circles. How many fixed points can a non-identity Möbius have at most?", expected: 2, hint: "Quadratic equation." }, loop("Drag z on the locus.", "See w = f(z).", "Möbius maps preserve generalized circles.", "Switch to inversion.", "Map a circle to a line.")),
      page("fractals", "Fractals", "/complex-numbers", "Mandelbrot & Julia Sets Lab", "Complex dynamics and fractal structure.", "Linked Mandelbrot and Julia.", ["Mandelbrot Set", "Julia Set"], { prompt: "For c=0, is 0 in the Mandelbrot set? Enter 1 for yes.", expected: 1, hint: "Orbit stays at 0." }, loop("Drag c.", "Watch the Julia set change.", "Bounded orbits stay in the set.", "Raise iterations.", "Find a disconnected Julia.")),
      page("waves-circuits", "Waves & Circuits", "/complex-numbers", "Applications to Waves & Circuits", "Phasors, impedance, and AC power.", "RLC in the complex plane.", ["Phasors", "AC Circuits", "Signal Rotation", "Impedance"], { prompt: "Power factor if φ=0°?", expected: 1, hint: "cos 0° = 1." }, loop("Change frequency.", "See current lag voltage.", "Impedance encodes phase shift.", "Tune L and C.", "Match a target power factor.")),
    ],
  },
  modelling: {
    id: "modelling", name: "Modelling Studio", mark: "M", homeTitle: "Mathematical Modelling Studio",
    homeSubtitle: "Explore • Simulate • Compare • Understand",
    searchPlaceholder: "Search datasets, scenarios or models...",
    basePath: "/mathematical-modelling", continueLabel: "Epidemic Spread", continueRoute: "/mathematical-modelling/epidemics",
    pages: [
      page("home", "Studio Home", "/mathematical-modelling", "Mathematical Modelling Studio", "Build, fit, and compare models.", "", [], { prompt: "0", expected: 0, hint: "" }, loop("Watch a trajectory.", "Compare two models.", "Assumptions change error.", "Tune a parameter.", "Beat the RMSE.")),
      page("motion", "Motion", "/mathematical-modelling", "Motion Modelling Lab", "Projectile, vehicle, pursuit, drag.", "Compare models to data.", ["Projectile", "Vehicle", "Pursuit", "Drag"], { prompt: "Time of flight scale: if g doubles, hang time of a vertical toss falls by about what factor? Enter 0.71 for 1/√2.", expected: 0.71, hint: "t ~ 1/√g." }, loop("Change launch angle.", "Compare drag vs no drag.", "Air resistance shortens range.", "Add a model.", "Minimize RMSE.")),
      page("population", "Population", "/mathematical-modelling", "Population Growth Lab", "Exponential, logistic, harvesting, age structure.", "Carrying capacity in view.", ["Exponential", "Logistic", "Harvesting", "Age Structured"], { prompt: "Logistic equilibrium is at K. If K=5000, equilibrium P=?", expected: 5000, hint: "dP/dt=0 at K." }, loop("Raise r.", "See logistic level off.", "Exponential has no cap.", "Start harvesting.", "Hold P near K.")),
      page("epidemics", "Epidemics", "/mathematical-modelling", "Epidemic Modelling Lab", "SIR, SEIR, vaccination, interventions.", "Compartment flow.", ["SIR", "SEIR", "Vaccination", "Interventions"], { prompt: "If R0 < 1, outbreak dies out. Enter 1 if that statement is true.", expected: 1, hint: "Each case produces fewer than one new case." }, loop("Watch S, I, R.", "Read R0.", "Vaccination lowers effective R.", "Close schools on the timeline.", "Keep peak below capacity.")),
      page("finance", "Finance", "/mathematical-modelling", "Finance & Compound Interest Lab", "Savings, loans, inflation, annuities.", "Nominal vs real value.", ["Savings", "Loans", "Investments", "Inflation", "Annuities"], { prompt: "If interest is 0%, $100 after 5 years is?", expected: 100, hint: "No growth." }, loop("Raise the rate.", "See exponential growth.", "Inflation cuts real value.", "Switch to loans.", "Hit a real-value target.")),
      page("optimization", "Optimization", "/mathematical-modelling", "Optimization Modelling Lab", "Linear programs and trade-offs.", "Feasible region.", ["Production Planning", "Transport", "Design", "Allocation", "Scheduling"], { prompt: "If Max Z=50x+40y and (x,y)=(0,0), Z=?", expected: 0, hint: "Origin." }, loop("Move the objective.", "See binding constraints.", "Shadow prices price scarce resources.", "Add labor.", "Raise profit with the same resources.")),
      page("networks", "Networks & Routing", "/mathematical-modelling", "Networks & Routing Lab", "Dijkstra vs A* under traffic.", "Live route search.", ["Dijkstra", "A*"], { prompt: "Shortest path in a graph of equal weights uses fewest hops. Enter 1 if true.", expected: 1, hint: "BFS/Dijkstra on unit weights." }, loop("Watch the frontier.", "Compare distance and time.", "Heuristics guide A*.", "Close a road.", "Find a faster route.")),
      page("regression", "Regression", "/mathematical-modelling", "Regression & Prediction Lab", "Linear vs polynomial fit, residuals, prediction.", "Train/validation split.", ["Scatter & Fit", "Residuals", "Diagnostics", "Prediction"], { prompt: "A perfect linear fit has R² = ?", expected: 1, hint: "All variance explained." }, loop("Raise polynomial degree.", "Watch residuals flatten.", "Extra degree can overfit.", "Predict at a new x.", "Mind extrapolation.")),
      page("periodic", "Periodic Models", "/mathematical-modelling", "Periodic Phenomena Lab", "Tides, seasons, daylight, sound, cycles.", "Harmonic comparison.", ["Tides", "Seasons", "Daylight", "Sound", "Cycles"], { prompt: "A sine with period 12 hours has frequency 1/12. Enter 12 for the period.", expected: 12, hint: "Period is on the slider." }, loop("Fit two harmonics.", "See RMSE drop.", "A second term captures the second peak.", "Forecast 24 hours.", "Improve the tide model.")),
      page("numerical", "Numerical Experiments", "/mathematical-modelling", "Numerical Experiments Lab", "Monte Carlo, iteration, random walk, sensitivity.", "Estimate π.", ["Monte Carlo", "Iteration", "Random Walk", "Differential Approx.", "Sensitivity"], { prompt: "Monte Carlo π uses 4×(inside/total). If half the points are inside, estimate?", expected: 2, hint: "4×0.5." }, loop("Raise N.", "See the estimate settle.", "Error shrinks like 1/√N.", "Batch run.", "Reach more digits.")),
      page("comparison", "Model Comparison", "/mathematical-modelling", "Model Comparison & Error Lab", "RMSE, AIC, underfit vs overfit.", "Pick the best model.", ["Compare", "Residuals", "Selection"], { prompt: "Lower RMSE is better. Enter 1 if true.", expected: 1, hint: "Error metric." }, loop("Compare three models.", "Read AIC.", "Complexity is penalized.", "Change the split.", "Choose a better model.")),
    ],
  },
  discrete: {
    id: "discrete", name: "Number & Discrete Studio", mark: "#", homeTitle: "Number & Discrete Mathematics Studio",
    homeSubtitle: "Explore the language of numbers, structures, and logic.",
    searchPlaceholder: "Search topics, tools, or problems...",
    basePath: "/discrete-world", continueLabel: "Modular Arithmetic", continueRoute: "/discrete-world/modular-arithmetic",
    pages: [
      page("home", "Studio Home", "/discrete-world", "Number & Discrete Mathematics Studio", "Numbers, logic, graphs, algorithms, crypto.", "", [], { prompt: "0", expected: 0, hint: "" }, loop("Spot structure.", "Connect ideas.", "Prove a small claim.", "Run a tool.", "Solve the daily puzzle.")),
      page("number-sense", "Number Sense", "/discrete-world", "Number Sense & Number Lines Lab", "Integers, fractions, decimals, ratios, powers, scales.", "Drag values on a line.", ["Integers", "Fractions", "Decimals", "Ratios", "Powers", "Scales"], { prompt: "Distance |7-2|?", expected: 5, hint: "Absolute difference." }, loop("Place fractions.", "Read order.", "Distance is |a−b|.", "Add a hop.", "Space three numbers evenly.")),
      page("primes", "Primes & Factors", "/discrete-world", "Factors, Primes & Divisibility Lab", "Sieve, factor trees, GCD and LCM.", "Visual proofs of uniqueness.", ["Sieve of Eratosthenes", "Factor Tree", "GCD & LCM", "Divisibility Rules", "Prime Patterns"], { prompt: "gcd(84,60)?", expected: 12, hint: "Common primes with min powers." }, loop("Run the sieve.", "See primes remain.", "Unique factorization.", "Change the range.", "Find a number with 18 divisors.")),
      page("modular-arithmetic", "Modular Arithmetic", "/discrete-world", "Modular Arithmetic Lab", "Clock arithmetic, inverses, linear congruences.", "Hops on a circle.", ["Clock Arithmetic", "Congruence", "Inverses", "Linear Congruences", "Cycles"], { prompt: "5×2 mod 12?", expected: 10, hint: "10 < 12." }, loop("Animate hops.", "See the cycle length.", "Inverses exist when gcd(a,n)=1.", "Solve 5x≡10 (mod 12).", "Prove a congruence.")),
      page("number-patterns", "Number Patterns", "/discrete-world", "Number Patterns Lab", "Figurate numbers, Pascal, recurrences.", "Grow a pattern.", ["Figurate", "Recursive", "Sequences", "Pascal Triangle", "Fractals"], { prompt: "6th triangular number?", expected: 21, hint: "n(n+1)/2." }, loop("Grow the triangle.", "Read first differences.", "Constant second difference is quadratic.", "Check the formula.", "Sum of squares formula.")),
      page("combinatorics", "Combinatorics", "/discrete-world", "Combinatorics Lab", "Arrangements, selections, inclusion-exclusion.", "Generating tree.", ["Arrangements", "Selections", "Pigeonhole", "Inclusion-Exclusion", "Generating Tree"], { prompt: "4 distinct items, all orders: 4! = ?", expected: 24, hint: "4×3×2×1." }, loop("Toggle order.", "Watch the count.", "Order matters for permutations.", "Allow repeats.", "Count with no adjacent repeats.")),
      page("logic", "Logic", "/discrete-world", "Mathematical Logic Lab", "Gates, truth tables, satisfiability.", "Build a circuit.", ["Circuit", "Truth Table", "Equivalence"], { prompt: "True AND False is 0. Enter 0.", expected: 0, hint: "AND needs both true." }, loop("Flip an input.", "See the table highlight.", "Gates compose formulas.", "Build XOR.", "Find a counterexample.")),
      page("sets", "Sets & Relations", "/discrete-world", "Sets & Relations Lab", "Venn, operations, relations, functions, equivalence.", "Drag elements.", ["Venn Diagram", "Operations", "Cartesian Products", "Relations", "Functions", "Equivalence"], { prompt: "|{1,2,3} ∪ {3,4}|?", expected: 4, hint: "1,2,3,4." }, loop("Drag into a region.", "Read union and intersection.", "Functions pair each input once.", "Test symmetry.", "Make R an equivalence.")),
      page("graphs", "Graph Networks", "/discrete-world", "Graph Theory & Networks Lab", "Paths, coloring, spanning trees, flows.", "Run Dijkstra.", ["Paths", "Connectivity", "Coloring", "Spanning Trees", "Flows"], { prompt: "A tree with 5 vertices has how many edges?", expected: 4, hint: "n−1." }, loop("Run the path.", "Read the cost.", "Dijkstra is optimal on nonnegative weights.", "Color the graph.", "Find a spanning tree.")),
      page("algorithms", "Algorithms", "/discrete-world", "Algorithms Lab", "Sorting, searching, Euclid, complexity.", "Step through Merge Sort.", ["Sorting", "Searching", "Euclid", "Graph Traversal", "Complexity"], { prompt: "Comparisons grow like n log n for merge sort. Enter 1 if true.", expected: 1, hint: "Divide and conquer." }, loop("Step the sort.", "Read the pseudocode.", "Divide and conquer is O(n log n).", "Switch to bubble sort.", "Compare complexity curves.")),
      page("cryptography", "Cryptography", "/discrete-world", "Cryptography Playground", "Classic ciphers and RSA as number theory.", "Educational keys only.", ["Caesar", "Affine", "Vigenère", "RSA Concept", "Diffie-Hellman", "Hashing"], { prompt: "Caesar shift 0 leaves A as A. Enter 0.", expected: 0, hint: "Identity shift." }, loop("Generate p and q.", "Watch modular exponentiation.", "RSA security is factoring n.", "Encrypt a letter.", "Decrypt with d.")),
    ],
  },
  statistics: {
    id: "statistics", name: "Statistics Studio", mark: "σ", homeTitle: "Statistics & Probability Studio",
    homeSubtitle: "Explore data. Model uncertainty. Draw conclusions.",
    searchPlaceholder: "Search datasets...",
    basePath: "/probability-statistics", continueLabel: "Distributions", continueRoute: "/probability-statistics/interactive-distributions",
    pages: [
      page("home", "Studio Home", "/probability-statistics", "Statistics & Probability Studio", "From data to decisions.", "", [], { prompt: "0", expected: 0, hint: "" }, loop("Explore a dataset.", "Summarize center and spread.", "See why CLT works.", "Run a test.", "Open a challenge.")),
      page("data-explorer", "Data Explorer", "/probability-statistics", "Data Explorer", "Import, filter, brush, and visualize.", "Histograms, scatter, box plots.", ["Overview", "Pairwise"], { prompt: "Median of 1,2,3?", expected: 2, hint: "Middle value." }, loop("Brush a region.", "Read the selected summary.", "Association appears in the scatter.", "Filter a category.", "Name a pattern.")),
      page("descriptive", "Descriptive Stats", "/probability-statistics", "Descriptive Statistics Lab", "Center, spread, shape, outliers.", "Dot, box, histogram, Q-Q.", ["Center", "Spread", "Shape", "Outliers", "Grouped"], { prompt: "IQR if Q1=2 and Q3=6?", expected: 4, hint: "Q3−Q1." }, loop("Drag an outlier.", "Watch the mean move.", "The median is resistant.", "Show ±2σ bands.", "Build a skewed set.")),
      page("interactive-distributions", "Distributions", "/probability-statistics", "Interactive Distributions Lab", "Normal, binomial, Poisson, t, chi-square.", "Shade probability.", ["Normal", "Binomial", "Poisson", "Exponential", "t", "Chi-square"], { prompt: "P(−1<Z<1) for standard normal is about 0.68. Enter 0.68.", expected: 0.68, hint: "68-95-99.7." }, loop("Shade between a and b.", "Read the live probability.", "σ stretches the bell.", "Switch to binomial.", "Match a scenario.")),
      page("experiments", "Probability Experiments", "/probability-statistics", "Probability Experiments Lab", "Coins, dice, cards, Bayes.", "Empirical vs theoretical.", ["Coins", "Dice", "Cards", "Spinner", "Conditional", "Bayes"], { prompt: "P(sum=7) with two fair dice = 6/36. Enter 0.167.", expected: 0.167, hint: "Six outcomes out of 36." }, loop("Run many trials.", "See the histogram fill.", "Relative frequency settles.", "Build an event.", "Estimate a rare event.")),
      page("counting", "Combinatorics", "/probability-statistics", "Combinatorics Lab", "Permutations, combinations, Pascal.", "Counting tree.", ["Permutations", "Combinations", "Arrangements", "Multisets", "Counting Tree", "Binomial Coefficients"], { prompt: "P(5,4) = 5!/(5-4)! = ?", expected: 120, hint: "5×4×3×2." }, loop("Toggle order.", "Watch nPr vs nCr.", "Order matters for permutations.", "Read Pascal's row.", "Count with restrictions.")),
      page("clt", "Sampling & CLT", "/probability-statistics", "Sampling & Central Limit Theorem Lab", "Sampling distributions of the mean.", "Repeated samples.", ["Population", "Sampling", "CLT"], { prompt: "SE = σ/√n. If σ=10 and n=25, SE=?", expected: 2, hint: "10/5." }, loop("Draw samples.", "Watch the mean-dot strip.", "Averages become normal.", "Increase n.", "Get an almost-normal sampling distribution.")),
      page("confidence-intervals", "Confidence Intervals", "/probability-statistics", "Confidence Intervals Lab", "Capture rate of repeated intervals.", "Mean, proportion, bootstrap.", ["Mean", "Proportion", "Two-sample", "Bootstrap"], { prompt: "A 95% CI aims to capture μ in 95 of 100 samples. Enter 95.", expected: 95, hint: "Confidence level." }, loop("Run simulations.", "Count blue vs red intervals.", "Width grows with confidence.", "Change n.", "Get margin of error under 2.")),
      page("hypothesis", "Hypothesis Testing", "/probability-statistics", "Hypothesis Testing Lab", "p-values, power, Type I/II.", "One and two samples.", ["One Sample Mean", "Two Sample Mean", "Proportion", "Chi-Square", "Permutation Test"], { prompt: "If p=0.02 and α=0.05, reject H0? Enter 1 for yes.", expected: 1, hint: "p < α." }, loop("Shift the null.", "See p-value change.", "Small p is evidence against H0.", "Change n.", "Inspect Type I / II.")),
      page("correlation", "Regression", "/probability-statistics", "Correlation & Regression Lab", "Fit, residuals, influential points.", "Drag points on the plot.", ["Linear Fit", "Residuals", "Prediction"], { prompt: "If all points are on a line with positive slope, r is 1. Enter 1.", expected: 1, hint: "Perfect correlation." }, loop("Drag a point.", "Watch r and R².", "Residuals diagnose the fit.", "Show the confidence band.", "Predict at a new x.")),
      page("anova", "ANOVA & Design", "/probability-statistics", "ANOVA & Experimental Design Lab", "Group means, variation, CRD.", "Between vs within.", ["Group Comparison", "Variation Decomposition", "Design Canvas", "Diagnostics"], { prompt: "If all group means are equal, F is near 1. Enter 1.", expected: 1, hint: "MSB ≈ MSW." }, loop("Randomize treatments.", "Watch between vs within.", "F compares those mean squares.", "Add a group.", "Run post-hoc.")),
    ],
  },
};

export function studioPagesWithoutHome(def: StudioMockupDefinition) {
  return def.pages.filter((item) => item.id !== "home");
}

export function matchStudioPage(def: StudioMockupDefinition, pathname: string, modeParam?: string | null): StudioMockupPage {
  const labs = studioPagesWithoutHome(def);
  const slug = pathname.replace(def.basePath, "").replace(/^\//, "");
  if (slug) {
    const found = def.pages.find((item) => item.id === slug || item.route === pathname);
    if (found) return found;
  }
  if (modeParam) {
    const byId = labs.find((item) => item.id === modeParam);
    if (byId) return byId;
  }
  return def.pages[0];
}

export const studioRouteTable = Object.values(studioMockups).flatMap((studio) =>
  studio.pages.map((item) => ({ studio: studio.id, path: item.route.replace(/^\//, ""), pageId: item.id })),
);
