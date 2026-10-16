/** Read-only proximity questions with an explicit coordinate tuple. */
export function nearestPointCoordinates(raw: string): number[] | undefined {
  const text = raw.toLowerCase().trim().replace(/[?!]+$/, '').replace(/−/g, '-')
    .replace(/^(?:please|kindly|can you|could you)\s+/, '').replace(/\s+please$/, '');
  const number = '[+-]?(?:\\d+(?:\\.\\d+)?|\\.\\d+)';
  const tuple = `(${number}\\s*,\\s*${number}(?:\\s*,\\s*${number})?)`;
  const match = text.match(new RegExp(`^(?:(?:what|which) (?:point|points) (?:is|are) (?:near(?:est)?|closest)(?: to)?|(?:what|which) (?:is|are) (?:the )?(?:nearest|closest) points?(?: to)?|(?:find|identify|show|tell me|give me) (?:the )?(?:nearest|closest) points?(?: to)?|(?:nearest|closest) points?(?: to)?)\\s+(?:the (?:coordinates?|position)\\s+)?(?:\\(${tuple}\\)|${tuple})(?:\\s+(?:on the board|now))?$`));
  if (!match) return;
  const coordinates = (match[1] ?? match[2]).split(',').map(Number);
  return coordinates.every(Number.isFinite) ? coordinates : undefined;
}
