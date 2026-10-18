import { normalizeChapter } from "./curriculumSharedLessons";

type Profile = { key: string; foundations: number[]; methods: number[]; applications: number[]; scope: string };
type Row = { chapter: string; title: string; grade: number };
export type AlignmentReview = { lessonIds: number[]; relatedLessonIds: number[]; reason: string; profile: string; sourceIssue?: string; replaceExisting?:boolean; missing?: {title:string; rationale:string}[] };
const profiles = new Map<string, Profile>();
const r = (from:number,to:number) => Array.from({length:to-from+1},(_,i) => from+i);
function profile(names:string[], foundations:number[], methods:number[], applications:number[], scope:string) {
  const entry = {key:names[0], foundations, methods, applications, scope};
  for (const name of names) profiles.set(normalizeChapter(name),entry);
}

// Explicit chapter families, with different links for introductory concepts,
// worked methods and applications. These are lesson-skill alignments, not claims
// that an entire textbook chapter or its printed exercises have been reproduced.
profile(["Patterns in Mathematics","Sequences and Patterns"], [10010,10011,10012], [10010,10039,334], [10012,10036,10037], "Number and shape patterns, rule machines and pattern investigations");
profile(["Prime Time","Factors Multiples and Patterns","Factors Multiples and Prime Numbers","Playing with Numbers","Finding Common Ground"], [65,66,67], [68,69,70,10013], [10014,10015,30079], "Factors, primes, divisibility, prime factorisation and common factors/multiples");
profile(["Number Play"], [58,64,71], [10013,10014,10015], [10037,30080,30081], "Number properties, divisibility and number puzzles");
profile(["Knowing Our Numbers","Large Numbers Around Us","Whole Numbers"], [57,58,64,10001], [10002,10003,10005], [10020,10039,30027], "Place value, number names, estimation and applied whole-number arithmetic");
profile(["Whole Numbers and Integers","Integers","Operations with Integers","The Other Side of Zero"], [58,59], [59,1,14], [59,10020], "Signed numbers, their order, arithmetic operations and numerical applications");
profile(["Arithmetic Expressions"], [1,28,94], [1,94,95], [10012,30091], "Order of operations, substitution and evaluation of arithmetic expressions");
profile(["A Peek Beyond the Point","Another Peek Beyond the Point"], [79,81], [80,81,82], [80,10018,10020], "Decimal place value, decimal operations and practical money/unit calculations");
profile(["Fractions","Working with Fractions"], [75,76,77], [78,3], [78,10021], "Fraction representations, comparisons, operations and sharing/scaling problems");
profile(["Fractions and Decimals","Fractions, Decimals and Rational Numbers","Fractions Decimals Percentages","Fractions Decimals and Percentages"], [75,79,81,88], [78,80,81], [10018,10019,10021], "Fraction/decimal/percentage conversion, arithmetic and real-world quantity problems");
profile(["Number Systems","Rational Numbers","Integers and Rational Numbers","Real Numbers","Real Numbers and Surds","Rational Irrational Numbers and Surds"], [59,60,61,62,10042], [10040,10041,10043,10044], [10045,30214,10004], "Rational/irrational classification, decimal representation, surds and numerical reasoning");
profile(["Number Systems and Operations"], [57,58,59,60,62], [78,80,99], [10018,10020,10021], "Number classifications, numerical operations and everyday arithmetic");
profile(["Number"], [59,60,75,79,88], [78,80,99,10003], [83,84,10018,10019], "Integer, fraction, decimal and percentage arithmetic, estimation and ratio applications");
profile(["Number and Financial Mathematics"], [60,88,89], [591,592,602,604], [10018,10019,10020,597], "Numerical and percentage operations, interest, discount, profit and budgeting");
profile(["A Square and A Cube","Square Roots and Cube Roots"], [30001,30008,10045], [30005,30006,30011], [30007,30009,30010,30012], "Square/cube representations, root algorithms, estimation and number-pattern applications");
profile(["A Story of Numbers"], [30032,30033,30037], [30034,30036,30039], [30038,30404,30405,30406,30407], "Numeral systems, positional notation, bases and historical representations");
profile(["Power Play","Exponents and Powers","Indices and Standard Form","Integers Powers and Roots"], [99,6,30018,30021], [30019,30020,30022,30024], [30025,30026,30355,30356], "Exponent rules, roots, scientific notation and comparisons of large/small quantities");
profile(["Ratio and Proportion","Ratios and Proportions","Ratio Rates and Proportion","Ratio Rate and Percentage","Ratio and Percentage Change","Comparing Quantities using Proportion","Proportional Reasoning","Proportional Reasoning1","Direct and Inverse Proportions"], [83,84,85,86,88], [10016,10017,89,30363], [10021,10018,30361,30362], "Ratio tables, unit rates, direct/inverse proportion and percentage applications");

