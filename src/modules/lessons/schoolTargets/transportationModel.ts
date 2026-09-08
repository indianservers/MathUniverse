export type Shipments = [number, number, number, number];
export const SHIPMENT_COSTS = [4, 6, 5, 3] as const;
export const SHIPMENT_ROUTES = ["F1 → W1", "F1 → W2", "F2 → W1", "F2 → W2"] as const;
export const INITIAL_SHIPMENTS: Shipments = [25, 5, 0, 20];
export function transportationModel(values: Shipments) {
  const rows = [values[0] + values[1], values[2] + values[3]];
  const columns = [values[0] + values[2], values[1] + values[3]];
  const rowValid = rows.map((value, i) => Math.abs(value - [30, 20][i]) < 1e-8);
  const columnValid = columns.map(value => Math.abs(value - 25) < 1e-8);
  const nonnegative = values.every(value => Number.isFinite(value) && value >= 0);
  const costs = values.map((value, i) => value * SHIPMENT_COSTS[i]);
  return { rows, columns, rowValid, columnValid, nonnegative, costs, total: rows[0] + rows[1],
    cost: costs.reduce((sum, cost) => sum + cost, 0), feasible: nonnegative && rowValid.every(Boolean) && columnValid.every(Boolean) };
}
export function transportationFamily(t: number): Shipments {
  if (!Number.isFinite(t) || t < 5 || t > 25) throw new RangeError("Feasible t must be between 5 and 25");
  return [t, 30 - t, 25 - t, t - 5];
}
export function shipmentQuantity(value: number) {
  if (!Number.isFinite(value)) throw new RangeError("Shipment must be finite");
  return Math.max(0, Math.min(50, Math.round(value)));
}
