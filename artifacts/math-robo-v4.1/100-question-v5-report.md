# Ruhi 100-question v5 report

Passed 98/100; failed 2.

Real browser submission, committed workspace snapshots and working memory captured for every turn.

## Metrics

```json
{
  "standalone": {
    "passed": 25,
    "total": 25,
    "percent": 100
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
    "passed": 10,
    "total": 11,
    "percent": 90.9090909090909
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

- **Twice as big.**: INTENT_FAILURE: expected action SCALE; INTENT_FAILURE: invalid; MISSING_MUTATION: no geometry change Actual: Please clarify the request before I change any objects.
- **What stayed the same?**: INTENT_FAILURE: ambiguous Actual: Do you mean the current page topic, the previous concept, or a selected object?
