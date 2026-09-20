const latexCommand = /\\[a-zA-Z]+/;

export function isProseWorkedStep(value: string) {
  const text = value.replace(/^\\displaystyle\s+/, "").trim();
  if (!text) return false;
  const words = text.split(/\s+/);
  return (
    words.length >= 5 &&
    /^[A-Za-z]/.test(text) &&
    !/[=^_]/.test(text) &&
    !latexCommand.test(text)
  );
}

export function asWorkedMathStep(value: string) {
  const text = value.trim();
  if (!text) return text;
  const withoutDisplay = text.replace(/^\\displaystyle\s+/, "").trim();
  if (isProseWorkedStep(withoutDisplay)) return withoutDisplay;
  if (text.startsWith("\\displaystyle")) return text;
  return `\\displaystyle ${withoutDisplay}`;
}
