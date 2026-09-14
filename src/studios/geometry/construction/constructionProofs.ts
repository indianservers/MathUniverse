import { dist, nearly, pointOnLine } from "./constructionMath";
import { detectRelations, isPointKind, type GeomObject, type World } from "./constructionEngine";

export type ProofStep = {
  id: string;
  text: string;
  objectIds: string[];
};

export type ProofCase = {
  id: string;
  theorem: string;
  goal: string;
  given: string[];
  property: string;
  reasoning: string;
  conclusion: string;
  constructed: boolean;
  steps: ProofStep[];
};

export function buildProofs(objects: GeomObject[], world: World): ProofCase[] {
  const cases: ProofCase[] = [];
  const byId = new Map(objects.map((o) => [o.id, o]));
  const labels = (ids: string[]) => ids.map((id) => byId.get(id)?.label ?? id);

  for (const obj of objects) {
    if (obj.kind !== "perpBisector") continue;
    const line = world[obj.id]?.line;
    if (!line || obj.parents.length < 2) continue;
    const [aId, bId] = obj.parents;
    const A = world[aId!]?.point;
    const B = world[bId!]?.point;
    if (!A || !B) continue;
    const onLine = objects.filter((p) => isPointKind(p.kind) && p.id !== aId && p.id !== bId && world[p.id]?.point && pointOnLine(world[p.id]!.point!, line) && !(p.kind === "midpoint" && p.parents.includes(aId!) && p.parents.includes(bId!)));
    for (const P of onLine) {
      const Q = world[P.id]!.point!;
      const equal = nearly(dist(Q, A), dist(Q, B));
      const PA = objects.find((o) => o.kind === "segment" && o.parents.includes(P.id) && o.parents.includes(aId!));
      const PB = objects.find((o) => o.kind === "segment" && o.parents.includes(P.id) && o.parents.includes(bId!));
      cases.push({
        id: `perp-bisector-${obj.id}-${P.id}`,
        theorem: "Perpendicular bisector theorem",
        goal: `${P.label}${byId.get(aId!)?.label} = ${P.label}${byId.get(bId!)?.label}`,
        given: [
          `${obj.label} is constructed as the perpendicular bisector of ${labels([aId!, bId!]).join("")}.`,
          `${P.label} lies on ${obj.label}.`,
        ],
        property: "Any point on the perpendicular bisector of a segment is equidistant from the segment's endpoints.",
        reasoning: `Therefore ${P.label} is equidistant from ${byId.get(aId!)?.label} and ${byId.get(bId!)?.label}.`,
        conclusion: equal ? "✓ Proven" : "Not currently equidistant (check parents).",
        constructed: true,
        steps: [
          { id: "s1", text: `${byId.get(aId!)?.label} and ${byId.get(bId!)?.label} define segment ${labels([aId!, bId!]).join("")}.`, objectIds: [aId!, bId!] },
          { id: "s2", text: `${obj.label} is the perpendicular bisector of ${labels([aId!, bId!]).join("")}.`, objectIds: [obj.id, aId!, bId!] },
          { id: "s3", text: `${P.label} lies on ${obj.label}.`, objectIds: [P.id, obj.id] },
          { id: "s4", text: "Any point on a perpendicular bisector is equidistant from the segment endpoints.", objectIds: [obj.id, P.id, aId!, bId!] },
          { id: "s5", text: `Therefore ${P.label}${byId.get(aId!)?.label} = ${P.label}${byId.get(bId!)?.label}.`, objectIds: [PA?.id, PB?.id, P.id, aId!, bId!].filter(Boolean) as string[] },
        ],
      });
    }
  }

  for (const obj of objects) {
    if (obj.kind !== "midpoint") continue;
    const M = world[obj.id]?.point;
    const A = world[obj.parents[0] ?? ""]?.point;
    const B = world[obj.parents[1] ?? ""]?.point;
    if (!M || !A || !B) continue;
    cases.push({
      id: `mid-${obj.id}`,
      theorem: "Midpoint definition",
      goal: `${byId.get(obj.parents[0]!)?.label}${obj.label} = ${obj.label}${byId.get(obj.parents[1]!)?.label}`,
      given: [`${obj.label} is constructed as the midpoint of ${labels(obj.parents).join("")}.`],
      property: "A midpoint splits a segment into two congruent parts and lies on the segment.",
      reasoning: `${obj.label} is collinear with the endpoints and equidistant from them.`,
      conclusion: "✓ Proven",
      constructed: true,
      steps: [
        { id: "m1", text: `Segment ${labels(obj.parents).join("")} was constructed.`, objectIds: obj.parents },
        { id: "m2", text: `${obj.label} is the midpoint.`, objectIds: [obj.id, ...obj.parents] },
        { id: "m3", text: `${labels([obj.parents[0]!]).join("")}${obj.label} = ${obj.label}${labels([obj.parents[1]!]).join("")}.`, objectIds: [obj.id, ...obj.parents] },
      ],
    });
  }

  for (const obj of objects) {
    if (obj.kind !== "circleCP" && obj.kind !== "circleCR") continue;
    const circle = world[obj.id]?.circle;
    if (!circle) continue;
    const on = objects.filter((p) => isPointKind(p.kind) && world[p.id]?.point && nearly(dist(world[p.id]!.point!, circle.center), circle.r));
    if (on.length >= 2) {
      const [p1, p2] = on;
      const centerId = obj.parents[0];
      cases.push({
        id: `radii-${obj.id}-${p1!.id}-${p2!.id}`,
        theorem: "Radii of a circle",
        goal: `${byId.get(centerId ?? "")?.label ?? "O"}${p1!.label} = ${byId.get(centerId ?? "")?.label ?? "O"}${p2!.label}`,
        given: [`${p1!.label} and ${p2!.label} lie on circle ${obj.label}.`],
        property: "All radii of a circle are equal.",
        reasoning: "Each radius is the distance from the centre to a point on the circle.",
        conclusion: "✓ Proven",
        constructed: true,
        steps: [
          { id: "r1", text: `${obj.label} is a circle.`, objectIds: [obj.id] },
          { id: "r2", text: `${p1!.label} and ${p2!.label} lie on ${obj.label}.`, objectIds: [obj.id, p1!.id, p2!.id] },
          { id: "r3", text: "Radii of the same circle are equal.", objectIds: [obj.id, p1!.id, p2!.id, centerId ?? obj.id] },
        ],
      });
    }
  }

  const observed = detectRelations(objects, world).filter((r) => r.kind === "observed");
  if (observed.length && !cases.length) {
    cases.push({
      id: "observed-only",
      theorem: "Numerical observation",
      goal: observed[0]!.text,
      given: ["No constructed theorem applies yet."],
      property: "Approximate equality within measurement tolerance is not a proof.",
      reasoning: observed.map((r) => r.text).join(" "),
      conclusion: "Observed only — not proven",
      constructed: false,
      steps: observed.map((r, i) => ({ id: `o${i}`, text: `Observed: ${r.text}`, objectIds: r.objectIds })),
    });
  }
  return cases;
}

