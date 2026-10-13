type Pair = [string, string];
export function orderClosure(elements: string[], edges: Pair[]): Pair[] {
  const matrix = elements.map(a=>elements.map(b=>a===b || edges.some(([x,y])=>x===a&&y===b)));
  for(let k=0;k<elements.length;k++) for(let i=0;i<elements.length;i++) for(let j=0;j<elements.length;j++) matrix[i][j] ||= matrix[i][k] && matrix[k][j];
  return elements.flatMap((a,i)=>elements.filter((_,j)=>matrix[i][j]).map(b=>[a,b] as Pair));
}
