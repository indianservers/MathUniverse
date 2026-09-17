import { Link } from "react-router-dom";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { LiveRow, Panel, StatusOk } from "../../mockup/studioLabKit";
import { Phase1LabChrome } from "../../phase1/Phase1LabChrome";

const SHAPE: Record<string, { href: string; label: string; formula: string }> = {
  Cylinders: { href: "/shapes?shape=cylinder", label: "Cylinder", formula: "V = πr²h" },
  Cones: { href: "/shapes?shape=cone", label: "Cone", formula: "V = ⅓πr²h" },
  Spheres: { href: "/shapes?shape=sphere", label: "Sphere", formula: "V = ⁴⁄₃πr³" },
  Nets: { href: "/shapes?shape=cube", label: "Cube net", formula: "Unfold without overlap" },
  "Cross-sections": { href: "/shapes?shape=cylinder", label: "Cross-section", formula: "Plane ∩ solid" },
};

export default function SolidsStudioLab({ page }: { page: StudioMockupPage }) {
  return (
    <Phase1LabChrome page={page}>
      {(mode) => {
        const spec = SHAPE[mode] ?? SHAPE.Cylinders!;
        return (
          <>
            <Panel title={mode}>
              <p className="msk-note">Solid geometry is the Shapes Explorer so nets, volume, and cross-sections stay one 3D engine.</p>
              <Link className="msk-cta" to={spec.href}>Open {spec.label} in Shapes Explorer</Link>
            </Panel>
            <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
              <svg className="msk-graph" viewBox="0 0 360 200" role="img" aria-label={mode}>
                <rect width="360" height="200" fill="#f8fbff" />
                {mode === "Spheres" ? <circle cx="180" cy="110" r="64" fill="rgba(20,125,242,.16)" stroke="#147df2" /> : null}
                {mode === "Cylinders" ? <><ellipse cx="180" cy="64" rx="50" ry="18" fill="none" stroke="#147df2" /><line x1="130" y1="64" x2="130" y2="150" stroke="#147df2" /><line x1="230" y1="64" x2="230" y2="150" stroke="#147df2" /><ellipse cx="180" cy="150" rx="50" ry="18" fill="rgba(20,125,242,.12)" stroke="#147df2" /></> : null}
                {mode === "Cones" ? <><ellipse cx="180" cy="150" rx="60" ry="16" fill="rgba(139,69,244,.12)" stroke="#8b45f4" /><line x1="120" y1="150" x2="180" y2="48" stroke="#8b45f4" /><line x1="240" y1="150" x2="180" y2="48" stroke="#8b45f4" /></> : null}
                {mode === "Nets" ? <><rect x="80" y="70" width="50" height="50" fill="none" stroke="#147df2" /><rect x="130" y="70" width="50" height="50" fill="rgba(20,125,242,.16)" stroke="#147df2" /><rect x="180" y="70" width="50" height="50" fill="none" stroke="#147df2" /><rect x="130" y="20" width="50" height="50" fill="none" stroke="#147df2" /><rect x="130" y="120" width="50" height="50" fill="none" stroke="#147df2" /></> : null}
                {mode === "Cross-sections" ? <><ellipse cx="180" cy="110" rx="70" ry="50" fill="rgba(8,185,221,.12)" stroke="#08b9dd" /><line x1="90" y1="70" x2="270" y2="150" stroke="#f59e0b" /></> : null}
                <text x="24" y="28" fill="#334155" fontSize="13">{spec.formula}</text>
              </svg>
            </section>
            <aside className="msk-panel msk-live">
              <LiveRow color="#147df2" label="Opens" value={spec.href} />
              <StatusOk>Rotate the solid, read surface area and volume, then unfold a net that does not overlap.</StatusOk>
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}
