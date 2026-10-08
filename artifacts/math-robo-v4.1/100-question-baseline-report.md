# Ruhi 100-question baseline report

Passed 67/100; failed 33.

Real browser submission, committed workspace snapshots and working memory captured for every turn.

## Metrics

```json
{
  "standalone": {
    "passed": 18,
    "total": 25,
    "percent": 72
  },
  "conversation": {
    "passed": 67,
    "total": 101,
    "percent": 66.33663366336634
  },
  "pronouns": {
    "passed": 35,
    "total": 53,
    "percent": 66.0377358490566
  },
  "followUp": {
    "passed": 5,
    "total": 11,
    "percent": 45.45454545454545
  },
  "ambiguity": {
    "passed": 8,
    "total": 10,
    "percent": 80
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

- **Put another point at -2, 5.**: INTENT_FAILURE: invalid; MISSING_MUTATION: no geometry change; VERIFICATION_FAILURE: expected new point -2,5 Actual: Please clarify the request before I change any objects.
- **Draw a line through those two points.**: INTENT_FAILURE: ambiguous Actual: What are the two endpoints? Give coordinates such as (0,0) and (4,2).
- **Draw a ray starting at (2,2) and passing through (5,6).**: INTENT_FAILURE: unsupported; MISSING_MUTATION: no geometry change Actual: UNSUPPORTED: CREATE:RAY is not available.
- **Graph y = x squared.**: INTENT_FAILURE: invalid; MISSING_MUTATION: no geometry change; ENTITY_EXTRACTION_FAILURE: squared expression missing Actual: Cannot build this object from those parameters.
- **put a dot at three comma minus two**: INTENT_FAILURE: invalid; MISSING_MUTATION: no geometry change; VERIFICATION_FAILURE: expected new point 3,-2 Actual: Please clarify the request before I change any objects.
- **line from zero zero to five five**: INTENT_FAILURE: ambiguous Actual: What are the two endpoints? Give coordinates such as (0,0) and (4,2).
- **plot x squared minus 4**: INTENT_FAILURE: invalid; MISSING_MUTATION: no geometry change; ENTITY_EXTRACTION_FAILURE: squared expression missing Actual: Cannot build this object from those parameters.
- **What is the distance between those two points?**: MATH_FAILURE: expected 5.0990195135927845 Actual: Distance = 5.09901951 units.
- **Find the slope of AB.**: MATH_FAILURE: expected 0.6666666666666666 Actual: slope = 0.66666667 units.
- **And its circumference?**: INTENT_FAILURE: invalid; MATH_FAILURE: expected 25.132741228718345 Actual: Please clarify the request before I change any objects.
- **Where does it cross the x-axis?**: INTENT_FAILURE: invalid Actual: No matching object exists. Create it first.
- **Where does it cross the y-axis?**: INTENT_FAILURE: invalid Actual: No matching object exists. Create it first.
- **Is this line horizontal?**: INTENT_FAILURE: unsupported Actual: UNSUPPORTED: CHECK:UNSUPPORTED is not available.
- **Where do they meet?**: INTENT_FAILURE: unsupported Actual: UNSUPPORTED: UNSUPPORTED:OBJECT is not available.
- **Mark that point.**: INTENT_FAILURE: ambiguous; VERIFICATION_FAILURE: expected new point 8,2 Actual: Where should I place the point? Give its coordinates.
- **Rotate the triangle.**: FOLLOWUP_FAILURE: missing clarification or changed geometry Actual: rotate triangle.
- **45 degrees**: INTENT_FAILURE: unhandled; MISSING_MUTATION: no geometry change Actual: Input did not match a currently supported solver intent.

Solver status: unsupported
Show solution steps
- **center 2,3**: INTENT_FAILURE: unsupported Actual: UNSUPPORTED: FIND:OBJECT is not available.
- **radius 4**: INTENT_FAILURE: invalid Actual: Please clarify the request before I change any objects.
- **to line BC**: INTENT_FAILURE: ambiguous Actual: Through which point? Give coordinates.
