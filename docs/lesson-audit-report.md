# Lesson Audit Report

Date: 2026-07-28  
Scope: every registered lesson in the local app catalog

## Executive Summary

Audited 919 total lessons:

| Lesson pack | Count | Result |
| --- | ---: | --- |
| Core interactive catalog | 674 | Passes structural, route, adapter, contract, content, and formula-card checks |
| School syllabus remediation | 220 | Passes route, metadata, content, objectives, and assessment checks |
| Advanced concept lessons | 25 | Passes route, strand, studio-link, pathway, content, and assessment checks |

No duplicate lesson IDs or routes were found across all 919 lessons.

The main quality caveat is not missing content; it is specificity. Core lessons have adapter-level and topic-level formula cards that are mathematically sound, but many are generated templates. School lessons also use broad family-level interactive labs, so some advanced/proof lessons are supported by a related generic model rather than an exact theorem-specific tool.

## Checks Performed

Automated catalog audit:

- Imported `lessonCatalog`, `schoolLessonCatalog`, `advancedConceptLessons`, and `advancedConceptPathways`.
- Checked lesson counts, unique IDs, unique routes, route prefixes, slug alignment, titles, summaries, explanations, learning blocks, formulas, controls, observable outputs, screen-reader summaries, objectives, assessment prompts, and tool links.
- Wrote machine-readable results to `tmp/lesson-audit-results.json`.

Test suite subset:

- `src/modules/lessons/catalog/lessonCatalog.test.ts`
- `src/modules/lessons/audit/lessonSyllabusAudit.test.ts`
- `src/modules/lessons/catalog/school/schoolSyllabusLessons.test.ts`
- `src/modules/lessons/catalog/advanced/advancedConceptLessons.test.ts`
- `src/modules/lessons/catalog/advanced/advancedConceptPathways.test.ts`
- Sequence, matrix, discrete, and finance adapter render tests

Result: 9 test files passed, 32 tests passed.

## Inventory

Core catalog by phase:

| Phase | Lessons |
| --- | ---: |
| Phase 1 | 130 |
| Phase 2 | 225 |
| Phase 3 | 163 |
| Phase 4 | 156 |

Core catalog by category:

| Category | Lessons |
| --- | ---: |
| Core Workspaces | 38 |
| Numbers and Arithmetic | 35 |
| Authoring and Learning System | 39 |
| Platform Capabilities | 18 |
| Graphs and Functions | 56 |
| Algebra | 37 |
| Geometry | 90 |
| Trigonometry | 20 |
| Symbolic Mathematics | 22 |
| Calculus | 57 |
| Data and Probability | 106 |
| Advanced Mathematics | 44 |
| 3D Mathematics | 50 |
| Discrete and Applied Mathematics | 62 |

School remediation by level:

| Level | Lessons |
| --- | ---: |
| Class 6 | 12 |
| Class 7 | 15 |
| Class 8 | 12 |
| Class 9 | 43 |
| Class 10 | 29 |
| Class 11 | 40 |
| Class 12 | 69 |

Advanced lessons:

| Strand | Lessons |
| --- | ---: |
| Continued Fractions | 5 |
| Famous Problems | 5 |
| Statistical Inference | 5 |
| Differential Equations | 5 |
| Special Functions | 5 |

## Interactive Tool Coverage

Core lessons:

- All 674 lessons resolve to one of 23 registered `LessonSurface` adapters.
- Every adapter in the `LessonAdapter` union is represented.
- All core lessons have an interaction contract with required controls, observable outputs, required representations, keyboard alternative, and screen-reader summary.
- 114 core lessons use lesson-specific presets.
- 560 core lessons use family-level presets.

School lessons:

- All 220 lessons render through `SchoolLessonInteractiveLab`.
- The lab picks a model family from lesson title and concept family: algebra, calculus, geometry, probability, statistics, trigonometry, vectors, or number.
- This gives every school lesson an interactive surface, formula link, visual, misconception, and board-style check.

Advanced lessons:

- All 25 advanced lessons render through `AdvancedLessonInteractiveLab`.
- Strand-specific tools are present:
  - Continued fractions: partial quotient and convergent explorer
  - Famous problems: Collatz evidence explorer
  - Statistical inference: confidence interval simulator
  - Differential equations: Euler method table
  - Special functions: Gamma/Zeta/erf sampler
