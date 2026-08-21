const fs = require("fs");
const path = require("path");

const root = path.join(process.cwd(), "docs", "math-workspace-market-audit");
fs.mkdirSync(root, { recursive: true });

const workspaces = [
  {
    key: "2D_GEOMETRY",
    workspace: "2D Geometry",
    route: "http://localhost:3536/workspace/geometry",
    mode: "geometry",
    categories: [
      ["Basic objects and tools", ["free point", "segment", "ray", "vector", "line", "circle", "midpoint", "parallel", "perpendicular", "angle", "locus", "regular polygon", "text/label", "image", "selection/move"]],
      ["Triangles", ["scalene triangle", "isosceles triangle", "equilateral triangle", "right triangle", "acute triangle", "obtuse triangle", "thin triangle", "nearly collinear triangle", "fixed side triangle", "median construction", "altitude construction", "angle bisector", "perpendicular bisector", "circumcircle", "incenter check"]],
      ["Quadrilaterals and polygons", ["square", "rectangle", "rhombus", "parallelogram", "trapezoid", "kite", "irregular quadrilateral", "convex pentagon", "concave pentagon", "regular hexagon", "irregular hexagon", "octagon", "self-intersecting polygon", "20 vertex polygon", "layered polygon"]],
      ["Circles, arcs and conics", ["center-edge circle", "three-point circle", "diameter circle", "tangent line", "intersecting circles", "tangent circles", "non-intersecting circles", "semicircle", "arc", "sector", "ellipse-like shape", "eccentric conic", "parabola tool", "hyperbola tool", "multi-conic scene"]],
      ["Transformations", ["translation", "rotation", "reflection across line", "reflection across point", "dilation", "repeated rotation", "repeated reflection", "composition", "custom center rotation", "fractional scale", "large scale", "group transform", "constrained transform", "undo transform", "redo transform"]],
      ["Intersections and constraints", ["line-line", "segment-segment", "line-circle", "circle-circle", "tangent intersection", "no intersection", "coincident lines", "parallel lines", "nearly parallel lines", "perpendicular constraint", "equal length", "fixed angle", "point on line", "point on circle", "10 object chain"]],
      ["Stress and scene management", ["50 objects", "overlap stack", "tiny objects", "large objects", "outside viewport", "property churn", "rapid drag", "30 undo redo", "clear all", "save export import"]],
    ],
  },
  {
    key: "3D_GRAPH",
    workspace: "3D Graphing",
    route: "http://localhost:3536/math-lab/3d-graphing",
    mode: "textbox",
    categories: [
      ["Polynomial and algebraic surfaces", ["x+y", "x^2+y^2", "x^2-y^2", "x^3-3*x*y^2", "x^4+y^4", "(x+y)^2", "x^2*y-x*y^2", "x^3+y^3-3*x*y", "(x^2+y^2)^2-4*x^2*y^2", "x^5-2*x^3*y+0.5*y^4"]],
      ["Trigonometric surfaces", ["sin(x)", "cos(y)", "sin(x)+cos(y)", "sin(x*y)", "sin(x^2+y^2)", "sin(x)*cos(y)", "sin(3*x)*cos(2*y)", "tan(x)+tan(y)", "sin(x)/x", "sin(x*y)/(x*y)", "cos(sqrt(x^2+y^2))", "sin(sqrt(x^2+y^2))/sqrt(x^2+y^2)", "sin(5*x)*cos(5*y)/(1+x^2+y^2)", "sin(x)*sin(y)*sin(x+y)", "sin(12*sqrt(x^2+y^2))"]],
      ["Exponential and logarithmic surfaces", ["exp(-(x^2+y^2))", "exp(-((x-1)^2+(y+1)^2))", "exp(x+y)", "log(x^2+y^2)", "log(abs(x*y))", "exp(sin(x)+cos(y))", "log(1+x^2+y^2)", "exp(-10*(x^2+y^2))", "exp(x^2+y^2)", "log(exp(x)+exp(y))"]],
      ["Radicals, abs and discontinuities", ["sqrt(x^2+y^2)", "sqrt(1-x^2-y^2)", "sqrt(x^2-y^2)", "abs(x)+abs(y)", "1/(x^2+y^2)", "1/(x-y)", "log(abs(x*y))", "floor(x)+ceil(y)", "abs(sin(x*y))", "sqrt(abs(x*y))/(1+x^2+y^2)", "1/(sin(x)-cos(y))", "sqrt(abs(1-x*y))", "abs(x-y)/(1+abs(x+y))", "ceil(sin(x)+cos(y))", "round(x*y)"]],
      ["Advanced nested surfaces", ["sqrt(abs(sin(x^2+y^2)))", "log(1+abs(sin(x*y)))", "sin(exp(-x^2)+cos(y^2))", "abs(tan(x/3))*exp(-y^2)", "sqrt(abs(x^3-y^3))/(1+x^2+y^2)", "sin(x)/(1+abs(y))", "cos(y)/(1+abs(x))", "log(1+sqrt(x^2+y^2))*sin(x-y)", "exp(-abs(x*y))*cos(x+y)", "sin(x^2-y^2)/(1+x^2+y^2)", "abs(sin(x)+cos(y)+sin(x*y))", "sqrt(abs(cos(x*y)))", "log(2+abs(tan(x/4)))", "sin(sqrt(abs(x^4-y^4)))", "exp(-sqrt(x^2+y^2))*sin(8*x)"]],
      ["Multiple-equation scenes", ["two intersecting planes", "plane and paraboloid", "saddle and plane", "upper lower hemispheres", "two shifted gaussians", "three trig surfaces", "four transparent surfaces", "five toggleable surfaces", "nearly coincident surfaces", "different scales", "eight simultaneous equations", "delete middle surface", "edit first surface", "toggle legend isolation", "reorder surfaces", "stress opacity", "copy to CAS", "send to 3D geometry", "reset scene", "export surface"]],
      ["Parser and invalid-input stress", ["operator precedence", "unary minus", "negative powers", "implicit multiplication", "unicode exponents", "scientific notation", "long expression", "missing bracket", "unknown function", "undefined variable", "NaN", "Infinity", "overflow", "script-like text", "rapid replacement"]],
    ],
  },
  {
    key: "2D_GRAPH",
    workspace: "2D Graphing",
    route: "http://localhost:3536/workspace/graph?v_a=1&v_b=0",
    mode: "textbox",
    categories: [
      ["Linear functions", ["x", "2*x+3", "-x+4", "3", "x=2", "0.5*x-1", "100*x", "0.001*x", "a*x+b", "x and -x"]],
      ["Quadratic and polynomial functions", ["x^2", "-x^2", "(x-2)^2+1", "(x-1)*(x+2)", "x^3", "x^4-1", "(x-1)^2*(x+2)", "x^2+1", "x^8-x^4", "x^2 and x^3", "a*x^2+b", "(x-0.01)*(x+0.01)", "1000*x^2", "0.001*x^2", "x^2+1/x"]],
      ["Rational functions and discontinuities", ["1/x", "1/x^2", "(x^2-1)/(x-1)", "1/(x-2)", "x/(x^2-1)", "1/(1/(x+1))", "1/((x-1)*(x+2))", "x/(x+1)", "(x^2+1)/(x-1)", "(x^2-4)/(x-2)", "1/(x-0.001)", "1/(x-a)", "1/(100*x)", "x+1/x", "1/x and 1/(x-1)"]],
      ["Trigonometric functions", ["sin(x)", "cos(x)", "tan(x)", "sin(2*x)", "cos(x/2)", "sin(x)+cos(x)", "sin(x^2)", "sin(x)/x", "abs(sin(x))", "asin(x)", "sin(x-pi/2)", "3*sin(x)", "a*sin(x+b)", "sin(8*x)", "sin(30*x)"]],
      ["Exponential logarithmic radical", ["exp(x)", "exp(-x)", "log(x)", "log(x-2)", "sqrt(x)", "cbrt(x)", "sqrt(abs(x))", "exp(-x^2)", "10^x", "log(abs(x))", "sqrt(1-x^2)", "exp(10*x)", "exp(-10*x)", "log(1+x^2)", "sqrt(x+3)+log(x+4)"]],
      ["Absolute piecewise special", ["abs(x)", "sign(x)", "floor(x)", "ceil(x)", "round(x)", "min(x,1)", "max(x,-1)", "x<0?-x:x", "x<1?x:x^2", "floor(x/2)", "abs(abs(x)-1)", "sin(x)>0?1:-1", "round(sin(x))", "a*abs(x-b)", "max(abs(x),abs(x-2))"]],
      ["Multiple equations sliders interaction", ["2 curves", "3 curves", "5 curves", "10 curves", "shared a", "independent a b", "slider min max", "rapid slider", "visibility deletion", "color style independence"]],
      ["Invalid adversarial input", ["incomplete", "unsupported syntax", "unknown function", "undefined variable", "excessively long", "unicode input", "script-like content", "deep nesting", "division by zero text", "rapid invalid valid"]],
    ],
  },
  {
    key: "CAS",
    workspace: "CAS / Solver",
    route: "http://localhost:3536/workspace/data",
    mode: "textbox",
    categories: [
      ["Arithmetic and precedence", ["2+3*4", "(2+3)*4", "1/2+1/3", "-2^2", "(-2)^2", "2e3+1", "pi^2", "2^-3", "1/(2+3/4)", "sqrt(2)^2"]],
      ["Algebraic simplification", ["expand((x+1)^2)", "factor(x^2-1)", "collect(x^2+x+2*x,x)", "(x^2-1)/(x-1)", "sqrt(8)", "x^a*x^b", "1/(1+1/x)", "(a+b)^2", "sqrt(x^2)", "(x-1)/(1-x)", "expand((x+y+z)^3)", "factor(x^3-1)", "simplify((x^2+2*x+1)/(x+1))", "rationalize(1/(1+sqrt(2)))", "simplify(abs(x)^2)"]],
      ["Equation solving", ["x+2=5", "x^2-5*x+6=0", "x^3-1=0", "x^4-1=0", "1/(x-1)=2", "sqrt(x+1)=x-1", "2^x=8", "log(x)=1", "sin(x)=0", "a*x+b=0", "x^2+1=0 over real", "x=x", "(x-1)^2=0", "sqrt(x)= -1", "x^2+1=0 over complex"]],
      ["Systems of equations", ["x+y=3; x-y=1", "x+y+z=6; x-y=0; z=2", "x+y=1; 2*x+2*y=2", "x+y=1; x+y=2", "x^2+y^2=1; y=x", "x^2+y^2=4; y=1", "x^2+y^2=5; (x-2)^2+y^2=1", "a*x+y=1; x-y=0", "x+i*y=1", "0.0001*x+y=1; x+y=2"]],
      ["Inequalities", ["x+1>0", "x^2-1<=0", "1/(x-1)>0", "abs(x)<2", "0<x<1", "a*x+b>0", "sqrt(x-1)>2", "x^2>=0", "log(x)>0", "sin(x)>0"]],
      ["Calculus", ["diff(x^2,x)", "diff(sin(x),x,2)", "diff(x*sin(x),x)", "diff(x/(x+1),x)", "diff(sin(x^2),x)", "implicit diff x^2+y^2=1", "integrate(2*x,x)", "integrate(x*exp(x),x)", "integrate(1/(x^2-1),x)", "integrate(sin(x),x,0,pi)", "limit(sin(x)/x,x,0)", "limit(1/x,x,0,+)", "limit(1/x,x,inf)", "series(exp(x),x,0,5)", "partial(x^2*y,y)", "gradient(x^2+y^2)", "integrate(exp(-x^2),x)", "limit(abs(x)/x,x,0)", "diff(integrate(cos(x),x),x)", "multivariable x^2+y^2+z^2"]],
      ["Matrices vectors complex", ["[[1,2],[3,4]]+[[5,6],[7,8]]", "[[1,2],[3,4]]*[[2,0],[1,2]]", "det([[1,2],[3,4]])", "inverse([[1,2],[3,4]])", "inverse([[1,2],[2,4]])", "eigen([[2,0],[0,3]])", "dot([1,2,3],[4,5,6])", "cross([1,0,0],[0,1,0])", "(2+3i)*(1-i)", "z^2+1=0"]],
      ["Invalid adversarial", ["x+", "[[1,2],[3]]", "unknown(x)", "log(-1) real", "1/0", "unsupportedOperation(x)", "long expression", "deep nesting", "exp(10000)", "<script>alert(1)</script>"]],
    ],
  },
  {
    key: "3D_GEOMETRY",
    workspace: "3D Geometry",
    route: "http://localhost:3536/workspace/3d",
    mode: "geometry3d",
    categories: [
      ["Points lines planes vectors", ["point", "point on object", "line", "segment", "ray", "vector", "plane", "parallel line", "parallel plane", "perpendicular line", "perpendicular plane", "intersection", "distance", "angle", "normal vector"]],
      ["Basic solids", ["cube", "cuboid", "sphere", "hemisphere", "cylinder", "cone", "frustum", "pyramid", "triangular prism", "pentagonal prism", "hexagonal prism", "tetrahedron", "octahedron", "dodecahedron", "icosahedron", "torus", "wedge", "tube", "ellipsoid", "composite scene"]],
      ["Shape transformation", ["translate x", "translate y", "translate z", "free translate", "rotate x", "rotate y", "rotate z", "combined rotation", "uniform scaling", "non-uniform scaling", "very small scale", "very large scale", "duplicate transform", "group transform", "dependent transform"]],
      ["Resize direct manipulation", ["corner handles", "edge handles", "face handles", "width only", "height only", "depth only", "aspect ratio", "numeric dimensions", "zero prevention", "minimum dimension", "maximum dimension", "rotated resize", "transparent resize", "overlap resize", "rapid resize"]],
      ["Properties materials appearance", ["fill color", "edge color", "opacity", "wireframe", "solid mode", "material", "lighting", "labels", "measurements", "save import persistence"]],
      ["Relationships measurements intersections", ["point distance", "point plane distance", "line plane intersection", "plane plane intersection", "solid plane intersection", "line angle", "plane angle", "line plane angle", "surface area", "volume", "edge length", "radius diameter", "resize measurement", "rotate measurement", "dependency chain"]],
      ["Stress scene management", ["20 solids", "50 mixed objects", "overlap solids", "coincident faces", "transparent nested", "tiny inside large", "far from origin", "30 undo redo", "clear all rebuild", "save export import"]],
    ],
  },
];

