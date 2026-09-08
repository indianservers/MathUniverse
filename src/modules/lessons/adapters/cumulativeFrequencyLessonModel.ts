export const cumulativeDefault = [
  { upper: 139.5, frequency: 2 },
  { upper: 149.5, frequency: 5 },
  { upper: 159.5, frequency: 9 },
  { upper: 169.5, frequency: 11 },
  { upper: 179.5, frequency: 7 },
  { upper: 189.5, frequency: 4 },
  { upper: 199.5, frequency: 2 },
];
export function cumulativeValues(rows = cumulativeDefault) {
  let total = 0;
  return rows.map((row) => {
    total += row.frequency;
    return total;
  });
}
export function percentile(rows = cumulativeDefault, p: number) {
  const cumulative = cumulativeValues(rows),
    target = rows.reduce((sum, row) => sum + row.frequency, 0) * p;
  const index = cumulative.findIndex((value) => value >= target);
  if (index < 0) return null;
  const previous = index ? cumulative[index - 1] : 0;
  const width = 10;
  const lower = rows[index].upper - width;
  return lower + ((target - previous) / rows[index].frequency) * width;
}
