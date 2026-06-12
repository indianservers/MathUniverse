import { describe, expect, it } from "vitest";
import { recognizeMathKeywords, type MathTokenCategory } from "./mathKeywordRecognizer";

function categoriesFor(input: string) {
  return recognizeMathKeywords(input).map((token) => token.category);
}

function token(input: string, text: string) {
  return recognizeMathKeywords(input).find((recognized) => recognized.text === text);
}

function expectCategory(input: string, text: string, category: MathTokenCategory) {
  expect(token(input, text)).toMatchObject({ category });
}

describe("math keyword recognizer", () => {
  it("recognizes basic roots and numbers", () => {
    expectCategory("sqrt(34)", "sqrt", "power-root");
    expectCategory("sqrt(34)", "34", "number");
  });

  it("recognizes root, arithmetic, trig, numbers, and grouping", () => {
    const categories = categoriesFor("sqrt(34) + tan(45)");
    expect(categories).toEqual(expect.arrayContaining(["power-root", "arithmetic", "trigonometry", "number", "grouping"]));
  });

  it("recognizes missing-parentheses function text", () => {
    expectCategory("sin 30", "sin", "trigonometry");
    expectCategory("sqrt 34", "sqrt", "power-root");
  });

  it("recognizes algebra commands and variables", () => {
    const input = "solve 2x + 5 = 15";
    expectCategory(input, "solve", "algebra");
    expectCategory(input, "x", "variable");
    expectCategory(input, "=", "relation");
  });

  it("recognizes factoring syntax", () => {
    const input = "factor x^2 - 5x + 6";
    expectCategory(input, "factor", "algebra");
    expectCategory(input, "^", "power-root");
  });

  it("recognizes calculus commands", () => {
    expectCategory("derivative of sin(x)", "derivative", "calculus");
    expectCategory("derivative of sin(x)", "sin", "trigonometry");
    expectCategory("integrate x^2 dx", "integrate", "calculus");
    expectCategory("integrate x^2 dx", "dx", "calculus");
    expectCategory("limit x->0 sin(x)/x", "limit", "calculus");
    expectCategory("limit x->0 sin(x)/x", "->", "relation");
  });

  it("recognizes statistics", () => {
    expectCategory("mean of 4, 6, 8, 10", "mean", "statistics");
    expectCategory("standard deviation of 4, 6, 8, 10", "standard deviation", "statistics");
  });

  it("recognizes matrix operations", () => {
    expectCategory("determinant [[1,2],[3,4]]", "determinant", "matrix");
    expectCategory("inverse [[1,2],[3,4]]", "inverse", "matrix");
  });

  it("recognizes engineering mathematics terms", () => {
    expectCategory("Laplace transform of sin(t)", "Laplace transform", "engineering");
    expectCategory("Fourier series of x", "Fourier series", "engineering");
    expectCategory("Newton Raphson method", "Newton Raphson", "engineering");
    expectCategory("second order differential equation", "second order differential equation", "engineering");
  });

  it("recognizes word-problem language", () => {
    expect(categoriesFor("A train travels 60 km in 2 hours")).toEqual(expect.arrayContaining(["word-problem", "unit", "number"]));
    expect(categoriesFor("twice a number plus five equals fifteen")).toEqual(expect.arrayContaining(["word-problem", "arithmetic"]));
  });

  it("recognizes constants", () => {
    const tokens = recognizeMathKeywords("pi + e");
    expect(tokens.filter((recognized) => recognized.category === "constant").map((recognized) => recognized.text)).toEqual(["pi", "e"]);
  });

  it("marks unknown words without crashing", () => {
    expectCategory("apple mango x + 2", "apple", "unknown");
    expectCategory("apple mango x + 2", "mango", "unknown");
    expectCategory("apple mango x + 2", "x", "variable");
  });
});