for (const workspace of workspaces) {
  const cases = buildCases(workspace);
  write(`${workspace.key}_GOLDEN_DATASET.json`, JSON.stringify({
    workspace: workspace.workspace,
    route: workspace.route,
    generatedAt: new Date().toISOString(),
    status: "baseline dataset created; visible UI execution pending",
    cases,
  }, null, 2));
  write(`${workspace.key}_100_CASE_TEST_MATRIX.md`, matrixMarkdown(workspace, cases));
  write(traceName(workspace), traceMarkdown(workspace));
  write(`${workspace.key}_OPTIONS_AUDIT.md`, optionsMarkdown(workspace));
  write(`${workspace.key}_DEFECTS.md`, defectsMarkdown(workspace));
  write(`${workspace.key}_REGRESSION_REPORT.md`, regressionMarkdown(workspace));
}

write("MATH_WORKSPACES_MASTER_AUDIT.md", `# Math Workspaces Master Audit

Status: baseline audit scaffolding created; complete 500-case visible UI execution is pending.

Routes in scope:
${workspaces.map((workspace) => `- ${workspace.workspace}: ${workspace.route}`).join("\n")}

Implementation inventory baseline:
- Shared route shell: src/pages/MathWorkspace.tsx and route wrappers in src/pages/WorkspaceGraph.tsx, src/pages/WorkspaceGeometry.tsx, src/pages/Workspace3D.tsx, src/pages/WorkspaceData.tsx.
- 2D geometry UI: src/components/workspace/panels/GeometryWorkspacePanel.tsx.
- 2D graph UI: src/components/workspace/panels/GraphWorkspacePanel.tsx and src/components/workspace/panels/graphPanelUtils.ts.
- 3D graph UI: src/pages/MathLab3DGraphing.tsx, src/graph-studio/graph3dSurfaceModel.ts, src/utils/mathEngine/graph3dUtils.ts.
- CAS/Solver UI/engine: src/pages/MathWorkspace.tsx CAS notebook blocks, src/cas, src/phase4/casEngine.ts, src/utils/mathEngine/casUtils.ts.
- 3D geometry UI/engine: src/pages/MathWorkspace.tsx Workspace3DScene/TransformGroup3D, src/workspace/geometry3dKernel.ts, src/workspace/geometry3dWorkspaceEngine.ts.
- Shared tests already present: workspace route smoke, baseline guards, graph sampler/validation, CAS parser/notebook, geometry kernels/builders, ThreeSceneWrapper lifecycle.

Release gate honesty:
- Market-ready cannot be declared until all 500 cases are executed through visible UI, defects are fixed/retested, full automated suite passes, and two complete regression cycles pass without code changes.
`);
write("MATH_WORKSPACES_MASTER_DEFECTS.md", "# Math Workspaces Master Defects\n\nNo defects from the requested 500-case UI audit have been recorded yet because full visible execution is pending. Existing code changes in this session add selected-object glow and are tracked separately.\n");
write("MATH_WORKSPACES_FIX_LOG.md", "# Math Workspaces Fix Log\n\n| Fix ID | Workspace | Severity | Defect | Root Cause | Files | Tests | Retest |\n|---|---|---|---|---|---|---|---|\n| FX-001 | 2D Geometry / 3D Geometry | Low | Selected object border glow requested before audit | Selection rendered with limited/no border halo | GeometryWorkspacePanel.tsx, MathWorkspace.tsx, index.css | typecheck; GeometryWorkspacePanel.test.tsx | Pending browser visual retest |\n");
write("MATH_WORKSPACES_CROSS_WORKSPACE_REGRESSION.md", "# Cross-Workspace Regression\n\nPlanned route cycle: 2D Geometry -> 3D Graphing -> CAS -> 2D Graphing with v_a=1&v_b=0 -> 3D Geometry -> 2D Geometry.\n\nStatus: not executed as a complete cycle yet.\n");
write("MATH_WORKSPACES_PERFORMANCE_REPORT.md", "# Performance Report\n\nStatus: pending measured browser audit. Required metrics: load time, time to first interaction, operation latency, drag/rotation FPS, peak memory, memory after Clear All, navigation leak check, rapid input behavior.\n");
write("MATH_WORKSPACES_MARKET_READINESS.md", "# Market Readiness\n\nVerdict: NOT MARKET READY for all five workspaces until the specified 500 visible UI cases, two regression cycles, performance measurements, and unresolved defect gates are complete.\n\n- 2D Geometry: NOT MARKET READY\n- 3D Graphing: NOT MARKET READY\n- 2D Graphing: NOT MARKET READY\n- CAS/Solver: NOT MARKET READY\n- 3D Geometry: NOT MARKET READY\n\nOverall: NOT MARKET READY\n");

