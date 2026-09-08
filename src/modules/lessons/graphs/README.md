# Shared lesson graphs

These components are opt-in renderers for lessons. They do not replace or style the main 2D workspace. Styles live in `lessonGraph.css` under lesson-specific selectors.

`LessonGraphWorkspace` provides the heading, legend, navigation toolbar, optional controls and observation panel. `LessonCartesianGraph` projects supplied points, sampled paths, regions and annotations; it does not parse formulas, fit data or generate samples. `LessonPolarGraph` uses the same navigation/projection and equal coordinate units with a dedicated polar grid. Number lines, bar/dot charts, dependency diagrams and schematic previews have their own focused adapters.

The lesson owns its values, formulas, domain sampling, missing-value breaks, bounds, colors, calculations, reset state and callbacks. Supply null samples at discontinuities. Set series `kind` to `points` or `region` where applicable. Custom `dashPattern` and `dashed` are reflected in the legend. A `unitAspectRatio` is only appropriate when the source fixes the ratio of coordinate units; statistics axes usually have different units.

Annotation `onChange` opts into point dragging and arrow-key editing. Apply the lesson's original snapping and bounds in that callback. Read-only points still support inspection. The shared projection is used for both drawing and pointer input. Labels wrap, move to avoid other labels, and connect back to their point. Put changing readouts in `observation` rather than changing the heading height during a drag.

Pass `view`, `onViewChange` and `onResetView` for navigation. View reset and lesson reset are separate: the lesson determines whether its reset also restores parameter values. The renderer never invents a default dataset or parameter range.

Migration status and browser evidence are tracked in `docs/GRAPH_SHARED_ENGINE_MIGRATION.md`. Legacy renderers remain while any inventory consumer still needs them. A lesson is verified through its mathematical/control checks and desktop/tablet/mobile screenshots, not by compilation alone.
