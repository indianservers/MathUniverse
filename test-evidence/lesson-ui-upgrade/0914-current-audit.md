# Lesson 0914: Second-Order Oscillator

Status: completed in the current one-by-one UI acceptance pass. Reference structure and proportions are visually aligned; exact pixel identity is not claimed.

Reference inspected: `D:/Math App Screenshots for UI Update/Updated UI/0914-advanced-advanced-differential-equations-second-order-oscillator-redesigned.png`.
Advanced concept: 2020. Route: `/lessons/advanced-concepts/2020-second-order-oscillator`.

## Comparison

| Target area | Implemented | Difference / remaining verification |
| --- | --- | --- |
| Dedicated oscillator | Exact x, v, a from omega/x0/v0, period, amplitude and energy | One state drives all views; assumes mass 1 kg and spring constant omega squared, explicitly stated |
| Spring and mass | Calculated displacement positions mass, spring endpoint, wheels and ruler marker | Code-native SVG spring, not bitmap; schematic displacement scale changes with amplitude. Target spring artwork not copied exactly |
| Instantaneous values | Default t=pi/6: x=.500, v=-1.732, a=-2.000 | Correctly synchronized with every graph and phase marker |
| Time graphs | Actual position/velocity/acceleration samples, shared time cursor | Corrects target cursor labels and values at inconsistent x-axis positions; uses two future periods rather than reference's negative-time window |
| Time interaction | Play/pause animation, native draggable/keyboard slider, pointer scrubbing on each graph | Looping playback wraps after two undamped periods; animation frame cleanup on pause/unmount. Browser timing, pointer capture and responsiveness not tested |
| Damping comparison | Exact underdamped, critical and overdamped solutions, pink mass outline, graph overlays and phase trajectory | Extends damping ratio to 0..2; disabled ratio control while comparison off; acceleration includes damping force, not just -omega squared x |
| Phase plane | Actual ellipse and moving x/v point; damped trajectory spirals or approaches the origin without oscillation according to regime | Corrects reference's phase marker, which disagrees with the default negative velocity. Zero amplitude becomes a point |
| Energy | Real KE/PE bars, constant undamped total, optional damped energy and dissipated energy | Default 75/25 split; zero-energy state avoids division by zero. Meter accessibility maximum uses actual initial total |
| Parameters | Real omega/x0/v0 sliders and numeric inputs, reset | omega=.5..5, x0=-2..2, v0=-4..4. Reset restores default lab/time/damping and pauses playback |
| Practice check | Three blank numeric responses, individual grading, Inspect this state action | Target prefilled display replaced by real checking; fixed default scenario explicit |
| Learn / practice | Correct exact formula, initial-condition interpretation, speed-at-equilibrium clarification, presets for omega=3 and damping=.2 | Corrects 'velocity is largest' to speed; acceleration-opposes-displacement restricted to undamped motion |
| Presentation / navigation | Dedicated spring/readouts, stacked graph rows, phase/energy row, controls and supporting panels | Exact typography, shell/footer, spring art, chart labels, dimensions, responsive layout and image parity unverified; next Gamma Function catalog entry verified |

## Verification

- Eight focused Vitest tests passed: seven mathematical tests plus one initial-markup test.
- Default instantaneous values, period and energy split checked.
- Both initial conditions checked across all damping regimes, including values near critical damping.
- Numerical derivative residuals validate x'=v and v'=a against the stated damped equation.
- Undamped energy conservation and phase ellipse invariant checked throughout sample arrays.
- Monotone damped energy loss, zero-motion state and all parameter-boundary combinations checked.
- Practice accepts correct three-decimal values, rejects blank inputs and incorrect velocity sign.
- Initial markup confirms default synchronized readouts, five sliders, no pregraded answer, no KaTeX error, and valid next catalog route.
- Targeted strict TypeScript and focused ESLint passed after final meter-range edit.
- Dedicated route test reported one pass, 229 unrelated cases skipped.
- Captured desktop evidence: `artifacts/studio-control-audit/0914-current.png`.
- One-by-one browser acceptance: opened the advanced route, changed the natural-frequency slider from 0.1 to 2, and verified the control state updated while the oscillator studio remained rendered.
- Focused surface/model tests pass: `OscillatorSurface.test.tsx` and `oscillatorLessonModel.test.ts` (8 tests).

Next sequential target: 0915 / 2021 Gamma Function.
