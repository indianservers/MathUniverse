export type CommandGroup =
  | "Algebra"
  | "Geometry 2D"
  | "Geometry 3D"
  | "Calculus"
  | "Lists And Tables"
  | "Matrices"
  | "Spreadsheet"
  | "Transformations"
  | "Scripting"
  | "Teaching";

export type WorkspaceCommandSpec = {
  name: string;
  aliases: string[];
  group: CommandGroup;
  signature: string;
  description: string;
  implemented: boolean;
  examples: string[];
};

const specs: WorkspaceCommandSpec[] = [
  command("Plot", "Algebra", "Plot[expression]", "Graph a function or relation.", true, ["Plot[sin(x)]", "plot x^2-4"], ["Graph", "Function"]),
  command("Solve", "Algebra", "Solve[equation]", "Solve equations exactly where possible and numerically otherwise.", true, ["Solve[x^2-5*x+6=0]"], ["Roots"]),
  command("Root", "Algebra", "Root[polynomial]", "Find real roots of a polynomial or expression.", true, ["Root[x^2-4]"], ["Zeros"]),
  command("Extremum", "Algebra", "Extremum[function]", "Find local extrema over the visible domain.", true, ["Extremum[x^2-4*x+1]"], ["Vertex"]),
  command("Factor", "Algebra", "Factor[expression]", "Factor supported algebraic expressions.", true, ["Factor[x^2-5*x+6]"], []),
  command("Expand", "Algebra", "Expand[expression]", "Expand products and powers.", true, ["Expand[(x+2)(x+3)]"], []),
  command("Simplify", "Algebra", "Simplify[expression]", "Simplify exact expressions.", true, ["Simplify[2*x+x]"], []),
  command("Substitute", "Algebra", "Substitute[expression, a=value]", "Substitute values into an expression.", true, ["Substitute[x^2+a, a=3]"], ["Replace"]),
  command("Derivative", "Calculus", "Derivative[function]", "Differentiate a function symbolically where possible.", true, ["Derivative[x^3-2*x]"], ["Diff"]),
  command("Integral", "Calculus", "Integral[function]", "Compute an antiderivative where possible.", true, ["Integral[3*x^2]"], ["Integrate"]),
  command("Limit", "Calculus", "Limit[function, variable, value]", "Compute or estimate a limit.", true, ["Limit[sin(x)/x, x, 0]"], []),
  command("Series", "Calculus", "Series[function, variable, center, order]", "Create a Taylor-style local series approximation.", true, ["Series[sin(x), x, 0, 5]"], []),
  command("Intersect", "Geometry 2D", "Intersect[object1, object2]", "Find intersections of functions or supported geometry objects.", true, ["Intersect[x^2, 2*x+3]"], ["Intersection"]),
  command("Point", "Geometry 2D", "Point[x, y]", "Create a point from coordinates.", true, ["Point[2, 3]"], []),
  command("Line", "Geometry 2D", "Line[pointA, pointB]", "Create a line from two points.", true, ["Line[(0,0), (4,3)]"], []),
  command("Segment", "Geometry 2D", "Segment[pointA, pointB]", "Create a bounded segment.", true, ["Segment[(0,0), (4,3)]"], []),
  command("Ray", "Geometry 2D", "Ray[pointA, pointB]", "Create a ray.", true, ["Ray[(0,0), (4,3)]"], []),
  command("Vector", "Geometry 2D", "Vector[pointA, pointB]", "Create a vector.", true, ["Vector[(0,0), (3,2)]"], []),
  command("Circle", "Geometry 2D", "Circle[center, radius]", "Create a circle by center and radius.", true, ["Circle[(0,0), 4]"], []),
  command("Conic", "Geometry 2D", "Conic[equation]", "Create a conic from an equation.", true, ["Conic[x^2/9+y^2/4=1]"], []),
  command("Tangent", "Geometry 2D", "Tangent[point, object]", "Create tangent lines.", true, ["Tangent[(3,0), x^2+y^2=9]"], []),
  command("Locus", "Geometry 2D", "Locus[point, slider]", "Generate a locus trace.", true, ["Locus[(2,1), t]"], []),
  command("Relation", "Geometry 2D", "Relation[object1, object2]", "Check geometric relationships.", true, ["Relation[Line[(0,0),(1,1)], Line[(0,1),(1,2)]]"], []),
  command("Area", "Geometry 2D", "Area[object]", "Measure area.", true, ["Area[circle radius 5]"], []),
  command("Distance", "Geometry 2D", "Distance[object1, object2]", "Measure distance.", true, ["Distance[(0,0), (3,4)]"], []),
  command("Angle", "Geometry 2D", "Angle[A, B, C]", "Measure or construct an angle.", true, ["Angle[(1,0), (0,0), (0,1)]"], []),
  command("Surface", "Geometry 3D", "Surface[z=f(x,y)]", "Create a 3D surface.", true, ["Surface[z=sin(x)*cos(y)]"], []),
  command("Plane", "Geometry 3D", "Plane[point, normal]", "Create a 3D plane.", true, ["Plane[(0,0,1), (0,0,1)]"], []),
  command("Sphere", "Geometry 3D", "Sphere[center, radius]", "Create a sphere.", true, ["Sphere[(0,0,0), 2]"], []),
  command("Cone", "Geometry 3D", "Cone[center, radius, height]", "Create a cone.", true, ["Cone[(0,0,0), 2, 4]"], []),
  command("Cylinder", "Geometry 3D", "Cylinder[center, radius, height]", "Create a cylinder.", true, ["Cylinder[(0,0,0), 2, 4]"], []),
  command("Prism", "Geometry 3D", "Prism[base, height]", "Create a prism.", true, ["Prism[triangle, 4]"], []),
  command("Pyramid", "Geometry 3D", "Pyramid[base, height]", "Create a pyramid.", true, ["Pyramid[square, 4]"], []),
  command("Slice", "Geometry 3D", "Slice[solid, plane]", "Show a plane-solid cross-section.", true, ["Slice[Sphere[(0,0,0), 3], z=1]"], []),
  command("Gizmo", "Geometry 3D", "Gizmo[translate|rotate|scale]", "Show transform handles for a selected 3D object.", true, ["Gizmo[translate]", "Gizmo[rotate]", "Gizmo[scale]"], []),
  command("Measure3D", "Geometry 3D", "Measure3D[solid]", "Measure 3D volume, surface area, direction, or normal.", true, ["Measure3D[Sphere[(0,0,0), 3]]"], []),
  command("Table", "Lists And Tables", "Table[function, start, end, step]", "Create a value table.", true, ["Table[sin(x), -3, 3, 0.5]"], []),
  command("DynamicTable", "Lists And Tables", "DynamicTable[f(x), g(x), start, end, step]", "Create a linked multi-function table with highlights and export data.", true, ["DynamicTable[sin(x), cos(x), -3, 3, 0.5]"], ["ValueTable"]),
  command("Sequence", "Lists And Tables", "Sequence[expression, variable, start, end, step]", "Generate a sequence.", true, ["Sequence[n^2, n, 1, 6]"], ["Seq"]),
  command("List", "Lists And Tables", "List[a, b, c]", "Create a list object.", true, ["List[1, 2, 3]"], []),
  command("Matrix", "Matrices", "Matrix[[a,b],[c,d]]", "Create a matrix object.", true, ["Matrix[[1,2],[3,4]]"], []),
  command("Determinant", "Matrices", "Determinant[matrix]", "Compute a determinant.", true, ["Determinant[[1,2],[3,4]]"], ["Det"]),
  command("Transpose", "Matrices", "Transpose[matrix]", "Transpose a matrix.", true, ["Transpose[[1,2],[3,4]]"], []),
  command("Inverse", "Matrices", "Inverse[matrix]", "Invert a supported square matrix.", true, ["Inverse[[1,2],[3,4]]"], []),
  command("Regression", "Spreadsheet", "Regression[type, range]", "Fit a regression model to table data.", true, ["Regression[linear, A1:B6]"], ["FitLine"]),
  command("FillDown", "Spreadsheet", "FillDown[source, range]", "Fill formulas through a range.", true, ["FillDown[C6, C7:C12]"], []),
  command("RangeCsv", "Spreadsheet", "RangeCsv[range]", "Export a spreadsheet range as CSV text.", true, ["RangeCsv[A1:C6]"], []),
  command("CAS", "Teaching", "CAS[command, expression]", "Create a linked CAS result card with graph and table verification prompts.", true, ["CAS[Factor, x^2-5*x+6]"], []),
  command("Rotate", "Transformations", "Rotate[point, angle, center]", "Rotate an object or coordinate point.", true, ["Rotate[(2,0), 90, (0,0)]"], []),
  command("Translate", "Transformations", "Translate[point, vector]", "Translate an object or coordinate point.", true, ["Translate[(2,1), (3,-1)]"], []),
  command("Dilate", "Transformations", "Dilate[point, factor, center]", "Scale an object or coordinate point from a center.", true, ["Dilate[(2,1), 2, (0,0)]"], []),
  command("Mirror", "Transformations", "Mirror[point, axisPointA, axisPointB]", "Reflect an object or coordinate point across a line.", true, ["Mirror[(2,1), (0,0), (1,0)]"], []),
  command("Slider", "Scripting", "Slider[name, min, max, step]", "Create an animatable variable.", true, ["Slider[a, -5, 5, 0.1]"], []),
  command("SetColor", "Scripting", "SetColor[object, color]", "Change object color.", true, ["SetColor[A, #06b6d4]"], []),
  command("ShowLabel", "Scripting", "ShowLabel[object, mode]", "Control object label display.", true, ["ShowLabel[A, both]"], []),
  command("SetVisible", "Scripting", "SetVisible[object, boolean]", "Show or hide an object.", true, ["SetVisible[A, false]"], []),
  command("SetTrace", "Scripting", "SetTrace[object, boolean]", "Toggle object trace.", true, ["SetTrace[c, true]"], []),
  command("SetOpacity", "Scripting", "SetOpacity[object, opacity]", "Change object opacity from 0 to 1.", true, ["SetOpacity[poly1, 0.45]"], []),
  command("StartAnimation", "Scripting", "StartAnimation[slider, speed]", "Animate a slider or scene.", true, ["StartAnimation[a, 1.5]"], []),
  command("StopAnimation", "Scripting", "StopAnimation[slider]", "Pause animation.", true, ["StopAnimation[scene]"], []),
  command("Activity", "Teaching", "Activity[template]", "Open a guided teaching activity.", true, ["Activity[circles]"], []),
  command("RevealStep", "Teaching", "RevealStep[number]", "Reveal a teacher presentation step.", true, ["RevealStep[2]"], []),
];

