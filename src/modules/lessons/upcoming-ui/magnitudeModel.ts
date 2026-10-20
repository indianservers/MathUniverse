export type MagnitudeRule = 'nearest' | 'classroom';
export const magnitudeThreshold = (rule: MagnitudeRule) => rule === 'nearest' ? Math.sqrt(10) : 5;
export function magnitudeExponent(coefficient: number, exponent: number, rule: MagnitudeRule = 'nearest') {
  if (!Number.isFinite(coefficient) || coefficient <= 0 || !Number.isInteger(exponent)) throw new Error('Use a positive coefficient and a whole-number exponent.');
  const shift = Math.floor(Math.log10(coefficient));
  const normalized = coefficient / 10 ** shift;
  return exponent + shift + (normalized >= magnitudeThreshold(rule) - 1e-12 ? 1 : 0);
}
export const scaleObjects = [
  { id: 'galaxy', name: 'Nearest large galaxy', short: 'Galaxy', coefficient: 2.5, exponent: 22, sprite: 0, group: 'Universe', detail: 'Andromeda is about 2.5 million light years away. Light travels about 9.46 × 10¹⁵ meters in a year.' },
  { id: 'earth', name: 'Earth’s diameter', short: 'Earth', coefficient: 1.3, exponent: 7, sprite: 1, group: 'Earth', detail: 'Earth is roughly 12,742 kilometers across, or 1.27 × 10⁷ meters.' },
  { id: 'human', name: 'Height of a human', short: 'Human', coefficient: 1.8, exponent: 0, sprite: 2, group: 'Human scale', detail: 'An adult height of 1.8 meters is close to the meter scale.' },
  { id: 'ant', name: 'Length of an ant', short: 'Ant', coefficient: 1, exponent: -2, sprite: 3, group: 'Human scale', detail: 'This example ant is 1 centimeter long: 0.01 meter. Actual ant species vary in size.' },
  { id: 'cell', name: 'Size of a cell', short: 'Cell', coefficient: 1, exponent: -5, sprite: 4, group: 'Small things', detail: 'A representative cell is about 10 micrometers across: 10⁻⁵ meter. Cells come in many sizes.' },
  { id: 'molecule', name: 'Size of a molecule', short: 'Molecule', coefficient: 3, exponent: -10, sprite: 5, group: 'Small things', detail: 'A water molecule spans roughly 0.3 nanometer. The illustration is a schematic model.' },
  { id: 'atom', name: 'Size of an atom', short: 'Atom', coefficient: 1, exponent: -10, sprite: 6, group: 'Small things', detail: 'A typical atomic length scale is 0.1 nanometer, or 10⁻¹⁰ meter. Orbit lines are schematic.' },
] as const;
export const worldExamples = [
  { name: 'Mount Everest height', display: '8,849 m', coefficient: 8.849, exponent: 3, sprite: 0, detail: 'The summit’s height above sea level is about nine thousand meters.' },
  { name: 'Distance to Moon', display: '384,400 km', coefficient: 3.844, exponent: 8, sprite: 1, detail: 'Average center-to-center distance. Convert kilometers to meters before comparing.' },
  { name: 'Distance to Sun', display: '149.6 million km', coefficient: 1.496, exponent: 11, sprite: 2, detail: 'One astronomical unit is approximately 1.496 × 10¹¹ meters.' },
  { name: 'Diameter of Milky Way', display: '≈ 100,000 light years', coefficient: 9.46, exponent: 20, sprite: 3, detail: 'A representative diameter is about 10²¹ meters; its exact boundary depends on the definition.' },
  { name: 'Size of a virus', display: '100 nm', coefficient: 1, exponent: -7, sprite: 4, detail: 'A representative virus diameter. 100 nanometers = 10⁻⁷ meter; viruses vary in size.' },
  { name: 'Earth’s diameter', display: '12,742 km', coefficient: 1.2742, exponent: 7, sprite: 5, detail: 'There are 1,000 meters in a kilometer, so the diameter is about 10⁷ meters.' },
];