function buildCases(workspace) {
  const cases = [];
  for (const [category, seeds] of workspace.categories) {
    for (const seed of seeds) cases.push(makeCase(workspace, category, seed, cases.length + 1));
  }
  let variant = 0;
  while (cases.length < 100) {
    const [category, seeds] = workspace.categories[variant % workspace.categories.length];
    const seed = `${seeds[variant % seeds.length]} variant ${Math.floor(variant / workspace.categories.length) + 2}`;
    cases.push(makeCase(workspace, category, seed, cases.length + 1));
    variant += 1;
  }
  return cases.slice(0, 100);
}

function makeCase(workspace, category, seed, index) {
  const id = `${workspace.key}-${String(index).padStart(3, "0")}`;
  const action = workspace.mode === "textbox"
    ? `Open ${workspace.route}; focus expression/composer textbox; enter ${seed}; run/update; inspect result, visual output, edit expression, then undo/delete where available.`
    : workspace.mode === "geometry3d"
      ? `Open ${workspace.route}; select ${seed} tool/object; create using pointer; select object; move, rotate, scale/resize where supported; restyle; duplicate; undo; redo; delete.`
      : `Open ${workspace.route}; select ${seed} tool; create via pointer coordinates; select object; move control points and whole object; restyle; inspect measurements; duplicate; undo; redo; delete.`;
  return {
    caseId: id,
    workspace: workspace.workspace,
    route: workspace.route,
    category,
    userGoal: `Validate ${seed} from user action through engine/model to rendered output.`,
    exactInputOrUiActions: action,
    objectsAlreadyPresent: index % 5 === 0 ? "Baseline scene plus two existing related objects for overlap/dependency checks." : "Fresh workspace after Clear All/New Scene.",
    requiredSettings: workspace.key === "2D_GRAPH" ? "Preserve query variables v_a=1 and v_b=0; grid and axes visible." : "Default workspace settings unless the action explicitly changes style, view, resolution, or material.",
    expectedEngineInterpretation: workspace.mode === "textbox" ? `Expression/command '${seed}' is captured, normalized, tokenized/parsed with documented AST or safe unsupported error.` : `${seed} command creates typed construction/scene object with stable id, dependencies, transform/style state, and no stale selection leakage.`,
    expectedMathematicalProperties: expectedMath(workspace, seed),
    expectedVisualResult: workspace.mode === "textbox" ? "Rendered graph/surface/result matches independent reference checkpoints and does not connect invalid domains." : "Rendered object appears at intended coordinates with visible selected border glow, handles/selection state, and correct layer/depth behavior.",
    referenceCheckpoints: referenceCheckpoints(workspace, seed),
    interactionSteps: ["initial create/run", "select/inspect", "edit numeric/text/style property", "move/drag/adjust view", "undo", "redo", "delete or clear"],
    expectedResultAfterEditing: "Edited model, mathematical properties, displayed output, property panel, and undo/redo history remain synchronized.",
    performanceExpectation: index % 10 === 0 ? "Stress case remains responsive; no console errors; Clear All releases scene/model state." : "Normal operation completes within one interaction frame budget perceptually and without stale output.",
    accessibilityExpectation: "Keyboard focus remains visible; controls have labels; pointer workflow has touch-compatible target size; invalid input is announced or visibly recoverable.",
    baselineStatus: "NOT_EXECUTED",
    actualOutput: "Pending visible UI audit.",
    defectId: "",
    evidence: "",
  };
}