export const workspaceCommandCatalog = specs;

export function commandRegistrySummary() {
  const implemented = specs.filter((spec) => spec.implemented).length;
  const byGroup = specs.reduce<Record<CommandGroup, { total: number; implemented: number }>>((summary, spec) => {
    summary[spec.group] ??= { total: 0, implemented: 0 };
    summary[spec.group].total += 1;
    if (spec.implemented) summary[spec.group].implemented += 1;
    return summary;
  }, {} as Record<CommandGroup, { total: number; implemented: number }>);
  return {
    total: specs.length,
    implemented,
    planned: specs.length - implemented,
    byGroup,
  };
}

export function resolveCommandSpec(name: string) {
  const compact = name.trim().toLowerCase();
  return specs.find((spec) => [spec.name, ...spec.aliases].some((alias) => alias.toLowerCase() === compact));
}

export function normalizeCommandName(name: string) {
  return resolveCommandSpec(name)?.name.toLowerCase() ?? null;
}

export function commandExamplesFor(query: string, limit = 5) {
  const lower = query.toLowerCase();
  return specs
    .filter((spec) => spec.name.toLowerCase().includes(lower) || spec.group.toLowerCase().includes(lower) || spec.description.toLowerCase().includes(lower) || spec.aliases.some((alias) => alias.toLowerCase().includes(lower)))
    .slice(0, limit)
    .flatMap((spec) => spec.examples.slice(0, 1));
}

function command(name: string, group: CommandGroup, signature: string, description: string, implemented: boolean, examples: string[], aliases: string[]): WorkspaceCommandSpec {
  return { name, aliases, group, signature, description, implemented, examples };
}
