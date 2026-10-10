# Studio content-gap additions

Scope: all gaps identified in the 19-entry Studio ranking. Standalone graph, CAS and spreadsheet workspaces are excluded. This is an editorial gap inventory, not a claim that every possible mathematical topic has been audited.

Existing coverage included five guided lessons per Studio, with introductory treatments of many flagged topics. Added two deeper lessons per Studio (38 total), giving 133 guided lessons. Each addition includes hypotheses, a worked derivation, a numeric transfer exercise, a misconception correction and a reasoning investigation. The additions appear in each Studio's guided course and searchable reference library. Use **Lessons & Practice** from the Studio navigation. Its topic checklist links directly to each new lesson.

| Studio | Content gaps addressed by the new lessons | Remaining development |
| --- | --- | --- |
| Algebra | Parameter-dependent inequality cases, zero parameters, sign reversal; rational cancellation, original domains, holes and endpoints | General parameterized practice generation |
| Algebraic Structures | Disjoint permutation cycles, order and parity; irreducibility and arithmetic in a four-element extension field | Dedicated permutation and extension-field models |
| Geometry | Complete midpoint-theorem proof with hypotheses; ellipse focal constraints and degenerate/impossible cases | Expanded constraint-preserving conic construction tools |
| Trigonometry | Fourier limits at jumps and Gibbs behavior; polar petal area, negative radii and tracing multiplicity | Broader generated Fourier and polar exercises |
| Calculus | Parameterized logarithmic-series convergence and inconclusive ratio tests; divergence-theorem hypotheses and direct flux verification | General symbolic convergence classification and proof assessment |
| Number Systems | Base-dependent terminating representations and binary approximations; rounding error bounds and cancellation | Arbitrary-precision representation and rounding controls |
| Linear Algebra | SVD circle-to-ellipse geometry, singular directions and area; nearly singular systems, perturbations and conditioning | Advanced graphical overlays and perturbation feedback |
| Complex Numbers | Residue-based contour integration and orientation; logarithm continuation, winding and branch cuts | General contour and continuation models |
| Mathematical Modelling | Observed-data least-squares calibration and residuals; holdout error, chronological splitting, preprocessing leakage and test reuse | External-data fitting and reusable validation workflows |
| Number & Discrete Mathematics | Extended-Euclid traces, gcd invariant and Bézout back substitution; divisibility induction and explicit base/step proof | More animated traces and automatic proof assessment |
| Set Theory & Relations | Cantor's power-set theorem for arbitrary sets; separation, unrestricted comprehension and Russell's obstruction | Broader advanced cardinality and axiomatic course |
| Graph Theory | Matching augmentation with an alternating path; residual capacity, cancellation and max-flow/min-cut certificates | Dedicated matching and flow animations |
| Statistics & Probability | Paired-data assumptions, design versus graphical diagnostics; effect size, approximate power and sample-size planning | Automated diagnostics and power controls; reconcile ratings with implementation evidence |
| Differential Equations | Multi-mode heat initial data and substitution checks; finite-difference boundary equations and grid error limits | General PDE and boundary-value numerical solvers |
| Continued Fractions | Exact derivation of a quadratic periodic expansion; Pell-unit multiplication, norm checks and minimality limits | General quadratic-irrational and Pell solvers |
| Famous Problems Atlas | Precisely bounded Collatz experiments; complete Euclid prime proof and the composite-product misconception | Broader referenced proof library and curated experiments |
| Statistics Inference | Welch variance and standard error for independent means; equivalence margins, TOST and failure-to-reject distinctions | Broader interactive procedure selection and diagnostics |
| Special Functions | Legendre recurrence and integral orthogonality; erf alternating-series truncation bounds | Interactive recurrence, orthogonality and error tools |
| Advanced Differential Equations | Explicit-Euler stiffness, stability boundaries and accuracy; nonzero heat boundaries and steady/transient decomposition | General numerical and boundary solvers in this companion |

## Completion boundary

The teaching additions cover explicit representative cases. They do not implement general solvers, new graphical workbenches, arbitrary precision, automated assumption diagnostics, proof grading, or exhaustive advanced courses. Those remaining needs are also displayed in each Studio's checklist. Provisional Studio scores and feature statuses are unchanged: adding content does not establish competitive parity or independent mathematical certification.

## Validation

- Six curriculum tests pass, including integration of all 38 additions, selected-lesson links and representative exercise calculations.
- Production build passes.
- Browser checks pass for Algebra, Statistics & Probability and Advanced Differential Equations; Algebra lesson switching and correct-answer feedback work. The 390-pixel mobile view has no horizontal overflow or runtime errors.
- Targeted lint reports no errors and one existing hook-dependency warning in StudioLearningOutlet.
- Full repository type-checking fails with errors in existing files, including GeometryWorkspacePanel, remainingStudioVisualManifest, SamplingCltLab and workspace tests. A clean repository-wide type-check is not claimed.
