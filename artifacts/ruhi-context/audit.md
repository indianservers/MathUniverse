# Ruhi context intelligence: pre-change audit

Existing v4: 768 hashed lexical/bigram/trigram features plus numeric/coordinate flags and five workspace modes; 128/64 dense encoder; action, subaction, mode and object-type softmax heads. 116,893 parameters, 467,572 weight bytes. Saved held-out action accuracy 92.51%, subaction 91.90%; these are historical action benchmarks, not page-context evidence. The existing feature extractor does not take page knowledge, simulation values or recent dialogue, so identical words and workspace mode yield identical input on different pages.

Training uses reviewed semantic rows, template-group splits, guarded worker training, separate candidate persistence and publication gates. Public builds prohibit training APIs. Browser-only security is a distribution/build boundary, not strong administrator authentication against someone controlling their own browser.

Runtime caches loaded v4 weights, uses TensorFlow.js with tidy tensor disposal, validates native actions and verifies commits. Conversation engines retain bounded references/results; a shared specialist router spans workspace navigation. Existing character events represent thinking, answers, uncertainty and workspace actions.

Grounding sources: lessonCatalog/enrichLessonDefinition supplies real lesson routes/content/formulas; navSections and studio catalogs supply page discovery. Native PigeonholeLab uses ceilDivision/evenOccupancy and React studio state. GraphTheory exists; no standalone Data Structures page or tree-data-structure lab was found. Algorithm pages can supply a computing context, with the coverage distinction reported explicitly.

Decision: add a separate versioned RuhiContextNet, benchmark lightweight architectures on grouped held-out semantic templates, retain v4 unchanged. Use neural intent/meaning predictions to select grounded records, and expose narrowly validated simulation capabilities through the actual mounted page. Unknown topics and unsupported proofs must remain explicit. No competing drawing/calculation executor.
