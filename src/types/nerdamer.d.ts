declare module "nerdamer" {
  type NerdamerExpression = { toString: () => string; text: () => string; evaluate: () => NerdamerExpression };
  type NerdamerStatic = {
    (expression: string): NerdamerExpression;
    solve: (equation: string, variable: string) => NerdamerExpression;
  };
  const nerdamer: NerdamerStatic;
  export default nerdamer;
}

declare module "nerdamer/Algebra";
declare module "nerdamer/Calculus";
declare module "nerdamer/Solve";
