# Polynomials and Algebraic Identities — Phase A: Audit + Upgrade/Create Design

## 1. Objective
Audit polynomial and identity coverage and design algebra-tile, area-proof, expansion, factorization, and graph links.
## 2. Current Status Classification
Partial — extend current module. Rich identity visual proofs exist, but no unified polynomial concept lab was found.
## 3. Existing Routes and Files Found
`/algebra`; `/ncert/class-10-polynomials`; `/visual-proofs/algebraic-identities`; `src/visual-proofs/proofs/algebra/*`; `src/data/formulaData.ts`; `src/components/layout/navItems.ts`.
## 4. Existing Features Found
Algebra route, polynomial NCERT link, many algebraic identity visual proofs, formula cards, and proof components.
## 5. Existing Weaknesses
Needs unified polynomial lab for terms, degree, graph roots, expansion, factorization, and identity connections.
## 6. Upgrade/Create Decision
Extend partial coverage by linking algebra, NCERT, formula, and visual-proof pieces.
## 7. Student Learning Goals
Identify terms, degree, coefficients, expand, factor, match identities, and connect roots to factors.
## 8. Professor-Level Teaching Strategy
Use area/tile models, equivalent forms, root-factor theorem intuition, and proof-by-rearrangement.
## 9. Premium Interaction Design
Include click-to-select terms, drag algebra tiles, snap rectangles, sliders for coefficients, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 10. Visual Models Required
Algebra tiles, area rectangle, identity proof scene, polynomial graph, coefficient table, and factor matching.
## 11. Practice and Challenge Ideas
Expand, factor, match identity, collect like terms, classify degree, and repair sign errors.
## 12. Beginner Mode
Use small binomials, tiles, and plain labels.
## 13. Professor Mode
Show formal identities, factor theorem hints, and symbolic transformations.
## 14. Accessibility Requirements
Keyboard tile movement, text labels, non-color term grouping, and reduced motion.
## 15. Mobile Requirements
Use simplified tile grids and scroll-safe expressions.
## 16. Math Safety Requirements
Preserve sign accuracy, exponents, like terms, and equivalent form checks.
## 17. Component Recommendations
Create or refine `AlgebraTileScene`, `IdentityAreaProofScene`, `PolynomialGraphScene`, `FactorMatchPanel`, and `LikeTermsBuilder`.
## 18. Testing Plan
Test square identities, difference of squares, trinomials, zero coefficients, negative terms, and equivalence checks.
## 19. Risks and Things Not to Touch
Do not break visual proofs, NCERT links, or algebra route.
## 20. Phase B Implementation Strategy
Extend existing algebra/proof assets with a unified polynomial lab and reuse visual proof components.
## 21. Acceptance Criteria for Phase A
Polynomials are classified as partial with a safe extension plan.
## 22. Suggested Codex Prompt for Phase B
Extend existing algebra/visual-proof polynomial coverage with algebra tiles, identity proofs, graph links, checks, hints, and tests.

