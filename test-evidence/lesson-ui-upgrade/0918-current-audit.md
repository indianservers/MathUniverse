# Lesson 0918: Zeta Function

Status: dedicated implementation pass. Browser interaction and exact visual acceptance remain deferred under the user-directed workflow. Not certified as an exact mockup match.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0918-advanced-advanced-special-functions-zeta-function-redesigned.png`.
Advanced concept: 2024. Route: `/lessons/advanced-concepts/2024-zeta-function`.

## Comparison

| Target area | Implemented | Difference / remaining verification |
| --- | --- | --- |
| Dedicated series/product bridge | Direct partial sums and products, first 100 primes from existing primality helper, numerical reference and errors | Truncations not forced to agree with each other; finite product expansion correctly distinguished from first-N sum |
| Parameters | Working s=2/3/4 presets, custom numeric/range s=1.05..6, N=5..1000 and K=3..100 selectors | All graphs, factors, errors and bounds update |
| Series panel | Every selected term, actual value-proportional bars, partial sum and convergence path | Corrects reference's oscillating convergence; true sums increase from below. Term list scrolls rather than hiding middle terms |
| Product panel | Every prime factor, running products and convergence path | Corrects target's wrong displayed factor for prime 23 and oscillating convergence. Products increase from below |
| Reference value | Euler-Maclaurin evaluation with six Bernoulli corrections, using existing complex arithmetic helpers | Approximate numerical reference, not mathematically certified arbitrary precision |
| Remainder | Actual integral-test lower/upper bounds for series tail | Bounds added to distinguish estimated error from proof of equality |
| Integer/prime matrix | True divisibility for integers 1..12 and first at most ten selected primes | Corrects reference's repeated/corrupted prime labels and incorrect factor dots |
| Factorization inspector | Integer input 1..500, prime powers, examples and selected-product membership | Handles 1 as empty product; reference matrix row selection made functional |
| Convergence/continuation | Working explanatory disclosure and primary reference | Analytic continuation explicitly distinguished from ordinary sums of divergent series |
| Practice | Actual ζ(2) numeric answer and convergence-behavior checking, initially blank | Reference Start Practice now opens checked lesson-specific inputs |
| Critical line and zeros | Re(s)=1/2, sourced approximate zero pairs plotted at actual imaginary heights | Corrects target's Re(s)=1 label and inconsistent imaginary coordinates; 5 pairs initially, sixth available |
| Complex magnitude | Actual 41x81 numerical grid over Re=-1..2, Im=-40..40, clickable sample, numeric complex probe | Log-intensity color with disclosed saturation; approximate grid, not an exact zero locator. Probe reports pole at 1+0i |
| Numerical continuation | Euler-Maclaurin formula for real and complex values, six corrections and N=128 | Validated within displayed region by known values/refinement/residuals, not certified globally or for arbitrary inputs |
| Riemann hypothesis | Conjecture description, finite-zero evidence limitation and NIST link | No claim that finite plotted zeros prove hypothesis |
| Layout and navigation | Dedicated sum/product panels, prime bridge, continuation/practice, complex view and valid previous/next links | Exact shell/footer, fonts, equality ornament, responsive geometry, heatmap interaction and pixel match unverified |

## Verification

- Seven focused Vitest tests passed: six model tests and one initial-markup test.
- Numerical values checked at s=2,3,4,1/2,0,-1,-2; pole at s=1 handled separately.
- Default sum, product, prime-23 factor and error checked independently.
- Both truncations tested for monotonicity and staying below reference; integral-test bounds checked at supported exponents including 1.05.
- First 100 primes verified through 541; every integer 1..500 reconstructed from prime powers.
- Complex evaluation compared with doubled truncation N=256 across displayed real/imaginary boundaries; conjugation symmetry tested.
- Residual magnitude at six sourced approximate zero heights below 1e-7.
- Initial markup confirms default values, correct divisibility, correct critical-line label, no pregraded practice, no KaTeX error and valid next route.
- Targeted strict TypeScript and focused ESLint passed.
- One dedicated route test passed; 233 unrelated cases skipped.
- No full build, full suite, actual browser input/heatmap events, screenshots or pixel comparison performed.

## References

- NIST DLMF 25.2: https://dlmf.nist.gov/25.2 (series, continuation, Euler-Maclaurin representations, product).
- NIST DLMF 25.10: https://dlmf.nist.gov/25.10 (zeros and critical strip).
- Existing `riemannPrimesModel.ts` zero table sourced from https://www-users.cse.umn.edu/~odlyzko/zeta_tables/zeros1 .

Next sequential target: 0919 / 2025 Bessel Function. Previous aggregate completion counts have not been re-audited.
