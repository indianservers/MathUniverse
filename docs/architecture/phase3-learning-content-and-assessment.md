# Phase 3 taxonomy, lessons, practice, assessment, projects and studios

## Canonical taxonomy

Stable IDs connect board-specific sequencing to shared mathematics without erasing terminology. Each concept records description, prerequisite/related IDs, Phase 2 object types, capabilities, notation, terminology aliases (including Telugu foundations), difficulty/course scope, misconceptions, lesson/practice/assessment references, and official mappings. Validation rejects broken prerequisites.

Twenty priority concepts cover induction, matrices, De Moivre, theory of equations, hyperbolic functions, axes, pairs/systems, conics, limits, differentiation, integration, ODEs, dispersion, random variables, polynomials, and coordinate geometry.

## Lesson and reusable block schema

`MathLesson` implements objectives, prior check, explanation, definitions, notation, restrictions, examples, non-examples, misconceptions, live activities, guided/independent practice, assessments, applications, context, summary, glossary, remediation, enrichment, accessibility, translations, provenance and review. Blocks cover objectives through rubrics and reference stable mathematical node IDs. Validation rejects orphan concepts, nodes, prerequisites, practice, assessment, and accessibility descriptions.

The induction lesson is a complete authored **draft**, not approved content. Its slider, closed form, finite check, exact result, and activity use `MathDependencyGraph` nodes. Two worked examples, a non-example, misconception, staged practice, summary and accessibility alternatives exist. It remains draft because AP/Telangana source mapping and genuine reviewers are unavailable.

## Practice generator

Families use versioned Mulberry32 seeds, constrained parameters, declared answer models, rule-tagged solutions, six pedagogical hint levels, misconception tags, validation rules and review state. Five families implement induction evaluation/diagnosis, Vieta construction, De Moivre powers and pair-of-lines angles. Tests run 1,000 seeds per family (5,000 combinations), check reproducibility, validity, nonempty answers and duplicate-choice rules. Generated items inherit the family's review state; none is approved.

Exact-expression evaluation normalizes identical forms and otherwise performs declared safe identity samples. Numeric evaluation uses explicit relative/absolute tolerance. Sets are unordered; matrices retain order. Rubric/construction/graph/proof answers fail to manual review when automatic scoring is unsafe. Rule-tagged steps support partial credit.

## Assessment and projects

Blueprints store board/year/course/paper, concepts, types, marks, difficulty distribution, cognition, expected method, time, choice rules, page evidence and review. Validation requires distributions total 100 and source evidence before verification. The induction blueprint is explicitly a source-pending draft.

`MathProject` supports problem, assumptions, variables/units, shared graph/geometry/table/calculation node IDs, interpretation, limitations, reflection, sources, report and rubric. Approved projects require valid node references and an approved rubric.

## Priority studios

Ten independent general-input kernels implement bounded induction implication diagnosis; exponential hyperbolic functions; affine quadratic-form axes transformation with substitution residual; homogeneous pair-of-lines slopes/angle; radical axis and orthogonality; De Moivre powers/root branches; Vieta relations; conic discriminant/centre; composite Simpson verification; and RK4 ODE/direction-field/candidate residual. Numeric results declare method, residual, status and limitations. They are engines, not certified syllabus placements.