profile(["Expressions using Letter-Numbers","Algebraic Expressions","Introduction to Algebra"], [92,93,94], [94,95,96], [10012,30096,30097], "Variables, terms, substitution, expanding expressions and algebraic descriptions of patterns");
profile(["We Distribute, Yet Things Multiply","Algebraic Identities and Factorisation","Algebraic Manipulation"], [95,96,106,30088], [30090,30092,30093,30094,97], [30091,30095,30097,30370], "Distributivity, algebraic identities, expansion, factorisation and mental calculation");
profile(["Factorisation","Polynomials and Factorisation","Polynomials and Algebraic Models"], [97,102,104,105], [10047,10048,10049,10052], [10046,10050,30369,30371,30374], "Polynomial operations, roots, factor/remainder theorems and factorisation problems");
profile(["Algebra and Graphs","Algebra"], [93,95,102,129], [97,111,114,122,133,134], [335,336,607,608,609], "Algebraic manipulation, equations, sequences, inequalities and graph models");
profile(["Expressions and Equations","Expressions Equations and Inequalities","Equations and Formulae","Equations and Relationships","Algebraic Expressions and Equations","Finding the Unknown","Simple Equations","Linear Relationships"], [93,94,107,111], [108,109,110,111,122], [10012,111,607], "Building and solving expressions/equations, rearranging formulae and interpreting linear relationships");
profile(["Linear Functions and Graphs"], [129,130,133,172], [173,174,175], [607,30382,30383], "Linear functions, gradients/intercepts, graphing and contextual rate relationships");
profile(["Quadratic Relationships","Quadratic Equations","Quadratics"], [114,134,10046], [114,30237,30238,30239,30240], [30241,30242,608], "Quadratic representations, factorisation/formula methods, discriminants and modelling");
profile(["Linear Inequalities"], [122,123], [122,126,127], [10200,10201,10202], "One/two-variable inequalities, feasible regions and constraint applications");
profile(["Linear Equations in Two Variables","Systems of Linear Equations","Simultaneous Equations"], [111,112,173], [112,113,357,10198], [30227,10199,607], "Linear-equation representations, simultaneous solutions, consistency and contextual modelling");
profile(["Sequences and Functions","Sequences and Linear Functions","Functions Sequences and Graphs"], [129,130,133,334,335], [335,336,340,341,150], [10012,346,30382,30383], "Sequences as rules/functions, term formulas, graphs and modelling patterns");
profile(["Linear Quadratic and Exponential Functions","Functions and Modelling","Functions"], [129,130,133,134,142], [150,151,156,157,158,162], [607,608,609,612,615], "Function types, transformations, composition/inverses and linear/quadratic/exponential models");
profile(["Arithmetic Progressions","Progressions"], [335,30247], [30248,340], [30249,30250], "Arithmetic progression terms, missing-term reasoning, sums and applications");
profile(["Sequences and Series","Series"], [334,335,336,339], [340,341,342,345], [346,592,596], "Arithmetic/geometric sequences, summation and financial/recursive applications");
profile(["Permutations and Combinations"], [556,557,558,561], [558,559,560,561], [563,564,10140], "Counting principles, arrangements, selections and combinatorial problem solving");
profile(["Binomial Theorem"], [562,10134], [10135,10136,10137], [10138,10139,10140], "Binomial expansions, coefficient/term calculations and approximations");

