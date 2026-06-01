# Combinatorics Implementation Audit

## Existing Coverage

| Topic | Audit Status | Existing Location | Action |
| --- | --- | --- | --- |
| Counting Principles | Partial | `NCERTConceptPage` permutation tree | Added canonical counting tree engine and step-by-step product-rule visualization. |
| Permutations | Partial | NCERT permutation tree and advanced permutation-cycle lab | Added simulator with repetition toggle, swaps, constraints, and enumeration. |
| Combinations | Partial | NCERT nCr comparison text | Added subset generator and dynamic selection visualization. |
| Repetition Cases | Missing | No canonical implementation found | Added formulas and permutation/combination repetition modes. |
| Constrained Repetitions | Missing | No implementation found | Added bounded stars-and-bars dynamic programming counter. |
| Binomial Coefficients | Partial | Pascal triangle NCERT visual | Added scalable Pascal explorer and coefficient highlighting. |
| Binomial Theorem | Partial | NCERT binomial visual | Added term-by-term expansion with coefficient animation and selected-term explanation. |
| Multinomial Theorem | Missing | No implementation found | Added multinomial term generation and symbolic rendering. |
| Principle of Inclusion and Exclusion | Missing | No implementation found | Added 3-set Venn calculation simulator and formula breakdown. |

## Algorithms

- BigInt factorial, permutation, and combination calculators.
- Repetition formulas for arrangements and selections.
- Bounded constrained-repetition dynamic programming.
- Counting tree generation with optional repetition.
- Permutation and combination enumeration capped for interactive rendering.
- Pascal triangle generation using binomial coefficients.
- Binomial and multinomial expansion term generation.
- Three-set inclusion-exclusion calculation.

## Visualization Engine

- SVG renders counting trees, permutation slots, combination subsets, binomial terms, multinomial terms, and inclusion-exclusion Venn regions.
- Framer Motion animates branch growth, swaps, term selection, and Venn highlights.
- Canvas is used for Pascal triangle preview to keep larger rows smooth.

## State Flow

Persisted Zustand state under `math-universe-combinatorics-session`:

- Items
- n and r
- Repetition toggle
- Constraint text
- Pascal rows
- Binomial and multinomial powers
- Selected term
- Challenge seed

## Component Tree

- `CombinatoricsModule`
- `ImplementationAudit`
- `CountingVisualizationEngine`
- `PermutationSimulator`
- `CombinationGenerator`
- `PascalTriangleExplorer`
- `BinomialTheoremVisualizer`
- `MultinomialExpansionEngine`
- `InclusionExclusionSimulator`
- `ChallengeAndExportPanel`

## Folder Structure

```text
src/modules/combinatorics/
  CombinatoricsModule.tsx
  IMPLEMENTATION_AUDIT.md
  combinatoricsEngine.ts
  combinatoricsStore.ts
```

## Performance Optimization

- Big counts use `BigInt` instead of unsafe JavaScript numbers.
- Enumerations are capped for display while formulas remain exact.
- Pascal rendering uses Canvas for compact larger-row previews.
- Expensive derived data is memoized at the React layer.
