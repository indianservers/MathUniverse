/** Bounded measurement grammar; labels are resolved against the live scene. */
export function pointDistanceNames(raw: string): [string, string] | undefined {
  const text = raw.toLowerCase().trim().replace(/[?.!]+$/, '').replace(/^(?:please|kindly|can you|could you)\s+/, '').replace(/\s+please$/, '');
  if (!/^(?:(?:what(?:'s| is)|find|calculate|compute|measure|tell me|give me|work out|how far|how long|distance|length|separation|straight-line|straight line|euclidean)\b)/.test(text)) return;
  if (!/\b(?:distance|length|separation|far|long)\b/.test(text)) return;
  const label = '(?:point\\s+)?([a-z][a-z0-9_]*)';
  const pair = text.match(new RegExp(`\\b(?:from|between)\\s+(?:points?\\s+)?${label}\\s+(?:to|and)\\s+${label}(?:\\s+(?:apart|on the board|in units|now))?$`))
    ?? text.match(new RegExp(`^how far (?:is|are)\\s+${label}\\s+(?:from|and)\\s+${label}(?:\\s+apart)?$`));
  if (pair) return [pair[1], pair[2]];
  const segment = text.match(/\b(?:length|distance) (?:of )?(?:the )?(?:segment |line segment )?([a-z])([a-z])$/);
  if (segment) return [segment[1], segment[2]];
}
