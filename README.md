# Math Universe - Complete Visualizations

## Overview

Math Universe is a browser-based interactive mathematics learning platform covering algebra, geometry, trigonometry, calculus, complex numbers, linear algebra, and AI applications. Statistics is linked directly to the dedicated Anveshak app. It is designed for visual intuition: formulas become sliders, graphs, SVG diagrams, 3D scenes, simulations, and quizzes.

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
