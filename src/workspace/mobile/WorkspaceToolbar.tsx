import type { ReactNode } from "react";

export type WorkspaceToolbarItem = {
  id: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  pressed?: boolean;
  onSelect: () => void;
};

export default function WorkspaceToolbar({
  label,
  items,
}: {
  label: string;
  items: WorkspaceToolbarItem[];
}) {
  return (
    <nav className="mws-toolbar" aria-label={label} data-mws-toolbar="true">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={[
            item.active ? "is-active" : "",
            item.pressed ? "is-open" : "",
          ]
            .filter(Boolean)
            .join(" ") || undefined}
          aria-pressed={item.pressed ?? item.active ?? false}
          data-tool-state={
            item.active ? "mode" : item.pressed ? "open" : "idle"
          }
          onClick={item.onSelect}
        >
          <span className="mws-toolbar-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
