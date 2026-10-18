import workbook from "./curriculumWorkbookIndex.json";
import { unifiedLessons, type UnifiedLesson } from "../modules/lessons/catalog/unified/unifiedLessons";
import { availableDrafts } from "./curriculumAvailableDrafts";
import { sharedChapterLessons, normalizeChapter } from "./curriculumSharedLessons";
import { currentTextbookTopics } from "./curriculumTextbookChapters";
import draftChapters from "./curriculumDraftChapters.json";
import { reviewWorkbookAlignment } from "./curriculumWorkbookAlignmentReview";

// Reviewed concept identities. Matching a generic heading alone never establishes lesson coverage.
const topicIds: Record<string, number[]> = {
  "Equivalent fractions": [76], "Comparing fractions": [77], "Addition and subtraction": [78],
  "Multiplication and division": [78], "Word problems": [78],
  "Types of angles and angle measurement": [232,257], "Angle relationships and properties": [174,175,176],
  "Collecting and organising data": [450,455,467,468], "Tables and statistical diagrams": [468,483,486],
  "Interpreting patterns and conclusions": [461,487,489],
  "Meaning and equivalent ratios": [83,84], "Solving proportion problems": [84,85,86], "Real-life rates and applications": [87],
  "Sample spaces and events": [500,501], "Experimental probability": [514,515], "Theoretical probability": [502,504,505],
  "Complementary events": [503], "Combined events": [504,505,506], "Probability laws": [503,504,505,508],
  "Data tables and visualisations": [468,483,486], "Mean median mode": [470,471,472],
  "Grouped data": [469,10108,10109,30312,30313,30314], "Cumulative frequency": [485],
  "Forming equations": [107,108,111], "Algebraic and graphical solution methods": [111,112,41],
  "Applications and checking solutions": [94,111,112], "Algebraic manipulation": [93,94,95,97,98],
  "Linear and quadratic equations": [111,114], "Functions and graphs": [129,130,133,134], "Inequalities": [122,123,124],
  "Cartesian plane and quadrants": [167], "Plotting points": [168], "Distance formula": [169], "Section formula": [171], "Area of triangle": [272,10081],
  "Number line representation": [59,60,61,62], "Natural, whole, integer, rational and irrational numbers": [57,58,59,60,61],
  "HCF and LCM": [69,70], "Euclid's division lemma": [2003], "Fundamental theorem of arithmetic": [68], "Irrationality proofs": [30214],
  "Decimal expansions": [81,82], "Powers and roots": [6,99,100], "Estimation and rounding": [15],
  "Terms, coefficients and degree": [93,102], "Evaluating polynomials": [94,102], "Zeros and graphical meaning": [105,115],
  "Remainder and factor theorems": [104,105], "Factorisation": [97,105],
  "Equation and solution pairs": [111,112], "Graphing straight lines": [173], "Intercepts": [173],
  "Modelling word problems": [607,608], "Graphical solution": [41,112], "Substitution method": [112], "Elimination method": [112],
  "Cross multiplication": [112], "Consistency and applications": [10199],
  "Standard quadratic form": [114], "Completing the square": [114], "Quadratic formula": [114], "Discriminant and roots": [114],
  "Common difference and nth term": [335], "Sum of n terms": [340], "Arithmetic mean": [470],
  "Classification and angle properties": [214], "Congruence and criteria": [10066,10067,10068,10069,10070],
  "Similarity and criteria": [30259,30260,30261],
  "Sine cosine tangent": [259], "Right triangle problems": [259,274], "Trigonometric identities": [266,267,268], "Sine and cosine rules": [270,271],
  "Circle terminology": [218,219], "Chords and arcs": [223,30298], "Angles subtended by arcs": [10091],
  "Cyclic quadrilaterals": [10094,10095], "Tangents and properties": [212,30290,30291,30292],
  "2D perimeter and area": [230,231], "Circle area and arc length": [225,30297], "3D surface area": [407], "Volume": [406],
  "Composite shapes": [30300,30304,30305,30306],
  "Set notation and roster form": [582], "Subsets and power sets": [586], "Union and intersection": [583], "Venn diagrams": [510], "Complement": [584],
  "Cartesian products and relations": [585], "Domain and range": [130], "Types of functions": [129,133,134,137,142],
  "Composition of functions": [150], "Inverse functions": [151], "Composite and inverse functions": [150,151],
  "Angle and radian measure": [258], "Trigonometric ratios": [259], "Unit circle": [258], "Identities": [106,266],
  "Linear and quadratic functions": [133,134], "Transformations": [156,157,158,159,160,161,162],
  "Exponents and logarithms": [99,8,143], "Sequences and series": [335,336,340,341], "Binomial theorem": [562,345],
  "Algebraic proof and manipulation": [106,590], "Financial applications": [591,592,596,597],
  "Trigonometric functions": [144,261,262,263], "Vectors": [183,184,190,191], "Coordinate geometry": [167,169,171,173],
  "Descriptive statistics": [461,470,471,472,476], "Discrete distributions": [521,522,524,525], "Continuous distributions": [527,528,532],
  "Statistical inference": [539,543,544,553], "Limits and rate of change": [277,284,285], "Differentiation": [286,291,292,293],
  "Applications of derivatives": [296,297,298,301,302], "Integration": [308,309,312,313], "Areas and modelling": [306,307,311],
  "Types and order of matrices": [347], "Addition and multiplication": [348,350], "Transpose": [352], "Inverse of matrices": [354],
  "Systems of equations": [357,10197], "Minors and cofactors": [10193], "Determinants up to order three": [353], "Adjoint and inverse": [10194,10195],
  "Area and linear systems": [10196,10197], "Limits": [277,278,279,280], "Continuity": [281,282], "Differentiability": [286],
  "Chain rule": [293], "Implicit differentiation": [294], "Higher derivatives": [290],
  "Antiderivatives": [309], "Standard integrals": [309], "Substitution": [312], "Integration by parts": [313], "Partial fractions": [314], "Definite integrals": [308],
  "Order and degree": [10187], "General and particular solutions": [443,323], "Formation": [10186], "Separation of variables": [325], "Linear differential equations": [326],
  "Scalar and vector quantities": [183], "Components and magnitude": [184,189], "Dot product": [190], "Cross product": [191],
  "Objective functions and constraints": [617,10200], "Graphing feasible region": [10201], "Corner-point method": [10202], "Optimisation applications": [10207,10208,10209],
  "Reflection and rotation": [237,240], "Translation and enlargement": [236,241], "Symmetry": [246], "Vector operations": [186,187,188],
};