profile(["Lines and Angles","Measures of Lines and Angles","Parallel and Intersecting Lines","Angles and Geometrical Reasoning","Shapes Angles and Constructions","Angles and Constructions"], [203,204,206,232,257], [10058,10059,10060,10061,10062], [10023,10025,10026,10027,10063], "Lines/angles, linear pairs, parallel-line angle theorems and ruler/compass constructions");
profile(["Basic Geometrical Ideas"], [203,204,206,214,218], [232,257,235], [10022,10023,10026,10027], "Points, lines, rays, basic shapes, measurements and constructions");
profile(["Introduction to Euclid's Geometry","The Elements of Geometry"], [10053,10054,10056], [10055,10057,253], [10054,10057,203,218], "Definitions, axioms/postulates, logical consequences and basic Euclidean constructions");
profile(["Playing with Constructions","Practical Geometry","Geometrical Constructions"], [203,218,221,235], [10022,10023,10024,10025,10026,10027], [10028,10029,10030,10031], "Segment/angle/bisector constructions and triangles defined by side/angle constraints");
profile(["Construction of Triangles"], [214,10028], [10028,10029,10030,10031], [10028,10029,10030,10031,235], "SSS, SAS, ASA and RHS triangle construction methods and validity constraints");
profile(["Constructions and Tilings"], [215,246,10011], [235,10023,10025,215], [215,246,10011], "Polygon and symmetry constructions, repeated shape patterns and tiling investigations");
profile(["Geometric Twins","Congruency of Triangles"], [30170,10066,10069], [10066,10067,10068,10069,10070], [30172,10028,10029,10030], "Congruent figures, correspondence, congruence criteria and construction/CPCT applications");
profile(["A Tale of Three Intersecting Lines","Triangles","Triangles and Polygons"], [214,10064,10065], [10066,10069,10071,10072], [10028,10029,10030,10031,10064,10065], "Triangle/polygon angle properties, congruence, inequalities, proof and construction problems");
profile(["Pythagorean Theorem","Pythagoras and Geometric Reasoning"], [169,10031], [169,10031], [169,10031,259], "Right-triangle squared-length relation, missing-side calculations and distance applications; these links do not supply a standalone proof course");
profile(["Similarity and Congruence","Similar Triangles","Measurement and Similarity"], [241,30256], [30257,30258,30259,30260,30261], [30262,241,91,10021], "Scale factors, proportional sides, similarity criteria and indirect measurement");
profile(["Quadrilaterals"], [30051,30052,30056,30057], [30053,30054,30058,30059,30062,30063], [30055,30061,30064], "Quadrilateral classification, angle/diagonal properties, proofs and constructions");
profile(["Construction of Quadrilaterals"], [30051,30052,30056], [30055,30061], [30055,30061,30064], "Quadrilateral vocabulary, sufficient geometric conditions and construction investigations");
profile(["2D Shapes and Symmetry","Symmetry","Exploring Geometrical Figures"], [214,215,217,246], [237,240,246], [10011,215,246], "Polygon classification, reflection/rotation symmetry and shape-pattern investigations");
profile(["Geometrical Reasoning","Geometric Proof and Measurement","Geometrical Reasoning","Geometric Shapes and Measurement"], [203,214,230,231,10056], [10057,10064,10066,252,253], [10028,10031,10065,10079], "Shape properties, measurements, geometric proofs and applied constructions");
profile(["Geometry"], [203,214,215,218,257], [10064,10066,30259,10089,10091,10094], [10024,10025,10028,247,248,253], "Angles/polygons, congruence/similarity, circle theorems, loci and proof");
profile(["Coordinates and Transformations","Geometric Transformations","Transformations and Symmetry"], [167,179,236,237,240], [236,237,238,240,241,243], [244,245,246,179], "Coordinate representation, translation/reflection/rotation/enlargement and invariants");
profile(["Coordinates and Graphs","Graphs and Coordinates","Coordinate Geometry","Co-ordinate Geometry"], [167,168], [169,170,171,172,173], [10085,10086,10087,10088,30382], "Cartesian coordinates, distance/section formulas, triangle area and graph applications");
profile(["Coordinate and Vector Geometry","Transformations and Vectors"], [167,183,184,185], [186,187,188,189,190,191,236,237,240,241], [194,195,197,244], "Coordinate/vector representations and operations, geometric transformations and vector applications");
profile(["Straight Lines"], [172,173], [174,175,176,177], [173,177,607], "Gradient, line equations, angles/distances and straight-line modelling");
profile(["Conic Sections"], [10141,10142,10143,10144,10145], [10146,10147,10148,10149,10150], [10151,227,228,229], "Conic definitions and forms, parameterisation, tangent/normal calculations and identification");
profile(["Introduction to Three Dimensional Geometry","Three Dimensional Geometry"], [378,379,380,10152,10153], [10154,10155,10156,10159,10160], [10157,10158,10162,10163,10164], "3D coordinates, direction ratios/cosines, lines/planes, angles and shortest distances");
profile(["Vector Algebra","Vectors"], [183,184,185,189], [186,187,188,190,191,192,193], [194,195,196,197], "Vector representations, arithmetic, scalar/vector products and geometric/force applications");
profile(["Understanding 3D and 2D Shapes","Visualising 3D in 2D"], [214,215,391,392,393,404], [404,405,408,411], [404,405,411], "Plane/solid shape recognition, nets, cross-sections, Euler's relation and orthographic views");

