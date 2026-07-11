import { describe, expect, it } from "vitest";
import { checkNCERTPracticeAnswer } from "../components/ncert/practice/ncertPracticeUtils";
import { generateNCERTPracticeVariant } from "./ncertPracticeGenerators";

describe("NCERT deterministic practice generators", () => {
  it("generates stable checked variants", () => {
    const a = generateNCERTPracticeVariant("grade7-integers", 3);
    const b = generateNCERTPracticeVariant("grade7-integers", 3);
    expect(a).toEqual(b);
    expect(checkNCERTPracticeAnswer(String(a.answer), a).ok).toBe(true);
  });

  it("generates representative variants across classes", () => {
    const generated = [
      generateNCERTPracticeVariant("class10-linear", 2),
      generateNCERTPracticeVariant("class12-determinants", 2),
      generateNCERTPracticeVariant("class12-lpp", 2),
    ];
    for (const item of generated) {
      expect(checkNCERTPracticeAnswer(String(item.answer), item).ok).toBe(true);
    }
  });
});
