/** Compass construction: the chord of an angle on a circle of radius r. */
export function angleChord(angle: number, radius: number) {
  return 2 * radius * Math.sin((angle * Math.PI) / 360);
}

/** Null means the compass circles cannot intersect. */
export function angleFromChord(chord: number, radius: number) {
  if (radius <= 0 || chord < 0 || chord > 2 * radius) return null;
  return (2 * Math.asin(chord / (2 * radius)) * 180) / Math.PI;
}
