import type { StudioLearningCopy, StudioMockupPage } from "./studioMockupCatalog";

const loop = (observe: string, understand: string, why: string, tryText: string, challenge: string): StudioLearningCopy => ({
  observe, understand, why, try: tryText, challenge,
});

type ModePack = {
  learning: StudioLearningCopy;
  challenge: { prompt: string; expected: number; hint: string };
};

const PACK: Record<string, Record<string, ModePack>> = {
  identities: {
    Pythagorean: { learning: loop("Watch sin²θ + cos²θ stay 1.", "The radius of the unit circle is identically 1.", "x² + y² = 1 on the circle.", "Spin θ and read the sum.", "Confirm the identity at 40°."), challenge: { prompt: "sin²θ + cos²θ = ?", expected: 1, hint: "Unit circle radius." } },
    "Angle Sum": { learning: loop("See two adjacent angles on the circle.", "sin(θ+φ) = sinθ cosφ + cosθ sinφ.", "Projection of a sum is a combination of projections.", "Change φ and watch the formula.", "Compute sin(30°+60°)."), challenge: { prompt: "sin(30°+60°) = ?", expected: 1, hint: "sin 90° = 1." } },
    "Double Angle": { learning: loop("Compare the θ ray with the 2θ ray.", "sin 2θ = 2 sinθ cosθ.", "Double angle is the sum with φ = θ.", "Slide θ and read 2 sinθ cosθ.", "sin(2×45°) = ?"), challenge: { prompt: "sin(2×45°) = ?", expected: 1, hint: "2θ = 90°." } },
    "Half Angle": { learning: loop("Halve the central angle.", "sin(θ/2) comes from the half-angle formula.", "A half turn on the circle is θ/2.", "Try θ = 90°.", "sin(90°/2) = ?"), challenge: { prompt: "sin(90°/2) = ? Enter √2/2", expected: Math.SQRT1_2, hint: "sin 45° = √2/2." } },
    "Product-Sum": { learning: loop("Two waves multiply as a sum of sines.", "2 sinθ cosφ is a sum-to-product identity.", "Products become sums for easier integration.", "Set φ = θ.", "2 sin(30°) cos(30°) = ?"), challenge: { prompt: "2 sin(30°) cos(30°) = ?", expected: Math.sqrt(3) / 2, hint: "Equals sin 60°." } },
  },
  graphs: {
    Sine: { learning: loop("Watch the sine wave start at 0.", "Amplitude A and B set height and period.", "Sine is the y-projection of the circle.", "Change B to 2.", "Period of sin(2x) in π units? Enter 1 for π."), challenge: { prompt: "Period of sin(2x) in π units? Enter 1 for π.", expected: 1, hint: "Period is 2π/|B|." } },
    Cosine: { learning: loop("Cosine starts at A, not 0.", "cos x = sin(x + π/2).", "A phase shift turns sine into cosine.", "Compare with the sine tab.", "cos 0 = ?"), challenge: { prompt: "cos(0) = ?", expected: 1, hint: "Cosine is 1 on the x-axis." } },
    Tangent: { learning: loop("Spot the vertical asymptotes.", "tan = sin/cos, undefined where cos = 0.", "Period is π, not 2π.", "Move B and watch the breaks.", "tan(45°) = ?"), challenge: { prompt: "tan(45°) = ?", expected: 1, hint: "Opposite equals adjacent." } },
    Transformations: { learning: loop("Gray dashed curve is the parent.", "A, B, C, D stretch and shift.", "Each parameter is a geometric move.", "Set D to 0.5.", "Can you pass through (0, 1.5)?"), challenge: { prompt: "If D = 0.5, the midline is?", expected: 0.5, hint: "Midline is D." } },
    Comparison: { learning: loop("All three parents share the axes.", "sin and cos are shifts; tan is a ratio.", "Same circle, three graphs.", "Toggle which curve is bold.", "How many of these have range [−1,1]?"), challenge: { prompt: "How many of sin, cos, tan have range [−1, 1]?", expected: 2, hint: "Tangent is unbounded." } },
  },
  inverse: {
    Arcsin: { learning: loop("Stay inside [−1, 1].", "arcsin returns [−π/2, π/2].", "Principal branch undoes sine.", "Set x = 1.", "arcsin(1) in degrees?"), challenge: { prompt: "arcsin(1) in degrees?", expected: 90, hint: "Sine of 90° is 1." } },
    Arccos: { learning: loop("arccos range is [0, π].", "arccos(1) = 0, arccos(−1) = π.", "The principal cosine inverse is the top semicircle.", "Try x = 0.", "arccos(0) in degrees?"), challenge: { prompt: "arccos(0) in degrees?", expected: 90, hint: "Cosine is 0 at 90°." } },
    Arctan: { learning: loop("Arctan accepts every real x.", "Range is (−π/2, π/2).", "It undoes tangent on the principal branch.", "Try x = 1.", "arctan(1) in degrees?"), challenge: { prompt: "arctan(1) in degrees?", expected: 45, hint: "tan 45° = 1." } },
    "Principal Values": { learning: loop("The shaded band is the principal range.", "Inverses must be functions, so we cut the range.", "Without a branch, the inverse is multi-valued.", "Move x across 0.", "Principal arcsin(0) in degrees?"), challenge: { prompt: "Principal arcsin(0) in degrees?", expected: 0, hint: "Sine of 0 is 0." } },
    Compositions: { learning: loop("On [−1, 1], sin(arcsin x) = x.", "The graph is the line y = x.", "Outside the domain the composition is undefined.", "Slide x and stay on the line.", "sin(arcsin(0.5)) = ?"), challenge: { prompt: "sin(arcsin(0.5)) = ?", expected: 0.5, hint: "Composition undoes on the domain." } },
  },
  oblique: {
    "Sine Law": { learning: loop("a / sin A stays equal to b / sin B.", "Sides are proportional to opposite sines.", "The circumdiameter is 2R = a / sin A.", "Change C and compare the three ratios.", "If A = B, then a = ? relative to b (enter 1 if equal)."), challenge: { prompt: "If A = B, a/b = ?", expected: 1, hint: "Equal angles, equal sides." } },
    "Cosine Law": { learning: loop("c² uses the included angle C.", "Cosine law generalizes Pythagoras.", "When C = 90°, it becomes a² + b² = c².", "Set C near 90°.", "If C = 90° and a = b = 1, c² = ?"), challenge: { prompt: "If C=90° and a=b=1, c² = ?", expected: 2, hint: "Pythagoras." } },
    Area: { learning: loop("The purple fill is (1/2)ab sin C.", "Included angle turns two sides into area.", "sin C is the height factor.", "Widen C.", "Area of SAS a=2, b=2, C=90°?"), challenge: { prompt: "Area of SAS triangle a=2, b=2, included 90°?", expected: 2, hint: "(1/2)ab sin C." } },
    "SSA Ambiguous Case": { learning: loop("Count how many triangles appear.", "Height h = b sin C; compare a with h and b.", "SSA is not a congruence shortcut.", "Lower a until a triangle vanishes.", "How many triangles if a = h?"), challenge: { prompt: "How many SSA triangles if a = h?", expected: 1, hint: "One right triangle." } },
    "Solve Triangle": { learning: loop("Read all three sides and angles.", "SAS determines a unique triangle.", "Angle sum is 180°.", "Solve for side c.", "Angle sum in degrees?"), challenge: { prompt: "Angle sum of a triangle (degrees)?", expected: 180, hint: "Euclidean triangle." } },
  },
  waves: {
    "Simple Wave": { learning: loop("One sine traces a pure tone.", "Amplitude and frequency set loudness and pitch.", "Circular motion projects to a wave.", "Change f1.", "If A1 = 1, peak is?"), challenge: { prompt: "If A1 = 1, the peak of y1 is?", expected: 1, hint: "Amplitude is the peak." } },
    Superposition: { learning: loop("Gold is the sum of the two waves.", "Superposition adds ordinates at each t.", "Interference is just addition.", "Match amplitudes.", "If both peaks are 1 in phase, sum peak?"), challenge: { prompt: "Two in-phase peaks of 1 add to?", expected: 2, hint: "Constructive interference." } },
    Harmonics: { learning: loop("The second wave is 2·f1.", "Integer multiples are harmonics.", "A tone is a stack of harmonics.", "Raise A2.", "f2 / f1 for the 2nd harmonic?"), challenge: { prompt: "Second harmonic: f2/f1 = ?", expected: 2, hint: "Double the frequency." } },
    Beats: { learning: loop("Close frequencies create a slow envelope.", "Beat frequency is |f2 − f1|.", "The ear hears the envelope as beats.", "Keep f2 near f1.", "Beat frequency for 10 Hz and 12 Hz?"), challenge: { prompt: "Beat frequency for 10 Hz and 12 Hz?", expected: 2, hint: "|f1 − f2|." } },
    Phase: { learning: loop("Shift the second wave without changing f.", "Phase is a horizontal slide.", "Same frequency, different starting angle.", "Move the phase slider.", "Phase 0 means they start together: enter 0."), challenge: { prompt: "Phase difference when waves start together?", expected: 0, hint: "Zero phase." } },
  },
  applications: {
    "Heights & Distances": { learning: loop("The dashed line is the line of sight.", "H = d tan θ + eye height.", "Tangent is opposite over adjacent.", "Raise θ.", "Height if tan(45°)=h/10 with adjacent 10?"), challenge: { prompt: "Height if tan(45°)=h/10 with adjacent 10?", expected: 10, hint: "tan 45° = 1." } },
    Bearings: { learning: loop("The compass needle is the bearing from north.", "Bearings are clockwise from north.", "A heading plus a distance locates a point.", "Spin the bearing.", "A full compass turn in degrees?"), challenge: { prompt: "A full compass turn in degrees?", expected: 360, hint: "One full turn." } },
    Navigation: { learning: loop("Two bearings meet at a fix.", "Intersection of two rays locates the ship.", "A bearing is a directed ray.", "Move both headings.", "How many bearings to fix a point (enter 2)?"), challenge: { prompt: "How many bearings fix a point?", expected: 2, hint: "Two rays intersect once." } },
    Surveying: { learning: loop("The baseline is measured on the ground.", "Two angles from a known base solve the triangle.", "This is SAS/ASA in the field.", "Lengthen the baseline.", "If both angles are 45° and base is 10, the peak height is?"), challenge: { prompt: "Isosceles 45-45 with base 10: height?", expected: 5, hint: "Height is half the base for 45-45-90? Wait — for 45-45-90 height = base/2." } },
    "Periodic Models": { learning: loop("The tide is a sine in time.", "Periodic models reuse A, B, C, D.", "Waves describe repeating real data.", "Change phase.", "A sine's midline offset if D = 1.4?"), challenge: { prompt: "If the tide offset D = 1.4, midline is?", expected: 1.4, hint: "Midline is D." } },
  },
  ar: {
    "Height Measurement": { learning: loop("Aim at the top of the building.", "h = d tan θ.", "Similar triangles in the camera.", "Hold the angle steady.", "If elevation is 45° and distance is 8, height is?"), challenge: { prompt: "If angle of elevation is 45° and distance is 8, height is?", expected: 8, hint: "tan 45° = 1." } },
    Distance: { learning: loop("The cyan tape is ground distance.", "Distance is the adjacent side.", "Scale the overlay to a known length.", "Stretch d.", "If tan θ = 1 and h = 10, d = ?"), challenge: { prompt: "If tan θ = 1 and h = 10, d = ?", expected: 10, hint: "d = h / tan θ." } },
    Angle: { learning: loop("The protractor reads elevation.", "Angle is recovered from the camera pitch.", "θ is the same in similar triangles.", "Change θ.", "A right angle in degrees?"), challenge: { prompt: "A right angle in degrees?", expected: 90, hint: "Quarter turn." } },
    "Triangle Overlay": { learning: loop("The overlay triangle matches the scene.", "Similarity maps camera to world.", "Corresponding angles are equal.", "Resize the overlay.", "Similar triangles have equal angles: enter 1 if true."), challenge: { prompt: "Do similar triangles have equal angles? Enter 1 for yes.", expected: 1, hint: "Yes." } },
    "Unit Circle": { learning: loop("The circle is projected into the scene.", "Camera space still has radius 1 in math.", "AR is a similar copy of the model.", "Spin θ from the studio bar.", "Radius of the unit circle?"), challenge: { prompt: "Radius of the unit circle?", expected: 1, hint: "By definition, 1." } },
    "Wave Projection": { learning: loop("A sine rides the horizon line.", "The same θ drives the wave.", "Projection links circle, graph, and AR.", "Watch the gold wave.", "sin(90°) = ?"), challenge: { prompt: "sin(90°) = ?", expected: 1, hint: "Top of the circle." } },
  },
};

