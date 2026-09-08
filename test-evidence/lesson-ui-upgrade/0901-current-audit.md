# Lesson 0901: Goldbach Conjecture

Status: dedicated implementation; browser interaction and visual acceptance deferred under the current user-directed workflow. Exact visual match is not certified.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0901-advanced-advanced-famous-problems-goldbach-conjecture-redesigned.png`.
Advanced concept ID: 2007. Route: `/lessons/advanced-concepts/2007-goldbach-conjecture`.

## Implementation and Comparison

| Target area | Implemented behavior | Remaining review / deliberate difference |
| --- | --- | --- |
| Dedicated partition model | Existing sieve helper, exact unique/ordered pairs and primality lookup | Only this lesson route replaced; shell/footer typography and exact geometry unverified |
| Even-number controls | Minus/plus and native draggable/keyboard range from 2 to 200 | Range extends target steppers; n=2 explicitly identified as outside the conjecture |
| Live summary | Unique count, computed worked sums and prime density | Corrects 28's density to 9/28 = 32.14%, not reference's 7.14% |
| Prime ribbon | All primes <=n, working scroll buttons, prime inspection and complementary-prime feedback | Removes misleading numeric-axis alignment and reference's out-of-range prime 29 at n=28; actual scrolling unverified |
| Pair connections | Real paired prime circles, equation links and selected-prime highlighting | SVG matches mathematical structure; precise connectors/font/spacing remain unverified |
| Ordered pairs | Toggles displayed pair list, preserving diagonal pairs once | For 22, ordered count is 5, not twice the unique count of 3 |
| Nearby-even carousel | Eight computed even-number entries, earlier/later controls and clickable examples | Horizontal overflow on narrow layouts; browser behavior and overlap checks deferred |
| Density dots | One dot per integer 1..n, primes distinctly colored, live counts | Replaces reference's unrelated 126-dot denominator with actual sample size |
| Context and proof | Finite verification distinguished from universal conjecture | No unverified external bound copied from reference; text describes this explorer's tested range |
| Practice | Editable challenge number, complete-partition checker and answer toggle | Adds genuine answer input/checking to reference's reveal-only surface; duplicates, incomplete and nonprime answers rejected |
| Illustration | Existing local galaxy PNG reused and visually inspected as an asset | Artwork differs from target's galaxy image; rendered crop/asset loading unverified |
| Navigation | Catalog-valid Collatz and Riemann Hypothesis and Primes links | Exact app footer styling not reproduced |

## Verification

- Six focused Vitest model/initial-markup tests passed.
- All even n=4..200 verified against independent trial-division primality, with nonempty unique partitions and duplicate-free ordered pairs.
- Tests cover default density/pairs, n=2, diagonal pairs, exact complete practice answers, reversed pair order, duplicates, blanks and invalid inputs.
- One dedicated advanced route test passed; 216 unrelated cases were skipped.
- Targeted strict TypeScript and focused ESLint passed.
- Existing application listener verified at 127.0.0.1:2266.
- No authentic browser screenshots, pixel comparisons, responsive overlap checks or actual browser interaction tests performed. These remain required before full acceptance.

Next sequential target: 0902 / advanced concept 2008 Riemann Hypothesis and Primes, route `/lessons/advanced-concepts/2008-riemann-hypothesis-primes`. Earlier aggregate completion counts have not been re-audited.