profile(["Perimeter and Area","Area and Perimeter","Area of Plane Figures","Areas"], [230,231,10005], [231,272,30340,30341], [30340,30341,30301], "Length/area units, triangle/polygon area formulas and composite-region applications");
profile(["Perimeter Area and Volume","Area Surface Area and Volume","Areas and Volumes","Surface Area and Volume","Surface Areas and Volumes","Mensuration"], [230,231,391,392,397,398,399,406,407], [30340,30341,30343,30344,30345,30346,30347], [10082,10111,30304,30305,30306,30348], "Plane area, solid surface area/volume, unit conversions and composite-solid calculations");
profile(["Heron's Formula"], [10079,10080], [10079,10081], [10081,30191], "Semiperimeter, Heron's derivation/calculation and triangle-area comparisons");
profile(["Areas Related to Circles","Circular Measure"], [225,258,30297], [30297,30298,30299], [30300,30301], "Radian measure, arc/sector/segment calculations and combined circular regions");
profile(["Tangents and Secants to a Circle"], [212,30290,30291], [10096,10097], [30292,10097], "Tangents, point-of-contact/radius geometry, equal tangent lengths and applications");

profile(["Introduction to Trigonometry","Trigonometric Functions","Trigonometry","Right Triangle Trigonometry","Trigonometry and Bearings"], [258,259,260,144], [266,267,268,10124,10125,10126], [270,271,272,273,274], "Trigonometric ratios/functions, exact values, identities/graphs and triangle/bearing applications");
profile(["Applications of Trigonometry","Some Applications of Trigonometry"], [259,10098,10099], [274,10100,10101], [10100,10101,30285,30286], "Elevation/depression, shadow and surveying problems with right triangles");
profile(["Inverse Trigonometric Functions"], [265,151,10127], [265,10124,10127], [265,120,269], "Principal ranges, inverse-trigonometric representations and solving angle problems");
profile(["Geometry and Trigonometry"], [10064,10089,258,183], [10066,10091,10094,266,270,271,190], [10087,10100,10101,197,272,273], "Triangle/circle geometry, trigonometric functions, vectors and geometric modelling");

