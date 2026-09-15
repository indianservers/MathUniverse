export type ChartKind = "bars" | "line" | "number-line" | "circle" | "fraction";

export type StudySpec = {
  chart: ChartKind;
  chartTitle: string;
  xLabel: string;
  yLabel: string;
  seriesLabel: string;
  liveLabel: string;
  liveValue: (t: number) => string;
  bars: Array<{ label: string; value: number; color: string }>;
  points: Array<{ x: number; y: number }>;
};

function spec(
  chart: ChartKind,
  chartTitle: string,
  xLabel: string,
  yLabel: string,
  seriesLabel: string,
  liveValue: (t: number) => string,
  bars: Array<[string, number, string]>,
  points: Array<[number, number]>,
): StudySpec {
  return {
    chart,
    chartTitle,
    xLabel,
    yLabel,
    seriesLabel,
    liveLabel: seriesLabel,
    liveValue,
    bars: bars.map(([label, value, color]) => ({ label, value, color })),
    points: points.map(([x, y]) => ({ x, y })),
  };
}

export const batch6StudySpecs: Record<number, StudySpec> = {
  2001: spec("fraction", "Partial Quotients parts", "part", "size", "share", (t) => `${1 + Math.round(t * 8)}/4`, [
    ["case A", 1.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 5.0], [2, 2.0]]),
  2002: spec("fraction", "Convergents parts", "part", "size", "share", (t) => `${1 + Math.round(t * 2)}/5`, [
    ["case A", 1.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 5.0], [2, 2.0]]),
  2003: spec("fraction", "Euclidean Algorithm Link parts", "part", "size", "share", (t) => `${1 + Math.round(t * 3)}/6`, [
    ["case A", 1.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 5.0], [2, 2.0]]),
  2004: spec("fraction", "Best Rational Approximations parts", "part", "size", "share", (t) => `${1 + Math.round(t * 4)}/7`, [
    ["case A", 1.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 5.0], [2, 2.0]]),
  2005: spec("fraction", "Periodic Square Roots parts", "part", "size", "share", (t) => `${1 + Math.round(t * 5)}/3`, [
    ["case A", 1.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 5.0], [2, 2.0]]),
  2006: spec("number-line", "Collatz Conjecture values", "index", "value", "live", (t) => String(6 + Math.round(t * 8)), [
    ["case A", 6.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 1.0], [2, 2.0]]),
  2007: spec("number-line", "Goldbach Conjecture values", "index", "value", "live", (t) => String(7 + Math.round(t * 9)), [
    ["case A", 28.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 2.0], [2, 10.0]]),
  2008: spec("line", "Riemann Hypothesis and Primes graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 2.0], [2, 2.0]]),
  2009: spec("number-line", "Fermat's Last Theorem values", "index", "value", "live", (t) => String(2 + Math.round(t * 11)), [
    ["case A", 7.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 2.0], [2, 4.0]]),
  2010: spec("number-line", "Four-Color Theorem values", "index", "value", "live", (t) => String(3 + Math.round(t * 7)), [
    ["case A", 8.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 4.0], [2, 3.0]]),
  2011: spec("bars", "Confidence Intervals comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 16)), [
    ["case A", 9.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 6.0], [2, 2.0]]),
  2012: spec("line", "Margin of Error and Sample Size graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 28.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 4.0], [2, 2.0]]),
  2013: spec("line", "Hypothesis Tests graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 40.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 40.0], [1, 5.0], [2, 2.0]]),
  2014: spec("line", "p-Values graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 0.06, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 0.2, "#8d4ce4"]
  ], [[0, 0.06], [1, 0.0], [2, 0.2]]),
  2015: spec("bars", "Type I and Type II Error comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 12)), [
    ["case A", 0.07, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 0.07], [1, 2.0], [2, 2.0]]),
  2016: spec("line", "Slope Fields graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 3.0], [2, 2.0]]),
  2017: spec("line", "Euler Method graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 7.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 10.0], [2, 2.0]]),
  2018: spec("bars", "Growth and Decay IVPs comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 24)), [
    ["case A", 5.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 0.0], [2, 2.0]]),
  2019: spec("line", "Logistic Differential Equation graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 60.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 60.0], [1, 2.0], [2, 2.0]]),
  2020: spec("line", "Second-Order Oscillator graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 2.0], [2, 2.0]]),
  2021: spec("line", "Gamma Function graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 504.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 504.0], [1, 1.0], [2, 2.0]]),
  2022: spec("line", "Beta Function graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 2.0], [2, 2.0]]),
  2023: spec("line", "Error Function graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 0.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 0.0], [1, 1.0], [2, 2.0]]),
  2024: spec("line", "Zeta Function graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", -1.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 2.0], [2, -1.0]]),
  2025: spec("line", "Bessel Function graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 0.0], [2, 2.0]]),
  10057: spec("number-line", "Proof Structure and Logical Statements values", "index", "value", "live", (t) => String(7 + Math.round(t * 9)), [
    ["case A", 9.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 2.0], [2, 2.0]]),
  10058: spec("circle", "Vertically Opposite Angles turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=8`, [
    ["case A", 80.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 80.0], [1, 2.0], [2, 2.0]]),
  10059: spec("number-line", "Linear Pair Axiom and Converse values", "index", "value", "live", (t) => String(2 + Math.round(t * 11)), [
    ["case A", 70.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 70.0], [1, 2.0], [2, 2.0]]),
  10060: spec("circle", "Corresponding Angles turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=3`, [
    ["case A", 60.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 60.0], [1, 2.0], [2, 2.0]]),
  10061: spec("circle", "Alternate Interior Angles turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=4`, [
    ["case A", 50.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 50.0], [1, 2.0], [2, 2.0]]),
  10062: spec("circle", "Interior Angles on the Same Side turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=5`, [
    ["case A", 40.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 40.0], [1, 2.0], [2, 2.0]]),
  10063: spec("number-line", "Parallel Line Converse Theorems values", "index", "value", "live", (t) => String(6 + Math.round(t * 10)), [
    ["case A", 30.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 2.0], [2, 2.0]]),
  10064: spec("circle", "Triangle Angle Sum Theorem turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=7`, [
    ["case A", 10.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 2.0], [2, 2.0]]),
  10065: spec("circle", "Exterior Angle Theorem turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=8`, [
    ["case A", 9.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 2.0], [2, 2.0]]),
  10066: spec("circle", "SAS Congruence turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=2`, [
    ["case A", 9.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 11.0], [2, 2.0]]),
  10067: spec("circle", "ASA Congruence turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=3`, [
    ["case A", 9.0, "#268ff1"], ["case B", 13.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 13.0], [2, 2.0]]),
  10068: spec("circle", "AAS Congruence turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=4`, [
    ["case A", 9.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 9.0], [2, 2.0]]),
  10069: spec("circle", "SSS Congruence turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=5`, [
    ["case A", 9.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 11.0], [2, 2.0]]),
  10070: spec("circle", "RHS Congruence turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=6`, [
    ["case A", 9.0, "#268ff1"], ["case B", 13.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 13.0], [2, 2.0]]),
  10071: spec("circle", "Equal Sides and Equal Angles turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=7`, [
    ["case A", 9.0, "#268ff1"], ["case B", 15.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 15.0], [2, 2.0]]),
  10072: spec("circle", "Triangle Inequality turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=8`, [
    ["case A", 9.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 9.0], [2, 2.0]]),
  10073: spec("bars", "Parallelogram Opposite Sides comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 24)), [
    ["case A", 7.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 0.0], [2, 6.0]]),
  10074: spec("circle", "Parallelogram Opposite Angles turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=3`, [
    ["case A", 9.0, "#268ff1"], ["case B", 70.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 70.0], [2, 2.0]]),
  10075: spec("bars", "Parallelogram Diagonals comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 12)), [
    ["case A", 3.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 0.0], [2, 8.0]]),
  10076: spec("bars", "Conditions for a Quadrilateral to Be a Parallelogram comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 16)), [
    ["case A", 4.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 0.0], [2, 9.0]]),
  10077: spec("bars", "Midpoint Theorem comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 20)), [
    ["case A", 5.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 0.0], [2, 10.0]]),
  10078: spec("bars", "Converse of Midpoint Theorem comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 24)), [
    ["case A", 6.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 0.0], [2, 11.0]]),
  10079: spec("fraction", "Heron's Formula Derivation parts", "part", "size", "share", (t) => `${1 + Math.round(t * 8)}/7`, [
    ["case A", 70.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 70.0], [1, 7.0], [2, 2.0]]),
  10080: spec("fraction", "Semi-Perimeter Lab parts", "part", "size", "share", (t) => `${1 + Math.round(t * 2)}/3`, [
    ["case A", 12.0, "#268ff1"], ["case B", 30.6, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 30.6], [2, 2.0]]),
  10081: spec("fraction", "Coordinate Area versus Heron's Formula parts", "part", "size", "share", (t) => `${1 + Math.round(t * 3)}/4`, [
    ["case A", 12.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 3.0], [2, 4.0]]),
  10082: spec("fraction", "Combined Solids parts", "part", "size", "share", (t) => `${1 + Math.round(t * 4)}/5`, [
    ["case A", 12.5, "#268ff1"], ["case B", 15.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 12.5], [1, 15.0], [2, 2.0]]),
  10083: spec("bars", "Distance Formula comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 24)), [
    ["case A", 30.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 5.0], [2, 2.0]]),
  10084: spec("bars", "Midpoint Formula comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 28)), [
    ["case A", 42.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 6.0], [2, 2.0]]),
  10085: spec("bars", "Internal Section Formula comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 12)), [
    ["case A", 56.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 56.0], [1, 7.0], [2, 2.0]]),
  10086: spec("bars", "External Section Formula comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 16)), [
    ["case A", 18.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 2.0], [2, 2.0]]),
  10087: spec("circle", "Area of Triangle Using Coordinates turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=2`, [
    ["case A", 15.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 15.0], [1, 3.0], [2, 10.0]]),
  10088: spec("bars", "Collinearity Using Coordinate Area comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 24)), [
    ["case A", 12.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 4.0], [2, 3.0]]),
  10089: spec("circle", "Equal Chords and Equal Angles turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=4`, [
    ["case A", 9.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 9.0], [2, 2.0]]),
  10090: spec("circle", "Perpendicular from Centre to Chord turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=5`, [
    ["case A", 6.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 0.0], [2, 5.0]]),
  10091: spec("circle", "Angle Subtended by an Arc turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=6`, [
    ["case A", 9.0, "#268ff1"], ["case B", 13.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 13.0], [2, 2.0]]),
  10092: spec("circle", "Angle in a Semicircle turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=7`, [
    ["case A", 28.0, "#268ff1"], ["case B", 71.4, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 71.4], [2, 2.0]]),
  10093: spec("circle", "Angles in the Same Segment turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=8`, [
    ["case A", 9.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 11.0], [2, 2.0]]),
  10094: spec("circle", "Cyclic Quadrilateral turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=2`, [
    ["case A", 4.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 0.0], [2, 9.0]]),
  10095: spec("circle", "Opposite Angles of a Cyclic Quadrilateral turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=3`, [
    ["case A", 9.0, "#268ff1"], ["case B", 15.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 15.0], [2, 2.0]]),
  10096: spec("circle", "Tangent Perpendicular to Radius turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=4`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10097: spec("circle", "Tangent Lengths from an External Point turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=5`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10098: spec("circle", "Angle of Elevation turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=6`, [
    ["case A", 9.0, "#268ff1"], ["case B", 70.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 70.0], [2, 2.0]]),
  10099: spec("circle", "Angle of Depression turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=7`, [
    ["case A", 9.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 9.0], [2, 2.0]]),
  10100: spec("circle", "Shadow-Length Modelling turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=8`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10101: spec("circle", "Two-Observer Height Problems turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=2`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 9.0]]),
  10102: spec("number-line", "Grouped Mean by Direct Method values", "index", "value", "live", (t) => String(3 + Math.round(t * 9)), [
    ["case A", 7.5, "#268ff1"], ["case B", 1.5, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 7.5], [1, 1.5], [2, 8.0]]),
  10103: spec("number-line", "Grouped Mean by Assumed Mean values", "index", "value", "live", (t) => String(4 + Math.round(t * 10)), [
    ["case A", 8.5, "#268ff1"], ["case B", 1.75, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 8.5], [1, 1.75], [2, 9.0]]),
  10104: spec("number-line", "Grouped Mean by Step Deviation values", "index", "value", "live", (t) => String(5 + Math.round(t * 11)), [
    ["case A", 4.0, "#268ff1"], ["case B", 0.5, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 0.5], [2, 10.0]]),
  10105: spec("bars", "Less-Than Cumulative Frequency comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 12)), [
    ["case A", 12.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 3.0], [2, 2.0]]),
  10106: spec("bars", "More-Than Cumulative Frequency comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 16)), [
    ["case A", 20.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 4.0], [2, 2.0]]),
  10107: spec("bars", "Less-Than Ogive comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 20)), [
    ["case A", 30.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 5.0], [2, 2.0]]),
  10108: spec("bars", "More-Than Ogive comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 24)), [
    ["case A", 42.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 6.0], [2, 2.0]]),
  10109: spec("number-line", "Median from an Ogive values", "index", "value", "live", (t) => String(3 + Math.round(t * 11)), [
    ["case A", 7.0, "#268ff1"], ["case B", 7.5, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 7.5], [2, 2.0]]),
  10110: spec("fraction", "Frustum of a Cone parts", "part", "size", "share", (t) => `${1 + Math.round(t * 4)}/3`, [
    ["case A", 18.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 2.0], [2, 2.0]]),
  10111: spec("fraction", "Combined Solids parts", "part", "size", "share", (t) => `${1 + Math.round(t * 5)}/4`, [
    ["case A", 100.0, "#268ff1"], ["case B", 60.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 100.0], [1, 60.0], [2, 2.0]]),
  10112: spec("line", "Types of Relations graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 12.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 4.0], [2, 2.0]]),
  10113: spec("line", "Reflexive Relations graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 20.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 5.0], [2, 2.0]]),
  10114: spec("line", "Symmetric Relations graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 30.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 6.0], [2, 2.0]]),
  10115: spec("line", "Transitive Relations graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 42.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 7.0], [2, 2.0]]),
  10116: spec("line", "Equivalence Relations graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 14.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 2.0], [2, 2.0]]),
  10117: spec("line", "One-One Functions graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 3.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 2.0], [2, 5.0]]),
  10118: spec("line", "Many-One Functions graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 4.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 2.0], [2, 6.0]]),
  10119: spec("line", "Into Functions graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 50.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 50.0], [1, 5.0], [2, 2.0]]),
  10120: spec("line", "Onto Functions graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 6.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 2.0], [2, 8.0]]),
  10121: spec("line", "Composition of Functions graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 28.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 7.0], [2, 2.0]]),
  10122: spec("line", "Invertible Functions graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 2.0], [2, 10.0]]),
  10123: spec("fraction", "Binary Operations parts", "part", "size", "share", (t) => `${1 + Math.round(t * 3)}/6`, [
    ["case A", 18.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 3.0], [2, 2.0]]),
  10124: spec("circle", "Domain and Range of Trigonometric Functions turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=4`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10125: spec("circle", "Transformation of Trigonometric Graphs turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=5`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10126: spec("circle", "General Solutions of Trigonometric Equations turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=6`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10127: spec("circle", "Principal Solutions turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=7`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10128: spec("bars", "Logic of Mathematical Induction comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 24)), [
    ["case A", 1.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 4.0], [2, 1.0]]),
  10129: spec("bars", "Base Case and Inductive Step comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 28)), [
    ["case A", 1.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 5.0], [2, 1.0]]),
  10130: spec("bars", "Sum Formula by Induction comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 12)), [
    ["case A", 1.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 6.0], [2, 1.0]]),
  10131: spec("bars", "Divisibility by Induction comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 16)), [
    ["case A", 1.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 7.0], [2, 1.0]]),
  10132: spec("bars", "Inequality by Induction comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 20)), [
    ["case A", 1.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 8.0], [2, 1.0]]),
  10133: spec("bars", "Strong Induction Introduction comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 24)), [
    ["case A", 1.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 9.0], [2, 1.0]]),
  10134: spec("bars", "Binomial Expansion comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 28)), [
    ["case A", 18.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 2.0], [2, 2.0]]),
  10135: spec("bars", "General Term comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 12)), [
    ["case A", 30.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 3.0], [2, 2.0]]),
  10136: spec("bars", "Middle Term comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 16)), [
    ["case A", 12.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 4.0], [2, 2.0]]),
  10137: spec("bars", "Independent Term comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 20)), [
    ["case A", 20.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 5.0], [2, 2.0]]),
  10138: spec("bars", "Binomial Approximation comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 24)), [
    ["case A", 5.6, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 5.6], [1, 1.0], [2, 2.0]]),
  10139: spec("bars", "Pascal Identity comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 28)), [
    ["case A", 42.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 7.0], [2, 2.0]]),
  10140: spec("bars", "Combinatorial Interpretation comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 12)), [
    ["case A", 14.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 2.0], [2, 2.0]]),
  10141: spec("bars", "Parabola Standard Forms comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 16)), [
    ["case A", 24.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 24.0], [1, 3.0], [2, 2.0]]),
  10142: spec("bars", "Focus-Directrix Definition comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 20)), [
    ["case A", 36.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 36.0], [1, 4.0], [2, 2.0]]),
  10143: spec("bars", "Ellipse Standard Forms comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 24)), [
    ["case A", 50.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 50.0], [1, 5.0], [2, 2.0]]),
  10144: spec("bars", "Hyperbola Standard Forms comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 28)), [
    ["case A", 18.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 6.0], [2, 2.0]]),
  10145: spec("bars", "Eccentricity comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 12)), [
    ["case A", 28.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 7.0], [2, 2.0]]),
  10146: spec("bars", "Parametric Coordinates comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 16)), [
    ["case A", 10.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 2.0], [2, 2.0]]),
  10147: spec("bars", "Tangent to a Parabola comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 20)), [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10148: spec("bars", "Normal to a Parabola comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 24)), [
    ["case A", 28.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 4.0], [2, 2.0]]),
  10149: spec("bars", "Tangent to an Ellipse comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 28)), [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10150: spec("bars", "Tangent to a Hyperbola comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 12)), [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10151: spec("bars", "Conic Identification from General Equation comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 16)), [
    ["case A", 10.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 7.0], [2, 10.0]]),
  10152: spec("fraction", "Direction Ratios parts", "part", "size", "share", (t) => `${1 + Math.round(t * 4)}/5`, [
    ["case A", 6.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 2.0], [2, 2.0]]),
  10153: spec("circle", "Direction Cosines turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=5`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10154: spec("bars", "Line Through Two Points in 3D comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 28)), [
    ["case A", 20.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 4.0], [2, 3.0]]),
  10155: spec("line", "Vector Equation of a Line graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 6.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 5.0], [2, 6.0]]),
  10156: spec("bars", "Cartesian Equation of a Line comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 16)), [
    ["case A", 12.8, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 12.8], [1, 11.0], [2, 2.0]]),
  10157: spec("bars", "Skew Lines comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 20)), [
    ["case A", 56.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 56.0], [1, 7.0], [2, 2.0]]),
  10158: spec("bars", "Shortest Distance Between Lines comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 24)), [
    ["case A", 18.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 2.0], [2, 2.0]]),
  10159: spec("bars", "Plane Equation comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 28)), [
    ["case A", 10.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 3.0], [2, 10.0]]),
  10160: spec("bars", "Point-Normal Form comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 12)), [
    ["case A", 12.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 4.0], [2, 2.0]]),
  10161: spec("bars", "Intercept Form of a Plane comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 16)), [
    ["case A", 20.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 5.0], [2, 2.0]]),
  10162: spec("bars", "Distance from Point to Plane comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 20)), [
    ["case A", 30.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 6.0], [2, 2.0]]),
  10163: spec("circle", "Angle Between Two Planes turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=8`, [
    ["case A", 9.0, "#268ff1"], ["case B", 13.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 13.0], [2, 2.0]]),
  10164: spec("circle", "Angle Between Line and Plane turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=2`, [
    ["case A", 9.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 9.0], [2, 2.0]]),
  10165: spec("line", "Left-Hand and Right-Hand Limits graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 8.0], [2, 3.0]]),
  10166: spec("bars", "Continuity at a Point comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 16)), [
    ["case A", 36.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 36.0], [1, 4.0], [2, 2.0]]),
  10167: spec("bars", "Continuity on an Interval comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 20)), [
    ["case A", 15.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 15.0], [1, 10.0], [2, 2.0]]),
  10168: spec("bars", "Removable Discontinuity comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 24)), [
    ["case A", 18.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 6.0], [2, 2.0]]),
  10169: spec("bars", "Jump Discontinuity comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 28)), [
    ["case A", 28.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 7.0], [2, 2.0]]),
  10170: spec("bars", "Infinite Discontinuity comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 12)), [
    ["case A", 10.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 2.0], [2, 2.0]]),
  10171: spec("bars", "Differentiability versus Continuity comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 16)), [
    ["case A", 18.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 3.0], [2, 2.0]]),
  10172: spec("bars", "Rolle's Theorem comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 20)), [
    ["case A", 28.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 4.0], [2, 2.0]]),
  10173: spec("number-line", "Lagrange Mean Value Theorem values", "index", "value", "live", (t) => String(4 + Math.round(t * 10)), [
    ["case A", 7.0, "#268ff1"], ["case B", 1.25, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 1.25], [2, 7.0]]),
  10174: spec("bars", "Rate of Change comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 28)), [
    ["case A", 35429.4, "#268ff1"], ["case B", 19.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 35429.4], [1, 19.0], [2, 2.0]]),
  10175: spec("bars", "Tangents and Normals comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 12)), [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 2.0]]),
  10176: spec("line", "Increasing and Decreasing Functions graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 6.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 2.0], [2, 2.0]]),
  10177: spec("bars", "Local Maxima and Minima comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 20)), [
    ["case A", 12.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 3.0], [2, 2.0]]),
  10178: spec("bars", "Absolute Maxima and Minima comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 24)), [
    ["case A", 20.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 4.0], [2, 2.0]]),
  10179: spec("bars", "Approximation Using Differentials comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 28)), [
    ["case A", 6.5, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 6.5], [1, 1.0], [2, 2.0]]),
  10180: spec("fraction", "Integration by Substitution parts", "part", "size", "share", (t) => `${1 + Math.round(t * 4)}/3`, [
    ["case A", 42.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 6.0], [2, 2.0]]),
  10181: spec("fraction", "Integration by Parts parts", "part", "size", "share", (t) => `${1 + Math.round(t * 5)}/4`, [
    ["case A", 56.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 56.0], [1, 7.0], [2, 2.0]]),
  10182: spec("fraction", "Integration by Partial Fractions parts", "part", "size", "share", (t) => `${1 + Math.round(t * 6)}/5`, [
    ["case A", 18.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 2.0], [2, 2.0]]),
  10183: spec("line", "Definite Integral Properties graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 15.0, "#268ff1"], ["case B", 30.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 15.0], [1, 30.0], [2, 2.0]]),
  10184: spec("line", "Area Under a Curve graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 12.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 4.0], [2, 3.0]]),
  10185: spec("line", "Area Between Curves graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 20.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 5.0], [2, 4.0]]),
  10186: spec("bars", "Formation of Differential Equations comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 16)), [
    ["case A", 5.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 6.0], [2, 5.0]]),
  10187: spec("bars", "Order and Degree comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 20)), [
    ["case A", 6.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 7.0], [2, 6.0]]),
  10188: spec("bars", "Variable-Separable Equations comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 24)), [
    ["case A", 7.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 2.0], [2, 7.0]]),
  10189: spec("bars", "Homogeneous First-Order Equations comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 28)), [
    ["case A", 8.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 3.0], [2, 8.0]]),
  10190: spec("bars", "Linear First-Order Equations comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 12)), [
    ["case A", 9.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 4.0], [2, 9.0]]),
  10191: spec("bars", "General and Particular Solutions comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 16)), [
    ["case A", 10.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 5.0], [2, 10.0]]),
  10192: spec("bars", "Direction Fields comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 20)), [
    ["case A", 3.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 6.0], [2, 3.0]]),
  10193: spec("bars", "Minors and Cofactors comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 24)), [
    ["case A", 20.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 7.0], [2, 2.0]]),
  10194: spec("line", "Adjoint of a Matrix graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 30.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 2.0], [2, 2.0]]),
  10195: spec("bars", "Inverse by Adjoint comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 12)), [
    ["case A", 42.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 3.0], [2, 2.0]]),
  10196: spec("bars", "Determinants and Geometric Area comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 16)), [
    ["case A", 28.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 4.0], [2, 7.0]]),
  10197: spec("bars", "Solving Linear Equations by Matrices comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 20)), [
    ["case A", 72.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 72.0], [1, 5.0], [2, 2.0]]),
  10198: spec("bars", "Cramer's Rule comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 24)), [
    ["case A", 9.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 6.0], [2, 2.0]]),
  10199: spec("bars", "Consistency of Linear Systems comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 28)), [
    ["case A", 40.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 40.0], [1, 7.0], [2, 2.0]]),
  10200: spec("bars", "Formulating Linear Programming Problems comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 12)), [
    ["case A", 7.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 2.0], [2, 2.0]]),
  10201: spec("bars", "Feasible Region comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 16)), [
    ["case A", 10.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 2.0], [2, 2.0]]),
  10202: spec("bars", "Corner-Point Method comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 20)), [
    ["case A", 13.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 13.0], [1, 2.0], [2, 2.0]]),
  10203: spec("bars", "Bounded Feasible Region comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 24)), [
    ["case A", 16.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 2.0], [2, 2.0]]),
  10204: spec("bars", "Unbounded Feasible Region comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 28)), [
    ["case A", 19.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 19.0], [1, 2.0], [2, 2.0]]),
  10205: spec("bars", "Multiple Optimal Solutions comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 12)), [
    ["case A", 22.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 22.0], [1, 2.0], [2, 2.0]]),
  10206: spec("bars", "Infeasible Problems comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 16)), [
    ["case A", 13.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 13.0], [1, 2.0], [2, 2.0]]),
  10207: spec("bars", "Diet Problem comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 20)), [
    ["case A", 16.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 2.0], [2, 2.0]]),
  10208: spec("bars", "Production Planning Problem comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 24)), [
    ["case A", 11.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 11.0], [1, 2.0], [2, 2.0]]),
  10209: spec("bars", "Transportation-Style LPP Introduction comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 28)), [
    ["case A", 14.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 2.0], [2, 2.0]]),
  10210: spec("bars", "Conditional Probability comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 12)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 1.4]]),
  10211: spec("bars", "Multiplication Rule comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 16)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 1.4]]),
  10212: spec("bars", "Independent Events comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 20)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 1.4]]),
  10213: spec("bars", "Total Probability Theorem comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 24)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 1.4]]),
  10214: spec("bars", "Bayes' Theorem comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 28)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 1.4]]),
  10215: spec("bars", "Random Variables comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 12)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 1.4]]),
  10216: spec("bars", "Probability Distribution of a Random Variable comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 16)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 1.4]]),
  10217: spec("bars", "Expected Value comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 20)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 1.4]]),
  10218: spec("bars", "Variance comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 24)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 1.4]]),
  10219: spec("bars", "Bernoulli Trials comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 28)), [
    ["case A", 3.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 10.0], [2, 2.0]]),
  10220: spec("bars", "Binomial Distribution comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 12)), [
    ["case A", 3.5, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 3.5], [1, 10.0], [2, 2.0]]),
};
