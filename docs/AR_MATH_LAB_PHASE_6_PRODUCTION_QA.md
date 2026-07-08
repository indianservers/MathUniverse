# AR Math Lab Phase 6 Production QA

## Overview

AR Math Lab is a pure browser-based Augmented Reality / Mixed Reality / XR math workspace for visualizing 3D graphs, parametric curves and surfaces, real-dimension solids, coordinate systems, measurements, formulas, animations, and guided classroom explanations.

## Supported Modes

- **AR Mode**: Uses WebXR `immersive-ar` when the browser, device, and secure context support it.
- **Camera Preview Mode**: Uses the device camera as an overlay preview when true WebXR AR is unavailable.
- **3D Preview Mode**: Uses the existing Three.js preview renderer and works without camera or WebXR support.

## Browser Requirements

- WebXR AR requires a compatible mobile browser/device and HTTPS or secure localhost.
- Desktop Chrome, Edge, Firefox, and Safari should fall back to 3D Preview Mode when immersive AR is unavailable.
- iOS Safari commonly lacks immersive WebXR AR support, so Camera Preview or 3D Preview should remain available.

## Supported Equation Formats

- Explicit surfaces: `z = sin(x) * sin(y)`, `z = x^2 + y^2`
- Parametric curves: `x = cos(t), y = sin(t), z = t`
- Parametric surfaces: `x = (R + r*cos(v))*cos(u), y = (R + r*cos(v))*sin(u), z = r*sin(v)`
- Recognized implicit shapes: sphere, cylinder, cone patterns

Unsafe code-like input is rejected. The graph generator uses a restricted math parser, not `eval` or `new Function`.

## Supported Geometry Solids

Cube, cuboid, cylinder, cone, sphere, hemisphere, prism, pyramid, frustum, and torus are supported with formula panels, dimension labels, AR meter conversion, scale modes, and cross-section controls.

## Units and Scale

Supported units: `mm`, `cm`, `m`, `inch`, `ft`.

Real dimensions are preserved in formulas. Display scale only changes how the object fits into AR or 3D Preview.

## Measurement and Animation

Measurement tools include distance, height, radius, diameter, slant height, angle, point coordinate, surface value, and cross-section dimension placeholders.

Animations support rotation and cross-section movement in Phase 6. Animations pause when the tab becomes hidden and are removed when their object is deleted.

## Performance Recommendations

- Keep surface resolution near 50-60 for mobile.
- Use Performance Mode on low-end devices.
- Avoid high quality solids when camera preview is active.
- Prefer 3D Preview Mode for complex classroom projection.

## Known Limitations

- True spatial anchoring depends on WebXR support and is still browser/device dependent.
- Camera Preview Mode is overlay-based and does not provide true world anchoring.
- Complex arbitrary implicit surfaces are not fully rendered.
- Very high mesh resolutions can slow mobile devices.

## Manual QA Checklist

### Route and Navigation
- [ ] AR Math Lab appears in navigation/module index.
- [ ] `/modules/ar-math-lab` loads without crash.
- [ ] Existing modules still load.

### AR / Camera / Fallback
- [ ] Desktop Chrome shows 3D Preview fallback.
- [ ] Android Chrome over HTTPS detects AR where supported.
- [ ] Camera Preview Mode starts after permission.
- [ ] Camera denied shows helpful error.
- [ ] Exit Camera stops camera indicator.
- [ ] Exit AR ends session safely.
- [ ] Insecure HTTP shows HTTPS warning.

### Equation Graphs
- [ ] `z = sin(x) * sin(y)` renders.
- [ ] `z = x^2 + y^2` renders.
- [ ] `z = x^2 - y^2` renders.
- [ ] Parametric helix renders.
- [ ] Torus parametric surface renders.
- [ ] Parameter sliders update graph.
- [ ] Invalid equations show safe error.

### Geometry
- [ ] Cone `5 cm x 12 cm` renders and formulas are correct.
- [ ] Cylinder `4 cm x 10 cm` renders and formulas are correct.
- [ ] Cuboid `10 x 6 x 4 cm` renders and formulas are correct.
- [ ] Cube side `5 cm` renders and formulas are correct.
- [ ] Sphere radius `5 cm` renders and formulas are correct.
- [ ] Hemisphere radius `6 cm` renders and formulas are correct.
- [ ] Frustum renders and formulas are correct.
- [ ] Torus renders and formulas are correct.
- [ ] Unit conversion works.
- [ ] Scale modes preserve original dimensions.

### Measurement
- [ ] Distance measurement works.
- [ ] Angle measurement works.
- [ ] Radius/diameter labels work.
- [ ] Surface value inspection shows a text fallback.
- [ ] Clear measurements works.

### Animation
- [ ] Rotation animation works.
- [ ] Cross-section sweep works.
- [ ] Animation stops when object is deleted.
- [ ] Animation pauses on tab hidden.

### Learning / Classroom
- [ ] Guided learning cards appear.
- [ ] Teacher Mode enlarges formula/explanation.
- [ ] Comparison Mode works for cone vs cylinder.
- [ ] Intelligent suggestions appear.

### Scene Save/Load
- [ ] Save scene works.
- [ ] Load scene works.
- [ ] Export JSON works.
- [ ] Import valid JSON works.
- [ ] Invalid JSON shows error.
- [ ] Screenshot capture works in 3D Preview where supported.

### Performance
- [ ] Mobile default graph is smooth.
- [ ] High resolution warning appears.
- [ ] Performance Mode improves speed.
- [ ] Memory does not grow excessively after deleting/regenerating objects.
- [ ] Camera tracks stop on exit.

### Accessibility
- [ ] Buttons have labels.
- [ ] Inputs have labels.
- [ ] Sliders have labels/values.
- [ ] Errors are readable text.
- [ ] Keyboard navigation works where feasible.
- [ ] Focus states are visible.
