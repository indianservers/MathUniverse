# Math Universe - Complete Visualizations

## Overview

Math Universe is a browser-based interactive mathematics learning platform covering algebra, geometry, trigonometry, calculus, complex numbers, linear algebra, and AI applications. Statistics is linked directly to the dedicated Anveshak app. It is designed for visual intuition: formulas become sliders, graphs, SVG diagrams, 3D scenes, simulations, and quizzes.

## Offline natural-language drawing

Click the small animated **Math Robo** on any page (accessible name: **Ask Math · Offline**).
Paste or type a problem to see the solver answer and expandable solution steps.
The robot waves, blinks, and shows a thinking animation; reduced-motion settings
disable animations. The header and close button stay visible while the conversation
scrolls. Close its panel with the close button or Escape.
On an ordinary page, math questions use
the existing solver and drawing requests return an editable embedded visual.
On a workspace page, drawing requests create objects in the active canvas:

| Workspace | Example requests |
| --- | --- |
| 2D Graph | `Plot sin(x)`, `Create triangle base 6 height 4`, `Draw a line from (0,2) to (3,0)` |
| 3D Graph | `Plot z = sin(x)*cos(y)`, `Create a sphere radius 2`, `Draw line (0,0,0) to (2,3,1)` |
| 2D Geometry | `Create a blue rectagle 6 wide and 4 tall`, `Create circle radius 2 at (1,1)`, `Create point (2,3)` |
| 3D Geometry | `Create sphere radius 2`, `Create cube size 3`, `Create cylinder radius 2 height 5`, `Draw line (0,0,0) to (2,3,1)` |

The interpreter runs entirely in the browser using deterministic language rules
and the existing mathematical parsers. It requires no API key, server, or model
download. It accepts the spelling `rectagle`, named colors, numeric dimensions,
and coordinate tuples. Workspace edits participate in existing undo and save
behavior. Embedded visuals provide an **Open full workspace** button and the
existing workspace editing/export controls. The shared catalog supports 18 flat
shapes (including triangles, ellipses, stars, regular polygons, and quadrilaterals)
and 18 solids (including cuboids, ellipsoids, prisms, pyramids, and polyhedra).
Flat shapes can also be placed in 3D workspaces.

After creating an object, use `resize it to width 8 height 5`, `scale it by 2`,
`rotate it 45 degrees`, `tilt it 30 degrees around x axis` (3D), `move it right by 2`,
or `make it purple`. Commands edit the last Robo-created object and preserve its
workspace identity. Robo reports a clarification if that object was deleted.
Its searchable **Command library** contains 520 creation and editing examples,
validated by the offline regression corpus. This is a rule-based interpreter;
there is no language-model training, download, or network inference.

Unspecified shapes use visible defaults centered at the origin. Requests with
missing line endpoints or incompatible dimensions receive a clarification.
Specify `3D` on ordinary pages when requesting a surface; in 3D Graph, `plot`
already uses that page's dimension. This initial interpreter supports the
examples above; unrestricted conversation, named-object references, and compound
construction instructions are not yet supported. Load/install the app before
working offline so its bundled workspace assets are available.

## Key Features

- Premium responsive dashboard with topic cards and progress tracking
- Dark/light mode stored in `localStorage`
- Interactive 2D charts, SVG visualizations, simulations, and Three.js scenes
- Professional Euler formula 3D helix with sine and cosine projections
- Topic-wise quiz system with immediate feedback and best scores
- Offline AI Tutor placeholder with rule-based explanations
- Syllabus Navigator for Class 8 through Degree Mathematics
- Scientific Calculator with safe parsing, DEG/RAD mode, memory, and history
- Browser-only architecture with no backend and no API key required
- Offline PWA mode with installable app metadata and service worker caching for visualizations, quizzes, fonts, and routed pages

## Modules

- Algebra: line graph, quadratic graph, simultaneous equations
- Geometry: triangle explorer, Pythagoras, circle explorer, 3D shapes
- Trigonometry: unit circle, sine/cosine waves, wave applications
- Calculus: limits, tangent derivative, integration area, motion
- Complex Numbers: complex plane, multiplication, Euler 2D/3D, Euler identity
- Statistics: direct link to Anveshak at https://www.aimersociety.com/anveshak/
- Linear Algebra: vectors, matrix transformations, eigenvectors
- Math in AI: neural networks, gradient descent, signal processing, compression, GPS, cryptography, robotics
- Syllabus Universe: class-wise cards with formulas, linked labs, and future visualization suggestions
- Scientific Calculator: arithmetic, trigonometry, logarithms, powers, roots, constants, memory, and local history
- Quiz Zone: topic-wise multiple-choice quizzes

