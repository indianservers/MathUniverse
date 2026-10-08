# Ruhi 100-question iteration-1 report

Passed 88/100; failed 12.

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
    "passed": 89,
    "total": 101,
    "percent": 88.11881188118812
  },
  "pronouns": {
    "passed": 45,
    "total": 53,
    "percent": 84.90566037735849
  },
  "followUp": {
    "passed": 7,
    "total": 11,
    "percent": 63.63636363636363
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

- **Draw a ray starting at (2,2) and passing through (5,6).**: INTENT_FAILURE: unsupported; MISSING_MUTATION: no geometry change Actual: UNSUPPORTED: CREATE:RAY is not available.
- **Where does it cross the x-axis?**: INTENT_FAILURE: invalid Actual: x_intercept is not applicable to line.
- **Where does it cross the y-axis?**: INTENT_FAILURE: invalid Actual: y_intercept is not applicable to line.
- **radius 4**: INTENT_FAILURE: invalid Actual: radius is not applicable to triangle.
- **to line BC**: INTENT_FAILURE: ambiguous Actual: Through which point? Give coordinates.
- **Make it bigger.**: INTENT_FAILURE: ambiguous Actual: What scale factor should I use?
- **Twice as big.**: INTENT_FAILURE: ambiguous Actual: What scale factor should I use?
- **No, the other one.**: MISSING_MUTATION: no geometry change Actual: Please name the other object so I can correct the target.
- **the red one**: INTENT_FAILURE: ambiguous Actual: Several objects match. Which object? 1: AB; 2: CD
- **Use that point.**: INTENT_FAILURE: invalid Actual: No matching object exists. Create it first.
- **Delete everything.**: MISSING_MUTATION: no geometry change Actual: Cleared Robo scene objects.
- **What's the distance from that point to the origin?**: INTENT_FAILURE: ambiguous Actual: This operation needs two existing objects.
- **Are they still tangent?**: INTENT_FAILURE: ambiguous Actual: Select two objects or specify their names.
