from pathlib import Path
p=Path('src/modules/set-theory/premium/VennCanvas.tsx');s=p.read_text().replace('  type PointerEvent,','  type PointerEvent,\n  type CSSProperties,');s=s.replace('className={`st-venn-frame ${compact ? "compact" : ""}`}','className={`st-venn-frame ${compact ? "compact" : ""}`}\n        style={{"--vu-selection":selectionColor} as CSSProperties}')
s=s.replace('<Button onClick={() => setZoom((z) => Math.min(2, z + 0.15))}>','<Button disabled={zoom>=2} onClick={() => setZoom((z) => Math.min(2, z + 0.15))}>')
s=s.replace('<Button onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}>','<Button disabled={zoom<=.6} onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}>')
s=s.replace('                setZoom(1);\n                setCircles(defaultCircles);\n                setPositions(null);','                setZoom(1);')
p.write_text(s)
p=Path('src/modules/set-theory/premium/VennClarity.tsx');s=p.read_text().replace('type="range"','type="range"\n              aria-valuetext={`${Math.round(c.r)} diagram units`}').replace('Amber inspection and purple result shading have different roles.','Inspection glow and purple result shading have different roles.').replace('Amber = inspected region','Glow = inspected region');p.write_text(s)
