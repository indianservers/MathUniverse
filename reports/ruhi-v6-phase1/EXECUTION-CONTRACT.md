# Phase 1 execution and verification contracts

The authoritative outcome is ExecutionOutcome in src/math-foundation/executionOutcome.ts. Legacy KernelResult.status, EngineResult.verificationStatus and RoboResult.status remain compatibility adapters for existing callers and frozen benchmarks. A legacy verified_exact label is not evidence for the new verified outcome.

| Execution status | Meaning |
|---|---|
| verified | Independent mathematical certificate passed; read evidence.level to distinguish exact algebra from numerical consistency. |
| valid_unverified | Completed operation; independent mathematical evidence unavailable. Includes ordinary scene/style operations and unsupported certificate classes. |
| invalid_input | Malformed syntax, nonfinite arguments, domain contradiction, missing or invalid parameters. Ambiguity additionally has a structured clarification. |
| unsupported | Capability or method unavailable in the selected engine/workspace. |
| cancelled | Abort requested; transport capacity released; stale orchestration replies cannot update specialist history. |
| timeout | Time or capacity budget exhausted; retry is permitted. |
| internal_error | Worker/adapter exception or independently contradicted result. |

Evidence levels: exact_symbolic, exact_geometric_invariant, numerical_consistency, not_independently_verified, contradicted. The exact geometric category is reserved; current scene-coordinate certificates use floating coordinates and therefore numerical_consistency. Sampling is not a symbolic proof.

Independent kernel verifier uses separately implemented BigInt rational accumulation and cross-products, sparse multivariate coefficient identities, coefficient differentiation, derivative checks for polynomial antiderivatives, and coefficient integration plus exact bound substitution for definite polynomial integrals. Decimal certificates bound error with exact fractions. Modulo verifies congruence and canonical residue interval; base conversion reconstructs the input integer. Solver functions and MathValue evaluator are not rerun by these certificates; the bounded parser/AST is shared. Unsupported transcendental, root, equation-solution and geometry-kernel classes remain valid_unverified. Restricting assumptions prevent an unqualified polynomial non-equivalence certificate.

Worker envelopes are {requestId,payload}; replies are {requestId,result}. Pools retain at most two active workers, recycle successful workers for fewer than 32 jobs, and retire idle workers after 60 seconds. Default deadline 20 seconds includes startup; explicit transport deadlines must be positive, finite and <=120 seconds. Mismatched IDs are ignored. Constructor, clone, timeout, abort and malformed-reply exits settle once and release capacity. The no-Worker fallback guards aborts before and after computation but cannot interrupt synchronous JavaScript; browser workers remain the bounded execution path.

SemanticEngine.execute serializes direct scene requests, accepts optional signal/timeoutMs/requestId, checks aborts around native effects and uses the original adapter for rollback. Cancellation waits for an in-flight native adapter call to settle before returning and allowing the next queued request; an adapter that never settles remains an unresolved limitation. EngineRouter guards controller ownership before writing its recent results, last result or notebook. Cancelling a specialist request does not certify its answer.

ClarificationRequirement carries kind, question, slots, references, candidates and requestId. Triangle side requests need length plus an explicit anchoring/constraint policy. No missing endpoint or angle is supplied by the transcript harness.
