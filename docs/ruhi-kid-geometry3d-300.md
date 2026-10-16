# Ruhi: 300 child-style 3D geometry requests

All 300 questions for the 3D geometry workspace from the conversation are included in the local semantic training corpus and handled by bounded language rules. Numeric coordinates, lengths, angles, and point names are extracted from the question and evaluated against the current scene. This change updates intent parsing, geometry execution, renderer support, and training examples; it does not fine-tune neural weights.

## Expected behavior

- **271 success** examples.
- **14 ambiguous** examples.
- **9 invalid** examples.
- **6 unsupported** examples.

Clarification requests retain pending object choices, multi-object groups, axis, angle, factor, width, direction, and opacity slots. The answer UI provides a checkbox picker when a request needs several objects; picking one does not execute a scene edit. No scene change is made until the necessary values and targets are available. Invalid inputs and unsupported actions leave the scene untouched.

The original wording is preserved. Questions 34 and 234 ask for the same three-point plane construction.

## Implementation

- Creates primitives, named points, dependent lines/triangles/planes, arbitrary four-point tetrahedra, cube nets, and slice geometry.
- Evaluates spatial coordinates, topology, distances, vector arithmetic, line/plane relationships, containment, intersections, volume, and surface area using current scene data.
- Applies movement, rotation, reflection, sizing, color, outlines, visibility, locking, selection, duplication, and deletion through the existing transaction planner.
- Connects opacity and wireframe controls to native 3D transforms and outline colors to rendered edge geometry.
- Keeps linked tetrahedra and plane-intersection lines current when their parents move. Sphere, box, and base-parallel cone cross-sections recompute when their slicing plane changes.
- Validates saved appearance values and preserves geometry and appearance through Undo/Redo and persistence.

## Limits stated in answers

Individual restoration to an arbitrary earlier position, thick mesh edges, and a global hide-all-labels control remain unsupported. Save, Load/Import, and camera reset requests direct the child to the existing workspace controls without claiming those actions completed. Ellipsoid surface area and unsupported solid families are not guessed. Circle sections use a 64-vertex polygon for display; numerical radii are computed analytically.

## Verification

Each question is exercised through the real chat entry point and through a native 3D transform/inventory adapter. Geometry-writing tests create the renderer's Three.js meshes and check that their coordinates are finite. Separate checks use authored numeric and boolean answers, changed coordinates/dimensions, linked construction updates, pending-answer sequences, opacity/material state, hidden-object restoration, and geometry preservation for unsuccessful requests. Existing ray/vector reflection commands are checked to ensure that pronouns such as “it” are not misread as point labels.

Final regression: **8,541 tests passed, 0 failed**. Changed core files pass scoped TypeScript checks and ESLint. The large workspace component retains two existing affine-constraint type errors and six existing hook-dependency lint warnings.

Reports:

- `reports/ruhi-kid-3d-300-tests.json`
- `reports/ruhi-kid-3d-300-regression.json`
- `reports/ruhi-kid-3d-300-types.json`
- `reports/ruhi-kid-3d-followups.json`

## Full question matrix