const chapterAliases: Record<string, string[]> = {
  "Patterns in Mathematics": ["Patterns"], "Prime Time": ["Factors, Multiples and Prime Numbers"],
  "Number Play": ["Number Play and Whole Numbers"], "Knowing Our Numbers": ["Number Play and Whole Numbers"],
  "Large Numbers Around Us": ["Number Play and Whole Numbers"], "Arithmetic Expressions": ["Number Play and Whole Numbers"],
  "A Peek Beyond the Point": ["Decimals"], "Another Peek Beyond the Point": ["Decimals"], "The Other Side of Zero": ["Integers"],
  "Operations with Integers": ["Integers"], "Expressions using Letter-Numbers": ["Algebraic Expressions"],
  "A Tale of Three Intersecting Lines": ["Triangles"], "Working with Fractions": ["Fractions"], "Geometric Twins": ["Congruence of Triangles"],
  "Finding Common Ground": ["Factors, Multiples and Prime Numbers"], "Finding the Unknown": ["Simple Equations"],
  "A Square and A Cube": ["Squares and Square Roots", "Cubes and Cube Roots"], "Power Play": ["Exponents and Powers"],
  "We Distribute, Yet Things Multiply": ["Algebraic Expressions and Identities"], "Proportional Reasoning�1": ["Direct and Inverse Proportions"],
  "Application of Derivatives": ["Applications of Derivatives"], "Application of Integrals": ["Applications of Integrals"],
};
const chapterExtras: Record<string, number[]> = {
  "Patterns in Mathematics": [334,338,10010,10011,10012], "Prime Time": [65,66,67,68,69,70,71],
  "Playing with Constructions": [214,215,218,221,235], "Geometric Twins": [10066,10067,10068,10069,10070],
  "Constructions and Tilings": [214,215,235,246], "Connecting the Dots...": [565,569,571],
  "A Story of Numbers": [73,30034,30035,30036,30038,30040,30404,30405,30406,30407],
  "Basic Geometrical Ideas": [203,204,206,214,218], "Introduction to Algebra": [92,93,94,95,107],
  "Understanding 3D and 2D Shapes": [214,215,391,392,393,404,411], "Visualising 3D in 2D": [404,405,411],
  "Construction of Quadrilaterals": [30055,30061], "Construction of Triangles": [214,235],
  "Geometric Proof and Measurement": [230,231,252,253,590], "The Elements of Geometry": [203,204,232,252,253],
  "Exploring Geometrical Figures": [214,215,217,218,246], "Mathematical Inquiry": [252,590,606],
  "Number": [59,60,78,80,88,99,100], "Number Systems and Operations": [57,58,59,60,62,78,80],
  "Number and Financial Mathematics": [60,88,89,591,592,597,602],
  "Number and Algebra": [99,8,335,336,340,341,345,562,590,591,592],
  "Algebra and Graphs": [93,95,97,102,111,112,114,122,124,129,133,134,335],
  "Algebra": [95,97,98,102,104,105,106,314],
  "Transformations and Vectors": [183,184,186,187,188,189,236,237,240,241,246],
  "Pythagorean Theorem": [259,30279], "Pythagoras and Geometric Reasoning": [259,30279,252,253],
  "Functions": [129,130,133,134,142,150,151,156,157,162,606],
  "Geometry and Trigonometry": [214,218,258,259,266,270,271,183,190,191,167,169],
  "Statistics and Probability": [461,470,476,500,503,504,505,508,521,522,524,527,528,539,543],
  "Calculus": [277,284,285,286,291,292,293,296,298,301,308,309,311,312,313],
  "Quadratics": [114,134], "Circular Measure": [258,320,30297], "Series": [335,336,340,341],
  "Differentiation": [286,290,291,292,293,294], "Integration": [308,309,312,313,314],
  "Representation of Data": [468,469,480,483,485,486], "Discrete Random Variables": [513,521,522],
  "Normal Distribution": [528,535], "Logarithmic and Exponential Functions": [142,143],
  "Numerical Solution of Equations": [128,304,434], "Vectors": [183,184,186,187,189,190,191],
  "Poisson Distribution": [524], "Linear Combinations of Random Variables": [513,476],
  "Continuous Random Variables": [527,528,532], "Sampling and Estimation": [537,538,539,540], "Hypothesis Tests": [543,544,545,546,547,548,553],
  "Forces and Equilibrium": [197,330], "Kinematics": [196,284,285,303], "Momentum": [183,193],
  "Newton's Laws": [197,303], "Energy Work and Power": [190,308],
};

