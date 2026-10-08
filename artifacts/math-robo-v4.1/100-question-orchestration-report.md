# Ruhi 100-question orchestration report

Passed 96/100; failed 4.

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
    "passed": 96,
    "total": 101,
    "percent": 95.04950495049505
  },
  "pronouns": {
    "passed": 51,
    "total": 53,
    "percent": 96.22641509433963
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
    "passed": 2,
    "total": 3,
    "percent": 66.66666666666667
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
- **Delete the first circle.**: INTENT_FAILURE: invalid; MISSING_MUTATION: no geometry change; VERIFICATION_FAILURE: Only first circle deleted Actual: A construction parent was removed. Undo its deletion or delete the dependent construction.
- **Move the second circle right another 2.**: INTENT_FAILURE: invalid; MISSING_MUTATION: no geometry change; VERIFICATION_FAILURE: Second circle at (12,0) Actual: Parent objects do not currently intersect.
- **Are they still tangent?**: VERIFICATION_FAILURE: Separated circles are not tangent Actual: Yes — tangent.
- **Delete the first circle.**: INTENT_FAILURE: invalid; MISSING_MUTATION: no geometry change Actual: A construction parent was removed. Undo its deletion or delete the dependent construction.
- **Actually undo that.**: UNDO_REDO_FAILURE: committed geometry does not match pre-action state Actual: Undid the last Ruhi action.