profile(["Data Handling","Data Handling and Presentation","Data Collection and Displays","Data Collection and Analysis","Frequency Distribution Tables and Graphs"], [10006,10007,10008,468], [10032,483,484,485,486], [10009,10033,487,489], "Collecting/tabulating data, statistical displays and interpreting comparisons");
profile(["Statistics","Statistics and Data","Statistics and Data Literacy","Data Distributions","Statistics and Correlation"], [467,468,470,471,472], [469,476,480,483,485,489,490], [10009,479,489,490,497], "Data distributions, location/spread summaries, statistical diagrams and correlation interpretation");
profile(["Statistics and Sampling"], [467,468,537], [537,538,539,540], [539,540,541,542], "Samples/sampling distributions, standard errors and estimation with confidence intervals");
profile(["Representation of Data"], [467,468,469], [480,481,482,483,485,486], [10009,475,479,487], "Data/frequency representations, statistical diagrams and interpretation of distributions");
profile(["Probability","Introductory Probability","Probability and Chance","Probability and Simulations"], [500,501,502], [503,504,505,509,514], [514,515,30325,30326], "Sample spaces, events, probability rules and experimental/theoretical comparison");
profile(["Compound Probability","Compound Events and Probability","Conditional Probability"], [501,506,507,508], [504,505,509,10210,10211,10212], [10213,10214,512], "Combined/conditional events, independence, tree diagrams, total probability and Bayes calculations");
profile(["Probability and Inference"], [500,501,508,537], [504,505,508,539,543,544], [10214,539,543,544,553], "Probability rules, sampling, confidence intervals and hypothesis-testing interpretation");
profile(["Discrete Random Variables"], [10215,10216], [10217,10218,521,522], [10217,10218,10219,10220], "Discrete random variables, probability distributions, expectation, variance and binomial trials");
profile(["Normal Distribution"], [528,535], [518,519,520,528], [519,520,537,538], "Normal density, standardisation, interval/tail probabilities and inverse/normal-approximation calculations");
profile(["Poisson Distribution"], [524], [524,518,519], [524,519,536], "Poisson counts, parameters, cumulative probabilities and simulation");
profile(["Continuous Random Variables"], [527,528,532], [308,518,519,520], [527,528,532,519], "Continuous densities/distributions, integration of probabilities and interval/quantile problems");
profile(["Sampling and Estimation"], [537,538], [539,540,541,542], [539,540,541,542], "Sampling distributions, central limit theorem and estimation of means/proportions");
profile(["Hypothesis Tests"], [543,544,553,554], [543,544,545,546,547,548], [549,550,553,554,555], "Null/alternative hypotheses, testing procedures, p-values and decision/error interpretation");

profile(["Number and Algebra"], [99,8,335,336,562], [340,341,10134,10135,10136,590], [10138,592,596,597], "Exponents/logarithms, sequences, binomial expansions, algebraic proof and financial applications");
profile(["Relations and Functions"], [585,10112,129,130], [10113,10114,10115,10116,10117,10120,10121], [10121,10122,151], "Cartesian products, relation/function types, composition and invertibility");
profile(["Logarithmic and Exponential Functions"], [142,143,8], [118,119,156,157,158], [609,592,327], "Exponential/logarithmic representations, inverse relationships, transformations and growth models");
profile(["Limits and Derivatives"], [277,278,284,285,286], [10165,286,291,292,293], [10174,10175,303], "Limits, derivative definitions/rules and rates/tangents/motion applications");
profile(["Differentiation"], [285,286], [290,291,292,293,294,295], [296,298,301,302,303], "Derivative definitions/rules, implicit/parametric/higher derivatives and applications");
profile(["Application of Derivatives"], [10174,10175], [10176,10177,10178,10179], [301,302,303,10178], "Rates, tangents/normals, monotonicity/extrema, approximations and optimisation");
profile(["Application of Integrals"], [306,307,308,10184], [311,10184,10185], [10184,10185,317,318], "Area under/between curves and integral-based geometric applications");
profile(["Calculus"], [277,284,285,286,309], [291,292,293,308,312,313], [296,298,301,311,303], "Limits, differentiation/integration methods and area/rate/optimisation applications");
profile(["Algebra"], [95,97,98,102], [104,105,106,314], [10047,10052,314,115], "Polynomial/algebraic operations, factor/remainder theorems and partial fractions");
profile(["Determinants"], [353,10193], [10193,10194,10195], [10196,10197,10198,10199], "Determinant properties, cofactor/adjoint calculations, triangle area and linear systems");
profile(["Mathematical Inquiry"], [252,30398], [30399,30400,30401], [30402,30403,30395], "Conjectures, proof/counterexample reasoning, modelling assumptions and validation");
profile(["Connecting the Dots..."], [565,568,569], [570,571,573], [10038,571,575], "Vertices/edges, paths, connectivity and route/network investigations");
profile(["Forces and Equilibrium"], [197,184], [197,186,190], [197], "Force resolution, resultants/equilibrants and balanced-force problems");
profile(["Kinematics"], [284,285,196], [303,284,285], [196,303], "Displacement/velocity/acceleration, position-time graphs and relative motion");

