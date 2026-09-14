import { useEffect } from "react";
import type { TriangleModeDef, TriangleModeId } from "./useTriangleLabMode";

function Icon({ id }: { id: TriangleModeId }) {
  if (id === "congruence") {
    return (
      <svg viewBox="0 0 46 46" fill="none" aria-hidden="true">
        <polygon points="6,36 16,10 26,36" strokeWidth="2" />
        <polygon points="20,36 30,12 40,36" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "similarity") {
    return (
      <svg viewBox="0 0 46 46" fill="none" aria-hidden="true">
        <polygon points="6,36 14,18 22,36" strokeWidth="2" />
        <polygon points="22,36 32,8 44,36" strokeWidth="2" />
      </svg>
    );
  }
  if (id === "centers") {
    return (
      <svg viewBox="0 0 46 46" fill="none" aria-hidden="true">
        <polygon points="23,6 40,38 6,38" strokeWidth="2" />
        <line x1="23" y1="6" x2="23" y2="38" strokeWidth="1.4" />
        <line x1="6" y1="38" x2="32" y2="16" strokeWidth="1.4" />
        <circle cx="23" cy="26" r="2.4" fill="currentColor" />
      </svg>
    );
  }
  if (id === "inequalities") {
    return (
      <svg viewBox="0 0 46 46" fill="none" aria-hidden="true">
        <line x1="6" y1="12" x2="40" y2="12" strokeWidth="2.2" />
        <line x1="6" y1="23" x2="30" y2="23" strokeWidth="2.2" />
        <line x1="6" y1="34" x2="22" y2="34" strokeWidth="2.2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 46 46" fill="none" aria-hidden="true">
      <polygon points="23,6 40,38 6,38" strokeWidth="2.2" />
      <circle cx="23" cy="6" r="2.4" fill="currentColor" />
      <circle cx="40" cy="38" r="2.4" fill="currentColor" />
      <circle cx="6" cy="38" r="2.4" fill="currentColor" />
    </svg>
  );
}

export default function TriangleModeTabs({
  modes, mode, onChange,
}: {
  modes: TriangleModeDef[];
  mode: TriangleModeId;
  onChange: (id: TriangleModeId) => void;
}) {
  useEffect(() => {
    document.getElementById(`tri-tab-${mode}`)?.scrollIntoView({ inline: "nearest", block: "nearest", behavior: "smooth" });
  }, [mode]);
  return (
    <nav className="tri-tabs" role="tablist" aria-label="Triangles Lab modes">
      {modes.map((item, index) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          id={`tri-tab-${item.id}`}
          className={`tri-tab ${item.id === mode ? "active" : ""}`}
          aria-pressed={item.id === mode}
          aria-selected={item.id === mode}
          tabIndex={item.id === mode ? 0 : -1}
          title={`${item.label}: ${item.subtitle}. Shortcut ${index + 1}`}
          onClick={() => onChange(item.id)}
          onKeyDown={(event) => {
            if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
            event.preventDefault();
            const i = modes.findIndex((m) => m.id === mode);
            const next = event.key === "ArrowRight" ? (i + 1) % modes.length : (i - 1 + modes.length) % modes.length;
            onChange(modes[next]!.id);
          }}
        >
          <Icon id={item.id} />
          <span>
            <b>{item.label}</b>
            <small>{item.subtitle}</small>
          </span>
        </button>
      ))}
    </nav>
  );
}
