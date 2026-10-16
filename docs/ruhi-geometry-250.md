# Ruhi: 250 additional geometry requests

All 250 requests are included in the starter training dataset through `extendedGeometryTrainingRows()`. Local language templates extract labels and numbers; numerical answers are computed from the current board. Neural weights have not been retrained. The earlier 150-question curriculum remains available.

Requests 1–175 and 218–250 answer questions without changing geometry. Requests 176–200 construct geometry. Requests 201–217 move points, apply persistent constraints, or draw exact loci. Requests 226–250 use the 3D workspace. A missing selection, ambiguous solution, impossible tangent, or degenerate construction produces an explanation rather than a guessed result.

Constraints persist through scene save/restore and are checked after movement. Canvas dragging reads current coordinates; linked native points and shapes remain synchronized. Locus requests draw the exact locus rather than a time-based animation. When a construction has mirror-image choices, new polygons use the counterclockwise side of the directed base; equilateral repositioning preserves the existing side. Circle-to-circle distances refer to circumferences. Kite classification includes rhombi; trapezoid classification requires exactly one parallel pair.

Validation covers all 250 questions, expected numerical answers, constructed coordinates, all 250 through the chat routing and commit path, real native-adapter constraints, renamed labels, changed parameters, ties, wrong workspaces, impossible inputs, save/restore, undo, and rollback. Test output is saved in `reports/ruhi-geometry-250-tests.json`; changed-file semantic type checks are saved in `reports/ruhi-geometry-250-scoped-types.json`. The project-wide TypeScript check has previously reported unrelated errors. These changes are local and have not been deployed.

