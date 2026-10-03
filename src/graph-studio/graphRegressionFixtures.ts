// Independent numerical oracles shared by the 2D and 3D regression matrices.
export const numericalCases: Array<[string, number, number]> = [
  ["0", 2, 0], ["5", -3, 5], ["-7", 1, -7], ["x", 3, 3], ["-x", 3, -3],
  ["x+2", 3, 5], ["x-2", 3, 1], ["2*x", 3, 6], ["x/2", 3, 1.5], ["2x", 3, 6],
  ["x^2", -3, 9], ["x^3", -2, -8], ["x^4", -2, 16], ["x^0", 3, 1], ["x^-2", 2, .25],
  ["-x^2", 3, -9], ["(-x)^2", 3, 9], ["2^3^2", 0, 512], ["2^-3", 0, .125], ["-2^2", 0, -4],
  ["sqrt(x)", 9, 3], ["cbrt(x)", -8, -2], ["abs(x)", -5, 5], ["floor(x)", 2.7, 2], ["ceil(x)", 2.1, 3],
  ["round(x)", 2.7, 3], ["sign(x)", -3, -1], ["sinc(x)", 0, 1], ["sin(x)", 0, 0], ["cos(x)", 0, 1],
  ["tan(x)", 0, 0], ["asin(x)", 0, 0], ["acos(x)", 1, 0], ["atan(x)", 0, 0], ["sinh(x)", 0, 0],
  ["cosh(x)", 0, 1], ["tanh(x)", 0, 0], ["sec(x)", 0, 1], ["csc(x)", Math.PI/2, 1], ["cot(x)", Math.PI/4, 1],
  ["ln(x)", Math.E, 1], ["log(x)", 100, 2], ["exp(x)", 0, 1], ["pi", 0, Math.PI], ["e", 0, Math.E],
  ["sin(pi/2)", 0, 1], ["2(x+1)", 2, 6], ["(x+1)(x-1)", 3, 8], ["x(x+1)", 2, 6], ["x\u00b2", 3, 9],
  ["x\u00b3", 2, 8], ["X^2", 3, 9], ["SIN(X)", 0, 0], ["3\u00d7x", 2, 6], ["x\u00f72", 6, 3],
  ["x\u22122", 5, 3], ["1/(1+x^2)", 2, .2], ["sqrt(abs(x))", -9, 3], ["exp(ln(x))", 2, 2], ["sin(x)^2+cos(x)^2", 1, 1],
];
export const invalidCases = ["", "x^", "x+", "*x", "x/", "sin()", "()", "(x", "x)", "x..2", ".", "sqrt()", "unknown(x)", "x=", "x**2", "x//2", "x^^2", "1,2", "window", "x;alert(1)"];
export type RegressionCase = { name: string; run: () => void };
