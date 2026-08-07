import type { StrengthenedLesson } from "../strengthenedLessonSchema";

export type Geometry3DBatchChallenge = {
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
  definition: string;
  keyRule: string;
  formulaLabel: string;
  formulaExpression: string;
  variables: [string, string][];
  misconception: [string, string, string];
  challenge: Geometry3DBatchChallenge;
};

const data: Record<number, Seed> = {
  378: item(378, "3D Coordinate System", "3d-coordinate-system", "A 3D coordinate system locates points with x, y, and z axes.", "Use ordered triples (x,y,z).", "3D point", "P=(x,y,z)", [["x,y,z", "coordinates"]], ["DROP_Z", "Using only x and y.", "Include the z-coordinate for height or depth."], "How many coordinates locate a 3D point?", "3"),
  379: item(379, "3D Points", "3d-points", "A 3D point is an exact position in space.", "The point (a,b,c) has x=a, y=b, and z=c.", "Point coordinates", "P=(a,b,c)", [["a,b,c", "coordinates"]], ["ORDER_SWAP", "Swapping coordinate order.", "Read x, then y, then z."], "For P=(2,3,4), what is z?", "4"),
  380: item(380, "Distance in 3D", "distance-in-3d", "Distance in 3D measures straight-line length between two space points.", "Use the 3D distance formula.", "3D distance", "d=sqrt((x2-x1)^2+(y2-y1)^2+(z2-z1)^2)", [["x,y,z", "coordinates"], ["d", "distance"]], ["TWO_D_ONLY", "Forgetting the z difference.", "Include all three squared differences."], "Find the distance from (0,0,0) to (1,2,2).", "3"),
  381: item(381, "Lines in 3D", "lines-in-3d", "A 3D line is described by a point and a direction vector.", "Use r=a+lambda v.", "Vector line", "r=a+lambda v", [["a", "point on line"], ["v", "direction vector"]], ["POINT_ONLY", "Giving only one point for a line.", "A line also needs direction."], "What extra object does a point need to define a 3D line?", "direction"),
  382: item(382, "Planes", "planes", "A plane is a flat surface extending in two independent directions.", "A normal vector gives the plane equation.", "Plane equation", "n dot (r-a)=0", [["n", "normal vector"], ["a", "point on plane"]], ["NORMAL_AS_IN_PLANE", "Thinking the normal lies along the plane.", "The normal is perpendicular to the plane."], "What vector is perpendicular to a plane?", "normal"),
  383: item(383, "Parallel and Perpendicular Planes", "parallel-and-perpendicular-planes", "Plane relationships can be tested with normal vectors.", "Parallel planes have parallel normals; perpendicular planes have perpendicular normals.", "Plane normal test", "n1 parallel n2 or n1 dot n2=0", [["n1,n2", "normal vectors"]], ["COMPARE_POINTS", "Testing only points instead of normals.", "Use normal vectors for plane relationships."], "If plane normals have dot product 0, what is the plane relationship?", "perpendicular"),
  384: item(384, "Line-Plane Intersection", "lineplane-intersection", "A line-plane intersection is where a line meets a plane.", "Substitute the line equation into the plane equation.", "Intersection test", "n dot (a+lambda v-p)=0", [["lambda", "line parameter"], ["n", "plane normal"]], ["NO_SUBSTITUTE", "Trying to see the answer without solving the parameter.", "Substitute and solve for the line parameter."], "What parameter is solved in a line-plane intersection?", "lambda"),
  385: item(385, "Plane-Plane Intersection", "planeplane-intersection", "Two non-parallel planes meet in a line.", "Solve both plane equations together.", "Plane pair", "n1 dot r=d1, n2 dot r=d2", [["n1,n2", "normal vectors"], ["r", "point vector"]], ["POINT_ONLY", "Expecting one point for two non-parallel planes.", "Two non-parallel planes usually intersect in a line."], "Two non-parallel planes usually meet in what?", "line"),
  386: item(386, "Angle Between Lines", "angle-between-lines", "The angle between lines is the angle between their direction vectors.", "Use the dot product formula.", "Line angle", "cos theta=|u dot v|/(|u||v|)", [["u,v", "direction vectors"], ["theta", "angle"]], ["USE_POINTS", "Using points instead of direction vectors.", "Use direction vectors."], "Which vectors give the angle between lines?", "direction"),
  387: item(387, "Angle Between Planes", "angle-between-planes", "The angle between planes is the angle between their normal vectors.", "Use normals in the dot product formula.", "Plane angle", "cos theta=|n1 dot n2|/(|n1||n2|)", [["n1,n2", "normal vectors"]], ["USE_EDGES", "Using random drawn edges instead of normals.", "Use normal vectors."], "Which vectors give the angle between planes?", "normal"),
  388: item(388, "Angle Between Line and Plane", "angle-between-line-and-plane", "The angle between a line and plane is measured from the line to its projection on the plane.", "It is complementary to the angle between the line direction and plane normal.", "Line-plane angle", "sin theta=|v dot n|/(|v||n|)", [["v", "line direction"], ["n", "plane normal"]], ["USE_COS_DIRECT", "Using the normal angle as the line-plane angle.", "Take the complementary relationship into account."], "Line-plane angle uses line direction and plane what?", "normal"),
  389: item(389, "Point-to-Plane Distance", "point-to-plane-distance", "Point-to-plane distance is the shortest perpendicular distance from a point to a plane.", "Use the absolute plane equation divided by normal length.", "Point-plane distance", "d=|Ax0+By0+Cz0+D|/sqrt(A^2+B^2+C^2)", [["A,B,C", "normal components"], ["x0,y0,z0", "point"]], ["ALONG_PLANE", "Measuring along the plane surface.", "Shortest distance is perpendicular to the plane."], "Point-to-plane distance is measured in what direction?", "perpendicular"),
  390: item(390, "3D Vectors", "3d-vectors", "A 3D vector has components in x, y, and z directions.", "Magnitude is sqrt(x^2+y^2+z^2).", "Vector magnitude", "|v|=sqrt(x^2+y^2+z^2)", [["x,y,z", "components"]], ["DROP_COMPONENT", "Forgetting the z component.", "Use all three components."], "Find |(1,2,2)|.", "3"),
  391: item(391, "Cube", "cube", "A cube is a solid with six equal square faces.", "Volume is side cubed.", "Cube volume", "V=s^3", [["s", "side length"]], ["AREA_AS_VOLUME", "Using s^2 for volume.", "Volume is s^3."], "Find cube volume when side is 3.", "27"),
  392: item(392, "Cuboid", "cuboid", "A cuboid is a box-shaped solid with rectangular faces.", "Volume is length times width times height.", "Cuboid volume", "V=lwh", [["l,w,h", "dimensions"]], ["MISS_HEIGHT", "Multiplying only length and width.", "Include height for volume."], "Find volume for l=2,w=3,h=4.", "24"),
  393: item(393, "Prism", "prism", "A prism has identical parallel bases joined by rectangular side faces.", "Volume is base area times height.", "Prism volume", "V=Bh", [["B", "base area"], ["h", "height"]], ["PERIMETER_BASE", "Using base perimeter instead of base area.", "Use base area."], "If base area is 10 and height is 4, find volume.", "40"),
  394: item(394, "Pyramid", "pyramid", "A pyramid has a polygon base and triangular faces meeting at one apex.", "Volume is one third base area times height.", "Pyramid volume", "V=Bh/3", [["B", "base area"], ["h", "height"]], ["PRISM_FORMULA", "Using Bh like a prism.", "A pyramid volume is one third of the matching prism."], "If B=12 and h=3, find pyramid volume.", "12"),
  395: item(395, "Tetrahedron", "tetrahedron", "A tetrahedron is a polyhedron with four triangular faces.", "A regular tetrahedron has all edges equal.", "Regular tetrahedron volume", "V=sqrt(2)s^3/12", [["s", "edge length"]], ["CUBE_CONFUSION", "Treating a tetrahedron like a cube.", "Use tetrahedron facts and triangular faces."], "How many faces does a tetrahedron have?", "4"),
  396: item(396, "Regular Polyhedra", "regular-polyhedra", "A regular polyhedron has congruent regular polygon faces and the same arrangement at every vertex.", "There are exactly five Platonic solids.", "Platonic solids", "count=5", [["count", "number of Platonic solids"]], ["MANY_ANY", "Thinking any regular-looking solid is Platonic.", "Only five regular convex polyhedra exist."], "How many Platonic solids are there?", "5"),
};