const categoryChapters: Array<[RegExp, number[]]> = [
  [/fractions.*decimals|fractions decimals/i, [75,76,77,78,79,80,81,88]],
  [/rational.*irrational|real numbers.*surds/i, [60,61,62,100,101,30214]],
  [/integers.*powers|indices.*standard/i, [59,99,100,7]],
  [/whole numbers.*integers/i, [58,59]], [/integers.*rational/i, [59,60]],
  [/factors.*multiples|factors.*patterns|playing with numbers/i, [65,66,67,68,69,70,71]],
  [/\bratios?\b|\bproportions?\b|\bproportional\b/i, [83,84,85,86,87,88,89]],
  [/^angles|^shapes angles|measures of lines|parallel and intersecting/i, [174,175,176,232,257,214,235]],
  [/symmetry|geometric transformations|coordinates and transformations/i, [179,236,237,240,241,246]],
  [/perimeter|area.*volume|areas and volumes|^areas$|area of plane/i, [230,231,225,406,407,30300,30304,30305,30306]],
  [/data|statistics|frequency/i, [450,461,467,468,469,470,471,472,476,480,483,485,486,487,489,490]],
  [/probability|chance/i, [500,501,502,503,504,505,506,508,514,515]],
  [/coordinate|coordinates|graphs and coordinates/i, [167,168,169,170,171,172,173,179]],
  [/linear.*functions|linear relationships/i, [111,133,173]],
  [/expressions|equations and|equations.*relationships|^equations.*formulae/i, [92,93,94,95,97,107,108,111,112]],
  [/polynomials.*models|polynomials.*factorisation|algebraic.*factorisation|algebraic manipulation/i, [95,97,102,104,105,106]],
  [/quadratic relationships/i, [114,134]], [/simultaneous|systems of linear/i, [112,113,357]],
  [/functions.*modelling|linear quadratic.*functions/i, [129,130,133,134,142,606,607,608,609]],
  [/sequences|progressions/i, [334,335,336,340,341]],
  [/triangles.*polygons|triangles$|similarity|congruenc/i, [214,241,10066,10067,10068,10069,10070,30257,30258,30259,30260,30261]],
  [/trigonometry|trigonometric/i, [258,259,260,261,262,263,266,270,271,273,274]],
  [/geometrical reasoning|^geometry$|geometric shapes|geometrical constructions|practical geometry/i, [203,214,215,217,218,230,231,235,247,252,253]],
];
const unique = (lessons: UnifiedLesson[]) => [...new Map(lessons.map((lesson) => [lesson.id,lesson])).values()];
const allowedIds = new Set(unifiedLessons.filter((lesson) => lesson.status === "Published").map((lesson) => lesson.id).concat(availableDrafts.map((lesson) => lesson.id)));
const lessonsForIds = (ids: number[]) => unifiedLessons.filter((lesson) => allowedIds.has(lesson.id) && ids.includes(lesson.id));
const chapterCache = new Map<string, UnifiedLesson[]>();
export function workbookChapterLessons(chapter: string, level: string) {
  const cacheKey = `${level}:${chapter}`;
  const cached = chapterCache.get(cacheKey);
  if (cached) return cached;
  const base = chapter.replace(/^(?:AA|AI|Pure Mathematics [13]|Probability and Statistics [12]|Mechanics):\s*/, "");
  const draftIds = draftChapters.filter((entry) => normalizeChapter(entry.chapter ?? "") === normalizeChapter(base)).map((entry) => entry.lessonId);
  const exact = currentTextbookTopics.filter((topic) => topic.title === chapter).flatMap((topic) => [...topic.lessons,...topic.draftLessons ?? []]);
  const shared = [base,...chapterAliases[base] ?? []].flatMap((title) => sharedChapterLessons(title,level));
  // Explicit chapter definitions take precedence over broad subject families.
  const extras = chapterExtras[base] ?? categoryChapters.find(([pattern]) => pattern.test(base))?.[1] ?? [];
  const lessons = unique([...shared,...exact,...lessonsForIds([...draftIds,...extras])]);
  chapterCache.set(cacheKey,lessons);
  return lessons;
}

