import "d3-random";

declare module "d3-random" {
  interface RandomBinomial {
    (n: number, p: number): () => number;
  }
}
