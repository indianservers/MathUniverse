# Ruhi 100-question iteration-2 report

Passed 97/100; failed 3.

Real browser submission, committed workspace snapshots and working memory captured for every turn.

## Metrics

```json
{
  "standalone": {
    "passed": 24,
    "total": 25,
    "percent": 96
  },
  "conversation": {
    "passed": 99,
    "total": 101,
    "percent": 98.01980198019803
  },
  "pronouns": {
    "passed": 53,
    "total": 53,
    "percent": 100
  },
  "followUp": {
    "passed": 9,
    "total": 11,
    "percent": 81.81818181818181
  },
  "ambiguity": {
    "passed": 9,
    "total": 10,
    "percent": 90
  },
  "readOnlySafety": {
    "total": 33,
    "unexpectedMutations": 0
  },
  "undo": {
    "passed": 3,
    "total": 3,
    "percent": 100
  }
}
```

## Limitations

- All 100 requested cases are 2D; no extrapolation to 3D.
- Supported default parameters may conflict with subsequent supplied follow-up assumptions.
- Numeric and geometry checks are explicit for points, circle parameters, dimensions, area invariance, perpendicular construction; remaining cases capture actual committed geometry for review.

## First 20 failures

- **Draw a ray starting at (2,2) and passing through (5,6).**: INTENT_FAILURE: unsupported; MISSING_MUTATION: no geometry change Actual: UNSUPPORTED: CREATE:RAY is not available.
- **through point A**: FOLLOWUP_FAILURE: missing clarification or changed geometry Actual: Perpendicular line created through the point.
- **to line BC**: INTENT_FAILURE: invalid; MISSING_MUTATION: no geometry change Actual: Please clarify the request before I change any objects.