export type WorkbookLessonMapping = { rowId:string; lessonIds:number[]; relatedLessonIds:number[]; state:"mapped" | "partial" | "chapter-resources" | "upcoming"; reason:string; reviewProfile?:string; sourceIssue?:string; missing?:{title:string; rationale:string}[] };
export const initialWorkbookLessonMappings: WorkbookLessonMapping[] = workbook.rows.map((row) => {
  const resources = workbookChapterLessons(row.chapter,row.level);
  const topicCandidates = lessonsForIds(topicIds[row.title] ?? []);
  const categories = new Set(resources.map((lesson) => lesson.categorySlug));
  const direct = topicCandidates.filter((lesson) => categories.has(lesson.categorySlug));
  const mismatch = topicCandidates.length > 0 && !direct.length;
  const exact = unique([...direct,...resources.filter((lesson) => normalizeChapter(lesson.title) === normalizeChapter(row.title))]);
  return {rowId:row.id, lessonIds: exact.map((lesson) => lesson.id),
    relatedLessonIds: exact.length ? [] : resources.slice(0,6).map((lesson) => lesson.id),
    state: exact.length ? "mapped" as const : resources.length ? "chapter-resources" as const : "upcoming" as const,
    reason: mismatch ? "The workbook topic does not align with this chapter's subject. Chapter resources are linked while this row awaits correction."
      : exact.length ? "Matched to existing lessons for the named mathematical skill. Textbook exercise alignment is not certified."
      : resources.length ? "This editorial heading is broader than an individual lesson. Relevant chapter resources are linked; exact topic coverage still needs checking."
      : "No suitable lesson has been identified for this textbook topic. It remains visible as Upcoming.",
  };
});

export const workbookLessonMappings: WorkbookLessonMapping[] = initialWorkbookLessonMappings.map((mapping,index) => {
  const review = reviewWorkbookAlignment(workbook.rows[index]);
  if (mapping.state === "mapped" && !review?.sourceIssue && !review?.replaceExisting) return mapping;
  if (!review) return mapping;
  return {rowId:mapping.rowId,lessonIds:review.lessonIds,relatedLessonIds:review.relatedLessonIds,
    state:review.missing?.length ? "partial" : review.lessonIds.length ? "mapped" : "upcoming",
    reason:review.reason,reviewProfile:review.profile,sourceIssue:review.sourceIssue,missing:review.missing};
});

export { workbook as curriculumWorkbook };
