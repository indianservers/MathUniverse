# Phase 01 Visual Proof QA Checklist

Use this checklist for each shell-ready proof until browser visual regression tests are added.

## Route Load

- Open the route directly.
- Confirm the page does not show an error overlay.
- Confirm the title is visible.
- Confirm the category breadcrumb is visible.

## Primary Visual

- Confirm the primary visual area is visible.
- Confirm the visual is not blank.
- Confirm the visual has an accessible label or useful surrounding text.
- Confirm controls do not cover the visual.

## Controls

- Confirm previous, next, reset, labels, and formula controls are visible.
- Confirm keyboard tab reaches every interactive control.
- Confirm sliders work with keyboard arrow keys.
- Confirm reset returns the proof to its default state.

## Timeline

- Confirm the active step is visually distinct.
- Confirm completed, current, and locked states are readable.
- Confirm clicking a step updates the visual.
- Confirm keyboard focus is visible on each step button.

## Formula and Inspector

- Confirm formula text updates with parameter changes.
- Confirm exact and rounded values are not mixed.
- Confirm invariants are shown in plain language.
- Confirm the state inspector can be expanded and collapsed.

## Mobile

- Test at a narrow mobile viewport.
- Confirm the canvas, timeline, formula panel, and controls stack without overlap.
- Confirm long formula text wraps or stays inside its panel.
- Confirm critical labels remain readable.

## Reduced Motion and Contrast

- Enable reduced motion and confirm auto-play does not start.
- Confirm the proof remains usable with next/previous controls.
- Confirm dark mode remains readable.
- Confirm high-contrast colors maintain visible borders, labels, and active state.

## Demo Route For Phase 1

- `/visual-proofs/sequences-and-series/sum-first-n-natural-numbers`
- Expected title: `Sum of First n Natural Numbers`.
- Expected visual: staircase cells, duplicate staircase after step 3, rectangle after step 5.
- Expected controls: play, reset, previous, next, labels toggle, formula toggle, reveal, challenge, teacher.
- Expected inspector: term count, duplicate toggle, staircase count, rectangle count, invariant.
