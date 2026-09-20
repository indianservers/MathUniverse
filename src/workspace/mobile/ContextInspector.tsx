import type { ReactNode } from "react";

export default function ContextInspector({
  title,
  subtitle,
  values,
  actions,
}: {
  title: string;
  subtitle?: string;
  values?: Array<{ label: string; value: string }>;
  actions?: ReactNode;
}) {
  return (
    <div className="mws-inspector" data-mws-panel="inspector">
      <div className="mws-inspector-copy">
        <strong>{title}</strong>
        {subtitle ? <span>{subtitle}</span> : null}
        {values?.length ? (
          <dl>
            {values.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
      {actions ? <div className="mws-inspector-actions">{actions}</div> : null}
    </div>
  );
}
