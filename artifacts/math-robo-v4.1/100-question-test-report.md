# Ruhi 100-question orchestration-final report

Passed 98/100; failed 2.

Real browser submission, committed workspace snapshots and working memory captured for every turn.

## Metrics

```json
{
  "standalone": {
    "passed": 23,
    "total": 25,
    "percent": 92
  },
  "conversation": {
    "passed": 101,
    "total": 101,
    "percent": 100
  },
  "pronouns": {
    "passed": 53,
    "total": 53,
    "percent": 100
  },
  "followUp": {
    "passed": 11,
    "total": 11,
    "percent": 100
  },
  "ambiguity": {
    "passed": 10,
    "total": 10,
    "percent": 100
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

- **Draw a ray starting at (2,2) and passing through (5,6).**: INTENT_FAILURE: unsupported; MISSING_MUTATION: no geometry change; VERIFICATION_FAILURE: A plain line is not a ray or directed vector Actual: UNSUPPORTED: CREATE:RAY is not available.
- **Create a vector from (1,1) to (4,5).**: INTENT_FAILURE: unsupported; MISSING_MUTATION: no geometry change; VERIFICATION_FAILURE: A plain line is not a ray or directed vector Actual: UNSUPPORTED: CREATE:VECTOR is not available.
