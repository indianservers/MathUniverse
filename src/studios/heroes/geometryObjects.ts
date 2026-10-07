type Context = CanvasRenderingContext2D;

export const geometryObjectNames = ['Sphere', 'Cone', 'Cylinder', 'Pyramid', 'Octahedron', 'Hexagon', 'Ellipse', 'Spiral', 'Angle', 'Compass'] as const;

// Small sculptures share a stage, but each demonstrates a different geometric motion.
export function drawGeometryObjects(c: Context, time: number) {
  const colors = ['#36d9ff', '#aa72ff', '#ffc66a', '#7cf2c7'];
  geometryObjectNames.forEach((name, index) => {
    const x = 100 + (index % 5) * 135;
    const y = index < 5 ? 43 : 276;
    const t = time * .55 + index * .8;
    const color = colors[index % colors.length];
    c.save();
    c.translate(x, y + Math.sin(t) * 3);
    c.strokeStyle = color; c.fillStyle = color; c.lineWidth = 1.4;
    c.shadowColor = color; c.shadowBlur = 7;
    const path = (points: number[][], close = false) => {
      c.beginPath(); points.forEach(([a, b], i) => i ? c.lineTo(a, b) : c.moveTo(a, b));
      if (close) c.closePath(); c.stroke();
    };
    const ellipse = (a: number, b: number, rx: number, ry: number, rotation = 0) => {
      c.beginPath(); c.ellipse(a, b, rx, ry, rotation, 0, Math.PI * 2); c.stroke();
    };
    const project = ([a, b, z]: number[]) => [a * Math.cos(t) + z * Math.sin(t), b + .35 * (-a * Math.sin(t) + z * Math.cos(t))];
    if (name === 'Sphere') {
      ellipse(0, 0, 22, 22); ellipse(0, 0, 22, 7);
      ellipse(0, 0, 3 + 18 * Math.abs(Math.cos(t)), 22);
      c.beginPath(); c.arc(22 * Math.cos(t), 7 * Math.sin(t), 2.5, 0, Math.PI * 2); c.fill();
    } else if (name === 'Cone') {
      const tip = 5 * Math.sin(t);
      ellipse(0, 15, 22, 7); path([[-22, 15], [tip, -23], [22, 15]]);
      path([[tip, -23], [22 * Math.cos(t), 15 + 7 * Math.sin(t)]]);
    } else if (name === 'Cylinder') {
      const spread = 17 + 3 * Math.sin(t);
      ellipse(0, -spread, 20, 6); ellipse(0, spread, 20, 6);
      path([[-20, -spread], [-20, spread]]); path([[20, -spread], [20, spread]]);
      path([[20 * Math.cos(t), -spread + 6 * Math.sin(t)], [20 * Math.cos(t), spread + 6 * Math.sin(t)]]);
    } else if (name === 'Pyramid' || name === 'Octahedron') {
      const level = name === 'Octahedron' ? 0 : 12;
      const base = [[-19, level, -19], [19, level, -19], [19, level, 19], [-19, level, 19]].map(project);
      const tip = project([0, -25, 0]); path(base, true);
      base.forEach(p => path([p, tip]));
      if (name === 'Octahedron') {
        const lower = project([0, 25, 0]); base.forEach(p => path([p, lower]));
      }
    } else if (name === 'Hexagon') {
      c.rotate(t * .35); path(Array.from({length: 6}, (_, k) => [23 * Math.cos(k * Math.PI / 3), 23 * Math.sin(k * Math.PI / 3)]), true);
      path([[-23, 0], [23, 0]]); path([[-11.5, -19.9], [11.5, 19.9]]);
    } else if (name === 'Ellipse') {
      const a = 25, b = 12 + 3 * Math.sin(t), f = Math.sqrt(a * a - b * b);
      ellipse(0, 0, a, b);
      const p = [a * Math.cos(t), b * Math.sin(t)]; path([[-f, 0], p, [f, 0]]);
      [-f, f].forEach(a => { c.beginPath(); c.arc(a, 0, 2, 0, Math.PI * 2); c.fill(); });
    } else if (name === 'Spiral') {
      c.rotate(t * .25);
      path(Array.from({length: 100}, (_, k) => { const a = k / 99 * Math.PI * 4, r = 2 + k / 99 * 21; return [r * Math.cos(a), r * Math.sin(a)]; }));
    } else if (name === 'Angle') {
      const a = .6 + (1 + Math.sin(t)) * .55;
      path([[25, 17], [-20, 17], [-20 + 43 * Math.cos(a), 17 - 43 * Math.sin(a)]]);
      c.beginPath(); c.arc(-20, 17, 17, -a, 0); c.stroke();
    } else {
      const spread = 12 + 6 * (1 + Math.sin(t));
      path([[-spread, 22], [0, -24], [spread, 22]]);
      ellipse(0, -24, 3, 3); ellipse(0, 24, spread, 5);
      path([[-spread * .55, 2], [spread * .55, 2]]);
    }
    c.restore(); c.save(); c.globalAlpha *= .8; c.fillStyle = '#a7c9ec';
    c.font = '11px system-ui'; c.textAlign = 'center'; c.fillText(name, x, y + 39); c.restore();
  });
}
