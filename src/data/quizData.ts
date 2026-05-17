export type QuizDifficulty = "Easy" | "Medium" | "Hard";

export type QuizQuestion = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: QuizDifficulty;
};

const q = (topic: string, id: string, question: string, options: string[], correctAnswerIndex: number, explanation: string, difficulty: QuizDifficulty = "Easy"): QuizQuestion => ({ id, topic, question, options, correctAnswerIndex, explanation, difficulty });

export const quizTopics = ["Algebra", "Geometry", "Trigonometry", "Calculus", "Complex Numbers", "Statistics", "Linear Algebra", "AI Applications"];

export const quizData: QuizQuestion[] = [
  q("Algebra", "alg-1", "In y = mx + c, what does m represent?", ["Slope", "Area", "Radius", "Root"], 0, "m is the slope or rate of change."),
  q("Algebra", "alg-2", "What is the shape of y = x²?", ["Line", "Circle", "Parabola", "Wave"], 2, "A quadratic graph is a parabola."),
  q("Algebra", "alg-3", "How many real roots exist if the discriminant is negative?", ["Two", "One", "None", "Infinitely many"], 2, "A negative discriminant gives complex roots, not real roots."),
  q("Algebra", "alg-4", "What does the intersection of two lines represent?", ["A shared solution", "A y-axis", "A maximum only", "A radius"], 0, "The point satisfies both equations."),
  q("Algebra", "alg-5", "What is the y-intercept?", ["Where graph crosses y-axis", "Where graph crosses x-axis", "The steepness", "The area"], 0, "It is the value of y when x = 0."),
  q("Geometry", "geo-1", "What is Pythagoras theorem?", ["a+b=c", "a²+b²=c²", "A=πr²", "V=s³"], 1, "Right triangles satisfy a²+b²=c²."),
  q("Geometry", "geo-2", "Circle area formula is", ["2πr", "πr²", "4πr²", "s²"], 1, "Area covered by a circle is πr²."),
  q("Geometry", "geo-3", "Angles in a triangle sum to", ["90°", "180°", "270°", "360°"], 1, "Every Euclidean triangle has angle sum 180°."),
  q("Geometry", "geo-4", "Perimeter means", ["Covered surface", "Total boundary length", "Center point", "Slope"], 1, "Perimeter is distance around a shape."),
  q("Geometry", "geo-5", "Volume of a cube with side s is", ["s²", "6s²", "s³", "πs²"], 2, "Cube volume is side cubed."),
  q("Trigonometry", "tri-1", "On the unit circle, sin θ is the", ["x-coordinate", "y-coordinate", "radius", "area"], 1, "sin θ gives the y-coordinate."),
  q("Trigonometry", "tri-2", "On the unit circle, cos θ is the", ["x-coordinate", "y-coordinate", "diameter", "slope only"], 0, "cos θ gives the x-coordinate."),
  q("Trigonometry", "tri-3", "tan θ equals", ["sin θ / cos θ", "cos θ / sin θ", "sin² θ", "1/cos θ"], 0, "Tangent is sine divided by cosine."),
  q("Trigonometry", "tri-4", "Amplitude means", ["Wave height", "Wave color", "x-intercept", "Probability"], 0, "Amplitude controls vertical height."),
  q("Trigonometry", "tri-5", "π radians equals", ["90°", "180°", "270°", "360°"], 1, "π radians is half a turn."),
  q("Calculus", "cal-1", "A derivative measures", ["Instantaneous rate of change", "Total count", "Randomness", "Only area"], 0, "Derivatives describe local slope."),
  q("Calculus", "cal-2", "An integral often represents", ["Accumulated area", "Only a point", "A matrix", "A cipher"], 0, "Integration accumulates small pieces."),
  q("Calculus", "cal-3", "Derivative of x² is", ["x", "2x", "x³", "2"], 1, "Power rule gives 2x."),
  q("Calculus", "cal-4", "A limit describes", ["Approached value", "Only exact equality", "A dice roll", "A password"], 0, "Limits study behavior as input approaches a value."),
  q("Calculus", "cal-5", "Acceleration is the derivative of", ["Position", "Velocity", "Area", "Mass"], 1, "Acceleration is rate of change of velocity."),
  q("Complex Numbers", "cx-1", "i² equals", ["1", "-1", "0", "i"], 1, "The imaginary unit is defined by i² = -1."),
  q("Complex Numbers", "cx-2", "Magnitude of a + bi is", ["a+b", "sqrt(a²+b²)", "ab", "a-b"], 1, "Magnitude is distance from origin."),
  q("Complex Numbers", "cx-3", "Euler formula is", ["e^(iθ)=cosθ+i sinθ", "a²+b²=c²", "y=mx+c", "V=s³"], 0, "Euler links complex exponentials to rotation."),
  q("Complex Numbers", "cx-4", "Euler identity is", ["e^(iπ)+1=0", "sin²+cos²=2", "i²=1", "πr²=0"], 0, "It connects e, i, π, 1, and 0."),
  q("Complex Numbers", "cx-5", "Complex multiplication usually", ["Rotates and scales", "Only translates", "Only counts", "Sorts data"], 0, "Angles add and magnitudes multiply."),
  q("Statistics", "stat-1", "Mean is", ["Middle value", "Most frequent", "Average", "Spread"], 2, "Mean is sum divided by count."),
  q("Statistics", "stat-2", "Median is", ["Middle of sorted data", "Largest value", "Smallest value", "Noise"], 0, "Median is the central sorted value."),
  q("Statistics", "stat-3", "Mode is", ["Most frequent value", "Average", "Range", "Slope"], 0, "Mode is the value appearing most often."),
  q("Statistics", "stat-4", "Standard deviation measures", ["Spread", "Angle", "Area", "Encryption"], 0, "It measures typical distance from the mean."),
  q("Statistics", "stat-5", "Correlation measures", ["Relationship strength", "Triangle area", "Derivative", "Volume"], 0, "Correlation summarizes linear association."),
  q("Linear Algebra", "lin-1", "Magnitude of [x, y] is", ["x+y", "sqrt(x²+y²)", "xy", "x-y"], 1, "Vector length comes from Pythagoras."),
  q("Linear Algebra", "lin-2", "A matrix transformation can", ["Move vectors/shapes", "Only roll dice", "Only encrypt letters", "Only compute mean"], 0, "Matrices transform coordinates."),
  q("Linear Algebra", "lin-3", "2x2 determinant ad-bc indicates", ["Area scaling/orientation", "Frequency", "Median", "Radius only"], 0, "Determinant shows area scale and flips."),
  q("Linear Algebra", "lin-4", "An eigenvector", ["Keeps its direction after transform", "Always becomes zero", "Is always random", "Is a password"], 0, "It may scale but remains on the same line."),
  q("Linear Algebra", "lin-5", "A rotation matrix represents", ["Turning vectors", "Sorting numbers", "Coin tossing", "Text shifting"], 0, "Rotation matrices rotate points/vectors."),
  q("AI Applications", "ai-1", "Gradient descent", ["Moves downhill on loss", "Draws circles only", "Encrypts text only", "Computes triangle perimeter"], 0, "It updates parameters opposite the gradient."),
  q("AI Applications", "ai-2", "Neural network layer formula is often", ["activation(Wx+b)", "πr²", "a²+b²", "2πr"], 0, "A layer combines weights, input, bias, and activation."),
  q("AI Applications", "ai-3", "Matrix multiplication in AI helps", ["Compute many weighted sums", "Only draw dice", "Remove all data", "Stop learning"], 0, "Matrices batch weighted sums efficiently."),
  q("AI Applications", "ai-4", "Signal processing studies", ["Waves and frequencies", "Only triangles", "Only ciphers", "Only roots"], 0, "Signals are often decomposed into waves."),
  q("AI Applications", "ai-5", "GPS relies heavily on", ["Geometry and distances", "Only median", "Only complex roots", "Only cube volume"], 0, "Distances from satellites locate a position."),
];
