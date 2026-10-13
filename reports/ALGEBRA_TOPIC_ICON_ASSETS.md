# Algebra topic icons

Updated only the nine Algebra launch-card illustrations and their animation layer. The hero markup is identical to the existing version; hero assets, headings, navigation, topic descriptions and lab routes are unchanged.

Tool: built-in `image_gen`, with the user's attached Algebra Studio screenshot as the style/subject reference. Each icon was generated separately with a transparent background, inspected and copied into the project without replacing the original assets.

Saved asset directory: `C:/Indian Servers/Math Universe Visualizations/public/assets/algebra-studio/topic-icons-v2/`.

| Topic | Saved asset | Motion |
| --- | --- | --- |
| Expressions | expressions.png | Floating cubes and pointer tilt |
| Equations | equations.png | Gentle balance rocking |
| Functions | functions.png | Floating curve artwork |
| Polynomials | polynomials.png | Gentle curve bounce |
| Systems | systems.png | Turning perspective |
| Exponents & Logs | exponents.png | Upward diagonal motion |
| Sequences | sequences.png | Upward staircase motion |
| Algebraic Proof | proof.png | Gentle writing tilt |
| CAS Explorer | cas.png | Floating screen artwork |

Animations apply to the complete illustrations. Pointer movement tilts the artwork; hover or keyboard focus increases motion and glow. Artwork links open the associated lab. Offscreen motion pauses, and reduced-motion preferences disable animation and pointer tilt. PNG transparency is preserved.

## Generation prompts

Expressions prompt:

> Generate ONE isolated transparent-background 3D UI topic icon, matching EXACTLY the Expressions card artwork in the attached Algebra Studio reference screenshot. The screenshot is only a STYLE AND SUBJECT REFERENCE, not an edit target. Icon only: two glossy cyan-blue algebra cubes, foreground cube marked lowercase italic x in navy, taller rear/right cube marked lowercase white y, a yellow-and-blue pencil leaning diagonally against them, two tiny floating cyan cubes nearby. Copy the reference's delicate polished isometric 3D look, soft studio lighting, blue translucent facets, clean elegant small-object proportions and orientation. Center the complete group in a square canvas with 8% padding. Fully transparent background, no card background, no border, no UI, no title, no number badge, no arrows, no extra letters. This will be displayed at 130px wide on an educational topic card. Keep the exact reference arrangement and colors.

The other eight prompts use this common instruction, inserting the subject below after `Subject:`:

> Generate ONE isolated transparent-background 3D UI topic icon matching the specified card artwork in the attached Algebra Studio screenshot. The screenshot is a STYLE AND SUBJECT REFERENCE only, not an edit target. Subject: [subject below] Copy the exact reference's polished miniature isometric 3D design, delicate soft studio lighting, luminous materials and colors. Center the COMPLETE icon in a square canvas with 8% padding. Fully transparent background; no card background, no border, no title, no badge, no navigation arrow, no additional objects or text beyond the described icon. Display target is 130px wide. Make it look like the SAME icon from the reference, rendered cleanly as an individual asset.

- **Equations:** The Equations card: an elegant small GOLD BALANCE SCALE on a round gold pedestal, balanced horizontal beam with spherical ends, delicate suspension wires, small cyan algebra block marked navy italic x on the left pan and small blue block marked navy 3 on the right pan. Match the reference scale shape and composition.
- **Functions:** The Functions card: a translucent upright pale mint coordinate grid panel with a glossy teal S-shaped smooth function curve running bottom left to top right, golden spherical starting point and blue spherical endpoint. Match the exact wave, grid, isometric orientation and mint palette of the reference.
- **Polynomials:** The Polynomials card: a glossy magenta-purple polynomial curve with two tall humps, deep valley, low left endpoint and upward right endpoint. Five small gold/purple spherical control points follow the curve. It stands above a delicate translucent light-blue isometric coordinate grid base. Match the reference arrangement and orange-gold highlights.
- **Systems:** The Systems card: two translucent isometric planes intersecting at a central cyan sphere; lavender-blue sloping plane and rose-pink plane, three slender navy coordinate axes with arrowheads passing through their intersection. Match the reference's beautiful delicate glass planes and orientation.
- **Exponents & Logs:** The Exponents & Logs card: a large glossy electric-blue italic lowercase e with raised superscript x, plus a thick blue/cyan growth arrow sweeping from lower left to upper right behind it, squared little base and violet arrowhead. Exactly e to the x, no other text. Match reference proportions and polished reflective blue material.
- **Sequences:** The Sequences card: four ascending glossy emerald/cyan isometric cuboid steps growing from left to right on a subtle transparent grid base, with the navy-green numeric labels 2, 5, 10, 17 and a tiny ellipsis hovering above the corresponding steps. Match the exact reference number staircase, cube facets and mint highlights.
- **Algebraic Proof:** The Algebraic Proof card: a warmly cream-colored rolled parchment scroll with curled bottom and upper right ends, navy italic words Given, Show, Therefore on three ruled lines, and a beautiful violet-blue fountain pen leaning diagonally on the right. Match the reference scroll shape, pen orientation and reflective purple material.
- **CAS Explorer:** The CAS Explorer card: a small slim isometric desktop computer monitor with midnight-blue display showing large white italic f(x), a lavender glossy frame, purple gear overlapping the upper right corner, and tiny blue keyboard on a white-lavender pedestal. Match the reference monitor, gear, keyboard composition and subtle blue screen marks.

Generated artwork follows the reference's subjects, arrangement and colors; it is a new rendering rather than a pixel-identical screenshot extraction.

## Verification

Browser checks pass for all nine image loads, visible animation, pointer tilt, icon navigation, mobile fit and reduced motion. The hero source comparison passes. Targeted ESLint and the student production build pass. Screenshots are saved as `artifacts/algebra-animated-topic-icons-desktop.png` and `artifacts/algebra-animated-topic-icons-mobile.png`.
