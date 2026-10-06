export const TAU = Math.PI * 2;
export function orbit(theta: number, cx = 420, cy = 205, radius = 119) {
  return { x: Math.cos(theta), y: Math.sin(theta), px: cx + radius * Math.cos(theta), py: cy - radius * Math.sin(theta) };
}
export function wavePath(theta: number, cosine = false, start = 610, length = 295, amplitude = 68, baseline = 205) {
  return Array.from({ length: 151 }, (_, i) => {
    const t = i / 150;
    const y = baseline - amplitude * (cosine ? Math.cos(theta - t * TAU * 1.65) : Math.sin(theta - t * TAU * 1.65));
    return `${i ? 'L' : 'M'}${(start + t * length).toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');
}
