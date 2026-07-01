# Math Visualization Audit Index

Generated from source discovery on 2026-06-30.

## Project Discovery Summary

- Framework: React 18 + TypeScript + Vite, with React Router routes in src/App.tsx.
- Main entry files: src/main.tsx, src/App.tsx, src/index.css.
- Visualization locations: src/visualizations, src/visual-proofs/proofs, src/modules, selected math visualization route pages in src/pages, and shared graph/inquiry components.
- Major rendering methods found: SVG, canvas, Recharts, Three.js/react-three, draggable pointer interactions, sliders, form inputs, KaTeX/math text, and route-level tabbed labs.
- Scope note: generic non-math pages such as About, Documentation, Sitemap, and ordinary quiz pages were excluded unless they directly host a visualization.

| No. | Visualization Name | File Path | Route/Page | Concept | Status |
|---|---|---|---|---|---|
| 1 | Inquiry Simulation Labs | src/components/inquiry/InquirySimulationLabs.tsx | / | Math | Missing / Placeholder |
| 2 | Function Graph Canvas | src/components/math-lab/FunctionGraphCanvas.tsx | /math-lab/graphing-calculator | Math | Partially Audited |
| 3 | Algebraic Structures Module | src/modules/algebraic-structures/AlgebraicStructuresModule.tsx | Embedded/shared | algebraic structures | Audited |
| 4 | Combinatorics Module | src/modules/combinatorics/CombinatoricsModule.tsx | Embedded/shared | combinatorics | Missing / Placeholder |
| 5 | Discrete World Module | src/modules/discrete-world/DiscreteWorldModule.tsx | Embedded/shared | discrete world | Audited |
| 6 | Graph Theory Module | src/modules/graph-theory/GraphTheoryModule.tsx | Embedded/shared | graph theory | Audited |
| 7 | Magic Maths Module | src/modules/magic-maths/MagicMathsModule.tsx | Embedded/shared | magic maths | Audited |
| 8 | Mathematical Logic Module | src/modules/mathematical-logic/MathematicalLogicModule.tsx | Embedded/shared | mathematical logic | Missing / Placeholder |
| 9 | Set Theory Module | src/modules/set-theory/SetTheoryModule.tsx | Embedded/shared | set theory | Audited |
| 10 | Advanced Syllabus Lab Page | src/pages/AdvancedSyllabusLabPage.tsx | /syllabus-lab/:labId | route page | Audited |
| 11 | AIApplications | src/pages/AIApplications.tsx | /ai-applications | route page | Audited |
| 12 | Algebra | src/pages/Algebra.tsx | /algebra | route page | Audited |
| 13 | Algebraic Structures | src/pages/AlgebraicStructures.tsx | /algebraic-structures | route page | Audited |
| 14 | Board Syllabus Visualizer | src/pages/BoardSyllabusVisualizer.tsx | /syllabus-visual/:topicId | route page | Audited |
| 15 | Calculus | src/pages/Calculus.tsx | /calculus | route page | Audited |
| 16 | Circle To Triangle Visualization | src/pages/CircleToTriangleVisualization.tsx | /circle-to-triangle, /visual-proofs/geometry/circle-to-triangle | route page | Audited |
| 17 | Combinatorics | src/pages/Combinatorics.tsx | /combinatorics | route page | Audited |
| 18 | Complex Numbers | src/pages/ComplexNumbers.tsx | /complex-numbers | route page | Audited |
| 19 | Concept Dependency Graph | src/pages/ConceptDependencyGraph.tsx | /concept-graph | route page | Audited |
| 20 | Derivatives Tangent Visualizer | src/pages/DerivativesTangentVisualizer.tsx | /math/derivatives | route page | Audited |
| 21 | Discrete World | src/pages/DiscreteWorld.tsx | /discrete-world | route page | Audited |
| 22 | Eigenvectors Visualizer Page | src/pages/EigenvectorsVisualizerPage.tsx | /math/eigenvectors | route page | Audited |
| 23 | Engineering Math | src/pages/EngineeringMath.tsx | /engineering-math | route page | Missing / Placeholder |
| 24 | Formula Library Page | src/pages/FormulaLibraryPage.tsx | Embedded/shared | route page | Missing / Placeholder |
| 25 | Formulas | src/pages/Formulas.tsx | /formulas, /formulas/:categorySlug | route page | Audited |
| 26 | Fourier Series Animator | src/pages/FourierSeriesAnimator.tsx | /fourier-animator | route page | Audited |
| 27 | Fourier Series Visualizer Page | src/pages/FourierSeriesVisualizerPage.tsx | /math/fourier-series | route page | Audited |
| 28 | Functions Graphs Visualizer | src/pages/FunctionsGraphsVisualizer.tsx | /math/functions-graphs | route page | Audited |
| 29 | Geometry | src/pages/Geometry.tsx | /geometry | route page | Audited |
| 30 | Geometry Concept Page | src/pages/GeometryConceptPage.tsx | /geometry/:conceptId | route page | Audited |
| 31 | Graph Comparison Mode | src/pages/GraphComparisonMode.tsx | /graph-comparison | route page | Audited |
| 32 | Graph Theory | src/pages/GraphTheory.tsx | /graph-theory | route page | Audited |
| 33 | Integration Area Visualizer Page | src/pages/IntegrationAreaVisualizerPage.tsx | /math/integration | route page | Audited |
| 34 | Limits Continuity Visualizer | src/pages/LimitsContinuityVisualizer.tsx | /math/limits-continuity | route page | Audited |
| 35 | Linear Algebra | src/pages/LinearAlgebra.tsx | /linear-algebra | route page | Audited |
| 36 | Magic Maths | src/pages/MagicMaths.tsx | /magic-maths | route page | Audited |
| 37 | Math Lab | src/pages/MathLab.tsx | /math-lab | route page | Missing / Placeholder |
| 38 | Math Lab3 DGraphing | src/pages/MathLab3DGraphing.tsx | /math-lab/3d-graphing | route page | Audited |
| 39 | Math Lab Conic Solver | src/pages/MathLabConicSolver.tsx | /math-lab/conics | route page | Audited |
| 40 | Math Lab Function Explorer | src/pages/MathLabFunctionExplorer.tsx | /math-lab/function-explorer | route page | Audited |
| 41 | Math Lab Graphing Calculator | src/pages/MathLabGraphingCalculator.tsx | /math-lab/graphing-calculator | route page | Audited |
| 42 | Math Lab Linear Algebra | src/pages/MathLabLinearAlgebra.tsx | /math-lab/linear-algebra | route page | Audited |
| 43 | Math Lab Probability | src/pages/MathLabProbability.tsx | /math-lab/probability | route page | Audited |
| 44 | Math Lab Tool Page | src/pages/MathLabToolPage.tsx | /math-lab/:toolId | route page | Audited |
| 45 | Math Visual Dictionary | src/pages/MathVisualDictionary.tsx | /visual-dictionary | route page | Missing / Placeholder |
| 46 | Math Visualization Page | src/pages/MathVisualizationPage.tsx | /math/:visualizationId | route page | Audited |
| 47 | Math Workspace | src/pages/MathWorkspace.tsx | /workspace | route page | Missing / Placeholder |
| 48 | Matrix Operation Page | src/pages/MatrixOperationPage.tsx | /matrices/:operationId | route page | Audited |
| 49 | Matrix Operations | src/pages/MatrixOperations.tsx | /matrices | route page | Audited |
| 50 | Matrix Operations Sandbox | src/pages/MatrixOperationsSandbox.tsx | /matrix-sandbox | route page | Audited |
| 51 | Matrix Transformations Visualizer Page | src/pages/MatrixTransformationsVisualizerPage.tsx | /math/matrix-transformations | route page | Audited |
| 52 | NCERTConcept Page | src/pages/NCERTConceptPage.tsx | /ncert/:conceptId | route page | Audited |
| 53 | Number Systems | src/pages/NumberSystems.tsx | /number-systems | route page | Audited |
| 54 | Parametric Curve Explorer | src/pages/ParametricCurveExplorer.tsx | /parametric-curves | route page | Audited |
| 55 | Permutations Combinations Visualizer | src/pages/PermutationsCombinationsVisualizer.tsx | /math/permutations-combinations | route page | Audited |
| 56 | Polar Coordinates Visualizer | src/pages/PolarCoordinatesVisualizer.tsx | /polar-visualizer | route page | Audited |
| 57 | Probability Statistics | src/pages/ProbabilityStatistics.tsx | /statistics, /probability-statistics | route page | Audited |
| 58 | Set Theory | src/pages/SetTheory.tsx | /set-theory, /set-theory/:pageSlug | route page | Audited |
| 59 | Shapes Explorer | src/pages/ShapesExplorer.tsx | /shapes | route page | Missing / Placeholder |
| 60 | Slope Fields Visualizer Page | src/pages/SlopeFieldsVisualizerPage.tsx | /math/slope-fields | route page | Audited |
| 61 | Surface Plotter3 D | src/pages/SurfacePlotter3D.tsx | /surface-plotter | route page | Audited |
| 62 | Syllabus Visual Page | src/pages/SyllabusVisualPage.tsx | /syllabus-visual-v2/:slug | route page | Missing / Placeholder |
| 63 | Trigonometry | src/pages/Trigonometry.tsx | /trigonometry | route page | Audited |
| 64 | Trigonometry Concept Page | src/pages/TrigonometryConceptPage.tsx | /trigonometry/:conceptId | route page | Audited |
| 65 | Truth Table Generator | src/pages/TruthTableGenerator.tsx | /mathematical-logic, /truth-table | route page | Audited |
| 66 | Visual Showcase | src/pages/VisualShowcase.tsx | /visual-showcase | route page | Audited |
| 67 | Workspace3 D | src/pages/Workspace3D.tsx | /workspace/3d | route page | Audited |
| 68 | Workspace Data | src/pages/WorkspaceData.tsx | /workspace/data, /workspace/data/spreadsheet, /workspace/data/analysis, /workspace/data/cas, /workspace/data/results, /workspace/data/objects | route page | Audited |
| 69 | Workspace Geometry | src/pages/WorkspaceGeometry.tsx | /workspace/geometry | route page | Audited |
| 70 | Workspace Graph | src/pages/WorkspaceGraph.tsx | /workspace/graph | route page | Audited |
| 71 | Algebra Proof Configs | src/visual-proofs/proofs/algebra/algebraProofConfigs.ts | /visual-proofs/:categorySlug/:proofSlug | algebra | Partially Audited |
| 72 | Algebra Proof Template | src/visual-proofs/proofs/algebra/AlgebraProofTemplate.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Partially Audited |
| 73 | Completing The Square Proof | src/visual-proofs/proofs/algebra/CompletingTheSquareProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 74 | Cube Of Difference Proof | src/visual-proofs/proofs/algebra/CubeOfDifferenceProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 75 | Cube Of Sum Proof | src/visual-proofs/proofs/algebra/CubeOfSumProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 76 | Difference Of Squares Proof | src/visual-proofs/proofs/algebra/DifferenceOfSquaresProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 77 | Distributive Law Area Model Proof | src/visual-proofs/proofs/algebra/DistributiveLawAreaModelProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 78 | Perfect Square Trinomial Recognition Proof | src/visual-proofs/proofs/algebra/PerfectSquareTrinomialRecognitionProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 79 | Product Of Binomials Proof | src/visual-proofs/proofs/algebra/ProductOfBinomialsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 80 | Quadratic Factorization Area Model Proof | src/visual-proofs/proofs/algebra/QuadraticFactorizationAreaModelProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 81 | Square Of Difference Proof | src/visual-proofs/proofs/algebra/SquareOfDifferenceProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 82 | Square Of Sum Proof | src/visual-proofs/proofs/algebra/SquareOfSumProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 83 | Sum And Difference Product Proof | src/visual-proofs/proofs/algebra/SumAndDifferenceProductProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 84 | Three Term Square Proof | src/visual-proofs/proofs/algebra/ThreeTermSquareProof.tsx | /visual-proofs/:categorySlug/:proofSlug | algebra | Audited |
| 85 | Calculus Proof Configs | src/visual-proofs/proofs/calculus/calculusProofConfigs.ts | /visual-proofs/:categorySlug/:proofSlug | calculus | Partially Audited |
| 86 | Calculus Proof Template | src/visual-proofs/proofs/calculus/CalculusProofTemplate.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Partially Audited |
| 87 | Chain Rule Visual Proof | src/visual-proofs/proofs/calculus/ChainRuleVisualProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 88 | Definite Integral Accumulated Area Proof | src/visual-proofs/proofs/calculus/DefiniteIntegralAccumulatedAreaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 89 | Derivative Of Exponential Proof | src/visual-proofs/proofs/calculus/DerivativeOfExponentialProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 90 | Derivative Of Sine Proof | src/visual-proofs/proofs/calculus/DerivativeOfSineProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 91 | Derivative Power Rule Proof | src/visual-proofs/proofs/calculus/DerivativePowerRuleProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 92 | Derivative Slope Of Tangent Proof | src/visual-proofs/proofs/calculus/DerivativeSlopeOfTangentProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 93 | Fundamental Theorem Calculus Proof | src/visual-proofs/proofs/calculus/FundamentalTheoremCalculusProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 94 | Integration By Parts Visual Proof | src/visual-proofs/proofs/calculus/IntegrationByPartsVisualProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 95 | Limit Approaches Point Proof | src/visual-proofs/proofs/calculus/LimitApproachesPointProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 96 | Mean Value Theorem Proof | src/visual-proofs/proofs/calculus/MeanValueTheoremProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 97 | Optimization Derivative Max Min Proof | src/visual-proofs/proofs/calculus/OptimizationDerivativeMaxMinProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 98 | Product Rule Visual Proof | src/visual-proofs/proofs/calculus/ProductRuleVisualProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 99 | Riemann Sums Area Under Curve Proof | src/visual-proofs/proofs/calculus/RiemannSumsAreaUnderCurveProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 100 | Secant Becomes Tangent Proof | src/visual-proofs/proofs/calculus/SecantBecomesTangentProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 101 | Taylor Series Approximation Proof | src/visual-proofs/proofs/calculus/TaylorSeriesApproximationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | calculus | Audited |
| 102 | Circle Area Unrolling Proof | src/visual-proofs/proofs/CircleAreaUnrollingProof.tsx | /visual-proofs/:categorySlug/:proofSlug | CircleAreaUnrollingProof.tsx | Audited |
| 103 | Complex Addition Vector Proof | src/visual-proofs/proofs/complex-numbers/ComplexAdditionVectorProof.tsx | /visual-proofs/:categorySlug/:proofSlug | complex numbers | Audited |
| 104 | Complex Conjugate Reflection Proof | src/visual-proofs/proofs/complex-numbers/ComplexConjugateReflectionProof.tsx | /visual-proofs/:categorySlug/:proofSlug | complex numbers | Audited |
| 105 | Complex Multiplication Rotation Scaling Proof | src/visual-proofs/proofs/complex-numbers/ComplexMultiplicationRotationScalingProof.tsx | /visual-proofs/:categorySlug/:proofSlug | complex numbers | Audited |
| 106 | Complex Number Plane Point Proof | src/visual-proofs/proofs/complex-numbers/ComplexNumberPlanePointProof.tsx | /visual-proofs/:categorySlug/:proofSlug | complex numbers | Audited |
| 107 | Euler Form Unit Circle Proof | src/visual-proofs/proofs/complex-numbers/EulerFormUnitCircleProof.tsx | /visual-proofs/:categorySlug/:proofSlug | complex numbers | Audited |
| 108 | Modulus And Argument Proof | src/visual-proofs/proofs/complex-numbers/ModulusAndArgumentProof.tsx | /visual-proofs/:categorySlug/:proofSlug | complex numbers | Audited |
| 109 | Multiplication By IRotation Proof | src/visual-proofs/proofs/complex-numbers/MultiplicationByIRotationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | complex numbers | Audited |
| 110 | Roots Of Unity Proof | src/visual-proofs/proofs/complex-numbers/RootsOfUnityProof.tsx | /visual-proofs/:categorySlug/:proofSlug | complex numbers | Audited |
| 111 | Circle Locus Equal Distance Proof | src/visual-proofs/proofs/conic-sections/CircleLocusEqualDistanceProof.tsx | /visual-proofs/:categorySlug/:proofSlug | conic sections | Audited |
| 112 | Cone Slicing Conics Proof | src/visual-proofs/proofs/conic-sections/ConeSlicingConicsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | conic sections | Audited |
| 113 | Directrix Focus Standard Equations Proof | src/visual-proofs/proofs/conic-sections/DirectrixFocusStandardEquationsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | conic sections | Audited |
| 114 | Eccentricity Classification Proof | src/visual-proofs/proofs/conic-sections/EccentricityClassificationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | conic sections | Audited |
| 115 | Ellipse Sum Of Distances Proof | src/visual-proofs/proofs/conic-sections/EllipseSumOfDistancesProof.tsx | /visual-proofs/:categorySlug/:proofSlug | conic sections | Audited |
| 116 | Hyperbola Difference Of Distances Proof | src/visual-proofs/proofs/conic-sections/HyperbolaDifferenceOfDistancesProof.tsx | /visual-proofs/:categorySlug/:proofSlug | conic sections | Audited |
| 117 | Parabola Focus Directrix Proof | src/visual-proofs/proofs/conic-sections/ParabolaFocusDirectrixProof.tsx | /visual-proofs/:categorySlug/:proofSlug | conic sections | Audited |
| 118 | Parabola Reflective Property Proof | src/visual-proofs/proofs/conic-sections/ParabolaReflectivePropertyProof.tsx | /visual-proofs/:categorySlug/:proofSlug | conic sections | Audited |
| 119 | Circle Equation Proof | src/visual-proofs/proofs/coordinate-geometry/CircleEquationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 120 | Coordinate Proof Configs | src/visual-proofs/proofs/coordinate-geometry/coordinateProofConfigs.ts | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Partially Audited |
| 121 | Coordinate Proof Pythagorean Proof | src/visual-proofs/proofs/coordinate-geometry/CoordinateProofPythagoreanProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 122 | Coordinate Proof Template | src/visual-proofs/proofs/coordinate-geometry/CoordinateProofTemplate.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Partially Audited |
| 123 | Distance Formula Proof | src/visual-proofs/proofs/coordinate-geometry/DistanceFormulaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 124 | Midpoint Formula Proof | src/visual-proofs/proofs/coordinate-geometry/MidpointFormulaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 125 | Parallel Lines Slope Proof | src/visual-proofs/proofs/coordinate-geometry/ParallelLinesSlopeProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 126 | Perpendicular Lines Slope Proof | src/visual-proofs/proofs/coordinate-geometry/PerpendicularLinesSlopeProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 127 | Point Slope Line Equation Proof | src/visual-proofs/proofs/coordinate-geometry/PointSlopeLineEquationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 128 | Reflection Across Axes Proof | src/visual-proofs/proofs/coordinate-geometry/ReflectionAcrossAxesProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 129 | Rotation About Origin Proof | src/visual-proofs/proofs/coordinate-geometry/RotationAboutOriginProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 130 | Scaling Dilation Origin Proof | src/visual-proofs/proofs/coordinate-geometry/ScalingDilationOriginProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 131 | Section Formula Proof | src/visual-proofs/proofs/coordinate-geometry/SectionFormulaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 132 | Slope Formula Proof | src/visual-proofs/proofs/coordinate-geometry/SlopeFormulaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 133 | Slope Intercept Line Equation Proof | src/visual-proofs/proofs/coordinate-geometry/SlopeInterceptLineEquationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 134 | Translation Of Points Proof | src/visual-proofs/proofs/coordinate-geometry/TranslationOfPointsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 135 | Triangle Area Coordinates Proof | src/visual-proofs/proofs/coordinate-geometry/TriangleAreaCoordinatesProof.tsx | /visual-proofs/:categorySlug/:proofSlug | coordinate geometry | Audited |
| 136 | Divergence Curl Vector Field Proof | src/visual-proofs/proofs/engineering-mathematics/DivergenceCurlVectorFieldProof.tsx | /visual-proofs/:categorySlug/:proofSlug | engineering mathematics | Audited |
| 137 | First Order Differential Equation Slope Field Proof | src/visual-proofs/proofs/engineering-mathematics/FirstOrderDifferentialEquationSlopeFieldProof.tsx | /visual-proofs/:categorySlug/:proofSlug | engineering mathematics | Audited |
| 138 | Fourier Series Wave Building Proof | src/visual-proofs/proofs/engineering-mathematics/FourierSeriesWaveBuildingProof.tsx | /visual-proofs/:categorySlug/:proofSlug | engineering mathematics | Audited |
| 139 | Gradient Steepest Increase Proof | src/visual-proofs/proofs/engineering-mathematics/GradientSteepestIncreaseProof.tsx | /visual-proofs/:categorySlug/:proofSlug | engineering mathematics | Audited |
| 140 | Laplace Transform Decay System Proof | src/visual-proofs/proofs/engineering-mathematics/LaplaceTransformDecaySystemProof.tsx | /visual-proofs/:categorySlug/:proofSlug | engineering mathematics | Audited |
| 141 | Linear Programming Feasible Region Proof | src/visual-proofs/proofs/engineering-mathematics/LinearProgrammingFeasibleRegionProof.tsx | /visual-proofs/:categorySlug/:proofSlug | engineering mathematics | Audited |
| 142 | Simple Harmonic Motion Proof | src/visual-proofs/proofs/engineering-mathematics/SimpleHarmonicMotionProof.tsx | /visual-proofs/:categorySlug/:proofSlug | engineering mathematics | Audited |
| 143 | Trapezoidal Rule Numerical Integration Proof | src/visual-proofs/proofs/engineering-mathematics/TrapezoidalRuleNumericalIntegrationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | engineering mathematics | Audited |
| 144 | Circle Circumference Unwrapping Proof | src/visual-proofs/proofs/geometry/CircleCircumferenceUnwrappingProof.tsx | /visual-proofs/:categorySlug/:proofSlug | geometry | Audited |
| 145 | Exterior Angle Theorem Proof | src/visual-proofs/proofs/geometry/ExteriorAngleTheoremProof.tsx | /visual-proofs/:categorySlug/:proofSlug | geometry | Audited |
| 146 | Geometry Proof Configs | src/visual-proofs/proofs/geometry/geometryProofConfigs.ts | /visual-proofs/:categorySlug/:proofSlug | geometry | Partially Audited |
| 147 | Geometry Proof Template | src/visual-proofs/proofs/geometry/GeometryProofTemplate.tsx | /visual-proofs/:categorySlug/:proofSlug | geometry | Partially Audited |
| 148 | Parallelogram Area Shearing Proof | src/visual-proofs/proofs/geometry/ParallelogramAreaShearingProof.tsx | /visual-proofs/:categorySlug/:proofSlug | geometry | Audited |
| 149 | Polygon Interior Angle Sum Proof | src/visual-proofs/proofs/geometry/PolygonInteriorAngleSumProof.tsx | /visual-proofs/:categorySlug/:proofSlug | geometry | Audited |
| 150 | Pythagorean Area Rearrangement Proof | src/visual-proofs/proofs/geometry/PythagoreanAreaRearrangementProof.tsx | /visual-proofs/:categorySlug/:proofSlug | geometry | Audited |
| 151 | Sector Area Formula Proof | src/visual-proofs/proofs/geometry/SectorAreaFormulaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | geometry | Audited |
| 152 | Similar Triangles Proof | src/visual-proofs/proofs/geometry/SimilarTrianglesProof.tsx | /visual-proofs/:categorySlug/:proofSlug | geometry | Audited |
| 153 | Trapezoid Area Duplication Proof | src/visual-proofs/proofs/geometry/TrapezoidAreaDuplicationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | geometry | Audited |
| 154 | Triangle Angle Sum Proof | src/visual-proofs/proofs/geometry/TriangleAngleSumProof.tsx | /visual-proofs/:categorySlug/:proofSlug | geometry | Audited |
| 155 | Triangle Area Half Rectangle Proof | src/visual-proofs/proofs/geometry/TriangleAreaHalfRectangleProof.tsx | /visual-proofs/:categorySlug/:proofSlug | geometry | Audited |
| 156 | Am Gm Inequality Proof | src/visual-proofs/proofs/inequalities/AmGmInequalityProof.tsx | /visual-proofs/:categorySlug/:proofSlug | inequalities | Audited |
| 157 | Cauchy Schwarz Dot Product Bound Proof | src/visual-proofs/proofs/inequalities/CauchySchwarzDotProductBoundProof.tsx | /visual-proofs/:categorySlug/:proofSlug | inequalities | Audited |
| 158 | Compound Inequalities Intervals Proof | src/visual-proofs/proofs/inequalities/CompoundInequalitiesIntervalsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | inequalities | Audited |
| 159 | Inequality Number Line Proof | src/visual-proofs/proofs/inequalities/InequalityNumberLineProof.tsx | /visual-proofs/:categorySlug/:proofSlug | inequalities | Audited |
| 160 | Linear Inequality Regions Proof | src/visual-proofs/proofs/inequalities/LinearInequalityRegionsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | inequalities | Audited |
| 161 | Quadratic Inequalities Graph Regions Proof | src/visual-proofs/proofs/inequalities/QuadraticInequalitiesGraphRegionsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | inequalities | Audited |
| 162 | Solving Linear Inequalities Proof | src/visual-proofs/proofs/inequalities/SolvingLinearInequalitiesProof.tsx | /visual-proofs/:categorySlug/:proofSlug | inequalities | Audited |
| 163 | Triangle Inequality Proof | src/visual-proofs/proofs/inequalities/TriangleInequalityProof.tsx | /visual-proofs/:categorySlug/:proofSlug | inequalities | Audited |
| 164 | Load Visual Proof Component | src/visual-proofs/proofs/loadVisualProofComponent.ts | /visual-proofs/:categorySlug/:proofSlug | loadVisualProofComponent.ts | Audited |
| 165 | Change Of Base Formula Proof | src/visual-proofs/proofs/logarithms-exponents/ChangeOfBaseFormulaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | logarithms exponents | Audited |
| 166 | Exponential Growth Decay Proof | src/visual-proofs/proofs/logarithms-exponents/ExponentialGrowthDecayProof.tsx | /visual-proofs/:categorySlug/:proofSlug | logarithms exponents | Audited |
| 167 | Exponents Repeated Multiplication Proof | src/visual-proofs/proofs/logarithms-exponents/ExponentsRepeatedMultiplicationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | logarithms exponents | Audited |
| 168 | Laws Of Exponents Same Base Proof | src/visual-proofs/proofs/logarithms-exponents/LawsOfExponentsSameBaseProof.tsx | /visual-proofs/:categorySlug/:proofSlug | logarithms exponents | Audited |
| 169 | Laws Of Logarithms Proof | src/visual-proofs/proofs/logarithms-exponents/LawsOfLogarithmsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | logarithms exponents | Audited |
| 170 | Logarithmic Scale Orders Magnitude Proof | src/visual-proofs/proofs/logarithms-exponents/LogarithmicScaleOrdersMagnitudeProof.tsx | /visual-proofs/:categorySlug/:proofSlug | logarithms exponents | Audited |
| 171 | Logarithm Inverse Exponential Proof | src/visual-proofs/proofs/logarithms-exponents/LogarithmInverseExponentialProof.tsx | /visual-proofs/:categorySlug/:proofSlug | logarithms exponents | Audited |
| 172 | Natural Exponential EProof | src/visual-proofs/proofs/logarithms-exponents/NaturalExponentialEProof.tsx | /visual-proofs/:categorySlug/:proofSlug | logarithms exponents | Audited |
| 173 | Determinant Area Scale Factor Proof | src/visual-proofs/proofs/matrices-linear-algebra/DeterminantAreaScaleFactorProof.tsx | /visual-proofs/:categorySlug/:proofSlug | matrices linear algebra | Audited |
| 174 | Eigenvectors Directions Do Not Turn Proof | src/visual-proofs/proofs/matrices-linear-algebra/EigenvectorsDirectionsDoNotTurnProof.tsx | /visual-proofs/:categorySlug/:proofSlug | matrices linear algebra | Audited |
| 175 | Linear System Line Intersection Proof | src/visual-proofs/proofs/matrices-linear-algebra/LinearSystemLineIntersectionProof.tsx | /visual-proofs/:categorySlug/:proofSlug | matrices linear algebra | Audited |
| 176 | Matrix Addition Cell By Cell Proof | src/visual-proofs/proofs/matrices-linear-algebra/MatrixAdditionCellByCellProof.tsx | /visual-proofs/:categorySlug/:proofSlug | matrices linear algebra | Audited |
| 177 | Matrix Inverse Undo Transformation Proof | src/visual-proofs/proofs/matrices-linear-algebra/MatrixInverseUndoTransformationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | matrices linear algebra | Audited |
| 178 | Matrix Linear Transformation Grid Proof | src/visual-proofs/proofs/matrices-linear-algebra/MatrixLinearTransformationGridProof.tsx | /visual-proofs/:categorySlug/:proofSlug | matrices linear algebra | Audited |
| 179 | Matrix Multiplication Row Column Proof | src/visual-proofs/proofs/matrices-linear-algebra/MatrixMultiplicationRowColumnProof.tsx | /visual-proofs/:categorySlug/:proofSlug | matrices linear algebra | Audited |
| 180 | Row Operations Preserve Solutions Proof | src/visual-proofs/proofs/matrices-linear-algebra/RowOperationsPreserveSolutionsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | matrices linear algebra | Audited |
| 181 | Composite Solids And Units Proof | src/visual-proofs/proofs/mensuration/CompositeSolidsAndUnitsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | mensuration | Audited |
| 182 | Cone Volume Surface Area Proof | src/visual-proofs/proofs/mensuration/ConeVolumeSurfaceAreaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | mensuration | Audited |
| 183 | Cuboid Cube Surface Area Proof | src/visual-proofs/proofs/mensuration/CuboidCubeSurfaceAreaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | mensuration | Audited |
| 184 | Cuboid Cube Volume Proof | src/visual-proofs/proofs/mensuration/CuboidCubeVolumeProof.tsx | /visual-proofs/:categorySlug/:proofSlug | mensuration | Audited |
| 185 | Cylinder Volume Surface Area Proof | src/visual-proofs/proofs/mensuration/CylinderVolumeSurfaceAreaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | mensuration | Audited |
| 186 | Perimeter And Circumference Proof | src/visual-proofs/proofs/mensuration/PerimeterAndCircumferenceProof.tsx | /visual-proofs/:categorySlug/:proofSlug | mensuration | Audited |
| 187 | Rectangle Square Area Proof | src/visual-proofs/proofs/mensuration/RectangleSquareAreaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | mensuration | Audited |
| 188 | Sphere Surface Area Volume Proof | src/visual-proofs/proofs/mensuration/SphereSurfaceAreaVolumeProof.tsx | /visual-proofs/:categorySlug/:proofSlug | mensuration | Audited |
| 189 | Composites Rectangular Arrays Proof | src/visual-proofs/proofs/number-theory/CompositesRectangularArraysProof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 190 | Divisibility By3 And9 Proof | src/visual-proofs/proofs/number-theory/DivisibilityBy3And9Proof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 191 | Divisibility Equal Grouping Proof | src/visual-proofs/proofs/number-theory/DivisibilityEqualGroupingProof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 192 | Euclid Infinitely Many Primes Proof | src/visual-proofs/proofs/number-theory/EuclidInfinitelyManyPrimesProof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 193 | Even Odd Pairing Proof | src/visual-proofs/proofs/number-theory/EvenOddPairingProof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 194 | Fundamental Theorem Arithmetic Proof | src/visual-proofs/proofs/number-theory/FundamentalTheoremArithmeticProof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 195 | Gcd Euclidean Algorithm Proof | src/visual-proofs/proofs/number-theory/GcdEuclideanAlgorithmProof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 196 | Irrationality Sqrt2 Proof | src/visual-proofs/proofs/number-theory/IrrationalitySqrt2Proof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 197 | Lcm Grid Alignment Proof | src/visual-proofs/proofs/number-theory/LcmGridAlignmentProof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 198 | Modular Arithmetic Clock Proof | src/visual-proofs/proofs/number-theory/ModularArithmeticClockProof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 199 | Number Theory Proof Configs | src/visual-proofs/proofs/number-theory/numberTheoryProofConfigs.ts | /visual-proofs/:categorySlug/:proofSlug | number theory | Partially Audited |
| 200 | Number Theory Proof Template | src/visual-proofs/proofs/number-theory/NumberTheoryProofTemplate.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Partially Audited |
| 201 | Primes Non Rectangular Arrays Proof | src/visual-proofs/proofs/number-theory/PrimesNonRectangularArraysProof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 202 | Remainder Pattern Cycles Proof | src/visual-proofs/proofs/number-theory/RemainderPatternCyclesProof.tsx | /visual-proofs/:categorySlug/:proofSlug | number theory | Audited |
| 203 | Phase Eight Coordinate Visual Models | src/visual-proofs/proofs/phase-eight/PhaseEightCoordinateVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase eight | Audited |
| 204 | Phase Eight Proof Configs | src/visual-proofs/proofs/phase-eight/phaseEightProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase eight | Partially Audited |
| 205 | Phase Eighteen Proof Configs | src/visual-proofs/proofs/phase-eighteen/phaseEighteenProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase eighteen | Partially Audited |
| 206 | Phase Eighteen Statistics Visual Models | src/visual-proofs/proofs/phase-eighteen/PhaseEighteenStatisticsVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase eighteen | Audited |
| 207 | Phase Eleven Geometry Visual Models | src/visual-proofs/proofs/phase-eleven/PhaseElevenGeometryVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase eleven | Audited |
| 208 | Phase Eleven Proof Configs | src/visual-proofs/proofs/phase-eleven/phaseElevenProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase eleven | Partially Audited |
| 209 | Phase Fifteen Calculus Visual Models | src/visual-proofs/proofs/phase-fifteen/PhaseFifteenCalculusVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase fifteen | Audited |
| 210 | Phase Fifteen Proof Configs | src/visual-proofs/proofs/phase-fifteen/phaseFifteenProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase fifteen | Partially Audited |
| 211 | Phase Five Proof Configs | src/visual-proofs/proofs/phase-five/phaseFiveProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase five | Partially Audited |
| 212 | Phase Five Trig Visual Models | src/visual-proofs/proofs/phase-five/PhaseFiveTrigVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase five | Audited |
| 213 | Phase Four Proof Configs | src/visual-proofs/proofs/phase-four/phaseFourProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase four | Partially Audited |
| 214 | Phase Four Visual Models | src/visual-proofs/proofs/phase-four/PhaseFourVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase four | Audited |
| 215 | Phase Fourteen Calculus Visual Models | src/visual-proofs/proofs/phase-fourteen/PhaseFourteenCalculusVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase fourteen | Audited |
| 216 | Phase Fourteen Proof Configs | src/visual-proofs/proofs/phase-fourteen/phaseFourteenProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase fourteen | Partially Audited |
| 217 | Phase Nine Coordinate Visual Models | src/visual-proofs/proofs/phase-nine/PhaseNineCoordinateVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase nine | Audited |
| 218 | Phase Nine Proof Configs | src/visual-proofs/proofs/phase-nine/phaseNineProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase nine | Partially Audited |
| 219 | Phase Nineteen Matrix Visual Models | src/visual-proofs/proofs/phase-nineteen/PhaseNineteenMatrixVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase nineteen | Audited |
| 220 | Phase Nineteen Proof Configs | src/visual-proofs/proofs/phase-nineteen/phaseNineteenProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase nineteen | Partially Audited |
| 221 | Phase Seven Proof Configs | src/visual-proofs/proofs/phase-seven/phaseSevenProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase seven | Partially Audited |
| 222 | Phase Seven Trig Visual Models | src/visual-proofs/proofs/phase-seven/PhaseSevenTrigVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase seven | Audited |
| 223 | Phase Seventeen Probability Visual Models | src/visual-proofs/proofs/phase-seventeen/PhaseSeventeenProbabilityVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase seventeen | Audited |
| 224 | Phase Seventeen Proof Configs | src/visual-proofs/proofs/phase-seventeen/phaseSeventeenProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase seventeen | Partially Audited |
| 225 | Phase Six Proof Configs | src/visual-proofs/proofs/phase-six/phaseSixProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase six | Partially Audited |
| 226 | Phase Six Trig Visual Models | src/visual-proofs/proofs/phase-six/PhaseSixTrigVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase six | Audited |
| 227 | Phase Sixteen Number Theory Visual Models | src/visual-proofs/proofs/phase-sixteen/PhaseSixteenNumberTheoryVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase sixteen | Audited |
| 228 | Phase Sixteen Proof Configs | src/visual-proofs/proofs/phase-sixteen/phaseSixteenProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase sixteen | Partially Audited |
| 229 | Phase Thirteen Proof Configs | src/visual-proofs/proofs/phase-thirteen/phaseThirteenProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase thirteen | Partially Audited |
| 230 | Phase Thirteen Sequence Visual Models | src/visual-proofs/proofs/phase-thirteen/PhaseThirteenSequenceVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase thirteen | Audited |
| 231 | Phase Twelve Algebra Visual Models | src/visual-proofs/proofs/phase-twelve/PhaseTwelveAlgebraVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twelve | Audited |
| 232 | Phase Twelve Proof Configs | src/visual-proofs/proofs/phase-twelve/phaseTwelveProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twelve | Partially Audited |
| 233 | Phase Twenty Five Log Exponent Visual Models | src/visual-proofs/proofs/phase-twenty-five/PhaseTwentyFiveLogExponentVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty five | Audited |
| 234 | Phase Twenty Five Proof Configs | src/visual-proofs/proofs/phase-twenty-five/phaseTwentyFiveProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty five | Partially Audited |
| 235 | Phase Twenty Four Inequality Visual Models | src/visual-proofs/proofs/phase-twenty-four/PhaseTwentyFourInequalityVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty four | Audited |
| 236 | Phase Twenty Four Proof Configs | src/visual-proofs/proofs/phase-twenty-four/phaseTwentyFourProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty four | Partially Audited |
| 237 | Phase Twenty One Complex Visual Models | src/visual-proofs/proofs/phase-twenty-one/PhaseTwentyOneComplexVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty one | Audited |
| 238 | Phase Twenty One Proof Configs | src/visual-proofs/proofs/phase-twenty-one/phaseTwentyOneProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty one | Partially Audited |
| 239 | Phase Twenty Seven Engineering Visual Models | src/visual-proofs/proofs/phase-twenty-seven/PhaseTwentySevenEngineeringVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty seven | Audited |
| 240 | Phase Twenty Seven Proof Configs | src/visual-proofs/proofs/phase-twenty-seven/phaseTwentySevenProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty seven | Partially Audited |
| 241 | Phase Twenty Six Proof Configs | src/visual-proofs/proofs/phase-twenty-six/phaseTwentySixProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty six | Partially Audited |
| 242 | Phase Twenty Six Transformation Visual Models | src/visual-proofs/proofs/phase-twenty-six/PhaseTwentySixTransformationVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty six | Audited |
| 243 | Phase Twenty Three Conic Visual Models | src/visual-proofs/proofs/phase-twenty-three/PhaseTwentyThreeConicVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty three | Audited |
| 244 | Phase Twenty Three Proof Configs | src/visual-proofs/proofs/phase-twenty-three/phaseTwentyThreeProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty three | Partially Audited |
| 245 | Phase Twenty Two Mensuration Visual Models | src/visual-proofs/proofs/phase-twenty-two/PhaseTwentyTwoMensurationVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty two | Audited |
| 246 | Phase Twenty Two Proof Configs | src/visual-proofs/proofs/phase-twenty-two/phaseTwentyTwoProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty two | Partially Audited |
| 247 | Phase Twenty Proof Configs | src/visual-proofs/proofs/phase-twenty/phaseTwentyProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty | Partially Audited |
| 248 | Phase Twenty Vector Visual Models | src/visual-proofs/proofs/phase-twenty/PhaseTwentyVectorVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase twenty | Audited |
| 249 | Phase Two Proof Configs | src/visual-proofs/proofs/phase-two/phaseTwoProofConfigs.tsx | /visual-proofs/:categorySlug/:proofSlug | phase two | Partially Audited |
| 250 | Phase Two Visual Models | src/visual-proofs/proofs/phase-two/PhaseTwoVisualModels.tsx | /visual-proofs/:categorySlug/:proofSlug | phase two | Audited |
| 251 | Addition Rule Overlapping Events Proof | src/visual-proofs/proofs/probability/AdditionRuleOverlappingEventsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | probability | Audited |
| 252 | Complement Rule Proof | src/visual-proofs/proofs/probability/ComplementRuleProof.tsx | /visual-proofs/:categorySlug/:proofSlug | probability | Audited |
| 253 | Conditional Probability Proof | src/visual-proofs/proofs/probability/ConditionalProbabilityProof.tsx | /visual-proofs/:categorySlug/:proofSlug | probability | Audited |
| 254 | Expected Value Long Run Average Proof | src/visual-proofs/proofs/probability/ExpectedValueLongRunAverageProof.tsx | /visual-proofs/:categorySlug/:proofSlug | probability | Audited |
| 255 | Experimental Probability Law Large Numbers Proof | src/visual-proofs/proofs/probability/ExperimentalProbabilityLawLargeNumbersProof.tsx | /visual-proofs/:categorySlug/:proofSlug | probability | Audited |
| 256 | Multiplication Rule Independent Events Proof | src/visual-proofs/proofs/probability/MultiplicationRuleIndependentEventsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | probability | Audited |
| 257 | Probability Favorable Over Total Proof | src/visual-proofs/proofs/probability/ProbabilityFavorableOverTotalProof.tsx | /visual-proofs/:categorySlug/:proofSlug | probability | Audited |
| 258 | Probability Proof Configs | src/visual-proofs/proofs/probability/probabilityProofConfigs.ts | /visual-proofs/:categorySlug/:proofSlug | probability | Partially Audited |
| 259 | Tree Diagram Compound Probability Proof | src/visual-proofs/proofs/probability/TreeDiagramCompoundProbabilityProof.tsx | /visual-proofs/:categorySlug/:proofSlug | probability | Audited |
| 260 | Arithmetic Progression Equal Steps Proof | src/visual-proofs/proofs/sequences-series/ArithmeticProgressionEqualStepsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 261 | Fibonacci Sequence Tiling Proof | src/visual-proofs/proofs/sequences-series/FibonacciSequenceTilingProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 262 | Fibonacci Spiral Approximation Proof | src/visual-proofs/proofs/sequences-series/FibonacciSpiralApproximationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 263 | Finite Geometric Series Sum Proof | src/visual-proofs/proofs/sequences-series/FiniteGeometricSeriesSumProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 264 | Geometric Progression Scaling Proof | src/visual-proofs/proofs/sequences-series/GeometricProgressionScalingProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 265 | Harmonic Series Growth Intuition Proof | src/visual-proofs/proofs/sequences-series/HarmonicSeriesGrowthIntuitionProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 266 | Infinite Geometric Series Convergence Proof | src/visual-proofs/proofs/sequences-series/InfiniteGeometricSeriesConvergenceProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 267 | Pascal Triangle Binomial Coefficients Proof | src/visual-proofs/proofs/sequences-series/PascalTriangleBinomialCoefficientsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 268 | Sequence Series Proof Configs | src/visual-proofs/proofs/sequences-series/sequenceSeriesProofConfigs.ts | /visual-proofs/:categorySlug/:proofSlug | sequences series | Partially Audited |
| 269 | Sequence Series Proof Template | src/visual-proofs/proofs/sequences-series/SequenceSeriesProofTemplate.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Partially Audited |
| 270 | Square Numbers Odd Layers Proof | src/visual-proofs/proofs/sequences-series/SquareNumbersOddLayersProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 271 | Sum Arithmetic Progression Proof | src/visual-proofs/proofs/sequences-series/SumArithmeticProgressionProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 272 | Sum First NNatural Numbers Proof | src/visual-proofs/proofs/sequences-series/SumFirstNNaturalNumbersProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 273 | Sum First NOdd Numbers Proof | src/visual-proofs/proofs/sequences-series/SumFirstNOddNumbersProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 274 | Sum Of Fibonacci Numbers Proof | src/visual-proofs/proofs/sequences-series/SumOfFibonacciNumbersProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 275 | Triangular Numbers Proof | src/visual-proofs/proofs/sequences-series/TriangularNumbersProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 276 | Visual Induction Domino Growth Proof | src/visual-proofs/proofs/sequences-series/VisualInductionDominoGrowthProof.tsx | /visual-proofs/:categorySlug/:proofSlug | sequences series | Audited |
| 277 | Correlation Scatterplot Proof | src/visual-proofs/proofs/statistics/CorrelationScatterplotProof.tsx | /visual-proofs/:categorySlug/:proofSlug | statistics | Audited |
| 278 | Histogram Frequency Distribution Proof | src/visual-proofs/proofs/statistics/HistogramFrequencyDistributionProof.tsx | /visual-proofs/:categorySlug/:proofSlug | statistics | Audited |
| 279 | Linear Regression Least Squares Proof | src/visual-proofs/proofs/statistics/LinearRegressionLeastSquaresProof.tsx | /visual-proofs/:categorySlug/:proofSlug | statistics | Audited |
| 280 | Mean As Balance Point Proof | src/visual-proofs/proofs/statistics/MeanAsBalancePointProof.tsx | /visual-proofs/:categorySlug/:proofSlug | statistics | Audited |
| 281 | Median And Quartiles Proof | src/visual-proofs/proofs/statistics/MedianAndQuartilesProof.tsx | /visual-proofs/:categorySlug/:proofSlug | statistics | Audited |
| 282 | Normal Distribution Empirical Rule Proof | src/visual-proofs/proofs/statistics/NormalDistributionEmpiricalRuleProof.tsx | /visual-proofs/:categorySlug/:proofSlug | statistics | Audited |
| 283 | Sampling Distribution Mean Proof | src/visual-proofs/proofs/statistics/SamplingDistributionMeanProof.tsx | /visual-proofs/:categorySlug/:proofSlug | statistics | Audited |
| 284 | Statistics Proof Configs | src/visual-proofs/proofs/statistics/statisticsProofConfigs.ts | /visual-proofs/:categorySlug/:proofSlug | statistics | Partially Audited |
| 285 | Variance Standard Deviation Proof | src/visual-proofs/proofs/statistics/VarianceStandardDeviationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | statistics | Audited |
| 286 | Congruence Rigid Motions Proof | src/visual-proofs/proofs/transformations-symmetry/CongruenceRigidMotionsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | transformations symmetry | Audited |
| 287 | Dilation Similarity Scale Factor Proof | src/visual-proofs/proofs/transformations-symmetry/DilationSimilarityScaleFactorProof.tsx | /visual-proofs/:categorySlug/:proofSlug | transformations symmetry | Audited |
| 288 | Line Rotational Symmetry Proof | src/visual-proofs/proofs/transformations-symmetry/LineRotationalSymmetryProof.tsx | /visual-proofs/:categorySlug/:proofSlug | transformations symmetry | Audited |
| 289 | Reflection Mirror Line Proof | src/visual-proofs/proofs/transformations-symmetry/ReflectionMirrorLineProof.tsx | /visual-proofs/:categorySlug/:proofSlug | transformations symmetry | Audited |
| 290 | Rotation About Point Proof | src/visual-proofs/proofs/transformations-symmetry/RotationAboutPointProof.tsx | /visual-proofs/:categorySlug/:proofSlug | transformations symmetry | Audited |
| 291 | Tessellations Repeated Transformations Proof | src/visual-proofs/proofs/transformations-symmetry/TessellationsRepeatedTransformationsProof.tsx | /visual-proofs/:categorySlug/:proofSlug | transformations symmetry | Audited |
| 292 | Transformation Matrices2 DProof | src/visual-proofs/proofs/transformations-symmetry/TransformationMatrices2DProof.tsx | /visual-proofs/:categorySlug/:proofSlug | transformations symmetry | Audited |
| 293 | Translation Sliding Vector Proof | src/visual-proofs/proofs/transformations-symmetry/TranslationSlidingVectorProof.tsx | /visual-proofs/:categorySlug/:proofSlug | transformations symmetry | Audited |
| 294 | Arc Length Formula Proof | src/visual-proofs/proofs/trigonometry/ArcLengthFormulaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 295 | Complementary Angle Identities Proof | src/visual-proofs/proofs/trigonometry/ComplementaryAngleIdentitiesProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 296 | Cosine Angle Addition Proof | src/visual-proofs/proofs/trigonometry/CosineAngleAdditionProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 297 | Cosine Rule Proof | src/visual-proofs/proofs/trigonometry/CosineRuleProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 298 | Double Angle Identities Proof | src/visual-proofs/proofs/trigonometry/DoubleAngleIdentitiesProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 299 | Pythagorean Trig Identity Proof | src/visual-proofs/proofs/trigonometry/PythagoreanTrigIdentityProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 300 | Radians Arc Radius Proof | src/visual-proofs/proofs/trigonometry/RadiansArcRadiusProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 301 | Right Triangle Trig Ratios Proof | src/visual-proofs/proofs/trigonometry/RightTriangleTrigRatiosProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 302 | Sine Angle Addition Proof | src/visual-proofs/proofs/trigonometry/SineAngleAdditionProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 303 | Sine Rule Proof | src/visual-proofs/proofs/trigonometry/SineRuleProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 304 | Small Angle Approximation Proof | src/visual-proofs/proofs/trigonometry/SmallAngleApproximationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 305 | Tangent Ratio Identity Proof | src/visual-proofs/proofs/trigonometry/TangentRatioIdentityProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 306 | Triangle Area Sine Formula Proof | src/visual-proofs/proofs/trigonometry/TriangleAreaSineFormulaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 307 | Trig Graphs From Unit Circle Proof | src/visual-proofs/proofs/trigonometry/TrigGraphsFromUnitCircleProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 308 | Trig Proof Configs | src/visual-proofs/proofs/trigonometry/trigProofConfigs.ts | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Partially Audited |
| 309 | Trig Proof Template | src/visual-proofs/proofs/trigonometry/TrigProofTemplate.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Partially Audited |
| 310 | Unit Circle Sine Cosine Proof | src/visual-proofs/proofs/trigonometry/UnitCircleSineCosineProof.tsx | /visual-proofs/:categorySlug/:proofSlug | trigonometry | Audited |
| 311 | Cross Product Area Proof | src/visual-proofs/proofs/vectors/CrossProductAreaProof.tsx | /visual-proofs/:categorySlug/:proofSlug | vectors | Audited |
| 312 | Dot Product As Projection Proof | src/visual-proofs/proofs/vectors/DotProductAsProjectionProof.tsx | /visual-proofs/:categorySlug/:proofSlug | vectors | Audited |
| 313 | Scalar Multiplication Vector Proof | src/visual-proofs/proofs/vectors/ScalarMultiplicationVectorProof.tsx | /visual-proofs/:categorySlug/:proofSlug | vectors | Audited |
| 314 | Unit Vectors Normalization Proof | src/visual-proofs/proofs/vectors/UnitVectorsNormalizationProof.tsx | /visual-proofs/:categorySlug/:proofSlug | vectors | Audited |
| 315 | Vector Addition Tip To Tail Proof | src/visual-proofs/proofs/vectors/VectorAdditionTipToTailProof.tsx | /visual-proofs/:categorySlug/:proofSlug | vectors | Audited |
| 316 | Vector As Directed Segment Proof | src/visual-proofs/proofs/vectors/VectorAsDirectedSegmentProof.tsx | /visual-proofs/:categorySlug/:proofSlug | vectors | Audited |
| 317 | Vector Equation Line Proof | src/visual-proofs/proofs/vectors/VectorEquationLineProof.tsx | /visual-proofs/:categorySlug/:proofSlug | vectors | Audited |
| 318 | Vector Projection Component Proof | src/visual-proofs/proofs/vectors/VectorProjectionComponentProof.tsx | /visual-proofs/:categorySlug/:proofSlug | vectors | Audited |
| 319 | AIApplications Grid | src/visualizations/ai/AIApplicationsGrid.tsx | Embedded/shared | ai | Audited |
| 320 | Cryptography Visualizer | src/visualizations/ai/CryptographyVisualizer.tsx | Embedded/shared | ai | Audited |
| 321 | GPSTriangulation Visualizer | src/visualizations/ai/GPSTriangulationVisualizer.tsx | Embedded/shared | ai | Audited |
| 322 | Gradient Descent Visualizer | src/visualizations/ai/GradientDescentVisualizer.tsx | Embedded/shared | ai | Audited |
| 323 | Image Compression Visualizer | src/visualizations/ai/ImageCompressionVisualizer.tsx | Embedded/shared | ai | Audited |
| 324 | Neural Network Visualizer | src/visualizations/ai/NeuralNetworkVisualizer.tsx | Embedded/shared | ai | Audited |
| 325 | Robotics Path Visualizer | src/visualizations/ai/RoboticsPathVisualizer.tsx | Embedded/shared | ai | Audited |
| 326 | Signal Processing Visualizer | src/visualizations/ai/SignalProcessingVisualizer.tsx | Embedded/shared | ai | Audited |
| 327 | Linear Equation Visualizer | src/visualizations/algebra/LinearEquationVisualizer.tsx | Embedded/shared | algebra | Audited |
| 328 | Quadratic Equation Visualizer | src/visualizations/algebra/QuadraticEquationVisualizer.tsx | Embedded/shared | algebra | Audited |
| 329 | Simultaneous Equations Visualizer | src/visualizations/algebra/SimultaneousEquationsVisualizer.tsx | Embedded/shared | algebra | Audited |
| 330 | Calculus Concept Atlas | src/visualizations/calculus/CalculusConceptAtlas.tsx | Embedded/shared | calculus | Audited |
| 331 | Calculus Fundamentals Problems | src/visualizations/calculus/CalculusFundamentalsProblems.tsx | Embedded/shared | calculus | Audited |
| 332 | Derivative Slope Visualizer | src/visualizations/calculus/DerivativeSlopeVisualizer.tsx | Embedded/shared | calculus | Audited |
| 333 | Integration Area Visualizer | src/visualizations/calculus/IntegrationAreaVisualizer.tsx | Embedded/shared | calculus | Audited |
| 334 | Limits Visualizer | src/visualizations/calculus/LimitsVisualizer.tsx | Embedded/shared | calculus | Audited |
| 335 | Motion Visualizer | src/visualizations/calculus/MotionVisualizer.tsx | Embedded/shared | calculus | Audited |
| 336 | Series Block Accumulation | src/visualizations/calculus/SeriesBlockAccumulation.tsx | Embedded/shared | calculus | Audited |
| 337 | Complex Multiplication Visualizer | src/visualizations/complex/ComplexMultiplicationVisualizer.tsx | Embedded/shared | complex | Audited |
| 338 | Complex Plane Visualizer | src/visualizations/complex/ComplexPlaneVisualizer.tsx | Embedded/shared | complex | Audited |
| 339 | Euler Formula2 D | src/visualizations/complex/EulerFormula2D.tsx | Embedded/shared | complex | Audited |
| 340 | Euler Formula3 D | src/visualizations/complex/EulerFormula3D.tsx | Embedded/shared | complex | Audited |
| 341 | Euler Identity Animation | src/visualizations/complex/EulerIdentityAnimation.tsx | Embedded/shared | complex | Audited |
| 342 | Formula Visualization Atlas | src/visualizations/formulas/FormulaVisualizationAtlas.tsx | Embedded/shared | formulas | Missing / Placeholder |
| 343 | Circle Explorer | src/visualizations/geometry/CircleExplorer.tsx | Embedded/shared | geometry | Audited |
| 344 | Geometry Theorem Visualizers | src/visualizations/geometry/GeometryTheoremVisualizers.tsx | Embedded/shared | geometry | Audited |
| 345 | Pythagoras Visualizer | src/visualizations/geometry/PythagorasVisualizer.tsx | Embedded/shared | geometry | Audited |
| 346 | Shape3 DExplorer | src/visualizations/geometry/Shape3DExplorer.tsx | Embedded/shared | geometry | Audited |
| 347 | Triangle Explorer | src/visualizations/geometry/TriangleExplorer.tsx | Embedded/shared | geometry | Audited |
| 348 | Eigenvector Visualizer | src/visualizations/linear-algebra/EigenvectorVisualizer.tsx | Embedded/shared | linear algebra | Audited |
| 349 | Linear Algebra Applications | src/visualizations/linear-algebra/LinearAlgebraApplications.tsx | Embedded/shared | linear algebra | Audited |
| 350 | Matrix Transformation Visualizer | src/visualizations/linear-algebra/MatrixTransformationVisualizer.tsx | Embedded/shared | linear algebra | Audited |
| 351 | Vector Visualizer | src/visualizations/linear-algebra/VectorVisualizer.tsx | Embedded/shared | linear algebra | Audited |
| 352 | Angle Sum Difference Visualizer | src/visualizations/trigonometry/AngleSumDifferenceVisualizer.tsx | Embedded/shared | trigonometry | Audited |
| 353 | Core Identity Proof Visualizer | src/visualizations/trigonometry/CoreIdentityProofVisualizer.tsx | Embedded/shared | trigonometry | Audited |
| 354 | Double Half Angle Visualizer | src/visualizations/trigonometry/DoubleHalfAngleVisualizer.tsx | Embedded/shared | trigonometry | Audited |
| 355 | Eclipse Trigonometry Visualizer | src/visualizations/trigonometry/EclipseTrigonometryVisualizer.tsx | Embedded/shared | trigonometry | Audited |
| 356 | Inverse Trig Visualizer | src/visualizations/trigonometry/InverseTrigVisualizer.tsx | Embedded/shared | trigonometry | Audited |
| 357 | Sine Cosine Wave Visualizer | src/visualizations/trigonometry/SineCosineWaveVisualizer.tsx | Embedded/shared | trigonometry | Audited |
| 358 | Triangle Circle Ratio Visualizer | src/visualizations/trigonometry/TriangleCircleRatioVisualizer.tsx | Embedded/shared | trigonometry | Audited |
| 359 | Trig Concept3 DView | src/visualizations/trigonometry/TrigConcept3DView.tsx | Embedded/shared | trigonometry | Audited |
| 360 | Trig Graph Studio | src/visualizations/trigonometry/TrigGraphStudio.tsx | Embedded/shared | trigonometry | Audited |
| 361 | Trigonometric Functions Visualizer | src/visualizations/trigonometry/TrigonometricFunctionsVisualizer.tsx | Embedded/shared | trigonometry | Audited |
| 362 | Trigonometry Experiment Catalog | src/visualizations/trigonometry/TrigonometryExperimentCatalog.tsx | Embedded/shared | trigonometry | Audited |
| 363 | Trigonometry Math Lab | src/visualizations/trigonometry/TrigonometryMathLab.tsx | Embedded/shared | trigonometry | Audited |
| 364 | Trig Practice Challenge System | src/visualizations/trigonometry/TrigPracticeChallengeSystem.tsx | Embedded/shared | trigonometry | Missing / Placeholder |
| 365 | Unit Circle Master Visualizer | src/visualizations/trigonometry/UnitCircleMasterVisualizer.tsx | Embedded/shared | trigonometry | Audited |
| 366 | Unit Circle Visualizer | src/visualizations/trigonometry/UnitCircleVisualizer.tsx | Embedded/shared | trigonometry | Audited |
| 367 | Wave Applications | src/visualizations/trigonometry/WaveApplications.tsx | Embedded/shared | trigonometry | Audited |
