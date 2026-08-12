import { describe, expect, it } from "vitest";
import { browserSpeechRecognitionConstructor, isBrowserSpeechInputSupported, normalizeSpokenMath } from "./browserSpeechInput";

describe("browser speech input", () => {
  it("detects standard and prefixed browser recognition constructors", () => {
    class Recognition {}
    expect(isBrowserSpeechInputSupported({ SpeechRecognition: Recognition } as unknown as Window)).toBe(true);
    expect(browserSpeechRecognitionConstructor({ webkitSpeechRecognition: Recognition } as unknown as Window)).toBe(Recognition);
    expect(isBrowserSpeechInputSupported({} as Window)).toBe(false);
  });

  it("normalizes common spoken mathematical phrases for review", () => {
    expect(normalizeSpokenMath("x squared plus five x minus six equals zero")).toBe("x^2 + five x - six = zero");
    expect(normalizeSpokenMath("square root of x plus one")).toBe("sqrt(x) + one");
  });
});
