# Phase 3 mastery, review and certification

## Local-first mastery

Mastery records scored attempts—not route visits—with seed, correctness, score, hints, time, difficulty, misconceptions, retention, assessment type, independent/assisted completion and date. Confidence discounts hints and assisted work, accounts for difficulty/retention, requires independent successes for strong states, and becomes review-due after elapsed time. States are not started, emerging, developing, proficient, secure and review due.

Remediation deterministically selects the leading misconception or low independent confidence, checks one prerequisite, recommends a targeted explanation and easier activity, reassesses with a different seed, then returns to the original pathway. The UI reports no mastery or recommendation when evidence is absent. Save/resume uses versioned local JSON and persists seeds/answers without creating page-visit evidence.

## Review workflow

Transitions are enforced: scaffold → draft → SME → teacher → assessment → accessibility → QA → approved → certified. Returning to draft and retirement are explicit. Invalid jumps throw. Approval requires genuine mathematics SME, board teacher and QA approvals; identities, timestamps, decisions and source versions are stored. Source change reopens the lesson. Admin bypass is not implemented.

## Certification

Certification fails closed and reports per-dimension states rather than one blended score. It checks official units/chapters/outcomes, source verification/expiry, lesson/practice/assessment links, approved lesson workflow, genuine unexpired reviewer roles and engine capabilities. Results include blockers, warnings, missing outcomes/evidence/reviewers, expired sources, unsupported dependencies and dates.

Current result: zero certified courses. Every pathway correctly fails because sources are not human-verified, mappings are incomplete, content is not approved, or genuine reviewers are unavailable. This is the expected truthful outcome.
