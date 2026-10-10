type Tick = (elapsed: number, delta: number) => void;
const active = new Set<Tick>();
let frame = 0, last = 0, elapsed = 0;
function tick(now: number) {
  frame = 0;
  const delta = Math.min(50, last ? now - last : 16.67);
  last = now;
  elapsed += delta;
  active.forEach(fn => fn(elapsed / 1000, delta / 1000));
  if (active.size && !document.hidden) frame = requestAnimationFrame(tick);
}
function start() {
  if (!frame && active.size && !document.hidden) { last = 0; frame = requestAnimationFrame(tick); }
}
function visibility() {
  if (document.hidden) { cancelAnimationFrame(frame); frame = 0; last = 0; }
  else start();
}
export function subscribeAnimation(fn: Tick) {
  if (!active.size) document.addEventListener("visibilitychange", visibility);
  active.add(fn);
  start();
  return () => {
    active.delete(fn);
    if (!active.size) {
      cancelAnimationFrame(frame); frame = 0; last = 0;
      document.removeEventListener("visibilitychange", visibility);
    }
  };
}
