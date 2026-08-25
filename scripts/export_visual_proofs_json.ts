import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { visualProofCategories } from "../src/visual-proofs/data/visualProofCategories";
import { visualProofsIndex } from "../src/visual-proofs/data/visualProofsIndex";

const outputPath = resolve("exports/visual-proofs-detailed.json");
const categoryBySlug = new Map(
  visualProofCategories.map((category) => [category.slug, category]),
);

const payload = {
  metadata: {
    title: "Math Universe Visual Proof Catalog",
    description:
      "Detailed export of every visual proof registered in the application.",
    totalVisualProofs: visualProofsIndex.length,
    totalCategories: visualProofCategories.length,
    sourceFiles: [
      "src/visual-proofs/data/visualProofsIndex.ts",
      "src/visual-proofs/data/visualProofCategories.ts",
    ],
  },
  categories: visualProofCategories.map((category) => ({
    ...category,
    actualProofCount: visualProofsIndex.filter(
      (proof) => proof.categorySlug === category.slug,
    ).length,
  })),
  visualProofs: visualProofsIndex.map((proof, index) => ({
    catalogNumber: index + 1,
    ...proof,
    category: categoryBySlug.get(proof.categorySlug) ?? null,
  })),
};

if (payload.metadata.totalVisualProofs !== 223) {
  throw new Error(
    `Expected 223 visual proofs, found ${payload.metadata.totalVisualProofs}.`,
  );
}

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(
  `Exported ${payload.metadata.totalVisualProofs} visual proofs to ${outputPath}`,
);