function expectedMath(workspace, seed) {
  if (workspace.key === "2D_GEOMETRY") return `Independent Euclidean checks for ${seed}: coordinates, lengths, angles, area/perimeter where applicable, and dependent constraints after drag.`;
  if (workspace.key === "3D_GEOMETRY") return `Independent 3D checks for ${seed}: transform matrix, dimensions, surface area/volume/measurement where applicable, and camera-stable selection after edits.`;
  if (workspace.key === "CAS") return `Symbolic result for ${seed} must preserve exactness/domain; numerical substitution or differentiation/integration inverse check verifies equivalence.`;
  if (workspace.key === "3D_GRAPH") return `Surface z=f(x,y) for ${seed} must map x,y,z correctly, omit invalid samples, and match reference sampled points.`;
  return `Curve y=f(x) for ${seed} must preserve URL parameters, domain gaps, roots/intercepts/asymptotes, and reference sampled values.`;
}

function referenceCheckpoints(workspace, seed) {
  if (workspace.mode === "textbox") return [`capture exact input: ${seed}`, "normalized syntax", "AST/engine interpretation", "sample/reference values", "rendered output/result", "post-edit consistency"];
  return ["tool selection", "pointer coordinates", "internal object id/type", "dependencies/constraints", "measurements/properties", "rendered selected state", "post-edit consistency"];
}

