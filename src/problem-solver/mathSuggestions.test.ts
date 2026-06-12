import { describe, expect, it } from "vitest";
import { recognizeMathKeywords } from "./mathKeywordRecognizer";
import { buildMathSuggestions, detectEducationLevel } from "./mathSuggestions";

function messagesFor(input: string) {
  const tokens = recognizeMathKeywords(input);
  return buildMathSuggestions(input, tokens).map((suggestion) => suggestion.message);
}

describe("math suggestions", () => {
  it("suggests function autocomplete", () => {
    expect(messagesFor("sq")).toContain("Try sqrt().");
    expect(messagesFor("ta")).toContain("Try tan().");
    expect(messagesFor("der")).toContain("Try derivative of.");
    expect(messagesFor("int")).toContain("Try integrate.");
  });

  it("suggests missing function parentheses", () => {
    expect(messagesFor("sqrt 34")).toContain("Did you mean sqrt(34)?");
    expect(messagesFor("sin 30")).toContain("Did you mean sin(30)?");
  });

  it("suggests implicit multiplication hints", () => {
    expect(messagesFor("2x")).toContain("Interpreted as multiplication, for example 2x means 2*x.");
    expect(messagesFor("3(x+1)")).toContain("Interpreted as multiplication, for example 3(x+1) means 3*(x+1).");
  });

  it("suggests degree assumptions for numeric trig", () => {
    expect(messagesFor("sin(30)")).toContain("Trig numeric input is interpreted in degrees unless radians are specified.");
  });

  it("suggests statistics and matrix syntax", () => {
    expect(messagesFor("average 4 6 8 10")).toContain("Try mean of 4, 6, 8, 10.");
    expect(messagesFor("det 1 2 3 4")).toContain("Try determinant [[1,2],[3,4]].");
  });

  it("suggests calculus syntax", () => {
    expect(messagesFor("d x^2")).toContain("Try derivative of x^2.");
    expect(messagesFor("lim x 0 sin(x)/x")).toContain("Try limit x->0 sin(x)/x.");
  });

  it("suggests engineering and word-problem guidance", () => {
    expect(messagesFor("laplace sin(t)").join(" ")).toContain("Recognized Laplace Transform.");
    expect(messagesFor("A train travels 60 km in 2 hours")).toContain("Recognized word-problem language. Try converting it into an equation first.");
  });

  it("suggests clearer syntax when unknown words dominate", () => {
    expect(messagesFor("please solve apple x")).toContain("Some words were not recognized as math keywords. Try a clearer mathematical expression.");
  });

  it("detects education levels", () => {
    expect(detectEducationLevel(recognizeMathKeywords("sqrt(34)"))).toBe("School");
    expect(detectEducationLevel(recognizeMathKeywords("derivative of sin(x)"))).toBe("Intermediate");
    expect(detectEducationLevel(recognizeMathKeywords("Laplace transform of sin(t)"))).toBe("Engineering");
  });
});
