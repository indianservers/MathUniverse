# Euler cursor enhancements

Implemented for Unit Circle, Projections, and Taylor views.

1. Click the unit-circle diagram to set the angle.
2. Drag across the unit-circle diagram.
3. Scrub the XY projection with the cursor.
4. Scrub the XZ projection with the cursor.
5. Scrub the YZ projection with the cursor.
6. Select phase along the projected 3D helix.
7. Drag the Taylor 2D diagram to change angle.
8. Scrub Taylor 3D phase horizontally.
9. Use pane-aware cursor controls in Taylor Both view.
10. Touch and stylus pointer support.
11. Pointer capture keeps a drag active outside the diagram.
12. Live cursor angle preview.
13. Direct angle edits pause animation.
14. Visible dragging status.
15. Crosshair and grabbing cursors.
16. Arrow keys adjust the angle by five degrees.
17. Shift and arrow keys make one-degree adjustments.
18. Home and End jump to zero and 360 degrees.
19. Double-click resets the angle.
20. Unit-circle center dead zone prevents accidental angle jumps.
21. Unit-circle angle continuity across revolutions.
22. Snapping at 15, 30, 45, or 90 degrees.
23. Eight common-angle shortcuts.
24. Cursor interaction toggle.
25. Undo angle changes.
26. Redo angle changes.
27. Live degrees and radians.
28. Live sine and cosine.
29. Quadrant and axis readout.
30. Select Taylor partial sums in 2D.
31. Partial-sum coordinate tooltips.
32. Larger invisible hit targets for partial sums.
33. Keyboard activation of partial sums.
34. Add or remove Taylor terms within safe limits.
35. Taylor precision presets.
36. Visible keyboard focus.
37. Accessible angle slider values.
38. Responsive controls for mobile widths.
39. Reduced-motion styling.
40. Escape cancels an active drag.
41. Instructions specific to Taylor 2D, 3D, and Both views.

Validation: 65 tests across 13 relevant test files passed; production build passed. Browser checks verified actual mouse dragging in Unit Circle, XY Projections, and Taylor 2D; keyboard angle edits, snapping, undo, partial-sum selection, and mobile controls were also checked.

