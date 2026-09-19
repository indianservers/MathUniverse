import { useState } from "react";
import { Link } from "react-router-dom";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { LiveRow, Panel, SliderRow, StatusOk, fmt } from "../../mockup/studioLabKit";
import { Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import { SolidKind, StudioMath3D } from "../../shared/studioMath3D";

const SHAPE: Record<string, { href: string; label: string; formula: string }> = {
  Cylinders: { href: "/shapes?shape=cylinder", label: "Cylinder", formula: "V = πr²h" },
  Cones: { href: "/shapes?shape=cone", label: "Cone", formula: "V = ⅓πr²h" },
  Spheres: { href: "/shapes?shape=sphere", label: "Sphere", formula: "V = ⁴⁄₃πr³" },
  Nets: { href: "/shapes?shape=cube", label: "Cube net", formula: "Unfold without overlap" },
  "Cross-sections": { href: "/shapes?shape=cylinder", label: "Cross-section", formula: "Plane ∩ solid" },
};

function solidMeasures(kind: string, r: number, h: number) {
  if (kind === "Spheres") {
    return { V: (4 / 3) * Math.PI * r ** 3, SA: 4 * Math.PI * r ** 2 };
  }
  if (kind === "Cones") {
    const slant = Math.hypot(r, h);
    return { V: (1 / 3) * Math.PI * r * r * h, SA: Math.PI * r * r + Math.PI * r * slant };
  }
  if (kind === "Nets") {
    const s = r;
    return { V: s ** 3, SA: 6 * s * s };
  }
  return { V: Math.PI * r * r * h, SA: 2 * Math.PI * r * r + 2 * Math.PI * r * h };
}

export default function SolidsStudioLab({ page }: { page: StudioMockupPage }) {
  const [r, setR] = useState(1);
  const [h, setH] = useState(2);
  return (
    <Phase1LabChrome page={page}>
      {(mode) => {
        const spec = SHAPE[mode] ?? SHAPE.Cylinders!;
        const measures = solidMeasures(mode, r, h);
        const needsHeight = mode !== "Spheres";
        return (
          <>
            <Panel title={mode}>
              <p className="msk-note">Solid geometry uses the same Three.js engine as Linear Algebra. Orbit the solid, then open Shapes Explorer for nets and measurements.</p>
              <SliderRow label={mode === "Nets" ? "Side s" : "Radius r"} value={r} min={0.4} max={3} step={0.05} onChange={setR} />
              {needsHeight ? <SliderRow label="Height h" value={h} min={0.4} max={4} step={0.05} onChange={setH} /> : null}
              <Link className="msk-cta" to={spec.href}>Open {spec.label} in Shapes Explorer</Link>
            </Panel>
            <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
              <StudioMath3D label={mode}>
                <SolidKind kind={mode} />
              </StudioMath3D>
              <p className="msk-formula">{spec.formula}</p>
            </section>
            <aside className="msk-panel msk-live">
              <LiveRow color="#147df2" label="Opens" value={spec.href} />
              <LiveRow color="#8b45f4" label="Volume V" value={fmt(measures.V, 3)} />
              <LiveRow color="#f59e0b" label="Surface area SA" value={fmt(measures.SA, 3)} />
              <StatusOk>Rotate the solid, read surface area and volume, then unfold a net that does not overlap.</StatusOk>
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}
