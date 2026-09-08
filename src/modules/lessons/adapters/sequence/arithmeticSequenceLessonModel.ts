export function arithmeticSequenceAnalysis(
  firstValue: number,
  differenceValue: number,
  countValue = 10,
) {
  const first = Number.isFinite(firstValue) ? firstValue : 0,
    difference = Number.isFinite(differenceValue) ? differenceValue : 0,
    count = Math.max(1, Math.min(100, Math.round(countValue))),
    term = (nValue: number) =>
      first + (Math.max(1, Math.round(nValue)) - 1) * difference,
    terms = Array.from({ length: count }, (_, index) => term(index + 1)),
    differences = terms.slice(1).map((value, index) => value - terms[index]),
    intercept = first - difference,
    minTerm = Math.min(...terms),
    maxTerm = Math.max(...terms);
  return {
    first,
    difference,
    count,
    terms,
    differences,
    intercept,
    minTerm,
    maxTerm,
    term,
    indexOf(value: number) {
      if (!Number.isFinite(value)) return null;
      if (difference === 0) return value === first ? 1 : null;
      const n = 1 + (value - first) / difference;
      return Number.isInteger(n) && n >= 1 ? n : null;
    },
  };
}
export function arithmeticQuizChoices(answerValue: number) {
  const answer = Math.round(answerValue),
    candidates = [answer - 4, answer - 3, answer, answer + 1];
  return candidates.filter(
    (value, index) => candidates.indexOf(value) === index,
  );
}