export function cannotMoveMessage(obj: GeomObject, objects: GeomObject[]) {
  if (obj.kind === "freePoint") return null;
  const parents = obj.parents.map((id) => objects.find((o) => o.id === id)?.label ?? id);
  if (obj.kind === "intersection") {
    return `${obj.label} cannot be moved freely. ${obj.label} is defined as the intersection of ${parents.join(" and ")}. Move the parent objects instead.`;
  }
  if (obj.kind === "midpoint") {
    return `${obj.label} cannot be moved freely. ${obj.label} is the midpoint of ${parents.join("")}. Move the endpoints instead.`;
  }
  if (obj.kind === "pointOnObject") {
    return `${obj.label} is constrained to its parent object. Drag along the parent, or move the parent.`;
  }
  return `${obj.label} is a dependent object. Change its parents to move it.`;
}

export function validatePerpBisectorChallenge(objects: GeomObject[], world: World) {
  const A = objects.find((o) => o.label === "A");
  const B = objects.find((o) => o.label === "B");
  if (!A || !B) return { ok: false, detail: "Need points A and B." };
  const a = world[A.id]?.point;
  const b = world[B.id]?.point;
  if (!a || !b) return { ok: false, detail: "A or B is undefined." };
  const bisectors = objects.filter((o) => o.kind === "perpBisector" || o.kind === "line" || o.kind === "perp");
  const hit = bisectors.find((o) => {
    const line = world[o.id]?.line;
    if (!line) return false;
    const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const onMid = pointOnLine(mid, line);
    const perp = Math.abs(line.dir.x * ab.x + line.dir.y * ab.y) < 0.08 * Math.hypot(ab.x, ab.y);
    return onMid && perp;
  });
  if (!hit) return { ok: false, detail: "No line through the midpoint of AB and perpendicular to AB." };
  return { ok: true, detail: `${hit.label} is a perpendicular bisector of AB.` };
}
