import { chiSquareCdf } from "./chiSquareLessonModel";

export function chiSquareIndependence(source: number[][], alphaValue = 0.05) {
  const columns = Math.max(1, ...source.map((row) => row.length)),
    observed = source.map((row) =>
      Array.from({ length: columns }, (_, index) =>
        Math.max(0, Number.isFinite(row[index]) ? row[index] : 0),
      ),
    ),
    rows = observed.length,
    rowTotals = observed.map((row) =>
      row.reduce((sum, value) => sum + value, 0),
    ),
    columnTotals = Array.from({ length: columns }, (_, column) =>
      observed.reduce((sum, row) => sum + row[column], 0),
    ),
    total = rowTotals.reduce((sum, value) => sum + value, 0),
    expected = observed.map((row, rowIndex) =>
      row.map((_, columnIndex) =>
        total ? (rowTotals[rowIndex] * columnTotals[columnIndex]) / total : 0,
      ),
    ),
    residuals = observed.map((row, rowIndex) =>
      row.map((value, columnIndex) =>
        expected[rowIndex][columnIndex]
          ? (value - expected[rowIndex][columnIndex]) /
            Math.sqrt(expected[rowIndex][columnIndex])
          : 0,
      ),
    ),
    contributions = observed.map((row, rowIndex) =>
      row.map((value, columnIndex) =>
        expected[rowIndex][columnIndex]
          ? (value - expected[rowIndex][columnIndex]) ** 2 /
            expected[rowIndex][columnIndex]
          : 0,
      ),
    ),
    statistic = contributions.flat().reduce((sum, value) => sum + value, 0),
    df = Math.max(1, (rows - 1) * (columns - 1)),
    pValue = 1 - chiSquareCdf(statistic, df),
    alpha = Math.max(0.001, Math.min(0.2, alphaValue)),
    minimumExpected = expected.flat().length ? Math.min(...expected.flat()) : 0,
    cramersV = total
      ? Math.sqrt(
          statistic / (total * Math.max(1, Math.min(rows - 1, columns - 1))),
        )
      : 0;
  return {
    observed,
    rows,
    columns,
    rowTotals,
    columnTotals,
    total,
    expected,
    residuals,
    contributions,
    statistic,
    df,
    pValue,
    alpha,
    reject: pValue < alpha,
    minimumExpected,
    cramersV,
    conditions: {
      allAtLeastFive: minimumExpected >= 5,
      valid: total > 0 && minimumExpected >= 1,
    },
  };
}