const foundationHeadings = new Set(["Foundational concepts and terminology","Representations and properties","Definitions and representations","Definitions and classification","Concepts and units","Representing and comparing values","Integers fractions decimals percentages"]);
const methodHeadings = new Set(["Methods, properties and worked examples","Arithmetic and algebraic operations","Arithmetic operations","Key properties and theorems","Formulae and derivations","Operations and properties","Properties","Graphing and transformations","Graphs and transformations"]);
const applicationHeadings = new Set(["Applications","Applications and interpretations","Applications, reasoning and problem solving","Patterns and applications","Real-world problem solving","Composite figures and applications","Constructions and applications","Interpretation","Worked constructions and geometric problems","Geometrical applications","Modelling","Reasoning","Theorems and proof","Word problems"]);
const baseChapter = (chapter:string) => chapter.replace(/^(?:AA|AI|Pure Mathematics [13]|Probability and Statistics [12]|Mechanics):\s*/, "");

export function reviewWorkbookAlignment(row:Row): AlignmentReview | undefined {
  const base = baseChapter(row.chapter);
  const key = normalizeChapter(base);
  const reviewed = (ids:number[], reason:string, profileKey=base):AlignmentReview => ({lessonIds:ids,relatedLessonIds:[],reason,profile:profileKey});
  if (key === "complexnumbersandquadraticequations") return {...reviewed([63,365,366,114,30240,30241],"Complex-number representation, quadratic solutions/root cases and quadratic modelling cover this chapter. General linear-equation lessons alone do not cover its quadratic/complex scope."),replaceExisting:true};
  // Correct the placement issue without pretending an integer/integral lesson
  // teaches ratios. The original workbook chapter/title remain unchanged.
  if (["operationswithintegers","integration","numbersystemsandoperations"].includes(key)) {
    const ratios: Record<string,number[]> = {"Meaning and equivalent ratios":[83,84],"Solving proportion problems":[84,85,86],"Real-life rates and applications":[87,10016,10021]};
    if (ratios[row.title]) return {...reviewed(ratios[row.title],"Mapped the topic as written to ratio/proportion lessons; its placement in the workbook is inconsistent with the chapter."),sourceIssue:`The workbook lists this ratio/proportion topic under ${row.chapter}. Its lesson links follow the topic name; the original source placement is retained for review.`};
  }
  if (base === "Momentum" || base === "Newton's Laws") return {lessonIds:[],relatedLessonIds:base === "Momentum" ? [183,186,196] : [197,303],profile:base,
    reason:base === "Momentum" ? "Vector arithmetic and relative motion are prerequisites. No published or authored draft lesson covers physical momentum p = mv, impulse or collision/momentum conservation." : "Force-vector equilibrium and motion graphs are available. They do not teach the three Newton laws, F = ma, mass/acceleration modelling or action-reaction pairs."};
  if (base === "Energy Work and Power") return {lessonIds:[190],relatedLessonIds:[308],profile:base,
    reason:"Dot Product explicitly covers work W = F · d. Kinetic/potential energy, conservation of mechanical energy and power/work-rate problems are not covered by that lesson.",
    missing:[{title:"Energy conservation and power",rationale:"Work via a dot product is available; kinetic/potential energy, work-energy conservation and power P = W/t still need lessons."}]};
  if (base === "Linear Combinations of Random Variables") return {lessonIds:[],relatedLessonIds:[10215,10217,10218],profile:base,
    reason:"Random variables, expectation and single-variable variance are available, but no lesson teaches E(aX+bY), Var(aX+bY), covariance or independence assumptions. Geometric vector combinations are a different concept."};
  if (row.title === "Area of triangle" && /coordinate/i.test(base)) return reviewed([10087,10088],"Coordinate-triangle area and its collinearity application are taught by the dedicated coordinate-area lessons.");
  if (row.title === "Arithmetic mean" && /progression/i.test(base)) return reviewed([335,30248],"Arithmetic progression spacing and finding missing terms provide the arithmetic-mean insertion construction (a+b)/2; this is not the grouped-data mean lesson.");
  if (row.title === "Cartesian products and relations") return reviewed([585,10112,10113,10114,10115],"Cartesian Product supplies ordered-pair construction and Types of Relations supplies the relation properties; the category-label mismatch does not remove these matches.");
  if (row.title === "Estimation and rounding") return reviewed([10003,10004],"Dedicated estimation/rounding and error-bound lessons cover numerical precision in the number chapter.");
  if (row.title === "Modelling word problems" && /linear equations in two variables/i.test(base)) return reviewed([30227,111,112],"The authored modelling-two-equations lesson constructs equations from situations, with published linear/simultaneous equation solvers for solution and checking.");
  if (row.title === "Pythagoras theorem") return reviewed([10031,169],"The RHS construction calculates the missing leg using sqrt(hypotenuse² − leg²); Distance Between Points applies the squared-length relation. These links cover the theorem's statement/calculation and geometric applications, rather than a standalone proof course.");
  if (row.title === "Angle relationships and properties") return reviewed(/similar/i.test(base) ? [10064,30259,30261] : /triangle|congruen/i.test(base) ? [10064,10065,10071] : [10058,10059,10060,10061,10062,10063],"Dedicated angle theorems cover the chapter's linear/parallel-line or triangle angle relationships.");
  if (row.title === "Triangles and circle geometry") return reviewed([10064,10066,10089,10091,10094,10095],"Dedicated triangle congruence/angle and circle chord/arc/cyclic-quadrilateral lessons cover the named geometric skills.");
  if (row.title === "Circle theorems") return reviewed(r(10089,10097),"Dedicated chord, arc, semicircle, cyclic-quadrilateral and tangent lessons provide the circle-theorem sequence.");
  if (row.title === "Congruence and similarity") return reviewed([...r(10066,10070),30259,30260,30261],"Published congruence lessons and authored AA/SSS/SAS similarity lessons cover both parts of this topic.");
  if (row.title === "Angles, lines and polygons") return reviewed([203,214,215,257,10064,10065],"Line/polygon construction and measurement lessons combine with triangle angle-sum/exterior-angle theorems.");
  if (row.title === "Constructions and loci") return reviewed([10024,10025,10028,10029,247,248],"Bisector/triangle constructions and dedicated loci/equidistant-loci lessons cover the named construction and locus methods.");
  if (row.title === "Sequences") return reviewed([334,335,336,340,341],"Dedicated term generators, arithmetic/geometric sequence and series lessons cover the algebra-and-graphs sequence strand.");
  if (row.title === "Ratio and proportion") return reviewed([83,84,85,86,87],"Dedicated ratio, proportion, direct/inverse proportion and unit-rate lessons cover the numerical strand.");
  if (row.title === "2D perimeter and area") return reviewed([230,231,272,30340,30341],"Length/area measurement and authored polygon decomposition/trapezium-area lessons cover perimeter and plane-area calculations.");
  if (key === "determinants" && row.title === "Properties") return reviewed([353,355,10193],"The determinant calculation, row-operation and cofactor lessons cover determinant properties and their use in evaluation.");
  if (["Graphing and transformations","Graphs and transformations"].includes(row.title)) {
    if (/coordinate|graphs and coordinates/i.test(base)) return reviewed([168,179,236,237,240,241],"Point plotting and explicit coordinate translation/reflection/rotation/enlargement lessons cover the graph transformations in this heading.");
    if (/trigonometric functions/i.test(base)) return reviewed([261,262,263,10125],"Sine/cosine/tangent graphs and the dedicated trigonometric graph-transformation lesson cover this heading.");
    if (/linear functions|sequences and functions|sequences and linear functions|functions sequences/i.test(base)) return reviewed([133,156,157,158,159,334,335],"Linear/sequence representations combine with translation/stretch lessons to cover graphing and transformations.");
  }
  const entry = profiles.get(key);
  if (!entry) return undefined;
  const introTrig = ["introductiontotrigonometry","righttriangletrigonometry"].includes(key) || (key === "trigonometry" && row.grade <= 10);
  const foundations = introTrig ? [258,259,260] : entry.foundations;
  const methods = introTrig ? [260,266,30277,30279] : entry.methods;
  const applications = introTrig ? [259,273,274,10098,10099,10100] : entry.applications;
  const ids = foundationHeadings.has(row.title) ? foundations : methodHeadings.has(row.title) ? methods : applicationHeadings.has(row.title) ? applications : undefined;
  if (!ids) return undefined;
  return reviewed(ids,`${entry.scope}. This editorial teaching heading is aligned to the listed lesson skills within its chapter; it does not assert identical textbook exercises or complete chapter reproduction.`,entry.key);
}
