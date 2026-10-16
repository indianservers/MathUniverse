# Ruhi: 250 bulk-edit questions

These authored intent examples are included in the local semantic training dataset. General language rules execute against current workspace objects; model weights are not fine-tuned by this change.

The bulk-edit parser recognizes explicit groups, including selected and source-color filters. It expands the complete group before any board write and reports the number of matching objects. Appearance changes preserve shared endpoints and circle handles, bypass motion interpolation and the geometry solver, and retain native style metadata. Undo and rollback preserve geometry. Lock changes also update the workspace's native lock list.

Checks cover target counts, selected and color-filtered groups, native appearance, geometry preservation, Undo/Redo, injected adapter failures, locked groups, empty selections, and unsupported exclusions. Each question is executed through both the native adapter and the chat entry point. Expected action labels and target membership are authored independently of the parser.

Final regression result: **7,838 tests passed, 0 failed**. All 250 new questions pass native-board checks and chat-entry checks.

Validation reports: `reports/ruhi-bulk-edit-regression-tests.json` and `reports/ruhi-bulk-edit-250-types.json`. Scoped TypeScript validation passes. The large workspace component has two existing unrelated errors in its affine-constraint handling; those are outside this change.

| # | Question | Expected action |
|---|---|---|
| 1 | Change all circles color to red | CHANGE COLOR |
| 2 | Change all lines color to red | CHANGE COLOR |
| 3 | Change all triangles color to red | CHANGE COLOR |
| 4 | Change all polygons color to red | CHANGE COLOR |
| 5 | Change all points color to red | CHANGE COLOR |
| 6 | Make every circle blue | CHANGE COLOR |
| 7 | Make every line blue | CHANGE COLOR |
| 8 | Make every triangle blue | CHANGE COLOR |
| 9 | Make every polygon blue | CHANGE COLOR |
| 10 | Make every point blue | CHANGE COLOR |
| 11 | Color each circle green | CHANGE COLOR |
| 12 | Color each line green | CHANGE COLOR |
| 13 | Color each triangle green | CHANGE COLOR |
| 14 | Color each polygon green | CHANGE COLOR |
| 15 | Color each point green | CHANGE COLOR |
| 16 | Recolor all circles orange | CHANGE COLOR |
| 17 | Recolor all lines orange | CHANGE COLOR |
| 18 | Recolor all triangles orange | CHANGE COLOR |
| 19 | Recolor all polygons orange | CHANGE COLOR |
| 20 | Recolor all points orange | CHANGE COLOR |
| 21 | Set the color of all circles to purple | CHANGE COLOR |
| 22 | Set the color of all lines to purple | CHANGE COLOR |
| 23 | Set the color of all triangles to purple | CHANGE COLOR |
| 24 | Set the color of all polygons to purple | CHANGE COLOR |
| 25 | Set the color of all points to purple | CHANGE COLOR |
| 26 | Paint all circles yellow | CHANGE COLOR |
| 27 | Paint all lines yellow | CHANGE COLOR |
| 28 | Paint all triangles yellow | CHANGE COLOR |
| 29 | Paint all polygons yellow | CHANGE COLOR |
| 30 | Paint all points yellow | CHANGE COLOR |
| 31 | Give all circles a pink color | CHANGE COLOR |
| 32 | Give all lines a pink color | CHANGE COLOR |
| 33 | Give all triangles a pink color | CHANGE COLOR |
| 34 | Give all polygons a pink color | CHANGE COLOR |
| 35 | Give all points a pink color | CHANGE COLOR |
| 36 | Please change all selected circles to teal | CHANGE COLOR |
| 37 | Please change all selected lines to teal | CHANGE COLOR |
| 38 | Please change all selected triangles to teal | CHANGE COLOR |
| 39 | Please change all selected polygons to teal | CHANGE COLOR |
| 40 | Please change all selected points to teal | CHANGE COLOR |
| 41 | Colour all blue circles red | CHANGE COLOR |
| 42 | Colour all blue lines red | CHANGE COLOR |
| 43 | Colour all blue triangles red | CHANGE COLOR |
| 44 | Colour all blue polygons red | CHANGE COLOR |
| 45 | Colour all blue points red | CHANGE COLOR |
| 46 | Can you make every green circle cyan? | CHANGE COLOR |
| 47 | Can you make every green line cyan? | CHANGE COLOR |
| 48 | Can you make every green triangle cyan? | CHANGE COLOR |
| 49 | Can you make every green polygon cyan? | CHANGE COLOR |
| 50 | Can you make every green point cyan? | CHANGE COLOR |
| 51 | Apply magenta to all circles | CHANGE COLOR |
| 52 | Apply magenta to all lines | CHANGE COLOR |
| 53 | Apply magenta to all triangles | CHANGE COLOR |
| 54 | Apply magenta to all polygons | CHANGE COLOR |
| 55 | Apply magenta to all points | CHANGE COLOR |
| 56 | Use navy blue for all selected circles | CHANGE COLOR |
| 57 | Use navy blue for all selected lines | CHANGE COLOR |
| 58 | Use navy blue for all selected triangles | CHANGE COLOR |
| 59 | Use navy blue for all selected polygons | CHANGE COLOR |
| 60 | Use navy blue for all selected points | CHANGE COLOR |
| 61 | Fill all circles red | CHANGE FILL_COLOR |
| 62 | Fill all triangles red | CHANGE FILL_COLOR |
| 63 | Fill all polygons red | CHANGE FILL_COLOR |
| 64 | Set the interior color of every circle to blue | CHANGE FILL_COLOR |
| 65 | Set the interior color of every triangle to blue | CHANGE FILL_COLOR |
| 66 | Set the interior color of every polygon to blue | CHANGE FILL_COLOR |
| 67 | Change the fill of all circles to green | CHANGE FILL_COLOR |
| 68 | Change the fill of all triangles to green | CHANGE FILL_COLOR |
| 69 | Change the fill of all polygons to green | CHANGE FILL_COLOR |
| 70 | Make the inside of each circle orange | CHANGE FILL_COLOR |
| 71 | Make the inside of each triangle orange | CHANGE FILL_COLOR |
| 72 | Make the inside of each polygon orange | CHANGE FILL_COLOR |
| 73 | Give all circles a purple fill | CHANGE FILL_COLOR |
| 74 | Give all triangles a purple fill | CHANGE FILL_COLOR |
| 75 | Give all polygons a purple fill | CHANGE FILL_COLOR |
| 76 | Apply yellow fill to all selected circles | CHANGE FILL_COLOR |
| 77 | Apply yellow fill to all selected triangles | CHANGE FILL_COLOR |
| 78 | Apply yellow fill to all selected polygons | CHANGE FILL_COLOR |
| 79 | Colour the interior of all blue circles pink | CHANGE FILL_COLOR |
| 80 | Colour the interior of all blue triangles pink | CHANGE FILL_COLOR |
| 81 | Colour the interior of all blue polygons pink | CHANGE FILL_COLOR |
| 82 | Use teal for the fill of every green circle | CHANGE FILL_COLOR |
| 83 | Use teal for the fill of every green triangle | CHANGE FILL_COLOR |
| 84 | Use teal for the fill of every green polygon | CHANGE FILL_COLOR |
| 85 | Please paint the inside of all circles cyan | CHANGE FILL_COLOR |
| 86 | Please paint the inside of all triangles cyan | CHANGE FILL_COLOR |
| 87 | Please paint the inside of all polygons cyan | CHANGE FILL_COLOR |
| 88 | Can you set all selected circles fill color to magenta? | CHANGE FILL_COLOR |
| 89 | Can you set all selected triangles fill color to magenta? | CHANGE FILL_COLOR |
| 90 | Can you set all selected polygons fill color to magenta? | CHANGE FILL_COLOR |
| 91 | Change the outline of all circles to red | CHANGE STROKE_COLOR |
| 92 | Change the outline of all lines to red | CHANGE STROKE_COLOR |
| 93 | Change the outline of all triangles to red | CHANGE STROKE_COLOR |
| 94 | Change the outline of all polygons to red | CHANGE STROKE_COLOR |
| 95 | Change the outline of all points to red | CHANGE STROKE_COLOR |
| 96 | Set every circle border color to blue | CHANGE STROKE_COLOR |
| 97 | Set every line border color to blue | CHANGE STROKE_COLOR |
| 98 | Set every triangle border color to blue | CHANGE STROKE_COLOR |
| 99 | Set every polygon border color to blue | CHANGE STROKE_COLOR |
| 100 | Set every point border color to blue | CHANGE STROKE_COLOR |
| 101 | Make the stroke of each circle green | CHANGE STROKE_COLOR |
| 102 | Make the stroke of each line green | CHANGE STROKE_COLOR |
| 103 | Make the stroke of each triangle green | CHANGE STROKE_COLOR |
| 104 | Make the stroke of each polygon green | CHANGE STROKE_COLOR |
| 105 | Make the stroke of each point green | CHANGE STROKE_COLOR |
| 106 | Recolor all selected circles outlines orange | CHANGE STROKE_COLOR |
| 107 | Recolor all selected lines outlines orange | CHANGE STROKE_COLOR |
| 108 | Recolor all selected triangles outlines orange | CHANGE STROKE_COLOR |
| 109 | Recolor all selected polygons outlines orange | CHANGE STROKE_COLOR |
| 110 | Recolor all selected points outlines orange | CHANGE STROKE_COLOR |
| 111 | Use purple for the outline of all blue circles | CHANGE STROKE_COLOR |
| 112 | Use purple for the outline of all blue lines | CHANGE STROKE_COLOR |
| 113 | Use purple for the outline of all blue triangles | CHANGE STROKE_COLOR |
| 114 | Use purple for the outline of all blue polygons | CHANGE STROKE_COLOR |
| 115 | Use purple for the outline of all blue points | CHANGE STROKE_COLOR |
| 116 | Apply teal stroke to every green circle | CHANGE STROKE_COLOR |
| 117 | Apply teal stroke to every green line | CHANGE STROKE_COLOR |
| 118 | Apply teal stroke to every green triangle | CHANGE STROKE_COLOR |
| 119 | Apply teal stroke to every green polygon | CHANGE STROKE_COLOR |
| 120 | Apply teal stroke to every green point | CHANGE STROKE_COLOR |
| 121 | Make all circles thicker | CHANGE LINE_WIDTH |
| 122 | Make all lines thicker | CHANGE LINE_WIDTH |
| 123 | Make all triangles thicker | CHANGE LINE_WIDTH |
| 124 | Make all polygons thicker | CHANGE LINE_WIDTH |
| 125 | Make all points thicker | CHANGE LINE_WIDTH |
| 126 | Make every circle thinner | CHANGE LINE_WIDTH |
| 127 | Make every line thinner | CHANGE LINE_WIDTH |
| 128 | Make every triangle thinner | CHANGE LINE_WIDTH |
| 129 | Make every polygon thinner | CHANGE LINE_WIDTH |
| 130 | Make every point thinner | CHANGE LINE_WIDTH |
| 131 | Set all circles stroke width to 5 pixels | CHANGE LINE_WIDTH |
| 132 | Set all lines stroke width to 5 pixels | CHANGE LINE_WIDTH |
| 133 | Set all triangles stroke width to 5 pixels | CHANGE LINE_WIDTH |
| 134 | Set all polygons stroke width to 5 pixels | CHANGE LINE_WIDTH |
| 135 | Set all points stroke width to 5 pixels | CHANGE LINE_WIDTH |
| 136 | Change all selected circles line width to 2 px | CHANGE LINE_WIDTH |
| 137 | Change all selected lines line width to 2 px | CHANGE LINE_WIDTH |
| 138 | Change all selected triangles line width to 2 px | CHANGE LINE_WIDTH |
| 139 | Change all selected polygons line width to 2 px | CHANGE LINE_WIDTH |
| 140 | Change all selected points line width to 2 px | CHANGE LINE_WIDTH |
| 141 | Set the outline width of all blue circles to 4 | CHANGE LINE_WIDTH |
| 142 | Set the outline width of all blue lines to 4 | CHANGE LINE_WIDTH |
| 143 | Set the outline width of all blue triangles to 4 | CHANGE LINE_WIDTH |
| 144 | Set the outline width of all blue polygons to 4 | CHANGE LINE_WIDTH |
| 145 | Set the outline width of all blue points to 4 | CHANGE LINE_WIDTH |
| 146 | Make every green circle thicker | CHANGE LINE_WIDTH |
| 147 | Make every green line thicker | CHANGE LINE_WIDTH |
| 148 | Make every green triangle thicker | CHANGE LINE_WIDTH |
| 149 | Make every green polygon thicker | CHANGE LINE_WIDTH |
| 150 | Make every green point thicker | CHANGE LINE_WIDTH |
| 151 | Hide all circles | HIDE OBJECT |
| 152 | Hide all lines | HIDE OBJECT |
| 153 | Hide all triangles | HIDE OBJECT |
| 154 | Hide all polygons | HIDE OBJECT |
| 155 | Hide all points | HIDE OBJECT |
| 156 | Conceal every circle | HIDE OBJECT |
| 157 | Conceal every line | HIDE OBJECT |
| 158 | Conceal every triangle | HIDE OBJECT |
| 159 | Conceal every polygon | HIDE OBJECT |
| 160 | Conceal every point | HIDE OBJECT |
| 161 | Make each circle invisible | HIDE OBJECT |
| 162 | Make each line invisible | HIDE OBJECT |
| 163 | Make each triangle invisible | HIDE OBJECT |
| 164 | Make each polygon invisible | HIDE OBJECT |
| 165 | Make each point invisible | HIDE OBJECT |
| 166 | Hide all selected circles | HIDE OBJECT |
| 167 | Hide all selected lines | HIDE OBJECT |
| 168 | Hide all selected triangles | HIDE OBJECT |
| 169 | Hide all selected polygons | HIDE OBJECT |
| 170 | Hide all selected points | HIDE OBJECT |
| 171 | Set all blue circles invisible | HIDE OBJECT |
| 172 | Set all blue lines invisible | HIDE OBJECT |
| 173 | Set all blue triangles invisible | HIDE OBJECT |
| 174 | Set all blue polygons invisible | HIDE OBJECT |
| 175 | Set all blue points invisible | HIDE OBJECT |
| 176 | Show all circles | SHOW OBJECT |
| 177 | Show all lines | SHOW OBJECT |
| 178 | Show all triangles | SHOW OBJECT |
| 179 | Show all polygons | SHOW OBJECT |
| 180 | Show all points | SHOW OBJECT |
| 181 | Reveal every circle | SHOW OBJECT |
| 182 | Reveal every line | SHOW OBJECT |
| 183 | Reveal every triangle | SHOW OBJECT |
| 184 | Reveal every polygon | SHOW OBJECT |
| 185 | Reveal every point | SHOW OBJECT |
| 186 | Make each circle visible | SHOW OBJECT |
| 187 | Make each line visible | SHOW OBJECT |
| 188 | Make each triangle visible | SHOW OBJECT |
| 189 | Make each polygon visible | SHOW OBJECT |
| 190 | Make each point visible | SHOW OBJECT |
| 191 | Display all selected circles | SHOW OBJECT |
| 192 | Display all selected lines | SHOW OBJECT |
| 193 | Display all selected triangles | SHOW OBJECT |
| 194 | Display all selected polygons | SHOW OBJECT |
| 195 | Display all selected points | SHOW OBJECT |
| 196 | Unhide all blue circles | SHOW OBJECT |
| 197 | Unhide all blue lines | SHOW OBJECT |
| 198 | Unhide all blue triangles | SHOW OBJECT |
| 199 | Unhide all blue polygons | SHOW OBJECT |
| 200 | Unhide all blue points | SHOW OBJECT |
| 201 | Lock all circles | LOCK OBJECT |
| 202 | Lock all lines | LOCK OBJECT |
| 203 | Lock all triangles | LOCK OBJECT |
| 204 | Lock all polygons | LOCK OBJECT |
| 205 | Lock all points | LOCK OBJECT |
| 206 | Freeze every circle | LOCK OBJECT |
| 207 | Freeze every line | LOCK OBJECT |
| 208 | Freeze every triangle | LOCK OBJECT |
| 209 | Freeze every polygon | LOCK OBJECT |
| 210 | Freeze every point | LOCK OBJECT |
| 211 | Make each circle immovable | LOCK OBJECT |
| 212 | Make each line immovable | LOCK OBJECT |
| 213 | Make each triangle immovable | LOCK OBJECT |
| 214 | Make each polygon immovable | LOCK OBJECT |
| 215 | Make each point immovable | LOCK OBJECT |
| 216 | Set all selected circles locked | LOCK OBJECT |
| 217 | Set all selected lines locked | LOCK OBJECT |
| 218 | Set all selected triangles locked | LOCK OBJECT |
| 219 | Set all selected polygons locked | LOCK OBJECT |
| 220 | Set all selected points locked | LOCK OBJECT |
| 221 | Lock all blue circles | LOCK OBJECT |
| 222 | Lock all blue lines | LOCK OBJECT |
| 223 | Lock all blue triangles | LOCK OBJECT |
| 224 | Lock all blue polygons | LOCK OBJECT |
| 225 | Lock all blue points | LOCK OBJECT |
| 226 | Unlock all circles | UNLOCK OBJECT |
| 227 | Unlock all lines | UNLOCK OBJECT |
| 228 | Unlock all triangles | UNLOCK OBJECT |
| 229 | Unlock all polygons | UNLOCK OBJECT |
| 230 | Unlock all points | UNLOCK OBJECT |
| 231 | Unfreeze every circle | UNLOCK OBJECT |
| 232 | Unfreeze every line | UNLOCK OBJECT |
| 233 | Unfreeze every triangle | UNLOCK OBJECT |
| 234 | Unfreeze every polygon | UNLOCK OBJECT |
| 235 | Unfreeze every point | UNLOCK OBJECT |
| 236 | Make each circle movable | UNLOCK OBJECT |
| 237 | Make each line movable | UNLOCK OBJECT |
| 238 | Make each triangle movable | UNLOCK OBJECT |
| 239 | Make each polygon movable | UNLOCK OBJECT |
| 240 | Make each point movable | UNLOCK OBJECT |
| 241 | Set all selected circles unlocked | UNLOCK OBJECT |
| 242 | Set all selected lines unlocked | UNLOCK OBJECT |
| 243 | Set all selected triangles unlocked | UNLOCK OBJECT |
| 244 | Set all selected polygons unlocked | UNLOCK OBJECT |
| 245 | Set all selected points unlocked | UNLOCK OBJECT |
| 246 | Unlock all blue circles | UNLOCK OBJECT |
| 247 | Unlock all blue lines | UNLOCK OBJECT |
| 248 | Unlock all blue triangles | UNLOCK OBJECT |
| 249 | Unlock all blue polygons | UNLOCK OBJECT |
| 250 | Unlock all blue points | UNLOCK OBJECT |
