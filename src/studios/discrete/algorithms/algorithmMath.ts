export function bubbleSortFrames(values: number[]) {
  const a = [...values];
  const frames: Array<{ arr: number[]; hi: number; note: string }> = [{ arr: [...a], hi: -1, note: "Start" }];
  for (let n = a.length; n > 1; n -= 1) {
    for (let j = 0; j < n - 1; j += 1) {
      const left = a[j] ?? 0;
      const right = a[j + 1] ?? 0;
      if (left > right) {
        a[j] = right;
        a[j + 1] = left;
      }
      frames.push({ arr: [...a], hi: j, note: `Compare ${left} and ${right}` });
    }
  }
  return frames;
}

export function mergeSortFrames(values: number[]) {
  const frames: Array<{ arr: number[]; lo: number; hi: number; note: string }> = [];
  const a = [...values];
  const merge = (lo: number, mid: number, hi: number) => {
    const left = a.slice(lo, mid);
    const right = a.slice(mid, hi);
    let i = 0, j = 0, k = lo;
    while (i < left.length && j < right.length) {
      const lv = left[i] ?? 0;
      const rv = right[j] ?? 0;
      if (lv <= rv) { a[k] = lv; i += 1; } else { a[k] = rv; j += 1; }
      k += 1;
      frames.push({ arr: [...a], lo, hi, note: `MergeSort merge [${lo}, ${hi})` });
    }
    while (i < left.length) { a[k] = left[i] ?? 0; i += 1; k += 1; frames.push({ arr: [...a], lo, hi, note: "Copy left" }); }
    while (j < right.length) { a[k] = right[j] ?? 0; j += 1; k += 1; frames.push({ arr: [...a], lo, hi, note: "Copy right" }); }
  };
  const sort = (lo: number, hi: number) => {
    if (hi - lo <= 1) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid, hi);
    merge(lo, mid, hi);
  };
  frames.push({ arr: [...a], lo: 0, hi: a.length, note: "Start MergeSort" });
  sort(0, a.length);
  return frames;
}

export function linearSearchSteps(values: number[], target: number) {
  return values.map((v, i) => ({ i, found: v === target, note: v === target ? `Hit at index ${i}` : `Check ${v}` }));
}

export function binarySearchSteps(values: number[], target: number) {
  const a = [...values].sort((x, y) => x - y);
  const steps: Array<{ lo: number; hi: number; mid: number; note: string }> = [];
  let lo = 0, hi = a.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    const v = a[mid] ?? 0;
    steps.push({ lo, hi, mid, note: v === target ? `Found ${target} at ${mid}` : v < target ? `${v} < ${target}` : `${v} > ${target}` });
    if (v === target) break;
    if (v < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return { sorted: a, steps };
}

export function euclidSteps(a: number, b: number) {
  const steps: Array<{ a: number; b: number }> = [];
  let x = Math.abs(a), y = Math.abs(b);
  while (y !== 0) {
    steps.push({ a: x, b: y });
    const r = x % y;
    x = y;
    y = r;
  }
  return { gcd: x, steps, count: steps.length };
}

export function complexitySample(n: number) {
  return { n, n2: n * n, nlog: n * Math.log2(Math.max(2, n)) };
}