- All advanced lessons link to a larger studio route.
- 3 curated advanced pathways exist and reference registered lessons only.

## Formula Accuracy

Core lessons:

- 1,645 formula cards were generated across 674 core lessons.
- No empty formula label, expression, or explanation was found.
- No obvious malformed formula patterns were found by automated scan: no double exponent markers, placeholder values, duplicated trig tokens, or repeated operators.
- The formula bank uses standard identities and definitions, including:
  - Linear function: `f(x)=mx+b`
  - Linear solve: `ax+b=c => x=(c-b)/a`
  - Distance formula
  - Triangle area
  - Derivative definition
  - Definite integral as Riemann-sum limit
  - Mean, variance, probability, standard error, confidence interval
  - Arithmetic/geometric sequences
  - Determinant, matrix-vector product
  - Complex modulus and polar/Euler form
  - Combinations, power set size
  - Simple and compound interest

School lessons:

- Formula cards in `SchoolLessonInteractiveLab` are accurate for their selected family model.
- However, they are not always exact to the named lesson. Example risk: a proof lesson or theorem-specific lesson may show a related generic geometry/probability/calculus formula rather than the exact theorem statement.

Advanced lessons:

- Continued fraction, Collatz, inference, Euler method, Gamma, Zeta, and erf calculations are directionally accurate for instructional exploration.
- Zeta sampler intentionally restricts to real `s > 1.1` and uses a finite partial sum approximation.
- Gamma uses a Lanczos-style approximation; erf uses a standard numerical approximation.
- These are appropriate for visual lessons, but should be labeled as numerical approximations where displayed in the UI.

## Content Quality

Passes:

- Core lessons have summary, explanation, key ideas, real-world examples, control guide, formulas, worked connection, and know-more prompts.
- School lessons have summary, learn, explore, practice, objectives, search keywords, and assessment prompts.
- Advanced lessons have objectives, learn, explore, practice, assessment prompts, tool routes, pathway links, and mastery checks.

Weaknesses:

- Core lesson content is generated from adapter/topic templates. It is consistent, but some lessons will feel less authored than the advanced pack.
- School remediation content is richer than a stub, but the interactive lab is still family-level.
- Advanced lessons are stronger conceptually, but only 25 topics exist so far.

## Findings

No blocking catalog defects found.

Medium-priority improvement:

- Upgrade school proof/theorem lessons from family-generic labs to theorem-specific mini tools. This is especially valuable for Euclid, congruence, similarity, Bayes, Rolle, Mean Value Theorem, matrices, and linear programming.

Medium-priority improvement:

- Increase core lesson-specific presets beyond the current 114/674. The 560 family-level preset lessons are functional, but a learner will notice repeated interaction patterns.

Low-priority improvement:

- Add explicit "approximation" labels to the advanced special-function sampler outputs.

Low-priority improvement:

- Add a formula crosswalk report that maps each lesson title to its displayed formula cards. This would make future manual math review faster.

## Verification Commands

Successful:

```powershell
node tmp/audit-lessons.mjs
npx vitest run src/modules/lessons/catalog/lessonCatalog.test.ts src/modules/lessons/audit/lessonSyllabusAudit.test.ts src/modules/lessons/catalog/school/schoolSyllabusLessons.test.ts src/modules/lessons/catalog/advanced/advancedConceptLessons.test.ts src/modules/lessons/catalog/advanced/advancedConceptPathways.test.ts src/modules/lessons/adapters/SequenceLessonAdapter.test.tsx src/modules/lessons/adapters/MatrixLessonAdapter.test.tsx src/modules/lessons/adapters/DiscreteLessonAdapter.test.tsx src/modules/lessons/adapters/FinanceLessonAdapter.test.tsx --reporter=dot
```

Result:

```text
9 test files passed
32 tests passed
```

## Overall Assessment

The lesson system is complete enough to ship as a broad interactive catalog. The strongest areas are route integrity, adapter coverage, accessibility contracts, and content completeness. The next quality jump should be precision: more lesson-specific interactive presets and exact theorem/formula cards for the school remediation pack.
