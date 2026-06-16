# Polynomials and Algebraic Identities — Phase B: Implementation + Testing + Re-audit

## 1. Implementation Objective
Extend existing algebra, NCERT, and visual-proof assets into a unified polynomial/identity lab.
## 2. Current Status from Phase A
Partial.
## 3. Implementation Decision
Extend.
## 4. Target Routes
`/algebra`, `/ncert/class-10-polynomials`, and `/visual-proofs/algebraic-identities`.
## 5. Files to Inspect Before Coding
Algebra page, NCERT concept page/data, `src/visual-proofs/proofs/algebra/*`, formula data, and proof components.
## 6. Files Expected to Change
Existing algebra/proof-facing UI, polynomial components, helper tests, and docs.
## 7. Components to Create or Refine
`AlgebraTileScene`, `IdentityAreaProofScene`, `PolynomialGraphScene`, `FactorMatchPanel`, `LikeTermsBuilder`.
## 8. Interaction Requirements
Click, drag, snap, sliders, live values, formula builders, visual proof, check/submit, instant correction, and progressive hints.
## 9. Visual Requirements
Tile, area, symbolic, and graph views must show equivalent forms.
## 10. Practice / Challenge Requirements
Add expand, factor, identity match, like-term, and sign-error tasks.
## 11. Math Correctness Requirements
Validate signs, exponents, coefficient zeros, equivalent forms, and factorization.
## 12. Accessibility Requirements
Keyboard tile controls, text labels, non-color grouping, and reduced motion.
## 13. Mobile Responsiveness Requirements
Use compact tile grids and wrapped expressions.
## 14. Performance Requirements
Limit tile counts and summarize high-degree expressions.
## 15. Testing Requirements
Test identity helpers, routes, edge cases, and build.
## 16. Route Verification Checklist
Verify algebra, NCERT polynomial, and visual proof routes.
## 17. Documentation Updates
Document supported identities and extension points.
## 18. Final Codex Completion Report Format
Report files, identities tested, routes, accessibility checks, limitations, and next steps.
## 19. Acceptance Criteria
Partial polynomial coverage is extended without duplicating existing routes.

