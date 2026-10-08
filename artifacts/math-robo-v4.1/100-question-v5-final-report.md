# Ruhi 100-question v5-final report

Passed 74/100; failed 26.

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
    "passed": 71,
    "total": 101,
    "percent": 70.29702970297029
  },
  "pronouns": {
    "passed": 35,
    "total": 53,
    "percent": 66.0377358490566
  },
  "followUp": {
    "passed": 8,
    "total": 11,
    "percent": 72.72727272727273
  },
  "ambiguity": {
    "passed": 5,
    "total": 10,
    "percent": 50
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

- **Move it right 4.**: INTENT_FAILURE: expected action MOVE Actual: move circle.
- **No, left.**: INTENT_FAILURE: expected action MOVE Actual: move circle.
- **Rotate it 30 degrees.**: INTENT_FAILURE: expected action ROTATE Actual: rotate circle.
- **Actually make that 45.**: INTENT_FAILURE: expected action ROTATE Actual: rotate circle.
- **Use the first line.**: INTENT_FAILURE: expected action SELECT Actual: Selected line.
- **No, the other one.**: INTENT_FAILURE: expected action SELECT Actual: Selected line.
- **Delete it.**: INTENT_FAILURE: expected action DELETE Actual: Deleted line.
- **Actually undo that.**: INTENT_FAILURE: expected action UNDO Actual: Undid the last Ruhi action.
- **Delete the circle.**: INTENT_FAILURE: expected action DELETE; FOLLOWUP_FAILURE: missing clarification or changed geometry Actual: Several objects match. Which object? 1: C1; 2: C2; 3: C3
- **the second one**: INTENT_FAILURE: expected action DELETE Actual: Deleted circle.
- **Move the line.**: INTENT_FAILURE: expected action MOVE; FOLLOWUP_FAILURE: missing clarification or changed geometry Actual: Several objects match. Which object? 1: AB; 2: CD
- **the red one**: INTENT_FAILURE: expected action MOVE Actual: Several objects match. Which object? 1: AB; 2: CD
- **Make it perpendicular.**: FOLLOWUP_FAILURE: missing clarification or changed geometry Actual: Which reference line should it be perpendicular to? Give its name.
- **Draw the diagonal.**: INTENT_FAILURE: expected action CREATE; FOLLOWUP_FAILURE: missing clarification or changed geometry Actual: Which diagonal: 1 (first to third vertex), or 2 (second to fourth vertex)?
- **the first one**: INTENT_FAILURE: expected action CREATE Actual: Created 2D line.
- **Make these parallel.**: FOLLOWUP_FAILURE: missing clarification or changed geometry Actual: Choose two lines to make parallel.
- **Use that point.**: INTENT_FAILURE: expected action SELECT Actual: No matching object exists. Create it first.
- **Delete everything.**: INTENT_FAILURE: expected action DELETE Actual: Cleared Robo scene objects.
- **What is the midpoint of AB?**: INTENT_FAILURE: expected action FIND; SUBACTION_FAILURE: expected MIDPOINT Actual: midpoint = [3,3].
- **What is the slope?**: INTENT_FAILURE: expected action FIND; SUBACTION_FAILURE: expected SLOPE Actual: slope = 1 units.