function matrixMarkdown(workspace, cases) {
  const header = workspace.mode === "textbox"
    ? "| ID | Category | Exact textbox input | Captured input | Normalized input | Engine interpretation/AST | Expected result | Reference checks | Actual output | Result | Defect ID | Evidence |\n|---|---|---|---|---|---|---|---|---|---|---|---|"
    : "| ID | Tool | Exact UI actions | Pointer coordinates | Internal object created | Constraints | Expected properties | Actual properties | Move/resize/rotate test | Property changes | Undo/redo | Result | Defect ID | Evidence |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|";
  const rows = cases.map((testCase) => workspace.mode === "textbox"
    ? `| ${testCase.caseId} | ${testCase.category} | ${escapeCell(testCase.exactInputOrUiActions)} | Pending | Pending | ${escapeCell(testCase.expectedEngineInterpretation)} | ${escapeCell(testCase.expectedMathematicalProperties)} | ${escapeCell(testCase.referenceCheckpoints.join("; "))} | Pending | NOT_EXECUTED |  |  |`
    : `| ${testCase.caseId} | ${testCase.category} | ${escapeCell(testCase.exactInputOrUiActions)} | Pending UI coordinates | Pending | Pending | ${escapeCell(testCase.expectedMathematicalProperties)} | Pending | Pending | Pending | Pending | NOT_EXECUTED |  |  |`);
  return `# ${workspace.workspace} 100 Case Test Matrix\n\nRoute: ${workspace.route}\n\n${header}\n${rows.join("\n")}\n`;
}

