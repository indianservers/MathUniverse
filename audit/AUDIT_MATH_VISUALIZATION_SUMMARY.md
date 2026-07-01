# Math Visualization Audit Summary

Generated on 2026-06-30 from audit/AUDIT_MATH_VISUALIZATION_INDEX.md.

## Counts

| Metric | Count |
|---|---:|
| Total visualizations found | 367 |
| Number fully audited | 123 |
| Number partially audited | 43 |
| Number broken | 2 |
| Number placeholder/missing | 202 |
| Number with critical math issues | 2 |
| Number with Grade 6 usability issues | 209 |

## Top 10 Critical Issues

1. Inquiry Simulation Labs: Visualization is placeholder or not educationally complete. (High)
2. Function Graph Canvas: Pointer interaction appears to lack keyboard equivalent. (High)
3. Algebraic Structures Module: Pointer interaction appears to lack keyboard equivalent. (High)
4. Combinatorics Module: Visualization is placeholder or not educationally complete. (High)
5. Combinatorics Module: Pointer interaction appears to lack keyboard equivalent. (High)
6. Discrete World Module: Pointer interaction appears to lack keyboard equivalent. (High)
7. Graph Theory Module: Pointer interaction appears to lack keyboard equivalent. (High)
8. Magic Maths Module: Pointer interaction appears to lack keyboard equivalent. (High)
9. Mathematical Logic Module: Visualization is placeholder or not educationally complete. (High)
10. Mathematical Logic Module: Pointer interaction appears to lack keyboard equivalent. (High)

## Top 10 UI/UX Issues

1. Inquiry Simulation Labs: Visualization is placeholder or not educationally complete. (High)
2. Function Graph Canvas: Pointer interaction appears to lack keyboard equivalent. (High)
3. Algebraic Structures Module: Pointer interaction appears to lack keyboard equivalent. (High)
4. Combinatorics Module: Visualization is placeholder or not educationally complete. (High)
5. Combinatorics Module: Pointer interaction appears to lack keyboard equivalent. (High)
6. Discrete World Module: Pointer interaction appears to lack keyboard equivalent. (High)
7. Graph Theory Module: Pointer interaction appears to lack keyboard equivalent. (High)
8. Magic Maths Module: Pointer interaction appears to lack keyboard equivalent. (High)
9. Mathematical Logic Module: Visualization is placeholder or not educationally complete. (High)
10. Mathematical Logic Module: Pointer interaction appears to lack keyboard equivalent. (High)

## Top 10 Grade 6 Learning Issues

1. Discrete World Module: Not suitable for Grade 6 without guided teacher support. Add a concrete first task, simpler language, and a teacher-led sequence.
2. Graph Theory Module: Not suitable for Grade 6 without guided teacher support. Add a concrete first task, simpler language, and a teacher-led sequence.
3. Mathematical Logic Module: Not suitable for Grade 6 without guided teacher support. Add a concrete first task, simpler language, and a teacher-led sequence.
4. Set Theory Module: Not suitable for Grade 6 without guided teacher support. Add a concrete first task, simpler language, and a teacher-led sequence.
5. Advanced Syllabus Lab Page: Not suitable for Grade 6 without guided teacher support. Add a concrete first task, simpler language, and a teacher-led sequence.
6. Board Syllabus Visualizer: Not suitable for Grade 6 without guided teacher support. Add a concrete first task, simpler language, and a teacher-led sequence.
7. Calculus: Not suitable for Grade 6 without guided teacher support. Add a concrete first task, simpler language, and a teacher-led sequence.
8. Complex Numbers: Not suitable for Grade 6 without guided teacher support. Add a concrete first task, simpler language, and a teacher-led sequence.
9. Derivatives Tangent Visualizer: Not suitable for Grade 6 without guided teacher support. Add a concrete first task, simpler language, and a teacher-led sequence.
10. Eigenvectors Visualizer Page: Not suitable for Grade 6 without guided teacher support. Add a concrete first task, simpler language, and a teacher-led sequence.

## Best Visualizations

1. Function Graph Canvas - 7/10 (src/components/math-lab/FunctionGraphCanvas.tsx)
2. Algebraic Structures Module - 7/10 (src/modules/algebraic-structures/AlgebraicStructuresModule.tsx)
3. Magic Maths Module - 7/10 (src/modules/magic-maths/MagicMathsModule.tsx)
4. AIApplications - 7/10 (src/pages/AIApplications.tsx)
5. Algebra - 7/10 (src/pages/Algebra.tsx)
6. Circle To Triangle Visualization - 7/10 (src/pages/CircleToTriangleVisualization.tsx)
7. Concept Dependency Graph - 7/10 (src/pages/ConceptDependencyGraph.tsx)
8. Functions Graphs Visualizer - 7/10 (src/pages/FunctionsGraphsVisualizer.tsx)
9. Geometry - 7/10 (src/pages/Geometry.tsx)
10. Geometry Concept Page - 7/10 (src/pages/GeometryConceptPage.tsx)

## Weakest Visualizations

1. Limits Continuity Visualizer - 3/10 (src/pages/LimitsContinuityVisualizer.tsx)
2. Math Workspace - 3/10 (src/pages/MathWorkspace.tsx)
3. Mathematical Logic Module - 4/10 (src/modules/mathematical-logic/MathematicalLogicModule.tsx)
4. Engineering Math - 4/10 (src/pages/EngineeringMath.tsx)
5. Graph Theory - 4/10 (src/pages/GraphTheory.tsx)
6. Math Visual Dictionary - 4/10 (src/pages/MathVisualDictionary.tsx)
7. Set Theory - 4/10 (src/pages/SetTheory.tsx)
8. Shapes Explorer - 4/10 (src/pages/ShapesExplorer.tsx)
9. Truth Table Generator - 4/10 (src/pages/TruthTableGenerator.tsx)
10. Workspace Data - 4/10 (src/pages/WorkspaceData.tsx)

## Repeated Problems Across The App

- Missing adjacent tests: 357
- Grade 6 support needed: 209
- Pointer interaction without keyboard evidence: 114
- Placeholder or incomplete educational surface: 202
- Formula edge-case guards not evident: 119
- Screen-reader labels not evident: 196
- Large component decomposition needed: 14

## Recommended Fix Roadmap

1. Repair broken/missing educational surfaces and any route/import failures first.
2. Add math edge-case guards for formula-heavy visualizations.
3. Add Grade 6-friendly first tasks, prediction prompts, and misconception checks.
4. Add keyboard/numeric alternatives for drag and pointer-only interactions.
5. Add adjacent tests for math kernels and representative rendering states.
