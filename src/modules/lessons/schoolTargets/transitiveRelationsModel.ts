export type Node = "a" | "b" | "c";
export type Pair = `${Node},${Node}`;
export const nodes: Node[] = ["a", "b", "c"];
export const key = (a: Node, b: Node): Pair => `${a},${b}`;
export const initial: Pair[] = ["a,b", "b,c"];
export type Witness = { a: Node; b: Node; c: Node; missing: Pair };

export function findWitnesses(relation: Set<Pair>): Witness[] {
  const seen = new Set<Pair>();
  return nodes
    .flatMap((a) =>
      nodes.flatMap((b) => nodes.map((c) => ({ a, b, c, missing: key(a, c) }))),
    )
    .filter(
      (w) =>
        relation.has(key(w.a, w.b)) &&
        relation.has(key(w.b, w.c)) &&
        !relation.has(w.missing),
    )
    .filter((w) => {
      if (seen.has(w.missing)) return false;
      seen.add(w.missing);
      return true;
    });
}
export function closureOf(relation: Set<Pair>) {
  const result = new Set(relation);
  let changed = true;
  while (changed) {
    changed = false;
    nodes.forEach((a) =>
      nodes.forEach((b) =>
        nodes.forEach((c) => {
          if (
            result.has(key(a, b)) &&
            result.has(key(b, c)) &&
            !result.has(key(a, c))
          ) {
            result.add(key(a, c));
            changed = true;
          }
        }),
      ),
    );
  }
  return result;
}


export const positions: Record<Node,[number,number]>={a:[70,115],b:[230,115],c:[390,115]};
export function edgePath(a:Node,b:Node,relation:Set<Pair>,implied=false){
 const [x,y]=positions[a], [xx,yy]=positions[b];
 if(a===b)return `M${x-12} ${y-21} C${x-65} ${y-105},${x+65} ${y-105},${x+12} ${y-21}`;
 const dx=xx-x,dy=yy-y,l=Math.hypot(dx,dy),sign=Math.sign(dx);
 const bend=implied ? 110 : l>200 ? 95*sign : relation.has(key(b,a)) ? 28 : 0;
 return `M${x+dx/l*25} ${y+dy/l*25} Q${(x+xx)/2-dy/l*bend} ${(y+yy)/2+dx/l*bend} ${xx-dx/l*28} ${yy-dy/l*28}`;
}
