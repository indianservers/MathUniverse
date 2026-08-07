import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type Geometry3DAdvancedChallenge = {
  prompt: string;
  expected: string;
  hint: string;
  kind: "numeric" | "keywords" | "interaction";
  factoryId: string;
};

type Seed = {
  id: number;
  title: string;
  slug: string;
  topic: "3D Geometry and Solids" | "3D Functions and Surfaces";
  definition: string;
  keyRule: string;
  formulaLabel: string;
  formulaExpression: string;
  representation: "solid_3d" | "cross_section" | "surface_plot" | "coordinate_graph" | "vector_diagram" | "riemann_sum";
  variables: [string, string][];
  misconception: [string, string, string];
  challenge: Geometry3DAdvancedChallenge;
};

const data: Record<number, Seed> = {
  397: solid(397, "Cylinder", "cylinder", "A cylinder has two parallel circular bases joined by a curved surface.", "Volume is pi r squared h.", "Cylinder volume", "V=pi r^2 h", [["r", "radius"], ["h", "height"]], ["MISSING_PI", "Using r^2h without pi.", "Include pi because the base is a circle."], "Find cylinder volume when r=2 and h=3, using pi=3.14.", "37.68"),
  398: solid(398, "Cone", "cone", "A cone has a circular base and one apex.", "Volume is one third pi r squared h.", "Cone volume", "V=pi r^2 h/3", [["r", "radius"], ["h", "height"]], ["CYLINDER_FORMULA", "Using the cylinder formula for a cone.", "A cone is one third of the matching cylinder."], "Find cone volume when pi r^2 h is 30.", "10"),
  399: solid(399, "Sphere", "sphere", "A sphere is all points a fixed distance from a centre in 3D.", "Volume is four thirds pi r cubed.", "Sphere volume", "V=4pi r^3/3", [["r", "radius"]], ["CIRCLE_AREA", "Using pi r squared as sphere volume.", "Sphere volume uses r cubed."], "Find sphere volume when r=3 and pi=3.14. Round to 2 decimals.", "113.04"),
  400: solid(400, "Hemisphere", "hemisphere", "A hemisphere is half of a sphere.", "Volume is half the volume of a sphere.", "Hemisphere volume", "V=2pi r^3/3", [["r", "radius"]], ["FULL_SPHERE", "Using full sphere volume.", "A hemisphere is half a sphere."], "If a sphere volume is 80, what is one hemisphere volume?", "40"),
  401: solid(401, "Frustum", "frustum", "A frustum is the part left when the top of a cone or pyramid is cut off parallel to the base.", "For a conical frustum, use both radii and height.", "Conical frustum volume", "V=pi h(R^2+Rr+r^2)/3", [["R", "large radius"], ["r", "small radius"], ["h", "height"]], ["ONE_RADIUS", "Using only one radius.", "Use both top and bottom radii."], "A frustum formula needs how many radii?", "2"),
  402: solid(402, "Surface of Revolution", "surface-of-revolution", "A surface of revolution is made by rotating a curve around an axis.", "The surface comes from circumference times tiny arc length.", "Surface of revolution", "S=2pi int radius ds", [["radius", "distance to axis"], ["ds", "tiny arc length"]], ["VOLUME_SWAP", "Using a volume formula for surface area.", "Surface area uses circumference times arc length."], "Surface of revolution uses circumference times what?", "arc length"),
  403: solid(403, "Extrusion", "extrusion", "Extrusion makes a 3D solid by pushing a 2D shape through a distance.", "Volume is cross-section area times extrusion length.", "Extrusion volume", "V=A L", [["A", "cross-section area"], ["L", "extrusion length"]], ["PERIMETER_TIMES_LENGTH", "Using perimeter times length for volume.", "Use area times length for volume."], "If area is 6 and length is 5, find volume.", "30"),
  405: solid(405, "Cross-Sections", "cross-sections", "A cross-section is the shape made by slicing a solid with a plane.", "The slice shape depends on the solid and cutting plane.", "Cross-section area", "A_slice depends on plane position", [["A_slice", "slice area"], ["plane", "cutting plane"]], ["SAME_SHAPE", "Thinking every slice has the base shape.", "The angle and position of the slice can change the shape."], "A cross-section is made by slicing with what?", "plane", "cross_section"),
  406: solid(406, "Volume", "volume", "Volume measures the amount of 3D space inside a solid.", "Use cubic units and the formula that matches the solid.", "Volume units", "V in cubic units", [["V", "volume"]], ["SQUARE_UNITS", "Writing volume in square units.", "Volume uses cubic units."], "Volume is measured in what kind of units?", "cubic"),
  407: solid(407, "Surface Area", "surface-area", "Surface area is the total area of the outside faces or curved surface.", "Add all exposed surface parts.", "Surface area units", "SA=sum of exposed areas", [["SA", "surface area"]], ["VOLUME_UNITS", "Writing surface area in cubic units.", "Surface area uses square units."], "Surface area is measured in what kind of units?", "square"),
  408: solid(408, "Euler's Polyhedron Formula", "euler-s-polyhedron-formula", "Euler's polyhedron formula links vertices, edges, and faces of many convex polyhedra.", "For a convex polyhedron, V-E+F=2.", "Euler formula", "V-E+F=2", [["V", "vertices"], ["E", "edges"], ["F", "faces"]], ["ALL_SOLIDS", "Applying the formula to every possible 3D object.", "Use it for convex polyhedra in this lesson."], "For a cube, V-E+F equals what?", "2"),
  409: solid(409, "Transparent / X-Ray Mode", "transparent-x-ray-mode", "Transparent or X-ray mode lets hidden edges and inner slices be seen.", "It changes visibility, not the geometry.", "Visibility mode", "visible geometry = original geometry", [["visible geometry", "shown parts"]], ["CHANGES_SHAPE", "Thinking transparency changes measurements.", "Transparency only changes what you can see."], "Does X-ray mode change the solid's volume? yes or no.", "no"),
  410: solid(410, "Camera Controls", "camera-controls", "Camera controls change the viewing direction, zoom, or orbit.", "Changing the camera does not change the object.", "View transform", "object fixed, camera moves", [["camera", "viewer position"]], ["OBJECT_MOVES", "Thinking orbit changes the object itself.", "Only the view changes."], "Does orbiting the camera change the real solid? yes or no.", "no"),
  411: solid(411, "Orthographic Views", "orthographic-views", "Orthographic views show front, side, or top views without perspective shrinking.", "Parallel edges stay parallel in orthographic view.", "Orthographic projection", "parallel lines stay parallel", [["view", "front, side, or top"]], ["PERSPECTIVE", "Using perspective size changes in an orthographic view.", "Orthographic views avoid perspective shrinking."], "Do parallel edges stay parallel in orthographic view? yes or no.", "yes"),
  412: solid(412, "AR Placement", "ar-placement", "AR placement anchors a virtual 3D object in a real-world scene.", "Scale, orientation, and ground position must match the scene.", "AR transform", "world pose = position + rotation + scale", [["pose", "position and orientation"], ["scale", "size factor"]], ["NO_SCALE", "Placing an object without checking scale.", "AR needs correct scale and orientation."], "Name one thing AR placement must match: scale, colour, or title.", "scale"),
  413: surface(413, "Surface z=f(x,y)", "surface-z-f-x-y", "A surface z=f(x,y) gives one height z for each input pair (x,y).", "Choose x and y, then compute z.", "Function surface", "z=f(x,y)", [["x,y", "inputs"], ["z", "height"]], ["ONE_INPUT", "Using only x like a one-variable graph.", "A surface uses both x and y inputs."], "How many inputs does z=f(x,y) use?", "2"),
  414: surface(414, "Implicit Surfaces", "implicit-surfaces", "An implicit surface is defined by an equation involving x, y, and z.", "Points on the surface satisfy F(x,y,z)=0.", "Implicit surface", "F(x,y,z)=0", [["F", "3D equation"], ["x,y,z", "coordinates"]], ["SOLVE_Z_ALWAYS", "Assuming every surface must be solved for z.", "Implicit surfaces may stay as F(x,y,z)=0."], "Points on an implicit surface satisfy F(x,y,z)= what?", "0"),
  415: surface(415, "Parametric Surfaces", "parametric-surfaces", "A parametric surface uses two parameters to create 3D points.", "Use r(u,v)=(x(u,v),y(u,v),z(u,v)).", "Parametric surface", "r(u,v)=(x(u,v),y(u,v),z(u,v))", [["u,v", "parameters"], ["r", "position vector"]], ["ONE_PARAMETER", "Using one parameter for a full surface.", "A surface usually needs two parameters."], "How many parameters usually describe a surface?", "2"),
  416: surface(416, "Space Curves", "space-curves", "A space curve traces a path through 3D space.", "Use one parameter to give x, y, and z.", "Space curve", "r(t)=(x(t),y(t),z(t))", [["t", "parameter"], ["r(t)", "3D point"]], ["SURFACE_CONFUSION", "Using two parameters for a curve.", "A curve path uses one parameter."], "How many parameters does a basic space curve use?", "1"),
  417: surface(417, "Quadric Surfaces", "quadric-surfaces", "Quadric surfaces are 3D surfaces defined by second-degree equations.", "Squares of variables create ellipsoids, paraboloids, and hyperboloids.", "Quadric form", "Ax^2+By^2+Cz^2+...=0", [["A,B,C", "coefficients"], ["x,y,z", "variables"]], ["LINEAR_ONLY", "Treating a quadric like a plane.", "Quadrics include squared terms."], "Quadric surfaces use what degree of equation?", "2"),
  418: surface(418, "Cylindrical Coordinates", "cylindrical-coordinates", "Cylindrical coordinates locate points using radius, angle, and height.", "Use x=r cos theta, y=r sin theta, z=z.", "Cylindrical conversion", "x=r cos theta, y=r sin theta", [["r", "distance from z-axis"], ["theta", "angle"]], ["R_AS_X", "Treating r as x.", "r is distance from the z-axis."], "Cylindrical coordinates use r, theta, and what height coordinate?", "z"),
  419: surface(419, "Spherical Coordinates", "spherical-coordinates", "Spherical coordinates locate points using distance from origin and two angles.", "Use radius rho and two angles.", "Spherical coordinates", "(rho,theta,phi)", [["rho", "distance from origin"], ["theta,phi", "angles"]], ["ONE_ANGLE", "Using only one angle for full 3D direction.", "Spherical coordinates need two angles."], "How many angles are used in spherical coordinates?", "2"),
  420: surface(420, "Contour Curves", "contour-curves", "Contour curves show where a surface has the same height.", "Set f(x,y)=c for a chosen height c.", "Contour equation", "f(x,y)=c", [["c", "constant height"], ["f", "surface function"]], ["HEIGHT_CHANGES", "Letting height change along one contour.", "Height stays constant on a contour."], "On one contour curve, height is what?", "constant", "cross_section"),
  421: surface(421, "Level Surfaces", "level-surfaces", "A level surface is all points where a 3D function has one constant value.", "Set F(x,y,z)=c.", "Level surface", "F(x,y,z)=c", [["c", "constant value"], ["F", "3D function"]], ["CURVE_ONLY", "Thinking level sets in 3D are always curves.", "In 3D, a level set is often a surface."], "A level surface has F(x,y,z) equal to what?", "constant", "surface_plot"),
  422: surface(422, "Partial Derivatives", "partial-derivatives", "A partial derivative measures change with respect to one variable while others stay fixed.", "Hold the other variable constant.", "Partial derivative", "partial f/partial x", [["f", "function"], ["x", "chosen variable"]], ["CHANGE_ALL", "Changing x and y together.", "Hold other variables fixed."], "When finding partial f/partial x, what happens to y?", "fixed"),
  423: surface(423, "Gradient Vector", "gradient-vector", "The gradient vector points in the direction of steepest increase.", "It is made from the partial derivatives.", "Gradient", "grad f=(f_x,f_y,f_z)", [["f_x,f_y,f_z", "partial derivatives"]], ["ANY_DIRECTION", "Choosing any uphill direction.", "The gradient gives the steepest increase direction."], "The gradient points in the direction of steepest what?", "increase", "vector_diagram"),
  424: surface(424, "Tangent Plane", "tangent-plane", "A tangent plane is the flat plane that best matches a surface near a point.", "Use partial derivatives to build the local linear approximation.", "Tangent plane", "z-z0=f_x(x0,y0)(x-x0)+f_y(x0,y0)(y-y0)", [["f_x,f_y", "partial derivatives"], ["x0,y0,z0", "point"]], ["GLOBAL_PLANE", "Thinking the tangent plane matches the whole surface.", "It is a local approximation."], "A tangent plane is mainly local or global?", "local"),
  425: surface(425, "Normal Vector", "normal-vector", "A normal vector is perpendicular to a surface or plane.", "For F(x,y,z)=c, the gradient is normal to the level surface.", "Normal to level surface", "n=grad F", [["n", "normal vector"], ["grad F", "gradient"]], ["TANGENT_DIRECTION", "Thinking the normal lies along the surface.", "The normal is perpendicular."], "A normal vector is perpendicular or parallel to a surface?", "perpendicular", "vector_diagram"),
  426: surface(426, "Double Integrals", "double-integrals", "A double integral accumulates values over a 2D region.", "Add tiny area pieces f(x,y) dA.", "Double integral", "int int_R f(x,y) dA", [["R", "region"], ["dA", "tiny area"]], ["ONE_DIMENSION", "Using only dx over a region.", "Double integrals use area pieces dA."], "Double integrals add tiny what pieces?", "area", "riemann_sum"),
  427: surface(427, "Multivariable Optimisation", "multivariable-optimisation", "Multivariable optimisation finds maximum or minimum values of functions with more than one input.", "Critical points occur where the gradient is zero or constrained conditions hold.", "Critical condition", "grad f=0", [["grad f", "gradient"], ["f", "function"]], ["ONE_VARIABLE_TEST", "Using only one-variable derivative tests.", "Check all relevant partial derivatives or constraints."], "For an unconstrained critical point, grad f equals what?", "0"),
};