export function seed(id: number) {
  return data[id];
}

export type Geometry3DBatchSeed = Seed;

export function geometry3DBatchLesson(item: Seed): StrengthenedLesson {
  const code = item.misconception[0];
  return {
    id: item.id,
    title: item.title,
    route: `/lessons/3d-mathematics/${item.id}-${item.slug}`,
    category: "3D Mathematics",
    topic: "3D Geometry and Solids",
    lessonType: "visual_exploration",
    learningObjectives: [`Define ${item.title}.`, `Use the rule: ${item.keyRule}`, `Correct a common ${item.title} mistake.`],
    prerequisites: ["Coordinate plane", "Vectors", "Basic geometry"],
    keyVocabulary: [{ term: item.title, meaning: item.definition }, { term: "z-axis", meaning: "The axis that shows height or depth in 3D." }],
    introduction: `${item.title} is a 3D geometry idea. It matters in building design, maps, games, engineering, and measuring real objects.`,
    basicIdea: `${item.definition} The key rule is: ${item.keyRule} A common mistake is ${item.misconception[1]}`,
    howItWorks: "Choose the point, vector, plane, or solid. Read all needed dimensions. Apply the 3D formula and check the visual scene.",
    whyItWorks: "3D geometry extends flat geometry by adding a third direction, so distance, angle, area, and volume must include depth.",
    definitions: [{ id: `${item.id}-definition`, statement: item.definition }],
    facts: [{ id: `${item.id}-fact`, statement: item.keyRule }],
    formulas: [{ id: `${item.id}-formula`, label: item.formulaLabel, expression: item.formulaExpression, variables: item.variables.map(([symbol, meaning]) => ({ symbol, meaning })), exactness: "definition" }],
    conditionsAndRestrictions: ["Use consistent units.", "For angles, choose direction or normal vectors correctly.", "For volume, use perpendicular height."],
    representations: [{ id: `${item.id}-solid`, type: "solid_3d", learningPurpose: `Show the spatial model for ${item.title}.` }],
    workedExamples: [{ id: `${item.id}-worked-1`, prompt: item.challenge.prompt, steps: ["Identify the 3D object or relation.", "Apply the formula.", "Check units and direction."], answer: item.challenge.expected }],
    realLifeExamples: [{ id: `${item.id}-real-1`, context: "Architecture", connection: "3D geometry measures rooms, roofs, and structural spaces." }, { id: `${item.id}-real-2`, context: "Computer games", connection: "Objects need positions, directions, and volumes." }, { id: `${item.id}-real-3`, context: "Packaging", connection: "Solid formulas estimate material and capacity." }],
    misconceptions: [{ code, mistake: item.misconception[1], correction: item.misconception[2] }],
    interaction: { id: `${item.id}-interaction`, learningPurpose: `Use the controlled 3D scene to connect ${item.title} with measurement and orientation.`, parameters: [{ id: "size", label: "Size or domain", validRange: [1, 8] }, { id: "height", label: "Height or section", validRange: [1, 10] }, { id: "orbit", label: "Orbit angle", validRange: [0, 360] }], initialState: `Start with ${item.formulaLabel}.`, dynamicFeedback: "The solid, axes, section, and measurements update together.", successCriteria: ["Read all 3D dimensions", "Use the formula", "Explain the misconception"], accessibilityAlternative: "Provide dimensions, orientation, volume, and surface values as text." },
    guidedExploration: [{ id: "predict", prompt: "Predict what changes when size changes." }, { id: "observe", prompt: "Orbit the scene and read the axes." }, { id: "explain", prompt: `Explain using ${item.formulaLabel}.` }],
    practice: [practice(`${item.id}-recognition`, `Name the key rule for ${item.title}.`, item.keyRule, code, "recognition"), practice(`${item.id}-direct`, item.challenge.prompt, item.challenge.expected, code, "direct"), practice(`${item.id}-multi`, `State the correction for ${item.title}.`, item.misconception[2], code, "multi_step"), practice(`${item.id}-error`, `What is wrong with this mistake: ${item.misconception[1]}`, item.misconception[2], code, "error_diagnosis"), practice(`${item.id}-transfer`, `Give one real use of ${item.title}.`, "Architecture", code, "transfer")],
    challenge: { id: `${item.id}-challenge`, prompt: item.challenge.prompt, successCriteria: ["Uses the 3D rule", "Checks all required dimensions", "Avoids the common mistake"], hints: [item.challenge.hint, `Use ${item.formulaLabel}.`] },
    exitCheck: [{ id: `${item.id}-exit`, prompt: `State one exact check for ${item.title}.`, answer: item.misconception[2], criterion: "Names the accepted 3D geometry rule." }],
    accessibilityNotes: ["Announce axes, dimensions, and measurements.", "Do not rely only on perspective or colour."],
    expertReviewRequired: false,
  };
}

function item(id: number, title: string, slug: string, definition: string, keyRule: string, formulaLabel: string, formulaExpression: string, variables: [string, string][], misconception: [string, string, string], prompt: string, expected: string): Seed {
  return { id, title, slug, definition, keyRule, formulaLabel, formulaExpression, variables, misconception, challenge: { prompt, expected, hint: `Use ${formulaLabel}.`, kind: Number.isFinite(Number(expected)) ? "numeric" : "keywords", factoryId: `geometry3d.${slug}` } };
}

export function geometry3DBatchChallenge(item: Seed) {
  return item.challenge;
}

function practice(id: string, prompt: string, answer: string, misconceptionTag: string, difficulty: StrengthenedLesson["practice"][number]["difficulty"]): StrengthenedLesson["practice"][number] {
  return { id, prompt, answer, hints: ["Use all three dimensions.", "Check the displayed formula.", "Read axes and units carefully."], workedSolution: ["Identify the 3D object.", "Apply the formula.", "Check direction or units."], misconceptionTag, difficulty, parameterConstraints: ["Use positive lengths for solids."] };
}
