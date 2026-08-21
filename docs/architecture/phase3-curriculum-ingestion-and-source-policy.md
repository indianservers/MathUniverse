# Phase 3 curriculum ingestion and official-source policy

Date: 2026-08-20. Formal mappings may use only the issuing authority's curriculum, syllabus, textbook, model paper, assessment blueprint, or circular. Search results, coaching sites, summaries, filenames, legacy tags, and app routes are discovery aids—not evidence.

## Pipeline

`CurriculumSourceRecord` stores authority, board, year, subject/course/paper/medium, HTTPS URL, document type, SHA-256 checksum, retrieval timestamp, effective dates, supersession, page count, ingestion version, and review state. `ingestCurriculumSource` validates immutable source metadata and stores ordered source sections with page/section, extraction confidence, parser state, and an audit event. Reviewer corrections create new audit events and never alter the original source record. Duplicate detection keys board + URL + checksum. Semantic comparison reports added, removed, and changed section IDs and whether bytes changed.

Parsing never certifies. Low-confidence sections are `HUMAN_REVIEW_REQUIRED`. A verified reviewer correction records reviewer identity and time. Any checksum/version change reopens dependent lesson and mapping records.

## Sources actually retrieved and hashed

| ID | Official PDF | Pages | SHA-256 | State |
|---|---|---:|---|---|
| CBSE-2026-27-IX-MATH | Class IX Mathematics | 13 | `932ea66d6fbfcefce8182f28ab921c886187f5dea674321088b5c7230bbe6c32` | Parsed; human review required for certification |
| CBSE-2026-27-IX-MATH-ADV | Class IX Mathematics Advanced | 97 | `24cb27010ff2c13832c58b3aaf4213537148a7396812982e34cb752e0a718cb4` | Human review required |
| CBSE-2026-27-X-MATH | Class X Mathematics | 10 | `d773e7c12b99e0bd498067e2b8268c76d0496bf9cad1c9e41c8652ab68b412a5` | Human review required |
| CBSE-2026-27-XI-XII-MATH | Classes XI–XII Mathematics | 12 | `5bf4105d4076189fe00b879fd6d41ffadec87a894a078a7fb912b2f219769572` | Human review required |
| CBSE-2026-27-XI-XII-APPLIED | Classes XI–XII Applied Mathematics | 19 | `3125b1b6b00d8081bff34a1276d5f5203daa719af961d943380b4b0cb9d35a70` | Human review required |

Class IX unit/marks structure and selected outcomes were normalized with PDF page references. The other four sources are ingested at document level and deliberately await structure review.

## Unavailable evidence

AP BIE's official model-paper and blueprint portals were found, but no safely retrievable official 2026–27 IA/IB/IIA/IIB syllabus document was available. Telangana BIE's official portal was found, but no checksumable syllabus/model-paper document was exposed. NCERT textbook/rationalised-content portals were found, but full Class 6–12 chapter-file hashing is incomplete. These pathways remain unmapped; no third-party substitution or AP-to-Telangana inference is permitted.

## Update operations

An annual job should retrieve known official URLs, hash bytes, compare against the active record, create a superseding source when changed, parse into a new immutable bundle, produce a semantic diff, reopen dependents, and queue human review. It must never silently mutate a verified source or retain certification after expiry/source change.
