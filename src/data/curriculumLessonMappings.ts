import { lessonById } from "../modules/lessons/catalog/unified/unifiedLessons";

// Explicit topic mappings use published lessons only. Empty sequences are upcoming.
export const curriculumLessonIds: Record<string, number[]> = {
  "class-7-integers": [
    59
  ],
  "class-7-fractions-decimals": [
    78,
    80,
    81
  ],
  "class-7-comparing-quantities": [
    88,
    89,
    10019
  ],
  "class-7-rational-numbers": [
    60
  ],
  "class-7-exponents": [
    99
  ],
  "class-7-large-numbers-around-us": [
    10001,
    10002,
    10003
  ],
  "class-7-arithmetic-expressions": [
    1
  ],
  "class-7-decimal-operations": [
    80
  ],
  "class-7-fraction-operations": [
    78
  ],
  "class-7-constructions-and-tilings": [
    10022,
    10023,
    10024,
    10025
  ],
  "class-7-lines-and-triangles": [
    174,
    10064,
    10065
  ],
  "class-7-algebraic-expressions": [
    92,
    93,
    95
  ],
  "class-7-data-handling": [
    10032,
    10033,
    10034
  ],
  "class-8-rational-numbers": [
    60
  ],
  "class-8-square-cube-roots": [
    374,
    10045
  ],
  "class-8-comparing-quantities": [
    88,
    89,
    10019
  ],
  "class-8-exponents": [
    99
  ],
  "class-8-proportional-reasoning-2": [
    84,
    85,
    86,
    91
  ],
  "class-8-fractals-and-solid-views": [411, 404],
  "class-9-number-systems": [
    60,
    61,
    62
  ],
  "class-9-euclid-geometry": [
    10053,
    10054,
    10055,
    10056
  ],
  "class-9-heron": [
    10079,
    10080,
    10081
  ],
  "class-10-real-numbers": [
    62,
    69
  ],
  "class-10-arithmetic-progressions": [
    335,
    340
  ],
  "class-10-section-formula": [
    10085,
    10086
  ],
  "class-10-heights-distances": [
    10098,
    10099,
    10100,
    10101
  ],
  "class-11-permutations": [
    558,
    561
  ],
  "class-11-binomial": [
    10134,
    10135,
    10136,
    10137
  ],
  "class-11-conics": [
    10141,
    10143,
    10144
  ],
  "class-11-linear-inequalities": [
    122
  ],
  "class-12-relations-functions": [
    10113,
    10114,
    10115,
    10116,
    10117,
    10118,
    10122
  ],
  "class-12-determinants": [
    353,
    10193,
    10196
  ],
  "class-12-continuity-differentiability": [
    10165,
    10166,
    10171
  ],
  "class-12-integration-methods": [
    10180,
    10181,
    10182,
    10183
  ],
  "class-12-differential-equations": [
    10186,
    10187,
    10188,
    10189,
    10190
  ],
  "class-12-vectors-3d-geometry": [
    390,
    10153,
    10154,
    10155,
    10160
  ],
  "class-12-bayes-theorem": [
    10214
  ],
  "class-12-linear-programming": [
    10200,
    10201,
    10202
  ],
  "class-12-inverse-trig": [
    265
  ],
  "class-7-simple-equations": [
    111
  ],
  "class-8-algebraic-identities": [
    106
  ],
  "class-8-proportion": [
    85,
    86
  ],
  "class-10-polynomials": [
    102,
    10050
  ],
  "class-10-pair-linear": [
    112
  ],
  "class-10-quadratic": [
    114
  ],
  "class-9-polynomials": [
    102,
    10046,
    10047,
    10048,
    10049
  ],
  "class-10-irrational-numbers": [
    61
  ],
  "class-10-polynomial-zero-coefficients": [
    10050
  ],
  "class-10-linear-substitution-elimination": [
    112,
    435,
    436
  ],
  "class-10-linear-consistency": [
    10199
  ],
  "class-10-triangle-bpt-converse": [],
  "class-10-similarity-criteria": [],
  "class-10-areas-similar-triangles": [241],
  "class-10-special-trig-angles": [
    260
  ],
  "class-10-circle-tangent-radius": [
    10096
  ],
  "class-10-two-tangents": [
    10097
  ],
  "class-10-sector-segment-area": [
    225
  ],
  "class-10-composite-circle-regions": [],
  "class-10-combination-solids": [
    10111
  ],
  "class-10-recasting-solids": [],
  "class-10-frustum-cone": [
    10110
  ],
  "class-10-grouped-mean-methods": [
    10102,
    10103,
    10104
  ],
  "class-10-grouped-mode": [],
  "class-10-grouped-median": [
    10109
  ],
  "class-10-proof-reasoning": [
    10057,
    590
  ],
  "class-10-mathematical-modelling": [
    606
  ]
};

export function lessonsForCurriculumTopic(id: string) {
  return (curriculumLessonIds[id] ?? []).flatMap((id) => {
    const lesson = lessonById(id);
    return lesson?.status === "Published" ? [lesson] : [];
  });
}

export function curriculumTopicRoute(id: string) {
  return lessonsForCurriculumTopic(id)[0]?.route ?? `/curriculum?topic=${encodeURIComponent(id)}&status=upcoming`;
}
