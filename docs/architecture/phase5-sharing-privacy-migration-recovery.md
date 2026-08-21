# Sharing, privacy, migration and recovery

Share documents record schema/engine versions, capabilities, licenses, provenance, definitions, seeds, dataset provenance, curriculum references, warnings and privacy settings. Learner progress and private dataset metadata are excluded by default. Deterministic checksums detect corruption; import reports missing capabilities.

Phase 5 state schema version 1 stores universal nodes, linked views, camera, accuracy profile and generation. Legacy `{objects: [...]}` state migrates without replacing mathematical definitions. Unknown or damaged schemas are quarantined with diagnostics. Existing Phase 1–4 document migrations remain unchanged.

Remote transport, authentication, encrypted backup and collaborative conflict resolution are outside this local-first implementation.