## Technology Stack

Vite, React, TypeScript, Tailwind CSS, React Router, Framer Motion, Recharts, Three.js, React Three Fiber, Drei, KaTeX, Lucide React, and browser `localStorage`.

## Installation

```bash
npm install
```

## Running Locally

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Offline PWA

The production build registers a service worker that precaches the generated app shell, visualization bundles, quiz data, fonts, and static assets. After the first successful visit, the installed app and routed pages continue to load offline.

## Folder Structure

```text
src/
  components/      Layout, UI, charts, Three.js wrappers, quiz components
  data/            Topics, formulas, applications, quiz questions
  hooks/           localStorage, theme, progress
  pages/           Routed pages
  utils/           Math, graph, complex, linear algebra helpers
  visualizations/  Interactive modules grouped by topic
```

## Main Routes

- `/` Dashboard
- `/syllabus` Syllabus Navigator
- `/calculator` Scientific Calculator
- `/algebra`, `/geometry`, `/trigonometry`, `/calculus`
- `/complex-numbers`, `/linear-algebra`, `/ai-applications`
- Statistics links open Anveshak: https://www.aimersociety.com/anveshak/
- `/quiz`, `/about`

## Syllabus Navigator

The Syllabus Universe maps Class 8, Class 9, Class 10, Class 11, Class 12, and Degree Mathematics to the app's existing visual labs. Each card includes class level, unit, concept summary, key formulas, difficulty context, a status badge, and a recommended visualization.

Status meanings:

- `Available`: the topic has a direct interactive lab already built.
- `Mapped`: the topic is partially covered by a related existing lab.
- `Future`: the card explains the topic and suggests a future visualization without creating a placeholder page.

The navigator supports search plus level, unit, and status filters.

## Scientific Calculator

The calculator is browser-only and supports:

- Basic arithmetic, percentages, parentheses, decimals, clear, backspace, and equals
- `sin`, `cos`, `tan`, inverse trig, `ln`, `log`, `exp`, powers, roots, factorial, reciprocal, absolute value, `pi`, and `e`
- DEG/RAD angle mode
- Memory controls: MC, MR, M+, M-
- Keyboard input
- Last 20 calculations saved in `localStorage`

Safety note: the calculator does not use raw `eval`. It tokenizes and evaluates expressions with a restricted parser that only accepts approved operators, constants, and math functions.

## Visualization Highlights

- Euler 3D: green helix for e^(i theta), blue cosine projection, red sine projection
- Geometry 3D: cube, sphere, cylinder, cone, and torus with formulas
- Calculus: derivative tangent line and integration rectangles
- Statistics: dedicated Anveshak app link
- AI Applications: gradient descent and neural network data flow

## Quiz System

Each topic has at least five multiple-choice questions. The quiz shows one question at a time, gives immediate feedback, explains the correct answer, computes a final percentage, and saves best scores in `localStorage`.

## Progress Tracking

Progress is stored locally:

- `0%`: not visited
- `25%`: visited
- `75%`: interacted or quiz attempted
- `100%`: marked complete

The dashboard reads local progress and displays both per-topic and overall progress.

Calculator history is stored separately in `math-universe-calculator-history`. Quiz best scores are stored separately from topic progress.

## AI Tutor Placeholder

The AI Tutor is an offline rule-based demo. It recognizes keywords such as slope, derivative, integral, Euler, complex, vector, matrix, gradient, and neural network.

Future model integration should use a secured backend route for OpenAI, Gemini, Groq, or another provider. Do not expose API keys in the browser bundle.

## Suggested LinkedIn Demo Video Flow

1. Open dashboard
2. Show Algebra sliders
3. Show Geometry 3D shape
4. Show Unit circle
5. Show Calculus derivative
6. Show Euler 3D helix
7. Open Anveshak for Statistics
8. Show Matrix transformation
9. Show Gradient descent
10. Show Quiz result

## Future Improvements

- API-powered AI tutor
- More 3D models and guided animations
- Voice explanations
- Teacher dashboard
- Exportable worksheets
- More quizzes and adaptive practice

## Troubleshooting

- If dependencies fail, confirm Node.js and npm are installed and available on PATH.
- If the app starts with stale progress, clear the browser's `localStorage` for the site.
- If a 3D scene does not render, confirm the browser supports WebGL.
- If charts appear cramped, widen the viewport or use the responsive mobile layout.