function traceName(workspace) {
  if (workspace.key === "CAS") return "CAS_INPUT_ENGINE_RESULT_TRACE.md";
  return workspace.mode === "textbox" ? `${workspace.key}_INPUT_ENGINE_RENDER_TRACE.md` : `${workspace.key}_ACTION_ENGINE_RENDER_TRACE.md`;
}

function traceMarkdown(workspace) {
  return `# ${workspace.workspace} Action/Input Engine Render Trace\n\nRoute: ${workspace.route}\n\nStatus: trace template created. Populate during visible UI execution with captured input/action, normalized expression or object command, model state, engine result, rendered output, and post-edit verification.\n`;
}

function optionsMarkdown(workspace) {
  return `# ${workspace.workspace} Options Audit\n\nRoute: ${workspace.route}\n\nStatus: inventory pending visible UI inspection. Record every tool, button, menu, context menu, property control, input, slider, color/style control, view control, export/import control, keyboard shortcut, and responsive/mobile control.\n`;
}

function defectsMarkdown(workspace) {
  return `# ${workspace.workspace} Defects\n\nNo workspace-specific defects from the 100-case audit recorded yet.\n\n| Defect ID | Case ID | Severity | Class | Reproduction | Expected | Actual | Root cause | Fix | Retest |\n|---|---|---|---|---|---|---|---|---|---|\n`;
}

function regressionMarkdown(workspace) {
  return `# ${workspace.workspace} Regression Report\n\nRoute: ${workspace.route}\n\nCycle 1: NOT RUN\n\nCycle 2: NOT RUN\n`;
}

function write(fileName, content) {
  fs.writeFileSync(path.join(root, fileName), content);
}

function escapeCell(value) {
  return String(value).replace(/\|/g, "\\|").replace(/\n/g, " ");
}
