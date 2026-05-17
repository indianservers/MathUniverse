export type FormulaItem = {
  id: string;
  title: string;
  formula: string;
  explanation: string;
  topicId: string;
};

export const formulaData: FormulaItem[] = [
  { id: "line", title: "Straight Line", formula: "y = mx + c", explanation: "Slope m controls tilt, and c controls the y-intercept.", topicId: "algebra" },
  { id: "quadratic", title: "Quadratic", formula: "y = ax^2 + bx + c", explanation: "A parabola shaped by its leading coefficient, linear term, and offset.", topicId: "algebra" },
  { id: "pythagoras", title: "Pythagorean Theorem", formula: "a^2 + b^2 = c^2", explanation: "In a right triangle, the square on the hypotenuse equals the sum of the other squares.", topicId: "geometry" },
  { id: "circumference", title: "Circle Circumference", formula: "C = 2\\pi r", explanation: "The distance around a circle grows linearly with radius.", topicId: "geometry" },
  { id: "circle-area", title: "Circle Area", formula: "A = \\pi r^2", explanation: "Circle area grows with the square of the radius.", topicId: "geometry" },
  { id: "trig-identity", title: "Pythagorean Identity", formula: "\\sin^2\\theta + \\cos^2\\theta = 1", explanation: "Sine and cosine coordinates always land on the unit circle.", topicId: "trigonometry" },
  { id: "derivative-x2", title: "Derivative of x Squared", formula: "\\frac{d}{dx}x^2 = 2x", explanation: "The slope of y = x squared changes linearly with x.", topicId: "calculus" },
  { id: "definite-integral", title: "Definite Integral", formula: "\\int_a^b f(x)\\,dx", explanation: "Accumulated signed area under a curve between a and b.", topicId: "calculus" },
  { id: "euler", title: "Euler Formula", formula: "e^{i\\theta} = \\cos\\theta + i\\sin\\theta", explanation: "Complex exponentials trace rotations on the unit circle.", topicId: "complex" },
  { id: "euler-identity", title: "Euler Identity", formula: "e^{i\\pi} + 1 = 0", explanation: "A compact bridge between five fundamental constants.", topicId: "complex" },
  { id: "mean", title: "Mean", formula: "\\bar{x}=\\frac{1}{n}\\sum_{i=1}^{n}x_i", explanation: "The arithmetic center of a dataset.", topicId: "statistics" },
  { id: "std-dev", title: "Standard Deviation", formula: "\\sigma=\\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(x_i-\\mu)^2}", explanation: "Typical distance from the mean.", topicId: "statistics" },
  { id: "vector-mag", title: "Vector Magnitude", formula: "\\lVert v\\rVert=\\sqrt{x^2+y^2}", explanation: "The length of a vector from its components.", topicId: "linear-algebra" },
  { id: "matrix-multiply", title: "Matrix Multiplication", formula: "(AB)_{ij}=\\sum_k A_{ik}B_{kj}", explanation: "Rows from A combine with columns from B.", topicId: "linear-algebra" },
];