export function seed(id: number) {
  return data[id];
}

export type Geometry3DAdvancedSeed = Seed;

export function geometry3DAdvancedLesson(item: Seed): StrengthenedLesson {
  const code = item.misconception[0];
  return {
    id: item.id,
    title: item.title,
    route: `/lessons/3d-mathematics/${item.id}-${item.slug}`,
    category: "3D Mathematics",
    topic: item.topic,
    lessonType: "visual_exploration",
    learningObjectives: [`Define ${item.title}.`, `Use the rule: ${item.keyRule}`, `Correct a common ${item.title} mistake.`],
    prerequisites: ["3D coordinates", "Functions", "Vectors", "Measurement units"],
    keyVocabulary: [{ term: item.title, meaning: item.definition }, { term: "Surface", meaning: "A two-dimensional shape living in 3D space." }],
    introduction: `${item.title} is a 3D mathematics idea. It matters in engineering, design, graphics, physics, and measurement of real spaces.`,
    basicIdea: `${item.definition} The key rule is: ${item.keyRule} A common mistake is ${item.misconception[1]}`,
    howItWorks: "Choose the solid, surface, region, or variable. Read all needed values. Apply the matching 3D rule and check the visual scene.",
    whyItWorks: "3D mathematics tracks height, depth, direction, and accumulation, so formulas must match the geometry and units.",
    definitions: [{ id: `${item.id}-definition`, statement: item.definition }],
    facts: [{ id: `${item.id}-fact`, statement: item.keyRule }],
    formulas: [{ id: `${item.id}-formula`, label: item.formulaLabel, expression: item.formulaExpression, variables: item.variables.map(([symbol, meaning]) => ({ symbol, meaning })), exactness: "definition" }],
    conditionsAndRestrictions: ["Use consistent units.", "Check domain, axis, or coordinate convention.", "For surfaces, state which variables are fixed or changing."],
    representations: [{ id: `${item.id}-representation`, type: item.representation, learningPurpose: `Show the spatial model for ${item.title}.` }],
    workedExamples: [{ id: `${item.id}-worked-1`, prompt: item.challenge.prompt, steps: ["Identify the 3D object or surface.", "Apply the displayed rule.", "Check units, variables, or direction."], answer: item.challenge.expected }],
    realLifeExamples: [{ id: `${item.id}-real-1`, context: "Engineering design", connection: "3D formulas check shape, strength, and capacity." }, { id: `${item.id}-real-2`, context: "Computer graphics", connection: "Surfaces and coordinates place visible objects." }, { id: `${item.id}-real-3`, context: "Physics", connection: "Fields and surfaces describe changing quantities in space." }],
    misconceptions: [{ code, mistake: item.misconception[1], correction: item.misconception[2] }],
    interaction: { id: `${item.id}-interaction`, learningPurpose: `Use the controlled 3D scene to connect ${item.title} with formula and measurement.`, parameters: [{ id: "size", label: "Size or domain", validRange: [1, 8] }, { id: "height", label: "Height or section", validRange: [-3, 10] }, { id: "orbit", label: "Orbit angle", validRange: [0, 360] }], initialState: `Start with ${item.formulaLabel}.`, dynamicFeedback: "The scene, axes, surface or solid, and measurements update together.", successCriteria: ["Read the 3D model", "Use the formula", "Explain the misconception"], accessibilityAlternative: "Provide dimensions, coordinates, formula values, and orientation as text." },
    guidedExploration: [{ id: "predict", prompt: "Predict what changes before moving a control." }, { id: "observe", prompt: "Move one control and read the 3D output." }, { id: "explain", prompt: `Explain using ${item.formulaLabel}.` }],
    practice: [practice(`${item.id}-recognition`, `Name the key rule for ${item.title}.`, item.keyRule, code, "recognition"), practice(`${item.id}-direct`, item.challenge.prompt, item.challenge.expected, code, "direct"), practice(`${item.id}-multi`, `State the correction for ${item.title}.`, item.misconception[2], code, "multi_step"), practice(`${item.id}-error`, `What is wrong with this mistake: ${item.misconception[1]}`, item.misconception[2], code, "error_diagnosis"), practice(`${item.id}-transfer`, `Give one real use of ${item.title}.`, "Engineering design", code, "transfer")],
    challenge: { id: `${item.id}-challenge`, prompt: item.challenge.prompt, successCriteria: ["Uses the 3D rule", "Checks variables and units", "Avoids the common mistake"], hints: [item.challenge.hint, `Use ${item.formulaLabel}.`] },
    exitCheck: [{ id: `${item.id}-exit`, prompt: `State one exact check for ${item.title}.`, answer: item.misconception[2], criterion: "Names the accepted 3D rule." }],
    accessibilityNotes: ["Announce axes, values, and measurements.", "Do not rely only on perspective or colour."],
    expertReviewRequired: false,
  };
}

