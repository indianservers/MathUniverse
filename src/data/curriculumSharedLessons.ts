import { lessonById, unifiedLessons, type UnifiedLesson } from "../modules/lessons/catalog/unified/unifiedLessons";

export const normalizeChapter = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
// Explicit aliases share lesson identities, never duplicate lesson pages.
const chapterLessonIds: Record<string, number[]> = {
  "Patterns": [
    10010,
    10011,
    10012
  ],
  "Number Play and Whole Numbers": [
    57,
    58,
    64,
    10001,
    10003
  ],
  "Factors, Multiples and Prime Numbers": [
    65,
    66,
    67,
    68,
    69,
    70,
    71
  ],
  "Integers": [
    59
  ],
  "Fractions": [
    75,
    76,
    77,
    78
  ],
  "Decimals": [
    79,
    80,
    81
  ],
  "Fractions and Decimals": [
    75,
    78,
    79,
    80,
    81
  ],
  "Ratio, Proportion and Unitary Method": [
    83,
    84,
    85,
    87
  ],
  "Introduction to Algebra": [
    20,
    92,
    93,
    94
  ],
  "Lines, Angles and Basic Geometrical Ideas": [
    203,
    204,
    206,
    232
  ],
  "Perimeter and Area": [
    230,
    231,
    272
  ],
  "Data Handling": [
    10006,
    10007,
    10008,
    10032,
    10033
  ],
  "Practical Constructions": [
    10022,
    10023,
    10024,
    10025,
    10026,
    10027
  ],
  "Symmetry": [
    237,
    238,
    240,
    246
  ],
  "Visualising Solid Shapes": [
    391,
    392,
    393,
    394,
    404,
    411
  ],
  "Simple Equations": [
    107,
    108,
    111
  ],
  "Lines and Angles": [
    10058,
    10059,
    10060,
    10061,
    10062,
    10063
  ],
  "Triangle and its Properties": [
    10064,
    10065,
    10071,
    10072
  ],
  "Comparing Quantities": [
    88,
    89,
    591,
    592,
    602,
    604
  ],
  "Rational Numbers": [
    60,
    10040,
    10041
  ],
  "Algebraic Expressions": [
    92,
    93,
    94,
    95,
    96
  ],
  "Exponents and Powers": [
    99,
    7,
    6
  ],
  "Linear Equations in One Variable": [
    107,
    108,
    109,
    111
  ],
  "Understanding Quadrilaterals": [
    10073,
    10074,
    10075,
    10076,
    217
  ],
  "Squares and Square Roots": [
    6,
    374,
    10045
  ],
  "Cubes and Cube Roots": [
    6,
    374,
    10045
  ],
  "Algebraic Expressions and Identities": [
    92,
    93,
    95,
    96,
    106
  ],
  "Mensuration": [
    391,
    392,
    397,
    398,
    399,
    400,
    406,
    407,
    10111
  ],
  "Direct and Inverse Proportions": [
    85,
    86,
    87
  ],
  "Factorisation": [
    97,
    105,
    10052
  ],
  "Introduction to Graphs": [
    167,
    168,
    47,
    133
  ],
  "Number Systems": [
    57,
    58,
    59,
    60,
    61,
    62,
    10040,
    10041,
    10042,
    10043,
    10044
  ],
  "Polynomials": [
    102,
    10046,
    10047,
    10048,
    10049,
    10050,
    10051,
    10052
  ],
  "Coordinate Geometry": [
    167,
    168,
    10083,
    10084,
    10085,
    10087,
    10088
  ],
  "Linear Equations in Two Variables": [
    111,
    133,
    173
  ],
  "Introduction to Euclid's Geometry": [
    10053,
    10054,
    10055,
    10056,
    10057
  ],
  "Triangles": [
    10064,
    10065,
    10066,
    10067,
    10068,
    10069,
    10070,
    10071,
    10072
  ],
  "Quadrilaterals": [
    10073,
    10074,
    10075,
    10076,
    10077,
    10078
  ],
  "Circles": [
    10089,
    10090,
    10091,
    10092,
    10093,
    10094,
    10095,
    10096,
    10097
  ],
  "Heron's Formula": [
    10079,
    10080,
    10081
  ],
  "Surface Areas and Volumes": [
    391,
    392,
    397,
    398,
    399,
    400,
    406,
    407,
    10110,
    10111
  ],
  "Statistics": [
    469,
    470,
    471,
    472,
    483,
    484,
    10102,
    10103,
    10104,
    10105,
    10106,
    10109
  ],
  "Real Numbers": [
    62,
    68,
    69,
    70,
    61,
    101
  ],
  "Pair of Linear Equations in Two Variables": [
    112,
    435,
    436,
    10199
  ],
  "Quadratic Equations": [
    114,
    134,
    375
  ],
  "Arithmetic Progressions": [
    335,
    340
  ],
  "Introduction to Trigonometry": [
    259,
    260,
    264,
    266
  ],
  "Applications of Trigonometry": [
    10098,
    10099,
    10100,
    10101
  ],
  "Areas Related to Circles": [
    225,
    231
  ],
  "Probability": [
    500,
    501,
    502,
    503,
    504,
    505,
    506,
    508,
    10214
  ],
  "Sets": [
    582,
    583,
    584,
    585,
    586,
    510
  ],
  "Relations and Functions": [
    129,
    130,
    10112,
    10113,
    10114,
    10115,
    10116,
    10117,
    10118,
    10119,
    10120,
    10121,
    10122
  ],
  "Trigonometric Functions": [
    144,
    258,
    261,
    262,
    263,
    267,
    268,
    269
  ],
  "Complex Numbers and Quadratic Equations": [
    63,
    365,
    366,
    367,
    368,
    369,
    370,
    371,
    114
  ],
  "Linear Inequalities": [
    122,
    123,
    126,
    127
  ],
  "Permutations and Combinations": [
    556,
    557,
    558,
    559,
    560,
    561
  ],
  "Binomial Theorem": [
    10134,
    10135,
    10136,
    10137,
    10138,
    10139
  ],
  "Sequences and Series": [
    335,
    336,
    339,
    340,
    341
  ],
  "Straight Lines": [
    172,
    173,
    174,
    175,
    176,
    177
  ],
  "Conic Sections": [
    10141,
    10142,
    10143,
    10144,
    10145,
    10146
  ],
  "Introduction to Three Dimensional Geometry": [
    378,
    379,
    380
  ],
  "Limits and Derivatives": [
    277,
    278,
    279,
    280,
    284,
    285,
    286,
    291,
    292,
    293
  ],
  "Inverse Trigonometric Functions": [
    265
  ],
  "Matrices": [
    347,
    348,
    349,
    350,
    351,
    352,
    354,
    10197
  ],
  "Determinants": [
    353,
    10193,
    10194,
    10195,
    10196,
    10198
  ],
  "Continuity and Differentiability": [
    10165,
    10166,
    10167,
    10168,
    10169,
    10170,
    10171,
    10172,
    10173
  ],
  "Applications of Derivatives": [
    10174,
    10175,
    10176,
    10177,
    10178,
    10179
  ],
  "Integrals": [
    308,
    309,
    310,
    10180,
    10181,
    10182,
    10183
  ],
  "Applications of Integrals": [
    10184,
    10185
  ],
  "Differential Equations": [
    10186,
    10187,
    10188,
    10189,
    10190,
    10191,
    10192
  ],
  "Vector Algebra": [
    183,
    184,
    185,
    186,
    187,
    188,
    189,
    190,
    191
  ],
  "Three Dimensional Geometry": [
    10152,
    10153,
    10154,
    10155,
    10156,
    10157,
    10158,
    10159,
    10160,
    10161,
    10162,
    10163,
    10164
  ],
  "Linear Programming": [
    10200,
    10201,
    10202,
    10203,
    10204,
    10205,
    10206,
    10207,
    10208,
    10209
  ],
  "Congruency of Triangles": [
    10066,
    10067,
    10068,
    10069,
    10070
  ],
  "Construction of Triangles": [
    10028,
    10029,
    10030,
    10031
  ],
  "Construction of Quadrilaterals": [],
  "Similar Triangles": [
    241
  ],
  "Progressions": [
    335,
    336,
    340,
    341
  ],
  "A Square and a Cube": [
    6,
    68,
    374,
    10045
  ],
  "Power Play": [
    99,
    7,
    142
  ],
  "A Story of Numbers": [
    64,
    73,
    10002
  ],
  "Number Play": [
    65,
    66,
    67,
    71,
    72,
    10013,
    10014,
    10015
  ],
  "We Distribute, Yet Things Multiply": [
    92,
    95,
    96,
    106
  ],
  "Proportional Reasoning-1": [
    83,
    84,
    85,
    87,
    91
  ],
  "Large Numbers Around Us": [
    64,
    10001,
    10002,
    10003
  ],
  "Arithmetic Expressions": [
    1,
    94
  ],
  "Decimal Operations": [
    80
  ],
  "Fraction Operations": [
    78
  ],
  "Constructions and Tilings": [
    10022,
    10023,
    10024,
    10025
  ],
  "Lines and Triangles": [
    10058,
    10064,
    10065
  ],
  "Proportional Reasoning-2": [
    83,
    84,
    85,
    86,
    91
  ],
  "Proofs in Mathematics": [
    10057,
    590
  ],
  "Mathematical Modelling": [
    606,
    607,
    608
  ],
  "Surface Area and Volume (Cube-Cuboid)": [
    391,
    392,
    406,
    407
  ],
  "Area of Plane Figures": [
    231,
    272
  ],
  "Exploring Geometrical Figures": [
    246,
    217
  ],
  "Frequency Distribution Tables and Graphs": [
    468,
    469,
    483,
    484,
    486
  ],
  "Visualizing 3-D in 2-D": [
    404,
    411
  ],
  "Square Roots and Cube Roots": [
    6,
    374,
    10045
  ]
};
const chapterAliases: Record<string, string> = {
  "Knowing Our Numbers": "Large Numbers Around Us",
  "Whole Numbers": "Number Play and Whole Numbers",
  "Playing with Numbers": "Number Play",
  "Basic Geometrical Ideas": "Lines, Angles and Basic Geometrical Ideas",
  "Measures of Lines and Angles": "Lines and Angles",
  "Ratio and Proportion": "Ratio, Proportion and Unitary Method",
  "Practical Geometry": "Practical Constructions",
  "Geometrical Constructions": "Practical Constructions",
  "Understanding 3D and 2D Shapes": "Visualising Solid Shapes",
  "Fractions, Decimals and Rational Numbers": "Fractions and Decimals",
  "Ratio - Applications": "Comparing Quantities",
  "Powers and Exponents": "Exponents and Powers",
  "Area and Perimeter": "Perimeter and Area",
  "Comparing Quantities using Proportion": "Comparing Quantities",
  "Polynomials and Factorisation": "Polynomials",
  "The Elements of Geometry": "Introduction to Euclid's Geometry",
  "Co-Ordinate Geometry": "Coordinate Geometry",
  "Linear Equation in Two variables": "Linear Equations in Two Variables",
  "Areas": "Perimeter and Area",
  "Tangents and Secants to a Circle": "Circles",
  "Trigonometry": "Introduction to Trigonometry",
  "Some Applications of Trigonometry": "Applications of Trigonometry"
};
const canonicalNames = new Map(Object.keys(chapterLessonIds).map((title) => [normalizeChapter(title), title]));
for (const [alias, title] of Object.entries(chapterAliases)) canonicalNames.set(normalizeChapter(alias), title);
export function canonicalChapter(title: string) { return canonicalNames.get(normalizeChapter(title)) ?? title; }
export function publishedLessons(ids: readonly number[]): UnifiedLesson[] {
  return [...new Set(ids)].flatMap((id) => { const lesson = lessonById(id); return lesson?.status === "Published" ? [lesson] : []; });
}
export function sharedChapterLessons(title: string, level?: string) {
  const chapter = canonicalChapter(title);
  if (chapter === "Triangles" && level === "Class 10") return publishedLessons([241]);
  if (chapter === "Statistics" && level === "Class 11") return publishedLessons([470, 471, 472, 474, 476]);
  if (chapter === "Probability" && ["Class 6", "Class 7", "Class 8", "Class 9", "Class 10", "Class 11"].includes(level ?? "")) return publishedLessons([500, 501, 502, 503, 504, 509, 514]);
  return publishedLessons(chapterLessonIds[chapter] ?? []);
}
export function exactPublishedLesson(title: string, id?: number | null) {
  const explicit = id ? publishedLessons([id]) : [];
  return explicit.length ? explicit : unifiedLessons.filter((lesson) => lesson.status === "Published" && normalizeChapter(lesson.title) === normalizeChapter(title)).slice(0, 1);
}
