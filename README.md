# Math Universe - Complete Visualizations

## Overview

Math Universe is a browser-based interactive mathematics learning platform covering algebra, geometry, trigonometry, calculus, complex numbers, statistics, linear algebra, and AI applications. It is designed for visual intuition: formulas become sliders, graphs, SVG diagrams, 3D scenes, simulations, and quizzes.

## Key Features

- Premium responsive dashboard with topic cards and progress tracking
- Dark/light mode stored in `localStorage`
- Interactive 2D charts, SVG visualizations, simulations, and Three.js scenes
- Professional Euler formula 3D helix with sine and cosine projections
- Topic-wise quiz system with immediate feedback and best scores
- Offline AI Tutor placeholder with rule-based explanations
- Browser-only architecture with no backend and no API key required

## Modules

- Algebra: line graph, quadratic graph, simultaneous equations
- Geometry: triangle explorer, Pythagoras, circle explorer, 3D shapes
- Trigonometry: unit circle, sine/cosine waves, wave applications
- Calculus: limits, tangent derivative, integration area, motion
- Complex Numbers: complex plane, multiplication, Euler 2D/3D, Euler identity
- Statistics: coin toss, dice, descriptive stats, normal curve, regression
- Linear Algebra: vectors, matrix transformations, eigenvectors
- Math in AI: neural networks, gradient descent, signal processing, compression, GPS, cryptography, robotics
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

## Folder Structure

```text
src/
  components/      Layout, UI, charts, Three.js wrappers, quiz components
  data/            Topics, formulas, applications, quiz questions
  hooks/           localStorage, theme, progress
  pages/           Routed pages
  utils/           Math, graph, statistics, complex, linear algebra helpers
  visualizations/  Interactive modules grouped by topic
```

## Visualization Highlights

- Euler 3D: green helix for e^(i theta), blue cosine projection, red sine projection
- Geometry 3D: cube, sphere, cylinder, cone, and torus with formulas
- Calculus: derivative tangent line and integration rectangles
- Statistics: convergence simulations and regression visualization
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

## AI Tutor Placeholder

The AI Tutor is an offline rule-based demo. It recognizes keywords such as slope, derivative, integral, Euler, complex, mean, vector, matrix, gradient, and neural network.

Future model integration should use a secured backend route for OpenAI, Gemini, Groq, or another provider. Do not expose API keys in the browser bundle.

## Suggested LinkedIn Demo Video Flow

1. Open dashboard
2. Show Algebra sliders
3. Show Geometry 3D shape
4. Show Unit circle
5. Show Calculus derivative
6. Show Euler 3D helix
7. Show Coin/Dice simulation
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
