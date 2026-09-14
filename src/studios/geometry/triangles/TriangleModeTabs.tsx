import { useEffect } from "react";
import type { TriangleModeDef, TriangleModeId } from "./useTriangleLabMode";

function Icon({ id }: { id: TriangleModeId }) {
  if (id === "congruence") {
    return (
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <polygon points="4,22 10,6 16,22" strokeWidth="1.6" />
        <polygon points="12,22 18,8 24,22" strokeWidth="1.6" />
      </svg>
    );
  }
  if (id === "similarity") {
    return (
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <polygon points="5,22 10,10 15,22" strokeWidth="1.6" />
        <polygon points="13,22 20,6 27,22" strokeWidth="1.6" />
      </svg>
    );
  }
  if (id === "centers") {
    return (
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <polygon points="14,5 24,23 4,23" strokeWidth="1.6" />
        <line x1="14" y1="5" x2="14" y2="23" strokeWidth="1.2" />
        <line x1="4" y1="23" x2="19" y2="11" strokeWidth="1.2" />
        <circle cx="14" cy="16" r="1.8" fill="currentColor" />
      </svg>
    );
  }
  if (id === "inequalities") {
    return (
      <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <line x1="4" y1="8" x2="24" y2="8" strokeWidth="1.8" />
        <line x1="4" y1="14" x2="18" y2="14" strokeWidth="1.8" />
        <line x1="4" y1="20" x2="14" y2="20" strokeWidth="1.8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <polygon points="14,5 24,23 4,23" strokeWidth="1.7" />
      <circle cx="14" cy="5" r="1.6" fill="currentColor" />
      <circle cx="24" cy="23" r="1.6" fill="currentColor" />
      <circle cx="4" cy="23" r="1.6" fill="currentColor" />
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
      {modes.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          id={`tri-tab-${item.id}`}
          className={`tri-tab ${item.id === mode ? "active" : ""}`}
          aria-pressed={item.id === mode}
          aria-selected={item.id === mode}
          tabIndex={item.id === mode ? 0 : -1}
          title={`${item.label}: ${item.subtitle}. Shortcut ${modes.findIndex((entry) => entry.id === item.id) + 1}`}
          onClick={() => onChange(item.id)}
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