1. Which points have integer coordinates?
2. Which points have equal x- and y-coordinates?
3. Which points satisfy x + y = 5?
4. Which points lie on the line y = 2x?
5. Which points are exactly 5 units from A?
6. Which points are within 3 units of B?
7. Which points lie outside a radius of 4 units from C?
8. Which points are closer to A than to B?
9. Which points are equally distant from C and D?
10. Which point is closest to the x-axis?
11. Which point is farthest from the y-axis?
12. Which points lie between the lines x = 1 and x = 4?
13. Which points lie inside the rectangle defined by (0, 0) and (5, 4)?
14. Which points lie on the boundary of square ABCD?
15. Which points lie inside both circles c and d?
16. Which points lie inside circle c but outside circle d?
17. Which point is nearest to A after excluding A itself?
18. Which three points are nearest to (1, 2)?
19. List the points in increasing order of their x-coordinates.
20. List the points by their distance from B.
21. Which point is directly above C?
22. Which point is directly to the right of D?
23. Which points lie below line AB?
24. Which side of directed line AB contains P?
25. Which points lie inside triangle ABC but outside circle c?
26. What are the components of vector AB?
27. What is the magnitude of vector AC?
28. What is the unit vector in the direction from B to C?
29. What is the sum of vectors AB and CD?
30. What is the difference between vectors AC and AB?
31. What is the dot product of vectors AB and CD?
32. What is the signed 2D cross product of vectors AB and AC?
33. Are vectors AB and CD pointing in the same direction?
34. Are vectors AB and CD pointing in opposite directions?
35. What is the projection of vector AB onto vector AC?
36. What is the scalar component of AB along CD?
37. What vector must be added to AB to obtain AC?
38. What is the shortest distance between segments AB and CD?
39. What is the shortest distance from P to segment AB?
40. Is the nearest point on segment AB to P an endpoint?
41. What is the shortest distance from P to ray AB?
42. How far must B move along ray AB to make AB 10 units long?
43. What fraction of segment AB lies inside circle c?
44. Where does segment AB enter and leave rectangle CDEF?
45. What is the length of the part of AB inside triangle CDE?
46. Which drawn segment is nearest to point P?
47. Which drawn segment has the steepest absolute slope?
48. What is the angle that vector AB makes with the positive x-axis?
49. What is the Manhattan distance between A and B?
50. How much shorter is the direct path AC than the route through B?
51. What is the equation of the perpendicular bisector of AB?
52. What is the equation of the line through P with slope 3?
53. What is the equation of the line through P parallel to AB?
54. What is the equation of the line through P perpendicular to AB?
55. At what angle does line AB meet the positive x-axis?
56. Which drawn lines have positive slope?
57. Which drawn lines have negative slope?
58. Which drawn lines have undefined slope?
59. Which pairs of drawn lines are perpendicular?
60. Which pairs of drawn lines are parallel?
61. Do three selected lines meet at one point?
62. What triangle is formed by the intersections of these three lines?
63. Are A and B on the same side of line CD?
64. Does line AB separate points C and D?
65. What are the equations of the two angle bisectors of lines AB and CD?
66. Which angle at the intersection of AB and CD is obtuse?
67. Are angles ABC and CBD adjacent?
68. Do angles ABC and CBD form a linear pair?
69. Are angles ABC and DBE vertically opposite?
70. What is the sum of angles ABC and CBD?
71. What is the difference between angles ABC and DEF?
72. Which ray lies inside angle ABC?
73. Is ray BP inside the smaller angle ABC?
74. What is the clockwise angle from ray BA to ray BC?
75. What is the counterclockwise angle from ray BA to ray BC?
76. What is the radius of the circumcircle of triangle ABC?
77. What is the radius of the incircle of triangle ABC?
78. What is the length of the median from B?
79. What is the length of the angle bisector from A?
80. What is the length of the altitude from C?
81. Where does the altitude from B meet line AC?
82. Does the altitude from A meet segment BC or its extension?
83. Is the orthocenter inside triangle ABC?
84. Is the circumcenter outside triangle ABC?
85. Are the centroid, circumcenter, and orthocenter collinear?
86. What is the ratio of the distances from the centroid to A and to the midpoint of BC?
87. Where does the angle bisector from B meet AC?
88. Does the angle bisector from A divide BC in the ratio AB:AC?
89. What is the area of the triangle formed by the three side midpoints?
90. What is the perimeter of the medial triangle of ABC?
91. Which side should be used as the base to obtain the smallest altitude?
92. Do triangles ABC and ABD have equal areas?
93. What is the ratio of the areas of triangles ABC and ADE?
94. Do triangles ABC and DEF have the same orientation?
95. Is the vertex order A, B, C clockwise or counterclockwise?
96. Which vertex of triangle ABC is nearest to its centroid?
97. Is triangle ABC contained entirely inside triangle DEF?
98. Do triangles ABC and DEF overlap?
99. What is the area shared by triangles ABC and DEF?
100. Which triangle formed from the existing points has the greatest area?
101. What is the equation of circle c?
102. What is the power of point P with respect to circle c?
103. How far is P from the nearest point on circle c?
104. How far is P from the farthest point on circle c?
105. What is the shortest distance between circles c and d?
106. Is circle c completely inside circle d?
107. Are circles c and d disjoint?
108. How many common tangents do circles c and d have?
109. What is the equation of the radical axis of circles c and d?
110. What is the length of a tangent from P to circle c?
111. Where are the tangent contact points from P to circle c?
112. Is chord AB longer than chord CD in circle c?
113. Which chord of circle c is closest to its center?
114. What is the perpendicular distance from the center of c to chord AB?
115. Does the perpendicular from the center of c bisect chord AB?
116. What is the central angle subtended by chord AB?
117. What is the major arc length from A to B on circle c?
118. What is the area of the major sector AOB?
119. What is the area of the minor circular segment cut off by chord AB?
120. What is the angle between the tangent at A and chord AB?
121. Are A, B, C, and D concyclic?
122. What circle passes through A, B, and C?
123. Does line AB cut circle c in two distinct points?
124. What is the area of overlap between circles c and d?
125. What is the area inside circle c but outside circle d?
126. Is quadrilateral ABCD a kite?
127. Does quadrilateral ABCD have exactly one pair of parallel opposite sides?
128. Is ABCD an isosceles trapezoid?
129. Is ABCD a cyclic quadrilateral?
130. Do the opposite angles of ABCD add up to 180 degrees?
131. What is the height of parallelogram ABCD using AB as the base?
132. What is the area of rhombus ABCD using its diagonals?
133. What is the length of the midsegment of trapezoid ABCD?
134. Where do the diagonals of quadrilateral ABCD intersect?
135. In what ratio does the diagonal intersection divide AC?
136. How many diagonals does polygon ABCDEF have?
137. Which diagonals of polygon ABCDE lie entirely inside it?
138. What is the centroid of polygon ABCDE?
139. What is the perimeter of the convex hull of the existing points?
140. Which points are vertices of the convex hull?
141. Which existing points lie strictly inside the convex hull?
142. Is polygon ABCDE contained inside circle c?
143. Does polygon ABCDE contain the center of circle c?
144. What is the smallest axis-aligned rectangle containing polygon ABCDE?
145. What is the width of polygon ABCDE’s bounding box?
146. What is the height of polygon ABCDE’s bounding box?
147. What is the signed area of polygon ABCDE?
148. Does reversing the vertex order change the polygon’s signed area?
149. Which vertex of polygon ABCDE has the smallest interior angle?
150. What is the sum of the exterior turning angles of polygon ABCDE?
151. What is the reflection of A across the line y = x?
152. What is the reflection of B across the line y = −x?
153. What is the reflection of C across the line x = 2?
154. What is the reflection of D across the line y = 3?
155. Where would A move under a translation by vector CD?
156. Where would P be after a 30-degree clockwise rotation about B?
157. What are the coordinates of A after a dilation of scale factor −2 about C?
158. What dilation centered at O takes A to B?
159. Can a translation map triangle ABC exactly onto triangle DEF?
160. Which vertex corresponds to A when triangles ABC and DEF are matched by translation?
161. What rotation about O maps A onto B?
162. Does reflecting A across AB leave A fixed?
163. Which points remain fixed under reflection across line CD?
164. Which points remain fixed under a 90-degree rotation about O?
165. What is the result of reflecting P across the x-axis and then the y-axis?
166. What is the result of reflecting P across two parallel lines?
167. What rotation is equivalent to reflections across two intersecting lines?
168. Does scaling triangle ABC by −1 reverse its orientation?
169. What is the perimeter scale factor when a shape is enlarged by 1.5?
170. What scale factor would make triangle ABC’s area four times as large?
171. What translation takes the midpoint of AB to the origin?
172. What rotation would make segment AB horizontal?
173. What is the image of circle c under reflection across line AB?
174. What is the image of circle c under a dilation centered at P with scale factor 2?
175. Is the transformation from ABC to DEF orientation-preserving or orientation-reversing?
176. Draw a line through the two selected points.
177. Draw a ray starting at C and passing through D.
178. Construct an equilateral triangle on segment AB.
179. Construct a square with AB as one side.
180. Construct a rectangle with base AB and height 4.
181. Construct a regular pentagon centered at O with A as one vertex.
182. Construct the two tangents from P to circle c.
183. Draw the tangent to circle c at A.
184. Draw the common external tangents of circles c and d.
185. Draw the common internal tangents of circles c and d.
186. Construct a circle with AB as its diameter.
187. Construct a circle centered at P and tangent to line AB.
188. Construct a circle centered at A with the same radius as circle c.
189. Mark the points where circle c crosses the x-axis.
190. Mark the points where circle c crosses the y-axis.
191. Divide segment AB into five equal parts.
192. Construct the external bisector of angle ABC.
193. Draw all three altitudes of triangle ABC.
194. Draw the Euler line of triangle ABC.
195. Construct the nine-point circle of triangle ABC.
196. Draw the medial triangle of triangle ABC.
197. Construct the parallelogram with consecutive vertices A, B, and C.
198. Construct the image of polygon ABCDE after translation by vector PQ.
199. Construct the convex hull of all existing points.
200. Mark the two points on circle c that are farthest apart along a line parallel to AB.
201. Move A along the x-axis until AB becomes 5 units long.
202. Move P onto the nearest point of line AB.
203. Move P onto the nearest point of circle c.
204. Move B while keeping AB equal to 4 units.
205. Move C while keeping its distance from A and B equal.
206. Keep A and B fixed and move C to make triangle ABC right-angled at C.
207. Keep A and B fixed and move C to make triangle ABC equilateral.
208. Keep the area of triangle ABC constant while moving C parallel to AB.
209. Lock the length of AB while allowing the segment to rotate.
210. Constrain P to remain on segment AB.
211. Constrain P to remain on circle c.
212. Keep line AB parallel to line CD when A moves.
213. Keep line AB perpendicular to line CD when C moves.
214. Keep circle c tangent to line AB while its center moves.
215. Trace the path of P while P stays 3 units from A.
216. Trace the locus of points equally distant from A and B.
217. Trace the midpoint of AB while B moves around circle c.
218. How does triangle ABC’s area change when C moves straight upward?
219. What stays unchanged when triangle ABC is translated?
220. Which measurements change when triangle ABC is stretched only horizontally?
221. Does the circumcenter move when one vertex of triangle ABC moves?
222. What happens to the circumcircle as A, B, and C approach collinearity?
223. At what position of P do triangles ABP and CDP have equal areas?
224. Can P lie on both circle c and line AB?
225. How many positions of P satisfy PA = 3 and PB = 4?
226. What are the three coordinates of point P?
227. Which points lie in the xy-plane?
228. Which points lie above the xy-plane?
229. What is the distance from P to the z-axis?
230. What is the distance from P to the xy-plane?
231. What is the equation of the plane through A, B, and C?
232. Do A, B, C, and D lie in the same plane?
233. What is the normal vector of plane ABC?
234. What is the angle between line AB and plane CDE?
235. What is the angle between planes ABC and DEF?
236. Are lines AB and CD skew?
237. What is the shortest distance between skew lines AB and CD?
238. Where does line AB intersect plane CDE?
239. What is the line of intersection of planes ABC and DEF?
240. What is the perpendicular projection of P onto plane ABC?
241. What is the volume of tetrahedron ABCD?
242. What is the surface area of tetrahedron ABCD?
243. Is point P inside tetrahedron ABCD?
244. What is the space diagonal of the selected cuboid?
245. What is the angle between a cube’s space diagonal and one of its edges?
246. What is the cross-section of this cube by plane ABC?
247. Where does line AB intersect sphere s?
248. Is plane ABC tangent to sphere s?
249. What is the radius of the circle where plane ABC cuts sphere s?
250. What is the volume shared by the two selected spheres?
