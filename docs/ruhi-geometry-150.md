# Ruhi: 150 geometry requests

Live-coordinate language curriculum. IDs are stable for regression checks.

All 150 requests are included in `geometryCurriculumRows()` and the starter training dataset. Local intent rules extract point labels and numeric parameters from these templates; answers are calculated from the current board, not stored answers. Neural model weights have not been retrained.

Questions 1–135 are read-only; requests 136–150 create or edit geometry through the existing atomic execution pipeline. Selected-object questions require the specified selection. Missing points, degenerate shapes, and constructions without a unique result produce an explanation. Equal extrema report all tied points or sides. These additional geometry handlers target 2D workspaces; the earlier distance and nearest-point handlers retain their 3D support.

Validation includes numeric expectations for all 150 cases, saved training-context execution, altered coordinates and labels, chat routing with an unavailable neural model, selection clarification, undo, and rollback after a failed native commit. Reports are saved in `reports/ruhi-geometry-150-tests.json` and `reports/ruhi-geometry-150-scoped-types.json`. The full project TypeScript check has unrelated errors; the changed files pass a separate semantic type check. Changes are local and have not been deployed.

1. What point is nearest to (2, 3)?
2. Which point is farthest from the origin?
3. What are the coordinates of point A?
4. Which points lie on the x-axis?
5. Which points lie on the y-axis?
6. Is any point at the origin?
7. Which points are in the first quadrant?
8. Which points have negative x-coordinates?
9. Which points are above the x-axis?
10. Which point is farthest to the left?
11. Which point has the greatest y-coordinate?
12. Which points have the same x-coordinate?
13. Which points have the same y-coordinate?
14. Are any two points at the same position?
15. Which points lie inside circle c?
16. What is the distance from C to D?
17. How far is A from the origin?
18. What is the length of segment AB?
19. Which pair of points is closest together?
20. Which pair of points is farthest apart?
21. Is AB longer than CD?
22. Are segments AB and BC equal in length?
23. How much longer is AB than CD?
24. What is the total length of AB, BC, and CD?
25. What is the shortest distance from A to line BC?
26. How far apart are these two parallel lines?
27. What is the horizontal separation between A and B?
28. What is the vertical separation between C and D?
29. Which side of triangle ABC is the longest?
30. What is the ratio of the lengths AB and CD?
31. What is the midpoint of AB?
32. Is M the midpoint of CD?
33. Which existing point is nearest to the midpoint of AB?
34. What are the coordinates one-quarter of the way from A to B?
35. Which point divides AB internally in the ratio 2:1?
36. Where are the two points that divide AB into three equal parts?
37. What is the midpoint of the two selected points?
38. Does the midpoint of AB lie on the x-axis?
39. What is the distance between the midpoints of AB and CD?
40. Which point divides AB externally in the ratio 2:1?
41. If M is the midpoint of AB, where must B be?
42. Where should P lie on AB so that AP is 3 units?
43. Which points divide AB into four equal parts?
44. Are the midpoints of AB and CD at the same position?
45. What is the midpoint of the longest side of triangle ABC?
46. What is the slope of line AB?
47. Is line CD horizontal?
48. Is line AB vertical?
49. What is the equation of the line through A and B?
50. Where does line AB cross the x-axis?
51. Where does line CD cross the y-axis?
52. Where do lines AB and CD intersect?
53. Do segments AB and CD intersect?
54. Does ray AB pass through C?
55. Are lines AB and CD parallel?
56. Are lines AB and BC perpendicular?
57. Do A, B, and C lie on one straight line?
58. Does point P lie on line AB?
59. Which drawn lines pass through point C?
60. Are lines AB and CD actually the same line?
61. What is the measure of angle ABC?
62. Which angle of triangle ABC is the largest?
63. Is angle ABC a right angle?
64. Is angle BAC acute or obtuse?
65. What is the smaller angle between lines AB and CD?
66. Are angles ABC and DEF equal?
67. Are these two selected angles complementary?
68. Are these two selected angles supplementary?
69. What is the exterior angle at vertex B of triangle ABC?
70. What is the sum of the interior angles of triangle ABC?
71. Does ray BD bisect angle ABC?
72. What is the reflex angle corresponding to angle ABC?
73. What is angle ABC in radians?
74. How many degrees does angle ABC need to become a right angle?
75. Which vertices of polygon ABCDE have obtuse interior angles?
76. Is triangle ABC equilateral?
77. Is triangle ABC isosceles?
78. Is triangle ABC scalene?
79. Is triangle ABC a right triangle?
80. What is the perimeter of triangle ABC?
81. What is the area of triangle ABC?
82. What is the height from A to side BC?
83. What are the coordinates of the centroid of triangle ABC?
84. Where is the circumcenter of triangle ABC?
85. Where is the incenter of triangle ABC?
86. Where is the orthocenter of triangle ABC?
87. Is triangle ABC similar to triangle DEF?
88. Are triangles ABC and DEF congruent?
89. Does point P lie inside triangle ABC?
90. Do the lengths AB, BC, and CA satisfy the triangle inequality?
91. What is the center of circle c?
92. What is the radius of circle c?
93. What is the diameter of circle c?
94. What is the circumference of circle c?
95. What is the area of circle c?
96. Does point A lie on circle c?
97. Is point B inside or outside circle c?
98. Is line AB tangent to circle c?
99. Where does line AB intersect circle c?
100. Where do circles c and d intersect?
101. Are circles c and d concentric?
102. Do circles c and d touch at exactly one point?
103. What is the length of chord AB in circle c?
104. What is the length of the minor arc from A to B on circle c?
105. What is the area of the minor sector AOB of circle c?
106. Is quadrilateral ABCD a rectangle?
107. Is quadrilateral ABCD a square?
108. Is quadrilateral ABCD a parallelogram?
109. Is quadrilateral ABCD a rhombus?
110. Which pairs of opposite sides of ABCD are parallel?
111. What is the perimeter of polygon ABCDE?
112. What is the area of quadrilateral ABCD?
113. Are the diagonals of ABCD equal in length?
114. Do the diagonals of ABCD bisect each other?
115. Are the diagonals of ABCD perpendicular?
116. Is polygon ABCDE convex or concave?
117. Is polygon ABCDE regular?
118. What is the sum of the interior angles of polygon ABCDE?
119. Which side of polygon ABCDE is shortest?
120. Do any nonadjacent sides of polygon ABCDE cross each other?
121. Where would A be after moving 3 units right and 2 units up?
122. What is the reflection of A across the x-axis?
123. What is the reflection of B across the y-axis?
124. What is the reflection of C through the origin?
125. Where would A be after a 90-degree counterclockwise rotation about the origin?
126. Where would B be after a 180-degree rotation about point C?
127. What are the vertices after enlarging triangle ABC by scale factor 2 about the origin?
128. What translation takes point A to point B?
129. Are triangles ABC and DEF reflections of each other across the y-axis?
130. Does polygon ABCD have a line of symmetry?
131. Does polygon ABCD have rotational symmetry?
132. Would rotating triangle ABC preserve its area?
133. What would the area of triangle ABC be after scaling by a factor of 3?
134. Would reflecting triangle ABC change its perimeter?
135. Which existing point matches the reflection of A across line BC?
136. Draw a segment joining C and D.
137. Mark the midpoint of AB.
138. Draw the perpendicular bisector of CD.
139. Draw a line through A parallel to BC.
140. Draw a perpendicular from A to line BC.
141. Construct a circle centered at A and passing through B.
142. Construct the circumcircle of triangle ABC.
143. Construct the incircle of triangle ABC.
144. Draw the median from A in triangle ABC.
145. Bisect angle ABC.
146. Mark the intersection of lines AB and CD.
147. Move point A to (2, 3).
148. Reflect triangle ABC across the x-axis.
149. Rotate segment AB 45 degrees counterclockwise about A.
150. Keep points A and B and remove all other drawn objects.
