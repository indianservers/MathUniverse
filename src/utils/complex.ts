export type Complex = { a: number; b: number };

export function complexMagnitude(a: number, b: number) {
  return Math.hypot(a, b);
}

export function complexAngle(a: number, b: number) {
  return Math.atan2(b, a);
}

export function complexToPolar(a: number, b: number) {
  return { r: complexMagnitude(a, b), theta: complexAngle(a, b) };
}

export function complexMultiply(z1: Complex, z2: Complex): Complex {
  return {
    a: z1.a * z2.a - z1.b * z2.b,
    b: z1.a * z2.b + z1.b * z2.a,
  };
}

export function eulerPoint(theta: number): Complex {
  return { a: Math.cos(theta), b: Math.sin(theta) };
}
