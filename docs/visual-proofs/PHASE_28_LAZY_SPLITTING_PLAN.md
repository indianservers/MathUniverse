# Phase 28 Lazy Splitting Plan

## Current Static Import Problem

`VisualProofPage.tsx` currently imports every proof component directly and resolves them through one large `switch (proof.componentKey)`. This preserves direct URLs, but it makes the proof route chunk grow every time a category is upgraded. The Phase 27 production build reported the `VisualProofPage` chunk at about 675.77 kB uncompressed and 171.96 kB gzip.

## Why Lazy Splitting Was Deferred

Lazy splitting is feasible, but it is not a trivial one-file edit anymore. The page now covers 183 phase-upgraded proof routes across 18 categories, and a safe split needs a typed resolver layer that preserves:

- direct URL behavior for `/visual-proofs/:categorySlug/:proofSlug`
- existing not-found and fallback behavior
- `visualProofsIndex` as the metadata source of truth
- smoke manifest generation from metadata
- all Phase 1-27 component mappings
- snapshot JSON/SVG export through `PhaseTwoProofExperience`

The current direct switch has no intermediate component-loader abstraction. Refactoring it during Phase 28 without a dedicated resolver test suite would create avoidable routing risk.

## Proposed Typed Route-Component Loader Design

Create a typed category-to-loader map:

```ts
type VisualProofComponentLoader = () => Promise<{ default: VisualProofComponent }>;
type CategoryProofLoaders = Partial<Record<VisualProofComponentKey, VisualProofComponentLoader>>;
type VisualProofCategoryLoaderMap = Record<string, CategoryProofLoaders>;
```

Suggested file structure:

- `src/visual-proofs/proofs/loadVisualProofComponent.ts`
- `src/visual-proofs/proofs/categoryLoaders/geometryProofLoader.ts`
- `src/visual-proofs/proofs/categoryLoaders/algebraicIdentitiesProofLoader.ts`
- one loader file per category

Each category loader should import only its own category proof components using dynamic imports.

## Migration Steps

1. Extract a shared `VisualProofComponentProps` type.
2. Add one category loader file for a small stable category.
3. Add `loadVisualProofComponent(categorySlug, componentKey)`.
4. Update `VisualProofPage` to use `React.lazy` and `Suspense` around the loaded component.
5. Preserve `ComingSoonProof` as the unknown-component fallback.
6. Add resolver tests for every `phase-upgraded` proof in `visualProofsIndex`.
7. Convert categories incrementally, not all at once if risk is high.
8. Measure build output after conversion.

## Risks

- Missing component loader for a route that currently works.
- Circular imports if loaders import metadata files.
- Type drift between `VisualProofComponentKey` and loader maps.
- Larger total code if category loaders are duplicated poorly.
- Direct URL rendering regression if lazy fallback is not handled carefully.

## Test Plan

- Unit test that every `phase-upgraded` proof resolves a loader.
- Unit test that unknown component keys return fallback behavior.
- Focused proof ladder: Phase 1 through Phase 28.
- Production build.
- Production preview HTTP route smoke for every category and every phase-upgraded proof route.
- Manual browser check for one route per category after splitting.

## Acceptance Criteria

- All 183 phase-upgraded routes resolve a component loader.
- Direct proof URLs still render the correct proof.
- Category pages remain unchanged.
- `npm run typecheck` passes.
- `npm run build` passes.
- Focused proof ladder passes.
- Production preview route smoke passes for every phase-upgraded route.
- `VisualProofPage` chunk size is measurably reduced.
