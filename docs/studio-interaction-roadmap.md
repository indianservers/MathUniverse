# Studio interaction upgrade: three-phase implementation plan

The guiding pattern is the Right Triangle Studio: a learner changes a mathematical object directly, sees the visual and numerical result together, and gets a short explanation and a challenge. Existing controls and theory remain available.

## Phase 1 — Core visual feedback (priority 1)

1. **Direction Fields:** Extend the existing draggable multi-start field with Play/Pause/Reset. Reveal equal-time segments along each solution, keep each start and path color matched, and show pairwise separation at the current x coordinate. When curves leave the viewport or the slope is undefined, stop that trace and explain why. Keep the custom slope expression and existing field controls.
2. **Eigenvectors:** Keep the matrix entry sliders; add draggable endpoints for the two matrix columns (images of the basis vectors). Recompute the transformed grid, unit circle image, determinant, eigenvalues, and real eigendirections from the same matrix state. Indicate when there are no real eigendirections or when a basis vector cannot be dragged to an invalid value.
3. **Sampling & CLT:** Replace decorative dots with repeated samples from a selectable skewed or uniform population. Animate sampled observations collapsing to their mean, then collect those means into a histogram. Run two independently seeded streams with different sample sizes side by side; report mean, standard error, and sample count. Make pause/reset deterministic.
4. **Triangles:** Add a “What stays true?” mode to the existing draggable triangle explorer. Update angle sum, three strict triangle inequalities, and applicable congruence tests as vertices move. Explain degenerate triangles and keep current explorer modes intact.

**Phase 1 checks:** Math unit tests for curve progression/separation, matrix drag conversion, sampling statistics, and triangle invariants; browser interactions at desktop and phone widths; keyboard-accessible numeric alternatives to dragging.

## Phase 2 — Linked models and comparisons (priority 2)

1. **Fractals:** Share a complex parameter `c` between Mandelbrot and Julia views. Selecting or dragging `c` updates the Julia image and a short orbit trace of `z_(n+1)=z_n²+c`; show escape iteration and bounded status without blocking the UI.
2. **Optimization:** Drag constraint boundaries and objective direction. Recompute feasible polygon, corner scores, best feasible point, and binding constraints. Show an empty-feasible-state message and compare before/after objectives.
3. **Graph Networks:** Add a synchronized stepper for Dijkstra and a minimum-spanning-tree method. Highlight frontier, accepted and rejected edges, cumulative cost, and an explanation at each step. Handle disconnected graphs and reject negative weights for Dijkstra.
4. **Euler / Heun / RK4:** Use one equation, initial condition, interval, and step-size control across the three methods. Plot all approximations against an exact curve when known and otherwise a fine RK4 reference; show a shared error table and chart. Preserve the method-specific lesson pages.
5. **Epidemics:** Add a dated intervention timeline with adjustable contact reduction and duration. Integrate the compartment model piecewise, overlay a baseline and intervention scenario, and plot effective reproduction number. Keep rates nonnegative and population conserved.

**Phase 2 checks:** Pure engine tests for numerical methods, feasible-region changes, algorithm traces, fractal iteration, and SIR conservation; controls and plots checked together in the browser, including invalid and boundary inputs.

## Phase 3 — Applied workflows (priority 3)

1. **Cryptography:** Animate a short message through small educational key generation, numeric encoding, modular exponentiation, and decryption. Show each arithmetic step and a valid-key challenge; never imply the toy keys are secure.
2. **Shapes Explorer:** Make dimension handles feed the same state as the numeric controls. For supported solids, link the 3D view to a fold/unfold net and recalculate surface area and volume live. Explain unsupported nets rather than presenting a misleading one.
3. **Regression:** Drag observations, display residuals, and compare training with held-out validation error for linear and polynomial fits. Mark extrapolation and show how an outlier or extra degree affects fit and validation.

**Phase 3 checks:** Round-trip crypto tests, shape formula/net consistency tests, regression fit/residual/holdout tests, and desktop/phone visual checks in both themes.

## Shared delivery rules

- Every control has a visible value, a reset path, and a keyboard or form alternative to dragging.
- Graph legends and explanatory text use the same colors as the corresponding curves or objects.
- Animation respects reduced-motion preferences and stops on route change.
- Existing theory, “In Simple words,” examples, and cards remain available.
- Each phase is tested and committed separately; the production build and live route checks close the phase.
