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

export const batch5StudySpecs: Record<number, StudySpec> = {
  531: spec("number-line", "F Distribution values", "index", "value", "live", (t) => String(8 + Math.round(t * 8)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 4.0]]),
  532: spec("number-line", "Exponential Distribution values", "index", "value", "live", (t) => String(2 + Math.round(t * 9)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 5.0]]),
  533: spec("number-line", "Gamma Distribution values", "index", "value", "live", (t) => String(3 + Math.round(t * 10)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 6.0]]),
  534: spec("number-line", "Weibull Distribution values", "index", "value", "live", (t) => String(4 + Math.round(t * 11)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 7.0]]),
  535: spec("number-line", "Standardisation values", "index", "value", "live", (t) => String(5 + Math.round(t * 7)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 1.4]]),
  536: spec("number-line", "Distribution Simulation values", "index", "value", "live", (t) => String(6 + Math.round(t * 8)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 9.0]]),
  537: spec("number-line", "Sampling Distributions values", "index", "value", "live", (t) => String(7 + Math.round(t * 9)), [
    ["case A", 5.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 9.0], [2, 10.0]]),
  538: spec("number-line", "Central Limit Theorem values", "index", "value", "live", (t) => String(8 + Math.round(t * 10)), [
    ["case A", 6.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 10.0], [2, 11.0]]),
  539: spec("number-line", "Confidence Interval for Mean values", "index", "value", "live", (t) => String(2 + Math.round(t * 11)), [
    ["case A", 13.0, "#268ff1"], ["case B", 14.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 13.0], [1, 14.0], [2, 12.0]]),
  540: spec("number-line", "Confidence Interval for Proportion values", "index", "value", "live", (t) => String(3 + Math.round(t * 7)), [
    ["case A", 9.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 4.0], [2, 4.0]]),
  541: spec("number-line", "Difference of Means Interval values", "index", "value", "live", (t) => String(4 + Math.round(t * 8)), [
    ["case A", 6.5, "#268ff1"], ["case B", 0.75, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 6.5], [1, 0.75], [2, 5.0]]),
  542: spec("number-line", "Difference of Proportions Interval values", "index", "value", "live", (t) => String(5 + Math.round(t * 9)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 6.0]]),
  543: spec("number-line", "One-Sample z-Test values", "index", "value", "live", (t) => String(6 + Math.round(t * 10)), [
    ["case A", 10.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 2.0], [2, 7.0]]),
  544: spec("number-line", "One-Sample t-Test values", "index", "value", "live", (t) => String(7 + Math.round(t * 11)), [
    ["case A", 3.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 2.0], [2, 8.0]]),
  545: spec("number-line", "Two-Sample t-Test values", "index", "value", "live", (t) => String(8 + Math.round(t * 7)), [
    ["case A", 4.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 2.0], [2, 9.0]]),
  546: spec("number-line", "Paired t-Test values", "index", "value", "live", (t) => String(2 + Math.round(t * 8)), [
    ["case A", 5.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 2.0], [2, 10.0]]),
  547: spec("number-line", "One-Proportion Test values", "index", "value", "live", (t) => String(3 + Math.round(t * 9)), [
    ["case A", 6.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 2.0], [2, 11.0]]),
  548: spec("number-line", "Two-Proportion Test values", "index", "value", "live", (t) => String(4 + Math.round(t * 10)), [
    ["case A", 7.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 2.0], [2, 12.0]]),
  549: spec("number-line", "Chi-Square Goodness-of-Fit values", "index", "value", "live", (t) => String(5 + Math.round(t * 11)), [
    ["case A", 8.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 2.0], [2, 4.0]]),
  550: spec("number-line", "Chi-Square Independence values", "index", "value", "live", (t) => String(6 + Math.round(t * 7)), [
    ["case A", 9.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 2.0], [2, 5.0]]),
  551: spec("number-line", "Variance Tests values", "index", "value", "live", (t) => String(7 + Math.round(t * 8)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 6.0]]),
  552: spec("number-line", "ANOVA values", "index", "value", "live", (t) => String(8 + Math.round(t * 9)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 7.0]]),
  553: spec("number-line", "p-Value Visualiser values", "index", "value", "live", (t) => String(2 + Math.round(t * 10)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 8.0]]),
  554: spec("number-line", "Type I and Type II Errors values", "index", "value", "live", (t) => String(3 + Math.round(t * 11)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 9.0]]),
  555: spec("number-line", "Power of a Test values", "index", "value", "live", (t) => String(4 + Math.round(t * 7)), [
    ["case A", 1.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 5.0], [2, 5.0]]),
  556: spec("number-line", "Fundamental Counting Principle values", "index", "value", "live", (t) => String(5 + Math.round(t * 8)), [
    ["case A", 42.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 6.0], [2, 11.0]]),
  557: spec("line", "Factorials graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 8.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 7.0], [2, 8.0]]),
  558: spec("line", "Permutations graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 18.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 2.0], [2, 4.0]]),
  559: spec("line", "Permutations with Repetition graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 30.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 3.0], [2, 5.0]]),
  560: spec("line", "Circular Permutations graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 12.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 4.0], [2, 6.0]]),
  561: spec("line", "Combinations graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 20.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 5.0], [2, 7.0]]),
  562: spec("circle", "Pascal's Triangle turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=4`, [
    ["case A", 1.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 9.0], [2, 11.0]]),
  563: spec("line", "Inclusion–Exclusion graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 42.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 7.0], [2, 9.0]]),
  564: spec("line", "Pigeonhole Principle graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 13.0, "#268ff1"], ["case B", 14.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 13.0], [1, 14.0], [2, 2.0]]),
  565: spec("line", "Vertex and Edge Builder graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 24.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 24.0], [1, 3.0], [2, 11.0]]),
  566: spec("line", "Directed Graphs graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 36.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 36.0], [1, 4.0], [2, 12.0]]),
  567: spec("line", "Weighted Graphs graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 50.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 50.0], [1, 5.0], [2, 4.0]]),
  568: spec("line", "Degree of a Vertex graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 18.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 6.0], [2, 5.0]]),
  569: spec("line", "Paths and Cycles graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 28.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 7.0], [2, 6.0]]),
  570: spec("line", "Connected Components graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 10.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 2.0], [2, 7.0]]),
  571: spec("line", "Euler Paths and Circuits graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 18.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 3.0], [2, 8.0]]),
  572: spec("line", "Hamiltonian Paths and Cycles graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 28.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 4.0], [2, 9.0]]),
  573: spec("line", "Trees graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 40.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 40.0], [1, 5.0], [2, 10.0]]),
  574: spec("line", "Minimum Spanning Tree graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 54.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 54.0], [1, 6.0], [2, 11.0]]),
  575: spec("line", "Shortest Path graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 70.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 70.0], [1, 7.0], [2, 12.0]]),
  576: spec("line", "Graph Colouring graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 3.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 6.0], [2, 2.0]]),
  577: spec("line", "Bipartite Graphs graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 12.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 3.0], [2, 5.0]]),
  578: spec("line", "Planar Graphs graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 20.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 4.0], [2, 6.0]]),
  579: spec("line", "Network Flow graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 30.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 5.0], [2, 7.0]]),
  580: spec("line", "Travelling Salesperson graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 42.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 6.0], [2, 8.0]]),
  581: spec("line", "Adjacency Matrix graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 32.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 32.0], [1, 7.0], [2, 9.0]]),
  582: spec("line", "Set Builder graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 18.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 18.0], [2, 2.0]]),
  583: spec("line", "Union, Intersection and Difference graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 30.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 30.0], [2, 3.0]]),
  584: spec("line", "Complement graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 12.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 4.0], [2, 12.0]]),
  585: spec("line", "Cartesian Product graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 20.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 5.0], [2, 4.0]]),
  586: spec("line", "Subsets and Power Sets graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 30.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 6.0], [2, 5.0]]),
  587: spec("line", "Truth Tables graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 42.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 7.0], [2, 6.0]]),
  588: spec("line", "Logical Connectives graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 14.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 2.0], [2, 7.0]]),
  589: spec("line", "Quantifiers graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 24.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 24.0], [2, 3.0]]),
  590: spec("line", "Proof Methods graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 4.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 0.0], [2, 9.0]]),
  591: spec("number-line", "Simple Interest values", "index", "value", "live", (t) => String(5 + Math.round(t * 8)), [
    ["case A", 90.0, "#268ff1"], ["case B", 50.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 90.0], [1, 50.0], [2, 5.0]]),
  592: spec("number-line", "Compound Interest values", "index", "value", "live", (t) => String(6 + Math.round(t * 9)), [
    ["case A", 18.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 6.0], [2, 11.0]]),
  593: spec("number-line", "Effective Interest Rate values", "index", "value", "live", (t) => String(7 + Math.round(t * 10)), [
    ["case A", 28.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 7.0], [2, 12.0]]),
  594: spec("number-line", "Present Value values", "index", "value", "live", (t) => String(8 + Math.round(t * 11)), [
    ["case A", 10.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 2.0], [2, 4.0]]),
  595: spec("number-line", "Future Value values", "index", "value", "live", (t) => String(2 + Math.round(t * 7)), [
    ["case A", 18.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 3.0], [2, 5.0]]),
  596: spec("number-line", "Annuities values", "index", "value", "live", (t) => String(3 + Math.round(t * 8)), [
    ["case A", 28.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 4.0], [2, 6.0]]),
  597: spec("number-line", "Loans and EMIs values", "index", "value", "live", (t) => String(4 + Math.round(t * 9)), [
    ["case A", 40.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 40.0], [1, 5.0], [2, 7.0]]),
  598: spec("number-line", "Amortisation Table values", "index", "value", "live", (t) => String(5 + Math.round(t * 10)), [
    ["case A", 54.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 54.0], [1, 6.0], [2, 8.0]]),
  599: spec("number-line", "Depreciation values", "index", "value", "live", (t) => String(6 + Math.round(t * 11)), [
    ["case A", 70.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 70.0], [1, 7.0], [2, 9.0]]),
  600: spec("number-line", "Inflation values", "index", "value", "live", (t) => String(7 + Math.round(t * 7)), [
    ["case A", 6.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 2.0], [2, 10.0]]),
  601: spec("number-line", "Currency Conversion values", "index", "value", "live", (t) => String(8 + Math.round(t * 8)), [
    ["case A", 12.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 3.0], [2, 11.0]]),
  602: spec("number-line", "Profit, Loss, Markup and Margin values", "index", "value", "live", (t) => String(2 + Math.round(t * 9)), [
    ["case A", 20.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 4.0], [2, 12.0]]),
  603: spec("number-line", "Break-Even Analysis values", "index", "value", "live", (t) => String(3 + Math.round(t * 10)), [
    ["case A", 30.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 5.0], [2, 4.0]]),
  604: spec("number-line", "Tax and Discounts values", "index", "value", "live", (t) => String(4 + Math.round(t * 11)), [
    ["case A", 42.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 6.0], [2, 5.0]]),
  605: spec("number-line", "Investment Comparison values", "index", "value", "live", (t) => String(5 + Math.round(t * 7)), [
    ["case A", 56.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 56.0], [1, 7.0], [2, 6.0]]),
  606: spec("number-line", "Model Builder values", "index", "value", "live", (t) => String(6 + Math.round(t * 8)), [
    ["case A", 18.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 2.0], [2, 7.0]]),
  607: spec("number-line", "Linear Models values", "index", "value", "live", (t) => String(7 + Math.round(t * 9)), [
    ["case A", 30.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 3.0], [2, 8.0]]),
  608: spec("number-line", "Quadratic Models values", "index", "value", "live", (t) => String(8 + Math.round(t * 10)), [
    ["case A", 12.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 4.0], [2, 9.0]]),
  609: spec("number-line", "Exponential and Logistic Models values", "index", "value", "live", (t) => String(2 + Math.round(t * 11)), [
    ["case A", 20.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 5.0], [2, 10.0]]),
  610: spec("number-line", "Periodic Models values", "index", "value", "live", (t) => String(3 + Math.round(t * 7)), [
    ["case A", 30.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 6.0], [2, 11.0]]),
  611: spec("number-line", "Piecewise Models values", "index", "value", "live", (t) => String(4 + Math.round(t * 8)), [
    ["case A", 42.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 7.0], [2, 12.0]]),
  612: spec("number-line", "Parameter Estimation values", "index", "value", "live", (t) => String(5 + Math.round(t * 9)), [
    ["case A", 14.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 2.0], [2, 4.0]]),
  613: spec("number-line", "Dimensional Analysis values", "index", "value", "live", (t) => String(6 + Math.round(t * 10)), [
    ["case A", 24.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 24.0], [1, 3.0], [2, 5.0]]),
  614: spec("number-line", "Sensitivity Analysis values", "index", "value", "live", (t) => String(7 + Math.round(t * 11)), [
    ["case A", 36.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 36.0], [1, 4.0], [2, 6.0]]),
  615: spec("number-line", "Residual and Error Analysis values", "index", "value", "live", (t) => String(8 + Math.round(t * 7)), [
    ["case A", 5.0, "#268ff1"], ["case B", 60.0, "#23b56e"], ["case C", 0.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 60.0], [2, 0.0]]),
  616: spec("number-line", "Scenario Comparison values", "index", "value", "live", (t) => String(2 + Math.round(t * 8)), [
    ["case A", 18.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 6.0], [2, 8.0]]),
  617: spec("number-line", "Linear Programming values", "index", "value", "live", (t) => String(3 + Math.round(t * 9)), [
    ["case A", 28.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 7.0], [2, 9.0]]),
  618: spec("bars", "Slider Component comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 24)), [
    ["case A", 2.0, "#268ff1"], ["case B", 25.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 25.0], [2, 10.0]]),
  619: spec("bars", "Checkbox comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 28)), [
    ["case A", 2.0, "#268ff1"], ["case B", 20.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 20.0], [2, 11.0]]),
  620: spec("bars", "Button comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 12)), [
    ["case A", 17.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 17.0], [1, 11.0], [2, 12.0]]),
  621: spec("bars", "Input Box comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 16)), [
    ["case A", 16.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 3.0], [2, 4.0]]),
  622: spec("bars", "Drop-Down List comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 20)), [
    ["case A", 15.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 15.0], [1, 4.0], [2, 5.0]]),
  623: spec("bars", "Dynamic Text comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 24)), [
    ["case A", 14.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 5.0], [2, 6.0]]),
  624: spec("bars", "Formula Display comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 28)), [
    ["case A", 15.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 15.0], [1, 6.0], [2, 7.0]]),
  625: spec("bars", "Image Object comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 12)), [
    ["case A", 13.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 13.0], [1, 7.0], [2, 8.0]]),
  626: spec("bars", "Audio and Video comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 16)), [
    ["case A", 12.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 8.0], [2, 9.0]]),
  627: spec("bars", "Pen and Highlighter comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 20)), [
    ["case A", 12.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 9.0], [2, 10.0]]),
  628: spec("bars", "Tables comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 24)), [
    ["case A", 11.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 11.0], [1, 10.0], [2, 11.0]]),
  629: spec("bars", "Multiple Pages comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 28)), [
    ["case A", 11.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 11.0], [1, 11.0], [2, 12.0]]),
  630: spec("bars", "Reset Construction comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 12)), [
    ["case A", 45.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 45.0], [1, 3.0], [2, 4.0]]),
  631: spec("bars", "Undo and Redo comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 16)), [
    ["case A", 33.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 33.0], [1, 4.0], [2, 5.0]]),
  632: spec("bars", "Object Locking comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 20)), [
    ["case A", 7.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 5.0], [2, 6.0]]),
  633: spec("bars", "Conditional Feedback comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 24)), [
    ["case A", 8.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 6.0], [2, 7.0]]),
  634: spec("bars", "Custom Tool Builder comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 28)), [
    ["case A", 8.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 7.0], [2, 8.0]]),
  635: spec("bars", "Command Library comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 12)), [
    ["case A", 8.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 8.0], [2, 9.0]]),
  636: spec("bars", "Object Scripting comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 16)), [
    ["case A", 35.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 35.0], [1, 9.0], [2, 10.0]]),
  637: spec("bars", "Randomisation comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 20)), [
    ["case A", 26.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 26.0], [1, 10.0], [2, 11.0]]),
  638: spec("bars", "Automatic Checking comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 24)), [
    ["case A", 22.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 22.0], [1, 11.0], [2, 12.0]]),
  639: spec("bars", "Import and Export comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 28)), [
    ["case A", 20.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 3.0], [2, 4.0]]),
  640: spec("bars", "Concept Introduction comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 12)), [
    ["case A", 5.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 4.0], [2, 5.0]]),
  641: spec("bars", "Visualise comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 16)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 6.0]]),
  642: spec("bars", "Manipulative Laboratory comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 20)), [
    ["case A", 25.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 25.0], [1, 6.0], [2, 7.0]]),
  643: spec("fraction", "Guided Exploration parts", "part", "size", "share", (t) => `${1 + Math.round(t * 8)}/6`, [
    ["case A", 20.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 7.0], [2, 8.0]]),
  644: spec("bars", "Predict–Test–Explain comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 28)), [
    ["case A", 17.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 17.0], [1, 8.0], [2, 9.0]]),
  645: spec("bars", "Worked Example comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 12)), [
    ["case A", 16.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 9.0], [2, 10.0]]),
  646: spec("bars", "Step-by-Step Practice comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 16)), [
    ["case A", 15.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 15.0], [1, 10.0], [2, 11.0]]),
  647: spec("bars", "Construction Challenge comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 20)), [
    ["case A", 14.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 11.0], [2, 12.0]]),
  648: spec("line", "Graph Matching graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 15.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 15.0], [1, 3.0], [2, 4.0]]),
  649: spec("bars", "Error Diagnosis comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 28)), [
    ["case A", 13.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 13.0], [1, 4.0], [2, 5.0]]),
  650: spec("bars", "Multiple Representations comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 12)), [
    ["case A", 12.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 5.0], [2, 6.0]]),
  651: spec("bars", "Real-World Application comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 16)), [
    ["case A", 12.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 6.0], [2, 7.0]]),
  652: spec("bars", "Open Investigation comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 20)), [
    ["case A", 11.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 11.0], [1, 7.0], [2, 8.0]]),
  653: spec("bars", "Dynamic Question Generator comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 24)), [
    ["case A", 11.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 11.0], [1, 8.0], [2, 9.0]]),
  654: spec("bars", "Mastery Challenge comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 28)), [
    ["case A", 45.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 45.0], [1, 9.0], [2, 10.0]]),
  655: spec("bars", "Exit Ticket comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 12)), [
    ["case A", 33.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 33.0], [1, 10.0], [2, 11.0]]),
  656: spec("bars", "Revision Summary comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 16)), [
    ["case A", 7.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 11.0], [2, 12.0]]),
  657: spec("bars", "Drag and Manipulate comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 20)), [
    ["case A", 8.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 3.0], [2, 4.0]]),
  658: spec("bars", "Zoom and Pan comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 24)), [
    ["case A", 8.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 4.0], [2, 5.0]]),
  659: spec("bars", "Reset View comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 28)), [
    ["case A", 8.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 5.0], [2, 6.0]]),
  660: spec("bars", "Undo and Redo comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 12)), [
    ["case A", 35.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 35.0], [1, 6.0], [2, 7.0]]),
  661: spec("bars", "Animation Player comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 16)), [
    ["case A", 26.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 26.0], [1, 7.0], [2, 8.0]]),
  662: spec("bars", "Snap Controls comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 20)), [
    ["case A", 22.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 22.0], [1, 8.0], [2, 9.0]]),
  663: spec("bars", "Trace and Locus comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 24)), [
    ["case A", 20.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 9.0], [2, 10.0]]),
  664: spec("bars", "Exact and Decimal Output comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 28)), [
    ["case A", 5.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 10.0], [2, 11.0]]),
  665: spec("bars", "Linked Views comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 12)), [
    ["case A", 5.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 11.0], [2, 12.0]]),
  666: spec("bars", "Save, Duplicate and Share comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 16)), [
    ["case A", 25.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 25.0], [1, 3.0], [2, 4.0]]),
  667: spec("bars", "Export comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 20)), [
    ["case A", 20.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 4.0], [2, 5.0]]),
  668: spec("number-line", "Teacher Presentation Mode values", "index", "value", "live", (t) => String(5 + Math.round(t * 10)), [
    ["case A", 17.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 17.0], [1, 5.0], [2, 6.0]]),
  669: spec("number-line", "Learner Practice Mode values", "index", "value", "live", (t) => String(6 + Math.round(t * 11)), [
    ["case A", 16.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 6.0], [2, 7.0]]),
  670: spec("number-line", "Exam Mode values", "index", "value", "live", (t) => String(7 + Math.round(t * 7)), [
    ["case A", 15.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 15.0], [1, 7.0], [2, 8.0]]),
  671: spec("bars", "Keyboard Navigation comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 16)), [
    ["case A", 14.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 8.0], [2, 9.0]]),
  672: spec("bars", "Screen Reader Support comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 20)), [
    ["case A", 15.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 15.0], [1, 9.0], [2, 10.0]]),
  673: spec("bars", "High Contrast and Large Text comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 24)), [
    ["case A", 13.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 13.0], [1, 10.0], [2, 11.0]]),
  674: spec("bars", "Multi-Language Terminology comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 28)), [
    ["case A", 12.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 11.0], [2, 12.0]]),
  10001: spec("number-line", "Place Value Explorer values", "index", "value", "live", (t) => String(7 + Math.round(t * 8)), [
    ["case A", 70.0, "#268ff1"], ["case B", 479.1, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 70.0], [1, 479.1], [2, 4.0]]),
  10002: spec("number-line", "Indian and International Number Naming Systems values", "index", "value", "live", (t) => String(8 + Math.round(t * 9)), [
    ["case A", 10.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 2.0], [2, 7.0]]),
  10003: spec("number-line", "Estimation and Rounding Lab values", "index", "value", "live", (t) => String(2 + Math.round(t * 10)), [
    ["case A", 18.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 3.0], [2, 8.0]]),
  10004: spec("number-line", "Approximation and Error Bounds values", "index", "value", "live", (t) => String(3 + Math.round(t * 11)), [
    ["case A", 28.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 4.0], [2, 9.0]]),
  10005: spec("number-line", "Mixed Units and Unit Conversion values", "index", "value", "live", (t) => String(4 + Math.round(t * 7)), [
    ["case A", 40.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 40.0], [1, 5.0], [2, 10.0]]),
  10006: spec("number-line", "Pictograph Builder values", "index", "value", "live", (t) => String(5 + Math.round(t * 8)), [
    ["case A", 54.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 54.0], [1, 6.0], [2, 11.0]]),
  10007: spec("number-line", "Bar Graph Builder values", "index", "value", "live", (t) => String(6 + Math.round(t * 9)), [
    ["case A", 70.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 70.0], [1, 7.0], [2, 12.0]]),
  10008: spec("number-line", "Survey to Frequency Table values", "index", "value", "live", (t) => String(7 + Math.round(t * 10)), [
    ["case A", 6.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 2.0], [2, 4.0]]),
  10009: spec("number-line", "Misleading Graph Detection values", "index", "value", "live", (t) => String(8 + Math.round(t * 11)), [
    ["case A", 12.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 3.0], [2, 5.0]]),
  10010: spec("number-line", "Number Pattern Completion values", "index", "value", "live", (t) => String(2 + Math.round(t * 7)), [
    ["case A", 20.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 4.0], [2, 6.0]]),
  10011: spec("bars", "Shape Pattern Completion comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 16)), [
    ["case A", 30.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 5.0], [2, 7.0]]),
  10012: spec("bars", "Input-Output Rule Machines comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 20)), [
    ["case A", 42.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 6.0], [2, 8.0]]),
  10013: spec("number-line", "Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 values", "index", "value", "live", (t) => String(5 + Math.round(t * 10)), [
    ["case A", 56.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 56.0], [1, 7.0], [2, 2.0]]),
  10014: spec("number-line", "Digital Root and Divisibility values", "index", "value", "live", (t) => String(6 + Math.round(t * 11)), [
    ["case A", 18.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 2.0], [2, 10.0]]),
  10015: spec("number-line", "Remainder Reasoning values", "index", "value", "live", (t) => String(7 + Math.round(t * 7)), [
    ["case A", 30.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 3.0], [2, 11.0]]),
  10016: spec("number-line", "Unit Rate Table Lab values", "index", "value", "live", (t) => String(8 + Math.round(t * 8)), [
    ["case A", 12.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 4.0], [2, 12.0]]),
  10017: spec("fraction", "Ratio Tables parts", "part", "size", "share", (t) => `${1 + Math.round(t * 2)}/5`, [
    ["case A", 20.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 5.0], [2, 4.0]]),
  10018: spec("number-line", "Bills, Discounts and Tax values", "index", "value", "live", (t) => String(3 + Math.round(t * 10)), [
    ["case A", 30.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 6.0], [2, 5.0]]),
  10019: spec("bars", "Profit, Loss and Marked Price comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 28)), [
    ["case A", 42.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 7.0], [2, 6.0]]),
  10020: spec("bars", "Household Budget Arithmetic comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 12)), [
    ["case A", 14.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 2.0], [2, 7.0]]),
  10021: spec("bars", "Scale Factor in Maps and Recipes comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 16)), [
    ["case A", 8.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 3.0], [2, 8.0]]),
  10022: spec("bars", "Copying a Line Segment comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 20)), [
    ["case A", 36.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 36.0], [1, 4.0], [2, 9.0]]),
  10023: spec("circle", "Copying an Angle turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=8`, [
    ["case A", 9.0, "#268ff1"], ["case B", 15.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 15.0], [2, 10.0]]),
  10024: spec("bars", "Perpendicular Bisector Construction comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 28)), [
    ["case A", 18.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 6.0], [2, 11.0]]),
  10025: spec("circle", "Angle Bisector Construction turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=3`, [
    ["case A", 9.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 11.0], [2, 12.0]]),
  10026: spec("bars", "Perpendicular Through a Point comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 16)), [
    ["case A", 10.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 2.0], [2, 4.0]]),
  10027: spec("bars", "Parallel Line Construction comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 20)), [
    ["case A", 18.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 3.0], [2, 5.0]]),
  10028: spec("circle", "Triangle Construction by SSS turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=6`, [
    ["case A", 9.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 11.0], [2, 6.0]]),
  10029: spec("circle", "Triangle Construction by SAS turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=7`, [
    ["case A", 9.0, "#268ff1"], ["case B", 13.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 13.0], [2, 7.0]]),
  10030: spec("circle", "Triangle Construction by ASA turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=8`, [
    ["case A", 9.0, "#268ff1"], ["case B", 15.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 15.0], [2, 8.0]]),
  10031: spec("circle", "Right Triangle Construction by RHS turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=2`, [
    ["case A", 9.0, "#268ff1"], ["case B", 17.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 17.0], [2, 9.0]]),
  10032: spec("number-line", "Double Bar Graph Comparison values", "index", "value", "live", (t) => String(3 + Math.round(t * 9)), [
    ["case A", 6.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 2.0], [2, 10.0]]),
  10033: spec("number-line", "Mean Median and Mode Practice Path values", "index", "value", "live", (t) => String(4 + Math.round(t * 10)), [
    ["case A", 4.5, "#268ff1"], ["case B", 0.75, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 4.5], [1, 0.75], [2, 11.0]]),
  10034: spec("number-line", "Range and Spread Explorer values", "index", "value", "live", (t) => String(5 + Math.round(t * 11)), [
    ["case A", 20.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 4.0], [2, 12.0]]),
  10035: spec("bars", "Flowchart Logic comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 12)), [
    ["case A", 30.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 5.0], [2, 4.0]]),
  10036: spec("bars", "Pattern Encoding comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 16)), [
    ["case A", 42.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 6.0], [2, 5.0]]),
  10037: spec("bars", "Magic Squares comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 20)), [
    ["case A", 56.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 56.0], [1, 7.0], [2, 6.0]]),
  10038: spec("bars", "Route Map Reasoning comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 24)), [
    ["case A", 18.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 2.0], [2, 7.0]]),
  10039: spec("bars", "Tabular Pattern Completion comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 28)), [
    ["case A", 30.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 3.0], [2, 8.0]]),
  10040: spec("fraction", "Decimal Expansion of Rational Numbers parts", "part", "size", "share", (t) => `${1 + Math.round(t * 4)}/3`, [
    ["case A", 12.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 4.0], [2, 9.0]]),
  10041: spec("number-line", "Terminating and Non-Terminating Decimals values", "index", "value", "live", (t) => String(5 + Math.round(t * 8)), [
    ["case A", 20.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 20.0], [1, 5.0], [2, 10.0]]),
  10042: spec("fraction", "Rational and Irrational Classification parts", "part", "size", "share", (t) => `${1 + Math.round(t * 6)}/5`, [
    ["case A", 30.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 6.0], [2, 11.0]]),
  10043: spec("number-line", "Successive Magnification on the Number Line values", "index", "value", "live", (t) => String(7 + Math.round(t * 10)), [
    ["case A", 42.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 7.0], [2, 12.0]]),
  10044: spec("fraction", "Rationalisation of Denominators parts", "part", "size", "share", (t) => `${1 + Math.round(t * 8)}/7`, [
    ["case A", 14.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 2.0], [2, 4.0]]),
  10045: spec("number-line", "nth Roots and Radical Meaning values", "index", "value", "live", (t) => String(2 + Math.round(t * 7)), [
    ["case A", 6.0, "#268ff1"], ["case B", 0.75, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 0.75], [2, 5.0]]),
  10046: spec("line", "Graphical Zeros of Polynomials graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 36.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 36.0], [1, 4.0], [2, 6.0]]),
  10047: spec("bars", "Polynomial Division comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 20)), [
    ["case A", 50.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 50.0], [1, 5.0], [2, 7.0]]),
  10048: spec("bars", "Remainder Theorem comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 24)), [
    ["case A", 18.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 6.0], [2, 8.0]]),
  10049: spec("bars", "Factor Theorem comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 28)), [
    ["case A", 4.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 7.0], [2, 4.0]]),
  10050: spec("bars", "Relationship Between Zeros and Coefficients comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 12)), [
    ["case A", 10.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 2.0], [2, 10.0]]),
  10051: spec("bars", "Cubic Algebraic Identities comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 16)), [
    ["case A", 18.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 3.0], [2, 11.0]]),
  10052: spec("bars", "Polynomial Factorisation Practice comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 20)), [
    ["case A", 7.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 4.0], [2, 7.0]]),
  10053: spec("bars", "Definitions Axioms and Postulates comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 24)), [
    ["case A", 40.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 40.0], [1, 5.0], [2, 4.0]]),
  10054: spec("bars", "Euclid's Five Postulates comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 28)), [
    ["case A", 54.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 54.0], [1, 6.0], [2, 5.0]]),
  10055: spec("bars", "Equivalent Forms of the Fifth Postulate comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 12)), [
    ["case A", 70.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 70.0], [1, 7.0], [2, 6.0]]),
  10056: spec("bars", "Axiom versus Theorem comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 16)), [
    ["case A", 6.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 2.0], [2, 7.0]]),
};
