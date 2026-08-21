import { readFile } from "node:fs/promises";

const registry = await readFile(new URL("../src/truth-layer/registry.ts", import.meta.url), "utf8");
const mappingIds = [...registry.matchAll(/id: "(legacy-|path-)[^"]+"/g)].map((match) => match[0].slice(5, -1));
const capabilityIds = [...registry.matchAll(/id: "(universal-|exact-|reactive-|native-)[^"]+"/g)].map((match) => match[0].slice(5, -1));
const certified = (registry.match(/status: "CERTIFIED"/g) ?? []).length;
const report = { source: "src/truth-layer/registry.ts", curriculumMappings: mappingIds.length, capabilityEntries: capabilityIds.length, certifiedMappings: certified, note: "Counts are parsed from registry records; no percentage is inferred." };
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