export function trigModeLearning(page: StudioMockupPage, mode?: string): StudioLearningCopy {
  if (!mode) return page.learning;
  return PACK[page.id]?.[mode]?.learning ?? page.learning;
}

export function trigModeChallenge(page: StudioMockupPage, mode?: string) {
  if (!mode) return page.challenge;
  return PACK[page.id]?.[mode]?.challenge ?? page.challenge;
}

export function searchHits(labs: StudioMockupPage[], query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [] as Array<{ key: string; label: string; to: string; detail: string }>;
  const hits: Array<{ key: string; label: string; to: string; detail: string }> = [];
  for (const lab of labs) {
    const blob = `${lab.label} ${lab.title} ${lab.description}`.toLowerCase();
    if (blob.includes(needle)) hits.push({ key: lab.id, label: lab.label, to: lab.route, detail: "Lab" });
    for (const item of lab.modes) {
      if (item.toLowerCase().includes(needle) || blob.includes(needle) && item.toLowerCase().includes(needle.split(" ")[0] ?? "")) {
        if (item.toLowerCase().includes(needle)) {
          hits.push({
            key: `${lab.id}-${item}`,
            label: item,
            to: `${lab.route}?mode=${encodeURIComponent(item)}`,
            detail: lab.label,
          });
        }
      }
    }
  }
  const seen = new Set<string>();
  return hits.filter((hit) => {
    if (seen.has(hit.key)) return false;
    seen.add(hit.key);
    return true;
  });
}

export function trigPathId(pageId: string, mode: string | null) {
  if (pageId === "graphs") return "functions";
  if (pageId === "waves") return "waves";
  if (pageId === "unit-circle") {
    if (!mode || mode === "Angles") return "angles";
    return "circle";
  }
  return "";
}
