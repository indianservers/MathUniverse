const misconceptionAlerts = [
  "sin^2 theta means (sin theta)^2, not sin(theta^2).",
  "tan theta is not a length on the circle; it is a ratio represented using the tangent line.",
  "At 90 degrees, cos theta = 0, so tan theta is undefined.",
  "sin theta and cos theta are coordinates on the unit circle.",
];

export default function MisconceptionAlerts() {
  return (
    <section
      className="rounded-xl border border-amber-200 bg-amber-50/90 p-4 shadow-sm dark:border-amber-300/25 dark:bg-amber-400/10"
      data-testid="misconception-alerts"
      aria-label="Common misconception alerts"
    >
      <p className="text-xs font-black uppercase tracking-wide text-amber-800 dark:text-amber-200">Misconception Alerts</p>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {misconceptionAlerts.map((alert) => (
          <div
            key={alert}
            className="rounded-lg border border-amber-200 bg-white/70 p-3 text-sm font-bold leading-6 text-amber-950 dark:border-amber-300/20 dark:bg-slate-950/45 dark:text-amber-50"
            data-testid="misconception-alert"
          >
            {alert}
          </div>
        ))}
      </div>
    </section>
  );
}

export { misconceptionAlerts };
