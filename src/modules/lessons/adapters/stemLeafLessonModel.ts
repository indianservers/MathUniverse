export const stemLeafDefault = [23, 17, 32, 45, 28, 34, 12, 19, 27, 36, 41, 23, 18, 29, 37, 44, 31, 52, 26, 38];
export type StemRow = { stem: number; leaves: number[] };
export function stemLeafRows(values: number[], split = false): StemRow[] {
  const rows = new Map<number, number[]>();
  [...values].sort((a, b) => a - b).forEach(value => {
    const stem = Math.floor(value / 10) * 10;
    const key = split ? stem + (value % 10 >= 5 ? 5 : 0) : stem;
    rows.set(key, [...(rows.get(key) ?? []), value % 10]);
  });
  return [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([stem, leaves]) => ({ stem, leaves }));
}
export function reconstruct(rows: StemRow[]) { return rows.flatMap(row => row.leaves.map(leaf => Math.floor(row.stem / 10) * 10 + leaf)).sort((a, b) => a - b); }
export function median(values: number[]) { const data = [...values].sort((a, b) => a - b); if (!data.length) return null; const i = Math.floor(data.length / 2); return data.length % 2 ? data[i] : (data[i - 1] + data[i]) / 2; }