function solid(id: number, title: string, slug: string, definition: string, keyRule: string, formulaLabel: string, formulaExpression: string, variables: [string, string][], misconception: [string, string, string], prompt: string, expected: string, representation: Seed["representation"] = "solid_3d"): Seed {
  return base(id, title, slug, "3D Geometry and Solids", definition, keyRule, formulaLabel, formulaExpression, variables, misconception, prompt, expected, representation);
}

function surface(id: number, title: string, slug: string, definition: string, keyRule: string, formulaLabel: string, formulaExpression: string, variables: [string, string][], misconception: [string, string, string], prompt: string, expected: string, representation: Seed["representation"] = "surface_plot"): Seed {
  return base(id, title, slug, "3D Functions and Surfaces", definition, keyRule, formulaLabel, formulaExpression, variables, misconception, prompt, expected, representation);
}

function base(id: number, title: string, slug: string, topic: Seed["topic"], definition: string, keyRule: string, formulaLabel: string, formulaExpression: string, variables: [string, string][], misconception: [string, string, string], prompt: string, expected: string, representation: Seed["representation"]): Seed {
  return { id, title, slug, topic, definition, keyRule, formulaLabel, formulaExpression, variables, representation, misconception, challenge: { prompt, expected, hint: `Use ${formulaLabel}.`, kind: Number.isFinite(Number(expected)) ? "numeric" : "keywords", factoryId: `geometry3d.${slug}` } };
}

export function geometry3DAdvancedChallenge(item: Seed) {
  return item.challenge;
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Read all needed variables.", "Use the displayed formula.", "Check units and direction."], workedSolution: ["Identify the object or surface.", "Apply the rule.", "Check the result."], misconceptionTag, difficulty, parameterConstraints: ["Use finite values and valid dimensions."] };
}