| # | Child's question or request | Expected response |
|---|---|---|
| 1 | Can you draw a cube for me? | Answer or apply scene change |
| 2 | Make a ball. | Answer or apply scene change |
| 3 | Draw a cone like an ice cream cone. | Answer or apply scene change |
| 4 | Can you make a cylinder like a tin can? | Answer or apply scene change |
| 5 | Draw a box that is longer than it is tall. | Answer or apply scene change |
| 6 | Make a pyramid with a square bottom. | Answer or apply scene change |
| 7 | Draw a pyramid with a triangle bottom. | Answer or apply scene change |
| 8 | Can you draw a triangular prism? | Answer or apply scene change |
| 9 | Make a ring like a doughnut. | Answer or apply scene change |
| 10 | Draw half a ball. | Answer or apply scene change |
| 11 | Make an egg-shaped solid. | Answer or apply scene change |
| 12 | Can you draw a capsule shape? | Answer or apply scene change |
| 13 | Draw a hollow tube. | Answer or apply scene change |
| 14 | Make a cone with its top cut off. | Answer or apply scene change |
| 15 | Draw a cube with sides of 4 units. | Answer or apply scene change |
| 16 | Make a sphere with radius 3. | Answer or apply scene change |
| 17 | Draw a cylinder with radius 2 and height 5. | Answer or apply scene change |
| 18 | Make a cone with radius 3 and height 6. | Answer or apply scene change |
| 19 | Draw a box that is 6 long, 4 wide, and 2 high. | Answer or apply scene change |
| 20 | Make a square pyramid with base side 4 and height 7. | Answer or apply scene change |
| 21 | Draw a triangular prism that is 5 units long. | Answer or apply scene change |
| 22 | Make a sphere with diameter 10. | Answer or apply scene change |
| 23 | Draw a cube with side length 2.5. | Answer or apply scene change |
| 24 | Make a cylinder that is 8 units tall. | Answer or apply scene change |
| 25 | Draw a point at (1, 2, 3). | Answer or apply scene change |
| 26 | Put a point at the origin. | Answer or apply scene change |
| 27 | Add a point called A at (2, 0, 0). | Answer or apply scene change |
| 28 | Add a point called B at (0, 3, 0). | Answer or apply scene change |
| 29 | Add a point called C at (0, 0, 4). | Answer or apply scene change |
| 30 | Draw a line from A to B. | Answer or apply scene change |
| 31 | Join B and C with a segment. | Answer or apply scene change |
| 32 | Draw a ray starting at A and going through C. | Answer or apply scene change |
| 33 | Make an arrow from the origin to (2, 3, 4). | Answer or apply scene change |
| 34 | Draw a plane through A, B, and C. | Answer or apply scene change |
| 35 | Show me the xy-plane. | Answer or apply scene change |
| 36 | Draw a plane parallel to the floor at z = 3. | Answer or apply scene change |
| 37 | Draw a triangle using A, B, and C. | Answer or apply scene change |
| 38 | Make a tetrahedron using four points. | Answer or apply scene change |
| 39 | Draw two cubes next to each other. | Answer or apply scene change |
| 40 | Make three spheres with different sizes. | Answer or apply scene change |
| 41 | How many solids are on my screen? | Answer or apply scene change |
| 42 | How many cubes did I draw? | Answer or apply scene change |
| 43 | How many spheres are there? | Answer or apply scene change |
| 44 | What is this shape called? | Answer or apply scene change |
| 45 | Which shape looks like a ball? | Answer or apply scene change |
| 46 | Which solid has a pointy top? | Answer or apply scene change |
| 47 | Which solid has two circular ends? | Answer or apply scene change |
| 48 | Which objects have only flat faces? | Answer or apply scene change |
| 49 | Which objects have curved surfaces? | Answer or apply scene change |
| 50 | Which objects have both flat and curved surfaces? | Answer or apply scene change |
| 51 | How many faces does this cube have? | Answer or apply scene change |
| 52 | How many edges does this cube have? | Answer or apply scene change |
| 53 | How many corners does this cube have? | Answer or apply scene change |
| 54 | How many faces does this box have? | Answer or apply scene change |
| 55 | How many edges does this triangular prism have? | Answer or apply scene change |
| 56 | How many corners does this square pyramid have? | Answer or apply scene change |
| 57 | How many faces does this tetrahedron have? | Answer or apply scene change |
| 58 | Does a sphere have any corners? | Answer or apply scene change |
| 59 | Does a cylinder have any vertices? | Answer or apply scene change |
| 60 | Is this object a cube or a cuboid? | Answer or apply scene change |
| 61 | Are all the faces of this cube squares? | Answer or apply scene change |
| 62 | Are these two solids the same kind of shape? | Answer or apply scene change |
| 63 | Which object has the most vertices? | Answer or apply scene change |
| 64 | Which objects have a circular base? | Answer or apply scene change |
| 65 | What is the name of the selected object? | Answer or apply scene change |
| 66 | What are A’s coordinates? | Answer or apply scene change |
| 67 | Where is point B? | Answer or apply scene change |
| 68 | Which point is at (1, 2, 3)? | Answer or apply scene change |
| 69 | Which point is closest to (2, 3, 4)? | Answer or apply scene change |
| 70 | Is any point exactly at the origin? | Answer or apply scene change |
| 71 | What is the distance from A to B? | Answer or apply scene change |
| 72 | How far is C from the origin? | Answer or apply scene change |
| 73 | How far apart are these two points? | Answer or apply scene change |
| 74 | What is the midpoint of AB? | Answer or apply scene change |
| 75 | Mark the halfway point between A and C. | Answer or apply scene change |
| 76 | Which point is highest? | Answer or apply scene change |
| 77 | Which point has the smallest x-coordinate? | Answer or apply scene change |
| 78 | Which point is closest to the xy-plane? | Answer or apply scene change |
| 79 | Is A above the xy-plane? | Answer or apply scene change |
| 80 | Is B on the z-axis? | Answer or apply scene change |
| 81 | Do A and B have the same height? | Answer or apply scene change |
| 82 | Which points have z equal to zero? | Answer or apply scene change |
| 83 | How far is A from the x-axis? | Answer or apply scene change |
| 84 | How far is B from the yz-plane? | Answer or apply scene change |
| 85 | Are A, B, and C on one straight line? | Answer or apply scene change |
| 86 | Are these four points on the same plane? | Answer or apply scene change |
| 87 | Is A inside this sphere? | Answer or apply scene change |
| 88 | Is B on the surface of this sphere? | Answer or apply scene change |
| 89 | Is C inside this box? | Answer or apply scene change |
| 90 | Which points are outside the selected solid? | Answer or apply scene change |
| 91 | What is the volume of this cube? | Answer or apply scene change |
| 92 | How much space is inside this box? | Answer or apply scene change |
| 93 | What is the volume of the sphere? | Answer or apply scene change |
| 94 | Find the volume of this cylinder. | Answer or apply scene change |
| 95 | How much space does this cone take up? | Answer or apply scene change |
| 96 | What is the volume of this square pyramid? | Answer or apply scene change |
| 97 | Find the volume of this triangular prism. | Answer or apply scene change |
| 98 | What is the total surface area of this cube? | Answer or apply scene change |
| 99 | How much wrapping paper would cover this box? | Answer or apply scene change |
| 100 | What is the surface area of the sphere? | Answer or apply scene change |
| 101 | Find the total surface area of this cylinder. | Answer or apply scene change |
| 102 | What is the curved surface area of this cylinder? | Answer or apply scene change |
| 103 | Find the curved surface area of this cone. | Answer or apply scene change |
| 104 | What is the total surface area of this cone? | Answer or apply scene change |
| 105 | What is the area of the pyramid’s base? | Answer or apply scene change |
| 106 | How big is one face of this cube? | Answer or apply scene change |
| 107 | What is the area of the cylinder’s circular base? | Answer or apply scene change |
| 108 | How long is the edge of this cube? | Answer or apply scene change |
| 109 | What is the height of this cone? | Answer or apply scene change |
| 110 | What is the radius of this sphere? | Answer or apply scene change |
| 111 | What is the diameter of this cylinder? | Answer or apply scene change |
| 112 | What are this box’s length, width, and height? | Answer or apply scene change |
| 113 | How long is the diagonal across this box? | Answer or apply scene change |
| 114 | What is the diagonal across one cube face? | Answer or apply scene change |
| 115 | How long is the sloping side of this cone? | Answer or apply scene change |
| 116 | Where is the center of this sphere? | Answer or apply scene change |
| 117 | Where is the center of this box? | Answer or apply scene change |
| 118 | What is the distance between the centers of these spheres? | Answer or apply scene change |
| 119 | Which solid has the biggest volume? | Answer or apply scene change |
| 120 | Which solid has the smallest surface area? | Answer or apply scene change |
| 121 | Is this cube bigger than that sphere by volume? | Answer or apply scene change |
| 122 | Do these two boxes have the same volume? | Answer or apply scene change |
| 123 | How much bigger is this cylinder than that cone? | Answer or apply scene change |
| 124 | If their bases and heights match, is the cone one-third of the cylinder? | Answer or apply scene change |
| 125 | Can you show the volume formula using this solid’s numbers? | Answer or apply scene change |
| 126 | Move the cube 2 units to the right. | Answer or apply scene change |
| 127 | Move the sphere 3 units up the z-axis. | Answer or apply scene change |
| 128 | Push the cone 4 units along the y-axis. | Answer or apply scene change |
| 129 | Move the cylinder 2 units in the negative x direction. | Answer or apply scene change |
| 130 | Put the sphere’s center at (3, 2, 1). | Answer or apply scene change |
| 131 | Move point A to (4, 5, 6). | Answer or apply scene change |
| 132 | Move B one unit closer to the xy-plane. | Answer or apply scene change |
| 133 | Put the cube’s center at the origin. | Answer or apply scene change |
| 134 | Move all spheres 2 units along the x-axis. | Answer or apply scene change |
| 135 | Move both cubes up by 3 units. | Answer or apply scene change |
| 136 | Move only the selected solid. | Ask for missing detail / selection |
| 137 | Move the box by (1, 2, 3). | Answer or apply scene change |
| 138 | Bring the cone back to where it was. | Explain limit or point to workspace control |
| 139 | Put the two spheres next to each other without overlap. | Answer or apply scene change |
| 140 | Move this sphere until it just touches that sphere. | Answer or apply scene change |
| 141 | Put the cube on the xy-plane. | Answer or apply scene change |
| 142 | Put the cone on top of the box. | Answer or apply scene change |
| 143 | Line up the centers of these three spheres. | Answer or apply scene change |
| 144 | Leave an equal gap between these cubes. | Answer or apply scene change |
| 145 | Move everything 5 units along the z-axis. | Answer or apply scene change |
| 146 | Rotate the cube 90 degrees around the z-axis. | Answer or apply scene change |
| 147 | Turn the box 45 degrees around the x-axis. | Answer or apply scene change |
| 148 | Spin the cone 180 degrees around the y-axis. | Answer or apply scene change |
| 149 | Rotate the selected solid by 30 degrees. | Ask for missing detail / selection |
| 150 | Turn the cube around its own center. | Ask for missing detail / selection |
| 151 | Rotate the triangle around line AB. | Ask for missing detail / selection |
| 152 | Rotate point A 90 degrees around the z-axis. | Answer or apply scene change |
| 153 | Rotate both cubes together around the origin. | Ask for missing detail / selection |
| 154 | Turn the cylinder so it lies along the x-axis. | Answer or apply scene change |
| 155 | Make the cone point downward. | Answer or apply scene change |
| 156 | Flip the pyramid upside down. | Answer or apply scene change |
| 157 | Rotate the box one full turn. | Answer or apply scene change |
| 158 | Turn it another 15 degrees. | Answer or apply scene change |
| 159 | Turn it back by 15 degrees. | Answer or apply scene change |
| 160 | Does rotating this solid change its volume? | Answer or apply scene change |
| 161 | Reflect A across the xy-plane. | Answer or apply scene change |
| 162 | Flip the cube across the yz-plane. | Answer or apply scene change |
| 163 | Reflect the triangle across the xz-plane. | Answer or apply scene change |
| 164 | Make a mirror copy of this cone across the xy-plane. | Answer or apply scene change |
| 165 | Reflect the sphere’s center through the origin. | Answer or apply scene change |
| 166 | Make this cube twice as big in every direction. | Answer or apply scene change |
| 167 | Shrink the sphere to half its size. | Answer or apply scene change |
| 168 | Make the cylinder twice as tall. | Answer or apply scene change |
| 169 | Make the box wider without changing its height. | Ask for missing detail / selection |
| 170 | Change the cube’s side length to 5. | Answer or apply scene change |
| 171 | Change the sphere’s radius to 4. | Answer or apply scene change |
| 172 | Set the cylinder’s diameter to 6. | Answer or apply scene change |
| 173 | Make the cone’s height 10. | Answer or apply scene change |
| 174 | Set the box dimensions to 8 by 5 by 3. | Answer or apply scene change |
| 175 | Enlarge the selected solid by a factor of 1.5. | Answer or apply scene change |
| 176 | Make every sphere twice its current radius. | Answer or apply scene change |
| 177 | Give all cubes a side length of 3. | Answer or apply scene change |
| 178 | Keep the cylinder’s radius the same and halve its height. | Answer or apply scene change |
| 179 | If I double this cube’s sides, what happens to its volume? | Answer or apply scene change |
| 180 | If I double this sphere’s radius, what happens to its surface area? | Answer or apply scene change |
| 181 | Color the cube red. | Answer or apply scene change |
| 182 | Make the sphere blue. | Answer or apply scene change |
| 183 | Change all spheres to green. | Answer or apply scene change |
| 184 | Paint every cube orange. | Answer or apply scene change |
| 185 | Make only the selected cone purple. | Answer or apply scene change |
| 186 | Change all blue solids to yellow. | Answer or apply scene change |
| 187 | Give the box a pink outline. | Answer or apply scene change |
| 188 | Make the cylinder partly transparent. | Ask for missing detail / selection |
| 189 | Make the sphere completely see-through. | Answer or apply scene change |
| 190 | Show only the edges of the cube. | Answer or apply scene change |
| 191 | Show the cube’s faces again. | Answer or apply scene change |
| 192 | Make the selected object’s edges thicker. | Explain limit or point to workspace control |
| 193 | Change all solid outlines to black. | Answer or apply scene change |
| 194 | Hide the cone. | Answer or apply scene change |
| 195 | Show the cone again. | Answer or apply scene change |
| 196 | Hide every sphere. | Answer or apply scene change |
| 197 | Show all hidden solids. | Answer or apply scene change |
| 198 | Hide everything except the selected cube. | Answer or apply scene change |
| 199 | Lock the box so I cannot move it. | Answer or apply scene change |
| 200 | Unlock every cube. | Answer or apply scene change |
| 201 | Rename this sphere Ball. | Answer or apply scene change |
| 202 | Call this cube MyCube. | Answer or apply scene change |
| 203 | Show the names of all points. | Answer or apply scene change |
| 204 | Hide the object labels. | Explain limit or point to workspace control |
| 205 | Select all spheres. | Answer or apply scene change |
| 206 | Select the smallest cube. | Answer or apply scene change |
| 207 | Select the red cone. | Answer or apply scene change |
| 208 | Select both boxes. | Answer or apply scene change |
| 209 | Clear my selection. | Answer or apply scene change |
| 210 | Make a copy of the selected pyramid. | Answer or apply scene change |
| 211 | How long is segment AB? | Answer or apply scene change |
| 212 | Which way does vector AB point? | Answer or apply scene change |
| 213 | What are the three components of this vector? | Answer or apply scene change |
| 214 | How long is this arrow? | Answer or apply scene change |
| 215 | Make a unit vector pointing the same way. | Answer or apply scene change |
| 216 | Add these two vectors. | Answer or apply scene change |
| 217 | Subtract vector AC from vector AB. | Answer or apply scene change |
| 218 | What is the angle between these two arrows? | Answer or apply scene change |
| 219 | Are these vectors perpendicular? | Answer or apply scene change |
| 220 | Are these vectors parallel? | Answer or apply scene change |
| 221 | Find the dot product of these vectors. | Answer or apply scene change |
| 222 | Find a vector perpendicular to both arrows. | Answer or apply scene change |
| 223 | Does point C lie on line AB? | Answer or apply scene change |
| 224 | Are these two 3D lines parallel? | Answer or apply scene change |
| 225 | Do these two lines meet? | Answer or apply scene change |
| 226 | Where do these lines cross? | Answer or apply scene change |
| 227 | Are these lines skew? | Answer or apply scene change |
| 228 | What is the shortest distance between these lines? | Answer or apply scene change |
| 229 | How far is point A from this line? | Answer or apply scene change |
| 230 | Mark the closest point on the line to A. | Answer or apply scene change |
| 231 | Draw a line through A parallel to BC. | Answer or apply scene change |
| 232 | Draw a line through A perpendicular to this plane. | Answer or apply scene change |
| 233 | Draw a plane through A parallel to the xy-plane. | Answer or apply scene change |
| 234 | Draw a plane through A, B, and C. | Answer or apply scene change |
| 235 | What is the equation of this plane? | Answer or apply scene change |
| 236 | Is point D on this plane? | Answer or apply scene change |
| 237 | Is this line parallel to the plane? | Answer or apply scene change |
| 238 | Where does this line go through the plane? | Answer or apply scene change |
| 239 | How far is A from this plane? | Answer or apply scene change |
| 240 | Drop a perpendicular from A to the plane. | Answer or apply scene change |
| 241 | Are these two planes perpendicular? | Answer or apply scene change |
| 242 | Are these two planes parallel? | Answer or apply scene change |
| 243 | What is the angle between these planes? | Answer or apply scene change |
| 244 | Draw the line where these planes meet. | Answer or apply scene change |
| 245 | Which direction is straight out from this plane? | Answer or apply scene change |
| 246 | Slice the cube with a horizontal plane. | Answer or apply scene change |
| 247 | What shape is this cube’s cross-section? | Answer or apply scene change |
| 248 | Slice the sphere through its center. | Answer or apply scene change |
| 249 | What is the radius of that circular slice? | Answer or apply scene change |
| 250 | Move the slicing plane upward by one unit. | Answer or apply scene change |
| 251 | Can a tilted slice through this cylinder make an ellipse? | Answer or apply scene change |
| 252 | Cut the cone with a plane parallel to its base. | Answer or apply scene change |
| 253 | Show the sphere and plane’s intersection. | Answer or apply scene change |
| 254 | Does this plane touch the sphere at just one point? | Answer or apply scene change |
| 255 | Draw a tangent plane at this point on the sphere. | Answer or apply scene change |
| 256 | Are these two spheres touching? | Answer or apply scene change |
| 257 | Are these spheres overlapping? | Answer or apply scene change |
| 258 | Is the small sphere completely inside the big sphere? | Answer or apply scene change |
| 259 | Where do these two spheres intersect? | Answer or apply scene change |
| 260 | Does this line pass through the sphere? | Answer or apply scene change |
| 261 | Mark where the line enters and leaves the sphere. | Answer or apply scene change |
| 262 | Is this line tangent to the sphere? | Answer or apply scene change |
| 263 | Is the cube completely inside the sphere? | Answer or apply scene change |
| 264 | Are the box and the plane intersecting? | Answer or apply scene change |
| 265 | Show me a net of this cube. | Answer or apply scene change |
| 266 | Draw another one like that. | Answer or apply scene change |
| 267 | Make the new one smaller. | Answer or apply scene change |
| 268 | No, I meant the first sphere. | Ask for missing detail / selection |
| 269 | Change that one to red too. | Answer or apply scene change |
| 270 | Move them together. | Ask for missing detail / selection |
| 271 | Keep the other objects where they are. | Answer or apply scene change |
| 272 | Do the same thing to the second cube. | Ask for missing detail / selection |
| 273 | What about the blue sphere? | Answer or apply scene change |
| 274 | Tell me its volume now. | Answer or apply scene change |
| 275 | Why did that answer change? | Answer or apply scene change |
| 276 | Show me the steps for that answer. | Answer or apply scene change |
| 277 | Can you explain that more simply? | Answer or apply scene change |
| 278 | Which object did you just change? | Answer or apply scene change |
| 279 | Did you change both cubes or only one? | Answer or apply scene change |
| 280 | Keep A fixed while moving B. | Ask for missing detail / selection |
| 281 | Draw a sphere with radius minus 3. | Reject without changing scene |
| 282 | Make a cube with side length zero. | Reject without changing scene |
| 283 | Draw a plane through these three points on one straight line. | Reject without changing scene |
| 284 | Draw a line using the same point twice. | Reject without changing scene |
| 285 | Find the distance from A to Z when Z is not on the board. | Reject without changing scene |
| 286 | Change all cones to red when there are no cones. | Reject without changing scene |
| 287 | Color the selected solid blue when I have selected nothing. | Ask for missing detail / selection |
| 288 | Move the locked cube 2 units right. | Reject without changing scene |
| 289 | Give this box a height of 1000000000. | Reject without changing scene |
| 290 | Put a 3D point at (2, 3). | Reject without changing scene |
| 291 | Make it bigger, but ask me how much first. | Ask for missing detail / selection |
| 292 | Rotate it, but ask me which axis first. | Ask for missing detail / selection |
| 293 | Undo the last thing you did. | Answer or apply scene change |
| 294 | Redo that change. | Answer or apply scene change |
| 295 | Undo only the last color change. | Answer or apply scene change |
| 296 | Delete the selected sphere. | Answer or apply scene change |
| 297 | Clear all solids but keep my points and lines. | Answer or apply scene change |
| 298 | Save this 3D scene. | Explain limit or point to workspace control |
| 299 | Load my saved scene and keep the colors and sizes. | Explain limit or point to workspace control |
| 300 | Reset the camera so I can see all my objects. | Explain limit or point to workspace control |
