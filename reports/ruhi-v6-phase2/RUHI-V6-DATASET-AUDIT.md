# Ruhi v6 dataset audit

Two separate candidate datasets are prepared. Context fitting uses `candidate-corpus.jsonl`; dialogue development uses `conversation-corpus-deduplicated.jsonl`. They are not merged into a neural holdout.

The context corpus has 6,528 rows, 204 distinct utterances, 102 authored base phrases and six family groups. Train/validation/calibration/holdout counts are 3,264/1,088/1,088/1,088. One family is wholly withheld per intent. Politeness variants remain in the same family. Duplicate full semantic inputs and exact historical context question overlap are rejected. Context vocabulary is existing reviewed page metadata; topic coverage is not newly unseen.

The dialogue generator declares expected statuses in advance, executes complete conversations through the actual engine and rejects an entire conversation if a status or required nonmutation differs. It covers drawing, styling, movement, relative dimensions, angles, constructions, measurements, proofs, ambiguity, follow-ups, multi-intent plans, misconceptions, negative dimensions, contradictions and bounded spelling errors. Numerically varied scenes are declared controlled variants, not new independent utterance families.

There are 1,824 raw dialogue rows in 456 conversations / 12 families. Canonical deduplication removes 214 repeated semantic contexts, leaving 1,610 dialogue candidates. Total reviewed-development candidates: **8,138**, counting 6,528 context rows and 1,610 dialogue rows. Count alone is not a quality metric.

`dataset-audit.json`, `conversation-corpus-audit.json` and `combined-corpus-audit.json` include hashes, provenance, partitions, exact exposed-input screening and caveats. 192 dialogue records with known regression utterances are explicitly labelled; dialogue development partitions must never be described as an unseen-human holdout. Only the separately partitioned context data is fitted into the isolated candidate.

No frozen100/NLP300 expectations or source datasets were modified. No new production weights are generated. Candidate label review is still needed before richer semantic-head fitting: command IR is produced by the engine, and successful status is not an independent proof of every geometric result. Focused construction tests provide independent coordinate checks for the declared scope.
