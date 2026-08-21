# Math Universe Portable File Format

Status: schema version 1 · application version 1.0.1 · 2026-08-20

## Purpose and media types

Math Universe uses UTF-8 JSON inside two application-specific extensions. Ordinary editable work is stored as `.mathworkspace` with MIME type `application/vnd.mathapp.workspace`; authored activities are stored as `.mathlesson` with MIME type `application/vnd.mathapp.lesson`. The content is self-contained, browser-portable and does not depend on local-storage identifiers or machine paths.

The current representation is plain JSON so it can be generated and inspected by future authoring tools. A ZIP container is deliberately not used in version 1; thumbnails are safe base64 image data URLs. Readers must identify a file from its internal header and workspace metadata, never its filename alone.

## Top-level schema

```ts
type PortableMathFile = {
  fileHeader: {
    magic: "MATHAPP_PORTABLE_FILE";
    fileKind: "workspace" | "lesson";
    fileExtension: ".mathworkspace" | ".mathlesson";
    mimeType: "application/vnd.mathapp.workspace" | "application/vnd.mathapp.lesson";
    schemaVersion: number;
    minimumReaderVersion: string;
    createdByApp: "Math Universe";
    createdByAppVersion: string;
  };
  workspace: {
    type: "2d-geometry" | "3d-geometry" | "cas" | "2d-graph" | "3d-graph";
    typeLabel: string;
    engine: string;
    engineVersion: string;
  };
  document: {
    id: string;
    title: string;
    description: string;
    author: { name: string; organization: string };
    createdAt: string;
    updatedAt: string;
    language: string;
    tags: string[];
    difficulty: "beginner" | "intermediate" | "advanced" | "mixed";
    gradeLevel: string[];
    subject: "Mathematics";
    topic: string;
    estimatedDurationMinutes: number;
  };
  preview: {
    thumbnailIncluded: boolean;
    thumbnailDataUrl?: string;
    objectCount: number;
    expressionCount: number;
    hasSolution: boolean;
  };
  scene: unknown;
  lesson?: PortableLesson;
  metadata: Record<string, unknown>;
  integrity: { algorithm: "SHA-256"; contentHash: string };
};
```

The `fileKind`, extension and MIME fields must form a valid pair. A lesson must contain `lesson`, and `lesson.workspaceType` must equal `workspace.type`. Unknown optional top-level and metadata fields are retained by the parser when the document is opened and handed to application code.

## Scene adapters

`scene` is engine-owned but JSON-safe. The shared file layer never evaluates scene text.

| Type | Engine scene payload |
|---|---|
| `2d-geometry` | `workspaceSnapshot` containing construction objects, constraints, styles, geometry settings, locks, images and construction protocol |
| `3d-geometry` | `workspaceSnapshot` containing base solid/surface settings, transforms, added/deleted objects, materials, visibility, camera preset and animation settings |
| `cas` | `workspaceSnapshot`, notebook cells, assumptions, exact/numeric mode, selected cell and composer state; inputs are recalculated through the safe CAS engine on import |
| `2d-graph` | `workspaceSnapshot` with plots/results/data/settings plus named linked slider parameters and their ranges |
| `3d-graph` | surface list, variable sliders, ranges, resolution, axes/grid, slice, reference object, object/camera position, analysis point, theme and project style |

Each route supplies `serializeScene`, `deserializeScene`, `validateScene`, `getImageTarget` and `getSceneSummary`. New object types should be optional, bounded JSON records with stable IDs and explicit type discriminators. An adapter must ignore a safe unknown optional field or reject an unsupported required type before mutating live state.

## Lesson schema and opening modes

A `PortableLesson` contains title/subject/workspace/topic metadata, learning objectives, prerequisites, instructions, at least zero or more hints, checkpoints, solution steps, expected result, teacher notes, scoring fields, tags, `initialScene`, `solutionScene`, and `openMode`.

- Practice and Guided modes load only `initialScene` into the workspace.
- Solution and Teacher modes load `solutionScene`.
- A checkpoint stores an ID, title, instruction, scene and declarative validation-rule strings.
- Local lesson files are not examination-secure: a technically capable recipient can inspect solution JSON.

The top-level `scene` in a lesson is the initial scene. This prevents a generic scene loader from revealing the completed solution by default.

## Integrity algorithm

1. Deep-clone the complete document.
2. Set `integrity` to `{ "algorithm": "SHA-256", "contentHash": "" }`.
3. Serialize using recursively sorted object keys; retain array order and normal JSON primitive encoding.
4. Compute SHA-256 over UTF-8 bytes.
5. Store the lowercase 64-character hexadecimal digest in `contentHash`.

Readers validate the hash before applying a scene. A missing hash is accepted only as a legacy-compatible warning; a non-empty mismatched hash is rejected.

## Validation and security profile

The version-1 reader enforces a 25 MiB encoded-file limit, 5,000 scene-object limit, 40-level nesting limit, 200,000-character per-string limit, bounded arrays and 100,000 inspected JSON nodes. It rejects `__proto__`, `prototype` and `constructor` keys, malformed JSON, missing mandatory fields, conflicting lesson types, unsupported workspace values, inconsistent headers, unsupported newer schemas and a `minimumReaderVersion` newer than the running app.

No `eval`, `Function`, script execution, arbitrary HTML insertion or filesystem extraction is performed. CAS cells are length-limited and re-evaluated by the symbolic notebook engine. Imported 2D slider names and numeric ranges are normalized before storage. Thumbnails are limited to 2 MB and only accept base64 PNG, JPEG, WebP or SVG data URLs; they are rendered as image sources, not injected markup.

## Versioning and migration policy

`schemaVersion` governs the envelope; `workspace.engineVersion` governs an engine scene. Version 1 is the first public schema, so there is no older public payload to transform. `migratePortableFile` is the single migration boundary. Future releases must add pure, sequential migrations such as `migrateV1ToV2` and `migrateV2ToV3`, test every supported path, preserve unknown optional metadata, and calculate a fresh integrity hash only after an authorized re-export. A reader must reject a newer unsupported schema without partially restoring it.

## Filenames and platform integration

Default filenames normalize Unicode, lowercase text, convert runs of unsupported characters to hyphens, strip path punctuation and cap the descriptive portion at 90 characters before appending `-{workspace.type}` and the official extension. The PWA manifest registers both media types and routes an operating-system open action back to the importing application. Browser file pickers, drag-and-drop validation, downloads and Blob MIME types use the same constants.

## Image export strategy

Image files are separate from portable scene files. The image service captures the adapter-selected mathematical viewport or scrollable worksheet, composites canvas/SVG/HTML labels using `html2canvas`, applies transparent/white/dark background, and renders at 1×, 2× or 4×. It limits output to 120 million pixels, yields before work, previews the resulting Blob, and revokes URLs/disposes temporary canvases. PNG is standard; JPEG uses quality 0.94. Copy uses the Clipboard API and sharing uses Web Share files, with download fallbacks.

## Reference files

Five signed examples are in `public/sample-lessons`: triangle circumcenter, cube diagonals, quadratic CAS verification, parabola sliders, and the surface `z = sin(x)cos(y)`. Regenerate them with `node scripts/generate-portable-samples.mjs`; the generator uses the same canonical hashing algorithm.
