export type FocusRect = { id: string; left: number; top: number; width: number; height: number };
export type FocusDirection = "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown";

export function nextDirectionalFocus(current: FocusRect, candidates: FocusRect[], direction: FocusDirection) {
  const center = (item: FocusRect) => ({ x: item.left + item.width / 2, y: item.top + item.height / 2 });
  const origin = center(current);
  return candidates
    .filter((item) => item.id !== current.id)
    .map((item) => {
      const point = center(item);
      const dx = point.x - origin.x;
      const dy = point.y - origin.y;
      const valid = direction === "ArrowLeft" ? dx < 0 : direction === "ArrowRight" ? dx > 0 : direction === "ArrowUp" ? dy < 0 : dy > 0;
      const primary = direction === "ArrowLeft" || direction === "ArrowRight" ? Math.abs(dx) : Math.abs(dy);
      const secondary = direction === "ArrowLeft" || direction === "ArrowRight" ? Math.abs(dy) : Math.abs(dx);
      return { item, valid, score: primary + secondary * 2.5 };
    })
    .filter((candidate) => candidate.valid)
    .sort((a, b) => a.score - b.score)[0]?.item ?? null;
}
