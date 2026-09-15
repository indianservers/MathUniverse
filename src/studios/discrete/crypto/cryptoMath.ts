export function caesar(text: string, shift: number) {
  return [...text].map((ch) => {
    const base = ch >= "A" && ch <= "Z" ? 65 : ch >= "a" && ch <= "z" ? 97 : 0;
    if (!base) return ch;
    return String.fromCharCode(base + (((ch.charCodeAt(0) - base + shift) % 26) + 26) % 26);
  }).join("");
}

export function letterFreq(text: string) {
  const counts = Array.from({ length: 26 }, () => 0);
  [...text.toUpperCase()].forEach((ch) => {
    const i = ch.charCodeAt(0) - 65;
    if (i >= 0 && i < 26) counts[i] = (counts[i] ?? 0) + 1;
  });
  return counts;
}

export function affine(text: string, a: number, b: number) {
  return [...text].map((ch) => {
    const base = ch >= "A" && ch <= "Z" ? 65 : 0;
    if (!base) return ch;
    const x = ch.charCodeAt(0) - base;
    return String.fromCharCode(base + (a * x + b) % 26);
  }).join("");
}

export function vigenere(text: string, key: string) {
  const k = key.toUpperCase().replace(/[^A-Z]/g, "") || "A";
  let j = 0;
  return [...text].map((ch) => {
    if (!/[A-Za-z]/.test(ch)) return ch;
    const shift = (k.charCodeAt(j % k.length) - 65);
    j += 1;
    return caesar(ch, shift);
  }).join("");
}

export function toyHash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function avalancheBits(a: string, b: string) {
  const ha = parseInt(toyHash(a), 16);
  const hb = parseInt(toyHash(b), 16);
  let x = ha ^ hb, n = 0;
  while (x) { n += x & 1; x >>>= 1; }
  return n;
}

export function modPow(base: number, exp: number, mod: number) {
  let result = 1, b = ((base % mod) + mod) % mod, e = exp;
  const trail = [result];
  while (e > 0) {
    if (e % 2 === 1) result = (result * b) % mod;
    b = (b * b) % mod;
    e = Math.floor(e / 2);
    trail.push(result);
  }
  return { value: result, trail };
}

export function modInverse(a: number, m: number) {
  let [oldR, r] = [((a % m) + m) % m, m];
  let [oldS, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return oldR === 1 ? ((oldS % m) + m) % m : 1;
}

export function dhMix(secretA: number, secretB: number, g: number, p: number) {
  const A = modPow(g, secretA, p).value;
  const B = modPow(g, secretB, p).value;
  return { A, B, shared: modPow(B, secretA, p).value };
}
